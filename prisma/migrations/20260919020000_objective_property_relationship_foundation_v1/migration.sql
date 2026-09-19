-- CreateEnum
CREATE TYPE "ClientCaseObjectivePropertyRelationshipRole" AS ENUM ('SUBJECT', 'CANDIDATE');

-- CreateEnum
CREATE TYPE "ClientCaseObjectivePropertyRelationshipStatus" AS ENUM ('ACTIVE', 'ENDED');

-- CreateTable
CREATE TABLE "ClientCaseObjectivePropertyRelationship" (
    "id" TEXT NOT NULL,
    "clientCaseId" TEXT NOT NULL,
    "objectiveId" TEXT NOT NULL,
    "clientCasePropertyId" TEXT NOT NULL,
    "role" "ClientCaseObjectivePropertyRelationshipRole" NOT NULL,
    "status" "ClientCaseObjectivePropertyRelationshipStatus" NOT NULL DEFAULT 'ACTIVE',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "createdBySubject" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientCaseObjectivePropertyRelationship_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CCOPR_case_status_idx" ON "ClientCaseObjectivePropertyRelationship"("clientCaseId", "status");

-- CreateIndex
CREATE INDEX "CCOPR_objective_status_idx" ON "ClientCaseObjectivePropertyRelationship"("objectiveId", "status");

-- CreateIndex
CREATE INDEX "CCOPR_property_status_idx" ON "ClientCaseObjectivePropertyRelationship"("clientCasePropertyId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ClientCaseObjective_clientCaseId_id_key" ON "ClientCaseObjective"("clientCaseId", "id");

-- CreateIndex
CREATE UNIQUE INDEX "ClientCaseProperty_clientCaseId_id_key" ON "ClientCaseProperty"("clientCaseId", "id");

-- AddForeignKey
ALTER TABLE "ClientCaseObjectivePropertyRelationship" ADD CONSTRAINT "ClientCaseObjectivePropertyRelationship_clientCaseId_fkey" FOREIGN KEY ("clientCaseId") REFERENCES "ClientCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientCaseObjectivePropertyRelationship" ADD CONSTRAINT "ClientCaseObjectivePropertyRelationship_clientCaseId_objec_fkey" FOREIGN KEY ("clientCaseId", "objectiveId") REFERENCES "ClientCaseObjective"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientCaseObjectivePropertyRelationship" ADD CONSTRAINT "ClientCaseObjectivePropertyRelationship_clientCaseId_clien_fkey" FOREIGN KEY ("clientCaseId", "clientCasePropertyId") REFERENCES "ClientCaseProperty"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Prisma 5.22 cannot represent partial indexes or lifecycle checks in the datamodel.
CREATE UNIQUE INDEX "CCOPR_active_objective_property_uq"
  ON "ClientCaseObjectivePropertyRelationship"("objectiveId", "clientCasePropertyId")
  WHERE "status" = 'ACTIVE';

ALTER TABLE "ClientCaseObjectivePropertyRelationship"
  ADD CONSTRAINT "CCOPR_status_ended_at_ck"
  CHECK (
    ("status" = 'ACTIVE' AND "endedAt" IS NULL)
    OR ("status" = 'ENDED' AND "endedAt" IS NOT NULL)
  );
