-- PROJECT ATLAS BUYER_UNDER_CONTRACT_FOUNDATION_V1
-- Additive only. This migration creates no document bytes, email, CRM, MLS, Client Portal,
-- EvidenceAdmission, ProfessionalInput, real-client, or real-transaction records.

CREATE TYPE "TransactionSide" AS ENUM ('BUYER');
CREATE TYPE "TransactionOperationalStage" AS ENUM ('UNDER_CONTRACT', 'INSPECTION_PERIOD', 'TITLE_DUE_DILIGENCE', 'APPRAISAL_FINANCING', 'PRE_CLOSING', 'CLOSED', 'CANCELLED_REPORTED', 'OTHER_REVIEW_REQUIRED');
CREATE TYPE "TransactionContextVerificationStatus" AS ENUM ('REPORTED', 'AGENT_VERIFIED', 'SOURCE_DOCUMENT_VERIFICATION_PENDING', 'CONFLICT_REQUIRES_REVIEW', 'UNKNOWN');
CREATE TYPE "TransactionDeadlineCategory" AS ENUM ('INSPECTION', 'TITLE', 'APPRAISAL', 'FINANCING', 'HOA', 'INSURANCE', 'CLOSING', 'POSSESSION', 'CONTRACTUAL_OTHER', 'BROKERAGE_OPERATIONAL', 'OTHER');
CREATE TYPE "TransactionDeadlineSourceClass" AS ENUM ('AGENT_RECORDED_SYNTHETIC_CONTRACT_FACT', 'AGENT_RECORDED_MANUAL_FACT', 'AGENT_REPORTED_AMENDMENT', 'AGENT_CORRECTION', 'SOURCE_CONFLICT', 'OTHER_REVIEW_REQUIRED');
CREATE TYPE "TransactionDeadlineVerificationStatus" AS ENUM ('RECORDED', 'AGENT_VERIFIED', 'CONFLICT_REQUIRES_REVIEW', 'UNKNOWN');
CREATE TYPE "TransactionDeadlineAttentionState" AS ENUM ('UPCOMING', 'DUE_SOON', 'PAST_DUE_REVIEW_REQUIRED', 'COMPLETED_REPORTED', 'SUPERSEDED', 'CONFLICT_REQUIRES_REVIEW', 'UNKNOWN');
CREATE TYPE "TransactionIssueCategory" AS ENUM ('INSPECTION', 'TITLE', 'APPRAISAL', 'FINANCING', 'INSURANCE', 'HOA_DOCUMENTS', 'PROPERTY_CONDITION', 'PROFESSIONAL_INPUT_DEPENDENCY', 'DEADLINE_DEPENDENCY', 'UNRESOLVED_FACTUAL_QUESTION', 'OTHER');
CREATE TYPE "TransactionIssueAttentionLevel" AS ENUM ('INFORMATIONAL', 'FOLLOW_UP', 'MATERIAL_REVIEW', 'URGENT_AGENT_ATTENTION', 'REVIEW_REQUIRED');
CREATE TYPE "TransactionIssueState" AS ENUM ('OPEN', 'IN_REVIEW', 'AWAITING_PROFESSIONAL_INPUT', 'AWAITING_CLIENT_INPUT', 'RESOLVED_REPORTED', 'SUPERSEDED', 'CLOSED_INFORMATIONAL');
CREATE TYPE "TransactionDecisionProfile" AS ENUM ('REQUEST_ADDITIONAL_INFORMATION', 'REQUEST_PROFESSIONAL_ESTIMATE', 'REQUEST_INSPECTION_OR_QUOTE', 'PREFERRED_SCHEDULING_OPTION', 'PREFERRED_PROVIDER_SELECTION', 'NON_BINDING_PRIORITY', 'ACKNOWLEDGED_AGENT_REVIEWED_INFORMATION', 'OTHER_LOW_RISK_REVIEW_REQUIRED');
CREATE TYPE "TransactionDecisionSourceMethod" AS ENUM ('AGENT_RECORDED_VERBAL', 'AGENT_RECORDED_EMAIL', 'AGENT_RECORDED_TEXT', 'AGENT_RECORDED_MEETING', 'AGENT_RECORDED_OTHER', 'SYSTEM_RECORDED_AGENT_ACTION');
CREATE TYPE "TransactionTimelineEventType" AS ENUM ('TRANSACTION_CREATED', 'STAGE_REPORTED', 'DEADLINE_RECORDED', 'DEADLINE_VERIFIED', 'DEADLINE_SUPERSEDED', 'ISSUE_CREATED', 'ISSUE_STATE_RECORDED', 'DECISION_RECORDED', 'DECISION_SUPERSEDED', 'OUTPUT_REVIEWED', 'COMPLIANCE_CHECKPOINT_RECORDED');

