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

const plan = read('docs/project-atlas/executive-library/REIE-DXT-WAVE-1D-CITY-MARKET-BRIEFING-IMPLEMENTATION-PLAN.md');
const cityMarketPage = read('app/market/[city]/page.tsx');
const neighborhoodPage = read('app/market/[city]/[slug]/page.tsx');
const marketIndex = read('app/market/page.tsx');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');
const chatStart = read('docs/CHAT_START.md');

for (const marker of [
  'DXT_WAVE_1D_CITY_MARKET_BRIEFING_PLAN_READY',
  'City Market runtime remains unauthorized.',
  'No city Market runtime modification was performed.',
  'What is happening in this city market, what evidence matters, and what should I investigate next?',
  'Primary future runtime file: `app/market/[city]/page.tsx`',
  'Shared runtime files require stop-and-report authorization before modification.',
]) {
  assertIncludes(plan, marker, `City Market plan must include marker: ${marker}`);
}

for (const hierarchy of [
  '1. City market orientation',
  '2. Governing customer question',
  '3. Concise city briefing promise',
  '4. Current city Market signals',
  '5. Evidence that matters to the decision',
  '6. Directional-versus-verified explanation',
  '7. Neighborhood paths and conditions to investigate',
  '8. Freshness, uncertainty, fair-housing, and professional boundaries',
  '9. Dominant Search continuation',
  '10. Compact Neighborhood, Property, Seller, and Advisory continuations',
]) {
  assertIncludes(plan, hierarchy, `City Market hierarchy must include: ${hierarchy}`);
}

for (const boundary of [
  'market-timing certainty',
  'guaranteed appreciation',
  'investment recommendation',
  'buy-now or sell-now conclusion',
  'suitability conclusion',
  'neighborhood ranking',
  'school-quality conclusion',
  'safety conclusion',
  'protected-class steering',
  'provider expansion',
  'persistence',
  'telemetry',
  'CRM expansion',
  'AI advisory',
]) {
  assertIncludes(plan, boundary, `City Market protected boundary must include: ${boundary}`);
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
  assertIncludes(plan, disposition, `City Market disposition map must include: ${disposition}`);
}

assertNotIncludes(
  cityMarketPage,
  'data-dxt-wave-1d-city-market-briefing',
  'City Market runtime must remain unchanged by the planning-only workstream.',
);
assertNotIncludes(
  neighborhoodPage,
  'data-dxt-wave-1d-city-market-briefing',
  'Neighborhood runtime must not receive City Market planning markers.',
);
assertNotIncludes(
  marketIndex,
  'data-dxt-wave-1d-city-market-briefing',
  'Market index runtime must not receive City Market planning markers.',
);

assert.equal(
  packageJson.scripts?.['check:dxt-wave-1d-city-market-briefing-plan'],
  'npm run worker:build && node dist/scripts/checkDxtWave1dCityMarketBriefingPlan.js',
  'package.json must register the City Market briefing planning check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxtWave1dCityMarketBriefingPlan.ts',
  'tsconfig.worker.json must include the City Market briefing planning check.',
);
assertIncludes(
  chatStart,
  'DXT_WAVE_1D_CITY_MARKET_BRIEFING_PLAN_READY',
  'CHAT_START must record City Market planning status.',
);

console.log(
  '[dxt-wave-1d-city-market-briefing-plan] ok: City Market planning hierarchy, boundaries, runtime isolation, docs, and registrations verified.',
);
