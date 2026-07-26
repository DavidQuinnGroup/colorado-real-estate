import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { PrismaClient, type Prisma } from "@prisma/client";

import {
  GOF_WAVE_3_AUTHORIZATION_SCOPE,
  GOF_WAVE_3_THORNTON_CERTIFIED_FINGERPRINT,
  GOF_WAVE_3_WRITE_CEILING,
  buildGofWave3ColoradoPersistenceContract,
  evaluateGofWave3DryRun,
} from "../lib/gof/coloradoControlledProductionPersistence.js";
import {
  GOF_WAVE_3B_MODULE,
  GOF_WAVE_3B_STATUS,
  buildGofWave3bInvocationId,
  executeGofWave3bColoradoProductionPersistence,
  type GofWave3bExecutionControls,
  type GofWave3bRepositoryControl,
} from "../lib/gof/coloradoProductionExecutionAdapter.js";
import { parseGofWave3bCliOptions, usage } from "./activateGofWave3bColoradoPersistence.js";

const packageJson = fs.readFileSync("package.json", "utf8");
const workerTsconfig = fs.readFileSync("tsconfig.worker.json", "utf8");
const adapterSource = fs.readFileSync("lib/gof/coloradoProductionExecutionAdapter.ts", "utf8");
const commandSource = fs.readFileSync("scripts/activateGofWave3bColoradoPersistence.ts", "utf8");
const reportPath = "docs/project-atlas/executive-library/GOF-1.0-WAVE-3B-COLORADO-PRODUCTION-EXECUTION-ADAPTER.md";
const report = fs.existsSync(reportPath) ? fs.readFileSync(reportPath, "utf8") : "";
const contract = buildGofWave3ColoradoPersistenceContract();
const repository = repositoryControl();

assert.equal(GOF_WAVE_3B_STATUS, "EXECUTION_READY_PENDING_OPERATOR_AUTHORIZATION");
assert.equal(buildGofWave3bInvocationId(repository), `GOF_WAVE_3B|STATE|COLORADO|${repository.expectedCommit.slice(0, 12)}`);
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

const parsedDryRun = parseGofWave3bCliOptions(["--dry-run"]);
assert.equal(parsedDryRun.mode, "dry-run");
assert.equal(parsedDryRun.scope, GOF_WAVE_3_AUTHORIZATION_SCOPE);
assert.throws(() => parseGofWave3bCliOptions(["--dry-run", "--execute"]), /only one mode flag/);
assert.throws(() => parseGofWave3bCliOptions(["--execute", "--verify"]), /only one mode flag/);
assert.match(usage(), /--dry-run/);
assert.match(usage(), /GOF_WAVE_3B_OPERATOR_AUTHORIZATION_TOKEN/);

await assert.rejects(
  executeGofWave3bColoradoProductionPersistence(mockPrisma(), controls({ mode: "execute", token: false })),
  /one-time operator authorization token/,
);
await assert.rejects(
  executeGofWave3bColoradoProductionPersistence(mockPrisma(), controls({ scope: "WRONG_SCOPE" })),
  /scope mismatch/,
);
await assert.rejects(
  executeGofWave3bColoradoProductionPersistence(mockPrisma(), controls({ fingerprint: "bad-fingerprint" })),
  /fingerprint mismatch/,
);
await assert.rejects(
  executeGofWave3bColoradoProductionPersistence(mockPrisma(), controls({ expectedCommit: "bad-commit" })),
  /expected-commit mismatch/,
);
await assert.rejects(
  executeGofWave3bColoradoProductionPersistence(mockPrisma(), controls({ workingTreeClean: false })),
  /clean working tree/,
);
await assert.rejects(
  executeGofWave3bColoradoProductionPersistence(mockPrisma({ companionConflictCount: 1 }), controls()),
  /companion persistence rows exist|companion-record conflicts/,
);

const emptyPrisma = mockPrisma();
const dryRun = await executeGofWave3bColoradoProductionPersistence(emptyPrisma, controls({ mode: "dry-run" }));
assert.equal(dryRun.status, "DRY_RUN_READY");
assert.equal(dryRun.mode, "dry-run");
assert.deepEqual(dryRun.created, zeroCounts());
assert.equal(emptyPrisma.debug().objects.length, 0);
assert.equal(emptyPrisma.debug().transactions, 0);

