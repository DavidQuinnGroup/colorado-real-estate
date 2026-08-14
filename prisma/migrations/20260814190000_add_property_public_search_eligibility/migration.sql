CREATE TYPE "PublicSearchEligibility" AS ENUM (
  'CERTIFIED_ELIGIBLE',
  'PUBLIC_SCOPE_UNVERIFIED',
  'CERTIFIED_INELIGIBLE'
);

ALTER TABLE "Property"
  ADD COLUMN "publicSearchEligibility" "PublicSearchEligibility";

CREATE INDEX "Property_publicSearchEligibility_idx"
  ON "Property"("publicSearchEligibility");
