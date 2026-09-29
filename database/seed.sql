-- database/seed.sql
-- Synthetic Demonstration Seed Data for AI-Powered Smart Resume Repository
-- Note: Populates approximately 5 records in each core table for rich demonstration.

-- Clear existing data if re-running (respects FKs due to CASCADE)
TRUNCATE TABLE users, candidates, recruiters, skills, resumes, resume_extracted_data, jobs, candidate_skills, job_skills, applications, matches, application_status_history RESTART IDENTITY CASCADE;

-- ============================================================================
-- 1. USERS (1 Admin, 5 Candidates, 5 Recruiters = 11 Users)
-- ============================================================================
INSERT INTO users (name, email, password_hash, role) VALUES
('System Administrator', 'admin@resumematcher.com', '$2b$10$dummyhashadminsecurepwd123456789', 'admin'),        -- user_id: 1
('Alice Chen', 'alice.chen@example.com', '$2b$10$dummyhashpwdcandidates123456', 'candidate'),               -- user_id: 2
('Bob Martinez', 'bob.martinez@example.com', '$2b$10$dummyhashpwdcandidates123456', 'candidate'),           -- user_id: 3
('Charlie Davis', 'charlie.davis@example.com', '$2b$10$dummyhashpwdcandidates123456', 'candidate'),         -- user_id: 4
('David Kim', 'david.kim@example.com', '$2b$10$dummyhashpwdcandidates123456', 'candidate'),                 -- user_id: 5
('Emma Watson', 'emma.watson@example.com', '$2b$10$dummyhashpwdcandidates123456', 'candidate'),             -- user_id: 6
('Diana Prince', 'diana.prince@techcorp.io', '$2b$10$dummyhashpwdrecruiters123456', 'recruiter'),           -- user_id: 7
('Evan Wright', 'evan.wright@innovatellc.com', '$2b$10$dummyhashpwdrecruiters123456', 'recruiter'),         -- user_id: 8
('Fiona Gallagher', 'fiona.g@cloudscaletech.com', '$2b$10$dummyhashpwdrecruiters123456', 'recruiter'),     -- user_id: 9
('George Miller', 'george.m@datamindai.org', '$2b$10$dummyhashpwdrecruiters123456', 'recruiter'),           -- user_id: 10
('Hannah Abbott', 'hannah.a@nextgensolutions.net', '$2b$10$dummyhashpwdrecruiters123456', 'recruiter');    -- user_id: 11

-- ============================================================================
-- 2. CANDIDATES (5 Profiles)
-- ============================================================================
INSERT INTO candidates (user_id, phone, location, summary) VALUES
(2, '+1-555-0101', 'New York, NY', 'Senior Backend Engineer specializing in Python, PostgreSQL, and scalable distributed systems.'),           -- candidate_id: 1 (Alice)
(3, '+1-555-0102', 'San Francisco, CA', 'Frontend UI/UX Specialist with 4+ years creating responsive applications in React and TypeScript.'),   -- candidate_id: 2 (Bob)
(4, '+1-555-0103', 'Austin, TX', 'Full-Stack & DevOps Engineer experienced in Node.js, Docker, Kubernetes, and automated CI/CD.'),             -- candidate_id: 3 (Charlie)
(5, '+1-555-0104', 'Seattle, WA', 'Machine Learning & Data Engineer with strong Python, SQL, and data pipeline optimization skills.'),        -- candidate_id: 4 (David)
(6, '+1-555-0105', 'Boston, MA', 'Enterprise Java Developer with 6 years building microservices and cloud solutions.');                        -- candidate_id: 5 (Emma)

-- ============================================================================
-- 3. RECRUITERS (5 Profiles)
-- ============================================================================
INSERT INTO recruiters (user_id, company_name, designation) VALUES
(7, 'TechCorp Systems', 'Lead Technical Recruiter'),        -- recruiter_id: 1 (Diana)
(8, 'Innovate LLC', 'Head of Talent Acquisition'),          -- recruiter_id: 2 (Evan)
(9, 'CloudScale Technologies', 'Senior Technical Sourcer'), -- recruiter_id: 3 (Fiona)
(10, 'DataMind AI Labs', 'Director of Engineering Talent'),  -- recruiter_id: 4 (George)
(11, 'NextGen Enterprise Solutions', 'HR & Hiring Lead');   -- recruiter_id: 5 (Hannah)

