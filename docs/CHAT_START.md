# Chat Start Context

Use this file to restart work on the Real Estate Intelligence Engine without losing project direction, operating rules, current blockers, scheduler status, seed workflow status, cleanup status, or verification baseline.

## Project

Product:

- David Quinn Group Real Estate Intelligence Engine

Workspace:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate`

Master plan:

- `REAL ESTATE INTELLIGENCE ENGINE-MASTER V 7.0`

Traceability control:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/REIE_MASTER_V7_TRACEABILITY.md`

Authoritative Master V7 source PDF:

- `/Users/davidquinn/Library/Mobile Documents/com~apple~CloudDocs/BUSINESS/DAVID QUINN GROUP/MEDIA & MARKETING/REAL ESTATE INTELLIGENCE ENGINE/REAL ESTATE INTELLIGENCE ENGINE-MASTER V 7.0.pdf`

Primary goal:

- Build a Colorado real estate intelligence platform that combines premium MLS search, property intelligence, market content, saved-search alerts, digest emails, CRM lead intelligence, operational recovery, dead-letter inspection, scheduler planning, explicit seed workflows, and SEO authority for David Quinn Group, with emphasis on Boulder, Denver, and the surrounding Front Range.

## Required User Preferences

- Always name the full file path being created or replaced.
- Replace full files, not snippets.
- Put a file path comment at the bottom of code files when file syntax allows comments.
- JSON files cannot include comments.
- State which VS Code terminal should run commands.
- End each work response with the next recommended file.
- Do not describe replaced legacy code as a file delete.
- Mention deletes only when an actual separate file should be removed.

## Operating Docs To Read First

Primary:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/REIE_MASTER_V7_TRACEABILITY.md`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/README.md`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/PROJECT_SYSTEM.md`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/STATEoftheUNION`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/atlas-platform-plan.md`

Architecture:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/platform-architecture.md`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/production-architecture.md`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/production-scheduler-plan.md`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/launch-core-checklist.md`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/legacy-mls-cleanup-plan.md`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/mls-ingestion.md`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/alert-architecture.md`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/email-system.md`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/content-architecture.md`

## Current Product Direction

REIE should become David Quinn Group's public intelligence layer for Colorado real estate, not only a property search site.

Core outcomes:

- Premium map-led Colorado property search.
- Reliable MLS Grid ingestion with real listing media instead of placeholders.
- Search backed by Postgres source-of-truth data and Typesense indexing.
- Search/map diagnostics that distinguish Typesense results, database fallback, health, access level, filters, bounds state, request timing, mapped records, coordinate-filtered records, and Search Smoke Readiness blockers.
- Saved-search alerts and digest emails with safe tracking and unsubscribe flows.
- CRM intelligence based on clicks, saved searches, preferences, alert engagement, and heat score.
- Crawlable city, neighborhood, market, property, article, and tool surfaces.
- Operational tooling for sync status, retry, dead-letter inspection, scheduler planning, seed verification, CRM task reporting, and CRM scheduler/admin readiness.
- Clear David Quinn Group authority signals for Colorado, Boulder, Denver, and nearby Front Range markets.

## Terminal Map

| Terminal | Purpose | Primary command |
| --- | --- | --- |
| Terminal 1 | Next.js app | `npm run dev` |
| Terminal 2 | MLS Page Worker | `npm run run:worker:mls-page` |
| Terminal 3 | Coordinator | `npm run run:worker:mls` |
| Terminal 4 | Docker / Typesense | `npm run infra:up` |
| Terminal 5 | Scripts / curl testing | `npm run worker:build`, `npm run run:mls-sync:dry`, `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`, `npm run smoke:ops`, bounded live syncs, seed commands, CRM help, smoke checks, curl checks, Typesense repair |

## Current Architecture Snapshot

Frontend:

- Next.js App Router
- React
- Tailwind CSS
- Leaflet map/search experience

Database:

- Supabase PostgreSQL
- Prisma Client

Search:

- Typesense
- `properties` collection
- `listings` collection
- Canonical schema in `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/typesense/schema.ts`
- Required field, required facet, field type, sortable field, and default sort validation for both search collections

Queues and workers:

- Redis
- BullMQ
- `mls-sync`
- `mls-page`
- `reie-alerts`
- `reie-dead-letter`
- Compiled worker output in `dist/workers`
- Compiled script output in `dist/scripts`

Email:

- Resend
- Alert and digest rendering through `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/email/sendEmail.ts`
- Unsubscribe through `/api/unsubscribe`
- Click tracking through `/api/track-click`
- Delivery records through `EmailLog`

MLS intelligence:

- `scripts/fetchMLS.ts` is a compatibility wrapper around the active `syncMLSGrid()` path.
- `upsertListing.ts` writes `gcForensics`, `efficiencyScore`, `resilienceScore`, `altitude`, `soilType`, and `hasPolybutyleneRisk`.
- `processPhotos.ts` preserves existing photos when MLS returns no usable media.
- `processPhotos.ts` rejects string non-image media URLs and PDF/document/brochure/video/floor-plan/virtual-tour records before replacing `PropertyPhoto` rows.
- `processListing.ts` exposes listing-level media extraction diagnostics for direct media arrays, nested media arrays, top-level photo fields, extracted media count, and ignored media item count before photo replacement.
- `processListingsBatch.ts` aggregates listing-level media diagnostics into batch/page-worker media payload shape counts without exposing raw media URLs.
- Page-worker completion logs, `/api/mls/status`, `/admin` completed-job summaries, and `/api/mls/sync` dry-run expected metric plus inspection hints expose aggregate media diagnostics for operator review.
- Top-level listing photo URL fields are extracted without forcing `MediaType: image`, so top-level PDF URLs remain subject to the non-image guard.
- `processListing.ts` updates Typesense through `updateSearchIndex.ts` after successful upsert.
- `updateSearchIndex.ts` delegates to the canonical listing indexer.
- Listing jobs, page-worker jobs, batch processing, direct syncs, `/api/mls/status`, and `/admin` can surface search-index attempts, successes, failures, and errors.
- Legacy IRES/helper cleanup is complete, including old root-level demo MLS helpers.

Typesense indexing:

- `lib/typesense/indexListing.ts` indexes single listings into both `properties` and `listings`.
- `lib/typesense/indexProperties.ts` reuses the same document mapper for bulk reindexing.
- `scripts/initTypesense.ts`, `scripts/index.ts`, `scripts/createTypesenseCollection.ts`, and `scripts/createCollection.js` use canonical schema validation.
- `/api/search` returns source, `meta.source`, health, access level, active filters, bounds state, duration, returned count, mapped count, coordinate-filtered count, `meta.smoke`, and Typesense collection/query/filter/sort metadata.
- `meta.smoke` reports Terminal 5 `npm run smoke:search` readiness with command, terminal, ready, blockers, and structured checks.
- `searchPropertiesWithMeta()` returns server-side database search results with matching map diagnostics.
- `app/search/page.tsx` passes normalized server search metadata into `SearchInterface`.
- `app/page.tsx` preserves `/api/search` metadata for homepage map searches and supplies compatible fallback smoke diagnostics when needed.
- `SearchInterface`, `MapInner`, and `SearchMap` keep sidebar listings, map listings, selection state, hover state, public/contracted access filtering, and metadata aligned.
- `SearchMap` exposes search metadata through `data-search-*` and `data-search-smoke-*` attributes and a compact diagnostic overlay when metadata exists or coordinate filtering occurs.
- `/api/mls/status` exposes a first-class `searchIndex` block with recent completed job counters and diagnostics.
- `/api/mls/status` exposes first-class smoke commands in `commands.smokeOps`, `commands.smokeMlsStatus`, and `commands.smokeSearch`, while preserving raw curl commands in `commands.rawStatus` and `commands.rawSearchCheck`.
- `/admin` surfaces search-index health and Terminal 5 smoke checks for MLS status and Search Smoke Readiness.

Seed data:

- `scripts/quickSeed.ts` writes a small David Quinn Group authority seed.
- `scripts/seedTestProperties.ts` writes broader Boulder/Louisville test inventory.
- Both scripts create/update `Property` rows and replace their own `PropertyPhoto` rows.
- Both scripts report database, photo, and per-collection Typesense status.
- Seed commands are explicit Terminal 5 tools, not app startup behavior, API behavior, scheduled jobs, or production inventory strategy.

CRM:

- `UserInteraction`
- `AlertQueue.clickedAt`
- `User.heatScore`
- `UserPreference`
- `PRE_DISCOVERY_BRIEF` tasks through `prisma.cRMTask`
- `strategy_intake` tasks from saved-search intake
- `/api/admin/crm-tasks` lists active, pending, reviewing, completed, dismissed, or all CRM queues with alert-readiness metadata.
- `/api/admin/crm-tasks` returns `generatedAt`, `terminal`, `inspectionSource: "List Route"`, `route`, and `command` on success and error responses; successful responses also include an `audit` block for closure review coverage, completed/dismissed counts, closed tasks with review notes, and closed tasks missing review notes.
- `/api/admin/crm-tasks` returns a `readiness` block with `level`, `summary`, `nextAction`, `terminal`, `nextCommand`, and gates for Closure Audit, Active Review, and Alert Criteria.
- `/api/admin/crm-tasks/[id]` reads or updates one CRM task with bounded review metadata plus `generatedAt`, `terminal`, `inspectionSource: "Detail Route"`, `route`, and `command` inspection metadata on success and error responses.
- `/api/admin/crm-tasks/[id]` requires a non-empty review note before a CRM task can be marked `completed` or `dismissed`.
- `/api/admin/crm-tasks/[id]` records `metadata.review.completedAt` or `metadata.review.dismissedAt` when tasks are closed.
- `/admin` surfaces CRM task readiness, readiness gates, active review state, latest saved-search intake, Review actions, note-backed Complete/Dismiss actions, closure audit coverage, missing-note counts, CRM API Inspection metadata with a visible Source field rendered from API-provided `inspectionSource`, preserved failed detail-route inspection metadata, and the visible `npm run run:crm:scheduler` command.
- `/admin` CRM API Inspection shows API-provided `List Route` metadata for `/api/admin/crm-tasks` by default and briefly shows API-provided `Detail Route` metadata for `/api/admin/crm-tasks/[id]` after Review, Complete, or Dismiss actions before the active-task list refresh returns `List Route` metadata.
- `/admin` CRM command panels are structured to remain readable on smaller screens.
- CLI reporting through `npm run run:crm`, `npm run run:crm:active`, `npm run run:crm:pending`, `npm run run:crm:reviewing`, `npm run run:crm:all`, and `node dist/workers/runCRMTasks.js` includes closure audit counts and CRM readiness gates.
- Scheduler-safe CRM reporting uses `npm run run:crm:scheduler` for one machine-readable Terminal 5 payload with `success`, `mode: "scheduler"`, `schemaVersion: 1`, `generatedAt`, `command`, `report.audit`, `report.readiness`, and `tasks`.

Generated output:

- `dist/` is generated worker and script output.
- The known stale legacy MLS generated artifacts were removed on June 21 08:28 MDT; `npm run worker:build` passed and the no-source `dist/*.js` scan returned empty.
- Source scans remain authoritative when reviewing intended behavior.

## Protected Operational APIs

These routes require `REIE_ADMIN_API_KEY` or `ADMIN_API_KEY` in production:

- `GET /api/mls/status`
- `GET /api/mls/retry`
- `POST /api/mls/retry`
- `GET /api/mls/sync`
- `POST /api/mls/sync`
- `GET /api/mls-sync`
- `POST /api/mls-sync`
- `GET /api/admin/dead-letter`
- `GET /api/admin/control-state`
- `PATCH /api/admin/control-state`
- `GET /api/admin/crm-tasks`
- `GET /api/admin/crm-tasks/[id]`
- `PATCH /api/admin/crm-tasks/[id]`
- `GET /api/admin/intake-signals`
- `GET /api/admin/intake-signals/[id]`
- `PATCH /api/admin/intake-signals/[id]`
- `GET /api/process-alerts`
- `POST /api/process-alerts`

Accepted auth forms:

- Header: `x-admin-key: <key>`
- Header: `Authorization: Bearer <key>`
- Query string for local/manual testing: `?adminKey=<key>`
- POST JSON `adminKey` for route handlers that explicitly support body-based local/manual testing.

Local development can bypass the key only when neither admin key environment variable is configured.

## Current Known Warnings

These are known and non-blocking:

- `npm run build` may show Node `url.parse()` deprecation warnings.
- Local Typesense `properties` and `listings` collections were verified ready with `npm run typesense:collections:check` and refreshed with `npm run typesense:reindex` on June 16, 2026.
- Known stale legacy MLS generated artifacts in `dist/` were cleaned on June 21 08:28 MDT; `npm run worker:build` passed afterward and no generated JavaScript files lacked live TypeScript sources.
- MLS photo normalization now rejects string non-image media URLs and PDF/document/brochure/video/floor-plan/virtual-tour records before replacing `PropertyPhoto` rows; `npm run smoke:ops` covers this with PDF and misleading property-media fixtures.

## Current Launch Posture

`npm run supabase:check:json` currently reports readiness, local notification readiness is `watch` after gitignored `.env.local` `PROPERTY_INQUIRY_NOTIFY_TO`, `RESEND_REPLY_TO_EMAIL`, and `RESEND_FROM_EMAIL` values were configured, and the user confirmed Vercel Production/Preview now has all three variables configured and production was redeployed after each update. The former missing property-inquiry recipient blocker, missing reply-to warning, and sender fallback warning are cleared for local and Vercel production posture, assuming the hidden Vercel recipient/reply-to values remain `davidquinngroup@gmail.com` and `RESEND_FROM_EMAIL` remains `alerts@davidquinngroup.com`. Latest `npm run build` passed: Next.js 15.1.6 compiled successfully, completed lint/type validation inside the build pipeline, collected page data, generated 130 static pages, finalized page optimization, and collected build traces. Latest `npm run check:fast` passed end to end: worker output rebuilt; property-inquiry notification skip helpers passed; saved-search alert and consolidated notification readiness stayed `watch`; strict contract passed; bounded MLS sync dry-run completed with `executed=false` and no MLS Grid request; typecheck passed; lint passed with no ESLint warnings or errors. Latest strict-contract validation passed with current env `watch` / exit 0 while missing-recipient and property-inquiry dry-run override scenarios failed closed with blocked readiness / exit 1; reply-to warning alignment stayed true. Latest strict notification readiness passed with `strictMode=true`, `commandSuccess=true`, no blockers, no email, no row mutations, saved-search alert readiness `watch`, property-inquiry notification `ready`, and aggregate launch readiness `watch`. Latest aggregate launch readiness passed with `readiness.level="watch"`, no blockers, Supabase connectivity `ready`, property-inquiry notification `ready`, and saved-search alert email `watch` with 197 pending / 0 failed / 0 processing rows as the only launch gate requiring operator review; the latest refresh sent no email and mutated no rows. Latest saved-search alert notification readiness stayed `watch` with 197 pending / 0 failed / 0 processing rows, sender/reply-to/site-url checks passing, and 10 sampled recipients unsubscribed=false; the latest follow-up dry-run scanned 50 pending rows, previewed 50 ready-to-send rows, sent 0, skipped 0, and failed 0. Latest queue dashboard refresh completed cleanly with no diagnostics, no failed jobs, no open dead-letter jobs, and no stale active jobs; readiness remains `caution` because `reie-alerts` has 273 waiting / 0 active / 0 failed jobs. Latest Supabase and Typesense readiness refresh passed: Supabase returned `ready` with no failed checks, including DNS/TCP/Prisma/REST; Typesense `properties` plus `listings` canonical collections were ready in collections-only check mode without reset or reindex. Latest runtime smoke refresh passed against a temporary local Next server: MLS status returned HTTP 200 with readiness `watch`, search returned HTTP 200 from Typesense with healthy smoke metadata, and ops smoke passed with notification readiness `watch`, property-inquiry notification `ready`, saved-search alert notification `watch`, alert status `caution`, and public-experience assertions passing. Latest CRM pending readiness refresh stayed `watch`: the read-only scan found one pending `strategy_intake` task, no completed or dismissed tasks, and a clean closure-review audit with 100% coverage; no CRM state was mutated. Keep `PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN` unset or false before relying on high-priority property inquiry notification delivery. `docs/email-system.md` has the explicit production recipient checklist.

Latest new-chat handoff, July 4, 2026 22:10 MDT:

- Continue from Checkpoint 1253 in `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/launch-core-checklist.md`.
- Checkpoint 988 was committed on `main` as `d6771ba Add notification launch blocker readiness metadata`.
- Checkpoint 989 was committed on `main` as `e0f61b6 Document property inquiry readiness refresh`.
- Checkpoint 990 was committed on `main` as `255d70c Document notification readiness gate refresh`.
- Checkpoint 991 was committed on `main` as `f3d8e65 Document saved search alert readiness refresh`.
- Checkpoint 992 was committed on `main` as `4651ddb Document saved search alert dry run`.
- Checkpoint 993 was committed on `main` as `0206416 Document queue dashboard readiness refresh`.
- Checkpoint 994 was committed on `main` as `5b29989 Document Supabase readiness refresh`.
- Checkpoint 995 was committed on `main` as `267ed21 Document MLS and search smoke refresh`.
- Checkpoint 996 was committed on `main` as `d8d49ad Document ops smoke readiness refresh`.
- Checkpoint 997 was committed on `main` as `1bc26ba Document property inquiry recipient gate refresh`.
- Checkpoint 998 was committed on `main` as `7412d73 Document consolidated notification readiness refresh`.
- Checkpoint 999 was committed on `main` as `6bea124 Document strict notification readiness refresh`.
- Checkpoint 1000 was committed on `main` as `032134c Document strict notification readiness contract refresh`.
- Checkpoint 1001 was committed on `main` as `3861fd6 Document aggregate launch readiness refresh`.
- Checkpoint 1002 was committed on `main` as `2a9e794 Document saved search alert readiness refresh`.
- Checkpoint 1003 was committed on `main` as `6c451ea Document saved search alert dry run preview`.
- Checkpoint 1004 was committed on `main` as `1a37a46 Document queue dashboard readiness refresh`.
- Checkpoint 1005 was committed on `main` as `28e982d Document Supabase readiness refresh`.
- Checkpoint 1006 was committed on `main` as `4170f8d Document Typesense collection readiness refresh`.
- Checkpoint 1007 was committed on `main` as `3525aea Document fast verification refresh`.
- Checkpoint 1008 was committed on `main` as `d605de2 Document production build refresh`.
- Checkpoint 1009 was committed on `main` as `7a1a325 Document MLS and search smoke refresh`.
- Checkpoint 1010 was committed on `main` as `b40a7c4 Document ops smoke readiness refresh`.
- Checkpoint 1011 was committed on `main` as `d3659cf Harden property inquiry smoke cleanup`.
- Checkpoint 1012 was committed on `main` as `a460efe Document property inquiry readiness refresh`.
- Checkpoint 1013 was committed on `main` as `d94527e Document consolidated notification readiness refresh`.
- Checkpoint 1014 was committed on `main` as `a53eaa4 Document strict notification readiness refresh`.
- Checkpoint 1015 was committed on `main` as `e4513f4 Document strict notification contract refresh`.
- Checkpoint 1016 was committed on `main` as `6999ac4 Document aggregate launch readiness refresh`.
- Checkpoint 1017 was committed on `main` as `b24ada3 Document saved search alert readiness refresh`.
- Checkpoint 1018 was committed on `main` as `c0427b1 Document saved search alert dry run preview`.
- Checkpoint 1019 was committed on `main` as `5c929d3 Document queue dashboard readiness refresh`.
- Checkpoint 1020 was committed on `main` as `7d085e1 Document Supabase readiness refresh`.
- Checkpoint 1021 was committed on `main` as `fed7198 Document Typesense collection readiness refresh`.
- Checkpoint 1022 was committed on `main` as `130e2ed Document fast verification refresh`.
- Checkpoint 1023 was committed on `main` as `aaf6c2d Document production build refresh`.
- Checkpoint 1024 was committed on `main` as `e771dad Document property inquiry recipient env refresh`.
- Checkpoint 1025 was committed on `main` as `a0c26a2 Document property inquiry readiness gate refresh`.
- Checkpoint 1026 was committed on `main` as `e56fe6b Document consolidated notification readiness refresh`.
- Checkpoint 1027 was committed on `main` as `80e88ee Document strict notification readiness refresh`.
- Checkpoint 1028 was committed on `main` as `29cfada Document strict notification contract refresh`.
- Checkpoint 1029 was committed on `main` as `66a983a Document aggregate launch readiness refresh`.
- Checkpoint 1030 was committed on `main` as `250520b Document saved search alert readiness refresh`.
- Checkpoint 1031 was committed on `main` as `e68b2c1 Document saved search alert dry run preview`.
- Checkpoint 1032 was committed on `main` as `133ce6e Document queue dashboard readiness refresh`.
- Checkpoint 1033 was committed on `main` as `c7e0a89 Document Supabase readiness refresh`.
- Checkpoint 1034 was committed on `main` as `34e6d06 Document Typesense collection readiness refresh`.
- Checkpoint 1035 was committed on `main` as `2eb7b79 Document fast verification refresh`.
- Checkpoint 1036 was committed on `main` as `1f2e444 Document production build refresh`.
- Checkpoint 1037 was committed on `main` as `5173049 Document property inquiry readiness gate refresh`.
- Checkpoint 1038 was committed on `main` as `82cc111 Document consolidated notification readiness refresh`.
- Checkpoint 1039 was committed on `main` as `d2c9828 Document strict notification readiness refresh`.
- Checkpoint 1040 was committed on `main` as `1d1ed21 Document strict notification contract refresh`.
- Checkpoint 1041 was committed on `main` as `bac0324 Document aggregate launch readiness refresh`.
- Checkpoint 1042 was committed on `main` as `d3174d7 Document saved search alert readiness refresh`.
- Checkpoint 1043 was committed on `main` as `6b7c60a Document saved search alert dry run preview`.
- Checkpoint 1044 was committed on `main` as `f2a8572 Document queue dashboard readiness refresh`.
- Checkpoint 1045 was committed on `main` as `787c1eb Document Supabase readiness refresh`.
- Checkpoint 1046 was committed on `main` as `d08f6e0 Document Typesense collection readiness refresh`.
- Checkpoint 1047 was committed on `main` as `d8067e1 Document fast verification refresh`.
- Checkpoint 1048 was committed on `main` as `ad54007 Document production build refresh`.
- Checkpoint 1049 was committed on `main` as `aa2b636 Document property inquiry readiness gate refresh`.
- Checkpoint 1050 was committed on `main` as `92011ff Document consolidated notification readiness refresh`.
- Checkpoint 1051 was committed on `main` as `f238f17 Document strict notification readiness refresh`.
- Checkpoint 1052 was committed on `main` as `0ae6126 Document strict notification contract refresh`.
- Checkpoint 1053 was committed on `main` as `36faeaa Document aggregate launch readiness refresh`.
- Checkpoint 1054 was committed on `main` as `3ef0451 Document saved search alert readiness refresh`.
- Checkpoint 1055 was committed on `main` as `dcbebc2 Document saved search alert dry run preview`.
- Checkpoint 1056 was committed on `main` as `3816e47 Document queue dashboard readiness refresh`.
- Checkpoint 1057 was committed on `main` as `d7537c2 Document Supabase readiness refresh`.
- Checkpoint 1058 was committed on `main` as `df082f1 Document Typesense collection readiness refresh`.
- Checkpoint 1059 was committed on `main` as `c5e32d4 Document fast verification refresh`.
- Checkpoint 1060 was committed on `main` as `a8d659d Document production build refresh`.
- Checkpoint 1061 was committed on `main` as `fce40fc Document property inquiry readiness refresh`.
- Checkpoint 1062 was committed on `main` as `b48d033 Document consolidated notification readiness refresh`.
- Checkpoint 1063 was committed on `main` as `49c10e6 Document strict notification readiness refresh`.
- Checkpoint 1064 was committed on `main` as `2f74840 Document strict notification contract refresh`.
- Checkpoint 1065 was committed on `main` as `c5f7e5c Document aggregate launch readiness refresh`.
- Checkpoint 1066 was committed on `main` as `7247c8b Document saved search alert readiness refresh`.
- Checkpoint 1067 was committed on `main` as `46b7c2f Document saved search alert dry run preview`.
- Checkpoint 1068 was committed on `main` as `2b4d690 Document queue dashboard readiness refresh`.
- Checkpoint 1069 was committed on `main` as `6063e65 Document Supabase readiness refresh`.
- Checkpoint 1070 was committed on `main` as `8873d22 Document Typesense collection readiness refresh`.
- Checkpoint 1071 was committed on `main` as `b75b1d2 Clear local property inquiry recipient readiness`.
- Checkpoint 1072 was committed on `main` as `67cad35 Document Vercel property inquiry readiness`.
- Checkpoint 1073 was committed on `main` as `6cdc589 Document alert dry run after Vercel readiness`.
- Checkpoint 1074 was committed on `main` as `b400a1f Document Supabase and Typesense readiness refresh`.
- Checkpoint 1075 was committed on `main` as `33b8920 Document fast verification refresh`.
- Checkpoint 1076 was committed on `main` as `6f652fd Document production build refresh`.
- Checkpoint 1077 was committed on `main` as `0a3a648 Harden ops smoke for configured notification readiness`.
- Checkpoint 1078 was committed on `main` as `1d042f4 Document state of union launch posture refresh`.
- Checkpoint 1079 was committed on `main` as `f367abf Document CRM readiness review refresh`.
- Checkpoint 1080 was committed on `main` as `83f0620 Document Resend reply-to readiness refresh`.
- Checkpoint 1081 was committed on `main` as `3f58c96 Document Resend sender readiness refresh`.
- Checkpoint 1082 was committed on `main` as `0b6d62d Document queue dashboard after sender readiness`.
- Checkpoint 1083 was committed on `main` as `d2cd56c Document aggregate launch readiness after sender setup`.
- Checkpoint 1084 was committed on `main` as `740b4b7 Document alert dry run after aggregate readiness`.
- Checkpoint 1085 was committed on `main` as `8787a18 Document strict notification readiness after alert dry run`.
- Checkpoint 1086 was committed on `main` as `db6d4a7 Document strict notification contract after alert dry run`.
- Checkpoint 1087 was committed on `main` as `9b4d763 Document fast verification after strict contract`.
- Checkpoint 1088 was committed on `main` as `e609173 Document production build after fast verification`.
- Checkpoint 1089 was committed on `main` as `c089f12 Document runtime smoke after production build`.
- Checkpoint 1090 was committed on `main` as `105fdf4 Document Supabase and Typesense readiness refresh`.
- Checkpoint 1091 was committed on `main` as `ad213b7 Document queue dashboard readiness refresh`.
- Checkpoint 1092 was committed on `main` as `8b944eb Document saved search alert readiness refresh`.
- Checkpoint 1093 was committed on `main` as `f9c0d8a Document saved search alert dry run preview`.
- Checkpoint 1094 was committed on `main` as `35a737e Document aggregate launch readiness refresh`.
- Checkpoint 1095 was committed on `main` as `b97e211 Document strict notification readiness refresh`.
- Checkpoint 1096 was committed on `main` as `8189bec Document strict notification contract refresh`.
- Checkpoint 1097 was committed on `main` as `0404312 Document fast verification refresh`.
- Checkpoint 1098 was committed on `main` as `bac081e Document production build refresh`.
- Checkpoint 1099 was committed on `main` as `de4756d Document runtime smoke after production build`.
- Checkpoint 1100 was committed on `main` as `66251cd Document CRM readiness review refresh`.
- Checkpoint 1101 was committed on `main` as `d3fab1f Document launch readiness after CRM refresh`.
- Checkpoint 1102 was committed on `main` as `a707ee8 Document saved search alert readiness refresh`.
- Checkpoint 1103 was committed on `main` as `4d373a2 Document strict notification readiness refresh`.
- Checkpoint 1104 was committed on `main` as `7171b62 Document strict notification contract refresh`.
- Checkpoint 1105 was committed on `main` as `bf74e90 Document fast verification refresh`.
- Checkpoint 1106 was committed on `main` as `f4362cb Document production build refresh`.
- Checkpoint 1107 was committed on `main` as `792f0b8 Document runtime smoke after production build`.
- Checkpoint 1108 was committed on `main` as `8a3503b Document Supabase and Typesense readiness refresh`.
- Checkpoint 1109 was committed on `main` as `5fafddf Document queue dashboard readiness refresh`.
- Checkpoint 1110 was committed on `main` as `c32c77d Document saved search alert readiness refresh`.
- Checkpoint 1111 was committed on `main` as `1bad1b3 Document aggregate launch readiness refresh`.
- Checkpoint 1112 was committed on `main` as `2ea3118 Document strict notification readiness refresh`.
- Checkpoint 1113 was committed on `main` as `31444ed Document strict notification contract refresh`.
- Checkpoint 1114 was committed on `main` as `b05202f Document fast verification refresh`.
- Checkpoint 1115 was committed on `main` as `d27c892 Document production build refresh`.
- Checkpoint 1116 was committed on `main` as `b337861 Document runtime smoke after production build`.
- Checkpoint 1117 was committed on `main` as `661a5de Document Supabase and Typesense readiness refresh`.
- Checkpoint 1118 was committed on `main` as `18438ea Document queue dashboard readiness refresh`.
- Checkpoint 1119 was committed on `main` as `de58631 Document saved search alert readiness refresh`.
- Checkpoint 1120 was committed on `main` as `5e637a3 Document aggregate launch readiness refresh`.
- Checkpoint 1121 was committed on `main` as `6fb1020 Document strict notification readiness refresh`.
- Checkpoint 1122 was committed on `main` as `15c0ed4 Document strict notification contract refresh`.
- Checkpoint 1123 was committed on `main` as `b8a2d8d Document fast verification refresh`.
- Checkpoint 1124 was committed on `main` as `3e8fdcb Document production build refresh`.
- Checkpoint 1125 was committed on `main` as `82479e6 Document runtime smoke after production build`.
- Checkpoint 1126 was committed on `main` as `3f54301 Document Supabase and Typesense readiness refresh`.
- Checkpoint 1127 was committed on `main` as `e45ee09 Document queue dashboard readiness refresh`.
- Checkpoint 1128 was committed on `main` as `d463d52 Document saved search alert readiness refresh`.
- Checkpoint 1129 was committed on `main` as `fc6eb09 Document aggregate launch readiness refresh`.
- Checkpoint 1130 was committed on `main` as `2ffca2d Document strict notification readiness refresh`.
- Checkpoint 1131 was committed on `main` as `efb0ea8 Document strict notification contract refresh`.
- Checkpoint 1132 was committed on `main` as `a9a4171 Document fast verification refresh`.
- Checkpoint 1133 was committed on `main` as `0c7a3d8 Document production build refresh`.
- Checkpoint 1134 was committed on `main` as `da586c7 Document runtime smoke after production build`.
- Checkpoint 1135 was committed on `main` as `2263928 Document Supabase and Typesense readiness refresh`.
- Checkpoint 1136 was committed on `main` as `c92410e Document queue dashboard readiness refresh`.
- Checkpoint 1137 was committed on `main` as `dcfa92c Document saved search alert readiness refresh`.
- Checkpoint 1138 was committed on `main` as `d91e9e8 Document aggregate launch readiness refresh`.
- Checkpoint 1139 was committed on `main` as `505ddcc Document strict notification readiness refresh`.
- Checkpoint 1140 was committed on `main` as `8b3e17a Document strict notification contract refresh`.
- Checkpoint 1141 was committed on `main` as `d8e3757 Document fast verification refresh`.
- Checkpoint 1142 was committed on `main` as `a31cc6d Document production build refresh`.
- Checkpoint 1143 was committed on `main` as `dd332f4 Document runtime smoke after production build`.
- Checkpoint 1144 was committed on `main` as `371e76c Document Supabase and Typesense readiness refresh`.
- Checkpoint 1145 was committed on `main` as `5e67973 Document queue dashboard readiness refresh`.
- Checkpoint 1146 was committed on `main` as `b227124 Document saved search alert readiness refresh`.
- Checkpoint 1147 was committed on `main` as `4ad3c7d Document CRM pending readiness refresh`.
- Checkpoint 1148 was committed on `main` as `2aef596 Document launch readiness aggregate refresh`.
- Checkpoint 1149 was committed on `main` as `c64c641 Document strict notification readiness refresh`.
- Checkpoint 1150 was committed on `main` as `fea8e23 Document strict notification contract refresh`.
- Checkpoint 1151 was committed on `main` as `fc5ee1b Document fast verification refresh`.
- Checkpoint 1152 was committed on `main` as `ae4d936 Document production build refresh`.
- Checkpoint 1153 was committed on `main` as `3ce70c8 Document runtime smoke refresh`.
- Checkpoint 1154 was committed on `main` as `ce4c114 Document Supabase and Typesense readiness refresh`.
- Checkpoint 1155 was committed on `main` as `4689c4f Document queue dashboard readiness refresh`.
- Checkpoint 1156 was committed on `main` as `eeff9f8 Document saved search alert readiness refresh`.
- Checkpoint 1157 was committed on `main` as `e75eaa9 Document CRM pending readiness refresh`.
- Checkpoint 1158 was committed on `main` as `6905235 Document launch readiness aggregate refresh`.
- Checkpoint 1159 was committed on `main` as `7159568 Document strict notification readiness refresh`.
- Checkpoint 1160 was committed on `main` as `06a08b3 Document strict notification contract refresh`.
- Checkpoint 1161 was committed on `main` as `eca8b38 Document fast verification refresh`.
- Checkpoint 1162 was committed on `main` as `55558c5 Document production build refresh`.
- Checkpoint 1163 was committed on `main` as `c778dd8 Document runtime smoke refresh`.
- Checkpoint 1164 was committed on `main` as `6b0547e Document Supabase and Typesense readiness refresh`.
- Checkpoint 1165 was committed on `main` as `8a55cb0 Document queue dashboard readiness refresh`.
- Checkpoint 1166 was committed on `main` as `74ec80a Document saved search alert readiness refresh`.
- Checkpoint 1167 was committed on `main` as `6cebe12 Document CRM pending readiness refresh`.
- Checkpoint 1168 was committed on `main` as `a4a272d Document launch readiness aggregate refresh`.
- Checkpoint 1169 was committed on `main` as `2f143a1 Document strict notification readiness refresh`.
- Checkpoint 1170 was committed on `main` as `8c4d6aa Document strict notification contract refresh`.
- Checkpoint 1171 was committed on `main` as `3517a40 Document fast verification refresh`.
- Checkpoint 1172 was committed on `main` as `662e599 Document digest dry run refresh`.
- Checkpoint 1173 was committed on `main` as `1f852a4 Document launch readiness refresh`.
- Checkpoint 1174 was committed on `main` as `429f79b Document queue dashboard readiness refresh`.
- Checkpoint 1175 was committed on `main` as `f716852 Document CRM pending readiness refresh`.
- Checkpoint 1176 was committed on `main` as `4e7d076 Document saved search alert readiness refresh`.
- Checkpoint 1177 was committed on `main` as `3c362bf Document strict notification readiness refresh`.
- Checkpoint 1178 was committed on `main` as `909ee9d Document strict notification contract refresh`.
- Checkpoint 1179 was committed on `main` as `b2f9375 Document fast verification refresh`.
- Checkpoint 1180 was committed on `main` as `05ae6ea Document production build refresh`.
- Checkpoint 1181 was committed on `main` as `7fe2a2f Document runtime smoke refresh`.
- Checkpoint 1182 was committed on `main` as `8297aad Document Supabase and Typesense readiness refresh`.
- Checkpoint 1183 was committed on `main` as `85491e4 Document queue dashboard readiness refresh`.
- Checkpoint 1184 was committed on `main` as `5f3fe7c Document CRM pending readiness refresh`.
- Checkpoint 1185 was committed on `main` as `59994bf Document saved search alert readiness refresh`.
- Checkpoint 1186 was committed on `main` as `fc707b9 Document launch readiness refresh`.
- Checkpoint 1187 was committed on `main` as `5c743d9 Document strict notification readiness refresh`.
- Checkpoint 1188 was committed on `main` as `bf19a9c Document strict notification contract refresh`.
- Checkpoint 1189 was committed on `main` as `d25ea19 Document fast verification refresh`.
- Checkpoint 1190 was committed on `main` as `59df7ee Document production build refresh`.
- Checkpoint 1191 was committed on `main` as `6fb82fb Document runtime smoke refresh`.
- Checkpoint 1192 was committed on `main` as `29a1875 Document launch readiness refresh`.
- Checkpoint 1193 was committed on `main` as `26815c9 Document saved search alert dry run`.
- Checkpoint 1194 was committed on `main` as `8cd7367 Document saved search alert readiness refresh`.
- Checkpoint 1195 was committed on `main` as `63e50dc Document notification readiness refresh`.
- Checkpoint 1196 was committed on `main` as `116c336 Document strict notification readiness refresh`.
- Checkpoint 1197 was committed on `main` as `e9e6ec5 Document strict notification contract refresh`.
- Checkpoint 1198 was committed on `main` as `a91b7d7 Document fast verification refresh`.
- Checkpoint 1199 was committed on `main` as `19a63ec Document production build refresh`.
- Checkpoint 1200 was committed on `main` as `17b5e0a Document runtime smoke refresh`.
- Checkpoint 1201 was committed on `main` as `b732685 Document CRM pending readiness refresh`.
- Checkpoint 1202 was committed on `main` as `be3727f Document queue dashboard readiness refresh`.
- Checkpoint 1203 was committed on `main` as `5859e89 Document launch readiness refresh`.
- Checkpoint 1204 was committed on `main` as `2a2c3e4 Document saved search alert dry run`.
- Checkpoint 1205 was committed on `main` as `dbf1fc4 Document saved search alert readiness refresh`.
- Checkpoint 1206 was committed on `main` as `9c51290 Document notification readiness refresh`.
- Checkpoint 1207 was committed on `main` as `f2be37b Document strict notification readiness refresh`.
- Checkpoint 1208 was committed on `main` as `8ceb4eb Document strict notification contract refresh`.
- Checkpoint 1209 was committed on `main` as `c1b2ae4 Document fast verification refresh`.
- Checkpoint 1210 was committed on `main` as `1dd6cbd Document production build refresh`.
- Checkpoint 1211 was committed on `main` as `53032db Document runtime smoke refresh`.
- Checkpoint 1212 was committed on `main` as `f47160a Document Supabase and Typesense readiness refresh`.
- Checkpoint 1213 was committed on `main` as `4ce1799 Document queue dashboard readiness refresh`.
- Checkpoint 1214 was committed on `main` as `20a1285 Document CRM pending readiness refresh`.
- Checkpoint 1215 was committed on `main` as `cfcf561 Document launch readiness refresh`.
- Checkpoint 1216 was committed on `main` as `2d3f94c Document saved search alert dry run`.
- Checkpoint 1217 was committed on `main` as `9ad1ea1 Document saved search alert readiness refresh`.
- Checkpoint 1218 was committed on `main` as `dc0cb80 Document notification readiness refresh`.
- Checkpoint 1219 was committed on `main` as `17cbd59 Document strict notification readiness refresh`.
- Checkpoint 1220 was committed on `main` as `7c78e6d Document strict notification contract refresh`.
- Checkpoint 1221 was committed on `main` as `be56304 Document fast verification refresh`.
- Checkpoint 1222 was committed on `main` as `ab9522d Document production build refresh`.
- Checkpoint 1223 was committed on `main` as `c4530e2 Document runtime smoke refresh`.
- Checkpoint 1224 was committed on `main` as `557e537 Document Supabase and Typesense readiness refresh`.
- Checkpoint 1225 was committed on `main` as `bc4fa89 Document queue dashboard readiness refresh`.
- Checkpoint 1226 was committed on `main` as `c458c30 Document CRM pending readiness refresh`.
- Checkpoint 1227 was committed on `main` as `07839d1 Document launch readiness refresh`.
- Checkpoint 1228 was committed on `main` as `57518df Document saved search alert dry run`.
- Checkpoint 1229 was committed on `main` as `298ed85 Document saved search alert readiness refresh`.
- Checkpoint 1230 was committed on `main` as `999ccf3 Document notification readiness refresh`.
- Checkpoint 1231 was committed on `main` as `215c3c2 Document strict notification readiness refresh`.
- Checkpoint 1232 was committed on `main` as `d8e897c Document strict notification contract refresh`.
- Checkpoint 1233 was committed on `main` as `298a891 Document fast verification refresh`.
- Checkpoint 1234 was committed on `main` as `6d46d3b Document production build refresh`.
- Checkpoint 1235 was committed on `main` as `0a2a0c2 Document runtime smoke refresh`.
- Checkpoint 1236 was committed on `main` as `8d9905e Document queue dashboard refresh`.
- Checkpoint 1237 was committed on `main` as `3ae55c5 Document CRM pending readiness refresh`.
- Checkpoint 1238 was committed on `main` as `b103f6f Document launch readiness refresh`.
- Checkpoint 1239 was committed on `main` as `6f11866 Document saved search alert dry run`.
- Checkpoint 1240 was committed on `main` as `1f3225e Document saved search alert readiness refresh`.
- Checkpoint 1241 was committed on `main` as `1ebcfe3 Document notification readiness refresh`.
- Checkpoint 1242 was committed on `main` as `ec5cae8 Document strict notification readiness refresh`.
- Checkpoint 1243 was committed on `main` as `9f6eaac Document strict notification contract refresh`.
- Checkpoint 1244 was committed on `main` as `6b11964 Document production build refresh`.
- Checkpoint 1245 was committed on `main` as `dec1a54 Document runtime smoke refresh`.
- Checkpoint 1246 was committed on `main` as `acc65a7 Document queue dashboard refresh`.
- Checkpoint 1247 was committed on `main` as `4721fda Document CRM pending readiness refresh`.
- Checkpoint 1248 was committed on `main` as `6c425c9 Document launch readiness refresh`.
- Checkpoint 1249 was committed on `main` as `9831dc0 Document saved search alert dry run`.
- Checkpoint 1250 was committed on `main` as `7d8eee5 Document saved search alert readiness refresh`.
- Checkpoint 1251 was committed on `main` as `1738c74 Document notification readiness refresh`.
- Checkpoint 1252 was committed on `main` as `c40fad1 Document strict notification readiness refresh`.
- Checkpoint 1253 is the current checkpoint with message `Document strict notification contract refresh`.
- Checkpoint 1010 ran `npm run smoke:ops` against a temporary local Next dev server. Public-experience smoke, admin/control/intake/CRM/dead-letter/retry/alert inspection metadata, public search, and notification readiness checks passed structurally; MLS status remained `busy` / `watch` with healthy search-index health and busy media diagnostics; alert status remained `caution` with 197 pending / 0 failed rows; notification readiness remained blocked by missing property-inquiry recipient routing. The temporary server was stopped after the check, and a targeted process check found no remaining Next/dev process beyond the check itself.
- Checkpoint 1011 hardened `npm run smoke:property-inquiry` after confirming it is a mutating route smoke, not a read-only readiness gate. The earlier smoke passed and sent no email (`sent=false`, `reason="not-high-priority"`, `attempted=false`, `required=false`), but it creates temporary smoke property, user, CRM task, user interaction, and lead interaction rows before cleanup.
- A post-run residue check found one leftover smoke `LeadInteraction` row from the earlier route smoke. It was deleted by exact ID and verified gone. The smoke script now explicitly deletes smoke lead interactions before parent smoke user/property cleanup and prints `sendsEmail=false`, `mutatesRows=true`, `cleanupAttempted=true`, `mutationScope`, and cleanup metadata. `npm run worker:build`, `npm run typecheck`, and `git diff --check` passed.
- Checkpoint 1012 ran `npm run check:property-inquiry-notification:readiness`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=false`, and failed closed with `readiness.level="blocked"` as expected. The only blocking entry remained `property_inquiry_recipient_missing` for `PROPERTY_INQUIRY_NOTIFY_TO` and fallback `REIE_INTERNAL_EMAIL`; `RESEND_REPLY_TO_EMAIL` remained a warning.
- Checkpoint 1013 ran `npm run check:notification-readiness`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=true`, and summarized overall notification readiness as `blocked`. Saved-search alert readiness stayed `watch` with sender fallback, missing reply-to, and 197 pending-row warnings; property-inquiry and aggregate launch readiness stayed `blocked` by `property_inquiry_recipient_missing`.
- Checkpoint 1014 ran `npm run check:notification-readiness:strict`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=false`, `strictMode=true`, `commandSuccess=true`, and failed closed as expected because overall notification readiness is still blocked. Saved-search alert readiness stayed `watch`; property-inquiry and aggregate launch readiness stayed `blocked` by `property_inquiry_recipient_missing`.
- Checkpoint 1015 ran `npm run check:notification-readiness:strict-contract`. The command rebuilt worker output, sent no email, mutated no rows, and passed. It confirmed the current environment fails closed, the dummy-recipient plus property-inquiry dry-run scenario fails closed with both direct and aggregate dry-run blockers detected, and aggregate launch-readiness reply-to warning alignment remains true.
- Checkpoint 1016 ran `npm run check:launch-readiness`. The command rebuilt worker output, sent no email, mutated no rows, and failed closed as expected with `success=false`, `readiness.level="blocked"`, and one blocked launch gate. Supabase connectivity stayed `ready`; saved-search alert email stayed `watch` with 197 pending / 0 failed / 0 processing rows; property-inquiry notification email stayed `blocked` by `property_inquiry_recipient_missing`.
- Checkpoint 1017 ran `npm run check:alert-notification-readiness`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=true`, and reported saved-search alert notification readiness at `watch`. Alert queue counts stayed 197 pending / 0 failed / 0 processing; sender fallback, missing reply-to, and pending-row warnings remain before any live alert processing.
- Checkpoint 1018 ran `npm run run:alerts:dry -- --limit 50`. The dry-run preview completed with `dryRun=true`, `mode="preview"`, `success=true`, 50 scanned rows, 0 sent, 0 skipped, 0 failed, and 50 masked rows marked `preview` / `Ready to send.` The execution plan stayed `caution`; the surfaced live command remains blocked by launch policy until property-inquiry recipient routing is configured and strict/aggregate readiness clears.
- Checkpoint 1019 ran `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`. Queue inspection completed with no diagnostics, no failed jobs, no open dead-letter jobs, and no stale active jobs. Recovery stayed `caution` because `reie-alerts` had 273 waiting / 0 active / 0 failed jobs; MLS sync, MLS page, listings, and dead-letter queues had 0 waiting / 0 active / 0 failed. The surfaced `npm run run:worker:alerts` command was not run and remains blocked by launch policy until property-inquiry recipient routing is configured and strict/aggregate readiness clears.
- Checkpoint 1020 ran `npm run supabase:check:json`. Supabase readiness returned `success=true`, `readiness.level="ready"`, and no failed checks; URL/key checks, project-ref consistency, DNS, Postgres TCP, Prisma `SELECT 1`, and Supabase REST passed. The surfaced `npm run typesense:reindex` command was not run and remains blocked unless explicitly approved.
- Checkpoint 1021 ran `npm run typesense:collections:check`. The command ran with `check=true`, `reset=false`, `collectionsOnly=true`; canonical `properties` and `listings` schemas validated, existing Typesense `properties` and `listings` collections were ready, and no reset or reindex was run.
- Checkpoint 1022 ran `npm run check:fast`. The command passed end to end: worker output rebuilt; property-inquiry missing-recipient and dry-run suppression checks passed; saved-search alert readiness stayed `watch`; consolidated notification readiness stayed `blocked`; strict notification readiness contract validation passed; bounded MLS sync dry-run completed with `executed=false` and no MLS Grid request; typecheck and lint passed.
- Checkpoint 1023 ran `npm run build`. Next.js 15.1.6 compiled successfully, linted and checked types, collected page data, generated 130 static pages, finalized page optimization, and collected build traces.
- Checkpoint 1024 ran a masked local env-presence check for `PROPERTY_INQUIRY_NOTIFY_TO`, `REIE_INTERNAL_EMAIL`, and `PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN`. `PROPERTY_INQUIRY_NOTIFY_TO` and fallback `REIE_INTERNAL_EMAIL` were unset, and `PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN` was unset. No recipient values were printed, no email was sent, and no rows were mutated.
- Checkpoint 1025 ran `npm run check:property-inquiry-notification:readiness`. The command rebuilt worker output, stayed non-sending and non-mutating, and failed closed as expected with `success=false`, `readiness.level="blocked"`, and one blocker: `property_inquiry_recipient_missing` for `PROPERTY_INQUIRY_NOTIFY_TO` / `REIE_INTERNAL_EMAIL`. Missing `RESEND_REPLY_TO_EMAIL` remained a warning.
- Checkpoint 1026 ran `npm run check:notification-readiness`. The command rebuilt worker output, stayed non-sending and non-mutating, returned `success=true`, and summarized overall notification readiness as `blocked` with two blocked notification readiness checks. Saved-search alert readiness stayed `watch`; property-inquiry notification and aggregate launch notification readiness stayed `blocked` by `property_inquiry_recipient_missing`.
- Checkpoint 1027 ran `npm run check:notification-readiness:strict`. The command rebuilt worker output, stayed non-sending and non-mutating, returned `strictMode=true`, `commandSuccess=true`, `success=false`, and failed closed as expected because overall notification readiness remains blocked by missing property-inquiry recipient routing.
- Checkpoint 1028 ran `npm run check:notification-readiness:strict-contract`. The command rebuilt worker output, stayed non-sending and non-mutating, and passed. It confirmed the current environment fails closed, the dummy-recipient plus property-inquiry dry-run scenario fails closed with direct and aggregate dry-run blockers detected, and aggregate launch-readiness reply-to warning alignment remains true.
- Checkpoint 1029 ran `npm run check:launch-readiness`. The command rebuilt worker output, stayed non-sending and non-mutating, ran read-only Prisma connectivity and alert-queue count checks, and failed closed as expected with `success=false`, `readiness.level="blocked"`, and one blocked launch gate. Supabase connectivity stayed `ready`; saved-search alert email stayed `watch` with 197 pending / 0 failed / 0 processing rows; property-inquiry notification email stayed `blocked` by `property_inquiry_recipient_missing`.
- Checkpoint 1030 ran `npm run check:alert-notification-readiness`. The command rebuilt worker output, stayed non-sending and non-mutating, ran read-only Prisma connectivity, alert-queue count, and sampled-recipient checks, returned `success=true`, and reported saved-search alert notification readiness at `watch`. Alert queue counts stayed 197 pending / 0 failed / 0 processing; sampled recipients were unsubscribed=false.
- Checkpoint 1031 ran `npm run run:alerts:dry -- --limit 50`. The dry-run preview completed with `dryRun=true`, `mode="preview"`, `success=true`, 50 scanned rows, 0 sent, 0 skipped, 0 failed, and 50 masked rows marked `preview` / `Ready to send.` The surfaced live alert command remains blocked by launch policy until property-inquiry recipient routing is configured and strict/aggregate readiness clears.
- Checkpoint 1032 ran `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`. Queue inspection completed with no diagnostics, no failed jobs, no open dead-letter jobs, and no stale active jobs. MLS sync, MLS page, listings, and dead-letter queues were healthy; `reie-alerts` remained `busy` with 273 waiting / 0 active / 0 failed jobs. No worker, retry, or live alert processing was run.
- Checkpoint 1033 ran `npm run supabase:check:json`. Supabase readiness returned `success=true`, `readiness.level="ready"`, and no failed checks; URL/key checks, placeholder scan, project-ref consistency, Postgres URL shape, DNS, TCP, Prisma `SELECT 1`, and Supabase REST all passed. The surfaced `npm run typesense:reindex` command was not run because reindexing remains out of scope unless explicitly requested.
- Checkpoint 1034 ran `npm run typesense:collections:check`. The command ran with `check=true`, `reset=false`, `collectionsOnly=true`; canonical `properties` and `listings` schemas validated, existing Typesense `properties` and `listings` collections were ready, and no reset or reindex was run.
- Checkpoint 1035 ran `npm run check:fast`. The command passed end to end: worker output rebuilt; property-inquiry missing-recipient and dry-run suppression helpers passed; saved-search alert readiness stayed `watch`; consolidated notification readiness stayed `blocked`; strict-contract validation passed; bounded MLS sync dry-run completed with `executed=false` and no MLS Grid request; typecheck and lint passed.
- Checkpoint 1036 ran `npm run build`. Next.js 15.1.6 compiled successfully, linted and checked types, collected page data, generated 130 static pages, finalized page optimization, and collected build traces. The route manifest included static `/`, `/admin`, and `/admin/dead-letter`; dynamic API routes including `/api/property-inquiry`, `/api/process-alerts`, `/api/mls/status`, `/api/search`, and `/api/webhooks/email-reply`; SSG article and market routes; dynamic `/properties/[id]`; and dynamic `/search`.
- Checkpoint 1037 ran `npm run check:property-inquiry-notification:readiness`. The command rebuilt worker output, sent no email, mutated no rows, and failed closed as expected with `success=false`, `readiness.level="blocked"`, and one required setting needing attention. The only blocker remained `property_inquiry_recipient_missing` because `PROPERTY_INQUIRY_NOTIFY_TO` and fallback `REIE_INTERNAL_EMAIL` are unset; `PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN` stayed disabled or unset, and missing `RESEND_REPLY_TO_EMAIL` remained a warning.
- Checkpoint 1038 ran `npm run check:notification-readiness`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=true`, `strictMode=false`, and summarized overall notification readiness as `blocked` with two blocked notification readiness checks. Saved-search alert notification readiness stayed `watch` with sender fallback, missing reply-to, and 197 pending-row warnings; property-inquiry notification and aggregate launch notification readiness stayed `blocked` by `property_inquiry_recipient_missing`.
- Checkpoint 1039 ran `npm run check:notification-readiness:strict`. The command rebuilt worker output, sent no email, mutated no rows, returned `strictMode=true`, `commandSuccess=true`, and failed closed as expected with `success=false` because overall notification readiness remains `blocked`. Saved-search alert notification readiness stayed `watch`; property-inquiry notification and aggregate launch notification readiness stayed `blocked` by `property_inquiry_recipient_missing`.
- Checkpoint 1040 ran `npm run check:notification-readiness:strict-contract`. The command rebuilt worker output, sent no email, mutated no rows, and passed with `success=true`. It confirmed the current environment fails closed with readiness `blocked`, exit code `1`, and `success=false`; the dummy-recipient plus property-inquiry dry-run scenario fails closed with both direct and aggregate dry-run blockers detected; and aggregate launch-readiness reply-to warning alignment remains true.
- Checkpoint 1041 ran `npm run check:launch-readiness`. The command rebuilt worker output, sent no email, mutated no rows, ran read-only Prisma connectivity and alert-queue count checks, and failed closed as expected with `success=false`, `readiness.level="blocked"`, and one blocked launch gate. Supabase connectivity stayed `ready`; saved-search alert email stayed `watch` with 197 pending / 0 failed / 0 processing rows; property-inquiry notification email stayed `blocked` by `property_inquiry_recipient_missing`.
- Checkpoint 1042 ran `npm run check:alert-notification-readiness`. The command rebuilt worker output, sent no email, mutated no rows, ran read-only Prisma connectivity, alert-queue count, and sampled-recipient checks, returned `success=true`, and reported saved-search alert notification readiness at `watch`. Alert queue counts stayed 197 pending / 0 failed / 0 processing; sampled recipients were unsubscribed=false.
- Checkpoint 1043 ran `npm run run:alerts:dry -- --limit 50`. The dry-run preview completed with `dryRun=true`, `mode="preview"`, `success=true`, 50 scanned rows, 0 sent, 0 skipped, 0 failed, and 50 masked rows marked `preview` / `Ready to send.` The surfaced live alert command remains blocked by launch policy until property-inquiry recipient routing is configured and strict/aggregate readiness clears.
- Checkpoint 1044 ran `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`. Queue inspection completed with no diagnostics, no failed jobs, no open dead-letter jobs, and no stale active jobs. MLS sync, MLS page, listings, and dead-letter queues were healthy; `reie-alerts` remained `busy` with 273 waiting / 0 active / 0 failed jobs. No worker, retry, or live alert processing was run.
- Checkpoint 1045 ran `npm run supabase:check:json`. Supabase readiness returned `success=true`, `readiness.level="ready"`, and no failed checks; URL/key checks, placeholder scan, project-ref consistency, Postgres URL shape, DNS, TCP, Prisma `SELECT 1`, and Supabase REST all passed. The surfaced `npm run typesense:reindex` command was not run because reindexing remains out of scope unless explicitly requested.
- Checkpoint 1046 ran `npm run typesense:collections:check`. The command ran with `check=true`, `reset=false`, `collectionsOnly=true`; canonical `properties` and `listings` schemas validated, existing Typesense `properties` and `listings` collections were ready, and no reset or reindex was run.
- Checkpoint 1047 ran `npm run check:fast`. The command passed end to end: worker output rebuilt; property-inquiry missing-recipient and dry-run suppression helpers passed; saved-search alert readiness stayed `watch`; consolidated notification readiness stayed `blocked`; strict-contract validation passed; bounded MLS sync dry-run completed with `executed=false` and no MLS Grid request; typecheck and lint passed.
- Checkpoint 1048 ran `npm run build`. Next.js 15.1.6 compiled successfully, linted and checked types, collected page data, generated 130 static pages, finalized page optimization, and collected build traces. No live sync, live worker, email, CRM mutation, OpenAI request, MLS Grid request, reset, reindex, or queue retry was run.
- Checkpoint 1049 ran `npm run check:property-inquiry-notification:readiness`. The command rebuilt worker output, sent no email, mutated no rows, and failed closed as expected with `success=false`, `readiness.level="blocked"`, and one blocker: `property_inquiry_recipient_missing` for `PROPERTY_INQUIRY_NOTIFY_TO` / `REIE_INTERNAL_EMAIL`. `PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN` stayed disabled or unset, and missing `RESEND_REPLY_TO_EMAIL` remained a warning.
- Checkpoint 1050 ran `npm run check:notification-readiness`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=true`, and summarized overall notification readiness as `blocked`. Saved-search alert notification readiness stayed `watch` with sender fallback, missing reply-to, and 197 pending-row warnings; property-inquiry notification and aggregate launch notification readiness stayed `blocked` by `property_inquiry_recipient_missing`.
- Checkpoint 1051 ran `npm run check:notification-readiness:strict`. The command rebuilt worker output, sent no email, mutated no rows, returned `strictMode=true`, `commandSuccess=true`, and failed closed as expected with `success=false` because overall notification readiness remains `blocked`. Saved-search alert notification readiness stayed `watch`; property-inquiry notification and aggregate launch notification readiness stayed `blocked` by `property_inquiry_recipient_missing`.
- Checkpoint 1052 ran `npm run check:notification-readiness:strict-contract`. The command rebuilt worker output, sent no email, mutated no rows, and passed with `success=true`. It confirmed the current environment fails closed, the dummy-recipient plus property-inquiry dry-run scenario fails closed with direct and aggregate dry-run blockers detected, and aggregate launch-readiness reply-to warning alignment remains true.
- Checkpoint 1053 ran `npm run check:launch-readiness`. The command rebuilt worker output, sent no email, mutated no rows, ran read-only Prisma connectivity and alert-queue count checks, and failed closed as expected with `success=false`, `readiness.level="blocked"`, and one blocked launch gate. Supabase connectivity stayed `ready`; saved-search alert email stayed `watch` with 197 pending / 0 failed / 0 processing rows; property-inquiry notification email stayed `blocked` by `property_inquiry_recipient_missing`.
- Checkpoint 1054 ran `npm run check:alert-notification-readiness`. The command rebuilt worker output, sent no email, mutated no rows, ran read-only Prisma connectivity, alert-queue count, and sampled-recipient checks, returned `success=true`, and reported saved-search alert notification readiness at `watch`. Alert queue counts stayed 197 pending / 0 failed / 0 processing; sampled recipients were unsubscribed=false.
- Checkpoint 1055 ran `npm run run:alerts:dry -- --limit 50`. The dry-run preview completed with `dryRun=true`, `mode="preview"`, `success=true`, 50 scanned rows, 0 sent, 0 skipped, 0 failed, and 50 masked rows marked `preview` / `Ready to send.` The surfaced live alert command remains blocked by launch policy until property-inquiry recipient routing is configured and strict/aggregate readiness clears.
- Checkpoint 1056 ran `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`. Queue inspection completed with no diagnostics, no failed jobs, no open dead-letter jobs, and no stale active jobs. MLS sync, MLS page, listings, and dead-letter queues were healthy; `reie-alerts` remained `busy` with 273 waiting / 0 active / 0 failed jobs. No worker, retry, or live alert processing was run.
- Checkpoint 1057 ran `npm run supabase:check:json`. Supabase readiness returned `success=true`, `readiness.level="ready"`, and no failed checks; URL/key checks, placeholder scan, project-ref consistency, Postgres URL shape, DNS, TCP, Prisma `SELECT 1`, and Supabase REST all passed. The surfaced `npm run typesense:reindex` command was not run because reindexing remains out of scope unless explicitly requested.
- Checkpoint 1058 ran `npm run typesense:collections:check`. The command ran with `check=true`, `reset=false`, `collectionsOnly=true`, `batchSize=500`, and `maxRecords=all`; canonical `properties` and `listings` schemas validated; existing Typesense `properties` and `listings` collections were ready; no reset or reindex was run.
- Checkpoint 1059 ran `npm run check:fast`. The command passed end to end: worker output rebuilt; property-inquiry missing-recipient and dry-run suppression helpers passed; saved-search alert readiness stayed `watch`; consolidated notification readiness stayed `blocked`; strict-contract validation passed; bounded MLS sync dry-run completed with `executed=false` and no MLS Grid request; typecheck and lint passed.
- Checkpoint 1060 ran `npm run build`. Next.js 15.1.6 compiled successfully, linted and checked types, collected page data, generated 130 static pages, finalized page optimization, and collected build traces.
- Checkpoint 1061 ran `npm run check:property-inquiry-notification:readiness`. The command rebuilt worker output, sent no email, mutated no rows, and failed closed as expected with `success=false`, `readiness.level="blocked"`, and one blocker: `property_inquiry_recipient_missing` because `PROPERTY_INQUIRY_NOTIFY_TO` and fallback `REIE_INTERNAL_EMAIL` are unset.
- Checkpoint 1062 ran `npm run check:notification-readiness`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=true`, and summarized overall notification readiness as `blocked` with two blocked notification readiness checks. Saved-search alert readiness stayed `watch`; property-inquiry notification and aggregate launch notification readiness stayed blocked by `property_inquiry_recipient_missing`.
- Checkpoint 1063 ran `npm run check:notification-readiness:strict`. The command rebuilt worker output, sent no email, mutated no rows, returned `strictMode=true`, `commandSuccess=true`, and failed closed as expected with `success=false` because overall notification readiness remains `blocked` by `property_inquiry_recipient_missing`.
- Checkpoint 1064 ran `npm run check:notification-readiness:strict-contract`. The command rebuilt worker output, sent no email, mutated no rows, and passed. It confirmed the current environment fails closed, the dummy-recipient plus property-inquiry dry-run scenario fails closed with direct and aggregate dry-run blockers detected, and aggregate launch-readiness reply-to warning alignment remains true.
- Checkpoint 1065 ran `npm run check:launch-readiness`. The command rebuilt worker output, sent no email, mutated no rows, ran read-only Prisma connectivity and alert-queue count checks, and failed closed as expected with `success=false`, `readiness.level="blocked"`, and one blocked launch gate. Supabase connectivity stayed `ready`; saved-search alert email stayed `watch`; property-inquiry notification email stayed `blocked` by `property_inquiry_recipient_missing`.
- Checkpoint 1066 ran `npm run check:alert-notification-readiness`. The command rebuilt worker output, sent no email, mutated no rows, ran read-only Prisma connectivity, alert-queue count, and sampled-recipient checks, returned `success=true`, and reported saved-search alert notification readiness at `watch`.
- Checkpoint 1067 ran `npm run run:alerts:dry -- --limit 50`. The dry-run preview completed with `dryRun=true`, `mode="preview"`, `success=true`, 50 scanned rows, 0 sent, 0 skipped, 0 failed, and 50 masked rows marked `preview` / `Ready to send.` The surfaced live alert command remains blocked by launch policy until property-inquiry recipient routing is configured and strict/aggregate readiness clears.
- Checkpoint 1068 ran `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`. Queue inspection completed with no diagnostics, no failed jobs, no open dead-letter jobs, and no stale active jobs. MLS sync, MLS page, listings, and dead-letter queues were healthy; `reie-alerts` remained `busy` with 273 waiting / 0 active / 0 failed jobs. No worker, retry, or live alert processing was run.
- Checkpoint 1069 ran `npm run supabase:check:json`. Supabase readiness returned `success=true`, `readiness.level="ready"`, and no failed checks; URL/key checks, placeholder scan, project-ref consistency, Postgres URL shape, DNS, TCP, Prisma `SELECT 1`, and Supabase REST all passed. The surfaced `npm run typesense:reindex` command was not run because reindexing remains out of scope unless explicitly requested.
- Checkpoint 1070 ran `npm run typesense:collections:check`. The command ran with `check=true`, `reset=false`, `collectionsOnly=true`, `batchSize=500`, and `maxRecords=all`; canonical `properties` and `listings` schemas validated; existing Typesense `properties` and `listings` collections were ready; no reset or reindex was run.
- Checkpoint 1071 configured gitignored local `.env.local` property-inquiry recipient routing, then reran `npm run check:property-inquiry-notification:readiness`, `npm run check:notification-readiness`, `npm run check:notification-readiness:strict`, `npm run check:launch-readiness`, `npm run check:notification-readiness:strict-contract`, and `npm run check:fast`. Local property-inquiry, consolidated notification, strict notification, and aggregate launch readiness now return `watch` rather than `blocked`; no email was sent and no rows were mutated. The strict-contract wrapper was hardened so configured environments pass while explicit missing-recipient and dry-run override scenarios still fail closed.
- Checkpoint 1072 followed the user-confirmed Vercel environment update. The screenshot showed `PROPERTY_INQUIRY_NOTIFY_TO` scoped to Production and Preview, and the user confirmed production was redeployed after adding it. `npm run check:property-inquiry-notification:readiness`, `npm run check:notification-readiness`, `npm run check:notification-readiness:strict`, and `npm run check:launch-readiness` passed locally as non-sending, non-mutating gates with readiness `watch` and no blockers.
- Checkpoint 1073 reran `npm run run:alerts:dry -- --limit 50` after Vercel recipient readiness cleared. The dry-run stayed in preview mode, scanned 50 pending saved-search alert rows, previewed 50 ready-to-send rows, sent 0, skipped 0, failed 0, and did not run a live alert send. Follow-up `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000` completed with no diagnostics, no failed jobs, no open dead-letter jobs, and no stale active jobs; `reie-alerts` remained busy with 273 waiting / 0 active / 0 failed.
- Checkpoint 1074 reran `npm run supabase:check:json` and `npm run typesense:collections:check`. Supabase readiness stayed `ready` with no failed checks, including URL/key shape, placeholder scan, project-ref consistency, Postgres URL shape, DNS, TCP, Prisma `SELECT 1`, and Supabase REST. Typesense collection readiness stayed ready for `properties` and `listings` in collections-only mode; no reset or reindex was run.
- Checkpoint 1075 reran `npm run check:fast`. It passed end to end: worker output rebuilt; property-inquiry missing-recipient and dry-run suppression helpers passed; saved-search alert readiness stayed `watch` with 197 pending / 0 failed / 0 processing; consolidated notification readiness stayed `watch`; strict-contract validation passed; bounded MLS sync dry-run completed with `executed=false` and no MLS Grid request; typecheck and lint passed with no ESLint warnings or errors.
- Checkpoint 1076 reran `npm run build`. Next.js 15.1.6 compiled successfully, completed lint/type validation inside the build pipeline, collected page data, generated 130 static pages, finalized page optimization, and collected build traces. The route manifest still includes static `/`, `/admin`, `/admin/dead-letter`, protected dynamic API routes, SSG article/market routes, dynamic `/properties/[id]`, and dynamic `/search`.
- Checkpoint 1077 started a temporary local Next dev server, reran `npm run smoke:mls-status`, `npm run smoke:search`, and `npm run smoke:ops`, then stopped the server. `smoke:mls-status` returned HTTP 200 with MLS status `busy`, operational readiness `watch`, healthy search index, and watch items for stale inventory/media diagnostics/alert backlog. `smoke:search` returned HTTP 200 with source `typesense`, health `healthy`, 5 returned / 5 mapped / 0 coordinate-filtered, found 15277, and `meta.smoke.ready=true`. `smoke:ops` initially caught stale assertions expecting blocked property-inquiry next-command metadata; `scripts/opsSmoke.ts` and `dist/scripts/opsSmoke.js` now accept the configured `watch` path to `npm run check:notification-readiness` while preserving blocked-env direct-command expectations. The rerun passed, and `npm run check:fast` passed after the smoke fix.
- Checkpoint 1078 refreshed `docs/STATEoftheUNION` so the current blocker/watch section, latest validation snapshot, and near-term work sequence reflect the July 1 local/Vercel property-inquiry recipient readiness, Checkpoint 1077 runtime smoke/fast verification, and the remaining operator-review watch items.
- Checkpoint 1079 reran the read-only CRM review commands after confirming the reporting path only performs database preflight, CRM task reads, and closure-audit `SELECT` queries. The first sandboxed attempts could not reach the Supabase pooler; reruns with network access passed. `npm run run:crm:pending -- --limit 20` scanned 1 pending `strategy_intake` task, and `npm run run:crm:all -- --limit 50` scanned 1 total CRM task. CRM readiness stayed `watch`, closure audit stayed clean with 100% coverage, and no CRM task state was mutated.
- Checkpoint 1080 followed the user-confirmed Resend/Vercel reply-to update. Resend domain `davidquinngroup.com` was verified with DKIM and SPF verified, `RESEND_REPLY_TO_EMAIL=davidquinngroup@gmail.com` was added to Vercel Production/Preview and the user reported redeploy complete, then the same value was added to gitignored `.env.local` for local parity. `npm run check:property-inquiry-notification:readiness`, `npm run check:notification-readiness`, `npm run check:notification-readiness:strict`, `npm run check:launch-readiness`, `npm run check:alert-notification-readiness`, `npm run check:notification-readiness:strict-contract`, and `npm run check:fast` passed without sending email or mutating rows. Property-inquiry notification readiness is now `ready`; consolidated and aggregate notification readiness remain `watch` because saved-search alerts still use sender fallback and 197 pending rows need dry-run review.
- Checkpoint 1081 followed the user-confirmed Vercel sender update. `RESEND_FROM_EMAIL=alerts@davidquinngroup.com` was added to Vercel Production/Preview and production was redeployed; the same value was added to gitignored `.env.local` for local parity. `npm run check:alert-notification-readiness`, `npm run check:property-inquiry-notification:readiness`, `npm run check:notification-readiness`, `npm run check:launch-readiness`, `npm run check:notification-readiness:strict`, `npm run check:notification-readiness:strict-contract`, and `npm run check:fast` passed without sending email or mutating rows. `npm run run:alerts:dry -- --limit 50` previewed 50 ready-to-send saved-search alert rows, sent 0, skipped 0, failed 0, and mutated no rows.
- Checkpoint 1082 reran `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000` after sender readiness cleared. Queue inspection completed cleanly with no diagnostics, no failed jobs, no open dead-letter jobs, and no stale active jobs. MLS sync, MLS page, listings, and dead-letter queues remained healthy; `reie-alerts` remained busy with 273 waiting / 0 active / 0 failed jobs. The surfaced alert worker command was not run.
- Checkpoint 1083 reran `npm run check:launch-readiness`. The command rebuilt worker output, sent no email, mutated no rows, and passed with readiness `watch`, no blockers, Supabase connectivity `ready`, saved-search alert email `watch`, and property-inquiry notification email `ready`. Queue counts stayed 197 pending / 0 failed / 0 processing saved-search alert rows.
- Checkpoint 1084 reran `npm run run:alerts:dry -- --limit 50`. The dry-run preview scanned 50 saved-search alert rows, previewed 50 ready-to-send rows, sent 0, skipped 0, failed 0, and mutated no rows. The surfaced live alert command was not run.
- Checkpoint 1085 reran `npm run check:notification-readiness:strict`. The command rebuilt worker output, sent no email, mutated no rows, and passed in strict mode with readiness `watch`, command success true, no blockers, saved-search alert notification `watch`, property-inquiry notification `ready`, and aggregate launch notification readiness `watch`.
- Checkpoint 1086 reran `npm run check:notification-readiness:strict-contract`. The command rebuilt worker output, sent no email, mutated no rows, and passed. Current env readiness stayed `watch` with exit code 0; missing-recipient and dry-run override scenarios still failed closed with exit code 1.
- Checkpoint 1087 reran `npm run check:fast`. It passed end to end: worker output rebuilt; property-inquiry missing-recipient and dry-run suppression helpers passed; saved-search alert readiness stayed `watch` with 197 pending / 0 failed / 0 processing; consolidated notification readiness stayed `watch`; strict-contract validation passed; bounded MLS sync dry-run completed with `executed=false` and no MLS Grid request; typecheck passed; lint passed with no ESLint warnings or errors.
- Checkpoint 1088 reran `npm run build`. Next.js 15.1.6 compiled successfully, completed lint/type validation, collected page data, generated 130 static pages, finalized page optimization, and collected build traces.
- Checkpoint 1089 started a temporary local Next dev server, reran `npm run smoke:mls-status`, `npm run smoke:search`, and `npm run smoke:ops`, then stopped the server. MLS status returned HTTP 200 with status `busy`, readiness `watch`, healthy search index, stale inventory/media diagnostics watch items, and alert backlog watch. Search returned HTTP 200 with source `typesense`, health `healthy`, found 15277, 5 returned, 5 mapped, 0 coordinate-filtered, and `meta.smoke.ready=true`. Ops smoke passed with public-experience smoke assertions, notification readiness `watch`, property-inquiry readiness `ready`, and alert status caution.
- Checkpoint 1090 reran `npm run supabase:check:json` and `npm run typesense:collections:check`. Supabase readiness stayed `ready` with no failed checks, including URL/key checks, placeholder scan, project-ref consistency, Postgres URL shape, DNS, TCP, Prisma `SELECT 1`, and Supabase REST. Typesense collection readiness stayed ready for `properties` and `listings` in collections-only check mode; no reset or reindex was run. The surfaced `npm run typesense:reindex` command was not run because reindexing remains out of scope unless explicitly requested.
- Checkpoint 1091 reran `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`. Queue inspection completed cleanly with no diagnostics, no failed jobs, no open dead-letter jobs, and no stale active jobs. MLS sync, MLS page, listings, and dead-letter queues were healthy; `reie-alerts` remained busy with 273 waiting / 0 active / 0 failed jobs. The surfaced `npm run run:worker:alerts` command was not run.
- Checkpoint 1092 reran `npm run check:alert-notification-readiness`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=true`, and kept saved-search alert readiness at `watch`. Sender, reply-to, public site URL, failed-row, and processing-row checks passed; 197 pending saved-search alert rows remain available for dry-run review.
- Checkpoint 1093 reran `npm run run:alerts:dry -- --limit 50`. The dry-run preview completed with `dryRun=true`, `mode="preview"`, `success=true`, 50 scanned rows, 0 sent, 0 skipped, 0 failed, and 50 masked rows marked `preview` / `Ready to send.` The surfaced live alert command was not run.
- Checkpoint 1094 reran `npm run check:launch-readiness`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=true`, and kept aggregate launch readiness at `watch` with no blockers. Supabase connectivity was `ready`; property-inquiry notification email was `ready`; saved-search alert email stayed `watch` because 197 pending rows require final dry-run/operator review.
- Checkpoint 1095 reran `npm run check:notification-readiness:strict`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=true`, `strictMode=true`, `commandSuccess=true`, and kept notification readiness at `watch` with no blockers. Saved-search alert notification stayed `watch`; property-inquiry notification stayed `ready`; aggregate launch readiness stayed `watch`.
- Checkpoint 1096 reran `npm run check:notification-readiness:strict-contract`. The command rebuilt worker output, sent no email, mutated no rows, and passed. Current env readiness stayed `watch` with exit code 0; missing-recipient and property-inquiry dry-run override scenarios still failed closed with exit code 1; aggregate launch-readiness reply-to warning alignment remained true.
- Checkpoint 1097 reran `npm run check:fast`. The command passed end to end: worker output rebuilt; property-inquiry notification skip helpers passed; saved-search alert readiness stayed `watch`; consolidated notification readiness stayed `watch`; strict-contract validation passed; bounded MLS sync dry-run completed with `executed=false` and no MLS Grid request; typecheck passed; lint passed with no ESLint warnings or errors.
- Checkpoint 1098 reran `npm run build`. Next.js 15.1.6 compiled successfully, completed lint/type validation inside the build pipeline, collected page data, generated 130 static pages, finalized page optimization, and collected build traces.
- Checkpoint 1099 started a temporary local Next dev server, reran `npm run smoke:mls-status`, `npm run smoke:search`, and `npm run smoke:ops`, then stopped the server. MLS status returned HTTP 200 with status `busy`, readiness `watch`, healthy search-index health, no open dead-letter records, stale inventory watch/fail detail, media diagnostics watch, and `reie-alerts` at 273 waiting. Search returned HTTP 200 with source `typesense`, health `healthy`, found 15277, 5 returned, 5 mapped, 0 coordinate-filtered, and `meta.smoke.ready=true`. Ops smoke passed with public-experience assertions, notification readiness `watch`, property-inquiry readiness `ready`, saved-search readiness `watch`, and alert status caution.
- Checkpoint 1100 reran the read-only CRM review commands: `npm run run:crm:pending -- --limit 20` and `npm run run:crm:all -- --limit 50`. Both passed, scanned one pending `strategy_intake` CRM task for masked contact `co***@example.com`, kept CRM readiness at `watch`, found no completed or dismissed tasks, and preserved 100% closure-review audit coverage. No CRM task state was mutated.
- Checkpoint 1101 reran `npm run check:launch-readiness` after the CRM refresh. The command rebuilt worker output, sent no email, mutated no rows, returned `success=true`, and kept aggregate launch readiness at `watch` with no blockers. Supabase connectivity stayed `ready`; property-inquiry notification stayed `ready`; saved-search alert email stayed `watch` with 197 pending / 0 failed / 0 processing rows as the only launch gate requiring operator review.
- Checkpoint 1102 reran `npm run check:alert-notification-readiness` and `npm run run:alerts:dry -- --limit 50`. Alert readiness rebuilt worker output, sent no email, mutated no rows, and stayed `watch` with sender, reply-to, site URL, failed-row, processing-row, and sampled-recipient checks passing; 197 pending rows remain available for review. The dry-run preview scanned 50, previewed 50 ready-to-send rows, sent 0, skipped 0, and failed 0.
- Checkpoint 1103 reran `npm run check:notification-readiness:strict`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=true`, `strictMode=true`, and `commandSuccess=true`; readiness stayed `watch` with no blockers. Saved-search alert notification and aggregate launch readiness stayed `watch` because 197 pending saved-search alert rows still require operator review; property-inquiry notification stayed `ready`.
- Checkpoint 1104 reran `npm run check:notification-readiness:strict-contract`. The command rebuilt worker output, sent no email, mutated no rows, and passed. Current env stayed `watch` with exit 0 and `success=true`; missing-recipient and property-inquiry dry-run override scenarios stayed blocked with exit 1 and `success=false`; aggregate reply-to warning alignment stayed true.
- Checkpoint 1105 reran `npm run check:fast`. It passed end to end: worker output rebuilt; property-inquiry notification skip helpers passed; saved-search alert readiness stayed `watch` with 197 pending / 0 failed / 0 processing rows; consolidated notification readiness stayed `watch`; strict-contract validation passed; bounded MLS sync dry-run completed with `executed=false` and no MLS Grid request; typecheck passed; lint passed with no ESLint warnings or errors.
- Checkpoint 1106 reran `npm run build`. Next.js 15.1.6 compiled successfully, completed lint/type validation inside the build pipeline, collected page data, generated 130 static pages, finalized page optimization, and collected build traces.
- Checkpoint 1107 started a temporary local Next dev server, reran `npm run smoke:mls-status`, `npm run smoke:search`, and `npm run smoke:ops`, then stopped the server. MLS status returned HTTP 200 with status `busy`, readiness `watch`, healthy search-index health, no open dead-letter records, stale inventory watch/fail detail, media diagnostics watch, and `reie-alerts` at 273 waiting. Search returned HTTP 200 with source `typesense`, health `healthy`, found 15277, 5 returned, 5 mapped, 0 coordinate-filtered, and `meta.smoke.ready=true`. Ops smoke passed with public-experience assertions, notification readiness `watch`, property-inquiry readiness `ready`, saved-search readiness `watch`, alert status caution, and launch readiness `watch`.
- Checkpoint 1108 reran `npm run supabase:check:json` and `npm run typesense:collections:check`. Supabase readiness stayed `ready` with no failed checks, including URL/key checks, placeholder scan, project-ref consistency, Postgres URL shape, DNS, TCP, Prisma `SELECT 1`, and Supabase REST. Typesense collection readiness stayed ready for `properties` and `listings` in collections-only check mode; no reset or reindex was run.
- Checkpoint 1109 reran `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`. Queue inspection completed cleanly with no diagnostics, no failed jobs, no open dead-letter jobs, and no stale active jobs. MLS sync, MLS page, listings, and dead-letter queues were healthy; `reie-alerts` remained busy with 273 waiting / 0 active / 0 failed jobs. The surfaced alert worker command was not run.
- Checkpoint 1110 reran `npm run check:alert-notification-readiness` and `npm run run:alerts:dry -- --limit 50`. Alert readiness rebuilt worker output, sent no email, mutated no rows, and stayed `watch` with sender, reply-to, site URL, failed-row, processing-row, and sampled-recipient checks passing; 197 pending rows remain available for review. The dry-run preview scanned 50, previewed 50 ready-to-send rows, sent 0, skipped 0, and failed 0.
- Checkpoint 1111 reran `npm run check:launch-readiness`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=true`, and kept aggregate launch readiness at `watch` with no blockers. Supabase connectivity stayed `ready`; property-inquiry notification stayed `ready`; saved-search alert email stayed `watch` with 197 pending / 0 failed / 0 processing rows as the only launch gate requiring operator review.
- Checkpoint 1112 reran `npm run check:notification-readiness:strict`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=true`, `strictMode=true`, and `commandSuccess=true`; readiness stayed `watch` with no blockers. Saved-search alert notification and aggregate launch readiness stayed `watch` because 197 pending saved-search alert rows still require operator review; property-inquiry notification stayed `ready`.
- Checkpoint 1113 reran `npm run check:notification-readiness:strict-contract`. The command rebuilt worker output, sent no email, mutated no rows, and passed. Current env stayed `watch` with exit 0 and `success=true`; missing-recipient and property-inquiry dry-run override scenarios stayed blocked with exit 1 and `success=false`; aggregate reply-to warning alignment stayed true.
- Checkpoint 1114 reran `npm run check:fast`. It passed end to end: worker output rebuilt; property-inquiry notification skip helpers passed; saved-search alert readiness stayed `watch` with 197 pending / 0 failed / 0 processing rows; consolidated notification readiness stayed `watch`; strict-contract validation passed; bounded MLS sync dry-run completed with `executed=false` and no MLS Grid request; typecheck passed; lint passed with no ESLint warnings or errors.
- Checkpoint 1115 reran `npm run build`. Next.js 15.1.6 compiled successfully, completed lint/type validation inside the build pipeline, collected page data, generated 130 static pages, finalized page optimization, and collected build traces.
- Checkpoint 1116 started a temporary local Next dev server, reran `npm run smoke:mls-status`, `npm run smoke:search`, and `npm run smoke:ops`, then stopped the server. MLS status returned HTTP 200 with `busy` / `watch`, search returned HTTP 200 from Typesense with healthy smoke metadata, and ops smoke passed with public-experience assertions, notification readiness `watch`, property-inquiry notification `ready`, saved-search readiness `watch`, alert status caution, and launch readiness `watch`.
- Checkpoint 1117 reran `npm run supabase:check:json` and `npm run typesense:collections:check`. Supabase readiness stayed `ready` with no failed checks, and Typesense canonical `properties` plus `listings` collections stayed ready in collections-only check mode without reset or reindex.
- Checkpoint 1118 reran `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`. Queue inspection completed cleanly with no diagnostics, no failed jobs, no open dead-letter jobs, and no stale active jobs; `reie-alerts` remained busy with 273 waiting / 0 active / 0 delayed / 0 failed jobs. The surfaced alert worker command was not run.
- Checkpoint 1119 reran `npm run check:alert-notification-readiness` and `npm run run:alerts:dry -- --limit 50`. Alert readiness stayed `watch` with sender, reply-to, site URL, failed-row, processing-row, and sampled-recipient checks passing; 197 pending saved-search alert rows remained; the dry-run preview scanned 50, previewed 50 ready-to-send rows, sent 0, skipped 0, and failed 0.
- Checkpoint 1120 reran `npm run check:launch-readiness`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=true`, and kept aggregate launch readiness at `watch` with no blockers. Supabase connectivity stayed `ready`; property-inquiry notification stayed `ready`; saved-search alert email stayed `watch` with 197 pending / 0 failed / 0 processing rows as the only launch gate requiring operator review.
- Checkpoint 1121 reran `npm run check:notification-readiness:strict`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=true`, `strictMode=true`, and `commandSuccess=true`; readiness stayed `watch` with no blockers. Saved-search alert notification and aggregate launch readiness stayed `watch`; property-inquiry notification stayed `ready`.
- Checkpoint 1122 reran `npm run check:notification-readiness:strict-contract`. The command rebuilt worker output, sent no email, mutated no rows, and passed. Current env stayed `watch` with exit 0 and `success=true`; missing-recipient and property-inquiry dry-run override scenarios stayed blocked with exit 1 and `success=false`; aggregate reply-to warning alignment stayed true.
- Checkpoint 1123 reran `npm run check:fast`. It passed end to end: worker output rebuilt; property-inquiry notification skip helpers passed; saved-search alert readiness stayed `watch`; consolidated notification readiness stayed `watch`; strict-contract validation passed; bounded MLS sync dry-run completed with `executed=false` and no MLS Grid request; typecheck passed; lint passed with no ESLint warnings or errors.
- Checkpoint 1124 reran `npm run build`. Next.js 15.1.6 compiled successfully, completed lint/type validation inside the build pipeline, collected page data, generated 130 static pages, finalized page optimization, and collected build traces.
- Checkpoint 1125 started a temporary local Next dev server, reran `npm run smoke:mls-status`, `npm run smoke:search`, and `npm run smoke:ops`, then stopped the server. MLS status returned HTTP 200 with `busy` / `watch`, search returned HTTP 200 from Typesense with healthy smoke metadata, and ops smoke passed with public-experience assertions, notification readiness `watch`, property-inquiry notification `ready`, saved-search readiness `watch`, alert status caution, and launch readiness `watch`.
- Checkpoint 1126 reran `npm run supabase:check:json` and `npm run typesense:collections:check`. Supabase readiness stayed `ready` with no failed checks, and Typesense canonical `properties` plus `listings` collections stayed ready in collections-only check mode without reset or reindex.
- Checkpoint 1127 reran `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`. Queue inspection completed cleanly with no diagnostics, no failed jobs, no open dead-letter jobs, and no stale active jobs; `reie-alerts` remained busy with 273 waiting / 0 active / 0 delayed / 0 failed jobs. The surfaced alert worker command was not run.
- Checkpoint 1128 reran `npm run check:alert-notification-readiness` and `npm run run:alerts:dry -- --limit 50`. Alert readiness stayed `watch` with sender, reply-to, site URL, failed-row, processing-row, and sampled-recipient checks passing; 197 pending saved-search alert rows remained; the dry-run preview scanned 50, previewed 50 ready-to-send rows, sent 0, skipped 0, and failed 0.
- Checkpoint 1129 reran `npm run check:launch-readiness`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=true`, and kept aggregate launch readiness at `watch` with no blockers. Supabase connectivity stayed `ready`; property-inquiry notification stayed `ready`; saved-search alert email stayed `watch` with 197 pending / 0 failed / 0 processing rows as the only launch gate requiring operator review.
- Checkpoint 1130 reran `npm run check:notification-readiness:strict`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=true`, `strictMode=true`, and `commandSuccess=true`; readiness stayed `watch` with no blockers. Saved-search alert notification and aggregate launch readiness stayed `watch`; property-inquiry notification stayed `ready`.
- Checkpoint 1131 reran `npm run check:notification-readiness:strict-contract`. The command rebuilt worker output, sent no email, mutated no rows, and passed. Current env stayed `watch` with exit 0 and `success=true`; missing-recipient and property-inquiry dry-run override scenarios stayed blocked with exit 1 and `success=false`; aggregate reply-to warning alignment stayed true.
- Checkpoint 1132 reran `npm run check:fast`. It passed end to end: worker output rebuilt; property-inquiry notification skip helpers passed; saved-search alert readiness stayed `watch`; consolidated notification readiness stayed `watch`; strict-contract validation passed; bounded MLS sync dry-run completed with `executed=false` and no MLS Grid request; typecheck passed; lint passed with no ESLint warnings or errors.
- Checkpoint 1133 reran `npm run build`. Next.js 15.1.6 compiled successfully, completed lint/type validation inside the build pipeline, collected page data, generated 130 static pages, finalized page optimization, and collected build traces.
- Checkpoint 1134 started a temporary local Next dev server, reran `npm run smoke:mls-status`, `npm run smoke:search`, and `npm run smoke:ops`, then stopped the server. MLS status returned HTTP 200 with `busy` / `watch`, search returned HTTP 200 from Typesense with healthy smoke metadata, and ops smoke passed with public-experience assertions, notification readiness `watch`, property-inquiry notification `ready`, saved-search readiness `watch`, alert status caution, and launch readiness `watch`.
- Checkpoint 1135 reran `npm run supabase:check:json` and `npm run typesense:collections:check`. Supabase readiness stayed `ready` with no failed checks, and Typesense canonical `properties` plus `listings` collections stayed ready in collections-only check mode without reset or reindex.
- Checkpoint 1136 reran `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`. Queue inspection completed cleanly with no diagnostics, no failed jobs, no open dead-letter jobs, and no stale active jobs; `reie-alerts` remained busy with 273 waiting / 0 active / 0 delayed / 0 failed jobs. The surfaced alert worker command was not run.
- Checkpoint 1137 reran `npm run check:alert-notification-readiness` and `npm run run:alerts:dry -- --limit 50`. Alert readiness stayed `watch` with sender, reply-to, site URL, failed-row, processing-row, and sampled-recipient checks passing; 197 pending saved-search alert rows remained; the dry-run preview scanned 50, previewed 50 ready-to-send rows, sent 0, skipped 0, and failed 0.
- Checkpoint 1138 reran `npm run check:launch-readiness`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=true`, and kept aggregate launch readiness at `watch` with no blockers. Supabase connectivity stayed `ready`; property-inquiry notification stayed `ready`; saved-search alert email stayed `watch` with 197 pending / 0 failed / 0 processing rows as the only launch gate requiring operator review.
- Checkpoint 1139 reran `npm run check:notification-readiness:strict`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=true`, `strictMode=true`, and `commandSuccess=true`; readiness stayed `watch` with no blockers. Saved-search alert notification and aggregate launch readiness stayed `watch`; property-inquiry notification stayed `ready`.
- Checkpoint 1140 reran `npm run check:notification-readiness:strict-contract`. The command rebuilt worker output, sent no email, mutated no rows, and passed. Current env stayed `watch` with exit 0 and `success=true`; missing-recipient and property-inquiry dry-run override scenarios stayed blocked with exit 1 and `success=false`; aggregate reply-to warning alignment stayed true.
- Checkpoint 1141 reran `npm run check:fast`. It passed end to end: worker output rebuilt; property-inquiry notification skip helpers passed; saved-search alert readiness stayed `watch`; consolidated notification readiness stayed `watch`; strict-contract validation passed; bounded MLS sync dry-run completed with `executed=false` and no MLS Grid request; typecheck passed; lint passed with no ESLint warnings or errors.
- Checkpoint 1142 reran `npm run build`. Next.js 15.1.6 compiled successfully, completed lint/type validation inside the build pipeline, collected page data, generated 130 static pages, finalized page optimization, and collected build traces.
- Checkpoint 1143 started a temporary local Next dev server, reran `npm run smoke:mls-status`, `npm run smoke:search`, and `npm run smoke:ops`, then stopped the server. MLS status returned HTTP 200 with `busy` / `watch`, search returned HTTP 200 from Typesense with healthy smoke metadata, and ops smoke passed with public-experience assertions, notification readiness `watch`, property-inquiry notification `ready`, saved-search readiness `watch`, alert status caution, and launch readiness `watch`.
- Checkpoint 1144 reran `npm run supabase:check:json` and `npm run typesense:collections:check`. Supabase readiness stayed `ready` with no failed checks, and Typesense canonical `properties` plus `listings` collections stayed ready in collections-only check mode without reset or reindex.
- Checkpoint 1145 reran `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`. Queue inspection completed cleanly with no diagnostics, no failed jobs, no open dead-letter jobs, and no stale active jobs; `reie-alerts` remained busy with 273 waiting / 0 active / 0 delayed / 0 failed jobs. The surfaced alert worker command was not run.
- Checkpoint 1146 reran `npm run check:alert-notification-readiness` and `npm run run:alerts:dry -- --limit 50`. Alert readiness stayed `watch` with sender, reply-to, site URL, failed-row, processing-row, and sampled-recipient checks passing; 197 pending saved-search alert rows remained; the dry-run preview scanned 50, previewed 50 ready-to-send rows, sent 0, skipped 0, and failed 0.
- Checkpoint 1147 reran `npm run run:crm:pending`. CRM reporting stayed read-only, scanned 1 pending `strategy_intake` task for masked contact `co***@example.com`, kept CRM readiness at `watch`, and preserved a clean closure audit with 0 closed tasks and 100% closure-review coverage. No CRM task state was mutated.
- Checkpoint 1148 reran `npm run check:launch-readiness`. It rebuilt worker output, sent no email, mutated no rows, completed with `success=true`, kept aggregate launch readiness at `watch`, kept Supabase connectivity `ready`, kept property-inquiry notification email `ready`, and kept saved-search alert email at `watch` with 197 pending / 0 failed / 0 processing rows as the only launch gate requiring operator review.
- Checkpoint 1149 reran `npm run check:notification-readiness:strict`. It rebuilt worker output, completed with `success=true`, `strictMode=true`, `commandSuccess=true`, sent no email, mutated no rows, kept property-inquiry notification `ready`, and kept saved-search plus aggregate notification readiness at `watch` because 197 pending saved-search alert rows still require dry-run/operator review.
- Checkpoint 1150 reran `npm run check:notification-readiness:strict-contract`. It rebuilt worker output, sent no email, mutated no rows, confirmed current env readiness `watch` / exit 0, and verified missing-recipient plus property-inquiry dry-run override scenarios fail closed as `blocked` / exit 1 with aggregate blockers aligned.
- Checkpoint 1151 reran `npm run check:fast`. It passed end to end: worker output rebuilt; property-inquiry notification skip helpers passed; saved-search alert and consolidated notification readiness stayed `watch`; strict contract passed; bounded MLS sync dry-run completed with `executed=false` and no MLS Grid request; typecheck passed; lint passed with no ESLint warnings or errors.
- Checkpoint 1152 reran `npm run build`. Next.js 15.1.6 compiled successfully, completed lint/type validation inside the build pipeline, collected page data, generated 130 static pages, finalized page optimization, and collected build traces.
- Checkpoint 1153 started a temporary local Next dev server, reran `npm run smoke:mls-status`, `npm run smoke:search`, and `npm run smoke:ops`, then stopped the server. MLS status returned HTTP 200 with `busy` / `watch`, search returned HTTP 200 from Typesense with healthy smoke metadata, and ops smoke passed with public-experience assertions, notification readiness `watch`, property-inquiry notification `ready`, saved-search readiness `watch`, alert status `caution`, and launch readiness `watch`.
- Checkpoint 1154 reran `npm run supabase:check:json` and `npm run typesense:collections:check`. Supabase readiness returned `ready` with no failed checks, including URL/key presence, project-ref consistency, DNS, TCP, Prisma, and REST; Typesense canonical `properties` plus `listings` collections stayed ready in collections-only check mode without reset or reindex.
- Checkpoint 1155 reran `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`. Queue inspection completed cleanly with no diagnostics, no failed jobs, no open dead-letter jobs, and no stale active jobs; `reie-alerts` remained busy with 273 waiting / 0 active / 0 delayed / 0 failed jobs. The surfaced alert worker command was not run.
- Checkpoint 1156 reran `npm run check:alert-notification-readiness` and `npm run run:alerts:dry -- --limit 50`. Alert readiness stayed `watch` with sender, reply-to, site URL, failed-row, processing-row, and sampled-recipient checks passing; 197 pending saved-search alert rows remained; the dry-run preview scanned 50, previewed 50 ready-to-send rows, sent 0, skipped 0, and failed 0.
- Checkpoint 1157 reran `npm run run:crm:pending`. CRM reporting stayed read-only, scanned 1 pending `strategy_intake` task for masked contact `co***@example.com`, kept CRM readiness at `watch`, and preserved a clean closure audit with 0 closed tasks and 100% closure-review coverage. No CRM task state was changed.
- Checkpoint 1158 reran `npm run check:launch-readiness`. It rebuilt worker output, sent no email, mutated no rows, completed with `success=true`, kept aggregate launch readiness at `watch`, kept Supabase connectivity `ready`, kept property-inquiry notification email `ready`, and kept saved-search alert email at `watch` with 197 pending / 0 failed / 0 processing rows as the only launch gate requiring operator review.
- Checkpoint 1159 reran `npm run check:notification-readiness:strict`. It rebuilt worker output, completed with `success=true`, `strictMode=true`, `commandSuccess=true`, sent no email, mutated no rows, kept property-inquiry notification `ready`, and kept saved-search plus aggregate notification readiness at `watch` because 197 pending saved-search alert rows still require dry-run/operator review.
- Checkpoint 1160 reran `npm run check:notification-readiness:strict-contract`. It rebuilt worker output, sent no email, mutated no rows, confirmed current env readiness `watch` / exit 0, and verified missing-recipient plus property-inquiry dry-run override scenarios fail closed as `blocked` / exit 1 with aggregate blockers aligned.
- Checkpoint 1161 reran `npm run check:fast`. It passed end to end: worker output rebuilt; property-inquiry notification skip helpers passed; saved-search alert and consolidated notification readiness stayed `watch`; strict contract passed; bounded MLS sync dry-run completed with `executed=false` and no MLS Grid request; typecheck passed; lint passed with no ESLint warnings or errors.
- Checkpoint 1162 reran `npm run build`. Next.js 15.1.6 completed the optimized production build successfully: compilation passed, lint/type validation inside the build pipeline completed, page data was collected, 130 static pages were generated, page optimization finalized, and build traces were collected.
- Checkpoint 1163 started a temporary local Next dev server, reran `npm run smoke:mls-status`, `npm run smoke:search`, and `npm run smoke:ops`, then stopped the server. MLS status returned HTTP 200 with `busy` / `watch`, search returned HTTP 200 from Typesense with healthy smoke metadata, and ops smoke passed with public-experience assertions, notification readiness `watch`, property-inquiry notification `ready`, saved-search readiness `watch`, alert status `caution`, and launch readiness `watch`.
- Checkpoint 1164 reran `npm run supabase:check:json` and `npm run typesense:collections:check`. Supabase readiness stayed `ready` with no failed checks, and Typesense canonical `properties` plus `listings` collections stayed ready in collections-only check mode without reset or reindex.
- Checkpoint 1165 reran `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`. Queue inspection completed cleanly with no diagnostics, no failed jobs, no open dead-letter jobs, and no stale active jobs; `reie-alerts` remained busy with 273 waiting / 0 active / 0 delayed / 0 failed jobs. The surfaced alert worker command was not run.
- Checkpoint 1166 reran `npm run check:alert-notification-readiness` and `npm run run:alerts:dry -- --limit 50`. Alert readiness stayed `watch` with sender, reply-to, site URL, failed-row, processing-row, and sampled-recipient checks passing; 197 pending saved-search alert rows remained; the dry-run preview scanned 50, previewed 50 ready-to-send rows, sent 0, skipped 0, and failed 0.
- Checkpoint 1167 reran `npm run run:crm:pending`. CRM reporting stayed read-only, scanned 1 pending `strategy_intake` task for masked contact `co***@example.com`, kept CRM readiness at `watch`, and preserved a clean closure audit with 0 closed tasks and 100% closure-review coverage. No CRM task state was changed.
- Checkpoint 1168 reran `npm run check:launch-readiness`. It rebuilt worker output, sent no email, mutated no rows, completed with `success=true`, kept aggregate launch readiness at `watch`, kept Supabase connectivity `ready`, kept property-inquiry notification email `ready`, and kept saved-search alert email at `watch` with 197 pending / 0 failed / 0 processing rows as the only launch gate requiring operator review.
- Checkpoint 1169 reran `npm run check:notification-readiness:strict`. It rebuilt worker output, completed with `success=true`, `strictMode=true`, `commandSuccess=true`, sent no email, mutated no rows, kept property-inquiry notification `ready`, and kept saved-search plus aggregate notification readiness at `watch` because 197 pending saved-search alert rows still require dry-run/operator review.
- Checkpoint 1170 reran `npm run check:notification-readiness:strict-contract`. It rebuilt worker output, sent no email, mutated no rows, confirmed current env readiness `watch` / exit 0, and verified missing-recipient plus property-inquiry dry-run override scenarios fail closed as `blocked` / exit 1 with aggregate blockers aligned.
- Checkpoint 1171 reran `npm run check:fast`. It passed end to end: worker output rebuilt; property-inquiry notification skip helpers passed; saved-search alert and consolidated notification readiness stayed `watch`; strict contract passed; bounded MLS sync dry-run completed with `executed=false` and no MLS Grid request; typecheck passed; lint passed with no ESLint warnings or errors.
- Checkpoint 1172 reran `npm run run:digest:dry -- --limit 25`. It passed with `dryRun=true`, `success=true`, 2 users scanned, 2 preview recipients, 0 sent, 0 skipped, and 0 failed; preview recipients were `davidquinngroup@gmail.com` with 80 pending alert payloads and `codex-reie-test@example.com` with 117 pending alert payloads.
- Checkpoint 1173 reran `npm run check:launch-readiness`. It rebuilt worker output, sent no email, mutated no rows, returned `success=true`, kept aggregate launch readiness at `watch` with no blockers, kept Supabase connectivity `ready`, kept property-inquiry notification email `ready`, and kept saved-search alert email at `watch` with 197 pending / 0 failed / 0 processing rows as the only launch gate requiring operator review.
- Checkpoint 1174 reran `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`. Queue inspection completed with `success=true`, no diagnostics, no failed jobs, no open dead-letter jobs, and no stale active jobs; MLS sync, MLS page, listings, and dead-letter queues stayed healthy, while `reie-alerts` remained busy with 273 waiting / 0 active / 0 delayed / 0 failed jobs.
- Checkpoint 1175 reran `npm run run:crm:pending`. CRM reporting stayed read-only, scanned 1 pending `strategy_intake` task for masked contact `co***@example.com`, kept CRM readiness at `watch`, and preserved a clean closure audit with 0 closed tasks and 100% closure-review coverage. No CRM task state was changed.
- Checkpoint 1176 reran `npm run check:alert-notification-readiness` and `npm run run:alerts:dry -- --limit 50`. Alert readiness stayed `watch` with sender, reply-to, public site URL, failed-row, processing-row, and sampled-recipient checks passing; 197 pending saved-search alert rows remained. The dry-run preview scanned 50 rows, previewed 50 ready-to-send rows, sent 0, skipped 0, and failed 0.
- Checkpoint 1177 reran `npm run check:notification-readiness:strict`. It rebuilt worker output, completed with `success=true`, `strictMode=true`, `commandSuccess=true`, sent no email, mutated no rows, kept property-inquiry notification `ready`, and kept saved-search plus aggregate notification readiness at `watch` because 197 pending saved-search alert rows still require dry-run/operator review.
- Checkpoint 1178 reran `npm run check:notification-readiness:strict-contract`. It rebuilt worker output, sent no email, mutated no rows, confirmed current env readiness `watch` / exit 0, and verified missing-recipient plus property-inquiry dry-run override scenarios fail closed as `blocked` / exit 1 with aggregate blockers aligned.
- Checkpoint 1179 reran `npm run check:fast`. It passed end to end: worker output rebuilt; property-inquiry notification skip helpers passed; saved-search alert and consolidated notification readiness stayed `watch`; property-inquiry notification stayed `ready`; strict contract passed; bounded MLS sync dry-run completed with `executed=false` and no MLS Grid request; typecheck passed; lint passed with no ESLint warnings or errors.
- Checkpoint 1180 reran `npm run build`. Next.js 15.1.6 completed the optimized production build successfully: compilation passed, lint/type validation inside the build pipeline completed, page data was collected, 130 static pages were generated, page optimization finalized, and build traces were collected.
- Checkpoint 1181 started a temporary local Next dev server, reran `npm run smoke:mls-status`, `npm run smoke:search`, and `npm run smoke:ops`, then stopped the server. MLS status returned HTTP 200 with `busy` / `watch`, search returned HTTP 200 from Typesense with healthy smoke metadata, and ops smoke passed with public-experience assertions, notification readiness `watch`, property-inquiry notification `ready`, saved-search readiness `watch`, alert status `caution`, and launch readiness `watch`.
- Checkpoint 1182 reran `npm run supabase:check:json` and `npm run typesense:collections:check`. Supabase readiness stayed `ready` with no failed checks; URL/key checks, project-ref consistency, DNS, Postgres TCP, Prisma `SELECT 1`, and Supabase REST passed. Typesense canonical `properties` plus `listings` collections stayed ready in collections-only check mode without reset or reindex.
- Checkpoint 1183 reran `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`. Queue inspection completed with `success=true`, no diagnostics, no failed jobs, no open dead-letter jobs, and no stale active jobs; MLS sync, MLS page, listings, and dead-letter queues stayed healthy, while `reie-alerts` remained busy with 273 waiting / 0 active / 0 delayed / 0 failed jobs.
- Checkpoint 1184 reran `npm run run:crm:pending`. CRM reporting stayed read-only, scanned 1 pending `strategy_intake` task for masked contact `co***@example.com`, kept CRM readiness at `watch`, and preserved a clean closure audit with 0 closed tasks and 100% closure-review coverage. No CRM task state was changed.
- Checkpoint 1185 reran `npm run check:alert-notification-readiness` and `npm run run:alerts:dry -- --limit 50`. Alert readiness stayed `watch` with sender, reply-to, public site URL, failed-row, processing-row, and sampled-recipient checks passing; 197 pending saved-search alert rows remained. The dry-run preview scanned 50 rows, previewed 50 ready-to-send rows, sent 0, skipped 0, and failed 0.
- Checkpoint 1186 reran `npm run check:launch-readiness`. It rebuilt worker output, sent no email, mutated no rows, returned `success=true`, kept aggregate launch readiness at `watch` with no blockers, kept Supabase connectivity `ready`, kept property-inquiry notification email `ready`, and kept saved-search alert email at `watch` with 197 pending / 0 failed / 0 processing rows as the only launch gate requiring operator review.
- Checkpoint 1187 reran `npm run check:notification-readiness:strict`. It rebuilt worker output, completed with `success=true`, `strictMode=true`, `commandSuccess=true`, sent no email, mutated no rows, kept property-inquiry notification `ready`, and kept saved-search plus aggregate notification readiness at `watch` because 197 pending saved-search alert rows still require dry-run/operator review.
- Checkpoint 1188 reran `npm run check:notification-readiness:strict-contract`. It rebuilt worker output, sent no email, mutated no rows, confirmed current env readiness `watch` / exit 0, and verified missing-recipient plus property-inquiry dry-run override scenarios fail closed as `blocked` / exit 1 with aggregate blockers aligned.
- Checkpoint 1189 reran `npm run check:fast`. It passed end to end: worker output rebuilt; property-inquiry notification skip helpers passed; saved-search alert and consolidated notification readiness stayed `watch`; property-inquiry notification stayed `ready`; strict contract passed; bounded MLS sync dry-run completed with `executed=false` and no MLS Grid request; typecheck passed; lint passed with no ESLint warnings or errors.
- Checkpoint 1190 reran `npm run build`. Next.js 15.1.6 completed the optimized production build successfully: compilation passed, lint/type validation inside the build pipeline completed, page data was collected, 130 static pages were generated, page optimization finalized, and build traces were collected.
- Checkpoint 1191 started a temporary local Next dev server, reran `npm run smoke:mls-status`, `npm run smoke:search`, and `npm run smoke:ops`, then stopped the server. MLS status returned HTTP 200 with `busy` / `watch`, search returned HTTP 200 from Typesense with healthy smoke metadata, and ops smoke passed with public-experience assertions, notification readiness `watch`, property-inquiry notification `ready`, saved-search readiness `watch`, alert status `caution`, and launch readiness `watch`.
- Checkpoint 1192 reran `npm run check:launch-readiness`. It rebuilt worker output, sent no email, mutated no rows, returned `success=true`, kept aggregate launch readiness at `watch` with no blockers, kept Supabase connectivity `ready`, kept property-inquiry notification email `ready`, and kept saved-search alert email at `watch` with 197 pending / 0 failed / 0 processing rows as the only launch gate requiring operator review.
- Checkpoint 1193 reran the protected saved-search alert preview command `npm run run:alerts:dry -- --limit 50`. It scanned 50 pending rows, previewed 50 ready-to-send rows, sent 0 emails, skipped 0 rows, failed 0 rows, and reported `dryRun=true`, `mode="preview"`, and `success=true`.
- Checkpoint 1194 reran `npm run check:alert-notification-readiness`. It rebuilt worker output, sent no email, mutated no rows, returned `success=true`, kept saved-search alert readiness at `watch`, confirmed sender/reply-to/site-url checks passing, confirmed 197 pending / 0 failed / 0 processing rows, and sampled 10 recipients with `isUnsubscribed=false`.
- Checkpoint 1195 reran `npm run check:notification-readiness`. It rebuilt worker output, sent no email, mutated no rows, returned `success=true`, kept aggregate notification readiness at `watch`, kept property-inquiry notification `ready`, kept saved-search alert notification `watch`, and reported the same 197 pending saved-search alert rows as the only operator-review warning.
- Checkpoint 1196 reran `npm run check:notification-readiness:strict`. It rebuilt worker output, sent no email, mutated no rows, completed with `success=true`, `strictMode=true`, `commandSuccess=true`, kept aggregate notification readiness at `watch`, kept property-inquiry notification `ready`, kept saved-search alert notification `watch`, and reported the same 197 pending saved-search alert rows as the only operator-review warning.
- Checkpoint 1197 reran `npm run check:notification-readiness:strict-contract`. It rebuilt worker output, sent no email, mutated no rows, returned `success=true`, confirmed current env readiness `watch` / exit 0, and verified missing-recipient plus property-inquiry dry-run override scenarios fail closed as `blocked` / exit 1 with property-inquiry and aggregate blockers aligned.
- Checkpoint 1198 reran `npm run check:fast`. It passed end to end: worker output rebuilt; property-inquiry notification skip helpers passed; saved-search alert and consolidated notification readiness stayed `watch`; property-inquiry notification stayed `ready`; strict notification contract passed; bounded MLS sync dry-run completed with `executed=false` and no MLS Grid request; typecheck passed; lint passed with no ESLint warnings or errors.
- Checkpoint 1199 reran `npm run build`. Next.js 15.1.6 completed the optimized production build successfully: compilation passed, lint/type validation inside the build pipeline completed, page data was collected, 130 static pages were generated, page optimization finalized, and build traces were collected.
- Checkpoint 1200 started a temporary local Next dev server, reran `npm run smoke:mls-status`, `npm run smoke:search`, and `npm run smoke:ops`, then stopped the server. MLS status returned HTTP 200 with `busy` / `watch`, search returned HTTP 200 from Typesense with healthy smoke metadata, and ops smoke passed with public-experience assertions, notification readiness `watch`, property-inquiry notification `ready`, saved-search readiness `watch`, alert status `caution`, and launch readiness `watch`.
- Checkpoint 1201 reran `npm run run:crm:pending`. CRM reporting stayed read-only, scanned one pending `strategy_intake` task for masked contact `co***@example.com`, kept CRM readiness at `watch`, found 0 reviewing / completed / dismissed tasks, and preserved a clean closure-review audit with 100% coverage. No CRM task state was changed.
- Checkpoint 1202 reran `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`. Queue inspection completed cleanly with no diagnostics, no failed jobs, no open dead-letter jobs, and no stale active jobs. MLS sync, MLS page, listings, and dead-letter queues stayed healthy; `reie-alerts` remained busy with 273 waiting / 0 active / 0 delayed / 0 failed jobs. The surfaced alert worker command was not run.
- Checkpoint 1203 reran `npm run check:launch-readiness`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=true`, and kept launch readiness at `watch` with no blockers. Supabase connectivity and property-inquiry notification email stayed `ready`; saved-search alert email stayed `watch` with 197 pending / 0 failed / 0 processing rows as the only launch gate requiring operator review.
- Checkpoint 1204 reran `npm run run:alerts:dry -- --limit 50`. The protected saved-search alert preview completed with `dryRun=true`, `mode="preview"`, and `success=true`; it scanned 50 pending rows, previewed 50 ready-to-send rows, sent 0 emails, skipped 0 rows, and failed 0 rows. The surfaced live alert command was not run.
- Checkpoint 1205 reran `npm run check:alert-notification-readiness`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=true`, and kept saved-search alert readiness at `watch`. Sender, reply-to, site URL, failed-row, processing-row, and 10 sampled-recipient checks passed; the only warning stayed 197 pending saved-search alert rows available for dry-run review.
- Checkpoint 1206 reran `npm run check:notification-readiness`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=true`, `strictMode=false`, and `commandSuccess=true`. Property-inquiry notification stayed `ready`; saved-search alert notification and aggregate launch notification readiness stayed `watch` only because 197 pending saved-search alert rows require operator review.
- Checkpoint 1207 reran `npm run check:notification-readiness:strict`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=true`, `strictMode=true`, and `commandSuccess=true`. Property-inquiry notification stayed `ready`; saved-search alert notification and aggregate launch notification readiness stayed `watch`, not blocked, only because 197 pending saved-search alert rows require operator review.
- Checkpoint 1208 reran `npm run check:notification-readiness:strict-contract`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=true`, confirmed current env readiness `watch` / exit 0, and verified missing-recipient plus property-inquiry dry-run override scenarios fail closed as `blocked` / exit 1 with property-inquiry and aggregate blockers aligned.
- Checkpoint 1209 reran `npm run check:fast`. It passed end to end: worker output rebuilt; property-inquiry notification skip helpers passed; saved-search alert and consolidated notification readiness stayed `watch`; strict notification contract passed; bounded MLS sync dry-run completed with `executed=false` and no MLS Grid request; typecheck passed; lint passed with no ESLint warnings or errors.
- Checkpoint 1210 reran `npm run build`. Next.js 15.1.6 completed the optimized production build successfully: compilation passed, lint/type validation inside the build pipeline completed, page data was collected, 130 static pages were generated, page optimization finalized, and build traces were collected.
- Checkpoint 1211 started a temporary local Next dev server, reran `npm run smoke:mls-status`, `npm run smoke:search`, and `npm run smoke:ops`, then stopped the server. MLS status returned HTTP 200 with status `busy`, operational readiness `watch`, healthy search-index health, no failed recent jobs, and no open dead-letter rows. Search returned HTTP 200 from Typesense with healthy smoke metadata, 5 returned / 5 mapped results, and public access metadata. Ops smoke passed public-experience assertions plus admin/control/intake/CRM/dead-letter/retry/search/notification checks, with notification readiness `watch`, property-inquiry notification `ready`, saved-search readiness `watch`, alert status `caution`, and launch readiness `watch`.
- Checkpoint 1212 reran `npm run supabase:check:json` and `npm run typesense:collections:check`. Supabase readiness returned `ready` with no failed checks, including URL/key checks, project-ref consistency, DNS, Postgres TCP, Prisma `SELECT 1`, and REST. Typesense canonical `properties` plus `listings` collections were ready in collections-only check mode without reset or reindex. The surfaced Typesense reindex command was not run.
- Checkpoint 1213 reran `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`. Queue inspection completed cleanly with `success=true`, no diagnostics, no failed jobs, no open dead-letter jobs, and no stale active jobs. MLS sync, MLS page, listings, and dead-letter queues stayed healthy; `reie-alerts` remained busy with 273 waiting / 0 active / 0 delayed / 0 failed jobs. The surfaced alert worker command was not run.
- Checkpoint 1214 reran `npm run run:crm:pending`. CRM reporting stayed read-only, completed database preflight plus CRM task/user and closure-audit `SELECT` queries, scanned one pending `strategy_intake` task for masked contact `co***@example.com`, kept CRM readiness at `watch`, found 0 reviewing / completed / dismissed tasks, and preserved 100% closure-review coverage. No CRM task state was changed.
- Checkpoint 1215 reran `npm run check:launch-readiness`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=true`, and kept aggregate launch readiness at `watch` with no blockers. Supabase connectivity stayed `ready`; property-inquiry notification email stayed `ready`; saved-search alert email stayed `watch` with 197 pending / 0 failed / 0 processing rows as the only launch gate requiring operator review.
- Checkpoint 1216 reran `npm run run:alerts:dry -- --limit 50`. The protected saved-search alert preview completed with `dryRun=true`, `mode="preview"`, and `success=true`; it scanned 50 pending rows, previewed 50 ready-to-send rows, sent 0 emails, skipped 0 rows, and failed 0 rows. The surfaced live alert command was not run.
- Checkpoint 1217 reran `npm run check:alert-notification-readiness`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=true`, and kept saved-search alert notification readiness at `watch`. Sender, reply-to, public site URL, failed-row, processing-row, and 10 sampled-recipient checks passed; pending saved-search alert rows stayed 197 with 0 failed and 0 processing. The surfaced dry-run command was not rerun in this checkpoint.
- Checkpoint 1218 reran `npm run check:notification-readiness`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=true`, `strictMode=false`, and `commandSuccess=true`. Property-inquiry notification stayed `ready`; saved-search alert notification and aggregate launch notification readiness stayed `watch` only because 197 pending saved-search alert rows require operator review. The surfaced dry-run command was not rerun in this checkpoint.
- Checkpoint 1219 reran `npm run check:notification-readiness:strict`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=true`, `strictMode=true`, and `commandSuccess=true`. Property-inquiry notification stayed `ready`; saved-search alert notification and aggregate launch notification readiness stayed `watch`, not blocked, only because 197 pending saved-search alert rows require operator review. The surfaced dry-run command was not rerun in this checkpoint.
- Checkpoint 1220 reran `npm run check:notification-readiness:strict-contract`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=true`, confirmed current env readiness `watch` / exit 0, and verified missing-recipient plus property-inquiry dry-run override scenarios fail closed as `blocked` / exit 1 with property-inquiry and aggregate blockers aligned.
- Checkpoint 1221 reran `npm run check:fast`. The command passed end to end: worker output rebuilt; property-inquiry notification skip helpers passed; saved-search alert and consolidated notification readiness stayed `watch`; strict notification contract passed; bounded MLS sync dry-run completed with `executed=false` and no MLS Grid request; typecheck passed; lint passed with no ESLint warnings or errors.
- Checkpoint 1222 reran `npm run build`. Next.js 15.1.6 completed the optimized production build successfully: compilation passed, lint/type validation inside the build pipeline completed, page data was collected, 130 static pages were generated, page optimization finalized, and build traces were collected.
- Checkpoint 1223 started a temporary local Next dev server, reran `npm run smoke:mls-status`, `npm run smoke:search`, and `npm run smoke:ops`, then stopped the server. MLS status returned HTTP 200 with status `busy`, operational readiness `watch`, healthy search-index health, no failed recent jobs, and no open dead-letter rows. Search returned HTTP 200 from Typesense with healthy smoke metadata, 5 returned / 5 mapped results, and public access metadata. Ops smoke passed public-experience assertions plus admin/control/intake/CRM/dead-letter/retry/search/notification checks, with notification readiness `watch`, property-inquiry notification `ready`, saved-search readiness `watch`, alert status `caution`, and launch readiness `watch`.
- Checkpoint 1224 reran `npm run supabase:check:json` and `npm run typesense:collections:check`. Supabase readiness returned `ready` with no failed checks, including URL/key checks, project-ref consistency, DNS, Postgres TCP, Prisma `SELECT 1`, and REST. Typesense canonical `properties` plus `listings` collections were ready in collections-only check mode without reset or reindex. The surfaced Typesense reindex command was not run.
- Checkpoint 1225 reran `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`. Queue inspection returned `success=true`, no diagnostics, no failed jobs, no open dead-letter jobs, and no stale active jobs. Recovery level remained `caution` only because `reie-alerts` has 273 waiting / 0 active / 0 failed jobs. MLS sync, MLS page, listings, and dead-letter queues were healthy. The surfaced alert worker command was not run.
- Checkpoint 1226 reran `npm run run:crm:pending`. CRM reporting stayed read-only, returned `success=true`, scanned one pending `strategy_intake` task for masked contact `co***@example.com`, kept CRM readiness at `watch`, found 0 reviewing / completed / dismissed tasks, and preserved 100% closure-review coverage. No CRM task state was changed.
- Checkpoint 1227 reran `npm run check:launch-readiness`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=true`, and kept aggregate launch readiness at `watch` with no blockers. Supabase connectivity stayed `ready`; property-inquiry notification email stayed `ready`; saved-search alert email stayed `watch` with 197 pending / 0 failed / 0 processing rows as the only launch gate requiring operator review. The surfaced saved-search alert dry-run command was not run.
- Checkpoint 1228 reran `npm run run:alerts:dry -- --limit 50`. The protected saved-search alert preview completed with `dryRun=true`, `mode="preview"`, `success=true`, scanned 50 pending rows, previewed 50 ready-to-send rows, sent 0 emails, skipped 0 rows, and failed 0 rows. The surfaced live script, live API call, and alert worker commands were not run.
- Checkpoint 1229 reran `npm run check:alert-notification-readiness`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=true`, and kept saved-search alert notification readiness at `watch`. Sender, reply-to, public site URL, failed-row, processing-row, and 10 sampled-recipient checks passed; pending saved-search alert rows stayed 197 with 0 failed and 0 processing. The surfaced dry-run command was not rerun in this checkpoint.
- Checkpoint 1230 reran `npm run check:notification-readiness`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=true`, `strictMode=false`, and `commandSuccess=true`. Property-inquiry notification stayed `ready`; saved-search alert notification and aggregate launch notification readiness stayed `watch` only because 197 pending saved-search alert rows require operator review. The surfaced dry-run command was not rerun in this checkpoint.
- Checkpoint 1231 reran `npm run check:notification-readiness:strict`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=true`, `strictMode=true`, and `commandSuccess=true`. Property-inquiry notification stayed `ready`; saved-search alert notification and aggregate launch notification readiness stayed `watch`, not blocked, only because 197 pending saved-search alert rows require operator review. The surfaced dry-run command was not rerun in this checkpoint.
- Checkpoint 1232 reran `npm run check:notification-readiness:strict-contract`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=true`, confirmed current env readiness `watch` / exit 0, and verified missing-recipient plus property-inquiry dry-run override scenarios fail closed as `blocked` / exit 1 with property-inquiry and aggregate blockers aligned.
- Checkpoint 1233 reran `npm run check:fast`. The command passed end to end: worker output rebuilt; property-inquiry notification skip helpers passed; saved-search alert and consolidated notification readiness stayed `watch`; strict notification contract passed; bounded MLS sync dry-run completed with `executed=false` and no MLS Grid request; typecheck passed; lint passed with no ESLint warnings or errors.
- Checkpoint 1234 reran `npm run build`. Next.js 15.1.6 completed the optimized production build successfully: compilation passed, lint/type validation inside the build pipeline completed, page data was collected, 130 static pages were generated, page optimization finalized, and build traces were collected.
- Checkpoint 1235 started a temporary local Next dev server, reran `npm run smoke:mls-status`, `npm run smoke:search`, and `npm run smoke:ops`, then stopped the server. MLS status returned HTTP 200 with status `busy`, operational readiness `watch`, healthy search-index health, no failed recent jobs, and no open dead-letter rows; inventory freshness stayed stale and media diagnostics stayed `busy`. Search returned HTTP 200 from Typesense with healthy smoke metadata, 5 returned / 5 mapped results, and public access metadata. Ops smoke passed public-experience assertions plus admin/control/intake/CRM/dead-letter/retry/search/notification checks, with notification readiness `watch`, property-inquiry notification `ready`, saved-search readiness `watch`, alert status `caution`, and launch readiness `watch`.
- Checkpoint 1236 reran `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`. Queue inspection returned `success=true`, no diagnostics, no failed jobs, no open dead-letter jobs, and no stale active jobs. Recovery stayed `caution` because `reie-alerts` remains busy with 273 waiting / 0 active / 0 delayed / 0 failed jobs; MLS sync, MLS page, listings, and dead-letter queues stayed healthy/drained. The surfaced alert-worker command was not run.
- Checkpoint 1237 reran `npm run run:crm:pending`. CRM reporting stayed read-only, returned `success=true`, completed database preflight plus CRM task/user and closure-audit `SELECT` queries, scanned one pending `strategy_intake` task for masked contact `co***@example.com`, kept CRM readiness at `watch`, found 0 reviewing / completed / dismissed tasks, and preserved 100% closure-review coverage. No CRM task state was changed.
- Checkpoint 1238 reran `npm run check:launch-readiness`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=true`, kept aggregate launch readiness at `watch` with no blockers, kept Supabase connectivity and property-inquiry notification email `ready`, and kept saved-search alert email at `watch` with 197 pending / 0 failed / 0 processing rows as the only launch gate requiring operator review. The surfaced saved-search alert dry-run command was not run.
- Checkpoint 1239 reran `npm run run:alerts:dry -- --limit 50`. The protected saved-search alert preview completed with `dryRun=true`, `mode="preview"`, `success=true`, scanned 50 pending rows, previewed 50 ready-to-send rows, sent 0 emails, skipped 0 rows, and failed 0 rows. The surfaced live script, live API call, and alert worker commands were not run.
- Checkpoint 1240 reran `npm run check:alert-notification-readiness`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=true`, and kept saved-search alert notification readiness at `watch`. Sender, reply-to, public site URL, failed-row, processing-row, and 10 sampled-recipient checks passed; pending saved-search alert rows stayed 197 with 0 failed and 0 processing. The surfaced dry-run command was not rerun in this checkpoint.
- Checkpoint 1241 reran `npm run check:notification-readiness`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=true`, `strictMode=false`, and `commandSuccess=true`. Property-inquiry notification stayed `ready`; saved-search alert notification and aggregate launch notification readiness stayed `watch` only because 197 pending saved-search alert rows require operator review. The surfaced dry-run command was not rerun in this checkpoint.
- Checkpoint 1242 reran `npm run check:notification-readiness:strict`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=true`, `strictMode=true`, and `commandSuccess=true`. Property-inquiry notification stayed `ready`; saved-search alert notification and aggregate launch notification readiness stayed `watch`, not blocked, only because 197 pending saved-search alert rows require operator review. The surfaced dry-run command was not rerun in this checkpoint.
- Checkpoint 1243 reran `npm run check:notification-readiness:strict-contract`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=true`, confirmed current env readiness `watch` / exit 0, and verified missing-recipient plus property-inquiry dry-run override scenarios fail closed as `blocked` / exit 1 with property-inquiry and aggregate blockers aligned; aggregate reply-to warning alignment stayed true.
- Checkpoint 1244 reran `npm run build`. Next.js 15.1.6 compiled successfully, completed lint/type validation inside the production build pipeline, collected page data, generated 130 static pages, finalized page optimization, and collected build traces.
- Checkpoint 1245 started a temporary local Next dev server, reran `npm run smoke:mls-status`, `npm run smoke:search`, and `npm run smoke:ops`, then stopped the server. MLS status returned HTTP 200 with readiness `watch`, healthy search-index health, stale inventory freshness, and busy media diagnostics; search returned HTTP 200 from Typesense with healthy smoke metadata; ops smoke passed public-experience, admin/control/intake/CRM/dead-letter/retry/search/notification checks with notification readiness `watch`, property-inquiry notification `ready`, saved-search readiness `watch`, alert status `caution`, and launch readiness `watch`.
- Checkpoint 1246 reran `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`. Queue inspection returned `success=true`, no diagnostics, no failed jobs, no open dead-letter jobs, no stale active jobs, and recovery stayed `caution` only because `reie-alerts` remains busy with 273 waiting / 0 active / 0 failed jobs.
- Checkpoint 1247 reran `npm run run:crm:pending`. CRM reporting stayed read-only, returned `success=true`, scanned one pending `strategy_intake` task for masked contact `co***@example.com`, kept CRM readiness at `watch`, found 0 reviewing / completed / dismissed tasks, and preserved 100% closure-review coverage. No CRM task state was changed.
- Checkpoint 1248 reran `npm run check:launch-readiness`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=true`, kept aggregate launch readiness at `watch` with no blockers, kept Supabase connectivity and property-inquiry notification email `ready`, and kept saved-search alert email at `watch` with 197 pending / 0 failed / 0 processing rows as the only launch gate requiring operator review.
- Checkpoint 1249 reran `npm run run:alerts:dry -- --limit 50`. The protected saved-search alert preview completed with `dryRun=true`, `mode="preview"`, `success=true`, scanned 50 pending rows, previewed 50 ready-to-send rows, sent 0 emails, skipped 0 rows, and failed 0 rows. The surfaced live script, live API call, and alert worker commands were not run.
- Checkpoint 1250 reran `npm run check:alert-notification-readiness`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=true`, kept saved-search alert notification readiness at `watch`, and confirmed sender, reply-to, public site URL, failed-row, processing-row, and 10 sampled-recipient checks passed. Pending saved-search alert rows stayed 197 with 0 failed and 0 processing.
- Checkpoint 1251 reran `npm run check:notification-readiness`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=true`, `strictMode=false`, and `commandSuccess=true`. Property-inquiry notification stayed `ready`; saved-search alert notification and aggregate launch notification readiness stayed `watch` only because 197 pending saved-search alert rows require operator review.
- Checkpoint 1252 reran `npm run check:notification-readiness:strict`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=true`, `strictMode=true`, and `commandSuccess=true`. Property-inquiry notification stayed `ready`; saved-search alert notification and aggregate launch notification readiness stayed `watch`, not blocked, only because 197 pending saved-search alert rows require operator review.
- Checkpoint 1253 reran `npm run check:notification-readiness:strict-contract`. The command rebuilt worker output, sent no email, mutated no rows, returned `success=true`, confirmed current env readiness `watch` / exit 0, and verified missing-recipient plus property-inquiry dry-run override scenarios fail closed as `blocked` / exit 1 with property-inquiry and aggregate blockers aligned; aggregate reply-to warning alignment stayed true.
- No intended dirty files remain after Checkpoint 1253; `.env.local` remains gitignored and must not be committed.
- The property-inquiry recipient blocker, reply-to warning, and sender fallback warning are cleared for local and Vercel production posture. Remaining operator-review watch items are 197 pending saved-search alert rows before live alert processing, one pending `strategy_intake` CRM task, and the controlled internal tracked-email click before recurring email/scheduler activation.
- Do not run live sync, live workers, live email sends, CRM mutations, OpenAI calls, MLS Grid requests, Typesense reindexing, or queue retries unless the user explicitly asks for that production operation.
- Do not run `npm run smoke:property-inquiry` under a no-CRM-mutation launch constraint unless the user explicitly approves that route smoke. Use `npm run check:property-inquiry-notification:readiness` for the non-sending, non-mutating property-inquiry notification gate.
- The next chat should first run `git status --short`, then continue with safe local production readiness checks, final handoff hygiene, or prepare a clean handoff commit/amend.

Latest local validation snapshot, June 21, 2026 10:22 MDT:

- June 21 10:22 MDT `npm run check:fast` passed after MLS photo media hardening: worker output rebuilt, notification readiness checks stayed non-sending/non-mutating, protected MLS sync dry-run remained non-executing with no MLS Grid request, and typecheck plus lint passed.
- June 21 10:21 MDT `npm run smoke:ops` passed against a temporary local Next dev server after MLS photo media hardening, and the server was stopped afterward. A follow-up `lsof -nP -iTCP:3000 -sTCP:LISTEN` check confirmed `localhost:3000` was clear.
- June 21 10:21 MDT hardened MLS photo normalization so string media URLs must look like image URLs before replacing `PropertyPhoto` rows, and record media with PDF, document, brochure, video, floor plan, or virtual-tour metadata is rejected before broader property-media category fallback.
- June 21 08:12 MDT `npm run check:fast` passed: worker output rebuilt, property-inquiry missing-recipient and dry-run suppression checks passed, saved-search alert readiness remained `watch` with 197 pending / 0 failed / 0 processing, consolidated notification readiness remained blocked by missing property-inquiry recipient routing, strict-contract validation passed, bounded MLS sync dry-run remained non-executing with no MLS Grid request, and `npm run typecheck` plus `npm run lint` passed with no ESLint warnings or errors.
- June 21 08:14 MDT `npm run build` passed: Next compiled successfully, completed lint/type validation inside the build pipeline, collected page data, generated 130 static pages, finalized page optimization, and collected build traces.
- June 21 07:31 MDT `npm run supabase:check:json` passed with readiness `ready`: Supabase URL/key shape, placeholder scan, project-ref consistency, Postgres URL shape, project DNS, Postgres DNS, TCP, Prisma `SELECT 1`, and Supabase REST all passed with no failed checks.
- June 21 08:16 MDT started a temporary local Next dev server on `http://localhost:3000`, ran `npm run smoke:mls-status`, `npm run smoke:search`, and `npm run smoke:ops`, then stopped the server. A follow-up `lsof -nP -iTCP:3000 -sTCP:LISTEN` check confirmed `localhost:3000` was clear.
- June 20 12:31 MDT `npm run check:fast` passed: worker output rebuilt, property-inquiry missing-recipient and dry-run suppression checks passed, saved-search alert readiness remained `watch` with 197 pending / 0 failed / 0 processing, consolidated notification readiness remained blocked by missing property-inquiry recipient routing, strict-contract validation passed, bounded MLS sync dry-run remained non-executing with no MLS Grid request, and `npm run typecheck` plus `npm run lint` passed with no lint warnings or errors.
- June 20 12:49 MDT `npm run build` passed: Next compiled successfully, completed lint/type validation inside the build pipeline, collected page data, generated 130 static pages, finalized page optimization, and collected build traces.
- June 20 13:02 MDT `npm run supabase:check:json` passed with readiness `ready`: Supabase URL/key shape, placeholder scan, project-ref consistency, Postgres URL shape, project DNS, Postgres DNS, TCP, Prisma `SELECT 1`, and Supabase REST all passed with no failed checks.
- June 20 13:08 MDT `npm run check:notification-readiness` remained non-sending/non-mutating, parseable, and blocked: saved-search alert notification is `watch`, property-inquiry notification is `blocked`, and aggregate launch notification readiness is `blocked`. `npm run check:launch-readiness` exited blocked as expected with Supabase connectivity `ready`, saved-search alert email `watch`, property-inquiry notification email `blocked`, 197 pending alert rows, 0 failed rows, and 0 processing rows.
- June 20 13:11 MDT `npm run check:notification-readiness:strict` stayed non-sending/non-mutating and failed closed as expected with `strictMode=true`, `commandSuccess=true`, `success=false`, saved-search alert notification `watch`, property-inquiry notification `blocked`, and aggregate launch notification readiness `blocked`.
- June 20 13:34 MDT `npm run check:notification-readiness:strict-contract` passed, stayed non-sending and non-mutating, confirmed the current environment exits blocked, confirmed the dummy-recipient plus `PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN=true` scenario exits blocked, confirmed both direct property-inquiry and aggregate dry-run blockers are detected, and confirmed the aggregate launch-readiness reply-to warning remains aligned.
- June 20 13:46 MDT `npm run check:property-inquiry-notification:readiness` and `npm run check:launch-readiness` stayed non-sending and non-mutating and exited blocked as expected. Supabase connectivity is `ready`, saved-search alert email is `watch`, property-inquiry notification email is `blocked`, the queue still has 197 pending alert rows / 0 failed / 0 processing, and the only hard notification blocker remains missing `PROPERTY_INQUIRY_NOTIFY_TO` with `REIE_INTERNAL_EMAIL` unset.
- June 20 13:48 MDT `npm run check:alert-notification-readiness` stayed non-sending and non-mutating and remained `watch` with 197 pending saved-search alert rows, 0 failed rows, 0 processing rows, built-in sender fallback in use, no explicit reply-to, `RESEND_API_KEY` present, and HTTPS public links configured. `npm run run:alerts:dry -- --limit 50` scanned 50 pending alert rows, previewed 50 ready-to-send rows, sent 0, skipped 0, failed 0, and mutated no rows.
- June 20 13:50 MDT `npm run run:crm:pending -- --limit 20` and `npm run run:crm:all -- --limit 50` remained read-only, kept CRM readiness at `watch`, and show one pending `strategy_intake` task (`751fa51e-4a2e-411f-97df-c320e974e058`) for masked `co***@example.com`, priority `medium`, heat score 9, alert readiness `unknown`, and empty market/timeline/intent/next-action fields. CRM closure audit remains clean with 0 closed tasks and 100% closure-review coverage because no tasks are closed.
- June 20 13:59 MDT `npm run run:mls-sync:dry` completed successfully with `dryRun=true`, `executed=false`, `maxPages=1`, `pageSize=5`, `startPage=0`, `pageTimeoutMs=30000`, and confirmed no MLS Grid request was made.
- June 20 14:03 MDT `npm run check:notification-readiness` remained non-sending and non-mutating, returned parseable blocked readiness, summarized saved-search alert notification at `watch`, property-inquiry notification at `blocked`, and aggregate launch notification readiness at `blocked`, and surfaced the failed `PROPERTY_INQUIRY_NOTIFY_TO` check plus saved-search sender/reply-to/pending-row warnings.
- June 20 14:09 MDT `npm run check:notification-readiness:strict` stayed non-sending and non-mutating and failed closed as expected with `strictMode=true`, `commandSuccess=true`, `success=false`, saved-search alert notification `watch`, property-inquiry notification `blocked`, and aggregate launch notification readiness `blocked`. `npm run check:notification-readiness:strict-contract` passed and confirmed the current env exits blocked, dummy-recipient plus `PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN=true` exits blocked, direct property-inquiry and aggregate dry-run blockers are detected, and the aggregate launch-readiness reply-to warning remains aligned.
- June 20 14:14 MDT `npm run check:fast` passed: worker output rebuilt, property-inquiry missing-recipient and dry-run suppression checks passed, saved-search alert readiness remained `watch` with 197 pending / 0 failed / 0 processing, consolidated notification readiness remained blocked by missing property-inquiry recipient routing, strict-contract validation passed, bounded MLS sync dry-run remained non-executing with no MLS Grid request, and `npm run typecheck` plus `npm run lint` passed with no lint warnings or errors.
- June 20 15:19 MDT `npm run build` passed: Next compiled successfully, completed lint/type validation inside the build pipeline, collected page data, generated 130 static pages, finalized page optimization, and collected build traces.
- June 20 22:27 MDT `npm run supabase:check:json` passed with readiness `ready`: Supabase URL/key shape, placeholder scan, project-ref consistency, Postgres URL shape, project DNS, Postgres DNS, TCP, Prisma `SELECT 1`, and Supabase REST all passed with no failed checks.
- June 20 15:50 MDT started a temporary local Next dev server on `http://localhost:3000`, ran `npm run smoke:mls-status`, `npm run smoke:search`, and `npm run smoke:ops`, then stopped the server. A follow-up `lsof -nP -iTCP:3000 -sTCP:LISTEN` check confirmed `localhost:3000` was clear.
- Earlier June 20 preflight/build refreshes passed `npm run check:notification-readiness:strict-contract`, `npm run build`, `npm run supabase:check:json`, and follow-up queue-dashboard checks. The production build generated 130 static pages; no live worker was started, no email was sent, no alert rows were mutated, and no MLS Grid request was made.
- June 20 11:35 MDT `npm run check:launch-readiness` reran the non-sending/non-mutating launch gate and exited blocked as expected: Supabase connectivity is `ready`, saved-search alert email is `watch`, property-inquiry notification email is `blocked`, there are 197 pending alert rows, 0 failed rows, and 0 processing rows, and the only hard blocker remains missing `PROPERTY_INQUIRY_NOTIFY_TO` with `REIE_INTERNAL_EMAIL` unset.
- June 20 11:37 MDT `npm run check:notification-readiness:strict-contract` passed again without sending email or mutating rows, confirming the current env fails closed, dummy-recipient plus `PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN=true` fails closed, aggregate dry-run blockers are detected, and the aggregate reply-to warning remains aligned. `npm run check:property-inquiry-notification:readiness` exited blocked as expected because `PROPERTY_INQUIRY_NOTIFY_TO` is missing and `REIE_INTERNAL_EMAIL` is unset.
- June 20 11:46 MDT `npm run check:alert-notification-readiness` remained `watch` with 197 pending saved-search alert rows, 0 failed rows, 0 processing rows, built-in sender fallback in use, and no explicit reply-to. `npm run run:alerts:dry -- --limit 50` scanned 50 pending alert rows, previewed 50 ready-to-send rows, sent 0, skipped 0, failed 0, and mutated no rows.
- June 21 06:27 MDT read-only CRM refreshes with `npm run run:crm:pending -- --limit 20` and `npm run run:crm:all -- --limit 50` showed the same single pending `strategy_intake` task and a clean closure audit.
- Earlier June 20 protected MLS dry-run refreshes also completed with `dryRun=true`, `executed=false`, and no MLS Grid request.
- The latest full runtime smoke loop is June 21, 2026 10:21 MDT: `npm run smoke:ops` passed against a temporary local dev server after MLS photo media hardening, and the server was stopped afterward. The latest separate `npm run smoke:mls-status` and `npm run smoke:search` refresh remains June 21 08:16 MDT.
- In that runtime loop, `npm run smoke:mls-status` returned HTTP 200 with no endpoint diagnostics, MLS status `busy`, operational readiness `watch`, search-index health `healthy`, stale inventory at 100% by `lastIntelligenceSync`, `mls-sync`, `mls-page`, and `listings` drained, and `reie-alerts` at 273 waiting jobs.
- In that runtime loop, `npm run smoke:search` returned HTTP 200 with public search source `typesense`, health `healthy`, 5 returned / 5 mapped / 0 coordinate-filtered, `meta.smoke.ready=true`, and `found=15277`.
- June 21 08:16 MDT runtime smoke reports no failed jobs, no open dead-letter jobs, no stale active jobs, `mls-sync` drained at 0 waiting / 637 completed, `mls-page` drained at 0 waiting / 5911 completed, `listings` drained at 0 waiting, and `reie-alerts` at 273 waiting.
- June 20 20:57 MDT `npm run check:notification-readiness:strict-contract` passed, stayed non-sending and non-mutating, confirmed the current environment exits blocked, confirmed the dummy-recipient plus `PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN=true` scenario exits blocked, confirmed both direct property-inquiry and aggregate dry-run blockers are detected, and confirmed the aggregate launch-readiness reply-to warning remains aligned.
- June 20 21:11 MDT `npm run check:property-inquiry-notification:readiness` stayed non-sending and non-mutating and exited blocked as expected. `PROPERTY_INQUIRY_NOTIFY_TO` is missing with fallback `REIE_INTERNAL_EMAIL` unset; `RESEND_API_KEY`, sender resolution, `NEXT_PUBLIC_SITE_URL`, and disabled/unset `PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN` checks pass, while missing `RESEND_REPLY_TO_EMAIL` remains a warning.
- June 20 21:37 MDT `npm run check:alert-notification-readiness` stayed non-sending and non-mutating and remained `watch` with 197 pending saved-search alert rows, 0 failed rows, 0 processing rows, built-in sender fallback in use, no explicit reply-to, `RESEND_API_KEY` present, HTTPS public links configured, and sampled recipients unsubscribed=false.
- June 20 21:48 MDT `npm run check:notification-readiness` stayed non-sending and non-mutating, returned `success=true` with parseable `readiness.level="blocked"`, and summarized saved-search alert notification at `watch`, property-inquiry notification at `blocked`, and aggregate launch notification readiness at `blocked`.
- June 20 22:15 MDT `npm run check:notification-readiness:strict` stayed non-sending and non-mutating, failed closed as expected with `strictMode=true`, `commandSuccess=true`, `success=false`, saved-search alert notification at `watch`, property-inquiry notification at `blocked`, and aggregate launch notification readiness at `blocked`.
- June 20 22:26 MDT `npm run check:launch-readiness` rebuilt worker output, stayed non-sending and non-mutating, and exited blocked as expected. Supabase connectivity is `ready`, saved-search alert email is `watch` with 197 pending / 0 failed / 0 processing, and property-inquiry notification email is `blocked` because `PROPERTY_INQUIRY_NOTIFY_TO` is missing with fallback `REIE_INTERNAL_EMAIL` unset.
- June 20 22:47 MDT `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000` completed cleanly with no diagnostics, no failed jobs, no open dead-letter jobs, no stale active jobs, `mls-sync` drained at 0 waiting / 637 completed, `mls-page` drained at 0 waiting / 5911 completed, `listings` drained at 0 waiting, and `reie-alerts` busy with 273 waiting.
- June 21 08:12 MDT `npm run check:fast` passed: worker output rebuilt, property-inquiry missing-recipient and dry-run suppression checks passed, saved-search alert readiness remained `watch` with 197 pending / 0 failed / 0 processing, consolidated notification readiness remained blocked by missing property-inquiry recipient routing, strict-contract validation passed, bounded MLS sync dry-run remained non-executing with no MLS Grid request, and `npm run typecheck` plus `npm run lint` passed with no ESLint warnings or errors.
- June 21 08:14 MDT `npm run build` passed: Next compiled successfully, completed lint/type validation inside the build pipeline, collected page data, generated 130 static pages, finalized page optimization, and collected build traces.
- June 21 04:08 MDT `npm run check:notification-readiness`, `npm run check:notification-readiness:strict`, `npm run check:property-inquiry-notification:readiness`, and `npm run check:notification-readiness:strict-contract` stayed non-sending and non-mutating. Consolidated readiness remained blocked with saved-search alert notification at `watch`, property-inquiry notification at `blocked`, and aggregate launch notification readiness at `blocked`; strict mode failed closed as expected; direct property-inquiry readiness stayed blocked only by missing `PROPERTY_INQUIRY_NOTIFY_TO` with fallback `REIE_INTERNAL_EMAIL` unset; strict-contract validation passed and confirmed the current env and dummy-recipient dry-run scenario both fail closed.
- June 21 04:17 MDT `npm run check:launch-readiness` rebuilt worker output, stayed non-sending and non-mutating, and exited blocked as expected. Supabase connectivity is `ready`, saved-search alert email is `watch` with 197 pending / 0 failed / 0 processing rows, and property-inquiry notification email is `blocked` because `PROPERTY_INQUIRY_NOTIFY_TO` is missing with fallback `REIE_INTERNAL_EMAIL` unset.
- June 21 07:31 MDT `npm run supabase:check:json` passed with readiness `ready`: Supabase URL/key shape, placeholder scan, project-ref consistency, Postgres URL shape, project DNS, Postgres DNS, TCP, Prisma `SELECT 1`, and Supabase REST all passed with no failed checks.
- `npm run check:notification-readiness`, `npm run check:notification-readiness:strict`, `npm run check:notification-readiness:strict-contract`, `npm run check:property-inquiry-notification:readiness`, and `npm run check:launch-readiness` remain non-sending/non-mutating and blocked only by missing `PROPERTY_INQUIRY_NOTIFY_TO` with `REIE_INTERNAL_EMAIL` unset. Supabase connectivity is ready with the latest `npm run supabase:check:json` refresh at June 21 07:31 MDT, saved-search alert email is `watch`, property-inquiry notification email is `blocked`, the latest consolidated notification readiness refresh is June 21 04:08 MDT, the latest strict notification readiness refresh is June 21 04:08 MDT, the latest strict notification readiness contract refresh is June 21 04:08 MDT, the latest direct property-inquiry readiness refresh is June 21 04:08 MDT, and the latest aggregate launch readiness refresh is June 21 04:17 MDT.
- Saved-search alert readiness remains `watch` with 197 pending saved-search alert rows, 0 failed rows, 0 processing rows, built-in sender fallback in use, no explicit reply-to, the latest readiness refresh at June 21 06:06 MDT, and the latest dry-run preview at June 21 06:06 MDT scanned 50 rows / previewed 50 ready-to-send rows / sent 0 / skipped 0 / failed 0.
- MLS dry-run remains protected and non-executing. The latest June 21 06:50 MDT refresh used `dryRun=true`, `executed=false`, `maxPages=1`, `pageSize=5`, `startPage=0`, and `pageTimeoutMs=30000`, and confirmed no MLS Grid request was made. The latest timeout-bounded queue dashboard refresh is June 21 06:50 MDT.
- June 21 06:27 MDT `npm run run:crm:pending -- --limit 20` and `npm run run:crm:all -- --limit 50` remained read-only, scanned one pending `strategy_intake` task (`751fa51e-4a2e-411f-97df-c320e974e058`) for masked `co***@example.com`, priority `medium`, heat score 9, alert readiness `unknown`, empty market/timeline/intent/next-action fields, readiness `watch`, and a clean closure audit with 0 closed tasks and 100% closure-review coverage.
- `docs/email-system.md` now explicitly lists `PROPERTY_INQUIRY_NOTIFY_TO`, fallback `REIE_INTERNAL_EMAIL`, and `PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN` in the provider section, production requirements, and safety rules.

