import { Worker } from "bullmq"
import { processListing } from "@/lib/mls/processListing"

new Worker("listings", async job => {

 await processListing(job.data)

})