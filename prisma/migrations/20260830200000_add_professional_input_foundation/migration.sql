-- PROJECT ATLAS PROFESSIONAL_INPUT_REQUEST_AND_VERIFICATION_FOUNDATION_V1
-- Additive only. This migration creates no requests, responses, candidates, admissions, or inputs.

CREATE TYPE "ProfessionalInputRequestStatus" AS ENUM ('DRAFT', 'REQUESTED', 'ACKNOWLEDGED', 'RESPONDED', 'UNDER_REVIEW', 'COMPLETED', 'CANCELLED', 'EXPIRED');

CREATE TABLE "ProfessionalInputRequest" (
  "id" TEXT NOT NULL,
  "ownerAgentSubject" TEXT NOT NULL,
  "claimKind" "EvidenceClaimKind" NOT NULL,
  "requestedSourceRole" TEXT NOT NULL,
  "status" "ProfessionalInputRequestStatus" NOT NULL DEFAULT 'DRAFT',
  "requestedBySubject" TEXT NOT NULL,
  "requestedAt" TIMESTAMP(3),
  "dueAt" TIMESTAMP(3),
  "purpose" TEXT NOT NULL,
  "supportDocumentRequired" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProfessionalInputRequest_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProfessionalInputResponse" (
  "id" TEXT NOT NULL,
  "requestId" TEXT NOT NULL,
  "ownerAgentSubject" TEXT NOT NULL,
  "sourceReference" TEXT NOT NULL,
  "sourceRoleClaim" TEXT,
  "sourceIdentityReference" TEXT,
  "providedAt" TIMESTAMP(3),
  "receivedAt" TIMESTAMP(3) NOT NULL,
  "responsePayload" JSONB NOT NULL,
  "provenance" JSONB NOT NULL,
  "verificationStatus" "EvidenceVerificationStatus" NOT NULL,
  "candidateId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProfessionalInputResponse_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProfessionalInput" (
  "id" TEXT NOT NULL,
  "ownerAgentSubject" TEXT NOT NULL,
  "claimKind" "EvidenceClaimKind" NOT NULL,
  "versionOrdinal" INTEGER NOT NULL,
  "value" JSONB NOT NULL,
  "evidenceAdmissionId" TEXT NOT NULL,
  "effectiveAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3),
  "reviewAfter" TIMESTAMP(3),
  "provenance" JSONB NOT NULL,
  "fingerprint" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProfessionalInput_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ProfessionalInputResponse_requestId_key" ON "ProfessionalInputResponse"("requestId");
CREATE UNIQUE INDEX "ProfessionalInputResponse_candidateId_key" ON "ProfessionalInputResponse"("candidateId");
CREATE INDEX "ProfessionalInputRequest_ownerAgentSubject_status_createdAt_idx" ON "ProfessionalInputRequest"("ownerAgentSubject", "status", "createdAt");
CREATE INDEX "ProfessionalInputRequest_ownerAgentSubject_claimKind_status_idx" ON "ProfessionalInputRequest"("ownerAgentSubject", "claimKind", "status");
CREATE INDEX "ProfessionalInputResponse_ownerAgentSubject_receivedAt_idx" ON "ProfessionalInputResponse"("ownerAgentSubject", "receivedAt");
CREATE UNIQUE INDEX "ProfessionalInput_evidenceAdmissionId_key" ON "ProfessionalInput"("evidenceAdmissionId");
CREATE UNIQUE INDEX "ProfessionalInput_fingerprint_key" ON "ProfessionalInput"("fingerprint");
CREATE UNIQUE INDEX "ProfessionalInput_ownerAgentSubject_claimKind_versionOrdinal_key" ON "ProfessionalInput"("ownerAgentSubject", "claimKind", "versionOrdinal");
CREATE INDEX "ProfessionalInput_ownerAgentSubject_claimKind_effectiveAt_idx" ON "ProfessionalInput"("ownerAgentSubject", "claimKind", "effectiveAt");

ALTER TABLE "ProfessionalInputResponse" ADD CONSTRAINT "ProfessionalInputResponse_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "ProfessionalInputRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ProfessionalInputResponse" ADD CONSTRAINT "ProfessionalInputResponse_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "EvidenceCandidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ProfessionalInput" ADD CONSTRAINT "ProfessionalInput_evidenceAdmissionId_fkey" FOREIGN KEY ("evidenceAdmissionId") REFERENCES "EvidenceAdmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE FUNCTION "preventProfessionalInputMutation"() RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'PROJECT ATLAS professional input records are immutable';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "ProfessionalInputResponse_append_only" BEFORE UPDATE OR DELETE ON "ProfessionalInputResponse" FOR EACH ROW EXECUTE FUNCTION "preventProfessionalInputMutation"();
CREATE TRIGGER "ProfessionalInput_append_only" BEFORE UPDATE OR DELETE ON "ProfessionalInput" FOR EACH ROW EXECUTE FUNCTION "preventProfessionalInputMutation"();
