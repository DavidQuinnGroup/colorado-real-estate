CREATE TABLE "OutputSemanticCompositionCompatibilityContext" (
    "id" TEXT NOT NULL,
    "snapshotId" TEXT NOT NULL,
    "resultVersionPinId" TEXT NOT NULL,
    "reportingPeriodVersionPinId" TEXT NOT NULL,
    "analyticalBasisVersionPinId" TEXT NOT NULL,
    "authorityRef" TEXT NOT NULL,
    "roleRef" TEXT NOT NULL,
    "ordinal" INTEGER NOT NULL,
    "provenance" JSONB NOT NULL,
    "integrityFingerprint" TEXT NOT NULL,
    "formalizedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OutputSemanticCompositionCompatibilityContext_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "OutputSemanticCompatibilityContext_exact_metadata" CHECK (
      btrim("authorityRef") = "authorityRef" AND "authorityRef" <> ''
      AND btrim("roleRef") = "roleRef" AND "roleRef" <> ''
      AND "ordinal" >= 0
      AND btrim("integrityFingerprint") = "integrityFingerprint" AND "integrityFingerprint" <> ''
      AND ("formalizedAt" IS NULL OR "formalizedAt" >= "createdAt")
      AND lower("snapshotId") NOT IN ('latest', 'current')
      AND lower("resultVersionPinId") NOT IN ('latest', 'current')
      AND lower("reportingPeriodVersionPinId") NOT IN ('latest', 'current')
      AND lower("analyticalBasisVersionPinId") NOT IN ('latest', 'current')
    )
);

CREATE UNIQUE INDEX "OutputSemanticCompatibilityContext_fingerprint_key"
ON "OutputSemanticCompositionCompatibilityContext"("integrityFingerprint");
CREATE UNIQUE INDEX "OutputSemanticCompatibilityContext_exact_tuple_key"
ON "OutputSemanticCompositionCompatibilityContext"(
  "snapshotId",
  "resultVersionPinId",
  "reportingPeriodVersionPinId",
  "analyticalBasisVersionPinId",
  "roleRef"
);
CREATE UNIQUE INDEX "OutputSemanticCompatibilityContext_role_ordinal_key"
ON "OutputSemanticCompositionCompatibilityContext"("snapshotId", "roleRef", "ordinal");
CREATE INDEX "OutputSemanticCompatibilityContext_resultPin_idx"
ON "OutputSemanticCompositionCompatibilityContext"("resultVersionPinId");
CREATE INDEX "OutputSemanticCompatibilityContext_periodPin_idx"
ON "OutputSemanticCompositionCompatibilityContext"("reportingPeriodVersionPinId");
CREATE INDEX "OutputSemanticCompatibilityContext_basisPin_idx"
ON "OutputSemanticCompositionCompatibilityContext"("analyticalBasisVersionPinId");

ALTER TABLE "OutputSemanticCompositionCompatibilityContext"
ADD CONSTRAINT "OutputSemanticCompatibilityContext_snapshot_fkey"
FOREIGN KEY ("snapshotId") REFERENCES "OutputSemanticCompositionSnapshot"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OutputSemanticCompositionCompatibilityContext"
ADD CONSTRAINT "OutputSemanticCompatibilityContext_resultPin_fkey"
FOREIGN KEY ("resultVersionPinId") REFERENCES "OutputSemanticCompositionResultVersionPin"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OutputSemanticCompositionCompatibilityContext"
ADD CONSTRAINT "OutputSemanticCompatibilityContext_periodPin_fkey"
FOREIGN KEY ("reportingPeriodVersionPinId") REFERENCES "OutputSemanticCompositionReportingPeriodVersionPin"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OutputSemanticCompositionCompatibilityContext"
ADD CONSTRAINT "OutputSemanticCompatibilityContext_basisPin_fkey"
FOREIGN KEY ("analyticalBasisVersionPinId") REFERENCES "OutputSemanticCompositionAnalyticalBasisVersionPin"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE FUNCTION "guardOutputSemanticCompatibilityContext"() RETURNS trigger AS $compatibility_context_guard$
DECLARE
  snapshot_formalized_at TIMESTAMP(3);
  result_pin_snapshot_id TEXT;
  result_version_id TEXT;
  result_version_state "MethodResultRegistryLifecycleState";
  method_requirement "ResultVersionMethodRequirement";
  period_pin_snapshot_id TEXT;
  period_version_formalized_at TIMESTAMP(3);
  basis_pin_snapshot_id TEXT;
  basis_version_formalized_at TIMESTAMP(3);
  producer_count INTEGER;
  formal_producer_count INTEGER;
