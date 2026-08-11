import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

import { neighborhoods, type Neighborhood } from "../lib/neighborhoods.js";
import { buildTableMesaBoundaryScopeReadiness } from "../lib/neighborhood-submarket/tableMesaBoundaryScopeReadiness.js";

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

function getTableMesa() {
  const matches = neighborhoods.filter((item) => item.city === "Boulder" && item.slug === "table-mesa");
  assert.equal(matches.length, 1, "Table Mesa must remain a single existing Boulder neighborhood record.");

  const neighborhood = matches[0];
  assert.equal(neighborhood.name, "Table Mesa", "Table Mesa display identity must remain exact.");
  assert(neighborhood.routeEnhancement, "Table Mesa must carry the existing-route enhancement contract.");

  return neighborhood as Neighborhood & { routeEnhancement: NonNullable<Neighborhood["routeEnhancement"]> };
}

function publicCopyFor(neighborhood: Neighborhood & { routeEnhancement: NonNullable<Neighborhood["routeEnhancement"]> }) {
  return [
    neighborhood.lifestyleVibe,
    neighborhood.constructionDNA,
    neighborhood.tacticalLever,
    neighborhood.routeEnhancement.parentContext,
    neighborhood.routeEnhancement.scopeClarification,
    neighborhood.routeEnhancement.decisionSnapshot,
    neighborhood.routeEnhancement.localCharacter,
    neighborhood.routeEnhancement.geographicBoundaries,
    neighborhood.routeEnhancement.housingAndPropertyContext,
    neighborhood.routeEnhancement.marketAndDecisionDrivers.join(" "),
    neighborhood.routeEnhancement.buyerPrompts.join(" "),
    neighborhood.routeEnhancement.sellerPrompts.join(" "),
    neighborhood.routeEnhancement.dueDiligencePrompts.join(" "),
    neighborhood.routeEnhancement.evidenceTransparency.join(" "),
    neighborhood.routeEnhancement.evidenceContract?.map((item) => `${item.stage} ${item.treatment}`).join(" ") || "",
    neighborhood.routeEnhancement.unavailableEvidence?.join(" ") || "",
    neighborhood.routeEnhancement.sourceRightsBoundary,
    neighborhood.routeEnhancement.protectedBoundary,
  ].join("\n");
}

const readiness = buildTableMesaBoundaryScopeReadiness();
const tableMesa = getTableMesa();
const enhancement = tableMesa.routeEnhancement;
const publicCopy = publicCopyFor(tableMesa);

const routeSource = read("app/market/[city]/[slug]/page.tsx");
const neighborhoodsSource = read("lib/neighborhoods.ts");
const searchSource = read("app/search/page.tsx");
const mapSource = read("components/maps/SearchMap.tsx");
const sitemapSource = read("app/sitemap.ts");
const schemaSource = read("lib/schema/neighborhoodSchema.ts");
const packageJson = JSON.parse(read("package.json")) as { scripts?: Record<string, string> };
const tsconfig = read("tsconfig.worker.json");

