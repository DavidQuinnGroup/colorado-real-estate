# PROJECT ATLAS Command And Execution Location Standard

Program: PROJECT ATLAS / REIE Product Experience, Capability, and Master-Vision Reconciliation
Date: 2026-08-18
Status: `PROJECT_ATLAS_GOVERNING_DOCUMENT_CONSULTATION_STANDARD_ADOPTED`

## Purpose

This is the permanent repository standard for locating execution authority,
continuation handoffs, governing-source references, reconciliation records, and
validation evidence. It prevents a planning statement, historical handoff, or
implementation preference from being treated as current architecture or
permission to execute.

This standard is documentation and governance only. It authorizes no runtime,
provider, customer-data, database, Search, deployment, or production action.

## Governing Precedence

Use the following precedence when sources conflict:

1. Current certified PROJECT ATLAS architecture and adopted Executive decisions
   define what the system currently is and record intentional supersession.
2. `PROJECT ATLAS REIE V 7.1 - ADJUSTMENTS & MODIFICATIONS` defines explicit
   evolution and modification requirements.
3. `REAL ESTATE INTELLIGENCE ENGINE-MASTER V 7.1` is the completeness and
   reference authority for capabilities not superseded by later certification.
4. `2026_CREM_Ch 09` and `Compass Colorado Agent Policy Manual March 2026`
   constrain otherwise-permitted product architecture where applicable.

The following adopted repository standards also govern relevant product work:

- `REIE-PRODUCT-EXPERIENCE-NORTH-STAR.md`
- `REIE-CUSTOMER-FACING-CAPABILITY-COMPLETION-STANDARD.md`

An implementation desire cannot supersede a mandatory legal or brokerage
requirement. A readiness record cannot create implementation or release
authority.

## Four-Document Governing Check

Before changing any of the following, Executive HQ must reconcile the work
against the four governing source groups above:

- product architecture or capability completeness;
- a major customer-facing capability or specialized Hub;
- financing, lending, investment, brokerage, agency, or disclosure behavior;
- customer-facing claims, content, Compass branding, or technology behavior;
- major navigation, information architecture, roadmap, or supersession;
- a source, evidence, or professional-boundary interpretation that affects
  customer reliance.

The consultation record must contain:

| Field | Required content |
| --- | --- |
| `SOURCE` | Exact governing document or certified repository record. |
| `SECTION / HEADING` | Specific heading, module, or requirement location. |
| `REQUIREMENT` | Short faithful requirement statement. |
| `CURRENT INTERPRETATION` | What the requirement means for current work. |
| `SUPERSESSION STATUS` | `CURRENT`, `PARTIALLY_SUPERSEDED`, `SUPERSEDED`, or `UNRESOLVED`. |
| `COMPLIANCE QUESTION` | Legal, brokerage, source-rights, or disclosure question, or `NONE`. |

Direct Executive-HQ evidence supplied for a bounded review must be labelled
`DIRECT_EVIDENCE`. Repository inspection is `REPOSITORY_DERIVED`. A missing,
conflicting, inaccessible, or unverified requirement is
`UNKNOWN_REQUIRES_REVIEW`. These classifications must not be silently merged.

## Trigger And Exception Rule

The full four-document check is required for material architecture,
capability, claim, disclosure, route, or supersession decisions. It is not
required for trivial refactors, typo fixes, isolated deterministic tests,
mechanical implementation beneath an already-certified architecture, or visual
token changes that do not alter capability, claim, disclosure, routing,
brokerage identity, or compliance.

When the exception is used, the handoff should state the exception and identify
the certified architecture that already governs the change.

## Execution Locations

- `docs/CHAT_START.md` is the active continuation handoff and archival ledger.
  Its newest top block is the current restart instruction; older blocks remain
  historical and must not be mistaken for current baseline truth.
- `docs/project-atlas/executive-library/` is the canonical location for
  executive standards, reconciliation registers, decision packets, and
  certification records.
- `lib/`, `app/`, `components/`, and `scripts/` are implementation and
  deterministic-validation locations. They cannot establish Executive
  supersession by themselves.
- Git status, exact SHA, divergence, changed-file scope, and validation output
  are repository evidence and must be revalidated at the time of execution.

## Continuation Handoff Minimum

Every material handoff must state:

- repository path, branch, HEAD, origin, divergence, and working-tree status;
- active package and exact authorization boundary;
- changed and protected file scope;
- current classification and unresolved questions;
- governing-document consultation record or explicit exception;
- validations run and failures, including unrelated pre-existing failures;
- next authorization gate.

Recorded SHAs, readiness, feasibility, official-source status, or a prior
handoff never authorize push, merge, implementation, activation, retrieval,
customer display, or deployment without explicit current authorization.

## Related Standards

- `REIE-PRODUCT-EXPERIENCE-NORTH-STAR.md`
- `REIE-CUSTOMER-FACING-CAPABILITY-COMPLETION-STANDARD.md`
- `REIE-7.1-ADJUSTMENTS-AND-MODIFICATIONS-TRACEABILITY-MATRIX.md`
