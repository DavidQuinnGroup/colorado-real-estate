import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

function assertIncludes(source: string, expected: string, message: string) {
  assert(source.includes(expected), message);
}

function assertNotIncludes(source: string, forbidden: string, message: string) {
  assert(!source.includes(forbidden), message);
}

function visibleCardCopy(source: string) {
  const start = source.indexOf('return (');
  return start >= 0 ? source.slice(start) : source;
}

async function main() {
  const [searchInterface, searchControls, mapSidebar, propertyCard, selectedDrawer, returnContext, packageJson, tsconfigWorker] = await Promise.all([
    readFile('components/search/SearchInterface.tsx', 'utf8'),
    readFile('components/search/SearchControls.tsx', 'utf8'),
    readFile('components/maps/MapSidebar.tsx', 'utf8'),
    readFile('components/PropertyCard.tsx', 'utf8'),
    readFile('components/maps/SelectedPropertyDrawer.tsx', 'utf8'),
    readFile('lib/search/searchReturnContext.ts', 'utf8'),
    readFile('package.json', 'utf8'),
    readFile('tsconfig.worker.json', 'utf8'),
  ]);

  assertIncludes(searchInterface, 'data-search-first-screen-hierarchy="decision-status-criteria-list-map-selection"', 'Search shell must keep explicit first-screen hierarchy metadata.');
  assertIncludes(searchInterface, 'data-testid="reie-search-result-count"', 'Search intro must expose result count near the first screen.');
  assertIncludes(searchInterface, 'data-search-evidence-state={evidenceLabel}', 'Search intro must expose current evidence/freshness state.');
  assertIncludes(searchInterface, 'data-testid="reie-search-premium-guidance-disclosure"', 'Long Search guidance must move behind progressive disclosure.');
  assertIncludes(searchInterface, 'data-search-first-scan-guidance-placement="progressive-disclosure-before-list"', 'Guidance placement must be explicitly bounded before listing scan.');
  assertIncludes(searchInterface, '<MapSidebar', 'Search must preserve the existing sidebar/list surface.');
  assertIncludes(searchInterface, '<MapInner', 'Search must preserve the existing map surface.');
  assertIncludes(searchInterface, '<SelectedPropertyDrawer property={selectedProperty} onClose={() => setSelectedId(null)} />', 'Selected Property drawer must remain integrated.');
  assertIncludes(searchInterface, 'parseSearchReturnContext', 'Search return context parsing must remain active.');
  assertIncludes(searchInterface, 'data-search-return-context-handoff="bounded-url-and-history-state"', 'Search return context must remain bounded to URL/history state.');

  assertIncludes(searchControls, 'data-search-core-criteria="city,query"', 'Search controls must keep city and query as core criteria.');
  assertIncludes(searchControls, 'data-search-advanced-criteria="minPrice,maxPrice,propertyType,beds,baths"', 'Advanced criteria must remain discoverable without becoming first-screen overload.');
  assertIncludes(searchControls, 'data-testid="reie-search-active-chip"', 'Active criteria chips must remain removable.');
  assertIncludes(searchControls, 'onClick={onReset}', 'Reset must remain an explicit safe action.');

  assertIncludes(mapSidebar, '<ResultsToolbar count={listings.length}', 'Results toolbar must remain immediately above listing cards.');
  assertIncludes(mapSidebar, 'data-testid="reie-sidebar-after-scan-context"', 'Deeper sidebar context must render after the first property scan.');
  assert(mapSidebar.indexOf('<ResultsToolbar count={listings.length}') < mapSidebar.indexOf('data-testid="reie-sidebar-after-scan-context"'), 'Results and listing scan must precede deeper sidebar context.');
  assertIncludes(mapSidebar, '<SaveSearch city={stats.dominantCity} />', 'Save Search must remain existing customer-controlled continuity.');
  assertIncludes(mapSidebar, 'data-sidebar-persistence="false"', 'Sidebar trust cue must not add persistence.');
  assertIncludes(mapSidebar, 'data-sidebar-telemetry="false"', 'Sidebar trust cue must not add telemetry.');
  assertIncludes(mapSidebar, 'data-sidebar-provider-activation="false"', 'Sidebar trust cue must not activate providers.');

  assertIncludes(propertyCard, 'data-testid="reie-property-card-core-facts"', 'Property card must keep fact-first scan fields.');
  assertIncludes(propertyCard, 'View Property', 'Property card must keep explicit View Property action.');
  assertIncludes(propertyCard, 'Verification cue', 'Property card must present one concise neutral verification cue.');
  assertIncludes(propertyCard, 'Open the property page to review full records, condition, and cost questions.', 'Property card visible guidance must point to deeper property review.');
  assertIncludes(propertyCard, 'Context and verification', 'Deeper card intelligence must remain behind disclosure.');
  assertIncludes(propertyCard, 'data-property-card-v8-attention-label={decisionSupport.attentionLabel}', 'Existing deterministic decision-support metadata must remain available without changing Search semantics.');
  assertNotIncludes(visibleCardCopy(propertyCard), 'Ready for a closer look', 'Property card visible copy must not imply readiness ranking.');
  assertNotIncludes(visibleCardCopy(propertyCard), 'Worth a closer', 'Property card visible copy must not imply priority ranking.');

  assertIncludes(selectedDrawer, 'buildSearchReturnPath', 'Selected drawer must preserve bounded Search return URL creation.');
  assertIncludes(selectedDrawer, 'buildPropertyHrefWithSearchReturn', 'Selected drawer must preserve bounded property handoff URL creation.');
  assertIncludes(selectedDrawer, 'data-search-return-handoff="bounded-url"', 'Selected drawer must expose bounded URL handoff.');
  assertIncludes(selectedDrawer, 'Open the full listing details to review property facts and verification questions.', 'Selected drawer must keep neutral property handoff copy.');
  assertNotIncludes(selectedDrawer, 'Worth a closer look', 'Selected drawer must not imply property ranking.');

  assertIncludes(returnContext, "value.startsWith('/search')", 'Return path must remain internal to Search.');
  assertIncludes(returnContext, "value.startsWith('//') || value.includes('://')", 'Return path must still reject external origins and protocol URLs.');
  assertIncludes(returnContext, 'SEARCH_RETURN_ALLOWED_CRITERIA', 'Search return criteria allowlist must remain centralized.');
  for (const blockedKey of ['savedSearchId', 'userId', 'profileId', 'customerId', 'sessionId']) {
    assertNotIncludes(returnContext, `'${blockedKey}'`, `Return context must not allow ${blockedKey}.`);
  }

  for (const [label, source] of [
    ['search interface', searchInterface],
    ['search controls', searchControls],
    ['map sidebar', mapSidebar],
    ['property card', propertyCard],
    ['selected drawer', selectedDrawer],
  ] as const) {
    for (const forbidden of ['best match', 'recommended property', 'safest', 'best school', 'most suitable', 'best neighborhood', 'investment winner', 'property score', 'fit score', 'desirability score']) {
      assert(!source.toLowerCase().includes(forbidden), `${label} must not expose forbidden Search/property recommendation language: ${forbidden}.`);
    }
    for (const protectedChange of ['api/search/route', 'PrismaClient', 'typesense', 'sendBeacon', 'gtag(', 'analytics(', 'localStorage', 'sessionStorage', 'document.cookie']) {
      assert(!source.includes(protectedChange), `${label} must not introduce protected runtime, provider, persistence, or telemetry behavior: ${protectedChange}.`);
    }
  }

  const packageData = JSON.parse(packageJson) as { scripts?: Record<string, string> };
  assert.equal(
    packageData.scripts?.['check:search-property-discovery-premium-flow'],
    'npm run worker:build && node dist/scripts/checkSearchPropertyDiscoveryPremiumFlow.js',
    'package.json must expose the Search property discovery premium-flow check.',
  );
  assertIncludes(tsconfigWorker, 'scripts/checkSearchPropertyDiscoveryPremiumFlow.ts', 'Worker tsconfig must include the premium-flow check.');

  console.log('[search-property-discovery-premium-flow] ok: compact hierarchy, criteria controls, fact-first cards, list/map sync, Search return safety, continuity, and protected-system boundaries verified.');
}

main().catch((error) => {
  console.error('[search-property-discovery-premium-flow] failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
