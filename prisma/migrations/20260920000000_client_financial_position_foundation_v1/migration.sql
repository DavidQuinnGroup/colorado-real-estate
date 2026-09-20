-- PROJECT ATLAS CLIENT_FINANCIAL_POSITION_FOUNDATION_V1
-- Additive Client Case-owned financial facts. No business-data DML or backfill.

CREATE TYPE "ClientFinancialAssetCategory" AS ENUM ('CASH', 'LIQUID_INVESTMENT', 'RETIREMENT_ACCESSIBLE', 'OTHER_AVAILABLE_RESOURCE');
CREATE TYPE "ClientFinancialLiabilityCategory" AS ENUM ('MORTGAGE', 'HELOC', 'AUTO_LOAN', 'STUDENT_LOAN', 'CREDIT_CARD', 'PERSONAL_LOAN', 'OTHER');
CREATE TYPE "ClientFinancialIncomeCategory" AS ENUM ('SALARY', 'SELF_EMPLOYMENT', 'COMMISSION', 'BONUS', 'RENTAL', 'OTHER');
CREATE TYPE "ClientFinancialFrequency" AS ENUM ('WEEKLY', 'BIWEEKLY', 'SEMIMONTHLY', 'MONTHLY', 'QUARTERLY', 'ANNUAL');
CREATE TYPE "ClientFinancialQualificationType" AS ENUM ('PREAPPROVAL', 'PREQUALIFICATION', 'OTHER_LENDER_QUALIFICATION');
CREATE TYPE "ClientFinancialConstraintType" AS ENUM ('MINIMUM_RETAINED_LIQUIDITY', 'MAXIMUM_CASH_DEPLOYMENT', 'MAXIMUM_COMFORTABLE_HOUSING_PAYMENT');
CREATE TYPE "ClientFinancialSourceKind" AS ENUM ('EVIDENCE', 'PROFESSIONAL_INPUT');
CREATE TYPE "ClientFinancialSourcePosture" AS ENUM ('CLIENT_STATED', 'AGENT_ENTERED_FROM_CLIENT', 'PROFESSIONAL_PROVIDED', 'DOCUMENT_SUPPORTED', 'SYSTEM_DERIVED_CANONICAL');
CREATE TYPE "ClientFinancialVerificationState" AS ENUM ('UNVERIFIED', 'CLIENT_CONFIRMED', 'DOCUMENT_SUPPORTED', 'PROFESSIONAL_CONFIRMED');
CREATE TYPE "ClientFinancialObservationKind" AS ENUM ('REPORTED', 'CORRECTION');

