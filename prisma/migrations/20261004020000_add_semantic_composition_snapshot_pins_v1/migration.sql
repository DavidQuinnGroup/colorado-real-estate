-- Semantic composition is an immutable companion to OutputVersion and remains separate from evidence and dependency records.
CREATE TABLE "OutputSemanticCompositionSnapshot" (
    "id" TEXT NOT NULL,
    "outputVersionId" TEXT NOT NULL,
    "productDefinitionRef" TEXT NOT NULL,
    "productDefinitionVersionRef" TEXT NOT NULL,
    "snapshotSchemaVersion" TEXT NOT NULL,
    "provenance" JSONB NOT NULL,
    "integrityFingerprint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "formalizedAt" TIMESTAMP(3),
    CONSTRAINT "OutputSemanticCompositionSnapshot_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "OutputSemanticCompositionSnapshot_nonempty_identity" CHECK (
      btrim("productDefinitionRef") <> ''
      AND btrim("productDefinitionVersionRef") <> ''
      AND btrim("snapshotSchemaVersion") <> ''
      AND btrim("integrityFingerprint") <> ''
      AND ("formalizedAt" IS NULL OR "formalizedAt" >= "createdAt")
    )
);

CREATE TABLE "OutputSemanticCompositionMethodVersionPin" (
    "id" TEXT NOT NULL,
    "snapshotId" TEXT NOT NULL,
    "methodVersionId" TEXT NOT NULL,
    "roleRef" TEXT NOT NULL,
    "ordinal" INTEGER NOT NULL,
    "provenance" JSONB NOT NULL,
    "integrityFingerprint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OutputSemanticCompositionMethodVersionPin_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "OutputSemanticCompositionMethodVersionPin_metadata" CHECK (
      btrim("roleRef") <> ''
      AND "ordinal" >= 0
      AND btrim("integrityFingerprint") <> ''
    )
);

CREATE TABLE "OutputSemanticCompositionResultVersionPin" (
    "id" TEXT NOT NULL,
    "snapshotId" TEXT NOT NULL,
    "resultVersionId" TEXT NOT NULL,
    "roleRef" TEXT NOT NULL,
    "ordinal" INTEGER NOT NULL,
    "provenance" JSONB NOT NULL,
    "integrityFingerprint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OutputSemanticCompositionResultVersionPin_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "OutputSemanticCompositionResultVersionPin_metadata" CHECK (
      btrim("roleRef") <> ''
      AND "ordinal" >= 0
      AND btrim("integrityFingerprint") <> ''
    )
);

CREATE UNIQUE INDEX "OutputSemanticCompositionSnapshot_outputVersionId_key"
ON "OutputSemanticCompositionSnapshot"("outputVersionId");

CREATE UNIQUE INDEX "OutputSemanticCompositionSnapshot_integrityFingerprint_key"
ON "OutputSemanticCompositionSnapshot"("integrityFingerprint");

CREATE INDEX "OutputSemanticCompositionSnapshot_productReference_idx"
ON "OutputSemanticCompositionSnapshot"("productDefinitionRef", "productDefinitionVersionRef");

CREATE UNIQUE INDEX "OutputSemanticCompositionMethodVersionPin_integrityFingerprint_key"
ON "OutputSemanticCompositionMethodVersionPin"("integrityFingerprint");

CREATE UNIQUE INDEX "OutputSemanticMethodPin_exact_role_key"
ON "OutputSemanticCompositionMethodVersionPin"("snapshotId", "methodVersionId", "roleRef");

CREATE UNIQUE INDEX "OutputSemanticMethodPin_role_ordinal_key"
ON "OutputSemanticCompositionMethodVersionPin"("snapshotId", "roleRef", "ordinal");

CREATE INDEX "OutputSemanticMethodPin_methodVersion_idx"
ON "OutputSemanticCompositionMethodVersionPin"("methodVersionId");

CREATE UNIQUE INDEX "OutputSemanticCompositionResultVersionPin_integrityFingerprint_key"
ON "OutputSemanticCompositionResultVersionPin"("integrityFingerprint");

CREATE UNIQUE INDEX "OutputSemanticResultPin_exact_role_key"
ON "OutputSemanticCompositionResultVersionPin"("snapshotId", "resultVersionId", "roleRef");

CREATE UNIQUE INDEX "OutputSemanticResultPin_role_ordinal_key"
ON "OutputSemanticCompositionResultVersionPin"("snapshotId", "roleRef", "ordinal");

CREATE INDEX "OutputSemanticResultPin_resultVersion_idx"
ON "OutputSemanticCompositionResultVersionPin"("resultVersionId");

