import "dotenv/config"
import { Worker, Job } from "bullmq"
import { connection } from "../lib/queue/mlsQueue"
import { fetchMLSGridListings } from "../lib/mls/mlsGridClient"
import { processListingsBatch } from "../lib/mls/processListingsBatch"

type JobData = {
  skip: number
  top: number
  lastSync: string
}

const worker = new Worker<JobData>(
  "mlsPageQueue",
  async (job: Job<JobData>) => {
    const { skip, top, lastSync } = job.data

    const listings = await fetchMLSGridListings({
      skip,
      top,
      lastSync,
    })

    await processListingsBatch(listings)

    console.log(`✅ Processed MLS page: skip=${skip}`)
  },
  {
    connection,
  }
)

worker.on("completed", (job) => {
  console.log(`🎉 Job completed: ${job.id}`)
})

worker.on("failed", (job, err) => {
  console.error(`❌ Job failed: ${job?.id}`, err)
})