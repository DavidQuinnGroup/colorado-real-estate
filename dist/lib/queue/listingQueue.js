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
function getListingIdentityInfo(listing) {
    for (const field of listingIdentityFields) {
        const value = listing[field];
        if (value !== undefined && value !== null && String(value).trim()) {
            return {
                field,
                stable: true,
                value: String(value),
            };
        }
    }
    return {
        stable: false,
        value: randomUUID(),
    };
}
function getListingIdentity(listing) {
    return getListingIdentityInfo(listing).value;
}
export function getListingJobId(listing) {
    return `listing-${getListingIdentity(listing)}`;
}
export function getListingQueuePlan(listing) {
    const identity = getListingIdentityInfo(listing);
    const jobId = `listing-${identity.value}`;
    return {
        queueName: LISTING_QUEUE_NAME,
        jobName: LISTING_JOB_NAME,
        jobId,
        identity,
        terminal: 'Terminal 5',
        commands: {
            startWorker: 'npm run run:worker',
            status: 'curl --max-time 8 -s -w "\\nHTTP_STATUS:%{http_code}\\n" "http://localhost:3000/api/mls/status"',
            retryDryRun: 'curl --max-time 8 -s -X POST -w "\\nHTTP_STATUS:%{http_code}\\n" "http://localhost:3000/api/mls/retry?queue=listings&dryRun=true&limit=6"',
            queueDashboard: 'npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000',
            deadLetter: 'curl --max-time 8 -s -w "\\nHTTP_STATUS:%{http_code}\\n" "http://localhost:3000/api/admin/dead-letter?sourceQueue=listings&states=waiting%2Cdelayed%2Cfailed&limit=25"',
        },
        jobOptions: {
            attempts: LISTING_JOB_ATTEMPTS,
            backoff: {
                type: 'exponential',
                delay: LISTING_JOB_BACKOFF_DELAY_MS,
            },
            removeOnComplete: LISTING_REMOVE_ON_COMPLETE,
            removeOnFail: LISTING_REMOVE_ON_FAIL,
        },
    };
}
export async function enqueueListing(listing) {
    const plan = getListingQueuePlan(listing);
    return listingQueue.add(LISTING_JOB_NAME, listing, {
        ...listingJobOptions,
        jobId: plan.jobId,
    });
}
export async function enqueueListingBatch(listings) {
    if (!listings.length)
        return [];
    return listingQueue.addBulk(listings.map((listing) => {
        const plan = getListingQueuePlan(listing);
        return {
            name: LISTING_JOB_NAME,
            data: listing,
            opts: {
                ...listingJobOptions,
                jobId: plan.jobId,
            },
        };
    }));
}
// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/queue/listingQueue.ts
