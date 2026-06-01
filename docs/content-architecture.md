# Content Architecture

This document defines the REIE content and authority architecture for David Quinn Group. It translates the Master V7 direction into crawlable, locally specific, internally linked public surfaces that support Colorado real estate authority without creating thin or generic content.

Traceability control:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/REIE_MASTER_V7_TRACEABILITY.md`

Authoritative Master V7 source PDF:

- `/Users/davidquinn/Library/Mobile Documents/com~apple~CloudDocs/BUSINESS/DAVID QUINN GROUP/MEDIA & MARKETING/REAL ESTATE INTELLIGENCE ENGINE/REAL ESTATE INTELLIGENCE ENGINE-MASTER V 7.0.pdf`

## Purpose

REIE content should help users and search engines understand David Quinn Group as a real Colorado authority, especially for Boulder, Denver, and the greater Front Range.

The content system should not be a generic blog engine. It should connect property search, market intelligence, neighborhood context, client workflows, and structured entity signals into a useful public intelligence layer.

## Authority Goals

- Reinforce David Quinn Group as the entity behind the platform.
- Build topical authority around Colorado real estate.
- Build local authority around Boulder, Denver, Louisville, Lafayette, Superior, Erie, Broomfield, Longmont, and expansion Front Range markets.
- Connect listings, market pages, neighborhood pages, guides, tools, articles, and schema.
- Use real MLS-backed inventory as supporting evidence only when stable and current.
- Avoid treating local seed records as production authority content.

## Primary Public Surfaces

City pages:

- Should establish city-level buying, selling, relocation, lifestyle, market, and inventory context.
- Should link to relevant neighborhoods, market reports, search pages, guides, and available homes.

Neighborhood pages:

- Should provide local context, inventory signals, resilience or property intelligence where available, and nearby-area navigation.
- Should link to city pages, nearby neighborhoods, active listings, market context, and useful guides.

Market pages:

- Should explain market movement, pricing, inventory, and local buyer/seller implications.
- Should avoid unsupported claims when live data is unavailable or degraded.

Property pages:

- Should combine MLS facts, media, property intelligence, nearby context, related content, and conversion paths.
- Should avoid placeholder media in production-facing inventory where real MLS media exists.

Article and guide pages:

- Should answer real Colorado, Boulder, Denver, and Front Range search intent.
- Should link back into city, neighborhood, market, property, and tool surfaces.
- Should avoid generic national real estate advice unless localized and materially useful.

Tool pages:

- Should support user decisions, such as valuation, logistics, relocation, market comparison, or property intelligence.
- Should link to relevant authority content and capture useful engagement signals where appropriate.

CRM-informed content planning:

- Should use engagement and saved-search signals only as directional planning inputs, not as public claims about the market.
- Should rely on protected CRM reporting through `/api/admin/crm-tasks`, `/api/admin/crm-tasks/[id]`, and `/admin` when reviewing engagement handoff quality.
- Should treat CRM API Inspection metadata as an operational trust signal: `/api/admin/crm-tasks` reports `inspectionSource: "List Route"` and `/api/admin/crm-tasks/[id]` reports `inspectionSource: "Detail Route"` on success and error responses.
- Should confirm `/admin` preserves failed detail-route inspection metadata, returns to `List Route` metadata after active-list refresh, and keeps closure audit coverage visible before using CRM engagement as a planning input.

## Internal Linking Rules

- City pages link to neighborhoods, market pages, searches, guides, and available homes.
- Neighborhood pages link to parent city, nearby neighborhoods, active searches, and relevant market intelligence.
- Property pages link to nearby homes, neighborhood pages, city pages, related articles, and tools.
- Articles and guides link to city, neighborhood, market, tool, and search surfaces.
- Tool pages link to the most relevant education, market, and conversion surfaces.
- Internal links should help users move through real decision workflows, not only pass SEO weight.

## Schema And Entity Signals

Use schema components consistently:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/components/schema/RealEstateAgentSchema.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/components/schema/ArticleSchema.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/components/schema/FAQSchema.tsx`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/schema/realEstateAgentSchema.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/schema/articleSchema.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/schema/faqSchema.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/schema/toolSchema.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/schema/neighborhoodSchema.ts`

Schema should reinforce:

- David Quinn Group.
- Colorado real estate.
- Boulder and Denver local expertise.
- The relationship between agent/entity, content, markets, neighborhoods, tools, and property intelligence.

## Data Rules

- Supabase/Postgres remains the source of truth for inventory and content-linked property data.
- Typesense is a rebuildable search index, not the content source of truth.
- MLS-backed inventory can support authority pages, live-inventory claims, and large programmatic content batch publication only when `npm run supabase:check:json` reports readiness and search-index health, Search Smoke Readiness, canonical structure, metadata, indexing behavior, and timeout-bounded queue diagnostics are acceptable.
- CRM engagement signals can inform content prioritization only after CRM readiness, closure audit coverage, note-backed completion and dismissal, failed detail-route inspection preservation, and API Inspection metadata are visible through the protected admin workflow.
- Seed data is acceptable for local setup and visual QA, but it must not be used as production authority evidence.
- If `npm run supabase:check:json` reports blocked, or Typesense, Search Smoke Readiness, indexing behavior, or timeout-bounded queue diagnostics are degraded, authority pages should avoid presenting unstable inventory claims as current market fact.

## Production Gates

Before expanding public authority content at scale through large programmatic content batch publication:

1. Confirm the content topic supports real Colorado, Boulder, Denver, or Front Range value.
2. Confirm the page has useful internal links into existing REIE surfaces.
3. Confirm schema markup is appropriate and not duplicated incorrectly.
4. Confirm inventory references are backed by healthy data or clearly framed as static guidance.
5. Confirm `npm run supabase:check:json` reports readiness before relying on Supabase-backed inventory, CRM engagement signals, or live database-backed content claims.
6. Confirm `npm run smoke:search` reports `meta.smoke.ready=true` with no blockers when the page depends on live search/listing data.
7. Confirm `npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000` reports acceptable queue diagnostics before ingestion-volume increases, MLS-volume increases, scheduler cadence increases, recurring scheduler activation, recurring email traffic, live-inventory claims, MLS-backed public expansion, large programmatic content batch publication, or engagement signals are used for public planning.
8. Confirm CRM-informed content planning is backed by visible CRM readiness, closure audit coverage, note-backed CRM review state, and API Inspection metadata when engagement signals are used.
9. Confirm the content does not rely on local seed data as production evidence.
10. Confirm large programmatic content batch publication has passed `npm run supabase:check:json`, verified data, metadata, canonical structure, indexing behavior, Search Smoke Readiness, and timeout-bounded queue diagnostics before publication.

## Verification

Run after content architecture, schema, internal-linking, or authority-surface changes from **Terminal 5: Scripts / curl testing**:

```bash
npm run check:fast
```

Run broader checks before production content expansion or large programmatic content batch publication:

```bash
npm run worker:build
npm run supabase:check:json
npm run typecheck
npm run lint
npm run smoke:search
npm run smoke:mls-status
npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000
```

If `npm run supabase:check:json` reports blocked, stop before Supabase-backed content expansion, CRM-informed content planning, live-inventory claims, MLS-backed public expansion, or large programmatic content batch publication.

Run `npm run smoke:search` and `npm run smoke:mls-status` while **Terminal 1: Next.js app** is running.

Run protected CRM readiness checks from **Terminal 5: Scripts / curl testing** while **Terminal 1: Next.js app** is running before using engagement signals for public content planning:

```bash
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks?status=active&limit=6" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks?status=all&limit=20" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/crm-tasks/<task-id-from-list-response>" -H "x-admin-key: $REIE_ADMIN_API_KEY"
```

## Current Known Gaps

- Content expansion needs a prioritized city, neighborhood, article, guide, and tool roadmap.
- CRM engagement signals need a formal content-prioritization report after protected CRM readiness and API Inspection metadata pass production smoke checks.
- Property intelligence should be connected more visibly to market and neighborhood content.
- Production content and large programmatic content batch publication should wait for `npm run supabase:check:json`, stable live inventory, search-index health, Search Smoke Readiness, canonical structure, metadata, indexing behavior, and timeout-bounded queue diagnostics when inventory claims are central to the page.

<!-- /Users/davidquinn/david-quinn-group/colorado-real-estate/docs/content-architecture.md -->
