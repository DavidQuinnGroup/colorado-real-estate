import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import {
  GIO_AUTHORIZED_OBJECT_TYPES,
  GIO_SAFE_ELIGIBILITY_DEFAULTS,
  assertGioAuthorizedObjectType,
  buildGioObjectIdempotencyKey,
  validateGioObjectCreateInput,
} from "../lib/gio/persistence.js";
import {
  GKC_FIXTURE_OBJECTS,
  GKC_SAFE_ELIGIBILITY_DEFAULTS,
  GKC_SCHEMA_KEY_REGISTRY,
  createGkcRepresentativeObservations,
  validateGkcSchemaKeyObservation,
  validateGkcSourceRequirement,
} from "../lib/gkc/fixtureGovernance.js";
import {
  EIP_SPRINT_6_AUTHORIZED_CANONICAL_NAME,
  EIP_SPRINT_6_WRITE_LIMITS,
  buildEipSprint6PilotPlan,
  validateEipSprint6Invocation,
} from "../lib/eip/controlledProductionInternalGeographicPersistencePilot.js";
import {
  EIP_SPRINT_7_CERTIFIED_OBJECT_ID,
  EIP_SPRINT_7_CERTIFIED_SCOPE,
} from "../lib/eip/productionInternalGeographicReadAdapter.js";

const schema = fs.readFileSync("prisma/schema.prisma", "utf8");
const packageJson = fs.readFileSync("package.json", "utf8");
const workerTsconfig = fs.readFileSync("tsconfig.worker.json", "utf8");
const gofReport = fs.readFileSync("docs/project-atlas/executive-library/GOF-1.0-WAVE-1-GOVERNED-STATE-OBJECT-TYPE-FOUNDATION.md", "utf8");

const stateMigrationPath = "prisma/migrations/20260726183000_gof_wave1_state_object_type_foundation/migration.sql";
const stateMigration = fs.readFileSync(stateMigrationPath, "utf8");
const objectTypeBlock = schema.match(/enum GeographicObjectType \{([\s\S]*?)\}/)?.[1] ?? "";
const objectTypeValues = objectTypeBlock
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean);

assert.deepEqual(objectTypeValues, [...GIO_AUTHORIZED_OBJECT_TYPES]);
assert.ok(GIO_AUTHORIZED_OBJECT_TYPES.includes("STATE"));
assert.doesNotThrow(() => assertGioAuthorizedObjectType("STATE"));
assert.equal(buildGioObjectIdempotencyKey({
  objectType: "STATE",
  canonicalName: "Synthetic Example State",
  displayName: "Synthetic Example State",
  canonicalSlug: " Synthetic Example State ",
}), "GIO_OBJECT|STATE|synthetic-example-state");

