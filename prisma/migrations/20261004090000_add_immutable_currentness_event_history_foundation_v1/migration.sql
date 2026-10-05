CREATE TABLE "CurrentnessEventTypeReference" (
  "id" TEXT NOT NULL,
  "eventTypeKey" TEXT NOT NULL,
  "authorityRef" TEXT NOT NULL,
  "provenance" JSONB NOT NULL,
  "integrityFingerprint" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "CurrentnessEventTypeReference_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CurrentnessEventTypeReference_exact_identity" CHECK (
    btrim("eventTypeKey") = "eventTypeKey" AND "eventTypeKey" <> ''
    AND lower("eventTypeKey") NOT IN ('latest', 'current')
    AND btrim("authorityRef") = "authorityRef" AND "authorityRef" <> ''
    AND jsonb_typeof("provenance") = 'object' AND "provenance" <> '{}'::jsonb
    AND btrim("integrityFingerprint") = "integrityFingerprint" AND "integrityFingerprint" <> ''
  )
);

CREATE TABLE "CurrentnessEventTypeVersion" (
  "id" TEXT NOT NULL,
  "eventTypeReferenceId" TEXT NOT NULL,
  "versionKey" TEXT NOT NULL,
  "lifecycleState" "MethodResultRegistryLifecycleState" NOT NULL,
  "authorityRef" TEXT NOT NULL,
  "provenance" JSONB NOT NULL,
  "integrityFingerprint" TEXT NOT NULL,
  "effectiveAt" TIMESTAMP(3),
  "admittedAt" TIMESTAMP(3),
  "supersedesEventTypeVersionId" TEXT,
  "correctionOfEventTypeVersionId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "CurrentnessEventTypeVersion_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CurrentnessEventTypeVersion_exact_identity" CHECK (
    btrim("eventTypeReferenceId") = "eventTypeReferenceId" AND "eventTypeReferenceId" <> ''
    AND lower("eventTypeReferenceId") NOT IN ('latest', 'current')
    AND btrim("versionKey") = "versionKey" AND "versionKey" <> ''
    AND lower("versionKey") NOT IN ('latest', 'current')
    AND btrim("authorityRef") = "authorityRef" AND "authorityRef" <> ''
    AND jsonb_typeof("provenance") = 'object' AND "provenance" <> '{}'::jsonb
    AND btrim("integrityFingerprint") = "integrityFingerprint" AND "integrityFingerprint" <> ''
    AND num_nonnulls("supersedesEventTypeVersionId", "correctionOfEventTypeVersionId") <= 1
    AND "supersedesEventTypeVersionId" IS DISTINCT FROM "id"
    AND "correctionOfEventTypeVersionId" IS DISTINCT FROM "id"
  )
);

CREATE TABLE "CurrentnessEvent" (
  "id" TEXT NOT NULL,
  "eventTypeVersionId" TEXT NOT NULL,
  "occurredAt" TIMESTAMP(3),
  "effectiveAt" TIMESTAMP(3),
  "authorityRef" TEXT NOT NULL,
  "provenance" JSONB NOT NULL,
  "integrityFingerprint" TEXT NOT NULL,
  "predecessorEventId" TEXT,
  "correctionOfEventId" TEXT,
  "causalEventId" TEXT,
  "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "CurrentnessEvent_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CurrentnessEvent_exact_envelope" CHECK (
    btrim("eventTypeVersionId") = "eventTypeVersionId" AND "eventTypeVersionId" <> ''
    AND lower("eventTypeVersionId") NOT IN ('latest', 'current')
    AND btrim("authorityRef") = "authorityRef" AND "authorityRef" <> ''
    AND jsonb_typeof("provenance") = 'object' AND "provenance" <> '{}'::jsonb
    AND btrim("integrityFingerprint") = "integrityFingerprint" AND "integrityFingerprint" <> ''
    AND num_nonnulls("predecessorEventId", "correctionOfEventId") <= 1
    AND "predecessorEventId" IS DISTINCT FROM "id"
    AND "correctionOfEventId" IS DISTINCT FROM "id"
    AND "causalEventId" IS DISTINCT FROM "id"
  )
);

