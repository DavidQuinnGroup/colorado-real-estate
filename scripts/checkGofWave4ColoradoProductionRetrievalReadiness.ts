import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

import {
  EIP_SPRINT_7_CERTIFIED_OBJECT_ID,
  retrieveEipSprint7ProductionInternalGeographicReadAdapter,
} from "../lib/eip/productionInternalGeographicReadAdapter.js";
import {
  GOF_WAVE_4_CERTIFIED_CANONICAL_NAME,
  GOF_WAVE_4_CERTIFIED_OBJECT_TYPE,
  GOF_WAVE_4_CERTIFIED_SLUG,
  GOF_WAVE_4_STATUS,
  retrieveGofWave4ColoradoProductionRetrievalReadiness,
} from "../lib/gof/coloradoProductionRetrievalReadinessAdapter.js";
import {
  GOF_WAVE_3_THORNTON_CERTIFIED_FINGERPRINT,
  buildGofWave3ColoradoPersistenceContract,
} from "../lib/gof/coloradoControlledProductionPersistence.js";

const packageJson = fs.readFileSync("package.json", "utf8");
const workerTsconfig = fs.readFileSync("tsconfig.worker.json", "utf8");
const adapterPath = "lib/gof/coloradoProductionRetrievalReadinessAdapter.ts";
const adapterSource = fs.readFileSync(adapterPath, "utf8");
const sprint7Source = fs.readFileSync("lib/eip/productionInternalGeographicReadAdapter.ts", "utf8");
const reportPath = "docs/project-atlas/executive-library/GOF-1.0-WAVE-4-COLORADO-PRODUCTION-RETRIEVAL-READINESS.md";
const report = fs.existsSync(reportPath) ? fs.readFileSync(reportPath, "utf8") : "";
const contract = buildGofWave3ColoradoPersistenceContract();

assert.equal(GOF_WAVE_4_STATUS, "CERTIFIED_RETRIEVAL_READY");
assert.equal(GOF_WAVE_4_CERTIFIED_OBJECT_TYPE, "STATE");
assert.equal(GOF_WAVE_4_CERTIFIED_CANONICAL_NAME, "Colorado");
assert.equal(GOF_WAVE_4_CERTIFIED_SLUG, "colorado");
assert.equal(contract.evidenceFingerprint, "280b283ba101707b2fb0a85b801db2ce6220c2f56fa7f232d2d0dd6396bb2719");

