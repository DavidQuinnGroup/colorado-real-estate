# REIE DXT Wave 1E Contact Decision Flow Implementation Plan

Status: `DXT_WAVE_1E_CONTACT_DECISION_FLOW_PLAN_READY`

Planning scope:

- `/contact`
- `app/contact/page.tsx`
- `components/AdvisoryHandoffGuide.tsx`
- `components/JourneyCohesionPanel.tsx`
- Existing form-specific submission routes and components, inspection only

No Contact runtime modification is authorized by this record.

## Governing Question

The Contact Decision Flow experience must answer:

`What is the simplest appropriate way to begin this conversation?`

## Current Contact Inventory

Route and canonical:

- `/contact`
- Runtime owner: `app/contact/page.tsx`
- Canonical: `https://davidquinngroup.com/contact`
- Current H1: `Contact`

Directly supporting presentation files:

- `components/AdvisoryHandoffGuide.tsx`
- `components/JourneyCohesionPanel.tsx`
- `components/PublicTrustPage.tsx`
- `lib/publicTrust.ts`

Current Contact route behavior:

- Contact page is informational and routes customers to existing workflows.
- There is no generic `/contact` form on the Contact page.
- Property-specific inquiries are directed to property pages.
- Market strategy requests are directed to city Market strategy-intake forms.
- Privacy and accessibility requests currently route through Contact and property-inquiry workflows until a branded public contact email is operational.
- Public phone, office address, and branded public contact email are not published until brokerage-approved values are confirmed.

Submission behavior inspected, read-only:

- `components/PropertyInquiryForm.tsx` posts to `/api/property-inquiry`.
- `components/LeadCapture.tsx` posts to `/api/save-search`.
- `/api/property-inquiry` can create user, interaction, lead interaction, CRM task, and high-priority notification attempt when configured.
- `/api/save-search` can create saved search, user interaction, optional North Star records, and CRM task.
- No form submission, test lead creation, CRM mutation, email sending, scheduling mutation, secret access, customer data access, or production-data inspection was performed.

CRM, email, scheduling dependencies:

- CRM persistence exists through Prisma-backed public endpoints and admin CRM routes.
- Property inquiry email notification is gated by `PROPERTY_INQUIRY_NOTIFY_TO`, `REIE_INTERNAL_EMAIL`, `RESEND_API_KEY`, and dry-run behavior.
- Saved-search and alert notification checks exist.
- No scheduling integration was found as a public Contact dependency in inspected files.
- Existing submission, CRM, email, scheduling, consent, and privacy behavior must remain unchanged until separately authorized.

Consent and privacy treatment:

- Contact page links to Privacy Notice and Terms of Use.
- Public form notices state email requirement, optional fields, follow-up routing, brokerage-relationship limits, and confidential-information boundaries.
- `lib/publicTrust.ts` records unresolved public contact email, phone, office address, brokerage, retention, privacy, and approval items.
- Brokerage disclosure remains under `EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING`.

Current CTA entry points:

- Global navigation and footer include Contact.
- Homepage, About, Search, Buyer, Seller, Market, City Market, Neighborhood, Grand Plan, Compare, Home Worth, Buyer financing, seller readiness, and maps surfaces link to `/contact` or `/contact#advisory-readiness`.
- Property pages primarily use in-page property inquiry at `#property-contact`.
- City Market pages include LeadCapture strategy intake.

Current success, failure, loading, and validation states:

- Contact page has no generic submission states.
- Property inquiry states: idle, submitting, success, error; email validation is required; notes are capped at 600 characters; name and phone are optional.
- City Market strategy intake states: idle, submitting, success, error; email validation is required; notes are capped at 500 characters; strategy goal and timeline are button selections.
- Existing accessible error messaging uses `aria-live` on property inquiry and LeadCapture error states.

Mobile and accessibility risks:

- Contact currently combines Advisory, public trust, routing, and form notices, which can feel like a governance page rather than a low-friction conversation start.
- Customers may not immediately know whether to use Contact, property inquiry, or city Market intake.
- The future flow should avoid adding fields and should clarify route choice before asking for information.
- Any future form work must preserve labels, visible focus, keyboard operation, error state, success state, and mobile stacking.

## Future Contact Hierarchy

1. Contact orientation
2. Governing question
3. Concise conversation promise
4. Decision-context selection or recognition
5. Minimum necessary customer information
6. Optional context the customer may provide
7. What happens after submission
8. Consent, privacy, brokerage, and professional boundaries
9. One dominant submit or conversation-starting action
10. Compact alternatives for customers not ready to submit

