import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

const buyerPage = read('app/buy/page.tsx');
const implementationRecord = read(
  'docs/project-atlas/executive-library/REIE-DXT-2-BUYER-DECISION-READINESS-DEPTH-EXPANSION-IMPLEMENTATION.md',
);
const chatStart = read('docs/CHAT_START.md');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'data-testid="dxt-2-buyer-decision-readiness-depth-expansion"',
  'data-dxt-2-buyer-readiness-depth="implemented"',
  'data-dxt-2-buyer-readiness-runtime-scope="app/buy/page.tsx"',
  'data-dxt-2-buyer-readiness-existing-evidence-only="true"',
  'data-dxt-2-buyer-readiness-financing-tool-change="false"',
  'data-dxt-2-buyer-readiness-search-change="false"',
  'data-dxt-2-buyer-readiness-property-change="false"',
  'data-dxt-2-buyer-readiness-seller-change="false"',
  'data-dxt-2-buyer-readiness-advisory-change="false"',
  'data-dxt-2-buyer-readiness-contact-change="false"',
  'data-dxt-2-buyer-readiness-provider-activation="false"',
  'data-dxt-2-buyer-readiness-api-change="false"',
  'data-dxt-2-buyer-readiness-hidden-context="false"',
  'data-dxt-2-buyer-readiness-persistence="false"',
  'data-dxt-2-buyer-readiness-telemetry="false"',
  'data-dxt-2-buyer-readiness-ai="false"',
  'data-dxt-2-buyer-readiness-scoring="false"',
  'data-dxt-2-buyer-readiness-ranking="false"',
  'data-dxt-2-buyer-readiness-recommendation="false"',
  'data-dxt-2-buyer-readiness-qualification="false"',
  'data-dxt-2-buyer-readiness-affordability="false"',
  'data-dxt-2-buyer-readiness-buying-power="false"',
  'Buyer Decision Readiness',
  'Available now',
  'Needs verification',
  'Assumption',
  'Unknown from current evidence',
  'Financing-readiness verification',
  'Property and transaction verification',
  'Questions to carry forward',
  'Next-decision thresholds',
  'Confidence is qualitative and preparation-focused',
  'Continue Search',
  'Review financing assumptions',
  'Open a Property',
  'Understand Market context',
  'Prepare Advisory questions',
  'Begin general Contact',
  'No loan approval, lending eligibility decision, affordability result, buying-capacity conclusion',
]) {
  assertIncludes(buyerPage, phrase, `Buyer readiness implementation must include: ${phrase}`);
}

for (const preserved of [
  '<BuyerFinancingReadinessGuide />',
  '<FinancingConfidenceEducation surface="buy" />',
  '<JourneyCohesionPanel',
  'buildBuyerDecisionWorkspace',
  'Start With Search',
  'Review Financing Assumptions',
  'Continue Buyer Search',
  'Prepare Advisory Questions',
  'Start General Contact',
  'Am I prepared to buy?',
  "alternates: { canonical: `${SITE_URL}/buy` }",
]) {
  assertIncludes(buyerPage, preserved, `Buyer readiness must preserve: ${preserved}`);
}

for (const prohibited of [
  'buyerReadinessScore',
  'approvalProbability',
  'qualificationScore',
  'affordabilityScore',
  'buyingPowerScore',
  'creditScoreInterpretation',
  'lenderScore',
  'recommendedLender',
  'recommendedProperty',
  'localStorage',
  'sessionStorage',
  'document.cookie',
  'navigator.sendBeacon',
]) {
  assert(!buyerPage.includes(prohibited), `Buyer readiness must not introduce ${prohibited}.`);
}

for (const phrase of [
  'Status: `DXT_2_BUYER_DECISION_READINESS_DEPTH_EXPANSION_IMPLEMENTED_LOCAL_COMMIT_ONLY`',
  'READY_FOR_DXT_2_BUYER_DECISION_READINESS_DEPTH_EXPANSION_LOCAL_CERTIFICATION',
  'app/buy/page.tsx',
  'Am I prepared to buy?',
  'Available now',
  'Needs verification',
  'Confidence is qualitative and preparation-focused, not scored.',
  'No financing-tool runtime change',
  'No Search or Property runtime change',
  'No hidden Buyer context',
  'No loan approval, eligibility, affordability, buying-capacity, underwriting, credit-readiness, lender-selection, suitability, ranking, score, or recommendation behavior',
]) {
  assertIncludes(implementationRecord, phrase, `Buyer readiness record must include: ${phrase}`);
}

assertIncludes(
  chatStart,
  'DXT_2_BUYER_DECISION_READINESS_DEPTH_EXPANSION_IMPLEMENTED_LOCAL_COMMIT_ONLY',
  'CHAT_START must record the Buyer readiness local implementation status.',
);
assert.equal(
  packageJson.scripts?.['check:dxt-2-buyer-decision-readiness-depth-expansion-implementation'],
  'npm run worker:build && node dist/scripts/checkDxt2BuyerDecisionReadinessDepthExpansionImplementation.js',
  'package.json must register the DXT 2 Buyer readiness implementation check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxt2BuyerDecisionReadinessDepthExpansionImplementation.ts',
  'tsconfig.worker.json must include the DXT 2 Buyer readiness implementation check.',
);

console.log(
  '[dxt-2-buyer-decision-readiness-depth-expansion-implementation] ok: route-local Buyer readiness depth, existing evidence, financial boundaries, and protected systems verified.',
);
