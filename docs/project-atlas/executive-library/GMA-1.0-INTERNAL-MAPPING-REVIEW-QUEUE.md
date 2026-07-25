# PROJECT ATLAS(tm)

## Geographic Mapping Architecture(tm) - GMA 1.0

### Internal Mapping Review Queue(tm)

Status: `GMA_1.0_INTERNAL_MAPPING_REVIEW_QUEUE_CERTIFIED_AND_CLOSED`

Implementation date: July 25, 2026

Repository baseline: `e11c268e7e2a42c7814c16e1899c2250b2d0e3a6`

Implementation scope: deterministic non-production review workflow only

Runtime activation status: `NOT_AUTHORIZED`

Production persistence status: `NOT_AUTHORIZED`

GIO mapping status: `NOT_AUTHORIZED`

Property assignment status: `NOT_AUTHORIZED`

Final canonical selection status: `NOT_AUTHORIZED`

Customer activation status: `NOT_AUTHORIZED`

---

## 1. Executive Summary

GMA 1.0 Internal Mapping Review Queue creates a deterministic local workflow for reviewing the unresolved, ambiguous, conflicting, duplicate, and editorial-only proposals produced by the certified Read-Only Mapping Preview.

The queue is a review scaffold only. It does not create canonical GIO records, write mappings, assign properties, merge records, enable eligibility, or integrate with runtime behavior.

Certified implementation outputs:

- Pure local module: `lib/gma/internalMappingReviewQueue.ts`
- Deterministic validation command: `npm run check:gma-internal-mapping-review-queue`
- Queue generation from the existing 91-record preview ledger only.
- Controlled review statuses and actions.
- Evidence-sufficiency guidance.
- Negative tests for prohibited conversions and transitions.
- Runtime isolation checks.
- Prisma and migration non-change checks.

Certification recommendation:

- `GMA_1.0_INTERNAL_MAPPING_REVIEW_QUEUE_CERTIFIED_AND_CLOSED`

Recommended next authorization:

- `GMA_1.0_INTERNAL_REVIEW_DECISION_FIXTURE`

That next authorization should remain non-production and fixture-only.

---

## 2. Deployment Gate Closure

The prior Read-Only Mapping Preview deployment gate succeeded before queue implementation began.

| Evidence | Value |
| --- | --- |
| Repository HEAD | `e11c268e7e2a42c7814c16e1899c2250b2d0e3a6` |
| GitHub/Vercel status ID | `51087822916` |
| Final state | `success` |
| Description | `Deployment has completed` |
| Completion time | `2026-07-25T19:48:05Z` |
| Deployment target | `https://vercel.com/david-quinns-projects-a0953600/david-quinn-group-8rde/ASCEYeXUbFngghCq4kXsqeAkREc9` |

Closure recorded:

- `GMA_1.0_READ_ONLY_MAPPING_PREVIEW_CERTIFIED_AND_CLOSED`

---

## 3. Queue Source Boundary

Authorized source:

- Existing deterministic Read-Only Mapping Preview ledger only.

The queue loads records from the preview checker export:

- `readOnlyMappingPreviewRecords`

The queue does not read from:

- Prisma
- Supabase
- production database tables
- GIO tables
- MLS
- Typesense
- customer forms
- external vendors
- Google Docs
- network sources

No new geographic data source was added.

---

## 4. Queue Record Contract

Each generated queue item includes:

| Contract field | Status |
| --- | --- |
| Queue item ID | Implemented as `GMA_REVIEW_QUEUE\|V1\|###` |
| Preview record ID | Preserved from `GMA_PREVIEW\|...` |
| Source asset | Preserved |
| Source repository location | Preserved |
| Source value | Preserved |
| Proposed object type | Preserved |
| Proposed canonical candidate | Preserved as candidate only |
| Mapping outcome | Preserved |
| Mapping method | Preserved |
| Confidence | Preserved |
| Ambiguity type | Preserved |
| Conflict type | Preserved |
| Editorial-separation status | Preserved |
| Evidence summary | Preserved |
| Missing evidence | Generated deterministically |
| Recommended action | Generated deterministically |
| Reviewer status | Controlled local vocabulary |
| Reviewer note | Deterministic fixture note |
| Decision status | Non-production review only |
| Decision rationale | Non-production rationale |
| Activation eligibility | Always `NOT_ELIGIBLE` |
| Created timestamp | Deterministic fixture timestamp |
| Review version | `GMA_1.0_INTERNAL_MAPPING_REVIEW_QUEUE_V1` |

