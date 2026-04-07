"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BoulderMarketMap;
const react_leaflet_1 = require("react-leaflet");
require("leaflet/dist/leaflet.css");
function BoulderMarketMap() {
    const neighborhoods = [
        {
            name: "Downtown Boulder",
            price: "$1.4M",
            position: [40.0176, -105.2797]
        },
        {
            name: "North Boulder",
            price: "$1.2M",
            position: [40.0444, -105.2830]
        },
        {
            name: "South Boulder",
            price: "$1.1M",
            position: [39.9870, -105.2500]
        },
        {
            name: "Table Mesa",
            price: "$1.05M",
            position: [39.9836, -105.2430]
        }
    ];
    return (<div className="h-[500px] w-full rounded-xl overflow-hidden">

      <react_leaflet_1.MapContainer {...{
        center: [40.0150, -105.2705],
        zoom: 12,
        scrollWheelZoom: false,
        style: { height: "100%", width: "100%" }
    }}>

        <react_leaflet_1.TileLayer {...{
        attribution: "&copy; OpenStreetMap contributors",
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    }}/>

        {neighborhoods.map((n, i) => (<react_leaflet_1.Marker key={i} position={n.position}>

            <react_leaflet_1.Popup>

              <strong>{n.name}</strong>

              <br />

              Median Price: {n.price}

            </react_leaflet_1.Popup>

          </react_leaflet_1.Marker>))}

      </react_leaflet_1.MapContainer>

    </div>);
}
