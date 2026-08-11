import assert from 'node:assert/strict';
import fs from 'node:fs';

import { cities } from '../lib/cities.js';
import {
  buildCityOrientationGuidePath,
  CITY_ORIENTATION_GUIDE_INTENT_SLUGS,
  CITY_ORIENTATION_GUIDE_TARGET_CITY_SLUGS,
} from '../lib/cityOrientationGuideContract.js';
import { getDecisionGuideRegistryEntry } from '../lib/coloradoDecisionGuideRegistry.js';
import { buildMarketAeoContract } from '../lib/marketAeoPilot.js';
import { buildCityMarketExperience } from '../lib/marketIntelligenceExperience.js';
import { neighborhoods } from '../lib/neighborhoods.js';

function read(filePath: string) {
  return fs.readFileSync(filePath, 'utf8');
}

const routePage = read('app/market/[city]/guides/[slug]/page.tsx');
const marketPage = read('app/market/[city]/page.tsx');
const sitemap = read('app/sitemap.ts');
const packageJson = read('package.json');
const workerConfig = read('tsconfig.worker.json');
const guideContract = read('lib/cityOrientationGuideContract.ts');
const guideHelper = read('lib/cityOrientationGuides.ts');

const originalFive = [
  'boulder-co-housing-market',
  'denver-co-housing-market',
  'louisville-co-housing-market',
  'lafayette-co-housing-market',
  'longmont-co-housing-market',
] as const;

const wave2Cities = [
  'broomfield-co-housing-market',
  'erie-co-housing-market',
  'westminster-co-housing-market',
] as const;

const excludedCities = [
  'superior-co-housing-market',
  'brighton-co-housing-market',
  'firestone-co-housing-market',
  'frederick-co-housing-market',
  'thornton-co-housing-market',
  'gunbarrel-co-housing-market',
  'niwot-co-housing-market',
] as const;

const targetSlugs = [...CITY_ORIENTATION_GUIDE_TARGET_CITY_SLUGS];

assert.deepEqual(targetSlugs, [...originalFive, ...wave2Cities], 'Target guide cities must be exactly the original five plus Broomfield, Erie, and Westminster.');
assert.equal(CITY_ORIENTATION_GUIDE_INTENT_SLUGS.length, 3, 'Exactly three guide intents must remain authorized.');
assert.deepEqual([...CITY_ORIENTATION_GUIDE_INTENT_SLUGS], [
  'orienting-before-search',
  'reading-market-context',
  'place-questions-to-property-verification',
]);

const routePaths = targetSlugs.flatMap((citySlug) =>
  CITY_ORIENTATION_GUIDE_INTENT_SLUGS.map((guideSlug) => buildCityOrientationGuidePath(citySlug, guideSlug)),
);
const uniqueRoutePaths = new Set(routePaths);
assert.equal(targetSlugs.length, 8, 'Total target cities must be 8.');
assert.equal(routePaths.length, 24, 'Total guide routes must be 24.');
assert.equal(uniqueRoutePaths.size, 24, 'Every guide route must be unique.');

for (const citySlug of originalFive) {
  const routes = routePaths.filter((path) => path.startsWith(`/market/${citySlug}/guides/`));
  assert.equal(routes.length, 3, `${citySlug} must retain its original three guide routes.`);
}

const expectedWave2Paths = wave2Cities.flatMap((citySlug) =>
  CITY_ORIENTATION_GUIDE_INTENT_SLUGS.map((guideSlug) => `/market/${citySlug}/guides/${guideSlug}`),
);
assert.equal(expectedWave2Paths.length, 9, 'Exactly nine Wave 2 routes must be expected.');
for (const expectedPath of expectedWave2Paths) {
  assert(routePaths.includes(expectedPath), `${expectedPath} must be generated.`);
}

