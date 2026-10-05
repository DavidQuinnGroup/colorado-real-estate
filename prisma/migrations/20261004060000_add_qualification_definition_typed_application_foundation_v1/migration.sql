CREATE TYPE "QualificationApplicationScope" AS ENUM (
  'RESULT',
  'METHOD',
  'BASELINE',
  'REPORTING_PERIOD',
  'ANALYTICAL_BASIS',
  'COMPATIBILITY_CONTEXT',
  'OUTPUT_SNAPSHOT',
  'PRODUCT_DEFINITION',
  'EVIDENCE'
);

CREATE TABLE "QualificationDefinition" (
  "id" TEXT NOT NULL,
  "definitionKey" TEXT NOT NULL,
  "authorityRef" TEXT NOT NULL,
  "provenance" JSONB NOT NULL,
  "integrityFingerprint" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "QualificationDefinition_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "QualificationDefinition_exact_identity" CHECK (
    btrim("definitionKey") = "definitionKey" AND "definitionKey" <> ''
    AND btrim("authorityRef") = "authorityRef" AND "authorityRef" <> ''
    AND btrim("integrityFingerprint") = "integrityFingerprint" AND "integrityFingerprint" <> ''
    AND lower("definitionKey") NOT IN ('latest', 'current')
  )
);

CREATE TABLE "QualificationDefinitionVersion" (
  "id" TEXT NOT NULL,
  "qualificationDefinitionId" TEXT NOT NULL,
  "versionKey" TEXT NOT NULL,
  "governedCodeRef" TEXT NOT NULL,
  "categoryPayload" JSONB,
  "authorityRef" TEXT NOT NULL,
  "lifecycleStateRef" TEXT NOT NULL,
  "effectAuthorityRef" TEXT,
  "blocksFormalization" BOOLEAN,
  "blocksDelivery" BOOLEAN,
  "requiresReview" BOOLEAN,
  "requiresDisplay" BOOLEAN,
  "informationalOnly" BOOLEAN,
  "provenance" JSONB NOT NULL,
  "integrityFingerprint" TEXT NOT NULL,
  "formalizedAt" TIMESTAMP(3),
  "admittedAt" TIMESTAMP(3),
  "supersedesDefinitionVersionId" TEXT,
  "correctionOfDefinitionVersionId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "QualificationDefinitionVersion_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "QualificationDefinitionVersion_exact_metadata" CHECK (
    btrim("versionKey") = "versionKey" AND "versionKey" <> ''
    AND btrim("governedCodeRef") = "governedCodeRef" AND "governedCodeRef" <> ''
    AND btrim("authorityRef") = "authorityRef" AND "authorityRef" <> ''
    AND btrim("lifecycleStateRef") = "lifecycleStateRef" AND "lifecycleStateRef" <> ''
    AND btrim("integrityFingerprint") = "integrityFingerprint" AND "integrityFingerprint" <> ''
    AND lower("versionKey") NOT IN ('latest', 'current')
    AND lower("governedCodeRef") NOT IN ('latest', 'current')
    AND ("effectAuthorityRef" IS NULL OR (btrim("effectAuthorityRef") = "effectAuthorityRef" AND "effectAuthorityRef" <> ''))
    AND (("blocksFormalization" IS NULL AND "blocksDelivery" IS NULL AND "requiresReview" IS NULL AND "requiresDisplay" IS NULL AND "informationalOnly" IS NULL) OR "effectAuthorityRef" IS NOT NULL)
    AND ("formalizedAt" IS NULL OR "formalizedAt" >= "createdAt")
    AND ("admittedAt" IS NULL OR ("formalizedAt" IS NOT NULL AND "admittedAt" >= "formalizedAt"))
    AND "supersedesDefinitionVersionId" IS DISTINCT FROM "id"
    AND "correctionOfDefinitionVersionId" IS DISTINCT FROM "id"
    AND NOT ("supersedesDefinitionVersionId" IS NOT NULL AND "correctionOfDefinitionVersionId" IS NOT NULL)
  )
);

CREATE TABLE "QualificationApplication" (
  "id" TEXT NOT NULL,
  "applicationKey" TEXT NOT NULL,
  "qualificationDefinitionId" TEXT NOT NULL,
  "authorityRef" TEXT NOT NULL,
  "provenance" JSONB NOT NULL,
  "integrityFingerprint" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "QualificationApplication_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "QualificationApplication_exact_identity" CHECK (
    btrim("applicationKey") = "applicationKey" AND "applicationKey" <> ''
    AND btrim("authorityRef") = "authorityRef" AND "authorityRef" <> ''
    AND btrim("integrityFingerprint") = "integrityFingerprint" AND "integrityFingerprint" <> ''
    AND lower("applicationKey") NOT IN ('latest', 'current')
  )
);

