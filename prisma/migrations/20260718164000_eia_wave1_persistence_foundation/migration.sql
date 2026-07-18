-- CreateEnum
CREATE TYPE "EIAEnvironment" AS ENUM ('PRODUCTION', 'PREVIEW', 'DEVELOPMENT', 'TEST', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "EIADataOrigin" AS ENUM ('LIVE', 'FIXTURE', 'MANUAL', 'IMPORTED', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "EIAConfidence" AS ENUM ('HIGH', 'MEDIUM', 'LOW', 'INSUFFICIENT');

-- CreateEnum
CREATE TYPE "EIAFreshness" AS ENUM ('FRESH', 'AGING', 'STALE', 'UNKNOWN', 'NOT_APPLICABLE');

-- CreateEnum
CREATE TYPE "EIAPrivacy" AS ENUM ('INTERNAL', 'EXECUTIVE', 'SYSTEM');

-- CreateEnum
CREATE TYPE "EIASensitivity" AS ENUM ('PUBLIC_SAFE', 'INTERNAL', 'CONFIDENTIAL', 'RESTRICTED');

-- CreateEnum
CREATE TYPE "EIAPii" AS ENUM ('NONE', 'PSEUDONYMOUS', 'AGGREGATED', 'PERSONAL');

-- CreateEnum
CREATE TYPE "EIARetention" AS ENUM ('HISTORICAL', 'OPERATIONAL', 'AUDIT', 'TEMPORARY');

-- CreateEnum
CREATE TYPE "EIAImmutability" AS ENUM ('APPEND_ONLY', 'IMMUTABLE_VERSIONED', 'MUTABLE_WITH_HISTORY', 'REFERENCE_DATA');

-- CreateEnum
CREATE TYPE "EIAValueKind" AS ENUM ('NUMERIC', 'TEXT', 'BOOLEAN', 'RATIO', 'DURATION', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "EIAKpiStatus" AS ENUM ('HEALTHY', 'WARNING', 'CRITICAL', 'UNKNOWN', 'NOT_APPLICABLE');

-- CreateEnum
CREATE TYPE "EIAHealthClassification" AS ENUM ('HEALTHY', 'WATCH', 'DEGRADED', 'BLOCKED', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "EIASignalKind" AS ENUM ('RISK', 'OPPORTUNITY');

-- CreateEnum
CREATE TYPE "EIADispositionKind" AS ENUM ('APPROVE', 'REJECT', 'DEFER', 'REVISE', 'REQUEST_MORE_EVIDENCE', 'OVERRIDE_RECOMMENDATION', 'NO_DECISION');

-- CreateEnum
CREATE TYPE "EIAWorkflowState" AS ENUM ('PROPOSED', 'APPROVED', 'PLANNED', 'IN_PROGRESS', 'COMPLETED', 'PAUSED', 'CANCELLED', 'UNDER_REVIEW', 'NEEDS_REVIEW', 'DEFERRED', 'REJECTED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "EIAProvenance" (
    "id" TEXT NOT NULL,
    "sourceSystem" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceRecordId" TEXT,
    "sourceQueryRef" TEXT,
    "observationAt" TIMESTAMP(3),
    "ingestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "environment" "EIAEnvironment" NOT NULL,
    "dataOrigin" "EIADataOrigin" NOT NULL,
    "fixtureSet" TEXT,
    "fixtureScenario" TEXT,
    "calculationVersion" TEXT,
    "schemaVersion" TEXT NOT NULL,
    "domainModelVersion" TEXT,
    "canonVersion" TEXT,
    "repositoryVersion" TEXT,
    "confidence" "EIAConfidence" NOT NULL,
    "freshness" "EIAFreshness" NOT NULL,
    "privacy" "EIAPrivacy" NOT NULL,
    "sensitivity" "EIASensitivity" NOT NULL,
    "pii" "EIAPii" NOT NULL DEFAULT 'NONE',
    "retention" "EIARetention" NOT NULL,
    "creatingService" TEXT NOT NULL,
    "creatingAppVersion" TEXT,
    "supersedesId" TEXT,
    "correctionOfId" TEXT,
    "immutability" "EIAImmutability" NOT NULL DEFAULT 'APPEND_ONLY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "EIAProvenance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EIAEvidenceReference" (
    "id" TEXT NOT NULL,
    "evidenceKey" TEXT NOT NULL,
    "evidenceType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sourceSystem" TEXT NOT NULL,
    "sourceRecordId" TEXT,
    "sourceQueryRef" TEXT,
    "observedAt" TIMESTAMP(3),
    "repositoryObjectRid" TEXT,
    "contentHash" TEXT,
    "provenanceId" TEXT NOT NULL,
    "environment" "EIAEnvironment" NOT NULL,
    "dataOrigin" "EIADataOrigin" NOT NULL,
    "confidence" "EIAConfidence" NOT NULL,
    "freshness" "EIAFreshness" NOT NULL,
    "privacy" "EIAPrivacy" NOT NULL,
    "sensitivity" "EIASensitivity" NOT NULL,
    "pii" "EIAPii" NOT NULL DEFAULT 'NONE',
    "retention" "EIARetention" NOT NULL,
    "immutability" "EIAImmutability" NOT NULL DEFAULT 'APPEND_ONLY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archivedAt" TIMESTAMP(3),
    "supersedesId" TEXT,

    CONSTRAINT "EIAEvidenceReference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EIAEvidenceLink" (
    "id" TEXT NOT NULL,
    "evidenceId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EIAEvidenceLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EIAKpiObservation" (
    "id" TEXT NOT NULL,
    "kpiId" TEXT NOT NULL,
    "valueKind" "EIAValueKind" NOT NULL,
    "numericValue" DECIMAL(65,30),
    "textValue" TEXT,
    "booleanValue" BOOLEAN,
    "ratioNumerator" DECIMAL(65,30),
    "ratioDenominator" DECIMAL(65,30),
    "durationMs" INTEGER,
    "unavailableReason" TEXT,
    "unit" TEXT,
    "periodStart" TIMESTAMP(3),
    "periodEnd" TIMESTAMP(3),
    "observedAt" TIMESTAMP(3),
    "status" "EIAKpiStatus" NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "calculationVersion" TEXT NOT NULL,
    "schemaVersion" TEXT NOT NULL,
    "provenanceId" TEXT NOT NULL,
    "environment" "EIAEnvironment" NOT NULL,
    "dataOrigin" "EIADataOrigin" NOT NULL,
    "fixtureSet" TEXT,
    "fixtureScenario" TEXT,
    "confidence" "EIAConfidence" NOT NULL,
    "freshness" "EIAFreshness" NOT NULL,
    "privacy" "EIAPrivacy" NOT NULL,
    "sensitivity" "EIASensitivity" NOT NULL,
    "retention" "EIARetention" NOT NULL,
    "immutability" "EIAImmutability" NOT NULL DEFAULT 'APPEND_ONLY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archivedAt" TIMESTAMP(3),
    "supersedesId" TEXT,

    CONSTRAINT "EIAKpiObservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EIAKpiEvaluation" (
    "id" TEXT NOT NULL,
    "kpiId" TEXT NOT NULL,
    "observationId" TEXT NOT NULL,
    "status" "EIAKpiStatus" NOT NULL,
    "includedInHealth" BOOLEAN NOT NULL,
    "exclusionReason" TEXT,
    "calculationVersion" TEXT NOT NULL,
    "thresholdVersion" TEXT,
    "evaluatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idempotencyKey" TEXT NOT NULL,
    "provenanceId" TEXT NOT NULL,
    "environment" "EIAEnvironment" NOT NULL,
    "dataOrigin" "EIADataOrigin" NOT NULL,
    "confidence" "EIAConfidence" NOT NULL,
    "freshness" "EIAFreshness" NOT NULL,
    "privacy" "EIAPrivacy" NOT NULL,
    "sensitivity" "EIASensitivity" NOT NULL,
    "retention" "EIARetention" NOT NULL,
    "immutability" "EIAImmutability" NOT NULL DEFAULT 'APPEND_ONLY',
    "archivedAt" TIMESTAMP(3),
    "supersedesId" TEXT,

    CONSTRAINT "EIAKpiEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EIAKpiThresholdEvaluation" (
    "id" TEXT NOT NULL,
    "kpiEvaluationId" TEXT NOT NULL,
    "thresholdVersion" TEXT NOT NULL,
    "targetValue" DECIMAL(65,30),
    "warningValue" DECIMAL(65,30),
    "criticalValue" DECIMAL(65,30),
    "result" "EIAKpiStatus" NOT NULL,
    "evaluatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idempotencyKey" TEXT NOT NULL,
    "provenanceId" TEXT NOT NULL,
    "immutability" "EIAImmutability" NOT NULL DEFAULT 'APPEND_ONLY',

    CONSTRAINT "EIAKpiThresholdEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EIAKpiTransition" (
    "id" TEXT NOT NULL,
    "kpiId" TEXT NOT NULL,
    "previousObservationId" TEXT,
    "currentObservationId" TEXT NOT NULL,
    "previousStatus" "EIAKpiStatus" NOT NULL,
    "currentStatus" "EIAKpiStatus" NOT NULL,
    "effectiveAt" TIMESTAMP(3) NOT NULL,
    "transitionReason" TEXT NOT NULL,
    "calculationVersion" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "provenanceId" TEXT NOT NULL,
    "environment" "EIAEnvironment" NOT NULL,
    "dataOrigin" "EIADataOrigin" NOT NULL,
    "immutability" "EIAImmutability" NOT NULL DEFAULT 'APPEND_ONLY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EIAKpiTransition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EIAEnterpriseHealthSnapshot" (
    "id" TEXT NOT NULL,
    "snapshotKey" TEXT NOT NULL,
    "overallClassification" "EIAHealthClassification" NOT NULL,
    "overallScore" DECIMAL(65,30),
    "coveragePercentage" DECIMAL(65,30),
    "confidence" "EIAConfidence" NOT NULL,
    "freshness" "EIAFreshness" NOT NULL,
    "weightVersion" TEXT NOT NULL,
    "calculationVersion" TEXT NOT NULL,
    "schemaVersion" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL,
    "provenanceId" TEXT NOT NULL,
    "environment" "EIAEnvironment" NOT NULL,
    "dataOrigin" "EIADataOrigin" NOT NULL,
    "fixtureSet" TEXT,
    "fixtureScenario" TEXT,
    "immutability" "EIAImmutability" NOT NULL DEFAULT 'IMMUTABLE_VERSIONED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archivedAt" TIMESTAMP(3),
    "supersedesId" TEXT,

    CONSTRAINT "EIAEnterpriseHealthSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EIADomainHealthSnapshot" (
    "id" TEXT NOT NULL,
    "enterpriseSnapshotId" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "classification" "EIAHealthClassification" NOT NULL,
    "score" DECIMAL(65,30),
    "coveragePercentage" DECIMAL(65,30),
    "confidence" "EIAConfidence" NOT NULL,
    "freshness" "EIAFreshness" NOT NULL,
    "weightVersion" TEXT NOT NULL,
    "calculationVersion" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL,
    "provenanceId" TEXT NOT NULL,
    "environment" "EIAEnvironment" NOT NULL,
    "dataOrigin" "EIADataOrigin" NOT NULL,
    "immutability" "EIAImmutability" NOT NULL DEFAULT 'IMMUTABLE_VERSIONED',

    CONSTRAINT "EIADomainHealthSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EIAHealthContribution" (
    "id" TEXT NOT NULL,
    "enterpriseSnapshotId" TEXT NOT NULL,
    "domainSnapshotId" TEXT,
    "kpiObservationId" TEXT,
    "kpiEvaluationId" TEXT,
    "kpiId" TEXT NOT NULL,
    "contributionType" TEXT NOT NULL,
    "normalizedScore" DECIMAL(65,30),
    "weight" DECIMAL(65,30),
    "weightedScore" DECIMAL(65,30),
    "included" BOOLEAN NOT NULL,
    "exclusionReason" TEXT,
    "provenanceId" TEXT NOT NULL,
    "immutability" "EIAImmutability" NOT NULL DEFAULT 'APPEND_ONLY',

    CONSTRAINT "EIAHealthContribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EIAIntelligenceEvent" (
    "id" TEXT NOT NULL,
    "eventKey" TEXT NOT NULL,
    "eventClass" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "materiality" TEXT NOT NULL,
    "lifecycleStatus" TEXT,
    "detectionRuleVersion" TEXT NOT NULL,
    "calculationVersion" TEXT NOT NULL,
    "detectedAt" TIMESTAMP(3) NOT NULL,
    "healthSnapshotId" TEXT,
    "provenanceId" TEXT NOT NULL,
    "environment" "EIAEnvironment" NOT NULL,
    "dataOrigin" "EIADataOrigin" NOT NULL,
    "confidence" "EIAConfidence" NOT NULL,
    "freshness" "EIAFreshness" NOT NULL,
    "privacy" "EIAPrivacy" NOT NULL,
    "sensitivity" "EIASensitivity" NOT NULL,
    "retention" "EIARetention" NOT NULL,
    "immutability" "EIAImmutability" NOT NULL DEFAULT 'APPEND_ONLY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archivedAt" TIMESTAMP(3),
    "supersedesId" TEXT,

    CONSTRAINT "EIAIntelligenceEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EIAIntelligenceSignal" (
    "id" TEXT NOT NULL,
    "signalKey" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "signalKind" "EIASignalKind" NOT NULL,
    "condition" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "materiality" TEXT NOT NULL,
    "suggestedReviewArea" TEXT NOT NULL,
    "detectionRuleVersion" TEXT NOT NULL,
    "provenanceId" TEXT NOT NULL,
    "environment" "EIAEnvironment" NOT NULL,
    "dataOrigin" "EIADataOrigin" NOT NULL,
    "confidence" "EIAConfidence" NOT NULL,
    "freshness" "EIAFreshness" NOT NULL,
    "immutability" "EIAImmutability" NOT NULL DEFAULT 'APPEND_ONLY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EIAIntelligenceSignal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EIAExecutiveInsight" (
    "id" TEXT NOT NULL,
    "insightKey" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "executiveAudience" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "materiality" TEXT NOT NULL,
    "calculationVersion" TEXT NOT NULL,
    "provenanceId" TEXT NOT NULL,
    "environment" "EIAEnvironment" NOT NULL,
    "dataOrigin" "EIADataOrigin" NOT NULL,
    "confidence" "EIAConfidence" NOT NULL,
    "freshness" "EIAFreshness" NOT NULL,
    "privacy" "EIAPrivacy" NOT NULL DEFAULT 'EXECUTIVE',
    "sensitivity" "EIASensitivity" NOT NULL,
    "retention" "EIARetention" NOT NULL,
    "immutability" "EIAImmutability" NOT NULL DEFAULT 'APPEND_ONLY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EIAExecutiveInsight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EIADecisionSituation" (
    "id" TEXT NOT NULL,
    "situationKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "executiveQuestion" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "urgency" TEXT NOT NULL,
    "horizon" TEXT NOT NULL,
    "intelligenceEventId" TEXT,
    "decisionCriteriaVersion" TEXT,
    "provenanceId" TEXT NOT NULL,
    "environment" "EIAEnvironment" NOT NULL,
    "dataOrigin" "EIADataOrigin" NOT NULL,
    "confidence" "EIAConfidence" NOT NULL,
    "freshness" "EIAFreshness" NOT NULL,
    "privacy" "EIAPrivacy" NOT NULL DEFAULT 'EXECUTIVE',
    "sensitivity" "EIASensitivity" NOT NULL,
    "retention" "EIARetention" NOT NULL,
    "immutability" "EIAImmutability" NOT NULL DEFAULT 'APPEND_ONLY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "EIADecisionSituation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EIADecisionPackage" (
    "id" TEXT NOT NULL,
    "packageKey" TEXT NOT NULL,
    "situationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "calculationVersion" TEXT NOT NULL,
    "decisionCriteriaVersion" TEXT NOT NULL,
    "recommendationModelVersion" TEXT,
    "provenanceId" TEXT NOT NULL,
    "environment" "EIAEnvironment" NOT NULL,
    "dataOrigin" "EIADataOrigin" NOT NULL,
    "confidence" "EIAConfidence" NOT NULL,
    "freshness" "EIAFreshness" NOT NULL,
    "privacy" "EIAPrivacy" NOT NULL DEFAULT 'EXECUTIVE',
    "sensitivity" "EIASensitivity" NOT NULL,
    "retention" "EIARetention" NOT NULL,
    "immutability" "EIAImmutability" NOT NULL DEFAULT 'APPEND_ONLY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archivedAt" TIMESTAMP(3),
    "supersedesId" TEXT,

    CONSTRAINT "EIADecisionPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EIADecisionOption" (
    "id" TEXT NOT NULL,
    "optionKey" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "optionType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "proposedAction" TEXT NOT NULL,
    "reversibility" TEXT,
    "provenanceId" TEXT NOT NULL,
    "immutability" "EIAImmutability" NOT NULL DEFAULT 'APPEND_ONLY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EIADecisionOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EIADecisionCriterion" (
    "id" TEXT NOT NULL,
    "criterionKey" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "weight" DECIMAL(65,30) NOT NULL,
    "direction" TEXT NOT NULL,
    "provisional" BOOLEAN NOT NULL DEFAULT true,
    "immutability" "EIAImmutability" NOT NULL DEFAULT 'REFERENCE_DATA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "EIADecisionCriterion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EIADecisionScore" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "criterionId" TEXT NOT NULL,
    "rawAssessment" TEXT NOT NULL,
    "normalizedScore" DECIMAL(65,30),
    "weightedContribution" DECIMAL(65,30),
    "coveragePercentage" DECIMAL(65,30),
    "calculationVersion" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "provenanceId" TEXT NOT NULL,
    "confidence" "EIAConfidence" NOT NULL,
    "immutability" "EIAImmutability" NOT NULL DEFAULT 'APPEND_ONLY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EIADecisionScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EIADecisionRecommendation" (
    "id" TEXT NOT NULL,
    "recommendationKey" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "recommendedOptionId" TEXT,
    "kind" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "calculationVersion" TEXT NOT NULL,
    "modelVersion" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "provenanceId" TEXT NOT NULL,
    "confidence" "EIAConfidence" NOT NULL,
    "privacy" "EIAPrivacy" NOT NULL DEFAULT 'EXECUTIVE',
    "sensitivity" "EIASensitivity" NOT NULL,
    "retention" "EIARetention" NOT NULL,
    "immutability" "EIAImmutability" NOT NULL DEFAULT 'APPEND_ONLY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "supersedesId" TEXT,

    CONSTRAINT "EIADecisionRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EIADecisionReviewSchedule" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "reviewAt" TIMESTAMP(3) NOT NULL,
    "trigger" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "ownerRole" TEXT NOT NULL,
    "immutability" "EIAImmutability" NOT NULL DEFAULT 'APPEND_ONLY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EIADecisionReviewSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EIADecisionDisposition" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "dispositionKind" "EIADispositionKind" NOT NULL,
    "selectedOptionId" TEXT,
    "rationale" TEXT NOT NULL,
    "authority" TEXT NOT NULL,
    "officialDecision" BOOLEAN NOT NULL DEFAULT false,
    "decidedAt" TIMESTAMP(3),
    "provenanceId" TEXT NOT NULL,
    "immutability" "EIAImmutability" NOT NULL DEFAULT 'APPEND_ONLY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EIADecisionDisposition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EIADecisionOverride" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "originalRecommendationId" TEXT,
    "selectedOptionId" TEXT,
    "overrideRationale" TEXT NOT NULL,
    "authority" TEXT NOT NULL,
    "acknowledgedRisks" JSONB NOT NULL,
    "reviewAt" TIMESTAMP(3),
    "immutability" "EIAImmutability" NOT NULL DEFAULT 'APPEND_ONLY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EIADecisionOverride_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EIAEnterpriseInitiative" (
    "id" TEXT NOT NULL,
    "initiativeKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "packageId" TEXT,
    "selectedOptionId" TEXT,
    "strategicDomain" TEXT NOT NULL,
    "ownerRole" TEXT NOT NULL,
    "lifecycleState" "EIAWorkflowState" NOT NULL,
    "startAt" TIMESTAMP(3),
    "plannedReviewAt" TIMESTAMP(3),
    "provenanceId" TEXT NOT NULL,
    "environment" "EIAEnvironment" NOT NULL,
    "dataOrigin" "EIADataOrigin" NOT NULL,
    "confidence" "EIAConfidence" NOT NULL,
    "freshness" "EIAFreshness" NOT NULL,
    "privacy" "EIAPrivacy" NOT NULL DEFAULT 'EXECUTIVE',
    "sensitivity" "EIASensitivity" NOT NULL,
    "retention" "EIARetention" NOT NULL,
    "immutability" "EIAImmutability" NOT NULL DEFAULT 'MUTABLE_WITH_HISTORY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "EIAEnterpriseInitiative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EIAInitiativeStatusHistory" (
    "id" TEXT NOT NULL,
    "initiativeId" TEXT NOT NULL,
    "fromState" "EIAWorkflowState",
    "toState" "EIAWorkflowState" NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changedBy" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "provenanceId" TEXT NOT NULL,
    "immutability" "EIAImmutability" NOT NULL DEFAULT 'APPEND_ONLY',

    CONSTRAINT "EIAInitiativeStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EIAInitiativeBaseline" (
    "id" TEXT NOT NULL,
    "baselineKey" TEXT NOT NULL,
    "initiativeId" TEXT NOT NULL,
    "kpiId" TEXT,
    "valueKind" "EIAValueKind" NOT NULL,
    "numericValue" DECIMAL(65,30),
    "textValue" TEXT,
    "unavailableReason" TEXT,
    "measurementAt" TIMESTAMP(3),
    "measurementWindow" TEXT NOT NULL,
    "provenanceId" TEXT NOT NULL,
    "confidence" "EIAConfidence" NOT NULL,
    "freshness" "EIAFreshness" NOT NULL,
    "immutability" "EIAImmutability" NOT NULL DEFAULT 'APPEND_ONLY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EIAInitiativeBaseline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EIAExpectedOutcome" (
    "id" TEXT NOT NULL,
    "outcomeKey" TEXT NOT NULL,
    "initiativeId" TEXT,
    "packageId" TEXT,
    "kpiObservationId" TEXT,
    "description" TEXT NOT NULL,
    "targetValueKind" "EIAValueKind" NOT NULL,
    "targetNumericValue" DECIMAL(65,30),
    "targetTextValue" TEXT,
    "unavailableReason" TEXT,
    "desiredDirection" TEXT NOT NULL,
    "timeHorizon" TEXT NOT NULL,
    "measurementMethod" TEXT NOT NULL,
    "provenanceId" TEXT NOT NULL,
    "confidence" "EIAConfidence" NOT NULL,
    "immutability" "EIAImmutability" NOT NULL DEFAULT 'APPEND_ONLY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EIAExpectedOutcome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EIAOutcomeObservation" (
    "id" TEXT NOT NULL,
    "observationKey" TEXT NOT NULL,
    "initiativeId" TEXT NOT NULL,
    "expectedOutcomeId" TEXT NOT NULL,
    "kpiObservationId" TEXT,
    "valueKind" "EIAValueKind" NOT NULL,
    "numericValue" DECIMAL(65,30),
    "textValue" TEXT,
    "unavailableReason" TEXT,
    "observedAt" TIMESTAMP(3),
    "evaluationWindow" TEXT NOT NULL,
    "provenanceId" TEXT NOT NULL,
    "environment" "EIAEnvironment" NOT NULL,
    "dataOrigin" "EIADataOrigin" NOT NULL,
    "confidence" "EIAConfidence" NOT NULL,
    "freshness" "EIAFreshness" NOT NULL,
    "immutability" "EIAImmutability" NOT NULL DEFAULT 'APPEND_ONLY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EIAOutcomeObservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EIAOutcomeVariance" (
    "id" TEXT NOT NULL,
    "varianceKey" TEXT NOT NULL,
    "initiativeId" TEXT NOT NULL,
    "expectedOutcomeId" TEXT NOT NULL,
    "outcomeObservationId" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "materiality" TEXT NOT NULL,
    "absoluteVariance" DECIMAL(65,30),
    "percentageVariance" DECIMAL(65,30),
    "interpretation" TEXT NOT NULL,
    "calculationVersion" TEXT NOT NULL,
    "provenanceId" TEXT NOT NULL,
    "confidence" "EIAConfidence" NOT NULL,
    "freshness" "EIAFreshness" NOT NULL,
    "immutability" "EIAImmutability" NOT NULL DEFAULT 'APPEND_ONLY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EIAOutcomeVariance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EIAInitiativeReview" (
    "id" TEXT NOT NULL,
    "reviewKey" TEXT NOT NULL,
    "initiativeId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "reviewAt" TIMESTAMP(3) NOT NULL,
    "authorAuthority" TEXT NOT NULL,
    "calculationVersion" TEXT NOT NULL,
    "provenanceId" TEXT NOT NULL,
    "confidence" "EIAConfidence" NOT NULL,
    "immutability" "EIAImmutability" NOT NULL DEFAULT 'APPEND_ONLY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EIAInitiativeReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EIADecisionEvaluation" (
    "id" TEXT NOT NULL,
    "evaluationKey" TEXT NOT NULL,
    "initiativeId" TEXT NOT NULL,
    "packageId" TEXT,
    "reviewId" TEXT,
    "result" TEXT NOT NULL,
    "outcomeQuality" TEXT NOT NULL,
    "evidenceCoverage" DECIMAL(65,30),
    "explanation" TEXT NOT NULL,
    "authorAuthority" TEXT NOT NULL,
    "reviewAt" TIMESTAMP(3) NOT NULL,
    "provenanceId" TEXT NOT NULL,
    "confidence" "EIAConfidence" NOT NULL,
    "immutability" "EIAImmutability" NOT NULL DEFAULT 'APPEND_ONLY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EIADecisionEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EIARecommendationEvaluation" (
    "id" TEXT NOT NULL,
    "evaluationKey" TEXT NOT NULL,
    "initiativeId" TEXT NOT NULL,
    "packageId" TEXT,
    "recommendationId" TEXT,
    "reviewId" TEXT,
    "calibrationFinding" TEXT NOT NULL,
    "outcomeAchieved" TEXT NOT NULL,
    "causalityClassification" TEXT NOT NULL,
    "authorAuthority" TEXT NOT NULL,
    "reviewAt" TIMESTAMP(3) NOT NULL,
    "provenanceId" TEXT NOT NULL,
    "confidence" "EIAConfidence" NOT NULL,
    "immutability" "EIAImmutability" NOT NULL DEFAULT 'APPEND_ONLY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EIARecommendationEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EIALessonLearned" (
    "id" TEXT NOT NULL,
    "lessonKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "lessonType" TEXT NOT NULL,
    "initiativeId" TEXT,
    "reviewId" TEXT,
    "causalityClassification" TEXT NOT NULL,
    "authorAuthority" TEXT NOT NULL,
    "reviewAt" TIMESTAMP(3) NOT NULL,
    "provenanceId" TEXT NOT NULL,
    "confidence" "EIAConfidence" NOT NULL,
    "privacy" "EIAPrivacy" NOT NULL DEFAULT 'EXECUTIVE',
    "sensitivity" "EIASensitivity" NOT NULL,
    "retention" "EIARetention" NOT NULL,
    "immutability" "EIAImmutability" NOT NULL DEFAULT 'APPEND_ONLY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archivedAt" TIMESTAMP(3),
    "supersedesId" TEXT,

    CONSTRAINT "EIALessonLearned_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EIAImprovementAction" (
    "id" TEXT NOT NULL,
    "actionKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "lessonId" TEXT,
    "initiativeId" TEXT,
    "ownerRole" TEXT,
    "priority" TEXT NOT NULL,
    "currentState" "EIAWorkflowState" NOT NULL,
    "suggestedReviewAt" TIMESTAMP(3),
    "provenanceId" TEXT NOT NULL,
    "confidence" "EIAConfidence" NOT NULL,
    "privacy" "EIAPrivacy" NOT NULL DEFAULT 'EXECUTIVE',
    "sensitivity" "EIASensitivity" NOT NULL,
    "retention" "EIARetention" NOT NULL,
    "immutability" "EIAImmutability" NOT NULL DEFAULT 'MUTABLE_WITH_HISTORY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "EIAImprovementAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EIAImprovementActionStatusHistory" (
    "id" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,
    "fromState" "EIAWorkflowState",
    "toState" "EIAWorkflowState" NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changedBy" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "provenanceId" TEXT NOT NULL,
    "immutability" "EIAImmutability" NOT NULL DEFAULT 'APPEND_ONLY',

    CONSTRAINT "EIAImprovementActionStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EIAContinuousImprovementBacklogItem" (
    "id" TEXT NOT NULL,
    "backlogKey" TEXT NOT NULL,
    "actionId" TEXT NOT NULL,
    "rank" INTEGER,
    "criteriaVersion" TEXT NOT NULL,
    "totalScore" DECIMAL(65,30),
    "status" "EIAWorkflowState" NOT NULL DEFAULT 'NEEDS_REVIEW',
    "provenanceId" TEXT NOT NULL,
    "immutability" "EIAImmutability" NOT NULL DEFAULT 'MUTABLE_WITH_HISTORY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "EIAContinuousImprovementBacklogItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EIAProvenance_sourceSystem_sourceRecordId_idx" ON "EIAProvenance"("sourceSystem", "sourceRecordId");

-- CreateIndex
CREATE INDEX "EIAProvenance_environment_dataOrigin_idx" ON "EIAProvenance"("environment", "dataOrigin");

-- CreateIndex
CREATE INDEX "EIAProvenance_fixtureSet_fixtureScenario_idx" ON "EIAProvenance"("fixtureSet", "fixtureScenario");

-- CreateIndex
CREATE INDEX "EIAProvenance_calculationVersion_idx" ON "EIAProvenance"("calculationVersion");

-- CreateIndex
CREATE INDEX "EIAProvenance_createdAt_idx" ON "EIAProvenance"("createdAt");

-- CreateIndex
CREATE INDEX "EIAProvenance_supersedesId_idx" ON "EIAProvenance"("supersedesId");

-- CreateIndex
CREATE INDEX "EIAProvenance_correctionOfId_idx" ON "EIAProvenance"("correctionOfId");

-- CreateIndex
CREATE UNIQUE INDEX "EIAEvidenceReference_evidenceKey_key" ON "EIAEvidenceReference"("evidenceKey");

-- CreateIndex
CREATE INDEX "EIAEvidenceReference_provenanceId_idx" ON "EIAEvidenceReference"("provenanceId");

-- CreateIndex
CREATE INDEX "EIAEvidenceReference_evidenceType_idx" ON "EIAEvidenceReference"("evidenceType");

-- CreateIndex
CREATE INDEX "EIAEvidenceReference_repositoryObjectRid_idx" ON "EIAEvidenceReference"("repositoryObjectRid");

-- CreateIndex
CREATE INDEX "EIAEvidenceReference_environment_dataOrigin_idx" ON "EIAEvidenceReference"("environment", "dataOrigin");

-- CreateIndex
CREATE INDEX "EIAEvidenceReference_supersedesId_idx" ON "EIAEvidenceReference"("supersedesId");

-- CreateIndex
CREATE INDEX "EIAEvidenceLink_entityType_entityId_idx" ON "EIAEvidenceLink"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "EIAEvidenceLink_evidenceId_idx" ON "EIAEvidenceLink"("evidenceId");

-- CreateIndex
CREATE UNIQUE INDEX "EIAEvidenceLink_evidenceId_entityType_entityId_relationship_key" ON "EIAEvidenceLink"("evidenceId", "entityType", "entityId", "relationship");

-- CreateIndex
CREATE UNIQUE INDEX "EIAKpiObservation_idempotencyKey_key" ON "EIAKpiObservation"("idempotencyKey");

-- CreateIndex
CREATE INDEX "EIAKpiObservation_kpiId_observedAt_idx" ON "EIAKpiObservation"("kpiId", "observedAt");

-- CreateIndex
CREATE INDEX "EIAKpiObservation_periodStart_periodEnd_idx" ON "EIAKpiObservation"("periodStart", "periodEnd");

-- CreateIndex
CREATE INDEX "EIAKpiObservation_environment_dataOrigin_idx" ON "EIAKpiObservation"("environment", "dataOrigin");

-- CreateIndex
CREATE INDEX "EIAKpiObservation_fixtureSet_fixtureScenario_idx" ON "EIAKpiObservation"("fixtureSet", "fixtureScenario");

-- CreateIndex
CREATE INDEX "EIAKpiObservation_provenanceId_idx" ON "EIAKpiObservation"("provenanceId");

-- CreateIndex
CREATE INDEX "EIAKpiObservation_supersedesId_idx" ON "EIAKpiObservation"("supersedesId");

-- CreateIndex
CREATE UNIQUE INDEX "EIAKpiEvaluation_idempotencyKey_key" ON "EIAKpiEvaluation"("idempotencyKey");

-- CreateIndex
CREATE INDEX "EIAKpiEvaluation_kpiId_evaluatedAt_idx" ON "EIAKpiEvaluation"("kpiId", "evaluatedAt");

-- CreateIndex
CREATE INDEX "EIAKpiEvaluation_observationId_idx" ON "EIAKpiEvaluation"("observationId");

-- CreateIndex
CREATE INDEX "EIAKpiEvaluation_environment_dataOrigin_idx" ON "EIAKpiEvaluation"("environment", "dataOrigin");

-- CreateIndex
CREATE INDEX "EIAKpiEvaluation_provenanceId_idx" ON "EIAKpiEvaluation"("provenanceId");

-- CreateIndex
CREATE INDEX "EIAKpiEvaluation_supersedesId_idx" ON "EIAKpiEvaluation"("supersedesId");

-- CreateIndex
CREATE UNIQUE INDEX "EIAKpiThresholdEvaluation_idempotencyKey_key" ON "EIAKpiThresholdEvaluation"("idempotencyKey");

-- CreateIndex
CREATE INDEX "EIAKpiThresholdEvaluation_kpiEvaluationId_idx" ON "EIAKpiThresholdEvaluation"("kpiEvaluationId");

-- CreateIndex
CREATE INDEX "EIAKpiThresholdEvaluation_thresholdVersion_idx" ON "EIAKpiThresholdEvaluation"("thresholdVersion");

-- CreateIndex
CREATE INDEX "EIAKpiThresholdEvaluation_provenanceId_idx" ON "EIAKpiThresholdEvaluation"("provenanceId");

-- CreateIndex
CREATE UNIQUE INDEX "EIAKpiTransition_idempotencyKey_key" ON "EIAKpiTransition"("idempotencyKey");

-- CreateIndex
CREATE INDEX "EIAKpiTransition_kpiId_effectiveAt_idx" ON "EIAKpiTransition"("kpiId", "effectiveAt");

-- CreateIndex
CREATE INDEX "EIAKpiTransition_previousObservationId_idx" ON "EIAKpiTransition"("previousObservationId");

-- CreateIndex
CREATE INDEX "EIAKpiTransition_currentObservationId_idx" ON "EIAKpiTransition"("currentObservationId");

-- CreateIndex
CREATE INDEX "EIAKpiTransition_environment_dataOrigin_idx" ON "EIAKpiTransition"("environment", "dataOrigin");

-- CreateIndex
CREATE UNIQUE INDEX "EIAEnterpriseHealthSnapshot_snapshotKey_key" ON "EIAEnterpriseHealthSnapshot"("snapshotKey");

-- CreateIndex
CREATE INDEX "EIAEnterpriseHealthSnapshot_generatedAt_idx" ON "EIAEnterpriseHealthSnapshot"("generatedAt");

-- CreateIndex
CREATE INDEX "EIAEnterpriseHealthSnapshot_environment_dataOrigin_idx" ON "EIAEnterpriseHealthSnapshot"("environment", "dataOrigin");

-- CreateIndex
CREATE INDEX "EIAEnterpriseHealthSnapshot_fixtureSet_fixtureScenario_idx" ON "EIAEnterpriseHealthSnapshot"("fixtureSet", "fixtureScenario");

-- CreateIndex
CREATE INDEX "EIAEnterpriseHealthSnapshot_provenanceId_idx" ON "EIAEnterpriseHealthSnapshot"("provenanceId");

-- CreateIndex
CREATE INDEX "EIAEnterpriseHealthSnapshot_supersedesId_idx" ON "EIAEnterpriseHealthSnapshot"("supersedesId");

-- CreateIndex
CREATE INDEX "EIADomainHealthSnapshot_domain_generatedAt_idx" ON "EIADomainHealthSnapshot"("domain", "generatedAt");

-- CreateIndex
CREATE INDEX "EIADomainHealthSnapshot_environment_dataOrigin_idx" ON "EIADomainHealthSnapshot"("environment", "dataOrigin");

-- CreateIndex
CREATE INDEX "EIADomainHealthSnapshot_provenanceId_idx" ON "EIADomainHealthSnapshot"("provenanceId");

-- CreateIndex
CREATE UNIQUE INDEX "EIADomainHealthSnapshot_enterpriseSnapshotId_domain_key" ON "EIADomainHealthSnapshot"("enterpriseSnapshotId", "domain");

-- CreateIndex
CREATE INDEX "EIAHealthContribution_enterpriseSnapshotId_idx" ON "EIAHealthContribution"("enterpriseSnapshotId");

-- CreateIndex
CREATE INDEX "EIAHealthContribution_domainSnapshotId_idx" ON "EIAHealthContribution"("domainSnapshotId");

-- CreateIndex
CREATE INDEX "EIAHealthContribution_kpiId_idx" ON "EIAHealthContribution"("kpiId");

-- CreateIndex
CREATE INDEX "EIAHealthContribution_kpiObservationId_idx" ON "EIAHealthContribution"("kpiObservationId");

-- CreateIndex
CREATE INDEX "EIAHealthContribution_kpiEvaluationId_idx" ON "EIAHealthContribution"("kpiEvaluationId");

-- CreateIndex
CREATE UNIQUE INDEX "EIAIntelligenceEvent_eventKey_key" ON "EIAIntelligenceEvent"("eventKey");

-- CreateIndex
CREATE INDEX "EIAIntelligenceEvent_eventClass_detectedAt_idx" ON "EIAIntelligenceEvent"("eventClass", "detectedAt");

-- CreateIndex
CREATE INDEX "EIAIntelligenceEvent_severity_materiality_idx" ON "EIAIntelligenceEvent"("severity", "materiality");

-- CreateIndex
CREATE INDEX "EIAIntelligenceEvent_healthSnapshotId_idx" ON "EIAIntelligenceEvent"("healthSnapshotId");

-- CreateIndex
CREATE INDEX "EIAIntelligenceEvent_environment_dataOrigin_idx" ON "EIAIntelligenceEvent"("environment", "dataOrigin");

-- CreateIndex
CREATE INDEX "EIAIntelligenceEvent_provenanceId_idx" ON "EIAIntelligenceEvent"("provenanceId");

-- CreateIndex
CREATE UNIQUE INDEX "EIAIntelligenceSignal_signalKey_key" ON "EIAIntelligenceSignal"("signalKey");

-- CreateIndex
CREATE INDEX "EIAIntelligenceSignal_eventId_idx" ON "EIAIntelligenceSignal"("eventId");

-- CreateIndex
CREATE INDEX "EIAIntelligenceSignal_signalKind_severity_idx" ON "EIAIntelligenceSignal"("signalKind", "severity");

-- CreateIndex
CREATE INDEX "EIAIntelligenceSignal_environment_dataOrigin_idx" ON "EIAIntelligenceSignal"("environment", "dataOrigin");

-- CreateIndex
CREATE UNIQUE INDEX "EIAExecutiveInsight_insightKey_key" ON "EIAExecutiveInsight"("insightKey");

-- CreateIndex
CREATE INDEX "EIAExecutiveInsight_eventId_idx" ON "EIAExecutiveInsight"("eventId");

-- CreateIndex
CREATE INDEX "EIAExecutiveInsight_executiveAudience_idx" ON "EIAExecutiveInsight"("executiveAudience");

-- CreateIndex
CREATE INDEX "EIAExecutiveInsight_environment_dataOrigin_idx" ON "EIAExecutiveInsight"("environment", "dataOrigin");

-- CreateIndex
CREATE UNIQUE INDEX "EIADecisionSituation_situationKey_key" ON "EIADecisionSituation"("situationKey");

-- CreateIndex
CREATE INDEX "EIADecisionSituation_urgency_horizon_idx" ON "EIADecisionSituation"("urgency", "horizon");

-- CreateIndex
CREATE INDEX "EIADecisionSituation_intelligenceEventId_idx" ON "EIADecisionSituation"("intelligenceEventId");

-- CreateIndex
CREATE INDEX "EIADecisionSituation_environment_dataOrigin_idx" ON "EIADecisionSituation"("environment", "dataOrigin");

-- CreateIndex
CREATE UNIQUE INDEX "EIADecisionPackage_packageKey_key" ON "EIADecisionPackage"("packageKey");

-- CreateIndex
CREATE INDEX "EIADecisionPackage_situationId_idx" ON "EIADecisionPackage"("situationId");

-- CreateIndex
CREATE INDEX "EIADecisionPackage_environment_dataOrigin_idx" ON "EIADecisionPackage"("environment", "dataOrigin");

-- CreateIndex
CREATE INDEX "EIADecisionPackage_provenanceId_idx" ON "EIADecisionPackage"("provenanceId");

-- CreateIndex
CREATE INDEX "EIADecisionPackage_supersedesId_idx" ON "EIADecisionPackage"("supersedesId");

-- CreateIndex
CREATE UNIQUE INDEX "EIADecisionOption_optionKey_key" ON "EIADecisionOption"("optionKey");

-- CreateIndex
CREATE INDEX "EIADecisionOption_packageId_idx" ON "EIADecisionOption"("packageId");

-- CreateIndex
CREATE INDEX "EIADecisionOption_optionType_idx" ON "EIADecisionOption"("optionType");

-- CreateIndex
CREATE INDEX "EIADecisionCriterion_version_idx" ON "EIADecisionCriterion"("version");

-- CreateIndex
CREATE UNIQUE INDEX "EIADecisionCriterion_criterionKey_version_key" ON "EIADecisionCriterion"("criterionKey", "version");

-- CreateIndex
CREATE UNIQUE INDEX "EIADecisionScore_idempotencyKey_key" ON "EIADecisionScore"("idempotencyKey");

-- CreateIndex
CREATE INDEX "EIADecisionScore_packageId_idx" ON "EIADecisionScore"("packageId");

-- CreateIndex
CREATE INDEX "EIADecisionScore_optionId_idx" ON "EIADecisionScore"("optionId");

-- CreateIndex
CREATE INDEX "EIADecisionScore_criterionId_idx" ON "EIADecisionScore"("criterionId");

-- CreateIndex
CREATE UNIQUE INDEX "EIADecisionRecommendation_recommendationKey_key" ON "EIADecisionRecommendation"("recommendationKey");

-- CreateIndex
CREATE UNIQUE INDEX "EIADecisionRecommendation_idempotencyKey_key" ON "EIADecisionRecommendation"("idempotencyKey");

-- CreateIndex
CREATE INDEX "EIADecisionRecommendation_packageId_idx" ON "EIADecisionRecommendation"("packageId");

-- CreateIndex
CREATE INDEX "EIADecisionRecommendation_recommendedOptionId_idx" ON "EIADecisionRecommendation"("recommendedOptionId");

-- CreateIndex
CREATE INDEX "EIADecisionRecommendation_supersedesId_idx" ON "EIADecisionRecommendation"("supersedesId");

-- CreateIndex
CREATE INDEX "EIADecisionReviewSchedule_packageId_reviewAt_idx" ON "EIADecisionReviewSchedule"("packageId", "reviewAt");

-- CreateIndex
CREATE INDEX "EIADecisionReviewSchedule_status_idx" ON "EIADecisionReviewSchedule"("status");

-- CreateIndex
CREATE INDEX "EIADecisionDisposition_packageId_createdAt_idx" ON "EIADecisionDisposition"("packageId", "createdAt");

-- CreateIndex
CREATE INDEX "EIADecisionDisposition_dispositionKind_idx" ON "EIADecisionDisposition"("dispositionKind");

-- CreateIndex
CREATE INDEX "EIADecisionOverride_packageId_idx" ON "EIADecisionOverride"("packageId");

-- CreateIndex
CREATE INDEX "EIADecisionOverride_originalRecommendationId_idx" ON "EIADecisionOverride"("originalRecommendationId");

-- CreateIndex
CREATE UNIQUE INDEX "EIAEnterpriseInitiative_initiativeKey_key" ON "EIAEnterpriseInitiative"("initiativeKey");

-- CreateIndex
CREATE INDEX "EIAEnterpriseInitiative_strategicDomain_lifecycleState_idx" ON "EIAEnterpriseInitiative"("strategicDomain", "lifecycleState");

-- CreateIndex
CREATE INDEX "EIAEnterpriseInitiative_packageId_idx" ON "EIAEnterpriseInitiative"("packageId");

-- CreateIndex
CREATE INDEX "EIAEnterpriseInitiative_selectedOptionId_idx" ON "EIAEnterpriseInitiative"("selectedOptionId");

-- CreateIndex
CREATE INDEX "EIAEnterpriseInitiative_environment_dataOrigin_idx" ON "EIAEnterpriseInitiative"("environment", "dataOrigin");

-- CreateIndex
CREATE INDEX "EIAInitiativeStatusHistory_initiativeId_changedAt_idx" ON "EIAInitiativeStatusHistory"("initiativeId", "changedAt");

-- CreateIndex
CREATE INDEX "EIAInitiativeStatusHistory_toState_idx" ON "EIAInitiativeStatusHistory"("toState");

-- CreateIndex
CREATE UNIQUE INDEX "EIAInitiativeBaseline_baselineKey_key" ON "EIAInitiativeBaseline"("baselineKey");

-- CreateIndex
CREATE INDEX "EIAInitiativeBaseline_initiativeId_idx" ON "EIAInitiativeBaseline"("initiativeId");

-- CreateIndex
CREATE INDEX "EIAInitiativeBaseline_kpiId_idx" ON "EIAInitiativeBaseline"("kpiId");

-- CreateIndex
CREATE UNIQUE INDEX "EIAExpectedOutcome_outcomeKey_key" ON "EIAExpectedOutcome"("outcomeKey");

-- CreateIndex
CREATE INDEX "EIAExpectedOutcome_initiativeId_idx" ON "EIAExpectedOutcome"("initiativeId");

-- CreateIndex
CREATE INDEX "EIAExpectedOutcome_packageId_idx" ON "EIAExpectedOutcome"("packageId");

-- CreateIndex
CREATE INDEX "EIAExpectedOutcome_kpiObservationId_idx" ON "EIAExpectedOutcome"("kpiObservationId");

-- CreateIndex
CREATE UNIQUE INDEX "EIAOutcomeObservation_observationKey_key" ON "EIAOutcomeObservation"("observationKey");

-- CreateIndex
CREATE INDEX "EIAOutcomeObservation_initiativeId_observedAt_idx" ON "EIAOutcomeObservation"("initiativeId", "observedAt");

-- CreateIndex
CREATE INDEX "EIAOutcomeObservation_expectedOutcomeId_idx" ON "EIAOutcomeObservation"("expectedOutcomeId");

-- CreateIndex
CREATE INDEX "EIAOutcomeObservation_kpiObservationId_idx" ON "EIAOutcomeObservation"("kpiObservationId");

-- CreateIndex
CREATE INDEX "EIAOutcomeObservation_environment_dataOrigin_idx" ON "EIAOutcomeObservation"("environment", "dataOrigin");

-- CreateIndex
CREATE UNIQUE INDEX "EIAOutcomeVariance_varianceKey_key" ON "EIAOutcomeVariance"("varianceKey");

-- CreateIndex
CREATE INDEX "EIAOutcomeVariance_initiativeId_idx" ON "EIAOutcomeVariance"("initiativeId");

-- CreateIndex
CREATE INDEX "EIAOutcomeVariance_expectedOutcomeId_idx" ON "EIAOutcomeVariance"("expectedOutcomeId");

-- CreateIndex
CREATE INDEX "EIAOutcomeVariance_outcomeObservationId_idx" ON "EIAOutcomeVariance"("outcomeObservationId");

-- CreateIndex
CREATE INDEX "EIAOutcomeVariance_state_materiality_idx" ON "EIAOutcomeVariance"("state", "materiality");

-- CreateIndex
CREATE UNIQUE INDEX "EIAInitiativeReview_reviewKey_key" ON "EIAInitiativeReview"("reviewKey");

-- CreateIndex
CREATE INDEX "EIAInitiativeReview_initiativeId_reviewAt_idx" ON "EIAInitiativeReview"("initiativeId", "reviewAt");

-- CreateIndex
CREATE UNIQUE INDEX "EIADecisionEvaluation_evaluationKey_key" ON "EIADecisionEvaluation"("evaluationKey");

-- CreateIndex
CREATE INDEX "EIADecisionEvaluation_initiativeId_idx" ON "EIADecisionEvaluation"("initiativeId");

-- CreateIndex
CREATE INDEX "EIADecisionEvaluation_packageId_idx" ON "EIADecisionEvaluation"("packageId");

-- CreateIndex
CREATE INDEX "EIADecisionEvaluation_reviewId_idx" ON "EIADecisionEvaluation"("reviewId");

-- CreateIndex
CREATE UNIQUE INDEX "EIARecommendationEvaluation_evaluationKey_key" ON "EIARecommendationEvaluation"("evaluationKey");

-- CreateIndex
CREATE INDEX "EIARecommendationEvaluation_initiativeId_idx" ON "EIARecommendationEvaluation"("initiativeId");

-- CreateIndex
CREATE INDEX "EIARecommendationEvaluation_packageId_idx" ON "EIARecommendationEvaluation"("packageId");

-- CreateIndex
CREATE INDEX "EIARecommendationEvaluation_recommendationId_idx" ON "EIARecommendationEvaluation"("recommendationId");

-- CreateIndex
CREATE INDEX "EIARecommendationEvaluation_reviewId_idx" ON "EIARecommendationEvaluation"("reviewId");

-- CreateIndex
CREATE UNIQUE INDEX "EIALessonLearned_lessonKey_key" ON "EIALessonLearned"("lessonKey");

-- CreateIndex
CREATE INDEX "EIALessonLearned_initiativeId_idx" ON "EIALessonLearned"("initiativeId");

-- CreateIndex
CREATE INDEX "EIALessonLearned_reviewId_idx" ON "EIALessonLearned"("reviewId");

-- CreateIndex
CREATE INDEX "EIALessonLearned_lessonType_idx" ON "EIALessonLearned"("lessonType");

-- CreateIndex
CREATE INDEX "EIALessonLearned_supersedesId_idx" ON "EIALessonLearned"("supersedesId");

-- CreateIndex
CREATE UNIQUE INDEX "EIAImprovementAction_actionKey_key" ON "EIAImprovementAction"("actionKey");

-- CreateIndex
CREATE INDEX "EIAImprovementAction_lessonId_idx" ON "EIAImprovementAction"("lessonId");

-- CreateIndex
CREATE INDEX "EIAImprovementAction_initiativeId_idx" ON "EIAImprovementAction"("initiativeId");

-- CreateIndex
CREATE INDEX "EIAImprovementAction_currentState_priority_idx" ON "EIAImprovementAction"("currentState", "priority");

-- CreateIndex
CREATE INDEX "EIAImprovementActionStatusHistory_actionId_changedAt_idx" ON "EIAImprovementActionStatusHistory"("actionId", "changedAt");

-- CreateIndex
CREATE INDEX "EIAImprovementActionStatusHistory_toState_idx" ON "EIAImprovementActionStatusHistory"("toState");

-- CreateIndex
CREATE UNIQUE INDEX "EIAContinuousImprovementBacklogItem_backlogKey_key" ON "EIAContinuousImprovementBacklogItem"("backlogKey");

-- CreateIndex
CREATE INDEX "EIAContinuousImprovementBacklogItem_actionId_idx" ON "EIAContinuousImprovementBacklogItem"("actionId");

-- CreateIndex
CREATE INDEX "EIAContinuousImprovementBacklogItem_rank_idx" ON "EIAContinuousImprovementBacklogItem"("rank");

-- CreateIndex
CREATE INDEX "EIAContinuousImprovementBacklogItem_status_idx" ON "EIAContinuousImprovementBacklogItem"("status");

-- AddForeignKey
ALTER TABLE "EIAProvenance" ADD CONSTRAINT "EIAProvenance_supersedesId_fkey" FOREIGN KEY ("supersedesId") REFERENCES "EIAProvenance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAProvenance" ADD CONSTRAINT "EIAProvenance_correctionOfId_fkey" FOREIGN KEY ("correctionOfId") REFERENCES "EIAProvenance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAEvidenceReference" ADD CONSTRAINT "EIAEvidenceReference_provenanceId_fkey" FOREIGN KEY ("provenanceId") REFERENCES "EIAProvenance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAEvidenceReference" ADD CONSTRAINT "EIAEvidenceReference_supersedesId_fkey" FOREIGN KEY ("supersedesId") REFERENCES "EIAEvidenceReference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAEvidenceLink" ADD CONSTRAINT "EIAEvidenceLink_evidenceId_fkey" FOREIGN KEY ("evidenceId") REFERENCES "EIAEvidenceReference"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAKpiObservation" ADD CONSTRAINT "EIAKpiObservation_provenanceId_fkey" FOREIGN KEY ("provenanceId") REFERENCES "EIAProvenance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAKpiObservation" ADD CONSTRAINT "EIAKpiObservation_supersedesId_fkey" FOREIGN KEY ("supersedesId") REFERENCES "EIAKpiObservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAKpiEvaluation" ADD CONSTRAINT "EIAKpiEvaluation_observationId_fkey" FOREIGN KEY ("observationId") REFERENCES "EIAKpiObservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAKpiEvaluation" ADD CONSTRAINT "EIAKpiEvaluation_provenanceId_fkey" FOREIGN KEY ("provenanceId") REFERENCES "EIAProvenance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAKpiEvaluation" ADD CONSTRAINT "EIAKpiEvaluation_supersedesId_fkey" FOREIGN KEY ("supersedesId") REFERENCES "EIAKpiEvaluation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAKpiThresholdEvaluation" ADD CONSTRAINT "EIAKpiThresholdEvaluation_kpiEvaluationId_fkey" FOREIGN KEY ("kpiEvaluationId") REFERENCES "EIAKpiEvaluation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAKpiThresholdEvaluation" ADD CONSTRAINT "EIAKpiThresholdEvaluation_provenanceId_fkey" FOREIGN KEY ("provenanceId") REFERENCES "EIAProvenance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAKpiTransition" ADD CONSTRAINT "EIAKpiTransition_previousObservationId_fkey" FOREIGN KEY ("previousObservationId") REFERENCES "EIAKpiObservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAKpiTransition" ADD CONSTRAINT "EIAKpiTransition_currentObservationId_fkey" FOREIGN KEY ("currentObservationId") REFERENCES "EIAKpiObservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAKpiTransition" ADD CONSTRAINT "EIAKpiTransition_provenanceId_fkey" FOREIGN KEY ("provenanceId") REFERENCES "EIAProvenance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAEnterpriseHealthSnapshot" ADD CONSTRAINT "EIAEnterpriseHealthSnapshot_provenanceId_fkey" FOREIGN KEY ("provenanceId") REFERENCES "EIAProvenance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAEnterpriseHealthSnapshot" ADD CONSTRAINT "EIAEnterpriseHealthSnapshot_supersedesId_fkey" FOREIGN KEY ("supersedesId") REFERENCES "EIAEnterpriseHealthSnapshot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIADomainHealthSnapshot" ADD CONSTRAINT "EIADomainHealthSnapshot_enterpriseSnapshotId_fkey" FOREIGN KEY ("enterpriseSnapshotId") REFERENCES "EIAEnterpriseHealthSnapshot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIADomainHealthSnapshot" ADD CONSTRAINT "EIADomainHealthSnapshot_provenanceId_fkey" FOREIGN KEY ("provenanceId") REFERENCES "EIAProvenance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAHealthContribution" ADD CONSTRAINT "EIAHealthContribution_enterpriseSnapshotId_fkey" FOREIGN KEY ("enterpriseSnapshotId") REFERENCES "EIAEnterpriseHealthSnapshot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAHealthContribution" ADD CONSTRAINT "EIAHealthContribution_domainSnapshotId_fkey" FOREIGN KEY ("domainSnapshotId") REFERENCES "EIADomainHealthSnapshot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAHealthContribution" ADD CONSTRAINT "EIAHealthContribution_kpiObservationId_fkey" FOREIGN KEY ("kpiObservationId") REFERENCES "EIAKpiObservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAHealthContribution" ADD CONSTRAINT "EIAHealthContribution_kpiEvaluationId_fkey" FOREIGN KEY ("kpiEvaluationId") REFERENCES "EIAKpiEvaluation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAHealthContribution" ADD CONSTRAINT "EIAHealthContribution_provenanceId_fkey" FOREIGN KEY ("provenanceId") REFERENCES "EIAProvenance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAIntelligenceEvent" ADD CONSTRAINT "EIAIntelligenceEvent_healthSnapshotId_fkey" FOREIGN KEY ("healthSnapshotId") REFERENCES "EIAEnterpriseHealthSnapshot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAIntelligenceEvent" ADD CONSTRAINT "EIAIntelligenceEvent_provenanceId_fkey" FOREIGN KEY ("provenanceId") REFERENCES "EIAProvenance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAIntelligenceEvent" ADD CONSTRAINT "EIAIntelligenceEvent_supersedesId_fkey" FOREIGN KEY ("supersedesId") REFERENCES "EIAIntelligenceEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAIntelligenceSignal" ADD CONSTRAINT "EIAIntelligenceSignal_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "EIAIntelligenceEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAIntelligenceSignal" ADD CONSTRAINT "EIAIntelligenceSignal_provenanceId_fkey" FOREIGN KEY ("provenanceId") REFERENCES "EIAProvenance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAExecutiveInsight" ADD CONSTRAINT "EIAExecutiveInsight_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "EIAIntelligenceEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAExecutiveInsight" ADD CONSTRAINT "EIAExecutiveInsight_provenanceId_fkey" FOREIGN KEY ("provenanceId") REFERENCES "EIAProvenance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIADecisionSituation" ADD CONSTRAINT "EIADecisionSituation_intelligenceEventId_fkey" FOREIGN KEY ("intelligenceEventId") REFERENCES "EIAIntelligenceEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIADecisionSituation" ADD CONSTRAINT "EIADecisionSituation_provenanceId_fkey" FOREIGN KEY ("provenanceId") REFERENCES "EIAProvenance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIADecisionPackage" ADD CONSTRAINT "EIADecisionPackage_situationId_fkey" FOREIGN KEY ("situationId") REFERENCES "EIADecisionSituation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIADecisionPackage" ADD CONSTRAINT "EIADecisionPackage_provenanceId_fkey" FOREIGN KEY ("provenanceId") REFERENCES "EIAProvenance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIADecisionPackage" ADD CONSTRAINT "EIADecisionPackage_supersedesId_fkey" FOREIGN KEY ("supersedesId") REFERENCES "EIADecisionPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIADecisionOption" ADD CONSTRAINT "EIADecisionOption_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "EIADecisionPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIADecisionOption" ADD CONSTRAINT "EIADecisionOption_provenanceId_fkey" FOREIGN KEY ("provenanceId") REFERENCES "EIAProvenance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIADecisionScore" ADD CONSTRAINT "EIADecisionScore_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "EIADecisionPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIADecisionScore" ADD CONSTRAINT "EIADecisionScore_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "EIADecisionOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIADecisionScore" ADD CONSTRAINT "EIADecisionScore_criterionId_fkey" FOREIGN KEY ("criterionId") REFERENCES "EIADecisionCriterion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIADecisionScore" ADD CONSTRAINT "EIADecisionScore_provenanceId_fkey" FOREIGN KEY ("provenanceId") REFERENCES "EIAProvenance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIADecisionRecommendation" ADD CONSTRAINT "EIADecisionRecommendation_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "EIADecisionPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIADecisionRecommendation" ADD CONSTRAINT "EIADecisionRecommendation_recommendedOptionId_fkey" FOREIGN KEY ("recommendedOptionId") REFERENCES "EIADecisionOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIADecisionRecommendation" ADD CONSTRAINT "EIADecisionRecommendation_provenanceId_fkey" FOREIGN KEY ("provenanceId") REFERENCES "EIAProvenance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIADecisionRecommendation" ADD CONSTRAINT "EIADecisionRecommendation_supersedesId_fkey" FOREIGN KEY ("supersedesId") REFERENCES "EIADecisionRecommendation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIADecisionReviewSchedule" ADD CONSTRAINT "EIADecisionReviewSchedule_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "EIADecisionPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIADecisionDisposition" ADD CONSTRAINT "EIADecisionDisposition_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "EIADecisionPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIADecisionDisposition" ADD CONSTRAINT "EIADecisionDisposition_provenanceId_fkey" FOREIGN KEY ("provenanceId") REFERENCES "EIAProvenance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIADecisionOverride" ADD CONSTRAINT "EIADecisionOverride_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "EIADecisionPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAEnterpriseInitiative" ADD CONSTRAINT "EIAEnterpriseInitiative_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "EIADecisionPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAEnterpriseInitiative" ADD CONSTRAINT "EIAEnterpriseInitiative_selectedOptionId_fkey" FOREIGN KEY ("selectedOptionId") REFERENCES "EIADecisionOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAEnterpriseInitiative" ADD CONSTRAINT "EIAEnterpriseInitiative_provenanceId_fkey" FOREIGN KEY ("provenanceId") REFERENCES "EIAProvenance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAInitiativeStatusHistory" ADD CONSTRAINT "EIAInitiativeStatusHistory_initiativeId_fkey" FOREIGN KEY ("initiativeId") REFERENCES "EIAEnterpriseInitiative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAInitiativeStatusHistory" ADD CONSTRAINT "EIAInitiativeStatusHistory_provenanceId_fkey" FOREIGN KEY ("provenanceId") REFERENCES "EIAProvenance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAInitiativeBaseline" ADD CONSTRAINT "EIAInitiativeBaseline_initiativeId_fkey" FOREIGN KEY ("initiativeId") REFERENCES "EIAEnterpriseInitiative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAInitiativeBaseline" ADD CONSTRAINT "EIAInitiativeBaseline_provenanceId_fkey" FOREIGN KEY ("provenanceId") REFERENCES "EIAProvenance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAExpectedOutcome" ADD CONSTRAINT "EIAExpectedOutcome_initiativeId_fkey" FOREIGN KEY ("initiativeId") REFERENCES "EIAEnterpriseInitiative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAExpectedOutcome" ADD CONSTRAINT "EIAExpectedOutcome_kpiObservationId_fkey" FOREIGN KEY ("kpiObservationId") REFERENCES "EIAKpiObservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAExpectedOutcome" ADD CONSTRAINT "EIAExpectedOutcome_provenanceId_fkey" FOREIGN KEY ("provenanceId") REFERENCES "EIAProvenance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAOutcomeObservation" ADD CONSTRAINT "EIAOutcomeObservation_initiativeId_fkey" FOREIGN KEY ("initiativeId") REFERENCES "EIAEnterpriseInitiative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAOutcomeObservation" ADD CONSTRAINT "EIAOutcomeObservation_expectedOutcomeId_fkey" FOREIGN KEY ("expectedOutcomeId") REFERENCES "EIAExpectedOutcome"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAOutcomeObservation" ADD CONSTRAINT "EIAOutcomeObservation_kpiObservationId_fkey" FOREIGN KEY ("kpiObservationId") REFERENCES "EIAKpiObservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAOutcomeObservation" ADD CONSTRAINT "EIAOutcomeObservation_provenanceId_fkey" FOREIGN KEY ("provenanceId") REFERENCES "EIAProvenance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAOutcomeVariance" ADD CONSTRAINT "EIAOutcomeVariance_initiativeId_fkey" FOREIGN KEY ("initiativeId") REFERENCES "EIAEnterpriseInitiative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAOutcomeVariance" ADD CONSTRAINT "EIAOutcomeVariance_expectedOutcomeId_fkey" FOREIGN KEY ("expectedOutcomeId") REFERENCES "EIAExpectedOutcome"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAOutcomeVariance" ADD CONSTRAINT "EIAOutcomeVariance_outcomeObservationId_fkey" FOREIGN KEY ("outcomeObservationId") REFERENCES "EIAOutcomeObservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAOutcomeVariance" ADD CONSTRAINT "EIAOutcomeVariance_provenanceId_fkey" FOREIGN KEY ("provenanceId") REFERENCES "EIAProvenance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAInitiativeReview" ADD CONSTRAINT "EIAInitiativeReview_initiativeId_fkey" FOREIGN KEY ("initiativeId") REFERENCES "EIAEnterpriseInitiative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAInitiativeReview" ADD CONSTRAINT "EIAInitiativeReview_provenanceId_fkey" FOREIGN KEY ("provenanceId") REFERENCES "EIAProvenance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIADecisionEvaluation" ADD CONSTRAINT "EIADecisionEvaluation_initiativeId_fkey" FOREIGN KEY ("initiativeId") REFERENCES "EIAEnterpriseInitiative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIADecisionEvaluation" ADD CONSTRAINT "EIADecisionEvaluation_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "EIADecisionPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIADecisionEvaluation" ADD CONSTRAINT "EIADecisionEvaluation_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "EIAInitiativeReview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIADecisionEvaluation" ADD CONSTRAINT "EIADecisionEvaluation_provenanceId_fkey" FOREIGN KEY ("provenanceId") REFERENCES "EIAProvenance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIARecommendationEvaluation" ADD CONSTRAINT "EIARecommendationEvaluation_initiativeId_fkey" FOREIGN KEY ("initiativeId") REFERENCES "EIAEnterpriseInitiative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIARecommendationEvaluation" ADD CONSTRAINT "EIARecommendationEvaluation_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "EIADecisionPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIARecommendationEvaluation" ADD CONSTRAINT "EIARecommendationEvaluation_recommendationId_fkey" FOREIGN KEY ("recommendationId") REFERENCES "EIADecisionRecommendation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIARecommendationEvaluation" ADD CONSTRAINT "EIARecommendationEvaluation_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "EIAInitiativeReview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIARecommendationEvaluation" ADD CONSTRAINT "EIARecommendationEvaluation_provenanceId_fkey" FOREIGN KEY ("provenanceId") REFERENCES "EIAProvenance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIALessonLearned" ADD CONSTRAINT "EIALessonLearned_initiativeId_fkey" FOREIGN KEY ("initiativeId") REFERENCES "EIAEnterpriseInitiative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIALessonLearned" ADD CONSTRAINT "EIALessonLearned_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "EIAInitiativeReview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIALessonLearned" ADD CONSTRAINT "EIALessonLearned_provenanceId_fkey" FOREIGN KEY ("provenanceId") REFERENCES "EIAProvenance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIALessonLearned" ADD CONSTRAINT "EIALessonLearned_supersedesId_fkey" FOREIGN KEY ("supersedesId") REFERENCES "EIALessonLearned"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAImprovementAction" ADD CONSTRAINT "EIAImprovementAction_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "EIALessonLearned"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAImprovementAction" ADD CONSTRAINT "EIAImprovementAction_initiativeId_fkey" FOREIGN KEY ("initiativeId") REFERENCES "EIAEnterpriseInitiative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAImprovementAction" ADD CONSTRAINT "EIAImprovementAction_provenanceId_fkey" FOREIGN KEY ("provenanceId") REFERENCES "EIAProvenance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAImprovementActionStatusHistory" ADD CONSTRAINT "EIAImprovementActionStatusHistory_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "EIAImprovementAction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAImprovementActionStatusHistory" ADD CONSTRAINT "EIAImprovementActionStatusHistory_provenanceId_fkey" FOREIGN KEY ("provenanceId") REFERENCES "EIAProvenance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAContinuousImprovementBacklogItem" ADD CONSTRAINT "EIAContinuousImprovementBacklogItem_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "EIAImprovementAction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EIAContinuousImprovementBacklogItem" ADD CONSTRAINT "EIAContinuousImprovementBacklogItem_provenanceId_fkey" FOREIGN KEY ("provenanceId") REFERENCES "EIAProvenance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

