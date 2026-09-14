# PROJECT ATLAS - Canonical Client Case and Cross-Workspace Intelligence Architecture V1

## Executive Summary

Project Atlas has a durable, owner-scoped `ClientCase` root, canonical physical-property identity, owner-validated Transaction and Output seams, governed Evidence Admission and Professional Input foundations, and a versioned multi-property financial Scenario foundation. It does not yet have a durable, reusable canonical facts, criteria, objectives, readiness, or cross-capability Scenario layer. Current preparation workspaces are intentionally session-local; their inputs must not be mistaken for Case context.

The recommended architecture is an additive **Client Case Context** domain. It makes the existing `ClientCase` the durable advisory container, adds separately governed factual and criteria records with explicit scope and provenance, introduces objective context, and later supplies a server-authoritative resolver, capability-specific readiness contracts, generic Scenario versions, and immutable analytical-context snapshots. It does not turn Client Case into a CRM, Transaction, Output, authorization, evidence store, or universal JSON bucket.

### Executive Decisions Required

**EXECUTIVE DECISIONS REQUIRED: 2**

**DECISION 1: Approve the Case Context semantic boundary.**

Primary recommendation: approve `ClientCase` as the owner-scoped durable advisory container; facts, criteria, objectives, Scenario assumptions, modeled results, and Transaction truth remain separate records and states.

Why: the existing Case foundation already provides the correct ownership, lifecycle, property-reference, Transaction, and Output seams. Reusing it prevents a competing root while avoiding an unsafe claim that today’s Case labels or session input already represent canonical client context.

**DECISION 2: Approve the first additive persistence wave before any client-context capture is enabled.**

Primary recommendation: authorize only `PROJECT_ATLAS_CANONICAL_CLIENT_CASE_CONTEXT_RECORDS_AND_OBJECTIVES_FOUNDATION_V1` after separate schema, migration, runtime, and synthetic-certification authorization.

Why: a controlled Case objective plus provenance-aware fact and criterion record foundation is the smallest durable prerequisite for responsible reuse. Generic Scenarios, resolver-driven reuse, readiness UX, and cross-workspace prefill must wait until that foundation is certified.

## Repository Truth and Current-State Matrix

| Existing concept | Current purpose and ownership | Durable/history posture | Candidate role | Recommendation |
| --- | --- | --- | --- | --- |
| `ClientCase` | Owner-scoped private advisory root with `ACTIVE`/`ARCHIVED` lifecycle | Durable; no hard-delete service path; no context revisions | Canonical Case root | KEEP and EXTEND |
| `ClientCaseParty` | Case-local orientation labels, not CRM or authorization principals | Durable; no authority or household model | Participant orientation only | KEEP; do not treat as contact/authority record |
| `ClientCaseProperty` | Case to canonical physical-property relationship with a Case role | Durable; references rather than copies property facts | Property relationship anchor | KEEP and EXTEND only by explicit relationship semantics |
| `CanonicalPhysicalProperty` | Repository-wide physical-property identity and source observations | Durable source identity/history foundation | Physical-property master | KEEP; never copy it into Case facts |
| `Transaction` and `TransactionParty` | Owner-scoped operational transaction truth; nullable Case FK | Durable, append-oriented operational records | Related downstream truth | KEEP; Case is not a Transaction |
| `OutputProduct`, `OutputVersion`, `OutputEvidenceSnapshot` | Owner-scoped output lineage and immutable reviewed versions | Durable, versioned and immutable | Output and executed-lineage consumer | KEEP; do not make Output the context root |
| `EvidenceCandidate` and `EvidenceAdmission` | Review-gated evidence candidate/admission with provenance and supersession | Durable and governed | Evidence reference source | KEEP; no competing evidence system |
| `ProfessionalInputRequest`, response, and `ProfessionalInput` | Governed professional-source workflow | Durable, admission-mediated | Professional input reference source | KEEP; never promote automatically to Case fact |
| `ClientAuthorization` | Purpose-bound authorization, capability, confirmation evidence, and use | Durable and separately governed | Referenced authorization boundary only | DO NOT REUSE as Case context |
| `MultiPropertyFinancialScenario` and immutable versions/results | Owner-scoped, optional Case-bound financial Scenario capability | Durable immutable inputs/results and audit history | First capability-specific Scenario adopter | ADAPT; do not relabel it as the generic Scenario root |
| Seller Financial and Investment Scenario roots | Capability-specific immutable input/result versions | Durable, owner-scoped | Future adapters to generic Scenario context | ADAPT incrementally |
| Buyer, Seller, Property, Location, and Market preparation workspaces | Explicit preparation input and session-local analysis | Predominantly session-only; no durable Case-context claim | Future resolver consumers | DO NOT REUSE as durable context |
| Saved Search, Seller Lead, CRM adapters, and user identity | Search, lead, external-system boundary, and authenticated actor concerns | Separate ownership and lifecycle | Adjacent systems | DO NOT REUSE as Client Case |

