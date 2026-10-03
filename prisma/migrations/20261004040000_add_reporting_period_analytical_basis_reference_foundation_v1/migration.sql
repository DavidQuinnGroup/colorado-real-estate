CREATE TABLE "ReportingPeriodReference" (
    "id" TEXT NOT NULL,
    "referenceKey" TEXT NOT NULL,
    "periodTypeRef" TEXT NOT NULL,
    "governingAuthorityRef" TEXT NOT NULL,
    "provenance" JSONB NOT NULL,
    "integrityFingerprint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReportingPeriodReference_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ReportingPeriodReference_nonempty_identity" CHECK (
      btrim("referenceKey") = "referenceKey" AND "referenceKey" <> ''
      AND btrim("periodTypeRef") = "periodTypeRef" AND "periodTypeRef" <> ''
      AND btrim("governingAuthorityRef") = "governingAuthorityRef" AND "governingAuthorityRef" <> ''
      AND btrim("integrityFingerprint") = "integrityFingerprint" AND "integrityFingerprint" <> ''
    )
);

CREATE TABLE "ReportingPeriodReferenceVersion" (
    "id" TEXT NOT NULL,
    "reportingPeriodReferenceId" TEXT NOT NULL,
    "versionRef" TEXT NOT NULL,
    "asOfAt" TIMESTAMP(3),
    "periodStartAt" TIMESTAMP(3),
    "periodEndAt" TIMESTAMP(3),
    "timezoneRef" TEXT,
    "endpointRuleRef" TEXT,
    "dataThroughAt" TIMESTAMP(3),
    "postureRef" TEXT,
    "completenessRef" TEXT,
    "provenance" JSONB NOT NULL,
    "integrityFingerprint" TEXT NOT NULL,
    "formalizedAt" TIMESTAMP(3),
    "supersedesReferenceVersionId" TEXT,
    "correctionOfReferenceVersionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReportingPeriodReferenceVersion_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ReportingPeriodReferenceVersion_exact_identity" CHECK (
      btrim("versionRef") = "versionRef" AND "versionRef" <> ''
      AND lower("versionRef") NOT IN ('latest', 'current')
      AND btrim("integrityFingerprint") = "integrityFingerprint" AND "integrityFingerprint" <> ''
      AND ("timezoneRef" IS NULL OR (btrim("timezoneRef") = "timezoneRef" AND "timezoneRef" <> ''))
      AND ("endpointRuleRef" IS NULL OR (btrim("endpointRuleRef") = "endpointRuleRef" AND "endpointRuleRef" <> ''))
      AND ("postureRef" IS NULL OR (btrim("postureRef") = "postureRef" AND "postureRef" <> ''))
      AND ("completenessRef" IS NULL OR (btrim("completenessRef") = "completenessRef" AND "completenessRef" <> ''))
    ),
    CONSTRAINT "ReportingPeriodReferenceVersion_interval_order" CHECK (
      "periodStartAt" IS NULL OR "periodEndAt" IS NULL OR "periodStartAt" <= "periodEndAt"
    ),
    CONSTRAINT "ReportingPeriodReferenceVersion_lineage_exclusive" CHECK (
      num_nonnulls("supersedesReferenceVersionId", "correctionOfReferenceVersionId") <= 1
    ),
    CONSTRAINT "ReportingPeriodReferenceVersion_no_self_reference" CHECK (
      "id" IS DISTINCT FROM "supersedesReferenceVersionId"
      AND "id" IS DISTINCT FROM "correctionOfReferenceVersionId"
    )
);

CREATE TABLE "AnalyticalBasisReference" (
    "id" TEXT NOT NULL,
    "referenceKey" TEXT NOT NULL,
    "governingAuthorityRef" TEXT NOT NULL,
    "provenance" JSONB NOT NULL,
    "integrityFingerprint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticalBasisReference_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "AnalyticalBasisReference_nonempty_identity" CHECK (
      btrim("referenceKey") = "referenceKey" AND "referenceKey" <> ''
      AND btrim("governingAuthorityRef") = "governingAuthorityRef" AND "governingAuthorityRef" <> ''
      AND btrim("integrityFingerprint") = "integrityFingerprint" AND "integrityFingerprint" <> ''
    )
);

