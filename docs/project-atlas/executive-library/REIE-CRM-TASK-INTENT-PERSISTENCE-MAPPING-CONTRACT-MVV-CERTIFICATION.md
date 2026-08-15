# REIE CRM Task Intent Persistence Mapping Contract MVV Certification

Program: `REIE_CRM_TASK_INTENT_PERSISTENCE_MAPPING_CONTRACT_MVV`

Status: `IMPLEMENTED_AND_LOCALLY_CERTIFIED`

## Purpose

This MVV defines a pure deterministic planning contract for a future unresolved CRMTask persistence envelope. It answers only what bounded, PII-minimized CRMTask fields could be proposed if a canonical valid TaskIntent were separately authorized for persistence later.

It does not resolve leads, produce a Prisma-ready create payload, read or write CRMTask, query customer identity, call routes, send communication, schedule follow-up, run queues or workers, call providers, or deploy.

## Input authority

The contract accepts only the successful canonical TaskIntent result shape with `classification: VALID_TASK_INTENT`, a normalized `intent`, and no reasons. It rejects raw TaskIntent input, dry-run human-input or fail-closed results, raw source evidence, arbitrary objects, and any caller-supplied task persistence fields such as `leadId`, `sellerLeadId`, `id`, `createdAt`, `title`, or `metadata`.

Canonical TaskIntent Governance remains authoritative for category, source capability, normalization, PII rejection, priority validation, lifecycle, communication authority, source-event fingerprint, dedupe key, and audit fingerprint. The persistence mapper preserves those canonical outputs; it does not regenerate them.

## Result model

Successful mapping returns only `LEAD_RESOLUTION_REQUIRED` with:

- `persistence: NOT_ATTEMPTED`;
- `communication: NOT_AUTHORIZED`;
- `leadResolution: REQUIRED_BEFORE_WRITE`;
- `idempotency: IDEMPOTENCY_NOT_YET_PROVEN`; and
- a non-executable CRMTask envelope.

Failure returns only `FAIL_CLOSED`.

No result may claim task creation, persistence, saved state, deduplication, lead resolution, communication, or readiness for automated write.

## Proposed unresolved envelope

The envelope targets existing CRMTask columns only:

- `type`;
- `status`;
- `priority`;
- `title`;
- `metadata`.

It omits executable `leadId` because TaskIntent carries only an opaque internal subject reference. It also omits `CRMTask.id`, `CRMTask.createdAt`, and `sellerLeadId`.

`type` maps directly from the governed TaskIntent category:

- `PROPERTY_INQUIRY_REVIEW`;
- `SAVED_SEARCH_STRATEGY_REVIEW`;
- `SELLER_VALUATION_INTAKE_REVIEW`;
- `PRE_DISCOVERY_BRIEF_REVIEW`;
- `INTERACTION_PROMOTION_REVIEW`.

`status` is always `pending` for `HUMAN_REVIEW_ONLY`. `priority` maps directly from canonical priority. Titles are registry-derived only:

- `Property inquiry review`;
- `Saved search strategy review`;
- `Seller valuation intake review`;
- `Pre-discovery brief review`;
- `Interaction promotion review`.

## Metadata allowlist

The only proposed metadata object is:

```text
metadata.taskIntent = {
  schemaVersion,
  intentType,
  sourceCapability,
  subject,
  property when allowed,
  ownerPosture,
  priorityReason,
  dueDatePosture,
  sourceEventFingerprint,
  dedupeKey,
  auditFingerprint,
  evidenceCodes,
  lifecycleClass,
  communicationAuthority,
  consentPosture,
  expirationPosture,
  generatedAt
}
```

No raw source event ID, source object, review narrative, customer notes, source payload, communication payload, name, email, phone, address, inquiry narrative, seller narrative, message, clicked-listing payload, or arbitrary free-form text is included.

## Property, owner, due-date, and idempotency posture

Only `PROPERTY_INQUIRY_REVIEW` may preserve an opaque `{ kind: INTERNAL_PROPERTY_ID, id }` reference in bounded governance metadata. All other categories omit property metadata.

Owner and due-date posture are preserved as governance metadata only. They do not mean an owner is assigned, a due date exists, or scheduling occurred.

The canonical `dedupeKey` and `auditFingerprint` are preserved, but idempotency remains explicitly `IDEMPOTENCY_NOT_YET_PROVEN`. Duplicate detection, read-before-write, database uniqueness, and race safety remain later Write Readiness gates.

## Future schema candidates

First-class operational support may later require schema work for task owner, due date, property foreign key, unique or indexed dedupe key, indexed audit fingerprint, constrained lifecycle/status, and completion timestamps. This MVV makes no Prisma or migration change.

## Local certification

Run:

```sh
node_modules/.bin/jiti scripts/checkCRMTaskIntentPersistenceMappingContract.ts
```

The deterministic fixture suite covers all five governed categories, identity type mapping, pending status, direct priority and priority-reason preservation, registry titles, PII and arbitrary-field rejection, property posture, owner and due-date posture, communication prohibition, consent and expiration posture, source-event fingerprint, dedupe key, audit fingerprint, evidence codes, unresolved lead posture, omitted executable fields, idempotency posture, invalid input authority, fail-closed semantics, deterministic identical-input output, and static side-effect isolation.

## Non-authorization

This MVV does not authorize CRMTask reads or writes, User or lead reads, customer mutation, seller lead mutation, DB access, Prisma changes, migrations, routes, existing CRM creation-path changes, email, SMS, notifications, communications, queues, workers, calendar actions, provider calls, Search or Typesense mutation, deployment, or push.
