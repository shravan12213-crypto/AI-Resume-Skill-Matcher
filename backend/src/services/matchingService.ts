// backend/src/services/matchingService.ts
import { query } from '../config/db';

export const getTopCandidatesForJob = async (jobId: number, limit: number = 10) => {
  const sql = `
    SELECT 
      gtc.candidate_id,
      gtc.candidate_name,
      u.email,
      c.location,
      gtc.skill_score,
      gtc.semantic_score,
      gtc.experience_score,
      gtc.final_score,
      a.status AS application_status
    FROM get_top_candidates($1) gtc
    JOIN candidates c ON gtc.candidate_id = c.candidate_id
    JOIN users u ON c.user_id = u.user_id
    LEFT JOIN applications a ON gtc.candidate_id = a.candidate_id AND a.job_id = $1
    LIMIT $2;
  `;
  const result = await query(sql, [jobId, limit]);
  return result.rows;
};

export const getExplainableMatch = async (jobId: number, candidateId: number) => {
  // 1. Fetch scores
  const scoreSql = `
    SELECT 
      gtc.skill_score,
      gtc.semantic_score,
      gtc.experience_score,
      gtc.final_score,
      NOW() AS matched_at,
      j.title AS job_title,
      j.experience_required,
      gtc.candidate_name
    FROM get_top_candidates($1) gtc
    JOIN jobs j ON j.job_id = $1
    WHERE gtc.candidate_id = $2;
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
