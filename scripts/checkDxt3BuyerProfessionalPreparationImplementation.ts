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

function assertBefore(source: string, first: string, second: string, message: string): void {
  const firstIndex = source.indexOf(first);
  const secondIndex = source.indexOf(second);
  assert(firstIndex >= 0, `${first} must be present.`);
  assert(secondIndex >= 0, `${second} must be present.`);
  assert(firstIndex < secondIndex, message);
}

const buyerPage = read('app/buy/page.tsx');
const financingPlanner = read('components/BuyerFinancingDecisionPlanner.tsx');
const financingGuide = read('components/BuyerFinancingReadinessGuide.tsx');
const advisory = read('components/AdvisoryHandoffGuide.tsx');
const contact = read('app/contact/page.tsx');
const implementation = read(
  'docs/project-atlas/executive-library/REIE-DXT-3-BUYER-PROFESSIONAL-PREPARATION-IMPLEMENTATION.md',
);
const chatStart = read('docs/CHAT_START.md');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const marker of [
  'data-testid="dxt-3-buyer-professional-preparation"',
  'data-dxt-3-buyer-professional-preparation="implemented-local"',
  'data-dxt-3-buyer-professional-runtime-scope="app/buy/page.tsx"',
  'data-dxt-3-buyer-professional-existing-evidence-only="true"',
  'data-dxt-3-buyer-professional-financing-planner-change="false"',
  'data-dxt-3-buyer-professional-search-change="false"',
  'data-dxt-3-buyer-professional-property-change="false"',
  'data-dxt-3-buyer-professional-seller-change="false"',
  'data-dxt-3-buyer-professional-advisory-change="false"',
  'data-dxt-3-buyer-professional-contact-change="false"',
  'data-dxt-3-buyer-professional-api-change="false"',
  'data-dxt-3-buyer-professional-form-change="false"',
  'data-dxt-3-buyer-professional-hidden-context="false"',
  'data-dxt-3-buyer-professional-url-context="false"',
  'data-dxt-3-buyer-professional-persistence="false"',
  'data-dxt-3-buyer-professional-telemetry="false"',
  'data-dxt-3-buyer-professional-customer-profile="false"',
  'data-dxt-3-buyer-professional-shared-runtime="false"',
]) {
  assertIncludes(buyerPage, marker, `Buyer professional preparation must preserve marker: ${marker}`);
}

for (const phrase of [
  'Buyer Professional Preparation',
  'What should I organize before beginning a professional conversation about buying?',
  'Evidence available now',
  'Evidence still needing verification',
  'Assumptions',
  'Unknowns',
  'Questions to carry forward',
  'Conversation priority',
  'Appropriate professional pathway',
  'What REIE cannot determine',
  'Next preparation steps',
  'Privacy, representation, and professional boundaries',
  'visible public context only',
  'does not collect answers',
  'save choices',
  'transfer hidden context',
  'prefill forms',
  'Buyer Financing Planner inputs',
]) {
  assertIncludes(buyerPage, phrase, `Buyer professional preparation must include: ${phrase}`);
}

for (const pathway of [
  "label: 'Advisory'",
  "href: '/contact#advisory-readiness'",
  "label: 'General Contact'",
  "href: '/contact#contact-route-choice'",
  "label: 'Continue Search'",
  "href: '/search'",
  'Property-specific questions still belong with the Property route.',
]) {
  assertIncludes(buyerPage, pathway, `Buyer professional preparation must preserve pathway: ${pathway}`);
}

assertBefore(
  buyerPage,
  'data-testid="dxt-2-buyer-decision-readiness-depth-expansion"',
  'data-testid="dxt-3-buyer-professional-preparation"',
  'DXT 3 Buyer professional preparation must build after the DXT 2 readiness layer.',
);
assertBefore(
  buyerPage,
  'data-testid="dxt-3-buyer-professional-preparation"',
  'data-dxt-buyer-hierarchy-role="questions-to-verify"',
  'DXT 3 Buyer professional preparation must precede the existing verification-question section.',
);

for (const boundary of [
  'lender decisions',
  'loan terms',
  'approval',
  'qualification',
  'affordability',
  'buying power',
  'underwriting',
  'credit readiness',
  'lender fit',
  'legal or tax outcomes',
  'valuation',
  'investment merit',
  'suitability',
  'representation',
  'professional advice',
  'consent',
  'fiduciary duties',
  'customer records',
  'CRM classification',
  'email',
  'scheduling',
  'persistence',
  'telemetry',
  'customer profiles',
  'URL context',
  'hidden transfer',
  'recommendations',
  'scores',
  'professional conclusions',
]) {
  assertIncludes(buyerPage, boundary, `Buyer professional boundary must remain present: ${boundary}`);
}