for (const pattern of [
  /geographicObject\.(?:create|createMany|update|updateMany|upsert|delete|deleteMany)\s*\(/,
  /geographicAlias\.(?:create|createMany|update|updateMany|upsert|delete|deleteMany)\s*\(/,
  /geographicSource\.(?:create|createMany|update|updateMany|upsert|delete|deleteMany)\s*\(/,
  /geographicObservation\.(?:create|createMany|update|updateMany|upsert|delete|deleteMany)\s*\(/,
  /geographicEligibility\.(?:create|createMany|update|updateMany|upsert|delete|deleteMany)\s*\(/,
  /geographicRelationship\.(?:create|createMany|update|updateMany|upsert|delete|deleteMany)\s*\(/,
  /propertyGeographicRelationship\.(?:create|createMany|update|updateMany|upsert|delete|deleteMany)\s*\(/,
  /\.\$transaction\s*\(/,
]) {
  assert.equal(pattern.test(adapterSource), false, `Wave 4 adapter must not contain mutation call pattern ${pattern}.`);
}

for (const prohibited of ["app/api", "route.ts", "Search", "Maps", "Property Intelligence", "AI", "public page", "customer route", "../ekcp", "createEkcp"]) {
  assert.equal(adapterSource.includes(prohibited), false, `Wave 4 adapter contains prohibited integration text: ${prohibited}`);
}
assert.equal(adapterSource.includes("retrieveEipSprint7ProductionInternalGeographicReadAdapter"), false, "Wave 4 must not depend on the Thornton adapter.");
assert.equal(sprint7Source.includes("GOF_WAVE_4"), false, "Sprint 7 must remain unchanged and unaware of Wave 4.");

const mutationCalls: string[] = [];
const exactRead = await retrieveGofWave4ColoradoProductionRetrievalReadiness(fakePrisma(coloradoRows(), mutationCalls) as never, {
  operation: "aggregate",
  canonicalSlug: "colorado",
  objectType: "STATE",
  certifiedFingerprint: contract.evidenceFingerprint,
  requestId: "GOF-W4-EXACT",
});
assertHealthyColorado(exactRead);
assert.equal(exactRead.aggregate?.identity.objectType, "STATE");
assert.equal(exactRead.aggregate?.identity.canonicalName, "Colorado");
assert.equal(exactRead.aggregate?.identity.canonicalSlug, "colorado");
assert.equal(exactRead.aggregate?.aliases.length, 2);
assert.equal(exactRead.aggregate?.sources.length, 5);
assert.equal(exactRead.aggregate?.observations.length, 5);
assert.equal(exactRead.aggregate?.eligibility.allActivationFlagsFalse, true);

const repeatRead = await retrieveGofWave4ColoradoProductionRetrievalReadiness(fakePrisma(coloradoRows(), mutationCalls) as never, {
  operation: "aggregate",
  canonicalSlug: "colorado",
  objectType: "STATE",
  certifiedFingerprint: contract.evidenceFingerprint,
  requestId: "GOF-W4-REPEAT",
});
assert.deepEqual(stableResult(exactRead), stableResult(repeatRead));

const wrongSlug = await retrieveGofWave4ColoradoProductionRetrievalReadiness(fakePrisma(coloradoRows(), mutationCalls) as never, {
  operation: "aggregate",
  canonicalSlug: "wyoming",
});
assert.equal(wrongSlug.status, "NOT_AUTHORIZED");
assert.equal(wrongSlug.aggregate, null);

const wrongType = await retrieveGofWave4ColoradoProductionRetrievalReadiness(fakePrisma(coloradoRows(), mutationCalls) as never, {
  operation: "aggregate",
  objectType: "MUNICIPALITY",
});
assert.equal(wrongType.status, "NOT_AUTHORIZED");

const aliasLookup = await retrieveGofWave4ColoradoProductionRetrievalReadiness(fakePrisma(coloradoRows(), mutationCalls) as never, {
  operation: "alias",
  alias: "CO",
});
assert.equal(aliasLookup.status, "NOT_AUTHORIZED");
assert.deepEqual(aliasLookup.blockingFailures, ["ALIAS_LOOKUP_NOT_AUTHORIZED_FOR_WAVE_4"]);

for (const [label, rows, expectedFailure] of [
  ["duplicate object", coloradoRows({ duplicateObject: true }), "COLORADO_OBJECT_NOT_SINGLETON"],
  ["missing alias", coloradoRows({ dropAlias: true }), "COLORADO_ALIAS_SET_MISMATCH"],
  ["extra alias", coloradoRows({ extraAlias: true }), "COLORADO_ALIAS_SET_MISMATCH"],
  ["missing source", coloradoRows({ dropSource: true }), "COLORADO_SOURCE_SET_MISMATCH"],
  ["altered source", coloradoRows({ alterSource: true }), "COLORADO_SOURCE_SET_MISMATCH"],
  ["missing observation", coloradoRows({ dropObservation: true }), "COLORADO_OBSERVATION_SET_MISMATCH"],
  ["altered observation", coloradoRows({ alterObservation: true }), "COLORADO_OBSERVATION_SET_MISMATCH"],
  ["missing eligibility", coloradoRows({ missingEligibility: true }), "COLORADO_ELIGIBILITY_MISMATCH"],
  ["eligibility drift", coloradoRows({ searchEligible: true }), "COLORADO_ELIGIBILITY_MISMATCH"],
  ["changed lifecycle", coloradoRows({ lifecycleStatus: "ACTIVE" }), "COLORADO_LIFECYCLE_MISMATCH"],
  ["changed visibility", coloradoRows({ visibility: "PUBLIC_ELIGIBLE" }), "COLORADO_VISIBILITY_MISMATCH"],
  ["relationship", coloradoRows({ geographicRelationshipCount: 1 }), "GEOGRAPHIC_RELATIONSHIP_PRESENT"],
  ["property relationship", coloradoRows({ propertyGeographicRelationshipCount: 1 }), "PROPERTY_GEOGRAPHIC_RELATIONSHIP_PRESENT"],
  ["Thornton drift", coloradoRows({ thorntonFingerprint: "changed" }), "THORNTON_FINGERPRINT_CHANGED"],
] as const) {
  const result = await retrieveGofWave4ColoradoProductionRetrievalReadiness(fakePrisma(rows, mutationCalls) as never, { operation: "aggregate" });
  assert.equal(result.success, false, label);
  assert.equal(result.status === "CONFLICT" || result.status === "INVARIANT_VIOLATION", true, label);
  assert.ok(result.blockingFailures.includes(expectedFailure), label);
}

const thornton = await retrieveEipSprint7ProductionInternalGeographicReadAdapter(fakeThorntonPrisma() as never, {
  operation: "object-id",
  objectId: EIP_SPRINT_7_CERTIFIED_OBJECT_ID,
});
assert.equal(thornton.success, true);
assert.equal(thornton.aggregate?.identity.canonicalName, "Thornton");
const crossThornton = await retrieveGofWave4ColoradoProductionRetrievalReadiness(fakePrisma(coloradoRows(), mutationCalls) as never, {
  operation: "object-id",
  objectId: EIP_SPRINT_7_CERTIFIED_OBJECT_ID,
});
assert.equal(crossThornton.success, false);
assert.equal(crossThornton.status, "NOT_AUTHORIZED");
assert.ok(crossThornton.blockingFailures.includes("OBJECT_ID_NOT_AUTHORIZED"));

assert.deepEqual(mutationCalls, []);
assert.ok(packageJson.includes("check:gof-wave-4-colorado-production-retrieval-readiness"));
assert.ok(workerTsconfig.includes("scripts/checkGofWave4ColoradoProductionRetrievalReadiness.ts"));
assert.match(report, /GOF WAVE 4 STATUS: `CERTIFIED_RETRIEVAL_READY`/);
assert.match(report, /CONSUMPTION STATE: `RETRIEVAL_READY_NOT_CONSUMPTION_ENABLED`/);
assert.match(report, /ARCHITECTURE DECISION: `GOF_SPECIFIC_COLORADO_READ_ADAPTER`/);
assert.match(report, /Colorado production retrieval remains internal-only readiness/);
assert.match(report, /Customer visibility remains `NOT_AUTHORIZED`/);

const production = await readProductionReadiness();
assert.equal(production.status, "HEALTHY");
assert.equal(production.aggregate?.identity.canonicalName, "Colorado");
assert.equal(production.aggregate?.identity.objectType, "STATE");
assert.equal(production.aggregate?.aliases.length, 2);
assert.equal(production.aggregate?.sources.length, 5);
assert.equal(production.aggregate?.observations.length, 5);
assert.equal(production.aggregate?.eligibility.allActivationFlagsFalse, true);
assert.equal(production.aggregate?.relationships.geographicRelationshipCount, 0);
assert.equal(production.aggregate?.relationships.propertyGeographicRelationshipCount, 0);
assert.equal(production.writesPerformed, 0);
assert.equal(production.executed, false);
assert.equal(production.invariantResults.noActivation, true);

console.log("[gof-wave-4-colorado-production-retrieval-readiness] ok: bounded Colorado internal retrieval, exact-state integrity, production read-only verification, deterministic reads, Thornton isolation, zero writes, no relationships, and no runtime/customer/downstream integration passed.");

function assertHealthyColorado(result: Awaited<ReturnType<typeof retrieveGofWave4ColoradoProductionRetrievalReadiness>>) {
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

function stableResult(result: Awaited<ReturnType<typeof retrieveGofWave4ColoradoProductionRetrievalReadiness>>) {
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

function coloradoRows(overrides: {
  duplicateObject?: boolean;
  dropAlias?: boolean;
  extraAlias?: boolean;
  dropSource?: boolean;
  alterSource?: boolean;
  dropObservation?: boolean;
  alterObservation?: boolean;
  missingEligibility?: boolean;
  searchEligible?: boolean;
  lifecycleStatus?: string;
  visibility?: string;
  geographicRelationshipCount?: number;
  propertyGeographicRelationshipCount?: number;
  thorntonFingerprint?: string;
} = {}) {
  const date = new Date("2026-07-26T00:00:00.000Z");
  const object = {
    id: "colorado-production-id",
    objectType: "STATE",
    canonicalName: "Colorado",
    displayName: "Colorado",
    canonicalSlug: "colorado",
    lifecycleStatus: overrides.lifecycleStatus ?? "DRAFT",
    visibility: overrides.visibility ?? "INTERNAL_ONLY",
    convenienceParentId: null,
    mergedIntoId: null,
  };
  const sourceRows = contract.sources.map((source, index) => ({
    id: `source-${index + 1}`,
    canonicalName: source.canonicalName,
    sourceClass: source.sourceClass,
    authorityLevel: overrides.alterSource && index === 0 ? "UNVERIFIED" : source.authorityLevel,
    accessMethod: source.accessMethod,
    defaultUpdateCadence: source.defaultUpdateCadence,
    licensingRestriction: source.licensingRestriction,
    publicDisplayRestriction: source.publicDisplayRestriction,
    healthState: source.healthState,
  }));
  const aliases = contract.aliases.map((alias, index) => ({
    id: `alias-${index + 1}`,
    aliasText: alias.aliasText,
    normalizedValue: alias.normalizedValue,
    aliasType: alias.aliasType,
    language: alias.language,
    lifecycleStatus: alias.lifecycleStatus,
    sourceId: sourceRows.find((source) => source.canonicalName === alias.sourceRef)?.id ?? null,
    sourceCanonicalName: alias.sourceRef,
    effectiveDate: date,
  }));
  const observations = contract.observations.map((observation, index) => ({
    id: `observation-${index + 1}`,
    observationKey: observation.observationKey,
    valueKind: observation.valueKind,
    valueJson: overrides.alterObservation && index === 0 ? { ...observation.valueJson, sourceValue: "Altered" } : observation.valueJson,
    valueSchemaKey: observation.valueSchemaKey,
    sourceId: sourceRows.find((source) => source.canonicalName === observation.sourceRef)?.id ?? null,
    sourceCanonicalName: observation.sourceRef,
    effectiveDate: date,
    retrievedAt: date,
    verifiedAt: date,
    freshness: observation.freshness,
    confidence: observation.confidence,
    derivationMethod: observation.derivationMethod,
    reviewStatus: observation.reviewStatus,
    publicVisibility: observation.publicVisibility,
  }));
  return {
    objects: overrides.duplicateObject ? [object, { ...object, id: "duplicate-colorado-id" }] : [object],
    aliases: overrides.extraAlias ? [...aliases, { ...aliases[0], id: "extra-alias", aliasText: "Colorado", normalizedValue: "colorado" }] : overrides.dropAlias ? aliases.slice(0, 1) : aliases,
    sources: overrides.dropSource ? sourceRows.slice(0, 4) : sourceRows,
    observations: overrides.dropObservation ? observations.slice(0, 4) : observations,
    eligibility: overrides.missingEligibility ? null : {
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
    thorntonFingerprint: overrides.thorntonFingerprint ?? GOF_WAVE_3_THORNTON_CERTIFIED_FINGERPRINT,
  };
}

function fakePrisma(rows: ReturnType<typeof coloradoRows>, mutationCalls: string[]) {
  return {
    $queryRaw(strings: TemplateStringsArray, ...values: unknown[]) {
      const sql = strings.join("?");
      if (sql.includes('FROM "GeographicObject"') && sql.includes('"objectType"::text = \'STATE\'')) return Promise.resolve(rows.objects);
      if (sql.includes('FROM "GeographicAlias"')) return Promise.resolve(rows.aliases);
      if (sql.includes('FROM "GeographicSource"')) return Promise.resolve(rows.sources);
      if (sql.includes('FROM "GeographicObservation"')) return Promise.resolve(rows.observations);
      if (sql.includes('FROM "GeographicEligibility"')) return Promise.resolve(rows.eligibility ? [rows.eligibility] : []);
      if (sql.includes('"globalGeographicRelationshipCount"')) {
        return Promise.resolve([{
          geographicRelationshipCount: rows.geographicRelationshipCount,
          propertyGeographicRelationshipCount: rows.propertyGeographicRelationshipCount,
          globalGeographicRelationshipCount: rows.geographicRelationshipCount,
          globalPropertyGeographicRelationshipCount: rows.propertyGeographicRelationshipCount,
        }]);
      }
      if (sql.includes("AS fingerprint")) return Promise.resolve([{ fingerprint: rows.thorntonFingerprint }]);
      throw new Error(`Unhandled fake query: ${sql}; values=${JSON.stringify(values)}`);
    },
    geographicObject: { create: mutationTrap("geographicObject.create", mutationCalls), update: mutationTrap("geographicObject.update", mutationCalls), delete: mutationTrap("geographicObject.delete", mutationCalls) },
    geographicAlias: { create: mutationTrap("geographicAlias.create", mutationCalls), update: mutationTrap("geographicAlias.update", mutationCalls), delete: mutationTrap("geographicAlias.delete", mutationCalls) },
    geographicSource: { create: mutationTrap("geographicSource.create", mutationCalls), update: mutationTrap("geographicSource.update", mutationCalls), delete: mutationTrap("geographicSource.delete", mutationCalls) },
    geographicObservation: { create: mutationTrap("geographicObservation.create", mutationCalls), update: mutationTrap("geographicObservation.update", mutationCalls), delete: mutationTrap("geographicObservation.delete", mutationCalls) },
    geographicEligibility: { create: mutationTrap("geographicEligibility.create", mutationCalls), update: mutationTrap("geographicEligibility.update", mutationCalls), delete: mutationTrap("geographicEligibility.delete", mutationCalls) },
    geographicRelationship: { create: mutationTrap("geographicRelationship.create", mutationCalls), update: mutationTrap("geographicRelationship.update", mutationCalls), delete: mutationTrap("geographicRelationship.delete", mutationCalls) },
    propertyGeographicRelationship: { create: mutationTrap("propertyGeographicRelationship.create", mutationCalls), update: mutationTrap("propertyGeographicRelationship.update", mutationCalls), delete: mutationTrap("propertyGeographicRelationship.delete", mutationCalls) },
  };
}

function mutationTrap(name: string, calls: string[]) {
  return async () => {
    calls.push(name);
    throw new Error(`Unexpected mutation: ${name}`);
  };
}

function fakeThorntonPrisma() {
  const date = new Date("2026-07-25T00:00:00.000Z");
  return {
    geographicObject: {
      findUnique: async () => ({
        id: EIP_SPRINT_7_CERTIFIED_OBJECT_ID,
        objectType: "MUNICIPALITY",
        canonicalName: "Thornton",
        displayName: "Thornton, Colorado",
        canonicalSlug: "thornton-colorado",
        lifecycleStatus: "DRAFT",
        visibility: "INTERNAL_ONLY",
        createdAt: date,
        updatedAt: date,
      }),
      findMany: async () => [{ id: EIP_SPRINT_7_CERTIFIED_OBJECT_ID }],
    },
    geographicAlias: { findMany: async () => [
      { id: "t-alias-1", aliasText: "Thornton", normalizedValue: "thornton", aliasType: "PRIMARY", lifecycleStatus: "ACTIVE", language: "en-US", sourceId: "t-source", effectiveDate: date },
      { id: "t-alias-2", aliasText: "City of Thornton", normalizedValue: "city of thornton", aliasType: "LEGAL", lifecycleStatus: "ACTIVE", language: "en-US", sourceId: "t-source", effectiveDate: date },
    ] },
    geographicSource: { findUnique: async () => ({ id: "t-source", canonicalName: "PROJECT ATLAS Sprint 6 Thornton Controlled Production-Internal Pilot Evidence", sourceClass: "INTERNAL", authorityLevel: "AUTHORITATIVE", accessMethod: "INTERNAL_DERIVATION", defaultUpdateCadence: "EVENT_DRIVEN", licensingRestriction: false, publicDisplayRestriction: true, healthState: "READY" }) },
    geographicObservation: { findMany: async () => ["approval_lineage", "approved_internal_identity_assertion", "canonical_municipality_name", "municipality_classification", "runtime_isolation_assertion", "state_association"].map((key) => ({ id: `t-${key}`, observationKey: key, valueKind: "JSON", valueText: null, valueNumber: null, valueBoolean: null, valueDate: null, valueJson: { key }, valueSchemaKey: `gio.${key}.v1`, sourceId: "t-source", effectiveDate: date, retrievedAt: date, verifiedAt: date, freshness: "FRESH", confidence: "HIGH", derivationMethod: "INTERNAL_DERIVED", reviewStatus: "REVIEWED", publicVisibility: "INTERNAL_ONLY" })) },
    geographicEligibility: { findUnique: async () => ({ id: "t-eligibility", internalUse: false, searchEligible: false, mapEligible: false, publicPageEligible: false, indexingEligible: false, propertyEnrichment: false, marketAnalytics: false }) },
    geographicRelationship: { count: async () => 0 },
    propertyGeographicRelationship: { count: async () => 0 },
  };
}

async function readProductionReadiness() {
  const prisma = new PrismaClient();
  try {
    return await retrieveGofWave4ColoradoProductionRetrievalReadiness(prisma, {
      operation: "aggregate",
      canonicalSlug: "colorado",
      objectType: "STATE",
      certifiedFingerprint: contract.evidenceFingerprint,
      requestId: "GOF-W4-PRODUCTION-READONLY",
    });
  } finally {
    await prisma.$disconnect();
  }
}

for (const runtimeRoot of ["app", "components", "lib/search", "lib/mls", "lib/typesense", "lib/alerts", "lib/email", "workers"]) {
  for (const file of listSourceFiles(runtimeRoot)) {
    const contents = fs.readFileSync(file, "utf8");
    assert.equal(contents.includes("GOF_WAVE_4"), false, `Runtime file references Wave 4: ${file}`);
    assert.equal(contents.includes("coloradoProductionRetrievalReadinessAdapter"), false, `Runtime file imports Wave 4 adapter: ${file}`);
  }
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
