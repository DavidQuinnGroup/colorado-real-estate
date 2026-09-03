-- PROJECT ATLAS CANONICAL_CLIENT_CASE_CONTEXT_FOUNDATION_V1
-- Additive owner-scoped client/advisory context. No historical backfill or downstream mutation.

CREATE TYPE "ClientCaseStatus" AS ENUM ('ACTIVE', 'ARCHIVED');
CREATE TYPE "ClientCasePartyRole" AS ENUM ('PRIMARY_CLIENT', 'ADDITIONAL_CLIENT', 'OTHER_PARTY');
CREATE TYPE "ClientCasePropertyRole" AS ENUM ('CURRENT_HOME', 'NEW_PRIMARY', 'INVESTMENT_PROPERTY', 'SALE_PROPERTY', 'OTHER');

CREATE TABLE "ClientCase" (
  "id" TEXT NOT NULL,
  "ownerAgentSubject" TEXT NOT NULL,
  "displayName" TEXT NOT NULL,
  "status" "ClientCaseStatus" NOT NULL DEFAULT 'ACTIVE',
  "archivedAt" TIMESTAMP(3),
  "createdBySubject" TEXT NOT NULL,
  "idempotencyKey" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ClientCase_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ClientCaseParty" (
  "id" TEXT NOT NULL,
  "clientCaseId" TEXT NOT NULL,
  "role" "ClientCasePartyRole" NOT NULL,
  "displayLabel" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ClientCaseParty_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ClientCaseProperty" (
  "id" TEXT NOT NULL,
  "clientCaseId" TEXT NOT NULL,
  "canonicalPropertyId" TEXT NOT NULL,
  "role" "ClientCasePropertyRole" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ClientCaseProperty_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Transaction" ADD COLUMN "clientCaseId" TEXT;

CREATE UNIQUE INDEX "ClientCase_idempotencyKey_key" ON "ClientCase"("idempotencyKey");
CREATE INDEX "ClientCase_ownerAgentSubject_status_updatedAt_idx" ON "ClientCase"("ownerAgentSubject", "status", "updatedAt");
CREATE INDEX "ClientCase_ownerAgentSubject_createdAt_idx" ON "ClientCase"("ownerAgentSubject", "createdAt");
CREATE INDEX "ClientCaseParty_clientCaseId_role_idx" ON "ClientCaseParty"("clientCaseId", "role");
CREATE UNIQUE INDEX "ClientCaseProperty_clientCaseId_canonicalPropertyId_key" ON "ClientCaseProperty"("clientCaseId", "canonicalPropertyId");
CREATE INDEX "ClientCaseProperty_canonicalPropertyId_idx" ON "ClientCaseProperty"("canonicalPropertyId");
CREATE INDEX "Transaction_clientCaseId_idx" ON "Transaction"("clientCaseId");

ALTER TABLE "ClientCaseParty" ADD CONSTRAINT "ClientCaseParty_clientCaseId_fkey" FOREIGN KEY ("clientCaseId") REFERENCES "ClientCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseProperty" ADD CONSTRAINT "ClientCaseProperty_clientCaseId_fkey" FOREIGN KEY ("clientCaseId") REFERENCES "ClientCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseProperty" ADD CONSTRAINT "ClientCaseProperty_canonicalPropertyId_fkey" FOREIGN KEY ("canonicalPropertyId") REFERENCES "CanonicalPhysicalProperty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_clientCaseId_fkey" FOREIGN KEY ("clientCaseId") REFERENCES "ClientCase"("id") ON DELETE SET NULL ON UPDATE CASCADE;
