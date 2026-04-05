"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchSavedSearches = matchSavedSearches;
const prisma_1 = require("@/lib/prisma");
async function matchSavedSearches(listing) {
    const db = prisma_1.prisma;
    const searches = await db.savedSearch.findMany({
        where: {
            isActive: true,
            city: listing.city,
        },
    });
    return searches.filter((search) => {
        if (search.minPrice && listing.price < search.minPrice)
            return false;
        if (search.beds && listing.beds < search.beds)
            return false;
        if (search.type && listing.propertyType !== search.type)
            return false;
        // Bounding box filter
        if (search.north &&
            search.south &&
            search.east &&
            search.west) {
            if (listing.lat > search.north ||
                listing.lat < search.south ||
                listing.lng > search.east ||
                listing.lng < search.west) {
                return false;
            }
        }
        return true;
    });
}
