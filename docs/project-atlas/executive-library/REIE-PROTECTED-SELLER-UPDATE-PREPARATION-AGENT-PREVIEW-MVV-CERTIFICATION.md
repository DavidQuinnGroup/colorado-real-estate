# REIE Protected Seller Update Preparation Agent Preview MVV — Certification

## Status

The protected Seller Update Preparation preview is a server-rendered, GET-only, read-only internal agent surface at `/admin/seller-update-preparation`.

## Protection and Discovery Posture

The existing `/admin/:path*` middleware protects the route and routes unauthenticated access to the established admin login flow. Metadata sets `noindex`, `nofollow`, `nocache`, and the existing Googlebot noindex/noimageindex posture. No public navigation or API endpoint is added.

## Explicit Selection and Bounded Read

The page accepts one required `subjectId` plus optional `competitorId` and `competitor2Id`. Each supplied value uses existing Property ID validation. All requested IDs must be distinct and resolve; otherwise the page fails closed. It calls the existing bounded `getPublicPropertiesByIds()` once with no more than three submitted IDs. It performs no broad search, discovery, substitution, or property write.

## Packet Mapping

The preview maps only existing public Property facts: address, city/state, neighborhood, status, listed price, type, beds, baths, square footage, lot size, year built, and existing visible timestamps. `updatedAt` and `lastIntelligenceSync` are explicitly labeled as visible row/sync markers, not authoritative MLS freshness. It does not depend on `sourceModifiedAt` or public-search eligibility.

## Version-One Limits

No prior baseline input is exposed. The packet always visibly returns `NO_PRIOR_UPDATE_BASELINE` and makes no change-since-prior-update claim. No Market runtime is queried and no arbitrary market text is accepted; the packet visibly returns `MISSING_MARKET_CONTEXT`.

Competitive entries remain `AGENT_SUPPLIED_ONLY`. The page renders factual/calculated differences, evidence asymmetry, unavailable evidence, source/timestamp posture, neutral talking-point inputs, verification questions, the human-review checklist, and the professional boundary.

## Customer, CRM, and Professional Boundaries

The preview has no customer/seller identity, CRM/CRMTask, saved packet, prior-update storage, POST/action, database write, email/SMS, notification, scheduler, worker, analytics, or telemetry behavior.

It generates no seller message, price or price-reduction guidance, concessions, staging/marketing/negotiation advice, valuation, CMA/appraisal conclusion, ranking, scoring, best-comp claim, urgency, prediction, desirability/suitability, protected-class implication, safety/school ranking, or steering.

## Validation

Run:

```sh
npx tsx scripts/checkSellerUpdatePreparation.ts
```

The check preserves pure packet fixtures and statically validates the protected route path, middleware inheritance, noindex/nofollow/nocache metadata, GET-only form, exact bounded selection, maximum three IDs, duplicate/unavailable fail-closed posture, no baseline/market runtime, source timestamp qualification, no Primary-owned dependencies, no write/CRM/customer behavior, and professional-boundary text.

## Collision Safety

This preview adds only its page, checker extension, and certification document. The Seller Update Packet remains unchanged. No Prisma, Property persistence, MLS, Search/Typesense, Saved Search/alerts, CRM, Market runtime, admin navigation, public route, package/configuration, or `docs/CHAT_START.md` file is modified.

## Next Gate

Any canonical push/merge, production deployment, baseline entry, Market context, customer workflow, CRM behavior, persistence, email, scheduling, or automated delivery requires separate authorization.
