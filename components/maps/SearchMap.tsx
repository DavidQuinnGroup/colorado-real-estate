'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { getListingFallbackPhotoUrl, getListingPhotoUrl } from '@/lib/listingVisuals';
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
  command?: string;
  durationMs?: number;
  filtersApplied?: string[];
  generatedAt?: string;
  health?: 'healthy' | 'degraded' | string;
  module?: string;
  route?: string;
  source?: string;
  terminal?: string;
  returned?: number;
  mapped?: number;
  coordinateFiltered?: number;
  smoke?: {
    command?: string;
    terminal?: string;
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

  return `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/256/{z}/{x}/{y}@2x?access_token=${token}`;
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

function formatScore(value: unknown) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? Math.round(numericValue).toString() : '--';
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
  if (property.hasPolybutyleneRisk) return 'Plumbing Review';
  if (property.soilType?.trim()) return property.soilType.trim();

  const altitude = Number(property.altitude);
  if (Number.isFinite(altitude) && altitude > 0) return `${Math.round(altitude).toLocaleString()} FT`;

  return 'REIE Verified';
}

function getDecisionSignal(property: MapSidebarListing) {
  if (property.hasPolybutyleneRisk) return 'Contractor Review';
  if (typeof property.resilienceScore === 'number' && property.resilienceScore >= 80) return 'Resilience Screened';
  if (typeof property.efficiencyScore === 'number' && property.efficiencyScore >= 80) return 'Efficiency Screened';
  if (property.isPrivateExclusive) return 'Private Candidate';

  return 'REIE Triage Ready';
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
  const photoUrl = escapeHtml(getListingPhotoUrl(property));
  const fallbackPhotoUrl = escapeHtml(getListingFallbackPhotoUrl(property));
  const price = formatLuxuryPrice(Number(property.price));
  const address = escapeHtml(property.address || 'Address Available by Request');
  const city = escapeHtml(property.city || 'Colorado');
  const propertyType = escapeHtml(getPropertyTypeLabel(property.propertyType));
  const beds = formatFeature(property.beds, 'BD');
  const baths = formatFeature(property.baths, 'BA');
  const sqft = formatFeature(property.sqft, 'SQ FT');
  const features = [beds, baths, sqft].filter(Boolean).join(' / ');
  const efficiencyScore = escapeHtml(formatScore(property.efficiencyScore));
  const resilienceScore = escapeHtml(formatScore(property.resilienceScore));
  const reviewSignal = escapeHtml(getReviewSignal(property));
  const decisionSignal = escapeHtml(getDecisionSignal(property));
  const privateChip = property.isPrivateExclusive ? '<span class="reie-map-popup-chip reie-map-popup-chip-private">Private</span>' : '';
  const reviewChip = property.hasPolybutyleneRisk ? '<span class="reie-map-popup-chip reie-map-popup-chip-review">Review</span>' : '';

  return `
    <article class="reie-map-popup-card">
      <div class="reie-map-popup-image-wrap">
        <img src="${photoUrl}" alt="${address}" class="reie-map-popup-image" onerror="this.onerror=null;this.src='${fallbackPhotoUrl}'" />
        <div class="reie-map-popup-image-shade"></div>
        <div class="reie-map-popup-chips">
          <span class="reie-map-popup-chip">${propertyType}</span>
          ${privateChip}
          ${reviewChip}
        </div>
      </div>
      <div class="reie-map-popup-body">
        <p class="reie-map-popup-kicker">Selected Signal</p>
        <p class="reie-map-popup-price">${price}</p>
        <h2 class="reie-map-popup-address">${address}</h2>
        <p class="reie-map-popup-city">${city}, CO</p>
        ${features ? `<p class="reie-map-popup-features">${escapeHtml(features)}</p>` : ''}
        <p class="reie-map-popup-decision">${decisionSignal}</p>
        <div class="reie-map-popup-intel">
          <span>EFF ${efficiencyScore}</span>
          <span>RES ${resilienceScore}</span>
          <span>${reviewSignal}</span>
        </div>
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
      html: `<button class="luxury-marker${isActive ? ' active' : ''}" type="button">${formatLuxuryPrice(Number(property.price))}</button>`,
      iconAnchor: [39, 18],
    }),
    keyboard: true,
    title: property.address || 'Colorado property',
  });
}

function createClusterMarker(cluster: ClusterBucket) {
  return L.marker([cluster.lat, cluster.lng], {
    icon: L.divIcon({
      className: 'luxury-cluster-container',
      html: `<button class="luxury-cluster" type="button">${cluster.listings.length}</button>`,
      iconAnchor: [21, 21],
      iconSize: [42, 42],
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

    const map = L.map(containerRef.current, {
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

    map.on('moveend zoomend resize', handleMapViewportChange);
    map.whenReady(() => scheduleBoundsEmit(400));
    scheduleBoundsEmit(700);

    return () => {
      if (boundsTimerRef.current) {
        window.clearTimeout(boundsTimerRef.current);
        boundsTimerRef.current = null;
      }

      map.off('moveend zoomend resize', handleMapViewportChange);
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
    <>
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
        data-search-terminal={searchMeta?.terminal || ''}
        data-search-route={searchMeta?.route || ''}
        data-search-command={searchMeta?.command || ''}
        data-search-module={searchMeta?.module || ''}
        data-search-smoke-ready={smokeReady === undefined ? 'unknown' : smokeReady ? 'true' : 'false'}
        data-search-smoke-command={searchMeta?.smoke?.command || ''}
        data-search-smoke-blockers={smokeBlockerCount}
      />

      {shouldShowSearchDiagnostics ? (
        <div
          className={`pointer-events-none absolute right-4 top-4 z-[720] border px-3 py-2 text-[9px] font-black uppercase tracking-[0.18em] shadow-[0_18px_48px_rgba(0,0,0,0.55)] ${
            searchMeta?.health === 'degraded'
              ? 'border-amber-300/40 bg-black/85 text-amber-100/80'
              : 'border-white/20 bg-black/80 text-white/70'
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
            <span>{searchMeta?.boundsApplied ? 'bounds' : 'open'}</span>
            <span className="mx-2 text-white/20">/</span>
            <span>{metaFilters}</span>
            {metaDuration ? (
              <>
                <span className="mx-2 text-white/20">/</span>
                <span>{metaDuration}</span>
              </>
            ) : null}
          </div>
          {smokeReady !== undefined ? (
            <div className="mt-1 text-white/35">
              <span className={smokeReady ? 'text-emerald-200' : 'text-amber-200'}>{smokeReady ? 'smoke ready' : 'smoke review'}</span>
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

      <style jsx global>{`
        .leaflet-container {
          background: #030303 !important;
          font-family: inherit;
        }

        .reie-map-canvas {
          isolation: isolate;
          position: relative;
        }

        .reie-map-canvas::after {
          background:
            radial-gradient(circle at 25% 49%, rgba(68, 255, 38, 0.28), transparent 32%),
            radial-gradient(circle at 62% 30%, rgba(0, 229, 255, 0.24), transparent 18%),
            radial-gradient(circle at 76% 48%, rgba(0, 229, 255, 0.3), transparent 26%),
            radial-gradient(circle at 67% 82%, rgba(0, 229, 255, 0.22), transparent 20%),
            linear-gradient(90deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.42));
          content: '';
          inset: 0;
          mix-blend-mode: screen;
          opacity: 0.88;
          pointer-events: none;
          position: absolute;
          z-index: 410;
        }

        .reie-map-canvas::before {
          background:
            linear-gradient(90deg, rgba(0, 0, 0, 0), rgba(0, 10, 12, 0.24)),
            rgba(0, 0, 0, 0.02);
          content: '';
          inset: 0;
          pointer-events: none;
          position: absolute;
          z-index: 411;
        }

        .leaflet-control-zoom {
          border: 1px solid rgba(255, 255, 255, 0.34) !important;
          border-radius: 0 !important;
          box-shadow: 0 18px 42px rgba(0, 0, 0, 0.62) !important;
          overflow: hidden;
        }

        .leaflet-control-zoom a {
          width: 34px !important;
          height: 34px !important;
          border: 0 !important;
          border-radius: 0 !important;
          background: rgba(0, 0, 0, 0.92) !important;
          color: #fff !important;
          font-weight: 900 !important;
          line-height: 34px !important;
        }

        .leaflet-control-zoom a + a {
          border-top: 1px solid rgba(255, 255, 255, 0.22) !important;
        }

        .reie-saturday-topo-tiles {
          filter: invert(100%) hue-rotate(190deg) saturate(5.65) brightness(0.69) contrast(2.48) !important;
        }

        .reie-mapbox-detail-tiles {
          filter: grayscale(1) brightness(1.05) contrast(1.62) saturate(0.08) !important;
          mix-blend-mode: luminosity;
        }

        .luxury-marker-container,
        .luxury-cluster-container {
          background: transparent;
          border: 0;
          z-index: 700 !important;
        }

        .luxury-marker {
          min-width: 74px;
          border: 1px solid rgba(255, 255, 255, 0.56);
          background: rgba(9, 12, 17, 0.93);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.58);
          color: #fff;
          cursor: pointer;
          display: block;
          font-size: 11px;
          font-style: italic;
          font-weight: 900;
          letter-spacing: 0.02em;
          padding: 7px 11px;
          text-align: center;
          transform: translateY(0);
          transition: border-color 180ms ease, color 180ms ease, transform 180ms ease, box-shadow 180ms ease;
          white-space: nowrap;
        }

        .luxury-marker:hover,
        .luxury-marker.active {
          border-color: #00e5ff;
          box-shadow: 0 14px 38px rgba(0, 229, 255, 0.2), 0 18px 48px rgba(0, 0, 0, 0.74);
          color: #fff;
          transform: translateY(-2px);
        }

        .luxury-cluster {
          align-items: center;
          background: rgba(8, 11, 15, 0.93);
          border: 2px solid rgba(255, 255, 255, 0.64);
          border-radius: 999px;
          box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.65), 0 12px 32px rgba(0, 0, 0, 0.5);
          color: #fff;
          cursor: pointer;
          display: flex;
          font-size: 12px;
          font-style: italic;
          font-weight: 900;
          height: 42px;
          justify-content: center;
          line-height: 1;
          padding: 0;
          transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
          width: 42px;
        }

        .luxury-cluster:hover {
          border-color: #00e5ff;
          box-shadow: 0 14px 38px rgba(0, 229, 255, 0.2), 0 18px 48px rgba(0, 0, 0, 0.74);
          transform: translateY(-2px);
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
          max-width: min(326px, calc(100vw - 44px));
          width: 326px !important;
        }

        .reie-map-popup .leaflet-popup-tip-container {
          display: none;
        }

        .reie-map-popup-card {
          background: rgba(7, 16, 23, 0.97);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 8px;
          box-shadow: 0 28px 80px rgba(0, 0, 0, 0.72);
          color: #fff;
          overflow: hidden;
          width: 100%;
        }

        .reie-map-popup-image-wrap {
          aspect-ratio: 16 / 9;
          background: #10151b;
          overflow: hidden;
          position: relative;
          width: 100%;
        }

        .reie-map-popup-image {
          display: block;
          height: 100%;
          object-fit: cover;
          opacity: 0.9;
          width: 100%;
        }

        .reie-map-popup-image-shade {
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.14), rgba(7, 16, 23, 0.18) 42%, rgba(7, 16, 23, 0.82));
          inset: 0;
          pointer-events: none;
          position: absolute;
        }

        .reie-map-popup-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          left: 12px;
          max-width: calc(100% - 24px);
          position: absolute;
          top: 12px;
        }

        .reie-map-popup-chip {
          align-items: center;
          background: rgba(0, 0, 0, 0.58);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 5px;
          color: rgba(255, 255, 255, 0.84);
          display: inline-flex;
          font-size: 8px;
          font-weight: 900;
          justify-content: center;
          letter-spacing: 0.12em;
          line-height: 1;
          min-height: 24px;
          padding: 6px 8px;
          text-transform: uppercase;
        }

        .reie-map-popup-chip-private {
          background: rgba(8, 145, 178, 0.18);
          border-color: rgba(207, 250, 254, 0.36);
          color: rgb(207, 250, 254);
        }

        .reie-map-popup-chip-review {
          background: rgba(251, 191, 36, 0.14);
          border-color: rgba(253, 230, 138, 0.38);
          color: rgb(254, 243, 199);
        }

        .reie-map-popup-body {
          padding: 16px 18px 18px;
        }

        .reie-map-popup-kicker {
          color: rgba(207, 250, 254, 0.72);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.2em;
          line-height: 1;
          margin: 0 0 10px;
          text-transform: uppercase;
        }

        .reie-map-popup-price {
          font-family: Georgia, serif;
          font-size: 30px;
          font-style: italic;
          font-weight: 900;
          letter-spacing: 0;
          line-height: 0.92;
          margin: 0;
        }

        .reie-map-popup-address {
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.04em;
          line-height: 1.32;
          margin: 14px 0 0;
          text-transform: uppercase;
        }

        .reie-map-popup-city,
        .reie-map-popup-features {
          color: rgba(255, 255, 255, 0.72);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.22em;
          line-height: 1.4;
          margin: 9px 0 0;
          text-transform: uppercase;
        }

        .reie-map-popup-decision {
          background: rgba(207, 250, 254, 0.07);
          border: 1px solid rgba(207, 250, 254, 0.16);
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.74);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.12em;
          line-height: 1.35;
          margin: 13px 0 0;
          padding: 9px 10px;
          text-transform: uppercase;
        }

        .reie-map-popup-intel {
          display: grid;
          gap: 6px;
          grid-template-columns: 0.75fr 0.75fr minmax(0, 1.6fr);
          margin-top: 10px;
        }

        .reie-map-popup-intel span {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: rgba(255, 255, 255, 0.82);
          display: block;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.12em;
          overflow: hidden;
          padding: 7px 8px;
          text-overflow: ellipsis;
          text-transform: uppercase;
          white-space: nowrap;
        }

        @media (max-width: 640px) {
          .reie-map-popup .leaflet-popup-content {
            width: min(310px, calc(100vw - 44px)) !important;
          }

          .reie-map-popup-price {
            font-size: 27px;
          }

          .reie-map-popup-body {
            padding: 14px;
          }
        }
      `}</style>
    </>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/maps/SearchMap.tsx
