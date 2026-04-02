import { mlsQueue } from "@/lib/queue/mlsQueue"

export async function enqueueListings(listings: any[]) {
  const jobs = listings.map((listing) => ({
    name: "process-listing",
    data: listing
  }))

  await mlsQueue.addBulk(jobs)
}