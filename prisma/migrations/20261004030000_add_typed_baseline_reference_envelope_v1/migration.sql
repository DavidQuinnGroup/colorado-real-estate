CREATE TABLE "BaselineReference" (
    "id" TEXT NOT NULL,
    "referenceKey" TEXT NOT NULL,
    "baselineFamilyRef" TEXT NOT NULL,
    "governingOwnerRef" TEXT NOT NULL,
    "purposeRef" TEXT NOT NULL,
    "subjectRef" TEXT NOT NULL,
    "contextRef" TEXT,
    "productDefinitionRef" TEXT,
    "productDefinitionVersionRef" TEXT,
    "provenance" JSONB NOT NULL,
    "integrityFingerprint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BaselineReference_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "BaselineReference_nonempty_identity" CHECK (
      btrim("referenceKey") = "referenceKey" AND "referenceKey" <> ''
      AND btrim("baselineFamilyRef") = "baselineFamilyRef" AND "baselineFamilyRef" <> ''
      AND btrim("governingOwnerRef") = "governingOwnerRef" AND "governingOwnerRef" <> ''
      AND btrim("purposeRef") = "purposeRef" AND "purposeRef" <> ''
      AND btrim("subjectRef") = "subjectRef" AND "subjectRef" <> ''
      AND btrim("integrityFingerprint") = "integrityFingerprint" AND "integrityFingerprint" <> ''
      AND ("contextRef" IS NULL OR (btrim("contextRef") = "contextRef" AND "contextRef" <> ''))
    ),
    CONSTRAINT "BaselineReference_product_reference_pair" CHECK (
      num_nonnulls("productDefinitionRef", "productDefinitionVersionRef") IN (0, 2)
      AND ("productDefinitionRef" IS NULL OR (btrim("productDefinitionRef") = "productDefinitionRef" AND "productDefinitionRef" <> ''))
      AND ("productDefinitionVersionRef" IS NULL OR (btrim("productDefinitionVersionRef") = "productDefinitionVersionRef" AND "productDefinitionVersionRef" <> ''))
    )
);

CREATE TABLE "BaselineReferenceVersion" (
    "id" TEXT NOT NULL,
    "baselineReferenceId" TEXT NOT NULL,
    "versionRef" TEXT NOT NULL,
    "targetResourceType" TEXT NOT NULL,
    "targetResourceId" TEXT NOT NULL,
    "targetResourceVersion" TEXT NOT NULL,
    "effectiveAsOf" TIMESTAMP(3),
    "reviewStateRef" TEXT,
    "finalityStateRef" TEXT,
    "selectionProvenance" JSONB,
    "provenance" JSONB NOT NULL,
    "integrityFingerprint" TEXT NOT NULL,
    "formalizedAt" TIMESTAMP(3),
    "supersedesReferenceVersionId" TEXT,
    "correctionOfReferenceVersionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BaselineReferenceVersion_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "BaselineReferenceVersion_exact_target" CHECK (
      btrim("versionRef") = "versionRef" AND "versionRef" <> ''
      AND lower("versionRef") NOT IN ('latest', 'current')
      AND btrim("targetResourceType") = "targetResourceType" AND "targetResourceType" <> ''
      AND btrim("targetResourceId") = "targetResourceId" AND "targetResourceId" <> ''
      AND btrim("targetResourceVersion") = "targetResourceVersion" AND "targetResourceVersion" <> ''
      AND lower(btrim("targetResourceVersion")) NOT IN ('latest', 'current')
      AND btrim("integrityFingerprint") = "integrityFingerprint" AND "integrityFingerprint" <> ''
      AND ("reviewStateRef" IS NULL OR (btrim("reviewStateRef") = "reviewStateRef" AND "reviewStateRef" <> ''))
      AND ("finalityStateRef" IS NULL OR (btrim("finalityStateRef") = "finalityStateRef" AND "finalityStateRef" <> ''))
    ),
    CONSTRAINT "BaselineReferenceVersion_lineage_exclusive" CHECK (
      num_nonnulls("supersedesReferenceVersionId", "correctionOfReferenceVersionId") <= 1
    ),
    CONSTRAINT "BaselineReferenceVersion_no_self_reference" CHECK (
      "id" IS DISTINCT FROM "supersedesReferenceVersionId"
      AND "id" IS DISTINCT FROM "correctionOfReferenceVersionId"
    )
);

