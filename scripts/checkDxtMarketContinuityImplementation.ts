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

const marketPage = read('app/market/page.tsx');
const implementationRecord = read(
  'docs/project-atlas/executive-library/REIE-DXT-MARKET-FAMILY-CONTINUITY-IMPLEMENTATION.md',
);
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'data-testid="dxt-market-index-continuity-implementation"',
  'data-dxt-market-family-continuity="market-index"',
  'data-dxt-market-family-hidden-context="false"',
  'data-dxt-market-family-persistence="false"',
  'data-dxt-market-family-telemetry="false"',
  'data-dxt-market-family-shared-state="false"',
  'data-dxt-market-family-map-provider-change="false"',
  'Market owns broad briefing context. City Market owns city-level evidence. Neighborhood owns place orientation.',
  'Search owns active property inventory, and Property owns address-level evaluation.',
  'Search With Market Context',
  'Open Boulder Market',
  'Open Neighborhood Context',
  'Prepare Advisory Questions',
  '/contact#advisory-readiness',
]) {
  assertIncludes(marketPage, phrase, `Market index continuity implementation must include: ${phrase}`);
}

for (const prohibited of ['localStorage', 'sessionStorage', 'document.cookie', 'navigator.sendBeacon']) {
  assertNotIncludes(marketPage, prohibited, `Market index continuity must not introduce ${prohibited}.`);
}

for (const phrase of [
  'Status: `MARKET_FAMILY_CONTINUITY_IMPLEMENTED_LOCAL`',
  'Market Index Implementation',
  'Runtime scope: `app/market/page.tsx`, `app/market/[city]/page.tsx`, and `app/market/[city]/[slug]/page.tsx` only.',
  'Search owns active property inventory',
  'no hidden context',
  'no persistence',
  'no telemetry',
  'no map or provider change',
]) {
  assertIncludes(implementationRecord, phrase, `Implementation record must include: ${phrase}`);
}

assert.equal(
  packageJson.scripts?.['check:dxt-market-continuity-implementation'],
  'npm run worker:build && node dist/scripts/checkDxtMarketContinuityImplementation.js',
  'package.json must register the Market continuity implementation check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxtMarketContinuityImplementation.ts',
  'tsconfig.worker.json must include the Market continuity implementation check.',
);

console.log(
  '[dxt-market-continuity-implementation] ok: Market index continuity, route ownership, safe destinations, and protected boundaries verified.',
);
