# Legacy MLS Cleanup Plan

The legacy MLS helper cleanup pass is complete for the active MLS Grid ingestion path and the older root-level demo MLS helpers.

The active ingestion system is centered on MLS Grid, bounded sync scripts, protected operational API routes, page-level workers, deterministic listing processing, Prisma writes, media preservation, Typesense refresh through the canonical schema, saved-search alert matching, Search Smoke Readiness, and explicit production scheduler commands. The old helper files that duplicated or conflicted with that path have been removed.

This document is the cleanup completion record and the gate for future MLS-related deletes.

Traceability control:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/REIE_MASTER_V7_TRACEABILITY.md`

Authoritative Master V7 source PDF:

- `/Users/davidquinn/Library/Mobile Documents/com~apple~CloudDocs/BUSINESS/DAVID QUINN GROUP/MEDIA & MARKETING/REAL ESTATE INTELLIGENCE ENGINE/REAL ESTATE INTELLIGENCE ENGINE-MASTER V 7.0.pdf`

## Current Operational Boundary

The active MLS system has one canonical production direction: MLS Grid data enters through bounded sync entrypoints, is normalized through the active listing processing pipeline, is written to Prisma, and is then reflected into Typesense through the canonical schema. Search-index health is surfaced through `npm run smoke:mls-status`; Search Smoke Readiness is surfaced through `npm run smoke:search`; queue diagnostics use `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`; large programmatic content batch publication, recurring email traffic, live-inventory claims, MLS-backed public expansion, MLS-volume increases, and scheduler cadence increases must wait for verified data, metadata, canonical structure, indexing behavior, Search Smoke Readiness, and timeout-bounded queue diagnostics where applicable.

Protected operational routes:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/mls/sync/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/mls-sync/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/mls/status/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/mls/retry/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/admin/dead-letter/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/process-alerts/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/admin/crm-tasks/route.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/admin/crm-tasks/[id]/route.ts`

Production admin protection uses `REIE_ADMIN_API_KEY` first, then `ADMIN_API_KEY` as a fallback. Accepted auth forms are `x-admin-key`, `Authorization: Bearer <key>`, and `adminKey` in POST JSON. Route-triggered MLS validation should use `dryRun=true` unless the explicit goal is to write fresh MLS data.

Useful smoke checks from **Terminal 5: Scripts / curl testing**:

```bash
npm run smoke:mls-status
npm run smoke:search
npm run smoke:ops
```

Useful protected route curl checks:

```bash
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/status" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/search?limit=5"
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/sync?maxPages=1&pageSize=5&startPage=0&pageTimeoutMs=30000&dryRun=true" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls-sync?maxPages=1&pageSize=5&startPage=0&pageTimeoutMs=30000&dryRun=true" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 20 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/process-alerts?dryRun=true&limit=10" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks?status=active&limit=6" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks/<task-id-from-list-response>" -H "x-admin-key: $REIE_ADMIN_API_KEY"
```

## Active MLS Grid Path

These files remain the active ingestion surface:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/mlsSync.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/fetchMLS.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/workers/mlsWorker.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/workers/mlsPageWorker.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/syncMLSGrid.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/fetchMLSPage.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/mlsGridClient.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/processListingsBatch.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/processListing.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/upsertListing.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/processPhotos.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/handleStatusChange.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/updateSearch.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/updateSearchIndex.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/syncState.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/queue/mlsQueue.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/queue/mlsPageQueue.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/queue/listingQueue.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/queue/worker.ts`

## Compatibility Entrypoint

`/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/fetchMLS.ts` remains as a compatibility wrapper only.

- Default behavior is no-write guidance.
- `--sync` runs the active `syncMLSGrid()` path.
- `--enqueue` is a deprecated alias for `--sync`.
- `--page-timeout-ms` forwards bounded page timeout control to the active sync path.
- It does not import removed IRES helpers or legacy listing normalizers.
- It should not become a separate production ingestion path.

## Deleted Legacy Files

These files were removed because they were unused by the active MLS Grid path or represented older ingestion behavior:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/fetchIRESListings.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/normalizeIRESListing.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/normalizeListing.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/fetchMLS.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/mockListings.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/enqueueListings.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/parseMLS.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/scheduleJobs.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mlsImporter.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mlsSync.ts`

## Current Scan Result

Source scan result outside `dist/`, `typesense-data`, and generated build metadata:

- Deleted legacy MLS source files are absent.
- `data/addresses.ts` no longer imports `@/lib/mlsImporter`.
- `lib/mlsImporter.ts` has been deleted.
- `lib/mlsSync.ts` has been deleted.
- No root-level demo MLS helper remains pending in this cleanup pass.
- Remaining `normalizeListing` text matches local helper function names in active UI/email files, not the deleted `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/normalizeListing.ts` file.
- Search-index diagnostics now live in active status, admin, search API, and map UI files; those references are not legacy MLS cleanup targets.
- CRM admin inspection metadata now lives in protected CRM task APIs and `/admin`; `inspectionSource: "List Route"` and `inspectionSource: "Detail Route"` references are operational evidence, not legacy MLS cleanup targets.

Useful scan commands from **Terminal 5: Scripts / curl testing**:

```bash
rg -n "fetchIRESListings|normalizeIRESListing|normalizeListing|lib/mls/fetchMLS|mockListings|enqueueListings|parseMLS|scheduleJobs|mlsImporter|lib/mlsSync" . --glob '!dist/**' --glob '!typesense-data/**' --glob '!node_modules/**' --glob '!*.tsbuildinfo'
rg --files | rg "(fetchIRESListings|normalizeIRESListing|normalizeListing|fetchMLS|parseMLS|mockListings|enqueueListings|mlsImporter|mlsSync)"
```

## Generated Output Caveat