-- ============================================================================
-- 4. SKILLS (12 Standard Skills Across Categories)
-- ============================================================================
INSERT INTO skills (skill_name, category) VALUES
('Python', 'Programming Language'),      -- skill_id: 1
('SQL', 'Database'),                     -- skill_id: 2
('React', 'Frontend Framework'),         -- skill_id: 3
('Node.js', 'Backend Framework'),        -- skill_id: 4
('Docker', 'DevOps'),                    -- skill_id: 5
('Java', 'Programming Language'),        -- skill_id: 6
('C++', 'Programming Language'),         -- skill_id: 7
('PostgreSQL', 'Database'),              -- skill_id: 8
('JavaScript', 'Programming Language'),  -- skill_id: 9
('Git', 'Tools'),                        -- skill_id: 10
('Machine Learning', 'Data Science'),    -- skill_id: 11
('AWS', 'Cloud & DevOps');               -- skill_id: 12

-- ============================================================================
-- 5. CANDIDATE_SKILLS (Detailed Skills Mappings for all 5 Candidates)
-- ============================================================================
-- Candidate 1: Alice (Backend Specialist)
INSERT INTO candidate_skills (candidate_id, skill_id, proficiency, years_experience) VALUES
(1, 1, 'expert', 5.0),        -- Python (5.0 yrs)
(1, 2, 'expert', 4.5),        -- SQL (4.5 yrs)
(1, 4, 'intermediate', 2.5),  -- Node.js (2.5 yrs)
(1, 8, 'expert', 5.0),        -- PostgreSQL (5.0 yrs)
(1, 10, 'advanced', 4.0);     -- Git (4.0 yrs)

-- Candidate 2: Bob (Frontend Specialist)
INSERT INTO candidate_skills (candidate_id, skill_id, proficiency, years_experience) VALUES
(2, 3, 'expert', 4.0),        -- React (4.0 yrs)
(2, 9, 'expert', 4.5),        -- JavaScript (4.5 yrs)
(2, 10, 'advanced', 3.5),     -- Git (3.5 yrs)
(2, 4, 'beginner', 1.0);      -- Node.js (1.0 yr)

-- Candidate 3: Charlie (Full-Stack / DevOps)
INSERT INTO candidate_skills (candidate_id, skill_id, proficiency, years_experience) VALUES
(3, 1, 'advanced', 3.0),      -- Python (3.0 yrs)
(3, 3, 'intermediate', 2.0),  -- React (2.0 yrs)
(3, 4, 'advanced', 3.5),      -- Node.js (3.5 yrs)
(3, 5, 'expert', 4.0),        -- Docker (4.0 yrs)
(3, 10, 'expert', 5.0),       -- Git (5.0 yrs)
(3, 12, 'advanced', 3.0);     -- AWS (3.0 yrs)

-- Candidate 4: David (Data & ML Engineer)
INSERT INTO candidate_skills (candidate_id, skill_id, proficiency, years_experience) VALUES
(4, 1, 'expert', 4.5),        -- Python (4.5 yrs)
(4, 2, 'advanced', 4.0),      -- SQL (4.0 yrs)
(4, 8, 'advanced', 3.0),      -- PostgreSQL (3.0 yrs)
(4, 11, 'expert', 4.0),       -- Machine Learning (4.0 yrs)
(4, 10, 'advanced', 3.5);     -- Git (3.5 yrs)

-- Candidate 5: Emma (Enterprise Java & Cloud)
INSERT INTO candidate_skills (candidate_id, skill_id, proficiency, years_experience) VALUES
(5, 6, 'expert', 6.0),        -- Java (6.0 yrs)
(5, 2, 'advanced', 4.0),      -- SQL (4.0 yrs)
(5, 5, 'intermediate', 2.5),  -- Docker (2.5 yrs)
(5, 12, 'advanced', 3.5),     -- AWS (3.5 yrs)
(5, 10, 'advanced', 5.0);     -- Git (5.0 yrs)

-- ============================================================================
-- 6. RESUMES (5 Resumes, 1 per Candidate)
-- ============================================================================
INSERT INTO resumes (candidate_id, file_name, file_url, raw_text) VALUES
(1, 'alice_backend_resume.pdf', 'https://storage.example.com/resumes/alice_backend.pdf', 
 'Alice Chen - Senior Backend Engineer. 5 years of experience building Python APIs, PostgreSQL databases, and high-throughput microservices.'),
(2, 'bob_frontend_resume.pdf', 'https://storage.example.com/resumes/bob_frontend.pdf', 
 'Bob Martinez - Frontend Developer. 4 years of expertise in React, TypeScript, JavaScript, CSS animations, and modern UI engineering.'),
(3, 'charlie_devops_resume.pdf', 'https://storage.example.com/resumes/charlie_devops.pdf', 
 'Charlie Davis - Full-Stack & DevOps Engineer. Proficient in Node.js, Docker containers, Kubernetes, AWS infrastructure, and CI/CD pipelines.'),
(4, 'david_ai_resume.pdf', 'https://storage.example.com/resumes/david_ai.pdf', 
 'David Kim - AI & Machine Learning Engineer. 4 years working with Python, ML models, feature engineering, SQL analytics, and PostgreSQL.'),
