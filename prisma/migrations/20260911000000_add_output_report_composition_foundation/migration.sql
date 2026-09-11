-- Additive nullable context seams for the existing canonical OutputProduct root.
ALTER TABLE "OutputProduct" ADD COLUMN "clientCaseId" TEXT;
ALTER TABLE "OutputProduct" ADD COLUMN "transactionId" TEXT;

ALTER TABLE "OutputProduct"
  ADD CONSTRAINT "OutputProduct_clientCaseId_fkey"
  FOREIGN KEY ("clientCaseId") REFERENCES "ClientCase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "OutputProduct"
  ADD CONSTRAINT "OutputProduct_transactionId_fkey"
  FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "OutputProduct_ownerAgentSubject_clientCaseId_createdAt_idx"
  ON "OutputProduct"("ownerAgentSubject", "clientCaseId", "createdAt");

CREATE INDEX "OutputProduct_ownerAgentSubject_transactionId_createdAt_idx"
  ON "OutputProduct"("ownerAgentSubject", "transactionId", "createdAt");
