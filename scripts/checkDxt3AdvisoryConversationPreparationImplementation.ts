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

const advisory = read('components/AdvisoryHandoffGuide.tsx');
const contact = read('app/contact/page.tsx');
const implementation = read(
  'docs/project-atlas/executive-library/REIE-DXT-3-ADVISORY-CONVERSATION-PREPARATION-IMPLEMENTATION.md',
);
const chatStart = read('docs/CHAT_START.md');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'data-testid="dxt-3-advisory-conversation-preparation"',
  'Advisory Conversation Preparation',
  'What should I understand and prepare before beginning a focused professional conversation?',
  'Decision being prepared',
  'Evidence reviewed or available',
  'Evidence still needed',
  'Assumptions',
  'Unknowns',
  'Questions to verify',
  'Conversation Priorities',
  'dxt-3-advisory-pathway-choice',
  'Advisory prepares',
  'Contact begins',
  'Property Inquiry stays specialized',
  'dxt-3-advisory-reie-limits',
  'Begin A Focused Conversation',
]) {
  assertIncludes(advisory, phrase, `Advisory component must include DXT 3 preparation phrase: ${phrase}`);
}

for (const boundary of [
  'data-dxt-3-advisory-runtime-scope="components/AdvisoryHandoffGuide.tsx"',
  'data-dxt-3-advisory-contact-host-change="false"',
  'data-dxt-3-advisory-property-inquiry-change="false"',
  'data-dxt-3-advisory-form-change="false"',
  'data-dxt-3-advisory-api-change="false"',
  'data-dxt-3-advisory-url-context="false"',
  'data-dxt-3-advisory-form-prefill="false"',
  'data-dxt-3-advisory-customer-profile="false"',
  'data-advisory-handoff-hidden-context-transfer="false"',
  'data-advisory-handoff-persistence="false"',
  'data-advisory-handoff-telemetry="false"',
  'data-advisory-handoff-crm="false"',
  'data-advisory-handoff-email="false"',
]) {
  assertIncludes(advisory, boundary, `Advisory component must preserve boundary: ${boundary}`);
}

for (const destination of [
  'id="advisory-readiness"',
  'href="#advisory-contact-transition"',
  'id="advisory-contact-transition"',
  'href="/contact"',
]) {
  assertIncludes(advisory, destination, `Advisory component must preserve anchor/destination: ${destination}`);
}

for (const prohibited of [
  'useState',
  'useEffect',
  'localStorage',
  'sessionStorage',
  'document.cookie',
  'URLSearchParams',
  'router.push',
  'formPrefill',
  'leadScore',
]) {
  assertNotIncludes(advisory, prohibited, `Advisory implementation must not add prohibited runtime behavior: ${prohibited}`);
}

assertNotIncludes(
  contact,
  'data-dxt-3-advisory-conversation-preparation="implemented-local"',
  'Contact host must not own the DXT 3 Advisory implementation.',
);

for (const phrase of [
  'Status: `DXT_3_ADVISORY_CONVERSATION_PREPARATION_IMPLEMENTED_LOCAL_COMMIT_ONLY`',
  '`READY_FOR_DXT_3_ADVISORY_CONVERSATION_PREPARATION_LOCAL_CERTIFICATION`',
  'Runtime authorization: `components/AdvisoryHandoffGuide.tsx`',
  'Contact host changed: `false`',
  'PropertyInquiryForm changed: `false`',
  'LeadCapture changed: `false`',
  'Forms or APIs changed: `false`',
  'Persistence or telemetry changed: `false`',
  'Shared runtime component or schema added: `false`',
  'Brokerage disclosure remains `EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING`.',
]) {
  assertIncludes(implementation, phrase, `Implementation record must include: ${phrase}`);
}

assertIncludes(
  chatStart,
  'READY_FOR_REIE_DXT_3_ADVISORY_CONVERSATION_PREPARATION_LOCAL_CERTIFICATION_AND_PUSH_AUTHORIZATION',
  'CHAT_START must record the Advisory conversation preparation local-certification gate.',
);
assert.equal(
  packageJson.scripts?.['check:dxt-3-advisory-conversation-preparation-implementation'],
  'npm run worker:build && node dist/scripts/checkDxt3AdvisoryConversationPreparationImplementation.js',
  'package.json must register the DXT 3 Advisory conversation preparation implementation check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxt3AdvisoryConversationPreparationImplementation.ts',
  'tsconfig.worker.json must include the DXT 3 Advisory conversation preparation implementation check.',
);

console.log('[dxt-3-advisory-conversation-preparation-implementation] ok: route-local Advisory preparation, anchors, no hidden context, no Contact host change, and protected boundaries verified.');
