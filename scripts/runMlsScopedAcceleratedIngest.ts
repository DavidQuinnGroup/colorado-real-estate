import dotenv from 'dotenv';
import { prisma } from '../lib/prisma.js';
import {
  getMlsScopedPublicSearchFingerprint,
  ingestMlsScopedPublicSearchPages,
  type MlsScopedIngestCheckpoint,
  type MlsScopedIngestRunResult,
} from '../lib/mls/scopedIngestAcceleration.js';
import {
  configureMlsGridRequestGovernor,
  getRateLimitState,
  resetRateLimitState,
} from '../lib/mls/rateLimiter.js';

dotenv.config({ path: '.env.local' });

type Snapshot = {
  propertyTotal: number;
  publicActive: number;
  publicComingSoon: number;
  sourceModifiedAtPopulated: number;
  sourceModifiedAtMissing: number;
  alertEvent: number;
  alertQueue: number;
  emailLog: number;
  mlsSyncState: {
    lastPage: number;
    totalRecords: number;
    isSyncing: boolean;
    lastSync: string;
    lastIntelligenceSync: string | null;
  } | null;
};

const args = new Set(process.argv.slice(2));
const execute = args.has('--execute');
const simulateResume = args.has('--simulate-resume');
const maxPages = getArgNumber('--max-pages', 10);
const maxRows = getArgNumber('--max-rows', 1000);
const concurrency = getArgNumber('--concurrency', 6);
const timeoutMs = getArgNumber('--timeout-ms', 45000);
const top = getArgNumber('--top', 100);
const maxProviderRequests = getArgNumber('--max-provider-requests', maxPages);

function getArgNumber(name: string, fallback: number) {
  const prefix = `${name}=`;
  const value = process.argv.find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.floor(parsed) : fallback;
}

function getBaseUrl() {
  return (process.env.MLS_GRID_BASE_URL || process.env.MLS_API_URL || '').trim();
}

function toIso(value: Date | null | undefined) {
  return value ? value.toISOString() : null;
}

function publicStatusWhere(status: string) {
  return {
    isPrivateExclusive: false,
    status: {
      equals: status,
      mode: 'insensitive' as const,
    },
  };
}

async function getSnapshot(): Promise<Snapshot> {
  const [
    propertyTotal,
    publicActive,
    publicComingSoon,
    sourceModifiedAtPopulated,
    sourceModifiedAtMissing,
    alertEvent,
    alertQueue,
    emailLog,
    mlsSyncState,
  ] = await Promise.all([
    prisma.property.count(),
    prisma.property.count({ where: publicStatusWhere('Active') }),
    prisma.property.count({ where: publicStatusWhere('Coming Soon') }),
    prisma.property.count({ where: { sourceModifiedAt: { not: null } } }),
    prisma.property.count({ where: { sourceModifiedAt: null } }),
    prisma.alertEvent.count(),
    prisma.alertQueue.count(),
    prisma.emailLog.count(),
    prisma.mlsSyncState.findUnique({ where: { id: 1 } }),
  ]);

  return {
    alertEvent,
    alertQueue,
    emailLog,
    mlsSyncState: mlsSyncState
      ? {
          isSyncing: mlsSyncState.isSyncing,
          lastIntelligenceSync: toIso(mlsSyncState.lastIntelligenceSync),
          lastPage: mlsSyncState.lastPage,
          lastSync: mlsSyncState.lastSync.toISOString(),
          totalRecords: mlsSyncState.totalRecords,
        }
      : null,
    propertyTotal,
    publicActive,
    publicComingSoon,
    sourceModifiedAtMissing,
    sourceModifiedAtPopulated,
  };
}

async function ensurePreconditions() {
  const state = await prisma.mlsSyncState.findUnique({ where: { id: 1 } });
  if (state?.isSyncing) {
    throw new Error('MlsSyncState.isSyncing is true.');
  }

  const [column] = await prisma.$queryRaw<Array<{ exists: boolean }>>`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'Property'
        AND column_name = 'sourceModifiedAt'
    ) AS exists
  `;
  if (!column?.exists) {
    throw new Error('sourceModifiedAt column is missing.');
  }
}

async function markStarted() {
  await prisma.mlsSyncState.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      isSyncing: true,
      lastPage: 0,
      lastSync: new Date(),
      totalRecords: 0,
    },
    update: {
      isSyncing: true,
      lastSync: new Date(),
    },
  });
}

async function markFinished(result: MlsScopedIngestRunResult | null) {
  await prisma.mlsSyncState.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      isSyncing: false,
      lastIntelligenceSync: result && result.processed > 0 ? new Date() : undefined,
      lastPage: result?.checkpoint.pageNumber ?? 0,
      lastSync: new Date(),
      totalRecords: result?.processed ?? 0,
    },
    update: {
      isSyncing: false,
      lastIntelligenceSync: result && result.processed > 0 ? new Date() : undefined,
      lastPage: result?.checkpoint.pageNumber ?? 0,
      lastSync: new Date(),
      totalRecords: result?.processed ?? 0,
    },
  });
}

