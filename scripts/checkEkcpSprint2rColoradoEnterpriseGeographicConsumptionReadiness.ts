import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

import {
  EIP_SPRINT_7_ADAPTER_VERSION,
  EIP_SPRINT_7_AUTHORIZATION,
  EIP_SPRINT_7_CERTIFIED_OBJECT_ID,
} from "../lib/eip/productionInternalGeographicReadAdapter.js";
import {
  ENTERPRISE_GEOGRAPHIC_READ_CONTRACT_VERSION,
  type EnterpriseGeographicReadAggregate,
  type EnterpriseGeographicReadResult,
} from "../lib/enterprise-knowledge/geographicReadContract.js";
import {
  assertEkcpSprint1CertifiedSubject,
  readEkcpEnterpriseGeographicConsumerAdapter,
} from "../lib/ekcp/enterpriseGeographicConsumerAdapter.js";
import {
  EKCP_SPRINT_2R_ADAPTER_VERSION,
  EKCP_SPRINT_2R_CONSUMPTION_STATE,
  EKCP_SPRINT_2R_REQUIRED_READ_FINGERPRINT,
  EKCP_SPRINT_2R_STATUS,
  assertEkcpSprint2rColoradoConsumptionReady,
  readEkcpSprint2rColoradoEnterpriseGeographicConsumptionReadiness,
} from "../lib/ekcp/coloradoEnterpriseGeographicConsumptionReadiness.js";
import {
  GOF_WAVE_4_ADAPTER_VERSION,
  GOF_WAVE_4_AUTHORIZATION,
  retrieveGofWave4ColoradoProductionRetrievalReadiness,
  type GofWave4ColoradoReadResult,
} from "../lib/gof/coloradoProductionRetrievalReadinessAdapter.js";

const adapterPath = "lib/ekcp/coloradoEnterpriseGeographicConsumptionReadiness.ts";
const adapterSource = fs.readFileSync(adapterPath, "utf8");
const sprint1Source = fs.readFileSync("lib/ekcp/enterpriseGeographicConsumerAdapter.ts", "utf8");
const wave4Source = fs.readFileSync("lib/gof/coloradoProductionRetrievalReadinessAdapter.ts", "utf8");
const packageJson = fs.readFileSync("package.json", "utf8");
const workerTsconfig = fs.readFileSync("tsconfig.worker.json", "utf8");
const reportPath = "docs/project-atlas/executive-library/EKCP-1.0-SPRINT-2R-COLORADO-ENTERPRISE-GEOGRAPHIC-CONSUMPTION-READINESS.md";
const report = fs.existsSync(reportPath) ? fs.readFileSync(reportPath, "utf8") : "";

assert.equal(EKCP_SPRINT_2R_STATUS, "CERTIFIED_ENTERPRISE_CONSUMPTION_READY");
assert.equal(EKCP_SPRINT_2R_CONSUMPTION_STATE, "ENTERPRISE_CONSUMPTION_READY_NOT_RUNTIME_ENABLED");
assert.equal(EKCP_SPRINT_2R_ADAPTER_VERSION, "EKCP_1.0_SPRINT_2R_COLORADO_ENTERPRISE_GEOGRAPHIC_CONSUMPTION_READINESS_V1");
assert.equal(EKCP_SPRINT_2R_REQUIRED_READ_FINGERPRINT, "280b283ba101707b2fb0a85b801db2ce6220c2f56fa7f232d2d0dd6396bb2719");

assert.equal(adapterSource.includes("@prisma/client"), false, "Sprint 2R consumer adapter must not import Prisma.");
assert.equal(adapterSource.includes("PrismaClient"), false, "Sprint 2R consumer adapter must not accept PrismaClient.");
assert.equal(adapterSource.includes("prisma."), false, "Sprint 2R consumer adapter must not call Prisma.");
assert.equal(adapterSource.includes("retrieveGofWave4ColoradoProductionRetrievalReadiness"), false, "Sprint 2R consumer adapter must not fetch from the database through Wave 4.");
assert.equal(adapterSource.includes("buildGofWave3ColoradoPersistenceContract"), false, "Sprint 2R consumer adapter must not import production persistence contracts.");
assert.equal(adapterSource.includes("productionInternalGeographicReadAdapter"), false, "Sprint 2R consumer adapter must not depend on the Thornton read adapter.");
assert.equal(sprint1Source.includes("EKCP_SPRINT_2R"), false, "Sprint 1 EKCP adapter must remain unaware of Sprint 2R.");
assert.equal(wave4Source.includes("EKCP_SPRINT_2R"), false, "Wave 4 retrieval adapter must remain unaware of EKCP Sprint 2R.");

