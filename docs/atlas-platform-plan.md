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
==============================
## 🗓️ SESSION METADATA

Start Date: 2026-04-05  
End Date: 2026-04-05  
Active Hours: ~4–6 hours
---

## 🧱 1. PROJECT SNAPSHOT (CURRENT STATE)

- MLS Grid access suspended due to rate limit violations
- Worker system rebuilt with strict rate limiting + safe mode
- Mock ingestion fully working (500 listings processed)
- Map system stabilized (Leaflet + React issues resolved)
- API map listings endpoint functioning
- Frontend map renders cleanly without errors

---

## 🏗️ 2. SYSTEM ARCHITECTURE (UPDATED)

### MLS Ingestion System
- Worker-based (Node process)
- Serial requests only
- Rate limited (~1.1 RPS)
- Uses lastSync checkpoint
- Batch size = 50
- Max runtime enforced (10 min)

### Alert System
- DB-backed (AlertQueue)
- Status lifecycle: pending → sent → failed

### Email System
- Planned: Resend integration

### Queue System
- Current: DB queue
- Future: BullMQ + Redis

### Frontend
- Next.js App Router
- React client components
- Leaflet map (react-leaflet)
- Dynamic import (SSR disabled)

### API Layer
- /api/map-listings
- Bounding box filtering
- Query param filters (price, beds, type)

### Database
- Supabase Postgres
- Prisma client only
- SQL editor = schema authority

---

## 🗂️ 3. FILES CREATED / MODIFIED

### lib/mls/syncMLSGrid.ts
- Added strict rate limiting
- Added max runtime guard
- Added safe mode (mock data)
- Added lastSync usage

### workers/main.ts
- Executes sync once
- Prevents runaway loops

### components/maps/MapInner.tsx
- Fixed React hook order issues
- Removed conditional hook execution
- Stabilized Leaflet rendering
- Added FlyToListing component

### components/maps/MapEvents.tsx
- Handles map movement + bounds updates

### components/maps/MapMarkers.tsx
- Renders listing markers

---

## 🧠 4. BUSINESS LOGIC & RULES

- Listings fetched via bounding box
- Filters applied via URL params
- Map movement triggers data fetch
- Active listing triggers map flyTo
- MLS ingestion MUST be rate-limited

---

## ⚙️ 5. ENVIRONMENT / CONFIG

- USE_MOCK = true (current)
- Supabase connection via pooler (6543)
- Direct DB only for schema changes

---

## 🔁 6. WORKFLOWS

### MLS Sync Flow

1. Start worker
2. Load lastSync
3. Fetch listings (paged)
4. Process + upsert
5. Update lastSync
6. Sleep (900ms)
7. Repeat until done or timeout

---

### Map Interaction Flow

1. User moves map
2. Bounds captured
3. URL updated
4. API request triggered
5. Listings updated
6. Markers rendered

---

## 🚧 7. KNOWN ISSUES / RISKS

- MLS access suspended (external dependency)
- No queue system yet (single-threaded worker)
- No clustering/deduplication yet

---

## 🎯 8. NEXT PRIORITIES

1. Deploy worker to Railway
2. Re-enable MLS ingestion safely
3. Add Redis queue (BullMQ)
4. Improve marker UX (hover sync, clustering)
5. Build listing detail experience

---

## 📏 9. STANDARDS & CONSTRAINTS

- No unbounded loops
- No parallel MLS requests
- Must be idempotent
- Must be rate-safe
- No blocking API routes
- Hooks must be consistent

---

## 🧩 10. MISSING BUT NEEDED

- Redis queue system
- Worker hosting (Railway)
- Email sending system
- Listing detail pages
- Caching layer

---

## 🧾 11. TERMINOLOGY

- Listing = MLS property
- Sync = MLS ingestion job
- Worker = background processor
- Alert = notification trigger
- Bounds = map viewport box

---

## 🧠 12. ASSUMPTIONS MADE

- MLS Grid will restore access
- Worker will be primary ingestion method
- Supabase remains DB provider
- Next.js remains frontend framework

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