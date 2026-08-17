# Constraints

- **Primary Keys**: Integer identity/serial for main entities. Ensure row uniqueness.
- **Composite Keys**: Bridge/associative tables representing many-to-many relationships (e.g., `candidate_skills`, `job_skills`) must use composite primary keys. This naturally enforces uniqueness so a candidate cannot have the same skill added twice.
- **Foreign Keys**: Ensure referential integrity.
- **Unique Constraints**: e.g., `email` in `users`.
- **Check Constraints**: e.g., `proficiency` between 1 and 5, or `status` in defined ENUM.
- **Not Null**: Required fields.\n