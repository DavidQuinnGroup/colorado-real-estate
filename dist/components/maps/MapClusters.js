"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MapClusters;
const MarkerClusterGroup = ({ children }) => <>{children}</>;
function MapClusters({ children }) {
    return (<MarkerClusterGroup chunkedLoading maxClusterRadius={60} spiderfyOnMaxZoom={true} showCoverageOnHover={false} zoomToBoundsOnClick={true}>
      {children}
    </MarkerClusterGroup>);
}
