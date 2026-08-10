import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  buildCityOrientationGuidePath,
  CITY_ORIENTATION_GUIDE_INTENT_SLUGS,
  CITY_ORIENTATION_GUIDE_TARGET_CITY_SLUGS,
} from '../lib/cityOrientationGuideContract.js';
import { cities } from '../lib/cities.js';

function read(filePath: string) {
  return fs.readFileSync(filePath, 'utf8');
}

const routePage = read('app/market/[city]/guides/[slug]/page.tsx');
const marketPage = read('app/market/[city]/page.tsx');
const sitemap = read('app/sitemap.ts');
const packageJson = read('package.json');
const workerConfig = read('tsconfig.worker.json');
const guideHelper = read('lib/cityOrientationGuides.ts');

assert.deepEqual([...CITY_ORIENTATION_GUIDE_TARGET_CITY_SLUGS], [
  'boulder-co-housing-market',
  'denver-co-housing-market',
  'louisville-co-housing-market',
  'lafayette-co-housing-market',
  'longmont-co-housing-market',
]);

assert.deepEqual([...CITY_ORIENTATION_GUIDE_INTENT_SLUGS], [
  'orienting-before-search',
  'reading-market-context',
  'place-questions-to-property-verification',
]);

const targetCities = cities.filter((city) => CITY_ORIENTATION_GUIDE_TARGET_CITY_SLUGS.includes(city.marketSlug as never));
assert.equal(targetCities.length, 5, 'Exactly five target cities must be exposed.');
assert.deepEqual(targetCities.map((city) => city.name).sort(), ['Boulder', 'Denver', 'Lafayette', 'Longmont', 'Louisville']);

const guideRoutes = CITY_ORIENTATION_GUIDE_TARGET_CITY_SLUGS.flatMap((citySlug) =>
  CITY_ORIENTATION_GUIDE_INTENT_SLUGS.map((guideSlug) => ({
    citySlug,
    guideSlug,
    canonicalPath: buildCityOrientationGuidePath(citySlug, guideSlug),
  })),
);
assert.equal(guideRoutes.length, 15, 'Exactly 15 intended guide routes must be generated.');
assert.match(guideHelper, /getCityOrientationGuideStaticParams/, 'Static params helper must be present.');

for (const citySlug of CITY_ORIENTATION_GUIDE_TARGET_CITY_SLUGS) {
  const city = cities.find((candidate) => candidate.marketSlug === citySlug);
  assert(city, `${citySlug} city data must exist.`);

  for (const guideSlug of CITY_ORIENTATION_GUIDE_INTENT_SLUGS) {
    const expectedPath = buildCityOrientationGuidePath(citySlug, guideSlug);
    assert.equal(expectedPath, `/market/${citySlug}/guides/${guideSlug}`, `${expectedPath} must be canonical.`);
    assert.match(guideHelper, new RegExp(guideSlug), `${guideSlug} must be implemented by the guide helper.`);

    if (guideSlug === 'reading-market-context') {
      assert.match(guideHelper, /PERIODIC_MARKET_EVIDENCE/, 'Reading market context must use periodic market evidence freshness.');
      assert.match(guideHelper, /not a live feed/i, 'Reading market context must retain live-feed limitation.');
    } else {
      assert.match(guideHelper, /DURABLE_ORIENTATION/, 'Durable guide intents must use durable orientation freshness.');
    }
  }
}

for (const invalidCity of ['broomfield-co-housing-market', 'superior-co-housing-market', 'niwot-co-housing-market']) {
  assert(!CITY_ORIENTATION_GUIDE_TARGET_CITY_SLUGS.includes(invalidCity as never), `${invalidCity} must remain outside the target allowlist.`);
}

assert(!CITY_ORIENTATION_GUIDE_INTENT_SLUGS.includes('best-neighborhoods' as never), 'Invalid guide slug must fail closed.');
assert.match(guideHelper, /return null/, 'Guide lookup must fail closed for non-target city or invalid guide slug.');

for (const required of [
  'data-testid="city-orientation-guide-page"',
  'data-testid="city-orientation-guide-visible-answer"',
  'data-testid="city-orientation-guide-evidence-contract"',
  'data-testid="city-orientation-guide-boundaries"',
  'data-testid="city-orientation-guide-continuity"',
  'data-testid="city-orientation-guide-schema"',
  'data-city-guide-schema-visible-alignment="true"',
  'data-city-guide-county-source-dependency',
  'data-city-guide-hidden-state-transfer',
  'data-city-guide-ranking',
  'data-city-guide-scoring',
  'data-city-guide-suitability-conclusion',
  'data-city-guide-investment-conclusion',
  'data-city-guide-protected-class-inference',
  'County Assessor and county GIS evidence are not active here',
]) {
  assert(routePage.includes(required), `Route page must include marker or copy: ${required}`);
}

for (const required of [
  'getCityOrientationGuidesForCity',
  'data-testid="city-orientation-guide-inventory"',
  'data-testid="city-orientation-guide-card"',
  'data-city-orientation-guide-count',
  'data-city-orientation-guide-county-source-dependency="false"',
]) {
  assert(marketPage.includes(required), `Market page must expose guide inventory marker: ${required}`);
}

assert.match(sitemap, /getCityOrientationGuideRoutes/, 'Sitemap must include city orientation guide routes.');
assert.match(packageJson, /check:five-city-decision-guide-authority-wave/, 'Package scripts must expose this check.');
assert.match(workerConfig, /scripts\/checkFiveCityDecisionGuideAuthorityWave\.ts/, 'Worker build must compile this check.');

for (const forbidden of [
  'PrismaClient',
  'DATABASE_URL',
  'fetch(',
  'localStorage',
  'sessionStorage',
  'navigator.sendBeacon',
  'best neighborhood',
  'safest',
  'school ranking',
  'crime ranking',
  'investment winner',
  'appreciation prediction',
  'automated recommendation',
  'suitability score',
]) {
  assert(!guideHelper.toLowerCase().includes(forbidden.toLowerCase()), `Guide helper must not introduce forbidden behavior or claim: ${forbidden}`);
  assert(!routePage.toLowerCase().includes(forbidden.toLowerCase()), `Guide route must not introduce forbidden behavior or claim: ${forbidden}`);
}

console.log(
  '[five-city-decision-guide-authority-wave] ok: five-city allowlist, three guide intents, 15 routes, canonical paths, non-target containment, evidence/freshness/limitation contracts, schema-visible alignment, continuity links, and protected boundaries verified.',
);
