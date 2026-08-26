-- database/query_optimization.sql
-- Demonstration of EXPLAIN ANALYZE workflow.

-- ============================================================================
-- QUERY A: Candidate Skill Lookup
-- ============================================================================

-- [BEFORE INDEX]
-- Expected to use Sequential Scan on candidate_skills if no index exists, 
-- or potentially anyway if the table is extremely small.
EXPLAIN ANALYZE
SELECT c.candidate_id, s.skill_name, cs.proficiency, cs.years_experience
FROM candidate_skills cs
JOIN candidates c ON c.candidate_id = cs.candidate_id
JOIN skills s ON s.skill_id = cs.skill_id
WHERE cs.skill_id = 1;

-- [CREATE INDEX]
-- (Uncomment to execute if running linearly)
-- CREATE INDEX idx_candidate_skills_skill ON candidate_skills(skill_id);

-- [AFTER INDEX]
-- Expected to use Bitmap Heap Scan or Index Scan on idx_candidate_skills_skill,
-- unless the dataset is so small that a Sequential Scan remains cheaper.
EXPLAIN ANALYZE
SELECT c.candidate_id, s.skill_name, cs.proficiency, cs.years_experience
FROM candidate_skills cs
JOIN candidates c ON c.candidate_id = cs.candidate_id
JOIN skills s ON s.skill_id = cs.skill_id
WHERE cs.skill_id = 1;


-- ============================================================================
-- QUERY B: Application Job Status Lookup
-- ============================================================================

-- [BEFORE INDEX]
EXPLAIN ANALYZE
SELECT application_id, candidate_id, job_id, status, applied_at
FROM applications
WHERE job_id = 1
  AND status = 'shortlisted';

-- [CREATE INDEX]
-- (Uncomment to execute if running linearly)
-- CREATE INDEX idx_applications_job_status ON applications(job_id, status);

-- [AFTER INDEX]
EXPLAIN ANALYZE
SELECT application_id, candidate_id, job_id, status, applied_at
FROM applications
WHERE job_id = 1
  AND status = 'shortlisted';
