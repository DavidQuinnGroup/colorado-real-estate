You are helping me build a production real estate platform.

## 🔗 System Architecture

- Engineering System: /PROJECT_SYSTEM.md


````

You are helping me build a production real estate platform.

Key rules:

* Never run unbounded loops against MLS again
* I follow all of your commands and do them in order as I read them. So please stop giving them to me twice. I don't need to know why something happens. I only need to know what my next command or code is to do. So be concise and task focused.
* Always specify which Terminal to use
* Always return FULL file code when updating
* Always specify which file to replace with the full file name
* Always update or create code for files so it is correct and scalable architecture unless necessary to standardize
* Assume existing infrastructure is already built
* Supabase is the source of truth (NOT Prisma)
* Production-grade architecture only

==============================
PROJECT BRAIN — CONTEXT CAPTURE
===============================

**Chat Start Date:** 2026-04-05
**Chat End / Transition Date:** 2026-04-05
**Active Work Duration:** ~4–6 hours

---

## 🧱 1. PROJECT SNAPSHOT (CURRENT STATE)

**Worked on:**

* Production deployment of MLS worker (Railway)
* Fixing build pipeline failures (Next.js + worker)
* Separating build-time vs runtime execution
* GitHub repo setup + Railway integration
* Environment + worker orchestration
* Eliminating Redis / API / external service build crashes

**Now Functional:**

* GitHub repo connected to Railway
* Clean Railway worker service
* Build pipeline succeeds (Next.js + worker compile)
* Worker runs from `dist/workers/main.js`
* MOCK MLS ingestion pipeline operational
* Dynamic import system prevents build-time crashes

**Partially Complete:**

* API routes still patched defensively (not fully refactored)
* Search system works but uses runtime-safe lazy loading
* Queue system partially guarded (not fully production-hardened)

**Broken / Uncertain:**

* Redis not connected in production (currently bypassed)
* Typesense / search infra not fully validated in production
* Some API routes may still contain hidden build-time risks

---

## 🏗️ 2. SYSTEM ARCHITECTURE (UPDATED)

### MLS Ingestion System

* Worker-based ingestion via Railway
* Entry: `workers/main.ts`
* Calls `syncMLSGrid({ maxRuntimeMs })`
* Supports:

  * MOCK mode (safe)
  * LIVE mode (future)
* Rate-limited via env config
* No unbounded loops (critical constraint)

---

### Alert System

* Uses queue (BullMQ)
* Worker processes listing matches
* Triggered post-ingestion
* Currently partially active (depends on Redis)

---

### Email System

* Uses Resend API
* Triggered via API routes (e.g. valuation)
* Must NOT initialize during build

---

### Queue System

* BullMQ + Redis
* Redis connection:

  * Disabled during build
  * Intended for runtime only
* Worker file:

  * `/lib/queue/worker.ts`
* Guarded with `NEXT_PHASE`

---

### Frontend (UI / Pages)

* Next.js 16 (App Router)
* Pages:

  * Listings map
  * Home valuation
  * Search
* Uses API routes for data

---

### API Layer

* Located in `/app/api/*`
* Critical fixes:

  * `export const dynamic = "force-dynamic"`
  * Runtime guards inside handlers
  * NO top-level external service imports
  * Uses lazy loading (`await import()`)

---

### Database (Prisma)

* PostgreSQL via `DATABASE_URL`
* Used for:

  * Listings
  * Users
  * Alerts
* Upserts used for idempotent ingestion

---

## 🗂️ 3. FILES CREATED / MODIFIED

### Core Worker

* `/workers/main.ts`

  * Entry point for Railway worker

* `/workers/mlsWorker.ts`

  * Calls `syncMLSGrid` with runtime config

---

### MLS Logic

* `/lib/mls/syncMLSGrid.ts`

  * Core ingestion logic
  * Handles mock + future live mode

* `/lib/mls/mockListings.ts`

  * Generates mock dataset (500 listings)

---

### Queue / Redis

* `/lib/queue/redis.ts`

  * Prevents Redis connection during build

