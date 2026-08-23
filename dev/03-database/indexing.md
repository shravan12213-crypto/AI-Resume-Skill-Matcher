# Indexing

The project must include 2-3 realistic, measured indexes. Do not blindly create indexes on every column.

## Planned Candidate Indexes for Matching & Querying
1. `CREATE INDEX idx_candidate_skills_skill ON candidate_skills(skill_id);`
   - Optimizes matching queries joining `candidate_skills` with `job_skills` on `skill_id`.
2. `CREATE INDEX idx_job_skills_job ON job_skills(job_id);`
   - Accelerates fetching required skills for a given job in `get_top_candidates(p_job_id)`.
3. `CREATE INDEX idx_applications_job_status ON applications(job_id, status);`
   - Optimizes recruiter application filtering by job and status.

## Documentation Requirement per Index (EXPLAIN ANALYZE)
For every selected index, document the exact before and after behavior:
1. The query it optimizes
2. Why the column(s) were selected
3. Query behavior before indexing (`EXPLAIN ANALYZE` output)
4. Query behavior after indexing (`EXPLAIN ANALYZE` output)
5. Compare execution plans

Do not fabricate performance numbers before database implementation and testing. Actual results will be documented in later phases.