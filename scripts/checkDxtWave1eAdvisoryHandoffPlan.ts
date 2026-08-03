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

const advisoryPlan = read('docs/project-atlas/executive-library/REIE-DXT-WAVE-1E-ADVISORY-HANDOFF-IMPLEMENTATION-PLAN.md');
const architecture = read('docs/project-atlas/executive-library/REIE-DXT-WAVE-1E-ADVISORY-CONTACT-ARCHITECTURE-READINESS.md');
const contactPage = read('app/contact/page.tsx');
const advisoryGuide = read('components/AdvisoryHandoffGuide.tsx');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');
const chatStart = read('docs/CHAT_START.md');

for (const marker of [
  'DXT_WAVE_1E_ADVISORY_HANDOFF_PLAN_READY',
  'No Advisory runtime modification is authorized by this record.',
  'What should I understand and prepare before beginning a focused professional conversation?',
  'EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING',
  'Recommended first runtime target: `components/AdvisoryHandoffGuide.tsx`',
  'Shared-file stop conditions',
  'Future Advisory implementation certification must verify:',
]) {
  assertIncludes(advisoryPlan, marker, `Advisory plan must include marker: ${marker}`);
}

for (const hierarchy of [
  '1. Advisory orientation',
  '2. Governing question',
  '3. Concise explanation of what Advisory does',
  '4. Decision context the customer should bring',
  '5. Evidence already reviewed in REIE',
  '6. Questions requiring professional discussion',
  '7. What Advisory can and cannot provide',
  '8. Trust, brokerage, legal, financial, valuation, and professional boundaries',
  '9. One dominant conversation-starting action',
  '10. Compact continuations back to relevant REIE decision tools',
]) {
  assertIncludes(advisoryPlan, hierarchy, `Advisory hierarchy must include: ${hierarchy}`);
}

for (const boundary of [
  'guaranteed outcomes',
  'representation claims before an agreement exists',
  'legal advice',
  'tax advice',
  'lending approval or qualification',
  'appraisal or valuation certainty',
  'investment recommendations',
  'suitability conclusions',
  'fair-housing steering',
  'AI pretending to be a licensed professional',
  'undisclosed lead routing',
  'automatic customer profiling',
  'persistent decision histories',
  'CRM expansion',
  'automated outreach',
  'new scheduling behavior',
  'new email behavior',
  'provider ranking',
]) {
  assertIncludes(advisoryPlan, boundary, `Advisory boundary must include: ${boundary}`);
}

for (const disposition of [
  'KEEP',
  'SIMPLIFY',
  'MERGE',
  'MOVE LOWER',
  'PROGRESSIVELY DISCLOSE',
  'MOVE TO DESTINATION PAGE',
  'REMOVE',
  'EXTERNAL REVIEW HOLD',
]) {
  assertIncludes(advisoryPlan, disposition, `Advisory disposition map must include: ${disposition}`);
}

for (const architectureMarker of [
  'DXT_WAVE_1E_ADVISORY_CONTACT_ARCHITECTURE_READY',
  'Advisory owns the decision-preparation handoff.',
  'Contact owns the conversation-starting action.',
  '1. Advisory Handoff foundation',
  '2. Contact Decision Flow simplification',
  'prohibited automatic data transfer',
  'no runtime authorization',
]) {
  assertIncludes(architecture, architectureMarker, `Architecture record must include: ${architectureMarker}`);
}

assertIncludes(contactPage, '<AdvisoryHandoffGuide />', 'Contact route must remain the current Advisory host.');
assertIncludes(advisoryGuide, 'data-advisory-handoff-persistence="false"', 'Advisory guide must preserve no-persistence marker.');
assertIncludes(advisoryGuide, 'data-advisory-handoff-crm="false"', 'Advisory guide must preserve no-CRM marker.');
assertNotIncludes(contactPage, 'DXT_WAVE_1E_ADVISORY_HANDOFF_PLAN_READY', 'Planning marker must not be added to Contact runtime.');
assertNotIncludes(advisoryGuide, 'DXT_WAVE_1E_ADVISORY_HANDOFF_PLAN_READY', 'Planning marker must not be added to Advisory runtime.');

assert.equal(
  packageJson.scripts?.['check:dxt-wave-1e-advisory-handoff-plan'],
  'npm run worker:build && node dist/scripts/checkDxtWave1eAdvisoryHandoffPlan.js',
  'package.json must register Advisory Handoff planning check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxtWave1eAdvisoryHandoffPlan.ts',
  'tsconfig.worker.json must include Advisory Handoff planning check.',
);
assertIncludes(chatStart, 'DXT_WAVE_1E_ADVISORY_HANDOFF_PLAN_READY', 'CHAT_START must record Advisory planning status.');

console.log(
  '[dxt-wave-1e-advisory-handoff-plan] ok: Advisory governing question, hierarchy, disposition map, boundaries, brokerage hold, ownership, runtime prohibition, architecture integration, and certification criteria verified.',
);
