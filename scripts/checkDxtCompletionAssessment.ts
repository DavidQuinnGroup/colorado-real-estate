import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

const assessment = read('docs/project-atlas/executive-library/REIE-DXT-COMPLETION-ASSESSMENT.md');
const chatStart = read('docs/CHAT_START.md');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'Status: `DXT_COMPLETION_ASSESSMENT_READY`',
  'Material Gap Count: `0`',
  'No additional cross-route continuity runtime phase is recommended after Market-family continuity production certification, absent production defects.',
  'Certified Journey Inventory',
  'Remaining Gap Assessment',
  'Accepted Limitations',
  'Recommended Next Program',
  'Deterministic Completion Criteria',
  'READY_FOR_REIE_DXT_COMPLETION_ASSESSMENT_CERTIFICATION',
]) {
  assertIncludes(assessment, phrase, `DXT completion assessment must include: ${phrase}`);
}

for (const phrase of [
  'Homepage -> invitation',
  'Search -> decision workspace',
  'Property -> property evaluation',
  'Buyer -> preparation',
  'Seller -> market-exposure preparation',
  'Market -> market briefing',
  'City Market -> city-level evidence',
  'Neighborhood -> place orientation',
  'Advisory -> preparation',
  'Contact -> conversation initiation',
]) {
  assertIncludes(assessment, phrase, `DXT completion inventory must include: ${phrase}`);
}

assertIncludes(
  chatStart,
  'READY_FOR_REIE_DXT_MARKET_CITY_MARKET_NEIGHBORHOOD_PROPERTY_CONTINUITY_LOCAL_CERTIFICATION_AND_PUSH_AUTHORIZATION',
  'CHAT_START must record the Market-family continuity next gate.',
);
assert.equal(
  packageJson.scripts?.['check:dxt-completion-assessment'],
  'npm run worker:build && node dist/scripts/checkDxtCompletionAssessment.js',
  'package.json must register the DXT completion assessment check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxtCompletionAssessment.ts',
  'tsconfig.worker.json must include the DXT completion assessment check.',
);

console.log(
  '[dxt-completion-assessment] ok: certified journey inventory, material gap count, accepted limitations, and next-program gate verified.',
);
