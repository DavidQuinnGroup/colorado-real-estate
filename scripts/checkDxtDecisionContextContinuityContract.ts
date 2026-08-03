import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

const contract = read('docs/project-atlas/executive-library/REIE-DXT-DECISION-CONTEXT-CONTINUITY-CONTRACT.md');
const chatStart = read('docs/CHAT_START.md');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'DXT_DECISION_CONTEXT_CONTINUITY_CONTRACT_READY',
  'Does every certified route clearly help the customer understand what to do next, why that next step matters, and where it leads?',
  'SAFE_VISIBLE_CONTEXT',
  'SAFE_ONLY_IF_ALREADY_IN_URL',
  'REQUIRES_SEPARATE_AUTHORIZATION',
  'PROHIBITED_AUTOMATIC_TRANSFER',
  'Direct-Entry Requirements',
  'URL And Canonical Requirements',
  'Browser Navigation Requirements',
  'Visible-Context Presentation Options',
  'Return-Path Architecture',
  'Privacy, Fair-Housing, And Trust Boundaries',
  'EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING',
  'No shared runtime component is authorized',
]) {
  assertIncludes(contract, phrase, `Decision-context contract must include: ${phrase}`);
}

for (const prohibited of [
  'identity',
  'email',
  'phone',
  'financial assumptions',
  'saved searches',
  'planner inputs',
  'browsing history',
  'inferred preferences',
  'protected characteristics',
  'telemetry-derived context',
]) {
  assertIncludes(contract, prohibited, `Decision-context contract must prohibit transfer of: ${prohibited}`);
}

assertIncludes(
  chatStart,
  'DXT_DECISION_CONTEXT_CONTINUITY_CONTRACT_READY',
  'CHAT_START must record decision-context contract status.',
);
assert.equal(
  packageJson.scripts?.['check:dxt-decision-context-continuity-contract'],
  'npm run worker:build && node dist/scripts/checkDxtDecisionContextContinuityContract.js',
  'package.json must register decision-context continuity contract check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxtDecisionContextContinuityContract.ts',
  'tsconfig.worker.json must include decision-context continuity contract check.',
);

console.log('[dxt-decision-context-continuity-contract] ok: context classification, prohibited transfer, direct entry, canonical, browser navigation, privacy, fair-housing, brokerage hold, CHAT_START, and registry verified.');
