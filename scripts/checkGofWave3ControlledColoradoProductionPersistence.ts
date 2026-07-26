import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

import {
  GOF_WAVE_3_AUTHORIZATION_SCOPE,
  GOF_WAVE_3_THORNTON_CERTIFIED_FINGERPRINT,
  GOF_WAVE_3_WRITE_CEILING,
  assertGofWave3ExecutionAuthorization,
  buildGofWave3ColoradoPersistenceContract,
  evaluateGofWave3DryRun,
  planGofWave3AuthorizedExecution,
  type GofWave3ProductionState,
} from "../lib/gof/coloradoControlledProductionPersistence.js";
import { GOF_WAVE_2_COLORADO_CANDIDATE_ID } from "../lib/gof/coloradoGovernedInstanceFoundation.js";
import {
  EIP_SPRINT_6_AUTHORIZED_CANONICAL_NAME,
  EIP_SPRINT_6_WRITE_LIMITS,
  buildEipSprint6PilotPlan,
} from "../lib/eip/controlledProductionInternalGeographicPersistencePilot.js";
import {
  EIP_SPRINT_7_CERTIFIED_CANONICAL_NAME,
  EIP_SPRINT_7_CERTIFIED_OBJECT_ID,
} from "../lib/eip/productionInternalGeographicReadAdapter.js";

const packageJson = fs.readFileSync("package.json", "utf8");
const workerTsconfig = fs.readFileSync("tsconfig.worker.json", "utf8");
const reportPath = "docs/project-atlas/executive-library/GOF-1.0-WAVE-3-CONTROLLED-COLORADO-PRODUCTION-PERSISTENCE.md";
const report = fs.existsSync(reportPath) ? fs.readFileSync(reportPath, "utf8") : "";
const boundarySource = fs.readFileSync("lib/gof/coloradoControlledProductionPersistence.ts", "utf8");
const wave2Source = fs.readFileSync("lib/gof/coloradoGovernedInstanceFoundation.ts", "utf8");

const contract = buildGofWave3ColoradoPersistenceContract();

assert.equal(contract.sourceCandidateId, GOF_WAVE_2_COLORADO_CANDIDATE_ID);
assert.equal(contract.modeDefault, "dry-run");
assert.equal(contract.object.id, "DATABASE_GENERATED_ON_AUTHORIZED_EXECUTION");
assert.equal(contract.object.objectType, "STATE");
assert.equal(contract.object.canonicalName, "Colorado");
assert.equal(contract.object.displayName, "Colorado");
assert.equal(contract.object.canonicalSlug, "colorado");
assert.equal(contract.object.lifecycleStatus, "DRAFT");
assert.equal(contract.object.visibility, "INTERNAL_ONLY");
assert.equal(contract.object.convenienceParentId, null);
assert.equal(contract.object.mergedIntoId, null);
assert.equal(contract.object.idempotencyKey, "GIO_OBJECT|STATE|colorado");
assert.deepEqual(contract.aliases.map((alias) => alias.aliasText), ["CO", "State of Colorado"]);
assert.equal(contract.sources.length, 5);
assert.deepEqual(contract.observations.map((item) => item.reviewStatus), ["REVIEWED", "REVIEWED", "REVIEWED", "REVIEWED", "REVIEWED"]);
assert.deepEqual(contract.eligibility, {
  internalUse: false,
  searchEligible: false,
  mapEligible: false,
  publicPageEligible: false,
  indexingEligible: false,
  propertyEnrichment: false,
  marketAnalytics: false,
});
assert.deepEqual(contract.plannedWriteCeiling, GOF_WAVE_3_WRITE_CEILING);
assert.equal(contract.relationshipsAuthorized, false);
assert.equal(contract.productionRetrievalAuthorized, false);
assert.equal(contract.runtimeActivationAuthorized, false);
assert.equal(contract.customerVisibilityAuthorized, false);
assert.match(contract.evidenceFingerprint, /^[a-f0-9]{64}$/);

assert.throws(() => assertGofWave3ExecutionAuthorization(null), /explicit authorization/);
assert.throws(() => assertGofWave3ExecutionAuthorization({
  authorized: true,
  authorizationScope: "WRONG_SCOPE",
  authorizationId: "AUTH",
  operator: "operator",
  authorizedAt: "2026-07-26T00:00:00.000Z",
} as unknown as Parameters<typeof assertGofWave3ExecutionAuthorization>[0]), /scope mismatch/);

