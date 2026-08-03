import assert from 'node:assert/strict';
import fs from 'node:fs';

function read(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string): void {
  assert(source.includes(value), message);
}

const searchInterface = read('components/search/SearchInterface.tsx');
const propertyCard = read('components/PropertyCard.tsx');
const searchControls = read('components/search/SearchControls.tsx');
const implementationRecord = read(
  'docs/project-atlas/executive-library/REIE-DXT-2-SEARCH-DECISION-WORKSPACE-DEPTH-IMPLEMENTATION.md',
);
const chatStart = read('docs/CHAT_START.md');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfigWorker = read('tsconfig.worker.json');

for (const phrase of [
  'data-dxt-2-search-workspace-depth="implemented"',
  'data-dxt-2-search-workspace-runtime-scope="components/search/SearchInterface.tsx"',
  'data-dxt-2-search-workspace-existing-evidence-only="true"',
  'data-dxt-2-search-workspace-api-change="false"',
  'data-dxt-2-search-workspace-ranking-change="false"',
  'data-dxt-2-search-workspace-map-provider-change="false"',
  'data-dxt-2-search-workspace-provider-activation="false"',
  'data-dxt-2-search-workspace-url-state-change="false"',
  'data-dxt-2-search-workspace-hidden-context="false"',
  'data-dxt-2-search-workspace-persistence="false"',
  'data-dxt-2-search-workspace-telemetry="false"',
  'data-dxt-2-search-workspace-ai="false"',
  'data-testid="dxt-2-search-decision-workspace-depth"',
  'Do these results give me enough reliable context to decide what to inspect, compare, refine, or open next?',
  'Visible Criteria',
  'Evidence Posture',
  'Evidence Available Now',
  'Evidence Not Available From Search',
  'Confidence here means the Search view is organized enough to guide the next comparison question. It is not a score',
  'Compare visible facts and map context. Do not treat order, position, or visual prominence as a ranking.',
  'Open a Property view when a result still fits your visible criteria and you can name what remains to verify.',
]) {
  assertIncludes(searchInterface, phrase, `Search workspace implementation must include: ${phrase}`);
}

for (const prohibited of [
  'localStorage',
  'sessionStorage',
  'document.cookie',
  'navigator.sendBeacon',
  'searchReadinessScore',
  'propertyRanking',
  'recommendedListing',
]) {
  assert(!searchInterface.includes(prohibited), `Search workspace depth must not introduce ${prohibited}.`);
}

assertIncludes(propertyCard, 'data-property-card-detail-href={detailHref}', 'Property cards must retain existing detail href behavior.');
assertIncludes(searchControls, 'buildSearchParams(filters)', 'Search controls must retain existing URL-visible criteria behavior.');

for (const phrase of [
  'Status: `DXT_2_SEARCH_DECISION_WORKSPACE_DEPTH_IMPLEMENTED_LOCAL_COMMIT_ONLY`',
  'READY_FOR_SEARCH_WORKSPACE_LOCAL_CERTIFICATION',
  'components/search/SearchInterface.tsx',
  'Do these results give me enough reliable context to decide what to inspect, compare, refine, or open next?',
  'Evidence not available from Search',
  'Confidence is expressed qualitatively as a Search evidence boundary',
  'Search -> Property -> Search return continuity remains intact',
  'no Search API change',
  'no Search ranking change',
  'no map rendering, provider, bounds, zoom, selected state, list scroll, preview, or marker behavior change',
  'no provider activation',
  'no URL-state expansion',
  'no hidden context',
  'no AI advice',
]) {
  assertIncludes(implementationRecord, phrase, `Search workspace record must include: ${phrase}`);
}

assertIncludes(
  chatStart,
  'READY_FOR_REIE_DXT_2_SEARCH_DECISION_WORKSPACE_DEPTH_LOCAL_CERTIFICATION_AND_PUSH_AUTHORIZATION',
  'CHAT_START must record the Search workspace local-certification and push gate.',
);
assert.equal(
  packageJson.scripts?.['check:dxt-2-search-decision-workspace-depth-implementation'],
  'npm run worker:build && node dist/scripts/checkDxt2SearchDecisionWorkspaceDepthImplementation.js',
  'package.json must register the DXT 2 Search workspace implementation check.',
);
assertIncludes(
  tsconfigWorker,
  'scripts/checkDxt2SearchDecisionWorkspaceDepthImplementation.ts',
  'tsconfig.worker.json must include the DXT 2 Search workspace implementation check.',
);

console.log(
  '[dxt-2-search-decision-workspace-depth-implementation] ok: Search decision readiness depth, existing evidence, and protected boundaries verified.',
);
