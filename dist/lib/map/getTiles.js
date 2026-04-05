"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lngLatToTile = lngLatToTile;
function lngLatToTile(lng, lat, zoom) {
    const n = Math.pow(2, zoom);
    const x = Math.floor(((lng + 180) / 360) * n);
    const latRad = (lat * Math.PI) / 180;
    const y = Math.floor((1 -
        Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) /
        2 *
        n);
    return { x, y };
}
