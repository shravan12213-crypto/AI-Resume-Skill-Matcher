# Entities

**Primary Key Strategy:** Integer primary keys (serial/identity) are used for all main entities. Bridge/associative tables use composite primary keys.

1. `users`: Stores authentication and general user info (`user_id`).
2. `candidates`: Candidate-specific information (`candidate_id`).
3. `recruiters`: Recruiter-specific information (`recruiter_id`).
4. `resumes`: Resume metadata and file/text references (`resume_id`).
5. `resume_extracted_data`: The extracted JSON representation of a resume (`extraction_id`).
6. `skills`: Master normalized skill catalog (`skill_id`).
7. `jobs`: Job postings and requirements (`job_id`).
8. `candidate_skills`: Bridge table for Candidate M-N Skill (Composite PK: `candidate_id`, `skill_id`).
9. `job_skills`: Bridge table for Job M-N Skill (Composite PK: `job_id`, `skill_id`).
10. `applications`: Bridge table for Candidate M-N Job (`application_id`).
11. `matches`: Stores the computed scores for candidate-job matching (`match_id`).
12. `application_status_history`: Audit trail tracking changes in application statuses (`history_id`).