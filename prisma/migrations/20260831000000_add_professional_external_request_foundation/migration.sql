-- PROJECT ATLAS PROFESSIONAL_EXTERNAL_REQUEST_FOUNDATION_V1
-- Additive only. This migration creates no delivery, capability, session, response, candidate, admission, or professional input records.

CREATE TYPE "ExternalRequestProfile" AS ENUM ('PROPERTY_MANAGER_RENT_ESTIMATE_V1');
CREATE TYPE "ExternalRequestDeliveryStatus" AS ENUM ('PREPARED', 'SENT', 'DELIVERED', 'DELIVERY_FAILED', 'ACCESSED', 'RESPONDED', 'REVOKED', 'EXPIRED');
CREATE TYPE "ExternalRequestIdentityDimension" AS ENUM ('CHANNEL_CONTROL', 'PERSON_IDENTITY', 'ORGANIZATION_AFFILIATION', 'PROFESSIONAL_ROLE', 'CREDENTIAL_STATUS');
CREATE TYPE "ExternalRequestIdentityVerificationMethod" AS ENUM ('AGENT_MANUAL_CONFIRMATION', 'EMAIL_CHANNEL_CONTROL', 'RESPONDER_CLAIM');
CREATE TYPE "ExternalRequestIdentityVerificationStatus" AS ENUM ('CLAIMED', 'VERIFIED', 'LIMITED', 'FAILED');

