-- PROJECT ATLAS CLIENT_AUTHORIZATION_SECURE_CLIENT_CONFIRMATION_V1
-- Additive capability, scoped-session, and immutable decision evidence records.

ALTER TYPE "ClientAuthorizationProfileLifecycle" ADD VALUE IF NOT EXISTS 'SYNTHETIC_CERTIFICATION_ONLY';
ALTER TABLE "ClientAuthorization" ADD COLUMN "consumedAt" TIMESTAMP(3);
ALTER TABLE "ClientAuthorization" ADD COLUMN "consumptionIdempotencyKey" TEXT;

CREATE TABLE "ClientAuthorizationCapability" (
  "id" TEXT NOT NULL,
  "authorizationId" TEXT NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "purpose" TEXT NOT NULL,
  "issuanceKey" TEXT NOT NULL,
  "maxUses" INTEGER NOT NULL DEFAULT 1,
  "useCount" INTEGER NOT NULL DEFAULT 0,
  "exchangedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "revokedAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ClientAuthorizationCapability_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ClientAuthorizationSession" (
  "id" TEXT NOT NULL,
  "authorizationId" TEXT NOT NULL,
  "capabilityId" TEXT NOT NULL,
  "sessionHash" TEXT NOT NULL,
  "csrfTokenHash" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "revokedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "lastAccessedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ClientAuthorizationSession_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ClientAuthorizationConfirmationEvidence" (
  "id" TEXT NOT NULL,
  "authorizationId" TEXT NOT NULL,
  "capabilityId" TEXT NOT NULL,
  "sessionId" TEXT NOT NULL,
  "decision" TEXT NOT NULL,
  "evidenceVersion" TEXT NOT NULL,
  "requestFingerprint" TEXT NOT NULL,
  "profileKey" TEXT NOT NULL,
  "profileVersion" TEXT NOT NULL,
  "scopeSnapshot" JSONB NOT NULL,
  "decidedAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ClientAuthorizationConfirmationEvidence_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ClientAuthorizationCapability_tokenHash_key" ON "ClientAuthorizationCapability"("tokenHash");
CREATE UNIQUE INDEX "ClientAuthorizationCapability_issuanceKey_key" ON "ClientAuthorizationCapability"("issuanceKey");
CREATE UNIQUE INDEX "ClientAuthorizationSession_sessionHash_key" ON "ClientAuthorizationSession"("sessionHash");
CREATE UNIQUE INDEX "ClientAuthorizationConfirmationEvidence_authorizationId_key" ON "ClientAuthorizationConfirmationEvidence"("authorizationId");
CREATE INDEX "ClientAuthorization_ownerAgentSubject_consumedAt_idx" ON "ClientAuthorization"("ownerAgentSubject", "consumedAt");
CREATE INDEX "ClientAuthorizationCapability_authorizationId_expiresAt_idx" ON "ClientAuthorizationCapability"("authorizationId", "expiresAt");
CREATE INDEX "ClientAuthorizationSession_authorizationId_expiresAt_idx" ON "ClientAuthorizationSession"("authorizationId", "expiresAt");
CREATE INDEX "ClientAuthorizationSession_capabilityId_expiresAt_idx" ON "ClientAuthorizationSession"("capabilityId", "expiresAt");
CREATE INDEX "ClientAuthorizationConfirmationEvidence_profileKey_profileVersion_decidedAt_idx" ON "ClientAuthorizationConfirmationEvidence"("profileKey", "profileVersion", "decidedAt");

ALTER TABLE "ClientAuthorizationCapability" ADD CONSTRAINT "ClientAuthorizationCapability_authorizationId_fkey" FOREIGN KEY ("authorizationId") REFERENCES "ClientAuthorization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientAuthorizationSession" ADD CONSTRAINT "ClientAuthorizationSession_authorizationId_fkey" FOREIGN KEY ("authorizationId") REFERENCES "ClientAuthorization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientAuthorizationSession" ADD CONSTRAINT "ClientAuthorizationSession_capabilityId_fkey" FOREIGN KEY ("capabilityId") REFERENCES "ClientAuthorizationCapability"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientAuthorizationConfirmationEvidence" ADD CONSTRAINT "ClientAuthorizationConfirmationEvidence_authorizationId_fkey" FOREIGN KEY ("authorizationId") REFERENCES "ClientAuthorization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientAuthorizationConfirmationEvidence" ADD CONSTRAINT "ClientAuthorizationConfirmationEvidence_capabilityId_fkey" FOREIGN KEY ("capabilityId") REFERENCES "ClientAuthorizationCapability"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientAuthorizationConfirmationEvidence" ADD CONSTRAINT "ClientAuthorizationConfirmationEvidence_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ClientAuthorizationSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE FUNCTION "ClientAuthorizationConfirmationEvidence_append_only"() RETURNS trigger AS $$ BEGIN RAISE EXCEPTION 'Client authorization confirmation evidence is immutable'; END; $$ LANGUAGE plpgsql;
CREATE TRIGGER "ClientAuthorizationConfirmationEvidence_append_only" BEFORE UPDATE OR DELETE ON "ClientAuthorizationConfirmationEvidence" FOR EACH ROW EXECUTE FUNCTION "ClientAuthorizationConfirmationEvidence_append_only"();
CREATE FUNCTION "ClientAuthorizationUse_append_only"() RETURNS trigger AS $$ BEGIN RAISE EXCEPTION 'Client authorization use evidence is immutable'; END; $$ LANGUAGE plpgsql;
CREATE TRIGGER "ClientAuthorizationUse_append_only" BEFORE UPDATE OR DELETE ON "ClientAuthorizationUse" FOR EACH ROW EXECUTE FUNCTION "ClientAuthorizationUse_append_only"();
CREATE FUNCTION "ClientAuthorizationSnapshot_freeze_when_prepared"() RETURNS trigger AS $$ BEGIN IF EXISTS (SELECT 1 FROM "ClientAuthorization" WHERE "id" = OLD."authorizationId" AND "status" <> 'DRAFT') THEN RAISE EXCEPTION 'Prepared client authorization snapshot is immutable'; END IF; RETURN NEW; END; $$ LANGUAGE plpgsql;
CREATE TRIGGER "ClientAuthorizationSnapshot_freeze_when_prepared" BEFORE UPDATE OR DELETE ON "ClientAuthorizationSnapshot" FOR EACH ROW EXECUTE FUNCTION "ClientAuthorizationSnapshot_freeze_when_prepared"();
