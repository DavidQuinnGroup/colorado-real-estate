import { createHash } from "node:crypto";

import {
  ENTERPRISE_GEOGRAPHIC_READ_CONTRACT_VERSION,
  type EnterpriseGeographicReadAggregate,
  type EnterpriseGeographicReadResult,
} from "../enterprise-knowledge/geographicReadContract.js";
import {
  GOF_WAVE_4_ADAPTER_VERSION,
  GOF_WAVE_4_AUTHORIZATION,
  GOF_WAVE_4_CERTIFIED_CANONICAL_NAME,
  GOF_WAVE_4_CERTIFIED_OBJECT_TYPE,
  GOF_WAVE_4_CERTIFIED_SLUG,
  type GofWave4ColoradoReadResult,
} from "../gof/coloradoProductionRetrievalReadinessAdapter.js";

export const EKCP_SPRINT_2R_ADAPTER_VERSION = "EKCP_1.0_SPRINT_2R_COLORADO_ENTERPRISE_GEOGRAPHIC_CONSUMPTION_READINESS_V1";
export const EKCP_SPRINT_2R_AUTHORIZATION = "EKCP_1.0_SPRINT_2R_COLORADO_ENTERPRISE_GEOGRAPHIC_CONSUMPTION_READINESS";
export const EKCP_SPRINT_2R_STATUS = "CERTIFIED_ENTERPRISE_CONSUMPTION_READY";
export const EKCP_SPRINT_2R_CONSUMPTION_STATE = "ENTERPRISE_CONSUMPTION_READY_NOT_RUNTIME_ENABLED";
export const EKCP_SPRINT_2R_REQUIRED_READ_FINGERPRINT = "280b283ba101707b2fb0a85b801db2ce6220c2f56fa7f232d2d0dd6396bb2719";

const REQUIRED_ALIASES = Object.freeze([
  "COMMON|co|CO|ACTIVE|en-US",
  "LEGAL|state of colorado|State of Colorado|ACTIVE|en-US",
] as const);
const REQUIRED_SOURCE_IDENTITIES = Object.freeze([
  "Colorado GIS",
  "PROJECT ATLAS - REAL ESTATE DATA TOOLS",
  "State of Colorado",
  "U.S. Census Bureau",
  "USGS/GNIS",
] as const);

export type EkcpSprint2rConsumptionReadinessStatus =
  | "READY_FOR_ENTERPRISE_CONSUMPTION_PROOF"
  | "NOT_AUTHORIZED"
  | "INCOMPLETE"
  | "INVARIANT_VIOLATION";

export type EkcpSprint2rColoradoConsumptionRequest = Readonly<{
  requestId?: string;
  authorizationSubject: "COLORADO_STATE";
}>;

