-- REIE canonical physical-property identity architecture.
-- Additive and intentionally empty. This migration is not applied by this package.

ALTER TYPE "PropertySourceIdentifierType" ADD VALUE IF NOT EXISTS 'MLS_LISTING';
ALTER TYPE "PropertySourceIdentifierType" ADD VALUE IF NOT EXISTS 'SOURCE_PROPERTY_RECORD';

CREATE TYPE "CanonicalPhysicalPropertyIdentityStatus" AS ENUM ('UNRESOLVED', 'ACTIVE', 'CONFLICTING', 'SUPERSEDED', 'RETIRED');
CREATE TYPE "CanonicalPhysicalPropertyIdentityConfidence" AS ENUM ('UNVERIFIED', 'POSSIBLE', 'PROBABLE', 'CONFIRMED', 'CONFLICTING');
CREATE TYPE "CanonicalPhysicalPropertyAssociationType" AS ENUM ('CANONICAL_PROPERTY_HAS_SOURCE_IDENTITY', 'PROPERTY_ASSOCIATED_WITH_PARCEL', 'PROPERTY_ASSOCIATED_WITH_STRUCTURE', 'PROPERTY_ASSOCIATED_WITH_UNIT');
CREATE TYPE "CanonicalPhysicalPropertyAssociationStatus" AS ENUM ('OBSERVED', 'POSSIBLE', 'CONFIRMED', 'CONFLICTING', 'SUPERSEDED');
CREATE TYPE "CanonicalPhysicalPropertyAssociationBasis" AS ENUM ('SOURCE_REPORTED', 'DETERMINISTIC_CORRELATION', 'MANUAL_REVIEW', 'FUZZY_ADDRESS_CANDIDATE', 'UNKNOWN');
CREATE TYPE "CanonicalPhysicalPropertyObservationKind" AS ENUM ('IDENTITY', 'ADDRESS', 'PROPERTY_FACT', 'LISTING_EVENT');
CREATE TYPE "CanonicalPropertyListingEventStatus" AS ENUM ('CURRENT', 'HISTORICAL', 'UNRESOLVED', 'CONFLICTING', 'SUPERSEDED');

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
    CONSTRAINT "CanonicalPhysicalPropertySourceIdentityMapping_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "CanonicalPhysicalPropertySourceIdentityMapping_no_fuzzy_confirmed" CHECK (NOT ("status" = 'CONFIRMED' AND "basis" = 'FUZZY_ADDRESS_CANDIDATE'))
);

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

