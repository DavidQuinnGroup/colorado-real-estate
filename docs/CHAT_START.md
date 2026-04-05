

# CHAT START CONTEXT
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



Atlas, this is not in a single copy/paste format. Please put into single copy/paste format. Starting with
==============================
PROJECT BRAIN — CONTEXT CAPTURE
==============================


CHAT ENDING
CONTEXT CAPTURE PROTOCOL
You are helping me maintain a persistent “Project Brain” for my production-grade real estate platform.

Your job is to provide a single copy/paste format that extracts, organizes, and normalizes EVERYTHING important from this conversation so it can be reused in future chats with zero context loss. Start with
==============================
PROJECT BRAIN — CONTEXT CAPTURE
==============================

---

## 🔴 OUTPUT RULES (STRICT)

* Be concise but complete
* No fluff, no explanations
* Use clean formatting
* Assume this will be pasted into a long-term master doc
* If something is unclear, infer the MOST LIKELY correct interpretation
* Standardize terminology across sections

---

## 🧱 1. PROJECT SNAPSHOT (CURRENT STATE)

Summarize the current state of the system:

* What was worked on in this chat
* What is now functional
* What is partially complete
* What is broken or uncertain

---

## 🏗️ 2. SYSTEM ARCHITECTURE (UPDATED)

Only include what is confirmed or updated in THIS chat.

Break into:

* MLS Ingestion System
* Alert System
* Email System
* Queue System
* Frontend (UI / Pages)
* API Layer
* Database (Prisma)

Include:

* Data flow
* Key logic
* Important constraints

---

## 🗂️ 3. FILES CREATED / MODIFIED

List all files touched:

For each file:

* File path
* Purpose
* Key logic added or changed

---

## 🧠 4. BUSINESS LOGIC & RULES

Capture ALL rules introduced or reinforced:

Examples:

* Matching logic rules
* Pricing logic
* Notification rules
* User behavior assumptions

---

## ⚙️ 5. ENVIRONMENT / CONFIG

Any:

* Environment variables added/changed
* External services used
* Keys, APIs, integrations

---

## 🔁 6. WORKFLOWS (STEP-BY-STEP)

Document exact flows created or modified:

Examples:

* New listing ingestion flow
* Alert trigger flow
* Email send pipeline

Use step-by-step numbered format

---

## 🚧 7. KNOWN ISSUES / RISKS

List:

* Bugs
* Edge cases
* Technical debt
* Performance concerns

---

## 🎯 8. NEXT PRIORITIES

Based on this chat, what should happen next?

Order by importance.

---

## 📏 9. STANDARDS & CONSTRAINTS (CRITICAL)

Capture any rules about HOW the system must be built:

Examples:

* Must use queues for async work
* Must be idempotent
* Must be production-safe
* No blocking operations in API routes

---

## 🧩 10. MISSING BUT NEEDED (GAPS)

What is NOT built yet but clearly required?

---

## 🧾 11. TERMINOLOGY (NORMALIZED)

Define consistent terms used:

Example:

* “Listing” = property from MLS
* “Alert” = triggered notification
* etc.

---

## 🧠 12. ASSUMPTIONS MADE

List any assumptions you made during this chat so they can be confirmed later.

---

Return everything cleanly structured so it can be copied & pasted into a master document. At the top, include the date we started this chat, the date we moved to another chat to continue building this website and the active hours worked.


