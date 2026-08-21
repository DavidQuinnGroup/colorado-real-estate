import assert from 'node:assert/strict';
import fs from 'node:fs';

import { evaluateCurrentMarketSourceSetCurrentness, type CurrentMarketSourceSetCompletion } from '../lib/currentMarketSourceSetCurrentness';
import { CURRENT_MARKET_SOURCE_SET_COMPLETION_FIXTURE } from '../lib/currentMarketSourceSetCurrentnessFixtures';

const computedAt = '2026-08-21T12:00:00.000Z';
const complete = evaluateCurrentMarketSourceSetCurrentness(CURRENT_MARKET_SOURCE_SET_COMPLETION_FIXTURE, computedAt);
assert.equal(complete.certified, true);
assert.equal(complete.state, 'CERTIFIED_SOURCE_SET_CURRENTNESS');
assert.equal(complete.sourceSetCurrentAsOf, '2026-08-21T11:59:00.000Z');

const rejectedCases: readonly [string, CurrentMarketSourceSetCompletion, string][] = [
  ['partial', { ...CURRENT_MARKET_SOURCE_SET_COMPLETION_FIXTURE, completionState: 'PARTIAL' as const }, 'SOURCE_SET_COMPLETION_REQUIRED'],
  ['error', { ...CURRENT_MARKET_SOURCE_SET_COMPLETION_FIXTURE, errorCount: 1 }, 'SOURCE_SET_ERRORS_PRESENT'],
  ['nonterminal', { ...CURRENT_MARKET_SOURCE_SET_COMPLETION_FIXTURE, terminalSignal: 'NOT_TERMINAL' as const }, 'TERMINAL_SOURCE_TRAVERSAL_REQUIRED'],
  ['missing-cutoff', { ...CURRENT_MARKET_SOURCE_SET_COMPLETION_FIXTURE, sourceCutoffAt: null }, 'SOURCE_CUTOFF_REQUIRED'],
];

for (const [label, sourceSet, reason] of rejectedCases) {
  const result = evaluateCurrentMarketSourceSetCurrentness(sourceSet, computedAt);
  assert.equal(result.certified, false, label);
  assert.ok(result.reasons.includes(reason), label);
}

const source = fs.readFileSync('lib/currentMarketSourceSetCurrentness.ts', 'utf8');
assert.doesNotMatch(source, /prisma\.|fetch\(|process\.env|create\(|update\(|delete\(|upsert\(/, 'Source-set currentness contract must remain pure.');

console.log('CURRENT_MARKET_SOURCE_SET_CURRENTNESS_CHECK: PASS');
