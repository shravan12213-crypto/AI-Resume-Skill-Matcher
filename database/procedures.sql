-- database/procedures.sql
-- AI-Powered Smart Resume Repository with Skill Matching
-- Stored Procedures & Functions Implementation (Phase 5 & 6)

-- ============================================================================
-- 1. FUNCTION: calculate_candidate_job_match
-- Computes the deterministic 50/30/20 weighted score for a candidate and job:
--   Skill Score (50%) + Semantic Score (30%) + Experience Score (20%)
-- Upserts the result into the matches table.
-- ============================================================================

CREATE OR REPLACE FUNCTION calculate_candidate_job_match(
    p_candidate_id INT,
    p_job_id INT
)
RETURNS NUMERIC(5,2) AS $$
DECLARE
    v_total_required_skills INT := 0;
    v_matched_required_skills INT := 0;
    v_skill_score NUMERIC(5,2) := 0.00;
    
    v_job_experience_req NUMERIC(3,1) := 0.0;
    v_candidate_max_exp NUMERIC(3,1) := 0.0;
    v_experience_score NUMERIC(5,2) := 100.00;
    
    v_semantic_score NUMERIC(5,2) := 75.00; -- Default baseline if vector embedding comparison is pending
    v_final_score NUMERIC(5,2) := 0.00;
BEGIN
    -- 1. SKILL SCORING CALCULATION
    -- Count total required skills for the job
    SELECT COUNT(*) INTO v_total_required_skills
    FROM job_skills
    WHERE job_id = p_job_id AND is_required = TRUE;

    IF v_total_required_skills = 0 THEN
        -- If no specifically required skills, check total job skills
        SELECT COUNT(*) INTO v_total_required_skills
        FROM job_skills
        WHERE job_id = p_job_id;
    END IF;

    IF v_total_required_skills > 0 THEN
        -- Count how many of these required skills the candidate possesses
        SELECT COUNT(*) INTO v_matched_required_skills
        FROM job_skills js
        JOIN candidate_skills cs ON js.skill_id = cs.skill_id
        WHERE js.job_id = p_job_id 
          AND cs.candidate_id = p_candidate_id
          AND (js.is_required = TRUE OR v_total_required_skills = (SELECT COUNT(*) FROM job_skills WHERE job_id = p_job_id));

        v_skill_score := ROUND((v_matched_required_skills::NUMERIC / v_total_required_skills::NUMERIC) * 100.00, 2);
    ELSE
        -- No skill requirements defined
        v_skill_score := 100.00;
    END IF;

    -- 2. EXPERIENCE SCORING CALCULATION
    SELECT COALESCE(experience_required, 0.0) INTO v_job_experience_req
    FROM jobs
    WHERE job_id = p_job_id;

    -- Calculate candidate max years of experience across relevant matched skills
    SELECT COALESCE(MAX(cs.years_experience), 0.0) INTO v_candidate_max_exp
    FROM candidate_skills cs
    JOIN job_skills js ON cs.skill_id = js.skill_id
    WHERE cs.candidate_id = p_candidate_id AND js.job_id = p_job_id;

    IF v_job_experience_req <= 0.0 THEN
        v_experience_score := 100.00;
    ELSE
        IF v_candidate_max_exp >= v_job_experience_req THEN
            v_experience_score := 100.00;
        ELSE
            v_experience_score := ROUND((v_candidate_max_exp / v_job_experience_req) * 100.00, 2);
        END IF;
    END IF;

    -- 3. FINAL WEIGHTED CALCULATION (50% Skill, 30% Semantic, 20% Experience)
    v_final_score := ROUND(
        (v_skill_score * 0.50) + 
        (v_semantic_score * 0.30) + 
        (v_experience_score * 0.20), 
        2
    );

    -- Cap final score between 0 and 100
    IF v_final_score > 100.00 THEN
        v_final_score := 100.00;
    ELSIF v_final_score < 0.00 THEN
        v_final_score := 0.00;
    END IF;

    -- Upsert record into matches table
    INSERT INTO matches (
        candidate_id,
        job_id,
        skill_score,
        semantic_score,
        experience_score,
        final_score,
        matched_at
    ) VALUES (
        p_candidate_id,
        p_job_id,
        v_skill_score,
        v_semantic_score,
        v_experience_score,
        v_final_score,
        NOW()
    )
    ON CONFLICT (candidate_id, job_id)
    DO UPDATE SET
        skill_score = EXCLUDED.skill_score,
        semantic_score = EXCLUDED.semantic_score,
        experience_score = EXCLUDED.experience_score,
        final_score = EXCLUDED.final_score,
        matched_at = NOW();

    RETURN v_final_score;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 2. PROCEDURE: apply_to_job
-- Transactional procedure to submit an application and calculate matching score.
-- Enforces data integrity with atomicity and business rule checks.
-- ============================================================================

CREATE OR REPLACE PROCEDURE apply_to_job(
    p_candidate_id INT,
    p_job_id INT
)
AS $$
DECLARE
    v_job_status VARCHAR(20);
    v_existing_app INT;
BEGIN
    -- Check if job exists and is open
    SELECT status INTO v_job_status
    FROM jobs
    WHERE job_id = p_job_id;

    IF v_job_status IS NULL THEN
        RAISE EXCEPTION 'Job ID % does not exist', p_job_id;
    ELSIF v_job_status <> 'open' THEN
        RAISE EXCEPTION 'Job ID % is % and not accepting applications', p_job_id, v_job_status;
    END IF;

    -- Check if candidate has already applied
    SELECT COUNT(*) INTO v_existing_app
    FROM applications
    WHERE candidate_id = p_candidate_id AND job_id = p_job_id;

    IF v_existing_app > 0 THEN
        RAISE EXCEPTION 'Candidate % has already applied to Job %', p_candidate_id, p_job_id;
    END IF;

    -- Insert application record
    INSERT INTO applications (candidate_id, job_id, status, applied_at)
    VALUES (p_candidate_id, p_job_id, 'applied', NOW());

    -- Trigger score calculation
    PERFORM calculate_candidate_job_match(p_candidate_id, p_job_id);

    RAISE NOTICE 'Application submitted successfully for candidate % to job %', p_candidate_id, p_job_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 3. FUNCTION: get_top_candidates
-- Returns a ranked table of candidates for a specific job based on final_score.
-- ============================================================================

CREATE OR REPLACE FUNCTION get_top_candidates(
    p_job_id INT,
    p_limit INT DEFAULT 10
)
RETURNS TABLE (
    candidate_id INT,
    candidate_name VARCHAR,
    email VARCHAR,
    location VARCHAR,
    skill_score NUMERIC(5,2),
    semantic_score NUMERIC(5,2),
    experience_score NUMERIC(5,2),
    final_score NUMERIC(5,2),
    application_status VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.candidate_id,
        u.name AS candidate_name,
        u.email,
        c.location,
        m.skill_score,
        m.semantic_score,
        m.experience_score,
        m.final_score,
        app.status AS application_status
    FROM matches m
    JOIN candidates c ON m.candidate_id = c.candidate_id
    JOIN users u ON c.user_id = u.user_id
    LEFT JOIN applications app ON (app.candidate_id = m.candidate_id AND app.job_id = m.job_id)
    WHERE m.job_id = p_job_id
    ORDER BY m.final_score DESC, m.skill_score DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;
