"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchProperties = searchProperties;
const prisma_1 = require("@/lib/prisma");
async function searchProperties(params) {
    const { city, minPrice, maxPrice, beds, baths, limit = 20, offset = 0 } = params;
    const results = await prisma_1.prisma.property.findMany({
        where: {
            city: city ? { equals: city, mode: "insensitive" } : undefined,
            price: {
                gte: minPrice ?? undefined,
                lte: maxPrice ?? undefined
            },
            beds: beds ? { gte: beds } : undefined,
            baths: baths ? { gte: baths } : undefined
        },
        include: {
            photos: {
                take: 1
            }
        },
        orderBy: {
            price: "desc"
        },
        take: limit,
        skip: offset
    });
    return results;
}
