-- Repair UserPreference schema parity with the approved Prisma model and
-- 20260511102000_reie_mls_sync_intelligence migration.
--
-- This migration is forward-only and preserves existing rows. It does not
-- delete preference data or alter unrelated tables.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE "UserPreference" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::TEXT;

ALTER TABLE "UserPreference" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3);
ALTER TABLE "UserPreference" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;
UPDATE "UserPreference"
SET "createdAt" = COALESCE("createdAt", "updatedAt", CURRENT_TIMESTAMP)
WHERE "createdAt" IS NULL;
ALTER TABLE "UserPreference" ALTER COLUMN "createdAt" SET NOT NULL;

ALTER TABLE "UserPreference" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3);
ALTER TABLE "UserPreference" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
UPDATE "UserPreference"
SET "updatedAt" = COALESCE("updatedAt", "createdAt", CURRENT_TIMESTAMP)
WHERE "updatedAt" IS NULL;
ALTER TABLE "UserPreference" ALTER COLUMN "updatedAt" SET NOT NULL;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'UserPreference'
      AND column_name = 'avgBeds'
      AND data_type <> 'integer'
  ) THEN
    ALTER TABLE "UserPreference"
      ALTER COLUMN "avgBeds" TYPE INTEGER
      USING CASE
        WHEN "avgBeds" IS NULL THEN NULL
        ELSE ROUND("avgBeds"::numeric)::INTEGER
      END;
  END IF;
END $$;

ALTER TABLE "UserPreference" ADD COLUMN IF NOT EXISTS "topCities" TEXT[];
UPDATE "UserPreference"
SET "topCities" = ARRAY[]::TEXT[]
WHERE "topCities" IS NULL;
ALTER TABLE "UserPreference" ALTER COLUMN "topCities" SET DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "UserPreference" ALTER COLUMN "topCities" SET NOT NULL;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'fk_user'
      AND conrelid = '"UserPreference"'::regclass
  ) AND NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'UserPreference_userId_fkey'
      AND conrelid = '"UserPreference"'::regclass
  ) THEN
    ALTER TABLE "UserPreference"
      RENAME CONSTRAINT "fk_user" TO "UserPreference_userId_fkey";
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'UserPreference_userId_fkey'
      AND conrelid = '"UserPreference"'::regclass
  ) THEN
    ALTER TABLE "UserPreference"
      ADD CONSTRAINT "UserPreference_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
