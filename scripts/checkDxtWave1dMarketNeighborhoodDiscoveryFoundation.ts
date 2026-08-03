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

const planningRecord = read('docs/project-atlas/executive-library/REIE-DXT-WAVE-1D-MARKET-NEIGHBORHOOD-DISCOVERY-PLANNING.md');
const contractRecord = read('docs/project-atlas/executive-library/REIE-DXT-WAVE-1D-MARKET-NEIGHBORHOOD-DISCOVERY-FOUNDATION-CONTRACT.md');
const readinessRecord = read('docs/project-atlas/executive-library/REIE-DXT-WAVE-1D-MARKET-NEIGHBORHOOD-DISCOVERY-IMPLEMENTATION-READINESS.md');
const marketIndex = read('app/market/page.tsx');
const cityMarketPage = read('app/market/[city]/page.tsx');
const neighborhoodPage = read('app/market/[city]/[slug]/page.tsx');
const sellerPage = read('app/sell/page.tsx');
const buyerPage = read('app/buy/page.tsx');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');
const chatStart = read('docs/CHAT_START.md');

assertIncludes(planningRecord, 'DXT_WAVE_1D_PLANNING_READY', 'Wave 1D planning record must remain present.');

for (const marker of [
  'DXT_WAVE_1D_MARKET_NEIGHBORHOOD_DISCOVERY_FOUNDATION_IMPLEMENTED_LOCAL_COMMIT_ONLY',
  'Market pages as customer briefings, not governance reports',
  'Neighborhood pages as orientation to place before evidence',
  'shared documentation-level hierarchy contract',
  'Market-specific requirements',
  'Neighborhood-specific requirements',
  'fair-housing boundaries',
  'No Market runtime was modified.',
  'No Neighborhood runtime was modified.',
]) {
  assertIncludes(contractRecord, marker, `Wave 1D contract must include marker: ${marker}`);
}

for (const marketRequirement of [
  'What is happening in this market?',
  'What evidence matters to my decision?',
  'What is directional versus verified?',
  'Which property or neighborhood journey should I continue into?',
  'not an internal KPI dashboard',
  'not a forecast, valuation, ranking, investment recommendation, or predictive certainty engine',
]) {
  assertIncludes(contractRecord, marketRequirement, `Wave 1D Market contract must include: ${marketRequirement}`);
}

for (const neighborhoodRequirement of [
  'What kind of place is this?',
  'How is it organized geographically?',
  'What housing context is available?',
  'What should I verify personally or professionally?',
  'no protected-class steering',
  'no demographic suitability conclusions',
  'no best-neighborhood claims',
  'no school-quality conclusions',
  'no safety guarantees',
]) {
  assertIncludes(contractRecord, neighborhoodRequirement, `Wave 1D Neighborhood contract must include: ${neighborhoodRequirement}`);
}

for (const readinessMarker of [
  'DXT_WAVE_1D_MARKET_NEIGHBORHOOD_DISCOVERY_FOUNDATION_READY_FOR_CERTIFICATION',
  'Market index simplification',
  'City market page simplification',
  'Neighborhood page simplification',
  'deterministic certification criteria',
  'future file ownership',
  'runtime implementation remains unauthorized',
]) {
  assertIncludes(readinessRecord, readinessMarker, `Wave 1D readiness record must include: ${readinessMarker}`);
}

for (const runtimeSource of [marketIndex, cityMarketPage, neighborhoodPage]) {
  assertNotIncludes(runtimeSource, 'DXT_WAVE_1D_MARKET_NEIGHBORHOOD_DISCOVERY_FOUNDATION_IMPLEMENTED', 'Wave 1D must not alter Market or Neighborhood runtime.');
  assertNotIncludes(runtimeSource, 'data-dxt-wave-1d-contract', 'Wave 1D must not add runtime contract markers.');
}

assertNotIncludes(sellerPage, 'Market pages as customer briefings', 'Seller runtime must not receive Wave 1D documentation copy.');
assertNotIncludes(buyerPage, 'Neighborhood pages as orientation', 'Buyer runtime must not receive Wave 1D documentation copy.');

assert.equal(
  packageJson.scripts?.['check:dxt-wave-1d-market-neighborhood-discovery-foundation'],
  'npm run worker:build && node dist/scripts/checkDxtWave1dMarketNeighborhoodDiscoveryFoundation.js',
  'package.json must register the DXT Wave 1D foundation check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxtWave1dMarketNeighborhoodDiscoveryFoundation.ts',
  'tsconfig.worker.json must include the DXT Wave 1D foundation check.',
);
assertIncludes(
  chatStart,
  'DXT_WAVE_1D_MARKET_NEIGHBORHOOD_DISCOVERY_FOUNDATION_IMPLEMENTED_LOCAL_COMMIT_ONLY',
  'CHAT_START must record Wave 1D foundation status.',
);

console.log(
  '[dxt-wave-1d-market-neighborhood-discovery-foundation] ok: Market/Neighborhood documentation contract, readiness, protected fair-housing/evidence boundaries, runtime isolation, and registry entries verified.',
);
