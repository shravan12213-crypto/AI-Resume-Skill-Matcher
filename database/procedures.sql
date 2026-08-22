-- database/procedures.sql
-- AI-Powered Smart Resume Repository
-- Approved PostgreSQL Functions & Procedures

-- ============================================================================
-- 1. FUNCTION: calculate_skill_match
-- Calculates the SQL-based skill match percentage (0 to 100) between one 
-- candidate and one job based solely on 'required' skills.
-- ============================================================================

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
    -- Step 1: Count total required skills for the given job
    SELECT COUNT(*)
    INTO v_total_required
    FROM job_skills
    WHERE job_id = p_job_id 
      AND is_required = TRUE;

    -- Edge Case 1: If job has zero required skills, return 0 to prevent division by zero
    IF v_total_required = 0 THEN
        RETURN 0.00;
    END IF;

    -- Step 2: Count how many of those required skills the candidate possesses
    SELECT COUNT(*)
    INTO v_matched_required
    FROM job_skills js
    JOIN candidate_skills cs ON js.skill_id = cs.skill_id
    WHERE js.job_id = p_job_id
      AND js.is_required = TRUE
      AND cs.candidate_id = p_candidate_id;

    -- Step 3: Calculate the percentage and round to 2 decimal places
    v_score := ROUND((v_matched_required / v_total_required) * 100.00, 2);

    RETURN v_score;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- 2. PROCEDURE: apply_to_job
-- Transactional procedure to submit a job application safely.
-- Enforces referential integrity, status checks, and uniqueness constraints.
-- ============================================================================

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
    -- 1. Verify candidate exists
    SELECT EXISTS (
        SELECT 1 FROM candidates WHERE candidate_id = p_candidate_id
    ) INTO v_candidate_exists;

    IF NOT v_candidate_exists THEN
        RAISE EXCEPTION 'Candidate ID % does not exist.', p_candidate_id;
    END IF;

    -- 2. Verify job exists and retrieve status
    SELECT status INTO v_job_status
    FROM jobs
    WHERE job_id = p_job_id;

    IF v_job_status IS NULL THEN
        RAISE EXCEPTION 'Job ID % does not exist.', p_job_id;
    END IF;

    -- 3. Verify job is currently open
    IF v_job_status <> 'open' THEN
        RAISE EXCEPTION 'Job ID % is currently % and not accepting applications.', p_job_id, v_job_status;
    END IF;

    -- 4. Prevent duplicate applications 
    -- (Compliments the UNIQUE(candidate_id, job_id) constraint proactively)
    SELECT EXISTS (
        SELECT 1 FROM applications 
        WHERE candidate_id = p_candidate_id AND job_id = p_job_id
    ) INTO v_already_applied;

    IF v_already_applied THEN
        RAISE EXCEPTION 'Candidate ID % has already applied to Job ID %.', p_candidate_id, p_job_id;
    END IF;

    -- 5. Insert the application
    INSERT INTO applications (candidate_id, job_id, applied_at, status)
    VALUES (p_candidate_id, p_job_id, NOW(), 'applied');

    -- Demonstrate explicit transaction boundary
    COMMIT;
END;
$$;


-- ============================================================================
-- 3. FUNCTION: get_top_candidates
-- Returns ranked candidates for a given job using the exact project formula.
-- Uses PostgreSQL FUNCTION semantics to properly return a tabular result set.
-- ============================================================================

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
    -- 1. Validate Job Exists
    SELECT EXISTS (SELECT 1 FROM jobs WHERE job_id = p_job_id) INTO v_job_exists;
    IF NOT v_job_exists THEN
        RAISE EXCEPTION 'Job ID % does not exist.', p_job_id;
    END IF;

    -- 2. Fetch required experience for the job
    SELECT COALESCE(experience_required, 0) INTO v_req_exp
    FROM jobs
    WHERE job_id = p_job_id;

    -- 3. Calculate Scores and Return Ranked Candidates
    RETURN QUERY
    WITH target_job_emb AS (
        SELECT embedding
        FROM job_embeddings
        WHERE job_id = p_job_id
    ),
    latest_resumes AS (
        SELECT DISTINCT ON (r.candidate_id)
            r.candidate_id,
            r.resume_id
        FROM resumes r
        ORDER BY r.candidate_id, r.uploaded_at DESC
    ),
    candidate_scores AS (
        SELECT 
            c.candidate_id,
            u.name AS candidate_name,
            
            -- A. Skill Score (Directly reuses existing function)
            calculate_skill_match(c.candidate_id, p_job_id) AS skill_score,
            
            -- B. Semantic Score
            GREATEST(0.00, LEAST(100.00, (1 - (re.embedding <=> tje.embedding)) * 100))::NUMERIC(5,2) AS semantic_score,
            
            -- C. Experience Score
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
        LEFT JOIN latest_resumes lr ON lr.candidate_id = c.candidate_id
        LEFT JOIN resume_embeddings re ON re.resume_id = lr.resume_id
        LEFT JOIN target_job_emb tje ON TRUE
    )
    SELECT 
        cs.candidate_id,
        cs.candidate_name,
        cs.skill_score,
        cs.semantic_score,
        cs.experience_score,
        
        -- D. Final Score 
        ( (cs.skill_score * 0.50) + (cs.semantic_score * 0.30) + (cs.experience_score * 0.20) )::NUMERIC(5,2) AS final_score
    FROM candidate_scores cs
    ORDER BY final_score DESC NULLS LAST, cs.candidate_id ASC;
END;
$$;
