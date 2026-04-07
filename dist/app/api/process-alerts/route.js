"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
const enqueueAlert_1 = require("@/lib/queue/enqueueAlert");
const prisma_1 = require("@/lib/prisma");
async function GET() {
    try {
        const db = prisma_1.prisma;
        const alerts = await db.alertQueue.findMany({
            where: { status: "pending" },
            take: 50,
        });
        for (const alert of alerts) {
            await (0, enqueueAlert_1.enqueueAlert)(alert.id);
        }
        return server_1.NextResponse.json({
            success: true,
            processed: alerts.length,
        });
    }
    catch (error) {
        console.error("Process alerts error:", error);
        return server_1.NextResponse.json({ error: "Failed to process alerts" }, { status: 500 });
    }
}
