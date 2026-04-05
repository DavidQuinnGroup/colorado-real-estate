import { syncMLSGrid } from "../lib/mls/syncMLSGrid"

const MAX_RUNTIME_MS = 10 * 60 * 1000 // 10 minutes

async function main() {
  const start = Date.now()

  console.log("🚀 MLS Worker started")

  try {
    await syncMLSGrid({
      maxRuntimeMs: MAX_RUNTIME_MS,
    })

    console.log("✅ MLS sync completed safely")
  } catch (err) {
    console.error("❌ MLS sync failed:", err)
  } finally {
    const duration = ((Date.now() - start) / 1000).toFixed(2)
    console.log(`⏱ Worker finished in ${duration}s`)
    process.exit(0)
  }
}

main()