# David Quinn Group — System Architecture

## 🔗 Related Documents

- Product Plan: /docs/atlas-platform-plan.md

## 🌐 Platform Overview

Production real estate platform for Boulder County and surrounding areas.

---

## 🖥️ Frontend

- Next.js (App Router)
- Tailwind CSS
- Hosted on Vercel

---

## 🗄️ Database

- Supabase (PostgreSQL)
- Source of truth for all schema
- Prisma used as client ONLY

---

## ⚙️ Backend Systems

## Alert System

### Storage
- AlertQueue (Supabase)

### Fields
- userId
- payload (JSON)
- status (pending | sent | failed)
- sentAt
- clickedAt
- createdAt

### Worker
- scripts/runAlerts.ts

### Flow
1. Insert alert (status = pending)
2. Worker processes queue
3. Email sent via Resend
4. Status updated
5. Click tracked via API

### Rules
- Alerts must belong to valid user
- Emails only sent once per alert
- Payload is source of truth

---

## Email System

- Provider: Resend
- Core service: /lib/email/sendEmail.ts

### Templates
- /lib/email/templates/propertyAlert.ts (single listing)
- /lib/email/templates/listingDigest.tsx (future)

### Features
- HTML email rendering (table-based)
- Dynamic payload-driven content
- Click tracking via /api/track-click

### Flow
AlertQueue → Worker → Template → Resend → User → Click → DB

---

## 🌍 Infrastructure Providers

### Supabase
- Database
- Auth (future)

### Vercel
- Hosting
- Deployment

### Namecheap
- Domain: davidquinngroup.com
- DNS management

### Resend
- Email delivery

---

## 🔐 Environment Variables

- DATABASE_URL → pooled connection (6543)
- DIRECT_URL → direct connection (5432)
- RESEND_API_KEY → email service

---

## 🚀 Data Flow

MLS → Database → AlertQueue → Worker → Email → User Click → API → DB (clickedAt)

---

## ⚠️ Rules

- Supabase = schema authority
- Prisma = query layer only
- Never rely on Prisma for schema sync
- Always use pooled connection in app

---

## 📌 Next Upgrades

- Email templates (React HTML)
- Domain email (alerts@davidquinngroup.com)
- BullMQ workers
- User alert preferences

## ✅ Alert System Status

- Queue: Operational
- Worker: Operational
- Email Delivery: Operational (Resend)
- First successful send: ✅

---

## Known Gaps (Production)

- No batching/digest emails yet
- No retry logic for failed emails
- No rate limiting
- No unsubscribe enforcement (API exists, not fully integrated)
- No persistent worker (manual execution only)
- No BullMQ/Redis scaling yet

---

2026-03-09
Can you create a premium real estate website for me?

===============================
PROJECT BRAIN — CONTEXT SNAPSHOT
===============================

Chat Start Date: 2026-03-19  
Chat End Date: 2026-03-24  
Active Work Sessions: 5 days  
Estimated Active Hours (excluding today): ~12–16 hours

🧱 1. PROJECT SNAPSHOT (CURRENT STATE)

Worked on:
- Market Insights UI (multi-city comparison charts)
- Recharts integration (lines, area shading, sync)
- Layout restructuring (primary + secondary charts)
- New Next.js project setup
- Defined long-term product vision (Colorado-wide analytics + financial tools)