## Verification Baseline

Run from **Terminal 5: Scripts / curl testing** after meaningful changes:

```bash
npm run worker:build
npm run supabase:check:json
npm run run:mls-sync:dry
npm run typecheck
npm run lint
npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000
npm run run:seed:quick:dry
npm run run:seed:test:dry
npm run build
```

If `npm run supabase:check:json` reports blocked, stop before Supabase-backed dry-runs, seed checks, CRM scheduler reporting, reindexing, or live database work.

Run script help checks after alert, digest, CRM, or worker script changes:

```bash
npm run worker:build
npm run run:alerts -- --help
npm run run:digest -- --help
npm run run:crm -- --help
npm run run:crm:scheduler
node dist/workers/runCRMTasks.js --help
```

Run operational smoke checks from **Terminal 5: Scripts / curl testing** while Terminal 1 is running:

```bash
npm run smoke:mls-status
npm run smoke:search
npm run smoke:ops
```

`npm run smoke:ops` checks MLS status, retry/dead-letter status, public search, `/api/admin/control-state`, `/api/admin/intake-signals?limit=6`, alert status, consolidated notification readiness, direct saved-search alert notification readiness, direct property-inquiry notification readiness, aggregate launch readiness, and the public experience smoke. It sends `x-admin-key` automatically when `REIE_ADMIN_API_KEY` or `ADMIN_API_KEY` is configured.

