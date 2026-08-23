# Candidate Ranking

Candidate ranking is performed directly inside PostgreSQL via the table-valued function `get_top_candidates(p_job_id)`.

## Execution Architecture

```text
Backend API
    │
    ▼
SELECT * FROM get_top_candidates($1);
    │
    ▼
PostgreSQL Engine
    ├── Join job_skills with candidate_skills
    ├── Calculate matched required skills count
    ├── Calculate skill score (70% weight)
    ├── Calculate experience score (30% weight)
    ├── Compute final score: (Skill × 0.70) + (Exp × 0.30)
    └── ORDER BY final_score DESC, candidate_id ASC
    │
    ▼
Ranked Result Set (RETURNS TABLE)
    │
    ▼
Backend API → Recruiter UI
```

## Deterministic Ordering
To ensure stable and deterministic ranking even when candidates share identical match scores, the function enforces tie-breaking:
```sql
ORDER BY final_score DESC, candidate_id ASC;
```

## DBMS Viva Principles
- **No Client-Side Sorting**: The application does not pull candidate tables and sort them in JavaScript/TypeScript.
- **Relational Pushdown**: PostgreSQL performs the projection, calculation, filtering, and ordering close to the data storage.