### Confirmed Existing Invariants

- The Case service derives `ownerAgentSubject` from the authenticated Agent boundary; browser-provided owner identity is not accepted.
- Foreign Case access is unavailable, and Case-to-Transaction association is owner-checked.
- Existing Client Case context is explicit in route/API identifiers. There is no global `activeClientCaseId`, cookie, or cross-tab mutable Case store.
- Output already has nullable Case and Transaction lineage; multi-property finance already has optional Case linkage and immutable Scenario versions.
- Evidence Admission remains review-gated. Professional Input remains distinct from an external response and an Evidence Candidate.
- Existing Scenario inputs are capability-specific snapshots. They are not evidence that a generic Client Case Scenario model already exists.

## Target Domain Decision

### Durable Meaning of Client Case

`ClientCase` is one owner-scoped, durable advisory context for a person, household, or related decision group. It can contain multiple related objectives and multiple physical-property relationships. It is neither a person record, a household directory, a CRM contact, a Transaction, a Saved Search, an Output, a Client Authorization, nor a Scenario.

One person or household may have multiple Cases when engagements are materially independent, such as a primary-home transition and a separate investment acquisition. A Case may contain multiple orientation participants, but participant labels do not prove authority, ownership, or consent. Closing or archiving a Case must not delete downstream history; reopening is an explicit lifecycle action.

### Information Classes

| Class | Meaning | May be reused as a fact? | May mutate canonical Case context? |
| --- | --- | --- | --- |
| Canonical fact | Established real-world state, with provenance and temporal posture | Yes, only within scope and freshness policy | Only through an explicit successor/revision |
| Criterion | Client-stated or recorded preference, objective, constraint, or priority | No | Only through an explicit successor/revision |
| Plan or intent | An adopted intended course of action | No; it is not transaction truth | Only through explicit governed adoption |
| Scenario assumption or override | Hypothetical input used to ask “what if?” | No | Never |
| Evidence and Professional Input | Support/provenance artifacts | No; admission remains separate | Never automatically |
| Derived value or modeled result | Computed output of a contract/engine | No | Never |
| Transaction fact | Executed or contractually operative truth | No; related to Case but separately governed | Only through Transaction workflow |
| Session state | In-progress UI input and navigation state | No | Never |

### Recommended Additive Entity Candidates

These are architecture candidates, not approved schema models.

