# Buyer Decision Brief Foundation V1 Certification

**Certification token:** `BUYER_DECISION_BRIEF_FOUNDATION_V1_CERTIFIED_WITH_LIMITATIONS`

## Certified boundary

`BUYER_DECISION_BRIEF_V1` provides a durable, owner-scoped, Agent-reviewed Buyer
Decision Brief using the shared OutputVersion, evidence snapshot, dependency, review,
decision, checkpoint, and append-only persistence architecture. It is structured decision
intelligence, not a score, purchase recommendation, financing approval, or client profile.

- Contract: `lib/buyerDecisionBriefFoundation.ts`
- Agent route: `/agent/prepare/buyer/decision-brief`
- Persistence: `lib/outputPersistenceFoundation.ts`
- Focused check: `npm run check:buyer-decision-brief-foundation`

## Runtime evidence

| Brief | OutputVersion | Offer context | Fingerprint |
| --- | ---: | ---: | --- |
| A | `#1` | `$650,000.00` | `buyer-decision-brief-v1-350c35c3` |
| B | `#2` | `$660,000.00` | `buyer-decision-brief-v1-e6d93e3b` |

The material decision-context difference is exactly `$10,000.00`. Both records are
`BUYER_PRESENTATION` / `BUYER`, have one evidence snapshot, two exact dependencies
(the synthetic property evidence fixture and their own decision context), and one review,
decision, and checkpoint. B retained its own context; A remained unchanged.

Authenticated replay of B returned existing version `#2`; the target count remained two.
No Buyer Brief A/B source mutation, ProfessionalInput mutation, Evidence Admission
mutation, secure-document mutation, customer data, provider lookup, CRM, MLS, PDF,
OutputRender, Client Portal, or external communication occurred.

## Immutability and authorization

The production OutputVersion route remains private and owner-scoped. Direct no-op updates
to Brief A, its evidence snapshot, and its dependency were all rejected by the target
append-only trigger; immediate readback confirmed every value unchanged. The same route's
unauthenticated rejection was independently proved during Workstream 1 and remains the
shared boundary for Buyer persistence.

## Intentional limitations

- Property identity is the existing `psr_synthetic_property_reference`; no address,
  ownership, MLS, or provider lookup is asserted.
- Location is a synthetic Boulder context, not a neighborhood claim or recommendation.
- No current market snapshot is bound; Average DOM remains `UNKNOWN`.
- `BUYER_FINANCIAL_CALCULATION: DEFERRED_PENDING_CALCULATION_CONTRACT`.
- No lender ProfessionalInput is bound; rate and payment remain `UNKNOWN` / `NOT_CALCULATED`.

These limitations are explicit in the persisted semantic snapshot and do not affect the
separate Professional External Request foundation.

## Validation

Passed: Buyer foundation checker, Output Persistence, Evidence Admission, Professional
Input checks, TypeScript check, lint (only existing warnings), production build (only the
existing PDF dynamic-import warning), and `git diff --check`.

## Next workstream

`PROFESSIONAL_EXTERNAL_REQUEST_FOUNDATION_V1` may proceed only to its explicit external
delivery authorization gate. No send or external contact is authorized by this certification.
