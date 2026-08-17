# Stored Procedures

The final DBMS plan explicitly contains THREE meaningful stored procedures.

## 1. `get_top_candidates(job_id)`
**Purpose:** Return candidates ranked according to their match score for a specific job.

## 2. `apply_to_job(candidate_id, job_id)`
**Purpose:** Handle the job application process and related operations within a transaction.

## 3. `calculate_skill_match(candidate_id, job_id)`
**Purpose:** Calculate the candidate's skill match against the required skills of a job.\n