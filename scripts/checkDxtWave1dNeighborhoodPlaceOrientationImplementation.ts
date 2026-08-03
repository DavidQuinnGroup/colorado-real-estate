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

function assertOrdered(source: string, markers: string[], message: string): void {
  let previousIndex = -1;

  for (const marker of markers) {
    const index = source.indexOf(marker);
    assert(index >= 0, `Missing marker: ${marker}`);
    assert(index > previousIndex, message);
    previousIndex = index;
  }
}

function countOccurrences(source: string, value: string): number {
  return source.split(value).length - 1;
}

const neighborhoodPage = read('app/market/[city]/[slug]/page.tsx');
const marketIndex = read('app/market/page.tsx');
const cityMarketPage = read('app/market/[city]/page.tsx');
const buyerPage = read('app/buy/page.tsx');
const sellerPage = read('app/sell/page.tsx');
const neighborhoodPlanClosure = read(
  'docs/project-atlas/executive-library/REIE-DXT-WAVE-1D-NEIGHBORHOOD-PLACE-ORIENTATION-PLAN-CLOSURE.md',
);
const implementationRecord = read(
  'docs/project-atlas/executive-library/REIE-DXT-WAVE-1D-NEIGHBORHOOD-PLACE-ORIENTATION-IMPLEMENTATION.md',
);
const cityMarketPlan = read(
  'docs/project-atlas/executive-library/REIE-DXT-WAVE-1D-CITY-MARKET-BRIEFING-IMPLEMENTATION-PLAN.md',
);
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');
const chatStart = read('docs/CHAT_START.md');

assertIncludes(
  neighborhoodPlanClosure,
  'REIE_DXT_WAVE_1D_NEIGHBORHOOD_PLACE_ORIENTATION_PLAN_CERTIFIED_AND_CLOSED',
  'Neighborhood plan closure must remain certified.',
);

assertIncludes(
  neighborhoodPage,
  'data-dxt-wave-1d-neighborhood-place-orientation="true"',
  'Neighborhood route must expose the DXT Wave 1D place-orientation marker.',
);
assertIncludes(
  neighborhoodPage,
  'data-dxt-wave-1d-neighborhood-plan="REIE_DXT_WAVE_1D_NEIGHBORHOOD_PLACE_ORIENTATION_PLAN_CERTIFIED_AND_CLOSED"',
  'Neighborhood route must reference the certified Neighborhood plan.',
);
assertIncludes(neighborhoodPage, 'data-dxt-wave-1d-market-runtime-change="false"', 'Market runtime must be marked unchanged.');
assertIncludes(neighborhoodPage, 'data-dxt-wave-1c-buyer-runtime-change="false"', 'Buyer runtime must be marked unchanged.');
assertIncludes(neighborhoodPage, 'data-dxt-wave-1c-seller-runtime-change="false"', 'Seller runtime must be marked unchanged.');

assert.equal(countOccurrences(neighborhoodPage, '<h1'), 1, 'Neighborhood route must contain exactly one H1.');

assertOrdered(
  neighborhoodPage,
  [
    'data-dxt-neighborhood-hierarchy-role="place-orientation-governing-question-concise-overview"',
    'What kind of place is this, how is it organized, and what should I verify next?',
    'data-dxt-neighborhood-hierarchy-role="geographic-organization-housing-context"',
    '<NeighborhoodProduct3Experience model={neighborhoodProduct3Model} />',
    'data-dxt-neighborhood-hierarchy-role="evidence-that-matters"',
    'data-dxt-neighborhood-hierarchy-role="questions-to-verify"',
    'data-dxt-neighborhood-hierarchy-role="freshness-limitations-professional-boundaries"',
    'data-dxt-neighborhood-hierarchy-role="property-market-advisory-continuations"',
  ],
  'Neighborhood route must preserve the certified place-orientation hierarchy.',
);

for (const requiredCopy of [
  'What kind of place is this, how is it organized, and what should I verify next?',
  'Start with neutral place orientation',
  'Place first. Then housing context. Then property evidence.',
  'Understand the place before the property comparison.',
  'Treat geography as orientation for touring, search filters, and professional review, not as a conclusion about personal fit.',
  'Use neighborhood context as orientation, not a personal conclusion.',
  'Housing context, inventory signals, soil, insurance, altitude, access, and market context are prompts for verification at the address level.',
  'Confirm boundaries, condition, title, insurance, taxes, HOA details, inspection findings, financing assumptions, and contract risk',
]) {
  assertIncludes(neighborhoodPage, requiredCopy, `Neighborhood place orientation must include: ${requiredCopy}`);
}

