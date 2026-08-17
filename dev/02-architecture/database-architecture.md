# Database Architecture

The database is built on PostgreSQL and serves as the hero of the system.

- **Storage**: Relational storage of users, candidates, recruiters, jobs, and skills.
- **Embeddings**: Stored natively in PostgreSQL via pgvector.
- **Matching**: Handled via SQL queries mapping `candidate_skills` to `job_skills` and pgvector cosine similarity.
- **Business Logic**: Partially implemented in the database using stored procedures, triggers, and functions.
- **Performance**: Tuned using appropriate indexes.
- **Security**: Controlled at the database level using PostgreSQL roles and permissions.\n