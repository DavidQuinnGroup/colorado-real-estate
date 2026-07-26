import { createHash } from "node:crypto";
import { Prisma, type PrismaClient } from "@prisma/client";

import {
  type EnterpriseGeographicReadAggregate,
  type EnterpriseGeographicReadRequest,
  type EnterpriseGeographicReadResult,
  type EnterpriseGeographicReadStatus,
} from "../enterprise-knowledge/geographicReadContract.js";
import {
  GOF_WAVE_3_THORNTON_CERTIFIED_FINGERPRINT,
  GOF_WAVE_3_WRITE_CEILING,
  buildGofWave3ColoradoPersistenceContract,
  type GofWave3ColoradoPersistenceContract,
} from "./coloradoControlledProductionPersistence.js";

export const GOF_WAVE_4_ADAPTER_VERSION = "GOF_1.0_WAVE_4_COLORADO_PRODUCTION_RETRIEVAL_READINESS_ADAPTER_V1";
export const GOF_WAVE_4_AUTHORIZATION = "GOF_1.0_WAVE_4_COLORADO_PRODUCTION_RETRIEVAL_READINESS";
export const GOF_WAVE_4_CERTIFIED_OBJECT_TYPE = "STATE";
export const GOF_WAVE_4_CERTIFIED_CANONICAL_NAME = "Colorado";
export const GOF_WAVE_4_CERTIFIED_DISPLAY_NAME = "Colorado";
export const GOF_WAVE_4_CERTIFIED_SLUG = "colorado";
export const GOF_WAVE_4_STATUS = "CERTIFIED_RETRIEVAL_READY";

export type GofWave4ColoradoReadRequest = EnterpriseGeographicReadRequest & Readonly<{
  canonicalSlug?: string;
  objectType?: string;
  certifiedFingerprint?: string;
}>;

export type GofWave4ColoradoReadResult = EnterpriseGeographicReadResult & Readonly<{
  module: "gof-wave-4-colorado-production-retrieval-readiness-adapter";
  version: typeof GOF_WAVE_4_ADAPTER_VERSION;
  authorization: typeof GOF_WAVE_4_AUTHORIZATION;
}>;

type ColoradoObjectRow = {
  id: string;
  objectType: string;
  canonicalName: string;
  displayName: string;
  canonicalSlug: string;
  lifecycleStatus: string;
  visibility: string;
  convenienceParentId: string | null;
  mergedIntoId: string | null;
};

type AliasRow = {
  id: string;
  aliasText: string;
  normalizedValue: string;
  aliasType: string;
  language: string | null;
  lifecycleStatus: string;
  sourceId: string | null;
  sourceCanonicalName: string | null;
  effectiveDate: Date | null;
};

type SourceRow = {
  id: string;
  canonicalName: string;
  sourceClass: string;
  authorityLevel: string;
  accessMethod: string;
  defaultUpdateCadence: string;
  licensingRestriction: boolean;
  publicDisplayRestriction: boolean;
  healthState: string;
};

type ObservationRow = {
  id: string;
  observationKey: string;
  valueKind: string;
  valueJson: Prisma.JsonValue;
  valueSchemaKey: string | null;
  sourceId: string | null;
  sourceCanonicalName: string | null;
  effectiveDate: Date | null;
  retrievedAt: Date | null;
  verifiedAt: Date | null;
  freshness: string;
  confidence: string;
  derivationMethod: string;
  reviewStatus: string;
  publicVisibility: string;
};

type EligibilityRow = {
  id: string;
  internalUse: boolean;
  searchEligible: boolean;
  mapEligible: boolean;
  publicPageEligible: boolean;
  indexingEligible: boolean;
  propertyEnrichment: boolean;
  marketAnalytics: boolean;
};

