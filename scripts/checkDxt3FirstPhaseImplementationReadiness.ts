import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

const readiness = read('docs/project-atlas/executive-library/REIE-DXT-3-FIRST-PHASE-IMPLEMENTATION-READINESS.md');
const chatStart = read('docs/CHAT_START.md');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'Status: `DXT_3_FIRST_PHASE_IMPLEMENTATION_READINESS_READY`',
  'Selected primary phase: `PROPERTY_PROFESSIONAL_PREPARATION`',
  'Selected secondary planning phase: `ADVISORY_CONVERSATION_PREPARATION`',
  'Deferred phase: `PROPERTY_INQUIRY_PREPARATION_QUALITY`',
  'Runtime authorization: `false`',
  'After evaluating this property, what should I organize before asking a property-specific question or beginning a focused professional conversation?',
  '`app/properties/[id]/page.tsx`',
  '`components/PropertyInquiryForm.tsx`',
  'Property Inquiry: dominant when the customer has a specific question about the listing.',
  'Advisory: preparation path when public evidence and assumptions need organization before a focused conversation.',
  'Contact: subordinate general starting point when the question is broader than one property.',
  'READY_FOR_REIE_DXT_3_PROPERTY_PROFESSIONAL_PREPARATION_BOUNDED_IMPLEMENTATION_AUTHORIZATION',
  'READY_FOR_REIE_DXT_3_ADVISORY_CONVERSATION_PREPARATION_PLANNING_AUTHORIZATION',
  '`READY_FOR_DXT_3_PLANNING_CERTIFICATION`',
]) {
  assertIncludes(readiness, phrase, `DXT 3 first-phase readiness must include: ${phrase}`);
}

for (const candidate of [
  'Property Professional Preparation',
  'Buyer Professional Preparation',
  'Seller Professional Preparation',
  'Advisory Conversation Preparation',
  'Contact Path Selection Quality',
  'Property Inquiry Preparation Quality',
  'Market / Neighborhood Professional Question Preparation',
  'Cross-Route Professional Preparation Standard',
  'DXT 3 Foundation Only',
]) {
  assertIncludes(readiness, candidate, `DXT 3 first-phase readiness must assess candidate: ${candidate}`);
}

for (const prohibited of [
  'No hidden context.',
  'No automatic transfer.',
  'No persistence.',
  'No telemetry.',
  'No customer profile.',
  'No unsubmitted form content transfer.',
  'Existing Property Inquiry consent and privacy behavior remain unchanged.',
]) {
  assertIncludes(readiness, prohibited, `DXT 3 first-phase readiness must preserve: ${prohibited}`);
}

assertIncludes(
  chatStart,
  'READY_FOR_REIE_DXT_3_ADVISORY_CONVERSATION_PREPARATION_PLANNING_AUTHORIZATION',
  'CHAT_START must record the DXT 3 secondary planning gate.',
);
assert.equal(
  packageJson.scripts?.['check:dxt-3-first-phase-implementation-readiness'],
  'npm run worker:build && node dist/scripts/checkDxt3FirstPhaseImplementationReadiness.js',
  'package.json must register the DXT 3 first-phase readiness check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxt3FirstPhaseImplementationReadiness.ts',
  'tsconfig.worker.json must include the DXT 3 first-phase readiness check.',
);

console.log('[dxt-3-first-phase-implementation-readiness] ok: candidate comparison, selected Property phase, secondary Advisory planning gate, and certification criteria verified.');
