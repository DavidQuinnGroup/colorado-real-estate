# PROJECT ATLAS / REIE DXT 3 Contact Path Selection Quality Plan Certification

Status: `REIE_DXT_3_CONTACT_PATH_SELECTION_QUALITY_PLAN_CERTIFIED_AND_CLOSED`

Plan identifier: `CONTACT_PATH_SELECTION_QUALITY`

Runtime authorization: `false`

Future runtime owner: `app/contact/page.tsx`

Architecture finding: `ROUTE_LOCAL_OR_EXISTING_COMPONENTS_PREFERRED`

Shared runtime finding: `NO_SHARED_RUNTIME_COMPONENT_OR_SCHEMA_REQUIRED`

## Objective

Certify and close the documentation-and-deterministic-plan-only Contact Path Selection Quality phase after successful Advisory Conversation Preparation production certification. No Contact runtime implementation is authorized by this record.

## Governing Customer Decision

`What is the safest and simplest path to begin the right professional conversation?`

## Current Purpose Finding

Contact owns general conversation initiation, direct entry, public route choice, what happens next, and public privacy and consent boundaries. Contact does not own professional preparation already owned by Advisory or Property-specific submission already owned by Property Inquiry.

## Material Path-Selection Gap

The material gap is clarity, not data capture. Customers may arrive at Contact from Property, Advisory, Buyer, Seller, Search, Market, Neighborhood, or external entry with different levels of readiness. A future bounded Contact phase can help distinguish the safest starting path without automatic routing, inferred context, forms, APIs, persistence, telemetry, CRM, email, scheduling, or customer profiling.

## Proposed Hierarchy

1. Contact orientation.
2. Governing path-selection question.
3. Public context available.
4. Evidence still needed.
5. Assumptions and unknowns.
6. Path-selection questions.
7. Advisory pathway.
8. Property Inquiry pathway.
9. General Contact pathway.
10. Privacy and consent boundaries.
11. Advice and representation boundaries.
12. What happens next.
13. One dominant action.
14. Compact alternative pathways.

## Public Context Treatment

Permitted context is visible public context only:

- current Contact route;
- static route labels;
- public Property route label only where already visible through route-owned navigation;
- public Buyer, Seller, Search, Market, City Market, Neighborhood, or Advisory route labels;
- customer-readable path-selection categories.

No hidden context, route-history inference, identity, contact information, private notes, inquiry contents, saved state, planner inputs, financial assumptions, protected characteristics, CRM status, telemetry-derived context, cookies, localStorage, or unsubmitted form data may be transferred or inferred.

## Evidence Still Needed

Future Contact path selection may identify evidence still needed before choosing a pathway:

- whether the question is about a specific Property;
- whether the customer needs Advisory preparation first;
- whether a general conversation is sufficient;
- whether the question belongs back on Buyer, Seller, Search, Market, City Market, Neighborhood, or Property;
- whether specialist review may be needed before reliance.

The plan does not authorize collecting that evidence through a new form.

## Assumptions And Unknowns

Assumptions:

- the customer may not know the correct starting path;
- Contact remains general conversation initiation;
- Advisory prepares before a focused conversation;
- Property Inquiry remains specialized for address-specific inquiry;
- specialized forms preserve their own consent and privacy behavior.

Unknowns:

- customer identity;
- confidential motivation;
- representation status;
- transaction posture;
- professional review needs;
- legal, tax, lending, valuation, insurance, title, HOA, inspection, or contract details.

## Path-Selection Question Treatment

A future Contact phase may use static questions such as:

- Is this about one Property?
- Do I need to prepare before speaking with an advisor?
- Am I ready to begin a general conversation?
- Should I return to Buyer, Seller, Search, Market, City Market, Neighborhood, or Property context first?
- What should stay out of public forms until the applicable relationship and disclosures are discussed?

These questions may guide pathway selection but must not answer protected professional questions.

## Pathway Model

Advisory pathway:

- prepares a focused professional conversation;
- organizes evidence, assumptions, unknowns, and questions;
- does not submit, schedule, or create representation.

