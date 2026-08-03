import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

const plan = read('docs/project-atlas/executive-library/REIE-DXT-2-NEXT-PHASE-PLAN.md');
const chatStart = read('docs/CHAT_START.md');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'Status: `DXT_2_NEXT_PHASE_PLAN_READY`',
  'Selected next bounded phase: `NEIGHBORHOOD_DECISION_READINESS_DEPTH`',
  'Runtime authorization: `false`',
  'Neighborhood Decision Readiness Depth',
  'Buyer Decision Readiness Depth',
  'Seller Decision Readiness Depth',
  'app/market/[city]/[slug]/page.tsx',
  'app/buy/page.tsx',
  'app/sell/page.tsx',
  'No neighborhood ranking',
  'No protected-class steering',
  'No affordability or qualification conclusion',
  'No valuation certainty',
  'READY_FOR_REIE_DXT_2_NEIGHBORHOOD_DECISION_READINESS_DEPTH_BOUNDED_IMPLEMENTATION_AUTHORIZATION',
]) {
  assertIncludes(plan, phrase, `DXT 2 next-phase plan must include: ${phrase}`);
}

for (const prohibited of [
  'Runtime authorization: `true`',
  'shared runtime abstraction authorized',
  'provider activation authorized',
  'telemetry expansion authorized',
]) {
  assert(!plan.includes(prohibited), `DXT 2 next-phase plan must not authorize ${prohibited}.`);
}

assertIncludes(
  chatStart,
  'DXT_2_NEXT_PHASE_PLAN_READY',
  'CHAT_START must record the DXT 2 next-phase planning status.',
);
assert.equal(
  packageJson.scripts?.['check:dxt-2-next-phase-plan'],
  'npm run worker:build && node dist/scripts/checkDxt2NextPhasePlan.js',
  'package.json must register the DXT 2 next-phase plan check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxt2NextPhasePlan.ts',
  'tsconfig.worker.json must include the DXT 2 next-phase plan check.',
);

console.log(
  '[dxt-2-next-phase-plan] ok: next DXT 2 candidate comparison, selected Neighborhood phase, and protected boundaries verified.',
);
