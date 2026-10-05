CREATE TABLE "QualificationClearance" (
  "id" TEXT NOT NULL,
  "qualificationApplicationVersionId" TEXT NOT NULL,
  "replacementApplicationVersionId" TEXT,
  "actorRef" TEXT NOT NULL,
  "authorityRef" TEXT NOT NULL,
  "reasonRef" TEXT NOT NULL,
  "clearedAt" TIMESTAMP(3) NOT NULL,
  "effectiveAt" TIMESTAMP(3) NOT NULL,
  "provenance" JSONB NOT NULL,
  "integrityFingerprint" TEXT NOT NULL,
  "supersedesClearanceId" TEXT,
  "correctionOfClearanceId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "QualificationClearance_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "QualificationClearance_exact_metadata" CHECK (
    btrim("qualificationApplicationVersionId") = "qualificationApplicationVersionId"
    AND "qualificationApplicationVersionId" <> ''
    AND lower("qualificationApplicationVersionId") NOT IN ('latest', 'current')
    AND ("replacementApplicationVersionId" IS NULL OR (
      btrim("replacementApplicationVersionId") = "replacementApplicationVersionId"
      AND "replacementApplicationVersionId" <> ''
      AND lower("replacementApplicationVersionId") NOT IN ('latest', 'current')
      AND "replacementApplicationVersionId" IS DISTINCT FROM "qualificationApplicationVersionId"
    ))
    AND btrim("actorRef") = "actorRef" AND "actorRef" <> ''
    AND lower("actorRef") NOT IN ('latest', 'current')
    AND btrim("authorityRef") = "authorityRef" AND "authorityRef" <> ''
    AND lower("authorityRef") NOT IN ('latest', 'current')
    AND btrim("reasonRef") = "reasonRef" AND "reasonRef" <> ''
    AND lower("reasonRef") NOT IN ('latest', 'current')
    AND jsonb_typeof("provenance") = 'object' AND "provenance" <> '{}'::jsonb
    AND btrim("integrityFingerprint") = "integrityFingerprint" AND "integrityFingerprint" <> ''
    AND "supersedesClearanceId" IS DISTINCT FROM "id"
    AND "correctionOfClearanceId" IS DISTINCT FROM "id"
    AND NOT ("supersedesClearanceId" IS NOT NULL AND "correctionOfClearanceId" IS NOT NULL)
  )
);

CREATE UNIQUE INDEX "QualificationClearance_fingerprint_key"
ON "QualificationClearance"("integrityFingerprint");
CREATE UNIQUE INDEX "QualificationClearance_supersedes_key"
ON "QualificationClearance"("supersedesClearanceId");
CREATE UNIQUE INDEX "QualificationClearance_correction_key"
ON "QualificationClearance"("correctionOfClearanceId");
CREATE INDEX "QualificationClearance_target_clearedAt_idx"
ON "QualificationClearance"("qualificationApplicationVersionId", "clearedAt");
CREATE INDEX "QualificationClearance_replacementVersion_idx"
ON "QualificationClearance"("replacementApplicationVersionId");
CREATE INDEX "QualificationClearance_effectiveAt_idx"
ON "QualificationClearance"("effectiveAt");

ALTER TABLE "QualificationClearance"
ADD CONSTRAINT "QualificationClearance_applicationVersion_fkey"
FOREIGN KEY ("qualificationApplicationVersionId")
REFERENCES "QualificationApplicationVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "QualificationClearance"
ADD CONSTRAINT "QualificationClearance_replacementVersion_fkey"
FOREIGN KEY ("replacementApplicationVersionId")
REFERENCES "QualificationApplicationVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "QualificationClearance"
ADD CONSTRAINT "QualificationClearance_supersedes_fkey"
FOREIGN KEY ("supersedesClearanceId")
REFERENCES "QualificationClearance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "QualificationClearance"
ADD CONSTRAINT "QualificationClearance_correction_fkey"
FOREIGN KEY ("correctionOfClearanceId")
REFERENCES "QualificationClearance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE FUNCTION "guardQualificationClearance"() RETURNS trigger AS $clearance_guard$
DECLARE
  target_application_id TEXT;
  replacement_application_id TEXT;
  predecessor_clearance_id TEXT;
  predecessor_target_version_id TEXT;
  creates_replacement_cycle BOOLEAN;
  creates_lineage_cycle BOOLEAN;
