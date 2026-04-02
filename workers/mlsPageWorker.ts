import "dotenv/config"
import { Worker, Job, Queue } from "bullmq"
import { connection } from "../lib/queue/mlsQueue.ts"
import { fetchMLSGridListings } from "../lib/mls/mlsGridClient.ts"
import { processListingsBatch } from "../lib/mls/processListingsBatch.ts"
import {
  incrementProcessed,
  incrementFailed,
} from "../lib/mls/syncState.ts"
import { sendAlert } from "../lib/alerts/sendAlert.ts"
import {
  adaptiveDelay,
  recordSuccess,
  recordFailure,
  getCurrentDelay,
} from "../lib/mls/adaptiveLimiter.ts"

const pageQueue = new Queue("mls-page", { connection })

console.log("⚙️ MLS Page Worker started")

function log(job: Job, message: string, data?: any) {
  const prefix = `[Page ${job.data?.page ?? "?"} | Job ${job.id}]`
  console.log(prefix, message, data || "")
}

new Worker(
  "mls-page",
  async (job: Job) => {
    const { page, skip, top, lastSync, syncRunId } = job.data

    try {
      await adaptiveDelay()

      const listings = await fetchMLSGridListings({
        skip,
        top,
        lastSync,
      })

      recordSuccess()

      if (!listings || listings.length === 0) {
        log(job, `🛑 END OF DATA at page ${page}`)
        return
      }

      log(job, `📊 Fetched ${listings.length} listings`)

      await processListingsBatch(listings)

      if (syncRunId) {
        await incrementProcessed(syncRunId)
      }

      log(job, `💾 Stored ${listings.length} listings`)

      // 🔁 enqueue next page
      await pageQueue.add("mls-page", {
        page: page + 1,
        skip: (page + 1) * top,
        top,
        lastSync,
        syncRunId,
      })

      return {
        page,
        count: listings.length,
      }
    } catch (err: any) {
      recordFailure(err?.status || err?.response?.status)

      if (syncRunId) {
        await incrementFailed(syncRunId)
      }

      await sendAlert(`❌ Page ${page} failed: ${err?.message}`)

      throw err
    }
  },
  {
    connection,
    concurrency: 1,
  }
)