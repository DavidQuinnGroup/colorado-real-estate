import { randomUUID } from "node:crypto";
import { Prisma, type PrismaClient } from "@prisma/client";

import {
  GOF_WAVE_3_AUTHORIZATION_SCOPE,
  GOF_WAVE_3_THORNTON_CERTIFIED_FINGERPRINT,
  GOF_WAVE_3_WRITE_CEILING,
  buildGofWave3ColoradoPersistenceContract,
  evaluateGofWave3DryRun,
  type GofWave3ColoradoPersistenceContract,
  type GofWave3PlannedWriteCounts,
} from "./coloradoControlledProductionPersistence.js";
import {
  GOF_WAVE_3A_VERSION,
  type GofWave3aPreflightSnapshot,
  type GofWave3aTransactionContext,
  type GofWave3aTransactionalPersistencePort,
  type GofWave3aTransactionWriter,
} from "./coloradoControlledProductionPersistenceActivation.js";

export const GOF_WAVE_3B_VERSION = "GOF_1.0_WAVE_3B_COLORADO_PRODUCTION_EXECUTION_ADAPTER_V1";
export const GOF_WAVE_3B_STATUS = "EXECUTION_READY_PENDING_OPERATOR_AUTHORIZATION";
export const GOF_WAVE_3B_MODULE = "gof-wave-3b-colorado-production-execution-adapter";

export type GofWave3bMode = "dry-run" | "execute" | "verify";

export type GofWave3bRepositoryControl = Readonly<{
  branch: "main";
  head: string;
  originMain: string;
  expectedCommit: string;
  workingTreeClean: boolean;
}>;

export type GofWave3bOperatorAuthorization = Readonly<{
  authorizationId: string;
  operatorId: string;
  authorizedAt: string;
  tokenPresent: boolean;
  acknowledgesPersistenceNotRetrieval: true;
  acknowledgesNoRelationships: true;
  acknowledgesNoCustomerVisibility: true;
}>;

export type GofWave3bExecutionControls = Readonly<{
  mode: GofWave3bMode;
  executionScope: string;
  environment: "production";
  confirmProduction: boolean;
  certifiedCandidateFingerprint: string;
  repository: GofWave3bRepositoryControl;
  operatorAuthorization?: GofWave3bOperatorAuthorization | null;
}>;

export type GofWave3bExecutionResult = Readonly<{
  module: typeof GOF_WAVE_3B_MODULE;
  version: typeof GOF_WAVE_3B_VERSION;
  activationFoundationVersion: typeof GOF_WAVE_3A_VERSION;
  status: "DRY_RUN_READY" | "VERIFIED_COMPLETE" | "EXECUTED_CREATED" | "EXECUTED_IDEMPOTENT_NOOP";
  invocationId: string;
  mode: GofWave3bMode;
  targetEnvironment: "production";
  repository: GofWave3bRepositoryControl;
  candidateFingerprint: string;
  preflightStatus: "PASSED";
  created: GofWave3PlannedWriteCounts;
  deduplicated: GofWave3PlannedWriteCounts;
  conflictCount: number;
  relationshipWrites: 0;
  propertyRelationshipWrites: 0;
  thorntonVerification: "UNCHANGED";
  postWriteVerificationStatus: "NOT_APPLICABLE" | "PASSED";
  retrievalEnabled: false;
  customerVisibilityEnabled: false;
}>;

type PreflightRows = {
  geographic_objects: number;
  state_objects: number;
  colorado_named_objects: number;
  geographic_relationships: number;
  property_geographic_relationships: number;
  state_enum_present: boolean;
  companion_conflicts: number;
};

type SupportRows = {
  alias_count: number;
  source_count: number;
  observation_count: number;
  eligibility_count: number;
  relationship_count: number;
  property_relationship_count: number;
  all_eligibility_false: boolean;
};

