'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { formatLuxuryPrice } from '@/lib/utils/formatters';
import type { MapSidebarListing } from './MapSidebar';

type UserTier = 'Public' | 'Contracted';

type MapBounds = {
  north?: number;
  south?: number;
  east?: number;
  west?: number;
  neLat?: number;
  swLat?: number;
  neLng?: number;
  swLng?: number;
} | null;

type CoordinateListing = MapSidebarListing & {
  lat: number;
  lng: number;
};

type MarkerLayerGroup = L.FeatureGroup & {
  clearLayers: () => MarkerLayerGroup;
  addLayer: (layer: L.Layer) => MarkerLayerGroup;
};

type ClusterBucket = {
  id: string;
  listings: CoordinateListing[];
  lat: number;
  lng: number;
};

type MarkerStats = {
  activeMarkers: number;
  clusterMarkers: number;
  coordinateListings: number;
  renderedMarkers: number;
};

export type SearchMapMeta = {
  accessLevel?: string;
  boundsApplied?: boolean;
  durationMs?: number;
  filtersApplied?: string[];
  generatedAt?: string;
  health?: 'healthy' | 'degraded' | string;
  source?: string;
  returned?: number;
  mapped?: number;
  coordinateFiltered?: number;
  smoke?: {
    ready?: boolean;
    blockers?: string[];
    checks?: {
      accessLevel?: string;
      boundsApplied?: boolean;
      coordinateFiltered?: number;
      durationMs?: number;
      foundPublicMetadata?: boolean;
      hasTypesenseContext?: boolean;
      health?: string;
      limit?: number;
      mapped?: number;
      returned?: number;
      source?: string;
    };
  };
  customerExperience?: {
    usable?: boolean;
    providerDegraded?: boolean;
    providerFallbackActive?: boolean;
    relevanceContractSatisfied?: boolean;
    dataQualityWarnings?: string[];
  };
};

type SearchMapProps = {
  listings: MapSidebarListing[];
  onBoundsChange?: (bounds: MapBounds) => void;
  selectedId: string | null;
  setSelectedId: (id: string) => void;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  center?: [number, number];
  searchMeta?: SearchMapMeta | null;
  userTier: UserTier;
};

const CLUSTER_GRID_SIZE = 86;
const CLUSTER_DISABLE_ZOOM = 15;
const SEARCH_MAP_MIN_ZOOM = 8;
const SEARCH_MAP_MAX_ZOOM = 17;
const SEARCH_MAP_INITIAL_ZOOM = 12;
const OPENTOPO_TILE_URL = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
const OPTIONAL_MAPBOX_OVERLAY_ENABLED = false;
const OPENTOPO_ATTRIBUTION =
  'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, SRTM | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)';
const MAPBOX_ATTRIBUTION =
  '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

function hasCoordinates(property: MapSidebarListing): property is CoordinateListing {
  return (
    Number.isFinite(property.lat) &&
    Number.isFinite(property.lng) &&
    Math.abs(Number(property.lat)) <= 90 &&
    Math.abs(Number(property.lng)) <= 180 &&
    !(Number(property.lat) === 0 && Number(property.lng) === 0)
  );
}

function getMapboxTileUrl() {
  if (!OPTIONAL_MAPBOX_OVERLAY_ENABLED) return null;

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!token) return null;

  return `https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/tiles/256/{z}/{x}/{y}@2x?access_token=${token}`;
}

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatMetaCount(value: number | undefined, fallback: number) {
  return Number.isFinite(value) ? Number(value) : fallback;
}

function formatMetaDuration(value: number | undefined) {
  if (!Number.isFinite(value)) return null;
  const duration = Number(value);
  return duration < 1000 ? `${duration}ms` : `${(duration / 1000).toFixed(1)}s`;
}

function formatMetaFilters(value: string[] | undefined) {
  if (!value || value.length === 0) return 'no filters';
  if (value.length <= 3) return value.join(' + ');
  return `${value.slice(0, 3).join(' + ')} +${value.length - 3}`;
}

