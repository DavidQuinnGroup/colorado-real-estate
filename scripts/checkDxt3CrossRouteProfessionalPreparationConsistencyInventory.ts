import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

const inventory = read('docs/project-atlas/executive-library/REIE-DXT-3-CROSS-ROUTE-PROFESSIONAL-PREPARATION-CONSISTENCY-INVENTORY.md');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'Status: `DXT_3_CROSS_ROUTE_PROFESSIONAL_PREPARATION_CONSISTENCY_INVENTORY_READY`',
  'Assessment mode: `DOCUMENTATION_AND_DETERMINISTIC_ASSESSMENT_ONLY`',
  'Runtime authorization: `false`',
  'Shared runtime required: `false`',
  'Primary finding: `NO_RUNTIME_CHANGE_REQUIRED`',
  'Recommended next action: `READY_FOR_DXT_3_PROGRAM_CLOSURE_CERTIFICATION`',
]) {
  assertIncludes(inventory, phrase, `Inventory must include: ${phrase}`);
}

for (const route of [
  '`/`',
  '`/search`',
  '`/properties/[id]`',
  '`/buy`',
  '`/sell`',
  '`/market`',
  '`/market/[city]`',
  '`/market/[city]/[slug]`',
  '`/contact`',
  '`/contact#advisory-readiness`',
  '`/grand-plan`',
  '`/home-worth`',
  '`/compare`',
]) {
  assertIncludes(inventory, route, `Inventory must assess route: ${route}`);
}

for (const answer of [
  'Buyer and Seller use compatible evidence-category language: `yes`',
  'Property Inquiry is clearly distinct from Advisory and Contact: `yes`',
  'A shared runtime abstraction would create more risk than value: `yes`',
  'Additional DXT 3 runtime work is not materially justified by current evidence: `yes`',
]) {
  assertIncludes(inventory, answer, `Inventory must answer consistency question: ${answer}`);
}

assert.equal(
  packageJson.scripts?.['check:dxt-3-cross-route-professional-preparation-consistency-inventory'],
  'npm run worker:build && node dist/scripts/checkDxt3CrossRouteProfessionalPreparationConsistencyInventory.js',
  'package.json must register the DXT 3 cross-route consistency inventory check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxt3CrossRouteProfessionalPreparationConsistencyInventory.ts',
  'tsconfig.worker.json must include the DXT 3 cross-route consistency inventory check.',
);

console.log('[dxt-3-cross-route-professional-preparation-consistency-inventory] ok: route inventory, route ownership, cross-route answers, and no-runtime finding verified.');
