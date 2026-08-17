// backend/src/services/matchingService.ts
import { query } from '../config/db';

export const getTopCandidatesForJob = async (jobId: number, limit: number = 10) => {
  const sql = `
    SELECT 
      candidate_id,
      candidate_name,
      email,
      location,
      skill_score,
      semantic_score,
      experience_score,
      final_score,
      application_status
    FROM get_top_candidates($1, $2);
  `;
  const result = await query(sql, [jobId, limit]);
  return result.rows;
};

export const getExplainableMatch = async (jobId: number, candidateId: number) => {
  // 1. Fetch scores
  const scoreSql = `
    SELECT 
      m.skill_score,
      m.semantic_score,
      m.experience_score,
      m.final_score,
      m.matched_at,
      j.title AS job_title,
      j.experience_required,
      u.name AS candidate_name
    FROM matches m
    JOIN jobs j ON m.job_id = j.job_id
    JOIN candidates c ON m.candidate_id = c.candidate_id
    JOIN users u ON c.user_id = u.user_id
    WHERE m.job_id = $1 AND m.candidate_id = $2;
  `;
  const scoreResult = await query(scoreSql, [jobId, candidateId]);
  const scoreData = scoreResult.rows[0] || null;

  // 2. Fetch skill details (matched vs missing)
  const skillsSql = `
    SELECT 
      js.skill_id,
      s.skill_name,
      s.category,
      js.is_required,
      js.minimum_experience AS required_years,
      cs.proficiency AS candidate_proficiency,
      cs.years_experience AS candidate_years,
      CASE 
        WHEN cs.skill_id IS NOT NULL THEN 'MATCHED'
        WHEN js.is_required = TRUE THEN 'MISSING_REQUIRED'
        ELSE 'MISSING_OPTIONAL'
      END AS match_status
    FROM job_skills js
    JOIN skills s ON js.skill_id = s.skill_id
    LEFT JOIN candidate_skills cs ON (js.skill_id = cs.skill_id AND cs.candidate_id = $2)
    WHERE js.job_id = $1
    ORDER BY js.is_required DESC, match_status ASC, s.skill_name ASC;
  `;
  const skillsResult = await query(skillsSql, [jobId, candidateId]);

  const matchedSkills = skillsResult.rows.filter((s) => s.match_status === 'MATCHED');
  const missingRequiredSkills = skillsResult.rows.filter((s) => s.match_status === 'MISSING_REQUIRED');
  const missingOptionalSkills = skillsResult.rows.filter((s) => s.match_status === 'MISSING_OPTIONAL');

  return {
    candidate_id: candidateId,
    job_id: jobId,
    scores: scoreData,
    formula_weights: {
      skill_weight: '50%',
      semantic_weight: '30%',
      experience_weight: '20%',
    },
    skills_breakdown: {
      total_job_skills: skillsResult.rows.length,
      matched_skills_count: matchedSkills.length,
      missing_required_count: missingRequiredSkills.length,
      matched: matchedSkills,
      missing_required: missingRequiredSkills,
      missing_optional: missingOptionalSkills,
    },
  };
};

export const calculateMatch = async (candidateId: number, jobId: number) => {
  const sql = `SELECT calculate_candidate_job_match($1, $2) AS final_score;`;
  const result = await query(sql, [candidateId, jobId]);
  return result.rows[0];
};
