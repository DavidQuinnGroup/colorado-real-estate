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

  return (
    <div className="relative h-full w-full overflow-hidden border border-white/10 bg-slate-900 shadow-2xl">
      {!isContracted ? (
        <div className="absolute left-1/2 top-4 z-[1000] -translate-x-1/2 border border-[#fbbf24]/50 bg-black/80 px-6 py-2 backdrop-blur-md">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#fbbf24]">Strategy Gate Active: Precise Pins Blurred</p>
        </div>
      ) : null}

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
                  <div className="p-2">
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
  );
}

// components/PropertyMap.tsx
