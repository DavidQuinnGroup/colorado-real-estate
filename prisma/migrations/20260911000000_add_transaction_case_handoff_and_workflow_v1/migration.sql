-- PROJECT ATLAS TRANSACTION_CASE_HANDOFF_AND_WORKFLOW_V1
-- Additive transaction lifecycle, Case-party provenance, and controlled buyer Property TBD support.
-- No backfill, deletion, or replacement of existing Transaction records.

CREATE TYPE "TransactionLifecycleStatus" AS ENUM ('DRAFT', 'ACTIVE', 'CLOSED', 'CANCELLED');
CREATE TYPE "TransactionPartyRole" AS ENUM ('BUYER', 'SELLER', 'AUTHORIZED_REPRESENTATIVE');

ALTER TYPE "TransactionSide" ADD VALUE IF NOT EXISTS 'SELLER';
ALTER TYPE "TransactionOperationalStage" ADD VALUE IF NOT EXISTS 'PREPARATION';
ALTER TYPE "TransactionTimelineEventType" ADD VALUE IF NOT EXISTS 'TRANSACTION_STATUS_CHANGED';
ALTER TYPE "TransactionTimelineEventType" ADD VALUE IF NOT EXISTS 'PROPERTY_ASSOCIATED';
ALTER TYPE "TransactionTimelineEventType" ADD VALUE IF NOT EXISTS 'PARTY_ATTACHED';

ALTER TABLE "Transaction" ADD COLUMN "status" "TransactionLifecycleStatus" NOT NULL DEFAULT 'ACTIVE';
ALTER TABLE "Transaction" ADD COLUMN "closedAt" TIMESTAMP(3);
ALTER TABLE "Transaction" ADD COLUMN "cancelledAt" TIMESTAMP(3);
ALTER TABLE "Transaction" ALTER COLUMN "canonicalPropertyId" DROP NOT NULL;

CREATE TABLE "TransactionParty" (
  "id" TEXT NOT NULL,
  "transactionId" TEXT NOT NULL,
  "clientCasePartyId" TEXT NOT NULL,
  "role" "TransactionPartyRole" NOT NULL,
  "displayLabelSnapshot" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TransactionParty_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TransactionParty_transactionId_clientCasePartyId_key" ON "TransactionParty"("transactionId", "clientCasePartyId");
CREATE INDEX "TransactionParty_clientCasePartyId_idx" ON "TransactionParty"("clientCasePartyId");
CREATE INDEX "Transaction_ownerAgentSubject_status_idx" ON "Transaction"("ownerAgentSubject", "status");

ALTER TABLE "TransactionParty" ADD CONSTRAINT "TransactionParty_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TransactionParty" ADD CONSTRAINT "TransactionParty_clientCasePartyId_fkey" FOREIGN KEY ("clientCasePartyId") REFERENCES "ClientCaseParty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
