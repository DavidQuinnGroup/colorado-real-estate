-- Repair MLS status/freshness columns without touching legacy foreign-key drift.

ALTER TABLE "Property"
  ADD COLUMN IF NOT EXISTS "lastIntelligenceSync" TIMESTAMP(3);

CREATE INDEX IF NOT EXISTS "Property_lastIntelligenceSync_idx"
  ON "Property"("lastIntelligenceSync");

CREATE TABLE IF NOT EXISTS "MlsSyncState" (
  "id" INTEGER NOT NULL DEFAULT 1,
  "lastSync" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastIntelligenceSync" TIMESTAMP(3),
  "lastPage" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "isSyncing" BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT "MlsSyncState_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "MlsSyncState"
  ADD COLUMN IF NOT EXISTS "lastSync" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "MlsSyncState"
  ADD COLUMN IF NOT EXISTS "lastIntelligenceSync" TIMESTAMP(3);

ALTER TABLE "MlsSyncState"
  ADD COLUMN IF NOT EXISTS "lastPage" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "MlsSyncState"
  ADD COLUMN IF NOT EXISTS "totalRecords" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "MlsSyncState"
  ADD COLUMN IF NOT EXISTS "isSyncing" BOOLEAN NOT NULL DEFAULT false;

INSERT INTO "MlsSyncState" ("id")
VALUES (1)
ON CONFLICT ("id") DO NOTHING;

-- /Users/davidquinn/david-quinn-group/colorado-real-estate/prisma/migrations/20260520025500_repair_mls_status_freshness_columns/migration.sql
