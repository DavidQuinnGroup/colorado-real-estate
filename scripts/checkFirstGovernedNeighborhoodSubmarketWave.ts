import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

import { neighborhoods } from "../lib/neighborhoods.js";
import {
  FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_IMPLEMENTATION_WAVE,
  FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CONTRACT,
  inspectFirstGovernedNeighborhoodSubmarketWave,
} from "../lib/neighborhood-submarket/firstGovernedNeighborhoodSubmarketWave.js";
import { FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CANDIDATES } from "../lib/neighborhood-submarket/firstGovernedNeighborhoodSubmarketWaveFixtures.js";
import { NEIGHBORHOOD_SUBMARKET_INTELLIGENCE_ARCHITECTURE } from "../lib/neighborhood-submarket/neighborhoodSubmarketArchitecture.js";

function read(path: string) {
  return readFileSync(path, "utf8");
}

function assertIncludes(source: string, expected: string, message: string) {
  assert(source.includes(expected), message);
}

function assertNotIncludes(source: string, forbidden: string, message: string) {
  assert(!source.includes(forbidden), message);
}

function assertFileMissing(path: string) {
  assert(!existsSync(path), `${path} must remain absent.`);
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function parseNeighborhoodRoute(path: string) {
  const match = path.match(/^\/market\/([^/]+)\/([^/]+)$/);
  assert(match, `Existing public route must use the current neighborhood route pattern: ${path}`);
  return {
    city: match[1],
    slug: match[2],
  };
}

function assertExistingNeighborhoodRoute(path: string) {
  const { city, slug } = parseNeighborhoodRoute(path);
  const exists = neighborhoods.some((neighborhood) => normalize(neighborhood.city) === city && normalize(neighborhood.slug) === slug);
  assert(exists, `${path} must correspond to an existing repository neighborhood record.`);
}

const packageJson = JSON.parse(read("package.json")) as { scripts?: Record<string, string> };
const tsconfig = read("tsconfig.worker.json");
const waveSource = read("lib/neighborhood-submarket/firstGovernedNeighborhoodSubmarketWave.ts");
const fixtureSource = read("lib/neighborhood-submarket/firstGovernedNeighborhoodSubmarketWaveFixtures.ts");
const architectureSource = read("lib/neighborhood-submarket/neighborhoodSubmarketArchitecture.ts");
const routeSource = read("app/market/[city]/[slug]/page.tsx");
const sitemapSource = read("app/sitemap.ts");
const neighborhoodsSource = read("lib/neighborhoods.ts");
const searchPageSource = read("app/search/page.tsx");
const implementationDoc = read("docs/project-atlas/executive-library/REIE-FIRST-GOVERNED-NEIGHBORHOOD-SUBMARKET-WAVE-IMPLEMENTATION.md");
const chatStart = read("docs/CHAT_START.md");

assert.equal(
  packageJson.scripts?.["check:first-governed-neighborhood-submarket-wave"],
  "npm run worker:build && node dist/scripts/checkFirstGovernedNeighborhoodSubmarketWave.js",
  "package.json must expose the first governed Neighborhood / Submarket wave check.",
);
assertIncludes(tsconfig, "scripts/checkFirstGovernedNeighborhoodSubmarketWave.ts", "Worker build must include the first-wave check.");
assertIncludes(tsconfig, "lib/neighborhood-submarket/**/*.ts", "Worker build must include Neighborhood / Submarket contracts.");

assertIncludes(
  waveSource,
  "NEIGHBORHOOD_SUBMARKET_INTELLIGENCE_ARCHITECTURE",
  "First wave must reuse certified Neighborhood / Submarket Architecture.",
);
assertIncludes(
  waveSource,
  "FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_IMPLEMENTATION_WAVE",
  "One authoritative first-wave contract must exist.",
);
assertNotIncludes(waveSource, "export const COLORADO_GEOGRAPHIC_ONTOLOGY", "First wave must not create a parallel CGO.");
assertNotIncludes(waveSource, "export const GEOGRAPHIC_OBJECT_FOUNDATION", "First wave must not create a parallel GOF.");
assertNotIncludes(waveSource, "fetch(", "First wave must remain network-free.");
assertNotIncludes(fixtureSource, "best neighborhood", "Fixtures must not contain prohibited best-neighborhood copy.");
assertNotIncludes(fixtureSource, "ideal for", "Fixtures must not contain prohibited ideal-for copy.");
assertNotIncludes(fixtureSource, "safest", "Fixtures must not contain prohibited safety copy.");

assert.equal(FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CONTRACT.contract, FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_IMPLEMENTATION_WAVE);
assert.equal(FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CONTRACT.reusedArchitecture, NEIGHBORHOOD_SUBMARKET_INTELLIGENCE_ARCHITECTURE);
assert.equal(FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CONTRACT.scope.internalReadiness, true);
assert.equal(FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CONTRACT.scope.existingRoutePreservation, true);
assert.equal(FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CONTRACT.scope.embeddedEvidenceDepthAndSourceRights, true);
assert.equal(FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CONTRACT.scope.noNewPublicRoutes, true);
assert.equal(FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CONTRACT.scope.noSearchChanges, true);
assert.equal(FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CONTRACT.scope.noMapChanges, true);

assertIncludes(architectureSource, "NeighborhoodSubmarketObjectType", "Certified architecture object type contract must remain present.");
assertIncludes(architectureSource, "NeighborhoodSubmarketRouteReadiness", "Certified route-readiness contract must remain present.");
assertIncludes(architectureSource, "NeighborhoodSubmarketSearchSupport", "Certified Search-support contract must remain present.");

for (const path of [
  "app/first-governed-neighborhood-submarket-wave/page.tsx",
  "app/neighborhood-submarket-wave/page.tsx",
  "app/api/first-governed-neighborhood-submarket-wave/route.ts",
  "app/api/neighborhood-submarket-wave/route.ts",
  "components/FirstGovernedNeighborhoodSubmarketWave.tsx",
  "lib/neighborhood-submarket/api.ts",
]) {
  assertFileMissing(path);
}

for (const publicSource of [routeSource, sitemapSource, neighborhoodsSource, searchPageSource]) {
  assertNotIncludes(publicSource, "FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_IMPLEMENTATION_WAVE", "Public sources must not import the internal first-wave contract.");
  assertNotIncludes(publicSource, "firstGovernedNeighborhoodSubmarketWave", "Public sources must not import first-wave internals.");
}

for (const candidate of FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CANDIDATES) {
  assert(candidate.canonicalObjectId !== candidate.slug, `${candidate.candidateId} identity must not rely on slug only.`);
  assert(candidate.canonicalName.length > 0, `${candidate.candidateId} must have a canonical name.`);
  assert(candidate.countyContext.length > 0, `${candidate.candidateId} must preserve county context.`);
  assert(candidate.evidencePosture.requirements.includes("CANONICAL_IDENTITY_EVIDENCE"), `${candidate.candidateId} must require identity evidence.`);
  assert(candidate.evidencePosture.requirements.includes("SOURCE_RIGHTS_POSTURE"), `${candidate.candidateId} must require source-rights posture.`);
  assert(candidate.evidencePosture.requirements.includes("LIMITATIONS"), `${candidate.candidateId} must preserve limitations.`);
  assert.equal(candidate.routePreservation.canonicalUrlUnchanged, true, `${candidate.candidateId} canonical URL posture must remain unchanged.`);
  assert.equal(candidate.routePreservation.httpBehaviorUnchanged, true, `${candidate.candidateId} HTTP behavior must remain unchanged.`);
  assert.equal(candidate.routePreservation.sitemapBehaviorUnchanged, true, `${candidate.candidateId} sitemap behavior must remain unchanged.`);
  assert.equal(candidate.routePreservation.searchBehaviorUnchanged, true, `${candidate.candidateId} Search behavior must remain unchanged.`);
  assert.equal(candidate.routePreservation.mapBehaviorUnchanged, true, `${candidate.candidateId} map behavior must remain unchanged.`);
  assert.equal(candidate.routePreservation.contentUnchanged, true, `${candidate.candidateId} public content must remain unchanged.`);
  assert.equal(candidate.routePreservation.metadataUnchanged, true, `${candidate.candidateId} public metadata must remain unchanged.`);
  assert.equal(candidate.routePreservation.maturityPromoted, false, `${candidate.candidateId} must not promote maturity.`);
  assert.equal(candidate.routePreservation.routeAliasIntroduced, false, `${candidate.candidateId} must not create a route alias.`);
  assert.equal(candidate.routePreservation.redirectIntroduced, false, `${candidate.candidateId} must not introduce a redirect.`);
  assert.equal(candidate.routePreservation.routeEligibilityExpanded, false, `${candidate.candidateId} must not expand route eligibility.`);

  assert.equal(candidate.activation.newPublicRouteCreated, false, `${candidate.candidateId} must not create a new route.`);
  assert.equal(candidate.activation.publicRouteEligibilityChanged, false, `${candidate.candidateId} must not change route eligibility.`);
  assert.equal(candidate.activation.publicRegistryEligibilityChanged, false, `${candidate.candidateId} must not change registry eligibility.`);
  assert.equal(candidate.activation.publicSitemapChanged, false, `${candidate.candidateId} must not change sitemap behavior.`);
  assert.equal(candidate.activation.publicCanonicalUrlChanged, false, `${candidate.candidateId} must not change canonical behavior.`);
  assert.equal(candidate.activation.publicMetadataChanged, false, `${candidate.candidateId} must not change public metadata.`);
  assert.equal(candidate.activation.publicContentChanged, false, `${candidate.candidateId} must not change public content.`);
  assert.equal(candidate.activation.publicUiChanged, false, `${candidate.candidateId} must not change public UI.`);
  assert.equal(candidate.activation.publicApiCreated, false, `${candidate.candidateId} must not create an API.`);
  assert.equal(candidate.activation.searchBehaviorChanged, false, `${candidate.candidateId} must not change Search behavior.`);
  assert.equal(candidate.activation.searchRankingChanged, false, `${candidate.candidateId} must not change Search ranking.`);
  assert.equal(candidate.activation.mapBehaviorChanged, false, `${candidate.candidateId} must not change map behavior.`);
  assert.equal(candidate.activation.mapBoundaryChanged, false, `${candidate.candidateId} must not change map boundaries.`);
  assert.equal(candidate.activation.providerCalls, 0, `${candidate.candidateId} must not call providers.`);
  assert.equal(candidate.activation.networkAcquisition, false, `${candidate.candidateId} must not acquire network data.`);
  assert.equal(candidate.activation.databaseWrites, false, `${candidate.candidateId} must not write databases.`);
  assert.equal(candidate.activation.persistenceWrites, false, `${candidate.candidateId} must not persist records.`);
  assert.equal(candidate.activation.schemaChanged, false, `${candidate.candidateId} must not change schema.`);
  assert.equal(candidate.activation.productionWrites, false, `${candidate.candidateId} must not mutate production.`);
  assert.equal(candidate.activation.customerDataAccess, false, `${candidate.candidateId} must not access customer data.`);
  assert.equal(candidate.activation.niwotActivated, false, `${candidate.candidateId} must not activate Niwot.`);
  assert.equal(candidate.activation.gunbarrelActivated, false, `${candidate.candidateId} must not activate Gunbarrel.`);
  assert.equal(candidate.activation.ldiWave4Activated, false, `${candidate.candidateId} must not activate LDI Wave 4.`);

  assert.equal(candidate.prohibitedOutputs.rank, null, `${candidate.candidateId} must not return rank.`);
  assert.equal(candidate.prohibitedOutputs.score, null, `${candidate.candidateId} must not return score.`);
  assert.equal(candidate.prohibitedOutputs.recommendation, null, `${candidate.candidateId} must not return recommendation.`);
  assert.equal(candidate.prohibitedOutputs.desirability, null, `${candidate.candidateId} must not return desirability.`);
  assert.equal(candidate.prohibitedOutputs.suitability, null, `${candidate.candidateId} must not return suitability.`);
  assert.equal(candidate.prohibitedOutputs.valuation, null, `${candidate.candidateId} must not return valuation.`);
  assert.equal(candidate.prohibitedOutputs.forecast, null, `${candidate.candidateId} must not return forecast.`);
  assert.equal(candidate.prohibitedOutputs.demographicProfile, null, `${candidate.candidateId} must not return demographic profile.`);
  assert.equal(candidate.prohibitedOutputs.schoolConclusion, null, `${candidate.candidateId} must not return school conclusion.`);
  assert.equal(candidate.prohibitedOutputs.safetyConclusion, null, `${candidate.candidateId} must not return safety conclusion.`);
  assert.equal(candidate.prohibitedOutputs.investmentConclusion, null, `${candidate.candidateId} must not return investment conclusion.`);
  assert.equal(candidate.prohibitedOutputs.publicActivationDecision, null, `${candidate.candidateId} must not return public activation decision.`);

  for (const rel of candidate.relationships) {
    assert.equal(rel.forcesExclusiveParent, false, `${rel.relationshipId} must not force an exclusive hierarchy.`);
  }

  if (candidate.existingPublicRoute) {
    assertExistingNeighborhoodRoute(candidate.existingPublicRoute);
  }
}

const inspection = inspectFirstGovernedNeighborhoodSubmarketWave();

assert.equal(inspection.contract, FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_IMPLEMENTATION_WAVE);
assert.equal(inspection.reusedArchitecture, NEIGHBORHOOD_SUBMARKET_INTELLIGENCE_ARCHITECTURE);
assert.equal(inspection.candidateCount, 18, "First wave must inspect eighteen bounded candidates and guards.");
assert(inspection.includedCandidateCount >= 12, "First wave must include a bounded real candidate portfolio.");
assert(inspection.protectedGuardCount >= 4, "Protected non-activation guards must remain present.");
assert(inspection.existingRoutePreservationCount >= 10, "Existing route preservation must be the dominant first-wave posture.");
assert(inspection.internalReadinessCount >= 2, "Internal readiness must be represented.");
assert(inspection.relationshipCount >= 16, "Relationships must cover parent, county, market, and overlap context.");

for (const objectType of ["NEIGHBORHOOD", "SUBDIVISION", "MARKET_AREA", "COMMUNITY", "UNINCORPORATED_COMMUNITY", "ZIP_CODE_AREA"] as const) {
  assert(inspection.objectTypesCovered.includes(objectType), `Object-type coverage must include ${objectType}.`);
}
for (const relationshipType of ["WITHIN", "PART_OF", "OVERLAPS", "ASSOCIATED_WITH", "HAS_MARKET_CONTEXT", "HAS_COUNTY_CONTEXT"] as const) {
  assert(inspection.relationshipTypesCovered.includes(relationshipType), `Relationship coverage must include ${relationshipType}.`);
}
for (const disposition of [
  "EXISTING_ROUTE_PRESERVED",
  "INTERNAL_READINESS_ONLY",
  "EVIDENCE_INCOMPLETE",
  "SOURCE_RIGHTS_INCOMPLETE",
  "BOUNDARY_UNRESOLVED",
  "SEARCH_UNSUPPORTED",
  "MAP_UNSUPPORTED",
  "FAIR_HOUSING_REVIEW_REQUIRED",
  "PUBLIC_ACTIVATION_BLOCKED",
  "FUTURE_CERTIFICATION_CANDIDATE",
  "DEFERRED",
  "UNRESOLVED",
] as const) {
  assert(inspection.dispositionsCovered.includes(disposition), `Disposition coverage must include ${disposition}.`);
}
for (const boundary of ["DESCRIPTIVE_AREA_ONLY", "APPROXIMATE_BOUNDARY", "UNAVAILABLE", "UNRESOLVED", "PROHIBITED_FOR_PUBLIC_USE"] as const) {
  assert(inspection.boundaryPosturesCovered.includes(boundary), `Boundary posture coverage must include ${boundary}.`);
}
for (const search of ["NEIGHBORHOOD_FILTER_COMPATIBLE", "SUBDIVISION_FILTER_COMPATIBLE", "ALIAS_ONLY", "UNSUPPORTED", "AMBIGUOUS", "UNRESOLVED", "BLOCKED"] as const) {
  assert(inspection.searchSupportCovered.includes(search), `Search posture coverage must include ${search}.`);
}
for (const rights of ["DERIVED_OR_SUMMARY_USE_ONLY", "INTERNAL_ANALYSIS_ONLY", "UNKNOWN_OR_UNRESOLVED", "RESTRICTED", "PROHIBITED"] as const) {
  assert(inspection.evidenceRightsCovered.includes(rights), `Rights posture coverage must include ${rights}.`);
}

assert(inspection.blockedCaseCount >= 6, "Blocked activation cases must remain visible.");
assert(inspection.sourceRightsFailClosedCaseCount >= 6, "Unknown, restricted, internal-only, and prohibited rights must fail closed.");
assert(inspection.boundaryLimitationCaseCount >= 12, "Boundary limitations must remain visible.");
assert(inspection.searchUnsupportedOrBlockedCount >= 5, "Search-support limitations must remain visible.");
assert(inspection.mapUnsupportedOrBlockedCount >= 12, "Map-support limitations must remain visible.");
assert(inspection.ambiguityCaseCount >= 10, "Ambiguity must remain visible.");
assert.equal(inspection.gunbarrelOutcome, "DEFERRED_AND_BLOCKED", "Gunbarrel must remain deferred and blocked.");
assert.equal(inspection.niwotOutcome, "DEFERRED_AND_BLOCKED", "Niwot must remain deferred and blocked.");
assert.equal(inspection.prohibitedConversionGuard, "PASS", "ZIP, HOA, market-area, and jurisdiction conversion guard must pass.");

assert.equal(inspection.activationAssertions.noNewPublicRoutes, true);
assert.equal(inspection.activationAssertions.noRouteEligibilityChange, true);
assert.equal(inspection.activationAssertions.noRegistryEligibilityChange, true);
assert.equal(inspection.activationAssertions.noSitemapChange, true);
assert.equal(inspection.activationAssertions.noCanonicalChange, true);
assert.equal(inspection.activationAssertions.noSearchChange, true);
assert.equal(inspection.activationAssertions.noMapChange, true);
assert.equal(inspection.activationAssertions.noApiCreated, true);
assert.equal(inspection.activationAssertions.noProviderCalls, true);
assert.equal(inspection.activationAssertions.noNetworkAcquisition, true);
assert.equal(inspection.activationAssertions.noPersistenceWrites, true);
assert.equal(inspection.activationAssertions.noSchemaChange, true);
assert.equal(inspection.activationAssertions.noProductionWrites, true);
assert.equal(inspection.activationAssertions.noCustomerDataAccess, true);
assert.equal(inspection.activationAssertions.noNiwotActivation, true);
assert.equal(inspection.activationAssertions.noGunbarrelActivation, true);
assert.equal(inspection.activationAssertions.noLdiWave4Activation, true);

assert.equal(inspection.prohibitedOutputAssertions.rank, false);
assert.equal(inspection.prohibitedOutputAssertions.score, false);
assert.equal(inspection.prohibitedOutputAssertions.recommendation, false);
assert.equal(inspection.prohibitedOutputAssertions.desirability, false);
assert.equal(inspection.prohibitedOutputAssertions.suitability, false);
assert.equal(inspection.prohibitedOutputAssertions.valuation, false);
assert.equal(inspection.prohibitedOutputAssertions.forecast, false);
assert.equal(inspection.prohibitedOutputAssertions.demographicProfile, false);
assert.equal(inspection.prohibitedOutputAssertions.schoolConclusion, false);
assert.equal(inspection.prohibitedOutputAssertions.safetyConclusion, false);
assert.equal(inspection.prohibitedOutputAssertions.investmentConclusion, false);
assert.equal(inspection.prohibitedOutputAssertions.publicActivationDecision, false);

assertIncludes(implementationDoc, "FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_IMPLEMENTATION_WAVE", "Implementation record must name the authoritative contract.");
assertIncludes(implementationDoc, "no new public routes", "Implementation record must preserve no-new-route status.");
assertIncludes(implementationDoc, "Gunbarrel", "Implementation record must record Gunbarrel non-activation.");
assertIncludes(implementationDoc, "Niwot", "Implementation record must record Niwot non-activation.");
assertIncludes(chatStart, "FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_READY_FOR_PUSH", "CHAT_START must record local ready-for-push status.");

console.log(
  JSON.stringify(
    {
      status: "FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_READY_FOR_PUSH",
      contract: inspection.contract,
      candidates: inspection.candidateCount,
      includedCandidates: inspection.includedCandidateCount,
      existingRoutePreservation: inspection.existingRoutePreservationCount,
      internalReadiness: inspection.internalReadinessCount,
      relationships: inspection.relationshipCount,
      blockedCases: inspection.blockedCaseCount,
      sourceRightsFailClosedCases: inspection.sourceRightsFailClosedCaseCount,
      boundaryLimitationCases: inspection.boundaryLimitationCaseCount,
      searchUnsupportedOrBlocked: inspection.searchUnsupportedOrBlockedCount,
      mapUnsupportedOrBlocked: inspection.mapUnsupportedOrBlockedCount,
      ambiguityCases: inspection.ambiguityCaseCount,
      gunbarrel: inspection.gunbarrelOutcome,
      niwot: inspection.niwotOutcome,
      prohibitedOutputAssertions: inspection.prohibitedOutputAssertions,
    },
    null,
    2,
  ),
);
