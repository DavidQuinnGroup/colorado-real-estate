CREATE TABLE "CurrentnessProjectionReference" (
  "id" TEXT NOT NULL,
  "projectionKey" TEXT NOT NULL,
  "policyReferenceId" TEXT NOT NULL,
  "purposeRef" TEXT,
  "authorityRef" TEXT NOT NULL,
  "provenance" JSONB NOT NULL,
  "integrityFingerprint" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "CurrentnessProjectionReference_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CurrentnessProjectionReference_exact_identity" CHECK (
    btrim("projectionKey") = "projectionKey" AND "projectionKey" <> ''
    AND lower("projectionKey") NOT IN ('latest', 'current')
    AND btrim("policyReferenceId") = "policyReferenceId" AND "policyReferenceId" <> ''
    AND lower("policyReferenceId") NOT IN ('latest', 'current')
    AND (
      "purposeRef" IS NULL
      OR (
        btrim("purposeRef") = "purposeRef" AND "purposeRef" <> ''
        AND lower("purposeRef") NOT IN ('latest', 'current')
      )
    )
    AND btrim("authorityRef") = "authorityRef" AND "authorityRef" <> ''
    AND lower("authorityRef") NOT IN ('latest', 'current')
    AND jsonb_typeof("provenance") = 'object' AND "provenance" <> '{}'::jsonb
    AND btrim("integrityFingerprint") = "integrityFingerprint" AND "integrityFingerprint" <> ''
  )
);

