# PROJECT ATLAS(TM) - Source Quality Operational Manifest MVV Certification

## Scope

This MVV certifies a typed, repository-versioned, partial operational Source Quality input manifest. It is an explicit inclusion dataset only; it is not a source registry, discovery system, activation mechanism, legal-use decision, customer-display decision, provider preference, quality score, or completeness claim.

## Initial operational posture

The initial manifest contains two explicitly named internal canonical source identities with certification-only structured linkages. Their inclusion posture is `STRUCTURED_EVIDENCE_WITH_KNOWN_GAPS`. Rights, technical access, freshness, attribution, and provenance conclusions remain downstream unknown unless separate canonical structured evidence is supplied.

The first set intentionally excludes MLS, ATTOM, LightBox, county correspondence, and the protected county reconciliation artifact. No provider/county narrative is parsed or composed.

## Contract boundary

The manifest validates finite identity, coverage, inclusion, review authority, certification, linkage-shape, limitation, and fingerprint metadata. It then converts valid explicit entries to the existing Source Quality Summary Assembly request. It does not normalize evidence, classify quality, resolve conflicts, aggregate reports, enumerate Source Registry, scan the repository, or discover sources.

## Firewalls

Every valid manifest preserves:

- `SOURCE_ACTIVATION_NOT_AUTHORIZED_BY_MANIFEST`
- `CUSTOMER_DISPLAY_NOT_GRANTED_BY_MANIFEST`
- `LEGAL_USE_NOT_APPROVED_BY_MANIFEST`
- `NO_QUALITY_SCORE`
- `NO_PROVIDER_RANKING`
- `NO_COMPLETENESS_CLAIM`

The admin page and its fixture remain unchanged and `PREVIEW_FIXTURE_ONLY`.

## Validation

The dedicated checker covers valid sparse data, deterministic ordering/fingerprints, duplicate and malformed entries, unsupported coverage/inclusion, missing certification/review authority, non-representable narrative/URL/PII/secret fields, no discovery, Assembly conversion, Report consumption, and static absence of DB/network/provider/CRM/Search/Typesense/UI/worker/communication/protected-artifact behavior.

## Final classification

`SOURCE_QUALITY_OPERATIONAL_MANIFEST_MVV_IMPLEMENTED_AND_LOCALLY_CERTIFIED` is permitted only after dedicated and canonical Source Quality checkers, TypeScript, static safety, diff, exact four-file scope, and protected-artifact checks pass.

## Next gate

`READY_FOR_SOURCE_QUALITY_OPERATIONAL_MANIFEST_PRIMARY_CANONICAL_INTEGRATION_REVIEW`.

Even after canonical integration, the admin preview remains fixture-only, coverage remains partial, no source is activated, no customer-display authority is granted, and no provider/county narrative becomes automatically composable.
