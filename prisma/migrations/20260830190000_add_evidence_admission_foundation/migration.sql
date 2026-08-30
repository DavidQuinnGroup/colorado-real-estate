-- PROJECT ATLAS EVIDENCE_ADMISSION_FOUNDATION_V1
-- Additive only. The migration creates no evidence, admission, or professional-input records.

CREATE TYPE "EvidenceSourceKind" AS ENUM ('TRUSTED_INTERNAL_DETERMINISTIC', 'PROFESSIONAL_REPORTED', 'PROFESSIONAL_DOCUMENT', 'OTHER_REVIEW_REQUIRED');
CREATE TYPE "EvidenceCandidateStatus" AS ENUM ('PENDING_REVIEW', 'ADMITTED', 'REJECTED');
CREATE TYPE "EvidenceClaimKind" AS ENUM ('LENDER_RATE', 'LENDER_TERM', 'PAYOFF_AMOUNT', 'INSURANCE_PREMIUM', 'INSURANCE_COVERAGE', 'PROPERTY_MANAGER_RENT', 'TAX_AMOUNT', 'TAX_ASSESSMENT', 'INSPECTION_OBSERVATION', 'HOA_INFORMATION', 'TITLE_INFORMATION');
CREATE TYPE "EvidenceVerificationStatus" AS ENUM ('UNVERIFIED', 'SOURCE_ROLE_CLAIMED', 'SOURCE_ROLE_VERIFIED', 'VERIFICATION_LIMITED', 'VERIFICATION_FAILED');
CREATE TYPE "EvidenceAdmissionPolicy" AS ENUM ('TRUSTED_INTERNAL_DETERMINISTIC_AUTO_ADMISSION', 'AGENT_REVIEWED_PROFESSIONAL_INPUT', 'AGENT_REVIEWED_MANUAL_EVIDENCE', 'FUTURE_DOCUMENT_VERIFIED_ADMISSION');
CREATE TYPE "EvidenceAdmissionAuditEventType" AS ENUM ('CANDIDATE_CREATED', 'CANDIDATE_REVIEWED', 'CANDIDATE_ADMITTED', 'CANDIDATE_REJECTED', 'ADMISSION_SUPERSEDED');

