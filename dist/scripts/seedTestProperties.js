"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../lib/prisma");
async function main() {
    await prisma_1.prisma.property.createMany({
        data: [
            {
                id: "TEST-BOULDER-1",
                mlsId: "MLS-TEST-1001",
                slug: "123-pearl-st-boulder-co",
                address: "123 Pearl St",
                city: "Boulder",
                state: "CO",
                zip: "80302",
                beds: 3,
                baths: 2,
                price: 925000,
                lat: 40.0189,
                lng: -105.2765,
                status: "active",
                propertyType: "Single Family"
            },
            {
                id: "TEST-BOULDER-2",
                mlsId: "MLS-TEST-1002",
                slug: "456-main-st-louisville-co",
                address: "456 Main St",
                city: "Louisville",
                state: "CO",
                zip: "80027",
                beds: 4,
                baths: 3,
                price: 1150000,
                lat: 39.9778,
                lng: -105.1319,
                status: "active",
                propertyType: "Single Family"
            },
            {
                id: "TEST-BOULDER-3",
                mlsId: "MLS-TEST-1003",
                slug: "789-pine-st-boulder-co",
                address: "789 Pine St",
                city: "Boulder",
                state: "CO",
                zip: "80302",
                beds: 2,
                baths: 2,
                price: 720000,
                lat: 40.0212,
                lng: -105.284,
                status: "active",
                propertyType: "Condo"
            }
        ]
    });
    console.log("✅ Test properties created");
}
main()
    .catch(console.error)
    .finally(async () => {
    await prisma_1.prisma.$disconnect();
});
