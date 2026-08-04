# PROJECT ATLAS / REIE DXT 3 First-Phase Implementation Readiness

Status: `DXT_3_FIRST_PHASE_IMPLEMENTATION_READINESS_READY`

Program: `DXT_3_DECISION_QUALITY_AND_PROFESSIONAL_PREPARATION`

Runtime authorization: `false`

Push or deployment authorization: `false`

Selected primary phase: `PROPERTY_PROFESSIONAL_PREPARATION`

Selected secondary planning phase: `ADVISORY_CONVERSATION_PREPARATION`

Deferred phase: `PROPERTY_INQUIRY_PREPARATION_QUALITY`

## Candidate Assessment

| Candidate | Customer value | Material gap | Runtime scope | Risk posture | Testability | Disposition |
|---|---|---|---|---|---|---|
| Property Professional Preparation | High | Property has address-level readiness and handoff, but the next professional conversation priority is not yet organized as a concise route-local preparation layer. | One route: `app/properties/[id]/page.tsx` | Controlled if no form, API, hidden context, advice, valuation, legal, tax, lending, or suitability behavior changes. | Strong deterministic route-local criteria. | `SELECTED_PRIMARY` |
| Buyer Professional Preparation | High | Buyer could organize professional conversation topics beyond readiness depth. | `app/buy/page.tsx` | Higher financial and lending risk. | Strong after separate planning. | `CANDIDATE_LATER_PHASE` |
| Seller Professional Preparation | High | Seller could organize conversation topics beyond readiness depth. | `app/sell/page.tsx` | Higher valuation, pricing, legal, and tax risk. | Strong after separate planning. | `CANDIDATE_LATER_PHASE` |
| Advisory Conversation Preparation | High | Advisory already prepares conversation but could become a stronger DXT 3 convergence surface. | `components/AdvisoryHandoffGuide.tsx` or route-local Contact only if authorized. | Must avoid form behavior, representation, or hidden transfer. | Strong as a second planning phase. | `SELECTED_SECONDARY_PLANNING` |
| Contact Path Selection Quality | Medium | Contact routing can be clarified after Advisory and Property pathways mature. | `app/contact/page.tsx` | Must preserve general Contact and no generic form. | Moderate. | `CANDIDATE_LATER_PHASE` |
| Property Inquiry Preparation Quality | High | Inquiry quality could improve if the customer better organizes questions before submitting. | `components/PropertyInquiryForm.tsx` or property route only if separately authorized. | Specialized form, API, CRM, email, consent, and submission risks. | Strong but protected. | `DEFERRED_PROTECTED_FLOW` |
| Market / Neighborhood Professional Question Preparation | Medium | Market and place evidence could be carried into professional questions. | Market-family routes. | Higher fair-housing, suitability, safety, school, and neighborhood-fit risk. | Moderate. | `CANDIDATE_LATER_PHASE` |
| Cross-Route Professional Preparation Standard | Medium | Documentation standard can guide future route-specific work. | Documentation only. | Low if no runtime abstraction. | Strong. | `DOCUMENTATION_STANDARD_ONLY` |
| DXT 3 Foundation Only | Low as first implementation | Planning alone is insufficient because Property has a bounded implementation-ready gap. | None. | Low. | Strong but not the highest-value next step. | `NOT_SELECTED` |

## Selected First Phase

Program phase identifier: `PROPERTY_PROFESSIONAL_PREPARATION`

Governing customer decision:

> After evaluating this property, what should I organize before asking a property-specific question or beginning a focused professional conversation?

Current-state finding:

- Property owns address-level evaluation, evidence depth, verification, and Property-specific inquiry.
- The route already includes Property Decision Readiness and a Professional Handoff.
- Property Inquiry remains the dominant property-specific path.
- Advisory remains preparation before Contact.
- Contact remains a subordinate general conversation path.

Material preparation gap:

- The Property route does not yet provide one concise DXT 3 professional-preparation layer that organizes evidence reviewed, evidence still needed, assumptions, unknowns, conversation priority, professional questions, and appropriate pathway choice before the customer asks or contacts.

## Proposed First-Phase Hierarchy

1. Property professional preparation orientation.
2. Evidence reviewed on this property.
3. Evidence still needed or requiring verification.
4. Assumptions and unknowns.
5. Property-specific questions for Property Inquiry.
6. Questions requiring source, inspection, title, HOA, insurance, lender, market, legal, tax, appraisal, or other professional review.
7. Customer-selected conversation priority.
8. Appropriate professional pathway: Property Inquiry, Advisory preparation, or general Contact.
9. What REIE cannot determine.
10. Privacy, consent, brokerage, representation, and professional boundaries.

## Evidence Treatment

- Use existing visible Property evidence only.
- Do not add Search, Buyer, Seller, Market, Advisory, Contact, or hidden route state.
- Do not add property context to Advisory or Contact URLs.
- Do not persist or profile customer questions.
- Do not prefill forms.

## Question Treatment

- Property-specific questions remain routed to `#property-contact`.
- Professional-preparation questions can be organized but not answered.
- Legal, tax, lending, valuation, appraisal, inspection, title, insurance, HOA, contract, and professional questions are labeled for appropriate review.

## Conversation-Priority Treatment

- Conversation priority is customer-selected and visible only.
- It is not a score, recommendation, suitability label, ranking, or inferred preference.