Equivalent raw curl checks:

```bash
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/status"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/search?limit=5"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/retry"
curl --max-time 8 -X POST -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/retry?queue=all&dryRun=true&limit=25"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/dead-letter?limit=5"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/dead-letter?states=waiting,delayed,failed&limit=25"
curl --max-time 20 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/process-alerts?dryRun=true&limit=5"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks?status=active&limit=6" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks?status=all&limit=20" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks/<task-id-from-list-response>" -H "x-admin-key: $REIE_ADMIN_API_KEY"
```

If an admin key is configured locally, send it in the request:

```bash
curl --max-time 8 -s -H "x-admin-key: $REIE_ADMIN_API_KEY" -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/status"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/search?limit=5"
```

If curl returns `HTTP_STATUS:000`, start or restart **Terminal 1: Next.js app**:

```bash
npm run dev
```

## Typesense Repair Sequence

Use after schema changes or when build logs say the local `listings` collection is stale.

Start Docker infrastructure from **Terminal 4: Docker / Typesense**:

```bash
npm run infra:up
```

Compile scripts and recreate canonical collections from **Terminal 5: Scripts / curl testing**:

```bash
npm run worker:build
npm run typesense:init
```

After `npm run supabase:check:json` reports readiness, reindex from **Terminal 5: Scripts / curl testing**:

