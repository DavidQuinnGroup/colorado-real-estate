# REIE DXT Wave 1E Advisory Handoff Implementation Plan

Status: `DXT_WAVE_1E_ADVISORY_HANDOFF_PLAN_READY`

Planning scope:

- `/contact`
- `components/AdvisoryHandoffGuide.tsx`
- Advisory entry points from certified public journey routes
- Existing property inquiry and city Market strategy-intake dependencies, inspection only

No Advisory runtime modification is authorized by this record.

## Governing Question

The Advisory Handoff experience must answer:

`What should I understand and prepare before beginning a focused professional conversation?`

## Current Advisory Inventory

Current Advisory route model:

- There is no standalone `/advisory` route in the inspected public route set.
- `/contact#advisory-readiness` is the current Advisory destination and preparation layer.
- `app/contact/page.tsx` imports `AdvisoryHandoffGuide` and presents Contact as the public advisory endpoint.
- `components/AdvisoryHandoffGuide.tsx` is the current Advisory presentation owner.
- `components/JourneyCohesionPanel.tsx` supports Contact route selection.

Current Advisory destinations and entry points:

| Source route or surface | Current CTA | Destination | Customer intent | Duplication risk | Proposed future treatment | Protected-boundary concern |
| --- | --- | --- | --- | --- | --- | --- |
| Homepage `/` | Contact-oriented secondary action | `/contact` | Begin a broad conversation | Medium, because Contact and Advisory are not distinguished | SIMPLIFY into Advisory-prepared path when context exists, direct Contact when not | Do not add hidden profiling or persistence |
| Search `/search` | Ask an Advisor / Talk Through Your Search | `/contact` | Discuss search tradeoffs | Medium, duplicates generic Contact | KEEP, but make future copy context-specific and non-coercive | Do not alter Search ranking, filters, API, or map behavior |
| Property pages | Ask About This Property / Request Advisor Review | `#property-contact` or `/contact` | Ask about a specific property | Low, because property inquiry is distinct | KEEP property-specific inquiry on property page; Advisory can explain what to bring | Do not change `/api/property-inquiry`, CRM, or email behavior |
| Buyer `/buy` | Advisory Guidance | `/contact` | Discuss buying preparation | Medium | KEEP and eventually route to Advisory readiness language, not approval language | No qualification, affordability, lender, or underwriting conclusions |
| Seller `/sell` | Advisory Guidance | `/contact` | Discuss seller preparation | Medium | KEEP and eventually route to seller-specific Advisory readiness language | No valuation certainty, appraisal equivalence, or guaranteed-sale claims |
| Market index `/market` | Advisory / Advisory Guidance | `/contact` | Verify market evidence | Medium | KEEP, with evidence-to-conversation framing | No market timing, investment, ranking, or predictive certainty |
| City Market routes | Advisory continuation and LeadCapture context | `/contact` plus city strategy intake | Discuss city-market evidence | High, because strategy intake is also a conversation path | MERGE language around Advisory as preparation and Contact/intake as action | Do not alter LeadCapture, `/api/save-search`, CRM, or saved-search behavior |
| Neighborhood routes | Advisory Readiness / Advisory Guidance | `/contact#advisory-readiness` or `/contact` | Verify place and housing context | Medium | KEEP, anchor to neutral place questions | No steering, demographic suitability, safety, school, or ranking claims |
| Contact `/contact` | Talk Through The Decision / Contact David Quinn Group | `/contact` | Start broad professional conversation | Medium, self-link creates loop | SIMPLIFY future route so Advisory prepares and Contact starts conversation clearly | Do not add fields or submission behavior without authorization |
| Grand Plan / Compare / Home Worth / financing tools | Advisory Guidance or Contact links | `/contact` | Carry planning context into discussion | Medium | KEEP as compact continuations, with explicit no-persistence boundary | Do not transfer saved state automatically |

Current professional boundaries:

- Advisory content states that REIE organizes questions and does not determine legal, tax, lending, appraisal, inspection, engineering, insurance, title, valuation, suitability, or investment outcomes.
- Contact page states that submitting an inquiry is for follow-up routing only and does not automatically create a brokerage relationship.
- Contact page warns customers not to submit confidential negotiating positions, motivation, financial limits, or client-confidential information before relationship/disclosure discussion.
- Brokerage disclosure remains under `EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING`.

Dependency findings:

- Advisory presentation is currently static/presentational.
- Contact route has no generic public Contact submission form.
- Property-specific submission uses `components/PropertyInquiryForm.tsx` and `/api/property-inquiry`.
- City Market strategy intake uses `components/LeadCapture.tsx` and `/api/save-search`.
- CRM task creation, email notification, saved-search persistence, and schema assertions exist behind those form-specific endpoints and remain protected.
- No secrets, customer records, inboxes, or production CRM data were inspected.

Mobile risks:

- The existing Advisory guide is content-rich and can become dense on mobile.
- Two primary-looking actions on the current guide can blur the single dominant action.
- Repeated Contact links may create a loop on `/contact`.
- Future implementation should reduce copy density, preserve heading order, keep one dominant action, and keep compact continuations below the core handoff.

## Future Advisory Hierarchy

1. Advisory orientation
2. Governing question
3. Concise explanation of what Advisory does
4. Decision context the customer should bring
5. Evidence already reviewed in REIE
6. Questions requiring professional discussion
7. What Advisory can and cannot provide
8. Trust, brokerage, legal, financial, valuation, and professional boundaries
9. One dominant conversation-starting action
10. Compact continuations back to relevant REIE decision tools

## Content Disposition Map

