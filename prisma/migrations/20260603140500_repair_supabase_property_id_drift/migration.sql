-- Repair production Supabase drift discovered during MLS queue recovery.
-- The legacy database had Property.uuid as the primary key while application
-- code and Prisma relations use Property.id. Keep the legacy primary key in
-- place, but make Property.id non-null/unique and point child rows at it.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Property intelligence fields and defaults required by MLS sync workers.
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "lastIntelligenceSync" TIMESTAMP(3);
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "isPrivateExclusive" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "gcForensics" JSONB;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "negotiationLevers" JSONB;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "optimizedValue" INTEGER;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "efficiencyScore" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "resilienceScore" INTEGER DEFAULT 85;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "altitude" INTEGER NOT NULL DEFAULT 5280;
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "soilType" TEXT NOT NULL DEFAULT 'Front Range Mixed';
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "hasPolybutyleneRisk" BOOLEAN NOT NULL DEFAULT false;

UPDATE "Property" SET "resilienceScore" = 85 WHERE "resilienceScore" IS NULL;
ALTER TABLE "Property" ALTER COLUMN "resilienceScore" SET NOT NULL;
ALTER TABLE "Property" ALTER COLUMN "resilienceScore" SET DEFAULT 85;

UPDATE "Property" SET "isPrivateExclusive" = false WHERE "isPrivateExclusive" IS NULL;
ALTER TABLE "Property" ALTER COLUMN "isPrivateExclusive" SET NOT NULL;
ALTER TABLE "Property" ALTER COLUMN "isPrivateExclusive" SET DEFAULT false;

ALTER TABLE "Property" ALTER COLUMN "beds" DROP NOT NULL;
ALTER TABLE "Property" ALTER COLUMN "baths" DROP NOT NULL;
ALTER TABLE "Property" ALTER COLUMN "id" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "Property_id_key" ON "Property"("id");
CREATE INDEX IF NOT EXISTS "Property_isPrivateExclusive_idx" ON "Property"("isPrivateExclusive");
CREATE INDEX IF NOT EXISTS "Property_lastIntelligenceSync_idx" ON "Property"("lastIntelligenceSync");

-- NorthStar existed in Prisma history but was missing in the live database.
CREATE TABLE IF NOT EXISTS "NorthStar" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "frequency" INTEGER NOT NULL DEFAULT 5,
  "lat" DOUBLE PRECISION,
  "lng" DOUBLE PRECISION,
  CONSTRAINT "NorthStar_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "NorthStar" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::TEXT;
ALTER TABLE "NorthStar" ADD COLUMN IF NOT EXISTS "lat" DOUBLE PRECISION;
ALTER TABLE "NorthStar" ADD COLUMN IF NOT EXISTS "lng" DOUBLE PRECISION;

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

-- Child tables must reference Property.id, matching Prisma and worker writes.
ALTER TABLE "PropertyPhoto" DROP CONSTRAINT IF EXISTS "PropertyPhoto_propertyId_fkey";
ALTER TABLE "PropertyPhoto"
  ADD CONSTRAINT "PropertyPhoto_propertyId_fkey"
  FOREIGN KEY ("propertyId") REFERENCES "Property"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PriceHistory" DROP CONSTRAINT IF EXISTS "PriceHistory_propertyId_fkey";
ALTER TABLE "PriceHistory"
  ADD CONSTRAINT "PriceHistory_propertyId_fkey"
  FOREIGN KEY ("propertyId") REFERENCES "Property"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "OpenHouse" DROP CONSTRAINT IF EXISTS "OpenHouse_propertyId_fkey";
ALTER TABLE "OpenHouse"
  ADD CONSTRAINT "OpenHouse_propertyId_fkey"
  FOREIGN KEY ("propertyId") REFERENCES "Property"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AlertEvent" DROP CONSTRAINT IF EXISTS "AlertEvent_propertyId_fkey";
ALTER TABLE "AlertEvent" DROP CONSTRAINT IF EXISTS "fk_property";
ALTER TABLE "AlertEvent"
  ADD CONSTRAINT "AlertEvent_propertyId_fkey"
  FOREIGN KEY ("propertyId") REFERENCES "Property"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
