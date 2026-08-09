import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  SEARCH_MAP_LOCAL_TRUST_ADVANCEMENT_STATUS,
  buildLocalSourceFreshnessPresentation,
  buildSearchMapIntelligencePresentation,
} from '../lib/searchMapLocalTrustAdvancement.js';

function read(path: string) {
  return readFileSync(path, 'utf8');
}

function assertIncludes(source: string, value: string, message: string) {
  assert(source.includes(value), message);
}

function assertNotIncludes(source: string, value: string, message: string) {
  assert(!source.includes(value), message);
}

const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfig = read('tsconfig.worker.json');
const model = read('lib/searchMapLocalTrustAdvancement.ts');
const localCue = read('components/LocalSourceFreshnessCue.tsx');
const searchInterface = read('components/search/SearchInterface.tsx');
const searchMap = read('components/maps/SearchMap.tsx');
const mapSidebar = read('components/maps/MapSidebar.tsx');
const marketIndex = read('app/market/page.tsx');
const cityMarket = read('app/market/[city]/page.tsx');
const neighborhoodMarket = read('app/market/[city]/[slug]/page.tsx');
const chatStart = read('docs/CHAT_START.md');
const executiveRecord = read('docs/project-atlas/executive-library/REIE-SEARCH-MAP-LOCAL-TRUST-ADVANCEMENT-IMPLEMENTATION.md');

assert.equal(
  packageJson.scripts?.['check:search-map-local-trust-advancement'],
  'npm run worker:build && node dist/scripts/checkSearchMapLocalTrustAdvancement.js',
  'package.json must expose the Search Map Local Trust Advancement check.',
);
assertIncludes(tsconfig, 'lib/searchMapLocalTrustAdvancement.ts', 'Worker build must include the shared Search Map Local Trust model.');
assertIncludes(tsconfig, 'scripts/checkSearchMapLocalTrustAdvancement.ts', 'Worker build must include the Search Map Local Trust check.');
assert.equal(SEARCH_MAP_LOCAL_TRUST_ADVANCEMENT_STATUS, 'SEARCH_MAP_LOCAL_TRUST_ADVANCEMENT_IMPLEMENTED');

const searchModel = buildSearchMapIntelligencePresentation({
  visibleListingCount: 12,
  mappedListingCount: 9,
  selectedPropertyLabel: '123 Main Street',
  generatedAt: '2026-08-09T00:00:00.000Z',
});
assert.equal(searchModel.status, SEARCH_MAP_LOCAL_TRUST_ADVANCEMENT_STATUS);
assert.equal(searchModel.methodologyHref, '/sources');
assert.equal(searchModel.cues.length, 3);
assert.deepEqual(searchModel.continuityPath, ['SEARCH MAP', 'PLACE ORIENTATION', 'LOCAL INTELLIGENCE', 'PROPERTY', 'COMPARE']);
for (const boundary of Object.values(searchModel.protectedBoundaries)) {
  assert.equal(boundary, false, 'Search map protected boundaries must remain false.');
}

for (const surface of ['market', 'city', 'neighborhood'] as const) {
  const localModel = buildLocalSourceFreshnessPresentation({
    surface,
    title: `${surface} source cue`,
    source: 'Governed visible route context.',
    observedUpdated: 'Rendered from current route context.',
    representation: 'Representative local intelligence context.',
    limitation: 'Verification required before reliance.',
  });
  assert.equal(localModel.status, SEARCH_MAP_LOCAL_TRUST_ADVANCEMENT_STATUS);
  assert.equal(localModel.methodologyHref, '/sources');
  assert(localModel.evidenceLanguage.includes('SUPPORTED FACT'));
  assert(localModel.evidenceLanguage.includes('VERIFICATION REQUIRED'));
  for (const boundary of Object.values(localModel.protectedBoundaries)) {
    assert.equal(boundary, false, `${surface} protected boundaries must remain false.`);
  }
}

for (const marker of [
  'data-search-map-local-trust-advancement={searchMapIntelligence.status}',
  'data-search-map-intelligence-api-change={String(searchMapIntelligence.protectedBoundaries.searchApiChange)}',
  'data-search-map-intelligence-map-behavior-change={String(searchMapIntelligence.protectedBoundaries.mapBehaviorChange)}',
  'data-search-map-intelligence-provider-activation={String(searchMapIntelligence.protectedBoundaries.providerActivation)}',
  'data-testid="search-map-intelligence-presentation"',
  'data-search-map-continuity-path={searchMapIntelligence.continuityPath.join',
  'data-testid="search-map-intelligence-methodology-link"',
]) {
  assertIncludes(searchInterface, marker, `SearchInterface missing Search Map Local Trust marker: ${marker}`);
}