export type EkcpSprint2rColoradoEnterpriseConsumerModel = Readonly<{
  enterpriseSubject: {
    subjectKey: "STATE:colorado";
    productionObjectId: string;
    objectType: "STATE";
    canonicalName: "Colorado";
    displayName: "Colorado";
    canonicalSlug: "colorado";
  };
  stateSemantics: {
    geographicObjectClass: "STATE";
    municipalitySemanticsApplied: false;
    hierarchyTraversalAvailable: false;
    relationshipInferenceAvailable: false;
  };
  lifecycle: {
    lifecycleState: "DRAFT";
    visibility: "INTERNAL_ONLY";
  };
  aliases: readonly {
    value: string;
    normalizedValue: string;
    type: string;
    lifecycleState: string;
    language: string | null;
  }[];
  authoritySources: readonly {
    sourceIdentity: string;
    sourceClass: string;
    authority: string;
    accessMethod: string;
    healthState: string;
    publicDisplayRestricted: boolean;
  }[];
  governedEvidence: readonly {
    key: string;
    classification: string;
    value: unknown;
    confidence: string;
    freshness: string;
    internalOnly: true;
    reviewStatus: string;
  }[];
  eligibility: {
    internalUse: false;
    searchEligible: false;
    mapEligible: false;
    publicPageEligible: false;
    indexingEligible: false;
    propertyEnrichment: false;
    marketAnalytics: false;
    allActivationFlagsFalse: true;
  };
  relationships: {
    geographicRelationshipCount: 0;
    propertyGeographicRelationshipCount: 0;
    relationshipConsumptionEnabled: false;
    hierarchyStatus: "NOT_AUTHORIZED";
  };
  provenance: {
    readContractVersion: typeof ENTERPRISE_GEOGRAPHIC_READ_CONTRACT_VERSION;
    readAdapterModule: "gof-wave-4-colorado-production-retrieval-readiness-adapter";
    readAdapterVersion: typeof GOF_WAVE_4_ADAPTER_VERSION;
    readAuthorization: typeof GOF_WAVE_4_AUTHORIZATION;
    consumerAdapterVersion: typeof EKCP_SPRINT_2R_ADAPTER_VERSION;
    productionObjectId: string;
    sourceCandidateFingerprint: typeof EKCP_SPRINT_2R_REQUIRED_READ_FINGERPRINT;
    sourceCandidateId: string | null;
    readContentFingerprint: typeof EKCP_SPRINT_2R_REQUIRED_READ_FINGERPRINT;
  };
  authorization: {
    consumptionReadiness: "READY_FOR_ENTERPRISE_CONSUMPTION_PROOF";
    enterpriseConsumptionReady: true;
    runtimeEnabled: false;
    customerVisible: false;
    relationshipConsumptionEnabled: false;
    searchIntegrated: false;
    mapsIntegrated: false;
    propertyIntelligenceIntegrated: false;
    aiIntegrated: false;
    executiveIntelligenceIntegrated: false;
  };
  contentFingerprint: string;
}>;

export type EkcpSprint2rColoradoConsumptionResult = Readonly<{
  success: boolean;
  module: "ekcp-sprint-2r-colorado-enterprise-geographic-consumption-readiness";
  version: typeof EKCP_SPRINT_2R_ADAPTER_VERSION;
  authorization: typeof EKCP_SPRINT_2R_AUTHORIZATION;
  mode: "consumer-transform";
  executed: false;
  writesPerformed: 0;
  requestId: string | null;
  status: EkcpSprint2rConsumptionReadinessStatus;
  consumptionState: typeof EKCP_SPRINT_2R_CONSUMPTION_STATE;
  runtimeEnabled: false;
  customerVisible: false;
  relationshipConsumptionEnabled: false;
  model: EkcpSprint2rColoradoEnterpriseConsumerModel | null;
  warnings: readonly string[];
  blockingFailures: readonly string[];
}>;

export function readEkcpSprint2rColoradoEnterpriseGeographicConsumptionReadiness(
  sourceResult: unknown,
  request: EkcpSprint2rColoradoConsumptionRequest,
): EkcpSprint2rColoradoConsumptionResult {
  const requestFailures = validateRequest(request);
  if (requestFailures.length > 0) return resultFor(request, requestFailures, null);
  if (!isWave4ColoradoReadResult(sourceResult)) return resultFor(request, ["SOURCE_RESULT_MALFORMED_OR_UNAUTHORIZED"], null);

  const failures = validateSourceResult(sourceResult);
  const model = failures.length === 0 && sourceResult.aggregate ? modelFor(sourceResult, sourceResult.aggregate) : null;
  return resultFor(request, failures, model);
}

export function assertEkcpSprint2rColoradoConsumptionReady(result: EkcpSprint2rColoradoConsumptionResult): boolean {
  return result.success === true
    && result.status === "READY_FOR_ENTERPRISE_CONSUMPTION_PROOF"
    && result.consumptionState === EKCP_SPRINT_2R_CONSUMPTION_STATE
    && result.runtimeEnabled === false
    && result.customerVisible === false
    && result.relationshipConsumptionEnabled === false
    && result.model?.enterpriseSubject.subjectKey === "STATE:colorado"
    && result.model.authorization.enterpriseConsumptionReady === true
    && result.model.authorization.runtimeEnabled === false
    && result.model.authorization.customerVisible === false
    && result.model.authorization.relationshipConsumptionEnabled === false;
}

function validateRequest(request: EkcpSprint2rColoradoConsumptionRequest): string[] {
  return request.authorizationSubject === "COLORADO_STATE" ? [] : ["COLORADO_CONSUMPTION_SUBJECT_NOT_AUTHORIZED"];
}

