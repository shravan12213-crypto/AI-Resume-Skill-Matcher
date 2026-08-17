-- database/queries/matching.sql
-- AI-Powered Smart Resume Repository with Skill Matching
-- Reusable SQL Matching & Ranking Queries (Phase 6)

-- ============================================================================
-- 1. QUERY: Explainable Skills Breakdown for a Candidate & Job
-- Shows exactly which skills are matched vs missing for explainability.
-- ============================================================================

-- Parameters: :job_id, :candidate_id
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
LEFT JOIN candidate_skills cs ON (js.skill_id = cs.skill_id AND cs.candidate_id = 1) -- Example: candidate_id = 1
WHERE js.job_id = 1 -- Example: job_id = 1
ORDER BY js.is_required DESC, match_status ASC, s.skill_name ASC;

-- ============================================================================
-- 2. QUERY: Batch Calculate Matches for All Candidates on a Job
-- Computes skill and experience score inline for all eligible candidates.
-- ============================================================================

-- Parameters: :job_id
WITH job_reqs AS (
    SELECT 
        j.job_id,
        j.experience_required,
        COUNT(CASE WHEN js.is_required = TRUE THEN 1 END) AS total_required_skills,
        COUNT(js.skill_id) AS total_skills
    FROM jobs j
    LEFT JOIN job_skills js ON j.job_id = js.job_id
    WHERE j.job_id = 1
    GROUP BY j.job_id, j.experience_required
),
candidate_matched AS (
    SELECT 
        c.candidate_id,
        COUNT(CASE WHEN js.is_required = TRUE THEN 1 END) AS matched_required_skills,
        COALESCE(MAX(cs.years_experience), 0.0) AS candidate_max_exp
    FROM candidates c
    CROSS JOIN job_reqs jr
    LEFT JOIN candidate_skills cs ON c.candidate_id = cs.candidate_id
    LEFT JOIN job_skills js ON (cs.skill_id = js.skill_id AND js.job_id = jr.job_id)
    GROUP BY c.candidate_id
)
SELECT 
    cm.candidate_id,
    u.name AS candidate_name,
    u.email,
    jr.job_id,
    -- Skill Score %
    CASE 
        WHEN jr.total_required_skills = 0 THEN 100.00
        ELSE ROUND((cm.matched_required_skills::NUMERIC / jr.total_required_skills::NUMERIC) * 100.00, 2)
    END AS skill_score,
    -- Experience Score %
    CASE 
        WHEN jr.experience_required <= 0 THEN 100.00
        ELSE ROUND(LEAST(100.00, (cm.candidate_max_exp / jr.experience_required) * 100.00), 2)
    END AS experience_score
FROM candidate_matched cm
CROSS JOIN job_reqs jr
JOIN candidates c ON cm.candidate_id = c.candidate_id
JOIN users u ON c.user_id = u.user_id;

-- ============================================================================
-- 3. QUERY: Semantic Matching via pgvector Cosine Distance
-- Calculates semantic similarity between resume embeddings and job description.
-- (1 - cosine_distance) * 100 = percentage similarity
-- ============================================================================

-- Parameter: :job_embedding (vector), :job_id
SELECT 
    re.resume_id,
    r.candidate_id,
    u.name AS candidate_name,
    ROUND(((1 - (re.embedding <=> '[0.01, 0.02, ...]'::vector)) * 100)::NUMERIC, 2) AS semantic_similarity_score
FROM resume_embeddings re
JOIN resumes r ON re.resume_id = r.resume_id
JOIN candidates c ON r.candidate_id = c.candidate_id
JOIN users u ON c.user_id = u.user_id
ORDER BY re.embedding <=> '[0.01, 0.02, ...]'::vector ASC
LIMIT 10;
