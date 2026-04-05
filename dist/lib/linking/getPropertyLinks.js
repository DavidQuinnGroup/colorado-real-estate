"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPropertyLinks = getPropertyLinks;
const prisma_1 = require("@/lib/prisma");
async function getPropertyLinks(property) {
    const db = prisma_1.prisma;
    const neighborhoodHomes = await db.property.findMany({
        where: {
            neighborhood: property.neighborhood,
            status: "Active"
        },
        take: 6
    });
    const cityHomes = await db.property.findMany({
        where: {
            city: property.city,
            status: "Active"
        },
        take: 6
    });
    return {
        neighborhoodHomes,
        cityHomes
    };
}
