# REIE DXT 2 First-Phase Implementation Readiness

Status: `DXT_2_FIRST_PHASE_IMPLEMENTATION_READINESS_READY`

Program: `REIE_DXT_2_DECISION_READINESS_DEPTH`

Selected primary phase: `PROPERTY_DECISION_READINESS_DEPTH`

Selected secondary planning phase: `SEARCH_DECISION_WORKSPACE_DEPTH`

Deferred phase: `MARKET_AND_CITY_MARKET_DECISION_READINESS_DEPTH`

Runtime authorization: `false`

Push, deployment, and production certification authorization: `false`

## Candidate Phase Assessment

| Candidate | Customer value | Current maturity | Remaining gap severity | Route count | Runtime file count | Data/provider dependency | Regulated or fair-housing risk | Shared-file risk | Testability | Recommendation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Property Decision Readiness Depth | Very high | `FUNCTIONAL` | High | 1 route family | 1 preferred route file | Existing listing and Product 3.1 evidence | Manageable if no suitability, valuation, lending, or legal conclusions | Low | High | `SELECT_PRIMARY_FIRST_PHASE` |
| Buyer Decision Readiness Depth | High | `DECISION_READY` | Medium | 1 | 1 | Existing buyer and financing education | High if it drifts into affordability or qualification | Low | High | `SECONDARY_LATER` |
| Seller Decision Readiness Depth | High | `DECISION_READY` | Medium | 1 | 1 | Existing seller and Home Worth context | High if it drifts into valuation certainty | Low | High | `SECONDARY_LATER` |
| Market and City Market Decision Readiness Depth | Medium-high | `DECISION_READY` to `ADVANCED_DECISION_READY` | Medium | 2 route families | 2 | New provenance depth may imply provider expansion | Medium for investment/timing claims | Medium | Medium | `DEFER_FOR_PROVIDER_BOUNDARY_REVIEW` |
| Neighborhood Decision Readiness Depth | Medium | `ADVANCED_DECISION_READY` | Low-medium | 1 route family | 1 | Existing neighborhood data | High fair-housing and suitability risk | Low | Medium | `PROTECTED_BOUNDARY_HOLD` |
| Advisory Conversation Readiness Depth | Medium | `DECISION_READY` | Low | 1 component/hosted route | 1 | None | Medium if it becomes advice or lead capture | Low | High | `NO_ACTION_REQUIRED_NOW` |
| Search Decision Workspace Depth | High | `FUNCTIONAL` | Medium-high | 1 route plus components | Multiple likely | Existing Search data | Medium if it changes ranking/map/list behavior | High | Medium | `SELECT_SECONDARY_PLANNING_PHASE` |
| Cross-route evidence consistency only | Medium | `DECISION_READY` continuity | Low | Many | Many | None | Low-medium | High | Medium | `DEFER` |

## Selected Primary Phase

`PROPERTY_DECISION_READINESS_DEPTH`

## Governing Customer Decision

Is this property sufficiently understood to justify more time, a property-specific question, a tour, comparison, or a prepared professional conversation?

## Current-State Finding

The Property route already presents public listing facts, construction and financial verification questions, market context, Search return continuity, Product 3.1, property inquiry, Advisory preparation, and Contact boundaries. The page is functional and safe, but the customer must currently assemble evidence confidence, missing evidence, assumptions, and next-decision threshold from multiple sections.

## Material Readiness Gap

Property is the most consequential public decision surface. The current route is rich, but it does not yet provide one concise decision-readiness layer that answers:

- what evidence is strong enough to use now;
- what evidence is missing or stale;
- what assumptions are being made;
- which questions need source or professional verification;
- what threshold should be met before touring, inquiring, comparing, or escalating to Advisory.

## Proposed Future Hierarchy

1. Property decision orientation
2. Governing decision-readiness question
3. Current evidence posture
4. Evidence available now
5. Evidence not yet available
6. Assumptions and unknowns
7. Confidence by material input
8. Verification requirements
9. Questions to ask before relying
10. Next decision threshold
11. Property inquiry, Search, Advisory, and Contact continuations
12. Trust, brokerage, legal, financial, valuation, and professional boundaries

Do not force this into a shared runtime schema.

## Evidence Treatment

Use only existing Property evidence:

- public listing facts;
- listing photos and display-safe fallback behavior;
- price, status, property type, beds, baths, square footage, lot size, city, neighborhood, subdivision, school district text when already present;
- public listing remarks;
- construction context already computed by the Property route;
- Product 3.1 model;
- Search return context already certified;
- related links and market path already present.

