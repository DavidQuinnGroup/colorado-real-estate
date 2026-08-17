# REIE Treasurer Finite Exact Source Definition MVV Certification

Status: FINITE_EXACT_SOURCE_DEFINITION_MVV_CERTIFIED_LOCAL

Decision: `BOUNDED_TREASURER_EXACT_SOURCE_DEFINITION_REFACTOR_RECOMMENDED`

The Treasurer exact-source helper centralizes only finite identity-level metadata for canonical County Treasurer sources:

- `SRC-BOULDER-COUNTY-TREASURER`
- `SRC-ARAPAHOE-COUNTY-TREASURER`
- `SRC-ADAMS-COUNTY-TREASURER`

Centralized fields are limited to source ID, source class, jurisdiction, and responsible organization. The helper does not centralize rights, technical access, freshness, attribution, provenance, fee, sensitivity, reviewed dates, certification, evidence, tax-currentness posture, payment semantics, lien/deed semantics, Public Trustee boundaries, Manifest membership, activation, or claim eligibility.

Fail-closed sources remain rejected until separately authorized, including Jefferson County Treasurer, Weld County Treasurer, Larimer County Treasurer, fake/generic County Treasurer, provider-only, EXP, and SRA identities.

Source-specific Registry records, evidence modules, certification references, fingerprints, limitations, and Operational Manifest entries remain independent.
