import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import {
  retrieveEipSprint7ProductionInternalGeographicReadAdapter,
} from "../lib/eip/productionInternalGeographicReadAdapter.js";
import {
  ENTERPRISE_GEOGRAPHIC_READ_CERTIFIED_SUBJECT_ID,
  type EnterpriseGeographicReadSource,
} from "../lib/enterprise-knowledge/geographicReadContract.js";
import {
  assertEkcpSprint1CertifiedSubject,
  createEkcpEnterpriseGeographicConsumerAdapter,
  readEkcpEnterpriseGeographicConsumerAdapter,
  type EkcpEnterpriseConsumer,
} from "../lib/ekcp/enterpriseGeographicConsumerAdapter.js";

const adapterPath = "lib/ekcp/enterpriseGeographicConsumerAdapter.ts";
const sharedContractPath = "lib/enterprise-knowledge/geographicReadContract.ts";
const packageJsonPath = "package.json";
const workerTsconfigPath = "tsconfig.worker.json";
const charterPath = "docs/project-atlas/executive-library/EKCP-1.0-SPRINT-1-ENTERPRISE-GEOGRAPHIC-CONSUMER-ADAPTER-CHARTER.md";
const reportPath = "docs/project-atlas/executive-library/EKCP-1.0-SPRINT-1-ENTERPRISE-GEOGRAPHIC-CONSUMER-ADAPTER.md";

const adapterSource = fs.readFileSync(adapterPath, "utf8");
const sharedContractSource = fs.readFileSync(sharedContractPath, "utf8");
const packageJson = fs.readFileSync(packageJsonPath, "utf8");
const workerTsconfig = fs.readFileSync(workerTsconfigPath, "utf8");
const charter = fs.readFileSync(charterPath, "utf8");
const report = fs.readFileSync(reportPath, "utf8");

assert.match(adapterSource, /geographicReadContract/);
assert.equal(adapterSource.includes("productionInternalGeographicReadAdapter"), false, "EKCP consumer adapter must not import the Sprint 7 implementation module.");
assert.equal(adapterSource.includes("@prisma/client"), false, "EKCP consumer adapter must not import Prisma types or client.");
assert.equal(adapterSource.includes("PrismaClient"), false, "EKCP consumer adapter must not accept PrismaClient.");
assert.equal(adapterSource.includes("prisma."), false, "EKCP consumer adapter must not call Prisma directly.");
assert.equal(adapterSource.includes("DATABASE_URL"), false, "EKCP consumer adapter must not depend on database environment variables.");
assert.equal(adapterSource.includes("fetch("), false, "EKCP consumer adapter must not call routes or external services.");
assert.equal(adapterSource.includes("../scripts"), false, "EKCP consumer adapter must not import scripts.");
assert.equal(adapterSource.includes("dist/scripts"), false, "EKCP consumer adapter must not import built scripts.");

for (const prohibited of ["@prisma/client", "PrismaClient", "prisma.", "DATABASE_URL", "fetch(", "NextRequest", "NextResponse", "app/api", "route.ts", "../eip/productionInternalGeographicReadAdapter"]) {
  assert.equal(sharedContractSource.includes(prohibited), false, `Shared geographic read contract contains prohibited dependency: ${prohibited}`);
}

