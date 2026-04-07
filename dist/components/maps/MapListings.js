"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MapListings;
const react_1 = require("react");
const react_leaflet_1 = require("react-leaflet");
function MapListings({ setListings }) {
    const map = (0, react_leaflet_1.useMap)();
    async function fetchListings() {
        const bounds = map.getBounds();
        const url = `/api/map-listings?minLat=${bounds.getSouth()}&maxLat=${bounds.getNorth()}&minLng=${bounds.getWest()}&maxLng=${bounds.getEast()}`;
        const res = await fetch(url);
        const data = await res.json();
        setListings(data);
    }
    (0, react_1.useEffect)(() => {
        fetchListings();
        map.on("moveend", fetchListings);
        return () => {
            map.off("moveend", fetchListings);
        };
    }, [map]);
    return null;
}
