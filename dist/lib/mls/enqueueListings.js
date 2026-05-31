import { enqueueListingBatch } from '../queue/listingQueue.js';
export async function enqueueListings(listings) {
    return enqueueListingBatch(listings);
}
// lib/mls/enqueueListings.ts
