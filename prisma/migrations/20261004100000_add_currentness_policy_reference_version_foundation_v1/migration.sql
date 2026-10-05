CREATE TABLE "CurrentnessPolicyReference" (
  "id" TEXT NOT NULL,
  "policyKey" TEXT NOT NULL,
  "authorityRef" TEXT NOT NULL,
  "productDefinitionReferenceId" TEXT,
  "provenance" JSONB NOT NULL,
  "integrityFingerprint" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "CurrentnessPolicyReference_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CurrentnessPolicyReference_exact_identity" CHECK (
    btrim("policyKey") = "policyKey" AND "policyKey" <> ''
    AND lower("policyKey") NOT IN ('latest', 'current')
    AND btrim("authorityRef") = "authorityRef" AND "authorityRef" <> ''
    AND lower("authorityRef") NOT IN ('latest', 'current')
    AND jsonb_typeof("provenance") = 'object' AND "provenance" <> '{}'::jsonb
    AND btrim("integrityFingerprint") = "integrityFingerprint" AND "integrityFingerprint" <> ''
    AND (
      "productDefinitionReferenceId" IS NULL
      OR (
        btrim("productDefinitionReferenceId") = "productDefinitionReferenceId"
        AND "productDefinitionReferenceId" <> ''
        AND lower("productDefinitionReferenceId") NOT IN ('latest', 'current')
      )
    )
  )
);

CREATE TABLE "CurrentnessPolicyVersion" (
  "id" TEXT NOT NULL,
  "policyReferenceId" TEXT NOT NULL,
  "versionKey" TEXT NOT NULL,
  "lifecycleState" "MethodResultRegistryLifecycleState" NOT NULL,
  "authorityRef" TEXT NOT NULL,
  "methodVersionId" TEXT,
  "provenance" JSONB NOT NULL,
  "integrityFingerprint" TEXT NOT NULL,
  "effectiveAt" TIMESTAMP(3),
  "formalizedAt" TIMESTAMP(3),
  "admittedAt" TIMESTAMP(3),
  "supersedesPolicyVersionId" TEXT,
  "correctionOfPolicyVersionId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "CurrentnessPolicyVersion_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CurrentnessPolicyVersion_exact_identity" CHECK (
    btrim("policyReferenceId") = "policyReferenceId" AND "policyReferenceId" <> ''
    AND lower("policyReferenceId") NOT IN ('latest', 'current')
    AND btrim("versionKey") = "versionKey" AND "versionKey" <> ''
    AND lower("versionKey") NOT IN ('latest', 'current')
    AND btrim("authorityRef") = "authorityRef" AND "authorityRef" <> ''
    AND lower("authorityRef") NOT IN ('latest', 'current')
    AND jsonb_typeof("provenance") = 'object' AND "provenance" <> '{}'::jsonb
    AND btrim("integrityFingerprint") = "integrityFingerprint" AND "integrityFingerprint" <> ''
    AND (
      "methodVersionId" IS NULL
      OR (
        btrim("methodVersionId") = "methodVersionId"
        AND "methodVersionId" <> ''
        AND lower("methodVersionId") NOT IN ('latest', 'current')
      )
    )
    AND num_nonnulls("supersedesPolicyVersionId", "correctionOfPolicyVersionId") <= 1
    AND "supersedesPolicyVersionId" IS DISTINCT FROM "id"
    AND "correctionOfPolicyVersionId" IS DISTINCT FROM "id"
    AND (
      "lifecycleState" NOT IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS')
      OR ("formalizedAt" IS NOT NULL AND "admittedAt" IS NOT NULL)
    )
  )
);

CREATE UNIQUE INDEX "CurrentnessPolicyReference_policyKey_key"
ON "CurrentnessPolicyReference"("policyKey");
CREATE UNIQUE INDEX "CurrentnessPolicyReference_fingerprint_key"
ON "CurrentnessPolicyReference"("integrityFingerprint");
CREATE INDEX "CurrentnessPolicyReference_productDefinition_idx"
ON "CurrentnessPolicyReference"("productDefinitionReferenceId");

CREATE UNIQUE INDEX "CurrentnessPolicyVersion_fingerprint_key"
ON "CurrentnessPolicyVersion"("integrityFingerprint");
CREATE UNIQUE INDEX "CurrentnessPolicyVersion_reference_version_key"
ON "CurrentnessPolicyVersion"("policyReferenceId", "versionKey");
CREATE UNIQUE INDEX "CurrentnessPolicyVersion_supersedes_key"
ON "CurrentnessPolicyVersion"("supersedesPolicyVersionId");
CREATE UNIQUE INDEX "CurrentnessPolicyVersion_correction_key"
ON "CurrentnessPolicyVersion"("correctionOfPolicyVersionId");
CREATE INDEX "CurrentnessPolicyVersion_state_idx"
ON "CurrentnessPolicyVersion"("lifecycleState", "formalizedAt", "admittedAt");
CREATE INDEX "CurrentnessPolicyVersion_methodVersion_idx"
ON "CurrentnessPolicyVersion"("methodVersionId");

