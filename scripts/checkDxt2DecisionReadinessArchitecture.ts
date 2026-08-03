import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

const architecture = read('docs/project-atlas/executive-library/REIE-DXT-2-DECISION-READINESS-ARCHITECTURE.md');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'Status: `DXT_2_DECISION_READINESS_ARCHITECTURE_READY`',
  'Decision being considered',
  'Evidence currently available',
  'Evidence not yet available',
  'Assumptions currently being used',
  'Confidence in each material input',
  'Freshness and provenance',
  'What remains unverified',
  'Questions to ask',
  'Professional review requirements',
  'Next decision threshold',
  'verified facts',
  'directional context',
  'assumptions',
  'modeled estimates',
  'customer-provided information',
  'professional judgment',
  'unknowns',
  'stale evidence',
  'conflicting evidence',
  'unavailable evidence',
]) {
  assertIncludes(architecture, phrase, `DXT 2 architecture must include: ${phrase}`);
}

for (const boundary of [
  'customer fit scores',
  'property suitability scores',
  'neighborhood fit scores',
  'investment scores',
  'buy or sell recommendations',
  'probability of appreciation',
  'approval likelihood',
  'affordability conclusions',
  'hidden composite scores',
  'behavioral scoring',
  'lead scoring',
  'protected-class steering',
  'demographic suitability',
  'appraisal equivalence',
  'valuation certainty',
  'AI professional impersonation',
  'Brokerage disclosure remains `EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING`.',
]) {
  assertIncludes(architecture, boundary, `DXT 2 architecture must prohibit or preserve: ${boundary}`);
}

assert.equal(
  packageJson.scripts?.['check:dxt-2-decision-readiness-architecture'],
  'npm run worker:build && node dist/scripts/checkDxt2DecisionReadinessArchitecture.js',
  'package.json must register the DXT 2 architecture check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxt2DecisionReadinessArchitecture.ts',
  'tsconfig.worker.json must include the DXT 2 architecture check.',
);

console.log(
  '[dxt-2-decision-readiness-architecture] ok: decision model, evidence/confidence/verification architecture, and protected boundaries verified.',
);
