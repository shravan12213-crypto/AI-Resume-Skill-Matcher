# Semantic Scoring (Status: Out of Scope / Removed)

> **ARCHITECTURAL DECISION NOTE:**
> Semantic vector scoring, pgvector embeddings, cosine similarity (`<=>`), and LLM-based candidate ranking have been permanently **removed and declared OUT OF SCOPE** for this project.

## Rationale
1. **Academic Focus**: This project is a **DBMS Course Project**. The primary objective is to demonstrate relational SQL, normal forms, table-valued stored functions, transactions, and indexing rather than AI/ML frameworks.
2. **Determinism & Explainability**: Relational SQL skill matching ($70\%$) combined with deterministic experience scoring ($30\%$) provides $100\%$ explainability to recruiters and eliminates model latency/non-determinism.
3. **SSOT Alignment**: The active scoring algorithm is strictly documented in [matching-algorithm.md](file:///c:/Users/shravan/Documents/GitHub/AI-Resume-Skill-Matcher/dev/06-matching/matching-algorithm.md).