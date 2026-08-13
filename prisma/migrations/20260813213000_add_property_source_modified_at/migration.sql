ALTER TABLE "Property" ADD COLUMN "sourceModifiedAt" TIMESTAMP(3);

CREATE INDEX "Property_sourceModifiedAt_idx" ON "Property"("sourceModifiedAt");