CREATE TABLE "AnalyticalBasisReferenceVersion" (
    "id" TEXT NOT NULL,
    "analyticalBasisReferenceId" TEXT NOT NULL,
    "versionRef" TEXT NOT NULL,
    "semanticDimensions" JSONB NOT NULL,
    "unitsRef" TEXT,
    "currencyRef" TEXT,
    "nominalRealRef" TEXT,
    "taxTreatmentRef" TEXT,
    "grossNetRef" TEXT,
    "cashAccrualRef" TEXT,
    "leverageRef" TEXT,
    "grainRef" TEXT,
    "postureRef" TEXT,
    "truthClassRef" TEXT,
    "provenance" JSONB NOT NULL,
    "integrityFingerprint" TEXT NOT NULL,
    "formalizedAt" TIMESTAMP(3),
    "supersedesReferenceVersionId" TEXT,
    "correctionOfReferenceVersionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticalBasisReferenceVersion_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "AnalyticalBasisReferenceVersion_exact_identity" CHECK (
      btrim("versionRef") = "versionRef" AND "versionRef" <> ''
      AND lower("versionRef") NOT IN ('latest', 'current')
      AND btrim("integrityFingerprint") = "integrityFingerprint" AND "integrityFingerprint" <> ''
      AND ("unitsRef" IS NULL OR (btrim("unitsRef") = "unitsRef" AND "unitsRef" <> ''))
      AND ("currencyRef" IS NULL OR (btrim("currencyRef") = "currencyRef" AND "currencyRef" <> ''))
      AND ("nominalRealRef" IS NULL OR (btrim("nominalRealRef") = "nominalRealRef" AND "nominalRealRef" <> ''))
      AND ("taxTreatmentRef" IS NULL OR (btrim("taxTreatmentRef") = "taxTreatmentRef" AND "taxTreatmentRef" <> ''))
      AND ("grossNetRef" IS NULL OR (btrim("grossNetRef") = "grossNetRef" AND "grossNetRef" <> ''))
      AND ("cashAccrualRef" IS NULL OR (btrim("cashAccrualRef") = "cashAccrualRef" AND "cashAccrualRef" <> ''))
      AND ("leverageRef" IS NULL OR (btrim("leverageRef") = "leverageRef" AND "leverageRef" <> ''))
      AND ("grainRef" IS NULL OR (btrim("grainRef") = "grainRef" AND "grainRef" <> ''))
      AND ("postureRef" IS NULL OR (btrim("postureRef") = "postureRef" AND "postureRef" <> ''))
      AND ("truthClassRef" IS NULL OR (btrim("truthClassRef") = "truthClassRef" AND "truthClassRef" <> ''))
    ),
    CONSTRAINT "AnalyticalBasisReferenceVersion_lineage_exclusive" CHECK (
      num_nonnulls("supersedesReferenceVersionId", "correctionOfReferenceVersionId") <= 1
    ),
    CONSTRAINT "AnalyticalBasisReferenceVersion_no_self_reference" CHECK (
      "id" IS DISTINCT FROM "supersedesReferenceVersionId"
      AND "id" IS DISTINCT FROM "correctionOfReferenceVersionId"
    )
);

CREATE TABLE "OutputSemanticCompositionReportingPeriodVersionPin" (
    "id" TEXT NOT NULL,
    "snapshotId" TEXT NOT NULL,
    "reportingPeriodReferenceVersionId" TEXT NOT NULL,
    "roleRef" TEXT NOT NULL,
    "ordinal" INTEGER NOT NULL,
    "provenance" JSONB NOT NULL,
    "integrityFingerprint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OutputSemanticCompositionReportingPeriodVersionPin_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "OutputSemanticCompositionReportingPeriodVersionPin_metadata" CHECK (
      btrim("roleRef") = "roleRef" AND "roleRef" <> ''
      AND "ordinal" >= 0
      AND btrim("integrityFingerprint") = "integrityFingerprint" AND "integrityFingerprint" <> ''
    )
);

CREATE TABLE "OutputSemanticCompositionAnalyticalBasisVersionPin" (
    "id" TEXT NOT NULL,
    "snapshotId" TEXT NOT NULL,
    "analyticalBasisReferenceVersionId" TEXT NOT NULL,
    "roleRef" TEXT NOT NULL,
    "ordinal" INTEGER NOT NULL,
    "provenance" JSONB NOT NULL,
    "integrityFingerprint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OutputSemanticCompositionAnalyticalBasisVersionPin_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "OutputSemanticCompositionAnalyticalBasisVersionPin_metadata" CHECK (
      btrim("roleRef") = "roleRef" AND "roleRef" <> ''
      AND "ordinal" >= 0
      AND btrim("integrityFingerprint") = "integrityFingerprint" AND "integrityFingerprint" <> ''
    )
);

