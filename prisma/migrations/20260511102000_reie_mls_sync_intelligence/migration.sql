-- REIE MLS sync and intelligence schema alignment.
-- This migration is intentionally additive/conservative because the project has
-- historical migration drift between Prisma, Supabase, and worker code.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Property intelligence fields used by search, detail pages, and freshness signals.
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "lastIntelligenceSync" TIMESTAMP(3);
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "isPrivateExclusive" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "gcForensics" JSONB;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "negotiationLevers" JSONB;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "optimizedValue" INTEGER;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "efficiencyScore" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "resilienceScore" INTEGER NOT NULL DEFAULT 85;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "altitude" INTEGER NOT NULL DEFAULT 5280;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "soilType" TEXT NOT NULL DEFAULT 'Front Range Mixed';
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "hasPolybutyleneRisk" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Property" ALTER COLUMN "beds" DROP NOT NULL;
ALTER TABLE "Property" ALTER COLUMN "baths" DROP NOT NULL;

CREATE INDEX IF NOT EXISTS "Property_isPrivateExclusive_idx" ON "Property"("isPrivateExclusive");
CREATE INDEX IF NOT EXISTS "Property_lastIntelligenceSync_idx" ON "Property"("lastIntelligenceSync");

-- MLS sync state used by lib/mls/syncMLSGrid.ts.
CREATE TABLE IF NOT EXISTS "MlsSyncState" (
  "id" INTEGER NOT NULL DEFAULT 1,
  "lastSync" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastIntelligenceSync" TIMESTAMP(3),
  "lastPage" INTEGER NOT NULL DEFAULT 0,
  "totalRecords" INTEGER NOT NULL DEFAULT 0,
  "isSyncing" BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT "MlsSyncState_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "MlsSyncState" ADD COLUMN IF NOT EXISTS "lastSync" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "MlsSyncState" ADD COLUMN IF NOT EXISTS "lastIntelligenceSync" TIMESTAMP(3);
ALTER TABLE "MlsSyncState" ADD COLUMN IF NOT EXISTS "lastPage" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "MlsSyncState" ADD COLUMN IF NOT EXISTS "totalRecords" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "MlsSyncState" ADD COLUMN IF NOT EXISTS "isSyncing" BOOLEAN NOT NULL DEFAULT false;

-- User authority/CRM fields.
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "name" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'Lead';
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "hasPrivateAccess" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "heatScore" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "aestheticTag" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "intentSchema" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "legacyGoal" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "unsubscribedAt" TIMESTAMP(3);

-- Saved search bounds used by alert matching and unsubscribe routing.
ALTER TABLE "SavedSearch" ADD COLUMN IF NOT EXISTS "type" TEXT;
ALTER TABLE "SavedSearch" ADD COLUMN IF NOT EXISTS "north" DOUBLE PRECISION;
ALTER TABLE "SavedSearch" ADD COLUMN IF NOT EXISTS "south" DOUBLE PRECISION;
ALTER TABLE "SavedSearch" ADD COLUMN IF NOT EXISTS "east" DOUBLE PRECISION;
ALTER TABLE "SavedSearch" ADD COLUMN IF NOT EXISTS "west" DOUBLE PRECISION;

-- Alert queue and click tracking.
CREATE TABLE IF NOT EXISTS "AlertQueue" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "payload" JSONB,
  "clickedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AlertQueue_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "AlertQueue" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::TEXT;
ALTER TABLE "AlertQueue" ADD COLUMN IF NOT EXISTS "clickedAt" TIMESTAMP(3);
CREATE INDEX IF NOT EXISTS "AlertQueue_userId_idx" ON "AlertQueue"("userId");
CREATE INDEX IF NOT EXISTS "AlertQueue_clickedAt_idx" ON "AlertQueue"("clickedAt");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'AlertQueue_userId_fkey'
  ) THEN
    ALTER TABLE "AlertQueue"
      ADD CONSTRAINT "AlertQueue_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "AlertEvent" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "propertyId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AlertEvent_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "AlertEvent" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "AlertEvent_userId_propertyId_type_key" ON "AlertEvent"("userId", "propertyId", "type");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'AlertEvent_userId_fkey'
  ) THEN
    ALTER TABLE "AlertEvent"
      ADD CONSTRAINT "AlertEvent_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'AlertEvent_propertyId_fkey'
  ) THEN
    ALTER TABLE "AlertEvent"
      ADD CONSTRAINT "AlertEvent_propertyId_fkey"
      FOREIGN KEY ("propertyId") REFERENCES "Property"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

