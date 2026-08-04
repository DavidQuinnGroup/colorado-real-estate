# PROJECT ATLAS / REIE DXT 3 Advisory Conversation Preparation Implementation

Status: `DXT_3_ADVISORY_CONVERSATION_PREPARATION_IMPLEMENTED_LOCAL_COMMIT_ONLY`

Certification recommendation: `READY_FOR_DXT_3_ADVISORY_CONVERSATION_PREPARATION_LOCAL_CERTIFICATION`

Runtime authorization: `components/AdvisoryHandoffGuide.tsx`

Push authorization: `false`

Deployment authorization: `false`

Production certification authorization: `false`

## Objective

Implement bounded Advisory Conversation Preparation inside the existing Advisory presentation component. The implementation deepens Advisory from a general handoff into a concise professional-preparation layer that organizes existing public evidence, evidence still needed, assumptions, unknowns, questions to verify, static conversation priorities, pathway choice, REIE limits, privacy boundaries, and professional boundaries.

The governing question remains:

`What should I understand and prepare before beginning a focused professional conversation?`

## Current-State Finding

Advisory already prepared customers before Contact through `components/AdvisoryHandoffGuide.tsx`, `/contact#advisory-readiness`, and `#advisory-contact-transition`. The material gap was not route ownership or Contact behavior; it was that the preparation hierarchy could be made more explicit without adding intake, state, hidden context, or submission behavior.

## Implementation Summary

The bounded implementation adds one static Advisory Conversation Preparation frame with:

- decision being prepared;
- evidence reviewed or available;
- evidence still needed;
- assumptions;
- unknowns;
- questions to verify;
- static conversation priorities;
- pathway distinction among Advisory, Contact, and Property Inquiry;
- what REIE cannot determine;
- privacy, consent, advice, representation, and brokerage boundaries;
- one dominant Advisory action.

The implementation is presentational only and customer-readable. It does not create a dashboard, profile, form, intake flow, recommendation model, score, ranking, hidden context, or automatic route-context transfer.

## Evidence Treatment

Evidence is framed as visible public context available in the REIE experience. The implementation does not claim that a customer personally reviewed evidence. It uses neutral categories:

- evidence reviewed or available;
- evidence still needed;
- assumption;
- unknown;
- question to verify;
- conversation priority;
- professional review;
- next professional step.

No new data model was created.

## Question And Priority Treatment

Questions are organized for verification but not answered. Conversation priorities are static, visible categories only:

- Property facts and condition;
- Search and comparison questions;
- Financing assumptions;
- Market evidence;
- Seller preparation;
- title, HOA, insurance, inspection, or contract questions;
- general professional preparation.

No selection state, persistence, URL parameter, form prefill, CRM classification, lead score, telemetry event, customer profile, hidden prioritization, suitability conclusion, or recommendation was introduced.

## Pathway Hierarchy

Advisory prepares.

Contact begins.

Property Inquiry stays specialized.

The implementation preserves:

- Advisory as focused-conversation preparation;
- Contact as general conversation initiation;
- Property Inquiry as the specialized Property-specific inquiry path;
- existing Contact route ownership;
- existing Property Inquiry fields, consent, submission, API, CRM, and email behavior.

## Runtime And Protected-System Findings

- Contact host changed: `false`
- PropertyInquiryForm changed: `false`
- LeadCapture changed: `false`
- Forms or APIs changed: `false`
- CRM changed: `false`
- Email changed: `false`
- Scheduling changed: `false`
- Persistence or telemetry changed: `false`
- URL-context expansion added: `false`
- Form prefill added: `false`
- Hidden context added: `false`
- Customer profile added: `false`
- Shared runtime component or schema added: `false`
- Navigation changed: `false`
- Footer changed: `false`
- Brokerage disclosure changed: `false`

Brokerage disclosure remains `EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING`.

## Boundary Findings

The implementation organizes questions only. It does not provide:

- legal advice;
- tax advice;
- lending advice;
- affordability or qualification conclusions;
- appraisal or valuation advice;
- pricing strategy;
- investment advice;
- suitability conclusions;
- fair-housing steering;
- representation claims;
- fiduciary claims;
- promised outcome claims;
- AI impersonation of a licensed professional.

## Direct-Entry And Anchor Findings

The implementation remains understandable when `/contact`, `/contact#advisory-readiness`, `/contact#advisory-contact-transition`, or `/contact#contact-route-choice` is opened directly. No prior REIE state is required.

Preserved anchors and destinations:

- `#advisory-readiness`
- `#advisory-contact-transition`
- `/contact#contact-route-choice`
- existing Contact route behavior

## Deterministic Validation Contract

The implementation check verifies:

- `data-testid="dxt-3-advisory-conversation-preparation"` exists;
- governing question is preserved;
- required hierarchy terms exist;
- pathway hierarchy exists;
- one dominant action remains;
- Contact host change is false;
- Property Inquiry change is false;
- form, API, URL context, form prefill, persistence, telemetry, CRM, email, hidden context, and customer profile flags remain false;
- implementation record exists;
- `docs/CHAT_START.md` records the local certification gate;
- `package.json` and `tsconfig.worker.json` register the check.

## Local Certification Recommendation

`READY_FOR_DXT_3_ADVISORY_CONVERSATION_PREPARATION_LOCAL_CERTIFICATION`

## Next Gate

`READY_FOR_REIE_DXT_3_ADVISORY_CONVERSATION_PREPARATION_LOCAL_CERTIFICATION_AND_PUSH_AUTHORIZATION`

Do not push, deploy, production-certify, or begin the next runtime phase without separate authorization.
