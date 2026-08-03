import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

const neighborhoodPage = read('app/market/[city]/[slug]/page.tsx');
const implementationRecord = read(
  'docs/project-atlas/executive-library/REIE-DXT-2-NEIGHBORHOOD-DECISION-READINESS-DEPTH-IMPLEMENTATION.md',
);
const chatStart = read('docs/CHAT_START.md');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'data-testid="dxt-2-neighborhood-decision-readiness-depth"',
  'data-dxt-2-neighborhood-readiness-depth="implemented"',
  'data-dxt-2-neighborhood-readiness-runtime-scope="app/market/[city]/[slug]/page.tsx"',
  'data-dxt-2-neighborhood-readiness-existing-evidence-only="true"',
  'data-dxt-2-neighborhood-readiness-market-change="false"',
  'data-dxt-2-neighborhood-readiness-city-market-change="false"',
  'data-dxt-2-neighborhood-readiness-search-change="false"',
  'data-dxt-2-neighborhood-readiness-property-change="false"',
  'data-dxt-2-neighborhood-readiness-product-3-preserved="true"',
  'data-dxt-2-neighborhood-readiness-related-content-preserved="true"',
  'data-dxt-2-neighborhood-readiness-nearby-neighborhoods-preserved="true"',
  'data-dxt-2-neighborhood-readiness-schema-preserved="true"',
  'data-dxt-2-neighborhood-readiness-faq-preserved="true"',
  'data-dxt-2-neighborhood-readiness-provider-activation="false"',
  'data-dxt-2-neighborhood-readiness-api-change="false"',
  'data-dxt-2-neighborhood-readiness-hidden-context="false"',
  'data-dxt-2-neighborhood-readiness-persistence="false"',
  'data-dxt-2-neighborhood-readiness-telemetry="false"',
  'data-dxt-2-neighborhood-readiness-ai="false"',
  'data-dxt-2-neighborhood-readiness-scoring="false"',
  'data-dxt-2-neighborhood-readiness-ranking="false"',
  'Neighborhood Decision Readiness',
  'Evidence available now',
  'Evidence unavailable here',
  'Directional context',
  'Assumptions to separate',
  'Unknowns',
  'Verification needs',
  'Questions to carry forward',
  'Next-decision thresholds',
  'Confidence is qualitative and descriptive, not a score.',
  'Review City Market evidence',
  'Refine Search inventory',
  'Open a specific Property',
  'Prepare professional review',
  'No ranking, suitability, safety, school-quality, investment, appreciation, provider, or AI conclusion',
]) {
  assertIncludes(neighborhoodPage, phrase, `Neighborhood readiness implementation must include: ${phrase}`);
}

for (const preserved of [
  '<NeighborhoodProduct3Experience model={neighborhoodProduct3Model} />',
  '<RelatedContent',
  '<NearbyNeighborhoods',
  '<FAQSchema faqs={neighborhoodFaqs} pageUrl={canonicalUrl} />',
  'buildNeighborhoodSchema',
  'Search This Neighborhood',
  'City Market Context',
  '/contact#advisory-readiness',
]) {
  assertIncludes(neighborhoodPage, preserved, `Neighborhood readiness must preserve: ${preserved}`);
}

for (const prohibited of [
  'neighborhoodReadinessScore',
  'recommendedNeighborhood',
  'bestNeighborhood',
  'schoolRating',
  'safetyScore',
  'investmentScore',
  'appreciationForecast',
  'localStorage',
  'sessionStorage',
  'document.cookie',
  'navigator.sendBeacon',
]) {
  assert(!neighborhoodPage.includes(prohibited), `Neighborhood readiness must not introduce ${prohibited}.`);
}

for (const phrase of [
  'Status: `DXT_2_NEIGHBORHOOD_DECISION_READINESS_DEPTH_IMPLEMENTED_LOCAL_COMMIT_ONLY`',
  'READY_FOR_DXT_2_NEIGHBORHOOD_DECISION_READINESS_DEPTH_LOCAL_CERTIFICATION',
  'app/market/[city]/[slug]/page.tsx',
  'What kind of place is this, how is it organized, and what should I verify next?',
  'Evidence available now',
  'Evidence unavailable here',
  'Confidence is qualitative and descriptive, not a score.',
  'Product 3, RelatedContent, NearbyNeighborhoods, schema, and FAQ behavior remain preserved.',
  'no Search API change',
  'no provider activation',
  'no hidden context',
  'no persistence',
  'no telemetry',
]) {
  assertIncludes(implementationRecord, phrase, `Neighborhood readiness record must include: ${phrase}`);
}

assertIncludes(
  chatStart,
  'DXT_2_NEIGHBORHOOD_DECISION_READINESS_DEPTH_IMPLEMENTED_LOCAL_COMMIT_ONLY',
  'CHAT_START must record the Neighborhood readiness local implementation status.',
);
assert.equal(
  packageJson.scripts?.['check:dxt-2-neighborhood-decision-readiness-depth-implementation'],
  'npm run worker:build && node dist/scripts/checkDxt2NeighborhoodDecisionReadinessDepthImplementation.js',
  'package.json must register the DXT 2 Neighborhood readiness implementation check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxt2NeighborhoodDecisionReadinessDepthImplementation.ts',
  'tsconfig.worker.json must include the DXT 2 Neighborhood readiness implementation check.',
);

console.log(
  '[dxt-2-neighborhood-decision-readiness-depth-implementation] ok: route-local Neighborhood readiness depth, existing evidence, Product 3 preservation, and protected boundaries verified.',
);
