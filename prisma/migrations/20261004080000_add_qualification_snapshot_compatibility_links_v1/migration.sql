CREATE TABLE "OutputSemanticCompositionQualificationPin" (
  "id" TEXT NOT NULL,
  "snapshotId" TEXT NOT NULL,
  "qualificationApplicationVersionId" TEXT NOT NULL,
  "roleRef" TEXT NOT NULL,
  "ordinal" INTEGER NOT NULL,
  "provenance" JSONB NOT NULL,
  "integrityFingerprint" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "OutputSemanticCompositionQualificationPin_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "OutputSemanticQualificationPin_exact_metadata" CHECK (
    btrim("snapshotId") = "snapshotId" AND "snapshotId" <> ''
    AND lower("snapshotId") NOT IN ('latest', 'current')
    AND btrim("qualificationApplicationVersionId") = "qualificationApplicationVersionId"
    AND "qualificationApplicationVersionId" <> ''
    AND lower("qualificationApplicationVersionId") NOT IN ('latest', 'current')
    AND btrim("roleRef") = "roleRef" AND "roleRef" <> ''
    AND "ordinal" >= 0
    AND jsonb_typeof("provenance") = 'object' AND "provenance" <> '{}'::jsonb
    AND btrim("integrityFingerprint") = "integrityFingerprint" AND "integrityFingerprint" <> ''
  )
);

CREATE TABLE "OutputSemanticCompatibilityQualificationLink" (
  "id" TEXT NOT NULL,
  "compatibilityContextId" TEXT NOT NULL,
  "qualificationApplicationVersionId" TEXT NOT NULL,
  "roleRef" TEXT NOT NULL,
  "ordinal" INTEGER NOT NULL,
  "provenance" JSONB NOT NULL,
  "integrityFingerprint" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "OutputSemanticCompatibilityQualificationLink_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "OutputSemanticCompatibilityQualification_exact_metadata" CHECK (
    btrim("compatibilityContextId") = "compatibilityContextId" AND "compatibilityContextId" <> ''
    AND lower("compatibilityContextId") NOT IN ('latest', 'current')
    AND btrim("qualificationApplicationVersionId") = "qualificationApplicationVersionId"
    AND "qualificationApplicationVersionId" <> ''
    AND lower("qualificationApplicationVersionId") NOT IN ('latest', 'current')
    AND btrim("roleRef") = "roleRef" AND "roleRef" <> ''
    AND "ordinal" >= 0
    AND jsonb_typeof("provenance") = 'object' AND "provenance" <> '{}'::jsonb
    AND btrim("integrityFingerprint") = "integrityFingerprint" AND "integrityFingerprint" <> ''
  )
);

CREATE UNIQUE INDEX "OutputSemanticQualificationPin_fingerprint_key"
ON "OutputSemanticCompositionQualificationPin"("integrityFingerprint");
CREATE UNIQUE INDEX "OutputSemanticQualificationPin_exact_role_key"
ON "OutputSemanticCompositionQualificationPin"("snapshotId", "qualificationApplicationVersionId", "roleRef");
CREATE UNIQUE INDEX "OutputSemanticQualificationPin_role_ordinal_key"
ON "OutputSemanticCompositionQualificationPin"("snapshotId", "roleRef", "ordinal");
CREATE INDEX "OutputSemanticQualificationPin_applicationVersion_idx"
ON "OutputSemanticCompositionQualificationPin"("qualificationApplicationVersionId");

CREATE UNIQUE INDEX "OutputSemanticCompatibilityQualification_fingerprint_key"
ON "OutputSemanticCompatibilityQualificationLink"("integrityFingerprint");
CREATE UNIQUE INDEX "OutputSemanticCompatibilityQualification_exact_role_key"
ON "OutputSemanticCompatibilityQualificationLink"("compatibilityContextId", "qualificationApplicationVersionId", "roleRef");
CREATE UNIQUE INDEX "OutputSemanticCompatibilityQualification_role_ordinal_key"
ON "OutputSemanticCompatibilityQualificationLink"("compatibilityContextId", "roleRef", "ordinal");
CREATE INDEX "OutputSemanticCompatibilityQualification_application_idx"
ON "OutputSemanticCompatibilityQualificationLink"("qualificationApplicationVersionId");

ALTER TABLE "OutputSemanticCompositionQualificationPin"
ADD CONSTRAINT "OutputSemanticQualificationPin_snapshot_fkey"
FOREIGN KEY ("snapshotId") REFERENCES "OutputSemanticCompositionSnapshot"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "OutputSemanticCompositionQualificationPin"
ADD CONSTRAINT "OutputSemanticQualificationPin_applicationVersion_fkey"
FOREIGN KEY ("qualificationApplicationVersionId") REFERENCES "QualificationApplicationVersion"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "OutputSemanticCompatibilityQualificationLink"
ADD CONSTRAINT "OutputSemanticCompatibilityQualification_context_fkey"
FOREIGN KEY ("compatibilityContextId") REFERENCES "OutputSemanticCompositionCompatibilityContext"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "OutputSemanticCompatibilityQualificationLink"
ADD CONSTRAINT "OutputSemanticCompatibilityQualification_application_fkey"
FOREIGN KEY ("qualificationApplicationVersionId") REFERENCES "QualificationApplicationVersion"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE FUNCTION "guardOutputSemanticQualificationPin"() RETURNS trigger AS $qualification_pin_guard$
DECLARE
  snapshot_formalized_at TIMESTAMP(3);
  application_formalized_at TIMESTAMP(3);
  application_admitted_at TIMESTAMP(3);