CREATE UNIQUE INDEX "ReportingPeriodReference_referenceKey_key"
ON "ReportingPeriodReference"("referenceKey");
CREATE UNIQUE INDEX "ReportingPeriodReference_integrityFingerprint_key"
ON "ReportingPeriodReference"("integrityFingerprint");
CREATE INDEX "ReportingPeriodReference_type_authority_idx"
ON "ReportingPeriodReference"("periodTypeRef", "governingAuthorityRef");

CREATE UNIQUE INDEX "ReportingPeriodReferenceVersion_integrityFingerprint_key"
ON "ReportingPeriodReferenceVersion"("integrityFingerprint");
CREATE UNIQUE INDEX "ReportingPeriodReferenceVersion_supersedesReferenceVersionId_key"
ON "ReportingPeriodReferenceVersion"("supersedesReferenceVersionId");
CREATE UNIQUE INDEX "ReportingPeriodReferenceVersion_correctionOfReferenceVersionId_key"
ON "ReportingPeriodReferenceVersion"("correctionOfReferenceVersionId");
CREATE UNIQUE INDEX "ReportingPeriodReferenceVersion_lineagePredecessor_key"
ON "ReportingPeriodReferenceVersion" ((COALESCE("supersedesReferenceVersionId", "correctionOfReferenceVersionId")))
WHERE num_nonnulls("supersedesReferenceVersionId", "correctionOfReferenceVersionId") = 1;
CREATE UNIQUE INDEX "ReportingPeriodReferenceVersion_reference_version_key"
ON "ReportingPeriodReferenceVersion"("reportingPeriodReferenceId", "versionRef");
CREATE INDEX "ReportingPeriodReferenceVersion_temporal_idx"
ON "ReportingPeriodReferenceVersion"("asOfAt", "periodStartAt", "periodEndAt");

CREATE UNIQUE INDEX "AnalyticalBasisReference_referenceKey_key"
ON "AnalyticalBasisReference"("referenceKey");
CREATE UNIQUE INDEX "AnalyticalBasisReference_integrityFingerprint_key"
ON "AnalyticalBasisReference"("integrityFingerprint");
CREATE INDEX "AnalyticalBasisReference_authority_idx"
ON "AnalyticalBasisReference"("governingAuthorityRef");

CREATE UNIQUE INDEX "AnalyticalBasisReferenceVersion_integrityFingerprint_key"
ON "AnalyticalBasisReferenceVersion"("integrityFingerprint");
CREATE UNIQUE INDEX "AnalyticalBasisReferenceVersion_supersedesReferenceVersionId_key"
ON "AnalyticalBasisReferenceVersion"("supersedesReferenceVersionId");
CREATE UNIQUE INDEX "AnalyticalBasisReferenceVersion_correctionOfReferenceVersionId_key"
ON "AnalyticalBasisReferenceVersion"("correctionOfReferenceVersionId");
CREATE UNIQUE INDEX "AnalyticalBasisReferenceVersion_lineagePredecessor_key"
ON "AnalyticalBasisReferenceVersion" ((COALESCE("supersedesReferenceVersionId", "correctionOfReferenceVersionId")))
WHERE num_nonnulls("supersedesReferenceVersionId", "correctionOfReferenceVersionId") = 1;
CREATE UNIQUE INDEX "AnalyticalBasisReferenceVersion_reference_version_key"
ON "AnalyticalBasisReferenceVersion"("analyticalBasisReferenceId", "versionRef");

CREATE UNIQUE INDEX "OutputSemanticCompositionReportingPeriodVersionPin_integrityFingerprint_key"
ON "OutputSemanticCompositionReportingPeriodVersionPin"("integrityFingerprint");
CREATE UNIQUE INDEX "OutputSemanticPeriodPin_exact_role_key"
ON "OutputSemanticCompositionReportingPeriodVersionPin"("snapshotId", "reportingPeriodReferenceVersionId", "roleRef");
CREATE UNIQUE INDEX "OutputSemanticPeriodPin_role_ordinal_key"
ON "OutputSemanticCompositionReportingPeriodVersionPin"("snapshotId", "roleRef", "ordinal");
CREATE INDEX "OutputSemanticPeriodPin_periodVersion_idx"
ON "OutputSemanticCompositionReportingPeriodVersionPin"("reportingPeriodReferenceVersionId");

