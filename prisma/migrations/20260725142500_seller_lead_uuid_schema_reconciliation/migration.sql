-- SellerLead UUID schema reconciliation.
-- Preserves existing UUID values and fails closed if a text SellerLead.id contains non-UUID data.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  seller_id_type TEXT;
BEGIN
  SELECT format_type(a.atttypid, a.atttypmod)
  INTO seller_id_type
  FROM pg_attribute a
  WHERE a.attrelid = 'public."SellerLead"'::regclass
    AND a.attname = 'id'
    AND a.attnum > 0
    AND NOT a.attisdropped;

  IF seller_id_type IS NULL THEN
    RAISE EXCEPTION 'SellerLead.id column is missing.';
  END IF;

  IF seller_id_type = 'uuid' THEN
    ALTER TABLE "SellerLead" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
  ELSIF seller_id_type = 'text' THEN
    IF EXISTS (
      SELECT 1
      FROM "SellerLead"
      WHERE "id" IS NOT NULL
        AND "id" !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    ) THEN
      RAISE EXCEPTION 'SellerLead.id contains non-UUID text values; stopping before type conversion.';
    END IF;

    ALTER TABLE "SellerLead" ALTER COLUMN "id" DROP DEFAULT;
    ALTER TABLE "SellerLead" ALTER COLUMN "id" TYPE uuid USING "id"::uuid;
    ALTER TABLE "SellerLead" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
  ELSE
    RAISE EXCEPTION 'SellerLead.id has unsupported type: %', seller_id_type;
  END IF;
END $$;

DO $$
DECLARE
  crm_leadid_type TEXT;
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'CRMTask'
      AND column_name = 'leadid'
  ) THEN
    ALTER TABLE "CRMTask" ADD COLUMN "leadid" uuid;
  END IF;

  SELECT format_type(a.atttypid, a.atttypmod)
  INTO crm_leadid_type
  FROM pg_attribute a
  WHERE a.attrelid = 'public."CRMTask"'::regclass
    AND a.attname = 'leadid'
    AND a.attnum > 0
    AND NOT a.attisdropped;

  IF crm_leadid_type = 'uuid' THEN
    NULL;
  ELSIF crm_leadid_type = 'text' THEN
    IF EXISTS (
      SELECT 1
      FROM "CRMTask"
      WHERE "leadid" IS NOT NULL
        AND "leadid" !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    ) THEN
      RAISE EXCEPTION 'CRMTask.leadid contains non-UUID text values; stopping before type conversion.';
    END IF;

    ALTER TABLE "CRMTask" ALTER COLUMN "leadid" TYPE uuid USING "leadid"::uuid;
  ELSE
    RAISE EXCEPTION 'CRMTask.leadid has unsupported type: %', crm_leadid_type;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'CRMTask_leadid_fkey'
  ) THEN
    ALTER TABLE "CRMTask"
      ADD CONSTRAINT "CRMTask_leadid_fkey"
      FOREIGN KEY ("leadid") REFERENCES "SellerLead"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "CRMTask_leadid_idx" ON "CRMTask"("leadid");

-- /Users/davidquinn/david-quinn-group/colorado-real-estate/prisma/migrations/20260725142500_seller_lead_uuid_schema_reconciliation/migration.sql
