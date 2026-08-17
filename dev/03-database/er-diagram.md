# ER Diagram

(This document will contain the visual or textual ER diagram representing 1:1, 1:N, M:N relationships, associative entities, primary keys, foreign keys, and cardinalities.)

- `user` (1) to (1) `candidate` / `recruiter`
- `candidate` (1) to (N) `resumes`
- `candidate` (M) to (N) `skills` via `candidate_skills`
- `recruiter` (1) to (N) `jobs`
- `job` (M) to (N) `skills` via `job_skills`
- `candidate` (M) to (N) `jobs` via `applications`
- `candidate` (M) to (N) `jobs` via `matches`
- `application` (1) to (N) `application_status_history`\n