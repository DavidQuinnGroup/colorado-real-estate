let connection: any = null;

function isBuildPhase() {
  return process.env.NEXT_PHASE === "phase-production-build";
}

export function getRedisConnection() {
  // 🚨 NEVER connect during build
  if (isBuildPhase()) {
    console.log("⛔ Skipping Redis connection during build");
    return null;
  }

  if (connection) return connection;

  const { Redis } = require("ioredis");

  connection = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

  connection.on("error", (err: any) => {
    console.error("❌ Redis error", err);
  });

  console.log("✅ Redis connected");

  return connection;
}