-- PROJECT ATLAS Client Financial Position Wave C2A
-- Scenario Financial Context Draft Foundation V1

CREATE TYPE "ClientCaseScenarioFinancialContextDraftMutationKind" AS ENUM ('CREATE', 'SELECT', 'DESELECT', 'REVIEW', 'CLEAR_ALL');

CREATE TABLE "ClientCaseScenarioFinancialContextDraft" (
  "id" TEXT NOT NULL,
  "clientCaseId" TEXT NOT NULL,
  "scenarioId" TEXT NOT NULL,
  "ownerAgentSubject" TEXT NOT NULL,
  "revision" INTEGER NOT NULL DEFAULT 1,
  "draftSchemaVersion" INTEGER NOT NULL,
  "createdBySubject" TEXT NOT NULL,
  "updatedBySubject" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ClientCaseScenarioFinancialContextDraft_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CSFCD_revision_positive_ck" CHECK ("revision" >= 1)
);

CREATE TABLE "ClientCaseScenarioFinancialContextDraftSelection" (
  "id" TEXT NOT NULL,
  "draftId" TEXT NOT NULL,
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
  "selectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "selectedBySubject" TEXT NOT NULL,
  "reviewedAt" TIMESTAMP(3),
  "reviewedBySubject" TEXT,
  "mutationKind" "ClientCaseScenarioFinancialContextDraftMutationKind" NOT NULL DEFAULT 'SELECT',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ClientCaseScenarioFinancialContextDraftSelection_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CSFCDS_shape_ck" CHECK (
    (
      "domain" = 'ASSET'
      AND "assetId" IS NOT NULL
      AND "assetObservationId" IS NOT NULL
      AND "liabilityId" IS NULL
      AND "liabilityObservationId" IS NULL
      AND "incomeSourceId" IS NULL
      AND "incomeObservationId" IS NULL
      AND "qualificationId" IS NULL
      AND "qualificationObservationId" IS NULL
      AND "constraintId" IS NULL
      AND "constraintObservationId" IS NULL
      AND "clientCasePropertyId" IS NULL
    ) OR (
      "domain" = 'LIABILITY'
      AND "liabilityId" IS NOT NULL
      AND "liabilityObservationId" IS NOT NULL
      AND "assetId" IS NULL
      AND "assetObservationId" IS NULL
      AND "incomeSourceId" IS NULL
      AND "incomeObservationId" IS NULL
      AND "qualificationId" IS NULL
      AND "qualificationObservationId" IS NULL
      AND "constraintId" IS NULL
      AND "constraintObservationId" IS NULL
    ) OR (
      "domain" = 'INCOME'
      AND "incomeSourceId" IS NOT NULL
      AND "incomeObservationId" IS NOT NULL
      AND "assetId" IS NULL
      AND "assetObservationId" IS NULL
      AND "liabilityId" IS NULL
      AND "liabilityObservationId" IS NULL
      AND "qualificationId" IS NULL
      AND "qualificationObservationId" IS NULL
      AND "constraintId" IS NULL
      AND "constraintObservationId" IS NULL
    ) OR (
      "domain" = 'BORROWING_QUALIFICATION'
      AND "qualificationId" IS NOT NULL
      AND "qualificationObservationId" IS NOT NULL
      AND "assetId" IS NULL
      AND "assetObservationId" IS NULL
      AND "liabilityId" IS NULL
      AND "liabilityObservationId" IS NULL
      AND "incomeSourceId" IS NULL
      AND "incomeObservationId" IS NULL
      AND "constraintId" IS NULL
      AND "constraintObservationId" IS NULL
      AND "clientCasePartyId" IS NULL
      AND "clientCasePropertyId" IS NULL
    ) OR (
      "domain" = 'FINANCIAL_CONSTRAINT'
      AND "constraintId" IS NOT NULL
      AND "constraintObservationId" IS NOT NULL
      AND "assetId" IS NULL
      AND "assetObservationId" IS NULL
      AND "liabilityId" IS NULL
      AND "liabilityObservationId" IS NULL
      AND "incomeSourceId" IS NULL
      AND "incomeObservationId" IS NULL
      AND "qualificationId" IS NULL
      AND "qualificationObservationId" IS NULL
      AND "clientCasePartyId" IS NULL
      AND "clientCasePropertyId" IS NULL
    )
  ),
  CONSTRAINT "CSFCDS_review_pair_ck" CHECK (
    ("reviewedAt" IS NULL AND "reviewedBySubject" IS NULL)
    OR ("reviewedAt" IS NOT NULL AND "reviewedBySubject" IS NOT NULL)
  )
);

