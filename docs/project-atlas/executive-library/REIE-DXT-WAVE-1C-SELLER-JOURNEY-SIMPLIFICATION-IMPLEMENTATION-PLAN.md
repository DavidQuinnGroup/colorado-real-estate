# REIE DXT Wave 1C Seller Journey Simplification Implementation Plan

Program: REIE Decision Experience Transformation (DXT 1.0)

Phase: Wave 1C - Seller Journey Simplification Implementation-Ready Plan

Status: `DXT_WAVE_1C_SELLER_JOURNEY_SIMPLIFICATION_IMPLEMENTATION_PLAN_READY`

Date: August 2, 2026

## 1. Planning Decision

The Seller Journey Simplification implementation plan is ready for future authorization.

Governing seller question:

`What must be understood before market exposure?`

This plan is inspection and planning only. Seller runtime remains unauthorized. No Seller customer-facing copy, styling, components, routes, shared components, runtime abstractions, or data-driven journey schema were modified.

## 2. Current Seller Runtime Inventory

Inspected runtime:

- `app/sell/page.tsx`
- `components/HomeValueEstimator.tsx`
- `components/JourneyCohesionPanel.tsx`
- `lib/customerJourneyMeasurement.ts`

Current Seller page sections:

- page orientation and hero: `Colorado Seller Strategy`;
- governing promise: sell with preparation, pricing, and market context;
- primary actions: `Request Seller Review`, `Market Context`, `Contact Routing`;
- preparation cards: preparation priorities, pricing and positioning, construction-informed review, market strategy;
- journey cohesion panel: Home Worth, Market Context, Advisory Guidance;
- seller readiness entry: `/home-worth#seller-readiness`;
- next-step section with property and decision framing;
- seller intake form through `HomeValueEstimator`;
- existing backend route marker: `/api/valuation` inside the form component;
- existing measurement-ready markers with measurement inactive;
- no automated valuation marker on the form.

## 3. Current-State Findings

Strengths:

- the Seller route already preserves preparation, market context, seller readiness, and advisory continuity;
- the intake form explicitly states it is not an automated home-value estimate;
- valuation, email, and measurement behavior remain marked and bounded by existing checks;
- existing routes already support Home Worth, Market Context, and Contact continuations.

Problems to address in a future bounded implementation:

- the first viewport does not yet ask the governing seller question directly;
- three primary actions in the hero can feel equal-weight;
- preparation cards and intake content compete before the seller understands the sequence;
- market context and pricing-context boundaries should be clearer before the form appears;
- the advisory transition should feel like prepared professional review rather than generic contact routing;
- mobile may present too many similarly weighted blocks before the seller reaches the key next step.

## 4. Section Disposition Map

| Current section or pattern | Disposition | Reason |
| --- | --- | --- |
| Page orientation | SIMPLIFY | The page should lead with the seller decision question, not a broad strategy label. |
| Hero headline | SIMPLIFY | Should directly answer what must be understood before exposure. |
| Hero body copy | SIMPLIFY | Current copy is useful but should be shorter and less explanatory above the fold. |
| Request Seller Review CTA | KEEP | It is the primary conversion path, but should be the single dominant first action. |
| Market Context CTA | MOVE LOWER | Useful after preparation framing, not equal to seller review in the first viewport. |
| Contact Routing CTA | MOVE LOWER | Advisory should appear after preparation and boundary context. |
| Preparation service cards | KEEP_AND_RESEQUENCE | Valuable, but should become staged preparation themes. |
| Pricing and positioning language | KEEP_WITH_BOUNDARY | Must avoid price recommendation, instant appraisal, or guaranteed sale implications. |
| Construction-informed review | KEEP_WITH_BOUNDARY | Useful if framed as questions and preparation, not condition conclusions. |
| Market strategy | KEEP_WITH_BOUNDARY | Useful if framed as market-exposure preparation, not predictive outcome. |
| Journey cohesion panel | SIMPLIFY | Should serve compact next-decision continuations after preparation. |
| Seller readiness entry | KEEP_AND_ELEVATE | It supports evidence gaps and property preparation before intake. |
| Next-step explanatory section | MERGE | Should merge with advisory transition and intake framing. |
| HomeValueEstimator form | KEEP_WITH_BOUNDARY | Preserve existing form and `/api/valuation` behavior; do not alter in planning. |
| Automated valuation implication | EXTERNAL_REVIEW_HOLD / PROHIBIT | Existing no-automated-valuation posture must remain. |
| Brokerage disclosure | EXTERNAL_REVIEW_HOLD | `EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING`. |

