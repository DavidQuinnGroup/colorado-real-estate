# PROJECT ATLAS(tm)

## GIS 1.0 Evidence and Provenance Standard

Status: `GIS_1_0_SPRINT_2_EVIDENCE_AND_PROVENANCE_FOUNDATION_CERTIFIED`

Date: July 26, 2026

---

## Executive Purpose

This standard defines how Geographic Intelligence System evidence, provenance, immutable versions, lineage, supersession, conflicts, licensing, and reproducibility are represented before any provider governance, acquisition, persistence, retrieval, runtime, downstream, or customer visibility is authorized.

## Relationship to Sprint 1

Sprint 1 established architecture domains, subjects, activation, confidence, freshness, licensing, observations, provider boundaries, and fail-closed principles. Sprint 2 extends that foundation additively with evidence and provenance contracts. Sprint 1 domain states remain unchanged.

## Evidence Identity

Evidence identity is stable and governed. It is independent from provider display names, mutable locators, acquisition timestamps, database identifiers, and presentation labels. Deterministic fixture identities are derived from stable normalized content.

## Provider Identity

Provider identity distinguishes provider ID, name, type, role, originator status, distributor status, authority classification, jurisdiction, and provider version. Provider role never authorizes licensing, acquisition, persistence, runtime use, or customer display.

## Source Identity

Source identity identifies the governed source or dataset separately from provider identity. It records source ID, name, source type, dataset or publication ID, publisher, originating authority, source version, locator, jurisdiction, subject coverage, domain coverage, and update cadence.

## Publisher and Authority Separation

Originating authority, publisher, distributor, and acquiring provider remain separate roles. Known roles must not be collapsed into one field.

## Acquisition Events

Acquisition records describe fixture acquisition events separately from evidence content. Sprint 2 acquisition authorization remains false and no live acquisition exists.

## Immutable Evidence Versions

Evidence versions are immutable normalized records. Unchanged re-acquisition keeps the same content fingerprint; changed governed content produces a new evidence version and explicit supersession.

## Provenance Chain

The provenance chain can represent originating authority, publisher or dataset, distributor or provider, acquisition event, normalization, validated evidence version, observation, and derived intelligence without requiring all roles to exist for every future source.

## Temporal Semantics

Published, acquired, observed, effective start, effective end, expiration, and supersession time remain separate. No timestamp silently substitutes for another.

## Evidence Authority

Authority values include `UNKNOWN`, `INFORMAL`, `SECONDARY`, `COMMERCIAL`, `GOVERNMENTAL`, `STATUTORY`, and `AUTHORITATIVE`. Authority does not imply confidence, freshness, licensing, truth, or activation.

## Evidence Quality

Quality values include `UNKNOWN`, `INCOMPLETE`, `UNVERIFIED`, `VALIDATED`, `HIGH_INTEGRITY`, and `REJECTED`. Quality remains separate from authority, confidence, freshness, licensing, and activation.

## Evidence Freshness

Freshness reuses Sprint 1 values: `UNKNOWN`, `CURRENT`, `AGING`, `STALE`, and `EXPIRED`. Certification uses an explicit deterministic reference time and never the system clock.

## Licensing

Licensing values include `UNKNOWN`, `PUBLIC_DOMAIN`, `OPEN_LICENSE`, `CONTRACTUAL_INTERNAL_USE`, `CONTRACTUAL_DERIVED_USE`, `CONTRACTUAL_DISPLAY_USE`, `CONTRACTUAL_REDISTRIBUTION`, `RESTRICTED`, and `PROHIBITED`. Unknown rights fail closed.

## Permitted Use

Permitted-use values include `UNKNOWN`, `INTERNAL_RESEARCH_ONLY`, `INTERNAL_OPERATIONAL_USE`, `DERIVED_USE_ONLY`, `CUSTOMER_DISPLAY_ALLOWED`, `REDISTRIBUTION_ALLOWED`, and `PROHIBITED`. Customer display and redistribution remain unauthorized in all Sprint 2 fixtures.

## Fingerprints

Fingerprints are deterministic hashes of normalized content. Included fields are governed content, subject identity, domain identity, assertion identity, and stable source/version fields. Excluded fields include generated timestamps, random IDs, database IDs, local filesystem paths, and presentation labels.

## Supersession

Supersession records predecessor, successor, evidence family, subject, domain, reason, supersession time, historical validity, and invalidation state. Self-supersession, cycles, family mismatch, subject mismatch, and domain mismatch fail closed.

## Withdrawal and Invalidation

Withdrawn and invalidated evidence must remain historically auditable but cannot be represented as current. Invalidated evidence cannot support current observations.

## Conflict Preservation

Conflicting evidence is preserved explicitly. Sprint 2 records deterministic fixture conflicts without automatically choosing a winner.

## Evidence-to-Observation Lineage

Observations reference exact evidence version IDs through a lineage contract with transformation identity, transformation version, normalized input set, lineage fingerprint, and completeness state.

## Reproducibility

Derived or observed results must identify evidence versions, observation versions, transformation identity, transformation version, normalized inputs, assumptions, and deterministic fingerprints.

## Auditability

The foundation preserves enough information to audit acquisition, normalization, validation, rejection, supersession, conflict detection, and transformation consumption. No production audit persistence is implemented.

## Subject Integrity

Evidence attached to one subject cannot support another subject. Aliases, parent regions, service areas, nearby places, or inferred containment do not authorize transfer.

## Fail-Closed Rules

Missing identity, missing provider, missing source, missing acquisition, missing fingerprint, unknown licensing, unknown permitted use, subject mismatch, domain mismatch, invalid supersession, incomplete provenance, expired-as-current evidence, withdrawn-as-current evidence, and invalidated evidence supporting current observation all fail closed.

## Fixture Scenarios

Sprint 2 certifies ten synthetic internal-only scenarios: valid evidence chain, unchanged re-acquisition, changed evidence version, conflicting evidence, unknown licensing, stale or expired evidence, invalid supersession, subject transfer attempt, incomplete provenance, and invalidated evidence in observation.

## Safety Checks

The safety check proves no Prisma, SQL, migrations, database clients, network calls, environment-variable access, credentials, routes, pages, scheduler, provider polling, persistence, retrieval, runtime registry, customer visibility, customer display authorization, redistribution authorization, geographic relationship creation, hierarchy inference, Colorado runtime activation, or certified GOF/EKCP/Sprint 7 behavior changes.

## Retained Prohibitions

No live provider was connected. No real provider rights were assumed. No production persistence, retrieval, runtime activation, downstream integration, customer behavior change, customer visibility, or geographic relationship was implemented.

## Future Decision Gates

GIS 1.0 Sprint 3 Provider Inventory Governance is the recommended next governed phase if separately authorized. Sprint 2 does not authorize provider adapters, provider selection, acquisition, persistence, retrieval, runtime use, downstream integration, or customer presentation.
