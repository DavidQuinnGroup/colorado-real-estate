import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function main() {
  const [searchMap, searchInterface, selectedDrawer, mapSidebar, mapInner, packageJson] = await Promise.all([
    readFile('components/maps/SearchMap.tsx', 'utf8'),
    readFile('components/search/SearchInterface.tsx', 'utf8'),
    readFile('components/maps/SelectedPropertyDrawer.tsx', 'utf8'),
    readFile('components/maps/MapSidebar.tsx', 'utf8'),
    readFile('components/maps/MapInner.tsx', 'utf8'),
    readFile('package.json', 'utf8'),
  ]);

  assert(searchMap.includes('data-testid="reie-search-map-marker-button"'), 'Search map markers must expose stable marker button metadata.');
  assert(searchMap.includes('data-marker-state="${state || \'default\'}"'), 'Search map markers must expose selected/hovered/default states.');
  assert(searchMap.includes('aria-pressed="${isSelected ? \'true\' : \'false\'}"'), 'Selected marker state must be available to assistive technology.');
  assert(searchMap.includes("marker.on('click', () =>"), 'Marker click handler must remain present.');
  assert(searchMap.includes('setSelectedId(property.id);'), 'Marker click must select the property.');
  assert(searchMap.includes('setHoveredId(null);'), 'Marker click must clear supplemental hover state.');
  assert(searchMap.includes("marker.on('mouseover', () =>"), 'Hover may remain as supplemental synchronization.');
  assert(searchMap.includes("marker.on('mouseout', () =>"), 'Hover exit may clear supplemental hover state.');
  assert(!searchMap.includes('marker.bindPopup(buildPopupHtml(property)'), 'Marker selection must not bind the old actionable Leaflet popup.');
  assert(!searchMap.includes('marker.openPopup()'), 'Marker selection must not depend on Leaflet popup opening.');
  assert(!searchMap.includes('data-testid="reie-property-map-popup"'), 'Search map must not expose the old hover-dependent popup as the actionable preview.');
  assert(searchMap.includes('.luxury-marker.selected'), 'Selected marker must have a distinct selected visual state.');
  assert(searchMap.includes('.luxury-marker.hovered'), 'Hover marker state must remain visually separate from selected state.');
  assert(searchMap.includes('.luxury-marker.selected::before'), 'Selected marker must not communicate state by color alone.');

  assert(searchInterface.includes('data-search-preview-model="click-pinned"'), 'Search interface must expose the click-pinned preview model.');
  assert(searchInterface.includes('data-search-preview-hover-dependent="false"'), 'Search interface must state that preview is not hover-dependent.');
  assert(searchInterface.includes('function handleWorkspaceKeyDown'), 'Search workspace must handle keyboard dismissal.');
  assert(searchInterface.includes("event.key !== 'Escape'"), 'Escape dismissal must be explicitly bounded.');
  assert(searchInterface.includes('setSelectedId(null);'), 'Escape/reset paths must clear selected state.');
  assert(searchInterface.includes('<SelectedPropertyDrawer property={selectedProperty} onClose={() => setSelectedId(null)} />'), 'Selected property must render through the existing pinned drawer.');

  assert(selectedDrawer.includes('data-testid="reie-selected-property-drawer"'), 'Pinned preview drawer must expose stable metadata.');
  assert(selectedDrawer.includes('data-selected-property-preview-model="click-pinned"'), 'Pinned preview drawer must expose click-pinned model metadata.');
  assert(selectedDrawer.includes('data-selected-property-preview-hover-dependent="false"'), 'Pinned preview drawer must certify no hover dependency.');
  assert(selectedDrawer.includes('data-selected-property-preview-dismissible="close-or-escape"'), 'Pinned preview drawer must expose bounded dismissal metadata.');
  assert(selectedDrawer.includes('fixed z-[1200]'), 'Pinned preview drawer must remain above Search toolbar controls on mobile.');
  assert(selectedDrawer.includes('data-testid="reie-selected-property-close"'), 'Pinned preview drawer must preserve explicit close control.');
  assert(selectedDrawer.includes("style={{ height: '44px', right: '1rem', top: '1rem', width: '44px' }}"), 'Pinned preview close control must preserve a stable touch target.');
  assert(selectedDrawer.includes('data-testid="reie-selected-property-detail-link"'), 'Pinned preview drawer must preserve the primary property-detail CTA.');
  assert(selectedDrawer.includes('data-selected-property-detail-href={propertyHref}'), 'Primary CTA must preserve the existing property route destination.');
  assert(selectedDrawer.includes('ResilientListingImage'), 'Pinned preview must retain missing-image fallback behavior.');

  assert(mapSidebar.includes('data-sidebar-listing-selected={String(isSelected)}'), 'Sidebar must expose selected listing synchronization metadata.');
  assert(mapSidebar.includes('onClick={() => handleSelect(property)}'), 'Listing-card selection must remain available as the accessible fallback path.');
  assert(mapSidebar.includes('onFocus={() => onHover(property.id)}'), 'List focus may still synchronize supplemental hover state.');
  assert(mapInner.includes('setSelectedId(\'\')'), 'MapInner must clear stale selected state when the selected listing leaves visible results.');

  for (const [label, source] of [
    ['search map', searchMap],
    ['search interface', searchInterface],
    ['selected drawer', selectedDrawer],
  ] as const) {
    assert(!source.match(/localStorage|sessionStorage|document\.cookie|navigator\.sendBeacon|gtag|analytics\(|trackEvent|recommended lender|best home|ideal for|school ranking|crime|approved|qualified|affordable/i), `${label} must not introduce persistence, telemetry, provider, recommendation, or protected claim language.`);
  }

  const packageData = JSON.parse(packageJson) as { scripts?: Record<string, string> };
  assert.equal(
    packageData.scripts?.['check:dxt-search-marker-preview-interaction'],
    'npm run worker:build && node dist/scripts/checkDxtSearchMarkerPreviewInteraction.js',
    'package.json must expose the DXT marker/preview interaction check.',
  );

  console.log('[dxt-search-marker-preview-interaction] ok: click-pinned marker selection, hover boundaries, drawer preview, CTA, dismissal, synchronization, accessibility fallback, and protected boundaries verified.');
}

main().catch((error) => {
  console.error('[dxt-search-marker-preview-interaction] failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