---

## 5. Queue Summary

Validation output:

- 91 queue items generated from read-only preview records.
- 36 editorial-separation items locked as non-factual.
- 26 duplicate candidates preserved.
- 4 conflicts preserved.
- 42 ambiguous items blocked from canonical approval.
- 80 unresolved items retained.
- 0 activation-eligible items.

The queue intentionally includes all preview records so every candidate, alias, duplicate, conflict, editorial association, and manual-review item can be tracked without becoming production data.

---

## 6. Review Statuses

Implemented controlled statuses:

- `PENDING_REVIEW`
- `NEEDS_MORE_EVIDENCE`
- `APPROVED_AS_PREVIEW_CANDIDATE`
- `APPROVED_AS_ALIAS_CANDIDATE`
- `EDITORIAL_ONLY`
- `DUPLICATE_CANDIDATE`
- `CONFLICT_PRESERVED`
- `DEFERRED`
- `REJECTED`
- `ESCALATED`

None of these statuses authorizes production activation, GIO insertion, property assignment, final canonical selection, or customer presentation.

---

## 7. Review Actions

Implemented permitted actions:

- `CONFIRM_PREVIEW_CANDIDATE`
- `CLASSIFY_AS_ALIAS_CANDIDATE`
- `PRESERVE_CONFLICT`
- `REQUEST_ADDITIONAL_EVIDENCE`
- `CLASSIFY_AS_EDITORIAL_ONLY`
- `DEFER`
- `REJECT`
- `ESCALATE_FOR_ARCHITECTURAL_REVIEW`

Explicitly absent actions:

- create GIO object
- write mapping
- assign property
- enable eligibility
- merge production records
- change canonical runtime identity

---

## 8. Human-Review Rules

The queue requires or preserves explicit review for:

- multi-object matches
- multi-type matches
- authoritative-source conflicts
- municipality and market-area conflation
- neighborhood and subdivision conflation
- informal places
- editorial-only place names
- boundary uncertainty
- duplicate names across locations
- merge or supersession candidates

No automated decision can approve these as canonical identities.

---

## 9. Evidence Sufficiency Model

Implemented evidence outcomes:

- `SUFFICIENT_FOR_PREVIEW`
- `INSUFFICIENT`
- `CONFLICTING`
- `EDITORIAL_ONLY`
- `REQUIRES_AUTHORITATIVE_SOURCE`
- `REQUIRES_MANUAL_BOUNDARY_REVIEW`
- `REQUIRES_LICENSE_REVIEW`
- `REQUIRES_ARCHITECTURAL_DECISION`

These outcomes guide internal review only. They are not production trust certification.

---

## 10. Editorial Separation Enforcement

The queue enforces:

- editorial associations cannot be approved as factual observations;
- page existence does not prove geographic identity;
- search intent does not prove geographic identity;
- community narrative does not establish a boundary;
- lifestyle content cannot create object attributes;
- editorial-only items cannot become publicly eligible;
- conversion from editorial to factual requires a new sourced proposal and separate trust review.

Negative tests confirm:

- editorial item plus `CONFIRM_PREVIEW_CANDIDATE` fails;
- editorial item plus alias conversion fails;
- editorial items retain `NOT_ELIGIBLE`;
- editorial conflict items preserve conflict while remaining non-factual.

---

## 11. Conflict Preservation

Conflict preservation passed for:

- Gunbarrel object-type ambiguity;
- Superior registry mismatch;
- Niwot authority question;
- municipality versus market-area conflation;
- static polygon boundary risk;
- duplicate legacy city and neighborhood candidates;
- editorial-only search and page associations.

