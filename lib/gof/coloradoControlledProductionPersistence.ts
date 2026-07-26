import { createHash } from "node:crypto";

import {
  GOF_WAVE_2_COLORADO_CANDIDATE_ID,
  GOF_WAVE_2_VERSION,
  buildGofWave2ColoradoGovernedInstanceFoundation,
  type GofWave2ColoradoFoundation,
} from "./coloradoGovernedInstanceFoundation.js";
import { GIO_SAFE_ELIGIBILITY_DEFAULTS, buildGioObjectIdempotencyKey, validateGioObjectCreateInput } from "../gio/persistence.js";

export const GOF_WAVE_3_VERSION = "GOF_1.0_WAVE_3_CONTROLLED_COLORADO_PRODUCTION_PERSISTENCE_V1";
export const GOF_WAVE_3_AUTHORIZATION_SCOPE = "GOF_WAVE_3_CONTROLLED_COLORADO_PRODUCTION_PERSISTENCE_ACTIVATION";
export const GOF_WAVE_3_THORNTON_CERTIFIED_FINGERPRINT =
  "cms10utak0002qa0l8mu7gr8i|MUNICIPALITY|Thornton|thornton-colorado|DRAFT|INTERNAL_ONLY|2026-07-25T23:50:19.341Z";

export type GofWave3PersistenceMode = "dry-run" | "execute";

export type GofWave3PlannedWriteCounts = Readonly<{
  geographicObjects: number;
  aliases: number;
  sources: number;
  observations: number;
  eligibilityRows: number;
  relationships: number;
  propertyRelationships: number;
}>;

export const GOF_WAVE_3_WRITE_CEILING: GofWave3PlannedWriteCounts = Object.freeze({
  geographicObjects: 1,
  aliases: 2,
  sources: 5,
  observations: 5,
  eligibilityRows: 1,
  relationships: 0,
  propertyRelationships: 0,
});

export type GofWave3ProposedObjectRecord = Readonly<{
  id: "DATABASE_GENERATED_ON_AUTHORIZED_EXECUTION";
  objectType: "STATE";
  canonicalName: "Colorado";
  displayName: "Colorado";
  canonicalSlug: "colorado";
  lifecycleStatus: "DRAFT";
  visibility: "INTERNAL_ONLY";
  convenienceParentId: null;
  mergedIntoId: null;
  idempotencyKey: "GIO_OBJECT|STATE|colorado";
}>;

export type GofWave3ProposedAliasRecord = Readonly<{
  aliasText: "CO" | "State of Colorado";
  normalizedValue: "co" | "state of colorado";
  aliasType: "COMMON" | "LEGAL";
  language: "en-US";
  lifecycleStatus: "ACTIVE";
  sourceRef: string;
}>;

export type GofWave3ProposedSourceRecord = Readonly<{
  canonicalName: string;
  sourceClass: "GOVERNMENT";
  authorityLevel: "AUTHORITATIVE" | "SUPPORTING";
  accessMethod: "MANUAL" | "PUBLIC_WEB";
  defaultUpdateCadence: "STATIC" | "ANNUAL" | "EVENT_DRIVEN";
  licensingRestriction: boolean;
  publicDisplayRestriction: true;
  healthState: "READY";
}>;

export type GofWave3ProposedObservationRecord = Readonly<{
  observationKey: string;
  valueKind: "JSON";
  valueSchemaKey: "gof.wave3.colorado.evidence.v1";
  valueJson: Readonly<Record<string, string | boolean>>;
  sourceRef: string;
  freshness: "FRESH";
  confidence: "HIGH";
  derivationMethod: "SOURCE_REPORTED";
  reviewStatus: "REVIEWED";
  publicVisibility: "INTERNAL_ONLY";
}>;

export type GofWave3ProposedEligibilityRecord = Readonly<typeof GIO_SAFE_ELIGIBILITY_DEFAULTS>;

