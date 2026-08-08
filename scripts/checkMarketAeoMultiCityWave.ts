import assert from 'node:assert/strict';
import fs from 'node:fs';

import { cities } from '../lib/cities.js';
import {
  buildMarketAeoContract,
  isMarketAeoAuthorizedRoute,
  MARKET_AEO_BOULDER_PILOT_ROUTE,
  MARKET_AEO_BOULDER_PILOT_STATUS,
  MARKET_AEO_MULTI_CITY_AUTHORIZED_ROUTES,
  MARKET_AEO_MULTI_CITY_SOURCE_ID,
  MARKET_AEO_MULTI_CITY_WAVE_STATUS,
} from '../lib/marketAeoPilot.js';
import { buildCityMarketExperience } from '../lib/marketIntelligenceExperience.js';
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

const helper = read('lib/marketAeoPilot.ts');
const cityMarketPage = read('app/market/[city]/page.tsx');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfig = read('tsconfig.worker.json');

const expectedRoutes = [
  'boulder-co-housing-market',
  'louisville-co-housing-market',
  'lafayette-co-housing-market',
  'denver-co-housing-market',
  'longmont-co-housing-market',
];
assert.deepEqual([...MARKET_AEO_MULTI_CITY_AUTHORIZED_ROUTES], expectedRoutes);

const excludedRoutes = [
  'erie-co-housing-market',
  'westminster-co-housing-market',
  'broomfield-co-housing-market',
  'superior-co-housing-market',
  'niwot-co-housing-market',
  'gunbarrel-co-housing-market',
  'thornton-co-housing-market',
  'brighton-co-housing-market',
  'firestone-co-housing-market',
  'frederick-co-housing-market',
];

for (const city of cities) {
  const neighborhoodCount = neighborhoods.filter((neighborhood) => neighborhood.city === city.name).length;
  const marketExperience = buildCityMarketExperience(city, neighborhoodCount);
  const contract = buildMarketAeoContract({ city, marketExperience, neighborhoodCount });

  if (expectedRoutes.includes(city.marketSlug)) {
    assert(contract, `${city.name} must build an authorized Market/AEO contract.`);
    assert.equal(contract.route, city.marketSlug);
    assert.equal(contract.geography.city, city.name);
    assert.equal(contract.geography.state, 'Colorado');
    assert.equal(contract.geography.scope, 'city-market');
    assert.equal(contract.freshness.status, 'CURRENT');
    assert.equal(contract.visibleAnswers.length, 3);
    assert.equal(contract.structuredDataFaqs.length, contract.visibleAnswers.length);
    assert.equal(contract.visibleAnswers.filter((answer) => answer.claimEligible).length, 2);
    assert.equal(contract.visibleAnswers.filter((answer) => !answer.claimEligible).length, 1);
    assert.match(contract.marketPeriod, new RegExp(`Current published REIE ${city.name} city-market briefing`));
    assert.match(contract.source.label, /Existing REIE governed city-market data/);
    assert.match(contract.source.label, /Qualification:/);
    assert.match(contract.limitations.join(' '), /not a live feed/i);
    assert.match(contract.limitations.join(' '), /does not predict/i);
    assert.match(contract.limitations.join(' '), /advisor review still require verification/i);
    assert.deepEqual(
      contract.structuredDataFaqs,
      contract.visibleAnswers.map(({ question, answer }) => ({ question, answer })),
      `${city.name} FAQ schema must mirror visible answers exactly.`,
    );
    if (city.marketSlug === MARKET_AEO_BOULDER_PILOT_ROUTE) {
      assert.equal(contract.status, MARKET_AEO_BOULDER_PILOT_STATUS, 'Boulder must preserve the certified status marker.');
    } else {
      assert.equal(contract.status, MARKET_AEO_MULTI_CITY_WAVE_STATUS);
      assert.equal(contract.source.id, MARKET_AEO_MULTI_CITY_SOURCE_ID);
    }
  } else {
    assert.equal(contract, null, `${city.name} must fail closed outside the authorized Market/AEO wave.`);
  }
}

for (const route of expectedRoutes) {
  assert(isMarketAeoAuthorizedRoute(route), `${route} must be recognized by the explicit allowlist.`);
}
for (const route of excludedRoutes) {
  assert(!isMarketAeoAuthorizedRoute(route), `${route} must remain excluded from the Market/AEO wave.`);
}

for (const required of [
  'MARKET_AEO_MULTI_CITY_AUTHORIZED_ROUTES',
  'louisville-co-housing-market',
  'lafayette-co-housing-market',
  'denver-co-housing-market',
  'longmont-co-housing-market',
  'focused source/freshness qualification',
  'explicit freshness limitation',
  'data-market-aeo-contract="multi-city"',
  'data-market-aeo-schema-visible-alignment="true"',
  'data-market-aeo-provider-activation="false"',
  'data-market-aeo-boulder-county-open-data="false"',
  'data-market-aeo-address-points="false"',
  'data-market-aeo-park-boundaries="false"',
  'data-market-aeo-api-change="false"',
  'data-market-aeo-persistence="false"',
  'data-market-aeo-telemetry="false"',
  'data-market-aeo-ai="false"',
]) {
  assertIncludes(`${helper}\n${cityMarketPage}`, required, `Expected multi-city Market/AEO implementation marker: ${required}`);
}

for (const forbidden of [
  'BCOD',
  'Address Points',
  'Park Boundaries',
  'provider API',
  'scrape',
  'Prisma',
  'DATABASE_URL',
  'fetch(',
  'localStorage',
  'telemetry',
  'CRM',
]) {
  assertNotIncludes(helper, forbidden, `Market/AEO contract must not include unauthorized capability or source: ${forbidden}`);
}

assert.equal(
  packageJson.scripts?.['check:market-aeo-multi-city-wave'],
  'npm run worker:build && node dist/scripts/checkMarketAeoMultiCityWave.js',
  'package.json must expose multi-city Market/AEO wave validation.',
);
assertIncludes(tsconfig, 'scripts/checkMarketAeoMultiCityWave.ts', 'Worker build must compile multi-city Market/AEO validation.');

console.log('[market-aeo-multi-city-wave] ok: Boulder, Louisville, Lafayette, Denver, Longmont contracts, allowlist containment, schema alignment, and protected boundaries verified.');
