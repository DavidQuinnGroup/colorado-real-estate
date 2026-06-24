import { randomUUID } from 'crypto';
import { Queue, type JobsOptions } from 'bullmq';

import type { MlsListingPayload } from '../mls/processListing.js';
import { createLazyQueue } from './lazyQueue.js';
import { getRedisConnection } from './redis.js';

export type ListingJobData = MlsListingPayload;

export type ListingQueuePlan = {
  queueName: typeof LISTING_QUEUE_NAME;
  jobName: typeof LISTING_JOB_NAME;
  jobId: string;
  identity: {
    field?: string;
    value: string;
    stable: boolean;
  };
  terminal: 'Terminal 5';
  commands: {
    startWorker: string;
    status: string;
    retryDryRun: string;
    queueDashboard: string;
    deadLetter: string;
  };
  jobOptions: {
    attempts: number;
    backoff: {
      type: 'exponential';
      delay: number;
    };
    removeOnComplete: number;
    removeOnFail: number;
  };
};

export const LISTING_QUEUE_NAME = 'listings';

export const LISTING_JOB_NAME = 'process-listing';
export const LISTING_JOB_ATTEMPTS = 3;
export const LISTING_JOB_BACKOFF_DELAY_MS = 3_000;
export const LISTING_REMOVE_ON_COMPLETE = 100;
export const LISTING_REMOVE_ON_FAIL = 500;

const listingJobOptions: JobsOptions = {
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
] as const;

function createListingQueue() {
  return new Queue<ListingJobData>(LISTING_QUEUE_NAME, {
    connection: getRedisConnection(),
  });
}

export const listingQueue = createLazyQueue(createListingQueue);

function getListingIdentityInfo(listing: ListingJobData) {
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

function getListingIdentity(listing: ListingJobData) {
  return getListingIdentityInfo(listing).value;
}

export function getListingJobId(listing: ListingJobData) {
  return `listing-${getListingIdentity(listing)}`;
}

export function getListingQueuePlan(listing: ListingJobData): ListingQueuePlan {
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

export async function enqueueListing(listing: ListingJobData) {
  const plan = getListingQueuePlan(listing);

  return listingQueue.add(LISTING_JOB_NAME, listing, {
    ...listingJobOptions,
    jobId: plan.jobId,
  });
}

export async function enqueueListingBatch(listings: ListingJobData[]) {
  if (!listings.length) return [];

  return listingQueue.addBulk(
    listings.map((listing) => {
      const plan = getListingQueuePlan(listing);

      return {
        name: LISTING_JOB_NAME,
        data: listing,
        opts: {
          ...listingJobOptions,
          jobId: plan.jobId,
        },
      };
    }),
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/queue/listingQueue.ts