CREATE TABLE "CurrentnessProjectionPrimarySubject" (
  "id" TEXT NOT NULL,
  "projectionReferenceId" TEXT NOT NULL,
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

  CONSTRAINT "CurrentnessProjectionPrimarySubject_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CurrentnessProjectionPrimary_exact_one_target" CHECK (
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
  CONSTRAINT "CurrentnessProjectionPrimary_exact_metadata" CHECK (
    btrim("projectionReferenceId") = "projectionReferenceId" AND "projectionReferenceId" <> ''
    AND lower("projectionReferenceId") NOT IN ('latest', 'current')
    AND jsonb_typeof("provenance") = 'object' AND "provenance" <> '{}'::jsonb
    AND btrim("integrityFingerprint") = "integrityFingerprint" AND "integrityFingerprint" <> ''
    AND ("methodVersionId" IS NULL OR (btrim("methodVersionId") = "methodVersionId" AND "methodVersionId" <> '' AND lower("methodVersionId") NOT IN ('latest', 'current')))
    AND ("resultVersionId" IS NULL OR (btrim("resultVersionId") = "resultVersionId" AND "resultVersionId" <> '' AND lower("resultVersionId") NOT IN ('latest', 'current')))
    AND ("baselineReferenceVersionId" IS NULL OR (btrim("baselineReferenceVersionId") = "baselineReferenceVersionId" AND "baselineReferenceVersionId" <> '' AND lower("baselineReferenceVersionId") NOT IN ('latest', 'current')))
    AND ("reportingPeriodVersionId" IS NULL OR (btrim("reportingPeriodVersionId") = "reportingPeriodVersionId" AND "reportingPeriodVersionId" <> '' AND lower("reportingPeriodVersionId") NOT IN ('latest', 'current')))
    AND ("analyticalBasisVersionId" IS NULL OR (btrim("analyticalBasisVersionId") = "analyticalBasisVersionId" AND "analyticalBasisVersionId" <> '' AND lower("analyticalBasisVersionId") NOT IN ('latest', 'current')))
    AND ("compatibilityContextId" IS NULL OR (btrim("compatibilityContextId") = "compatibilityContextId" AND "compatibilityContextId" <> '' AND lower("compatibilityContextId") NOT IN ('latest', 'current')))
    AND ("qualificationApplicationVersionId" IS NULL OR (btrim("qualificationApplicationVersionId") = "qualificationApplicationVersionId" AND "qualificationApplicationVersionId" <> '' AND lower("qualificationApplicationVersionId") NOT IN ('latest', 'current')))
    AND ("outputSnapshotId" IS NULL OR (btrim("outputSnapshotId") = "outputSnapshotId" AND "outputSnapshotId" <> '' AND lower("outputSnapshotId") NOT IN ('latest', 'current')))
    AND ("outputEvidenceSnapshotId" IS NULL OR (btrim("outputEvidenceSnapshotId") = "outputEvidenceSnapshotId" AND "outputEvidenceSnapshotId" <> '' AND lower("outputEvidenceSnapshotId") NOT IN ('latest', 'current')))
    AND ("evidenceAdmissionId" IS NULL OR (btrim("evidenceAdmissionId") = "evidenceAdmissionId" AND "evidenceAdmissionId" <> '' AND lower("evidenceAdmissionId") NOT IN ('latest', 'current')))
    AND ("productDefinitionReferenceId" IS NULL OR (btrim("productDefinitionReferenceId") = "productDefinitionReferenceId" AND "productDefinitionReferenceId" <> '' AND lower("productDefinitionReferenceId") NOT IN ('latest', 'current')))
  )
);

CREATE TABLE "CurrentnessProjectionVersion" (
  "id" TEXT NOT NULL,
  "projectionReferenceId" TEXT NOT NULL,
  "versionKey" TEXT NOT NULL,
  "lifecycleState" "MethodResultRegistryLifecycleState" NOT NULL,
  "policyVersionId" TEXT NOT NULL,
  "projectedStateAuthorityRef" TEXT NOT NULL,
  "projectedStateKey" TEXT NOT NULL,
  "projectedStateVersionRef" TEXT NOT NULL,
  "projectedStateGoverningSourceRef" TEXT,
  "projectedStateIntegrityFingerprint" TEXT NOT NULL,
  "evaluatedAt" TIMESTAMP(3) NOT NULL,
  "evaluationCutoffAt" TIMESTAMP(3),
  "recordedThroughAt" TIMESTAMP(3) NOT NULL,
  "projectedAt" TIMESTAMP(3) NOT NULL,
  "eventManifestCount" INTEGER NOT NULL,
  "eventManifestFingerprint" TEXT NOT NULL,
  "authorityRef" TEXT NOT NULL,
  "provenance" JSONB NOT NULL,
  "integrityFingerprint" TEXT NOT NULL,
  "formalizedAt" TIMESTAMP(3),
  "admittedAt" TIMESTAMP(3),
  "supersedesProjectionVersionId" TEXT,
  "correctionOfProjectionVersionId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "CurrentnessProjectionVersion_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CurrentnessProjectionVersion_exact_identity" CHECK (
    btrim("projectionReferenceId") = "projectionReferenceId" AND "projectionReferenceId" <> ''
    AND lower("projectionReferenceId") NOT IN ('latest', 'current')
    AND btrim("versionKey") = "versionKey" AND "versionKey" <> ''
    AND lower("versionKey") NOT IN ('latest', 'current')
    AND btrim("policyVersionId") = "policyVersionId" AND "policyVersionId" <> ''
    AND lower("policyVersionId") NOT IN ('latest', 'current')
    AND btrim("projectedStateAuthorityRef") = "projectedStateAuthorityRef" AND "projectedStateAuthorityRef" <> ''
    AND lower("projectedStateAuthorityRef") NOT IN ('latest', 'current')
    AND btrim("projectedStateKey") = "projectedStateKey" AND "projectedStateKey" <> ''
    AND lower("projectedStateKey") NOT IN ('latest', 'current')
    AND btrim("projectedStateVersionRef") = "projectedStateVersionRef" AND "projectedStateVersionRef" <> ''
    AND lower("projectedStateVersionRef") NOT IN ('latest', 'current')
    AND (
      "projectedStateGoverningSourceRef" IS NULL
      OR (
        btrim("projectedStateGoverningSourceRef") = "projectedStateGoverningSourceRef"
        AND "projectedStateGoverningSourceRef" <> ''
        AND lower("projectedStateGoverningSourceRef") NOT IN ('latest', 'current')
      )
    )
    AND btrim("projectedStateIntegrityFingerprint") = "projectedStateIntegrityFingerprint"
    AND "projectedStateIntegrityFingerprint" <> ''
    AND "eventManifestCount" >= 0
    AND btrim("eventManifestFingerprint") = "eventManifestFingerprint" AND "eventManifestFingerprint" <> ''
    AND btrim("authorityRef") = "authorityRef" AND "authorityRef" <> ''
    AND lower("authorityRef") NOT IN ('latest', 'current')
    AND jsonb_typeof("provenance") = 'object' AND "provenance" <> '{}'::jsonb
    AND btrim("integrityFingerprint") = "integrityFingerprint" AND "integrityFingerprint" <> ''
    AND "evaluatedAt" <= "projectedAt"
    AND "recordedThroughAt" <= "projectedAt"
    AND ("evaluationCutoffAt" IS NULL OR "evaluationCutoffAt" <= "evaluatedAt")
    AND num_nonnulls("supersedesProjectionVersionId", "correctionOfProjectionVersionId") <= 1
    AND "supersedesProjectionVersionId" IS DISTINCT FROM "id"
    AND "correctionOfProjectionVersionId" IS DISTINCT FROM "id"
    AND (
      "lifecycleState" NOT IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS')
      OR ("formalizedAt" IS NOT NULL AND "admittedAt" IS NOT NULL)
    )
  )
);

