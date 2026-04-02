You are helping me build a production real estate platform.

## 🔗 System Architecture

- Engineering System: /PROJECT_SYSTEM.md

==============================
PROJECT BRAIN — CONTEXT CAPTURE
===============================

**Start Date:** 2026-03-31
**End Date (handoff):** 2026-03-31
**Active Work Time:** ~6–8 hours

---

## 🧱 1. PROJECT SNAPSHOT (CURRENT STATE)

**Worked On:**

* MLS ingestion pipeline (BullMQ + Redis)
* Rate limiting (global + adaptive)
* FlowProducer job orchestration
* Sync tracking (Supabase)
* Admin dashboard (status + retry)
* Alert system (Slack-ready)
* Typesense setup (partial)
* Queue architecture stabilization
* Fixing MLS API suspension issues

**Functional:**

* End-to-end MLS ingestion (queue → worker → DB)
* Global rate limiting (BullMQ limiter)
* Adaptive throttling (dynamic delay)
* Sync run tracking in DB
* Retry failed jobs via dashboard
* Alert triggers (console + Slack-ready)
* Admin dashboard UI

**Partially Complete:**

* Typesense indexing (client + schema started, not fully wired)
* Adaptive limiter tuning
* Dashboard (basic, not full ops UI)
* Flow completion tracking (basic, not fully robust)

**Broken / Uncertain:**

* Incremental sync not implemented yet
* Typesense not running (Docker missing)
* Tailwind/PostCSS config unstable earlier
* MLS API currently rate-limited / warned
* Coordinator still uses fixed page count (not dynamic)

---

## 🏗️ 2. SYSTEM ARCHITECTURE (UPDATED)

### MLS Ingestion System

**Flow:**

1. API triggers sync job
2. Coordinator (mlsWorker) creates Flow (parent job)
3. Enqueues page jobs (NO API calls)
4. Page Worker:

   * Applies adaptive delay
   * Calls MLS API
   * Processes listings
   * Writes to Supabase
   * Updates sync state
   * Sends alerts on failure

**Constraints:**

* ONLY page worker calls MLS API
* Global rate limit enforced (BullMQ)
* Adaptive limiter adjusts delay dynamically

---

### Alert System

* Central `sendAlert()` function
* Sends:

  * Console logs
  * Slack webhook (if configured)

**Triggers:**

* Page failure
* Sync failure
* Partial failure (failed_pages > 0)

---

### Email System

* Not touched in this chat
* Exists but unchanged

---

### Queue System (BullMQ)

* Queues:

  * `mls-sync` (coordinator)
  * `mls-page` (workers)
* FlowProducer:

  * Parent-child job structure
* Global limiter:

```ts
limiter: {
  max: 1,
  duration: 600
}
```

---

### Frontend (UI / Pages)

* `/admin/mls`

  * Live polling dashboard
  * Progress bar
  * Failure indicator
  * Retry button

---

### API Layer

* `/api/mls/sync` → enqueue sync job
* `/api/mls/status` → returns latest sync run
* `/api/mls/retry` → retries failed jobs

---

### Database (Supabase)

Table: `mls_sync_runs`

* id
* started_at
* completed_at
* status
* total_pages
* processed_pages
* failed_pages
* error

Listings table:

* mls_id (unique)
* address
* price
* updated_at
* raw (jsonb)

---

## 🗂️ 3. FILES CREATED / MODIFIED

### `/workers/mlsWorker.ts`

* Coordinator (NO API calls)
* Builds FlowProducer jobs
* Tracks sync run
* Handles completion + failure

---

### `/workers/mlsPageWorker.ts`

* ONLY MLS API caller
* Adaptive rate limiting
* Processes listings
* Updates sync state
* Sends alerts

---

### `/lib/queue/mlsQueue.ts`

* Central Redis connection
* Queue definitions
* Global rate limiter

---

### `/lib/mls/adaptiveLimiter.ts`

* Dynamic delay system
* Success/failure tracking
* Backoff logic

---

### `/lib/mls/syncState.ts`

* Create/update sync runs
* Increment counters

---

### `/lib/alerts/sendAlert.ts`

* Slack + console alert system

---

### `/app/api/mls/status/route.ts`

* Returns latest sync run + progress

---

### `/app/api/mls/retry/route.ts`

