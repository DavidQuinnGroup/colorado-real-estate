"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listingsToPoints = listingsToPoints;
function listingsToPoints(listings) {
    return listings.map((listing) => ({
        type: "Feature",
        properties: {
            id: listing.id,
            price: listing.price,
        },
        geometry: {
            type: "Point",
            coordinates: [listing.lng, listing.lat],
        },
    }));
}