| Candidate | Responsibility | Explicit non-responsibility |
| --- | --- | --- |
| `ClientCaseObjective` | Bounded Case objective/engagement with lifecycle, type contract, and title | Not a Transaction, Scenario, or authorization |
| `ClientCaseFact` | Material Case fact with fact-type contract, scope, source posture, effective/observed dates, freshness, and supersession | Not a free-form note, criterion, assumption, or analytical result |
| `ClientCaseCriterion` | Reusable preference, constraint, priority, or objective detail with scope and provenance posture | Not an assertion about real-world state |
| `CaseContextSourceReference` | Immutable source/evidence/professional-input reference snapshot attached to a material record | Not a competing Evidence Admission system |
| `CaseScenario` | Logical hypothetical alternative linked to one Case and optional objectives | Not the storage location for results or current facts |
| `CaseScenarioVersion` | Immutable Scenario assumptions/overrides plus inherited-context references | Not a live mutable Case copy |
| `AnalyticalContextSnapshot` | Immutable execution-time resolved input and provenance bundle | Not an Output or Scenario definition |
| `CapabilityInputContract` | Versioned, capability-specific required/recommended/conditional input definitions | Not a global “client complete” flag |

The fact and criterion models should be separate tables. Each may carry a validated structured payload only under a named domain/type contract. A generic ungoverned key/value table is rejected. Common, high-value fields may become strongly typed children later only after an approved capability demonstrates stable semantics and query needs.

## Scope, Provenance, and Temporal Semantics

Every material Fact or Criterion requires:

- Case owner and Case identity;
- type and schema/contract version;
- scope: `CASE`, `OBJECTIVE`, or a specific Case-property relationship;
- recorded-by and recorded-at;
- source posture: for example client-stated, agent-entered, admitted evidence, professional input reference, or system-derived;
- observed/effective date where meaningful;
- verification posture, freshness/review-after policy, and limitation when not verified;
- immutable revision/supersession lineage rather than overwrite for material values.

No source posture implies a verification state. A client-stated amount, an agent-entered transcription, admitted evidence, and a Scenario assumption remain distinguishable. Evidence and Professional Input IDs may be recorded as references only after their owning systems permit that relationship; an external response or pending Evidence Candidate cannot satisfy a fact record.

## Scenario Architecture

### Chosen Model: Immutable Versioned Overlay With Frozen Execution Context

`CaseScenario` is a logical, owner-scoped hypothetical branch. Its versions contain only explicit assumptions and overrides, each classified by domain and scope. A Scenario reads applicable canonical context through a server-side effective-context resolver; it never edits Case facts or criteria.

```text
ClientCase
  +-- facts, criteria, objectives, property relationships
  +-- CaseScenario A -> ScenarioVersion A1 -> immutable execution snapshot
  +-- CaseScenario B -> ScenarioVersion B1 -> immutable execution snapshot
  +-- CaseScenario B copied -> ScenarioVersion C1 (independent copy)
```

The resolver may dynamically read current eligible Case context for a live, unexecuted view. Every analytical execution must instead persist an `AnalyticalContextSnapshot` containing the exact Case record revisions, Scenario version, property relationship references, evidence/provenance posture, contract versions, freshness evaluations, limitations, and resolved material values used. Historical outputs must reference this frozen execution snapshot or an equivalent existing capability snapshot; they must never silently rerun against changed Case data.

Scenario duplication creates a new logical Scenario and first immutable version. It copies selected explicit assumptions and records predecessor lineage, but creates no live coupling. Archive is preferred to delete after use. A Scenario is never automatically promoted into a Case fact, criterion, plan, or Transaction truth; promotion requires a separately governed explicit action and provenance decision.

### Existing Scenario Foundations

`MultiPropertyFinancialScenario` is retained as the first capability adapter: it already provides optional Case binding, immutable input versions, participant/provenance snapshots, result immutability, audit events, and Output lineage. Seller Financial and Investment scenario systems remain independent capability roots. Later adapters can consume `AnalyticalContextSnapshot` inputs, but no existing model is retroactively redefined as `CaseScenario` in this architecture wave.

## Effective Context and Readiness

### Server-Authoritative Effective-Context Resolver

The future resolver receives an authenticated owner, explicit Case ID, optional objective/property relationship, optional Scenario version, capability key, and capability-contract version. It:

