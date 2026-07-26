# PROJECT ATLAS(tm)

## GIS 1.0 Fixture Provider Adapter Standard

Status: `GIS_1_0_SPRINT_4_CONTROLLED_FIXTURE_PROVIDER_ADAPTER_CERTIFIED`

Date: July 26, 2026

---

## Executive Purpose

This standard defines how a clearly fictional provider-specific fixture payload can be transformed through the certified GIS provider-neutral evidence architecture without selecting a real provider, connecting to a provider, acquiring external data, persisting data, retrieving production evidence, activating runtime behavior, integrating downstream systems, or changing customer behavior.

Sprint 4 proves an adapter pattern only. It does not approve a real provider, real dataset, acquisition method, contract, license, use right, persistence model, retrieval model, runtime integration, downstream integration, or customer-visible experience.

## Relationship to Sprints 1-3

Sprint 1 established fail-closed activation, subject integrity, domain identity, provider neutrality, customer separation, confidence, freshness, licensing, and permitted-use boundaries.

Sprint 2 established provider identity, source identity, acquisition records, immutable evidence versions, provenance chains, deterministic fingerprints, supersession, conflict preservation, evidence-to-observation lineage, and fail-closed licensing/provenance behavior.

Sprint 3 established governed provider inventory categories, provider/source/tool/dataset/authority/portal separation, jurisdiction-specific source requirements, licensing uncertainty, overlap preservation, verification states, and future provider-evaluation governance.

Sprint 4 reuses those contracts additively. It does not modify their semantics.

## Synthetic Provider Identity

- Provider name: `Atlas Synthetic Geographic Evidence Provider`
- Provider ID: `ATLAS_SYNTHETIC_GEO_EVIDENCE_PROVIDER`
- Adapter ID: `GIS_SPRINT_4_SYNTHETIC_PROVIDER_ADAPTER`
- Adapter version: `1.0.0`
- Fixture schema version: `GIS_SPRINT_4_SYNTHETIC_FIXTURE_SCHEMA_V1`
- Normalization version: `GIS_SPRINT_4_NORMALIZATION_V1`

The provider is fictional, internal, and repository-owned. No real provider was selected, contacted, represented, copied, or hidden behind the fixture identity.

## Fixture-Only Boundary

The fixture contract requires `fixtureOnly: true`. Missing or false fixture markers fail closed before evidence formation.

The adapter is invoked only by deterministic fixtures, safety checks, and certification scripts. It is not registered in routes, pages, workers, queues, schedulers, runtime registries, service dispatchers, Search, Maps, Property Intelligence, AI, Executive Intelligence, Seller Intelligence, Market Intelligence runtime, alerts, CRM, email, MLS, or customer behavior.

## Provider-Specific Input Contract

The synthetic payload includes fixture record identity, fixture schema version, synthetic provider identity, synthetic dataset identity, source record key, subject key, domain key, assertion key, value, unit, reported time, effective interval, publication time, acquisition time, licensing classification, permitted-use classification, source authority, provider payload version, fixture checksum, optional synthetic metadata, and fail-closed activation flags.

These field names are synthetic and repository-owned. They do not copy or infer a real provider schema.

## Validation Stages

The pipeline validates fixture marker, schema version, provider identity, required fields, activation drift, temporal ordering, licensing, permitted use, exact subject, exact domain, checksum, and provenance completeness before validated evidence formation.

Malformed, incomplete, unsupported, licensing-unknown, subject-mismatched, domain-mismatched, temporally invalid, checksum-mismatched, incomplete-provenance, and activation-drift inputs produce deterministic rejection classifications and reasons.

## Normalization Stages

The adapter distinguishes raw fixture payload, parsed provider record, normalized evidence candidate, validated evidence version, provenance chain, and observation candidate.

Provider-specific parsing remains behind the synthetic adapter boundary. Provider-neutral evidence semantics depend on Sprint 2 contracts, not fixture field names.

## Identity and Fingerprints

Deterministic identities are formed for provider, source, acquisition event, evidence family, evidence version, normalized content, provenance chain, observation candidate, and adapter result.

Fingerprint inclusions: governed semantic fields, subject identity, domain identity, assertion identity, value, unit, temporal fields, source identity, adapter identity, schema version, normalization version, evidence version, provenance identity, and observation identity.

Fingerprint exclusions: current system time, random IDs, database-generated IDs, process IDs, filesystem paths, mutable presentation labels, and object insertion order.

## Evidence and Provenance Output

Successful output includes:

- Provider identity.
- Source identity.
- Acquisition record with `SYNTHETIC_FIXTURE` method.
- Evidence family identity.
- Immutable evidence version.
- Provenance chain.
- Observation candidate.
- Deterministic output fingerprint.
- Fail-closed activation state.

All successful output is internal-only, non-customer-visible, non-redistributable, non-runtime-enabled, non-persistent, and non-retrieval-enabled.

## Duplicate and Changed Versions

Repeated identical fixture input produces the same evidence family, same evidence version, same content fingerprint, and deterministic duplicate classification.

Changed governed content preserves the same evidence family, creates a new evidence version, creates a new content fingerprint, and records the predecessor evidence version.

## Retained Prohibitions

No real provider was selected. No real provider payload was used. No provider was contacted. No account was created. No credentials were used. No external call occurred. No data was acquired. No production persistence exists. No production retrieval exists. No runtime registration exists. No downstream integration exists. No customer behavior changed. No geographic relationship was created.

## Future Decision Gate

The next governed phase, if separately authorized, is GIS 1.0 Sprint 5 Provider Evaluation and Selection Governance. Sprint 4 does not begin or authorize Sprint 5.
