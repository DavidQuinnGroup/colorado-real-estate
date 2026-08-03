import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

const plan = read('docs/project-atlas/executive-library/REIE-DXT-NEXT-CONTINUITY-PHASE-PLAN.md');
const chatStart = read('docs/CHAT_START.md');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'Status: `DXT_NEXT_CONTINUITY_PHASE_PLAN_READY`',
  'Buyer/Seller -> Advisory -> Contact Continuity',
  'Market -> City Market -> Neighborhood -> Property Continuity',
  'Candidate Comparison',
  'Selected Next Phase',
  'BUYER_SELLER_ADVISORY_CONTACT_CONTINUITY',
  'READY_FOR_REIE_DXT_BUYER_SELLER_ADVISORY_CONTACT_CONTINUITY_PLANNING_CERTIFICATION',
  'File Ownership',
  'Shared-File Risks',
  'Protected-System Risks',
  'Implementation Sequence',
  'Deterministic Certification Criteria',
  'Production-Certification Criteria',
  'Accepted Limitations',
]) {
  assertIncludes(plan, phrase, `Next continuity phase plan must include: ${phrase}`);
}

for (const boundary of [
  'no Contact form changes',
  'no hidden context',
  'no persistence',
  'no telemetry',
  'no CRM',
  'no email',
  'no scheduling',
  'no navigation or footer changes',
]) {
  assertIncludes(plan, boundary, `Next continuity phase plan must preserve boundary: ${boundary}`);
}

assertIncludes(
  chatStart,
  'READY_FOR_REIE_DXT_BUYER_SELLER_ADVISORY_CONTACT_CONTINUITY_PLANNING_CERTIFICATION',
  'CHAT_START must record the selected secondary planning gate.',
);
assert.equal(
  packageJson.scripts?.['check:dxt-next-continuity-phase-plan'],
  'npm run worker:build && node dist/scripts/checkDxtNextContinuityPhasePlan.js',
  'package.json must register the next continuity phase planning check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxtNextContinuityPhasePlan.ts',
  'tsconfig.worker.json must include the next continuity phase planning check.',
);

console.log(
  '[dxt-next-continuity-phase-plan] ok: Buyer/Seller and Market/Neighborhood candidates, selected phase, file ownership, risks, sequencing, and certification criteria verified.',
);
