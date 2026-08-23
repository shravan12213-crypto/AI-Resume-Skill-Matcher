# Change Log

| Date | Change | Previous | Updated |
|------|--------|----------|---------|
| 2026-08-17 | Primary keys | TBD | Integer IDs |
| 2026-08-17 | Bridge tables | TBD | Composite PKs |
| 2026-08-17 | Stored procedures | 2–3 | 3 finalized procedures |
| 2026-08-18 | Advanced SQL & DBMS Scripts | Not implemented | `triggers.sql`, `views.sql`, `procedures.sql`, `roles.sql`, `matching.sql` created |
| 2026-08-18 | Recruiter & Matching Backend | Not implemented | Node.js + Express + TypeScript backend implemented in `backend/` |
| 2026-08-18 | Recruiter Frontend | Not implemented | React + Vite + Tailwind CSS app implemented in `frontend/` |
| 2026-08-18 | Planned schema | 13 tables | 12 core relational tables |
| 2026-08-18 | get_top_candidates | PROCEDURE | Table-valued FUNCTION (`RETURNS TABLE`) |
| 2026-08-18 | apply_to_job | Not explicitly typed | Explicitly locked as TRANSACTIONAL PROCEDURE |
| 2026-08-24 | Matching Subsystem & Scoring Architecture | 50% Skill + 30% Semantic pgvector + 20% Exp | Locked 100% Relational SQL Matching: **70% Skill + 30% Experience** in `get_top_candidates(p_job_id)`. Embeddings/pgvector/semantic vectors declared OUT OF SCOPE. |
