import {
  ENTERPRISE_GEOGRAPHIC_READ_CERTIFIED_SUBJECT_ID,
  ENTERPRISE_GEOGRAPHIC_READ_CONTRACT_VERSION,
  type EnterpriseGeographicReadOperation,
  type EnterpriseGeographicReadRequest,
  type EnterpriseGeographicReadResult,
  type EnterpriseGeographicReadSource,
  type EnterpriseGeographicReadStatus,
} from "../enterprise-knowledge/geographicReadContract.js";

export const EKCP_SPRINT_1_ADAPTER_VERSION = "EKCP_1.0_SPRINT_1_ENTERPRISE_GEOGRAPHIC_CONSUMER_ADAPTER_V1";
export const EKCP_SPRINT_1_AUTHORIZATION = "EKCP_1.0_SPRINT_1_ENTERPRISE_GEOGRAPHIC_CONSUMER_ADAPTER";

export type EkcpEnterpriseConsumer = "SEARCH" | "MAPS" | "PROPERTY_INTELLIGENCE" | "AI" | "EXECUTIVE_INTELLIGENCE" | "FUTURE_ENTERPRISE_SERVICE";
export type EkcpConsumerIntent = "PLACE_PROFILE" | "GOVERNANCE_SUMMARY" | "ACTIVATION_BOUNDARY";
export type EkcpPlaceLookupMethod = "CERTIFIED_SUBJECT_ID" | "CANONICAL_PLACE_NAME" | "APPROVED_ALIAS" | "CERTIFIED_AGGREGATE";
export type EkcpPlaceLookup = Readonly<{
  certifiedSubjectId?: string;
  canonicalPlaceName?: string;
  approvedAlias?: string;
}>;

export type EkcpEnterpriseGeographicConsumerRequest = Readonly<{
  consumer: EkcpEnterpriseConsumer;
  intent: EkcpConsumerIntent;
  place: EkcpPlaceLookup;
  requestId?: string;
}>;

export type EkcpEnterpriseGeographicConsumerResult = Readonly<{
  success: boolean;
  module: "ekcp-sprint-1-enterprise-geographic-consumer-adapter";
  version: typeof EKCP_SPRINT_1_ADAPTER_VERSION;
  authorization: typeof EKCP_SPRINT_1_AUTHORIZATION;
  mode: "consumer-read";
  executed: false;
  writesPerformed: 0;
  requestId: string | null;
  retrievalTimestamp: string;
  consumer: EkcpEnterpriseConsumer;
  intent: EkcpConsumerIntent;
  subject: {
    certifiedSubjectOnly: true;
    subjectId: string | null;
    placeName: string | null;
    placeType: string | null;
    displayName: string | null;
  };
  placeProfile: {
    knownAs: readonly string[];
    sourceSummary: readonly string[];
    evidenceStatements: readonly {
      key: string;
      value: unknown;
      confidence: string;
      freshness: string;
      internalOnly: true;
    }[];
  } | null;
  governanceBoundaries: {
    qualityIsReadiness: false;
    readinessIsApproval: false;
    approvalIsActivation: false;
    persistenceIsConsumption: false;
    consumptionIsCustomerVisibility: false;
  };
  activationBoundary: {
    runtimeActivated: false;
    customerVisible: false;
    searchIntegrated: false;
    mapIntegrated: false;
    propertyIntelligenceIntegrated: false;
    aiIntegrated: false;
    executiveIntelligenceIntegrated: false;
  };
  readSource: {
    contractVersion: typeof ENTERPRISE_GEOGRAPHIC_READ_CONTRACT_VERSION;
    lookupMethod: EkcpPlaceLookupMethod;
    status: EnterpriseGeographicReadStatus;
    subjectId: string | null;
  };
  warnings: readonly string[];
  blockingFailures: readonly string[];
}>;

export function createEkcpEnterpriseGeographicConsumerAdapter(readProductionGeography: EnterpriseGeographicReadSource) {
  return Object.freeze({
    readPlaceForEnterpriseConsumer(request: EkcpEnterpriseGeographicConsumerRequest) {
      return readEkcpEnterpriseGeographicConsumerAdapter(readProductionGeography, request);
    },
  });
}

export async function readEkcpEnterpriseGeographicConsumerAdapter(
  readProductionGeography: EnterpriseGeographicReadSource,
  request: EkcpEnterpriseGeographicConsumerRequest,
): Promise<EkcpEnterpriseGeographicConsumerResult> {
  const sourceRequest = productionReadRequestFor(request);
  const sourceResult = await readProductionGeography(sourceRequest);
  return consumerResultFor(request, sourceResult);
}