(5, 'emma_java_resume.pdf', 'https://storage.example.com/resumes/emma_java.pdf', 
 'Emma Watson - Senior Java Developer. 6 years experience in Spring Boot microservices, SQL databases, Docker, and AWS cloud architectures.');

-- ============================================================================
-- 7. RESUME_EXTRACTED_DATA (5 Structured AI-Parsed Resumes with JSONB)
-- ============================================================================
INSERT INTO resume_extracted_data (resume_id, education, experience, projects, certifications) VALUES
(1, 
 '[{"degree": "B.S. in Computer Science", "institution": "Columbia University", "start_year": 2015, "end_year": 2019}]'::jsonb, 
 '[{"role": "Senior Backend Engineer", "company": "DataSys Global", "years": 3}, {"role": "Software Developer", "company": "FinTech Core", "years": 2}]'::jsonb, 
 '[{"name": "Distributed Cache Engine", "description": "High throughput caching layer with Python & Redis"}]'::jsonb, 
 '[{"name": "PostgreSQL Certified Professional"}]'::jsonb
),
(2, 
 '[{"degree": "B.A. in Digital Arts & Design", "institution": "UC Berkeley", "start_year": 2016, "end_year": 2020}]'::jsonb, 
 '[{"role": "Lead UI Developer", "company": "PixelCraft Media", "years": 4}]'::jsonb, 
 '[{"name": "Interactive Analytics Dashboard", "description": "React-based real-time telemetry dashboard"}]'::jsonb, 
 '[{"name": "Meta Certified Front-End Developer"}]'::jsonb
),
(3, 
 '[{"degree": "B.S. in Software Engineering", "institution": "UT Austin", "start_year": 2017, "end_year": 2021}]'::jsonb, 
 '[{"role": "DevOps Engineer", "company": "CloudFlow Networks", "years": 4}]'::jsonb, 
 '[{"name": "Automated Multi-Cloud Deployer", "description": "Terraform and Docker based pipeline"}]'::jsonb, 
 '[{"name": "AWS Certified Solutions Architect"}]'::jsonb
),
(4, 
 '[{"degree": "M.S. in Data Science", "institution": "University of Washington", "start_year": 2018, "end_year": 2020}]'::jsonb, 
 '[{"role": "Machine Learning Engineer", "company": "VisionAI Lab", "years": 4}]'::jsonb, 
 '[{"name": "Semantic Resume Ranker", "description": "NLP pipeline using embeddings and vector search"}]'::jsonb, 
 '[{"name": "TensorFlow Developer Certificate"}]'::jsonb
),
(5, 
 '[{"degree": "B.S. in Information Systems", "institution": "Boston University", "start_year": 2014, "end_year": 2018}]'::jsonb, 
 '[{"role": "Senior Java Consultant", "company": "Apex Enterprise", "years": 6}]'::jsonb, 
 '[{"name": "Banking Transaction Gateway", "description": "High-resilience microservices in Java & Spring Boot"}]'::jsonb, 
 '[{"name": "Oracle Certified Java Professional"}]'::jsonb
);

-- ============================================================================
-- 8. JOBS (5 Diverse Job Postings by Recruiters)
-- ============================================================================
INSERT INTO jobs (recruiter_id, title, description, location, experience_required, status) VALUES
(1, 'Senior Backend Developer', 'Looking for an experienced backend developer with deep Python and database architecture skills.', 'Remote', 4.0, 'open'),  -- job_id: 1
(1, 'Frontend UI Specialist', 'Join our design system team to build state-of-the-art React and TypeScript user interfaces.', 'New York, NY', 3.0, 'open'),  -- job_id: 2
(2, 'DevOps & Cloud Engineer', 'Seeking a Docker and AWS specialist to manage CI/CD automation and container orchestration.', 'Austin, TX', 3.0, 'open'),     -- job_id: 3
(4, 'AI / Machine Learning Engineer', 'Build and deploy predictive ML models and data analysis pipelines using Python and SQL.', 'Seattle, WA', 3.5, 'open'),-- job_id: 4
(3, 'Enterprise Java Cloud Engineer', 'Develop high-performance Spring Boot microservices deployed on AWS cloud.', 'Boston, MA', 4.0, 'open');                -- job_id: 5

-- ============================================================================
-- 9. JOB_SKILLS (Required and Optional Skills for All 5 Jobs)
-- ============================================================================
-- Job 1: Senior Backend Developer
INSERT INTO job_skills (job_id, skill_id, is_required, minimum_experience) VALUES
(1, 1, TRUE, 4.0),  -- Python (Req, 4.0 yrs)
(1, 2, TRUE, 3.0),  -- SQL (Req, 3.0 yrs)
(1, 8, FALSE, 2.0), -- PostgreSQL (Opt, 2.0 yrs)
(1, 10, FALSE, 2.0);-- Git (Opt, 2.0 yrs)