BEGIN
  SELECT "formalizedAt" INTO snapshot_formalized_at
  FROM "OutputSemanticCompositionSnapshot"
  WHERE id = COALESCE(NEW."snapshotId", OLD."snapshotId")
  FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Qualification pin requires an existing exact semantic snapshot';
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF snapshot_formalized_at IS NOT NULL THEN
      RAISE EXCEPTION 'Formal Output semantic composition does not accept qualification pins';
    END IF;

    SELECT "formalizedAt", "admittedAt"
    INTO application_formalized_at, application_admitted_at
    FROM "QualificationApplicationVersion"
    WHERE id = NEW."qualificationApplicationVersionId"
    FOR KEY SHARE;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Qualification pin requires an exact existing Application Version';
    END IF;
    IF application_formalized_at IS NULL OR application_admitted_at IS NULL THEN
      RAISE EXCEPTION 'Qualification pin requires a formal admitted Application Version';
    END IF;
    IF EXISTS (
      SELECT 1 FROM "QualificationOutputSnapshotSubject"
      WHERE "applicationVersionId" = NEW."qualificationApplicationVersionId"
        AND "snapshotId" = NEW."snapshotId"
    ) THEN
      RAISE EXCEPTION 'Qualification pin cannot circularly link an Application Version targeting the same snapshot';
    END IF;
    RETURN NEW;
  END IF;

  IF TG_OP = 'DELETE' AND snapshot_formalized_at IS NULL THEN
    RETURN OLD;
  END IF;
  RAISE EXCEPTION 'Formal Output semantic composition qualification pins are immutable';
END;
$qualification_pin_guard$ LANGUAGE plpgsql;

CREATE TRIGGER "OutputSemanticQualificationPin_guard"
BEFORE INSERT OR UPDATE OR DELETE ON "OutputSemanticCompositionQualificationPin"
FOR EACH ROW EXECUTE FUNCTION "guardOutputSemanticQualificationPin"();

CREATE FUNCTION "guardOutputSemanticCompatibilityQualificationLink"() RETURNS trigger AS $compatibility_qualification_guard$
DECLARE
  context_formalized_at TIMESTAMP(3);
  snapshot_formalized_at TIMESTAMP(3);
  application_formalized_at TIMESTAMP(3);
  application_admitted_at TIMESTAMP(3);
BEGIN
  SELECT context."formalizedAt", snapshot."formalizedAt"
  INTO context_formalized_at, snapshot_formalized_at
  FROM "OutputSemanticCompositionCompatibilityContext" context
  JOIN "OutputSemanticCompositionSnapshot" snapshot ON snapshot.id = context."snapshotId"
  WHERE context.id = COALESCE(NEW."compatibilityContextId", OLD."compatibilityContextId")
  FOR UPDATE OF context, snapshot;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Compatibility qualification link requires an existing exact context';
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF context_formalized_at IS NOT NULL OR snapshot_formalized_at IS NOT NULL THEN
      RAISE EXCEPTION 'Formal compatibility context does not accept qualification links';
    END IF;

    SELECT "formalizedAt", "admittedAt"
    INTO application_formalized_at, application_admitted_at
    FROM "QualificationApplicationVersion"
    WHERE id = NEW."qualificationApplicationVersionId"
    FOR KEY SHARE;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Compatibility qualification link requires an exact existing Application Version';
    END IF;
    IF application_formalized_at IS NULL OR application_admitted_at IS NULL THEN
      RAISE EXCEPTION 'Compatibility qualification link requires a formal admitted Application Version';
    END IF;
    IF EXISTS (
      SELECT 1 FROM "QualificationCompatibilityContextSubject"
      WHERE "applicationVersionId" = NEW."qualificationApplicationVersionId"
        AND "compatibilityContextId" = NEW."compatibilityContextId"
    ) THEN
      RAISE EXCEPTION 'Compatibility qualification link cannot circularly link an Application Version targeting the same context';
    END IF;
    RETURN NEW;
  END IF;

  IF TG_OP = 'DELETE' AND context_formalized_at IS NULL AND snapshot_formalized_at IS NULL THEN
    RETURN OLD;
  END IF;
  RAISE EXCEPTION 'Formal compatibility qualification links are immutable';
END;
$compatibility_qualification_guard$ LANGUAGE plpgsql;

CREATE TRIGGER "OutputSemanticCompatibilityQualification_guard"
BEFORE INSERT OR UPDATE OR DELETE ON "OutputSemanticCompatibilityQualificationLink"
FOR EACH ROW EXECUTE FUNCTION "guardOutputSemanticCompatibilityQualificationLink"();
