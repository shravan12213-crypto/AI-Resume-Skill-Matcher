# Scope

## In Scope
- User authentication and role management (Candidate, Recruiter, Admin).
- Candidate resume upload and AI-driven text extraction.
- Structured storage of candidate skills, experience, and job postings.
- SQL-based calculation of candidate-job match percentages (70/30 weighting).
- Implementation of 3 stored procedures, 1-2 triggers, functions, and 2 database views.
- Explainable matching results indicating matched and missing skills.
- Integer primary keys and composite keys for bridge tables.

## Out of Scope
- Embeddings and Vector databases (Pinecone, pgvector).
- Complex Machine Learning pipelines, LangChain, or RAG systems.
- Advanced Microservices, Docker-heavy infrastructure, or Kubernetes.
- Using AI to make the final candidate ranking decision or final match score.
- UUID primary keys (unless a future decision explicitly changes this).
- Vector search or LLM candidate ranking.

## Advanced DBMS Features Checklist
The project must demonstrate:
### Database Design
- [ ] ER Diagram
- [ ] Relational Schema
- [ ] Normalization up to 3NF
- [ ] Primary Keys (Integer)
- [ ] Foreign Keys
- [ ] Composite Keys
- [ ] Constraints

### SQL
- [ ] CRUD
- [ ] Joins
- [ ] Aggregations
- [ ] GROUP BY
- [ ] HAVING
- [ ] Subqueries
- [ ] EXISTS
- [ ] NOT EXISTS
- [ ] CASE
- [ ] Conditional aggregation

### Advanced DBMS
- [ ] Views (2 confirmed)
- [ ] Functions
- [ ] Stored Procedures (3 confirmed)
- [ ] Triggers (1-2 confirmed)
- [ ] Transactions
- [ ] Indexes (2-3 realistic)
- [ ] EXPLAIN ANALYZE
- [ ] Database Roles
- [ ] GRANT
- [ ] REVOKE\n