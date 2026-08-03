# REIE DXT Wave 1E Contact Decision Flow Implementation

Status: `DXT_WAVE_1E_CONTACT_DECISION_FLOW_IMPLEMENTED_LOCAL_COMMIT_ONLY`

Implementation scope:

- Runtime: `app/contact/page.tsx`
- Advisory runtime: unchanged
- Specialized forms: unchanged
- APIs, CRM, email, scheduling, persistence, telemetry, analytics, Search, maps, navigation, footer, and brokerage disclosure: unchanged

No push, deployment, or production certification is authorized by this record.

## Objective

The Contact Decision Flow Foundation transforms `/contact` into a concise conversation-starting experience answering:

`What is the simplest appropriate way to begin this conversation?`

Contact begins the conversation. Advisory prepares the conversation.

## Runtime Ownership

Runtime file changed:

- `app/contact/page.tsx`

Runtime files intentionally unchanged:

- `components/AdvisoryHandoffGuide.tsx`
- `components/PropertyInquiryForm.tsx`
- `components/LeadCapture.tsx`
- `components/JourneyCohesionPanel.tsx`
- `app/api/property-inquiry/route.ts`
- `app/api/save-search/route.ts`
- Buyer, Seller, Market, Neighborhood, Search, property, navigation, footer, API, CRM, email, scheduling, persistence, telemetry, analytics, and brokerage disclosure files

The existing `/contact` canonical remains unchanged.

## Implemented Hierarchy

1. Contact orientation
2. Governing question
3. Conversation promise
4. Decision context explanation
5. Minimum required information explanation
6. Optional context
7. What happens next
8. Privacy, brokerage, and professional boundaries
9. One dominant conversation action
10. Alternatives for customers not ready

## Conversation Flow

The implementation adds a bounded Contact decision-flow section before the existing Advisory guide.

The section helps customers choose whether their question belongs in:

- a property-specific inquiry path;
- a Market or Neighborhood evidence path;
- Buyer, Seller, or Advisory preparation;
- the existing Contact route for general planning, privacy, accessibility, and public contact questions.

The implementation does not create a generic Contact form, add fields, submit customer information, change form behavior, or transfer hidden context.

## Dominant Action

Dominant Contact action:

`Choose The Starting Point`

Destination:

- `#contact-route-choice`

Rationale:

- the destination is a non-mutating in-page route-choice section;
- it preserves direct `/contact` entry;
- it avoids creating or changing any form;
- it does not trigger submission, CRM, email, scheduling, persistence, telemetry, analytics, or API behavior;
- it lets customers continue only when they have selected the appropriate existing path.

## Advisory Integration

The existing `AdvisoryHandoffGuide` remains hosted on `/contact` after the Contact decision-flow orientation.

Preserved Advisory anchors:

- `/contact#advisory-readiness`
- `#advisory-contact-transition`

The Contact page now makes the division explicit:

- Advisory prepares the conversation.
- Contact begins the conversation.

## Protected Boundary Findings

The implementation states that Contact does not itself establish:

- representation;
- legal advice;
- tax advice;
- lending approval;
- qualification;
- affordability;
- appraisal;
- valuation certainty;
- pricing certainty;
- outcome certainty;
- investment recommendations;
- suitability conclusions;
- fair-housing or protected-class guidance;
- AI advisory;
- provider rankings;
- response-time promises.

The implementation also states that Contact does not introduce persistence, telemetry, hidden context, CRM behavior, email behavior, scheduling behavior, or form submission.

Brokerage disclosure remains under:

`EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING`

## Specialized Flow Preservation

No specialized flow was modified:

- PropertyInquiryForm remains separate.
- LeadCapture remains separate.
- Property inquiry API behavior remains unchanged.
- Save-search API behavior remains unchanged.
- City Market strategy intake remains unchanged.
- CRM task creation remains unchanged.
- Email notification behavior remains unchanged.
- Scheduling behavior remains unchanged.
- Consent and privacy behavior remain unchanged.

No form submission, test lead creation, CRM mutation, email sending, scheduling mutation, secret access, customer-record access, or production-data inspection was performed.

## Deterministic Validation

New implementation check:

`npm run check:dxt-wave-1e-contact-decision-flow-implementation`

The check verifies:

- governing question;
- implemented Contact hierarchy;
- one dominant Contact action;
- in-page non-mutating route choice;
- Advisory preservation;
- direct Contact entry;
- no generic form;
- no new fields;
- no submission behavior;
- no API, CRM, email, scheduling, persistence, telemetry, analytics, or hidden-context behavior;
- documentation and registry entries.

## Local Certification Recommendation

Recommended local certification status:

`READY_FOR_CONTACT_LOCAL_CERTIFICATION`

Recommended next gate:

`READY_FOR_REIE_DXT_WAVE_1E_CONTACT_DECISION_FLOW_LOCAL_CERTIFICATION_AND_PUSH_AUTHORIZATION`
