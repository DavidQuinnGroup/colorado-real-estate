import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  buildCrossCityComparisonWorkspace,
  CROSS_CITY_COMPARISON_MAX_SELECTIONS,
  CROSS_CITY_COMPARISON_MIN_SELECTIONS,
  CROSS_CITY_COMPARISON_ROUTE,
  getCrossCityComparisonEligibleMarkets,
  getCrossCityComparisonHref,
  getCrossCityComparisonIneligibleSlugs,
  parseCrossCityComparisonSelection,
} from '../lib/crossCityComparison.js';

function read(path: string) {
  return readFileSync(path, 'utf8');
}

function assertIncludes(source: string, value: string, message: string) {
  assert(source.includes(value), message);
}

function assertNotIncludes(source: string, value: string, message: string) {
  assert(!source.includes(value), message);
}

const comparePage = read('app/compare/page.tsx');
const comparisonContract = read('lib/crossCityComparison.ts');
const decisionGuidePlatform = read('lib/decisionGuidePlatform.ts');
const marketPage = read('app/market/page.tsx');
const cohesionPanel = read('components/JourneyCohesionPanel.tsx');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const workerConfig = read('tsconfig.worker.json');
const registrySource = read('lib/coloradoDecisionGuideRegistry.ts');
const citySource = read('lib/cities.ts');

assert.equal(CROSS_CITY_COMPARISON_ROUTE, '/compare', 'Comparison must use one clear public route.');
assert.equal(CROSS_CITY_COMPARISON_MIN_SELECTIONS, 2, 'Comparison must require at least two cities.');
assert.equal(CROSS_CITY_COMPARISON_MAX_SELECTIONS, 3, 'Comparison must cap the first version at three cities.');
assertIncludes(comparePage, 'data-testid="cross-city-decision-comparison-page"', 'Comparison route must expose a deterministic page marker.');
assertIncludes(comparePage, 'data-cross-city-comparison-storage="false"', 'Comparison route must disclose no storage activation.');
assertIncludes(comparePage, 'data-cross-city-comparison-api="false"', 'Comparison route must disclose no public API activation.');
assertIncludes(comparePage, 'data-cross-city-comparison-map-change="false"', 'Comparison route must disclose no map behavior change.');
assertIncludes(comparePage, 'JourneyCohesionPanel', 'Comparison route must connect to the certified journey cohesion architecture.');
assertIncludes(comparePage, 'data-cross-city-search-navigation="document"', 'Comparison-to-search links must use document navigation for reliable browser Back URL restoration.');
assertIncludes(comparePage, 'data-cross-city-navigation-mode="document"', 'Comparison outbound continuity links must preserve normal document navigation semantics.');
assertIncludes(cohesionPanel, "| 'compare'", 'Journey cohesion panel must support an explicit comparison surface identity.');
assertIncludes(marketPage, 'data-testid="cross-city-comparison-market-entry"', 'Market hub must provide the restrained discovery entry point.');
assertNotIncludes(marketPage, 'href="/market/compare"', 'Implementation must not create a competing market comparison route.');
assertIncludes(
  decisionGuidePlatform,
  'Which Boulder neighborhood pattern should I compare against the way I would use the city day to day?',
  'Original Boulder Decision Guide source content must remain unchanged while comparison output is neutralized.',
);

const eligibleMarkets = getCrossCityComparisonEligibleMarkets();
const eligibleSlugs = eligibleMarkets.map((market) => market.slug).sort();
assert.deepEqual(
  eligibleSlugs,
  ['boulder', 'broomfield', 'denver', 'erie', 'lafayette', 'longmont', 'louisville', 'superior', 'westminster'],
  'Comparison eligibility must include the six Enhanced Foundation cities and the three editorial guides with distinct maturity.',
);
assert.equal(
  eligibleMarkets.filter((market) => market.maturity === 'ENHANCED_FOUNDATION').length,
  6,
  'Six Enhanced Foundation cities must be eligible.',
);
assert.equal(
  eligibleMarkets.filter((market) => market.maturity === 'EDITORIALLY_CERTIFIED').length,
  3,
  'Three editorially certified guides must remain eligible with their maturity preserved.',
);

