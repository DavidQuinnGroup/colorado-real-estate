import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

const planCertification = read(
  'docs/project-atlas/executive-library/REIE-DXT-2-NEIGHBORHOOD-DECISION-READINESS-DEPTH-PLAN-CERTIFICATION.md',
);
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'Status: `REIE_DXT_2_NEIGHBORHOOD_DECISION_READINESS_DEPTH_PLAN_CERTIFIED_AND_CLOSED`',
  'Runtime authorization: `false`',
  'Selected future phase: `NEIGHBORHOOD_DECISION_READINESS_DEPTH`',
  'Do I understand this place well enough to decide what to verify, compare, search, or inspect next?',
  'evidence available on the Neighborhood route',
  'evidence unavailable or requiring verification',
  'directional place context',
  'assumptions',
  'freshness',
  'unresolved unknowns',
  'Confidence must remain qualitative',
  'app/market/[city]/[slug]/page.tsx',
  'no hidden context',
  'no persistence',
  'no telemetry',
  'no provider activation',
  'no Search, Property, map, API, Product 3, schema, FAQ, navigation, footer, or brokerage-disclosure changes',
]) {
  assertIncludes(planCertification, phrase, `Neighborhood readiness plan certification must include: ${phrase}`);
}

assert.equal(
  packageJson.scripts?.['check:dxt-2-neighborhood-decision-readiness-depth-plan'],
  'npm run worker:build && node dist/scripts/checkDxt2NeighborhoodDecisionReadinessDepthPlan.js',
  'package.json must register the DXT 2 Neighborhood readiness plan check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxt2NeighborhoodDecisionReadinessDepthPlan.ts',
  'tsconfig.worker.json must include the DXT 2 Neighborhood readiness plan check.',
);

console.log(
  '[dxt-2-neighborhood-decision-readiness-depth-plan] ok: certified Neighborhood readiness plan, route ownership, evidence boundaries, and protected systems verified.',
);
