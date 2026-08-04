import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

const contract = read('docs/project-atlas/executive-library/REIE-DXT-3-CROSS-ROUTE-PROFESSIONAL-PREPARATION-CONSISTENCY-CONTRACT.md');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'Status: `DXT_3_CROSS_ROUTE_PROFESSIONAL_PREPARATION_CONSISTENCY_CONTRACT_READY`',
  'Contract type: `GOVERNANCE_LEVEL_ONLY`',
  'Runtime authorization: `false`',
  'Shared runtime component required: `false`',
  'Shared runtime schema required: `false`',
  'Certification recommendation: `READY_FOR_DXT_3_PROGRAM_CLOSURE_CERTIFICATION`',
]) {
  assertIncludes(contract, phrase, `Contract must include: ${phrase}`);
}

for (const heading of [
  '## Responsibility Ownership',
  '## Governing-Question Principles',
  '## Evidence-Category Principles',
  '## Assumption Treatment',
  '## Unknown Treatment',
  '## Verification Treatment',
  '## Question Treatment',
  '## Conversation-Priority Treatment',
  '## Pathway Ownership',
  '## Advisory-Versus-Contact Distinction',
  '## Direct-Entry Requirements',
  '## Canonical Requirements',
  '## Privacy And Consent Requirements',
  '## Representation Boundaries',
  '## Financial And Lending Boundaries',
  '## Valuation And Pricing Boundaries',
  '## Legal And Tax Boundaries',
  '## Investment And Suitability Boundaries',
  '## Fair-Housing Boundaries',
  '## CTA Hierarchy Principles',
  '## Shared-Runtime Prohibition',
  '## Deterministic Certification Requirements',
]) {
  assertIncludes(contract, heading, `Contract must include heading: ${heading}`);
}

for (const boundary of [
  'Advisory prepares. Contact begins.',
  'No shared runtime professional-preparation component, schema, hook, provider, state model, persistence model, telemetry event, customer profile, or hidden context model is authorized or required by this contract.',
  'If a future implementation claims shared runtime is necessary, return `SHARED_RUNTIME_STOP_AND_REPORT`.',
]) {
  assertIncludes(contract, boundary, `Contract must preserve boundary: ${boundary}`);
}

assert.equal(
  packageJson.scripts?.['check:dxt-3-cross-route-professional-preparation-consistency-contract'],
  'npm run worker:build && node dist/scripts/checkDxt3CrossRouteProfessionalPreparationConsistencyContract.js',
  'package.json must register the DXT 3 cross-route consistency contract check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxt3CrossRouteProfessionalPreparationConsistencyContract.ts',
  'tsconfig.worker.json must include the DXT 3 cross-route consistency contract check.',
);

console.log('[dxt-3-cross-route-professional-preparation-consistency-contract] ok: governance contract, standards, protected boundaries, and shared-runtime prohibition verified.');
