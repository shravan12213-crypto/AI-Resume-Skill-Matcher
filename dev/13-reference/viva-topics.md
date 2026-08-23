# Viva Topics & Core DBMS Concepts

Ensure both team members can confidently explain:

## 1. Core Architectural & Hero DBMS Principles
- **Hero Statement 1**: *"The application only requests the ranking. PostgreSQL performs the candidate matching, scoring, and ordering internally through a table-valued PL/pgSQL function `get_top_candidates(p_job_id)`."*
- **Hero Statement 2**: *"We deliberately implemented candidate ranking inside PostgreSQL so that the matching logic demonstrates relational joins, aggregation, calculated fields, stored functions, and database-side processing rather than being hidden in application code."*
- **Performance & Data Transfer**: *"Matching calculations are performed inside PostgreSQL, minimizing application-side processing and unnecessary transfer of intermediate candidate data."*

## 2. Relational Modeling & Schema Design
- **Why PostgreSQL?** Robust open-source RDBMS with strong ANSI SQL compliance, procedural language support (PL/pgSQL), transaction isolation, and extensible data types (JSONB).
- **Why normalization?** Eliminates data redundancy, prevents insertion/update/deletion anomalies, and ensures data integrity up to 3NF.
- **Why bridge / associative tables?** Normalized representation of many-to-many ($M:N$) relationships (`candidate_skills`, `job_skills`).
- **Why composite primary keys?** Naturally enforces uniqueness on $(candidate\_id, skill\_id)$ and $(job\_id, skill\_id)$ without surrogate ID overhead.
- **Why foreign keys & ON DELETE CASCADE?** Guarantees referential integrity across related tables.

## 3. SQL & Advanced Procedural Concepts
- **Procedure vs Function**:
  - `get_top_candidates(p_job_id)` is a **FUNCTION** returning a table (`RETURNS TABLE`) for clean composability in SQL queries (`SELECT * FROM get_top_candidates(...)`).
  - `apply_to_job(p_candidate_id, p_job_id)` is a **PROCEDURE** because it executes transactional write operations with explicit `COMMIT` boundaries.
- **Why use a trigger?** `trg_application_status_history` automates audit logging whenever an application status changes, guaranteeing an untamperable audit trail.
- **What is a transaction & ACID properties?** Atomicity, Consistency, Isolation, Durability. Ensuring job posting and skill association are committed together or rolled back completely.
- **What does EXPLAIN ANALYZE show?** Execution plan (Seq Scan vs Index Scan), actual execution time, startup cost, buffer hit ratio, and loops.

## 4. Matching & Scoring Logic
- **Why 70% Skill + 30% Experience weighting?** Skills are the primary qualifier for role readiness ($70\%$), while verified industry experience acts as the deterministic secondary qualifier ($30\%$).
- **Why is AI not responsible for ranking?** The project is a DBMS project. AI is strictly constrained to text extraction (converting resumes into structured JSON). Ranking is computed deterministically by relational SQL queries inside PostgreSQL.
- **How does deterministic tie-breaking work?** `ORDER BY final_score DESC, candidate_id ASC` guarantees consistent, reproducible result sets.
