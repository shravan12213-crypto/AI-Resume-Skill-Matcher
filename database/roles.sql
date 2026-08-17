-- database/roles.sql
-- AI-Powered Smart Resume Repository with Skill Matching
-- Database Roles, Privileges, GRANT and REVOKE (Phase 5 - Security)

-- ============================================================================
-- 1. CREATE ROLES
-- ============================================================================

DO $$
BEGIN
    -- Create app_admin role if not exists
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'app_admin') THEN
        CREATE ROLE app_admin WITH LOGIN PASSWORD 'admin_secure_password';
    END IF;

    -- Create app_recruiter role if not exists
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'app_recruiter') THEN
        CREATE ROLE app_recruiter WITH LOGIN PASSWORD 'recruiter_secure_password';
    END IF;

    -- Create app_candidate role if not exists
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'app_candidate') THEN
        CREATE ROLE app_candidate WITH LOGIN PASSWORD 'candidate_secure_password';
    END IF;
END
$$;

-- ============================================================================
-- 2. REVOKE DEFAULT PUBLIC ACCESS
-- Secure the schema by revoking excessive privileges from public.
-- ============================================================================

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM PUBLIC;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC;

-- ============================================================================
-- 3. GRANT PRIVILEGES: app_admin (Full Management)
-- ============================================================================

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO app_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO app_admin;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO app_admin;

-- ============================================================================
-- 4. GRANT PRIVILEGES: app_recruiter
-- ============================================================================

-- Recruiters can manage jobs and job_skills
GRANT SELECT, INSERT, UPDATE, DELETE ON jobs, job_skills TO app_recruiter;

-- Recruiters can view and update application status (e.g. shortlist, reject)
GRANT SELECT, UPDATE ON applications TO app_recruiter;
GRANT SELECT ON application_status_history TO app_recruiter;

-- Recruiters can view candidates, resumes, and extracted skills for hiring
GRANT SELECT ON candidates, resumes, resume_extracted_data, resume_embeddings, skills, candidate_skills, matches TO app_recruiter;
GRANT SELECT, UPDATE ON recruiters TO app_recruiter;

-- Recruiters can view read-only database views
GRANT SELECT ON candidate_profile_view, job_match_view, recruiter_job_summary_view TO app_recruiter;

-- Recruiters can use sequence generators for new jobs
GRANT USAGE, SELECT ON SEQUENCE jobs_job_id_seq TO app_recruiter;

-- Recruiters can execute matching functions
GRANT EXECUTE ON FUNCTION calculate_candidate_job_match(INT, INT) TO app_recruiter;
GRANT EXECUTE ON FUNCTION get_top_candidates(INT, INT) TO app_recruiter;

-- ============================================================================
-- 5. GRANT PRIVILEGES: app_candidate
-- ============================================================================

-- Candidates can manage their own profile and skills
GRANT SELECT, INSERT, UPDATE ON candidates, candidate_skills, resumes, resume_extracted_data TO app_candidate;
GRANT SELECT, UPDATE ON users TO app_candidate;

-- Candidates can view available jobs and public skills
GRANT SELECT ON jobs, job_skills, skills TO app_candidate;

-- Candidates can view and insert their applications
GRANT SELECT, INSERT ON applications TO app_candidate;

-- Candidates can access relevant sequences
GRANT USAGE, SELECT ON SEQUENCE resumes_resume_id_seq, applications_application_id_seq TO app_candidate;

-- Candidates can execute the apply_to_job procedure
GRANT EXECUTE ON PROCEDURE apply_to_job(INT, INT) TO app_candidate;