for (const unsupportedSlug of ['niwot', 'gunbarrel', 'thornton', 'brighton', 'firestone', 'frederick']) {
  assert(getCrossCityComparisonIneligibleSlugs().includes(unsupportedSlug), `${unsupportedSlug} must remain fail-closed for comparison.`);
}

const malformedSelection = parseCrossCityComparisonSelection('broomfield,broomfield,niwot,denver,erie,westminster');
assert.deepEqual(malformedSelection.selectedSlugs, ['broomfield', 'denver', 'erie'], 'Selection parser must dedupe and enforce max count.');
assert(
  malformedSelection.rejectedSelections.some((item) => item.slug === 'broomfield' && item.reason === 'duplicate'),
  'Duplicate comparison selections must be rejected.',
);
assert(
  malformedSelection.rejectedSelections.some((item) => item.slug === 'niwot' && item.reason === 'unknown-or-unsupported'),
  'Unsupported comparison selections must be rejected.',
);
assert(
  malformedSelection.rejectedSelections.some((item) => item.slug === 'westminster' && item.reason === 'selection-limit'),
  'Selections above the maximum must be rejected.',
);

const emptyWorkspace = buildCrossCityComparisonWorkspace();
assert.equal(emptyWorkspace.canCompare, false, 'Default state must not invent a preselected comparison set.');
assert.equal(emptyWorkspace.selectedMarkets.length, 0, 'Default state must remain unselected.');

const twoCityWorkspace = buildCrossCityComparisonWorkspace('broomfield,denver');
assert.equal(twoCityWorkspace.canCompare, true, 'Two eligible markets must enable comparison.');
assert.deepEqual(twoCityWorkspace.selectedSlugs, ['broomfield', 'denver'], 'Query-string state must preserve selected eligible slugs.');
assert.equal(getCrossCityComparisonHref(['broomfield', 'denver']), '/compare?cities=broomfield%2Cdenver', 'Comparison href must remain shareable through slugs only.');

const mixedMaturityWorkspace = buildCrossCityComparisonWorkspace('boulder,broomfield,louisville');
assert.equal(mixedMaturityWorkspace.canCompare, true, 'Mixed maturity comparison must be supported when each guide is eligible.');
assert(
  mixedMaturityWorkspace.selectedMarkets.some((market) => market.maturity === 'EDITORIALLY_CERTIFIED'),
  'Mixed maturity workspace must preserve editorial certification.',
);
assert(
  mixedMaturityWorkspace.selectedMarkets.some((market) => market.maturity === 'ENHANCED_FOUNDATION'),
  'Mixed maturity workspace must preserve Enhanced Foundation maturity.',
);

const comparisonUnsafePatterns = [
  /best match(?:es)?/i,
  /ideal for/i,
  /best fit/i,
  /right for you/i,
  /suitable city/i,
  /recommended market/i,
  /winner/i,
  /superiority/i,
  /desirability/i,
  /customer preference inference/i,
];

function assertComparisonSafeText(value: string, context: string) {
  for (const pattern of comparisonUnsafePatterns) {
    assert.doesNotMatch(value, pattern, `${context} must not expose suitability, superiority, or preference-inference wording: ${pattern}`);
  }
}

