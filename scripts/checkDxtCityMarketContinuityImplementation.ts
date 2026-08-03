import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

function assertNotIncludes(source: string, value: string, message: string): void {
  assert(!source.includes(value), message);
}

const cityMarketPage = read('app/market/[city]/page.tsx');
const implementationRecord = read(
  'docs/project-atlas/executive-library/REIE-DXT-MARKET-FAMILY-CONTINUITY-IMPLEMENTATION.md',
);
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'data-testid="dxt-city-market-continuity-implementation"',
  'data-dxt-market-family-continuity="city-market"',
  'data-dxt-market-family-hidden-context="false"',
  'data-dxt-market-family-persistence="false"',
  'data-dxt-market-family-telemetry="false"',
  'data-dxt-market-family-shared-state="false"',
  'data-dxt-market-family-map-provider-change="false"',
  'data-dxt-city-market-neighborhood-ranking="false"',
  'Search owns inventory',
  'Neighborhood owns place',
  'Property owns address facts',
  'Advisory owns preparation',
  'This city briefing explains the city-level signal. It does not rank neighborhoods, predict appreciation, or decide',
  '/contact#advisory-readiness',
]) {
  assertIncludes(cityMarketPage, phrase, `City Market continuity implementation must include: ${phrase}`);
}

for (const prohibited of ['localStorage', 'sessionStorage', 'document.cookie', 'navigator.sendBeacon']) {
  assertNotIncludes(cityMarketPage, prohibited, `City Market continuity must not introduce ${prohibited}.`);
}

for (const phrase of [
  'City Market Implementation',
  'City Market owns city-level evidence',
  'Neighborhood remains the place-orientation path',
  'Property remains address-level evaluation after Search inventory selection',
]) {
  assertIncludes(implementationRecord, phrase, `Implementation record must include: ${phrase}`);
}

assert.equal(
  packageJson.scripts?.['check:dxt-city-market-continuity-implementation'],
  'npm run worker:build && node dist/scripts/checkDxtCityMarketContinuityImplementation.js',
  'package.json must register the City Market continuity implementation check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxtCityMarketContinuityImplementation.ts',
  'tsconfig.worker.json must include the City Market continuity implementation check.',
);

console.log(
  '[dxt-city-market-continuity-implementation] ok: City Market route ownership, neighborhood handoff, Search/Property boundary, and protected boundaries verified.',
);
