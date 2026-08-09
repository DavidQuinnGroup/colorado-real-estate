import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

async function main() {
  const [
    searchMap,
    globalsCss,
    searchInterface,
    selectedDrawer,
    mapSidebar,
    mapInner,
    propertyMap,
    marketMap,
    neighborhoodMap,
    packageJson,
    tsconfigWorker,
    publicTrust,
  ] = await Promise.all([
    readFile('components/maps/SearchMap.tsx', 'utf8'),
    readFile('app/globals.css', 'utf8'),
    readFile('components/search/SearchInterface.tsx', 'utf8'),
    readFile('components/maps/SelectedPropertyDrawer.tsx', 'utf8'),
    readFile('components/maps/MapSidebar.tsx', 'utf8'),
    readFile('components/maps/MapInner.tsx', 'utf8'),
    readFile('components/PropertyMap.tsx', 'utf8'),
    readFile('components/BoulderMarketMap.tsx', 'utf8'),
    readFile('components/NeighborhoodOverlayMap.tsx', 'utf8'),
    readFile('package.json', 'utf8'),
    readFile('tsconfig.worker.json', 'utf8'),
    readFile('lib/publicTrust.ts', 'utf8'),
  ]);

  assert(searchMap.includes("OPENTOPO_TILE_URL = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'"), 'Search map must keep the approved OpenTopoMap tile URL.');
  assert(searchMap.includes('L.tileLayer(OPENTOPO_TILE_URL'), 'Search map must use the approved OpenTopoMap layer constant.');
  assert(searchMap.includes("data-search-map-provider=\"opentopomap\""), 'Search map must expose the active current-provider posture.');
  assert(searchMap.includes('data-search-map-tile-url={OPENTOPO_TILE_URL}'), 'Search map must expose the approved tile URL for deterministic validation.');
  assert(searchMap.includes('const SEARCH_MAP_MAX_ZOOM = 17'), 'Search map max zoom must align with OpenTopoMap native tile support.');
  assert(searchMap.includes('maxNativeZoom: SEARCH_MAP_MAX_ZOOM'), 'OpenTopoMap layer must avoid non-native zoom styling drift.');
  assert(searchMap.includes('maxZoom: SEARCH_MAP_MAX_ZOOM'), 'OpenTopoMap layer must preserve the bounded max zoom contract.');
  assert(searchMap.includes('updateWhenZooming: false'), 'Search map must avoid excessive zoom-time tile churn.');
  assert(searchMap.includes('opacity: 0.96'), 'Search basemap must use one stable bounded opacity value.');
  assert(searchMap.includes('className: \'reie-search-basemap-tile\''), 'Search basemap must use a Search-scoped tile class.');
  assert(!searchMap.includes("L.tileLayer('https://{s}.tile.openstreetmap.org"), 'Search map must not add OpenStreetMap standard tiles.');
  assert(!searchMap.includes('basemaps.cartocdn.com'), 'Search map must not add CARTO tiles.');
  assert(searchMap.includes('const mapboxTileUrl = getMapboxTileUrl();'), 'Optional Mapbox path may be inspected but must remain explicit.');
  assert(searchMap.includes('const OPTIONAL_MAPBOX_OVERLAY_ENABLED = false'), 'Optional Mapbox overlay must remain defensively disabled unless separately authorized.');
  assert(searchMap.includes('if (!OPTIONAL_MAPBOX_OVERLAY_ENABLED) return null;'), 'Mapbox helper must fail closed before reading a token.');
  assert(searchMap.includes('if (mapboxTileUrl) {'), 'Mapbox path must remain conditional on the existing helper only.');
  assert(!searchMap.includes('process.env.MAPBOX_TOKEN'), 'Search map must not expose a server or secret Mapbox token.');

  assert(searchMap.includes('OPENTOPO_ATTRIBUTION'), 'Search map must define OpenTopoMap attribution.');
  assert(searchMap.includes('OpenStreetMap'), 'Search map attribution must reference OpenStreetMap contributors.');
  assert(searchMap.includes('OpenTopoMap'), 'Search map attribution must reference OpenTopoMap.');
  assert(searchMap.includes('SRTM'), 'Search map attribution must reference SRTM.');
  assert(searchMap.includes('attributionControl: true'), 'Search map must keep Leaflet attribution visible.');
  assert(searchMap.includes('attribution: OPENTOPO_ATTRIBUTION'), 'OpenTopoMap layer must attach provider attribution.');
  assert(searchMap.includes('.leaflet-control-attribution'), 'Search map must style attribution for readability.');

  assert(globalsCss.includes('.reie-map-canvas .leaflet-tile:not(.reie-search-basemap-tile)'), 'Global tile reset must allow only the Search basemap class to receive bounded visual treatment.');
  assert(globalsCss.includes('filter: none !important;'), 'Global tile reset must still protect non-basemap tile geometry and treatment.');
  assert(searchMap.includes('.reie-map-canvas .reie-search-basemap-tile.leaflet-tile'), 'Search map must scope basemap presentation to Search tiles.');
  assert(searchMap.includes('.reie-map-canvas .leaflet-tile-pane'), 'Search map must scope tile-pane presentation to the Search map.');
  assert(searchMap.includes('filter: saturate(0.74) contrast(0.9) brightness(0.96) sepia(0.04);'), 'Search map must use the approved restrained visual treatment.');
  assert(!searchMap.includes('invert(100%)'), 'Search map must not invert public basemap tiles.');
  assert(!searchMap.includes('hue-rotate'), 'Search map must not hue-shift public basemap tiles.');
  assert(!searchMap.includes('grayscale(1)'), 'Search map must not remove public basemap color.');
  assert(!searchMap.includes('mix-blend-mode: screen'), 'Search map must not use decorative blend overlays.');
  assert(!searchMap.includes('.reie-map-canvas::before'), 'Search map must not paint decorative overlays over map tiles.');
  assert(!searchMap.includes('.reie-map-canvas::after'), 'Search map must not paint decorative overlays over map tiles.');

  assert(searchMap.includes("tileStatus, setTileStatus"), 'Search map must track bounded tile loading state.');
  assert(searchMap.includes("data-search-map-tile-status={tileStatus}"), 'Search map must expose tile status for deterministic checks.');
  assert(searchMap.includes("data-testid=\"reie-search-map-tile-status\""), 'Search map must expose a bounded tile-status message.');
  assert(searchMap.includes('Map tiles are not fully available. The list remains ready for comparing homes.'), 'Unavailable map copy must preserve list fallback and avoid provider blame.');
  assert(searchMap.includes('Map detail is still loading. The list and selected property remain available.'), 'Delayed tile copy must be calm and bounded.');
  assert(searchMap.includes('aria-live="polite"'), 'Tile fallback messaging must be screen-reader-readable without being disruptive.');

  assert(searchMap.includes('data-testid="reie-search-map-marker-button"'), 'Search map markers must preserve stable marker button metadata.');
  assert(searchMap.includes('data-marker-state="${state || \'default\'}"'), 'Search map markers must preserve selected/hovered/default state metadata.');
  assert(searchMap.includes('aria-pressed="${isSelected ? \'true\' : \'false\'}"'), 'Selected marker state must remain accessible.');
  assert(searchMap.includes('.luxury-marker.selected::before'), 'Selected marker must retain a non-color-only visual state.');
  assert(searchMap.includes('luxury-cluster'), 'Search map clusters must remain application-controlled and distinct.');
  assert(searchMap.includes('fitCluster(map, cluster)'), 'Cluster interaction must remain bounded to map zoom/pan behavior.');
  assert(searchMap.includes('setSelectedId(property.id);'), 'Marker click must remain click-first selection.');
  assert(searchMap.includes('setHoveredId(null);'), 'Marker click must clear hover state.');
  assert(!searchMap.includes('Search this area'), 'Search map must not add search-this-area behavior.');
  assert(!searchMap.includes('layerControl'), 'Search map must not add provider/layer selection controls.');

  assert(searchInterface.includes('data-search-workspace-shell="persistent-search-workspace-shell"'), 'Search shell must remain intact.');
  assert(searchInterface.includes('data-search-map-visual-normalization="deferred"'), 'Search shell must preserve existing deferral metadata until a separately authorized shell update.');
  assert(searchInterface.includes('data-search-brokerage-disclosure-hold="EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING"'), 'Brokerage disclosure hold must remain unchanged.');
  assert(selectedDrawer.includes('data-selected-property-preview-model="click-pinned"'), 'Selected property drawer must remain click-pinned.');
  assert(selectedDrawer.includes('data-selected-property-detail-href='), 'Selected property detail link metadata must remain intact.');
  assert(mapSidebar.includes('data-testid="reie-map-sidebar"'), 'MapSidebar must remain the Search list surface.');
  assert(mapInner.includes('setSelectedId(\'\')'), 'MapInner must continue clearing stale selected state.');

  assert(propertyMap.includes('basemaps.cartocdn.com/dark_all'), 'Property map provider must remain unchanged.');
  assert(marketMap.includes('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'), 'Market map provider must remain unchanged.');
  assert(neighborhoodMap.includes('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'), 'Neighborhood map provider must remain unchanged.');
  assert(publicTrust.includes('COMPASS_MARKETING_EXTERNAL_APPROVAL_REQUIRED'), 'Brokerage disclosure external review hold must remain governed.');

  for (const [label, source] of [
    ['search map', searchMap],
    ['search interface', searchInterface],
    ['selected drawer', selectedDrawer],
    ['map sidebar', mapSidebar],
  ] as const) {
    assert(!source.match(/localStorage|sessionStorage|document\.cookie|navigator\.sendBeacon|gtag|analytics\(|trackEvent|CRM|customer profile|recommended lender|best home|ideal for|school ranking|crime ranking|approved for|qualified for|affordable|suitability score|fit score/i), `${label} must not introduce persistence, telemetry, CRM, recommendation, affordability, qualification, or protected claim language.`);
  }

  const packageData = JSON.parse(packageJson) as { scripts?: Record<string, string> };
  assert.equal(
    packageData.scripts?.['check:dxt-map-visual-language-normalization'],
    'npm run worker:build && node dist/scripts/checkDxtMapVisualLanguageNormalization.js',
    'package.json must expose the DXT map visual-language normalization check.',
  );
  assert(tsconfigWorker.includes('scripts/checkDxtMapVisualLanguageNormalization.ts'), 'Worker tsconfig must include the focused map visual-language normalization check.');

  console.log('[dxt-map-visual-language-normalization] ok: current-provider Search map normalization, attribution, zoom alignment, scoped presentation, marker/preview preservation, no provider switch, and protected boundaries verified.');
}

main().catch((error) => {
  console.error('[dxt-map-visual-language-normalization] failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