```bash
npm run supabase:check:json
npm run typesense:reindex
```

If Supabase is unreachable and only schema repair is needed, stop after `npm run typesense:init`, then confirm with:

```bash
npm run build
```

Inspection and legacy compatibility commands from **Terminal 5: Scripts / curl testing**:

```bash
npm run typesense:collections:check
npm run typesense:collections
npm run typesense:reset-collections
```

Use `npm run typesense:init` as the primary local schema repair command.

## Seed Commands

Run seed commands from **Terminal 5: Scripts / curl testing** after `npm run worker:build` and `npm run supabase:check:json` report readiness.

Safe dry-runs:

```bash
npm run run:seed:quick:dry
npm run run:seed:test:dry
```

Controlled writes with Typesense indexing:

```bash
npm run run:seed:quick
npm run run:seed:test
```

Controlled database/photo writes without Typesense indexing:

```bash
npm run run:seed:quick:no-index
npm run run:seed:test:no-index
```

Seed rules:

- Dry-runs are read-only, but they still require `npm run supabase:check:json` readiness because seed inventory checks touch Supabase.
- Live and no-index seed write commands require `npm run supabase:check:json` readiness before any database rows are written.
- Indexed seed commands require Typesense to be running with canonical `properties` and `listings` schemas.
- Seed scripts create or update bounded `Property` rows and replace their own `PropertyPhoto` rows.
- Seed scripts report database, photo, and per-collection Typesense status.
- Seed scripts should not be scheduled or run from public app code.
- Real MLS media remains the production source for live listing imagery.

