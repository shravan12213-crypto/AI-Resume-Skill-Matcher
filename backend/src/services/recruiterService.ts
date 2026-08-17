// backend/src/services/recruiterService.ts
import { query } from '../config/db';

export interface RecruiterProfile {
  recruiter_id: number;
  user_id: number;
  name: string;
  email: string;
  company_name: string;
  designation: string | null;
  created_at: Date;
}

export const getRecruiterById = async (recruiterId: number): Promise<RecruiterProfile | null> => {
  const sql = `
    SELECT 
      r.recruiter_id,
      r.user_id,
      u.name,
      u.email,
      r.company_name,
      r.designation,
      u.created_at
    FROM recruiters r
    JOIN users u ON r.user_id = u.user_id
    WHERE r.recruiter_id = $1;
  `;
  const result = await query<RecruiterProfile>(sql, [recruiterId]);
  return result.rows[0] || null;
};

export const getRecruiterJobsWithStats = async (recruiterId: number) => {
  const sql = `
    SELECT 
      job_id,
      recruiter_id,
      job_title,
      job_status,
      created_at,
      total_applications,
      pending_applications,
      shortlisted_count,
      hired_count,
      rejected_count,
      avg_match_score
    FROM recruiter_job_summary_view
    WHERE recruiter_id = $1
    ORDER BY created_at DESC;
  `;
  const result = await query(sql, [recruiterId]);
  return result.rows;
};
