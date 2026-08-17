-- database/seed.sql
-- Minimal seed data for AI-Powered Smart Resume Repository

-- Users
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin User', 'admin@example.com', 'dummy_hash', 'admin'),
('Alice Candidate', 'alice@example.com', 'dummy_hash', 'candidate'),
('Bob Recruiter', 'bob@example.com', 'dummy_hash', 'recruiter');

-- Skills
INSERT INTO skills (skill_name, category) VALUES
('Python', 'Programming Language'),
('SQL', 'Database'),
('React', 'Frontend Framework'),
('Node.js', 'Backend Framework'),
('Docker', 'DevOps');
