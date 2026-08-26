# DBMS Query Optimization Report

This report outlines the performance analysis conducted as part of the query optimization workflow, focusing on the differences between sequential scans and indexed access paths using `EXPLAIN ANALYZE`.

## 1. Candidate Indexes

Two relational indexes were selected based on real-world query patterns within the application:

1. **`idx_candidate_skills_skill`** on `candidate_skills(skill_id)`
   - **Purpose:** Optimizes queries searching for all candidates possessing a specific skill (a frequent matching operation).
2. **`idx_applications_job_status`** on `applications(job_id, status)`
   - **Purpose:** Optimizes recruiter dashboards filtering applicants for a specific job by their current status (e.g., 'shortlisted'). This is a composite index since both columns are typically queried together.

## 2. Optimization Queries & Results

*Note: PostgreSQL was unavailable in the local environment during this execution, so actual EXPLAIN ANALYZE metrics could not be dynamically captured. The below values are marked accordingly.*

| Query | Index | Before Plan | After Plan | Before Time | After Time | Observation |
| ----- | ----- | ----------- | ---------- | ----------: | ---------: | ----------- |
| **A. Skill Lookup** | `idx_candidate_skills_skill` | Seq Scan | NOT EXECUTED | NOT EXECUTED | NOT EXECUTED | PostgreSQL unavailable. |
| **B. App Lookup** | `idx_applications_job_status` | Seq Scan | NOT EXECUTED | NOT EXECUTED | NOT EXECUTED | PostgreSQL unavailable. |

### Dataset Consideration (Sequential Scans on Tiny Tables)
Even if executed on the current seed dataset, PostgreSQL's query optimizer relies on cost-based estimations. For very small tables (like our seed data), the engine often determines that loading an entire table into memory via a **Sequential Scan** requires fewer disk I/O operations than performing an **Index Scan** (which requires loading the index pages, finding the pointer, and then loading the table pages).

If PostgreSQL ignores the newly created indexes on the seed dataset, it is **not** a failure of index design, but rather a mathematically sound optimization choice by the DBMS. To see true index adoption, a larger dataset would need to be generated.

## 3. DBMS Viva Reference

### What does `EXPLAIN` do?
`EXPLAIN` shows the execution plan that the PostgreSQL query planner generates for a supplied statement. It provides estimates for execution costs, rows returned, and the scan methods the optimizer intends to use (like Seq Scan, Index Scan, Nested Loop, etc.) without actually executing the query.

### What does `EXPLAIN ANALYZE` add?
While `EXPLAIN` only plans, `EXPLAIN ANALYZE` actually *executes* the query and measures the true performance metrics (Execution Time, Planning Time, actual rows processed, and loops). This is essential for comparing the optimizer's estimates against physical reality.

### What is a Sequential Scan?
A Sequential Scan (or full table scan) occurs when the database reads every single row in a table sequentially from the disk to check if it matches the `WHERE` clause. It is efficient for tiny tables or when fetching a massive percentage of rows, but highly inefficient for targeted lookups in large datasets.

### What is an Index Scan?
An Index Scan traverses an organized data structure (like a B-Tree) to rapidly locate the exact memory addresses of rows satisfying a condition. It drastically reduces I/O for selective queries but adds write overhead during `INSERT`/`UPDATE`/`DELETE` operations.

### Why is `(job_id, status)` a composite index?
A composite index covers multiple columns simultaneously. Because recruiter queries heavily filter by *both* a specific job and a specific application status concurrently (e.g., `WHERE job_id = 1 AND status = 'shortlisted'`), a composite index allows the engine to resolve the entire `WHERE` clause directly from the index structure.

### Why index based on real query patterns?
Indexes consume disk space and slow down write operations. Adding an arbitrary index without a matching query pattern offers zero read benefits while incurring a permanent write penalty. Indexes must be deliberately designed to serve the database's actual heavy-read operations.