CREATE UNIQUE INDEX "CPPSIM_fingerprint_uq" ON "CanonicalPhysicalPropertySourceIdentityMapping"("mappingFingerprint");
CREATE UNIQUE INDEX "CPPSIM_property_identity_type_uq" ON "CanonicalPhysicalPropertySourceIdentityMapping"("canonicalPropertyId", "identityId", "associationType");
CREATE INDEX "CPPSIM_property_status_idx" ON "CanonicalPhysicalPropertySourceIdentityMapping"("canonicalPropertyId", "status", "isCurrent");
CREATE INDEX "CPPSIM_identity_status_idx" ON "CanonicalPhysicalPropertySourceIdentityMapping"("identityId", "status", "isCurrent");
CREATE INDEX "CPPSIM_superseded_idx" ON "CanonicalPhysicalPropertySourceIdentityMapping"("supersededById");
CREATE UNIQUE INDEX "CPPO_fingerprint_uq" ON "CanonicalPhysicalPropertyObservation"("observationFingerprint");
CREATE INDEX "CPPO_property_observed_idx" ON "CanonicalPhysicalPropertyObservation"("canonicalPropertyId", "observedAt");
CREATE INDEX "CPPO_source_kind_idx" ON "CanonicalPhysicalPropertyObservation"("sourceId", "observationKind");
CREATE INDEX "CPPO_identity_idx" ON "CanonicalPhysicalPropertyObservation"("sourceIdentityId");
CREATE INDEX "CPPO_identity_observation_idx" ON "CanonicalPhysicalPropertyObservation"("sourceIdentityObservationId");
CREATE UNIQUE INDEX "CPLE_fingerprint_uq" ON "CanonicalPropertyListingEvent"("eventFingerprint");
CREATE UNIQUE INDEX "CPLE_property_listing_uq" ON "CanonicalPropertyListingEvent"("canonicalPropertyId", "propertyId");
CREATE INDEX "CPLE_canonical_status_idx" ON "CanonicalPropertyListingEvent"("canonicalPropertyId", "status", "isCurrent");
CREATE INDEX "CPLE_property_idx" ON "CanonicalPropertyListingEvent"("propertyId");
CREATE INDEX "CPLE_source_listing_idx" ON "CanonicalPropertyListingEvent"("sourceId", "sourceListingReference");
CREATE INDEX "CPLE_superseded_idx" ON "CanonicalPropertyListingEvent"("supersededById");
CREATE INDEX "CPP_status_confidence_idx" ON "CanonicalPhysicalProperty"("identityStatus", "identityConfidence");
CREATE INDEX "CPP_jurisdiction_idx" ON "CanonicalPhysicalProperty"("state", "county", "jurisdiction");
CREATE INDEX "CPP_normalized_address_idx" ON "CanonicalPhysicalProperty"("normalizedSitusAddress");
CREATE INDEX "CPP_superseded_idx" ON "CanonicalPhysicalProperty"("supersededById");

ALTER TABLE "CanonicalPhysicalProperty" ADD CONSTRAINT "CanonicalPhysicalProperty_supersededById_fkey" FOREIGN KEY ("supersededById") REFERENCES "CanonicalPhysicalProperty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CanonicalPhysicalPropertySourceIdentityMapping" ADD CONSTRAINT "CanonicalPhysicalPropertySourceIdentityMapping_canonicalPropertyId_fkey" FOREIGN KEY ("canonicalPropertyId") REFERENCES "CanonicalPhysicalProperty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CanonicalPhysicalPropertySourceIdentityMapping" ADD CONSTRAINT "CanonicalPhysicalPropertySourceIdentityMapping_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "PropertySourceIdentity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CanonicalPhysicalPropertySourceIdentityMapping" ADD CONSTRAINT "CanonicalPhysicalPropertySourceIdentityMapping_supersededById_fkey" FOREIGN KEY ("supersededById") REFERENCES "CanonicalPhysicalPropertySourceIdentityMapping"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CanonicalPhysicalPropertyObservation" ADD CONSTRAINT "CanonicalPhysicalPropertyObservation_canonicalPropertyId_fkey" FOREIGN KEY ("canonicalPropertyId") REFERENCES "CanonicalPhysicalProperty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CanonicalPhysicalPropertyObservation" ADD CONSTRAINT "CanonicalPhysicalPropertyObservation_sourceIdentityId_fkey" FOREIGN KEY ("sourceIdentityId") REFERENCES "PropertySourceIdentity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CanonicalPhysicalPropertyObservation" ADD CONSTRAINT "CanonicalPhysicalPropertyObservation_sourceIdentityObservationId_fkey" FOREIGN KEY ("sourceIdentityObservationId") REFERENCES "PropertySourceIdentityObservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CanonicalPropertyListingEvent" ADD CONSTRAINT "CanonicalPropertyListingEvent_canonicalPropertyId_fkey" FOREIGN KEY ("canonicalPropertyId") REFERENCES "CanonicalPhysicalProperty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CanonicalPropertyListingEvent" ADD CONSTRAINT "CanonicalPropertyListingEvent_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CanonicalPropertyListingEvent" ADD CONSTRAINT "CanonicalPropertyListingEvent_supersededById_fkey" FOREIGN KEY ("supersededById") REFERENCES "CanonicalPropertyListingEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
