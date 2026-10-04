CREATE TABLE "OutputSemanticCompositionCurrentnessPolicyPin" (
  "id" TEXT NOT NULL,
  "snapshotId" TEXT NOT NULL,
  "policyVersionId" TEXT NOT NULL,
  "roleRef" TEXT NOT NULL,
  "ordinal" INTEGER NOT NULL,
  "provenance" JSONB NOT NULL,
  "integrityFingerprint" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "OutputSemanticCompositionCurrentnessPolicyPin_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "OutputSemanticCurrentnessPolicyPin_exact_metadata" CHECK (
    btrim("snapshotId") = "snapshotId" AND "snapshotId" <> ''
    AND lower("snapshotId") NOT IN ('latest', 'current')
    AND btrim("policyVersionId") = "policyVersionId" AND "policyVersionId" <> ''
    AND lower("policyVersionId") NOT IN ('latest', 'current')
    AND btrim("roleRef") = "roleRef" AND "roleRef" <> ''
    AND lower("roleRef") NOT IN ('latest', 'current')
    AND "ordinal" >= 0
    AND jsonb_typeof("provenance") = 'object' AND "provenance" <> '{}'::jsonb
    AND btrim("integrityFingerprint") = "integrityFingerprint" AND "integrityFingerprint" <> ''
    AND "immutableAt" >= "createdAt"
  )
);

CREATE TABLE "OutputSemanticCompositionCurrentnessProjectionPin" (
  "id" TEXT NOT NULL,
  "snapshotId" TEXT NOT NULL,
  "projectionVersionId" TEXT NOT NULL,
  "roleRef" TEXT NOT NULL,
  "ordinal" INTEGER NOT NULL,
  "provenance" JSONB NOT NULL,
  "integrityFingerprint" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "OutputSemanticCompositionCurrentnessProjectionPin_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "OutputSemanticCurrentnessProjectionPin_exact_metadata" CHECK (
    btrim("snapshotId") = "snapshotId" AND "snapshotId" <> ''
    AND lower("snapshotId") NOT IN ('latest', 'current')
    AND btrim("projectionVersionId") = "projectionVersionId" AND "projectionVersionId" <> ''
    AND lower("projectionVersionId") NOT IN ('latest', 'current')
    AND btrim("roleRef") = "roleRef" AND "roleRef" <> ''
    AND lower("roleRef") NOT IN ('latest', 'current')
    AND "ordinal" >= 0
    AND jsonb_typeof("provenance") = 'object' AND "provenance" <> '{}'::jsonb
    AND btrim("integrityFingerprint") = "integrityFingerprint" AND "integrityFingerprint" <> ''
    AND "immutableAt" >= "createdAt"
  )
);

CREATE UNIQUE INDEX "OutputSemanticCurrentnessPolicyPin_fingerprint_key"
ON "OutputSemanticCompositionCurrentnessPolicyPin"("integrityFingerprint");
CREATE UNIQUE INDEX "OutputSemanticCurrentnessPolicyPin_exact_role_key"
ON "OutputSemanticCompositionCurrentnessPolicyPin"("snapshotId", "policyVersionId", "roleRef");
CREATE UNIQUE INDEX "OutputSemanticCurrentnessPolicyPin_role_ordinal_key"
ON "OutputSemanticCompositionCurrentnessPolicyPin"("snapshotId", "roleRef", "ordinal");
CREATE INDEX "OutputSemanticCurrentnessPolicyPin_policyVersion_idx"
ON "OutputSemanticCompositionCurrentnessPolicyPin"("policyVersionId");

CREATE UNIQUE INDEX "OutputSemanticCurrentnessProjectionPin_fingerprint_key"
ON "OutputSemanticCompositionCurrentnessProjectionPin"("integrityFingerprint");
CREATE UNIQUE INDEX "OutputSemanticCurrentnessProjectionPin_exact_role_key"
ON "OutputSemanticCompositionCurrentnessProjectionPin"("snapshotId", "projectionVersionId", "roleRef");
CREATE UNIQUE INDEX "OutputSemanticCurrentnessProjectionPin_role_ordinal_key"
ON "OutputSemanticCompositionCurrentnessProjectionPin"("snapshotId", "roleRef", "ordinal");
CREATE INDEX "OutputSemanticCurrentnessProjectionPin_projectionVersion_idx"
ON "OutputSemanticCompositionCurrentnessProjectionPin"("projectionVersionId");