CREATE UNIQUE INDEX "BaselineReference_referenceKey_key"
ON "BaselineReference"("referenceKey");

CREATE UNIQUE INDEX "BaselineReference_integrityFingerprint_key"
ON "BaselineReference"("integrityFingerprint");

CREATE INDEX "BaselineReference_family_owner_idx"
ON "BaselineReference"("baselineFamilyRef", "governingOwnerRef");

CREATE INDEX "BaselineReference_productReference_idx"
ON "BaselineReference"("productDefinitionRef", "productDefinitionVersionRef");

CREATE UNIQUE INDEX "BaselineReferenceVersion_integrityFingerprint_key"
ON "BaselineReferenceVersion"("integrityFingerprint");

CREATE UNIQUE INDEX "BaselineReferenceVersion_supersedesReferenceVersionId_key"
ON "BaselineReferenceVersion"("supersedesReferenceVersionId");

CREATE UNIQUE INDEX "BaselineReferenceVersion_correctionOfReferenceVersionId_key"
ON "BaselineReferenceVersion"("correctionOfReferenceVersionId");

CREATE UNIQUE INDEX "BaselineReferenceVersion_lineagePredecessor_key"
ON "BaselineReferenceVersion" ((COALESCE("supersedesReferenceVersionId", "correctionOfReferenceVersionId")))
WHERE num_nonnulls("supersedesReferenceVersionId", "correctionOfReferenceVersionId") = 1;

CREATE UNIQUE INDEX "BaselineReferenceVersion_reference_version_key"
ON "BaselineReferenceVersion"("baselineReferenceId", "versionRef");

CREATE INDEX "BaselineReferenceVersion_exact_target_idx"
ON "BaselineReferenceVersion"("targetResourceType", "targetResourceId", "targetResourceVersion");

ALTER TABLE "BaselineReference"
ADD CONSTRAINT "BaselineReference_productReference_fkey"
FOREIGN KEY ("productDefinitionRef", "productDefinitionVersionRef")
REFERENCES "ProductDefinitionReference"("productDefinitionRef", "productDefinitionVersionRef")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "BaselineReferenceVersion"
ADD CONSTRAINT "BaselineReferenceVersion_reference_fkey"
FOREIGN KEY ("baselineReferenceId") REFERENCES "BaselineReference"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "BaselineReferenceVersion"
ADD CONSTRAINT "BaselineReferenceVersion_supersedesReferenceVersionId_fkey"
FOREIGN KEY ("supersedesReferenceVersionId") REFERENCES "BaselineReferenceVersion"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "BaselineReferenceVersion"
ADD CONSTRAINT "BaselineReferenceVersion_correctionOfReferenceVersionId_fkey"
FOREIGN KEY ("correctionOfReferenceVersionId") REFERENCES "BaselineReferenceVersion"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE FUNCTION "guardBaselineReferenceImmutability"() RETURNS trigger AS $baseline_reference_guard$
BEGIN
  RAISE EXCEPTION 'Baseline reference identity is immutable';
END;
$baseline_reference_guard$ LANGUAGE plpgsql;

CREATE TRIGGER "BaselineReference_immutability_guard"
BEFORE UPDATE OR DELETE ON "BaselineReference"
FOR EACH ROW EXECUTE FUNCTION "guardBaselineReferenceImmutability"();

CREATE FUNCTION "guardBaselineReferenceVersionLineage"() RETURNS trigger AS $baseline_reference_version_lineage_guard$
DECLARE
  predecessor_id TEXT;
  predecessor_reference_id TEXT;
  predecessor_formalized_at TIMESTAMP(3);
