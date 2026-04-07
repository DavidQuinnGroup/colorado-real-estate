"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SearchMap;
const react_1 = require("react");
const react_leaflet_1 = require("react-leaflet");
const leaflet_1 = __importDefault(require("leaflet"));
const supercluster_1 = __importDefault(require("supercluster"));
// 🧠 Map Events
function MapEvents({ onBoundsChange, setBounds, setZoom }) {
    const map = (0, react_leaflet_1.useMapEvents)({
        moveend: () => {
            const bounds = map.getBounds();
            const zoom = map.getZoom();
            setBounds([
                bounds.getWest(),
                bounds.getSouth(),
                bounds.getEast(),
                bounds.getNorth(),
            ]);
            setZoom(zoom);
            onBoundsChange({
                neLat: bounds.getNorthEast().lat,
                neLng: bounds.getNorthEast().lng,
                swLat: bounds.getSouthWest().lat,
                swLng: bounds.getSouthWest().lng,
            });
        },
    });
    return null;
}
// 💰 Price Marker (UPDATED: active state)
function createPriceIcon(price, active = false) {
    return leaflet_1.default.divIcon({
        html: `<div style="
      background:${active ? "#2563eb" : "#000"};
      color:#fff;
      padding:6px 10px;
      border-radius:999px;
      font-size:12px;
      font-weight:600;
      transform:${active ? "scale(1.2)" : "scale(1)"};
      transition:all 0.15s ease;
    ">
      $${Math.round(price / 1000)}k
    </div>`,
        className: "",
    });
}
// 🔵 Cluster Marker
function createClusterIcon(count) {
    return leaflet_1.default.divIcon({
        html: `<div style="
      background:#111;
      color:#fff;
      width:40px;
      height:40px;
      display:flex;
      align-items:center;
      justify-content:center;
      border-radius:50%;
      font-size:14px;
      font-weight:700;
    ">
      ${count}
    </div>`,
        className: "",
    });
}
function SearchMap({ listings, onBoundsChange, hoveredId, selectedId, setHoveredId, setSelectedId, }) {
    const [mounted, setMounted] = (0, react_1.useState)(false);
    const [bounds, setBounds] = (0, react_1.useState)(null);
    const [zoom, setZoom] = (0, react_1.useState)(12);
    // fallback local state if parent not controlling
    const [localSelected, setLocalSelected] = (0, react_1.useState)(null);
    const mapRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        setMounted(true);
    }, []);
    // 🔥 Convert listings → geo points
    const points = (0, react_1.useMemo)(() => {
        return listings.map((listing) => ({
            type: "Feature",
            properties: {
                cluster: false,
                listing,
            },
            geometry: {
                type: "Point",
                coordinates: [listing.lng, listing.lat],
            },
        }));
    }, [listings]);
    // 🔥 Build cluster index
    const clusterIndex = (0, react_1.useMemo)(() => {
        const index = new supercluster_1.default({
            radius: 60,
            maxZoom: 20,
        });
        index.load(points);
        return index;
    }, [points]);
    // 🔥 Dynamic clusters
    const clusters = (0, react_1.useMemo)(() => {
        if (!bounds)
            return [];
        return clusterIndex.getClusters(bounds, zoom);
    }, [clusterIndex, bounds, zoom]);
    if (!mounted)
        return null;
    return (<div className="relative h-full w-full">
      <react_leaflet_1.MapContainer ref={mapRef} center={[40.015, -105.27]} zoom={12} className="h-full w-full">
        <react_leaflet_1.TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

        <MapEvents onBoundsChange={onBoundsChange} setBounds={setBounds} setZoom={setZoom}/>

        {clusters.map((cluster) => {
            const [lng, lat] = cluster.geometry.coordinates;
            // 🔵 Cluster
            if (cluster.properties.cluster) {
                return (<react_leaflet_1.Marker key={`cluster-${cluster.id}`} position={[lat, lng]} icon={createClusterIcon(cluster.properties.point_count)} eventHandlers={{
                        click: () => {
                            const expansionZoom = Math.min(clusterIndex.getClusterExpansionZoom(cluster.id), 20);
                            mapRef.current?.setView([lat, lng], expansionZoom, { animate: true });
                        },
                    }}/>);
            }
            // 💰 Listing
            const listing = cluster.properties.listing;
            const isHovered = hoveredId === listing.id;
            const isSelected = selectedId === listing.id;
            return (<react_leaflet_1.Marker key={listing.id} position={[listing.lat, listing.lng]} icon={createPriceIcon(listing.price, isHovered || isSelected)} eventHandlers={{
                    click: () => {
                        if (setSelectedId) {
                            setSelectedId(listing.id);
                        }
                        else {
                            setLocalSelected(listing);
                        }
                    },
                    mouseover: () => setHoveredId?.(listing.id),
                    mouseout: () => setHoveredId?.(null),
                }}/>);
        })}
      </react_leaflet_1.MapContainer>

      {/* 🧾 Floating preview (fallback mode only) */}
      {!selectedId && localSelected && (<div className="absolute bottom-6 left-6 bg-white shadow-xl rounded-xl p-4 w-[300px] z-[1000]">
          <div className="font-semibold text-lg">
            {localSelected.address}
          </div>

          <div className="text-gray-600 mb-2">
            ${localSelected.price?.toLocaleString()}
          </div>

          <div className="text-sm text-gray-500">
            {localSelected.beds} beds • {localSelected.baths} baths
          </div>

          <button className="mt-3 text-sm text-blue-600" onClick={() => setLocalSelected(null)}>
            Close
          </button>
        </div>)}
    </div>);
}