type ReadRows = {
  objects: readonly ColoradoObjectRow[];
  aliases: readonly AliasRow[];
  sources: readonly SourceRow[];
  observations: readonly ObservationRow[];
  eligibility: EligibilityRow | null;
  relationshipCounts: {
    geographicRelationshipCount: number;
    propertyGeographicRelationshipCount: number;
    globalGeographicRelationshipCount: number;
    globalPropertyGeographicRelationshipCount: number;
  };
  thorntonFingerprint: string | null;
};

const SOURCE_NAMES = Object.freeze([
  "State of Colorado",
  "Colorado GIS",
  "U.S. Census Bureau",
  "USGS/GNIS",
  "PROJECT ATLAS - REAL ESTATE DATA TOOLS",
] as const);

const REQUIRED_RECORDS = Object.freeze({
  geographicObjects: 1,
  aliases: GOF_WAVE_3_WRITE_CEILING.aliases,
  sources: GOF_WAVE_3_WRITE_CEILING.sources,
  observations: GOF_WAVE_3_WRITE_CEILING.observations,
  eligibilityRows: GOF_WAVE_3_WRITE_CEILING.eligibilityRows,
  geographicRelationships: 0,
  propertyGeographicRelationships: 0,
});

export async function retrieveGofWave4ColoradoProductionRetrievalReadiness(
  prisma: PrismaClient,
  request: GofWave4ColoradoReadRequest,
): Promise<GofWave4ColoradoReadResult> {
  const retrievalTimestamp = new Date().toISOString();
  const contract = buildGofWave3ColoradoPersistenceContract();
  const requestFailure = validateSubjectAuthorization(request, contract);
  if (requestFailure) {
    return resultFor(request, retrievalTimestamp, "NOT_AUTHORIZED", [requestFailure], null);
  }

  const rows = await readColoradoRows(prisma);
  const failures = evaluateFailures(rows, request, contract);
  const status = statusForFailures(rows, failures);
  const aggregate = failures.length === 0 ? aggregateFor(rows, contract, retrievalTimestamp) : null;
  return resultFor(request, retrievalTimestamp, status, failures, aggregate);
}

function validateSubjectAuthorization(request: GofWave4ColoradoReadRequest, contract: GofWave3ColoradoPersistenceContract): string | null {
  if (request.operation === "canonical-name" && request.canonicalName !== GOF_WAVE_4_CERTIFIED_CANONICAL_NAME) return "CANONICAL_NAME_NOT_AUTHORIZED";
  if (request.operation === "alias") return "ALIAS_LOOKUP_NOT_AUTHORIZED_FOR_WAVE_4";
  if (request.canonicalSlug && request.canonicalSlug !== GOF_WAVE_4_CERTIFIED_SLUG) return "CANONICAL_SLUG_NOT_AUTHORIZED";
  if (request.objectType && request.objectType !== GOF_WAVE_4_CERTIFIED_OBJECT_TYPE) return "OBJECT_TYPE_NOT_AUTHORIZED";
  if (request.certifiedFingerprint && request.certifiedFingerprint !== contract.evidenceFingerprint) return "CERTIFIED_FINGERPRINT_NOT_AUTHORIZED";
  if (request.operation === "aggregate" || request.operation === "health" || request.operation === "object-id" || request.operation === "canonical-name") return null;
  return "OPERATION_NOT_AUTHORIZED";
}

