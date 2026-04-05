"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTask = createTask;
const prisma_1 = require("@/lib/prisma");
async function createTask(leadId) {
    const db = prisma_1.prisma;
    try {
        // Check if task already exists
        const existing = await db.cRMTask.findFirst({
            where: { leadId },
        });
        if (existing) {
            return existing;
        }
        // Create new task
        const task = await db.cRMTask.create({
            data: {
                leadId,
                status: "pending",
            },
        });
        return task;
    }
    catch (error) {
        console.error("CRM task error:", error);
        return null;
    }
}
