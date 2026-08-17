# Database Views

The project contains at least two meaningful database views. Do not create views merely for demonstration.

## 1. `candidate_profile_view`
**Purpose:** Provide a convenient combined view of relevant candidate profile information, resume information, and skills.

## 2. `job_match_view`
**Purpose:** Provide job-candidate matching information including Candidate, Job, Skill score, Experience score, and Final score.

The view should support queries such as:
```sql
SELECT * FROM job_match_view WHERE job_id = ? ORDER BY final_score DESC;
```\n