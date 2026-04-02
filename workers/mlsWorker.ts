import { Queue } from "bullmq"
import { connection } from "@/lib/queue/mlsQueue.ts"
import { createSyncRun } from "@/lib/mls/syncState.ts"
import { getLastSuccessfulSync } from "@/lib/mls/syncState.ts"

const queue = new Queue("mls-page", { connection })

const PAGE_SIZE = 100

export default async function runMLSCoordinator() {
  console.log("🚀 Starting MLS sync (streaming mode)")

  const lastSync = await getLastSuccessfulSync()

  const syncRun = await createSyncRun()

  // ✅ ONLY enqueue first page
  await queue.add("mls-page", {
    page: 0,
    skip: 0,
    top: PAGE_SIZE,
    lastSync,
    syncRunId: syncRun.id,
  })

  console.log("✅ Enqueued initial page (page 0)")
}