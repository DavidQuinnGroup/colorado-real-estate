"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMLSListings = fetchMLSListings;
async function fetchMLSListings() {
    // Temporary demo listings
    // Later this will connect to a real MLS API
    return [
        {
            slug: "1234-mapleton-ave-boulder-co",
            address: "1234 Mapleton Ave",
            city: "boulder",
            price: "$2,250,000",
            beds: 4,
            baths: 3,
            sqft: 3200
        },
        {
            slug: "5678-gunbarrel-rd-boulder-co",
            address: "5678 Gunbarrel Rd",
            city: "boulder",
            price: "$975,000",
            beds: 3,
            baths: 2,
            sqft: 2100
        }
    ];
}