## 5. Proposed Implementation Sequence

Recommended future sequence:

1. Reframe first viewport around `What must be understood before market exposure?`
2. Make `Request Seller Review` the single dominant first action.
3. Move Market Context and Contact/Advisory continuations lower.
4. Convert preparation cards into staged seller preparation themes.
5. Add a concise evidence-gaps and buyer-objection section before intake.
6. Place valuation, pricing, condition, legal, title, disclosure, tax, HOA, and insurance boundaries adjacent to seller readiness and intake.
7. Preserve `HomeValueEstimator` behavior and `/api/valuation` route without modification unless separately authorized.
8. Preserve `JourneyCohesionPanel` as compact continuations after preparation context.
9. Add a Seller-specific deterministic DXT check.
10. Certify mobile, tablet, desktop, heading order, keyboard focus, and protected-boundary behavior.

## 6. Proposed File Ownership

Likely runtime ownership for a future implementation:

- `app/sell/page.tsx`

Inspection-only or conditional ownership:

- `components/HomeValueEstimator.tsx` only if future certification proves the form framing itself must change;
- `components/JourneyCohesionPanel.tsx` should remain unchanged unless a narrow prop-level need appears;
- `lib/customerJourneyMeasurement.ts` should remain unchanged.

Documentation and validation ownership:

- Seller implementation record;
- Seller-specific deterministic check;
- `package.json` and `tsconfig.worker.json` only if a check is added;
- `docs/CHAT_START.md` after implementation.

## 7. Shared-File Risks

Shared files that should be avoided unless necessary:

- shared CSS;
- shared components;
- navigation;
- footer;
- route registries;
- `HomeValueEstimator` if the needed change can be expressed at the page level;
- measurement helpers;
- API routes.

If a future Seller implementation requires a shared global file, stop and report the proposed change before editing.

## 8. Seller Boundaries To Preserve

Preserve:

- property preparation;
- evidence gaps;
- pricing-context boundaries;
- market-exposure preparation;
- buyer-objection preparation;
- transaction preparation;
- advisory transition;
- verification and professional judgment boundaries.

Do not introduce:

- valuation certainty;
- instant appraisal claims;
- guaranteed pricing;
- guaranteed sale outcomes;
- investment conclusions;
- suitability conclusions;
- predictive pricing claims;
- automated pricing recommendations;
- new provider integrations;
- persistence;
- telemetry;
- CRM expansion.

## 9. Deterministic Certification Criteria

Future Seller check should verify:

- governing seller question appears in the first viewport;
- one dominant first action exists;
- market/advisory continuations are lower than first preparation framing;
- seller preparation themes map to the Wave 1C shared hierarchy;
- evidence gaps and buyer-objection preparation are present;
- `HomeValueEstimator` remains bounded and does not become an automated valuation;
- `/api/valuation` behavior is unchanged unless separately authorized;
- brokerage disclosure remains untouched;
- no route, navigation, footer, Search, map, property, Prisma, persistence, telemetry, CRM, provider, AI, email, queue, worker, deployment configuration, or production-data changes are introduced.

## 10. Final Planning Status

Seller Journey Simplification is implementation-ready:

`DXT_WAVE_1C_SELLER_JOURNEY_SIMPLIFICATION_IMPLEMENTATION_PLAN_READY`

Recommended future gate:

`READY_FOR_REIE_DXT_WAVE_1C_SELLER_JOURNEY_SIMPLIFICATION_BOUNDED_IMPLEMENTATION_AUTHORIZATION`
