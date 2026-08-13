# REIE Evidence-Bound Comparable Input Preparation MVV Certification

Program: `REIE_EVIDENCE_BOUND_COMPARABLE_INPUT_PREPARATION_MVV`
Status: `IMPLEMENTED_AND_LOCALLY_CERTIFIED`
Scope: additive contract and fixture validation only

## Purpose

The MVV deterministically organizes already-supplied REIE listing facts for one explicitly selected subject property and one or more explicitly selected candidate properties into an internal agent-review Comparable Input Packet™. It reduces repeated factual organization before a CMA, seller conversation, or offer discussion while leaving all professional conclusions with the human reviewer.

## Implementation

New files only:

- `lib/comparableInputPreparation.ts`
- `scripts/checkComparableInputPreparation.ts`
- this certification record

The contract reuses the existing read-side `buildPropertyComparisonWorkspace` for factual/evidence comparison states and `getReieSourceRegistry` for governed source posture. It accepts typed facts already read by a caller; it performs no query or property selection itself.

## Explicit-selection behavior

The request requires a subject and a non-empty candidate array supplied by the caller. Candidate order is preserved exactly as supplied. The contract never searches, ranks, sorts, filters, recommends, or selects candidates. An empty candidate array, a duplicate candidate, or a candidate matching the subject returns `FAIL_CLOSED` with no subject facts, candidate facts, or comparisons in the packet.

## Packet contract

For a valid explicit selection, the packet includes:

- deterministic identity from contract version, supplied IDs, and supplied `generatedAt`;
- subject and candidate factual fields only: identity, price, status, property type, beds, baths, square feet, lot size, year built, geography, and labelled price-per-square-foot arithmetic where possible;
- governed source posture and visible listing-update or REIE-intelligence-sync timestamps when supplied;
- factual differences, calculated differences, evidence asymmetry, unavailable evidence, and verification-required states;
- sold, recency, condition, public-record, characteristic, and source-posture limitations;
- neutral verification questions; and
- a human-review checklist.

No unavailable field is synthesized. No source freshness is fabricated; a missing visible timestamp is represented as `NO_VISIBLE_TIMESTAMP` and requires verification. This implementation does not require or read `Property.sourceModifiedAt`.

## Evidence asymmetry and limitation behavior

Existing Comparison Evidence principles are preserved. When a property has a listed fact that another lacks, the result is `EVIDENCE_ASYMMETRY`, never a quality conclusion. Missing facts become `UNAVAILABLE_EVIDENCE` or `VERIFICATION_REQUIRED` as appropriate.

Sold verification is always visibly unavailable from this contract alone. A visible timestamp never establishes analytical recency by itself; it becomes a human verification question. Condition, inspection, public-record, permit, tax, HOA, title, and similar external evidence are not retrieved or inferred.

## Professional boundary

The packet is evidence preparation only. It does not perform comparable selection, CMA methodology, pricing, appraisal, negotiation, offer strategy, fiduciary advice, or customer communication. Its checklist explicitly returns responsibility for each of these actions to the human agent or appropriate qualified professional.

Packet output is checked to exclude best-comp language, ordering language, scoring language, value conclusions, pricing or offer recommendations, appraisal conclusions, investment conclusions, suitability/desirability language, protected-class inferences, safety/school rankings, and steering.

## Zero-side-effect and provider-independence certification

`lib/comparableInputPreparation.ts` is a pure input-to-output contract. It has no database client, write operation, network call, provider call, file operation, queue, worker, email, CRM, analytics, telemetry, MLS, alert, or mutation path. It does not depend on LightBox, ATTOM, county, assessor, parcel, permit, tax, HOA, or other external data.

The fixture validation statically rejects protected-system references in the new runtime module, including Prisma, MLS, alerts, queues, workers, Resend/email, CRM, LightBox, ATTOM, Typesense, and `fetch`.

## Validation

Run directly without changing package configuration:

```bash
npx tsx scripts/checkComparableInputPreparation.ts
```

The check uses fixtures only and verifies:

1. explicit subject and multiple supplied candidates;
2. empty-candidate fail-closed behavior;
3. deterministic output for identical inputs;
4. factual and calculated differences;
5. evidence asymmetry and unavailable evidence;
6. sold and recency limitations;
7. source/timestamp propagation;
8. neutral verification questions and human-review checklist;
9. prohibited-output absence; and
10. protected-system import/reference absence.

## Collision safety

Only the three authorized new additive files were created. No existing comparison/property/source/seller module was changed. No Prisma, migration, `Property.sourceModifiedAt`, MLS, Saved Search, alert, package/configuration, public-route, admin-route, or `docs/CHAT_START.md` file is touched by the MVV.

## Agent-labor value

The MVV reduces repeated preparation labor by placing human-selected property facts, labelled arithmetic, factual differences, evidence gaps, source/timestamp posture, and neutral next verification questions into one consistent review packet. It is appropriate for pre-CMA, pre-seller, and pre-offer factual organization only; it does not claim to complete any professional analysis.

## Next gate

`READY_FOR_EVIDENCE_BOUND_COMPARABLE_INPUT_PREPARATION_INTEGRATION_SCOPE_REVIEW`

Any later UI, API, persistence, provider, customer, CRM, alert, or production use requires a separate authorization.
