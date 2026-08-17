-- database/seed.sql
-- Development Seed Data for AI-Powered Smart Resume Repository
-- Note: This script is intended to be run against a fresh development database.

-- Clear existing data if re-running (respects FKs due to CASCADE)
TRUNCATE TABLE users, candidates, recruiters, skills, resumes, resume_extracted_data, resume_embeddings, jobs, candidate_skills, job_skills, applications, matches, application_status_history RESTART IDENTITY CASCADE;

-- 1. USERS
-- 1 admin, 3 candidates, 2 recruiters
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin User', 'admin@example.com', 'dummy_hash', 'admin'),             -- user_id: 1
('Alice Candidate', 'alice@example.com', 'dummy_hash', 'candidate'),    -- user_id: 2
('Bob Candidate', 'bob@example.com', 'dummy_hash', 'candidate'),        -- user_id: 3
('Charlie Candidate', 'charlie@example.com', 'dummy_hash', 'candidate'),-- user_id: 4
('Diana Recruiter', 'diana@example.com', 'dummy_hash', 'recruiter'),    -- user_id: 5
('Evan Recruiter', 'evan@example.com', 'dummy_hash', 'recruiter');      -- user_id: 6

-- 2. CANDIDATES
-- Linked to user_id 2, 3, 4
INSERT INTO candidates (user_id, phone, location, summary) VALUES
(2, '555-0101', 'New York, NY', 'Experienced software engineer focusing on backend systems.'), -- candidate_id: 1
(3, '555-0102', 'San Francisco, CA', 'Frontend developer with a passion for UI/UX.'),        -- candidate_id: 2
(4, '555-0103', 'Austin, TX', 'Full-stack developer with devops experience.');               -- candidate_id: 3

-- 3. RECRUITERS
-- Linked to user_id 5, 6
INSERT INTO recruiters (user_id, company_name, designation) VALUES
(5, 'TechCorp', 'Senior Technical Recruiter'), -- recruiter_id: 1
(6, 'InnovateLLC', 'Talent Acquisition Lead'); -- recruiter_id: 2

-- 4. SKILLS
-- 10 useful skills
INSERT INTO skills (skill_name, category) VALUES
('Python', 'Programming Language'),      -- 1
('SQL', 'Database'),                     -- 2
('React', 'Frontend Framework'),         -- 3
('Node.js', 'Backend Framework'),        -- 4
('Docker', 'DevOps'),                    -- 5
('Java', 'Programming Language'),        -- 6
('C++', 'Programming Language'),         -- 7
('PostgreSQL', 'Database'),              -- 8
('JavaScript', 'Programming Language'),  -- 9
('Git', 'Tools');                        -- 10

-- 5. CANDIDATE_SKILLS
-- candidate_id 1 (Alice - Backend Focus)
INSERT INTO candidate_skills (candidate_id, skill_id, proficiency, years_experience) VALUES
(1, 1, 'expert', 5.0),
(1, 2, 'advanced', 4.0),
(1, 4, 'intermediate', 2.5),
(1, 8, 'expert', 5.0);

-- candidate_id 2 (Bob - Frontend Focus)
INSERT INTO candidate_skills (candidate_id, skill_id, proficiency, years_experience) VALUES
(2, 9, 'expert', 4.0),
(2, 3, 'expert', 3.5),
(2, 10, 'advanced', 4.0);

-- candidate_id 3 (Charlie - Full-stack & DevOps)
INSERT INTO candidate_skills (candidate_id, skill_id, proficiency, years_experience) VALUES
(3, 1, 'advanced', 3.0),
(3, 4, 'advanced', 3.0),
(3, 5, 'expert', 4.0),
(3, 10, 'expert', 5.0),
(3, 3, 'intermediate', 2.0);