export type GofWave3ColoradoPersistenceContract = Readonly<{
  version: typeof GOF_WAVE_3_VERSION;
  sourceFoundationVersion: typeof GOF_WAVE_2_VERSION;
  sourceCandidateId: typeof GOF_WAVE_2_COLORADO_CANDIDATE_ID;
  modeDefault: "dry-run";
  object: GofWave3ProposedObjectRecord;
  aliases: readonly GofWave3ProposedAliasRecord[];
  sources: readonly GofWave3ProposedSourceRecord[];
  observations: readonly GofWave3ProposedObservationRecord[];
  eligibility: GofWave3ProposedEligibilityRecord;
  plannedWriteCeiling: GofWave3PlannedWriteCounts;
  relationshipsAuthorized: false;
  productionRetrievalAuthorized: false;
  runtimeActivationAuthorized: false;
  customerVisibilityAuthorized: false;
  evidenceFingerprint: string;
}>;

export type GofWave3ExistingColoradoObject = Readonly<{
  id: string;
  objectType: string;
  canonicalName: string;
  displayName: string;
  canonicalSlug: string;
  lifecycleStatus: string;
  visibility: string;
  convenienceParentId: string | null;
  mergedIntoId: string | null;
}>;

export type GofWave3ProductionState = Readonly<{
  geographicObjectCount: number;
  stateObjectCount: number;
  coloradoNamedObjectCount: number;
  geographicRelationshipCount: number;
  propertyGeographicRelationshipCount: number;
  matchingColoradoObject: GofWave3ExistingColoradoObject | null;
  matchingColoradoSupportState: "NONE" | "COMPLETE" | "PARTIAL_OR_CONFLICTING";
  stateEnumPresent: boolean;
  thorntonFingerprint: string | null;
}>;

export type GofWave3DryRunStatus =
  | "DRY_RUN_READY"
  | "DRY_RUN_IDEMPOTENT_NOOP"
  | "BLOCKED_SCHEMA_OR_DATA_MISMATCH";

export type GofWave3DryRunResult = Readonly<{
  status: GofWave3DryRunStatus;
  contract: GofWave3ColoradoPersistenceContract;
  dryRun: true;
  writesPerformed: GofWave3PlannedWriteCounts;
  proposedWritesIfAuthorized: GofWave3PlannedWriteCounts;
  blockingFailures: readonly string[];
  warnings: readonly string[];
}>;

export type GofWave3ExecutionAuthorization = Readonly<{
  authorized: true;
  authorizationScope: typeof GOF_WAVE_3_AUTHORIZATION_SCOPE;
  authorizationId: string;
  operator: string;
  authorizedAt: string;
}>;

export type GofWave3ExecutionPlan = Readonly<{
  mode: "execute";
  authorization: GofWave3ExecutionAuthorization;
  contract: GofWave3ColoradoPersistenceContract;
  plannedWrites: GofWave3PlannedWriteCounts;
  executionSafety: "PURE_PLAN_ONLY_NO_DATABASE_CLIENT";
}>;

const zeroWrites: GofWave3PlannedWriteCounts = Object.freeze({
  geographicObjects: 0,
  aliases: 0,
  sources: 0,
  observations: 0,
  eligibilityRows: 0,
  relationships: 0,
  propertyRelationships: 0,
});