ALTER TABLE "CurrentnessPolicyReference"
ADD CONSTRAINT "CurrentnessPolicyReference_productDefinition_fkey"
FOREIGN KEY ("productDefinitionReferenceId") REFERENCES "ProductDefinitionReference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "CurrentnessPolicyVersion"
ADD CONSTRAINT "CurrentnessPolicyVersion_reference_fkey"
FOREIGN KEY ("policyReferenceId") REFERENCES "CurrentnessPolicyReference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessPolicyVersion"
ADD CONSTRAINT "CurrentnessPolicyVersion_methodVersion_fkey"
FOREIGN KEY ("methodVersionId") REFERENCES "CanonicalMethodVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessPolicyVersion"
ADD CONSTRAINT "CurrentnessPolicyVersion_supersedes_fkey"
FOREIGN KEY ("supersedesPolicyVersionId") REFERENCES "CurrentnessPolicyVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessPolicyVersion"
ADD CONSTRAINT "CurrentnessPolicyVersion_correction_fkey"
FOREIGN KEY ("correctionOfPolicyVersionId") REFERENCES "CurrentnessPolicyVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE FUNCTION "guardCurrentnessPolicyVersion"() RETURNS trigger AS $policy_version_guard$
DECLARE
  target_reference_id TEXT;
  lineage_reaches_self BOOLEAN;
BEGIN
  IF NEW."supersedesPolicyVersionId" IS NOT NULL THEN
    SELECT "policyReferenceId" INTO target_reference_id
    FROM "CurrentnessPolicyVersion"
    WHERE "id" = NEW."supersedesPolicyVersionId";
    IF target_reference_id IS DISTINCT FROM NEW."policyReferenceId" THEN
      RAISE EXCEPTION 'Currentness Policy Version supersession must remain within one Policy Reference';
    END IF;
  END IF;

  IF NEW."correctionOfPolicyVersionId" IS NOT NULL THEN
    SELECT "policyReferenceId" INTO target_reference_id
    FROM "CurrentnessPolicyVersion"
    WHERE "id" = NEW."correctionOfPolicyVersionId";
    IF target_reference_id IS DISTINCT FROM NEW."policyReferenceId" THEN
      RAISE EXCEPTION 'Currentness Policy Version correction must remain within one Policy Reference';
    END IF;
  END IF;

  WITH RECURSIVE lineage("id", "supersedesPolicyVersionId", "correctionOfPolicyVersionId") AS (
    SELECT "id", "supersedesPolicyVersionId", "correctionOfPolicyVersionId"
    FROM "CurrentnessPolicyVersion"
    WHERE "id" IN (NEW."supersedesPolicyVersionId", NEW."correctionOfPolicyVersionId")
    UNION
    SELECT parent."id", parent."supersedesPolicyVersionId", parent."correctionOfPolicyVersionId"
    FROM "CurrentnessPolicyVersion" parent
    JOIN lineage child
      ON parent."id" IN (child."supersedesPolicyVersionId", child."correctionOfPolicyVersionId")
  )
  SELECT EXISTS (SELECT 1 FROM lineage WHERE "id" = NEW."id") INTO lineage_reaches_self;

  IF lineage_reaches_self THEN
    RAISE EXCEPTION 'Currentness Policy Version lineage cannot contain a cycle';
  END IF;

  RETURN NEW;
END;
$policy_version_guard$ LANGUAGE plpgsql;

CREATE FUNCTION "rejectCurrentnessPolicyMutation"() RETURNS trigger AS $policy_immutable_guard$
BEGIN
  RAISE EXCEPTION '% records are immutable', TG_TABLE_NAME;
END;
$policy_immutable_guard$ LANGUAGE plpgsql;

CREATE TRIGGER "CurrentnessPolicyVersion_lineage_guard"
BEFORE INSERT ON "CurrentnessPolicyVersion"
FOR EACH ROW EXECUTE FUNCTION "guardCurrentnessPolicyVersion"();

CREATE TRIGGER "CurrentnessPolicyReference_immutable"
BEFORE UPDATE OR DELETE ON "CurrentnessPolicyReference"
FOR EACH ROW EXECUTE FUNCTION "rejectCurrentnessPolicyMutation"();
CREATE TRIGGER "CurrentnessPolicyVersion_immutable"
BEFORE UPDATE OR DELETE ON "CurrentnessPolicyVersion"
FOR EACH ROW EXECUTE FUNCTION "rejectCurrentnessPolicyMutation"();