async function readColoradoRows(prisma: PrismaClient): Promise<ReadRows> {
  const objects = await prisma.$queryRaw<readonly ColoradoObjectRow[]>`
    SELECT
      id,
      "objectType"::text AS "objectType",
      "canonicalName",
      "displayName",
      "canonicalSlug",
      "lifecycleStatus"::text AS "lifecycleStatus",
      "visibility"::text AS "visibility",
      "convenienceParentId",
      "mergedIntoId"
    FROM "GeographicObject"
    WHERE "objectType"::text = 'STATE'
      AND ("canonicalSlug" = 'colorado' OR "canonicalName" = 'Colorado')
    ORDER BY id
  `;
  const objectId = objects.length === 1 ? objects[0].id : "";
  const aliases = await prisma.$queryRaw<readonly AliasRow[]>`
    SELECT
      a.id,
      a."aliasText",
      a."normalizedValue",
      a."aliasType"::text AS "aliasType",
      a."language",
      a."lifecycleStatus"::text AS "lifecycleStatus",
      a."sourceId",
      s."canonicalName" AS "sourceCanonicalName",
      a."effectiveDate"
    FROM "GeographicAlias" a
    LEFT JOIN "GeographicSource" s ON s.id = a."sourceId"
    WHERE a."objectId" = ${objectId}
    ORDER BY a."normalizedValue", a."aliasType"::text, a.id
  `;
  const sources = await prisma.$queryRaw<readonly SourceRow[]>`
    SELECT
      id,
      "canonicalName",
      "sourceClass"::text AS "sourceClass",
      "authorityLevel"::text AS "authorityLevel",
      "accessMethod"::text AS "accessMethod",
      "defaultUpdateCadence"::text AS "defaultUpdateCadence",
      "licensingRestriction",
      "publicDisplayRestriction",
      "healthState"::text AS "healthState"
    FROM "GeographicSource"
    WHERE "canonicalName" IN (${Prisma.join(SOURCE_NAMES)})
    ORDER BY "canonicalName"
  `;
  const observations = await prisma.$queryRaw<readonly ObservationRow[]>`
    SELECT
      o.id,
      o."observationKey",
      o."valueKind"::text AS "valueKind",
      o."valueJson",
      o."valueSchemaKey",
      o."sourceId",
      s."canonicalName" AS "sourceCanonicalName",
      o."effectiveDate",
      o."retrievedAt",
      o."verifiedAt",
      o."freshness"::text AS "freshness",
      o."confidence"::text AS "confidence",
      o."derivationMethod"::text AS "derivationMethod",
      o."reviewStatus"::text AS "reviewStatus",
      o."publicVisibility"::text AS "publicVisibility"
    FROM "GeographicObservation" o
    LEFT JOIN "GeographicSource" s ON s.id = o."sourceId"
    WHERE o."objectId" = ${objectId}
    ORDER BY o."observationKey", o.id
  `;
  const [eligibility = null] = await prisma.$queryRaw<readonly EligibilityRow[]>`
    SELECT
      id,
      "internalUse",
      "searchEligible",
      "mapEligible",
      "publicPageEligible",
      "indexingEligible",
      "propertyEnrichment",
      "marketAnalytics"
    FROM "GeographicEligibility"
    WHERE "objectId" = ${objectId}
  `;
  const [relationshipCounts] = await prisma.$queryRaw<readonly [ReadRows["relationshipCounts"]]>`
    SELECT
      (SELECT count(*)::int FROM "GeographicRelationship" WHERE "sourceObjectId" = ${objectId} OR "targetObjectId" = ${objectId}) AS "geographicRelationshipCount",
      (SELECT count(*)::int FROM "PropertyGeographicRelationship" WHERE "geographicObjectId" = ${objectId}) AS "propertyGeographicRelationshipCount",
      (SELECT count(*)::int FROM "GeographicRelationship") AS "globalGeographicRelationshipCount",
      (SELECT count(*)::int FROM "PropertyGeographicRelationship") AS "globalPropertyGeographicRelationshipCount"
  `;
  const [thornton = null] = await prisma.$queryRaw<readonly [{ fingerprint: string }]>`
    SELECT concat_ws('|', id, "objectType"::text, "canonicalName", "canonicalSlug", "lifecycleStatus"::text, "visibility"::text, to_char("updatedAt" AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')) AS fingerprint
    FROM "GeographicObject"
    WHERE id = 'cms10utak0002qa0l8mu7gr8i'
  `;
  return Object.freeze({
    objects,
    aliases,
    sources,
    observations,
    eligibility,
    relationshipCounts,
    thorntonFingerprint: thornton?.fingerprint ?? null,
  });
}

