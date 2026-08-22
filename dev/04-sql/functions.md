# Functions

The DBMS project uses PostgreSQL functions for routines that calculate values or return datasets.

Confirmed Functions:
- `calculate_skill_match(candidate_id, job_id)`: Contains the mathematical calculation for skill matching.
- `get_top_candidates(job_id)`: Returns a tabular result set of ranked candidates for a specific job using `RETURNS TABLE`.