-- Job 2: Frontend UI Specialist
INSERT INTO job_skills (job_id, skill_id, is_required, minimum_experience) VALUES
(2, 3, TRUE, 3.0),  -- React (Req, 3.0 yrs)
(2, 9, TRUE, 3.0),  -- JavaScript (Req, 3.0 yrs)
(2, 10, FALSE, 1.5);-- Git (Opt, 1.5 yrs)

-- Job 3: DevOps & Cloud Engineer
INSERT INTO job_skills (job_id, skill_id, is_required, minimum_experience) VALUES
(3, 5, TRUE, 3.0),  -- Docker (Req, 3.0 yrs)
(3, 12, TRUE, 2.5), -- AWS (Req, 2.5 yrs)
(3, 10, TRUE, 2.0), -- Git (Req, 2.0 yrs)
(3, 4, FALSE, 1.5); -- Node.js (Opt, 1.5 yrs)

-- Job 4: AI / Machine Learning Engineer
INSERT INTO job_skills (job_id, skill_id, is_required, minimum_experience) VALUES
(4, 1, TRUE, 3.5),  -- Python (Req, 3.5 yrs)
(4, 11, TRUE, 3.0), -- Machine Learning (Req, 3.0 yrs)
(4, 2, TRUE, 2.5),  -- SQL (Req, 2.5 yrs)
(4, 8, FALSE, 2.0); -- PostgreSQL (Opt, 2.0 yrs)

-- Job 5: Enterprise Java Cloud Engineer
INSERT INTO job_skills (job_id, skill_id, is_required, minimum_experience) VALUES
(5, 6, TRUE, 4.0),  -- Java (Req, 4.0 yrs)
(5, 2, TRUE, 3.0),  -- SQL (Req, 3.0 yrs)
(5, 12, FALSE, 2.0),-- AWS (Opt, 2.0 yrs)
(5, 5, FALSE, 2.0); -- Docker (Opt, 2.0 yrs)

-- ============================================================================
-- 10. APPLICATIONS (5+ Applications Across Candidates & Jobs)
-- ============================================================================
INSERT INTO applications (candidate_id, job_id, status, applied_at) VALUES
(1, 1, 'shortlisted', NOW() - INTERVAL '4 days'), -- Alice -> Senior Backend Developer
(2, 2, 'applied',     NOW() - INTERVAL '3 days'), -- Bob -> Frontend UI Specialist
(3, 3, 'applied',     NOW() - INTERVAL '2 days'), -- Charlie -> DevOps Engineer
(4, 4, 'hired',       NOW() - INTERVAL '6 days'), -- David -> AI/ML Engineer
(5, 5, 'applied',     NOW() - INTERVAL '1 day'),  -- Emma -> Enterprise Java Engineer
(3, 1, 'rejected',    NOW() - INTERVAL '5 days'); -- Charlie -> Senior Backend Developer (Rejected)

-- ============================================================================
-- 11. MATCHES (5 Computed Match Demonstration Records)
-- ============================================================================
INSERT INTO matches (candidate_id, job_id, skill_score, semantic_score, experience_score, final_score, matched_at) VALUES
(1, 1, 100.00, 92.50, 100.00, 97.75, NOW() - INTERVAL '4 days'), -- Alice for Backend Dev (Strong match)
(2, 2, 100.00, 89.00, 100.00, 96.70, NOW() - INTERVAL '3 days'), -- Bob for Frontend Dev (Strong match)
(3, 3, 100.00, 94.00, 100.00, 98.20, NOW() - INTERVAL '2 days'), -- Charlie for DevOps (Strong match)
(4, 4, 100.00, 96.00, 100.00, 98.80, NOW() - INTERVAL '6 days'), -- David for AI/ML (Top match)
(5, 5, 100.00, 91.00, 100.00, 97.30, NOW() - INTERVAL '1 day');  -- Emma for Java Engineer (Strong match)

-- ============================================================================
-- 12. APPLICATION_STATUS_HISTORY (5 Audit Trail Records)
-- ============================================================================
INSERT INTO application_status_history (application_id, old_status, new_status, changed_at) VALUES
(1, 'applied', 'shortlisted', NOW() - INTERVAL '2 days'),
(4, 'applied', 'shortlisted', NOW() - INTERVAL '4 days'),
(4, 'shortlisted', 'hired',   NOW() - INTERVAL '1 day'),
(6, 'applied', 'rejected',    NOW() - INTERVAL '3 days'),
(2, 'applied', 'applied',     NOW() - INTERVAL '3 days');
