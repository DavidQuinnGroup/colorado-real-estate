import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

const readiness = read('docs/project-atlas/executive-library/REIE-DXT-CROSS-ROUTE-CONTINUITY-IMPLEMENTATION-READINESS.md');
const inventory = read('docs/project-atlas/executive-library/REIE-DXT-CROSS-ROUTE-CTA-DESTINATION-INVENTORY.md');
const contract = read('docs/project-atlas/executive-library/REIE-DXT-DECISION-CONTEXT-CONTINUITY-CONTRACT.md');
const chatStart = read('docs/CHAT_START.md');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'DXT_CROSS_ROUTE_CONTINUITY_IMPLEMENTATION_READINESS_READY',
  'No implementation is authorized',
  'Candidate Phase Assessment',
  'Property -> Advisory -> Contact continuity',
  'Search -> Property -> Search return continuity',
  'Market -> City Market -> Neighborhood -> Property continuity',
  'Buyer/Seller -> Advisory -> Contact continuity',
  'Homepage -> Search/Buyer/Seller entry continuity',
  'Cross-route CTA language normalization only',
  'SEARCH_PROPERTY_RETURN_CONTINUITY',
  'READY_FOR_REIE_DXT_SEARCH_PROPERTY_RETURN_CONTINUITY_BOUNDED_IMPLEMENTATION_AUTHORIZATION',
  'PROPERTY_ADVISORY_CONTACT_CONTINUITY_PLANNING',
  'READY_FOR_REIE_DXT_PROPERTY_ADVISORY_CONTACT_CONTINUITY_PLANNING_AUTHORIZATION',
  'app/properties/[id]/page.tsx',
  'Implementation Sequence',
  'Certification Sequence',
  'Deterministic Certification Criteria',
  'Accepted Limitations',
]) {
  assertIncludes(readiness, phrase, `Implementation readiness must include: ${phrase}`);
}

for (const boundary of [
  'Search API changes',
  'Search ranking changes',
  'property route canonical changes',
  'shared runtime abstraction',
  'localStorage',
  'cookies',
  'persistence',
  'telemetry',
  'CRM',
  'email',
  'scheduling',
  'form changes',
]) {
  assertIncludes(readiness, boundary, `Implementation readiness must include stop condition: ${boundary}`);
}

assertIncludes(inventory, 'DXT_CROSS_ROUTE_CTA_DESTINATION_INVENTORY_READY', 'Readiness depends on completed CTA inventory.');
assertIncludes(contract, 'DXT_DECISION_CONTEXT_CONTINUITY_CONTRACT_READY', 'Readiness depends on completed continuity contract.');
assertIncludes(
  chatStart,
  'READY_FOR_REIE_DXT_SEARCH_PROPERTY_RETURN_CONTINUITY_BOUNDED_IMPLEMENTATION_AUTHORIZATION',
  'CHAT_START must record recommended first implementation gate.',
);
assert.equal(
  packageJson.scripts?.['check:dxt-cross-route-continuity-implementation-readiness'],
  'npm run worker:build && node dist/scripts/checkDxtCrossRouteContinuityImplementationReadiness.js',
  'package.json must register cross-route continuity readiness check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxtCrossRouteContinuityImplementationReadiness.ts',
  'tsconfig.worker.json must include cross-route continuity readiness check.',
);

console.log('[dxt-cross-route-continuity-implementation-readiness] ok: candidate phases, primary and secondary gates, file ownership, stop conditions, criteria, limitations, CHAT_START, and registry verified.');