assert.ok(stateMigration.includes("ALTER TYPE \"GeographicObjectType\" ADD VALUE 'STATE'"));
for (const forbiddenSql of [/INSERT\s+INTO/i, /UPDATE\s+"/i, /DELETE\s+FROM/i, /TRUNCATE/i, /DROP\s+/i, /CREATE\s+TABLE/i]) {
  assert.equal(forbiddenSql.test(stateMigration), false, `GOF Wave 1 migration contains prohibited SQL: ${forbiddenSql}`);
}

const stateFixture = GKC_FIXTURE_OBJECTS.find((object) => object.objectType === "STATE");
assert.ok(stateFixture);
assert.equal(stateFixture.synthetic, true);
assert.equal(stateFixture.canonicalName.includes("Colorado"), false);
assert.ok(stateFixture.id.startsWith("synthetic-"));

const stateSchemaKey = GKC_SCHEMA_KEY_REGISTRY.find((entry) => entry.key === "government.state_identity.v1");
assert.ok(stateSchemaKey);
assert.deepEqual(stateSchemaKey.applicableObjectTypes, ["STATE"]);
assert.equal(stateSchemaKey.publicDisplayEligibleByDefault, false);

const observations = createGkcRepresentativeObservations();
const stateObservation = observations.find((observation) => observation.objectType === "STATE");
assert.ok(stateObservation);
assert.equal(stateObservation.synthetic, true);
assert.equal(stateObservation.reviewStatus, "PENDING_REVIEW");
assert.deepEqual(stateObservation.eligibility, GKC_SAFE_ELIGIBILITY_DEFAULTS);
assert.deepEqual(stateObservation.eligibility, GIO_SAFE_ELIGIBILITY_DEFAULTS);
validateGkcSourceRequirement(stateObservation);
validateGkcSchemaKeyObservation(stateObservation);
assert.throws(() => validateGkcSchemaKeyObservation({ ...stateObservation, objectType: "MUNICIPALITY" }));

assert.deepEqual(EIP_SPRINT_6_WRITE_LIMITS, {
  geographicObjects: 1,
  aliases: 2,
  sources: 1,
  observations: 6,
  eligibilityRows: 1,
  relationships: 0,
  propertyRelationships: 0,
});
const sprint6Plan = buildEipSprint6PilotPlan();
assert.equal(sprint6Plan.subject.canonicalName, EIP_SPRINT_6_AUTHORIZED_CANONICAL_NAME);
assert.equal(sprint6Plan.subject.objectType, "MUNICIPALITY");
assert.throws(() => validateEipSprint6Invocation({
  mode: "execute",
  subject: "Colorado",
  scope: "CONTROLLED_PRODUCTION_INTERNAL_GEOGRAPHIC_PERSISTENCE_PILOT",
  invocationId: "GOF_WAVE_1_COLORADO_BLOCKED",
  authorized: true,
}), /Thornton/);

assert.equal(EIP_SPRINT_7_CERTIFIED_OBJECT_ID, "cms10utak0002qa0l8mu7gr8i");
assert.equal(EIP_SPRINT_7_CERTIFIED_SCOPE, "PRODUCTION_INTERNAL_GEOGRAPHIC_READ_ADAPTER");

for (const forbiddenRuntimeRoot of ["app", "components", "lib/search", "lib/mls", "lib/typesense", "lib/alerts", "lib/email", "workers"]) {
  for (const file of listSourceFiles(forbiddenRuntimeRoot)) {
    const contents = fs.readFileSync(file, "utf8");
    assert.equal(contents.includes("synthetic-gio-state-example"), false, `Runtime file imports GOF Wave 1 state fixture: ${file}`);
    assert.equal(contents.includes("government.state_identity.v1"), false, `Runtime file imports GOF Wave 1 state schema key: ${file}`);
    assert.equal(contents.includes("GOF_WAVE_1"), false, `Runtime file imports GOF Wave 1 safety identity: ${file}`);
  }
}

for (const integrationRoot of ["app/search", "components/search", "components/map", "lib/search", "lib/typesense", "lib/mls", "lib/alerts", "lib/email"]) {
  for (const file of listSourceFiles(integrationRoot)) {
    const contents = fs.readFileSync(file, "utf8");
    assert.equal(/\bSTATE\b/.test(contents), false, `Downstream/runtime integration references STATE: ${file}`);
  }
}

const productionFiles = [
  "lib/eip/controlledProductionInternalGeographicPersistencePilot.ts",
  "lib/eip/productionInternalGeographicReadAdapter.ts",
  "lib/ekcp/enterpriseGeographicConsumerAdapter.ts",
];
for (const file of productionFiles) {
  const contents = fs.readFileSync(file, "utf8");
  assert.equal(contents.includes("synthetic-gio-state-example"), false, `Production path references synthetic state fixture: ${file}`);
  assert.equal(contents.includes("government.state_identity.v1"), false, `Production path references state schema key: ${file}`);
}

assert.equal(hasColoradoGovernedInstance(), false);
assert.ok(packageJson.includes("check:gof-wave-1-state-object-type-foundation"));
assert.ok(workerTsconfig.includes("scripts/checkGofWave1StateObjectTypeFoundation.ts"));
assert.match(gofReport, /STATE CAPABILITY STATUS: `IMPLEMENTED_AS_OBJECT_TYPE_FOUNDATION`/);
assert.match(gofReport, /COLORADO SUBJECT STATUS: `NOT_GOVERNED`/);
assert.match(gofReport, /PERSISTENCE AUTHORIZATION: `NOT_AUTHORIZED`/);
assert.match(gofReport, /RETRIEVAL AUTHORIZATION: `NOT_AUTHORIZED`/);
assert.match(gofReport, /CUSTOMER VISIBILITY STATUS: `NOT_AUTHORIZED`/);

console.log(
  "[gof-wave-1-state-object-type-foundation] ok: STATE object-type capability, synthetic non-approved fixture, additive enum migration, Thornton-only persistence/read preservation, no Colorado governed instance, no relationships, no runtime/customer/downstream integration, and separated quality/readiness/approval boundaries passed.",
);

function listSourceFiles(root: string): string[] {
  if (!fs.existsSync(root)) return [];
  const stat = fs.statSync(root);
  if (stat.isFile()) return /\.(ts|tsx|js|jsx)$/.test(root) ? [root] : [];
  return fs.readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const child = path.join(root, entry.name);
    return entry.isDirectory() ? listSourceFiles(child) : /\.(ts|tsx|js|jsx)$/.test(child) ? [child] : [];
  });
}

function hasColoradoGovernedInstance(): boolean {
  const inspectedFiles = [
    "lib/gkc/fixtureGovernance.ts",
    "lib/gio/persistence.ts",
    "lib/eip/internalGeographicPersistenceProof.ts",
    "lib/eip/controlledProductionInternalGeographicPersistencePilot.ts",
    "lib/eip/productionInternalGeographicReadAdapter.ts",
    "lib/ekcp/enterpriseGeographicConsumerAdapter.ts",
  ];

  return inspectedFiles.some((file) => {
    const contents = fs.readFileSync(file, "utf8");
    return /objectType:\s*"STATE"[\s\S]{0,240}canonicalName:\s*"Colorado"/.test(contents) ||
      /canonicalName:\s*"Colorado"[\s\S]{0,240}objectType:\s*"STATE"/.test(contents) ||
      /approvedInstance:\s*true/.test(contents);
  });
}