BEGIN
  predecessor_id := COALESCE(NEW."supersedesReferenceVersionId", NEW."correctionOfReferenceVersionId");
  IF predecessor_id IS NULL THEN
    RETURN NEW;
  END IF;

  IF predecessor_id = NEW.id THEN
    RAISE EXCEPTION 'Baseline reference Version cannot reference itself';
  END IF;

  SELECT "baselineReferenceId", "formalizedAt"
  INTO predecessor_reference_id, predecessor_formalized_at
  FROM "BaselineReferenceVersion"
  WHERE id = predecessor_id;

  IF predecessor_reference_id IS NULL THEN
    RETURN NEW;
  END IF;
  IF predecessor_reference_id IS DISTINCT FROM NEW."baselineReferenceId" THEN
    RAISE EXCEPTION 'Baseline reference Version lineage must remain within one Baseline reference identity';
  END IF;
  IF predecessor_formalized_at IS NULL THEN
    RAISE EXCEPTION 'Baseline reference Version lineage predecessor must be formal';
  END IF;

  RETURN NEW;
END;
$baseline_reference_version_lineage_guard$ LANGUAGE plpgsql;

CREATE TRIGGER "BaselineReferenceVersion_lineage_guard"
BEFORE INSERT ON "BaselineReferenceVersion"
FOR EACH ROW EXECUTE FUNCTION "guardBaselineReferenceVersionLineage"();

CREATE FUNCTION "guardBaselineReferenceVersionImmutability"() RETURNS trigger AS $baseline_reference_version_guard$
BEGIN
  IF TG_OP = 'DELETE' THEN
    RAISE EXCEPTION 'Baseline reference Versions are immutable';
  END IF;

  IF OLD."id" IS DISTINCT FROM NEW."id"
    OR OLD."baselineReferenceId" IS DISTINCT FROM NEW."baselineReferenceId"
    OR OLD."versionRef" IS DISTINCT FROM NEW."versionRef"
    OR OLD."targetResourceType" IS DISTINCT FROM NEW."targetResourceType"
    OR OLD."targetResourceId" IS DISTINCT FROM NEW."targetResourceId"
    OR OLD."targetResourceVersion" IS DISTINCT FROM NEW."targetResourceVersion"
    OR OLD."effectiveAsOf" IS DISTINCT FROM NEW."effectiveAsOf"
    OR OLD."reviewStateRef" IS DISTINCT FROM NEW."reviewStateRef"
    OR OLD."finalityStateRef" IS DISTINCT FROM NEW."finalityStateRef"
    OR OLD."selectionProvenance" IS DISTINCT FROM NEW."selectionProvenance"
    OR OLD."provenance" IS DISTINCT FROM NEW."provenance"
    OR OLD."integrityFingerprint" IS DISTINCT FROM NEW."integrityFingerprint"
    OR OLD."supersedesReferenceVersionId" IS DISTINCT FROM NEW."supersedesReferenceVersionId"
    OR OLD."correctionOfReferenceVersionId" IS DISTINCT FROM NEW."correctionOfReferenceVersionId"
    OR OLD."createdAt" IS DISTINCT FROM NEW."createdAt"
    OR OLD."immutableAt" IS DISTINCT FROM NEW."immutableAt"
  THEN
    RAISE EXCEPTION 'Baseline reference Version identity, exact target, provenance, and lineage are immutable';
  END IF;

  IF OLD."formalizedAt" IS NULL AND NEW."formalizedAt" IS NOT NULL THEN
    RETURN NEW;
  END IF;

  RAISE EXCEPTION 'Formal Baseline reference Versions are immutable';
END;
$baseline_reference_version_guard$ LANGUAGE plpgsql;

CREATE TRIGGER "BaselineReferenceVersion_immutability_guard"
BEFORE UPDATE OR DELETE ON "BaselineReferenceVersion"
FOR EACH ROW EXECUTE FUNCTION "guardBaselineReferenceVersionImmutability"();
