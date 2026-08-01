import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

import { NEIGHBORHOOD_SUBMARKET_ARCHITECTURE_FIXTURES } from "../lib/neighborhood-submarket/neighborhoodSubmarketFixtures.js";
import {
  NEIGHBORHOOD_SUBMARKET_FAIR_HOUSING_SAFEGUARDS,
  NEIGHBORHOOD_SUBMARKET_INTELLIGENCE_ARCHITECTURE,
  NEIGHBORHOOD_SUBMARKET_OBJECT_TYPE_DEFINITIONS,
  inspectNeighborhoodSubmarketArchitecture,
  type NeighborhoodSubmarketAmbiguity,
  type NeighborhoodSubmarketObjectType,
  type NeighborhoodSubmarketRelationshipType,
  type NeighborhoodSubmarketRouteReadiness,
  type NeighborhoodSubmarketSearchSupport,
} from "../lib/neighborhood-submarket/neighborhoodSubmarketArchitecture.js";

function read(path: string) {
  return readFileSync(path, "utf8");
}

function assertIncludes(source: string, value: string, message: string) {
  assert(source.includes(value), message);
}

function assertNotIncludes(source: string, value: string, message: string) {
  assert(!source.includes(value), message);
}

function assertFileMissing(path: string) {
  assert(!existsSync(path), `${path} must remain absent.`);
}

const packageJson = JSON.parse(read("package.json")) as { scripts?: Record<string, string> };
const tsconfig = read("tsconfig.worker.json");
const architectureSource = read("lib/neighborhood-submarket/neighborhoodSubmarketArchitecture.ts");
const fixtureSource = read("lib/neighborhood-submarket/neighborhoodSubmarketFixtures.ts");
const implementationDoc = read("docs/project-atlas/executive-library/REIE-NEIGHBORHOOD-SUBMARKET-INTELLIGENCE-ARCHITECTURE-IMPLEMENTATION.md");
const chatStart = read("docs/CHAT_START.md");
const cgoDoc = read("docs/project-atlas/executive-library/COLORADO-GEOGRAPHIC-ONTOLOGY-CGO-1.0.md");
const gofDoc = read("docs/project-atlas/executive-library/GOF-1.0-GEOGRAPHIC-OBJECT-FOUNDATION-CHARTER.md");
const gkmDoc = read("docs/project-atlas/executive-library/GKM-1.0-GEOGRAPHIC-KNOWLEDGE-MATRIX.md");
const evidenceDepthSource = read("lib/evidence-depth/evidencePosture.ts");
const sourceRightsSource = read("lib/sourceRightsActivationReadiness.ts");

assert.equal(
  packageJson.scripts?.["check:neighborhood-submarket-intelligence-architecture"],
  "npm run worker:build && node dist/scripts/checkNeighborhoodSubmarketIntelligenceArchitecture.js",
  "package.json must expose Neighborhood / Submarket validation.",
);
assertIncludes(tsconfig, "scripts/checkNeighborhoodSubmarketIntelligenceArchitecture.ts", "Worker build must include Neighborhood / Submarket validation.");
assertIncludes(tsconfig, "lib/neighborhood-submarket/**/*.ts", "Worker build must include Neighborhood / Submarket contracts.");

assertIncludes(cgoDoc, "Colorado Geographic Ontology", "CGO record must remain present.");
assertIncludes(gofDoc, "Geographic Object Foundation", "GOF record must remain present.");
assertIncludes(gkmDoc, "Geographic Knowledge Matrix", "GKM record must remain present.");
assertIncludes(evidenceDepthSource, "EVIDENCE_DEPTH_FOUNDATION_STATUS", "Evidence Depth foundation must remain present.");
assertIncludes(sourceRightsSource, "SourceRightsActivationRecord", "Source-rights readiness contract must remain present.");
assertIncludes(architectureSource, "from \"../evidence-depth/evidencePosture.js\"", "Architecture must reuse Evidence Depth types.");
assertIncludes(architectureSource, "from \"../gkc/fixtureGovernance.js\"", "Architecture must reuse GKC fixture-governance types.");
assertNotIncludes(architectureSource, "export const COLORADO_GEOGRAPHIC_ONTOLOGY", "Architecture must not create a parallel CGO.");
assertNotIncludes(architectureSource, "export const GEOGRAPHIC_OBJECT_FOUNDATION", "Architecture must not create a parallel GOF.");

