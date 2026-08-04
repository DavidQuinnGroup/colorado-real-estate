import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

const plan = read('docs/project-atlas/executive-library/REIE-DXT-3-NEXT-PHASE-AFTER-CONTACT-PLAN.md');
const chatStart = read('docs/CHAT_START.md');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'Status: `DXT_3_NEXT_PHASE_AFTER_CONTACT_PLAN_READY`',
  'Selected primary phase: `BUYER_PROFESSIONAL_PREPARATION`',
  'Selected secondary planning phase: `SELLER_PROFESSIONAL_PREPARATION`',
  'Deferred or protected phase: `PROPERTY_INQUIRY_PREPARATION_QUALITY`',
  'Runtime authorization: `false`',
  'Proposed runtime ownership: `app/buy/page.tsx`',
  'Shared runtime finding: `ROUTE_LOCAL_OR_EXISTING_COMPONENTS_PREFERRED`',
  'DXT 3 completion assessment remains premature until Buyer and Seller professional preparation are assessed or explicitly declined.',
]) {
  assertIncludes(plan, phrase, `Next-phase-after-Contact plan must include: ${phrase}`);
}

for (const candidate of [
  'Property Inquiry Preparation Quality',
  'Buyer Professional Preparation',
  'Seller Professional Preparation',
  'Market / Neighborhood Professional Question Preparation',
  'Cross-Route Professional Preparation Standard',
  'DXT 3 Completion Assessment',
]) {
  assertIncludes(plan, candidate, `Next-phase-after-Contact plan must assess candidate: ${candidate}`);
}

for (const criterion of [
  'No new forms, fields, consent, submission behavior, APIs, CRM, email, scheduling, persistence, telemetry, hidden context, URL-context expansion, form prefill, customer profile, or automatic routing.',
  'Buyer remains preparation to buy.',
  'No mortgage approval, qualification, affordability, buying-power, underwriting, credit, lender-ranking, or financial-advice conclusion.',
  'Advisory remains focused preparation.',
  'Contact remains general conversation initiation.',
  'Property Inquiry remains specialized.',
  'READY_FOR_REIE_DXT_3_BUYER_PROFESSIONAL_PREPARATION_BOUNDED_IMPLEMENTATION_AUTHORIZATION',
]) {
  assertIncludes(plan, criterion, `Next-phase-after-Contact plan must include criterion: ${criterion}`);
}

assertIncludes(
  chatStart,
  'READY_FOR_REIE_DXT_3_BUYER_PROFESSIONAL_PREPARATION_PLAN_CERTIFICATION',
  'CHAT_START must record the Buyer Professional Preparation plan-certification gate.',
);
assert.equal(
  packageJson.scripts?.['check:dxt-3-next-phase-after-contact-plan'],
  'npm run worker:build && node dist/scripts/checkDxt3NextPhaseAfterContactPlan.js',
  'package.json must register the DXT 3 next-phase-after-Contact plan check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxt3NextPhaseAfterContactPlan.ts',
  'tsconfig.worker.json must include the DXT 3 next-phase-after-Contact plan check.',
);

console.log('[dxt-3-next-phase-after-contact-plan] ok: Buyer professional preparation selected, Seller secondary, Property Inquiry protected, and separate implementation gate verified.');