const firstPrisma = mockPrisma();
const first = await executeGofWave3bColoradoProductionPersistence(firstPrisma, controls({ mode: "execute" }));
assert.equal(first.status, "EXECUTED_CREATED");
assert.deepEqual(first.created, GOF_WAVE_3_WRITE_CEILING);
assert.equal(first.relationshipWrites, 0);
assert.equal(first.propertyRelationshipWrites, 0);
assert.equal(first.retrievalEnabled, false);
assert.equal(first.customerVisibilityEnabled, false);
assert.equal(firstPrisma.debug().objects.length, 1);
assert.equal(firstPrisma.debug().aliases.length, 2);
assert.equal(firstPrisma.debug().sources.length, 5);
assert.equal(firstPrisma.debug().observations.length, 5);
assert.equal(firstPrisma.debug().eligibility.length, 1);
assert.equal(firstPrisma.debug().relationships.length, 0);
assert.equal(firstPrisma.debug().propertyRelationships.length, 0);
assert.equal(firstPrisma.debug().transactions, 1);

const beforeRepeat = JSON.stringify(firstPrisma.debug());
const repeat = await executeGofWave3bColoradoProductionPersistence(firstPrisma, controls({ mode: "execute" }));
assert.equal(repeat.status, "EXECUTED_IDEMPOTENT_NOOP");
assert.deepEqual(repeat.created, zeroCounts());
assert.deepEqual(repeat.deduplicated, GOF_WAVE_3_WRITE_CEILING);
assert.equal(JSON.stringify(firstPrisma.debug()), beforeRepeat);

const rollbackPrisma = mockPrisma({ failOnObservationIndex: 2 });
await assert.rejects(
  executeGofWave3bColoradoProductionPersistence(rollbackPrisma, controls({ mode: "execute" })),
  /forced mocked Prisma observation failure/,
);
assert.deepEqual(rollbackPrisma.debug(), mockPrisma().debug());

await assert.rejects(
  executeGofWave3bColoradoProductionPersistence(mockPrisma({ partialColorado: true }), controls({ mode: "execute" })),
  /partial or conflicting/,
);
await assert.rejects(
  executeGofWave3bColoradoProductionPersistence(mockPrisma({ conflictingColorado: true }), controls({ mode: "execute" })),
  /does not match/,
);

for (const prohibited of ["app/api", "route.ts", "Search", "Maps", "Property Intelligence", "AI", "public page", "customer route"]) {
  assert.equal(adapterSource.includes(prohibited), false, `Wave 3B adapter source contains prohibited integration text: ${prohibited}`);
}
assert.equal(/geographicRelationship\.create|propertyGeographicRelationship\.create/.test(adapterSource), false);
assert.equal(adapterSource.includes("geographicObject.create"), false, "Adapter must not route STATE object creation through generated Prisma enum validation.");
assert.equal(adapterSource.includes("createGofWave3bPrismaPersistencePort"), true, "Real Prisma adapter port must exist.");
assert.equal(commandSource.includes("--execute"), true, "Command must require explicit execute flag.");
assert.equal(commandSource.includes("GOF_WAVE_3B_OPERATOR_AUTHORIZATION_TOKEN"), true, "Command must require an operator token outside source.");
assert.equal(commandSource.includes('":(exclude)dist"'), true, "Command must exclude generated dist output from its self-cleanliness check.");
assert.ok(packageJson.includes("check:gof-wave-3b-colorado-production-execution-adapter"));
assert.ok(packageJson.includes("activate:gof-wave-3b-colorado-persistence"));
assert.ok(workerTsconfig.includes("scripts/checkGofWave3bColoradoProductionExecutionAdapter.ts"));
assert.ok(workerTsconfig.includes("scripts/activateGofWave3bColoradoPersistence.ts"));
assert.match(report, /GOF WAVE 3B STATUS: `CERTIFIED_EXECUTION_READY`/);
assert.match(report, /OPERATOR CONTROL CLASSIFICATION: `PRESENCE_ONLY_OPERATOR_CONTROL`/);
assert.match(report, /MOCKED PRISMA PROOF: `PRESENT`/);
assert.match(report, /PRODUCTION DRY-RUN PROOF: `PRESENT`/);
assert.match(report, /PRODUCTION WRITE PROOF: `NONE`/);
assert.match(report, /PRODUCTION EXECUTION STATUS: `NOT_EXECUTED`/);
assert.match(report, /RETRIEVAL STATUS: `NOT_AUTHORIZED`/);
assert.match(report, /RELATIONSHIP STATUS: `NOT_AUTHORIZED`/);

