"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedisConnection = getRedisConnection;
let connection = null;
function isBuildPhase() {
    return process.env.NEXT_PHASE === "phase-production-build";
}
function getRedisConnection() {
    // 🚨 NEVER connect during build
    if (isBuildPhase()) {
        console.log("⛔ Skipping Redis connection during build");
        return null;
    }
    if (connection)
        return connection;
    const { Redis } = require("ioredis");
    connection = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
    connection.on("error", (err) => {
        console.error("❌ Redis error", err);
    });
    console.log("✅ Redis connected");
    return connection;
}
