# Technology Stack

## Frontend
- React
- Vite
- TypeScript
- Tailwind CSS

## Backend
- Node.js
- Express
- TypeScript

## Database
- PostgreSQL
- Integer Identity / Serial Primary Keys
- Composite Primary Keys on Bridge Tables (`candidate_skills`, `job_skills`)
- Table-Valued PL/pgSQL Stored Functions (`get_top_candidates`)
- Transactional Stored Procedures (`apply_to_job`)
- PostgreSQL CLI / pgAdmin

## AI
- OpenAI API (Text extraction to structured JSON data only)
- Node.js PDF/DOCX text extraction library

## Validation
- Zod

## API Testing
- Postman

## Version Control
- Git / GitHub

## Explicitly NOT Using (OUT OF SCOPE)
- Pinecone, Weaviate, or Vector databases
- `pgvector` or embedding vectors (`VECTOR(1536)`)
- Cosine distance (`<=>`)
- LLM-based candidate ranking or scoring
- 50/30/20 formula
- Redis, Microservices, Kubernetes, Docker-heavy infrastructure
- Separate Python ML service, FastAPI, LangChain, RAG systems
- UUIDs for initial database design