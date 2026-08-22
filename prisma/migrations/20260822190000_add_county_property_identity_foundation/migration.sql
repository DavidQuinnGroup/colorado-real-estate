-- REIE County Property Identity schema foundation.
-- Additive, runtime-inert, and intentionally creates no domain rows.

CREATE TYPE "CountyJurisdictionType" AS ENUM ('COUNTY', 'MUNICIPALITY', 'SPECIAL_DISTRICT', 'OTHER');
CREATE TYPE "PropertySourceIdentifierType" AS ENUM ('ASSESSOR_ACCOUNT', 'PARCEL', 'BUILDING', 'SCHEDULE_NUMBER', 'TAX_ACCOUNT', 'PROPERTY_NUMBER', 'OTHER_COUNTY_NATIVE_ID');
CREATE TYPE "PropertySourceIdentityStatus" AS ENUM ('OBSERVED', 'ACTIVE', 'CONFLICTING', 'STALE', 'SUPERSEDED', 'RETIRED');
CREATE TYPE "PropertySourceIdentityFreshness" AS ENUM ('FRESH', 'AGING', 'STALE', 'UNKNOWN');
CREATE TYPE "PropertySourceIdentityConfidence" AS ENUM ('UNVERIFIED', 'SOURCE_REPORTED', 'DETERMINISTIC_MATCH', 'MANUAL_REVIEW_CONFIRMED');
CREATE TYPE "PropertySourceIdentityRelationshipType" AS ENUM ('ACCOUNT_TO_PARCEL', 'ACCOUNT_TO_BUILDING', 'ACCOUNT_TO_PROPERTY', 'PARCEL_TO_PROPERTY', 'SUPERSEDES', 'OTHER_COUNTY_NATIVE_RELATIONSHIP');
CREATE TYPE "PropertySourceIdentityRelationshipStatus" AS ENUM ('OBSERVED', 'ACTIVE', 'CONFLICTING', 'STALE', 'SUPERSEDED');
CREATE TYPE "PropertyCountyIdentityMappingStatus" AS ENUM ('MATCHED', 'AMBIGUOUS', 'CONFLICTING', 'UNMATCHED', 'STALE', 'SUPERSEDED');
CREATE TYPE "PropertyCountyIdentityMappingBasis" AS ENUM ('AUTHORITATIVE_IDENTIFIER', 'EXACT_IDENTIFIER_WITH_JURISDICTION', 'ADDRESS_UNIT_LEGAL_CONFIRMATION', 'MANUAL_REVIEW', 'FUZZY_ADDRESS_CANDIDATE', 'UNKNOWN');

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
    CONSTRAINT "PropertySourceIdentityRelationship_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "PropertySourceIdentityRelationship_distinct_endpoints" CHECK ("sourceIdentityId" <> "targetIdentityId")
);

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
    CONSTRAINT "PropertyCountyIdentityMapping_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "PropertyCountyIdentityMapping_no_fuzzy_address_match" CHECK (NOT ("status" = 'MATCHED' AND "basis" = 'FUZZY_ADDRESS_CANDIDATE'))
);

CREATE UNIQUE INDEX "PSI_source_jurisdiction_type_value_uq" ON "PropertySourceIdentity"("sourceId", "jurisdictionCode", "identifierType", "normalizedValue");
CREATE INDEX "PSI_source_jurisdiction_type_idx" ON "PropertySourceIdentity"("sourceId", "jurisdictionCode", "identifierType");
CREATE INDEX "PSI_jurisdiction_current_idx" ON "PropertySourceIdentity"("jurisdictionType", "jurisdictionCode", "isCurrent");
CREATE INDEX "PSI_superseded_idx" ON "PropertySourceIdentity"("supersededById");
CREATE UNIQUE INDEX "PSIO_fingerprint_uq" ON "PropertySourceIdentityObservation"("observationFingerprint");
CREATE INDEX "PSIO_identity_observed_idx" ON "PropertySourceIdentityObservation"("identityId", "observedAt");
CREATE INDEX "PSIO_freshness_idx" ON "PropertySourceIdentityObservation"("freshness");
CREATE UNIQUE INDEX "PSIR_fingerprint_uq" ON "PropertySourceIdentityRelationship"("relationshipFingerprint");
CREATE INDEX "PSIR_source_type_current_idx" ON "PropertySourceIdentityRelationship"("sourceIdentityId", "relationshipType", "isCurrent");
CREATE INDEX "PSIR_target_type_current_idx" ON "PropertySourceIdentityRelationship"("targetIdentityId", "relationshipType", "isCurrent");
CREATE INDEX "PSIR_observation_idx" ON "PropertySourceIdentityRelationship"("observationId");
CREATE INDEX "PSIR_superseded_idx" ON "PropertySourceIdentityRelationship"("supersededById");
CREATE UNIQUE INDEX "PCIM_property_identity_uq" ON "PropertyCountyIdentityMapping"("propertyId", "identityId");
CREATE INDEX "PCIM_property_status_current_idx" ON "PropertyCountyIdentityMapping"("propertyId", "status", "isCurrent");
CREATE INDEX "PCIM_identity_status_current_idx" ON "PropertyCountyIdentityMapping"("identityId", "status", "isCurrent");
CREATE INDEX "PCIM_observation_idx" ON "PropertyCountyIdentityMapping"("observationId");

ALTER TABLE "PropertySourceIdentity" ADD CONSTRAINT "PropertySourceIdentity_supersededById_fkey" FOREIGN KEY ("supersededById") REFERENCES "PropertySourceIdentity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PropertySourceIdentityObservation" ADD CONSTRAINT "PropertySourceIdentityObservation_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "PropertySourceIdentity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PropertySourceIdentityRelationship" ADD CONSTRAINT "PropertySourceIdentityRelationship_sourceIdentityId_fkey" FOREIGN KEY ("sourceIdentityId") REFERENCES "PropertySourceIdentity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PropertySourceIdentityRelationship" ADD CONSTRAINT "PropertySourceIdentityRelationship_targetIdentityId_fkey" FOREIGN KEY ("targetIdentityId") REFERENCES "PropertySourceIdentity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PropertySourceIdentityRelationship" ADD CONSTRAINT "PropertySourceIdentityRelationship_observationId_fkey" FOREIGN KEY ("observationId") REFERENCES "PropertySourceIdentityObservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PropertySourceIdentityRelationship" ADD CONSTRAINT "PropertySourceIdentityRelationship_supersededById_fkey" FOREIGN KEY ("supersededById") REFERENCES "PropertySourceIdentityRelationship"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PropertyCountyIdentityMapping" ADD CONSTRAINT "PropertyCountyIdentityMapping_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PropertyCountyIdentityMapping" ADD CONSTRAINT "PropertyCountyIdentityMapping_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "PropertySourceIdentity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PropertyCountyIdentityMapping" ADD CONSTRAINT "PropertyCountyIdentityMapping_observationId_fkey" FOREIGN KEY ("observationId") REFERENCES "PropertySourceIdentityObservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