* `/lib/queue/worker.ts`

  * Guard prevents execution during build

---

### API Fixes

* `/app/api/search/route.ts`

  * Removed top-level imports
  * Added:

    * runtime guard
    * lazy import (`await import(...)`)
    * relative path fix

---

### Config

* `/tsconfig.worker.json`

  * Ensures worker compilation to `/dist`

* `/package.json`

  * Build script:

    * `next build && tsc -p tsconfig.worker.json`

* `/next.config.ts`

  * `ignoreBuildErrors: true`

* `/railway.json`

  * Defines:

    * build command
    * start command

---

## 🧠 4. BUSINESS LOGIC & RULES

* MLS ingestion must be:

  * Rate-limited
  * Bounded (no infinite loops)
  * Environment-controlled (mock vs live)

* Worker must:

  * Run independently of API layer
  * Be idempotent

* API routes:

  * Must not trigger external services during build
  * Must lazy-load heavy dependencies

---

## ⚙️ 5. ENVIRONMENT / CONFIG

### Core Variables

* `USE_MOCK=true`
* `MLS_MAX_RUNTIME_MS=600000`
* `MLS_RATE_DELAY_MS=900`

### External Services

* Supabase
* PostgreSQL
* Resend (email)
* Redis (planned runtime only)
* MLS Grid API

---

## 🔁 6. WORKFLOWS (STEP-BY-STEP)

### MLS Ingestion Flow

1. Railway runs worker:
   → `node dist/workers/main.js`

2. `main.ts` triggers:
   → `mlsWorker.ts`

3. Worker executes:
   → `syncMLSGrid({ maxRuntimeMs })`

4. If `USE_MOCK=true`:
   → load mock listings

5. For each listing:
   → upsert into DB

6. (Future)
   → trigger alert queue

---

### Build Flow (Critical)

1. Railway runs:
   → `npm run build`

2. Next.js:
   → compiles app

3. Worker:
   → compiled via `tsc`

4. Guards prevent:

   * Redis connection
   * API execution
   * external API init

---

## 🚧 7. KNOWN ISSUES / RISKS

* Redis not active in production
* Search system depends on lazy imports (fragile if misused)
* Path alias (`@/`) not usable in dynamic imports
* API routes still vulnerable if new top-level imports added
* No monitoring/logging system yet

---

## 🎯 8. NEXT PRIORITIES

1. Enable LIVE MLS ingestion (controlled, 1–2 pages)
2. Add hard pagination limits in `syncMLSGrid`
3. Reintroduce Redis safely (Railway Redis or external)
4. Stabilize alert pipeline
5. Add logging + observability
6. Optimize search system (Typesense validation)

---

## 📏 9. STANDARDS & CONSTRAINTS (CRITICAL)

* NEVER run unbounded MLS loops
* ALL ingestion must be rate-limited
* NO external services during build
* NO top-level imports for:

  * Redis
  * Typesense
  * external APIs
* Worker must run from compiled `/dist`
* Use relative paths in dynamic imports
* All async work → queue-based (no blocking APIs)

---

## 🧩 10. MISSING BUT NEEDED (GAPS)

* Redis production instance
* Alert matching engine fully wired
* Retry / failure handling for worker
* Observability (logs, metrics)
* MLS live ingestion safeguards
* Search indexing pipeline

---

## 🧾 11. TERMINOLOGY (NORMALIZED)

* **Listing** = property from MLS
* **Ingestion** = pulling MLS data into DB
* **Worker** = background process (Railway)
* **Mock Mode** = safe synthetic data mode
* **Live Mode** = real MLS API ingestion
* **Alert** = user-triggered notification condition
* **Queue** = async job processing system

---

## 🧠 12. ASSUMPTIONS MADE

* MLS Grid API will be used for live ingestion
* Redis will be required for queue scaling
* Typesense is intended for search (not yet fully validated)
* Railway will host worker long-term
* Build-time execution must always be isolated from runtime

---

**END OF CONTEXT CAPTURE**

````


