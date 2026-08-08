import assert from 'node:assert/strict';
import fs from 'node:fs';

import { cities } from '../lib/cities.js';
import { getDecisionGuideRegistryEntry } from '../lib/coloradoDecisionGuideRegistry.js';
import {
  buildMarketAeoContract,
  MARKET_AEO_MULTI_CITY_AUTHORIZED_ROUTES,
  MARKET_AEO_WAVE_1_ROUTES,
  MARKET_AEO_WAVE_2_ROUTES,
  MARKET_AEO_WAVE_2_STATUS,
} from '../lib/marketAeoPilot.js';
import { buildCityMarketExperience } from '../lib/marketIntelligenceExperience.js';
import { neighborhoods } from '../lib/neighborhoods.js';

function read(filePath: string) {
  return fs.readFileSync(filePath, 'utf8');
}

const helper = read('lib/marketAeoPilot.ts');
const cityMarketPage = read('app/market/[city]/page.tsx');

const expectedNineCityAllowlist = [
  ...MARKET_AEO_WAVE_1_ROUTES,
  ...MARKET_AEO_WAVE_2_ROUTES,
];

assert.deepEqual(
  [...MARKET_AEO_MULTI_CITY_AUTHORIZED_ROUTES],
  expectedNineCityAllowlist,
  'Market/AEO allowlist must contain exactly the five Wave 1 routes plus four Wave 2 routes.',
);

assert.deepEqual([...MARKET_AEO_WAVE_2_ROUTES], [
  'broomfield-co-housing-market',
  'superior-co-housing-market',
  'erie-co-housing-market',
  'westminster-co-housing-market',
]);

for (const cityName of ['Broomfield', 'Superior', 'Erie', 'Westminster'] as const) {
  const city = cities.find((candidate) => candidate.name === cityName);
  assert(city, `${cityName} city data must exist.`);

  const registryEntry = getDecisionGuideRegistryEntry(city);
  assert(registryEntry, `${cityName} registry entry must exist.`);
  assert.equal(registryEntry.guideMaturity, 'ENHANCED_FOUNDATION', `${cityName} must remain enhanced foundation.`);
  assert.equal(registryEntry.publicEligibility, true, `${cityName} must remain public eligible.`);
  assert.equal(registryEntry.marketRoute, `/market/${city.marketSlug}`, `${cityName} market route must remain canonical.`);

  const cityNeighborhoods = neighborhoods.filter((neighborhood) => neighborhood.city === city.name);
  const contract = buildMarketAeoContract({
    city,
    marketExperience: buildCityMarketExperience(city, cityNeighborhoods.length),
    neighborhoodCount: cityNeighborhoods.length,
  });

  assert(contract, `${cityName} must build a Wave 2 Market/AEO contract.`);
  assert.equal(contract.status, MARKET_AEO_WAVE_2_STATUS, `${cityName} must carry the Wave 2 status.`);
  assert.equal(contract.route, city.marketSlug);
  assert.equal(contract.geography.city, cityName);
  assert.equal(contract.structuredDataFaqs.length, contract.visibleAnswers.length);
  assert.deepEqual(
    contract.structuredDataFaqs,
    contract.visibleAnswers.map(({ question, answer }) => ({ question, answer })),
    `${cityName} structured FAQ data must mirror visible answers exactly.`,
  );
  assert.match(contract.limitations.join(' '), /not a live feed/i, `${cityName} must retain freshness limitation.`);
  assert.match(contract.limitations.join(' '), /does not predict/i, `${cityName} must retain prediction boundary.`);
  assert.match(contract.limitations.join(' '), /advisor review still require verification/i, `${cityName} must retain advisor verification boundary.`);
}

const broomfield = buildContract('Broomfield');
assert.equal(broomfield.freshness.status, 'CURRENT');
assert.equal(broomfield.evidenceState, 'CURRENT');
assert.equal(broomfield.conflictState, 'NONE');
assert.match(broomfield.source.label, /source\/freshness qualification and limitation-bound claims/);
assert.match(broomfield.limitations.join(' '), /source completeness is not treated as evidence-complete/i);
assert.match(broomfield.limitations.join(' '), /Older foundation fields are not promoted/i);

