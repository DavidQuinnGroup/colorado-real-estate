import { Worker } from 'bullmq';
import { processListing } from '../mls/processListing.js';
import { enqueueDeadLetterFromJob } from './deadLetterQueue.js';
import { getRedisConnection } from './redis.js';
export const LISTING_QUEUE_NAME = 'listings';
const LOCAL_BASE_URL = 'http://localhost:3000';
const TERMINAL_5 = 'Terminal 5';
const listingIdentityFields = [
    'ListingKey',
    'ListingId',
    'MLSNumber',
    'ListingNumber',
    'Id',
    'mlsid',
    'UnparsedAddress',
];
function getFirstListingValue(listing, fields) {
    for (const field of fields) {
        const value = listing[field];
        if (value !== undefined && value !== null && String(value).trim()) {
            return value;
        }
    }
    return 'unknown';
}
function getListingIdentity(listing) {
    return String(getFirstListingValue(listing, listingIdentityFields));
}
function toJobResult(result) {
    if (!result?.property) {
        throw new Error('Listing processor did not return a property record.');
    }
    return {
        propertyId: result.property.id,
        mlsId: result.property.mlsId ?? undefined,
        photoCount: result.photos?.inserted ?? undefined,
        photoDiagnostics: result.photos?.diagnostics,
        mediaDiagnostics: {
            extractedCount: result.mediaDiagnostics.extractedCount,
            directMediaArrayFields: result.mediaDiagnostics.directMediaArrayFields,
            nestedMediaArrayFields: result.mediaDiagnostics.nestedMediaArrayFields,
            topLevelPhotoFields: result.mediaDiagnostics.topLevelPhotoFields,
            ignoredMediaItemCount: result.mediaDiagnostics.ignoredMediaItemCount,
            hasMediaPayload: result.mediaDiagnostics.hasMediaPayload,
            hasNestedMediaPayload: result.mediaDiagnostics.hasNestedMediaPayload,
            hasTopLevelPhotoPayload: result.mediaDiagnostics.hasTopLevelPhotoPayload,
        },
        skippedPhotoCount: result.photos?.skipped ?? undefined,
        queuedAlerts: result.alerts?.queuedAlerts ?? undefined,
        searchIndexAttempted: result.searchIndex.attempted,
        searchIndexDiagnostics: {
            canIndex: result.searchIndex.diagnostics.canIndex,
            documentId: result.searchIndex.diagnostics.documentId,
            terminal: result.searchIndex.diagnostics.terminal,
            module: result.searchIndex.diagnostics.module,
            missingRequiredFields: result.searchIndex.diagnostics.missingRequiredFields,
        },
        searchIndexIndexed: result.searchIndex.indexed,
        searchIndexError: result.searchIndex.error,
        upsertDiagnostics: {
            canUpsert: result.upsertDiagnostics.canUpsert,
            coordinatesSource: result.upsertDiagnostics.coordinatesSource,
            usedExistingCoordinates: result.upsertDiagnostics.usedExistingCoordinates,
            swappedCoordinates: result.upsertDiagnostics.swappedCoordinates,
            hasUsableCoordinates: result.upsertDiagnostics.hasUsableCoordinates,
        },
        warningCount: result.warnings.length,
    };
}
function getErrorMessage(error) {
    return error instanceof Error ? error.message : String(error || 'Unknown listing worker error.');
}
function buildDeadLetterCommand(limit = 25) {
    const params = new URLSearchParams({
        sourceQueue: LISTING_QUEUE_NAME,
        states: 'waiting,delayed,failed',
        limit: String(limit),
    });
    return `curl -s "${LOCAL_BASE_URL}/api/admin/dead-letter?${params.toString()}"`;
}
function buildRetryCommand(options = {}) {
    const params = new URLSearchParams({
        queue: LISTING_QUEUE_NAME,
        dryRun: options.execute ? 'false' : 'true',
    });
    if (options.execute)
        params.set('execute', 'true');
    if (options.jobId)
        params.set('jobId', options.jobId);
    if (options.limit)
        params.set('limit', String(options.limit));
    return `curl -s -X POST "${LOCAL_BASE_URL}/api/mls/retry?${params.toString()}"`;
}
function buildStatusCommand() {
    return `curl -s "${LOCAL_BASE_URL}/api/mls/status"`;
}
function buildRetryStatusCommand() {
    return `curl -s "${LOCAL_BASE_URL}/api/mls/retry"`;
}
function shouldDeadLetterFailedJob(job) {
    if (!job)
        return true;
    const configuredAttempts = job.opts.attempts ?? 1;
    return job.attemptsMade >= configuredAttempts;
}
function getFailureOperations(job, finalAttempt) {
    const jobId = job?.id;
    return {
        terminal: TERMINAL_5,
        finalAttempt,
        statusCommand: buildStatusCommand(),
        retryStatusCommand: buildRetryStatusCommand(),
        deadLetterCommand: buildDeadLetterCommand(),
        dryRunRetryCommand: buildRetryCommand({
            jobId,
            limit: jobId ? undefined : 10,
        }),
        liveRetryCommand: finalAttempt
            ? buildRetryCommand({
                execute: true,
                jobId,
                limit: jobId ? undefined : 10,
            })
            : 'Live retry is not recommended until BullMQ retry attempts are exhausted.',
    };
}
export function createListingWorker() {
    const worker = new Worker(LISTING_QUEUE_NAME, async (job) => {
        const listingIdentity = getListingIdentity(job.data);
        console.log(`REIE listing job ${job.id} started: ${listingIdentity}.`);
        const result = await processListing(job.data);
        return toJobResult(result);
    }, {
        connection: getRedisConnection(),
        concurrency: 2,
    });
    worker.on('completed', (job, result) => {
        console.log(`REIE listing job ${job.id} completed:`, result);
    });
    worker.on('failed', (job, error) => {
        const attemptsMade = job?.attemptsMade ?? 0;
        const configuredAttempts = job?.opts.attempts ?? 1;
        const finalAttempt = shouldDeadLetterFailedJob(job);
        console.error(`REIE listing job ${job?.id ?? 'unknown'} failed:`, {
            attemptsMade,
            configuredAttempts,
            finalAttempt,
            message: getErrorMessage(error),
            operations: getFailureOperations(job, finalAttempt),
        });
        if (!finalAttempt) {
            console.warn(`REIE listing job ${job?.id ?? 'unknown'} will retry before dead-letter capture.`);
            return;
        }
        void enqueueDeadLetterFromJob(LISTING_QUEUE_NAME, job, error).catch((deadLetterError) => {
            console.error('Failed to enqueue listing dead-letter job:', getErrorMessage(deadLetterError));
        });
    });
    console.log(`REIE listing worker listening on queue "${LISTING_QUEUE_NAME}":`, {
        queue: LISTING_QUEUE_NAME,
        terminal: TERMINAL_5,
        statusCommand: buildStatusCommand(),
        retryStatusCommand: buildRetryStatusCommand(),
        deadLetterCommand: buildDeadLetterCommand(),
        dryRunRetryCommand: buildRetryCommand({ limit: 10 }),
        liveRetryCommand: buildRetryCommand({ execute: true, limit: 10 }),
    });
    return worker;
}
// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/queue/worker.ts
