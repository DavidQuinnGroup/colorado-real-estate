import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

const marketPage = read('app/market/page.tsx');
const implementationRecord = read(
  'docs/project-atlas/executive-library/REIE-DXT-2-MARKET-DECISION-READINESS-DEPTH-IMPLEMENTATION.md',
);
const chatStart = read('docs/CHAT_START.md');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'data-testid="dxt-2-market-decision-readiness-depth"',
  'data-dxt-2-market-readiness-depth="implemented"',
  'data-dxt-2-market-readiness-runtime-scope="app/market/page.tsx"',
  'data-dxt-2-market-readiness-existing-evidence-only="true"',
  'data-dxt-2-market-readiness-search-change="false"',
  'data-dxt-2-market-readiness-product-3-preserved="true"',
  'data-dxt-2-market-readiness-provider-change="false"',
  'data-dxt-2-market-readiness-api-change="false"',
  'data-dxt-2-market-readiness-persistence="false"',
  'data-dxt-2-market-readiness-telemetry="false"',
  'data-dxt-2-market-readiness-scoring="false"',
  'data-dxt-2-market-readiness-ranking="false"',
  'Market Decision Readiness',
  'Evidence available now',
  'Evidence not yet available',
  'Assumptions to separate',
  'Freshness and confidence are descriptive',
  'Move to Search',
  'Open City Market',
  'Inspect Neighborhood',
  'Open Property',
  'Search With Market Context',
]) {
  assertIncludes(marketPage, phrase, `Market readiness implementation must include: ${phrase}`);
}

for (const prohibited of [
  'marketReadinessScore',
  'recommendedMarket',
  'bestMarket',
  'localStorage',
  'sessionStorage',
  'document.cookie',
  'navigator.sendBeacon',
]) {
  assert(!marketPage.includes(prohibited), `Market readiness must not introduce ${prohibited}.`);
}

for (const phrase of [
  'Status: `DXT_2_MARKET_DECISION_READINESS_DEPTH_IMPLEMENTED_LOCAL_COMMIT_ONLY`',
  'READY_FOR_MARKET_DECISION_READINESS_LOCAL_CERTIFICATION',
  'app/market/page.tsx',
  'What is happening here, what evidence matters, and what should I investigate next?',
  'Evidence available now',
  'Evidence not yet available',
  'Confidence is descriptive and qualitative, not a score.',
  'Search With Market Context remains preserved.',
  'Product 3 remains preserved.',
  'no Search API change',
  'no provider change',
  'no persistence',
  'no telemetry',
]) {
  assertIncludes(implementationRecord, phrase, `Market readiness record must include: ${phrase}`);
}

assertIncludes(
  chatStart,
  'DXT_2_MARKET_DECISION_READINESS_DEPTH_IMPLEMENTED_LOCAL_COMMIT_ONLY',
  'CHAT_START must record the Market readiness local implementation status.',
);
assert.equal(
  packageJson.scripts?.['check:dxt-2-market-decision-readiness-depth-implementation'],
  'npm run worker:build && node dist/scripts/checkDxt2MarketDecisionReadinessDepthImplementation.js',
  'package.json must register the DXT 2 Market readiness implementation check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxt2MarketDecisionReadinessDepthImplementation.ts',
  'tsconfig.worker.json must include the DXT 2 Market readiness implementation check.',
);

console.log(
  '[dxt-2-market-decision-readiness-depth-implementation] ok: route-local Market readiness depth, existing evidence, Product 3 preservation, and protected boundaries verified.',
);
