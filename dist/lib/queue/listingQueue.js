import { randomUUID } from 'crypto';
import { Queue } from 'bullmq';
import { createLazyQueue } from './lazyQueue.js';
import { getRedisConnection } from './redis.js';
export const LISTING_QUEUE_NAME = 'listings';
export const LISTING_JOB_NAME = 'process-listing';
export const LISTING_JOB_ATTEMPTS = 3;
export const LISTING_JOB_BACKOFF_DELAY_MS = 3000;
export const LISTING_REMOVE_ON_COMPLETE = 100;
export const LISTING_REMOVE_ON_FAIL = 500;
const listingJobOptions = {
    removeOnComplete: LISTING_REMOVE_ON_COMPLETE,
    removeOnFail: LISTING_REMOVE_ON_FAIL,
    attempts: LISTING_JOB_ATTEMPTS,
    backoff: {
        type: 'exponential',
        delay: LISTING_JOB_BACKOFF_DELAY_MS,
    },
};
const listingIdentityFields = [
    'ListingKey',
    'ListingId',
    'MLSNumber',
    'ListingNumber',
    'Id',
    'mlsid',
    'UnparsedAddress',
];
function createListingQueue() {
    return new Queue(LISTING_QUEUE_NAME, {
        connection: getRedisConnection(),
    });
}
export const listingQueue = createLazyQueue(createListingQueue);
function getFirstListingValue(listing, fields) {
    for (const field of fields) {
        const value = listing[field];
        if (value !== undefined && value !== null && String(value).trim()) {
            return value;
        }
    }
    return randomUUID();
}
function getListingIdentity(listing) {
    return String(getFirstListingValue(listing, listingIdentityFields));
}
export function getListingJobId(listing) {
    return `listing-${getListingIdentity(listing)}`;
}
export async function enqueueListing(listing) {
    return listingQueue.add(LISTING_JOB_NAME, listing, {
        ...listingJobOptions,
        jobId: getListingJobId(listing),
    });
}
export async function enqueueListingBatch(listings) {
    if (!listings.length)
        return [];
    return listingQueue.addBulk(listings.map((listing) => ({
        name: LISTING_JOB_NAME,
        data: listing,
        opts: {
            ...listingJobOptions,
            jobId: getListingJobId(listing),
        },
    })));
}
// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/queue/listingQueue.ts
