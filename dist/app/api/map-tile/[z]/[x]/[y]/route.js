"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
async function GET(req, context) {
    const { z, x, y } = await context.params;
    return server_1.NextResponse.json({
        message: "map tile endpoint working",
        z,
        x,
        y,
    });
}