CREATE TABLE "CurrentnessEventPrimarySubject" (
  "id" TEXT NOT NULL,
  "eventId" TEXT NOT NULL,
  "methodVersionId" TEXT,
  "resultVersionId" TEXT,
  "baselineReferenceVersionId" TEXT,
  "reportingPeriodVersionId" TEXT,
  "analyticalBasisVersionId" TEXT,
  "compatibilityContextId" TEXT,
  "qualificationApplicationVersionId" TEXT,
  "outputSnapshotId" TEXT,
  "outputEvidenceSnapshotId" TEXT,
  "evidenceAdmissionId" TEXT,
  "productDefinitionReferenceId" TEXT,
  "provenance" JSONB NOT NULL,
  "integrityFingerprint" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "CurrentnessEventPrimarySubject_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CurrentnessPrimarySubject_exact_one_target" CHECK (
    num_nonnulls(
      "methodVersionId",
      "resultVersionId",
      "baselineReferenceVersionId",
      "reportingPeriodVersionId",
      "analyticalBasisVersionId",
      "compatibilityContextId",
      "qualificationApplicationVersionId",
      "outputSnapshotId",
      "outputEvidenceSnapshotId",
      "evidenceAdmissionId",
      "productDefinitionReferenceId"
    ) = 1
  ),
  CONSTRAINT "CurrentnessPrimarySubject_exact_metadata" CHECK (
    btrim("eventId") = "eventId" AND "eventId" <> ''
    AND lower("eventId") NOT IN ('latest', 'current')
    AND jsonb_typeof("provenance") = 'object' AND "provenance" <> '{}'::jsonb
    AND btrim("integrityFingerprint") = "integrityFingerprint" AND "integrityFingerprint" <> ''
    AND ("methodVersionId" IS NULL OR lower("methodVersionId") NOT IN ('latest', 'current'))
    AND ("resultVersionId" IS NULL OR lower("resultVersionId") NOT IN ('latest', 'current'))
    AND ("baselineReferenceVersionId" IS NULL OR lower("baselineReferenceVersionId") NOT IN ('latest', 'current'))
    AND ("reportingPeriodVersionId" IS NULL OR lower("reportingPeriodVersionId") NOT IN ('latest', 'current'))
    AND ("analyticalBasisVersionId" IS NULL OR lower("analyticalBasisVersionId") NOT IN ('latest', 'current'))
    AND ("compatibilityContextId" IS NULL OR lower("compatibilityContextId") NOT IN ('latest', 'current'))
    AND ("qualificationApplicationVersionId" IS NULL OR lower("qualificationApplicationVersionId") NOT IN ('latest', 'current'))
    AND ("outputSnapshotId" IS NULL OR lower("outputSnapshotId") NOT IN ('latest', 'current'))
    AND ("outputEvidenceSnapshotId" IS NULL OR lower("outputEvidenceSnapshotId") NOT IN ('latest', 'current'))
    AND ("evidenceAdmissionId" IS NULL OR lower("evidenceAdmissionId") NOT IN ('latest', 'current'))
    AND ("productDefinitionReferenceId" IS NULL OR lower("productDefinitionReferenceId") NOT IN ('latest', 'current'))
  )
);

