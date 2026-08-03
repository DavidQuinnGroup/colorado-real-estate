# REIE DXT Cross-Route Continuity Implementation Readiness

Status: `DXT_CROSS_ROUTE_CONTINUITY_IMPLEMENTATION_READINESS_READY`

Readiness date: 2026-08-03

## Scope

This record defines implementation sequencing and deterministic certification criteria for cross-route decision continuity.

No implementation is authorized by this record.

## Candidate Phase Assessment

| Candidate phase | Customer value | Current inconsistency severity | Runtime file count | Shared-file risk | Protected-system risk | Testability | Reversibility | Production-certification complexity | URL-context dependency | Recommendation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Property -> Advisory -> Contact continuity | High | Medium | likely 1-3 | Medium | High due property inquiry/form boundaries | Medium | Medium | High | possible | Secondary planning only |
| Search -> Property -> Search return continuity | High | Medium | likely 1 route plus existing helper | Low | Low when confined to visible URL return | High | High | Medium | already present and allowlisted | Primary first implementation |
| Market -> City Market -> Neighborhood -> Property continuity | High | Low-to-medium | several route families | Medium | Medium due broad surface | Medium | Medium | High | optional | Later bounded phase |
| Buyer/Seller -> Advisory -> Contact continuity | Medium | Low-to-medium | 2-4 route files | Medium | Medium due Contact/Advisory boundaries | Medium | Medium | Medium | optional | Later bounded phase |
| Homepage -> Search/Buyer/Seller entry continuity | Medium | Low | homepage only | Low | Low | High | High | Low | none | Not first; already coherent |
| Cross-route CTA language normalization only | Medium | Medium | many route files | High | Low-to-medium | Medium | Medium | High | none | Not first; too broad |

## Recommended Primary Phase

`SEARCH_PROPERTY_RETURN_CONTINUITY`

Recommended gate:

`READY_FOR_REIE_DXT_SEARCH_PROPERTY_RETURN_CONTINUITY_BOUNDED_IMPLEMENTATION_AUTHORIZATION`

Rationale:

- The repo already includes `lib/search/searchReturnContext.ts` with allowlisted criteria, safe property IDs, same-origin `/search` return paths, and malformed-context rejection.
- Property pages already render visible Search return context when safe URL parameters are present.
- The remaining gap is bounded: align property-level Back to Search and continuation links with the existing safe return context where available while preserving direct-entry fallback.
- The phase avoids Contact forms, PropertyInquiryForm changes, LeadCapture changes, CRM, email, scheduling, APIs, persistence, telemetry, navigation, footer, and brokerage disclosure.
- It is easy to certify with static checks, route/canonical inspection, browser Back/Forward review, malformed context review, direct-entry review, and responsive review.

## Recommended Secondary Phase

`PROPERTY_ADVISORY_CONTACT_CONTINUITY_PLANNING`

Recommended gate:

`READY_FOR_REIE_DXT_PROPERTY_ADVISORY_CONTACT_CONTINUITY_PLANNING_AUTHORIZATION`

Rationale:

- Property-specific questions are high-intent and naturally lead toward professional conversation.
- The path touches protected specialized inquiry behavior, so it should remain planning-only until Search/Property return continuity is certified.
- Future planning must keep PropertyInquiryForm, APIs, CRM, email, scheduling, consent, privacy, and brokerage disclosure unchanged unless separately authorized.

## Proposed Runtime File Ownership For Primary Phase

Expected runtime:

- `app/properties/[id]/page.tsx`

Inspection-only:

- `lib/search/searchReturnContext.ts`
- `components/search/SearchInterface.tsx`
- `components/PropertyInquiryForm.tsx`
- `components/LeadCapture.tsx`
- `app/api/property-inquiry/route.ts`
- `app/api/save-search/route.ts`
- navigation, footer, shared CSS, shared CTA components, telemetry, CRM, email, scheduling, Prisma, brokerage-disclosure files

Stop and report if implementation requires:

- Search API changes;
- Search ranking changes;
- property route canonical changes;
- shared runtime abstraction;
- shared CTA component;
- URL context outside the existing Search return contract;
- localStorage, cookies, persistence, telemetry, analytics, CRM, email, scheduling, or form changes.

## Implementation Sequence

1. Verify baseline, deployment, and current Search return contract.
2. Inspect `app/properties/[id]/page.tsx` for every Back to Search, Return to Search Results, and Search continuation.
3. Preserve direct property entry with no context.
4. Use the existing safe `searchReturnContext.returnTo` only when already parsed from URL.
5. Align route-local Search continuations so the customer can understand whether they are returning to prior criteria or starting a city fallback.
6. Do not change property inquiry submission, fields, APIs, CRM, email, scheduling, persistence, telemetry, or brokerage disclosure.
7. Add or update deterministic validation.
8. Run focused Search/Property continuity checks.
9. Run full public route regression.
10. Create local implementation commit only after validation passes.

## Certification Sequence

Local certification should verify:

- exact runtime scope;
- one page-level property H1 remains valid;
- property canonical remains unchanged;
- Search return context is visible when supported;
- malformed context is ignored;
- direct-entry property pages remain understandable;
- browser Back behavior remains preserved;
- no hidden state, cookies, localStorage, persistence, telemetry, analytics, CRM, email, scheduling, or API changes;
- property inquiry behavior remains structurally unchanged;
- Search, Buyer, Seller, Market, Neighborhood, Advisory, Contact, Grand Plan, Home Worth, Compare, and brokerage-disclosure routes regress cleanly.

Production certification should verify:

- a property opened from Search can return to the Search URL with supported criteria;
- the same property opened directly does not imply stored Search history;
- no document-level horizontal overflow at mobile, tablet, and desktop sizes;
- focus indicators are visible on return links;
- protected professional, fair-housing, privacy, valuation, lending, legal, tax, investment, and suitability boundaries remain intact.

## Deterministic Certification Criteria

Planning and implementation checks must cover:

- CTA inventory completeness;
- destination ownership model;
- direct-entry preservation;
- canonical preservation;
- no hidden state;
- no protected data transfer;
- no persistence;
- no telemetry expansion;
- browser navigation preservation;
- fair-housing boundaries;
- professional-boundary preservation;
- brokerage-disclosure hold;
- route-specific file ownership;
- shared-file stop conditions;
- regression routes;
- responsive and accessibility review;
- production-certification evidence.

## Accepted Limitations

- This planning phase does not change any CTA or route behavior.
- It does not implement URL context beyond existing Search return support.
- It does not normalize every label across the site.
- It does not create a shared CTA registry, journey store, or decision-context component.
- It does not modify Contact, forms, APIs, CRM, email, scheduling, telemetry, analytics, navigation, footer, maps, providers, or brokerage disclosure.

## Readiness Conclusion

The smallest high-value first runtime phase is Search -> Property -> Search return continuity hardening.

Certification recommendation:

`READY_FOR_CROSS_ROUTE_CONTINUITY_PLANNING_CERTIFICATION`
