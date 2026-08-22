-- database/queries/complex.sql
-- AI-Powered Smart Resume Repository
-- Meaningful DBMS-focused queries demonstrating advanced SQL features.

-- ============================================================================
-- Query 1 — Candidate skill count
-- Demonstrates JOIN and GROUP BY to count skills possessed by each candidate.
-- ============================================================================
SELECT u.name, COUNT(cs.skill_id) AS total_skills
FROM candidates c
JOIN users u ON c.user_id = u.user_id
LEFT JOIN candidate_skills cs ON c.candidate_id = cs.candidate_id
GROUP BY c.candidate_id, u.name;


-- ============================================================================
-- Query 2 — Candidates with multiple skills
-- Demonstrates GROUP BY with a HAVING clause to filter aggregated results.
-- ============================================================================
SELECT u.name, COUNT(cs.skill_id) AS total_skills
FROM candidates c
JOIN users u ON c.user_id = u.user_id
JOIN candidate_skills cs ON c.candidate_id = cs.candidate_id
GROUP BY c.candidate_id, u.name
HAVING COUNT(cs.skill_id) > 2;


-- ============================================================================
-- Query 3 — Candidate application summary
-- Demonstrates JOIN, GROUP BY, and Conditional Aggregation (CASE).
-- Shows a dashboard view of a candidate's applications.
-- ============================================================================
SELECT u.name,
       COUNT(a.application_id) AS total_applications,
       COUNT(CASE WHEN a.status = 'shortlisted' THEN 1 END) AS shortlisted_applications,
       COUNT(CASE WHEN a.status = 'rejected' THEN 1 END) AS rejected_applications
FROM candidates c
JOIN users u ON c.user_id = u.user_id
LEFT JOIN applications a ON c.candidate_id = a.candidate_id
GROUP BY c.candidate_id, u.name;


-- ============================================================================
-- Query 4 — Jobs and required skill count
-- Demonstrates JOIN, GROUP BY, and Conditional Aggregation for jobs.
-- ============================================================================
SELECT j.title, r.company_name,
       COUNT(CASE WHEN js.is_required = TRUE THEN 1 END) AS required_skills_count
FROM jobs j
JOIN recruiters r ON j.recruiter_id = r.recruiter_id
LEFT JOIN job_skills js ON j.job_id = js.job_id
GROUP BY j.job_id, j.title, r.company_name;


-- ============================================================================
-- Query 5 — Candidates matching a particular skill
-- Demonstrates multiple JOINs and WHERE clause filtering.
-- ============================================================================
SELECT u.name, s.skill_name, cs.proficiency, cs.years_experience
FROM candidates c
JOIN users u ON c.user_id = u.user_id
JOIN candidate_skills cs ON c.candidate_id = cs.candidate_id
JOIN skills s ON cs.skill_id = s.skill_id
WHERE s.skill_name = 'Python';


-- ============================================================================
-- Query 6 — Candidates who possess ALL required skills of a job
-- Demonstrates GROUP BY and HAVING comparing against a subquery count.
-- (e.g., for job_id = 1)
-- ============================================================================
SELECT c.candidate_id, u.name
FROM candidates c
JOIN users u ON c.user_id = u.user_id
JOIN candidate_skills cs ON c.candidate_id = cs.candidate_id
JOIN job_skills js ON cs.skill_id = js.skill_id
WHERE js.job_id = 1 AND js.is_required = TRUE
GROUP BY c.candidate_id, u.name
HAVING COUNT(cs.skill_id) = (
    SELECT COUNT(*) 
    FROM job_skills 
    WHERE job_id = 1 AND is_required = TRUE
);


-- ============================================================================
-- Query 7 — Candidates missing at least one required skill
-- Demonstrates NOT EXISTS combined with a CROSS JOIN to identify gaps.
-- Given a job_id = 1, show candidates and the required skills they are missing.
-- ============================================================================
SELECT c.candidate_id, u.name, s.skill_name AS missing_skill
FROM candidates c
JOIN users u ON c.user_id = u.user_id
CROSS JOIN job_skills js
JOIN skills s ON js.skill_id = s.skill_id
WHERE js.job_id = 1 AND js.is_required = TRUE
  AND NOT EXISTS (
      SELECT 1 
      FROM candidate_skills cs 
      WHERE cs.candidate_id = c.candidate_id 
        AND cs.skill_id = js.skill_id
  );


-- ============================================================================
-- Query 8 — Highest-experience candidate per skill
-- Demonstrates a Window Function (RANK) enclosed in a CTE (WITH).
-- ============================================================================
WITH RankedSkills AS (
    SELECT s.skill_name, 
           u.name AS candidate_name, 
           cs.years_experience,
           RANK() OVER(PARTITION BY s.skill_id ORDER BY cs.years_experience DESC) as rnk
    FROM skills s
    JOIN candidate_skills cs ON s.skill_id = cs.skill_id
    JOIN candidates c ON cs.candidate_id = c.candidate_id
    JOIN users u ON c.user_id = u.user_id
)
SELECT skill_name, candidate_name, years_experience
FROM RankedSkills
WHERE rnk = 1;


-- ============================================================================
-- Query 9 — Jobs with no applications
-- Demonstrates NOT EXISTS to find open jobs without any applications.
-- ============================================================================
SELECT j.job_id, j.title
FROM jobs j
WHERE j.status = 'open' 
  AND NOT EXISTS (
      SELECT 1 
      FROM applications a 
      WHERE a.job_id = j.job_id
  );


-- ============================================================================
-- Query 10 — Candidates who have never applied
-- Demonstrates LEFT JOIN with NULL filtering as an alternative to NOT EXISTS.
-- ============================================================================
SELECT c.candidate_id, u.name
FROM candidates c
JOIN users u ON c.user_id = u.user_id
LEFT JOIN applications a ON c.candidate_id = a.candidate_id
WHERE a.application_id IS NULL;


-- ============================================================================
-- Query 11 — Recruiter job summary
-- Demonstrates multiple LEFT JOINs with a pre-aggregating subquery 
-- to prevent counts from being incorrectly multiplied.
-- ============================================================================
SELECT r.company_name,
       COUNT(j.job_id) AS total_jobs_posted,
       COALESCE(SUM(app_counts.total_apps), 0) AS total_applications_received
FROM recruiters r
LEFT JOIN jobs j ON r.recruiter_id = j.recruiter_id
LEFT JOIN (
    SELECT job_id, COUNT(application_id) AS total_apps
    FROM applications
    GROUP BY job_id
) app_counts ON j.job_id = app_counts.job_id
GROUP BY r.recruiter_id, r.company_name;


-- ============================================================================
-- Query 12 — Candidate profile summary
-- Demonstrates STRING_AGG and a LATERAL join for complex aggregation.
-- ============================================================================
SELECT u.name, c.location, res.file_name AS latest_resume,
       STRING_AGG(s.skill_name, ', ') AS aggregated_skills
FROM candidates c
JOIN users u ON c.user_id = u.user_id
LEFT JOIN candidate_skills cs ON c.candidate_id = cs.candidate_id
LEFT JOIN skills s ON cs.skill_id = s.skill_id
LEFT JOIN LATERAL (
    SELECT file_name 
    FROM resumes r 
    WHERE r.candidate_id = c.candidate_id
    ORDER BY r.uploaded_at DESC 
    LIMIT 1
) res ON TRUE
GROUP BY c.candidate_id, u.name, c.location, res.file_name;
