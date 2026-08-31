CREATE TABLE "InvestmentAnalysis" (
  "id" TEXT NOT NULL, "ownerAgentSubject" TEXT NOT NULL, "analysisKey" TEXT NOT NULL, "title" TEXT NOT NULL, "purpose" TEXT NOT NULL, "lifecycleState" TEXT NOT NULL, "calculationVersion" TEXT NOT NULL, "assumptionPolicy" TEXT NOT NULL, "clientContextRef" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "InvestmentAnalysis_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "InvestmentScenario" (
  "id" TEXT NOT NULL, "analysisId" TEXT NOT NULL, "ownerAgentSubject" TEXT NOT NULL, "scenarioKey" TEXT NOT NULL, "versionOrdinal" INTEGER NOT NULL, "lifecycleState" TEXT NOT NULL, "calculationVersion" TEXT NOT NULL, "assumptionPolicy" TEXT NOT NULL, "inputSnapshot" JSONB NOT NULL, "sourceQualification" JSONB NOT NULL, "dependencySnapshot" JSONB NOT NULL, "inputFingerprint" TEXT NOT NULL, "supersedesScenarioId" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "reviewedAt" TIMESTAMP(3),
  CONSTRAINT "InvestmentScenario_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "InvestmentScenarioResult" (
  "id" TEXT NOT NULL, "scenarioId" TEXT NOT NULL, "ownerAgentSubject" TEXT NOT NULL, "calculationVersion" TEXT NOT NULL, "resultSnapshot" JSONB NOT NULL, "resultFingerprint" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "InvestmentScenarioResult_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "InvestmentScenarioAuditEvent" (
  "id" TEXT NOT NULL, "scenarioId" TEXT NOT NULL, "ownerAgentSubject" TEXT NOT NULL, "eventType" TEXT NOT NULL, "eventFingerprint" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "InvestmentScenarioAuditEvent_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "InvestmentAnalysis_ownerAgentSubject_analysisKey_key" ON "InvestmentAnalysis"("ownerAgentSubject", "analysisKey");
CREATE INDEX "InvestmentAnalysis_ownerAgentSubject_createdAt_idx" ON "InvestmentAnalysis"("ownerAgentSubject", "createdAt");
CREATE UNIQUE INDEX "InvestmentScenario_inputFingerprint_key" ON "InvestmentScenario"("inputFingerprint");
CREATE UNIQUE INDEX "InvestmentScenario_supersedesScenarioId_key" ON "InvestmentScenario"("supersedesScenarioId");
CREATE UNIQUE INDEX "InvestmentScenario_analysisId_scenarioKey_versionOrdinal_key" ON "InvestmentScenario"("analysisId", "scenarioKey", "versionOrdinal");
CREATE INDEX "InvestmentScenario_ownerAgentSubject_analysisId_createdAt_idx" ON "InvestmentScenario"("ownerAgentSubject", "analysisId", "createdAt");
CREATE UNIQUE INDEX "InvestmentScenarioResult_scenarioId_key" ON "InvestmentScenarioResult"("scenarioId");
CREATE UNIQUE INDEX "InvestmentScenarioResult_resultFingerprint_key" ON "InvestmentScenarioResult"("resultFingerprint");
CREATE INDEX "InvestmentScenarioResult_ownerAgentSubject_createdAt_idx" ON "InvestmentScenarioResult"("ownerAgentSubject", "createdAt");
CREATE UNIQUE INDEX "InvestmentScenarioAuditEvent_eventFingerprint_key" ON "InvestmentScenarioAuditEvent"("eventFingerprint");
CREATE INDEX "InvestmentScenarioAuditEvent_scenarioId_createdAt_idx" ON "InvestmentScenarioAuditEvent"("scenarioId", "createdAt");
CREATE INDEX "InvestmentScenarioAuditEvent_ownerAgentSubject_createdAt_idx" ON "InvestmentScenarioAuditEvent"("ownerAgentSubject", "createdAt");
ALTER TABLE "InvestmentScenario" ADD CONSTRAINT "InvestmentScenario_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "InvestmentAnalysis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "InvestmentScenario" ADD CONSTRAINT "InvestmentScenario_supersedesScenarioId_fkey" FOREIGN KEY ("supersedesScenarioId") REFERENCES "InvestmentScenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "InvestmentScenarioResult" ADD CONSTRAINT "InvestmentScenarioResult_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "InvestmentScenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "InvestmentScenarioAuditEvent" ADD CONSTRAINT "InvestmentScenarioAuditEvent_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "InvestmentScenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE FUNCTION "InvestmentScenarioResult_append_only"() RETURNS trigger AS $$ BEGIN RAISE EXCEPTION 'Investment scenario results are immutable'; END; $$ LANGUAGE plpgsql;
CREATE TRIGGER "InvestmentScenarioResult_append_only" BEFORE UPDATE OR DELETE ON "InvestmentScenarioResult" FOR EACH ROW EXECUTE FUNCTION "InvestmentScenarioResult_append_only"();