CREATE TABLE "CurrentnessEventDependency" (
  "id" TEXT NOT NULL,
  "eventId" TEXT NOT NULL,
  "roleRef" TEXT NOT NULL,
  "ordinal" INTEGER NOT NULL,
  "methodVersionId" TEXT,
  "resultVersionId" TEXT,
  "baselineReferenceVersionId" TEXT,
  "reportingPeriodVersionId" TEXT,
  "analyticalBasisVersionId" TEXT,
  "compatibilityContextId" TEXT,
  "qualificationApplicationVersionId" TEXT,
  "outputSnapshotId" TEXT,
  "outputEvidenceSnapshotId" TEXT,
  "evidenceAdmissionId" TEXT,
  "productDefinitionReferenceId" TEXT,
  "provenance" JSONB NOT NULL,
  "integrityFingerprint" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "CurrentnessEventDependency_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CurrentnessDependency_exact_one_target" CHECK (
    num_nonnulls(
      "methodVersionId",
      "resultVersionId",
      "baselineReferenceVersionId",
      "reportingPeriodVersionId",
      "analyticalBasisVersionId",
      "compatibilityContextId",
      "qualificationApplicationVersionId",
      "outputSnapshotId",
      "outputEvidenceSnapshotId",
      "evidenceAdmissionId",
      "productDefinitionReferenceId"
    ) = 1
  ),
  CONSTRAINT "CurrentnessDependency_exact_metadata" CHECK (
    btrim("eventId") = "eventId" AND "eventId" <> ''
    AND lower("eventId") NOT IN ('latest', 'current')
    AND btrim("roleRef") = "roleRef" AND "roleRef" <> ''
    AND lower("roleRef") NOT IN ('latest', 'current')
    AND "ordinal" >= 0
    AND jsonb_typeof("provenance") = 'object' AND "provenance" <> '{}'::jsonb
    AND btrim("integrityFingerprint") = "integrityFingerprint" AND "integrityFingerprint" <> ''
    AND ("methodVersionId" IS NULL OR lower("methodVersionId") NOT IN ('latest', 'current'))
    AND ("resultVersionId" IS NULL OR lower("resultVersionId") NOT IN ('latest', 'current'))
    AND ("baselineReferenceVersionId" IS NULL OR lower("baselineReferenceVersionId") NOT IN ('latest', 'current'))
    AND ("reportingPeriodVersionId" IS NULL OR lower("reportingPeriodVersionId") NOT IN ('latest', 'current'))
    AND ("analyticalBasisVersionId" IS NULL OR lower("analyticalBasisVersionId") NOT IN ('latest', 'current'))
    AND ("compatibilityContextId" IS NULL OR lower("compatibilityContextId") NOT IN ('latest', 'current'))
    AND ("qualificationApplicationVersionId" IS NULL OR lower("qualificationApplicationVersionId") NOT IN ('latest', 'current'))
    AND ("outputSnapshotId" IS NULL OR lower("outputSnapshotId") NOT IN ('latest', 'current'))
    AND ("outputEvidenceSnapshotId" IS NULL OR lower("outputEvidenceSnapshotId") NOT IN ('latest', 'current'))
    AND ("evidenceAdmissionId" IS NULL OR lower("evidenceAdmissionId") NOT IN ('latest', 'current'))
    AND ("productDefinitionReferenceId" IS NULL OR lower("productDefinitionReferenceId") NOT IN ('latest', 'current'))
  )
);

CREATE UNIQUE INDEX "CurrentnessEventTypeReference_eventTypeKey_key"
ON "CurrentnessEventTypeReference"("eventTypeKey");
CREATE UNIQUE INDEX "CurrentnessEventTypeReference_fingerprint_key"
ON "CurrentnessEventTypeReference"("integrityFingerprint");

CREATE UNIQUE INDEX "CurrentnessEventTypeVersion_fingerprint_key"
ON "CurrentnessEventTypeVersion"("integrityFingerprint");
CREATE UNIQUE INDEX "CurrentnessEventTypeVersion_reference_version_key"
ON "CurrentnessEventTypeVersion"("eventTypeReferenceId", "versionKey");
CREATE UNIQUE INDEX "CurrentnessEventTypeVersion_supersedes_key"
ON "CurrentnessEventTypeVersion"("supersedesEventTypeVersionId");
CREATE UNIQUE INDEX "CurrentnessEventTypeVersion_correction_key"
ON "CurrentnessEventTypeVersion"("correctionOfEventTypeVersionId");
CREATE INDEX "CurrentnessEventTypeVersion_state_idx"
ON "CurrentnessEventTypeVersion"("lifecycleState", "admittedAt");