BEGIN
  IF TG_OP = 'DELETE' THEN
    SELECT "formalizedAt" INTO snapshot_formalized_at
    FROM "OutputSemanticCompositionSnapshot"
    WHERE id = OLD."snapshotId" FOR UPDATE;
    IF OLD."formalizedAt" IS NULL AND snapshot_formalized_at IS NULL THEN
      RETURN OLD;
    END IF;
    RAISE EXCEPTION 'Formal Output semantic composition compatibility contexts are immutable';
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF OLD."id" IS DISTINCT FROM NEW."id"
      OR OLD."snapshotId" IS DISTINCT FROM NEW."snapshotId"
      OR OLD."resultVersionPinId" IS DISTINCT FROM NEW."resultVersionPinId"
      OR OLD."reportingPeriodVersionPinId" IS DISTINCT FROM NEW."reportingPeriodVersionPinId"
      OR OLD."analyticalBasisVersionPinId" IS DISTINCT FROM NEW."analyticalBasisVersionPinId"
      OR OLD."authorityRef" IS DISTINCT FROM NEW."authorityRef"
      OR OLD."roleRef" IS DISTINCT FROM NEW."roleRef"
      OR OLD."ordinal" IS DISTINCT FROM NEW."ordinal"
      OR OLD."provenance" IS DISTINCT FROM NEW."provenance"
      OR OLD."integrityFingerprint" IS DISTINCT FROM NEW."integrityFingerprint"
      OR OLD."createdAt" IS DISTINCT FROM NEW."createdAt"
      OR OLD."immutableAt" IS DISTINCT FROM NEW."immutableAt"
    THEN
      RAISE EXCEPTION 'Output semantic composition compatibility context identity and provenance are immutable';
    END IF;
    IF OLD."formalizedAt" IS NOT NULL OR NEW."formalizedAt" IS NULL THEN
      RAISE EXCEPTION 'Formal Output semantic composition compatibility contexts are immutable';
    END IF;
  END IF;

  SELECT "formalizedAt" INTO snapshot_formalized_at
  FROM "OutputSemanticCompositionSnapshot"
  WHERE id = NEW."snapshotId" FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Compatibility context requires an existing semantic snapshot';
  END IF;
  IF snapshot_formalized_at IS NOT NULL THEN
    RAISE EXCEPTION 'Formal Output semantic composition does not accept compatibility contexts';
  END IF;

  SELECT pin."snapshotId", pin."resultVersionId", version."lifecycleState", version."methodRequirement"
  INTO result_pin_snapshot_id, result_version_id, result_version_state, method_requirement
  FROM "OutputSemanticCompositionResultVersionPin" pin
  JOIN "CanonicalResultVersion" version ON version.id = pin."resultVersionId"
  WHERE pin.id = NEW."resultVersionPinId";
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Compatibility context requires an existing exact ResultVersion pin';
  END IF;

  SELECT pin."snapshotId", version."formalizedAt"
  INTO period_pin_snapshot_id, period_version_formalized_at
  FROM "OutputSemanticCompositionReportingPeriodVersionPin" pin
  JOIN "ReportingPeriodReferenceVersion" version ON version.id = pin."reportingPeriodReferenceVersionId"
  WHERE pin.id = NEW."reportingPeriodVersionPinId";
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Compatibility context requires an existing exact Reporting Period Version pin';
  END IF;

  SELECT pin."snapshotId", version."formalizedAt"
  INTO basis_pin_snapshot_id, basis_version_formalized_at
  FROM "OutputSemanticCompositionAnalyticalBasisVersionPin" pin
  JOIN "AnalyticalBasisReferenceVersion" version ON version.id = pin."analyticalBasisReferenceVersionId"
  WHERE pin.id = NEW."analyticalBasisVersionPinId";
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Compatibility context requires an existing exact Analytical Basis Version pin';
  END IF;

  IF result_pin_snapshot_id IS DISTINCT FROM NEW."snapshotId"
    OR period_pin_snapshot_id IS DISTINCT FROM NEW."snapshotId"
    OR basis_pin_snapshot_id IS DISTINCT FROM NEW."snapshotId"
  THEN
    RAISE EXCEPTION 'Compatibility context pins must belong to the same semantic snapshot';
  END IF;

  IF result_version_state NOT IN (
    'ADMITTED',
    'ADMITTED_WITH_QUALIFICATIONS',
    'SUPERSEDED',
    'CORRECTED',
    'WITHDRAWN',
    'HISTORICAL_ONLY'
  ) THEN
    RAISE EXCEPTION 'Compatibility context requires a formal exact ResultVersion';
  END IF;
  IF period_version_formalized_at IS NULL THEN
    RAISE EXCEPTION 'Compatibility context requires a formal exact Reporting Period Version';
  END IF;
  IF basis_version_formalized_at IS NULL THEN
    RAISE EXCEPTION 'Compatibility context requires a formal exact Analytical Basis Version';
  END IF;

  SELECT
    count(*),
    count(*) FILTER (WHERE method_version."lifecycleState" IN (
      'ADMITTED',
      'ADMITTED_WITH_QUALIFICATIONS',
      'SUPERSEDED',
      'CORRECTED',
      'WITHDRAWN',
      'HISTORICAL_ONLY'
    ))
  INTO producer_count, formal_producer_count
  FROM "MethodResultProductionEdge" edge
  JOIN "CanonicalMethodVersion" method_version ON method_version.id = edge."methodVersionId"
  WHERE edge."resultVersionId" = result_version_id;

  IF method_requirement = 'METHOD_VERSION_REQUIRED' THEN
    IF producer_count <> 1 OR formal_producer_count <> 1 THEN
      RAISE EXCEPTION 'Computational compatibility context requires one formal producing MethodVersion edge';
    END IF;
  ELSIF method_requirement = 'METHOD_VERSION_NOT_APPLICABLE' THEN
    IF producer_count <> 0 THEN
      RAISE EXCEPTION 'Non-computational compatibility context cannot have a producing MethodVersion edge';
    END IF;
  ELSE
    RAISE EXCEPTION 'Compatibility context requires an explicit ResultVersion Method requirement';
  END IF;

  RETURN NEW;