export function buildGofWave3ColoradoPersistenceContract(): GofWave3ColoradoPersistenceContract {
  const foundation = buildGofWave2ColoradoGovernedInstanceFoundation();
  validateWave2FoundationForPersistencePlanning(foundation);
  const object = buildObjectRecord(foundation);
  const aliases = buildAliasRecords();
  const sources = buildSourceRecords(foundation);
  const observations = buildObservationRecords(foundation);

  return Object.freeze({
    version: GOF_WAVE_3_VERSION,
    sourceFoundationVersion: GOF_WAVE_2_VERSION,
    sourceCandidateId: GOF_WAVE_2_COLORADO_CANDIDATE_ID,
    modeDefault: "dry-run",
    object,
    aliases,
    sources,
    observations,
    eligibility: Object.freeze({ ...GIO_SAFE_ELIGIBILITY_DEFAULTS }),
    plannedWriteCeiling: GOF_WAVE_3_WRITE_CEILING,
    relationshipsAuthorized: false,
    productionRetrievalAuthorized: false,
    runtimeActivationAuthorized: false,
    customerVisibilityAuthorized: false,
    evidenceFingerprint: fingerprintStable({
      object,
      aliases,
      sources,
      observations,
      eligibility: GIO_SAFE_ELIGIBILITY_DEFAULTS,
      sourceCandidateId: GOF_WAVE_2_COLORADO_CANDIDATE_ID,
    }),
  });
}

export function evaluateGofWave3DryRun(productionState: GofWave3ProductionState): GofWave3DryRunResult {
  const contract = buildGofWave3ColoradoPersistenceContract();
  const blockingFailures = findProductionStateFailures(productionState, contract);
  const idempotentNoop = productionState.matchingColoradoObject
    ? isExactColoradoObject(productionState.matchingColoradoObject, contract.object) &&
      productionState.matchingColoradoSupportState === "COMPLETE"
    : false;
  const status: GofWave3DryRunStatus = blockingFailures.length > 0
    ? "BLOCKED_SCHEMA_OR_DATA_MISMATCH"
    : idempotentNoop
      ? "DRY_RUN_IDEMPOTENT_NOOP"
      : "DRY_RUN_READY";

  return Object.freeze({
    status,
    contract,
    dryRun: true,
    writesPerformed: zeroWrites,
    proposedWritesIfAuthorized: status === "DRY_RUN_READY" ? contract.plannedWriteCeiling : zeroWrites,
    blockingFailures: Object.freeze(blockingFailures),
    warnings: Object.freeze(status === "DRY_RUN_READY" ? ["Production write remains unauthorized; dry-run only."] : []),
  });
}

export function assertGofWave3ExecutionAuthorization(
  authorization?: Partial<GofWave3ExecutionAuthorization> | null,
): asserts authorization is GofWave3ExecutionAuthorization {
  if (!authorization?.authorized) {
    throw new Error("GOF Wave 3 execution requires explicit authorization.");
  }
  if (authorization.authorizationScope !== GOF_WAVE_3_AUTHORIZATION_SCOPE) {
    throw new Error("GOF Wave 3 execution authorization scope mismatch.");
  }
  if (!authorization.authorizationId?.trim()) {
    throw new Error("GOF Wave 3 execution authorization id is required.");
  }
  if (!authorization.operator?.trim()) {
    throw new Error("GOF Wave 3 execution operator is required.");
  }
  if (!authorization.authorizedAt?.trim()) {
    throw new Error("GOF Wave 3 execution authorization timestamp is required.");
  }
}

export function planGofWave3AuthorizedExecution(
  productionState: GofWave3ProductionState,
  authorization?: Partial<GofWave3ExecutionAuthorization> | null,
): GofWave3ExecutionPlan {
  assertGofWave3ExecutionAuthorization(authorization);
  const dryRun = evaluateGofWave3DryRun(productionState);
  if (dryRun.status === "BLOCKED_SCHEMA_OR_DATA_MISMATCH") {
    throw new Error(`GOF Wave 3 execution blocked: ${dryRun.blockingFailures.join("; ")}`);
  }
  return Object.freeze({
    mode: "execute",
    authorization,
    contract: dryRun.contract,
    plannedWrites: dryRun.proposedWritesIfAuthorized,
    executionSafety: "PURE_PLAN_ONLY_NO_DATABASE_CLIENT",
  });
}

