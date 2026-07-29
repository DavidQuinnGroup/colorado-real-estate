# Colorado City Intelligence Persistence and Provider Activation Plan(tm) 1.0

Status: `PERSISTENCE_AND_PROVIDER_ACTIVATION_NOT_AUTHORIZED`

Date: July 29, 2026

## Executive Summary

Persistence and provider activation remain not authorized. This document defines the future activation gates required before Colorado City Intelligence can move from in-memory dry-run evidence candidates to durable evidence storage or external source execution.

## Current Boundary

The current evidence expansion is:

- In-memory only.
- Dry-run only.
- Non-customer-visible.
- Non-persistent.
- No external fetches.
- No provider credentials.
- No source scraping.
- No Prisma, schema, or migration changes.
- No public GIS, AI, telemetry, personalization, or customer account activation.

## Future Activation Gates

| Gate | Required Before Activation |
| --- | --- |
| Source rights | Terms, permitted use, storage, redistribution, attribution, and field-level limitations approved |
| Legal and compliance | Fair Housing, privacy, steering, public-records, and source-specific limitations reviewed |
| Schema authorization | Explicit Prisma/schema and migration authorization |
| Provider authorization | Credentials, rate limits, access method, retry policy, monitoring, and cost controls approved |
| Evidence quality | Deduplication, versioning, conflict preservation, freshness, and rollback behavior defined |
| Editorial workflow | Human review, balanced-language review, customer-usefulness review, and certification gates approved |
| Runtime safety | No customer-visible partial claims and no automatic publication from incomplete evidence |

## Future Execution Sequence

1. Approve source-by-source rights.
2. Approve storage model and schema.
3. Build internal persistence adapter.
4. Run non-public backfill dry run against a limited city/domain sample.
5. Review evidence conflicts and freshness.
6. Approve editorial certification workflow.
7. Certify one city for evidence-backed maturity.
8. Only then consider public publication.

## Stop Conditions

Stop before implementation if a future program requires unapproved provider access, scraping, public GIS, AI-generated customer claims, predictive market claims, demographic targeting, school or safety scoring, schema mutation without authorization, or customer-visible partial evidence.
