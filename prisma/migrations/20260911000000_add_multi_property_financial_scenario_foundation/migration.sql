-- Additive Project Atlas multi-property financial scenario foundation.
CREATE TYPE "MultiPropertyFinancialScenarioLifecycleState" AS ENUM ('ACTIVE', 'ARCHIVED');
CREATE TYPE "MultiPropertyFinancialScenarioPropertyRole" AS ENUM ('CURRENT_HOME_SELL', 'CURRENT_HOME_RETAIN', 'REPLACEMENT_PRIMARY_ACQUIRE', 'INVESTMENT_ACQUIRE');
CREATE TYPE "MultiPropertyFinancialScenarioPropertyReferenceType" AS ENUM ('CANONICAL', 'PROSPECTIVE', 'HYPOTHETICAL');

CREATE TABLE "MultiPropertyFinancialScenario" (
  "id" TEXT NOT NULL,
  "ownerAgentSubject" TEXT NOT NULL,
  "clientCaseId" TEXT,
  "scenarioKey" TEXT NOT NULL,
  "displayName" TEXT NOT NULL,
  "lifecycleState" "MultiPropertyFinancialScenarioLifecycleState" NOT NULL DEFAULT 'ACTIVE',
  "createdBySubject" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "archivedAt" TIMESTAMP(3),
  CONSTRAINT "MultiPropertyFinancialScenario_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MultiPropertyFinancialScenarioVersion" (
  "id" TEXT NOT NULL,
  "scenarioId" TEXT NOT NULL,
  "ownerAgentSubject" TEXT NOT NULL,
  "versionOrdinal" INTEGER NOT NULL,
  "schemaVersion" TEXT NOT NULL,
  "calculationEngine" TEXT NOT NULL,
  "inputSnapshot" JSONB NOT NULL,
  "inputFingerprint" TEXT NOT NULL,
  "idempotencyKey" TEXT NOT NULL,
  "supersedesVersionId" TEXT,
  "createdBySubject" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MultiPropertyFinancialScenarioVersion_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MultiPropertyFinancialScenarioProperty" (
  "id" TEXT NOT NULL,
  "scenarioVersionId" TEXT NOT NULL,
  "canonicalPropertyId" TEXT,
  "ownerAgentSubject" TEXT NOT NULL,
  "sequence" INTEGER NOT NULL,
  "role" "MultiPropertyFinancialScenarioPropertyRole" NOT NULL,
  "referenceType" "MultiPropertyFinancialScenarioPropertyReferenceType" NOT NULL,
  "displayLabel" TEXT NOT NULL,
  "inputSnapshot" JSONB NOT NULL,
  "provenanceSnapshot" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MultiPropertyFinancialScenarioProperty_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MultiPropertyFinancialScenarioResult" (
  "id" TEXT NOT NULL,
  "scenarioVersionId" TEXT NOT NULL,
  "ownerAgentSubject" TEXT NOT NULL,
  "schemaVersion" TEXT NOT NULL,
  "calculationEngine" TEXT NOT NULL,
  "inputFingerprint" TEXT NOT NULL,
  "resultSnapshot" JSONB NOT NULL,
  "resultFingerprint" TEXT NOT NULL,
  "calculatedBySubject" TEXT NOT NULL,
  "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MultiPropertyFinancialScenarioResult_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MultiPropertyFinancialScenarioAuditEvent" (
  "id" TEXT NOT NULL,
  "scenarioId" TEXT NOT NULL,
  "scenarioVersionId" TEXT,
  "ownerAgentSubject" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "eventFingerprint" TEXT NOT NULL,
  "detail" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MultiPropertyFinancialScenarioAuditEvent_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "OutputVersion" ADD COLUMN "multiPropertyFinancialScenarioVersionId" TEXT;

CREATE UNIQUE INDEX "MultiPropertyFinancialScenario_ownerAgentSubject_scenarioKey_key" ON "MultiPropertyFinancialScenario"("ownerAgentSubject", "scenarioKey");
CREATE INDEX "MultiPropertyFinancialScenario_ownerAgentSubject_clientCaseId_createdAt_idx" ON "MultiPropertyFinancialScenario"("ownerAgentSubject", "clientCaseId", "createdAt");
CREATE INDEX "MultiPropertyFinancialScenario_ownerAgentSubject_lifecycleState_createdAt_idx" ON "MultiPropertyFinancialScenario"("ownerAgentSubject", "lifecycleState", "createdAt");
CREATE UNIQUE INDEX "MultiPropertyFinancialScenarioVersion_inputFingerprint_key" ON "MultiPropertyFinancialScenarioVersion"("inputFingerprint");
CREATE UNIQUE INDEX "MultiPropertyFinancialScenarioVersion_idempotencyKey_key" ON "MultiPropertyFinancialScenarioVersion"("idempotencyKey");
CREATE UNIQUE INDEX "MultiPropertyFinancialScenarioVersion_supersedesVersionId_key" ON "MultiPropertyFinancialScenarioVersion"("supersedesVersionId");
CREATE UNIQUE INDEX "MultiPropertyFinancialScenarioVersion_scenarioId_versionOrdinal_key" ON "MultiPropertyFinancialScenarioVersion"("scenarioId", "versionOrdinal");
CREATE INDEX "MultiPropertyFinancialScenarioVersion_ownerAgentSubject_scenarioId_createdAt_idx" ON "MultiPropertyFinancialScenarioVersion"("ownerAgentSubject", "scenarioId", "createdAt");
CREATE UNIQUE INDEX "MultiPropertyFinancialScenarioProperty_scenarioVersionId_sequence_key" ON "MultiPropertyFinancialScenarioProperty"("scenarioVersionId", "sequence");
CREATE INDEX "MultiPropertyFinancialScenarioProperty_ownerAgentSubject_canonicalPropertyId_idx" ON "MultiPropertyFinancialScenarioProperty"("ownerAgentSubject", "canonicalPropertyId");
CREATE INDEX "MultiPropertyFinancialScenarioProperty_scenarioVersionId_role_idx" ON "MultiPropertyFinancialScenarioProperty"("scenarioVersionId", "role");
CREATE UNIQUE INDEX "MultiPropertyFinancialScenarioResult_scenarioVersionId_key" ON "MultiPropertyFinancialScenarioResult"("scenarioVersionId");
CREATE UNIQUE INDEX "MultiPropertyFinancialScenarioResult_resultFingerprint_key" ON "MultiPropertyFinancialScenarioResult"("resultFingerprint");
CREATE INDEX "MultiPropertyFinancialScenarioResult_ownerAgentSubject_calculatedAt_idx" ON "MultiPropertyFinancialScenarioResult"("ownerAgentSubject", "calculatedAt");
CREATE INDEX "MultiPropertyFinancialScenarioResult_inputFingerprint_idx" ON "MultiPropertyFinancialScenarioResult"("inputFingerprint");
CREATE UNIQUE INDEX "MultiPropertyFinancialScenarioAuditEvent_eventFingerprint_key" ON "MultiPropertyFinancialScenarioAuditEvent"("eventFingerprint");
CREATE INDEX "MultiPropertyFinancialScenarioAuditEvent_scenarioId_createdAt_idx" ON "MultiPropertyFinancialScenarioAuditEvent"("scenarioId", "createdAt");
CREATE INDEX "MultiPropertyFinancialScenarioAuditEvent_ownerAgentSubject_createdAt_idx" ON "MultiPropertyFinancialScenarioAuditEvent"("ownerAgentSubject", "createdAt");
CREATE INDEX "OutputVersion_multiPropertyFinancialScenarioVersionId_idx" ON "OutputVersion"("multiPropertyFinancialScenarioVersionId");

ALTER TABLE "MultiPropertyFinancialScenario" ADD CONSTRAINT "MultiPropertyFinancialScenario_clientCaseId_fkey" FOREIGN KEY ("clientCaseId") REFERENCES "ClientCase"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "MultiPropertyFinancialScenarioVersion" ADD CONSTRAINT "MultiPropertyFinancialScenarioVersion_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "MultiPropertyFinancialScenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "MultiPropertyFinancialScenarioVersion" ADD CONSTRAINT "MultiPropertyFinancialScenarioVersion_supersedesVersionId_fkey" FOREIGN KEY ("supersedesVersionId") REFERENCES "MultiPropertyFinancialScenarioVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "MultiPropertyFinancialScenarioProperty" ADD CONSTRAINT "MultiPropertyFinancialScenarioProperty_scenarioVersionId_fkey" FOREIGN KEY ("scenarioVersionId") REFERENCES "MultiPropertyFinancialScenarioVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "MultiPropertyFinancialScenarioProperty" ADD CONSTRAINT "MultiPropertyFinancialScenarioProperty_canonicalPropertyId_fkey" FOREIGN KEY ("canonicalPropertyId") REFERENCES "CanonicalPhysicalProperty"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "MultiPropertyFinancialScenarioResult" ADD CONSTRAINT "MultiPropertyFinancialScenarioResult_scenarioVersionId_fkey" FOREIGN KEY ("scenarioVersionId") REFERENCES "MultiPropertyFinancialScenarioVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "MultiPropertyFinancialScenarioAuditEvent" ADD CONSTRAINT "MultiPropertyFinancialScenarioAuditEvent_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "MultiPropertyFinancialScenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "MultiPropertyFinancialScenarioAuditEvent" ADD CONSTRAINT "MultiPropertyFinancialScenarioAuditEvent_scenarioVersionId_fkey" FOREIGN KEY ("scenarioVersionId") REFERENCES "MultiPropertyFinancialScenarioVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OutputVersion" ADD CONSTRAINT "OutputVersion_multiPropertyFinancialScenarioVersionId_fkey" FOREIGN KEY ("multiPropertyFinancialScenarioVersionId") REFERENCES "MultiPropertyFinancialScenarioVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
