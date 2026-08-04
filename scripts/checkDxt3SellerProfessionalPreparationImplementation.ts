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

const sellerPage = read('app/sell/page.tsx');
const homeValueEstimator = read('components/HomeValueEstimator.tsx');
const advisory = read('components/AdvisoryHandoffGuide.tsx');
const contact = read('app/contact/page.tsx');
const implementation = read(
  'docs/project-atlas/executive-library/REIE-DXT-3-SELLER-PROFESSIONAL-PREPARATION-IMPLEMENTATION.md',
);
const chatStart = read('docs/CHAT_START.md');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const marker of [
  'data-testid="dxt-3-seller-professional-preparation"',
  'data-dxt-3-seller-professional-preparation="implemented-local"',
  'data-dxt-3-seller-professional-runtime-scope="app/sell/page.tsx"',
  'data-dxt-3-seller-professional-existing-evidence-only="true"',
  'data-dxt-3-seller-professional-estimator-change="false"',
  'data-dxt-3-seller-professional-advisory-change="false"',
  'data-dxt-3-seller-professional-contact-change="false"',
  'data-dxt-3-seller-professional-api-change="false"',
  'data-dxt-3-seller-professional-form-change="false"',
  'data-dxt-3-seller-professional-hidden-context="false"',
  'data-dxt-3-seller-professional-url-context="false"',
  'data-dxt-3-seller-professional-persistence="false"',
  'data-dxt-3-seller-professional-telemetry="false"',
  'data-dxt-3-seller-professional-customer-profile="false"',
  'data-dxt-3-seller-professional-shared-runtime="false"',
]) {
  assertIncludes(sellerPage, marker, `Seller professional preparation must preserve marker: ${marker}`);
}

for (const phrase of [
  'Seller Professional Preparation',
  'What should I organize before beginning a professional conversation about selling?',
  'Evidence currently available',
  'Evidence requiring verification',
  'Property-condition assumptions',
  'Pricing-context assumptions',
  'Material unknowns',
  'Questions to carry forward',
  'Conversation priorities',
  'Appropriate professional pathway',
  'What REIE cannot determine',
  'Next preparation steps',
  'Privacy, consent, representation, valuation, legal, tax, and professional boundaries remain unchanged.',
  'visible in this public experience',
  'collect answers',
  'save choices',
  'prefill forms',
  'expand URLs',
  'transfer hidden Seller context',
]) {
  assertIncludes(sellerPage, phrase, `Seller professional preparation must include: ${phrase}`);
}

for (const pathway of [
  "label: 'Seller Review'",
  "href: '#seller-intake'",
  "label: 'Advisory'",
  "href: '/contact#advisory-readiness'",
  "label: 'General Contact'",
  "href: '/contact#contact-route-choice'",
  "label: 'Continue Research'",
  "href: '/market'",
]) {
  assertIncludes(sellerPage, pathway, `Seller professional preparation must preserve pathway: ${pathway}`);
}

assertBefore(
  sellerPage,
  'data-testid="dxt-2-seller-decision-readiness-depth-expansion"',
  'data-testid="dxt-3-seller-professional-preparation"',
  'DXT 3 Seller professional preparation must build after the DXT 2 readiness layer.',
);
assertBefore(
  sellerPage,
  'data-testid="dxt-3-seller-professional-preparation"',
  'data-dxt-seller-hierarchy-role="tool-or-evidence-continuation"',
  'DXT 3 Seller professional preparation must precede the existing tool and evidence continuation.',
);

for (const boundary of [
  'value',
  'listing price',
  'sale price',
  'timing',
  'negotiation strategy',
  'tax position',
  'legal position',
  'investment merit',
  'representation status',
  'professional conclusions',
  'professional advice',
  'consent',
  'private records',
  'estimator inputs',
  'pricing assumptions',
  'customer information',
  'public URLs',
]) {
  assertIncludes(sellerPage, boundary, `Seller professional boundary must remain present: ${boundary}`);
}

for (const preserved of [
  '<HomeValueEstimator />',
  '<JourneyCohesionPanel',
  'data-testid="dxt-2-seller-decision-readiness-depth-expansion"',
  'data-testid="reie-seller-professional-handoff"',
  'data-testid="seller-readiness-entry"',
  'data-testid="seller-intake-section"',
  'Request Seller Review',
  'Review Home Worth context',
  'Inspect Market context',
  'Review competing inventory',
  'Prepare Advisory questions',
  'Begin general Contact',
  'What must be understood before market exposure?',
  "alternates: { canonical: `${SITE_URL}/sell` }",
]) {
  assertIncludes(sellerPage, preserved, `Seller implementation must preserve existing Seller surface: ${preserved}`);
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
  'sellerProfessionalScore',
  'valuationScore',
  'pricingScore',
  'saleProbability',
  'recommendedListPrice',
  'predictedSalePrice',
  'recommendedTiming',
  'recommendedStrategy',
]) {
  assertNotIncludes(sellerPage, prohibitedRuntime, `Seller route must not add protected behavior: ${prohibitedRuntime}`);
}

assertIncludes(
  homeValueEstimator,
  'data-testid="seller-intake-form"',
  'Home Value Estimator/Seller intake surface must remain present in its component.',
);
assertIncludes(
  homeValueEstimator,
  'data-conversion-automated-valuation="false"',
  'Home Value Estimator automated-valuation boundary must remain unchanged.',
);
assertIncludes(
  homeValueEstimator,
  'Submitting this form requests follow-up only.',
  'Home Value Estimator/Seller intake privacy boundary must remain unchanged.',
);
assertIncludes(advisory, 'data-testid="dxt-3-advisory-conversation-preparation"', 'Advisory implementation must remain present.');
assertIncludes(contact, 'data-testid="dxt-3-contact-path-selection-quality"', 'Contact path-selection implementation must remain present.');

for (const phrase of [
  'Status: `DXT_3_SELLER_PROFESSIONAL_PREPARATION_IMPLEMENTED_LOCAL_COMMIT_ONLY`',
  'Certification recommendation: `READY_FOR_DXT_3_SELLER_PROFESSIONAL_PREPARATION_LOCAL_CERTIFICATION`',
  'Runtime authorization: `app/sell/page.tsx`',
  'Home Value Estimator changed: `false`',
  'Forms or APIs changed: `false`',
  'Persistence or telemetry changed: `false`',
  'Hidden context added: `false`',
  'Shared runtime component or schema added: `false`',
]) {
  assertIncludes(implementation, phrase, `Implementation record must include: ${phrase}`);
}

assertIncludes(
  chatStart,
  'READY_FOR_REIE_DXT_3_SELLER_PROFESSIONAL_PREPARATION_LOCAL_CERTIFICATION_AND_PUSH_AUTHORIZATION',
  'CHAT_START must record the Seller Professional Preparation local-certification gate.',
);
assert.equal(
  packageJson.scripts?.['check:dxt-3-seller-professional-preparation-implementation'],
  'npm run worker:build && node dist/scripts/checkDxt3SellerProfessionalPreparationImplementation.js',
  'package.json must register the DXT 3 Seller Professional Preparation implementation check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxt3SellerProfessionalPreparationImplementation.ts',
  'tsconfig.worker.json must include the DXT 3 Seller Professional Preparation implementation check.',
);

console.log(
  '[dxt-3-seller-professional-preparation-implementation] ok: route-local Seller professional preparation, existing evidence, estimator preservation, no hidden context, and protected boundaries verified.',
);
