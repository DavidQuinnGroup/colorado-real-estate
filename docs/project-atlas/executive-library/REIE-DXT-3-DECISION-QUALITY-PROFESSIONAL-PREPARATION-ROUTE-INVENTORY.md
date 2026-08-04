# PROJECT ATLAS / REIE DXT 3 Decision Quality And Professional Preparation Route Inventory

Status: `DXT_3_ROUTE_AND_CAPABILITY_INVENTORY_READY`

Program: `DXT_3_DECISION_QUALITY_AND_PROFESSIONAL_PREPARATION`

Runtime authorization: `false`

Push or deployment authorization: `false`

Shared runtime component required: `false`

Shared runtime finding: `ROUTE_LOCAL_OR_EXISTING_COMPONENTS_PREFERRED`

No shared runtime component, hook, provider, store, schema, or customer-profile model is authorized or required for this DXT 3 planning foundation.

## Purpose

DXT 3 improves how customers convert public decision readiness into a focused, high-quality professional conversation. It organizes what the customer already knows, separates evidence from assumptions, identifies unresolved questions, and preserves the correct professional pathway without creating advice, representation, hidden context, customer profiles, persistence, telemetry, CRM work, email, scheduling, forms, APIs, or shared runtime readiness architecture.

## Governing Predecessor Records

- DXT 2 completion: `REIE_DXT_2_DECISION_READINESS_DEPTH_CERTIFIED_AND_CLOSED_WITH_ACCEPTED_LIMITATIONS`
- DXT 2 closure record: `docs/project-atlas/executive-library/REIE-DXT-2-DECISION-READINESS-DEPTH-PROGRAM-CLOSURE.md`
- DXT 2 terminology standard: `docs/project-atlas/executive-library/REIE-DXT-2-CROSS-ROUTE-EVIDENCE-CONSISTENCY-PLAN-CERTIFICATION.md`
- DXT 1 continuity closure: `REIE_DXT_CROSS_ROUTE_DECISION_CONTINUITY_CERTIFIED_AND_CLOSED`
- Advisory Handoff Foundation: `REIE_DXT_WAVE_1E_ADVISORY_HANDOFF_CERTIFIED`
- Contact Decision Flow: `REIE_DXT_WAVE_1E_CONTACT_DECISION_FLOW_CERTIFIED_AND_CLOSED`
- Property Inquiry protected flow: `components/PropertyInquiryForm.tsx`

## Route And Surface Inventory

