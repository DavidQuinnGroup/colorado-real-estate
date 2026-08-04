import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

const plan = read('docs/project-atlas/executive-library/REIE-DXT-3-NEXT-PHASE-AFTER-ADVISORY-PLAN.md');
const chatStart = read('docs/CHAT_START.md');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'Status: `DXT_3_NEXT_PHASE_AFTER_ADVISORY_PLAN_READY`',
  'Selected primary phase: `CONTACT_PATH_SELECTION_QUALITY`',
  'Selected secondary planning phase: `PROPERTY_INQUIRY_PREPARATION_QUALITY`',
  'Deferred or protected phase: `DXT_3_COMPLETION_ASSESSMENT`',
  'Runtime authorization: `false`',
  'Proposed runtime ownership: `app/contact/page.tsx`',
  'Shared runtime finding: `ROUTE_LOCAL_OR_EXISTING_COMPONENTS_PREFERRED`',
  'DXT 3 completion assessment remains premature until Contact path selection quality is separately authorized, implemented, certified, and closed.',
]) {
  assertIncludes(plan, phrase, `Next-phase plan must include: ${phrase}`);
}

for (const candidate of [
  'Buyer Professional Preparation',
  'Seller Professional Preparation',
  'Contact Path Selection Quality',
  'Property Inquiry Preparation Quality',
  'Market / Neighborhood Professional Question Preparation',
  'Cross-Route Professional Preparation Standard',
  'DXT 3 Completion Assessment',
]) {
  assertIncludes(plan, candidate, `Next-phase plan must assess candidate: ${candidate}`);
}

for (const criterion of [
  'No Contact form, field, consent, submission, API, CRM, email, scheduling, persistence, telemetry, hidden context, or URL-context expansion.',
  'Contact remains general conversation initiation.',
  'Advisory remains focused preparation.',
  'Property Inquiry remains specialized.',
  'No professional advice, representation, fiduciary claim, lending conclusion, valuation conclusion, legal advice, tax advice, investment advice, suitability conclusion, or fair-housing steering.',
  'READY_FOR_REIE_DXT_3_CONTACT_PATH_SELECTION_QUALITY_BOUNDED_IMPLEMENTATION_AUTHORIZATION',
]) {
  assertIncludes(plan, criterion, `Next-phase plan must include criterion: ${criterion}`);
}

assertIncludes(
  chatStart,
  'READY_FOR_REIE_DXT_3_CONTACT_PATH_SELECTION_QUALITY_PLAN_CERTIFICATION',
  'CHAT_START must record the Contact Path Selection Quality plan-certification gate.',
);
assert.equal(
  packageJson.scripts?.['check:dxt-3-next-phase-after-advisory-plan'],
  'npm run worker:build && node dist/scripts/checkDxt3NextPhaseAfterAdvisoryPlan.js',
  'package.json must register the DXT 3 next-phase-after-Advisory plan check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxt3NextPhaseAfterAdvisoryPlan.ts',
  'tsconfig.worker.json must include the DXT 3 next-phase-after-Advisory plan check.',
);

console.log('[dxt-3-next-phase-after-advisory-plan] ok: Contact path selection selected, protected dependencies, deterministic criteria, and separate implementation gate verified.');
