"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCRMTasks = runCRMTasks;
const prisma_1 = require("../lib/prisma");
async function runCRMTasks() {
    try {
        console.log("🔍 Prisma keys:", Object.keys(prisma_1.prisma));
        const now = new Date();
        console.log("🔄 Running CRM Task Worker...");
        // 🔥 TEMP SAFE ACCESS
        const crm = prisma_1.prisma.crmTask || prisma_1.prisma.cRMTask;
        if (!crm) {
            console.error("❌ CRMTask model NOT FOUND on Prisma client");
            return;
        }
        const tasks = await crm.findMany({
            where: {
                status: "pending",
                scheduledFor: {
                    lte: now,
                },
            },
            take: 20,
        });
        console.log(`📬 Found ${tasks.length} tasks`);
    }
    catch (err) {
        console.error("runCRMTasks error:", err);
    }
}
