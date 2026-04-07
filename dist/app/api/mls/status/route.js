"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
async function GET() {
    return server_1.NextResponse.json({
        status: "ok",
        message: "MLS sync endpoint active",
        note: "Worker processing not supported on Vercel serverless",
    });
}