for (const pattern of [
  /geographicObject\.(?:create|createMany|update|updateMany|upsert|delete|deleteMany)\s*\(/,
  /geographicAlias\.(?:create|createMany|update|updateMany|upsert|delete|deleteMany)\s*\(/,
  /geographicSource\.(?:create|createMany|update|updateMany|upsert|delete|deleteMany)\s*\(/,
  /geographicObservation\.(?:create|createMany|update|updateMany|upsert|delete|deleteMany)\s*\(/,
  /geographicEligibility\.(?:create|createMany|update|updateMany|upsert|delete|deleteMany)\s*\(/,
  /geographicRelationship\.(?:create|createMany|update|updateMany|upsert|delete|deleteMany)\s*\(/,
  /propertyGeographicRelationship\.(?:create|createMany|update|updateMany|upsert|delete|deleteMany)\s*\(/,
  /\.\$transaction\s*\(/,
  /\$executeRaw/,
]) {
  assert.equal(pattern.test(adapterSource), false, `Sprint 2R consumer adapter must not contain mutation pattern ${pattern}.`);
}

for (const runtimeRoot of ["app", "components", "lib/search", "lib/mls", "lib/typesense", "lib/runtime", "lib/alerts", "lib/email", "workers"]) {
  for (const file of listSourceFiles(runtimeRoot)) {
    const contents = fs.readFileSync(file, "utf8");
    assert.equal(contents.includes("coloradoEnterpriseGeographicConsumptionReadiness"), false, `Runtime/downstream file imports Sprint 2R: ${file}`);
    assert.equal(contents.includes("EKCP_SPRINT_2R"), false, `Runtime/downstream file references Sprint 2R: ${file}`);
  }
}
assert.equal(fs.existsSync("app/api/admin/ekcp/sprint-2r/route.ts"), false, "Sprint 2R must not create an API route.");

const certified = coloradoReadResult();
const result = readEkcpSprint2rColoradoEnterpriseGeographicConsumptionReadiness(certified, {
  authorizationSubject: "COLORADO_STATE",
  requestId: "EKCP-S2R-COLORADO-001",
});
assert.equal(result.success, true);
assert.equal(result.status, "READY_FOR_ENTERPRISE_CONSUMPTION_PROOF");
assert.equal(result.consumptionState, "ENTERPRISE_CONSUMPTION_READY_NOT_RUNTIME_ENABLED");
assert.equal(result.model?.enterpriseSubject.objectType, "STATE");
assert.equal(result.model?.enterpriseSubject.canonicalSlug, "colorado");
assert.equal(result.model?.stateSemantics.municipalitySemanticsApplied, false);
assert.equal(result.model?.stateSemantics.hierarchyTraversalAvailable, false);
assert.equal(result.model?.relationships.relationshipConsumptionEnabled, false);
assert.equal(result.model?.relationships.hierarchyStatus, "NOT_AUTHORIZED");
assert.equal(result.model?.authorization.runtimeEnabled, false);
assert.equal(result.model?.authorization.customerVisible, false);
assert.equal(result.model?.authorization.searchIntegrated, false);
assert.equal(result.model?.authorization.mapsIntegrated, false);
assert.equal(result.model?.authorization.aiIntegrated, false);
assert.equal(assertEkcpSprint2rColoradoConsumptionReady(result), true);

const repeated = readEkcpSprint2rColoradoEnterpriseGeographicConsumptionReadiness(coloradoReadResult({ requestId: "different" }), {
  authorizationSubject: "COLORADO_STATE",
  requestId: "EKCP-S2R-COLORADO-002",
});
assert.deepEqual(stableConsumerResult(result), stableConsumerResult(repeated));

const malformed = readEkcpSprint2rColoradoEnterpriseGeographicConsumptionReadiness(null, { authorizationSubject: "COLORADO_STATE" });
assert.equal(malformed.success, false);
assert.equal(malformed.status, "NOT_AUTHORIZED");

const wrongRequestSubject = readEkcpSprint2rColoradoEnterpriseGeographicConsumptionReadiness(certified, {
  authorizationSubject: "THORNTON" as never,
});
assert.equal(wrongRequestSubject.status, "NOT_AUTHORIZED");

const thorntonInput = readEkcpSprint2rColoradoEnterpriseGeographicConsumptionReadiness(thorntonReadResult(), { authorizationSubject: "COLORADO_STATE" });
assert.equal(thorntonInput.success, false);
assert.ok(thorntonInput.blockingFailures.includes("SOURCE_RESULT_MALFORMED_OR_UNAUTHORIZED"));

for (const [label, source, expectedFailure] of [
  ["wrong adapter identity", coloradoReadResult({ module: "other-module" }), "SOURCE_RESULT_MALFORMED_OR_UNAUTHORIZED"],
  ["arbitrary state slug", coloradoReadResult({ slug: "wyoming" }), "COLORADO_SLUG_MISMATCH"],
  ["wrong fingerprint", coloradoReadResult({ fingerprint: "not-certified" }), "COLORADO_FINGERPRINT_MISMATCH"],
  ["lifecycle drift", coloradoReadResult({ lifecycleState: "ACTIVE" }), "COLORADO_LIFECYCLE_NOT_DRAFT"],
  ["visibility drift", coloradoReadResult({ visibility: "PUBLIC" }), "COLORADO_VISIBILITY_NOT_INTERNAL_ONLY"],
  ["missing alias", coloradoReadResult({ aliases: 1 }), "COLORADO_ALIAS_COUNT_MISMATCH"],
  ["altered alias", coloradoReadResult({ aliasValue: "Colorado" }), "COLORADO_ALIAS_SET_MISMATCH"],
  ["extra source", coloradoReadResult({ sources: 6 }), "COLORADO_SOURCE_COUNT_MISMATCH"],
  ["altered source", coloradoReadResult({ sourceName: "State Office" }), "COLORADO_SOURCE_SET_MISMATCH"],
  ["missing observation", coloradoReadResult({ observations: 4 }), "COLORADO_OBSERVATION_COUNT_MISMATCH"],
  ["altered observation", coloradoReadResult({ observationKey: "altered" }), "COLORADO_OBSERVATION_SET_MISMATCH"],
  ["eligibility drift", coloradoReadResult({ searchEligibility: true }), "COLORADO_ELIGIBILITY_DRIFT"],
  ["relationship present", coloradoReadResult({ geographicRelationshipCount: 1 }), "COLORADO_RELATIONSHIP_PRESENT"],
  ["runtime activation", coloradoReadResult({ runtime: true }), "SOURCE_RUNTIME_OR_CUSTOMER_ACTIVATION_PRESENT"],
  ["customer activation", coloradoReadResult({ customer: true }), "SOURCE_RUNTIME_OR_CUSTOMER_ACTIVATION_PRESENT"],
] as const) {
  const blocked = readEkcpSprint2rColoradoEnterpriseGeographicConsumptionReadiness(source, { authorizationSubject: "COLORADO_STATE" });
  assert.equal(blocked.success, false, label);
  assert.ok(blocked.blockingFailures.includes(expectedFailure), label);
}

const sprint1 = await readEkcpEnterpriseGeographicConsumerAdapter(async () => thorntonReadResult(), {
  consumer: "SEARCH",
  intent: "PLACE_PROFILE",
  place: { certifiedSubjectId: EIP_SPRINT_7_CERTIFIED_OBJECT_ID },
});
assert.equal(sprint1.success, true);
assert.equal(assertEkcpSprint1CertifiedSubject(sprint1), true);
assert.equal(sprint1.subject.placeType, "MUNICIPALITY");

const production = await productionChain();
assert.equal(production.first.success, true);
assert.equal(production.second.success, true);
assert.deepEqual(stableConsumerResult(production.first), stableConsumerResult(production.second));
assert.equal(production.read.writesPerformed, 0);
assert.equal(production.repeatedRead.writesPerformed, 0);
assert.equal(production.first.writesPerformed, 0);
assert.equal(production.first.executed, false);
assert.equal(production.first.model?.relationships.geographicRelationshipCount, 0);
assert.equal(production.first.model?.relationships.propertyGeographicRelationshipCount, 0);
assert.equal(production.first.model?.authorization.runtimeEnabled, false);
assert.equal(production.first.model?.authorization.customerVisible, false);
assert.equal(production.first.model?.authorization.relationshipConsumptionEnabled, false);

assert.ok(packageJson.includes("check:ekcp-sprint-2r-colorado-enterprise-geographic-consumption-readiness"));
assert.ok(workerTsconfig.includes("scripts/checkEkcpSprint2rColoradoEnterpriseGeographicConsumptionReadiness.ts"));
assert.match(report, /EKCP SPRINT 2R STATUS: `CERTIFIED_ENTERPRISE_CONSUMPTION_READY`/);
assert.match(report, /ENTERPRISE_CONSUMPTION_READY_NOT_RUNTIME_ENABLED/);
assert.match(report, /Sprint 2R rather than the previously blocked relationship Sprint 2/);
assert.match(report, /STATE semantics/);
assert.match(report, /no runtime consumption/i);

console.log("[ekcp-sprint-2r-colorado-enterprise-geographic-consumption-readiness] ok: Colorado Wave 4 read result transforms into deterministic internal enterprise consumer model, rejects unauthorized subjects and drift, preserves Thornton/Sprint 1 isolation, performs zero writes, and has no runtime/customer/downstream integration.");

function coloradoReadResult(overrides: {
  requestId?: string;
  module?: string;
  slug?: string;
  fingerprint?: string;
  lifecycleState?: string;
  visibility?: string;
  aliases?: number;
  sources?: number;
  observations?: number;
  aliasValue?: string;
  sourceName?: string;
  observationKey?: string;
  searchEligibility?: boolean;
  geographicRelationshipCount?: number;
  runtime?: boolean;
  customer?: boolean;
} = {}): GofWave4ColoradoReadResult {
  const aggregate = coloradoAggregate(overrides);
  return Object.freeze({
    success: true,
    module: (overrides.module ?? "gof-wave-4-colorado-production-retrieval-readiness-adapter") as GofWave4ColoradoReadResult["module"],
    version: GOF_WAVE_4_ADAPTER_VERSION,
    authorization: GOF_WAVE_4_AUTHORIZATION,
    mode: "read",
    operation: "aggregate",
    executed: false,
    writesPerformed: 0,
    requestId: overrides.requestId ?? "GOF-W4-FIXTURE",
    retrievalTimestamp: "2026-07-26T00:00:00.000Z",
    status: "HEALTHY",
    requiredRecords: { geographicObjects: 1, aliases: 2, sources: 5, observations: 5, eligibilityRows: 1, geographicRelationships: 0, propertyGeographicRelationships: 0 },
    foundRecords: { geographicObjects: 1, aliases: aggregate.aliases.length, sources: aggregate.sources.length, observations: aggregate.observations.length, eligibilityRows: 1, geographicRelationships: aggregate.relationships.geographicRelationshipCount, propertyGeographicRelationships: aggregate.relationships.propertyGeographicRelationshipCount },
    warnings: [],
    blockingFailures: [],
    invariantResults: { canonicalIdentity: true, eligibility: true, relationships: true, rowCounts: true, authorizedLookup: true, noActivation: true },
    resolution: { requestedValue: "colorado", resolvedBy: "aggregate" as const, resolvedObjectId: "colorado-object-id" },
    aggregate,
  } as unknown as GofWave4ColoradoReadResult);
}

function coloradoAggregate(overrides: Parameters<typeof coloradoReadResult>[0] = {}): EnterpriseGeographicReadAggregate {
  const aliases = [
    { aliasId: "alias-1", aliasValue: overrides.aliasValue ?? "CO", normalizedValue: "co", aliasType: "COMMON", canonicalAssociation: "colorado-object-id", lifecycleState: "ACTIVE", language: "en-US", sourceId: "source-1", effectiveDate: null, confidenceMetadata: "CERTIFIED_BY_SPRINT_6_PILOT" as const },
    { aliasId: "alias-2", aliasValue: "State of Colorado", normalizedValue: "state of colorado", aliasType: "LEGAL", canonicalAssociation: "colorado-object-id", lifecycleState: "ACTIVE", language: "en-US", sourceId: "source-2", effectiveDate: null, confidenceMetadata: "CERTIFIED_BY_SPRINT_6_PILOT" as const },
  ].slice(0, overrides.aliases ?? 2);
  const sources = [overrides.sourceName ?? "State of Colorado", "Colorado GIS", "U.S. Census Bureau", "USGS/GNIS", "PROJECT ATLAS - REAL ESTATE DATA TOOLS", "Unexpected Source"]
    .slice(0, overrides.sources ?? 5)
    .map((name, index) => ({ sourceId: `source-${index + 1}`, sourceIdentity: name, sourceClass: "GOVERNMENT", authority: "AUTHORITATIVE", accessMethod: "PUBLIC_WEB", updateCadence: "EVENT_DRIVEN", licensingRestriction: false, publicDisplayRestriction: true, healthState: "READY", verificationMetadata: "CERTIFIED_BY_SPRINT_6_PILOT" as const }));
  const observations = [
    overrides.observationKey ?? "gof.wave3.colorado.state_identity.state_of_colorado",
    "gof.wave3.colorado.state_abbreviation.state_of_colorado",
    "gof.wave3.colorado.state_boundary_authority.colorado_gis",
    "gof.wave3.colorado.state_fips.u.s._census_bureau",
    "gof.wave3.colorado.gnis.usgs/gnis",
  ]
    .slice(0, overrides.observations ?? 5)
    .map((key, index) => ({ observationId: `observation-${index + 1}`, schemaKey: "gof.wave3.colorado.evidence.v1", observationKey: key, governedValue: { key, state: "Colorado" }, knowledgeClassification: "gof.wave3.colorado.evidence.v1", confidence: "HIGH", freshness: "FRESH", derivationMethod: "SOURCE_REPORTED", sourceReference: sources[index % sources.length]?.sourceId ?? null, effectiveDate: null, retrievedAt: null, verifiedAt: null, internalOnly: true, reviewStatus: "REVIEWED" }));
  return Object.freeze({
    identity: { governedObjectId: "colorado-object-id", objectType: "STATE", canonicalName: "Colorado", displayName: "Colorado", canonicalSlug: overrides.slug ?? "colorado", canonicalIdentityState: "CERTIFIED_SINGLETON", lifecycleState: overrides.lifecycleState ?? "DRAFT", visibility: overrides.visibility ?? "INTERNAL_ONLY" },
    aliases: Object.freeze(aliases),
    sources: Object.freeze(sources),
    observations: Object.freeze(observations),
    eligibility: { eligibilityId: "eligibility-1", internalUse: false, searchEligibility: overrides.searchEligibility ?? false, mapEligibility: false, publicPageEligibility: false, indexingEligibility: false, propertyEnrichment: false, marketAnalytics: false, allActivationFlagsFalse: !(overrides.searchEligibility ?? false) },
    relationships: { geographicRelationshipCount: (overrides.geographicRelationshipCount ?? 0) as 0, propertyGeographicRelationshipCount: 0 },
    governance: {
      persistedLineage: { candidateFingerprint: overrides.fingerprint ?? EKCP_SPRINT_2R_REQUIRED_READ_FINGERPRINT, sourceCandidateId: "GOF_WAVE_2_COLORADO_GOVERNED_INSTANCE_FOUNDATION" },
      governedExternalLineage: { sprint3QualityState: "READY", sprint4ReadinessReference: "GOF_WAVE_2_COLORADO_GOVERNED_INSTANCE_FOUNDATION", sprint5ApprovalReference: "GOF_WAVE_2_APPROVED_FOR_DEFINED_NEXT_STEP", sprint6AuthorizationReference: "GOF_WAVE_3C_CERTIFIED_AND_CLOSED", sprint6CertificationStatus: "PRODUCTION_PERSISTED_IDEMPOTENCY_VERIFIED", sprint6A1CertificationStatus: "NOT_APPLICABLE_TO_GOF_WAVE_4", sourceGmaLineage: "GOF Wave 2 governed evidence persisted by GOF Wave 3C." },
      productionPilotVersion: "GOF_1.0_WAVE_3C_CONTROLLED_COLORADO_PRODUCTION_PERSISTENCE_EXECUTION",
      adapterVersion: GOF_WAVE_4_ADAPTER_VERSION,
      retrievalTimestamp: "2026-07-26T00:00:00.000Z",
    },
    activation: { runtime: (overrides.runtime ?? false) as false, customer: (overrides.customer ?? false) as false, search: false, map: false, publicPage: false, indexing: false, analytics: false, ai: false, propertyRelationship: false },
  } as unknown as EnterpriseGeographicReadAggregate);
}

function thorntonReadResult(): EnterpriseGeographicReadResult {
  const aggregate: EnterpriseGeographicReadAggregate = {
    ...coloradoAggregate(),
    identity: { governedObjectId: EIP_SPRINT_7_CERTIFIED_OBJECT_ID, objectType: "MUNICIPALITY", canonicalName: "Thornton", displayName: "Thornton, Colorado", canonicalSlug: "thornton-colorado", canonicalIdentityState: "CERTIFIED_SINGLETON", lifecycleState: "DRAFT", visibility: "INTERNAL_ONLY" },
    governance: {
      ...coloradoAggregate().governance,
      persistedLineage: { candidateFingerprint: "thornton", sourceCandidateId: "SPRINT_6" },
    },
  };
  return {
    success: true,
    module: "eip-sprint-7-production-internal-geographic-read-adapter",
    version: EIP_SPRINT_7_ADAPTER_VERSION,
    authorization: EIP_SPRINT_7_AUTHORIZATION,
    mode: "read",
    operation: "object-id",
    executed: false,
    writesPerformed: 0,
    requestId: "THORNTON",
    retrievalTimestamp: "2026-07-26T00:00:00.000Z",
    status: "HEALTHY",
    requiredRecords: {},
    foundRecords: {},
    warnings: [],
    blockingFailures: [],
    invariantResults: { canonicalIdentity: true, eligibility: true, relationships: true, rowCounts: true, authorizedLookup: true, noActivation: true },
    resolution: { requestedValue: EIP_SPRINT_7_CERTIFIED_OBJECT_ID, resolvedBy: "object-id", resolvedObjectId: EIP_SPRINT_7_CERTIFIED_OBJECT_ID },
    aggregate,
  };
}

function stableConsumerResult(result: Awaited<ReturnType<typeof readEkcpSprint2rColoradoEnterpriseGeographicConsumptionReadiness>>) {
  return {
    ...result,
    requestId: null,
  };
}

async function productionChain() {
  const prisma = new PrismaClient();
  try {
    const read = await retrieveGofWave4ColoradoProductionRetrievalReadiness(prisma, {
      operation: "aggregate",
      canonicalSlug: "colorado",
      objectType: "STATE",
      certifiedFingerprint: EKCP_SPRINT_2R_REQUIRED_READ_FINGERPRINT,
      requestId: "EKCP-S2R-PRODUCTION-READONLY-1",
    });
    const repeatedRead = await retrieveGofWave4ColoradoProductionRetrievalReadiness(prisma, {
      operation: "aggregate",
      canonicalSlug: "colorado",
      objectType: "STATE",
      certifiedFingerprint: EKCP_SPRINT_2R_REQUIRED_READ_FINGERPRINT,
      requestId: "EKCP-S2R-PRODUCTION-READONLY-2",
    });
    const first = readEkcpSprint2rColoradoEnterpriseGeographicConsumptionReadiness(read, { authorizationSubject: "COLORADO_STATE", requestId: "EKCP-S2R-PRODUCTION-CHAIN-1" });
    const second = readEkcpSprint2rColoradoEnterpriseGeographicConsumptionReadiness(repeatedRead, { authorizationSubject: "COLORADO_STATE", requestId: "EKCP-S2R-PRODUCTION-CHAIN-2" });
    return { read, repeatedRead, first, second };
  } finally {
    await prisma.$disconnect();
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

assert.equal(ENTERPRISE_GEOGRAPHIC_READ_CONTRACT_VERSION, "ENTERPRISE_GEOGRAPHIC_READ_CONTRACT_V1");

// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/checkEkcpSprint2rColoradoEnterpriseGeographicConsumptionReadiness.ts
