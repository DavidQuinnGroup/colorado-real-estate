import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

const plan = read('docs/project-atlas/executive-library/REIE-DXT-2-NEXT-PHASE-AFTER-NEIGHBORHOOD-PLAN.md');
const chatStart = read('docs/CHAT_START.md');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'Status: `DXT_2_NEXT_PHASE_AFTER_NEIGHBORHOOD_PLAN_READY`',
  'Selected next bounded phase: `BUYER_DECISION_READINESS_DEPTH_EXPANSION`',
  'Runtime authorization: `false`',
  'Buyer Decision Readiness Depth Expansion',
  'Seller Decision Readiness Depth Expansion',
  'Cross-route Evidence Consistency',
  'Advisory Conversation Readiness Depth',
  'DXT 2 completion assessment',
  'app/buy/page.tsx',
  'app/sell/page.tsx',
  'No affordability determination',
  'No lending qualification',
  'No valuation certainty',
  'No hidden context',
  'No persistence',
  'No telemetry',
  'READY_FOR_REIE_DXT_2_BUYER_DECISION_READINESS_DEPTH_EXPANSION_BOUNDED_IMPLEMENTATION_AUTHORIZATION',
]) {
  assertIncludes(plan, phrase, `Post-Neighborhood DXT 2 next-phase plan must include: ${phrase}`);
}

for (const prohibited of [
  'Runtime authorization: `true`',
  'Shared readiness abstraction authorized: `true`',
  'Provider activation authorized: `true`',
  'Telemetry expansion authorized: `true`',
  'CRM expansion authorized: `true`',
]) {
  assert(!plan.includes(prohibited), `Post-Neighborhood DXT 2 next-phase plan must not authorize ${prohibited}.`);
}

assertIncludes(
  chatStart,
  'DXT_2_NEXT_PHASE_AFTER_NEIGHBORHOOD_PLAN_READY',
  'CHAT_START must record the post-Neighborhood DXT 2 next-phase planning status.',
);
assert.equal(
  packageJson.scripts?.['check:dxt-2-next-phase-after-neighborhood-plan'],
  'npm run worker:build && node dist/scripts/checkDxt2NextPhaseAfterNeighborhoodPlan.js',
  'package.json must register the DXT 2 post-Neighborhood next-phase plan check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxt2NextPhaseAfterNeighborhoodPlan.ts',
  'tsconfig.worker.json must include the DXT 2 post-Neighborhood next-phase plan check.',
);

console.log(
  '[dxt-2-next-phase-after-neighborhood-plan] ok: candidate inventory, selected Buyer expansion, sequencing, and protected boundaries verified.',
);
