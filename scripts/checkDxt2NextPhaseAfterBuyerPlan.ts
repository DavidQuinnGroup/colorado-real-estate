import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

const plan = read('docs/project-atlas/executive-library/REIE-DXT-2-NEXT-PHASE-AFTER-BUYER-PLAN.md');
const chatStart = read('docs/CHAT_START.md');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'Status: `DXT_2_NEXT_PHASE_AFTER_BUYER_PLAN_READY`',
  'Runtime authorization: `false`',
  'Selected primary next phase: `SELLER_DECISION_READINESS_DEPTH_EXPANSION`',
  'Selected secondary planning phase: `CROSS_ROUTE_EVIDENCE_CONSISTENCY`',
  'Deferred completion phase: `DXT_2_COMPLETION_ASSESSMENT`',
  'Seller Decision Readiness Depth Expansion',
  'Cross-route Evidence Consistency',
  'Advisory Conversation Readiness Depth',
  'DXT 2 Completion Assessment',
  'app/sell/page.tsx',
  'No valuation certainty',
  'No appraisal equivalence',
  'No guaranteed pricing',
  'No hidden context',
  'No persistence',
  'No telemetry',
  'READY_FOR_REIE_DXT_2_SELLER_DECISION_READINESS_DEPTH_EXPANSION_BOUNDED_IMPLEMENTATION_AUTHORIZATION',
]) {
  assertIncludes(plan, phrase, `Post-Buyer DXT 2 next-phase plan must include: ${phrase}`);
}

for (const prohibited of [
  'Runtime authorization: `true`',
  'Shared readiness abstraction authorized: `true`',
  'Provider activation authorized: `true`',
  'Telemetry expansion authorized: `true`',
  'CRM expansion authorized: `true`',
]) {
  assert(!plan.includes(prohibited), `Post-Buyer DXT 2 next-phase plan must not authorize ${prohibited}.`);
}

assertIncludes(
  chatStart,
  'DXT_2_NEXT_PHASE_AFTER_BUYER_PLAN_READY',
  'CHAT_START must record the post-Buyer DXT 2 next-phase planning status.',
);
assert.equal(
  packageJson.scripts?.['check:dxt-2-next-phase-after-buyer-plan'],
  'npm run worker:build && node dist/scripts/checkDxt2NextPhaseAfterBuyerPlan.js',
  'package.json must register the DXT 2 post-Buyer next-phase plan check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxt2NextPhaseAfterBuyerPlan.ts',
  'tsconfig.worker.json must include the DXT 2 post-Buyer next-phase plan check.',
);

console.log(
  '[dxt-2-next-phase-after-buyer-plan] ok: candidate inventory, selected Seller expansion, cross-route planning, completion implication, and protected boundaries verified.',
);
