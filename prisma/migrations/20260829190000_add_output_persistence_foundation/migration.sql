-- PROJECT ATLAS OUTPUT_PERSISTENCE_FOUNDATION_V1
-- Additive only. This migration is not applied by certification tooling.

CREATE TYPE "OutputProductKind" AS ENUM ('SELLER_PRESENTATION', 'BUYER_PRESENTATION', 'MARKET_REPORT', 'PROPERTY_ANALYSIS', 'LOCATION_ANALYSIS', 'INVESTMENT_PROPERTY_ANALYSIS', 'MULTI_PROPERTY_FINANCIAL_BREAKEVEN_ANALYSIS', 'ADVISORY_BRIEFING', 'AGENT_INTERNAL_ANALYSIS');
CREATE TYPE "OutputAudience" AS ENUM ('AGENT_INTERNAL', 'SELLER', 'BUYER', 'INVESTOR', 'HOMEOWNER', 'CLIENT', 'PROSPECT', 'PUBLIC');
CREATE TYPE "OutputVersionLifecycleState" AS ENUM ('DRAFT', 'COMPOSED', 'AGENT_REVIEW_REQUIRED', 'AGENT_REVIEWED', 'READY_FOR_SELLER_REVIEW', 'SELLER_REVIEWED_OR_PRESENTED', 'INVALIDATED', 'SUPERSEDED', 'ARCHIVED_HISTORICAL_REFERENCE', 'FAIL_CLOSED');
CREATE TYPE "OutputDependencyType" AS ENUM ('FACT_DEPENDENCY', 'MARKET_DEPENDENCY', 'COMPETITION_DEPENDENCY', 'SEARCH_BAND_DEPENDENCY', 'AGENT_INPUT_DEPENDENCY', 'NARRATIVE_DEPENDENCY', 'RECOMMENDATION_DEPENDENCY', 'PRICING_DEPENDENCY', 'FINANCIAL_DEPENDENCY', 'RIGHTS_DEPENDENCY', 'FRESHNESS_DEPENDENCY', 'PRESENTATION_DEPENDENCY');
CREATE TYPE "OutputInvalidationState" AS ENUM ('CURRENT', 'REFRESH_RECOMMENDED', 'REVIEW_REQUIRED', 'RECOMPUTE_REQUIRED', 'RECOMPOSE_REQUIRED', 'RIGHTS_REVIEW_REQUIRED', 'FRESHNESS_REVIEW_REQUIRED', 'SUPERSEDED', 'EVIDENCE_INSUFFICIENT');
CREATE TYPE "OutputReviewDisposition" AS ENUM ('APPROVED', 'REJECTED', 'REVIEW_REQUIRED');
CREATE TYPE "OutputDecisionDisposition" AS ENUM ('SELECTED', 'DEFERRED', 'NOTED');
CREATE TYPE "OutputCheckpointState" AS ENUM ('RECORDED', 'REVIEW_REQUIRED', 'COMPLETED');

