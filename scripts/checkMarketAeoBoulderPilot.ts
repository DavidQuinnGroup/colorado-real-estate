import assert from 'node:assert/strict';
import fs from 'node:fs';

import { cities } from '../lib/cities.js';
import {
  buildBoulderMarketAeoPilot,
  buildMarketAeoContract,
  MARKET_AEO_BOULDER_PILOT_ROUTE,
  MARKET_AEO_BOULDER_PILOT_SOURCE_ID,
  MARKET_AEO_BOULDER_PILOT_STATUS,
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
const chatStart = read('docs/CHAT_START.md');

assert.equal(MARKET_AEO_BOULDER_PILOT_STATUS, 'REIE_MARKET_AEO_BOULDER_PILOT_IMPLEMENTED');
assert.equal(MARKET_AEO_BOULDER_PILOT_ROUTE, 'boulder-co-housing-market');
assert.equal(MARKET_AEO_BOULDER_PILOT_SOURCE_ID, 'REIE_GOVERNED_CITY_MARKET_CONTEXT');

const boulder = cities.find((city) => city.marketSlug === MARKET_AEO_BOULDER_PILOT_ROUTE);
assert(boulder, 'Boulder city-market data must exist.');
const boulderNeighborhoodCount = neighborhoods.filter((neighborhood) => neighborhood.city === 'Boulder').length;
const boulderExperience = buildCityMarketExperience(boulder, boulderNeighborhoodCount);
const pilot = buildBoulderMarketAeoPilot({
  city: boulder,
  marketExperience: boulderExperience,
  neighborhoodCount: boulderNeighborhoodCount,
});

assert(pilot, 'Boulder route must build a Market/AEO contract.');
assert.equal(pilot.status, MARKET_AEO_BOULDER_PILOT_STATUS);
assert.equal(pilot.geography.city, 'Boulder');
assert.equal(pilot.geography.scope, 'city-market');
assert.equal(pilot.freshness.status, 'CURRENT');
assert.equal(pilot.visibleAnswers.length, 3);
assert.equal(pilot.structuredDataFaqs.length, pilot.visibleAnswers.length);
assert.equal(pilot.visibleAnswers.filter((answer) => answer.claimEligible).length, 2);
assert.equal(pilot.visibleAnswers.filter((answer) => !answer.claimEligible).length, 1);
assert.match(pilot.marketPeriod, /Current published REIE Boulder city-market briefing/);
assert.match(pilot.limitations.join(' '), /not a live feed/i);
assert.match(pilot.limitations.join(' '), /does not predict/i);

const nonBoulderAuthorizedRoutes = new Set([
  'louisville-co-housing-market',
  'lafayette-co-housing-market',
  'denver-co-housing-market',
  'longmont-co-housing-market',
  'broomfield-co-housing-market',
  'superior-co-housing-market',
  'erie-co-housing-market',
  'westminster-co-housing-market',
]);

for (const city of cities.filter((candidate) => candidate.marketSlug !== MARKET_AEO_BOULDER_PILOT_ROUTE)) {
  const cityNeighborhoodCount = neighborhoods.filter((neighborhood) => neighborhood.city === city.name).length;
  const experience = buildCityMarketExperience(city, cityNeighborhoodCount);
  const contract = buildMarketAeoContract({ city, marketExperience: experience, neighborhoodCount: cityNeighborhoodCount });
  assert.equal(
    Boolean(contract),
    nonBoulderAuthorizedRoutes.has(city.marketSlug),
    `${city.name} Market/AEO contract eligibility must match the authorized non-Boulder allowlist.`,
  );
}

for (const required of [
  'buildMarketAeoContract',
  'marketAeoPilot?.structuredDataFaqs ?? cityFaqs',
  'data-testid={marketAeoPilot.route ===',
  'data-market-aeo-contract="multi-city"',
  'data-market-aeo-source-id={marketAeoPilot.source.id}',
  'data-market-aeo-market-period={marketAeoPilot.marketPeriod}',
  'data-market-aeo-freshness={marketAeoPilot.freshness.status}',
  'data-market-aeo-schema-visible-alignment="true"',
  'data-market-aeo-provider-activation="false"',
  'data-market-aeo-boulder-county-open-data="false"',
  'data-market-aeo-address-points="false"',
  'data-market-aeo-park-boundaries="false"',
  'data-market-aeo-api-change="false"',
  'data-market-aeo-persistence="false"',
  'data-market-aeo-telemetry="false"',
  'data-market-aeo-ai="false"',
  'boulder-market-aeo-limitations',
]) {
  assertIncludes(cityMarketPage, required, `City market page must include ${required}.`);
}

for (const required of [
  'SOURCE -> GEOGRAPHY -> MARKET PERIOD -> FRESHNESS -> LIMITATION -> CLAIM ELIGIBILITY -> VISIBLE ANSWER -> STRUCTURED DATA',
  'REIE_MARKET_AEO_BOULDER_PILOT_PRODUCTION_CERTIFIED',
  'READY_FOR_REIE_MARKET_AEO_MULTI_CITY_WAVE_PUSH_AUTHORIZATION',
]) {
  assertIncludes(chatStart, required, `CHAT_START must preserve governance marker ${required}.`);
}

assert.equal(
  packageJson.scripts?.['check:market-aeo-boulder-pilot'],
  'npm run worker:build && node dist/scripts/checkMarketAeoBoulderPilot.js',
  'package.json must preserve Boulder Market/AEO validation.',
);
assert.equal(
  packageJson.scripts?.['check:market-aeo-multi-city-wave'],
  'npm run worker:build && node dist/scripts/checkMarketAeoMultiCityWave.js',
  'package.json must expose multi-city Market/AEO wave validation.',
);
assertIncludes(tsconfig, 'scripts/checkMarketAeoBoulderPilot.ts', 'Worker build must compile Boulder Market/AEO validation.');
assertIncludes(tsconfig, 'scripts/checkMarketAeoMultiCityWave.ts', 'Worker build must compile multi-city Market/AEO validation.');

for (const forbidden of [
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
  assertNotIncludes(helper, forbidden, `Pilot helper must not include unauthorized capability or source: ${forbidden}`);
}

console.log('[market-aeo-boulder-pilot] ok: Boulder source, geography, period, freshness, limits, claim eligibility, visible answers, structured data, and protected boundaries verified.');
