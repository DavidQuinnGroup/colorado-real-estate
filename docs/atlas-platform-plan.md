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

```
==============================
PROJECT BRAIN — CONTEXT CAPTURE
==============================

Start Date: 2026-04-07  
Continuation Date: 2026-04-07  
Active Work Time: ~3–4 hours

---

## 🧱 1. PROJECT SNAPSHOT (CURRENT STATE)

Worked on:
- MLS ingestion worker (Railway deployment)
- Supabase schema alignment
- Worker build isolation
- Redis + queue setup stabilization
- TypeScript worker compilation
- MLS API pagination + runtime safety

Functional:
- Worker builds successfully (Railway)
- Worker executes without crashing
- MLS API calls succeed
- Pagination + runtime limits working
- Supabase connection working

Partially Complete:
- Data ingestion pipeline runs but fails to insert rows
- Upsert logic implemented but failing due to missing/invalid MLS ID

Broken / Uncertain:
- `mlsid` is NULL during insert
- Correct MLS identifier field not confirmed (ListingKey vs nested field)
- No rows successfully inserted into `Property` table yet

---

## 🏗️ 2. SYSTEM ARCHITECTURE (UPDATED)

### MLS Ingestion System
Flow:
1. Worker starts (`dist/workers/main.js`)
2. Calls `syncMLSGrid`
3. Fetches MLS pages via `fetchMLSPage`
4. Iterates listings
5. Calls `upsertListing`

Constraints:
- Max runtime enforced (`MLS_MAX_RUNTIME_MS`)
- Page limit enforced (`MLS_MAX_PAGES`)
- Rate limiting enforced (`MLS_RATE_DELAY_MS`)
- Must never loop infinitely

---

### Alert System
- Not implemented yet

---

### Email System
- Exists but excluded from worker build
- Not active in ingestion flow

---

### Queue System
- BullMQ queues configured
- Redis connection runtime-safe
- Queues defined:
  - mlsQueue
  - mlsPageQueue
  - alertQueue
  - deadLetterQueue

---

### Frontend (UI / Pages)
- Exists (Next.js)
- Not involved in current ingestion debugging

---

### API Layer
- `/api/search` exists
- Dynamic import path fixed

---

### Database (Prisma / Supabase)

Table: `Property`

Key fields:
- `mlsid` (TEXT, intended UNIQUE + NOT NULL)
- Other fields: address, price, beds, baths, etc.

Constraint requirement:
- `mlsid` must be UNIQUE for upsert to work

---

## 🗂️ 3. FILES CREATED / MODIFIED

### `/lib/mls/syncMLSGrid.ts`
- Main ingestion loop
- Handles pagination, runtime limits, env config

### `/lib/mls/fetchMLSPage.ts`
- Calls MLS Grid API
- Uses `$top`, `$skip`, `$filter`

### `/lib/mls/upsertListing.ts`
- Inserts/upserts listings into Supabase
- Current issue: `mlsid` mapping incorrect

### `/lib/queue/redis.ts`
- Central Redis connection config

### `/lib/queue/*.ts`
- Queue definitions updated to use shared connection

### `/dist/**`
- Worker build output
- Must be committed for Railway

### `/package.json`
- Build scripts adjusted
- Worker build separated from Next.js build

### `/tsconfig.worker.json`
- Dedicated worker TypeScript config
- Excludes frontend / TSX

---

## 🧠 4. BUSINESS LOGIC & RULES

- MLS ingestion must be:
  - Paginated
  - Rate-limited
  - Runtime-bounded

- Each listing:
  - Must have a stable unique identifier (`mlsid`)
  - Must be upserted (not duplicated)

- Upsert rule:
  - Conflict target = `mlsid`

---

## ⚙️ 5. ENVIRONMENT / CONFIG

Required env vars:

- DATABASE_URL
- MLS_GRID_BASE_URL
- MLS_GRID_TOKEN
- MLS_MAX_PAGES
- MLS_MAX_RUNTIME_MS
- MLS_RATE_DELAY_MS
- USE_MOCK
- NEXT_PUBLIC_SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY

Platform:
- Railway (worker deployment)
- Supabase (database)
- MLS Grid API

---

## 🔁 6. WORKFLOWS (STEP-BY-STEP)

### MLS Ingestion Flow

1. Worker starts (`node dist/workers/main.js`)
2. Calls `syncMLSGrid`
3. Load env config
4. Get last sync timestamp
5. Loop pages:
   1. Fetch listings (`fetchMLSPage`)
   2. For each listing:
      - Call `upsertListing`
   3. Update last sync
6. Stop when:
   - Max pages reached OR
   - Max runtime reached

---

## 🚧 7. KNOWN ISSUES / RISKS

- `mlsid` is NULL → inserts fail
- Upsert constraint exists but not being hit due to NULL values
- MLS field mapping is incorrect or inconsistent
- Worker may still use stale `/dist` if not rebuilt
- No validation layer before insert

---

## 🎯 8. NEXT PRIORITIES

1. Fix `mlsid` mapping in `/lib/mls/upsertListing.ts`
2. Confirm correct MLS field (likely `ListingKey` or nested)
3. Ensure `mlsid` is NEVER null before insert
4. Rebuild `/dist` and redeploy
5. Confirm rows appear in Supabase
6. Increase `MLS_MAX_PAGES` after success

---

## 📏 9. STANDARDS & CONSTRAINTS (CRITICAL)

- Worker must:
  - Run independently of Next.js
  - Not import frontend code
  - Use runtime-only env access

- Ingestion must:
  - Be idempotent
  - Use upsert (no duplicates)
  - Never use unbounded loops

- Build:
  - `/dist` must be committed for Railway

---

## 🧩 10. MISSING BUT NEEDED (GAPS)

- Confirmed MLS schema mapping
- Validation layer before DB insert
- Logging for bad records
- Search indexing (Typesense)
- Alert triggering system
- Email pipeline integration

---

## 🧾 11. TERMINOLOGY (NORMALIZED)

- Listing = property record from MLS
- MLS = MLS Grid API
- Worker = background ingestion process
- Upsert = insert or update on conflict
- mlsid = unique listing identifier (DB key)

---

## 🧠 12. ASSUMPTIONS MADE

- `ListingKey` is intended unique MLS identifier
- MLS API returns consistent structure per listing
- Supabase `Property` table is correct schema
- Worker runs exclusively from `/dist`
- Railway deploy uses latest committed build

```
---
END OF CONTEXT

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