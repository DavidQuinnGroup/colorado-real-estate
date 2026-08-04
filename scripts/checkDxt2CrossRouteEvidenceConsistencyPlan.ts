import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

const plan = read('docs/project-atlas/executive-library/REIE-DXT-2-CROSS-ROUTE-EVIDENCE-CONSISTENCY-PLAN.md');
const chatStart = read('docs/CHAT_START.md');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'Status: `DXT_2_CROSS_ROUTE_EVIDENCE_CONSISTENCY_PLAN_READY`',
  'Runtime authorization: `false`',
  'Selected primary recommendation: `DOCUMENTATION_ONLY_TERMINOLOGY_STANDARD`',
  'Selected secondary recommendation: `PROCEED_TO_DXT_2_COMPLETION_ASSESSMENT`',
  'Shared runtime finding: `NO_SHARED_RUNTIME_ABSTRACTION_REQUIRED`',
  'READY_FOR_REIE_DXT_2_CROSS_ROUTE_EVIDENCE_CONSISTENCY_PLAN_CERTIFICATION',
  '/search',
  'representative `/properties/[id]`',
  '/buy',
  '/sell',
  '/market',
  'representative `/market/[city]`',
  'representative `/market/[city]/[slug]`',
  '/contact#advisory-readiness',
  'Available evidence',
  'Needs verification',
  'Assumption',
  'Unknown',
  'Qualitative confidence',
  'Next-decision threshold',
  'Search owns inventory',
  'Property owns address-level evaluation',
  'Market owns broad market briefing',
  'City Market owns city-level evidence',
  'Neighborhood owns place orientation',
  'Buyer owns buying preparation',
  'Seller owns market-exposure preparation',
  'Advisory owns professional-conversation preparation',
  'Contact owns general conversation initiation',
  'NO_SHARED_RUNTIME_ABSTRACTION_REQUIRED',
  'SHARED_RUNTIME_STOP_AND_REPORT',
]) {
  assertIncludes(plan, phrase, `Cross-route evidence consistency plan must include: ${phrase}`);
}

for (const prohibited of [
  'Runtime authorization: `true`',
  'Shared runtime finding: `SHARED_RUNTIME_ABSTRACTION_REQUIRED`',
  'Provider activation authorized: `true`',
  'Telemetry expansion authorized: `true`',
  'CRM expansion authorized: `true`',
  'This plan closes DXT 2.',
]) {
  assert(!plan.includes(prohibited), `Cross-route evidence consistency plan must not authorize ${prohibited}.`);
}

assertIncludes(
  chatStart,
  'DXT_2_CROSS_ROUTE_EVIDENCE_CONSISTENCY_PLAN_READY',
  'CHAT_START must record the cross-route evidence consistency plan status.',
);
assert.equal(
  packageJson.scripts?.['check:dxt-2-cross-route-evidence-consistency-plan'],
  'npm run worker:build && node dist/scripts/checkDxt2CrossRouteEvidenceConsistencyPlan.js',
  'package.json must register the DXT 2 cross-route evidence consistency plan check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxt2CrossRouteEvidenceConsistencyPlan.ts',
  'tsconfig.worker.json must include the DXT 2 cross-route evidence consistency plan check.',
);

console.log(
  '[dxt-2-cross-route-evidence-consistency-plan] ok: route inventory, terminology standard, evidence consistency, no shared runtime, and completion implication verified.',
);
