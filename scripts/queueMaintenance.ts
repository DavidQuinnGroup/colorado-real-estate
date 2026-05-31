import { Queue, Worker } from 'bullmq';

import { ALERT_QUEUE_NAME, alertQueue } from '../lib/queue/alertQueue.js';
import { LISTING_QUEUE_NAME, listingQueue } from '../lib/queue/listingQueue.js';
import { MLS_PAGE_QUEUE_NAME, mlsPageQueue } from '../lib/queue/mlsPageQueue.js';
import { MLS_SYNC_QUEUE_NAME, mlsQueue } from '../lib/queue/mlsQueue.js';
import { enqueueDeadLetterFromJob } from '../lib/queue/deadLetterQueue.js';
import { closeRedisConnections, getRedisConnection } from '../lib/queue/redis.js';

type QueueDefinition = {
  label: string;
  name: string;
  queue: Queue;
};

type MaintenanceOptions = {
  action: 'capture-dead-letter' | 'stale-recovery' | 'retry-failed';
  execute: boolean;
  jobId: string;
  limit: number;
  queueName: string;
  staleMinutes: number;
};

type StalledRecoveryResult = {
  firstPass: string[];
  secondPass: string[];
};

const DEFAULT_STALE_MINUTES = 30;
const DEFAULT_QUEUE = MLS_PAGE_QUEUE_NAME;
const DEFAULT_RETRY_LIMIT = 10;
const STALLED_RECOVERY_PASS_DELAY_MS = 10;
const QUEUES: QueueDefinition[] = [
  { label: 'MLS page', name: MLS_PAGE_QUEUE_NAME, queue: mlsPageQueue as Queue },
  { label: 'MLS sync', name: MLS_SYNC_QUEUE_NAME, queue: mlsQueue as Queue },
  { label: 'Listings', name: LISTING_QUEUE_NAME, queue: listingQueue as Queue },
  { label: 'Alerts', name: ALERT_QUEUE_NAME, queue: alertQueue as Queue },
];

const HELP_TEXT = `
REIE queue maintenance

Usage:
  node dist/scripts/queueMaintenance.js [options]

Options:
  --action=<name>           stale-recovery, retry-failed, or capture-dead-letter. Default: stale-recovery.
  --queue=<name>            Queue to inspect. Default: mls-page.
  --job-id=<id>             Target job id for live stale recovery or targeted failed retry.
  --limit=<number>          Failed retry scan limit. Default: 10.
  --stale-minutes=<number>  Active job age threshold. Default: 30.
  --execute                 Run BullMQ stalled-job recovery or failed-job retry after safety checks.
  --help                    Show this help text.

Dry-run inspection:
  npm run run:queue-maintenance -- --queue=mls-page --job-id=<jobId>

Live stale recovery:
  npm run run:queue-maintenance -- --queue=mls-page --job-id=<jobId> --execute

Dry-run failed retry:
  npm run run:queue-maintenance -- --action=retry-failed --queue=mls-sync --limit=10

Live failed retry:
  npm run run:queue-maintenance -- --action=retry-failed --queue=mls-sync --job-id=<jobId> --execute

Dry-run dead-letter capture:
  npm run run:queue-maintenance -- --action=capture-dead-letter --queue=mls-sync --limit=10

Live dead-letter capture:
  npm run run:queue-maintenance -- --action=capture-dead-letter --queue=mls-sync --job-id=<jobId> --execute
`;

function readFlagValue(arg: string) {
  const [, value] = arg.split('=');
  return value || '';
}

function getSafeNumber(value: string, fallback: number, min: number, max: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(Math.floor(parsed), max));
}

function parseOptions(argv: string[]): MaintenanceOptions {
  const options: MaintenanceOptions = {
    action: 'stale-recovery',
    execute: false,
    jobId: '',
    limit: DEFAULT_RETRY_LIMIT,
    queueName: DEFAULT_QUEUE,
    staleMinutes: DEFAULT_STALE_MINUTES,
  };

  for (const arg of argv) {
    if (arg === '--help' || arg === '-h') {
      console.log(HELP_TEXT.trim());
      process.exit(0);
    }

    if (arg === '--execute') {
      options.execute = true;
      continue;
    }

    if (arg.startsWith('--queue=')) {
      options.queueName = readFlagValue(arg);
      continue;
    }

    if (arg.startsWith('--action=')) {
      const action = readFlagValue(arg);
      if (action !== 'stale-recovery' && action !== 'retry-failed' && action !== 'capture-dead-letter') {
        throw new Error(`Unsupported action: ${action}`);
      }
      options.action = action;
      continue;
    }

    if (arg.startsWith('--job-id=')) {
      options.jobId = readFlagValue(arg);
      continue;
    }

    if (arg.startsWith('--limit=')) {
      options.limit = getSafeNumber(readFlagValue(arg), DEFAULT_RETRY_LIMIT, 1, 100);
      continue;
    }

    if (arg.startsWith('--stale-minutes=')) {
      options.staleMinutes = getSafeNumber(readFlagValue(arg), DEFAULT_STALE_MINUTES, 1, 24 * 60);
      continue;
    }

    throw new Error(`Unknown option: ${arg}`);
  }

  return options;
}

