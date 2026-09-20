-- Financial Position Wave A certified no business rows. Fail closed rather than rewrite any source provenance.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "ClientFinancialSource") THEN
    RAISE EXCEPTION 'ClientFinancialSource rows require separate data reconciliation before governed-source integrity migration.';
  END IF;
END $$;

CREATE TYPE "ClientCaseGovernedSourceKind" AS ENUM ('EVIDENCE', 'PROFESSIONAL_INPUT');

CREATE UNIQUE INDEX "ClientCase_id_ownerAgentSubject_key" ON "ClientCase"("id", "ownerAgentSubject");
CREATE UNIQUE INDEX "EvidenceAdmission_id_ownerAgentSubject_key" ON "EvidenceAdmission"("id", "ownerAgentSubject");
CREATE UNIQUE INDEX "ProfessionalInput_id_ownerAgentSubject_key" ON "ProfessionalInput"("id", "ownerAgentSubject");

CREATE TABLE "ClientCaseGovernedSource" (
  "id" TEXT NOT NULL,
  "clientCaseId" TEXT NOT NULL,
  "ownerAgentSubject" TEXT NOT NULL,
  "sourceKind" "ClientCaseGovernedSourceKind" NOT NULL,
  "evidenceAdmissionId" TEXT,
  "professionalInputId" TEXT,
  "createdBySubject" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ClientCaseGovernedSource_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ClientCaseGovernedSource_clientCaseId_id_key" ON "ClientCaseGovernedSource"("clientCaseId", "id");
CREATE UNIQUE INDEX "ClientCaseGovernedSource_clientCaseId_evidenceAdmissionId_key" ON "ClientCaseGovernedSource"("clientCaseId", "evidenceAdmissionId");
CREATE UNIQUE INDEX "ClientCaseGovernedSource_clientCaseId_professionalInputId_key" ON "ClientCaseGovernedSource"("clientCaseId", "professionalInputId");
CREATE INDEX "ClientCaseGovernedSource_clientCaseId_createdAt_idx" ON "ClientCaseGovernedSource"("clientCaseId", "createdAt");

ALTER TABLE "ClientCaseGovernedSource" ADD CONSTRAINT "ClientCaseGovernedSource_clientCaseId_ownerAgentSubject_fkey" FOREIGN KEY ("clientCaseId", "ownerAgentSubject") REFERENCES "ClientCase"("id", "ownerAgentSubject") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseGovernedSource" ADD CONSTRAINT "ClientCaseGovernedSource_evidenceAdmissionId_ownerAgentSubject_fkey" FOREIGN KEY ("evidenceAdmissionId", "ownerAgentSubject") REFERENCES "EvidenceAdmission"("id", "ownerAgentSubject") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseGovernedSource" ADD CONSTRAINT "ClientCaseGovernedSource_professionalInputId_ownerAgentSubject_fkey" FOREIGN KEY ("professionalInputId", "ownerAgentSubject") REFERENCES "ProfessionalInput"("id", "ownerAgentSubject") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseGovernedSource" ADD CONSTRAINT "ClientCaseGovernedSource_shape_ck" CHECK (
  ("sourceKind" = 'EVIDENCE' AND "evidenceAdmissionId" IS NOT NULL AND "professionalInputId" IS NULL)
  OR ("sourceKind" = 'PROFESSIONAL_INPUT' AND "professionalInputId" IS NOT NULL AND "evidenceAdmissionId" IS NULL)
);

ALTER TABLE "ClientFinancialSource" DROP CONSTRAINT "ClientFinancialSource_shape_ck";
ALTER TABLE "ClientFinancialSource" DROP CONSTRAINT "ClientFinancialSource_evidenceAdmissionId_fkey";
ALTER TABLE "ClientFinancialSource" DROP CONSTRAINT "ClientFinancialSource_professionalInputId_fkey";
DROP INDEX "ClientFinancialSource_evidenceAdmissionId_key";
DROP INDEX "ClientFinancialSource_professionalInputId_key";
ALTER TABLE "ClientFinancialSource" DROP COLUMN "kind";
ALTER TABLE "ClientFinancialSource" DROP COLUMN "evidenceAdmissionId";
ALTER TABLE "ClientFinancialSource" DROP COLUMN "professionalInputId";
ALTER TABLE "ClientFinancialSource" ADD COLUMN "clientCaseGovernedSourceId" TEXT NOT NULL;

CREATE UNIQUE INDEX "ClientFinancialSource_caseSource_key" ON "ClientFinancialSource"("clientCaseId", "clientCaseGovernedSourceId");
ALTER TABLE "ClientFinancialSource" ADD CONSTRAINT "ClientFinancialSource_caseSource_fkey" FOREIGN KEY ("clientCaseId", "clientCaseGovernedSourceId") REFERENCES "ClientCaseGovernedSource"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

DROP TYPE "ClientFinancialSourceKind";