Functional:
- Next.js app running locally (http://localhost:3000)
- Tailwind styling active
- MarketChart component structure exists
- Multi-city selection UI implemented
- Chart data modeling approach defined

Partially Complete:
- Chart rendering (still fragile)
- Area shading + chart sync (implemented but unstable)
- Page layout structure (needs polish)
- City dataset (mock data only)

Broken / Uncertain:
- Occasional JSX syntax errors
- Duplicate project folders causing confusion
- No real backend or database
- No Supabase integration yet

---

🏗️ 2. SYSTEM ARCHITECTURE (UPDATED)

Frontend (UI / Pages):
- Next.js (App Router)
- Tailwind CSS
- Recharts

Pages:
- /market-overview (in progress)
- /colorado-wealth-builder (planned)
- Future: calculators + valuation tools

Data Flow:
UI → Local/mock data → Chart rendering
(Future: Supabase → API → UI)

API Layer (PLANNED):
- Next.js route handlers (/api/*)
- Will serve:
  - Market data
  - Financial calculations
  - Scenario outputs

Database (PLANNED):
- Supabase (replacing Prisma)
- Planned tables:
  - markets
  - properties
  - financial_scenarios
  - users (optional)

Queue / Alerts / Email:
- Not implemented in this new project
- Exists only in previous system (not migrated)

---

🗂️ 3. FILES CREATED / MODIFIED

/colorado-real-estate/app/page.tsx
- Default Next.js starter page
- Will become homepage

/colorado-real-estate/components/MarketChart.tsx
- Multi-city chart component
- Handles:
  - City selection
  - Data merging
  - Chart rendering (Line + Area)
  - Tooltip + Legend
  - Sync charts via syncId

Project Structure:
- Active project:
  /colorado-real-estate
- Old project still exists:
  /david-quinn-group

---

🧠 4. BUSINESS LOGIC & RULES

Market Insights:
- User selects up to 3 cities (target)
- Metrics:
  - Median Price
  - Inventory
  - Days on Market
- Each city:
  - Unique color
  - Independent line

Future Requirement:
- Show:
  - Last 12 months
  - Previous 12 months

Product Experience:
User flow:
1. Evaluate current home
2. Estimate selling costs
3. Calculate new purchase
4. Add investment property
5. Generate full financial scenario

Investment Logic (Planned):
- Inputs:
  - Down payment
  - Loan terms
  - Expenses
  - Rental income
- Outputs:
  - Break-even
  - Profit projection

---

⚙️ 5. ENVIRONMENT / CONFIG

Stack:
- Next.js
- Tailwind
- Recharts
- Supabase (planned)
- Vercel (planned)

Current State:
- No environment variables yet
- No API keys or integrations

---

🔁 6. WORKFLOWS

Market Chart Flow:
1. User selects cities
2. State updates (selectedCities)
3. Months derived from base dataset
4. Combined dataset built:
   { month, city1, city2, city3 }
5. Chart renders:
   - Area (background)
   - Line (primary)
6. Tooltip + legend update dynamically

Dev Flow:
1. npm run dev
2. Open http://localhost:3000
3. Edit inside /colorado-real-estate

---

🚧 7. KNOWN ISSUES / RISKS

- JSX syntax errors causing crashes
- Duplicate <Tooltip /> usage (bad pattern)
- Chart fails if data missing
- Silent failures when city data undefined
- Two project roots (confusing)
- No real data source
- Chat lag slowing workflow

---

🎯 8. NEXT PRIORITIES

1. Use only /colorado-real-estate project
2. Build /colorado-wealth-builder page
3. Rebuild Market Overview cleanly
4. Integrate Supabase
5. Add 12-month comparison logic
6. Limit selection to 3 cities
7. Build Investment Property Planner
8. Implement PDF generator
9. Connect all tools into unified flow

---

📏 9. STANDARDS & CONSTRAINTS

- Must be production-grade
- Must be fast and intuitive
- Charts must not crash UI
- Handle missing data safely
- Prefer modular components
- Avoid duplicate JSX
- Predictable state management

Future:
- No blocking UI operations
- Async handled via API layer

---

🧩 10. MISSING BUT NEEDED

- Supabase integration
- Real MLS data ingestion
- API routes
- Financial calculation engine
- PDF generation system
- User session handling
- SEO page structure
- Full Colorado dataset

---

🧾 11. TERMINOLOGY

- Listing = MLS property
- Market Data = price, inventory, DOM time-series
- City Selection = selected comparison markets
- Metric = price | inventory | dom
- Scenario = full financial plan
- Wealth Builder = unified financial tool
- Investment Planner = rental analysis tool

---

🧠 12. ASSUMPTIONS

- Supabase replaces Prisma
- Charts will use real MLS data later
- No login required initially
- Max city comparison = 3
- All tools share unified data model
- PDF output is core feature
- Platform has two layers:
  - Public tool
  - Agent-only advanced system

===============================
END
===============================


2026-03-10
# 🧠 PROJECT BRAIN — CONTEXT SNAPSHOT (LATEST)

---
Start Date: 2026-02-25  
End Date: 2026-03-24  

Total Active Days: 27  

Estimated Active Hours (excluding today): 35–45 hours

---

## 🧱 1. PROJECT SNAPSHOT (CURRENT STATE)

### Worked On In This Chat
- Project continuity system (Project Brain)
- Folder architecture normalization (`/lib`, `/docs`, `/data`)
- SEO scaling system (500 → 10,000 pages)
- Dynamic routing for `/market/[city]`
- Home Value Tool (Zillow-style lead funnel)
- Boulder Market Dashboard (Altos-style intelligence)
- Footer branding update (“David Atlas”)
- Compliance system (Fair Housing awareness)
- Platform positioning (prop-tech vs agent site)

### Now Functional
- Dynamic city market pages (`/market/[city]`)
- Market dashboard (price, DOM, inventory, absorption)
- Market Health Score system
- Forecast + momentum logic
- Recession signal logic
- Seasonal trend logic
- Home value estimator (basic AVM logic)
- Seller timing score
- Lead capture (email input flow)
- SEO page structure (multiple city pages)
- Internal linking blocks
- Footer component

### Partially Complete
- Neighborhood SEO engine (planned, not deployed)
- AI market prediction engine (basic logic only)
- Equity calculator (exists but not fully integrated)
- Market map (component exists, needs real data)
- SEO content scaling automation (`generatePages.ts`)
- Valuation model (placeholder logic)

### Broken / Uncertain
- Home value estimator accuracy (randomized / simplified)
- No real MLS or API data integration
- No backend persistence for leads yet
- No email automation connected to lead capture
- No production SEO metadata system (titles/descriptions structured but not automated)

---

## 🏗️ 2. SYSTEM ARCHITECTURE (UPDATED)

### Frontend (UI / Pages)
- Next.js App Router
- Tailwind CSS UI system
- Pages:
  - `/` (main dashboard)
  - `/home-value`
  - `/boulder-housing-market`
  - `/boulder-home-prices`
  - `/market/[city]`
  - City SEO pages (Louisville, Lafayette, etc.)
- Components:
  - MarketChart
  - MarketGauge
  - MarketHealth
  - BoulderMarketMap
  - HomeValueEstimator
  - EquityCalculator
  - Footer / Navbar

### API Layer
- Not yet implemented
- Future:
  - valuation endpoint
  - lead capture endpoint
  - MLS ingestion endpoint

### Database (Prisma)
- Not actively used in this chat
- Planned for:
  - users
  - saved searches
  - alerts
  - leads

### MLS Ingestion System
- NOT implemented in this chat
- Planned:
  - ingest listings
  - normalize data
  - store in DB
  - trigger alerts

### Alert System
- NOT modified in this chat
- Exists conceptually:
  - match listings to user searches
  - trigger notifications

### Email System
- NOT connected yet
- Planned:
  - valuation report emails
  - alert emails
  - weekly market reports

### Queue System
- NOT modified here
- Previously exists:
  - async alert processing
  - email dispatch queue

### Data Flow (Current Frontend-Only)

User → enters address → estimator runs →  
→ generates estimate →  
→ reveals seller timing score →  
→ prompts email capture

Market Data → static values →  
→ fed into dashboard →  
→ generates:
  - health score
  - forecast
  - absorption
  - signals

---

## 🗂️ 3. FILES CREATED / MODIFIED

### /app/page.tsx
- Main dashboard
- Added:
  - city selector
  - market health gauge
  - advanced signals
  - seller timing logic
  - chart integration

### /app/home-value/page.tsx
- Zillow-style estimator
- Added:
  - inputs (address, beds, baths, sqft)
  - valuation logic (price per sqft model)
  - lead capture trigger

### /app/boulder-housing-market/page.tsx
- SEO + analytics page
- Added:
  - snapshot metrics
  - health score
  - forecast
  - internal linking
  - map integration

### /app/market/[city]/page.tsx
- Dynamic city pages
- Uses:
  - `cities.ts`
- Displays:
  - price
  - DOM
  - inventory

### /data/cities.ts
- Centralized city dataset
- Used for:
  - static generation
  - dynamic routing

### /lib/*
Core logic engines:

- forecastEngine.ts → price forecasting
- marketPrediction.ts → trend logic
- marketAnalytics.ts → derived metrics
- marketHealth.ts → scoring system
- marketMetrics.ts → raw metrics
- sellerEngine.ts → seller timing score
- seoPages.ts → SEO page generation logic
- generatePages.ts → scaling system

### /components/Footer.tsx
- Updated:
  - branding → “Designed and Created by David Atlas”

---

## 🧠 4. BUSINESS LOGIC & RULES

### Market Health Score
- Based on:
  - price growth
  - inventory
  - days on market

### Seller Timing Score



2026-03-11
## 📅 CHAT METADATA

Start Date: 2026-03-21
End Date: 2026-03-23
Active Hours (excluding today): ~6.5–8 hours

---

# 🧱 1. PROJECT SNAPSHOT (CURRENT STATE)

Worked On:

* Programmatic SEO architecture for real estate platform
* Dynamic routing (Next.js App Router)
* City + Neighborhood page systems
* Data-driven page generation using neighborhoods.ts
* Debugging routing + parsing errors

Functional:

* /boulder-real-estate page renders
* /city/[city] dynamic routing works (with async params fix)
* neighborhoods.ts successfully drives UI content
* Dynamic page generation concept validated

Partially Complete:

* /neighborhood/[slug] page exists but unstable
* City pages (only some implemented)
* Internal linking system (RelatedContent) partial
* Authority Graph system started but incomplete

Broken / Uncertain:

* Dynamic route conflict:
  "('neighborhood' !== 'slug')"
* Incorrect folder structure:
  /app/neighborhood/[city]/[slug]
* Internal Server Errors on neighborhood pages
* Duplicate data sources:
  /data/neighborhoods.ts vs /lib/neighborhoods.ts
* Missing city page files

---

# 🏗️ 2. SYSTEM ARCHITECTURE (UPDATED)

Frontend (UI / Pages):

Static Pages:

* /boulder-real-estate
* /louisville-real-estate
* /lafayette-real-estate (planned)
* /superior-real-estate (planned)

Dynamic Pages:

* /city/[city]
* /neighborhood/[slug]

Data Layer:

* /lib/neighborhoods.ts
* Schema:
  { name, slug, city }

Rendering Logic:

* City pages:
  neighborhoods.filter(n => n.city === city)
* Neighborhood pages:
  neighborhoods.find(n => n.slug === slug)

---

API Layer:

* Not used in this phase

---

Database (Prisma):

* Not used
* System is static data-driven

---

MLS Ingestion:

* Not modified

Alert System:

* Not modified

Email System:

* Not modified

Queue System:

* Not modified

---

# 🗂️ 3. FILES CREATED / MODIFIED

/app/boulder-real-estate/page.tsx
Purpose: Boulder SEO landing page
Key Logic:

* Filters neighborhoods by city
* Links to dynamic routes

/app/louisville-real-estate/page.tsx
Purpose: Louisville SEO page
Key Logic:

* Static content placeholder

/app/city/[city]/page.tsx
Purpose: Dynamic city pages
Key Logic:

* Async params:
  const { city } = await params
* Filters neighborhoods by city

/app/neighborhood/[slug]/page.tsx (INTENDED)
Purpose: Dynamic neighborhood pages
Key Logic:

* Find neighborhood by slug
  Status: Broken due to routing conflict

/lib/neighborhoods.ts
Purpose: Core data layer
Schema:

* name
* slug
* city

---

# 🧠 4. BUSINESS LOGIC & RULES

Data-Driven Generation:

* All pages generated from neighborhoods.ts

Routing Rules:

* /city/[city]
* /neighborhood/[slug]

Filtering:
n.city.toLowerCase() === city.toLowerCase()

URL Strategy:

* Preferred:
  /neighborhood/table-mesa
* Avoid:
  /neighborhood/boulder/table-mesa

SEO Structure:

* City pages link to neighborhoods
* Neighborhood pages target long-tail keywords

---

# ⚙️ 5. ENVIRONMENT / CONFIG

Framework: Next.js 16 (App Router)
Bundler: Turbopack
Styling: Tailwind CSS

Command:
npm run dev

No external APIs used

---

# 🔁 6. WORKFLOWS

Dynamic City Page Flow:

1. Visit /city/boulder
2. Resolve params
3. Await params:
   const { city } = await params
4. Filter neighborhoods
5. Render links

Dynamic Neighborhood Page Flow:

1. Visit /neighborhood/[slug]
2. Extract slug
3. Find matching neighborhood
4. Render page OR fallback

SEO Expansion Flow:

1. Add entry to neighborhoods.ts
2. Page auto-generated
3. Appears in city listings

---

# 🚧 7. KNOWN ISSUES / RISKS

Critical:

* Dynamic route conflict:
  [city]/[slug] vs [slug]
* Multiple param names at same level

Structural:

* Duplicate data files
* Incorrect folder nesting

Runtime:

* Internal Server Errors
* Undefined data crashes
* Async params misuse (partially fixed)

---

# 🎯 8. NEXT PRIORITIES

1. Remove:
   /app/neighborhood/[city]
2. Standardize:
   /app/neighborhood/[slug]
3. Fix neighborhood page rendering
4. Consolidate to:
   /lib/neighborhoods.ts only
5. Add missing city pages
6. Add internal linking system
7. Add dynamic metadata (SEO)
8. Build sitemap generator
9. Expand neighborhood dataset

---

# 📏 9. STANDARDS & CONSTRAINTS

* Only ONE dynamic param per path level
* Must use async params:
  await params
* No hardcoded pages (data-driven only)
* Clean SEO URLs required
* Avoid unnecessary nested paths
* Centralize all data in /lib

---

# 🧩 10. MISSING BUT NEEDED

* sitemap.ts
* generateMetadata() for SEO
* Internal linking engine
* Schema.org structured data
* Address-level pages
* MLS integration
* Lead capture system
* Content generation system

---

# 🧾 11. TERMINOLOGY

City Page = /city/[city]
Neighborhood Page = /neighborhood/[slug]
Slug = URL identifier
Programmatic SEO = Data-driven page generation
Authority Engine = Geo-based SEO system
Data Layer = neighborhoods.ts

---

# 🧠 12. ASSUMPTIONS

* Zillow-style SEO architecture intended
* Neighborhood belongs to one city
* Static data sufficient (no DB yet)
* Focus: Boulder County / Front Range
* URLs optimized for SEO simplicity
* Future includes:

  * Address pages
  * MLS integration
  * Automated content generation


2026-03-12
# PROJECT BRAIN — CONTEXT CAPTURE

## 📅 CHAT METADATA

Start Date: 2026-03-21
End Date: 2026-03-23
Active Hours (excluding today): ~8–12 hours

---

# 🧱 1. PROJECT SNAPSHOT (CURRENT STATE)

### ✅ Completed in This Chat

* Full **SEO platform architecture** built and stabilized
* Implemented **Neighborhood Authority Engine**
* Implemented **Comparison Engine (hierarchical)**
* Implemented **Programmatic Blog Engine**
* Implemented **Property Search Landing Page Engine**
* Implemented **Address Authority Engine (MLS-ready)**
* Implemented **Lead Capture Conversion Engine**
* Implemented **Authority Flywheel System (process-level)**
* Implemented **Image SEO Engine**
* Implemented **Crawl Depth Engine**
* Implemented **Breadcrumb Navigation + Schema**
* Implemented **FAQ Schema Engine**
* Implemented **Property Schema (SingleFamilyResidence)**
* Implemented **Neighborhood Schema (Place)**
* Implemented **Internal Linking Engine (ExploreCityNeighborhoods)**

### 🟢 Fully Functional

* Dynamic routing across all page types
* Static generation (generateStaticParams working)
* Schema rendering (JSON-LD)
* Internal linking structure (multi-directional)
* Blog + comparison + neighborhood interlinking
* Address pages (demo MLS ingestion working)

### 🟡 Partially Complete

* MLS ingestion (currently mocked, not live API)
* Lead capture (UI only, no backend integration)
* Authority flywheel (manual workflow, not automated)
* Image system (no CDN or optimization pipeline yet)

### 🔴 Broken / Uncertain

* No real MLS API connected
* No persistence layer for leads
* No automation for GBP/social posting
* No ISR / revalidation strategy for large datasets

---

# 🏗️ 2. SYSTEM ARCHITECTURE (UPDATED)

## MLS Ingestion System

* Source: `/lib/mlsImporter.ts`
* Flow:
  MLS API → transform → normalized listing object → `/data/addresses.ts`
* Output:
  `{ slug, address, city, price, beds, baths, sqft }`
* Constraint:
  Must support scaling to 10k–50k listings

---

## Frontend (UI / Pages)

### Core Routes

* City: `/[city]-co-real-estate`
* Neighborhood: `/neighborhood/[slug]`
* Guides: `/guides/[slug]`
* Blog: `/blog/[city]/[topic]`
* Comparison: `/compare/[city]/[otherCity]`
* Property Search: `/homes/[city]/[type]`
* Address: `/home/[slug]`

### Neighborhood Page Includes

* Schema (Place)
* SEOImage
* Market stats
* Nearby neighborhoods
* Related articles
* ExploreCityNeighborhoods (internal linking)

---

## API Layer

* Not implemented yet (no backend endpoints)
* All data currently local or simulated

---

## Database (Prisma)

* Not implemented
* No persistence layer yet

---

## Email System

* Not implemented
* Placeholder via LeadCapture component

---

## Queue System

* Not implemented
* No background job processing yet

---

## Alert System

* Not implemented
* No triggers or subscriptions yet

---

# 🗂️ 3. FILES CREATED / MODIFIED

## Core Data / Logic

* `/lib/mlsImporter.ts`

  * Simulated MLS ingestion
  * Returns normalized listing objects

* `/data/addresses.ts`

  * Async data source for address pages
  * Wraps MLS importer

---

## Address Engine

* `/app/home/[slug]/page.tsx`

  * Dynamic property page
  * Uses getAddresses()
  * Includes Property Schema

---

## Neighborhood Engine

* `/app/neighborhood/[slug]/page.tsx`

  * Main neighborhood authority page
  * Includes:

    * Schema (Place)
    * SEOImage
    * Market stats
    * Articles
    * Nearby neighborhoods
    * ExploreCityNeighborhoods

---

## Components

* `/components/SEOImage.tsx`

  * Generates SEO-optimized alt text

* `/components/NeighborhoodMarketStats.tsx`

  * Displays static market metrics

* `/components/NeighborhoodArticles.tsx`

  * Links to blog articles by city

* `/components/NearbyNeighborhoods.tsx`

  * Local proximity linking

* `/components/ExploreCityNeighborhoods.tsx`

  * Cross-neighborhood linking engine

* `/components/LeadCapture.tsx`

  * Email capture UI (no backend)

* `/components/Breadcrumbs.tsx`

  * UI + schema

* `/components/schema/FAQSchema.tsx`

* `/components/schema/ArticleSchema.tsx`

* `/components/schema/RealEstateAgentSchema.tsx`

---

## Comparison Engine

* `/app/compare/[city]/[otherCity]/page.tsx`

  * Hierarchical comparison pages

---

## Blog Engine

* `/app/blog/[city]/[topic]/page.tsx`

  * Programmatic articles
  * Includes FAQ + schema + linking

---

## Property Search Engine

* `/app/homes/[city]/[type]/page.tsx`

  * Buyer-intent landing pages

---

# 🧠 4. BUSINESS LOGIC & RULES

* Every page must belong to a **content cluster**
* No orphan pages
* Max crawl depth: **≤ 3 clicks**
* Every page must link:

  * Up (parent)
  * Down (children)
  * Sideways (related)
* Each page type must include:

  * Schema
  * Internal links
  * Contextual content
* Blog articles:

  * Must include FAQs
  * Must include internal links
* Neighborhood pages:

  * Must act as authority hubs
* Address pages:

  * Must scale programmatically
* Website is the **primary content source**
* External platforms = distribution only

---

# ⚙️ 5. ENVIRONMENT / CONFIG

* No environment variables added
* No external APIs connected yet
* Planned:

  * MLS API (IDX / RESO)
  * Email provider
  * Automation tools (Zapier/Make)

---

# 🔁 6. WORKFLOWS

## Address Page Generation

1. Fetch MLS listings (mocked)
2. Normalize data
3. Generate slugs
4. Pass to `generateStaticParams`
5. Render `/home/[slug]`

---

## Blog Generation

1. Loop cities
2. Loop topics
3. Generate static pages
4. Add FAQ schema
5. Link to city + neighborhood pages

---

## Crawl Depth Flow

1. Homepage → City
2. City → Neighborhood
3. Neighborhood → Articles / Guides
4. Articles → Related + City + Neighborhood
5. Cross-link all layers

---

## Internal Linking Engine

* City ↔ Neighborhood
* Neighborhood ↔ Neighborhood
* Blog ↔ Neighborhood
* Comparison ↔ City

---

# 🚧 7. KNOWN ISSUES / RISKS

* No real MLS data
* No incremental static regeneration (ISR)
* Potential performance issues at scale
* No caching strategy
* Lead capture not functional
* No database
* No queue system
* No rate limiting or API protection

---

# 🎯 8. NEXT PRIORITIES

1. Neighborhood Market Report Engine
2. Zillow-style internal link wheel
3. Topical Authority Map (first 100 pages)
4. MLS API integration (real data)
5. Lead capture backend (email + CRM)
6. ISR / caching strategy
7. Automation for GBP + social
8. Database + Prisma setup

---

# 📏 9. STANDARDS & CONSTRAINTS

* Must scale to **50k+ pages**
* Must avoid orphan pages
* Must maintain shallow crawl depth
* Must use schema on all page types
* Must be programmatic (no manual scaling)
* Must separate data layer from UI
* Must support async data fetching
* Must be SEO-first architecture

---

# 🧩 10. MISSING BUT NEEDED

* Real MLS ingestion (API)
* Database (Prisma)
* Email system
* Queue system
* Background jobs
* Authentication (future)
* Analytics tracking
* Conversion tracking
* Image CDN / optimization
* ISR / revalidation strategy

---

# 🧾 11. TERMINOLOGY

* Listing = MLS property
* Address Page = `/home/[slug]`
* City Hub = `/[city]-co-real-estate`
* Neighborhood Page = `/neighborhood/[slug]`
* Guide = long-form neighborhood content
* Blog Article = `/blog/[city]/[topic]`
* Comparison Page = `/compare/[city]/[otherCity]`
* Property Search Page = `/homes/[city]/[type]`
* Lead Capture = email collection UI
* Authority Engine = content cluster system

---

# 🧠 12. ASSUMPTIONS MADE

* MLS data will be available via API
* User will integrate CRM later
* SEO-first strategy prioritized over UX polish
* Static generation preferred over SSR initially
* Content will be programmatically expanded
* Boulder County is primary initial market
* Images will be added later to `/public/images`

---

END OF CONTEXT


2026-03-14
CHAT METADATA
Start Date: 2026-03-24
End Date: 2026-03-24
Active Hours (excluding today): 0


1. PROJECT SNAPSHOT (CURRENT STATE)

COMPLETED IN THIS CHAT
- Listing Index Engine (/homes/[city])
- MLS ingestion scaffold (API + data layer)
- Listing Freshness Engine (/new-listings/[city], /price-drops/[city])
- Auto-Expansion Engine (/search/[city]/[query])
- Structural cleanup (removed /app/[city])
- Platform architecture document created
- System registry created

FUNCTIONAL
- City listing index pages rendering property data
- Fresh listings pages (static filtering)
- Auto-generated SEO expansion pages
- MLS sync API returning mock data

PARTIALLY COMPLETE
- MLS ingestion (mock only, no real feed)
- Fresh listings logic (no timestamps)
- Expansion pages (no real filtering logic)
- Listings not connected to database

NOT BUILT / UNCERTAIN
- Real MLS API integration
- Database (PostgreSQL + Prisma)
- Real-time updates
- Listing ranking/sorting
- Index acceleration system


2. SYSTEM ARCHITECTURE (UPDATED)

MLS INGESTION SYSTEM
Flow:
MLS Feed (future)
→ fetchMLSListings()
→ /api/mls-sync
→ (future) Database
→ Frontend pages

Current:
- Mock data in /lib/mlsSync.ts
- API returns JSON listings

Constraint:
- Must support incremental + daily sync


ALERT SYSTEM
- Not modified in this chat


EMAIL SYSTEM
- Not modified in this chat


QUEUE SYSTEM
- Not implemented
- Required for MLS ingestion + alerts


FRONTEND

Listing Index Engine:
/homes/[city]
- Filters properties by city
- Links to /property/[slug]

Listing Freshness Engine:
/new-listings/[city]
/price-drops/[city]
- Filtered subsets of listings
- Static logic (temporary)

Auto-Expansion Engine:
/search/[city]/[query]
- Programmatic SEO pages
- Generated from dataset


API LAYER

/api/mls-sync
- Calls fetchMLSListings()
- Returns listing data
- Will trigger ingestion pipeline later


DATABASE (PRISMA)
Status: Not implemented

Future Flow:
MLS Feed
→ Database (PostgreSQL)
→ Prisma ORM
→ Frontend queries


3. FILES CREATED / MODIFIED

/app/homes/[city]/page.tsx
- City listing index
- Filters by city
- Displays property cards

/lib/mlsSync.ts
- Mock MLS ingestion
- Returns sample listings

/app/api/mls-sync/route.ts
- API endpoint
- Returns MLS data

/lib/freshListings.ts
- getNewListings(city)
- getPriceDrops(city)
- Filters property dataset

/app/new-listings/[city]/page.tsx
- Displays new listings per city

/data/expansionQueries.ts
- List of SEO queries

/app/search/[city]/[query]/page.tsx
- Programmatic search pages

/docs/platform-architecture.md
- Master routing + system blueprint

/lib/platformSystems.ts
- Registry of platform systems


4. BUSINESS LOGIC & RULES

LISTING LOGIC
- Filter properties by city
- Display: price, beds, baths, sqft

FRESH LISTINGS (TEMP)
- New listings = first N results
- Price drops = threshold filter
- Will be replaced by MLS change tracking

EXPANSION LOGIC
- Pages = city × query
- URL: /search/[city]/[query]

SEO RULES
- All pages link to:
  - property pages
  - city hubs
- System must scale programmatically


5. ENVIRONMENT / CONFIG

External Services (Planned)
- REcolorado
- IRES MLS

Current
- No API keys
- No integrations active


6. WORKFLOWS

LISTING INDEX FLOW
1. User visits /homes/[city]
2. Filter properties
3. Render listings
4. Link to /property/[slug]

MLS SYNC FLOW (CURRENT)
1. Call /api/mls-sync
2. Run fetchMLSListings()
3. Return mock data

FUTURE MLS FLOW
1. Fetch MLS
2. Normalize
3. Store in DB
4. Render pages

FRESH LISTINGS FLOW
1. Visit /new-listings/[city]
2. Filter listings
3. Limit results
4. Render

AUTO-EXPANSION FLOW
1. Generate static params
2. Create pages
3. Render SEO content
4. (Future) attach filtered listings


7. KNOWN ISSUES / RISKS

- Static data only (no DB)
- Fresh listings not real-time
- No MLS connection
- No caching/ISR
- No ranking algorithm
- API not production-safe
- Potential URL fragmentation


8. NEXT PRIORITIES

1. Database (PostgreSQL + Prisma)
2. MLS ingestion pipeline
3. Listing ranking system
4. Index acceleration engine
5. Map search improvements
6. Replace static data with DB
7. Consolidate one-off pages


9. STANDARDS & CONSTRAINTS

- Must scale to 10k–100k+ pages
- Programmatic-first architecture
- No duplicate routes
- Strong internal linking
- MLS ingestion must be incremental
- API routes must be non-blocking
- Use queues for async processing (future)


10. MISSING BUT NEEDED

- Database (PostgreSQL)
- Prisma schema
- MLS API integration
- Listing timestamps
- Price history
- Ranking logic
- Index acceleration
- Caching strategy
- Queue system


11. TERMINOLOGY

Listing = property from MLS
Property Page = /property/[slug]
Address Page = /home/[slug]
City Hub = /[city]-real-estate
Listing Index = /homes/[city]
Fresh Listings = /new-listings/[city]
Expansion Page = /search/[city]/[query]
MLS Sync = ingestion process
Engine = scalable system


12. ASSUMPTIONS

- MLS via API (not manual)
- Data moves to DB later
- Focus on Boulder County cities
- Expansion queries will grow
- Fresh listings will use timestamps
- Platform targets Zillow-scale structure
- Next.js App Router remains core


2026-03-14
PROJECT BRAIN — CONTEXT CAPTURE

Chat Start Date: 2026-03-14
Chat End Date (moved to new chat): 2026-03-14
Active Hours Worked (excluding today): ~3–5 hours

---

## 🧱 1. PROJECT SNAPSHOT (CURRENT STATE)

Work Completed in This Chat:

* Set up Prisma ORM (v7) with Supabase PostgreSQL
* Designed and implemented core Property database schema
* Configured environment variables and Prisma connection
* Resolved Prisma 7 config changes (moved DB connection to prisma.config.ts)
* Executed successful database migration
* Verified database via Prisma Studio

Now Functional:

* Supabase PostgreSQL connected to Prisma
* Prisma schema synced to database
* Core tables created:

  * Property
  * PropertyPhoto
  * PriceHistory
  * OpenHouse
* Prisma Studio operational

Partially Complete:

* MLS ingestion pipeline (basic version scaffolded but not production-ready)
* API route for MLS sync exists but not optimized

Broken / Uncertain:

* No queue system yet (critical for scale)
* No search index integration yet
* No MLS credentials configured
* No real data ingestion tested
* No PostGIS enabled

---

## 🏗️ 2. SYSTEM ARCHITECTURE (UPDATED)

### MLS Ingestion System (Partial)

Flow (current):
MLS API → fetch → normalize → process → upsert → store photos

Status:

* Fetch layer scaffolded
* Normalization layer defined
* Upsert logic implemented
* Photo ingestion basic (no optimization)
* No queue (currently synchronous)

Constraint:

* Must be converted to async queue-based system before scaling

---

### Queue System (Not Built Yet)

Planned:
MLS → Queue → Workers → DB

Requirements:

* Parallel processing
* Retry logic
* Non-blocking ingestion
* Scalable to 100k+ listings

---

### Email System

* RESEND_API_KEY present
* No logic implemented in this chat

---

### Alert System

* Not touched in this chat

---

### Frontend (UI / Pages)

Already exists (from prior system):

* Property pages
* City pages
* Search pages
* Map pages

No UI changes in this chat

---

### API Layer

Created:

* /api/mls-sync

Logic:

* Fetch MLS listings
* Loop through listings
* Process each listing

Constraint:

* Currently synchronous (must be replaced with queue)

---

### Database (Prisma + Supabase)

Stack:
Next.js → Prisma → Supabase PostgreSQL

Schema Implemented:

Property:

* Core listing data
* Geo coordinates (lat/lng)
* Relationships to photos, history, open houses

PropertyPhoto:

* URL + order

PriceHistory:

* Event-based tracking

OpenHouse:

* Time-based events

Indexes (planned but not yet added):

* city
* status
* price
* lat/lng

---

## 🗂️ 3. FILES CREATED / MODIFIED

/prisma/schema.prisma

* Defined Property, PropertyPhoto, PriceHistory, OpenHouse models

/prisma.config.ts

* Configured Prisma 7 datasource via DATABASE_URL
* Added dotenv loading for .env.local

/lib/db.ts

* Singleton Prisma client setup

/lib/mls/fetchMLS.ts

* Fetch MLS listings from API

/lib/mls/normalizeListing.ts

* Normalize MLS data → internal schema

/lib/mls/upsertListing.ts

* Upsert property into DB
* Generate slug

/lib/mls/processPhotos.ts

* Store listing photos

/lib/mls/processListing.ts

* Orchestrates normalization → upsert → photos

/app/api/mls-sync/route.ts

* API endpoint to trigger ingestion

.env.local

* Added DATABASE_URL
* Contains Supabase + Resend keys

---

## 🧠 4. BUSINESS LOGIC & RULES

Listing Rules:

* MLS ID is unique identifier (mlsId)
* Listings are upserted (no duplicates)
* Slug = address + city (SEO-friendly)

Photo Rules:

* Existing photos deleted and replaced on update
* Order preserved

Data Normalization:

* MLS fields mapped to internal schema
* Missing fields allowed (nullable)

Status Handling (planned):

* Active / Pending / Sold / etc.

---

## ⚙️ 5. ENVIRONMENT / CONFIG

Environment Variables:

Required:

* DATABASE_URL (Supabase Postgres)
* MLS_API_URL (not yet set)
* MLS_API_KEY (not yet set)

Existing:

* NEXT_PUBLIC_SUPABASE_URL
* NEXT_PUBLIC_SUPABASE_ANON_KEY
* SUPABASE_SERVICE_ROLE_KEY
* RESEND_API_KEY

External Services:

* Supabase (PostgreSQL)
* Prisma ORM
* Resend (email)

---

## 🔁 6. WORKFLOWS (STEP-BY-STEP)

### Database Initialization Flow

1. Define schema in schema.prisma
2. Configure prisma.config.ts
3. Add DATABASE_URL to .env.local
4. Run prisma migrate dev
5. Tables created in Supabase
6. Verify via Prisma Studio

---

### MLS Ingestion Flow (Current)

1. Call /api/mls-sync
2. fetchMLSListings()
3. Loop through listings
4. normalizeListing()
5. upsertListing()
6. processPhotos()
7. Store in DB

---

## 🚧 7. KNOWN ISSUES / RISKS

* No queue → ingestion will not scale
* Sequential processing → slow + blocking
* No retry mechanism
* Photo ingestion inefficient (no batching/CDN)
* No search index → poor query performance later
* No PostGIS → map queries will be slow at scale
* No MLS API configured yet
* Slug collisions possible (not handled)
* No rate limiting for MLS API

---

## 🎯 8. NEXT PRIORITIES

1. Build Queue System (CRITICAL)
2. Convert MLS ingestion to async workers
3. Add search index (Typesense/Elasticsearch)
4. Add DB indexes for performance
5. Enable PostGIS for geo queries
6. Optimize photo pipeline (Cloudinary)
7. Add error handling + retries
8. Implement status change handling
9. Add sitemap + indexing triggers

---

## 📏 9. STANDARDS & CONSTRAINTS (CRITICAL)

* All ingestion must be async (queue-based)
* No heavy processing in API routes
* Database writes must be idempotent (upsert)
* System must scale to 100k–1M listings
* Must support real-time MLS updates
* Avoid duplicate listings (mlsId unique)
* All long-running tasks → background workers
* SEO-first architecture (slug-based URLs)

---

## 🧩 10. MISSING BUT NEEDED (GAPS)

* Queue system (Upstash/BullMQ)
* Worker processors
* Search indexing layer
* Geo spatial engine (PostGIS)
* MLS credentials + integration
* Image optimization pipeline
* Internal linking engine
* Ranking algorithm
* Google indexing automation

---

## 🧾 11. TERMINOLOGY (NORMALIZED)

Listing = Property from MLS
Property = Database record of listing
MLS = External listing data source
Ingestion = Process of importing MLS data
Worker = Background job processor
Queue = Job distribution system
Slug = SEO URL identifier
Search Index = External fast query engine
Geo Search = Map-based property filtering

---

## 🧠 12. ASSUMPTIONS MADE

* Supabase is used only as PostgreSQL (not full backend)
* Prisma is primary ORM for all DB interactions
* MLS will provide RESO-style API
* Listings volume will scale to 100k+ quickly
* SEO is primary growth channel
* Map-based search is critical feature
* Vercel will host production environment
* Queue system will be required before live MLS ingestion

---


3/15/2026
CHAT METADATA
Start Date: 2026-03-15
End Date: 2026-03-15
Active Work Time (excluding current session): ~3–4 hours

---

## 🧱 1. PROJECT SNAPSHOT (CURRENT STATE)

Work Completed:
• Implemented interactive map search using React Leaflet
• Connected map bounds → API → Prisma → database
• Seeded test listings into database
• Fixed Prisma validation + schema issues (mlsId, slug, propertyType)
• Resolved Prisma client initialization + env issues
• Built working `/api/map-listings` endpoint
• Implemented MapMarkers component
• Connected MapEvents → API calls → state updates
• Fixed longitude bounding box bug using min/max logic

Now Functional:
• Map renders correctly
• Map movement triggers API calls
• Bounding box queries return correct listings
• Prisma + PostgreSQL integration working
• Listings stored and retrievable
• Markers render dynamically from DB (confirmed via console + debug marker)

Partially Complete:
• Marker UX (still default Leaflet pins, not price markers)
• Map centering/zoom UX
• Data seeding process (manual + script partially stabilized)

Broken / Uncertain:
• Marker visibility inconsistent at wide zoom levels
• No clustering → scalability not tested
• No production MLS ingestion yet
• No SEO page integration yet

---

## 🏗️ 2. SYSTEM ARCHITECTURE (UPDATED)

### Frontend (UI / Pages)
• Next.js App Router
• React Leaflet map component
• Components:
  - MapInner → main map container
  - MapEvents → detects bounds changes
  - MapMarkers → renders markers

Flow:
User pans map → bounds change → API call → state update → markers render

Constraints:
• Client-side rendering required for Leaflet
• State-driven marker updates

---

### API Layer
Endpoint:
• `/api/map-listings`

Logic:
• Accepts: north, south, east, west
• Converts to numeric bounds
• Normalizes longitude using:
  - minLng = Math.min(west, east)
  - maxLng = Math.max(west, east)
• Queries Prisma with bounding box
• Returns limited dataset (take: 500)

Constraints:
• Must handle negative longitude correctly
• Must be fast (called frequently on map movement)

---

### Database (Prisma)

Model: Property

Required fields:
• id (cuid)
• mlsId (unique)
• slug (unique)
• address, city, state, zip
• price, beds, baths
• propertyType, status
• lat, lng

Optional:
• sqft, lotSize, yearBuilt
• neighborhood, subdivision, schoolDistrict
• description
• listingAgent, listingOffice

Indexes:
• city, status, price, beds, baths, propertyType
• lat/lng (critical for map queries)

Relations:
• PropertyPhoto
• PriceHistory
• OpenHouse

---

### Queue System
• BullMQ present but NOT used in this chat

---

### MLS Ingestion System
• NOT implemented yet

---

### Alert System
• NOT implemented yet

---

### Email System
• NOT implemented yet

---

## 🗂️ 3. FILES CREATED / MODIFIED

### /components/maps/MapInner.tsx
Purpose:
• Main map container + state manager

Key Logic:
• Stores properties in state
• Fetches listings on bounds change
• Calls `/api/map-listings`
• Renders MapMarkers

---

### /components/maps/MapMarkers.tsx
Purpose:
• Render markers for properties

Key Logic:
• Maps through properties array
• Creates Marker + Popup per listing
• Displays price, address, city, link

---

### /components/maps/MapEvents.tsx
Purpose:
• Detect map movement + bounds change

Key Logic:
• Extracts map bounds
• Sends structured bounds to parent

---

### /app/api/map-listings/route.ts
Purpose:
• Serve listings based on map bounds

Key Logic:
• Parse query params
• Normalize longitude (min/max fix)
• Prisma bounding box query
• Return JSON results

---

### /scripts/seedTestProperties.ts
Purpose:
• Seed test listings into database

Key Logic:
• Uses prisma.property.createMany
• Required fields enforced (mlsId, slug, propertyType, etc.)

---

## 🧠 4. BUSINESS LOGIC & RULES

• Listings are filtered strictly by bounding box
• Max 500 listings returned per request
• Lat/Lng required for all listings
• Slug required for routing
• mlsId must be unique
• propertyType is required (schema enforced)

User Behavior Assumptions:
• Users pan/zoom map frequently
• API must handle rapid repeated calls
• Users expect instant marker updates

---

## ⚙️ 5. ENVIRONMENT / CONFIG

Stack:
• Next.js 16 (Turbopack)
• Prisma 7
• PostgreSQL (Supabase)
• React Leaflet

Env Files:
• .env
• .env.local

Key Requirement:
• DATABASE_URL must be present for Prisma

---

## 🔁 6. WORKFLOWS (STEP-BY-STEP)

### Map Search Flow

1. User opens map page
2. Map initializes with center + zoom
3. MapEvents detects bounds
4. Bounds passed to MapInner
5. API request sent to `/api/map-listings`
6. Backend queries Prisma with bounding box
7. Listings returned
8. State updated in MapInner
9. MapMarkers re-renders markers

---

### Data Seeding Flow

1. Run seed script via terminal
2. Prisma inserts listings
3. Listings stored in PostgreSQL
4. Available for map queries

---

## 🚧 7. KNOWN ISSUES / RISKS

• Markers hard to see at large zoom levels
• No clustering → performance risk at scale
• API called very frequently → potential rate/performance issue
• No caching layer
• No debounce on map movement
• Prisma queries not yet optimized for large datasets

---

## 🎯 8. NEXT PRIORITIES

1. Implement Zillow-style price markers
2. Add marker clustering (critical for scale)
3. Optimize map query performance (debounce + caching)
4. Build tile-based map query system
5. Begin MLS ingestion pipeline
6. Connect map data to SEO page generation

---

## 📏 9. STANDARDS & CONSTRAINTS (CRITICAL)

• API must be stateless and fast
• No blocking operations in map API
• Queries must be indexed (lat/lng critical)
• System must scale to 100k–200k listings
• UI must update in real-time on map movement
• All required Prisma fields must be populated

---

## 🧩 10. MISSING BUT NEEDED (GAPS)

• MLS ingestion pipeline
• Listing update system
• Marker clustering
• Price-based marker UI
• Caching layer (Redis or similar)
• Rate limiting / debounce
• SEO page generation system
• Image/photo handling pipeline

---

## 🧾 11. TERMINOLOGY (NORMALIZED)

Listing:
• Property record in database

Property:
• Same as listing (database entity)

Map Bounds:
• north, south, east, west coordinates

Bounding Box Query:
• Filtering listings within visible map area

Marker:
• Visual representation of a listing on map

Slug:
• URL-safe identifier for property page

---

## 🧠 12. ASSUMPTIONS MADE

• All listings will include valid lat/lng
• Map queries will scale to large datasets
• Supabase PostgreSQL used as primary DB
• User experience should mimic Zillow-style search
• Frontend remains client-rendered for map interactions
• Prisma remains primary ORM


2026-03-15
CHAT METADATA
Start Date: 2026-03-15
End Date: 2026-03-15
Active Hours Worked: ~4–6 hours (excluding current session)

---

## 🧱 1. PROJECT SNAPSHOT (CURRENT STATE)

WORKED ON:
- React Leaflet map system
- Dynamic viewport-based property search
- API for map listings
- Debugging marker rendering issues
- Fixing Next.js / Leaflet SSR issues
- Implementing PostGIS (geospatial database upgrade)
- Transitioning API from lat/lng filtering → spatial queries

FUNCTIONAL:
- Map renders correctly
- Zoom + bounds tracking working
- API `/api/map-listings` returns correct data
- Markers render dynamically based on viewport
- Property popup (price, address, link) works
- PostGIS enabled and spatial index created
- Spatial query using `ST_Intersects + ST_MakeEnvelope` working

PARTIALLY COMPLETE:
- Marker sizing/styling (needs refinement)
- Popup UI (needs typography scaling)
- Map zoom smoothness (trackpad choppy)
- Clustering not yet implemented
- Performance optimizations incomplete

BROKEN / UNCERTAIN:
- Map disappearing at extreme zoom levels (likely tile limit issue)
- No clustering → potential performance bottleneck at scale
- No caching layer
- No tile-based query system yet

---

## 🏗️ 2. SYSTEM ARCHITECTURE (UPDATED)

### FRONTEND (UI / PAGES)
- Next.js 16 (App Router)
- React Leaflet for map rendering
- Components:
  - MapInner → main map container
  - MapEvents → listens to bounds changes
  - MapMarkers → renders markers
  - PriceMarker → custom marker UI
- Data flow:
  Map movement → bounds change → API fetch → state update → markers render

---

### API LAYER
- Route: `/app/api/map-listings/route.ts`
- Handles:
  - Receives bounding box (north, south, east, west)
  - Executes spatial query using PostGIS
- Query:
  - Uses `ST_Intersects`
  - Uses `ST_MakeEnvelope`
- Returns:
  - id, price, lat, lng, address, city, slug

---

### DATABASE (PRISMA + POSTGRES + POSTGIS)

TABLE:
- Property

FIELDS (relevant):
- id
- price
- lat
- lng
- address
- city
- slug
- location (geometry Point, SRID 4326)

GEOSPATIAL SETUP:
- PostGIS extension enabled
- Geometry column added: `location`
- Data converted via:
  ST_SetSRID(ST_MakePoint(lng, lat), 4326)
- Spatial index:
  GiST index on `location`

DATA FLOW:
- Raw lat/lng → converted → stored as geometry
- API → spatial query → indexed lookup → fast results

---

### MLS INGESTION SYSTEM
- Not modified in this chat

---

### ALERT SYSTEM
- Not modified in this chat

---

### EMAIL SYSTEM
- Not modified in this chat

---

### QUEUE SYSTEM
- Not modified in this chat

---

## 🗂️ 3. FILES CREATED / MODIFIED

### `/components/maps/MapInner.tsx`
- Purpose: Main Leaflet map container
- Added:
  - MapContainer setup
  - zoom, minZoom, maxZoom
  - scrollWheelZoom
  - bounds handler (handleBoundsChange)
  - API fetch logic
- Fixed:
  - JSX syntax errors
  - Nested MapContainer bug
  - Return structure errors

---

### `/components/maps/MapMarkers.tsx`
- Purpose: Render all markers
- Logic:
  - Maps property array → PriceMarker
  - Wrapped in clustering container (placeholder)

---

### `/components/maps/PriceMarker.tsx`
- Purpose: Custom price-based marker
- Logic:
  - Uses Leaflet `divIcon`
  - Formats price ($XXXK / $XM)
  - Popup includes:
    - price
    - address
    - city
    - listing link

---

### `/app/api/map-listings/route.ts`
- Purpose: Fetch properties within map bounds
- Updated:
  - Replaced numeric filtering with PostGIS query
- Key logic:
  - ST_Intersects(location, ST_MakeEnvelope(...))
  - Prisma `$queryRaw` used
- Fixed:
  - Syntax errors (duplicate const, malformed mapping)

---

## 🧠 4. BUSINESS LOGIC & RULES

- Map loads listings ONLY within visible viewport
- Listings capped (LIMIT 500) to prevent overload
- Longitude must be handled as min/max due to negatives
- Geometry must use:
  - SRID 4326
  - (lng, lat) order (NOT lat/lng)
- Marker label formatting:
  - ≥1M → M format
  - ≥1K → K format

---

## ⚙️ 5. ENVIRONMENT / CONFIG

- Supabase PostgreSQL (production)
- PostGIS extension enabled
- Prisma ORM
- Leaflet CSS required:
  `import "leaflet/dist/leaflet.css"`

No new env variables introduced

---

## 🔁 6. WORKFLOWS (STEP-BY-STEP)

### MAP DATA FLOW

1. User loads map page
2. Map initializes (center + zoom)
3. MapEvents detects bounds
4. Bounds passed to `handleBoundsChange`
5. API request:
   `/api/map-listings?north=...&south=...&east=...&west=...`
6. API executes PostGIS query
7. Database returns matching listings
8. API returns JSON
9. Frontend updates `properties` state
10. MapMarkers re-renders markers

---

### DATABASE GEOSPATIAL SETUP FLOW

1. Enable PostGIS
2. Add geometry column
3. Convert lat/lng → geometry point
4. Create GiST index
5. API switches to spatial queries

---

## 🚧 7. KNOWN ISSUES / RISKS

- No clustering → performance risk at scale
- Map disappears at extreme zoom (tile limitation)
- Trackpad zoom is choppy (Leaflet defaults)
- Popup and marker UI not production-ready
- No caching → repeated API hits
- LIMIT 500 may hide listings at scale
- No pagination or tile system

---

## 🎯 8. NEXT PRIORITIES

1. Implement marker clustering (Supercluster)
2. Improve map performance (reduce re-renders)
3. Smooth zoom behavior
4. Improve marker + popup UI/UX
5. Introduce caching (Redis)
6. Transition to tile-based querying system
7. Build map + listings split layout (Zillow-style)

---

## 📏 9. STANDARDS & CONSTRAINTS (CRITICAL)

- Must use PostGIS for all map queries (no raw lat/lng filtering)
- All geospatial queries must be indexed (GiST)
- API routes must remain fast (<500ms target)
- No heavy computation in frontend
- Map must be scalable to 100k–1M listings
- Queries must be bounded (viewport or tile)
- Use LIMIT safeguards to prevent overload

---

## 🧩 10. MISSING BUT NEEDED (GAPS)

- Marker clustering system
- Tile-based query architecture
- Redis caching layer
- Listing detail pages (full UX)
- Filters (price, beds, etc.)
- SEO page engine
- MLS ingestion automation
- Authentication + user system

---

## 🧾 11. TERMINOLOGY (NORMALIZED)

- Listing = Property record in database
- Property = database entity
- Marker = map UI element representing listing
- Bounds = visible map coordinates
- Viewport Query = bounding box search
- Spatial Query = PostGIS query using geometry
- Cluster = grouped markers
- Tile = map coordinate unit (future system)

---

## 🧠 12. ASSUMPTIONS MADE

- Property table uses `lat` and `lng` fields
- Data volume will scale to 100k+ listings
- Supabase is production database
- Prisma supports raw SQL queries
- Leaflet is primary map library (not Mapbox GL)
- No clustering currently implemented
- User intends Zillow-level functionality


2026-03-16
==============================
PROJECT BRAIN — CONTEXT CAPTURE
==============================

CHAT METADATA
Start Date: 2026-03-24
End Date: 2026-03-24
Active Hours Worked (excluding today): 0h

--------------------------------------------------
1. PROJECT SNAPSHOT (CURRENT STATE)
--------------------------------------------------

WORK COMPLETED
- Finalized David Quinn Group luxury brand direction
- Selected primary logo: minimal "D | Q" architectural mark
- Generated full logo asset package for production use
- Prepared assets for MLS Grid vendor account submission
- Defined branding system for website + platform usage

NOW FUNCTIONAL
- Complete logo system (black/white luxury style)
- Exported assets ready for:
  - MLS Grid upload
  - Website integration
  - Social media
  - Marketing
- Monogram (DQ) defined for multi-use branding

PARTIALLY COMPLETE
- Brand system defined but not implemented in UI
- Map marker branding defined but not built
- Header/logo integration not coded yet

BROKEN / UNCERTAIN
- SVG is a basic reconstruction (not true vector typography)
- Logo kerning/spacing not pixel-perfect
- Icon crops are approximate
- No design system tokens implemented

--------------------------------------------------
2. SYSTEM ARCHITECTURE (UPDATED)
--------------------------------------------------

FRONTEND (UI / PAGES)
- Header will use horizontal logo: "D | Q DAVID QUINN GROUP"
- Favicon + map markers will use "DQ" monogram
- UI direction: minimal, black/white, typography-first

MLS INGESTION SYSTEM
- No structural changes
- New dependency: logo required for MLS Grid onboarding

API LAYER
- No changes

DATABASE (PRISMA)
- No changes

EMAIL SYSTEM
- No changes
- Branding usage defined but not implemented

QUEUE SYSTEM
- No changes

ALERT SYSTEM
- No changes

DATA FLOW (UPDATED CONTEXT)

User → Website → MLS Grid → IDX Feed → Database → UI

+ Branding Layer:
Logo Assets → Website / MLS / Marketing / Map UI

KEY CONSTRAINTS
- Branding must be minimal and scalable
- Logo must not compete with listing imagery
- Monogram must work at very small sizes

--------------------------------------------------
3. FILES CREATED / MODIFIED
--------------------------------------------------

ASSETS (NOT YET IN REPO)

PATH: /assets/logo/
- david_quinn_logo.jpg
  PURPOSE: MLS Grid upload (primary required asset)

- david_quinn_logo_transparent.png
  PURPOSE: Website header, overlays

- david_quinn_logo_black.png
  PURPOSE: Light background usage

- david_quinn_logo_white.png
  PURPOSE: Dark UI usage

- david_quinn_logo.svg
  PURPOSE: Vector (basic reconstruction, not final)

PATH: /assets/icons/
- david_quinn_icon_512.png
  PURPOSE: App icon, social, map marker base

- favicon_32.png
  PURPOSE: Browser favicon

PATH: /assets/package/
- david_quinn_logo_package.zip
  PURPOSE: Consolidated asset delivery

--------------------------------------------------
4. BUSINESS LOGIC & RULES
--------------------------------------------------

BRANDING RULES
- Style: luxury, minimal, monochrome (black preferred)
- Typography-first (no complex graphics)
- Must scale from favicon → signage

LOGO USAGE RULES
- Horizontal logo → website header
- Monogram (DQ) → favicon, map markers, social, watermark

VISUAL HIERARCHY
- Primary: DAVID QUINN
- Secondary: GROUP
- Accent: D | Q

UX RULES
- Logo must not distract from listings
- UI should feel editorial and high-end

--------------------------------------------------
5. ENVIRONMENT / CONFIG
--------------------------------------------------

EXTERNAL SERVICES
- MLS Grid (IDX provider)

REQUIREMENTS INTRODUCED
- MLS Grid vendor account requires:
  - company logo (JPG)
  - website
  - business information

ENV VARIABLES
- No changes

--------------------------------------------------
6. WORKFLOWS (STEP-BY-STEP)
--------------------------------------------------

MLS GRID ONBOARDING FLOW
1. Create MLS Grid account
2. Submit:
   - business details
   - website
   - logo (david_quinn_logo.jpg)
3. Await approval
4. Receive IDX credentials
5. Connect to ingestion pipeline

BRANDING IMPLEMENTATION FLOW

WEBSITE
1. Place logo in /public/logo.png
2. Place favicon in /public/favicon.png
3. Render in header component

MAP UI
1. Create custom marker component
2. Insert DQ monogram
3. Replace default MLS pins

LISTING IMAGES
1. Apply DQ watermark
2. Position bottom corner
3. Use 15–20% opacity

--------------------------------------------------
7. KNOWN ISSUES / RISKS
--------------------------------------------------

- SVG is not production-grade vector
- Typography not perfectly refined
- Icon scaling may break at small sizes
- No retina/hi-res export set
- No automated asset pipeline
- No design token system
- Branding not yet integrated into UI

--------------------------------------------------
8. NEXT PRIORITIES
--------------------------------------------------

1. Complete MLS Grid account setup + approval
2. Integrate IDX feed into ingestion system
3. Activate property sync pipeline
4. Implement branded map markers (DQ)
5. Build website header + navigation UI
6. Design listing cards
7. Build neighborhood pages
8. Implement email branding templates

--------------------------------------------------
9. STANDARDS & CONSTRAINTS (CRITICAL)
--------------------------------------------------

- Branding must be:
  - minimal
  - scalable
  - reusable across all surfaces

- UI must:
  - prioritize listings over branding
  - remain clean and fast

- Assets must:
  - support multiple resolutions
  - work on light and dark backgrounds

- System must:
  - be production-safe
  - avoid blocking operations

--------------------------------------------------
10. MISSING BUT NEEDED (GAPS)
--------------------------------------------------

- True professional vector logo (final typography)
- Design system (colors, spacing, typography tokens)
- Component library (UI system)
- Map marker SVG system
- Automated watermarking system
- Email template system
- Formal brand guidelines document

--------------------------------------------------
11. TERMINOLOGY (NORMALIZED)
--------------------------------------------------

- Listing = property from MLS
- MLS Grid = IDX data provider
- Monogram = "DQ" icon
- Logo = full "D | Q + DAVID QUINN GROUP"
- Icon = square DQ mark
- Watermark = overlay on listing images
- Header Logo = horizontal logo version
- Map Marker = branded map pin

--------------------------------------------------
12. ASSUMPTIONS MADE
--------------------------------------------------

- Brand direction = black/white luxury
- Logo acceptable for MVP (not final forever)
- MLS Grid accepts JPG logo
- Website built with Next.js using /public assets
- Branding should match top-tier brokerages (Compass-level)


2026-03-16
==============================
PROJECT BRAIN — CONTEXT CAPTURE
==============================
CHAT_START_DATE: 2026-03-16
CHAT_END_DATE: 2026-03-24
ACTIVE_BUILD_HOURS_EST: 18-24

PROJECT: Colorado Real Estate SEO Platform

SECTION 1: PROJECT SNAPSHOT (CURRENT STATE)

WORKED_ON:
- Programmatic SEO engine (category + city pages)
- Internal linking engine
- Neighborhood page generator
- Seller valuation engine
- MLS activity feed engine
- Market trend intelligence engine
- Interactive map search (Leaflet integration)
- Prisma schema optimization for scale
- MLS Grid (IRES IDX) onboarding clarification

FULLY_FUNCTIONAL:
- Next.js 16 App Router architecture
- Supabase PostgreSQL + Prisma ORM
- Core database schema (Property, PropertyPhoto, 

PriceHistory, OpenHouse)
- Search API (/api/search)
- Dynamic city pages (/homes-for-sale/[city])
- PropertyCard component
- City SEO pages (/[city]-real-estate)
- Programmatic pages (/[category]-[city]-co)
- Neighborhood pages (/[city]/[neighborhood]-homes-for-sale)
- Internal linking engine (city-level)
- Seller valuation pages (/home-value-[city])
- MLS activity pages (structure complete)
- Market trend pages (UI + routing complete)

PARTIALLY_COMPLETE:
- Interactive map search (renders, not DB-connected)
- Market analytics (UI exists, no real data)
- MLS ingestion system (awaiting MLS Grid credentials)
- Programmatic pages (no filtering logic yet)
- Activity feed pages (no real MLS logic yet)

BROKEN_OR_UNCERTAIN:
- Leaflet SSR issue (resolved via dynamic import)
- Missing Leaflet marker assets
- Map not connected to real listings
- No MLS Grid API integration yet

SECTION 2: SYSTEM ARCHITECTURE (UPDATED)

MLS_INGESTION_SYSTEM:
- Source: MLS Grid (IRES IDX via RESO Web API)
- Endpoints: /Property, /Media, /OpenHouse
- Flow: Fetch → Normalize → Queue → Worker → DB
- Tables: Property, PropertyPhoto, PriceHistory, OpenHouse

QUEUE_SYSTEM:
- BullMQ + Redis
- Jobs: ingestion, photo processing, indexing
- Worker: workers/mlsWorker.ts

FRONTEND_UI_PAGES:
- /homes-for-sale/[city]
- /[city]-real-estate
- /[category]-[city]-co
- /[city]/[neighborhood]-homes-for-sale
- /home-value-[city]
- /[city]/new-listings
- /[city]/price-reductions
- /[city]/open-houses
- /[city]/recently-sold
- /[city]-housing-market
- /map/[city]

API_LAYER:
- /api/search (Prisma-based queries)
- Future: MLS ingestion endpoints, map bounding box queries

DATABASE_PRISMA:
- Models: Property, PropertyPhoto, PriceHistory, OpenHouse
- Indexes:
  - city
  - status
  - price
  - beds
  - baths
  - propertyType
  - lat,lng (composite)
  - relation indexes (propertyId)

DATA_FLOW:
MLS Grid API
→ fetchMLS.ts
→ normalizeListing.ts
→ enqueueListings.ts
→ BullMQ
→ mlsWorker.ts
→ Prisma DB
→ Search API / Pages / Map

SECTION 3: FILES CREATED / MODIFIED

PAGES:
- app/homes-for-sale/[city]/page.tsx → city listings
- app/[city]-real-estate/page.tsx → city SEO
- app/[category]-[city]-co/page.tsx → programmatic pages
- app/[city]/[neighborhood]-homes-for-sale/page.tsx → neighborhood pages
- app/home-value-[city]/page.tsx → seller pages
- app/[city]/new-listings/page.tsx → activity
- app/[city]/price-reductions/page.tsx → activity
- app/[city]/open-houses/page.tsx → activity
- app/[city]/recently-sold/page.tsx → activity
- app/[city]-housing-market/page.tsx → market pages
- app/map/[city]/page.tsx → map entry

COMPONENTS:
- components/PropertyCard.tsx → listing UI
- components/maps/NearbyHomesMap.tsx → dynamic wrapper
- components/maps/MapInner.tsx → Leaflet map
- components/internal-links/CityInternalLinks.tsx → internal links

LINKING:
- lib/linking/getInternalLinks.ts → generate related city links

DATA:
- data/cities.ts
- data/programmaticPages.ts
- data/neighborhoods.ts

DATABASE:
- prisma/schema.prisma → added indexes for scale

SECTION 4: BUSINESS LOGIC & RULES

- Listings filtered by city (current)
- Future filters: price, beds, baths, propertyType
- Programmatic pages:
  - generated from category + city
  - title/description templating
- Neighborhood pages:
  - must match city + neighborhood slug
- Internal linking:
  - exclude current city
  - limit to ~5 links
- Seller pages:
  - city-based valuation funnel
- Activity pages:
  - based on listing status + changes

  SECTION 5: ENVIRONMENT / CONFIG

SERVICES:
- Supabase (PostgreSQL)
- Prisma ORM
- BullMQ + Redis
- Leaflet + React Leaflet
- MLS Grid (pending)

PENDING_CREDENTIALS:
- MLS Grid Client ID
- MLS Grid Client Secret
- MLS Grid API endpoint

SECTION 6: WORKFLOWS

MLS_INGESTION_FLOW:
1. Call MLS Grid API
2. Fetch listings
3. Normalize data
4. Queue jobs
5. Worker processes jobs
6. Insert/update DB
7. Trigger search updates

PAGE_GENERATION_FLOW:
1. Load cities/categories dataset
2. Generate static params
3. Render page
4. Query search API
5. Display PropertyCard

MAP_FLOW:
1. Load /map/[city]
2. Render Leaflet client-side
3. (future) fetch listings
4. render markers

SECTION 7: KNOWN ISSUES / RISKS

- Leaflet SSR issue (resolved)
- Missing marker assets
- No clustering for large datasets
- No bounding box search yet
- No advanced filtering yet
- Programmatic pages not filtered by type
- Market data not real
- MLS ingestion not connected

SECTION 8: NEXT PRIORITIES

1. Integrate MLS Grid API (IRES)
2. Load real listings into map
3. Implement bounding box queries
4. Add map clustering
5. Build listing freshness engine
6. Add PostGIS (geospatial indexing)
7. Improve search filtering
8. Build sitemap engine
9. Connect market analytics to DB

SECTION 9: STANDARDS & CONSTRAINTS

- All ingestion must use queue system
- Must scale to 100K–200K listings
- No blocking API routes
- Must support multi-MLS in future
- Must use dynamic routing for SEO
- Must use DB indexing for performance
- Map must be client-side only (no SSR)

SECTION 10: MISSING BUT NEEDED

- MLS Grid API integration
- PostGIS spatial queries
- Map clustering
- Bounding box search
- Category-based filtering logic
- Market analytics calculations
- Sitemap automation
- Authentication (future VOW)
- Redis caching layer

SECTION 11: TERMINOLOGY

Listing = MLS property record
Property = database record
Activity = listing status change
Programmatic Page = auto-generated SEO page
City Page = /[city]-real-estate
Neighborhood Page = /[city]/[neighborhood]-homes-for-sale
Category Page = /[category]-[city]-co
Map Search = geospatial browsing
Ingestion = MLS data import process

SECTION 12: ASSUMPTIONS

- MLS Grid IDX (not VOW) will be used
- Listings include lat/lng
- Platform will expand to multiple MLS sources
- Target scale: 100K–200K listings
- SEO scale: 1,000+ pages
- Redis available for queues


2026-03-17
==============================
PROJECT BRAIN — CONTEXT CAPTURE
===============================

Start Date: 2026-03-24
End Date (Next Chat Transition): 2026-03-24
Active Work Duration: ~3–5 hours

---

## 🧱 1. PROJECT SNAPSHOT (CURRENT STATE)

**Worked on in this chat:**

* Supercluster implementation
* Tile-based map query system
* Zillow-style map + listings sync UI
* URL-driven filter system (price, beds, type)
* Marker ↔ listing hover synchronization
* Listing click → map flyTo behavior
* Save Search system (email capture + DB persistence)
* Email alert system (queue + matching + email sending)
* MLS ingestion → alert trigger integration
* Fixed critical ingestion bug in `processListing.ts`

**Now functional:**

* PostGIS spatial queries (viewport + tile-based)
* Supercluster clustering
* Tile-based map API (`/api/map-tile/[z]/[x]/[y]`)
* Debounced map querying
* Split map + listings UI
* URL-driven filters (SEO-ready)
* Marker hover ↔ listing highlight sync
* Listing click → map center/zoom
* Save search persistence (DB)
* Alert worker pipeline (queue + matching + email send)
* MLS ingestion triggers alert jobs

**Partially complete:**

* Email alert system (no unsubscribe/compliance yet)
* Save search UX (basic, no validation/UX polish)
* Email templates (minimal, not branded/compliant)
* Filter UI (dropdowns, no slider/polish)
* Map tile caching (basic, not optimized)

**Broken / uncertain:**

* No unsubscribe mechanism (legal risk)
* No MLS/IDX disclaimers (compliance risk)
* PropertyType field consistency uncertain
* Lat/lng availability from MLS ingestion not guaranteed
* Email deliverability not validated (domain/auth not confirmed)

---

## 🏗️ 2. SYSTEM ARCHITECTURE (UPDATED)

### MLS Ingestion System

**Flow:**
MLS → `processListing()` → Prisma upsert → photo processing → queue job

**Key logic:**

* Idempotent via `mlsId`
* Upsert ensures no duplicates
* Alerts only triggered for `status === "Active"`

**Constraint:**

* Must not trigger alerts for non-active listings

---

### Alert System

**Flow:**
New listing → BullMQ job → `alertWorker` → match saved searches → send emails

**Matching logic:**

* Price ≥ minPrice
* Beds ≥ beds
* propertyType match (if defined)
* Bounding box (lat/lng within saved search)

---

### Email System

**Service:** Resend

**Function:**

* `sendListingAlert()`
* Sends single listing alert per match

**Constraints:**

* No batching yet
* No unsubscribe
* No compliance footer

---

### Queue System (BullMQ)

**Queue:** `listing-alerts`

**Producer:**

* `processListing.ts`

**Consumer:**

* `/workers/alertWorker.ts`

**Behavior:**

* Async, non-blocking
* One job per new listing

---

### Frontend (UI / Pages)

**Map System:**

* React Leaflet
* Tile-based fetching
* Supercluster rendering

**UI Features:**

* Split view (map + listings)
* Hover sync (marker ↔ listing)
* Click listing → map flyTo
* URL-driven filters
* Save search input

---

### API Layer

**Endpoints:**

* `/api/map-listings` → listings for sidebar
* `/api/map-tile/[z]/[x]/[y]` → clustered map data
* `/api/save-search` → persist saved searches

**Constraints:**

* API must remain fast (no heavy logic)
* All heavy processing offloaded to workers

---

### Database (Prisma)

**Key Models:**

`Property`

* id, mlsId, price, bedrooms, bathrooms, sqft, location (PostGIS)

`SavedSearch`

* email
* city
* minPrice, beds, type
* north, south, east, west
* createdAt

---

## 🗂️ 3. FILES CREATED / MODIFIED

### `/components/maps/MapInner.tsx`

* Core map engine
* Tile fetching + clustering
* URL sync
* Listings fetch
* mapRef + flyTo logic

---

### `/components/maps/MapMarkers.tsx`

* Renders clusters + listings
* Handles hover state via props

---

### `/components/maps/PriceMarker.tsx`

* Custom Leaflet marker
* Dynamic styling based on active state
* Hover event handlers

---

### `/components/maps/MapListings.tsx`

* Listings panel
* Hover + click interactions
* Sync with map via shared state

---

### `/app/map/[city]/page.tsx`

* Top-level state:

  * listings
  * activeListingId
* Connects map + listings

---

### `/components/maps/SaveSearch.tsx`

* Email capture UI
* Sends POST to save-search API

---

### `/app/api/save-search/route.ts`

* Saves search criteria to DB
* Validates email

---

### `/lib/alerts/matchSavedSearches.ts`

* Filters saved searches against listing
* Applies price, beds, type, bbox logic

---

### `/lib/email/sendAlert.ts`

* Sends email via Resend

---

### `/workers/alertWorker.ts`

* Consumes queue jobs
* Matches searches
* Sends alerts

---

### `/lib/queue/listingQueue.ts`

* BullMQ queue definition

---

### `/lib/mls/processListing.ts`

* Fixed:

  * Queue logic moved outside Prisma
  * Uses `property` not undefined `listing`
  * Conditional alert trigger

---

## 🧠 4. BUSINESS LOGIC & RULES

* Alerts only triggered for **Active listings**
* Saved searches must include:

  * email
  * filters
  * optional bounding box
* Matching rules:

  * listing.price ≥ minPrice
  * listing.beds ≥ beds
  * listing.propertyType === type
  * listing within bounding box
* Hover behavior:

  * Marker hover → highlight listing
  * Listing hover → highlight marker
* Click behavior:

  * Listing click → map flyTo
* URL is **source of truth** for filters

---

## ⚙️ 5. ENVIRONMENT / CONFIG

**Environment variables:**

* `RESEND_API_KEY`
* `EMAIL_FROM`

**External services:**

* Resend (email)
* Supabase PostgreSQL + PostGIS
* BullMQ + Redis (queue)

---

## 🔁 6. WORKFLOWS (STEP-BY-STEP)

### New Listing Ingestion

1. MLS data fetched
2. `processListing()` called
3. Prisma upsert (idempotent)
4. Photos processed
5. If Active → queue job created

---

### Alert Trigger Flow

1. Worker receives job
2. Calls `matchSavedSearches()`
3. Filters matching searches
4. Loops through matches
5. Sends email per match

---

### Map Interaction Flow

1. User moves map
2. Debounce triggers
3. URL updated
4. Listings fetched (`map-listings`)
5. Tiles fetched (`map-tile`)
6. Features rendered

---

### Save Search Flow

1. User enters email
2. Clicks save
3. POST to `/api/save-search`
4. Stored in DB

---

## 🚧 7. KNOWN ISSUES / RISKS

* ❌ No unsubscribe system (CAN-SPAM violation risk)
* ❌ No MLS attribution/disclaimer
* ❌ Email template not branded/compliant
* ❌ No rate limiting on alerts
* ❌ Potential duplicate alerts (no dedupe logic)
* ❌ propertyType consistency unclear
* ❌ lat/lng dependency for matching may fail
* ❌ No email validation or spam protection

---

## 🎯 8. NEXT PRIORITIES

1. Unsubscribe system (CRITICAL)
2. Compliance layer (CREC, Compass, IDX)
3. Email template improvements (branding + disclaimers)
4. Alert deduplication system
5. Price slider UI
6. Save search UX improvements
7. Tile caching optimization
8. Daily digest email option

---

## 📏 9. STANDARDS & CONSTRAINTS (CRITICAL)

* All async processing MUST use queue (BullMQ)
* No heavy logic in API routes
* System must be idempotent (MLS ingestion)
* URL is source of truth for search state
* Map queries must be tile-based for scale
* Database queries must be indexed (PostGIS)
* Alerts must not block ingestion pipeline

---

## 🧩 10. MISSING BUT NEEDED (GAPS)

* Unsubscribe API + DB tracking
* Email compliance footer
* MLS attribution system
* Brokerage branding (Compass)
* Alert deduplication
* Email batching/digest
* Analytics tracking
* CRM integration
* User accounts/auth (optional future)

---

## 🧾 11. TERMINOLOGY (NORMALIZED)

* **Listing** = property from MLS
* **Saved Search** = user-defined filter set
* **Alert** = email notification triggered by new listing
* **Tile** = map grid unit (z/x/y)
* **Feature** = GeoJSON object (cluster or listing)
* **Cluster** = grouped listings from Supercluster
* **Worker** = background job processor
* **Queue Job** = async task for alerts

---

## 🧠 12. ASSUMPTIONS MADE

* `propertyType` exists in MLS data
* `lat/lng` available during ingestion
* Resend is valid production email provider
* Redis is configured for BullMQ
* Email domain will be verified later
* Users will accept email alerts without auth system
* Bounding box filtering is sufficient for location matching


2026-03-17
```
==============================
PROJECT BRAIN — CONTEXT CAPTURE
==============================

Start Date: 2026-03-17  
End Date (handoff to new chat): 2026-03-17  
Active Work Duration: ~4–6 hours  

---

## 🧱 1. PROJECT SNAPSHOT (CURRENT STATE)

### Completed in This Chat
- Fixed Prisma migration drift and database sync
- Reset and re-applied migrations successfully
- Created and applied new models: User + SavedSearch
- Built `/api/save-search` endpoint (working)
- Implemented Prisma upsert logic for users
- Fixed Prisma client initialization issues
- Installed and configured Resend email service
- Built email sending utility (`sendAlertEmail`)
- Built matching engine (`matchAndNotify`)
- Integrated alert triggering into listing ingestion
- Successfully triggered alert via `/api/test-alert`

### Fully Functional
- User creation via email (upsert)
- Saved search persistence
- Listing ingestion (processListing)
- Matching engine execution
- Email delivery via Resend
- End-to-end alert test confirmed

### Partially Complete
- Queue system exists but not fully leveraged
- Alert system currently synchronous (not production-safe)

### Broken / Uncertain
- Improper placement of `matchAndNotify` inside Prisma query (fixed but risk remains if reintroduced)
- No unsubscribe system
- No deduplication logic
- No rate limiting / frequency control

---

## 🏗️ 2. SYSTEM ARCHITECTURE (UPDATED)

### MLS Ingestion System
- Entry: `processListing(data)`
- Upserts property by `mlsId`
- Updates key fields (price, status, beds, baths, sqft)
- Processes photos
- Triggers alert system for Active listings

### Alert System
- Function: `matchAndNotify(property)`
- Matches:
  - city
  - price >= minPrice
  - beds >= minBeds
- Returns matching saved searches
- Triggers email per match

### Email System
- Provider: Resend
- File: `/lib/email/sendAlert.ts`
- Sends HTML email with:
  - address
  - price
  - link to listing
- Uses environment API key

### Queue System
- Bull-based queue (`listingQueue`)
- Currently:
  - Enqueues new listings
  - NOT yet handling alert processing
- Alerts still executed synchronously

### Frontend (UI / Pages)
- `/boulder-map-search`
- Save search functionality via API
- No UI for alerts or unsubscribe yet

### API Layer
- `/api/save-search`
  - Accepts: email, city, minPrice, beds
  - Creates user (upsert)
  - Stores search
- `/api/test-alert`
  - Simulates listing
  - Triggers match + email

### Database (Prisma)
Models:
- User
  - id
  - email (unique)
- SavedSearch
  - userId (FK)
  - city
  - minPrice
  - beds
- Property
  - mlsId (unique)
  - address
  - city
  - price
  - bedrooms
  - etc.

---

## 🗂️ 3. FILES CREATED / MODIFIED

### `/app/api/save-search/route.ts`
- Creates/updates user
- Saves search
- Uses Prisma upsert

### `/lib/prisma.ts`
- Prisma client singleton
- Fixed initialization error

### `/lib/email/sendAlert.ts`
- Sends email via Resend
- HTML template with listing info

### `/lib/alerts/matchSearches.ts`
- Core matching logic
- Queries saved searches
- Sends email for each match

### `/lib/mls/processListing.ts`
- Upserts property
- Processes photos
- Triggers alerts (correct placement AFTER upsert)
- Adds job to queue

### `/app/api/test-alert/route.ts`
- Simulates property
- Calls matchAndNotify
- Used for testing pipeline

---

## 🧠 4. BUSINESS LOGIC & RULES

### Matching Rules
- city must match exactly
- property.price >= search.minPrice
- property.beds >= search.beds

### Notification Rules
- Only trigger alerts for `status === "Active"`
- Each matching search triggers an email
- Emails sent immediately (current state)

### User Rules
- Email is unique identifier
- Users created automatically on save-search

### Listing Rules
- Listings identified by `mlsId`
- Upsert ensures idempotency

---

## ⚙️ 5. ENVIRONMENT / CONFIG

### Environment Variables
- `DATABASE_URL` (Supabase Postgres)
- `RESEND_API_KEY`

### External Services
- Supabase (PostgreSQL)
- Resend (email delivery)

### Installed Packages
- prisma
- @prisma/client
- resend
- pg
- @prisma/adapter-pg

---

## 🔁 6. WORKFLOWS (STEP-BY-STEP)

### Save Search Flow
1. User submits search
2. API receives request
3. Normalize email
4. Upsert user
5. Create saved search
6. Return success

### Listing Ingestion Flow
1. New listing received
2. `processListing` runs
3. Upsert property
4. Process photos
5. If Active:
   - trigger `matchAndNotify`
   - enqueue job

### Alert Trigger Flow
1. `matchAndNotify(property)`
2. Query matching saved searches
3. Loop through results
4. Send email per match

### Email Flow
1. Build HTML template
2. Call Resend API
3. Deliver email

---

## 🚧 7. KNOWN ISSUES / RISKS

- Alerts run synchronously → blocks ingestion
- No deduplication → same user may get duplicate alerts
- No unsubscribe mechanism
- No rate limiting
- Queue not used for alerts yet
- Potential performance issues at scale
- Email domain not verified (production risk)

---

## 🎯 8. NEXT PRIORITIES

1. Move alert processing to queue (BullMQ worker)
2. Implement unsubscribe system (tokenized links)
3. Add deduplication (listing-user tracking)
4. Add alert frequency controls (instant vs digest)
5. Connect to live MLS Grid ingestion
6. Add monitoring/logging for alerts

---

## 📏 9. STANDARDS & CONSTRAINTS (CRITICAL)

- No blocking operations in ingestion pipeline
- Alert system must be async (queue-based)
- Database operations must be idempotent
- Email sending must be fault-tolerant
- System must scale to high listing volume
- Clear separation of ingestion vs notification

---

## 🧩 10. MISSING BUT NEEDED (GAPS)

- Unsubscribe system
- Email verification domain
- Alert deduplication table
- Background worker infrastructure
- Alert preferences (frequency)
- Retry logic for failed emails
- Logging/observability layer

---

## 🧾 11. TERMINOLOGY (NORMALIZED)

- Listing = property from MLS
- Saved Search = user-defined criteria
- Alert = triggered notification
- Match = listing satisfies saved search
- Ingestion = processing incoming MLS data
- Notification Engine = match + email system
- Queue = async job processor

---

## 🧠 12. ASSUMPTIONS MADE

- Supabase is primary production database
- MLS data will scale significantly
- Email alerts are core lead generation feature
- Users are anonymous until email captured
- Matching logic will expand beyond basic filters
- Queue system will be required for production scale
```


2026-03-19
==============================
PROJECT BRAIN — CONTEXT CAPTURE
===============================

**Start Date:** 2026-03-17
**End Date (handoff to new chat):** 2026-03-19
**Active Work Duration:** ~6–8 hours (estimated across sessions, excluding idle time)

---

## 🧱 1. PROJECT SNAPSHOT (CURRENT STATE)

**Worked on in this chat:**

* End-to-end MLS alert pipeline
* Supabase + Prisma database connection
* Email alert delivery via Resend
* Matching engine for saved searches
* Local worker + API testing endpoint
* Environment + infrastructure debugging

**Now functional:**

* ✅ Prisma connected to Supabase via transaction pooler
* ✅ `/api/test-alert` endpoint working
* ✅ Matching logic returns correct saved searches
* ✅ Email alerts successfully sent via Resend
* ✅ Worker executes alert pipeline
* ✅ Environment variables correctly configured

**Partially complete:**

* ⚠️ Alert system lacks deduplication (duplicate emails sent)
* ⚠️ No alert history tracking
* ⚠️ No frequency controls (instant vs digest)

**Broken / uncertain:**

* ❌ Redis queue not running (not installed/configured)
* ❌ No production-safe job queue yet
* ❌ MLS ingestion not implemented (IRES not connected)

---

## 🏗️ 2. SYSTEM ARCHITECTURE (UPDATED)

### MLS Ingestion System

* Not yet implemented
* Intended to ingest listings from IRES API
* Will trigger alert matching pipeline

---

### Alert System

**Flow:**

* Input: `property` object
* Query: `savedSearch` via Prisma
* Filters:

  * city match
  * minPrice <= property.price OR null
  * beds <= property.beds OR null
* Output: matched searches
* Action: send email per match

**Constraint:**

* Currently not idempotent (duplicates allowed)

---

### Email System

* Provider: Resend
* Function: `sendAlert({ user, listing })`
* Sends HTML email with:

  * address
  * price
  * link to property page
* Requires:

  * `RESEND_API_KEY`
  * `EMAIL_FROM`

---

### Queue System

* Intended: Redis-based worker
* Current state:

  * ❌ Redis not running
  * ❌ Queue not operational
* Worker runs manually via:

  ```bash
  npm run dev:worker
  ```

---

### Frontend (UI / Pages)

* No UI changes in this chat
* Test endpoint used instead:

  ```
  /api/test-alert
  ```

---

### API Layer

* Endpoint: `/api/test-alert`
* Calls:

  * `matchAndNotify(property)`
* Used for manual trigger/testing

---

### Database (Prisma + Supabase)

* ORM: Prisma
* DB: Supabase Postgres
* Connection: Transaction pooler

**Critical config:**

```env
DATABASE_URL="postgresql://postgres.<project-ref>:PASSWORD@aws-0-us-west-2.pooler.supabase.com:6543/postgres?sslmode=require"
```

**Key requirement:**

* Username MUST include project ref:

  ```
  postgres.<project-ref>
  ```

---

## 🗂️ 3. FILES CREATED / MODIFIED

### `/lib/alerts/matchSearches.ts`

* Purpose: match property to saved searches
* Logic:

  * Prisma query with filters
  * Loop through results
  * Call `sendAlert`

---

### `/lib/email/sendAlert.ts`

* Purpose: send email alerts
* Logic:

  * Initialize Resend client
  * Send email with listing data
  * Log output

---

### `/app/api/test-alert/route.ts`

* Purpose: test alert pipeline
* Logic:

  * Mock property object
  * Call `matchAndNotify`

---

### `/lib/prisma.ts`

* Purpose: Prisma client initialization
* Issue fixed:

  * Removed invalid `adapter` config

---

### `.env.local`

* Added/updated:

  * Supabase keys
  * DATABASE_URL (pooler)
  * RESEND_API_KEY

---

## 🧠 4. BUSINESS LOGIC & RULES

### Matching Rules

* Match if:

  * `city` exact match
  * `minPrice <= property.price` OR null
  * `beds <= property.beds` OR null
* Only active searches:

  ```
  isActive = true
  ```

---

### Notification Rules

* Send email per matched search
* Skip if user has no email
* No deduplication (current state)

---

### User Rules

* User must have:

  * `email`
  * `isUnsubscribed = false` (not yet enforced)

---

## ⚙️ 5. ENVIRONMENT / CONFIG

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

DATABASE_URL= (transaction pooler REQUIRED)

RESEND_API_KEY=
EMAIL_FROM=

REDIS_URL= (not configured)
MLS_FEED_URL= (not configured)

IRES_API_URL=
IRES_CLIENT_ID=
IRES_CLIENT_SECRET=
IRES_ACCESS_TOKEN=
```

---

### External Services

* Supabase (Postgres DB)
* Prisma (ORM)
* Resend (email delivery)
* Redis (planned, not active)

---

## 🔁 6. WORKFLOWS (STEP-BY-STEP)

### Alert Trigger Flow

1. API request → `/api/test-alert`
2. Create mock `property`
3. Call `matchAndNotify(property)`
4. Query `savedSearch` via Prisma
5. Filter matching searches
6. Loop through results
7. Call `sendAlert({ user, listing })`
8. Resend sends email
9. Log success

---

## 🚧 7. KNOWN ISSUES / RISKS

* ❌ Duplicate emails being sent
* ❌ No alert tracking (no audit/history)
* ❌ No unsubscribe enforcement in logic
* ❌ Redis queue not active
* ❌ No retry/failure handling for emails
* ❌ Prisma connection fragile if misconfigured
* ⚠️ Email logs duplicated (double send observed)
* ⚠️ No rate limiting

---

## 🎯 8. NEXT PRIORITIES

1. 🔒 Alert Deduplication System (CRITICAL)
2. 🧾 Alert history tracking table
3. ⏱️ Alert frequency (instant vs digest)
4. 🧵 Redis queue implementation (BullMQ or equivalent)
5. 🎨 Email template improvements (branding, UX)
6. 🔌 MLS ingestion (IRES integration)
7. 🚫 Unsubscribe enforcement logic
8. ⚡ Performance + batching optimization

---

## 📏 9. STANDARDS & CONSTRAINTS (CRITICAL)

* Must use **transaction pooler** for DB connections
* Must include `postgres.<project-ref>` in DB user
* All alert processing must be:

  * idempotent
  * deduplicated
* No blocking logic in API routes (move to queue)
* Email sending must be:

  * retry-safe
  * failure-tolerant
* System must scale to high listing volume

---

## 🧩 10. MISSING BUT NEEDED (GAPS)

* Alert deduplication table (`alertSent`)
* Queue system (Redis + worker)
* MLS ingestion pipeline
* Email template system (modular)
* User unsubscribe logic enforcement
* Admin/debug dashboard
* Logging + monitoring system

---

## 🧾 11. TERMINOLOGY (NORMALIZED)

* **Listing** = property from MLS or test data
* **Saved Search** = user-defined filter criteria
* **Alert** = notification triggered by matching listing
* **Match** = listing satisfies saved search conditions
* **Worker** = background process for alerts
* **Queue** = system to manage async jobs
* **Deduplication** = preventing duplicate alerts
* **Pooler** = Supabase connection pooling layer

---

## 🧠 12. ASSUMPTIONS MADE

* Supabase DB is production-ready and stable
* Password used is correct and persistent
* Users will have valid emails
* Listings will include:

  * city
  * price
  * beds
* Matching logic is sufficient for MVP
* Email delivery via Resend is reliable
* System will transition to queue-based processing soon

---

**END OF CONTEXT CAPTURE**


2026-03-21
==============================
PROJECT BRAIN — CONTEXT CAPTURE
===============================

**Start Date:** 2026-03-17
**End Date (handoff to new chat):** 2026-03-21
**Active Work Duration:** ~8–12 hours

---

## 🧱 1. PROJECT SNAPSHOT (CURRENT STATE)

**Worked On:**

* End-to-end alert system (matching → email → dedup → DB logging)
* Prisma schema expansion (AlertEvent + relations)
* Supabase DB connection + migrations
* Resend email integration
* Debugging Prisma + Postgres issues

**Now Functional:**

* SavedSearch → Property matching logic
* Email alerts sending via Resend
* Deduplication using AlertEvent table
* API route `/api/test-alert` working
* Database persistence working (foreign keys resolved)
* Prisma client + Supabase fully connected

**Partially Complete:**

* Email templates (currently plain/basic)
* Unsubscribe system (schema exists, not wired into emails)
* Property ingestion (manual/test only, no MLS pipeline yet)

**Broken / Uncertain:**

* Prisma Studio UI rendering inconsistencies (visual only)
* No production email domain setup (Resend sandbox mode likely)
* No background job/queue system yet

---

## 🏗️ 2. SYSTEM ARCHITECTURE (UPDATED)

### MLS Ingestion System

* Not implemented yet
* Currently using manual/test property creation
* Future: ingest MLS → populate Property table

---

### Alert System

**Data Flow:**
Property → matchAndNotify() → SavedSearch → User → AlertEvent → Email

**Core Logic:**

* Query SavedSearch where:

  * `city = property.city`
  * `minPrice <= property.price OR null`
  * `beds <= property.beds OR null`
  * `isActive = true`
* Loop through matches
* For each user:

  * Check AlertEvent (dedup)
  * Send email
  * Create AlertEvent record

**Constraints:**

* Must prevent duplicate alerts per:

  * `userId + propertyId + type`
* Requires property to exist in DB (FK constraint)

---

### Email System

**Service:** Resend

**Flow:**
matchAndNotify → sendAlert() → Resend API

**Requirements:**

* `RESEND_API_KEY` must be set
* Emails currently basic (no template system yet)

---

### Queue System

* Not implemented
* Currently synchronous execution inside API route

---

### Frontend (UI / Pages)

* No frontend alert UI yet
* Only API testing via browser

---

### API Layer

**Route:**

* `/api/test-alert`

**Behavior:**

* Simulates a new property
* Calls `matchAndNotify(property)`
* Returns `{ success: true }`

---

### Database (Prisma)

**Key Models:**

* Property
* User
* SavedSearch
* AlertEvent
* UnsubscribeToken
* EmailLog

**AlertEvent:**

* Tracks sent alerts
* Prevents duplicates
* FK → User
* FK → Property
* Unique index: `(userId, propertyId, type)`

---

## 🗂️ 3. FILES CREATED / MODIFIED

### `/prisma/schema.prisma`

* Added `AlertEvent` model
* Added relations:

  * User → AlertEvent[]
  * Property → AlertEvent[]
* Added indexes + unique constraint

---

### `/lib/alerts/matchSearches.ts`

**Purpose:**

* Core alert engine

**Key Logic:**

* Query matching SavedSearch
* Loop through results
* Dedup check via `alertEvent.findUnique`
* Send email
* Create AlertEvent record

---

### `/lib/email/sendAlert.ts`

**Purpose:**

* Sends email via Resend

**Key Logic:**

* Initializes Resend with API key
* Sends alert email
* Logs missing API key errors

---

### `/lib/prisma.ts`

**Purpose:**

* Prisma client singleton
* Prevents connection issues in dev

---

### `/app/api/test-alert/route.ts`

**Purpose:**

* Test endpoint for alert system

**Key Logic:**

* Creates mock property object
* Calls `matchAndNotify`
* Returns success response

---

## 🧠 4. BUSINESS LOGIC & RULES

### Matching Rules

* City must match exactly
* minPrice ≤ property.price OR null
* beds ≤ property.beds OR null
* Only active searches (`isActive = true`)

---

### Notification Rules

* One alert per:

  * user + property + type
* Duplicate alerts are skipped

---

### Data Integrity Rules

* AlertEvent requires valid:

  * userId
  * propertyId (must exist)
* FK constraints enforced

---

### Email Rules

* Only send if user has email
* Fail gracefully if email fails
* Do not block system on email failure

---

## ⚙️ 5. ENVIRONMENT / CONFIG

### Environment Variables

```env
DATABASE_URL=postgresql://... (Supabase with pgbouncer)
RESEND_API_KEY=re_xxxxx
```

---

### External Services

* Supabase (Postgres DB)
* Resend (email delivery)

---

## 🔁 6. WORKFLOWS (STEP-BY-STEP)

### Alert Trigger Flow

1. API route called (`/api/test-alert`)
2. Mock property created
3. `matchAndNotify(property)` runs
4. Query SavedSearch
5. Loop through matches
6. For each:

   * Check AlertEvent (dedup)
   * If exists → skip
   * Else:

     * Send email
     * Create AlertEvent record
7. Return success

---

### Email Send Flow

1. `sendAlert()` called
2. Initialize Resend with API key
3. Send email payload
4. Log success/failure

---

## 🚧 7. KNOWN ISSUES / RISKS

* No queue system → blocking API route
* Email sending is synchronous
* No retry logic for failed emails
* Prisma Studio UI unreliable (visual bug)
* No production email domain configured
* No rate limiting
* No batching → potential spam risk

---

## 🎯 8. NEXT PRIORITIES

1. Build email templates (high priority UX)
2. Add unsubscribe links to emails
3. Implement queue system (background jobs)
4. Add MLS ingestion pipeline
5. Build frontend for saved searches
6. Add alert batching / digest system
7. Configure production email domain

---

## 📏 9. STANDARDS & CONSTRAINTS (CRITICAL)

* System must be idempotent (no duplicate alerts)
* Must enforce DB-level uniqueness
* API routes should not block long-term (future queue required)
* All alerts must be traceable (AlertEvent logging)
* Must handle failures gracefully (email, DB)
* Must maintain referential integrity (FK constraints)

---

## 🧩 10. MISSING BUT NEEDED (GAPS)

* MLS ingestion pipeline
* Queue system (BullMQ / background jobs)
* Email template system (HTML + branding)
* Unsubscribe flow integration
* User-facing dashboard
* Search creation UI
* Property detail pages
* Logging/monitoring system

---

## 🧾 11. TERMINOLOGY (NORMALIZED)

* **Property** = MLS listing stored in DB
* **SavedSearch** = user-defined criteria
* **Alert** = notification triggered by match
* **AlertEvent** = DB record of sent alert
* **Match** = property satisfies search criteria
* **Deduplication** = preventing duplicate alerts
* **Listing** = synonym for Property (external term)

---

## 🧠 12. ASSUMPTIONS MADE

* Each property has a unique ID and exists before alerts run
* Users have valid emails
* Resend API key has sending permissions
* Alerts are triggered per new listing (not updates yet)
* City-based matching is sufficient for MVP
* No need for async queue at current scale (temporary)

---


2026-03-21
==============================
PROJECT BRAIN — CONTEXT CAPTURE
===============================

**Session Start Date:** 2026-03-21
**Session End Date (handoff to new chat):** 2026-03-21
**Active Work Duration:** ~3–4 hours

---

## 🧱 1. PROJECT SNAPSHOT (CURRENT STATE)

### ✅ Completed / Functional

* Email alert system (instant alerts) working
* Digest email system working via script
* Prisma schema defined and mostly synced
* Supabase PostgreSQL connected via pooled connection
* `AlertEvent` system working with deduplication
* `AlertQueue` table successfully created manually via SQL
* Prisma Studio operational without errors
* Test API route successfully triggers alerts and emails

### 🟡 Partially Complete

* Queue-based alert system (schema exists, not yet integrated)
* Digest script exists but not automated
* Alert flow still sends emails immediately (not queued yet)

### ❌ Broken / Uncertain

* Prisma `db push` unreliable due to Supabase connection constraints
* Direct DB connection (port 5432) blocked locally
* Prisma migrations not usable in current environment (manual SQL required)

---

## 🏗️ 2. SYSTEM ARCHITECTURE (UPDATED)

### MLS Ingestion System

* Not modified in this session
* Assumed to feed property data into `Property` model

---

### Alert System

**Current Flow:**

```
New Property → matchAndNotify()
             → Prisma query (SavedSearch)
             → Filter matches
             → Dedup via AlertEvent
             → sendAlert()
             → Record AlertEvent
```

**Constraints:**

* Prevent duplicate alerts using composite unique key:
  `(userId, propertyId, type)`
* Only active searches (`isActive = true`)
* Match by:

  * city
  * minPrice <= property.price
  * beds <= property.beds

---

### Email System

* Uses `sendAlert()` function
* Sends:

  * Instant alerts (working)
  * Digest emails (via script)
* Email logging via `EmailLog` model
* Uses external email provider (implied Resend or similar)

---

### Queue System (NEW — NOT YET INTEGRATED)

**Table: `AlertQueue`**

```
id
userId
listingId
createdAt
```

**Purpose:**

* Store alerts instead of sending immediately
* Enable batch/digest processing

**Status:**

* Table exists in DB
* Prisma model defined
* NOT wired into alert pipeline yet

---

### Frontend (UI / Pages)

* Neighborhood dynamic page implemented:
  `/[city]/[neighborhood]-homes-for-sale`
* Uses:

  * static params generation
  * searchProperties()
  * PropertyCard component

**Constraints:**

* Must validate city + neighborhood
* Uses `notFound()` for invalid routes

---

### API Layer

* `/api/test-result` route used for:

  * testing alert system
  * triggering emails
  * validating pipeline

**Status:**

* Working
* Used for debugging + validation

---

### Database (Prisma + Supabase)

**Provider:** PostgreSQL (Supabase)

**Key Models:**

* Property
* User
* SavedSearch
* AlertEvent (deduplication)
* AlertQueue (new)
* EmailLog
* UnsubscribeToken

**Important Constraints:**

* Supabase pooled connection (port 6543) required for runtime
* Direct connection (5432) not accessible locally
* Prisma migrations unreliable → manual SQL required

---

## 🗂️ 3. FILES CREATED / MODIFIED

### `/prisma/schema.prisma`

* Added `AlertQueue` model
* Added relation:

  * `User.alertQueue`
* Defined schema for queue system

---

### `/lib/alerts/matchSearches.ts`

* Core alert matching logic
* Deduplication via `AlertEvent`
* Sends email immediately (current behavior)

---

### `/scripts/sendDigest.ts`

* Script to send digest emails
* Not automated
* Currently runs manually via CLI

---

### `/app/api/test-result/route.ts`

* Test endpoint
* Triggers:

  * alert matching
  * email sending
  * digest logic

---

### `/app/[city]/[neighborhood]-homes-for-sale/page.tsx`

* Dynamic SEO page
* Generates static params
* Fetches listings by city
* Displays property cards

---

### `/app/globals.css`

* Includes Leaflet + cluster styles
* Caused initial build issues (resolved)

---

### `/app/layout.tsx`

* Imports global styles
* Initially broke due to missing leaflet assets

---

## 🧠 4. BUSINESS LOGIC & RULES

### Alert Matching Rules

* Match by city
* `minPrice <= property.price`
* `beds <= property.beds`
* Only active searches

---

### Deduplication Rules

* One alert per:
  `(userId, propertyId, type)`
* Stored in `AlertEvent`

---

### Email Rules

* Send only if user has email
* Skip duplicates
* Log all sends

---

### Queue Rules (Planned)

* Alerts should NOT send immediately
* Must be stored in `AlertQueue`
* Processed later via digest

---

## ⚙️ 5. ENVIRONMENT / CONFIG

### Environment Variables

```
DATABASE_URL=postgresql://postgres.<project_ref>:<password>@aws-0-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### External Services

* Supabase (PostgreSQL)
* Email provider (Resend or similar)

---

## 🔁 6. WORKFLOWS (STEP-BY-STEP)

### Current Alert Flow

1. Property created
2. matchAndNotify() runs
3. Query SavedSearch
4. Filter matches
5. Check AlertEvent (dedupe)
6. Send email
7. Create AlertEvent record

---

### Digest Flow (Current)

1. Run script manually
2. Query alerts
3. Send digest email
4. Log send

---

### Queue Flow (Planned)

1. Property created
2. matchSearches()
3. Insert into AlertQueue
4. Cron job runs
5. Aggregate alerts per user
6. Send digest
7. Clear queue

---

## 🚧 7. KNOWN ISSUES / RISKS

* Prisma migrations not reliable with Supabase
* Must manually create tables via SQL
* Direct DB connection blocked
* Pooled connection cannot run schema changes
* Alert system still sends immediately (not scalable)
* No cron automation yet
* Potential duplicate sends if queue not implemented correctly

---

## 🎯 8. NEXT PRIORITIES

1. Integrate AlertQueue into matchSearches()
2. Stop immediate email sending
3. Build digest processor (reads from queue)
4. Automate digest (cron / Vercel)
5. Add queue cleanup logic
6. Improve Prisma migration strategy (optional)

---

## 📏 9. STANDARDS & CONSTRAINTS (CRITICAL)

* Must prevent duplicate alerts (idempotent)
* Must not send emails synchronously in request cycle
* Must use queue for scalability
* Must support batch/digest email model
* Must be production-safe (no blocking operations)
* Must handle Supabase connection limitations

---

## 🧩 10. MISSING BUT NEEDED (GAPS)

* Queue insertion logic in alert system
* Digest processor service
* Cron job automation
* Queue cleanup strategy
* Retry/failure handling for emails
* Monitoring/logging improvements

---

## 🧾 11. TERMINOLOGY (NORMALIZED)

* **Listing** = Property from MLS
* **Alert** = Triggered notification event
* **AlertEvent** = Record of sent alert (dedupe)
* **AlertQueue** = Pending alert (not yet sent)
* **SavedSearch** = User-defined criteria
* **Digest** = Batched email of multiple listings

---

## 🧠 12. ASSUMPTIONS MADE

* Email provider is functioning correctly
* MLS ingestion pipeline exists and feeds Property model
* Supabase is primary production database
* Queue system will replace immediate alerts
* Digest emails are preferred UX over instant alerts


2026-03-22
```
==============================
PROJECT BRAIN — CONTEXT CAPTURE
==============================
Session Start Date: 2026-03-22  
Session End Date (moved to new chat): 2026-03-22  
Active Work Duration: ~2–3 hours  

---

## 🧱 1. PROJECT SNAPSHOT (CURRENT STATE)

### Completed in This Session
- Fixed Prisma ↔ Supabase connectivity issues
- Resolved connection pooling vs direct connection confusion
- Confirmed schema sync behavior (`db push`)
- Manually created `AlertQueue` table in Supabase (due to connection limitation)
- Inserted valid relational test data (User → AlertQueue)
- Built working alert queue processor
- Executed end-to-end alert processing workflow
- Verified DB state transitions (`pending → sent`)
- Established working local execution environment using `tsx`

### Fully Functional
- Prisma schema (core models + relations)
- Supabase database (connected + writable)
- AlertQueue table (exists + indexed + relational integrity enforced)
- Alert processing script (reads → processes → updates)
- Status lifecycle system (`pending`, `sent`)
- Local worker execution (`tsx`)

### Partially Complete
- Email system (currently simulated via console logs)
- AlertQueue creation via Prisma (blocked by Supabase pooler limitations)
- Environment separation (dev vs production not formalized)

### Broken / Uncertain
- Prisma `db push` using DIRECT_URL (blocked by Supabase direct connection access)
- No automated background worker (manual script only)
- No real email delivery yet

---

## 🏗️ 2. SYSTEM ARCHITECTURE (UPDATED)

### Alert System
Flow:
1. Alert created → inserted into `AlertQueue`
2. Status defaults to `pending`
3. Worker fetches pending alerts
4. Processes alert (email logic placeholder)
5. Updates status → `sent`
6. Sets `sentAt` timestamp

Constraints:
- Alerts must reference valid `User` (foreign key)
- Status lifecycle strictly enforced
- Processing is batch-limited (`take: 10`)

---

### Email System
Current:
- Simulated via console output

Planned:
- Resend integration
- Domain-based sending (`alerts@davidquinngroup.com`)
- HTML email templates (luxury UI)

---

### Queue System
- Database-backed queue (`AlertQueue`)
- Pull-based processing (worker script)
- Ordered by `createdAt ASC`
- Batch processing (max 10 per run)

---

### Database (Prisma + Supabase)

Key Models:
- User
- Property
- AlertEvent
- AlertQueue
- Supporting: PropertyPhoto, PriceHistory, OpenHouse

Key Relationships:
- User → AlertQueue (1:N)
- User → AlertEvent (1:N)
- Property → AlertEvent (1:N)

Important Constraints:
- Foreign key: AlertQueue.userId → User.id
- Indexed fields: userId, status, createdAt
- Unique constraints enforced on User.email

---

### MLS Ingestion System
Not modified in this session

---

### API Layer
Not modified in this session

---

### Frontend (UI / Pages)
Not modified in this session

---

## 🗂️ 3. FILES CREATED / MODIFIED

### /lib/prisma.ts
Purpose:
- Singleton Prisma client

Key Logic:
- Prevents multiple Prisma instances in dev
- Uses global caching

---

### /lib/alerts/processAlertQueue.ts
Purpose:
- Core queue processor

Key Logic:
- Fetch pending alerts
- Retrieve associated user
- Simulate email send
- Update status to `sent`
- Set `sentAt`

---

### /scripts/runAlerts.ts
Purpose:
- Manual worker runner

Key Logic:
- Executes `processAlertQueue()`
- Handles success/failure exit

---

## 🧠 4. BUSINESS LOGIC & RULES

- Alerts must have a valid user (foreign key enforced)
- Alert processing must:
  - Only process `status = pending`
  - Update status after processing
- Each alert processed exactly once
- Processing order = oldest first (`createdAt ASC`)
- Batch size limited to prevent overload
- Email send tied to user email lookup

---

## ⚙️ 5. ENVIRONMENT / CONFIG

Environment Variables:

```

DATABASE_URL = pooled connection (Supabase pooler, port 6543)
DIRECT_URL = direct DB connection (port 5432, requires SSL)
RESEND_API_KEY = email provider key

```

External Services:
- Supabase (PostgreSQL)
- Prisma ORM
- Resend (email provider, not yet active)

Tooling:
- `tsx` (used for script execution instead of ts-node)

---

## 🔁 6. WORKFLOWS (STEP-BY-STEP)

### Alert Processing Flow

1. Insert alert into `AlertQueue` (status = pending)
2. Run worker script
3. Query:
   - WHERE status = pending
   - ORDER BY createdAt ASC
   - LIMIT 10
4. For each alert:
   - Fetch User
   - Process alert (simulate email)
   - Update:
     - status = sent
     - sentAt = current timestamp
5. End process

---

### Data Insert Flow (Testing)

1. Insert User (must exist first)
2. Insert AlertQueue row referencing userId
3. Run processor

---

## 🚧 7. KNOWN ISSUES / RISKS

- Prisma `db push` not working via DIRECT_URL (network restriction / Supabase config)
- Manual SQL required for schema changes (not ideal)
- No retry logic on failed alerts
- No failure state tracking
- No concurrency control
- No deduplication logic beyond constraints
- No rate limiting on processing
- No background worker (manual trigger only)

---

## 🎯 8. NEXT PRIORITIES

1. Integrate Resend for real email delivery
2. Build production-grade email templates (luxury UI)
3. Replace console logs with email sending logic
4. Implement background worker (BullMQ + Redis)
5. Add retry + failure handling system
6. Automate queue processing (cron or worker service)
7. Improve DB migration strategy (Prisma migrations vs manual SQL)

---

## 📏 9. STANDARDS & CONSTRAINTS (CRITICAL)

- All async work must use queue-based processing
- No blocking operations in request lifecycle
- System must be production-safe and scalable
- Alerts must be idempotent
- Database integrity must be enforced via constraints
- Batch processing required for scalability
- Always specify Terminal when running commands
- Always return full file contents when updating files

---

## 🧩 10. MISSING BUT NEEDED (GAPS)

- Email delivery system (Resend integration)
- Email template system (HTML + branding)
- Background job system (Redis + BullMQ)
- Retry / dead-letter queue
- Alert deduplication safeguards
- Monitoring / logging system
- Deployment pipeline (Vercel + workers)
- Rate limiting / throttling
- User preference system (alert frequency, unsubscribe logic)

---

## 🧾 11. TERMINOLOGY (NORMALIZED)

- Listing = Property from MLS
- Alert = Notification trigger event
- AlertQueue = Pending notifications awaiting processing
- AlertEvent = Historical record of sent alerts
- Worker = Script/process that handles queue execution
- Processing = Executing alert logic (email send + status update)

---

## 🧠 12. ASSUMPTIONS MADE

- Supabase direct connection is restricted or not accessible from local environment
- AlertQueue is intended as primary async job system (not Redis yet)
- Email system will use Resend with verified domain
- Platform will scale to high-volume alert processing
- System prioritizes reliability over immediate real-time execution
- User emails are valid and deliverable
```


2026-03=23
==============================
PROJECT BRAIN — CONTEXT CAPTURE
===============================

**Session Start Date:** 2026-03-22
**Session End (handoff to new chat):** 2026-03-22
**Active Build Time:** ~3–5 hours

---

## 🧱 1. PROJECT SNAPSHOT (CURRENT STATE)

**Worked on in this chat:**

* AlertQueue → Email pipeline completion
* Resend integration (production email sending)
* Email template system (luxury UI)
* Click tracking system (user behavior tracking)
* Prisma + Supabase schema alignment
* Environment variable debugging + resolution

**Now functional:**

* AlertQueue processing (pending → sent/failed)
* Worker execution via `scripts/runAlerts.ts`
* Real email delivery via Resend
* Styled HTML email templates (luxury design)
* Click tracking endpoint (`clickedAt` updates)
* End-to-end pipeline:

  * DB → Queue → Worker → Email → Click → DB

**Partially complete:**

* Email templates (single listing only)
* Tracking (click-only, no analytics layer yet)
* Frontend (dashboard exists but not refined)

**Broken / uncertain:**

* Recharts rendering issues (layout warnings)
* No lead prioritization logic yet
* No batching / digest emails
* No production worker system (BullMQ not implemented)

---

## 🏗️ 2. SYSTEM ARCHITECTURE (UPDATED)

### Alert System

* Alerts stored in `AlertQueue`
* Status lifecycle:

  * `pending → sent → failed`
* Triggered manually via worker (for now)

---

### Email System

* Provider: Resend
* Service layer: `/lib/email/sendEmail.ts`
* Template system:

  * `/lib/email/templates/propertyAlert.ts`
* Email includes:

  * Property data
  * CTA link with tracking

---

### Queue System

* DB-backed queue (`AlertQueue`)
* Worker:

  * `scripts/runAlerts.ts`
* Pull-based processing:

  * Fetch `status = pending`
  * Process sequentially
  * Update status

---

### API Layer

* `/api/track-click`

  * Updates `clickedAt`
  * Redirects to frontend
* Stateless, DB-driven

---

### Frontend (UI / Pages)

* Next.js App Router
* Dashboard page exists
* Recharts used for analytics (currently unstable layout)

---

### Database (Prisma + Supabase)

**Source of truth:** Supabase
**ORM:** Prisma (client only)

**AlertQueue schema (current):**

```text
id
userId
listingId (nullable)
status
payload (JSON)
sentAt
clickedAt
createdAt
```

---

### Data Flow

```text
MLS/Data → AlertQueue → Worker → Email → User Click → API → DB (clickedAt)
```

---

## 🗂️ 3. FILES CREATED / MODIFIED

### `/lib/email/sendEmail.ts`

* Resend integration
* dotenv override fix
* Error handling + logging

---

### `/lib/email/templates/propertyAlert.ts`

* Luxury HTML email template
* Table-based email-safe layout
* Dynamic property rendering

---

### `/scripts/runAlerts.ts`

* Core worker logic
* Fetch pending alerts
* Generate email via template
* Send email
* Update status
* Inject tracking link with `alert.id`

---

### `/app/api/track-click/route.ts`

* Handles click tracking
* Updates `clickedAt`
* Redirects to homepage

---

### `/prisma/schema.prisma`

* Updated `AlertQueue` model:

  * `listingId` → optional
  * Added `payload`
  * Added `clickedAt`

---

### `/PROJECT_SYSTEM.md`

* Created system architecture reference
* Tracks infrastructure + services

---

## 🧠 4. BUSINESS LOGIC & RULES

* Alerts must always belong to a valid user
* Email only sent if user has valid email
* Alert status must update after processing
* Failed emails must not be marked as sent
* Click tracking must not block redirect
* Each alert = single email (current state)
* Payload is source of listing data (not listingId)

---

## ⚙️ 5. ENVIRONMENT / CONFIG

**Environment Variables:**

* `DATABASE_URL` → pooled connection (runtime)
* `DIRECT_URL` → direct connection (manual only)
* `RESEND_API_KEY` → email service

**Rules:**

* `.env.local` overrides `.env`
* Must explicitly load env in scripts (`dotenv`)
* Never trust implicit env loading

**External Services:**

* Supabase → database
* Resend → email delivery
* Namecheap → domain/DNS
* Vercel → hosting (future deployment)

---

## 🔁 6. WORKFLOWS (STEP-BY-STEP)

### Alert → Email Flow

1. Insert record into `AlertQueue` (status = pending)
2. Worker runs (`runAlerts.ts`)
3. Fetch pending alerts
4. Build email via template
5. Send via Resend
6. Update:

   * `status = sent`
   * `sentAt = now`

---

### Click Tracking Flow

1. User clicks email CTA
2. Request hits `/api/track-click`
3. Extract `alertId`
4. Update DB:

   * `clickedAt = now`
5. Redirect to frontend

---

### Email Generation Flow

1. Worker receives alert
2. Extract `payload`
3. Pass into template
4. Inject tracking link
5. Generate HTML
6. Send email

---

## 🚧 7. KNOWN ISSUES / RISKS

* Recharts rendering errors (width/height = -1)
* No batching → too many emails possible
* No rate limiting on alerts
* No retry strategy for failed emails
* No deduplication (duplicate alerts possible)
* No analytics layer on clicks (just stored data)
* Worker is manual (not persistent)

---

## 🎯 8. NEXT PRIORITIES

1. Multi-listing email (digest system)
2. BullMQ background workers
3. Hot lead detection (click frequency)
4. Follow-up automation emails
5. Domain email setup (alerts@domain)
6. Analytics dashboard (click tracking UI)
7. MLS image integration (replace placeholders)

---

## 📏 9. STANDARDS & CONSTRAINTS (CRITICAL)

* Supabase = schema authority (NOT Prisma)
* Prisma = client only
* No schema changes via Prisma
* All async work must move to queue system
* Workers must be idempotent
* API routes must be non-blocking
* Emails must not send without validation
* Env variables must be explicitly loaded in scripts

---

## 🧩 10. MISSING BUT NEEDED (GAPS)

* Multi-listing email system
* Persistent worker (BullMQ)
* Lead scoring system
* User preference model (search filters)
* Email unsubscribe system (compliance)
* Click analytics aggregation
* Production domain email setup
* Image pipeline (MLS photos)

---

## 🧾 11. TERMINOLOGY (NORMALIZED)

* **Listing** = property from MLS or payload
* **Alert** = notification record in AlertQueue
* **Payload** = JSON property data for email
* **Worker** = background processor for alerts
* **Click Tracking** = recording user interaction
* **Hot Lead** = user with recent/high engagement
* **Digest Email** = multi-listing email

---

## 🧠 12. ASSUMPTIONS MADE

* Payload will replace listingId long-term
* Email system will expand to multi-listing format
* Users will have persistent saved searches
* Clicks imply interest (lead scoring basis)
* Alerts will scale via queue system (BullMQ)
* Domain email will be implemented soon
* Frontend dashboard will consume tracking data later

---

2026-03-27
````
==============================
PROJECT BRAIN — CONTEXT CAPTURE
==============================

## 🧠 PROJECT OVERVIEW
Production-grade real estate platform with:
- Next.js (App Router)
- Prisma ORM
- Supabase (Postgres)
- BullMQ (Redis-based queue)
- Resend (email delivery)

System focus:
→ Scalable alert engine
→ Batched digest emails (NOT instant)
→ Behavior-driven ranking (ML-lite)
→ Click tracking + preference learning

---

## 🏗️ CORE ARCHITECTURE

### ALERT PIPELINE (FINAL)
1. Property ingested
2. matchAndNotify() runs
3. Matching users identified
4. AlertQueue row created (source of truth)
5. BullMQ job enqueued (per user, batched)
6. Worker pulls ALL pending alerts for user
7. Digest email sent
8. Alerts marked as sent

---

## 📦 QUEUE SYSTEM

### Current State
- BullMQ fully implemented
- Redis-backed queue
- DB-backed AlertQueue (source of truth)

### Key Behavior
- ONE job per user
- 10-minute batching window
- Payload-based alerts (CRITICAL DESIGN)

---

## 🧾 DATABASE MODELS (IMPORTANT)

### AlertQueue (CORE)
- id
- userId
- listingId
- payload (JSON) ✅ REQUIRED
- status ("pending", "sent", "failed")
- sentAt
- clickedAt ✅ (click tracking)

### AlertEvent (DEDUP)
- Prevents duplicate alerts
- Unique: (userId, propertyId, type)

### UserPreference (LEARNING ENGINE)
- id
- userId (unique)
- avgPrice
- avgBeds
- topCities (Postgres array)
- updatedAt

### Property
- id (cuid) ✅ PRIMARY IDENTIFIER
- slug (URL only, NOT for tracking)

---

## ⚙️ CRITICAL SYSTEM DECISIONS

### 1. DIGEST EMAILS (NOT INSTANT)
- Chosen for scalability
- Enables ranking + personalization
- Supports batching

### 2. PAYLOAD-BASED ALERTS
- Store full listing snapshot in AlertQueue.payload
- Worker does NOT re-query DB
- Prevents data drift
- Enables reliable batching

### 3. ONE JOB PER USER
```ts
jobId: `alerts-${userId}`
````

* Prevents queue explosion
* Enables batching window

### 4. CLICK TRACKING

* Email links route through:

```
/api/track-click?l={listingId}&u={userId}
```

* Updates:

  * AlertQueue.clickedAt
  * (future) preference model

---

## 📁 KEY FILES

### MATCHING ENGINE

```
/lib/alerts/matchSearches.ts
```

* Queries saved searches
* Deduplicates via AlertEvent
* Creates AlertQueue rows
* Enqueues BullMQ job (batched)

---

### QUEUE

```
/lib/queue/alertQueue.ts
```

* BullMQ queue config
* Retries + exponential backoff

---

### WORKER (DIGEST ENGINE)

```
/workers/alertWorker.ts
```

* Pulls ALL pending alerts per user
* Extracts payloads → listings[]
* Sends ONE digest email
* Marks all alerts as sent/failed

---

### EMAIL SYSTEM

#### Digest Sender

```
/lib/email/sendAlert.ts
```

Responsibilities:

* Validate inputs
* Rank listings (preference-aware)
* Attach tracking URLs
* Send via Resend

---

#### Email Template

```
/lib/email/templates/listingDigest.tsx
```

---

### CLICK TRACKING (IMPLIED)

```
/app/api/track-click/route.ts
```

* Updates clickedAt
* Will drive learning engine

---

## 🧠 RANKING ENGINE (CURRENT)

Inside:

```
/lib/email/sendAlert.ts
```

### Logic:

1. Fetch user click history
2. Boost previously clicked listing types
3. Fallback sort:

```
price DESC
```

### Output:

* Ranked listings
* Tracking URLs injected

---

## 🔮 NEXT SYSTEM: PREFERENCE LEARNING

### Goal

Update UserPreference automatically from user behavior

### Signals:

* Clicked listings
* Price patterns
* Beds
* Cities

### Future Flow:

```
click → track-click → updateUserPreferences → stored profile → ranking boost
```

---

## 🗄️ SUPABASE / PRISMA SETUP

### FINAL WORKING CONFIG

.env

```
DATABASE_URL=pooler (port 6543)
DIRECT_URL=pooler (same, due to DNS issues)
```

### Key Constraint

* Direct DB host (port 5432) ❌ NOT usable (DNS failure)
* Pooler MUST be used

### Prisma Limitation

* `prisma db pull` ❌ unreliable with pooler
* Use:

```
prisma db push
```

---

## 🐛 ISSUES SOLVED

### 1. Email crash

```
Cannot read properties of undefined (reading 'map')
```

✔ Fixed by enforcing:

* listings array
* validation guards

---

### 2. Duplicate alert sends

✔ Fixed via AlertEvent unique constraint

---

### 3. Queue not scaling

✔ Fixed by:

* BullMQ
* batching window
* per-user jobs

---

### 4. Supabase connection failures

✔ Root cause:

* wrong host (db.*)
  ✔ Fixed:
* use pooler host

---

### 5. Prisma schema mismatch

✔ Fixed via:

* db push (not migrate)
* regenerate client

---

## 🚨 NON-NEGOTIABLE RULES

* ALWAYS use payload-based alerts
* NEVER send emails inline (always queue)
* ALWAYS deduplicate via AlertEvent
* ALWAYS batch per user
* ALWAYS include listing.id (NOT just slug)
* ALWAYS use tracking URLs (no direct links)

---

## 📈 SYSTEM STATE (CURRENT)

| Component            | Status   |
| -------------------- | -------- |
| Alert matching       | ✅        |
| Queue (BullMQ)       | ✅        |
| Worker (batching)    | ✅        |
| Email sending        | ✅        |
| Click tracking infra | ✅        |
| Ranking (basic)      | ✅        |
| UserPreference table | ✅        |
| Preference learning  | ❌ (NEXT) |

---

## 🎯 NEXT IMPLEMENTATION (START OF NEXT CHAT)

### Build:

1. `/api/track-click` → update DB
2. `/lib/preferences/updateUserPreferences.ts`
3. Enhance ranking engine in sendAlert

---

## 🧠 STRATEGIC DIRECTION

System is evolving from:

```
Notification System → Intelligent Recommendation Engine
```

End goal:

* Behavior-driven personalization
* Self-optimizing alerts
* High-conversion email pipeline

---

## 🔥 CURRENT PRIORITY

👉 Implement:

```
Click Tracking → Preference Learning → Ranking Engine Upgrade
```

This is the **core moat layer** of the platform.

==============================
END OF CONTEXT
==============

```
```


2026-03-27
==============================
PROJECT BRAIN — CONTEXT CAPTURE
===============================

**Start Date:** 2026-03-27
**Continuation:** Same session (no chat switch)
**Active Work Duration:** ~3–5 hours (est.)

---

## 🧱 1. PROJECT SNAPSHOT (CURRENT STATE)

### ✅ Completed in This Chat

* Seller lead engine (undervalued listing detection → lead creation)
* CRM system (tasks + scheduling)
* Multi-touch outreach system (email + SMS-ready)
* AI personalization engine (context-aware message generation)
* Performance tracking (contactedAt, repliedAt, outreachCount)
* A/B testing system (variants A/B)
* Multi-armed bandit optimization (ε-greedy)
* Contextual bandit system (segment-based optimization)
* Deal scoring → outreach alignment (strategy-based sequencing)
* Admin dashboard (view + update pipeline)
* Auto outreach trigger on status change
* Worker-based CRM execution system

### 🟡 Partially Complete

* SMS integration (placeholder only)
* Email reply webhook (no real provider integration yet)
* Owner data enrichment (email/phone missing)
* Analytics UI (backend exists, no frontend visualization)

### ❌ Broken / Needs Fix

* Reply webhook does not map email → lead
* No guaranteed idempotency for outreach sends (edge case)
* No retry logic in CRM worker
* No rate limiting at worker level (only sendAlert level)

---

## 🏗️ 2. SYSTEM ARCHITECTURE (UPDATED)

### 📥 MLS Ingestion System

* Not modified in this chat
* Assumed upstream → feeds AlertQueue

---

### 🚨 Alert System

**Flow:**

1. Listings matched to users
2. AlertQueue row created (payload-based)
3. Worker processes alerts
4. Calls `sendAlert`

**Key Logic:**

* Payload = source of truth
* No DB re-query for listings

---

### 📧 Email System

**Primary File:**
`/lib/email/sendAlert.ts`

**Responsibilities:**

* Build market baseline
* Calculate dealScore
* Determine urgency
* Create SellerLead + CRM tasks
* Send digest email

**Enhancements:**

* Deal scoring
* Deal reason generation
* Urgency messaging
* Seller lead triggering

---

### 📬 Outreach System

**Core File:**
`/lib/outreach/sendSellerOutreach.ts`

**Flow:**

* Context built → contextual bandit selects variant
* AI generates message
* Email/SMS sent
* Tracking updated

**Features:**

* AI personalization (OpenAI)
* Multi-touch sequencing
* Variant selection (contextual bandit)
* Message adaptation (touch-based)

---

### ⚙️ Queue System

**Queues:**

* AlertQueue (existing)
* CRMTask (new scheduling layer)

**Worker:**
`/workers/runCRMTasks.ts`

**Behavior:**

* Pull pending CRMTask
* Execute outreach
* Mark sent/failed

---

### 🖥️ Frontend (UI / Pages)

**Admin Dashboard:**
`/app/admin/leads/page.tsx`

**Features:**

* View leads
* See deal score, priority, reason
* Update status (contacted / won / lost)

---

### 🌐 API Layer

**Endpoints:**

* `/api/admin/leads` → fetch leads
* `/api/admin/leads/update` → update status + trigger outreach
* `/api/webhooks/email-reply` → reply tracking (placeholder)

---

### 🗄️ Database (Prisma / Supabase)

**SellerLead**

* listingId
* city, price, beds
* dealScore
* reason
* priority (hot/warm/cold)
* strategy (aggressive/standard/light)
* status
* contactedAt
* repliedAt
* outreachCount
* variant
* contextKey

**CRMTask**

* leadId
* type (email/sms/call)
* scheduledFor
* status
* variant

---

## 🗂️ 3. FILES CREATED / MODIFIED

### Core Engine

* `/lib/email/sendAlert.ts`

  * Deal scoring, seller lead creation, rate limiting

### Seller System

* `/lib/seller/createSellerLead.ts`

  * Dedup + priority + strategy assignment

### CRM System

* `/lib/crm/createTask.ts`

  * Strategy-based multi-touch sequences

* `/workers/runCRMTasks.ts`

  * Executes scheduled outreach

* `/scripts/runCRM.ts`

  * Worker runner

---

### Outreach + AI

* `/lib/outreach/sendSellerOutreach.ts`

  * AI messaging + contextual bandit + tracking

* `/lib/ai/generateSellerMessage.ts`

  * GPT-based message generation

* `/lib/ai/selectVariant.ts`

  * A/B random selection

* `/lib/ai/selectVariantBandit.ts`

  * ε-greedy bandit

* `/lib/ai/selectVariantContextual.ts`

  * Contextual bandit

* `/lib/ai/buildContextKey.ts`

  * Segment builder

---

### Analytics

* `/lib/analytics/getLeadPerformance.ts`
* `/lib/analytics/getVariantPerformance.ts`

---

### API

* `/app/api/admin/leads/route.ts`
* `/app/api/admin/leads/update/route.ts`
* `/app/api/webhooks/email-reply/route.ts`

---

### UI

* `/app/admin/leads/page.tsx`

---

## 🧠 4. BUSINESS LOGIC & RULES

### Deal Scoring

* > 20% under market → score 60
* > 10% → score 40
* > 5% → score 20

---

### Seller Lead Rules

* Only create if `dealScore >= 40`
* Dedup by `listingId`
* Assign:

  * priority: hot/warm/cold
  * strategy: aggressive/standard/light

---

### Outreach Strategy

* aggressive → high-frequency multi-touch
* standard → moderate sequence
* light → single email

---

### Bandit Optimization

* ε = 0.2 exploration
* Context-based selection
* Score = 70% reply + 30% win

---

### Context Key

```
city-beds-priceBucket
```

---

### Rate Limiting

* Max 10 leads per sendAlert run

---

### Tracking Rules

* Every outreach increments `outreachCount`
* contactedAt set on first outreach
* repliedAt set via webhook

---

## ⚙️ 5. ENVIRONMENT / CONFIG

### Required ENV

* `RESEND_API_KEY`
* `EMAIL_FROM`
* `NEXT_PUBLIC_SITE_URL`
* `OPENAI_API_KEY`

### External Services

* Resend (email)
* OpenAI (AI messaging)
* Supabase (DB)

---

## 🔁 6. WORKFLOWS

### Seller Lead Creation

1. Listing processed in sendAlert
2. Deal score calculated
3. If ≥ 40 → createSellerLead
4. CRM tasks created based on strategy

---

### Outreach Execution

1. CRMTask scheduled
2. Worker pulls due tasks
3. Context built
4. Variant selected (bandit)
5. AI message generated
6. Email/SMS sent
7. Tracking updated

---

### Optimization Loop

1. Outreach sent
2. Reply detected (webhook)
3. Lead updated
4. Stats aggregated
5. Bandit shifts variant selection

---

### Admin Interaction

1. User updates lead status
2. API updates DB
3. Outreach triggered if "contacted"

---

## 🚧 7. KNOWN ISSUES / RISKS

* No real SMS integration
* Reply webhook incomplete (no email mapping)
* No retry logic for failed tasks
* No rate limiting in worker
* Bandit may overfit with small sample sizes
* No dedup for outreach sends (edge case)
* No authentication on admin routes

---

## 🎯 8. NEXT PRIORITIES

1. Owner data enrichment (email/phone)
2. SMS integration (Twilio)
3. Retry + backoff for CRM worker
4. Admin dashboard filters (priority/strategy)
5. Reply detection integration (Resend webhook)
6. Lead scoring dashboard
7. Authentication for admin routes

---

## 📏 9. STANDARDS & CONSTRAINTS (CRITICAL)

* Supabase = source of truth
* Payload-based alerts only
* No DB re-query in worker
* All async work via queues
* Idempotent operations required
* No blocking API calls
* Dedup required for leads + tasks
* Always batch per user

---

## 🧩 10. MISSING BUT NEEDED (GAPS)

* Owner contact enrichment
* SMS provider integration
* Email open tracking
* Retry system
* Auth system for admin
* Lead → property linking UI
* Reporting dashboard
* Notification preferences

---

## 🧾 11. TERMINOLOGY (NORMALIZED)

* Listing = MLS property
* Alert = matched notification event
* AlertQueue = alert storage + source of truth
* SellerLead = potential listing opportunity
* CRMTask = scheduled outreach action
* Deal Score = undervaluation metric
* Strategy = outreach intensity level
* Variant = message version (A/B)
* ContextKey = segmentation key
* Outreach = email/SMS contact

---

## 🧠 12. ASSUMPTIONS MADE

* SellerLead table includes `strategy` column
* CRMTask has relation to SellerLead
* Email provider supports webhook (future)
* Listings include price, beds, city
* Worker runs periodically (manual/cron)
* No auth required yet for admin routes
* OpenAI latency acceptable for send-time generation

---

**END OF CONTEXT**


2026-03-28
==============================
PROJECT BRAIN — CONTEXT CAPTURE
===============================

**Start Date:** 2026-03-28
**Chat Transition:** Continuing into new chat after CRM worker + Prisma alignment
**Active Work Duration:** ~2–3 hours

---

## 🧱 1. PROJECT SNAPSHOT (CURRENT STATE)

### ✅ Completed in This Chat

* CRM Worker fully operational (`runCRMTasks.ts`)
* Prisma ↔ Supabase schema alignment (table + column mapping)
* Debug system for Prisma client inspection
* CRMTask processing pipeline executing without crashes
* Email system confirmed working (Resend integration)
* System-wide Node runtime compatibility (no alias imports in workers)

---

### 🟡 Partially Complete

* CRMTask processing returns 0 tasks (no active workload yet)
* Email tracking headers partially implemented (incorrectly wired)
* Resend domain added but not verified
* Reply tracking system not yet implemented

---

### ❌ Broken / Needs Fix

* Email tracking (`X-Lead-ID`) not properly injected
* Resend domain not verified (blocking inbound email system)
* No reply → lead mapping
* No webhook system for inbound emails

---

## 🏗️ 2. SYSTEM ARCHITECTURE (UPDATED)

### 📥 MLS Ingestion System

* Not modified in this chat

---

### 🚨 Alert System

* Not modified
* Still feeds AlertQueue → Worker

---

### 📧 Email System

**Flow:**

```
CRMTask → Worker → sendSellerOutreach → sendEmail (Resend)
```

**Key Logic:**

* Sends transactional outreach emails
* Uses Resend API
* No reply tracking yet
* No lead identification in email payload (critical gap)

---

### ⚙️ Queue System

**CRMTask Table (Supabase):**

Columns (confirmed):

```
id
leadid
type
status
scheduledfor
createdat
attempts
lastattemptat
lockedat
error
variant
```

**Worker Behavior:**

1. Pull pending CRMTask
2. Process outreach
3. Mark sent/failed

**Constraints:**

* Prisma requires explicit column mapping
* Supabase is source of truth

---

### 🌐 API Layer

* Not modified in this chat

---

### 🗄️ Database (Prisma)

**Key Fix: Mapping Layer**

```prisma
model CrmTask {
  id            String   @id @default(uuid())
  leadId        String   @map("leadid")
  type          String
  status        String
  scheduledFor  DateTime @map("scheduledfor")
  attempts      Int?
  lastAttemptAt DateTime? @map("lastattemptat")
  lockedAt      DateTime? @map("lockedat")
  error         String?
  createdAt     DateTime @default(now()) @map("createdat")

  @@map("CRMTask")
}
```

**Important:**

* Supabase uses lowercase columns (no underscores)
* Prisma uses camelCase + @map

---

## 🗂️ 3. FILES CREATED / MODIFIED

### `/workers/runCRMTasks.ts`

* Worker execution logic
* Added Prisma debug logging
* Handles CRMTask processing
* Uses manual lead lookup

---

### `/lib/prisma.ts`

* Stable Prisma client initialization
* Global caching pattern

---

### `/prisma/schema.prisma`

* Added:

  * `CrmTask` model
  * `SellerLead` model
* Added:

  * `@@map` for table
  * `@map` for all mismatched columns

---

### `/scripts/runCRM.ts`

* Entry point for CRM worker
* Uses relative imports (Node-safe)

---

### `/lib/email/sendEmail.ts`

* Resend integration
* Environment override via `.env.local`
* ❌ Incorrect header implementation (needs fix)

---

## 🧠 4. BUSINESS LOGIC & RULES

### CRM Processing

* Only `status = pending` tasks processed
* Tasks limited to batch size (20)
* Each task processed once per run

---

### Database Rules

* Supabase = source of truth
* Prisma = read/write client only
* All schema mismatches must use `@map` / `@@map`

---

### Worker Rules

* Workers must use relative imports (NO `@/`)
* Must be Node runtime safe
* Must not rely on Next.js environment

---

### Email Rules

* Must include tracking identifier per lead (NOT implemented yet)
* Must support reply tracking (future requirement)

---

## ⚙️ 5. ENVIRONMENT / CONFIG

### ENV Variables

* `RESEND_API_KEY`
* `DATABASE_URL`
* `.env.local` overrides enabled via dotenv

---

### External Services

* Supabase (Postgres DB)
* Resend (email sending)

---

## 🔁 6. WORKFLOWS (STEP-BY-STEP)

### CRM Worker Flow

1. Run `npm run run:crm`
2. Load Prisma client
3. Query CRMTask:

   * `status = pending`
   * `scheduledFor <= now`
4. For each task:

   * Fetch SellerLead
   * Send outreach email
   * Update status → sent/failed
5. Exit process

---

### Email Send Flow

1. Worker triggers `sendSellerOutreach`
2. Calls `sendEmail`
3. Resend API sends email
4. Response logged

---

## 🚧 7. KNOWN ISSUES / RISKS

* Email replies cannot be tracked
* No lead attribution in outbound emails
* Resend domain not verified (blocks inbound)
* Worker has no retry/backoff (current version simplified)
* No rate limiting in worker
* No idempotency lock currently enforced
* CRMTask schema tightly coupled to manual DB setup

---

## 🎯 8. NEXT PRIORITIES

1. Verify Resend domain using subdomain (CRITICAL)
2. Implement reply webhook system
3. Add lead tracking to outbound emails
4. Map inbound replies → SellerLead
5. Update `repliedAt` on lead
6. Connect reply data to bandit optimization
7. Restore retry + backoff logic in worker

---

## 📏 9. STANDARDS & CONSTRAINTS (CRITICAL)

* Supabase is ALWAYS source of truth
* Prisma must mirror schema using mapping (never assume naming)
* Workers must:

  * Use relative imports
  * Be Node-compatible
  * Be idempotent (future enforcement)
* No blocking operations in API routes
* All async processing must go through queue system

---

## 🧩 10. MISSING BUT NEEDED (GAPS)

* Reply webhook system (Resend inbound)
* Email identity tracking (leadId injection)
* Retry/backoff system in worker
* Rate limiting at worker level
* Domain verification (Resend)
* Email open/click tracking expansion
* Auth for admin routes
* Full analytics dashboard

---

## 🧾 11. TERMINOLOGY (NORMALIZED)

* Listing = MLS property
* Alert = matched listing notification
* AlertQueue = alert job storage
* CRMTask = scheduled outreach task
* SellerLead = potential seller opportunity
* Outreach = email/SMS contact attempt
* Worker = background processor
* Deal Score = undervaluation metric
* Variant = A/B message version
* ContextKey = segmentation key

---

## 🧠 12. ASSUMPTIONS MADE

* CRMTask table uses lowercase column naming (confirmed via query)
* SellerLead exists in DB and matches minimal schema used
* Resend will support inbound webhooks once domain is verified
* Email replies will be the primary signal for bandit learning
* Current environment is development (no production infra yet)

---

**END OF CONTEXT**


2026-03-28
```
==============================
PROJECT BRAIN — CONTEXT CAPTURE
==============================

Date Started: 2026-03-29  
Continuation Date (new chat): 2026-03-29  
Active Work Duration: ~3–5 hours  

---

## 🧱 1. PROJECT SNAPSHOT (CURRENT STATE)

### Worked On
- Resend email integration (sending + reply capture)
- DNS configuration (Namecheap)
- Webhook endpoint for inbound email replies
- Testing pipeline via Node script

### Functional
- Domain verified in Resend (`davidquinngroup.com`)
- Subdomain verified (`reply.davidquinngroup.com`)
- Emails successfully sending via Resend API
- Webhook endpoint receiving events (`email.sent`, `email.delivered`)
- Next.js API route running and logging

### Partially Complete
- Reply capture system (leadId parsing logic implemented but not triggered yet)
- MX routing for inbound email (configured but not fully propagated/validated)
- `reply_to` dynamic addressing implemented but not yet confirmed working end-to-end

### Broken / Uncertain
- Replies return “Address not found”
- Namecheap DNS “Save All Changes” blocked by unsaved/invalid records
- Inbound email not reaching webhook (`email.received` not firing)
- Possible incorrect/missing `reply_to` header in sent emails
- DNS propagation timing vs configuration correctness unclear

---

## 🏗️ 2. SYSTEM ARCHITECTURE (UPDATED)

### Email System
- Provider: Resend
- Sending via API (`resend.emails.send`)
- Domains:
  - Root: `davidquinngroup.com`
  - Reply: `reply.davidquinngroup.com`
- Required DNS:
  - SPF (TXT)
  - DKIM (TXT)
  - MX (for inbound replies)
- Reply routing:
  - `reply+{leadId}@reply.davidquinngroup.com`

---

### API Layer
- Next.js App Router
- Endpoint:
  - `/api/webhooks/email-reply`
- Handles:
  - Incoming Resend webhook events
  - Extracts `leadId` from reply address
  - Updates database

---

### Database (Prisma)
- Model: `sellerLead`
- Field updated:
  - `repliedAt: Date`

---

### Data Flow (Email Reply)

1. System sends email via Resend
2. Email includes:
   - `reply_to = reply+{leadId}@reply.davidquinngroup.com`
3. User replies in Gmail
4. DNS routes reply via MX record
5. Resend receives inbound email
6. Resend triggers webhook (`email.received`)
7. Next.js endpoint parses:
   - Extracts `leadId`
8. Prisma updates:
   - `sellerLead.repliedAt`

---

### Constraints
- Reply parsing depends on correct `reply_to`
- MX must exist ONLY in Mail Settings
- DNS must be fully saved (no pending rows)
- Webhook must receive `email.received` event (not just sent/delivered)

---

## 🗂️ 3. FILES CREATED / MODIFIED

### `/app/api/webhooks/email-reply/route.ts`
- Handles inbound webhook
- Parses payload
- Extracts `leadId` using regex:
```

reply+(.+?)@

```
- Updates Prisma:
```

sellerLead.repliedAt

```
- Includes error handling for missing lead

---

### `/send-test-email.js`
- Sends test emails via Resend
- Uses dotenv for API key
- Adds:
- `reply_to` dynamic address
- Used for local testing

---

### `.env.local`
- Contains:
- `RESEND_API_KEY`

---

## 🧠 4. BUSINESS LOGIC & RULES

### Email Reply Tracking
- Every outbound email must include unique `leadId`
- Reply address format:
```

reply+{leadId}@reply.davidquinngroup.com

```
- On reply:
- System extracts `leadId`
- Marks lead as “replied”

---

### Webhook Behavior
- Ignore events without `leadId`
- Must not crash if lead not found
- Must be idempotent (safe to retry)

---

## ⚙️ 5. ENVIRONMENT / CONFIG

### External Services
- Resend (email sending + inbound)
- Namecheap (DNS management)
- Gmail (testing inbox)

---

### DNS Configuration

#### HOST RECORDS
- SPF:
```

@ → v=spf1 include:resend.com ~all
reply → v=spf1 include:resend.com ~all
send → v=spf1 include:amazonses.com ~all
send.reply → v=spf1 include:amazonses.com ~all

```
- DKIM:
```

resend._domainkey
resend._domainkey.reply

```
- DMARC:
```

_dmarc → v=DMARC1; p=none;

```

---

#### MAIL SETTINGS (Custom MX)
- Required:
```

MX  reply  inbound-smtp.us-east-1.amazonaws.com  priority 10

```

---

### Environment Variables
```

RESEND_API_KEY

```

---

## 🔁 6. WORKFLOWS (STEP-BY-STEP)

### Email Send + Reply Capture

1. Run:
```

node send-test-email.js

```
2. Email sent via Resend
3. Email includes:
- reply_to with leadId
4. User receives email (Gmail)
5. User clicks reply
6. Gmail sends to reply subdomain
7. MX routes to AWS inbound SMTP
8. Resend receives inbound
9. Resend fires webhook
10. Next.js endpoint:
 - Parses email
 - Extracts leadId
11. Prisma updates lead

---

## 🚧 7. KNOWN ISSUES / RISKS

- ❌ Namecheap blocking saves due to unsaved record state
- ❌ Potential invalid TXT record (editing row not committed)
- ❌ Incorrect record types previously used (TXT instead of MX)
- ❌ Gmail replying to root domain instead of subdomain
- ❌ `reply_to` may not be correctly injected in email headers
- ❌ No `email.received` webhook firing yet
- ❌ DNS propagation delay vs misconfiguration unclear
- ❌ Inbound email routing fragile if MX misconfigured

---

## 🎯 8. NEXT PRIORITIES

1. Fix Namecheap DNS:
- Remove or save all pending records
- Ensure no invalid TXT for MX

2. Confirm MX record exists ONLY in Mail Settings

3. Verify email headers:
- Check “Show Original” in Gmail
- Confirm correct `Reply-To`

4. Re-test reply flow

5. Confirm webhook receives:
- `email.received`

6. Validate Prisma update execution

---

## 📏 9. STANDARDS & CONSTRAINTS (CRITICAL)

- Must use subdomain for inbound email (`reply.`)
- Must use MX (NOT TXT) for inbound routing
- Must ensure DNS fully saved before testing
- Must include `reply_to` in every outbound email
- API routes must be non-blocking and resilient
- Webhooks must handle duplicate calls safely
- System must not crash on missing data

---

## 🧩 10. MISSING BUT NEEDED (GAPS)

- Full inbound email parsing (body, attachments)
- Lead matching fallback (if leadId missing)
- Email threading / conversation tracking
- Production-ready domain (non-testing constraints)
- Logging/monitoring for webhook failures
- Retry handling for failed updates

---

## 🧾 11. TERMINOLOGY (NORMALIZED)

- Lead = sellerLead database record
- Reply Email = inbound user response
- Reply Address = `reply+{leadId}@reply.domain.com`
- Webhook = Resend event callback
- Inbound Email = email received via MX routing
- Outbound Email = email sent via Resend API

---

## 🧠 12. ASSUMPTIONS MADE

- Resend inbound email requires MX pointing to AWS SMTP
- User intends to track replies per lead
- Prisma schema includes `sellerLead.id`
- Email replies will always include `reply_to`
- Namecheap is authoritative DNS provider
- No external email provider (Google Workspace) handling MX
- System is currently in development (not production traffic)

---
```


2026-03-29
==============================
PROJECT BRAIN — CONTEXT CAPTURE
==============================

DATE STARTED: 2026-03-29  
DATE ENDED (MOVE TO NEW CHAT): 2026-03-29  
ACTIVE WORK TIME: ~4–6 hours

---

## 🧱 1. PROJECT SNAPSHOT (CURRENT STATE)

WORKED ON:
- DNS + email reply capture (Resend + inbound parsing)
- Supabase integration for reply storage
- MLS Grid API integration (initial ingestion pipeline)
- Property database schema alignment
- Listings frontend page

NOW FUNCTIONAL:
- Outbound email sending via Resend
- Reply-to email capture using subdomain (reply.davidquinngroup.com)
- Webhook processing for inbound replies
- Replies stored in Supabase (`email_replies`)
- Lead ID extraction from reply email alias (reply+{id}@domain)
- MLS Grid ingestion working (50 listings successfully inserted)
- `/listings` page rendering data from Supabase

PARTIALLY COMPLETE:
- MLS ingestion (no photos, partial fields)
- Property schema (missing full MLS coverage)
- Frontend listings (basic, no filters, no detail page)

BROKEN / UNCERTAIN:
- MLS rate limiting (currently exceeding limits)
- No pagination/throttling in ingestion
- No photo ingestion yet
- No production-safe ingestion scheduling

---

## 🏗️ 2. SYSTEM ARCHITECTURE (UPDATED)

### MLS INGESTION SYSTEM
FLOW:
MLS Grid API → fetchMLSGridListings → syncMLSGrid → Supabase (Property)

LOGIC:
- Pull paginated data via `@odata.nextLink`
- Loop through listings
- Transform MLS → internal schema
- Upsert into `Property` table

CONSTRAINTS:
- Must respect MLS Grid rate limits
- Must be idempotent (upsert by id)
- Must handle missing/null fields safely

---

### EMAIL SYSTEM
FLOW:
App → Resend → User → Reply → Resend Webhook → API → Supabase

LOGIC:
- Emails sent with Reply-To: reply+{leadId}@reply.domain
- Incoming webhook parses:
  - `to` address → extract leadId
  - `from` → sender email
- Insert into `email_replies`
- Update lead record

CONSTRAINTS:
- Reply domain must be verified
- MX + SPF + DKIM configured
- Webhook must be idempotent

---

### ALERT SYSTEM
STATUS:
- Not modified in this chat
- Still dependent on listing ingestion

---

### QUEUE SYSTEM
STATUS:
- Not implemented yet
- MLS ingestion currently synchronous (problem)

---

### FRONTEND (UI / PAGES)
- `/listings` page working
- Uses Supabase client (anon key)
- Fetches Property records

---

### API LAYER
- `/api/webhooks/email-reply`
  - Handles inbound email events
  - Inserts into Supabase

- `/api/mls/sync`
  - Triggers MLS ingestion
  - Runs full sync loop (currently blocking)

---

### DATABASE (PRISMA / SUPABASE)

TABLE: `Property`
FIELDS (confirmed working):
- id
- mlsId
- slug
- address
- city
- state
- zip
- price
- beds
- baths
- sqft
- latitude
- longitude
- status

TABLE: `email_replies`
FIELDS:
- id (message_id)
- lead_id
- from_email

CONSTRAINTS:
- Several fields are NOT NULL (state, zip caused failures)
- Schema cache delays caused earlier errors

---

## 🗂️ 3. FILES CREATED / MODIFIED

### /app/api/webhooks/email-reply/route.ts
- Handles Resend webhook
- Extracts leadId from reply email
- Inserts into Supabase
- Logs success/errors

---

### /lib/mls/mlsGridClient.ts
- Fetches MLS data
- Handles:
  - base URL
  - token auth
  - pagination (`@odata.nextLink`)

---

### /lib/mls/syncMLSGrid.ts
- Core ingestion loop
- Transforms MLS → Property schema
- Upserts into Supabase
- Handles pagination loop

---

### /app/api/mls/sync/route.ts
- API trigger for MLS sync
- Calls `syncMLSGrid`

---

### /app/listings/page.tsx
- Frontend listings page
- Uses Supabase client
- Requires `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🧠 4. BUSINESS LOGIC & RULES

- Each MLS listing → 1 Property record
- Primary key: `ListingKey`
- Upsert must overwrite existing listings
- Missing MLS fields must be defaulted:
  - city → "Unknown"
  - state → "CO"
  - zip → fallback required
- Email replies:
  - reply+{leadId}@domain = routing mechanism
  - leadId must map to CRM

---

## ⚙️ 5. ENVIRONMENT / CONFIG

ENV VARIABLES:

DATABASE_URL
RESEND_API_KEY
REDIS_URL

EMAIL_DOMAIN=reply.davidquinngroup.com
EMAIL_FROM=David <hello@davidquinngroup.com>

NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY  ✅ REQUIRED FOR FRONTEND
SUPABASE_SERVICE_ROLE_KEY      ✅ REQUIRED FOR BACKEND

MLS_GRID_BASE_URL=https://api.mlsgrid.com/v2
MLS_GRID_TOKEN=bd8970c...

EXTERNAL SERVICES:
- Supabase (DB + auth)
- Resend (email send + inbound)
- MLS Grid (listing data)

---

## 🔁 6. WORKFLOWS (STEP-BY-STEP)

### EMAIL REPLY CAPTURE FLOW
1. Send email via Resend
2. Include Reply-To: reply+{leadId}@domain
3. User replies
4. Resend receives email
5. Webhook fires → `/api/webhooks/email-reply`
6. Extract leadId from email alias
7. Insert into `email_replies`
8. Update CRM lead

---

### MLS INGESTION FLOW
1. Call `/api/mls/sync`
2. syncMLSGrid starts
3. Fetch listings from MLS Grid API
4. Loop listings
5. Transform fields
6. Upsert into `Property`
7. Follow `@odata.nextLink`
8. Repeat until complete

---

### LISTINGS PAGE FLOW
1. Page loads
2. Supabase client initialized (anon key)
3. Query `Property`
4. Render listings

---

## 🚧 7. KNOWN ISSUES / RISKS

- ❗ MLS RATE LIMIT VIOLATION
  - Hit 4 RPS (limit is 2 recommended / 4 max warning)
- ❗ No throttling or delay between requests
- ❗ No batching / background processing
- ❗ Sync endpoint is blocking (bad for production)
- ❗ Missing fields (photos, zip inconsistencies)
- ❗ Schema mismatch caused multiple failures
- ❗ No retry/backoff logic

---

## 🎯 8. NEXT PRIORITIES

1. MLS RATE LIMIT FIX (CRITICAL)
   - Add delay between requests
   - Limit concurrency
   - Implement cursor-based incremental sync

2. MOVE SYNC TO BACKGROUND WORKER
   - Queue-based ingestion
   - No API blocking

3. PROPERTY DETAIL PAGE
   - `/listing/[slug]`
   - Full MLS display

4. PHOTO INGESTION
   - Create PropertyPhoto pipeline
   - Map MLS media

5. DATA NORMALIZATION
   - Ensure all required fields populated
   - Handle nulls safely

6. SEARCH + FILTER UI

---

## 📏 9. STANDARDS & CONSTRAINTS (CRITICAL)

- MUST use upsert (idempotent ingestion)
- MUST respect MLS API limits
- MUST NOT block API routes for long jobs
- MUST separate frontend (anon key) and backend (service role)
- MUST handle missing MLS data gracefully
- MUST log all ingestion failures
- MUST design for production scale

---

## 🧩 10. MISSING BUT NEEDED (GAPS)

- Queue system (Redis / worker)
- Rate limiter for MLS API
- Incremental sync (lastUpdated filter)
- Photo ingestion system
- Property detail pages
- Search/filter backend
- Caching layer
- Monitoring/logging

---

## 🧾 11. TERMINOLOGY (NORMALIZED)

Listing = MLS record  
Property = Internal DB representation  
Lead = User/customer record  
Reply Email = inbound user response  
MLS Sync = ingestion pipeline  
Webhook = inbound email handler  
Upsert = insert or update record  

---

## 🧠 12. ASSUMPTIONS MADE

- MLS Grid provides consistent field structure
- ListingKey is globally unique
- State defaults to "CO" (Colorado market)
- Missing zip codes are acceptable with fallback
- Supabase used as primary DB (not Prisma runtime)
- Email replies map 1:1 to leads via alias

---

## 🚨 MLS GRID API WARNING (CRITICAL CONTEXT)

ISSUE:
- Exceeded rate limits (4 RPS vs allowed 2–4 RPS)

LIMITS:
- 7200 requests/hour
- 4 RPS max
- 40k requests/day

RISK:
- API access suspension

REQUIRED FIX:
- Add request throttling (≤2 RPS safe target)
- Add delay (500ms+ between requests)
- Avoid full re-syncs
- Use incremental sync strategy

---


2026-03-30
==============================
PROJECT BRAIN — CONTEXT CAPTURE
===============================

**Start Date:** 2026-03-30
**End / Transition Date:** 2026-03-30 (continuing in new chat)
**Active Work Time:** ~2–3 hours

---

## 🧱 1. PROJECT SNAPSHOT (CURRENT STATE)

**Worked on:**

* MLS ingestion system refactor
* Migration from synchronous API ingestion → distributed queue system
* BullMQ queue architecture
* Worker separation (parent + page workers)
* Supabase integration fixes (env + client initialization)
* Retry, DLQ, idempotency, deduplication
* Horizontal scaling architecture

**Now Functional:**

* Queue system (BullMQ + Redis local)
* Parent worker (`mlsWorker`)
* Page worker (`mlsPageWorker`)
* Page-level job distribution
* Supabase writes via workers
* Retry + exponential backoff
* Dead-letter queue
* Job deduplication (singleton job)
* Dashboard (Bull Board)

**Partially Complete:**

* API trigger (`/api/mls/sync`) not running (Next.js dev server not active)
* Page-level ingestion not yet validated end-to-end
* Backpressure / adaptive rate limiting not implemented

**Broken / Uncertain:**

* API server (localhost:3000) not running → cannot trigger jobs
* Full distributed flow not yet confirmed in logs
* No monitoring of throughput or failure rates yet

---

## 🏗️ 2. SYSTEM ARCHITECTURE (UPDATED)

### MLS Ingestion System

**Flow:**

1. API route triggers sync job
2. Parent worker fetches MLS pages
3. Each page is queued as a job
4. Page workers process listings in parallel
5. Listings upserted into Supabase

**Key Logic:**

* Page-based fan-out architecture
* Parallel listing processing (p-limit)
* Retry logic per operation
* Last sync timestamp persisted

**Constraints:**

* Must be idempotent (upsert on `mlsId`)
* Must not run duplicate sync jobs
* Must handle MLS API rate limits

---

### Queue System (BullMQ)

**Queues:**

* `mls-sync` → parent job (singleton)
* `mls-page` → distributed page jobs
* `mls-dead-letter` → failed jobs

**Features:**

* Retry (attempts: 5)
* Exponential backoff
* Deduplication via `jobId`
* Redis-based locking
* Dashboard monitoring

---

### API Layer

**Endpoint:**

* `/api/mls/sync`

**Behavior:**

* Enqueues MLS sync job
* Returns immediately (non-blocking)

**Constraint:**

* Must not perform heavy work directly

---

### Database (Supabase)

**Tables:**

* `Property`
* `mls_sync_state`

**Key Fields:**

* `mlsId` (unique)
* `lat`, `lng`, `propertyType`, `updatedAt` (NOT NULL)
* `last_sync` (sync tracking)

**Behavior:**

* Upsert listings
* Persist last sync timestamp

---

### Frontend

**Status:**

* Not worked on in this chat
* Localhost UI currently not running

---

### Alert System

**Status:**

* Not modified in this chat

---

### Email System

**Status:**

* Not modified in this chat

---

## 🗂️ 3. FILES CREATED / MODIFIED

### `/lib/mls/syncMLSGrid.ts`

* Refactored to parent job
* Removed listing processing
* Added page job enqueue logic
* Added retry + lastSync persistence

---

### `/workers/mlsWorker.ts`

* Parent worker
* Handles sync job
* Uses Redis lock to prevent duplicates
* Tracks progress

---

### `/workers/mlsPageWorker.ts`

* Processes page jobs
* Parallel listing upserts (p-limit)
* Writes to Supabase

---

### `/lib/queue/mlsQueue.ts`

* Singleton job enqueue
* Retry + backoff config

---

### `/lib/queue/mlsPageQueue.ts`

* New queue for page jobs

---

### `/lib/queue/deadLetterQueue.ts`

* Stores failed jobs

---

### `/scripts/queueDashboard.ts`

* BullMQ dashboard server

---

### `/app/api/mls/sync/route.ts`

* API trigger for queue

---

## 🧠 4. BUSINESS LOGIC & RULES

* Listings identified by `mlsId`
* Upserts must be idempotent
* Missing MLS fields defaulted safely
* Last sync timestamp controls incremental ingestion
* Only ONE sync job allowed at a time (singleton)
* Failures must not stop entire pipeline
* Each listing processed independently

---

## ⚙️ 5. ENVIRONMENT / CONFIG

**Env Vars:**

* `NEXT_PUBLIC_SUPABASE_URL`
* `SUPABASE_SERVICE_ROLE_KEY`
* `REDIS_URL`
* `MLS_GRID_BASE_URL`
* `MLS_GRID_TOKEN`
* `DATABASE_URL`
* `RESEND_API_KEY`

**Services:**

* Supabase (DB)
* Redis (local via brew)
* BullMQ (queue)
* MLS Grid API

---

## 🔁 6. WORKFLOWS

### MLS Ingestion Flow

1. User hits `/api/mls/sync`
2. API enqueues `mls-sync` job
3. Parent worker picks job
4. Fetches MLS page
5. Enqueues `mls-page` job per page
6. Page workers process listings
7. Listings upserted into Supabase
8. Last sync updated

---

### Retry Flow

1. Failure occurs
2. BullMQ retries (max 5 attempts)
3. Exponential delay applied
4. If still failing → DLQ

---

### Deduplication Flow

1. Job added with fixed `jobId`
2. If job exists → ignored
3. Prevents duplicate syncs

---

## 🚧 7. KNOWN ISSUES / RISKS

* API server not running (blocking trigger)
* No backpressure → risk of MLS throttling
* No dynamic concurrency control
* Potential Supabase rate limits
* No monitoring metrics (only logs)
* Large pages passed in queue payload (memory risk)

---

## 🎯 8. NEXT PRIORITIES

1. Fix API server (ensure Next.js running)
2. Validate full pipeline end-to-end
3. Add backpressure + adaptive rate limiting
4. Add metrics (throughput, failures)
5. Move to page cursor-based jobs (not raw listings payload)
6. Add horizontal worker scaling (multi-instance)
7. Add alert/email integration post-ingestion

---

## 📏 9. STANDARDS & CONSTRAINTS (CRITICAL)

* Supabase = source of truth (NOT Prisma)
* All heavy work must be queued
* API routes must be non-blocking
* System must be idempotent
* Must support horizontal scaling
* Must handle retries + failures gracefully
* No global state dependencies (env-safe initialization)
* Workers must be independent processes

---

## 🧩 10. MISSING BUT NEEDED (GAPS)

* Backpressure system
* Adaptive concurrency tuning
* Metrics + observability (Prometheus / logs)
* Alert triggering pipeline
* Email delivery integration
* Listing media/images ingestion
* Pagination cursor persistence
* Rate limit detection from MLS API

---

## 🧾 11. TERMINOLOGY (NORMALIZED)

* **Listing** = MLS property record
* **Property** = stored DB record
* **Sync Job** = full MLS ingestion trigger
* **Page Job** = one MLS API page
* **Worker** = background processor
* **Queue** = BullMQ job queue
* **DLQ** = dead-letter queue (failed jobs)
* **Last Sync** = timestamp for incremental updates

---

## 🧠 12. ASSUMPTIONS MADE

* MLS API supports pagination via `@odata.nextLink`
* `mlsId` is unique and stable
* Supabase schema is already production-ready
* Redis is local (not yet Upstash/managed)
* Workers will eventually run on separate infrastructure
* Listing payload size is manageable per page (may need optimization later)

---

**END OF CONTEXT CAPTURE**


2026-03-31
==============================
PROJECT BRAIN — CONTEXT CAPTURE
===============================

**Chat Start Date:** 2026-03-30
**Continuation Date:** 2026-03-31
**Active Work Duration:** ~6–8 hours

---

## 🧱 1. PROJECT SNAPSHOT (CURRENT STATE)

### ✅ Completed / Functional

* MLS ingestion pipeline fully operational end-to-end
* API endpoint `/api/mls/sync` successfully queues jobs
* Redis queue (BullMQ) functioning correctly
* Worker system (mlsWorker) processing jobs
* MLS Grid API integration working
* Pagination working (28+ pages, 200 listings/page)
* Last sync timestamp logic working
* Environment variables successfully loaded in worker via dotenv
* Supabase connection initialized and usable

### 🟡 Partially Complete

* Page worker system exists but not properly integrated
* Queue-based page distribution not implemented (currently sequential ingestion)
* Supabase upsert logic assumed but not fully validated at scale
* Alert system partially stubbed / disconnected
* Photo processing disabled (stubbed)

### ❌ Broken / Incorrect

* Page worker receives `undefined` page data
* Page jobs not properly enqueued from MLS worker
* Worker build includes unrelated systems (alerts, CRM, email)
* TypeScript build errors from non-MLS modules
* No rate limiting / backpressure
* No batching for DB writes

---

## 🏗️ 2. SYSTEM ARCHITECTURE (UPDATED)

### MLS Ingestion System

**Flow:**
API → Queue (`mls-sync`) → Worker → MLS Grid API → Process Listings → Supabase

**Current Logic:**

* Fetch listings via MLS Grid API using `$top` + `$skip`
* Filter by `ModificationTimestamp > lastSync`
* Loop through pages sequentially
* Process listings inline (NOT queued per page)

**Constraints:**

* Must be idempotent
* Must support incremental sync
* Must avoid MLS rate limits

---

### Alert System

* Disabled / decoupled from ingestion
* Removed from worker build
* No active processing

---

### Email System

* Present but excluded from worker execution
* Uses Resend (not installed in worker context)

---

### Queue System (BullMQ + Redis)

* Redis running locally (`127.0.0.1:6379`)
* Queues:

  * `mls-sync` → main ingestion jobs
  * `mls-page` → intended for page-level jobs (not wired correctly)
* Job retries enabled (`attempts: 5`)
* Singleton job logic removed (to prevent deadlocks)

---

### Frontend (UI / Pages)

* Next.js app running
* API routes functional
* No UI-specific changes in this session

---

### API Layer

* `/api/mls/sync` endpoint:

  * Calls `enqueueMLSJob()`
  * Adds job to Redis queue
  * Returns `{ status: "queued", jobId }`

**Constraints:**

* Must remain non-blocking
* No heavy processing in API

---

### Database (Supabase)

* Source of truth (NOT Prisma)
* Connected via env variables
* Used in `syncMLSGrid`
* No batching yet (likely per-record writes)

---

## 🗂️ 3. FILES CREATED / MODIFIED

### `/lib/queue/mlsQueue.ts`

* Defines BullMQ queue (`mls-sync`)
* Handles job enqueueing
* Removed singleton job logic
* Added logging

---

### `/workers/mlsWorker.ts`

* Worker for MLS ingestion
* Loads `.env.local` via dotenv
* Executes `syncMLSGrid()`
* Added full logging (boot, job received, success/failure)

---

### `/workers/mlsPageWorker.ts`

* Page worker (exists but misconfigured)
* Receives jobs but `page` is undefined

---

### `/lib/mls/syncMLSGrid.ts`

* Core ingestion logic
* Handles pagination
* Calls MLS Grid API
* Uses lastSync timestamp
* Processes listings inline (no queue distribution yet)

---

### `/lib/mls/processListing.ts`

* Simplified to Supabase-only upsert
* Removed alerts + queues

---

### `/lib/mls/processPhotos.ts`

* Stubbed (disabled)

---

### `/lib/prisma.ts`

* Stubbed (`export const prisma = null`)

---

### `/tsconfig.worker.json`

* Configured for worker-only compilation
* Includes only:

  * `workers/**/*`
  * `lib/mls/**/*`
  * `lib/queue/**/*`
* Excludes alerts, email, prisma, etc.

---

## 🧠 4. BUSINESS LOGIC & RULES

* Listings are fetched from MLS Grid API
* Only listings with `ModificationTimestamp > lastSync` are processed
* Pagination uses `$top` and `$skip`
* Each page returns up to 200 listings
* Sync updates `lastSync` after completion
* Ingestion must be repeatable and safe (idempotent)
* Alerts and email must NOT run during ingestion

---

## ⚙️ 5. ENVIRONMENT / CONFIG

### Core Variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
MLS_GRID_BASE_URL
MLS_GRID_TOKEN
REDIS_URL
DATABASE_URL
RESEND_API_KEY
EMAIL_DOMAIN
EMAIL_FROM
```

### Key Notes

* Workers require explicit dotenv load:

  ```ts
  dotenv.config({ path: '.env.local' })
  ```
* Redis local instance required
* Supabase is primary DB (Prisma unused)

---

## 🔁 6. WORKFLOWS (STEP-BY-STEP)

### MLS Ingestion Flow

1. API receives `/api/mls/sync`
2. Calls `enqueueMLSJob()`
3. Job added to Redis (`mls-sync`)
4. Worker picks up job
5. `syncMLSGrid()` executes:

   * Get lastSync
   * Fetch MLS pages sequentially
   * Process listings
6. Update lastSync
7. Job completes

---

### Intended (Not Yet Implemented)

1. MLS worker enqueues page jobs
2. Page worker processes each page
3. Listings processed in parallel

---

## 🚧 7. KNOWN ISSUES / RISKS

* Page worker receives `undefined` page data
* No parallel processing (sequential bottleneck)
* No rate limiting → risk of MLS API throttling
* No batching → inefficient DB writes
* Worker build includes irrelevant modules
* Env keys exposed (must rotate)
* No monitoring / observability
* No dead-letter queue handling

---

## 🎯 8. NEXT PRIORITIES

1. Implement page-level queue system (CRITICAL)
2. Fix page worker payload (`page`, `skip`, etc.)
3. Add backpressure / rate limiting
4. Implement Supabase batch upserts
5. Clean worker build (remove unrelated modules)
6. Reintroduce alerts as separate pipeline
7. Add logging + monitoring

---

## 📏 9. STANDARDS & CONSTRAINTS (CRITICAL)

* Supabase = source of truth (NO Prisma)
* All async work must use queues
* API routes must be non-blocking
* Workers must be isolated and minimal
* No cross-system dependencies (alerts/email)
* Ingestion must be idempotent
* System must scale horizontally
* No heavy processing inside API

---

## 🧩 10. MISSING BUT NEEDED (GAPS)

* Page queue architecture (parallel ingestion)
* Rate limiting system (MLS-safe)
* Batch database writes
* Retry + dead-letter handling strategy
* Monitoring (logs, metrics)
* Alert system reimplementation (decoupled)
* Photo ingestion pipeline
* Typesense / search indexing integration

---

## 🧾 11. TERMINOLOGY (NORMALIZED)

* **Listing** = Property record from MLS
* **MLS Sync** = Full ingestion job
* **Page Job** = Single MLS page fetch + process
* **Worker** = Background processor (BullMQ)
* **Queue** = Redis-backed job pipeline
* **Alert** = User notification trigger
* **Ingestion** = Fetch + normalize + store listings
* **Backpressure** = Rate limiting to protect APIs

---

## 🧠 12. ASSUMPTIONS MADE

* Supabase schema exists and supports upserts
* MLS Grid API credentials are valid
* Listing processing writes to Supabase correctly
* Redis is local and stable
* No authentication required for MLS sync endpoint (dev mode)
* Page worker intended for future parallelization
* Prisma is deprecated in this system

---

2026-03-31
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


2026-04-02
==============================
PROJECT BRAIN — CONTEXT CAPTURE
===============================

**Start Date:** 2026-04-02
**Continuation Date:** 2026-04-02
**Active Work Duration:** ~3–5 hours

---

## 🧱 1. PROJECT SNAPSHOT (CURRENT STATE)

**Worked On:**

* Deployment to Vercel
* Environment variables setup (incomplete)
* Typesense production migration planning
* Map UI (clusters, hover sync, previews)
* Saved searches + alert system architecture

**Functional:**

* Next.js app running locally
* Map UI with clustering, hover sync, selection
* Search API working locally
* Typesense running locally via Docker
* Supabase integration working
* MLS ingestion queue + worker system functional locally

**Partially Complete:**

* Deployment (app live but not fully configured)
* Environment variables (Supabase present, others missing)
* Typesense integration (local only, not production-ready)
* Alert system (logic exists, not fully wired to email sending)

**Broken / Uncertain:**

* Production search (no Typesense cloud)
* Workers not deployed in production
* Email alerts not operational
* Environment variables missing → production instability

---

## 🏗️ 2. SYSTEM ARCHITECTURE (UPDATED)

### MLS Ingestion System

* Worker: `mlsPageWorker.ts`
* Fetches paginated MLS data
* Uses adaptive rate limiter
* Stores in Supabase
* Indexes into Typesense
* Enqueues next page recursively

---

### Alert System

* Table: `saved_searches`
* Stores:

  * email
  * filters (JSON)
  * last_run timestamp
* Worker:

  * Queries Typesense using filters
  * Compares results
  * Triggers email if matches found

---

### Email System

* Provider: Resend
* Sends listing alerts
* HTML email with listing preview
* Not fully wired into production worker

---

### Queue System

* Library: BullMQ
* Redis-backed
* Queues:

  * `mls-page`
* Workers:

  * Page ingestion worker
  * (planned) alert worker
* Concurrency: 1 (rate-limited ingestion)

---

### Frontend (UI / Pages)

#### `/map`

* Leaflet-based map
* Features:

  * Dynamic clustering (Supercluster)
  * Hover sync with sidebar
  * Selected listing preview
  * Bounding box search
  * Sidebar listing cards with images

---

### API Layer

#### `/api/search`

* Queries Typesense
* Supports:

  * text query
  * city
  * price range
  * beds
  * bounding box (geo search)
* Returns:

  * hits
  * count

#### `/api/save-search`

* Stores saved search in Supabase
* Accepts:

  * email
  * filters JSON

---

### Database (Supabase)

#### `listings`

* MLS data
* Upserted by ingestion worker

#### `saved_searches`

* email
* filters (JSON)
* last_run
* created_at

---

## 🗂️ 3. FILES CREATED / MODIFIED

### `/workers/mlsPageWorker.ts`

* Handles paginated MLS ingestion
* Adaptive throttling
* Recursive queue chaining

---

### `/lib/mls/processListingsBatch.ts`

* Upserts listings into Supabase
* Indexes into Typesense

---

### `/app/api/search/route.ts`

* Typesense query layer
* Filter building logic (geo + filters)

---

### `/app/api/save-search/route.ts`

* Saves user search preferences

---

### `/workers/alertWorker.ts`

* Iterates saved searches
* Queries Typesense
* Triggers alerts (email pending integration)

---

### `/components/maps/SearchMap.tsx`

* Leaflet map
* Supercluster integration
* Dynamic clustering by viewport + zoom
* Hover + selection sync
* Marker rendering logic

---

### `/app/map/page.tsx`

* Sidebar UI
* Listings display
* Hover + selection state
* Fetches listings from API

---

### `/lib/email/sendEmail.ts`

* Sends alert emails via Resend

---

## 🧠 4. BUSINESS LOGIC & RULES

* Listings are uniquely identified by `mls_id`
* Upserts must be idempotent
* Search filters:

  * price range
  * beds minimum
  * city match
  * geo bounding box
* Alerts trigger when:

  * new listings match filters
* Map behavior:

  * clusters expand on click
  * hover sync between map + sidebar
* Listings must include:

  * lat/lng for map
  * price for display
  * address for UI

---

## ⚙️ 5. ENVIRONMENT / CONFIG

### Required Env Variables

#### Supabase

* `NEXT_PUBLIC_SUPABASE_URL`
* `SUPABASE_SERVICE_ROLE_KEY`

#### Typesense (NOT CONFIGURED YET)

* `TYPESENSE_API_KEY`
* `TYPESENSE_HOST`
* `TYPESENSE_PORT`
* `TYPESENSE_PROTOCOL`

#### Email

* `RESEND_API_KEY`

---

### External Services

* Vercel (frontend + API)
* Supabase (DB)
* Typesense (search engine)
* Resend (email)

---

## 🔁 6. WORKFLOWS (STEP-BY-STEP)

### MLS Ingestion Flow

1. Trigger sync API
2. Enqueue page 0
3. Worker fetches listings
4. Save to Supabase
5. Index into Typesense
6. Enqueue next page
7. Repeat until no data

---

### Search Flow

1. User moves map / sets filters
2. Frontend sends request to `/api/search`
3. API builds Typesense query
4. Typesense returns hits
5. UI updates map + sidebar

---

### Saved Search Flow

1. User enters email + filters
2. API stores in `saved_searches`
3. Worker periodically runs
4. Queries Typesense
5. Matches found → trigger email

---

### Alert Email Flow

1. Worker detects matching listings
2. Formats email
3. Sends via Resend
4. Updates `last_run`

---

## 🚧 7. KNOWN ISSUES / RISKS

* ❌ Typesense not deployed (blocking production search)
* ❌ Env vars incomplete in Vercel
* ❌ Workers not running in production
* ❌ Email system not triggered automatically
* ❌ Redis dependency mismatch issues (ioredis vs bullmq)
* ⚠️ Map performance at scale (needs optimization)
* ⚠️ No auth system (emails not tied to users)

---

## 🎯 8. NEXT PRIORITIES

1. Setup Typesense Cloud (CRITICAL)
2. Add environment variables in Vercel
3. Redeploy app
4. Verify production search
5. Deploy workers (Railway or similar)
6. Enable email alerts fully
7. Add authentication system

---

## 📏 9. STANDARDS & CONSTRAINTS (CRITICAL)

* All ingestion must be async via queues
* Workers must be idempotent
* API routes must be stateless
* No blocking operations in API routes
* All external services must be environment-driven
* Production must NOT depend on localhost services
* Search must be handled via Typesense (not DB)

---

## 🧩 10. MISSING BUT NEEDED (GAPS)

* Typesense Cloud deployment
* Worker hosting (Railway)
* Auth system (users)
* CRM / lead tracking
* Payment system (Stripe)
* SEO pages for listings
* Image pipeline for listings
* Rate limiting for public API

---

## 🧾 11. TERMINOLOGY (NORMALIZED)

* Listing = MLS property record
* Hit = Typesense search result
* Cluster = grouped map markers
* Alert = triggered notification for saved search
* Worker = background processor
* Sync Run = MLS ingestion session
* Filters = search constraints (price, beds, geo)

---

## 🧠 12. ASSUMPTIONS MADE

* Supabase is production-ready and correctly configured
* Listings include lat/lng fields
* Typesense schema includes geo field (`location`)
* Email alerts will be batch-based (not real-time streaming)
* Redis is available locally for queue system
* Vercel is primary hosting for frontend/API
* Typesense Cloud will replace local Docker instance

**END OF CONTEXT CAPTURE**


2026-04-04
```
==============================
PROJECT BRAIN — CONTEXT CAPTURE
==============================

Date Started: 2026-04-04  
Date Continued in New Chat: 2026-04-04  
Active Work Duration: ~6–8 hours (continuous debugging + deployment)

---

## 🧱 1. PROJECT SNAPSHOT (CURRENT STATE)

### ✅ Completed / Working
- Next.js app builds almost fully
- Prisma downgraded to v5 and generating correctly
- Core API routes compiling
- MLS ingestion logic structured (skip/top pagination)
- Alert system logic implemented
- Email system using Resend working
- Queue system operational without limiter conflicts
- Map + clustering system compiled
- Most TypeScript errors resolved globally

### 🟡 Partially Complete
- Seller lead pipeline (createSellerLead partially functional)
- MLS ingestion queue orchestration (logic exists, not fully validated live)
- Search filtering aligned but needs validation against DB schema

### ❌ Broken / Current Blocking Issue
- Syntax error in `createSellerLead.ts` (malformed object)
- Remaining minor schema mismatches possible

---

## 🏗️ 2. SYSTEM ARCHITECTURE (UPDATED)

### MLS Ingestion System
- Uses MLS Grid API
- Pagination via `skip + top`
- Rate limited at API client level
- Coordinator enqueues pages into queue
- Worker processes listings asynchronously

Flow:
MLS API → fetchMLSGridListings → syncMLSGrid → mlsPageQueue → worker

Constraints:
- No nextLink pagination anymore
- Controlled batching (TOP = 200)
- Idempotent ingestion expected

---

### Alert System
- Matches listings to saved searches
- Filters:
  - city match
  - minPrice <= listing.price
  - beds <= listing.beds
- Deduplication via `alertEvent`
- Writes to `alertQueue`

---

### Email System
- Uses Resend
- No generic sendEmail abstraction (removed)
- Two pipelines:
  - Listing digest (sendAlert)
  - Seller outreach (direct Resend call)

Enhancements:
- Deal scoring engine
- Urgency detection
- Seller lead trigger

---

### Queue System
- BullMQ-based
- No limiter config (removed due to type conflicts)
- Rate limiting handled in API client
- Queues:
  - mlsPageQueue
  - alertQueue (DB-backed)

---

### Frontend (UI / Pages)
- Map-based UI using react-leaflet
- Cluster logic via supercluster
- Property maps + neighborhood overlays
- Some disabled routes still present (causing build issues)

---

### API Layer
Endpoints:
- /api/map-listings
- /api/process-alerts
- /api/test-alert
- /api/track-click
- /api/unsubscribe

Rules:
- No blocking operations
- Async-safe logic
- DB + queue separation

---

### Database (Prisma)

Key Models:
- Property
- savedSearch
- alertQueue
- alertEvent
- SellerLead
- user

Important Fix:
- Prisma v7 → downgraded to v5
- prisma client now globally stable (non-null)

SellerLead (current):
- id
- city
- beds
- price
- reason
- propertyId

---

## 🗂️ 3. FILES CREATED / MODIFIED

### Core Fixes
- lib/prisma.ts → global singleton fix (non-null prisma)
- lib/db.ts → Prisma import fix

### MLS
- lib/mls/syncMLSGrid.ts → skip/top pagination, queue integration
- lib/mls/mlsGridClient.ts → API fetch + rate limiting

### Alerts
- lib/alerts/matchSearches.ts → matching + queue writes
- lib/alerts/processAlertQueue.ts → batch processing

### Email
- lib/email/sendAlert.ts → full pipeline (deal scoring, urgency, leads)
- lib/outreach/sendSellerOutreach.ts → switched to Resend direct

### Seller
- lib/seller/createSellerLead.ts → lead creation + dedupe (currently broken syntax)

### Queue
- lib/queue/mlsQueue.ts → limiter removed

### Maps
- components/maps/* → multiple Leaflet + clustering fixes

### Search
- lib/search/searchProperties.ts → beds/baths schema alignment

### Misc Fixes
- unsubscribe route → prisma null fix
- process-alerts route → duplicate vars removed
- test-result route → id required fix

---

## 🧠 4. BUSINESS LOGIC & RULES

### Matching Logic
- City must match
- Price ≥ minPrice
- Beds ≥ search.beds

### Deal Scoring
- >20% below market → score 60
- >10% → score 40
- >5% → score 20

### Seller Lead Trigger
- dealScore ≥ 40
- Max 10 leads per run

### Deduplication
- alertEvent unique constraint:
  (userId, propertyId, type)

### Email Rules
- No email if:
  - no user email
  - no listings
  - no API key

---

## ⚙️ 5. ENVIRONMENT / CONFIG

### Required ENV
- DATABASE_URL
- NEXT_PUBLIC_SITE_URL
- RESEND_API_KEY
- EMAIL_FROM
- MLS_GRID_BASE_URL
- MLS_GRID_TOKEN
- NEXT_PUBLIC_SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY

### Services
- Supabase (sync state)
- Resend (email)
- MLS Grid API
- Vercel (deployment)

---

## 🔁 6. WORKFLOWS

### MLS Ingestion
1. syncMLSGrid starts
2. fetchMLSGridListings(skip, top)
3. enqueue page into mlsPageQueue
4. worker processes listings
5. DB updated
6. lastSync updated

---

### Alert Trigger Flow
1. New listing ingested
2. matchSavedSearches runs
3. Matching searches found
4. Dedup check (alertEvent)
5. alertQueue record created
6. Worker processes queue
7. sendAlert triggered

---

### Email Pipeline
1. Listings enriched (deal + urgency)
2. Seller lead detection
3. createSellerLead
4. createTask (CRM)
5. Render ListingDigestEmail
6. Send via Resend

---

## 🚧 7. KNOWN ISSUES / RISKS

- ❌ Syntax error in createSellerLead.ts (missing comma / malformed object)
- Disabled routes still compiled by Next.js
- Inconsistent naming:
  - listingId vs propertyId
- Type safety bypassed using `as any` in places
- Queue not yet fully load-tested
- MLS ingestion not validated at scale

---

## 🎯 8. NEXT PRIORITIES

1. Fix createSellerLead syntax error
2. Full successful deploy
3. Validate MLS ingestion live
4. Validate alert + email pipeline end-to-end
5. Remove all disabled routes from /app
6. Add logging + monitoring
7. Harden type safety (remove `any`)
8. Add retry/failure handling for queues

---

## 📏 9. STANDARDS & CONSTRAINTS (CRITICAL)

- Prisma must never be nullable
- All async work → queues
- API routes must be fast (no heavy work)
- Deduplication required for alerts
- Email sending must be idempotent
- MLS ingestion must be incremental (lastSync)
- Rate limiting must be enforced at API layer

---

## 🧩 10. MISSING BUT NEEDED (GAPS)

- Queue workers (production-ready deployment)
- Monitoring / logging system
- Error retry system
- Admin dashboard
- Lead CRM UI
- Email unsubscribe UI handling improvements
- MLS ingestion validation + backfill

---

## 🧾 11. TERMINOLOGY (NORMALIZED)

- Listing = property from MLS
- Property = DB representation of listing
- Alert = notification trigger record
- AlertQueue = pending notifications
- AlertEvent = deduplication record
- SellerLead = potential seller opportunity
- Deal Score = pricing advantage metric
- Worker = background processor
- Queue = async job system

---

## 🧠 12. ASSUMPTIONS MADE

- Property model uses `beds` and `baths` (not bedrooms/bathrooms)
- SellerLead uses `propertyId` not `listingId`
- Queue system uses BullMQ
- Resend is sole email provider
- Supabase used only for sync metadata
- MLS API supports skip/top pagination
- Disabled folders inside /app still compile

---
**END OF CONTEXT CAPTURE**


2026-04-04
````
==============================
PROJECT BRAIN — CONTEXT CAPTURE
==============================

Chat Start Date: 2026-04-04  
Context Capture Created: 2026-04-04  
Active Work Time: ~2–3 hours (continuous build/debug cycle)

---

## 🧱 1. PROJECT SNAPSHOT (CURRENT STATE)

WORKED ON:
- Full production deployment pipeline (Next.js + Vercel)
- TypeScript build stabilization
- Prisma + DB connectivity fixes
- MLS ingestion (serverless-compatible version)
- API reliability (map listings + MLS sync)
- Environment variable handling on Vercel
- Removal of worker-based architecture for serverless compatibility

FUNCTIONAL:
- Production deploy (Vercel) ✅
- Prisma client generation in build ✅
- Database reads via raw SQL ✅
- `/api/map-listings` returning live data ✅ :contentReference[oaicite:0]{index=0}
- Basic MLS ingestion endpoint (single batch) ✅

PARTIALLY COMPLETE:
- MLS ingestion (only 1 batch, no pagination/queue)
- Data normalization inconsistencies (lat/lng vs latitude/longitude)
- Redis/BullMQ architecture disabled (not production-ready on Vercel)

BROKEN / UNCERTAIN:
- Queue system (BullMQ) not usable in serverless
- Redis dependency failing during build
- MLS ingestion scalability
- Proper background processing strategy

---

## 🏗️ 2. SYSTEM ARCHITECTURE (UPDATED)

### MLS Ingestion System
- Trigger: `/api/mls/sync`
- Fetch: `fetchMLSGridListings({ skip, top, lastSync })`
- Process: `processListingsBatch(listings)`
- CURRENT MODE: synchronous, single batch (25 records)
- CONSTRAINT: must be build-safe (no env usage during build)

---

### Alert System
- Not modified in this session
- Still dependent on listing ingestion + scoring

---

### Email System
- Not modified
- Uses Resend (configured via env)

---

### Queue System
- BullMQ + Redis originally implemented
- REMOVED from runtime usage
- Reason: Vercel serverless cannot maintain workers / Redis connections

---

### Frontend (UI / Pages)
- Fixed `useSearchParams` issue via Suspense boundary
- Pages now successfully prerender/build

---

### API Layer
- `/api/mls/sync` → safe runtime execution with dynamic imports
- `/api/mls/status` → stubbed (no real tracking)
- `/api/map-listings` → raw SQL fallback (working)

---

### Database (Prisma)
- Prisma client generated during build
- Schema mismatch detected:
  - `Property.id` does NOT exist
- Workaround:
  - Switched to `$queryRawUnsafe`

---

## 🗂️ 3. FILES CREATED / MODIFIED

### app/api/mls/sync/route.ts
- Purpose: trigger MLS ingestion
- Logic:
  - Build-safe guard (`if !env → skip`)
  - Dynamic imports to avoid build-time execution
  - Fetch + process listings

---

### app/api/mls/status/route.ts
- Purpose: placeholder status endpoint
- Logic:
  - Returns static response (no real tracking)

---

### lib/mls/syncMLSGrid.ts
- Purpose: enqueue MLS pages (deprecated)
- Logic:
  - Previously used BullMQ
  - Now unused

---

### workers/mlsWorker.ts
- Purpose: MLS coordinator (deprecated)
- Logic:
  - Previously queued jobs
  - Now unused

---

### workers/mlsPageWorker.ts
- Purpose: worker processor (deprecated)
- Logic:
  - Batch processing
  - Not usable in serverless

---

### app/api/map-listings/route.ts
- Purpose: return listings for map
- Logic:
  - Raw SQL query:
    ```sql
    SELECT * FROM "Property" LIMIT 50
    ```
  - Returns working dataset

---

### package.json
- Updated build script:
  - `"build": "prisma generate && next build"`

---

### app/home-value/address/page.tsx
### app/home-value/address/AddressContent.tsx
- Purpose: fix Suspense + search params issue

---

## 🧠 4. BUSINESS LOGIC & RULES

- Listings stored in `Property` table
- Map endpoint returns latest 50 listings
- MLS ingestion:
  - Pulls batch of listings
  - Immediately processes and stores
- System assumes:
  - Listings are append/update safe
  - No deduplication logic enforced yet

---

## ⚙️ 5. ENVIRONMENT / CONFIG

REQUIRED ENV:
- MLS_GRID_BASE_URL
- MLS_GRID_TOKEN
- REDIS_URL (currently unused in runtime)

IMPORTANT:
- Env must exist in **Production**, not just Preview
- Build environment ≠ runtime environment

EXTERNAL SERVICES:
- Vercel (hosting)
- Prisma (ORM)
- Supabase (DB)
- Typesense (search, not used here)
- Resend (email)

---

## 🔁 6. WORKFLOWS (STEP-BY-STEP)

### MLS Ingestion (CURRENT)

1. Call `/api/mls/sync`
2. Check env exists
3. Dynamically import MLS client
4. Fetch listings (skip=0, top=25)
5. Process batch
6. Store in DB
7. Return `{ status: success }`

---

### Map Listings Fetch

1. Call `/api/map-listings`
2. Execute raw SQL query
3. Return listings array

---

## 🚧 7. KNOWN ISSUES / RISKS

- ❌ Redis connection fails in Vercel (127.0.0.1:6379)
- ❌ BullMQ not usable in serverless
- ❌ No background processing
- ❌ MLS ingestion not scalable
- ❌ Schema mismatch (`id` missing)
- ❌ Duplicate/dirty data possible
- ⚠️ Raw SQL bypasses Prisma safety
- ⚠️ No pagination in API

---

## 🎯 8. NEXT PRIORITIES

1. Replace queue system (CRITICAL)
   - Options:
     - Vercel cron
     - External worker (Railway / Fly.io)
2. Fix Prisma schema mismatch
3. Implement proper MLS pagination ingestion
4. Add deduplication logic
5. Normalize lat/lng fields
6. Add ingestion logging + status tracking
7. Re-enable async processing (non-blocking)

---

## 📏 9. STANDARDS & CONSTRAINTS (CRITICAL)

- MUST be build-safe (no env access at build time)
- MUST NOT use long-running processes in API routes
- MUST avoid blocking API calls
- MUST support serverless execution
- MUST use dynamic imports for runtime-only logic
- MUST ensure Prisma client generated in build
- MUST assume no persistent workers

---

## 🧩 10. MISSING BUT NEEDED (GAPS)

- Background job system (critical)
- Deduplication logic
- Listing update vs insert logic
- Retry handling for ingestion
- Monitoring / logging system
- Real status tracking (not stub)
- Search indexing pipeline

---

## 🧾 11. TERMINOLOGY (NORMALIZED)

- Listing = MLS property record
- Property = DB representation of listing
- Ingestion = pulling + storing MLS data
- Sync = trigger ingestion process
- Batch = subset of listings fetched
- Worker = background processor (currently disabled)

---

## 🧠 12. ASSUMPTIONS MADE

- Property table exists and is primary dataset
- MLS API returns valid structured data
- Supabase DB schema differs from Prisma schema
- Serverless is required deployment model (Vercel)
- Queue system will be replaced externally

---

## ⚡ COLLABORATION MODE (IMPORTANT)

**Execution Style Established:**

- Zero explanation, command-first workflow
- One-step-at-a-time instructions
- Immediate feedback loop (command → result → fix)
- No redundancy
- Production-first decisions (not theoretical)
- Aggressive error resolution

**Name:**  
→ “Command-Driven Production Loop”

---

END OF CONTEXT
````


2026-04-05
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

2026-04-05
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