function findQueue(queueName: string) {
  const normalized = queueName.toLowerCase();
  return QUEUES.find((definition) => definition.name.toLowerCase() === normalized || definition.label.toLowerCase() === normalized);
}

function toIsoDate(value: number | undefined) {
  return value ? new Date(value).toISOString() : null;
}

function getProcessedAgeMinutes(processedOn: number | undefined) {
  if (!processedOn) return null;
  return Math.floor(Math.max(Date.now() - processedOn, 0) / 60000);
}

async function getLockState(queue: Queue, jobId: string) {
  const client = await queue.client;
  const lockKey = queue.toKey(`${jobId}:lock`);
  const [exists, ttlMs] = await Promise.all([client.exists(lockKey), client.pttl(lockKey)]);

  return {
    exists: exists === 1,
    ttlMs,
  };
}

async function summarizeJob(queue: Queue, job: any, staleMinutes: number) {
  const state = await job.getState().catch(() => 'unknown');
  const processedAgeMinutes = getProcessedAgeMinutes(job.processedOn);
  const lock = job.id ? await getLockState(queue, job.id) : { exists: false, ttlMs: -2 };

  return {
    id: job.id,
    name: job.name,
    state,
    attemptsMade: job.attemptsMade,
    timestamp: toIsoDate(job.timestamp),
    processedOn: toIsoDate(job.processedOn),
    processedAgeMinutes,
    stale: processedAgeMinutes !== null && processedAgeMinutes >= staleMinutes,
    lock,
    data: job.data,
  };
}

async function summarizeFailedJob(job: any) {
  const state = await job.getState().catch(() => 'unknown');

  return {
    id: job.id,
    name: job.name,
    state,
    attemptsMade: job.attemptsMade,
    failedReason: job.failedReason || null,
    timestamp: toIsoDate(job.timestamp),
    processedOn: toIsoDate(job.processedOn),
    finishedOn: toIsoDate(job.finishedOn),
    retryable: state === 'failed',
    data: job.data,
  };
}

async function inspectQueue(definition: QueueDefinition, options: MaintenanceOptions) {
  const counts = await definition.queue.getJobCounts('waiting', 'active', 'delayed', 'completed', 'failed', 'paused');
  const activeJobs = await definition.queue.getJobs(['active'], 0, 49);
  const active = await Promise.all(activeJobs.map((job) => summarizeJob(definition.queue, job, options.staleMinutes)));
  const target = options.jobId ? active.find((job) => job.id === options.jobId) || null : null;
  const staleActive = active.filter((job) => job.stale);

  return {
    definition,
    report: {
      label: definition.label,
      name: definition.name,
      counts,
      staleMinutes: options.staleMinutes,
      active,
      staleActive,
      target,
    },
  };
}

async function getFailedRetryCandidates(definition: QueueDefinition, options: MaintenanceOptions) {
  if (options.jobId) {
    const job = await definition.queue.getJob(options.jobId);
    return job ? [job] : [];
  }

  return definition.queue.getFailed(0, options.limit - 1);
}

async function inspectFailedRetry(definition: QueueDefinition, options: MaintenanceOptions) {
  const counts = await definition.queue.getJobCounts('waiting', 'active', 'delayed', 'completed', 'failed', 'paused');
  const candidateJobs = await getFailedRetryCandidates(definition, options);
  const jobs = await Promise.all(candidateJobs.map(summarizeFailedJob));

  return {
    label: definition.label,
    name: definition.name,
    counts,
    dryRun: !options.execute,
    targeted: Boolean(options.jobId),
    inspected: jobs.length,
    retryable: jobs.filter((job) => job.retryable).length,
    skipped: jobs.filter((job) => !job.retryable).length,
    missingTarget: Boolean(options.jobId) && jobs.length === 0,
    jobs,
  };
}

