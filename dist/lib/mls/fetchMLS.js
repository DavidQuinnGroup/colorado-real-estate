"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMLSListings = fetchMLSListings;
async function fetchMLSListings() {
    const response = await fetch(process.env.MLS_API_URL, {
        headers: {
            Authorization: `Bearer ${process.env.MLS_API_KEY}`
        }
    });
    if (!response.ok) {
        throw new Error("MLS fetch failed");
    }
    const data = await response.json();
    return data.value || [];
}
