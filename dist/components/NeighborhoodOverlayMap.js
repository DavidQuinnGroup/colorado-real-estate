"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NeighborhoodOverlayMap;
const react_leaflet_1 = require("react-leaflet");
const neighborhoodPolygons_1 = require("@/lib/neighborhoodPolygons");
const link_1 = __importDefault(require("next/link"));
require("leaflet/dist/leaflet.css");
function NeighborhoodOverlayMap() {
    return (<react_leaflet_1.MapContainer {...{
        center: [40.017, -105.283],
        zoom: 12,
        style: { height: "500px", width: "100%" },
    }}>

      <react_leaflet_1.TileLayer {...{
        attribution: "&copy; OpenStreetMap contributors",
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    }}/>

      {neighborhoodPolygons_1.neighborhoodPolygons.map((n) => (<react_leaflet_1.Polygon key={n.slug} positions={n.coordinates}>

          <react_leaflet_1.Popup>

            <link_1.default href={`/neighborhood/${n.slug}`}>
              View {n.name} Neighborhood →
            </link_1.default>

          </react_leaflet_1.Popup>

        </react_leaflet_1.Polygon>))}

    </react_leaflet_1.MapContainer>);
}