function isWave4ColoradoReadResult(value: unknown): value is GofWave4ColoradoReadResult {
  if (value === null || typeof value !== "object") return false;
  const result = value as Partial<EnterpriseGeographicReadResult>;
  return result.module === "gof-wave-4-colorado-production-retrieval-readiness-adapter"
    && result.version === GOF_WAVE_4_ADAPTER_VERSION
    && result.authorization === GOF_WAVE_4_AUTHORIZATION
    && result.mode === "read";
}

function validateSourceResult(result: GofWave4ColoradoReadResult): string[] {
  const failures = [...result.blockingFailures];
  const aggregate = result.aggregate;
  if (!result.success || result.status !== "HEALTHY") failures.push("SOURCE_READ_NOT_HEALTHY");
  if (result.executed !== false || result.writesPerformed !== 0) failures.push("SOURCE_READ_MUTATION_DETECTED");
  if (!aggregate) failures.push("SOURCE_AGGREGATE_MISSING");
  if (aggregate && aggregate.identity.objectType !== GOF_WAVE_4_CERTIFIED_OBJECT_TYPE) failures.push("COLORADO_OBJECT_TYPE_MISMATCH");
  if (aggregate && aggregate.identity.canonicalName !== GOF_WAVE_4_CERTIFIED_CANONICAL_NAME) failures.push("COLORADO_CANONICAL_NAME_MISMATCH");
  if (aggregate && aggregate.identity.displayName !== GOF_WAVE_4_CERTIFIED_CANONICAL_NAME) failures.push("COLORADO_DISPLAY_NAME_MISMATCH");
  if (aggregate && aggregate.identity.canonicalSlug !== GOF_WAVE_4_CERTIFIED_SLUG) failures.push("COLORADO_SLUG_MISMATCH");
  if (aggregate && aggregate.identity.lifecycleState !== "DRAFT") failures.push("COLORADO_LIFECYCLE_NOT_DRAFT");
  if (aggregate && aggregate.identity.visibility !== "INTERNAL_ONLY") failures.push("COLORADO_VISIBILITY_NOT_INTERNAL_ONLY");
  if (aggregate && aggregate.aliases.length !== 2) failures.push("COLORADO_ALIAS_COUNT_MISMATCH");
  if (aggregate && !arraysEqual(aggregate.aliases.map((alias) => `${alias.aliasType}|${alias.normalizedValue}|${alias.aliasValue}|${alias.lifecycleState}|${alias.language ?? ""}`).sort(), [...REQUIRED_ALIASES])) failures.push("COLORADO_ALIAS_SET_MISMATCH");
  if (aggregate && aggregate.sources.length !== 5) failures.push("COLORADO_SOURCE_COUNT_MISMATCH");
  if (aggregate && !arraysEqual(aggregate.sources.map((source) => source.sourceIdentity).sort(), [...REQUIRED_SOURCE_IDENTITIES])) failures.push("COLORADO_SOURCE_SET_MISMATCH");
  if (aggregate && aggregate.observations.length !== 5) failures.push("COLORADO_OBSERVATION_COUNT_MISMATCH");
  if (aggregate && !aggregate.observations.every(isGovernedColoradoObservation)) failures.push("COLORADO_OBSERVATION_SET_MISMATCH");
  if (aggregate && !aggregate.eligibility.allActivationFlagsFalse) failures.push("COLORADO_ELIGIBILITY_ACTIVATION_FLAG_TRUE");
  if (aggregate && eligibilityValues(aggregate).some((value) => value !== false)) failures.push("COLORADO_ELIGIBILITY_DRIFT");
  if (aggregate && (aggregate.relationships.geographicRelationshipCount !== 0 || aggregate.relationships.propertyGeographicRelationshipCount !== 0)) failures.push("COLORADO_RELATIONSHIP_PRESENT");
  if (aggregate && Object.values(aggregate.activation).some((value) => value !== false)) failures.push("SOURCE_RUNTIME_OR_CUSTOMER_ACTIVATION_PRESENT");
  if (aggregate && candidateFingerprint(aggregate) !== EKCP_SPRINT_2R_REQUIRED_READ_FINGERPRINT) failures.push("COLORADO_FINGERPRINT_MISMATCH");
  return [...new Set(failures)];
}

