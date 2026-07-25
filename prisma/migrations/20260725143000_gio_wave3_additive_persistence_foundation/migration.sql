-- CreateEnum
CREATE TYPE "GeographicObjectType" AS ENUM ('MUNICIPALITY', 'NEIGHBORHOOD', 'MARKET_AREA', 'ZIP_CODE', 'SUBDIVISION');

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

    CONSTRAINT "GeographicObservation_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "GeographicObservation_json_schema_boundary" CHECK ("valueJson" IS NULL OR "valueSchemaKey" IS NOT NULL)
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

-- CreateIndex
CREATE UNIQUE INDEX "GeographicObject_objectType_canonicalSlug_key" ON "GeographicObject"("objectType", "canonicalSlug");

-- CreateIndex
CREATE INDEX "GeographicObject_canonicalSlug_idx" ON "GeographicObject"("canonicalSlug");

-- CreateIndex
CREATE INDEX "GeographicObject_objectType_lifecycleStatus_idx" ON "GeographicObject"("objectType", "lifecycleStatus");

-- CreateIndex
CREATE INDEX "GeographicObject_convenienceParentId_idx" ON "GeographicObject"("convenienceParentId");

-- CreateIndex
CREATE INDEX "GeographicObject_mergedIntoId_idx" ON "GeographicObject"("mergedIntoId");

-- CreateIndex
CREATE UNIQUE INDEX "GeographicAlias_objectId_normalizedValue_aliasType_language_lifecycleStatus_key" ON "GeographicAlias"("objectId", "normalizedValue", "aliasType", "language", "lifecycleStatus");

-- CreateIndex
CREATE INDEX "GeographicAlias_normalizedValue_idx" ON "GeographicAlias"("normalizedValue");

-- CreateIndex
CREATE INDEX "GeographicAlias_sourceId_idx" ON "GeographicAlias"("sourceId");

-- CreateIndex
CREATE INDEX "GeographicAlias_lifecycleStatus_idx" ON "GeographicAlias"("lifecycleStatus");

-- CreateIndex
CREATE UNIQUE INDEX "GeographicRelationship_sourceObjectId_targetObjectId_relationshipType_directionality_lifecycleStatus_key" ON "GeographicRelationship"("sourceObjectId", "targetObjectId", "relationshipType", "directionality", "lifecycleStatus");

-- CreateIndex
CREATE INDEX "GeographicRelationship_sourceObjectId_relationshipType_idx" ON "GeographicRelationship"("sourceObjectId", "relationshipType");

-- CreateIndex
CREATE INDEX "GeographicRelationship_targetObjectId_relationshipType_idx" ON "GeographicRelationship"("targetObjectId", "relationshipType");

-- CreateIndex
CREATE INDEX "GeographicRelationship_sourceId_idx" ON "GeographicRelationship"("sourceId");

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
CREATE UNIQUE INDEX "PropertyGeographicRelationship_propertyId_geographicObjectId_relationshipType_lifecycleStatus_key" ON "PropertyGeographicRelationship"("propertyId", "geographicObjectId", "relationshipType", "lifecycleStatus");

-- CreateIndex
CREATE INDEX "PropertyGeographicRelationship_propertyId_idx" ON "PropertyGeographicRelationship"("propertyId");

-- CreateIndex
CREATE INDEX "PropertyGeographicRelationship_geographicObjectId_relationshipType_idx" ON "PropertyGeographicRelationship"("geographicObjectId", "relationshipType");

-- CreateIndex
CREATE INDEX "PropertyGeographicRelationship_sourceId_idx" ON "PropertyGeographicRelationship"("sourceId");

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