function validateLiveRecovery(options: MaintenanceOptions, report: Awaited<ReturnType<typeof inspectQueue>>['report']) {
  if (!options.execute) return null;
  if (!options.jobId) return 'Live stale recovery requires --job-id=<id>.';
  if (!report.target) return `Target job ${options.jobId} is not active in ${report.name}.`;
  if (!report.target.stale) return `Target job ${options.jobId} is not stale by the ${options.staleMinutes} minute threshold.`;
  if (report.target.lock.exists) return `Target job ${options.jobId} still has an active lock; wait for the worker or inspect the process before recovery.`;
  return null;
}

function validateLiveFailedRetry(options: MaintenanceOptions, report: Awaited<ReturnType<typeof inspectFailedRetry>>) {
  if (!options.execute) return null;
  if (!options.jobId) return 'Live failed retry requires --job-id=<id>.';
  if (report.missingTarget) return `Target job ${options.jobId} was not found in ${report.name}.`;
  if (report.retryable < 1) return `Target job ${options.jobId} is not currently failed and retryable.`;
  return null;
}

async function retryFailedJobs(definition: QueueDefinition, options: MaintenanceOptions, report: Awaited<ReturnType<typeof inspectFailedRetry>>) {
  if (!options.execute) return { attempted: false, retried: 0, errors: [] as Array<{ jobId?: string; error: string }> };

  let retried = 0;
  const errors: Array<{ jobId?: string; error: string }> = [];
  const candidateJobs = await getFailedRetryCandidates(definition, options);
  const retryableIds = new Set(report.jobs.filter((job) => job.retryable).map((job) => job.id));

  for (const job of candidateJobs) {
    if (!job.id || !retryableIds.has(job.id)) continue;

    try {
      await job.retry();
      retried++;
    } catch (error) {
      errors.push({
        jobId: job.id,
        error: error instanceof Error ? error.message : String(error || 'Unknown retry error.'),
      });
    }
  }

  return {
    attempted: true,
    retried,
    errors,
  };
}

function validateLiveDeadLetterCapture(options: MaintenanceOptions, report: Awaited<ReturnType<typeof inspectFailedRetry>>) {
  if (!options.execute) return null;
  if (!options.jobId) return 'Live dead-letter capture requires --job-id=<id>.';
  if (report.missingTarget) return `Target job ${options.jobId} was not found in ${report.name}.`;
  if (report.retryable < 1) return `Target job ${options.jobId} is not currently failed and eligible for dead-letter capture.`;
  return null;
}

async function captureDeadLetter(definition: QueueDefinition, options: MaintenanceOptions, report: Awaited<ReturnType<typeof inspectFailedRetry>>) {
  if (!options.execute) return { attempted: false, captured: 0, errors: [] as Array<{ jobId?: string; error: string }> };

  let captured = 0;
  const errors: Array<{ jobId?: string; error: string }> = [];
  const candidateJobs = await getFailedRetryCandidates(definition, options);
  const retryableIds = new Set(report.jobs.filter((job) => job.retryable).map((job) => job.id));

  for (const job of candidateJobs) {
    if (!job.id || !retryableIds.has(job.id)) continue;

    try {
      await enqueueDeadLetterFromJob(definition.name, job, new Error(job.failedReason || 'Captured failed queue job for operator review.'));
      captured++;
    } catch (error) {
      errors.push({
        jobId: job.id,
        error: error instanceof Error ? error.message : String(error || 'Unknown dead-letter capture error.'),
      });
    }
  }

  return {
    attempted: true,
    captured,
    errors,
  };
}