for (const runtimeRoot of ["app", "components", "lib/search", "lib/mls", "lib/typesense", "lib/alerts", "lib/email", "workers"]) {
  for (const file of listSourceFiles(runtimeRoot)) {
    const contents = fs.readFileSync(file, "utf8");
    assert.equal(contents.includes("GOF_WAVE_3B"), false, `Runtime file references Wave 3B: ${file}`);
    assert.equal(contents.includes("coloradoProductionExecutionAdapter"), false, `Runtime file imports Wave 3B adapter: ${file}`);
  }
}

const production = await readProductionBaseline();
assert.equal(production.geographicObjectCount, 1);
assert.equal(production.stateObjectCount, 0);
assert.equal(production.coloradoNamedObjectCount, 0);
assert.equal(production.geographicRelationshipCount, 0);
assert.equal(production.propertyGeographicRelationshipCount, 0);
assert.equal(production.stateEnumPresent, true);
assert.equal(production.thorntonFingerprint, GOF_WAVE_3_THORNTON_CERTIFIED_FINGERPRINT);
assert.equal(evaluateGofWave3DryRun({
  geographicObjectCount: production.geographicObjectCount,
  stateObjectCount: production.stateObjectCount,
  coloradoNamedObjectCount: production.coloradoNamedObjectCount,
  geographicRelationshipCount: production.geographicRelationshipCount,
  propertyGeographicRelationshipCount: production.propertyGeographicRelationshipCount,
  matchingColoradoObject: null,
  matchingColoradoSupportState: "NONE",
  stateEnumPresent: production.stateEnumPresent,
  thorntonFingerprint: production.thorntonFingerprint,
}).status, "DRY_RUN_READY");

console.log("[gof-wave-3b-colorado-production-execution-adapter] ok: real Prisma adapter surface, dry-run terminal command, explicit execution controls, mocked Prisma transaction/rollback/idempotency/conflict behavior, zero relationships, retrieval isolation, runtime isolation, and read-only production preflight passed.");

function controls(overrides: Partial<{
  mode: "dry-run" | "execute" | "verify";
  token: boolean;
  scope: string;
  fingerprint: string;
  expectedCommit: string;
  workingTreeClean: boolean;
}> = {}): GofWave3bExecutionControls {
  const expectedCommit = overrides.expectedCommit ?? repository.expectedCommit;
  return Object.freeze({
    mode: overrides.mode ?? "execute",
    executionScope: overrides.scope ?? GOF_WAVE_3_AUTHORIZATION_SCOPE,
    environment: "production",
    confirmProduction: true,
    certifiedCandidateFingerprint: overrides.fingerprint ?? contract.evidenceFingerprint,
    repository: Object.freeze({
      ...repository,
      expectedCommit,
      workingTreeClean: overrides.workingTreeClean ?? true,
    }),
    operatorAuthorization: Object.freeze({
      authorizationId: "GOF_WAVE_3B_MOCK_AUTHORIZATION",
      operatorId: "PROJECT_ATLAS_TEST_OPERATOR",
      authorizedAt: "2026-07-26T00:00:00.000Z",
      tokenPresent: overrides.token ?? true,
      acknowledgesPersistenceNotRetrieval: true,
      acknowledgesNoRelationships: true,
      acknowledgesNoCustomerVisibility: true,
    }),
  });
}

function repositoryControl(): GofWave3bRepositoryControl {
  return Object.freeze({
    branch: "main",
    head: "eac5efdee2d420670219c973a1cafa0aa83b78f7",
    originMain: "eac5efdee2d420670219c973a1cafa0aa83b78f7",
    expectedCommit: "eac5efdee2d420670219c973a1cafa0aa83b78f7",
    workingTreeClean: true,
  });
}

type MockOptions = {
  partialColorado?: boolean;
  conflictingColorado?: boolean;
  companionConflictCount?: number;
  failOnObservationIndex?: number;
};