CREATE UNIQUE INDEX "ClientCaseScenarioFinancialContextDraft_scenarioId_key" ON "ClientCaseScenarioFinancialContextDraft"("scenarioId");
CREATE UNIQUE INDEX "CSFCD_case_id_key" ON "ClientCaseScenarioFinancialContextDraft"("clientCaseId", "id");
CREATE UNIQUE INDEX "CSFCD_case_scenario_key" ON "ClientCaseScenarioFinancialContextDraft"("clientCaseId", "scenarioId");
CREATE UNIQUE INDEX "CSFCD_id_revision_key" ON "ClientCaseScenarioFinancialContextDraft"("id", "revision");
CREATE INDEX "CSFCD_owner_case_updated_idx" ON "ClientCaseScenarioFinancialContextDraft"("ownerAgentSubject", "clientCaseId", "updatedAt");
CREATE UNIQUE INDEX "ClientCaseScenario_clientCaseId_id_key" ON "ClientCaseScenario"("clientCaseId", "id");

CREATE UNIQUE INDEX "CSFCDS_case_id_key" ON "ClientCaseScenarioFinancialContextDraftSelection"("clientCaseId", "id");
CREATE UNIQUE INDEX "CSFCDS_draft_asset_key" ON "ClientCaseScenarioFinancialContextDraftSelection"("draftId", "assetId");
CREATE UNIQUE INDEX "CSFCDS_draft_liability_key" ON "ClientCaseScenarioFinancialContextDraftSelection"("draftId", "liabilityId");
CREATE UNIQUE INDEX "CSFCDS_draft_income_key" ON "ClientCaseScenarioFinancialContextDraftSelection"("draftId", "incomeSourceId");
CREATE UNIQUE INDEX "CSFCDS_draft_qualification_key" ON "ClientCaseScenarioFinancialContextDraftSelection"("draftId", "qualificationId");
CREATE UNIQUE INDEX "CSFCDS_draft_constraint_key" ON "ClientCaseScenarioFinancialContextDraftSelection"("draftId", "constraintId");
CREATE INDEX "CSFCDS_case_asset_obs_idx" ON "ClientCaseScenarioFinancialContextDraftSelection"("clientCaseId", "assetObservationId");
CREATE INDEX "CSFCDS_case_liability_obs_idx" ON "ClientCaseScenarioFinancialContextDraftSelection"("clientCaseId", "liabilityObservationId");
CREATE INDEX "CSFCDS_case_income_obs_idx" ON "ClientCaseScenarioFinancialContextDraftSelection"("clientCaseId", "incomeObservationId");
CREATE INDEX "CSFCDS_case_qualification_obs_idx" ON "ClientCaseScenarioFinancialContextDraftSelection"("clientCaseId", "qualificationObservationId");
CREATE INDEX "CSFCDS_case_constraint_obs_idx" ON "ClientCaseScenarioFinancialContextDraftSelection"("clientCaseId", "constraintObservationId");
CREATE INDEX "CSFCDS_draft_domain_idx" ON "ClientCaseScenarioFinancialContextDraftSelection"("draftId", "domain");