CREATE TABLE "QualificationApplicationVersion" (
  "id" TEXT NOT NULL,
  "qualificationApplicationId" TEXT NOT NULL,
  "qualificationDefinitionVersionId" TEXT NOT NULL,
  "versionKey" TEXT NOT NULL,
  "scope" "QualificationApplicationScope" NOT NULL,
  "lifecycleStateRef" TEXT NOT NULL,
  "sourceRef" TEXT,
  "reasonRef" TEXT,
  "effectiveAsOf" TIMESTAMP(3),
  "authorityRef" TEXT NOT NULL,
  "effectAuthorityRef" TEXT,
  "blocksFormalization" BOOLEAN,
  "blocksDelivery" BOOLEAN,
  "requiresReview" BOOLEAN,
  "requiresDisplay" BOOLEAN,
  "informationalOnly" BOOLEAN,
  "provenance" JSONB NOT NULL,
  "integrityFingerprint" TEXT NOT NULL,
  "formalizedAt" TIMESTAMP(3),
  "admittedAt" TIMESTAMP(3),
  "supersedesApplicationVersionId" TEXT,
  "correctionOfApplicationVersionId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "QualificationApplicationVersion_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "QualificationApplicationVersion_exact_metadata" CHECK (
    btrim("versionKey") = "versionKey" AND "versionKey" <> ''
    AND btrim("lifecycleStateRef") = "lifecycleStateRef" AND "lifecycleStateRef" <> ''
    AND btrim("authorityRef") = "authorityRef" AND "authorityRef" <> ''
    AND btrim("integrityFingerprint") = "integrityFingerprint" AND "integrityFingerprint" <> ''
    AND lower("versionKey") NOT IN ('latest', 'current')
    AND lower("qualificationDefinitionVersionId") NOT IN ('latest', 'current')
    AND ("sourceRef" IS NULL OR (btrim("sourceRef") = "sourceRef" AND "sourceRef" <> ''))
    AND ("reasonRef" IS NULL OR (btrim("reasonRef") = "reasonRef" AND "reasonRef" <> ''))
    AND ("effectAuthorityRef" IS NULL OR (btrim("effectAuthorityRef") = "effectAuthorityRef" AND "effectAuthorityRef" <> ''))
    AND (("blocksFormalization" IS NULL AND "blocksDelivery" IS NULL AND "requiresReview" IS NULL AND "requiresDisplay" IS NULL AND "informationalOnly" IS NULL) OR "effectAuthorityRef" IS NOT NULL)
    AND ("formalizedAt" IS NULL OR "formalizedAt" >= "createdAt")
    AND ("admittedAt" IS NULL OR ("formalizedAt" IS NOT NULL AND "admittedAt" >= "formalizedAt"))
    AND "supersedesApplicationVersionId" IS DISTINCT FROM "id"
    AND "correctionOfApplicationVersionId" IS DISTINCT FROM "id"
    AND NOT ("supersedesApplicationVersionId" IS NOT NULL AND "correctionOfApplicationVersionId" IS NOT NULL)
  )
);

CREATE UNIQUE INDEX "QualificationDefinition_definitionKey_key" ON "QualificationDefinition"("definitionKey");
CREATE UNIQUE INDEX "QualificationDefinition_fingerprint_key" ON "QualificationDefinition"("integrityFingerprint");
CREATE UNIQUE INDEX "QualificationDefinitionVersion_fingerprint_key" ON "QualificationDefinitionVersion"("integrityFingerprint");
CREATE UNIQUE INDEX "QualificationDefinitionVersion_definition_version_key" ON "QualificationDefinitionVersion"("qualificationDefinitionId", "versionKey");
CREATE UNIQUE INDEX "QualificationDefinitionVersion_supersedes_key" ON "QualificationDefinitionVersion"("supersedesDefinitionVersionId");
CREATE UNIQUE INDEX "QualificationDefinitionVersion_correction_key" ON "QualificationDefinitionVersion"("correctionOfDefinitionVersionId");
CREATE INDEX "QualificationDefinitionVersion_state_idx" ON "QualificationDefinitionVersion"("qualificationDefinitionId", "formalizedAt", "admittedAt");
CREATE UNIQUE INDEX "QualificationApplication_applicationKey_key" ON "QualificationApplication"("applicationKey");
CREATE UNIQUE INDEX "QualificationApplication_fingerprint_key" ON "QualificationApplication"("integrityFingerprint");
CREATE INDEX "QualificationApplication_definition_idx" ON "QualificationApplication"("qualificationDefinitionId");
CREATE UNIQUE INDEX "QualificationApplicationVersion_fingerprint_key" ON "QualificationApplicationVersion"("integrityFingerprint");
CREATE UNIQUE INDEX "QualificationApplicationVersion_application_version_key" ON "QualificationApplicationVersion"("qualificationApplicationId", "versionKey");
CREATE UNIQUE INDEX "QualificationApplicationVersion_supersedes_key" ON "QualificationApplicationVersion"("supersedesApplicationVersionId");
CREATE UNIQUE INDEX "QualificationApplicationVersion_correction_key" ON "QualificationApplicationVersion"("correctionOfApplicationVersionId");
CREATE INDEX "QualificationApplicationVersion_definitionVersion_idx" ON "QualificationApplicationVersion"("qualificationDefinitionVersionId");
CREATE INDEX "QualificationApplicationVersion_scope_state_idx" ON "QualificationApplicationVersion"("scope", "formalizedAt", "admittedAt");

