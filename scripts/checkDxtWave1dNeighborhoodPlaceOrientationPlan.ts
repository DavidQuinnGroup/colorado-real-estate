import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

function assertNotIncludes(source: string, value: string, message: string): void {
  assert(!source.includes(value), message);
}

const neighborhoodPlan = read(
  'docs/project-atlas/executive-library/REIE-DXT-WAVE-1D-NEIGHBORHOOD-PLACE-ORIENTATION-IMPLEMENTATION-PLAN.md',
);
const foundationContract = read(
  'docs/project-atlas/executive-library/REIE-DXT-WAVE-1D-MARKET-NEIGHBORHOOD-DISCOVERY-FOUNDATION-CONTRACT.md',
);
const neighborhoodPage = read('app/market/[city]/[slug]/page.tsx');
const marketIndex = read('app/market/page.tsx');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');
const chatStart = read('docs/CHAT_START.md');

assertIncludes(
  foundationContract,
  'Neighborhood pages as orientation to place before evidence',
  'Certified Wave 1D Neighborhood foundation must remain present.',
);

for (const marker of [
  'DXT_WAVE_1D_NEIGHBORHOOD_PLACE_ORIENTATION_PLAN_READY',
  'What kind of place is this, how is it organized, and what should I verify next?',
  'Neighborhood runtime remains unauthorized.',
  'No Neighborhood runtime modification is authorized.',
  'No shared Market/Neighborhood runtime abstraction is authorized.',
  'Market runtime implementation remains separate from Neighborhood implementation.',
]) {
  assertIncludes(neighborhoodPlan, marker, `Neighborhood plan must include marker: ${marker}`);
}

for (const hierarchyMarker of [
  '1. Place orientation',
  '2. Governing customer question',
  '3. Concise description of the area',
  '4. Geographic organization and boundaries',
  '5. Housing context',
  '6. Evidence that matters',
  '7. Questions to verify personally or professionally',
  '8. Fair-housing, freshness, uncertainty, and limitation boundaries',
  '9. Property exploration continuation',
  '10. Market and Advisory continuations',
]) {
  assertIncludes(neighborhoodPlan, hierarchyMarker, `Neighborhood hierarchy must include: ${hierarchyMarker}`);
}

for (const boundary of [
  'protected-class steering',
  'demographic suitability conclusions',
  'best-neighborhood claims',
  'family-status assumptions',
  'safety guarantees',
  'crime-risk conclusions',
  'school-quality rankings or conclusions',
  'investment guarantees',
  'predictive appreciation claims',
  'personalized suitability rankings',
  'hidden ranking systems',
  'provider expansion',
  'persistence',
  'telemetry',
  'CRM expansion',
  'AI advisory',
]) {
  assertIncludes(neighborhoodPlan, boundary, `Neighborhood fair-housing/protected boundary must include: ${boundary}`);
}

for (const disposition of [
  'KEEP',
  'SIMPLIFY',
  'MERGE',
  'MOVE LOWER',
  'PROGRESSIVELY DISCLOSE',
  'MOVE TO DESTINATION PAGE',
  'REMOVE',
  'EXTERNAL REVIEW HOLD',
]) {
  assertIncludes(neighborhoodPlan, disposition, `Neighborhood disposition map must include: ${disposition}`);
}

assertIncludes(
  neighborhoodPlan,
  'Primary future runtime file: `app/market/[city]/[slug]/page.tsx`',
  'Neighborhood plan must define bounded file ownership.',
);
assertIncludes(
  neighborhoodPlan,
  'Shared runtime files require stop-and-report authorization before modification.',
  'Neighborhood plan must define shared-file risk handling.',
);
assertNotIncludes(
  neighborhoodPage,
  'DXT_WAVE_1D_NEIGHBORHOOD_PLACE_ORIENTATION_PLAN_READY',
  'Neighborhood runtime must not receive planning status copy.',
);
assertNotIncludes(
  neighborhoodPage,
  'data-dxt-wave-1d-neighborhood-place-orientation',
  'Neighborhood runtime must not receive new place-orientation runtime markers.',
);
assertNotIncludes(
  marketIndex,
  'data-dxt-wave-1d-neighborhood-place-orientation',
  'Market runtime must not receive Neighborhood runtime markers.',
);

assert.equal(
  packageJson.scripts?.['check:dxt-wave-1d-neighborhood-place-orientation-plan'],
  'npm run worker:build && node dist/scripts/checkDxtWave1dNeighborhoodPlaceOrientationPlan.js',
  'package.json must register the Neighborhood place-orientation planning check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxtWave1dNeighborhoodPlaceOrientationPlan.ts',
  'tsconfig.worker.json must include the Neighborhood place-orientation planning check.',
);
assertIncludes(
  chatStart,
  'DXT_WAVE_1D_NEIGHBORHOOD_PLACE_ORIENTATION_PLAN_READY',
  'CHAT_START must record Neighborhood place-orientation planning status.',
);

console.log(
  '[dxt-wave-1d-neighborhood-place-orientation-plan] ok: Neighborhood plan, hierarchy, fair-housing boundaries, runtime isolation, and registrations verified.',
);
