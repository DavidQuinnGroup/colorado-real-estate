import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

import { neighborhoods } from "../lib/neighborhoods.js";

const CONTRACT = "SOUTH_BOULDER_EXISTING_NEIGHBORHOOD_ROUTE_ENHANCEMENT";
const ROUTE = "/market/boulder/south-boulder";
const CANONICAL_URL = "https://davidquinngroup.com/market/boulder/south-boulder";

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

const routeSource = read("app/market/[city]/[slug]/page.tsx");
const neighborhoodsSource = read("lib/neighborhoods.ts");
const sitemapSource = read("app/sitemap.ts");
const searchSource = read("app/search/page.tsx");
const mapSource = read("components/maps/SearchMap.tsx");
const packageJson = JSON.parse(read("package.json")) as { scripts?: Record<string, string> };
const tsconfig = read("tsconfig.worker.json");

const southBoulder = neighborhoods.find((neighborhood) => neighborhood.city === "Boulder" && neighborhood.slug === "south-boulder");
assert(southBoulder, "South Boulder must remain an existing repository neighborhood record.");
assert.equal(southBoulder.name, "South Boulder", "South Boulder display identity must be preserved.");
assert.equal(southBoulder.routeEnhancement?.contract, CONTRACT, "South Boulder must carry the authoritative route-enhancement contract.");
assert.equal(southBoulder.routeEnhancement.objectType, "NEIGHBORHOOD", "South Boulder object type must remain NEIGHBORHOOD.");
assert.equal(southBoulder.routeEnhancement.canonicalPath, ROUTE, "South Boulder route path must remain exact.");
assert.equal(southBoulder.routeEnhancement.canonicalUrl, CANONICAL_URL, "South Boulder canonical URL must be preserved.");

const southBoulderRecords = neighborhoods.filter((neighborhood) => neighborhood.city === "Boulder" && neighborhood.slug === "south-boulder");
assert.equal(southBoulderRecords.length, 1, "The enhancement must not create a duplicate South Boulder route record.");

const enhancedRecords = neighborhoods.filter((neighborhood) => neighborhood.routeEnhancement);
assert.equal(enhancedRecords.length, 1, "Only one route may receive the bounded enhancement in this implementation.");
assert.equal(enhancedRecords[0]?.slug, "south-boulder", "The bounded enhancement must apply only to South Boulder.");

assert.equal(
  packageJson.scripts?.["check:south-boulder-neighborhood-route-enhancement"],
  "npm run worker:build && node dist/scripts/checkSouthBoulderNeighborhoodRouteEnhancement.js",
  "package.json must expose the South Boulder route-enhancement check.",
);
assertIncludes(tsconfig, "scripts/checkSouthBoulderNeighborhoodRouteEnhancement.ts", "Worker build must include the South Boulder enhancement check.");

assertIncludes(routeSource, "data-testid=\"south-boulder-route-enhancement\"", "South Boulder public enhancement section must render through the existing neighborhood route.");
assertIncludes(routeSource, "data-south-boulder-route-enhancement-contract={routeEnhancement.contract}", "Route enhancement contract marker must remain present.");
assertIncludes(routeSource, "data-south-boulder-route-enhancement-route={routeEnhancement.canonicalPath}", "Route enhancement route marker must remain present.");
assertIncludes(routeSource, "data-south-boulder-route-enhancement-canonical={routeEnhancement.canonicalUrl}", "Route enhancement canonical marker must remain present.");
assertIncludes(routeSource, "data-south-boulder-route-enhancement-search-preserved=\"true\"", "Search-preservation marker must remain present.");
assertIncludes(routeSource, "data-south-boulder-route-enhancement-map-preserved=\"true\"", "Map-preservation marker must remain present.");
assertIncludes(routeSource, "data-south-boulder-route-enhancement-sitemap-preserved=\"true\"", "Sitemap-preservation marker must remain present.");
assertIncludes(routeSource, "data-south-boulder-route-enhancement-public-copy-only=\"true\"", "Evidence transparency must remain public-copy-only.");
assertIncludes(routeSource, "data-south-boulder-route-enhancement-no-internal-metadata=\"true\"", "Internal evidence metadata must remain unexposed.");
assertIncludes(routeSource, "Neighborhood Decision Snapshot", "Decision snapshot section must be present.");
assertIncludes(routeSource, "Local Character", "Local character section must be present.");
assertIncludes(routeSource, "Geographic And Context Boundaries", "Geographic scope section must be present.");
assertIncludes(routeSource, "Housing And Property Context", "Housing and property context section must be present.");
assertIncludes(routeSource, "Market And Decision Drivers", "Market and decision drivers section must be present.");
assertIncludes(routeSource, "Buyer Considerations", "Buyer guidance section must be present.");
assertIncludes(routeSource, "Seller Considerations", "Seller guidance section must be present.");
assertIncludes(routeSource, "Due-Diligence And Verification Prompts", "Due-diligence section must be present.");
assertIncludes(routeSource, "Evidence And Limitation Transparency", "Evidence limitation section must be present.");
assertIncludes(routeSource, "Journey Continuity", "Journey continuity section must be present.");

