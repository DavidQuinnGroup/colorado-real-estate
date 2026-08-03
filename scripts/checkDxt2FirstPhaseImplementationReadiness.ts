import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

const readiness = read('docs/project-atlas/executive-library/REIE-DXT-2-FIRST-PHASE-IMPLEMENTATION-READINESS.md');
const chatStart = read('docs/CHAT_START.md');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'Status: `DXT_2_FIRST_PHASE_IMPLEMENTATION_READINESS_READY`',
  'Selected primary phase: `PROPERTY_DECISION_READINESS_DEPTH`',
  'Selected secondary planning phase: `SEARCH_DECISION_WORKSPACE_DEPTH`',
  'Deferred phase: `MARKET_AND_CITY_MARKET_DECISION_READINESS_DEPTH`',
  'Runtime authorization: `false`',
  'Is this property sufficiently understood to justify more time, a property-specific question, a tour, comparison, or a prepared professional conversation?',
  'app/properties/[id]/page.tsx',
  'components/PropertyInquiryForm.tsx',
  'Property route remains the only runtime file changed.',
  'No provider activation, API change, persistence, telemetry, CRM, email, scheduling, AI advice, valuation certainty, financial qualification, legal advice, tax advice, suitability conclusion, or protected-class steering is introduced.',
  'READY_FOR_REIE_DXT_2_PROPERTY_DECISION_READINESS_DEPTH_BOUNDED_IMPLEMENTATION_AUTHORIZATION',
  'READY_FOR_REIE_DXT_2_SEARCH_DECISION_WORKSPACE_DEPTH_PLANNING_AUTHORIZATION',
]) {
  assertIncludes(readiness, phrase, `DXT 2 first-phase readiness must include: ${phrase}`);
}

for (const candidate of [
  'Property Decision Readiness Depth',
  'Buyer Decision Readiness Depth',
  'Seller Decision Readiness Depth',
  'Market and City Market Decision Readiness Depth',
  'Neighborhood Decision Readiness Depth',
  'Advisory Conversation Readiness Depth',
  'Search Decision Workspace Depth',
  'Cross-route evidence consistency only',
]) {
  assertIncludes(readiness, candidate, `DXT 2 first-phase readiness must assess candidate: ${candidate}`);
}

assertIncludes(
  chatStart,
  'READY_FOR_REIE_DXT_2_SEARCH_DECISION_WORKSPACE_DEPTH_PLANNING_AUTHORIZATION',
  'CHAT_START must record the DXT 2 secondary planning gate.',
);
assert.equal(
  packageJson.scripts?.['check:dxt-2-first-phase-implementation-readiness'],
  'npm run worker:build && node dist/scripts/checkDxt2FirstPhaseImplementationReadiness.js',
  'package.json must register the DXT 2 first-phase readiness check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxt2FirstPhaseImplementationReadiness.ts',
  'tsconfig.worker.json must include the DXT 2 first-phase readiness check.',
);

console.log(
  '[dxt-2-first-phase-implementation-readiness] ok: candidate comparison, selected Property phase, secondary Search planning gate, and certification criteria verified.',
);
