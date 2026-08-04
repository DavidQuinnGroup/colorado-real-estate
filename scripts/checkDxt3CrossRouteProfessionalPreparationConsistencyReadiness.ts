import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

const readiness = read('docs/project-atlas/executive-library/REIE-DXT-3-CROSS-ROUTE-PROFESSIONAL-PREPARATION-CONSISTENCY-IMPLEMENTATION-READINESS.md');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'Status: `DXT_3_CROSS_ROUTE_PROFESSIONAL_PREPARATION_CONSISTENCY_IMPLEMENTATION_READINESS_READY`',
  'Assessment mode: `DOCUMENTATION_AND_DETERMINISTIC_ASSESSMENT_ONLY`',
  'Primary disposition: `NO_RUNTIME_CHANGE_REQUIRED`',
  'Fallback disposition: `DOCUMENTATION_ONLY_NORMALIZATION`',
  'Rejected over-broad approach: `MULTI_ROUTE_BOUNDED_CONSISTENCY_WAVE`',
  'Runtime implementation justified: `false`',
  'Program closure recommendation: `READY_FOR_DXT_3_PROGRAM_CLOSURE_CERTIFICATION`',
  'Recommended next gate: `READY_FOR_REIE_DXT_3_PROGRAM_CLOSURE_CERTIFICATION`',
]) {
  assertIncludes(readiness, phrase, `Readiness assessment must include: ${phrase}`);
}

for (const model of [
  '`NO_RUNTIME_CHANGE_REQUIRED`',
  '`DOCUMENTATION_ONLY_NORMALIZATION`',
  '`ROUTE_LOCAL_TERMINOLOGY_WAVE`',
  '`ROUTE_LOCAL_HIERARCHY_WAVE`',
  '`ROUTE_LOCAL_PATHWAY_WAVE`',
  '`ROUTE_LOCAL_BOUNDARY_WAVE`',
  '`MULTI_ROUTE_BOUNDED_CONSISTENCY_WAVE`',
  '`DEFER_UNTIL_LATER_PRODUCT_REVIEW`',
]) {
  assertIncludes(readiness, model, `Readiness assessment must evaluate model: ${model}`);
}

assertIncludes(
  readiness,
  'No runtime wave is recommended for any discrepancy.',
  'Readiness assessment must reject runtime implementation for current discrepancies.',
);

assert.equal(
  packageJson.scripts?.['check:dxt-3-cross-route-professional-preparation-consistency-readiness'],
  'npm run worker:build && node dist/scripts/checkDxt3CrossRouteProfessionalPreparationConsistencyReadiness.js',
  'package.json must register the DXT 3 cross-route consistency readiness check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxt3CrossRouteProfessionalPreparationConsistencyReadiness.ts',
  'tsconfig.worker.json must include the DXT 3 cross-route consistency readiness check.',
);

console.log('[dxt-3-cross-route-professional-preparation-consistency-readiness] ok: candidate models, selected disposition, fallback, rejected over-broad wave, and closure gate verified.');
