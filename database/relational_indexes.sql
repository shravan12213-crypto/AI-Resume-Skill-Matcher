-- database/relational_indexes.sql
-- AI-Powered Smart Resume Repository
-- Relational indexes for query performance optimization.

-- ============================================================================
-- INDEX 1: Optimize searches filtering candidates by specific skill
-- ============================================================================
CREATE INDEX idx_candidate_skills_skill
ON candidate_skills(skill_id);

-- ============================================================================
-- INDEX 2: Optimize filtering applications by job and status
-- ============================================================================
CREATE INDEX idx_applications_job_status
ON applications(job_id, status);