function evaluateFailures(rows: ReadRows, request: GofWave4ColoradoReadRequest, contract: GofWave3ColoradoPersistenceContract): string[] {
  const failures: string[] = [];
  const object = rows.objects[0];
  if (rows.objects.length === 0) failures.push("COLORADO_OBJECT_NOT_FOUND");
  if (rows.objects.length > 1) failures.push("COLORADO_OBJECT_NOT_SINGLETON");
  if (object && request.operation === "object-id" && request.objectId !== object.id) failures.push("OBJECT_ID_NOT_AUTHORIZED");
  if (object && object.objectType !== contract.object.objectType) failures.push("COLORADO_OBJECT_TYPE_MISMATCH");
  if (object && object.canonicalName !== contract.object.canonicalName) failures.push("COLORADO_CANONICAL_NAME_MISMATCH");
  if (object && object.displayName !== contract.object.displayName) failures.push("COLORADO_DISPLAY_NAME_MISMATCH");
  if (object && object.canonicalSlug !== contract.object.canonicalSlug) failures.push("COLORADO_SLUG_MISMATCH");
  if (object && object.lifecycleStatus !== contract.object.lifecycleStatus) failures.push("COLORADO_LIFECYCLE_MISMATCH");
  if (object && object.visibility !== contract.object.visibility) failures.push("COLORADO_VISIBILITY_MISMATCH");
  if (object && object.convenienceParentId !== null) failures.push("COLORADO_CONVENIENCE_PARENT_PRESENT");
  if (object && object.mergedIntoId !== null) failures.push("COLORADO_MERGED_INTO_PRESENT");
  if (!compareAliases(rows.aliases, contract)) failures.push("COLORADO_ALIAS_SET_MISMATCH");
  if (!compareSources(rows.sources, contract)) failures.push("COLORADO_SOURCE_SET_MISMATCH");
  if (!compareObservations(rows.observations, contract)) failures.push("COLORADO_OBSERVATION_SET_MISMATCH");
  if (!compareEligibility(rows.eligibility, contract)) failures.push("COLORADO_ELIGIBILITY_MISMATCH");
  if (rows.relationshipCounts.geographicRelationshipCount !== 0 || rows.relationshipCounts.globalGeographicRelationshipCount !== 0) failures.push("GEOGRAPHIC_RELATIONSHIP_PRESENT");
  if (rows.relationshipCounts.propertyGeographicRelationshipCount !== 0 || rows.relationshipCounts.globalPropertyGeographicRelationshipCount !== 0) failures.push("PROPERTY_GEOGRAPHIC_RELATIONSHIP_PRESENT");
  if (rows.thorntonFingerprint !== GOF_WAVE_3_THORNTON_CERTIFIED_FINGERPRINT) failures.push("THORNTON_FINGERPRINT_CHANGED");
  if (contentFingerprintFor(rows, contract) !== contract.evidenceFingerprint) failures.push("COLORADO_CONTENT_FINGERPRINT_MISMATCH");
  return failures;
}

function compareAliases(rows: readonly AliasRow[], contract: GofWave3ColoradoPersistenceContract): boolean {
  const expected = contract.aliases.map((alias) => canonicalString({
    aliasText: alias.aliasText,
    normalizedValue: alias.normalizedValue,
    aliasType: alias.aliasType,
    language: alias.language,
    lifecycleStatus: alias.lifecycleStatus,
    sourceCanonicalName: alias.sourceRef,
  })).sort();
  const actual = rows.map((alias) => canonicalString({
    aliasText: alias.aliasText,
    normalizedValue: alias.normalizedValue,
    aliasType: alias.aliasType,
    language: alias.language,
    lifecycleStatus: alias.lifecycleStatus,
    sourceCanonicalName: alias.sourceCanonicalName,
  })).sort();
  return arraysEqual(actual, expected);
}

