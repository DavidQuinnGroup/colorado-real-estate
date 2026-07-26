# PROJECT ATLAS(tm)

## GIS 1.0 Provider Inventory Governance Standard

Status: `GIS_1_0_SPRINT_3_PROVIDER_INVENTORY_GOVERNANCE_CERTIFIED`

Date: July 26, 2026

---

## Executive Purpose

This standard defines how Geographic Intelligence System provider inventory context is represented before any provider selection, licensing validation, acquisition, persistence, retrieval, runtime use, downstream integration, or customer visibility is authorized.

Sprint 3 is a governance and inventory classification layer only. It records provider categories, authority posture, licensing uncertainty, permitted-use uncertainty, operational-tool separation, consumer-portal separation, overlap risks, review dispositions, and fail-closed stop conditions.

## Relationship to Prior Sprints

Sprint 1 established provider-neutral geographic intelligence domains, subjects, evidence, observations, activation, provider-boundary, and fail-closed contracts.

Sprint 2 established evidence identity, source identity, acquisition records, immutable versions, provenance, supersession, conflicts, lineage, licensing, permitted-use, and deterministic fingerprints.

Sprint 3 extends those contracts with provider inventory governance. It does not override Sprint 1 activation controls or Sprint 2 evidence and provenance controls.

## Provider Inventory Identity

Every provider inventory entry has a stable inventory entry ID, canonical name, optional alternate names, category, entity type, provider role, source or dataset identity placeholder, jurisdiction, coverage posture, domain relevance, non-GIS REIE relevance, evidence categories, operational capabilities, and explicit governance disposition.

Inventory identity is not an account identity, credential identity, source credential, provider connection, production record, or acquisition authorization.

## Provider and Authority Separation

Sprint 3 preserves separation between:

- Originating authority.
- Primary publisher.
- Distributor.
- Aggregator.
- Commercial vendor.
- Operational tool.
- Consumer portal.
- Supplemental research source.
- Generic source class.

No role by itself authorizes acquisition, licensing reliance, persistence, runtime use, customer display, redistribution, or downstream integration.

## Licensing and Permitted Use

All Sprint 3 inventory entries remain fail-closed for licensing and permitted use. Unknown licensing and unknown permitted use are intentional stop conditions, not implementation gaps.

Customer display authorization and redistribution authorization remain false for every entry.

## Acquisition Readiness

Sprint 3 may classify possible acquisition methods, but it does not perform acquisition and does not authorize future acquisition. `APPROVED_FOR_FUTURE_PROVIDER_EVALUATION` means only that a candidate can be evaluated under a later authorization gate.

No live providers, APIs, feeds, downloads, scraping, browser automation, credentials, or network calls are implemented.

## Operational Tool Separation

Operational systems such as showing workflows, lockbox tools, CMA tools, market-stat tools, and MLS software interfaces may be represented as inventory context. They remain operational-tool-only unless a later governance process proves a separate evidence, licensing, and permitted-use basis.

## Consumer Portal Separation

Consumer portals and map/street-view references may be represented as research-reference context only. Sprint 3 does not authorize scraping, ingestion, copying, customer display, redistribution, embedding, link-based integration, or derivative use.

## Generic Source Classes

Generic source classes such as county assessor sources, school district sources, building departments, planning departments, HOA sources, wildfire-risk sources, and rental-licensing sources require jurisdiction-specific instance review before any future activation.

Generic class inclusion does not select a provider and does not create an approved authority.

## Overlap Preservation

Overlaps are preserved as unresolved records. Listing data, public records, parcel/GIS records, market statistics, consumer research, commercial analytics, and regulatory or planning content may overlap across sources, but overlap does not imply equivalence.

Each overlap keeps authority, coverage, temporal, and licensing differences unresolved.

## Retired and Rejected Candidates

Rejected or retired candidates must retain reason and trace. Sprint 3 preserves rejection and verification states without activating the candidate.

## Safety Checks

The provider inventory safety check proves that Sprint 3 is deterministic, internal-only, verification-explicit, fail-closed, network-free, adapter-free, acquisition-free, runtime-inert, relationship-free, customer-invisible, and isolated from certified GOF, EKCP, EIP Sprint 7, GIS Sprint 1, and GIS Sprint 2 behavior.

## Retained Prohibitions

No provider use is authorized. No live acquisition, persistence, retrieval, runtime activation, downstream integration, customer-visible change, Search, Maps, Property Intelligence, AI, Executive Intelligence, relationship creation, hierarchy traversal, Colorado runtime consumption, or GOF Wave 5 work is authorized by this standard.

## Future Decision Gates

The next governed phase, if separately authorized, is GIS 1.0 Sprint 4 Controlled Fixture Adapter. Sprint 4 must remain fixture-only and must not connect to live providers, validate real provider rights, persist production data, retrieve production evidence, activate runtime use, integrate downstream systems, or expose customer-visible evidence.
