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

const sellerPage = read('app/sell/page.tsx');
const buyerPage = read('app/buy/page.tsx');
const marketIndex = read('app/market/page.tsx');
const cityMarketPage = read('app/market/[city]/page.tsx');
const neighborhoodPage = read('app/market/[city]/[slug]/page.tsx');
const homeValueEstimator = read('components/HomeValueEstimator.tsx');
const valuationRoute = read('app/api/valuation/route.ts');
const contract = read(
  'docs/project-atlas/executive-library/REIE-DXT-WAVE-1C-BUYER-SELLER-SHARED-HIERARCHY-FOUNDATION-CONTRACT.md',
);
const implementationRecord = read(
  'docs/project-atlas/executive-library/REIE-DXT-WAVE-1C-SELLER-JOURNEY-SIMPLIFICATION-IMPLEMENTATION.md',
);
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');
const chatStart = read('docs/CHAT_START.md');

assertIncludes(contract, 'BUYER_SELLER_SHARED_HIERARCHY_FOUNDATION_IMPLEMENTED', 'Wave 1C shared contract must remain present.');
assertIncludes(sellerPage, 'data-dxt-wave-1c-seller-journey="true"', 'Seller page must expose the DXT Wave 1C Seller marker.');
assertIncludes(
  sellerPage,
  'data-dxt-wave-1c-shared-contract="BUYER_SELLER_SHARED_HIERARCHY_FOUNDATION_IMPLEMENTED"',
  'Seller page must reference the implemented shared hierarchy contract.',
);
assertIncludes(sellerPage, 'data-dxt-wave-1c-buyer-runtime-change="false"', 'Seller implementation must mark Buyer runtime unchanged.');
assertIncludes(sellerPage, 'data-dxt-wave-1d-market-runtime-change="false"', 'Seller implementation must mark Market runtime unchanged.');
assertIncludes(sellerPage, 'data-dxt-wave-1d-neighborhood-runtime-change="false"', 'Seller implementation must mark Neighborhood runtime unchanged.');

assertOrdered(
  sellerPage,
  [
    'data-dxt-seller-hierarchy-role="page-orientation-governing-decision-question-concise-opening-promise"',
    'data-dxt-seller-hierarchy-role="preparation-themes"',
    'data-dxt-seller-hierarchy-role="tool-or-evidence-continuation"',
    'data-dxt-seller-hierarchy-role="questions-to-verify"',
    'data-dxt-seller-hierarchy-role="professional-and-trust-boundaries"',
    'data-dxt-seller-hierarchy-role="advisory-transition-compact-continuations"',
  ],
  'Seller page must preserve the DXT Wave 1C hierarchy sequence.',
);

for (const requiredCopy of [
  'What must be understood before market exposure?',
  'Prepare the property, evidence, pricing context, buyer questions, and advisor conversation before the market sees the home.',
  'Property condition and presentation',
  'Evidence and information gaps',
  'Pricing context and market exposure',
  'Buyer objections and transaction readiness',
  'A seller is better prepared when unresolved questions are named early.',
  'Pricing context needs professional judgment.',
  'Bring the property, evidence gaps, and timing into review.',
]) {
  assertIncludes(sellerPage, requiredCopy, `Seller page must include DXT copy: ${requiredCopy}`);
}

for (const continuity of [
  'href="#seller-intake"',
  'data-dxt-seller-primary-action="#seller-intake"',
  'data-testid="seller-readiness-entry"',
  'href="/home-worth#seller-readiness"',
  '<HomeValueEstimator />',
  '<JourneyCohesionPanel',
  "label: 'Home Worth', href: '/home-worth'",
  "label: 'Market Context', href: '/market'",
  "label: 'Advisory Guidance', href: '/contact'",
  "href: '/search'",
]) {
  assertIncludes(sellerPage, continuity, `Seller page must preserve tool or route continuity: ${continuity}`);
}

for (const boundary of [
  'not an appraisal',
  'automated valuation',
  'listing-price recommendation',
  'guaranteed sale price',
  'guaranteed timing',
  'guaranteed outcome',
  'legal, tax, insurance, title, inspection, engineering, investment, or suitability conclusions',
]) {
  assertIncludes(sellerPage, boundary, `Seller page must preserve explicit boundary: ${boundary}`);
}

for (const prohibitedRuntimePattern of [
  'localStorage',
  'sessionStorage',
  'document.cookie',
  'fetch(',
  '/api/',
  'OpenAI',
  'Mapbox',
  'createSellerLead',
]) {
  assertNotIncludes(sellerPage, prohibitedRuntimePattern, `Seller page must not introduce runtime pattern: ${prohibitedRuntimePattern}`);
}

for (const protectedFormMarker of [
  'Seller Analysis Request',
  'not an automated home-value estimate',
  'data-conversion-automated-valuation="false"',
  "fetch('/api/valuation'",
]) {
  assertIncludes(homeValueEstimator, protectedFormMarker, `Home Value Estimator must preserve marker: ${protectedFormMarker}`);
}

assertIncludes(valuationRoute, "type: 'strategy_intake'", 'Valuation backend must preserve strategy intake posture.');
assertIncludes(valuationRoute, 'emailSent: false', 'Valuation backend must preserve no-live-email status.');
assertNotIncludes(valuationRoute, 'optimizedValue', 'Valuation backend must not return unsupported value output.');
assertNotIncludes(valuationRoute, 'estimatedEquity', 'Valuation backend must not return unsupported equity output.');

assertNotIncludes(buyerPage, 'data-dxt-wave-1c-seller-journey', 'Buyer runtime must not receive Seller markers.');
for (const marketRuntime of [marketIndex, cityMarketPage, neighborhoodPage]) {
  assertNotIncludes(marketRuntime, 'data-dxt-wave-1d-market-neighborhood-contract', 'Wave 1D must not modify Market or Neighborhood runtime.');
  assertNotIncludes(marketRuntime, 'DXT_WAVE_1D_MARKET_NEIGHBORHOOD_DISCOVERY_FOUNDATION_IMPLEMENTED', 'Wave 1D must stay documentation-only.');
}

for (const recordMarker of [
  'DXT_WAVE_1C_SELLER_JOURNEY_SIMPLIFICATION_IMPLEMENTED_LOCAL_COMMIT_ONLY',
  'READY_FOR_SELLER_JOURNEY_LOCAL_CERTIFICATION',
  'app/sell/page.tsx',
  'Buyer runtime unchanged',
  'Market runtime unchanged',
  'Neighborhood runtime unchanged',
]) {
  assertIncludes(implementationRecord, recordMarker, `Seller implementation record must include: ${recordMarker}`);
}

assert.equal(
  packageJson.scripts?.['check:dxt-wave-1c-seller-journey-simplification'],
  'npm run worker:build && node dist/scripts/checkDxtWave1cSellerJourneySimplification.js',
  'package.json must register the DXT Wave 1C Seller journey check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxtWave1cSellerJourneySimplification.ts',
  'tsconfig.worker.json must include the DXT Wave 1C Seller journey check.',
);
assertIncludes(
  chatStart,
  'DXT_WAVE_1C_SELLER_JOURNEY_SIMPLIFICATION_IMPLEMENTED_LOCAL_COMMIT_ONLY',
  'CHAT_START must record Seller Journey implementation status.',
);

console.log(
  '[dxt-wave-1c-seller-journey-simplification] ok: Seller hierarchy, Home Value Estimator continuity, pricing/evidence boundaries, route continuity, protected systems, and docs verified.',
);
