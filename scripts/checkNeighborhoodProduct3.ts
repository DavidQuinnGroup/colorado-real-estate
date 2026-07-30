import assert from 'node:assert/strict';
import fs from 'node:fs';

import { buildNeighborhoodProduct3Model, NEIGHBORHOOD_PRODUCT_3_STATUS } from '../lib/neighborhoodProduct3.js';
import { neighborhoods } from '../lib/neighborhoods.js';

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

const route = read('app/market/[city]/[slug]/page.tsx');
const component = read('components/NeighborhoodProduct3Experience.tsx');
const model = read('lib/neighborhoodProduct3.ts');
const nearby = read('components/NearbyNeighborhoods.tsx');
const linkGraph = read('lib/linking/buildLinkGraph.ts');
const articles = read('lib/articles.ts');
const marketExperience = read('lib/marketIntelligenceExperience.ts');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };

assert.equal(NEIGHBORHOOD_PRODUCT_3_STATUS, 'NEIGHBORHOOD_PRODUCT_3_IMPLEMENTATION_COMPLETE');
assertIncludes(route, 'buildNeighborhoodProduct3Model', 'Neighborhood route must build the Product 3 model.');
assertIncludes(route, '<NeighborhoodProduct3Experience model={neighborhoodProduct3Model} />', 'Neighborhood route must compose Product 3 experience.');

for (const surface of [
  'data-testid="neighborhood-product-3-root"',
  'data-testid="neighborhood-product-3-decision-profile-item"',
  'data-testid="neighborhood-product-3-community-constellation"',
  'data-testid="neighborhood-product-3-constellation-table"',
  'data-testid="neighborhood-product-3-confidence-layer"',
  'data-testid="neighborhood-product-3-market-context"',
  'data-testid="neighborhood-product-3-property-context"',
  'data-testid="neighborhood-product-3-verification-checklist"',
  'data-testid="neighborhood-product-3-mobile-decision-rail"',
]) {
  assertIncludes(component, surface, `Neighborhood Product 3 surface missing: ${surface}`);
}

for (const boundary of [
  'data-neighborhood-product-3-ai="false"',
  'data-neighborhood-product-3-gis="false"',
  'data-neighborhood-product-3-provider-activation="false"',
  'data-neighborhood-product-3-telemetry="false"',
  'data-neighborhood-product-3-forecasting="false"',
  'data-neighborhood-product-3-valuation-model="false"',
  'data-neighborhood-product-3-rankings="false"',
  'data-neighborhood-product-3-suitability-scoring="false"',
  'data-neighborhood-product-3-demographic-targeting="false"',
  'data-neighborhood-product-3-school-ranking="false"',
  'data-neighborhood-product-3-safety-ranking="false"',
  'data-neighborhood-product-3-fixture-data="false"',
  'data-community-constellation-scoring="false"',
  'data-community-constellation-ranking="false"',
  'data-community-constellation-demographics="false"',
]) {
  assertIncludes(component, boundary, `Neighborhood Product 3 boundary missing: ${boundary}`);
}

assertIncludes(model, "'complete'", 'Neighborhood Product 3 must support complete evidence state.');
assertIncludes(model, "'sparse'", 'Neighborhood Product 3 must support sparse evidence state.');
assertIncludes(model, "'missing'", 'Neighborhood Product 3 must support missing evidence state.');
assertIncludes(model, "'conflict'", 'Neighborhood Product 3 must support conflict evidence state.');
assertIncludes(model, 'static orientation as live inventory', 'Product model must prevent static data from appearing live.');
assertIncludes(model, 'not a forecast or valuation claim', 'Market context must avoid forecasting and valuation claims.');
assertIncludes(component, '<table', 'Community Constellation must include an accessible table alternative.');

const supportedNeighborhood = neighborhoods.find((item) => item.slug === 'mapleton-hill');
assert(supportedNeighborhood, 'Expected Mapleton Hill neighborhood fixture for supported Product 3 model validation.');
const completeModel = buildNeighborhoodProduct3Model({
  neighborhood: supportedNeighborhood,
  inventoryState: { count: 2, source: 'typesense' },
  market: {
    inventoryLabel: 'Indexed inventory signal',
    competitivenessLabel: 'Selective options',
    timingLabel: 'Compare context before touring',
  },
  cityMarketHref: '/market/boulder-co-housing-market',
  searchHref: '/search?neighborhood=Mapleton%20Hill',
});

