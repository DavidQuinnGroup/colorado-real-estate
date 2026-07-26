import type { PrismaClient } from "@prisma/client";

import type {
  EnterpriseGeographicReadAggregate,
  EnterpriseGeographicReadOperation,
  EnterpriseGeographicReadRequest,
  EnterpriseGeographicReadResult,
  EnterpriseGeographicReadStatus,
} from "../enterprise-knowledge/geographicReadContract.js";

import { normalizeGioLookupValue } from "../gio/persistence.js";

export const EIP_SPRINT_7_ADAPTER_VERSION = "EIP_1.0_SPRINT_7_PRODUCTION_INTERNAL_GEOGRAPHIC_READ_ADAPTER_V1";
export const EIP_SPRINT_7_AUTHORIZATION = "EIP_1.0_SPRINT_7_PRODUCTION_INTERNAL_GEOGRAPHIC_READ_ADAPTER";
export const EIP_SPRINT_7_CERTIFIED_OBJECT_ID = "cms10utak0002qa0l8mu7gr8i";
export const EIP_SPRINT_7_CERTIFIED_CANONICAL_NAME = "Thornton";
export const EIP_SPRINT_7_CERTIFIED_DISPLAY_NAME = "Thornton, Colorado";
export const EIP_SPRINT_7_CERTIFIED_SLUG = "thornton-colorado";
export const EIP_SPRINT_7_CERTIFIED_OBJECT_TYPE = "MUNICIPALITY";
export const EIP_SPRINT_7_CERTIFIED_SCOPE = "PRODUCTION_INTERNAL_GEOGRAPHIC_READ_ADAPTER";

const SPRINT_6_SOURCE_NAME = "PROJECT ATLAS Sprint 6 Thornton Controlled Production-Internal Pilot Evidence";
const EXPECTED_ALIASES = Object.freeze([
  normalizeGioLookupValue("Thornton"),
  normalizeGioLookupValue("City of Thornton"),
]);
const EXPECTED_OBSERVATION_KEYS = Object.freeze([
  "approval_lineage",
  "approved_internal_identity_assertion",
  "canonical_municipality_name",
  "municipality_classification",
  "runtime_isolation_assertion",
  "state_association",
]);

export type EipSprint7ReadOperation = EnterpriseGeographicReadOperation;
export type EipSprint7AdapterHealth = EnterpriseGeographicReadStatus;
export type EipSprint7ReadRequest = EnterpriseGeographicReadRequest;
export type EipSprint7ReadResult = EnterpriseGeographicReadResult & Readonly<{
  module: "eip-sprint-7-production-internal-geographic-read-adapter";
  version: typeof EIP_SPRINT_7_ADAPTER_VERSION;
  authorization: typeof EIP_SPRINT_7_AUTHORIZATION;
}>;
export type EipSprint7Aggregate = EnterpriseGeographicReadAggregate;

type RawAggregate = Awaited<ReturnType<typeof readCertifiedThorntonRows>>;

const REQUIRED_RECORDS = Object.freeze({
  geographicObjects: 1,
  aliases: 2,
  sources: 1,
  observations: 6,
  eligibilityRows: 1,
  geographicRelationships: 0,
  propertyGeographicRelationships: 0,
});

export async function retrieveEipSprint7ProductionInternalGeographicReadAdapter(
  prisma: PrismaClient,
  request: EipSprint7ReadRequest,
): Promise<EipSprint7ReadResult> {
  const retrievalTimestamp = new Date().toISOString();
  const authorizationFailure = validateAuthorizedLookup(request);
  if (authorizationFailure) {
    return resultFor(request, retrievalTimestamp, "NOT_AUTHORIZED", [authorizationFailure], null);
  }

  const rows = await readCertifiedThorntonRows(prisma);
  const failures = evaluateInvariantFailures(rows, request);
  const status = statusForFailures(rows, failures);
  const aggregate = failures.length === 0 ? aggregateFor(rows, retrievalTimestamp) : null;

  return resultFor(request, retrievalTimestamp, status, failures, aggregate);
}

