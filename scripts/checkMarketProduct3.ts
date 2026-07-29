import assert from 'node:assert/strict';
import fs from 'node:fs';

import { cities } from '../lib/cities.js';
import { getPublicDecisionGuideRegistryEntries } from '../lib/coloradoDecisionGuideRegistry.js';
import { buildCityMarketExperience } from '../lib/marketIntelligenceExperience.js';
import {
  buildCityMarketProduct3Experience,
  buildStateMarketProduct3Experience,
  MARKET_PRODUCT_3_AUTHORIZED_CITY_SLUGS,
  MARKET_PRODUCT_3_STATUS,
} from '../lib/marketProduct3.js';
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

const helper = read('lib/marketProduct3.ts');
const component = read('components/MarketProduct3VisualIntelligence.tsx');
const marketIndex = read('app/market/page.tsx');
const cityMarketPage = read('app/market/[city]/page.tsx');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfig = read('tsconfig.worker.json');

assert.equal(MARKET_PRODUCT_3_STATUS, 'MARKET_PRODUCT_3_VIS_ACTIVATION_COMPLETE');
assert.deepEqual([...MARKET_PRODUCT_3_AUTHORIZED_CITY_SLUGS].sort(), [
  'boulder-co-housing-market',
  'lafayette-co-housing-market',
  'louisville-co-housing-market',
]);

const certifiedGuides = getPublicDecisionGuideRegistryEntries()
  .filter((entry) => entry.guideMaturity === 'EDITORIALLY_CERTIFIED' && entry.optionalEditorialOverride)
  .map((entry) => entry.canonicalName)
  .sort();
assert.deepEqual(certifiedGuides, ['Boulder', 'Lafayette', 'Louisville'], 'Public certified guide promotion must remain bounded.');

const marketSummaries = cities.map((city) => ({
  city,
  neighborhoodCount: neighborhoods.filter((neighborhood) => neighborhood.city.toLowerCase() === city.name.toLowerCase()).length,
  experience: buildCityMarketExperience(
    city,
    neighborhoods.filter((neighborhood) => neighborhood.city.toLowerCase() === city.name.toLowerCase()).length,
  ),
}));

const certifiedCities = marketSummaries.filter((summary) => MARKET_PRODUCT_3_AUTHORIZED_CITY_SLUGS.includes(summary.city.marketSlug as any));
assert.equal(certifiedCities.length, 3, 'Market Product 3 must activate rich interpretation for three certified city guides.');

for (const summary of certifiedCities) {
  const experience = buildCityMarketProduct3Experience({
    city: summary.city,
    marketExperience: summary.experience,
    neighborhoodCount: summary.neighborhoodCount,
  });
  assert.equal(experience.evidenceState, 'complete', `${summary.city.name} must expose complete public VIS evidence.`);
  assert.equal(experience.authorizedRichInterpretation, true, `${summary.city.name} must be authorized for rich interpretation.`);
  assert.equal(experience.pulseFactors.length, 4, `${summary.city.name} must expose four Market Pulse factors.`);
  assert.match(experience.whatChanged, /does not claim/i, `${summary.city.name} must avoid period-over-period claims.`);
  assert.match(experience.confidenceLayer.limitations, /No AI, forecasting, valuation model, provider GIS, customer telemetry/i);
}

const foundationCity = marketSummaries.find((summary) => summary.city.marketSlug === 'broomfield-co-housing-market');
assert(foundationCity, 'Broomfield foundation city must be available for sparse-state validation.');
const sparseExperience = buildCityMarketProduct3Experience({
  city: foundationCity.city,
  marketExperience: foundationCity.experience,
  neighborhoodCount: foundationCity.neighborhoodCount,
});
assert.equal(sparseExperience.evidenceState, 'sparse', 'Foundation city must remain sparse, not complete.');
assert.equal(sparseExperience.authorizedRichInterpretation, false, 'Foundation city must not expose rich public VIS interpretation.');
assert.match(sparseExperience.whyItMatters, /bounded/i, 'Sparse state must communicate bounded interpretation.');