CREATE UNIQUE INDEX "OutputSemanticCompositionAnalyticalBasisVersionPin_integrityFingerprint_key"
ON "OutputSemanticCompositionAnalyticalBasisVersionPin"("integrityFingerprint");
CREATE UNIQUE INDEX "OutputSemanticBasisPin_exact_role_key"
ON "OutputSemanticCompositionAnalyticalBasisVersionPin"("snapshotId", "analyticalBasisReferenceVersionId", "roleRef");
CREATE UNIQUE INDEX "OutputSemanticBasisPin_role_ordinal_key"
ON "OutputSemanticCompositionAnalyticalBasisVersionPin"("snapshotId", "roleRef", "ordinal");
CREATE INDEX "OutputSemanticBasisPin_basisVersion_idx"
ON "OutputSemanticCompositionAnalyticalBasisVersionPin"("analyticalBasisReferenceVersionId");

ALTER TABLE "ReportingPeriodReferenceVersion"
ADD CONSTRAINT "ReportingPeriodReferenceVersion_reference_fkey"
FOREIGN KEY ("reportingPeriodReferenceId") REFERENCES "ReportingPeriodReference"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ReportingPeriodReferenceVersion"
ADD CONSTRAINT "ReportingPeriodReferenceVersion_supersedesReferenceVersionId_fkey"
FOREIGN KEY ("supersedesReferenceVersionId") REFERENCES "ReportingPeriodReferenceVersion"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ReportingPeriodReferenceVersion"
ADD CONSTRAINT "ReportingPeriodReferenceVersion_correctionOfReferenceVersionId_fkey"
FOREIGN KEY ("correctionOfReferenceVersionId") REFERENCES "ReportingPeriodReferenceVersion"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "AnalyticalBasisReferenceVersion"
ADD CONSTRAINT "AnalyticalBasisReferenceVersion_reference_fkey"
FOREIGN KEY ("analyticalBasisReferenceId") REFERENCES "AnalyticalBasisReference"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AnalyticalBasisReferenceVersion"
ADD CONSTRAINT "AnalyticalBasisReferenceVersion_supersedesReferenceVersionId_fkey"
FOREIGN KEY ("supersedesReferenceVersionId") REFERENCES "AnalyticalBasisReferenceVersion"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AnalyticalBasisReferenceVersion"
ADD CONSTRAINT "AnalyticalBasisReferenceVersion_correctionOfReferenceVersionId_fkey"
FOREIGN KEY ("correctionOfReferenceVersionId") REFERENCES "AnalyticalBasisReferenceVersion"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "OutputSemanticCompositionReportingPeriodVersionPin"
ADD CONSTRAINT "OutputSemanticPeriodPin_snapshot_fkey"
FOREIGN KEY ("snapshotId") REFERENCES "OutputSemanticCompositionSnapshot"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OutputSemanticCompositionReportingPeriodVersionPin"
ADD CONSTRAINT "OutputSemanticPeriodPin_periodVersion_fkey"
FOREIGN KEY ("reportingPeriodReferenceVersionId") REFERENCES "ReportingPeriodReferenceVersion"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "OutputSemanticCompositionAnalyticalBasisVersionPin"
ADD CONSTRAINT "OutputSemanticBasisPin_snapshot_fkey"
FOREIGN KEY ("snapshotId") REFERENCES "OutputSemanticCompositionSnapshot"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OutputSemanticCompositionAnalyticalBasisVersionPin"
ADD CONSTRAINT "OutputSemanticBasisPin_basisVersion_fkey"
FOREIGN KEY ("analyticalBasisReferenceVersionId") REFERENCES "AnalyticalBasisReferenceVersion"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE FUNCTION "guardReportingPeriodReferenceImmutability"() RETURNS trigger AS $reporting_period_reference_guard$
BEGIN
  RAISE EXCEPTION 'Reporting Period reference identity is immutable';
END;
$reporting_period_reference_guard$ LANGUAGE plpgsql;
CREATE TRIGGER "ReportingPeriodReference_immutability_guard"
BEFORE UPDATE OR DELETE ON "ReportingPeriodReference"
FOR EACH ROW EXECUTE FUNCTION "guardReportingPeriodReferenceImmutability"();

