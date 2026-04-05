"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchAndNotify = matchAndNotify;
const prisma_1 = require("@/lib/prisma");
async function matchAndNotify(property) {
    const db = prisma_1.prisma;
    // 1. Find matching saved searches
    const searches = await db.savedSearch.findMany({
        where: {
            isActive: true,
            city: property.city,
            AND: [
                {
                    OR: [
                        { minPrice: null },
                        { minPrice: { lte: property.price } },
                    ],
                },
                {
                    OR: [
                        { beds: null },
                        { beds: { lte: property.beds } },
                    ],
                },
            ],
        },
        include: {
            user: true,
        },
    });
    console.log(`🔎 Found ${searches.length} matching searches`);
    // 2. Loop through searches
    for (const search of searches) {
        if (!search.user?.email)
            continue;
        // 🔒 Deduplication (event-level)
        const existing = await db.alertEvent.findUnique({
            where: {
                userId_propertyId_type: {
                    userId: search.user.id,
                    propertyId: property.id,
                    type: "NEW_LISTING",
                },
            },
        });
        if (existing) {
            console.log(`⏭️ Skipping duplicate for ${search.user.email}`);
            continue;
        }
        try {
            // ✅ 1. Create alert in DB (source of truth)
            await db.alertQueue.create({
                data: {
                    userId: search.user.id,
                    listingId: property.id,
                    payload: property,
                    status: "pending",
                },
            });
            // ✅ 2. Queue disabled (safe no-op)
            await Promise.resolve();
            // ✅ 3. Record deduplication event
            await db.alertEvent.create({
                data: {
                    userId: search.user.id,
                    propertyId: property.id,
                    type: "NEW_LISTING",
                },
            });
            console.log(`📦 Batched alert for ${search.user.email}`);
        }
        catch (err) {
            console.error("Queue failed:", err);
        }
    }
}
