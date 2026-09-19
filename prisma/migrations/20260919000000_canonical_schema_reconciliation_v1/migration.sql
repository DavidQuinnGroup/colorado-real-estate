-- Preserve unresolved historical references while enforcing canonical future writes.
CREATE INDEX IF NOT EXISTS "LeadInteraction_clientId_idx" ON "LeadInteraction"("clientId");
CREATE INDEX IF NOT EXISTS "LeadInteraction_propertyId_idx" ON "LeadInteraction"("propertyId");
CREATE INDEX IF NOT EXISTS "LeadInteraction_interactionType_idx" ON "LeadInteraction"("interactionType");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public."LeadInteraction"'::regclass
      AND conname = 'LeadInteraction_clientId_fkey'
  ) THEN
    ALTER TABLE "LeadInteraction"
      ADD CONSTRAINT "LeadInteraction_clientId_fkey"
      FOREIGN KEY ("clientId") REFERENCES "User"("id")
      ON DELETE CASCADE ON UPDATE CASCADE NOT VALID;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public."LeadInteraction"'::regclass
      AND conname = 'LeadInteraction_propertyId_fkey'
  ) THEN
    ALTER TABLE "LeadInteraction"
      ADD CONSTRAINT "LeadInteraction_propertyId_fkey"
      FOREIGN KEY ("propertyId") REFERENCES "Property"("id")
      ON DELETE CASCADE ON UPDATE CASCADE NOT VALID;
  END IF;
END $$;
