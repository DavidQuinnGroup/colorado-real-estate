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

const cityMarketPage = read('app/market/[city]/page.tsx');
const marketIndex = read('app/market/page.tsx');
const neighborhoodPage = read('app/market/[city]/[slug]/page.tsx');
const buyerPage = read('app/buy/page.tsx');
const sellerPage = read('app/sell/page.tsx');
const planClosure = read('docs/project-atlas/executive-library/REIE-DXT-WAVE-1D-CITY-MARKET-BRIEFING-PLAN-CLOSURE.md');
const implementationRecord = read(
  'docs/project-atlas/executive-library/REIE-DXT-WAVE-1D-CITY-MARKET-BRIEFING-IMPLEMENTATION.md',
);
const completionAssessment = read(
  'docs/project-atlas/executive-library/REIE-DXT-WAVE-1D-COMPLETION-ASSESSMENT.md',
);
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');
const chatStart = read('docs/CHAT_START.md');

assertIncludes(
  planClosure,
  'REIE_DXT_WAVE_1D_CITY_MARKET_BRIEFING_PLAN_CERTIFIED_AND_CLOSED',
  'City Market plan closure must remain certified.',
);

for (const marker of [
  'data-city-market-briefing-hero="true"',
  'data-city-market-briefing-status="implemented"',
  'data-city-market-briefing-question="What is happening in this city market, what evidence matters, and what should I investigate next?"',
  'data-city-market-briefing-ai="false"',
  'data-city-market-briefing-provider-change="false"',
  'data-city-market-briefing-telemetry="false"',
  'data-city-market-briefing-ranking="false"',
  'data-testid="city-market-current-signals"',
  'data-testid="city-market-briefing-decision-evidence"',
  'data-city-market-briefing-evidence="decision-relevance"',
  'data-city-market-directional-versus-verified="present"',
  'data-city-market-fair-housing-boundary="present"',
  'data-city-market-professional-boundary="present"',
  'data-testid="city-market-briefing-investigation-paths"',
  'data-city-market-neighborhood-paths="investigation"',
  'data-city-market-neighborhood-ranking="false"',
]) {
  assertIncludes(cityMarketPage, marker, `City Market implementation marker must be present: ${marker}`);
}

assert.equal(countOccurrences(cityMarketPage, '<h1'), 1, 'City Market route must contain exactly one H1.');

assertOrdered(
  cityMarketPage,
  [
    '{cityData.name} City Market Briefing',
    '            What is happening in this city market, what evidence matters, and what should I investigate next?',
    'Use this {cityData.name} briefing to understand the current signal',
    'data-testid="city-market-current-signals"',
    'data-testid="city-market-briefing-decision-evidence"',
    'Directional versus verified',
    'data-testid="city-market-briefing-investigation-paths"',
    '        <MarketProduct3VisualIntelligence experience={marketProduct3Experience} />',
    '<ContinueYourDecision',
  ],
  'City Market route must preserve the certified briefing hierarchy.',
);

for (const requiredCopy of [
  'Search With Market Context',
  'Read {cityData.name} as context for investigation, not a conclusion.',
  'The useful question is not whether a city is right for every customer.',
  'Current market signals',
  'Evidence to inspect',
  'Directional versus verified',
  'Market context is directional.',
  'What To Investigate Next',
  'Move from city signal to the evidence source.',
  'Which neighborhood pages clarify geography, housing context, and local questions without ranking places?',
  '        <MarketProduct3VisualIntelligence experience={marketProduct3Experience} />',
  '<MarketNeighborhoodLinks',
  '<MarketHomesLinks',
  '<LeadCapture city={cityData.name} />',
]) {
  assertIncludes(cityMarketPage, requiredCopy, `City Market briefing must include: ${requiredCopy}`);
}

