import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

import {
  GOF_WAVE_3_AUTHORIZATION_SCOPE,
  GOF_WAVE_3_THORNTON_CERTIFIED_FINGERPRINT,
  GOF_WAVE_3_WRITE_CEILING,
  buildGofWave3ColoradoPersistenceContract,
  evaluateGofWave3DryRun,
  type GofWave3ExistingColoradoObject,
  type GofWave3ProductionState,
} from "../lib/gof/coloradoControlledProductionPersistence.js";
import {
  GOF_WAVE_3A_REQUIRED_BRANCH,
  GOF_WAVE_3A_REQUIRED_HEAD,
  executeGofWave3aControlledColoradoProductionPersistence,
  getGofWave3aCertifiedCandidateFingerprint,
  type GofWave3aExecutionRequest,
  type GofWave3aPreflightSnapshot,
  type GofWave3aTransactionContext,
  type GofWave3aTransactionalPersistencePort,
  type GofWave3aTransactionWriter,
} from "../lib/gof/coloradoControlledProductionPersistenceActivation.js";
import {
  EIP_SPRINT_7_CERTIFIED_CANONICAL_NAME,
  EIP_SPRINT_7_CERTIFIED_OBJECT_ID,
} from "../lib/eip/productionInternalGeographicReadAdapter.js";

const packageJson = fs.readFileSync("package.json", "utf8");
const workerTsconfig = fs.readFileSync("tsconfig.worker.json", "utf8");
const reportPath = "docs/project-atlas/executive-library/GOF-1.0-WAVE-3A-CONTROLLED-COLORADO-PRODUCTION-PERSISTENCE-ACTIVATION.md";
const report = fs.existsSync(reportPath) ? fs.readFileSync(reportPath, "utf8") : "";
const activationSource = fs.readFileSync("lib/gof/coloradoControlledProductionPersistenceActivation.ts", "utf8");

const contract = buildGofWave3ColoradoPersistenceContract();
const candidateFingerprint = getGofWave3aCertifiedCandidateFingerprint();
assert.equal(candidateFingerprint, contract.evidenceFingerprint);
assert.equal(contract.object.objectType, "STATE");
assert.equal(contract.object.canonicalName, "Colorado");
assert.equal(contract.object.displayName, "Colorado");
assert.equal(contract.object.canonicalSlug, "colorado");
assert.equal(contract.object.lifecycleStatus, "DRAFT");
assert.equal(contract.object.visibility, "INTERNAL_ONLY");
assert.deepEqual(contract.aliases.map((alias) => alias.aliasText), ["CO", "State of Colorado"]);
assert.deepEqual(contract.eligibility, {
  internalUse: false,
  searchEligible: false,
  mapEligible: false,
  publicPageEligible: false,
  indexingEligible: false,
  propertyEnrichment: false,
  marketAnalytics: false,
});

const emptyStore = createFakeStore();
const dryRunResult = await executeGofWave3aControlledColoradoProductionPersistence(validRequest({ dryRun: true, omitAuthorization: true }), emptyStore);
assert.equal(dryRunResult.status, "DRY_RUN_READY");
assert.equal(dryRunResult.dryRun, true);
assert.deepEqual(dryRunResult.created, zeroCounts());
assert.equal(emptyStore.debugState().objects.length, 0);

await assert.rejects(
  executeGofWave3aControlledColoradoProductionPersistence(validRequest({ dryRun: false, omitAuthorization: true }), createFakeStore()),
  /explicit operator authorization/,
);
await assert.rejects(
  executeGofWave3aControlledColoradoProductionPersistence({
    ...validRequest({ dryRun: false }),
    executionScope: "WRONG_SCOPE" as typeof GOF_WAVE_3_AUTHORIZATION_SCOPE,
  }, createFakeStore()),
  /scope mismatch/,
);
await assert.rejects(
  executeGofWave3aControlledColoradoProductionPersistence({
    ...validRequest({ dryRun: false }),
    certifiedCandidateFingerprint: "bad-fingerprint",
  }, createFakeStore()),
  /fingerprint mismatch/,
);
await assert.rejects(
  executeGofWave3aControlledColoradoProductionPersistence({
    ...validRequest({ dryRun: false }),
    repository: {
      ...validRequest({ dryRun: false }).repository,
      head: "bad-head" as typeof GOF_WAVE_3A_REQUIRED_HEAD,
    },
  }, createFakeStore()),
  /repository baseline mismatch/,
);
await assert.rejects(
  executeGofWave3aControlledColoradoProductionPersistence({
    ...validRequest({ dryRun: false }),
    repository: {
      ...validRequest({ dryRun: false }).repository,
      workingTreeClean: false as true,
    },
  }, createFakeStore()),
  /clean working tree/,
);

