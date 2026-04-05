"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMLSListings = fetchMLSListings;
async function fetchMLSListings() {
    // placeholder for MLS API
    const listings = [
        {
            id: "mls1",
            address: "1234 Maple St",
            slug: "1234-maple-st-boulder-co",
            city: "boulder",
            state: "CO",
            zip: "80304",
            price: 1250000,
            beds: 4,
            baths: 3,
            sqft: 2850,
            lat: 40.039,
            lng: -105.281,
            neighborhood: "mapleton-hill"
        }
    ];
    return listings;
}
