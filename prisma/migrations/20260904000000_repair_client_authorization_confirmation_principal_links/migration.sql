-- PROJECT ATLAS CLIENT_AUTHORIZATION_SECURE_CLIENT_CONFIRMATION_V1
-- Repair omitted optional principal-link columns required by the generated Prisma schema.

ALTER TABLE "ClientAuthorizationSession" ADD COLUMN IF NOT EXISTS "clientAuthorizationPrincipalId" TEXT;
ALTER TABLE "ClientAuthorizationConfirmationEvidence" ADD COLUMN IF NOT EXISTS "clientAuthorizationPrincipalId" TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'ClientAuthorizationSession_clientAuthorizationPrincipalId_fkey'
  ) THEN
    ALTER TABLE "ClientAuthorizationSession"
      ADD CONSTRAINT "ClientAuthorizationSession_clientAuthorizationPrincipalId_fkey"
      FOREIGN KEY ("clientAuthorizationPrincipalId") REFERENCES "ClientAuthorizationPrincipal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'ClientAuthorizationConfirmationEvidence_clientAuthorizationPrincipalId_fkey'
  ) THEN
    ALTER TABLE "ClientAuthorizationConfirmationEvidence"
      ADD CONSTRAINT "ClientAuthorizationConfirmationEvidence_clientAuthorizationPrincipalId_fkey"
      FOREIGN KEY ("clientAuthorizationPrincipalId") REFERENCES "ClientAuthorizationPrincipal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "ClientAuthorizationSession_clientAuthorizationPrincipalId_idx"
  ON "ClientAuthorizationSession"("clientAuthorizationPrincipalId");
CREATE INDEX IF NOT EXISTS "ClientAuthorizationConfirmationEvidence_clientAuthorizationPrincipalId_idx"
  ON "ClientAuthorizationConfirmationEvidence"("clientAuthorizationPrincipalId");