assert.equal(readiness.route, "/market/boulder/table-mesa", "Readiness foundation must target the existing Table Mesa route.");
assert.equal(readiness.canonicalObjectId, "neighborhood:boulder:table-mesa", "Readiness foundation must preserve Table Mesa canonical object.");
assert.equal(readiness.objectType, "NEIGHBORHOOD", "Readiness foundation must preserve NEIGHBORHOOD object type.");
assert.equal(readiness.alias, "Table Mesa area", "Readiness foundation must preserve Table Mesa area alias.");
assert.equal(readiness.parentObjectId, "city:boulder", "Readiness foundation must preserve Boulder parent.");
assert(readiness.contextualObjectIds.includes("county:boulder"), "Readiness foundation must preserve Boulder County context.");
assert(readiness.contextualObjectIds.includes("market-area:south-boulder-context"), "Readiness foundation must preserve South Boulder context.");
assert.equal(readiness.authorityPosture, "LOCALLY_RECOGNIZED_NON_AUTHORITATIVE", "Readiness foundation must remain locally recognized and non-authoritative.");
assert.equal(readiness.boundaryScope.posture, "APPROXIMATE_BOUNDARY", "Readiness foundation must remain approximate boundary.");
assert.equal(readiness.boundaryScope.ambiguity, "BOUNDARY_AMBIGUITY", "Readiness foundation must preserve boundary ambiguity.");
assert.equal(readiness.boundaryScope.southBoulderAssociation, "CONTEXTUAL_ASSOCIATION_ONLY", "South Boulder relationship must remain contextual only.");
assert.equal(readiness.boundaryScope.doesNotClaimIdenticalBoundaries, true, "South Boulder relationship must not imply identical boundaries.");
assert.equal(readiness.boundaryScope.doesNotClaimExclusiveContainment, true, "South Boulder relationship must not imply exclusive containment.");
assert.equal(readiness.searchBoundary.discoveryPathOnly, true, "Readiness foundation must keep Search discovery-only.");
assert.equal(readiness.searchBoundary.certifiesCompleteInventory, false, "Search must not certify complete inventory.");
assert.equal(readiness.searchBoundary.certifiesExactBoundaryFilteredListings, false, "Search must not certify exact boundary-filtered listings.");
assert.equal(readiness.searchBoundary.certifiesGeographicExhaustiveness, false, "Search must not certify geographic exhaustiveness.");
assert.equal(readiness.searchBoundary.changesSearchEligibility, false, "Search eligibility must remain unchanged.");
assert.equal(readiness.mapBoundary.polygonCreated, false, "No Table Mesa polygon may be created.");
assert.equal(readiness.mapBoundary.gisAcquisition, false, "No GIS acquisition may be introduced.");
assert.equal(readiness.conflictBehavior.conflictingBoundaryEvidence, "FAIL_CLOSED", "Conflicting Table Mesa evidence must fail closed.");
assert.equal(readiness.conflictBehavior.unavailableBoundaryEvidence, "FAIL_CLOSED", "Unavailable Table Mesa evidence must fail closed.");
assert.equal(readiness.conflictBehavior.staleBoundaryEvidence, "FAIL_CLOSED", "Stale Table Mesa evidence must fail closed.");
assert.equal(readiness.conflictBehavior.unsupportedPublicGeometry, "FAIL_CLOSED", "Unsupported public geometry must fail closed.");
assert.equal(readiness.conflictBehavior.substituteInferenceAllowed, false, "Substitute inference must remain disallowed.");
assert.equal(readiness.protectedClaims.ranking, false, "Ranking claims must remain disallowed.");
assert.equal(readiness.protectedClaims.suitability, false, "Suitability claims must remain disallowed.");
assert.equal(readiness.protectedClaims.desirability, false, "Desirability claims must remain disallowed.");
assert.equal(readiness.protectedClaims.schoolQualityJudgment, false, "School quality claims must remain disallowed.");
assert.equal(readiness.protectedClaims.safetyJudgment, false, "Safety claims must remain disallowed.");

assert.equal(enhancement.contract, "EXISTING_NEIGHBORHOOD_ROUTE_ENHANCEMENT", "Table Mesa must reuse the existing route-enhancement contract.");
assert.equal(enhancement.objectType, readiness.objectType, "Table Mesa public object type must match readiness.");
assert.equal(enhancement.canonicalIdentity, readiness.canonicalObjectId, "Table Mesa public identity must match readiness.");
assert(enhancement.aliases?.includes(readiness.alias), "Table Mesa public alias must match readiness.");
assert.equal(enhancement.boundaryPosture, readiness.boundaryScope.posture, "Table Mesa public boundary posture must match readiness.");
assert.equal(enhancement.canonicalPath, readiness.route, "Table Mesa public canonical path must match readiness.");
assert.equal(enhancement.canonicalUrl, "https://davidquinngroup.com/market/boulder/table-mesa", "Table Mesa public canonical URL must remain exact.");
assert.equal(enhancement.evidenceContract?.length, 7, "Table Mesa must expose the seven-step public evidence contract.");
assert.equal(
  enhancement.evidenceContract?.map((item) => item.stage).join(" -> "),
  "SOURCE -> GEOGRAPHY / OBJECT TYPE -> PERIOD / FRESHNESS -> LIMITATION -> CLAIM ELIGIBILITY -> VISIBLE ANSWER -> STRUCTURED DATA",
  "Table Mesa must preserve SOURCE to STRUCTURED DATA sequence.",
);
assert.equal(enhancement.unavailableEvidence?.length, 3, "Table Mesa unavailable evidence must render as fail-closed prompts.");

for (const requiredCopy of [
  "locally recognized Boulder neighborhood context",
  "not exact legal or administrative geography",
  "not presented as an exact legal, HOA, school, parcel, or property boundary",
  "Table Mesa is associated with the broader South Boulder context for market and place orientation",
  "does not mean the two areas have identical boundaries, identities, or evidence",
  "Use Search This Area as a discovery path only, not as proof of complete inventory, exact boundary-filtered listings, or geographic exhaustiveness",
  "address-specific records, listing facts, condition, permits, HOA or association materials where applicable, title, insurance, financing, and inspection questions",
  "If Table Mesa source context is unavailable, stale, conflicting, or unsupported for a specific address question",
  "No public GIS polygon or exact boundary geometry is active for Table Mesa",
  "The route does not activate county Assessor, parcel, provider, MLS, Typesense, CRM, email, alert, telemetry, or customer-data systems",
  "School attendance, HOA coverage, insurance terms, permits, title, condition, records, and financing facts remain address-specific verification items",
]) {
  assertIncludes(publicCopy, requiredCopy, `Table Mesa public copy must include required limitation: ${requiredCopy}`);
}

