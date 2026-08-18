# REIE Customer-Facing Capability Completion Standard

Program: REIE Product Experience, Capability, and Master-Vision Reconciliation

Date: 2026-08-18

Status: `EXECUTIVE_CUSTOMER_FACING_CAPABILITY_COMPLETION_STANDARD_ADOPTED`

## Purpose

This standard defines when a named customer-facing capability may be treated as
complete during reconciliation. It prevents visual polish, backend presence,
or planning language from being mistaken for a finished customer experience.

A capability is complete only when all four gates pass for the intended scope:

1. Functional correctness.
2. Intelligence usefulness.
3. Experience coherence.
4. Production certification.

The standard is a governance and review contract. It does not authorize
implementation, redesign, provider activation, or production release.

## Gate 1: Functional Correctness

The intended user can reach the capability, complete its supported workflow,
and receive the documented result without broken links, contradictory state,
unsupported inputs, or silent failure. Inputs, outputs, empty states, loading
states, error states, responsive behavior, and handoff boundaries are defined.
Any persistence, account, customer-data, provider, or workflow mutation must
have separate authorization and evidence.

## Gate 2: Intelligence Usefulness

The capability answers a real decision question with relevant, inspectable, and
appropriately bounded intelligence. It identifies source, freshness,
limitations, confidence, assumptions, and professional-review boundaries where
they affect reliance. Derived guidance must not present incomplete evidence as
ownership, title, legal, tax, valuation, suitability, or investment authority.

## Gate 3: Experience Coherence

The capability belongs to a coherent journey and uses the shared REIE product
experience grammar. Its purpose is understood immediately, the hierarchy is
scannable, progressive disclosure keeps complexity manageable, and the next
action is clear. Navigation, terminology, visual rhythm, mobile layout,
accessibility, contrast, performance, feedback, and professional handoff are
consistent with the Product Experience North Star and current certified
architecture.

## Gate 4: Production Certification

The intended production route or surface is verified from the deployed public
domain or the authorized operational environment. Certification records
provenance, route or entry point, responsive behavior, console or runtime
errors, key DOM or schema markers, forbidden behavior checks, and protected
system boundaries. Local code presence or a successful build alone is not
production certification.

## Reconciliation Status Vocabulary

- `EXISTS_AND_SURFACED`: all four gates are evidenced for the intended scope.
- `PARTIALLY_IMPLEMENTED`: meaningful behavior exists, but one or more gates
  or intended dimensions remain incomplete.
- `EXISTS_BUT_POORLY_SURFACED`: capability exists but is difficult to discover,
  fragmented, or incoherent in the customer journey.
- `BACKEND_ONLY`: contracts, engines, or internal tooling exist without a
  complete customer-facing surface.
- `SPECIFIED_BUT_NOT_IMPLEMENTED`: planning or Master references exist without
  corresponding current product behavior.
- `NOT_FOUND_IN_REPOSITORY`: no current repository evidence was found.
- `DEFERRED_BY_GOVERNANCE`: explicitly held outside the current authorized
  scope.

These statuses are evidence labels, not release approvals. A capability may
remain operationally useful while still being `PARTIALLY_IMPLEMENTED` or
`EXISTS_BUT_POORLY_SURFACED`.

## Required Reconciliation Record

Each named capability review should record:

- the user question and intended audience;
- current route, component, contract, or internal entry point;
- the four-gate status and evidence for each gate;
- source, freshness, limitation, and professional handoff posture;
- known gaps and superseding certified decisions;
- whether the capability is customer-facing, internal, or both;
- the next authorization gate.

## Non-Authorization Boundary

This standard does not authorize route implementation, visual redesign,
navigation changes, glassmorphism or liquid-glass effects, provider/API or GIS
access, data retrieval, database/schema changes, Search or Typesense mutation,
customer-data mutation, CRM/email/queue behavior, deployment, or production
activation.
