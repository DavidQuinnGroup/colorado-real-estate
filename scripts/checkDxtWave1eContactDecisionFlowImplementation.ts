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

const contactPage = read('app/contact/page.tsx');
const advisoryGuide = read('components/AdvisoryHandoffGuide.tsx');
const propertyInquiryForm = read('components/PropertyInquiryForm.tsx');
const leadCapture = read('components/LeadCapture.tsx');
const propertyInquiryApi = read('app/api/property-inquiry/route.ts');
const saveSearchApi = read('app/api/save-search/route.ts');
const implementationRecord = read('docs/project-atlas/executive-library/REIE-DXT-WAVE-1E-CONTACT-DECISION-FLOW-IMPLEMENTATION.md');
const completionAssessment = read('docs/project-atlas/executive-library/REIE-DXT-WAVE-1E-COMPLETION-ASSESSMENT.md');
const contactFoundationClosure = read('docs/project-atlas/executive-library/REIE-DXT-WAVE-1E-CONTACT-DECISION-FLOW-FOUNDATION-CLOSURE.md');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');
const chatStart = read('docs/CHAT_START.md');

for (const marker of [
  'data-testid="contact-decision-flow"',
  'data-dxt-contact-decision-flow="implemented"',
  'data-dxt-contact-runtime-scope="app/contact/page.tsx"',
  'data-dxt-contact-generic-form="false"',
  'data-dxt-contact-new-fields="false"',
  'data-dxt-contact-api-change="false"',
  'data-dxt-contact-crm="false"',
  'data-dxt-contact-email="false"',
  'data-dxt-contact-scheduling="false"',
  'data-dxt-contact-persistence="false"',
  'data-dxt-contact-telemetry="false"',
  'data-dxt-contact-hidden-context="false"',
  'data-testid="contact-conversation-promise"',
  'data-testid="contact-decision-contexts"',
  'data-testid="contact-minimum-information"',
  'data-testid="contact-optional-context"',
  'data-testid="contact-what-happens-next"',
  'data-testid="contact-professional-boundaries"',
  'data-testid="contact-route-choice"',
  'data-testid="contact-decision-primary-action"',
  'data-dxt-contact-primary-action="choose-starting-point"',
]) {
  assertIncludes(contactPage, marker, `Contact implementation must preserve marker: ${marker}`);
}

for (const phrase of [
  'What is the simplest appropriate way to begin this conversation?',
  'Contact helps route a question to the safest existing conversation path.',
  'Property question',
  'Market or place question',
  'Buyer or seller preparation',
  'Minimum useful information',
  'Optional context',
  'What happens next',
  'Professional and privacy boundaries',
  'Choose The Starting Point',
  'Customers who are not ready to submit can return to',
  'Public phone, office address, and branded contact email are not published',
]) {
  assertIncludes(contactPage, phrase, `Contact implementation must include: ${phrase}`);
}

assert.equal(
  (contactPage.match(/Choose The Starting Point/g) || []).length,
  1,
  'Contact implementation must expose exactly one dominant Contact action label.',
);
assertIncludes(contactPage, 'href="#contact-route-choice"', 'Dominant Contact action must use an in-page non-mutating route choice.');
assertIncludes(contactPage, '<AdvisoryHandoffGuide />', 'Contact implementation must preserve Advisory section hosting.');
assertIncludes(contactPage, 'alternates: { canonical: `${SITE_URL}/contact` }', 'Contact canonical must remain unchanged.');
assertBefore(
  contactPage,
  'What is the simplest appropriate way to begin this conversation?',
  'Minimum useful information',
  'Governing question must precede minimum-information guidance.',
);
assertBefore(
  contactPage,
  'Minimum useful information',
  'Professional and privacy boundaries',
  'Minimum-information guidance must precede professional boundaries.',
);
assertBefore(
  contactPage,
  '<AdvisoryHandoffGuide />',
  'Contact Routes',
  'Advisory integration must remain before route-specific continuations.',
);

