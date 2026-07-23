import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function main() {
  const [homeSearch, searchInterface, globalsCss, searchMap, packageJson, searchControls, mapSidebar, propertyCard, saveSearch] = await Promise.all([
    readFile('components/home/HomeSearchExperience.tsx', 'utf8'),
    readFile('components/search/SearchInterface.tsx', 'utf8'),
    readFile('app/globals.css', 'utf8'),
    readFile('components/maps/SearchMap.tsx', 'utf8'),
    readFile('package.json', 'utf8'),
    readFile('components/search/SearchControls.tsx', 'utf8'),
    readFile('components/maps/MapSidebar.tsx', 'utf8'),
    readFile('components/PropertyCard.tsx', 'utf8'),
    readFile('components/maps/SaveSearch.tsx', 'utf8'),
  ]);

  for (const [label, source] of [
    ['home search', homeSearch],
    ['dedicated search', searchInterface],
  ] as const) {
    assert(source.includes('reie-search-experience-shell'), `${label} must use deterministic search shell flex CSS.`);
    assert(source.includes('reie-search-mobile-toolbar'), `${label} must use deterministic mobile toolbar display CSS.`);
    assert(source.includes('reie-search-list-pane'), `${label} must use deterministic list pane display CSS.`);
    assert(source.includes('reie-search-map-pane'), `${label} must use deterministic map pane display CSS.`);
    assert(!source.includes("hidden md:block' : 'block"), `${label} must not hide the map pane behind fragile responsive class composition.`);
    assert(!source.includes('md:hidden"'), `${label} must not rely on responsive hidden utility for the map toolbar.`);
  }

  assert(globalsCss.includes('.reie-search-experience-shell'), 'Global CSS must define public search shell layout.');
  assert(globalsCss.includes('.reie-search-discovery-intro'), 'Global CSS must define the dedicated search discovery intro.');
  assert(globalsCss.includes('flex-direction: row;'), 'Global CSS must force desktop search shell row layout.');
  assert(globalsCss.includes('.reie-search-map-pane'), 'Global CSS must define public search map pane visibility.');
  assert(globalsCss.includes(".reie-search-map-pane[data-mobile-view='list']"), 'Global CSS must preserve mobile list/map switching.');
  assert(globalsCss.includes('@media (min-width: 768px)'), 'Global CSS must force desktop map/list panes visible at the desktop breakpoint.');
  assert(globalsCss.includes('width: 35vw;'), 'Global CSS must preserve the desktop search sidebar width contract.');
  assert(globalsCss.includes('min-width: 440px;'), 'Global CSS must preserve the desktop search sidebar minimum width.');
  assert(globalsCss.includes('max-width: 560px;'), 'Global CSS must preserve the desktop search sidebar maximum width.');
  assert(globalsCss.includes('.reie-map-canvas .leaflet-tile'), 'Global CSS must include a scoped Leaflet tile reset.');
  assert(globalsCss.includes('max-width: none !important;'), 'Leaflet tile reset must prevent global image max-width rules from shrinking tiles.');
  assert(globalsCss.includes('object-fit: fill !important;'), 'Leaflet tile reset must preserve native tile geometry.');
  assert(globalsCss.includes('filter: none !important;'), 'Leaflet tile reset must not distort map tiles.');

  assert(!searchMap.includes('.reie-map-canvas::after'), 'SearchMap must not paint decorative overlays over map tiles.');
  assert(!searchMap.includes('.reie-map-canvas::before'), 'SearchMap must not paint decorative overlays over map tiles.');
  assert(!searchMap.includes('mix-blend-mode: screen'), 'SearchMap must not blend decorative overlays over geography.');
  assert(!searchMap.includes('invert(100%)'), 'SearchMap must not invert public basemap tiles.');
  assert(!searchMap.includes('hue-rotate'), 'SearchMap must not hue-shift public basemap tiles.');
  assert(!searchMap.includes('saturate(5.65)'), 'SearchMap must not heavily saturate public basemap tiles.');
  assert(!searchMap.includes('grayscale(1)'), 'SearchMap must not remove color from public basemap tiles.');
  assert(searchMap.includes('new ResizeObserver'), 'SearchMap must invalidate Leaflet size after container layout changes.');
  assert(searchMap.includes('map.invalidateSize({ animate: false, pan: false })'), 'SearchMap must explicitly recalculate Leaflet geometry.');
  assert(packageJson.includes('"check:map-rendering-safety"'), 'package.json must expose the map rendering safety check.');
  assert(searchInterface.includes('Guided Property Search'), 'Dedicated search must present guided property discovery framing.');
  assert(searchInterface.includes('Updating available listings'), 'Dedicated search must use customer-facing loading language.');
  assert(searchInterface.includes("aria-pressed={mobileView === 'list'}"), 'Mobile list toggle must expose aria-pressed state.');
  assert(searchInterface.includes("aria-pressed={mobileView === 'map'}"), 'Mobile map toggle must expose aria-pressed state.');
  assert(!searchInterface.match(/public inventory command center|command center|internal diagnostics|smoke-ready|source-health|duration diagnostics/i), 'Dedicated search shell must avoid internal operational terminology.');
  assert(searchControls.includes('Refine Your Search'), 'Search controls must use customer-facing refinement language.');
  assert(searchControls.includes('Share Search'), 'Search controls must preserve share behavior with customer-facing labeling.');
  assert(searchControls.includes('Clear Filters'), 'Search controls must preserve reset behavior with customer-facing labeling.');
  assert(searchControls.includes('<option value="Residential">Residential</option>'), 'Search controls must preserve residential filter semantics without abbreviations.');
  assert(searchControls.includes('<option value="Commercial">Commercial</option>'), 'Search controls must preserve commercial filter semantics without abbreviations.');
  assert(searchControls.includes('<option value="Multi-Family">Multi-Family</option>'), 'Search controls must preserve multi-family filter semantics without abbreviations.');
  assert(mapSidebar.includes('Helpful Next Steps'), 'Search sidebar must include customer-facing next-step guidance.');
  assert(mapSidebar.includes('Focused Results'), 'Search sidebar must describe active filter context in customer language.');
  assert(propertyCard.includes('Advisory Note'), 'Property cards must use advisory note framing.');
  assert(propertyCard.includes('Location Fit'), 'Property cards must include plain-language location fit context.');
  assert(propertyCard.includes('Property Signals'), 'Property cards must include plain-language property signals.');
  assert(propertyCard.includes('View Property'), 'Property cards must retain a clear details action.');
  assert(propertyCard.includes('data-property-card-detail-href='), 'Property cards must retain detail navigation metadata.');
  assert(saveSearch.includes('Save This Search'), 'Save-search UI must use customer-facing save language.');
  assert(saveSearch.includes('Receive updates when relevant listings appear.'), 'Save-search UI must avoid guaranteed or instant alert claims.');
  assert(saveSearch.includes("fetch('/api/save-search'"), 'Save-search UI must preserve the existing save-search request route.');
  assert(saveSearch.includes('data-save-search-email-valid'), 'Save-search UI must preserve email validation metadata.');
  for (const [label, source] of [
    ['search controls', searchControls],
    ['map sidebar', mapSidebar],
    ['property card', propertyCard],
    ['save search', saveSearch],
  ] as const) {
    assert(!source.match(/\bEFF\b|\bRES\b|\bEff\b|\bRes\b|triage|priority stack|command center|source health|AI matching|predictive|heatmap|guaranteed fit|guaranteed-fit|ROI|traffic/i), `${label} must not expose unsupported or operational Wave 2B language.`);
  }

  console.log(
    '[map-rendering-safety] ok: deterministic map pane visibility, dedicated search discovery framing, Wave 2B sidebar/card/control language, native Leaflet tile reset, resize invalidation, and no decorative basemap overlays verified.',
  );
}

main().catch((error) => {
  console.error('[map-rendering-safety] failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
