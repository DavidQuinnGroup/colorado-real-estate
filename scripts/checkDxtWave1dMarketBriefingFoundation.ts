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

function assertOrdered(source: string, markers: string[], message: string): void {
  let previousIndex = -1;

  for (const marker of markers) {
    const index = source.indexOf(marker);
    assert(index >= 0, `Missing marker: ${marker}`);
    assert(index > previousIndex, message);
    previousIndex = index;
  }
}

function countOccurrences(source: string, value: string): number {
  return source.split(value).length - 1;
}

const marketIndex = read('app/market/page.tsx');
const cityMarketPage = read('app/market/[city]/page.tsx');
const neighborhoodPage = read('app/market/[city]/[slug]/page.tsx');
const buyerPage = read('app/buy/page.tsx');
const sellerPage = read('app/sell/page.tsx');
const foundationContract = read(
  'docs/project-atlas/executive-library/REIE-DXT-WAVE-1D-MARKET-NEIGHBORHOOD-DISCOVERY-FOUNDATION-CONTRACT.md',
);
const foundationClosure = read(
  'docs/project-atlas/executive-library/REIE-DXT-WAVE-1D-MARKET-NEIGHBORHOOD-DISCOVERY-FOUNDATION-CLOSURE.md',
);
const implementationRecord = read(
  'docs/project-atlas/executive-library/REIE-DXT-WAVE-1D-MARKET-BRIEFING-FOUNDATION-IMPLEMENTATION.md',
);
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');
const chatStart = read('docs/CHAT_START.md');

assertIncludes(
  foundationContract,
  'DXT_WAVE_1D_MARKET_NEIGHBORHOOD_DISCOVERY_FOUNDATION_IMPLEMENTED_LOCAL_COMMIT_ONLY',
  'Implemented Wave 1D foundation contract must remain present.',
);
assertIncludes(
  foundationClosure,
  'REIE_DXT_WAVE_1D_MARKET_NEIGHBORHOOD_DISCOVERY_FOUNDATION_CERTIFIED_AND_CLOSED',
  'Certified Wave 1D foundation closure must remain present.',
);

for (const marker of [
  'data-dxt-wave-1d-market-briefing="true"',
  'data-dxt-wave-1d-briefing-contract="REIE_DXT_WAVE_1D_MARKET_NEIGHBORHOOD_DISCOVERY_FOUNDATION_CERTIFIED_AND_CLOSED"',
  'data-dxt-wave-1d-selected-runtime-scope="market-index"',
  'data-dxt-wave-1d-neighborhood-runtime-change="false"',
  'data-dxt-wave-1c-buyer-runtime-change="false"',
  'data-dxt-wave-1c-seller-runtime-change="false"',
  'data-testid="reie-market-v8-decision-workspace"',
  'data-testid="dxt-wave-1d-market-briefing-foundation"',
  '<MarketProduct3VisualIntelligence experience={marketProduct3Experience} />',
  '<ContinueYourDecision',
]) {
  assertIncludes(marketIndex, marker, `Market index must include marker: ${marker}`);
}

assertOrdered(
  marketIndex,
  [
    'data-dxt-market-briefing-role="market-orientation-governing-question-briefing-promise"',
    'data-dxt-market-briefing-role="dominant-next-action"',
    'data-dxt-market-briefing-role="current-market-signals"',
    'data-dxt-market-briefing-role="evidence-that-matters"',
    'data-dxt-market-briefing-role="directional-versus-verified"',
    'id="market-core-synthesis"',
    'data-dxt-market-briefing-role="questions-to-investigate"',
    'data-dxt-market-briefing-role="freshness-uncertainty-professional-boundaries"',
    'data-dxt-market-briefing-role="compact-continuations"',
  ],
  'Market briefing hierarchy must preserve the certified Wave 1D briefing order with one first-viewport dominant action.',
);

assert.equal(
  countOccurrences(marketIndex, 'className="market-primary-cta"'),
  1,
  'Market briefing must expose exactly one visually dominant primary action.',
);

for (const requiredCopy of [
  'What is happening here, what evidence matters, and what should I investigate next?',
  'Use current market signals, verified paths, and limitation-aware guidance',
  'Read the signal before choosing the next path.',
  'Group evidence by what it helps the customer decide.',
  'Market direction, pricing context, timing, and inventory signals are directional.',
  'Which market signal changes the next search?',
  'Which neighborhood context should be opened before comparing homes?',
  'Market context is not a forecast, valuation, ranking, investment recommendation, pricing certainty, suitability conclusion',
]) {
  assertIncludes(marketIndex, requiredCopy, `Market briefing must include copy: ${requiredCopy}`);
}

for (const continuity of [
  'href="/search"',
  "href: '/market/boulder-co-housing-market'",
  "href: '/market/boulder/mapleton-hill'",
  "href: '/contact'",
  "href: '/sell'",
  'Search With Market Context',
  'Advisory Guidance',
  'Neighborhood Context',
]) {
  assertIncludes(marketIndex, continuity, `Market briefing must preserve continuation: ${continuity}`);
}

for (const prohibitedRuntimePattern of [
  'localStorage',
  'sessionStorage',
  'document.cookie',
  'fetch(',
  '/api/',
  'OpenAI',
  'Mapbox',
  'school ranking',
  'safest',
  'will appreciate',
  'forecast appreciation',
  'provider feed',
]) {
  assertNotIncludes(marketIndex, prohibitedRuntimePattern, `Market index must not introduce protected pattern: ${prohibitedRuntimePattern}`);
}

for (const runtimeSource of [cityMarketPage, neighborhoodPage, buyerPage, sellerPage]) {
  assertNotIncludes(runtimeSource, 'data-dxt-wave-1d-market-briefing="true"', 'Only the Market index may receive the Market briefing marker.');
  assertNotIncludes(
    runtimeSource,
    'What is happening here, what evidence matters, and what should I investigate next?',
    'Only the Market index may receive the Market briefing governing question.',
  );
}

for (const recordMarker of [
  'DXT_WAVE_1D_MARKET_BRIEFING_FOUNDATION_IMPLEMENTED_LOCAL_COMMIT_ONLY',
  'READY_FOR_MARKET_BRIEFING_FOUNDATION_LOCAL_CERTIFICATION',
  'Selected runtime target: `app/market/page.tsx`',
  'Buyer runtime unchanged',
  'Seller runtime unchanged',
  'Neighborhood runtime unchanged',
  'Shared runtime unchanged',
]) {
  assertIncludes(implementationRecord, recordMarker, `Market implementation record must include: ${recordMarker}`);
}

assert.equal(
  packageJson.scripts?.['check:dxt-wave-1d-market-briefing-foundation'],
  'npm run worker:build && node dist/scripts/checkDxtWave1dMarketBriefingFoundation.js',
  'package.json must register the Market briefing check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxtWave1dMarketBriefingFoundation.ts',
  'tsconfig.worker.json must include the Market briefing check.',
);
assertIncludes(
  chatStart,
  'DXT_WAVE_1D_MARKET_BRIEFING_FOUNDATION_IMPLEMENTED_LOCAL_COMMIT_ONLY',
  'CHAT_START must record Market briefing implementation status.',
);

console.log(
  '[dxt-wave-1d-market-briefing-foundation] ok: Market index hierarchy, evidence boundaries, continuations, runtime isolation, documentation, and registrations verified.',
);
