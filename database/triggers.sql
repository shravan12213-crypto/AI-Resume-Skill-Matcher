-- database/triggers.sql
-- AI-Powered Smart Resume Repository with Skill Matching
-- Advanced DBMS Triggers Implementation (Phase 5)

-- ============================================================================
-- 1. TRIGGER: Log Application Status History
-- Automatically records an audit entry in application_status_history whenever
-- the status of an application is modified (e.g. applied -> shortlisted -> hired).
-- ============================================================================

CREATE OR REPLACE FUNCTION func_log_application_status_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Only log when status has actually changed
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO application_status_history (
            application_id,
            old_status,
            new_status,
            changed_at
        ) VALUES (
            NEW.application_id,
            OLD.status,
            NEW.status,
            NOW()
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_application_status_history ON applications;

CREATE TRIGGER trg_application_status_history
AFTER UPDATE ON applications
FOR EACH ROW
EXECUTE FUNCTION func_log_application_status_change();

-- ============================================================================
-- 2. TRIGGER: Prevent Modifying Closed Job Postings
-- Ensures that applications or updates cannot be made against closed jobs.
-- ============================================================================

CREATE OR REPLACE FUNCTION func_check_job_status_before_apply()
RETURNS TRIGGER AS $$
DECLARE
    v_job_status VARCHAR(20);
BEGIN
    SELECT status INTO v_job_status
    FROM jobs
    WHERE job_id = NEW.job_id;

    IF v_job_status = 'closed' THEN
        RAISE EXCEPTION 'Cannot apply to a closed job posting (job_id: %)', NEW.job_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_apply_closed_job ON applications;

CREATE TRIGGER trg_prevent_apply_closed_job
BEFORE INSERT ON applications
FOR EACH ROW
EXECUTE FUNCTION func_check_job_status_before_apply();
