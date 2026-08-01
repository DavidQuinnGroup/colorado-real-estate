import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

import { neighborhoods } from "../lib/neighborhoods.js";
import {
  FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_IMPLEMENTATION_WAVE,
  FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CONTRACT,
} from "../lib/neighborhood-submarket/firstGovernedNeighborhoodSubmarketWave.js";
import { NEIGHBORHOOD_SUBMARKET_INTELLIGENCE_ARCHITECTURE } from "../lib/neighborhood-submarket/neighborhoodSubmarketArchitecture.js";
import {
  SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_IMPLEMENTATION_WAVE,
  SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CONTRACT,
  inspectSecondGovernedNeighborhoodSubmarketWave,
} from "../lib/neighborhood-submarket/secondGovernedNeighborhoodSubmarketWave.js";
import { SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CANDIDATES } from "../lib/neighborhood-submarket/secondGovernedNeighborhoodSubmarketWaveFixtures.js";

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
const waveSource = read("lib/neighborhood-submarket/secondGovernedNeighborhoodSubmarketWave.ts");
const fixtureSource = read("lib/neighborhood-submarket/secondGovernedNeighborhoodSubmarketWaveFixtures.ts");
const firstWaveSource = read("lib/neighborhood-submarket/firstGovernedNeighborhoodSubmarketWave.ts");
const architectureSource = read("lib/neighborhood-submarket/neighborhoodSubmarketArchitecture.ts");
const routeSource = read("app/market/[city]/[slug]/page.tsx");
const sitemapSource = read("app/sitemap.ts");
const neighborhoodsSource = read("lib/neighborhoods.ts");
const searchPageSource = read("app/search/page.tsx");
const implementationDoc = read("docs/project-atlas/executive-library/REIE-SECOND-GOVERNED-NEIGHBORHOOD-SUBMARKET-WAVE-IMPLEMENTATION.md");
const chatStart = read("docs/CHAT_START.md");

assert.equal(
  packageJson.scripts?.["check:second-governed-neighborhood-submarket-wave"],
  "npm run worker:build && node dist/scripts/checkSecondGovernedNeighborhoodSubmarketWave.js",
  "package.json must expose the second governed Neighborhood / Submarket wave check.",
);
assertIncludes(tsconfig, "scripts/checkSecondGovernedNeighborhoodSubmarketWave.ts", "Worker build must include the Wave 2 check.");
assertIncludes(tsconfig, "lib/neighborhood-submarket/**/*.ts", "Worker build must include Neighborhood / Submarket contracts.");

assertIncludes(waveSource, "NEIGHBORHOOD_SUBMARKET_INTELLIGENCE_ARCHITECTURE", "Wave 2 must reuse certified architecture.");
assertIncludes(waveSource, "FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_IMPLEMENTATION_WAVE", "Wave 2 must preserve Wave 1 contract.");
assertIncludes(waveSource, "SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_IMPLEMENTATION_WAVE", "One authoritative Wave 2 contract must exist.");
assertIncludes(firstWaveSource, "FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_IMPLEMENTATION_WAVE", "Wave 1 contract must remain present.");
assertNotIncludes(waveSource, "export const COLORADO_GEOGRAPHIC_ONTOLOGY", "Wave 2 must not create a parallel CGO.");
assertNotIncludes(waveSource, "export const GEOGRAPHIC_OBJECT_FOUNDATION", "Wave 2 must not create a parallel GOF.");
assertNotIncludes(waveSource, "fetch(", "Wave 2 must remain network-free.");
assertNotIncludes(fixtureSource, "best neighborhood", "Fixtures must not contain prohibited neighborhood copy.");
assertNotIncludes(fixtureSource, "ideal for", "Fixtures must not contain prohibited suitability copy.");
assertNotIncludes(fixtureSource, "safest", "Fixtures must not contain prohibited safety copy.");
assertNotIncludes(fixtureSource, "right for you", "Fixtures must not contain prohibited suitability copy.");
assertNotIncludes(fixtureSource, "appreciation forecast", "Fixtures must not contain investment forecast output.");