ALTER TABLE "OutputSemanticCompositionSnapshot"
ADD CONSTRAINT "OutputSemanticCompositionSnapshot_outputVersionId_fkey"
FOREIGN KEY ("outputVersionId") REFERENCES "OutputVersion"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "OutputSemanticCompositionSnapshot"
ADD CONSTRAINT "OutputSemanticCompositionSnapshot_productReference_fkey"
FOREIGN KEY ("productDefinitionRef", "productDefinitionVersionRef")
REFERENCES "ProductDefinitionReference"("productDefinitionRef", "productDefinitionVersionRef")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "OutputSemanticCompositionMethodVersionPin"
ADD CONSTRAINT "OutputSemanticMethodPin_snapshot_fkey"
FOREIGN KEY ("snapshotId") REFERENCES "OutputSemanticCompositionSnapshot"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "OutputSemanticCompositionMethodVersionPin"
ADD CONSTRAINT "OutputSemanticMethodPin_methodVersion_fkey"
FOREIGN KEY ("methodVersionId") REFERENCES "CanonicalMethodVersion"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "OutputSemanticCompositionResultVersionPin"
ADD CONSTRAINT "OutputSemanticResultPin_snapshot_fkey"
FOREIGN KEY ("snapshotId") REFERENCES "OutputSemanticCompositionSnapshot"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "OutputSemanticCompositionResultVersionPin"
ADD CONSTRAINT "OutputSemanticResultPin_resultVersion_fkey"
FOREIGN KEY ("resultVersionId") REFERENCES "CanonicalResultVersion"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE FUNCTION "guardOutputSemanticCompositionSnapshotImmutability"() RETURNS trigger AS $semantic_snapshot_guard$
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
    RETURN NEW;
  END IF;

  RAISE EXCEPTION 'Formal Output semantic composition snapshots are immutable';
END;
$semantic_snapshot_guard$ LANGUAGE plpgsql;

CREATE TRIGGER "OutputSemanticCompositionSnapshot_immutability_guard"
BEFORE UPDATE OR DELETE ON "OutputSemanticCompositionSnapshot"
FOR EACH ROW EXECUTE FUNCTION "guardOutputSemanticCompositionSnapshotImmutability"();

CREATE FUNCTION "guardOutputSemanticCompositionMethodPinImmutability"() RETURNS trigger AS $semantic_method_pin_guard$
DECLARE
  snapshot_formalized_at TIMESTAMP(3);
BEGIN
  SELECT "formalizedAt" INTO snapshot_formalized_at
  FROM "OutputSemanticCompositionSnapshot"
  WHERE id = COALESCE(NEW."snapshotId", OLD."snapshotId")
  FOR UPDATE;

  IF TG_OP = 'INSERT' THEN
    IF snapshot_formalized_at IS NOT NULL THEN
      RAISE EXCEPTION 'Formal Output semantic composition does not accept additional MethodVersion pins';
    END IF;
    RETURN NEW;
  END IF;
  IF TG_OP = 'DELETE' AND snapshot_formalized_at IS NULL THEN
    RETURN OLD;
  END IF;
  RAISE EXCEPTION 'Formal Output semantic composition MethodVersion pins are immutable';
END;
$semantic_method_pin_guard$ LANGUAGE plpgsql;

CREATE TRIGGER "OutputSemanticCompositionMethodPin_immutability_guard"
BEFORE INSERT OR UPDATE OR DELETE ON "OutputSemanticCompositionMethodVersionPin"
FOR EACH ROW EXECUTE FUNCTION "guardOutputSemanticCompositionMethodPinImmutability"();

CREATE FUNCTION "guardOutputSemanticCompositionResultPinImmutability"() RETURNS trigger AS $semantic_result_pin_guard$
DECLARE
  snapshot_formalized_at TIMESTAMP(3);
BEGIN
  SELECT "formalizedAt" INTO snapshot_formalized_at
  FROM "OutputSemanticCompositionSnapshot"
  WHERE id = COALESCE(NEW."snapshotId", OLD."snapshotId")
  FOR UPDATE;

  IF TG_OP = 'INSERT' THEN
    IF snapshot_formalized_at IS NOT NULL THEN
      RAISE EXCEPTION 'Formal Output semantic composition does not accept additional ResultVersion pins';
    END IF;
    RETURN NEW;
  END IF;
  IF TG_OP = 'DELETE' AND snapshot_formalized_at IS NULL THEN
    RETURN OLD;
  END IF;
  RAISE EXCEPTION 'Formal Output semantic composition ResultVersion pins are immutable';
END;
$semantic_result_pin_guard$ LANGUAGE plpgsql;

CREATE TRIGGER "OutputSemanticCompositionResultPin_immutability_guard"
BEFORE INSERT OR UPDATE OR DELETE ON "OutputSemanticCompositionResultVersionPin"
FOR EACH ROW EXECUTE FUNCTION "guardOutputSemanticCompositionResultPinImmutability"();
