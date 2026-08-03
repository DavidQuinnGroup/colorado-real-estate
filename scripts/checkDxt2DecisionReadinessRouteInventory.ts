import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

const inventory = read('docs/project-atlas/executive-library/REIE-DXT-2-DECISION-READINESS-ROUTE-INVENTORY.md');
const chatStart = read('docs/CHAT_START.md');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'Status: `DXT_2_DECISION_READINESS_ROUTE_INVENTORY_READY`',
  'Does each certified experience help the customer become sufficiently prepared to make the next real decision?',
  '`FOUNDATIONAL`',
  '`FUNCTIONAL`',
  '`DECISION_READY`',
  '`ADVANCED_DECISION_READY`',
  '`EXTERNAL_DEPENDENCY_HOLD`',
  '`PROTECTED_BOUNDARY_HOLD`',
  '`PROPERTY_DECISION_READINESS_DEPTH`',
  '`CANDIDATE_FIRST_PHASE`',
  '`READY_FOR_REIE_DXT_2_PROPERTY_DECISION_READINESS_DEPTH_BOUNDED_IMPLEMENTATION_AUTHORIZATION`',
]) {
  assertIncludes(inventory, phrase, `DXT 2 route inventory must include: ${phrase}`);
}

for (const route of [
  '| `/` |',
  '| `/search` |',
  '| representative `/properties/[id]` |',
  '| `/buy` |',
  '| `/sell` |',
  '| `/market` |',
  '| representative `/market/[city]` |',
  '| representative `/market/[city]/[slug]` |',
  '| `/contact` |',
  '| `/contact#advisory-readiness` |',
  '| `/grand-plan` |',
  '| `/home-worth` |',
  '| `/compare` |',
]) {
  assertIncludes(inventory, route, `DXT 2 route inventory must include route: ${route}`);
}

for (const boundary of [
  'No numeric customer, property, market, neighborhood, fit, investment, or lead score is authorized.',
  'No prediction, appreciation probability, buy/sell recommendation, suitability conclusion, affordability conclusion, lending approval, appraisal, valuation certainty, legal advice, tax advice, or automated professional advice is authorized.',
  'Brokerage disclosure remains `EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING`.',
]) {
  assertIncludes(inventory, boundary, `DXT 2 route inventory must preserve boundary: ${boundary}`);
}

assertIncludes(
  chatStart,
  'READY_FOR_REIE_DXT_2_PROPERTY_DECISION_READINESS_DEPTH_BOUNDED_IMPLEMENTATION_AUTHORIZATION',
  'CHAT_START must record the DXT 2 selected first implementation gate.',
);
assert.equal(
  packageJson.scripts?.['check:dxt-2-decision-readiness-route-inventory'],
  'npm run worker:build && node dist/scripts/checkDxt2DecisionReadinessRouteInventory.js',
  'package.json must register the DXT 2 route inventory check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxt2DecisionReadinessRouteInventory.ts',
  'tsconfig.worker.json must include the DXT 2 route inventory check.',
);

console.log(
  '[dxt-2-decision-readiness-route-inventory] ok: route coverage, maturity classifications, candidate first phase, and protected boundaries verified.',
);