const stateExperience = buildStateMarketProduct3Experience({
  cityCount: cities.length,
  neighborhoodCount: neighborhoods.length,
  certifiedGuideCount: certifiedGuides.length,
  primaryCondition: 'Strong seller pressure',
  primaryPricing: '$1M median / $600 per sq ft',
});
assert.equal(stateExperience.scope, 'state');
assert.equal(stateExperience.evidenceState, 'complete');
assert.equal(stateExperience.pulseFactors.length, 4);

for (const source of [marketIndex, cityMarketPage]) {
  assertIncludes(source, 'MarketProduct3VisualIntelligence', 'Market routes must compose the public Market Product 3 component.');
}

assertIncludes(marketIndex, 'buildStateMarketProduct3Experience', 'Market index must compose state Market Product 3 experience.');
assertIncludes(cityMarketPage, 'buildCityMarketProduct3Experience', 'City pages must compose city Market Product 3 experience.');

for (const required of [
  'data-testid="market-product-3-visual-intelligence"',
  'data-testid="market-product-3-market-pulse"',
  'data-testid="market-product-3-confidence-layer"',
  'data-testid="market-product-3-report-composition"',
  'data-testid="market-product-3-accessible-data"',
  'data-market-product-3-public-vis="true"',
  'data-market-product-3-fixture="false"',
  'data-market-product-3-ai="false"',
  'data-market-product-3-gis="false"',
  'data-market-product-3-telemetry="false"',
  'data-market-product-3-forecasting="false"',
  'data-market-product-3-provider-activation="false"',
  '<table>',
  '<details',
  '<summary>',
]) {
  assertIncludes(component, required, `Market Product 3 component must include ${required}.`);
}

assertIncludes(helper, "'sparse'", 'Market Product 3 must define sparse state.');
assertIncludes(helper, "'missing'", 'Market Product 3 must define missing state.');
assertIncludes(helper, "'conflict'", 'Market Product 3 must define conflict state.');
assertIncludes(helper, 'does not include period-over-period movement', 'Market Product 3 must avoid unsupported movement claims.');

for (const forbidden of [
  'OpenAI',
  'chatbot',
  'recommendation engine',
  'mortgage calculator',
  'preferred lender',
  'pre-approved',
  'school ranking',
  'crime',
  'safest',
  'guarantee',
  'will appreciate',
  'forecast appreciation',
  'Boulder County Open Data',
  'NON_PRODUCTION_FIXTURE',
]) {
  assertNotIncludes([helper, component, marketIndex, cityMarketPage].join('\n'), forbidden, `Unauthorized copy or capability leaked: ${forbidden}`);
}

assert.equal(
  packageJson.scripts?.['check:market-product-3'],
  'npm run worker:build && node dist/scripts/checkMarketProduct3.js',
  'package.json must expose Market Product 3 validation.',
);
assertIncludes(tsconfig, 'scripts/checkMarketProduct3.ts', 'Worker build must include Market Product 3 validation script.');

for (const doc of [
  'docs/project-atlas/executive-library/MARKET-PRODUCT-3-STAGE-A-PRODUCTION-CERTIFICATION.md',
  'docs/project-atlas/executive-library/MARKET-PRODUCT-3-VIS-IMPLEMENTATION.md',
  'docs/project-atlas/executive-library/MARKET-PULSE-PUBLIC-SPECIFICATION.md',
  'docs/project-atlas/executive-library/CONFIDENCE-LAYER-PUBLIC-SPECIFICATION.md',
  'docs/project-atlas/executive-library/MARKET-REPORT-COMPOSITION-PUBLIC-SPECIFICATION.md',
  'docs/project-atlas/executive-library/MARKET-PRODUCT-3-RESPONSIVE-ACCESSIBILITY-REVIEW.md',
  'docs/project-atlas/executive-library/MARKET-PRODUCT-3-DECISION-EXPERIENCE-INDEX.md',
  'docs/project-atlas/executive-library/MARKET-PRODUCT-3-FUTURE-VIS-ADOPTION-FINDINGS.md',
]) {
  const contents = read(doc);
  assertIncludes(contents, 'Market Product 3.0', `${doc} must document Market Product 3.0.`);
  assertIncludes(contents, 'No AI', `${doc} must preserve no-AI boundary.`);
  assertIncludes(contents, 'No public GIS', `${doc} must preserve no-public-GIS boundary.`);
}

console.log('[market-product-3] ok: public Market VIS activation, sparse-state gating, trust boundaries, docs, and route composition verified.');