const readyState: GofWave3ProductionState = Object.freeze({
  geographicObjectCount: 1,
  stateObjectCount: 0,
  coloradoNamedObjectCount: 0,
  geographicRelationshipCount: 0,
  propertyGeographicRelationshipCount: 0,
  matchingColoradoObject: null,
  matchingColoradoSupportState: "NONE",
  stateEnumPresent: true,
  thorntonFingerprint: GOF_WAVE_3_THORNTON_CERTIFIED_FINGERPRINT,
});
const dryRun = evaluateGofWave3DryRun(readyState);
assert.equal(dryRun.status, "DRY_RUN_READY");
assert.equal(dryRun.dryRun, true);
assert.deepEqual(dryRun.writesPerformed, zeroWrites());
assert.deepEqual(dryRun.proposedWritesIfAuthorized, GOF_WAVE_3_WRITE_CEILING);

const noopState: GofWave3ProductionState = Object.freeze({
  ...readyState,
  stateObjectCount: 1,
  coloradoNamedObjectCount: 1,
  matchingColoradoSupportState: "COMPLETE",
  matchingColoradoObject: {
    id: "database-id",
    objectType: "STATE",
    canonicalName: "Colorado",
    displayName: "Colorado",
    canonicalSlug: "colorado",
    lifecycleStatus: "DRAFT",
    visibility: "INTERNAL_ONLY",
    convenienceParentId: null,
    mergedIntoId: null,
  },
});
const noop = evaluateGofWave3DryRun(noopState);
assert.equal(noop.status, "DRY_RUN_IDEMPOTENT_NOOP");
assert.deepEqual(noop.proposedWritesIfAuthorized, zeroWrites());

const partialPriorWriteState: GofWave3ProductionState = Object.freeze({
  ...noopState,
  matchingColoradoSupportState: "PARTIAL_OR_CONFLICTING",
});
const partialPriorWrite = evaluateGofWave3DryRun(partialPriorWriteState);
assert.equal(partialPriorWrite.status, "BLOCKED_SCHEMA_OR_DATA_MISMATCH");
assert.ok(partialPriorWrite.blockingFailures.some((failure) => failure.includes("partial or conflicting")));

const conflictState: GofWave3ProductionState = Object.freeze({
  ...noopState,
  matchingColoradoObject: {
    ...noopState.matchingColoradoObject!,
    visibility: "PUBLIC_ELIGIBLE",
  },
});
const conflict = evaluateGofWave3DryRun(conflictState);
assert.equal(conflict.status, "BLOCKED_SCHEMA_OR_DATA_MISMATCH");
assert.ok(conflict.blockingFailures.some((failure) => failure.includes("does not match")));

const enumMissingState = Object.freeze({
  ...readyState,
  stateEnumPresent: false,
});
const enumMissing = evaluateGofWave3DryRun(enumMissingState);
assert.equal(enumMissing.status, "BLOCKED_SCHEMA_OR_DATA_MISMATCH");
assert.ok(enumMissing.blockingFailures.some((failure) => failure.includes("enum does not expose STATE")));

const executionPlan = planGofWave3AuthorizedExecution(readyState, {
  authorized: true,
  authorizationScope: GOF_WAVE_3_AUTHORIZATION_SCOPE,
  authorizationId: "GOF_WAVE_3_TEST_ONLY_AUTHORIZATION",
  operator: "PROJECT_ATLAS_TEST",
  authorizedAt: "2026-07-26T00:00:00.000Z",
});
assert.equal(executionPlan.executionSafety, "PURE_PLAN_ONLY_NO_DATABASE_CLIENT");
assert.deepEqual(executionPlan.plannedWrites, GOF_WAVE_3_WRITE_CEILING);

assert.deepEqual(EIP_SPRINT_6_WRITE_LIMITS, {
  geographicObjects: 1,
  aliases: 2,
  sources: 1,
  observations: 6,
  eligibilityRows: 1,
  relationships: 0,
  propertyRelationships: 0,
});
assert.equal(buildEipSprint6PilotPlan().subject.canonicalName, EIP_SPRINT_6_AUTHORIZED_CANONICAL_NAME);
assert.equal(EIP_SPRINT_7_CERTIFIED_OBJECT_ID, "cms10utak0002qa0l8mu7gr8i");
assert.equal(EIP_SPRINT_7_CERTIFIED_CANONICAL_NAME, "Thornton");