for (const path of [
  "app/neighborhood-submarket/page.tsx",
  "app/neighborhoods/page.tsx",
  "app/submarkets/page.tsx",
  "app/market/niwot-co-housing-market/page.tsx",
  "app/market/gunbarrel-co-housing-market/page.tsx",
  "app/api/neighborhood-submarket/route.ts",
  "app/api/neighborhoods/route.ts",
  "components/NeighborhoodSubmarketArchitecture.tsx",
  "lib/neighborhood-submarket/api.ts",
  "prisma/migrations/neighborhood-submarket-intelligence",
]) {
  assertFileMissing(path);
}

for (const publicSourcePath of [
  "lib/cities.ts",
  "lib/neighborhoods.ts",
  "lib/neighborhoodPolygons.ts",
  "app/market/[city]/page.tsx",
  "app/market/[city]/[slug]/page.tsx",
  "app/search/page.tsx",
  "app/sitemap.ts",
]) {
  const publicSource = read(publicSourcePath);
  assertNotIncludes(publicSource, "NEIGHBORHOOD_SUBMARKET_INTELLIGENCE_ARCHITECTURE", `${publicSourcePath} must not import internal architecture.`);
  assertNotIncludes(publicSource, "neighborhoodSubmarketArchitecture", `${publicSourcePath} must not import internal architecture.`);
}

const inspection = inspectNeighborhoodSubmarketArchitecture(NEIGHBORHOOD_SUBMARKET_ARCHITECTURE_FIXTURES);

assert.equal(inspection.architecture, NEIGHBORHOOD_SUBMARKET_INTELLIGENCE_ARCHITECTURE);
assert.equal(inspection.architecture, "NEIGHBORHOOD_SUBMARKET_INTELLIGENCE_ARCHITECTURE");
assert(inspection.objectTypeCount >= 20, "Governed and restricted object types must be defined.");
assert.equal(inspection.fixtureCount, 18, "Eighteen fixture cases must cover required architecture scenarios.");
assert(inspection.objectCount >= 20, "Fixtures must cover a representative object graph.");
assert(inspection.relationshipCount >= 18, "Relationships must cover parent, overlap, market, and context cases.");

const requiredObjectTypes: readonly NeighborhoodSubmarketObjectType[] = [
  "NEIGHBORHOOD",
  "SUBDIVISION",
  "DISTRICT",
  "CORRIDOR",
  "MARKET_AREA",
  "UNINCORPORATED_COMMUNITY",
  "COMMUNITY",
  "PLANNED_COMMUNITY",
  "CENSUS_DESIGNATED_PLACE",
  "ZIP_CODE_AREA",
  "MUNICIPALITY",
  "CITY",
  "TOWN",
  "COUNTY",
  "HOA",
  "METROPOLITAN_DISTRICT",
  "SPECIAL_DISTRICT",
  "IMPROVEMENT_DISTRICT",
  "PROPERTY_CLUSTER",
  "PARCEL",
  "PROPERTY",
];
for (const type of requiredObjectTypes) {
  assert(
    NEIGHBORHOOD_SUBMARKET_OBJECT_TYPE_DEFINITIONS.some((definition) => definition.objectType === type),
    `Object type definition must exist: ${type}`,
  );
}
for (const type of ["NEIGHBORHOOD", "SUBDIVISION", "CORRIDOR", "MARKET_AREA", "UNINCORPORATED_COMMUNITY", "CENSUS_DESIGNATED_PLACE", "ZIP_CODE_AREA", "HOA"] as const) {
  assert(inspection.objectTypesCovered.includes(type), `Fixture coverage must include object type: ${type}`);
}

const requiredRelationships: readonly NeighborhoodSubmarketRelationshipType[] = [
  "WITHIN",
  "OVERLAPS",
  "PART_OF",
  "ASSOCIATED_WITH",
  "SERVED_BY",
  "CROSSES",
  "HAS_MARKET_CONTEXT",
  "HAS_MUNICIPAL_CONTEXT",
];
for (const relationship of requiredRelationships) {
  assert(inspection.relationshipTypesCovered.includes(relationship), `Relationship type must be covered: ${relationship}`);
}

const requiredAmbiguity: readonly NeighborhoodSubmarketAmbiguity[] = [
  "NO_KNOWN_AMBIGUITY",
  "OBJECT_TYPE_AMBIGUITY",
  "PARENT_AMBIGUITY",
  "JURISDICTION_AMBIGUITY",
  "OVERLAPPING_IDENTITY",
  "LOCALLY_RECOGNIZED_BUT_UNOFFICIAL",
  "INSUFFICIENT_EVIDENCE",
  "UNRESOLVED_CONFLICT",
];
for (const ambiguity of requiredAmbiguity) {
  assert(inspection.ambiguityStatesCovered.includes(ambiguity), `Ambiguity state must be covered: ${ambiguity}`);
}