`dist/` is generated worker and script output.

- `dist/` may still contain stale JavaScript for deleted source files until generated output is cleaned or regenerated from a clean output directory.
- Source scans are authoritative unless a runtime command directly executes stale generated files.
- If generated output becomes operationally confusing, clean generated output and rerun `npm run worker:build`.
- Do not delete source files just because similarly named generated files appear under `dist/`.

## Seed Workflow Boundary

Seed scripts are now the explicit local data setup and visual QA path. They are separate from legacy MLS cleanup and separate from production MLS ingestion.

Primary seed files:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/quickSeed.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/seedTestProperties.ts`

Rules:

- Do not use legacy MLS demo helpers as a seed strategy.
- Do not create ad hoc Typesense collections from compatibility helpers.
- Keep seed scripts explicit, bounded, terminal-run, and out of app startup, API routes, page rendering, and recurring production schedules.
- Real MLS media remains the production source for live listing imagery.

## Search Index And Typesense Repair Boundary

Local Typesense may retain an older `listings` collection after code has moved forward. That stale collection warning is not evidence that legacy MLS files are still active.

Search-index checks from **Terminal 5: Scripts / curl testing** while **Terminal 1: Next.js app** is running:

```bash
npm run smoke:mls-status
npm run smoke:search
npm run smoke:ops
```

Expected readiness signals:

- `/api/mls/status` includes `searchIndex.attempted`, `searchIndex.succeeded`, `searchIndex.failed`, `searchIndex.unknown`, `searchIndex.health`, `searchIndex.diagnostics`, and `searchIndex.recent`.
- `/api/mls/status` includes `commands.smokeOps`, `commands.smokeMlsStatus`, `commands.smokeSearch`, `commands.rawStatus`, and `commands.rawSearchCheck` for admin and operator guidance.
- `searchIndex.failed` should be `0` before recurring scheduler activation, scheduler cadence increases, or MLS-volume increases.
- `npm run smoke:search` Search Smoke Readiness includes metadata for `source`, `meta.source`, `health`, `accessLevel`, `filtersApplied`, `boundsApplied`, `returned`, `mapped`, `coordinateFiltered`, `durationMs`, `meta.smoke.ready`, and `meta.smoke.blockers`.
- `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000` should report acceptable queue diagnostics before recurring email traffic, live-inventory claims, MLS-backed public expansion, MLS-volume increases, scheduler cadence increases, or large programmatic content batch publication.
- Degraded search metadata, `meta.smoke.ready=false`, or non-empty smoke blockers are repair/readiness issues, not reasons to restore removed legacy ingestion helpers.

Use **Terminal 4: Docker / Typesense**:

```bash
npm run infra:up
```

Then use **Terminal 5: Scripts / curl testing**:

```bash
npm run worker:build
npm run typesense:init
npm run typesense:reindex
```

## Completion Verification

Current cleanup state:

- The active `lib/mls/` legacy helper cleanup pass is complete.
- The root-level demo MLS helper cleanup pass is complete.
- No confirmed dead legacy MLS helper files remain in this cleanup pass.
- Useful GC-forensics and resilience scoring logic was preserved in `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/upsertListing.ts`.
- Production scheduling is documented in `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/production-scheduler-plan.md`.
- Search indexing uses the canonical Typesense schema and validation path from `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/typesense/schema.ts`.
- `npm run smoke:mls-status`, `/admin`, `npm run smoke:search`, `/search`, `/`, and `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000` now expose or preserve search-index health, Search Smoke Readiness, indexing behavior, and bounded queue diagnostics for launch readiness, recurring email traffic, live-inventory claims, MLS-backed public expansion, MLS-volume decisions, scheduler cadence, and large programmatic content batch publication gates.
- `/api/admin/crm-tasks`, `/api/admin/crm-tasks/[id]`, and `/admin` now expose CRM inspection metadata on success and error responses, preserve failed detail-route inspection metadata, and keep CRM closure audit coverage visible for recurring email traffic and engagement handoff.
- Local Typesense `properties` and `listings` collections were verified ready with `npm run typesense:collections:check` on May 31, 2026.

Required verification from **Terminal 5: Scripts / curl testing**:

```bash
npm run lint
npm run worker:build
npm run run:mls-sync:dry
npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000
npm run run:alerts -- --help
npm run run:digest -- --help
npm run run:seed:quick:dry
npm run run:seed:test:dry
npm run build
npm run typecheck
npm run smoke:mls-status
npm run smoke:search
npm run smoke:ops
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks?status=active&limit=6" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks/<task-id-from-list-response>" -H "x-admin-key: $REIE_ADMIN_API_KEY"
```

Run `npm run typecheck` after `npm run build`, not in parallel with it, because `.next/types` is generated during the build.

## Future Cleanup Gate

Only delete future MLS or demo listing files after all of these are true:

1. No active imports reference the file.
2. No worker, script, API route, page, component, data file, or queue path depends on it.
3. No diagnostics, metadata, launch-readiness, alert, digest, public search, or large programmatic content batch publication path depends on it.
4. Any useful business logic has been merged into the active path, moved to seed scripts, or explicitly rejected.
5. Documentation has been updated.
6. Verification passes from **Terminal 5: Scripts / curl testing**.

## Known Non-Blocking Warnings

- Node `url.parse()` deprecation warnings appear during `npm run build`.
- Local Typesense `properties` and `listings` collections were verified ready with `npm run typesense:collections:check` on May 31, 2026.

## Terminal Guidance

Use **Terminal 5: Scripts / curl testing** for cleanup scans and verification commands.

Use **Terminal 4: Docker / Typesense** only when repairing or validating local Typesense infrastructure.

<!-- /Users/davidquinn/david-quinn-group/colorado-real-estate/docs/legacy-mls-cleanup-plan.md -->
