import "dotenv/config";

async function start() {
  // 🚨 HARD BUILD GUARD
  if (process.env.NEXT_PHASE === "phase-production-build") {
    console.log("⛔ Skipping worker during build phase");
    return;
  }

  console.log("🚀 Worker starting...");

  const { syncMLSGrid } = await import("../lib/mls/syncMLSGrid");

  const maxRuntimeMs = Number(process.env.MLS_MAX_RUNTIME_MS || 600000);

  await syncMLSGrid({ maxRuntimeMs });

  console.log("🏁 Worker finished");
}

start().catch((err) => {
  console.error("❌ Worker crashed", err);
  process.exit(1);
});