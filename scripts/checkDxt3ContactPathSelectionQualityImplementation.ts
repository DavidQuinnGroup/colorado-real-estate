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

const contact = read('app/contact/page.tsx');
const advisory = read('components/AdvisoryHandoffGuide.tsx');
const propertyInquiry = read('components/PropertyInquiryForm.tsx');
const leadCapture = read('components/LeadCapture.tsx');
const propertyInquiryApi = read('app/api/property-inquiry/route.ts');
const implementation = read(
  'docs/project-atlas/executive-library/REIE-DXT-3-CONTACT-PATH-SELECTION-QUALITY-IMPLEMENTATION.md',
);
const chatStart = read('docs/CHAT_START.md');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const marker of [
  'data-testid="dxt-3-contact-path-selection-quality"',
  'data-dxt-3-contact-path-selection-quality="implemented-local"',
  'data-dxt-3-contact-runtime-scope="app/contact/page.tsx"',
  'data-dxt-3-contact-advisory-change="false"',
  'data-dxt-3-contact-property-inquiry-change="false"',
  'data-dxt-3-contact-lead-capture-change="false"',
  'data-dxt-3-contact-form-change="false"',
  'data-dxt-3-contact-field-change="false"',
  'data-dxt-3-contact-api-change="false"',
  'data-dxt-3-contact-consent-change="false"',
  'data-dxt-3-contact-url-context="false"',
  'data-dxt-3-contact-automatic-routing="false"',
  'data-dxt-3-contact-inferred-intent="false"',
  'data-dxt-3-contact-hidden-context="false"',
  'data-dxt-3-contact-customer-profile="false"',
  'data-dxt-3-contact-persistence="false"',
  'data-dxt-3-contact-telemetry="false"',
]) {
  assertIncludes(contact, marker, `Contact path-selection implementation must preserve marker: ${marker}`);
}

for (const phrase of [
  'What is the simplest appropriate way to begin this conversation?',
  'What is the safest and simplest path to begin the right professional conversation?',
  'Public context available',
  'What remains unconfirmed',
  'Assumptions and unknowns',
  'Path-selection questions',
  'Is the question about one specific Property?',
  'Do I need to organize evidence and questions before speaking with someone?',
  'Am I beginning a general conversation?',
  'Do I need Buyer preparation?',
  'Do I need Seller preparation?',
  'Do I need more research before beginning a conversation?',
  'Property Inquiry',
  'Advisory',
  'General Contact',
  'Buyer Preparation',
  'Seller Preparation',
  'Continued Research',
  'What REIE cannot determine',
  'Choose The Starting Point',
]) {
  assertIncludes(contact, phrase, `Contact path-selection implementation must include: ${phrase}`);
}

for (const destination of [
  "href: '/search'",
  "href: '#advisory-readiness'",
  'href="#contact-route-choice"',
  'href="#contact-route-choice"',
  "href: '/buy'",
  "href: '/sell'",
  "href: '/market'",
  '<AdvisoryHandoffGuide />',
  'alternates: { canonical: `${SITE_URL}/contact` }',
]) {
  assertIncludes(contact, destination, `Contact path-selection implementation must preserve destination: ${destination}`);
}

assert.equal(
  (contact.match(/Choose The Starting Point/g) || []).length,
  1,
  'Contact must preserve exactly one dominant Contact action label.',
);
assertBefore(
  contact,
  'What is the safest and simplest path to begin the right professional conversation?',
  'Path-selection questions',
  'Path-selection question must precede static questions.',
);
assertBefore(
  contact,
  "label: 'Property Inquiry'",
  "label: 'Advisory'",
  'Property Inquiry pathway must remain before Advisory in the path-selection hierarchy.',
);
assertBefore(
  contact,
  "label: 'Advisory'",
  "label: 'General Contact'",
  'Advisory pathway must remain before general Contact in the path-selection hierarchy.',
);

for (const boundary of [
  'does not infer intent',
  'choose a path automatically',
  'save a choice',
  'prefill a form',
  'transfer hidden',
  'Route choice does not create advice',
  'representation',
  'fiduciary',
  'marketing consent',
  'professional',
  'response-time certainty',
  'lending approval',
  'affordability',
  'appraisal',
  'valuation',
  'pricing',
  'legal',
  'tax',
  'investment',
  'suitability',
  'neighborhood-fit',
  'fair-housing',
]) {
  assertIncludes(contact, boundary, `Contact protected boundary must remain present: ${boundary}`);
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
  'leadScore',
  'customerProfile',
  '/api/property-inquiry',
  '/api/save-search',
]) {
  assertNotIncludes(contact, prohibitedRuntime, `Contact must not add protected runtime behavior: ${prohibitedRuntime}`);
}

assertIncludes(advisory, 'data-testid="dxt-3-advisory-conversation-preparation"', 'Advisory implementation must remain present.');
assertIncludes(advisory, 'id="advisory-readiness"', 'Advisory readiness anchor must remain present.');
assertIncludes(advisory, 'id="advisory-contact-transition"', 'Advisory transition anchor must remain present.');
assertIncludes(propertyInquiry, "fetch('/api/property-inquiry'", 'Property Inquiry form must remain the owner of submission behavior.');
assertIncludes(leadCapture, "fetch('/api/save-search'", 'LeadCapture must remain the owner of saved-search behavior.');
assertIncludes(propertyInquiryApi, "schemaVersion: 'reie-property-inquiry-v1'", 'Property Inquiry API schema must remain unchanged.');

for (const phrase of [
  'Status: `DXT_3_CONTACT_PATH_SELECTION_QUALITY_IMPLEMENTED_LOCAL_COMMIT_ONLY`',
  '`READY_FOR_DXT_3_CONTACT_PATH_SELECTION_QUALITY_LOCAL_CERTIFICATION`',
  'Runtime authorization: `app/contact/page.tsx`',
  'Advisory runtime changed: `false`',
  'PropertyInquiryForm changed: `false`',
  'LeadCapture changed: `false`',
  'Forms or APIs changed: `false`',
  'Persistence or telemetry changed: `false`',
  'Shared runtime component or schema added: `false`',
]) {
  assertIncludes(implementation, phrase, `Implementation record must include: ${phrase}`);
}

assertIncludes(
  chatStart,
  'READY_FOR_REIE_DXT_3_CONTACT_PATH_SELECTION_QUALITY_LOCAL_CERTIFICATION_AND_PUSH_AUTHORIZATION',
  'CHAT_START must record the Contact path-selection local-certification gate.',
);
assert.equal(
  packageJson.scripts?.['check:dxt-3-contact-path-selection-quality-implementation'],
  'npm run worker:build && node dist/scripts/checkDxt3ContactPathSelectionQualityImplementation.js',
  'package.json must register the DXT 3 Contact path-selection implementation check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxt3ContactPathSelectionQualityImplementation.ts',
  'tsconfig.worker.json must include the DXT 3 Contact path-selection implementation check.',
);

console.log('[dxt-3-contact-path-selection-quality-implementation] ok: route-local Contact path selection, static pathways, anchors, no hidden context, no forms, and protected boundaries verified.');