for (const prohibited of ["@prisma/client", "PrismaClient", "prisma.", "DATABASE_URL", "app/api", "route.ts"]) {
  assert.equal(boundarySource.includes(prohibited), false, `GOF Wave 3 boundary module contains prohibited persistence/runtime dependency: ${prohibited}`);
}
for (const pattern of mutationCallPatterns()) {
  assert.equal(pattern.test(boundarySource), false, `GOF Wave 3 boundary module contains prohibited mutation call: ${pattern}`);
}
assert.equal(boundarySource.includes("EIP_SPRINT_7_CERTIFIED_OBJECT_ID"), false, "Wave 3 must not consume the Sprint 7 read implementation.");
assert.equal(wave2Source.includes("GOF_WAVE_3"), false, "Wave 2 foundation must not depend on Wave 3.");

for (const runtimeRoot of ["app", "components", "lib/search", "lib/mls", "lib/typesense", "lib/alerts", "lib/email", "workers"]) {
  for (const file of listSourceFiles(runtimeRoot)) {
    const contents = fs.readFileSync(file, "utf8");
    assert.equal(contents.includes("GOF_WAVE_3"), false, `Runtime file references GOF Wave 3: ${file}`);
    assert.equal(contents.includes("coloradoControlledProductionPersistence"), false, `Runtime file imports Wave 3 persistence boundary: ${file}`);
  }
}

for (const productionFile of [
  "lib/eip/controlledProductionInternalGeographicPersistencePilot.ts",
  "lib/eip/productionInternalGeographicReadAdapter.ts",
  "lib/ekcp/enterpriseGeographicConsumerAdapter.ts",
]) {
  const contents = fs.readFileSync(productionFile, "utf8");
  assert.equal(contents.includes("GOF_WAVE_3"), false, `Existing production path references GOF Wave 3: ${productionFile}`);
}

assert.ok(packageJson.includes("check:gof-wave-3-controlled-colorado-production-persistence"));
assert.ok(workerTsconfig.includes("scripts/checkGofWave3ControlledColoradoProductionPersistence.ts"));
assert.match(report, /GOF WAVE 3 STATUS: `CERTIFIED_DRY_RUN_FOUNDATION`/);
assert.match(report, /PRODUCTION WRITE STATUS: `NOT_EXECUTED`/);
assert.match(report, /PRODUCTION RETRIEVAL STATUS: `NOT_AUTHORIZED`/);
assert.match(report, /RELATIONSHIP STATUS: `NOT_AUTHORIZED`/);
assert.match(report, /CUSTOMER VISIBILITY STATUS: `NOT_AUTHORIZED`/);

const productionState = await readProductionState();
const productionDryRun = evaluateGofWave3DryRun(productionState);
assert.equal(productionDryRun.status, "DRY_RUN_IDEMPOTENT_NOOP");
assert.deepEqual(productionDryRun.writesPerformed, zeroWrites());
assert.deepEqual(productionDryRun.proposedWritesIfAuthorized, zeroWrites());
assert.equal(productionState.geographicObjectCount, 2);
assert.equal(productionState.stateObjectCount, 1);
assert.equal(productionState.coloradoNamedObjectCount, 1);
assert.equal(productionState.geographicRelationshipCount, 0);
assert.equal(productionState.propertyGeographicRelationshipCount, 0);
assert.equal(productionState.matchingColoradoSupportState, "COMPLETE");
assert.equal(productionState.stateEnumPresent, true);
assert.equal(productionState.thorntonFingerprint, GOF_WAVE_3_THORNTON_CERTIFIED_FINGERPRINT);

console.log(
  "[gof-wave-3-controlled-colorado-production-persistence] ok: controlled Colorado production persistence contract, dry-run proof, zero writes, idempotency, fail-closed conflicts, Thornton preservation, no relationships, no retrieval, no runtime/customer/downstream integration, and read-only production inspection passed.",
);