async function runStalledRecoveryPass(definition: QueueDefinition) {
  const worker = new Worker(
    definition.name,
    async () => null,
    {
      autorun: false,
      connection: getRedisConnection(),
      stalledInterval: 1,
    },
  );

  try {
    const stalled = await (worker as unknown as { moveStalledJobsToWait: () => Promise<string[] | undefined> }).moveStalledJobsToWait();
    return stalled ?? [];
  } finally {
    await worker.close(true);
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runStalledRecovery(definition: QueueDefinition): Promise<StalledRecoveryResult> {
  const firstPass = await runStalledRecoveryPass(definition);
  await delay(STALLED_RECOVERY_PASS_DELAY_MS);
  const secondPass = await runStalledRecoveryPass(definition);

  return {
    firstPass,
    secondPass,
  };
}

async function closeQueues() {
  await Promise.allSettled(QUEUES.map((definition) => definition.queue.close()));
  await closeRedisConnections();
}

async function main() {
  const options = parseOptions(process.argv.slice(2));
  const definition = findQueue(options.queueName);

  if (!definition) {
    throw new Error(`Unsupported queue "${options.queueName}". Supported queues: ${QUEUES.map((queue) => queue.name).join(', ')}`);
  }

  if (options.action === 'retry-failed' || options.action === 'capture-dead-letter') {
    const before = await inspectFailedRetry(definition, options);
    const blocker =
      options.action === 'retry-failed'
        ? validateLiveFailedRetry(options, before)
        : validateLiveDeadLetterCapture(options, before);
    let retryResult = { attempted: false, retried: 0, errors: [] as Array<{ jobId?: string; error: string }> };
    let deadLetterResult = { attempted: false, captured: 0, errors: [] as Array<{ jobId?: string; error: string }> };
    let after = before;

    if (blocker) {
      process.exitCode = 1;
    } else if (options.action === 'capture-dead-letter') {
      deadLetterResult = await captureDeadLetter(definition, options, before);
      after = await inspectFailedRetry(definition, options);
      if (deadLetterResult.errors.length > 0) process.exitCode = 1;
    } else {
      retryResult = await retryFailedJobs(definition, options, before);
      after = await inspectFailedRetry(definition, options);
      if (retryResult.errors.length > 0) process.exitCode = 1;
    }

    console.log(
      JSON.stringify(
        {
          success: !blocker && retryResult.errors.length === 0 && deadLetterResult.errors.length === 0,
          module: 'queue-maintenance',
          generatedAt: new Date().toISOString(),
          mode: options.execute ? 'execute' : 'dry-run',
          options,
          safety: {
            liveRetryRequiresExecute: options.action === 'retry-failed',
            liveRetryRequiresTargetJobId: options.action === 'retry-failed',
            liveDeadLetterCaptureRequiresExecute: options.action === 'capture-dead-letter',
            liveDeadLetterCaptureRequiresTargetJobId: options.action === 'capture-dead-letter',
            blocker,
          },
          retry: retryResult,
          deadLetterCapture: deadLetterResult,
          commands: {
            dryRunCurrentScope: options.jobId
              ? `npm run run:queue-maintenance -- --action=${options.action} --queue=${definition.name} --job-id=${options.jobId}`
              : `npm run run:queue-maintenance -- --action=${options.action} --queue=${definition.name} --limit=${options.limit}`,
            liveCurrentTarget: options.jobId
              ? `npm run run:queue-maintenance -- --action=${options.action} --queue=${definition.name} --job-id=${options.jobId} --execute`
              : options.action === 'retry-failed'
                ? 'Live failed retry requires --job-id=<id>.'
                : 'Live dead-letter capture requires --job-id=<id>.',
            queueDashboard: 'npm run run:queue-dashboard -- --failed --sample --limit=5 --timeout-ms=3000',
          },
          before,
          after,
        },
        null,
        2,
      ),
    );
    return;
  }

  const before = await inspectQueue(definition, options);
  const blocker = validateLiveRecovery(options, before.report);
  let recovered: StalledRecoveryResult = { firstPass: [], secondPass: [] };
  let after = before.report;

  if (blocker) {
    process.exitCode = 1;
  } else if (options.execute) {
    recovered = await runStalledRecovery(definition);
    after = (await inspectQueue(definition, options)).report;
  }

  console.log(
    JSON.stringify(
      {
        success: !blocker,
        module: 'queue-maintenance',
        generatedAt: new Date().toISOString(),
        mode: options.execute ? 'execute' : 'dry-run',
        options,
        safety: {
          liveRecoveryRequiresExecute: true,
          liveRecoveryRequiresTargetJobId: true,
          liveRecoveryRequiresMissingLock: true,
          blocker,
        },
        recovery: {
          attempted: options.execute && !blocker,
          stalledJobsMovedToWait: recovered,
        },
        commands: {
          dryRunCurrentTarget: options.jobId
            ? `npm run run:queue-maintenance -- --queue=${definition.name} --job-id=${options.jobId} --stale-minutes=${options.staleMinutes}`
            : `npm run run:queue-maintenance -- --queue=${definition.name} --stale-minutes=${options.staleMinutes}`,
          liveCurrentTarget: options.jobId
            ? `npm run run:queue-maintenance -- --queue=${definition.name} --job-id=${options.jobId} --stale-minutes=${options.staleMinutes} --execute`
            : 'Live recovery requires --job-id=<id>.',
          queueDashboard: 'npm run run:queue-dashboard -- --failed --sample --limit=5 --timeout-ms=3000',
        },
        before: before.report,
        after,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error: any) => {
    console.error('REIE queue maintenance failed:', error instanceof Error ? error.message : String(error || 'Unknown error.'));
    process.exitCode = 1;
  })
  .finally(() => closeQueues());

// /Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/queueMaintenance.ts