CREATE FUNCTION "guardReportingPeriodReferenceVersionLineage"() RETURNS trigger AS $reporting_period_lineage_guard$
DECLARE
  predecessor_id TEXT;
  predecessor_reference_id TEXT;
  predecessor_formalized_at TIMESTAMP(3);
BEGIN
  predecessor_id := COALESCE(NEW."supersedesReferenceVersionId", NEW."correctionOfReferenceVersionId");
  IF predecessor_id IS NULL THEN RETURN NEW; END IF;
  IF predecessor_id = NEW.id THEN
    RAISE EXCEPTION 'Reporting Period reference Version cannot reference itself';
  END IF;
  SELECT "reportingPeriodReferenceId", "formalizedAt"
  INTO predecessor_reference_id, predecessor_formalized_at
  FROM "ReportingPeriodReferenceVersion" WHERE id = predecessor_id;
  IF predecessor_reference_id IS DISTINCT FROM NEW."reportingPeriodReferenceId" THEN
    RAISE EXCEPTION 'Reporting Period reference Version lineage must remain within one reference identity';
  END IF;
  IF predecessor_formalized_at IS NULL THEN
    RAISE EXCEPTION 'Reporting Period reference Version lineage predecessor must be formal';
  END IF;
  RETURN NEW;
END;
$reporting_period_lineage_guard$ LANGUAGE plpgsql;
CREATE TRIGGER "ReportingPeriodReferenceVersion_lineage_guard"
BEFORE INSERT ON "ReportingPeriodReferenceVersion"
FOR EACH ROW EXECUTE FUNCTION "guardReportingPeriodReferenceVersionLineage"();

CREATE FUNCTION "guardReportingPeriodReferenceVersionImmutability"() RETURNS trigger AS $reporting_period_version_guard$
BEGIN
  IF TG_OP = 'DELETE' THEN RAISE EXCEPTION 'Reporting Period reference Versions are immutable'; END IF;
  IF OLD."id" IS DISTINCT FROM NEW."id"
    OR OLD."reportingPeriodReferenceId" IS DISTINCT FROM NEW."reportingPeriodReferenceId"
    OR OLD."versionRef" IS DISTINCT FROM NEW."versionRef"
    OR OLD."asOfAt" IS DISTINCT FROM NEW."asOfAt"
    OR OLD."periodStartAt" IS DISTINCT FROM NEW."periodStartAt"
    OR OLD."periodEndAt" IS DISTINCT FROM NEW."periodEndAt"
    OR OLD."timezoneRef" IS DISTINCT FROM NEW."timezoneRef"
    OR OLD."endpointRuleRef" IS DISTINCT FROM NEW."endpointRuleRef"
    OR OLD."dataThroughAt" IS DISTINCT FROM NEW."dataThroughAt"
    OR OLD."postureRef" IS DISTINCT FROM NEW."postureRef"
    OR OLD."completenessRef" IS DISTINCT FROM NEW."completenessRef"
    OR OLD."provenance" IS DISTINCT FROM NEW."provenance"
    OR OLD."integrityFingerprint" IS DISTINCT FROM NEW."integrityFingerprint"
    OR OLD."supersedesReferenceVersionId" IS DISTINCT FROM NEW."supersedesReferenceVersionId"
    OR OLD."correctionOfReferenceVersionId" IS DISTINCT FROM NEW."correctionOfReferenceVersionId"
    OR OLD."createdAt" IS DISTINCT FROM NEW."createdAt"
    OR OLD."immutableAt" IS DISTINCT FROM NEW."immutableAt"
  THEN RAISE EXCEPTION 'Reporting Period reference Version content and lineage are immutable'; END IF;
  IF OLD."formalizedAt" IS NULL AND NEW."formalizedAt" IS NOT NULL THEN RETURN NEW; END IF;
  RAISE EXCEPTION 'Formal Reporting Period reference Versions are immutable';
END;
$reporting_period_version_guard$ LANGUAGE plpgsql;
CREATE TRIGGER "ReportingPeriodReferenceVersion_immutability_guard"
BEFORE UPDATE OR DELETE ON "ReportingPeriodReferenceVersion"
FOR EACH ROW EXECUTE FUNCTION "guardReportingPeriodReferenceVersionImmutability"();

