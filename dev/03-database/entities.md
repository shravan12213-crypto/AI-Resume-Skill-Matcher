# Entities

**Primary Key Strategy:** Integer primary keys (e.g., serial/identity) are used for all main entities. Bridge/associative tables use composite primary keys.

1. `users`: Stores authentication and general user info (`user_id`).
2. `candidates`: Candidate-specific information (`candidate_id`).
3. `recruiters`: Recruiter-specific information (`recruiter_id`).
4. `resumes`: Resume metadata and raw text references (`resume_id`).
5. `resume_extracted_data`: The current extracted JSON representation of a resume (`extraction_id`).
6. `resume_embeddings`: Embeddings for semantic matching generated from the resume (`embedding_id`).
7. `skills`: Master skill table (`skill_id`).
8. `candidate_skills`: Bridge table for Candidate M-N Skill (Composite PK: `candidate_id`, `skill_id`).
9. `jobs`: Job postings (`job_id`).
10. `job_skills`: Bridge table for Job M-N Skill (Composite PK: `job_id`, `skill_id`).
11. `applications`: Bridge table for Candidate M-N Job (`application_id`).
12. `matches`: Stores the result of candidate-job matching (`match_id`).
13. `application_status_history`: Tracks changes in application statuses (`history_id`).\n