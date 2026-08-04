import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

const architecture = read('docs/project-atlas/executive-library/REIE-DXT-3-DECISION-QUALITY-PROFESSIONAL-PREPARATION-ARCHITECTURE.md');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'Status: `DXT_3_PROFESSIONAL_PREPARATION_ARCHITECTURE_READY`',
  'Program: `DXT_3_DECISION_QUALITY_AND_PROFESSIONAL_PREPARATION`',
  'Shared runtime finding: `ROUTE_LOCAL_OR_EXISTING_COMPONENTS_PREFERRED`',
  'Shared runtime component required: `false`',
  'Shared runtime schema required: `false`',
  'Customer decision being prepared',
  'Evidence already reviewed',
  'Evidence still missing',
  'Assumptions being used',
  'Unknowns',
  'Customer-selected conversation priority',
  'Appropriate professional pathway',
]) {
  assertIncludes(architecture, phrase, `DXT 3 architecture must include: ${phrase}`);
}

for (const term of [
  'Evidence reviewed',
  'Evidence still needed',
  'Assumption',
  'Unknown',
  'Question to verify',
  'Conversation priority',
  'Professional review',
  'Specialized inquiry',
  'General Contact',
  'Representation boundary',
  'Advice boundary',
  'Privacy boundary',
  'Consent boundary',
  'Next professional step',
]) {
  assertIncludes(architecture, term, `DXT 3 architecture must define term: ${term}`);
}

for (const context of [
  'SAFE_VISIBLE_CONTEXT',
  'RESTRICTED_CONTEXT',
  'PROHIBITED_CONTEXT',
  'Telemetry-derived context',
  'Cookies or localStorage state',
  'Unsubmitted form content',
]) {
  assertIncludes(architecture, context, `DXT 3 architecture must classify context: ${context}`);
}

for (const boundary of [
  'legal advice',
  'tax advice',
  'lending advice',
  'appraisal or valuation advice',
  'protected-class steering',
  'mortgage approval',
  'appraisal equivalence',
  'SHARED_RUNTIME_STOP_AND_REPORT',
  'Brokerage disclosure remains `EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING`.',
  '`READY_FOR_DXT_3_PLANNING_CERTIFICATION`',
]) {
  assertIncludes(architecture, boundary, `DXT 3 architecture must prohibit or preserve: ${boundary}`);
}

assert.equal(
  packageJson.scripts?.['check:dxt-3-professional-preparation-architecture'],
  'npm run worker:build && node dist/scripts/checkDxt3ProfessionalPreparationArchitecture.js',
  'package.json must register the DXT 3 architecture check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxt3ProfessionalPreparationArchitecture.ts',
  'tsconfig.worker.json must include the DXT 3 architecture check.',
);

console.log('[dxt-3-professional-preparation-architecture] ok: preparation model, terminology, context classification, and protected boundaries verified.');
