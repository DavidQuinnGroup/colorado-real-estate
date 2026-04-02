# 🧠 ATLAS PLATFORM MASTER SPEC

## Project
Boulder County Real Estate Platform

Built by:
David Quinn
Atlas (AI System Architect)

---

## 🏗️ Platform Goal

Build the leading independent real estate knowledge + search platform for Boulder County.

---

## ⚙️ Tech Stack

Frontend:
- Next.js (App Router)
- Tailwind CSS

Backend:
- Prisma ORM
- PostgreSQL (Supabase)

Infrastructure:
- Redis / BullMQ (planned)
- Vercel (deployment)

---

## 🌎 Focus Markets

Boulder  
Louisville  
Lafayette  
Superior  
Erie  
Broomfield  
Longmont  

---

## 🧩 System Architecture

### MLS Ingestion
- Source: MLS Grid / IRES
- Flow:
  ingest → normalize → upsert → process → match alerts

---

### Alerts System

Core components:

- `matchSearches()`
- `AlertEvent` → prevents duplicates
- `AlertQueue` → email pipeline
- `processAlertQueue()` → sends emails

---

## 🗄 Database Models

- Property
- User
- SavedSearch
- AlertEvent
- AlertQueue

---

## 🔐 Environment Variables

DATABASE_URL=
→ pooled connection (port 6543)

DIRECT_URL=
→ direct connection (port 5432 + sslmode=require)

---

## 🔁 Key Workflows

### New Listing Flow
MLS → DB → matchSearches → AlertQueue

### Alert Flow
AlertQueue → process → send email → EmailLog

---

## 📁 File Structure

/lib
  /mls
  /alerts
  /queue

/app/api

/prisma

/docs

---

## 🧠 Rules / Conventions

- NEVER send emails inside matching logic
- ALWAYS queue alerts
- Alerts must be idempotent (AlertEvent)
- Use snapshot data in AlertQueue
- All async work uses queues

---

## 🧪 Dev Environment

Terminal usage:

- Terminal 1 → Next.js dev server
- Terminal 2 → Prisma Studio
- Terminal 3 → Workers (later)
- Terminal 4 → Prisma / scripts

---

## 🚨 Debug Protocol

1. Check schema vs DB (schema drift)
2. Check `.env`
3. Check pooled vs direct connection
4. Restart services
5. Verify in Supabase SQL

---

## 📍 Current Status

✅ MLS ingestion working  
✅ Matching system working  
❌ AlertQueue table not created (DB connection issue)  

---

## ⏭️ Next Steps

1. Fix DIRECT_URL connection
2. Run `prisma db push`
3. Confirm AlertQueue exists
4. Build alert processor endpoint
5. Send first real email