type MockState = {
  objects: Array<Record<string, string | null>>;
  aliases: Array<Record<string, string>>;
  sources: Array<Record<string, string>>;
  observations: Array<Record<string, string>>;
  eligibility: Array<Record<string, string | boolean>>;
  relationships: unknown[];
  propertyRelationships: unknown[];
  transactions: number;
};

function mockPrisma(options: MockOptions = {}) {
  let state: MockState = {
    objects: [],
    aliases: [],
    sources: [],
    observations: [],
    eligibility: [],
    relationships: [],
    propertyRelationships: [],
    transactions: 0,
  };
  if (options.partialColorado || options.conflictingColorado) {
    state.objects.push({
      id: "mock-colorado-1",
      objectType: "STATE",
      canonicalName: "Colorado",
      displayName: "Colorado",
      canonicalSlug: "colorado",
      lifecycleStatus: "DRAFT",
      visibility: options.conflictingColorado ? "PUBLIC_ELIGIBLE" : "INTERNAL_ONLY",
      convenienceParentId: null,
      mergedIntoId: null,
    });
  }
  const prisma = makeClient(() => state, (next) => {
    state = next;
  }, options);
  return Object.assign(prisma, {
    debug: () => clone(state),
  }) as unknown as PrismaClient & { debug(): MockState };
}

function makeClient(getState: () => MockState, setState: (state: MockState) => void, options: MockOptions) {
  return {
    $queryRaw(strings: TemplateStringsArray, ...values: unknown[]) {
      const sql = strings.join("?");
      const state = getState();
      if (sql.includes("AS geographic_objects")) {
        return Promise.resolve([{
          geographic_objects: 1 + state.objects.length,
          state_objects: state.objects.filter((item) => item.objectType === "STATE").length,
          colorado_named_objects: state.objects.filter((item) => item.canonicalName === "Colorado" || item.canonicalSlug === "colorado").length,
          geographic_relationships: state.relationships.length,
          property_geographic_relationships: state.propertyRelationships.length,
          state_enum_present: true,
          companion_conflicts: options.companionConflictCount ?? 0,
        }]);
      }
      if (sql.includes('FROM "GeographicObject"') && sql.includes('"objectType"::text = \'STATE\'') && sql.includes('"canonicalSlug" = \'colorado\'')) {
        return Promise.resolve(state.objects.filter((item) => item.objectType === "STATE" && item.canonicalSlug === "colorado").slice(0, 1));
      }
      if (sql.includes('INSERT INTO "GeographicObject"')) {
        const id = String(values[0]);
        state.objects.push({
          id,
          objectType: String(values[1]),
          canonicalName: String(values[2]),
          displayName: String(values[3]),
          canonicalSlug: String(values[4]),
          lifecycleStatus: String(values[5]),
          visibility: String(values[6]),
          convenienceParentId: values[7] === null ? null : String(values[7]),
          mergedIntoId: values[8] === null ? null : String(values[8]),
        });
        return Promise.resolve([{ id }]);
      }
      if (sql.includes("AS fingerprint")) {
        return Promise.resolve([{ fingerprint: GOF_WAVE_3_THORNTON_CERTIFIED_FINGERPRINT }]);
      }
      if (sql.includes("AS alias_count")) {
        const objectId = String(values[0]);
        const eligibility = state.eligibility.find((item) => item.objectId === objectId);
        return Promise.resolve([{
          alias_count: state.aliases.filter((item) => item.objectId === objectId).length,
          source_count: state.sources.length,
          observation_count: state.observations.filter((item) => item.objectId === objectId).length,
          eligibility_count: eligibility ? 1 : 0,
          relationship_count: 0,
          property_relationship_count: 0,
          all_eligibility_false: eligibility ? Object.entries(eligibility).filter(([key]) => key !== "objectId").every(([, value]) => value === false) : false,
        }]);
      }
      throw new Error(`unhandled mocked query: ${sql}`);
    },
    geographicObject: {
      findUnique: () => Promise.resolve(getState().objects.find((item) => item.objectType === "STATE" && item.canonicalSlug === "colorado") ?? null),
      create: ({ data, select }: { data: Record<string, string | null>; select: { id: true } }) => {
        const state = getState();
        const id = "mock-colorado-1";
        state.objects.push({ id, ...data });
        return Promise.resolve(select ? { id } : state.objects[state.objects.length - 1]);
      },
    },
    geographicSource: {
      upsert: ({ where, create }: { where: { canonicalName: string }; create: Record<string, string | boolean> }) => {
        const state = getState();
        const existing = state.sources.find((item) => item.canonicalName === where.canonicalName);
        if (existing) return Promise.resolve({ id: existing.id });
        const row = { id: `mock-source-${state.sources.length + 1}`, canonicalName: String(create.canonicalName) };
        state.sources.push(row);
        return Promise.resolve({ id: row.id });
      },
    },
    geographicAlias: {
      create: ({ data }: { data: Record<string, string | Date | undefined> }) => {
        getState().aliases.push({
          id: `mock-alias-${getState().aliases.length + 1}`,
          objectId: String(data.objectId),
          aliasText: String(data.aliasText),
          normalizedValue: String(data.normalizedValue),
        });
        return Promise.resolve({});
      },
    },
    geographicObservation: {
      create: ({ data }: { data: Record<string, unknown> }) => {
        const state = getState();
        if (options.failOnObservationIndex === state.observations.length) {
          throw new Error("forced mocked Prisma observation failure");
        }
        state.observations.push({
          id: `mock-observation-${state.observations.length + 1}`,
          objectId: String(data.objectId),
          observationKey: String(data.observationKey),
        });
        return Promise.resolve({});
      },
    },
    geographicEligibility: {
      create: ({ data }: { data: Record<string, string | boolean> }) => {
        getState().eligibility.push({ ...data });
        return Promise.resolve({});
      },
    },
    $transaction: async <T>(operation: (tx: Prisma.TransactionClient) => Promise<T>) => {
      const original = clone(getState());
      const working = clone(getState());
      const tx = makeClient(() => working, (next) => Object.assign(working, next), options) as unknown as Prisma.TransactionClient;
      try {
        const result = await operation(tx);
        working.transactions = original.transactions + 1;
        setState(working);
        return result;
      } catch (error) {
        setState(original);
        throw error;
      }
    },
  };
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
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

function listSourceFiles(root: string): string[] {
  if (!fs.existsSync(root)) return [];
  const stat = fs.statSync(root);
  if (stat.isFile()) return /\.(ts|tsx|js|jsx)$/.test(root) ? [root] : [];
  return fs.readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const child = path.join(root, entry.name);
    return entry.isDirectory() ? listSourceFiles(child) : /\.(ts|tsx|js|jsx)$/.test(child) ? [child] : [];
  });
}