for (const preserved of [
  '<BuyerFinancingReadinessGuide />',
  '<FinancingConfidenceEducation surface="buy" />',
  '<JourneyCohesionPanel',
  'buildBuyerDecisionWorkspace',
  'data-testid="dxt-2-buyer-decision-readiness-depth-expansion"',
  'data-testid="reie-buyer-v8-decision-workspace"',
  'Start With Search',
  'Review Financing Assumptions',
  'Continue Buyer Search',
  'Prepare Advisory Questions',
  'Start General Contact',
  'Am I prepared to buy?',
  "alternates: { canonical: `${SITE_URL}/buy` }",
]) {
  assertIncludes(buyerPage, preserved, `Buyer implementation must preserve existing Buyer surface: ${preserved}`);
}

for (const prohibitedRuntime of [
  "'use client'",
  'useState',
  'useEffect',
  'fetch(',
  'XMLHttpRequest',
  'navigator.sendBeacon',
  'localStorage',
  'sessionStorage',
  'document.cookie',
  '<input',
  '<textarea',
  '<select',
  '<form',
  'FormData',
  'URLSearchParams',
  'router.push',
  'customerProfile',
  'leadScore',
  'recommendedLender',
  'recommendedProperty',
  'buyerProfessionalScore',
  'approvalProbability',
  'qualificationScore',
  'affordabilityScore',
  'buyingPowerScore',
  'creditScoreInterpretation',
]) {
  assertNotIncludes(buyerPage, prohibitedRuntime, `Buyer route must not add protected behavior: ${prohibitedRuntime}`);
}

assertIncludes(
  financingPlanner,
  'data-testid="buyer-financing-decision-planner"',
  'Buyer Financing Planner must remain present in its component.',
);
assertIncludes(
  financingPlanner,
  'data-buyer-financing-planner-approval="false"',
  'Buyer Financing Planner approval boundary must remain unchanged.',
);
assertIncludes(
  financingPlanner,
  'data-buyer-financing-planner-telemetry="false"',
  'Buyer Financing Planner telemetry boundary must remain unchanged.',
);
assertIncludes(
  financingGuide,
  '<BuyerFinancingDecisionPlanner />',
  'Buyer Financing Readiness Guide must remain the owner of the planner composition.',
);
assertIncludes(advisory, 'data-testid="dxt-3-advisory-conversation-preparation"', 'Advisory implementation must remain present.');
assertIncludes(contact, 'data-testid="dxt-3-contact-path-selection-quality"', 'Contact path-selection implementation must remain present.');

for (const phrase of [
  'Status: `DXT_3_BUYER_PROFESSIONAL_PREPARATION_IMPLEMENTED_LOCAL_COMMIT_ONLY`',
  'Certification recommendation: `READY_FOR_DXT_3_BUYER_PROFESSIONAL_PREPARATION_LOCAL_CERTIFICATION`',
  'Runtime authorization: `app/buy/page.tsx`',
  'Buyer Financing Planner changed: `false`',
  'Forms or APIs changed: `false`',
  'Persistence or telemetry changed: `false`',
  'Hidden context added: `false`',
  'Shared runtime component or schema added: `false`',
]) {
  assertIncludes(implementation, phrase, `Implementation record must include: ${phrase}`);
}

assertIncludes(
  chatStart,
  'READY_FOR_REIE_DXT_3_BUYER_PROFESSIONAL_PREPARATION_LOCAL_CERTIFICATION_AND_PUSH_AUTHORIZATION',
  'CHAT_START must record the Buyer Professional Preparation local-certification gate.',
);
assert.equal(
  packageJson.scripts?.['check:dxt-3-buyer-professional-preparation-implementation'],
  'npm run worker:build && node dist/scripts/checkDxt3BuyerProfessionalPreparationImplementation.js',
  'package.json must register the DXT 3 Buyer Professional Preparation implementation check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxt3BuyerProfessionalPreparationImplementation.ts',
  'tsconfig.worker.json must include the DXT 3 Buyer Professional Preparation implementation check.',
);

console.log(
  '[dxt-3-buyer-professional-preparation-implementation] ok: route-local Buyer professional preparation, existing evidence, financing planner preservation, no hidden context, and protected boundaries verified.',
);
