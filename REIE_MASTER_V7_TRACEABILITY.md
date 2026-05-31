# REIE Master V7 Traceability

Date created: May 22, 2026

Last reviewed: May 30, 2026

Project: David Quinn Group Real Estate Intelligence Engine

Working path:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate`

Primary source of truth:

- `/Users/davidquinn/Library/Mobile Documents/com~apple~CloudDocs/BUSINESS/DAVID QUINN GROUP/MEDIA & MARKETING/REAL ESTATE INTELLIGENCE ENGINE/REAL ESTATE INTELLIGENCE ENGINE-MASTER V 7.0.pdf`

## Purpose

This file is the traceability control for building the Real Estate Intelligence Engine from `REAL ESTATE INTELLIGENCE ENGINE-MASTER V 7.0`.

Every future REIE feature, gate, public page, ingestion workflow, search behavior, operational command, and authority signal should map back to the Master V7 plan or be explicitly labeled as implementation support for that plan.

## Source Handling Rule

- Use the exact Master V7 PDF path above as the source of truth for REIE criteria.
- Do not browse or scan other Cloud folders for REIE criteria.
- Use this repository's current files only as implementation evidence, not as a replacement for the Master V7 plan.
- If a future item cannot be tied to Master V7, record it as `Needs V7 confirmation` before building it into the system.

## Filesystem Note

`/Users/davidquinn/david-quinn-group/colorado-real-estate/MASTER_FILES` is a regular legacy text/code note file, not a directory. This traceability file is stored at the project root to avoid deleting, renaming, or overwriting that legacy file.

## Current Extraction Status

The exact Master V7 PDF is present and its embedded PDF title is `REAL ESTATE INTELLIGENCE ENGINE-MASTER V 7.0`.

Local readable-text extraction is not currently available in this environment:

- `pdftotext` is not installed.
- Local Python PDF libraries are not installed.
- `textutil` emitted raw PDF structure instead of readable plan text.
- `strings` confirmed the PDF title but did not expose usable section text.

Until a readable PDF extraction path is available, the working traceability below uses the existing V7-aligned repository documents as implementation evidence and keeps the PDF as the governing source.

## V7-Aligned Operating Pillars

| Pillar | Working Interpretation | Current Evidence |
| --- | --- | --- |
| Public intelligence layer | REIE should be more than a listing site; it should become a public real estate intelligence layer. | `/Users/davidquinn/david-quinn-group/colorado-real-estate/README.md`, `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/STATEoftheUNION` |
| Premium search/map experience | Users should be able to discover Colorado properties through fast map, sidebar, listing, and preview interactions. | `/Users/davidquinn/david-quinn-group/colorado-real-estate/components/maps/SearchMap.tsx`, `/Users/davidquinn/david-quinn-group/colorado-real-estate/components/maps/MapInner.tsx`, `/Users/davidquinn/david-quinn-group/colorado-real-estate/components/search/SearchInterface.tsx` |
| Real MLS inventory and media | Production listing imagery and facts should come from MLS Grid/IDX data, not hidden placeholder fallbacks. | `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/processPhotos.ts`, `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/fetchMLSPage.ts`, `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/processListing.ts` |
| Reliable ingestion and upsert path | MLS data must be fetched, normalized, processed, written, and indexed through bounded, idempotent workflows. | `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/syncMLSGrid.ts`, `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/upsertListing.ts`, `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/mlsSync.ts` |
| Search infrastructure | Typesense and Postgres must stay aligned so public search, map listings, alerts, and property pages use current data. | `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/typesense/schema.ts`, `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/typesense/indexListing.ts`, `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/search/route.ts` |
| Property intelligence fields | REIE should enrich property records with intelligence signals, not only MLS facts. | `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/upsertListing.ts`, `/Users/davidquinn/david-quinn-group/colorado-real-estate/prisma/schema.prisma` |
| Saved-search and client engagement | Alerts, digests, click tracking, unsubscribe handling, and preference learning should create useful client workflows. | `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/alerts`, `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/email`, `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/process-alerts/route.ts` |
| CRM lead intelligence | Engagement and search behavior should support lead scoring, hot-lead review, CRM task reporting, and scheduler-safe CRM readiness payloads. | `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/alerts/getHotLeads.ts`, `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/runCRM.ts`, `/Users/davidquinn/david-quinn-group/colorado-real-estate/workers/runCRMTasks.ts`, `/Users/davidquinn/david-quinn-group/colorado-real-estate/package.json` |
| Operations and recovery | Admin, status, retry, dead-letter, smoke checks, and queue diagnostics must gate live production behavior. | `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/mls/status/route.ts`, `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/admin/dead-letter/route.ts`, `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/launch-core-checklist.md` |
| Google/local authority | Public pages should reinforce David Quinn Group as a Colorado, Boulder, Denver, and Front Range real estate authority. | `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/content-architecture.md`, `/Users/davidquinn/david-quinn-group/colorado-real-estate/PROJECT_SYSTEM.md`, `/Users/davidquinn/david-quinn-group/colorado-real-estate/components/schema`, `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/schema` |

## Current Implementation Mapping

| Area | Files | V7 Role | Current Gate |
| --- | --- | --- | --- |
| Search API readiness | `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/search/route.ts` | Public search and operational reliability | `npm run smoke:search` from Terminal 5 |
| Homepage map metadata | `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/page.tsx`, `/Users/davidquinn/david-quinn-group/colorado-real-estate/components/maps/MapInner.tsx`, `/Users/davidquinn/david-quinn-group/colorado-real-estate/components/maps/SearchMap.tsx` | Smooth map/listing experience with visible diagnostics | Search Smoke Readiness has no blockers |
| MLS media processing | `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/processPhotos.ts` | Replace placeholder imagery with real listing media while preserving existing photos safely | Bounded MLS dry-run and media inspection |
| MLS page fetch | `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/fetchMLSPage.ts` | Bounded IDX/MLS retrieval with timeout and pagination safety | `npm run run:mls-sync:dry` from Terminal 5 |
| Listing processing | `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/processListing.ts` | Normalize, upsert, and index listing data | Worker build plus bounded sync |
| Listing upsert | `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/upsertListing.ts` | Persist live listing data and REIE intelligence fields | Prisma/type/build checks |
| MLS sync orchestration | `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/syncMLSGrid.ts`, `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/mlsSync.ts` | Controlled ingestion pipeline | Dry-run before live execution |
| Data model | `/Users/davidquinn/david-quinn-group/colorado-real-estate/prisma/schema.prisma` | Canonical relational shape for listings, users, alerts, CRM, and intelligence | Prisma validation and typecheck |
| CRM scheduler and admin API readiness | `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/runCRM.ts`, `/Users/davidquinn/david-quinn-group/colorado-real-estate/workers/runCRMTasks.ts`, `/Users/davidquinn/david-quinn-group/colorado-real-estate/package.json`, `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/admin/crm-tasks/route.ts`, `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/admin/crm-tasks/[id]/route.ts`, `/Users/davidquinn/david-quinn-group/colorado-real-estate/components/admin/MasterControlPanel.tsx`, `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/production-scheduler-plan.md`, `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/launch-core-checklist.md`, `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/platform-architecture.md`, `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/alert-architecture.md`, `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/email-system.md`, `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/mls-ingestion.md`, `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/legacy-mls-cleanup-plan.md`, `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/content-architecture.md`, `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/atlas-platform-plan.md` | Scheduler-safe CRM reporting and protected CRM admin APIs for lead intelligence, closure audit coverage, machine-readable provider logs, route inspection metadata on success and error responses, API-provided `inspectionSource` values for List Route and Detail Route, detail-route inspection after Review/Complete/Dismiss actions, preserved failed detail-route inspection metadata in `/admin`, note-backed completion/dismissal, admin UI visibility of API and scheduler commands, smaller-screen-readable command panels, content-planning gates, and production readiness gates | `npm run run:crm:scheduler` and protected `/api/admin/crm-tasks` smoke checks from Terminal 5 after Supabase connectivity is available |
| Operations hub | `/Users/davidquinn/david-quinn-group/colorado-real-estate/components/admin/MasterControlPanel.tsx`, `/Users/davidquinn/david-quinn-group/colorado-real-estate/app/api/mls/status/route.ts` | Readiness visibility before raising production volume | `npm run smoke:ops` from Terminal 5 |
| Launch control | `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/launch-core-checklist.md`, `/Users/davidquinn/david-quinn-group/colorado-real-estate/PROJECT_SYSTEM.md` | Development and production gates | Checklist remains aligned with current routes and commands |

## Acceptance Gate For Future Work

Before marking any REIE feature complete, record or verify:

1. Master V7 source alignment.
2. Full file paths created or replaced.
3. Whether the change is product behavior, operational support, SEO authority, ingestion, search, or CRM.
4. Terminal-specific verification command.
5. Whether live execution is blocked behind dry-run and smoke checks.
6. Whether any real file deletion is required.
7. The next recommended file.

## Current Launch Gates

Use **Terminal 5: Scripts / curl testing** for verification:

Fast recurring verification:

```bash
npm run check:fast
```

Expanded verification:

```bash
npm run worker:build
npm run run:mls-sync:dry
npm run typecheck
npm run lint
npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000
npm run run:seed:quick:dry
npm run run:seed:test:dry
npm run build
npm run smoke:mls-status
npm run smoke:search
npm run smoke:ops
npm run run:crm:scheduler
```

Canonical local Typesense repair and reindex commands from **Terminal 5: Scripts / curl testing** after **Terminal 4: Docker / Typesense** infrastructure is running:

```bash
npm run worker:build
npm run typesense:init
npm run typesense:reindex
```

The older `run:typesense:*` package aliases remain for compatibility, but new documentation and user-facing guidance should use `typesense:*`.

Use **Terminal 4: Docker / Typesense** for infrastructure:

```bash
npm run infra:up
```

Use **Terminal 1: Next.js app** for the local app:

```bash
npm run dev
```

## Recent Traceability Closures

| Date | Area | Closure | Verification |
| --- | --- | --- | --- |
| May 26, 2026 | CRM scheduler readiness | `run:crm:scheduler` JSON contract and protected CRM task route guidance are aligned across scheduler, launch, platform, alert, email, and roadmap docs. Scheduler payload requires `mode: "scheduler"`, `schemaVersion: 1`, `generatedAt`, `command`, and `report.readiness.level`. | `npm run check:fast` from Terminal 5 |
| May 26, 2026 | CRM admin API metadata | `/api/admin/crm-tasks` and `/api/admin/crm-tasks/[id]` expose operator metadata with `generatedAt`, `terminal`, `inspectionSource`, `route`, and `command` on success and error responses, and docs now include protected smoke-check patterns for list and detail routes. | `npm run check:fast` from Terminal 5 |
| May 26, 2026 | CRM admin UI inspection | `/admin` CRM Task Readiness surfaces CRM API Inspection metadata for `generatedAt`, `inspectionSource`, `route`, `terminal`, the Terminal 5 inspection command, the visible `npm run run:crm:scheduler` command, preserved failed detail-route inspection metadata, and smaller-screen-readable command panels. | `npm run check:fast` from Terminal 5 |
| May 26, 2026 | CRM review-action inspection | CRM Review, Complete, and Dismiss actions expose `/api/admin/crm-tasks/[id]` inspection metadata before the active-task list refresh returns CRM API Inspection to `/api/admin/crm-tasks` metadata, preserve failed detail-route inspection metadata when a request fails, and render the visible Source field from API-provided `inspectionSource` values moving from `Detail Route` back to `List Route`. | `npm run check:fast` from Terminal 5 |
| May 26, 2026 | Operating docs alignment | `README.md`, `docs/CHAT_START.md`, `PROJECT_SYSTEM.md`, and `docs/STATEoftheUNION` now reflect CRM scheduler/admin readiness, protected CRM task routes, API inspection metadata, and `/admin` CRM command-panel behavior. | `npm run check:fast` from Terminal 5 |
| May 27, 2026 | Bounded scheduler documentation | `docs/production-scheduler-plan.md`, `docs/launch-core-checklist.md`, `docs/STATEoftheUNION`, and `docs/CHAT_START.md` now prefer explicitly bounded live MLS scheduler commands with `--execute`, `--json`, `--max-pages`, `--page-size`, `--start-page`, and `--page-timeout-ms` instead of broad live shortcuts. | `npm run check:fast` from Terminal 5 |
| May 27, 2026 | CRM documentation completion | `docs/email-system.md`, `docs/mls-ingestion.md`, `docs/legacy-mls-cleanup-plan.md`, `docs/content-architecture.md`, `docs/production-scheduler-plan.md`, `docs/launch-core-checklist.md`, `docs/STATEoftheUNION`, and `docs/CHAT_START.md` now align around CRM list/detail inspection metadata on success and error responses, failed detail-route preservation, note-backed completion/dismissal, and protected CRM curl checks. | `npm run check:fast` from Terminal 5 |
| May 27, 2026 | Content authority gates | `docs/content-architecture.md` now requires protected CRM readiness, closure audit coverage, failed detail-route inspection preservation, and Search Smoke Readiness before CRM engagement or live inventory signals are used for public content planning. | `npm run check:fast` from Terminal 5 |
| May 28, 2026 | Bounded MLS command alignment | `package.json`, `scripts/mlsSync.ts`, `scripts/fetchMLS.ts`, `lib/queue/redis.ts`, `README.md`, and operating docs now align around JSON dry-runs, explicitly bounded live MLS syncs, `pageTimeoutMs`/`--page-timeout-ms`, bounded Redis reconnect behavior for MLS sync scripts, and timeout-bounded queue-dashboard guidance. | `npm run check:fast` from Terminal 5 |
| May 29, 2026 | Timeout-bounded queue diagnostics docs | `README.md`, `PROJECT_SYSTEM.md`, `docs/CHAT_START.md`, `docs/platform-architecture.md`, `docs/alert-architecture.md`, `docs/STATEoftheUNION`, `docs/production-scheduler-plan.md`, `docs/launch-core-checklist.md`, `docs/legacy-mls-cleanup-plan.md`, `docs/mls-ingestion.md`, `docs/email-system.md`, `docs/content-architecture.md`, `docs/atlas-platform-plan.md`, and `docs/production-architecture.md` now use `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000` in Terminal 5 maps, launch gates, scheduler gates, content authority gates, restart rules, authority guidance, live email readiness, MLS-volume guidance, dead-letter/queue diagnostic guidance, diagnostic-only queue-dashboard wording, and the launch checklist's large programmatic content batch gate so queue inspection remains bounded before retry, scheduler, recurring email traffic, alert, digest, live-inventory, content-planning, large programmatic content batch publication, or MLS-volume decisions. | `npm run check:fast` from Terminal 5 |
| May 30, 2026 | Launch gate documentation alignment | `README.md`, `PROJECT_SYSTEM.md`, `docs/CHAT_START.md`, `docs/platform-architecture.md`, `docs/alert-architecture.md`, `docs/email-system.md`, `docs/mls-ingestion.md`, `docs/legacy-mls-cleanup-plan.md`, `docs/production-scheduler-plan.md`, `docs/launch-core-checklist.md`, `docs/content-architecture.md`, `docs/atlas-platform-plan.md`, `docs/production-architecture.md`, and `docs/STATEoftheUNION` now consistently gate ingestion volume, MLS-volume decisions, scheduler cadence, recurring scheduler activation, recurring email traffic including recurring alert or digest sends, MLS-backed public expansion, live-inventory claims, and large programmatic content batch publication on search-index health, Search Smoke Readiness, acceptable timeout-bounded queue diagnostics, verified data, metadata, canonical structure, and indexing behavior where applicable. The operating docs, email-system readiness rules, and legacy cleanup record now treat recurring email traffic as the parent category, with alert and digest traffic as examples; they use recurring email traffic readiness for continuous alert workers and scheduler cadence wording for CRM blockers. The cleanup, chat-start, content, platform, and state docs now use canonical MLS-backed public expansion and large programmatic content batch publication wording. Degraded Search Smoke Readiness is documented as a blocker before MLS volume, recurring email traffic, alert or digest traffic, or scheduler cadence. Unacceptable timeout-bounded queue diagnostics are documented as live-send blockers before recurring email traffic and as blockers before MLS-backed public expansion, live-inventory claims, MLS-volume decisions or increases, scheduler cadence decisions or increases, and large programmatic content batch publication. | `npm run check:fast` from Terminal 5 |

## Open Traceability Items

| Item | Status | Next Action |
| --- | --- | --- |
| Extract readable text from Master V7 PDF | Open | Install or use a local PDF text extraction path, then map exact V7 sections to this file. |
| Repair local Typesense collections | Open | Run the Terminal 4 and Terminal 5 repair/reindex flow after infrastructure is ready. |
| Verify Search Smoke Readiness after Typesense repair | Open | Run `npm run smoke:search` from Terminal 5. |
| Confirm live MLS dry-run path | Open | Run bounded MLS dry-run before any live sync. |
| Continue real media replacement | Open | Use MLS media pipeline and inspect sidebar/listing images. |
| Strengthen public authority surfaces | Open | Use `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/content-architecture.md` to prioritize only pages that can support real Colorado, Boulder, Denver, or Front Range value. |

## Non-Deletion Note

No files should be deleted as part of creating or maintaining this traceability control unless a future task identifies a separate obsolete file and the deletion is explicitly reviewed.

<!-- /Users/davidquinn/david-quinn-group/colorado-real-estate/REIE_MASTER_V7_TRACEABILITY.md -->