ALTER TABLE "ClientCaseScenarioFinancialContextDraft" ADD CONSTRAINT "CSFCD_case_owner_fk" FOREIGN KEY ("clientCaseId", "ownerAgentSubject") REFERENCES "ClientCase"("id", "ownerAgentSubject") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseScenarioFinancialContextDraft" ADD CONSTRAINT "CSFCD_scenario_fk" FOREIGN KEY ("clientCaseId", "scenarioId") REFERENCES "ClientCaseScenario"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseScenarioFinancialContextDraftSelection" ADD CONSTRAINT "CSFCDS_draft_fk" FOREIGN KEY ("clientCaseId", "draftId") REFERENCES "ClientCaseScenarioFinancialContextDraft"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseScenarioFinancialContextDraftSelection" ADD CONSTRAINT "CSFCDS_asset_fk" FOREIGN KEY ("clientCaseId", "assetId") REFERENCES "ClientFinancialAsset"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseScenarioFinancialContextDraftSelection" ADD CONSTRAINT "CSFCDS_asset_obs_fk" FOREIGN KEY ("clientCaseId", "assetObservationId") REFERENCES "ClientFinancialAssetObservation"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseScenarioFinancialContextDraftSelection" ADD CONSTRAINT "CSFCDS_liability_fk" FOREIGN KEY ("clientCaseId", "liabilityId") REFERENCES "ClientFinancialLiability"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseScenarioFinancialContextDraftSelection" ADD CONSTRAINT "CSFCDS_liability_obs_fk" FOREIGN KEY ("clientCaseId", "liabilityObservationId") REFERENCES "ClientFinancialLiabilityObservation"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseScenarioFinancialContextDraftSelection" ADD CONSTRAINT "CSFCDS_income_fk" FOREIGN KEY ("clientCaseId", "incomeSourceId") REFERENCES "ClientFinancialIncomeSource"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseScenarioFinancialContextDraftSelection" ADD CONSTRAINT "CSFCDS_income_obs_fk" FOREIGN KEY ("clientCaseId", "incomeObservationId") REFERENCES "ClientFinancialIncomeObservation"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseScenarioFinancialContextDraftSelection" ADD CONSTRAINT "CSFCDS_qualification_fk" FOREIGN KEY ("clientCaseId", "qualificationId") REFERENCES "ClientFinancialQualification"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseScenarioFinancialContextDraftSelection" ADD CONSTRAINT "CSFCDS_qualification_obs_fk" FOREIGN KEY ("clientCaseId", "qualificationObservationId") REFERENCES "ClientFinancialQualificationObservation"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseScenarioFinancialContextDraftSelection" ADD CONSTRAINT "CSFCDS_constraint_fk" FOREIGN KEY ("clientCaseId", "constraintId") REFERENCES "ClientFinancialConstraint"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseScenarioFinancialContextDraftSelection" ADD CONSTRAINT "CSFCDS_constraint_obs_fk" FOREIGN KEY ("clientCaseId", "constraintObservationId") REFERENCES "ClientFinancialConstraintObservation"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseScenarioFinancialContextDraftSelection" ADD CONSTRAINT "CSFCDS_party_fk" FOREIGN KEY ("clientCaseId", "clientCasePartyId") REFERENCES "ClientCaseParty"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseScenarioFinancialContextDraftSelection" ADD CONSTRAINT "CSFCDS_property_fk" FOREIGN KEY ("clientCaseId", "clientCasePropertyId") REFERENCES "ClientCaseProperty"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseScenarioFinancialContextDraftSelection" ADD CONSTRAINT "CSFCDS_source_fk" FOREIGN KEY ("clientCaseId", "financialSourceId") REFERENCES "ClientFinancialSource"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientCaseScenarioFinancialContextDraftSelection" ADD CONSTRAINT "CSFCDS_governed_source_fk" FOREIGN KEY ("clientCaseId", "clientCaseGovernedSourceId") REFERENCES "ClientCaseGovernedSource"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