## Field Disposition Assessment

| Current field or context | Current label | Requirement status | Purpose | Downstream dependency | Customer-friction risk | Privacy or compliance concern | Disposition | Future treatment |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Contact page generic form | None | Not present | Contact route currently routes to workflows | None | Low | Avoid inventing a new collection surface prematurely | KEEP | Preserve no generic form until separately authorized |
| Repeated generic Contact CTAs | Contact / Advisory Guidance / Ask an Advisor | Varies by route | Move customers toward conversation | `/contact` or `/contact#advisory-readiness` | Medium | Can blur whether the customer should prepare or submit | DUPLICATIVE | Reconcile labels after Advisory and Contact are certified |
| Property inquiry name | Name | Optional | Identify customer for property follow-up | `/api/property-inquiry`, User update | Low | Personal data | OPTIONAL_AND_USEFUL | Keep optional if property inquiry remains separate |
| Property inquiry phone | Phone | Optional | Alternate follow-up method | `/api/property-inquiry`, CRM metadata | Medium | Personal data and contact preference sensitivity | OPTIONAL_AND_USEFUL | Keep optional; do not require |
| Property inquiry email | Email address | Required | Required follow-up channel and user identity | `/api/property-inquiry`, User, CRM, notification reply-to | Medium | Personal data; must maintain consent notice | REQUIRED_AND_JUSTIFIED | Email may remain the minimum required contact field |
| Property inquiry timing | Timing / Intent | Selected option | Understand urgency and follow-up type | CRM priority and notification-required logic | Medium | Can imply lead prioritization | HIGH_FRICTION | Keep in property flow; future Contact should not overemphasize urgency |
| Property inquiry notes | Notes optional but helpful | Optional | Capture property-specific questions | CRM metadata, notification content | Medium | Confidential information risk | OPTIONAL_AND_USEFUL | Preserve warning not to submit confidential information |
| City Market strategy goal | Primary Strategy | Selected option | Identify broad strategy context | `/api/save-search`, CRM metadata | Medium | Could feel like qualification if misframed | OPTIONAL_AND_USEFUL | Future Contact may offer broad context without hidden scoring |
| City Market timeline | Timeline | Selected option | Helps follow-up timing | CRM priority and lead temperature | Medium | Can imply urgency pressure | HIGH_FRICTION | Keep optional/contextual; avoid response-time promises |
| City Market email | Secure email for strategy delivery | Required | Required delivery/follow-up channel | `/api/save-search`, User, SavedSearch, CRM | Medium | Personal data | REQUIRED_AND_JUSTIFIED | Email remains justified where submission exists |
| City Market notes | Brief Context | Optional | Explain market question | CRM metadata | Medium | Confidential information risk | OPTIONAL_AND_USEFUL | Keep optional and bounded |
| Saved North Stars | Implicit selected lifestyle anchors | Optional when present | Strategy-intake context | `/api/save-search`, NorthStar records | High | Can imply profile or preference history | PREMATURE | Do not carry automatically into Contact without separate authorization |
| Financial limits or affordability details | Not requested by Contact | Not present | Not needed for initial conversation | None authorized | High | Sensitive financial data | REMOVE_FROM_FUTURE_FLOW | Do not add |
| Protected-class or demographic questions | Not present | Not present | Not permitted | None | High | Fair-housing risk | PROTECTED_OR_SENSITIVE | Prohibit |
| Marketing consent | Not prechecked | Not present | Not authorized | None | High | Consent risk | EXTERNAL_REVIEW_HOLD | Do not add hidden or prechecked consent |
| Brokerage disclosure copy | Existing trust pages/footer | Required governance | Boundary and disclosure | Brokerage/counsel review | Medium | External review pending | EXTERNAL_REVIEW_HOLD | Do not alter |

## Minimum-Information Strategy

Future Contact should request only the minimum information needed for follow-up:

- email as the only generally required contact field if a Contact form is later authorized;
- optional name;
- optional phone;
- optional broad decision context;
- optional notes with clear warning not to submit confidential negotiating positions, financial limits, protected information, or client-confidential details before the applicable relationship/disclosures are discussed.

The plan must not authorize affordability questions, credit questions, protected-class questions, demographic targeting, hidden consent, prechecked marketing consent, lead scoring, lead prioritization, or response-time guarantees.

