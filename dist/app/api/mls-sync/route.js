"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const fetchMLS_1 = require("@/lib/mls/fetchMLS");
const processListing_1 = require("@/lib/mls/processListing");
async function GET() {
    try {
        const listings = await (0, fetchMLS_1.fetchMLSListings)();
        for (const listing of listings) {
            await (0, processListing_1.processListing)(listing);
        }
        return Response.json({
            success: true,
            processed: listings.length
        });
    }
    catch (error) {
        console.error(error);
        return Response.json({
            success: false
        });
    }
}