Property Inquiry pathway:

- handles Property-specific inquiry through the certified specialized flow;
- preserves fields, consent, endpoint, submission, CRM, email, and customer-data treatment unless separately authorized.

General Contact pathway:

- begins a general conversation;
- remains direct-entry compatible;
- does not infer or transfer hidden context.

## Privacy And Consent Plan

The plan preserves:

- visible public context only;
- no hidden transfer;
- no customer profiling;
- no cookies or localStorage;
- no telemetry-derived path choice;
- no form prefill;
- no identity or financial-context transfer;
- no CRM classification;
- no prechecked consent;
- no implied marketing consent;
- no representation created by path selection;
- no response-time guarantee.

No new form is authorized by this plan.

## Advice And Representation Boundaries

The future phase must not introduce:

- professional advice;
- representation claims;
- fiduciary claims;
- legal advice;
- tax advice;
- lending advice;
- affordability or qualification conclusions;
- appraisal or valuation advice;
- pricing strategy;
- investment advice;
- suitability conclusions;
- fair-housing steering;
- outcome certainty;
- AI professional conclusions.

## Direct Entry And Anchor Preservation

Direct `/contact` entry must remain understandable without prior route state. Existing Contact anchors, including `#advisory-readiness`, `#advisory-contact-transition`, and `#contact-route-choice`, must remain targetable unless a separate implementation authorization explicitly changes them.

## Dominant Action And Alternatives

A future Contact phase should preserve one dominant route-choice action and compact alternative pathways. Alternatives may include:

- I have a Property-specific question;
- I want to prepare before speaking with an advisor;
- I want to begin a general conversation;
- I need Buyer preparation;
- I need Seller preparation;
- I want to continue research.

These categories must remain static and non-persistent unless separately authorized.

## Proposed Runtime Ownership

Future runtime owner:

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

Another runtime file would require separate authorization.

## Protected Dependency Finding

The plan does not authorize changes to:

- Advisory runtime;
- Property Inquiry;
- PropertyInquiryForm;
- LeadCapture;
- forms;
- fields;
- consent;
- submissions;
- APIs;
- CRM;
- email;
- scheduling;
- Property;
- Search;
- Buyer;
- Seller;
- Market;
- City Market;
- Neighborhood;
- navigation;
- footer;
- brokerage disclosure.

## Deterministic Certification Criteria

A future implementation check must verify:

- Contact remains general conversation initiation.
- Advisory remains focused preparation.
- Property Inquiry remains specialized.
- Existing anchors remain targetable.
- No form, field, consent, submission, API, CRM, email, scheduling, persistence, telemetry, analytics, hidden context, URL-context expansion, form prefill, customer profile, or lead classification is introduced.
- No professional advice, representation, fiduciary claim, lending conclusion, valuation conclusion, legal advice, tax advice, investment advice, suitability conclusion, fair-housing steering, or AI professional conclusion is introduced.
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
- `/contact#advisory-readiness`, `/contact#advisory-contact-transition`, and `/contact#contact-route-choice` remain valid.
- Contact canonical remains `https://davidquinngroup.com/contact`.
- No hidden context appears in rendered content or destinations.
- Advisory, Property Inquiry, Search, Property, Buyer, Seller, Market, City Market, Neighborhood, forms, APIs, CRM, email, scheduling, persistence, telemetry, navigation, footer, and brokerage disclosure remain unchanged.

## Accepted Limitations

- This is a plan-certification and closure record only.
- Contact runtime implementation remains unauthorized.
- Property Inquiry Preparation Quality remains separately gated.
- DXT 3 completion assessment remains premature until Contact Path Selection Quality is addressed or explicitly declined.

## DXT 3 Completion Implication

DXT 3 completion assessment remains premature until Contact Path Selection Quality is separately authorized, implemented, certified, and closed, or explicitly declined through a later governance decision.

## Conclusion

`REIE_DXT_3_CONTACT_PATH_SELECTION_QUALITY_PLAN_CERTIFIED_AND_CLOSED`
