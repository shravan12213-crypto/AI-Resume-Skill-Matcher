// backend/src/services/applicationService.ts
import { query } from '../config/db';

export const applyToJob = async (candidateId: number, jobId: number) => {
  // Invokes the transactional stored procedure apply_to_job(candidate_id, job_id)
  await query('CALL apply_to_job($1, $2);', [candidateId, jobId]);

  // Fetch the resulting application and match
  const res = await query(
    `
    SELECT 
      a.application_id,
      a.candidate_id,
      a.job_id,
      a.status,
      a.applied_at,
      m.skill_score,
      m.semantic_score,
      m.experience_score,
      m.final_score
    FROM applications a
    LEFT JOIN matches m ON (a.candidate_id = m.candidate_id AND a.job_id = m.job_id)
    WHERE a.candidate_id = $1 AND a.job_id = $2;
    `,
    [candidateId, jobId]
  );
  return res.rows[0];
};

export const getApplicationsByJob = async (jobId: number) => {
  const sql = `
    SELECT 
      a.application_id,
      a.candidate_id,
      u.name AS candidate_name,
      u.email AS candidate_email,
      c.phone,
      c.location,
      r.resume_id,
      r.file_name AS resume_file,
      r.file_url AS resume_url,
      a.job_id,
      a.status AS application_status,
      a.applied_at,
      m.skill_score,
      m.semantic_score,
      m.experience_score,
      m.final_score
    FROM applications a
    JOIN candidates c ON a.candidate_id = c.candidate_id
    JOIN users u ON c.user_id = u.user_id
    LEFT JOIN LATERAL (
      SELECT resume_id, file_name, file_url
      FROM resumes
      WHERE candidate_id = c.candidate_id
      ORDER BY uploaded_at DESC
      LIMIT 1
    ) r ON TRUE
    LEFT JOIN matches m ON (a.candidate_id = m.candidate_id AND a.job_id = m.job_id)
    WHERE a.job_id = $1
    ORDER BY m.final_score DESC NULLS LAST, a.applied_at DESC;
  `;
  const result = await query(sql, [jobId]);
  return result.rows;
};

export const updateApplicationStatus = async (
  applicationId: number,
  status: 'applied' | 'shortlisted' | 'rejected' | 'hired'
) => {
  // Updating status triggers trg_application_status_history automatically in PostgreSQL
  const sql = `
    UPDATE applications
    SET status = $1
    WHERE application_id = $2
    RETURNING application_id, candidate_id, job_id, status, applied_at;
  `;
  const result = await query(sql, [status, applicationId]);
  return result.rows[0] || null;
};

export const getApplicationHistory = async (applicationId: number) => {
  const sql = `
    SELECT 
      history_id,
      application_id,
      old_status,
      new_status,
      changed_at
    FROM application_status_history
    WHERE application_id = $1
    ORDER BY changed_at ASC;
  `;
  const result = await query(sql, [applicationId]);
  return result.rows;
};