Do not add providers, APIs, schema fields, data fetches, or private customer evidence.

## Confidence Treatment

Use descriptive confidence labels only:

- source confidence;
- freshness confidence;
- completeness confidence;
- verification status;
- evidence consistency;
- limitation severity.

Do not create scores, rankings, suitability labels, investment ratings, valuation certainty, lender confidence, affordability confidence, or hidden composite calculations.

## Verification Treatment

Property verification should remain practical and bounded:

- listing source review;
- inspection and condition review;
- permits and systems records;
- HOA, title, tax, insurance;
- financing assumptions;
- market comparison;
- contract/professional review.

The page may prepare questions. It must not provide legal, tax, lending, appraisal, valuation, engineering, inspection, or professional advice.

## Proposed Runtime Ownership

Preferred runtime file:

- `app/properties/[id]/page.tsx`

Inspection-only files:

- `components/PropertyInquiryForm.tsx`
- Property inquiry APIs
- Search runtime and Search APIs
- Advisory and Contact runtime
- Buyer and Seller runtime
- Market and Neighborhood runtime
- maps, providers, navigation, footer, brokerage disclosure

## Shared-File Stop Conditions

Stop and request separate authorization if implementation appears to require:

- Search runtime changes;
- PropertyInquiryForm changes;
- API changes;
- schema, Prisma, or migration changes;
- new providers;
- persistence, localStorage, cookies, telemetry, or analytics;
- CRM, email, scheduling, queues, or customer profiles;
- shared decision-readiness schema;
- shared CTA abstraction;
- navigation or footer changes;
- brokerage-disclosure changes.

## Implementation Sequence

1. Verify baseline and latest deployment.
2. Reinspect `app/properties/[id]/page.tsx`.
3. Confirm direct Property entry, Search return, Property inquiry, Advisory, Contact, canonical, and Product 3.1 remain unchanged.
4. Add one route-local presentational decision-readiness layer.
5. Add deterministic implementation check.
6. Update implementation documentation and `docs/CHAT_START.md`.
7. Run local validation, browser/responsive review if available, and protected-boundary review.
8. Create one local implementation commit.
9. Stop without push until explicitly authorized.

## Deterministic Certification Criteria

- Property route remains the only runtime file changed.
- Governing decision-readiness question is present.
- Evidence available, evidence missing, assumptions, unknowns, confidence, verification, questions, and next-decision threshold are present.
- Property inquiry remains property-specific and unchanged.
- Search return continuity remains unchanged.
- Advisory prepares and Contact begins; neither receives hidden property context.
- No provider activation, API change, persistence, telemetry, CRM, email, scheduling, AI advice, valuation certainty, financial qualification, legal advice, tax advice, suitability conclusion, or protected-class steering is introduced.
- Canonical URL remains clean.
- Direct Property entry remains independent.
- Brokerage disclosure remains unchanged.

## Responsive And Accessibility Criteria

- Exactly one H1.
- Decision-readiness layer scans clearly on mobile, tablet, and desktop.
- Text does not clip or overlap.
- Links and controls remain keyboard focusable.
- Focus indicators remain visible.
- No document-level horizontal overflow.
- No hidden context appears in rendered content or destinations.

## Production-Certification Criteria

- Representative direct Property route returns HTTP 200.
- Same Property with valid Search return context preserves certified return behavior.
- Malformed return context is ignored safely.
- Canonical remains clean.
- Property inquiry remains present and structurally unchanged.
- Product 3.1 remains present.
- Advisory and Contact continuations remain present and unchanged.
- Homepage, Search, Buyer, Seller, Market, City Market, Neighborhood, Contact, brokerage disclosures, and Search API regressions pass.

## Accepted Limitations

- This readiness record does not authorize runtime implementation.
- No new provider, data activation, hidden context, persistence, telemetry, CRM, email, scheduling, financial logic, valuation logic, legal logic, tax logic, or AI advice is authorized.
- Search Decision Workspace Depth is selected only as a secondary planning phase because Search changes carry broader component, ranking, map/list, and runtime risk.

## Recommended Gates

Primary:

`READY_FOR_REIE_DXT_2_PROPERTY_DECISION_READINESS_DEPTH_BOUNDED_IMPLEMENTATION_AUTHORIZATION`

Secondary:

`READY_FOR_REIE_DXT_2_SEARCH_DECISION_WORKSPACE_DEPTH_PLANNING_AUTHORIZATION`
