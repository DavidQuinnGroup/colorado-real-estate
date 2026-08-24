# IRES Official CityID Evidence Admission and Supabase IO Diagnostic Certification

**Certification date:** 2026-08-24
**Scope:** Internal IRES `IRE_CityID` source-geography evidence governance and a read-only Supabase availability/query-statistics diagnostic.

## Certified outcomes

- `PROJECT_ATLAS_IRES_CITYID_OFFICIAL_EVIDENCE_ADMITTED`
- `IRES_CITYID_VERSIONED_SOURCE_GEOGRAPHY_CONTRACT_CERTIFIED`
- `SUPABASE_DISK_IO_ROOT_CAUSE_RECONCILED`
- `LIVE_QUERY_DIAGNOSTIC_BLOCKED`
- `MICRO_UPGRADE_RECOMMENDED_NOW`
- `READY_FOR_EXECUTIVE_SUPABASE_NANO_TO_MICRO_AUTHORIZATION`

## IRES evidence admission

IRES Support and MLS Grid Support correspondence dated 2026-08-24 establishes that `IRE_CityID` is an IRES-local, non-standard field. MLS Grid does not permanently enumerate non-standard RESO fields and directs consumers to obtain the actual dataset's distinct values. IRES supplied an official full list reported as more than 500 values, but that response is not embedded in this repository.

The repository records the stable evidence reference, field identity, observed date, refresh requirement, correction/retirement rules, and the expressly confirmed high-priority observations. It does **not** claim that those observations are a statewide enumeration. A future refresh requires an authorized distinct-values query against the actual IRES dataset; no provider call occurred in this work package.

Each CityID is a source-specific geographic key. A recognized value records only IRES's reported city name and remains `NOT_RECONCILED` to an ATLAS geographic object. An unknown, future, leading-zero, or missing value is retained with `RETAIN_WITH_SOURCE_GEOGRAPHY_UNMAPPED`; it is never discarded, numerically approximated, or assigned to a different city.

## Internal firewall

The contract forbids runtime ingestion, listing assignment, geographic-object creation, Search/Map use, public display, coverage claims, and activation. It has no database, source registry, operational manifest, property runtime, provider, public-route, Search, Map, Market, or customer-data dependency. IRES CityID evidence admission is not MLS/IRES source activation, county/city coverage evidence, property identity evidence, or an authorization to publish a geographic assertion.

## Deterministic fixtures

The checker verifies Boulder `9`, Broomfield `12`, Erie `24`, Lafayette `53`, Longmont `60`, Louisville `61`, Superior `93`, Westminster `101`, and additional confirmed observations including Denver and Niwot. It verifies an unknown future value, the non-equivalence of leading-zero values, and a missing value. Every fixture remains `NOT_AUTHORIZED` and source-geography-unmapped at the ATLAS-object boundary.

## Supabase diagnostic

Official Supabase Support evidence dated 2026-08-24 attributes the earlier dashboard/database timeouts to depleted Disk IO budget on the Nano compute instance. Support reported the project active and healthy, stated that I/O-budget exhaustion throttles the instance, and recommended a Nano-to-Micro upgrade when convenient. It also stated that `pg_stat_statements` is enabled by default and should be used to identify expensive queries.

At 2026-08-24T22:16:14Z and again at 2026-08-24T22:17:32Z, the repository's configured pooler path passed project/DNS/TCP checks, Prisma `SELECT 1`, and Supabase REST. The configured topology is the project's `us-west-2` transaction pooler on port `6543`, with PgBouncer and a script connection limit of one. The project-reference consistency and non-placeholder checks also passed.

Two bounded attempts to open a separate read-only `pg_stat_statements` transaction failed before the statistics query reached the database, while the normal health preflight continued to pass immediately afterward. No statement rows, query text, literals, credentials, or customer data were returned. This is a live query-statistics availability limitation, not evidence that any named application query caused the historical I/O depletion.

The public Supabase status page at the time of the diagnostic reported Database and Connection Pooler operational in `us-west-2`; it reported API Gateway degraded performance and a resolved timeout incident limited to `us-east-1`. This does not replace project-specific support evidence or create a configuration change mandate.

## Query-family follow-up

No query family is certified as causal. When a bounded read-only statistics session can succeed, review cumulative `pg_stat_statements` aggregates for total execution time, mean execution time, calls, shared-block reads, temp-block reads/writes, and repeated Property, property-search, property-photo, listing/MLS, geographic, Alert/Saved Search, and CRM/inquiry families. Do not emit raw query text or literals.

Priority is deliberately evidence-led:

1. **P0:** obtain explicit Executive authorization for the supported Nano-to-Micro compute change. This package makes no compute change.
2. **P1:** rerun the bounded read-only statistics audit after the service is stable and classify any measured costly/read-heavy family before proposing a query, index, schema, or workload change.
3. **P2:** separately authorize any code, index, data, pooling, or operational remediation supported by that evidence.

## Certification boundary

No IRES/MLS Grid request, source acquisition, source activation, data ingestion, source registry promotion, operational-manifest promotion, coverage activation, provider selection, database mutation, migration, schema/index change, deployment, Vercel change, CRM action, customer-data access, Search/Map/Market activation, or public visual change occurred. The current listing-shaped Property runtime remains unchanged.