CREATE TABLE "OutputProduct" (
  "id" TEXT NOT NULL,
  "ownerAgentSubject" TEXT NOT NULL,
  "productKind" "OutputProductKind" NOT NULL,
  "audience" "OutputAudience" NOT NULL,
  "subjectRef" TEXT NOT NULL,
  "purpose" TEXT NOT NULL,
  "outputContractVersion" TEXT NOT NULL,
  "lineageKey" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OutputProduct_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OutputVersion" (
  "id" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "sourceVersionRef" TEXT NOT NULL,
  "versionOrdinal" INTEGER NOT NULL,
  "idempotencyKey" TEXT NOT NULL,
  "outputContractVersion" TEXT NOT NULL,
  "displayVersion" TEXT NOT NULL,
  "audience" "OutputAudience" NOT NULL,
  "subjectRef" TEXT NOT NULL,
  "purpose" TEXT NOT NULL,
  "effectiveAsOf" TIMESTAMP(3) NOT NULL,
  "lifecycleState" "OutputVersionLifecycleState" NOT NULL,
  "reviewState" TEXT NOT NULL,
  "contentVersion" TEXT NOT NULL,
  "compositionVersion" TEXT NOT NULL,
  "presentationVisualVersion" TEXT NOT NULL,
  "contentFingerprint" TEXT NOT NULL,
  "payloadSchemaVersion" TEXT NOT NULL,
  "contentPayload" JSONB NOT NULL,
  "lineage" JSONB NOT NULL,
  "ownerAgentSubject" TEXT NOT NULL,
  "reviewedAt" TIMESTAMP(3) NOT NULL,
  "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OutputVersion_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OutputEvidenceSnapshot" (
  "id" TEXT NOT NULL,
  "outputVersionId" TEXT NOT NULL,
  "snapshotSchemaVersion" TEXT NOT NULL,
  "sourceSnapshotRefs" JSONB NOT NULL,
  "metricRefs" JSONB NOT NULL,
  "analysisRefs" JSONB NOT NULL,
  "agentInputRefs" JSONB NOT NULL,
  "assumptionRefs" JSONB NOT NULL,
  "limitationRefs" JSONB NOT NULL,
  "rightsRefs" JSONB NOT NULL,
  "freshnessRefs" JSONB NOT NULL,
  "reviewState" TEXT NOT NULL,
  "fingerprint" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OutputEvidenceSnapshot_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OutputDependency" (
  "id" TEXT NOT NULL,
  "outputVersionId" TEXT NOT NULL,
  "upstreamArtifact" TEXT NOT NULL,
  "downstreamArtifact" TEXT NOT NULL,
  "dependencyType" "OutputDependencyType" NOT NULL,
  "materiality" TEXT NOT NULL,
  "versionUsed" TEXT NOT NULL,
  "fieldMetricScope" JSONB NOT NULL,
  "changePolicy" TEXT NOT NULL,
  "invalidationPolicy" "OutputInvalidationState" NOT NULL,
  "reviewPolicy" TEXT NOT NULL,
  "currentState" "OutputInvalidationState" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OutputDependency_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OutputReview" (
  "id" TEXT NOT NULL,
  "outputVersionId" TEXT NOT NULL,
  "reviewerSubject" TEXT NOT NULL,
  "disposition" "OutputReviewDisposition" NOT NULL,
  "reviewContractVersion" TEXT NOT NULL,
  "reviewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "reviewNote" TEXT,
  CONSTRAINT "OutputReview_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OutputDecision" (
  "id" TEXT NOT NULL,
  "outputVersionId" TEXT NOT NULL,
  "decisionRef" TEXT NOT NULL,
  "disposition" "OutputDecisionDisposition" NOT NULL,
  "decisionSchemaVersion" TEXT NOT NULL,
  "recordedBySubject" TEXT NOT NULL,
  "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "rationale" TEXT,
  CONSTRAINT "OutputDecision_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OutputCheckpoint" (
  "id" TEXT NOT NULL,
  "outputVersionId" TEXT NOT NULL,
  "checkpointRef" TEXT NOT NULL,
  "state" "OutputCheckpointState" NOT NULL,
  "checkpointSchemaVersion" TEXT NOT NULL,
  "recordedBySubject" TEXT NOT NULL,
  "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "detail" TEXT,
  CONSTRAINT "OutputCheckpoint_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "OutputProduct_lineageKey_key" ON "OutputProduct"("lineageKey");
CREATE UNIQUE INDEX "OutputProduct_ownerAgentSubject_productKind_audience_subjectRef_key" ON "OutputProduct"("ownerAgentSubject", "productKind", "audience", "subjectRef");
CREATE INDEX "OutputProduct_ownerAgentSubject_createdAt_idx" ON "OutputProduct"("ownerAgentSubject", "createdAt");
CREATE INDEX "OutputProduct_productKind_subjectRef_idx" ON "OutputProduct"("productKind", "subjectRef");
CREATE UNIQUE INDEX "OutputVersion_idempotencyKey_key" ON "OutputVersion"("idempotencyKey");
CREATE UNIQUE INDEX "OutputVersion_productId_versionOrdinal_key" ON "OutputVersion"("productId", "versionOrdinal");
CREATE UNIQUE INDEX "OutputVersion_productId_sourceVersionRef_key" ON "OutputVersion"("productId", "sourceVersionRef");
CREATE INDEX "OutputVersion_ownerAgentSubject_reviewedAt_idx" ON "OutputVersion"("ownerAgentSubject", "reviewedAt");
CREATE INDEX "OutputVersion_productId_effectiveAsOf_idx" ON "OutputVersion"("productId", "effectiveAsOf");
CREATE INDEX "OutputVersion_contentFingerprint_idx" ON "OutputVersion"("contentFingerprint");
CREATE UNIQUE INDEX "OutputEvidenceSnapshot_outputVersionId_key" ON "OutputEvidenceSnapshot"("outputVersionId");
CREATE INDEX "OutputEvidenceSnapshot_fingerprint_idx" ON "OutputEvidenceSnapshot"("fingerprint");
CREATE UNIQUE INDEX "OutputDependency_outputVersionId_upstreamArtifact_downstreamArtifact_dependencyType_key" ON "OutputDependency"("outputVersionId", "upstreamArtifact", "downstreamArtifact", "dependencyType");
CREATE INDEX "OutputDependency_outputVersionId_idx" ON "OutputDependency"("outputVersionId");
CREATE INDEX "OutputDependency_currentState_idx" ON "OutputDependency"("currentState");
CREATE INDEX "OutputReview_outputVersionId_reviewedAt_idx" ON "OutputReview"("outputVersionId", "reviewedAt");
CREATE INDEX "OutputReview_reviewerSubject_reviewedAt_idx" ON "OutputReview"("reviewerSubject", "reviewedAt");
CREATE UNIQUE INDEX "OutputDecision_outputVersionId_decisionRef_key" ON "OutputDecision"("outputVersionId", "decisionRef");
CREATE INDEX "OutputDecision_outputVersionId_recordedAt_idx" ON "OutputDecision"("outputVersionId", "recordedAt");
CREATE UNIQUE INDEX "OutputCheckpoint_outputVersionId_checkpointRef_key" ON "OutputCheckpoint"("outputVersionId", "checkpointRef");
CREATE INDEX "OutputCheckpoint_outputVersionId_recordedAt_idx" ON "OutputCheckpoint"("outputVersionId", "recordedAt");

ALTER TABLE "OutputVersion" ADD CONSTRAINT "OutputVersion_productId_fkey" FOREIGN KEY ("productId") REFERENCES "OutputProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OutputEvidenceSnapshot" ADD CONSTRAINT "OutputEvidenceSnapshot_outputVersionId_fkey" FOREIGN KEY ("outputVersionId") REFERENCES "OutputVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OutputDependency" ADD CONSTRAINT "OutputDependency_outputVersionId_fkey" FOREIGN KEY ("outputVersionId") REFERENCES "OutputVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OutputReview" ADD CONSTRAINT "OutputReview_outputVersionId_fkey" FOREIGN KEY ("outputVersionId") REFERENCES "OutputVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OutputDecision" ADD CONSTRAINT "OutputDecision_outputVersionId_fkey" FOREIGN KEY ("outputVersionId") REFERENCES "OutputVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OutputCheckpoint" ADD CONSTRAINT "OutputCheckpoint_outputVersionId_fkey" FOREIGN KEY ("outputVersionId") REFERENCES "OutputVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE FUNCTION "preventOutputPersistenceMutation"() RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'PROJECT ATLAS output persistence records are append-only';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "OutputVersion_append_only" BEFORE UPDATE OR DELETE ON "OutputVersion" FOR EACH ROW EXECUTE FUNCTION "preventOutputPersistenceMutation"();
CREATE TRIGGER "OutputEvidenceSnapshot_append_only" BEFORE UPDATE OR DELETE ON "OutputEvidenceSnapshot" FOR EACH ROW EXECUTE FUNCTION "preventOutputPersistenceMutation"();
CREATE TRIGGER "OutputDependency_append_only" BEFORE UPDATE OR DELETE ON "OutputDependency" FOR EACH ROW EXECUTE FUNCTION "preventOutputPersistenceMutation"();
CREATE TRIGGER "OutputReview_append_only" BEFORE UPDATE OR DELETE ON "OutputReview" FOR EACH ROW EXECUTE FUNCTION "preventOutputPersistenceMutation"();
CREATE TRIGGER "OutputDecision_append_only" BEFORE UPDATE OR DELETE ON "OutputDecision" FOR EACH ROW EXECUTE FUNCTION "preventOutputPersistenceMutation"();
CREATE TRIGGER "OutputCheckpoint_append_only" BEFORE UPDATE OR DELETE ON "OutputCheckpoint" FOR EACH ROW EXECUTE FUNCTION "preventOutputPersistenceMutation"();