function sanitizeRunResult(result: MlsScopedIngestRunResult) {
  return {
    checkpoint: {
      fetchedCount: result.checkpoint.fetchedCount,
      hasNextLink: Boolean(result.checkpoint.nextLink),
      pageNumber: result.checkpoint.pageNumber,
      processedCount: result.checkpoint.processedCount,
      scopeFingerprint: result.checkpoint.scopeFingerprint,
      updatedAt: result.checkpoint.updatedAt,
    },
    created: result.created,
    duplicateSourceIds: result.duplicateSourceIds,
    durationMs: result.durationMs,
    failed: result.failed,
    fetched: result.fetched,
    finalNextLinkState: result.finalNextLinkState,
    pages: result.pages,
    peakConcurrency: result.peakConcurrency,
    processed: result.processed,
    skipped: result.skipped,
    sourceReportedScopedCount: result.sourceReportedScopedCount,
    terminalSignal: result.terminalSignal,
    unchanged: result.unchanged,
    updated: result.updated,
  };
}

async function runLive() {
  if (!execute) {
    return {
      mode: 'DRY_RUN_NO_PROVIDER_NO_DB_MUTATION',
      scopeFingerprint: getMlsScopedPublicSearchFingerprint(),
      wouldRun: {
        concurrency,
        maxPages,
        maxProviderRequests,
        maxRows,
        simulateResume,
        timeoutMs,
        top,
      },
    };
  }

  if (maxPages > 10 || maxRows > 1000) {
    throw new Error('Live bound exceeded. Maximum is 10 pages or 1000 rows.');
  }

  if (maxProviderRequests > maxPages) {
    throw new Error('Provider request budget cannot exceed maxPages for this bounded proof runner.');
  }

  await ensurePreconditions();
  resetRateLimitState();
  configureMlsGridRequestGovernor({
    maxRequestsPerRun: maxProviderRequests,
    minDelayMs: 1000,
  });
  const before = await getSnapshot();
  let first: MlsScopedIngestRunResult | null = null;
  let second: MlsScopedIngestRunResult | null = null;
  let finalResult: MlsScopedIngestRunResult | null = null;

  await markStarted();

  try {
    if (simulateResume) {
      first = await ingestMlsScopedPublicSearchPages({
        concurrency,
        maxPages: 1,
        maxRows: Math.min(maxRows, top),
        providerBaseUrl: getBaseUrl(),
        timeoutMs,
        top,
      });
      const remainingRows = Math.max(0, maxRows - first.fetched);
      const remainingPages = Math.max(0, maxPages - first.pages);
      second =
        remainingRows > 0 && remainingPages > 0 && first.checkpoint.nextLink
          ? await ingestMlsScopedPublicSearchPages({
              checkpoint: first.checkpoint,
              concurrency,
              maxPages: remainingPages,
              maxRows: remainingRows,
              providerBaseUrl: getBaseUrl(),
              timeoutMs,
              top,
            })
          : null;
      finalResult = {
        ...(second || first),
        checkpoint: second?.checkpoint || first.checkpoint,
        created: first.created + (second?.created ?? 0),
        duplicateSourceIds: first.duplicateSourceIds + (second?.duplicateSourceIds ?? 0),
        durationMs: first.durationMs + (second?.durationMs ?? 0),
        failed: first.failed + (second?.failed ?? 0),
        fetched: first.fetched + (second?.fetched ?? 0),
        pages: first.pages + (second?.pages ?? 0),
        peakConcurrency: Math.max(first.peakConcurrency, second?.peakConcurrency ?? 0),
        processed: first.processed + (second?.processed ?? 0),
        skipped: first.skipped + (second?.skipped ?? 0),
        unchanged: first.unchanged + (second?.unchanged ?? 0),
        updated: first.updated + (second?.updated ?? 0),
      };
    } else {
      finalResult = await ingestMlsScopedPublicSearchPages({
        concurrency,
        maxPages,
        maxRows,
        providerBaseUrl: getBaseUrl(),
        timeoutMs,
        top,
      });
    }
  } finally {
    await markFinished(finalResult);
  }

  const after = await getSnapshot();

  return {
    after,
    before,
    bounds: {
      concurrency,
      maxPages,
      maxRows,
      timeoutMs,
      top,
    },
    mode: 'LIVE_BOUNDED_SCOPED_NEXTLINK_ACCELERATED_INGEST',
    requestGovernor: getRateLimitState(),
    result: finalResult ? sanitizeRunResult(finalResult) : null,
    resumeProof: simulateResume
      ? {
          first: first ? sanitizeRunResult(first) : null,
          resumed: Boolean(second),
          second: second ? sanitizeRunResult(second) : null,
        }
      : null,
    sideEffects: {
      alertEventDelta: after.alertEvent - before.alertEvent,
      alertQueueDelta: after.alertQueue - before.alertQueue,
      emailLogDelta: after.emailLog - before.emailLog,
    },
  };
}

try {
  const result = await runLive();
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error(
    JSON.stringify(
      {
        error: error instanceof Error ? error.message : String(error || 'Unknown live scoped ingest error.'),
        status: 'ERROR',
      },
      null,
      2,
    ),
  );
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
