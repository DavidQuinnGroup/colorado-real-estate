CREATE TABLE "SellerFinancialScenario" (
  "id" TEXT NOT NULL,
  "ownerAgentSubject" TEXT NOT NULL,
  "scenarioKey" TEXT NOT NULL,
  "versionOrdinal" INTEGER NOT NULL,
  "lifecycleState" TEXT NOT NULL,
  "calculationContract" TEXT NOT NULL,
  "inputSnapshot" JSONB NOT NULL,
  "sourceQualification" JSONB NOT NULL,
  "professionalInputRefs" JSONB NOT NULL,
  "scenarioFingerprint" TEXT NOT NULL,
  "supersedesScenarioId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "reviewedAt" TIMESTAMP(3),
  CONSTRAINT "SellerFinancialScenario_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SellerFinancialResult" (
  "id" TEXT NOT NULL,
  "scenarioId" TEXT NOT NULL,
  "ownerAgentSubject" TEXT NOT NULL,
  "calculationContract" TEXT NOT NULL,
  "resultPayload" JSONB NOT NULL,
  "resultFingerprint" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SellerFinancialResult_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SellerFinancialAuditEvent" (
  "id" TEXT NOT NULL,
  "scenarioId" TEXT NOT NULL,
  "ownerAgentSubject" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "eventFingerprint" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SellerFinancialAuditEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SellerFinancialScenario_scenarioFingerprint_key" ON "SellerFinancialScenario"("scenarioFingerprint");
CREATE UNIQUE INDEX "SellerFinancialScenario_supersedesScenarioId_key" ON "SellerFinancialScenario"("supersedesScenarioId");
CREATE UNIQUE INDEX "SellerFinancialScenario_ownerAgentSubject_scenarioKey_versionOrdinal_key" ON "SellerFinancialScenario"("ownerAgentSubject", "scenarioKey", "versionOrdinal");
CREATE INDEX "SellerFinancialScenario_ownerAgentSubject_scenarioKey_createdAt_idx" ON "SellerFinancialScenario"("ownerAgentSubject", "scenarioKey", "createdAt");
CREATE UNIQUE INDEX "SellerFinancialResult_resultFingerprint_key" ON "SellerFinancialResult"("resultFingerprint");
CREATE UNIQUE INDEX "SellerFinancialResult_scenarioId_calculationContract_key" ON "SellerFinancialResult"("scenarioId", "calculationContract");
CREATE INDEX "SellerFinancialResult_ownerAgentSubject_createdAt_idx" ON "SellerFinancialResult"("ownerAgentSubject", "createdAt");
CREATE UNIQUE INDEX "SellerFinancialAuditEvent_eventFingerprint_key" ON "SellerFinancialAuditEvent"("eventFingerprint");
CREATE INDEX "SellerFinancialAuditEvent_ownerAgentSubject_createdAt_idx" ON "SellerFinancialAuditEvent"("ownerAgentSubject", "createdAt");
CREATE INDEX "SellerFinancialAuditEvent_scenarioId_createdAt_idx" ON "SellerFinancialAuditEvent"("scenarioId", "createdAt");

ALTER TABLE "SellerFinancialScenario" ADD CONSTRAINT "SellerFinancialScenario_supersedesScenarioId_fkey" FOREIGN KEY ("supersedesScenarioId") REFERENCES "SellerFinancialScenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SellerFinancialResult" ADD CONSTRAINT "SellerFinancialResult_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "SellerFinancialScenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "SellerFinancialAuditEvent" ADD CONSTRAINT "SellerFinancialAuditEvent_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "SellerFinancialScenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE OR REPLACE FUNCTION "preventSellerFinancialMutation"() RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'PROJECT ATLAS seller financial records are immutable';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "SellerFinancialScenario_append_only" BEFORE UPDATE OR DELETE ON "SellerFinancialScenario" FOR EACH ROW EXECUTE FUNCTION "preventSellerFinancialMutation"();
CREATE TRIGGER "SellerFinancialResult_append_only" BEFORE UPDATE OR DELETE ON "SellerFinancialResult" FOR EACH ROW EXECUTE FUNCTION "preventSellerFinancialMutation"();
CREATE TRIGGER "SellerFinancialAuditEvent_append_only" BEFORE UPDATE OR DELETE ON "SellerFinancialAuditEvent" FOR EACH ROW EXECUTE FUNCTION "preventSellerFinancialMutation"();
