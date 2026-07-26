import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import {
  EIP_SPRINT_7_CERTIFIED_OBJECT_ID,
  EIP_SPRINT_7_CERTIFIED_SCOPE,
  retrieveEipSprint7ProductionInternalGeographicReadAdapter,
} from "../lib/eip/productionInternalGeographicReadAdapter.js";

const adapterPath = "lib/eip/productionInternalGeographicReadAdapter.ts";
const routePath = "app/api/admin/enterprise/geographic-read-adapter/route.ts";
const packageJsonPath = "package.json";
const workerTsconfigPath = "tsconfig.worker.json";

const adapterSource = fs.readFileSync(adapterPath, "utf8");
const routeSource = fs.readFileSync(routePath, "utf8");
const packageJson = fs.readFileSync(packageJsonPath, "utf8");
const workerTsconfig = fs.readFileSync(workerTsconfigPath, "utf8");

assert.match(routeSource, /authorizeRepositoryAdminRequest/);
assert.match(routeSource, /repositoryAdminUnauthorizedResponse/);
assert.match(routeSource, /import\("@\/lib\/prisma"\)/);
assert.match(routeSource, /import\("@\/lib\/eip\/productionInternalGeographicReadAdapter"\)/);
assert.equal(routeSource.includes("readFile"), false, "Protected Sprint 7 route must not read repository files.");
assert.equal(routeSource.includes("readdir"), false, "Protected Sprint 7 route must not scan repository directories.");
assert.equal(routeSource.includes("prisma/migrations"), false, "Protected Sprint 7 route must not inspect migrations.");
assert.equal(routeSource.includes("prisma/schema.prisma"), false, "Protected Sprint 7 route must not inspect Prisma schema.");

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
  assert.equal(pattern.test(adapterSource), false, `Sprint 7 adapter must not contain mutation call pattern ${pattern}.`);
}

for (const prohibited of ["node:fs", "fs.", "readFile", "readdir", "scandir", "process.env", "fetch(", "DATABASE_URL", "prisma/migrations", "prisma/schema.prisma", "../scripts", "../../scripts", "dist/scripts"]) {
  assert.equal(adapterSource.includes(prohibited), false, `Sprint 7 adapter contains prohibited runtime dependency: ${prohibited}`);
}

assert.equal(/findMany\s*\(\s*\{\s*\}\s*\)/.test(adapterSource), false, "Sprint 7 adapter must not expose broad enumeration.");
assert.match(adapterSource, /EIP_SPRINT_7_CERTIFIED_OBJECT_ID/);
assert.match(adapterSource, /EIP_SPRINT_7_CERTIFIED_CANONICAL_NAME/);
assert.match(adapterSource, /EIP_SPRINT_7_CERTIFIED_SLUG/);

for (const runtimeRoot of ["app", "components", "lib", "workers", "middleware.ts"]) {
  if (!fs.existsSync(runtimeRoot)) continue;
  for (const file of listFiles(runtimeRoot)) {
    if (!/\.(ts|tsx|js|jsx)$/.test(file)) continue;
    const contents = fs.readFileSync(file, "utf8");
    for (const specifier of importSpecifiers(contents)) {
      assert.equal(isScriptImport(file, specifier), false, `Runtime file imports script module: ${file} -> ${specifier}`);
      assert.equal(specifier.includes("dist/scripts"), false, `Runtime file imports dist script module: ${file} -> ${specifier}`);
      if (specifier.includes("productionInternalGeographicReadAdapter")) {
        assert.equal(
          normalizePath(file),
          "app/api/admin/enterprise/geographic-read-adapter/route.ts",
          `Only the protected Sprint 7 admin route may import the adapter: ${file}`,
        );
      }
    }
  }
}

const prismaDiff = execFileSync("git", ["diff", "--name-only", "--", "prisma/schema.prisma", "prisma/migrations"], { encoding: "utf8" }).trim();
assert.equal(prismaDiff, "", "Sprint 7 must not change Prisma schema or migrations.");

const mutationCalls: string[] = [];
const prisma = fakePrisma(certifiedRows(), mutationCalls);

