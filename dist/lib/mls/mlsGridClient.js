"use strict";
// /lib/mls/mlsGridClient.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMLSGridListings = fetchMLSGridListings;
const BASE_URL = process.env.MLS_GRID_BASE_URL;
const TOKEN = process.env.MLS_GRID_TOKEN;
// 🔥 FIX: Normalize timestamp to MLS format
function formatMLSTimestamp(ts) {
    if (!ts)
        return null;
    // Convert to Date → ISO → ensures Z format
    return new Date(ts).toISOString();
}
async function fetchMLSGridListings(nextUrl, lastSync) {
    let url = nextUrl;
    if (!url) {
        const params = new URLSearchParams();
        params.append("$top", "200");
        // 🔥 FIX APPLIED HERE
        const formatted = formatMLSTimestamp(lastSync ?? null);
        if (formatted) {
            params.append("$filter", `ModificationTimestamp gt ${formatted}`);
        }
        url = `${BASE_URL}/Property?${params.toString()}`;
    }
    console.log("🌐 MLS Request:", url);
    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
        },
    });
    if (!res.ok) {
        const text = await res.text();
        console.error("❌ MLS API ERROR:", text);
        throw new Error("MLS API request failed");
    }
    return res.json();
}
