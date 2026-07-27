import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function main() {
  const [
    searchInterface,
    searchControls,
    mapSidebar,
    searchMap,
    mapInner,
    globalsCss,
    apiSearch,
    saveSearch,
    propertyInquiry,
    valuation,
    gisLicensingStandard,
    packageJson,
  ] = await Promise.all([
    readFile('components/search/SearchInterface.tsx', 'utf8'),
    readFile('components/search/SearchControls.tsx', 'utf8'),
    readFile('components/maps/MapSidebar.tsx', 'utf8'),
    readFile('components/maps/SearchMap.tsx', 'utf8'),
    readFile('components/maps/MapInner.tsx', 'utf8'),
    readFile('app/globals.css', 'utf8'),
    readFile('app/api/search/route.ts', 'utf8'),
    readFile('components/maps/SaveSearch.tsx', 'utf8'),
    readFile('app/api/property-inquiry/route.ts', 'utf8'),
    readFile('app/api/valuation/route.ts', 'utf8'),
    readFile('docs/project-atlas/geographic-intelligence/GIS-1.0-LICENSING-AND-ATTRIBUTION-STANDARD.md', 'utf8'),
    readFile('package.json', 'utf8'),
  ]);

  assert(searchControls.includes('export function getActiveFilterChips'), 'Search controls must expose deterministic active-chip helper.');
  assert(searchControls.includes('data-testid="reie-search-active-count"'), 'Search controls must expose active-count metadata.');
  assert(searchControls.includes('data-testid="reie-search-criteria-summary"'), 'Search controls must expose criteria summary metadata.');
  assert(searchControls.includes('data-testid="reie-search-active-chip"'), 'Search controls must expose active chip metadata.');
  assert(searchControls.includes('aria-label={`Remove ${chip.label}`}'), 'Active chips must have removal labels.');
  assert(searchControls.includes('City or town'), 'City input must clarify supported place entry.');
  assert(searchControls.includes('Use this when you already know an address, ZIP code, keyword, or MLS number.'), 'Specific-property helper must preserve certified query-entry wording.');
  assert(searchControls.includes('Neighborhood names and listing details can also help narrow supported search text.'), 'Specific-property helper must clarify additional supported text entry without changing semantics.');
  assert(!searchControls.match(/AI-powered|best match|perfect home|guaranteed|off-market|favorites|mortgage/i), 'Search controls must avoid unauthorized claim language.');

  assert(searchInterface.includes('data-testid="reie-search-state-announcement"'), 'Search interface must expose live search-state announcement.');
  assert(searchInterface.includes('data-testid="reie-search-state-panel"'), 'Search interface must expose customer-safe state panel.');
  assert(searchInterface.includes('data-testid="reie-search-degraded-status"'), 'Search interface must expose degraded fallback status.');
  assert(searchInterface.includes('data-testid="reie-search-zero-result-recovery"'), 'Search interface must expose zero-result recovery.');
  assert(searchInterface.includes('data-testid="reie-search-zero-result-clear"'), 'Zero-result recovery must include clear-search control.');
  assert(searchInterface.includes('onBoundsChange={handleBoundsChange}'), 'Dedicated search must observe map movement for customer-safe state context.');
  assert(searchInterface.includes('Map movement preserves this result set until criteria change'), 'Dedicated search must not imply map movement automatically reloads results.');
  assert(searchInterface.includes('Search is using a safe fallback'), 'Degraded status must use customer-safe fallback language.');
  assert(searchInterface.includes('setHasMovedMap(false)'), 'Clear Search must reset map-movement state.');
  assert(!searchInterface.match(/internal diagnostics|smoke-ready|source-health|stack trace|credentials|provider secret/i), 'Search interface must avoid internal operational language.');

  assert(mapSidebar.includes('onClearSearch?: () => void'), 'Map sidebar must accept clear-search recovery action.');
  assert(mapSidebar.includes('data-testid="reie-sidebar-empty-state"'), 'Map sidebar must expose empty-state metadata.');
  assert(mapSidebar.includes('data-testid="reie-sidebar-empty-clear-search"'), 'Map sidebar empty state must expose clear-search control.');
  assert(mapSidebar.includes('Remove one active chip above.'), 'Map sidebar zero-state guidance must include chip removal.');
  assert(mapSidebar.includes('Broaden place, price, home type, beds, or baths.'), 'Map sidebar zero-state guidance must include broadening criteria.');
  assert(mapSidebar.includes('Clear the search to restart broadly.'), 'Map sidebar zero-state guidance must include restart path.');

  assert(globalsCss.includes('.reie-search-state-panel'), 'Global CSS must define search state panel.');
  assert(globalsCss.includes('.reie-search-safe-status'), 'Global CSS must define degraded fallback status.');
  assert(globalsCss.includes('.reie-search-recovery-panel'), 'Global CSS must define zero-result recovery panel.');
  assert(globalsCss.includes(".reie-search-map-pane[data-mobile-view='list']"), 'Global CSS must preserve mobile List/Map switching.');
  assert(globalsCss.includes('@media (min-width: 768px)'), 'Global CSS must preserve desktop breakpoint behavior.');

  assert(searchMap.includes('data-testid="reie-search-map-diagnostics"'), 'Search map diagnostics metadata must remain available.');
  assert(searchMap.includes('data-testid="reie-search-map-orientation"'), 'Search map orientation must remain available.');
  assert(searchMap.includes('Properties shown here have public map coordinates.'), 'Search map must preserve public-coordinate boundary language.');
  assert(mapInner.includes('onBoundsChange?: (bounds: MapBounds) => void'), 'MapInner must preserve bounds callback contract.');

  assert(apiSearch.includes('type SearchResponse ='), 'Search API response contract must remain in place.');
  assert(apiSearch.includes('type SearchResponseMeta ='), 'Search API metadata contract must remain in place.');
  assert(apiSearch.includes('searchSupabasePropertiesWithMeta'), 'Search API must preserve Supabase fallback path.');
  assert(apiSearch.includes('searchTypesenseDocuments'), 'Search API must preserve Typesense provider path.');

  assert(saveSearch.includes("fetch('/api/save-search'"), 'Sprint 1 must preserve existing Save Search route.');
  assert(propertyInquiry.includes("INSERT INTO \"CRMTask\""), 'Sprint 1 must not remove existing property inquiry CRM path.');
  assert(valuation.includes("INSERT INTO \"SellerLead\""), 'Sprint 1 must not remove existing seller lead path.');
  assert(gisLicensingStandard.includes('does not authorize provider contact'), 'GIS provider-contact boundary must remain documented.');

  const packageData = JSON.parse(packageJson) as { scripts?: Record<string, string> };
  assert.equal(
    packageData.scripts?.['check:cep-search-map-baseline'],
    'npm run worker:build && node dist/scripts/checkCepSearchMapBaseline.js',
    'package.json must expose the CEP Sprint 1 search/map baseline check.',
  );

  for (const [label, source] of [
    ['search interface', searchInterface],
    ['search controls', searchControls],
    ['map sidebar', mapSidebar],
    ['search map', searchMap],
  ] as const) {
    assert(!source.match(/chatbot|AI guidance|mortgage calculator|recommended lender|saved property|favorite|GIS Sprint 9|provider connection/i), `${label} must not introduce excluded Sprint 1 capabilities.`);
  }

  console.log('[cep-search-map-baseline] ok: search entry clarity, active criteria, zero-result recovery, degraded status, map/list state, and protected boundaries verified.');
}

main().catch((error) => {
  console.error('[cep-search-map-baseline] failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
