"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const redis_1 = require("@/lib/queue/redis");
const prisma_1 = require("@/lib/prisma");
const sendAlert_1 = require("@/lib/email/sendAlert");
const worker = new bullmq_1.Worker("alerts", async (job) => {
    const { userId } = job.data;
    if (!userId) {
        throw new Error("Missing userId in job");
    }
    // 🔥 1. Fetch ALL pending alerts for this user
    const alerts = await prisma_1.prisma.alertQueue.findMany({
        where: {
            userId,
            status: "pending",
        },
        include: {
            user: true,
        },
        orderBy: {
            createdAt: "asc",
        },
    });
    if (!alerts.length) {
        console.log("No pending alerts");
        return;
    }
    const user = alerts[0].user;
    if (!user?.email) {
        throw new Error("User has no email");
    }
    try {
        // 🔥 2. Extract listings from payload
        // 🔒 Safely extract valid listings
        const listings = alerts
            .map((alert) => alert.payload)
            .filter((payload) => {
            if (!payload)
                return false;
            // ensure critical fields exist
            if (!payload.id) {
                console.warn("⚠️ Missing listing.id in payload", payload);
                return false;
            }
            return true;
        });
        if (!listings.length) {
            console.warn("⚠️ No valid listings to send");
            return;
        }
        // 🔥 3. Send ONE digest email
        await (0, sendAlert_1.sendAlert)({
            user,
            listings,
        });
        // 🔥 4. Mark ALL as sent
        await prisma_1.prisma.alertQueue.updateMany({
            where: {
                id: {
                    in: alerts.map((a) => a.id),
                },
            },
            data: {
                status: "sent",
                sentAt: new Date(),
            },
        });
        console.log(`📦 Sent digest (${listings.length}) to ${user.email}`);
    }
    catch (error) {
        console.error("Alert batch failed:", error);
        await prisma_1.prisma.alertQueue.updateMany({
            where: {
                id: {
                    in: alerts.map((a) => a.id),
                },
            },
            data: {
                status: "failed",
            },
        });
        throw error; // enables retries
    }
}, {
    connection: redis_1.redis,
    concurrency: 5,
});
console.log("🚀 Alert worker running...");
