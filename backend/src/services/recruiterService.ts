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
      j.job_id,
      j.recruiter_id,
      j.title AS job_title,
      j.status AS job_status,
      j.created_at,
      COUNT(a.application_id) AS total_applications,
      COUNT(CASE WHEN a.status = 'applied' THEN 1 END) AS pending_applications,
      COUNT(CASE WHEN a.status = 'shortlisted' THEN 1 END) AS shortlisted_count,
      COUNT(CASE WHEN a.status = 'hired' THEN 1 END) AS hired_count,
      COUNT(CASE WHEN a.status = 'rejected' THEN 1 END) AS rejected_count,
      0.00 AS avg_match_score
    FROM jobs j
    LEFT JOIN applications a ON j.job_id = a.job_id
    WHERE j.recruiter_id = $1
    GROUP BY j.job_id
    ORDER BY j.created_at DESC;
  `;
  const result = await query(sql, [recruiterId]);
  return result.rows;
};
