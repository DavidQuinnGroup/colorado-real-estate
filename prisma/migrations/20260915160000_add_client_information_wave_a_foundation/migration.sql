-- PROJECT ATLAS CLIENT_INFORMATION_WAVE_A_FOUNDATION_V1
-- Additive Contact identity, Contact methods, Client Case participation evolution,
-- and composable advisory roles. Existing ClientCaseParty rows are preserved and
-- receive one generated Contact each. No email, phone, advisory role, objective,
-- property, transaction, authorization, evidence, or professional-input data is invented.

CREATE TYPE "ContactEntityType" AS ENUM ('PERSON', 'ORGANIZATION');
CREATE TYPE "ContactLifecycleStatus" AS ENUM ('ACTIVE', 'INACTIVE');
CREATE TYPE "ContactMethodKind" AS ENUM ('EMAIL', 'PHONE');
CREATE TYPE "ClientCaseParticipationStatus" AS ENUM ('ACTIVE', 'ENDED');
CREATE TYPE "ClientCaseAdvisoryRole" AS ENUM ('BUYER', 'SELLER', 'INVESTOR', 'AUTHORIZED_PARTICIPANT', 'CO_PARTICIPANT');

CREATE TABLE "Contact" (
  "id" TEXT NOT NULL,
  "ownerAgentSubject" TEXT NOT NULL,
  "displayName" TEXT NOT NULL,
  "givenName" TEXT,
  "familyName" TEXT,
  "entityType" "ContactEntityType" NOT NULL DEFAULT 'PERSON',
  "lifecycleStatus" "ContactLifecycleStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdBySubject" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ContactMethod" (
  "id" TEXT NOT NULL,
  "contactId" TEXT NOT NULL,
  "kind" "ContactMethodKind" NOT NULL,
  "displayValue" TEXT NOT NULL,
  "normalizedValue" TEXT NOT NULL,
  "isPrimary" BOOLEAN NOT NULL DEFAULT false,
  "lifecycleStatus" "ContactLifecycleStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ContactMethod_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ClientCasePartyAdvisoryRole" (
  "id" TEXT NOT NULL,
  "clientCasePartyId" TEXT NOT NULL,
  "role" "ClientCaseAdvisoryRole" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ClientCasePartyAdvisoryRole_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "ClientCaseParty"
  ADD COLUMN "contactId" TEXT,
  ADD COLUMN "participationStatus" "ClientCaseParticipationStatus" NOT NULL DEFAULT 'ACTIVE',
  ADD COLUMN "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "endedAt" TIMESTAMP(3);

INSERT INTO "Contact" (
  "id",
  "ownerAgentSubject",
  "displayName",
  "givenName",
  "familyName",
  "entityType",
  "lifecycleStatus",
  "createdBySubject",
  "createdAt",
  "updatedAt"
)
SELECT
  'contact_' || party."id",
  client_case."ownerAgentSubject",
  party."displayLabel",
  NULL,
  NULL,
  'PERSON'::"ContactEntityType",
  'ACTIVE'::"ContactLifecycleStatus",
  client_case."createdBySubject",
  party."createdAt",
  party."updatedAt"
FROM "ClientCaseParty" party
JOIN "ClientCase" client_case ON client_case."id" = party."clientCaseId"
WHERE party."contactId" IS NULL;

UPDATE "ClientCaseParty"
SET "contactId" = 'contact_' || "id"
WHERE "contactId" IS NULL;

CREATE INDEX "Contact_ownerAgentSubject_lifecycleStatus_updatedAt_idx" ON "Contact"("ownerAgentSubject", "lifecycleStatus", "updatedAt");
CREATE INDEX "Contact_ownerAgentSubject_displayName_idx" ON "Contact"("ownerAgentSubject", "displayName");
CREATE INDEX "ContactMethod_contactId_kind_lifecycleStatus_idx" ON "ContactMethod"("contactId", "kind", "lifecycleStatus");
CREATE INDEX "ContactMethod_kind_normalizedValue_idx" ON "ContactMethod"("kind", "normalizedValue");
CREATE INDEX "ClientCaseParty_clientCaseId_role_participationStatus_idx" ON "ClientCaseParty"("clientCaseId", "role", "participationStatus");
CREATE INDEX "ClientCaseParty_contactId_idx" ON "ClientCaseParty"("contactId");
CREATE UNIQUE INDEX "ClientCasePartyAdvisoryRole_clientCasePartyId_role_key" ON "ClientCasePartyAdvisoryRole"("clientCasePartyId", "role");
CREATE INDEX "ClientCasePartyAdvisoryRole_role_idx" ON "ClientCasePartyAdvisoryRole"("role");

ALTER TABLE "ContactMethod" ADD CONSTRAINT "ContactMethod_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseParty" ADD CONSTRAINT "ClientCaseParty_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCasePartyAdvisoryRole" ADD CONSTRAINT "ClientCasePartyAdvisoryRole_clientCasePartyId_fkey" FOREIGN KEY ("clientCasePartyId") REFERENCES "ClientCaseParty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
