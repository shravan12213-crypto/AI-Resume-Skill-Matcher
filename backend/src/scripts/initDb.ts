import fs from 'fs';
import path from 'path';
import { query } from '../config/db';

async function init() {
  console.log('--- Initializing Database ---');

  const dbDir = path.resolve(__dirname, '../../../database');

  // Check if vector extension is available
  let hasVector = false;
  try {
    await query('CREATE EXTENSION IF NOT EXISTS vector;');
    hasVector = true;
    console.log('✅ pgvector extension available');
  } catch (err: any) {
    console.log('ℹ️ pgvector extension not available, setting up purely relational schema without pgvector');
  }

  // 1. Schema
  console.log('1. Applying schema...');
  const schemaSql = `
    CREATE TABLE IF NOT EXISTS users (
        user_id       SERIAL PRIMARY KEY,
        name          VARCHAR(100) NOT NULL,
        email         VARCHAR(150) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role          VARCHAR(20) NOT NULL CHECK (role IN ('candidate', 'recruiter', 'admin')),
        created_at    TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS candidates (
        candidate_id SERIAL PRIMARY KEY,
        user_id      INTEGER NOT NULL UNIQUE,
        phone        VARCHAR(20),
        location     VARCHAR(100),
        summary      TEXT,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS recruiters (
        recruiter_id SERIAL PRIMARY KEY,
        user_id      INTEGER NOT NULL UNIQUE,
        company_name VARCHAR(150) NOT NULL,
        designation  VARCHAR(100),
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS skills (
        skill_id   SERIAL PRIMARY KEY,
        skill_name VARCHAR(100) NOT NULL UNIQUE,
        category   VARCHAR(50)
    );

    CREATE TABLE IF NOT EXISTS resumes (
        resume_id    SERIAL PRIMARY KEY,
        candidate_id INTEGER NOT NULL,
        file_name    VARCHAR(255) NOT NULL,
        file_url     TEXT NOT NULL,
        raw_text     TEXT,
        uploaded_at  TIMESTAMP NOT NULL DEFAULT NOW(),
        FOREIGN KEY (candidate_id) REFERENCES candidates(candidate_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS resume_extracted_data (
        extraction_id  SERIAL PRIMARY KEY,
        resume_id      INTEGER NOT NULL UNIQUE,
        education      JSONB,
        experience     JSONB,
        projects       JSONB,
        certifications JSONB,
        extracted_at   TIMESTAMP NOT NULL DEFAULT NOW(),
        FOREIGN KEY (resume_id) REFERENCES resumes(resume_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS jobs (
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

    CREATE TABLE IF NOT EXISTS candidate_skills (
        candidate_id     INTEGER NOT NULL,
        skill_id         INTEGER NOT NULL,
        proficiency      VARCHAR(20) CHECK (proficiency IN ('beginner', 'intermediate', 'advanced', 'expert')),
        years_experience NUMERIC(3,1) CHECK (years_experience >= 0),
        PRIMARY KEY (candidate_id, skill_id),
        FOREIGN KEY (candidate_id) REFERENCES candidates(candidate_id) ON DELETE CASCADE,
        FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS job_skills (
        job_id             INTEGER NOT NULL,
        skill_id           INTEGER NOT NULL,
        is_required        BOOLEAN NOT NULL DEFAULT TRUE,
        minimum_experience NUMERIC(3,1) CHECK (minimum_experience >= 0),
        PRIMARY KEY (job_id, skill_id),
        FOREIGN KEY (job_id) REFERENCES jobs(job_id) ON DELETE CASCADE,
        FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS applications (
        application_id SERIAL PRIMARY KEY,
        candidate_id   INTEGER NOT NULL,
        job_id         INTEGER NOT NULL,
        applied_at     TIMESTAMP NOT NULL DEFAULT NOW(),
        status         VARCHAR(20) NOT NULL DEFAULT 'applied' CHECK (status IN ('applied', 'shortlisted', 'rejected', 'hired')),
        UNIQUE (candidate_id, job_id),
        FOREIGN KEY (candidate_id) REFERENCES candidates(candidate_id) ON DELETE CASCADE,
        FOREIGN KEY (job_id) REFERENCES jobs(job_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS matches (
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

    CREATE TABLE IF NOT EXISTS application_status_history (
        history_id     SERIAL PRIMARY KEY,
        application_id INTEGER NOT NULL,
        old_status     VARCHAR(20),
        new_status     VARCHAR(20) NOT NULL,
        changed_at     TIMESTAMP NOT NULL DEFAULT NOW(),
        FOREIGN KEY (application_id) REFERENCES applications(application_id) ON DELETE CASCADE
    );
  `;
  await query(schemaSql);
  console.log('✅ Schema created.');

  // 2. Views
  console.log('2. Applying views...');
  const viewsSql = fs.readFileSync(path.join(dbDir, 'views.sql'), 'utf-8');
  await query(viewsSql);
  console.log('✅ Views created.');

  // 3. Triggers
  console.log('3. Applying triggers...');
  const triggersSql = fs.readFileSync(path.join(dbDir, 'triggers.sql'), 'utf-8');
  await query(triggersSql);
  console.log('✅ Triggers created.');

  // 4. Functions / Procedures
  console.log('4. Applying functions & procedures...');
  const proceduresSql = `
    CREATE OR REPLACE FUNCTION calculate_skill_match(
        p_candidate_id INT,
        p_job_id INT
    )
    RETURNS NUMERIC(5,2) AS $$
    DECLARE
        v_total_required NUMERIC;
        v_matched_required NUMERIC;
        v_score NUMERIC(5,2);
    BEGIN
        SELECT COUNT(*)
        INTO v_total_required
        FROM job_skills
        WHERE job_id = p_job_id 
          AND is_required = TRUE;

        IF v_total_required = 0 THEN
            RETURN 0.00;
        END IF;

        SELECT COUNT(*)
        INTO v_matched_required
        FROM job_skills js
        JOIN candidate_skills cs ON js.skill_id = cs.skill_id
        WHERE js.job_id = p_job_id
          AND js.is_required = TRUE
          AND cs.candidate_id = p_candidate_id;

        v_score := ROUND((v_matched_required / v_total_required) * 100.00, 2);
        RETURN v_score;
    END;
    $$ LANGUAGE plpgsql;

    CREATE OR REPLACE PROCEDURE apply_to_job(
        p_candidate_id INT,
        p_job_id INT
    )
    LANGUAGE plpgsql
    AS $$
    DECLARE
        v_candidate_exists BOOLEAN;
        v_job_status VARCHAR(20);
        v_already_applied BOOLEAN;
    BEGIN
        SELECT EXISTS (
            SELECT 1 FROM candidates WHERE candidate_id = p_candidate_id
        ) INTO v_candidate_exists;

        IF NOT v_candidate_exists THEN
            RAISE EXCEPTION 'Candidate ID % does not exist.', p_candidate_id;
        END IF;

        SELECT status INTO v_job_status
        FROM jobs
        WHERE job_id = p_job_id;

        IF v_job_status IS NULL THEN
            RAISE EXCEPTION 'Job ID % does not exist.', p_job_id;
        END IF;

        IF v_job_status <> 'open' THEN
            RAISE EXCEPTION 'Job ID % is currently % and not accepting applications.', p_job_id, v_job_status;
        END IF;

        SELECT EXISTS (
            SELECT 1 FROM applications 
            WHERE candidate_id = p_candidate_id AND job_id = p_job_id
        ) INTO v_already_applied;

        IF v_already_applied THEN
            RAISE EXCEPTION 'Candidate ID % has already applied to Job ID %.', p_candidate_id, p_job_id;
        END IF;

        INSERT INTO applications (candidate_id, job_id, applied_at, status)
        VALUES (p_candidate_id, p_job_id, NOW(), 'applied');

        COMMIT;
    END;
    $$;

    CREATE OR REPLACE FUNCTION get_top_candidates(
        p_job_id INT
    )
    RETURNS TABLE (
        candidate_id INT,
        candidate_name VARCHAR,
        skill_score NUMERIC(5,2),
        semantic_score NUMERIC(5,2),
        experience_score NUMERIC(5,2),
        final_score NUMERIC(5,2)
    ) 
    LANGUAGE plpgsql
    AS $$
    DECLARE
        v_job_exists BOOLEAN;
        v_req_exp NUMERIC;
    BEGIN
        SELECT EXISTS (SELECT 1 FROM jobs WHERE job_id = p_job_id) INTO v_job_exists;
        IF NOT v_job_exists THEN
            RAISE EXCEPTION 'Job ID % does not exist.', p_job_id;
        END IF;

        SELECT COALESCE(experience_required, 0) INTO v_req_exp
        FROM jobs
        WHERE job_id = p_job_id;

        RETURN QUERY
        WITH candidate_scores AS (
            SELECT 
                c.candidate_id,
                u.name AS candidate_name,
                calculate_skill_match(c.candidate_id, p_job_id) AS skill_score,
                0.00::NUMERIC(5,2) AS semantic_score,
                (
                    SELECT 
                        CASE 
                            WHEN v_req_exp = 0 THEN 100.00
                            WHEN COALESCE(MAX(cs.years_experience), 0) >= v_req_exp THEN 100.00
                            ELSE ROUND((COALESCE(MAX(cs.years_experience), 0) / v_req_exp) * 100.00, 2)
                        END
                    FROM candidate_skills cs
                    JOIN job_skills js ON cs.skill_id = js.skill_id
                    WHERE cs.candidate_id = c.candidate_id AND js.job_id = p_job_id
                )::NUMERIC(5,2) AS experience_score
            FROM candidates c
            JOIN users u ON c.user_id = u.user_id
        )
        SELECT 
            cs.candidate_id,
            cs.candidate_name,
            cs.skill_score,
            cs.semantic_score,
            cs.experience_score,
            ( (cs.skill_score * 0.70) + (cs.experience_score * 0.30) )::NUMERIC(5,2) AS final_score
        FROM candidate_scores cs
        ORDER BY final_score DESC NULLS LAST, cs.candidate_id ASC;
    END;
    $$;
  `;
  await query(proceduresSql);
  console.log('✅ Functions & procedures created.');

  // 5. Relational Indexes
  console.log('5. Applying relational indexes...');
  const indexesSql = fs.readFileSync(path.join(dbDir, 'relational_indexes.sql'), 'utf-8');
  await query(indexesSql);
  console.log('✅ Relational indexes created.');

  // 6. Seed Data
  console.log('6. Seeding database...');
  const seedSql = fs.readFileSync(path.join(dbDir, 'seed.sql'), 'utf-8');
  // If resume_embeddings is not created, remove resume_embeddings from truncate in seedSql
  const cleanSeed = seedSql.replace('resume_embeddings, ', '');
  await query(cleanSeed);
  console.log('✅ Database seeded successfully!');

  console.log('🎉 Setup complete!');
  process.exit(0);
}

init().catch((err) => {
  console.error('❌ Init error:', err);
  process.exit(1);
});
