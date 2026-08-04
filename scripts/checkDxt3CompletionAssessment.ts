import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

const assessment = read('docs/project-atlas/executive-library/REIE-DXT-3-COMPLETION-ASSESSMENT.md');
const chatStart = read('docs/CHAT_START.md');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'Status: `DXT_3_COMPLETION_ASSESSMENT_READY_FOR_PROGRAM_CLOSURE_CERTIFICATION`',
  'Assessment mode: `DOCUMENTATION_AND_DETERMINISTIC_ASSESSMENT_ONLY`',
  'Runtime authorization: `false`',
  'Primary determination: `DXT_3_COMPLETE_WITH_ACCEPTED_LIMITATIONS_READY_FOR_PROGRAM_CLOSURE_CERTIFICATION`',
  'Recommended next gate: `READY_FOR_REIE_DXT_3_PROGRAM_CLOSURE_CERTIFICATION`',
  'Material gap count: `0`',
  'Accepted limitation count: `7`',
  'External-review hold count: `1`',
  'Protected-system hold count: `3`',
]) {
  assertIncludes(assessment, phrase, `DXT 3 completion assessment must include: ${phrase}`);
}

for (const status of [
  '`REIE_DXT_3_PROPERTY_PROFESSIONAL_PREPARATION_CERTIFIED_AND_CLOSED`',
  '`REIE_DXT_3_ADVISORY_CONVERSATION_PREPARATION_CERTIFIED_AND_CLOSED`',
  '`REIE_DXT_3_CONTACT_PATH_SELECTION_QUALITY_CERTIFIED_AND_CLOSED`',
  '`REIE_DXT_3_BUYER_PROFESSIONAL_PREPARATION_CERTIFIED_AND_CLOSED`',
  '`REIE_DXT_3_SELLER_PROFESSIONAL_PREPARATION_CERTIFIED_AND_CLOSED`',
]) {
  assertIncludes(assessment, status, `DXT 3 completion assessment must include completed phase: ${status}`);
}

assertIncludes(
  chatStart,
  'READY_FOR_REIE_DXT_3_PROGRAM_CLOSURE_CERTIFICATION',
  'CHAT_START must record the DXT 3 program closure certification gate.',
);
assert.equal(
  packageJson.scripts?.['check:dxt-3-completion-assessment'],
  'npm run worker:build && node dist/scripts/checkDxt3CompletionAssessment.js',
  'package.json must register the DXT 3 completion assessment check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxt3CompletionAssessment.ts',
  'tsconfig.worker.json must include the DXT 3 completion assessment check.',
);

console.log('[dxt-3-completion-assessment] ok: completed phases, accepted limitations, material gap count, and program-closure gate verified.');