for (const citySlug of wave2Cities) {
  const city = cities.find((candidate) => candidate.marketSlug === citySlug);
  assert(city, `${citySlug} city data must exist.`);
  assert.equal(city.publicMarketRoute, undefined, `${city.name} market route must remain public by default.`);

  const registryEntry = getDecisionGuideRegistryEntry(city);
  assert(registryEntry, `${city.name} Decision Guide Registry entry must exist.`);
  assert.equal(registryEntry.guideMaturity, 'ENHANCED_FOUNDATION', `${city.name} must remain ENHANCED_FOUNDATION.`);
  assert.equal(registryEntry.publicEligibility, true, `${city.name} must remain public eligible.`);
  assert.equal(registryEntry.marketRoute, `/market/${city.marketSlug}`, `${city.name} canonical Market route must match city config.`);
  assert.equal(registryEntry.listingDataAvailability, true, `${city.name} Search city support must remain available.`);
  assert.equal(registryEntry.marketDataAvailability, true, `${city.name} governed Market context must remain available.`);
  assert.equal(registryEntry.freshness, '2026-07-29', `${city.name} Decision Guide Registry freshness must stay explicit.`);

  const neighborhoodCount = neighborhoods.filter((neighborhood) => neighborhood.city === city.name).length;
  const marketAeo = buildMarketAeoContract({
    city,
    marketExperience: buildCityMarketExperience(city, neighborhoodCount),
    neighborhoodCount,
  });

  assert(marketAeo, `${city.name} Market AEO contract must build from existing city-market context.`);
  assert.equal(marketAeo.freshness.status, 'CURRENT', `${city.name} Market AEO freshness must be CURRENT.`);
  assert.equal(marketAeo.evidenceState, 'CURRENT', `${city.name} Market AEO evidence state must be CURRENT.`);
  assert.equal(marketAeo.conflictState, 'NONE', `${city.name} Market AEO conflict state must be NONE.`);
  assert.match(marketAeo.source.label, /Existing REIE governed city-market data/i, `${city.name} source basis must use existing governed city-market context.`);
  assert.match(marketAeo.marketPeriod, new RegExp(`Current published REIE ${city.name} city-market briefing`), `${city.name} market period must stay route-specific.`);
  assert.match(marketAeo.freshness.label, /not a live MLS or provider feed/i, `${city.name} freshness must reject live-feed claims.`);

  const cityRoutePaths = routePaths.filter((path) => path.startsWith(`/market/${citySlug}/guides/`));
  assert.equal(cityRoutePaths.length, 3, `${city.name} must expose exactly three guide intents.`);
}

const superior = cities.find((city) => city.name === 'Superior');
assert(superior, 'Superior city data must exist for fail-closed verification.');
const superiorRegistry = getDecisionGuideRegistryEntry(superior);
assert(superiorRegistry, 'Superior registry entry must exist.');
const superiorMarketAeo = buildMarketAeoContract({
  city: superior,
  marketExperience: buildCityMarketExperience(superior, neighborhoods.filter((neighborhood) => neighborhood.city === superior.name).length),
  neighborhoodCount: neighborhoods.filter((neighborhood) => neighborhood.city === superior.name).length,
});
assert(superiorMarketAeo, 'Superior Market AEO contract must exist so fail-closed posture can be inspected.');
assert.equal(superiorMarketAeo.freshness.status, 'AGING', 'Superior must remain AGING.');
assert.equal(superiorMarketAeo.evidenceState, 'EXPLICIT_CONFLICT', 'Superior evidence state must remain EXPLICIT_CONFLICT.');
assert.equal(superiorMarketAeo.conflictState, 'EXPLICIT_CONFLICT', 'Superior conflict state must remain EXPLICIT_CONFLICT.');
assert.equal(superiorMarketAeo.visibleAnswers[0]?.claimEligible, false, 'Superior current-signal claim must remain ineligible.');
assert(!targetSlugs.includes('superior-co-housing-market' as never), 'Superior must remain excluded from guide targets.');

for (const excludedCitySlug of excludedCities) {
  assert(!targetSlugs.includes(excludedCitySlug as never), `${excludedCitySlug} must remain excluded.`);
  assert(!routePaths.some((path) => path.startsWith(`/market/${excludedCitySlug}/guides/`)), `${excludedCitySlug} must not appear in generated guide routes.`);
}

for (const city of cities) {
  if (targetSlugs.includes(city.marketSlug as never)) continue;
  assert(!routePaths.some((path) => path.startsWith(`/market/${city.marketSlug}/guides/`)), `${city.name} must fail closed outside the target allowlist.`);
}

for (const required of [
  'WAVE_2_CITY_ORIENTATION_GUIDE_AUTHORITY_EXPANSION',
  'broomfield-co-housing-market',
  'erie-co-housing-market',
  'westminster-co-housing-market',
  'isCityOrientationGuideTargetCitySlug',
  'isCityOrientationGuideIntentSlug',
]) {
  assert(guideContract.includes(required), `Guide contract must include ${required}.`);
}

