# API Design

The backend implements RESTful API endpoints organized into functional modules built with Express & TypeScript:

## 1. Recruiters (`/api/recruiters`)
- **`GET /api/recruiters/:id`**: Returns recruiter and company profile details.
- **`GET /api/recruiters/:id/jobs`**: Returns all jobs posted by the recruiter along with application counters and average match scores from `recruiter_job_summary_view`.

## 2. Jobs (`/api/jobs`)
- **`GET /api/jobs`**: Lists open jobs (supports `?status=open&search=term`).
- **`GET /api/jobs/:id`**: Returns full job details including required and optional `job_skills`.
- **`POST /api/jobs`**: Atomically creates a job and its skill requirements within a single database transaction (`BEGIN ... COMMIT`).
- **`PATCH /api/jobs/:id/status`**: Updates status (`open` | `closed`).

## 3. Applications (`/api/applications`)
- **`POST /api/applications`**: Invokes the `apply_to_job(candidate_id, job_id)` stored procedure, validates business rules, creates application, and computes match score.
- **`GET /api/applications/job/:jobId`**: Returns all applicant profiles, latest resume links, and scores for a specific job.
- **`PATCH /api/applications/:id/status`**: Updates application status (`applied`, `shortlisted`, `rejected`, `hired`), firing the `trg_application_status_history` trigger.
- **`GET /api/applications/:id/history`**: Returns the audit trail from `application_status_history`.

## 4. Matching Engine (`/api/matching`)
- **`GET /api/matching/job/:jobId/top-candidates`**: Returns ranked candidate list by calling `get_top_candidates(job_id, limit)`.
- **`GET /api/matching/explain/job/:jobId/candidate/:candidateId`**: Returns explainable breakdown with matched skills ($\checkmark$), missing required skills ($\times$), experience score, and 50/30/20 weights.
- **`POST /api/matching/calculate`**: Triggers `calculate_candidate_job_match(candidate_id, job_id)` in PostgreSQL.

## 5. Healthcheck (`/api/health`)
- **`GET /api/health`**: Returns API and PostgreSQL connection status.