CREATE UNIQUE INDEX "CurrentnessEvent_fingerprint_key"
ON "CurrentnessEvent"("integrityFingerprint");
CREATE UNIQUE INDEX "CurrentnessEvent_predecessor_key"
ON "CurrentnessEvent"("predecessorEventId");
CREATE UNIQUE INDEX "CurrentnessEvent_correction_key"
ON "CurrentnessEvent"("correctionOfEventId");
CREATE INDEX "CurrentnessEvent_type_recorded_idx"
ON "CurrentnessEvent"("eventTypeVersionId", "recordedAt");
CREATE INDEX "CurrentnessEvent_effectiveAt_idx"
ON "CurrentnessEvent"("effectiveAt");
CREATE INDEX "CurrentnessEvent_causalEvent_idx"
ON "CurrentnessEvent"("causalEventId");

CREATE UNIQUE INDEX "CurrentnessPrimarySubject_event_key"
ON "CurrentnessEventPrimarySubject"("eventId");
CREATE UNIQUE INDEX "CurrentnessPrimarySubject_fingerprint_key"
ON "CurrentnessEventPrimarySubject"("integrityFingerprint");
CREATE INDEX "CurrentnessPrimarySubject_methodVersion_idx" ON "CurrentnessEventPrimarySubject"("methodVersionId");
CREATE INDEX "CurrentnessPrimarySubject_resultVersion_idx" ON "CurrentnessEventPrimarySubject"("resultVersionId");
CREATE INDEX "CurrentnessPrimarySubject_baselineVersion_idx" ON "CurrentnessEventPrimarySubject"("baselineReferenceVersionId");
CREATE INDEX "CurrentnessPrimarySubject_periodVersion_idx" ON "CurrentnessEventPrimarySubject"("reportingPeriodVersionId");
CREATE INDEX "CurrentnessPrimarySubject_basisVersion_idx" ON "CurrentnessEventPrimarySubject"("analyticalBasisVersionId");
CREATE INDEX "CurrentnessPrimarySubject_compatibility_idx" ON "CurrentnessEventPrimarySubject"("compatibilityContextId");
CREATE INDEX "CurrentnessPrimarySubject_qualification_idx" ON "CurrentnessEventPrimarySubject"("qualificationApplicationVersionId");
CREATE INDEX "CurrentnessPrimarySubject_outputSnapshot_idx" ON "CurrentnessEventPrimarySubject"("outputSnapshotId");
CREATE INDEX "CurrentnessPrimarySubject_outputEvidence_idx" ON "CurrentnessEventPrimarySubject"("outputEvidenceSnapshotId");
CREATE INDEX "CurrentnessPrimarySubject_evidenceAdmission_idx" ON "CurrentnessEventPrimarySubject"("evidenceAdmissionId");
CREATE INDEX "CurrentnessPrimarySubject_productDefinition_idx" ON "CurrentnessEventPrimarySubject"("productDefinitionReferenceId");

