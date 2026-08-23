# AI Overview

AI performs strictly scoped text extraction tasks to enhance the database with structured data:

```text
Candidate Resume (PDF/DOCX)
            │
            ▼
Text Extraction Pipeline
            │
            ▼
OpenAI Structured Parsing
            │
            ▼
Structured JSON (Skills, Education, Experience)
            │
            ▼
PostgreSQL Database (Normalized Tables)
```

## Strict Boundary Rules

**AI DOES:**
- Extract plain text from uploaded resume documents.
- Parse unstructured resume sections into structured JSON (skills array, educational history, project summaries, years of experience).
- Feed structured data directly into PostgreSQL.

**AI DOES NOT:**
- Rank candidates or make hiring decisions.
- Perform candidate scoring or matching.
- Generate vector embeddings for candidate comparison.
- Replace SQL queries or relational data models.

PostgreSQL is the single source of truth and performs all candidate matching, scoring, and ranking internally via SQL.