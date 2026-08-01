import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

import { getColoradoDecisionGuideRegistry } from "../lib/coloradoDecisionGuideRegistry.js";
import { COLORADO_CITY_INTELLIGENCE_RECORDS, isEvidenceComplete, synthesizeCityGuideIntelligence } from "../lib/coloradoCityIntelligenceFactory.js";
import { getCrossCityComparisonIneligibleSlugs } from "../lib/crossCityComparison.js";
import { neighborhoods } from "../lib/neighborhoods.js";
import {
  NIWOT_GOVERNANCE_ONLY_RECONCILIATION,
  SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CANDIDATES,
} from "../lib/neighborhood-submarket/secondGovernedNeighborhoodSubmarketWaveFixtures.js";

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

const packageJson = JSON.parse(read("package.json")) as { scripts?: Record<string, string> };
const workerConfig = read("tsconfig.worker.json");
const fixtureSource = read("lib/neighborhood-submarket/secondGovernedNeighborhoodSubmarketWaveFixtures.ts");
const firstWaveFixtureSource = read("lib/neighborhood-submarket/firstGovernedNeighborhoodSubmarketWaveFixtures.ts");
const architectureFixtureSource = read("lib/neighborhood-submarket/neighborhoodSubmarketFixtures.ts");
const gmaDecisionSource = read("lib/gma/internalReviewDecisionFixture.ts");
const ldiRoadmap = read("docs/project-atlas/executive-library/LOCAL-DECISION-INTELLIGENCE-PHASE-2-WAVE-3-EXECUTIVE-ROADMAP.md");
const implementationRecord = read("docs/project-atlas/executive-library/REIE-NIWOT-GOVERNANCE-ONLY-RECONCILIATION-IMPLEMENTATION.md");
const chatStart = read("docs/CHAT_START.md");
const sitemapSource = read("app/sitemap.ts");
const searchSource = read("app/search/page.tsx");

assert.equal(
  packageJson.scripts?.["check:niwot-governance-reconciliation"],
  "npm run worker:build && node dist/scripts/checkNiwotGovernanceReconciliation.js",
  "package.json must expose the Niwot governance reconciliation check.",
);
assertIncludes(workerConfig, "scripts/checkNiwotGovernanceReconciliation.ts", "Worker build must include the Niwot reconciliation check.");

const niwot = SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CANDIDATES.find(
  (candidate) => candidate.candidateId === NIWOT_GOVERNANCE_ONLY_RECONCILIATION.authoritativeCandidateId,
);
assert(niwot, "One authoritative Niwot governance candidate must exist.");

assert.equal(niwot.canonicalObjectId, NIWOT_GOVERNANCE_ONLY_RECONCILIATION.canonicalObjectId);
assert.equal(niwot.objectType, NIWOT_GOVERNANCE_ONLY_RECONCILIATION.objectType);
assert.equal(niwot.canonicalName, NIWOT_GOVERNANCE_ONLY_RECONCILIATION.canonicalName);
assert.equal(niwot.slug, NIWOT_GOVERNANCE_ONLY_RECONCILIATION.internalSlug);
assert.deepEqual([...niwot.parentObjectIds], [...NIWOT_GOVERNANCE_ONLY_RECONCILIATION.parentObjectIds]);
assert.deepEqual([...niwot.contextualObjectIds].sort(), [...NIWOT_GOVERNANCE_ONLY_RECONCILIATION.contextualObjectIds].sort());
assert.equal(niwot.municipalityContext, null, "Niwot must not be assigned a municipal identity.");
assert.equal(niwot.countyContext, "Boulder County", "Niwot must preserve Boulder County context.");
assert.equal(niwot.existingPublicRoute, null, "Niwot must not have an existing public route.");
assert.equal(niwot.includedInWave, false, "Niwot must remain excluded from activated wave inventory.");
assert.equal(niwot.protectedGuard, true, "Niwot must remain a protected non-activation guard.");
assert.equal(niwot.routeReadiness, "BLOCKED");
assert.equal(niwot.registryReadiness, "PUBLIC_ACTIVATION_PROHIBITED");
assert.equal(niwot.searchSupport, "UNRESOLVED");
assert.equal(niwot.mapSupport, "BLOCKED");
assert.equal(niwot.sourceRightsPosture, "UNKNOWN_OR_UNRESOLVED");
assert.equal(niwot.maturityPosture, "UNRESOLVED");
assert.equal(niwot.certificationReadiness, "UNRESOLVED");
assert.equal(niwot.fairHousingPosture, "SAFE_CONTEXT_ONLY");
assert(niwot.dispositions.includes("PUBLIC_ACTIVATION_BLOCKED"), "Niwot must preserve public activation blocked disposition.");
assert(niwot.blockers.includes("AUTHORITY_UNRESOLVED"), "Niwot authority must remain unresolved.");
assert(niwot.blockers.includes("BOUNDARY_UNRESOLVED"), "Niwot boundary must remain unresolved.");
assert(niwot.blockers.includes("SOURCE_RIGHTS_UNRESOLVED"), "Niwot source rights must remain unresolved.");
assert(niwot.relationships.some((relationship) => relationship.toObjectId === "county:boulder" && relationship.relationshipType === "HAS_COUNTY_CONTEXT"));
assert(
  niwot.relationships.some(
    (relationship) => relationship.toObjectId === "market-area:boulder-longmont-context" && relationship.relationshipType === "HAS_MARKET_CONTEXT",
  ),
  "Niwot must preserve Boulder/Longmont as market context only.",
);

