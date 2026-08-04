# PROJECT ATLAS / REIE DXT 3 Decision Quality And Professional Preparation Architecture

Status: `DXT_3_PROFESSIONAL_PREPARATION_ARCHITECTURE_READY`

Program: `DXT_3_DECISION_QUALITY_AND_PROFESSIONAL_PREPARATION`

Runtime authorization: `false`

Shared runtime finding: `ROUTE_LOCAL_OR_EXISTING_COMPONENTS_PREFERRED`

Shared runtime component required: `false`

Shared runtime schema required: `false`

## Architecture Purpose

DXT 3 helps customers turn public decision readiness into concise professional preparation. The architecture is documentation-led and route-owned. It may organize questions and pathway choice, but it must not answer protected professional questions, simulate representation, infer hidden preferences, transfer private context, create a customer profile, create CRM work, submit a form, schedule, send email, persist decision state, or emit telemetry-derived personalization.

## DXT 3 Preparation Model

Route-appropriate professional preparation may include:

1. Customer decision being prepared.
2. Evidence already reviewed.
3. Evidence still missing.
4. Assumptions being used.
5. Unknowns.
6. Questions requiring source verification.
7. Questions requiring Property review.
8. Questions requiring lender review.
9. Questions requiring market review.
10. Questions requiring legal, tax, insurance, title, inspection, appraisal, or other professional review.
11. Decision points not yet resolved.
12. Customer-selected conversation priority.
13. Appropriate professional pathway.
14. What REIE cannot determine.
15. What happens next.
16. Privacy, consent, brokerage, and representation boundaries.

The model remains customer-readable, concise, route-specific, non-scoring, non-predictive, non-prescriptive, direct-entry compatible, and limitation-forward.

## Professional Preparation Terminology Standard

- Evidence reviewed: public route evidence the customer has visibly encountered or could review on the current route.
- Evidence still needed: missing or unconfirmed information that should be gathered from a source, property review, lender, market review, or qualified professional.
- Assumption: a visible working premise that may help organize a question but is not proof.
- Unknown: a material matter not confirmed by current public evidence.
- Question to verify: a concise item the customer should carry to the correct evidence source or professional pathway.
- Conversation priority: the customer-selected topic that should be handled first in a professional conversation.
- Professional review: review by the appropriate qualified professional; REIE may identify the category but may not answer the protected question.
- Specialized inquiry: an existing certified inquiry pathway such as Property Inquiry that owns specialized submission behavior.
- General Contact: Contact route initiation for broad conversation routing; it is not a property-specific or customer-specific hidden-context transfer.
- Representation boundary: preparation, inquiry, or Contact does not create representation or fiduciary duties by itself.
- Advice boundary: REIE does not provide legal, tax, lending, appraisal, valuation, investment, suitability, or professional advice.
- Privacy boundary: no hidden context, customer profile, unsubmitted form content, saved search, planner input, or telemetry-derived context is transferred.
- Consent boundary: no prechecked consent, implied marketing consent, or new submission behavior is created by DXT 3 preparation.
- Next professional step: the route-appropriate path, such as Property Inquiry, Advisory preparation, or general Contact, chosen from visible context only.

Exact route copy uniformity is not required. Route responsibility controls terminology.

## Context Classification

### SAFE_VISIBLE_CONTEXT

- Originating public route.
- Visible Property address or slug.
- Visible city.
- Visible Neighborhood.
- Visible customer-selected conversation category.
- Visible evidence category.
- Static route intent.
- Explicitly displayed return destination.

### RESTRICTED_CONTEXT

- Search criteria only where already explicit and allowlisted.
- Property identifier only within existing specialized Property Inquiry behavior.
- Explicitly customer-entered context only inside an authorized form.

### PROHIBITED_CONTEXT

- Identity.
- Email.
- Phone.
- Private notes.
- Saved searches.
- Saved Properties.
- Planner inputs.
- Financial assumptions.
- Credit information.
- Affordability conclusions.
- Browsing history.
- Inferred preferences.
- Protected characteristics.
- CRM status.
- Lead score.
- Telemetry-derived context.
- Cookies or localStorage state.
- Confidential information.
- Unsubmitted form content.

