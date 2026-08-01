import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

import { neighborhoods, type Neighborhood } from "../lib/neighborhoods.js";

const CONTRACT = "EXISTING_NEIGHBORHOOD_ROUTE_ENHANCEMENT";

type EnhancedRouteExpectation = {
  name: string;
  slug: string;
  city: string;
  route: string;
  canonicalUrl: string;
  searchHref: string;
  requiredCopy: string[];
  forbiddenCopy: string[];
};

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

function getEnhancedNeighborhood(expectation: EnhancedRouteExpectation) {
  const neighborhood = neighborhoods.find(
    (item) => item.city === expectation.city && item.slug === expectation.slug,
  );

  assert(neighborhood, `${expectation.name} must remain an existing repository neighborhood record.`);
  assert.equal(neighborhood.name, expectation.name, `${expectation.name} display identity must be preserved.`);
  assert(neighborhood.routeEnhancement, `${expectation.name} must carry the route-enhancement contract.`);
  assert.equal(neighborhood.routeEnhancement.contract, CONTRACT, `${expectation.name} must use the shared route-enhancement contract.`);
  assert.equal(neighborhood.routeEnhancement.objectType, "NEIGHBORHOOD", `${expectation.name} object type must remain NEIGHBORHOOD.`);
  assert.equal(neighborhood.routeEnhancement.canonicalPath, expectation.route, `${expectation.name} route path must remain exact.`);
  assert.equal(neighborhood.routeEnhancement.canonicalUrl, expectation.canonicalUrl, `${expectation.name} canonical URL must be preserved.`);

  const records = neighborhoods.filter((item) => item.city === expectation.city && item.slug === expectation.slug);
  assert.equal(records.length, 1, `The enhancement must not create a duplicate ${expectation.name} route record.`);

  return neighborhood as Neighborhood & { routeEnhancement: NonNullable<Neighborhood["routeEnhancement"]> };
}

function publicCopyFor(neighborhood: Neighborhood & { routeEnhancement: NonNullable<Neighborhood["routeEnhancement"]> }) {
  return [
    neighborhood.lifestyleVibe,
    neighborhood.constructionDNA,
    neighborhood.tacticalLever,
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
    neighborhood.routeEnhancement.protectedBoundary,
  ].join("\n");
}

const routeSource = read("app/market/[city]/[slug]/page.tsx");
const neighborhoodsSource = read("lib/neighborhoods.ts");
const sitemapSource = read("app/sitemap.ts");
const searchSource = read("app/search/page.tsx");
const mapSource = read("components/maps/SearchMap.tsx");
const packageJson = JSON.parse(read("package.json")) as { scripts?: Record<string, string> };
const tsconfig = read("tsconfig.worker.json");

const expectations: EnhancedRouteExpectation[] = [
  {
    name: "South Boulder",
    slug: "south-boulder",
    city: "Boulder",
    route: "/market/boulder/south-boulder",
    canonicalUrl: "https://davidquinngroup.com/market/boulder/south-boulder",
    searchHref: "/search?neighborhood=South%20Boulder",
    requiredCopy: [
      "South Boulder is presented as neighborhood-level orientation within Boulder",
      "does not expose internal Evidence Depth metadata",
      "does not determine condition, title, permits, value, insurance, financing, or suitability",
      "does not establish property condition, value, title, ownership, insurability, permits, HOA status, school assignment, financing eligibility, or suitability",
    ],
    forbiddenCopy: ["Table Mesa is presented", "Search Table Mesa"],
  },
  {
    name: "Table Mesa",
    slug: "table-mesa",
    city: "Boulder",
    route: "/market/boulder/table-mesa",
    canonicalUrl: "https://davidquinngroup.com/market/boulder/table-mesa",
    searchHref: "/search?neighborhood=Table%20Mesa",
    requiredCopy: [
      "Table Mesa is presented as neighborhood-level orientation within Boulder",
      "approximate-boundary and incomplete-evidence limitations",
      "does not determine condition, title, permits, value, insurance, financing, HOA status, legal compliance, marketability, or suitability",
      "does not establish property condition, value, title, ownership, insurability, permits, HOA status, school assignment, financing eligibility, marketability, suitability, or sale outcome",
    ],
    forbiddenCopy: ["Table Mesa is part of South Boulder", "best neighborhood", "ideal for"],
  },
];