const objectRead = await retrieveEipSprint7ProductionInternalGeographicReadAdapter(prisma as never, {
  operation: "object-id",
  objectId: EIP_SPRINT_7_CERTIFIED_OBJECT_ID,
  requestId: "EIP-S7-READ-VALIDATION-001",
});
assertHealthyResult(objectRead);
assert.equal(objectRead.resolution.resolvedObjectId, EIP_SPRINT_7_CERTIFIED_OBJECT_ID);
assert.equal(objectRead.requestId, "EIP-S7-READ-VALIDATION-001");
assert.equal(objectRead.aggregate?.identity.canonicalName, "Thornton");
assert.equal(objectRead.aggregate?.identity.objectType, "MUNICIPALITY");
assert.equal(objectRead.aggregate?.aliases.length, 2);
assert.equal(objectRead.aggregate?.sources.length, 1);
assert.equal(objectRead.aggregate?.observations.length, 6);
assert.equal(objectRead.aggregate?.eligibility.allActivationFlagsFalse, true);
assert.equal(objectRead.aggregate?.relationships.geographicRelationshipCount, 0);
assert.equal(objectRead.aggregate?.relationships.propertyGeographicRelationshipCount, 0);

const canonicalRead = await retrieveEipSprint7ProductionInternalGeographicReadAdapter(prisma as never, {
  operation: "canonical-name",
  canonicalName: "Thornton",
  requestId: "EIP-S7-CANONICAL-VALIDATION-001",
});
assertHealthyResult(canonicalRead);
assert.equal(canonicalRead.resolution.resolvedObjectId, EIP_SPRINT_7_CERTIFIED_OBJECT_ID);

const aliasRead = await retrieveEipSprint7ProductionInternalGeographicReadAdapter(prisma as never, {
  operation: "alias",
  alias: "City of Thornton",
  requestId: "EIP-S7-ALIAS-VALIDATION-001",
});
assertHealthyResult(aliasRead);
assert.equal(aliasRead.resolution.resolvedObjectId, EIP_SPRINT_7_CERTIFIED_OBJECT_ID);

const aggregateRead = await retrieveEipSprint7ProductionInternalGeographicReadAdapter(prisma as never, {
  operation: "aggregate",
  requestId: "EIP-S7-AGGREGATE-VALIDATION-001",
});
assertHealthyResult(aggregateRead);

const healthRead = await retrieveEipSprint7ProductionInternalGeographicReadAdapter(prisma as never, {
  operation: "health",
  requestId: "EIP-S7-HEALTH-VALIDATION-001",
});
assertHealthyResult(healthRead);

const repeatRead = await retrieveEipSprint7ProductionInternalGeographicReadAdapter(prisma as never, {
  operation: "object-id",
  objectId: EIP_SPRINT_7_CERTIFIED_OBJECT_ID,
  requestId: "EIP-S7-READ-VALIDATION-002",
});
assert.deepEqual(stableResult(objectRead), stableResult(repeatRead), "Repeated reads must be stable apart from timestamps and request IDs.");

const unauthorized = await retrieveEipSprint7ProductionInternalGeographicReadAdapter(prisma as never, {
  operation: "object-id",
  objectId: "not-certified",
});
assert.equal(unauthorized.success, false);
assert.equal(unauthorized.status, "NOT_AUTHORIZED");
assert.equal(unauthorized.aggregate, null);
assert.deepEqual(unauthorized.blockingFailures, ["OBJECT_ID_NOT_AUTHORIZED"]);

const duplicate = await retrieveEipSprint7ProductionInternalGeographicReadAdapter(fakePrisma(certifiedRows({ duplicateCanonical: true }), mutationCalls) as never, {
  operation: "object-id",
  objectId: EIP_SPRINT_7_CERTIFIED_OBJECT_ID,
});
assert.equal(duplicate.success, false);
assert.equal(duplicate.status, "CONFLICT");
assert.equal(duplicate.aggregate, null);

const relationshipFailure = await retrieveEipSprint7ProductionInternalGeographicReadAdapter(fakePrisma(certifiedRows({ geographicRelationshipCount: 1 }), mutationCalls) as never, {
  operation: "object-id",
  objectId: EIP_SPRINT_7_CERTIFIED_OBJECT_ID,
});
assert.equal(relationshipFailure.success, false);
assert.equal(relationshipFailure.status, "INVARIANT_VIOLATION");
assert.ok(relationshipFailure.blockingFailures.includes("GEOGRAPHIC_RELATIONSHIP_PRESENT"));

