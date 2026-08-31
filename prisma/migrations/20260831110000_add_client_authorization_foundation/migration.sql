-- PROJECT ATLAS CLIENT_AUTHORIZATION_FOUNDATION_V1
-- Additive only. No historical authorization is fabricated and no existing workflow is backfilled.

CREATE TYPE "ClientAuthorizationProfileLifecycle" AS ENUM ('DRAFT', 'REVIEWED', 'ACTIVE', 'RETIRED', 'POLICY_HELD', 'DEPENDENCY_HELD');
CREATE TYPE "ClientAuthorizationStatus" AS ENUM ('DRAFT', 'PENDING_CONFIRMATION', 'ACTIVE', 'EXPIRED', 'REVOKED', 'SUPERSEDED', 'DECLINED', 'INVALIDATED');
CREATE TYPE "ClientAuthorizationPrincipalRequirement" AS ENUM ('SINGLE_REQUIRED_PRINCIPAL', 'ALL_REQUIRED_PRINCIPALS', 'ANY_ONE_AUTHORIZED_PRINCIPAL', 'PROFILE_DEFINED_PRINCIPAL_SET');
CREATE TYPE "ClientAuthorizationCaptureMethod" AS ENUM ('AGENT_RECORDED_VERBAL', 'AGENT_RECORDED_EMAIL', 'AGENT_RECORDED_TEXT', 'AGENT_RECORDED_MEETING', 'CLIENT_PORTAL_CONFIRMED', 'PURPOSE_BOUND_SECURE_LINK', 'SIGNED_DOCUMENT', 'E_SIGNATURE', 'PROVIDER_FORM', 'OTHER_GOVERNED_METHOD');
CREATE TYPE "ClientAuthorizationAssurance" AS ENUM ('AGENT_RECORDED', 'CLIENT_CONFIRMED', 'STRONG_CLIENT_CONFIRMED', 'SIGNED', 'PROVIDER_VERIFIED');
CREATE TYPE "ClientAuthorizationResolution" AS ENUM ('AUTHORIZED', 'NOT_AUTHORIZED', 'REVIEW_REQUIRED');

