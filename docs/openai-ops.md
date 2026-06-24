# OpenAI Operations

Date: June 19, 2026

Project: David Quinn Group Real Estate Intelligence Engine

Working path:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate`

Traceability control:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/REIE_MASTER_V7_TRACEABILITY.md`

## Purpose

This document defines the operating boundary for OpenAI-backed features in REIE. The current source tree has a narrow AI surface for seller outreach copy and variant selection. It is not part of core public search, MLS ingestion, alert delivery, digest delivery, CRM scheduler reporting, Supabase recovery, queue recovery, or launch readiness.

The AI path must remain optional and fallback-safe until it is explicitly connected to a reviewed workflow.

## Current Source Boundary

Active AI source files:

- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/ai/generateSellerMessage.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/ai/selectVariant.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/ai/selectVariantBandit.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/ai/selectVariantContextual.ts`
- `/Users/davidquinn/david-quinn-group/colorado-real-estate/lib/ai/buildContextKey.ts`

Current behavior:

- `generateSellerMessage()` posts to OpenAI Chat Completions with `OPENAI_API_KEY` when called.
- The current model string in source is `gpt-4o-mini`.
- If generation fails, the helper returns a deterministic local fallback message.
- Variant selection is local and database-backed through `SellerLead` statistics.
- `selectVariant()` provides a simple random A/B split.
- `selectVariantBandit()` and `selectVariantContextual()` fall back to random variants on query errors.

Current scan result:

- No active route, worker, page, or scheduler currently imports `generateSellerMessage()` outside `lib/ai`.
- The AI helpers should therefore be treated as dormant capability until a specific seller-outreach workflow wires them in.

Useful scan commands from **Terminal 5: Scripts / curl testing**:

```bash
rg -n "generateSellerMessage|selectVariantBandit|selectVariantContextual|selectVariant\\(" . --glob '!dist/**' --glob '!node_modules/**' --glob '!*.tsbuildinfo'
rg -n "OPENAI_API_KEY|api.openai.com|chat/completions|responses" . --glob '!dist/**' --glob '!node_modules/**' --glob '!*.tsbuildinfo'
```

## Environment

Required only when an OpenAI-backed workflow is intentionally enabled:

```bash
OPENAI_API_KEY
```

Rules:

- Do not require `OPENAI_API_KEY` for normal app startup.
- Do not block public search, MLS status, alert dry-runs, digest dry-runs, CRM scheduler reports, Supabase checks, or queue diagnostics when `OPENAI_API_KEY` is unset.
- Do not log the API key or generated request payloads that contain private client details.
- Keep generated outreach copy bounded, human-reviewable, and fallback-safe.

## Launch And Safety Gates

Current launch posture:

- June 21 verification is current through the 08:16 MDT local runtime smoke after the 07:31 MDT Supabase refresh, 08:12 MDT fast verification, and 08:14 MDT production build.
- MLS status remains `busy` / `watch`, inventory freshness is degraded at 100% stale by `lastIntelligenceSync`, search `typesense` is healthy with `meta.smoke.ready=true`, `mls-sync`, `mls-page`, and `listings` are drained, and `reie-alerts` has 273 waiting jobs.
- Saved-search alert readiness is `watch` with 197 pending / 0 failed / 0 processing, property-inquiry notification readiness is `blocked`, and aggregate launch readiness is `blocked`.
- OpenAI-backed live outreach, recurring jobs, CRM automation, alert or digest content generation, and public content generation remain blocked until `PROPERTY_INQUIRY_NOTIFY_TO` or fallback `REIE_INTERNAL_EMAIL` is configured, `PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN` is unset or false for live notification workflows, saved-search sender/reply-to posture is approved, and the standard search, queue, Supabase, CRM, and smoke gates pass.

Do not enable OpenAI-generated outreach in recurring jobs, live sends, CRM automation, or public-facing content until all applicable gates pass from **Terminal 5: Scripts / curl testing**:

```bash
npm run worker:build
npm run typecheck
npm run lint
npm run supabase:check:json
npm run smoke:mls-status
npm run smoke:search
npm run smoke:ops
npm run check:property-inquiry-notification:readiness
npm run check:launch-readiness
npm run run:queue-dashboard -- --limit=5 --timeout-ms=3000
npm run run:crm:scheduler
```

When Terminal 1 is running, confirm protected operating posture directly if needed:

```bash
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/control-state" -H "x-admin-key: $REIE_ADMIN_API_KEY"
curl --max-time 8 -s -w "\nHTTP_STATUS:%{http_code}\n" "http://localhost:3000/api/admin/intake-signals?limit=6" -H "x-admin-key: $REIE_ADMIN_API_KEY"
```

OpenAI-backed outreach remains blocked when any of these are true:

- `npm run supabase:check:json` reports blocked.
- `npm run check:launch-readiness` reports blocked.
- Property-inquiry notification routing is missing `PROPERTY_INQUIRY_NOTIFY_TO` and fallback `REIE_INTERNAL_EMAIL`, or `PROPERTY_INQUIRY_NOTIFICATION_DRY_RUN=true` is still set for a workflow that depends on live notification delivery.
- Search Smoke Readiness is degraded.
- Search-index health is degraded.
- Timeout-bounded queue diagnostics are unacceptable.
- Master Control Panel policy is paused or protected beyond the intended launch posture.
- Intake signal handoff is hidden, unreviewed, or not visible to the operator.
- CRM closure audit coverage is blocked or missing review notes.
- The generated message will be sent without human review.

## Content Rules

Generated seller outreach must remain:

- Short.
- No hype.
- No emojis.
- Natural in tone.
- Grounded in known property or market context.
- Reviewed before any live send.

Generated content must not:

- Invent property facts.
- Claim live inventory status unless MLS-backed inventory gates have passed.
- Use private client data in public content.
- Make legal, financial, inspection, lending, or valuation guarantees.
- Override unsubscribe, consent, or CRM review requirements.

## Verification

For this document and the current dormant AI helper boundary, use the standard local verification from **Terminal 5: Scripts / curl testing**:

```bash
npm run worker:build
npm run typecheck
npm run lint
npm run smoke:ops
```

If a future change wires OpenAI generation into a route, worker, scheduler, CRM action, alert, digest, or public content surface, add a focused dry-run or smoke check for that workflow before enabling live use.

<!-- /Users/davidquinn/david-quinn-group/colorado-real-estate/docs/openai-ops.md -->
