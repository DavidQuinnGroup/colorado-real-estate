"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PropertyMap;
const react_leaflet_1 = require("react-leaflet");
require("leaflet/dist/leaflet.css");
function PropertyMap({ properties }) {
    return (<react_leaflet_1.MapContainer {...{
        center: [40.017, -105.283],
        zoom: 12,
        style: { height: "500px", width: "100%" },
    }}>
      <react_leaflet_1.TileLayer {...{
        attribution: "&copy; OpenStreetMap contributors",
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    }}/>

      {properties.map((p) => (<react_leaflet_1.Marker key={p.id} position={[p.lat, p.lng]}>
          <react_leaflet_1.Popup>
            {p.address}
            <br />
            ${p.price.toLocaleString()}
          </react_leaflet_1.Popup>
        </react_leaflet_1.Marker>))}
    </react_leaflet_1.MapContainer>);
}
