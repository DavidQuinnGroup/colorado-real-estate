"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
async function GET(request) {
    const { searchParams } = new URL(request.url);
    const cityParam = searchParams.get("city");
    const SHEET_ID = "1JcduPf1DXK7bbrO6gGMyFIWl4lJecn3LIBQYF4fWjB8";
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json`;
    try {
        const res = await fetch(url);
        const text = await res.text();
        const json = JSON.parse(text.substring(47, text.length - 2));
        let rows = json.table.rows.map((r) => ({
            month: r.c[0]?.v || "",
            city: r.c[1]?.v || "",
            medianPrice: r.c[2]?.v || 0,
            avgDOM: r.c[3]?.v || 0,
            inventory: r.c[4]?.v || 0,
            soldHomes: r.c[5]?.v || 0,
            priceChange: (r.c[6]?.v || 0) * 100
        }));
        // Filter by city if provided
        if (cityParam) {
            rows = rows.filter((row) => row.city.toLowerCase() === cityParam.toLowerCase());
        }
        return server_1.NextResponse.json(rows);
    }
    catch (error) {
        return server_1.NextResponse.json({ error: "Failed to fetch market data", details: error }, { status: 500 });
    }
}
