import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string) {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string) {
  assert(source.includes(value), message);
}

function assertNotIncludes(source: string, value: string, message: string) {
  assert(!source.includes(value), message);
}

function stripGovernedFalseAttributes(source: string) {
  return source.replace(/\sdata-[a-zA-Z0-9-]+="false"/g, '');
}

const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfig = read('tsconfig.worker.json');
const continueYourDecision = read('components/ContinueYourDecision.tsx');
const homepage = read('app/page.tsx');
const searchPage = read('app/search/page.tsx');
const searchInterface = read('components/search/SearchInterface.tsx');
const marketIndex = read('app/market/page.tsx');
const cityMarketPage = read('app/market/[city]/page.tsx');
const neighborhoodPage = read('app/market/[city]/[slug]/page.tsx');
const propertyPage = read('app/properties/[id]/page.tsx');
const cityMarketStats = read('components/CityMarketStats.tsx');
const marketNeighborhoodLinks = read('components/MarketNeighborhoodLinks.tsx');
const cityNeighborhoods = read('components/CityNeighborhoods.tsx');
const nearbyNeighborhoods = read('components/NearbyNeighborhoods.tsx');
const neighborhoodProduct3 = read('components/NeighborhoodProduct3Experience.tsx');
const propertyProduct31Model = read('lib/propertyProduct31.ts');
const propertyLinks = read('lib/linking/getPropertyLinks.ts');
const relatedContent = read('components/RelatedContent.tsx');
const luxuryPopup = read('components/maps/LuxuryIntelligencePopup.tsx');
const propertyMap = read('components/PropertyMap.tsx');
const selectedDrawer = read('components/maps/SelectedPropertyDrawer.tsx');
const propertyDetail = read('components/search/PropertyDetail.tsx');
const leadCapture = read('components/LeadCapture.tsx');
const decisionGuidePlatform = read('lib/decisionGuidePlatform.ts');
const marketDecisionWorkspace = read('lib/marketDecisionWorkspace.ts');
const marketProduct3 = read('lib/marketProduct3.ts');

assert.equal(
  packageJson.scripts?.['check:decision-journey-experience'],
  'npm run worker:build && node dist/scripts/checkDecisionJourneyExperience.js',
  'package.json must expose the Decision Journey Experience validation check.',
);
assertIncludes(tsconfig, 'scripts/checkDecisionJourneyExperience.ts', 'Worker build must include the DJX validation script.');

for (const boundary of [
  'data-testid="continue-your-decision"',
  'data-djx-ai="false"',
  'data-djx-gis="false"',
  'data-djx-telemetry="false"',
  'data-djx-personalization="false"',
  'data-djx-provider-activation="false"',
  'data-djx-forecasting="false"',
  'data-djx-valuation="false"',
  'data-djx-rankings="false"',
  'data-djx-suitability-scoring="false"',
  'data-djx-demographic-targeting="false"',
  'data-djx-school-ranking="false"',
  'data-djx-safety-ranking="false"',
  'data-djx-fixture-data="false"',
]) {
  assertIncludes(continueYourDecision, boundary, `Continue Your Decision boundary missing: ${boundary}`);
}

for (const prohibitedRuntime of ['fetch(', 'XMLHttpRequest', 'navigator.sendBeacon', 'localStorage', 'sessionStorage', 'document.cookie']) {
  assertNotIncludes(continueYourDecision, prohibitedRuntime, `Continue Your Decision must not introduce runtime activation: ${prohibitedRuntime}`);
}

const routeContinuityChecks = [
  [homepage, 'stage="home"', 'Homepage must render Continue Your Decision.'],
  [searchInterface, 'stage="search"', 'Search must render Continue Your Decision.'],
  [marketIndex, 'stage="market"', 'Market root must render Continue Your Decision.'],
  [cityMarketPage, 'stage="market"', 'City market route must render Continue Your Decision.'],
  [neighborhoodPage, 'stage="neighborhood"', 'Neighborhood route must render Continue Your Decision.'],
  [propertyPage, 'stage="property"', 'Property route must render Continue Your Decision.'],
] as const;

for (const [source, marker, message] of routeContinuityChecks) {
  assertIncludes(source, 'ContinueYourDecision', message);
  assertIncludes(source, marker, message);
}

for (const [source, route] of [
  [homepage, 'homepage'],
  [searchInterface, 'search'],
  [marketIndex, 'market root'],
  [cityMarketPage, 'city market'],
  [neighborhoodPage, 'neighborhood'],
  [propertyPage, 'property'],
] as const) {
  assertIncludes(source, 'currentDecision=', `${route} must explain the current decision.`);
  assertIncludes(source, 'whyHere=', `${route} must explain why the customer arrived on this page.`);
  assertIncludes(source, 'nextStep=', `${route} must explain the next logical step.`);
}

