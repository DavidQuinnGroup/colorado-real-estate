"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const prisma_1 = require("@/lib/prisma");
const server_1 = require("next/server");
async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get("token");
        if (!token) {
            return server_1.NextResponse.json({ error: "Invalid unsubscribe link" }, { status: 400 });
        }
        // ✅ Use typed-safe fallback
        const db = prisma_1.prisma;
        // 1. Find token
        const record = await db.unsubscribeToken.findUnique({
            where: { token },
            include: {
                user: true,
                search: true,
            },
        });
        if (!record) {
            return server_1.NextResponse.json({ error: "Invalid or expired token" }, { status: 404 });
        }
        // 2. Mark token as used
        await db.unsubscribeToken.update({
            where: { token },
            data: {
                usedAt: new Date(),
            },
        });
        // 3. If tied to a search → disable that search
        if (record.searchId) {
            await db.savedSearch.update({
                where: { id: record.searchId },
                data: {
                    isActive: false,
                },
            });
            return new Response(`
        <html>
          <body style="font-family:Arial;padding:40px;">
            <h2>You’ve been unsubscribed</h2>
            <p>You will no longer receive alerts for this search.</p>
          </body>
        </html>
        `, { headers: { "Content-Type": "text/html" } });
        }
        // 4. Otherwise → global unsubscribe
        await db.user.update({
            where: { id: record.userId },
            data: {
                isUnsubscribed: true,
                unsubscribedAt: new Date(),
            },
        });
        return new Response(`
      <html>
        <body style="font-family:Arial;padding:40px;">
          <h2>You’ve been unsubscribed</h2>
          <p>You will no longer receive any listing alerts.</p>
        </body>
      </html>
      `, { headers: { "Content-Type": "text/html" } });
    }
    catch (error) {
        console.error("Unsubscribe error:", error);
        return server_1.NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
