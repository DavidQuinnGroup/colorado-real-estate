# REIE Protected Comparable Input Agent Preview MVV Certification

Program: `REIE_PROTECTED_COMPARABLE_INPUT_AGENT_PREVIEW_MVV`
Status: `IMPLEMENTED_AND_LOCALLY_CERTIFIED`

## Scope

This MVV adds one protected, server-rendered, read-only agent surface:

```text
/admin/comparable-input-preparation
```

The page is an internal preview for the existing certified Evidence-Bound Comparable Input Packet. It does not change the packet contract, customer-facing comparison route, public Property route, admin navigation, authentication implementation, persistence, or data architecture.

## Route protection and indexing

The page is nested under `/admin`, so it uses the repository’s existing admin middleware matcher and login redirect. It adds no authentication logic. Metadata sets `index: false`, `follow: false`, and `nocache: true` for this internal agent tool.

## Explicit selection

The server-rendered GET form accepts:

- `subjectId` — required;
- `candidateId` — required;
- `candidateId2` — optional.

An authenticated human supplies exact IDs. The page uses the existing `toPublicPropertyIdFilterValue` convention, permits exactly one subject plus one or two candidates, requires all identities to be distinct, and preserves candidate order as supplied. It does not search, suggest, replace, save, or otherwise discover a property.

Missing, invalid, duplicate, unavailable, or read-unavailable selections render a conspicuous `FAIL CLOSED` state. No alternate property is substituted and no partial packet is assembled.

## Read-side data boundary

The page uses only the existing bounded `getPublicPropertiesByIds()` read with the exact explicit IDs. It maps already returned facts into `buildComparableInputPacket()`:

- address;
- city/state and neighborhood;
- listed price and status;
- property type, beds, baths, square feet, lot size, and year built;
- existing `updatedAt` and `lastIntelligenceSync` values.

The page does not require, read, or infer `sourceModifiedAt`. The existing packet remains responsible for source posture, visible timestamp state, `NO_VISIBLE_TIMESTAMP`, evidence asymmetry, unavailable evidence, and verification requirements. A visible timestamp is displayed as a timestamp state, never as a freshness conclusion.

## Human review surface

The preview separately renders:

- explicit subject facts;
- explicit candidate facts;
- factual and calculated differences;
- evidence asymmetry, unavailable evidence, and verification requirements;
- source/timestamp posture;
- neutral verification questions; and
- the certified human-review checklist.

The page visibly states that REIE prepares evidence while the agent retains candidate selection, CMA, pricing, professional appraisal, negotiation, offer, fiduciary, and customer-communication judgment.

## Protected-system and professional boundaries

The page has no API route, POST form, database write, saved packet, customer profile, CRM record, task, Saved Search, email, queue, analytics, telemetry, provider call, county-data retrieval, external source activation, ranking, scoring, value conclusion, suggested price, suggested offer, investment conclusion, suitability/desirability conclusion, protected-class inference, or steering behavior.

Only existing read-side property access is used. No Prisma, MLS, schema, migration, Property persistence, sourceModifiedAt, Typesense, Search runtime, alert, Saved Search, CRM, package/configuration, public-route, existing-admin-navigation, source-registry, or seller-module file was modified.

## Deterministic validation

Run directly without package configuration changes:

```bash
npx tsx scripts/checkComparableInputPreparation.ts
```

The extended check retains the pure-MVV fixtures and validates the preview source for:

- approved packet and bounded property-read imports only;
- GET-only selection form;
- noindex/nofollow metadata;
- explicit subject, first candidate, and optional second candidate inputs;
- one- and two-candidate code paths;
- missing, duplicate, and unavailable-selection fail-closed paths;
- visible agent boundary;
- no persistence declaration;
- no `sourceModifiedAt` dependency;
- no protected-system imports or references; and
- prohibited conclusion language absence.

Local route validation should verify that an unauthenticated GET request redirects through the existing admin login flow before any property read occurs.

## Collision safety

The integration changes only:

- `app/admin/comparable-input-preparation/page.tsx`
- `scripts/checkComparableInputPreparation.ts`
- this certification record.

The previously cherry-picked three MVV files are historical branch content and are not modified by this integration commit. The protected untracked county document is not staged or committed.

## Next gate

`READY_FOR_PROTECTED_COMPARABLE_INPUT_AGENT_PREVIEW_LOCAL_SYNCHRONIZATION_OR_DEPLOYMENT_REVIEW`

Any public route, API, saved selection, customer workflow, provider access, or production deployment requires separate authorization.
