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

const buyerPage = read('app/buy/page.tsx');
const sellerPage = read('app/sell/page.tsx');
const contract = read(
  'docs/project-atlas/executive-library/REIE-DXT-WAVE-1C-BUYER-SELLER-SHARED-HIERARCHY-FOUNDATION-CONTRACT.md',
);
const implementationRecord = read(
  'docs/project-atlas/executive-library/REIE-DXT-WAVE-1C-BUYER-JOURNEY-SIMPLIFICATION-IMPLEMENTATION.md',
);
const sellerPlan = read(
  'docs/project-atlas/executive-library/REIE-DXT-WAVE-1C-SELLER-JOURNEY-SIMPLIFICATION-IMPLEMENTATION-PLAN.md',
);
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');
const chatStart = read('docs/CHAT_START.md');

assertIncludes(contract, 'BUYER_SELLER_SHARED_HIERARCHY_FOUNDATION_IMPLEMENTED', 'Wave 1C shared contract must exist.');
assertIncludes(buyerPage, 'data-dxt-wave-1c-buyer-journey="true"', 'Buyer page must expose DXT Wave 1C marker.');
assertIncludes(
  buyerPage,
  'data-dxt-wave-1c-shared-contract="BUYER_SELLER_SHARED_HIERARCHY_FOUNDATION_IMPLEMENTED"',
  'Buyer page must reference the implemented shared contract.',
);
assertIncludes(
  buyerPage,
  'data-dxt-wave-1c-seller-runtime-change="false"',
  'Buyer implementation must mark Seller runtime as unchanged.',
);

assertOrdered(
  buyerPage,
  [
    'data-dxt-buyer-hierarchy-role="page-orientation-governing-decision-question-concise-opening-promise"',
    'data-dxt-buyer-hierarchy-role="preparation-themes"',
    'data-dxt-buyer-hierarchy-role="tool-or-evidence-continuation"',
    'data-dxt-buyer-hierarchy-role="questions-to-verify"',
    'data-dxt-buyer-hierarchy-role="professional-and-trust-boundaries"',
    'data-dxt-buyer-hierarchy-role="advisory-transition-compact-continuations"',
  ],
  'Buyer page must preserve the DXT Wave 1C hierarchy sequence.',
);

for (const requiredCopy of [
  'Am I prepared to buy?',
  'Prepare the search, financing assumptions, property questions, and advisor conversation before the market asks you to move.',
  'Preparation, not qualification',
  'Three things need to be clear before a home becomes serious.',
  'A prepared buyer knows what is still unresolved.',
  'Move from buyer preparation into the right next decision.',
]) {
  assertIncludes(buyerPage, requiredCopy, `Buyer page must include DXT copy: ${requiredCopy}`);
}

for (const routeContinuity of [
  'href="/search"',
  'href="#financing-readiness"',
  "marketHref: '/market'",
  "advisorHref: '/contact'",
  '<BuyerFinancingReadinessGuide />',
  '<FinancingConfidenceEducation surface="buy" />',
  '<JourneyCohesionPanel',
]) {
  assertIncludes(buyerPage, routeContinuity, `Buyer page must preserve route/tool continuity: ${routeContinuity}`);
}

for (const boundaryMarker of [
  'data-buyer-confidence-ai="false"',
  'data-buyer-confidence-gis="false"',
  'data-buyer-confidence-provider-activation="false"',
  'data-buyer-confidence-financing-workflow="false"',
  'data-buyer-v8-ai="false"',
  'data-buyer-v8-accounts="false"',
  'data-buyer-v8-gis="false"',
  'data-buyer-v8-telemetry="false"',
  'data-buyer-v8-mortgage-calculator="false"',
  'data-buyer-v8-lender-workflow="false"',
  'data-buyer-v8-recommendation-engine="false"',
]) {
  assertIncludes(buyerPage, boundaryMarker, `Buyer page must preserve boundary marker: ${boundaryMarker}`);
}

for (const prohibitedCopy of [
  'mortgage approval',
  'pre-approved',
  'financial qualification',
  'affordability determination',
  'buying-power conclusion',
  'lender ranking',
  'recommended lender',
  'credit analysis',
  'underwriting logic',
  'personalized financial advice',
  'valuation certainty',
  'qualified buyer',
  'buyer score',
  'qualification score',
]) {
  assertNotIncludes(buyerPage.toLowerCase(), prohibitedCopy, `Buyer page must not include prohibited copy: ${prohibitedCopy}`);
}

for (const prohibitedRuntimePattern of [
  'localStorage',
  'sessionStorage',
  'document.cookie',
  'fetch(',
  '/api/',
  'createSellerLead',
  'trackEvent(',
  'OpenAI',
  'Mapbox',
]) {
  assertNotIncludes(buyerPage, prohibitedRuntimePattern, `Buyer page must not introduce runtime pattern: ${prohibitedRuntimePattern}`);
}

assertIncludes(sellerPage, 'data-testid="seller-page"', 'Seller runtime page must remain present.');
assertNotIncludes(sellerPage, 'data-dxt-wave-1c-buyer-journey', 'Seller runtime must not receive Buyer DXT markers.');

for (const recordMarker of [
  'DXT_WAVE_1C_BUYER_JOURNEY_SIMPLIFICATION_IMPLEMENTED_LOCAL_COMMIT_ONLY',
  'READY_FOR_BUYER_JOURNEY_LOCAL_CERTIFICATION',
  'Seller runtime was not modified.',
]) {
  assertIncludes(implementationRecord, recordMarker, `Implementation record must include: ${recordMarker}`);
}

for (const sellerPlanMarker of [
  'DXT_WAVE_1C_SELLER_JOURNEY_SIMPLIFICATION_IMPLEMENTATION_PLAN_READY',
  'What must be understood before market exposure?',
  'Seller runtime remains unauthorized.',
]) {
  assertIncludes(sellerPlan, sellerPlanMarker, `Seller planning record must include: ${sellerPlanMarker}`);
}

assert.equal(
  packageJson.scripts?.['check:dxt-wave-1c-buyer-journey-simplification'],
  'npm run worker:build && node dist/scripts/checkDxtWave1cBuyerJourneySimplification.js',
  'package.json must register the DXT Wave 1C Buyer journey check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxtWave1cBuyerJourneySimplification.ts',
  'tsconfig.worker.json must include the DXT Wave 1C Buyer journey check.',
);
assertIncludes(
  chatStart,
  'DXT_WAVE_1C_BUYER_JOURNEY_SIMPLIFICATION_IMPLEMENTED_LOCAL_COMMIT_ONLY',
  'CHAT_START must record Buyer Journey implementation status.',
);

console.log(
  '[dxt-wave-1c-buyer-journey-simplification] ok: Buyer hierarchy, Search/financing/advisory continuity, protected boundaries, Seller runtime isolation, docs, and registry entries verified.',
);