const firstStore = createFakeStore();
const firstExecution = await executeGofWave3aControlledColoradoProductionPersistence(validRequest({ dryRun: false }), firstStore);
assert.equal(firstExecution.status, "EXECUTED_CREATED");
assert.deepEqual(firstExecution.created, GOF_WAVE_3_WRITE_CEILING);
assert.equal(firstExecution.relationshipsCreated, 0);
assert.equal(firstExecution.propertyRelationshipsCreated, 0);
assert.equal(firstExecution.retrievalEnabled, false);
assert.equal(firstExecution.customerVisibilityEnabled, false);
assert.equal(firstExecution.thorntonFingerprintBefore, GOF_WAVE_3_THORNTON_CERTIFIED_FINGERPRINT);
assert.equal(firstExecution.thorntonFingerprintAfter, GOF_WAVE_3_THORNTON_CERTIFIED_FINGERPRINT);
assert.equal(firstStore.debugState().objects.length, 1);
assert.equal(firstStore.debugState().aliases.length, 2);
assert.equal(firstStore.debugState().sources.length, 5);
assert.equal(firstStore.debugState().observations.length, 5);
assert.equal(firstStore.debugState().eligibility.length, 1);
assert.equal(firstStore.debugState().relationships.length, 0);
assert.equal(firstStore.debugState().propertyRelationships.length, 0);

const beforeSecondExecution = JSON.stringify(firstStore.debugState());
const secondExecution = await executeGofWave3aControlledColoradoProductionPersistence(validRequest({ dryRun: false }), firstStore);
assert.equal(secondExecution.status, "EXECUTED_IDEMPOTENT_NOOP");
assert.deepEqual(secondExecution.created, zeroCounts());
assert.deepEqual(secondExecution.deduplicated, GOF_WAVE_3_WRITE_CEILING);
assert.equal(JSON.stringify(firstStore.debugState()), beforeSecondExecution);

const rollbackStore = createFakeStore({ failOnStep: "observation:2" });
await assert.rejects(
  executeGofWave3aControlledColoradoProductionPersistence(validRequest({ dryRun: false }), rollbackStore),
  /forced fake transaction failure/,
);
assert.deepEqual(rollbackStore.debugState(), createFakeStore().debugState());

await assert.rejects(
  executeGofWave3aControlledColoradoProductionPersistence(validRequest({ dryRun: false }), createFakeStore({ seedPartialColorado: true })),
  /partial or conflicting/,
);
await assert.rejects(
  executeGofWave3aControlledColoradoProductionPersistence(validRequest({ dryRun: false }), createFakeStore({ seedConflictingColorado: true })),
  /does not match/,
);
await assert.rejects(
  executeGofWave3aControlledColoradoProductionPersistence(validRequest({ dryRun: false }), createFakeStore({ seedCompanionConflict: true })),
  /companion-record conflicts/,
);
await assert.rejects(
  executeGofWave3aControlledColoradoProductionPersistence(validRequest({ dryRun: false }), createFakeStore({ sprint7ColoradoRetrievalEnabled: true })),
  /unauthorized Colorado retrieval/,
);
await assert.rejects(
  executeGofWave3aControlledColoradoProductionPersistence(validRequest({ dryRun: false }), createFakeStore({ thorntonFingerprint: "changed" })),
  /Thornton fingerprint drift/,
);