assertIncludes(homepage, 'Start with criteria, context, and confidence', 'Homepage must use standardized criteria/context/confidence language.');
assertIncludes(searchInterface, 'matches your stated criteria', 'Search must use stated-criteria language.');
assertIncludes(marketIndex, 'Neighborhood context', 'Market root must use neighborhood-context language.');
assertIncludes(cityMarketPage, 'property-specific verification context', 'City market must use verification context instead of average resilience score language.');
assertIncludes(neighborhoodPage, 'supports your practical decision questions', 'Neighborhood page must use practical decision language.');
assertIncludes(propertyProduct31Model, "label: 'Core public facts'", 'Property DNA must use public-facts language instead of fit language.');
assertIncludes(propertyLinks, 'evidence, and verification prompts', 'Property links must use evidence and verification language.');
assertIncludes(relatedContent, 'verification context', 'Related content must use verification context language.');

const sourceForPublicCopy = [
  homepage,
  searchPage,
  searchInterface,
  marketIndex,
  cityMarketPage,
  neighborhoodPage,
  propertyPage,
  cityMarketStats,
  marketNeighborhoodLinks,
  cityNeighborhoods,
  nearbyNeighborhoods,
  neighborhoodProduct3,
  propertyProduct31Model,
  propertyLinks,
  relatedContent,
  luxuryPopup,
  propertyMap,
  selectedDrawer,
  propertyDetail,
  leadCapture,
  decisionGuidePlatform,
  marketDecisionWorkspace,
  marketProduct3,
].map(stripGovernedFalseAttributes).join('\n');

for (const forbidden of [
  'Start with fit',
  'Daily-life fit',
  'Neighborhood fit',
  'neighborhood fit',
  'location fit',
  'tour fit',
  'stronger neighborhood fits',
  'Location Fit',
  'well-fit',
  'compare fit',
  'city-wide fit',
  'lifestyle efficiency',
  'Lifestyle Efficiency',
  'Efficiency Index',
  'Efficiency {',
  'Resilience {',
  'Efficiency score',
  'efficiency score',
  'resilience score',
  'average resilience',
  'Ranked by resilience',
  'ranking neighborhoods',
  'Core fit facts',
  '/100 average resilience',
]) {
  assertNotIncludes(sourceForPublicCopy, forbidden, `DJX public copy must not expose legacy wording: ${forbidden}`);
}

assertNotIncludes(cityMarketPage, '.sort((a, b) => b.resilienceScore', 'City market neighborhoods must not use score-based public ordering.');
assertNotIncludes(marketNeighborhoodLinks, 'data-market-neighborhood-resilience-score=', 'Market neighborhood links must not expose public score metadata.');
assertNotIncludes(marketNeighborhoodLinks, 'data-market-neighborhood-efficiency-score=', 'Market neighborhood links must not expose public score metadata.');
assertNotIncludes(cityNeighborhoods, 'data-city-neighborhood-resilience-score=', 'City neighborhoods must not expose public score metadata.');
assertNotIncludes(cityNeighborhoods, 'data-city-neighborhood-efficiency-score=', 'City neighborhoods must not expose public score metadata.');
assertNotIncludes(nearbyNeighborhoods, 'data-nearby-neighborhood-resilience-score=', 'Nearby neighborhoods must not expose public score metadata.');
assertNotIncludes(nearbyNeighborhoods, 'data-nearby-neighborhood-efficiency-score=', 'Nearby neighborhoods must not expose public score metadata.');

for (const prohibitedCapability of [
  'OpenAI',
  'chatbot',
  'recommendation engine',
  'navigator.sendBeacon',
  'document.cookie',
  'localStorage.setItem',
  'sessionStorage.setItem',
  'preferred lender',
  'pre-approved',
  'school ranking',
  'safety ranking',
  'crime score',
  'demographic recommendation',
  'suitability score',
  'forecast appreciation',
  'guaranteed appreciation',
  'NON_PRODUCTION_FIXTURE',
  'admin/repository',
]) {
  assertNotIncludes(sourceForPublicCopy, prohibitedCapability, `DJX must not introduce prohibited capability or leakage: ${prohibitedCapability}`);
}

for (const backendExpansionPattern of [
  /CREATE TABLE/i,
  /ALTER TABLE/i,
  /prisma\.[a-zA-Z]+\.create/,
  /prisma\.[a-zA-Z]+\.update/,
  /prisma\.[a-zA-Z]+\.delete/,
]) {
  assert(![continueYourDecision, homepage, searchInterface, marketIndex, cityMarketPage, neighborhoodPage, propertyPage].join('\n').match(backendExpansionPattern), 'DJX must not introduce backend writes, schema changes, or database mutations.');
}

console.log('[decision-journey-experience] ok: cross-product continuity, standardized Product 3 language, score-era remediation, navigation context, and prohibited-capability boundaries verified.');