CREATE FUNCTION "guardAnalyticalBasisReferenceImmutability"() RETURNS trigger AS $analytical_basis_reference_guard$
BEGIN
  RAISE EXCEPTION 'Analytical Basis reference identity is immutable';
END;
$analytical_basis_reference_guard$ LANGUAGE plpgsql;
CREATE TRIGGER "AnalyticalBasisReference_immutability_guard"
BEFORE UPDATE OR DELETE ON "AnalyticalBasisReference"
FOR EACH ROW EXECUTE FUNCTION "guardAnalyticalBasisReferenceImmutability"();

CREATE FUNCTION "guardAnalyticalBasisReferenceVersionLineage"() RETURNS trigger AS $analytical_basis_lineage_guard$
DECLARE
  predecessor_id TEXT;
  predecessor_reference_id TEXT;
  predecessor_formalized_at TIMESTAMP(3);
BEGIN
  predecessor_id := COALESCE(NEW."supersedesReferenceVersionId", NEW."correctionOfReferenceVersionId");
  IF predecessor_id IS NULL THEN RETURN NEW; END IF;
  IF predecessor_id = NEW.id THEN
    RAISE EXCEPTION 'Analytical Basis reference Version cannot reference itself';
  END IF;
  SELECT "analyticalBasisReferenceId", "formalizedAt"
  INTO predecessor_reference_id, predecessor_formalized_at
  FROM "AnalyticalBasisReferenceVersion" WHERE id = predecessor_id;
  IF predecessor_reference_id IS DISTINCT FROM NEW."analyticalBasisReferenceId" THEN
    RAISE EXCEPTION 'Analytical Basis reference Version lineage must remain within one reference identity';
  END IF;
  IF predecessor_formalized_at IS NULL THEN
    RAISE EXCEPTION 'Analytical Basis reference Version lineage predecessor must be formal';
  END IF;
  RETURN NEW;
END;
$analytical_basis_lineage_guard$ LANGUAGE plpgsql;
CREATE TRIGGER "AnalyticalBasisReferenceVersion_lineage_guard"
BEFORE INSERT ON "AnalyticalBasisReferenceVersion"
FOR EACH ROW EXECUTE FUNCTION "guardAnalyticalBasisReferenceVersionLineage"();

CREATE FUNCTION "guardAnalyticalBasisReferenceVersionImmutability"() RETURNS trigger AS $analytical_basis_version_guard$
BEGIN
  IF TG_OP = 'DELETE' THEN RAISE EXCEPTION 'Analytical Basis reference Versions are immutable'; END IF;
  IF OLD."id" IS DISTINCT FROM NEW."id"
    OR OLD."analyticalBasisReferenceId" IS DISTINCT FROM NEW."analyticalBasisReferenceId"
    OR OLD."versionRef" IS DISTINCT FROM NEW."versionRef"
    OR OLD."semanticDimensions" IS DISTINCT FROM NEW."semanticDimensions"
    OR OLD."unitsRef" IS DISTINCT FROM NEW."unitsRef"
    OR OLD."currencyRef" IS DISTINCT FROM NEW."currencyRef"
    OR OLD."nominalRealRef" IS DISTINCT FROM NEW."nominalRealRef"
    OR OLD."taxTreatmentRef" IS DISTINCT FROM NEW."taxTreatmentRef"
    OR OLD."grossNetRef" IS DISTINCT FROM NEW."grossNetRef"
    OR OLD."cashAccrualRef" IS DISTINCT FROM NEW."cashAccrualRef"
    OR OLD."leverageRef" IS DISTINCT FROM NEW."leverageRef"
    OR OLD."grainRef" IS DISTINCT FROM NEW."grainRef"
    OR OLD."postureRef" IS DISTINCT FROM NEW."postureRef"
    OR OLD."truthClassRef" IS DISTINCT FROM NEW."truthClassRef"
    OR OLD."provenance" IS DISTINCT FROM NEW."provenance"
    OR OLD."integrityFingerprint" IS DISTINCT FROM NEW."integrityFingerprint"
    OR OLD."supersedesReferenceVersionId" IS DISTINCT FROM NEW."supersedesReferenceVersionId"
    OR OLD."correctionOfReferenceVersionId" IS DISTINCT FROM NEW."correctionOfReferenceVersionId"
    OR OLD."createdAt" IS DISTINCT FROM NEW."createdAt"
    OR OLD."immutableAt" IS DISTINCT FROM NEW."immutableAt"
  THEN RAISE EXCEPTION 'Analytical Basis reference Version content and lineage are immutable'; END IF;
  IF OLD."formalizedAt" IS NULL AND NEW."formalizedAt" IS NOT NULL THEN RETURN NEW; END IF;
  RAISE EXCEPTION 'Formal Analytical Basis reference Versions are immutable';