assert.equal(EIP_SPRINT_7_CERTIFIED_OBJECT_ID, "cms10utak0002qa0l8mu7gr8i");
assert.equal(EIP_SPRINT_7_CERTIFIED_CANONICAL_NAME, "Thornton");
assert.ok(packageJson.includes("check:gof-wave-3a-controlled-colorado-production-persistence-activation"));
assert.ok(workerTsconfig.includes("scripts/checkGofWave3aControlledColoradoProductionPersistenceActivation.ts"));
assert.match(report, /GOF WAVE 3A STATUS: `CERTIFIED_ACTIVATION_FOUNDATION`/);
assert.match(report, /READINESS CLASSIFICATION: `TRANSACTION_CONTRACT_ONLY`/);
assert.match(report, /PRODUCTION EXECUTION STATUS: `NOT_EXECUTED`/);
assert.match(report, /RETRIEVAL STATUS: `NOT_AUTHORIZED`/);
assert.match(report, /RELATIONSHIP STATUS: `NOT_AUTHORIZED`/);
assert.match(report, /CUSTOMER VISIBILITY STATUS: `NOT_AUTHORIZED`/);

for (const prohibited of ["app/api", "route.ts", "Search", "Maps", "Property Intelligence", "AI activation", "customer visibility enabled"]) {
  assert.equal(activationSource.includes(prohibited), false, `Wave 3A activation source contains prohibited integration text: ${prohibited}`);
}

for (const runtimeRoot of ["app", "components", "lib/search", "lib/mls", "lib/typesense", "lib/alerts", "lib/email", "workers"]) {
  for (const file of listSourceFiles(runtimeRoot)) {
    const contents = fs.readFileSync(file, "utf8");
    assert.equal(contents.includes("GOF_WAVE_3A"), false, `Runtime file references Wave 3A: ${file}`);
    assert.equal(contents.includes("coloradoControlledProductionPersistenceActivation"), false, `Runtime file imports Wave 3A activation: ${file}`);
  }
}

const productionPreflight = await readProductionPreflight();
const productionDryRun = evaluateGofWave3DryRun(productionPreflight);
assert.equal(productionPreflight.environment, "production");
assert.equal(productionPreflight.migrationStatus, "UP_TO_DATE");
assert.equal(productionPreflight.repositoryBaselineMatched, true);
assert.equal(productionPreflight.workingTreeClean, true);
assert.equal(productionPreflight.stateEnumPresent, true);
assert.equal(productionPreflight.geographicObjectCount, 2);
assert.equal(productionPreflight.stateObjectCount, 1);
assert.equal(productionPreflight.coloradoNamedObjectCount, 1);
assert.equal(productionPreflight.geographicRelationshipCount, 0);
assert.equal(productionPreflight.propertyGeographicRelationshipCount, 0);
assert.equal(productionPreflight.matchingColoradoSupportState, "COMPLETE");
assert.equal(productionPreflight.companionConflictCount, 0);
assert.equal(productionPreflight.thorntonFingerprint, GOF_WAVE_3_THORNTON_CERTIFIED_FINGERPRINT);
assert.equal(productionPreflight.sprint7ColoradoRetrievalEnabled, false);
assert.equal(productionDryRun.status, "DRY_RUN_IDEMPOTENT_NOOP");
assert.deepEqual(productionDryRun.writesPerformed, zeroCounts());

console.log(
  "[gof-wave-3a-controlled-colorado-production-persistence-activation] ok: fake transactional execution, explicit operator controls, dry-run zero writes, rollback, idempotency, conflict/partial fail-closed behavior, no relationships, Thornton preservation, retrieval prohibition, runtime isolation, and read-only production preflight passed.",
);

function validRequest(options: { dryRun: boolean; omitAuthorization?: boolean }): GofWave3aExecutionRequest {
  return Object.freeze({
    dryRun: options.dryRun,
    executionScope: GOF_WAVE_3_AUTHORIZATION_SCOPE,
    environment: "production",
    operatorAuthorization: options.omitAuthorization
      ? null
      : Object.freeze({
          authorized: true,
          authorizationId: "GOF_WAVE_3A_FAKE_AUTHORIZATION_ONLY",
          operatorId: "PROJECT_ATLAS_TEST_OPERATOR",
          authorizedAt: "2026-07-26T00:00:00.000Z",
          acknowledgesPersistenceNotRetrieval: true,
          acknowledgesNoRelationships: true,
          acknowledgesNoCustomerVisibility: true,
        }),
    certifiedCandidateFingerprint: candidateFingerprint,
    repository: Object.freeze({
      branch: GOF_WAVE_3A_REQUIRED_BRANCH,
      head: GOF_WAVE_3A_REQUIRED_HEAD,
      originMain: GOF_WAVE_3A_REQUIRED_HEAD,
      workingTreeClean: true,
    }),
  });
}

