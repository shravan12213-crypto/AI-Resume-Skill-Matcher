# Non-Functional Requirements

- **Explainability**: The matching engine must be explainable (show matched vs missing skills).
- **Data Integrity**: Enforced through foreign keys, primary keys, and constraints.
- **Performance**: Optimized using indexing and measured via `EXPLAIN ANALYZE`.
- **Security**: Managed via PostgreSQL roles (`GRANT`, `REVOKE`).
- **Reliability**: Ensured using database transactions (e.g., application process).\n