function compareSources(rows: readonly SourceRow[], contract: GofWave3ColoradoPersistenceContract): boolean {
  return arraysEqual(
    rows.map((source) => canonicalString(withoutId(source))).sort(),
    contract.sources.map((source) => canonicalString(source)).sort(),
  );
}

function compareObservations(rows: readonly ObservationRow[], contract: GofWave3ColoradoPersistenceContract): boolean {
  const expected = contract.observations.map((observation) => canonicalString({
    observationKey: observation.observationKey,
    valueKind: observation.valueKind,
    valueSchemaKey: observation.valueSchemaKey,
    valueJson: observation.valueJson,
    sourceCanonicalName: observation.sourceRef,
    freshness: observation.freshness,
    confidence: observation.confidence,
    derivationMethod: observation.derivationMethod,
    reviewStatus: observation.reviewStatus,
    publicVisibility: observation.publicVisibility,
  })).sort();
  const actual = rows.map((observation) => canonicalString({
    observationKey: observation.observationKey,
    valueKind: observation.valueKind,
    valueSchemaKey: observation.valueSchemaKey,
    valueJson: observation.valueJson,
    sourceCanonicalName: observation.sourceCanonicalName,
    freshness: observation.freshness,
    confidence: observation.confidence,
    derivationMethod: observation.derivationMethod,
    reviewStatus: observation.reviewStatus,
    publicVisibility: observation.publicVisibility,
  })).sort();
  return arraysEqual(actual, expected);
}

function compareEligibility(row: EligibilityRow | null, contract: GofWave3ColoradoPersistenceContract): boolean {
  return row !== null && canonicalString(withoutId(row)) === canonicalString(contract.eligibility);
}