1. verifies owner scope and Case lifecycle;
2. collects only scope-applicable material Case records;
3. resolves explicit Scenario overrides without replacing source records;
4. checks source posture, verification, temporal freshness, conflicts, and contract eligibility;
5. returns values with their provenance, classification, limitation, and resolution explanation;
6. does not write, infer, or use last-write-wins behavior.

Presentation components and browser session state are not resolution authorities. Active Case and Scenario are explicit route/context identifiers and must be visibly rendered before a contextual action. Standalone capability mode remains supported where no Case is selected; it must surface that no Case context was used.

### Capability-Specific Readiness Contract

Each consuming capability owns a versioned `CapabilityInputContract`, not a global “client complete” boolean. For each input, it declares scope, condition, semantic class, source requirements, freshness/verification requirements, whether a Scenario assumption may satisfy it, and impact if absent.

The evaluator is a pure read-only function with statuses including `SATISFIED`, `MISSING_REQUIRED`, `MISSING_RECOMMENDED`, `OPTIONAL`, `NEEDS_VERIFICATION`, `STALE_OR_REFRESH_NEEDED`, `PROFESSIONAL_INPUT_REQUIRED`, `UNAVAILABLE`, `DELIBERATELY_OMITTED`, and `SCENARIO_ASSUMPTION_ALLOWED`. It returns what is known, what is missing, why it matters, what can proceed preliminarily, and the exact limitations. Comprehensive means contract coverage, not certainty.

## Cross-Workspace Reuse Decision

| Capability | Future Case-context use | Boundary preserved |
| --- | --- | --- |
| Buyer and Seller | Objective-scoped criteria, timing, property relationships, known inputs | Existing preparation/session contracts remain until explicitly adapted |
| Financial Strategy and Investment | Case facts/criteria only through snapshot-backed resolver; Scenario inputs remain hypothetical | Existing capability Scenario versioning and calculation disclaimers |
| Property Intelligence | Explicit Case-property relationship and relevant criteria | Canonical property/source evidence remains independent |
| Location and Market | Objective-scoped locations/criteria where explicitly eligible | No preference becomes a market fact or recommendation |
| Transaction | Case relationship and explicit party references | Transaction truth, deadlines, and operational state stay separate |
| Outputs | Case, Scenario-version, and analytical-snapshot lineage | Existing OutputProduct/OutputVersion immutability and review gates |
| Authorization | Purpose-bound reference only | Client Authorization is not generalized Case consent |
| Professional Input and Evidence | Referenced provenance when admitted/eligible | Admission and input materialization remain separately governed |

## Migration and Backfill Strategy

The design requires additive migrations in approved waves only. No legacy Case, Transaction, Output, Scenario, client, or search record may be fabricated or backfilled automatically. Existing nullable Case relationships remain valid. Early Case facts and criteria begin only through explicit Agent actions after their own authorization and synthetic certification. Migration rollback is forward-safe: disable new writes/readers, preserve immutable rows, and retain the prior Case/Scenario functions.

## Phased Implementation Plan and Dependency Graph

```text
Case objective + fact/criterion records
  -> source/provenance contract
  -> effective-context resolver
  -> capability input contracts + readiness evaluator
  -> analytical-context snapshot
  -> one bounded capability adapter
  -> cross-capability adapters and output lineage expansion
```