const requiredRouteStates: readonly NeighborhoodSubmarketRouteReadiness[] = [
  "BLOCKED",
  "ARCHITECTURE_READY",
  "CONTENT_PREREQUISITES_INCOMPLETE",
  "EVIDENCE_PREREQUISITES_INCOMPLETE",
  "SOURCE_RIGHTS_PREREQUISITES_INCOMPLETE",
  "SEARCH_SUPPORT_PREREQUISITES_INCOMPLETE",
  "BOUNDARY_PREREQUISITES_INCOMPLETE",
  "FAIR_HOUSING_REVIEW_REQUIRED",
  "CERTIFICATION_READY",
];
for (const routeState of requiredRouteStates) {
  assert(inspection.routeReadinessStatesCovered.includes(routeState), `Route-readiness state must be covered: ${routeState}`);
}

const requiredSearchStates: readonly NeighborhoodSubmarketSearchSupport[] = [
  "UNSUPPORTED",
  "ALIAS_ONLY",
  "CITY_FILTER_COMPATIBLE",
  "NEIGHBORHOOD_FILTER_COMPATIBLE",
  "SUBDIVISION_FILTER_COMPATIBLE",
  "DATA_COVERAGE_INCOMPLETE",
  "AMBIGUOUS",
  "UNRESOLVED",
];
for (const searchState of requiredSearchStates) {
  assert(inspection.searchSupportStatesCovered.includes(searchState), `Search-support state must be covered: ${searchState}`);
}

assert(inspection.blockedActivationCaseCount >= 12, "Blocked activation cases must dominate first-version fixtures.");
assert(inspection.sourceRightsFailClosedCaseCount >= 8, "Unknown, unresolved, restricted, and internal-only rights must fail closed.");
assert.equal(inspection.gunbarrelOutcome, "DEFERRED_AND_BLOCKED", "Gunbarrel must remain deferred and blocked.");
assert.equal(inspection.niwotOutcome, "DEFERRED_AND_BLOCKED", "Niwot must remain deferred and blocked.");
assert(inspection.fairHousingSafeguardsCovered.length === NEIGHBORHOOD_SUBMARKET_FAIR_HOUSING_SAFEGUARDS.length, "Fair-housing safeguards must be complete.");

for (const graph of inspection.graphs) {
  assert.equal(graph.activation.publicRouteCreated, false);
  assert.equal(graph.activation.publicRouteEligibilityChanged, false);
  assert.equal(graph.activation.publicRegistryEntryCreated, false);
  assert.equal(graph.activation.publicSitemapChanged, false);
  assert.equal(graph.activation.publicCanonicalUrlChanged, false);
  assert.equal(graph.activation.publicUiChanged, false);
  assert.equal(graph.activation.publicApiCreated, false);
  assert.equal(graph.activation.searchBehaviorChanged, false);
  assert.equal(graph.activation.searchRankingChanged, false);
  assert.equal(graph.activation.mapBoundaryChanged, false);
  assert.equal(graph.activation.gisRuntimeActivated, false);
  assert.equal(graph.activation.providerCalls, 0);
  assert.equal(graph.activation.networkAcquisition, false);
  assert.equal(graph.activation.persistenceReads, false);
  assert.equal(graph.activation.persistenceWrites, false);
  assert.equal(graph.activation.schemaChanged, false);
  assert.equal(graph.activation.productionWrites, false);
  assert.equal(graph.activation.customerDataAccess, false);
  assert.equal(graph.activation.niwotActivated, false);
  assert.equal(graph.activation.gunbarrelActivated, false);
  assert.equal(graph.neighborhoodRecommendation, null);
  assert.equal(graph.desirability, null);
  assert.equal(graph.suitability, null);
  assert.equal(graph.rank, null);
  assert.equal(graph.score, null);
  assert.equal(graph.investmentConclusion, null);
  assert.equal(graph.valuation, null);
  assert.equal(graph.forecast, null);
  assert.equal(graph.safetyConclusion, null);
  assert.equal(graph.schoolConclusion, null);
  assert.equal(graph.demographicProfile, null);
  assert.equal(graph.publicActivationDecision, null);
  for (const relationship of graph.relationships) {
    assert.equal(relationship.forcesExclusiveParent, false, "Relationships must not force unsupported exclusive hierarchy.");
  }
}