| Route or surface | Governing customer decision | Route owner | Current professional-preparation capability | Evidence and question capability | Existing pathway | Future runtime owner | DXT 3 disposition |
|---|---|---|---|---|---|---|---|
| `/` | Where should the customer begin? | Homepage | Introductory orientation; directs to Search, Market, Buyer, and Seller readiness. | Public entry copy names context and verification but does not prepare a professional conversation. | Route links only. | `app/page.tsx` if ever needed. | `NO_ACTION_REQUIRED` |
| `/search` | Do these results give enough reliable context to inspect, compare, refine, or open next? | Search | Search Decision Readiness organizes visible criteria, comparison, degraded-provider posture, and property-opening thresholds. | Visible criteria, result count, list/map context, comparison readiness, and property handoff. | Property handoff and Market continuations. | `components/search/SearchInterface.tsx` if later route-local work is authorized. | `CANDIDATE_LATER_PHASE` |
| representative `/properties/[id]` | Is this address understood enough to ask a property-specific question or prepare a focused conversation? | Property | Property Decision Readiness and Professional Handoff already distinguish Property Inquiry, Advisory, and Contact. | Address-level facts, evidence gaps, assumptions, unknowns, verification, Property Inquiry, Advisory, and Contact boundaries. | `#property-contact`, `/contact#advisory-readiness`, `/contact#contact-route-choice`. | `app/properties/[id]/page.tsx` | `CANDIDATE_FIRST_PHASE` |
| Property Inquiry section | What specific question should be asked about this property? | Property Inquiry | Specialized inquiry form with existing consent, validation, endpoint, state handling, CRM/email behavior, and privacy boundaries. | Customer-entered inquiry only inside the existing specialized form. | `components/PropertyInquiryForm.tsx` at `#property-contact`. | Inspection-only for DXT 3 first phase. | `SPECIALIZED_FLOW_PRESERVE` |
| `/buy` | Am I prepared to buy? | Buyer | Buyer Decision Readiness and Professional Handoff organize financing assumptions, Search, Property, Advisory, and Contact thresholds. | Buyer preparation evidence, missing verification, assumptions, unknowns, questions, and qualitative confidence. | Search, financing anchors, Property review, Market, Advisory, Contact. | `app/buy/page.tsx` if later authorized. | `CANDIDATE_LATER_PHASE` |
| `/sell` | What must be understood before market exposure? | Seller | Seller Decision Readiness and Professional Handoff organize condition, pricing-context assumptions, objection readiness, Market, Advisory, and Contact thresholds. | Seller evidence, missing verification, condition and pricing assumptions, unknowns, questions, and qualitative confidence. | Seller Review, Home Worth, Market, Search, Advisory, Contact. | `app/sell/page.tsx` if later authorized. | `CANDIDATE_LATER_PHASE` |
| `/market` | Which market evidence should shape the next investigation surface? | Market | Market Decision Readiness connects broad briefing to Search, City Market, Neighborhood, Property, and Advisory. | Available market signals, missing property facts, assumptions, qualitative confidence, and thresholds. | `/search`, city market, neighborhood, `/contact#advisory-readiness`. | `app/market/page.tsx` if later authorized. | `CANDIDATE_LATER_PHASE` |
| representative `/market/[city]` | Is city-level evidence ready for Search, neighborhood, or property investigation? | City Market | City Market Decision Readiness connects city evidence to Search, Neighborhood, Property, and Advisory. | City signals, inventory context, neighborhood paths, assumptions, confidence, and verification. | `/search?city=...`, neighborhood paths, `/contact#advisory-readiness`. | `app/market/[city]/page.tsx` if later authorized. | `CANDIDATE_LATER_PHASE` |
| representative `/market/[city]/[slug]` | Does place orientation support a Search, Property, City Market, or Advisory next step? | Neighborhood | Neighborhood Decision Readiness and Continuity To Property are present. | Place orientation, market context, verification questions, assumptions, unknowns, and fair-housing boundaries. | Search path, City Market, Advisory. | `app/market/[city]/[slug]/page.tsx` if later authorized. | `PROTECTED_BOUNDARY_HOLD` |
| `/contact` | Which existing professional pathway is safest to begin from? | Contact | Contact Decision Flow and AdvisoryHandoffGuide explain Contact as general conversation initiation. | Contact route names appropriate paths and boundaries, but does not receive hidden context. | `#contact-route-choice`, `#advisory-readiness`, existing route links. | `app/contact/page.tsx` if later authorized. | `CANDIDATE_LATER_PHASE` |
| `/contact#advisory-readiness` | What should be organized before Contact begins? | Advisory | AdvisoryHandoffGuide prepares a focused professional conversation without submission or representation. | Evidence, assumptions, verification questions, professional boundaries, and Contact transition. | `/contact#contact-route-choice` and route continuations. | `components/AdvisoryHandoffGuide.tsx` if later authorized. | `CANDIDATE_LATER_PHASE` |
| `/grand-plan` | Should the customer discuss a broader plan? | Grand Plan | Specialized high-level planning flow with JourneyCohesionPanel. | Broad planning prompts; not a DXT 3 first phase because customer data and professional planning risk are higher. | Existing specialized route. | Inspection-only. | `SPECIALIZED_FLOW_PRESERVE` |
| `/home-worth` | Should the seller request home-worth context? | Home Worth | Specialized seller/home-worth route with JourneyCohesionPanel and Home Value request context. | Seller context and value framing remain protected from valuation certainty. | Existing specialized route. | Inspection-only. | `SPECIALIZED_FLOW_PRESERVE` |
| `/compare` | How should city-level contexts be compared? | Compare | JourneyCohesionPanel and comparison workflow are present. | Cross-city evidence comparison, not professional-preparation first phase. | Market and Advisory continuations. | `app/compare/page.tsx` if later authorized. | `DOCUMENTATION_STANDARD_ONLY` |
| `AdvisoryHandoffGuide` | What should be organized before a focused professional conversation? | Advisory | Certified handoff component; no submission, no hidden transfer, no representation. | Evidence gaps, assumptions, questions, limitations, and Contact transition. | `/contact#advisory-readiness`. | Inspection-only for first phase. | `SPECIALIZED_FLOW_PRESERVE` |
| `LeadCapture` | How does a lead form capture information where already authorized? | Specialized lead flow | Operational submission behavior exists outside DXT 3 planning scope. | Customer-entered context only inside authorized form behavior. | Existing form routes only. | Inspection-only. | `PROTECTED_BOUNDARY_HOLD` |
| `JourneyCohesionPanel` | How do public routes maintain journey continuity? | Shared presentation component | Existing route continuations are already in use. | Labels, notes, destinations, and route context only. | Existing route links. | Inspection-only. | `DOCUMENTATION_STANDARD_ONLY` |