-- CRM/task tables.
CREATE TABLE IF NOT EXISTS "CRMTask" (
  "id" TEXT NOT NULL,
  "leadId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "priority" TEXT NOT NULL DEFAULT 'medium',
  "title" TEXT NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CRMTask_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "CRMTask" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'CRMTask_leadId_fkey'
  ) THEN
    ALTER TABLE "CRMTask"
      ADD CONSTRAINT "CRMTask_leadId_fkey"
      FOREIGN KEY ("leadId") REFERENCES "User"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "UserInteraction" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "duration" INTEGER,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "UserInteraction_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "UserInteraction" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'UserInteraction_userId_fkey'
  ) THEN
    ALTER TABLE "UserInteraction"
      ADD CONSTRAINT "UserInteraction_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "LeadInteraction" (
  "id" TEXT NOT NULL,
  "clientId" TEXT NOT NULL,
  "propertyId" TEXT NOT NULL,
  "interactionType" TEXT NOT NULL,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LeadInteraction_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "LeadInteraction" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::TEXT;
CREATE INDEX IF NOT EXISTS "LeadInteraction_clientId_idx" ON "LeadInteraction"("clientId");
CREATE INDEX IF NOT EXISTS "LeadInteraction_propertyId_idx" ON "LeadInteraction"("propertyId");
CREATE INDEX IF NOT EXISTS "LeadInteraction_interactionType_idx" ON "LeadInteraction"("interactionType");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'LeadInteraction_clientId_fkey'
  ) THEN
    ALTER TABLE "LeadInteraction"
      ADD CONSTRAINT "LeadInteraction_clientId_fkey"
      FOREIGN KEY ("clientId") REFERENCES "User"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'LeadInteraction_propertyId_fkey'
  ) THEN
    ALTER TABLE "LeadInteraction"
      ADD CONSTRAINT "LeadInteraction_propertyId_fkey"
      FOREIGN KEY ("propertyId") REFERENCES "Property"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "UserPreference" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "avgPrice" INTEGER,
  "avgBeds" INTEGER,
  "topCities" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "UserPreference" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "UserPreference_userId_key" ON "UserPreference"("userId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'UserPreference_userId_fkey'
  ) THEN
    ALTER TABLE "UserPreference"
      ADD CONSTRAINT "UserPreference_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "NorthStar" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "frequency" INTEGER NOT NULL DEFAULT 5,
  CONSTRAINT "NorthStar_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "NorthStar" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'NorthStar_userId_fkey'
  ) THEN
    ALTER TABLE "NorthStar"
      ADD CONSTRAINT "NorthStar_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- Unsubscribe and email audit tables.
CREATE TABLE IF NOT EXISTS "UnsubscribeToken" (
  "id" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "searchId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "usedAt" TIMESTAMP(3),
  CONSTRAINT "UnsubscribeToken_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "UnsubscribeToken" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "UnsubscribeToken_token_key" ON "UnsubscribeToken"("token");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'UnsubscribeToken_userId_fkey'
  ) THEN
    ALTER TABLE "UnsubscribeToken"
      ADD CONSTRAINT "UnsubscribeToken_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'UnsubscribeToken_searchId_fkey'
  ) THEN
    ALTER TABLE "UnsubscribeToken"
      ADD CONSTRAINT "UnsubscribeToken_searchId_fkey"
      FOREIGN KEY ("searchId") REFERENCES "SavedSearch"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "EmailLog" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EmailLog_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "EmailLog" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::TEXT;
CREATE INDEX IF NOT EXISTS "EmailLog_userId_idx" ON "EmailLog"("userId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'EmailLog_userId_fkey'
  ) THEN
    ALTER TABLE "EmailLog"
      ADD CONSTRAINT "EmailLog_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- Seller lead and pSEO neighborhood authority tables.
CREATE TABLE IF NOT EXISTS "SellerLead" (
  "id" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "beds" INTEGER,
  "price" INTEGER,
  "reason" TEXT NOT NULL,
  "propertyId" TEXT NOT NULL,
  CONSTRAINT "SellerLead_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "SellerLead" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::TEXT;

CREATE TABLE IF NOT EXISTS "City" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "state" TEXT NOT NULL DEFAULT 'CO',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "City" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "City_slug_key" ON "City"("slug");

CREATE TABLE IF NOT EXISTS "Neighborhood" (
  "id" TEXT NOT NULL,
  "cityId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "avgEfficiencyScore" INTEGER NOT NULL DEFAULT 0,
  "primaryAnchor" TEXT NOT NULL,
  "lifestyleVibe" TEXT NOT NULL,
  "era" TEXT,
  "resilienceScore" INTEGER NOT NULL DEFAULT 0,
  "altitude" INTEGER,
  "soilType" TEXT,
  "fireRisk" TEXT,
  "insuranceComplexity" TEXT,
  "waterRights" BOOLEAN,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Neighborhood_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Neighborhood" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "Neighborhood_cityId_slug_key" ON "Neighborhood"("cityId", "slug");
CREATE INDEX IF NOT EXISTS "Neighborhood_slug_idx" ON "Neighborhood"("slug");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Neighborhood_cityId_fkey'
  ) THEN
    ALTER TABLE "Neighborhood"
      ADD CONSTRAINT "Neighborhood_cityId_fkey"
      FOREIGN KEY ("cityId") REFERENCES "City"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- /Users/davidquinn/david-quinn-group/colorado-real-estate/prisma/migrations/20260511102000_reie_mls_sync_intelligence/migration.sql
