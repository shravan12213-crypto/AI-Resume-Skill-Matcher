-- database/views.sql
-- AI-Powered Smart Resume Repository
-- Approved DBMS Views

-- ============================================================================
-- 1. candidate_profile_view
-- Consolidates candidate details, latest resume, and aggregates their skills.
-- ============================================================================
CREATE OR REPLACE VIEW candidate_profile_view AS
SELECT 
    c.candidate_id,
    u.name AS candidate_name,
    u.email,
    c.phone,
    c.location,
    c.summary,
    res.file_name AS latest_resume_file,
    res.file_url AS latest_resume_url,
    STRING_AGG(DISTINCT s.skill_name, ', ') AS skills
FROM candidates c
JOIN users u ON c.user_id = u.user_id
LEFT JOIN candidate_skills cs ON c.candidate_id = cs.candidate_id
LEFT JOIN skills s ON cs.skill_id = s.skill_id
LEFT JOIN LATERAL (
    SELECT file_name, file_url
    FROM resumes r
    WHERE r.candidate_id = c.candidate_id
    ORDER BY r.uploaded_at DESC
    LIMIT 1
) res ON TRUE
GROUP BY 
    c.candidate_id,
    u.name,
    u.email,
    c.phone,
    c.location,
    c.summary,
    res.file_name,
    res.file_url;


-- ============================================================================
-- 2. job_match_view
-- Exposes stored match information linking jobs, recruiters, and candidates.
-- ============================================================================
CREATE OR REPLACE VIEW job_match_view AS
SELECT 
    m.job_id,
    j.title AS job_title,
    r.company_name,
    m.candidate_id,
    u.name AS candidate_name,
    m.skill_score,
    m.semantic_score,
    m.experience_score,
    m.final_score,
    m.matched_at
FROM matches m
JOIN jobs j ON m.job_id = j.job_id
JOIN recruiters r ON j.recruiter_id = r.recruiter_id
JOIN candidates c ON m.candidate_id = c.candidate_id
JOIN users u ON c.user_id = u.user_id;
