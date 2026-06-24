'use client';

import { Fragment, useMemo } from 'react';
import L from 'leaflet';
import { Circle, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export type PropertyMapItem = {
  id: string;
  address?: string | null;
  lat?: number | null;
  lng?: number | null;
  efficiencyScore?: number | null;
};

type CoordinateProperty = PropertyMapItem & {
  lat: number;
  lng: number;
};

type PropertyMapProps = {
  properties: PropertyMapItem[];
  isContracted?: boolean;
};

const BOULDER_CORE: [number, number] = [40.015, -105.2705];

const gcIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function hasCoordinates(property: PropertyMapItem): property is CoordinateProperty {
  return Number.isFinite(property.lat) && Number.isFinite(property.lng);
}

function formatScore(value: number | null | undefined) {
  return Number.isFinite(value) ? value : 'N/A';
}

export default function PropertyMap({ properties, isContracted = false }: PropertyMapProps) {
  const visibleProperties = useMemo(() => properties.filter(hasCoordinates), [properties]);
  const hiddenPropertyCount = properties.length - visibleProperties.length;
  const mapMode = isContracted ? 'precise' : 'masked';

  return (
    <div
      className="relative h-full w-full overflow-hidden border border-white/10 bg-slate-900 shadow-2xl"
      data-testid="reie-property-map"
      data-property-map-mode={mapMode}
      data-property-map-contracted={isContracted ? 'true' : 'false'}
      data-property-map-total-count={properties.length}
      data-property-map-coordinate-count={visibleProperties.length}
      data-property-map-hidden-count={hiddenPropertyCount}
      data-property-map-center={BOULDER_CORE.join(',')}
      data-property-map-zoom="12"
    >
      {!isContracted ? (
        <div
          className="absolute left-1/2 top-4 z-[1000] -translate-x-1/2 border border-[#fbbf24]/50 bg-black/80 px-6 py-2 backdrop-blur-md"
          data-testid="reie-property-map-strategy-gate"
          data-property-map-gate-active="true"
          data-property-map-pin-precision="blurred"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#fbbf24]">Strategy Gate Active: Precise Pins Blurred</p>
        </div>
      ) : null}

      <div
        className="h-full w-full"
        data-testid="reie-property-map-canvas"
        data-property-map-render-mode={mapMode}
        data-property-map-marker-count={isContracted ? visibleProperties.length : 0}
        data-property-map-mask-count={isContracted ? 0 : visibleProperties.length}
        data-property-map-scroll-wheel="false"
        data-property-map-tile-provider="carto-dark"
      >
        <MapContainer center={BOULDER_CORE} zoom={12} scrollWheelZoom={false} className="h-full w-full grayscale-[0.6] contrast-[1.2] invert-[0.05]">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {visibleProperties.map((property) => (
            <Fragment key={property.id}>
              {isContracted ? (
                <Marker position={[property.lat, property.lng]} icon={gcIcon}>
                  <Popup className="border-[#fbbf24] bg-slate-900 text-white">
                    <div
                      className="p-2"
                      data-testid="reie-property-map-popup"
                      data-map-property-id={property.id}
                      data-map-property-address={property.address || ''}
                      data-map-property-efficiency-score={formatScore(property.efficiencyScore)}
                      data-map-property-lat={property.lat}
                      data-map-property-lng={property.lng}
                    >
                      <p className="text-xs font-black uppercase italic">{property.address || 'Address Available by Request'}</p>
                      <p className="text-[10px] font-bold text-[#fbbf24]">Efficiency: {formatScore(property.efficiencyScore)}/100</p>
                    </div>
                  </Popup>
                </Marker>
              ) : (
                <Circle
                  center={[property.lat, property.lng]}
                  pathOptions={{
                    fillColor: '#d4af37',
                    color: '#d4af37',
                    weight: 1,
                    opacity: 0.3,
                    fillOpacity: 0.15,
                  }}
                  radius={800}
                />
              )}
            </Fragment>
          ))}
        </MapContainer>
      </div>

      <div className="sr-only" aria-hidden="true" data-testid="reie-property-map-marker-metadata">
        {visibleProperties.map((property) => (
          <span
            key={property.id}
            data-testid="reie-property-map-marker"
            data-map-property-id={property.id}
            data-map-property-address={property.address || ''}
            data-map-property-efficiency-score={formatScore(property.efficiencyScore)}
            data-map-property-lat={property.lat}
            data-map-property-lng={property.lng}
            data-map-marker-render-mode={mapMode}
            data-map-marker-precision={isContracted ? 'exact' : 'blurred'}
            data-map-mask-radius-meters={isContracted ? 0 : 800}
          />
        ))}
      </div>
    </div>
  );
}

// components/PropertyMap.tsx
