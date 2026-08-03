# REIE DXT Next Continuity Phase Plan

Status: `DXT_NEXT_CONTINUITY_PHASE_PLAN_READY`

Planning date: 2026-08-03

## Objective

This record selects the next highest-value continuity phase after Property -> Advisory -> Contact implementation.

No secondary runtime implementation is authorized by this record.

## Candidate Comparison

| Candidate | Customer value | Inconsistency severity | Likely runtime scope | Shared-file risk | Protected-system risk | Implementation complexity | Testability | Recommendation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Buyer/Seller -> Advisory -> Contact Continuity | High | Medium | `/buy`, `/sell`, and route-local continuation copy | Low-to-medium | Medium due financing, valuation, and seller review boundaries | Medium | High | Selected |
| Market -> City Market -> Neighborhood -> Property Continuity | High | Low-to-medium | `/market`, `/market/[city]`, `/market/[city]/[slug]`, and Property links | Medium | Medium due fair-housing and place-orientation boundaries | Higher | Medium | Secondary later phase |

## Buyer/Seller Candidate Findings

Buyer and Seller pages already contain Advisory or Contact-adjacent continuations, but they can be clearer about:

- when preparation should remain self-guided;
- when a Buyer or Seller question should be organized for Advisory;
- when Contact should begin a general conversation;
- how financing, affordability, valuation, pricing, timing, legal, tax, lending, and suitability boundaries remain intact.

The route-local implementation scope is likely bounded to:

- `app/buy/page.tsx`
- `app/sell/page.tsx`

No Contact runtime change should be required. No form, CRM, email, scheduling, persistence, telemetry, navigation, footer, or shared CTA abstraction should be introduced.

## Market/Neighborhood Candidate Findings

Market, City Market, and Neighborhood routes already move customers through briefing, place orientation, Search, and Property exploration.

The remaining continuity opportunity is real but broader:

- Market should hand off to City Market, Neighborhood, Search, and Property without loops.
- City Market should clarify whether a customer should investigate neighborhoods, search inventory, or ask for advisory review.
- Neighborhood should continue to Property exploration and Market context without fair-housing, safety, school-quality, suitability, ranking, or demographic implications.

This phase touches more route families and carries higher regression scope, so it should follow the Buyer/Seller continuity phase.

## Selected Next Phase

Selected phase:

`BUYER_SELLER_ADVISORY_CONTACT_CONTINUITY`

Recommended secondary gate:

`READY_FOR_REIE_DXT_BUYER_SELLER_ADVISORY_CONTACT_CONTINUITY_PLANNING_CERTIFICATION`

Rationale:

- Buyer and Seller are closer to the Advisory and Contact handoff than Market and Neighborhood.
- The work can likely remain route-local.
- The public journey benefits from clearer preparation-to-conversation distinctions after Property continuity is certified.
- The phase can be certified without Contact form changes, hidden context, persistence, telemetry, CRM, email, scheduling, navigation or footer changes.

## File Ownership

Future likely runtime ownership:

- `app/buy/page.tsx`
- `app/sell/page.tsx`

Inspection-only:

- `components/BuyerFinancingDecisionPlanner.tsx`
- `components/BuyerFinancingReadinessGuide.tsx`
- `components/SellerReadinessGuide.tsx`
- `components/HomeValueEstimator.tsx`
- `components/AdvisoryHandoffGuide.tsx`
- `app/contact/page.tsx`
- form components
- APIs
- CRM
- email
- scheduling
- persistence
- telemetry
- navigation
- footer
- brokerage disclosure

## Shared-File Risks

Stop and report if future implementation appears to require:

- shared CTA components;
- shared decision-context stores;
- Contact runtime changes;
- form or field changes;
- new URL context;
- hidden context;
- persistence;
- telemetry;
- CRM;
- email;
- scheduling;
- navigation or footer changes;
- brokerage disclosure changes.

## Protected-System Risks

Future implementation must preserve:

- no Contact form changes;
- no hidden context;
- no persistence;
- no telemetry;
- no CRM;
- no email;
- no scheduling;
- no navigation or footer changes;
- no affordability conclusions;
- no lending approval or qualification;
- no valuation certainty;
- no seller pricing guarantees;
- no legal or tax advice;
- no suitability conclusions;
- no fair-housing steering.

## Implementation Sequence

1. Certify Property -> Advisory -> Contact Continuity.
2. Inventory Buyer and Seller Advisory and Contact continuations.
3. Confirm Buyer/Seller direct-entry behavior.
4. Define route-local priority models for Buyer and Seller.
5. Implement only bounded Buyer/Seller presentation changes if separately authorized.
6. Preserve Contact and Advisory runtime unchanged unless separately authorized.
7. Run deterministic Buyer, Seller, Advisory, Contact, and protected-system checks.
8. Perform local responsive and accessibility review.
9. Create a local implementation commit only after validation passes.
10. Seek separate push and production-certification authorization.

## Deterministic Certification Criteria

Future local certification must verify:

- Buyer and Seller preparation remain distinct from Advisory and Contact;
- Advisory prepares the professional conversation;
- Contact begins the general conversation;
- Buyer financing boundaries remain intact;
- Seller valuation and pricing boundaries remain intact;
- no Contact form, field, API, CRM, email, scheduling, persistence, telemetry, navigation, footer, or brokerage-disclosure changes occur;
- direct `/buy`, `/sell`, `/contact`, and `/contact#advisory-readiness` entry remains understandable;
- no hidden context or automatic customer-data transfer occurs;
- responsive and accessibility behavior remains valid;
- Search, Property, Market, Neighborhood, Advisory, Contact, and brokerage-disclosure regressions pass.

## Production-Certification Criteria

Future production certification must verify:

- `/buy` and `/sell` render with one H1 and coherent preparation hierarchy;
- Buyer/Seller Advisory and Contact links are visible, usable, and correctly prioritized;
- Contact and Advisory remain production-certified and unchanged unless separately authorized;
- no document-level horizontal overflow appears at mobile, tablet, or desktop widths;
- links remain keyboard focusable;
- protected legal, tax, lending, valuation, investment, suitability, fair-housing, brokerage, privacy, and professional boundaries remain visible.

## Accepted Limitations

This plan does not authorize runtime implementation, Contact form changes, fields, APIs, CRM, email, scheduling, persistence, telemetry, hidden context, URL context, navigation, footer, brokerage disclosure, Market runtime, Neighborhood runtime, or shared CTA abstractions.