assert.equal(NIWOT_GOVERNANCE_ONLY_RECONCILIATION.publicActivationStatus, "NOT_ACTIVATED");
assert.equal(NIWOT_GOVERNANCE_ONLY_RECONCILIATION.routeEligibility, "BLOCKED");
assert.equal(NIWOT_GOVERNANCE_ONLY_RECONCILIATION.registryPublicEligibility, "PUBLIC_ACTIVATION_PROHIBITED");
assert.equal(NIWOT_GOVERNANCE_ONLY_RECONCILIATION.searchEligibility, "UNRESOLVED_AND_INACTIVE");
assert.equal(NIWOT_GOVERNANCE_ONLY_RECONCILIATION.mapGisEligibility, "BLOCKED_AND_INACTIVE");
assert.equal(NIWOT_GOVERNANCE_ONLY_RECONCILIATION.localDecisionIntelligenceEligibility, "PAUSED_AND_UNAUTHORIZED");
assert.equal(NIWOT_GOVERNANCE_ONLY_RECONCILIATION.evidenceMaturity, "UNRESOLVED_INSUFFICIENT_FOR_PUBLIC_ACTIVATION");
assert.equal(NIWOT_GOVERNANCE_ONLY_RECONCILIATION.sourceRightsPosture, "UNKNOWN_OR_UNRESOLVED");
for (const value of Object.values(NIWOT_GOVERNANCE_ONLY_RECONCILIATION.protectedBoundaries)) {
  assert.equal(value, false, "Niwot reconciliation protected-boundary flags must all remain false.");
}

const niwotCandidates = SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CANDIDATES.filter((candidate) => candidate.canonicalName === "Niwot");
assert.equal(niwotCandidates.length, 1, "Wave 2 must contain one authoritative Niwot governance candidate.");
assert.equal(
  neighborhoods.some((neighborhood) => neighborhood.slug === "niwot" || neighborhood.name === "Niwot"),
  false,
  "Niwot must not become a public neighborhood record.",
);

const registryEntry = getColoradoDecisionGuideRegistry().find((entry) => entry.canonicalName === "Niwot");
assert(registryEntry, "Legacy Niwot Decision Guide registry entry must remain present for fail-closed compatibility.");
assert.equal(registryEntry.publicEligibility, false, "Niwot registry entry must remain public-ineligible.");
assert(registryEntry.ineligibilityReasons.includes("missing-search-city-support"), "Niwot registry entry must remain fail-closed by Search support.");

const cityIntelligence = COLORADO_CITY_INTELLIGENCE_RECORDS.find((record) => record.cityKey === "niwot");
assert(cityIntelligence, "Niwot city-intelligence compatibility record must remain present.");
assert.equal(cityIntelligence.publicEligibility, false);
assert.equal(isEvidenceComplete(cityIntelligence), false, "Niwot evidence must remain incomplete for public activation.");
assert.equal(synthesizeCityGuideIntelligence(cityIntelligence).publishable, false, "Niwot city intelligence must remain non-publishable.");
assert(cityIntelligence.blockedReasons.some((reason) => reason.includes("Search-city support is absent")), "Niwot blocked reason must preserve Search support gap.");

assert(getCrossCityComparisonIneligibleSlugs().includes("niwot"), "Niwot must remain ineligible for public cross-city comparison.");

for (const path of [
  "app/market/niwot-co-housing-market/page.tsx",
  "app/market/niwot/page.tsx",
  "app/market/boulder/niwot/page.tsx",
  "app/niwot/page.tsx",
  "app/api/niwot/route.ts",
  "app/api/niwot-governance/route.ts",
  "app/api/local-decision-intelligence/niwot/route.ts",
]) {
  assertFileMissing(path);
}

assertNotIncludes(sitemapSource, "niwot", "Sitemap source must not add Niwot.");
assertNotIncludes(searchSource, "niwot", "Search source must not add Niwot behavior.");
assertIncludes(firstWaveFixtureSource, "protected-niwot-non-activation", "First wave Niwot guard must remain present.");
assertIncludes(architectureFixtureSource, "fixture-niwot-governance", "Architecture Niwot fixture must remain present.");
assertIncludes(gmaDecisionSource, "Niwot requires authoritative identity evidence", "GMA decision must preserve Niwot evidence requirement.");
assertIncludes(ldiRoadmap, "missing-search-city-support", "LDI roadmap must preserve Niwot Search-support blocker.");

for (const source of [fixtureSource, implementationRecord, chatStart]) {
  assertIncludes(source, "unincorporated-community:boulder-county:niwot", "Reconciliation records must preserve canonical internal identity.");
  assertIncludes(source, "UNINCORPORATED_COMMUNITY", "Reconciliation records must preserve object type.");
  assertIncludes(source, "Boulder County", "Reconciliation records must preserve Boulder County context.");
  assertIncludes(source, "Local Decision Intelligence Wave 4", "Reconciliation records must preserve LDI Wave 4 non-activation.");
}

assertIncludes(implementationRecord, "PUSH_NOT_AUTHORIZED", "Implementation record must state push remains unauthorized.");
assertIncludes(implementationRecord, "PRODUCTION_CERTIFICATION_NOT_AUTHORIZED", "Implementation record must state production certification remains unauthorized.");
assertIncludes(chatStart, "READY_FOR_NIWOT_GOVERNANCE_LOCAL_CERTIFICATION_AND_PUSH_REVIEW", "CHAT_START must record the next local certification gate.");

console.log(
  [
    "[niwot-governance-reconciliation] ok",
    "canonical=unincorporated-community:boulder-county:niwot",
    "objectType=UNINCORPORATED_COMMUNITY",
    "route=blocked",
    "registry=prohibited",
    "search=unresolved-inactive",
    "mapGis=blocked-inactive",
    "ldiWave4=paused-unauthorized",
    "gunbarrel=unchanged",
    "runtimeActivation=none",
  ].join(" "),
);