async function readProductionBaseline(): Promise<{
  geographicObjectCount: number;
  stateObjectCount: number;
  coloradoNamedObjectCount: number;
  geographicRelationshipCount: number;
  propertyGeographicRelationshipCount: number;
  stateEnumPresent: boolean;
  thorntonFingerprint: string | null;
}> {
  const prisma = new PrismaClient();
  try {
    const [counts] = await prisma.$queryRaw<readonly [{
      geographic_objects: number;
      state_objects: number;
      colorado_named_objects: number;
      geographic_relationships: number;
      property_geographic_relationships: number;
      state_enum_present: boolean;
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
        ) AS state_enum_present
    `;
    const [thornton] = await prisma.$queryRaw<readonly [{ fingerprint: string }]>`
      SELECT concat_ws('|', id, "objectType"::text, "canonicalName", "canonicalSlug", "lifecycleStatus"::text, "visibility"::text, to_char("updatedAt" AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')) AS fingerprint
      FROM "GeographicObject"
      WHERE id = 'cms10utak0002qa0l8mu7gr8i'
    `;
    return {
      geographicObjectCount: counts.geographic_objects,
      stateObjectCount: counts.state_objects,
      coloradoNamedObjectCount: counts.colorado_named_objects,
      geographicRelationshipCount: counts.geographic_relationships,
      propertyGeographicRelationshipCount: counts.property_geographic_relationships,
      stateEnumPresent: counts.state_enum_present,
      thorntonFingerprint: thornton?.fingerprint ?? null,
    };
  } finally {
    await prisma.$disconnect();
  }
}