function validateWave2FoundationForPersistencePlanning(foundation: GofWave2ColoradoFoundation): void {
  if (foundation.identity.enterpriseCandidateId !== GOF_WAVE_2_COLORADO_CANDIDATE_ID) {
    throw new Error("GOF Wave 3 only accepts the certified Wave 2 Colorado candidate.");
  }
  if (foundation.identity.objectType !== "STATE" || foundation.identity.canonicalSlug !== "colorado") {
    throw new Error("GOF Wave 3 candidate identity mismatch.");
  }
  if (foundation.approvalDecision.decision !== "APPROVED_FOR_DEFINED_NEXT_STEP") {
    throw new Error("GOF Wave 3 requires the Wave 2 defined-next-step approval.");
  }
  if (foundation.approvalDecision.productionPersistenceAuthorized !== false) {
    throw new Error("Wave 2 must not directly authorize production persistence.");
  }
}

function buildObjectRecord(foundation: GofWave2ColoradoFoundation): GofWave3ProposedObjectRecord {
  const validated = validateGioObjectCreateInput({
    objectType: foundation.identity.objectType,
    canonicalName: foundation.identity.canonicalName,
    displayName: foundation.identity.displayName,
    canonicalSlug: foundation.identity.canonicalSlug,
  });

  return Object.freeze({
    id: "DATABASE_GENERATED_ON_AUTHORIZED_EXECUTION",
    objectType: "STATE",
    canonicalName: "Colorado",
    displayName: "Colorado",
    canonicalSlug: "colorado",
    lifecycleStatus: "DRAFT",
    visibility: "INTERNAL_ONLY",
    convenienceParentId: null,
    mergedIntoId: null,
    idempotencyKey: buildGioObjectIdempotencyKey(validated) as "GIO_OBJECT|STATE|colorado",
  });
}

function buildAliasRecords(): readonly GofWave3ProposedAliasRecord[] {
  return Object.freeze([
    Object.freeze({
      aliasText: "CO",
      normalizedValue: "co",
      aliasType: "COMMON",
      language: "en-US",
      lifecycleStatus: "ACTIVE",
      sourceRef: "State of Colorado",
    }),
    Object.freeze({
      aliasText: "State of Colorado",
      normalizedValue: "state of colorado",
      aliasType: "LEGAL",
      language: "en-US",
      lifecycleStatus: "ACTIVE",
      sourceRef: "State of Colorado",
    }),
  ]);
}

function buildSourceRecords(foundation: GofWave2ColoradoFoundation): readonly GofWave3ProposedSourceRecord[] {
  const byProvider = new Map(foundation.evidence.map((item) => [item.provider, item]));
  return Object.freeze([
    source("State of Colorado", "AUTHORITATIVE", "EVENT_DRIVEN", byProvider),
    source("Colorado GIS", "SUPPORTING", "ANNUAL", byProvider),
    source("U.S. Census Bureau", "AUTHORITATIVE", "ANNUAL", byProvider),
    source("USGS/GNIS", "SUPPORTING", "ANNUAL", byProvider),
    Object.freeze({
      canonicalName: "PROJECT ATLAS - REAL ESTATE DATA TOOLS",
      sourceClass: "GOVERNMENT",
      authorityLevel: "SUPPORTING",
      accessMethod: "MANUAL",
      defaultUpdateCadence: "STATIC",
      licensingRestriction: false,
      publicDisplayRestriction: true,
      healthState: "READY",
    }),
  ]);
}

function source(
  provider: GofWave3ProposedSourceRecord["canonicalName"],
  authorityLevel: GofWave3ProposedSourceRecord["authorityLevel"],
  defaultUpdateCadence: GofWave3ProposedSourceRecord["defaultUpdateCadence"],
  byProvider: Map<string, unknown>,
): GofWave3ProposedSourceRecord {
  if (!byProvider.has(provider)) throw new Error(`Missing Wave 2 evidence provider: ${provider}`);
  return Object.freeze({
    canonicalName: provider,
    sourceClass: "GOVERNMENT",
    authorityLevel,
    accessMethod: "PUBLIC_WEB",
    defaultUpdateCadence,
    licensingRestriction: false,
    publicDisplayRestriction: true,
    healthState: "READY",
  });
}

