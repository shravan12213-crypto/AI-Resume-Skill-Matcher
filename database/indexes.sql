-- database/indexes.sql
-- AI-Powered Smart Resume Repository
-- Approved Vector Indexes

-- ============================================================================
-- 1. Resume Embeddings Index
-- IVFFLAT vector index optimized for cosine similarity operations.
-- ============================================================================
CREATE INDEX idx_resume_embeddings_ivfflat
ON resume_embeddings
USING ivfflat (embedding vector_cosine_ops);

-- ============================================================================
-- 2. Job Embeddings Index
-- IVFFLAT vector index optimized for cosine similarity operations.
-- ============================================================================
CREATE INDEX idx_job_embeddings_ivfflat
ON job_embeddings
USING ivfflat (embedding vector_cosine_ops);