assert.equal(SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CONTRACT.contract, SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_IMPLEMENTATION_WAVE);
assert.equal(SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CONTRACT.reusedArchitecture, NEIGHBORHOOD_SUBMARKET_INTELLIGENCE_ARCHITECTURE);
assert.equal(SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CONTRACT.preservedWave1Contract, FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_IMPLEMENTATION_WAVE);
assert.equal(SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CONTRACT.scope.internalReadiness, true);
assert.equal(SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CONTRACT.scope.expandedRepositorySupportedInventory, true);
assert.equal(SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CONTRACT.scope.routeEnhancementReadinessReview, true);
assert.equal(SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CONTRACT.scope.wave2DifferentiationRequired, true);
assert.equal(SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CONTRACT.scope.noNewPublicRoutes, true);
assert.equal(SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CONTRACT.scope.noSearchChanges, true);
assert.equal(SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CONTRACT.scope.noMapChanges, true);
assert.equal(SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CONTRACT.scope.noPublicMetadataChanges, true);
assert.equal(SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CONTRACT.scope.noPublicContentChanges, true);

assertIncludes(architectureSource, "NeighborhoodSubmarketObjectType", "Certified object-type contract must remain present.");
assertIncludes(architectureSource, "NeighborhoodSubmarketRelationshipType", "Certified relationship contract must remain present.");
assertIncludes(architectureSource, "NeighborhoodSubmarketRouteReadiness", "Certified route-readiness contract must remain present.");
assertIncludes(architectureSource, "NeighborhoodSubmarketSearchSupport", "Certified Search-support contract must remain present.");

for (const path of [
  "app/second-neighborhood-submarket-wave/page.tsx",
  "app/neighborhood-route-readiness/page.tsx",
  "app/api/second-neighborhood-submarket-wave/route.ts",
  "app/api/neighborhood-route-readiness/route.ts",
  "components/SecondGovernedNeighborhoodSubmarketWave.tsx",
  "lib/neighborhood-submarket/secondWaveApi.ts",
]) {
  assertFileMissing(path);
}

for (const publicSource of [routeSource, sitemapSource, neighborhoodsSource, searchPageSource]) {
  assertNotIncludes(publicSource, "SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_IMPLEMENTATION_WAVE", "Public sources must not import the internal Wave 2 contract.");
  assertNotIncludes(publicSource, "secondGovernedNeighborhoodSubmarketWave", "Public sources must not import Wave 2 internals.");
}

for (const candidate of SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CANDIDATES) {
  assert(candidate.canonicalObjectId !== candidate.slug, `${candidate.candidateId} identity must not rely on slug only.`);
  assert(candidate.canonicalName.length > 0, `${candidate.candidateId} must have a canonical name.`);
  assert(candidate.countyContext.length > 0, `${candidate.candidateId} must preserve county context.`);
  assert(candidate.wave2Differentiation.length > 0, `${candidate.candidateId} must document Wave 2 differentiation.`);
  assert(candidate.evidencePosture.requirements.includes("CANONICAL_IDENTITY_EVIDENCE"), `${candidate.candidateId} must require identity evidence.`);
  assert(candidate.evidencePosture.requirements.includes("SOURCE_RIGHTS_POSTURE"), `${candidate.candidateId} must require source-rights posture.`);
  assert(candidate.evidencePosture.requirements.includes("CONFLICT_STATUS"), `${candidate.candidateId} must preserve conflict posture.`);
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

  assert.equal(candidate.routeEnhancementReadiness.publicEnhancementAuthorized, false, `${candidate.candidateId} must not authorize public enhancement.`);
  assert.equal(candidate.routeEnhancementReadiness.fairHousingContentStandardRequired, true, `${candidate.candidateId} must require fair-housing content review.`);
  assert.equal(candidate.routeEnhancementReadiness.canonicalAndSitemapPreservationRequired, true, `${candidate.candidateId} must preserve canonical and sitemap posture.`);
  assert.equal(candidate.routeEnhancementReadiness.responsiveReviewRequired, true, `${candidate.candidateId} must require responsive review for future public work.`);
  assert.equal(candidate.routeEnhancementReadiness.deterministicValidationRequired, true, `${candidate.candidateId} must require deterministic validation.`);
  assert.equal(candidate.routeEnhancementReadiness.productionCertificationRequired, true, `${candidate.candidateId} must require production certification.`);

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
  assert.equal(candidate.prohibitedOutputs.priorityNeighborhood, null, `${candidate.candidateId} must not return priority neighborhood.`);
  assert.equal(candidate.prohibitedOutputs.publicActivationDecision, null, `${candidate.candidateId} must not return public activation decision.`);

  for (const rel of candidate.relationships) {
    assert.equal(rel.forcesExclusiveParent, false, `${rel.relationshipId} must not force an exclusive hierarchy.`);
  }

  if (candidate.existingPublicRoute && candidate.repositorySupport !== "PROTECTED_NON_ACTIVATION_GUARD") {
    assertExistingNeighborhoodRoute(candidate.existingPublicRoute);
  }
}

