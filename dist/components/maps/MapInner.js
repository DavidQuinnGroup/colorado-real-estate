"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MapInner;
const react_1 = require("react");
const leaflet_1 = __importDefault(require("leaflet"));
const react_leaflet_1 = require("react-leaflet");
require("leaflet/dist/leaflet.css");
const navigation_1 = require("next/navigation");
const MapEvents_1 = __importDefault(require("./MapEvents"));
const MapMarkers_1 = __importDefault(require("./MapMarkers"));
delete leaflet_1.default.Icon.Default.prototype._getIconUrl;
leaflet_1.default.Icon.Default.mergeOptions({
    iconRetinaUrl: "/leaflet/marker-icon-2x.png",
    iconUrl: "/leaflet/marker-icon.png",
    shadowUrl: "/leaflet/marker-shadow.png"
});
function FlyToListing({ listing }) {
    const map = (0, react_leaflet_1.useMap)();
    (0, react_1.useEffect)(() => {
        if (!listing)
            return;
        map.flyTo([listing.lat, listing.lng], 15, { duration: 0.5 });
    }, [listing, map]);
    return null;
}
function MapInner({ city, onListingsChange, activeListingId, setActiveListingId }) {
    const [listings, setListings] = (0, react_1.useState)([]);
    const timeoutRef = (0, react_1.useRef)(null);
    const router = (0, navigation_1.useRouter)();
    const searchParams = (0, navigation_1.useSearchParams)();
    const minPrice = searchParams.get("minPrice");
    const beds = searchParams.get("beds");
    const type = searchParams.get("type");
    const handleBoundsChange = (map) => {
        if (timeoutRef.current)
            clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(async () => {
            const bounds = map.getBounds();
            const zoom = map.getZoom();
            const center = map.getCenter();
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.set("lat", center.lat.toString());
            newParams.set("lng", center.lng.toString());
            newParams.set("zoom", zoom.toString());
            router.replace(`?${newParams.toString()}`, { scroll: false });
            const queryParams = new URLSearchParams();
            queryParams.set("minLat", bounds.getSouth().toString());
            queryParams.set("maxLat", bounds.getNorth().toString());
            queryParams.set("minLng", bounds.getWest().toString());
            queryParams.set("maxLng", bounds.getEast().toString());
            if (minPrice)
                queryParams.set("minPrice", minPrice);
            if (beds)
                queryParams.set("beds", beds);
            if (type)
                queryParams.set("type", type);
            try {
                const res = await fetch(`/api/map-listings?${queryParams}`);
                const data = await res.json();
                setListings(data);
                onListingsChange(data);
            }
            catch (err) {
                console.error("Listings fetch error:", err);
            }
        }, 150);
    };
    const activeListing = listings.find((l) => l.mls_id === activeListingId);
    (0, react_1.useEffect)(() => {
        // 🔥 Fix "Map container is already initialized"
        const container = document.querySelector(".leaflet-container");
        if (container && container._leaflet_id) {
            ;
            container._leaflet_id = null;
        }
    }, []);
    return (<react_leaflet_1.MapContainer center={[40.0176, -105.2797]} zoom={13} style={{ height: "100%", width: "100%" }}>
      <react_leaflet_1.TileLayer attribution="© OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

      <MapEvents_1.default onBoundsChange={handleBoundsChange}/>

      <MapMarkers_1.default listings={listings} activeListingId={activeListingId} setActiveListingId={setActiveListingId}/>

      <FlyToListing listing={activeListing}/>
    </react_leaflet_1.MapContainer>);
}
