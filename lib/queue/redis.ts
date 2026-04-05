import Redis from "ioredis"

let redis: Redis | null = null

export function getRedis() {
  if (process.env.NODE_ENV === "production" && process.env.RAILWAY_ENVIRONMENT) {
    // Only connect in runtime, not build
    if (!redis) {
      redis = new Redis(process.env.REDIS_URL!)
    }
    return redis
  }

  // During build → return null (no connection)
  return null
}