import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function main() {
  const [
    searchInterface,
    searchControls,
    globalsCss,
    searchMap,
    selectedDrawer,
    mapSidebar,
    mapInner,
    publicTrust,
    packageJson,
  ] = await Promise.all([
    readFile('components/search/SearchInterface.tsx', 'utf8'),
    readFile('components/search/SearchControls.tsx', 'utf8'),
    readFile('app/globals.css', 'utf8'),
    readFile('components/maps/SearchMap.tsx', 'utf8'),
    readFile('components/maps/SelectedPropertyDrawer.tsx', 'utf8'),
    readFile('components/maps/MapSidebar.tsx', 'utf8'),
    readFile('components/maps/MapInner.tsx', 'utf8'),
    readFile('lib/publicTrust.ts', 'utf8'),
    readFile('package.json', 'utf8'),
  ]);

  assert(searchInterface.includes('data-search-workspace-shell="persistent-search-workspace-shell"'), 'Search must expose a persistent workspace shell.');
  assert(searchInterface.includes('data-search-first-screen-hierarchy="decision-status-criteria-list-map-selection"'), 'Search first-screen hierarchy must be explicit.');
  assert(searchInterface.includes('id="reie-search-decision-prompt"'), 'Search decision prompt must anchor the first-screen hierarchy.');
  assert(searchInterface.includes('Which homes deserve your attention?'), 'Search must retain the decision-oriented governing question.');
  assert(searchInterface.includes('data-search-shell-region="orientation"'), 'Search must expose the orientation region.');
  assert(searchInterface.includes('data-search-shell-region="result-status"'), 'Search must expose result-status treatment.');
  assert(searchInterface.includes('data-search-shell-region="active-criteria"'), 'Search must expose active-criteria treatment.');
  assert(searchInterface.includes('data-search-shell-region="workspace-steps"'), 'Search must expose guided workspace steps.');
  assert(searchInterface.includes('data-search-shell-region="list-and-criteria"'), 'Search must expose the list and criteria shell region.');
  assert(searchInterface.includes('data-search-shell-region="map-and-preview"'), 'Search must expose the map and preview shell region.');
  assert(searchInterface.includes('data-testid="reie-search-decision-strip"'), 'Search must include the decision summary strip.');
  assert(searchInterface.includes('data-search-shell-hierarchy="decision-status-criteria-list-map-selection"'), 'Decision strip must expose certified shell order.');
  assert(searchInterface.includes('data-search-selected-property={selectedPropertyLabel}'), 'Decision strip must expose selected-property orientation.');
  assert(searchInterface.includes('data-search-property-context-restoration="deferred"'), 'Property Detail Context Preservation must remain deferred.');
  assert(searchInterface.includes('data-search-map-visual-normalization="deferred"'), 'Map Visual-Language Normalization must remain deferred.');
  assert(searchInterface.includes('data-search-brokerage-disclosure-hold="EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING"'), 'Brokerage disclosure must remain on external review hold.');
  assert(searchInterface.includes('data-search-persistence="false"'), 'Search shell must certify no persistence.');
  assert(searchInterface.includes('data-testid="reie-search-state-announcement"'), 'Search shell must retain live state announcement.');
  assert(searchInterface.includes('data-testid="reie-search-workspace-summary"'), 'Search shell must retain active criteria summary.');
  assert(searchInterface.includes('data-testid="reie-search-mobile-list-toggle"'), 'Search shell must retain the mobile list toggle.');
  assert(searchInterface.includes('data-testid="reie-search-mobile-map-toggle"'), 'Search shell must retain the mobile map toggle.');
  assert(searchInterface.includes('<SelectedPropertyDrawer property={selectedProperty} onClose={() => setSelectedId(null)} />'), 'Selected property preview must remain click-pinned and dismissible.');
  assert(searchInterface.includes('Map movement preserves this result set until criteria change'), 'Map movement status must remain informative without adding a new search-this-area workflow.');

  assert(searchControls.includes('data-search-shell-region="criteria-entry"'), 'Search controls must expose the criteria entry region.');
  assert(searchControls.includes('data-search-core-criteria="city,query"'), 'Core criteria must remain city and query only.');
  assert(searchControls.includes('data-search-advanced-criteria="minPrice,maxPrice,propertyType,beds,baths"'), 'Advanced criteria must match the certified supported filters.');
  assert(searchControls.includes('data-testid="reie-search-core-criteria"'), 'Core criteria must be explicitly identified.');
  assert(searchControls.includes('data-search-criteria-tier="core"'), 'Core criteria tier must be explicit.');
  assert(searchControls.includes('data-testid="reie-search-advanced-criteria"'), 'Advanced criteria disclosure must be explicitly identified.');
  assert(searchControls.includes('data-search-criteria-tier="advanced-disclosure"'), 'Advanced criteria must stay inside a bounded disclosure.');
  assert(searchControls.includes('Advanced criteria: refine budget and home details'), 'Advanced criteria copy must clearly subordinate non-core refinements.');
  assert(searchControls.includes('aria-label={`Remove ${chip.label}`}'), 'Active criteria chips must remain removable by accessible name.');
  assert(searchControls.includes('Treat price range as a search boundary, not an affordability conclusion.'), 'Price filters must not become affordability guidance.');

  assert(globalsCss.includes('.reie-search-decision-strip'), 'Decision strip styling must be present.');
  assert(globalsCss.includes('.reie-search-decision-strip-item'), 'Decision strip item styling must be present.');
  assert(globalsCss.includes('grid-template-columns: repeat(4, minmax(0, 1fr));'), 'Decision strip must use stable desktop columns.');
  assert(globalsCss.includes('.reie-search-map-pane'), 'Existing map pane styling must remain present.');
  assert(globalsCss.includes('@media (max-width: 767px)'), 'Search must retain mobile-specific shell behavior.');

  assert(searchMap.includes('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'), 'OpenTopoMap tile posture must remain unchanged.');
  assert(searchMap.includes('getMapboxTileUrl'), 'Optional Mapbox tile helper posture must remain unchanged.');
  assert(!searchMap.includes('Search this area'), 'Wave 1B must not add search-this-area interaction.');
  assert(selectedDrawer.includes('data-selected-property-preview-model="click-pinned"'), 'Selected property drawer must remain a click-pinned preview.');
  assert(selectedDrawer.includes('data-testid="reie-selected-property-detail-link"'), 'Selected property drawer must retain the property-detail transition.');
  assert(mapSidebar.includes('data-testid="reie-map-sidebar"'), 'List shell must retain existing MapSidebar.');
  assert(mapSidebar.includes('data-sidebar-listing-selected={String(isSelected)}'), 'List shell must retain selected-listing orientation.');
  assert(mapInner.includes('setSelectedId(\'\')'), 'MapInner must continue clearing stale selected state.');
  assert(publicTrust.includes('COMPASS_MARKETING_EXTERNAL_APPROVAL_REQUIRED'), 'Brokerage disclosure external review hold must remain governed.');

  for (const [label, source] of [
    ['search interface', searchInterface],
    ['search controls', searchControls],
    ['search map', searchMap],
    ['selected drawer', selectedDrawer],
  ] as const) {
    assert(!source.match(/localStorage|sessionStorage|document\.cookie|navigator\.sendBeacon|gtag|analytics|recommended lender|best home|ideal for|school ranking|crime ranking|approved for|qualified for|rate guarantee/i), `${label} must not introduce persistence, telemetry, provider, recommendation, or protected claim language.`);
  }

  const packageData = JSON.parse(packageJson) as { scripts?: Record<string, string> };
  assert.equal(
    packageData.scripts?.['check:dxt-search-workspace-shell'],
    'npm run worker:build && node dist/scripts/checkDxtSearchWorkspaceShell.js',
    'package.json must expose the DXT Search workspace shell check.',
  );

  console.log('[dxt-search-workspace-shell] ok: hierarchy, criteria tiers, active summary, list/map shell, selected preview, deferrals, brokerage hold, accessibility metadata, and protected boundaries verified.');
}

main().catch((error) => {
  console.error('[dxt-search-workspace-shell] failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