for (const market of eligibleMarkets) {
  assert.equal(market.marketRoute, `/market/${market.slug}-co-housing-market`, `${market.name} must preserve canonical city guide route.`);
  assert.equal(market.searchHref, `/search?city=${encodeURIComponent(market.name)}`, `${market.name} must preserve city-filtered search path.`);
  assert(market.evidencePosture.length > 80, `${market.name} must expose evidence and limitation posture.`);
  assert(market.dimensions.localCharacter.length > 80, `${market.name} must expose local character context.`);
  assert(market.dimensions.housingForm.length > 80, `${market.name} must expose housing-form context.`);
  assert(market.dimensions.marketDrivers.length > 80, `${market.name} must expose market-driver context.`);
  assert(market.dimensions.dueDiligence.length > 80, `${market.name} must expose due-diligence prompts.`);
  assertComparisonSafeText(market.evidencePosture, `${market.name} evidence posture`);
  assertComparisonSafeText(market.decisionSnapshot.mattersMost, `${market.name} decision snapshot`);

  for (const [dimensionKey, dimensionValue] of Object.entries(market.dimensions)) {
    assertComparisonSafeText(dimensionValue, `${market.name} ${dimensionKey}`);
  }

  for (const expected of [
    { label: 'Market Context', href: market.marketRoute, destination: 'market' },
    { label: `Search ${market.name} Homes`, href: market.searchHref, destination: 'city-search' },
    { label: 'Buyer Guidance', href: '/buy', destination: 'buyer-guidance' },
    { label: 'Seller Guidance', href: '/sell', destination: 'seller-guidance' },
    { label: 'Financing Guidance', href: '/buy#financing-confidence', destination: 'financing-confidence' },
    { label: 'Grand Plan', href: '/grand-plan', destination: 'grand-plan' },
    { label: 'Advisory Guidance', href: '/contact', destination: 'advisory' },
  ] as const) {
    assert(
      market.continuityLinks.some((link) => link.label === expected.label && link.href === expected.href && link.destination === expected.destination),
      `${market.name} must preserve continuity label ${expected.label} with ${expected.href} and ${expected.destination}.`,
    );
  }
}

assert(twoCityWorkspace.dimensions.length >= 8, 'Comparison must expose a complete neutral dimension set.');
for (const dimension of twoCityWorkspace.dimensions) {
  assert.equal(dimension.values.length, 2, `${dimension.label} must give selected cities equivalent treatment.`);
  assert(dimension.prompt.length > 40, `${dimension.label} must include a decision-oriented prompt.`);
  assertComparisonSafeText(dimension.prompt, `${dimension.label} prompt`);
  for (const value of dimension.values) {
    assertComparisonSafeText(value.value, `${dimension.label} value for ${value.cityName}`);
  }
}

for (const dimension of mixedMaturityWorkspace.dimensions) {
  for (const value of dimension.values) {
    assertComparisonSafeText(value.value, `mixed maturity ${dimension.label} value for ${value.cityName}`);
  }
}

for (const forbiddenPublicPhrase of [
  'best match',
  'best matches',
  'best city',
  'best fit',
  'worst city',
  'winner',
  'loser',
  'ideal for',
  'right for you',
  'suitable city',
  'recommended market',
  'desirability',
  'perfect for',
  'more desirable',
  'safer',
  'better schools',
  'better investment',
  'higher potential',
  'recommended city',
  'suitability score',
  'star rating',
  'appreciation potential',
  'investment return',
  'school quality',
  'safety rating',
  'demographic profile',
  'personalized recommendation',
  'AI summary',
  'saved comparison',
  'localStorage',
  'sessionStorage',
  'document.cookie',
  'navigator.sendBeacon',
  'fetch(',
]) {
  assertNotIncludes(comparePage, forbiddenPublicPhrase, `Comparison route must not contain prohibited public phrase or activation: ${forbiddenPublicPhrase}`);
  assertNotIncludes(comparisonContract, forbiddenPublicPhrase, `Comparison contract must not contain prohibited public phrase or activation: ${forbiddenPublicPhrase}`);
}

for (const prohibitedRuntimeScope of [
  'app/api/',
  'prisma/schema.prisma',
  'migration',
  'provider activation',
  'search ranking',
  'map boundary',
]) {
  assertNotIncludes(comparisonContract, prohibitedRuntimeScope, `Comparison implementation must not introduce protected runtime scope: ${prohibitedRuntimeScope}`);
}

assertIncludes(registrySource, "publicEntry({\n    canonicalName: 'Broomfield'", 'Broomfield must remain registry-driven.');
assertIncludes(citySource, 'broomfield-co-housing-market', 'Broomfield city route data must remain available.');
assert.equal(
  packageJson.scripts?.['check:cross-city-decision-comparison'],
  'npm run worker:build && node dist/scripts/checkCrossCityDecisionComparison.js',
  'package.json must expose the Cross-City Decision Comparison validation check.',
);
assertIncludes(workerConfig, 'scripts/checkCrossCityDecisionComparison.ts', 'Worker build must include the Cross-City Decision Comparison check.');

console.log('[cross-city-decision-comparison] ok: route, eligibility, query state, continuity, maturity, safety, and protected boundaries verified.');
