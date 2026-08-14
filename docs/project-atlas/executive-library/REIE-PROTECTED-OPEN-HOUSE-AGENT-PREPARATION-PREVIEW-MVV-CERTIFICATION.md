# REIE Protected Open-House Agent Preparation Preview MVV Certification

Program: `REIE_PROTECTED_OPEN_HOUSE_AGENT_PREPARATION_PREVIEW_MVV`

Status: `PROTECTED_OPEN_HOUSE_AGENT_PREPARATION_PREVIEW_MVV_IMPLEMENTED_AND_LOCALLY_CERTIFIED`

## Purpose

The protected preview exposes the certified Open-House Agent Preparation Packet to an authenticated REIE agent for one explicitly submitted property ID. It is an internal, server-rendered, read-only factual preparation surface; it does not operate an open house.

## Route And Authentication

Route: `/admin/open-house-preparation`

The page is covered by the existing `/admin/:path*` middleware matcher and existing admin login redirect. It introduces no authentication implementation. Metadata sets noindex, nofollow, nocache, and Googlebot noindex/nofollow/noimageindex.

## Explicit-Selection And Read-Side Contract

The GET form requires `propertyId` and accepts only optional non-personal `eventLabel` and `eventDateLabel`. The label is restricted to a fixed generic preparation-label set and the date/time value is restricted to a date-time format; neither field accepts free-text identity. The page does not offer a picker, search, discovery, recommendation, substitute property, or saved selection.

The page validates the submitted ID using `toPublicPropertyIdFilterValue()` and calls `getPublicPropertiesByIds([selection.propertyId])` for exactly one selected ID. It maps only returned address/place, price, status, property type, beds, baths, square footage, lot size, year built, `lastIntelligenceSync`, and `updatedAt` fields into the packet. It does not require or read `sourceModifiedAt`.

Missing, invalid, non-generic event-label, unavailable-property, and read-unavailable states fail closed. No label is stored or transmitted beyond the GET request used for the agent's current read-only review.

## Evidence / Context Behavior

The page presents the existing bounded read as a verification-bound source posture. It uses an existing visible `lastIntelligenceSync` or `updatedAt` timestamp when present; otherwise the packet presents `NO_VISIBLE_TIMESTAMP`.

The initial preview deliberately supplies no market or place context. The packet visibly renders `MISSING_CONTEXT`; it does not query Market, MLS, Search, Typesense, or neighborhood systems to fill that gap.

## Human-Visible Preparation

The page renders property facts, source/evidence posture, unavailable/missing facts/context, factual talking-point inputs, verification prompts, visitor-question preparation, event checklist, fair-housing reminders, and professional-boundary checklist.

It visibly states: `REIE PREPARES FACTUAL EVIDENCE AND QUESTIONS. THE AGENT OPERATES THE OPEN HOUSE AND RETAINS ALL PROFESSIONAL JUDGMENT.`

## Fair-Housing And Professional Boundaries

The preview preserves the packet's prohibition on demographic/protected-class statements, safety or school rankings, neighborhood desirability or suitability claims, steering, valuation, pricing/offer advice, investment conclusions, and event-success predictions.

The agent remains responsible for event planning and presentation, visitor interaction, factual verification, fair-housing compliance, follow-up, relationships, negotiation, CMA/pricing, appraisal reliance, offers, fiduciary duties, and customer communication.

## Zero-Operation / Zero-Persistence Certification

The preview has no OpenHouse model access, calendar, scheduling, registration, sign-in, visitor/customer record, CRM, email/SMS, follow-up automation, customer profile, saved packet, POST/action/API mutation, telemetry, provider call, or background job.

The sole access is the existing bounded application property read for the exact submitted ID. The route itself does not perform network/provider calls or writes.

## Validation

Run directly:

```sh
npx tsx scripts/checkOpenHouseAgentPreparation.ts
```

The deterministic fixture check retains the pure MVV coverage and statically certifies the route's approved imports, exact one-ID bounded read, GET-only form, noindex metadata, explicit inputs, fail-closed states, non-personal label posture, MISSING_CONTEXT boundary, visible agent boundary, no persistence/customer/calendar attributes, no Primary sourceModifiedAt dependency, and prohibited-system exclusions.

## Future Gate

This certification does not authorize public exposure, scheduling, OpenHouse persistence, visitor registration, CRM, customer contact, provider activation, push, merge, or deployment. A later synchronization/deployment-readiness review must recheck current canonical admin authentication, bounded-read availability, unauthenticated redirect, production noindex behavior, and zero-write posture.