-- 6. RESUMES
-- 1 resume per candidate
INSERT INTO resumes (candidate_id, file_name, file_url, raw_text) VALUES
(1, 'alice_resume.pdf', 'https://storage.example.com/alice_resume.pdf', 'Backend engineer. 5 years Python and PostgreSQL. Expert in API design.'), -- resume_id: 1
(2, 'bob_resume.pdf', 'https://storage.example.com/bob_resume.pdf', 'Frontend dev. React, JavaScript, HTML, CSS. Passionate about interfaces.'), -- resume_id: 2
(3, 'charlie_resume.pdf', 'https://storage.example.com/charlie_resume.pdf', 'Full-stack with heavy DevOps. Docker, Node.js, Python, React.');    -- resume_id: 3

-- 7. RESUME_EXTRACTED_DATA
-- Valid JSONB fields using Option B structure
INSERT INTO resume_extracted_data (resume_id, education, experience, projects, certifications) VALUES
(1, '[{"degree": "BS Computer Science", "institution": "State University"}]'::jsonb, '[{"role": "Backend Eng", "company": "DataSys", "years": 5}]'::jsonb, '[]'::jsonb, '[]'::jsonb),
(2, '[{"degree": "BA Design", "institution": "Art College"}]'::jsonb, '[{"role": "UI Developer", "company": "WebCorp", "years": 4}]'::jsonb, '[{"name": "Portfolio App"}]'::jsonb, '[]'::jsonb),
(3, '[]'::jsonb, '[{"role": "DevOps Eng", "company": "CloudNet", "years": 4}]'::jsonb, '[]'::jsonb, '[{"name": "AWS Certified"}]'::jsonb);

-- 8. RESUME_EMBEDDINGS
-- Intentionally left empty. Real embeddings will be generated later through the AI/embedding workflow.

-- 9. JOBS
-- 3 distinct jobs
INSERT INTO jobs (recruiter_id, title, description, location, experience_required, status) VALUES
(1, 'Senior Backend Developer', 'Looking for an experienced backend developer with strong Python and DB skills.', 'Remote', 4.0, 'open'), -- job_id: 1
(1, 'Frontend UI Specialist', 'Join our design team to build intuitive React interfaces.', 'New York, NY', 3.0, 'open'),             -- job_id: 2
(2, 'DevOps Engineer', 'Need a Docker expert to manage our infrastructure and CI/CD pipelines.', 'Austin, TX', 3.0, 'open');          -- job_id: 3

-- 10. JOB_SKILLS
-- Job 1 (Senior Backend Developer)
INSERT INTO job_skills (job_id, skill_id, is_required, minimum_experience) VALUES
(1, 1, TRUE, 4.0), -- Python required
(1, 2, TRUE, 3.0), -- SQL required
(1, 8, FALSE, 2.0); -- PostgreSQL optional

-- Job 2 (Frontend UI Specialist)
INSERT INTO job_skills (job_id, skill_id, is_required, minimum_experience) VALUES
(2, 3, TRUE, 3.0), -- React required
(2, 9, TRUE, 3.0), -- JavaScript required
(2, 10, FALSE, 1.0); -- Git optional

-- Job 3 (DevOps Engineer)
INSERT INTO job_skills (job_id, skill_id, is_required, minimum_experience) VALUES
(3, 5, TRUE, 3.0), -- Docker required
(3, 1, FALSE, 2.0), -- Python optional
(3, 10, TRUE, 2.0); -- Git required

-- 11. APPLICATIONS
-- 4 applications
INSERT INTO applications (candidate_id, job_id, status) VALUES
(1, 1, 'shortlisted'), -- Alice applied to Backend job
(2, 2, 'applied'),     -- Bob applied to Frontend job
(3, 3, 'applied'),     -- Charlie applied to DevOps job
(3, 1, 'rejected');    -- Charlie also applied to Backend job

-- 12. MATCHES
-- Intentionally left empty. Matching will be implemented later.

-- 13. APPLICATION_STATUS_HISTORY
-- Intentionally left empty. This table will later be populated by the trigger.
