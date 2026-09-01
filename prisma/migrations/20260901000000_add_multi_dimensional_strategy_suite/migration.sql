-- PROJECT ATLAS MULTI_DIMENSIONAL_STRATEGY_SUITE_V1
-- Additive strategy-composition records only. No existing product data is rewritten.

CREATE TABLE "StrategyAnalysis" (
  "id" TEXT NOT NULL, "ownerAgentSubject" TEXT NOT NULL, "analysisKey" TEXT NOT NULL, "title" TEXT NOT NULL, "purpose" TEXT NOT NULL, "lifecycleState" TEXT NOT NULL, "engineVersion" TEXT NOT NULL, "assumptionPolicy" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "StrategyAnalysis_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "StrategyAlternative" (
  "id" TEXT NOT NULL, "analysisId" TEXT NOT NULL, "ownerAgentSubject" TEXT NOT NULL, "alternativeKey" TEXT NOT NULL, "versionOrdinal" INTEGER NOT NULL, "strategyProfile" TEXT NOT NULL, "lifecycleState" TEXT NOT NULL, "inputSnapshot" JSONB NOT NULL, "sourceQualification" JSONB NOT NULL, "dependencySnapshot" JSONB NOT NULL, "inputFingerprint" TEXT NOT NULL, "supersedesAlternativeId" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "reviewedAt" TIMESTAMP(3),
  CONSTRAINT "StrategyAlternative_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "StrategyAlternativeResult" (
  "id" TEXT NOT NULL, "alternativeId" TEXT NOT NULL, "ownerAgentSubject" TEXT NOT NULL, "inputFingerprint" TEXT NOT NULL, "calculationVersion" TEXT NOT NULL, "versionOrdinal" INTEGER NOT NULL, "resultSnapshot" JSONB NOT NULL, "resultFingerprint" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "StrategyAlternativeResult_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "StrategyPropertyRole" (
  "id" TEXT NOT NULL, "alternativeId" TEXT NOT NULL, "canonicalPropertyId" TEXT NOT NULL, "ownerAgentSubject" TEXT NOT NULL, "role" TEXT NOT NULL, "disposition" TEXT NOT NULL, "inputSnapshot" JSONB NOT NULL, "provenanceSnapshot" JSONB NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "StrategyPropertyRole_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "StrategyAlternativeDependency" (
  "id" TEXT NOT NULL, "alternativeId" TEXT NOT NULL, "ownerAgentSubject" TEXT NOT NULL, "upstreamArtifact" TEXT NOT NULL, "dependencyType" TEXT NOT NULL, "versionUsed" TEXT NOT NULL, "qualification" TEXT NOT NULL, "detail" JSONB NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "StrategyAlternativeDependency_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "StrategyAlternativeAuditEvent" (
  "id" TEXT NOT NULL, "alternativeId" TEXT NOT NULL, "ownerAgentSubject" TEXT NOT NULL, "eventType" TEXT NOT NULL, "eventFingerprint" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "StrategyAlternativeAuditEvent_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "StrategyAnalysis_ownerAgentSubject_analysisKey_key" ON "StrategyAnalysis"("ownerAgentSubject", "analysisKey");
CREATE INDEX "StrategyAnalysis_ownerAgentSubject_createdAt_idx" ON "StrategyAnalysis"("ownerAgentSubject", "createdAt");
CREATE UNIQUE INDEX "StrategyAlternative_inputFingerprint_key" ON "StrategyAlternative"("inputFingerprint");
CREATE UNIQUE INDEX "StrategyAlternative_supersedesAlternativeId_key" ON "StrategyAlternative"("supersedesAlternativeId");
CREATE UNIQUE INDEX "StrategyAlternative_analysisId_alternativeKey_versionOrdinal_key" ON "StrategyAlternative"("analysisId", "alternativeKey", "versionOrdinal");
CREATE INDEX "StrategyAlternative_ownerAgentSubject_analysisId_createdAt_idx" ON "StrategyAlternative"("ownerAgentSubject", "analysisId", "createdAt");
CREATE UNIQUE INDEX "StrategyAlternativeResult_resultFingerprint_key" ON "StrategyAlternativeResult"("resultFingerprint");
CREATE UNIQUE INDEX "StrategyAlternativeResult_alternativeId_versionOrdinal_key" ON "StrategyAlternativeResult"("alternativeId", "versionOrdinal");
CREATE INDEX "StrategyAlternativeResult_ownerAgentSubject_createdAt_idx" ON "StrategyAlternativeResult"("ownerAgentSubject", "createdAt");
CREATE INDEX "StrategyAlternativeResult_alternativeId_createdAt_idx" ON "StrategyAlternativeResult"("alternativeId", "createdAt");
CREATE UNIQUE INDEX "StrategyPropertyRole_alternativeId_role_key" ON "StrategyPropertyRole"("alternativeId", "role");
CREATE INDEX "StrategyPropertyRole_ownerAgentSubject_canonicalPropertyId_idx" ON "StrategyPropertyRole"("ownerAgentSubject", "canonicalPropertyId");
CREATE UNIQUE INDEX "StrategyAlternativeDependency_alternativeId_upstreamArtifact_dependencyType_key" ON "StrategyAlternativeDependency"("alternativeId", "upstreamArtifact", "dependencyType");
CREATE INDEX "StrategyAlternativeDependency_ownerAgentSubject_alternativeId_idx" ON "StrategyAlternativeDependency"("ownerAgentSubject", "alternativeId");
CREATE UNIQUE INDEX "StrategyAlternativeAuditEvent_eventFingerprint_key" ON "StrategyAlternativeAuditEvent"("eventFingerprint");
CREATE INDEX "StrategyAlternativeAuditEvent_alternativeId_createdAt_idx" ON "StrategyAlternativeAuditEvent"("alternativeId", "createdAt");
CREATE INDEX "StrategyAlternativeAuditEvent_ownerAgentSubject_createdAt_idx" ON "StrategyAlternativeAuditEvent"("ownerAgentSubject", "createdAt");
ALTER TABLE "StrategyAlternative" ADD CONSTRAINT "StrategyAlternative_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "StrategyAnalysis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "StrategyAlternative" ADD CONSTRAINT "StrategyAlternative_supersedesAlternativeId_fkey" FOREIGN KEY ("supersedesAlternativeId") REFERENCES "StrategyAlternative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "StrategyAlternativeResult" ADD CONSTRAINT "StrategyAlternativeResult_alternativeId_fkey" FOREIGN KEY ("alternativeId") REFERENCES "StrategyAlternative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "StrategyPropertyRole" ADD CONSTRAINT "StrategyPropertyRole_alternativeId_fkey" FOREIGN KEY ("alternativeId") REFERENCES "StrategyAlternative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "StrategyPropertyRole" ADD CONSTRAINT "StrategyPropertyRole_canonicalPropertyId_fkey" FOREIGN KEY ("canonicalPropertyId") REFERENCES "CanonicalPhysicalProperty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "StrategyAlternativeDependency" ADD CONSTRAINT "StrategyAlternativeDependency_alternativeId_fkey" FOREIGN KEY ("alternativeId") REFERENCES "StrategyAlternative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "StrategyAlternativeAuditEvent" ADD CONSTRAINT "StrategyAlternativeAuditEvent_alternativeId_fkey" FOREIGN KEY ("alternativeId") REFERENCES "StrategyAlternative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE FUNCTION "StrategyAlternativeResult_append_only"() RETURNS trigger AS $$ BEGIN RAISE EXCEPTION 'Strategy alternative results are immutable'; END; $$ LANGUAGE plpgsql;
CREATE TRIGGER "StrategyAlternativeResult_append_only" BEFORE UPDATE OR DELETE ON "StrategyAlternativeResult" FOR EACH ROW EXECUTE FUNCTION "StrategyAlternativeResult_append_only"();
CREATE FUNCTION "StrategyAlternative_reviewed_immutable"() RETURNS trigger AS $$ BEGIN IF OLD."lifecycleState" = 'AGENT_REVIEWED' THEN RAISE EXCEPTION 'Reviewed strategy alternatives are immutable'; END IF; RETURN NEW; END; $$ LANGUAGE plpgsql;
CREATE TRIGGER "StrategyAlternative_reviewed_immutable" BEFORE UPDATE OR DELETE ON "StrategyAlternative" FOR EACH ROW EXECUTE FUNCTION "StrategyAlternative_reviewed_immutable"();
