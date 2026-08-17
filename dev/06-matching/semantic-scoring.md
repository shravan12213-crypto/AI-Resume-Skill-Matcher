# Semantic Scoring

The semantic score comes from comparing Candidate Resume Embeddings vs Job Description Embeddings using PostgreSQL + pgvector.
The semantic score is represented as a percentage between 0 and 100.

The conceptual flow is:
```text
Resume
   ↓
Embedding
   ↓
pgvector

Job Description
   ↓
Embedding
   ↓
pgvector

Resume Embedding
       ↓
Cosine Similarity
       ↓
Semantic Score
```

The exact embedding generation (currently planned VECTOR(1536)) and cosine-similarity SQL will be implemented later.\n