* Retries failed BullMQ jobs

---

### `/app/admin/mls/page.tsx`

* Dashboard UI
* Live polling
* Retry button
* Failure indicators

---

### `/lib/typesense/client.ts`

* Typesense client setup (partial)

---

### `/scripts/initTypesense.ts`

* Collection creation script

---

## 🧠 4. BUSINESS LOGIC & RULES

* ONLY page worker can call MLS API
* Coordinator must NEVER fetch listings
* Max safe rate ≈ 1 request / 600ms
* Adaptive limiter:

  * Speed up after success streak
  * Slow down on errors
  * Double delay on 429
* Listings upserted by `mls_id`
* Sync only marked complete after all jobs finish
* Failures increment counters + trigger alerts
* Retry system requeues failed jobs only

---

## ⚙️ 5. ENVIRONMENT / CONFIG

**Env Variables:**

* NEXT_PUBLIC_SUPABASE_URL
* SUPABASE_SERVICE_ROLE_KEY
* REDIS_URL
* MLS_GRID_BASE_URL
* MLS_GRID_TOKEN
* SLACK_WEBHOOK_URL (optional)
* TYPESENSE_API_KEY (future)

**Services:**

* Supabase (DB)
* Redis (queue)
* BullMQ (jobs)
* MLS Grid API
* Typesense (planned)
* Slack (alerts)

---

## 🔁 6. WORKFLOWS (STEP-BY-STEP)

### MLS Ingestion Flow

1. User triggers `/api/mls/sync`
2. Job added to `mls-sync`
3. Coordinator:

   * Creates sync run
   * Builds child jobs
   * Creates Flow
4. Page workers:

   * Wait via adaptiveDelay()
   * Fetch MLS data
   * Process + upsert
   * Update counters
5. On completion:

   * Mark sync complete
   * Trigger alerts if needed

---

### Failure + Retry Flow

1. Page fails
2. incrementFailed()
3. Alert sent
4. Job marked failed
5. User clicks "Retry Failed Jobs"
6. Jobs reprocessed

---

### Dashboard Flow

1. UI polls `/api/mls/status`
2. Displays:

   * status
   * progress
   * failures
3. Retry button triggers API

---

## 🚧 7. KNOWN ISSUES / RISKS

* MLS API still rate-sensitive
* Adaptive limiter not battle-tested
* Coordinator uses static MAX_PAGES (wasteful)
* No incremental sync → high API usage
* Typesense not running (Docker missing)
* Potential duplicate ingestion without proper filtering
* No deduplication beyond mls_id

---

## 🎯 8. NEXT PRIORITIES

1. ✅ Incremental sync (CRITICAL)
2. Dynamic page discovery (remove MAX_PAGES)
3. Typesense indexing completion
4. Search UI
5. Improve dashboard (real-time + logs)
6. Add dead-letter queue
7. Add job-level observability

---

## 📏 9. STANDARDS & CONSTRAINTS (CRITICAL)

* Must use queues for ALL async work
* No API calls in coordinator
* All ingestion must be idempotent
* Must respect MLS rate limits at all times
* Global limiter REQUIRED
* No blocking operations in API routes
* All failures must be tracked + alertable

---

## 🧩 10. MISSING BUT NEEDED (GAPS)

* Incremental sync (ModificationTimestamp filter)
* Typesense full integration
* Search UI
* Dead-letter queue
* Historical analytics
* Rate limit monitoring dashboard
* Backfill strategy

---

## 🧾 11. TERMINOLOGY (NORMALIZED)

* **Listing** = MLS property record
* **Sync Run** = one ingestion cycle
* **Page Job** = batch fetch of listings
* **Coordinator** = job scheduler (no API calls)
* **Worker** = executes API + processing
* **Adaptive Limiter** = dynamic delay system
* **Flow** = parent-child job structure

---

## 🧠 12. ASSUMPTIONS MADE

* MLS Grid supports filtering by `ModificationTimestamp`
* Listings are uniquely identified by `ListingId`
* Supabase is primary DB (not Prisma despite label)
* Typesense will be used for search
* Single MLS source (no multi-MLS yet)
* API limits are strict and enforced in real-time

---

**END OF CONTEXT CAPTURE**

**NEXT TASK READY:**
➡️ **Implement incremental sync (only changed listings)**


