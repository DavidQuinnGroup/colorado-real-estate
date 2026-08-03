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

const contactPlan = read('docs/project-atlas/executive-library/REIE-DXT-WAVE-1E-CONTACT-DECISION-FLOW-IMPLEMENTATION-PLAN.md');
const architecture = read('docs/project-atlas/executive-library/REIE-DXT-WAVE-1E-ADVISORY-CONTACT-ARCHITECTURE-READINESS.md');
const contactPage = read('app/contact/page.tsx');
const propertyInquiryForm = read('components/PropertyInquiryForm.tsx');
const leadCapture = read('components/LeadCapture.tsx');
const propertyInquiryApi = read('app/api/property-inquiry/route.ts');
const saveSearchApi = read('app/api/save-search/route.ts');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');
const chatStart = read('docs/CHAT_START.md');

for (const marker of [
  'DXT_WAVE_1E_CONTACT_DECISION_FLOW_PLAN_READY',
  'No Contact runtime modification is authorized by this record.',
  'What is the simplest appropriate way to begin this conversation?',
  'Field Disposition Assessment',
  'Minimum-Information Strategy',
  'Direct-Entry Behavior',
  'Context-Aware Behavior Without Persistence',
  'Existing submission, CRM, email, scheduling, consent, and privacy behavior must remain unchanged until separately authorized.',
]) {
  assertIncludes(contactPlan, marker, `Contact plan must include marker: ${marker}`);
}

for (const hierarchy of [
  '1. Contact orientation',
  '2. Governing question',
  '3. Concise conversation promise',
  '4. Decision-context selection or recognition',
  '5. Minimum necessary customer information',
  '6. Optional context the customer may provide',
  '7. What happens after submission',
  '8. Consent, privacy, brokerage, and professional boundaries',
  '9. One dominant submit or conversation-starting action',
  '10. Compact alternatives for customers not ready to submit',
]) {
  assertIncludes(contactPlan, hierarchy, `Contact hierarchy must include: ${hierarchy}`);
}

for (const classification of [
  'REQUIRED_AND_JUSTIFIED',
  'OPTIONAL_AND_USEFUL',
  'DUPLICATIVE',
  'PREMATURE',
  'HIGH_FRICTION',
  'PROTECTED_OR_SENSITIVE',
  'REMOVE_FROM_FUTURE_FLOW',
  'EXTERNAL_REVIEW_HOLD',
]) {
  assertIncludes(contactPlan, classification, `Contact field assessment must include: ${classification}`);
}

for (const boundary of [
  'new CRM behavior',
  'new email routing',
  'new automated outreach',
  'new text messaging',
  'new scheduling integration',
  'new lead scoring',
  'new lead prioritization',
  'persistent customer profiles',
  'localStorage or cookie-based decision history',
  'telemetry or analytics expansion',
  'qualification logic',
  'affordability questions',
  'credit questions',
  'protected-class questions',
  'demographic targeting',
  'hidden consent',
  'prechecked marketing consent',
  'representation claims',
  'response-time guarantees',
  'provider expansion',
]) {
  assertIncludes(contactPlan, boundary, `Contact protected boundary must include: ${boundary}`);
}

for (const architectureMarker of [
  'Direct Contact remains valid',
  'visible source route labels',
  'Prohibited automatic data transfer',
  'Property inquiry and city Market LeadCapture remain specialized workflows',
  'Wave 1E planning does not authorize:',
]) {
  assertIncludes(architecture, architectureMarker, `Architecture record must include: ${architectureMarker}`);
}

assertIncludes(contactPage, 'alternates: { canonical: `${SITE_URL}/contact` }', 'Contact canonical must remain present.');
assertIncludes(propertyInquiryForm, "fetch('/api/property-inquiry'", 'Property inquiry endpoint must remain existing route.');
assertIncludes(leadCapture, "fetch('/api/save-search'", 'LeadCapture endpoint must remain existing route.');
assertIncludes(propertyInquiryApi, "schemaVersion: 'reie-property-inquiry-v1'", 'Property inquiry API schema must remain unchanged.');
assertIncludes(saveSearchApi, "schemaVersion: 'reie-save-search-v2'", 'Save-search API schema must remain unchanged.');
assertNotIncludes(contactPage, 'DXT_WAVE_1E_CONTACT_DECISION_FLOW_PLAN_READY', 'Planning marker must not be added to Contact runtime.');

assert.equal(
  packageJson.scripts?.['check:dxt-wave-1e-contact-decision-flow-plan'],
  'npm run worker:build && node dist/scripts/checkDxtWave1eContactDecisionFlowPlan.js',
  'package.json must register Contact Decision Flow planning check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxtWave1eContactDecisionFlowPlan.ts',
  'tsconfig.worker.json must include Contact Decision Flow planning check.',
);
assertIncludes(chatStart, 'DXT_WAVE_1E_CONTACT_DECISION_FLOW_PLAN_READY', 'CHAT_START must record Contact planning status.');

console.log(
  '[dxt-wave-1e-contact-decision-flow-plan] ok: Contact governing question, hierarchy, field assessment, consent/privacy boundaries, protected dependencies, direct entry, runtime prohibition, architecture integration, and certification criteria verified.',
);