CREATE UNIQUE INDEX "CurrentnessDependency_fingerprint_key"
ON "CurrentnessEventDependency"("integrityFingerprint");
CREATE UNIQUE INDEX "CurrentnessDependency_role_ordinal_key"
ON "CurrentnessEventDependency"("eventId", "roleRef", "ordinal");
CREATE UNIQUE INDEX "CurrentnessDependency_method_exact_key"
ON "CurrentnessEventDependency"("eventId", "methodVersionId", "roleRef") WHERE "methodVersionId" IS NOT NULL;
CREATE UNIQUE INDEX "CurrentnessDependency_result_exact_key"
ON "CurrentnessEventDependency"("eventId", "resultVersionId", "roleRef") WHERE "resultVersionId" IS NOT NULL;
CREATE UNIQUE INDEX "CurrentnessDependency_baseline_exact_key"
ON "CurrentnessEventDependency"("eventId", "baselineReferenceVersionId", "roleRef") WHERE "baselineReferenceVersionId" IS NOT NULL;
CREATE UNIQUE INDEX "CurrentnessDependency_period_exact_key"
ON "CurrentnessEventDependency"("eventId", "reportingPeriodVersionId", "roleRef") WHERE "reportingPeriodVersionId" IS NOT NULL;
CREATE UNIQUE INDEX "CurrentnessDependency_basis_exact_key"
ON "CurrentnessEventDependency"("eventId", "analyticalBasisVersionId", "roleRef") WHERE "analyticalBasisVersionId" IS NOT NULL;
CREATE UNIQUE INDEX "CurrentnessDependency_compatibility_exact_key"
ON "CurrentnessEventDependency"("eventId", "compatibilityContextId", "roleRef") WHERE "compatibilityContextId" IS NOT NULL;
CREATE UNIQUE INDEX "CurrentnessDependency_qualification_exact_key"
ON "CurrentnessEventDependency"("eventId", "qualificationApplicationVersionId", "roleRef") WHERE "qualificationApplicationVersionId" IS NOT NULL;
CREATE UNIQUE INDEX "CurrentnessDependency_outputSnapshot_exact_key"
ON "CurrentnessEventDependency"("eventId", "outputSnapshotId", "roleRef") WHERE "outputSnapshotId" IS NOT NULL;
CREATE UNIQUE INDEX "CurrentnessDependency_outputEvidence_exact_key"
ON "CurrentnessEventDependency"("eventId", "outputEvidenceSnapshotId", "roleRef") WHERE "outputEvidenceSnapshotId" IS NOT NULL;
CREATE UNIQUE INDEX "CurrentnessDependency_evidenceAdmission_exact_key"
ON "CurrentnessEventDependency"("eventId", "evidenceAdmissionId", "roleRef") WHERE "evidenceAdmissionId" IS NOT NULL;
CREATE UNIQUE INDEX "CurrentnessDependency_productDefinition_exact_key"
ON "CurrentnessEventDependency"("eventId", "productDefinitionReferenceId", "roleRef") WHERE "productDefinitionReferenceId" IS NOT NULL;
CREATE INDEX "CurrentnessDependency_methodVersion_idx" ON "CurrentnessEventDependency"("methodVersionId");
CREATE INDEX "CurrentnessDependency_resultVersion_idx" ON "CurrentnessEventDependency"("resultVersionId");
CREATE INDEX "CurrentnessDependency_baselineVersion_idx" ON "CurrentnessEventDependency"("baselineReferenceVersionId");
CREATE INDEX "CurrentnessDependency_periodVersion_idx" ON "CurrentnessEventDependency"("reportingPeriodVersionId");
CREATE INDEX "CurrentnessDependency_basisVersion_idx" ON "CurrentnessEventDependency"("analyticalBasisVersionId");
CREATE INDEX "CurrentnessDependency_compatibility_idx" ON "CurrentnessEventDependency"("compatibilityContextId");
CREATE INDEX "CurrentnessDependency_qualification_idx" ON "CurrentnessEventDependency"("qualificationApplicationVersionId");
CREATE INDEX "CurrentnessDependency_outputSnapshot_idx" ON "CurrentnessEventDependency"("outputSnapshotId");
CREATE INDEX "CurrentnessDependency_outputEvidence_idx" ON "CurrentnessEventDependency"("outputEvidenceSnapshotId");
CREATE INDEX "CurrentnessDependency_evidenceAdmission_idx" ON "CurrentnessEventDependency"("evidenceAdmissionId");
CREATE INDEX "CurrentnessDependency_productDefinition_idx" ON "CurrentnessEventDependency"("productDefinitionReferenceId");

