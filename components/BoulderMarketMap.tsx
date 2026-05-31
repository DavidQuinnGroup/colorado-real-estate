'use client';

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

type NeighborhoodMarker = {
  name: string;
  price: string;
  position: [number, number];
};

const BOULDER_CENTER: [number, number] = [40.015, -105.2705];

const NEIGHBORHOODS: NeighborhoodMarker[] = [
  {
    name: 'Downtown Boulder',
    price: '$1.4M',
    position: [40.0176, -105.2797],
  },
  {
    name: 'North Boulder',
    price: '$1.2M',
    position: [40.0444, -105.283],
  },
  {
    name: 'South Boulder',
    price: '$1.1M',
    position: [39.987, -105.25],
  },
  {
    name: 'Table Mesa',
    price: '$1.05M',
    position: [39.9836, -105.243],
  },
];

export default function BoulderMarketMap() {
  return (
    <div className="h-[500px] w-full overflow-hidden">
      <MapContainer center={BOULDER_CENTER} zoom={12} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {NEIGHBORHOODS.map((neighborhood) => (
          <Marker key={neighborhood.name} position={neighborhood.position}>
            <Popup>
              <strong>{neighborhood.name}</strong>
              <br />
              Median Price: {neighborhood.price}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

// components/BoulderMarketMap.tsx
