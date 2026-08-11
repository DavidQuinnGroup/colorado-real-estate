import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

import {
  buildTableMesaBoundaryScopeReadiness,
  TABLE_MESA_BOUNDARY_SCOPE_READINESS_CONTRACT,
  TABLE_MESA_BOUNDARY_SCOPE_READINESS_STATUS,
} from "../lib/neighborhood-submarket/tableMesaBoundaryScopeReadiness.js";
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

const readiness = buildTableMesaBoundaryScopeReadiness();
const candidate = SECOND_GOVERNED_NEIGHBORHOOD_SUBMARKET_WAVE_CANDIDATES.find(
  (item) => item.canonicalObjectId === "neighborhood:boulder:table-mesa",
);

assert(candidate, "Table Mesa must remain represented in the governed Wave 2 candidate set.");
assert.equal(readiness.contract, TABLE_MESA_BOUNDARY_SCOPE_READINESS_CONTRACT);
assert.equal(readiness.status, TABLE_MESA_BOUNDARY_SCOPE_READINESS_STATUS);
assert.equal(readiness.route, "/market/boulder/table-mesa");
assert.equal(readiness.canonicalObjectId, "neighborhood:boulder:table-mesa");
assert.equal(readiness.canonicalName, "Table Mesa");
assert.equal(readiness.objectType, "NEIGHBORHOOD");
assert.equal(readiness.alias, "Table Mesa area");
assert.equal(readiness.parentObjectId, "city:boulder");
assert.deepEqual(readiness.contextualObjectIds, ["county:boulder", "market-area:south-boulder-context"]);
assert.equal(readiness.authorityPosture, "LOCALLY_RECOGNIZED_NON_AUTHORITATIVE");
assert.equal(readiness.boundaryScope.posture, "APPROXIMATE_BOUNDARY");
assert.equal(readiness.boundaryScope.ambiguity, "BOUNDARY_AMBIGUITY");
assert.equal(readiness.boundaryScope.publicSemantics, "APPROXIMATE_DESCRIPTIVE_NEIGHBORHOOD_AREA_FOR_ORIENTATION");
assert.equal(readiness.boundaryScope.southBoulderAssociation, "CONTEXTUAL_ASSOCIATION_ONLY");
assert.equal(readiness.boundaryScope.doesNotClaimIdenticalBoundaries, true);
assert.equal(readiness.boundaryScope.doesNotClaimExclusiveContainment, true);
assert.equal(readiness.boundaryScope.doesNotClaimExactParentageBeyondGovernedEvidence, true);

for (const forbiddenClassification of ["SUBDIVISION", "HOA", "MUNICIPALITY", "PARCEL", "LEGAL_JURISDICTION"] as const) {
  assert(readiness.boundaryScope.mustNotReclassifyAs.includes(forbiddenClassification), `Missing forbidden classification ${forbiddenClassification}.`);
}

for (const forbiddenMeaning of [
  "LEGAL_BOUNDARY",
  "HOA_BOUNDARY",
  "SCHOOL_ATTENDANCE_BOUNDARY",
  "SAFETY_BOUNDARY",
  "HAZARD_BOUNDARY",
  "INSURANCE_BOUNDARY",
  "PROPERTY_BOUNDARY",
  "PARCEL_BOUNDARY",
] as const) {
  assert(readiness.boundaryScope.forbiddenMeanings.includes(forbiddenMeaning), `Missing forbidden boundary meaning ${forbiddenMeaning}.`);
}

assert.equal(readiness.evidenceRequirements.length, 6, "Table Mesa readiness must identify six evidence/provenance requirements.");
for (const label of [
  "Table Mesa name",
  "Table Mesa area alias",
  "Boulder relationship",
  "South Boulder contextual association",
  "permitted place and housing context",
  "verification freshness",
] as const) {
  assert(readiness.evidenceRequirements.some((item) => item.label === label), `Missing evidence requirement: ${label}.`);
}
assert(readiness.evidenceRequirements.some((item) => item.publicUse === "FAIL_CLOSED"), "At least one evidence requirement must fail closed.");
assert(readiness.evidenceRequirements.every((item) => item.sourcePosture === "DERIVED_OR_SUMMARY_USE_ONLY"), "Table Mesa readiness must not activate a new source posture.");

assert.equal(readiness.conflictBehavior.conflictingBoundaryEvidence, "FAIL_CLOSED");
assert.equal(readiness.conflictBehavior.unavailableBoundaryEvidence, "FAIL_CLOSED");
assert.equal(readiness.conflictBehavior.staleBoundaryEvidence, "FAIL_CLOSED");
assert.equal(readiness.conflictBehavior.unsupportedPublicGeometry, "FAIL_CLOSED");
assert.equal(readiness.conflictBehavior.substituteInferenceAllowed, false);

