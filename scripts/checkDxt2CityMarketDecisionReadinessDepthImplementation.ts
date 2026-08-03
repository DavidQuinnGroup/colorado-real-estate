import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

const cityMarketPage = read('app/market/[city]/page.tsx');
const implementationRecord = read(
  'docs/project-atlas/executive-library/REIE-DXT-2-CITY-MARKET-DECISION-READINESS-DEPTH-IMPLEMENTATION.md',
);
const chatStart = read('docs/CHAT_START.md');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'data-testid="dxt-2-city-market-decision-readiness-depth"',
  'data-dxt-2-city-market-readiness-depth="implemented"',
  'data-dxt-2-city-market-readiness-runtime-scope="app/market/[city]/page.tsx"',
  'data-dxt-2-city-market-readiness-existing-evidence-only="true"',
  'data-dxt-2-city-market-readiness-search-change="false"',
  'data-dxt-2-city-market-readiness-neighborhood-change="false"',
  'data-dxt-2-city-market-readiness-property-change="false"',
  'data-dxt-2-city-market-readiness-product-3-preserved="true"',
  'data-dxt-2-city-market-readiness-schema-preserved="true"',
  'data-dxt-2-city-market-readiness-faq-preserved="true"',
  'data-dxt-2-city-market-readiness-provider-activation="false"',
  'data-dxt-2-city-market-readiness-hidden-context="false"',
  'data-dxt-2-city-market-readiness-persistence="false"',
  'data-dxt-2-city-market-readiness-telemetry="false"',
  'City Market Decision Readiness',
  'Evidence available now',
  'Evidence unavailable here',
  'Assumptions to keep separate',
  'Freshness and verification stay near the decision point',
  'Search threshold',
  'Neighborhood threshold',
  'Property threshold',
  'Professional threshold',
]) {
  assertIncludes(cityMarketPage, phrase, `City Market readiness implementation must include: ${phrase}`);
}

for (const prohibited of [
  'cityMarketReadinessScore',
  'recommendedNeighborhood',
  'bestNeighborhood',
  'localStorage',
  'sessionStorage',
  'document.cookie',
  'navigator.sendBeacon',
]) {
  assert(!cityMarketPage.includes(prohibited), `City Market readiness must not introduce ${prohibited}.`);
}

for (const phrase of [
  'Status: `DXT_2_CITY_MARKET_DECISION_READINESS_DEPTH_IMPLEMENTED_LOCAL_COMMIT_ONLY`',
  'READY_FOR_MARKET_DECISION_READINESS_LOCAL_CERTIFICATION',
  'app/market/[city]/page.tsx',
  'What is happening in this city market, what evidence matters, and what should I investigate next?',
  'Evidence available now',
  'Evidence unavailable here',
  'Confidence is qualitative and descriptive, not a score.',
  'Search, Neighborhood, Property, Product 3, schema, and FAQ behavior remain preserved.',
  'no provider activation',
  'no API change',
  'no hidden context',
  'no persistence',
  'no telemetry',
]) {
  assertIncludes(implementationRecord, phrase, `City Market readiness record must include: ${phrase}`);
}

assertIncludes(
  chatStart,
  'DXT_2_CITY_MARKET_DECISION_READINESS_DEPTH_IMPLEMENTED_LOCAL_COMMIT_ONLY',
  'CHAT_START must record the City Market readiness local implementation status.',
);
assert.equal(
  packageJson.scripts?.['check:dxt-2-city-market-decision-readiness-depth-implementation'],
  'npm run worker:build && node dist/scripts/checkDxt2CityMarketDecisionReadinessDepthImplementation.js',
  'package.json must register the DXT 2 City Market readiness implementation check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxt2CityMarketDecisionReadinessDepthImplementation.ts',
  'tsconfig.worker.json must include the DXT 2 City Market readiness implementation check.',
);

console.log(
  '[dxt-2-city-market-decision-readiness-depth-implementation] ok: route-local City Market readiness depth, existing evidence, schema/FAQ/Product 3 preservation, and protected boundaries verified.',
);
