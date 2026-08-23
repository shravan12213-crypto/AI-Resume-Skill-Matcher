# Scope

## In Scope
- User authentication and role management (Candidate, Recruiter, Admin).
- Candidate resume upload and AI-driven structured text extraction (JSON output into PostgreSQL).
- Structured relational storage of candidates, recruiters, resumes, jobs, and normalized skills.
- Pure SQL and PL/pgSQL candidate matching via table-valued stored function `get_top_candidates(p_job_id)`.
- Locked matching scoring formula: **70% Skill Score + 30% Experience Score**.
- Implementation of transactional stored procedure `apply_to_job(candidate_id, job_id)`.
- Status history audit trigger `trg_application_status_history` logging to `application_status_history`.
- Explainable matching results indicating matched vs missing required skills.
- Integer primary keys and composite primary keys for bridge tables (`candidate_skills`, `job_skills`).
- Realistic B-Tree indexing and `EXPLAIN ANALYZE` performance benchmarking.

## Out of Scope
- Vector databases, pgvector, embeddings (`VECTOR(1536)`), and vector distance (`<=>`).
- Pinecone, Weaviate, or external semantic search engines.
- Complex Machine Learning pipelines, LangChain, or RAG systems.
- Using AI/LLM to rank candidates or compute the final match score.
- 50/30/20 scoring formula.
- Advanced Microservices, Docker-heavy infrastructure, or Kubernetes.
- UUID primary keys (unless a future decision explicitly changes this).

## Advanced DBMS Features Checklist
The project must demonstrate:
### Database Design
- [ ] ER Diagram
- [ ] Relational Schema
- [ ] Normalization up to 3NF
- [ ] Primary Keys (Integer)
- [ ] Foreign Keys
- [ ] Composite Keys
- [ ] Constraints

### SQL
- [ ] CRUD Operations
- [ ] Joins (Inner, Left, Cross)
- [ ] Aggregations (COUNT, MAX, SUM, AVG)
- [ ] GROUP BY & HAVING
- [ ] Subqueries & Common Table Expressions (CTEs)
- [ ] EXISTS & NOT EXISTS
- [ ] CASE & Conditional Logic
- [ ] NULL handling (COALESCE, NULLIF)

### Advanced DBMS
- [ ] Table-Valued Stored Functions (`get_top_candidates`)
- [ ] Transactional Stored Procedures (`apply_to_job`)
- [ ] Triggers (`trg_application_status_history`)
- [ ] Database Views (`recruiter_job_summary_view`, `candidate_profile_view`)
- [ ] Transactions & ACID boundaries (`COMMIT`)
- [ ] Indexes (2-3 realistic)
- [ ] EXPLAIN ANALYZE & Query Optimization
- [ ] Database Roles, GRANT, REVOKE