## Safe MLS Commands

Queue a bounded sync dry-run from **Terminal 5: Scripts / curl testing** while Terminal 1 is running:

```bash
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/sync?maxPages=1&pageSize=5&startPage=0&pageTimeoutMs=30000&dryRun=true"
```

Compatibility route dry-run:

```bash
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls-sync?maxPages=1&pageSize=5&startPage=0&pageTimeoutMs=30000&dryRun=true"
```

Run a bounded direct script sync from **Terminal 5: Scripts / curl testing**:

```bash
npm run run:mls-sync:dry
npm run run:mls-sync -- --json --max-pages=1 --page-size=5 --start-page=0 --page-timeout-ms=30000
npm run run:mls-sync -- --execute --json --max-pages=1 --page-size=25 --start-page=0 --page-timeout-ms=30000
npm run run:mls-sync:help
```

Queue a bounded live sync from **Terminal 5: Scripts / curl testing** only after dry-run/status/retry/dead-letter inspection:

```bash
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/sync?maxPages=1&pageSize=5&startPage=0&pageTimeoutMs=30000&execute=true"
```

Run the compatibility entrypoint in no-write mode from **Terminal 5: Scripts / curl testing**:

```bash
node dist/scripts/fetchMLS.js
```

Run the compatibility entrypoint through the active sync pipeline from **Terminal 5: Scripts / curl testing**:

```bash
node dist/scripts/fetchMLS.js --sync --max-pages=1 --page-size=5 --start-page=0 --page-timeout-ms=30000
```

Read MLS operations status from **Terminal 5: Scripts / curl testing**:

```bash
npm run smoke:mls-status
```

Check Search Smoke Readiness from **Terminal 5: Scripts / curl testing**:

```bash
npm run smoke:search
```

Expected Search Smoke Readiness is `meta.smoke.ready=true` with no `meta.smoke.blockers`.

Use raw curl only when inspecting HTTP status output, protected-route auth, or one-off API behavior.

Treat search-index diagnostics in `/api/mls/status` as real blockers for reliable public search. Recent completed jobs that report `indexFailed > 0`, `searchIndexIndexed=false`, or processed records with no indexing attempt should be investigated before increasing sync volume.

Preview retry from **Terminal 5: Scripts / curl testing**:

```bash
curl --max-time 8 -s -X POST -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/mls/retry?queue=all&dryRun=true&limit=25"
```

Use targeted queue/job retry when possible. Broad live retry across queues requires `allowAllLive=true` and should remain exceptional.

## Production Scheduler Rollout

Rollout order:

1. Supabase JSON readiness gate: `npm run supabase:check:json`.
2. MLS sync dry-run or smallest bounded live sync: `npm run run:mls-sync -- --execute --json --max-pages=1 --page-size=25 --start-page=0 --page-timeout-ms=30000`.
3. Search-index result review from sync output, worker results, `npm run smoke:mls-status`, and `/admin`.
4. `npm run smoke:search` Search Smoke Readiness verification for source, `meta.source`, health, access level, filters, bounds state, returned count, mapped count, coordinate-filtered count, duration, and `meta.smoke.ready=true` with no blockers.
5. Timeout-bounded queue diagnostics through `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000`.
6. Large programmatic content batch publication gate verification after `npm run supabase:check:json` reports readiness for data, metadata, canonical structure, indexing behavior, Search Smoke Readiness, and timeout-bounded queue diagnostics before MLS-backed public expansion.
7. MLS sync recurring schedule.
8. CRM reporting.
9. Alert dry-run.
10. Internal alert live test.
11. Alert live schedule.
12. Digest dry-run.
13. Internal digest live test.
14. Digest live schedule.
15. Manual Typesense repair and reindex only when required.