for (const link of [
  "/market/boulder-co-housing-market",
  "/market/boulder/south-boulder",
  "/search?city=Boulder&q=Table%20Mesa",
  "/buy",
  "/buy#financing-readiness",
  "/sell",
  "/home-worth#seller-readiness",
  "/grand-plan",
  "/sources",
  "/contact#advisory-readiness",
]) {
  assert(
    enhancement.journeyLinks.some((journeyLink) => journeyLink.href === link),
    `Table Mesa journey continuity must include ${link}.`,
  );
}

assert(
  enhancement.journeyLinks.some(
    (journeyLink) =>
      journeyLink.href === "/search?city=Boulder&q=Table%20Mesa" &&
      journeyLink.label === "Search This Area" &&
      journeyLink.note.includes("Discovery path only"),
  ),
  "Table Mesa search link must be explicitly discovery-only.",
);
assert(
  enhancement.journeyLinks.some((journeyLink) => journeyLink.label === "Property Verification"),
  "Table Mesa must include a property verification path through Search.",
);

for (const forbiddenCopy of [
  "Table Mesa is part of South Boulder",
  "best neighborhood",
  "neighborhood ranking",
  "desirability",
  "suitability",
  "safety rating",
  "crime rate",
  "school ranking",
  "school rating",
  "school quality",
  "protected-class proxy",
  "family-status",
  "investment ranking",
  "investment recommendation",
  "appreciation prediction",
  "property-quality conclusion",
  "automated recommendation",
]) {
  assertNotIncludes(publicCopy, forbiddenCopy, `Table Mesa public copy must not include prohibited claim: ${forbiddenCopy}`);
}

assertIncludes(routeSource, "data-testid=\"neighborhood-route-enhancement\"", "Existing route must render the enhancement section.");
assertIncludes(routeSource, "data-neighborhood-route-enhancement-canonical-identity={routeEnhancement.canonicalIdentity || ''}", "Route must keep route-driven canonical identity marker.");
assertIncludes(routeSource, "data-neighborhood-route-enhancement-boundary-posture={routeEnhancement.boundaryPosture || ''}", "Route must keep route-driven boundary posture marker.");
assertIncludes(routeSource, "data-neighborhood-route-enhancement-search-preserved=\"true\"", "Route must preserve Search behavior marker.");
assertIncludes(routeSource, "data-neighborhood-route-enhancement-map-preserved=\"true\"", "Route must preserve map behavior marker.");
assertIncludes(routeSource, "data-neighborhood-route-enhancement-public-gis-active=\"false\"", "Route must keep public GIS inactive marker.");
assertIncludes(routeSource, "data-neighborhood-route-enhancement-schema-visible-alignment=\"true\"", "Route must keep schema-visible alignment marker.");
assertNotIncludes(routeSource, "tableMesaBoundaryScopeReadiness", "Public route must not import the internal readiness foundation.");
assertNotIncludes(searchSource, "tableMesaBoundaryScopeReadiness", "Search must not import the internal readiness foundation.");
assertNotIncludes(mapSource, "tableMesaBoundaryScopeReadiness", "Map must not import the internal readiness foundation.");
assertNotIncludes(searchSource, "table-mesa", "Search source must not add Table Mesa-specific behavior.");
assertNotIncludes(mapSource, "table-mesa", "Map source must not add Table Mesa-specific behavior.");
assertNotIncludes(mapSource, "APPROXIMATE_BOUNDARY", "Map source must not activate Table Mesa boundary posture.");
assertNotIncludes(sitemapSource, "table-mesa", "Sitemap must not add a Table Mesa-specific entry.");
assertNotIncludes(schemaSource, "APPROXIMATE_BOUNDARY", "Neighborhood schema helper must not publish the internal Table Mesa boundary posture.");

for (const path of [
  "app/market/boulder/table-mesa/page.tsx",
  "app/table-mesa/page.tsx",
  "app/neighborhood/table-mesa/page.tsx",
  "app/api/table-mesa/route.ts",
  "app/api/table-mesa-neighborhood-route-enhancement/route.ts",
]) {
  assertFileMissing(path);
}

assert.equal(
  packageJson.scripts?.["check:table-mesa-neighborhood-route-enhancement"],
  "npm run worker:build && node dist/scripts/checkTableMesaNeighborhoodRouteEnhancement.js",
  "package.json must register the Table Mesa customer-route check.",
);
assertIncludes(tsconfig, "scripts/checkTableMesaNeighborhoodRouteEnhancement.ts", "Worker build must include the Table Mesa customer-route check.");

console.log(
  [
    "[table-mesa-neighborhood-route-enhancement] ok",
    "route=/market/boulder/table-mesa",
    "identity=neighborhood:boulder:table-mesa",
    "objectType=NEIGHBORHOOD",
    "parent=Boulder",
    "context=BoulderCounty,SouthBoulder",
    "boundary=APPROXIMATE_BOUNDARY",
    "search=discovery-only",
    "publicGis=false",
    "countySourceDependency=false",
    "schema=visible-claims-only",
    "continuity=market-search-property-grand-plan-sources-handoff",
    "protectedSystems=none",
  ].join(" "),
);
