# GRANT and REVOKE

Database access control is implemented via role-based permissions in `database/roles.sql`.

## 1. Public Revocation
```sql
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM PUBLIC;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC;
```

## 2. Administrator Role (`app_admin`)
```sql
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO app_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO app_admin;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO app_admin;
```

## 3. Recruiter Role (`app_recruiter`)
```sql
-- Job & Job Skills Management
GRANT SELECT, INSERT, UPDATE, DELETE ON jobs, job_skills TO app_recruiter;

-- Application Status Management
GRANT SELECT, UPDATE ON applications TO app_recruiter;
GRANT SELECT ON application_status_history TO app_recruiter;

-- Candidate & Match Viewing
GRANT SELECT ON candidates, resumes, resume_extracted_data, resume_embeddings, skills, candidate_skills, matches TO app_recruiter;
GRANT SELECT, UPDATE ON recruiters TO app_recruiter;

-- Views & Sequences
GRANT SELECT ON candidate_profile_view, job_match_view, recruiter_job_summary_view TO app_recruiter;
GRANT USAGE, SELECT ON SEQUENCE jobs_job_id_seq TO app_recruiter;

-- Stored Functions
GRANT EXECUTE ON FUNCTION calculate_candidate_job_match(INT, INT) TO app_recruiter;
GRANT EXECUTE ON FUNCTION get_top_candidates(INT, INT) TO app_recruiter;
```

## 4. Candidate Role (`app_candidate`)
```sql
-- Profile & Resume Management
GRANT SELECT, INSERT, UPDATE ON candidates, candidate_skills, resumes, resume_extracted_data TO app_candidate;
GRANT SELECT, UPDATE ON users TO app_candidate;

-- Job & Skill Discovery
GRANT SELECT ON jobs, job_skills, skills TO app_candidate;

-- Application Submission
GRANT SELECT, INSERT ON applications TO app_candidate;
GRANT USAGE, SELECT ON SEQUENCE resumes_resume_id_seq, applications_application_id_seq TO app_candidate;

-- Application Procedure Execution
GRANT EXECUTE ON PROCEDURE apply_to_job(INT, INT) TO app_candidate;
```