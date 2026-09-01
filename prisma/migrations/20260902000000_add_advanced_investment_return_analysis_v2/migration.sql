-- PROJECT ATLAS ADVANCED_INVESTMENT_RETURN_ANALYSIS_V2
-- Additive, owner-scoped time-series projection records. Existing V1 analyses are not rewritten.

CREATE TABLE "AdvancedInvestmentReturnAnalysis" (
  "id" TEXT NOT NULL, "ownerAgentSubject" TEXT NOT NULL, "analysisKey" TEXT NOT NULL, "title" TEXT NOT NULL, "purpose" TEXT NOT NULL, "lifecycleState" TEXT NOT NULL, "calculationVersion" TEXT NOT NULL, "projectionPolicy" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AdvancedInvestmentReturnAnalysis_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "AdvancedInvestmentReturnProjection" (
  "id" TEXT NOT NULL, "analysisId" TEXT NOT NULL, "ownerAgentSubject" TEXT NOT NULL, "projectionKey" TEXT NOT NULL, "versionOrdinal" INTEGER NOT NULL, "analysisProfile" TEXT NOT NULL, "sourceKind" TEXT NOT NULL, "sourceArtifactId" TEXT NOT NULL, "sourceResultId" TEXT NOT NULL, "sourceInputFingerprint" TEXT NOT NULL, "lifecycleState" TEXT NOT NULL, "calculationVersion" TEXT NOT NULL, "projectionPolicy" TEXT NOT NULL, "selectedHorizonMonths" JSONB NOT NULL, "inputSnapshot" JSONB NOT NULL, "assumptionSnapshot" JSONB NOT NULL, "dependencySnapshot" JSONB NOT NULL, "inputFingerprint" TEXT NOT NULL, "supersedesProjectionId" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "reviewedAt" TIMESTAMP(3),
  CONSTRAINT "AdvancedInvestmentReturnProjection_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "AdvancedInvestmentReturnProjectionResult" (
  "id" TEXT NOT NULL, "projectionId" TEXT NOT NULL, "ownerAgentSubject" TEXT NOT NULL, "inputFingerprint" TEXT NOT NULL, "calculationVersion" TEXT NOT NULL, "projectionPolicy" TEXT NOT NULL, "versionOrdinal" INTEGER NOT NULL, "resultSnapshot" JSONB NOT NULL, "resultFingerprint" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AdvancedInvestmentReturnProjectionResult_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "AdvancedInvestmentReturnDependency" (
  "id" TEXT NOT NULL, "projectionId" TEXT NOT NULL, "ownerAgentSubject" TEXT NOT NULL, "upstreamArtifact" TEXT NOT NULL, "dependencyType" TEXT NOT NULL, "versionUsed" TEXT NOT NULL, "qualification" TEXT NOT NULL, "detail" JSONB NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AdvancedInvestmentReturnDependency_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "AdvancedInvestmentReturnAuditEvent" (
  "id" TEXT NOT NULL, "projectionId" TEXT NOT NULL, "ownerAgentSubject" TEXT NOT NULL, "eventType" TEXT NOT NULL, "eventFingerprint" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AdvancedInvestmentReturnAuditEvent_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "AdvancedInvestmentReturnAnalysis_ownerAgentSubject_analysisKey_key" ON "AdvancedInvestmentReturnAnalysis"("ownerAgentSubject", "analysisKey");
CREATE INDEX "AdvancedInvestmentReturnAnalysis_ownerAgentSubject_createdAt_idx" ON "AdvancedInvestmentReturnAnalysis"("ownerAgentSubject", "createdAt");
CREATE UNIQUE INDEX "AdvancedInvestmentReturnProjection_inputFingerprint_key" ON "AdvancedInvestmentReturnProjection"("inputFingerprint");
CREATE UNIQUE INDEX "AdvancedInvestmentReturnProjection_supersedesProjectionId_key" ON "AdvancedInvestmentReturnProjection"("supersedesProjectionId");
CREATE UNIQUE INDEX "AdvancedInvestmentReturnProjection_analysisId_projectionKey_versionOrdinal_key" ON "AdvancedInvestmentReturnProjection"("analysisId", "projectionKey", "versionOrdinal");
CREATE INDEX "AdvancedInvestmentReturnProjection_ownerAgentSubject_analysisId_createdAt_idx" ON "AdvancedInvestmentReturnProjection"("ownerAgentSubject", "analysisId", "createdAt");
CREATE UNIQUE INDEX "AdvancedInvestmentReturnProjectionResult_resultFingerprint_key" ON "AdvancedInvestmentReturnProjectionResult"("resultFingerprint");
CREATE UNIQUE INDEX "AdvancedInvestmentReturnProjectionResult_projectionId_versionOrdinal_key" ON "AdvancedInvestmentReturnProjectionResult"("projectionId", "versionOrdinal");
CREATE INDEX "AdvancedInvestmentReturnProjectionResult_ownerAgentSubject_createdAt_idx" ON "AdvancedInvestmentReturnProjectionResult"("ownerAgentSubject", "createdAt");
CREATE INDEX "AdvancedInvestmentReturnProjectionResult_projectionId_createdAt_idx" ON "AdvancedInvestmentReturnProjectionResult"("projectionId", "createdAt");
CREATE UNIQUE INDEX "AdvancedInvestmentReturnDependency_projectionId_upstreamArtifact_dependencyType_key" ON "AdvancedInvestmentReturnDependency"("projectionId", "upstreamArtifact", "dependencyType");
CREATE INDEX "AdvancedInvestmentReturnDependency_ownerAgentSubject_projectionId_idx" ON "AdvancedInvestmentReturnDependency"("ownerAgentSubject", "projectionId");
CREATE UNIQUE INDEX "AdvancedInvestmentReturnAuditEvent_eventFingerprint_key" ON "AdvancedInvestmentReturnAuditEvent"("eventFingerprint");
CREATE INDEX "AdvancedInvestmentReturnAuditEvent_projectionId_createdAt_idx" ON "AdvancedInvestmentReturnAuditEvent"("projectionId", "createdAt");
CREATE INDEX "AdvancedInvestmentReturnAuditEvent_ownerAgentSubject_createdAt_idx" ON "AdvancedInvestmentReturnAuditEvent"("ownerAgentSubject", "createdAt");
ALTER TABLE "AdvancedInvestmentReturnProjection" ADD CONSTRAINT "AdvancedInvestmentReturnProjection_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "AdvancedInvestmentReturnAnalysis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AdvancedInvestmentReturnProjection" ADD CONSTRAINT "AdvancedInvestmentReturnProjection_supersedesProjectionId_fkey" FOREIGN KEY ("supersedesProjectionId") REFERENCES "AdvancedInvestmentReturnProjection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AdvancedInvestmentReturnProjectionResult" ADD CONSTRAINT "AdvancedInvestmentReturnProjectionResult_projectionId_fkey" FOREIGN KEY ("projectionId") REFERENCES "AdvancedInvestmentReturnProjection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AdvancedInvestmentReturnDependency" ADD CONSTRAINT "AdvancedInvestmentReturnDependency_projectionId_fkey" FOREIGN KEY ("projectionId") REFERENCES "AdvancedInvestmentReturnProjection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AdvancedInvestmentReturnAuditEvent" ADD CONSTRAINT "AdvancedInvestmentReturnAuditEvent_projectionId_fkey" FOREIGN KEY ("projectionId") REFERENCES "AdvancedInvestmentReturnProjection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE FUNCTION "AdvancedInvestmentReturnProjectionResult_append_only"() RETURNS trigger AS $$ BEGIN RAISE EXCEPTION 'Advanced investment return projection results are immutable'; END; $$ LANGUAGE plpgsql;
CREATE TRIGGER "AdvancedInvestmentReturnProjectionResult_append_only" BEFORE UPDATE OR DELETE ON "AdvancedInvestmentReturnProjectionResult" FOR EACH ROW EXECUTE FUNCTION "AdvancedInvestmentReturnProjectionResult_append_only"();
CREATE FUNCTION "AdvancedInvestmentReturnProjection_reviewed_immutable"() RETURNS trigger AS $$ BEGIN IF OLD."lifecycleState" = 'AGENT_REVIEWED' THEN RAISE EXCEPTION 'Reviewed advanced investment return projections are immutable'; END IF; RETURN NEW; END; $$ LANGUAGE plpgsql;
CREATE TRIGGER "AdvancedInvestmentReturnProjection_reviewed_immutable" BEFORE UPDATE OR DELETE ON "AdvancedInvestmentReturnProjection" FOR EACH ROW EXECUTE FUNCTION "AdvancedInvestmentReturnProjection_reviewed_immutable"();