END;
$analytical_basis_version_guard$ LANGUAGE plpgsql;
CREATE TRIGGER "AnalyticalBasisReferenceVersion_immutability_guard"
BEFORE UPDATE OR DELETE ON "AnalyticalBasisReferenceVersion"
FOR EACH ROW EXECUTE FUNCTION "guardAnalyticalBasisReferenceVersionImmutability"();

CREATE FUNCTION "guardOutputSemanticCompositionPeriodPinImmutability"() RETURNS trigger AS $semantic_period_pin_guard$
DECLARE
  snapshot_formalized_at TIMESTAMP(3);
  period_version_formalized_at TIMESTAMP(3);
BEGIN
  SELECT "formalizedAt" INTO snapshot_formalized_at
  FROM "OutputSemanticCompositionSnapshot"
  WHERE id = COALESCE(NEW."snapshotId", OLD."snapshotId") FOR UPDATE;
  IF TG_OP = 'INSERT' THEN
    SELECT "formalizedAt" INTO period_version_formalized_at
    FROM "ReportingPeriodReferenceVersion"
    WHERE id = NEW."reportingPeriodReferenceVersionId";
    IF snapshot_formalized_at IS NOT NULL THEN
      RAISE EXCEPTION 'Formal Output semantic composition does not accept Reporting Period Version pins';
    END IF;
    IF period_version_formalized_at IS NULL THEN
      RAISE EXCEPTION 'Reporting Period Version pins require a formal exact Version';
    END IF;
    RETURN NEW;
  END IF;
  IF TG_OP = 'DELETE' AND snapshot_formalized_at IS NULL THEN RETURN OLD; END IF;
  RAISE EXCEPTION 'Formal Output semantic composition Reporting Period Version pins are immutable';
END;
$semantic_period_pin_guard$ LANGUAGE plpgsql;
CREATE TRIGGER "OutputSemanticCompositionPeriodPin_immutability_guard"
BEFORE INSERT OR UPDATE OR DELETE ON "OutputSemanticCompositionReportingPeriodVersionPin"
FOR EACH ROW EXECUTE FUNCTION "guardOutputSemanticCompositionPeriodPinImmutability"();

CREATE FUNCTION "guardOutputSemanticCompositionBasisPinImmutability"() RETURNS trigger AS $semantic_basis_pin_guard$
DECLARE
  snapshot_formalized_at TIMESTAMP(3);
  basis_version_formalized_at TIMESTAMP(3);
BEGIN
  SELECT "formalizedAt" INTO snapshot_formalized_at
  FROM "OutputSemanticCompositionSnapshot"
  WHERE id = COALESCE(NEW."snapshotId", OLD."snapshotId") FOR UPDATE;
  IF TG_OP = 'INSERT' THEN
    SELECT "formalizedAt" INTO basis_version_formalized_at
    FROM "AnalyticalBasisReferenceVersion"
    WHERE id = NEW."analyticalBasisReferenceVersionId";
    IF snapshot_formalized_at IS NOT NULL THEN
      RAISE EXCEPTION 'Formal Output semantic composition does not accept Analytical Basis Version pins';
    END IF;
    IF basis_version_formalized_at IS NULL THEN
      RAISE EXCEPTION 'Analytical Basis Version pins require a formal exact Version';
    END IF;
    RETURN NEW;
  END IF;
  IF TG_OP = 'DELETE' AND snapshot_formalized_at IS NULL THEN RETURN OLD; END IF;
  RAISE EXCEPTION 'Formal Output semantic composition Analytical Basis Version pins are immutable';
END;
$semantic_basis_pin_guard$ LANGUAGE plpgsql;
CREATE TRIGGER "OutputSemanticCompositionBasisPin_immutability_guard"
BEFORE INSERT OR UPDATE OR DELETE ON "OutputSemanticCompositionAnalyticalBasisVersionPin"
FOR EACH ROW EXECUTE FUNCTION "guardOutputSemanticCompositionBasisPinImmutability"();
