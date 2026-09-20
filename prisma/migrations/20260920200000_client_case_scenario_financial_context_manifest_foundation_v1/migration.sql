-- PROJECT ATLAS Wave C1 Scenario Financial Context Manifest foundation.
-- Additive only. No business DML, backfill, or existing-row mutation.

CREATE TYPE "ClientCaseScenarioFinancialContextCaptureState" AS ENUM ('CAPTURED', 'NO_FINANCIAL_POSITION', 'EMPTY_SELECTION');
CREATE TYPE "ClientCaseScenarioFinancialContextEntryDomain" AS ENUM ('ASSET', 'LIABILITY', 'INCOME', 'BORROWING_QUALIFICATION', 'FINANCIAL_CONSTRAINT');

CREATE UNIQUE INDEX "CFPAO_case_id_key" ON "ClientFinancialAssetObservation"("clientCaseId", "id");
CREATE UNIQUE INDEX "CFPLO_case_id_key" ON "ClientFinancialLiabilityObservation"("clientCaseId", "id");
CREATE UNIQUE INDEX "CFPIO_case_id_key" ON "ClientFinancialIncomeObservation"("clientCaseId", "id");
CREATE UNIQUE INDEX "CFPQO_case_id_key" ON "ClientFinancialQualificationObservation"("clientCaseId", "id");
CREATE UNIQUE INDEX "CFPCO_case_id_key" ON "ClientFinancialConstraintObservation"("clientCaseId", "id");

CREATE TABLE "ClientCaseScenarioFinancialContextManifest" (
  "id" TEXT NOT NULL,
  "scenarioVersionId" TEXT NOT NULL,
  "clientCaseId" TEXT NOT NULL,
  "ownerAgentSubject" TEXT NOT NULL,
  "captureState" "ClientCaseScenarioFinancialContextCaptureState" NOT NULL,
  "manifestSchemaVersion" INTEGER NOT NULL,
  "fingerprint" TEXT NOT NULL,
  "idempotencyKey" TEXT NOT NULL,
  "capturedAt" TIMESTAMP(3) NOT NULL,
  "capturedBySubject" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ClientCaseScenarioFinancialContextManifest_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ClientCaseScenarioFinancialContextManifestEntry" (
  "id" TEXT NOT NULL,
  "manifestId" TEXT NOT NULL,
  "clientCaseId" TEXT NOT NULL,
  "domain" "ClientCaseScenarioFinancialContextEntryDomain" NOT NULL,
  "assetId" TEXT,
  "assetObservationId" TEXT,
  "liabilityId" TEXT,
  "liabilityObservationId" TEXT,
  "incomeSourceId" TEXT,
  "incomeObservationId" TEXT,
  "qualificationId" TEXT,
  "qualificationObservationId" TEXT,
  "constraintId" TEXT,
  "constraintObservationId" TEXT,
  "clientCasePartyId" TEXT,
  "clientCasePropertyId" TEXT,
  "financialSourceId" TEXT,
  "clientCaseGovernedSourceId" TEXT,
  "entityLabel" TEXT,
  "participantDisplayLabel" TEXT,
  "propertyDisplayLabel" TEXT,
  "sourceKind" "ClientCaseGovernedSourceKind",
  "sourcePosture" "ClientFinancialSourcePosture" NOT NULL,
  "verificationState" "ClientFinancialVerificationState" NOT NULL,
  "observationKind" "ClientFinancialObservationKind" NOT NULL,
  "limitation" TEXT,
  "currencyCode" TEXT NOT NULL,
  "asOf" TIMESTAMP(3) NOT NULL,
  "observedAt" TIMESTAMP(3),
  "effectiveAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3),
  "reviewAfter" TIMESTAMP(3),
  "assetCategory" "ClientFinancialAssetCategory",
  "assetMarketValueCents" BIGINT,
  "assetLiquidValueCents" BIGINT,
  "assetAvailableAmountCents" BIGINT,
  "liabilityCategory" "ClientFinancialLiabilityCategory",
  "liabilityCurrentBalanceCents" BIGINT,
  "liabilityMonthlyObligationCents" BIGINT,
  "liabilityRateBps" INTEGER,
  "incomeCategory" "ClientFinancialIncomeCategory",
  "incomeAmountCents" BIGINT,
  "incomeFrequency" "ClientFinancialFrequency",
  "qualificationType" "ClientFinancialQualificationType",
  "qualificationMaximumLoanAmountCents" BIGINT,
  "qualificationMaximumPurchaseAmountCents" BIGINT,
  "qualificationRateBps" INTEGER,
  "qualificationProgramLabel" TEXT,
  "constraintType" "ClientFinancialConstraintType",
  "constraintAmountCents" BIGINT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ClientCaseScenarioFinancialContextManifestEntry_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CSFCME_shape_ck" CHECK (
    ("domain" = 'ASSET' AND "assetId" IS NOT NULL AND "assetObservationId" IS NOT NULL AND "liabilityId" IS NULL AND "liabilityObservationId" IS NULL AND "incomeSourceId" IS NULL AND "incomeObservationId" IS NULL AND "qualificationId" IS NULL AND "qualificationObservationId" IS NULL AND "constraintId" IS NULL AND "constraintObservationId" IS NULL)
    OR ("domain" = 'LIABILITY' AND "assetId" IS NULL AND "assetObservationId" IS NULL AND "liabilityId" IS NOT NULL AND "liabilityObservationId" IS NOT NULL AND "incomeSourceId" IS NULL AND "incomeObservationId" IS NULL AND "qualificationId" IS NULL AND "qualificationObservationId" IS NULL AND "constraintId" IS NULL AND "constraintObservationId" IS NULL)
    OR ("domain" = 'INCOME' AND "assetId" IS NULL AND "assetObservationId" IS NULL AND "liabilityId" IS NULL AND "liabilityObservationId" IS NULL AND "incomeSourceId" IS NOT NULL AND "incomeObservationId" IS NOT NULL AND "qualificationId" IS NULL AND "qualificationObservationId" IS NULL AND "constraintId" IS NULL AND "constraintObservationId" IS NULL)
    OR ("domain" = 'BORROWING_QUALIFICATION' AND "assetId" IS NULL AND "assetObservationId" IS NULL AND "liabilityId" IS NULL AND "liabilityObservationId" IS NULL AND "incomeSourceId" IS NULL AND "incomeObservationId" IS NULL AND "qualificationId" IS NOT NULL AND "qualificationObservationId" IS NOT NULL AND "constraintId" IS NULL AND "constraintObservationId" IS NULL)
    OR ("domain" = 'FINANCIAL_CONSTRAINT' AND "assetId" IS NULL AND "assetObservationId" IS NULL AND "liabilityId" IS NULL AND "liabilityObservationId" IS NULL AND "incomeSourceId" IS NULL AND "incomeObservationId" IS NULL AND "qualificationId" IS NULL AND "qualificationObservationId" IS NULL AND "constraintId" IS NOT NULL AND "constraintObservationId" IS NOT NULL)
  )
);