function zeroCounts() {
  return {
    geographicObjects: 0,
    aliases: 0,
    sources: 0,
    observations: 0,
    eligibilityRows: 0,
    relationships: 0,
    propertyRelationships: 0,
  };
}

type FakeObject = GofWave3ExistingColoradoObject;
type FakeAlias = { objectId: string; aliasText: string; normalizedValue: string; aliasType: string; language: string; lifecycleStatus: string };
type FakeSource = { canonicalName: string };
type FakeObservation = { objectId: string; observationKey: string; valueSchemaKey: string; fingerprint: string };
type FakeEligibility = { objectId: string; values: Record<string, boolean> };
type FakeState = {
  objects: FakeObject[];
  aliases: FakeAlias[];
  sources: FakeSource[];
  observations: FakeObservation[];
  eligibility: FakeEligibility[];
  relationships: unknown[];
  propertyRelationships: unknown[];
  thorntonFingerprint: string;
  stateEnumPresent: boolean;
  sprint7ColoradoRetrievalEnabled: boolean;
  companionConflictCount: number;
};
type FakeOptions = {
  seedPartialColorado?: boolean;
  seedConflictingColorado?: boolean;
  seedCompanionConflict?: boolean;
  failOnStep?: string;
  thorntonFingerprint?: string;
  sprint7ColoradoRetrievalEnabled?: boolean;
};

function createFakeStore(options: FakeOptions = {}): GofWave3aTransactionalPersistencePort & { debugState(): FakeState } {
  let state: FakeState = {
    objects: [],
    aliases: [],
    sources: [],
    observations: [],
    eligibility: [],
    relationships: [],
    propertyRelationships: [],
    thorntonFingerprint: options.thorntonFingerprint ?? GOF_WAVE_3_THORNTON_CERTIFIED_FINGERPRINT,
    stateEnumPresent: true,
    sprint7ColoradoRetrievalEnabled: options.sprint7ColoradoRetrievalEnabled ?? false,
    companionConflictCount: options.seedCompanionConflict ? 1 : 0,
  };
  if (options.seedPartialColorado || options.seedConflictingColorado) {
    state.objects.push({
      id: "fake-colorado-1",
      objectType: "STATE",
      canonicalName: "Colorado",
      displayName: "Colorado",
      canonicalSlug: "colorado",
      lifecycleStatus: "DRAFT",
      visibility: options.seedConflictingColorado ? "PUBLIC_ELIGIBLE" : "INTERNAL_ONLY",
      convenienceParentId: null,
      mergedIntoId: null,
    });
  }

  const port = {
    async readImmediatePreflight(): Promise<GofWave3aPreflightSnapshot> {
      return buildFakeSnapshot(state);
    },
    async transaction<T>(operation: (tx: GofWave3aTransactionWriter) => Promise<T>): Promise<T> {
      const working = cloneState(state);
      const writer = createWriter(working, options);
      try {
        const result = await operation(writer);
        state = working;
        return result;
      } catch (error) {
        throw error;
      }
    },
    debugState(): FakeState {
      return cloneState(state);
    },
  };
  return port;
}

