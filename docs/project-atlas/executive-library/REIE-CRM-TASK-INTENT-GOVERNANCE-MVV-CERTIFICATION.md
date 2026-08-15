# REIE CRM Task Intent Governance Contract MVV Certification

Program: `REIE_CRM_TASK_INTENT_GOVERNANCE_CONTRACT_MVV`

Status: `CRM_TASK_INTENT_GOVERNANCE_CONTRACT_MVV_IMPLEMENTED_AND_LOCALLY_CERTIFIED`

## Purpose

`TaskIntentV1` is a pure deterministic governance contract for a future proposed CRM task. It validates intent only. It does not read, create, update, complete, dismiss, delete, schedule, assign, or persist a task.

## Controlled Registries

The finite neutral intent categories are:

- `PROPERTY_INQUIRY_REVIEW` from `PROPERTY_INQUIRY_SUBMISSION`;
- `SAVED_SEARCH_STRATEGY_REVIEW` from `SAVED_SEARCH_SUBMISSION`;
- `SELLER_VALUATION_INTAKE_REVIEW` from `SELLER_VALUATION_SUBMISSION`;
- `PRE_DISCOVERY_BRIEF_REVIEW` from `PRE_DISCOVERY_SIGNAL`; and
- `INTERACTION_PROMOTION_REVIEW` from `INTERACTION_PROMOTION`.

Each category has one governed source capability and one required non-PII evidence code. Unknown category, source, evidence, or category/source pairing fails closed.

## Input And PII Boundary

The contract accepts only opaque internal subject, owner, property, and source-event references. It accepts no name, email, phone, street address, message, note, customer text, inquiry text, or seller narrative. Unsupported fields and known PII fields fail closed; a hash is never used to conceal prohibited input.

Property reference is optional and is allowed only for `PROPERTY_INQUIRY_REVIEW`. It is a stable internal property ID, not lookup authority.

## Governance Output

A valid result contains normalized intent/source/subject/property posture, explicit owner posture, priority plus reason code, no-date or human-date-assignment posture, source-event fingerprint, deterministic dedupe key, deterministic audit fingerprint, evidence codes, consent posture, and expiration posture.

The dedupe key derives only from schema version, source capability, intent type, subject internal ID, optional property ID, and source-event fingerprint. It does not query CRMTask or enforce database uniqueness.

## Human, Communication, And Lifecycle Boundary

Every valid intent has lifecycle class `HUMAN_REVIEW_ONLY` and communication authority `CUSTOMER_COMMUNICATION_NOT_AUTHORIZED`. It cannot authorize email, SMS, calling, notifications, a communication queue, outreach, scheduling, due-date calculation, automatic completion, or follow-up.

Owner posture is explicit: `UNASSIGNED`, `HUMAN_OWNER_REQUIRED`, or an explicitly supplied opaque internal human-owner reference. The contract never silently assigns an agent or administrator.

## Professional And Fair-Housing Boundary

Task intent cannot carry pricing, valuation, CMA, offer, negotiation, legal, compliance, fiduciary, suitability, desirability, steering, demographic, protected-class, school-ranking, or safety-ranking conclusions. It can only request neutral human review through controlled intent/evidence codes.

## Zero-Side-Effect Posture

`lib/crm/taskIntentGovernance.ts` has no imports and performs no Prisma/database/customer read, CRM write, route/API action, email/SMS, queue/worker, calendar, provider, network, filesystem, or persistence action.

## Fixture Certification

Run:

```sh
npx tsx scripts/checkCRMTaskIntentGovernance.ts
```

Fixtures certify all five categories, controlled sources, references, property applicability, priority/reason pairing, owner/due-date postures, deterministic normalization/fingerprints, PII rejection, communication firewall, consent non-grant, human-review lifecycle, professional/fair-housing prohibitions, and static import safety.

## Future Gate

This contract does not authorize CRMTask mutation. The next gate is a separate primary canonical-integration review, followed only later by a privacy-minimized aggregate read audit and an explicitly authorized guarded-write plan.