CREATE UNIQUE INDEX "ClientCaseScenarioFinancialContextManifest_scenarioVersionI_key" ON "ClientCaseScenarioFinancialContextManifest"("scenarioVersionId");
CREATE UNIQUE INDEX "ClientCaseScenarioFinancialContextManifest_idempotencyKey_key" ON "ClientCaseScenarioFinancialContextManifest"("idempotencyKey");
CREATE UNIQUE INDEX "CSFCM_case_id_key" ON "ClientCaseScenarioFinancialContextManifest"("clientCaseId", "id");
CREATE INDEX "CSFCM_owner_case_capture_idx" ON "ClientCaseScenarioFinancialContextManifest"("ownerAgentSubject", "clientCaseId", "capturedAt");
CREATE INDEX "CSFCM_case_fingerprint_idx" ON "ClientCaseScenarioFinancialContextManifest"("clientCaseId", "fingerprint");
CREATE UNIQUE INDEX "CSFCME_case_id_key" ON "ClientCaseScenarioFinancialContextManifestEntry"("clientCaseId", "id");
CREATE UNIQUE INDEX "CSFCME_manifest_asset_obs_key" ON "ClientCaseScenarioFinancialContextManifestEntry"("manifestId", "assetObservationId");
CREATE UNIQUE INDEX "CSFCME_manifest_liability_obs_key" ON "ClientCaseScenarioFinancialContextManifestEntry"("manifestId", "liabilityObservationId");
CREATE UNIQUE INDEX "CSFCME_manifest_income_obs_key" ON "ClientCaseScenarioFinancialContextManifestEntry"("manifestId", "incomeObservationId");
CREATE UNIQUE INDEX "CSFCME_manifest_qualification_obs_key" ON "ClientCaseScenarioFinancialContextManifestEntry"("manifestId", "qualificationObservationId");
CREATE UNIQUE INDEX "CSFCME_manifest_constraint_obs_key" ON "ClientCaseScenarioFinancialContextManifestEntry"("manifestId", "constraintObservationId");
CREATE INDEX "CSFCME_case_asset_obs_idx" ON "ClientCaseScenarioFinancialContextManifestEntry"("clientCaseId", "assetObservationId");
CREATE INDEX "CSFCME_case_liability_obs_idx" ON "ClientCaseScenarioFinancialContextManifestEntry"("clientCaseId", "liabilityObservationId");
CREATE INDEX "CSFCME_case_income_obs_idx" ON "ClientCaseScenarioFinancialContextManifestEntry"("clientCaseId", "incomeObservationId");
CREATE INDEX "CSFCME_case_qualification_obs_idx" ON "ClientCaseScenarioFinancialContextManifestEntry"("clientCaseId", "qualificationObservationId");
CREATE INDEX "CSFCME_case_constraint_obs_idx" ON "ClientCaseScenarioFinancialContextManifestEntry"("clientCaseId", "constraintObservationId");
CREATE INDEX "CSFCME_manifest_domain_idx" ON "ClientCaseScenarioFinancialContextManifestEntry"("manifestId", "domain");