ALTER TABLE "QualificationDefinitionVersion" ADD CONSTRAINT "QualificationDefinitionVersion_definition_fkey" FOREIGN KEY ("qualificationDefinitionId") REFERENCES "QualificationDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "QualificationDefinitionVersion" ADD CONSTRAINT "QualificationDefinitionVersion_supersedes_fkey" FOREIGN KEY ("supersedesDefinitionVersionId") REFERENCES "QualificationDefinitionVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "QualificationDefinitionVersion" ADD CONSTRAINT "QualificationDefinitionVersion_correction_fkey" FOREIGN KEY ("correctionOfDefinitionVersionId") REFERENCES "QualificationDefinitionVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "QualificationApplication" ADD CONSTRAINT "QualificationApplication_definition_fkey" FOREIGN KEY ("qualificationDefinitionId") REFERENCES "QualificationDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "QualificationApplicationVersion" ADD CONSTRAINT "QualificationApplicationVersion_application_fkey" FOREIGN KEY ("qualificationApplicationId") REFERENCES "QualificationApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "QualificationApplicationVersion" ADD CONSTRAINT "QualificationApplicationVersion_definitionVersion_fkey" FOREIGN KEY ("qualificationDefinitionVersionId") REFERENCES "QualificationDefinitionVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "QualificationApplicationVersion" ADD CONSTRAINT "QualificationApplicationVersion_supersedes_fkey" FOREIGN KEY ("supersedesApplicationVersionId") REFERENCES "QualificationApplicationVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "QualificationApplicationVersion" ADD CONSTRAINT "QualificationApplicationVersion_correction_fkey" FOREIGN KEY ("correctionOfApplicationVersionId") REFERENCES "QualificationApplicationVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "QualificationResultVersionSubject" (
  "id" TEXT NOT NULL,
  "applicationVersionId" TEXT NOT NULL,
  "resultVersionId" TEXT NOT NULL,
  "provenance" JSONB NOT NULL,
  "integrityFingerprint" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "QualificationResultVersionSubject_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "QualificationMethodVersionSubject" (
  "id" TEXT NOT NULL,
  "applicationVersionId" TEXT NOT NULL,
  "methodVersionId" TEXT NOT NULL,
  "provenance" JSONB NOT NULL,
  "integrityFingerprint" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "QualificationMethodVersionSubject_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "QualificationBaselineVersionSubject" (
  "id" TEXT NOT NULL,
  "applicationVersionId" TEXT NOT NULL,
  "baselineReferenceVersionId" TEXT NOT NULL,
  "provenance" JSONB NOT NULL,
  "integrityFingerprint" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "QualificationBaselineVersionSubject_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "QualificationReportingPeriodVersionSubject" (
  "id" TEXT NOT NULL,
  "applicationVersionId" TEXT NOT NULL,
  "reportingPeriodReferenceVersionId" TEXT NOT NULL,
  "provenance" JSONB NOT NULL,
  "integrityFingerprint" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "QualificationReportingPeriodVersionSubject_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "QualificationAnalyticalBasisVersionSubject" (
  "id" TEXT NOT NULL,
  "applicationVersionId" TEXT NOT NULL,
  "analyticalBasisReferenceVersionId" TEXT NOT NULL,
  "provenance" JSONB NOT NULL,
  "integrityFingerprint" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "QualificationAnalyticalBasisVersionSubject_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "QualificationCompatibilityContextSubject" (
  "id" TEXT NOT NULL,
  "applicationVersionId" TEXT NOT NULL,
  "compatibilityContextId" TEXT NOT NULL,
  "provenance" JSONB NOT NULL,
  "integrityFingerprint" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "QualificationCompatibilityContextSubject_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "QualificationOutputSnapshotSubject" (
  "id" TEXT NOT NULL,
  "applicationVersionId" TEXT NOT NULL,
  "snapshotId" TEXT NOT NULL,
  "provenance" JSONB NOT NULL,
  "integrityFingerprint" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "QualificationOutputSnapshotSubject_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "QualificationProductDefinitionSubject" (
  "id" TEXT NOT NULL,
  "applicationVersionId" TEXT NOT NULL,
  "productDefinitionReferenceId" TEXT NOT NULL,
  "provenance" JSONB NOT NULL,
  "integrityFingerprint" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "QualificationProductDefinitionSubject_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "QualificationOutputEvidenceSubject" (
  "id" TEXT NOT NULL,
  "applicationVersionId" TEXT NOT NULL,
  "outputEvidenceSnapshotId" TEXT NOT NULL,
  "provenance" JSONB NOT NULL,
  "integrityFingerprint" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "QualificationOutputEvidenceSubject_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "QualificationEvidenceAdmissionSubject" (
  "id" TEXT NOT NULL,
  "applicationVersionId" TEXT NOT NULL,
  "evidenceAdmissionId" TEXT NOT NULL,
  "provenance" JSONB NOT NULL,
  "integrityFingerprint" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "QualificationEvidenceAdmissionSubject_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "QualificationResultSubject_applicationVersion_key" ON "QualificationResultVersionSubject"("applicationVersionId");
CREATE UNIQUE INDEX "QualificationResultSubject_fingerprint_key" ON "QualificationResultVersionSubject"("integrityFingerprint");
CREATE INDEX "QualificationResultSubject_resultVersion_idx" ON "QualificationResultVersionSubject"("resultVersionId");
CREATE UNIQUE INDEX "QualificationMethodSubject_applicationVersion_key" ON "QualificationMethodVersionSubject"("applicationVersionId");
CREATE UNIQUE INDEX "QualificationMethodSubject_fingerprint_key" ON "QualificationMethodVersionSubject"("integrityFingerprint");
CREATE INDEX "QualificationMethodSubject_methodVersion_idx" ON "QualificationMethodVersionSubject"("methodVersionId");
CREATE UNIQUE INDEX "QualificationBaselineSubject_applicationVersion_key" ON "QualificationBaselineVersionSubject"("applicationVersionId");
CREATE UNIQUE INDEX "QualificationBaselineSubject_fingerprint_key" ON "QualificationBaselineVersionSubject"("integrityFingerprint");
CREATE INDEX "QualificationBaselineSubject_baselineVersion_idx" ON "QualificationBaselineVersionSubject"("baselineReferenceVersionId");
CREATE UNIQUE INDEX "QualificationPeriodSubject_applicationVersion_key" ON "QualificationReportingPeriodVersionSubject"("applicationVersionId");
CREATE UNIQUE INDEX "QualificationPeriodSubject_fingerprint_key" ON "QualificationReportingPeriodVersionSubject"("integrityFingerprint");
CREATE INDEX "QualificationPeriodSubject_periodVersion_idx" ON "QualificationReportingPeriodVersionSubject"("reportingPeriodReferenceVersionId");
CREATE UNIQUE INDEX "QualificationBasisSubject_applicationVersion_key" ON "QualificationAnalyticalBasisVersionSubject"("applicationVersionId");
CREATE UNIQUE INDEX "QualificationBasisSubject_fingerprint_key" ON "QualificationAnalyticalBasisVersionSubject"("integrityFingerprint");
CREATE INDEX "QualificationBasisSubject_basisVersion_idx" ON "QualificationAnalyticalBasisVersionSubject"("analyticalBasisReferenceVersionId");
CREATE UNIQUE INDEX "QualificationCompatibilitySubject_applicationVersion_key" ON "QualificationCompatibilityContextSubject"("applicationVersionId");
CREATE UNIQUE INDEX "QualificationCompatibilitySubject_fingerprint_key" ON "QualificationCompatibilityContextSubject"("integrityFingerprint");
CREATE INDEX "QualificationCompatibilitySubject_context_idx" ON "QualificationCompatibilityContextSubject"("compatibilityContextId");
CREATE UNIQUE INDEX "QualificationOutputSnapshotSubject_applicationVersion_key" ON "QualificationOutputSnapshotSubject"("applicationVersionId");
CREATE UNIQUE INDEX "QualificationOutputSnapshotSubject_fingerprint_key" ON "QualificationOutputSnapshotSubject"("integrityFingerprint");
CREATE INDEX "QualificationOutputSnapshotSubject_snapshot_idx" ON "QualificationOutputSnapshotSubject"("snapshotId");
CREATE UNIQUE INDEX "QualificationProductSubject_applicationVersion_key" ON "QualificationProductDefinitionSubject"("applicationVersionId");
CREATE UNIQUE INDEX "QualificationProductSubject_fingerprint_key" ON "QualificationProductDefinitionSubject"("integrityFingerprint");
CREATE INDEX "QualificationProductSubject_productDefinition_idx" ON "QualificationProductDefinitionSubject"("productDefinitionReferenceId");
CREATE UNIQUE INDEX "QualificationOutputEvidenceSubject_applicationVersion_key" ON "QualificationOutputEvidenceSubject"("applicationVersionId");
CREATE UNIQUE INDEX "QualificationOutputEvidenceSubject_fingerprint_key" ON "QualificationOutputEvidenceSubject"("integrityFingerprint");
CREATE INDEX "QualificationOutputEvidenceSubject_snapshot_idx" ON "QualificationOutputEvidenceSubject"("outputEvidenceSnapshotId");
CREATE UNIQUE INDEX "QualificationEvidenceAdmissionSubject_applicationVersion_key" ON "QualificationEvidenceAdmissionSubject"("applicationVersionId");
CREATE UNIQUE INDEX "QualificationEvidenceAdmissionSubject_fingerprint_key" ON "QualificationEvidenceAdmissionSubject"("integrityFingerprint");
CREATE INDEX "QualificationEvidenceAdmissionSubject_admission_idx" ON "QualificationEvidenceAdmissionSubject"("evidenceAdmissionId");

ALTER TABLE "QualificationResultVersionSubject" ADD CONSTRAINT "QualificationResultSubject_exact_metadata" CHECK (btrim("integrityFingerprint") = "integrityFingerprint" AND "integrityFingerprint" <> '' AND lower("resultVersionId") NOT IN ('latest', 'current'));
ALTER TABLE "QualificationMethodVersionSubject" ADD CONSTRAINT "QualificationMethodSubject_exact_metadata" CHECK (btrim("integrityFingerprint") = "integrityFingerprint" AND "integrityFingerprint" <> '' AND lower("methodVersionId") NOT IN ('latest', 'current'));
ALTER TABLE "QualificationBaselineVersionSubject" ADD CONSTRAINT "QualificationBaselineSubject_exact_metadata" CHECK (btrim("integrityFingerprint") = "integrityFingerprint" AND "integrityFingerprint" <> '' AND lower("baselineReferenceVersionId") NOT IN ('latest', 'current'));
ALTER TABLE "QualificationReportingPeriodVersionSubject" ADD CONSTRAINT "QualificationPeriodSubject_exact_metadata" CHECK (btrim("integrityFingerprint") = "integrityFingerprint" AND "integrityFingerprint" <> '' AND lower("reportingPeriodReferenceVersionId") NOT IN ('latest', 'current'));
ALTER TABLE "QualificationAnalyticalBasisVersionSubject" ADD CONSTRAINT "QualificationBasisSubject_exact_metadata" CHECK (btrim("integrityFingerprint") = "integrityFingerprint" AND "integrityFingerprint" <> '' AND lower("analyticalBasisReferenceVersionId") NOT IN ('latest', 'current'));
ALTER TABLE "QualificationCompatibilityContextSubject" ADD CONSTRAINT "QualificationCompatibilitySubject_exact_metadata" CHECK (btrim("integrityFingerprint") = "integrityFingerprint" AND "integrityFingerprint" <> '' AND lower("compatibilityContextId") NOT IN ('latest', 'current'));
ALTER TABLE "QualificationOutputSnapshotSubject" ADD CONSTRAINT "QualificationOutputSnapshotSubject_exact_metadata" CHECK (btrim("integrityFingerprint") = "integrityFingerprint" AND "integrityFingerprint" <> '' AND lower("snapshotId") NOT IN ('latest', 'current'));
ALTER TABLE "QualificationProductDefinitionSubject" ADD CONSTRAINT "QualificationProductSubject_exact_metadata" CHECK (btrim("integrityFingerprint") = "integrityFingerprint" AND "integrityFingerprint" <> '' AND lower("productDefinitionReferenceId") NOT IN ('latest', 'current'));
ALTER TABLE "QualificationOutputEvidenceSubject" ADD CONSTRAINT "QualificationOutputEvidenceSubject_exact_metadata" CHECK (btrim("integrityFingerprint") = "integrityFingerprint" AND "integrityFingerprint" <> '' AND lower("outputEvidenceSnapshotId") NOT IN ('latest', 'current'));
ALTER TABLE "QualificationEvidenceAdmissionSubject" ADD CONSTRAINT "QualificationEvidenceAdmissionSubject_exact_metadata" CHECK (btrim("integrityFingerprint") = "integrityFingerprint" AND "integrityFingerprint" <> '' AND lower("evidenceAdmissionId") NOT IN ('latest', 'current'));

ALTER TABLE "QualificationResultVersionSubject" ADD CONSTRAINT "QualificationResultSubject_applicationVersion_fkey" FOREIGN KEY ("applicationVersionId") REFERENCES "QualificationApplicationVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "QualificationResultVersionSubject" ADD CONSTRAINT "QualificationResultSubject_resultVersion_fkey" FOREIGN KEY ("resultVersionId") REFERENCES "CanonicalResultVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "QualificationMethodVersionSubject" ADD CONSTRAINT "QualificationMethodSubject_applicationVersion_fkey" FOREIGN KEY ("applicationVersionId") REFERENCES "QualificationApplicationVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "QualificationMethodVersionSubject" ADD CONSTRAINT "QualificationMethodSubject_methodVersion_fkey" FOREIGN KEY ("methodVersionId") REFERENCES "CanonicalMethodVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "QualificationBaselineVersionSubject" ADD CONSTRAINT "QualificationBaselineSubject_applicationVersion_fkey" FOREIGN KEY ("applicationVersionId") REFERENCES "QualificationApplicationVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "QualificationBaselineVersionSubject" ADD CONSTRAINT "QualificationBaselineSubject_baselineVersion_fkey" FOREIGN KEY ("baselineReferenceVersionId") REFERENCES "BaselineReferenceVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "QualificationReportingPeriodVersionSubject" ADD CONSTRAINT "QualificationPeriodSubject_applicationVersion_fkey" FOREIGN KEY ("applicationVersionId") REFERENCES "QualificationApplicationVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "QualificationReportingPeriodVersionSubject" ADD CONSTRAINT "QualificationPeriodSubject_periodVersion_fkey" FOREIGN KEY ("reportingPeriodReferenceVersionId") REFERENCES "ReportingPeriodReferenceVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "QualificationAnalyticalBasisVersionSubject" ADD CONSTRAINT "QualificationBasisSubject_applicationVersion_fkey" FOREIGN KEY ("applicationVersionId") REFERENCES "QualificationApplicationVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "QualificationAnalyticalBasisVersionSubject" ADD CONSTRAINT "QualificationBasisSubject_basisVersion_fkey" FOREIGN KEY ("analyticalBasisReferenceVersionId") REFERENCES "AnalyticalBasisReferenceVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "QualificationCompatibilityContextSubject" ADD CONSTRAINT "QualificationCompatibilitySubject_applicationVersion_fkey" FOREIGN KEY ("applicationVersionId") REFERENCES "QualificationApplicationVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "QualificationCompatibilityContextSubject" ADD CONSTRAINT "QualificationCompatibilitySubject_context_fkey" FOREIGN KEY ("compatibilityContextId") REFERENCES "OutputSemanticCompositionCompatibilityContext"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "QualificationOutputSnapshotSubject" ADD CONSTRAINT "QualificationOutputSnapshotSubject_applicationVersion_fkey" FOREIGN KEY ("applicationVersionId") REFERENCES "QualificationApplicationVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "QualificationOutputSnapshotSubject" ADD CONSTRAINT "QualificationOutputSnapshotSubject_snapshot_fkey" FOREIGN KEY ("snapshotId") REFERENCES "OutputSemanticCompositionSnapshot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "QualificationProductDefinitionSubject" ADD CONSTRAINT "QualificationProductSubject_applicationVersion_fkey" FOREIGN KEY ("applicationVersionId") REFERENCES "QualificationApplicationVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "QualificationProductDefinitionSubject" ADD CONSTRAINT "QualificationProductSubject_productDefinition_fkey" FOREIGN KEY ("productDefinitionReferenceId") REFERENCES "ProductDefinitionReference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "QualificationOutputEvidenceSubject" ADD CONSTRAINT "QualificationOutputEvidenceSubject_applicationVersion_fkey" FOREIGN KEY ("applicationVersionId") REFERENCES "QualificationApplicationVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "QualificationOutputEvidenceSubject" ADD CONSTRAINT "QualificationOutputEvidenceSubject_snapshot_fkey" FOREIGN KEY ("outputEvidenceSnapshotId") REFERENCES "OutputEvidenceSnapshot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "QualificationEvidenceAdmissionSubject" ADD CONSTRAINT "QualificationEvidenceAdmissionSubject_applicationVersion_fkey" FOREIGN KEY ("applicationVersionId") REFERENCES "QualificationApplicationVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "QualificationEvidenceAdmissionSubject" ADD CONSTRAINT "QualificationEvidenceAdmissionSubject_admission_fkey" FOREIGN KEY ("evidenceAdmissionId") REFERENCES "EvidenceAdmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE FUNCTION "qualificationApplicationSubjectCount"(application_version_id TEXT) RETURNS INTEGER AS $subject_count$
  SELECT (
    (SELECT count(*) FROM "QualificationResultVersionSubject" WHERE "applicationVersionId" = application_version_id)
    + (SELECT count(*) FROM "QualificationMethodVersionSubject" WHERE "applicationVersionId" = application_version_id)
    + (SELECT count(*) FROM "QualificationBaselineVersionSubject" WHERE "applicationVersionId" = application_version_id)
    + (SELECT count(*) FROM "QualificationReportingPeriodVersionSubject" WHERE "applicationVersionId" = application_version_id)
    + (SELECT count(*) FROM "QualificationAnalyticalBasisVersionSubject" WHERE "applicationVersionId" = application_version_id)
    + (SELECT count(*) FROM "QualificationCompatibilityContextSubject" WHERE "applicationVersionId" = application_version_id)
    + (SELECT count(*) FROM "QualificationOutputSnapshotSubject" WHERE "applicationVersionId" = application_version_id)
    + (SELECT count(*) FROM "QualificationProductDefinitionSubject" WHERE "applicationVersionId" = application_version_id)
    + (SELECT count(*) FROM "QualificationOutputEvidenceSubject" WHERE "applicationVersionId" = application_version_id)
    + (SELECT count(*) FROM "QualificationEvidenceAdmissionSubject" WHERE "applicationVersionId" = application_version_id)
  )::INTEGER;
$subject_count$ LANGUAGE SQL STABLE;

CREATE FUNCTION "guardQualificationStableIdentity"() RETURNS trigger AS $stable_identity_guard$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    RAISE EXCEPTION 'Qualification stable identity is immutable';
  END IF;
  IF TG_OP = 'DELETE' THEN
    RAISE EXCEPTION 'Qualification stable identity cannot be deleted';
  END IF;
  RETURN NEW;
END;
$stable_identity_guard$ LANGUAGE plpgsql;

CREATE TRIGGER "QualificationDefinition_immutability_guard"
BEFORE UPDATE OR DELETE ON "QualificationDefinition"
FOR EACH ROW EXECUTE FUNCTION "guardQualificationStableIdentity"();
CREATE TRIGGER "QualificationApplication_immutability_guard"
BEFORE UPDATE OR DELETE ON "QualificationApplication"
FOR EACH ROW EXECUTE FUNCTION "guardQualificationStableIdentity"();

CREATE FUNCTION "guardQualificationDefinitionVersion"() RETURNS trigger AS $definition_version_guard$
DECLARE
  predecessor_definition_id TEXT;
BEGIN
  IF TG_OP = 'DELETE' THEN
    RAISE EXCEPTION 'Qualification Definition Versions are immutable';
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF OLD."id" IS DISTINCT FROM NEW."id"
      OR OLD."qualificationDefinitionId" IS DISTINCT FROM NEW."qualificationDefinitionId"
      OR OLD."versionKey" IS DISTINCT FROM NEW."versionKey"
      OR OLD."governedCodeRef" IS DISTINCT FROM NEW."governedCodeRef"
      OR OLD."categoryPayload" IS DISTINCT FROM NEW."categoryPayload"
      OR OLD."authorityRef" IS DISTINCT FROM NEW."authorityRef"
      OR OLD."lifecycleStateRef" IS DISTINCT FROM NEW."lifecycleStateRef"
      OR OLD."effectAuthorityRef" IS DISTINCT FROM NEW."effectAuthorityRef"
      OR OLD."blocksFormalization" IS DISTINCT FROM NEW."blocksFormalization"
      OR OLD."blocksDelivery" IS DISTINCT FROM NEW."blocksDelivery"
      OR OLD."requiresReview" IS DISTINCT FROM NEW."requiresReview"
      OR OLD."requiresDisplay" IS DISTINCT FROM NEW."requiresDisplay"
      OR OLD."informationalOnly" IS DISTINCT FROM NEW."informationalOnly"
      OR OLD."provenance" IS DISTINCT FROM NEW."provenance"
      OR OLD."integrityFingerprint" IS DISTINCT FROM NEW."integrityFingerprint"
      OR OLD."supersedesDefinitionVersionId" IS DISTINCT FROM NEW."supersedesDefinitionVersionId"
      OR OLD."correctionOfDefinitionVersionId" IS DISTINCT FROM NEW."correctionOfDefinitionVersionId"
      OR OLD."createdAt" IS DISTINCT FROM NEW."createdAt"
      OR OLD."immutableAt" IS DISTINCT FROM NEW."immutableAt"
    THEN
      RAISE EXCEPTION 'Qualification Definition Version semantic content is immutable';
    END IF;
    IF OLD."formalizedAt" IS NOT NULL AND OLD."formalizedAt" IS DISTINCT FROM NEW."formalizedAt" THEN
      RAISE EXCEPTION 'Formal Qualification Definition Version cannot be changed';
    END IF;
    IF OLD."admittedAt" IS NOT NULL AND OLD."admittedAt" IS DISTINCT FROM NEW."admittedAt" THEN
      RAISE EXCEPTION 'Admitted Qualification Definition Version cannot be changed';
    END IF;
    IF OLD."formalizedAt" IS NULL AND NEW."formalizedAt" IS NULL AND OLD."admittedAt" IS DISTINCT FROM NEW."admittedAt" THEN
      RAISE EXCEPTION 'Qualification Definition Version must be formalized before admission';
    END IF;
  END IF;

  IF NEW."supersedesDefinitionVersionId" = NEW.id OR NEW."correctionOfDefinitionVersionId" = NEW.id THEN
    RAISE EXCEPTION 'Qualification Definition Version cannot reference itself';
  END IF;

  IF NEW."supersedesDefinitionVersionId" IS NOT NULL THEN
    SELECT "qualificationDefinitionId" INTO predecessor_definition_id FROM "QualificationDefinitionVersion" WHERE id = NEW."supersedesDefinitionVersionId";
    IF predecessor_definition_id IS DISTINCT FROM NEW."qualificationDefinitionId" THEN
      RAISE EXCEPTION 'Qualification Definition Version supersession must remain within one Definition';
    END IF;
  END IF;
  IF NEW."correctionOfDefinitionVersionId" IS NOT NULL THEN
    SELECT "qualificationDefinitionId" INTO predecessor_definition_id FROM "QualificationDefinitionVersion" WHERE id = NEW."correctionOfDefinitionVersionId";
    IF predecessor_definition_id IS DISTINCT FROM NEW."qualificationDefinitionId" THEN
      RAISE EXCEPTION 'Qualification Definition Version correction must remain within one Definition';
    END IF;
  END IF;
  RETURN NEW;
END;
$definition_version_guard$ LANGUAGE plpgsql;

CREATE TRIGGER "QualificationDefinitionVersion_guard"
BEFORE INSERT OR UPDATE OR DELETE ON "QualificationDefinitionVersion"
FOR EACH ROW EXECUTE FUNCTION "guardQualificationDefinitionVersion"();

CREATE FUNCTION "guardQualificationApplicationVersion"() RETURNS trigger AS $application_version_guard$
DECLARE
  application_definition_id TEXT;
  version_definition_id TEXT;
  definition_formalized_at TIMESTAMP(3);
  definition_admitted_at TIMESTAMP(3);
  predecessor_application_id TEXT;
  subject_count INTEGER;
BEGIN
  IF TG_OP = 'DELETE' THEN
    RAISE EXCEPTION 'Qualification Application Versions are immutable';
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF OLD."id" IS DISTINCT FROM NEW."id"
      OR OLD."qualificationApplicationId" IS DISTINCT FROM NEW."qualificationApplicationId"
      OR OLD."qualificationDefinitionVersionId" IS DISTINCT FROM NEW."qualificationDefinitionVersionId"
      OR OLD."versionKey" IS DISTINCT FROM NEW."versionKey"
      OR OLD."scope" IS DISTINCT FROM NEW."scope"
      OR OLD."lifecycleStateRef" IS DISTINCT FROM NEW."lifecycleStateRef"
      OR OLD."sourceRef" IS DISTINCT FROM NEW."sourceRef"
      OR OLD."reasonRef" IS DISTINCT FROM NEW."reasonRef"
      OR OLD."effectiveAsOf" IS DISTINCT FROM NEW."effectiveAsOf"
      OR OLD."authorityRef" IS DISTINCT FROM NEW."authorityRef"
      OR OLD."effectAuthorityRef" IS DISTINCT FROM NEW."effectAuthorityRef"
      OR OLD."blocksFormalization" IS DISTINCT FROM NEW."blocksFormalization"
      OR OLD."blocksDelivery" IS DISTINCT FROM NEW."blocksDelivery"
      OR OLD."requiresReview" IS DISTINCT FROM NEW."requiresReview"
      OR OLD."requiresDisplay" IS DISTINCT FROM NEW."requiresDisplay"
      OR OLD."informationalOnly" IS DISTINCT FROM NEW."informationalOnly"
      OR OLD."provenance" IS DISTINCT FROM NEW."provenance"
      OR OLD."integrityFingerprint" IS DISTINCT FROM NEW."integrityFingerprint"
      OR OLD."supersedesApplicationVersionId" IS DISTINCT FROM NEW."supersedesApplicationVersionId"
      OR OLD."correctionOfApplicationVersionId" IS DISTINCT FROM NEW."correctionOfApplicationVersionId"
      OR OLD."createdAt" IS DISTINCT FROM NEW."createdAt"
      OR OLD."immutableAt" IS DISTINCT FROM NEW."immutableAt"
    THEN
      RAISE EXCEPTION 'Qualification Application Version semantic content is immutable';
    END IF;
    IF OLD."formalizedAt" IS NOT NULL AND OLD."formalizedAt" IS DISTINCT FROM NEW."formalizedAt" THEN
      RAISE EXCEPTION 'Formal Qualification Application Version cannot be changed';
    END IF;
    IF OLD."admittedAt" IS NOT NULL AND OLD."admittedAt" IS DISTINCT FROM NEW."admittedAt" THEN
      RAISE EXCEPTION 'Admitted Qualification Application Version cannot be changed';
    END IF;
    IF OLD."formalizedAt" IS NULL AND NEW."formalizedAt" IS NULL AND OLD."admittedAt" IS DISTINCT FROM NEW."admittedAt" THEN
      RAISE EXCEPTION 'Qualification Application Version must be formalized before admission';
    END IF;
  END IF;

  IF NEW."supersedesApplicationVersionId" = NEW.id OR NEW."correctionOfApplicationVersionId" = NEW.id THEN
    RAISE EXCEPTION 'Qualification Application Version cannot reference itself';
  END IF;

  SELECT "qualificationDefinitionId" INTO application_definition_id FROM "QualificationApplication" WHERE id = NEW."qualificationApplicationId" FOR KEY SHARE;
  SELECT "qualificationDefinitionId", "formalizedAt", "admittedAt" INTO version_definition_id, definition_formalized_at, definition_admitted_at FROM "QualificationDefinitionVersion" WHERE id = NEW."qualificationDefinitionVersionId" FOR KEY SHARE;
  IF application_definition_id IS DISTINCT FROM version_definition_id THEN
    RAISE EXCEPTION 'Qualification Application Version requires an exact Definition Version from its Definition';
  END IF;

  IF NEW."supersedesApplicationVersionId" IS NOT NULL THEN
    SELECT "qualificationApplicationId" INTO predecessor_application_id FROM "QualificationApplicationVersion" WHERE id = NEW."supersedesApplicationVersionId";
    IF predecessor_application_id IS DISTINCT FROM NEW."qualificationApplicationId" THEN
      RAISE EXCEPTION 'Qualification Application Version supersession must remain within one Application';
    END IF;
  END IF;
  IF NEW."correctionOfApplicationVersionId" IS NOT NULL THEN
    SELECT "qualificationApplicationId" INTO predecessor_application_id FROM "QualificationApplicationVersion" WHERE id = NEW."correctionOfApplicationVersionId";
    IF predecessor_application_id IS DISTINCT FROM NEW."qualificationApplicationId" THEN
      RAISE EXCEPTION 'Qualification Application Version correction must remain within one Application';
    END IF;
  END IF;

  IF NEW."formalizedAt" IS NOT NULL OR NEW."admittedAt" IS NOT NULL THEN
    SELECT "qualificationApplicationSubjectCount"(NEW.id) INTO subject_count;
    IF subject_count <> 1 THEN
      RAISE EXCEPTION 'Formal or admitted Qualification Application Version requires exactly one typed subject';
    END IF;
    IF definition_formalized_at IS NULL THEN
      RAISE EXCEPTION 'Formal Qualification Application Version requires a formal exact Definition Version';
    END IF;
    IF NEW."admittedAt" IS NOT NULL AND definition_admitted_at IS NULL THEN
      RAISE EXCEPTION 'Admitted Qualification Application Version requires an admitted exact Definition Version';
    END IF;
  END IF;
  RETURN NEW;
END;
$application_version_guard$ LANGUAGE plpgsql;

CREATE TRIGGER "QualificationApplicationVersion_guard"
BEFORE INSERT OR UPDATE OR DELETE ON "QualificationApplicationVersion"
FOR EACH ROW EXECUTE FUNCTION "guardQualificationApplicationVersion"();

CREATE FUNCTION "guardQualificationTypedSubject"() RETURNS trigger AS $typed_subject_guard$
DECLARE
  expected_scope "QualificationApplicationScope";
  application_scope "QualificationApplicationScope";
  application_formalized_at TIMESTAMP(3);
  application_admitted_at TIMESTAMP(3);
  existing_subject_count INTEGER;
BEGIN
  IF TG_OP = 'UPDATE' THEN
    RAISE EXCEPTION 'Qualification typed subject bindings are immutable';
  END IF;
  IF TG_OP = 'DELETE' THEN
    RAISE EXCEPTION 'Qualification typed subject bindings cannot be deleted';
  END IF;

  expected_scope := CASE TG_TABLE_NAME
    WHEN 'QualificationResultVersionSubject' THEN 'RESULT'::"QualificationApplicationScope"
    WHEN 'QualificationMethodVersionSubject' THEN 'METHOD'::"QualificationApplicationScope"
    WHEN 'QualificationBaselineVersionSubject' THEN 'BASELINE'::"QualificationApplicationScope"
    WHEN 'QualificationReportingPeriodVersionSubject' THEN 'REPORTING_PERIOD'::"QualificationApplicationScope"
    WHEN 'QualificationAnalyticalBasisVersionSubject' THEN 'ANALYTICAL_BASIS'::"QualificationApplicationScope"
    WHEN 'QualificationCompatibilityContextSubject' THEN 'COMPATIBILITY_CONTEXT'::"QualificationApplicationScope"
    WHEN 'QualificationOutputSnapshotSubject' THEN 'OUTPUT_SNAPSHOT'::"QualificationApplicationScope"
    WHEN 'QualificationProductDefinitionSubject' THEN 'PRODUCT_DEFINITION'::"QualificationApplicationScope"
    WHEN 'QualificationOutputEvidenceSubject' THEN 'EVIDENCE'::"QualificationApplicationScope"
    WHEN 'QualificationEvidenceAdmissionSubject' THEN 'EVIDENCE'::"QualificationApplicationScope"
    ELSE NULL
  END;

  SELECT "scope", "formalizedAt", "admittedAt" INTO application_scope, application_formalized_at, application_admitted_at
  FROM "QualificationApplicationVersion" WHERE id = NEW."applicationVersionId" FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Qualification typed subject requires an existing Application Version';
  END IF;
  IF application_scope IS DISTINCT FROM expected_scope THEN
    RAISE EXCEPTION 'Qualification typed subject does not match Application Version scope';
  END IF;
  IF application_formalized_at IS NOT NULL OR application_admitted_at IS NOT NULL THEN
    RAISE EXCEPTION 'Formal or admitted Qualification Application Version cannot accept a subject binding';
  END IF;
  SELECT "qualificationApplicationSubjectCount"(NEW."applicationVersionId") INTO existing_subject_count;
  IF existing_subject_count <> 0 THEN
    RAISE EXCEPTION 'Qualification Application Version accepts exactly one typed subject';
  END IF;
  RETURN NEW;
END;
$typed_subject_guard$ LANGUAGE plpgsql;

CREATE TRIGGER "QualificationResultVersionSubject_guard" BEFORE INSERT OR UPDATE OR DELETE ON "QualificationResultVersionSubject" FOR EACH ROW EXECUTE FUNCTION "guardQualificationTypedSubject"();
CREATE TRIGGER "QualificationMethodVersionSubject_guard" BEFORE INSERT OR UPDATE OR DELETE ON "QualificationMethodVersionSubject" FOR EACH ROW EXECUTE FUNCTION "guardQualificationTypedSubject"();
CREATE TRIGGER "QualificationBaselineVersionSubject_guard" BEFORE INSERT OR UPDATE OR DELETE ON "QualificationBaselineVersionSubject" FOR EACH ROW EXECUTE FUNCTION "guardQualificationTypedSubject"();
CREATE TRIGGER "QualificationReportingPeriodVersionSubject_guard" BEFORE INSERT OR UPDATE OR DELETE ON "QualificationReportingPeriodVersionSubject" FOR EACH ROW EXECUTE FUNCTION "guardQualificationTypedSubject"();
CREATE TRIGGER "QualificationAnalyticalBasisVersionSubject_guard" BEFORE INSERT OR UPDATE OR DELETE ON "QualificationAnalyticalBasisVersionSubject" FOR EACH ROW EXECUTE FUNCTION "guardQualificationTypedSubject"();
CREATE TRIGGER "QualificationCompatibilityContextSubject_guard" BEFORE INSERT OR UPDATE OR DELETE ON "QualificationCompatibilityContextSubject" FOR EACH ROW EXECUTE FUNCTION "guardQualificationTypedSubject"();
CREATE TRIGGER "QualificationOutputSnapshotSubject_guard" BEFORE INSERT OR UPDATE OR DELETE ON "QualificationOutputSnapshotSubject" FOR EACH ROW EXECUTE FUNCTION "guardQualificationTypedSubject"();
CREATE TRIGGER "QualificationProductDefinitionSubject_guard" BEFORE INSERT OR UPDATE OR DELETE ON "QualificationProductDefinitionSubject" FOR EACH ROW EXECUTE FUNCTION "guardQualificationTypedSubject"();
CREATE TRIGGER "QualificationOutputEvidenceSubject_guard" BEFORE INSERT OR UPDATE OR DELETE ON "QualificationOutputEvidenceSubject" FOR EACH ROW EXECUTE FUNCTION "guardQualificationTypedSubject"();
CREATE TRIGGER "QualificationEvidenceAdmissionSubject_guard" BEFORE INSERT OR UPDATE OR DELETE ON "QualificationEvidenceAdmissionSubject" FOR EACH ROW EXECUTE FUNCTION "guardQualificationTypedSubject"();