| Wave | Objective | Depends on | Parallel posture | Executive gate |
| --- | --- | --- | --- | --- |
| 1. Context records and objectives | Add durable Case objective, Fact, and Criterion records with revision/provenance rules | Existing Case ownership | PRIMARY_ONLY, sequential | Schema/migration and synthetic-data authorization |
| 2. Resolver and readiness contracts | Pure server resolver and one contract/evaluator | Wave 1 | SECONDARY_SAFE_ANALYSIS for contract drafting; implementation sequential | Capability-selection authorization |
| 3. Analytical snapshot | Freeze execution-time resolved inputs and lineage | Waves 1-2 | PRIMARY_ONLY | Snapshot/schema authorization |
| 4. Financial Strategy adapter | Adapt multi-property finance as first consumer | Waves 1-3 and existing finance foundation | SEQUENTIAL_DEPENDENCY | Synthetic Scenario certification authorization |
| 5. Buyer/Seller and Intelligence adapters | Add bounded consumers one at a time | Waves 1-3 | PARALLEL_COLLISION_SAFE only after shared contract freeze | Per-capability authorization |
| 6. Output/Transaction lineage expansion | Link snapshots through existing output/transaction foundations | Waves 3-5 | SEQUENTIAL_DEPENDENCY | Output/transaction protected-system authorization |

### First Recommended Implementation Workstream

`PROJECT_ATLAS_CANONICAL_CLIENT_CASE_CONTEXT_RECORDS_AND_OBJECTIVES_FOUNDATION_V1`

It should create only the Case objective, Fact, Criterion, and immutable revision/provenance foundation, with owner-scoped service/API boundaries and synthetic fixtures. It reuses `ClientCase`, `ClientCaseProperty`, authenticated Agent ownership, canonical property identity, Evidence Admission references, and existing auditing patterns. It does not yet enable general Scenario creation, resolver-driven cross-workspace prefill, readiness UX, Output/Transaction rewiring, professional-input promotion, client access, CRM integration, or real-data migration.

Expected schema impact is additive. A migration is expected, but no backfill or production business-data mutation is authorized. Required tests include owner isolation, scope resolution, revision/supersession immutability, fact/criterion non-conflation, source posture, foreign-reference denial, no automatic evidence admission, and synthetic-only human certification. The stop gate is `EXECUTIVE_AUTHORIZATION_REQUIRED: CANONICAL_CLIENT_CASE_CONTEXT_RECORDS_AND_OBJECTIVES_FOUNDATION_V1`.

## Safety Analysis

- Cross-client contamination is mitigated by authenticated owner derivation plus explicit Case/Scenario route context; no global mutable active context is permitted.
- Minimum necessary collection is enforced by capability contracts and by refusing unsupported fact types or broad personal profiling.
- DQG/Compass remains a separate record boundary. Client Case data is not CRM data and must not create CRM tasks, records, or synchronization.
- Authorization, Evidence Admission, Professional Input, Transaction truth, and Output approval/delivery retain their existing governed boundaries.
- Scenario assumptions remain visibly hypothetical and never become verified facts, criteria, plans, or transaction facts by inference.

## Architecture Invariant Proof

`FACT != CRITERION`: separate domain records, contracts, and source postures.

`FACT != SCENARIO ASSUMPTION`: Case facts are revisioned; Scenario versions are immutable overlays.

`SCENARIO != TRANSACTION`: Scenario models alternatives; Transaction records executed/operative reality.

`SCENARIO != ANALYTICAL RESULT`: results attach to a version/execution and are immutable derived artifacts.

`CLIENT CASE != CRM/SAVED SEARCH/OUTPUT/CLIENT AUTHORIZATION`: each retains its own root, lifecycle, owner semantics, and governing service.

`EVIDENCE != PROFESSIONAL INPUT`: both retain their existing admission and materialization boundary.

## Non-Action Proof and Review Gate

This workstream adds architecture documentation only. It changes no application source, Prisma schema, migration, API, route, component, style, test, runtime script, package, environment, configuration, production data, authentication, authorization, Evidence Admission, Professional Input, Output, Transaction, CRM, MLS, or external request state.

**RESULT: ARCHITECTURE_COMPLETE_EXECUTIVE_DECISIONS_REQUIRED**

**EXECUTIVE_ARCHITECTURE_REVIEW: REQUIRED**

**FIRST_IMPLEMENTATION_AUTO_STARTED: NO**