CREATE TABLE "EvidenceCandidate" (
  "id" TEXT NOT NULL,
  "ownerAgentSubject" TEXT NOT NULL,
  "sourceKind" "EvidenceSourceKind" NOT NULL,
  "sourceRef" TEXT NOT NULL,
  "claimKind" "EvidenceClaimKind" NOT NULL,
  "candidatePayload" JSONB NOT NULL,
  "observedAt" TIMESTAMP(3),
  "receivedAt" TIMESTAMP(3) NOT NULL,
  "status" "EvidenceCandidateStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
  "provenance" JSONB NOT NULL,
  "fingerprint" TEXT NOT NULL,
  "reviewedBySubject" TEXT,
  "reviewedAt" TIMESTAMP(3),
  "rejectionReason" TEXT,
  "admissionPolicyContext" JSONB NOT NULL,
  "admissionId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EvidenceCandidate_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EvidenceAdmission" (
  "id" TEXT NOT NULL,
  "ownerAgentSubject" TEXT NOT NULL,
  "candidateId" TEXT NOT NULL,
  "sourceKind" "EvidenceSourceKind" NOT NULL,
  "sourceRef" TEXT NOT NULL,
  "claimKind" "EvidenceClaimKind" NOT NULL,
  "admittedValue" JSONB NOT NULL,
  "provenance" JSONB NOT NULL,
  "admissionPolicy" "EvidenceAdmissionPolicy" NOT NULL,
  "admittedBySubject" TEXT NOT NULL,
  "admittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "effectiveAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3),
  "reviewAfter" TIMESTAMP(3),
  "supersedesAdmissionId" TEXT,
  "fingerprint" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EvidenceAdmission_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EvidenceAdmissionAuditEvent" (
  "id" TEXT NOT NULL,
  "ownerAgentSubject" TEXT NOT NULL,
  "candidateId" TEXT,
  "admissionId" TEXT,
  "eventType" "EvidenceAdmissionAuditEventType" NOT NULL,
  "actorSubject" TEXT NOT NULL,
  "policyContext" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EvidenceAdmissionAuditEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "EvidenceCandidate_ownerAgentSubject_fingerprint_key" ON "EvidenceCandidate"("ownerAgentSubject", "fingerprint");
CREATE UNIQUE INDEX "EvidenceCandidate_admissionId_key" ON "EvidenceCandidate"("admissionId");
CREATE INDEX "EvidenceCandidate_ownerAgentSubject_status_createdAt_idx" ON "EvidenceCandidate"("ownerAgentSubject", "status", "createdAt");
CREATE INDEX "EvidenceCandidate_ownerAgentSubject_claimKind_status_idx" ON "EvidenceCandidate"("ownerAgentSubject", "claimKind", "status");
CREATE UNIQUE INDEX "EvidenceAdmission_candidateId_key" ON "EvidenceAdmission"("candidateId");
CREATE UNIQUE INDEX "EvidenceAdmission_supersedesAdmissionId_key" ON "EvidenceAdmission"("supersedesAdmissionId");
CREATE UNIQUE INDEX "EvidenceAdmission_fingerprint_key" ON "EvidenceAdmission"("fingerprint");
CREATE INDEX "EvidenceAdmission_ownerAgentSubject_claimKind_effectiveAt_idx" ON "EvidenceAdmission"("ownerAgentSubject", "claimKind", "effectiveAt");
CREATE INDEX "EvidenceAdmission_ownerAgentSubject_expiresAt_idx" ON "EvidenceAdmission"("ownerAgentSubject", "expiresAt");
CREATE INDEX "EvidenceAdmissionAuditEvent_ownerAgentSubject_createdAt_idx" ON "EvidenceAdmissionAuditEvent"("ownerAgentSubject", "createdAt");
CREATE INDEX "EvidenceAdmissionAuditEvent_candidateId_createdAt_idx" ON "EvidenceAdmissionAuditEvent"("candidateId", "createdAt");
CREATE INDEX "EvidenceAdmissionAuditEvent_admissionId_createdAt_idx" ON "EvidenceAdmissionAuditEvent"("admissionId", "createdAt");

ALTER TABLE "EvidenceAdmission" ADD CONSTRAINT "EvidenceAdmission_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "EvidenceCandidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "EvidenceCandidate" ADD CONSTRAINT "EvidenceCandidate_admissionId_fkey" FOREIGN KEY ("admissionId") REFERENCES "EvidenceAdmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "EvidenceAdmission" ADD CONSTRAINT "EvidenceAdmission_supersedesAdmissionId_fkey" FOREIGN KEY ("supersedesAdmissionId") REFERENCES "EvidenceAdmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "EvidenceAdmissionAuditEvent" ADD CONSTRAINT "EvidenceAdmissionAuditEvent_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "EvidenceCandidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "EvidenceAdmissionAuditEvent" ADD CONSTRAINT "EvidenceAdmissionAuditEvent_admissionId_fkey" FOREIGN KEY ("admissionId") REFERENCES "EvidenceAdmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE FUNCTION "preventEvidenceAdmissionMutation"() RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'PROJECT ATLAS evidence admissions are immutable';
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION "preventEvidenceAdmissionAuditMutation"() RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'PROJECT ATLAS evidence admission audit events are append-only';
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION "enforceEvidenceCandidateTransition"() RETURNS TRIGGER AS $$
BEGIN
  IF OLD."status" <> 'PENDING_REVIEW' THEN
    RAISE EXCEPTION 'PROJECT ATLAS evidence candidates cannot be changed after review';
  END IF;
  IF NEW."ownerAgentSubject" IS DISTINCT FROM OLD."ownerAgentSubject"
    OR NEW."sourceKind" IS DISTINCT FROM OLD."sourceKind"
    OR NEW."sourceRef" IS DISTINCT FROM OLD."sourceRef"
    OR NEW."claimKind" IS DISTINCT FROM OLD."claimKind"
    OR NEW."candidatePayload" IS DISTINCT FROM OLD."candidatePayload"
    OR NEW."observedAt" IS DISTINCT FROM OLD."observedAt"
    OR NEW."receivedAt" IS DISTINCT FROM OLD."receivedAt"
    OR NEW."provenance" IS DISTINCT FROM OLD."provenance"
    OR NEW."fingerprint" IS DISTINCT FROM OLD."fingerprint" THEN
    RAISE EXCEPTION 'PROJECT ATLAS evidence candidate semantics are immutable';
  END IF;
  IF NEW."status" = 'ADMITTED' AND (NEW."admissionId" IS NULL OR NEW."reviewedBySubject" IS NULL OR NEW."reviewedAt" IS NULL) THEN
    RAISE EXCEPTION 'PROJECT ATLAS admitted candidates require an admission and reviewer';
  END IF;
  IF NEW."status" = 'REJECTED' AND (NEW."rejectionReason" IS NULL OR NEW."reviewedBySubject" IS NULL OR NEW."reviewedAt" IS NULL) THEN
    RAISE EXCEPTION 'PROJECT ATLAS rejected candidates require a reviewer and reason';
  END IF;
  IF NEW."status" NOT IN ('ADMITTED', 'REJECTED') THEN
    RAISE EXCEPTION 'PROJECT ATLAS evidence candidate transition is invalid';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "EvidenceAdmission_append_only" BEFORE UPDATE OR DELETE ON "EvidenceAdmission" FOR EACH ROW EXECUTE FUNCTION "preventEvidenceAdmissionMutation"();
CREATE TRIGGER "EvidenceAdmissionAuditEvent_append_only" BEFORE UPDATE OR DELETE ON "EvidenceAdmissionAuditEvent" FOR EACH ROW EXECUTE FUNCTION "preventEvidenceAdmissionAuditMutation"();
CREATE TRIGGER "EvidenceCandidate_transition_only" BEFORE UPDATE ON "EvidenceCandidate" FOR EACH ROW EXECUTE FUNCTION "enforceEvidenceCandidateTransition"();
CREATE TRIGGER "EvidenceCandidate_no_delete" BEFORE DELETE ON "EvidenceCandidate" FOR EACH ROW EXECUTE FUNCTION "preventEvidenceAdmissionMutation"();
