# Database Optimization Guide for n8n

This guide helps optimize your n8n PostgreSQL database to resolve slow query warnings.

## Problem

You're seeing slow database query warnings:
```
Slow database query {"method":"WorkflowRepository.getMany","durationMs":816,"thresholdMs":100}
```

This indicates queries are taking 650-800ms+ when they should complete in under 100ms.

## Solution: Add Database Indexes

n8n's `WorkflowRepository.getMany` method queries workflow tables frequently. The following indexes will dramatically improve performance.

### Step 1: Connect to Your Database

**For AWS RDS:**
```bash
# Using psql (if you have PostgreSQL client installed)
psql -h your-rds-endpoint.rds.amazonaws.com -U n8nuser -d n8n

# Or use a database client like pgAdmin, DBeaver, or TablePlus
```

**For Neon/Other PostgreSQL:**
- Use your database connection string
- Connect via your preferred PostgreSQL client

### Step 2: Run These SQL Commands

Copy and run these SQL commands in your database to add performance indexes:

```sql
-- Index on workflow table for common query patterns
-- This speeds up getMany queries with filters like userId, active status, etc.
CREATE INDEX IF NOT EXISTS idx_workflow_user_id_active 
ON workflow(user_id, active) 
WHERE active = true;

-- Index on workflow name (for search/filtering)
CREATE INDEX IF NOT EXISTS idx_workflow_name 
ON workflow(name);

-- Index on workflow updated_at (for sorting by date)
CREATE INDEX IF NOT EXISTS idx_workflow_updated_at 
ON workflow(updated_at DESC);

-- Index on workflow created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_workflow_created_at 
ON workflow(created_at DESC);

-- Index on workflow.id (usually already exists, but ensures it's there)
CREATE INDEX IF NOT EXISTS idx_workflow_id 
ON workflow(id);

-- Composite index for common query: get user's active workflows
CREATE INDEX IF NOT EXISTS idx_workflow_user_active 
ON workflow(user_id, active, updated_at DESC);

-- Index on execution_entity table (workflow executions)
-- This table can grow large and slow queries without indexes
CREATE INDEX IF NOT EXISTS idx_execution_entity_workflow_id 
ON execution_entity(workflow_id);

CREATE INDEX IF NOT EXISTS idx_execution_entity_finished 
ON execution_entity(finished, stopped_at DESC);

CREATE INDEX IF NOT EXISTS idx_execution_entity_workflow_finished 
ON execution_entity(workflow_id, finished, stopped_at DESC);

-- Index for searching executions by workflow
CREATE INDEX IF NOT EXISTS idx_execution_entity_workflow_stopped 
ON execution_entity(workflow_id, stopped_at DESC NULLS LAST);
```

### Step 3: Analyze Tables (Optional but Recommended)

After adding indexes, run ANALYZE to update PostgreSQL's query planner statistics:

```sql
ANALYZE workflow;
ANALYZE execution_entity;
ANALYZE credentials_entity;
ANALYZE tag_entity;
```

### Step 4: Verify Indexes Were Created

Check that indexes exist:

```sql
-- List all indexes on workflow table
SELECT 
    indexname, 
    indexdef 
FROM pg_indexes 
WHERE tablename = 'workflow'
ORDER BY indexname;

-- List all indexes on execution_entity table
SELECT 
    indexname, 
    indexdef 
FROM pg_indexes 
WHERE tablename = 'execution_entity'
ORDER BY indexname;
```

## Additional Database Optimizations

### 1. Connection Pooling

If your database supports it (e.g., RDS Proxy, PgBouncer), enable connection pooling:
- Reduces connection overhead
- Improves query performance

### 2. Database Resource Settings

**For AWS RDS:**
- Consider upgrading from `db.t3.micro` to `db.t3.small` if queries are still slow
- Increase allocated storage if needed (more I/O capacity)

**For Neon:**
- Consider upgrading to a higher tier plan for better performance

