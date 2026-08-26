import { query } from '../config/db';

export interface Resume {
  resume_id: number;
  candidate_id: number;
  file_name: string;
  file_url: string;
  raw_text: string | null;
  uploaded_at: Date;
}

export const getCandidateResumes = async (candidateId: number): Promise<Resume[]> => {
  const sql = `
    SELECT * 
    FROM resumes 
    WHERE candidate_id = $1 
    ORDER BY uploaded_at DESC;
  `;
  const result = await query<Resume>(sql, [candidateId]);
  return result.rows;
};

export const getResumeByIdAndCandidate = async (resumeId: number, candidateId: number): Promise<Resume | null> => {
  const sql = `
    SELECT * 
    FROM resumes 
    WHERE resume_id = $1 AND candidate_id = $2;
  `;
  const result = await query<Resume>(sql, [resumeId, candidateId]);
  return result.rows[0] || null;
};

export const createResume = async (
  candidateId: number,
  file_name: string,
  file_url: string,
  raw_text: string | null = null
): Promise<Resume> => {
  const sql = `
    INSERT INTO resumes (candidate_id, file_name, file_url, raw_text)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const result = await query<Resume>(sql, [candidateId, file_name, file_url, raw_text]);
  return result.rows[0];
};

export const deleteResumeByCandidate = async (resumeId: number, candidateId: number): Promise<boolean> => {
  const sql = `
    DELETE FROM resumes 
    WHERE resume_id = $1 AND candidate_id = $2;
  `;
  const result = await query(sql, [resumeId, candidateId]);
  return (result.rowCount || 0) > 0;
};
