# Decision Log

| Date | Decision | Reason |
|------|----------|--------|
| 2026-08-17 | Initial SSOT Creation | Establish guidelines for the DBMS project |
| 2026-08-17 | DBMS-first architecture | Project is a DBMS Course Project, relational database functionality is the primary focus. |
| 2026-08-17 | AI limited to resume structuring | AI should enhance the project without becoming the primary technical component. |
| 2026-08-17 | Integer primary keys | Simple, relationally clear, and easier to demonstrate in a DBMS academic project. |
| 2026-08-17 | Composite keys for bridge tables | Naturally enforces uniqueness for many-to-many relationships. |
| 2026-08-17 | 1:1 relationship for resume_extracted_data | Enforce `UNIQUE(resume_id)` because we are treating it as the current extracted representation, not history. |
| 2026-08-17 | Option B for resume_extracted_data | Use separate JSONB fields (education, experience, projects, certifications) for clearer structure while allowing semi-structured AI output. |
| 2026-08-18 | get_top_candidates as FUNCTION | It returns a tabular ranked result, making RETURNS TABLE a cleaner PostgreSQL interface. |
| 2026-08-18 | apply_to_job as PROCEDURE | It performs a transactional write operation and demonstrates PostgreSQL procedure semantics. |
| 2026-08-24 | Finalized In-Database Relational Matching (70/30 Formula) | Candidate matching will be implemented as an in-database PostgreSQL table-valued PL/pgSQL function `get_top_candidates(p_job_id)`. The function will use relational SQL over `job_skills`, `candidate_skills`, and experience data to calculate an explainable 70% skill + 30% experience score and return candidates ordered by final score. The application only requests the ranking; PostgreSQL performs the candidate matching, scoring, and ordering internally. |
