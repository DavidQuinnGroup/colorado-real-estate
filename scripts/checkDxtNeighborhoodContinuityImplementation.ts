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

const neighborhoodPage = read('app/market/[city]/[slug]/page.tsx');
const implementationRecord = read(
  'docs/project-atlas/executive-library/REIE-DXT-MARKET-FAMILY-CONTINUITY-IMPLEMENTATION.md',
);
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'data-testid="dxt-neighborhood-continuity-implementation"',
  'data-dxt-market-family-continuity="neighborhood"',
  'data-dxt-market-family-hidden-context="false"',
  'data-dxt-market-family-persistence="false"',
  'data-dxt-market-family-telemetry="false"',
  'data-dxt-market-family-shared-state="false"',
  'data-dxt-market-family-map-provider-change="false"',
  'data-dxt-neighborhood-ranking="false"',
  'data-dxt-neighborhood-suitability="false"',
  'Search owns property inventory',
  'Property owns address evaluation',
  'City Market owns broad context',
  'Advisory owns preparation',
  'does not rank places, determine fit',
  'transfer hidden context into Search, Property, Advisory, or Contact',
  '/contact#advisory-readiness',
]) {
  assertIncludes(neighborhoodPage, phrase, `Neighborhood continuity implementation must include: ${phrase}`);
}

for (const prohibited of ['localStorage', 'sessionStorage', 'document.cookie', 'navigator.sendBeacon']) {
  assertNotIncludes(neighborhoodPage, prohibited, `Neighborhood continuity must not introduce ${prohibited}.`);
}

for (const phrase of [
  'Neighborhood Implementation',
  'Neighborhood owns place orientation',
  'Search remains the inventory path before address-level evaluation',
  'no neighborhood rankings',
  'no suitability conclusions',
]) {
  assertIncludes(implementationRecord, phrase, `Implementation record must include: ${phrase}`);
}

assert.equal(
  packageJson.scripts?.['check:dxt-neighborhood-continuity-implementation'],
  'npm run worker:build && node dist/scripts/checkDxtNeighborhoodContinuityImplementation.js',
  'package.json must register the Neighborhood continuity implementation check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxtNeighborhoodContinuityImplementation.ts',
  'tsconfig.worker.json must include the Neighborhood continuity implementation check.',
);

console.log(
  '[dxt-neighborhood-continuity-implementation] ok: Neighborhood-to-Search/Property continuity, place-orientation boundary, and fair-housing protections verified.',
);