assert.equal(readiness.searchBoundary.existingSearchNavigationOnly, true);
assert.equal(readiness.searchBoundary.discoveryPathOnly, true);
assert.equal(readiness.searchBoundary.certifiesCompleteInventory, false);
assert.equal(readiness.searchBoundary.certifiesExactBoundaryFilteredListings, false);
assert.equal(readiness.searchBoundary.certifiesGeographicExhaustiveness, false);
assert.equal(readiness.searchBoundary.changesSearchEligibility, false);

assert.equal(readiness.mapBoundary.polygonCreated, false);
assert.equal(readiness.mapBoundary.markerLayerCreated, false);
assert.equal(readiness.mapBoundary.gisAcquisition, false);
assert.equal(readiness.mapBoundary.externalGeometry, false);
assert.equal(readiness.mapBoundary.mapEligibilityChanged, false);
assert.equal(readiness.publicRouteEnhancementAuthorized, false);

for (const [claim, value] of Object.entries(readiness.protectedClaims)) {
  assert.equal(value, false, `Protected claim ${claim} must remain false.`);
}

assert.equal(candidate.objectType, "NEIGHBORHOOD");
assert(candidate.aliases.includes("Table Mesa area"), "Wave 2 candidate must preserve Table Mesa area alias.");
assert.equal(candidate.boundaryPosture, "APPROXIMATE_BOUNDARY");
assert.equal(candidate.ambiguityPosture, "BOUNDARY_AMBIGUITY");
assert.equal(candidate.mapSupport, "APPROXIMATE_ONLY");
assert.equal(candidate.searchSupport, "NEIGHBORHOOD_FILTER_COMPATIBLE");
assert(candidate.dispositions.includes("BOUNDARY_UNRESOLVED"), "Wave 2 candidate must preserve boundary-unresolved disposition.");
assert(candidate.blockers.includes("BOUNDARY_UNRESOLVED"), "Wave 2 candidate must preserve boundary blocker.");
assert(candidate.relationships.some((relationship) => relationship.relationshipType === "ASSOCIATED_WITH" && relationship.preservesOverlap), "South Boulder relationship must preserve overlap without equivalence.");

const packageJson = JSON.parse(read("package.json")) as { scripts?: Record<string, string> };
const tsconfig = read("tsconfig.worker.json");
const publicRouteSource = read("app/market/[city]/[slug]/page.tsx");
const neighborhoodsSource = read("lib/neighborhoods.ts");
const searchSource = read("app/search/page.tsx");
const mapSource = read("components/maps/SearchMap.tsx");
const sitemapSource = read("app/sitemap.ts");

assert.equal(
  packageJson.scripts?.["check:table-mesa-boundary-scope-readiness"],
  "npm run worker:build && node dist/scripts/checkTableMesaBoundaryScopeReadiness.js",
  "package.json must expose the Table Mesa boundary-scope readiness check.",
);
assertIncludes(tsconfig, "scripts/checkTableMesaBoundaryScopeReadiness.ts", "Worker build must include the Table Mesa readiness check.");
assertIncludes(tsconfig, "lib/neighborhood-submarket/**/*.ts", "Worker build must include internal neighborhood/submarket contracts.");

for (const path of [
  "app/market/boulder/table-mesa/page.tsx",
  "app/table-mesa/page.tsx",
  "app/neighborhood/table-mesa/page.tsx",
  "app/api/table-mesa/route.ts",
  "app/api/table-mesa-boundary-scope/route.ts",
  "components/TableMesaBoundaryScopeReadiness.tsx",
]) {
  assertFileMissing(path);
}

for (const publicSource of [publicRouteSource, neighborhoodsSource, searchSource, mapSource, sitemapSource]) {
  assertNotIncludes(publicSource, TABLE_MESA_BOUNDARY_SCOPE_READINESS_CONTRACT, "Internal Table Mesa readiness contract must not be imported by public surfaces.");
  assertNotIncludes(publicSource, "tableMesaBoundaryScopeReadiness", "Public surfaces must not import the internal Table Mesa readiness module.");
}

assertNotIncludes(searchSource, "TABLE_MESA_BOUNDARY_SCOPE", "Search must not receive Table Mesa boundary-scope behavior.");
assertNotIncludes(mapSource, "TABLE_MESA_BOUNDARY_SCOPE", "Map must not receive Table Mesa boundary-scope behavior.");
assertNotIncludes(sitemapSource, "table-mesa-boundary", "Sitemap must not add Table Mesa readiness routes.");

console.log(
  [
    "[table-mesa-boundary-scope-readiness] ok",
    "canonical=neighborhood:boulder:table-mesa",
    "objectType=NEIGHBORHOOD",
    "alias=Table Mesa area",
    "boundary=APPROXIMATE_BOUNDARY",
    "ambiguity=BOUNDARY_AMBIGUITY",
    "southBoulderAssociation=context-only",
    "search=discovery-only",
    "map=no-new-geometry",
    "publicEnhancement=false",
    "failClosed=true",
  ].join(" "),
);
