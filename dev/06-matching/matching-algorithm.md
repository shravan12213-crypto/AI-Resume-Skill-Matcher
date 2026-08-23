# Matching Algorithm

Candidate ranking is executed inside PostgreSQL using relational SQL. AI and LLMs do **NOT** rank candidates.

The matching system uses PostgreSQL table-valued PL/pgSQL function `get_top_candidates(p_job_id)` to generate an explainable, deterministic final score.

## Final Match Formula

The final candidate matching score is permanently locked to the following weights:
- **Skill Score**: 70% weight
- **Experience Score**: 30% weight

```text
Final Score =
    (Skill Score × 0.70)
  + (Experience Score × 0.30)
```

### Example Calculation:
- Skill Score = 80%
- Experience Score = 90%

```text
Final Score = (80 × 0.70) + (90 × 0.30)
            = 56 + 27
            = 83%
```

The final score must always remain between 0 and 100.

## Explainability
The function returns granular metrics to ensure total transparency for recruiters:
```text
Candidate A

Skill Score:       80%  (4 / 5 required skills matched)
Experience Score: 100%  (3 yrs / 3 yrs required)
Final Score:       86%

Matched:
✓ Python
✓ SQL
✓ React
✓ Node.js

Missing:
✗ Docker
```

## Out of Scope
- No vector embeddings (`pgvector`, `resume_embeddings`, `job_embeddings`).
- No cosine distance (`<=>`).
- No 50/30/20 formula.
- No LLM-based ranking or scoring.
