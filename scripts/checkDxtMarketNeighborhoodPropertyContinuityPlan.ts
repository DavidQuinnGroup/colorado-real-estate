import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

const plan = read(
  'docs/project-atlas/executive-library/REIE-DXT-MARKET-CITY-MARKET-NEIGHBORHOOD-PROPERTY-CONTINUITY-PLAN.md',
);
const chatStart = read('docs/CHAT_START.md');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'Status: `MARKET_CITY_MARKET_NEIGHBORHOOD_PROPERTY_CONTINUITY_PLAN_READY`',
  'MARKET_CITY_MARKET_NEIGHBORHOOD_PROPERTY_CONTINUITY',
  'Route And CTA Inventory',
  'Continuity Gap Assessment',
  'Destination Ownership Model',
  'Recommended Bounded Implementation Phases',
  'Primary File Ownership',
  'Shared-File Stop Conditions',
  'Deterministic Certification Criteria',
  'Production-Certification Criteria',
  'Final-Phase Recommendation',
  'Accepted Limitations',
  'READY_FOR_REIE_DXT_MARKET_CITY_MARKET_NEIGHBORHOOD_PROPERTY_CONTINUITY_PLAN_CERTIFICATION',
]) {
  assertIncludes(plan, phrase, `Market/Neighborhood/Property continuity plan must include: ${phrase}`);
}

for (const boundary of [
  'no neighborhood rankings',
  'no protected-class steering',
  'no demographic suitability',
  'no best-neighborhood claims',
  'no safety guarantees',
  'no school-quality conclusions',
  'no investment guarantees',
  'no appreciation predictions',
  'no hidden personalization',
  'no persistence',
  'no telemetry',
  'no shared route state',
  'no provider or map changes',
]) {
  assertIncludes(plan, boundary, `Market/Neighborhood/Property plan must preserve boundary: ${boundary}`);
}

assertIncludes(
  chatStart,
  'READY_FOR_REIE_DXT_MARKET_CITY_MARKET_NEIGHBORHOOD_PROPERTY_CONTINUITY_PLAN_CERTIFICATION',
  'CHAT_START must record the Market/Neighborhood/Property planning gate.',
);
assert.equal(
  packageJson.scripts?.['check:dxt-market-neighborhood-property-continuity-plan'],
  'npm run worker:build && node dist/scripts/checkDxtMarketNeighborhoodPropertyContinuityPlan.js',
  'package.json must register the Market/Neighborhood/Property continuity planning check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxtMarketNeighborhoodPropertyContinuityPlan.ts',
  'tsconfig.worker.json must include the Market/Neighborhood/Property planning check.',
);

console.log(
  '[dxt-market-neighborhood-property-continuity-plan] ok: route inventory, continuity gaps, ownership, final-phase recommendation, and protected boundaries verified.',
);