for (const protectedBoundary of [
  'Property condition, pricing strategy, financing, legal, tax, and timing questions require source review and qualified professional judgment.',
  'data-city-decision-guide-ai={cityDecisionGuide ? String(DECISION_GUIDE_TRUST_BOUNDARIES.ai) : undefined}',
  'data-city-decision-guide-ranking={cityDecisionGuide ? String(DECISION_GUIDE_TRUST_BOUNDARIES.ranking) : undefined}',
  'data-city-decision-guide-demographic-targeting={cityDecisionGuide ? String(DECISION_GUIDE_TRUST_BOUNDARIES.demographicTargeting) : undefined}',
  'data-market-v8-ai="false"',
  'data-market-v8-forecasting="false"',
  'data-market-v8-gis="false"',
  'data-market-v8-telemetry="false"',
  'data-market-intelligence-provider="none"',
  'data-market-intelligence-ai-generated="false"',
  'data-market-intelligence-gis-activated="false"',
]) {
  assertIncludes(cityMarketPage, protectedBoundary, `City Market protected boundary must remain present: ${protectedBoundary}`);
}

for (const prohibitedRuntimePattern of [
  'localStorage',
  'sessionStorage',
  'document.cookie',
  'OpenAI',
  'Mapbox',
  'best neighborhood',
  'safest neighborhood',
  'school ranking',
  'will appreciate',
  'guaranteed appreciation',
  'buy now',
  'sell now',
  'provider feed',
  'data-dxt-wave-1d-neighborhood-place-orientation',
]) {
  assertNotIncludes(cityMarketPage, prohibitedRuntimePattern, `City Market route must not introduce: ${prohibitedRuntimePattern}`);
}

for (const protectedRuntime of [marketIndex, neighborhoodPage, buyerPage, sellerPage]) {
  assertNotIncludes(
    protectedRuntime,
    'data-city-market-briefing-status="implemented"',
    'City Market implementation marker must not appear outside the City Market runtime route.',
  );
  assertNotIncludes(
    protectedRuntime,
    'What is happening in this city market, what evidence matters, and what should I investigate next?',
    'City Market governing question must not contaminate other runtime files.',
  );
}

for (const recordMarker of [
  'DXT_WAVE_1D_CITY_MARKET_BRIEFING_IMPLEMENTED_LOCAL_COMMIT_ONLY',
  'READY_FOR_CITY_MARKET_LOCAL_CERTIFICATION',
  'Selected runtime target: `app/market/[city]/page.tsx`',
  'Market index runtime unchanged',
  'Neighborhood runtime unchanged',
  'Buyer runtime unchanged',
  'Seller runtime unchanged',
  'Search unchanged',
  'shared runtime unchanged',
]) {
  assertIncludes(implementationRecord, recordMarker, `City Market implementation record must include: ${recordMarker}`);
}

for (const completionMarker of [
  'DXT_WAVE_1D_COMPLETION_ASSESSMENT_READY',
  'City Market production certification is the remaining Wave 1D completion dependency.',
  'No additional bounded Wave 1D implementation phase is recommended after City Market production certification, absent production defects.',
]) {
  assertIncludes(completionAssessment, completionMarker, `Wave 1D completion assessment must include: ${completionMarker}`);
}

assert.equal(
  packageJson.scripts?.['check:dxt-wave-1d-city-market-briefing-implementation'],
  'npm run worker:build && node dist/scripts/checkDxtWave1dCityMarketBriefingImplementation.js',
  'package.json must register the City Market briefing implementation check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxtWave1dCityMarketBriefingImplementation.ts',
  'tsconfig.worker.json must include the City Market briefing implementation check.',
);
assertIncludes(
  chatStart,
  'DXT_WAVE_1D_CITY_MARKET_BRIEFING_IMPLEMENTED_LOCAL_COMMIT_ONLY',
  'CHAT_START must record City Market implementation status.',
);

console.log(
  '[dxt-wave-1d-city-market-briefing-implementation] ok: City Market hierarchy, evidence, continuations, boundaries, runtime isolation, docs, and registrations verified.',
);
