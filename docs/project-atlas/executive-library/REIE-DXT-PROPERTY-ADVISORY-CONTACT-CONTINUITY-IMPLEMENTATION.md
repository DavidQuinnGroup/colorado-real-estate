# REIE DXT Property -> Advisory -> Contact Continuity Implementation

Status: `DXT_PROPERTY_ADVISORY_CONTACT_CONTINUITY_IMPLEMENTED_LOCAL_COMMIT_ONLY`

Implementation date: 2026-08-03

Baseline: `d319d48e7ee166214308ac3d7ca919f8ccdfc1c5`

## Objective

This implementation clarifies the next professional step from the Property page without changing Property inquiry, Advisory, Contact, Search, APIs, forms, CRM, email, scheduling, persistence, telemetry, navigation, footer, or brokerage disclosure.

Customer question:

> After evaluating this property, what should I prepare before beginning a property-specific professional conversation?

## Authorized Runtime Scope

Runtime file changed:

- `app/properties/[id]/page.tsx`

Inspection-only files preserved:

- `PropertyInquiryForm`
- Property inquiry APIs
- `components/AdvisoryHandoffGuide.tsx`
- `app/contact/page.tsx`
- Search
- Buyer
- Seller
- Market
- Neighborhood
- shared runtime
- navigation
- footer
- brokerage disclosure

## Current-State Findings

Before implementation, the Property page already included:

- a dominant `Ask a Property Question` path to `#property-contact`;
- route-local Search return continuity;
- Market context and Seller review continuations;
- professional, listing-source, valuation, financing, and verification boundaries;
- the protected `PropertyInquiryForm` mounted at `#property-contact`;
- general Advisory and Contact experiences available through `/contact`.

The main continuity gap was not missing submission behavior. The gap was customer-facing explanation: the page did not clearly separate when to ask a property-specific question, when to prepare through Advisory, and when general Contact is appropriate.

## Implementation Summary

The Property page now includes a route-local professional handoff section that:

- establishes the handoff question;
- distinguishes property-specific inquiry, Advisory preparation, and general Contact;
- preserves Property inquiry as the dominant action for this decision stage;
- presents Advisory and Contact as secondary continuations;
- states that no property details are transferred to Advisory or Contact automatically;
- reinforces professional, privacy, valuation, legal, tax, lending, suitability, and brokerage boundaries.

The final priority model is:

1. Property inquiry remains the dominant action for property-specific questions.
2. Advisory is secondary for conversation preparation.
3. Contact is subordinate for broader general conversation starts.

## Property Inquiry Treatment

Property inquiry remains unchanged.

The implementation does not modify:

- `PropertyInquiryForm`;
- fields;
- required or optional status;
- validation;
- consent;
- privacy copy;
- `/api/property-inquiry`;
- CRM task behavior;
- email notification behavior;
- success state;
- failure state;
- loading state;
- unsubscribe behavior;
- customer-data handling.

No test inquiry was submitted.

## Advisory Treatment

Advisory remains a preparation layer.

The Property page links to `/contact#advisory-readiness` without property parameters, hidden context, cookies, localStorage, session state, customer profiles, or automatic transfer.

The implementation does not modify `components/AdvisoryHandoffGuide.tsx`.

## Contact Treatment

Contact remains a general conversation-starting destination.

The Property page links to `/contact#contact-route-choice` without turning Contact into a property-specific intake flow.

The implementation does not modify `app/contact/page.tsx`.

## Context Treatment

No property context is transferred automatically.

The implementation does not add:

- property slug or address to Advisory or Contact URLs;
- hidden query parameters;
- form prefilling;
- cookies;
- localStorage;
- session state;
- customer profiles;
- planner input transfer;
- Search history transfer;
- inquiry-content transfer;
- telemetry-derived context.

## Protected Boundary Findings

No protected system was modified.

Brokerage disclosure remains under `EXTERNAL_COMPASS_MARKETING_REVIEW_PENDING`.

## Local Certification Criteria

Local certification must verify:

- exactly one H1 remains on the Property route;
- Property evaluation hierarchy remains intact;
- Property inquiry is distinguishable and dominant for property-specific questions;
- Advisory preparation is distinguishable and secondary;
- general Contact is distinguishable and subordinate;
- Search return continuity remains intact;
- direct Property entry remains understandable;
- canonical metadata remains clean;
- no hidden property context is transferred;
- PropertyInquiryForm, Advisory, Contact, Search, APIs, CRM, email, scheduling, persistence, telemetry, navigation, footer, and brokerage disclosure remain unchanged;
- responsive layouts have no document-level horizontal overflow;
- links and controls remain keyboard focusable.

## Implementation Result

Certification recommendation:

`REIE_DXT_PROPERTY_ADVISORY_CONTACT_CONTINUITY_LOCAL_CERTIFICATION_READY`
