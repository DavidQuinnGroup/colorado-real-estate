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

function formatFeature(value: unknown, label: string) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue) || numericValue <= 0) return null;

  return `${numericValue.toLocaleString()} ${label}`;
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

function getReviewSignal(property: MapSidebarListing) {
  if (property.hasPolybutyleneRisk) return 'Plumbing review suggested';
  if (property.soilType?.trim()) return 'Property signals available';

  const altitude = Number(property.altitude);
  if (Number.isFinite(altitude) && altitude > 0) return 'Elevation context available';

  return 'Public listing context';
}

function getAdvisoryNote(property: MapSidebarListing) {
  if (property.hasPolybutyleneRisk) return 'Plumbing review suggested.';
  if (typeof property.resilienceScore === 'number' && property.resilienceScore >= 80) return 'Worth a closer look.';
  if (typeof property.efficiencyScore === 'number' && property.efficiencyScore >= 80) return 'Compare public location context.';
  if (property.isPrivateExclusive) return 'Additional listing context available through inquiry.';

  return 'Review facts and location.';
}

function getLocationFit(property: MapSidebarListing) {
  return hasCoordinates(property) ? 'Shown on this map' : 'Map location needs review';
}

function getPropertyTypeLabel(value: string | null | undefined) {
  const cleaned = value?.trim();
  return cleaned || 'Residential';
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

function buildPopupHtml(property: MapSidebarListing) {
  const price = formatLuxuryPrice(Number(property.price));
  const address = escapeHtml(property.address || 'Address Available by Request');
  const city = escapeHtml(property.city || 'Colorado');
  const propertyType = escapeHtml(getPropertyTypeLabel(property.propertyType));
  const beds = formatFeature(property.beds, 'Beds');
  const baths = formatFeature(property.baths, 'Baths');
  const sqft = formatFeature(property.sqft, 'Sq Ft');
  const features = [beds, baths, sqft].filter(Boolean).join(' / ');
  const reviewSignal = escapeHtml(getReviewSignal(property));
  const advisoryNote = escapeHtml(getAdvisoryNote(property));
  const locationFit = escapeHtml(getLocationFit(property));
  const detailHref = escapeHtml(`/properties/${property.id}`);

  return `
    <article class="reie-map-popup-card" data-testid="reie-property-map-popup" data-popup-property-id="${escapeHtml(property.id)}">
      <div class="reie-map-popup-body">
        <p class="reie-map-popup-kicker">${propertyType}</p>
        <p class="reie-map-popup-price">${price}</p>
        <h2 class="reie-map-popup-address">${address}</h2>
        <p class="reie-map-popup-city">${city}, CO</p>
        ${features ? `<p class="reie-map-popup-features" aria-label="Core property facts">${escapeHtml(features)}</p>` : ''}
        <p class="reie-map-popup-note"><span>Review context</span> ${advisoryNote}</p>
        <p class="reie-map-popup-context"><span>Map Context</span> ${locationFit}</p>
        <p class="reie-map-popup-context"><span>Property Signals</span> ${reviewSignal}</p>
        <a class="reie-map-popup-cta" href="${detailHref}" aria-label="View property details for ${address}">View Property</a>
      </div>
    </article>
  `;
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

function createListingMarker(property: CoordinateListing, isActive: boolean) {
  return L.marker([property.lat, property.lng], {
    icon: L.divIcon({
      className: 'luxury-marker-container',
      html: `<button class="luxury-marker${isActive ? ' active' : ''}" type="button"><span>${formatLuxuryPrice(Number(property.price))}</span></button>`,
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
      maxZoom: Math.max(map.getZoom() + 2, CLUSTER_DISABLE_ZOOM),
      padding: [72, 72],
    });
    return;
  }

  map.setView([cluster.lat, cluster.lng], Math.min(map.getZoom() + 2, 18), { animate: true });
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
  const selectedPanIdRef = useRef<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
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
      zoom: 12,
      minZoom: 8,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false,
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

    L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      className: 'reie-saturday-topo-tiles',
      maxZoom: 17,
    }).addTo(map);

    if (mapboxTileUrl) {
      L.tileLayer(mapboxTileUrl, {
        className: 'reie-mapbox-detail-tiles',
        maxZoom: 18,
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
      const isActive = selectedId === property.id || hoveredId === property.id;
      const marker = createListingMarker(property, isActive);

      marker.bindPopup(buildPopupHtml(property), {
        autoPan: true,
        autoPanPadding: L.point(28, 28),
        className: 'reie-map-popup',
        closeButton: false,
        closeOnClick: false,
        keepInView: true,
        offset: L.point(0, -12),
      });

      marker.on('click', () => {
        setSelectedId(property.id);
        marker.openPopup();
      });

      marker.on('mouseover', () => {
        setHoveredId(property.id);
        marker.openPopup();
      });

      marker.on('mouseout', () => {
        if (selectedId !== property.id) {
          setHoveredId(null);
          marker.closePopup();
        }
      });

      if (selectedId === property.id) {
        selectedMarker = marker;
      } else if (hoveredId === property.id) {
        marker.openPopup();
      }

      markerLayer.addLayer(marker);
    }

    for (const property of activeListings) {
      const isActive = selectedId === property.id || hoveredId === property.id;
      const marker = createListingMarker(property, isActive);

      marker.bindPopup(buildPopupHtml(property), {
        autoPan: true,
        autoPanPadding: L.point(28, 28),
        className: 'reie-map-popup',
        closeButton: false,
        closeOnClick: false,
        keepInView: true,
        offset: L.point(0, -12),
      });

      marker.on('click', () => {
        setSelectedId(property.id);
        marker.openPopup();
      });

      marker.on('mouseover', () => {
        setHoveredId(property.id);
        marker.openPopup();
      });

      marker.on('mouseout', () => {
        if (selectedId !== property.id) {
          setHoveredId(null);
          marker.closePopup();
        }
      });

      if (selectedId === property.id) {
        selectedMarker = marker;
      } else if (hoveredId === property.id) {
        marker.openPopup();
      }

      markerLayer.addLayer(marker);
    }

    const markerToShow = selectedMarker as L.Marker | null;

    if (markerToShow) {
      if (selectedId && selectedPanIdRef.current !== selectedId) {
        selectedPanIdRef.current = selectedId;
        map.panTo(markerToShow.getLatLng(), { animate: true });
      }

      markerToShow.openPopup();
    }

    if (coordinateListings.length === 1) {
      map.setView([coordinateListings[0].lat, coordinateListings[0].lng], Math.max(map.getZoom(), 13), { animate: true });
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

      <style jsx global>{`
        .leaflet-container {
          background: #071017 !important;
          font-family: inherit;
        }

        .reie-map-canvas {
          isolation: isolate;
          position: relative;
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

        .reie-saturday-topo-tiles {
          filter: saturate(0.72) contrast(1.03) brightness(0.96) sepia(0.04) !important;
        }

        .reie-mapbox-detail-tiles {
          filter: saturate(0.7) contrast(1.04) brightness(0.94) sepia(0.04) !important;
          mix-blend-mode: soft-light;
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
          background: linear-gradient(135deg, rgba(246, 248, 242, 0.96), rgba(207, 250, 254, 0.92));
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.42), 0 0 0 2px rgba(7, 16, 23, 0.72);
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
          box-shadow: 0 14px 38px rgba(207, 250, 254, 0.24), 0 18px 48px rgba(0, 0, 0, 0.62), 0 0 0 3px rgba(207, 250, 254, 0.22);
          color: #061017;
          transform: translateY(-3px);
        }

        .luxury-marker.active {
          background: #f8f3df;
          box-shadow: 0 0 0 3px rgba(8, 17, 23, 0.76), 0 0 0 7px rgba(207, 250, 254, 0.32), 0 20px 54px rgba(0, 0, 0, 0.7);
          color: #061017;
          transform: translateY(-4px);
        }

        .luxury-cluster {
          align-items: center;
          background: rgba(7, 16, 23, 0.92);
          border: 1px solid rgba(207, 250, 254, 0.38);
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
          .luxury-cluster,
          .reie-map-popup-cta {
            transition: none;
          }
        }

        .reie-map-popup {
          margin-bottom: 12px;
        }

        .reie-map-popup .leaflet-popup-content-wrapper {
          background: transparent;
          border-radius: 0;
          box-shadow: none;
          padding: 0;
        }

        .reie-map-popup .leaflet-popup-content {
          margin: 0;
          max-width: min(300px, calc(100vw - 44px));
          width: 300px !important;
        }

        .reie-map-popup .leaflet-popup-tip-container {
          display: none;
        }

        .reie-map-popup-card {
          background: rgba(7, 16, 23, 0.97);
          border-radius: 8px;
          box-shadow: 0 28px 80px rgba(0, 0, 0, 0.72), 0 0 0 1px rgba(207, 250, 254, 0.14);
          color: #fff;
          overflow: hidden;
          width: 100%;
        }

        .reie-map-popup-body {
          padding: 13px;
        }

        .reie-map-popup-kicker {
          color: rgba(207, 250, 254, 0.72);
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.2em;
          line-height: 1;
          margin: 0 0 8px;
          text-transform: uppercase;
        }

        .reie-map-popup-price {
          font-family: Georgia, serif;
          font-size: 24px;
          font-style: italic;
          font-weight: 900;
          letter-spacing: 0;
          line-height: 0.92;
          margin: 0;
        }

        .reie-map-popup-address {
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.04em;
          line-height: 1.32;
          margin: 10px 0 0;
          text-transform: uppercase;
        }

        .reie-map-popup-city,
        .reie-map-popup-features {
          color: rgba(255, 255, 255, 0.72);
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.22em;
          line-height: 1.4;
          margin: 7px 0 0;
          text-transform: uppercase;
        }

        .reie-map-popup-features span {
          color: rgba(207, 250, 254, 0.74);
        }

        .reie-map-popup-note,
        .reie-map-popup-context {
          background: rgba(207, 250, 254, 0.07);
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.74);
          font-size: 10px;
          font-weight: 800;
          line-height: 1.28;
          margin: 10px 0 0;
          padding: 8px 9px;
        }

        .reie-map-popup-context {
          margin-top: 6px;
        }

        .reie-map-popup-note span,
        .reie-map-popup-context span {
          color: rgba(207, 250, 254, 0.74);
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.14em;
          margin-right: 4px;
          text-transform: uppercase;
        }

        .reie-map-popup-cta {
          align-items: center;
          background: rgb(207, 250, 254);
          border-radius: 6px;
          color: #061017 !important;
          display: flex;
          font-size: 10px;
          font-weight: 900;
          height: 34px;
          justify-content: center;
          letter-spacing: 0.14em;
          margin-top: 9px;
          text-decoration: none;
          text-transform: uppercase;
          transition: background 180ms ease, transform 180ms ease;
          width: 100%;
        }

        .reie-map-popup-cta:hover,
        .reie-map-popup-cta:focus-visible {
          background: #fff;
          transform: translateY(-1px);
        }

        .reie-map-popup-cta:focus-visible {
          outline: 2px solid rgb(207, 250, 254);
          outline-offset: 2px;
        }

        @media (max-width: 640px) {
          .reie-map-orientation {
            left: 12px;
            right: 12px;
            max-width: none;
            padding: 10px 11px;
          }

          .reie-map-popup .leaflet-popup-content {
            width: min(286px, calc(100vw - 44px)) !important;
          }

          .reie-map-popup-price {
            font-size: 23px;
          }

          .reie-map-popup-body {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/maps/SearchMap.tsx