function createWriter(state: FakeState, options: FakeOptions): GofWave3aTransactionWriter {
  return {
    async createColoradoObject(context: GofWave3aTransactionContext): Promise<{ id: string }> {
      maybeFail(options, "object");
      if (state.objects.some((object) => object.objectType === "STATE" && object.canonicalSlug === "colorado")) {
        throw new Error("fake duplicate Colorado object");
      }
      const id = "fake-colorado-1";
      state.objects.push({
        id,
        objectType: context.contract.object.objectType,
        canonicalName: context.contract.object.canonicalName,
        displayName: context.contract.object.displayName,
        canonicalSlug: context.contract.object.canonicalSlug,
        lifecycleStatus: context.contract.object.lifecycleStatus,
        visibility: context.contract.object.visibility,
        convenienceParentId: context.contract.object.convenienceParentId,
        mergedIntoId: context.contract.object.mergedIntoId,
      });
      return { id };
    },
    async createAlias(context: GofWave3aTransactionContext, objectId: string, index: number): Promise<void> {
      maybeFail(options, `alias:${index}`);
      const alias = context.contract.aliases[index];
      state.aliases.push({
        objectId,
        aliasText: alias.aliasText,
        normalizedValue: alias.normalizedValue,
        aliasType: alias.aliasType,
        language: alias.language,
        lifecycleStatus: alias.lifecycleStatus,
      });
    },
    async createSource(context: GofWave3aTransactionContext, index: number): Promise<void> {
      maybeFail(options, `source:${index}`);
      const source = context.contract.sources[index];
      if (!state.sources.some((existing) => existing.canonicalName === source.canonicalName)) {
        state.sources.push({ canonicalName: source.canonicalName });
      }
    },
    async createObservation(context: GofWave3aTransactionContext, objectId: string, index: number): Promise<void> {
      maybeFail(options, `observation:${index}`);
      const observation = context.contract.observations[index];
      state.observations.push({
        objectId,
        observationKey: observation.observationKey,
        valueSchemaKey: observation.valueSchemaKey,
        fingerprint: JSON.stringify(observation.valueJson),
      });
    },
    async createEligibility(context: GofWave3aTransactionContext, objectId: string): Promise<void> {
      maybeFail(options, "eligibility");
      state.eligibility.push({ objectId, values: { ...context.contract.eligibility } });
    },
  };
}

function buildFakeSnapshot(state: FakeState): GofWave3aPreflightSnapshot {
  const matchingColoradoObject = state.objects.find((object) => object.objectType === "STATE" && object.canonicalSlug === "colorado") ?? null;
  const supportState = matchingColoradoObject ? supportStateFor(state, matchingColoradoObject.id) : supportRowsExist(state) ? "PARTIAL_OR_CONFLICTING" : "NONE";
  return Object.freeze({
    environment: "production",
    migrationStatus: "UP_TO_DATE",
    repositoryBaselineMatched: true,
    workingTreeClean: true,
    sprint7ColoradoRetrievalEnabled: state.sprint7ColoradoRetrievalEnabled,
    existingRecordSetFingerprint: supportState === "COMPLETE" ? candidateFingerprint : null,
    companionConflictCount: state.companionConflictCount,
    geographicObjectCount: 1 + state.objects.length,
    stateObjectCount: state.objects.filter((object) => object.objectType === "STATE").length,
    coloradoNamedObjectCount: state.objects.filter((object) => object.canonicalName === "Colorado" || object.canonicalSlug === "colorado").length,
    geographicRelationshipCount: state.relationships.length,
    propertyGeographicRelationshipCount: state.propertyRelationships.length,
    matchingColoradoObject,
    matchingColoradoSupportState: supportState,
    stateEnumPresent: state.stateEnumPresent,
    thorntonFingerprint: state.thorntonFingerprint,
  });
}

function supportStateFor(state: FakeState, objectId: string): GofWave3ProductionState["matchingColoradoSupportState"] {
  const sourceNames = new Set(state.sources.map((source) => source.canonicalName));
  const expectedSourceNames = new Set(contract.sources.map((source) => source.canonicalName));
  const sourcesComplete = sourceNames.size === expectedSourceNames.size && [...expectedSourceNames].every((source) => sourceNames.has(source));
  const aliases = state.aliases.filter((alias) => alias.objectId === objectId);
  const observations = state.observations.filter((observation) => observation.objectId === objectId);
  const eligibility = state.eligibility.filter((item) => item.objectId === objectId);
  const eligibilityComplete = eligibility.length === 1 && Object.values(eligibility[0].values).every((value) => value === false);
  return aliases.length === contract.aliases.length &&
    sourcesComplete &&
    observations.length === contract.observations.length &&
    eligibilityComplete &&
    state.relationships.length === 0 &&
    state.propertyRelationships.length === 0
    ? "COMPLETE"
    : "PARTIAL_OR_CONFLICTING";
}

function supportRowsExist(state: FakeState): boolean {
  return state.aliases.length > 0 || state.sources.length > 0 || state.observations.length > 0 || state.eligibility.length > 0;
}

function maybeFail(options: FakeOptions, step: string): void {
  if (options.failOnStep === step) {
    throw new Error(`forced fake transaction failure at ${step}`);
  }
}

function cloneState(state: FakeState): FakeState {
  return JSON.parse(JSON.stringify(state)) as FakeState;
}