const enhancedNeighborhoods = expectations.map(getEnhancedNeighborhood);
const enhancedRecords = neighborhoods.filter((neighborhood) => neighborhood.routeEnhancement);
assert.equal(enhancedRecords.length, expectations.length, "Only South Boulder and Table Mesa may receive the bounded enhancement in this implementation.");
assert.deepEqual(
  enhancedRecords.map((neighborhood) => neighborhood.slug).sort(),
  expectations.map((expectation) => expectation.slug).sort(),
  "The bounded enhancements must apply only to the authorized routes.",
);

assert.equal(
  packageJson.scripts?.["check:south-boulder-neighborhood-route-enhancement"],
  "npm run worker:build && node dist/scripts/checkSouthBoulderNeighborhoodRouteEnhancement.js",
  "package.json must preserve the existing route-enhancement check registration.",
);
assertIncludes(tsconfig, "scripts/checkSouthBoulderNeighborhoodRouteEnhancement.ts", "Worker build must include the route-enhancement check.");

assertIncludes(routeSource, "data-testid=\"neighborhood-route-enhancement\"", "Public enhancement section must render through the existing neighborhood route.");
assertIncludes(routeSource, "data-neighborhood-route-enhancement-name={neighborhood.name}", "Route-neutral name marker must remain present.");
assertIncludes(routeSource, "data-neighborhood-route-enhancement-slug={neighborhood.slug}", "Route-neutral slug marker must remain present.");
assertIncludes(routeSource, "data-neighborhood-route-enhancement-contract={routeEnhancement.contract}", "Route enhancement contract marker must remain present.");
assertIncludes(routeSource, "data-neighborhood-route-enhancement-route={routeEnhancement.canonicalPath}", "Route enhancement route marker must remain present.");
assertIncludes(routeSource, "data-neighborhood-route-enhancement-canonical={routeEnhancement.canonicalUrl}", "Route enhancement canonical marker must remain present.");
assertIncludes(routeSource, "data-neighborhood-route-enhancement-search-preserved=\"true\"", "Search-preservation marker must remain present.");
assertIncludes(routeSource, "data-neighborhood-route-enhancement-map-preserved=\"true\"", "Map-preservation marker must remain present.");
assertIncludes(routeSource, "data-neighborhood-route-enhancement-sitemap-preserved=\"true\"", "Sitemap-preservation marker must remain present.");
assertIncludes(routeSource, "data-neighborhood-route-enhancement-public-copy-only=\"true\"", "Evidence transparency must remain public-copy-only.");
assertIncludes(routeSource, "data-neighborhood-route-enhancement-no-internal-metadata=\"true\"", "Internal evidence metadata must remain unexposed.");
assertIncludes(routeSource, "Use {neighborhood.name} as orientation, then verify the address.", "Route enhancement heading must use the active route identity.");
assertNotIncludes(routeSource, "Use South Boulder as orientation", "Route enhancement heading must not hard-code South Boulder.");
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

for (const expectation of expectations) {
  const neighborhood = enhancedNeighborhoods.find((item) => item.slug === expectation.slug);
  assert(neighborhood, `${expectation.name} must be validated.`);
  const publicCopy = publicCopyFor(neighborhood);

  assertIncludes(neighborhoodsSource, expectation.searchHref, `${expectation.name} must use the existing encoded Search destination.`);
  assertIncludes(neighborhoodsSource, expectation.route, `${expectation.name} canonical path must be present.`);
  assertIncludes(neighborhoodsSource, expectation.canonicalUrl, `${expectation.name} canonical URL must be present.`);

  for (const required of expectation.requiredCopy) {
    assertIncludes(publicCopy, required, `${expectation.name} public copy must include required boundary: ${required}`);
  }

  for (const forbidden of expectation.forbiddenCopy) {
    assertNotIncludes(publicCopy, forbidden, `${expectation.name} public copy must not include forbidden route-specific claim: ${forbidden}`);
  }

  for (const link of [
    "/market/boulder-co-housing-market",
    expectation.searchHref,
    "/buy",
    "/buy#financing-readiness",
    "/sell",
    "/home-worth#seller-readiness",
    "/grand-plan",
    "/contact#advisory-readiness",
  ]) {
    assert(
      neighborhood.routeEnhancement.journeyLinks.some((journeyLink) => journeyLink.href === link),
      `${expectation.name} journey continuity must preserve ${link}.`,
    );
  }

  assertIncludes(
    neighborhood.routeEnhancement.protectedBoundary,
    "No new route, alias, redirect, registry entry, sitemap entry, Search behavior, map layer, GIS boundary",
    `${expectation.name} protected boundary must explicitly preserve route, Search, map, and GIS behavior.`,
  );
  assertIncludes(
    neighborhood.routeEnhancement.protectedBoundary,
    "Niwot activation, Gunbarrel activation, or Local Decision Intelligence Wave 4 activation",
    `${expectation.name} protected boundary must explicitly preserve Niwot, Gunbarrel, and LDI Wave 4 non-activation.`,
  );
}