function getCustomerSearchLabel(searchMeta: SearchMapMeta | null) {
  if (!searchMeta) return 'initial';
  if (searchMeta.customerExperience?.usable === false) return 'review';
  return 'search ready';
}

function getFallbackBounds(map: L.Map): MapBounds {
  let center = L.latLng(40.0174, -105.276);

  try {
    center = map.getCenter();
  } catch {
    const configuredCenter = map.options.center;
    if (Array.isArray(configuredCenter)) {
      center = L.latLng(configuredCenter[0], configuredCenter[1]);
    } else if (configuredCenter) {
      center = L.latLng(configuredCenter);
    }
  }

  const latSpan = 0.2;
  const lngSpan = 0.3;
  const north = center.lat + latSpan / 2;
  const south = center.lat - latSpan / 2;
  const east = center.lng + lngSpan / 2;
  const west = center.lng - lngSpan / 2;

  return {
    north,
    south,
    east,
    west,
    neLat: north,
    neLng: east,
    swLat: south,
    swLng: west,
  };
}

function getMapBounds(map: L.Map): MapBounds {
  try {
    map.invalidateSize({ animate: false, pan: false });
  } catch {
    return getFallbackBounds(map);
  }

  try {
    const bounds = map.getBounds();
    const northEast = bounds.getNorthEast();
    const southWest = bounds.getSouthWest();

    if (northEast.lat === southWest.lat || northEast.lng === southWest.lng) {
      return getFallbackBounds(map);
    }

    return {
      north: bounds.getNorth(),
      south: bounds.getSouth(),
      east: bounds.getEast(),
      west: bounds.getWest(),
      neLat: northEast.lat,
      neLng: northEast.lng,
      swLat: southWest.lat,
      swLng: southWest.lng,
    };
  } catch {
    return getFallbackBounds(map);
  }
}

function getClusterBuckets(map: L.Map, listings: CoordinateListing[], activeIds: Set<string>) {
  if (map.getZoom() >= CLUSTER_DISABLE_ZOOM) {
    return listings.map((listing) => ({
      id: `single-${listing.id}`,
      listings: [listing],
      lat: listing.lat,
      lng: listing.lng,
    }));
  }

  const buckets = new Map<string, CoordinateListing[]>();

  for (const listing of listings) {
    if (activeIds.has(listing.id)) continue;

    const point = map.latLngToLayerPoint([listing.lat, listing.lng]);
    const gridX = Math.round(point.x / CLUSTER_GRID_SIZE);
    const gridY = Math.round(point.y / CLUSTER_GRID_SIZE);
    const key = `${gridX}:${gridY}`;
    const existing = buckets.get(key);

    if (existing) {
      existing.push(listing);
    } else {
      buckets.set(key, [listing]);
    }
  }

  return Array.from(buckets.entries()).map(([id, bucketListings]) => {
    const totals = bucketListings.reduce(
      (accumulator, listing) => ({
        lat: accumulator.lat + listing.lat,
        lng: accumulator.lng + listing.lng,
      }),
      { lat: 0, lng: 0 },
    );

    return {
      id,
      listings: bucketListings,
      lat: totals.lat / bucketListings.length,
      lng: totals.lng / bucketListings.length,
    };
  });
}

type ListingMarkerState = 'selected' | 'hovered' | null;

function createListingMarker(property: CoordinateListing, state: ListingMarkerState) {
  const isSelected = state === 'selected';
  const isHovered = state === 'hovered';
  const markerStateClass = isSelected ? ' selected' : isHovered ? ' hovered' : '';
  const address = escapeHtml(property.address || 'Colorado property');
  const price = escapeHtml(formatLuxuryPrice(Number(property.price)));

  return L.marker([property.lat, property.lng], {
    icon: L.divIcon({
      className: 'luxury-marker-container',
      html: `<button class="luxury-marker${markerStateClass}" type="button" data-testid="reie-search-map-marker-button" data-marker-property-id="${escapeHtml(property.id)}" data-marker-state="${state || 'default'}" aria-label="${isSelected ? 'Selected listing' : 'Select listing'}: ${address}" aria-pressed="${isSelected ? 'true' : 'false'}"><span>${price}</span></button>`,
      iconAnchor: [42, 19],
    }),
    keyboard: true,
    title: property.address || 'Colorado property',
  });
}