CREATE TABLE "CurrentnessProjectionDependency" (
  "id" TEXT NOT NULL,
  "projectionVersionId" TEXT NOT NULL,
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

  CONSTRAINT "CurrentnessProjectionDependency_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CurrentnessProjectionDependency_exact_one_target" CHECK (
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
  CONSTRAINT "CurrentnessProjectionDependency_exact_metadata" CHECK (
    btrim("projectionVersionId") = "projectionVersionId" AND "projectionVersionId" <> ''
    AND lower("projectionVersionId") NOT IN ('latest', 'current')
    AND btrim("roleRef") = "roleRef" AND "roleRef" <> ''
    AND lower("roleRef") NOT IN ('latest', 'current')
    AND "ordinal" >= 0
    AND jsonb_typeof("provenance") = 'object' AND "provenance" <> '{}'::jsonb
    AND btrim("integrityFingerprint") = "integrityFingerprint" AND "integrityFingerprint" <> ''
    AND ("methodVersionId" IS NULL OR (btrim("methodVersionId") = "methodVersionId" AND "methodVersionId" <> '' AND lower("methodVersionId") NOT IN ('latest', 'current')))
    AND ("resultVersionId" IS NULL OR (btrim("resultVersionId") = "resultVersionId" AND "resultVersionId" <> '' AND lower("resultVersionId") NOT IN ('latest', 'current')))
    AND ("baselineReferenceVersionId" IS NULL OR (btrim("baselineReferenceVersionId") = "baselineReferenceVersionId" AND "baselineReferenceVersionId" <> '' AND lower("baselineReferenceVersionId") NOT IN ('latest', 'current')))
    AND ("reportingPeriodVersionId" IS NULL OR (btrim("reportingPeriodVersionId") = "reportingPeriodVersionId" AND "reportingPeriodVersionId" <> '' AND lower("reportingPeriodVersionId") NOT IN ('latest', 'current')))
    AND ("analyticalBasisVersionId" IS NULL OR (btrim("analyticalBasisVersionId") = "analyticalBasisVersionId" AND "analyticalBasisVersionId" <> '' AND lower("analyticalBasisVersionId") NOT IN ('latest', 'current')))
    AND ("compatibilityContextId" IS NULL OR (btrim("compatibilityContextId") = "compatibilityContextId" AND "compatibilityContextId" <> '' AND lower("compatibilityContextId") NOT IN ('latest', 'current')))
    AND ("qualificationApplicationVersionId" IS NULL OR (btrim("qualificationApplicationVersionId") = "qualificationApplicationVersionId" AND "qualificationApplicationVersionId" <> '' AND lower("qualificationApplicationVersionId") NOT IN ('latest', 'current')))
    AND ("outputSnapshotId" IS NULL OR (btrim("outputSnapshotId") = "outputSnapshotId" AND "outputSnapshotId" <> '' AND lower("outputSnapshotId") NOT IN ('latest', 'current')))
    AND ("outputEvidenceSnapshotId" IS NULL OR (btrim("outputEvidenceSnapshotId") = "outputEvidenceSnapshotId" AND "outputEvidenceSnapshotId" <> '' AND lower("outputEvidenceSnapshotId") NOT IN ('latest', 'current')))
    AND ("evidenceAdmissionId" IS NULL OR (btrim("evidenceAdmissionId") = "evidenceAdmissionId" AND "evidenceAdmissionId" <> '' AND lower("evidenceAdmissionId") NOT IN ('latest', 'current')))
    AND ("productDefinitionReferenceId" IS NULL OR (btrim("productDefinitionReferenceId") = "productDefinitionReferenceId" AND "productDefinitionReferenceId" <> '' AND lower("productDefinitionReferenceId") NOT IN ('latest', 'current')))
  )
);

CREATE TABLE "CurrentnessProjectionEventMembership" (
  "id" TEXT NOT NULL,
  "projectionVersionId" TEXT NOT NULL,
  "eventId" TEXT NOT NULL,
  "provenance" JSONB NOT NULL,
  "integrityFingerprint" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "CurrentnessProjectionEventMembership_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CurrentnessProjectionMembership_exact_metadata" CHECK (
    btrim("projectionVersionId") = "projectionVersionId" AND "projectionVersionId" <> ''
    AND lower("projectionVersionId") NOT IN ('latest', 'current')
    AND btrim("eventId") = "eventId" AND "eventId" <> ''
    AND lower("eventId") NOT IN ('latest', 'current')
    AND jsonb_typeof("provenance") = 'object' AND "provenance" <> '{}'::jsonb
    AND btrim("integrityFingerprint") = "integrityFingerprint" AND "integrityFingerprint" <> ''
  )
);

CREATE UNIQUE INDEX "CurrentnessProjectionReference_projectionKey_key"
ON "CurrentnessProjectionReference"("projectionKey");
CREATE UNIQUE INDEX "CurrentnessProjectionReference_fingerprint_key"
ON "CurrentnessProjectionReference"("integrityFingerprint");
CREATE INDEX "CurrentnessProjectionReference_policy_idx"
ON "CurrentnessProjectionReference"("policyReferenceId");
CREATE INDEX "CurrentnessProjectionReference_purpose_idx"
ON "CurrentnessProjectionReference"("purposeRef");

CREATE UNIQUE INDEX "CurrentnessProjectionPrimary_reference_key"
ON "CurrentnessProjectionPrimarySubject"("projectionReferenceId");
CREATE UNIQUE INDEX "CurrentnessProjectionPrimary_fingerprint_key"
ON "CurrentnessProjectionPrimarySubject"("integrityFingerprint");
CREATE INDEX "CurrentnessProjectionPrimary_method_idx" ON "CurrentnessProjectionPrimarySubject"("methodVersionId");
CREATE INDEX "CurrentnessProjectionPrimary_result_idx" ON "CurrentnessProjectionPrimarySubject"("resultVersionId");
CREATE INDEX "CurrentnessProjectionPrimary_baseline_idx" ON "CurrentnessProjectionPrimarySubject"("baselineReferenceVersionId");
CREATE INDEX "CurrentnessProjectionPrimary_period_idx" ON "CurrentnessProjectionPrimarySubject"("reportingPeriodVersionId");
CREATE INDEX "CurrentnessProjectionPrimary_basis_idx" ON "CurrentnessProjectionPrimarySubject"("analyticalBasisVersionId");
CREATE INDEX "CurrentnessProjectionPrimary_compatibility_idx" ON "CurrentnessProjectionPrimarySubject"("compatibilityContextId");
CREATE INDEX "CurrentnessProjectionPrimary_qualification_idx" ON "CurrentnessProjectionPrimarySubject"("qualificationApplicationVersionId");
CREATE INDEX "CurrentnessProjectionPrimary_outputSnapshot_idx" ON "CurrentnessProjectionPrimarySubject"("outputSnapshotId");
CREATE INDEX "CurrentnessProjectionPrimary_outputEvidence_idx" ON "CurrentnessProjectionPrimarySubject"("outputEvidenceSnapshotId");
CREATE INDEX "CurrentnessProjectionPrimary_evidence_idx" ON "CurrentnessProjectionPrimarySubject"("evidenceAdmissionId");
CREATE INDEX "CurrentnessProjectionPrimary_product_idx" ON "CurrentnessProjectionPrimarySubject"("productDefinitionReferenceId");

CREATE UNIQUE INDEX "CurrentnessProjectionVersion_reference_version_key"
ON "CurrentnessProjectionVersion"("projectionReferenceId", "versionKey");
CREATE UNIQUE INDEX "CurrentnessProjectionVersion_fingerprint_key"
ON "CurrentnessProjectionVersion"("integrityFingerprint");
CREATE UNIQUE INDEX "CurrentnessProjectionVersion_supersedes_key"
ON "CurrentnessProjectionVersion"("supersedesProjectionVersionId");
CREATE UNIQUE INDEX "CurrentnessProjectionVersion_correction_key"
ON "CurrentnessProjectionVersion"("correctionOfProjectionVersionId");
CREATE INDEX "CurrentnessProjectionVersion_state_idx"
ON "CurrentnessProjectionVersion"("lifecycleState", "formalizedAt", "admittedAt");
CREATE INDEX "CurrentnessProjectionVersion_policy_idx"
ON "CurrentnessProjectionVersion"("policyVersionId");
CREATE INDEX "CurrentnessProjectionVersion_state_ref_idx"
ON "CurrentnessProjectionVersion"("projectedStateAuthorityRef", "projectedStateKey", "projectedStateVersionRef");
CREATE INDEX "CurrentnessProjectionVersion_temporal_idx"
ON "CurrentnessProjectionVersion"("evaluatedAt", "recordedThroughAt", "projectedAt");

CREATE UNIQUE INDEX "CurrentnessProjectionDependency_role_ordinal_key"
ON "CurrentnessProjectionDependency"("projectionVersionId", "roleRef", "ordinal");
CREATE UNIQUE INDEX "CurrentnessProjectionDependency_fingerprint_key"
ON "CurrentnessProjectionDependency"("integrityFingerprint");
CREATE INDEX "CurrentnessProjectionDependency_method_idx" ON "CurrentnessProjectionDependency"("methodVersionId");
CREATE INDEX "CurrentnessProjectionDependency_result_idx" ON "CurrentnessProjectionDependency"("resultVersionId");
CREATE INDEX "CurrentnessProjectionDependency_baseline_idx" ON "CurrentnessProjectionDependency"("baselineReferenceVersionId");
CREATE INDEX "CurrentnessProjectionDependency_period_idx" ON "CurrentnessProjectionDependency"("reportingPeriodVersionId");
CREATE INDEX "CurrentnessProjectionDependency_basis_idx" ON "CurrentnessProjectionDependency"("analyticalBasisVersionId");
CREATE INDEX "CurrentnessProjectionDependency_compatibility_idx" ON "CurrentnessProjectionDependency"("compatibilityContextId");
CREATE INDEX "CurrentnessProjectionDependency_qualification_idx" ON "CurrentnessProjectionDependency"("qualificationApplicationVersionId");
CREATE INDEX "CurrentnessProjectionDependency_outputSnapshot_idx" ON "CurrentnessProjectionDependency"("outputSnapshotId");
CREATE INDEX "CurrentnessProjectionDependency_outputEvidence_idx" ON "CurrentnessProjectionDependency"("outputEvidenceSnapshotId");
CREATE INDEX "CurrentnessProjectionDependency_evidence_idx" ON "CurrentnessProjectionDependency"("evidenceAdmissionId");
CREATE INDEX "CurrentnessProjectionDependency_product_idx" ON "CurrentnessProjectionDependency"("productDefinitionReferenceId");

CREATE UNIQUE INDEX "CurrentnessProjectionEventMembership_version_event_key"
ON "CurrentnessProjectionEventMembership"("projectionVersionId", "eventId");
CREATE UNIQUE INDEX "CurrentnessProjectionMembership_fingerprint_key"
ON "CurrentnessProjectionEventMembership"("integrityFingerprint");
CREATE INDEX "CurrentnessProjectionEventMembership_event_idx"
ON "CurrentnessProjectionEventMembership"("eventId");

ALTER TABLE "CurrentnessProjectionReference"
ADD CONSTRAINT "CurrentnessProjectionReference_policy_fkey"
FOREIGN KEY ("policyReferenceId") REFERENCES "CurrentnessPolicyReference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "CurrentnessProjectionPrimarySubject"
ADD CONSTRAINT "CurrentnessProjectionPrimary_reference_fkey"
FOREIGN KEY ("projectionReferenceId") REFERENCES "CurrentnessProjectionReference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessProjectionPrimarySubject" ADD CONSTRAINT "CurrentnessProjectionPrimary_method_fkey" FOREIGN KEY ("methodVersionId") REFERENCES "CanonicalMethodVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessProjectionPrimarySubject" ADD CONSTRAINT "CurrentnessProjectionPrimary_result_fkey" FOREIGN KEY ("resultVersionId") REFERENCES "CanonicalResultVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessProjectionPrimarySubject" ADD CONSTRAINT "CurrentnessProjectionPrimary_baseline_fkey" FOREIGN KEY ("baselineReferenceVersionId") REFERENCES "BaselineReferenceVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessProjectionPrimarySubject" ADD CONSTRAINT "CurrentnessProjectionPrimary_period_fkey" FOREIGN KEY ("reportingPeriodVersionId") REFERENCES "ReportingPeriodReferenceVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessProjectionPrimarySubject" ADD CONSTRAINT "CurrentnessProjectionPrimary_basis_fkey" FOREIGN KEY ("analyticalBasisVersionId") REFERENCES "AnalyticalBasisReferenceVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessProjectionPrimarySubject" ADD CONSTRAINT "CurrentnessProjectionPrimary_compatibility_fkey" FOREIGN KEY ("compatibilityContextId") REFERENCES "OutputSemanticCompositionCompatibilityContext"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessProjectionPrimarySubject" ADD CONSTRAINT "CurrentnessProjectionPrimary_qualification_fkey" FOREIGN KEY ("qualificationApplicationVersionId") REFERENCES "QualificationApplicationVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessProjectionPrimarySubject" ADD CONSTRAINT "CurrentnessProjectionPrimary_outputSnapshot_fkey" FOREIGN KEY ("outputSnapshotId") REFERENCES "OutputSemanticCompositionSnapshot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessProjectionPrimarySubject" ADD CONSTRAINT "CurrentnessProjectionPrimary_outputEvidence_fkey" FOREIGN KEY ("outputEvidenceSnapshotId") REFERENCES "OutputEvidenceSnapshot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessProjectionPrimarySubject" ADD CONSTRAINT "CurrentnessProjectionPrimary_evidence_fkey" FOREIGN KEY ("evidenceAdmissionId") REFERENCES "EvidenceAdmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessProjectionPrimarySubject" ADD CONSTRAINT "CurrentnessProjectionPrimary_product_fkey" FOREIGN KEY ("productDefinitionReferenceId") REFERENCES "ProductDefinitionReference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "CurrentnessProjectionVersion"
ADD CONSTRAINT "CurrentnessProjectionVersion_reference_fkey"
FOREIGN KEY ("projectionReferenceId") REFERENCES "CurrentnessProjectionReference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessProjectionVersion"
ADD CONSTRAINT "CurrentnessProjectionVersion_policy_fkey"
FOREIGN KEY ("policyVersionId") REFERENCES "CurrentnessPolicyVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessProjectionVersion"
ADD CONSTRAINT "CurrentnessProjectionVersion_supersedes_fkey"
FOREIGN KEY ("supersedesProjectionVersionId") REFERENCES "CurrentnessProjectionVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessProjectionVersion"
ADD CONSTRAINT "CurrentnessProjectionVersion_correction_fkey"
FOREIGN KEY ("correctionOfProjectionVersionId") REFERENCES "CurrentnessProjectionVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "CurrentnessProjectionDependency"
ADD CONSTRAINT "CurrentnessProjectionDependency_version_fkey"
FOREIGN KEY ("projectionVersionId") REFERENCES "CurrentnessProjectionVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessProjectionDependency" ADD CONSTRAINT "CurrentnessProjectionDependency_method_fkey" FOREIGN KEY ("methodVersionId") REFERENCES "CanonicalMethodVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessProjectionDependency" ADD CONSTRAINT "CurrentnessProjectionDependency_result_fkey" FOREIGN KEY ("resultVersionId") REFERENCES "CanonicalResultVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessProjectionDependency" ADD CONSTRAINT "CurrentnessProjectionDependency_baseline_fkey" FOREIGN KEY ("baselineReferenceVersionId") REFERENCES "BaselineReferenceVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessProjectionDependency" ADD CONSTRAINT "CurrentnessProjectionDependency_period_fkey" FOREIGN KEY ("reportingPeriodVersionId") REFERENCES "ReportingPeriodReferenceVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessProjectionDependency" ADD CONSTRAINT "CurrentnessProjectionDependency_basis_fkey" FOREIGN KEY ("analyticalBasisVersionId") REFERENCES "AnalyticalBasisReferenceVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessProjectionDependency" ADD CONSTRAINT "CurrentnessProjectionDependency_compatibility_fkey" FOREIGN KEY ("compatibilityContextId") REFERENCES "OutputSemanticCompositionCompatibilityContext"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessProjectionDependency" ADD CONSTRAINT "CurrentnessProjectionDependency_qualification_fkey" FOREIGN KEY ("qualificationApplicationVersionId") REFERENCES "QualificationApplicationVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessProjectionDependency" ADD CONSTRAINT "CurrentnessProjectionDependency_outputSnapshot_fkey" FOREIGN KEY ("outputSnapshotId") REFERENCES "OutputSemanticCompositionSnapshot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessProjectionDependency" ADD CONSTRAINT "CurrentnessProjectionDependency_outputEvidence_fkey" FOREIGN KEY ("outputEvidenceSnapshotId") REFERENCES "OutputEvidenceSnapshot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessProjectionDependency" ADD CONSTRAINT "CurrentnessProjectionDependency_evidence_fkey" FOREIGN KEY ("evidenceAdmissionId") REFERENCES "EvidenceAdmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessProjectionDependency" ADD CONSTRAINT "CurrentnessProjectionDependency_product_fkey" FOREIGN KEY ("productDefinitionReferenceId") REFERENCES "ProductDefinitionReference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "CurrentnessProjectionEventMembership"
ADD CONSTRAINT "CurrentnessProjectionEventMembership_version_fkey"
FOREIGN KEY ("projectionVersionId") REFERENCES "CurrentnessProjectionVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CurrentnessProjectionEventMembership"
ADD CONSTRAINT "CurrentnessProjectionEventMembership_event_fkey"
FOREIGN KEY ("eventId") REFERENCES "CurrentnessEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE FUNCTION "rejectCurrentnessProjectionImmutableMutation"() RETURNS trigger AS $projection_immutable_guard$
BEGIN
  RAISE EXCEPTION '% records are immutable', TG_TABLE_NAME;
END;
$projection_immutable_guard$ LANGUAGE plpgsql;

CREATE FUNCTION "ensureCurrentnessProjectionPrimarySubject"() RETURNS trigger AS $projection_primary_guard$
DECLARE
  target_reference_id TEXT;
  subject_count INTEGER;
BEGIN
  IF TG_TABLE_NAME = 'CurrentnessProjectionReference' THEN
    target_reference_id := NEW."id";
  ELSE
    target_reference_id := COALESCE(NEW."projectionReferenceId", OLD."projectionReferenceId");
  END IF;

  IF EXISTS (SELECT 1 FROM "CurrentnessProjectionReference" WHERE "id" = target_reference_id) THEN
    SELECT count(*) INTO subject_count
    FROM "CurrentnessProjectionPrimarySubject"
    WHERE "projectionReferenceId" = target_reference_id;
    IF subject_count <> 1 THEN
      RAISE EXCEPTION 'Currentness Projection Reference requires exactly one strong typed primary subject';
    END IF;
  END IF;
  RETURN NULL;
END;
$projection_primary_guard$ LANGUAGE plpgsql;

CREATE FUNCTION "guardCurrentnessProjectionVersionInsert"() RETURNS trigger AS $projection_version_insert_guard$
DECLARE
  reference_policy_id TEXT;
  version_policy_reference_id TEXT;
  lineage_reference_id TEXT;
  lineage_reaches_self BOOLEAN;
BEGIN
  IF NEW."lifecycleState" <> 'CANDIDATE' OR NEW."formalizedAt" IS NOT NULL OR NEW."admittedAt" IS NOT NULL THEN
    RAISE EXCEPTION 'Currentness Projection Version must begin as a non-formalized candidate';
  END IF;

  SELECT "policyReferenceId" INTO reference_policy_id
  FROM "CurrentnessProjectionReference"
  WHERE "id" = NEW."projectionReferenceId";
  SELECT "policyReferenceId" INTO version_policy_reference_id
  FROM "CurrentnessPolicyVersion"
  WHERE "id" = NEW."policyVersionId";
  IF reference_policy_id IS DISTINCT FROM version_policy_reference_id THEN
    RAISE EXCEPTION 'Currentness Projection Policy Version must belong to the Projection Reference Policy Reference';
  END IF;

  IF NEW."supersedesProjectionVersionId" IS NOT NULL THEN
    SELECT "projectionReferenceId" INTO lineage_reference_id
    FROM "CurrentnessProjectionVersion"
    WHERE "id" = NEW."supersedesProjectionVersionId";
    IF lineage_reference_id IS DISTINCT FROM NEW."projectionReferenceId" THEN
      RAISE EXCEPTION 'Currentness Projection Version supersession must remain within one Projection Reference';
    END IF;
  END IF;

  IF NEW."correctionOfProjectionVersionId" IS NOT NULL THEN
    SELECT "projectionReferenceId" INTO lineage_reference_id
    FROM "CurrentnessProjectionVersion"
    WHERE "id" = NEW."correctionOfProjectionVersionId";
    IF lineage_reference_id IS DISTINCT FROM NEW."projectionReferenceId" THEN
      RAISE EXCEPTION 'Currentness Projection Version correction must remain within one Projection Reference';
    END IF;
  END IF;

  WITH RECURSIVE lineage("id", "supersedesProjectionVersionId", "correctionOfProjectionVersionId") AS (
    SELECT "id", "supersedesProjectionVersionId", "correctionOfProjectionVersionId"
    FROM "CurrentnessProjectionVersion"
    WHERE "id" IN (NEW."supersedesProjectionVersionId", NEW."correctionOfProjectionVersionId")
    UNION
    SELECT parent."id", parent."supersedesProjectionVersionId", parent."correctionOfProjectionVersionId"
    FROM "CurrentnessProjectionVersion" parent
    JOIN lineage child
      ON parent."id" IN (child."supersedesProjectionVersionId", child."correctionOfProjectionVersionId")
  )
  SELECT EXISTS (SELECT 1 FROM lineage WHERE "id" = NEW."id") INTO lineage_reaches_self;
  IF lineage_reaches_self THEN
    RAISE EXCEPTION 'Currentness Projection Version lineage cannot contain a cycle';
  END IF;

  RETURN NEW;
END;
$projection_version_insert_guard$ LANGUAGE plpgsql;

CREATE FUNCTION "guardCurrentnessProjectionVersionMutation"() RETURNS trigger AS $projection_version_mutation_guard$
DECLARE
  policy_state TEXT;
  policy_formalized_at TIMESTAMP(3);
  policy_admitted_at TIMESTAMP(3);
  reference_policy_id TEXT;
  version_policy_reference_id TEXT;
  membership_count INTEGER;
BEGIN
  IF TG_OP = 'DELETE' THEN
    RAISE EXCEPTION 'Currentness Projection Versions are append-only and cannot be deleted';
  END IF;

  IF OLD."formalizedAt" IS NOT NULL THEN
    RAISE EXCEPTION 'Formal Currentness Projection Versions are immutable';
  END IF;

  IF OLD."lifecycleState" <> 'CANDIDATE'
    OR NEW."lifecycleState" NOT IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS')
    OR NEW."formalizedAt" IS NULL
    OR NEW."admittedAt" IS NULL
  THEN
    RAISE EXCEPTION 'Currentness Projection Version permits only one-way candidate to formal/admitted finalization';
  END IF;

  IF OLD."id" IS DISTINCT FROM NEW."id"
    OR OLD."projectionReferenceId" IS DISTINCT FROM NEW."projectionReferenceId"
    OR OLD."versionKey" IS DISTINCT FROM NEW."versionKey"
    OR OLD."policyVersionId" IS DISTINCT FROM NEW."policyVersionId"
    OR OLD."projectedStateAuthorityRef" IS DISTINCT FROM NEW."projectedStateAuthorityRef"
    OR OLD."projectedStateKey" IS DISTINCT FROM NEW."projectedStateKey"
    OR OLD."projectedStateVersionRef" IS DISTINCT FROM NEW."projectedStateVersionRef"
    OR OLD."projectedStateGoverningSourceRef" IS DISTINCT FROM NEW."projectedStateGoverningSourceRef"
    OR OLD."projectedStateIntegrityFingerprint" IS DISTINCT FROM NEW."projectedStateIntegrityFingerprint"
    OR OLD."evaluatedAt" IS DISTINCT FROM NEW."evaluatedAt"
    OR OLD."evaluationCutoffAt" IS DISTINCT FROM NEW."evaluationCutoffAt"
    OR OLD."recordedThroughAt" IS DISTINCT FROM NEW."recordedThroughAt"
    OR OLD."projectedAt" IS DISTINCT FROM NEW."projectedAt"
    OR OLD."eventManifestCount" IS DISTINCT FROM NEW."eventManifestCount"
    OR OLD."eventManifestFingerprint" IS DISTINCT FROM NEW."eventManifestFingerprint"
    OR OLD."authorityRef" IS DISTINCT FROM NEW."authorityRef"
    OR OLD."provenance" IS DISTINCT FROM NEW."provenance"
    OR OLD."integrityFingerprint" IS DISTINCT FROM NEW."integrityFingerprint"
    OR OLD."supersedesProjectionVersionId" IS DISTINCT FROM NEW."supersedesProjectionVersionId"
    OR OLD."correctionOfProjectionVersionId" IS DISTINCT FROM NEW."correctionOfProjectionVersionId"
    OR OLD."createdAt" IS DISTINCT FROM NEW."createdAt"
    OR OLD."immutableAt" IS DISTINCT FROM NEW."immutableAt"
  THEN
    RAISE EXCEPTION 'Currentness Projection Version identity, semantics, manifest, lineage, provenance, and fingerprints are immutable during finalization';
  END IF;

  SELECT "lifecycleState"::TEXT, "formalizedAt", "admittedAt", "policyReferenceId"
  INTO policy_state, policy_formalized_at, policy_admitted_at, version_policy_reference_id
  FROM "CurrentnessPolicyVersion"
  WHERE "id" = NEW."policyVersionId";

  SELECT "policyReferenceId" INTO reference_policy_id
  FROM "CurrentnessProjectionReference"
  WHERE "id" = NEW."projectionReferenceId";

  IF policy_state NOT IN ('ADMITTED', 'ADMITTED_WITH_QUALIFICATIONS')
    OR policy_formalized_at IS NULL
    OR policy_admitted_at IS NULL
  THEN
    RAISE EXCEPTION 'Formal Currentness Projection Version requires an exact admitted Policy Version';
  END IF;
  IF reference_policy_id IS DISTINCT FROM version_policy_reference_id THEN
    RAISE EXCEPTION 'Formal Currentness Projection Policy Version must belong to the Projection Reference Policy Reference';
  END IF;

  SELECT count(*) INTO membership_count
  FROM "CurrentnessProjectionEventMembership"
  WHERE "projectionVersionId" = NEW."id";
  IF membership_count <> NEW."eventManifestCount" THEN
    RAISE EXCEPTION 'Currentness Projection event manifest count must equal explicit membership count';
  END IF;

  RETURN NEW;
END;
$projection_version_mutation_guard$ LANGUAGE plpgsql;

CREATE FUNCTION "guardCurrentnessProjectionDependency"() RETURNS trigger AS $projection_dependency_guard$
DECLARE
  parent_formalized_at TIMESTAMP(3);
  duplicate_exists BOOLEAN;
BEGIN
  SELECT "formalizedAt" INTO parent_formalized_at
  FROM "CurrentnessProjectionVersion"
  WHERE "id" = COALESCE(NEW."projectionVersionId", OLD."projectionVersionId")
  FOR UPDATE;

  IF TG_OP = 'UPDATE' THEN
    RAISE EXCEPTION 'Currentness Projection Dependencies are immutable';
  END IF;
  IF parent_formalized_at IS NOT NULL THEN
    RAISE EXCEPTION 'Formal Currentness Projection Versions do not permit dependency mutation';
  END IF;
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM "CurrentnessProjectionDependency" existing
    WHERE existing."projectionVersionId" = NEW."projectionVersionId"
      AND existing."roleRef" = NEW."roleRef"
      AND (
        (NEW."methodVersionId" IS NOT NULL AND existing."methodVersionId" = NEW."methodVersionId")
        OR (NEW."resultVersionId" IS NOT NULL AND existing."resultVersionId" = NEW."resultVersionId")
        OR (NEW."baselineReferenceVersionId" IS NOT NULL AND existing."baselineReferenceVersionId" = NEW."baselineReferenceVersionId")
        OR (NEW."reportingPeriodVersionId" IS NOT NULL AND existing."reportingPeriodVersionId" = NEW."reportingPeriodVersionId")
        OR (NEW."analyticalBasisVersionId" IS NOT NULL AND existing."analyticalBasisVersionId" = NEW."analyticalBasisVersionId")
        OR (NEW."compatibilityContextId" IS NOT NULL AND existing."compatibilityContextId" = NEW."compatibilityContextId")
        OR (NEW."qualificationApplicationVersionId" IS NOT NULL AND existing."qualificationApplicationVersionId" = NEW."qualificationApplicationVersionId")
        OR (NEW."outputSnapshotId" IS NOT NULL AND existing."outputSnapshotId" = NEW."outputSnapshotId")
        OR (NEW."outputEvidenceSnapshotId" IS NOT NULL AND existing."outputEvidenceSnapshotId" = NEW."outputEvidenceSnapshotId")
        OR (NEW."evidenceAdmissionId" IS NOT NULL AND existing."evidenceAdmissionId" = NEW."evidenceAdmissionId")
        OR (NEW."productDefinitionReferenceId" IS NOT NULL AND existing."productDefinitionReferenceId" = NEW."productDefinitionReferenceId")
      )
  ) INTO duplicate_exists;
  IF duplicate_exists THEN
    RAISE EXCEPTION 'Currentness Projection Dependency duplicates role and exact target membership';
  END IF;
  RETURN NEW;
