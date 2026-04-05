"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeadPerformance = getLeadPerformance;
const prisma_1 = require("@/lib/prisma");
async function getLeadPerformance() {
    const db = prisma_1.prisma;
    const leads = await db.sellerLead.findMany();
    const total = leads.length;
    const contacted = leads.filter((l) => l.contactedAt).length;
    const converted = leads.filter((l) => l.convertedAt).length;
    return {
        total,
        contacted,
        converted,
        contactRate: total ? contacted / total : 0,
        conversionRate: total ? converted / total : 0,
    };
}