### 3. PostgreSQL Configuration (if you have access)

If you can modify PostgreSQL settings:

```sql
-- Increase shared_buffers (if possible on your plan)
-- Increase work_mem for sorting operations
-- Increase effective_cache_size
```

These settings depend on your hosting provider's limitations.

### 4. Vacuum and Maintain Database

Run periodic maintenance (usually automatic, but can be manual):

```sql
-- Vacuum to reclaim space and update statistics
VACUUM ANALYZE workflow;
VACUUM ANALYZE execution_entity;
```

## Monitoring Query Performance

### Check Slow Queries

```sql
-- Enable query logging (if you have admin access)
-- Then check pg_stat_statements for slow queries:

SELECT 
    query,
    calls,
    total_exec_time,
    mean_exec_time,
    max_exec_time
FROM pg_stat_statements
WHERE mean_exec_time > 100
ORDER BY mean_exec_time DESC
LIMIT 10;
```

### Verify Improvements

After adding indexes, monitor your n8n logs. You should see:
- Fewer "Slow database query" warnings
- Query times dropping from 600-800ms to under 100ms
- Faster page loads in n8n UI

## Troubleshooting

### Indexes Not Helping?

1. **Check query patterns**: The indexes above cover common patterns, but your usage might differ
2. **Table size**: Very large tables (>1M rows) might need partitioning
3. **Database resources**: Free tier databases have limited CPU/memory

### Connection Issues?

- Verify your database connection string
- Check security groups/firewall rules
- Ensure SSL settings match (`DB_POSTGRESDB_SSLMODE=require`)

### Still Slow After Indexes?

1. **Check database load**: Monitor CPU/memory usage
2. **Upgrade database tier**: Free tier has limited performance
3. **Review n8n version**: Update to latest n8n for performance improvements
4. **Check workflow count**: Very large numbers of workflows (>1000) may need archiving

## Quick Fix Script

Save this as `optimize_n8n_db.sql` and run it:

```sql
-- n8n Database Optimization Script
-- Run this on your n8n PostgreSQL database

BEGIN;

-- Workflow table indexes
CREATE INDEX IF NOT EXISTS idx_workflow_user_id_active 
ON workflow(user_id, active) WHERE active = true;

CREATE INDEX IF NOT EXISTS idx_workflow_name ON workflow(name);
CREATE INDEX IF NOT EXISTS idx_workflow_updated_at ON workflow(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_workflow_created_at ON workflow(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_workflow_id ON workflow(id);
CREATE INDEX IF NOT EXISTS idx_workflow_user_active 
ON workflow(user_id, active, updated_at DESC);

-- Execution entity indexes
CREATE INDEX IF NOT EXISTS idx_execution_entity_workflow_id 
ON execution_entity(workflow_id);

CREATE INDEX IF NOT EXISTS idx_execution_entity_finished 
ON execution_entity(finished, stopped_at DESC);

CREATE INDEX IF NOT EXISTS idx_execution_entity_workflow_finished 
ON execution_entity(workflow_id, finished, stopped_at DESC);

CREATE INDEX IF NOT EXISTS idx_execution_entity_workflow_stopped 
ON execution_entity(workflow_id, stopped_at DESC NULLS LAST);

-- Update statistics
ANALYZE workflow;
ANALYZE execution_entity;

COMMIT;

-- Verify indexes were created
SELECT 'Indexes created successfully!' AS status;
SELECT tablename, indexname FROM pg_indexes 
WHERE tablename IN ('workflow', 'execution_entity')
ORDER BY tablename, indexname;
```

## Expected Results

After applying these indexes:
- ✅ Query times should drop from 600-800ms to <100ms
- ✅ "Slow database query" warnings should disappear or reduce significantly
- ✅ n8n UI should load faster
- ✅ Workflow list pages should render quicker

---

**Note**: Indexes take up some storage space and slightly slow down INSERT/UPDATE operations, but the query performance improvements are worth it for read-heavy workloads like n8n.