END;
$projection_dependency_guard$ LANGUAGE plpgsql;

CREATE FUNCTION "guardCurrentnessProjectionEventMembership"() RETURNS trigger AS $projection_membership_guard$
DECLARE
  parent_formalized_at TIMESTAMP(3);
BEGIN
  SELECT "formalizedAt" INTO parent_formalized_at
  FROM "CurrentnessProjectionVersion"
  WHERE "id" = COALESCE(NEW."projectionVersionId", OLD."projectionVersionId")
  FOR UPDATE;

  IF TG_OP = 'UPDATE' THEN
    RAISE EXCEPTION 'Currentness Projection Event Membership is immutable';
  END IF;
  IF parent_formalized_at IS NOT NULL THEN
    RAISE EXCEPTION 'Formal Currentness Projection Versions do not permit event-membership mutation';
  END IF;
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$projection_membership_guard$ LANGUAGE plpgsql;

CREATE CONSTRAINT TRIGGER "CurrentnessProjectionReference_primary_required"
AFTER INSERT ON "CurrentnessProjectionReference"
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION "ensureCurrentnessProjectionPrimarySubject"();

CREATE CONSTRAINT TRIGGER "CurrentnessProjectionPrimary_reference_required"
AFTER INSERT OR UPDATE OR DELETE ON "CurrentnessProjectionPrimarySubject"
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION "ensureCurrentnessProjectionPrimarySubject"();

