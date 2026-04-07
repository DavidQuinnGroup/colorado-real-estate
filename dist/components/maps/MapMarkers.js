"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MapMarkers;
const react_leaflet_1 = require("react-leaflet");
const leaflet_1 = __importDefault(require("leaflet"));
function formatPrice(price) {
    if (!price)
        return "";
    if (price >= 1000000)
        return `$${(price / 1000000).toFixed(1)}M`;
    if (price >= 1000)
        return `$${Math.round(price / 1000)}K`;
    return `$${price}`;
}
function createPriceIcon(price) {
    const label = formatPrice(price);
    return leaflet_1.default.divIcon({
        className: "",
        html: `
      <div style="
        background: #111;
        color: white;
        padding: 6px 10px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        border: 1px solid rgba(255,255,255,0.2);
        white-space: nowrap;
      ">
        ${label}
      </div>
    `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
    });
}
function MapMarkers({ listings, activeListingId, setActiveListingId }) {
    return (<>
      {listings.map((listing) => (<react_leaflet_1.Marker key={listing.mls_id} position={[listing.lat, listing.lng]} icon={createPriceIcon(listing.price)} eventHandlers={{
                click: () => setActiveListingId(listing.mls_id)
            }}>
          <react_leaflet_1.Popup>
            <div>
              <strong>{listing.address}</strong>
              <br />
              {formatPrice(listing.price)}
            </div>
          </react_leaflet_1.Popup>
        </react_leaflet_1.Marker>))}
    </>);
}
