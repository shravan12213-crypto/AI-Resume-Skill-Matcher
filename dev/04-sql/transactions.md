# Transactions

Demonstrate transactions meaningfully.

Example (`apply_to_job`):
```sql
BEGIN;
-- Insert application
-- Perform related match operation
COMMIT;
-- If failure: ROLLBACK;
```

Must document: Atomicity, Consistency, Isolation, Durability, and how it relates to our system.\n