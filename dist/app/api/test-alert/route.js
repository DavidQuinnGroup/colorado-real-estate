"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const sendAlert_1 = require("@/lib/email/sendAlert");
async function GET() {
    const testUser = {
        email: "newtest@example.com",
        name: "Test User",
    };
    const testListings = [
        {
            id: "test-1",
            price: 500000,
            beds: 3,
            baths: 2,
            sqft: 1800,
            address: "123 Test St, Boulder, CO",
            city: "Boulder",
            slug: "123-test-st",
            photos: [
                "https://images.unsplash.com/photo-1560184897-ae75f418493e"
            ],
        },
    ];
    await (0, sendAlert_1.sendAlert)({
        user: testUser,
        listings: testListings, // ✅ ALWAYS ARRAY
    });
    return Response.json({ success: true });
}