const superior = buildContract('Superior');
assert.equal(superior.freshness.status, 'AGING');
assert.equal(superior.evidenceState, 'EXPLICIT_CONFLICT');
assert.equal(superior.conflictState, 'EXPLICIT_CONFLICT');
assert.equal(superior.visibleAnswers.filter((answer) => answer.claimEligible).length, 1);
assert.equal(superior.visibleAnswers.filter((answer) => !answer.claimEligible).length, 2);
assert.match(superior.marketPeriod, /Aging\/conflict-bounded/);
assert.match(superior.visibleAnswers.map((answer) => answer.answer).join(' '), /current certainty is not asserted/i);
assert.match(superior.limitations.join(' '), /Rebuilding, hazard, insurance, environmental, structural, drainage, soil, and property-condition/i);
assert.match(superior.limitations.join(' '), /not converted into safety, suitability, desirability, prediction, or property-specific claims/i);

for (const cityName of ['Erie', 'Westminster'] as const) {
  const contract = buildContract(cityName);
  assert.equal(contract.freshness.status, 'CURRENT');
  assert.equal(contract.evidenceState, 'CURRENT');
  assert.equal(contract.conflictState, 'NONE');
  assert.match(contract.source.label, /additive city-market answer contract preserving existing local decision context/);
}

for (const forbiddenRoute of [
  'niwot-co-housing-market',
  'gunbarrel-co-housing-market',
  'thornton-co-housing-market',
  'brighton-co-housing-market',
  'firestone-co-housing-market',
  'frederick-co-housing-market',
]) {
  assert(!MARKET_AEO_MULTI_CITY_AUTHORIZED_ROUTES.includes(forbiddenRoute as never), `${forbiddenRoute} must remain excluded.`);
  const city = cities.find((candidate) => candidate.marketSlug === forbiddenRoute);
  if (city) {
    assert.equal(buildMarketAeoContract({
      city,
      marketExperience: buildCityMarketExperience(city, neighborhoods.filter((neighborhood) => neighborhood.city === city.name).length),
      neighborhoodCount: neighborhoods.filter((neighborhood) => neighborhood.city === city.name).length,
    }), null, `${forbiddenRoute} must fail closed.`);
  }
}

for (const required of [
  'data-market-aeo-contract="multi-city"',
  'data-market-aeo-schema-visible-alignment="true"',
  'data-market-aeo-evidence-state',
  'data-market-aeo-conflict-state',
  'data-market-aeo-provider-activation="false"',
  'data-market-aeo-boulder-county-open-data="false"',
  'data-market-aeo-address-points="false"',
  'data-market-aeo-park-boundaries="false"',
  'data-market-aeo-api-change="false"',
  'data-market-aeo-persistence="false"',
  'data-market-aeo-telemetry="false"',
  'data-market-aeo-ai="false"',
]) {
  assert(`${helper}\n${cityMarketPage}`.includes(required), `Expected Wave 2 marker: ${required}`);
}

for (const forbidden of [
  'fetch(',
  'localStorage',
  'DATABASE_URL',
  'PrismaClient',
]) {
  assert(!helper.includes(forbidden), `Wave 2 helper must not introduce protected runtime behavior: ${forbidden}`);
}

function buildContract(cityName: 'Broomfield' | 'Superior' | 'Erie' | 'Westminster') {
  const city = cities.find((candidate) => candidate.name === cityName);
  assert(city, `${cityName} city data must exist.`);
  const cityNeighborhoods = neighborhoods.filter((neighborhood) => neighborhood.city === city.name);
  const contract = buildMarketAeoContract({
    city,
    marketExperience: buildCityMarketExperience(city, cityNeighborhoods.length),
    neighborhoodCount: cityNeighborhoods.length,
  });
  assert(contract, `${cityName} must build a contract.`);
  return contract;
}

console.log('[market-aeo-wave-2] ok: Broomfield, Superior, Erie, Westminster contracts, Superior fail-closed behavior, nine-city allowlist, schema alignment, non-target containment, and protected boundaries verified.');
