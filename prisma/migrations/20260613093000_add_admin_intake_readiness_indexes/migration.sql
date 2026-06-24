-- Add indexes for protected admin intake and CRM readiness queries.
-- This migration is intentionally idempotent because older recovery paths may
-- have partially-created CRM and interaction tables before migrations run.

CREATE INDEX IF NOT EXISTS "CRMTask_leadId_idx" ON "CRMTask"("leadId");
CREATE INDEX IF NOT EXISTS "CRMTask_type_createdAt_idx" ON "CRMTask"("type", "createdAt");
CREATE INDEX IF NOT EXISTS "CRMTask_status_type_createdAt_idx" ON "CRMTask"("status", "type", "createdAt");

CREATE INDEX IF NOT EXISTS "UserInteraction_userId_idx" ON "UserInteraction"("userId");
CREATE INDEX IF NOT EXISTS "UserInteraction_type_createdAt_idx" ON "UserInteraction"("type", "createdAt");

-- /Users/davidquinn/david-quinn-group/colorado-real-estate/prisma/migrations/20260613093000_add_admin_intake_readiness_indexes/migration.sql