ALTER TABLE "ClientCaseScenarioFinancialContextManifest" ADD CONSTRAINT "CSFCM_scenario_version_fk" FOREIGN KEY ("scenarioVersionId") REFERENCES "ClientCaseScenarioVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseScenarioFinancialContextManifest" ADD CONSTRAINT "CSFCM_case_owner_fk" FOREIGN KEY ("clientCaseId", "ownerAgentSubject") REFERENCES "ClientCase"("id", "ownerAgentSubject") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseScenarioFinancialContextManifestEntry" ADD CONSTRAINT "CSFCME_manifest_fk" FOREIGN KEY ("clientCaseId", "manifestId") REFERENCES "ClientCaseScenarioFinancialContextManifest"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseScenarioFinancialContextManifestEntry" ADD CONSTRAINT "CSFCME_asset_fk" FOREIGN KEY ("clientCaseId", "assetId") REFERENCES "ClientFinancialAsset"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseScenarioFinancialContextManifestEntry" ADD CONSTRAINT "CSFCME_asset_obs_fk" FOREIGN KEY ("clientCaseId", "assetObservationId") REFERENCES "ClientFinancialAssetObservation"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseScenarioFinancialContextManifestEntry" ADD CONSTRAINT "CSFCME_liability_fk" FOREIGN KEY ("clientCaseId", "liabilityId") REFERENCES "ClientFinancialLiability"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseScenarioFinancialContextManifestEntry" ADD CONSTRAINT "CSFCME_liability_obs_fk" FOREIGN KEY ("clientCaseId", "liabilityObservationId") REFERENCES "ClientFinancialLiabilityObservation"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseScenarioFinancialContextManifestEntry" ADD CONSTRAINT "CSFCME_income_fk" FOREIGN KEY ("clientCaseId", "incomeSourceId") REFERENCES "ClientFinancialIncomeSource"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseScenarioFinancialContextManifestEntry" ADD CONSTRAINT "CSFCME_income_obs_fk" FOREIGN KEY ("clientCaseId", "incomeObservationId") REFERENCES "ClientFinancialIncomeObservation"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseScenarioFinancialContextManifestEntry" ADD CONSTRAINT "CSFCME_qualification_fk" FOREIGN KEY ("clientCaseId", "qualificationId") REFERENCES "ClientFinancialQualification"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseScenarioFinancialContextManifestEntry" ADD CONSTRAINT "CSFCME_qualification_obs_fk" FOREIGN KEY ("clientCaseId", "qualificationObservationId") REFERENCES "ClientFinancialQualificationObservation"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseScenarioFinancialContextManifestEntry" ADD CONSTRAINT "CSFCME_constraint_fk" FOREIGN KEY ("clientCaseId", "constraintId") REFERENCES "ClientFinancialConstraint"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseScenarioFinancialContextManifestEntry" ADD CONSTRAINT "CSFCME_constraint_obs_fk" FOREIGN KEY ("clientCaseId", "constraintObservationId") REFERENCES "ClientFinancialConstraintObservation"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseScenarioFinancialContextManifestEntry" ADD CONSTRAINT "CSFCME_party_fk" FOREIGN KEY ("clientCaseId", "clientCasePartyId") REFERENCES "ClientCaseParty"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseScenarioFinancialContextManifestEntry" ADD CONSTRAINT "CSFCME_property_fk" FOREIGN KEY ("clientCaseId", "clientCasePropertyId") REFERENCES "ClientCaseProperty"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseScenarioFinancialContextManifestEntry" ADD CONSTRAINT "CSFCME_source_fk" FOREIGN KEY ("clientCaseId", "financialSourceId") REFERENCES "ClientFinancialSource"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseScenarioFinancialContextManifestEntry" ADD CONSTRAINT "CSFCME_governed_source_fk" FOREIGN KEY ("clientCaseId", "clientCaseGovernedSourceId") REFERENCES "ClientCaseGovernedSource"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
