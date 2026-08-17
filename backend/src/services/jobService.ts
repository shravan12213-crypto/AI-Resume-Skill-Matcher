// backend/src/services/jobService.ts
import { pool, query } from '../config/db';

export interface JobSkillInput {
  skill_id: number;
  is_required: boolean;
  minimum_experience?: number;
}

export interface CreateJobInput {
  recruiter_id: number;
  title: string;
  description?: string;
  location?: string;
  experience_required?: number;
  skills: JobSkillInput[];
}

export const getAllJobs = async (status?: string, search?: string) => {
  let sql = `
    SELECT 
      j.job_id,
      j.recruiter_id,
      r.company_name,
      j.title,
      j.description,
      j.location,
      j.experience_required,
      j.status,
      j.created_at,
      COUNT(js.skill_id) AS total_skills_count
    FROM jobs j
    JOIN recruiters r ON j.recruiter_id = r.recruiter_id
    LEFT JOIN job_skills js ON j.job_id = js.job_id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (status) {
    params.push(status);
    sql += ` AND j.status = $${params.length}`;
  }

  if (search) {
    params.push(`%${search}%`);
    sql += ` AND (j.title ILIKE $${params.length} OR j.description ILIKE $${params.length})`;
  }

  sql += `
    GROUP BY j.job_id, j.recruiter_id, r.company_name, j.title, j.description, j.location, j.experience_required, j.status, j.created_at
    ORDER BY j.created_at DESC;
  `;

  const result = await query(sql, params);
  return result.rows;
};

export const getJobById = async (jobId: number) => {
  const jobSql = `
    SELECT 
      j.job_id,
      j.recruiter_id,
      r.company_name,
      u.name AS recruiter_name,
      u.email AS recruiter_email,
      j.title,
      j.description,
      j.location,
      j.experience_required,
      j.status,
      j.created_at
    FROM jobs j
    JOIN recruiters r ON j.recruiter_id = r.recruiter_id
    JOIN users u ON r.user_id = u.user_id
    WHERE j.job_id = $1;
  `;
  const jobResult = await query(jobSql, [jobId]);
  if (!jobResult.rows.length) return null;

  const skillsSql = `
    SELECT 
      js.skill_id,
      s.skill_name,
      s.category,
      js.is_required,
      js.minimum_experience
    FROM job_skills js
    JOIN skills s ON js.skill_id = s.skill_id
    WHERE js.job_id = $1
    ORDER BY js.is_required DESC, s.skill_name ASC;
  `;
  const skillsResult = await query(skillsSql, [jobId]);

  return {
    ...jobResult.rows[0],
    skills: skillsResult.rows,
  };
};

export const createJob = async (input: CreateJobInput) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Insert Job
    const insertJobSql = `
      INSERT INTO jobs (recruiter_id, title, description, location, experience_required, status)
      VALUES ($1, $2, $3, $4, $5, 'open')
      RETURNING job_id, recruiter_id, title, description, location, experience_required, status, created_at;
    `;
    const jobRes = await client.query(insertJobSql, [
      input.recruiter_id,
      input.title,
      input.description || null,
      input.location || null,
      input.experience_required ?? 0.0,
    ]);
    const newJob = jobRes.rows[0];

    // 2. Insert Job Skills
    if (input.skills && input.skills.length > 0) {
      for (const skill of input.skills) {
        const insertSkillSql = `
          INSERT INTO job_skills (job_id, skill_id, is_required, minimum_experience)
          VALUES ($1, $2, $3, $4);
        `;
        await client.query(insertSkillSql, [
          newJob.job_id,
          skill.skill_id,
          skill.is_required ?? true,
          skill.minimum_experience ?? 0.0,
        ]);
      }
    }

    await client.query('COMMIT');
    return newJob;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const updateJobStatus = async (jobId: number, status: 'open' | 'closed') => {
  const sql = `
    UPDATE jobs
    SET status = $1
    WHERE job_id = $2
    RETURNING job_id, title, status;
  `;
  const result = await query(sql, [status, jobId]);
  return result.rows[0] || null;
};
