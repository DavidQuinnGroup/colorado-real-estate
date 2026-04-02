"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchIRESListings = fetchIRESListings;
async function fetchIRESListings(skip = 0) {
    const url = `${process.env.IRES_API_URL}/Property?$top=500&$skip=${skip}`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${process.env.IRES_ACCESS_TOKEN}`,
            Accept: "application/json"
        }
    });
    const data = await response.json();
    return data.value;
}