BEGIN
  IF TG_OP = 'UPDATE' THEN
    RAISE EXCEPTION 'Qualification Clearance records are immutable';
  END IF;
  IF TG_OP = 'DELETE' THEN
    RAISE EXCEPTION 'Qualification Clearance records cannot be deleted';
  END IF;

  SELECT "qualificationApplicationId" INTO target_application_id
  FROM "QualificationApplicationVersion"
  WHERE id = NEW."qualificationApplicationVersionId"
  FOR KEY SHARE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Qualification Clearance requires an exact existing Application Version target';
  END IF;

  IF NEW."replacementApplicationVersionId" IS NOT NULL THEN
    IF NEW."replacementApplicationVersionId" = NEW."qualificationApplicationVersionId" THEN
      RAISE EXCEPTION 'Qualification Clearance replacement cannot reference its target Application Version';
    END IF;

    SELECT "qualificationApplicationId" INTO replacement_application_id
    FROM "QualificationApplicationVersion"
    WHERE id = NEW."replacementApplicationVersionId"
    FOR KEY SHARE;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Qualification Clearance replacement requires an exact existing Application Version';
    END IF;
    IF replacement_application_id IS DISTINCT FROM target_application_id THEN
      RAISE EXCEPTION 'Qualification Clearance replacement must remain within one Qualification Application';
    END IF;

    WITH RECURSIVE replacement_path("applicationVersionId") AS (
      SELECT NEW."replacementApplicationVersionId"
      UNION
      SELECT clearance."replacementApplicationVersionId"
      FROM "QualificationClearance" clearance
      JOIN replacement_path path
        ON clearance."qualificationApplicationVersionId" = path."applicationVersionId"
      WHERE clearance."replacementApplicationVersionId" IS NOT NULL
    )
    SELECT EXISTS (
      SELECT 1 FROM replacement_path
      WHERE "applicationVersionId" = NEW."qualificationApplicationVersionId"
    ) INTO creates_replacement_cycle;
    IF creates_replacement_cycle THEN
      RAISE EXCEPTION 'Qualification Clearance replacement cycle is not allowed';
    END IF;
  END IF;

  predecessor_clearance_id := COALESCE(NEW."supersedesClearanceId", NEW."correctionOfClearanceId");
  IF predecessor_clearance_id IS NOT NULL THEN
    IF predecessor_clearance_id = NEW.id THEN
      RAISE EXCEPTION 'Qualification Clearance lineage cannot reference itself';
    END IF;

    SELECT "qualificationApplicationVersionId" INTO predecessor_target_version_id
    FROM "QualificationClearance"
    WHERE id = predecessor_clearance_id
    FOR KEY SHARE;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Qualification Clearance lineage requires an exact existing predecessor';
    END IF;
    IF predecessor_target_version_id IS DISTINCT FROM NEW."qualificationApplicationVersionId" THEN
      RAISE EXCEPTION 'Qualification Clearance lineage must remain on one exact Application Version target';
    END IF;
    IF EXISTS (
      SELECT 1 FROM "QualificationClearance"
      WHERE "supersedesClearanceId" = predecessor_clearance_id
         OR "correctionOfClearanceId" = predecessor_clearance_id
    ) THEN
      RAISE EXCEPTION 'Qualification Clearance predecessor already has a successor';
    END IF;

    WITH RECURSIVE clearance_path("clearanceId") AS (
      SELECT predecessor_clearance_id
      UNION
      SELECT COALESCE(clearance."supersedesClearanceId", clearance."correctionOfClearanceId")
      FROM "QualificationClearance" clearance
      JOIN clearance_path path ON clearance.id = path."clearanceId"
      WHERE clearance."supersedesClearanceId" IS NOT NULL
         OR clearance."correctionOfClearanceId" IS NOT NULL
    )
    SELECT EXISTS (
      SELECT 1 FROM clearance_path WHERE "clearanceId" = NEW.id
    ) INTO creates_lineage_cycle;
    IF creates_lineage_cycle THEN
      RAISE EXCEPTION 'Qualification Clearance correction or supersession cycle is not allowed';
    END IF;
  END IF;

  RETURN NEW;
END;
$clearance_guard$ LANGUAGE plpgsql;

CREATE TRIGGER "QualificationClearance_guard"
BEFORE INSERT OR UPDATE OR DELETE ON "QualificationClearance"
FOR EACH ROW EXECUTE FUNCTION "guardQualificationClearance"();