END;
$compatibility_context_guard$ LANGUAGE plpgsql;

CREATE TRIGGER "OutputSemanticCompatibilityContext_guard"
BEFORE INSERT OR UPDATE OR DELETE ON "OutputSemanticCompositionCompatibilityContext"
FOR EACH ROW EXECUTE FUNCTION "guardOutputSemanticCompatibilityContext"();

CREATE FUNCTION "guardOutputSemanticCompatibilityContextClosure"() RETURNS trigger AS $compatibility_context_closure_guard$
DECLARE
  unformalized_context_count INTEGER;
BEGIN
  IF OLD."formalizedAt" IS NULL AND NEW."formalizedAt" IS NOT NULL THEN
    SELECT count(*) INTO unformalized_context_count
    FROM "OutputSemanticCompositionCompatibilityContext"
    WHERE "snapshotId" = NEW.id AND "formalizedAt" IS NULL;
    IF unformalized_context_count <> 0 THEN
      RAISE EXCEPTION 'Semantic snapshot formalization requires formal compatibility contexts';
    END IF;
  END IF;
  RETURN NEW;
END;
$compatibility_context_closure_guard$ LANGUAGE plpgsql;

CREATE TRIGGER "OutputSemanticCompositionSnapshot_compatibility_context_closure_guard"
BEFORE UPDATE OF "formalizedAt" ON "OutputSemanticCompositionSnapshot"
FOR EACH ROW EXECUTE FUNCTION "guardOutputSemanticCompatibilityContextClosure"();