for (const required of [
  'getCityOrientationGuideStaticParams',
  'getCityOrientationGuideRoutes',
  'getCityOrientationGuidesForCity',
  'return null',
  'claimEligibility: intent.claimEligibility',
  'structuredDataEligible: true',
  "structuredDataType: 'WebPage'",
  "sourceIdentity: 'David Quinn Group REIE using certified public city-market",
  "countySourceDependency: false",
  "hiddenStateTransfer: false",
  "personalization: false",
  "ranking: false",
  "scoring: false",
  "suitabilityConclusion: false",
  "investmentConclusion: false",
  "protectedClassInference: false",
  "providerActivation: false",
  "destination: 'city-market'",
  "destination: 'search'",
  "destination: 'property'",
  "destination: 'grand-plan'",
  "destination: 'sources'",
  "destination: 'professional-handoff'",
  "href: '/contact#advisory-readiness'",
]) {
  assert(guideHelper.includes(required), `Guide helper must include shared contract behavior: ${required}`);
}

for (const required of [
  'data-testid="city-orientation-guide-page"',
  'data-testid="city-orientation-guide-question"',
  'data-testid="city-orientation-guide-visible-answer"',
  'data-testid="city-orientation-guide-evidence-contract"',
  'data-testid="city-orientation-guide-boundaries"',
  'data-testid="city-orientation-guide-continuity"',
  'data-testid="city-orientation-guide-schema"',
  'data-city-guide-schema-visible-alignment="true"',
  'data-city-guide-county-source-dependency',
  'data-city-guide-hidden-state-transfer',
  'data-city-guide-personalization',
  'data-city-guide-ranking',
  'data-city-guide-scoring',
  'data-city-guide-suitability-conclusion',
  'data-city-guide-investment-conclusion',
  'data-city-guide-protected-class-inference',
  'data-city-guide-provider-activation',
  'mainEntity',
  'guide.intent.customerQuestion',
  'guide.visibleAnswer',
]) {
  assert(routePage.includes(required), `Route page must include marker or schema alignment field: ${required}`);
}

for (const required of [
  'data-city-orientation-guide-wave="wave-2-city-authority"',
  'getCityOrientationGuidesForCity',
  'data-testid="city-orientation-guide-inventory"',
  'data-testid="city-orientation-guide-card"',
  'data-city-orientation-guide-count',
  'data-city-orientation-guide-hidden-state-transfer="false"',
  'data-city-orientation-guide-ranking="false"',
  'data-city-orientation-guide-scoring="false"',
  'data-city-orientation-guide-county-source-dependency="false"',
]) {
  assert(marketPage.includes(required), `Market page must include guide inventory marker: ${required}`);
}

assert.match(sitemap, /getCityOrientationGuideRoutes/, 'Sitemap must enumerate shared city orientation guide routes.');
for (const expectedPath of expectedWave2Paths) {
  assert(routePaths.filter((path) => path === expectedPath).length === 1, `${expectedPath} must appear exactly once in route enumeration.`);
}
assert(!routePaths.some((path) => path.includes('superior-co-housing-market')), 'Sitemap route source must not include Superior guide routes.');
assert.match(packageJson, /check:wave-2-city-orientation-guide-authority-expansion/, 'Package scripts must expose the Wave 2 guide check.');
assert.match(workerConfig, /scripts\/checkWave2CityOrientationGuideAuthorityExpansion\.ts/, 'Worker build must compile the Wave 2 guide check.');

for (const forbidden of [
  'PrismaClient',
  'DATABASE_URL',
  'fetch(',
  'localStorage',
  'sessionStorage',
  'navigator.sendBeacon',
  'best neighborhood',
  'safest',
  'best schools',
  'school-quality conclusion',
  'demographic comparison',
  'protected-class proxy',
  'family-status steering',
  'desirability',
  'suitability score',
  'investment ranking',
  'appreciation forecast',
  'city superiority',
  'best for',
  'property-quality conclusion',
  'property recommendation',
]) {
  assert(!guideHelper.toLowerCase().includes(forbidden.toLowerCase()), `Guide helper must not introduce forbidden behavior or claim: ${forbidden}`);
  assert(!routePage.toLowerCase().includes(forbidden.toLowerCase()), `Guide route must not introduce forbidden behavior or claim: ${forbidden}`);
}

console.log(
  '[wave-2-city-orientation-guide-authority-expansion] ok: Broomfield, Erie, and Westminster add exactly nine guide routes; original five remain intact; Superior and non-target cities fail closed; evidence, freshness, claim eligibility, continuity, sitemap enumeration, schema alignment, and protected boundaries verified.',
);