ALTER TABLE "OutputSemanticCompositionCurrentnessPolicyPin"
ADD CONSTRAINT "OutputSemanticCurrentnessPolicyPin_snapshot_fkey"
FOREIGN KEY ("snapshotId") REFERENCES "OutputSemanticCompositionSnapshot"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "OutputSemanticCompositionCurrentnessPolicyPin"
ADD CONSTRAINT "OutputSemanticCurrentnessPolicyPin_policyVersion_fkey"
FOREIGN KEY ("policyVersionId") REFERENCES "CurrentnessPolicyVersion"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "OutputSemanticCompositionCurrentnessProjectionPin"
ADD CONSTRAINT "OutputSemanticCurrentnessProjectionPin_snapshot_fkey"
FOREIGN KEY ("snapshotId") REFERENCES "OutputSemanticCompositionSnapshot"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "OutputSemanticCompositionCurrentnessProjectionPin"
ADD CONSTRAINT "OutputSemanticCurrentnessProjectionPin_projectionVersion_fkey"
FOREIGN KEY ("projectionVersionId") REFERENCES "CurrentnessProjectionVersion"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE FUNCTION "guardOutputSemanticCurrentnessPolicyPin"() RETURNS trigger AS $currentness_policy_pin_guard$
DECLARE
  snapshot_formalized_at TIMESTAMP(3);
  policy_state TEXT;
  policy_formalized_at TIMESTAMP(3);
  policy_admitted_at TIMESTAMP(3);
  aligned_projection_policy_id TEXT;
BEGIN
  SELECT "formalizedAt" INTO snapshot_formalized_at
  FROM "OutputSemanticCompositionSnapshot"
  WHERE "id" = COALESCE(NEW."snapshotId", OLD."snapshotId")
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Currentness Policy pin requires an exact Output semantic composition snapshot';
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF snapshot_formalized_at IS NOT NULL THEN
      RAISE EXCEPTION 'Formal Output semantic composition does not accept additional Currentness Policy Version pins';
    END IF;

    SELECT "lifecycleState"::TEXT, "formalizedAt", "admittedAt"
    INTO policy_state, policy_formalized_at, policy_admitted_at
    FROM "CurrentnessPolicyVersion"
    WHERE "id" = NEW."policyVersionId";

    IF NOT FOUND
      OR policy_state NOT IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS')
      OR policy_formalized_at IS NULL
      OR policy_admitted_at IS NULL
    THEN
      RAISE EXCEPTION 'Currentness Policy pin requires an exact formal admitted Policy Version';
    END IF;

    SELECT projection_version."policyVersionId"
    INTO aligned_projection_policy_id
    FROM "OutputSemanticCompositionCurrentnessProjectionPin" projection_pin
    JOIN "CurrentnessProjectionVersion" projection_version
      ON projection_version."id" = projection_pin."projectionVersionId"
    WHERE projection_pin."snapshotId" = NEW."snapshotId"
      AND projection_pin."roleRef" = NEW."roleRef"
      AND projection_pin."ordinal" = NEW."ordinal";

    IF FOUND AND aligned_projection_policy_id IS DISTINCT FROM NEW."policyVersionId" THEN
      RAISE EXCEPTION 'Aligned Currentness Policy and Projection pins must use the same exact Policy Version';
    END IF;

    RETURN NEW;
  END IF;

  IF TG_OP = 'DELETE' AND snapshot_formalized_at IS NULL THEN
    RETURN OLD;
  END IF;

  RAISE EXCEPTION 'Output semantic composition Currentness Policy Version pins are immutable';
END;
$currentness_policy_pin_guard$ LANGUAGE plpgsql;

CREATE FUNCTION "guardOutputSemanticCurrentnessProjectionPin"() RETURNS trigger AS $currentness_projection_pin_guard$
DECLARE
  snapshot_formalized_at TIMESTAMP(3);
  projection_state TEXT;
  projection_formalized_at TIMESTAMP(3);
  projection_admitted_at TIMESTAMP(3);
  projection_policy_id TEXT;
  aligned_policy_id TEXT;
