import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

const disposition = read('docs/project-atlas/executive-library/REIE-DXT-3-CROSS-ROUTE-PROFESSIONAL-PREPARATION-CONSISTENCY-DISPOSITION-REGISTER.md');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'Status: `DXT_3_CROSS_ROUTE_PROFESSIONAL_PREPARATION_CONSISTENCY_DISPOSITION_READY`',
  'Runtime authorization: `false`',
  'Discrepancy count: `5`',
  'P0 count: `0`',
  'P1 count: `0`',
  'P2 count: `4`',
  'HOLD count: `1`',
  'Shared runtime required: `false`',
  'Route-local implementation sufficient if ever authorized: `true`',
  '`NO_RUNTIME_CHANGE_REQUIRED`',
]) {
  assertIncludes(disposition, phrase, `Disposition register must include: ${phrase}`);
}

for (const id of [
  '`DXT3-CRPPC-001`',
  '`DXT3-CRPPC-002`',
  '`DXT3-CRPPC-003`',
  '`DXT3-CRPPC-004`',
  '`DXT3-CRPPC-005`',
]) {
  assertIncludes(disposition, id, `Disposition register must include discrepancy ID: ${id}`);
}

for (const dispositionValue of [
  '`KEEP_ROUTE_SPECIFIC`',
  '`TERMINOLOGY_NORMALIZATION_CANDIDATE`',
  '`PROTECTED_SYSTEM_HOLD`',
  '`NO_ACTION_REQUIRED`',
]) {
  assertIncludes(disposition, dispositionValue, `Disposition register must include disposition: ${dispositionValue}`);
}

assert.equal(
  packageJson.scripts?.['check:dxt-3-cross-route-professional-preparation-consistency-disposition'],
  'npm run worker:build && node dist/scripts/checkDxt3CrossRouteProfessionalPreparationConsistencyDisposition.js',
  'package.json must register the DXT 3 cross-route consistency disposition check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxt3CrossRouteProfessionalPreparationConsistencyDisposition.ts',
  'tsconfig.worker.json must include the DXT 3 cross-route consistency disposition check.',
);

console.log('[dxt-3-cross-route-professional-preparation-consistency-disposition] ok: discrepancy counts, dispositions, priorities, and no-shared-runtime finding verified.');
