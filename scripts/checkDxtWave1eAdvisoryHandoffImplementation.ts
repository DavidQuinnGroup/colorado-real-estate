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

const advisoryGuide = read('components/AdvisoryHandoffGuide.tsx');
const contactPage = read('app/contact/page.tsx');
const advisoryPlan = read('docs/project-atlas/executive-library/REIE-DXT-WAVE-1E-ADVISORY-HANDOFF-IMPLEMENTATION-PLAN.md');
const contactCertification = read('docs/project-atlas/executive-library/REIE-DXT-WAVE-1E-CONTACT-DECISION-FLOW-FOUNDATION-CERTIFICATION.md');
const implementationRecord = read('docs/project-atlas/executive-library/REIE-DXT-WAVE-1E-ADVISORY-HANDOFF-FOUNDATION-IMPLEMENTATION.md');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');
const chatStart = read('docs/CHAT_START.md');

for (const marker of [
  'data-testid="advisory-handoff-readiness-guide"',
  'id="advisory-readiness"',
  'data-advisory-handoff-route="/contact#advisory-readiness"',
  'data-advisory-handoff-presentational="true"',
  'data-advisory-handoff-persistence="false"',
  'data-advisory-handoff-automation="false"',
  'data-advisory-handoff-hidden-context-transfer="false"',
  'data-advisory-handoff-new-contact-fields="false"',
  'data-advisory-handoff-crm="false"',
  'data-advisory-handoff-email="false"',
  'data-advisory-handoff-telemetry="false"',
  'data-advisory-handoff-primary-action="begin-focused-conversation"',
]) {
  assertIncludes(advisoryGuide, marker, `Advisory implementation must preserve marker: ${marker}`);
}

for (const phrase of [
  'What should I understand and prepare before beginning a focused professional conversation?',
  'Advisory prepares the conversation before Contact begins it.',
  'Begin A Focused Conversation',
  'Decision Context',
  'Evidence Already Reviewed',
  'Professional Discussion',
  'What Advisory Does Not Establish',
  'Use Contact when the questions are organized.',
]) {
  assertIncludes(advisoryGuide, phrase, `Advisory implementation must include: ${phrase}`);
}

assert.equal(
  (advisoryGuide.match(/Begin A Focused Conversation/g) || []).length,
  1,
  'Advisory implementation must expose exactly one dominant primary action label.',
);
assertIncludes(advisoryGuide, 'href="#advisory-contact-transition"', 'Primary action must scroll to the non-mutating Contact transition.');
assertIncludes(advisoryGuide, 'id="advisory-contact-transition"', 'Safe Contact transition anchor must be present.');
assertBefore(
  advisoryGuide,
  'What should I understand and prepare before beginning a focused professional conversation?',
  'Begin A Focused Conversation',
  'Governing question must precede the dominant action.',
);
assertBefore(
  advisoryGuide,
  'Decision Context',
  'Evidence Already Reviewed',
  'Decision context must precede reviewed evidence.',
);
assertBefore(
  advisoryGuide,
  'Evidence Already Reviewed',
  'Professional Discussion',
  'Reviewed evidence must precede professional discussion prompts.',
);
assertBefore(
  advisoryGuide,
  'Professional Discussion',
  'What Advisory Does Not Establish',
  'Professional discussion prompts must precede explicit limits.',
);

for (const context of [
  'Buyer preparation',
  'Seller preparation',
  'Market interpretation',
  'Neighborhood investigation',
  'Property evaluation',
  'General decision review',
]) {
  assertIncludes(advisoryGuide, `label: '${context}'`, `Static context must remain present: ${context}`);
}

for (const boundary of [
  'does not create a generic form',
  'change fields',
  'submit customer information',
  'create CRM work',
  'send email',
  'schedule a meeting',
  'pass hidden context',
  'does not automatically create a brokerage relationship',
  'approve financing',
  'determine affordability',
  'publish an appraisal',
  'certify valuation',
  'guarantee pricing',
  'guarantee outcomes',
  'rank providers',
  'suitability conclusions',
]) {
  assertIncludes(advisoryGuide, boundary, `Protected boundary must remain present: ${boundary}`);
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
  'PrismaClient',
  'sendPropertyInquiryNotification',
  'sendEmail',
]) {
  assertNotIncludes(advisoryGuide, prohibitedRuntime, `Advisory implementation must remain presentational: ${prohibitedRuntime}`);
}

assertIncludes(contactPage, '<AdvisoryHandoffGuide />', 'Contact page must continue hosting Advisory.');
assertIncludes(contactPage, 'alternates: { canonical: `${SITE_URL}/contact` }', 'Contact canonical must remain unchanged.');
assertNotIncludes(contactPage, 'Begin A Focused Conversation', 'Contact runtime must not be converted into Contact Decision Flow implementation.');
assertIncludes(advisoryPlan, 'DXT_WAVE_1E_ADVISORY_HANDOFF_PLAN_READY', 'Advisory plan must remain present.');
assertIncludes(contactCertification, 'REIE_DXT_WAVE_1E_CONTACT_DECISION_FLOW_FOUNDATION_CERTIFIED', 'Contact foundation certification must be present.');
assertIncludes(implementationRecord, 'DXT_WAVE_1E_ADVISORY_HANDOFF_FOUNDATION_IMPLEMENTED_LOCAL_COMMIT_ONLY', 'Advisory implementation record must be present.');
assert.equal(
  packageJson.scripts?.['check:dxt-wave-1e-advisory-handoff-implementation'],
  'npm run worker:build && node dist/scripts/checkDxtWave1eAdvisoryHandoffImplementation.js',
  'package.json must register Advisory implementation check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxtWave1eAdvisoryHandoffImplementation.ts',
  'tsconfig.worker.json must include Advisory implementation check.',
);
assertIncludes(
  chatStart,
  'DXT_WAVE_1E_ADVISORY_HANDOFF_FOUNDATION_IMPLEMENTED_LOCAL_COMMIT_ONLY',
  'CHAT_START must record Advisory implementation status.',
);

console.log(
  '[dxt-wave-1e-advisory-handoff-implementation] ok: Advisory governing question, presentational hierarchy, dominant action, safe Contact transition, static context, evidence preparation, professional boundaries, runtime isolation, Contact foundation certification, docs, and registry entries verified.',
);
