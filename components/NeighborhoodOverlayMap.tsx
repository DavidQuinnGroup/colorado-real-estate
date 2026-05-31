'use client';

import Link from 'next/link';
import { MapContainer, Polygon, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { neighborhoodPolygons } from '@/lib/neighborhoodPolygons';

const BOULDER_CENTER: [number, number] = [40.017, -105.283];

export default function NeighborhoodOverlayMap() {
  return (
    <div className="h-[500px] w-full overflow-hidden">
      <MapContainer center={BOULDER_CENTER} zoom={12} className="h-full w-full">
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {neighborhoodPolygons.map((neighborhood) => (
          <Polygon
            key={neighborhood.slug}
            positions={neighborhood.coordinates}
            pathOptions={{
              color: '#00ff80',
              fillColor: '#00ff80',
              fillOpacity: 0.12,
              opacity: 0.65,
              weight: 2,
            }}
          >
            <Popup>
              <Link href={`/market/boulder/${neighborhood.slug}`}>View {neighborhood.name} Neighborhood</Link>
            </Popup>
          </Polygon>
        ))}
      </MapContainer>
    </div>
  );
}

// components/NeighborhoodOverlayMap.tsx
