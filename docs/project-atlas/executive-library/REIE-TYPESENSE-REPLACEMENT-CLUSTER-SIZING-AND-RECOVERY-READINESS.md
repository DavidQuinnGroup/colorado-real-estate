# REIE Typesense Replacement Cluster Sizing and Recovery Readiness

Program: `REIE_TYPESENSE_REPLACEMENT_CLUSTER_SIZING_AND_RECOVERY_READINESS`

Repository: `/Users/davidquinn/david-quinn-group/colorado-real-estate`

Branch: `main`

Baseline verified before review:

- `HEAD = origin/main = 100c8be0a3b994a58d0e5f8449250b5fd999db8d`
- Divergence: `0 behind / 0 ahead`
- Working tree: clean

## 1. Status

`TYPESENSE_VERSION_COMPATIBILITY_REVIEW_REQUIRED`

Replacement sizing is technically modest and the index is rebuildable from authoritative data, but the currently offered Typesense Cloud version requires a client/tooling compatibility decision before provisioning and reindex execution.

No cluster was created. No Vercel configuration was changed. No Typesense collection, import, reset, or reindex action was executed.

## 2. Former Provider Disposition

Executive HQ provider evidence establishes that the former Typesense Cloud production service should be treated as no longer recoverable in place unless contrary provider evidence appears.

The former account evidence indicates:

- The user is authenticated to the Typesense Cloud personal account used for PROJECT ATLAS.
- No separate team account containing an existing service is available from the account switcher.
- Cluster navigation reaches the New Cluster screen, not an existing cluster.
- Billing shows no current billed spend or upcoming invoice tied to an active cluster.
- The April 29, 2026 Typesense Cloud email warned that free credits were close to exhaustion, clusters would be suspended before credits ran out, running clusters would be terminated after credits ran out, and cluster data would be deleted unless payment was added.

Disposition:

`FORMER_TYPESENSE_CLOUD_SERVICE_TREATED_AS_TERMINATED_AND_NONRECOVERABLE_IN_PLACE`

## 3. Current Search Dataset Size

Current measured data evidence:

- Production public default Search probe: HTTP `200`, `source=database`, `health=degraded`, `found=1287`, `returned=1`, `mapped=1`, `meta.smoke.ready=true`.
- Read-only aggregate database count: `15282` total `Property` rows.
- Active public rows: `1287`.
- Active total rows: `1288`.
- Private-exclusive rows: `1`.
- Property photo rows: `327819`.

Expected rebuild volume:

- One Typesense document is generated per source `Property` row.
- The current tooling imports the generated document into both canonical collections: `properties` and `listings`.
- A full current rebuild therefore expects up to `15282` documents in `properties` plus `15282` documents in `listings`, or `30564` indexed documents total across the two collections.

Current customer-facing default Search is much smaller than the full index because public Search defaults to active, non-private inventory.

## 4. Index Document Shape

Canonical schema:

- Collections: `properties`, `listings`.
- Rule fields: `33`.
- Fields materialized in collection schema: `32`, because Typesense reserves `id`.
- Required fields: `13`.
- Optional fields: `20`.
- Faceted fields: `18`.
- Sort-enabled schema fields: `7`.
- Query fields: `10`.
- Filter fields: `10`.
- Route sort fields: `price`, `updatedAt`.
- Default Typesense sort: `price:desc,updatedAt:desc`.
- Default collection sorting field: `price`.

Searchable fields:

- `address`
- `city`
- `neighborhood`
- `subdivision`
- `schoolDistrict`
- `listingAgent`
- `listingOffice`
- `description`
- `zip`
- `mlsId`

Filterable route fields:

- `lat`
- `lng`
- `price`
- `beds`
- `baths`
- `city`
- `neighborhood`
- `propertyType`
- `status`
- `isPrivateExclusive`

Geospatial fields:

- `lat`
- `lng`
- `location` as `geopoint`

The API caps customer Search responses at `250` results per request and caps offset at `10000`.

Images are not stored in Typesense. Typesense documents store property/search metadata only. Display photos are read from `PropertyPhoto` after the document IDs are known.

## 5. Recovery Source Of Truth

Canonical rebuild source:

- Primary source for reindex: Supabase/database `Property` rows.
- Photo display source: `PropertyPhoto` rows.
- Typesense is a derived Search index, not the canonical property database.

The index mapper regenerates necessary Typesense fields from current database columns and MLS-style source fields, including fallbacks for IDs, address, status, location, scores, and timestamps.

The deleted Typesense cluster is not shown to contain unique nonrecoverable business data. The recoverable unit is the database row plus deterministic mapper, not the old cluster state.

## 6. Rebuildability Classification

`FULLY_REBUILDABLE_FROM_AUTHORITATIVE_DATA`

This classification depends on preserving the current database and MLS/source-rights boundaries. It does not authorize an MLS refresh, source mutation, or provider data acquisition.

## 7. Existing Recovery Tooling

Existing scripts and contracts:

- `npm run typesense:init`: validates canonical schemas, inspects collections, creates missing collections, replaces stale collections, and supports `--check`, `--dry-run`, and `--reset`.
- `npm run typesense:collections:check`: validates canonical collection readiness without creating, deleting, or indexing.
- `npm run typesense:reindex`: validates schemas, ensures collections, checks database readiness, fetches `Property` batches, maps documents, and imports into both `properties` and `listings`.
- `npm run typesense:reset`: deletes and recreates canonical collections before indexing.
- `npm run typesense:reset-collections`: resets collections only.
- Import batch size default: `500`.
- Import batch size maximum: `1000`.
- Max records guard: `1000000`.
- Bulk import action: `upsert`.

Safest future sequence for a new empty cluster:

1. Create replacement cluster after authorization.
2. Configure new endpoint and API key in a non-production local diagnostic context first.
3. Run health check against the new cluster.
4. Run a schema dry-run or local validation before connecting.
5. Run `typesense:init` against the new cluster to create canonical `properties` and `listings`.
6. Run `typesense:collections:check`.
7. Run bounded reindex first with `--max-records`.
8. Verify direct queries against `listings`.
9. Run full reindex.
10. Verify collection counts.
11. Only then update Vercel Production Typesense configuration under separate authorization.

## 8. Recommended Memory

Current production recommendation:

`0.5 GB`

Rationale:

- Current full source data is `15282` rows, creating about `30564` documents across two lightweight metadata collections.
- Documents do not include image binaries.
- Customer-facing default active public result set is `1287`.
- Query result size is capped at `250`.
- Database fallback remains available when Typesense is degraded.

A larger tier is not justified for current production evidence unless Typesense Cloud metrics after rebuild show sustained memory pressure, high CPU, high latency, or import failures.

## 9. Recommended vCPU

Current production recommendation:

`2 vCPUs, 1 hr burst/day`

Rationale:

- Query shape is straightforward text search plus filters and sort.
- Reindex is batch-based and can be scheduled intentionally.
- The current workload does not show evidence requiring higher steady compute.

## 10. Recommended High Availability

Current production recommendation:

`Off`

Rationale:

- Database fallback is proven and customer-usable.
- Search is useful but not currently a single point of total site failure.
- Current traffic assumptions do not justify HA cost.

Turn HA on when Search becomes a committed production SLO dependency, database fallback no longer meets customer experience targets, paid acquisition depends on Search latency, or provider downtime causes material conversion loss.

## 11. Recommended Search Delivery Network

Current production recommendation:

`Off`

Rationale:

- Current workload is Colorado-focused.
- Server-side API calls Typesense from the application, then enriches photos from the database.
- Current query and document counts are small.
- SDN should be revisited after restored Typesense traffic provides latency and cache evidence.

## 12. Recommended Region

Current production recommendation:

`Oregon`, with a verification caveat.

Evidence:

- Current source database connectivity evidence indicates AWS `us-west-2` geography.
- Current production response headers show Vercel request path evidence containing `sfo1::iad1`, but no explicit repo-level Vercel function-region pin was found.
- Customer geography is Colorado.
- The Typesense Cloud UI candidate shown to Executive HQ is Oregon.

Oregon is the best supported starting region from current database geography and customer geography. Revisit if Vercel project settings prove the production Search function is pinned to an East Coast compute region and query latency to Oregon is materially worse.

## 13. Recommended Typesense Version

Current UI candidate:

`30.2`

Recommendation:

Do not provision against `30.2` until the repository's Typesense JS client and recovery scripts are made compatible or a lower compatible server version is intentionally selected.

## 14. Version Compatibility Findings

Repository evidence:

- Local Docker Typesense image: `typesense/typesense:27.1`.
- Repository dependency: `typesense` JS client declared as `^1.8.2`.
- Lockfile resolved Typesense JS client: `1.8.2`.
- Recovery scripts use the Typesense JS client for collection inspection, creation, deletion, and document import.
- The runtime Search route also has a raw HTTP helper, but the recovery scripts still depend on the JS client.

External compatibility evidence:

- The current official npm compatibility table for `typesense` says Typesense Server `>= v30.0` requires `typesense-js >= v3.0.0`.
- Typesense Server `30.2` is a current release containing bug fixes over `30.1`.

Finding:

`typesense-js 1.8.2` is not compatible enough to treat a Server `30.2` recovery as ready without a separate dependency/tooling compatibility review.

## 15. Current-Scale Sizing Rationale

The base Typesense Cloud configuration is economically and technically appropriate for current production after compatibility is resolved:

- Full index size is about `30564` documents across two collections.
- Document shape is metadata-only and does not store photos.
- Default public active Search is `1287` results.
- Search result return limit is `250`.
- Query surface is conventional keyword, filter, sort, and coordinate filtering.
- Database fallback remains available.

## 16. Future Resize Triggers

Resize or enable additional features when one or more of these occur:

