# REIE Source Quality Admin Checker Authority Separation MVV Certification

## Authority Boundary

`scripts/checkSourceQualityOperationalManifest.ts` owns exact Operational Manifest source membership, source count, inclusion-class assertions, deterministic Manifest and entry fingerprints, entry preservation, and source-specific eligibility assertions.

`scripts/checkSourceQualityAdminPreview.ts` owns Admin rendering integration: canonical Manifest consumption and validation, Assembly and Report invocation, dynamic `report.sourceCount` display, fixture separation, fail-closed handling, coverage disclosures, authority firewalls, and prohibited-dependency checks.

## Removed Duplication

The Admin checker no longer hardcodes Manifest membership, an operational source count, an inclusion class for every current entry, or source-set-dependent Report classification totals. It verifies dynamic count propagation by comparing Assembly and Report counts to the validated Manifest’s current entry count.

## Future Expansion Posture

A future valid Manifest expansion from three to four sources does not require an Admin checker membership/count edit. The Operational Manifest checker remains the authoritative location for the exact new source-set and eligibility assertions.

## Preserved Boundaries

The application page is unchanged. Manifest data is unchanged. No Source Quality evidence, authority firewall, sparse-coverage semantics, provider behavior, or operational-source semantics changed.
