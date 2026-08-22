-- database/queries/basic.sql
-- AI-Powered Smart Resume Repository
-- Basic DBMS queries demonstrating foundational SQL selection and filtering.

-- 1. List all candidates
-- Demonstrates a simple SELECT with an INNER JOIN to retrieve candidate user details.
SELECT c.candidate_id, u.name, u.email, c.phone, c.location
FROM candidates c
JOIN users u ON c.user_id = u.user_id;

-- 2. List all recruiters and their companies
-- Demonstrates fetching recruiter profiles along with their authentication name.
SELECT r.recruiter_id, u.name AS recruiter_name, r.company_name, r.designation
FROM recruiters r
JOIN users u ON r.user_id = u.user_id;

-- 3. List all available/open jobs
-- Demonstrates WHERE clause filtering for a specific enum status.
SELECT job_id, title, location, experience_required, created_at
FROM jobs
WHERE status = 'open'
ORDER BY created_at DESC;

-- 4. List all skills
-- Demonstrates a simple SELECT with ordering.
SELECT skill_id, skill_name, category
FROM skills
ORDER BY category, skill_name;

-- 5. List skills belonging to a specific candidate
-- Demonstrates joining a bridge table (candidate_skills) to resolve many-to-many relationships.
SELECT s.skill_name, cs.proficiency, cs.years_experience
FROM candidate_skills cs
JOIN skills s ON cs.skill_id = s.skill_id
WHERE cs.candidate_id = 1;

-- 6. List required skills for a specific job
-- Demonstrates filtering a bridge table by a boolean flag (is_required = TRUE).
SELECT s.skill_name, js.minimum_experience
FROM job_skills js
JOIN skills s ON js.skill_id = s.skill_id
WHERE js.job_id = 1 AND js.is_required = TRUE;

-- 7. Find all applications made by a specific candidate
-- Demonstrates joining to see what jobs a particular candidate applied for.
SELECT a.application_id, j.title, r.company_name, a.status, a.applied_at
FROM applications a
JOIN jobs j ON a.job_id = j.job_id
JOIN recruiters r ON j.recruiter_id = r.recruiter_id
WHERE a.candidate_id = 1
ORDER BY a.applied_at DESC;

-- 8. Find all applications received for a specific job
-- Demonstrates joining to see who applied to a particular job.
SELECT a.application_id, u.name AS applicant_name, a.status, a.applied_at
FROM applications a
JOIN candidates c ON a.candidate_id = c.candidate_id
JOIN users u ON c.user_id = u.user_id
WHERE a.job_id = 1
ORDER BY a.applied_at DESC;

-- 9. Update examples (Conceptual only, no destructive commands executed)
-- Demonstrates how an application status would be updated.
-- UPDATE applications 
-- SET status = 'shortlisted' 
-- WHERE application_id = 1;