CREATE TABLE "Transaction" (
  "id" TEXT NOT NULL,
  "ownerAgentSubject" TEXT NOT NULL,
  "canonicalPropertyId" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "side" "TransactionSide" NOT NULL,
  "stage" "TransactionOperationalStage" NOT NULL,
  "clientContextLabel" TEXT,
  "clientContextStatus" TEXT NOT NULL DEFAULT 'SYNTHETIC_OR_REVIEW_REQUIRED',
  "mutualExecutionAt" TIMESTAMP(3),
  "executionVerificationStatus" "TransactionContextVerificationStatus" NOT NULL DEFAULT 'UNKNOWN',
  "contractProfileReference" TEXT,
  "sourceReference" TEXT,
  "limitations" TEXT,
  "archivePolicyVersion" TEXT NOT NULL DEFAULT 'DQG_TRANSACTION_ARCHIVE_POLICY_V1',
  "idempotencyKey" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TransactionDeadline" (
  "id" TEXT NOT NULL,
  "transactionId" TEXT NOT NULL,
  "category" "TransactionDeadlineCategory" NOT NULL,
  "label" TEXT NOT NULL,
  "dueAt" TIMESTAMP(3) NOT NULL,
  "timezone" TEXT NOT NULL,
  "sourceClass" "TransactionDeadlineSourceClass" NOT NULL,
  "sourceReference" TEXT,
  "verificationStatus" "TransactionDeadlineVerificationStatus" NOT NULL DEFAULT 'RECORDED',
  "attentionState" "TransactionDeadlineAttentionState" NOT NULL DEFAULT 'UPCOMING',
  "recordedBySubject" TEXT NOT NULL,
  "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "verifiedBySubject" TEXT,
  "verifiedAt" TIMESTAMP(3),
  "notes" TEXT,
  "successorReason" TEXT,
  "supersedesDeadlineId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TransactionDeadline_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TransactionIssue" (
  "id" TEXT NOT NULL,
  "transactionId" TEXT NOT NULL,
  "category" "TransactionIssueCategory" NOT NULL,
  "title" TEXT NOT NULL,
  "factualSummary" TEXT NOT NULL,
  "sourceClass" TEXT NOT NULL,
  "sourceReference" TEXT,
  "attentionLevel" "TransactionIssueAttentionLevel" NOT NULL,
  "state" "TransactionIssueState" NOT NULL DEFAULT 'OPEN',
  "relatedDeadlineId" TEXT,
  "professionalInputResponseId" TEXT,
  "evidenceCandidateId" TEXT,
  "evidenceAdmissionId" TEXT,
  "outputVersionId" TEXT,
  "agentNotes" TEXT,
  "createdBySubject" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "resolvedBySubject" TEXT,
  "resolvedAt" TIMESTAMP(3),
  "supersedesIssueId" TEXT,
  CONSTRAINT "TransactionIssue_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TransactionDecision" (
  "id" TEXT NOT NULL,
  "transactionId" TEXT NOT NULL,
  "profile" "TransactionDecisionProfile" NOT NULL,
  "description" TEXT NOT NULL,
  "sourceMethod" "TransactionDecisionSourceMethod" NOT NULL,
  "clientContextLabel" TEXT,
  "occurredAt" TIMESTAMP(3),
  "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "recordedBySubject" TEXT NOT NULL,
  "provenance" JSONB NOT NULL,
  "limitations" TEXT NOT NULL,
  "relatedIssueId" TEXT,
  "relatedDeadlineId" TEXT,
  "professionalInputResponseId" TEXT,
  "evidenceAdmissionId" TEXT,
  "policyClassification" TEXT NOT NULL,
  "idempotencyKey" TEXT NOT NULL,
  "supersedesDecisionId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TransactionDecision_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TransactionTimelineEvent" (
  "id" TEXT NOT NULL,
  "transactionId" TEXT NOT NULL,
  "eventType" "TransactionTimelineEventType" NOT NULL,
  "objectReference" TEXT NOT NULL,
  "actorSubject" TEXT NOT NULL,
  "sourceType" TEXT NOT NULL,
  "occurredAt" TIMESTAMP(3),
  "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "payload" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TransactionTimelineEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Transaction_idempotencyKey_key" ON "Transaction"("idempotencyKey");
CREATE INDEX "Transaction_ownerAgentSubject_createdAt_idx" ON "Transaction"("ownerAgentSubject", "createdAt");
CREATE INDEX "Transaction_ownerAgentSubject_stage_idx" ON "Transaction"("ownerAgentSubject", "stage");
CREATE INDEX "Transaction_canonicalPropertyId_idx" ON "Transaction"("canonicalPropertyId");
CREATE UNIQUE INDEX "TransactionDeadline_supersedesDeadlineId_key" ON "TransactionDeadline"("supersedesDeadlineId");
CREATE INDEX "TransactionDeadline_transactionId_dueAt_idx" ON "TransactionDeadline"("transactionId", "dueAt");
CREATE INDEX "TransactionDeadline_transactionId_attentionState_idx" ON "TransactionDeadline"("transactionId", "attentionState");
CREATE UNIQUE INDEX "TransactionIssue_supersedesIssueId_key" ON "TransactionIssue"("supersedesIssueId");
CREATE INDEX "TransactionIssue_transactionId_state_createdAt_idx" ON "TransactionIssue"("transactionId", "state", "createdAt");
CREATE INDEX "TransactionIssue_transactionId_attentionLevel_idx" ON "TransactionIssue"("transactionId", "attentionLevel");
CREATE UNIQUE INDEX "TransactionDecision_idempotencyKey_key" ON "TransactionDecision"("idempotencyKey");
CREATE UNIQUE INDEX "TransactionDecision_supersedesDecisionId_key" ON "TransactionDecision"("supersedesDecisionId");
CREATE INDEX "TransactionDecision_transactionId_recordedAt_idx" ON "TransactionDecision"("transactionId", "recordedAt");
CREATE INDEX "TransactionDecision_transactionId_profile_idx" ON "TransactionDecision"("transactionId", "profile");
CREATE INDEX "TransactionTimelineEvent_transactionId_recordedAt_idx" ON "TransactionTimelineEvent"("transactionId", "recordedAt");
CREATE INDEX "TransactionTimelineEvent_transactionId_eventType_idx" ON "TransactionTimelineEvent"("transactionId", "eventType");

ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_canonicalPropertyId_fkey" FOREIGN KEY ("canonicalPropertyId") REFERENCES "CanonicalPhysicalProperty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TransactionDeadline" ADD CONSTRAINT "TransactionDeadline_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TransactionDeadline" ADD CONSTRAINT "TransactionDeadline_supersedesDeadlineId_fkey" FOREIGN KEY ("supersedesDeadlineId") REFERENCES "TransactionDeadline"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TransactionIssue" ADD CONSTRAINT "TransactionIssue_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TransactionIssue" ADD CONSTRAINT "TransactionIssue_relatedDeadlineId_fkey" FOREIGN KEY ("relatedDeadlineId") REFERENCES "TransactionDeadline"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TransactionIssue" ADD CONSTRAINT "TransactionIssue_professionalInputResponseId_fkey" FOREIGN KEY ("professionalInputResponseId") REFERENCES "ProfessionalInputResponse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TransactionIssue" ADD CONSTRAINT "TransactionIssue_evidenceCandidateId_fkey" FOREIGN KEY ("evidenceCandidateId") REFERENCES "EvidenceCandidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TransactionIssue" ADD CONSTRAINT "TransactionIssue_evidenceAdmissionId_fkey" FOREIGN KEY ("evidenceAdmissionId") REFERENCES "EvidenceAdmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TransactionIssue" ADD CONSTRAINT "TransactionIssue_outputVersionId_fkey" FOREIGN KEY ("outputVersionId") REFERENCES "OutputVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TransactionIssue" ADD CONSTRAINT "TransactionIssue_supersedesIssueId_fkey" FOREIGN KEY ("supersedesIssueId") REFERENCES "TransactionIssue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TransactionDecision" ADD CONSTRAINT "TransactionDecision_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TransactionDecision" ADD CONSTRAINT "TransactionDecision_relatedIssueId_fkey" FOREIGN KEY ("relatedIssueId") REFERENCES "TransactionIssue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TransactionDecision" ADD CONSTRAINT "TransactionDecision_relatedDeadlineId_fkey" FOREIGN KEY ("relatedDeadlineId") REFERENCES "TransactionDeadline"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TransactionDecision" ADD CONSTRAINT "TransactionDecision_supersedesDecisionId_fkey" FOREIGN KEY ("supersedesDecisionId") REFERENCES "TransactionDecision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "TransactionTimelineEvent" ADD CONSTRAINT "TransactionTimelineEvent_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE FUNCTION "preventTransactionTimelineEventMutation"() RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'PROJECT ATLAS transaction timeline events are append-only';
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION "preventTransactionDecisionMutation"() RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'PROJECT ATLAS transaction decisions are append-only';
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION "preventTransactionDeadlineMaterialMutation"() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' OR OLD."category" IS DISTINCT FROM NEW."category" OR OLD."label" IS DISTINCT FROM NEW."label" OR OLD."dueAt" IS DISTINCT FROM NEW."dueAt" OR OLD."timezone" IS DISTINCT FROM NEW."timezone" OR OLD."sourceClass" IS DISTINCT FROM NEW."sourceClass" OR OLD."sourceReference" IS DISTINCT FROM NEW."sourceReference" OR OLD."verificationStatus" IS DISTINCT FROM NEW."verificationStatus" OR OLD."recordedBySubject" IS DISTINCT FROM NEW."recordedBySubject" OR OLD."verifiedBySubject" IS DISTINCT FROM NEW."verifiedBySubject" OR OLD."verifiedAt" IS DISTINCT FROM NEW."verifiedAt" OR OLD."notes" IS DISTINCT FROM NEW."notes" OR OLD."successorReason" IS DISTINCT FROM NEW."successorReason" OR OLD."supersedesDeadlineId" IS DISTINCT FROM NEW."supersedesDeadlineId" THEN
    RAISE EXCEPTION 'PROJECT ATLAS transaction deadline facts require a successor record';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "TransactionTimelineEvent_append_only" BEFORE UPDATE OR DELETE ON "TransactionTimelineEvent" FOR EACH ROW EXECUTE FUNCTION "preventTransactionTimelineEventMutation"();
CREATE TRIGGER "TransactionDecision_append_only" BEFORE UPDATE OR DELETE ON "TransactionDecision" FOR EACH ROW EXECUTE FUNCTION "preventTransactionDecisionMutation"();
CREATE TRIGGER "TransactionDeadline_material_facts_immutable" BEFORE UPDATE OR DELETE ON "TransactionDeadline" FOR EACH ROW EXECUTE FUNCTION "preventTransactionDeadlineMaterialMutation"();
