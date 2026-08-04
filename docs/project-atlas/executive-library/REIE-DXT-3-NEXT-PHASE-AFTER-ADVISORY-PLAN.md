# PROJECT ATLAS / REIE DXT 3 Next Phase After Advisory Plan

Status: `DXT_3_NEXT_PHASE_AFTER_ADVISORY_PLAN_READY`

Runtime authorization: `false`

Selected primary phase: `CONTACT_PATH_SELECTION_QUALITY`

Selected secondary planning phase: `PROPERTY_INQUIRY_PREPARATION_QUALITY`

Deferred or protected phase: `DXT_3_COMPLETION_ASSESSMENT`

Proposed runtime ownership: `app/contact/page.tsx`

Shared runtime finding: `ROUTE_LOCAL_OR_EXISTING_COMPONENTS_PREFERRED`

## Objective

Evaluate the next highest-value DXT 3 phase after Advisory Conversation Preparation without runtime implementation. The selected next phase must remain route-local, public-context-only, non-advisory, non-representational, non-persistent, non-telemetry-based, and free of forms, APIs, CRM, email, scheduling, and customer-profile expansion unless separately authorized.

## Candidate Assessment

### Buyer Professional Preparation

Customer value is meaningful because Buyer has certified readiness depth and financing-verification boundaries. Current maturity is high after DXT 2, and the material gap is narrower than Contact because Buyer already has strong readiness framing and Advisory continuation. Runtime ownership would likely be `app/buy/page.tsx`. Financial and lending risk is elevated, but manageable with route-local presentation. Recommendation: `CANDIDATE_LATER_PHASE`.

### Seller Professional Preparation

Customer value is meaningful because Seller has certified readiness depth and valuation-safe preparation. Current maturity is high after DXT 2. Runtime ownership would likely be `app/sell/page.tsx`. Valuation, pricing, legal, tax, and outcome-risk boundaries require care. Recommendation: `CANDIDATE_LATER_PHASE`.

### Contact Path Selection Quality

Customer value is high because Contact is the final public route where customers choose the safest starting point after Property, Advisory, Buyer, Seller, Search, Market, and Neighborhood preparation. The current route already distinguishes general conversation initiation from specialized workflows, but a future bounded phase can clarify path selection quality without new forms, fields, APIs, CRM, email, scheduling, persistence, telemetry, URL-context expansion, hidden context, or customer profiles. Runtime ownership is route-local: `app/contact/page.tsx`. Recommendation: `SELECTED_PRIMARY_PHASE`.

### Property Inquiry Preparation Quality

Customer value is high for Property-specific questions, but specialized form, consent, API, CRM, and email dependencies create higher protected-system risk. A future phase may be valuable only if it preserves `components/PropertyInquiryForm.tsx`, existing fields, consent, endpoint, submission behavior, CRM, email, and customer-data treatment or receives separate authorization. Recommendation: `SELECTED_SECONDARY_PLANNING_PHASE`.

### Market / Neighborhood Professional Question Preparation

Customer value is moderate because Market and Neighborhood already own broad market evidence and neutral place orientation. Fair-housing and steering risk is elevated if language becomes personalized. Runtime ownership would span Market-family routes, increasing certification complexity. Recommendation: `CANDIDATE_LATER_PHASE`.

### Cross-Route Professional Preparation Standard

Customer value is governance-oriented. DXT 3 already has an architecture and terminology model, and exact copy uniformity is not required. A shared runtime abstraction remains inappropriate. Recommendation: `DOCUMENTATION_STANDARD_ALREADY_SUFFICIENT_FOR_NOW`.

### DXT 3 Completion Assessment

DXT 3 completion assessment remains premature until Contact path selection quality is separately authorized, implemented, certified, and closed. Recommendation: `DEFERRED_OR_PROTECTED_PHASE`.

## Selected Primary Phase

`CONTACT_PATH_SELECTION_QUALITY`

## Governing Customer Decision

`What is the safest and simplest path to begin the right professional conversation?`

## Current-State Finding

Contact already owns general conversation initiation and route choice. It currently explains that Property-specific questions should start from a property page, Market strategy requests should start from city Market pages, and general planning questions continue through Contact. The material preparation gap is path-selection clarity after DXT 3 Advisory, not form behavior or Contact submission expansion.

## Material Preparation Gap

Customers may arrive at Contact from public routes with different levels of readiness. A future bounded Contact phase can improve path selection by making the distinction between general Contact, Property Inquiry, Advisory preparation, market strategy pathways, and returning to route-owned preparation clearer without transferring hidden context or adding data collection.

## Proposed Hierarchy

1. Contact orientation.
2. Governing path-selection question.
3. Available public context.
4. Evidence still needed before Contact.
5. Assumptions and unknowns.
6. Appropriate pathway choice.
7. Specialized inquiry versus general Contact.
8. Advisory preparation versus Contact initiation.
9. Privacy and consent boundaries.
10. Professional and representation boundaries.
11. What happens next.
12. One dominant route-choice action.
13. Compact alternative continuations.

## Evidence Treatment

Use visible public route context only. Do not infer prior journey state, customer intent, customer identity, private notes, saved search behavior, planner inputs, inquiry contents, financial assumptions, protected characteristics, CRM state, or telemetry-derived context.

## Assumptions And Unknowns

Future Contact path selection may make assumptions visible:

