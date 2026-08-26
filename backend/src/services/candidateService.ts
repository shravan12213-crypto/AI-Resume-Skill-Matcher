import { query } from '../config/db';

export interface CandidateProfile {
  candidate_id: number;
  user_id: number;
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  summary: string | null;
  created_at: Date;
}

export const getCandidateById = async (candidateId: number): Promise<CandidateProfile | null> => {
  const sql = `
    SELECT 
      c.candidate_id,
      c.user_id,
      u.name,
      u.email,
      c.phone,
      c.location,
      c.summary,
      u.created_at
    FROM candidates c
    JOIN users u ON c.user_id = u.user_id
    WHERE c.candidate_id = $1;
  `;
  const result = await query<CandidateProfile>(sql, [candidateId]);
  return result.rows[0] || null;
};

export const updateCandidateProfile = async (
  candidateId: number,
  profileData: { phone?: string; location?: string; summary?: string }
): Promise<CandidateProfile | null> => {
  const sql = `
    UPDATE candidates
    SET 
      phone = COALESCE($2, phone),
      location = COALESCE($3, location),
      summary = COALESCE($4, summary)
    WHERE candidate_id = $1
    RETURNING *;
  `;
  const result = await query(sql, [
    candidateId,
    profileData.phone,
    profileData.location,
    profileData.summary
  ]);

  if (result.rows.length === 0) return null;
  
  // Fetch full profile to return
  return getCandidateById(candidateId);
};
