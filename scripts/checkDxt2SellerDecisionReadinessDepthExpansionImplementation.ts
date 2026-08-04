import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

const sellerPage = read('app/sell/page.tsx');
const implementationRecord = read(
  'docs/project-atlas/executive-library/REIE-DXT-2-SELLER-DECISION-READINESS-DEPTH-EXPANSION-IMPLEMENTATION.md',
);
const chatStart = read('docs/CHAT_START.md');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'data-testid="dxt-2-seller-decision-readiness-depth-expansion"',
  'data-dxt-2-seller-readiness-depth="implemented"',
  'data-dxt-2-seller-readiness-runtime-scope="app/sell/page.tsx"',
  'data-dxt-2-seller-readiness-existing-evidence-only="true"',
  'data-dxt-2-seller-readiness-estimator-change="false"',
  'data-dxt-2-seller-readiness-buyer-change="false"',
  'data-dxt-2-seller-readiness-search-change="false"',
  'data-dxt-2-seller-readiness-property-change="false"',
  'data-dxt-2-seller-readiness-market-change="false"',
  'data-dxt-2-seller-readiness-neighborhood-change="false"',
  'data-dxt-2-seller-readiness-advisory-change="false"',
  'data-dxt-2-seller-readiness-contact-change="false"',
  'data-dxt-2-seller-readiness-provider-activation="false"',
  'data-dxt-2-seller-readiness-api-change="false"',
  'data-dxt-2-seller-readiness-hidden-context="false"',
  'data-dxt-2-seller-readiness-persistence="false"',
  'data-dxt-2-seller-readiness-telemetry="false"',
  'data-dxt-2-seller-readiness-ai="false"',
  'data-dxt-2-seller-readiness-scoring="false"',
  'data-dxt-2-seller-readiness-ranking="false"',
  'data-dxt-2-seller-readiness-recommendation="false"',
  'data-dxt-2-seller-readiness-valuation="false"',
  'data-dxt-2-seller-readiness-pricing-recommendation="false"',
  'data-dxt-2-seller-readiness-sale-prediction="false"',
  'Seller Decision Readiness',
  'Available now',
  'Needs verification',
  'Condition assumption',
  'Pricing-context assumption',
  'Unknown from current evidence',
  'Buyer-objection readiness',
  'Market-exposure readiness',
  'Transaction readiness',
  'Questions to carry forward',
  'Next-decision thresholds',
  'Confidence is qualitative and preparation-focused',
  'Request Seller Review',
  'Review Home Worth context',
  'Inspect Market context',
  'Review competing inventory',
  'Prepare Advisory questions',
  'Begin general Contact',
  'No appraisal equivalence, valuation certainty, listing-price recommendation',
]) {
  assertIncludes(sellerPage, phrase, `Seller readiness implementation must include: ${phrase}`);
}

for (const preserved of [
  '<HomeValueEstimator />',
  '<JourneyCohesionPanel',
  'What must be understood before market exposure?',
  'Request Seller Review',
  'Review Preparation Themes',
  'Seller Readiness',
  'href="/home-worth#seller-readiness"',
  'href="/contact#advisory-readiness"',
  'href="/contact#contact-route-choice"',
  "alternates: { canonical: `${SITE_URL}/sell` }",
]) {
  assertIncludes(sellerPage, preserved, `Seller readiness must preserve: ${preserved}`);
}

for (const prohibited of [
  'sellerReadinessScore',
  'valuationScore',
  'pricingConfidenceScore',
  'listPriceScore',
  'saleProbability',
  'timeToSalePrediction',
  'buyerDemandScore',
  'investmentScore',
  'recommendedListPrice',
  'recommendedPricingStrategy',
  'recommendedTiming',
  'localStorage',
  'sessionStorage',
  'document.cookie',
  'navigator.sendBeacon',
]) {
  assert(!sellerPage.includes(prohibited), `Seller readiness must not introduce ${prohibited}.`);
}

for (const phrase of [
  'Status: `DXT_2_SELLER_DECISION_READINESS_DEPTH_EXPANSION_IMPLEMENTED_LOCAL_COMMIT_ONLY`',
  'READY_FOR_DXT_2_SELLER_DECISION_READINESS_DEPTH_EXPANSION_LOCAL_CERTIFICATION',
  'app/sell/page.tsx',
  'What must be understood before market exposure?',
  'Available now',
  'Needs verification',
  'Condition assumption',
  'Pricing-context assumption',
  'Unknown from current evidence',
  'Confidence remains qualitative and preparation-focused.',
  'No customer-specific Seller facts',
  'Home Value Estimator code, inputs, outputs, calculations, labels, validation, APIs, success and failure behavior, and customer-data handling remain unchanged.',
  'no appraisal equivalence, valuation certainty, guaranteed pricing, guaranteed sale outcome',
]) {
  assertIncludes(implementationRecord, phrase, `Seller readiness record must include: ${phrase}`);
}

assertIncludes(
  chatStart,
  'DXT_2_SELLER_DECISION_READINESS_DEPTH_EXPANSION_IMPLEMENTED_LOCAL_COMMIT_ONLY',
  'CHAT_START must record the Seller readiness local implementation status.',
);
assert.equal(
  packageJson.scripts?.['check:dxt-2-seller-decision-readiness-depth-expansion-implementation'],
  'npm run worker:build && node dist/scripts/checkDxt2SellerDecisionReadinessDepthExpansionImplementation.js',
  'package.json must register the DXT 2 Seller readiness implementation check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxt2SellerDecisionReadinessDepthExpansionImplementation.ts',
  'tsconfig.worker.json must include the DXT 2 Seller readiness implementation check.',
);

console.log(
  '[dxt-2-seller-decision-readiness-depth-expansion-implementation] ok: route-local Seller readiness depth, existing evidence, valuation boundaries, and protected systems verified.',
);