for (const boundary of [
  'does not create a new form',
  'change submission behavior',
  'turn preparation into qualification',
  'does not itself establish representation',
  'legal advice',
  'tax advice',
  'lending approval',
  'qualification',
  'affordability',
  'appraisal',
  'valuation certainty',
  'pricing certainty',
  'outcome certainty',
  'investment recommendations',
  'suitability conclusions',
  'fair-housing or protected-class guidance',
  'AI advisory',
  'provider rankings',
  'response-time promises',
  'persistence',
  'telemetry',
  'hidden context',
  'CRM behavior',
  'email behavior',
  'scheduling behavior',
  'form submission',
]) {
  assertIncludes(contactPage, boundary, `Contact protected boundary must remain present: ${boundary}`);
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
  '/api/property-inquiry',
  '/api/save-search',
  'PrismaClient',
  'sendPropertyInquiryNotification',
  'sendEmail',
]) {
  assertNotIncludes(contactPage, prohibitedRuntime, `Contact implementation must not add protected runtime behavior: ${prohibitedRuntime}`);
}

assertIncludes(advisoryGuide, 'id="advisory-readiness"', 'Advisory readiness anchor must remain present.');
assertIncludes(advisoryGuide, 'id="advisory-contact-transition"', 'Advisory contact transition anchor must remain present.');
assertIncludes(advisoryGuide, 'Begin A Focused Conversation', 'Advisory dominant action must remain present.');
assertIncludes(propertyInquiryForm, "fetch('/api/property-inquiry'", 'Property inquiry workflow must remain owned by existing form.');
assertIncludes(leadCapture, "fetch('/api/save-search'", 'LeadCapture workflow must remain owned by existing form.');
assertIncludes(propertyInquiryApi, "schemaVersion: 'reie-property-inquiry-v1'", 'Property inquiry API schema must remain unchanged.');
assertIncludes(saveSearchApi, "schemaVersion: 'reie-save-search-v2'", 'Save-search API schema must remain unchanged.');
assertIncludes(
  contactFoundationClosure,
  'REIE_DXT_WAVE_1E_CONTACT_DECISION_FLOW_FOUNDATION_CERTIFIED_AND_CLOSED',
  'Contact foundation closure must remain certified.',
);
assertIncludes(
  implementationRecord,
  'DXT_WAVE_1E_CONTACT_DECISION_FLOW_IMPLEMENTED_LOCAL_COMMIT_ONLY',
  'Contact implementation record must be present.',
);
assertIncludes(
  completionAssessment,
  'DXT_WAVE_1E_COMPLETION_ASSESSMENT_READY',
  'Wave 1E completion assessment must be present.',
);
assert.equal(
  packageJson.scripts?.['check:dxt-wave-1e-contact-decision-flow-implementation'],
  'npm run worker:build && node dist/scripts/checkDxtWave1eContactDecisionFlowImplementation.js',
  'package.json must register Contact implementation check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxtWave1eContactDecisionFlowImplementation.ts',
  'tsconfig.worker.json must include Contact implementation check.',
);
assertIncludes(
  chatStart,
  'DXT_WAVE_1E_CONTACT_DECISION_FLOW_IMPLEMENTED_LOCAL_COMMIT_ONLY',
  'CHAT_START must record Contact implementation status.',
);
assertIncludes(
  chatStart,
  'READY_FOR_REIE_DXT_WAVE_1E_CONTACT_DECISION_FLOW_LOCAL_CERTIFICATION_AND_PUSH_AUTHORIZATION',
  'CHAT_START must record Contact local certification and push gate.',
);

console.log(
  '[dxt-wave-1e-contact-decision-flow-implementation] ok: Contact governing question, concise conversation flow, Advisory preservation, in-page dominant action, no generic form, no new fields, no submission behavior, protected dependencies, docs, and registry entries verified.',
);
