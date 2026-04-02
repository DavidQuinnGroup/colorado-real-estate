# ==============================

# PRODUCTION ARCHITECTURE

# David Quinn Group Real Estate Platform

# ==============================

## 📌 OVERVIEW

Production-grade real estate platform built for scalability, SEO dominance, and lead generation.

Core principles:

* Supabase = source of truth (database)
* Prisma = query layer only
* All async work handled via queue
* No blocking operations in request lifecycle
* Payload-driven architecture for flexibility

---

# 🧱 SYSTEM COMPONENTS

## 1. FRONTEND

* Framework: Next.js (App Router)
* Styling: Tailwind CSS
* Hosting: Vercel (planned)

### Responsibilities

* SEO page rendering (10k–100k+ pages)
* Map + listing UI
* Lead capture (save search, valuation, etc.)
* Internal linking engine

---

## 2. DATABASE

* Provider: Supabase (PostgreSQL)
* Extensions: PostGIS (geospatial queries)

### Rules

* Supabase is schema authority
* Prisma does NOT manage schema
* All schema changes via Supabase SQL

### Core Tables

#### User

* id
* email (unique)

#### Property

* id
* mlsId
* address
* city
* price
* bedrooms
* bathrooms
* lat/lng
* location (PostGIS)

#### SavedSearch

* id
* userId
* city
* minPrice
* beds
* type
* north/south/east/west

#### AlertQueue

* id
* userId
* payload (JSON)
* status (pending | sent | failed)
* sentAt
* clickedAt
* createdAt

#### AlertEvent (deduplication)

* id
* userId
* propertyId
* type
* unique(userId, propertyId, type)

---

## 3. ALERT SYSTEM

### Core Concept

Alerts are **queue-based and payload-driven**.

NOT:

* direct email sending
* tight coupling to Property table

INSTEAD:

* alerts store full payload
* emails generated from payload

---

### Flow

1. Listing created or updated
2. Matching engine runs
3. Alert inserted into AlertQueue
4. Worker processes queue
5. Email sent
6. Click tracked

---

### Matching Logic

A listing matches a SavedSearch if:

* city matches
* price >= minPrice (or null)
* beds >= beds (or null)
* propertyType matches (if defined)
* within bounding box (if defined)

---

### Deduplication

* Enforced via AlertEvent table
* Prevents duplicate alerts per:
  user + property + type

---

## 4. QUEUE SYSTEM

### Current (Production MVP)

* Type: Database-backed queue
* Table: AlertQueue
* Worker: scripts/runAlerts.ts

### Behavior

* Pull-based processing
* Ordered by createdAt ASC
* Batch limited

### Status Lifecycle

pending → sent → failed

### Rules

* Each alert processed exactly once
* Must update status after processing
* Failed alerts must not be marked sent

---

### Future Upgrade

* BullMQ + Redis
* Parallel workers
* Retry + dead-letter queue

---

## 5. EMAIL SYSTEM

### Provider

* Resend

### Core Service

* /lib/email/sendEmail.ts

---

### Templates

* propertyAlert.ts → single listing email
* listingDigest.tsx → multi-listing (future)

---

### Features

* HTML email templates (table-based)
* Dynamic rendering from payload
* CTA links with tracking

---

### Email Flow

AlertQueue → Worker → Template → Resend → User

---

## 6. CLICK TRACKING SYSTEM

### Endpoint

* /api/track-click

---

### Flow

1. User clicks email CTA
2. Request hits tracking endpoint
3. alertId extracted
4. DB updated:
   clickedAt = timestamp
5. Redirect to destination page

---

### Purpose

* Measure engagement
* Identify high-intent users
* Enable lead scoring

---

## 7. DATA FLOW (FULL)

MLS/Data Source
→ Database (Property)
→ Matching Engine
→ AlertQueue (payload stored)
→ Worker (runAlerts.ts)
→ Email (Resend)
→ User Click
→ /api/track-click
→ Database (clickedAt)

---

## 8. API LAYER

### Key Endpoints

* /api/map-listings → viewport listings
* /api/map-tile/[z]/[x]/[y] → clustered map data
* /api/save-search → store user searches
* /api/track-click → email engagement tracking
* /api/mls-sync → ingestion trigger (future)

---

### Rules

* APIs must be stateless
* No heavy processing in API routes
* All async work goes to queue

---

## 9. MLS INGESTION SYSTEM (PLANNED)

### Flow

MLS API
→ fetch
→ normalize
→ queue jobs
→ worker processes
→ database upsert
→ trigger alerts

---

### Constraints

* Must be idempotent (mlsId unique)
* Must not block
* Must scale to 100k–1M listings

---

## 10. STANDARDS (CRITICAL)

* Supabase = source of truth
* Prisma = client only
* No schema changes via Prisma
* All async work via queue
* Workers must be idempotent
* Emails must not send in request cycle
* System must scale to 100k+ listings

---

## 11. KNOWN GAPS (CURRENT)

* No batching/digest emails (single listing only)
* No retry logic for failed emails
* No rate limiting
* No unsubscribe enforcement (API exists, not fully wired)
* No persistent worker (manual execution)
* No BullMQ/Redis yet
* No analytics dashboard for clicks

---

## 12. NEXT EVOLUTION

1. Multi-listing digest emails
2. BullMQ + Redis workers
3. Lead scoring system (based on clicks)
4. Follow-up automation
5. Domain email setup ([alerts@davidquinngroup.com](mailto:alerts@davidquinngroup.com))
6. Analytics dashboard
7. MLS live ingestion

---

# ✅ SUMMARY

You now have:

* End-to-end alert pipeline
* Queue-based architecture
* Payload-driven email system
* Click tracking feedback loop

This is a **production-ready foundation** capable of scaling into a Zillow-level alert + lead generation system.
