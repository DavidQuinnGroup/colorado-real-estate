# REIE DXT Property -> Advisory -> Contact Continuity Implementation Plan

Status: `PROPERTY_ADVISORY_CONTACT_CONTINUITY_PLAN_READY`

Planning date: 2026-08-03

## Objective

This plan prepares the next continuity phase without modifying Property, Advisory, or Contact runtime.

Future journey question:

> After evaluating this property, what should I prepare before beginning a property-specific professional conversation?

## Current CTA And Destination Assessment

| Source | Current continuation | Destination | Customer intent | Finding | Future disposition |
| --- | --- | --- | --- | --- | --- |
| Property hero and decision summary | Search return / Back to Search | Search | Resume comparison | Search return continuity is now bounded to existing visible URL context | KEEP |
| Property decision workspace | Ask a Property Question | `#property-contact` | Ask about the specific property | Correct owner for property-specific information | KEEP |
| Property decision workspace | Market Context | City Market or Search fallback | Compare broader area context | Correct when evidence remains market-oriented | KEEP |
| Property page related links | Related property and authority links | property, market, external authority destinations | Continue evidence review | Useful after Property evaluation | KEEP |
| Advisory handoff on Contact | Begin A Focused Conversation | existing Contact transition | Prepare professional conversation | Useful for general professional conversation preparation | KEEP |
| Contact decision flow | Choose The Starting Point | Contact route choice section | Begin a conversation | Correct owner for general conversation start | KEEP |

## Responsibility Model

- Property evaluates the specific property.
- Property inquiry remains the property-specific information path.
- Advisory prepares the professional conversation.
- Contact begins a general conversation.

The future phase must not merge Property inquiry into generic Contact, make Advisory a form, or make Contact property-specific through hidden context.

## Dominant-Action Recommendation

Future Property continuity should preserve separate decision stages:

1. While the customer is still comparing properties, Search return should remain the dominant continuation.
2. When the customer has a property-specific question, `Ask a Property Question` should remain the dominant action.
3. When the customer needs preparation before a broader professional conversation, Advisory should be the preparation layer.
4. Generic Contact should remain available for direct conversation starts, not as a hidden property-specific intake replacement.

## Advisory Treatment

Future Advisory continuity may explain what to prepare after evaluating a property:

- the decision the customer is trying to make;
- the public property facts reviewed;
- assumptions that remain unverified;
- questions requiring professional judgment;
- limits of public listing evidence.

Advisory must remain presentational and must not become a Property inquiry form.

## Contact Treatment

Future Contact continuity must preserve direct `/contact` entry and avoid hidden property context.

Contact may support visible, optional context only if separately authorized and if the context remains:

- human-readable;
- non-sensitive;
- safe in copied URLs;
- removable or ignorable;
- not required for route rendering.

## Property Inquiry Treatment

`PropertyInquiryForm` remains the route-owned path for property-specific questions.

Future work must not change:

- fields;
- submission behavior;
- `/api/property-inquiry`;
- CRM;
- email;
- scheduling;
- consent;
- privacy;
- notification queues.

## Context Classification

| Context category | Classification | Rationale |
| --- | --- | --- |
| property slug visible in the current route | SAFE_VISIBLE_CONTEXT | It is already public route context. |
| property address rendered on the Property page | SAFE_VISIBLE_CONTEXT | It is already visible public listing context. |
| visible source label such as Property evaluation | SAFE_VISIBLE_CONTEXT | It is static orientation copy. |
| optional return destination | SAFE_ONLY_IF_ALREADY_IN_URL | It must not create hidden journey state. |
| inquiry form content | PROHIBITED_AUTOMATIC_TRANSFER | It may contain private customer information. |
| identity, email, phone, private notes | PROHIBITED_AUTOMATIC_TRANSFER | These require explicit customer submission and consent boundaries. |
| affordability, financing assumptions, protected characteristics | PROHIBITED_AUTOMATIC_TRANSFER | High-risk sensitive or protected context. |
| browsing history, saved properties, inferred preferences | PROHIBITED_AUTOMATIC_TRANSFER | Hidden profiling and persistence are unauthorized. |
| CRM status, lead score, telemetry-derived context | PROHIBITED_AUTOMATIC_TRANSFER | Protected operational systems and hidden state are unauthorized. |

## Prohibited Transfer

The future phase must prohibit automatic transfer of:

- identity;
- email;
- phone;
- private notes;
- affordability;
- financing assumptions;
- inquiry form content;
- saved properties;
- property-view history;
- browsing history;
- inferred preferences;
- protected characteristics;
- CRM status;
- lead score;
- telemetry-derived context;
- confidential information.

## Direct-Entry Requirements

Property, Advisory, and Contact must each remain understandable when entered directly.

No route may require prior context, browser history, persisted state, hidden customer data, or a customer profile to render correctly.

Malformed, unsupported, missing, or stale context must be ignored or treated as optional orientation only.

## Proposed Implementation Phases

1. Certify Search -> Property -> Search Return Continuity.
2. Plan and certify the Property -> Advisory -> Contact responsibility model.
3. Implement a bounded Property-to-Advisory preparation continuation if authorized.
4. Certify that Contact direct entry and Property inquiry remain unchanged.
5. Consider route-specific CTA reconciliation only after Property/Advisory/Contact continuity is certified.

## Proposed File Ownership

Future primary runtime candidates:

- `app/properties/[id]/page.tsx`
- `components/AdvisoryHandoffGuide.tsx`, only if separately authorized for Advisory preparation copy
- `app/contact/page.tsx`, only if separately authorized for Contact visible-context treatment

Inspection-only protected zones:

- `PropertyInquiryForm`
- `LeadCapture`
- submission APIs
- CRM adapters
- email integrations
- scheduling integrations
- persistence
- telemetry
- Search
- navigation
- footer
- brokerage disclosure

## Shared-File Risks

Stop and report if future work appears to require:

- shared CTA components;
- shared runtime continuity abstractions;
- URL context categories outside the continuity contract;
- Contact form changes;
- Property inquiry changes;
- API, CRM, email, scheduling, persistence, telemetry, analytics, navigation, footer, or brokerage-disclosure changes.

## Deterministic Certification Criteria

Future certification must verify:

- Property, Advisory, Contact, and Property inquiry responsibilities remain distinct;
- Property-specific inquiry remains separate from generic Contact;
- Advisory remains preparation, not a form;
- Contact remains direct-entry compatible;
- no hidden context transfer occurs;
- no persistence, cookies, localStorage, telemetry, analytics, CRM, email, scheduling, API, or provider behavior changes;
- prohibited automatic-transfer categories remain absent;
- protected professional, privacy, fair-housing, valuation, lending, legal, tax, investment, suitability, and brokerage boundaries remain intact;
- responsive and accessibility behavior remains valid;
- production certification covers representative Property, Advisory anchor, Contact, Search, and protected-system regression routes.

## Accepted Limitations

This plan does not authorize runtime implementation, CTA changes, Contact form changes, Property inquiry changes, hidden context, persistence, telemetry, CRM, email, scheduling, or API changes.

## Planning Result

Secondary planning status:

`PROPERTY_ADVISORY_CONTACT_CONTINUITY_PLAN_READY`
