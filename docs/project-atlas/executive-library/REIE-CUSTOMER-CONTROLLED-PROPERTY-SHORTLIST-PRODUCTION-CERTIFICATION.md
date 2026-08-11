# REIE Customer-Controlled Property Shortlist Production Certification

Status: `CUSTOMER_CONTROLLED_PROPERTY_SHORTLIST_PRODUCTION_CERTIFIED_AND_CLOSED`

Date: 2026-08-11

## Scope

This record certifies the production promotion, direct-entry hydration remediation, full production recertification, and local documentation closure for the Customer-Controlled Property Shortlist and Side-by-Side Decision Workspace.

Original implementation commit:

- `ad0e0ea37a69271d193187280f06c06c16746b91`
- `Add customer controlled property comparison workspace`

Hydration remediation commit:

- `69cd49e1fffd531196b6e3a5e9624fdcf26e5402`
- `Fix shortlist direct entry hydration`

## Hydration Root Cause

The direct-entry `/search?compareIds=...` production blocker was a server/client initial-render divergence. `compareIds` was initialized by reading browser URL state in the `useState` initializer. The server rendered an empty shortlist, while the first client render on direct URL entry rendered the selected URL IDs, causing React hydration error `#418`.

The remediation preserves first-render determinism by initializing `compareIds` as `[]` and restoring URL-derived comparison state inside the existing post-hydration initialization timer. No `suppressHydrationWarning`, client-only Search rendering, storage, persistence, reload behavior, or URL-state dropping was used.

## Deployment Evidence

- GitHub/Vercel commit status id: `52057367334`
- Deployment state: `success`
- Deployment description: `Deployment has completed`
- Deployment timestamp: `2026-08-11T21:01:32Z`
- Deployed SHA: `69cd49e1fffd531196b6e3a5e9624fdcf26e5402`
- Vercel target: `https://vercel.com/david-quinns-projects-a0953600/david-quinn-group-8rde/FHK8K9G5j7AM5RQTvJH7z4Sh8X3v`
- Production domain verified: `https://davidquinngroup.com`

## Route Architecture

- Search route: `/search`
- Property comparison route: `/properties/compare?ids=<id,id[,id]>`
- City comparison remains separate: `/compare?cities=...`
- Search `compareIds` state remains URL-visible browser navigation state only.
- Search API parameter contract remains unaffected: `data-search-compare-ids-api-param="false"`.
- Comparison workspace remains noindex/follow with generic metadata.

## Production IDs Used

Production Search supplied the public property IDs used for recertification:

- `cmqln53qg09rvpi4jzrvdb33v` - `102 S Cherry St`, Denver
- `cmqln4jmh08s1pi4jrttirnmo` - `9773 Phillips Rd`, Lafayette
- `cmqlnd3x1002sqqqp8reoku2v` - `3310 W County Road 80`, Wellington

## Certified Production Matrix

Search:

- Empty shortlist rendered at desktop `1440` and mobile `390`.
- Direct two-ID entry rendered at desktop `1440` and mobile `390` with selected count `2`.
- Direct three-ID entry rendered with selected count `3`.
- Filter preservation verified with `city=Boulder` and `compareIds`.
- Production Search retained `compareIds` in browser URL state and did not send it to the Search API.
- Keyboard selection opened the selected-property drawer without automatic shortlist addition.
- Explicit Add moved count from `2` to `3`; explicit Remove returned count to `2`.
- No horizontal overflow, page exceptions, or console errors were captured.

Property comparison:

- `0` IDs: empty notice, no table.
- `1` ID: single-selection notice, no side-by-side table.
- `2` valid IDs: comparison enabled, selected count `2`, row count `12`.
- `3` valid IDs: comparison enabled, selected count `3`, row count `12`.
- Duplicate input: duplicate notice, canonical unique selection.
- Malformed input: malformed notice, malformed ID omitted.
- Unavailable input: unavailable notice, fail-closed behavior.
- Mixed valid/invalid: valid properties rendered, unavailable notice shown.
- Over-limit input: selection-limit notice, no silent truncation.
- Oversized input: oversized-query notice, fail-closed behavior.
- Mobile two-ID comparison rendered at width `390`.
- Property link to `/properties/cmqln4jmh08s1pi4jrttirnmo` rendered, and Back returned to comparison.
- No horizontal overflow, page exceptions, or console errors were captured.

## Comparison Boundaries

The workspace remained equal-sided and factual. Certified dimensions are bounded to existing public listing facts and labelled arithmetic, including:

- address;
- city/state;
- listed price;
- beds;
- baths;
- square footage;
- lot size;
- year built;
- property type;
- listing status;
- derived price per square foot;
- freshness / verification state.

The production workspace did not present a best property, winner, recommended property, ranking, score, suitability inference, valuation, investment ranking, school/safety/demographic comparison, offer recommendation, financing advice, or protected-class proxy.

## Source Transparency

Valid comparison states rendered four Source Transparency items:

- Source
- Period / Freshness
- Limitation
- Verify

The required trust boundaries remained visible:

- MORE AVAILABLE DATA does not mean a better property.
- SOURCE AVAILABILITY does not equal PROPERTY QUALITY.
- MISSING DATA does not equal NEGATIVE PROPERTY CONDITION.

No provider contacts, credentials, internal source IDs, raw lineage, rights/legal notes, activation state, or customer identity details were exposed.

## Validation

Local validation passed:

- `git diff --check`
- `npm run typecheck`
- `npm run check:customer-controlled-property-shortlist`
- `npm run check:search-runtime-safety`
- `npm run check:search-listing-quality`
- `npm run check:map-rendering-safety`
- `npm run check:dxt-search-return-context-handoff`
- `npm run check:property-route-safety`
- `npm run check:property-product-3-1`
- `npm run check:reie-comparison-financing-intelligence`
- `npm run check:decision-moment-source-transparency`
- `npm run check:public-runtime-safety`
- `npm run check:public-trust-readiness`
- `npm run check:cross-city-decision-comparison`
- `npm run check:advisory-handoff-value-activation`
- `npm run check:next-security-version`
- `npm run lint`
- `npm run build`
- `npm run smoke:public-experience`

Local production-like browser certification passed against `http://localhost:3000`.

Production browser certification passed against `https://davidquinngroup.com`.

## Regression Certification

Representative production routes rendered with no horizontal overflow, page exceptions, or console errors:

- `/properties/cmqln4jmh08s1pi4jrttirnmo`
- `/compare?cities=boulder,broomfield`
- `/search`
- `/grand-plan`
- `/sources`
- `/contact#advisory-readiness`

## Protected-System Confirmation

No API expansion, database/schema change, write operation, provider/source activation, MLS/Typesense change, county/GIS work, CRM/email action, alerts/workers action, telemetry action, auth change, customer persistence, customer identity expansion, credentials change, or production mutation beyond the authorized remediation deployment occurred.

## Known Limitations

- The comparison workspace compares up to three customer-selected public property IDs.
- It does not determine property quality, suitability, value, investment merit, financing qualification, offer strategy, legal status, tax status, condition, title, permits, insurance, HOA, zoning, school quality, safety, demographics, or neighborhood desirability.
- Direct Search entry initially renders an empty deterministic server/client tree, then restores URL-derived `compareIds` after hydration to avoid mismatch.

## Final Disposition

`CUSTOMER_CONTROLLED_PROPERTY_SHORTLIST_PRODUCTION_CERTIFIED_AND_CLOSED`

Next gate:

`READY_FOR_CUSTOMER_CONTROLLED_PROPERTY_SHORTLIST_CLOSURE_SYNC_AUTHORIZATION`