const inspection = inspectSecondGovernedNeighborhoodSubmarketWave();

assert.equal(inspection.contract, SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_IMPLEMENTATION_WAVE);
assert.equal(inspection.reusedArchitecture, NEIGHBORHOOD_SUBMARKET_INTELLIGENCE_ARCHITECTURE);
assert.equal(inspection.preservedWave1Contract, FIRST_GOVERNED_NEIGHBORHOOD_SUBMARKET_IMPLEMENTATION_WAVE);
assert.equal(inspection.candidateCount, 22, "Wave 2 must inspect twenty-two bounded candidates and guards.");
assert(inspection.includedCandidateCount >= 15, "Wave 2 must include a meaningful expanded candidate portfolio.");
assert(inspection.protectedGuardCount >= 6, "Wave 2 must preserve protected guards.");
assert(inspection.existingRoutePreservationCount >= 9, "Wave 2 must preserve additional existing routes.");
assert(inspection.routeEnhancementReadinessCount >= 4, "Route-enhancement readiness review must be represented.");
assert(inspection.internalReadinessCount >= 5, "Internal readiness must remain represented.");
assert(inspection.repositorySupportedCandidateCount >= 15, "Wave 2 must use repository-supported or certified architecture candidates.");
assert.equal(inspection.newRouteCandidateCount, 0, "Wave 2 must not create new route candidates.");
assert(inspection.relationshipCount >= 24, "Wave 2 must expand relationship coverage.");
assert(inspection.identityConflictCount >= 5, "Identity conflicts and ambiguities must remain visible.");
assert(inspection.authorityOrBoundaryConflictCount >= 5, "Authority and boundary conflicts must remain visible.");
assert(inspection.blockedCaseCount >= 8, "Blocked activation cases must remain visible.");
assert(inspection.sourceRightsFailClosedCaseCount >= 9, "Unknown, internal-only, restricted, and prohibited rights must fail closed.");
assert(inspection.searchMapSeparationCaseCount >= 8, "Search and map posture must remain independently represented.");
assert(inspection.futureCertificationCandidateCount >= 2, "Future certification candidates must be present without activation.");

