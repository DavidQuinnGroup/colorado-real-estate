# Boulder County Open Data Persistence Decision Gate 1

This is a future architecture gate. Existing persistence is not sufficient for durable external-source evidence storage. No schema, Prisma, migration, database write, provider confirmation bypass, source activation, or production persistence is authorized.

## Decision

- Existing persistence reusable: No.
- Future migration required: Yes.
- Reason: provider/counsel decisions, source license snapshots, versioned evidence, field exclusions, freshness, supersession, and public-display eligibility need first-class governed storage.

## Required Objects

- `source`
- `dataset`
- `source_license_snapshot`
- `provider_confirmation`
- `counsel_decision`
- `acquisition_run`
- `raw_record_pointer`
- `normalized_observation`
- `geographic_subject`
- `evidence_version`
- `attribution`
- `review_decision`

## Required Fields

`source_id`, `dataset_id`, `license`, `terms_url`, `accessed_at`, `modified_at_source`, `allowed_uses`, `prohibited_uses`, `field_exclusions`, `attribution_text`, `freshness_status`, `confidence`, `review_status`, and `supersedes_id`.

## Prohibited Until Separately Authorized

- Reusing existing market-data persistence as the evidence store.
- Unversioned source snapshots.
- Raw owner/person display.
- Writes from provider data into production.
