"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserPreferences = updateUserPreferences;
const prisma_1 = require("@/lib/prisma");
async function updateUserPreferences(userId) {
    try {
        // 🧠 Get clicked alerts
        const clickedAlerts = await prisma_1.prisma.alertQueue.findMany({
            where: {
                userId,
                clickedAt: {
                    not: null,
                },
            },
            select: {
                payload: true,
            },
        });
        if (!clickedAlerts.length)
            return;
        const prices = [];
        const beds = [];
        const cityCount = {};
        for (const alert of clickedAlerts) {
            const payload = alert.payload;
            if (payload.price)
                prices.push(payload.price);
            if (payload.beds)
                beds.push(payload.beds);
            if (payload.city) {
                cityCount[payload.city] = (cityCount[payload.city] || 0) + 1;
            }
        }
        // 📊 Compute averages
        const avgPrice = prices.length > 0
            ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
            : null;
        const avgBeds = beds.length > 0
            ? Math.round(beds.reduce((a, b) => a + b, 0) / beds.length)
            : null;
        // 🏙️ Top cities (sorted by frequency)
        const topCities = Object.entries(cityCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([city]) => city);
        // 💾 Upsert preferences
        await prisma_1.prisma.userPreference.upsert({
            where: {
                userId,
            },
            update: {
                avgPrice,
                avgBeds,
                topCities,
                updatedAt: new Date(),
            },
            create: {
                userId,
                avgPrice,
                avgBeds,
                topCities,
            },
        });
    }
    catch (error) {
        console.error("updateUserPreferences error:", error);
    }
}