ALTER TABLE "CurrentnessEventTypeVersion"
ADD CONSTRAINT "CurrentnessEventTypeVersion_reference_fkey"
FOREIGN KEY ("eventTypeReferenceId") REFERENCES "CurrentnessEventTypeReference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessEventTypeVersion"
ADD CONSTRAINT "CurrentnessEventTypeVersion_supersedes_fkey"
FOREIGN KEY ("supersedesEventTypeVersionId") REFERENCES "CurrentnessEventTypeVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessEventTypeVersion"
ADD CONSTRAINT "CurrentnessEventTypeVersion_correction_fkey"
FOREIGN KEY ("correctionOfEventTypeVersionId") REFERENCES "CurrentnessEventTypeVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "CurrentnessEvent"
ADD CONSTRAINT "CurrentnessEvent_eventTypeVersion_fkey"
FOREIGN KEY ("eventTypeVersionId") REFERENCES "CurrentnessEventTypeVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessEvent"
ADD CONSTRAINT "CurrentnessEvent_predecessor_fkey"
FOREIGN KEY ("predecessorEventId") REFERENCES "CurrentnessEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessEvent"
ADD CONSTRAINT "CurrentnessEvent_correction_fkey"
FOREIGN KEY ("correctionOfEventId") REFERENCES "CurrentnessEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessEvent"
ADD CONSTRAINT "CurrentnessEvent_causal_fkey"
FOREIGN KEY ("causalEventId") REFERENCES "CurrentnessEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "CurrentnessEventPrimarySubject"
ADD CONSTRAINT "CurrentnessPrimarySubject_event_fkey"
FOREIGN KEY ("eventId") REFERENCES "CurrentnessEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessEventPrimarySubject" ADD CONSTRAINT "CurrentnessPrimary_methodVersion_fkey" FOREIGN KEY ("methodVersionId") REFERENCES "CanonicalMethodVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessEventPrimarySubject" ADD CONSTRAINT "CurrentnessPrimary_resultVersion_fkey" FOREIGN KEY ("resultVersionId") REFERENCES "CanonicalResultVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessEventPrimarySubject" ADD CONSTRAINT "CurrentnessPrimary_baselineVersion_fkey" FOREIGN KEY ("baselineReferenceVersionId") REFERENCES "BaselineReferenceVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessEventPrimarySubject" ADD CONSTRAINT "CurrentnessPrimary_periodVersion_fkey" FOREIGN KEY ("reportingPeriodVersionId") REFERENCES "ReportingPeriodReferenceVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessEventPrimarySubject" ADD CONSTRAINT "CurrentnessPrimary_basisVersion_fkey" FOREIGN KEY ("analyticalBasisVersionId") REFERENCES "AnalyticalBasisReferenceVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessEventPrimarySubject" ADD CONSTRAINT "CurrentnessPrimary_compatibility_fkey" FOREIGN KEY ("compatibilityContextId") REFERENCES "OutputSemanticCompositionCompatibilityContext"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessEventPrimarySubject" ADD CONSTRAINT "CurrentnessPrimary_qualification_fkey" FOREIGN KEY ("qualificationApplicationVersionId") REFERENCES "QualificationApplicationVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessEventPrimarySubject" ADD CONSTRAINT "CurrentnessPrimary_outputSnapshot_fkey" FOREIGN KEY ("outputSnapshotId") REFERENCES "OutputSemanticCompositionSnapshot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessEventPrimarySubject" ADD CONSTRAINT "CurrentnessPrimary_outputEvidence_fkey" FOREIGN KEY ("outputEvidenceSnapshotId") REFERENCES "OutputEvidenceSnapshot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessEventPrimarySubject" ADD CONSTRAINT "CurrentnessPrimary_evidenceAdmission_fkey" FOREIGN KEY ("evidenceAdmissionId") REFERENCES "EvidenceAdmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessEventPrimarySubject" ADD CONSTRAINT "CurrentnessPrimary_productDefinition_fkey" FOREIGN KEY ("productDefinitionReferenceId") REFERENCES "ProductDefinitionReference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "CurrentnessEventDependency"
ADD CONSTRAINT "CurrentnessDependency_event_fkey"
FOREIGN KEY ("eventId") REFERENCES "CurrentnessEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessEventDependency" ADD CONSTRAINT "CurrentnessDependency_methodVersion_fkey" FOREIGN KEY ("methodVersionId") REFERENCES "CanonicalMethodVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessEventDependency" ADD CONSTRAINT "CurrentnessDependency_resultVersion_fkey" FOREIGN KEY ("resultVersionId") REFERENCES "CanonicalResultVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessEventDependency" ADD CONSTRAINT "CurrentnessDependency_baselineVersion_fkey" FOREIGN KEY ("baselineReferenceVersionId") REFERENCES "BaselineReferenceVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessEventDependency" ADD CONSTRAINT "CurrentnessDependency_periodVersion_fkey" FOREIGN KEY ("reportingPeriodVersionId") REFERENCES "ReportingPeriodReferenceVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessEventDependency" ADD CONSTRAINT "CurrentnessDependency_basisVersion_fkey" FOREIGN KEY ("analyticalBasisVersionId") REFERENCES "AnalyticalBasisReferenceVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessEventDependency" ADD CONSTRAINT "CurrentnessDependency_compatibility_fkey" FOREIGN KEY ("compatibilityContextId") REFERENCES "OutputSemanticCompositionCompatibilityContext"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessEventDependency" ADD CONSTRAINT "CurrentnessDependency_qualification_fkey" FOREIGN KEY ("qualificationApplicationVersionId") REFERENCES "QualificationApplicationVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessEventDependency" ADD CONSTRAINT "CurrentnessDependency_outputSnapshot_fkey" FOREIGN KEY ("outputSnapshotId") REFERENCES "OutputSemanticCompositionSnapshot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessEventDependency" ADD CONSTRAINT "CurrentnessDependency_outputEvidence_fkey" FOREIGN KEY ("outputEvidenceSnapshotId") REFERENCES "OutputEvidenceSnapshot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessEventDependency" ADD CONSTRAINT "CurrentnessDependency_evidenceAdmission_fkey" FOREIGN KEY ("evidenceAdmissionId") REFERENCES "EvidenceAdmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessEventDependency" ADD CONSTRAINT "CurrentnessDependency_productDefinition_fkey" FOREIGN KEY ("productDefinitionReferenceId") REFERENCES "ProductDefinitionReference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE FUNCTION "guardCurrentnessEventTypeVersion"() RETURNS trigger AS $event_type_version_guard$
DECLARE
  target_reference_id TEXT;
