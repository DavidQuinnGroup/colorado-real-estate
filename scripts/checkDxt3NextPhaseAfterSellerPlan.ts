import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

const plan = read('docs/project-atlas/executive-library/REIE-DXT-3-NEXT-PHASE-AFTER-SELLER-PLAN.md');
const chatStart = read('docs/CHAT_START.md');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'Status: `DXT_3_NEXT_PHASE_AFTER_SELLER_PLAN_READY`',
  'Selected primary phase: `CROSS_ROUTE_PROFESSIONAL_PREPARATION_CONSISTENCY`',
  'Selected secondary planning phase: `DXT_3_COMPLETION_ASSESSMENT`',
  'Deferred or protected phase: `PROPERTY_INQUIRY_PREPARATION_QUALITY`',
  'Runtime authorization: `false`',
  'Proposed runtime ownership: `documentation-and-deterministic-validation-only`',
  'Shared runtime finding: `ROUTE_LOCAL_OR_EXISTING_COMPONENTS_PREFERRED`',
  'DXT 3 completion assessment remains premature until cross-route professional preparation consistency is certified or explicitly declined.',
]) {
  assertIncludes(plan, phrase, `Next-phase-after-Seller plan must include: ${phrase}`);
}

for (const candidate of [
  'Cross-route Professional Preparation Consistency',
  'Market Professional Preparation',
  'Property Professional Preparation',
  'Advisory Professional Conversation Preparation Depth',
  'DXT 3 Completion Assessment',
]) {
  assertIncludes(plan, candidate, `Next-phase-after-Seller plan must assess candidate: ${candidate}`);
}

for (const criterion of [
  'No runtime implementation, forms, APIs, CRM, email, scheduling, persistence, telemetry, hidden context, URL-context expansion, form prefill, customer profile, or shared runtime abstraction.',
  'Route ownership remains intact.',
  'Exact copy uniformity is not required.',
  'No professional advice, representation, fiduciary claim, lending conclusion, valuation conclusion, pricing recommendation, legal advice, tax advice, investment advice, suitability conclusion, fair-housing steering, or AI professional conclusion.',
  'READY_FOR_REIE_DXT_3_CROSS_ROUTE_PROFESSIONAL_PREPARATION_CONSISTENCY_PLAN_CERTIFICATION',
]) {
  assertIncludes(plan, criterion, `Next-phase-after-Seller plan must include criterion: ${criterion}`);
}

assertIncludes(
  chatStart,
  'READY_FOR_REIE_DXT_3_CROSS_ROUTE_PROFESSIONAL_PREPARATION_CONSISTENCY_PLAN_CERTIFICATION',
  'CHAT_START must record the Cross-Route Professional Preparation Consistency plan-certification gate.',
);
assert.equal(
  packageJson.scripts?.['check:dxt-3-next-phase-after-seller-plan'],
  'npm run worker:build && node dist/scripts/checkDxt3NextPhaseAfterSellerPlan.js',
  'package.json must register the DXT 3 next-phase-after-Seller plan check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxt3NextPhaseAfterSellerPlan.ts',
  'tsconfig.worker.json must include the DXT 3 next-phase-after-Seller plan check.',
);

console.log(
  '[dxt-3-next-phase-after-seller-plan] ok: Cross-route professional preparation consistency selected, DXT 3 completion assessment secondary, Property Inquiry protected, and separate planning gate verified.',
);