BEGIN
  SELECT "formalizedAt" INTO snapshot_formalized_at
  FROM "OutputSemanticCompositionSnapshot"
  WHERE "id" = COALESCE(NEW."snapshotId", OLD."snapshotId")
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Currentness Projection pin requires an exact Output semantic composition snapshot';
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF snapshot_formalized_at IS NOT NULL THEN
      RAISE EXCEPTION 'Formal Output semantic composition does not accept additional Currentness Projection Version pins';
    END IF;

    SELECT "lifecycleState"::TEXT, "formalizedAt", "admittedAt", "policyVersionId"
    INTO projection_state, projection_formalized_at, projection_admitted_at, projection_policy_id
    FROM "CurrentnessProjectionVersion"
    WHERE "id" = NEW."projectionVersionId";

    IF NOT FOUND
      OR projection_state NOT IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS')
      OR projection_formalized_at IS NULL
      OR projection_admitted_at IS NULL
    THEN
      RAISE EXCEPTION 'Currentness Projection pin requires an exact formal admitted Projection Version';
    END IF;

    IF EXISTS (
      SELECT 1
      FROM "CurrentnessProjectionVersion" projection_version
      JOIN "CurrentnessProjectionPrimarySubject" primary_subject
        ON primary_subject."projectionReferenceId" = projection_version."projectionReferenceId"
      WHERE projection_version."id" = NEW."projectionVersionId"
        AND primary_subject."outputSnapshotId" = NEW."snapshotId"
    ) OR EXISTS (
      SELECT 1
      FROM "CurrentnessProjectionDependency" dependency
      WHERE dependency."projectionVersionId" = NEW."projectionVersionId"
        AND dependency."outputSnapshotId" = NEW."snapshotId"
    ) THEN
      RAISE EXCEPTION 'Currentness Projection pin cannot circularly reference the same Output semantic composition snapshot';
    END IF;

    SELECT "policyVersionId"
    INTO aligned_policy_id
    FROM "OutputSemanticCompositionCurrentnessPolicyPin"
    WHERE "snapshotId" = NEW."snapshotId"
      AND "roleRef" = NEW."roleRef"
      AND "ordinal" = NEW."ordinal";

    IF FOUND AND aligned_policy_id IS DISTINCT FROM projection_policy_id THEN
      RAISE EXCEPTION 'Aligned Currentness Policy and Projection pins must use the same exact Policy Version';
    END IF;

    RETURN NEW;
  END IF;

  IF TG_OP = 'DELETE' AND snapshot_formalized_at IS NULL THEN
    RETURN OLD;
  END IF;

  RAISE EXCEPTION 'Output semantic composition Currentness Projection Version pins are immutable';
END;
$currentness_projection_pin_guard$ LANGUAGE plpgsql;

CREATE TRIGGER "OutputSemanticCurrentnessPolicyPin_mutation_guard"
BEFORE INSERT OR UPDATE OR DELETE ON "OutputSemanticCompositionCurrentnessPolicyPin"
FOR EACH ROW EXECUTE FUNCTION "guardOutputSemanticCurrentnessPolicyPin"();

CREATE TRIGGER "OutputSemanticCurrentnessProjectionPin_mutation_guard"
BEFORE INSERT OR UPDATE OR DELETE ON "OutputSemanticCompositionCurrentnessProjectionPin"
FOR EACH ROW EXECUTE FUNCTION "guardOutputSemanticCurrentnessProjectionPin"();

CREATE OR REPLACE FUNCTION "guardOutputSemanticCompositionSnapshotImmutability"() RETURNS trigger AS $semantic_snapshot_guard$
BEGIN
  IF TG_OP = 'DELETE' THEN
    IF OLD."formalizedAt" IS NOT NULL THEN
      RAISE EXCEPTION 'Formal Output semantic composition snapshots are immutable';
    END IF;
    RETURN OLD;
  END IF;

  IF OLD."id" IS DISTINCT FROM NEW."id"
    OR OLD."outputVersionId" IS DISTINCT FROM NEW."outputVersionId"
    OR OLD."productDefinitionRef" IS DISTINCT FROM NEW."productDefinitionRef"
    OR OLD."productDefinitionVersionRef" IS DISTINCT FROM NEW."productDefinitionVersionRef"
    OR OLD."snapshotSchemaVersion" IS DISTINCT FROM NEW."snapshotSchemaVersion"
    OR OLD."provenance" IS DISTINCT FROM NEW."provenance"
    OR OLD."integrityFingerprint" IS DISTINCT FROM NEW."integrityFingerprint"
    OR OLD."createdAt" IS DISTINCT FROM NEW."createdAt"
    OR OLD."immutableAt" IS DISTINCT FROM NEW."immutableAt"
  THEN
    RAISE EXCEPTION 'Output semantic composition snapshot identity, provenance, and fingerprint are immutable';
  END IF;

  IF OLD."formalizedAt" IS NULL AND NEW."formalizedAt" IS NOT NULL THEN
    IF EXISTS (
      SELECT 1
      FROM "OutputSemanticCompositionCurrentnessPolicyPin" policy_pin
      JOIN "OutputSemanticCompositionCurrentnessProjectionPin" projection_pin
        ON projection_pin."snapshotId" = policy_pin."snapshotId"
        AND projection_pin."roleRef" = policy_pin."roleRef"
        AND projection_pin."ordinal" = policy_pin."ordinal"
      JOIN "CurrentnessProjectionVersion" projection_version
        ON projection_version."id" = projection_pin."projectionVersionId"
      WHERE policy_pin."snapshotId" = NEW."id"
        AND projection_version."policyVersionId" IS DISTINCT FROM policy_pin."policyVersionId"
    ) THEN
      RAISE EXCEPTION 'Output semantic composition cannot formalize with policy-inconsistent Currentness pins';
    END IF;
    RETURN NEW;
  END IF;

  RAISE EXCEPTION 'Formal Output semantic composition snapshots are immutable';
END;
$semantic_snapshot_guard$ LANGUAGE plpgsql;