function productionReadRequestFor(request: EkcpEnterpriseGeographicConsumerRequest): EnterpriseGeographicReadRequest {
  if (request.place.certifiedSubjectId) {
    return {
      operation: "object-id",
      objectId: request.place.certifiedSubjectId,
      requestId: request.requestId,
    };
  }
  if (request.place.canonicalPlaceName) {
    return {
      operation: "canonical-name",
      canonicalName: request.place.canonicalPlaceName,
      requestId: request.requestId,
    };
  }
  if (request.place.approvedAlias) {
    return {
      operation: "alias",
      alias: request.place.approvedAlias,
      requestId: request.requestId,
    };
  }
  return {
    operation: "aggregate",
    requestId: request.requestId,
  };
}

function consumerResultFor(
  request: EkcpEnterpriseGeographicConsumerRequest,
  sourceResult: EnterpriseGeographicReadResult,
): EkcpEnterpriseGeographicConsumerResult {
  const aggregate = sourceResult.success ? sourceResult.aggregate : null;
  const activationBoundary = activationBoundaryFor();
  const blockingFailures = [
    ...sourceResult.blockingFailures,
    ...consumerActivationFailures(activationBoundary),
  ];

  return Object.freeze({
    success: sourceResult.success && aggregate !== null && blockingFailures.length === 0,
    module: "ekcp-sprint-1-enterprise-geographic-consumer-adapter" as const,
    version: EKCP_SPRINT_1_ADAPTER_VERSION,
    authorization: EKCP_SPRINT_1_AUTHORIZATION,
    mode: "consumer-read" as const,
    executed: false as const,
    writesPerformed: 0 as const,
    requestId: request.requestId ?? sourceResult.requestId,
    retrievalTimestamp: sourceResult.retrievalTimestamp,
    consumer: request.consumer,
    intent: request.intent,
    subject: {
      certifiedSubjectOnly: true as const,
      subjectId: aggregate?.identity.governedObjectId ?? null,
      placeName: aggregate?.identity.canonicalName ?? null,
      placeType: aggregate?.identity.objectType ?? null,
      displayName: aggregate?.identity.displayName ?? null,
    },
    placeProfile: aggregate ? {
      knownAs: Object.freeze(aggregate.aliases.map((alias) => alias.aliasValue)),
      sourceSummary: Object.freeze(aggregate.sources.map((source) => source.sourceIdentity)),
      evidenceStatements: Object.freeze(aggregate.observations.map((observation) => Object.freeze({
        key: observation.observationKey,
        value: observation.governedValue,
        confidence: observation.confidence,
        freshness: observation.freshness,
        internalOnly: true as const,
      }))),
    } : null,
    governanceBoundaries: governanceBoundaries(),
    activationBoundary,
    readSource: {
      contractVersion: ENTERPRISE_GEOGRAPHIC_READ_CONTRACT_VERSION as typeof ENTERPRISE_GEOGRAPHIC_READ_CONTRACT_VERSION,
      lookupMethod: lookupMethodFor(sourceResult.operation),
      status: sourceResult.status,
      subjectId: sourceResult.resolution.resolvedObjectId,
    },
    warnings: Object.freeze([...sourceResult.warnings]),
    blockingFailures: Object.freeze(blockingFailures),
  });
}

function governanceBoundaries(): EkcpEnterpriseGeographicConsumerResult["governanceBoundaries"] {
  return Object.freeze({
    qualityIsReadiness: false as const,
    readinessIsApproval: false as const,
    approvalIsActivation: false as const,
    persistenceIsConsumption: false as const,
    consumptionIsCustomerVisibility: false as const,
  });
}

function activationBoundaryFor(): EkcpEnterpriseGeographicConsumerResult["activationBoundary"] {
  return Object.freeze({
    runtimeActivated: false as const,
    customerVisible: false as const,
    searchIntegrated: false as const,
    mapIntegrated: false as const,
    propertyIntelligenceIntegrated: false as const,
    aiIntegrated: false as const,
    executiveIntelligenceIntegrated: false as const,
  });
}

function lookupMethodFor(operation: EnterpriseGeographicReadOperation): EkcpPlaceLookupMethod {
  if (operation === "object-id") return "CERTIFIED_SUBJECT_ID";
  if (operation === "canonical-name") return "CANONICAL_PLACE_NAME";
  if (operation === "alias") return "APPROVED_ALIAS";
  return "CERTIFIED_AGGREGATE";
}

function consumerActivationFailures(boundary: EkcpEnterpriseGeographicConsumerResult["activationBoundary"]): string[] {
  return Object.entries(boundary)
    .filter(([, value]) => value !== false)
    .map(([key]) => `EKCP_CONSUMER_ACTIVATION_BOUNDARY_VIOLATION:${key}`);
}

export function assertEkcpSprint1CertifiedSubject(result: EkcpEnterpriseGeographicConsumerResult): boolean {
  return result.subject.subjectId === ENTERPRISE_GEOGRAPHIC_READ_CERTIFIED_SUBJECT_ID
    && result.subject.certifiedSubjectOnly === true
    && result.executed === false
    && result.writesPerformed === 0
    && Object.values(result.activationBoundary).every((value) => value === false)
    && Object.values(result.governanceBoundaries).every((value) => value === false);
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/ekcp/enterpriseGeographicConsumerAdapter.ts