function zeroWrites() {
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

function mutationCallPatterns(): RegExp[] {
  return [
    /\bprisma\.[\s\S]*\.create\s*\(/,
    /\bprisma\.[\s\S]*\.createMany\s*\(/,
    /\bprisma\.[\s\S]*\.update\s*\(/,
    /\bprisma\.[\s\S]*\.updateMany\s*\(/,
    /\bprisma\.[\s\S]*\.upsert\s*\(/,
    /\bprisma\.[\s\S]*\.delete\s*\(/,
    /\bprisma\.[\s\S]*\.deleteMany\s*\(/,
    /\$executeRaw/,
    /\$transaction/,
  ];
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

async function readProductionState(): Promise<GofWave3ProductionState> {
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

    const [matchingColoradoObject] = await prisma.$queryRaw<readonly [{
      id: string;
      object_type: string;
      canonical_name: string;
      display_name: string;
      canonical_slug: string;
      lifecycle_status: string;
      visibility: string;
      convenience_parent_id: string | null;
      merged_into_id: string | null;
    }]>`
      SELECT id, "objectType"::text AS object_type, "canonicalName" AS canonical_name,
        "displayName" AS display_name, "canonicalSlug" AS canonical_slug,
        "lifecycleStatus"::text AS lifecycle_status, "visibility"::text AS visibility,
        "convenienceParentId" AS convenience_parent_id, "mergedIntoId" AS merged_into_id
      FROM "GeographicObject"
      WHERE "objectType"::text = 'STATE' AND "canonicalSlug" = 'colorado'
      LIMIT 1
    `;

    const [thornton] = await prisma.$queryRaw<readonly [{
      fingerprint: string;
    }]>`
      SELECT concat_ws('|', id, "objectType"::text, "canonicalName", "canonicalSlug", "lifecycleStatus"::text, "visibility"::text, to_char("updatedAt" AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')) AS fingerprint
      FROM "GeographicObject"
      WHERE id = 'cms10utak0002qa0l8mu7gr8i'
    `;

    const supportState = matchingColoradoObject
      ? await readMatchingSupportState(prisma, matchingColoradoObject.id)
      : counts.colorado_named_objects === 0
        ? "NONE"
        : "PARTIAL_OR_CONFLICTING";

    return Object.freeze({
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
      matchingColoradoSupportState: supportState,
      stateEnumPresent: counts.state_enum_present,
      thorntonFingerprint: thornton?.fingerprint ?? null,
    });
  } finally {
    await prisma.$disconnect();
  }
}

async function readMatchingSupportState(
  prisma: PrismaClient,
  objectId: string,
): Promise<GofWave3ProductionState["matchingColoradoSupportState"]> {
  const [support] = await prisma.$queryRaw<readonly [{
    alias_count: number;
    source_count: number;
    observation_count: number;
    eligibility_count: number;
    relationship_count: number;
    property_relationship_count: number;
  }]>`
    SELECT
      (SELECT count(*)::int FROM "GeographicAlias" WHERE "objectId" = ${objectId}) AS alias_count,
      (SELECT count(*)::int FROM "GeographicSource" WHERE "canonicalName" IN (
        'State of Colorado',
        'Colorado GIS',
        'U.S. Census Bureau',
        'USGS/GNIS',
        'PROJECT ATLAS - REAL ESTATE DATA TOOLS'
      )) AS source_count,
      (SELECT count(*)::int FROM "GeographicObservation" WHERE "objectId" = ${objectId}) AS observation_count,
      (SELECT count(*)::int FROM "GeographicEligibility" WHERE "objectId" = ${objectId}) AS eligibility_count,
      (SELECT count(*)::int FROM "GeographicRelationship" WHERE "sourceObjectId" = ${objectId} OR "targetObjectId" = ${objectId}) AS relationship_count,
      (SELECT count(*)::int FROM "PropertyGeographicRelationship" WHERE "geographicObjectId" = ${objectId}) AS property_relationship_count
  `;
  return support.alias_count === GOF_WAVE_3_WRITE_CEILING.aliases &&
    support.source_count === GOF_WAVE_3_WRITE_CEILING.sources &&
    support.observation_count === GOF_WAVE_3_WRITE_CEILING.observations &&
    support.eligibility_count === GOF_WAVE_3_WRITE_CEILING.eligibilityRows &&
    support.relationship_count === 0 &&
    support.property_relationship_count === 0
    ? "COMPLETE"
    : "PARTIAL_OR_CONFLICTING";
}