## Pathway Treatment

- Property Inquiry: dominant when the customer has a specific question about the listing.
- Advisory: preparation path when public evidence and assumptions need organization before a focused conversation.
- Contact: subordinate general starting point when the question is broader than one property.

## Privacy And Consent Treatment

- No hidden context.
- No automatic transfer.
- No persistence.
- No telemetry.
- No customer profile.
- No unsubmitted form content transfer.
- No prechecked consent.
- Existing Property Inquiry consent and privacy behavior remain unchanged.

## Professional Boundaries

The first phase must not introduce representation claims, guaranteed outcomes, legal advice, tax advice, lending approval, qualification, affordability, buying power, underwriting, credit analysis, lender ranking, appraisal equivalence, valuation certainty, pricing strategy, investment advice, suitability conclusions, fair-housing steering, provider ranking, AI professional advice, or response-time guarantees.

## Runtime Ownership

Authorized future runtime owner if implementation is separately approved:

- `app/properties/[id]/page.tsx`

Inspection-only files:

- `components/PropertyInquiryForm.tsx`
- `components/AdvisoryHandoffGuide.tsx`
- `app/contact/page.tsx`
- Search runtime and APIs
- Buyer and Seller runtime
- Market, City Market, and Neighborhood runtime
- forms, APIs, CRM, email, scheduling, persistence, telemetry, navigation, footer, and brokerage disclosure

Protected dependencies:

- Property Inquiry form fields, required/optional status, validation, consent, privacy, endpoint, CRM task behavior, email notification behavior, loading state, success state, failure state, unsubscribe behavior, and customer-data handling.
- Advisory and Contact certified runtime behavior.
- Canonical URLs and direct-entry behavior.

## Shared-File Stop Conditions

Stop and report if implementation requires:

- another runtime file;
- a shared runtime component;
- a shared schema;
- form or API modification;
- hidden context;
- Property context in Advisory or Contact URLs;
- persistence, localStorage, cookies, telemetry, analytics, CRM, email, scheduling, navigation, footer, or brokerage disclosure changes.

## Implementation Sequence For Future Authorization

1. Verify baseline and governing DXT 3 planning records.
2. Inventory current Property professional-preparation and inquiry paths.
3. Confirm Property Inquiry, Advisory, and Contact remain inspection-only.
4. Implement one concise route-local professional-preparation layer in `app/properties/[id]/page.tsx`.
5. Add deterministic implementation validation.
6. Run property route, protected-system, direct-entry, canonical, no-hidden-context, responsive, accessibility, and regression checks.
7. Create one local implementation commit only.
8. Stop without push until separately authorized.

## Deterministic Certification Criteria

- Selected phase remains `PROPERTY_PROFESSIONAL_PREPARATION`.
- Only `app/properties/[id]/page.tsx` may change as runtime in a future implementation.
- Property Inquiry remains structurally unchanged.
- Advisory and Contact runtime remain unchanged.
- No form, API, CRM, email, scheduling, persistence, telemetry, navigation, footer, brokerage disclosure, Search, Buyer, Seller, Market, City Market, or Neighborhood runtime changes occur.
- No hidden context, automatic transfer, customer profile, or property context in Advisory or Contact URLs is introduced.
- Professional-preparation content uses existing visible Property evidence only.
- The implementation distinguishes evidence reviewed, evidence still needed, assumptions, unknowns, questions, conversation priority, Property Inquiry, Advisory, and Contact.
- Prohibited advice, representation, fair-housing, lending, valuation, legal, tax, investment, suitability, scoring, ranking, prediction, and recommendation claims remain absent.

## Responsive And Accessibility Criteria

- Exactly one H1.
- Property evaluation hierarchy remains primary.
- Professional-preparation layer is concise and scannable on 390x844, 768x1024, and 1440x1100 viewports.
- Property Inquiry remains visibly dominant for property-specific questions.
- Advisory and Contact remain distinct and subordinate.
- Links and controls remain keyboard focusable.
- Focus indicators remain visible.
- No text clipping.
- No document-level horizontal overflow.

## Production-Certification Criteria

- HTTP 200 for the representative Property route.
- Clean Property canonical.
- Direct Property entry understandable.
- Search return continuity preserved.
- Property Inquiry present and unchanged.
- Advisory destination remains `/contact#advisory-readiness`.
- Contact destination remains `/contact#contact-route-choice`.
- No hidden property context appears in rendered content or destinations.
- Protected routes and APIs remain unchanged.

## Accepted Limitations

- First-phase readiness is planning-only until separately authorized.
- Property is selected because it is the highest-value bounded first phase, not because Buyer, Seller, Advisory, Contact, Market, or Neighborhood lack future value.
- Property Inquiry quality is deferred because specialized form behavior is protected.
- Advisory Conversation Preparation is selected as the next planning phase because it is the natural convergence point after route-specific professional preparation matures.

## Gates

Primary implementation gate:

`READY_FOR_REIE_DXT_3_PROPERTY_PROFESSIONAL_PREPARATION_BOUNDED_IMPLEMENTATION_AUTHORIZATION`

Secondary planning gate:

`READY_FOR_REIE_DXT_3_ADVISORY_CONVERSATION_PREPARATION_PLANNING_AUTHORIZATION`

Executive recommendation:

`READY_FOR_DXT_3_PLANNING_CERTIFICATION`