Key rules:
- Always specify which Terminal to use
- Always return FULL file code when updating
- Always specify which file to replace with the full file name
- Always update or create code for files so it is correct and scalable architecture unless necessary to standardize
- Assume existing infrastructure is already built
- Prioritize production-grade architecture

Now here is my Project Brain:
# Atlas Platform Plan

## Project
Boulder County Real Estate Platform

Built by:
David Quinn
David Atlas

---

## Tech Stack

Next.js App Router  
Tailwind CSS  
Static SEO Pages  
Market Analytics Tools  

---

## Focus Markets

Boulder  
Louisville  
Lafayette  
Superior  
Erie  
Broomfield  
Longmont  
Westminster  
Niwot  
Brighton  

---

## Platform Features

Home Value Estimator  
Equity Calculator  
Market Dashboard  
Relocation Guides  
Neighborhood Pages  
Seller Guides  

---

## SEO Strategy

500+ city and market pages expanding to 10,000 neighborhood pages.

Authority loops connecting:

City Pages  
Neighborhood Pages  
Market Reports  
Buyer/Seller Guides  

Goal: Rank #1 for Boulder housing market searches and all focused markets within my servicable territory.

---

## Compliance

Atlas Compliance Review before publishing pages.

Includes review for:

Fair Housing language  
Steering language  
School references  
Market claim accuracy

---

## Lead Funnels

Relocation Leads  
Seller Valuation Leads  
Market Report Subscribers  

---

## Engagement Tracking

- Click tracking via /api/track-click
- AlertQueue.clickedAt used for lead scoring
- Foundation for hot lead detection

---

## Queue System (Current)

- Database-backed queue (AlertQueue)
- Worker processes alerts (scripts/runAlerts.ts)
- Status lifecycle: pending → sent → failed

---

## Future Upgrade

- BullMQ + Redis for horizontal scaling

---

## Alert Data Model

- Alerts use payload JSON as source of truth
- Decoupled from Property table
- Enables flexible email generation
- Supports future multi-listing/digest emails

---

## Platform Goal

Build the leading independent real estate knowledge platform for Boulder County.

- Always use pooled connection (port 6543) for development
- Do NOT rely on DIRECT_URL locally
- Direct connections may fail due to network restrictions
- Prisma db push should always succeed via pooled connection

- Always specify terminal number when running commands
- Never overwrite files without reviewing existing code first
- Always provide full file replacements when updating

UI Inspiration:
https://patrickbrowngroup.com/

Goals:
- Luxury feel
- Clean spacing
- High-end typography
- Smooth transitions
- Premium real estate aesthetic

If schema changes do not appear in DB:

1. rm -rf node_modules/.prisma
2. npx prisma generate
3. npx prisma db push --force-reset

## ⚠️ Supabase + Prisma Rule

- Pooled connection (6543) CANNOT run schema changes
- Direct connection (5432) is REQUIRED for db push

Fix:
DATABASE_URL=$DIRECT_URL npx prisma db push

## ⚠️ Prisma Env Gotcha

.env variables are NOT automatically available in shell commands.

This WILL FAIL:
DATABASE_URL=$DIRECT_URL npx prisma db push

Correct approach:
Paste full URL manually OR export variables first.

## Supabase + Prisma Rule

- Use pooler (6543) for app runtime
- DO NOT rely on Prisma db push for schema changes
- Use Supabase SQL Editor for schema changes
- Prisma is a client, not the source of truth

## AlertQueue Status

- Table created manually in Supabase
- Prisma does NOT manage schema (Supabase SQL is source of truth)
- Verified insert + select working
- Ready for queue processing integration

## DB Rule

All AlertQueue records MUST have a valid User.

Foreign key constraints are enforced:
- Cannot insert alerts without user

## Debugging Rule

Never assume IDs.

Always query:
SELECT id FROM "User";

Foreign keys require exact ID match.

Current system status:

- Prisma + Supabase connected
- AlertQueue table working
- Test data inserted successfully
- Queue processor written
- Running into module resolution issue (fix in progress)

Next goal:
→ Send real emails using Resend from AlertQueue

🔐 QUICK SECURITY NOTE (DO THIS LATER)

Since credentials were exposed:

Rotate Supabase DB password-DONE
Rotate Resend API key

(Not urgent for dev, but do before production)