CREATE TABLE "ClientFinancialPosition" (
  "id" TEXT NOT NULL,
  "clientCaseId" TEXT NOT NULL,
  "createdBySubject" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ClientFinancialPosition_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ClientFinancialSource" (
  "id" TEXT NOT NULL,
  "clientCaseId" TEXT NOT NULL,
  "financialPositionId" TEXT NOT NULL,
  "kind" "ClientFinancialSourceKind" NOT NULL,
  "evidenceAdmissionId" TEXT,
  "professionalInputId" TEXT,
  "createdBySubject" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ClientFinancialSource_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ClientFinancialAsset" (
  "id" TEXT NOT NULL,
  "clientCaseId" TEXT NOT NULL,
  "financialPositionId" TEXT NOT NULL,
  "clientCasePartyId" TEXT,
  "category" "ClientFinancialAssetCategory" NOT NULL,
  "label" TEXT NOT NULL,
  "createdBySubject" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ClientFinancialAsset_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ClientFinancialAssetObservation" (
  "id" TEXT NOT NULL,
  "clientCaseId" TEXT NOT NULL,
  "assetId" TEXT NOT NULL,
  "financialSourceId" TEXT,
  "marketValueCents" BIGINT,
  "liquidValueCents" BIGINT,
  "availableAmountCents" BIGINT,
  "currencyCode" TEXT NOT NULL DEFAULT 'USD',
  "sourcePosture" "ClientFinancialSourcePosture" NOT NULL,
  "verificationState" "ClientFinancialVerificationState" NOT NULL,
  "observationKind" "ClientFinancialObservationKind" NOT NULL DEFAULT 'REPORTED',
  "limitation" TEXT,
  "asOf" TIMESTAMP(3) NOT NULL,
  "observedAt" TIMESTAMP(3),
  "effectiveAt" TIMESTAMP(3),
  "reviewAfter" TIMESTAMP(3),
  "supersedesObservationId" TEXT,
  "supersededAt" TIMESTAMP(3),
  "createdBySubject" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ClientFinancialAssetObservation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ClientFinancialLiability" (
  "id" TEXT NOT NULL,
  "clientCaseId" TEXT NOT NULL,
  "financialPositionId" TEXT NOT NULL,
  "clientCasePartyId" TEXT,
  "clientCasePropertyId" TEXT,
  "category" "ClientFinancialLiabilityCategory" NOT NULL,
  "label" TEXT NOT NULL,
  "createdBySubject" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ClientFinancialLiability_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ClientFinancialLiabilityObservation" (
  "id" TEXT NOT NULL,
  "clientCaseId" TEXT NOT NULL,
  "liabilityId" TEXT NOT NULL,
  "financialSourceId" TEXT,
  "currentBalanceCents" BIGINT,
  "monthlyObligationCents" BIGINT,
  "rateBps" INTEGER,
  "currencyCode" TEXT NOT NULL DEFAULT 'USD',
  "sourcePosture" "ClientFinancialSourcePosture" NOT NULL,
  "verificationState" "ClientFinancialVerificationState" NOT NULL,
  "observationKind" "ClientFinancialObservationKind" NOT NULL DEFAULT 'REPORTED',
  "limitation" TEXT,
  "asOf" TIMESTAMP(3) NOT NULL,
  "observedAt" TIMESTAMP(3),
  "effectiveAt" TIMESTAMP(3),
  "reviewAfter" TIMESTAMP(3),
  "supersedesObservationId" TEXT,
  "supersededAt" TIMESTAMP(3),
  "createdBySubject" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ClientFinancialLiabilityObservation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ClientFinancialIncomeSource" (
  "id" TEXT NOT NULL,
  "clientCaseId" TEXT NOT NULL,
  "financialPositionId" TEXT NOT NULL,
  "clientCasePartyId" TEXT,
  "clientCasePropertyId" TEXT,
  "category" "ClientFinancialIncomeCategory" NOT NULL,
  "label" TEXT NOT NULL,
  "createdBySubject" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ClientFinancialIncomeSource_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ClientFinancialIncomeObservation" (
  "id" TEXT NOT NULL,
  "clientCaseId" TEXT NOT NULL,
  "incomeSourceId" TEXT NOT NULL,
  "financialSourceId" TEXT,
  "amountCents" BIGINT NOT NULL,
  "frequency" "ClientFinancialFrequency" NOT NULL,
  "currencyCode" TEXT NOT NULL DEFAULT 'USD',
  "sourcePosture" "ClientFinancialSourcePosture" NOT NULL,
  "verificationState" "ClientFinancialVerificationState" NOT NULL,
  "observationKind" "ClientFinancialObservationKind" NOT NULL DEFAULT 'REPORTED',
  "limitation" TEXT,
  "asOf" TIMESTAMP(3) NOT NULL,
  "observedAt" TIMESTAMP(3),
  "effectiveAt" TIMESTAMP(3),
  "reviewAfter" TIMESTAMP(3),
  "supersedesObservationId" TEXT,
  "supersededAt" TIMESTAMP(3),
  "createdBySubject" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ClientFinancialIncomeObservation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ClientFinancialQualification" (
  "id" TEXT NOT NULL,
  "clientCaseId" TEXT NOT NULL,
  "financialPositionId" TEXT NOT NULL,
  "qualificationType" "ClientFinancialQualificationType" NOT NULL,
  "label" TEXT NOT NULL,
  "createdBySubject" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ClientFinancialQualification_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ClientFinancialQualificationObservation" (
  "id" TEXT NOT NULL,
  "clientCaseId" TEXT NOT NULL,
  "qualificationId" TEXT NOT NULL,
  "financialSourceId" TEXT,
  "maximumLoanAmountCents" BIGINT,
  "maximumPurchaseAmountCents" BIGINT,
  "rateBps" INTEGER,
  "programLabel" TEXT,
  "conditions" TEXT,
  "currencyCode" TEXT NOT NULL DEFAULT 'USD',
  "sourcePosture" "ClientFinancialSourcePosture" NOT NULL,
  "verificationState" "ClientFinancialVerificationState" NOT NULL,
  "observationKind" "ClientFinancialObservationKind" NOT NULL DEFAULT 'REPORTED',
  "limitation" TEXT,
  "asOf" TIMESTAMP(3) NOT NULL,
  "observedAt" TIMESTAMP(3),
  "effectiveAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3),
  "reviewAfter" TIMESTAMP(3),
  "supersedesObservationId" TEXT,
  "supersededAt" TIMESTAMP(3),
  "createdBySubject" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ClientFinancialQualificationObservation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ClientFinancialConstraint" (
  "id" TEXT NOT NULL,
  "clientCaseId" TEXT NOT NULL,
  "financialPositionId" TEXT NOT NULL,
  "constraintType" "ClientFinancialConstraintType" NOT NULL,
  "createdBySubject" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ClientFinancialConstraint_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ClientFinancialConstraintObservation" (
  "id" TEXT NOT NULL,
  "clientCaseId" TEXT NOT NULL,
  "constraintId" TEXT NOT NULL,
  "financialSourceId" TEXT,
  "amountCents" BIGINT NOT NULL,
  "currencyCode" TEXT NOT NULL DEFAULT 'USD',
  "sourcePosture" "ClientFinancialSourcePosture" NOT NULL,
  "verificationState" "ClientFinancialVerificationState" NOT NULL,
  "observationKind" "ClientFinancialObservationKind" NOT NULL DEFAULT 'REPORTED',
  "limitation" TEXT,
  "asOf" TIMESTAMP(3) NOT NULL,
  "observedAt" TIMESTAMP(3),
  "effectiveAt" TIMESTAMP(3),
  "reviewAfter" TIMESTAMP(3),
  "supersedesObservationId" TEXT,
  "supersededAt" TIMESTAMP(3),
  "createdBySubject" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ClientFinancialConstraintObservation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ClientFinancialPosition_clientCaseId_key" ON "ClientFinancialPosition"("clientCaseId");
CREATE UNIQUE INDEX "ClientFinancialPosition_clientCaseId_id_key" ON "ClientFinancialPosition"("clientCaseId", "id");
CREATE UNIQUE INDEX "ClientFinancialSource_evidenceAdmissionId_key" ON "ClientFinancialSource"("evidenceAdmissionId");
CREATE UNIQUE INDEX "ClientFinancialSource_professionalInputId_key" ON "ClientFinancialSource"("professionalInputId");
CREATE UNIQUE INDEX "ClientFinancialSource_clientCaseId_id_key" ON "ClientFinancialSource"("clientCaseId", "id");
CREATE INDEX "ClientFinancialSource_clientCaseId_createdAt_idx" ON "ClientFinancialSource"("clientCaseId", "createdAt");
CREATE UNIQUE INDEX "ClientFinancialAsset_clientCaseId_id_key" ON "ClientFinancialAsset"("clientCaseId", "id");
CREATE INDEX "ClientFinancialAsset_clientCaseId_category_createdAt_idx" ON "ClientFinancialAsset"("clientCaseId", "category", "createdAt");
CREATE INDEX "ClientFinancialAssetObservation_clientCaseId_assetId_supersededAt_asOf_idx" ON "ClientFinancialAssetObservation"("clientCaseId", "assetId", "supersededAt", "asOf");
CREATE INDEX "ClientFinancialAssetObservation_clientCaseId_financialSourceId_idx" ON "ClientFinancialAssetObservation"("clientCaseId", "financialSourceId");
CREATE UNIQUE INDEX "ClientFinancialAssetObservation_supersedesObservationId_key" ON "ClientFinancialAssetObservation"("supersedesObservationId");
CREATE UNIQUE INDEX "ClientFinancialLiability_clientCaseId_id_key" ON "ClientFinancialLiability"("clientCaseId", "id");
CREATE INDEX "ClientFinancialLiability_clientCaseId_category_createdAt_idx" ON "ClientFinancialLiability"("clientCaseId", "category", "createdAt");
CREATE INDEX "ClientFinancialLiability_clientCaseId_clientCasePropertyId_idx" ON "ClientFinancialLiability"("clientCaseId", "clientCasePropertyId");
CREATE INDEX "ClientFinancialLiabilityObservation_clientCaseId_liabilityId_supersededAt_asOf_idx" ON "ClientFinancialLiabilityObservation"("clientCaseId", "liabilityId", "supersededAt", "asOf");
CREATE INDEX "ClientFinancialLiabilityObservation_clientCaseId_financialSourceId_idx" ON "ClientFinancialLiabilityObservation"("clientCaseId", "financialSourceId");
CREATE UNIQUE INDEX "ClientFinancialLiabilityObservation_supersedesObservationId_key" ON "ClientFinancialLiabilityObservation"("supersedesObservationId");
CREATE UNIQUE INDEX "ClientFinancialIncomeSource_clientCaseId_id_key" ON "ClientFinancialIncomeSource"("clientCaseId", "id");
CREATE INDEX "ClientFinancialIncomeSource_clientCaseId_category_createdAt_idx" ON "ClientFinancialIncomeSource"("clientCaseId", "category", "createdAt");
CREATE INDEX "ClientFinancialIncomeObservation_clientCaseId_incomeSourceId_supersededAt_asOf_idx" ON "ClientFinancialIncomeObservation"("clientCaseId", "incomeSourceId", "supersededAt", "asOf");
CREATE INDEX "ClientFinancialIncomeObservation_clientCaseId_financialSourceId_idx" ON "ClientFinancialIncomeObservation"("clientCaseId", "financialSourceId");
CREATE UNIQUE INDEX "ClientFinancialIncomeObservation_supersedesObservationId_key" ON "ClientFinancialIncomeObservation"("supersedesObservationId");
CREATE UNIQUE INDEX "ClientFinancialQualification_clientCaseId_id_key" ON "ClientFinancialQualification"("clientCaseId", "id");
CREATE INDEX "ClientFinancialQualification_clientCaseId_qualificationType_createdAt_idx" ON "ClientFinancialQualification"("clientCaseId", "qualificationType", "createdAt");
CREATE INDEX "ClientFinancialQualificationObservation_clientCaseId_qualificationId_supersededAt_expiresAt_idx" ON "ClientFinancialQualificationObservation"("clientCaseId", "qualificationId", "supersededAt", "expiresAt");
CREATE INDEX "ClientFinancialQualificationObservation_clientCaseId_financialSourceId_idx" ON "ClientFinancialQualificationObservation"("clientCaseId", "financialSourceId");
CREATE UNIQUE INDEX "ClientFinancialQualificationObservation_supersedesObservationId_key" ON "ClientFinancialQualificationObservation"("supersedesObservationId");
CREATE UNIQUE INDEX "ClientFinancialConstraint_clientCaseId_id_key" ON "ClientFinancialConstraint"("clientCaseId", "id");
CREATE INDEX "ClientFinancialConstraint_clientCaseId_constraintType_createdAt_idx" ON "ClientFinancialConstraint"("clientCaseId", "constraintType", "createdAt");
CREATE INDEX "ClientFinancialConstraintObservation_clientCaseId_constraintId_supersededAt_asOf_idx" ON "ClientFinancialConstraintObservation"("clientCaseId", "constraintId", "supersededAt", "asOf");
CREATE INDEX "ClientFinancialConstraintObservation_clientCaseId_financialSourceId_idx" ON "ClientFinancialConstraintObservation"("clientCaseId", "financialSourceId");
CREATE UNIQUE INDEX "ClientFinancialConstraintObservation_supersedesObservationId_key" ON "ClientFinancialConstraintObservation"("supersedesObservationId");
CREATE UNIQUE INDEX "ClientCaseParty_clientCaseId_id_key" ON "ClientCaseParty"("clientCaseId", "id");

ALTER TABLE "ClientFinancialPosition" ADD CONSTRAINT "ClientFinancialPosition_clientCaseId_fkey" FOREIGN KEY ("clientCaseId") REFERENCES "ClientCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientFinancialSource" ADD CONSTRAINT "ClientFinancialSource_clientCaseId_financialPositionId_fkey" FOREIGN KEY ("clientCaseId", "financialPositionId") REFERENCES "ClientFinancialPosition"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientFinancialSource" ADD CONSTRAINT "ClientFinancialSource_evidenceAdmissionId_fkey" FOREIGN KEY ("evidenceAdmissionId") REFERENCES "EvidenceAdmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientFinancialSource" ADD CONSTRAINT "ClientFinancialSource_professionalInputId_fkey" FOREIGN KEY ("professionalInputId") REFERENCES "ProfessionalInput"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientFinancialAsset" ADD CONSTRAINT "ClientFinancialAsset_clientCaseId_financialPositionId_fkey" FOREIGN KEY ("clientCaseId", "financialPositionId") REFERENCES "ClientFinancialPosition"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientFinancialAsset" ADD CONSTRAINT "ClientFinancialAsset_clientCaseId_clientCasePartyId_fkey" FOREIGN KEY ("clientCaseId", "clientCasePartyId") REFERENCES "ClientCaseParty"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientFinancialLiability" ADD CONSTRAINT "ClientFinancialLiability_clientCaseId_financialPositionId_fkey" FOREIGN KEY ("clientCaseId", "financialPositionId") REFERENCES "ClientFinancialPosition"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientFinancialLiability" ADD CONSTRAINT "ClientFinancialLiability_clientCaseId_clientCasePartyId_fkey" FOREIGN KEY ("clientCaseId", "clientCasePartyId") REFERENCES "ClientCaseParty"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientFinancialLiability" ADD CONSTRAINT "ClientFinancialLiability_clientCaseId_clientCasePropertyId_fkey" FOREIGN KEY ("clientCaseId", "clientCasePropertyId") REFERENCES "ClientCaseProperty"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientFinancialIncomeSource" ADD CONSTRAINT "ClientFinancialIncomeSource_clientCaseId_financialPositionId_fkey" FOREIGN KEY ("clientCaseId", "financialPositionId") REFERENCES "ClientFinancialPosition"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientFinancialIncomeSource" ADD CONSTRAINT "ClientFinancialIncomeSource_clientCaseId_clientCasePartyId_fkey" FOREIGN KEY ("clientCaseId", "clientCasePartyId") REFERENCES "ClientCaseParty"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientFinancialIncomeSource" ADD CONSTRAINT "ClientFinancialIncomeSource_clientCaseId_clientCasePropertyId_fkey" FOREIGN KEY ("clientCaseId", "clientCasePropertyId") REFERENCES "ClientCaseProperty"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientFinancialQualification" ADD CONSTRAINT "ClientFinancialQualification_clientCaseId_financialPositionId_fkey" FOREIGN KEY ("clientCaseId", "financialPositionId") REFERENCES "ClientFinancialPosition"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientFinancialConstraint" ADD CONSTRAINT "ClientFinancialConstraint_clientCaseId_financialPositionId_fkey" FOREIGN KEY ("clientCaseId", "financialPositionId") REFERENCES "ClientFinancialPosition"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ClientFinancialAssetObservation" ADD CONSTRAINT "ClientFinancialAssetObservation_clientCaseId_assetId_fkey" FOREIGN KEY ("clientCaseId", "assetId") REFERENCES "ClientFinancialAsset"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientFinancialAssetObservation" ADD CONSTRAINT "ClientFinancialAssetObservation_clientCaseId_financialSourceId_fkey" FOREIGN KEY ("clientCaseId", "financialSourceId") REFERENCES "ClientFinancialSource"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientFinancialAssetObservation" ADD CONSTRAINT "ClientFinancialAssetObservation_supersedesObservationId_fkey" FOREIGN KEY ("supersedesObservationId") REFERENCES "ClientFinancialAssetObservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientFinancialLiabilityObservation" ADD CONSTRAINT "ClientFinancialLiabilityObservation_clientCaseId_liabilityId_fkey" FOREIGN KEY ("clientCaseId", "liabilityId") REFERENCES "ClientFinancialLiability"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientFinancialLiabilityObservation" ADD CONSTRAINT "ClientFinancialLiabilityObservation_clientCaseId_financialSourceId_fkey" FOREIGN KEY ("clientCaseId", "financialSourceId") REFERENCES "ClientFinancialSource"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientFinancialLiabilityObservation" ADD CONSTRAINT "ClientFinancialLiabilityObservation_supersedesObservationId_fkey" FOREIGN KEY ("supersedesObservationId") REFERENCES "ClientFinancialLiabilityObservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientFinancialIncomeObservation" ADD CONSTRAINT "ClientFinancialIncomeObservation_clientCaseId_incomeSourceId_fkey" FOREIGN KEY ("clientCaseId", "incomeSourceId") REFERENCES "ClientFinancialIncomeSource"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientFinancialIncomeObservation" ADD CONSTRAINT "ClientFinancialIncomeObservation_clientCaseId_financialSourceId_fkey" FOREIGN KEY ("clientCaseId", "financialSourceId") REFERENCES "ClientFinancialSource"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientFinancialIncomeObservation" ADD CONSTRAINT "ClientFinancialIncomeObservation_supersedesObservationId_fkey" FOREIGN KEY ("supersedesObservationId") REFERENCES "ClientFinancialIncomeObservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientFinancialQualificationObservation" ADD CONSTRAINT "ClientFinancialQualificationObservation_clientCaseId_qualificationId_fkey" FOREIGN KEY ("clientCaseId", "qualificationId") REFERENCES "ClientFinancialQualification"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientFinancialQualificationObservation" ADD CONSTRAINT "ClientFinancialQualificationObservation_clientCaseId_financialSourceId_fkey" FOREIGN KEY ("clientCaseId", "financialSourceId") REFERENCES "ClientFinancialSource"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientFinancialQualificationObservation" ADD CONSTRAINT "ClientFinancialQualificationObservation_supersedesObservationId_fkey" FOREIGN KEY ("supersedesObservationId") REFERENCES "ClientFinancialQualificationObservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientFinancialConstraintObservation" ADD CONSTRAINT "ClientFinancialConstraintObservation_clientCaseId_constraintId_fkey" FOREIGN KEY ("clientCaseId", "constraintId") REFERENCES "ClientFinancialConstraint"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientFinancialConstraintObservation" ADD CONSTRAINT "ClientFinancialConstraintObservation_clientCaseId_financialSourceId_fkey" FOREIGN KEY ("clientCaseId", "financialSourceId") REFERENCES "ClientFinancialSource"("clientCaseId", "id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClientFinancialConstraintObservation" ADD CONSTRAINT "ClientFinancialConstraintObservation_supersedesObservationId_fkey" FOREIGN KEY ("supersedesObservationId") REFERENCES "ClientFinancialConstraintObservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ClientFinancialSource" ADD CONSTRAINT "ClientFinancialSource_shape_ck" CHECK (
  ("kind" = 'EVIDENCE' AND "evidenceAdmissionId" IS NOT NULL AND "professionalInputId" IS NULL)
  OR ("kind" = 'PROFESSIONAL_INPUT' AND "professionalInputId" IS NOT NULL AND "evidenceAdmissionId" IS NULL)
);
ALTER TABLE "ClientFinancialAssetObservation" ADD CONSTRAINT "ClientFinancialAssetObservation_values_ck" CHECK (
  ("marketValueCents" IS NOT NULL OR "liquidValueCents" IS NOT NULL OR "availableAmountCents" IS NOT NULL)
  AND ("marketValueCents" IS NULL OR "marketValueCents" >= 0)
  AND ("liquidValueCents" IS NULL OR "liquidValueCents" >= 0)
  AND ("availableAmountCents" IS NULL OR "availableAmountCents" >= 0)
  AND "currencyCode" = 'USD'
  AND ("limitation" IS NULL OR length("limitation") <= 500)
);
ALTER TABLE "ClientFinancialLiabilityObservation" ADD CONSTRAINT "ClientFinancialLiabilityObservation_values_ck" CHECK (
  ("currentBalanceCents" IS NOT NULL OR "monthlyObligationCents" IS NOT NULL)
  AND ("currentBalanceCents" IS NULL OR "currentBalanceCents" >= 0)
  AND ("monthlyObligationCents" IS NULL OR "monthlyObligationCents" >= 0)
  AND ("rateBps" IS NULL OR ("rateBps" >= 0 AND "rateBps" <= 100000))
  AND "currencyCode" = 'USD'
  AND ("limitation" IS NULL OR length("limitation") <= 500)
);
ALTER TABLE "ClientFinancialIncomeObservation" ADD CONSTRAINT "ClientFinancialIncomeObservation_values_ck" CHECK (
  "amountCents" >= 0 AND "currencyCode" = 'USD' AND ("limitation" IS NULL OR length("limitation") <= 500)
);
ALTER TABLE "ClientFinancialQualificationObservation" ADD CONSTRAINT "ClientFinancialQualificationObservation_values_ck" CHECK (
  ("maximumLoanAmountCents" IS NOT NULL OR "maximumPurchaseAmountCents" IS NOT NULL)
  AND ("maximumLoanAmountCents" IS NULL OR "maximumLoanAmountCents" >= 0)
  AND ("maximumPurchaseAmountCents" IS NULL OR "maximumPurchaseAmountCents" >= 0)
  AND ("rateBps" IS NULL OR ("rateBps" >= 0 AND "rateBps" <= 100000))
  AND "currencyCode" = 'USD'
  AND ("expiresAt" IS NULL OR "effectiveAt" IS NULL OR "expiresAt" >= "effectiveAt")
  AND ("limitation" IS NULL OR length("limitation") <= 500)
  AND ("programLabel" IS NULL OR length("programLabel") <= 160)
  AND ("conditions" IS NULL OR length("conditions") <= 1000)
);
ALTER TABLE "ClientFinancialConstraintObservation" ADD CONSTRAINT "ClientFinancialConstraintObservation_values_ck" CHECK (
  "amountCents" >= 0 AND "currencyCode" = 'USD' AND ("limitation" IS NULL OR length("limitation") <= 500)
);

CREATE UNIQUE INDEX "CFPAO_one_current_per_asset_uq" ON "ClientFinancialAssetObservation"("assetId") WHERE "supersededAt" IS NULL;
CREATE UNIQUE INDEX "CFPLO_one_current_per_liability_uq" ON "ClientFinancialLiabilityObservation"("liabilityId") WHERE "supersededAt" IS NULL;
CREATE UNIQUE INDEX "CFPIO_one_current_per_income_source_uq" ON "ClientFinancialIncomeObservation"("incomeSourceId") WHERE "supersededAt" IS NULL;
CREATE UNIQUE INDEX "CFPQO_one_current_per_qualification_uq" ON "ClientFinancialQualificationObservation"("qualificationId") WHERE "supersededAt" IS NULL;
CREATE UNIQUE INDEX "CFPCO_one_current_per_constraint_uq" ON "ClientFinancialConstraintObservation"("constraintId") WHERE "supersededAt" IS NULL;
