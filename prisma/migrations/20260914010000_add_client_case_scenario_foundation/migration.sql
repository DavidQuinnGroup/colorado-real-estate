-- Additive Project Atlas canonical Client Case Scenario foundation.
CREATE TYPE "ClientCaseScenarioStatus" AS ENUM ('ACTIVE', 'ARCHIVED');
CREATE TYPE "ClientCaseScenarioValueType" AS ENUM ('MONEY_CENTS', 'PERCENT_BPS', 'INTEGER', 'STRING_SET');
CREATE TYPE "ClientCaseScenarioPropertyDispositionType" AS ENUM ('SELL', 'RETAIN', 'RETAIN_AS_RENTAL');

CREATE TABLE "ClientCaseScenario" (
  "id" TEXT NOT NULL,
  "clientCaseId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "status" "ClientCaseScenarioStatus" NOT NULL DEFAULT 'ACTIVE',
  "archivedAt" TIMESTAMP(3),
  "currentVersionId" TEXT,
  "duplicatedFromScenarioId" TEXT,
  "duplicatedFromScenarioVersionId" TEXT,
  "createdBySubject" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ClientCaseScenario_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ClientCaseScenarioVersion" (
  "id" TEXT NOT NULL,
  "scenarioId" TEXT NOT NULL,
  "versionNumber" INTEGER NOT NULL,
  "createdBySubject" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ClientCaseScenarioVersion_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ClientCaseScenarioAssumption" (
  "id" TEXT NOT NULL,
  "scenarioVersionId" TEXT NOT NULL,
  "semanticKey" TEXT NOT NULL,
  "valueType" "ClientCaseScenarioValueType" NOT NULL,
  "value" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ClientCaseScenarioAssumption_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ClientCaseScenarioCriterion" (
  "id" TEXT NOT NULL,
  "scenarioVersionId" TEXT NOT NULL,
  "semanticKey" TEXT NOT NULL,
  "valueType" "ClientCaseScenarioValueType" NOT NULL,
  "value" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ClientCaseScenarioCriterion_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ClientCaseScenarioPropertyDisposition" (
  "id" TEXT NOT NULL,
  "scenarioVersionId" TEXT NOT NULL,
  "clientCasePropertyId" TEXT NOT NULL,
  "disposition" "ClientCaseScenarioPropertyDispositionType" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ClientCaseScenarioPropertyDisposition_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ClientCaseScenarioObjective" (
  "id" TEXT NOT NULL,
  "scenarioVersionId" TEXT NOT NULL,
  "clientCaseObjectiveId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ClientCaseScenarioObjective_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ClientCaseScenario_currentVersionId_key" ON "ClientCaseScenario"("currentVersionId");
CREATE INDEX "ClientCaseScenario_clientCaseId_status_createdAt_idx" ON "ClientCaseScenario"("clientCaseId", "status", "createdAt");
CREATE INDEX "ClientCaseScenario_duplicatedFromScenarioId_idx" ON "ClientCaseScenario"("duplicatedFromScenarioId");
CREATE INDEX "ClientCaseScenario_duplicatedFromScenarioVersionId_idx" ON "ClientCaseScenario"("duplicatedFromScenarioVersionId");
CREATE UNIQUE INDEX "ClientCaseScenarioVersion_scenarioId_versionNumber_key" ON "ClientCaseScenarioVersion"("scenarioId", "versionNumber");
CREATE INDEX "ClientCaseScenarioVersion_scenarioId_createdAt_idx" ON "ClientCaseScenarioVersion"("scenarioId", "createdAt");
CREATE UNIQUE INDEX "ClientCaseScenarioAssumption_scenarioVersionId_semanticKey_key" ON "ClientCaseScenarioAssumption"("scenarioVersionId", "semanticKey");
CREATE UNIQUE INDEX "ClientCaseScenarioCriterion_scenarioVersionId_semanticKey_key" ON "ClientCaseScenarioCriterion"("scenarioVersionId", "semanticKey");
CREATE UNIQUE INDEX "ClientCaseScenarioPropertyDisposition_scenarioVersionId_clientCasePropertyId_key" ON "ClientCaseScenarioPropertyDisposition"("scenarioVersionId", "clientCasePropertyId");
CREATE INDEX "ClientCaseScenarioPropertyDisposition_clientCasePropertyId_idx" ON "ClientCaseScenarioPropertyDisposition"("clientCasePropertyId");
CREATE UNIQUE INDEX "ClientCaseScenarioObjective_scenarioVersionId_clientCaseObjectiveId_key" ON "ClientCaseScenarioObjective"("scenarioVersionId", "clientCaseObjectiveId");
CREATE INDEX "ClientCaseScenarioObjective_clientCaseObjectiveId_idx" ON "ClientCaseScenarioObjective"("clientCaseObjectiveId");

ALTER TABLE "ClientCaseScenario" ADD CONSTRAINT "ClientCaseScenario_clientCaseId_fkey" FOREIGN KEY ("clientCaseId") REFERENCES "ClientCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseScenario" ADD CONSTRAINT "ClientCaseScenario_currentVersionId_fkey" FOREIGN KEY ("currentVersionId") REFERENCES "ClientCaseScenarioVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseScenario" ADD CONSTRAINT "ClientCaseScenario_duplicatedFromScenarioId_fkey" FOREIGN KEY ("duplicatedFromScenarioId") REFERENCES "ClientCaseScenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseScenario" ADD CONSTRAINT "ClientCaseScenario_duplicatedFromScenarioVersionId_fkey" FOREIGN KEY ("duplicatedFromScenarioVersionId") REFERENCES "ClientCaseScenarioVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseScenarioVersion" ADD CONSTRAINT "ClientCaseScenarioVersion_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "ClientCaseScenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseScenarioAssumption" ADD CONSTRAINT "ClientCaseScenarioAssumption_scenarioVersionId_fkey" FOREIGN KEY ("scenarioVersionId") REFERENCES "ClientCaseScenarioVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseScenarioCriterion" ADD CONSTRAINT "ClientCaseScenarioCriterion_scenarioVersionId_fkey" FOREIGN KEY ("scenarioVersionId") REFERENCES "ClientCaseScenarioVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseScenarioPropertyDisposition" ADD CONSTRAINT "ClientCaseScenarioPropertyDisposition_scenarioVersionId_fkey" FOREIGN KEY ("scenarioVersionId") REFERENCES "ClientCaseScenarioVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseScenarioPropertyDisposition" ADD CONSTRAINT "ClientCaseScenarioPropertyDisposition_clientCasePropertyId_fkey" FOREIGN KEY ("clientCasePropertyId") REFERENCES "ClientCaseProperty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseScenarioObjective" ADD CONSTRAINT "ClientCaseScenarioObjective_scenarioVersionId_fkey" FOREIGN KEY ("scenarioVersionId") REFERENCES "ClientCaseScenarioVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseScenarioObjective" ADD CONSTRAINT "ClientCaseScenarioObjective_clientCaseObjectiveId_fkey" FOREIGN KEY ("clientCaseObjectiveId") REFERENCES "ClientCaseObjective"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
