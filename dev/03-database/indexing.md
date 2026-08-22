# Indexing

The project must include 2-3 realistic indexes. Do not blindly create indexes on every column.

## Planned Indexes
1. `CREATE INDEX idx_candidate_skills_skill ON candidate_skills(skill_id);`
2. `CREATE INDEX idx_applications_job_status ON applications(job_id, status);`
3. `CREATE INDEX ... ON ... USING ivfflat (embedding vector_cosine_ops) WITH (lists = ...);` (Exact vector indexing strategy locked to IVFFLAT for semantic similarity, parameters TBD based on final row counts)

## Documentation Requirement per Index (EXPLAIN ANALYZE)
For every selected index, document the exact before and after behavior:
1. The query it optimizes
2. Why the column(s) were selected
3. Query behavior before indexing (EXPLAIN ANALYZE output)
4. Query behavior after indexing (EXPLAIN ANALYZE output)
5. Compare execution plans

Do not fabricate performance numbers. Actual results should only be documented after the database is implemented and tested.\n