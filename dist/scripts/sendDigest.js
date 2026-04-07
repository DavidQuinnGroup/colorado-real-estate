"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("@/lib/prisma");
const sendAlert_1 = require("@/lib/email/sendAlert");
async function runDigest() {
    const users = await prisma_1.prisma.user.findMany({
        include: {
            alertQueue: true,
        },
    });
    for (const user of users) {
        const listings = user.alertQueue
            .filter((a) => a.status === "pending")
            .map((a) => a.payload);
        if (!listings.length)
            continue;
        await (0, sendAlert_1.sendAlert)({
            user,
            listings,
        });
    }
}
runDigest().catch((err) => {
    console.error("❌ Digest failed:", err);
    process.exit(1);
});
