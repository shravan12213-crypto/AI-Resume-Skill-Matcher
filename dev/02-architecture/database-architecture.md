# Database Architecture

The database is built on PostgreSQL and serves as the hero of the system.

- **Storage**: Relational storage of users, candidates, recruiters, jobs, resumes, and normalized skills.
- **In-Database Matching**: Performed via the table-valued stored function `get_top_candidates(p_job_id)` mapping `candidate_skills` to `job_skills` and evaluating experience ratios.
- **Scoring Model**: Locked formula of **70% Skill Score + 30% Experience Score**.
- **Business Logic & Integrity**: Enforced at the database level using stored functions (`get_top_candidates`), procedures (`apply_to_job`), and audit triggers.
- **Performance**: Tuned using appropriate B-Tree indexes on join and filter columns.
- **Security**: Controlled at the database level using PostgreSQL roles, privileges, and connection isolation.