function buildObservationRecords(foundation: GofWave2ColoradoFoundation): readonly GofWave3ProposedObservationRecord[] {
  return Object.freeze(foundation.evidence.map((item) => Object.freeze({
    observationKey: `gof.wave3.colorado.${item.evidenceType.toLocaleLowerCase("en-US")}.${item.sourceIdentifier.toLocaleLowerCase("en-US")}`,
    valueKind: "JSON",
    valueSchemaKey: "gof.wave3.colorado.evidence.v1",
    valueJson: Object.freeze({
      evidenceId: item.evidenceId,
      provider: item.provider,
      sourceIdentifier: item.sourceIdentifier,
      authorityDomain: item.authorityDomain,
      evidenceType: item.evidenceType,
      sourceValue: item.sourceValue,
      conflictStatus: item.conflictStatus,
      productionEligible: item.productionEligible,
    }),
    sourceRef: item.provider,
    freshness: "FRESH",
    confidence: "HIGH",
    derivationMethod: "SOURCE_REPORTED",
    reviewStatus: "REVIEWED",
    publicVisibility: "INTERNAL_ONLY",
  })));
}

function findProductionStateFailures(
  state: GofWave3ProductionState,
  contract: GofWave3ColoradoPersistenceContract,
): string[] {
  const failures: string[] = [];
  if (state.thorntonFingerprint !== GOF_WAVE_3_THORNTON_CERTIFIED_FINGERPRINT) {
    failures.push("Thornton certified production fingerprint changed.");
  }
  if (!state.stateEnumPresent) {
    failures.push("Production GeographicObjectType enum does not expose STATE.");
  }
  if (state.geographicRelationshipCount !== 0) {
    failures.push("GeographicRelationship rows exist; Wave 3 authorizes no relationship changes.");
  }
  if (state.propertyGeographicRelationshipCount !== 0) {
    failures.push("PropertyGeographicRelationship rows exist; Wave 3 authorizes no property relationship changes.");
  }
  if (state.matchingColoradoObject && !isExactColoradoObject(state.matchingColoradoObject, contract.object)) {
    failures.push("Existing Colorado STATE row does not match the Wave 3 contract.");
  }
  if (state.matchingColoradoObject && state.matchingColoradoSupportState !== "COMPLETE") {
    failures.push("Existing Colorado STATE row has partial or conflicting companion persistence state.");
  }
  if (!state.matchingColoradoObject && state.matchingColoradoSupportState !== "NONE") {
    failures.push("Colorado companion persistence rows exist without the governed Colorado STATE object.");
  }
  if (!state.matchingColoradoObject && state.stateObjectCount !== 0) {
    failures.push("Unexpected STATE object exists outside the Wave 3 Colorado contract.");
  }
  if (!state.matchingColoradoObject && state.coloradoNamedObjectCount !== 0) {
    failures.push("Unexpected Colorado-named object exists outside the Wave 3 Colorado contract.");
  }
  return failures;
}

function isExactColoradoObject(
  existing: GofWave3ExistingColoradoObject,
  proposed: GofWave3ProposedObjectRecord,
): boolean {
  return existing.objectType === proposed.objectType &&
    existing.canonicalName === proposed.canonicalName &&
    existing.displayName === proposed.displayName &&
    existing.canonicalSlug === proposed.canonicalSlug &&
    existing.lifecycleStatus === proposed.lifecycleStatus &&
    existing.visibility === proposed.visibility &&
    existing.convenienceParentId === proposed.convenienceParentId &&
    existing.mergedIntoId === proposed.mergedIntoId;
}

function fingerprintStable(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}
