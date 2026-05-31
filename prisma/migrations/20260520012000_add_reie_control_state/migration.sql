-- REIE Master Control Panel persistent state.
-- This migration is intentionally idempotent because the local API can create
-- this table before Prisma migrations are applied.

CREATE TABLE IF NOT EXISTS "REIEControlState" (
  "key" TEXT NOT NULL,
  "state" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "REIEControlState_pkey" PRIMARY KEY ("key")
);

ALTER TABLE "REIEControlState" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "REIEControlState" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- /Users/davidquinn/david-quinn-group/colorado-real-estate/prisma/migrations/20260520012000_add_reie_control_state/migration.sql
