import { strict as assert } from 'node:assert';
import { spawn } from 'node:child_process';

import dotenv from 'dotenv';

import { getAppDatabasePreflightDiagnostics } from '../lib/appDatabasePreflightDiagnostics.js';
import { getFetchMLSPageDiagnostics } from '../lib/mls/fetchMLSPage.js';
import { getMlsGridRequestDiagnostics } from '../lib/mls/mlsGridClient.js';
import { getListingMediaDiagnostics, getListingMediaPayload } from '../lib/mls/processListing.js';
import { getBatchProcessPlan, summarizeBatchMediaDiagnostics } from '../lib/mls/processListingsBatch.js';
import { normalizePhotoRecordsWithDiagnostics } from '../lib/mls/processPhotos.js';
import { getSyncMLSGridPlan } from '../lib/mls/syncMLSGrid.js';
import { getUpsertListingDiagnostics } from '../lib/mls/upsertListing.js';
import { getSearchIndexDiagnostics } from '../lib/mls/updateSearchIndex.js';
import { getAlertQueuePlan } from '../lib/queue/alertQueue.js';
import { getDatabasePreflightDiagnostics } from '../lib/queue/databasePreflight.js';
import { getDeadLetterQueuePlan } from '../lib/queue/deadLetterQueue.js';
import { getEnqueueAlertPlan } from '../lib/queue/enqueueAlert.js';
import { getLazyQueueDiagnostics } from '../lib/queue/lazyQueue.js';
import { getListingQueuePlan } from '../lib/queue/listingQueue.js';
import { getMlsPageQueuePlan } from '../lib/queue/mlsPageQueue.js';
import { getMlsSyncQueuePlan } from '../lib/queue/mlsQueue.js';
import { getRedisConnectionDiagnostics } from '../lib/queue/redis.js';
import { getMlsPageWorkerPlan } from '../workers/mlsPageWorker.js';
import { getMlsWorkerPlan } from '../workers/mlsWorker.js';

dotenv.config({ path: '.env.local', quiet: true });
dotenv.config({ quiet: true });

const BASE_URL = (process.env.OPS_SMOKE_BASE_URL || 'http://localhost:3000').replace(/\/+$/, '');
const REQUEST_TIMEOUT_MS = Number(process.env.OPS_SMOKE_REQUEST_TIMEOUT_MS || 8000);
const MAX_ATTEMPTS = Number(process.env.OPS_SMOKE_MAX_ATTEMPTS || 4);
const RETRY_DELAY_MS = Number(process.env.OPS_SMOKE_RETRY_DELAY_MS || 1000);
const ADMIN_KEY = process.env.REIE_ADMIN_API_KEY || process.env.ADMIN_API_KEY || '';

