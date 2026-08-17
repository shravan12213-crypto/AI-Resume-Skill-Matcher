# AI Overview

AI performs strictly scoped tasks to enhance the database functionality:
```text
Resume
   ↓
Text Extraction
   ↓
OpenAI API
   ↓
Structured Resume Data
   ↓
PostgreSQL
   ↓
Generate Embedding
   ↓
pgvector
   ↓
Semantic Similarity
```

**AI DOES NOT:**
- Rank candidates or make hiring decisions directly via LLM.
- Replace SQL queries.
- Replace the relational database.

The database remains the source of truth, utilizing pgvector natively.\n