function aggregateFor(rows: ReadRows, contract: GofWave3ColoradoPersistenceContract, retrievalTimestamp: string): EnterpriseGeographicReadAggregate {
  const object = rows.objects[0];
  if (!object || !rows.eligibility) throw new Error("Cannot build GOF Wave 4 aggregate without certified Colorado rows.");
  return Object.freeze({
    identity: {
      governedObjectId: object.id,
      objectType: object.objectType,
      canonicalName: object.canonicalName,
      displayName: object.displayName,
      canonicalSlug: object.canonicalSlug,
      canonicalIdentityState: "CERTIFIED_SINGLETON" as const,
      lifecycleState: object.lifecycleStatus,
      visibility: object.visibility,
    },
    aliases: Object.freeze(rows.aliases.map((alias) => Object.freeze({
      aliasId: alias.id,
      aliasValue: alias.aliasText,
      normalizedValue: alias.normalizedValue,
      aliasType: alias.aliasType,
      canonicalAssociation: object.id,
      lifecycleState: alias.lifecycleStatus,
      language: alias.language,
      sourceId: alias.sourceId,
      effectiveDate: alias.effectiveDate?.toISOString() ?? null,
      confidenceMetadata: "CERTIFIED_BY_SPRINT_6_PILOT" as const,
    }))),
    sources: Object.freeze(rows.sources.map((source) => Object.freeze({
      sourceId: source.id,
      sourceIdentity: source.canonicalName,
      sourceClass: source.sourceClass,
      authority: source.authorityLevel,
      accessMethod: source.accessMethod,
      updateCadence: source.defaultUpdateCadence,
      licensingRestriction: source.licensingRestriction,
      publicDisplayRestriction: source.publicDisplayRestriction,
      healthState: source.healthState,
      verificationMetadata: "CERTIFIED_BY_SPRINT_6_PILOT" as const,
    }))),
    observations: Object.freeze(rows.observations.map((observation) => Object.freeze({
      observationId: observation.id,
      schemaKey: observation.valueSchemaKey,
      observationKey: observation.observationKey,
      governedValue: observation.valueJson,
      knowledgeClassification: observation.valueSchemaKey ?? observation.observationKey,
      confidence: observation.confidence,
      freshness: observation.freshness,
      derivationMethod: observation.derivationMethod,
      sourceReference: observation.sourceId,
      effectiveDate: observation.effectiveDate?.toISOString() ?? null,
      retrievedAt: observation.retrievedAt?.toISOString() ?? null,
      verifiedAt: observation.verifiedAt?.toISOString() ?? null,
      internalOnly: observation.publicVisibility === "INTERNAL_ONLY",
      reviewStatus: observation.reviewStatus,
    }))),
    eligibility: {
      eligibilityId: rows.eligibility.id,
      internalUse: rows.eligibility.internalUse,
      searchEligibility: rows.eligibility.searchEligible,
      mapEligibility: rows.eligibility.mapEligible,
      publicPageEligibility: rows.eligibility.publicPageEligible,
      indexingEligibility: rows.eligibility.indexingEligible,
      propertyEnrichment: rows.eligibility.propertyEnrichment,
      marketAnalytics: rows.eligibility.marketAnalytics,
      allActivationFlagsFalse: Object.values(withoutId(rows.eligibility)).every((value) => value === false),
    },
    relationships: {
      geographicRelationshipCount: 0,
      propertyGeographicRelationshipCount: 0,
    },
    governance: {
      persistedLineage: { candidateFingerprint: contract.evidenceFingerprint, sourceCandidateId: contract.sourceCandidateId },
      governedExternalLineage: {
        sprint3QualityState: "READY" as const,
        sprint4ReadinessReference: "GOF_WAVE_2_COLORADO_GOVERNED_INSTANCE_FOUNDATION",
        sprint5ApprovalReference: "GOF_WAVE_2_APPROVED_FOR_DEFINED_NEXT_STEP",
        sprint6AuthorizationReference: "GOF_WAVE_3C_CERTIFIED_AND_CLOSED",
        sprint6CertificationStatus: "PRODUCTION_PERSISTED_IDEMPOTENCY_VERIFIED",
        sprint6A1CertificationStatus: "NOT_APPLICABLE_TO_GOF_WAVE_4",
        sourceGmaLineage: "GOF Wave 2 governed evidence persisted by GOF Wave 3C.",
      },
      productionPilotVersion: "GOF_1.0_WAVE_3C_CONTROLLED_COLORADO_PRODUCTION_PERSISTENCE_EXECUTION",
      adapterVersion: GOF_WAVE_4_ADAPTER_VERSION,
      retrievalTimestamp,
    },
    activation: {
      runtime: false as const,
      customer: false as const,
      search: false as const,
      map: false as const,
      publicPage: false as const,
      indexing: false as const,
      analytics: false as const,
      ai: false as const,
      propertyRelationship: false as const,
    },
  });
}