for (const marker of [
  'data-testid="reie-search-map-cluster-button"',
  'data-map-intelligence="selected-property-orientation"',
  'data-map-intelligence="place-cluster-orientation"',
  'data-search-map-local-trust-presentation="implemented"',
  'data-search-map-local-trust-methodology-href="/sources"',
  'data-search-map-api-change="false"',
  'data-search-map-behavior-change="false"',
  'data-testid="reie-search-map-orientation"',
  'data-search-map-intelligence="place-context"',
]) {
  assertIncludes(searchMap, marker, `SearchMap missing local intelligence marker: ${marker}`);
}

for (const marker of [
  'data-testid="reie-sidebar-map-local-trust-cue"',
  'data-sidebar-local-source="visible-search-result-set"',
  'data-sidebar-local-methodology-href="/sources"',
  'data-sidebar-search-api-change="false"',
  'data-sidebar-map-behavior-change="false"',
  'data-sidebar-provider-activation="false"',
]) {
  assertIncludes(mapSidebar, marker, `MapSidebar missing local trust cue marker: ${marker}`);
}

for (const marker of [
  'data-testid="local-source-freshness-cue"',
  'data-local-trust-status={presentation.status}',
  'data-local-trust-methodology-href={presentation.methodologyHref}',
  'data-local-trust-source-registry-change={String(presentation.protectedBoundaries.sourceRegistryChange)}',
  'data-local-trust-provider-activation={String(presentation.protectedBoundaries.providerActivation)}',
  'data-local-trust-county-activation={String(presentation.protectedBoundaries.countyActivation)}',
  'data-local-trust-bcod-activation={String(presentation.protectedBoundaries.bcodActivation)}',
  'data-testid="local-source-freshness-methodology-link"',
]) {
  assertIncludes(localCue, marker, `LocalSourceFreshnessCue missing marker: ${marker}`);
}

for (const [source, route] of [
  [marketIndex, 'market index'],
  [cityMarket, 'city market'],
  [neighborhoodMarket, 'neighborhood route'],
] as const) {
  assertIncludes(source, 'LocalSourceFreshnessCue', `${route} must render the shared source/freshness cue.`);
  assertIncludes(source, 'buildLocalSourceFreshnessPresentation', `${route} must build a route-specific source/freshness presentation.`);
}

for (const source of [model, localCue, searchInterface, searchMap, mapSidebar]) {
  for (const prohibitedRuntime of [
    'PrismaClient',
    'createClient(',
    'navigator.sendBeacon',
    'localStorage',
    'sessionStorage',
    'document.cookie',
    'FormData',
    '<form',
    '<input',
    '<textarea',
  ]) {
    assertNotIncludes(source, prohibitedRuntime, `Search Map Local Trust must not introduce protected runtime behavior: ${prohibitedRuntime}`);
  }
}

assertNotIncludes(model, 'fetch(', 'Shared Search Map Local Trust model must not fetch.');
assertNotIncludes(localCue, 'fetch(', 'Local source/freshness cue must not fetch.');
assertNotIncludes(searchMap, 'fetch(', 'Search map presentation must not fetch.');
assertNotIncludes(mapSidebar, 'fetch(', 'Map sidebar presentation must not fetch.');

for (const source of [model, localCue, searchMap, mapSidebar]) {
  for (const prohibitedClaim of [
    'best neighborhood',
    'safest neighborhood',
    'school ranking',
    'safety ranking',
    'investment recommendation',
    'appreciation certainty',
    'suitability conclusion',
    'protected class',
    'personalized recommendation',
    'AI-powered recommendation',
  ]) {
    assertNotIncludes(source, prohibitedClaim, `Search Map Local Trust must not introduce prohibited claim: ${prohibitedClaim}`);
  }
}

assertIncludes(executiveRecord, 'SEARCH_MAP_LOCAL_TRUST_ADVANCEMENT_LOCALLY_CERTIFIED', 'Executive record must capture local certification status.');
assertIncludes(executiveRecord, 'No push occurred.', 'Executive record must preserve no-push boundary.');
assertIncludes(chatStart, 'SEARCH_MAP_LOCAL_TRUST_ADVANCEMENT_LOCALLY_CERTIFIED', 'CHAT_START must carry current local handoff status.');
assertIncludes(chatStart, 'READY_FOR_SEARCH_MAP_LOCAL_TRUST_ADVANCEMENT_PUSH_AUTHORIZATION', 'CHAT_START must name the next push gate.');

console.log('[search-map-local-trust-advancement] ok: Search map presentation, local source/freshness cues, methodology routing, protected boundaries, docs, and no protected runtime changes verified.');