- the customer may not yet know the correct pathway;
- Property-specific questions belong on the Property route;
- general conversation initiation belongs on Contact;
- Advisory prepares before a focused conversation;
- specialized forms preserve their own consent and privacy behavior.

Unknowns remain not confirmed here:

- customer identity;
- confidential motivation;
- exact transaction posture;
- representation status;
- professional review needs;
- legal, tax, lending, valuation, insurance, title, HOA, inspection, or contract details.

## Question Treatment

Questions may help customers choose a pathway, but Contact must not answer protected professional questions. The phase may organize questions such as:

- Is this question about one Property?
- Is the customer ready to begin a general conversation?
- Would Advisory preparation help organize evidence first?
- Does the question require a specialized workflow?
- What should remain outside public forms until the applicable relationship and disclosures are discussed?

## Conversation-Priority Treatment

Conversation priority must remain static and visible. No saved priority, hidden state, route-context transfer, form prefill, CRM classification, lead score, telemetry, or customer profile is authorized.

## Pathway Treatment

Contact remains the general conversation initiation route.

Advisory remains focused preparation.

Property Inquiry remains specialized.

Buyer, Seller, Search, Property, Market, City Market, and Neighborhood retain route-owned preparation and evidence responsibilities.

## Privacy And Consent Treatment

No Contact form, field, consent, submission, API, CRM, email, scheduling, persistence, telemetry, hidden context, or URL-context expansion.

No identity, email, phone, private notes, saved state, financial assumptions, protected characteristics, CRM status, telemetry-derived context, cookies, localStorage, or unsubmitted form content may be transferred or inferred.

## Professional Boundaries

No professional advice, representation, fiduciary claim, lending conclusion, valuation conclusion, legal advice, tax advice, investment advice, suitability conclusion, or fair-housing steering.

## Runtime Ownership

Preferred future runtime owner:

- `app/contact/page.tsx`

Inspection-only protected files:

- `components/AdvisoryHandoffGuide.tsx`
- `components/PropertyInquiryForm.tsx`
- LeadCapture
- APIs
- CRM
- email
- scheduling
- Property
- Search
- Buyer
- Seller
- Market
- City Market
- Neighborhood
- navigation
- footer
- brokerage disclosure

## Shared-File Risks

Future implementation may require:

- deterministic Contact path-selection check;
- implementation record;
- `docs/CHAT_START.md`;
- `package.json` and `tsconfig.worker.json` only if check registration is required.

No shared runtime component, schema, provider, hook, state model, persistence model, telemetry event, or customer profile is recommended.

## Implementation Sequence

1. Verify baseline and Advisory local or production certification, depending on authorization.
2. Inventory Contact path-selection content and existing anchors.
3. Confirm implementation can remain route-local to `app/contact/page.tsx`.
4. Preserve Advisory and Property Inquiry responsibilities.
5. Add bounded Contact path-selection presentation if separately authorized.
6. Add deterministic implementation validation.
7. Review `/contact`, `/contact#advisory-readiness`, and `/contact#contact-route-choice` directly and responsively.
8. Run Contact, Advisory, Property Inquiry, public runtime, public trust, typecheck, lint, fast, and build checks.
9. Create one local implementation commit only.
10. Stop without push unless separately authorized.

## Deterministic Certification Criteria

- Contact remains general conversation initiation.
- Advisory remains focused preparation.
- Property Inquiry remains specialized.
- Existing anchors remain targetable.
- No Contact host behavior is expanded beyond presentation.
- No form, field, consent, submission, API, CRM, email, scheduling, persistence, telemetry, hidden context, URL-context expansion, form prefill, customer profile, or lead classification is introduced.
- No professional advice, representation, fiduciary claim, lending conclusion, valuation conclusion, legal advice, tax advice, investment advice, suitability conclusion, or fair-housing steering.
- Direct entry remains understandable.
- Brokerage disclosure remains unchanged.

## Responsive And Accessibility Criteria

- One H1 remains on `/contact`.
- Contact path-selection hierarchy remains concise and scannable at mobile, tablet, and desktop sizes.
- Focus indicators remain visible.
- Links and controls remain keyboard focusable.
- No text clipping.
- No document-level horizontal overflow.
- Mobile stacking preserves Contact, Advisory, and Property Inquiry distinctions.

## Production-Certification Criteria

- `/contact` returns HTTP 200.
- `/contact#advisory-readiness` and `/contact#contact-route-choice` remain valid.
- Contact route canonical remains clean.
- No hidden context appears in rendered content or destinations.
- Property Inquiry, Advisory, Search, Property, Buyer, Seller, Market, Neighborhood, forms, APIs, CRM, email, scheduling, persistence, telemetry, navigation, footer, and brokerage disclosure remain unchanged.

## Accepted Limitations

- This is a plan only.
- Contact Path Selection Quality runtime implementation remains unauthorized.
- Property Inquiry Preparation Quality remains separately gated because it may touch specialized form responsibilities.
- DXT 3 Completion Assessment remains premature.

## Separate Authorization Gate

`READY_FOR_REIE_DXT_3_CONTACT_PATH_SELECTION_QUALITY_BOUNDED_IMPLEMENTATION_AUTHORIZATION`

## Conclusion

`DXT_3_NEXT_PHASE_AFTER_ADVISORY_PLAN_READY`