const eligibilityFailure = await retrieveEipSprint7ProductionInternalGeographicReadAdapter(fakePrisma(certifiedRows({ searchEligible: true }), mutationCalls) as never, {
  operation: "object-id",
  objectId: EIP_SPRINT_7_CERTIFIED_OBJECT_ID,
});
assert.equal(eligibilityFailure.success, false);
assert.equal(eligibilityFailure.status, "INVARIANT_VIOLATION");
assert.ok(eligibilityFailure.blockingFailures.includes("CERTIFIED_ELIGIBILITY_FLAG_TRUE"));

assert.deepEqual(mutationCalls, [], "Sprint 7 validation detected unexpected Prisma mutation method usage.");
assert.ok(packageJson.includes("check:eip-sprint-7-production-internal-geographic-read-adapter"));
assert.ok(workerTsconfig.includes("scripts/checkEipSprint7ProductionInternalGeographicReadAdapter.ts"));
assert.equal(EIP_SPRINT_7_CERTIFIED_SCOPE, "PRODUCTION_INTERNAL_GEOGRAPHIC_READ_ADAPTER");

console.log(
  "[eip-sprint-7-production-internal-geographic-read-adapter] ok: read-only adapter contract, certified Thornton-only lookups, exact counts, false eligibility, zero relationships, fail-closed invariants, repeatability, runtime isolation, no scripts imports, and no Prisma schema/migration changes passed.",
);

function assertHealthyResult(result: Awaited<ReturnType<typeof retrieveEipSprint7ProductionInternalGeographicReadAdapter>>) {
  assert.equal(result.success, true);
  assert.equal(result.status, "HEALTHY");
  assert.equal(result.executed, false);
  assert.equal(result.writesPerformed, 0);
  assert.deepEqual(result.blockingFailures, []);
  assert.equal(result.invariantResults.canonicalIdentity, true);
  assert.equal(result.invariantResults.eligibility, true);
  assert.equal(result.invariantResults.relationships, true);
  assert.equal(result.invariantResults.rowCounts, true);
  assert.equal(result.invariantResults.authorizedLookup, true);
  assert.equal(result.invariantResults.noActivation, true);
}

function stableResult(result: Awaited<ReturnType<typeof retrieveEipSprint7ProductionInternalGeographicReadAdapter>>) {
  return {
    ...result,
    requestId: null,
    retrievalTimestamp: "TIMESTAMP",
    aggregate: result.aggregate ? {
      ...result.aggregate,
      governance: {
        ...result.aggregate.governance,
        retrievalTimestamp: "TIMESTAMP",
      },
    } : null,
  };
}

function certifiedRows(overrides: {
  duplicateCanonical?: boolean;
  geographicRelationshipCount?: number;
  propertyGeographicRelationshipCount?: number;
  searchEligible?: boolean;
} = {}) {
  const date = new Date("2026-07-25T00:00:00.000Z");
  const object = {
    id: EIP_SPRINT_7_CERTIFIED_OBJECT_ID,
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
    canonicalMatches: overrides.duplicateCanonical ? [{ id: object.id }, { id: "other" }] : [{ id: object.id }],
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
      searchEligible: overrides.searchEligible ?? false,
      mapEligible: false,
      publicPageEligible: false,
      indexingEligible: false,
      propertyEnrichment: false,
      marketAnalytics: false,
    },
    geographicRelationshipCount: overrides.geographicRelationshipCount ?? 0,
    propertyGeographicRelationshipCount: overrides.propertyGeographicRelationshipCount ?? 0,
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

function importSpecifiers(contents: string): string[] {
  const specifiers: string[] = [];
  const importPattern = /(?:import|export)\s+(?:type\s+)?(?:[^'"]*?\s+from\s+)?["']([^"']+)["']|import\(\s*["']([^"']+)["']\s*\)|require\(\s*["']([^"']+)["']\s*\)/g;
  for (const match of contents.matchAll(importPattern)) {
    const specifier = match[1] ?? match[2] ?? match[3];
    if (specifier) specifiers.push(specifier);
  }
  return specifiers;
}

function isScriptImport(file: string, specifier: string): boolean {
  if (specifier.startsWith("scripts/") || specifier.includes("/scripts/")) return true;
  if (!specifier.startsWith(".")) return false;
  const resolved = normalizePath(path.resolve(path.dirname(file), specifier));
  return resolved.includes("/scripts/");
}

function normalizePath(value: string): string {
  return value.replace(/\\/g, "/");
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/checkEipSprint7ProductionInternalGeographicReadAdapter.ts
