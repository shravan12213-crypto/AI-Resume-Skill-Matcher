# Matching Overview

The matching subsystem is an **in-database PostgreSQL table-valued PL/pgSQL function** named `get_top_candidates(p_job_id)`.

Matching is **100% relational SQL-based and deterministic**. It evaluates candidate suitability against job requirements by comparing normalized required skills and years of experience.

## Architectural Data Flow

```text
                         JOB
                          │
                          ▼
                     job_skills
                          │
                          ▼
              get_top_candidates(p_job_id)
                          │
              ┌───────────┴───────────┐
              │                       │
              ▼                       ▼
       candidate_skills          experience data
              │                       │
              ▼                       ▼
        Skill Score             Experience Score
         (70% weight)            (30% weight)
              │                       │
              └───────────┬───────────┘
                          ▼
                    Final Score
                          │
                 ORDER BY final_score DESC
                          │
                          ▼
                  Ranked Candidates
                          │
                          ▼
                    Backend/API
                          │
                          ▼
                 Recruiter Dashboard
```

## Core Architectural Principle
> **The application requests the ranking; PostgreSQL performs the candidate matching, scoring, and ordering internally.**

## Final Weighted Formula
$$\text{Final Score} = (\text{Skill Score} \times 0.70) + (\text{Experience Score} \times 0.30)$$

## Out of Scope
The following are strictly out of scope for the candidate matching subsystem:
- ❌ Vector embeddings & `pgvector`
- ❌ Cosine distance (`<=>`)
- ❌ Pinecone, Weaviate, or external vector search engines
- ❌ Semantic similarity scoring
- ❌ LLM-based candidate ranking
- ❌ 50/30/20 formula
