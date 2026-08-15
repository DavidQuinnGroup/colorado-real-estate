# REIE Source Quality Evidence Normalization MVV Certification

## Scope

This additive MVV establishes a pure deterministic linkage foundation for a later Source Quality Control summary. It does not implement the summary, UI, provider integration, workflow, or source activation.

## Join root and linkage

The only source identity root is the existing Source Registry SRC-* identifier. One typed reviewed linkage record connects one source root with one evidence class and relationship type. The record is constrained to an allowlisted contract, repository reference, verification state, review date, limitation code, and linkage provenance.

No provider name, county name, filename, URL, category, prose, semantic similarity, or similar-looking SRA-* identifier can join evidence. An absent or foreign link remains unknown.

## Authority and postures

Source Registry remains authoritative for identity, class, owner, declared activation, permitted use, claim/customer-display posture, source paths, and registry freshness context. Rights, licensing, freshness, attribution, provenance, and certification records retain authority for their own domains.

The normalized output separately reports rights, technical access, unchanged registry activation, freshness, attribution, provenance, certification, linkage state, conflict, reasons, and deterministic fingerprint. It has no composite score and cannot create approval or activation authority.

Missing, pending, unverified, unknown, stale, incomplete, malformed, or narrative-only required evidence is fail-closed. Conflicting verified structured evidence is preserved as CONFLICT_REQUIRES_REVIEW. Certification identifies review evidence only and never grants rights, customer-display authority, or activation.

## Narrative-only evidence

Provider/county counsel packages, trial/terms materials, pending correspondence, and dataset-specific prose may only be represented as a certification reference with the NARRATIVE_ONLY limitation. They cannot produce a rights, freshness, attribution, technical-access, or activation posture.

## Safety boundary

The runtime contract has no provider/network, credentials, Prisma/database, CRM, Search, Typesense, route/UI, worker/queue, communication, filesystem, or protected-county-artifact dependency. It does not acquire, persist, activate, mutate, or contact any source.

## Local certification

The checker covers explicit reviewed rights/provenance/freshness/certification linkage, missing and unknown roots, pending/restricted/unknown postures, stale freshness, incomplete provenance, missing certification, malformed references, conflicts, rejected fuzzy joins, narrative-only handling, deterministic fingerprints, immutable activation/customer-display posture, and static prohibited-reference scanning.

The later Source Quality Control Summary contract must consume only these normalized referenced postures and must not infer rights or activation.
