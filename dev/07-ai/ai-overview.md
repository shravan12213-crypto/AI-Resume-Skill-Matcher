# AI Overview

AI performs exactly one core responsibility:
`Resume -> Text Extraction -> OpenAI API -> Structured JSON -> PostgreSQL`

AI extracts information such as:
```json
{
  "skills": [],
  "education": [],
  "experience": [],
  "projects": [],
  "certifications": []
}
```

**AI DOES NOT:**
- Rank candidates
- Make hiring decisions
- Calculate the final match score
- Replace SQL queries
- Replace the relational database

The database remains the source of truth.\n