"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHotLeads = getHotLeads;
const prisma_1 = require("@/lib/prisma");
async function getHotLeads() {
    const db = prisma_1.prisma;
    const leads = await db.alertQueue.findMany({
        where: {
            clickedAt: {
                not: null,
            },
        },
        include: {
            user: true,
        },
        orderBy: {
            clickedAt: "desc",
        },
        take: 20,
    });
    return leads;
}
