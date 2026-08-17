# Matching Algorithm

Do NOT use embeddings, vector similarity, ML ranking, or LLM-based candidate ranking.

The matching system is purely SQL-based, explainable, and deterministic.

## Final Match Formula

The formula uses a 70/30 weighting because skills are considered more important than experience for this project version:
- **Skill Score**: 70% weight
- **Experience Score**: 30% weight

```text
Final Score = (Skill Score × 0.70) + (Experience Score × 0.30)
```

**Example:**
- Skill Score = 80%
- Experience Score = 90%

`Final Score = (80 × 0.70) + (90 × 0.30) = 56 + 27 = 83%`

The final score must always remain between 0 and 100.\n