assert.equal(completeModel.evidenceState, 'complete', 'Specific neighborhood with indexed inventory must allow complete bounded interpretation.');
assert.equal(completeModel.richInterpretationAllowed, true, 'Complete state must allow bounded rich interpretation.');
assert.equal(completeModel.profile.length, 3, 'Decision profile must expose three concise synthesis items.');
assert.equal(completeModel.constellation.length, 5, 'Community Constellation must expose five approved dimensions.');
assert.equal(completeModel.confidence.length, 6, 'Confidence Layer must expose source, freshness, completeness, limitations, conflicts, and verification.');
assert.equal(completeModel.propertyContext.length, 2, 'Property Context must expose search/property bridges.');
assert.equal(completeModel.checklist.length, 5, 'Verification Checklist must cover five concise checks.');

const sparseNeighborhood = neighborhoods.find((item) => item.slug === 'downtown-boulder');
assert(sparseNeighborhood, 'Expected Downtown Boulder neighborhood fixture for sparse Product 3 model validation.');
const sparseModel = buildNeighborhoodProduct3Model({
  neighborhood: sparseNeighborhood,
  inventoryState: { count: 0, source: 'fallback' },
  market: {
    inventoryLabel: 'Property search path available',
    competitivenessLabel: 'Review current search results',
    timingLabel: 'Verify current availability',
  },
  cityMarketHref: '/market/boulder-co-housing-market',
  searchHref: '/search?neighborhood=Downtown%20Boulder',
});

assert.equal(sparseModel.evidenceState, 'sparse', 'Default/static neighborhood state must remain sparse.');
assert.equal(sparseModel.richInterpretationAllowed, false, 'Sparse state must not allow rich interpretation.');
assert(sparseModel.propertyContext.some((item) => item.source === 'search-path'), 'Sparse model must expose search path without live-count claim.');

const forbiddenVisibleSources = [route, stripGovernedFalseAttributes(component), model, nearby, linkGraph, articles].join('\n');
for (const forbidden of [
  'Ranked by resilience',
  '/100',
  'resilience score',
  'efficiency score',
  'Lifestyle Audit',
  'Future-Proof',
  'Investment Readiness',
  'lifestyle ROI',
  'best neighborhood',
  'safest neighborhood',
  'school ranking',
  'safety ranking',
  'crime score',
  'desirability',
  'ideal resident',
  'demographic recommendation',
  'suitability score',
  'recommended neighborhood',
  'investment recommendation',
  'forecast appreciation',
  'OpenAI',
  'NON_PRODUCTION_FIXTURE',
  'admin/repository',
]) {
  assertNotIncludes(forbiddenVisibleSources, forbidden, `Neighborhood Product 3 must not expose prohibited public wording: ${forbidden}`);
}

assert(!component.match(/fetch\(|XMLHttpRequest|navigator\.sendBeacon|localStorage|sessionStorage|document\.cookie/), 'Neighborhood Product 3 component must not introduce API calls or telemetry.');
assert(!model.match(/fetch\(|prisma\.|createClient\(/), 'Neighborhood Product 3 model must not introduce data fetching, provider calls, or Prisma usage.');
assertNotIncludes(nearby, '.sort((a, b) => b.resilienceScore', 'Nearby neighborhoods must not use score-based ordering.');
assertNotIncludes(nearby, 'Metric icon={<ShieldCheck', 'Nearby neighborhoods must not present resilience as a score metric.');
assertNotIncludes(nearby, 'Metric icon={<Zap', 'Nearby neighborhoods must not present efficiency as a score metric.');

assert.equal(
  packageJson.scripts?.['check:neighborhood-product-3'],
  'npm run worker:build && node dist/scripts/checkNeighborhoodProduct3.js',
  'package.json must expose Neighborhood Product 3 certification check.',
);

console.log('[neighborhood-product-3] ok: Product 3 surfaces, confidence states, Community Constellation, mobile rail, score/ranking remediation, and prohibited boundaries verified.');
