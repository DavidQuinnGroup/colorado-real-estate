"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MapEvents;
const react_leaflet_1 = require("react-leaflet");
function MapEvents({ onBoundsChange }) {
    const map = (0, react_leaflet_1.useMapEvents)({
        moveend: () => onBoundsChange(map),
        zoomend: () => onBoundsChange(map),
    });
    return null;
}