| Current content or entry point | Disposition | Future treatment |
| --- | --- | --- |
| Advisory readiness orientation | KEEP | Keep as the first future runtime target, but tighten around the governing question. |
| Preparation themes | SIMPLIFY | Reduce to the few items needed to prepare the first useful conversation. |
| Journey topics | MERGE | Merge into a compact "decision context to bring" section. |
| Verification questions | KEEP | Preserve, but place after evidence context and before boundaries. |
| Evidence and professional boundaries | KEEP | Keep adjacent to reliance points and professional-discussion prompts. |
| Privacy expectations | KEEP | Preserve no persistence, no hidden transfer, no inferred profile, and no automatic data transfer. |
| Detailed preparation examples | PROGRESSIVELY DISCLOSE | Keep available below the first decision viewport so the handoff does not become another dense manual. |
| Contact transition | SIMPLIFY | Make one dominant conversation-starting action. |
| Research continuations | MOVE LOWER | Keep compact links back to Buyer, Seller, Search, Market, Property/Neighborhood where relevant. |
| Generic Contact route copy | MOVE TO DESTINATION PAGE | Contact owns submission expectations; Advisory owns preparation. |
| Urgency-pressure or lead-capture-pressure copy | REMOVE | Do not make Advisory feel coercive or like premature lead capture. |
| Brokerage disclosure | EXTERNAL REVIEW HOLD | Do not rewrite, relocate, shorten, restyle, or reduce prominence. |
| CRM, email, scheduling, lead routing | EXTERNAL REVIEW HOLD | Inspection-only until separately authorized. |

## Dominant Action Recommendation

Future Advisory should use one dominant action:

`Begin A Focused Conversation`

The action may point to the authorized Contact flow or anchor only after runtime implementation is separately authorized. It must not create a new form, new lead route, new CRM behavior, new email behavior, new scheduling behavior, or hidden customer profile in the Advisory phase.

## Context Requirements

Allowed visible context:

- Source journey label such as buyer, seller, property, market, city market, neighborhood, search, compare, or grand plan.
- A visible URL query or anchor may identify broad source context, for example `?context=buyer` or `#advisory-readiness`, only if separately authorized.
- User-entered optional context may be provided directly by the customer in the Contact flow.

Not allowed:

- Automatic transfer of financial assumptions, notes, saved-search criteria, selected properties, hidden scores, protected characteristics, confidential motivations, customer identity, or persistent decision history.
- localStorage, cookies, telemetry, analytics expansion, CRM expansion, or inferred profiles.

## Trust And Professional Boundaries

The Advisory plan prohibits:

- guaranteed outcomes;
- representation claims before an agreement exists;
- legal advice;
- tax advice;
- lending approval or qualification;
- appraisal or valuation certainty;
- investment recommendations;
- suitability conclusions;
- fair-housing steering;
- AI pretending to be a licensed professional;
- undisclosed lead routing;
- automatic customer profiling;
- persistent decision histories;
- CRM expansion;
- automated outreach;
- new scheduling behavior;
- new email behavior;
- provider ranking.

Brokerage disclosure remains on hold:

`EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING`

## Implementation Phases

1. Advisory Handoff foundation
   - Recommended first runtime target: `components/AdvisoryHandoffGuide.tsx` as used by `app/contact/page.tsx`.
   - Goal: clarify Advisory as preparation before conversation and reduce mobile density.
   - Runtime not authorized by this planning session.
2. Contact Decision Flow simplification
   - Target after Advisory certification: `app/contact/page.tsx` and any directly supporting Contact presentation.
   - Goal: make Contact the simplest appropriate way to begin the conversation without changing submission backends.
3. Cross-route CTA reconciliation
   - Inspect-only until separately authorized for each source route.
   - Goal: reduce duplicate generic Contact CTAs and make source-specific intent clearer.
4. Production certification
   - Browser, responsive, accessibility, protected-copy, route, and regression certification.
5. Documentation closure
   - Separate closure record after production certification.

## Proposed Runtime Ownership

Primary future runtime ownership:

- `components/AdvisoryHandoffGuide.tsx`
- `app/contact/page.tsx` only where the route hosts Advisory and Contact together

Inspection-only shared or protected zones:

- `components/PropertyInquiryForm.tsx`
- `components/LeadCapture.tsx`
- `app/api/property-inquiry/route.ts`
- `app/api/save-search/route.ts`
- CRM adapters and admin CRM routes
- email notification utilities
- scheduling integrations, if any are later found
- navigation and footer
- shared CTA components
- global CSS
- brokerage disclosure components

Shared-file stop conditions:

- Any required CRM, email, scheduling, persistence, telemetry, analytics, API, schema, navigation, footer, Search, map, provider, or brokerage-disclosure change must stop for separate authorization.
- Any proposed shared Advisory/Contact runtime abstraction must stop for architecture review.

## Deterministic Certification Criteria

Future Advisory implementation certification must verify:

- governing question is present;
- required hierarchy is present;
- one dominant conversation-starting action is clear;
- compact continuations return to REIE decision tools;
- no runtime schema or shared abstraction was introduced;
- no Contact fields or submission behavior changed;
- no CRM, email, scheduling, persistence, telemetry, analytics, provider, AI, or API behavior changed;
- brokerage hold remains documented;
- protected professional boundaries remain present;
- mobile, tablet, and desktop layouts preserve the handoff sequence;
- keyboard focus and accessible headings remain usable;
- production regression covers Homepage, Search, Property, Buyer, Seller, Market, City Market, Neighborhood, Contact, brokerage disclosures, and Search API.

## Accepted Limitations

- Advisory currently shares the `/contact` destination rather than a standalone route.
- The repository contains existing form-specific persistence and CRM task behavior behind property inquiry and strategy-intake endpoints; this plan does not modify or expand those systems.
- Direct Contact entry must remain supported for customers arriving without prior REIE context.
