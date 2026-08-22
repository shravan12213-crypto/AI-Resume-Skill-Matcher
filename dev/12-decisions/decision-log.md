# Decision Log

| Date | Decision | Reason |
|------|----------|--------|
| 2026-08-17 | Initial SSOT Creation | Establish guidelines for the DBMS project |
| 2026-08-17 | DBMS-first architecture | Project is a DBMS Course Project, relational database functionality is the primary focus. |
| 2026-08-17 | AI limited to resume structuring | AI should enhance the project without becoming the primary technical component. |
| 2026-08-17 | Integer primary keys | Simple, relationally clear, and easier to demonstrate in a DBMS academic project. |
| 2026-08-17 | Composite keys for bridge tables | Naturally enforces uniqueness for many-to-many relationships. |
| 2026-08-17 | pgvector and embeddings included | Project has sufficient scope/time to include semantic matching natively in PostgreSQL. |
| 2026-08-17 | 50/30/20 matching weights | Skills (50%) remain strongest signal, semantic similarity (30%) provides context, experience (20%) is an additional qualifier. |\n| 2026-08-17 | 1:1 relationship for resume_extracted_data | Enforce `UNIQUE(resume_id)` because we are treating it as the current extracted representation, not history. |
| 2026-08-17 | Option B for resume_extracted_data | Use separate JSONB fields (education, experience, projects, certifications) for clearer structure while allowing semi-structured AI output. |
| 2026-08-18 | Separate job_embeddings table | Keeps job embedding data separate from the core jobs table and provides symmetry with resume_embeddings. |
| 2026-08-18 | get_top_candidates as FUNCTION | It returns a tabular ranked result, making RETURNS TABLE a cleaner PostgreSQL interface. |
| 2026-08-18 | apply_to_job as PROCEDURE | It performs a transactional write operation and demonstrates PostgreSQL procedure semantics. |
| 2026-08-18 | IVFFLAT vector index | It provides an explicit vector-indexing design for semantic similarity while keeping the implementation appropriate for the course project. |