function resultFor(
  request: GofWave4ColoradoReadRequest,
  retrievalTimestamp: string,
  status: EnterpriseGeographicReadStatus,
  blockingFailures: readonly string[],
  aggregate: EnterpriseGeographicReadAggregate | null,
): GofWave4ColoradoReadResult {
  const foundRecords = aggregate ? {
    geographicObjects: 1,
    aliases: aggregate.aliases.length,
    sources: aggregate.sources.length,
    observations: aggregate.observations.length,
    eligibilityRows: 1,
    geographicRelationships: aggregate.relationships.geographicRelationshipCount,
    propertyGeographicRelationships: aggregate.relationships.propertyGeographicRelationshipCount,
  } : zeroFoundRecords();
  return Object.freeze({
    success: status === "HEALTHY",
    module: "gof-wave-4-colorado-production-retrieval-readiness-adapter" as const,
    version: GOF_WAVE_4_ADAPTER_VERSION,
    authorization: GOF_WAVE_4_AUTHORIZATION,
    mode: "read" as const,
    operation: request.operation,
    executed: false as const,
    writesPerformed: 0 as const,
    requestId: request.requestId ?? null,
    retrievalTimestamp,
    status,
    requiredRecords: REQUIRED_RECORDS,
    foundRecords: Object.freeze(foundRecords),
    warnings: Object.freeze(status === "HEALTHY" ? ["Colorado production retrieval readiness is internal only; enterprise consumption and runtime activation remain unauthorized."] : ["GOF Wave 4 adapter failed closed."]),
    blockingFailures: Object.freeze([...blockingFailures]),
    invariantResults: {
      canonicalIdentity: aggregate?.identity.objectType === GOF_WAVE_4_CERTIFIED_OBJECT_TYPE && aggregate.identity.canonicalSlug === GOF_WAVE_4_CERTIFIED_SLUG,
      eligibility: aggregate?.eligibility.allActivationFlagsFalse === true,
      relationships: aggregate?.relationships.geographicRelationshipCount === 0 && aggregate.relationships.propertyGeographicRelationshipCount === 0,
      rowCounts: recordsMatch(foundRecords),
      authorizedLookup: !blockingFailures.some((failure) => failure.includes("NOT_AUTHORIZED")),
      noActivation: aggregate ? Object.values(aggregate.activation).every((value) => value === false) : false,
    },
    resolution: {
      requestedValue: request.objectId ?? request.canonicalName ?? request.canonicalSlug ?? null,
      resolvedBy: request.operation,
      resolvedObjectId: aggregate?.identity.governedObjectId ?? null,
    },
    aggregate,
  });
}

function statusForFailures(rows: ReadRows, failures: readonly string[]): EnterpriseGeographicReadStatus {
  if (failures.length === 0) return "HEALTHY";
  if (failures.some((failure) => failure.includes("NOT_AUTHORIZED"))) return "NOT_AUTHORIZED";
  if (failures.includes("COLORADO_OBJECT_NOT_FOUND")) return "NOT_FOUND";
  if (rows.objects.length > 1) return "CONFLICT";
  return "INVARIANT_VIOLATION";
}

function contentFingerprintFor(rows: ReadRows, contract: GofWave3ColoradoPersistenceContract): string {
  if (rows.objects.length !== 1) return "NO_SINGLETON";
  const object = rows.objects[0];
  const exactObject = object.objectType === contract.object.objectType &&
    object.canonicalName === contract.object.canonicalName &&
    object.displayName === contract.object.displayName &&
    object.canonicalSlug === contract.object.canonicalSlug &&
    object.lifecycleStatus === contract.object.lifecycleStatus &&
    object.visibility === contract.object.visibility &&
    object.convenienceParentId === contract.object.convenienceParentId &&
    object.mergedIntoId === contract.object.mergedIntoId;
  return exactObject &&
    compareAliases(rows.aliases, contract) &&
    compareSources(rows.sources, contract) &&
    compareObservations(rows.observations, contract) &&
    compareEligibility(rows.eligibility, contract)
    ? contract.evidenceFingerprint
    : createHash("sha256").update(canonicalString(rows)).digest("hex");
}

function canonicalString(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((item) => canonicalString(item)).sort().join(",")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${canonicalString(record[key])}`).join(",")}}`;
}

function withoutId<T extends { id: string }>(value: T): Omit<T, "id"> {
  const { id, ...rest } = value;
  void id;
  return rest;
}

function arraysEqual(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function recordsMatch(found: Readonly<Record<string, number>>) {
  return Object.entries(REQUIRED_RECORDS).every(([key, value]) => found[key] === value);
}

function zeroFoundRecords(): Readonly<Record<string, number>> {
  return Object.freeze({
    geographicObjects: 0,
    aliases: 0,
    sources: 0,
    observations: 0,
    eligibilityRows: 0,
    geographicRelationships: 0,
    propertyGeographicRelationships: 0,
  });
}
