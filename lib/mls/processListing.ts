import { upsertListing } from './upsertListing'

export async function processListing(listing: any) {
  try {
    // Core ingestion only
    await upsertListing(listing)

    // 🚨 ALERTS DISABLED (will reintroduce later via separate queue)
    // await listingQueue.add(...)
    // await alertQueue.add(...)

    return true
  } catch (error) {
    console.error('[PROCESS LISTING ERROR]', error)
    throw error
  }
}