for (const path of [
  "app/market/boulder/south-boulder/page.tsx",
  "app/market/boulder/table-mesa/page.tsx",
  "app/south-boulder/page.tsx",
  "app/table-mesa/page.tsx",
  "app/neighborhood/south-boulder/page.tsx",
  "app/neighborhood/table-mesa/page.tsx",
  "app/api/south-boulder/route.ts",
  "app/api/table-mesa/route.ts",
  "app/api/neighborhood-route-enhancement/route.ts",
  "app/api/south-boulder-neighborhood-route-enhancement/route.ts",
  "app/api/table-mesa-neighborhood-route-enhancement/route.ts",
]) {
  assertFileMissing(path);
}

assertNotIncludes(sitemapSource, "south-boulder", "Sitemap behavior must not add a South Boulder-specific entry.");
assertNotIncludes(sitemapSource, "table-mesa", "Sitemap behavior must not add a Table Mesa-specific entry.");
assertNotIncludes(sitemapSource, "neighborhoods", "Sitemap generation must not be expanded to public neighborhood inventory.");
assertNotIncludes(searchSource, CONTRACT, "Search must not import or activate the route-enhancement contract.");
assertNotIncludes(searchSource, "south-boulder", "Search source must not add South Boulder-specific behavior.");
assertNotIncludes(searchSource, "table-mesa", "Search source must not add Table Mesa-specific behavior.");
assertNotIncludes(mapSource, CONTRACT, "Map source must not import or activate the route-enhancement contract.");
assertNotIncludes(mapSource, "south-boulder", "Map source must not add South Boulder-specific behavior.");
assertNotIncludes(mapSource, "table-mesa", "Map source must not add Table Mesa-specific behavior.");

const prohibitedPatterns = [
  /\bbest neighborhood\b/i,
  /\bideal for\b/i,
  /\bperfect for\b/i,
  /\bsafest\b/i,
  /\bschool ranking\b/i,
  /\bschool rating\b/i,
  /\bschool quality\b/i,
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
  /\bofficial association\b/i,
  /\bpart of South Boulder\b/i,
];

for (const neighborhood of enhancedNeighborhoods) {
  const publicCopy = publicCopyFor(neighborhood);

  for (const pattern of prohibitedPatterns) {
    assert(!pattern.test(publicCopy), `${neighborhood.name} enhancement must avoid prohibited public claim: ${pattern}`);
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
    assertNotIncludes(publicCopy, forbiddenInternalTerm, `${neighborhood.name} public copy must not expose internal evidence metadata: ${forbiddenInternalTerm}`);
  }
}

assertIncludes(routeSource, "data-neighborhood-product-2-school-ranking=\"false\"", "Existing school-ranking guard must remain false.");
assertIncludes(routeSource, "data-neighborhood-product-2-safety-ranking=\"false\"", "Existing safety-ranking guard must remain false.");
assertIncludes(routeSource, "data-neighborhood-product-2-demographic-targeting=\"false\"", "Existing demographic-targeting guard must remain false.");
assertIncludes(routeSource, "data-neighborhood-product-2-investment-projection=\"false\"", "Existing investment-projection guard must remain false.");

console.log(
  [
    "[existing-neighborhood-route-enhancement] ok",
    "routes=/market/boulder/south-boulder,/market/boulder/table-mesa",
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
