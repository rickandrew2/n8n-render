-- n8n Database Optimization Script
-- Run this on your n8n PostgreSQL database to fix slow query warnings
--
-- Usage:
--   psql -h your-db-host -U n8nuser -d n8n -f optimize_n8n_db.sql
--   Or copy-paste into your PostgreSQL client (pgAdmin, DBeaver, etc.)

BEGIN;

-- ============================================
-- Workflow Table Indexes
-- ============================================

-- Index for filtering workflows by user and active status (most common query)
CREATE INDEX IF NOT EXISTS idx_workflow_user_id_active 
ON workflow(user_id, active) 
WHERE active = true;

-- Index for workflow name searches
CREATE INDEX IF NOT EXISTS idx_workflow_name 
ON workflow(name);

-- Index for sorting by update date (descending)
CREATE INDEX IF NOT EXISTS idx_workflow_updated_at 
ON workflow(updated_at DESC);

-- Index for sorting by creation date
CREATE INDEX IF NOT EXISTS idx_workflow_created_at 
ON workflow(created_at DESC);

-- Ensure primary key index exists (usually auto-created)
CREATE INDEX IF NOT EXISTS idx_workflow_id 
ON workflow(id);

-- Composite index for common query pattern: get user's active workflows sorted by date
CREATE INDEX IF NOT EXISTS idx_workflow_user_active 
ON workflow(user_id, active, updated_at DESC);

-- ============================================
-- Execution Entity Table Indexes
-- ============================================

-- Index for finding executions by workflow ID
CREATE INDEX IF NOT EXISTS idx_execution_entity_workflow_id 
ON execution_entity(workflow_id);

-- Index for filtering finished executions by date
CREATE INDEX IF NOT EXISTS idx_execution_entity_finished 
ON execution_entity(finished, stopped_at DESC);

-- Composite index for workflow execution queries
CREATE INDEX IF NOT EXISTS idx_execution_entity_workflow_finished 
ON execution_entity(workflow_id, finished, stopped_at DESC);

-- Index for searching executions by workflow with date sorting
CREATE INDEX IF NOT EXISTS idx_execution_entity_workflow_stopped 
ON execution_entity(workflow_id, stopped_at DESC NULLS LAST);

-- ============================================
-- Update Statistics
-- ============================================

-- Update PostgreSQL query planner statistics
ANALYZE workflow;
ANALYZE execution_entity;
ANALYZE credentials_entity;
ANALYZE tag_entity;

COMMIT;

-- ============================================
-- Verification Queries
-- ============================================

-- Show created indexes
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename IN ('workflow', 'execution_entity')
ORDER BY tablename, indexname;

-- Show index sizes (helps verify they were created)
SELECT
    schemaname,
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_stat_user_indexes
WHERE tablename IN ('workflow', 'execution_entity')
ORDER BY tablename, indexname;

SELECT 'Optimization complete! Indexes have been created.' AS status;

