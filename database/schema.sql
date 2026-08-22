-- database/schema.sql
-- AI-Powered Smart Resume Repository with Skill Matching
-- PostgreSQL Schema Implementation (Phase 2)

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. TABLES

-- Table 1: users
CREATE TABLE users (
    user_id       SERIAL PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(20) NOT NULL CHECK (role IN ('candidate', 'recruiter', 'admin')),
    created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);
-- Comment: users contains identity/authentication information only.

-- Table 2: candidates
CREATE TABLE candidates (
    candidate_id SERIAL PRIMARY KEY,
    user_id      INTEGER NOT NULL UNIQUE,
    phone        VARCHAR(20),
    location     VARCHAR(100),
    summary      TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
-- Comment: 1:1 relationship between USER and CANDIDATE enforced by UNIQUE on user_id.

-- Table 3: recruiters
CREATE TABLE recruiters (
    recruiter_id SERIAL PRIMARY KEY,
    user_id      INTEGER NOT NULL UNIQUE,
    company_name VARCHAR(150) NOT NULL,
    designation  VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
-- Comment: 1:1 relationship between USER and RECRUITER enforced by UNIQUE on user_id.

-- Table 4: skills
CREATE TABLE skills (
    skill_id   SERIAL PRIMARY KEY,
    skill_name VARCHAR(100) NOT NULL UNIQUE,
    category   VARCHAR(50)
);
-- Comment: Central skill vocabulary shared by candidates and jobs.

-- Table 5: resumes
CREATE TABLE resumes (
    resume_id    SERIAL PRIMARY KEY,
    candidate_id INTEGER NOT NULL,
    file_name    VARCHAR(255) NOT NULL,
    file_url     TEXT NOT NULL,
    raw_text     TEXT,
    uploaded_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (candidate_id) REFERENCES candidates(candidate_id) ON DELETE CASCADE
);
-- Comment: A candidate can have multiple resumes (1:N relationship).

-- Table 6: resume_extracted_data
CREATE TABLE resume_extracted_data (
    extraction_id  SERIAL PRIMARY KEY,
    resume_id      INTEGER NOT NULL UNIQUE,
    education      JSONB,
    experience     JSONB,
    projects       JSONB,
    certifications JSONB,
    extracted_at   TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (resume_id) REFERENCES resumes(resume_id) ON DELETE CASCADE
);
-- Comment: 1:1 relationship (UNIQUE resume_id). Deliberate denormalization for semi-structured AI output.

-- Table 7: resume_embeddings
CREATE TABLE resume_embeddings (
    embedding_id SERIAL PRIMARY KEY,
    resume_id    INTEGER NOT NULL UNIQUE,
    embedding    VECTOR(1536),
    created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (resume_id) REFERENCES resumes(resume_id) ON DELETE CASCADE
);
-- Comment: Semantic matching embedding via pgvector.

-- Table 8: jobs
CREATE TABLE jobs (
    job_id              SERIAL PRIMARY KEY,
    recruiter_id        INTEGER NOT NULL,
    title               VARCHAR(150) NOT NULL,
    description         TEXT,
    location            VARCHAR(100),
    experience_required NUMERIC(3,1) CHECK (experience_required >= 0),
    created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    status              VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
    FOREIGN KEY (recruiter_id) REFERENCES recruiters(recruiter_id) ON DELETE CASCADE
);

-- Table 9: job_embeddings
CREATE TABLE job_embeddings (
    embedding_id SERIAL PRIMARY KEY,
    job_id       INTEGER NOT NULL UNIQUE,
    embedding    VECTOR(1536),
    created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (job_id) REFERENCES jobs(job_id) ON DELETE CASCADE
);
-- Comment: Semantic matching embedding for job descriptions via pgvector.

-- Table 10: candidate_skills
CREATE TABLE candidate_skills (
    candidate_id     INTEGER NOT NULL,
    skill_id         INTEGER NOT NULL,
    proficiency      VARCHAR(20) CHECK (proficiency IN ('beginner', 'intermediate', 'advanced', 'expert')),
    years_experience NUMERIC(3,1) CHECK (years_experience >= 0),
    PRIMARY KEY (candidate_id, skill_id),
    FOREIGN KEY (candidate_id) REFERENCES candidates(candidate_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE
);
-- Comment: Bridge table representing CANDIDATE M --- N SKILL. Uses composite PK.

-- Table 11: job_skills
CREATE TABLE job_skills (
    job_id             INTEGER NOT NULL,
    skill_id           INTEGER NOT NULL,
    is_required        BOOLEAN NOT NULL DEFAULT TRUE,
    minimum_experience NUMERIC(3,1) CHECK (minimum_experience >= 0),
    PRIMARY KEY (job_id, skill_id),
    FOREIGN KEY (job_id) REFERENCES jobs(job_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE
);
-- Comment: Bridge table representing JOB M --- N SKILL. Uses composite PK.

-- Table 12: applications
CREATE TABLE applications (
    application_id SERIAL PRIMARY KEY,
    candidate_id   INTEGER NOT NULL,
    job_id         INTEGER NOT NULL,
    applied_at     TIMESTAMP NOT NULL DEFAULT NOW(),
    status         VARCHAR(20) NOT NULL DEFAULT 'applied' CHECK (status IN ('applied', 'shortlisted', 'rejected', 'hired')),
    UNIQUE (candidate_id, job_id),
    FOREIGN KEY (candidate_id) REFERENCES candidates(candidate_id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(job_id) ON DELETE CASCADE
);

-- Table 13: matches
CREATE TABLE matches (
    match_id         SERIAL PRIMARY KEY,
    candidate_id     INTEGER NOT NULL,
    job_id           INTEGER NOT NULL,
    skill_score      NUMERIC(5,2),
    semantic_score   NUMERIC(5,2),
    experience_score NUMERIC(5,2),
    final_score      NUMERIC(5,2),
    matched_at       TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (candidate_id, job_id),
    FOREIGN KEY (candidate_id) REFERENCES candidates(candidate_id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(job_id) ON DELETE CASCADE
);

-- Table 14: application_status_history
CREATE TABLE application_status_history (
    history_id     SERIAL PRIMARY KEY,
    application_id INTEGER NOT NULL,
    old_status     VARCHAR(20),
    new_status     VARCHAR(20) NOT NULL,
    changed_at     TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (application_id) REFERENCES applications(application_id) ON DELETE CASCADE
);
-- Comment: This table will later be populated by a trigger.
