"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSellerLead = createSellerLead;
const prisma_1 = require("@/lib/prisma");
async function createSellerLead(input) {
    const { propertyId, city, beds, price, reason } = input;
    if (!propertyId) {
        throw new Error("createSellerLead: propertyId is required");
    }
    try {
        // ✅ Deduplication: prevent duplicate leads per property
        const existing = await prisma_1.prisma.sellerLead.findFirst({
            where: {
                propertyId,
            },
        });
        if (existing) {
            return existing;
        }
        // ✅ Create new lead
        const lead = await prisma_1.prisma.sellerLead.create({
            data: {
                propertyId,
                city,
                beds: beds ?? null,
                price: price ?? null,
                reason,
            },
        });
        return lead;
    }
    catch (error) {
        console.error("❌ createSellerLead error:", error);
        throw error;
    }
}