Key rules:
- Never run unbounded loops against MLS again
- I follow all of your commands and do them in order as I read them. So please stop giving them to me twice. I don't need to know why something happens. I only need to know what my next command or code is to do. So be concise and task focused.
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

## 🧱 System Architecture

### Frontend
- Next.js App Router
- React (Client + Server Components)
- Tailwind CSS
- Leaflet (React-Leaflet)

### Backend
- Next.js API Routes
- Supabase (Postgres)
- Prisma (client only — NOT schema authority)

### Worker System (PRIMARY INGESTION ARCHITECTURE)
- Node worker (ts-node)
- Runs MLS sync jobs
- Strict rate limiting enforced
- Designed for Railway deployment (future)

---

## ⚠️ CRITICAL MLS RULES

- NEVER exceed 2 RPS (hard limit target: ~1.1 RPS)
- ALWAYS run serial requests (no parallel fetches)
- ALWAYS enforce delay between requests (>= 900ms)
- ALWAYS include MAX_RUNTIME_MS failsafe
- NEVER run infinite loops
- ALWAYS checkpoint sync state

---

## 🧠 MLS INGESTION SYSTEM

### Current Mode
- SAFE MODE (mock data enabled)
- USE_MOCK = true

### Production Mode (when re-enabled)
- Worker pulls MLS Grid data
- Uses incremental sync (lastSync timestamp)
- Processes in batches (top=50)
- Persists to database

### Flow

1. Worker starts
2. Get lastSync from DB
3. Fetch listings (paged)
4. Process + upsert listings
5. Update lastSync
6. Sleep (rate limit)
7. Repeat until:
   - no data OR
   - max runtime reached

---

## 🗺️ MAP SYSTEM (STABLE)

### Stack
- React-Leaflet
- Dynamic import (SSR disabled)

### Fixes Applied

- Prevent SSR rendering
- Removed double initialization issue
- Removed global map instance hacks
- Removed conditional hook execution
- Enforced React hook order consistency

### Final Architecture

- `MapInner.tsx` renders map only (no SSR)
- `MapEvents` handles bounds updates
- `MapMarkers` renders pins
- `FlyToListing` handles selection animation

---

## ⚠️ REACT RULES (CRITICAL)

- NEVER conditionally call hooks
- NEVER place hooks outside components
- NEVER early return before hooks
- ALWAYS maintain hook order across renders

---

## 🧾 DATABASE RULES

- Supabase SQL = source of truth
- Prisma = client only

### Connections

- 6543 → pooled (runtime)
- 5432 → direct (schema only)

---

## 🔁 SYNC STATE SYSTEM

- Table: `mls_sync_state`
- Stores lastSync timestamp
- MUST always have valid ID (no nulls)

---

## 📊 PLATFORM FEATURES

- Map-based property search
- Bounding box queries
- URL-synced filters
- Home valuation tool
- SEO city + neighborhood pages

---

## 🚧 CURRENT STATUS

### ✅ Working
- Worker SAFE MODE (mock ingestion)
- Database writes
- Map rendering (Leaflet stable)
- API map listings endpoint
- URL sync + filters

### ⚠️ Disabled
- MLS Grid (suspended — rate limit violations)

### 🔄 In Progress
- Production worker deployment (Railway)
- Real MLS ingestion reactivation (rate-safe)

---

## 🎯 NEXT PHASE

1. Deploy worker to Railway
2. Re-enable MLS ingestion (STRICT SAFE MODE)
3. Add Redis queue (BullMQ)
4. Implement clustering / deduping
5. Add premium UI interactions

---

## 🎨 UI DIRECTION

Inspired by:
https://patrickbrowngroup.com/

Goals:
- Luxury aesthetic
- Smooth animations
- Premium spacing
- Zillow-level UX

---

## 🔐 SECURITY

- Rotate:
  - Supabase password ✅
  - Resend API key (pending)

---

## 🧠 PLATFORM GOAL

Build the dominant real estate intelligence platform for Boulder County.

- SEO dominance
- High-quality data
- Premium UX
- Conversion-focused funnels