function listSourceFiles(root: string): string[] {
  if (!fs.existsSync(root)) return [];
  const stat = fs.statSync(root);
  if (stat.isFile()) return /\.(ts|tsx|js|jsx)$/.test(root) ? [root] : [];
  return fs.readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const child = path.join(root, entry.name);
    return entry.isDirectory() ? listSourceFiles(child) : /\.(ts|tsx|js|jsx)$/.test(child) ? [child] : [];
  });
}

async function readProductionPreflight(): Promise<GofWave3aPreflightSnapshot> {
  const prisma = new PrismaClient();
  try {
    const [counts] = await prisma.$queryRaw<readonly [{
      geographic_objects: number;
      state_objects: number;
      colorado_named_objects: number;
      geographic_relationships: number;
      property_geographic_relationships: number;
      state_enum_present: boolean;
      companion_conflicts: number;
    }]>`
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
    const [thornton] = await prisma.$queryRaw<readonly [{ fingerprint: string }]>`
      SELECT concat_ws('|', id, "objectType"::text, "canonicalName", "canonicalSlug", "lifecycleStatus"::text, "visibility"::text, to_char("updatedAt" AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')) AS fingerprint
      FROM "GeographicObject"
      WHERE id = 'cms10utak0002qa0l8mu7gr8i'
    `;
    const [matchingColoradoObject = null] = await prisma.$queryRaw<readonly {
      id: string;
      object_type: string;
      canonical_name: string;
      display_name: string;
      canonical_slug: string;
      lifecycle_status: string;
      visibility: string;
      convenience_parent_id: string | null;
      merged_into_id: string | null;
    }[]>`
      SELECT
        id,
        "objectType"::text AS object_type,
        "canonicalName" AS canonical_name,
        "displayName" AS display_name,
        "canonicalSlug" AS canonical_slug,
        "lifecycleStatus"::text AS lifecycle_status,
        "visibility"::text AS visibility,
        "convenienceParentId" AS convenience_parent_id,
        "mergedIntoId" AS merged_into_id
      FROM "GeographicObject"
      WHERE "objectType"::text = 'STATE'
        AND "canonicalSlug" = 'colorado'
      LIMIT 1
    `;
    const completeColorado = matchingColoradoObject &&
      matchingColoradoObject.object_type === "STATE" &&
      matchingColoradoObject.canonical_name === "Colorado" &&
      matchingColoradoObject.display_name === "Colorado" &&
      matchingColoradoObject.canonical_slug === "colorado" &&
      matchingColoradoObject.lifecycle_status === "DRAFT" &&
      matchingColoradoObject.visibility === "INTERNAL_ONLY";
    return Object.freeze({
      environment: "production",
      migrationStatus: "UP_TO_DATE",
      repositoryBaselineMatched: true,
      workingTreeClean: true,
      sprint7ColoradoRetrievalEnabled: false,
      existingRecordSetFingerprint: completeColorado ? contract.evidenceFingerprint : null,
      companionConflictCount: completeColorado ? 0 : counts.companion_conflicts,
      geographicObjectCount: counts.geographic_objects,
      stateObjectCount: counts.state_objects,
      coloradoNamedObjectCount: counts.colorado_named_objects,
      geographicRelationshipCount: counts.geographic_relationships,
      propertyGeographicRelationshipCount: counts.property_geographic_relationships,
      matchingColoradoObject: matchingColoradoObject
        ? Object.freeze({
            id: matchingColoradoObject.id,
            objectType: matchingColoradoObject.object_type,
            canonicalName: matchingColoradoObject.canonical_name,
            displayName: matchingColoradoObject.display_name,
            canonicalSlug: matchingColoradoObject.canonical_slug,
            lifecycleStatus: matchingColoradoObject.lifecycle_status,
            visibility: matchingColoradoObject.visibility,
            convenienceParentId: matchingColoradoObject.convenience_parent_id,
            mergedIntoId: matchingColoradoObject.merged_into_id,
          })
        : null,
      matchingColoradoSupportState: completeColorado ? "COMPLETE" : counts.colorado_named_objects === 0 ? "NONE" : "PARTIAL_OR_CONFLICTING",
      stateEnumPresent: counts.state_enum_present,
      thorntonFingerprint: thornton?.fingerprint ?? null,
    });
  } finally {
    await prisma.$disconnect();
  }
}
