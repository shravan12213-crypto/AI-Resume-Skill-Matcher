# Functions and Stored Procedures

The DBMS plan explicitly contains TWO meaningful stored functions and ONE transactional stored procedure.

## 1. FUNCTION: `get_top_candidates(p_job_id INT)`
- **Purpose**: Return candidate rankings according to their match score for a specific job.
- **Why Function**: Returns a tabular ranked result set, making `RETURNS TABLE` a cleaner and standard PostgreSQL interface than a procedure.
- **Core Formula**: Relational SQL evaluation applying $70\%$ Skill Score and $30\%$ Experience Score.
- **Explainability**: Returns granular breakdown columns (`matched_skill_count`, `required_skill_count`, `skill_score`, `candidate_experience`, `required_experience`, `experience_score`, `final_score`).

## 2. FUNCTION: `calculate_skill_match(p_candidate_id INT, p_job_id INT)`
- **Purpose**: Calculate a single candidate's skill match against the required skills of a job. Returns a single scalar `NUMERIC(5,2)` value.

## 3. PROCEDURE: `apply_to_job(p_candidate_id INT, p_job_id INT)`
- **Purpose**: Handle the job application submission safely within a database transaction.
- **Why Procedure**: It performs transactional write operations (`INSERT`, referential checks, status validation) and demonstrates explicit PostgreSQL procedure transaction boundaries (`COMMIT`).