-- PROJECT ATLAS canonical local bootstrap baseline.
-- Generated from prisma/schema.prisma with prisma migrate diff --from-empty.
-- This is intentionally outside prisma/migrations and is never a production-pending migration.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- CreateEnum
CREATE TYPE "PublicSearchEligibility" AS ENUM ('CERTIFIED_ELIGIBLE', 'PUBLIC_SCOPE_UNVERIFIED', 'CERTIFIED_INELIGIBLE');

-- CreateEnum
CREATE TYPE "OutputProductKind" AS ENUM ('SELLER_PRESENTATION', 'BUYER_PRESENTATION', 'MARKET_REPORT', 'PROPERTY_ANALYSIS', 'LOCATION_ANALYSIS', 'INVESTMENT_PROPERTY_ANALYSIS', 'MULTI_PROPERTY_FINANCIAL_BREAKEVEN_ANALYSIS', 'ADVISORY_BRIEFING', 'AGENT_INTERNAL_ANALYSIS');

-- CreateEnum
CREATE TYPE "MultiPropertyFinancialScenarioLifecycleState" AS ENUM ('ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MultiPropertyFinancialScenarioPropertyRole" AS ENUM ('CURRENT_HOME_SELL', 'CURRENT_HOME_RETAIN', 'REPLACEMENT_PRIMARY_ACQUIRE', 'INVESTMENT_ACQUIRE');

-- CreateEnum
CREATE TYPE "MultiPropertyFinancialScenarioPropertyReferenceType" AS ENUM ('CANONICAL', 'PROSPECTIVE', 'HYPOTHETICAL');

-- CreateEnum
CREATE TYPE "OutputAudience" AS ENUM ('AGENT_INTERNAL', 'SELLER', 'BUYER', 'INVESTOR', 'HOMEOWNER', 'CLIENT', 'PROSPECT', 'PUBLIC');

-- CreateEnum
CREATE TYPE "OutputVersionLifecycleState" AS ENUM ('DRAFT', 'COMPOSED', 'AGENT_REVIEW_REQUIRED', 'AGENT_REVIEWED', 'READY_FOR_SELLER_REVIEW', 'SELLER_REVIEWED_OR_PRESENTED', 'INVALIDATED', 'SUPERSEDED', 'ARCHIVED_HISTORICAL_REFERENCE', 'FAIL_CLOSED');

-- CreateEnum
CREATE TYPE "OutputDependencyType" AS ENUM ('FACT_DEPENDENCY', 'MARKET_DEPENDENCY', 'COMPETITION_DEPENDENCY', 'SEARCH_BAND_DEPENDENCY', 'AGENT_INPUT_DEPENDENCY', 'NARRATIVE_DEPENDENCY', 'RECOMMENDATION_DEPENDENCY', 'PRICING_DEPENDENCY', 'FINANCIAL_DEPENDENCY', 'RIGHTS_DEPENDENCY', 'FRESHNESS_DEPENDENCY', 'PRESENTATION_DEPENDENCY');

-- CreateEnum
CREATE TYPE "OutputInvalidationState" AS ENUM ('CURRENT', 'REFRESH_RECOMMENDED', 'REVIEW_REQUIRED', 'RECOMPUTE_REQUIRED', 'RECOMPOSE_REQUIRED', 'RIGHTS_REVIEW_REQUIRED', 'FRESHNESS_REVIEW_REQUIRED', 'SUPERSEDED', 'EVIDENCE_INSUFFICIENT');

-- CreateEnum
CREATE TYPE "OutputReviewDisposition" AS ENUM ('APPROVED', 'REJECTED', 'REVIEW_REQUIRED');

-- CreateEnum
CREATE TYPE "OutputDecisionDisposition" AS ENUM ('SELECTED', 'DEFERRED', 'NOTED');

-- CreateEnum
CREATE TYPE "OutputCheckpointState" AS ENUM ('RECORDED', 'REVIEW_REQUIRED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "EvidenceSourceKind" AS ENUM ('TRUSTED_INTERNAL_DETERMINISTIC', 'PROFESSIONAL_REPORTED', 'PROFESSIONAL_DOCUMENT', 'OTHER_REVIEW_REQUIRED');

-- CreateEnum
CREATE TYPE "EvidenceCandidateStatus" AS ENUM ('PENDING_REVIEW', 'ADMITTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "EvidenceClaimKind" AS ENUM ('LENDER_RATE', 'LENDER_TERM', 'PAYOFF_AMOUNT', 'INSURANCE_PREMIUM', 'INSURANCE_COVERAGE', 'PROPERTY_MANAGER_RENT', 'TAX_AMOUNT', 'TAX_ASSESSMENT', 'INSPECTION_OBSERVATION', 'HOA_INFORMATION', 'TITLE_INFORMATION');

-- CreateEnum
CREATE TYPE "EvidenceVerificationStatus" AS ENUM ('UNVERIFIED', 'SOURCE_ROLE_CLAIMED', 'SOURCE_ROLE_VERIFIED', 'VERIFICATION_LIMITED', 'VERIFICATION_FAILED');

-- CreateEnum
CREATE TYPE "TransactionSide" AS ENUM ('BUYER', 'SELLER');

-- CreateEnum
CREATE TYPE "TransactionLifecycleStatus" AS ENUM ('DRAFT', 'ACTIVE', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TransactionOperationalStage" AS ENUM ('PREPARATION', 'UNDER_CONTRACT', 'INSPECTION_PERIOD', 'TITLE_DUE_DILIGENCE', 'APPRAISAL_FINANCING', 'PRE_CLOSING', 'CLOSED', 'CANCELLED_REPORTED', 'OTHER_REVIEW_REQUIRED');

-- CreateEnum
CREATE TYPE "TransactionContextVerificationStatus" AS ENUM ('REPORTED', 'AGENT_VERIFIED', 'SOURCE_DOCUMENT_VERIFICATION_PENDING', 'CONFLICT_REQUIRES_REVIEW', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "TransactionDeadlineCategory" AS ENUM ('INSPECTION', 'TITLE', 'APPRAISAL', 'FINANCING', 'HOA', 'INSURANCE', 'CLOSING', 'POSSESSION', 'CONTRACTUAL_OTHER', 'BROKERAGE_OPERATIONAL', 'OTHER');

-- CreateEnum
CREATE TYPE "TransactionDeadlineSourceClass" AS ENUM ('AGENT_RECORDED_SYNTHETIC_CONTRACT_FACT', 'AGENT_RECORDED_MANUAL_FACT', 'AGENT_REPORTED_AMENDMENT', 'AGENT_CORRECTION', 'SOURCE_CONFLICT', 'OTHER_REVIEW_REQUIRED');

-- CreateEnum
CREATE TYPE "TransactionDeadlineVerificationStatus" AS ENUM ('RECORDED', 'AGENT_VERIFIED', 'CONFLICT_REQUIRES_REVIEW', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "TransactionDeadlineAttentionState" AS ENUM ('UPCOMING', 'DUE_SOON', 'PAST_DUE_REVIEW_REQUIRED', 'COMPLETED_REPORTED', 'SUPERSEDED', 'CONFLICT_REQUIRES_REVIEW', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "TransactionIssueCategory" AS ENUM ('INSPECTION', 'TITLE', 'APPRAISAL', 'FINANCING', 'INSURANCE', 'HOA_DOCUMENTS', 'PROPERTY_CONDITION', 'PROFESSIONAL_INPUT_DEPENDENCY', 'DEADLINE_DEPENDENCY', 'UNRESOLVED_FACTUAL_QUESTION', 'OTHER');

-- CreateEnum
CREATE TYPE "TransactionIssueAttentionLevel" AS ENUM ('INFORMATIONAL', 'FOLLOW_UP', 'MATERIAL_REVIEW', 'URGENT_AGENT_ATTENTION', 'REVIEW_REQUIRED');

-- CreateEnum
CREATE TYPE "TransactionIssueState" AS ENUM ('OPEN', 'IN_REVIEW', 'AWAITING_PROFESSIONAL_INPUT', 'AWAITING_CLIENT_INPUT', 'RESOLVED_REPORTED', 'SUPERSEDED', 'CLOSED_INFORMATIONAL');

-- CreateEnum
CREATE TYPE "TransactionDecisionProfile" AS ENUM ('REQUEST_ADDITIONAL_INFORMATION', 'REQUEST_PROFESSIONAL_ESTIMATE', 'REQUEST_INSPECTION_OR_QUOTE', 'PREFERRED_SCHEDULING_OPTION', 'PREFERRED_PROVIDER_SELECTION', 'NON_BINDING_PRIORITY', 'ACKNOWLEDGED_AGENT_REVIEWED_INFORMATION', 'OTHER_LOW_RISK_REVIEW_REQUIRED');

-- CreateEnum
CREATE TYPE "TransactionDecisionSourceMethod" AS ENUM ('AGENT_RECORDED_VERBAL', 'AGENT_RECORDED_EMAIL', 'AGENT_RECORDED_TEXT', 'AGENT_RECORDED_MEETING', 'AGENT_RECORDED_OTHER', 'SYSTEM_RECORDED_AGENT_ACTION');

-- CreateEnum
CREATE TYPE "TransactionTimelineEventType" AS ENUM ('TRANSACTION_CREATED', 'TRANSACTION_STATUS_CHANGED', 'STAGE_REPORTED', 'PROPERTY_ASSOCIATED', 'PARTY_ATTACHED', 'DEADLINE_RECORDED', 'DEADLINE_VERIFIED', 'DEADLINE_SUPERSEDED', 'ISSUE_CREATED', 'ISSUE_STATE_RECORDED', 'DECISION_RECORDED', 'DECISION_SUPERSEDED', 'OUTPUT_REVIEWED', 'COMPLIANCE_CHECKPOINT_RECORDED');

-- CreateEnum
CREATE TYPE "TransactionPartyRole" AS ENUM ('BUYER', 'SELLER', 'AUTHORIZED_REPRESENTATIVE');

-- CreateEnum
CREATE TYPE "EvidenceAdmissionPolicy" AS ENUM ('TRUSTED_INTERNAL_DETERMINISTIC_AUTO_ADMISSION', 'AGENT_REVIEWED_PROFESSIONAL_INPUT', 'AGENT_REVIEWED_MANUAL_EVIDENCE', 'FUTURE_DOCUMENT_VERIFIED_ADMISSION');

-- CreateEnum
CREATE TYPE "EvidenceAdmissionAuditEventType" AS ENUM ('CANDIDATE_CREATED', 'CANDIDATE_REVIEWED', 'CANDIDATE_ADMITTED', 'CANDIDATE_REJECTED', 'ADMISSION_SUPERSEDED');

-- CreateEnum
CREATE TYPE "ProfessionalInputRequestStatus" AS ENUM ('DRAFT', 'REQUESTED', 'ACKNOWLEDGED', 'RESPONDED', 'UNDER_REVIEW', 'COMPLETED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ExternalRequestProfile" AS ENUM ('PROPERTY_MANAGER_RENT_ESTIMATE_V1');

-- CreateEnum
CREATE TYPE "ExternalRequestDeliveryStatus" AS ENUM ('PREPARED', 'SENT', 'DELIVERED', 'DELIVERY_FAILED', 'ACCESSED', 'RESPONDED', 'REVOKED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ExternalRequestIdentityDimension" AS ENUM ('CHANNEL_CONTROL', 'PERSON_IDENTITY', 'ORGANIZATION_AFFILIATION', 'PROFESSIONAL_ROLE', 'CREDENTIAL_STATUS');

-- CreateEnum
CREATE TYPE "ExternalRequestIdentityVerificationMethod" AS ENUM ('AGENT_MANUAL_CONFIRMATION', 'EMAIL_CHANNEL_CONTROL', 'RESPONDER_CLAIM');

-- CreateEnum
CREATE TYPE "ExternalRequestIdentityVerificationStatus" AS ENUM ('CLAIMED', 'VERIFIED', 'LIMITED', 'FAILED');

-- CreateEnum
CREATE TYPE "ClientAuthorizationProfileLifecycle" AS ENUM ('DRAFT', 'REVIEWED', 'ACTIVE', 'SYNTHETIC_CERTIFICATION_ONLY', 'RETIRED', 'POLICY_HELD', 'DEPENDENCY_HELD');

-- CreateEnum
CREATE TYPE "ClientAuthorizationStatus" AS ENUM ('DRAFT', 'PENDING_CONFIRMATION', 'ACTIVE', 'EXPIRED', 'REVOKED', 'SUPERSEDED', 'DECLINED', 'INVALIDATED');

-- CreateEnum
CREATE TYPE "ClientCaseStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ContactEntityType" AS ENUM ('PERSON', 'ORGANIZATION');

-- CreateEnum
CREATE TYPE "ContactLifecycleStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "ContactMethodKind" AS ENUM ('EMAIL', 'PHONE');

-- CreateEnum
CREATE TYPE "ClientCasePartyRole" AS ENUM ('PRIMARY_CLIENT', 'ADDITIONAL_CLIENT', 'OTHER_PARTY');

-- CreateEnum
CREATE TYPE "ClientCaseParticipationStatus" AS ENUM ('ACTIVE', 'ENDED');

-- CreateEnum
CREATE TYPE "ClientCaseAdvisoryRole" AS ENUM ('BUYER', 'SELLER', 'INVESTOR', 'AUTHORIZED_PARTICIPANT', 'CO_PARTICIPANT');

-- CreateEnum
CREATE TYPE "ClientCasePropertyRole" AS ENUM ('CURRENT_HOME', 'NEW_PRIMARY', 'INVESTMENT_PROPERTY', 'SALE_PROPERTY', 'OTHER');

-- CreateEnum
CREATE TYPE "ClientCasePropertyRelationshipRoleType" AS ENUM ('CURRENT_HOME', 'TARGET_PRIMARY', 'INVESTMENT_PROPERTY', 'SALE_RELEVANT', 'OTHER');

-- CreateEnum
CREATE TYPE "ClientCasePropertyRelationshipRoleStatus" AS ENUM ('ACTIVE', 'ENDED');

-- CreateEnum
CREATE TYPE "ClientCaseObjectiveType" AS ENUM ('BUY_PRIMARY_HOME', 'SELL_CURRENT_HOME', 'INVESTMENT_ACQUISITION', 'FINANCIAL_STRATEGY');

-- CreateEnum
CREATE TYPE "ClientCaseObjectiveStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ClientCaseContextScope" AS ENUM ('CASE', 'OBJECTIVE', 'PROPERTY');

-- CreateEnum
CREATE TYPE "ClientCaseContextSourcePosture" AS ENUM ('CLIENT_STATED', 'AGENT_ENTERED', 'EVIDENCE_SUPPORTED', 'PROFESSIONAL_INPUT_SUPPORTED', 'SYSTEM_DERIVED');

-- CreateEnum
CREATE TYPE "ClientCaseScenarioStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ClientCaseScenarioValueType" AS ENUM ('MONEY_CENTS', 'PERCENT_BPS', 'INTEGER', 'STRING_SET');

-- CreateEnum
CREATE TYPE "ClientCaseScenarioPropertyDispositionType" AS ENUM ('SELL', 'RETAIN', 'RETAIN_AS_RENTAL');

-- CreateEnum
CREATE TYPE "ClientAuthorizationPrincipalRequirement" AS ENUM ('SINGLE_REQUIRED_PRINCIPAL', 'ALL_REQUIRED_PRINCIPALS', 'ANY_ONE_AUTHORIZED_PRINCIPAL', 'PROFILE_DEFINED_PRINCIPAL_SET');

-- CreateEnum
CREATE TYPE "ClientAuthorizationCaptureMethod" AS ENUM ('AGENT_RECORDED_VERBAL', 'AGENT_RECORDED_EMAIL', 'AGENT_RECORDED_TEXT', 'AGENT_RECORDED_MEETING', 'CLIENT_PORTAL_CONFIRMED', 'PURPOSE_BOUND_SECURE_LINK', 'SIGNED_DOCUMENT', 'E_SIGNATURE', 'PROVIDER_FORM', 'OTHER_GOVERNED_METHOD');

-- CreateEnum
CREATE TYPE "ClientAuthorizationAssurance" AS ENUM ('AGENT_RECORDED', 'CLIENT_CONFIRMED', 'STRONG_CLIENT_CONFIRMED', 'SIGNED', 'PROVIDER_VERIFIED');

-- CreateEnum
CREATE TYPE "ClientAuthorizationResolution" AS ENUM ('AUTHORIZED', 'NOT_AUTHORIZED', 'REVIEW_REQUIRED');

-- CreateEnum
CREATE TYPE "CountyJurisdictionType" AS ENUM ('COUNTY', 'MUNICIPALITY', 'SPECIAL_DISTRICT', 'OTHER');

-- CreateEnum
CREATE TYPE "PropertySourceIdentifierType" AS ENUM ('ASSESSOR_ACCOUNT', 'PARCEL', 'BUILDING', 'SCHEDULE_NUMBER', 'TAX_ACCOUNT', 'PROPERTY_NUMBER', 'MLS_LISTING', 'SOURCE_PROPERTY_RECORD', 'OTHER_COUNTY_NATIVE_ID');

-- CreateEnum
CREATE TYPE "PropertySourceIdentityStatus" AS ENUM ('OBSERVED', 'ACTIVE', 'CONFLICTING', 'STALE', 'SUPERSEDED', 'RETIRED');

-- CreateEnum
CREATE TYPE "PropertySourceIdentityFreshness" AS ENUM ('FRESH', 'AGING', 'STALE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "PropertySourceIdentityConfidence" AS ENUM ('UNVERIFIED', 'SOURCE_REPORTED', 'DETERMINISTIC_MATCH', 'MANUAL_REVIEW_CONFIRMED');

-- CreateEnum
CREATE TYPE "PropertySourceIdentityRelationshipType" AS ENUM ('ACCOUNT_TO_PARCEL', 'ACCOUNT_TO_BUILDING', 'ACCOUNT_TO_PROPERTY', 'PARCEL_TO_PROPERTY', 'SUPERSEDES', 'OTHER_COUNTY_NATIVE_RELATIONSHIP');

-- CreateEnum
CREATE TYPE "PropertySourceIdentityRelationshipStatus" AS ENUM ('OBSERVED', 'ACTIVE', 'CONFLICTING', 'STALE', 'SUPERSEDED');

-- CreateEnum
CREATE TYPE "PropertyCountyIdentityMappingStatus" AS ENUM ('MATCHED', 'AMBIGUOUS', 'CONFLICTING', 'UNMATCHED', 'STALE', 'SUPERSEDED');

-- CreateEnum
CREATE TYPE "PropertyCountyIdentityMappingBasis" AS ENUM ('AUTHORITATIVE_IDENTIFIER', 'EXACT_IDENTIFIER_WITH_JURISDICTION', 'ADDRESS_UNIT_LEGAL_CONFIRMATION', 'MANUAL_REVIEW', 'FUZZY_ADDRESS_CANDIDATE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "CanonicalPhysicalPropertyIdentityStatus" AS ENUM ('UNRESOLVED', 'ACTIVE', 'CONFLICTING', 'SUPERSEDED', 'RETIRED');

-- CreateEnum
CREATE TYPE "CanonicalPhysicalPropertyIdentityConfidence" AS ENUM ('UNVERIFIED', 'POSSIBLE', 'PROBABLE', 'CONFIRMED', 'CONFLICTING');

-- CreateEnum
CREATE TYPE "CanonicalPhysicalPropertyAssociationType" AS ENUM ('CANONICAL_PROPERTY_HAS_SOURCE_IDENTITY', 'PROPERTY_ASSOCIATED_WITH_PARCEL', 'PROPERTY_ASSOCIATED_WITH_STRUCTURE', 'PROPERTY_ASSOCIATED_WITH_UNIT');

-- CreateEnum
CREATE TYPE "CanonicalPhysicalPropertyAssociationStatus" AS ENUM ('OBSERVED', 'POSSIBLE', 'CONFIRMED', 'CONFLICTING', 'SUPERSEDED');

-- CreateEnum
CREATE TYPE "CanonicalPhysicalPropertyAssociationBasis" AS ENUM ('SOURCE_REPORTED', 'DETERMINISTIC_CORRELATION', 'MANUAL_REVIEW', 'FUZZY_ADDRESS_CANDIDATE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "CanonicalPhysicalPropertyObservationKind" AS ENUM ('IDENTITY', 'ADDRESS', 'PROPERTY_FACT', 'LISTING_EVENT');

-- CreateEnum
CREATE TYPE "CanonicalPropertyListingEventStatus" AS ENUM ('CURRENT', 'HISTORICAL', 'UNRESOLVED', 'CONFLICTING', 'SUPERSEDED');

-- CreateEnum
CREATE TYPE "GeographicObjectType" AS ENUM ('STATE', 'MUNICIPALITY', 'NEIGHBORHOOD', 'MARKET_AREA', 'ZIP_CODE', 'SUBDIVISION');

-- CreateEnum
CREATE TYPE "GeographicLifecycleStatus" AS ENUM ('DRAFT', 'ACTIVE', 'DEPRECATED', 'MERGED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "GeographicVisibility" AS ENUM ('INTERNAL_ONLY', 'PUBLIC_ELIGIBLE');

-- CreateEnum
CREATE TYPE "GeographicAliasType" AS ENUM ('PRIMARY', 'COMMON', 'LEGAL', 'MLS', 'LEGACY');

-- CreateEnum
CREATE TYPE "GeographicRelationshipType" AS ENUM ('CONTAINS', 'WITHIN', 'OVERLAPS', 'ADJACENT_TO', 'SUPERSEDES', 'RELATED_MARKET');

-- CreateEnum
CREATE TYPE "GeographicDirectionality" AS ENUM ('DIRECTED', 'BIDIRECTIONAL');

-- CreateEnum
CREATE TYPE "GeographicSourceClass" AS ENUM ('INTERNAL', 'GOVERNMENT', 'MLS', 'MANUAL_RESEARCH', 'DERIVED');

-- CreateEnum
CREATE TYPE "GeographicAuthorityLevel" AS ENUM ('AUTHORITATIVE', 'SUPPORTING', 'INFORMATIVE', 'UNVERIFIED');

-- CreateEnum
CREATE TYPE "GeographicAccessMethod" AS ENUM ('MANUAL', 'PUBLIC_WEB', 'API', 'FILE_IMPORT', 'INTERNAL_DERIVATION');

-- CreateEnum
CREATE TYPE "GeographicUpdateCadence" AS ENUM ('STATIC', 'ANNUAL', 'QUARTERLY', 'MONTHLY', 'EVENT_DRIVEN', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "GeographicHealthState" AS ENUM ('READY', 'WATCH', 'DEGRADED', 'BLOCKED', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "GeographicConfidence" AS ENUM ('HIGH', 'MEDIUM', 'LOW', 'INSUFFICIENT');

-- CreateEnum
CREATE TYPE "GeographicObservationValueKind" AS ENUM ('TEXT', 'NUMBER', 'BOOLEAN', 'JSON', 'DATE');

-- CreateEnum
CREATE TYPE "GeographicFreshness" AS ENUM ('FRESH', 'AGING', 'STALE', 'UNKNOWN', 'NOT_APPLICABLE');

-- CreateEnum
CREATE TYPE "GeographicDerivationMethod" AS ENUM ('SOURCE_REPORTED', 'MANUAL_REVIEW', 'INTERNAL_DERIVED', 'CROSS_SOURCE_RECONCILED');

-- CreateEnum
CREATE TYPE "GeographicReviewStatus" AS ENUM ('PENDING_REVIEW', 'REVIEWED', 'CONFLICTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "GeographicPropertyRelationshipType" AS ENUM ('LOCATED_IN', 'MARKETED_AS', 'SERVED_BY', 'NEAR');

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
CREATE TABLE "Property" (
    "uuid" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "id" TEXT NOT NULL,
    "mlsId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "beds" DOUBLE PRECISION,
    "baths" DOUBLE PRECISION,
    "sqft" INTEGER,
    "lotSize" DOUBLE PRECISION,
    "yearBuilt" INTEGER,
    "propertyType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "neighborhood" TEXT,
    "subdivision" TEXT,
    "schoolDistrict" TEXT,
    "description" TEXT,
    "listingAgent" TEXT,
    "listingOffice" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastIntelligenceSync" TIMESTAMP(3),
    "sourceModifiedAt" TIMESTAMP(3),
    "publicSearchEligibility" "PublicSearchEligibility",
    "isPrivateExclusive" BOOLEAN NOT NULL DEFAULT false,
    "gcForensics" JSONB,
    "negotiationLevers" JSONB,
    "optimizedValue" INTEGER,
    "efficiencyScore" INTEGER NOT NULL DEFAULT 0,
    "resilienceScore" INTEGER NOT NULL DEFAULT 85,
    "altitude" INTEGER NOT NULL DEFAULT 5280,
    "soilType" TEXT NOT NULL DEFAULT 'Front Range Mixed',
    "hasPolybutyleneRisk" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "PropertySourceIdentity" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "jurisdictionType" "CountyJurisdictionType" NOT NULL,
    "jurisdictionCode" TEXT NOT NULL,
    "identifierType" "PropertySourceIdentifierType" NOT NULL,
    "sourceValue" TEXT NOT NULL,
    "normalizedValue" TEXT NOT NULL,
    "status" "PropertySourceIdentityStatus" NOT NULL DEFAULT 'OBSERVED',
    "firstObservedAt" TIMESTAMP(3),
    "lastObservedAt" TIMESTAMP(3),
    "validFrom" TIMESTAMP(3),
    "validTo" TIMESTAMP(3),
    "isCurrent" BOOLEAN NOT NULL DEFAULT true,
    "supersededById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertySourceIdentity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertySourceIdentityObservation" (
    "id" TEXT NOT NULL,
    "identityId" TEXT NOT NULL,
    "sourceRecordReference" TEXT,
    "fieldSemanticsReference" TEXT,
    "rightsPostureReference" TEXT,
    "attributionReference" TEXT,
    "sourcePayloadReference" TEXT,
    "freshness" "PropertySourceIdentityFreshness" NOT NULL DEFAULT 'UNKNOWN',
    "confidence" "PropertySourceIdentityConfidence" NOT NULL DEFAULT 'UNVERIFIED',
    "observedAt" TIMESTAMP(3) NOT NULL,
    "ingestedAt" TIMESTAMP(3),
    "effectiveAt" TIMESTAMP(3),
    "validFrom" TIMESTAMP(3),
    "validTo" TIMESTAMP(3),
    "observationFingerprint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertySourceIdentityObservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertySourceIdentityRelationship" (
    "id" TEXT NOT NULL,
    "sourceIdentityId" TEXT NOT NULL,
    "targetIdentityId" TEXT NOT NULL,
    "relationshipType" "PropertySourceIdentityRelationshipType" NOT NULL,
    "status" "PropertySourceIdentityRelationshipStatus" NOT NULL DEFAULT 'OBSERVED',
    "confidence" "PropertySourceIdentityConfidence" NOT NULL DEFAULT 'UNVERIFIED',
    "observationId" TEXT NOT NULL,
    "effectiveAt" TIMESTAMP(3),
    "validFrom" TIMESTAMP(3),
    "validTo" TIMESTAMP(3),
    "isCurrent" BOOLEAN NOT NULL DEFAULT true,
    "relationshipFingerprint" TEXT NOT NULL,
    "supersededById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertySourceIdentityRelationship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyCountyIdentityMapping" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "identityId" TEXT NOT NULL,
    "observationId" TEXT,
    "status" "PropertyCountyIdentityMappingStatus" NOT NULL DEFAULT 'UNMATCHED',
    "confidence" "PropertySourceIdentityConfidence" NOT NULL DEFAULT 'UNVERIFIED',
    "basis" "PropertyCountyIdentityMappingBasis" NOT NULL DEFAULT 'UNKNOWN',
    "verificationRequired" BOOLEAN NOT NULL DEFAULT true,
    "conflictReference" TEXT,
    "firstObservedAt" TIMESTAMP(3),
    "lastObservedAt" TIMESTAMP(3),
    "validFrom" TIMESTAMP(3),
    "validTo" TIMESTAMP(3),
    "isCurrent" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyCountyIdentityMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CanonicalPhysicalProperty" (
    "id" TEXT NOT NULL,
    "identityStatus" "CanonicalPhysicalPropertyIdentityStatus" NOT NULL DEFAULT 'UNRESOLVED',
    "identityConfidence" "CanonicalPhysicalPropertyIdentityConfidence" NOT NULL DEFAULT 'UNVERIFIED',
    "sourceFormattedSitusAddress" TEXT,
    "normalizedSitusAddress" TEXT,
    "streetNumber" TEXT,
    "preDirectional" TEXT,
    "streetName" TEXT,
    "streetSuffix" TEXT,
    "postDirectional" TEXT,
    "unit" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postalCode" TEXT,
    "county" TEXT,
    "jurisdiction" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "firstObservedAt" TIMESTAMP(3),
    "lastObservedAt" TIMESTAMP(3),
    "validFrom" TIMESTAMP(3),
    "validTo" TIMESTAMP(3),
    "supersededById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CanonicalPhysicalProperty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CanonicalPhysicalPropertySourceIdentityMapping" (
    "id" TEXT NOT NULL,
    "canonicalPropertyId" TEXT NOT NULL,
    "identityId" TEXT NOT NULL,
    "associationType" "CanonicalPhysicalPropertyAssociationType" NOT NULL,
    "status" "CanonicalPhysicalPropertyAssociationStatus" NOT NULL DEFAULT 'OBSERVED',
    "confidence" "CanonicalPhysicalPropertyIdentityConfidence" NOT NULL DEFAULT 'UNVERIFIED',
    "basis" "CanonicalPhysicalPropertyAssociationBasis" NOT NULL DEFAULT 'UNKNOWN',
    "verificationRequired" BOOLEAN NOT NULL DEFAULT true,
    "conflictReference" TEXT,
    "firstObservedAt" TIMESTAMP(3),
    "lastObservedAt" TIMESTAMP(3),
    "validFrom" TIMESTAMP(3),
    "validTo" TIMESTAMP(3),
    "isCurrent" BOOLEAN NOT NULL DEFAULT true,
    "mappingFingerprint" TEXT NOT NULL,
    "supersededById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CanonicalPhysicalPropertySourceIdentityMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CanonicalPhysicalPropertyObservation" (
    "id" TEXT NOT NULL,
    "canonicalPropertyId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "sourceIdentityId" TEXT,
    "sourceIdentityObservationId" TEXT,
    "observationKind" "CanonicalPhysicalPropertyObservationKind" NOT NULL,
    "sourceRecordReference" TEXT,
    "fieldSemanticsReference" TEXT,
    "rightsPostureReference" TEXT,
    "attributionReference" TEXT,
    "sourcePayloadReference" TEXT,
    "freshness" "PropertySourceIdentityFreshness" NOT NULL DEFAULT 'UNKNOWN',
    "confidence" "CanonicalPhysicalPropertyIdentityConfidence" NOT NULL DEFAULT 'UNVERIFIED',
    "observedAt" TIMESTAMP(3) NOT NULL,
    "ingestedAt" TIMESTAMP(3),
    "effectiveAt" TIMESTAMP(3),
    "validFrom" TIMESTAMP(3),
    "validTo" TIMESTAMP(3),
    "observationFingerprint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CanonicalPhysicalPropertyObservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CanonicalPropertyListingEvent" (
    "id" TEXT NOT NULL,
    "canonicalPropertyId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "sourceListingReference" TEXT NOT NULL,
    "status" "CanonicalPropertyListingEventStatus" NOT NULL DEFAULT 'UNRESOLVED',
    "confidence" "CanonicalPhysicalPropertyIdentityConfidence" NOT NULL DEFAULT 'UNVERIFIED',
    "rightsPostureReference" TEXT,
    "observationReference" TEXT,
    "effectiveAt" TIMESTAMP(3),
    "validFrom" TIMESTAMP(3),
    "validTo" TIMESTAMP(3),
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "conflictReference" TEXT,
    "verificationRequired" BOOLEAN NOT NULL DEFAULT true,
    "eventFingerprint" TEXT NOT NULL,
    "supersededById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CanonicalPropertyListingEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MlsSyncState" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "lastSync" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastIntelligenceSync" TIMESTAMP(3),
    "lastPage" INTEGER NOT NULL DEFAULT 0,
    "totalRecords" INTEGER NOT NULL DEFAULT 0,
    "isSyncing" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MlsSyncState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "REIEControlState" (
    "key" TEXT NOT NULL,
    "state" JSONB NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "REIEControlState_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "PropertyPhoto" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "PropertyPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceHistory" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "event" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PriceHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpenHouse" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OpenHouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "isUnsubscribed" BOOLEAN NOT NULL DEFAULT false,
    "unsubscribedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Lead',
    "hasPrivateAccess" BOOLEAN NOT NULL DEFAULT false,
    "heatScore" INTEGER NOT NULL DEFAULT 0,
    "aestheticTag" TEXT,
    "intentSchema" TEXT,
    "legacyGoal" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CRMTask" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "leadId" TEXT NOT NULL,
    "leadid" UUID,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "title" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CRMTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserInteraction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "duration" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadInteraction" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "clientId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "interactionType" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreference" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "userId" TEXT NOT NULL,
    "avgPrice" INTEGER,
    "avgBeds" INTEGER,
    "topCities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NorthStar" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "type" TEXT NOT NULL,
    "frequency" INTEGER NOT NULL DEFAULT 5,

    CONSTRAINT "NorthStar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedSearch" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "minPrice" INTEGER,
    "beds" INTEGER,
    "type" TEXT,
    "north" DOUBLE PRECISION,
    "south" DOUBLE PRECISION,
    "east" DOUBLE PRECISION,
    "west" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedSearch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlertEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertQueue" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "payload" JSONB,
    "clickedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlertQueue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SellerLead" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "city" TEXT NOT NULL,
    "beds" INTEGER,
    "price" INTEGER,
    "reason" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,

    CONSTRAINT "SellerLead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnsubscribeToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "searchId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usedAt" TIMESTAMP(3),

    CONSTRAINT "UnsubscribeToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'CO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Neighborhood" (
    "id" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "avgEfficiencyScore" INTEGER NOT NULL DEFAULT 0,
    "primaryAnchor" TEXT NOT NULL,
    "lifestyleVibe" TEXT NOT NULL,
    "era" TEXT,
    "resilienceScore" INTEGER NOT NULL DEFAULT 0,
    "altitude" INTEGER,
    "soilType" TEXT,
    "fireRisk" TEXT,
    "insuranceComplexity" TEXT,
    "waterRights" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Neighborhood_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeographicObject" (
    "id" TEXT NOT NULL,
    "objectType" "GeographicObjectType" NOT NULL,
    "canonicalName" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "canonicalSlug" TEXT NOT NULL,
    "lifecycleStatus" "GeographicLifecycleStatus" NOT NULL DEFAULT 'DRAFT',
    "visibility" "GeographicVisibility" NOT NULL DEFAULT 'INTERNAL_ONLY',
    "convenienceParentId" TEXT,
    "mergedIntoId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeographicObject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeographicAlias" (
    "id" TEXT NOT NULL,
    "objectId" TEXT NOT NULL,
    "aliasText" TEXT NOT NULL,
    "normalizedValue" TEXT NOT NULL,
    "aliasType" "GeographicAliasType" NOT NULL,
    "language" TEXT,
    "sourceId" TEXT,
    "lifecycleStatus" "GeographicLifecycleStatus" NOT NULL DEFAULT 'ACTIVE',
    "effectiveDate" TIMESTAMP(3),
    "expirationDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeographicAlias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeographicRelationship" (
    "id" TEXT NOT NULL,
    "sourceObjectId" TEXT NOT NULL,
    "targetObjectId" TEXT NOT NULL,
    "relationshipType" "GeographicRelationshipType" NOT NULL,
    "directionality" "GeographicDirectionality" NOT NULL DEFAULT 'DIRECTED',
    "lifecycleStatus" "GeographicLifecycleStatus" NOT NULL DEFAULT 'ACTIVE',
    "sourceId" TEXT,
    "confidence" "GeographicConfidence" NOT NULL DEFAULT 'MEDIUM',
    "derivationMethod" "GeographicDerivationMethod" NOT NULL DEFAULT 'MANUAL_REVIEW',
    "effectiveDate" TIMESTAMP(3),
    "expirationDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeographicRelationship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeographicSource" (
    "id" TEXT NOT NULL,
    "canonicalName" TEXT NOT NULL,
    "sourceClass" "GeographicSourceClass" NOT NULL,
    "authorityLevel" "GeographicAuthorityLevel" NOT NULL,
    "accessMethod" "GeographicAccessMethod" NOT NULL,
    "coverageDescription" TEXT,
    "defaultUpdateCadence" "GeographicUpdateCadence" NOT NULL DEFAULT 'UNKNOWN',
    "licensingRestriction" BOOLEAN NOT NULL DEFAULT false,
    "publicDisplayRestriction" BOOLEAN NOT NULL DEFAULT true,
    "healthState" "GeographicHealthState" NOT NULL DEFAULT 'UNKNOWN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeographicSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeographicObservation" (
    "id" TEXT NOT NULL,
    "objectId" TEXT NOT NULL,
    "observationKey" TEXT NOT NULL,
    "valueKind" "GeographicObservationValueKind" NOT NULL,
    "valueText" TEXT,
    "valueNumber" DECIMAL(65,30),
    "valueBoolean" BOOLEAN,
    "valueDate" TIMESTAMP(3),
    "valueJson" JSONB,
    "valueSchemaKey" TEXT,
    "sourceId" TEXT,
    "effectiveDate" TIMESTAMP(3),
    "retrievedAt" TIMESTAMP(3),
    "verifiedAt" TIMESTAMP(3),
    "freshness" "GeographicFreshness" NOT NULL DEFAULT 'UNKNOWN',
    "confidence" "GeographicConfidence" NOT NULL DEFAULT 'MEDIUM',
    "derivationMethod" "GeographicDerivationMethod" NOT NULL DEFAULT 'SOURCE_REPORTED',
    "conflictGroupKey" TEXT,
    "reviewStatus" "GeographicReviewStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "publicVisibility" "GeographicVisibility" NOT NULL DEFAULT 'INTERNAL_ONLY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeographicObservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeographicEligibility" (
    "id" TEXT NOT NULL,
    "objectId" TEXT NOT NULL,
    "internalUse" BOOLEAN NOT NULL DEFAULT false,
    "searchEligible" BOOLEAN NOT NULL DEFAULT false,
    "mapEligible" BOOLEAN NOT NULL DEFAULT false,
    "publicPageEligible" BOOLEAN NOT NULL DEFAULT false,
    "indexingEligible" BOOLEAN NOT NULL DEFAULT false,
    "propertyEnrichment" BOOLEAN NOT NULL DEFAULT false,
    "marketAnalytics" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeographicEligibility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyGeographicRelationship" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "geographicObjectId" TEXT NOT NULL,
    "relationshipType" "GeographicPropertyRelationshipType" NOT NULL,
    "sourceId" TEXT,
    "confidence" "GeographicConfidence" NOT NULL DEFAULT 'MEDIUM',
    "assignmentMethod" "GeographicDerivationMethod" NOT NULL DEFAULT 'MANUAL_REVIEW',
    "effectiveDate" TIMESTAMP(3),
    "expirationDate" TIMESTAMP(3),
    "lifecycleStatus" "GeographicLifecycleStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyGeographicRelationship_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "OutputProduct" (
    "id" TEXT NOT NULL,
    "ownerAgentSubject" TEXT NOT NULL,
    "productKind" "OutputProductKind" NOT NULL,
    "audience" "OutputAudience" NOT NULL,
    "subjectRef" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "outputContractVersion" TEXT NOT NULL,
    "lineageKey" TEXT NOT NULL,
    "clientCaseId" TEXT,
    "transactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OutputProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutputVersion" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sourceVersionRef" TEXT NOT NULL,
    "versionOrdinal" INTEGER NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "outputContractVersion" TEXT NOT NULL,
    "displayVersion" TEXT NOT NULL,
    "audience" "OutputAudience" NOT NULL,
    "subjectRef" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "effectiveAsOf" TIMESTAMP(3) NOT NULL,
    "lifecycleState" "OutputVersionLifecycleState" NOT NULL,
    "reviewState" TEXT NOT NULL,
    "contentVersion" TEXT NOT NULL,
    "compositionVersion" TEXT NOT NULL,
    "presentationVisualVersion" TEXT NOT NULL,
    "contentFingerprint" TEXT NOT NULL,
    "payloadSchemaVersion" TEXT NOT NULL,
    "contentPayload" JSONB NOT NULL,
    "lineage" JSONB NOT NULL,
    "ownerAgentSubject" TEXT NOT NULL,
    "multiPropertyFinancialScenarioVersionId" TEXT,
    "reviewedAt" TIMESTAMP(3) NOT NULL,
    "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OutputVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutputEvidenceSnapshot" (
    "id" TEXT NOT NULL,
    "outputVersionId" TEXT NOT NULL,
    "snapshotSchemaVersion" TEXT NOT NULL,
    "sourceSnapshotRefs" JSONB NOT NULL,
    "metricRefs" JSONB NOT NULL,
    "analysisRefs" JSONB NOT NULL,
    "agentInputRefs" JSONB NOT NULL,
    "assumptionRefs" JSONB NOT NULL,
    "limitationRefs" JSONB NOT NULL,
    "rightsRefs" JSONB NOT NULL,
    "freshnessRefs" JSONB NOT NULL,
    "reviewState" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OutputEvidenceSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutputDependency" (
    "id" TEXT NOT NULL,
    "outputVersionId" TEXT NOT NULL,
    "upstreamArtifact" TEXT NOT NULL,
    "downstreamArtifact" TEXT NOT NULL,
    "dependencyType" "OutputDependencyType" NOT NULL,
    "materiality" TEXT NOT NULL,
    "versionUsed" TEXT NOT NULL,
    "fieldMetricScope" JSONB NOT NULL,
    "changePolicy" TEXT NOT NULL,
    "invalidationPolicy" "OutputInvalidationState" NOT NULL,
    "reviewPolicy" TEXT NOT NULL,
    "currentState" "OutputInvalidationState" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OutputDependency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutputReview" (
    "id" TEXT NOT NULL,
    "outputVersionId" TEXT NOT NULL,
    "reviewerSubject" TEXT NOT NULL,
    "disposition" "OutputReviewDisposition" NOT NULL,
    "reviewContractVersion" TEXT NOT NULL,
    "reviewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewNote" TEXT,

    CONSTRAINT "OutputReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutputDecision" (
    "id" TEXT NOT NULL,
    "outputVersionId" TEXT NOT NULL,
    "decisionRef" TEXT NOT NULL,
    "disposition" "OutputDecisionDisposition" NOT NULL,
    "decisionSchemaVersion" TEXT NOT NULL,
    "recordedBySubject" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rationale" TEXT,

    CONSTRAINT "OutputDecision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutputCheckpoint" (
    "id" TEXT NOT NULL,
    "outputVersionId" TEXT NOT NULL,
    "checkpointRef" TEXT NOT NULL,
    "state" "OutputCheckpointState" NOT NULL,
    "checkpointSchemaVersion" TEXT NOT NULL,
    "recordedBySubject" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "detail" TEXT,

    CONSTRAINT "OutputCheckpoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvidenceCandidate" (
    "id" TEXT NOT NULL,
    "ownerAgentSubject" TEXT NOT NULL,
    "sourceKind" "EvidenceSourceKind" NOT NULL,
    "sourceRef" TEXT NOT NULL,
    "claimKind" "EvidenceClaimKind" NOT NULL,
    "candidatePayload" JSONB NOT NULL,
    "observedAt" TIMESTAMP(3),
    "receivedAt" TIMESTAMP(3) NOT NULL,
    "status" "EvidenceCandidateStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "provenance" JSONB NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "reviewedBySubject" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "admissionPolicyContext" JSONB NOT NULL,
    "admissionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EvidenceCandidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvidenceAdmission" (
    "id" TEXT NOT NULL,
    "ownerAgentSubject" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "sourceKind" "EvidenceSourceKind" NOT NULL,
    "sourceRef" TEXT NOT NULL,
    "claimKind" "EvidenceClaimKind" NOT NULL,
    "admittedValue" JSONB NOT NULL,
    "provenance" JSONB NOT NULL,
    "admissionPolicy" "EvidenceAdmissionPolicy" NOT NULL,
    "admittedBySubject" TEXT NOT NULL,
    "admittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "effectiveAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "reviewAfter" TIMESTAMP(3),
    "supersedesAdmissionId" TEXT,
    "fingerprint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EvidenceAdmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvidenceAdmissionAuditEvent" (
    "id" TEXT NOT NULL,
    "ownerAgentSubject" TEXT NOT NULL,
    "candidateId" TEXT,
    "admissionId" TEXT,
    "eventType" "EvidenceAdmissionAuditEventType" NOT NULL,
    "actorSubject" TEXT NOT NULL,
    "policyContext" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EvidenceAdmissionAuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessionalInputRequest" (
    "id" TEXT NOT NULL,
    "ownerAgentSubject" TEXT NOT NULL,
    "claimKind" "EvidenceClaimKind" NOT NULL,
    "requestedSourceRole" TEXT NOT NULL,
    "status" "ProfessionalInputRequestStatus" NOT NULL DEFAULT 'DRAFT',
    "requestedBySubject" TEXT NOT NULL,
    "requestedAt" TIMESTAMP(3),
    "dueAt" TIMESTAMP(3),
    "purpose" TEXT NOT NULL,
    "supportDocumentRequired" BOOLEAN NOT NULL DEFAULT false,
    "supersedesRequestId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfessionalInputRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalRequestDelivery" (
    "id" TEXT NOT NULL,
    "ownerAgentSubject" TEXT NOT NULL,
    "professionalInputRequestId" TEXT NOT NULL,
    "profile" "ExternalRequestProfile" NOT NULL,
    "recipientEmail" TEXT NOT NULL,
    "recipientDisplayName" TEXT,
    "recipientOrganization" TEXT,
    "provider" TEXT NOT NULL DEFAULT 'RESEND',
    "status" "ExternalRequestDeliveryStatus" NOT NULL DEFAULT 'PREPARED',
    "requestFingerprint" TEXT NOT NULL,
    "providerMessageId" TEXT,
    "sentAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "accessedAt" TIMESTAMP(3),
    "respondedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "failureCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExternalRequestDelivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalRequestCapability" (
    "id" TEXT NOT NULL,
    "deliveryId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "maxUses" INTEGER NOT NULL DEFAULT 1,
    "useCount" INTEGER NOT NULL DEFAULT 0,
    "exchangedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExternalRequestCapability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalRequestSession" (
    "id" TEXT NOT NULL,
    "deliveryId" TEXT NOT NULL,
    "sessionHash" TEXT NOT NULL,
    "csrfTokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "lastAccessedAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExternalRequestSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalRequestDisclosureSnapshot" (
    "id" TEXT NOT NULL,
    "deliveryId" TEXT NOT NULL,
    "contractVersion" TEXT NOT NULL,
    "disclosure" JSONB NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExternalRequestDisclosureSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalIdentityVerification" (
    "id" TEXT NOT NULL,
    "deliveryId" TEXT NOT NULL,
    "dimension" "ExternalRequestIdentityDimension" NOT NULL,
    "method" "ExternalRequestIdentityVerificationMethod" NOT NULL,
    "status" "ExternalRequestIdentityVerificationStatus" NOT NULL,
    "assertedValue" TEXT,
    "verifiedBySubject" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExternalIdentityVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessionalInputResponse" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "ownerAgentSubject" TEXT NOT NULL,
    "sourceReference" TEXT NOT NULL,
    "sourceRoleClaim" TEXT,
    "sourceIdentityReference" TEXT,
    "providedAt" TIMESTAMP(3),
    "receivedAt" TIMESTAMP(3) NOT NULL,
    "responsePayload" JSONB NOT NULL,
    "provenance" JSONB NOT NULL,
    "verificationStatus" "EvidenceVerificationStatus" NOT NULL,
    "candidateId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfessionalInputResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessionalInput" (
    "id" TEXT NOT NULL,
    "ownerAgentSubject" TEXT NOT NULL,
    "claimKind" "EvidenceClaimKind" NOT NULL,
    "versionOrdinal" INTEGER NOT NULL,
    "value" JSONB NOT NULL,
    "evidenceAdmissionId" TEXT NOT NULL,
    "effectiveAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "reviewAfter" TIMESTAMP(3),
    "provenance" JSONB NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfessionalInput_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "ownerAgentSubject" TEXT NOT NULL,
    "clientCaseId" TEXT,
    "canonicalPropertyId" TEXT,
    "label" TEXT NOT NULL,
    "side" "TransactionSide" NOT NULL,
    "status" "TransactionLifecycleStatus" NOT NULL DEFAULT 'ACTIVE',
    "stage" "TransactionOperationalStage" NOT NULL,
    "clientContextLabel" TEXT,
    "clientContextStatus" TEXT NOT NULL DEFAULT 'SYNTHETIC_OR_REVIEW_REQUIRED',
    "mutualExecutionAt" TIMESTAMP(3),
    "executionVerificationStatus" "TransactionContextVerificationStatus" NOT NULL DEFAULT 'UNKNOWN',
    "contractProfileReference" TEXT,
    "sourceReference" TEXT,
    "limitations" TEXT,
    "closedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "archivePolicyVersion" TEXT NOT NULL DEFAULT 'DQG_TRANSACTION_ARCHIVE_POLICY_V1',
    "idempotencyKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionParty" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "clientCasePartyId" TEXT NOT NULL,
    "role" "TransactionPartyRole" NOT NULL,
    "displayLabelSnapshot" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransactionParty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientCase" (
    "id" TEXT NOT NULL,
    "ownerAgentSubject" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "status" "ClientCaseStatus" NOT NULL DEFAULT 'ACTIVE',
    "archivedAt" TIMESTAMP(3),
    "createdBySubject" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "ownerAgentSubject" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "givenName" TEXT,
    "familyName" TEXT,
    "entityType" "ContactEntityType" NOT NULL DEFAULT 'PERSON',
    "lifecycleStatus" "ContactLifecycleStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdBySubject" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMethod" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "kind" "ContactMethodKind" NOT NULL,
    "displayValue" TEXT NOT NULL,
    "normalizedValue" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "lifecycleStatus" "ContactLifecycleStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientCaseParty" (
    "id" TEXT NOT NULL,
    "clientCaseId" TEXT NOT NULL,
    "contactId" TEXT,
    "role" "ClientCasePartyRole" NOT NULL,
    "participationStatus" "ClientCaseParticipationStatus" NOT NULL DEFAULT 'ACTIVE',
    "displayLabel" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientCaseParty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientCasePartyAdvisoryRole" (
    "id" TEXT NOT NULL,
    "clientCasePartyId" TEXT NOT NULL,
    "role" "ClientCaseAdvisoryRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientCasePartyAdvisoryRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientCaseProperty" (
    "id" TEXT NOT NULL,
    "clientCaseId" TEXT NOT NULL,
    "canonicalPropertyId" TEXT NOT NULL,
    "role" "ClientCasePropertyRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientCaseProperty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientCasePropertyRelationshipRole" (
    "id" TEXT NOT NULL,
    "clientCasePropertyId" TEXT NOT NULL,
    "role" "ClientCasePropertyRelationshipRoleType" NOT NULL,
    "status" "ClientCasePropertyRelationshipRoleStatus" NOT NULL DEFAULT 'ACTIVE',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "createdBySubject" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientCasePropertyRelationshipRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientCaseObjective" (
    "id" TEXT NOT NULL,
    "clientCaseId" TEXT NOT NULL,
    "objectiveType" "ClientCaseObjectiveType" NOT NULL,
    "status" "ClientCaseObjectiveStatus" NOT NULL DEFAULT 'ACTIVE',
    "title" TEXT NOT NULL,
    "createdBySubject" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "idempotencyKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientCaseObjective_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientCaseFact" (
    "id" TEXT NOT NULL,
    "clientCaseId" TEXT NOT NULL,
    "objectiveId" TEXT,
    "clientCasePropertyId" TEXT,
    "semanticKey" TEXT NOT NULL,
    "scope" "ClientCaseContextScope" NOT NULL,
    "scopeReference" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "sourcePosture" "ClientCaseContextSourcePosture" NOT NULL,
    "evidenceAdmissionId" TEXT,
    "professionalInputId" TEXT,
    "recordedBySubject" TEXT NOT NULL,
    "observedAt" TIMESTAMP(3),
    "effectiveAt" TIMESTAMP(3),
    "reviewAfter" TIMESTAMP(3),
    "limitation" TEXT,
    "supersedesFactId" TEXT,
    "supersededAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientCaseFact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientCaseCriterion" (
    "id" TEXT NOT NULL,
    "clientCaseId" TEXT NOT NULL,
    "objectiveId" TEXT,
    "clientCasePropertyId" TEXT,
    "semanticKey" TEXT NOT NULL,
    "scope" "ClientCaseContextScope" NOT NULL,
    "scopeReference" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "sourcePosture" "ClientCaseContextSourcePosture" NOT NULL,
    "evidenceAdmissionId" TEXT,
    "professionalInputId" TEXT,
    "recordedBySubject" TEXT NOT NULL,
    "observedAt" TIMESTAMP(3),
    "effectiveAt" TIMESTAMP(3),
    "reviewAfter" TIMESTAMP(3),
    "limitation" TEXT,
    "supersedesCriterionId" TEXT,
    "supersededAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientCaseCriterion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientCaseScenario" (
    "id" TEXT NOT NULL,
    "clientCaseId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "ClientCaseScenarioStatus" NOT NULL DEFAULT 'ACTIVE',
    "archivedAt" TIMESTAMP(3),
    "currentVersionId" TEXT,
    "duplicatedFromScenarioId" TEXT,
    "duplicatedFromScenarioVersionId" TEXT,
    "createdBySubject" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientCaseScenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientCaseScenarioVersion" (
    "id" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "createdBySubject" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientCaseScenarioVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientCaseScenarioAssumption" (
    "id" TEXT NOT NULL,
    "scenarioVersionId" TEXT NOT NULL,
    "semanticKey" TEXT NOT NULL,
    "valueType" "ClientCaseScenarioValueType" NOT NULL,
    "value" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientCaseScenarioAssumption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientCaseScenarioCriterion" (
    "id" TEXT NOT NULL,
    "scenarioVersionId" TEXT NOT NULL,
    "semanticKey" TEXT NOT NULL,
    "valueType" "ClientCaseScenarioValueType" NOT NULL,
    "value" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientCaseScenarioCriterion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientCaseScenarioPropertyDisposition" (
    "id" TEXT NOT NULL,
    "scenarioVersionId" TEXT NOT NULL,
    "clientCasePropertyId" TEXT NOT NULL,
    "disposition" "ClientCaseScenarioPropertyDispositionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientCaseScenarioPropertyDisposition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientCaseScenarioObjective" (
    "id" TEXT NOT NULL,
    "scenarioVersionId" TEXT NOT NULL,
    "clientCaseObjectiveId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientCaseScenarioObjective_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionDeadline" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "category" "TransactionDeadlineCategory" NOT NULL,
    "label" TEXT NOT NULL,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "timezone" TEXT NOT NULL,
    "sourceClass" "TransactionDeadlineSourceClass" NOT NULL,
    "sourceReference" TEXT,
    "verificationStatus" "TransactionDeadlineVerificationStatus" NOT NULL DEFAULT 'RECORDED',
    "attentionState" "TransactionDeadlineAttentionState" NOT NULL DEFAULT 'UPCOMING',
    "recordedBySubject" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedBySubject" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "notes" TEXT,
    "successorReason" TEXT,
    "supersedesDeadlineId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransactionDeadline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionIssue" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "category" "TransactionIssueCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "factualSummary" TEXT NOT NULL,
    "sourceClass" TEXT NOT NULL,
    "sourceReference" TEXT,
    "attentionLevel" "TransactionIssueAttentionLevel" NOT NULL,
    "state" "TransactionIssueState" NOT NULL DEFAULT 'OPEN',
    "relatedDeadlineId" TEXT,
    "professionalInputResponseId" TEXT,
    "evidenceCandidateId" TEXT,
    "evidenceAdmissionId" TEXT,
    "outputVersionId" TEXT,
    "agentNotes" TEXT,
    "createdBySubject" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedBySubject" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "supersedesIssueId" TEXT,

    CONSTRAINT "TransactionIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionDecision" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "profile" "TransactionDecisionProfile" NOT NULL,
    "description" TEXT NOT NULL,
    "sourceMethod" "TransactionDecisionSourceMethod" NOT NULL,
    "clientContextLabel" TEXT,
    "occurredAt" TIMESTAMP(3),
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recordedBySubject" TEXT NOT NULL,
    "provenance" JSONB NOT NULL,
    "limitations" TEXT NOT NULL,
    "relatedIssueId" TEXT,
    "relatedDeadlineId" TEXT,
    "professionalInputResponseId" TEXT,
    "evidenceAdmissionId" TEXT,
    "policyClassification" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "supersedesDecisionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransactionDecision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionTimelineEvent" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "eventType" "TransactionTimelineEventType" NOT NULL,
    "objectReference" TEXT NOT NULL,
    "actorSubject" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3),
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransactionTimelineEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
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

-- CreateTable
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
    "consumedAt" TIMESTAMP(3),
    "consumptionIdempotencyKey" TEXT,
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

-- CreateTable
CREATE TABLE "ClientAuthorizationPrincipal" (
    "id" TEXT NOT NULL,
    "authorizationId" TEXT NOT NULL,
    "principalRef" TEXT NOT NULL,
    "displayLabel" TEXT NOT NULL,
    "representativeReference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientAuthorizationPrincipal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientAuthorizationSnapshot" (
    "id" TEXT NOT NULL,
    "authorizationId" TEXT NOT NULL,
    "schemaVersion" TEXT NOT NULL,
    "snapshot" JSONB NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientAuthorizationSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
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

-- CreateTable
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

-- CreateTable
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
    "clientAuthorizationPrincipalId" TEXT,

    CONSTRAINT "ClientAuthorizationSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
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
    "clientAuthorizationPrincipalId" TEXT,

    CONSTRAINT "ClientAuthorizationConfirmationEvidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SellerFinancialScenario" (
    "id" TEXT NOT NULL,
    "ownerAgentSubject" TEXT NOT NULL,
    "scenarioKey" TEXT NOT NULL,
    "versionOrdinal" INTEGER NOT NULL,
    "lifecycleState" TEXT NOT NULL,
    "calculationContract" TEXT NOT NULL,
    "inputSnapshot" JSONB NOT NULL,
    "sourceQualification" JSONB NOT NULL,
    "professionalInputRefs" JSONB NOT NULL,
    "scenarioFingerprint" TEXT NOT NULL,
    "supersedesScenarioId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "SellerFinancialScenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SellerFinancialResult" (
    "id" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "ownerAgentSubject" TEXT NOT NULL,
    "calculationContract" TEXT NOT NULL,
    "resultPayload" JSONB NOT NULL,
    "resultFingerprint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SellerFinancialResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SellerFinancialAuditEvent" (
    "id" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "ownerAgentSubject" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventFingerprint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SellerFinancialAuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentAnalysis" (
    "id" TEXT NOT NULL,
    "ownerAgentSubject" TEXT NOT NULL,
    "analysisKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "lifecycleState" TEXT NOT NULL,
    "calculationVersion" TEXT NOT NULL,
    "assumptionPolicy" TEXT NOT NULL,
    "clientContextRef" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InvestmentAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentScenario" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "ownerAgentSubject" TEXT NOT NULL,
    "scenarioKey" TEXT NOT NULL,
    "versionOrdinal" INTEGER NOT NULL,
    "lifecycleState" TEXT NOT NULL,
    "calculationVersion" TEXT NOT NULL,
    "assumptionPolicy" TEXT NOT NULL,
    "inputSnapshot" JSONB NOT NULL,
    "sourceQualification" JSONB NOT NULL,
    "dependencySnapshot" JSONB NOT NULL,
    "inputFingerprint" TEXT NOT NULL,
    "supersedesScenarioId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "InvestmentScenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentScenarioResult" (
    "id" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "ownerAgentSubject" TEXT NOT NULL,
    "calculationVersion" TEXT NOT NULL,
    "resultSnapshot" JSONB NOT NULL,
    "resultFingerprint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvestmentScenarioResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentScenarioAuditEvent" (
    "id" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "ownerAgentSubject" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventFingerprint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvestmentScenarioAuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StrategyAnalysis" (
    "id" TEXT NOT NULL,
    "ownerAgentSubject" TEXT NOT NULL,
    "analysisKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "lifecycleState" TEXT NOT NULL,
    "engineVersion" TEXT NOT NULL,
    "assumptionPolicy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StrategyAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StrategyAlternative" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "ownerAgentSubject" TEXT NOT NULL,
    "alternativeKey" TEXT NOT NULL,
    "versionOrdinal" INTEGER NOT NULL,
    "strategyProfile" TEXT NOT NULL,
    "lifecycleState" TEXT NOT NULL,
    "inputSnapshot" JSONB NOT NULL,
    "sourceQualification" JSONB NOT NULL,
    "dependencySnapshot" JSONB NOT NULL,
    "inputFingerprint" TEXT NOT NULL,
    "supersedesAlternativeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "StrategyAlternative_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StrategyAlternativeResult" (
    "id" TEXT NOT NULL,
    "alternativeId" TEXT NOT NULL,
    "ownerAgentSubject" TEXT NOT NULL,
    "inputFingerprint" TEXT NOT NULL,
    "calculationVersion" TEXT NOT NULL,
    "versionOrdinal" INTEGER NOT NULL,
    "resultSnapshot" JSONB NOT NULL,
    "resultFingerprint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StrategyAlternativeResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StrategyPropertyRole" (
    "id" TEXT NOT NULL,
    "alternativeId" TEXT NOT NULL,
    "canonicalPropertyId" TEXT NOT NULL,
    "ownerAgentSubject" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "disposition" TEXT NOT NULL,
    "inputSnapshot" JSONB NOT NULL,
    "provenanceSnapshot" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StrategyPropertyRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StrategyAlternativeDependency" (
    "id" TEXT NOT NULL,
    "alternativeId" TEXT NOT NULL,
    "ownerAgentSubject" TEXT NOT NULL,
    "upstreamArtifact" TEXT NOT NULL,
    "dependencyType" TEXT NOT NULL,
    "versionUsed" TEXT NOT NULL,
    "qualification" TEXT NOT NULL,
    "detail" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StrategyAlternativeDependency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StrategyAlternativeAuditEvent" (
    "id" TEXT NOT NULL,
    "alternativeId" TEXT NOT NULL,
    "ownerAgentSubject" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventFingerprint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StrategyAlternativeAuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MultiPropertyFinancialScenario" (
    "id" TEXT NOT NULL,
    "ownerAgentSubject" TEXT NOT NULL,
    "clientCaseId" TEXT,
    "scenarioKey" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "lifecycleState" "MultiPropertyFinancialScenarioLifecycleState" NOT NULL DEFAULT 'ACTIVE',
    "createdBySubject" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "MultiPropertyFinancialScenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MultiPropertyFinancialScenarioVersion" (
    "id" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "ownerAgentSubject" TEXT NOT NULL,
    "versionOrdinal" INTEGER NOT NULL,
    "schemaVersion" TEXT NOT NULL,
    "calculationEngine" TEXT NOT NULL,
    "inputSnapshot" JSONB NOT NULL,
    "inputFingerprint" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "supersedesVersionId" TEXT,
    "createdBySubject" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MultiPropertyFinancialScenarioVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MultiPropertyFinancialScenarioProperty" (
    "id" TEXT NOT NULL,
    "scenarioVersionId" TEXT NOT NULL,
    "canonicalPropertyId" TEXT,
    "ownerAgentSubject" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "role" "MultiPropertyFinancialScenarioPropertyRole" NOT NULL,
    "referenceType" "MultiPropertyFinancialScenarioPropertyReferenceType" NOT NULL,
    "displayLabel" TEXT NOT NULL,
    "inputSnapshot" JSONB NOT NULL,
    "provenanceSnapshot" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MultiPropertyFinancialScenarioProperty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MultiPropertyFinancialScenarioResult" (
    "id" TEXT NOT NULL,
    "scenarioVersionId" TEXT NOT NULL,
    "ownerAgentSubject" TEXT NOT NULL,
    "schemaVersion" TEXT NOT NULL,
    "calculationEngine" TEXT NOT NULL,
    "inputFingerprint" TEXT NOT NULL,
    "resultSnapshot" JSONB NOT NULL,
    "resultFingerprint" TEXT NOT NULL,
    "calculatedBySubject" TEXT NOT NULL,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MultiPropertyFinancialScenarioResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MultiPropertyFinancialScenarioAuditEvent" (
    "id" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "scenarioVersionId" TEXT,
    "ownerAgentSubject" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventFingerprint" TEXT NOT NULL,
    "detail" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MultiPropertyFinancialScenarioAuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdvancedInvestmentReturnAnalysis" (
    "id" TEXT NOT NULL,
    "ownerAgentSubject" TEXT NOT NULL,
    "analysisKey" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "lifecycleState" TEXT NOT NULL,
    "calculationVersion" TEXT NOT NULL,
    "projectionPolicy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdvancedInvestmentReturnAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdvancedInvestmentReturnProjection" (
    "id" TEXT NOT NULL,
    "analysisId" TEXT NOT NULL,
    "ownerAgentSubject" TEXT NOT NULL,
    "projectionKey" TEXT NOT NULL,
    "versionOrdinal" INTEGER NOT NULL,
    "analysisProfile" TEXT NOT NULL,
    "sourceKind" TEXT NOT NULL,
    "sourceArtifactId" TEXT NOT NULL,
    "sourceResultId" TEXT NOT NULL,
    "sourceInputFingerprint" TEXT NOT NULL,
    "lifecycleState" TEXT NOT NULL,
    "calculationVersion" TEXT NOT NULL,
    "projectionPolicy" TEXT NOT NULL,
    "selectedHorizonMonths" JSONB NOT NULL,
    "inputSnapshot" JSONB NOT NULL,
    "assumptionSnapshot" JSONB NOT NULL,
    "dependencySnapshot" JSONB NOT NULL,
    "inputFingerprint" TEXT NOT NULL,
    "supersedesProjectionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "AdvancedInvestmentReturnProjection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdvancedInvestmentReturnProjectionResult" (
    "id" TEXT NOT NULL,
    "projectionId" TEXT NOT NULL,
    "ownerAgentSubject" TEXT NOT NULL,
    "inputFingerprint" TEXT NOT NULL,
    "calculationVersion" TEXT NOT NULL,
    "projectionPolicy" TEXT NOT NULL,
    "versionOrdinal" INTEGER NOT NULL,
    "resultSnapshot" JSONB NOT NULL,
    "resultFingerprint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "immutableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdvancedInvestmentReturnProjectionResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdvancedInvestmentReturnDependency" (
    "id" TEXT NOT NULL,
    "projectionId" TEXT NOT NULL,
    "ownerAgentSubject" TEXT NOT NULL,
    "upstreamArtifact" TEXT NOT NULL,
    "dependencyType" TEXT NOT NULL,
    "versionUsed" TEXT NOT NULL,
    "qualification" TEXT NOT NULL,
    "detail" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdvancedInvestmentReturnDependency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdvancedInvestmentReturnAuditEvent" (
    "id" TEXT NOT NULL,
    "projectionId" TEXT NOT NULL,
    "ownerAgentSubject" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventFingerprint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdvancedInvestmentReturnAuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Property_id_key" ON "Property"("id");

-- CreateIndex
CREATE UNIQUE INDEX "property_mlsid_unique_idx" ON "Property"("mlsId");

-- CreateIndex
CREATE UNIQUE INDEX "property_slug_idx" ON "Property"("slug");

-- CreateIndex
CREATE INDEX "Property_city_idx" ON "Property"("city");

-- CreateIndex
CREATE INDEX "Property_status_idx" ON "Property"("status");

-- CreateIndex
CREATE INDEX "Property_price_idx" ON "Property"("price");

-- CreateIndex
CREATE INDEX "Property_beds_idx" ON "Property"("beds");

-- CreateIndex
CREATE INDEX "Property_baths_idx" ON "Property"("baths");

-- CreateIndex
CREATE INDEX "Property_propertyType_idx" ON "Property"("propertyType");

-- CreateIndex
CREATE INDEX "Property_lat_lng_idx" ON "Property"("lat", "lng");

-- CreateIndex
CREATE INDEX "Property_publicSearchEligibility_idx" ON "Property"("publicSearchEligibility");

-- CreateIndex
CREATE INDEX "Property_isPrivateExclusive_idx" ON "Property"("isPrivateExclusive");

-- CreateIndex
CREATE INDEX "Property_lastIntelligenceSync_idx" ON "Property"("lastIntelligenceSync");

-- CreateIndex
CREATE INDEX "Property_sourceModifiedAt_idx" ON "Property"("sourceModifiedAt");

-- CreateIndex
CREATE INDEX "PSI_source_jurisdiction_type_idx" ON "PropertySourceIdentity"("sourceId", "jurisdictionCode", "identifierType");

-- CreateIndex
CREATE INDEX "PSI_jurisdiction_current_idx" ON "PropertySourceIdentity"("jurisdictionType", "jurisdictionCode", "isCurrent");

-- CreateIndex
CREATE INDEX "PSI_superseded_idx" ON "PropertySourceIdentity"("supersededById");

-- CreateIndex
CREATE UNIQUE INDEX "PSI_source_jurisdiction_type_value_uq" ON "PropertySourceIdentity"("sourceId", "jurisdictionCode", "identifierType", "normalizedValue");

-- CreateIndex
CREATE UNIQUE INDEX "PSIO_fingerprint_uq" ON "PropertySourceIdentityObservation"("observationFingerprint");

-- CreateIndex
CREATE INDEX "PSIO_identity_observed_idx" ON "PropertySourceIdentityObservation"("identityId", "observedAt");

-- CreateIndex
CREATE INDEX "PSIO_freshness_idx" ON "PropertySourceIdentityObservation"("freshness");

-- CreateIndex
CREATE UNIQUE INDEX "PSIR_fingerprint_uq" ON "PropertySourceIdentityRelationship"("relationshipFingerprint");

-- CreateIndex
CREATE INDEX "PSIR_source_type_current_idx" ON "PropertySourceIdentityRelationship"("sourceIdentityId", "relationshipType", "isCurrent");

-- CreateIndex
CREATE INDEX "PSIR_target_type_current_idx" ON "PropertySourceIdentityRelationship"("targetIdentityId", "relationshipType", "isCurrent");

-- CreateIndex
CREATE INDEX "PSIR_observation_idx" ON "PropertySourceIdentityRelationship"("observationId");

-- CreateIndex
CREATE INDEX "PSIR_superseded_idx" ON "PropertySourceIdentityRelationship"("supersededById");

-- CreateIndex
CREATE INDEX "PCIM_property_status_current_idx" ON "PropertyCountyIdentityMapping"("propertyId", "status", "isCurrent");

-- CreateIndex
CREATE INDEX "PCIM_identity_status_current_idx" ON "PropertyCountyIdentityMapping"("identityId", "status", "isCurrent");

-- CreateIndex
CREATE INDEX "PCIM_observation_idx" ON "PropertyCountyIdentityMapping"("observationId");

-- CreateIndex
CREATE UNIQUE INDEX "PCIM_property_identity_uq" ON "PropertyCountyIdentityMapping"("propertyId", "identityId");

-- CreateIndex
CREATE INDEX "CPP_status_confidence_idx" ON "CanonicalPhysicalProperty"("identityStatus", "identityConfidence");

-- CreateIndex
CREATE INDEX "CPP_jurisdiction_idx" ON "CanonicalPhysicalProperty"("state", "county", "jurisdiction");

-- CreateIndex
CREATE INDEX "CPP_normalized_address_idx" ON "CanonicalPhysicalProperty"("normalizedSitusAddress");

-- CreateIndex
CREATE INDEX "CPP_superseded_idx" ON "CanonicalPhysicalProperty"("supersededById");

-- CreateIndex
CREATE UNIQUE INDEX "CPPSIM_fingerprint_uq" ON "CanonicalPhysicalPropertySourceIdentityMapping"("mappingFingerprint");

-- CreateIndex
CREATE INDEX "CPPSIM_property_status_idx" ON "CanonicalPhysicalPropertySourceIdentityMapping"("canonicalPropertyId", "status", "isCurrent");

-- CreateIndex
CREATE INDEX "CPPSIM_identity_status_idx" ON "CanonicalPhysicalPropertySourceIdentityMapping"("identityId", "status", "isCurrent");

-- CreateIndex
CREATE INDEX "CPPSIM_superseded_idx" ON "CanonicalPhysicalPropertySourceIdentityMapping"("supersededById");

-- CreateIndex
CREATE UNIQUE INDEX "CPPSIM_property_identity_type_uq" ON "CanonicalPhysicalPropertySourceIdentityMapping"("canonicalPropertyId", "identityId", "associationType");

-- CreateIndex
CREATE UNIQUE INDEX "CPPO_fingerprint_uq" ON "CanonicalPhysicalPropertyObservation"("observationFingerprint");

-- CreateIndex
CREATE INDEX "CPPO_property_observed_idx" ON "CanonicalPhysicalPropertyObservation"("canonicalPropertyId", "observedAt");

-- CreateIndex
CREATE INDEX "CPPO_source_kind_idx" ON "CanonicalPhysicalPropertyObservation"("sourceId", "observationKind");

-- CreateIndex
CREATE INDEX "CPPO_identity_idx" ON "CanonicalPhysicalPropertyObservation"("sourceIdentityId");

-- CreateIndex
CREATE INDEX "CPPO_identity_observation_idx" ON "CanonicalPhysicalPropertyObservation"("sourceIdentityObservationId");

-- CreateIndex
CREATE UNIQUE INDEX "CPLE_fingerprint_uq" ON "CanonicalPropertyListingEvent"("eventFingerprint");

-- CreateIndex
CREATE INDEX "CPLE_canonical_status_idx" ON "CanonicalPropertyListingEvent"("canonicalPropertyId", "status", "isCurrent");

-- CreateIndex
CREATE INDEX "CPLE_property_idx" ON "CanonicalPropertyListingEvent"("propertyId");

-- CreateIndex
CREATE INDEX "CPLE_source_listing_idx" ON "CanonicalPropertyListingEvent"("sourceId", "sourceListingReference");

-- CreateIndex
CREATE INDEX "CPLE_superseded_idx" ON "CanonicalPropertyListingEvent"("supersededById");

-- CreateIndex
CREATE UNIQUE INDEX "CPLE_property_listing_uq" ON "CanonicalPropertyListingEvent"("canonicalPropertyId", "propertyId");

-- CreateIndex
CREATE INDEX "PropertyPhoto_propertyId_idx" ON "PropertyPhoto"("propertyId");

-- CreateIndex
CREATE INDEX "PriceHistory_propertyId_idx" ON "PriceHistory"("propertyId");

-- CreateIndex
CREATE INDEX "PriceHistory_date_idx" ON "PriceHistory"("date");

-- CreateIndex
CREATE INDEX "OpenHouse_propertyId_idx" ON "OpenHouse"("propertyId");

-- CreateIndex
CREATE INDEX "OpenHouse_startTime_idx" ON "OpenHouse"("startTime");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "CRMTask_leadId_idx" ON "CRMTask"("leadId");

-- CreateIndex
CREATE INDEX "CRMTask_leadid_idx" ON "CRMTask"("leadid");

-- CreateIndex
CREATE INDEX "CRMTask_type_createdAt_idx" ON "CRMTask"("type", "createdAt");

-- CreateIndex
CREATE INDEX "CRMTask_status_type_createdAt_idx" ON "CRMTask"("status", "type", "createdAt");

-- CreateIndex
CREATE INDEX "UserInteraction_userId_idx" ON "UserInteraction"("userId");

-- CreateIndex
CREATE INDEX "UserInteraction_type_createdAt_idx" ON "UserInteraction"("type", "createdAt");

-- CreateIndex
CREATE INDEX "LeadInteraction_clientId_idx" ON "LeadInteraction"("clientId");

-- CreateIndex
CREATE INDEX "LeadInteraction_propertyId_idx" ON "LeadInteraction"("propertyId");

-- CreateIndex
CREATE INDEX "LeadInteraction_interactionType_idx" ON "LeadInteraction"("interactionType");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreference_userId_key" ON "UserPreference"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AlertEvent_userId_propertyId_type_key" ON "AlertEvent"("userId", "propertyId", "type");

-- CreateIndex
CREATE INDEX "AlertQueue_userId_idx" ON "AlertQueue"("userId");

-- CreateIndex
CREATE INDEX "AlertQueue_clickedAt_idx" ON "AlertQueue"("clickedAt");

-- CreateIndex
CREATE UNIQUE INDEX "UnsubscribeToken_token_key" ON "UnsubscribeToken"("token");

-- CreateIndex
CREATE INDEX "EmailLog_userId_idx" ON "EmailLog"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "City_slug_key" ON "City"("slug");

-- CreateIndex
CREATE INDEX "Neighborhood_slug_idx" ON "Neighborhood"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Neighborhood_cityId_slug_key" ON "Neighborhood"("cityId", "slug");

-- CreateIndex
CREATE INDEX "GeographicObject_canonicalSlug_idx" ON "GeographicObject"("canonicalSlug");

-- CreateIndex
CREATE INDEX "GeographicObject_objectType_lifecycleStatus_idx" ON "GeographicObject"("objectType", "lifecycleStatus");

-- CreateIndex
CREATE INDEX "GeographicObject_convenienceParentId_idx" ON "GeographicObject"("convenienceParentId");

-- CreateIndex
CREATE INDEX "GeographicObject_mergedIntoId_idx" ON "GeographicObject"("mergedIntoId");

-- CreateIndex
CREATE UNIQUE INDEX "GeographicObject_objectType_canonicalSlug_key" ON "GeographicObject"("objectType", "canonicalSlug");

-- CreateIndex
CREATE INDEX "GeographicAlias_normalizedValue_idx" ON "GeographicAlias"("normalizedValue");

-- CreateIndex
CREATE INDEX "GeographicAlias_sourceId_idx" ON "GeographicAlias"("sourceId");

-- CreateIndex
CREATE INDEX "GeographicAlias_lifecycleStatus_idx" ON "GeographicAlias"("lifecycleStatus");

-- CreateIndex
CREATE UNIQUE INDEX "GeographicAlias_objectId_normalizedValue_aliasType_language_lif" ON "GeographicAlias"("objectId", "normalizedValue", "aliasType", "language", "lifecycleStatus");

-- CreateIndex
CREATE INDEX "GeographicRelationship_sourceObjectId_relationshipType_idx" ON "GeographicRelationship"("sourceObjectId", "relationshipType");

-- CreateIndex
CREATE INDEX "GeographicRelationship_targetObjectId_relationshipType_idx" ON "GeographicRelationship"("targetObjectId", "relationshipType");

-- CreateIndex
CREATE INDEX "GeographicRelationship_sourceId_idx" ON "GeographicRelationship"("sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "GeographicRelationship_sourceObjectId_targetObjectId_relationsh" ON "GeographicRelationship"("sourceObjectId", "targetObjectId", "relationshipType", "directionality", "lifecycleStatus");

-- CreateIndex
CREATE UNIQUE INDEX "GeographicSource_canonicalName_key" ON "GeographicSource"("canonicalName");

-- CreateIndex
CREATE INDEX "GeographicSource_sourceClass_authorityLevel_idx" ON "GeographicSource"("sourceClass", "authorityLevel");

-- CreateIndex
CREATE INDEX "GeographicSource_healthState_idx" ON "GeographicSource"("healthState");

-- CreateIndex
CREATE INDEX "GeographicObservation_objectId_observationKey_effectiveDate_idx" ON "GeographicObservation"("objectId", "observationKey", "effectiveDate");

-- CreateIndex
CREATE INDEX "GeographicObservation_sourceId_idx" ON "GeographicObservation"("sourceId");

-- CreateIndex
CREATE INDEX "GeographicObservation_conflictGroupKey_idx" ON "GeographicObservation"("conflictGroupKey");

-- CreateIndex
CREATE INDEX "GeographicObservation_reviewStatus_idx" ON "GeographicObservation"("reviewStatus");

-- CreateIndex
CREATE UNIQUE INDEX "GeographicEligibility_objectId_key" ON "GeographicEligibility"("objectId");

-- CreateIndex
CREATE INDEX "PropertyGeographicRelationship_propertyId_idx" ON "PropertyGeographicRelationship"("propertyId");

-- CreateIndex
CREATE INDEX "PropertyGeographicRelationship_geographicObjectId_relationshipT" ON "PropertyGeographicRelationship"("geographicObjectId", "relationshipType");

-- CreateIndex
CREATE INDEX "PropertyGeographicRelationship_sourceId_idx" ON "PropertyGeographicRelationship"("sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyGeographicRelationship_propertyId_geographicObjectId_re" ON "PropertyGeographicRelationship"("propertyId", "geographicObjectId", "relationshipType", "lifecycleStatus");

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

-- CreateIndex
CREATE UNIQUE INDEX "OutputProduct_lineageKey_key" ON "OutputProduct"("lineageKey");

-- CreateIndex
CREATE INDEX "OutputProduct_ownerAgentSubject_createdAt_idx" ON "OutputProduct"("ownerAgentSubject", "createdAt");

-- CreateIndex
CREATE INDEX "OutputProduct_ownerAgentSubject_clientCaseId_createdAt_idx" ON "OutputProduct"("ownerAgentSubject", "clientCaseId", "createdAt");

-- CreateIndex
CREATE INDEX "OutputProduct_ownerAgentSubject_transactionId_createdAt_idx" ON "OutputProduct"("ownerAgentSubject", "transactionId", "createdAt");

-- CreateIndex
CREATE INDEX "OutputProduct_productKind_subjectRef_idx" ON "OutputProduct"("productKind", "subjectRef");

-- CreateIndex
CREATE UNIQUE INDEX "OutputProduct_ownerAgentSubject_productKind_audience_subjectRef" ON "OutputProduct"("ownerAgentSubject", "productKind", "audience", "subjectRef");

-- CreateIndex
CREATE UNIQUE INDEX "OutputVersion_idempotencyKey_key" ON "OutputVersion"("idempotencyKey");

-- CreateIndex
CREATE INDEX "OutputVersion_ownerAgentSubject_reviewedAt_idx" ON "OutputVersion"("ownerAgentSubject", "reviewedAt");

-- CreateIndex
CREATE INDEX "OutputVersion_productId_effectiveAsOf_idx" ON "OutputVersion"("productId", "effectiveAsOf");

-- CreateIndex
CREATE INDEX "OutputVersion_contentFingerprint_idx" ON "OutputVersion"("contentFingerprint");

-- CreateIndex
CREATE INDEX "OutputVersion_multiPropertyFinancialScenarioVersionId_idx" ON "OutputVersion"("multiPropertyFinancialScenarioVersionId");

-- CreateIndex
CREATE UNIQUE INDEX "OutputVersion_productId_versionOrdinal_key" ON "OutputVersion"("productId", "versionOrdinal");

-- CreateIndex
CREATE UNIQUE INDEX "OutputVersion_productId_sourceVersionRef_key" ON "OutputVersion"("productId", "sourceVersionRef");

-- CreateIndex
CREATE UNIQUE INDEX "OutputEvidenceSnapshot_outputVersionId_key" ON "OutputEvidenceSnapshot"("outputVersionId");

-- CreateIndex
CREATE INDEX "OutputEvidenceSnapshot_fingerprint_idx" ON "OutputEvidenceSnapshot"("fingerprint");

-- CreateIndex
CREATE INDEX "OutputDependency_outputVersionId_idx" ON "OutputDependency"("outputVersionId");

-- CreateIndex
CREATE INDEX "OutputDependency_currentState_idx" ON "OutputDependency"("currentState");

-- CreateIndex
CREATE UNIQUE INDEX "OutputDependency_outputVersionId_upstreamArtifact_downstreamArt" ON "OutputDependency"("outputVersionId", "upstreamArtifact", "downstreamArtifact", "dependencyType");

-- CreateIndex
CREATE INDEX "OutputReview_outputVersionId_reviewedAt_idx" ON "OutputReview"("outputVersionId", "reviewedAt");

-- CreateIndex
CREATE INDEX "OutputReview_reviewerSubject_reviewedAt_idx" ON "OutputReview"("reviewerSubject", "reviewedAt");

-- CreateIndex
CREATE INDEX "OutputDecision_outputVersionId_recordedAt_idx" ON "OutputDecision"("outputVersionId", "recordedAt");

-- CreateIndex
CREATE UNIQUE INDEX "OutputDecision_outputVersionId_decisionRef_key" ON "OutputDecision"("outputVersionId", "decisionRef");

-- CreateIndex
CREATE INDEX "OutputCheckpoint_outputVersionId_recordedAt_idx" ON "OutputCheckpoint"("outputVersionId", "recordedAt");

-- CreateIndex
CREATE UNIQUE INDEX "OutputCheckpoint_outputVersionId_checkpointRef_key" ON "OutputCheckpoint"("outputVersionId", "checkpointRef");

-- CreateIndex
CREATE UNIQUE INDEX "EvidenceCandidate_admissionId_key" ON "EvidenceCandidate"("admissionId");

-- CreateIndex
CREATE INDEX "EvidenceCandidate_ownerAgentSubject_status_createdAt_idx" ON "EvidenceCandidate"("ownerAgentSubject", "status", "createdAt");

-- CreateIndex
CREATE INDEX "EvidenceCandidate_ownerAgentSubject_claimKind_status_idx" ON "EvidenceCandidate"("ownerAgentSubject", "claimKind", "status");

-- CreateIndex
CREATE UNIQUE INDEX "EvidenceCandidate_ownerAgentSubject_fingerprint_key" ON "EvidenceCandidate"("ownerAgentSubject", "fingerprint");

-- CreateIndex
CREATE UNIQUE INDEX "EvidenceAdmission_candidateId_key" ON "EvidenceAdmission"("candidateId");

-- CreateIndex
CREATE UNIQUE INDEX "EvidenceAdmission_supersedesAdmissionId_key" ON "EvidenceAdmission"("supersedesAdmissionId");

-- CreateIndex
CREATE UNIQUE INDEX "EvidenceAdmission_fingerprint_key" ON "EvidenceAdmission"("fingerprint");

-- CreateIndex
CREATE INDEX "EvidenceAdmission_ownerAgentSubject_claimKind_effectiveAt_idx" ON "EvidenceAdmission"("ownerAgentSubject", "claimKind", "effectiveAt");

-- CreateIndex
CREATE INDEX "EvidenceAdmission_ownerAgentSubject_expiresAt_idx" ON "EvidenceAdmission"("ownerAgentSubject", "expiresAt");

-- CreateIndex
CREATE INDEX "EvidenceAdmissionAuditEvent_ownerAgentSubject_createdAt_idx" ON "EvidenceAdmissionAuditEvent"("ownerAgentSubject", "createdAt");

-- CreateIndex
CREATE INDEX "EvidenceAdmissionAuditEvent_candidateId_createdAt_idx" ON "EvidenceAdmissionAuditEvent"("candidateId", "createdAt");

-- CreateIndex
CREATE INDEX "EvidenceAdmissionAuditEvent_admissionId_createdAt_idx" ON "EvidenceAdmissionAuditEvent"("admissionId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProfessionalInputRequest_supersedesRequestId_key" ON "ProfessionalInputRequest"("supersedesRequestId");

-- CreateIndex
CREATE INDEX "ProfessionalInputRequest_ownerAgentSubject_status_createdAt_idx" ON "ProfessionalInputRequest"("ownerAgentSubject", "status", "createdAt");

-- CreateIndex
CREATE INDEX "ProfessionalInputRequest_ownerAgentSubject_claimKind_status_idx" ON "ProfessionalInputRequest"("ownerAgentSubject", "claimKind", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalRequestDelivery_professionalInputRequestId_key" ON "ExternalRequestDelivery"("professionalInputRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalRequestDelivery_requestFingerprint_key" ON "ExternalRequestDelivery"("requestFingerprint");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalRequestDelivery_providerMessageId_key" ON "ExternalRequestDelivery"("providerMessageId");

-- CreateIndex
CREATE INDEX "ExternalRequestDelivery_ownerAgentSubject_status_createdAt_idx" ON "ExternalRequestDelivery"("ownerAgentSubject", "status", "createdAt");

-- CreateIndex
CREATE INDEX "ExternalRequestDelivery_recipientEmail_status_idx" ON "ExternalRequestDelivery"("recipientEmail", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalRequestCapability_deliveryId_key" ON "ExternalRequestCapability"("deliveryId");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalRequestCapability_tokenHash_key" ON "ExternalRequestCapability"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalRequestSession_sessionHash_key" ON "ExternalRequestSession"("sessionHash");

-- CreateIndex
CREATE INDEX "ExternalRequestSession_deliveryId_expiresAt_idx" ON "ExternalRequestSession"("deliveryId", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalRequestDisclosureSnapshot_deliveryId_key" ON "ExternalRequestDisclosureSnapshot"("deliveryId");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalRequestDisclosureSnapshot_fingerprint_key" ON "ExternalRequestDisclosureSnapshot"("fingerprint");

-- CreateIndex
CREATE INDEX "ExternalIdentityVerification_deliveryId_createdAt_idx" ON "ExternalIdentityVerification"("deliveryId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalIdentityVerification_deliveryId_dimension_method_key" ON "ExternalIdentityVerification"("deliveryId", "dimension", "method");

-- CreateIndex
CREATE UNIQUE INDEX "ProfessionalInputResponse_requestId_key" ON "ProfessionalInputResponse"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "ProfessionalInputResponse_candidateId_key" ON "ProfessionalInputResponse"("candidateId");

-- CreateIndex
CREATE INDEX "ProfessionalInputResponse_ownerAgentSubject_receivedAt_idx" ON "ProfessionalInputResponse"("ownerAgentSubject", "receivedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProfessionalInput_evidenceAdmissionId_key" ON "ProfessionalInput"("evidenceAdmissionId");

-- CreateIndex
CREATE UNIQUE INDEX "ProfessionalInput_fingerprint_key" ON "ProfessionalInput"("fingerprint");

-- CreateIndex
CREATE INDEX "ProfessionalInput_ownerAgentSubject_claimKind_effectiveAt_idx" ON "ProfessionalInput"("ownerAgentSubject", "claimKind", "effectiveAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProfessionalInput_ownerAgentSubject_claimKind_versionOrdinal_ke" ON "ProfessionalInput"("ownerAgentSubject", "claimKind", "versionOrdinal");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_idempotencyKey_key" ON "Transaction"("idempotencyKey");

-- CreateIndex
CREATE INDEX "Transaction_ownerAgentSubject_createdAt_idx" ON "Transaction"("ownerAgentSubject", "createdAt");

-- CreateIndex
CREATE INDEX "Transaction_ownerAgentSubject_stage_idx" ON "Transaction"("ownerAgentSubject", "stage");

-- CreateIndex
CREATE INDEX "Transaction_ownerAgentSubject_status_idx" ON "Transaction"("ownerAgentSubject", "status");

-- CreateIndex
CREATE INDEX "Transaction_canonicalPropertyId_idx" ON "Transaction"("canonicalPropertyId");

-- CreateIndex
CREATE INDEX "Transaction_clientCaseId_idx" ON "Transaction"("clientCaseId");

-- CreateIndex
CREATE INDEX "TransactionParty_clientCasePartyId_idx" ON "TransactionParty"("clientCasePartyId");

-- CreateIndex
CREATE UNIQUE INDEX "TransactionParty_transactionId_clientCasePartyId_key" ON "TransactionParty"("transactionId", "clientCasePartyId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientCase_idempotencyKey_key" ON "ClientCase"("idempotencyKey");

-- CreateIndex
CREATE INDEX "ClientCase_ownerAgentSubject_status_updatedAt_idx" ON "ClientCase"("ownerAgentSubject", "status", "updatedAt");

-- CreateIndex
CREATE INDEX "ClientCase_ownerAgentSubject_createdAt_idx" ON "ClientCase"("ownerAgentSubject", "createdAt");

-- CreateIndex
CREATE INDEX "Contact_ownerAgentSubject_lifecycleStatus_updatedAt_idx" ON "Contact"("ownerAgentSubject", "lifecycleStatus", "updatedAt");

-- CreateIndex
CREATE INDEX "Contact_ownerAgentSubject_displayName_idx" ON "Contact"("ownerAgentSubject", "displayName");

-- CreateIndex
CREATE INDEX "ContactMethod_contactId_kind_lifecycleStatus_idx" ON "ContactMethod"("contactId", "kind", "lifecycleStatus");

-- CreateIndex
CREATE INDEX "ContactMethod_kind_normalizedValue_idx" ON "ContactMethod"("kind", "normalizedValue");

-- CreateIndex
CREATE INDEX "ClientCaseParty_clientCaseId_role_participationStatus_idx" ON "ClientCaseParty"("clientCaseId", "role", "participationStatus");

-- CreateIndex
CREATE INDEX "ClientCaseParty_clientCaseId_role_idx" ON "ClientCaseParty"("clientCaseId", "role");

-- CreateIndex
CREATE INDEX "ClientCaseParty_contactId_idx" ON "ClientCaseParty"("contactId");

-- CreateIndex
CREATE INDEX "ClientCasePartyAdvisoryRole_role_idx" ON "ClientCasePartyAdvisoryRole"("role");

-- CreateIndex
CREATE UNIQUE INDEX "ClientCasePartyAdvisoryRole_clientCasePartyId_role_key" ON "ClientCasePartyAdvisoryRole"("clientCasePartyId", "role");

-- CreateIndex
CREATE INDEX "ClientCaseProperty_canonicalPropertyId_idx" ON "ClientCaseProperty"("canonicalPropertyId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientCaseProperty_clientCaseId_canonicalPropertyId_key" ON "ClientCaseProperty"("clientCaseId", "canonicalPropertyId");

-- CreateIndex
CREATE INDEX "CCPRR_property_status_idx" ON "ClientCasePropertyRelationshipRole"("clientCasePropertyId", "status");

-- CreateIndex
CREATE INDEX "CCPRR_role_status_idx" ON "ClientCasePropertyRelationshipRole"("role", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ClientCaseObjective_idempotencyKey_key" ON "ClientCaseObjective"("idempotencyKey");

-- CreateIndex
CREATE INDEX "ClientCaseObjective_clientCaseId_status_createdAt_idx" ON "ClientCaseObjective"("clientCaseId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "ClientCaseObjective_clientCaseId_objectiveType_status_idx" ON "ClientCaseObjective"("clientCaseId", "objectiveType", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ClientCaseFact_supersedesFactId_key" ON "ClientCaseFact"("supersedesFactId");

-- CreateIndex
CREATE INDEX "ClientCaseFact_clientCaseId_semanticKey_scopeReference_createdA" ON "ClientCaseFact"("clientCaseId", "semanticKey", "scopeReference", "createdAt");

-- CreateIndex
CREATE INDEX "ClientCaseFact_objectiveId_semanticKey_createdAt_idx" ON "ClientCaseFact"("objectiveId", "semanticKey", "createdAt");

-- CreateIndex
CREATE INDEX "ClientCaseFact_clientCasePropertyId_semanticKey_createdAt_idx" ON "ClientCaseFact"("clientCasePropertyId", "semanticKey", "createdAt");

-- CreateIndex
CREATE INDEX "ClientCaseFact_evidenceAdmissionId_idx" ON "ClientCaseFact"("evidenceAdmissionId");

-- CreateIndex
CREATE INDEX "ClientCaseFact_professionalInputId_idx" ON "ClientCaseFact"("professionalInputId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientCaseCriterion_supersedesCriterionId_key" ON "ClientCaseCriterion"("supersedesCriterionId");

-- CreateIndex
CREATE INDEX "ClientCaseCriterion_clientCaseId_semanticKey_scopeReference_cre" ON "ClientCaseCriterion"("clientCaseId", "semanticKey", "scopeReference", "createdAt");

-- CreateIndex
CREATE INDEX "ClientCaseCriterion_objectiveId_semanticKey_createdAt_idx" ON "ClientCaseCriterion"("objectiveId", "semanticKey", "createdAt");

-- CreateIndex
CREATE INDEX "ClientCaseCriterion_clientCasePropertyId_semanticKey_createdAt_" ON "ClientCaseCriterion"("clientCasePropertyId", "semanticKey", "createdAt");

-- CreateIndex
CREATE INDEX "ClientCaseCriterion_evidenceAdmissionId_idx" ON "ClientCaseCriterion"("evidenceAdmissionId");

-- CreateIndex
CREATE INDEX "ClientCaseCriterion_professionalInputId_idx" ON "ClientCaseCriterion"("professionalInputId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientCaseScenario_currentVersionId_key" ON "ClientCaseScenario"("currentVersionId");

-- CreateIndex
CREATE INDEX "ClientCaseScenario_clientCaseId_status_createdAt_idx" ON "ClientCaseScenario"("clientCaseId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "ClientCaseScenario_duplicatedFromScenarioId_idx" ON "ClientCaseScenario"("duplicatedFromScenarioId");

-- CreateIndex
CREATE INDEX "ClientCaseScenario_duplicatedFromScenarioVersionId_idx" ON "ClientCaseScenario"("duplicatedFromScenarioVersionId");

-- CreateIndex
CREATE INDEX "ClientCaseScenarioVersion_scenarioId_createdAt_idx" ON "ClientCaseScenarioVersion"("scenarioId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ClientCaseScenarioVersion_scenarioId_versionNumber_key" ON "ClientCaseScenarioVersion"("scenarioId", "versionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ClientCaseScenarioAssumption_scenarioVersionId_semanticKey_key" ON "ClientCaseScenarioAssumption"("scenarioVersionId", "semanticKey");

-- CreateIndex
CREATE UNIQUE INDEX "ClientCaseScenarioCriterion_scenarioVersionId_semanticKey_key" ON "ClientCaseScenarioCriterion"("scenarioVersionId", "semanticKey");

-- CreateIndex
CREATE INDEX "ClientCaseScenarioPropertyDisposition_clientCasePropertyId_idx" ON "ClientCaseScenarioPropertyDisposition"("clientCasePropertyId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientCaseScenarioPropertyDisposition_scenarioVersionId_clientC" ON "ClientCaseScenarioPropertyDisposition"("scenarioVersionId", "clientCasePropertyId");

-- CreateIndex
CREATE INDEX "ClientCaseScenarioObjective_clientCaseObjectiveId_idx" ON "ClientCaseScenarioObjective"("clientCaseObjectiveId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientCaseScenarioObjective_scenarioVersionId_clientCaseObjecti" ON "ClientCaseScenarioObjective"("scenarioVersionId", "clientCaseObjectiveId");

-- CreateIndex
CREATE UNIQUE INDEX "TransactionDeadline_supersedesDeadlineId_key" ON "TransactionDeadline"("supersedesDeadlineId");

-- CreateIndex
CREATE INDEX "TransactionDeadline_transactionId_dueAt_idx" ON "TransactionDeadline"("transactionId", "dueAt");

-- CreateIndex
CREATE INDEX "TransactionDeadline_transactionId_attentionState_idx" ON "TransactionDeadline"("transactionId", "attentionState");

-- CreateIndex
CREATE UNIQUE INDEX "TransactionIssue_supersedesIssueId_key" ON "TransactionIssue"("supersedesIssueId");

-- CreateIndex
CREATE INDEX "TransactionIssue_transactionId_state_createdAt_idx" ON "TransactionIssue"("transactionId", "state", "createdAt");

-- CreateIndex
CREATE INDEX "TransactionIssue_transactionId_attentionLevel_idx" ON "TransactionIssue"("transactionId", "attentionLevel");

-- CreateIndex
CREATE UNIQUE INDEX "TransactionDecision_idempotencyKey_key" ON "TransactionDecision"("idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "TransactionDecision_supersedesDecisionId_key" ON "TransactionDecision"("supersedesDecisionId");

-- CreateIndex
CREATE INDEX "TransactionDecision_transactionId_recordedAt_idx" ON "TransactionDecision"("transactionId", "recordedAt");

-- CreateIndex
CREATE INDEX "TransactionDecision_transactionId_profile_idx" ON "TransactionDecision"("transactionId", "profile");

-- CreateIndex
CREATE INDEX "TransactionTimelineEvent_transactionId_recordedAt_idx" ON "TransactionTimelineEvent"("transactionId", "recordedAt");

-- CreateIndex
CREATE INDEX "TransactionTimelineEvent_transactionId_eventType_idx" ON "TransactionTimelineEvent"("transactionId", "eventType");

-- CreateIndex
CREATE UNIQUE INDEX "ClientAuthorizationProfile_definitionFingerprint_key" ON "ClientAuthorizationProfile"("definitionFingerprint");

-- CreateIndex
CREATE INDEX "ClientAuthorizationProfile_profileKey_lifecycle_idx" ON "ClientAuthorizationProfile"("profileKey", "lifecycle");

-- CreateIndex
CREATE UNIQUE INDEX "ClientAuthorizationProfile_profileKey_profileVersion_key" ON "ClientAuthorizationProfile"("profileKey", "profileVersion");

-- CreateIndex
CREATE UNIQUE INDEX "ClientAuthorization_supersedesAuthorizationId_key" ON "ClientAuthorization"("supersedesAuthorizationId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientAuthorization_idempotencyKey_key" ON "ClientAuthorization"("idempotencyKey");

-- CreateIndex
CREATE INDEX "ClientAuthorization_ownerAgentSubject_status_createdAt_idx" ON "ClientAuthorization"("ownerAgentSubject", "status", "createdAt");

-- CreateIndex
CREATE INDEX "ClientAuthorization_ownerAgentSubject_profileId_status_idx" ON "ClientAuthorization"("ownerAgentSubject", "profileId", "status");

-- CreateIndex
CREATE INDEX "ClientAuthorization_transactionId_idx" ON "ClientAuthorization"("transactionId");

-- CreateIndex
CREATE INDEX "ClientAuthorization_propertyId_idx" ON "ClientAuthorization"("propertyId");

-- CreateIndex
CREATE INDEX "ClientAuthorization_ownerAgentSubject_consumedAt_idx" ON "ClientAuthorization"("ownerAgentSubject", "consumedAt");

-- CreateIndex
CREATE INDEX "ClientAuthorizationPrincipal_principalRef_idx" ON "ClientAuthorizationPrincipal"("principalRef");

-- CreateIndex
CREATE UNIQUE INDEX "ClientAuthorizationPrincipal_authorizationId_principalRef_key" ON "ClientAuthorizationPrincipal"("authorizationId", "principalRef");

-- CreateIndex
CREATE UNIQUE INDEX "ClientAuthorizationSnapshot_authorizationId_key" ON "ClientAuthorizationSnapshot"("authorizationId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientAuthorizationSnapshot_fingerprint_key" ON "ClientAuthorizationSnapshot"("fingerprint");

-- CreateIndex
CREATE UNIQUE INDEX "ClientAuthorizationUse_idempotencyKey_key" ON "ClientAuthorizationUse"("idempotencyKey");

-- CreateIndex
CREATE INDEX "ClientAuthorizationUse_ownerAgentSubject_resolvedAt_idx" ON "ClientAuthorizationUse"("ownerAgentSubject", "resolvedAt");

-- CreateIndex
CREATE INDEX "ClientAuthorizationUse_authorizationId_resolvedAt_idx" ON "ClientAuthorizationUse"("authorizationId", "resolvedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ClientAuthorizationCapability_tokenHash_key" ON "ClientAuthorizationCapability"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "ClientAuthorizationCapability_issuanceKey_key" ON "ClientAuthorizationCapability"("issuanceKey");

-- CreateIndex
CREATE INDEX "ClientAuthorizationCapability_authorizationId_expiresAt_idx" ON "ClientAuthorizationCapability"("authorizationId", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "ClientAuthorizationSession_sessionHash_key" ON "ClientAuthorizationSession"("sessionHash");

-- CreateIndex
CREATE INDEX "ClientAuthorizationSession_authorizationId_expiresAt_idx" ON "ClientAuthorizationSession"("authorizationId", "expiresAt");

-- CreateIndex
CREATE INDEX "ClientAuthorizationSession_capabilityId_expiresAt_idx" ON "ClientAuthorizationSession"("capabilityId", "expiresAt");

-- CreateIndex
CREATE INDEX "ClientAuthorizationSession_clientAuthorizationPrincipalId_idx" ON "ClientAuthorizationSession"("clientAuthorizationPrincipalId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientAuthorizationConfirmationEvidence_authorizationId_key" ON "ClientAuthorizationConfirmationEvidence"("authorizationId");

-- CreateIndex
CREATE INDEX "ClientAuthorizationConfirmationEvidence_profileKey_profileVersi" ON "ClientAuthorizationConfirmationEvidence"("profileKey", "profileVersion", "decidedAt");

-- CreateIndex
CREATE INDEX "ClientAuthorizationConfirmationEvidence_clientAuthorizationPrin" ON "ClientAuthorizationConfirmationEvidence"("clientAuthorizationPrincipalId");

-- CreateIndex
CREATE UNIQUE INDEX "SellerFinancialScenario_scenarioFingerprint_key" ON "SellerFinancialScenario"("scenarioFingerprint");

-- CreateIndex
CREATE UNIQUE INDEX "SellerFinancialScenario_supersedesScenarioId_key" ON "SellerFinancialScenario"("supersedesScenarioId");

-- CreateIndex
CREATE INDEX "SellerFinancialScenario_ownerAgentSubject_scenarioKey_createdAt" ON "SellerFinancialScenario"("ownerAgentSubject", "scenarioKey", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SellerFinancialScenario_ownerAgentSubject_scenarioKey_versionOr" ON "SellerFinancialScenario"("ownerAgentSubject", "scenarioKey", "versionOrdinal");

-- CreateIndex
CREATE UNIQUE INDEX "SellerFinancialResult_resultFingerprint_key" ON "SellerFinancialResult"("resultFingerprint");

-- CreateIndex
CREATE INDEX "SellerFinancialResult_ownerAgentSubject_createdAt_idx" ON "SellerFinancialResult"("ownerAgentSubject", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SellerFinancialResult_scenarioId_calculationContract_key" ON "SellerFinancialResult"("scenarioId", "calculationContract");

-- CreateIndex
CREATE UNIQUE INDEX "SellerFinancialAuditEvent_eventFingerprint_key" ON "SellerFinancialAuditEvent"("eventFingerprint");

-- CreateIndex
CREATE INDEX "SellerFinancialAuditEvent_ownerAgentSubject_createdAt_idx" ON "SellerFinancialAuditEvent"("ownerAgentSubject", "createdAt");

-- CreateIndex
CREATE INDEX "SellerFinancialAuditEvent_scenarioId_createdAt_idx" ON "SellerFinancialAuditEvent"("scenarioId", "createdAt");

-- CreateIndex
CREATE INDEX "InvestmentAnalysis_ownerAgentSubject_createdAt_idx" ON "InvestmentAnalysis"("ownerAgentSubject", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "InvestmentAnalysis_ownerAgentSubject_analysisKey_key" ON "InvestmentAnalysis"("ownerAgentSubject", "analysisKey");

-- CreateIndex
CREATE UNIQUE INDEX "InvestmentScenario_inputFingerprint_key" ON "InvestmentScenario"("inputFingerprint");

-- CreateIndex
CREATE UNIQUE INDEX "InvestmentScenario_supersedesScenarioId_key" ON "InvestmentScenario"("supersedesScenarioId");

-- CreateIndex
CREATE INDEX "InvestmentScenario_ownerAgentSubject_analysisId_createdAt_idx" ON "InvestmentScenario"("ownerAgentSubject", "analysisId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "InvestmentScenario_analysisId_scenarioKey_versionOrdinal_key" ON "InvestmentScenario"("analysisId", "scenarioKey", "versionOrdinal");

-- CreateIndex
CREATE UNIQUE INDEX "InvestmentScenarioResult_scenarioId_key" ON "InvestmentScenarioResult"("scenarioId");

-- CreateIndex
CREATE UNIQUE INDEX "InvestmentScenarioResult_resultFingerprint_key" ON "InvestmentScenarioResult"("resultFingerprint");

-- CreateIndex
CREATE INDEX "InvestmentScenarioResult_ownerAgentSubject_createdAt_idx" ON "InvestmentScenarioResult"("ownerAgentSubject", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "InvestmentScenarioAuditEvent_eventFingerprint_key" ON "InvestmentScenarioAuditEvent"("eventFingerprint");

-- CreateIndex
CREATE INDEX "InvestmentScenarioAuditEvent_scenarioId_createdAt_idx" ON "InvestmentScenarioAuditEvent"("scenarioId", "createdAt");

-- CreateIndex
CREATE INDEX "InvestmentScenarioAuditEvent_ownerAgentSubject_createdAt_idx" ON "InvestmentScenarioAuditEvent"("ownerAgentSubject", "createdAt");

-- CreateIndex
CREATE INDEX "StrategyAnalysis_ownerAgentSubject_createdAt_idx" ON "StrategyAnalysis"("ownerAgentSubject", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "StrategyAnalysis_ownerAgentSubject_analysisKey_key" ON "StrategyAnalysis"("ownerAgentSubject", "analysisKey");

-- CreateIndex
CREATE UNIQUE INDEX "StrategyAlternative_inputFingerprint_key" ON "StrategyAlternative"("inputFingerprint");

-- CreateIndex
CREATE UNIQUE INDEX "StrategyAlternative_supersedesAlternativeId_key" ON "StrategyAlternative"("supersedesAlternativeId");

-- CreateIndex
CREATE INDEX "StrategyAlternative_ownerAgentSubject_analysisId_createdAt_idx" ON "StrategyAlternative"("ownerAgentSubject", "analysisId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "StrategyAlternative_analysisId_alternativeKey_versionOrdinal_ke" ON "StrategyAlternative"("analysisId", "alternativeKey", "versionOrdinal");

-- CreateIndex
CREATE UNIQUE INDEX "StrategyAlternativeResult_resultFingerprint_key" ON "StrategyAlternativeResult"("resultFingerprint");

-- CreateIndex
CREATE INDEX "StrategyAlternativeResult_ownerAgentSubject_createdAt_idx" ON "StrategyAlternativeResult"("ownerAgentSubject", "createdAt");

-- CreateIndex
CREATE INDEX "StrategyAlternativeResult_alternativeId_createdAt_idx" ON "StrategyAlternativeResult"("alternativeId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "StrategyAlternativeResult_alternativeId_versionOrdinal_key" ON "StrategyAlternativeResult"("alternativeId", "versionOrdinal");

-- CreateIndex
CREATE INDEX "StrategyPropertyRole_ownerAgentSubject_canonicalPropertyId_idx" ON "StrategyPropertyRole"("ownerAgentSubject", "canonicalPropertyId");

-- CreateIndex
CREATE UNIQUE INDEX "StrategyPropertyRole_alternativeId_role_key" ON "StrategyPropertyRole"("alternativeId", "role");

-- CreateIndex
CREATE INDEX "StrategyAlternativeDependency_ownerAgentSubject_alternativeId_i" ON "StrategyAlternativeDependency"("ownerAgentSubject", "alternativeId");

-- CreateIndex
CREATE UNIQUE INDEX "StrategyAlternativeDependency_alternativeId_upstreamArtifact_de" ON "StrategyAlternativeDependency"("alternativeId", "upstreamArtifact", "dependencyType");

-- CreateIndex
CREATE UNIQUE INDEX "StrategyAlternativeAuditEvent_eventFingerprint_key" ON "StrategyAlternativeAuditEvent"("eventFingerprint");

-- CreateIndex
CREATE INDEX "StrategyAlternativeAuditEvent_alternativeId_createdAt_idx" ON "StrategyAlternativeAuditEvent"("alternativeId", "createdAt");

-- CreateIndex
CREATE INDEX "StrategyAlternativeAuditEvent_ownerAgentSubject_createdAt_idx" ON "StrategyAlternativeAuditEvent"("ownerAgentSubject", "createdAt");

-- CreateIndex
CREATE INDEX "MultiPropertyFinancialScenario_ownerAgentSubject_clientCaseId_c" ON "MultiPropertyFinancialScenario"("ownerAgentSubject", "clientCaseId", "createdAt");

-- CreateIndex
CREATE INDEX "MultiPropertyFinancialScenario_ownerAgentSubject_lifecycleState" ON "MultiPropertyFinancialScenario"("ownerAgentSubject", "lifecycleState", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "MultiPropertyFinancialScenario_ownerAgentSubject_scenarioKey_ke" ON "MultiPropertyFinancialScenario"("ownerAgentSubject", "scenarioKey");

-- CreateIndex
CREATE UNIQUE INDEX "MultiPropertyFinancialScenarioVersion_inputFingerprint_key" ON "MultiPropertyFinancialScenarioVersion"("inputFingerprint");

-- CreateIndex
CREATE UNIQUE INDEX "MultiPropertyFinancialScenarioVersion_idempotencyKey_key" ON "MultiPropertyFinancialScenarioVersion"("idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "MultiPropertyFinancialScenarioVersion_supersedesVersionId_key" ON "MultiPropertyFinancialScenarioVersion"("supersedesVersionId");

-- CreateIndex
CREATE INDEX "MultiPropertyFinancialScenarioVersion_ownerAgentSubject_scenari" ON "MultiPropertyFinancialScenarioVersion"("ownerAgentSubject", "scenarioId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "MultiPropertyFinancialScenarioVersion_scenarioId_versionOrdinal" ON "MultiPropertyFinancialScenarioVersion"("scenarioId", "versionOrdinal");

-- CreateIndex
CREATE INDEX "MultiPropertyFinancialScenarioProperty_ownerAgentSubject_canoni" ON "MultiPropertyFinancialScenarioProperty"("ownerAgentSubject", "canonicalPropertyId");

-- CreateIndex
CREATE INDEX "MultiPropertyFinancialScenarioProperty_scenarioVersionId_role_i" ON "MultiPropertyFinancialScenarioProperty"("scenarioVersionId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "MultiPropertyFinancialScenarioProperty_scenarioVersionId_sequen" ON "MultiPropertyFinancialScenarioProperty"("scenarioVersionId", "sequence");

-- CreateIndex
CREATE UNIQUE INDEX "MultiPropertyFinancialScenarioResult_scenarioVersionId_key" ON "MultiPropertyFinancialScenarioResult"("scenarioVersionId");

-- CreateIndex
CREATE UNIQUE INDEX "MultiPropertyFinancialScenarioResult_resultFingerprint_key" ON "MultiPropertyFinancialScenarioResult"("resultFingerprint");

-- CreateIndex
CREATE INDEX "MultiPropertyFinancialScenarioResult_ownerAgentSubject_calculat" ON "MultiPropertyFinancialScenarioResult"("ownerAgentSubject", "calculatedAt");

-- CreateIndex
CREATE INDEX "MultiPropertyFinancialScenarioResult_inputFingerprint_idx" ON "MultiPropertyFinancialScenarioResult"("inputFingerprint");

-- CreateIndex
CREATE UNIQUE INDEX "MultiPropertyFinancialScenarioAuditEvent_eventFingerprint_key" ON "MultiPropertyFinancialScenarioAuditEvent"("eventFingerprint");

-- CreateIndex
CREATE INDEX "MultiPropertyFinancialScenarioAuditEvent_scenarioId_createdAt_i" ON "MultiPropertyFinancialScenarioAuditEvent"("scenarioId", "createdAt");

-- CreateIndex
CREATE INDEX "MultiPropertyFinancialScenarioAuditEvent_ownerAgentSubject_crea" ON "MultiPropertyFinancialScenarioAuditEvent"("ownerAgentSubject", "createdAt");

-- CreateIndex
CREATE INDEX "AdvancedInvestmentReturnAnalysis_ownerAgentSubject_createdAt_id" ON "AdvancedInvestmentReturnAnalysis"("ownerAgentSubject", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AdvancedInvestmentReturnAnalysis_ownerAgentSubject_analysisKey_" ON "AdvancedInvestmentReturnAnalysis"("ownerAgentSubject", "analysisKey");

-- CreateIndex
CREATE UNIQUE INDEX "AdvancedInvestmentReturnProjection_inputFingerprint_key" ON "AdvancedInvestmentReturnProjection"("inputFingerprint");

-- CreateIndex
CREATE UNIQUE INDEX "AdvancedInvestmentReturnProjection_supersedesProjectionId_key" ON "AdvancedInvestmentReturnProjection"("supersedesProjectionId");

-- CreateIndex
CREATE INDEX "AdvancedInvestmentReturnProjection_ownerAgentSubject_analysisId" ON "AdvancedInvestmentReturnProjection"("ownerAgentSubject", "analysisId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AdvancedInvestmentReturnProjection_analysisId_projectionKey_ver" ON "AdvancedInvestmentReturnProjection"("analysisId", "projectionKey", "versionOrdinal");

-- CreateIndex
CREATE UNIQUE INDEX "AdvancedInvestmentReturnProjectionResult_resultFingerprint_key" ON "AdvancedInvestmentReturnProjectionResult"("resultFingerprint");

-- CreateIndex
CREATE INDEX "AdvancedInvestmentReturnProjectionResult_ownerAgentSubject_crea" ON "AdvancedInvestmentReturnProjectionResult"("ownerAgentSubject", "createdAt");

-- CreateIndex
CREATE INDEX "AdvancedInvestmentReturnProjectionResult_projectionId_createdAt" ON "AdvancedInvestmentReturnProjectionResult"("projectionId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AdvancedInvestmentReturnProjectionResult_projectionId_versionOr" ON "AdvancedInvestmentReturnProjectionResult"("projectionId", "versionOrdinal");

-- CreateIndex
CREATE INDEX "AdvancedInvestmentReturnDependency_ownerAgentSubject_projection" ON "AdvancedInvestmentReturnDependency"("ownerAgentSubject", "projectionId");

-- CreateIndex
CREATE UNIQUE INDEX "AdvancedInvestmentReturnDependency_projectionId_upstreamArtifac" ON "AdvancedInvestmentReturnDependency"("projectionId", "upstreamArtifact", "dependencyType");

-- CreateIndex
CREATE UNIQUE INDEX "AdvancedInvestmentReturnAuditEvent_eventFingerprint_key" ON "AdvancedInvestmentReturnAuditEvent"("eventFingerprint");

-- CreateIndex
CREATE INDEX "AdvancedInvestmentReturnAuditEvent_projectionId_createdAt_idx" ON "AdvancedInvestmentReturnAuditEvent"("projectionId", "createdAt");

-- CreateIndex
CREATE INDEX "AdvancedInvestmentReturnAuditEvent_ownerAgentSubject_createdAt_" ON "AdvancedInvestmentReturnAuditEvent"("ownerAgentSubject", "createdAt");

-- AddForeignKey
ALTER TABLE "PropertySourceIdentity" ADD CONSTRAINT "PropertySourceIdentity_supersededById_fkey" FOREIGN KEY ("supersededById") REFERENCES "PropertySourceIdentity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertySourceIdentityObservation" ADD CONSTRAINT "PropertySourceIdentityObservation_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "PropertySourceIdentity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertySourceIdentityRelationship" ADD CONSTRAINT "PropertySourceIdentityRelationship_sourceIdentityId_fkey" FOREIGN KEY ("sourceIdentityId") REFERENCES "PropertySourceIdentity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertySourceIdentityRelationship" ADD CONSTRAINT "PropertySourceIdentityRelationship_targetIdentityId_fkey" FOREIGN KEY ("targetIdentityId") REFERENCES "PropertySourceIdentity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertySourceIdentityRelationship" ADD CONSTRAINT "PropertySourceIdentityRelationship_observationId_fkey" FOREIGN KEY ("observationId") REFERENCES "PropertySourceIdentityObservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertySourceIdentityRelationship" ADD CONSTRAINT "PropertySourceIdentityRelationship_supersededById_fkey" FOREIGN KEY ("supersededById") REFERENCES "PropertySourceIdentityRelationship"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyCountyIdentityMapping" ADD CONSTRAINT "PropertyCountyIdentityMapping_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyCountyIdentityMapping" ADD CONSTRAINT "PropertyCountyIdentityMapping_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "PropertySourceIdentity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyCountyIdentityMapping" ADD CONSTRAINT "PropertyCountyIdentityMapping_observationId_fkey" FOREIGN KEY ("observationId") REFERENCES "PropertySourceIdentityObservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanonicalPhysicalProperty" ADD CONSTRAINT "CanonicalPhysicalProperty_supersededById_fkey" FOREIGN KEY ("supersededById") REFERENCES "CanonicalPhysicalProperty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanonicalPhysicalPropertySourceIdentityMapping" ADD CONSTRAINT "CanonicalPhysicalPropertySourceIdentityMapping_canonicalPropert" FOREIGN KEY ("canonicalPropertyId") REFERENCES "CanonicalPhysicalProperty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanonicalPhysicalPropertySourceIdentityMapping" ADD CONSTRAINT "CanonicalPhysicalPropertySourceIdentityMapping_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "PropertySourceIdentity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanonicalPhysicalPropertySourceIdentityMapping" ADD CONSTRAINT "CanonicalPhysicalPropertySourceIdentityMapping_supersededById_f" FOREIGN KEY ("supersededById") REFERENCES "CanonicalPhysicalPropertySourceIdentityMapping"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanonicalPhysicalPropertyObservation" ADD CONSTRAINT "CanonicalPhysicalPropertyObservation_canonicalPropertyId_fkey" FOREIGN KEY ("canonicalPropertyId") REFERENCES "CanonicalPhysicalProperty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanonicalPhysicalPropertyObservation" ADD CONSTRAINT "CanonicalPhysicalPropertyObservation_sourceIdentityId_fkey" FOREIGN KEY ("sourceIdentityId") REFERENCES "PropertySourceIdentity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanonicalPhysicalPropertyObservation" ADD CONSTRAINT "CanonicalPhysicalPropertyObservation_sourceIdentityObservationI" FOREIGN KEY ("sourceIdentityObservationId") REFERENCES "PropertySourceIdentityObservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanonicalPropertyListingEvent" ADD CONSTRAINT "CanonicalPropertyListingEvent_canonicalPropertyId_fkey" FOREIGN KEY ("canonicalPropertyId") REFERENCES "CanonicalPhysicalProperty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanonicalPropertyListingEvent" ADD CONSTRAINT "CanonicalPropertyListingEvent_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanonicalPropertyListingEvent" ADD CONSTRAINT "CanonicalPropertyListingEvent_supersededById_fkey" FOREIGN KEY ("supersededById") REFERENCES "CanonicalPropertyListingEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyPhoto" ADD CONSTRAINT "PropertyPhoto_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceHistory" ADD CONSTRAINT "PriceHistory_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpenHouse" ADD CONSTRAINT "OpenHouse_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CRMTask" ADD CONSTRAINT "CRMTask_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CRMTask" ADD CONSTRAINT "CRMTask_leadid_fkey" FOREIGN KEY ("leadid") REFERENCES "SellerLead"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UserInteraction" ADD CONSTRAINT "UserInteraction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadInteraction" ADD CONSTRAINT "LeadInteraction_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadInteraction" ADD CONSTRAINT "LeadInteraction_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "NorthStar" ADD CONSTRAINT "NorthStar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedSearch" ADD CONSTRAINT "SavedSearch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertEvent" ADD CONSTRAINT "AlertEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertEvent" ADD CONSTRAINT "AlertEvent_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertQueue" ADD CONSTRAINT "AlertQueue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnsubscribeToken" ADD CONSTRAINT "UnsubscribeToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnsubscribeToken" ADD CONSTRAINT "UnsubscribeToken_searchId_fkey" FOREIGN KEY ("searchId") REFERENCES "SavedSearch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailLog" ADD CONSTRAINT "EmailLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Neighborhood" ADD CONSTRAINT "Neighborhood_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeographicObject" ADD CONSTRAINT "GeographicObject_convenienceParentId_fkey" FOREIGN KEY ("convenienceParentId") REFERENCES "GeographicObject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeographicObject" ADD CONSTRAINT "GeographicObject_mergedIntoId_fkey" FOREIGN KEY ("mergedIntoId") REFERENCES "GeographicObject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeographicAlias" ADD CONSTRAINT "GeographicAlias_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "GeographicObject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeographicAlias" ADD CONSTRAINT "GeographicAlias_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "GeographicSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeographicRelationship" ADD CONSTRAINT "GeographicRelationship_sourceObjectId_fkey" FOREIGN KEY ("sourceObjectId") REFERENCES "GeographicObject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeographicRelationship" ADD CONSTRAINT "GeographicRelationship_targetObjectId_fkey" FOREIGN KEY ("targetObjectId") REFERENCES "GeographicObject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeographicRelationship" ADD CONSTRAINT "GeographicRelationship_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "GeographicSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeographicObservation" ADD CONSTRAINT "GeographicObservation_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "GeographicObject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeographicObservation" ADD CONSTRAINT "GeographicObservation_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "GeographicSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeographicEligibility" ADD CONSTRAINT "GeographicEligibility_objectId_fkey" FOREIGN KEY ("objectId") REFERENCES "GeographicObject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyGeographicRelationship" ADD CONSTRAINT "PropertyGeographicRelationship_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyGeographicRelationship" ADD CONSTRAINT "PropertyGeographicRelationship_geographicObjectId_fkey" FOREIGN KEY ("geographicObjectId") REFERENCES "GeographicObject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyGeographicRelationship" ADD CONSTRAINT "PropertyGeographicRelationship_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "GeographicSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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

-- AddForeignKey
ALTER TABLE "OutputProduct" ADD CONSTRAINT "OutputProduct_clientCaseId_fkey" FOREIGN KEY ("clientCaseId") REFERENCES "ClientCase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutputProduct" ADD CONSTRAINT "OutputProduct_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutputVersion" ADD CONSTRAINT "OutputVersion_productId_fkey" FOREIGN KEY ("productId") REFERENCES "OutputProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutputVersion" ADD CONSTRAINT "OutputVersion_multiPropertyFinancialScenarioVersionId_fkey" FOREIGN KEY ("multiPropertyFinancialScenarioVersionId") REFERENCES "MultiPropertyFinancialScenarioVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutputEvidenceSnapshot" ADD CONSTRAINT "OutputEvidenceSnapshot_outputVersionId_fkey" FOREIGN KEY ("outputVersionId") REFERENCES "OutputVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutputDependency" ADD CONSTRAINT "OutputDependency_outputVersionId_fkey" FOREIGN KEY ("outputVersionId") REFERENCES "OutputVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutputReview" ADD CONSTRAINT "OutputReview_outputVersionId_fkey" FOREIGN KEY ("outputVersionId") REFERENCES "OutputVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutputDecision" ADD CONSTRAINT "OutputDecision_outputVersionId_fkey" FOREIGN KEY ("outputVersionId") REFERENCES "OutputVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutputCheckpoint" ADD CONSTRAINT "OutputCheckpoint_outputVersionId_fkey" FOREIGN KEY ("outputVersionId") REFERENCES "OutputVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceCandidate" ADD CONSTRAINT "EvidenceCandidate_admissionId_fkey" FOREIGN KEY ("admissionId") REFERENCES "EvidenceAdmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceAdmission" ADD CONSTRAINT "EvidenceAdmission_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "EvidenceCandidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceAdmission" ADD CONSTRAINT "EvidenceAdmission_supersedesAdmissionId_fkey" FOREIGN KEY ("supersedesAdmissionId") REFERENCES "EvidenceAdmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceAdmissionAuditEvent" ADD CONSTRAINT "EvidenceAdmissionAuditEvent_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "EvidenceCandidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceAdmissionAuditEvent" ADD CONSTRAINT "EvidenceAdmissionAuditEvent_admissionId_fkey" FOREIGN KEY ("admissionId") REFERENCES "EvidenceAdmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalInputRequest" ADD CONSTRAINT "ProfessionalInputRequest_supersedesRequestId_fkey" FOREIGN KEY ("supersedesRequestId") REFERENCES "ProfessionalInputRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalRequestDelivery" ADD CONSTRAINT "ExternalRequestDelivery_professionalInputRequestId_fkey" FOREIGN KEY ("professionalInputRequestId") REFERENCES "ProfessionalInputRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalRequestCapability" ADD CONSTRAINT "ExternalRequestCapability_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "ExternalRequestDelivery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalRequestSession" ADD CONSTRAINT "ExternalRequestSession_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "ExternalRequestDelivery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalRequestDisclosureSnapshot" ADD CONSTRAINT "ExternalRequestDisclosureSnapshot_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "ExternalRequestDelivery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalIdentityVerification" ADD CONSTRAINT "ExternalIdentityVerification_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "ExternalRequestDelivery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalInputResponse" ADD CONSTRAINT "ProfessionalInputResponse_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "ProfessionalInputRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalInputResponse" ADD CONSTRAINT "ProfessionalInputResponse_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "EvidenceCandidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalInput" ADD CONSTRAINT "ProfessionalInput_evidenceAdmissionId_fkey" FOREIGN KEY ("evidenceAdmissionId") REFERENCES "EvidenceAdmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_canonicalPropertyId_fkey" FOREIGN KEY ("canonicalPropertyId") REFERENCES "CanonicalPhysicalProperty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_clientCaseId_fkey" FOREIGN KEY ("clientCaseId") REFERENCES "ClientCase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionParty" ADD CONSTRAINT "TransactionParty_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionParty" ADD CONSTRAINT "TransactionParty_clientCasePartyId_fkey" FOREIGN KEY ("clientCasePartyId") REFERENCES "ClientCaseParty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactMethod" ADD CONSTRAINT "ContactMethod_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientCaseParty" ADD CONSTRAINT "ClientCaseParty_clientCaseId_fkey" FOREIGN KEY ("clientCaseId") REFERENCES "ClientCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientCaseParty" ADD CONSTRAINT "ClientCaseParty_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientCasePartyAdvisoryRole" ADD CONSTRAINT "ClientCasePartyAdvisoryRole_clientCasePartyId_fkey" FOREIGN KEY ("clientCasePartyId") REFERENCES "ClientCaseParty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientCaseProperty" ADD CONSTRAINT "ClientCaseProperty_clientCaseId_fkey" FOREIGN KEY ("clientCaseId") REFERENCES "ClientCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientCaseProperty" ADD CONSTRAINT "ClientCaseProperty_canonicalPropertyId_fkey" FOREIGN KEY ("canonicalPropertyId") REFERENCES "CanonicalPhysicalProperty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientCasePropertyRelationshipRole" ADD CONSTRAINT "ClientCasePropertyRelationshipRole_clientCasePropertyId_fkey" FOREIGN KEY ("clientCasePropertyId") REFERENCES "ClientCaseProperty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientCaseObjective" ADD CONSTRAINT "ClientCaseObjective_clientCaseId_fkey" FOREIGN KEY ("clientCaseId") REFERENCES "ClientCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientCaseFact" ADD CONSTRAINT "ClientCaseFact_clientCaseId_fkey" FOREIGN KEY ("clientCaseId") REFERENCES "ClientCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientCaseFact" ADD CONSTRAINT "ClientCaseFact_objectiveId_fkey" FOREIGN KEY ("objectiveId") REFERENCES "ClientCaseObjective"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientCaseFact" ADD CONSTRAINT "ClientCaseFact_clientCasePropertyId_fkey" FOREIGN KEY ("clientCasePropertyId") REFERENCES "ClientCaseProperty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientCaseFact" ADD CONSTRAINT "ClientCaseFact_evidenceAdmissionId_fkey" FOREIGN KEY ("evidenceAdmissionId") REFERENCES "EvidenceAdmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientCaseFact" ADD CONSTRAINT "ClientCaseFact_professionalInputId_fkey" FOREIGN KEY ("professionalInputId") REFERENCES "ProfessionalInput"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientCaseFact" ADD CONSTRAINT "ClientCaseFact_supersedesFactId_fkey" FOREIGN KEY ("supersedesFactId") REFERENCES "ClientCaseFact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientCaseCriterion" ADD CONSTRAINT "ClientCaseCriterion_clientCaseId_fkey" FOREIGN KEY ("clientCaseId") REFERENCES "ClientCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientCaseCriterion" ADD CONSTRAINT "ClientCaseCriterion_objectiveId_fkey" FOREIGN KEY ("objectiveId") REFERENCES "ClientCaseObjective"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientCaseCriterion" ADD CONSTRAINT "ClientCaseCriterion_clientCasePropertyId_fkey" FOREIGN KEY ("clientCasePropertyId") REFERENCES "ClientCaseProperty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientCaseCriterion" ADD CONSTRAINT "ClientCaseCriterion_evidenceAdmissionId_fkey" FOREIGN KEY ("evidenceAdmissionId") REFERENCES "EvidenceAdmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientCaseCriterion" ADD CONSTRAINT "ClientCaseCriterion_professionalInputId_fkey" FOREIGN KEY ("professionalInputId") REFERENCES "ProfessionalInput"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientCaseCriterion" ADD CONSTRAINT "ClientCaseCriterion_supersedesCriterionId_fkey" FOREIGN KEY ("supersedesCriterionId") REFERENCES "ClientCaseCriterion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientCaseScenario" ADD CONSTRAINT "ClientCaseScenario_clientCaseId_fkey" FOREIGN KEY ("clientCaseId") REFERENCES "ClientCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientCaseScenario" ADD CONSTRAINT "ClientCaseScenario_currentVersionId_fkey" FOREIGN KEY ("currentVersionId") REFERENCES "ClientCaseScenarioVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientCaseScenario" ADD CONSTRAINT "ClientCaseScenario_duplicatedFromScenarioId_fkey" FOREIGN KEY ("duplicatedFromScenarioId") REFERENCES "ClientCaseScenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientCaseScenario" ADD CONSTRAINT "ClientCaseScenario_duplicatedFromScenarioVersionId_fkey" FOREIGN KEY ("duplicatedFromScenarioVersionId") REFERENCES "ClientCaseScenarioVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientCaseScenarioVersion" ADD CONSTRAINT "ClientCaseScenarioVersion_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "ClientCaseScenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientCaseScenarioAssumption" ADD CONSTRAINT "ClientCaseScenarioAssumption_scenarioVersionId_fkey" FOREIGN KEY ("scenarioVersionId") REFERENCES "ClientCaseScenarioVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientCaseScenarioCriterion" ADD CONSTRAINT "ClientCaseScenarioCriterion_scenarioVersionId_fkey" FOREIGN KEY ("scenarioVersionId") REFERENCES "ClientCaseScenarioVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientCaseScenarioPropertyDisposition" ADD CONSTRAINT "ClientCaseScenarioPropertyDisposition_scenarioVersionId_fkey" FOREIGN KEY ("scenarioVersionId") REFERENCES "ClientCaseScenarioVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientCaseScenarioPropertyDisposition" ADD CONSTRAINT "ClientCaseScenarioPropertyDisposition_clientCasePropertyId_fkey" FOREIGN KEY ("clientCasePropertyId") REFERENCES "ClientCaseProperty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientCaseScenarioObjective" ADD CONSTRAINT "ClientCaseScenarioObjective_scenarioVersionId_fkey" FOREIGN KEY ("scenarioVersionId") REFERENCES "ClientCaseScenarioVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientCaseScenarioObjective" ADD CONSTRAINT "ClientCaseScenarioObjective_clientCaseObjectiveId_fkey" FOREIGN KEY ("clientCaseObjectiveId") REFERENCES "ClientCaseObjective"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionDeadline" ADD CONSTRAINT "TransactionDeadline_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionDeadline" ADD CONSTRAINT "TransactionDeadline_supersedesDeadlineId_fkey" FOREIGN KEY ("supersedesDeadlineId") REFERENCES "TransactionDeadline"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionIssue" ADD CONSTRAINT "TransactionIssue_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionIssue" ADD CONSTRAINT "TransactionIssue_relatedDeadlineId_fkey" FOREIGN KEY ("relatedDeadlineId") REFERENCES "TransactionDeadline"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionIssue" ADD CONSTRAINT "TransactionIssue_professionalInputResponseId_fkey" FOREIGN KEY ("professionalInputResponseId") REFERENCES "ProfessionalInputResponse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionIssue" ADD CONSTRAINT "TransactionIssue_evidenceCandidateId_fkey" FOREIGN KEY ("evidenceCandidateId") REFERENCES "EvidenceCandidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionIssue" ADD CONSTRAINT "TransactionIssue_evidenceAdmissionId_fkey" FOREIGN KEY ("evidenceAdmissionId") REFERENCES "EvidenceAdmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionIssue" ADD CONSTRAINT "TransactionIssue_outputVersionId_fkey" FOREIGN KEY ("outputVersionId") REFERENCES "OutputVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionIssue" ADD CONSTRAINT "TransactionIssue_supersedesIssueId_fkey" FOREIGN KEY ("supersedesIssueId") REFERENCES "TransactionIssue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionDecision" ADD CONSTRAINT "TransactionDecision_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionDecision" ADD CONSTRAINT "TransactionDecision_relatedIssueId_fkey" FOREIGN KEY ("relatedIssueId") REFERENCES "TransactionIssue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionDecision" ADD CONSTRAINT "TransactionDecision_relatedDeadlineId_fkey" FOREIGN KEY ("relatedDeadlineId") REFERENCES "TransactionDeadline"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionDecision" ADD CONSTRAINT "TransactionDecision_supersedesDecisionId_fkey" FOREIGN KEY ("supersedesDecisionId") REFERENCES "TransactionDecision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionTimelineEvent" ADD CONSTRAINT "TransactionTimelineEvent_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientAuthorization" ADD CONSTRAINT "ClientAuthorization_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "ClientAuthorizationProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientAuthorization" ADD CONSTRAINT "ClientAuthorization_supersedesAuthorizationId_fkey" FOREIGN KEY ("supersedesAuthorizationId") REFERENCES "ClientAuthorization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientAuthorizationPrincipal" ADD CONSTRAINT "ClientAuthorizationPrincipal_authorizationId_fkey" FOREIGN KEY ("authorizationId") REFERENCES "ClientAuthorization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientAuthorizationSnapshot" ADD CONSTRAINT "ClientAuthorizationSnapshot_authorizationId_fkey" FOREIGN KEY ("authorizationId") REFERENCES "ClientAuthorization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientAuthorizationUse" ADD CONSTRAINT "ClientAuthorizationUse_authorizationId_fkey" FOREIGN KEY ("authorizationId") REFERENCES "ClientAuthorization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientAuthorizationCapability" ADD CONSTRAINT "ClientAuthorizationCapability_authorizationId_fkey" FOREIGN KEY ("authorizationId") REFERENCES "ClientAuthorization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientAuthorizationSession" ADD CONSTRAINT "ClientAuthorizationSession_authorizationId_fkey" FOREIGN KEY ("authorizationId") REFERENCES "ClientAuthorization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientAuthorizationSession" ADD CONSTRAINT "ClientAuthorizationSession_capabilityId_fkey" FOREIGN KEY ("capabilityId") REFERENCES "ClientAuthorizationCapability"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientAuthorizationSession" ADD CONSTRAINT "ClientAuthorizationSession_clientAuthorizationPrincipalId_fkey" FOREIGN KEY ("clientAuthorizationPrincipalId") REFERENCES "ClientAuthorizationPrincipal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientAuthorizationConfirmationEvidence" ADD CONSTRAINT "ClientAuthorizationConfirmationEvidence_authorizationId_fkey" FOREIGN KEY ("authorizationId") REFERENCES "ClientAuthorization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientAuthorizationConfirmationEvidence" ADD CONSTRAINT "ClientAuthorizationConfirmationEvidence_capabilityId_fkey" FOREIGN KEY ("capabilityId") REFERENCES "ClientAuthorizationCapability"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientAuthorizationConfirmationEvidence" ADD CONSTRAINT "ClientAuthorizationConfirmationEvidence_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "ClientAuthorizationSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientAuthorizationConfirmationEvidence" ADD CONSTRAINT "ClientAuthorizationConfirmationEvidence_clientAuthorizatio_fkey" FOREIGN KEY ("clientAuthorizationPrincipalId") REFERENCES "ClientAuthorizationPrincipal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellerFinancialScenario" ADD CONSTRAINT "SellerFinancialScenario_supersedesScenarioId_fkey" FOREIGN KEY ("supersedesScenarioId") REFERENCES "SellerFinancialScenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellerFinancialResult" ADD CONSTRAINT "SellerFinancialResult_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "SellerFinancialScenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellerFinancialAuditEvent" ADD CONSTRAINT "SellerFinancialAuditEvent_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "SellerFinancialScenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentScenario" ADD CONSTRAINT "InvestmentScenario_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "InvestmentAnalysis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentScenario" ADD CONSTRAINT "InvestmentScenario_supersedesScenarioId_fkey" FOREIGN KEY ("supersedesScenarioId") REFERENCES "InvestmentScenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentScenarioResult" ADD CONSTRAINT "InvestmentScenarioResult_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "InvestmentScenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentScenarioAuditEvent" ADD CONSTRAINT "InvestmentScenarioAuditEvent_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "InvestmentScenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StrategyAlternative" ADD CONSTRAINT "StrategyAlternative_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "StrategyAnalysis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StrategyAlternative" ADD CONSTRAINT "StrategyAlternative_supersedesAlternativeId_fkey" FOREIGN KEY ("supersedesAlternativeId") REFERENCES "StrategyAlternative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StrategyAlternativeResult" ADD CONSTRAINT "StrategyAlternativeResult_alternativeId_fkey" FOREIGN KEY ("alternativeId") REFERENCES "StrategyAlternative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StrategyPropertyRole" ADD CONSTRAINT "StrategyPropertyRole_alternativeId_fkey" FOREIGN KEY ("alternativeId") REFERENCES "StrategyAlternative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StrategyPropertyRole" ADD CONSTRAINT "StrategyPropertyRole_canonicalPropertyId_fkey" FOREIGN KEY ("canonicalPropertyId") REFERENCES "CanonicalPhysicalProperty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StrategyAlternativeDependency" ADD CONSTRAINT "StrategyAlternativeDependency_alternativeId_fkey" FOREIGN KEY ("alternativeId") REFERENCES "StrategyAlternative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StrategyAlternativeAuditEvent" ADD CONSTRAINT "StrategyAlternativeAuditEvent_alternativeId_fkey" FOREIGN KEY ("alternativeId") REFERENCES "StrategyAlternative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MultiPropertyFinancialScenario" ADD CONSTRAINT "MultiPropertyFinancialScenario_clientCaseId_fkey" FOREIGN KEY ("clientCaseId") REFERENCES "ClientCase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MultiPropertyFinancialScenarioVersion" ADD CONSTRAINT "MultiPropertyFinancialScenarioVersion_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "MultiPropertyFinancialScenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MultiPropertyFinancialScenarioVersion" ADD CONSTRAINT "MultiPropertyFinancialScenarioVersion_supersedesVersionId_fkey" FOREIGN KEY ("supersedesVersionId") REFERENCES "MultiPropertyFinancialScenarioVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MultiPropertyFinancialScenarioProperty" ADD CONSTRAINT "MultiPropertyFinancialScenarioProperty_scenarioVersionId_fkey" FOREIGN KEY ("scenarioVersionId") REFERENCES "MultiPropertyFinancialScenarioVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MultiPropertyFinancialScenarioProperty" ADD CONSTRAINT "MultiPropertyFinancialScenarioProperty_canonicalPropertyId_fkey" FOREIGN KEY ("canonicalPropertyId") REFERENCES "CanonicalPhysicalProperty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MultiPropertyFinancialScenarioResult" ADD CONSTRAINT "MultiPropertyFinancialScenarioResult_scenarioVersionId_fkey" FOREIGN KEY ("scenarioVersionId") REFERENCES "MultiPropertyFinancialScenarioVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MultiPropertyFinancialScenarioAuditEvent" ADD CONSTRAINT "MultiPropertyFinancialScenarioAuditEvent_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "MultiPropertyFinancialScenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MultiPropertyFinancialScenarioAuditEvent" ADD CONSTRAINT "MultiPropertyFinancialScenarioAuditEvent_scenarioVersionId_fkey" FOREIGN KEY ("scenarioVersionId") REFERENCES "MultiPropertyFinancialScenarioVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdvancedInvestmentReturnProjection" ADD CONSTRAINT "AdvancedInvestmentReturnProjection_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "AdvancedInvestmentReturnAnalysis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdvancedInvestmentReturnProjection" ADD CONSTRAINT "AdvancedInvestmentReturnProjection_supersedesProjectionId_fkey" FOREIGN KEY ("supersedesProjectionId") REFERENCES "AdvancedInvestmentReturnProjection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdvancedInvestmentReturnProjectionResult" ADD CONSTRAINT "AdvancedInvestmentReturnProjectionResult_projectionId_fkey" FOREIGN KEY ("projectionId") REFERENCES "AdvancedInvestmentReturnProjection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdvancedInvestmentReturnDependency" ADD CONSTRAINT "AdvancedInvestmentReturnDependency_projectionId_fkey" FOREIGN KEY ("projectionId") REFERENCES "AdvancedInvestmentReturnProjection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdvancedInvestmentReturnAuditEvent" ADD CONSTRAINT "AdvancedInvestmentReturnAuditEvent_projectionId_fkey" FOREIGN KEY ("projectionId") REFERENCES "AdvancedInvestmentReturnProjection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