type JsonRecord = Record<string, unknown>;

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function fetchJson(path: string, init: RequestInit = {}) {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const headers: Record<string, string> = {
        accept: 'application/json',
      };

      if (ADMIN_KEY) {
        headers['x-admin-key'] = ADMIN_KEY;
      }

      const response = await fetch(`${BASE_URL}${path}`, {
        ...init,
        headers,
        signal: controller.signal,
      });
      const payload = (await response.json().catch(() => null)) as unknown;

      assert.equal(response.status, 200, `Expected HTTP 200 for ${path}, got ${response.status}.`);
      assert.ok(isRecord(payload), `Expected ${path} to return a JSON object.`);

      return payload;
    } catch (error) {
      lastError = error;

      if (attempt < MAX_ATTEMPTS) {
        await delay(RETRY_DELAY_MS);
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new Error(`Failed to fetch ${path} after ${MAX_ATTEMPTS} attempts: ${errorMessage(lastError)}`);
}

async function assertMlsStatus() {
  const path = '/api/mls/status?inspect=overview';
  const payload = await fetchJson(path);

  assert.equal(payload.success, true, 'Expected MLS status success=true.');
  assert.equal(payload.module, 'MLS Operations Status', 'Expected MLS operations status payload.');
  assert.equal(payload.terminal, 'Terminal 5', 'Expected MLS status terminal metadata.');
  assert.equal(payload.route, '/api/mls/status', 'Expected MLS status route metadata.');
  assert.ok(typeof payload.generatedAt === 'string', 'Expected MLS status generatedAt metadata.');
  assert.ok(typeof payload.command === 'string' && payload.command.includes('/api/mls/status'), 'Expected MLS status command metadata.');
  assert.ok(payload.command.includes('inspect=overview'), 'Expected MLS status command metadata to preserve query.');
  assert.ok(Array.isArray(payload.queues), 'Expected MLS status queues array.');
  assert.ok(isRecord(payload.commands), 'Expected MLS status commands payload.');
  assert.ok(isRecord(payload.terminals), 'Expected MLS status terminals payload.');
  assert.ok(isRecord(payload.syncDefaults), 'Expected MLS status syncDefaults payload.');
  assert.ok(isRecord(payload.syncLimits), 'Expected MLS status syncLimits payload.');
  assert.ok(isRecord(payload.propertyFreshness), 'Expected MLS status propertyFreshness payload.');
  assert.ok(isRecord(payload.operationalReadiness), 'Expected MLS status operationalReadiness payload.');
  assert.ok(isRecord(payload.searchIndex), 'Expected MLS status searchIndex payload.');
  assert.ok(isRecord(payload.mediaDiagnostics), 'Expected MLS status mediaDiagnostics payload.');
  assert.ok(
    typeof (payload.mediaDiagnostics as JsonRecord).health === 'string',
    'Expected MLS status mediaDiagnostics health metadata.',
  );
  assert.ok(
    typeof (payload.mediaDiagnostics as JsonRecord).extractedMediaCount === 'number',
    'Expected MLS status mediaDiagnostics extracted media count.',
  );
  assert.ok(
    typeof (payload.mediaDiagnostics as JsonRecord).ignoredMediaItemCount === 'number',
    'Expected MLS status mediaDiagnostics ignored media count.',
  );
  assert.ok(Array.isArray(payload.recentFailedJobs), 'Expected MLS status recentFailedJobs array.');
  assert.ok(Array.isArray(payload.recentCompletedJobs), 'Expected MLS status recentCompletedJobs array.');
  assert.equal(isRecord(payload.commands) ? payload.commands.smokeOps : null, 'npm run smoke:ops', 'Expected MLS status smokeOps command.');
  assert.equal(isRecord(payload.commands) ? payload.commands.smokeMlsStatus : null, 'npm run smoke:mls-status', 'Expected MLS status smokeMlsStatus command.');
  assert.equal(isRecord(payload.commands) ? payload.commands.smokeSearch : null, 'npm run smoke:search', 'Expected MLS status smokeSearch command.');
  assert.ok(
    typeof (isRecord(payload.commands) ? payload.commands.rawStatus : null) === 'string' &&
      String((payload.commands as JsonRecord).rawStatus).includes('/api/mls/status'),
    'Expected MLS status rawStatus command.',
  );
  assert.equal(isRecord(payload.terminals) ? payload.terminals.coordinator : null, 'Terminal 3', 'Expected MLS coordinator terminal.');
  assert.equal(isRecord(payload.terminals) ? payload.terminals.scriptsAndCurl : null, 'Terminal 5', 'Expected MLS scripts terminal.');

  let unauthorizedTerminal: unknown = null;

  if (ADMIN_KEY) {
    const unauthorizedResponse = await fetch(`${BASE_URL}${path}`, {
      headers: {
        accept: 'application/json',
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    const unauthorizedPayload = (await unauthorizedResponse.json().catch(() => null)) as unknown;

    assert.equal(unauthorizedResponse.status, 401, 'Expected MLS status without admin key to return HTTP 401.');
    assert.ok(isRecord(unauthorizedPayload), 'Expected MLS status unauthorized response to return JSON.');
    assert.equal(unauthorizedPayload.success, false, 'Expected MLS status unauthorized success=false.');
    assert.equal(unauthorizedPayload.terminal, 'Terminal 5', 'Expected MLS status unauthorized terminal metadata.');
    assert.equal(unauthorizedPayload.route, '/api/mls/status', 'Expected MLS status unauthorized route metadata.');
    assert.ok(typeof unauthorizedPayload.generatedAt === 'string', 'Expected MLS status unauthorized generatedAt metadata.');
    assert.ok(
      typeof unauthorizedPayload.command === 'string' &&
        unauthorizedPayload.command.includes('/api/mls/status') &&
        unauthorizedPayload.command.includes('inspect=overview'),
      'Expected MLS status unauthorized command metadata to preserve query.',
    );
    assert.ok(isRecord(unauthorizedPayload.auth), 'Expected MLS status unauthorized auth metadata.');
    assert.ok(isRecord(unauthorizedPayload.syncDefaults), 'Expected MLS status unauthorized syncDefaults metadata.');
    assert.ok(isRecord(unauthorizedPayload.syncLimits), 'Expected MLS status unauthorized syncLimits metadata.');
    assert.ok(Array.isArray(unauthorizedPayload.diagnostics), 'Expected MLS status unauthorized diagnostics array.');
    assert.ok(Array.isArray(unauthorizedPayload.recommendations), 'Expected MLS status unauthorized recommendations array.');
    assert.ok(Array.isArray(unauthorizedPayload.queues), 'Expected MLS status unauthorized fallback queues.');
    assert.ok(isRecord(unauthorizedPayload.commands), 'Expected MLS status unauthorized commands metadata.');
    assert.ok(isRecord(unauthorizedPayload.terminals), 'Expected MLS status unauthorized terminals metadata.');
    assert.ok(isRecord(unauthorizedPayload.propertyFreshness), 'Expected MLS status unauthorized propertyFreshness metadata.');
    assert.ok(isRecord(unauthorizedPayload.operationalReadiness), 'Expected MLS status unauthorized operationalReadiness metadata.');
    assert.ok(isRecord(unauthorizedPayload.searchIndex), 'Expected MLS status unauthorized searchIndex metadata.');
    assert.ok(isRecord(unauthorizedPayload.mediaDiagnostics), 'Expected MLS status unauthorized mediaDiagnostics metadata.');
    assert.ok(Array.isArray(unauthorizedPayload.recentFailedJobs), 'Expected MLS status unauthorized recentFailedJobs array.');
    assert.ok(Array.isArray(unauthorizedPayload.recentCompletedJobs), 'Expected MLS status unauthorized recentCompletedJobs array.');
    assert.equal(isRecord(unauthorizedPayload.terminals) ? unauthorizedPayload.terminals.scriptsAndCurl : null, 'Terminal 5', 'Expected MLS status unauthorized scripts terminal.');
    assert.equal(isRecord(unauthorizedPayload.commands) ? unauthorizedPayload.commands.smokeOps : null, 'npm run smoke:ops', 'Expected MLS status unauthorized smokeOps command.');

    unauthorizedTerminal = unauthorizedPayload.terminal;
  }

  return {
    path,
    status: payload.status,
    terminal: payload.terminal,
    readiness: isRecord(payload.operationalReadiness) ? payload.operationalReadiness.level : null,
    queues: Array.isArray(payload.queues) ? payload.queues.length : null,
    searchIndexHealth: isRecord(payload.searchIndex) ? payload.searchIndex.health : null,
    mediaDiagnosticsHealth: isRecord(payload.mediaDiagnostics) ? payload.mediaDiagnostics.health : null,
    mediaDiagnosticsJobs: isRecord(payload.mediaDiagnostics) ? payload.mediaDiagnostics.jobsWithMediaDiagnostics : null,
    unauthorizedTerminal,
  };
}

async function assertMlsSyncRouteDryRun() {
  const path =
    '/api/mls/sync?dryRun=true&force=true&maxPages=999&pageSize=999&startPage=-5&rateDelayMs=999999&pageTimeoutMs=999999&includeMedia=true';
  const payload = await fetchJson(path, { method: 'POST' });

  assert.equal(payload.success, true, 'Expected MLS sync dry-run success=true.');
  assert.equal(payload.dryRun, true, 'Expected MLS sync route to stay in dry-run mode.');
  assert.equal(payload.force, true, 'Expected MLS sync route to preserve force flag in dry-run response.');
  assert.equal(payload.route, '/api/mls/sync', 'Expected MLS sync route metadata.');
  assert.equal(payload.queue, 'mls-sync', 'Expected MLS sync route queue name.');
  assert.ok(isRecord(payload.job), 'Expected MLS sync route dry-run job metadata.');
  assert.ok(isRecord((payload.job as JsonRecord).data), 'Expected MLS sync route dry-run job data.');
  assert.ok(isRecord(payload.status), 'Expected MLS sync route dry-run queue status.');
  assert.ok(isRecord(payload.commands), 'Expected MLS sync route dry-run commands.');
  assert.ok(isRecord(payload.terminals), 'Expected MLS sync route dry-run terminal map.');
  assert.ok(isRecord(payload.expectedJobResultMetrics), 'Expected MLS sync route expected job result metrics.');
  assert.ok(isRecord(payload.mediaDiagnosticsInspection), 'Expected MLS sync route media diagnostics inspection handoff.');
  assert.equal((payload.job as JsonRecord).name, 'sync', 'Expected MLS sync route dry-run job name.');

  const expectedJobResultMetrics = payload.expectedJobResultMetrics as JsonRecord;
  assert.ok(
    Array.isArray(expectedJobResultMetrics.media),
    'Expected MLS sync route dry-run media job result metric hints.',
  );
  assert.ok(
    (expectedJobResultMetrics.media as unknown[]).includes('mediaDiagnostics.listingsWithMedia'),
    'Expected MLS sync route dry-run listings-with-media metric hint.',
  );
  assert.ok(
    (expectedJobResultMetrics.media as unknown[]).includes('mediaDiagnostics.extractedMediaCount'),
    'Expected MLS sync route dry-run extracted-media metric hint.',
  );
  assert.ok(
    (expectedJobResultMetrics.media as unknown[]).includes('mediaDiagnostics.ignoredMediaItemCount'),
    'Expected MLS sync route dry-run ignored-media metric hint.',
  );
  assert.ok(
    typeof expectedJobResultMetrics.interpretation === 'string' &&
      expectedJobResultMetrics.interpretation.includes('mediaDiagnostics'),
    'Expected MLS sync route dry-run media diagnostics interpretation.',
  );

  const mediaDiagnosticsInspection = payload.mediaDiagnosticsInspection as JsonRecord;
  assert.equal(
    mediaDiagnosticsInspection.statusRoute,
    '/api/mls/status',
    'Expected MLS sync media diagnostics inspection status route.',
  );
  assert.equal(
    mediaDiagnosticsInspection.adminPanelSection,
    'MLS Media Diagnostics',
    'Expected MLS sync media diagnostics inspection admin panel section.',
  );
  assert.equal(
    mediaDiagnosticsInspection.includeMediaRequested,
    true,
    'Expected MLS sync media diagnostics inspection to preserve includeMedia request state.',
  );
  assert.ok(
    Array.isArray(mediaDiagnosticsInspection.requiredStatusFields) &&
      mediaDiagnosticsInspection.requiredStatusFields.includes('mediaDiagnostics.extractedMediaCount'),
    'Expected MLS sync media diagnostics inspection required status fields.',
  );
  assert.ok(
    typeof mediaDiagnosticsInspection.liveVolumeGuidance === 'string' &&
      mediaDiagnosticsInspection.liveVolumeGuidance.includes('includes media'),
    'Expected MLS sync media diagnostics inspection live volume guidance.',
  );

  const data = (payload.job as JsonRecord).data as JsonRecord;

  assert.equal(data.source, 'api', 'Expected MLS sync route dry-run source.');
  assert.equal(data.requestedBy, 'api', 'Expected MLS sync route dry-run requestedBy fallback.');
  assert.equal(data.maxPages, 100, 'Expected MLS sync route dry-run maxPages clamp.');
  assert.equal(data.pageSize, 100, 'Expected MLS sync route dry-run pageSize clamp.');
  assert.equal(data.startPage, 0, 'Expected MLS sync route dry-run startPage clamp.');
  assert.equal(data.rateDelayMs, 60000, 'Expected MLS sync route dry-run rateDelay clamp.');
  assert.equal(data.pageTimeoutMs, 120000, 'Expected MLS sync route dry-run page timeout clamp.');
  assert.equal(data.includeMedia, true, 'Expected MLS sync route dry-run includeMedia flag.');
  assert.ok(
    typeof payload.liveEnqueueHint === 'string' && payload.liveEnqueueHint.includes('/api/mls/sync?execute=true'),
    'Expected MLS sync route live enqueue hint.',
  );
  assert.ok(
    typeof ((payload.commands as JsonRecord).dryRunSync) === 'string' &&
      String((payload.commands as JsonRecord).dryRunSync).includes('dryRun=true'),
    'Expected MLS sync route dry-run command.',
  );
  assert.ok(
    typeof ((payload.commands as JsonRecord).liveSync) === 'string' &&
      String((payload.commands as JsonRecord).liveSync).includes('execute=true'),
    'Expected MLS sync route live command.',
  );

  return {
    path,
    dryRun: payload.dryRun,
    force: payload.force,
    queue: payload.queue,
    jobName: (payload.job as JsonRecord).name,
    maxPages: data.maxPages,
    pageSize: data.pageSize,
    startPage: data.startPage,
    rateDelayMs: data.rateDelayMs,
    pageTimeoutMs: data.pageTimeoutMs,
    includeMedia: data.includeMedia,
    statusHealth: isRecord(payload.status) ? payload.status.health : null,
    mediaInspectionStatusRoute: mediaDiagnosticsInspection.statusRoute,
    mediaInspectionIncludeMedia: mediaDiagnosticsInspection.includeMediaRequested,
  };
}

async function assertSearch() {
  const path = '/api/search?limit=5';
  const payload = await fetchJson(path);

  assert.ok(Array.isArray(payload.results), 'Expected search results array.');
  assert.ok(payload.results.length > 0, 'Expected at least one public search result.');
  assert.equal(payload.accessLevel, 'public', 'Expected public search access level.');
  assert.equal(payload.module, 'REIE Public Search', 'Expected search module metadata.');
  assert.equal(payload.terminal, 'Terminal 5', 'Expected search terminal metadata.');
  assert.equal(payload.route, '/api/search', 'Expected search route metadata.');
  assert.ok(typeof payload.generatedAt === 'string', 'Expected search generatedAt metadata.');
  assert.ok(typeof payload.command === 'string' && payload.command.includes('/api/search') && payload.command.includes('limit=5'), 'Expected search command metadata to preserve query.');
  assert.ok(isRecord(payload.meta), 'Expected search meta payload.');
  assert.equal(payload.source, isRecord(payload.meta) ? payload.meta.source : null, 'Expected search top-level source to match meta source.');
  assert.equal(payload.health, isRecord(payload.meta) ? payload.meta.health : null, 'Expected search top-level health to match meta health.');
  assert.equal(payload.boundsApplied, isRecord(payload.meta) ? payload.meta.boundsApplied : null, 'Expected search top-level boundsApplied to match meta.');
  assert.deepEqual(payload.filtersApplied, isRecord(payload.meta) ? payload.meta.filtersApplied : null, 'Expected search top-level filtersApplied to match meta.');
  assert.equal(payload.durationMs, isRecord(payload.meta) ? payload.meta.durationMs : null, 'Expected search top-level durationMs to match meta.');
  assert.equal(payload.returned, isRecord(payload.meta) ? payload.meta.returned : null, 'Expected search top-level returned to match meta.');
  assert.equal(payload.mapped, isRecord(payload.meta) ? payload.meta.mapped : null, 'Expected search top-level mapped to match meta.');
  assert.equal(payload.coordinateFiltered, isRecord(payload.meta) ? payload.meta.coordinateFiltered : null, 'Expected search top-level coordinateFiltered to match meta.');
  assert.ok(isRecord((payload.meta as JsonRecord).smoke), 'Expected search smoke metadata.');
  assert.equal(((payload.meta as JsonRecord).smoke as JsonRecord).terminal, 'Terminal 5', 'Expected search smoke terminal metadata.');
  assert.equal(((payload.meta as JsonRecord).smoke as JsonRecord).command, 'npm run smoke:search', 'Expected search smoke command metadata.');
  assert.ok(isRecord(((payload.meta as JsonRecord).smoke as JsonRecord).checks), 'Expected search smoke checks metadata.');

  return {
    path,
    returned: payload.results.length,
    source: payload.source,
    health: payload.health,
    terminal: payload.terminal,
    smokeReady: isRecord((payload.meta as JsonRecord).smoke) ? ((payload.meta as JsonRecord).smoke as JsonRecord).ready : null,
  };
}

function assertMlsPhotoDiagnostics() {
  const result = normalizePhotoRecordsWithDiagnostics('smoke-property', [
    {
      MediaURL: 'https://media.example.test/front.jpg',
      MediaType: 'image/jpeg',
      Order: 2,
    },
    {
      MediaURL: 'https://media.example.test/front.jpg',
      MediaType: 'image/jpeg',
      Order: 3,
    },
    {
      MediaURL: 'https://media.example.test/floorplan.pdf',
      MediaType: 'application/pdf',
      Order: 4,
    },
    {
      MediaURL: 'not-a-url',
      MediaType: 'image/jpeg',
      Order: 5,
    },
    'https://media.example.test/disclosure.pdf',
    {
      MediaURL: 'https://media.example.test/floorplan.pdf',
      MediaType: 'application/pdf',
      MediaCategory: 'Property',
      Order: 6,
    },
    {
      Media: [
        {
          MediaURL: '//media.example.test/kitchen.webp',
          MediaType: 'image/webp',
          Order: 1,
        },
      ],
    },
  ]);

  assert.equal(result.records.length, 2, 'Expected MLS photo normalization to keep two usable photos.');
  assert.equal(result.records[0].url, 'https://media.example.test/kitchen.webp', 'Expected MLS photo normalization to preserve media order.');
  assert.equal(result.diagnostics.inputCount, 7, 'Expected MLS photo diagnostics input count.');
  assert.equal(result.diagnostics.flattenedCount, 7, 'Expected MLS photo diagnostics flattened count.');
  assert.equal(result.diagnostics.validCount, 2, 'Expected MLS photo diagnostics valid count.');
  assert.equal(result.diagnostics.duplicateCount, 1, 'Expected MLS photo diagnostics duplicate count.');
  assert.equal(result.diagnostics.invalidUrlCount, 1, 'Expected MLS photo diagnostics invalid URL count.');
  assert.equal(result.diagnostics.nonImageCount, 3, 'Expected MLS photo diagnostics non-image count.');
  assert.equal(result.diagnostics.preservedExisting, false, 'Expected MLS photo diagnostics to mark replacement when valid photos exist.');
  assert.equal(result.diagnostics.replacedExisting, true, 'Expected MLS photo diagnostics to mark replacement when valid photos exist.');

  return {
    inputCount: result.diagnostics.inputCount,
    validCount: result.diagnostics.validCount,
    duplicateCount: result.diagnostics.duplicateCount,
    invalidUrlCount: result.diagnostics.invalidUrlCount,
    nonImageCount: result.diagnostics.nonImageCount,
  };
}

function assertMlsListingMediaDiagnostics() {
  const listing = {
    ListingId: 'MEDIA-SMOKE-1',
    Media: [
      {
        MediaURL: 'https://media.example.test/front.jpg',
        MediaType: 'image/jpeg',
        Order: 2,
      },
      {
        MediaURL: 'https://media.example.test/disclosure.pdf',
        MediaType: 'application/pdf',
        Order: 3,
      },
      null,
    ],
    Photos: {
      Media: [
        {
          MediaURL: '//media.example.test/kitchen.webp',
          MediaType: 'image/webp',
          Order: 1,
        },
      ],
    },
    PrimaryPhotoURL: 'https://media.example.test/primary.jpg',
    LargePhotoURL: 'https://media.example.test/floorplan.pdf',
  };
  const media = getListingMediaPayload(listing);
  const diagnostics = getListingMediaDiagnostics(listing);
  const normalized = normalizePhotoRecordsWithDiagnostics('smoke-listing-media', media);

  assert.equal(diagnostics.module, 'MLS Listing Media', 'Expected MLS listing media diagnostics module metadata.');
  assert.equal(diagnostics.terminal, 'Terminal 5', 'Expected MLS listing media diagnostics Terminal 5 metadata.');
  assert.equal(diagnostics.nextCommand, 'npm run smoke:ops', 'Expected MLS listing media diagnostics next command.');
  assert.equal(diagnostics.extractedCount, 5, 'Expected MLS listing media diagnostics extracted count.');
  assert.deepEqual(diagnostics.directMediaArrayFields, ['Media'], 'Expected MLS listing media diagnostics direct media field.');
  assert.deepEqual(diagnostics.nestedMediaArrayFields, ['Photos.Media'], 'Expected MLS listing media diagnostics nested media field.');
  assert.deepEqual(
    diagnostics.topLevelPhotoFields,
    ['PrimaryPhotoURL', 'LargePhotoURL'],
    'Expected MLS listing media diagnostics top-level photo fields.',
  );
  assert.equal(diagnostics.stringMediaCount, 0, 'Expected MLS listing media diagnostics string media count.');
  assert.equal(diagnostics.recordMediaCount, 5, 'Expected MLS listing media diagnostics record media count.');
  assert.equal(diagnostics.ignoredMediaItemCount, 1, 'Expected MLS listing media diagnostics ignored media item count.');
  assert.equal(diagnostics.hasMediaPayload, true, 'Expected MLS listing media diagnostics payload flag.');
  assert.equal(diagnostics.hasNestedMediaPayload, true, 'Expected MLS listing media diagnostics nested payload flag.');
  assert.equal(diagnostics.hasTopLevelPhotoPayload, true, 'Expected MLS listing media diagnostics top-level payload flag.');
  assert.equal(normalized.records.length, 3, 'Expected MLS listing media normalization to keep three usable photos.');
  assert.equal(normalized.diagnostics.nonImageCount, 2, 'Expected MLS listing media normalization to reject two non-image URLs.');
  assert.equal(
    normalized.records.some((record) => record.url.endsWith('floorplan.pdf')),
    false,
    'Expected top-level floorplan PDF URL to be rejected instead of forced to image media.',
  );

  return {
    extractedCount: diagnostics.extractedCount,
    directMediaArrayFields: diagnostics.directMediaArrayFields,
    nestedMediaArrayFields: diagnostics.nestedMediaArrayFields,
    topLevelPhotoFields: diagnostics.topLevelPhotoFields,
    ignoredMediaItemCount: diagnostics.ignoredMediaItemCount,
    validPhotoCount: normalized.records.length,
    nonImageCount: normalized.diagnostics.nonImageCount,
  };
}

function assertMlsPageFetchDiagnostics() {
  const diagnostics = getFetchMLSPageDiagnostics({
    page: -4,
    top: 10_000,
    includeMedia: false,
    timeoutMs: 999_999,
  });

  assert.equal(diagnostics.page, 0, 'Expected MLS page diagnostics to clamp negative page.');
  assert.equal(diagnostics.skip, 0, 'Expected MLS page diagnostics skip to reflect clamped page.');
  assert.ok(diagnostics.top < 10_000, 'Expected MLS page diagnostics to bound oversized page size.');
  assert.ok(diagnostics.timeoutMs < 999_999, 'Expected MLS page diagnostics to bound oversized timeout.');
  assert.equal(diagnostics.includeMedia, false, 'Expected MLS page diagnostics to preserve disabled media expansion.');
  assert.equal(diagnostics.mediaExpansion, 'disabled', 'Expected MLS page diagnostics disabled media expansion state.');
  assert.equal(diagnostics.bounded.page, true, 'Expected MLS page diagnostics page bounded flag.');
  assert.equal(diagnostics.bounded.top, true, 'Expected MLS page diagnostics top bounded flag.');
  assert.equal(diagnostics.bounded.timeoutMs, true, 'Expected MLS page diagnostics timeout bounded flag.');

  return {
    page: diagnostics.page,
    top: diagnostics.top,
    skip: diagnostics.skip,
    timeoutMs: diagnostics.timeoutMs,
    mediaExpansion: diagnostics.mediaExpansion,
  };
}

function assertMlsSyncPlan() {
  const plan = getSyncMLSGridPlan(
    {
      maxRuntimeMs: 999_999_999,
      rateDelayMs: 999_999,
      pageSize: 10_000,
      maxPages: 10_000,
      startPage: -12,
      includeMedia: true,
      pageTimeoutMs: 999_999,
    },
    7,
  );

  assert.equal(plan.terminal, 'Terminal 5', 'Expected MLS sync plan Terminal 5 metadata.');
  assert.equal(plan.module, 'MLS Grid Sync', 'Expected MLS sync plan module metadata.');
  assert.equal(plan.initialPage, 0, 'Expected MLS sync plan to clamp negative start page.');
  assert.equal(plan.startPage, 0, 'Expected MLS sync plan startPage to reflect initial page.');
  assert.equal(plan.includeMedia, true, 'Expected MLS sync plan to preserve includeMedia=true.');
  assert.equal(plan.maxRuntimeMs, plan.limits.maxMaxRuntimeMs, 'Expected MLS sync plan to clamp oversized runtime.');
  assert.equal(plan.rateDelayMs, plan.limits.maxRateDelayMs, 'Expected MLS sync plan to clamp oversized rate delay.');
  assert.equal(plan.pageSize, plan.limits.maxPageSize, 'Expected MLS sync plan to clamp oversized page size.');
  assert.equal(plan.maxPages, plan.limits.maxMaxPages, 'Expected MLS sync plan to clamp oversized max pages.');
  assert.equal(plan.pageTimeoutMs, plan.limits.maxPageTimeoutMs, 'Expected MLS sync plan to clamp oversized page timeout.');
  assert.equal(plan.bounded.maxRuntimeMs, true, 'Expected MLS sync plan runtime bounded flag.');
  assert.equal(plan.bounded.rateDelayMs, true, 'Expected MLS sync plan rate delay bounded flag.');
  assert.equal(plan.bounded.pageSize, true, 'Expected MLS sync plan page size bounded flag.');
  assert.equal(plan.bounded.maxPages, true, 'Expected MLS sync plan max pages bounded flag.');
  assert.equal(plan.bounded.pageTimeoutMs, true, 'Expected MLS sync plan page timeout bounded flag.');
  assert.equal(plan.bounded.startPage, true, 'Expected MLS sync plan start page bounded flag.');
  assert.ok(plan.dryRunCommand.includes('run:mls-sync:dry'), 'Expected MLS sync plan dry-run command.');
  assert.ok(plan.liveCommand.includes('run:mls-sync:live'), 'Expected MLS sync plan live command.');
  assert.ok(plan.statusCommand.includes('/api/mls/status'), 'Expected MLS sync plan status command.');

  return {
    initialPage: plan.initialPage,
    pageSize: plan.pageSize,
    maxPages: plan.maxPages,
    pageTimeoutMs: plan.pageTimeoutMs,
    includeMedia: plan.includeMedia,
    bounded: plan.bounded,
  };
}

function assertMlsUpsertDiagnostics() {
  const listingDiagnostics = getUpsertListingDiagnostics({
    ListingKey: 'SMOKE-123',
    UnparsedAddress: '123 Boulder View Rd',
    City: 'Boulder',
    StateOrProvince: 'co',
    PostalCode: '80302',
    Latitude: 40.02,
    Longitude: -105.27,
    ListPrice: '$1,250,000',
    BedroomsTotal: '4',
    BathroomsFull: 2,
    BathroomsHalf: 1,
    LivingArea: '2,850',
    YearBuilt: 1972,
    PropertyType: 'Residential',
    StandardStatus: 'Active',
    PublicRemarks:
      'Updated custom home with solar, heat pump, standing seam metal roof, 200 amp service, expansive soil review, and polybutylene piping disclosure.',
  });

  assert.equal(listingDiagnostics.canUpsert, true, 'Expected MLS upsert diagnostics to allow usable listing.');
  assert.equal(listingDiagnostics.mlsId, 'SMOKE-123', 'Expected MLS upsert diagnostics MLS ID.');
  assert.equal(listingDiagnostics.city, 'Boulder', 'Expected MLS upsert diagnostics city.');
  assert.equal(listingDiagnostics.state, 'CO', 'Expected MLS upsert diagnostics normalized state.');
  assert.equal(listingDiagnostics.coordinatesSource, 'listing', 'Expected MLS upsert diagnostics listing coordinate source.');
  assert.equal(listingDiagnostics.hasUsableCoordinates, true, 'Expected MLS upsert diagnostics usable coordinates.');
  assert.equal(listingDiagnostics.price, 1250000, 'Expected MLS upsert diagnostics normalized price.');
  assert.equal(listingDiagnostics.baths, 2.5, 'Expected MLS upsert diagnostics calculated baths.');
  assert.equal(listingDiagnostics.sqft, 2850, 'Expected MLS upsert diagnostics normalized sqft.');
  assert.ok((listingDiagnostics.slug || '').includes('smoke-123'), 'Expected MLS upsert diagnostics slug to include MLS ID.');
  assert.equal(listingDiagnostics.intelligence.hasPolybutyleneRisk, true, 'Expected MLS upsert diagnostics polybutylene risk.');
  assert.equal(listingDiagnostics.intelligence.gcForensics.roofType, 'Standing-Seam Metal', 'Expected MLS upsert diagnostics roof type.');
  assert.equal(listingDiagnostics.intelligence.gcForensics.hvacType, 'Heat Pump', 'Expected MLS upsert diagnostics HVAC type.');
  assert.equal(listingDiagnostics.intelligence.gcForensics.electricalAmperage, 200, 'Expected MLS upsert diagnostics amperage.');
  assert.equal(listingDiagnostics.intelligence.soilType, 'Expansive/Bentonite Risk', 'Expected MLS upsert diagnostics soil type.');

  const swappedDiagnostics = getUpsertListingDiagnostics({
    ListingKey: 'SMOKE-SWAP',
    Latitude: -105.27,
    Longitude: 40.02,
  });

  assert.equal(swappedDiagnostics.coordinatesSource, 'swapped', 'Expected MLS upsert diagnostics to detect swapped coordinates.');
  assert.equal(swappedDiagnostics.swappedCoordinates, true, 'Expected MLS upsert diagnostics swapped flag.');

  const existingDiagnostics = getUpsertListingDiagnostics(
    {
      ListingKey: 'SMOKE-EXISTING',
      Latitude: 0,
      Longitude: 0,
    },
    {
      id: 'property-existing',
      lat: 39.75,
      lng: -104.99,
      slug: 'existing-property',
    },
  );

  assert.equal(existingDiagnostics.coordinatesSource, 'existing', 'Expected MLS upsert diagnostics to use existing coordinates.');
  assert.equal(existingDiagnostics.usedExistingCoordinates, true, 'Expected MLS upsert diagnostics existing coordinate flag.');
  assert.equal(existingDiagnostics.slug, 'existing-property', 'Expected MLS upsert diagnostics to preserve existing slug.');

  const missingIdDiagnostics = getUpsertListingDiagnostics({
    Latitude: 40.02,
    Longitude: -105.27,
  });

  assert.equal(missingIdDiagnostics.canUpsert, false, 'Expected MLS upsert diagnostics to block missing MLS ID.');
  assert.equal(missingIdDiagnostics.skipReason, 'missing_mls_id', 'Expected MLS upsert diagnostics missing MLS ID reason.');

  const missingCoordinatesDiagnostics = getUpsertListingDiagnostics({
    ListingKey: 'SMOKE-NO-COORDS',
  });

  assert.equal(missingCoordinatesDiagnostics.canUpsert, false, 'Expected MLS upsert diagnostics to block missing coordinates.');
  assert.equal(missingCoordinatesDiagnostics.skipReason, 'missing_coordinates', 'Expected MLS upsert diagnostics missing coordinates reason.');

  return {
    canUpsert: listingDiagnostics.canUpsert,
    coordinatesSource: listingDiagnostics.coordinatesSource,
    swappedCoordinatesSource: swappedDiagnostics.coordinatesSource,
    existingCoordinatesSource: existingDiagnostics.coordinatesSource,
    missingIdReason: missingIdDiagnostics.skipReason,
    missingCoordinatesReason: missingCoordinatesDiagnostics.skipReason,
    efficiencyScore: listingDiagnostics.intelligence.efficiencyScore,
    resilienceScore: listingDiagnostics.intelligence.resilienceScore,
    hasPolybutyleneRisk: listingDiagnostics.intelligence.hasPolybutyleneRisk,
  };
}

function assertSearchIndexDiagnostics() {
  const diagnostics = getSearchIndexDiagnostics({
    id: 'property-smoke-1',
    mlsId: 'SMOKE-IDX-1',
    address: '456 Search Index Ave',
    city: 'Denver',
    state: 'CO',
    price: '$950,000',
    status: 'Active',
    neighborhood: 'Central',
    isPrivateExclusive: 'false',
    efficiencyScore: 140,
    resilienceScore: -20,
    hasPolybutyleneRisk: 'yes',
    gcForensics: {
      roofType: 'Metal',
      soilType: 'Front Range Mixed',
      altitude: 5280,
    },
  });

  assert.equal(diagnostics.canIndex, true, 'Expected search index diagnostics canIndex=true.');
  assert.equal(diagnostics.module, 'MLS Search Index', 'Expected search index diagnostics module metadata.');
  assert.equal(diagnostics.terminal, 'Terminal 5', 'Expected search index diagnostics Terminal 5 metadata.');
  assert.equal(diagnostics.documentId, 'property-smoke-1', 'Expected search index diagnostics document ID.');
  assert.equal(diagnostics.collections.properties, 'properties', 'Expected search index diagnostics properties collection.');
  assert.equal(diagnostics.collections.listings, 'listings', 'Expected search index diagnostics listings collection.');
  assert.deepEqual(diagnostics.missingRequiredFields, [], 'Expected search index diagnostics to have no missing required fields.');
  assert.ok(Array.isArray(diagnostics.requiredFields) && diagnostics.requiredFields.includes('id'), 'Expected search index required field metadata.');
  assert.ok(diagnostics.document, 'Expected search index diagnostics document summary.');
  assert.equal(diagnostics.document?.price, 950000, 'Expected search index diagnostics normalized price.');
  assert.equal(diagnostics.document?.efficiencyScore, 100, 'Expected search index diagnostics to clamp high efficiency score.');
  assert.equal(diagnostics.document?.resilienceScore, 0, 'Expected search index diagnostics to clamp low resilience score.');
  assert.equal(diagnostics.document?.hasPolybutyleneRisk, true, 'Expected search index diagnostics boolean normalization.');
  assert.equal(diagnostics.commands.schemaCheck, 'npm run typesense:collections:check', 'Expected search index diagnostics schema check command.');
  assert.equal(diagnostics.commands.schemaRepair, 'npm run typesense:init', 'Expected search index diagnostics schema repair command.');
  assert.equal(diagnostics.commands.reindex, 'npm run typesense:reindex', 'Expected search index diagnostics reindex command.');
  assert.equal(diagnostics.commands.searchSmoke, 'npm run smoke:search', 'Expected search index diagnostics search smoke command.');

  const missingDiagnostics = getSearchIndexDiagnostics(null);

  assert.equal(missingDiagnostics.canIndex, false, 'Expected search index diagnostics to block missing listing.');
  assert.equal(missingDiagnostics.sourceId, 'unknown', 'Expected search index diagnostics missing listing source ID.');
  assert.ok(
    typeof missingDiagnostics.error === 'string' && missingDiagnostics.error.includes('No listing'),
    'Expected search index diagnostics missing listing error.',
  );

  const missingIdDiagnostics = getSearchIndexDiagnostics({
    address: 'No ID Ln',
  });

  assert.equal(missingIdDiagnostics.canIndex, false, 'Expected search index diagnostics to block missing id.');
  assert.ok(
    typeof missingIdDiagnostics.error === 'string' && missingIdDiagnostics.error.includes('id or MLS id'),
    'Expected search index diagnostics missing ID error.',
  );

  return {
    canIndex: diagnostics.canIndex,
    documentId: diagnostics.documentId,
    collections: diagnostics.collections,
    requiredFields: diagnostics.requiredFields.length,
    missingRequiredFields: diagnostics.missingRequiredFields,
    normalizedPrice: diagnostics.document?.price,
    efficiencyScore: diagnostics.document?.efficiencyScore,
    resilienceScore: diagnostics.document?.resilienceScore,
    missingListingCanIndex: missingDiagnostics.canIndex,
    missingIdCanIndex: missingIdDiagnostics.canIndex,
  };
}

function assertMlsBatchPlan() {
  const plan = getBatchProcessPlan(250, {
    maxListings: 10_000,
    maxFailures: 10_000,
  });

  assert.equal(plan.module, 'MLS Batch Processor', 'Expected MLS batch plan module metadata.');
  assert.equal(plan.terminal, 'Terminal 2', 'Expected MLS batch plan Terminal 2 metadata.');
  assert.equal(plan.inputCount, 250, 'Expected MLS batch plan input count.');
  assert.equal(plan.maxListings, plan.limits.maxMaxListings, 'Expected MLS batch plan to clamp oversized max listings.');
  assert.equal(plan.maxFailures, plan.limits.maxMaxFailures, 'Expected MLS batch plan to clamp oversized max failures.');
  assert.equal(plan.willProcess, 100, 'Expected MLS batch plan bounded process count.');
  assert.equal(plan.willSkip, 150, 'Expected MLS batch plan skipped count.');
  assert.equal(plan.bounded.maxListings, true, 'Expected MLS batch plan maxListings bounded flag.');
  assert.equal(plan.bounded.maxFailures, true, 'Expected MLS batch plan maxFailures bounded flag.');
  assert.ok(plan.commands.startWorker.includes('run:worker:mls-page'), 'Expected MLS batch plan worker command.');
  assert.ok(plan.commands.oneShotWorker.includes('run:worker:mls-page:once'), 'Expected MLS batch plan one-shot command.');
  assert.ok(plan.commands.queueDashboard.includes('run:queue-dashboard'), 'Expected MLS batch plan queue dashboard command.');
  assert.ok(plan.commands.retryStatus.includes('/api/mls/retry?queue=mls-page'), 'Expected MLS batch plan retry status command.');

  const lowPlan = getBatchProcessPlan(-5, {
    maxListings: -1,
    maxFailures: -1,
  });

  assert.equal(lowPlan.inputCount, 0, 'Expected MLS batch plan to clamp negative input count.');
  assert.equal(lowPlan.maxListings, lowPlan.limits.minMaxListings, 'Expected MLS batch plan to clamp low max listings.');
  assert.equal(lowPlan.maxFailures, lowPlan.limits.minMaxFailures, 'Expected MLS batch plan to clamp low max failures.');
  assert.equal(lowPlan.willProcess, 0, 'Expected MLS batch plan low process count.');
  assert.equal(lowPlan.willSkip, 0, 'Expected MLS batch plan low skipped count.');

  return {
    inputCount: plan.inputCount,
    maxListings: plan.maxListings,
    maxFailures: plan.maxFailures,
    willProcess: plan.willProcess,
    willSkip: plan.willSkip,
    bounded: plan.bounded,
    lowMaxListings: lowPlan.maxListings,
    lowMaxFailures: lowPlan.maxFailures,
  };
}

function assertMlsBatchMediaDiagnostics() {
  const directAndNested = getListingMediaDiagnostics({
    ListingId: 'BATCH-MEDIA-1',
    Media: [
      {
        MediaURL: 'https://media.example.test/front.jpg',
        MediaType: 'image/jpeg',
      },
      null,
    ],
    Photos: {
      Media: [
        {
          MediaURL: 'https://media.example.test/kitchen.webp',
          MediaType: 'image/webp',
        },
      ],
    },
  });
  const topLevelOnly = getListingMediaDiagnostics({
    ListingId: 'BATCH-MEDIA-2',
    PrimaryPhotoURL: 'https://media.example.test/primary.jpg',
    LargePhotoURL: 'https://media.example.test/floorplan.pdf',
  });
  const noMedia = getListingMediaDiagnostics({
    ListingId: 'BATCH-MEDIA-3',
  });
  const diagnostics = summarizeBatchMediaDiagnostics([directAndNested, topLevelOnly, noMedia]);

  assert.equal(diagnostics.module, 'MLS Batch Media', 'Expected MLS batch media diagnostics module metadata.');
  assert.equal(diagnostics.terminal, 'Terminal 5', 'Expected MLS batch media diagnostics Terminal 5 metadata.');
  assert.equal(diagnostics.nextCommand, 'npm run smoke:ops', 'Expected MLS batch media diagnostics next command.');
  assert.equal(diagnostics.listingCount, 3, 'Expected MLS batch media diagnostics listing count.');
  assert.equal(diagnostics.listingsWithMedia, 2, 'Expected MLS batch media diagnostics media listing count.');
  assert.equal(diagnostics.listingsWithDirectMedia, 1, 'Expected MLS batch media diagnostics direct media listing count.');
  assert.equal(diagnostics.listingsWithNestedMedia, 1, 'Expected MLS batch media diagnostics nested media listing count.');
  assert.equal(diagnostics.listingsWithTopLevelPhotos, 1, 'Expected MLS batch media diagnostics top-level listing count.');
  assert.equal(diagnostics.extractedMediaCount, 4, 'Expected MLS batch media diagnostics extracted media count.');
  assert.equal(diagnostics.ignoredMediaItemCount, 1, 'Expected MLS batch media diagnostics ignored media count.');
  assert.equal(diagnostics.directMediaArrayFieldCounts.Media, 1, 'Expected MLS batch media diagnostics direct Media field count.');
  assert.equal(diagnostics.nestedMediaArrayFieldCounts['Photos.Media'], 1, 'Expected MLS batch media diagnostics nested Media field count.');
  assert.equal(
    diagnostics.topLevelPhotoFieldCounts.PrimaryPhotoURL,
    1,
    'Expected MLS batch media diagnostics PrimaryPhotoURL count.',
  );
  assert.equal(
    diagnostics.topLevelPhotoFieldCounts.LargePhotoURL,
    1,
    'Expected MLS batch media diagnostics LargePhotoURL count.',
  );

  return diagnostics;
}

function assertMlsGridRequestDiagnostics() {
  const diagnostics = getMlsGridRequestDiagnostics({
    skip: -50,
    top: 10_000,
    lastSync: 'not-a-date',
    includeMedia: false,
    timeoutMs: 999_999,
  });

  assert.equal(diagnostics.skip, 0, 'Expected MLS Grid request diagnostics to clamp negative skip.');
  assert.equal(diagnostics.top, diagnostics.limits.maxTop, 'Expected MLS Grid request diagnostics to clamp oversized top.');
  assert.equal(diagnostics.lastSync, '2000-01-01T00:00:00.000Z', 'Expected MLS Grid request diagnostics fallback lastSync.');
  assert.equal(diagnostics.includeMedia, false, 'Expected MLS Grid request diagnostics to preserve disabled media.');
  assert.equal(diagnostics.mediaExpansion, 'disabled', 'Expected MLS Grid request diagnostics disabled media expansion.');
  assert.equal(diagnostics.timeoutMs, diagnostics.limits.maxTimeoutMs, 'Expected MLS Grid request diagnostics to clamp oversized timeout.');
  assert.equal(diagnostics.requestPath, '/Property', 'Expected MLS Grid request diagnostics request path.');
  assert.equal(diagnostics.query.$top, diagnostics.top, 'Expected MLS Grid request diagnostics query top.');
  assert.equal(diagnostics.query.$skip, diagnostics.skip, 'Expected MLS Grid request diagnostics query skip.');
  assert.equal(diagnostics.query.$filter, `ModificationTimestamp gt ${diagnostics.lastSync}`, 'Expected MLS Grid request diagnostics filter.');
  assert.equal('$expand' in diagnostics.query, false, 'Expected MLS Grid request diagnostics to omit Media expansion when disabled.');
  assert.equal(diagnostics.bounded.skip, true, 'Expected MLS Grid request diagnostics skip bounded flag.');
  assert.equal(diagnostics.bounded.top, true, 'Expected MLS Grid request diagnostics top bounded flag.');
  assert.equal(diagnostics.bounded.lastSync, true, 'Expected MLS Grid request diagnostics lastSync bounded flag.');
  assert.equal(diagnostics.bounded.timeoutMs, true, 'Expected MLS Grid request diagnostics timeout bounded flag.');
  assert.equal(typeof diagnostics.baseUrlConfigured, 'boolean', 'Expected MLS Grid request diagnostics base URL readiness flag.');
  assert.equal(typeof diagnostics.tokenConfigured, 'boolean', 'Expected MLS Grid request diagnostics token readiness flag.');

  const mediaDiagnostics = getMlsGridRequestDiagnostics({
    skip: 5,
    top: 10,
    lastSync: '2026-06-14T00:00:00.000Z',
    includeMedia: true,
    timeoutMs: 30000,
  });

  assert.equal(mediaDiagnostics.mediaExpansion, 'requested', 'Expected MLS Grid request diagnostics requested media expansion.');
  assert.equal(mediaDiagnostics.query.$expand, 'Media', 'Expected MLS Grid request diagnostics Media expansion query.');
  assert.equal(mediaDiagnostics.bounded.skip, false, 'Expected MLS Grid request diagnostics clean skip bounded flag.');
  assert.equal(mediaDiagnostics.bounded.top, false, 'Expected MLS Grid request diagnostics clean top bounded flag.');

  return {
    skip: diagnostics.skip,
    top: diagnostics.top,
    lastSync: diagnostics.lastSync,
    timeoutMs: diagnostics.timeoutMs,
    mediaExpansion: diagnostics.mediaExpansion,
    baseUrlConfigured: diagnostics.baseUrlConfigured,
    tokenConfigured: diagnostics.tokenConfigured,
    bounded: diagnostics.bounded,
    mediaQueryExpand: mediaDiagnostics.query.$expand,
  };
}

function assertRedisConnectionDiagnostics() {
  const bounded = getRedisConnectionDiagnostics('ops-smoke', {
    lifecycleEvent: 'run:mls-sync:dry',
    redisUrl: 'rediss://operator:secret@redis.example.test:6380/2',
  });

  assert.equal(bounded.connectionName, 'ops-smoke', 'Expected Redis diagnostics connection name.');
  assert.equal(bounded.configured, true, 'Expected Redis diagnostics configured flag.');
  assert.equal(bounded.host, 'redis.example.test', 'Expected Redis diagnostics host.');
  assert.equal(bounded.port, 6380, 'Expected Redis diagnostics port.');
  assert.equal(bounded.db, 2, 'Expected Redis diagnostics db.');
  assert.equal(bounded.usernameConfigured, true, 'Expected Redis diagnostics username flag.');
  assert.equal(bounded.passwordConfigured, true, 'Expected Redis diagnostics password flag.');
  assert.equal(bounded.tls, true, 'Expected Redis diagnostics TLS flag.');
  assert.equal(bounded.retryMode, 'bounded', 'Expected Redis diagnostics bounded retry mode.');
  assert.equal(bounded.oneShotReconnectAttempts, 2, 'Expected Redis diagnostics one-shot attempts.');
  assert.equal(bounded.maxReconnectDelayMs, 30000, 'Expected Redis diagnostics max reconnect delay.');
  assert.deepEqual(bounded.sampleRetryDelaysMs, [500, 1000, null], 'Expected Redis diagnostics bounded retry samples.');
  assert.equal(bounded.options.enableReadyCheck, false, 'Expected Redis diagnostics ready-check option.');
  assert.equal(bounded.options.lazyConnect, true, 'Expected Redis diagnostics lazy connect option.');
  assert.equal(bounded.options.maxRetriesPerRequest, null, 'Expected Redis diagnostics max retries option.');
  assert.ok(bounded.commands.queueDashboard.includes('run:queue-dashboard'), 'Expected Redis diagnostics queue dashboard command.');
  assert.ok(bounded.commands.dryRunSync.includes('run:mls-sync:dry'), 'Expected Redis diagnostics dry-run command.');
  assert.ok(bounded.commands.startMlsWorker.includes('run:worker:mls'), 'Expected Redis diagnostics MLS worker command.');
  assert.ok(bounded.commands.startMlsPageWorker.includes('run:worker:mls-page'), 'Expected Redis diagnostics MLS page worker command.');
  assert.ok(bounded.commands.infraUp.includes('infra:up'), 'Expected Redis diagnostics infra command.');

  const continuous = getRedisConnectionDiagnostics('worker', {
    argv: ['node', 'dist/workers/mlsWorker.js'],
    lifecycleEvent: 'run:worker:mls',
    redisUrl: 'redis://localhost:6379',
  });

  assert.equal(continuous.configured, true, 'Expected Redis continuous diagnostics configured flag.');
  assert.equal(continuous.host, 'localhost', 'Expected Redis continuous diagnostics host.');
  assert.equal(continuous.port, 6379, 'Expected Redis continuous diagnostics port.');
  assert.equal(continuous.usernameConfigured, false, 'Expected Redis continuous diagnostics username flag.');
  assert.equal(continuous.passwordConfigured, false, 'Expected Redis continuous diagnostics password flag.');
  assert.equal(continuous.tls, false, 'Expected Redis continuous diagnostics TLS flag.');
  assert.equal(continuous.retryMode, 'continuous', 'Expected Redis continuous diagnostics retry mode.');
  assert.deepEqual(continuous.sampleRetryDelaysMs, [500, 1000, 1500], 'Expected Redis continuous diagnostics retry samples.');

  const envForcedBounded = getRedisConnectionDiagnostics('forced', {
    redisRetryMode: 'bounded',
    redisUrl: 'redis://127.0.0.1:6379',
  });

  assert.equal(envForcedBounded.retryMode, 'bounded', 'Expected Redis diagnostics explicit bounded retry mode.');

  return {
    connectionName: bounded.connectionName,
    host: bounded.host,
    port: bounded.port,
    db: bounded.db,
    tls: bounded.tls,
    retryMode: bounded.retryMode,
    sampleRetryDelaysMs: bounded.sampleRetryDelaysMs,
    continuousRetryMode: continuous.retryMode,
    continuousRetryDelaysMs: continuous.sampleRetryDelaysMs,
    forcedRetryMode: envForcedBounded.retryMode,
  };
}

function assertLazyQueueDiagnostics() {
  const diagnostics = getLazyQueueDiagnostics();

  assert.equal(diagnostics.module, 'lazyQueue', 'Expected lazy queue diagnostics module.');
  assert.equal(diagnostics.factoryCallsBeforeAccess, 0, 'Expected lazy queue factory to stay idle before access.');
  assert.equal(diagnostics.factoryCallsAfterPropertyAccess, 1, 'Expected lazy queue factory to run on first property access.');
  assert.equal(diagnostics.factoryCallsAfterMethodCall, 1, 'Expected lazy queue factory to reuse instance after method call.');
  assert.equal(diagnostics.propertyValue, 'lazy-queue-1', 'Expected lazy queue property value.');
  assert.equal(diagnostics.methodValue, diagnostics.propertyValue, 'Expected lazy queue bound method value.');
  assert.equal(diagnostics.sameInstance, true, 'Expected lazy queue cached instance.');
  assert.equal(diagnostics.methodBound, true, 'Expected lazy queue method binding.');

  return diagnostics;
}

function assertDatabasePreflightDiagnostics() {
  const diagnostics = getDatabasePreflightDiagnostics();

  assert.equal(diagnostics.module, 'databasePreflight', 'Expected database preflight diagnostics module.');
  assert.equal(diagnostics.skipVariable, 'REIE_WORKER_SKIP_DATABASE_PREFLIGHT', 'Expected database preflight skip variable.');
  assert.deepEqual(diagnostics.skipEnabledValues, ['1', 'true', 'yes', 'y'], 'Expected database preflight skip values.');
  assert.equal(diagnostics.skipDisabled, false, 'Expected database preflight to reject disabled skip value.');
  assert.equal(diagnostics.skipEnabled, true, 'Expected database preflight to accept true skip value.');
  assert.equal(diagnostics.skipTrimsAndIgnoresCase, true, 'Expected database preflight skip parsing to trim and ignore case.');
  assert.equal(diagnostics.workerOperation, 'MLS sync worker before consuming mls-sync jobs', 'Expected worker database preflight operation.');
  assert.equal(diagnostics.workerRecoveryCommand, 'npm run supabase:check:json', 'Expected worker database preflight recovery command.');
  assert.equal(diagnostics.defaultRecoveryCommand, 'npm run supabase:check', 'Expected default database preflight recovery command.');
  assert.equal(diagnostics.normalizedErrorMessage, 'Supabase connection failed', 'Expected database preflight error normalization.');
  assert.equal(diagnostics.failureMessageIncludesOperation, true, 'Expected database preflight failure message operation.');
  assert.equal(diagnostics.failureMessageIncludesRecoveryCommand, true, 'Expected database preflight failure message recovery command.');

  return diagnostics;
}

function assertAppDatabasePreflightDiagnostics() {
  const diagnostics = getAppDatabasePreflightDiagnostics();

  assert.equal(diagnostics.module, 'appDatabasePreflight', 'Expected app database preflight diagnostics module.');
  assert.equal(diagnostics.skipVariable, 'REIE_WORKER_SKIP_DATABASE_PREFLIGHT', 'Expected app database preflight skip variable.');
  assert.deepEqual(diagnostics.skipEnabledValues, ['1', 'true', 'yes', 'y'], 'Expected app database preflight skip values.');
  assert.equal(diagnostics.skipDisabled, false, 'Expected app database preflight to reject disabled skip value.');
  assert.equal(diagnostics.skipEnabled, true, 'Expected app database preflight to accept true skip value.');
  assert.equal(diagnostics.skipTrimsAndIgnoresCase, true, 'Expected app database preflight skip parsing to trim and ignore case.');
  assert.equal(diagnostics.operation, 'MLS sync API route before enqueue', 'Expected app database preflight operation.');
  assert.equal(diagnostics.recoveryCommand, 'npm run supabase:check:json', 'Expected app database preflight recovery command.');
  assert.equal(diagnostics.defaultRecoveryCommand, 'npm run supabase:check', 'Expected app database preflight default recovery command.');
  assert.equal(diagnostics.normalizedErrorMessage, 'Supabase route connection failed', 'Expected app database preflight error normalization.');
  assert.equal(diagnostics.failureMessageIncludesOperation, true, 'Expected app database preflight failure operation.');
  assert.equal(diagnostics.failureMessageIncludesRecoveryCommand, true, 'Expected app database preflight failure recovery command.');

  return diagnostics;
}

function assertListingQueuePlan() {
  const plan = getListingQueuePlan({
    ListingKey: 'listing-key-123',
    UnparsedAddress: '123 Queue Plan Way',
  });

  assert.equal(plan.queueName, 'listings', 'Expected listing queue plan queue name.');
  assert.equal(plan.jobName, 'process-listing', 'Expected listing queue plan job name.');
  assert.equal(plan.jobId, 'listing-listing-key-123', 'Expected listing queue plan stable job ID.');
  assert.equal(plan.identity.field, 'ListingKey', 'Expected listing queue plan identity field.');
  assert.equal(plan.identity.value, 'listing-key-123', 'Expected listing queue plan identity value.');
  assert.equal(plan.identity.stable, true, 'Expected listing queue plan stable identity.');
  assert.equal(plan.terminal, 'Terminal 5', 'Expected listing queue plan terminal.');
  assert.equal(plan.jobOptions.attempts, 3, 'Expected listing queue plan attempts.');
  assert.equal(plan.jobOptions.backoff.type, 'exponential', 'Expected listing queue plan backoff type.');
  assert.equal(plan.jobOptions.backoff.delay, 3000, 'Expected listing queue plan backoff delay.');
  assert.equal(plan.jobOptions.removeOnComplete, 100, 'Expected listing queue plan removeOnComplete.');
  assert.equal(plan.jobOptions.removeOnFail, 500, 'Expected listing queue plan removeOnFail.');
  assert.ok(plan.commands.startWorker.includes('run:worker'), 'Expected listing queue plan worker command.');
  assert.ok(plan.commands.status.includes('/api/mls/status'), 'Expected listing queue plan status command.');
  assert.ok(plan.commands.retryDryRun.includes('/api/mls/retry?queue=listings'), 'Expected listing queue plan retry command.');
  assert.ok(plan.commands.queueDashboard.includes('run:queue-dashboard'), 'Expected listing queue plan dashboard command.');
  assert.ok(plan.commands.deadLetter.includes('/api/admin/dead-letter'), 'Expected listing queue plan dead-letter command.');

  const fallbackPlan = getListingQueuePlan({
    ListPrice: 750000,
  });

  assert.equal(fallbackPlan.identity.stable, false, 'Expected listing queue fallback identity to be unstable.');
  assert.equal(typeof fallbackPlan.identity.value, 'string', 'Expected listing queue fallback identity value.');
  assert.ok(fallbackPlan.jobId.startsWith('listing-'), 'Expected listing queue fallback job ID prefix.');

  return {
    queueName: plan.queueName,
    jobName: plan.jobName,
    jobId: plan.jobId,
    identityField: plan.identity.field,
    stableIdentity: plan.identity.stable,
    fallbackStableIdentity: fallbackPlan.identity.stable,
    attempts: plan.jobOptions.attempts,
    removeOnComplete: plan.jobOptions.removeOnComplete,
    removeOnFail: plan.jobOptions.removeOnFail,
  };
}

function assertAlertQueuePlan() {
  const longRequestedBy = `${'alert-operator-'.repeat(12)}end`;
  const plan = getAlertQueuePlan('  alert-queue-123  ', {
    requestedAt: 'not-a-date',
    requestedBy: longRequestedBy,
    source: 'script',
  });

  assert.equal(plan.queueName, 'reie-alerts', 'Expected alert queue plan queue name.');
  assert.equal(plan.jobName, 'process-alert', 'Expected alert queue plan job name.');
  assert.equal(plan.jobId, 'alert-alert-queue-123', 'Expected alert queue plan job ID.');
  assert.equal(plan.data.alertId, 'alert-queue-123', 'Expected alert queue plan normalized alertId.');
  assert.equal(plan.data.source, 'script', 'Expected alert queue plan source.');
  assert.equal(plan.data.requestedBy?.length, plan.limits.maxRequestedByLength, 'Expected alert queue plan requestedBy limit.');
  assert.equal(plan.terminal, 'Terminal 3', 'Expected alert queue plan worker terminal.');
  assert.equal(plan.recoveryTerminal, 'Terminal 5', 'Expected alert queue plan recovery terminal.');
  assert.equal(plan.defaultJobOptions.attempts, 3, 'Expected alert queue plan attempts.');
  assert.equal(plan.defaultJobOptions.backoff.type, 'exponential', 'Expected alert queue plan backoff type.');
  assert.equal(plan.defaultJobOptions.backoff.delay, 3000, 'Expected alert queue plan backoff delay.');
  assert.equal(plan.defaultJobOptions.removeOnComplete.count, 250, 'Expected alert queue plan removeOnComplete count.');
  assert.equal(plan.defaultJobOptions.removeOnFail.count, 500, 'Expected alert queue plan removeOnFail count.');
  assert.equal(plan.bounded.alertId, true, 'Expected alert queue plan alertId bounded flag.');
  assert.equal(plan.bounded.requestedAt, true, 'Expected alert queue plan requestedAt bounded flag.');
  assert.equal(plan.bounded.requestedBy, true, 'Expected alert queue plan requestedBy bounded flag.');
  assert.equal(plan.bounded.source, false, 'Expected alert queue plan clean source bounded flag.');
  assert.ok(plan.commands.startWorker.includes('run:worker:alerts'), 'Expected alert queue plan worker command.');
  assert.ok(plan.commands.dryRunWorker.includes('run:worker:alerts:once'), 'Expected alert queue plan dry-run worker command.');
  assert.ok(plan.commands.liveOnceWorker.includes('run:worker:alerts:once:live'), 'Expected alert queue plan live worker command.');
  assert.ok(plan.commands.processAlertsDryRun.includes('/api/process-alerts?dryRun=true'), 'Expected alert queue plan process-alerts dry-run command.');
  assert.ok(plan.commands.status.includes('/api/process-alerts'), 'Expected alert queue plan status command.');
  assert.ok(plan.commands.retryDryRun.includes('/api/mls/retry?queue=alerts'), 'Expected alert queue plan retry command.');
  assert.ok(plan.commands.queueDashboard.includes('run:queue-dashboard'), 'Expected alert queue plan dashboard command.');
  assert.ok(plan.commands.deadLetter.includes('sourceQueue=reie-alerts'), 'Expected alert queue plan dead-letter command.');

  const defaultPlan = getAlertQueuePlan('alert-default', {});

  assert.equal(defaultPlan.data.source, 'matching', 'Expected alert queue default source.');
  assert.equal(defaultPlan.bounded.alertId, false, 'Expected alert queue default alertId bounded flag.');
  assert.equal(defaultPlan.jobId, 'alert-alert-default', 'Expected alert queue default job ID.');

  return {
    queueName: plan.queueName,
    jobName: plan.jobName,
    jobId: plan.jobId,
    alertId: plan.data.alertId,
    source: plan.data.source,
    bounded: plan.bounded,
    attempts: plan.defaultJobOptions.attempts,
    defaultSource: defaultPlan.data.source,
  };
}

function assertEnqueueAlertPlan() {
  const plan = getEnqueueAlertPlan('  alert-wrapper-123  ', {
    requestedAt: 'not-a-date',
    requestedBy: 'wrapper-operator',
  });

  assert.equal(plan.wrapper.module, 'enqueueAlert', 'Expected enqueue alert wrapper module.');
  assert.equal(plan.wrapper.defaultSource, 'matching', 'Expected enqueue alert default source.');
  assert.equal(plan.wrapper.validatedAlertId, 'alert-wrapper-123', 'Expected enqueue alert validated ID.');
  assert.equal(plan.queueName, 'reie-alerts', 'Expected enqueue alert queue name.');
  assert.equal(plan.jobName, 'process-alert', 'Expected enqueue alert job name.');
  assert.equal(plan.jobId, 'alert-alert-wrapper-123', 'Expected enqueue alert job ID.');
  assert.equal(plan.data.alertId, 'alert-wrapper-123', 'Expected enqueue alert normalized alert ID.');
  assert.equal(plan.data.source, 'matching', 'Expected enqueue alert default matching source.');
  assert.equal(plan.bounded.requestedAt, true, 'Expected enqueue alert requestedAt bounded flag.');
  assert.equal(plan.bounded.alertId, false, 'Expected enqueue alert pre-trimmed alertId to remain clean for queue plan.');
  assert.equal(plan.defaultJobOptions.attempts, 3, 'Expected enqueue alert attempts.');

  const scriptPlan = getEnqueueAlertPlan('alert-script-123', {
    source: 'script',
  });

  assert.equal(scriptPlan.data.source, 'script', 'Expected enqueue alert explicit source.');

  assert.throws(
    () => getEnqueueAlertPlan('   '),
    /alertId is required/,
    'Expected enqueue alert plan to reject blank alertId.',
  );

  return {
    queueName: plan.queueName,
    jobName: plan.jobName,
    jobId: plan.jobId,
    alertId: plan.data.alertId,
    source: plan.data.source,
    wrapperModule: plan.wrapper.module,
    explicitSource: scriptPlan.data.source,
    attempts: plan.defaultJobOptions.attempts,
  };
}

function assertDeadLetterQueuePlan() {
  const longText = 'failure-detail-'.repeat(700);
  const plan = getDeadLetterQueuePlan({
    sourceQueue: `mls-sync-${'x'.repeat(180)}`,
    sourceJobId: 'job-123',
    sourceJobName: 'sync',
    failedReason: longText,
    failedAt: '2026-06-14T10:00:00.000Z',
    attemptsMade: 3,
    stack: `Error: failed\n${'stack-line\n'.repeat(2000)}`,
    payload: {
      authorization: 'Bearer secret',
      nested: {
        apiKey: 'secret-api-key',
        safe: 'visible',
      },
      items: Array.from({ length: 60 }, (_, index) => index),
    },
    capturedAt: '2026-06-14T10:01:00.000Z',
    capturedBy: 'Terminal 3 worker',
    sourceJobAttempts: 3,
  });

  assert.equal(plan.queueName, 'reie-dead-letter', 'Expected dead-letter queue plan queue name.');
  assert.equal(plan.jobName, 'failed-job', 'Expected dead-letter queue plan job name.');
  assert.ok(plan.jobId.startsWith('dead-letter-mls-sync-'), 'Expected dead-letter queue plan job ID prefix.');
  assert.equal(plan.data.sourceQueue?.length, plan.limits.maxSourceQueueLength, 'Expected dead-letter source queue limit.');
  assert.equal(plan.data.sourceJobId, 'job-123', 'Expected dead-letter source job ID.');
  assert.equal(plan.data.sourceJobName, 'sync', 'Expected dead-letter source job name.');
  assert.ok(String(plan.data.failedReason).includes('[TRUNCATED]'), 'Expected dead-letter failed reason truncation.');
  assert.ok(String(plan.data.stack).includes('[TRUNCATED]'), 'Expected dead-letter stack truncation.');
  assert.equal(plan.data.finalAttempt, true, 'Expected dead-letter final attempt inference.');
  assert.equal(plan.terminal, 'Terminal 5', 'Expected dead-letter terminal.');
  assert.equal(plan.defaultJobOptions.attempts, 1, 'Expected dead-letter attempts.');
  assert.equal(plan.defaultJobOptions.removeOnComplete.count, 500, 'Expected dead-letter removeOnComplete count.');
  assert.equal(plan.defaultJobOptions.removeOnFail.count, 1000, 'Expected dead-letter removeOnFail count.');
  assert.ok(plan.commands.inspect.includes('/api/admin/dead-letter'), 'Expected dead-letter inspect command.');
  assert.ok(plan.commands.inspectOpen.includes('states=waiting%2Cdelayed%2Cfailed'), 'Expected dead-letter open inspect command.');
  assert.ok(plan.commands.inspectSourceQueue.includes('sourceQueue=mls-sync-'), 'Expected dead-letter source queue inspect command.');
  assert.ok(plan.commands.queueDashboard.includes('run:queue-dashboard'), 'Expected dead-letter queue dashboard command.');
  assert.ok(plan.commands.retryStatus.includes('/api/mls/retry'), 'Expected dead-letter retry status command.');
  assert.ok(plan.commands.status.includes('/api/mls/status'), 'Expected dead-letter status command.');

  assert.ok(isRecord(plan.data.payload), 'Expected dead-letter sanitized payload object.');
  const payload = plan.data.payload as JsonRecord;
  const nested = isRecord(payload.nested) ? payload.nested : {};
  const items = Array.isArray(payload.items) ? payload.items : [];

  assert.equal(payload.authorization, '[REDACTED]', 'Expected dead-letter authorization redaction.');
  assert.equal(nested.apiKey, '[REDACTED]', 'Expected dead-letter nested API key redaction.');
  assert.equal(nested.safe, 'visible', 'Expected dead-letter safe payload value.');
  assert.equal(items.length, plan.limits.maxArrayItems + 1, 'Expected dead-letter array truncation marker.');

  return {
    queueName: plan.queueName,
    jobName: plan.jobName,
    jobIdPrefix: plan.jobId.slice(0, 32),
    sourceQueueLength: plan.data.sourceQueue.length,
    finalAttempt: plan.data.finalAttempt,
    attempts: plan.defaultJobOptions.attempts,
    removeOnComplete: plan.defaultJobOptions.removeOnComplete.count,
    removeOnFail: plan.defaultJobOptions.removeOnFail.count,
    redactedAuthorization: payload.authorization === '[REDACTED]',
    truncatedItems: items.length,
  };
}

function assertMlsPageQueuePlan() {
  const longRequestedBy = `${'terminal-2-operator-'.repeat(10)}end`;
  const plan = getMlsPageQueuePlan({
    requestedAt: 'not-a-date',
    requestedBy: longRequestedBy,
    source: 'api',
    skip: -25,
    top: 10_000,
    lastSync: 'not-a-date',
    includeMedia: true,
    timeoutMs: 999_999,
  });

  assert.equal(plan.queueName, 'mls-page', 'Expected MLS page queue plan queue name.');
  assert.equal(plan.jobName, 'fetch-page', 'Expected MLS page queue plan job name.');
  assert.equal(plan.terminal, 'Terminal 2', 'Expected MLS page queue plan worker terminal.');
  assert.equal(plan.recoveryTerminal, 'Terminal 5', 'Expected MLS page queue plan recovery terminal.');
  assert.equal(plan.data.source, 'api', 'Expected MLS page queue plan source.');
  assert.equal(plan.data.skip, 0, 'Expected MLS page queue plan to clamp negative skip.');
  assert.equal(plan.data.top, plan.limits.maxTop, 'Expected MLS page queue plan to clamp top.');
  assert.equal(plan.data.lastSync, '2000-01-01T00:00:00.000Z', 'Expected MLS page queue plan fallback lastSync.');
  assert.equal(plan.data.includeMedia, true, 'Expected MLS page queue plan to preserve includeMedia.');
  assert.equal(plan.data.timeoutMs, plan.limits.maxTimeoutMs, 'Expected MLS page queue plan to clamp timeout.');
  assert.equal(plan.data.requestedBy?.length, plan.limits.maxRequestedByLength, 'Expected MLS page queue plan to bound requestedBy.');
  assert.ok(plan.jobId.startsWith('mls-page-0-100-2000-01-01T00:00:00.000Z'), 'Expected MLS page queue plan job ID.');
  assert.equal(plan.defaultJobOptions.attempts, 3, 'Expected MLS page queue plan attempts.');
  assert.equal(plan.defaultJobOptions.backoff.type, 'exponential', 'Expected MLS page queue plan backoff type.');
  assert.equal(plan.defaultJobOptions.backoff.delay, 2000, 'Expected MLS page queue plan backoff delay.');
  assert.equal(plan.defaultJobOptions.removeOnComplete.count, 250, 'Expected MLS page queue plan removeOnComplete count.');
  assert.equal(plan.defaultJobOptions.removeOnFail.count, 500, 'Expected MLS page queue plan removeOnFail count.');
  assert.equal(plan.bounded.requestedBy, true, 'Expected MLS page queue plan requestedBy bounded flag.');
  assert.equal(plan.bounded.requestedAt, true, 'Expected MLS page queue plan requestedAt bounded flag.');
  assert.equal(plan.bounded.skip, true, 'Expected MLS page queue plan skip bounded flag.');
  assert.equal(plan.bounded.top, true, 'Expected MLS page queue plan top bounded flag.');
  assert.equal(plan.bounded.lastSync, true, 'Expected MLS page queue plan lastSync bounded flag.');
  assert.equal(plan.bounded.timeoutMs, true, 'Expected MLS page queue plan timeout bounded flag.');
  assert.ok(plan.commands.startWorker.includes('run:worker:mls-page'), 'Expected MLS page queue plan worker command.');
  assert.ok(plan.commands.oneShotWorker.includes('run:worker:mls-page:once'), 'Expected MLS page queue plan one-shot worker command.');
  assert.ok(plan.commands.status.includes('/api/mls/status'), 'Expected MLS page queue plan status command.');
  assert.ok(plan.commands.retryDryRun.includes('/api/mls/retry?queue=mls-page'), 'Expected MLS page queue plan retry dry-run command.');
  assert.ok(plan.commands.queueDashboard.includes('run:queue-dashboard'), 'Expected MLS page queue plan queue dashboard command.');

  const defaultPlan = getMlsPageQueuePlan({});

  assert.equal(defaultPlan.data.source, 'coordinator', 'Expected MLS page queue plan source fallback.');
  assert.equal(defaultPlan.data.skip, 0, 'Expected MLS page queue default skip.');
  assert.equal(defaultPlan.data.top, 50, 'Expected MLS page queue default top.');
  assert.equal(defaultPlan.data.lastSync, '2000-01-01T00:00:00.000Z', 'Expected MLS page queue default lastSync.');
  assert.equal(defaultPlan.data.timeoutMs, 30000, 'Expected MLS page queue default timeout.');

  return {
    queueName: plan.queueName,
    jobName: plan.jobName,
    jobId: plan.jobId,
    skip: plan.data.skip,
    top: plan.data.top,
    lastSync: plan.data.lastSync,
    timeoutMs: plan.data.timeoutMs,
    includeMedia: plan.data.includeMedia,
    bounded: plan.bounded,
    attempts: plan.defaultJobOptions.attempts,
    defaultSource: defaultPlan.data.source,
  };
}

function assertMlsPageWorkerPlan() {
  const plan = getMlsPageWorkerPlan({
    MLS_PAGE_WORKER_CONCURRENCY: '99',
    MLS_PAGE_WORKER_LOCK_DURATION_MS: '1',
    MLS_PAGE_WORKER_MAX_FAILURE_DETAILS: '999',
    MLS_PAGE_WORKER_MAX_JOBS: '999',
    MLS_PAGE_WORKER_MAX_STALLED_COUNT: '999',
    MLS_PAGE_WORKER_MAX_WARNING_DETAILS: '999',
    MLS_PAGE_WORKER_ONCE: 'true',
    MLS_PAGE_WORKER_STALLED_INTERVAL_MS: '1',
  });

  assert.equal(plan.queueName, 'mls-page', 'Expected MLS page worker plan queue name.');
  assert.equal(plan.terminal, 'Terminal 2', 'Expected MLS page worker terminal.');
  assert.equal(plan.recoveryTerminal, 'Terminal 5', 'Expected MLS page worker recovery terminal.');
  assert.equal(plan.config.concurrency, plan.limits.maxConcurrency, 'Expected MLS page worker concurrency to clamp.');
  assert.equal(plan.config.lockDurationMs, plan.limits.minLockDurationMs, 'Expected MLS page worker lock duration to clamp.');
  assert.equal(plan.config.maxFailureDetails, plan.limits.maxMaxFailureDetails, 'Expected MLS page worker failure details to clamp.');
  assert.equal(plan.config.maxJobs, plan.limits.maxMaxJobs, 'Expected MLS page worker max jobs to clamp.');
  assert.equal(plan.config.maxStalledCount, plan.limits.maxMaxStalledCount, 'Expected MLS page worker stalled count to clamp.');
  assert.equal(plan.config.maxWarningDetails, plan.limits.maxMaxWarningDetails, 'Expected MLS page worker warning details to clamp.');
  assert.equal(plan.config.once, true, 'Expected MLS page worker one-shot flag.');
  assert.equal(plan.config.stalledIntervalMs, plan.limits.minStalledIntervalMs, 'Expected MLS page worker stalled interval to clamp.');
  assert.equal(plan.databasePreflight.queue, 'mls-page', 'Expected MLS page worker preflight queue.');
  assert.equal(plan.databasePreflight.worker, 'MLS page worker', 'Expected MLS page worker preflight label.');
  assert.equal(plan.databasePreflight.recoveryCommand, 'npm run supabase:check:json', 'Expected MLS page worker preflight recovery command.');
  assert.equal(plan.bounded.concurrency, true, 'Expected MLS page worker concurrency bounded flag.');
  assert.equal(plan.bounded.lockDurationMs, true, 'Expected MLS page worker lock duration bounded flag.');
  assert.equal(plan.bounded.maxFailureDetails, true, 'Expected MLS page worker failure details bounded flag.');
  assert.equal(plan.bounded.maxJobs, true, 'Expected MLS page worker max jobs bounded flag.');
  assert.equal(plan.bounded.maxStalledCount, true, 'Expected MLS page worker max stalled bounded flag.');
  assert.equal(plan.bounded.maxWarningDetails, true, 'Expected MLS page worker warning details bounded flag.');
  assert.equal(plan.bounded.stalledIntervalMs, true, 'Expected MLS page worker stalled interval bounded flag.');
  assert.ok(plan.commands.status.includes('/api/mls/status'), 'Expected MLS page worker status command.');
  assert.ok(plan.commands.retryStatus.includes('/api/mls/retry'), 'Expected MLS page worker retry status command.');
  assert.ok(plan.commands.queueDashboard.includes('run:queue-dashboard'), 'Expected MLS page worker queue dashboard command.');
  assert.ok(plan.commands.supabaseCheck.includes('supabase:check'), 'Expected MLS page worker Supabase command.');
  assert.ok(plan.commands.supabaseCheckJson.includes('supabase:check:json'), 'Expected MLS page worker Supabase JSON command.');
  assert.ok(plan.commands.deadLetter.includes('/api/admin/dead-letter'), 'Expected MLS page worker dead-letter command.');
  assert.ok(plan.commands.dryRunRetry.includes('/api/mls/retry?queue=mls-page'), 'Expected MLS page worker dry-run retry command.');
  assert.ok(plan.commands.liveRetry.includes('execute=true'), 'Expected MLS page worker live retry command.');

  const defaultPlan = getMlsPageWorkerPlan({});

  assert.equal(defaultPlan.config.concurrency, 1, 'Expected MLS page worker default concurrency.');
  assert.equal(defaultPlan.config.maxFailureDetails, 25, 'Expected MLS page worker default failure detail limit.');
  assert.equal(defaultPlan.config.maxJobs, 1, 'Expected MLS page worker default one-shot max jobs.');
  assert.equal(defaultPlan.config.maxWarningDetails, 25, 'Expected MLS page worker default warning detail limit.');
  assert.equal(defaultPlan.config.once, false, 'Expected MLS page worker default one-shot flag.');

  return {
    queueName: plan.queueName,
    terminal: plan.terminal,
    recoveryTerminal: plan.recoveryTerminal,
    concurrency: plan.config.concurrency,
    lockDurationMs: plan.config.lockDurationMs,
    maxFailureDetails: plan.config.maxFailureDetails,
    maxJobs: plan.config.maxJobs,
    maxStalledCount: plan.config.maxStalledCount,
    maxWarningDetails: plan.config.maxWarningDetails,
    stalledIntervalMs: plan.config.stalledIntervalMs,
    once: plan.config.once,
    bounded: plan.bounded,
    defaultConcurrency: defaultPlan.config.concurrency,
  };
}

function assertMlsSyncQueuePlan() {
  const longRequestedBy = `${'terminal-3-operator-'.repeat(10)}end`;
  const plan = getMlsSyncQueuePlan({
    requestedAt: 'not-a-date',
    requestedBy: longRequestedBy,
    source: 'script',
    maxRuntimeMs: 999_999_999,
    rateDelayMs: 999_999,
    pageSize: 10_000,
    maxPages: 10_000,
    startPage: -25,
    includeMedia: true,
    pageTimeoutMs: 999_999,
  });

  assert.equal(plan.queueName, 'mls-sync', 'Expected MLS sync queue plan queue name.');
  assert.equal(plan.jobName, 'sync', 'Expected MLS sync queue plan job name.');
  assert.equal(plan.terminal, 'Terminal 3', 'Expected MLS sync queue plan worker terminal.');
  assert.equal(plan.recoveryTerminal, 'Terminal 5', 'Expected MLS sync queue plan recovery terminal.');
  assert.equal(plan.data.source, 'script', 'Expected MLS sync queue plan source.');
  assert.equal(plan.data.maxRuntimeMs, plan.limits.maxMaxRuntimeMs, 'Expected MLS sync queue plan to clamp runtime.');
  assert.equal(plan.data.rateDelayMs, plan.limits.maxRateDelayMs, 'Expected MLS sync queue plan to clamp rate delay.');
  assert.equal(plan.data.pageSize, plan.limits.maxPageSize, 'Expected MLS sync queue plan to clamp page size.');
  assert.equal(plan.data.maxPages, plan.limits.maxMaxPages, 'Expected MLS sync queue plan to clamp max pages.');
  assert.equal(plan.data.startPage, plan.limits.minStartPage, 'Expected MLS sync queue plan to clamp start page.');
  assert.equal(plan.data.includeMedia, true, 'Expected MLS sync queue plan to preserve includeMedia.');
  assert.equal(plan.data.pageTimeoutMs, plan.limits.maxPageTimeoutMs, 'Expected MLS sync queue plan to clamp page timeout.');
  assert.equal(plan.data.requestedBy?.length, plan.limits.maxRequestedByLength, 'Expected MLS sync queue plan to bound requestedBy.');
  assert.equal(plan.defaultJobOptions.attempts, 3, 'Expected MLS sync queue plan attempts.');
  assert.equal(plan.defaultJobOptions.backoff.type, 'exponential', 'Expected MLS sync queue plan backoff type.');
  assert.equal(plan.defaultJobOptions.backoff.delay, 5000, 'Expected MLS sync queue plan backoff delay.');
  assert.equal(plan.defaultJobOptions.removeOnComplete.count, 250, 'Expected MLS sync queue plan removeOnComplete count.');
  assert.equal(plan.defaultJobOptions.removeOnFail.count, 500, 'Expected MLS sync queue plan removeOnFail count.');
  assert.equal(plan.bounded.requestedBy, true, 'Expected MLS sync queue plan requestedBy bounded flag.');
  assert.equal(plan.bounded.requestedAt, true, 'Expected MLS sync queue plan requestedAt bounded flag.');
  assert.equal(plan.bounded.maxRuntimeMs, true, 'Expected MLS sync queue plan runtime bounded flag.');
  assert.equal(plan.bounded.rateDelayMs, true, 'Expected MLS sync queue plan rate delay bounded flag.');
  assert.equal(plan.bounded.pageSize, true, 'Expected MLS sync queue plan page size bounded flag.');
  assert.equal(plan.bounded.maxPages, true, 'Expected MLS sync queue plan max pages bounded flag.');
  assert.equal(plan.bounded.startPage, true, 'Expected MLS sync queue plan start page bounded flag.');
  assert.equal(plan.bounded.pageTimeoutMs, true, 'Expected MLS sync queue plan page timeout bounded flag.');
  assert.ok(plan.commands.startWorker.includes('run:worker:mls'), 'Expected MLS sync queue plan worker command.');
  assert.ok(plan.commands.dryRunSync.includes('run:mls-sync:dry'), 'Expected MLS sync queue plan dry-run command.');
  assert.ok(plan.commands.liveSync.includes('run:mls-sync:live'), 'Expected MLS sync queue plan live command.');
  assert.ok(plan.commands.status.includes('/api/mls/status'), 'Expected MLS sync queue plan status command.');
  assert.ok(plan.commands.retryDryRun.includes('/api/mls/retry?queue=mls-sync'), 'Expected MLS sync queue plan retry dry-run command.');
  assert.ok(plan.commands.queueDashboard.includes('run:queue-dashboard'), 'Expected MLS sync queue plan queue dashboard command.');

  const defaultPlan = getMlsSyncQueuePlan({});

  assert.equal(defaultPlan.data.source, 'api', 'Expected MLS sync queue plan source fallback.');
  assert.equal(defaultPlan.data.maxRuntimeMs, 600000, 'Expected MLS sync queue default runtime.');
  assert.equal(defaultPlan.data.rateDelayMs, 1100, 'Expected MLS sync queue default rate delay.');
  assert.equal(defaultPlan.data.pageSize, 50, 'Expected MLS sync queue default page size.');
  assert.equal(defaultPlan.data.maxPages, 1, 'Expected MLS sync queue default max pages.');
  assert.equal(defaultPlan.data.startPage, 0, 'Expected MLS sync queue default start page.');
  assert.equal(defaultPlan.data.pageTimeoutMs, 30000, 'Expected MLS sync queue default page timeout.');

  return {
    queueName: plan.queueName,
    jobName: plan.jobName,
    maxRuntimeMs: plan.data.maxRuntimeMs,
    rateDelayMs: plan.data.rateDelayMs,
    pageSize: plan.data.pageSize,
    maxPages: plan.data.maxPages,
    startPage: plan.data.startPage,
    pageTimeoutMs: plan.data.pageTimeoutMs,
    includeMedia: plan.data.includeMedia,
    bounded: plan.bounded,
    attempts: plan.defaultJobOptions.attempts,
    defaultSource: defaultPlan.data.source,
  };
}

function assertMlsWorkerPlan() {
  const plan = getMlsWorkerPlan({
    MLS_WORKER_CONCURRENCY: '99',
    MLS_WORKER_LOCK_DURATION_MS: '1',
    MLS_WORKER_MAX_STALLED_COUNT: '99',
    MLS_WORKER_ONCE: 'true',
    MLS_WORKER_STALLED_INTERVAL_MS: '1',
    MLS_MAX_RUNTIME_MS: '999999999',
    MLS_RATE_DELAY_MS: '999999',
    MLS_PAGE_SIZE: '10000',
    MLS_MAX_PAGES: '10000',
    MLS_START_PAGE: '-10',
    MLS_INCLUDE_MEDIA: 'true',
    MLS_PAGE_TIMEOUT_MS: '999999',
  });

  assert.equal(plan.queueName, 'mls-sync', 'Expected MLS worker plan queue name.');
  assert.equal(plan.jobName, 'sync', 'Expected MLS worker plan job name.');
  assert.equal(plan.terminal, 'Terminal 3', 'Expected MLS worker terminal.');
  assert.equal(plan.recoveryTerminal, 'Terminal 5', 'Expected MLS worker recovery terminal.');
  assert.equal(plan.config.concurrency, plan.limits.maxConcurrency, 'Expected MLS worker concurrency to clamp.');
  assert.equal(plan.config.lockDurationMs, plan.limits.minLockDurationMs, 'Expected MLS worker lock duration to clamp.');
  assert.equal(plan.config.maxStalledCount, plan.limits.maxMaxStalledCount, 'Expected MLS worker stalled count to clamp.');
  assert.equal(plan.config.once, true, 'Expected MLS worker one-shot flag.');
  assert.equal(plan.config.stalledIntervalMs, plan.limits.minStalledIntervalMs, 'Expected MLS worker stalled interval to clamp.');
  assert.equal(plan.oneShotOptions.source, 'worker-once', 'Expected MLS worker one-shot source.');
  assert.equal(plan.oneShotOptions.requestedBy, 'Terminal 3 one-shot worker', 'Expected MLS worker one-shot requester.');
  assert.equal(plan.oneShotOptions.maxRuntimeMs, plan.limits.maxMaxRuntimeMs, 'Expected MLS worker one-shot runtime clamp.');
  assert.equal(plan.oneShotOptions.rateDelayMs, plan.limits.maxRateDelayMs, 'Expected MLS worker one-shot rate clamp.');
  assert.equal(plan.oneShotOptions.pageSize, plan.limits.maxPageSize, 'Expected MLS worker one-shot page size clamp.');
  assert.equal(plan.oneShotOptions.maxPages, plan.limits.maxMaxPages, 'Expected MLS worker one-shot max pages clamp.');
  assert.equal(plan.oneShotOptions.startPage, plan.limits.minStartPage, 'Expected MLS worker one-shot start page clamp.');
  assert.equal(plan.oneShotOptions.includeMedia, true, 'Expected MLS worker one-shot media flag.');
  assert.equal(plan.oneShotOptions.pageTimeoutMs, plan.limits.maxPageTimeoutMs, 'Expected MLS worker one-shot page timeout clamp.');
  assert.equal(plan.databasePreflight.queue, 'mls-sync', 'Expected MLS worker preflight queue.');
  assert.equal(plan.databasePreflight.worker, 'MLS sync worker', 'Expected MLS worker preflight label.');
  assert.equal(plan.databasePreflight.recoveryCommand, 'npm run supabase:check:json', 'Expected MLS worker preflight recovery command.');
  assert.equal(plan.bounded.concurrency, true, 'Expected MLS worker concurrency bounded flag.');
  assert.equal(plan.bounded.lockDurationMs, true, 'Expected MLS worker lock duration bounded flag.');
  assert.equal(plan.bounded.maxStalledCount, true, 'Expected MLS worker max stalled bounded flag.');
  assert.equal(plan.bounded.stalledIntervalMs, true, 'Expected MLS worker stalled interval bounded flag.');
  assert.equal(plan.bounded.maxRuntimeMs, true, 'Expected MLS worker runtime bounded flag.');
  assert.equal(plan.bounded.rateDelayMs, true, 'Expected MLS worker rate delay bounded flag.');
  assert.equal(plan.bounded.pageSize, true, 'Expected MLS worker page size bounded flag.');
  assert.equal(plan.bounded.maxPages, true, 'Expected MLS worker max pages bounded flag.');
  assert.equal(plan.bounded.startPage, true, 'Expected MLS worker start page bounded flag.');
  assert.equal(plan.bounded.pageTimeoutMs, true, 'Expected MLS worker page timeout bounded flag.');
  assert.ok(plan.commands.status.includes('/api/mls/status'), 'Expected MLS worker status command.');
  assert.ok(plan.commands.retryStatus.includes('/api/mls/retry'), 'Expected MLS worker retry status command.');
  assert.ok(plan.commands.queueDashboard.includes('run:queue-dashboard'), 'Expected MLS worker queue dashboard command.');
  assert.ok(plan.commands.supabaseCheck.includes('supabase:check'), 'Expected MLS worker Supabase command.');
  assert.ok(plan.commands.supabaseCheckJson.includes('supabase:check:json'), 'Expected MLS worker Supabase JSON command.');
  assert.ok(plan.commands.dryRunSync.includes('/api/mls/sync'), 'Expected MLS worker dry-run sync command.');
  assert.ok(plan.commands.dryRunRetry.includes('/api/mls/retry?queue=mls-sync'), 'Expected MLS worker dry-run retry command.');
  assert.ok(plan.commands.liveRetry.includes('execute=true'), 'Expected MLS worker live retry command.');
  assert.ok(plan.commands.oneShot.includes('MLS_WORKER_ONCE=true'), 'Expected MLS worker one-shot command.');
  assert.ok(plan.commands.deadLetter.includes('/api/admin/dead-letter'), 'Expected MLS worker dead-letter command.');

  const defaultPlan = getMlsWorkerPlan({});

  assert.equal(defaultPlan.config.concurrency, 1, 'Expected MLS worker default concurrency.');
  assert.equal(defaultPlan.config.once, false, 'Expected MLS worker default one-shot flag.');
  assert.equal(defaultPlan.oneShotOptions.pageSize, 50, 'Expected MLS worker default one-shot page size.');
  assert.equal(defaultPlan.oneShotOptions.maxPages, 1, 'Expected MLS worker default one-shot max pages.');
  assert.equal(defaultPlan.oneShotOptions.pageTimeoutMs, 30000, 'Expected MLS worker default one-shot page timeout.');

  return {
    queueName: plan.queueName,
    jobName: plan.jobName,
    terminal: plan.terminal,
    recoveryTerminal: plan.recoveryTerminal,
    concurrency: plan.config.concurrency,
    lockDurationMs: plan.config.lockDurationMs,
    maxStalledCount: plan.config.maxStalledCount,
    stalledIntervalMs: plan.config.stalledIntervalMs,
    once: plan.config.once,
    oneShotSource: plan.oneShotOptions.source,
    oneShotPageSize: plan.oneShotOptions.pageSize,
    oneShotMaxPages: plan.oneShotOptions.maxPages,
    oneShotPageTimeoutMs: plan.oneShotOptions.pageTimeoutMs,
    bounded: plan.bounded,
    defaultConcurrency: defaultPlan.config.concurrency,
  };
}

async function assertControlState() {
  const path = '/api/admin/control-state?inspect=policy';
  const payload = await fetchJson(path);

  assert.equal(payload.success, true, 'Expected control state success=true.');
  assert.equal(payload.terminal, 'Terminal 5', 'Expected control state terminal metadata.');
  assert.equal(payload.route, '/api/admin/control-state', 'Expected control state route metadata.');
  assert.ok(typeof payload.generatedAt === 'string', 'Expected control state generatedAt metadata.');
  assert.ok(typeof payload.command === 'string' && payload.command.includes('/api/admin/control-state'), 'Expected control state command metadata.');
  assert.ok(payload.command.includes('inspect=policy'), 'Expected control state command metadata to preserve query.');
  assert.ok(isRecord(payload.state), 'Expected control state payload to include state.');
  assert.ok(isRecord(payload.policy), 'Expected control state payload to include policy.');
  assert.ok(payload.source === 'database' || payload.source === 'default', 'Expected control state source metadata.');
  assert.ok(isRecord(payload.auth), 'Expected control state auth metadata.');
  assert.equal(typeof (payload.auth as JsonRecord).configured, 'boolean', 'Expected control state auth configured flag.');

  const state = payload.state as JsonRecord;
  const policy = payload.policy as JsonRecord;
  const strategyGate = Number(state.strategyGate);
  const mode = state.mode;
  const warnings = Array.isArray(policy.warnings) ? policy.warnings.map(String) : [];

  assert.ok(Number.isFinite(strategyGate), 'Expected control state strategyGate to be finite.');
  assert.ok(strategyGate >= 0 && strategyGate <= 100, 'Expected control state strategyGate to be bounded.');
  assert.ok(mode === 'ops' || mode === 'monitor' || mode === 'paused', 'Expected control state mode to be supported.');
  assert.equal(typeof state.areaCloud, 'boolean', 'Expected control state areaCloud boolean.');
  assert.equal(typeof state.privateLayer, 'boolean', 'Expected control state privateLayer boolean.');
  assert.equal(typeof state.killSwitchActive, 'boolean', 'Expected control state killSwitchActive boolean.');
  assert.ok(typeof state.updatedAt === 'string', 'Expected control state updatedAt metadata.');
  assert.ok(
    typeof state.updatedBy === 'string' && state.updatedBy.length <= 120,
    'Expected control state updatedBy to be bounded.',
  );
  assert.ok(Array.isArray(policy.warnings), 'Expected control state policy warnings array.');

  const expectedAutomation = state.killSwitchActive === true || mode === 'paused' ? 'paused' : mode === 'monitor' ? 'monitor' : 'live';
  const expectedPublicExposure = strategyGate >= 70 ? 'protected' : strategyGate >= 35 ? 'guided' : 'open';
  const expectedMapPrecision = state.areaCloud === true ? 'area-cloud' : 'exact';
  const expectedPrivateLayer = state.privateLayer === true ? 'visible' : 'hidden';

  assert.equal(policy.automation, expectedAutomation, 'Expected control state policy automation to match state.');
  assert.equal(policy.publicExposure, expectedPublicExposure, 'Expected control state policy exposure to match strategy gate.');
  assert.equal(policy.mapPrecision, expectedMapPrecision, 'Expected control state policy map precision to match state.');
  assert.equal(policy.privateLayer, expectedPrivateLayer, 'Expected control state policy private layer to match state.');

  if (state.killSwitchActive === true) {
    assert.ok(
      warnings.some((warning) => warning.includes('Kill switch is active')),
      'Expected control state kill-switch policy warning.',
    );
  }
  if (mode === 'paused') {
    assert.ok(warnings.includes('Control mode is paused.'), 'Expected control state paused policy warning.');
  }
  if (state.areaCloud === false) {
    assert.ok(
      warnings.some((warning) => warning.includes('Area-cloud masking is off')),
      'Expected control state map precision policy warning.',
    );
  }
  if (state.privateLayer === true) {
    assert.ok(
      warnings.some((warning) => warning.includes('Private client layer is visible')),
      'Expected control state private-layer policy warning.',
    );
  }

  let unauthorizedTerminal: unknown = null;

  if (ADMIN_KEY) {
    const unauthorizedResponse = await fetch(`${BASE_URL}${path}`, {
      headers: {
        accept: 'application/json',
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    const unauthorizedPayload = (await unauthorizedResponse.json().catch(() => null)) as unknown;

    assert.equal(unauthorizedResponse.status, 401, 'Expected control state without admin key to return HTTP 401.');
    assert.ok(isRecord(unauthorizedPayload), 'Expected control state unauthorized response to return JSON.');
    assert.equal(unauthorizedPayload.success, false, 'Expected control state unauthorized success=false.');
    assert.equal(unauthorizedPayload.terminal, 'Terminal 5', 'Expected control state unauthorized terminal metadata.');
    assert.equal(unauthorizedPayload.route, '/api/admin/control-state', 'Expected control state unauthorized route metadata.');
    assert.ok(typeof unauthorizedPayload.generatedAt === 'string', 'Expected control state unauthorized generatedAt metadata.');
    assert.ok(isRecord(unauthorizedPayload.state), 'Expected control state unauthorized fallback state.');
    assert.ok(isRecord(unauthorizedPayload.policy), 'Expected control state unauthorized fallback policy.');
    assert.equal(unauthorizedPayload.source, 'default', 'Expected control state unauthorized source=default.');
    assert.ok(isRecord(unauthorizedPayload.auth), 'Expected control state unauthorized auth metadata.');
    assert.ok(
      typeof unauthorizedPayload.command === 'string' && unauthorizedPayload.command.includes('inspect=policy'),
      'Expected control state unauthorized command metadata to preserve query.',
    );

    unauthorizedTerminal = unauthorizedPayload.terminal;
  }

  return {
    path,
    source: payload.source,
    terminal: payload.terminal,
    strategyGate,
    mode,
    automation: policy.automation,
    publicExposure: policy.publicExposure,
    mapPrecision: policy.mapPrecision,
    privateLayer: policy.privateLayer,
    warnings: warnings.length,
    unauthorizedTerminal,
  };
}

async function assertIntakeSignals() {
  const path = '/api/admin/intake-signals?limit=6';
  const payload = await fetchJson(path);

  assert.equal(payload.success, true, 'Expected intake signals success=true.');
  assert.equal(payload.terminal, 'Terminal 5', 'Expected intake signals terminal metadata.');
  assert.equal(payload.route, '/api/admin/intake-signals', 'Expected intake signals route metadata.');
  assert.ok(typeof payload.generatedAt === 'string', 'Expected intake signals generatedAt metadata.');
  assert.ok(
    typeof payload.command === 'string' &&
      payload.command.includes('/api/admin/intake-signals') &&
      payload.command.includes('limit=6'),
    'Expected intake signals command metadata to preserve limit query.',
  );
  assert.ok(Array.isArray(payload.signals), 'Expected intake signals payload to include signals array.');
  assert.ok(isRecord(payload.summary), 'Expected intake signals payload to include summary.');
  assert.ok(isRecord(payload.readiness), 'Expected intake signals payload to include readiness.');
  assert.ok(isRecord(payload.auth), 'Expected intake signals payload to include auth metadata.');
  assert.equal(typeof (payload.auth as JsonRecord).configured, 'boolean', 'Expected intake signals auth configured flag.');
  assert.equal(isRecord(payload.readiness) ? payload.readiness.terminal : null, 'Terminal 5', 'Expected intake signals readiness terminal metadata.');
  assert.ok(
    typeof (isRecord(payload.readiness) ? payload.readiness.nextCommand : null) === 'string' &&
      String(isRecord(payload.readiness) ? payload.readiness.nextCommand : '').includes('limit=6'),
    'Expected intake signals readiness command to preserve limit query.',
  );

  const signals = payload.signals as unknown[];
  const summary = payload.summary as JsonRecord;
  const readiness = payload.readiness as JsonRecord;
  const visibleCrmTasks = signals.filter((signal) => isRecord(signal) && signal.kind === 'crm_task').length;
  const visibleInteractions = signals.filter((signal) => isRecord(signal) && signal.kind === 'interaction').length;
  const highPrioritySignals = signals.filter((signal) => isRecord(signal) && signal.priority === 'High').length;
  const alertReadySignals = signals.filter((signal) => isRecord(signal) && isRecord(signal.alertReadiness) && signal.alertReadiness.level === 'ready').length;
  const alertWatchSignals = signals.filter((signal) => isRecord(signal) && isRecord(signal.alertReadiness) && signal.alertReadiness.level === 'watch').length;
  const alertIncompleteSignals = signals.filter((signal) => isRecord(signal) && isRecord(signal.alertReadiness) && signal.alertReadiness.level === 'incomplete').length;

  assert.ok(signals.length <= 6, 'Expected intake signals response to honor requested limit.');
  assert.equal(summary.total, signals.length, 'Expected intake signals summary total to match visible signals.');
  assert.equal(summary.crmTasks, visibleCrmTasks, 'Expected intake signals summary crmTasks to match visible signals.');
  assert.equal(summary.interactions, visibleInteractions, 'Expected intake signals summary interactions to match visible signals.');
  assert.equal(summary.highPriority, highPrioritySignals, 'Expected intake signals summary highPriority to match visible signals.');
  assert.equal(summary.alertReady, alertReadySignals, 'Expected intake signals summary alertReady to match visible signals.');
  assert.equal(summary.alertWatch, alertWatchSignals, 'Expected intake signals summary alertWatch to match visible signals.');
  assert.equal(summary.alertIncomplete, alertIncompleteSignals, 'Expected intake signals summary alertIncomplete to match visible signals.');
  assert.ok(
    typeof summary.hiddenPromotedInteractions === 'number' && summary.hiddenPromotedInteractions >= 0,
    'Expected intake signals hiddenPromotedInteractions count.',
  );
  assert.ok(
    readiness.level === 'ready' || readiness.level === 'watch' || readiness.level === 'blocked',
    'Expected intake signals readiness level.',
  );
  assert.ok(Array.isArray(readiness.gates), 'Expected intake signals readiness gates array.');
  assert.ok(
    (readiness.gates as unknown[]).some((gate) => isRecord(gate) && gate.name === 'Signal Visibility'),
    'Expected intake signals Signal Visibility gate.',
  );
  assert.ok(
    (readiness.gates as unknown[]).some((gate) => isRecord(gate) && gate.name === 'Promoted Interaction Handoff'),
    'Expected intake signals Promoted Interaction Handoff gate.',
  );
  assert.ok(
    (readiness.gates as unknown[]).some((gate) => isRecord(gate) && gate.name === 'Alert Criteria'),
    'Expected intake signals Alert Criteria gate.',
  );

  for (const signal of signals) {
    assert.ok(isRecord(signal), 'Expected intake signal entries to be objects.');
    assert.ok(typeof signal.id === 'string' && signal.id.length > 0, 'Expected intake signal id.');
    assert.ok(signal.kind === 'crm_task' || signal.kind === 'interaction', 'Expected intake signal kind.');
    assert.ok(signal.priority === 'High' || signal.priority === 'Medium' || signal.priority === 'Watch', 'Expected intake signal priority.');
    assert.ok(typeof signal.createdAt === 'string', 'Expected intake signal createdAt metadata.');
    assert.ok(isRecord(signal.alertReadiness), 'Expected intake signal alert readiness.');
    assert.ok(isRecord(signal.metadata), 'Expected intake signal metadata object.');
  }

  const promotedPath = '/api/admin/intake-signals?limit=6&includePromotedInteractions=true';
  const promotedPayload = await fetchJson(promotedPath);

  assert.equal(promotedPayload.success, true, 'Expected promoted intake signals success=true.');
  assert.equal(promotedPayload.route, '/api/admin/intake-signals', 'Expected promoted intake signals route metadata.');
  assert.ok(
    typeof promotedPayload.command === 'string' &&
      promotedPayload.command.includes('limit=6') &&
      promotedPayload.command.includes('includePromotedInteractions=true'),
    'Expected promoted intake signals command metadata to preserve includePromotedInteractions query.',
  );
  assert.ok(isRecord(promotedPayload.summary), 'Expected promoted intake signals payload to include summary.');
  assert.ok(Array.isArray(promotedPayload.signals), 'Expected promoted intake signals payload to include signals array.');
  assert.ok(promotedPayload.signals.length <= 6, 'Expected promoted intake signals response to honor requested limit.');
  assert.equal(
    (promotedPayload.summary as JsonRecord).total,
    promotedPayload.signals.length,
    'Expected promoted intake signals summary total to match visible signals.',
  );
  assert.equal(
    (promotedPayload.summary as JsonRecord).hiddenPromotedInteractions,
    0,
    'Expected promoted intake signals response to include promoted interactions instead of hiding them.',
  );

  const boundedPath = '/api/admin/intake-signals?limit=999&includePromotedInteractions=yes';
  const boundedPayload = await fetchJson(boundedPath);

  assert.equal(boundedPayload.success, true, 'Expected bounded intake signals success=true.');
  assert.equal(boundedPayload.route, '/api/admin/intake-signals', 'Expected bounded intake signals route metadata.');
  assert.ok(
    typeof boundedPayload.command === 'string' &&
      boundedPayload.command.includes('limit=999') &&
      boundedPayload.command.includes('includePromotedInteractions=yes'),
    'Expected bounded intake signals command metadata to preserve raw query.',
  );
  assert.ok(Array.isArray(boundedPayload.signals), 'Expected bounded intake signals payload to include signals array.');
  assert.ok(boundedPayload.signals.length <= 50, 'Expected bounded intake signals response to clamp oversized limit.');
  assert.ok(isRecord(boundedPayload.summary), 'Expected bounded intake signals summary metadata.');
  assert.equal(
    (boundedPayload.summary as JsonRecord).total,
    boundedPayload.signals.length,
    'Expected bounded intake signals summary total to match visible signals.',
  );

  let unauthorizedTerminal: unknown = null;

  if (ADMIN_KEY) {
    const unauthorizedResponse = await fetch(`${BASE_URL}${promotedPath}`, {
      headers: {
        accept: 'application/json',
      },
    });
    const unauthorizedPayload = (await unauthorizedResponse.json().catch(() => null)) as unknown;

    assert.equal(unauthorizedResponse.status, 401, 'Expected intake signals without admin key to return HTTP 401.');
    assert.ok(isRecord(unauthorizedPayload), 'Expected intake signals unauthorized response to return JSON.');
    assert.equal(unauthorizedPayload.success, false, 'Expected intake signals unauthorized success=false.');
    assert.equal(unauthorizedPayload.terminal, 'Terminal 5', 'Expected intake signals unauthorized terminal metadata.');
    assert.equal(unauthorizedPayload.route, '/api/admin/intake-signals', 'Expected intake signals unauthorized route metadata.');
    assert.ok(typeof unauthorizedPayload.generatedAt === 'string', 'Expected intake signals unauthorized generatedAt metadata.');
    assert.ok(Array.isArray(unauthorizedPayload.signals), 'Expected intake signals unauthorized fallback signals array.');
    assert.equal(unauthorizedPayload.signals.length, 0, 'Expected intake signals unauthorized response to avoid exposing signals.');
    assert.ok(isRecord(unauthorizedPayload.summary), 'Expected intake signals unauthorized summary metadata.');
    assert.ok(isRecord(unauthorizedPayload.readiness), 'Expected intake signals unauthorized readiness metadata.');
    assert.ok(isRecord(unauthorizedPayload.auth), 'Expected intake signals unauthorized auth metadata.');
    assert.equal(isRecord(unauthorizedPayload.readiness) ? unauthorizedPayload.readiness.terminal : null, 'Terminal 5', 'Expected intake signals unauthorized readiness terminal.');
    assert.ok(
      typeof unauthorizedPayload.command === 'string' &&
        unauthorizedPayload.command.includes('limit=6') &&
        unauthorizedPayload.command.includes('includePromotedInteractions=true'),
      'Expected intake signals unauthorized command metadata to preserve query.',
    );

    unauthorizedTerminal = unauthorizedPayload.terminal;
  }

  let detailReadiness: unknown = null;
  let detailInspectionSource: unknown = null;
  let unauthorizedDetailInspectionSource: unknown = null;
  let missingDetailReadiness: unknown = null;
  const firstSignal = payload.signals[0] as unknown;

  if (isRecord(firstSignal) && typeof firstSignal.id === 'string' && typeof firstSignal.kind === 'string') {
    const firstSignalId = firstSignal.id;
    const firstSignalKind = firstSignal.kind;
    const detailPath = `/api/admin/intake-signals/${encodeURIComponent(firstSignalId)}?kind=${encodeURIComponent(firstSignalKind)}`;
    const detailPayload = await fetchJson(detailPath);

    assert.equal(detailPayload.success, true, 'Expected intake signal detail success=true.');
    assert.equal(detailPayload.inspectionSource, 'Detail Route', 'Expected intake signal detail inspectionSource=Detail Route.');
    assert.equal(detailPayload.terminal, 'Terminal 5', 'Expected intake signal detail terminal metadata.');
    assert.equal(detailPayload.route, `/api/admin/intake-signals/${firstSignalId}`, 'Expected intake signal detail route metadata.');
    assert.ok(typeof detailPayload.generatedAt === 'string', 'Expected intake signal detail generatedAt metadata.');
    assert.ok(
      typeof detailPayload.command === 'string' &&
        detailPayload.command.includes(`/api/admin/intake-signals/${firstSignalId}`) &&
        detailPayload.command.includes(`kind=${firstSignalKind}`),
      'Expected intake signal detail command metadata to preserve kind query.',
    );
    assert.ok(isRecord(detailPayload.signal), 'Expected intake signal detail payload to include signal.');
    assert.ok(isRecord(detailPayload.readiness), 'Expected intake signal detail payload to include readiness.');
    assert.ok(isRecord(detailPayload.auth), 'Expected intake signal detail auth metadata.');
    assert.equal(typeof (detailPayload.auth as JsonRecord).configured, 'boolean', 'Expected intake signal detail auth configured flag.');
    assert.equal(isRecord(detailPayload.readiness) ? detailPayload.readiness.terminal : null, 'Terminal 5', 'Expected intake signal detail readiness terminal metadata.');
    assert.ok(
      typeof (isRecord(detailPayload.readiness) ? detailPayload.readiness.nextCommand : null) === 'string' &&
        String(isRecord(detailPayload.readiness) ? detailPayload.readiness.nextCommand : '').includes(`kind=${firstSignalKind}`),
      'Expected intake signal detail readiness command to preserve kind query.',
    );

    const detailSignal = detailPayload.signal as JsonRecord;
    const detailReadinessPayload = detailPayload.readiness as JsonRecord;

    assert.equal(detailSignal.id, firstSignalId, 'Expected intake signal detail id to match list signal.');
    assert.equal(detailSignal.kind, firstSignalKind, 'Expected intake signal detail kind to match list signal.');
    assert.ok(detailSignal.priority === 'High' || detailSignal.priority === 'Medium' || detailSignal.priority === 'Watch', 'Expected intake signal detail priority.');
    assert.ok(typeof detailSignal.createdAt === 'string', 'Expected intake signal detail createdAt metadata.');
    assert.ok(isRecord(detailSignal.metadata), 'Expected intake signal detail metadata object.');
    assert.ok(isRecord(detailSignal.alertReadiness), 'Expected intake signal detail alert readiness.');
    assert.ok(
      detailReadinessPayload.level === 'ready' || detailReadinessPayload.level === 'watch' || detailReadinessPayload.level === 'blocked',
      'Expected intake signal detail readiness level.',
    );
    assert.ok(Array.isArray(detailReadinessPayload.gates), 'Expected intake signal detail readiness gates array.');
    assert.ok(
      (detailReadinessPayload.gates as unknown[]).some((gate) => isRecord(gate) && gate.name === 'Signal Visibility'),
      'Expected intake signal detail Signal Visibility gate.',
    );
    assert.ok(
      (detailReadinessPayload.gates as unknown[]).some((gate) => isRecord(gate) && gate.name === 'Promotion State'),
      'Expected intake signal detail Promotion State gate.',
    );
    assert.ok(
      (detailReadinessPayload.gates as unknown[]).some((gate) => isRecord(gate) && gate.name === 'Alert Criteria'),
      'Expected intake signal detail Alert Criteria gate.',
    );
    assert.ok(
      (detailReadinessPayload.gates as unknown[]).some((gate) => isRecord(gate) && gate.name === 'Review State'),
      'Expected intake signal detail Review State gate.',
    );

    detailInspectionSource = detailPayload.inspectionSource;
    detailReadiness = isRecord(detailPayload.readiness) ? detailPayload.readiness.level : null;

    const missingDetailPath = `/api/admin/intake-signals/ops-smoke-missing-signal?kind=${encodeURIComponent(firstSignalKind)}`;
    const missingHeaders: Record<string, string> = {
      accept: 'application/json',
    };

    if (ADMIN_KEY) {
      missingHeaders['x-admin-key'] = ADMIN_KEY;
    }

    const missingResponse = await fetch(`${BASE_URL}${missingDetailPath}`, {
      headers: missingHeaders,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    const missingPayload = (await missingResponse.json().catch(() => null)) as unknown;

    assert.equal(missingResponse.status, 404, 'Expected missing intake signal detail to return HTTP 404.');
    assert.ok(isRecord(missingPayload), 'Expected missing intake signal detail response to return JSON.');
    assert.equal(missingPayload.success, false, 'Expected missing intake signal detail success=false.');
    assert.equal(missingPayload.inspectionSource, 'Detail Route', 'Expected missing intake signal detail inspectionSource=Detail Route.');
    assert.equal(missingPayload.terminal, 'Terminal 5', 'Expected missing intake signal detail terminal metadata.');
    assert.equal(missingPayload.route, '/api/admin/intake-signals/ops-smoke-missing-signal', 'Expected missing intake signal detail route metadata.');
    assert.equal('signal' in missingPayload, false, 'Expected missing intake signal detail response to avoid exposing signal data.');
    assert.ok(isRecord(missingPayload.readiness), 'Expected missing intake signal detail readiness metadata.');
    assert.ok(isRecord(missingPayload.auth), 'Expected missing intake signal detail auth metadata.');
    assert.equal(typeof (missingPayload.auth as JsonRecord).configured, 'boolean', 'Expected missing intake signal detail auth configured flag.');
    assert.equal(
      isRecord(missingPayload.readiness) ? missingPayload.readiness.level : null,
      'blocked',
      'Expected missing intake signal detail readiness to be blocked.',
    );
    assert.ok(
      typeof missingPayload.command === 'string' &&
        missingPayload.command.includes('/api/admin/intake-signals/ops-smoke-missing-signal') &&
        missingPayload.command.includes(`kind=${firstSignalKind}`),
      'Expected missing intake signal detail command metadata to preserve kind query.',
    );

    missingDetailReadiness = isRecord(missingPayload.readiness) ? missingPayload.readiness.level : null;

    if (ADMIN_KEY) {
      const unauthorizedResponse = await fetch(`${BASE_URL}${detailPath}`, {
        headers: {
          accept: 'application/json',
        },
      });
      const unauthorizedPayload = (await unauthorizedResponse.json().catch(() => null)) as unknown;

      assert.equal(unauthorizedResponse.status, 401, 'Expected intake signal detail without admin key to return HTTP 401.');
      assert.ok(isRecord(unauthorizedPayload), 'Expected intake signal detail unauthorized response to return JSON.');
      assert.equal(unauthorizedPayload.success, false, 'Expected intake signal detail unauthorized success=false.');
      assert.equal(unauthorizedPayload.inspectionSource, 'Detail Route', 'Expected intake signal detail unauthorized inspectionSource=Detail Route.');
      assert.equal(unauthorizedPayload.terminal, 'Terminal 5', 'Expected intake signal detail unauthorized terminal metadata.');
      assert.equal(unauthorizedPayload.route, `/api/admin/intake-signals/${firstSignalId}`, 'Expected intake signal detail unauthorized route metadata.');
      assert.ok(typeof unauthorizedPayload.generatedAt === 'string', 'Expected intake signal detail unauthorized generatedAt metadata.');
      assert.equal('signal' in unauthorizedPayload, false, 'Expected intake signal detail unauthorized response to avoid exposing signal data.');
      assert.ok(isRecord(unauthorizedPayload.readiness), 'Expected intake signal detail unauthorized readiness metadata.');
      assert.equal(
        isRecord(unauthorizedPayload.readiness) ? unauthorizedPayload.readiness.terminal : null,
        'Terminal 5',
        'Expected intake signal detail unauthorized readiness terminal.',
      );
      assert.ok(isRecord(unauthorizedPayload.auth), 'Expected intake signal detail unauthorized auth metadata.');
      assert.ok(
        typeof unauthorizedPayload.command === 'string' &&
          unauthorizedPayload.command.includes(`/api/admin/intake-signals/${firstSignalId}`) &&
          unauthorizedPayload.command.includes(`kind=${firstSignalKind}`),
        'Expected intake signal detail unauthorized command metadata to preserve kind query.',
      );

      unauthorizedDetailInspectionSource = unauthorizedPayload.inspectionSource;
    }
  }

  return {
    path,
    terminal: payload.terminal,
    total: isRecord(payload.summary) ? payload.summary.total : null,
    highPriority: isRecord(payload.summary) ? payload.summary.highPriority : null,
    hiddenPromotedInteractions: isRecord(payload.summary) ? payload.summary.hiddenPromotedInteractions : null,
    promotedHiddenPromotedInteractions: isRecord(promotedPayload.summary) ? promotedPayload.summary.hiddenPromotedInteractions : null,
    boundedReturned: Array.isArray(boundedPayload.signals) ? boundedPayload.signals.length : null,
    unauthorizedTerminal,
    detailInspectionSource,
    unauthorizedDetailInspectionSource,
    readiness: isRecord(payload.readiness) ? payload.readiness.level : null,
    detailReadiness,
    missingDetailReadiness,
  };
}

async function assertCRMTasks() {
  const path = '/api/admin/crm-tasks?status=active&limit=6';
  const payload = await fetchJson(path);

  assert.equal(payload.success, true, 'Expected CRM tasks success=true.');
  assert.equal(payload.inspectionSource, 'List Route', 'Expected CRM task list inspectionSource=List Route.');
  assert.equal(payload.route, '/api/admin/crm-tasks', 'Expected CRM task list route metadata.');
  assert.ok(typeof payload.generatedAt === 'string', 'Expected CRM task list generatedAt metadata.');
  assert.ok(typeof payload.command === 'string' && payload.command.includes('/api/admin/crm-tasks'), 'Expected CRM task list command metadata.');
  assert.ok(payload.command.includes('status=active'), 'Expected CRM task list command to preserve status query.');
  assert.ok(payload.command.includes('limit=6'), 'Expected CRM task list command to preserve limit query.');
  assert.ok(Array.isArray(payload.tasks), 'Expected CRM tasks payload to include tasks array.');
  assert.ok(isRecord(payload.summary), 'Expected CRM tasks payload to include summary.');
  assert.ok(isRecord(payload.audit), 'Expected CRM tasks payload to include audit.');
  assert.ok(isRecord(payload.readiness), 'Expected CRM tasks payload to include readiness.');
  assert.ok(isRecord(payload.filters), 'Expected CRM tasks payload to include filters.');
  assert.ok(isRecord(payload.operations), 'Expected CRM tasks payload to include operations.');
  assert.ok(isRecord(payload.auth), 'Expected CRM tasks payload to include auth metadata.');
  assert.equal(typeof (payload.auth as JsonRecord).configured, 'boolean', 'Expected CRM task list auth configured flag.');
  assert.equal(isRecord(payload.filters) ? payload.filters.limit : null, 6, 'Expected CRM task list filters to preserve limit.');
  assert.equal(isRecord(payload.filters) ? payload.filters.status : null, 'active', 'Expected CRM task list filters to preserve status.');
  assert.ok(Array.isArray(isRecord(payload.filters) ? payload.filters.effectiveStatuses : null), 'Expected CRM task list filters to include effective statuses.');
  assert.deepEqual(
    isRecord(payload.filters) ? payload.filters.effectiveStatuses : null,
    ['pending', 'reviewing'],
    'Expected CRM task list active filter to expand to pending and reviewing statuses.',
  );
  assert.equal(isRecord(payload.operations) ? payload.operations.terminal : null, 'Terminal 5', 'Expected CRM task list operations terminal.');
  assert.ok(
    typeof (isRecord(payload.operations) ? payload.operations.intakeCommand : null) === 'string' &&
      String((payload.operations as JsonRecord).intakeCommand).includes('/api/admin/intake-signals?limit=6') &&
      String((payload.operations as JsonRecord).intakeCommand).includes('x-admin-key'),
    'Expected CRM task list operations intake command to be bounded and protected.',
  );
  assert.ok(
    typeof (isRecord(payload.operations) ? payload.operations.alertStatusCommand : null) === 'string' &&
      String((payload.operations as JsonRecord).alertStatusCommand).includes('/api/process-alerts?limit=6'),
    'Expected CRM task list operations alert status command to be bounded.',
  );

  const tasks = payload.tasks as unknown[];
  const summary = payload.summary as JsonRecord;
  const audit = payload.audit as JsonRecord;
  const readiness = payload.readiness as JsonRecord;
  const pendingTasks = tasks.filter((task) => isRecord(task) && task.status === 'pending').length;
  const reviewingTasks = tasks.filter((task) => isRecord(task) && task.status === 'reviewing').length;
  const completedTasks = tasks.filter((task) => isRecord(task) && task.status === 'completed').length;
  const dismissedTasks = tasks.filter((task) => isRecord(task) && task.status === 'dismissed').length;
  const highPriorityTasks = tasks.filter((task) => isRecord(task) && task.priority === 'high').length;
  const mediumPriorityTasks = tasks.filter((task) => isRecord(task) && task.priority === 'medium').length;
  const lowPriorityTasks = tasks.filter((task) => isRecord(task) && task.priority === 'low').length;
  const strategyIntakes = tasks.filter((task) => isRecord(task) && task.type === 'strategy_intake').length;
  const propertyInquiries = tasks.filter((task) => isRecord(task) && task.type === 'property_inquiry').length;
  const alertReadyTasks = tasks.filter((task) => isRecord(task) && isRecord(task.alertReadiness) && task.alertReadiness.level === 'ready').length;
  const alertWatchTasks = tasks.filter((task) => isRecord(task) && isRecord(task.alertReadiness) && task.alertReadiness.level === 'watch').length;
  const alertIncompleteTasks = tasks.filter((task) => isRecord(task) && isRecord(task.alertReadiness) && task.alertReadiness.level === 'incomplete').length;
  const alertUnknownTasks = tasks.filter((task) => isRecord(task) && isRecord(task.alertReadiness) && task.alertReadiness.level === 'unknown').length;

  assert.ok(tasks.length <= 6, 'Expected CRM task list to honor requested limit.');
  assert.equal(summary.total, tasks.length, 'Expected CRM task summary total to match visible tasks.');
  assert.equal(summary.pending, pendingTasks, 'Expected CRM task summary pending count to match visible tasks.');
  assert.equal(summary.reviewing, reviewingTasks, 'Expected CRM task summary reviewing count to match visible tasks.');
  assert.equal(summary.completed, completedTasks, 'Expected CRM task summary completed count to match visible tasks.');
  assert.equal(summary.dismissed, dismissedTasks, 'Expected CRM task summary dismissed count to match visible tasks.');
  assert.equal(summary.highPriority, highPriorityTasks, 'Expected CRM task summary highPriority count to match visible tasks.');
  assert.equal(summary.mediumPriority, mediumPriorityTasks, 'Expected CRM task summary mediumPriority count to match visible tasks.');
  assert.equal(summary.lowPriority, lowPriorityTasks, 'Expected CRM task summary lowPriority count to match visible tasks.');
  assert.equal(summary.strategyIntakes, strategyIntakes, 'Expected CRM task summary strategyIntakes count to match visible tasks.');
  assert.equal(summary.propertyInquiries, propertyInquiries, 'Expected CRM task summary propertyInquiries count to match visible tasks.');
  assert.equal(summary.alertReady, alertReadyTasks, 'Expected CRM task summary alertReady count to match visible tasks.');
  assert.equal(summary.alertWatch, alertWatchTasks, 'Expected CRM task summary alertWatch count to match visible tasks.');
  assert.equal(summary.alertIncomplete, alertIncompleteTasks, 'Expected CRM task summary alertIncomplete count to match visible tasks.');
  assert.equal(summary.alertUnknown, alertUnknownTasks, 'Expected CRM task summary alertUnknown count to match visible tasks.');
  assert.equal(
    Number(audit.closureReviewReady) + Number(audit.closureReviewMissing),
    audit.closed,
    'Expected CRM task audit closure counts to reconcile.',
  );
  assert.ok(
    typeof audit.closureReviewCoveragePercent === 'number' &&
      audit.closureReviewCoveragePercent >= 0 &&
      audit.closureReviewCoveragePercent <= 100,
    'Expected CRM task audit coverage percent to be bounded.',
  );
  assert.ok(
    readiness.level === 'ready' || readiness.level === 'watch' || readiness.level === 'blocked',
    'Expected CRM task list readiness level.',
  );
  assert.ok(Array.isArray(readiness.gates), 'Expected CRM task list readiness gates array.');
  assert.ok(
    (readiness.gates as unknown[]).some((gate) => isRecord(gate) && gate.label === 'Closure Audit'),
    'Expected CRM task list Closure Audit readiness gate.',
  );
  assert.ok(
    (readiness.gates as unknown[]).some((gate) => isRecord(gate) && gate.label === 'Active Review'),
    'Expected CRM task list Active Review readiness gate.',
  );
  assert.ok(
    (readiness.gates as unknown[]).some((gate) => isRecord(gate) && gate.label === 'Alert Criteria'),
    'Expected CRM task list Alert Criteria readiness gate.',
  );

  for (const task of tasks) {
    assert.ok(isRecord(task), 'Expected CRM task entries to be objects.');
    assert.ok(typeof task.id === 'string' && task.id.length > 0, 'Expected CRM task id.');
    assert.ok(typeof task.leadId === 'string' && task.leadId.length > 0, 'Expected CRM task lead id.');
    assert.ok(typeof task.createdAt === 'string', 'Expected CRM task createdAt metadata.');
    assert.ok(task.priority === 'high' || task.priority === 'medium' || task.priority === 'low' || task.priority === 'unknown', 'Expected CRM task priority.');
    assert.ok(isRecord(task.alertReadiness), 'Expected CRM task alert readiness.');
    assert.ok(isRecord(task.operations), 'Expected CRM task operations metadata.');
    assert.equal(isRecord(task.operations) ? task.operations.terminal : null, 'Terminal 5', 'Expected CRM task row operations terminal.');
  }

  const filteredPath = '/api/admin/crm-tasks?status=all&type=strategy_intake&limit=4';
  const filteredPayload = await fetchJson(filteredPath);

  assert.equal(filteredPayload.success, true, 'Expected filtered CRM task list success=true.');
  assert.equal(filteredPayload.inspectionSource, 'List Route', 'Expected filtered CRM task list inspectionSource=List Route.');
  assert.equal(filteredPayload.route, '/api/admin/crm-tasks', 'Expected filtered CRM task list route metadata.');
  assert.ok(
    typeof filteredPayload.command === 'string' &&
      filteredPayload.command.includes('status=all') &&
      filteredPayload.command.includes('type=strategy_intake') &&
      filteredPayload.command.includes('limit=4'),
    'Expected filtered CRM task list command metadata to preserve status, type, and limit.',
  );
  assert.equal(isRecord(filteredPayload.filters) ? filteredPayload.filters.status : null, 'all', 'Expected filtered CRM task list status filter.');
  assert.equal(isRecord(filteredPayload.filters) ? filteredPayload.filters.type : null, 'strategy_intake', 'Expected filtered CRM task list type filter.');
  assert.equal(isRecord(filteredPayload.filters) ? filteredPayload.filters.limit : null, 4, 'Expected filtered CRM task list limit filter.');
  assert.equal(isRecord(filteredPayload.filters) ? filteredPayload.filters.effectiveStatuses : null, null, 'Expected filtered CRM task list all status to omit effective statuses.');
  assert.ok(Array.isArray(filteredPayload.tasks), 'Expected filtered CRM task list tasks array.');
  assert.ok(filteredPayload.tasks.length <= 4, 'Expected filtered CRM task list to honor requested limit.');
  assert.equal(isRecord(filteredPayload.summary) ? filteredPayload.summary.total : null, filteredPayload.tasks.length, 'Expected filtered CRM task summary total to match visible tasks.');

  const boundedPath = '/api/admin/crm-tasks?status=active!!&type=strategy_intake&limit=999';
  const boundedPayload = await fetchJson(boundedPath);

  assert.equal(boundedPayload.success, true, 'Expected bounded CRM task list success=true.');
  assert.equal(boundedPayload.inspectionSource, 'List Route', 'Expected bounded CRM task list inspectionSource=List Route.');
  assert.equal(boundedPayload.route, '/api/admin/crm-tasks', 'Expected bounded CRM task list route metadata.');
  assert.ok(
    typeof boundedPayload.command === 'string' &&
      boundedPayload.command.includes('status=active!!') &&
      boundedPayload.command.includes('type=strategy_intake') &&
      boundedPayload.command.includes('limit=999'),
    'Expected bounded CRM task list command metadata to preserve raw query.',
  );
  assert.equal(isRecord(boundedPayload.filters) ? boundedPayload.filters.status : null, 'active', 'Expected bounded CRM task list sanitized status filter.');
  assert.equal(isRecord(boundedPayload.filters) ? boundedPayload.filters.limit : null, 100, 'Expected bounded CRM task list to clamp oversized limit.');
  assert.ok(Array.isArray(boundedPayload.tasks), 'Expected bounded CRM task list tasks array.');
  assert.ok(boundedPayload.tasks.length <= 100, 'Expected bounded CRM task list response to honor max limit.');
  assert.equal(isRecord(boundedPayload.summary) ? boundedPayload.summary.total : null, boundedPayload.tasks.length, 'Expected bounded CRM task summary total to match visible tasks.');

  let detailStatus: unknown = null;
  let detailInspectionSource: unknown = null;
  let missingDetailInspectionSource: unknown = null;
  let unauthorizedListInspectionSource: unknown = null;
  let unauthorizedInspectionSource: unknown = null;
  const firstTask = payload.tasks[0] as unknown;

  if (ADMIN_KEY) {
    const unauthorizedListResponse = await fetch(`${BASE_URL}${filteredPath}`, {
      headers: {
        accept: 'application/json',
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    const unauthorizedListPayload = (await unauthorizedListResponse.json().catch(() => null)) as unknown;

    assert.equal(unauthorizedListResponse.status, 401, 'Expected CRM task list without admin key to return HTTP 401.');
    assert.ok(isRecord(unauthorizedListPayload), 'Expected CRM task list unauthorized response to return JSON.');
    assert.equal(unauthorizedListPayload.success, false, 'Expected CRM task list unauthorized success=false.');
    assert.equal(unauthorizedListPayload.inspectionSource, 'List Route', 'Expected CRM task list unauthorized inspectionSource=List Route.');
    assert.equal(unauthorizedListPayload.route, '/api/admin/crm-tasks', 'Expected CRM task list unauthorized route metadata.');
    assert.ok(typeof unauthorizedListPayload.generatedAt === 'string', 'Expected CRM task list unauthorized generatedAt metadata.');
    assert.ok(Array.isArray(unauthorizedListPayload.tasks), 'Expected CRM task list unauthorized fallback tasks array.');
    assert.equal(unauthorizedListPayload.tasks.length, 0, 'Expected CRM task list unauthorized response to avoid exposing tasks.');
    assert.ok(isRecord(unauthorizedListPayload.summary), 'Expected CRM task list unauthorized summary metadata.');
    assert.ok(isRecord(unauthorizedListPayload.audit), 'Expected CRM task list unauthorized audit metadata.');
    assert.ok(isRecord(unauthorizedListPayload.readiness), 'Expected CRM task list unauthorized readiness metadata.');
    assert.equal(
      isRecord(unauthorizedListPayload.readiness) ? unauthorizedListPayload.readiness.terminal : null,
      'Terminal 5',
      'Expected CRM task list unauthorized readiness terminal.',
    );
    assert.ok(isRecord(unauthorizedListPayload.filters), 'Expected CRM task list unauthorized filters metadata.');
    assert.equal(isRecord(unauthorizedListPayload.filters) ? unauthorizedListPayload.filters.limit : null, 4, 'Expected CRM task list unauthorized limit filter.');
    assert.equal(isRecord(unauthorizedListPayload.filters) ? unauthorizedListPayload.filters.status : null, 'all', 'Expected CRM task list unauthorized status filter.');
    assert.equal(isRecord(unauthorizedListPayload.filters) ? unauthorizedListPayload.filters.type : null, 'strategy_intake', 'Expected CRM task list unauthorized type filter.');
    assert.ok(isRecord(unauthorizedListPayload.operations), 'Expected CRM task list unauthorized operations metadata.');
    assert.equal(isRecord(unauthorizedListPayload.operations) ? unauthorizedListPayload.operations.terminal : null, 'Terminal 5', 'Expected CRM task list unauthorized operations terminal.');
    assert.ok(isRecord(unauthorizedListPayload.auth), 'Expected CRM task list unauthorized auth metadata.');
    assert.equal(typeof (unauthorizedListPayload.auth as JsonRecord).configured, 'boolean', 'Expected CRM task list unauthorized auth configured flag.');
    assert.equal(
      isRecord(unauthorizedListPayload.readiness) ? unauthorizedListPayload.readiness.level : null,
      'blocked',
      'Expected CRM task list unauthorized readiness to be blocked.',
    );
    assert.ok(
      typeof unauthorizedListPayload.command === 'string' &&
        unauthorizedListPayload.command.includes('status=all') &&
        unauthorizedListPayload.command.includes('type=strategy_intake') &&
        unauthorizedListPayload.command.includes('limit=4'),
      'Expected CRM task list unauthorized command metadata to preserve query.',
    );

    unauthorizedListInspectionSource = unauthorizedListPayload.inspectionSource;
  }

  if (isRecord(firstTask) && typeof firstTask.id === 'string') {
    const firstTaskId = firstTask.id;
    const detailPath = `/api/admin/crm-tasks/${encodeURIComponent(firstTaskId)}?inspect=detail`;
    const detailPayload = await fetchJson(detailPath);

    assert.equal(detailPayload.success, true, 'Expected CRM task detail success=true.');
    assert.equal(detailPayload.inspectionSource, 'Detail Route', 'Expected CRM task detail inspectionSource=Detail Route.');
    assert.equal(detailPayload.route, `/api/admin/crm-tasks/${firstTaskId}`, 'Expected CRM task detail route metadata.');
    assert.ok(typeof detailPayload.generatedAt === 'string', 'Expected CRM task detail generatedAt metadata.');
    assert.ok(
      typeof detailPayload.command === 'string' &&
        detailPayload.command.includes(`/api/admin/crm-tasks/${firstTaskId}`) &&
        detailPayload.command.includes('inspect=detail'),
      'Expected CRM task detail command metadata to preserve query.',
    );
    assert.ok(isRecord(detailPayload.task), 'Expected CRM task detail payload to include task.');
    assert.ok(isRecord(detailPayload.operations), 'Expected CRM task detail payload to include top-level operations.');
    assert.ok(isRecord(detailPayload.auth), 'Expected CRM task detail auth metadata.');
    assert.equal(typeof (detailPayload.auth as JsonRecord).configured, 'boolean', 'Expected CRM task detail auth configured flag.');
    assert.equal(isRecord(detailPayload.operations) ? detailPayload.operations.terminal : null, 'Terminal 5', 'Expected CRM task detail operations terminal.');
    assert.ok(
      isRecord(detailPayload.task) &&
        isRecord(detailPayload.task.operations) &&
        typeof detailPayload.task.operations.intakeCommand === 'string' &&
        detailPayload.task.operations.intakeCommand.includes('/api/admin/intake-signals?limit=6'),
      'Expected CRM task detail operations intake command to be bounded.',
    );

    const detailTask = detailPayload.task as JsonRecord;

    assert.equal(detailTask.id, firstTaskId, 'Expected CRM task detail id to match list task.');
    assert.ok(typeof detailTask.leadId === 'string' && detailTask.leadId.length > 0, 'Expected CRM task detail lead id.');
    assert.ok(typeof detailTask.createdAt === 'string', 'Expected CRM task detail createdAt metadata.');
    assert.ok(
      detailTask.priority === 'high' || detailTask.priority === 'medium' || detailTask.priority === 'low' || detailTask.priority === 'unknown',
      'Expected CRM task detail priority.',
    );
    assert.ok(typeof detailTask.nextAction === 'string' && detailTask.nextAction.length > 0, 'Expected CRM task detail next action.');
    assert.ok(isRecord(detailTask.alertReadiness), 'Expected CRM task detail alert readiness.');
    assert.ok(isRecord(detailTask.operations), 'Expected CRM task detail row operations metadata.');
    assert.equal(isRecord(detailTask.operations) ? detailTask.operations.terminal : null, 'Terminal 5', 'Expected CRM task detail row operations terminal.');
    assert.ok(isRecord(detailTask.metadata), 'Expected CRM task detail metadata object.');

    detailStatus = detailTask.status;
    detailInspectionSource = detailPayload.inspectionSource;

    const missingDetailPath = '/api/admin/crm-tasks/ops-smoke-missing-task?inspect=detail';
    const missingHeaders: Record<string, string> = {
      accept: 'application/json',
    };

    if (ADMIN_KEY) {
      missingHeaders['x-admin-key'] = ADMIN_KEY;
    }

    const missingResponse = await fetch(`${BASE_URL}${missingDetailPath}`, {
      headers: missingHeaders,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    const missingPayload = (await missingResponse.json().catch(() => null)) as unknown;

    assert.equal(missingResponse.status, 404, 'Expected missing CRM task detail to return HTTP 404.');
    assert.ok(isRecord(missingPayload), 'Expected missing CRM task detail response to return JSON.');
    assert.equal(missingPayload.success, false, 'Expected missing CRM task detail success=false.');
    assert.equal(missingPayload.inspectionSource, 'Detail Route', 'Expected missing CRM task detail inspectionSource=Detail Route.');
    assert.equal(missingPayload.route, '/api/admin/crm-tasks/ops-smoke-missing-task', 'Expected missing CRM task detail route metadata.');
    assert.equal('task' in missingPayload, false, 'Expected missing CRM task detail response to avoid exposing task data.');
    assert.ok(isRecord(missingPayload.operations), 'Expected missing CRM task detail operations metadata.');
    assert.equal(isRecord(missingPayload.operations) ? missingPayload.operations.terminal : null, 'Terminal 5', 'Expected missing CRM task detail operations terminal.');
    assert.ok(isRecord(missingPayload.auth), 'Expected missing CRM task detail auth metadata.');
    assert.equal(typeof (missingPayload.auth as JsonRecord).configured, 'boolean', 'Expected missing CRM task detail auth configured flag.');
    assert.ok(
      typeof missingPayload.command === 'string' &&
        missingPayload.command.includes('/api/admin/crm-tasks/ops-smoke-missing-task') &&
        missingPayload.command.includes('inspect=detail'),
      'Expected missing CRM task detail command metadata to preserve query.',
    );

    missingDetailInspectionSource = missingPayload.inspectionSource;

    if (ADMIN_KEY) {
      const unauthorizedResponse = await fetch(`${BASE_URL}${detailPath}`, {
        headers: {
          accept: 'application/json',
        },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      const unauthorizedPayload = (await unauthorizedResponse.json().catch(() => null)) as unknown;

      assert.equal(unauthorizedResponse.status, 401, 'Expected CRM task detail without admin key to return HTTP 401.');
      assert.ok(isRecord(unauthorizedPayload), 'Expected CRM task detail unauthorized response to return JSON.');
      assert.equal(unauthorizedPayload.success, false, 'Expected CRM task detail unauthorized success=false.');
      assert.equal(unauthorizedPayload.inspectionSource, 'Detail Route', 'Expected CRM task detail unauthorized inspectionSource=Detail Route.');
      assert.equal(unauthorizedPayload.route, `/api/admin/crm-tasks/${firstTaskId}`, 'Expected CRM task detail unauthorized route metadata.');
      assert.equal('task' in unauthorizedPayload, false, 'Expected CRM task detail unauthorized response to avoid exposing task data.');
      assert.ok(isRecord(unauthorizedPayload.operations), 'Expected CRM task detail unauthorized operations metadata.');
      assert.equal(isRecord(unauthorizedPayload.operations) ? unauthorizedPayload.operations.terminal : null, 'Terminal 5', 'Expected CRM task detail unauthorized operations terminal.');
      assert.ok(isRecord(unauthorizedPayload.auth), 'Expected CRM task detail unauthorized auth metadata.');
      assert.equal(typeof (unauthorizedPayload.auth as JsonRecord).configured, 'boolean', 'Expected CRM task detail unauthorized auth configured flag.');
      assert.ok(
        typeof unauthorizedPayload.command === 'string' &&
          unauthorizedPayload.command.includes(`/api/admin/crm-tasks/${firstTaskId}`) &&
          unauthorizedPayload.command.includes('inspect=detail'),
        'Expected CRM task detail unauthorized command metadata to preserve query.',
      );

      unauthorizedInspectionSource = unauthorizedPayload.inspectionSource;
    }
  }

  return {
    path,
    total: isRecord(payload.summary) ? payload.summary.total : null,
    pending: isRecord(payload.summary) ? payload.summary.pending : null,
    reviewing: isRecord(payload.summary) ? payload.summary.reviewing : null,
    closureReviewCoveragePercent: isRecord(payload.audit) ? payload.audit.closureReviewCoveragePercent : null,
    readiness: isRecord(payload.readiness) ? payload.readiness.level : null,
    inspectionSource: payload.inspectionSource,
    filteredType: isRecord(filteredPayload.filters) ? filteredPayload.filters.type : null,
    boundedLimit: isRecord(boundedPayload.filters) ? boundedPayload.filters.limit : null,
    detailInspectionSource,
    missingDetailInspectionSource,
    detailStatus,
    unauthorizedListInspectionSource,
    unauthorizedInspectionSource,
  };
}

async function assertMlsRetryStatus() {
  const path = '/api/mls/retry?queue=mls-sync&limit=6';
  const payload = await fetchJson(path);

  assert.equal(payload.success, true, 'Expected MLS retry status success=true.');
  assert.equal(payload.module, 'REIE MLS Queue Retry', 'Expected MLS retry module metadata.');
  assert.equal(payload.terminal, 'Terminal 5', 'Expected MLS retry terminal metadata.');
  assert.equal(payload.route, '/api/mls/retry', 'Expected MLS retry route metadata.');
  assert.ok(typeof payload.generatedAt === 'string', 'Expected MLS retry generatedAt metadata.');
  assert.ok(typeof payload.command === 'string' && payload.command.includes('/api/mls/retry'), 'Expected MLS retry command metadata.');
  assert.ok(payload.command.includes('queue=mls-sync'), 'Expected MLS retry command to preserve queue query.');
  assert.ok(payload.command.includes('limit=6'), 'Expected MLS retry command to preserve limit query.');
  assert.ok(isRecord(payload.auth), 'Expected MLS retry auth metadata.');
  assert.ok(isRecord(payload.defaults), 'Expected MLS retry defaults payload.');
  assert.ok(isRecord(payload.terminals), 'Expected MLS retry terminals payload.');
  assert.ok(isRecord(payload.commands), 'Expected MLS retry commands payload.');
  assert.ok(Array.isArray(payload.diagnostics), 'Expected MLS retry diagnostics array.');
  assert.ok(isRecord(payload.executionPlan), 'Expected MLS retry executionPlan payload.');
  assert.ok(Array.isArray(payload.supportedQueues), 'Expected MLS retry supportedQueues array.');
  assert.ok(Array.isArray(payload.queues), 'Expected MLS retry queues array.');
  assert.ok(isRecord(payload.deadLetter), 'Expected MLS retry deadLetter payload.');
  assert.ok(Array.isArray(payload.recentFailedJobs), 'Expected MLS retry recentFailedJobs array.');
  assert.equal(isRecord(payload.defaults) ? payload.defaults.terminal : null, 'Terminal 5', 'Expected MLS retry defaults terminal.');
  assert.equal(isRecord(payload.terminals) ? payload.terminals.scriptsAndCurl : null, 'Terminal 5', 'Expected MLS retry scripts terminal.');
  assert.equal(isRecord(payload.commands) ? payload.commands.terminal : null, 'Terminal 5', 'Expected MLS retry commands terminal.');
  assert.ok(
    typeof (isRecord(payload.commands) ? payload.commands.retryStatus : null) === 'string' &&
      String((payload.commands as JsonRecord).retryStatus).includes('/api/mls/retry'),
    'Expected MLS retry status command.',
  );
  assert.ok(
    typeof (isRecord(payload.commands) ? payload.commands.dryRunRetry : null) === 'string' &&
      String((payload.commands as JsonRecord).dryRunRetry).includes('/api/mls/retry'),
    'Expected MLS retry dry-run command.',
  );
  assert.equal(isRecord(payload.executionPlan) ? payload.executionPlan.terminal : null, 'Terminal 5', 'Expected MLS retry execution plan terminal.');

  let unauthorizedTerminal: unknown = null;

  if (ADMIN_KEY) {
    const unauthorizedResponse = await fetch(`${BASE_URL}${path}`, {
      headers: {
        accept: 'application/json',
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    const unauthorizedPayload = (await unauthorizedResponse.json().catch(() => null)) as unknown;

    assert.equal(unauthorizedResponse.status, 401, 'Expected MLS retry without admin key to return HTTP 401.');
    assert.ok(isRecord(unauthorizedPayload), 'Expected MLS retry unauthorized response to return JSON.');
    assert.equal(unauthorizedPayload.success, false, 'Expected MLS retry unauthorized success=false.');
    assert.equal(unauthorizedPayload.terminal, 'Terminal 5', 'Expected MLS retry unauthorized terminal metadata.');
    assert.equal(unauthorizedPayload.route, '/api/mls/retry', 'Expected MLS retry unauthorized route metadata.');
    assert.ok(typeof unauthorizedPayload.generatedAt === 'string', 'Expected MLS retry unauthorized generatedAt metadata.');
    assert.ok(
      typeof unauthorizedPayload.command === 'string' &&
        unauthorizedPayload.command.includes('/api/mls/retry') &&
        unauthorizedPayload.command.includes('queue=mls-sync') &&
        unauthorizedPayload.command.includes('limit=6'),
      'Expected MLS retry unauthorized command metadata to preserve query.',
    );
    assert.ok(isRecord(unauthorizedPayload.defaults), 'Expected MLS retry unauthorized defaults metadata.');
    assert.ok(isRecord(unauthorizedPayload.terminals), 'Expected MLS retry unauthorized terminals metadata.');
    assert.ok(isRecord(unauthorizedPayload.commands), 'Expected MLS retry unauthorized commands metadata.');
    assert.ok(Array.isArray(unauthorizedPayload.diagnostics), 'Expected MLS retry unauthorized diagnostics array.');
    assert.ok(isRecord(unauthorizedPayload.executionPlan), 'Expected MLS retry unauthorized executionPlan metadata.');
    assert.ok(Array.isArray(unauthorizedPayload.supportedQueues), 'Expected MLS retry unauthorized supportedQueues array.');
    assert.ok(Array.isArray(unauthorizedPayload.queues), 'Expected MLS retry unauthorized fallback queues.');
    assert.ok(isRecord(unauthorizedPayload.deadLetter), 'Expected MLS retry unauthorized fallback deadLetter metadata.');
    assert.ok(Array.isArray(unauthorizedPayload.recentFailedJobs), 'Expected MLS retry unauthorized recentFailedJobs array.');
    assert.ok(isRecord(unauthorizedPayload.auth), 'Expected MLS retry unauthorized auth metadata.');
    assert.equal(isRecord(unauthorizedPayload.defaults) ? unauthorizedPayload.defaults.terminal : null, 'Terminal 5', 'Expected MLS retry unauthorized defaults terminal.');
    assert.equal(isRecord(unauthorizedPayload.terminals) ? unauthorizedPayload.terminals.scriptsAndCurl : null, 'Terminal 5', 'Expected MLS retry unauthorized scripts terminal.');
    assert.equal(isRecord(unauthorizedPayload.commands) ? unauthorizedPayload.commands.terminal : null, 'Terminal 5', 'Expected MLS retry unauthorized commands terminal.');
    assert.equal(isRecord(unauthorizedPayload.executionPlan) ? unauthorizedPayload.executionPlan.terminal : null, 'Terminal 5', 'Expected MLS retry unauthorized execution plan terminal.');

    unauthorizedTerminal = unauthorizedPayload.terminal;
  }

  return {
    path,
    terminal: payload.terminal,
    queues: Array.isArray(payload.queues) ? payload.queues.length : null,
    deadLetterOpen: isRecord(payload.deadLetter)
      ? Number(payload.deadLetter.waiting || 0) +
        Number(payload.deadLetter.active || 0) +
        Number(payload.deadLetter.delayed || 0) +
        Number(payload.deadLetter.failed || 0)
      : null,
    readiness: isRecord(payload.executionPlan) ? payload.executionPlan.level : null,
    recentFailedJobs: Array.isArray(payload.recentFailedJobs) ? payload.recentFailedJobs.length : null,
    unauthorizedTerminal,
  };
}

async function assertMlsRetryDryRun() {
  const path = '/api/mls/retry?queue=mls-sync&dryRun=true&limit=999';
  const payload = await fetchJson(path, { method: 'POST' });

  assert.equal(payload.success, true, 'Expected MLS retry dry-run success=true.');
  assert.equal(payload.module, 'REIE MLS Queue Retry', 'Expected MLS retry dry-run module metadata.');
  assert.equal(payload.terminal, 'Terminal 5', 'Expected MLS retry dry-run terminal metadata.');
  assert.equal(payload.route, '/api/mls/retry', 'Expected MLS retry dry-run route metadata.');
  assert.ok(typeof payload.generatedAt === 'string', 'Expected MLS retry dry-run generatedAt metadata.');
  assert.ok(typeof payload.command === 'string' && payload.command.includes('-X POST'), 'Expected MLS retry dry-run POST command metadata.');
  assert.ok(payload.command.includes('queue=mls-sync'), 'Expected MLS retry dry-run command to preserve queue query.');
  assert.ok(payload.command.includes('limit=999'), 'Expected MLS retry dry-run command to preserve raw limit query.');
  assert.equal(payload.dryRun, true, 'Expected MLS retry dry-run mode.');
  assert.equal(payload.liveRetryRequested, false, 'Expected MLS retry dry-run to avoid live retry intent.');
  assert.equal(payload.limit, 500, 'Expected MLS retry dry-run limit clamp.');
  assert.deepEqual(payload.jobIds, [], 'Expected MLS retry dry-run without targeted jobs.');
  assert.equal(payload.allowAllLive, false, 'Expected MLS retry dry-run broad live allowance false.');
  assert.equal(payload.retried, 0, 'Expected MLS retry dry-run to avoid retrying jobs.');
  assert.ok(Array.isArray(payload.diagnostics), 'Expected MLS retry dry-run diagnostics array.');
  assert.ok(isRecord(payload.executionPlan), 'Expected MLS retry dry-run execution plan.');
  assert.ok(isRecord(payload.commands), 'Expected MLS retry dry-run commands.');
  assert.ok(Array.isArray(payload.results), 'Expected MLS retry dry-run results array.');
  assert.equal(isRecord(payload.executionPlan) ? payload.executionPlan.terminal : null, 'Terminal 5', 'Expected MLS retry dry-run plan terminal.');
  assert.equal(isRecord(payload.executionPlan) ? payload.executionPlan.liveRetryAllowed : null, false, 'Expected MLS retry dry-run live retry disallowed with no retryable jobs.');
  assert.ok(
    typeof (isRecord(payload.commands) ? payload.commands.repeatDryRun : null) === 'string' &&
      String((payload.commands as JsonRecord).repeatDryRun).includes('dryRun=true'),
    'Expected MLS retry dry-run repeat command.',
  );
  assert.ok(
    typeof (isRecord(payload.commands) ? payload.commands.liveRetry : null) === 'string' &&
      String((payload.commands as JsonRecord).liveRetry).includes('execute=true'),
    'Expected MLS retry dry-run live retry command guidance.',
  );

  const result = payload.results[0] as unknown;

  assert.ok(isRecord(result), 'Expected MLS retry dry-run first queue result.');
  assert.equal(result.key, 'mls-sync', 'Expected MLS retry dry-run queue key.');
  assert.equal(result.name, 'mls-sync', 'Expected MLS retry dry-run queue name.');
  assert.equal(result.dryRun, true, 'Expected MLS retry queue result dry-run flag.');
  assert.equal(result.targeted, false, 'Expected MLS retry queue result targeted flag.');
  assert.equal(result.retried, 0, 'Expected MLS retry queue result retried count.');
  assert.ok(Array.isArray(result.jobs), 'Expected MLS retry queue result jobs array.');
  assert.ok(Array.isArray(result.errors), 'Expected MLS retry queue result errors array.');

  return {
    path,
    dryRun: payload.dryRun,
    liveRetryRequested: payload.liveRetryRequested,
    limit: payload.limit,
    retried: payload.retried,
    retryable: payload.retryable,
    skipped: payload.skipped,
    errors: payload.errors,
    planLevel: isRecord(payload.executionPlan) ? payload.executionPlan.level : null,
    resultQueue: result.key,
  };
}

async function assertDeadLetter() {
  const path = '/api/admin/dead-letter?states=waiting,delayed,failed&limit=6';
  const payload = await fetchJson(path);

  assert.equal(payload.success, true, 'Expected dead-letter inspector success=true.');
  assert.equal(payload.module, 'REIE Dead-Letter Inspector', 'Expected dead-letter module metadata.');
  assert.equal(payload.terminal, 'Terminal 5', 'Expected dead-letter terminal metadata.');
  assert.equal(payload.route, '/api/admin/dead-letter', 'Expected dead-letter route metadata.');
  assert.ok(typeof payload.generatedAt === 'string', 'Expected dead-letter generatedAt metadata.');
  assert.ok(typeof payload.command === 'string' && payload.command.includes('/api/admin/dead-letter'), 'Expected dead-letter command metadata.');
  assert.ok(isRecord(payload.summary), 'Expected dead-letter payload to include summary.');
  assert.ok(isRecord(payload.filters), 'Expected dead-letter payload to include filters.');
  assert.ok(isRecord(payload.filterSummary), 'Expected dead-letter payload to include filterSummary.');
  assert.ok(Array.isArray(payload.diagnostics), 'Expected dead-letter diagnostics array.');
  assert.ok(Array.isArray(payload.recommendations), 'Expected dead-letter recommendations array.');
  assert.ok(isRecord(payload.recoveryPlan), 'Expected dead-letter recoveryPlan payload.');
  assert.ok(Array.isArray(payload.sourceQueues), 'Expected dead-letter sourceQueues array.');
  assert.ok(Array.isArray(payload.jobs), 'Expected dead-letter jobs array.');
  assert.ok(Array.isArray(payload.openStates), 'Expected dead-letter openStates array.');
  assert.ok(isRecord(payload.commands), 'Expected dead-letter commands payload.');
  assert.ok(isRecord(payload.terminals), 'Expected dead-letter terminals payload.');
  assert.equal(isRecord(payload.filters) ? payload.filters.limit : null, 6, 'Expected dead-letter filters to preserve limit.');
  assert.ok(
    Array.isArray(isRecord(payload.filters) ? payload.filters.states : null) &&
      ((payload.filters as JsonRecord).states as unknown[]).includes('waiting') &&
      ((payload.filters as JsonRecord).states as unknown[]).includes('delayed') &&
      ((payload.filters as JsonRecord).states as unknown[]).includes('failed'),
    'Expected dead-letter filters to preserve requested open states.',
  );
  assert.ok(payload.command.includes('states=waiting,delayed,failed') || payload.command.includes('states=waiting%2Cdelayed%2Cfailed'), 'Expected dead-letter command to preserve states query.');
  assert.ok(payload.command.includes('limit=6'), 'Expected dead-letter command to preserve limit query.');
  assert.equal(isRecord(payload.commands) ? payload.commands.terminal : null, 'Terminal 5', 'Expected dead-letter commands terminal.');
  assert.ok(
    typeof (isRecord(payload.commands) ? payload.commands.deadLetterOpen : null) === 'string' &&
      String((payload.commands as JsonRecord).deadLetterOpen).includes('/api/admin/dead-letter'),
    'Expected dead-letter open command.',
  );
  assert.equal(isRecord(payload.terminals) ? payload.terminals.scriptsAndCurl : null, 'Terminal 5', 'Expected dead-letter scripts terminal.');

  const filteredPath = '/api/admin/dead-letter?sourceQueue=reie-alerts&states=waiting,delayed,failed&limit=4';
  const filteredPayload = await fetchJson(filteredPath);

  assert.equal(filteredPayload.success, true, 'Expected filtered dead-letter inspector success=true.');
  assert.equal(filteredPayload.route, '/api/admin/dead-letter', 'Expected filtered dead-letter route metadata.');
  assert.ok(
    typeof filteredPayload.command === 'string' &&
      filteredPayload.command.includes('sourceQueue=reie-alerts') &&
      filteredPayload.command.includes('limit=4'),
    'Expected filtered dead-letter command metadata to preserve sourceQueue and limit.',
  );
  assert.equal(isRecord(filteredPayload.filters) ? filteredPayload.filters.sourceQueue : null, 'reie-alerts', 'Expected filtered dead-letter sourceQueue filter.');
  assert.equal(isRecord(filteredPayload.filterSummary) ? filteredPayload.filterSummary.terminal : null, 'Terminal 5', 'Expected filtered dead-letter filterSummary terminal.');

  const boundedPath =
    '/api/admin/dead-letter?sourceQueue=mls-sync%20%24bad%23chars&state=completed&limit=999';
  const boundedPayload = await fetchJson(boundedPath);

  assert.equal(boundedPayload.success, true, 'Expected bounded dead-letter inspector success=true.');
  assert.equal(boundedPayload.route, '/api/admin/dead-letter', 'Expected bounded dead-letter route metadata.');
  assert.ok(isRecord(boundedPayload.filters), 'Expected bounded dead-letter filters metadata.');
  assert.equal(isRecord(boundedPayload.filters) ? boundedPayload.filters.limit : null, 200, 'Expected dead-letter limit clamp.');
  assert.equal(isRecord(boundedPayload.filters) ? boundedPayload.filters.sourceQueue : null, 'mls-syncbadchars', 'Expected dead-letter sourceQueue sanitization.');
  assert.deepEqual(isRecord(boundedPayload.filters) ? boundedPayload.filters.states : null, ['completed'], 'Expected dead-letter state alias parsing.');
  assert.equal(isRecord(boundedPayload.filters) ? boundedPayload.filters.scanLimit : null, 200, 'Expected dead-letter sourceQueue scan limit cap.');
  assert.equal(isRecord(boundedPayload.filterSummary) ? boundedPayload.filterSummary.limit : null, 200, 'Expected dead-letter filterSummary limit clamp.');
  assert.equal(isRecord(boundedPayload.filterSummary) ? boundedPayload.filterSummary.sourceQueue : null, 'mls-syncbadchars', 'Expected dead-letter filterSummary sanitized sourceQueue.');
  assert.ok(
    typeof boundedPayload.command === 'string' &&
      boundedPayload.command.includes('sourceQueue=mls-sync%20%24bad%23chars') &&
      boundedPayload.command.includes('limit=999'),
    'Expected bounded dead-letter command metadata to preserve raw query.',
  );

  let unauthorizedTerminal: unknown = null;

  if (ADMIN_KEY) {
    const unauthorizedPath = '/api/admin/dead-letter?sourceQueue=reie-alerts&limit=4';
    const unauthorizedResponse = await fetch(`${BASE_URL}${unauthorizedPath}`, {
      headers: {
        accept: 'application/json',
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    const unauthorizedPayload = (await unauthorizedResponse.json().catch(() => null)) as unknown;

    assert.equal(unauthorizedResponse.status, 401, 'Expected dead-letter without admin key to return HTTP 401.');
    assert.ok(isRecord(unauthorizedPayload), 'Expected dead-letter unauthorized response to return JSON.');
    assert.equal(unauthorizedPayload.success, false, 'Expected dead-letter unauthorized success=false.');
    assert.equal(unauthorizedPayload.terminal, 'Terminal 5', 'Expected dead-letter unauthorized terminal metadata.');
    assert.equal(unauthorizedPayload.route, '/api/admin/dead-letter', 'Expected dead-letter unauthorized route metadata.');
    assert.ok(typeof unauthorizedPayload.generatedAt === 'string', 'Expected dead-letter unauthorized generatedAt metadata.');
    assert.ok(isRecord(unauthorizedPayload.filters), 'Expected dead-letter unauthorized filters metadata.');
    assert.ok(isRecord(unauthorizedPayload.filterSummary), 'Expected dead-letter unauthorized filterSummary metadata.');
    assert.ok(isRecord(unauthorizedPayload.commands), 'Expected dead-letter unauthorized commands metadata.');
    assert.ok(isRecord(unauthorizedPayload.terminals), 'Expected dead-letter unauthorized terminals metadata.');
    assert.ok(isRecord(unauthorizedPayload.summary), 'Expected dead-letter unauthorized summary metadata.');
    assert.ok(isRecord(unauthorizedPayload.recoveryPlan), 'Expected dead-letter unauthorized recoveryPlan metadata.');
    assert.ok(Array.isArray(unauthorizedPayload.diagnostics), 'Expected dead-letter unauthorized diagnostics array.');
    assert.ok(Array.isArray(unauthorizedPayload.recommendations), 'Expected dead-letter unauthorized recommendations array.');
    assert.ok(Array.isArray(unauthorizedPayload.sourceQueues), 'Expected dead-letter unauthorized sourceQueues array.');
    assert.equal(unauthorizedPayload.sourceQueues.length, 0, 'Expected dead-letter unauthorized sourceQueues to avoid exposing queue concentration.');
    assert.ok(Array.isArray(unauthorizedPayload.openStates), 'Expected dead-letter unauthorized openStates array.');
    assert.ok(isRecord(unauthorizedPayload.auth), 'Expected dead-letter unauthorized auth metadata.');
    assert.ok(Array.isArray(unauthorizedPayload.jobs), 'Expected dead-letter unauthorized jobs array.');
    assert.equal(unauthorizedPayload.jobs.length, 0, 'Expected dead-letter unauthorized response to avoid exposing jobs.');
    assert.equal(isRecord(unauthorizedPayload.recoveryPlan) ? unauthorizedPayload.recoveryPlan.terminal : null, 'Terminal 5', 'Expected dead-letter unauthorized recoveryPlan terminal.');
    assert.equal(isRecord(unauthorizedPayload.terminals) ? unauthorizedPayload.terminals.scriptsAndCurl : null, 'Terminal 5', 'Expected dead-letter unauthorized scripts terminal.');
    assert.equal(isRecord(unauthorizedPayload.filters) ? unauthorizedPayload.filters.sourceQueue : null, 'reie-alerts', 'Expected dead-letter unauthorized sourceQueue metadata.');
    assert.equal(isRecord(unauthorizedPayload.filters) ? unauthorizedPayload.filters.limit : null, 4, 'Expected dead-letter unauthorized limit metadata.');
    assert.equal(isRecord(unauthorizedPayload.filterSummary) ? unauthorizedPayload.filterSummary.terminal : null, 'Terminal 5', 'Expected dead-letter unauthorized filterSummary terminal.');
    assert.ok(
      typeof unauthorizedPayload.command === 'string' &&
        unauthorizedPayload.command.includes('sourceQueue=reie-alerts') &&
        unauthorizedPayload.command.includes('limit=4'),
      'Expected dead-letter unauthorized command metadata to preserve query.',
    );

    unauthorizedTerminal = unauthorizedPayload.terminal;
  }

  return {
    path,
    severity: payload.severity,
    terminal: payload.terminal,
    totalOpen: isRecord(payload.summary) ? payload.summary.totalOpen : null,
    jobs: Array.isArray(payload.jobs) ? payload.jobs.length : null,
    recovery: isRecord(payload.recoveryPlan) ? payload.recoveryPlan.level : null,
    filteredSourceQueue: isRecord(filteredPayload.filters) ? filteredPayload.filters.sourceQueue : null,
    boundedLimit: isRecord(boundedPayload.filters) ? boundedPayload.filters.limit : null,
    boundedSourceQueue: isRecord(boundedPayload.filters) ? boundedPayload.filters.sourceQueue : null,
    boundedScanLimit: isRecord(boundedPayload.filters) ? boundedPayload.filters.scanLimit : null,
    unauthorizedTerminal,
  };
}

async function assertAlertStatus() {
  const path = '/api/process-alerts?limit=6';
  const payload = await fetchJson(path);

  assert.equal(payload.module, 'REIE Saved Search Alerts', 'Expected process-alerts module metadata.');
  assert.equal(payload.mode, 'status', 'Expected process-alerts status mode.');
  assert.equal(payload.terminal, 'Terminal 5', 'Expected process-alerts terminal metadata.');
  assert.equal(payload.route, '/api/process-alerts', 'Expected process-alerts route metadata.');
  assert.ok(typeof payload.generatedAt === 'string', 'Expected process-alerts generatedAt metadata.');
  assert.ok(typeof payload.command === 'string' && payload.command.includes('/api/process-alerts'), 'Expected process-alerts command metadata.');
  assert.ok(isRecord(payload.auth), 'Expected process-alerts auth metadata.');
  assert.equal(typeof (payload.auth as JsonRecord).configured, 'boolean', 'Expected process-alerts auth configured flag.');
  assert.equal(payload.timeoutMs, 12000, 'Expected process-alerts timeout metadata.');
  assert.ok(isRecord(payload.commands), 'Expected process-alerts commands payload.');
  assert.ok(Array.isArray(payload.diagnostics), 'Expected process-alerts diagnostics array.');
  assert.ok(isRecord(payload.executionPlan), 'Expected process-alerts executionPlan payload.');
  assert.ok(isRecord(payload.notificationReadiness), 'Expected process-alerts notification readiness metadata.');
  assert.equal(
    (payload.notificationReadiness as JsonRecord).terminal,
    'Terminal 5',
    'Expected process-alerts notification readiness terminal metadata.',
  );
  assert.equal(
    (payload.notificationReadiness as JsonRecord).route,
    '/api/process-alerts',
    'Expected process-alerts notification readiness route metadata.',
  );
  assert.equal(
    typeof (payload.notificationReadiness as JsonRecord).nextCommand,
    'string',
    'Expected process-alerts notification readiness next command metadata.',
  );
  assert.ok(
    Array.isArray((payload.notificationReadiness as JsonRecord).blockerCodes),
    'Expected process-alerts notification readiness blocker code summary.',
  );
  assert.ok(
    Array.isArray((payload.notificationReadiness as JsonRecord).blockerEnvVars),
    'Expected process-alerts notification readiness blocker env var summary.',
  );
  assert.ok(
    Array.isArray((payload.notificationReadiness as JsonRecord).blockedBy),
    'Expected process-alerts notification readiness blockedBy array.',
  );
  assert.ok(
    isRecord((payload.notificationReadiness as JsonRecord).commands),
    'Expected process-alerts notification readiness commands metadata.',
  );
  assert.equal(
    isRecord((payload.notificationReadiness as JsonRecord).commands)
      ? ((payload.notificationReadiness as JsonRecord).commands as JsonRecord).notificationReadiness
      : null,
    'npm run check:notification-readiness',
    'Expected process-alerts notification readiness command hint.',
  );
  const notificationBlockers = (payload.notificationReadiness as JsonRecord).blockedBy as unknown[];
  const notificationBlockerCodes = (payload.notificationReadiness as JsonRecord).blockerCodes as unknown[];
  const notificationBlockerEnvVars = (payload.notificationReadiness as JsonRecord).blockerEnvVars as unknown[];
  const structuredNotificationEnvVars = Array.from(
    new Set(
      notificationBlockers
        .filter(isRecord)
        .flatMap((blocker) => (Array.isArray(blocker.envVars) ? blocker.envVars : []))
        .filter((envVar) => typeof envVar === 'string'),
    ),
  );
  assert.equal(
    notificationBlockerCodes.length,
    notificationBlockers.filter(isRecord).length,
    'Expected process-alerts notification blocker code summary count to match structured blockers.',
  );
  assert.equal(
    notificationBlockerEnvVars.length,
    structuredNotificationEnvVars.length,
    'Expected process-alerts notification blocker env summary count to match structured blocker env vars.',
  );
  for (const blocker of notificationBlockers.filter(isRecord)) {
    assert.ok(
      notificationBlockerCodes.includes(blocker.code),
      'Expected process-alerts notification blocker summary to include every structured blocker code.',
    );
  }
  for (const envVar of structuredNotificationEnvVars) {
    assert.ok(
      notificationBlockerEnvVars.includes(envVar),
      'Expected process-alerts notification blocker env summary to include every structured blocker env var.',
    );
  }
  const firstNotificationBlocker = notificationBlockers.find(isRecord);
  if (firstNotificationBlocker) {
    assert.ok(
      notificationBlockerCodes.includes(firstNotificationBlocker.code),
      'Expected process-alerts notification blocker summary to include first blocker code.',
    );
    assert.equal(typeof firstNotificationBlocker.code, 'string', 'Expected process-alerts notification blocker code.');
    assert.ok(Array.isArray(firstNotificationBlocker.envVars), 'Expected process-alerts notification blocker env vars.');
    assert.ok(
      (firstNotificationBlocker.envVars as unknown[]).every((envVar) => typeof envVar === 'string'),
      'Expected process-alerts notification blocker env vars to be strings.',
    );
    for (const envVar of firstNotificationBlocker.envVars as unknown[]) {
      assert.ok(
        notificationBlockerEnvVars.includes(envVar),
        'Expected process-alerts notification blocker env summary to include first blocker env vars.',
      );
    }
    assert.equal(
      firstNotificationBlocker.nextCommand,
      'npm run check:property-inquiry-notification:readiness',
      'Expected process-alerts notification blocker next command.',
    );
  }
  assert.ok(Array.isArray(payload.recommendations), 'Expected process-alerts recommendations array.');
  assert.ok(isRecord(payload.stats), 'Expected process-alerts stats payload.');
  assert.ok(Array.isArray(payload.failedAlertRows), 'Expected process-alerts failed alert row inspection payload.');
  const failedRows = payload.failedAlertRows as unknown[];
  const firstFailedRow = failedRows.find(isRecord);
  if (firstFailedRow) {
    assert.equal(typeof firstFailedRow.id, 'string', 'Expected failed alert rows to expose ids.');
    assert.equal(typeof firstFailedRow.createdAt, 'string', 'Expected failed alert rows to expose createdAt.');
    assert.ok(Array.isArray(firstFailedRow.payloadKeys), 'Expected failed alert rows to expose payload keys.');
    assert.equal(typeof firstFailedRow.hasUsableProperty, 'boolean', 'Expected failed alert rows to expose usable property state.');
    assert.equal(typeof firstFailedRow.likelyTestRow, 'boolean', 'Expected failed alert rows to expose likely test-row state.');
  }
  assert.equal(payload.nextRunHint, '/api/process-alerts?execute=true', 'Expected process-alerts next run hint.');
  assert.equal(payload.nextDryRunHint, '/api/process-alerts?dryRun=1', 'Expected process-alerts next dry-run hint.');
  assert.equal(isRecord(payload.commands) ? payload.commands.terminal : null, 'Terminal 5', 'Expected process-alerts commands terminal.');
  assert.ok(
    typeof (isRecord(payload.commands) ? payload.commands.status : null) === 'string' &&
      String((payload.commands as JsonRecord).status).includes('/api/process-alerts'),
    'Expected process-alerts status command.',
  );
  assert.ok(
    typeof (isRecord(payload.commands) ? payload.commands.dryRun : null) === 'string' &&
      String((payload.commands as JsonRecord).dryRun).includes('/api/process-alerts'),
    'Expected process-alerts dry-run command.',
  );
  assert.ok(
    typeof (isRecord(payload.commands) ? payload.commands.deadLetter : null) === 'string' &&
      String((payload.commands as JsonRecord).deadLetter).includes('/api/admin/dead-letter'),
    'Expected process-alerts dead-letter command.',
  );
  assert.ok(
    typeof (isRecord(payload.commands) ? payload.commands.queueDashboard : null) === 'string' &&
      String((payload.commands as JsonRecord).queueDashboard).includes('run:queue-dashboard'),
    'Expected process-alerts queue dashboard command.',
  );
  assert.ok(
    typeof (isRecord(payload.commands) ? payload.commands.failedRowsInspection : null) === 'string' &&
      String((payload.commands as JsonRecord).failedRowsInspection).includes('/api/process-alerts'),
    'Expected process-alerts failed-row inspection command.',
  );
  assert.ok(
    typeof (isRecord(payload.commands) ? payload.commands.failedRowsScript : null) === 'string' &&
      String((payload.commands as JsonRecord).failedRowsScript).includes('run:alerts:failed'),
    'Expected process-alerts failed-row script command.',
  );
  assert.ok(
    typeof (isRecord(payload.commands) ? payload.commands.markTestFailedRowsSkipped : null) === 'string' &&
      String((payload.commands as JsonRecord).markTestFailedRowsSkipped).includes('run:alerts:failed:skip-test'),
    'Expected process-alerts test-row cleanup command.',
  );
  assert.ok(
    typeof (isRecord(payload.commands) ? payload.commands.scriptDryRun : null) === 'string' &&
      String((payload.commands as JsonRecord).scriptDryRun).includes('run:alerts:dry'),
    'Expected process-alerts dry-run script command.',
  );
  assert.ok(
    typeof (isRecord(payload.commands) ? payload.commands.scriptLive : null) === 'string' &&
      String((payload.commands as JsonRecord).scriptLive).includes('run:alerts:live'),
    'Expected process-alerts live script command.',
  );
  assert.equal(isRecord(payload.executionPlan) ? payload.executionPlan.terminal : null, 'Terminal 5', 'Expected process-alerts execution plan terminal.');

  const dryRunPath = '/api/process-alerts?dryRun=true&limit=999';
  const dryRunPayload = await fetchJson(dryRunPath, { method: 'POST' });

  assert.equal(dryRunPayload.module, 'REIE Saved Search Alerts', 'Expected process-alerts dry-run module metadata.');
  assert.equal(dryRunPayload.mode, 'preview', 'Expected process-alerts dry-run preview mode.');
  assert.equal(dryRunPayload.dryRun, true, 'Expected process-alerts dry-run flag.');
  assert.equal(dryRunPayload.limit, 200, 'Expected process-alerts dry-run limit clamp.');
  assert.equal(dryRunPayload.terminal, 'Terminal 5', 'Expected process-alerts dry-run terminal metadata.');
  assert.equal(dryRunPayload.route, '/api/process-alerts', 'Expected process-alerts dry-run route metadata.');
  assert.ok(typeof dryRunPayload.command === 'string' && dryRunPayload.command.includes('-X POST'), 'Expected process-alerts dry-run POST command metadata.');
  assert.ok(dryRunPayload.command.includes('dryRun=true'), 'Expected process-alerts dry-run command to preserve dryRun query.');
  assert.ok(dryRunPayload.command.includes('limit=999'), 'Expected process-alerts dry-run command to preserve raw limit query.');
  assert.ok(isRecord(dryRunPayload.result), 'Expected process-alerts dry-run result payload.');
  assert.equal(isRecord(dryRunPayload.result) ? dryRunPayload.result.dryRun : null, true, 'Expected process-alerts result dry-run flag.');
  assert.equal(isRecord(dryRunPayload.result) ? dryRunPayload.result.mode : null, 'preview', 'Expected process-alerts result preview mode.');
  assert.equal(isRecord(dryRunPayload.result) ? dryRunPayload.result.requestedLimit : null, 200, 'Expected process-alerts result requested limit clamp.');
  assert.equal(isRecord(dryRunPayload.result) ? dryRunPayload.result.sent : null, 0, 'Expected process-alerts dry-run to send zero emails.');
  assert.ok(Array.isArray(isRecord(dryRunPayload.result) ? dryRunPayload.result.alerts : null), 'Expected process-alerts dry-run alerts array.');
  assert.ok(isRecord(dryRunPayload.commands), 'Expected process-alerts dry-run commands payload.');
  assert.ok(isRecord(dryRunPayload.notificationReadiness), 'Expected process-alerts dry-run notification readiness metadata.');
  assert.equal(
    (dryRunPayload.notificationReadiness as JsonRecord).terminal,
    'Terminal 5',
    'Expected process-alerts dry-run notification readiness terminal metadata.',
  );
  assert.ok(
    Array.isArray((dryRunPayload.notificationReadiness as JsonRecord).blockedBy),
    'Expected process-alerts dry-run notification blockedBy array.',
  );
  assert.ok(isRecord(dryRunPayload.executionPlan), 'Expected process-alerts dry-run execution plan.');
  assert.ok(Array.isArray(dryRunPayload.recommendations), 'Expected process-alerts dry-run recommendations.');
  assert.ok(Array.isArray(dryRunPayload.failedAlertRows), 'Expected process-alerts dry-run failed alert row inspection payload.');
  assert.equal(isRecord(dryRunPayload.commands) ? dryRunPayload.commands.terminal : null, 'Terminal 5', 'Expected process-alerts dry-run commands terminal.');
  assert.ok(
    typeof (isRecord(dryRunPayload.commands) ? dryRunPayload.commands.live : null) === 'string' &&
      String((dryRunPayload.commands as JsonRecord).live).includes('execute=true'),
    'Expected process-alerts dry-run live command guidance.',
  );
  assert.equal(isRecord(dryRunPayload.executionPlan) ? dryRunPayload.executionPlan.terminal : null, 'Terminal 5', 'Expected process-alerts dry-run execution plan terminal.');

  let unauthorizedTerminal: unknown = null;

  if (ADMIN_KEY) {
    const unauthorizedResponse = await fetch(`${BASE_URL}${path}`, {
      headers: {
        accept: 'application/json',
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    const unauthorizedPayload = (await unauthorizedResponse.json().catch(() => null)) as unknown;

    assert.equal(unauthorizedResponse.status, 401, 'Expected process-alerts without admin key to return HTTP 401.');
    assert.ok(isRecord(unauthorizedPayload), 'Expected process-alerts unauthorized response to return JSON.');
    assert.equal(unauthorizedPayload.success, false, 'Expected process-alerts unauthorized success=false.');
    assert.equal(unauthorizedPayload.terminal, 'Terminal 5', 'Expected process-alerts unauthorized terminal metadata.');
    assert.equal(unauthorizedPayload.route, '/api/process-alerts', 'Expected process-alerts unauthorized route metadata.');
    assert.ok(typeof unauthorizedPayload.generatedAt === 'string', 'Expected process-alerts unauthorized generatedAt metadata.');
    assert.ok(
      typeof unauthorizedPayload.command === 'string' &&
        unauthorizedPayload.command.includes('/api/process-alerts') &&
        unauthorizedPayload.command.includes('limit=6'),
      'Expected process-alerts unauthorized command metadata to preserve query.',
    );
    assert.ok(isRecord(unauthorizedPayload.commands), 'Expected process-alerts unauthorized commands metadata.');
    assert.ok(isRecord(unauthorizedPayload.notificationReadiness), 'Expected process-alerts unauthorized notification readiness metadata.');
    assert.equal(
      (unauthorizedPayload.notificationReadiness as JsonRecord).terminal,
      'Terminal 5',
      'Expected process-alerts unauthorized notification readiness terminal metadata.',
    );
    assert.ok(
      Array.isArray((unauthorizedPayload.notificationReadiness as JsonRecord).blockedBy),
      'Expected process-alerts unauthorized notification blockedBy array.',
    );
    assert.ok(isRecord(unauthorizedPayload.auth), 'Expected process-alerts unauthorized auth metadata.');
    assert.equal(typeof (unauthorizedPayload.auth as JsonRecord).configured, 'boolean', 'Expected process-alerts unauthorized auth configured flag.');
    assert.equal(unauthorizedPayload.timeoutMs, 12000, 'Expected process-alerts unauthorized timeout metadata.');
    assert.ok(isRecord(unauthorizedPayload.executionPlan), 'Expected process-alerts unauthorized executionPlan metadata.');
    assert.ok(Array.isArray(unauthorizedPayload.recommendations), 'Expected process-alerts unauthorized recommendations metadata.');
    assert.ok(isRecord(unauthorizedPayload.stats), 'Expected process-alerts unauthorized fallback stats.');
    assert.equal(unauthorizedPayload.nextRunHint, '/api/process-alerts?execute=true', 'Expected process-alerts unauthorized next run hint.');
    assert.equal(unauthorizedPayload.nextDryRunHint, '/api/process-alerts?dryRun=1', 'Expected process-alerts unauthorized next dry-run hint.');
    assert.equal(isRecord(unauthorizedPayload.commands) ? unauthorizedPayload.commands.terminal : null, 'Terminal 5', 'Expected process-alerts unauthorized commands terminal.');
    assert.equal(isRecord(unauthorizedPayload.executionPlan) ? unauthorizedPayload.executionPlan.terminal : null, 'Terminal 5', 'Expected process-alerts unauthorized execution plan terminal.');

    unauthorizedTerminal = unauthorizedPayload.terminal;
  }

  return {
    path,
    mode: payload.mode,
    terminal: payload.terminal,
    pending: isRecord(payload.stats) ? payload.stats.pending : null,
    failed: isRecord(payload.stats) ? payload.stats.failed : null,
    readiness: isRecord(payload.executionPlan) ? payload.executionPlan.level : null,
    notificationReadiness: isRecord(payload.notificationReadiness) ? payload.notificationReadiness.level : null,
    notificationBlockers: notificationBlockers.length,
    liveAllowed: isRecord(payload.executionPlan) ? payload.executionPlan.liveAllowed : null,
    dryRunMode: dryRunPayload.mode,
    dryRunLimit: dryRunPayload.limit,
    dryRunSent: isRecord(dryRunPayload.result) ? dryRunPayload.result.sent : null,
    dryRunPreview: isRecord(dryRunPayload.result) ? dryRunPayload.result.preview : null,
    unauthorizedTerminal,
  };
}

function runPublicExperienceSmoke() {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(process.execPath, ['dist/scripts/publicExperienceSmoke.js'], {
      env: {
        ...process.env,
        PUBLIC_EXPERIENCE_SMOKE_BASE_URL: BASE_URL,
      },
      stdio: 'inherit',
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`Public experience smoke exited with code ${code ?? 'unknown'}.`));
    });
  });
}

function parseJsonPayload(output: string) {
  const jsonStart = output.indexOf('{\n  "success"');
  const compactJsonStart = output.indexOf('{"success"');
  const start = jsonStart >= 0 ? jsonStart : compactJsonStart;

  if (start < 0) {
    throw new Error('Expected command output to include a JSON payload.');
  }

  return JSON.parse(output.slice(start)) as unknown;
}

async function assertLaunchReadiness() {
  const payload = await new Promise<JsonRecord>((resolve, reject) => {
    let stdout = '';
    let stderr = '';
    const child = spawn(process.execPath, ['dist/scripts/launchReadiness.js'], {
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    child.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString();
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      try {
        const parsed = parseJsonPayload(stdout);

        assert.ok(isRecord(parsed), 'Expected launch readiness output to be a JSON object.');
        assert.equal(parsed.check, 'reie-launch-readiness', 'Expected launch readiness check name.');
        assert.equal(parsed.sendsEmail, false, 'Expected launch readiness to be non-sending.');
        assert.equal(parsed.mutatesRows, false, 'Expected launch readiness to avoid row mutation.');
        assert.ok(code === 0 || code === 1, `Expected launch readiness to exit 0 or 1, got ${code ?? 'unknown'}.`);

        resolve(parsed);
      } catch (error) {
        reject(
          new Error(
            `Launch readiness command failed to return expected JSON: ${errorMessage(error)}${
              stderr ? ` stderr=${stderr.slice(0, 500)}` : ''
            }`,
          ),
        );
      }
    });
  });

  assert.ok(isRecord(payload.readiness), 'Expected launch readiness metadata.');
  assert.ok(Array.isArray(payload.gates), 'Expected launch readiness gates array.');
  assert.ok(isRecord(payload.queue), 'Expected launch readiness queue metadata.');
  assert.ok(isRecord(payload.commands), 'Expected launch readiness commands metadata.');
  assert.equal(isRecord(payload.commands) ? payload.commands.launchReadiness : null, 'npm run check:launch-readiness', 'Expected launch readiness command hint.');
  assert.equal(isRecord(payload.commands) ? payload.commands.savedSearchAlertReadiness : null, 'npm run check:alert-notification-readiness', 'Expected alert readiness command hint.');
  assert.equal(
    isRecord(payload.commands) ? payload.commands.propertyInquiryReadiness : null,
    'npm run check:property-inquiry-notification:readiness',
    'Expected property inquiry readiness command hint.',
  );
  assert.equal(
    isRecord(payload.commands) ? payload.commands.notificationReadiness : null,
    'npm run check:notification-readiness',
    'Expected notification readiness summary command hint.',
  );
  assert.equal(
    isRecord(payload.commands) ? payload.commands.strictNotificationReadiness : null,
    'npm run check:notification-readiness:strict',
    'Expected strict notification readiness command hint.',
  );
  assert.equal(
    isRecord(payload.commands) ? payload.commands.strictNotificationReadinessContract : null,
    'npm run check:notification-readiness:strict-contract',
    'Expected strict notification readiness contract command hint.',
  );

  const gates = payload.gates as unknown[];
  const databaseGate = gates.find((gate) => isRecord(gate) && gate.name === 'Supabase connectivity');
  const alertGate = gates.find((gate) => isRecord(gate) && gate.name === 'Saved-search alert email');
  const propertyInquiryGate = gates.find((gate) => isRecord(gate) && gate.name === 'Property-inquiry notification email');

  assert.ok(isRecord(databaseGate), 'Expected Supabase connectivity launch gate.');
  assert.ok(isRecord(alertGate), 'Expected saved-search alert launch gate.');
  assert.ok(isRecord(propertyInquiryGate), 'Expected property inquiry launch gate.');
  assert.equal(databaseGate.level, 'ready', 'Expected Supabase launch gate to be ready.');
  assert.ok(alertGate.level === 'ready' || alertGate.level === 'watch', 'Expected saved-search alert launch gate to be ready or watch.');
  assert.ok(
    propertyInquiryGate.level === 'ready' || propertyInquiryGate.level === 'watch' || propertyInquiryGate.level === 'blocked',
    'Expected property inquiry launch gate level.',
  );
  assert.ok(Array.isArray(propertyInquiryGate.checks), 'Expected property inquiry launch checks.');

  const recipientCheck = (propertyInquiryGate.checks as unknown[]).find(
    (check) => isRecord(check) && check.name === 'PROPERTY_INQUIRY_NOTIFY_TO',
  );
  assert.ok(isRecord(recipientCheck), 'Expected property inquiry recipient check.');

  return {
    terminal: payload.terminal,
    readiness: isRecord(payload.readiness) ? payload.readiness.level : null,
    pendingAlerts: isRecord(payload.queue) ? payload.queue.pendingAlerts : null,
    failedAlerts: isRecord(payload.queue) ? payload.queue.failedAlerts : null,
    savedSearchAlertGate: isRecord(alertGate) ? alertGate.level : null,
    propertyInquiryGate: isRecord(propertyInquiryGate) ? propertyInquiryGate.level : null,
    propertyInquiryRecipientStatus: recipientCheck.status,
  };
}

async function assertSavedSearchAlertNotificationReadiness() {
  const payload = await new Promise<JsonRecord>((resolve, reject) => {
    let stdout = '';
    let stderr = '';
    const child = spawn(process.execPath, ['dist/scripts/alertNotificationReadiness.js'], {
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    child.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString();
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      try {
        const parsed = parseJsonPayload(stdout);

        assert.ok(isRecord(parsed), 'Expected saved-search alert notification readiness output to be a JSON object.');
        assert.equal(parsed.check, 'saved-search-alert-notification-readiness', 'Expected saved-search alert readiness check name.');
        assert.equal(parsed.sendsEmail, false, 'Expected saved-search alert readiness to be non-sending.');
        assert.equal(parsed.mutatesRows, false, 'Expected saved-search alert readiness to avoid row mutation.');
        assert.equal(parsed.terminal, 'Terminal 5', 'Expected saved-search alert readiness terminal metadata.');
        assert.ok(typeof parsed.generatedAt === 'string', 'Expected saved-search alert readiness generatedAt metadata.');
        assert.ok(isRecord(parsed.queue), 'Expected saved-search alert readiness queue metadata.');
        assert.ok(Array.isArray(parsed.checks), 'Expected saved-search alert readiness checks array.');
        assert.ok(isRecord(parsed.commands), 'Expected saved-search alert readiness commands metadata.');
        assert.equal(
          isRecord(parsed.commands) ? parsed.commands.savedSearchAlertReadiness : null,
          'npm run check:alert-notification-readiness',
          'Expected saved-search alert readiness command hint.',
        );
        assert.equal(
          isRecord(parsed.commands) ? parsed.commands.notificationReadiness : null,
          'npm run check:notification-readiness',
          'Expected notification readiness command hint.',
        );
        assert.equal(
          isRecord(parsed.commands) ? parsed.commands.strictNotificationReadiness : null,
          'npm run check:notification-readiness:strict',
          'Expected strict notification readiness command hint.',
        );
        assert.equal(
          isRecord(parsed.commands) ? parsed.commands.strictNotificationReadinessContract : null,
          'npm run check:notification-readiness:strict-contract',
          'Expected strict notification readiness contract command hint.',
        );
        assert.equal(
          isRecord(parsed.commands) ? parsed.commands.launchReadiness : null,
          'npm run check:launch-readiness',
          'Expected launch readiness command hint.',
        );
        assert.equal(
          isRecord(parsed.commands) ? parsed.commands.savedSearchAlertDryRun : null,
          'npm run run:alerts:dry -- --limit 50',
          'Expected saved-search alert dry-run command hint.',
        );
        assert.ok(code === 0 || code === 1, `Expected saved-search alert readiness to exit 0 or 1, got ${code ?? 'unknown'}.`);

        resolve(parsed);
      } catch (error) {
        reject(
          new Error(
            `Saved-search alert readiness command failed to return expected JSON: ${errorMessage(error)}${
              stderr ? ` stderr=${stderr.slice(0, 500)}` : ''
            }`,
          ),
        );
      }
    });
  });

  assert.ok(isRecord(payload.readiness), 'Expected saved-search alert readiness metadata.');

  const readinessLevel = isRecord(payload.readiness) ? payload.readiness.level : null;
  assert.ok(
    readinessLevel === 'ready' || readinessLevel === 'watch' || readinessLevel === 'blocked',
    'Expected saved-search alert readiness level.',
  );

  const failedRowsCheck = (payload.checks as unknown[]).find(
    (check) => isRecord(check) && check.name === 'AlertQueue failed rows',
  );
  assert.ok(isRecord(failedRowsCheck), 'Expected direct saved-search alert failed rows check.');

  return {
    readiness: readinessLevel,
    failedRowsStatus: failedRowsCheck.status,
    pendingAlerts: isRecord(payload.queue) ? payload.queue.pending : null,
    failedAlerts: isRecord(payload.queue) ? payload.queue.failed : null,
    processingAlerts: isRecord(payload.queue) ? payload.queue.processing : null,
    sendsEmail: payload.sendsEmail,
    mutatesRows: payload.mutatesRows,
    terminal: payload.terminal,
    nextCommand: payload.nextCommand,
  };
}

async function assertPropertyInquiryNotificationReadiness() {
  const payload = await new Promise<JsonRecord>((resolve, reject) => {
    let stdout = '';
    let stderr = '';
    const child = spawn(process.execPath, ['dist/scripts/propertyInquiryNotificationReadiness.js'], {
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    child.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString();
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      try {
        const parsed = parseJsonPayload(stdout);

        assert.ok(isRecord(parsed), 'Expected property inquiry notification readiness output to be a JSON object.');
        assert.equal(parsed.check, 'property-inquiry-notification-readiness', 'Expected property inquiry readiness check name.');
        assert.equal(parsed.sendsEmail, false, 'Expected property inquiry readiness to be non-sending.');
        assert.equal(parsed.mutatesRows, false, 'Expected property inquiry readiness to avoid row mutation.');
        assert.equal(parsed.terminal, 'Terminal 5', 'Expected property inquiry readiness terminal metadata.');
        assert.ok(typeof parsed.generatedAt === 'string', 'Expected property inquiry readiness generatedAt metadata.');
        const parsedReadiness = isRecord(parsed.readiness) ? parsed.readiness : null;
        const expectedNextCommand =
          parsedReadiness?.level === 'blocked'
            ? 'npm run check:property-inquiry-notification:readiness'
            : 'npm run check:notification-readiness';
        assert.equal(parsed.nextCommand, expectedNextCommand, 'Expected property inquiry readiness next command.');
        assert.ok(isRecord(parsed.commands), 'Expected property inquiry readiness commands metadata.');
        assert.equal(
          isRecord(parsed.commands) ? parsed.commands.propertyInquiryReadiness : null,
          'npm run check:property-inquiry-notification:readiness',
          'Expected property inquiry readiness command hint.',
        );
        assert.equal(
          isRecord(parsed.commands) ? parsed.commands.notificationReadiness : null,
          'npm run check:notification-readiness',
          'Expected notification readiness command hint.',
        );
        assert.equal(
          isRecord(parsed.commands) ? parsed.commands.strictNotificationReadiness : null,
          'npm run check:notification-readiness:strict',
          'Expected strict notification readiness command hint.',
        );
        assert.equal(
          isRecord(parsed.commands) ? parsed.commands.strictNotificationReadinessContract : null,
          'npm run check:notification-readiness:strict-contract',
          'Expected strict notification readiness contract command hint.',
        );
        assert.equal(
          isRecord(parsed.commands) ? parsed.commands.launchReadiness : null,
          'npm run check:launch-readiness',
          'Expected launch readiness command hint.',
        );
        assert.ok(code === 0 || code === 1, `Expected property inquiry readiness to exit 0 or 1, got ${code ?? 'unknown'}.`);

        resolve(parsed);
      } catch (error) {
        reject(
          new Error(
            `Property inquiry readiness command failed to return expected JSON: ${errorMessage(error)}${
              stderr ? ` stderr=${stderr.slice(0, 500)}` : ''
            }`,
          ),
        );
      }
    });
  });

  assert.ok(isRecord(payload.readiness), 'Expected property inquiry readiness metadata.');
  assert.ok(Array.isArray(payload.checks), 'Expected property inquiry readiness checks array.');

  const readinessLevel = isRecord(payload.readiness) ? payload.readiness.level : null;
  assert.ok(
    readinessLevel === 'ready' || readinessLevel === 'watch' || readinessLevel === 'blocked',
    'Expected property inquiry readiness level.',
  );

  const recipientCheck = (payload.checks as unknown[]).find(
    (check) => isRecord(check) && check.name === 'PROPERTY_INQUIRY_NOTIFY_TO',
  );
  assert.ok(isRecord(recipientCheck), 'Expected direct property inquiry recipient check.');
  assert.ok(
    recipientCheck.status === 'pass' || recipientCheck.status === 'warn' || recipientCheck.status === 'fail',
    'Expected direct property inquiry recipient check status.',
  );

  return {
    readiness: readinessLevel,
    recipientStatus: recipientCheck.status,
    sendsEmail: payload.sendsEmail,
    mutatesRows: payload.mutatesRows,
    terminal: payload.terminal,
    nextCommand: payload.nextCommand,
  };
}

async function assertNotificationReadinessSummary() {
  const payload = await new Promise<JsonRecord>((resolve, reject) => {
    let stdout = '';
    let stderr = '';
    const child = spawn(process.execPath, ['dist/scripts/notificationReadinessSummary.js'], {
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    child.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString();
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      try {
        const parsed = parseJsonPayload(stdout);

        assert.ok(isRecord(parsed), 'Expected notification readiness summary output to be a JSON object.');
        assert.equal(parsed.check, 'reie-notification-readiness-summary', 'Expected notification readiness summary check name.');
        assert.equal(parsed.sendsEmail, false, 'Expected notification readiness summary to be non-sending.');
        assert.equal(parsed.mutatesRows, false, 'Expected notification readiness summary to avoid row mutation.');
        assert.equal(code, 0, `Expected notification readiness summary to exit 0, got ${code ?? 'unknown'}.`);

        resolve(parsed);
      } catch (error) {
        reject(
          new Error(
            `Notification readiness summary command failed to return expected JSON: ${errorMessage(error)}${
              stderr ? ` stderr=${stderr.slice(0, 500)}` : ''
            }`,
          ),
        );
      }
    });
  });

  assert.ok(isRecord(payload.readiness), 'Expected notification readiness summary metadata.');
  assert.ok(Array.isArray(payload.results), 'Expected notification readiness summary results array.');
  assert.ok(isRecord(payload.commands), 'Expected notification readiness summary commands metadata.');
  assert.equal(
    isRecord(payload.commands) ? payload.commands.notificationReadiness : null,
    'npm run check:notification-readiness',
    'Expected notification readiness summary command hint.',
  );
  assert.equal(
    isRecord(payload.commands) ? payload.commands.strictNotificationReadiness : null,
    'npm run check:notification-readiness:strict',
    'Expected strict notification readiness summary command hint.',
  );
  assert.equal(
    isRecord(payload.commands) ? payload.commands.strictNotificationReadinessContract : null,
    'npm run check:notification-readiness:strict-contract',
    'Expected strict notification readiness contract command hint.',
  );
  assert.equal(
    isRecord(payload.commands) ? payload.commands.launchReadiness : null,
    'npm run check:launch-readiness',
    'Expected launch readiness command hint in notification summary.',
  );

  const results = payload.results as unknown[];
  const savedSearchResult = results.find((result) => isRecord(result) && result.name === 'Saved-search alert notification');
  const propertyInquiryResult = results.find((result) => isRecord(result) && result.name === 'Property-inquiry notification');
  const aggregateResult = results.find((result) => isRecord(result) && result.name === 'Aggregate launch notification readiness');

  assert.ok(isRecord(savedSearchResult), 'Expected saved-search alert notification summary result.');
  assert.ok(isRecord(propertyInquiryResult), 'Expected property-inquiry notification summary result.');
  assert.ok(isRecord(aggregateResult), 'Expected aggregate launch notification readiness summary result.');
  assert.equal(savedSearchResult.sendsEmail, false, 'Expected saved-search summary child to be non-sending.');
  assert.equal(propertyInquiryResult.sendsEmail, false, 'Expected property-inquiry summary child to be non-sending.');
  assert.equal(aggregateResult.sendsEmail, false, 'Expected aggregate summary child to be non-sending.');
  assert.equal(savedSearchResult.mutatesRows, false, 'Expected saved-search summary child to avoid row mutation.');
  assert.equal(aggregateResult.mutatesRows, false, 'Expected aggregate summary child to avoid row mutation.');
  assert.equal(propertyInquiryResult.mutatesRows, false, 'Expected property-inquiry summary child to avoid row mutation.');
  assert.equal(savedSearchResult.terminal, 'Terminal 5', 'Expected saved-search summary child terminal metadata.');
  assert.equal(propertyInquiryResult.terminal, 'Terminal 5', 'Expected property-inquiry summary child terminal metadata.');
  assert.ok(typeof savedSearchResult.generatedAt === 'string', 'Expected saved-search summary child generatedAt metadata.');
  assert.ok(typeof propertyInquiryResult.generatedAt === 'string', 'Expected property-inquiry summary child generatedAt metadata.');
  assert.equal(savedSearchResult.nextCommand, 'npm run run:alerts:dry -- --limit 50', 'Expected saved-search summary child next command.');
  const expectedPropertyInquiryNextCommand =
    propertyInquiryResult.readiness === 'blocked'
      ? 'npm run check:property-inquiry-notification:readiness'
      : 'npm run check:notification-readiness';
  assert.equal(
    propertyInquiryResult.nextCommand,
    expectedPropertyInquiryNextCommand,
    'Expected property-inquiry summary child next command.',
  );
  assert.ok(isRecord(savedSearchResult.commands), 'Expected saved-search summary child commands metadata.');
  assert.ok(isRecord(propertyInquiryResult.commands), 'Expected property-inquiry summary child commands metadata.');
  assert.equal(
    isRecord(savedSearchResult.commands) ? savedSearchResult.commands.savedSearchAlertReadiness : null,
    'npm run check:alert-notification-readiness',
    'Expected saved-search summary child readiness command hint.',
  );
  assert.equal(
    isRecord(savedSearchResult.commands) ? savedSearchResult.commands.strictNotificationReadinessContract : null,
    'npm run check:notification-readiness:strict-contract',
    'Expected saved-search summary child strict contract command hint.',
  );
  assert.equal(
    isRecord(propertyInquiryResult.commands) ? propertyInquiryResult.commands.propertyInquiryReadiness : null,
    'npm run check:property-inquiry-notification:readiness',
    'Expected property-inquiry summary child readiness command hint.',
  );
  assert.equal(
    isRecord(propertyInquiryResult.commands) ? propertyInquiryResult.commands.strictNotificationReadinessContract : null,
    'npm run check:notification-readiness:strict-contract',
    'Expected property-inquiry summary child strict contract command hint.',
  );
  assert.ok(Array.isArray(savedSearchResult.failedChecks), 'Expected saved-search notification failed checks array.');
  assert.ok(Array.isArray(savedSearchResult.warningChecks), 'Expected saved-search notification warning checks array.');
  assert.ok(Array.isArray(propertyInquiryResult.failedChecks), 'Expected property-inquiry notification failed checks array.');
  assert.ok(Array.isArray(propertyInquiryResult.warningChecks), 'Expected property-inquiry notification warning checks array.');
  assert.ok(Array.isArray(aggregateResult.failedChecks), 'Expected aggregate notification failed checks array.');
  assert.ok(Array.isArray(aggregateResult.warningChecks), 'Expected aggregate notification warning checks array.');

  const recipientFailedCheck = (propertyInquiryResult.failedChecks as unknown[]).find(
    (check) => isRecord(check) && check.name === 'PROPERTY_INQUIRY_NOTIFY_TO',
  );

  if (propertyInquiryResult.readiness === 'blocked') {
    assert.ok(isRecord(recipientFailedCheck), 'Expected blocked property-inquiry summary to expose recipient failed check.');
  }

  return {
    readiness: isRecord(payload.readiness) ? payload.readiness.level : null,
    savedSearchReadiness: savedSearchResult.readiness,
    propertyInquiryReadiness: propertyInquiryResult.readiness,
    aggregateReadiness: aggregateResult.readiness,
    propertyInquiryFailedChecks: Array.isArray(propertyInquiryResult.failedChecks)
      ? propertyInquiryResult.failedChecks.length
      : null,
    aggregateWarningChecks: Array.isArray(aggregateResult.warningChecks) ? aggregateResult.warningChecks.length : null,
  };
}

async function assertNotificationReadinessDryRunGuard({ strictMode = false } = {}) {
  const payload = await new Promise<JsonRecord>((resolve, reject) => {
    let stdout = '';
    let stderr = '';
    const args = ['dist/scripts/notificationReadinessSummary.js'];
    if (strictMode) args.push('--strict');

    const child = spawn(process.execPath, args, {
      env: {
        ...process.env,
        PROPERTY_INQUIRY_NOTIFY_TO: 'internal-property-inquiries@example.com',
        REIE_INTERNAL_EMAIL: '',
        PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN: 'true',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    child.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString();
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      try {
        const parsed = parseJsonPayload(stdout);

        assert.ok(isRecord(parsed), 'Expected dry-run notification readiness summary output to be a JSON object.');
        assert.equal(parsed.check, 'reie-notification-readiness-summary', 'Expected dry-run notification readiness summary check name.');
        assert.equal(parsed.sendsEmail, false, 'Expected dry-run notification readiness summary to be non-sending.');
        assert.equal(parsed.mutatesRows, false, 'Expected dry-run notification readiness summary to avoid row mutation.');
        assert.equal(parsed.strictMode, strictMode, 'Expected dry-run notification readiness strictMode metadata to match command.');

        if (strictMode) {
          assert.equal(code, 1, `Expected strict dry-run notification readiness summary to exit 1, got ${code ?? 'unknown'}.`);
        } else {
          assert.equal(
            code,
            0,
            `Expected dry-run notification readiness summary to exit 0 for operator inspection, got ${code ?? 'unknown'}.`,
          );
        }

        resolve(parsed);
      } catch (error) {
        reject(
          new Error(
            `Dry-run notification readiness summary command failed to return expected JSON: ${errorMessage(error)}${
              stderr ? ` stderr=${stderr.slice(0, 500)}` : ''
            }`,
          ),
        );
      }
    });
  });

  assert.ok(isRecord(payload.readiness), 'Expected dry-run notification readiness summary metadata.');
  assert.equal((payload.readiness as JsonRecord).level, 'blocked', 'Expected dry-run notification readiness summary to block.');
  assert.equal(
    payload.success,
    !strictMode,
    'Expected dry-run notification summary success to reflect strict fail-closed mode.',
  );
  assert.equal(payload.commandSuccess, true, 'Expected dry-run notification summary child commands to be parseable.');
  assert.ok(Array.isArray(payload.results), 'Expected dry-run notification readiness summary results array.');

  const results = payload.results as unknown[];
  const propertyInquiryResult = results.find((result) => isRecord(result) && result.name === 'Property-inquiry notification');
  const aggregateResult = results.find((result) => isRecord(result) && result.name === 'Aggregate launch notification readiness');

  assert.ok(isRecord(propertyInquiryResult), 'Expected dry-run property-inquiry notification summary result.');
  assert.ok(isRecord(aggregateResult), 'Expected dry-run aggregate launch readiness summary result.');
  assert.equal(propertyInquiryResult.readiness, 'blocked', 'Expected dry-run property-inquiry readiness to be blocked.');
  assert.equal(aggregateResult.readiness, 'blocked', 'Expected dry-run aggregate launch readiness to be blocked.');
  assert.ok(Array.isArray(propertyInquiryResult.failedChecks), 'Expected dry-run property-inquiry failed checks array.');
  assert.ok(Array.isArray(aggregateResult.failedChecks), 'Expected dry-run aggregate failed checks array.');

  const propertyInquiryDryRunCheck = (propertyInquiryResult.failedChecks as unknown[]).find(
    (check) => isRecord(check) && check.name === 'PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN',
  );
  const aggregateDryRunCheck = (aggregateResult.failedChecks as unknown[]).find(
    (check) => isRecord(check) && check.name === 'PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN',
  );

  assert.ok(isRecord(propertyInquiryDryRunCheck), 'Expected dry-run property-inquiry summary to expose dry-run failed check.');
  assert.ok(isRecord(aggregateDryRunCheck), 'Expected dry-run aggregate summary to expose dry-run failed check.');

  return {
    readiness: (payload.readiness as JsonRecord).level,
    success: payload.success,
    commandSuccess: payload.commandSuccess,
    strictMode: payload.strictMode,
    propertyInquiryReadiness: propertyInquiryResult.readiness,
    aggregateReadiness: aggregateResult.readiness,
    propertyInquiryDryRunStatus: propertyInquiryDryRunCheck.status,
    aggregateDryRunStatus: aggregateDryRunCheck.status,
  };
}

async function main() {
  const mlsSyncPlan = assertMlsSyncPlan();
  const mlsUpsertDiagnostics = assertMlsUpsertDiagnostics();
  const searchIndexDiagnostics = assertSearchIndexDiagnostics();
  const mlsBatchPlan = assertMlsBatchPlan();
  const mlsBatchMediaDiagnostics = assertMlsBatchMediaDiagnostics();
  const mlsGridRequestDiagnostics = assertMlsGridRequestDiagnostics();
  const redisConnectionDiagnostics = assertRedisConnectionDiagnostics();
  const lazyQueueDiagnostics = assertLazyQueueDiagnostics();
  const databasePreflightDiagnostics = assertDatabasePreflightDiagnostics();
  const appDatabasePreflightDiagnostics = assertAppDatabasePreflightDiagnostics();
  const listingQueuePlan = assertListingQueuePlan();
  const alertQueuePlan = assertAlertQueuePlan();
  const enqueueAlertPlan = assertEnqueueAlertPlan();
  const deadLetterQueuePlan = assertDeadLetterQueuePlan();
  const mlsPageQueuePlan = assertMlsPageQueuePlan();
  const mlsPageWorkerPlan = assertMlsPageWorkerPlan();
  const mlsSyncQueuePlan = assertMlsSyncQueuePlan();
  const mlsWorkerPlan = assertMlsWorkerPlan();
  const mlsPageFetchDiagnostics = assertMlsPageFetchDiagnostics();
  const mlsPhotoDiagnostics = assertMlsPhotoDiagnostics();
  const mlsListingMediaDiagnostics = assertMlsListingMediaDiagnostics();
  const mlsStatus = await assertMlsStatus();
  const mlsSyncRouteDryRun = await assertMlsSyncRouteDryRun();
  const search = await assertSearch();
  const controlState = await assertControlState();
  const intakeSignals = await assertIntakeSignals();
  const crmTasks = await assertCRMTasks();
  const mlsRetryStatus = await assertMlsRetryStatus();
  const mlsRetryDryRun = await assertMlsRetryDryRun();
  const deadLetter = await assertDeadLetter();
  const alertStatus = await assertAlertStatus();
  const notificationReadinessSummary = await assertNotificationReadinessSummary();
  const notificationReadinessDryRunGuard = await assertNotificationReadinessDryRunGuard();
  const strictNotificationReadinessDryRunGuard = await assertNotificationReadinessDryRunGuard({ strictMode: true });
  const savedSearchAlertNotificationReadiness = await assertSavedSearchAlertNotificationReadiness();
  const propertyInquiryNotificationReadiness = await assertPropertyInquiryNotificationReadiness();
  const launchReadiness = await assertLaunchReadiness();
  await runPublicExperienceSmoke();

  console.log(
    JSON.stringify(
      {
        success: true,
        check: 'ops-smoke',
        baseUrl: BASE_URL,
        assertions: {
          mlsStatus,
          mlsSyncPlan,
          mlsUpsertDiagnostics,
          searchIndexDiagnostics,
          mlsBatchPlan,
          mlsBatchMediaDiagnostics,
          mlsGridRequestDiagnostics,
          redisConnectionDiagnostics,
          lazyQueueDiagnostics,
          databasePreflightDiagnostics,
          appDatabasePreflightDiagnostics,
          listingQueuePlan,
          alertQueuePlan,
          enqueueAlertPlan,
          deadLetterQueuePlan,
          mlsPageQueuePlan,
          mlsPageWorkerPlan,
          mlsSyncQueuePlan,
          mlsWorkerPlan,
          mlsPageFetchDiagnostics,
          mlsPhotoDiagnostics,
          mlsListingMediaDiagnostics,
          mlsSyncRouteDryRun,
          search,
          controlState,
          intakeSignals,
          crmTasks,
          mlsRetryStatus,
          mlsRetryDryRun,
          deadLetter,
          alertStatus,
          notificationReadinessSummary,
          notificationReadinessDryRunGuard,
          strictNotificationReadinessDryRunGuard,
          savedSearchAlertNotificationReadiness,
          propertyInquiryNotificationReadiness,
          launchReadiness,
          publicExperience: true,
        },
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(`Ops smoke failed: ${errorMessage(error)}`);
  process.exitCode = 1;
});