export async function readEipSprint7AdapterHealth(prisma: PrismaClient, requestId?: string): Promise<EipSprint7ReadResult> {
  return retrieveEipSprint7ProductionInternalGeographicReadAdapter(prisma, {
    operation: "health",
    requestId,
  });
}

function validateAuthorizedLookup(request: EipSprint7ReadRequest): string | null {
  if (request.operation === "object-id") {
    return request.objectId === EIP_SPRINT_7_CERTIFIED_OBJECT_ID ? null : "OBJECT_ID_NOT_AUTHORIZED";
  }
  if (request.operation === "canonical-name") {
    return normalizeGioLookupValue(request.canonicalName ?? "") === normalizeGioLookupValue(EIP_SPRINT_7_CERTIFIED_CANONICAL_NAME)
      ? null
      : "CANONICAL_NAME_NOT_AUTHORIZED";
  }
  if (request.operation === "alias") {
    return EXPECTED_ALIASES.includes(normalizeGioLookupValue(request.alias ?? "")) ? null : "ALIAS_NOT_AUTHORIZED";
  }
  if (request.operation === "aggregate" || request.operation === "health") return null;
  return "OPERATION_NOT_AUTHORIZED";
}

async function readCertifiedThorntonRows(prisma: PrismaClient) {
  const object = await prisma.geographicObject.findUnique({
    where: { id: EIP_SPRINT_7_CERTIFIED_OBJECT_ID },
    select: {
      id: true,
      objectType: true,
      canonicalName: true,
      displayName: true,
      canonicalSlug: true,
      lifecycleStatus: true,
      visibility: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const canonicalMatches = await prisma.geographicObject.findMany({
    where: {
      objectType: EIP_SPRINT_7_CERTIFIED_OBJECT_TYPE,
      OR: [
        { id: EIP_SPRINT_7_CERTIFIED_OBJECT_ID },
        { canonicalSlug: EIP_SPRINT_7_CERTIFIED_SLUG },
        { canonicalName: { equals: EIP_SPRINT_7_CERTIFIED_CANONICAL_NAME, mode: "insensitive" } },
        { displayName: { equals: EIP_SPRINT_7_CERTIFIED_DISPLAY_NAME, mode: "insensitive" } },
      ],
    },
    select: { id: true },
  });

  const aliases = object ? await prisma.geographicAlias.findMany({
    where: { objectId: object.id },
    select: {
      id: true,
      aliasText: true,
      normalizedValue: true,
      aliasType: true,
      lifecycleStatus: true,
      language: true,
      sourceId: true,
      effectiveDate: true,
    },
    orderBy: [{ aliasType: "asc" }, { aliasText: "asc" }],
  }) : [];

  const source = await prisma.geographicSource.findUnique({
    where: { canonicalName: SPRINT_6_SOURCE_NAME },
    select: {
      id: true,
      canonicalName: true,
      sourceClass: true,
      authorityLevel: true,
      accessMethod: true,
      defaultUpdateCadence: true,
      licensingRestriction: true,
      publicDisplayRestriction: true,
      healthState: true,
    },
  });

  const observations = object ? await prisma.geographicObservation.findMany({
    where: { objectId: object.id },
    select: {
      id: true,
      observationKey: true,
      valueKind: true,
      valueText: true,
      valueNumber: true,
      valueBoolean: true,
      valueDate: true,
      valueJson: true,
      valueSchemaKey: true,
      sourceId: true,
      effectiveDate: true,
      retrievedAt: true,
      verifiedAt: true,
      freshness: true,
      confidence: true,
      derivationMethod: true,
      reviewStatus: true,
      publicVisibility: true,
    },
    orderBy: { observationKey: "asc" },
  }) : [];

  const eligibility = object ? await prisma.geographicEligibility.findUnique({
    where: { objectId: object.id },
    select: {
      id: true,
      internalUse: true,
      searchEligible: true,
      mapEligible: true,
      publicPageEligible: true,
      indexingEligible: true,
      propertyEnrichment: true,
      marketAnalytics: true,
    },
  }) : null;

  const geographicRelationshipCount = object ? await prisma.geographicRelationship.count({
    where: { OR: [{ sourceObjectId: object.id }, { targetObjectId: object.id }] },
  }) : 0;
  const propertyGeographicRelationshipCount = object ? await prisma.propertyGeographicRelationship.count({
    where: { geographicObjectId: object.id },
  }) : 0;

  return Object.freeze({
    object,
    canonicalMatches,
    aliases,
    source,
    observations,
    eligibility,
    geographicRelationshipCount,
    propertyGeographicRelationshipCount,
  });
}

function evaluateInvariantFailures(rows: RawAggregate, request: EipSprint7ReadRequest): string[] {
  const failures: string[] = [];
  if (!rows.object) failures.push("CERTIFIED_OBJECT_NOT_FOUND");
  if (rows.canonicalMatches.length !== 1) failures.push("CANONICAL_IDENTITY_NOT_SINGLETON");
  if (rows.object && rows.object.id !== EIP_SPRINT_7_CERTIFIED_OBJECT_ID) failures.push("CERTIFIED_OBJECT_ID_MISMATCH");
  if (rows.object && rows.object.objectType !== EIP_SPRINT_7_CERTIFIED_OBJECT_TYPE) failures.push("CERTIFIED_OBJECT_TYPE_MISMATCH");
  if (rows.object && rows.object.canonicalName !== EIP_SPRINT_7_CERTIFIED_CANONICAL_NAME) failures.push("CERTIFIED_CANONICAL_NAME_MISMATCH");
  if (rows.object && rows.object.displayName !== EIP_SPRINT_7_CERTIFIED_DISPLAY_NAME) failures.push("CERTIFIED_DISPLAY_NAME_MISMATCH");
  if (rows.object && rows.object.canonicalSlug !== EIP_SPRINT_7_CERTIFIED_SLUG) failures.push("CERTIFIED_SLUG_MISMATCH");
  if (rows.object && rows.object.lifecycleStatus !== "DRAFT") failures.push("CERTIFIED_LIFECYCLE_NOT_DRAFT");
  if (rows.object && rows.object.visibility !== "INTERNAL_ONLY") failures.push("CERTIFIED_VISIBILITY_NOT_INTERNAL_ONLY");
  if (rows.aliases.length !== REQUIRED_RECORDS.aliases) failures.push("CERTIFIED_ALIAS_COUNT_MISMATCH");
  if (!EXPECTED_ALIASES.every((alias) => rows.aliases.some((row) => row.normalizedValue === alias))) failures.push("CERTIFIED_ALIAS_SET_MISMATCH");
  if (!rows.source) failures.push("CERTIFIED_SOURCE_NOT_FOUND");
  if (rows.observations.length !== REQUIRED_RECORDS.observations) failures.push("CERTIFIED_OBSERVATION_COUNT_MISMATCH");
  if (!EXPECTED_OBSERVATION_KEYS.every((key) => rows.observations.some((row) => row.observationKey === key))) failures.push("CERTIFIED_OBSERVATION_SET_MISMATCH");
  if (!rows.eligibility) failures.push("CERTIFIED_ELIGIBILITY_NOT_FOUND");
  if (rows.eligibility && Object.entries(rows.eligibility).some(([key, value]) => key !== "id" && value === true)) failures.push("CERTIFIED_ELIGIBILITY_FLAG_TRUE");
  if (rows.geographicRelationshipCount !== 0) failures.push("GEOGRAPHIC_RELATIONSHIP_PRESENT");
  if (rows.propertyGeographicRelationshipCount !== 0) failures.push("PROPERTY_GEOGRAPHIC_RELATIONSHIP_PRESENT");
  if (request.operation === "alias" && !rows.aliases.some((row) => row.normalizedValue === normalizeGioLookupValue(request.alias ?? ""))) failures.push("ALIAS_DID_NOT_RESOLVE_TO_CERTIFIED_OBJECT");
  return failures;
}

function statusForFailures(rows: RawAggregate, failures: readonly string[]): EipSprint7AdapterHealth {
  if (failures.length === 0) return "HEALTHY";
  if (failures.includes("CERTIFIED_OBJECT_NOT_FOUND")) return "NOT_FOUND";
  if (failures.some((failure) => failure.includes("RELATIONSHIP") || failure.includes("ELIGIBILITY") || failure.includes("MISMATCH"))) return "INVARIANT_VIOLATION";
  if (rows.canonicalMatches.length > 1) return "CONFLICT";
  return "INCOMPLETE";
}

function aggregateFor(rows: RawAggregate, retrievalTimestamp: string): EipSprint7Aggregate {
  if (!rows.object || !rows.source || !rows.eligibility) throw new Error("Cannot build Sprint 7 aggregate without certified rows.");
  const approvalLineage = rows.observations.find((item) => item.observationKey === "approval_lineage")?.valueJson ?? null;

  return Object.freeze({
    identity: {
      governedObjectId: rows.object.id,
      objectType: rows.object.objectType,
      canonicalName: rows.object.canonicalName,
      displayName: rows.object.displayName,
      canonicalSlug: rows.object.canonicalSlug,
      canonicalIdentityState: "CERTIFIED_SINGLETON" as const,
      lifecycleState: rows.object.lifecycleStatus,
      visibility: rows.object.visibility,
    },
    aliases: Object.freeze(rows.aliases.map((alias) => Object.freeze({
      aliasId: alias.id,
      aliasValue: alias.aliasText,
      normalizedValue: alias.normalizedValue,
      aliasType: alias.aliasType,
      canonicalAssociation: rows.object!.id,
      lifecycleState: alias.lifecycleStatus,
      language: alias.language,
      sourceId: alias.sourceId,
      effectiveDate: alias.effectiveDate?.toISOString() ?? null,
      confidenceMetadata: "CERTIFIED_BY_SPRINT_6_PILOT" as const,
    }))),
    sources: Object.freeze([Object.freeze({
      sourceId: rows.source.id,
      sourceIdentity: rows.source.canonicalName,
      sourceClass: rows.source.sourceClass,
      authority: rows.source.authorityLevel,
      accessMethod: rows.source.accessMethod,
      updateCadence: rows.source.defaultUpdateCadence,
      licensingRestriction: rows.source.licensingRestriction,
      publicDisplayRestriction: rows.source.publicDisplayRestriction,
      healthState: rows.source.healthState,
      verificationMetadata: "CERTIFIED_BY_SPRINT_6_PILOT" as const,
    })]),
    observations: Object.freeze(rows.observations.map((observation) => Object.freeze({
      observationId: observation.id,
      schemaKey: observation.valueSchemaKey,
      observationKey: observation.observationKey,
      governedValue: valueForObservation(observation),
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
      allActivationFlagsFalse: Object.entries(rows.eligibility).every(([key, value]) => key === "id" || value === false),
    },
    relationships: {
      geographicRelationshipCount: 0,
      propertyGeographicRelationshipCount: 0,
    },
    governance: {
      persistedLineage: approvalLineage,
      governedExternalLineage: {
        sprint3QualityState: "READY",
        sprint4ReadinessReference: "EIP_1.0_SPRINT_4_INTERNAL_GEOGRAPHIC_ACTIVATION_READINESS_LEDGER_CERTIFIED_AND_CLOSED",
        sprint5ApprovalReference: "EIP_1.0_SPRINT_5_ENTERPRISE_KNOWLEDGE_APPROVAL_SYSTEM_CERTIFIED_AND_CLOSED",
        sprint6AuthorizationReference: "EIP_1.0_SPRINT_6_CONTROLLED_PRODUCTION_INTERNAL_GEOGRAPHIC_PERSISTENCE_PILOT_CERTIFIED_AND_CLOSED",
        sprint6CertificationStatus: "EIP_1.0_SPRINT_6_CONTROLLED_PRODUCTION_INTERNAL_GEOGRAPHIC_PERSISTENCE_PILOT_CERTIFIED_AND_CLOSED",
        sprint6A1CertificationStatus: "EIP_1.0_SPRINT_6A_1_RUNTIME_DEPENDENCY_SEPARATION_CORRECTION_CERTIFIED_AND_CLOSED",
        sourceGmaLineage: "Persisted in Sprint 6 observations from certified Sprint 1-5 and GMA fixture lineage.",
      },
      productionPilotVersion: "EIP_1.0_SPRINT_6_CONTROLLED_PRODUCTION_INTERNAL_GEOGRAPHIC_PERSISTENCE_PILOT_V1",
      adapterVersion: EIP_SPRINT_7_ADAPTER_VERSION,
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
  request: EipSprint7ReadRequest,
  retrievalTimestamp: string,
  status: EipSprint7AdapterHealth,
  blockingFailures: readonly string[],
  aggregate: EipSprint7Aggregate | null,
): EipSprint7ReadResult {
  const foundRecords = aggregate ? {
    geographicObjects: 1,
    aliases: aggregate.aliases.length,
    sources: aggregate.sources.length,
    observations: aggregate.observations.length,
    eligibilityRows: 1,
    geographicRelationships: aggregate.relationships.geographicRelationshipCount,
    propertyGeographicRelationships: aggregate.relationships.propertyGeographicRelationshipCount,
  } : {
    geographicObjects: 0,
    aliases: 0,
    sources: 0,
    observations: 0,
    eligibilityRows: 0,
    geographicRelationships: 0,
    propertyGeographicRelationships: 0,
  };

  return Object.freeze({
    success: status === "HEALTHY",
    module: "eip-sprint-7-production-internal-geographic-read-adapter" as const,
    version: EIP_SPRINT_7_ADAPTER_VERSION,
    authorization: EIP_SPRINT_7_AUTHORIZATION,
    mode: "read" as const,
    operation: request.operation,
    executed: false as const,
    writesPerformed: 0 as const,
    requestId: request.requestId ?? null,
    retrievalTimestamp,
    status,
    requiredRecords: REQUIRED_RECORDS,
    foundRecords: Object.freeze(foundRecords),
    warnings: Object.freeze(status === "HEALTHY" ? [] : ["Sprint 7 adapter failed closed."]),
    blockingFailures: Object.freeze([...blockingFailures]),
    invariantResults: {
      canonicalIdentity: aggregate?.identity.governedObjectId === EIP_SPRINT_7_CERTIFIED_OBJECT_ID,
      eligibility: aggregate?.eligibility.allActivationFlagsFalse === true,
      relationships: aggregate?.relationships.geographicRelationshipCount === 0 && aggregate.relationships.propertyGeographicRelationshipCount === 0,
      rowCounts: recordsMatch(foundRecords),
      authorizedLookup: blockingFailures.includes("OBJECT_ID_NOT_AUTHORIZED") || blockingFailures.includes("CANONICAL_NAME_NOT_AUTHORIZED") || blockingFailures.includes("ALIAS_NOT_AUTHORIZED") ? false : true,
      noActivation: aggregate ? Object.values(aggregate.activation).every((value) => value === false) : false,
    },
    resolution: {
      requestedValue: request.objectId ?? request.canonicalName ?? request.alias ?? null,
      resolvedBy: request.operation,
      resolvedObjectId: aggregate?.identity.governedObjectId ?? null,
    },
    aggregate,
  });
}

function valueForObservation(observation: RawAggregate["observations"][number]) {
  if (observation.valueJson !== null) return observation.valueJson;
  if (observation.valueText !== null) return observation.valueText;
  if (observation.valueNumber !== null) return Number(observation.valueNumber);
  if (observation.valueBoolean !== null) return observation.valueBoolean;
  if (observation.valueDate !== null) return observation.valueDate.toISOString();
  return null;
}

function recordsMatch(found: Readonly<Record<string, number>>) {
  return Object.entries(REQUIRED_RECORDS).every(([key, value]) => found[key] === value);
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/eip/productionInternalGeographicReadAdapter.ts