CREATE TRIGGER "CurrentnessProjectionReference_immutable"
BEFORE UPDATE OR DELETE ON "CurrentnessProjectionReference"
FOR EACH ROW EXECUTE FUNCTION "rejectCurrentnessProjectionImmutableMutation"();
CREATE TRIGGER "CurrentnessProjectionPrimary_immutable"
BEFORE UPDATE OR DELETE ON "CurrentnessProjectionPrimarySubject"
FOR EACH ROW EXECUTE FUNCTION "rejectCurrentnessProjectionImmutableMutation"();
CREATE TRIGGER "CurrentnessProjectionVersion_insert_guard"
BEFORE INSERT ON "CurrentnessProjectionVersion"
FOR EACH ROW EXECUTE FUNCTION "guardCurrentnessProjectionVersionInsert"();
CREATE TRIGGER "CurrentnessProjectionVersion_mutation_guard"
BEFORE UPDATE OR DELETE ON "CurrentnessProjectionVersion"
FOR EACH ROW EXECUTE FUNCTION "guardCurrentnessProjectionVersionMutation"();
CREATE TRIGGER "CurrentnessProjectionDependency_mutation_guard"
BEFORE INSERT OR UPDATE OR DELETE ON "CurrentnessProjectionDependency"
FOR EACH ROW EXECUTE FUNCTION "guardCurrentnessProjectionDependency"();
CREATE TRIGGER "CurrentnessProjectionMembership_mutation_guard"
BEFORE INSERT OR UPDATE OR DELETE ON "CurrentnessProjectionEventMembership"
FOR EACH ROW EXECUTE FUNCTION "guardCurrentnessProjectionEventMembership"();