for (const continuity of [
  'Search This Neighborhood',
  'City Market Context',
  'Advisory Guidance',
  'href={searchHref}',
  'href={cityMarketHref}',
  "href: '/contact'",
  '<NeighborhoodProduct3Experience model={neighborhoodProduct3Model} />',
  '<ContinueYourDecision',
  '<NearbyNeighborhoods',
]) {
  assertIncludes(neighborhoodPage, continuity, `Neighborhood continuity must remain present: ${continuity}`);
}

for (const boundary of [
  'data-neighborhood-product-2-fair-housing="neutral-non-ranking"',
  'data-neighborhood-product-2-ai="false"',
  'data-neighborhood-product-2-gis="false"',
  'data-neighborhood-product-2-telemetry="false"',
  'data-neighborhood-product-2-school-ranking="false"',
  'data-neighborhood-product-2-safety-ranking="false"',
  'data-neighborhood-product-2-demographic-targeting="false"',
  'data-neighborhood-product-2-investment-projection="false"',
  'not a ranking, suitability conclusion, safety conclusion, school-quality conclusion, investment guidance, appreciation forecast',
  'data-neighborhood-ai-advisory="false"',
  'data-neighborhood-provider-expansion="false"',
  'data-neighborhood-telemetry="false"',
]) {
  assertIncludes(neighborhoodPage, boundary, `Neighborhood boundary must remain present: ${boundary}`);
}

for (const prohibitedRuntimePattern of [
  'localStorage',
  'sessionStorage',
  'document.cookie',
  'OpenAI',
  'Mapbox',
  'best neighborhood',
  'safest neighborhood',
  'school ranking',
  'will appreciate',
  'guaranteed appreciation',
  'provider feed',
  'data-dxt-wave-1d-city-market-briefing',
]) {
  assertNotIncludes(neighborhoodPage, prohibitedRuntimePattern, `Neighborhood route must not introduce: ${prohibitedRuntimePattern}`);
}

for (const protectedRuntime of [marketIndex, cityMarketPage, buyerPage, sellerPage]) {
  assertNotIncludes(
    protectedRuntime,
    'data-dxt-wave-1d-neighborhood-place-orientation',
    'Neighborhood implementation marker must not appear outside the Neighborhood runtime route.',
  );
  assertNotIncludes(
    protectedRuntime,
    'What kind of place is this, how is it organized, and what should I verify next?',
    'Neighborhood governing question must not contaminate other runtime files.',
  );
}

for (const recordMarker of [
  'DXT_WAVE_1D_NEIGHBORHOOD_PLACE_ORIENTATION_IMPLEMENTED_LOCAL_COMMIT_ONLY',
  'READY_FOR_NEIGHBORHOOD_LOCAL_CERTIFICATION',
  'Selected runtime target: `app/market/[city]/[slug]/page.tsx`',
  'Buyer runtime unchanged',
  'Seller runtime unchanged',
  'Market runtime unchanged',
  'Search unchanged',
  'shared runtime unchanged',
]) {
  assertIncludes(implementationRecord, recordMarker, `Neighborhood implementation record must include: ${recordMarker}`);
}

assertIncludes(
  cityMarketPlan,
  'DXT_WAVE_1D_CITY_MARKET_BRIEFING_PLAN_READY',
  'City Market planning record must be present for Workstream B.',
);
assert.equal(
  packageJson.scripts?.['check:dxt-wave-1d-neighborhood-place-orientation-implementation'],
  'npm run worker:build && node dist/scripts/checkDxtWave1dNeighborhoodPlaceOrientationImplementation.js',
  'package.json must register the Neighborhood implementation check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxtWave1dNeighborhoodPlaceOrientationImplementation.ts',
  'tsconfig.worker.json must include the Neighborhood implementation check.',
);
assertIncludes(
  chatStart,
  'DXT_WAVE_1D_NEIGHBORHOOD_PLACE_ORIENTATION_IMPLEMENTED_LOCAL_COMMIT_ONLY',
  'CHAT_START must record Neighborhood implementation status.',
);

console.log(
  '[dxt-wave-1d-neighborhood-place-orientation-implementation] ok: Neighborhood hierarchy, fair-housing boundaries, continuations, runtime isolation, docs, and registrations verified.',
);