Inspected component file paths:

- `components/PropertyInquiryForm.tsx`
- `components/AdvisoryHandoffGuide.tsx`
- `components/search/SearchInterface.tsx`
- `components/JourneyCohesionPanel.tsx`
- `components/LeadCapture.tsx`

## Duplicate And Missing Preparation Content

- Duplicate preparation content: Buyer, Seller, Property, Market, City Market, Neighborhood, Advisory, and Contact all contain bounded readiness or handoff language. This is intentional where the customer decision differs and should not be flattened into exact-copy uniformity.
- Missing preparation content: Property has the clearest material gap for DXT 3 because address-level evidence, Property Inquiry, Advisory, and Contact are present, but a concise professional-preparation layer could better help a customer organize conversation priority without changing inquiry behavior.
- Friction risk: The highest-friction point is deciding whether to ask about a specific property, prepare through Advisory, or begin general Contact after reviewing one property.
- Mobile-density risk: Property is already dense, so the first implementation must be compact and route-local.
- Privacy and consent risk: Any automatic transfer from Property, Buyer, Seller, Search, or Market into Advisory or Contact is prohibited.
- Fair-housing risk: Neighborhood and Market professional preparation carry higher steering and suitability risk and should not be first.
- Financial and lending risk: Buyer professional preparation must avoid approval, qualification, affordability, buying power, underwriting, credit, lender ranking, and financial advice.
- Valuation, legal, tax, and investment risk: Seller and Property professional preparation must avoid appraisal equivalence, valuation certainty, pricing strategy, sale prediction, legal advice, tax advice, investment advice, and suitability conclusions.
- Brokerage disclosure remains `EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING`.

## Context Treatment

- Context currently visible: public route, visible listing facts, visible address or slug, visible city, visible neighborhood, visible public evidence category, visible return destination where already explicit, and static route intent.
- Context prohibited from transfer: identity, email, phone, private notes, saved searches, saved properties, planner inputs, financial assumptions, credit information, affordability conclusions, browsing history, inferred preferences, protected characteristics, CRM status, lead score, telemetry-derived context, cookies, localStorage state, confidential information, and unsubmitted form content.
- Restricted context remains restricted to already-certified behavior such as Search return context where already allowlisted and Property identifier treatment inside Property Inquiry.

## Future Runtime Ownership

- First-phase future runtime owner: `app/properties/[id]/page.tsx`.
- Inspection-only first-phase files: `components/PropertyInquiryForm.tsx`, `components/AdvisoryHandoffGuide.tsx`, `app/contact/page.tsx`, Search, Buyer, Seller, Market, City Market, Neighborhood, shared components, forms, APIs, CRM, email, scheduling, persistence, telemetry, navigation, footer, and brokerage disclosure.
- Shared-file risks: `docs/CHAT_START.md`, `package.json`, and `tsconfig.worker.json` are planning/check-registration only in this session.

## Inventory Conclusion

Selected first implementation candidate: `PROPERTY_PROFESSIONAL_PREPARATION`

Secondary planning candidate: `ADVISORY_CONVERSATION_PREPARATION`

Deferred candidate: `PROPERTY_INQUIRY_PREPARATION_QUALITY`

Planning recommendation: `READY_FOR_DXT_3_PLANNING_CERTIFICATION`
