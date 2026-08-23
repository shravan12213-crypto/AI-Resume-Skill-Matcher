# Functions

The DBMS project uses PostgreSQL functions for routines that calculate values or return datasets.

Candidate matching and ranking is implemented as a table-valued stored function executed entirely within PostgreSQL.

## Confirmed Functions

### 1. `get_top_candidates(p_job_id INT)`
- **Type**: Table-valued / set-returning function (`RETURNS TABLE(...)`)
- **Language**: `plpgsql`
- **Purpose**: Computes relational matching scores between candidates and the target job, applying the locked **70% Skill + 30% Experience** formula, and returns candidates ordered by `final_score DESC, candidate_id ASC`.
- **Returned Columns**:
  - `candidate_id INT`
  - `candidate_name VARCHAR`
  - `matched_skill_count INT`
  - `required_skill_count INT`
  - `skill_score NUMERIC(5,2)`
  - `candidate_experience NUMERIC(3,1)`
  - `required_experience NUMERIC(3,1)`
  - `experience_score NUMERIC(5,2)`
  - `final_score NUMERIC(5,2)`
- **Key DBMS Concept**: Demonstrates database-side relational joins, Common Table Expressions (CTEs), aggregation, arithmetic expressions, `COALESCE`, `NULLIF`, `CASE`, deterministic ranking (`ORDER BY`), and `RETURNS TABLE` structure.

### 2. `calculate_skill_match(p_candidate_id INT, p_job_id INT)`
- **Type**: Scalar function (`RETURNS NUMERIC(5,2)`)
- **Purpose**: Contains the mathematical calculation for percentage of required skills matched:
  $$\text{Skill Score} = \left(\frac{\text{Matched Required Skills}}{\text{Total Required Skills}}\right) \times 100$$
  Safely handles edge cases (e.g., job with 0 required skills).