for (const pattern of [
  /\.create\s*\(/,
  /\.createMany\s*\(/,
  /\.update\s*\(/,
  /\.updateMany\s*\(/,
  /\.upsert\s*\(/,
  /\.delete\s*\(/,
  /\.deleteMany\s*\(/,
  /\.\$transaction\s*\(/,
]) {
  assert.equal(pattern.test(adapterSource), false, `EKCP consumer adapter must not contain mutation call pattern ${pattern}.`);
  assert.equal(pattern.test(sharedContractSource), false, `Shared geographic read contract must not contain mutation call pattern ${pattern}.`);
}

for (const runtimeRoot of ["app", "components", "lib/search", "lib/typesense", "lib/runtime", "workers"]) {
  if (!fs.existsSync(runtimeRoot)) continue;
  for (const file of listFiles(runtimeRoot)) {
    if (!/\.(ts|tsx|js|jsx)$/.test(file)) continue;
    const contents = fs.readFileSync(file, "utf8");
    assert.equal(
      contents.includes("enterpriseGeographicConsumerAdapter"),
      false,
      `EKCP Sprint 1 must not be integrated into runtime/search/map/customer code: ${file}`,
    );
  }
}

assert.equal(fs.existsSync("app/api/admin/enterprise/geographic-consumer-adapter/route.ts"), false, "EKCP Sprint 1 must not create an API route.");

const prismaDiff = execFileSync("git", ["diff", "--name-only", "--", "prisma/schema.prisma", "prisma/migrations"], { encoding: "utf8" })
  .trim()
  .split("\n")
  .filter(Boolean);
assert.ok(
  prismaDiff.length === 0 || (prismaDiff.length === 1 && prismaDiff[0] === "prisma/schema.prisma"),
  "EKCP Sprint 1 allows only the GOF Wave 1 STATE enum schema capability diff before certification closure.",
);
const gofWave1Migration = fs.readFileSync("prisma/migrations/20260726183000_gof_wave1_state_object_type_foundation/migration.sql", "utf8");
assert.match(gofWave1Migration, /ALTER TYPE "GeographicObjectType" ADD VALUE 'STATE'/);
assert.equal(/INSERT\s+INTO|UPDATE\s+"|DELETE\s+FROM|TRUNCATE|DROP\s+/i.test(gofWave1Migration), false, "GOF Wave 1 migration must not mutate production data.");

const readSource: EnterpriseGeographicReadSource = (request) =>
  retrieveEipSprint7ProductionInternalGeographicReadAdapter(fakePrisma(certifiedRows(), []) as never, request);
const consumerAdapter = createEkcpEnterpriseGeographicConsumerAdapter(readSource);

for (const consumer of ["SEARCH", "MAPS", "PROPERTY_INTELLIGENCE", "AI", "EXECUTIVE_INTELLIGENCE", "FUTURE_ENTERPRISE_SERVICE"] as const satisfies readonly EkcpEnterpriseConsumer[]) {
  const result = await consumerAdapter.readPlaceForEnterpriseConsumer({
    consumer,
    intent: "PLACE_PROFILE",
    place: { certifiedSubjectId: ENTERPRISE_GEOGRAPHIC_READ_CERTIFIED_SUBJECT_ID },
    requestId: `EKCP-S1-${consumer}-VALIDATION-001`,
  });

  assert.equal(result.success, true);
  assert.equal(result.executed, false);
  assert.equal(result.writesPerformed, 0);
  assert.equal(result.subject.subjectId, ENTERPRISE_GEOGRAPHIC_READ_CERTIFIED_SUBJECT_ID);
  assert.equal(result.placeProfile?.knownAs.length, 2);
  assert.equal(result.placeProfile?.sourceSummary.length, 1);
  assert.equal(result.placeProfile?.evidenceStatements.length, 6);
  assert.equal(result.readSource.lookupMethod, "CERTIFIED_SUBJECT_ID");
  assert.equal(result.readSource.subjectId, ENTERPRISE_GEOGRAPHIC_READ_CERTIFIED_SUBJECT_ID);
  assert.equal(assertEkcpSprint1CertifiedSubject(result), true);
  assert.deepEqual(Object.values(result.activationBoundary), [false, false, false, false, false, false, false]);
  assert.deepEqual(Object.values(result.governanceBoundaries), [false, false, false, false, false]);
}

const canonicalResult = await readEkcpEnterpriseGeographicConsumerAdapter(
  (request) => retrieveEipSprint7ProductionInternalGeographicReadAdapter(fakePrisma(certifiedRows(), []) as never, request),
  {
    consumer: "EXECUTIVE_INTELLIGENCE",
    intent: "GOVERNANCE_SUMMARY",
    place: { canonicalPlaceName: "Thornton" },
    requestId: "EKCP-S1-CANONICAL-VALIDATION-001",
  },
);
assert.equal(canonicalResult.success, true);
assert.equal(canonicalResult.readSource.lookupMethod, "CANONICAL_PLACE_NAME");

const aliasResult = await readEkcpEnterpriseGeographicConsumerAdapter(
  (request) => retrieveEipSprint7ProductionInternalGeographicReadAdapter(fakePrisma(certifiedRows(), []) as never, request),
  {
    consumer: "FUTURE_ENTERPRISE_SERVICE",
    intent: "ACTIVATION_BOUNDARY",
    place: { approvedAlias: "City of Thornton" },
    requestId: "EKCP-S1-ALIAS-VALIDATION-001",
  },
);
assert.equal(aliasResult.success, true);
assert.equal(aliasResult.readSource.lookupMethod, "APPROVED_ALIAS");

const unauthorizedResult = await readEkcpEnterpriseGeographicConsumerAdapter(
  (request) => retrieveEipSprint7ProductionInternalGeographicReadAdapter(fakePrisma(certifiedRows(), []) as never, request),
  {
    consumer: "SEARCH",
    intent: "PLACE_PROFILE",
    place: { certifiedSubjectId: "not-certified" },
    requestId: "EKCP-S1-UNAUTHORIZED-VALIDATION-001",
  },
);
assert.equal(unauthorizedResult.success, false);
assert.equal(unauthorizedResult.placeProfile, null);
assert.deepEqual(unauthorizedResult.blockingFailures, ["OBJECT_ID_NOT_AUTHORIZED"]);

const mutationCalls: string[] = [];
await readEkcpEnterpriseGeographicConsumerAdapter(
  (request) => retrieveEipSprint7ProductionInternalGeographicReadAdapter(fakePrisma(certifiedRows(), mutationCalls) as never, request),
  {
    consumer: "MAPS",
    intent: "PLACE_PROFILE",
    place: { certifiedSubjectId: ENTERPRISE_GEOGRAPHIC_READ_CERTIFIED_SUBJECT_ID },
  },
);
assert.deepEqual(mutationCalls, [], "EKCP Sprint 1 validation detected unexpected persistence mutation usage.");

assert.ok(packageJson.includes("check:ekcp-sprint-1-enterprise-geographic-consumer-adapter"));
assert.ok(workerTsconfig.includes("lib/enterprise-knowledge/**/*.ts"));
assert.ok(workerTsconfig.includes("lib/ekcp/**/*.ts"));
assert.ok(workerTsconfig.includes("scripts/checkEkcpSprint1EnterpriseGeographicConsumerAdapter.ts"));
assert.match(charter, /Quality != Readiness/);
assert.match(charter, /Consumption != Customer Visibility/);
assert.match(report, /Dependency graph/);
assert.match(report, /no Search integration/);
assert.match(report, /no Map integration/);
assert.match(report, /no AI integration/);

console.log(
  "[ekcp-sprint-1-enterprise-geographic-consumer-adapter] ok: consumer adapter consumes only the Sprint 7 production read adapter contract, exposes business-domain geography, preserves governance boundaries, performs no writes, and has no Search, Map, AI, runtime, or customer-visible integration.",
);

function certifiedRows() {
  const date = new Date("2026-07-25T00:00:00.000Z");
  const object = {
    id: ENTERPRISE_GEOGRAPHIC_READ_CERTIFIED_SUBJECT_ID,
    objectType: "MUNICIPALITY",
    canonicalName: "Thornton",
    displayName: "Thornton, Colorado",
    canonicalSlug: "thornton-colorado",
    lifecycleStatus: "DRAFT",
    visibility: "INTERNAL_ONLY",
    createdAt: date,
    updatedAt: date,
  };
  const source = {
    id: "source-1",
    canonicalName: "PROJECT ATLAS Sprint 6 Thornton Controlled Production-Internal Pilot Evidence",
    sourceClass: "INTERNAL",
    authorityLevel: "AUTHORITATIVE",
    accessMethod: "INTERNAL_DERIVATION",
    defaultUpdateCadence: "EVENT_DRIVEN",
    licensingRestriction: false,
    publicDisplayRestriction: true,
    healthState: "READY",
  };

  return {
    object,
    canonicalMatches: [{ id: object.id }],
    aliases: [
      { id: "alias-1", aliasText: "Thornton", normalizedValue: "thornton", aliasType: "PRIMARY", lifecycleStatus: "ACTIVE", language: "en-US", sourceId: source.id, effectiveDate: date },
      { id: "alias-2", aliasText: "City of Thornton", normalizedValue: "city of thornton", aliasType: "LEGAL", lifecycleStatus: "ACTIVE", language: "en-US", sourceId: source.id, effectiveDate: date },
    ],
    source,
    observations: [
      observation("approval_lineage", "gio.municipality.approval_lineage.v1", { sprint3QualityStatus: "READY" }),
      observation("approved_internal_identity_assertion", "gio.municipality.internal_identity_assertion.v1", { canonicalName: "Thornton" }),
      observation("canonical_municipality_name", "gio.municipality.canonical_name.v1", "Thornton"),
      observation("municipality_classification", "gio.municipality.classification.v1", "MUNICIPALITY"),
      observation("runtime_isolation_assertion", "gio.municipality.runtime_isolation.v1", { customerVisible: false }),
      observation("state_association", "gio.municipality.state_association.v1", "Colorado"),
    ],
    eligibility: {
      id: "eligibility-1",
      internalUse: false,
      searchEligible: false,
      mapEligible: false,
      publicPageEligible: false,
      indexingEligible: false,
      propertyEnrichment: false,
      marketAnalytics: false,
    },
    geographicRelationshipCount: 0,
    propertyGeographicRelationshipCount: 0,
  };
}

function observation(key: string, schemaKey: string, value: string | Record<string, unknown>) {
  const date = new Date("2026-07-25T00:00:00.000Z");
  return {
    id: `observation-${key}`,
    observationKey: key,
    valueKind: typeof value === "string" ? "TEXT" : "JSON",
    valueText: typeof value === "string" ? value : null,
    valueNumber: null,
    valueBoolean: null,
    valueDate: null,
    valueJson: typeof value === "string" ? null : value,
    valueSchemaKey: schemaKey,
    sourceId: "source-1",
    effectiveDate: date,
    retrievedAt: date,
    verifiedAt: date,
    freshness: "FRESH",
    confidence: "HIGH",
    derivationMethod: "INTERNAL_DERIVED",
    reviewStatus: "REVIEWED",
    publicVisibility: "INTERNAL_ONLY",
  };
}

function fakePrisma(rows: ReturnType<typeof certifiedRows>, mutationCalls: string[]) {
  return {
    geographicObject: {
      findUnique: async () => rows.object,
      findMany: async () => rows.canonicalMatches,
      create: mutationTrap("geographicObject.create", mutationCalls),
      update: mutationTrap("geographicObject.update", mutationCalls),
      upsert: mutationTrap("geographicObject.upsert", mutationCalls),
      delete: mutationTrap("geographicObject.delete", mutationCalls),
    },
    geographicAlias: {
      findMany: async () => rows.aliases,
      create: mutationTrap("geographicAlias.create", mutationCalls),
      update: mutationTrap("geographicAlias.update", mutationCalls),
      delete: mutationTrap("geographicAlias.delete", mutationCalls),
    },
    geographicSource: {
      findUnique: async () => rows.source,
      create: mutationTrap("geographicSource.create", mutationCalls),
      update: mutationTrap("geographicSource.update", mutationCalls),
      delete: mutationTrap("geographicSource.delete", mutationCalls),
    },
    geographicObservation: {
      findMany: async () => rows.observations,
      create: mutationTrap("geographicObservation.create", mutationCalls),
      update: mutationTrap("geographicObservation.update", mutationCalls),
      delete: mutationTrap("geographicObservation.delete", mutationCalls),
    },
    geographicEligibility: {
      findUnique: async () => rows.eligibility,
      create: mutationTrap("geographicEligibility.create", mutationCalls),
      update: mutationTrap("geographicEligibility.update", mutationCalls),
      delete: mutationTrap("geographicEligibility.delete", mutationCalls),
    },
    geographicRelationship: {
      count: async () => rows.geographicRelationshipCount,
      create: mutationTrap("geographicRelationship.create", mutationCalls),
      update: mutationTrap("geographicRelationship.update", mutationCalls),
      delete: mutationTrap("geographicRelationship.delete", mutationCalls),
    },
    propertyGeographicRelationship: {
      count: async () => rows.propertyGeographicRelationshipCount,
      create: mutationTrap("propertyGeographicRelationship.create", mutationCalls),
      update: mutationTrap("propertyGeographicRelationship.update", mutationCalls),
      delete: mutationTrap("propertyGeographicRelationship.delete", mutationCalls),
    },
  };
}

function mutationTrap(name: string, calls: string[]) {
  return async () => {
    calls.push(name);
    throw new Error(`Unexpected mutation method called: ${name}`);
  };
}

function listFiles(root: string): string[] {
  if (!fs.existsSync(root)) return [];
  const stat = fs.statSync(root);
  if (stat.isFile()) return [root];
  return fs.readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(root, entry.name);
    return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
  });
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/checkEkcpSprint1EnterpriseGeographicConsumerAdapter.ts