No prohibited context may be transferred, persisted, inferred, surfaced, scored, or used to personalize DXT 3.

## Privacy Architecture

- Visible context only.
- No hidden transfer.
- No automatic persistence.
- No customer profiling.
- No telemetry-derived personalization.
- No prechecked consent.
- No implied marketing consent.
- No representation created by preparation or inquiry.
- No response-time guarantee.
- No confidential information requested before an appropriate professional channel exists.
- Existing specialized form consent and privacy behavior remain unchanged.

## Consent Architecture

- DXT 3 preparation can identify what to ask, but cannot collect or submit it unless a separately authorized form already owns that behavior.
- Property Inquiry consent remains owned by `components/PropertyInquiryForm.tsx`.
- Contact remains a general conversation initiation route.
- Advisory remains preparation before Contact and does not submit customer information by itself.

## Professional Boundary Architecture

DXT 3 must not introduce legal advice, tax advice, lending advice, appraisal or valuation advice, pricing strategy, investment advice, suitability conclusions, fair-housing steering, representation claims, fiduciary claims, guaranteed outcomes, or AI impersonation of a licensed professional.

Professional preparation may organize questions but cannot answer protected professional questions.

## Fair-Housing Architecture

DXT 3 prohibits protected-class steering, demographic suitability, family-status assumptions, neighborhood fit, neighborhood rankings, best-neighborhood claims, safety guarantees, unsupported crime conclusions, school-quality conclusions, and personalized location recommendations based on protected or inferred traits.

## Financial And Lending Architecture

DXT 3 prohibits mortgage approval, qualification, affordability, buying power, underwriting, credit analysis, lender recommendations, rate predictions, loan-product recommendations, closing-cost certainty, and personalized financial advice.

## Valuation And Seller Architecture

DXT 3 prohibits appraisal equivalence, valuation certainty, verified property value claims, list-price recommendations, sale-price predictions, guaranteed pricing, guaranteed sale outcomes, guaranteed timing, market-timing recommendations, automated pricing strategy, and investment advice.

## Route-Local Versus Shared Architecture

Default implementation architecture: `ROUTE_LOCAL_OR_EXISTING_COMPONENTS_PREFERRED`

No shared runtime component, hook, provider, store, schema, or customer-profile model is authorized or required for DXT 3 planning.

If future implementation evidence proves a shared component unavoidable, the required outcome is `SHARED_RUNTIME_STOP_AND_REPORT`, with the affected routes, customer value, protected-boundary risks, alternatives, migration impact, and separate authorization gate documented before any runtime work.

## Direct-Entry Architecture

Every DXT 3 route must remain understandable when opened directly, refreshed, copied, externally referred, reached through browser Back or Forward, or opened with malformed or missing optional context. No prior REIE journey state may be required.

## Specialized-Flow Preservation

- Property Inquiry remains property-specific and owns specialized submission behavior.
- Advisory remains focused-conversation preparation with no submission and no representation.
- Contact remains general conversation initiation.
- Buyer remains preparation to buy and cannot become a lending decision system.
- Seller remains preparation before market exposure and cannot become a valuation or pricing decision system.
- Search remains inventory exploration and comparison.
- Property remains address-level evaluation.
- Market and City Market remain broad and city-level evidence.
- Neighborhood remains neutral place orientation.

## Accepted Limitations

- DXT 3 is documentation and route-owned architecture until a separate implementation gate is granted.
- Exact route wording should differ where route decisions differ.
- No shared runtime abstraction exists or is required.
- No hidden personalization, persistence, telemetry, scoring, rankings, predictions, recommendations, or customer profiles are authorized.
- Brokerage disclosure remains `EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING`.

## Architecture Conclusion

Architecture status: `DXT_3_PROFESSIONAL_PREPARATION_ARCHITECTURE_READY`

Executive recommendation: `READY_FOR_DXT_3_PLANNING_CERTIFICATION`
