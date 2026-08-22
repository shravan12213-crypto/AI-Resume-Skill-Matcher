# Matching Algorithm

Do NOT use LLM-based candidate ranking.

The matching system uses PostgreSQL and pgvector to generate an explainable, deterministic final score.

## Final Match Formula

The final candidate matching score is permanently locked to the following weights for the current version:
- **Skill Score**: 50% weight
- **Semantic Score**: 30% weight
- **Experience Score**: 20% weight

```text
Final Score =
    (Skill Score Ã— 0.50)
  + (Semantic Score Ã— 0.30)
  + (Experience Score Ã— 0.20)
```

**Example:**
- Skill Score = 80%
- Semantic Score = 90%
- Experience Score = 100%

```text
Final Score = (80 Ã— 0.50) + (90 Ã— 0.30) + (100 Ã— 0.20)
= 40 + 27 + 20
= 87%
```

The final score must always remain between 0 and 100.\n