assert.equal(inspection.prohibitedOutputAssertions.recommendations, false);
assert.equal(inspection.prohibitedOutputAssertions.desirability, false);
assert.equal(inspection.prohibitedOutputAssertions.suitability, false);
assert.equal(inspection.prohibitedOutputAssertions.rankings, false);
assert.equal(inspection.prohibitedOutputAssertions.scores, false);
assert.equal(inspection.prohibitedOutputAssertions.valuation, false);
assert.equal(inspection.prohibitedOutputAssertions.forecasts, false);
assert.equal(inspection.prohibitedOutputAssertions.safetyConclusions, false);
assert.equal(inspection.prohibitedOutputAssertions.schoolConclusions, false);
assert.equal(inspection.prohibitedOutputAssertions.demographicProfiles, false);
assert.equal(inspection.prohibitedOutputAssertions.investmentAdvice, false);
assert.equal(inspection.prohibitedOutputAssertions.publicActivation, false);

const zipObject = inspection.graphs.flatMap((graph) => graph.objects).find((object) => object.objectType === "ZIP_CODE_AREA");
assert(zipObject, "ZIP code fixture must exist.");
assert.equal(zipObject.publicEligibility, "BLOCKED", "ZIP code must not be treated as a community or public route.");
assert(zipObject.limitations.some((limitation) => limitation.includes("not a community")), "ZIP code limitation must preserve object-type distinction.");

const hoaDefinition = NEIGHBORHOOD_SUBMARKET_OBJECT_TYPE_DEFINITIONS.find((definition) => definition.objectType === "HOA");
assert(hoaDefinition, "HOA definition must exist.");
assert.equal(hoaDefinition.futurePublicRoutePossible, false, "HOA must not be publicly eligible by default.");
assert(hoaDefinition.futureOrRestricted, "HOA must remain a future or restricted type.");

const marketAreaDefinition = NEIGHBORHOOD_SUBMARKET_OBJECT_TYPE_DEFINITIONS.find((definition) => definition.objectType === "MARKET_AREA");
assert(marketAreaDefinition, "Market area definition must exist.");
assert(marketAreaDefinition.meaning.includes("not a legal jurisdiction"), "Market area must not be treated as legal jurisdiction.");

for (const source of [architectureSource, fixtureSource]) {
  for (const prohibited of [
    "fetch(",
    "XMLHttpRequest",
    "PrismaClient",
    "DATABASE_URL",
    "process.env",
    "localStorage",
    "sessionStorage",
    "document.cookie",
    "navigator.sendBeacon",
    "<form",
    "type=\"hidden\"",
    "sendEmail",
    "createTask",
    "scoreNeighborhood",
    "rankNeighborhood",
    "recommendNeighborhood",
  ]) {
    assertNotIncludes(source, prohibited, `Neighborhood / Submarket Architecture must remain internal and non-activating: ${prohibited}`);
  }
}

for (const required of [
  "NEIGHBORHOOD_SUBMARKET_INTELLIGENCE_ARCHITECTURE",
  "Gunbarrel",
  "Niwot",
  "public routes",
  "no public activation",
  "fair-housing",
  "source-rights",
  "fixture-backed",
  "deterministic",
]) {
  assertIncludes(implementationDoc, required, `Implementation governance record must include: ${required}`);
}
assertIncludes(chatStart, "NEIGHBORHOOD_SUBMARKET_INTELLIGENCE_ARCHITECTURE_READY_FOR_PUSH", "CHAT_START must record local certification state after implementation.");

console.log(JSON.stringify({
  status: inspection.status,
  architecture: inspection.architecture,
  objectTypeCount: inspection.objectTypeCount,
  fixtureCount: inspection.fixtureCount,
  objectCount: inspection.objectCount,
  relationshipCount: inspection.relationshipCount,
  relationshipTypesCovered: inspection.relationshipTypesCovered,
  ambiguityStatesCovered: inspection.ambiguityStatesCovered,
  routeReadinessStatesCovered: inspection.routeReadinessStatesCovered,
  registryReadinessStatesCovered: inspection.registryReadinessStatesCovered,
  searchSupportStatesCovered: inspection.searchSupportStatesCovered,
  blockedActivationCaseCount: inspection.blockedActivationCaseCount,
  sourceRightsFailClosedCaseCount: inspection.sourceRightsFailClosedCaseCount,
  gunbarrelOutcome: inspection.gunbarrelOutcome,
  niwotOutcome: inspection.niwotOutcome,
  prohibitedOutputAssertions: inspection.prohibitedOutputAssertions,
}, null, 2));