- Full source rows exceed `100000` properties or `200000` total indexed documents across both collections.
- Sustained memory usage exceeds provider guidance or search latency regresses.
- Full reindex no longer completes within the approved maintenance window.
- Concurrent production Search traffic grows materially beyond current evidence.
- Search becomes a committed customer SLO with fallback considered insufficient.
- Multi-region customer traffic becomes material outside Colorado.
- Faceting, grouping, vector search, synonyms, curation, analytics, or personalization materially expands the query workload.

## 17. Cost Posture

The displayed base cost context of about `$0.03/hour`, about `$21.60/month` plus bandwidth, appears appropriate for current production once compatibility is resolved.

No purchase is authorized by this review.

## 18. Fresh-Cluster Recovery Sequence

After separate authorization:

1. Create a replacement Typesense Cloud cluster with the approved configuration.
2. Obtain the new endpoint and API credential without sharing API keys in chat.
3. Validate `/health`.
4. Configure a local diagnostic environment only.
5. Validate repository compatibility with the server version.
6. Create canonical `properties` and `listings` collections.
7. Validate canonical schema.
8. Run a bounded sample reindex.
9. Verify sample counts and direct `listings` queries.
10. Run full reindex from authoritative `Property` rows.
11. Verify expected counts against source database counts.
12. Run representative direct queries for keyword, filter, sort, bounds, public/private handling, and empty results.
13. Update Vercel Typesense variables only under separate authorization.
14. Redeploy or controlled production activation only under separate authorization.
15. Certify `/api/search` returns `source=typesense`.
16. Certify database fallback remains functional.
17. Certify Search to Property to Shortlist journey.
18. Preserve rollback by retaining prior Vercel configuration evidence and database fallback.

## 19. Validation And Certification Plan

Before production cutover:

- `npm run worker:build`
- Compatibility-specific Typesense client validation against the chosen server version.
- `npm run typesense:init` against the new cluster.
- `npm run typesense:collections:check`
- Bounded `npm run typesense:reindex -- --max-records=<small-safe-number>` equivalent if supported through direct node invocation.
- Full reindex after bounded proof.
- Direct `listings` collection query validation.
- Public `/api/search?limit=1` and `/api/search?limit=250` validation.
- Zero-result validation.
- Representative city, price, beds, baths, bounds, and status filters.
- Search UI validation on desktop and mobile.
- Property detail from Search result.
- Shortlist compare journey.
- Database fallback forced-failure validation in a controlled non-production context.

## 20. Risks And Blockers

Blockers:

- `typesense-js 1.8.2` versus Typesense Server `30.2` compatibility.

Risks:

- Historical local Docker version was `27.1`, so `30.2` can include behavior differences even after client upgrade.
- Production Vercel function geography is not fully established from repo config alone.
- Full reindex is mutation-bearing and remains unauthorized until a later gate.
- Vercel configuration changes and deployment remain unauthorized.
- MLS/source restrictions must continue to be respected; rebuild should use existing authorized database state, not unapproved source refresh.

## 21. Files Changed

- `docs/CHAT_START.md`
- `docs/project-atlas/executive-library/REIE-TYPESENSE-REPLACEMENT-CLUSTER-SIZING-AND-RECOVERY-READINESS.md`

## 22. Local Documentation Commit

This review is intended to be preserved in one focused local documentation-only commit after validation.

## 23. Secret-Safety Confirmation

No API keys, provider credentials, Vercel secret values, Typesense secret values, database passwords, or dead endpoint values are printed in this record.

Read-only aggregate database counts used existing local environment values in process memory only and returned counts, not credentials.

## 24. Protected-System Confirmation

Not performed:

- Typesense cluster creation.
- Typesense Cloud modification.
- Typesense collection creation/deletion/import/reset/reindex.
- Vercel environment modification.
- Production deployment or redeployment.
- Provider DNS/network/billing/configuration change.
- Prisma schema or migration change.
- Database mutation.
- MLS/source refresh or source mutation.
- Search runtime/API code change.

## 25. Final Readiness Classification

`TYPESENSE_VERSION_COMPATIBILITY_REVIEW_REQUIRED`

The cluster can be sized now, and the data is rebuildable, but production provisioning against `30.2` should wait for an explicit Typesense client/tooling compatibility authorization.

## 26. Executive Recommendation

Plan for a base Typesense Cloud cluster:

- Memory: `0.5 GB`
- vCPU: `2 vCPUs, 1 hr burst/day`
- High Availability: `Off`
- Search Delivery Network: `Off`
- Region: `Oregon`, subject to Vercel compute-region confirmation
- Version: do not finalize `30.2` until compatibility review updates or validates the Typesense client/tooling

Do not attempt to restore the dead endpoint. Treat recovery as a fresh cluster rebuild from authoritative database data after compatibility is resolved.

## 27. Next Authorization Gate

`READY_FOR_TYPESENSE_30_2_CLIENT_COMPATIBILITY_AND_PROVISIONING_DECISION`