## Direct-Entry Behavior

Customers arriving directly at `/contact` must be able to understand the page without prior REIE journey state. Direct entry should:

- explain Contact as the simplest appropriate way to begin a focused conversation;
- offer broad context choices without requiring prior journey history;
- preserve alternatives for customers who should return to Search, Property, Market, Buyer, Seller, or Advisory preparation first.

## Context-Aware Behavior Without Persistence

Future context-aware Contact may use visible, customer-understandable context only:

- source route label;
- broad decision category;
- explicit link text or query string, if separately authorized;
- customer-entered optional notes.

It must not automatically carry:

- saved-search criteria;
- property favorites;
- financial assumptions;
- planner inputs;
- protected characteristics;
- hidden lead scores;
- inferred readiness;
- customer history;
- confidential notes;
- cookies, localStorage, telemetry, or CRM-derived context.

## Consent, Privacy, And Professional Boundaries

Contact protected boundaries prohibit:

- new CRM behavior;
- new email routing;
- new automated outreach;
- new text messaging;
- new scheduling integration;
- new lead scoring;
- new lead prioritization;
- persistent customer profiles;
- localStorage or cookie-based decision history;
- telemetry or analytics expansion;
- qualification logic;
- affordability questions;
- credit questions;
- protected-class questions;
- demographic targeting;
- hidden consent;
- prechecked marketing consent;
- representation claims;
- response-time guarantees;
- provider expansion.

Existing submission, CRM, email, scheduling, consent, and privacy behavior must remain unchanged until separately authorized.

## Success And Failure Requirements

If a future Contact form is authorized:

- success state must explain what was received and what happens next without guaranteeing response time or representation;
- failure state must be visible, specific, and recoverable;
- loading state must prevent duplicate submission and remain screen-reader understandable;
- validation must identify missing or invalid required fields without exposing sensitive data;
- consent and privacy links must remain visible before submission;
- no production test lead may be created except through an explicitly non-production fixture.

## Implementation Phases

1. Advisory Handoff foundation
   - Clarify preparation before Contact.
2. Contact Decision Flow simplification
   - Recommended first Contact runtime scope: `app/contact/page.tsx`, with `components/AdvisoryHandoffGuide.tsx` only if separately authorized by the Advisory phase.
   - Keep `/api/property-inquiry` and `/api/save-search` unchanged.
3. Cross-route CTA reconciliation
   - Align CTAs with source intent after Advisory and Contact are certified.
4. Production certification
   - Verify route/canonical, responsive, accessibility, protected-copy, no form-backend regression, and no brokerage-disclosure change.
5. Documentation closure
   - Close only after production certification.

## Proposed Runtime Ownership

Primary future runtime ownership:

- `app/contact/page.tsx`
- Contact-specific presentation in `components/AdvisoryHandoffGuide.tsx` only where separately authorized

Protected dependency zones:

- `components/PropertyInquiryForm.tsx`
- `components/LeadCapture.tsx`
- `app/api/property-inquiry/route.ts`
- `app/api/save-search/route.ts`
- `lib/email/sendPropertyInquiryNotification.ts`
- CRM adapters and admin CRM routes
- Prisma schema and migrations
- notification, unsubscribe, alert, and scheduling systems
- public trust, privacy, terms, fair housing, and brokerage disclosure files except for separately authorized documentation updates

## Deterministic Certification Criteria

Future Contact implementation certification must verify:

- governing question is present;
- required hierarchy is present;
- field assessment remains reflected in implementation;
- minimum-information strategy is preserved;
- direct-entry behavior is supported;
- context-aware behavior does not use persistence or hidden transfer;
- consent and privacy boundaries are visible;
- CRM, email, scheduling, API, persistence, telemetry, analytics, lead scoring, lead prioritization, and provider behavior remain unchanged;
- no protected-class, demographic, affordability, credit, qualification, suitability, representation, or response-time guarantee language is introduced;
- one dominant submit or conversation-starting action is clear;
- alternatives exist for customers not ready to submit;
- keyboard, focus, labels, errors, success state, and mobile stacking are usable;
- brokerage hold remains preserved.

## Accepted Limitations

- `/contact` currently does not collect a generic Contact submission.
- Existing property and city Market workflows already persist form-specific submissions and can create CRM tasks; this plan does not expand or alter that behavior.
- Public phone, office address, and branded public email remain unavailable pending external approval.
