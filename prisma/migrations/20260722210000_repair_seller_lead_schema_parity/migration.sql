-- Repair SellerLead production schema parity.
-- A legacy SellerLead table can predate the 20260511102000 migration, which used
-- CREATE TABLE IF NOT EXISTS and therefore did not add the canonical propertyId
-- column when the table already existed.

ALTER TABLE "SellerLead" ADD COLUMN IF NOT EXISTS "propertyId" TEXT;

UPDATE "SellerLead"
SET "propertyId" = COALESCE("propertyId", "listingid")
WHERE "propertyId" IS NULL;

ALTER TABLE "SellerLead" ALTER COLUMN "propertyId" SET NOT NULL;

ALTER TABLE "SellerLead" ALTER COLUMN "listingid" DROP NOT NULL;

CREATE INDEX IF NOT EXISTS "SellerLead_propertyId_idx" ON "SellerLead"("propertyId");
