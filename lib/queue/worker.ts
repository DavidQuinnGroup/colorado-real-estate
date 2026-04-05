if (process.env.NEXT_PHASE === "phase-production-build") {
  console.log("⛔ Skipping worker init during build")
  process.exit(0)
}

import { Worker } from "bullmq"
import { processListing } from "@/lib/mls/processListing"

new Worker("listings", async job => {

 await processListing(job.data)

})