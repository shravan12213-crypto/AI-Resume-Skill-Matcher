-- database/views.sql
-- AI-Powered Smart Resume Repository with Skill Matching
-- Advanced DBMS Views Implementation (Phase 5)

-- ============================================================================
-- 1. VIEW: Candidate Profile Summary View
-- Provides a consolidated view of candidate information, contact info,
-- latest resume details, and aggregated skills with proficiencies.
-- ============================================================================

CREATE OR REPLACE VIEW candidate_profile_view AS
SELECT 
    c.candidate_id,
    u.user_id,
    u.name AS candidate_name,
    u.email,
    c.phone,
    c.location,
    c.summary,
    r.resume_id,
    r.file_name AS latest_resume_file,
    r.file_url AS latest_resume_url,
    r.uploaded_at AS resume_uploaded_at,
    COALESCE(
        jsonb_agg(
            jsonb_build_object(
                'skill_id', s.skill_id,
                'skill_name', s.skill_name,
                'category', s.category,
                'proficiency', cs.proficiency,
                'years_experience', cs.years_experience
            )
        ) FILTER (WHERE s.skill_id IS NOT NULL),
        '[]'::jsonb
    ) AS skills
FROM candidates c
JOIN users u ON c.user_id = u.user_id
LEFT JOIN LATERAL (
    SELECT resume_id, file_name, file_url, uploaded_at
    FROM resumes
    WHERE candidate_id = c.candidate_id
    ORDER BY uploaded_at DESC
    LIMIT 1
) r ON TRUE
LEFT JOIN candidate_skills cs ON c.candidate_id = cs.candidate_id
LEFT JOIN skills s ON cs.skill_id = s.skill_id
GROUP BY 
    c.candidate_id, 
    u.user_id, 
    u.name, 
    u.email, 
    c.phone, 
    c.location, 
    c.summary,
    r.resume_id,
    r.file_name,
    r.file_url,
    r.uploaded_at;

-- ============================================================================
-- 2. VIEW: Job Match Ranking View
-- Provides recruiter-centric candidate ranking data for each job,
-- including individual score breakdowns (Skill, Semantic, Experience, Final).
-- ============================================================================

CREATE OR REPLACE VIEW job_match_view AS
SELECT 
    m.match_id,
    m.job_id,
    j.title AS job_title,
    j.status AS job_status,
    rec.company_name,
    m.candidate_id,
    u.name AS candidate_name,
    u.email AS candidate_email,
    c.location AS candidate_location,
    app.status AS application_status,
    m.skill_score,
    m.semantic_score,
    m.experience_score,
    m.final_score,
    m.matched_at
FROM matches m
JOIN jobs j ON m.job_id = j.job_id
JOIN recruiters rec ON j.recruiter_id = rec.recruiter_id
JOIN candidates c ON m.candidate_id = c.candidate_id
JOIN users u ON c.user_id = u.user_id
LEFT JOIN applications app ON (app.candidate_id = m.candidate_id AND app.job_id = m.job_id);

-- ============================================================================
-- 3. VIEW: Recruiter Job Application Summary View
-- Provides aggregated statistics per job (e.g. total applicants, count by status).
-- ============================================================================

CREATE OR REPLACE VIEW recruiter_job_summary_view AS
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
    ROUND(AVG(m.final_score), 2) AS avg_match_score
FROM jobs j
LEFT JOIN applications a ON j.job_id = a.job_id
LEFT JOIN matches m ON (j.job_id = m.job_id AND a.candidate_id = m.candidate_id)
GROUP BY j.job_id, j.recruiter_id, j.title, j.status, j.created_at;