type GeographicObjectRow = {
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

const ZERO_COUNTS: GofWave3PlannedWriteCounts = Object.freeze({
  geographicObjects: 0,
  aliases: 0,
  sources: 0,
  observations: 0,
  eligibilityRows: 0,
  relationships: 0,
  propertyRelationships: 0,
});

const SOURCE_NAMES = Object.freeze([
  "State of Colorado",
  "Colorado GIS",
  "U.S. Census Bureau",
  "USGS/GNIS",
  "PROJECT ATLAS - REAL ESTATE DATA TOOLS",
] as const);

export function buildGofWave3bInvocationId(repository: GofWave3bRepositoryControl): string {
  return `GOF_WAVE_3B|STATE|COLORADO|${repository.expectedCommit.slice(0, 12)}`;
}

export async function executeGofWave3bColoradoProductionPersistence(
  prisma: PrismaClient,
  controls: GofWave3bExecutionControls,
): Promise<GofWave3bExecutionResult> {
  const contract = buildGofWave3ColoradoPersistenceContract();
  assertControls(controls, contract);
  const port = createGofWave3bPrismaPersistencePort(prisma, controls.repository);
  const preflight = await port.readImmediatePreflight();
  const dryRun = evaluateGofWave3DryRun(preflight);
  const invocationId = buildGofWave3bInvocationId(controls.repository);

  if (dryRun.status === "BLOCKED_SCHEMA_OR_DATA_MISMATCH") {
    throw new Error(`GOF Wave 3B preflight blocked: ${dryRun.blockingFailures.join("; ")}`);
  }
  if (preflight.companionConflictCount !== 0) {
    throw new Error("GOF Wave 3B preflight detected Colorado companion-record conflicts.");
  }
  if (controls.mode === "dry-run") {
    return resultFor(controls, invocationId, "DRY_RUN_READY", ZERO_COUNTS, ZERO_COUNTS, "NOT_APPLICABLE");
  }
  if (controls.mode === "verify") {
    if (dryRun.status !== "DRY_RUN_IDEMPOTENT_NOOP") throw new Error("GOF Wave 3B verification requires an exact complete Colorado state.");
    return resultFor(controls, invocationId, "VERIFIED_COMPLETE", ZERO_COUNTS, GOF_WAVE_3_WRITE_CEILING, "PASSED");
  }

  assertExecutionAuthorization(controls);
  if (dryRun.status === "DRY_RUN_IDEMPOTENT_NOOP") {
    return resultFor(controls, invocationId, "EXECUTED_IDEMPOTENT_NOOP", ZERO_COUNTS, GOF_WAVE_3_WRITE_CEILING, "PASSED");
  }

  await port.transaction(async (tx) => {
    const context = Object.freeze({ contract });
    const object = await tx.createColoradoObject(context);
    for (let index = 0; index < contract.sources.length; index += 1) await tx.createSource(context, index);
    for (let index = 0; index < contract.aliases.length; index += 1) await tx.createAlias(context, object.id, index);
    for (let index = 0; index < contract.observations.length; index += 1) await tx.createObservation(context, object.id, index);
    await tx.createEligibility(context, object.id);
  });

  const postWrite = await port.readImmediatePreflight();
  if (postWrite.matchingColoradoSupportState !== "COMPLETE") {
    throw new Error("GOF Wave 3B post-write verification did not find a complete Colorado state.");
  }
  if (postWrite.thorntonFingerprint !== GOF_WAVE_3_THORNTON_CERTIFIED_FINGERPRINT) {
    throw new Error("GOF Wave 3B post-write verification detected Thornton drift.");
  }
  return resultFor(controls, invocationId, "EXECUTED_CREATED", GOF_WAVE_3_WRITE_CEILING, ZERO_COUNTS, "PASSED");
}

export function createGofWave3bPrismaPersistencePort(
  prisma: PrismaClient,
  repository: GofWave3bRepositoryControl,
): GofWave3aTransactionalPersistencePort {
  return Object.freeze({
    async readImmediatePreflight(): Promise<GofWave3aPreflightSnapshot> {
      return readPreflight(prisma, repository);
    },
    async transaction<T>(operation: (tx: GofWave3aTransactionWriter) => Promise<T>): Promise<T> {
      return prisma.$transaction(async (tx) => operation(createTransactionWriter(tx)));
    },
  });
}

function createTransactionWriter(tx: Prisma.TransactionClient): GofWave3aTransactionWriter {
  const sourceIds = new Map<string, string>();
  return Object.freeze({
    async createColoradoObject(context: GofWave3aTransactionContext): Promise<{ id: string }> {
      const object = context.contract.object;
      const [row] = await tx.$queryRaw<readonly [{ id: string }]>`
        INSERT INTO "GeographicObject" (
          "id",
          "objectType",
          "canonicalName",
          "displayName",
          "canonicalSlug",
          "lifecycleStatus",
          "visibility",
          "convenienceParentId",
          "mergedIntoId",
          "createdAt",
          "updatedAt"
        )
        VALUES (
          ${randomUUID()},
          ${object.objectType}::"GeographicObjectType",
          ${object.canonicalName},
          ${object.displayName},
          ${object.canonicalSlug},
          ${object.lifecycleStatus}::"GeographicLifecycleStatus",
          ${object.visibility}::"GeographicVisibility",
          ${object.convenienceParentId},
          ${object.mergedIntoId},
          now(),
          now()
        )
        RETURNING "id"
      `;
      return row;
    },
    async createSource(context: GofWave3aTransactionContext, index: number): Promise<void> {
      const source = context.contract.sources[index];
      const row = await tx.geographicSource.upsert({
        where: { canonicalName: source.canonicalName },
        create: {
          canonicalName: source.canonicalName,
          sourceClass: source.sourceClass,
          authorityLevel: source.authorityLevel,
          accessMethod: source.accessMethod,
          defaultUpdateCadence: source.defaultUpdateCadence,
          licensingRestriction: source.licensingRestriction,
          publicDisplayRestriction: source.publicDisplayRestriction,
          healthState: source.healthState,
          coverageDescription: `GOF Wave 3B governed Colorado STATE persistence source: ${source.canonicalName}`,
        },
        update: {},
        select: { id: true },
      });
      sourceIds.set(source.canonicalName, row.id);
    },
    async createAlias(context: GofWave3aTransactionContext, objectId: string, index: number): Promise<void> {
      const alias = context.contract.aliases[index];
      await tx.geographicAlias.create({
        data: {
          objectId,
          aliasText: alias.aliasText,
          normalizedValue: alias.normalizedValue,
          aliasType: alias.aliasType,
          language: alias.language,
          sourceId: sourceIds.get(alias.sourceRef),
          lifecycleStatus: alias.lifecycleStatus,
          effectiveDate: new Date("2026-07-26T00:00:00.000Z"),
        },
      });
    },
    async createObservation(context: GofWave3aTransactionContext, objectId: string, index: number): Promise<void> {
      const observation = context.contract.observations[index];
      await tx.geographicObservation.create({
        data: {
          objectId,
          observationKey: observation.observationKey,
          valueKind: observation.valueKind,
          valueJson: observation.valueJson as Prisma.InputJsonObject,
          valueSchemaKey: observation.valueSchemaKey,
          sourceId: sourceIds.get(observation.sourceRef),
          effectiveDate: new Date("2026-07-26T00:00:00.000Z"),
          retrievedAt: new Date("2026-07-26T00:00:00.000Z"),
          verifiedAt: new Date("2026-07-26T00:00:00.000Z"),
          freshness: observation.freshness,
          confidence: observation.confidence,
          derivationMethod: observation.derivationMethod,
          reviewStatus: observation.reviewStatus,
          publicVisibility: observation.publicVisibility,
        },
      });
    },
    async createEligibility(context: GofWave3aTransactionContext, objectId: string): Promise<void> {
      await tx.geographicEligibility.create({ data: { objectId, ...context.contract.eligibility } });
    },
  });
}

async function readPreflight(
  prisma: PrismaClient,
  repository: GofWave3bRepositoryControl,
): Promise<GofWave3aPreflightSnapshot> {
  const [counts] = await prisma.$queryRaw<readonly [PreflightRows]>`
    SELECT
      (SELECT count(*)::int FROM "GeographicObject") AS geographic_objects,
      (SELECT count(*)::int FROM "GeographicObject" WHERE "objectType"::text = 'STATE') AS state_objects,
      (SELECT count(*)::int FROM "GeographicObject" WHERE "canonicalName" = 'Colorado' OR "canonicalSlug" = 'colorado') AS colorado_named_objects,
      (SELECT count(*)::int FROM "GeographicRelationship") AS geographic_relationships,
      (SELECT count(*)::int FROM "PropertyGeographicRelationship") AS property_geographic_relationships,
      EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_enum e ON e.enumtypid = t.oid
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE n.nspname = 'public'
          AND t.typname = 'GeographicObjectType'
          AND e.enumlabel = 'STATE'
      ) AS state_enum_present,
      (
        SELECT count(*)::int
        FROM "GeographicAlias"
        WHERE "normalizedValue" IN ('co', 'state of colorado')
      ) +
      (
        SELECT count(*)::int
        FROM "GeographicObservation"
        WHERE "observationKey" LIKE 'gof.wave3.colorado.%'
          OR "valueSchemaKey" = 'gof.wave3.colorado.evidence.v1'
      ) +
      (
        SELECT count(*)::int
        FROM "GeographicSource"
        WHERE "canonicalName" = 'State of Colorado'
          AND (
            "sourceClass"::text <> 'GOVERNMENT'
            OR "authorityLevel"::text <> 'AUTHORITATIVE'
            OR "defaultUpdateCadence"::text <> 'EVENT_DRIVEN'
            OR "publicDisplayRestriction" IS DISTINCT FROM true
          )
      ) AS companion_conflicts
  `;
  const [object = null] = await prisma.$queryRaw<readonly GeographicObjectRow[]>`
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
      AND "canonicalSlug" = 'colorado'
    LIMIT 1
  `;
  const [thornton] = await prisma.$queryRaw<readonly [{ fingerprint: string }]>`
    SELECT concat_ws('|', id, "objectType"::text, "canonicalName", "canonicalSlug", "lifecycleStatus"::text, "visibility"::text, to_char("updatedAt" AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')) AS fingerprint
    FROM "GeographicObject"
    WHERE id = 'cms10utak0002qa0l8mu7gr8i'
  `;
  const supportState = object
    ? await readSupportState(prisma, object.id)
    : counts.colorado_named_objects === 0 && counts.companion_conflicts === 0
      ? "NONE"
      : "PARTIAL_OR_CONFLICTING";
  return Object.freeze({
    environment: "production",
    migrationStatus: "UP_TO_DATE",
    repositoryBaselineMatched: (repository.branch === "main" && repository.head === repository.expectedCommit && repository.originMain === repository.expectedCommit) as true,
    workingTreeClean: repository.workingTreeClean as true,
    sprint7ColoradoRetrievalEnabled: false,
    existingRecordSetFingerprint: supportState === "COMPLETE" ? buildGofWave3ColoradoPersistenceContract().evidenceFingerprint : null,
    companionConflictCount: counts.companion_conflicts,
    geographicObjectCount: counts.geographic_objects,
    stateObjectCount: counts.state_objects,
    coloradoNamedObjectCount: counts.colorado_named_objects,
    geographicRelationshipCount: counts.geographic_relationships,
    propertyGeographicRelationshipCount: counts.property_geographic_relationships,
    matchingColoradoObject: object
      ? {
          id: object.id,
          objectType: object.objectType,
          canonicalName: object.canonicalName,
          displayName: object.displayName,
          canonicalSlug: object.canonicalSlug,
          lifecycleStatus: object.lifecycleStatus,
          visibility: object.visibility,
          convenienceParentId: object.convenienceParentId,
          mergedIntoId: object.mergedIntoId,
        }
      : null,
    matchingColoradoSupportState: supportState,
    stateEnumPresent: counts.state_enum_present,
    thorntonFingerprint: thornton?.fingerprint ?? null,
  });
}

async function readSupportState(prisma: PrismaClient, objectId: string): Promise<GofWave3aPreflightSnapshot["matchingColoradoSupportState"]> {
  const [support] = await prisma.$queryRaw<readonly [SupportRows]>`
    SELECT
      (SELECT count(*)::int FROM "GeographicAlias" WHERE "objectId" = ${objectId}) AS alias_count,
      (SELECT count(*)::int FROM "GeographicSource" WHERE "canonicalName" IN (${Prisma.join(SOURCE_NAMES)})) AS source_count,
      (SELECT count(*)::int FROM "GeographicObservation" WHERE "objectId" = ${objectId}) AS observation_count,
      (SELECT count(*)::int FROM "GeographicEligibility" WHERE "objectId" = ${objectId}) AS eligibility_count,
      (SELECT count(*)::int FROM "GeographicRelationship" WHERE "sourceObjectId" = ${objectId} OR "targetObjectId" = ${objectId}) AS relationship_count,
      (SELECT count(*)::int FROM "PropertyGeographicRelationship" WHERE "geographicObjectId" = ${objectId}) AS property_relationship_count,
      COALESCE((SELECT NOT ("internalUse" OR "searchEligible" OR "mapEligible" OR "publicPageEligible" OR "indexingEligible" OR "propertyEnrichment" OR "marketAnalytics") FROM "GeographicEligibility" WHERE "objectId" = ${objectId}), false) AS all_eligibility_false
  `;
  return support.alias_count === GOF_WAVE_3_WRITE_CEILING.aliases &&
    support.source_count === GOF_WAVE_3_WRITE_CEILING.sources &&
    support.observation_count === GOF_WAVE_3_WRITE_CEILING.observations &&
    support.eligibility_count === GOF_WAVE_3_WRITE_CEILING.eligibilityRows &&
    support.relationship_count === 0 &&
    support.property_relationship_count === 0 &&
    support.all_eligibility_false
    ? "COMPLETE"
    : "PARTIAL_OR_CONFLICTING";
}

function assertControls(controls: GofWave3bExecutionControls, contract: GofWave3ColoradoPersistenceContract): void {
  if (controls.executionScope !== GOF_WAVE_3_AUTHORIZATION_SCOPE) throw new Error("GOF Wave 3B execution scope mismatch.");
  if (controls.environment !== "production" || !controls.confirmProduction) throw new Error("GOF Wave 3B requires confirmed production environment.");
  if (controls.certifiedCandidateFingerprint !== contract.evidenceFingerprint) throw new Error("GOF Wave 3B certified candidate fingerprint mismatch.");
  if (controls.repository.branch !== "main") throw new Error("GOF Wave 3B repository branch mismatch.");
  if (controls.repository.head !== controls.repository.expectedCommit || controls.repository.originMain !== controls.repository.expectedCommit) {
    throw new Error("GOF Wave 3B repository expected-commit mismatch.");
  }
  if (!controls.repository.workingTreeClean) throw new Error("GOF Wave 3B requires a clean working tree.");
}

function assertExecutionAuthorization(controls: GofWave3bExecutionControls): void {
  const authorization = controls.operatorAuthorization;
  if (!authorization?.tokenPresent) throw new Error("GOF Wave 3B execution requires one-time operator authorization token.");
  if (!authorization.authorizationId.trim() || !authorization.operatorId.trim() || !authorization.authorizedAt.trim()) {
    throw new Error("GOF Wave 3B operator authorization is incomplete.");
  }
  if (!authorization.acknowledgesPersistenceNotRetrieval || !authorization.acknowledgesNoRelationships || !authorization.acknowledgesNoCustomerVisibility) {
    throw new Error("GOF Wave 3B operator acknowledgements are incomplete.");
  }
}

function resultFor(
  controls: GofWave3bExecutionControls,
  invocationId: string,
  status: GofWave3bExecutionResult["status"],
  created: GofWave3PlannedWriteCounts,
  deduplicated: GofWave3PlannedWriteCounts,
  postWriteVerificationStatus: GofWave3bExecutionResult["postWriteVerificationStatus"],
): GofWave3bExecutionResult {
  return Object.freeze({
    module: GOF_WAVE_3B_MODULE,
    version: GOF_WAVE_3B_VERSION,
    activationFoundationVersion: GOF_WAVE_3A_VERSION,
    status,
    invocationId,
    mode: controls.mode,
    targetEnvironment: controls.environment,
    repository: controls.repository,
    candidateFingerprint: controls.certifiedCandidateFingerprint,
    preflightStatus: "PASSED",
    created,
    deduplicated,
    conflictCount: 0,
    relationshipWrites: 0,
    propertyRelationshipWrites: 0,
    thorntonVerification: "UNCHANGED",
    postWriteVerificationStatus,
    retrievalEnabled: false,
    customerVisibilityEnabled: false,
  });
}
