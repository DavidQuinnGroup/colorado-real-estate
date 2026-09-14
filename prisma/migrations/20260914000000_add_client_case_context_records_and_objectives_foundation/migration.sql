-- Additive Project Atlas Client Case context records and objectives foundation.
CREATE TYPE "ClientCaseObjectiveType" AS ENUM ('BUY_PRIMARY_HOME', 'SELL_CURRENT_HOME', 'INVESTMENT_ACQUISITION', 'FINANCIAL_STRATEGY');
CREATE TYPE "ClientCaseObjectiveStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ARCHIVED');
CREATE TYPE "ClientCaseContextScope" AS ENUM ('CASE', 'OBJECTIVE', 'PROPERTY');
CREATE TYPE "ClientCaseContextSourcePosture" AS ENUM ('CLIENT_STATED', 'AGENT_ENTERED', 'EVIDENCE_SUPPORTED', 'PROFESSIONAL_INPUT_SUPPORTED', 'SYSTEM_DERIVED');

CREATE TABLE "ClientCaseObjective" (
  "id" TEXT NOT NULL,
  "clientCaseId" TEXT NOT NULL,
  "objectiveType" "ClientCaseObjectiveType" NOT NULL,
  "status" "ClientCaseObjectiveStatus" NOT NULL DEFAULT 'ACTIVE',
  "title" TEXT NOT NULL,
  "createdBySubject" TEXT NOT NULL,
  "completedAt" TIMESTAMP(3),
  "archivedAt" TIMESTAMP(3),
  "idempotencyKey" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ClientCaseObjective_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ClientCaseFact" (
  "id" TEXT NOT NULL,
  "clientCaseId" TEXT NOT NULL,
  "objectiveId" TEXT,
  "clientCasePropertyId" TEXT,
  "semanticKey" TEXT NOT NULL,
  "scope" "ClientCaseContextScope" NOT NULL,
  "scopeReference" TEXT NOT NULL,
  "value" JSONB NOT NULL,
  "sourcePosture" "ClientCaseContextSourcePosture" NOT NULL,
  "evidenceAdmissionId" TEXT,
  "professionalInputId" TEXT,
  "recordedBySubject" TEXT NOT NULL,
  "observedAt" TIMESTAMP(3),
  "effectiveAt" TIMESTAMP(3),
  "reviewAfter" TIMESTAMP(3),
  "limitation" TEXT,
  "supersedesFactId" TEXT,
  "supersededAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ClientCaseFact_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ClientCaseCriterion" (
  "id" TEXT NOT NULL,
  "clientCaseId" TEXT NOT NULL,
  "objectiveId" TEXT,
  "clientCasePropertyId" TEXT,
  "semanticKey" TEXT NOT NULL,
  "scope" "ClientCaseContextScope" NOT NULL,
  "scopeReference" TEXT NOT NULL,
  "value" JSONB NOT NULL,
  "sourcePosture" "ClientCaseContextSourcePosture" NOT NULL,
  "evidenceAdmissionId" TEXT,
  "professionalInputId" TEXT,
  "recordedBySubject" TEXT NOT NULL,
  "observedAt" TIMESTAMP(3),
  "effectiveAt" TIMESTAMP(3),
  "reviewAfter" TIMESTAMP(3),
  "limitation" TEXT,
  "supersedesCriterionId" TEXT,
  "supersededAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ClientCaseCriterion_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ClientCaseObjective_idempotencyKey_key" ON "ClientCaseObjective"("idempotencyKey");
CREATE INDEX "ClientCaseObjective_clientCaseId_status_createdAt_idx" ON "ClientCaseObjective"("clientCaseId", "status", "createdAt");
CREATE INDEX "ClientCaseObjective_clientCaseId_objectiveType_status_idx" ON "ClientCaseObjective"("clientCaseId", "objectiveType", "status");

CREATE UNIQUE INDEX "ClientCaseFact_supersedesFactId_key" ON "ClientCaseFact"("supersedesFactId");
CREATE UNIQUE INDEX "ClientCaseFact_current_scope_key" ON "ClientCaseFact"("clientCaseId", "semanticKey", "scopeReference") WHERE "supersededAt" IS NULL;
CREATE INDEX "ClientCaseFact_clientCaseId_semanticKey_scopeReference_createdAt_idx" ON "ClientCaseFact"("clientCaseId", "semanticKey", "scopeReference", "createdAt");
CREATE INDEX "ClientCaseFact_objectiveId_semanticKey_createdAt_idx" ON "ClientCaseFact"("objectiveId", "semanticKey", "createdAt");
CREATE INDEX "ClientCaseFact_clientCasePropertyId_semanticKey_createdAt_idx" ON "ClientCaseFact"("clientCasePropertyId", "semanticKey", "createdAt");
CREATE INDEX "ClientCaseFact_evidenceAdmissionId_idx" ON "ClientCaseFact"("evidenceAdmissionId");
CREATE INDEX "ClientCaseFact_professionalInputId_idx" ON "ClientCaseFact"("professionalInputId");

CREATE UNIQUE INDEX "ClientCaseCriterion_supersedesCriterionId_key" ON "ClientCaseCriterion"("supersedesCriterionId");
CREATE UNIQUE INDEX "ClientCaseCriterion_current_scope_key" ON "ClientCaseCriterion"("clientCaseId", "semanticKey", "scopeReference") WHERE "supersededAt" IS NULL;
CREATE INDEX "ClientCaseCriterion_clientCaseId_semanticKey_scopeReference_createdAt_idx" ON "ClientCaseCriterion"("clientCaseId", "semanticKey", "scopeReference", "createdAt");
CREATE INDEX "ClientCaseCriterion_objectiveId_semanticKey_createdAt_idx" ON "ClientCaseCriterion"("objectiveId", "semanticKey", "createdAt");
CREATE INDEX "ClientCaseCriterion_clientCasePropertyId_semanticKey_createdAt_idx" ON "ClientCaseCriterion"("clientCasePropertyId", "semanticKey", "createdAt");
CREATE INDEX "ClientCaseCriterion_evidenceAdmissionId_idx" ON "ClientCaseCriterion"("evidenceAdmissionId");
CREATE INDEX "ClientCaseCriterion_professionalInputId_idx" ON "ClientCaseCriterion"("professionalInputId");

ALTER TABLE "ClientCaseObjective" ADD CONSTRAINT "ClientCaseObjective_clientCaseId_fkey" FOREIGN KEY ("clientCaseId") REFERENCES "ClientCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ClientCaseFact" ADD CONSTRAINT "ClientCaseFact_clientCaseId_fkey" FOREIGN KEY ("clientCaseId") REFERENCES "ClientCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseFact" ADD CONSTRAINT "ClientCaseFact_objectiveId_fkey" FOREIGN KEY ("objectiveId") REFERENCES "ClientCaseObjective"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseFact" ADD CONSTRAINT "ClientCaseFact_clientCasePropertyId_fkey" FOREIGN KEY ("clientCasePropertyId") REFERENCES "ClientCaseProperty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseFact" ADD CONSTRAINT "ClientCaseFact_evidenceAdmissionId_fkey" FOREIGN KEY ("evidenceAdmissionId") REFERENCES "EvidenceAdmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseFact" ADD CONSTRAINT "ClientCaseFact_professionalInputId_fkey" FOREIGN KEY ("professionalInputId") REFERENCES "ProfessionalInput"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseFact" ADD CONSTRAINT "ClientCaseFact_supersedesFactId_fkey" FOREIGN KEY ("supersedesFactId") REFERENCES "ClientCaseFact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ClientCaseCriterion" ADD CONSTRAINT "ClientCaseCriterion_clientCaseId_fkey" FOREIGN KEY ("clientCaseId") REFERENCES "ClientCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseCriterion" ADD CONSTRAINT "ClientCaseCriterion_objectiveId_fkey" FOREIGN KEY ("objectiveId") REFERENCES "ClientCaseObjective"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseCriterion" ADD CONSTRAINT "ClientCaseCriterion_clientCasePropertyId_fkey" FOREIGN KEY ("clientCasePropertyId") REFERENCES "ClientCaseProperty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseCriterion" ADD CONSTRAINT "ClientCaseCriterion_evidenceAdmissionId_fkey" FOREIGN KEY ("evidenceAdmissionId") REFERENCES "EvidenceAdmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseCriterion" ADD CONSTRAINT "ClientCaseCriterion_professionalInputId_fkey" FOREIGN KEY ("professionalInputId") REFERENCES "ProfessionalInput"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseCriterion" ADD CONSTRAINT "ClientCaseCriterion_supersedesCriterionId_fkey" FOREIGN KEY ("supersedesCriterionId") REFERENCES "ClientCaseCriterion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