ALTER TABLE "ProfessionalInputRequest" ADD COLUMN "supersedesRequestId" TEXT;
CREATE UNIQUE INDEX "ProfessionalInputRequest_supersedesRequestId_key" ON "ProfessionalInputRequest"("supersedesRequestId");
ALTER TABLE "ProfessionalInputRequest" ADD CONSTRAINT "ProfessionalInputRequest_supersedesRequestId_fkey" FOREIGN KEY ("supersedesRequestId") REFERENCES "ProfessionalInputRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "ExternalRequestDelivery" (
  "id" TEXT NOT NULL,
  "ownerAgentSubject" TEXT NOT NULL,
  "professionalInputRequestId" TEXT NOT NULL,
  "profile" "ExternalRequestProfile" NOT NULL,
  "recipientEmail" TEXT NOT NULL,
  "recipientDisplayName" TEXT,
  "recipientOrganization" TEXT,
  "provider" TEXT NOT NULL DEFAULT 'RESEND',
  "status" "ExternalRequestDeliveryStatus" NOT NULL DEFAULT 'PREPARED',
  "requestFingerprint" TEXT NOT NULL,
  "providerMessageId" TEXT,
  "sentAt" TIMESTAMP(3),
  "deliveredAt" TIMESTAMP(3),
  "accessedAt" TIMESTAMP(3),
  "respondedAt" TIMESTAMP(3),
  "revokedAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "failureCode" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ExternalRequestDelivery_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ExternalRequestCapability" (
  "id" TEXT NOT NULL,
  "deliveryId" TEXT NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "purpose" TEXT NOT NULL,
  "maxUses" INTEGER NOT NULL DEFAULT 1,
  "useCount" INTEGER NOT NULL DEFAULT 0,
  "exchangedAt" TIMESTAMP(3),
  "revokedAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ExternalRequestCapability_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ExternalRequestSession" (
  "id" TEXT NOT NULL,
  "deliveryId" TEXT NOT NULL,
  "sessionHash" TEXT NOT NULL,
  "csrfTokenHash" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "revokedAt" TIMESTAMP(3),
  "lastAccessedAt" TIMESTAMP(3),
  "submittedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ExternalRequestSession_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ExternalRequestDisclosureSnapshot" (
  "id" TEXT NOT NULL,
  "deliveryId" TEXT NOT NULL,
  "contractVersion" TEXT NOT NULL,
  "disclosure" JSONB NOT NULL,
  "fingerprint" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ExternalRequestDisclosureSnapshot_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ExternalIdentityVerification" (
  "id" TEXT NOT NULL,
  "deliveryId" TEXT NOT NULL,
  "dimension" "ExternalRequestIdentityDimension" NOT NULL,
  "method" "ExternalRequestIdentityVerificationMethod" NOT NULL,
  "status" "ExternalRequestIdentityVerificationStatus" NOT NULL,
  "assertedValue" TEXT,
  "verifiedBySubject" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ExternalIdentityVerification_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ExternalRequestDelivery_professionalInputRequestId_key" ON "ExternalRequestDelivery"("professionalInputRequestId");
CREATE UNIQUE INDEX "ExternalRequestDelivery_requestFingerprint_key" ON "ExternalRequestDelivery"("requestFingerprint");
CREATE UNIQUE INDEX "ExternalRequestDelivery_providerMessageId_key" ON "ExternalRequestDelivery"("providerMessageId");
CREATE INDEX "ExternalRequestDelivery_ownerAgentSubject_status_createdAt_idx" ON "ExternalRequestDelivery"("ownerAgentSubject", "status", "createdAt");
CREATE INDEX "ExternalRequestDelivery_recipientEmail_status_idx" ON "ExternalRequestDelivery"("recipientEmail", "status");
CREATE UNIQUE INDEX "ExternalRequestCapability_deliveryId_key" ON "ExternalRequestCapability"("deliveryId");
CREATE UNIQUE INDEX "ExternalRequestCapability_tokenHash_key" ON "ExternalRequestCapability"("tokenHash");
CREATE UNIQUE INDEX "ExternalRequestSession_sessionHash_key" ON "ExternalRequestSession"("sessionHash");
CREATE INDEX "ExternalRequestSession_deliveryId_expiresAt_idx" ON "ExternalRequestSession"("deliveryId", "expiresAt");
CREATE UNIQUE INDEX "ExternalRequestDisclosureSnapshot_deliveryId_key" ON "ExternalRequestDisclosureSnapshot"("deliveryId");
CREATE UNIQUE INDEX "ExternalRequestDisclosureSnapshot_fingerprint_key" ON "ExternalRequestDisclosureSnapshot"("fingerprint");
CREATE UNIQUE INDEX "ExternalIdentityVerification_deliveryId_dimension_method_key" ON "ExternalIdentityVerification"("deliveryId", "dimension", "method");
CREATE INDEX "ExternalIdentityVerification_deliveryId_createdAt_idx" ON "ExternalIdentityVerification"("deliveryId", "createdAt");

ALTER TABLE "ExternalRequestDelivery" ADD CONSTRAINT "ExternalRequestDelivery_professionalInputRequestId_fkey" FOREIGN KEY ("professionalInputRequestId") REFERENCES "ProfessionalInputRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ExternalRequestCapability" ADD CONSTRAINT "ExternalRequestCapability_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "ExternalRequestDelivery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ExternalRequestSession" ADD CONSTRAINT "ExternalRequestSession_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "ExternalRequestDelivery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ExternalRequestDisclosureSnapshot" ADD CONSTRAINT "ExternalRequestDisclosureSnapshot_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "ExternalRequestDelivery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ExternalIdentityVerification" ADD CONSTRAINT "ExternalIdentityVerification_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "ExternalRequestDelivery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE FUNCTION "preventExternalRequestDisclosureSnapshotMutation"() RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'PROJECT ATLAS external request disclosure snapshots are immutable';
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION "preventExternalIdentityVerificationMutation"() RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'PROJECT ATLAS external identity verification events are immutable';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "ExternalRequestDisclosureSnapshot_append_only" BEFORE UPDATE OR DELETE ON "ExternalRequestDisclosureSnapshot" FOR EACH ROW EXECUTE FUNCTION "preventExternalRequestDisclosureSnapshotMutation"();
CREATE TRIGGER "ExternalIdentityVerification_append_only" BEFORE UPDATE OR DELETE ON "ExternalIdentityVerification" FOR EACH ROW EXECUTE FUNCTION "preventExternalIdentityVerificationMutation"();