function modelFor(
  result: GofWave4ColoradoReadResult,
  aggregate: EnterpriseGeographicReadAggregate,
): EkcpSprint2rColoradoEnterpriseConsumerModel {
  const aliases = aggregate.aliases
    .map((alias) => ({
      value: alias.aliasValue,
      normalizedValue: alias.normalizedValue,
      type: alias.aliasType,
      lifecycleState: alias.lifecycleState,
      language: alias.language,
    }))
    .sort((left, right) => `${left.normalizedValue}:${left.type}`.localeCompare(`${right.normalizedValue}:${right.type}`));
  const authoritySources = aggregate.sources
    .map((source) => ({
      sourceIdentity: source.sourceIdentity,
      sourceClass: source.sourceClass,
      authority: source.authority,
      accessMethod: source.accessMethod,
      healthState: source.healthState,
      publicDisplayRestricted: source.publicDisplayRestriction,
    }))
    .sort((left, right) => left.sourceIdentity.localeCompare(right.sourceIdentity));
  const governedEvidence = aggregate.observations
    .map((observation) => ({
      key: observation.observationKey,
      classification: observation.knowledgeClassification,
      value: observation.governedValue,
      confidence: observation.confidence,
      freshness: observation.freshness,
      internalOnly: true as const,
      reviewStatus: observation.reviewStatus,
    }))
    .sort((left, right) => left.key.localeCompare(right.key));

  const unsigned = {
    enterpriseSubject: {
      subjectKey: "STATE:colorado" as const,
      productionObjectId: aggregate.identity.governedObjectId,
      objectType: "STATE" as const,
      canonicalName: "Colorado" as const,
      displayName: "Colorado" as const,
      canonicalSlug: "colorado" as const,
    },
    stateSemantics: {
      geographicObjectClass: "STATE" as const,
      municipalitySemanticsApplied: false as const,
      hierarchyTraversalAvailable: false as const,
      relationshipInferenceAvailable: false as const,
    },
    lifecycle: {
      lifecycleState: "DRAFT" as const,
      visibility: "INTERNAL_ONLY" as const,
    },
    aliases: Object.freeze(aliases),
    authoritySources: Object.freeze(authoritySources),
    governedEvidence: Object.freeze(governedEvidence),
    eligibility: {
      internalUse: false as const,
      searchEligible: false as const,
      mapEligible: false as const,
      publicPageEligible: false as const,
      indexingEligible: false as const,
      propertyEnrichment: false as const,
      marketAnalytics: false as const,
      allActivationFlagsFalse: true as const,
    },
    relationships: {
      geographicRelationshipCount: 0 as const,
      propertyGeographicRelationshipCount: 0 as const,
      relationshipConsumptionEnabled: false as const,
      hierarchyStatus: "NOT_AUTHORIZED" as const,
    },
    provenance: {
      readContractVersion: ENTERPRISE_GEOGRAPHIC_READ_CONTRACT_VERSION as typeof ENTERPRISE_GEOGRAPHIC_READ_CONTRACT_VERSION,
      readAdapterModule: result.module,
      readAdapterVersion: result.version,
      readAuthorization: result.authorization,
      consumerAdapterVersion: EKCP_SPRINT_2R_ADAPTER_VERSION as typeof EKCP_SPRINT_2R_ADAPTER_VERSION,
      productionObjectId: aggregate.identity.governedObjectId,
      sourceCandidateFingerprint: EKCP_SPRINT_2R_REQUIRED_READ_FINGERPRINT as typeof EKCP_SPRINT_2R_REQUIRED_READ_FINGERPRINT,
      sourceCandidateId: sourceCandidateId(aggregate),
      readContentFingerprint: EKCP_SPRINT_2R_REQUIRED_READ_FINGERPRINT as typeof EKCP_SPRINT_2R_REQUIRED_READ_FINGERPRINT,
    },
    authorization: {
      consumptionReadiness: "READY_FOR_ENTERPRISE_CONSUMPTION_PROOF" as const,
      enterpriseConsumptionReady: true as const,
      runtimeEnabled: false as const,
      customerVisible: false as const,
      relationshipConsumptionEnabled: false as const,
      searchIntegrated: false as const,
      mapsIntegrated: false as const,
      propertyIntelligenceIntegrated: false as const,
      aiIntegrated: false as const,
      executiveIntelligenceIntegrated: false as const,
    },
  };

  return Object.freeze({
    ...unsigned,
    contentFingerprint: stableFingerprint(unsigned),
  });
}

