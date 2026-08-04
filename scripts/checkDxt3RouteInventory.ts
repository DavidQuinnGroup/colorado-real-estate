import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

const inventory = read('docs/project-atlas/executive-library/REIE-DXT-3-DECISION-QUALITY-PROFESSIONAL-PREPARATION-ROUTE-INVENTORY.md');
const chatStart = read('docs/CHAT_START.md');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'Status: `DXT_3_ROUTE_AND_CAPABILITY_INVENTORY_READY`',
  'Program: `DXT_3_DECISION_QUALITY_AND_PROFESSIONAL_PREPARATION`',
  'Runtime authorization: `false`',
  'Shared runtime finding: `ROUTE_LOCAL_OR_EXISTING_COMPONENTS_PREFERRED`',
  '`CANDIDATE_FIRST_PHASE`',
  '`PROPERTY_PROFESSIONAL_PREPARATION`',
  '`ADVISORY_CONVERSATION_PREPARATION`',
  '`PROPERTY_INQUIRY_PREPARATION_QUALITY`',
  '`SPECIALIZED_FLOW_PRESERVE`',
  '`PROTECTED_BOUNDARY_HOLD`',
  '`DOCUMENTATION_STANDARD_ONLY`',
]) {
  assertIncludes(inventory, phrase, `DXT 3 route inventory must include: ${phrase}`);
}

for (const route of [
  '| `/` |',
  '| `/search` |',
  '| representative `/properties/[id]` |',
  '| Property Inquiry section |',
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
  assertIncludes(inventory, route, `DXT 3 route inventory must include route: ${route}`);
}

for (const component of [
  '`components/PropertyInquiryForm.tsx`',
  '`components/AdvisoryHandoffGuide.tsx`',
  '`components/search/SearchInterface.tsx`',
  '`components/JourneyCohesionPanel.tsx`',
  '`components/LeadCapture.tsx`',
]) {
  assertIncludes(inventory, component, `DXT 3 route inventory must include component: ${component}`);
}

for (const boundary of [
  'No shared runtime component, hook, provider, store, schema, or customer-profile model is authorized or required',
  'identity, email, phone, private notes, saved searches, saved properties, planner inputs',
  'Brokerage disclosure remains `EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING`.',
  '`READY_FOR_DXT_3_PLANNING_CERTIFICATION`',
]) {
  assertIncludes(inventory, boundary, `DXT 3 route inventory must preserve boundary: ${boundary}`);
}

assertIncludes(
  chatStart,
  'READY_FOR_REIE_DXT_3_PROPERTY_PROFESSIONAL_PREPARATION_BOUNDED_IMPLEMENTATION_AUTHORIZATION',
  'CHAT_START must record the DXT 3 selected first implementation gate.',
);
assert.equal(
  packageJson.scripts?.['check:dxt-3-route-inventory'],
  'npm run worker:build && node dist/scripts/checkDxt3RouteInventory.js',
  'package.json must register the DXT 3 route inventory check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxt3RouteInventory.ts',
  'tsconfig.worker.json must include the DXT 3 route inventory check.',
);

console.log('[dxt-3-route-inventory] ok: route coverage, capability inventory, selected first phase, and protected boundaries verified.');
