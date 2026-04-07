"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
const prisma_1 = require("@/lib/prisma");
const updateUserPreferences_1 = require("@/lib/preferences/updateUserPreferences");
async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const listingId = searchParams.get("l");
        const userId = searchParams.get("u");
        if (!listingId || !userId) {
            return server_1.NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }
        // 🔒 Update clickedAt for matching alerts
        const db = prisma_1.prisma;
        await db.alertQueue.updateMany({
            where: {
                listingId,
                userId,
                status: "sent",
                clickedAt: null,
            },
            data: {
                clickedAt: new Date(),
            },
        });
        // 🧠 Trigger preference learning (async, don't block redirect)
        (0, updateUserPreferences_1.updateUserPreferences)(userId).catch((err) => {
            console.error("Preference update failed:", err);
        });
        // 🔁 Redirect to listing page
        const redirectUrl = `/listing/${listingId}`;
        return server_1.NextResponse.redirect(redirectUrl);
    }
    catch (error) {
        console.error("Track click error:", error);
        return server_1.NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