for (const objectType of ["NEIGHBORHOOD", "SUBDIVISION", "DISTRICT", "CORRIDOR", "MARKET_AREA", "COMMUNITY", "UNINCORPORATED_COMMUNITY", "ZIP_CODE_AREA"] as const) {
  assert(inspection.objectTypesCovered.includes(objectType), `Object-type coverage must include ${objectType}.`);
}
for (const relationshipType of ["WITHIN", "PART_OF", "CONTAINS", "OVERLAPS", "ASSOCIATED_WITH", "HAS_MARKET_CONTEXT", "HAS_COUNTY_CONTEXT", "CROSSES", "SERVED_BY"] as const) {
  assert(inspection.relationshipTypesCovered.includes(relationshipType), `Relationship coverage must include ${relationshipType}.`);
}
for (const disposition of [
  "EXISTING_ROUTE_PRESERVED",
  "ROUTE_ENHANCEMENT_READINESS_REVIEW",
  "INTERNAL_READINESS_ONLY",
  "IDENTITY_RECONCILIATION_REQUIRED",
  "RELATIONSHIP_RECONCILIATION_REQUIRED",
  "AUTHORITY_REVIEW_REQUIRED",
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
for (const boundary of ["DESCRIPTIVE_AREA_ONLY", "APPROXIMATE_BOUNDARY", "OVERLAPPING_BOUNDARY", "DISPUTED_OR_CONFLICTING_BOUNDARY", "UNAVAILABLE", "UNRESOLVED", "PROHIBITED_FOR_PUBLIC_USE"] as const) {
  assert(inspection.boundaryPosturesCovered.includes(boundary), `Boundary posture coverage must include ${boundary}.`);
}
for (const rights of ["DERIVED_OR_SUMMARY_USE_ONLY", "INTERNAL_ANALYSIS_ONLY", "UNKNOWN_OR_UNRESOLVED", "RESTRICTED", "PROHIBITED"] as const) {
  assert(inspection.evidenceRightsCovered.includes(rights), `Rights posture coverage must include ${rights}.`);
}

assert.equal(inspection.wave2DifferentiationAssertions.differsFromWave1CandidateCount, true);
assert.equal(inspection.wave2DifferentiationAssertions.includesNewExistingRoutes, true);
assert.equal(inspection.wave2DifferentiationAssertions.includesRouteEnhancementReview, true);
assert.equal(inspection.wave2DifferentiationAssertions.includesExpandedRelationshipTypes, true);
assert.equal(inspection.wave2DifferentiationAssertions.includesIdentityAndAuthorityConflicts, true);
assert.equal(inspection.wave2DifferentiationAssertions.includesProtectedNiwotAndGunbarrelGuards, true);
assert.equal(inspection.niwotOutcome, "NON_ACTIVATED_BLOCKED", "Niwot must remain blocked.");
assert.equal(inspection.gunbarrelOutcome, "NON_ACTIVATED_BLOCKED", "Gunbarrel must remain blocked.");

assert.equal(inspection.activationAssertions.noNewPublicRoutes, true);
assert.equal(inspection.activationAssertions.noRouteEligibilityChange, true);
assert.equal(inspection.activationAssertions.noRegistryEligibilityChange, true);
assert.equal(inspection.activationAssertions.noSitemapChange, true);
assert.equal(inspection.activationAssertions.noCanonicalChange, true);
assert.equal(inspection.activationAssertions.noPublicMetadataChange, true);
assert.equal(inspection.activationAssertions.noPublicContentChange, true);
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
assert.equal(inspection.prohibitedOutputAssertions.priorityNeighborhood, false);
assert.equal(inspection.prohibitedOutputAssertions.publicActivationDecision, false);

assertIncludes(implementationDoc, "SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_IMPLEMENTATION_WAVE", "Implementation record must name the authoritative contract.");
assertIncludes(implementationDoc, "Wave 2 differentiation", "Implementation record must document differentiation from Wave 1.");
assertIncludes(implementationDoc, "no new public routes", "Implementation record must preserve public non-activation.");
assertIncludes(chatStart, "SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_READY_FOR_PUSH", "CHAT_START must record the local implementation status.");

console.log(
  JSON.stringify(
    {
      status: "SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_READY_FOR_PUSH",
      contract: inspection.contract,
      reusedArchitecture: inspection.reusedArchitecture,
      preservedWave1Contract: inspection.preservedWave1Contract,
      candidates: inspection.candidateCount,
      includedCandidates: inspection.includedCandidateCount,
      existingRoutePreservationCases: inspection.existingRoutePreservationCount,
      routeEnhancementReadinessCases: inspection.routeEnhancementReadinessCount,
      internalReadinessCases: inspection.internalReadinessCount,
      relationships: inspection.relationshipCount,
      identityConflicts: inspection.identityConflictCount,
      authorityOrBoundaryConflicts: inspection.authorityOrBoundaryConflictCount,
      rightsFailClosedCases: inspection.sourceRightsFailClosedCaseCount,
      searchMapSeparationCases: inspection.searchMapSeparationCaseCount,
      futureCertificationCandidates: inspection.futureCertificationCandidateCount,
      niwot: inspection.niwotOutcome,
      gunbarrel: inspection.gunbarrelOutcome,
      noNewPublicRoutes: inspection.activationAssertions.noNewPublicRoutes,
      noSearchChange: inspection.activationAssertions.noSearchChange,
      noMapChange: inspection.activationAssertions.noMapChange,
      prohibitedOutputAssertions: "passing",
    },
    null,
    2,
  ),
);