Conservative starting schedule:

| Job | Cadence | Command |
| --- | --- | --- |
| MLS sync dry-run | hourly during validation | `npm run run:mls-sync -- --json --max-pages=1 --page-size=5 --start-page=0 --page-timeout-ms=30000` |
| MLS sync live | hourly after approval | `npm run run:mls-sync -- --execute --json --max-pages=1 --page-size=25 --start-page=0 --page-timeout-ms=30000` |
| Alert processing dry-run | every 30 minutes during validation | `npm run run:alerts:dry -- --limit 50` |
| Alert processing live | every 30 minutes after approval | `npm run run:alerts:live -- --limit 50` |
| Digest processing | daily or weekly after approval | `npm run run:digest -- --limit 50` |
| CRM reporting | daily business morning | `npm run run:crm:scheduler` |
| Typesense schema repair | manual only | `npm run typesense:init` |
| Typesense reindex | manual only after `npm run supabase:check:json` readiness | `npm run typesense:reindex` |
| Seed scripts | not scheduled | manual controlled use only |

## Alert, Digest, And CRM Commands

Alert checks from **Terminal 5: Scripts / curl testing**:

```bash
npm run run:alerts -- --help
npm run run:alerts:dry
npm run run:alerts:live -- --limit 25
npm run run:worker:alerts:once
npm run run:worker:alerts:once:live
```

Digest checks from **Terminal 5: Scripts / curl testing**:

```bash
npm run run:digest -- --help
npm run run:digest:dry -- --limit 25
```

CRM checks from **Terminal 5: Scripts / curl testing**:

```bash
npm run run:crm -- --help
npm run run:crm:active
npm run run:crm:pending
npm run run:crm:reviewing
npm run run:crm:all
npm run run:crm:scheduler
node dist/workers/runCRMTasks.js --help
node dist/workers/runCRMTasks.js --limit 20 --status active
```

Terminal 5 CRM reports are read-only and should include `audit` plus `readiness` output. Use `npm run run:crm:scheduler` for recurring production scheduler jobs. Use `npm run run:crm:active` for manual Terminal 5 operator review when human-readable output is preferred. The `readiness.level` value should match the same `ready`, `watch`, or `blocked` contract used by `/api/admin/crm-tasks`.

Before enabling the first recurring CRM provider schedule, follow the CRM first-live scheduler test in `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/production-scheduler-plan.md`.

CRM admin API checks from **Terminal 5: Scripts / curl testing** while Terminal 1 is running:

```bash
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks?status=active&limit=6" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks?status=all&limit=20" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks/<task-id-from-list-response>" -H "x-admin-key: $REIE_ADMIN_API_KEY"
```

CRM admin API responses should include `success`, `generatedAt`, `terminal`, `inspectionSource`, `route`, and `command` on success and error responses, plus `task` or `tasks` on successful reads. The list route should also include `summary`, `audit`, and `readiness` on successful reads. Use the list route to verify `inspectionSource: "List Route"` and the detail route to verify `inspectionSource: "Detail Route"` after Review, Complete, or Dismiss actions, including failed detail-route attempts, before the visible Source transitions back to `List Route`.

Use `/admin` for human review. CRM task completion and dismissal require a review note, closure audit coverage should remain at 100% after new closures, and the CRM API Inspection panel should show readable Terminal 5 API and scheduler command blocks with API-provided `List Route` metadata returning after `Detail Route` review actions while preserving failed detail-route evidence when a request fails.

Expected CRM readiness levels:

- `ready`: closure audit is clean and no active CRM task blockers were detected.
- `watch`: closure audit is clean but active review work or incomplete alert criteria need attention.
- `blocked`: closed CRM tasks are missing review notes.

Only run Supabase-backed dry-runs after `npm run supabase:check:json` reports readiness.

## Admin Dead-Letter Commands

Open after Terminal 1 is running:

```text
http://localhost:3000/admin/dead-letter
```

Inspect from **Terminal 5: Scripts / curl testing**:

```bash
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/dead-letter?limit=25"
```

Production requests require `REIE_ADMIN_API_KEY` or `ADMIN_API_KEY`:

```bash
curl --max-time 8 -s -H "x-admin-key: $REIE_ADMIN_API_KEY" -w "\nHTTP_STATUS:%{http_code}\n" "https://davidquinngroup.com/api/admin/dead-letter?limit=25"
```

## Legacy MLS Cleanup Status

The legacy MLS helper cleanup pass is complete:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/scripts/fetchMLS.ts` wraps `syncMLSGrid()` as a compatibility entrypoint.
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/mls/upsertListing.ts` owns useful GC-forensics mapping from the old normalizer.
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/docs/legacy-mls-cleanup-plan.md` is the cleanup completion record.

Deleted legacy files:

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

Current deletion candidates:

- None in the confirmed dead-helper pass.

## Hard Rules

- Never run unbounded MLS syncs.
- Keep heavy MLS, alert, email, indexing, CRM, seed writes, and retry work outside page rendering.
- Use `dryRun=true` or `npm run run:mls-sync:dry` before live MLS work.
- Direct `node dist/scripts/mlsSync.js` defaults to dry-run.
- Use `execute=true`, `dryRun=false`, `--execute`, or `--live` for intentional live MLS syncs; scheduler live commands should still include explicit page, page-size, start-page, JSON, and page-timeout bounds.
- Keep `pageTimeoutMs` / `--page-timeout-ms` explicit for scheduled or API-triggered syncs.
- Use `force=true` only after inspecting status, retry, failed jobs, and dead-letter records.
- Treat `npm run supabase:check:json`, search-index health, Search Smoke Readiness, and timeout-bounded queue diagnostics as production-readiness gates before increasing ingestion volume, MLS volume, scheduler cadence, recurring scheduler activation, recurring email traffic, live-inventory claims, MLS-backed public expansion, or large programmatic content batch publication.
- Use `npm run supabase:check:json` and `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000` before retry, scheduler, recurring email traffic, alert, digest, live-inventory, MLS-backed public expansion, content-planning, large programmatic content batch publication, or MLS-volume decisions.
- Treat `npm run supabase:check:json`, search-index health, Search Smoke Readiness, indexing behavior, and timeout-bounded queue diagnostics as gates before live-inventory claims, MLS-backed public expansion, or large programmatic content batch publication.
- Treat Supabase/Postgres as the source of truth.
- Treat Typesense as a rebuildable search index.
- Keep `properties` and `listings` Typesense schemas compatible.
- Treat search-index failures and timeout-bounded queue diagnostics as operational diagnostics, not silent warnings.
- Preserve existing listing photos when MLS returns no usable media, and reject non-image MLS media before replacement.
- Keep alert, digest, and seed dry-runs read-only, but do not run them until `npm run supabase:check:json` reports readiness.
- Do not schedule recurring email traffic, including recurring alert, digest, or property-inquiry notification sends, until `PROPERTY_INQUIRY_NOTIFY_TO` or fallback `REIE_INTERNAL_EMAIL` is configured, `PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN` is unset or false, `npm run supabase:check:json`, sender domain, unsubscribe, tracking, internal live-send tests, `npm run smoke:mls-status` search-index health, `npm run smoke:search` Search Smoke Readiness, and timeout-bounded queue diagnostics are verified.
- Treat failed `npm run supabase:check:json`, missing property-inquiry recipient routing, `PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN=true`, degraded search-index health, `meta.smoke.ready=false`, public search smoke blockers, or unacceptable timeout-bounded queue diagnostics as live-send blockers for recurring email traffic.
- Allow large programmatic content batch publication only after `npm run supabase:check:json`, data, metadata, canonical structure, indexing behavior, Search Smoke Readiness, and timeout-bounded queue diagnostics are verified.
- Live alert sends should claim work with `pending -> processing -> sent`.
- Keep unsubscribe idempotent.
- Keep tracked redirects safe.
- Keep CRM task completion human-reviewed through the admin CRM task review flow.
- Require a review note before marking CRM tasks `completed` or `dismissed`.
- Keep CRM closure audit coverage visible in `/admin` and `/api/admin/crm-tasks`.
- Treat CRM `readiness.level=blocked` as a scheduler cadence or automation blocker until closed tasks have review notes.
- Preserve unrelated user work.

## Current Near-Term Sequence

1. Configure `PROPERTY_INQUIRY_NOTIFY_TO` or `REIE_INTERNAL_EMAIL`, then rerun `npm run check:alert-notification-readiness`, `npm run check:notification-readiness`, `npm run check:notification-readiness:strict`, `npm run check:notification-readiness:strict-contract`, `npm run check:property-inquiry-notification:readiness`, and `npm run check:launch-readiness`.
2. Run one internal tracked email click before recurring scheduler activation or recurring email traffic.
3. Review the pending active CRM `strategy_intake` task before increasing CRM scheduler cadence.
4. Monitor or drain `reie-alerts` waiting work before increasing scheduler, retry, or live-send volume; `mls-page` is currently drained but should stay in the pre-launch queue dashboard loop.
5. Keep Supabase readiness, search-index health, Search Smoke Readiness, combined ops smoke, `npm run check:fast`, timeout-bounded queue diagnostics, alert dry-runs, CRM readiness checks, lint, and build in the pre-launch verification loop.
6. Continue MLS ingestion hardening by validating real MLS media payload shapes during the next bounded dry-run before increasing sync volume.
7. Expand timeout-bounded admin queue, sync, alert, digest, and CRM completion workflows.
8. Continue public search/map/listing polish and placeholder media replacement.
9. Strengthen city, neighborhood, property, article, and market authority surfaces through large programmatic content batch publication gated by `npm run supabase:check:json`, data, metadata, canonical structure, indexing behavior, Search Smoke Readiness, and timeout-bounded queue diagnostics.
10. Choose production schedulers for MLS sync, alerts, digests, and CRM reporting.
11. Decide production Redis and Typesense providers.
12. Load-test production-size MLS ingestion before increasing sync volume.

<!-- /Users/davidquinn/david-quinn-group/colorado-real-estate/docs/CHAT_START.md -->