BEGIN
  IF NEW."supersedesEventTypeVersionId" IS NOT NULL THEN
    SELECT "eventTypeReferenceId" INTO target_reference_id FROM "CurrentnessEventTypeVersion" WHERE "id" = NEW."supersedesEventTypeVersionId";
    IF target_reference_id IS DISTINCT FROM NEW."eventTypeReferenceId" THEN
      RAISE EXCEPTION 'Currentness Event Type Version supersession must remain within one Event Type Reference';
    END IF;
  END IF;
  IF NEW."correctionOfEventTypeVersionId" IS NOT NULL THEN
    SELECT "eventTypeReferenceId" INTO target_reference_id FROM "CurrentnessEventTypeVersion" WHERE "id" = NEW."correctionOfEventTypeVersionId";
    IF target_reference_id IS DISTINCT FROM NEW."eventTypeReferenceId" THEN
      RAISE EXCEPTION 'Currentness Event Type Version correction must remain within one Event Type Reference';
    END IF;
  END IF;
  RETURN NEW;
END;
$event_type_version_guard$ LANGUAGE plpgsql;

CREATE FUNCTION "guardCurrentnessEventInsert"() RETURNS trigger AS $event_insert_guard$
DECLARE
  type_state TEXT;
  type_admitted_at TIMESTAMP(3);
  lineage_reaches_self BOOLEAN;
BEGIN
  SELECT "lifecycleState"::TEXT, "admittedAt"
  INTO type_state, type_admitted_at
  FROM "CurrentnessEventTypeVersion"
  WHERE "id" = NEW."eventTypeVersionId";

  IF type_state NOT IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS') OR type_admitted_at IS NULL THEN
    RAISE EXCEPTION 'Currentness Event requires an exact admitted Event Type Version';
  END IF;

  WITH RECURSIVE lineage("id", "predecessorEventId", "correctionOfEventId", "causalEventId") AS (
    SELECT "id", "predecessorEventId", "correctionOfEventId", "causalEventId"
    FROM "CurrentnessEvent"
    WHERE "id" IN (NEW."predecessorEventId", NEW."correctionOfEventId", NEW."causalEventId")
    UNION
    SELECT parent."id", parent."predecessorEventId", parent."correctionOfEventId", parent."causalEventId"
    FROM "CurrentnessEvent" parent
    JOIN lineage child ON parent."id" IN (child."predecessorEventId", child."correctionOfEventId", child."causalEventId")
  )
  SELECT EXISTS (SELECT 1 FROM lineage WHERE "id" = NEW."id") INTO lineage_reaches_self;

  IF lineage_reaches_self THEN
    RAISE EXCEPTION 'Currentness Event lineage cannot contain a cycle';
  END IF;
  RETURN NEW;
