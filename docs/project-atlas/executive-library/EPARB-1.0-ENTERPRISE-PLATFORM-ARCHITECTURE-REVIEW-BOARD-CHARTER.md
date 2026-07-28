# PROJECT ATLAS(tm) - EPARB 1.0 Enterprise Platform Architecture Review Board Charter(tm)

Status: `EPARB_1_0_ESTABLISHED_RUNTIME_IMPLEMENTATION_NOT_AUTHORIZED`

Date: July 28, 2026

## 1. Executive Summary

The Enterprise Platform Architecture Review Board(tm) Version 1.0 is formally established as a governed repository-level platform architecture authority for PROJECT ATLAS(tm).

EPARB protects the long-term architectural integrity of PROJECT ATLAS by reviewing cross-program and shared platform concerns before implementation, activation, deployment, or production mutation decisions are made.

EPARB complements existing enterprise programs. It does not replace CEP, CIM, CAO, EOI, GIS, EIP, EKCP, GOF, or any future governed program. Each program retains its domain responsibilities, and David retains final executive authorization for production, activation, implementation, provider, database, and customer-visible decisions.

This establishment is governance-only. It does not authorize runtime implementation, authentication changes, authorization changes, middleware changes, admin routing changes, EOI Sprint 3 remediation, deployment, telemetry, AI, GIS, provider activation, database work, production mutation, or EPARB Review 1 implementation.

## 2. Mission

Protect the long-term architectural integrity of PROJECT ATLAS.

EPARB exists to ensure that platform-level choices are reviewed with enterprise context before cross-program architecture is duplicated, fragmented, prematurely automated, or activated without adequate evidence.

## 3. Scope

EPARB governs cross-program and shared platform architecture only.

In scope:

- authentication architecture
- authorization architecture
- administrative access
- shared middleware
- enterprise APIs
- protected admin services
- executive workspaces
- dashboard frameworks
- observability
- configuration
- feature activation
- repository governance
- shared platform services
- cross-domain data contracts
- cross-program dependencies

Out of scope:

- ordinary single-program implementation when no shared platform concern exists
- customer-facing copy or UI changes that do not affect shared architecture
- operational execution decisions owned by CAO
- measurement activation decisions owned by CIM and executive authorization
- provider-bound GIS progression without separate GIS authorization
- production mutation or deployment authorization

## 4. Authority

EPARB may:

- review shared platform architecture
- recommend architecture direction
- approve architecture for executive authorization
- reject unsafe or duplicative platform direction
- require readiness gates
- require remediation plans
- establish shared standards

David retains final executive authorization.

EPARB may not independently authorize production mutation.

EPARB may not independently activate providers.

EPARB may not bypass David's executive authorization.

EPARB may not implement runtime changes automatically.

EPARB may not bypass existing program governance.

EPARB decisions are architecture governance decisions only until a separately authorized implementation or production certification directive exists.

## 5. Guiding Principles

- Enterprise Before Program
- Governance Before Automation
- Reuse Before Reinvention
- Evidence Before Intelligence
- Security by Default
- Platform Consistency
- Long-Term Stewardship
- Fail Closed
- Least Privilege
- Human Accountability

## 6. Review Triggers

EPARB review is required or strongly recommended when a proposal affects:

- shared authentication
- shared authorization
- admin access
- middleware
- shared APIs
- platform services
- observability
- configuration
- feature activation
- executive dashboards
- repository platform changes
- cross-domain data contracts
- cross-program dependencies

## 7. Standard Review Questions

Every EPARB review should address:

- Ownership: who owns the capability and who operates it?
- Reuse: what existing architecture can be reused?
- Coupling: what program or runtime dependencies are introduced?
- Governance: what authority, certification, and lifecycle gates apply?
- Security: what access, authorization, and exposure risks exist?
- Simplicity: is the proposal no broader than the problem requires?
- Longevity: will the architecture remain maintainable as programs mature?
- Operational Impact: what human or business process changes are implied?
- Customer Impact: what customer-visible behavior changes are implied?
- Reversibility: can the decision be rolled back or contained?
- Dependency Risk: what data, provider, credential, or environment dependencies exist?
- Evidence Quality: what repository, production, or operator evidence supports the decision?

## 8. Decision Outcomes

Standard EPARB outcomes:

- `APPROVE_FOR_EXECUTIVE_AUTHORIZATION`
- `APPROVE_WITH_CONDITIONS`
- `DEFER_PENDING_EVIDENCE`
- `REQUIRE_REMEDIATION`
- `REJECT`
- `OUT_OF_SCOPE`

An EPARB approval does not itself authorize implementation, deployment, provider activation, database changes, production mutation, telemetry activation, AI activation, GIS progression, or customer-visible changes.

## 9. Standard Lifecycle

The standard EPARB lifecycle is:

1. Concern Identified
2. Architecture Review
3. EPARB Review
4. Executive Authorization
5. Controlled Implementation
6. Production Certification
7. Strategic Completion Review

The lifecycle is intentionally sequential. EPARB may recommend readiness gates, but it cannot skip executive authorization or production certification.

## 10. Relationship to Enterprise Programs

CEP owns foundational customer experience.

CIM owns measurement governance, privacy, consent, and telemetry activation boundaries.

CAO owns customer acquisition operating model, service levels, consultation workflow, and lead disposition governance.

EOI owns protected operational intelligence reporting and executive visibility.

GIS, EIP, EKCP, GOF, GMA, and GKC retain their certified boundaries, provider restrictions, activation gates, and no-activation limits unless separately authorized.

EPARB owns cross-program platform architecture review. It should identify shared standards and duplicated platform concerns, then route implementation to the proper governed program or executive decision.

## 11. Runtime and Production Boundaries

This charter does not authorize:

- customer-facing runtime behavior changes
- authentication changes
- authorization changes
- middleware changes
- admin routing changes
- database schema changes
- migrations
- persistence
- deployment
- EOI Sprint 3 remediation
- telemetry activation
- AI activation
- GIS activation
- provider activation
- production mutation
- automated governance decisions

The accompanying TypeScript contract is runtime-neutral governance metadata only. It is not consumed by runtime routes.

## 12. Initial Review Portfolio

The inaugural EPARB review portfolio is defined in:

`docs/project-atlas/executive-library/EPARB-1.0-INITIAL-REVIEW-PORTFOLIO.md`

The next recommended executive review is:

`EPARB-REVIEW-001 - Enterprise Administrative Authentication and Access Architecture`

Priority:

`CRITICAL`

Review 1 is not implemented by this charter.

## 13. Validation

Deterministic validation command:

`npm run check:eparb-governance`

The check verifies:

- EPARB mission exists
- authority boundaries exist
- David retains final executive authorization
- prohibited actions are explicit
- review outcomes are complete
- review lifecycle is complete
- initial review portfolio is complete
- Review 1 is marked `CRITICAL`
- EPARB does not authorize production mutation
- EPARB does not bypass existing program governance
- no runtime activation path exists

## 14. Final Governed Status

`EPARB_1_0_ESTABLISHED_RUNTIME_IMPLEMENTATION_NOT_AUTHORIZED`

EPARB 1.0 is established as a governed architecture review authority. Runtime implementation, Review 1 implementation, deployment, production mutation, authentication changes, authorization changes, middleware changes, EOI remediation, telemetry, AI, GIS, provider activation, and database work remain not authorized.