function createClusterMarker(cluster: ClusterBucket) {
  return L.marker([cluster.lat, cluster.lng], {
    icon: L.divIcon({
      className: 'luxury-cluster-container',
      html: `<button class="luxury-cluster" type="button"><span>${cluster.listings.length}</span><small>homes</small></button>`,
      iconAnchor: [25, 25],
      iconSize: [50, 50],
    }),
    keyboard: true,
    title: `${cluster.listings.length} Colorado properties`,
  });
}

function fitCluster(map: L.Map, cluster: ClusterBucket) {
  const bounds = L.latLngBounds(cluster.listings.map((listing) => [listing.lat, listing.lng] as [number, number]));

  if (bounds.isValid() && cluster.listings.length > 1) {
    map.fitBounds(bounds.pad(0.22), {
      animate: true,
      maxZoom: Math.min(Math.max(map.getZoom() + 2, CLUSTER_DISABLE_ZOOM), SEARCH_MAP_MAX_ZOOM),
      padding: [72, 72],
    });
    return;
  }

  map.setView([cluster.lat, cluster.lng], Math.min(map.getZoom() + 2, SEARCH_MAP_MAX_ZOOM), { animate: true });
}

export default function SearchMap({
  listings = [],
  onBoundsChange,
  selectedId,
  setSelectedId,
  hoveredId,
  setHoveredId,
  center = [40.0174, -105.276],
  searchMeta = null,
  userTier = 'Public',
}: SearchMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markerLayerRef = useRef<MarkerLayerGroup | null>(null);
  const onBoundsChangeRef = useRef<SearchMapProps['onBoundsChange']>(onBoundsChange);
  const boundsTimerRef = useRef<number | null>(null);
  const tileLoadDelayTimerRef = useRef<number | null>(null);
  const pendingTileCountRef = useRef(0);
  const failedTileCountRef = useRef(0);
  const selectedPanIdRef = useRef<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [tileStatus, setTileStatus] = useState<'initial' | 'loading' | 'delayed' | 'ready' | 'unavailable'>('initial');
  const [markerStats, setMarkerStats] = useState<MarkerStats>({
    activeMarkers: 0,
    clusterMarkers: 0,
    coordinateListings: 0,
    renderedMarkers: 0,
  });
  const [viewportVersion, setViewportVersion] = useState(0);
  const coordinateListingCount = listings.filter(hasCoordinates).length;
  const returnedCount = formatMetaCount(searchMeta?.returned, listings.length);
  const mappedCount = formatMetaCount(searchMeta?.mapped, coordinateListingCount);
  const coordinateFilteredCount = formatMetaCount(searchMeta?.coordinateFiltered, Math.max(0, returnedCount - mappedCount));
  const metaDuration = formatMetaDuration(searchMeta?.durationMs);
  const metaFilters = formatMetaFilters(searchMeta?.filtersApplied);
  const smokeReady = searchMeta?.smoke?.ready;
  const smokeBlockerCount = searchMeta?.smoke?.blockers?.length ?? 0;
  const shouldShowSearchDiagnostics = Boolean(searchMeta) || coordinateFilteredCount > 0;
  const customerSearchLabel = getCustomerSearchLabel(searchMeta);

  useEffect(() => {
    onBoundsChangeRef.current = onBoundsChange;
  }, [onBoundsChange]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const container = containerRef.current;

    const map = L.map(container, {
      center,
      zoom: SEARCH_MAP_INITIAL_ZOOM,
      minZoom: SEARCH_MAP_MIN_ZOOM,
      maxZoom: SEARCH_MAP_MAX_ZOOM,
      zoomControl: false,
      attributionControl: true,
    });

    const emitBounds = () => {
      const nextBounds = getMapBounds(map);
      onBoundsChangeRef.current?.(nextBounds);
    };

    const scheduleBoundsEmit = (delay = 225) => {
      if (boundsTimerRef.current) {
        window.clearTimeout(boundsTimerRef.current);
      }

      boundsTimerRef.current = window.setTimeout(() => {
        window.requestAnimationFrame(emitBounds);
      }, delay);
    };

    const handleMapMove = () => {
      scheduleBoundsEmit();
    };

    const handleMapViewportChange = () => {
      scheduleBoundsEmit();
      setViewportVersion((version) => version + 1);
    };

    const mapboxTileUrl = getMapboxTileUrl();

    const clearTileDelayTimer = () => {
      if (tileLoadDelayTimerRef.current) {
        window.clearTimeout(tileLoadDelayTimerRef.current);
        tileLoadDelayTimerRef.current = null;
      }
    };

    const scheduleTileDelay = () => {
      clearTileDelayTimer();
      tileLoadDelayTimerRef.current = window.setTimeout(() => {
        if (pendingTileCountRef.current > 0) {
          setTileStatus('delayed');
        }
      }, 1400);
    };

    const updateTileReadyState = () => {
      if (pendingTileCountRef.current > 0) return;
      clearTileDelayTimer();
      setTileStatus(failedTileCountRef.current > 0 ? 'unavailable' : 'ready');
    };

    const openTopoLayer = L.tileLayer(OPENTOPO_TILE_URL, {
      attribution: OPENTOPO_ATTRIBUTION,
      className: 'reie-search-basemap-tile',
      maxNativeZoom: SEARCH_MAP_MAX_ZOOM,
      maxZoom: SEARCH_MAP_MAX_ZOOM,
      updateWhenIdle: true,
      updateWhenZooming: false,
      keepBuffer: 2,
      opacity: 0.96,
    });

    openTopoLayer.on('tileloadstart', () => {
      pendingTileCountRef.current += 1;
      setTileStatus('loading');
      scheduleTileDelay();
    });

    openTopoLayer.on('tileload', () => {
      pendingTileCountRef.current = Math.max(0, pendingTileCountRef.current - 1);
      updateTileReadyState();
    });

    openTopoLayer.on('tileerror', () => {
      pendingTileCountRef.current = Math.max(0, pendingTileCountRef.current - 1);
      failedTileCountRef.current += 1;
      updateTileReadyState();
    });

    openTopoLayer.addTo(map);

    if (mapboxTileUrl) {
      L.tileLayer(mapboxTileUrl, {
        className: 'reie-mapbox-detail-tiles',
        attribution: MAPBOX_ATTRIBUTION,
        maxZoom: SEARCH_MAP_MAX_ZOOM,
        opacity: 0.18,
        tileSize: 256,
      }).addTo(map);
    }

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const markerLayer = L.layerGroup() as MarkerLayerGroup;

    markerLayer.addTo(map);
    markerLayerRef.current = markerLayer;
    mapRef.current = map;
    setMapReady(true);

    const resizeObserver =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(() => {
            window.requestAnimationFrame(() => {
              map.invalidateSize({ animate: false, pan: false });
              scheduleBoundsEmit(100);
            });
          });

    resizeObserver?.observe(container);
    map.on('moveend', handleMapMove);
    map.on('zoomend resize', handleMapViewportChange);
    map.whenReady(() => scheduleBoundsEmit(400));
    scheduleBoundsEmit(700);

    return () => {
      if (boundsTimerRef.current) {
        window.clearTimeout(boundsTimerRef.current);
        boundsTimerRef.current = null;
      }
      clearTileDelayTimer();
      pendingTileCountRef.current = 0;
      failedTileCountRef.current = 0;

      map.off('moveend', handleMapMove);
      map.off('zoomend resize', handleMapViewportChange);
      resizeObserver?.disconnect();
      map.remove();
      mapRef.current = null;
      markerLayerRef.current = null;
      selectedPanIdRef.current = null;
      setMapReady(false);
    };
  }, [center]);

  useEffect(() => {
    if (!selectedId) {
      selectedPanIdRef.current = null;
    }
  }, [selectedId]);

  useEffect(() => {
    if (!mapReady || !mapRef.current || !markerLayerRef.current) return;

    const map = mapRef.current;
    const markerLayer = markerLayerRef.current;
    const coordinateListings = listings.filter(hasCoordinates);
    const activeIds = new Set([selectedId, hoveredId].filter((id): id is string => Boolean(id)));
    const clusters = getClusterBuckets(map, coordinateListings, activeIds);
    const activeListings = coordinateListings.filter((property) => activeIds.has(property.id));
    const clusterMarkerCount = clusters.filter((cluster) => cluster.listings.length > 1).length;
    const nextMarkerStats = {
      activeMarkers: activeListings.length,
      clusterMarkers: clusterMarkerCount,
      coordinateListings: coordinateListings.length,
      renderedMarkers: clusters.length + activeListings.length,
    };
    let selectedMarker: L.Marker | null = null;

    setMarkerStats((currentStats) =>
      currentStats.activeMarkers === nextMarkerStats.activeMarkers &&
      currentStats.clusterMarkers === nextMarkerStats.clusterMarkers &&
      currentStats.coordinateListings === nextMarkerStats.coordinateListings &&
      currentStats.renderedMarkers === nextMarkerStats.renderedMarkers
        ? currentStats
        : nextMarkerStats,
    );

    markerLayer.clearLayers();

    for (const cluster of clusters) {
      if (cluster.listings.length > 1) {
        const clusterMarker = createClusterMarker(cluster);

        clusterMarker.on('click', () => {
          fitCluster(map, cluster);
          setHoveredId(null);
        });

        markerLayer.addLayer(clusterMarker);
        continue;
      }

      const property = cluster.listings[0];
      const markerState: ListingMarkerState = selectedId === property.id ? 'selected' : hoveredId === property.id ? 'hovered' : null;
      const marker = createListingMarker(property, markerState);

      marker.on('click', () => {
        setSelectedId(property.id);
        setHoveredId(null);
      });

      marker.on('mouseover', () => {
        setHoveredId(property.id);
      });

      marker.on('mouseout', () => {
        if (selectedId !== property.id) {
          setHoveredId(null);
        }
      });

      if (selectedId === property.id) {
        selectedMarker = marker;
      }

      markerLayer.addLayer(marker);
    }

    for (const property of activeListings) {
      const markerState: ListingMarkerState = selectedId === property.id ? 'selected' : hoveredId === property.id ? 'hovered' : null;
      const marker = createListingMarker(property, markerState);

      marker.on('click', () => {
        setSelectedId(property.id);
        setHoveredId(null);
      });

      marker.on('mouseover', () => {
        setHoveredId(property.id);
      });

      marker.on('mouseout', () => {
        if (selectedId !== property.id) {
          setHoveredId(null);
        }
      });

      if (selectedId === property.id) {
        selectedMarker = marker;
      }

      markerLayer.addLayer(marker);
    }

    const markerToShow = selectedMarker as L.Marker | null;

    if (markerToShow) {
      if (selectedId && selectedPanIdRef.current !== selectedId) {
        selectedPanIdRef.current = selectedId;
        map.panTo(markerToShow.getLatLng(), { animate: true });
      }

    }

    if (coordinateListings.length === 1) {
      map.setView([coordinateListings[0].lat, coordinateListings[0].lng], Math.min(Math.max(map.getZoom(), 13), SEARCH_MAP_MAX_ZOOM), { animate: true });
    }
  }, [listings, mapReady, selectedId, hoveredId, setSelectedId, setHoveredId, viewportVersion]);

  return (
    <div className="relative h-full w-full" data-testid="reie-search-map-surface">
      <div
        ref={containerRef}
        className="reie-map-canvas h-full w-full"
        data-testid="reie-search-map-canvas"
        data-map-ready={String(mapReady)}
        data-map-coordinate-listing-count={markerStats.coordinateListings}
        data-map-rendered-marker-count={markerStats.renderedMarkers}
        data-map-cluster-count={markerStats.clusterMarkers}
        data-map-active-marker-count={markerStats.activeMarkers}
        data-selected-listing-id={selectedId || ''}
        data-hovered-listing-id={hoveredId || ''}
        data-user-tier={userTier}
        data-search-source={searchMeta?.source || 'initial'}
        data-search-health={searchMeta?.health || 'unknown'}
        data-search-access-level={searchMeta?.accessLevel || 'public'}
        data-search-bounds-applied={searchMeta?.boundsApplied ? 'true' : 'false'}
        data-search-returned={returnedCount}
        data-search-mapped={mappedCount}
        data-search-coordinate-filtered={coordinateFilteredCount}
        data-search-duration-ms={searchMeta?.durationMs ?? ''}
        data-search-filters={(searchMeta?.filtersApplied || []).join(',')}
        data-search-generated-at={searchMeta?.generatedAt || ''}
        data-search-smoke-ready={smokeReady === undefined ? 'unknown' : smokeReady ? 'true' : 'false'}
        data-search-smoke-blockers={smokeBlockerCount}
        data-search-map-provider="opentopomap"
        data-search-map-tile-url={OPENTOPO_TILE_URL}
        data-search-map-max-zoom={SEARCH_MAP_MAX_ZOOM}
        data-search-map-tile-status={tileStatus}
      />

      {shouldShowSearchDiagnostics ? (
        <div
          className={`pointer-events-none absolute right-4 top-4 z-[720] border px-3 py-2 text-[9px] font-black uppercase tracking-[0.18em] shadow-[0_18px_48px_rgba(0,0,0,0.42)] ${
            searchMeta?.health === 'degraded'
              ? 'border-amber-300/28 bg-black/76 text-amber-100/76'
              : 'border-white/12 bg-black/70 text-white/62'
          }`}
          data-testid="reie-search-map-diagnostics"
          data-map-ready={String(mapReady)}
          data-map-coordinate-listing-count={markerStats.coordinateListings}
          data-map-rendered-marker-count={markerStats.renderedMarkers}
          data-map-cluster-count={markerStats.clusterMarkers}
          data-map-active-marker-count={markerStats.activeMarkers}
          data-search-source={searchMeta?.source || 'initial'}
          data-search-health={searchMeta?.health || 'unknown'}
          data-search-smoke-ready={smokeReady === undefined ? 'unknown' : smokeReady ? 'true' : 'false'}
        >
          <div>
            <span className={searchMeta?.health === 'degraded' ? 'text-amber-200' : 'text-cyan-200'}>
              {customerSearchLabel}
            </span>
            <span className="mx-2 text-white/25">/</span>
            <span>{mappedCount} mapped</span>
            {coordinateFilteredCount > 0 ? (
              <>
                <span className="mx-2 text-white/25">/</span>
                <span className="text-amber-200">{coordinateFilteredCount} filtered</span>
              </>
            ) : null}
          </div>
          <div className="mt-1 text-white/35">
            <span>{searchMeta?.boundsApplied ? 'Criteria area' : 'Map context'}</span>
            <span className="mx-2 text-white/20">/</span>
            <span>List is criteria-led</span>
            <span className="sr-only">{metaFilters}{metaDuration ? ` / ${metaDuration}` : ''}</span>
          </div>
          {smokeReady !== undefined ? (
            <div className="mt-1 text-white/35">
              <span className={smokeReady ? 'text-emerald-200' : 'text-cyan-200'}>{smokeReady ? 'Map Ready' : 'Explore on Map'}</span>
              {smokeBlockerCount > 0 ? (
                <>
                  <span className="mx-2 text-white/20">/</span>
                  <span>{smokeBlockerCount} blocker{smokeBlockerCount === 1 ? '' : 's'}</span>
                </>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      <div
        className="reie-map-orientation pointer-events-none z-[710] max-w-[min(360px,calc(100%-2rem))] rounded-[8px] bg-[#071017]/78 px-4 py-3 text-white shadow-[0_22px_60px_rgba(0,0,0,0.42)] backdrop-blur"
        data-testid="reie-search-map-orientation"
        aria-hidden="true"
      >
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100/78">Colorado Map Guide</p>
        <p className="mt-1 text-[11px] font-bold leading-5 text-white/66">
          Properties shown here have public map coordinates. Select a marker to compare it with the list.
          Read terrain, towns, and listing clusters together when an area deserves closer comparison.
        </p>
      </div>

      {tileStatus === 'delayed' || tileStatus === 'unavailable' ? (
        <div
          className="reie-map-tile-status pointer-events-none absolute bottom-4 left-4 z-[715] max-w-[min(340px,calc(100%-2rem))] rounded-[8px] border border-white/10 bg-[#071017]/82 px-3 py-2 text-[11px] font-bold leading-5 text-white/72 shadow-[0_18px_48px_rgba(0,0,0,0.42)] backdrop-blur"
          data-testid="reie-search-map-tile-status"
          data-tile-status={tileStatus}
          aria-live="polite"
        >
          {tileStatus === 'unavailable'
            ? 'Map tiles are not fully available. The list remains ready for comparing homes.'
            : 'Map detail is still loading. The list and selected property remain available.'}
        </div>
      ) : null}

      <style jsx global>{`
        .leaflet-container {
          background: #071017 !important;
          font-family: inherit;
        }

        .reie-map-canvas {
          background: radial-gradient(circle at 50% 42%, rgba(37, 58, 52, 0.3), rgba(7, 16, 23, 0.92) 68%) !important;
          isolation: isolate;
          position: relative;
        }

        .reie-map-canvas .leaflet-tile-pane {
          background: #0a1518;
          filter: saturate(0.74) contrast(0.9) brightness(0.96) sepia(0.04);
          opacity: 0.96;
        }

        .reie-map-orientation {
          left: 1rem;
          position: absolute;
          top: 1rem;
          z-index: 710;
        }

        .leaflet-control-zoom {
          border: 0 !important;
          border-radius: 8px !important;
          box-shadow: 0 18px 42px rgba(0, 0, 0, 0.48) !important;
          overflow: hidden;
          z-index: 720 !important;
        }

        .leaflet-control-zoom a {
          width: 34px !important;
          height: 34px !important;
          border: 0 !important;
          border-radius: 0 !important;
          background: rgba(7, 16, 23, 0.88) !important;
          color: rgba(207, 250, 254, 0.9) !important;
          font-weight: 900 !important;
          line-height: 34px !important;
        }

        .leaflet-control-zoom a + a {
          border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
        }

        .reie-map-canvas .reie-search-basemap-tile.leaflet-tile {
          opacity: 0.96 !important;
        }

        .reie-mapbox-detail-tiles {
          filter: saturate(0.7) contrast(0.94) brightness(0.95) sepia(0.04) !important;
          mix-blend-mode: soft-light;
        }

        .reie-map-canvas .leaflet-control-attribution {
          border-radius: 6px 0 0 0;
          background: rgba(7, 16, 23, 0.78) !important;
          color: rgba(255, 255, 255, 0.72) !important;
          font-size: 10px !important;
          line-height: 1.4 !important;
          max-width: min(74vw, 520px);
          padding: 3px 7px !important;
        }

        .reie-map-canvas .leaflet-control-attribution a {
          color: rgba(207, 250, 254, 0.9) !important;
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 2px;
        }

        .luxury-marker-container,
        .luxury-cluster-container {
          background: transparent;
          border: 0;
          z-index: 700 !important;
        }

        .luxury-marker {
          min-width: 78px;
          border: 0;
          border-radius: 999px;
          background: linear-gradient(135deg, rgba(250, 248, 238, 0.98), rgba(224, 244, 241, 0.94));
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.46), 0 0 0 2px rgba(7, 16, 23, 0.78);
          color: #071017;
          cursor: pointer;
          display: block;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.04em;
          padding: 7px 12px;
          position: relative;
          text-align: center;
          transform: translateY(0);
          outline: 0;
          transition: background 180ms ease, border-color 180ms ease, color 180ms ease, transform 180ms ease, box-shadow 180ms ease;
          white-space: nowrap;
        }

        .luxury-marker::after {
          background: #cffafe;
          border-radius: 999px;
          bottom: -5px;
          box-shadow: 0 0 0 2px rgba(7, 16, 23, 0.72);
          content: '';
          height: 6px;
          left: 50%;
          position: absolute;
          transform: translateX(-50%);
          width: 6px;
        }

        .luxury-marker:hover {
          box-shadow: 0 14px 38px rgba(207, 250, 254, 0.2), 0 18px 48px rgba(0, 0, 0, 0.62), 0 0 0 3px rgba(207, 250, 254, 0.2);
          color: #061017;
          transform: translateY(-3px);
        }

        .luxury-marker.hovered {
          box-shadow: 0 14px 38px rgba(207, 250, 254, 0.2), 0 18px 48px rgba(0, 0, 0, 0.62), 0 0 0 3px rgba(207, 250, 254, 0.2);
          color: #061017;
          transform: translateY(-3px);
        }

        .luxury-marker.selected {
          background: #f8f3df;
          box-shadow: 0 0 0 3px rgba(8, 17, 23, 0.84), 0 0 0 7px rgba(207, 250, 254, 0.36), 0 20px 54px rgba(0, 0, 0, 0.72);
          color: #061017;
          transform: translateY(-4px);
        }

        .luxury-marker.selected::before {
          border: 2px solid #071017;
          border-radius: 999px;
          content: '';
          inset: 3px;
          pointer-events: none;
          position: absolute;
        }

        .luxury-cluster {
          align-items: center;
          background: rgba(7, 16, 23, 0.9);
          border: 1px solid rgba(207, 250, 254, 0.34);
          border-radius: 999px;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08), 0 14px 36px rgba(0, 0, 0, 0.48), 0 0 0 5px rgba(207, 250, 254, 0.1);
          color: #fff;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          font-size: 13px;
          font-weight: 900;
          gap: 1px;
          height: 50px;
          justify-content: center;
          line-height: 1;
          padding: 0;
          transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
          width: 50px;
        }

        .luxury-cluster small {
          color: rgba(207, 250, 254, 0.62);
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .luxury-cluster:hover {
          border-color: rgba(248, 243, 223, 0.8);
          box-shadow: 0 14px 38px rgba(207, 250, 254, 0.2), 0 18px 48px rgba(0, 0, 0, 0.64), 0 0 0 7px rgba(248, 243, 223, 0.12);
          transform: translateY(-3px);
        }

        @media (prefers-reduced-motion: reduce) {
          .luxury-marker,
          .luxury-cluster {
            transition: none;
          }
        }

        @media (max-width: 640px) {
          .reie-map-orientation {
            left: 12px;
            right: 12px;
            max-width: none;
            padding: 10px 11px;
          }

          .reie-map-tile-status {
            bottom: 12px;
            left: 12px;
            right: 12px;
            max-width: none;
          }

          .reie-map-canvas .leaflet-control-attribution {
            max-width: calc(100vw - 96px);
          }
        }
      `}</style>
    </div>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/maps/SearchMap.tsx