CREATE TABLE "ClientAuthorizationProfile" (
  "id" TEXT NOT NULL,
  "profileKey" TEXT NOT NULL,
  "profileVersion" TEXT NOT NULL,
  "lifecycle" "ClientAuthorizationProfileLifecycle" NOT NULL,
  "definition" JSONB NOT NULL,
  "definitionFingerprint" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ClientAuthorizationProfile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ClientAuthorization" (
  "id" TEXT NOT NULL,
  "ownerAgentSubject" TEXT NOT NULL,
  "profileId" TEXT NOT NULL,
  "status" "ClientAuthorizationStatus" NOT NULL DEFAULT 'DRAFT',
  "effectiveAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3),
  "revokedAt" TIMESTAMP(3),
  "revokedBySubject" TEXT,
  "revocationReason" TEXT,
  "supersededAt" TIMESTAMP(3),
  "supersedesAuthorizationId" TEXT,
  "transactionId" TEXT,
  "propertyId" TEXT,
  "captureMethod" "ClientAuthorizationCaptureMethod" NOT NULL,
  "assurance" "ClientAuthorizationAssurance" NOT NULL,
  "createdBySubject" TEXT NOT NULL,
  "idempotencyKey" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ClientAuthorization_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ClientAuthorizationPrincipal" (
  "id" TEXT NOT NULL,
  "authorizationId" TEXT NOT NULL,
  "principalRef" TEXT NOT NULL,
  "displayLabel" TEXT NOT NULL,
  "representativeReference" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ClientAuthorizationPrincipal_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ClientAuthorizationSnapshot" (
  "id" TEXT NOT NULL,
  "authorizationId" TEXT NOT NULL,
  "schemaVersion" TEXT NOT NULL,
  "snapshot" JSONB NOT NULL,
  "fingerprint" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ClientAuthorizationSnapshot_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ClientAuthorizationUse" (
  "id" TEXT NOT NULL,
  "authorizationId" TEXT,
  "ownerAgentSubject" TEXT NOT NULL,
  "profileKey" TEXT NOT NULL,
  "profileVersion" TEXT NOT NULL,
  "principalRefs" JSONB NOT NULL,
  "proposedAction" TEXT NOT NULL,
  "purpose" TEXT NOT NULL,
  "recipientClass" TEXT,
  "recipientRef" TEXT,
  "requestedDataClasses" JSONB NOT NULL,
  "resolvedDataClasses" JSONB NOT NULL,
  "resolution" "ClientAuthorizationResolution" NOT NULL,
  "reasons" JSONB NOT NULL,
  "downstreamReference" TEXT,
  "completedAt" TIMESTAMP(3),
  "idempotencyKey" TEXT NOT NULL,
  "resolvedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ClientAuthorizationUse_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ClientAuthorizationProfile_profileKey_profileVersion_key" ON "ClientAuthorizationProfile"("profileKey", "profileVersion");
CREATE UNIQUE INDEX "ClientAuthorizationProfile_definitionFingerprint_key" ON "ClientAuthorizationProfile"("definitionFingerprint");
CREATE INDEX "ClientAuthorizationProfile_profileKey_lifecycle_idx" ON "ClientAuthorizationProfile"("profileKey", "lifecycle");
CREATE UNIQUE INDEX "ClientAuthorization_supersedesAuthorizationId_key" ON "ClientAuthorization"("supersedesAuthorizationId");
CREATE UNIQUE INDEX "ClientAuthorization_idempotencyKey_key" ON "ClientAuthorization"("idempotencyKey");
CREATE INDEX "ClientAuthorization_ownerAgentSubject_status_createdAt_idx" ON "ClientAuthorization"("ownerAgentSubject", "status", "createdAt");
CREATE INDEX "ClientAuthorization_ownerAgentSubject_profileId_status_idx" ON "ClientAuthorization"("ownerAgentSubject", "profileId", "status");
CREATE INDEX "ClientAuthorization_transactionId_idx" ON "ClientAuthorization"("transactionId");
CREATE INDEX "ClientAuthorization_propertyId_idx" ON "ClientAuthorization"("propertyId");
CREATE UNIQUE INDEX "ClientAuthorizationPrincipal_authorizationId_principalRef_key" ON "ClientAuthorizationPrincipal"("authorizationId", "principalRef");
CREATE INDEX "ClientAuthorizationPrincipal_principalRef_idx" ON "ClientAuthorizationPrincipal"("principalRef");
CREATE UNIQUE INDEX "ClientAuthorizationSnapshot_authorizationId_key" ON "ClientAuthorizationSnapshot"("authorizationId");
CREATE UNIQUE INDEX "ClientAuthorizationSnapshot_fingerprint_key" ON "ClientAuthorizationSnapshot"("fingerprint");
CREATE UNIQUE INDEX "ClientAuthorizationUse_idempotencyKey_key" ON "ClientAuthorizationUse"("idempotencyKey");
CREATE INDEX "ClientAuthorizationUse_ownerAgentSubject_resolvedAt_idx" ON "ClientAuthorizationUse"("ownerAgentSubject", "resolvedAt");
CREATE INDEX "ClientAuthorizationUse_authorizationId_resolvedAt_idx" ON "ClientAuthorizationUse"("authorizationId", "resolvedAt");

ALTER TABLE "ClientAuthorization" ADD CONSTRAINT "ClientAuthorization_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "ClientAuthorizationProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientAuthorization" ADD CONSTRAINT "ClientAuthorization_supersedesAuthorizationId_fkey" FOREIGN KEY ("supersedesAuthorizationId") REFERENCES "ClientAuthorization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientAuthorizationPrincipal" ADD CONSTRAINT "ClientAuthorizationPrincipal_authorizationId_fkey" FOREIGN KEY ("authorizationId") REFERENCES "ClientAuthorization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientAuthorizationSnapshot" ADD CONSTRAINT "ClientAuthorizationSnapshot_authorizationId_fkey" FOREIGN KEY ("authorizationId") REFERENCES "ClientAuthorization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientAuthorizationUse" ADD CONSTRAINT "ClientAuthorizationUse_authorizationId_fkey" FOREIGN KEY ("authorizationId") REFERENCES "ClientAuthorization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE FUNCTION "preventClientAuthorizationSnapshotMutation"() RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'PROJECT ATLAS client authorization snapshots are immutable';
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION "preventUsedClientAuthorizationProfileMutation"() RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM "ClientAuthorization" WHERE "profileId" = OLD."id") THEN
    RAISE EXCEPTION 'PROJECT ATLAS used client authorization profile versions are immutable';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION "preventClientAuthorizationMaterialMutation"() RETURNS TRIGGER AS $$
BEGIN
  IF OLD."status" IN ('ACTIVE', 'EXPIRED', 'REVOKED', 'SUPERSEDED', 'INVALIDATED') AND (
    NEW."profileId" IS DISTINCT FROM OLD."profileId" OR
    NEW."captureMethod" IS DISTINCT FROM OLD."captureMethod" OR
    NEW."assurance" IS DISTINCT FROM OLD."assurance" OR
    NEW."effectiveAt" IS DISTINCT FROM OLD."effectiveAt" OR
    NEW."expiresAt" IS DISTINCT FROM OLD."expiresAt" OR
    NEW."transactionId" IS DISTINCT FROM OLD."transactionId" OR
    NEW."propertyId" IS DISTINCT FROM OLD."propertyId"
  ) THEN
    RAISE EXCEPTION 'PROJECT ATLAS active client authorization material terms require a successor';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "ClientAuthorizationSnapshot_append_only" BEFORE UPDATE OR DELETE ON "ClientAuthorizationSnapshot" FOR EACH ROW EXECUTE FUNCTION "preventClientAuthorizationSnapshotMutation"();
CREATE TRIGGER "ClientAuthorizationProfile_used_version_immutable" BEFORE UPDATE OR DELETE ON "ClientAuthorizationProfile" FOR EACH ROW EXECUTE FUNCTION "preventUsedClientAuthorizationProfileMutation"();
CREATE TRIGGER "ClientAuthorization_material_terms_immutable" BEFORE UPDATE ON "ClientAuthorization" FOR EACH ROW EXECUTE FUNCTION "preventClientAuthorizationMaterialMutation"();