function resultFor(
  request: EkcpSprint2rColoradoConsumptionRequest,
  blockingFailures: readonly string[],
  model: EkcpSprint2rColoradoEnterpriseConsumerModel | null,
): EkcpSprint2rColoradoConsumptionResult {
  const status = statusFor(blockingFailures);
  return Object.freeze({
    success: status === "READY_FOR_ENTERPRISE_CONSUMPTION_PROOF" && model !== null,
    module: "ekcp-sprint-2r-colorado-enterprise-geographic-consumption-readiness" as const,
    version: EKCP_SPRINT_2R_ADAPTER_VERSION,
    authorization: EKCP_SPRINT_2R_AUTHORIZATION,
    mode: "consumer-transform" as const,
    executed: false as const,
    writesPerformed: 0 as const,
    requestId: request.requestId ?? null,
    status,
    consumptionState: EKCP_SPRINT_2R_CONSUMPTION_STATE,
    runtimeEnabled: false as const,
    customerVisible: false as const,
    relationshipConsumptionEnabled: false as const,
    model,
    warnings: Object.freeze(["Sprint 2R proves deterministic internal enterprise consumption readiness only; runtime, relationships, and customer visibility remain unauthorized."]),
    blockingFailures: Object.freeze([...blockingFailures]),
  });
}

function statusFor(blockingFailures: readonly string[]): EkcpSprint2rConsumptionReadinessStatus {
  if (blockingFailures.length === 0) return "READY_FOR_ENTERPRISE_CONSUMPTION_PROOF";
  if (blockingFailures.some((failure) => failure.includes("NOT_AUTHORIZED") || failure.includes("UNAUTHORIZED"))) return "NOT_AUTHORIZED";
  if (blockingFailures.some((failure) => failure.includes("MISSING") || failure.includes("COUNT"))) return "INCOMPLETE";
  return "INVARIANT_VIOLATION";
}

function eligibilityValues(aggregate: EnterpriseGeographicReadAggregate): boolean[] {
  return [
    aggregate.eligibility.internalUse,
    aggregate.eligibility.searchEligibility,
    aggregate.eligibility.mapEligibility,
    aggregate.eligibility.publicPageEligibility,
    aggregate.eligibility.indexingEligibility,
    aggregate.eligibility.propertyEnrichment,
    aggregate.eligibility.marketAnalytics,
  ];
}

function isGovernedColoradoObservation(observation: EnterpriseGeographicReadAggregate["observations"][number]): boolean {
  return observation.observationKey.startsWith("gof.wave3.colorado.")
    && observation.knowledgeClassification === "gof.wave3.colorado.evidence.v1"
    && observation.confidence === "HIGH"
    && observation.freshness === "FRESH"
    && observation.derivationMethod === "SOURCE_REPORTED"
    && observation.internalOnly === true
    && observation.reviewStatus === "REVIEWED";
}

function candidateFingerprint(aggregate: EnterpriseGeographicReadAggregate): string | null {
  const lineage = aggregate.governance.persistedLineage;
  return lineage && typeof lineage === "object" && "candidateFingerprint" in lineage
    ? String((lineage as { candidateFingerprint: unknown }).candidateFingerprint)
    : null;
}

function sourceCandidateId(aggregate: EnterpriseGeographicReadAggregate): string | null {
  const lineage = aggregate.governance.persistedLineage;
  return lineage && typeof lineage === "object" && "sourceCandidateId" in lineage
    ? String((lineage as { sourceCandidateId: unknown }).sourceCandidateId)
    : null;
}

function stableFingerprint(value: unknown): string {
  return createHash("sha256").update(canonicalString(value)).digest("hex");
}

function canonicalString(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((item) => canonicalString(item)).sort().join(",")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${canonicalString(record[key])}`).join(",")}}`;
}

function arraysEqual(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/ekcp/coloradoEnterpriseGeographicConsumptionReadiness.ts
