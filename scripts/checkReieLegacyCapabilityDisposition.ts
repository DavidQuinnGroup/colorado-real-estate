import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {
  REIE_LEGACY_CAPABILITY_DISPOSITION_CATEGORIES,
  REIE_LEGACY_CAPABILITY_DISPOSITIONS,
  REIE_LEGACY_CAPABILITY_PROTECTED_CONSUMER_ROOTS,
  type ReieLegacyCapabilityDispositionRecord,
} from '../lib/reieLegacyCapabilityDisposition.js';

const source = fs.readFileSync(path.resolve(process.cwd(), 'lib/reieLegacyCapabilityDisposition.ts'), 'utf8');
for (const token of ['fetch(', 'PrismaClient', '@prisma', 'process.env', 'localStorage', 'sessionStorage', 'CRMTask', 'Typesense', 'sendEmail']) {
  assert.equal(source.includes(token), false, `legacy disposition must not depend on ${token}`);
}

const requiredPaths = [
  'lib/financialEngine.ts',
  'lib/marketMetrics.ts',
  'components/MarketChart.tsx',
  'lib/strategyGenerator.ts',
  'components/maps/MarketGauge.tsx',
  'lib/getMarketData.ts',
  'lib/marketAnalytics.ts',
  'lib/marketPulse.ts',
];
const records = new Map(REIE_LEGACY_CAPABILITY_DISPOSITIONS.map((record) => [record.path, record]));
assert.equal(REIE_LEGACY_CAPABILITY_DISPOSITIONS.length, 9);
for (const requiredPath of requiredPaths) assert.ok(records.has(requiredPath), `missing disposition for ${requiredPath}`);
assert.equal(new Set(REIE_LEGACY_CAPABILITY_DISPOSITIONS.map((record) => record.path)).size, REIE_LEGACY_CAPABILITY_DISPOSITIONS.length);
assert.ok(REIE_LEGACY_CAPABILITY_DISPOSITION_CATEGORIES.includes('CERTIFIED_CURRENT_CAPABILITY'));
assert.ok(REIE_LEGACY_CAPABILITY_DISPOSITION_CATEGORIES.includes('SAFE_REUSABLE_PRIMITIVE'));
assert.ok(REIE_LEGACY_CAPABILITY_DISPOSITION_CATEGORIES.includes('LEGACY_UNCONSUMED'));
assert.ok(REIE_LEGACY_CAPABILITY_DISPOSITION_CATEGORIES.includes('QUARANTINED_INTERNAL'));
assert.ok(REIE_LEGACY_CAPABILITY_DISPOSITION_CATEGORIES.includes('DEPRECATED'));
assert.ok(REIE_LEGACY_CAPABILITY_DISPOSITION_CATEGORIES.includes('REWRITE_REQUIRED'));
assert.ok(REIE_LEGACY_CAPABILITY_DISPOSITION_CATEGORIES.includes('DELETE_AFTER_DEPENDENCY_CLEARANCE'));

for (const record of REIE_LEGACY_CAPABILITY_DISPOSITIONS as readonly ReieLegacyCapabilityDispositionRecord[]) {
  assert.ok(fs.existsSync(path.resolve(process.cwd(), record.path)), `${record.path} must exist; do not mark absent code as deleted`);
  assert.ok(record.consumerState);
  assert.ok(record.runtimeReachability);
  assert.ok(record.certificationState);
  assert.ok(['LOW', 'MODERATE', 'HIGH', 'CRITICAL'].includes(record.riskLevel));
  assert.ok(record.allowedReuse.length > 0);
  assert.ok(record.prohibitedReuse.length > 0);
  assert.ok(record.disposition);
  assert.ok(record.rewritePrecondition.length > 0);
  if (record.disposition === 'DELETE_AFTER_DEPENDENCY_CLEARANCE') assert.ok(record.deletionPrecondition);
  for (const consumer of record.directConsumers) assert.ok(fs.existsSync(path.resolve(process.cwd(), consumer)), `${record.path} consumer ${consumer} must exist`);
}

for (const root of REIE_LEGACY_CAPABILITY_PROTECTED_CONSUMER_ROOTS) {
  assert.ok(fs.existsSync(path.resolve(process.cwd(), root)), `protected consumer root ${root} must exist`);
}

assert.equal(records.get('components/MarketChart.tsx')?.disposition, 'DEPRECATE');
assert.equal(records.get('lib/strategyGenerator.ts')?.disposition, 'QUARANTINE_INTERNAL');
assert.equal(records.get('lib/marketAnalytics.ts')?.disposition, 'REWRITE_BEFORE_USE');
assert.deepEqual(records.get('lib/marketMetrics.ts')?.directConsumers, ['lib/financialEngine.ts']);
assert.deepEqual(records.get('lib/marketPulse.ts')?.directConsumers, []);

console.log('[reie-legacy-capability-disposition] ok: nine legacy artifacts, required disposition vocabulary, exact recorded consumers, existence safeguards, and protected roots verified.');