assertIncludes(neighborhoodsSource, "South Boulder is presented as neighborhood-level orientation within Boulder", "South Boulder must clarify neighborhood-level scope.");
assertIncludes(neighborhoodsSource, "not a legal boundary", "South Boulder must avoid authoritative boundary claims.");
assertIncludes(neighborhoodsSource, "does not expose internal Evidence Depth metadata", "South Boulder must not expose internal Evidence Depth metadata.");
assertIncludes(neighborhoodsSource, "does not determine condition, title, permits, value, insurance, financing, or suitability", "Property-specific limitations must be explicit.");
assertIncludes(neighborhoodsSource, "does not establish property condition, value, title, ownership, insurability, permits, HOA status, school assignment, financing eligibility, or suitability", "Evidence transparency must preserve property-specific boundaries.");
assertIncludes(neighborhoodsSource, "/search?neighborhood=South%20Boulder", "South Boulder must use the existing encoded Search destination.");
assertIncludes(neighborhoodsSource, "/buy#financing-readiness", "Financing Readiness journey link must be present.");
assertIncludes(neighborhoodsSource, "/home-worth#seller-readiness", "Seller Readiness journey link must be present.");
assertIncludes(neighborhoodsSource, "/contact#advisory-readiness", "Advisory Readiness journey link must be present.");

for (const path of [
  "app/market/boulder/south-boulder/page.tsx",
  "app/south-boulder/page.tsx",
  "app/neighborhood/south-boulder/page.tsx",
  "app/api/south-boulder/route.ts",
  "app/api/neighborhood-route-enhancement/route.ts",
  "app/api/south-boulder-neighborhood-route-enhancement/route.ts",
]) {
  assertFileMissing(path);
}

assertNotIncludes(sitemapSource, "south-boulder", "Sitemap behavior must not add a South Boulder-specific entry in this implementation.");
assertNotIncludes(sitemapSource, "neighborhoods", "Sitemap generation must not be expanded to public neighborhood inventory.");
assertNotIncludes(searchSource, CONTRACT, "Search must not import or activate the South Boulder route-enhancement contract.");
assertNotIncludes(searchSource, "south-boulder", "Search source must not add South Boulder-specific behavior.");
assertNotIncludes(mapSource, CONTRACT, "Map source must not import or activate the South Boulder route-enhancement contract.");
assertNotIncludes(mapSource, "south-boulder", "Map source must not add South Boulder-specific behavior.");

const publicCopy = [
  southBoulder.routeEnhancement.scopeClarification,
  southBoulder.routeEnhancement.decisionSnapshot,
  southBoulder.routeEnhancement.localCharacter,
  southBoulder.routeEnhancement.geographicBoundaries,
  southBoulder.routeEnhancement.housingAndPropertyContext,
  southBoulder.routeEnhancement.marketAndDecisionDrivers.join(" "),
  southBoulder.routeEnhancement.buyerPrompts.join(" "),
  southBoulder.routeEnhancement.sellerPrompts.join(" "),
  southBoulder.routeEnhancement.dueDiligencePrompts.join(" "),
  southBoulder.routeEnhancement.evidenceTransparency.join(" "),
  southBoulder.routeEnhancement.protectedBoundary,
].join("\n");

const prohibitedPatterns = [
  /\bbest neighborhood\b/i,
  /\bideal for\b/i,
  /\bperfect for\b/i,
  /\bsafest\b/i,
  /\bschool ranking\b/i,
  /\bschool rating\b/i,
  /\bsafety rating\b/i,
  /\bcrime score\b/i,
  /\bcrime rate\b/i,
  /\bdemographic targeting\b/i,
  /\bprotected-class proxy\b/i,
  /\bappreciation forecast\b/i,
  /\binvestment recommendation\b/i,
  /\bpricing recommendation\b/i,
  /\bestimated value\b/i,
  /\bseller score\b/i,
  /\blead score\b/i,
  /\bconfidence percentage\b/i,
  /\bneighborhood ranking\b/i,
  /\bcondition score\b/i,
  /\bcondition grade\b/i,
  /\brepair estimate\b/i,
  /\bautomated valuation\b/i,
];

for (const pattern of prohibitedPatterns) {
  assert(!pattern.test(publicCopy), `South Boulder enhancement must avoid prohibited public claim: ${pattern}`);
}

for (const forbiddenInternalTerm of [
  "source ID",
  "provider ID",
  "version ID",
  "rights enum",
  "support level",
  "freshness code",
  "conflict code",
  "provenance chain",
  "eligibility outcome",
  "fixture content",
  "internal posture summary",
]) {
  assertNotIncludes(publicCopy, forbiddenInternalTerm, `South Boulder public copy must not expose internal evidence metadata: ${forbiddenInternalTerm}`);
}

assertIncludes(
  southBoulder.routeEnhancement.protectedBoundary,
  "No new route, alias, redirect, registry entry, sitemap entry, Search behavior, map layer, GIS boundary",
  "Protected boundary must explicitly preserve route, Search, map, and GIS behavior.",
);
assertIncludes(
  southBoulder.routeEnhancement.protectedBoundary,
  "Niwot activation, Gunbarrel activation, or Local Decision Intelligence Wave 4 activation",
  "Protected boundary must explicitly preserve Niwot, Gunbarrel, and LDI Wave 4 non-activation.",
);
assertIncludes(routeSource, "data-neighborhood-product-2-school-ranking=\"false\"", "Existing school-ranking guard must remain false.");
assertIncludes(routeSource, "data-neighborhood-product-2-safety-ranking=\"false\"", "Existing safety-ranking guard must remain false.");
assertIncludes(routeSource, "data-neighborhood-product-2-demographic-targeting=\"false\"", "Existing demographic-targeting guard must remain false.");
assertIncludes(routeSource, "data-neighborhood-product-2-investment-projection=\"false\"", "Existing investment-projection guard must remain false.");

console.log(
  [
    "[south-boulder-neighborhood-route-enhancement] ok",
    `route=${ROUTE}`,
    "objectType=NEIGHBORHOOD",
    "canonical=preserved",
    "sitemap=preserved",
    "search=preserved",
    "map=preserved",
    "publicCopyOnly=true",
    "fairHousing=neutral",
    "protectedActivations=none",
  ].join(" "),
);
