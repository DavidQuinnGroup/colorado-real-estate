"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PriceMarker;
const react_leaflet_1 = require("react-leaflet");
const leaflet_1 = __importDefault(require("leaflet"));
function PriceMarker({ property, isActive, onHover, onLeave }) {
    const icon = leaflet_1.default.divIcon({
        className: "price-marker",
        html: `
      <div style="
        background:${isActive ? "#2563eb" : "white"};
        color:${isActive ? "white" : "black"};
        padding:6px 12px;
        border-radius:8px;
        font-weight:700;
        border:1px solid #ccc;
        box-shadow:0 2px 6px rgba(0,0,0,0.35);
      ">
        $${Math.round(property.price / 1000)}K
      </div>
    `,
    });
    return (<react_leaflet_1.Marker position={[property.lat, property.lng]} icon={icon} eventHandlers={{
            mouseover: onHover,
            mouseout: onLeave
        }}>
      <react_leaflet_1.Popup>
        <div>
          <div>${property.price.toLocaleString()}</div>
        </div>
      </react_leaflet_1.Popup>
    </react_leaflet_1.Marker>);
}