END;
$event_insert_guard$ LANGUAGE plpgsql;

CREATE FUNCTION "rejectCurrentnessMutation"() RETURNS trigger AS $immutable_guard$
BEGIN
  RAISE EXCEPTION '% records are append-only and immutable', TG_TABLE_NAME;
END;
$immutable_guard$ LANGUAGE plpgsql;

CREATE FUNCTION "ensureCurrentnessEventPrimarySubject"() RETURNS trigger AS $primary_subject_guard$
DECLARE
  target_event_id TEXT;
  subject_count INTEGER;
BEGIN
  IF TG_TABLE_NAME = 'CurrentnessEvent' THEN
    target_event_id := NEW."id";
  ELSE
    target_event_id := NEW."eventId";
  END IF;

  IF EXISTS (SELECT 1 FROM "CurrentnessEvent" WHERE "id" = target_event_id) THEN
    SELECT count(*) INTO subject_count
    FROM "CurrentnessEventPrimarySubject"
    WHERE "eventId" = target_event_id;
    IF subject_count <> 1 THEN
      RAISE EXCEPTION 'Currentness Event requires exactly one strong typed primary subject';
    END IF;
  END IF;
  RETURN NULL;
END;
$primary_subject_guard$ LANGUAGE plpgsql;

CREATE TRIGGER "CurrentnessEventTypeVersion_lineage_guard"
BEFORE INSERT ON "CurrentnessEventTypeVersion"
FOR EACH ROW EXECUTE FUNCTION "guardCurrentnessEventTypeVersion"();

CREATE TRIGGER "CurrentnessEvent_admission_lineage_guard"
BEFORE INSERT ON "CurrentnessEvent"
FOR EACH ROW EXECUTE FUNCTION "guardCurrentnessEventInsert"();

CREATE CONSTRAINT TRIGGER "CurrentnessEvent_primary_subject_required"
AFTER INSERT ON "CurrentnessEvent"
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION "ensureCurrentnessEventPrimarySubject"();

CREATE CONSTRAINT TRIGGER "CurrentnessPrimarySubject_event_required"
AFTER INSERT ON "CurrentnessEventPrimarySubject"
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION "ensureCurrentnessEventPrimarySubject"();

CREATE TRIGGER "CurrentnessEventTypeReference_immutable"
BEFORE UPDATE OR DELETE ON "CurrentnessEventTypeReference"
FOR EACH ROW EXECUTE FUNCTION "rejectCurrentnessMutation"();
CREATE TRIGGER "CurrentnessEventTypeVersion_immutable"
BEFORE UPDATE OR DELETE ON "CurrentnessEventTypeVersion"
FOR EACH ROW EXECUTE FUNCTION "rejectCurrentnessMutation"();
CREATE TRIGGER "CurrentnessEvent_immutable"
BEFORE UPDATE OR DELETE ON "CurrentnessEvent"
FOR EACH ROW EXECUTE FUNCTION "rejectCurrentnessMutation"();
CREATE TRIGGER "CurrentnessEventPrimarySubject_immutable"
BEFORE UPDATE OR DELETE ON "CurrentnessEventPrimarySubject"
FOR EACH ROW EXECUTE FUNCTION "rejectCurrentnessMutation"();
CREATE TRIGGER "CurrentnessEventDependency_immutable"
BEFORE UPDATE OR DELETE ON "CurrentnessEventDependency"
FOR EACH ROW EXECUTE FUNCTION "rejectCurrentnessMutation"();