Conflict items cannot be converted to alias candidates or preview candidates unless the permitted action preserves the conflict, requests more evidence, or escalates for architectural review.

---

## 12. Invalid Transition Results

Validated failure cases:

| Attempted transition | Result |
| --- | --- |
| Editorial-only to preview candidate | Fails |
| Editorial-only to alias candidate | Fails |
| Ambiguous item to preview candidate | Fails |
| Duplicate candidate to preview candidate | Fails |
| Conflict item to alias candidate | Fails |
| Any item with active eligibility | Fails |

---

## 13. Determinism and Idempotency

Repeated generation of the queue from the same preview ledger produces identical queue output.

Deterministic controls:

- fixed queue-item ID sequence;
- fixed fixture timestamp;
- fixed review version;
- no random values;
- no system clock dependency;
- no database reads;
- no network reads;
- no persisted decision writes.

---

## 14. Runtime Isolation Verification

Static validation confirmed no imports or consumption of the review queue from:

- `app`
- `components`
- `lib/search`
- `lib/mls`
- `lib/typesense`
- `lib/alerts`
- `lib/email`
- `lib/tracking`
- `workers`

The module remains an isolated non-production governance utility.

---

## 15. Prisma and Migration Review

No Prisma schema change was made for the review queue.

No migration was created.

The checker confirms the Prisma schema does not contain:

- `GmaInternalMappingReviewQueue`
- `InternalMappingReviewQueue`
- `mapping_review_queue`

The checker also confirms migration names do not contain GMA review-queue markers.

---

## 16. Validation Matrix

| Required proof | Result |
| --- | --- |
| Queue input comes only from read-only preview records | Passed |
| Queue decisions cannot create active mappings | Passed |
| Original preview evidence is immutable | Passed |
| Invalid status transitions fail | Passed |
| Editorial-to-factual promotion fails | Passed |
| Ambiguous canonical approval fails | Passed |
| Duplicate candidates are not merged | Passed |
| Conflicts remain preserved | Passed |
| Repeated execution is deterministic | Passed |
| Runtime modules do not import the review queue | Passed |
| No Prisma schema or migration changes occurred | Passed |
| No production database access or writes exist | Passed |
| No property assignment exists | Passed |
| No eligibility flag can be activated | Passed |

---

## 17. Risk Register

| Risk | Status | Mitigation |
| --- | --- | --- |
| Review status misunderstood as production approval | Controlled | Documentation and code keep activation eligibility `NOT_ELIGIBLE`. |
| Editorial associations promoted into facts | Controlled | Negative tests block factual promotion. |
| Conflicts silently resolved | Controlled | Conflict-preservation transitions are enforced. |
| Duplicate candidates accidentally merged | Controlled | Duplicate approval as preview candidate fails. |
| Queue imported by runtime | Controlled | Static runtime-isolation check is mandatory. |
| External Google Doc drift | Open watch | Do not claim external updates unless readback confirms them. |

---

## 18. Explicit Exclusions

This implementation did not authorize or perform:

- Prisma schema changes.
- Migrations.
- Database writes.
- GIO table population.
- Production seeds.
- Property assignments.
- Production mapping creation.
- Existing geographic data mutation.
- Runtime integrations.
- Search, map, route, page, SEO, Typesense, MLS, CRM, alert, email, or customer behavior changes.
- Vendor connections.
- Scraping.
- AI-assisted mapping.
- Final canonical selections.
- Duplicate merges.
- Public or customer-facing activation.

---

## 19. Executive Recommendation

GMA 1.0 Internal Mapping Review Queue satisfies the approved non-production review scope.

Executive certification recommendation:

- `GMA_1.0_INTERNAL_MAPPING_REVIEW_QUEUE_CERTIFIED_AND_CLOSED`

Recommended next authorization:

- `GMA_1.0_INTERNAL_REVIEW_DECISION_FIXTURE`

Stop condition:

- Do not begin GIO persistence, production mapping, final canonical selection, property assignment, or customer activation without a separate executive authorization.
