# REIE Additive Public Search Eligibility State Foundation

Program: `REIE_ADDITIVE_PUBLIC_SEARCH_ELIGIBILITY_STATE_FOUNDATION`

Date: 2026-08-14

Repository: `/Users/davidquinn/david-quinn-group/colorado-real-estate`

## Status

`ADDITIVE_ELIGIBILITY_SCHEMA_PREPARED_RUNTIME_ACTIVATION_SEPARATE`

This workstream prepared the minimum additive public-search eligibility state, a non-executed migration artifact, and a pure deterministic contract/check. It did not execute the migration, write `Property` rows, call providers, mutate Typesense, change live Search behavior, create alerts, send email, activate workers/schedulers, deploy, or push the local implementation commit.

## Existing Eligibility Contract Trace

Current runtime predicates remain unchanged:

- `app/api/search/route.ts`: public database search applies `status = Active` by default and `isPrivateExclusive = false`; Typesense filters mirror default `status` and private-exclusive filters.
- `lib/search/searchProperties.ts`: database search helper defaults to `status = Active` and uses `isPrivateExclusive` only when provided.
- `lib/search/listingQuality.ts`: launch search contract defines `Active` as the default marketable status.
- `lib/property/publicPropertyRead.ts`: Property Product reads by `id`, `slug`, or `mlsId`; it does not certify current provider public-scope membership.
- `lib/typesense/indexProperties.ts`: reindex fetches mapped `Property` rows from Supabase and imports documents; it does not yet apply public-scope eligibility.
- `lib/alerts/intent/evaluateAlertIntent.ts`: `NEW_LISTING` intent requires `status = Active`, `isPrivateExclusive = false`, authoritative freshness, saved-search match, consent, and dedupe readiness.
- `lib/mls/publicActiveReconciliationContract.ts`: prior architecture established filtered public-scope absence as unresolved until authoritative status verification.

## State Design Options

Boolean was rejected because it cannot distinguish certified ineligible from unresolved fail-closed.

A nullable timestamp/state pair was rejected as unnecessary for the minimum foundation. Timestamps can be added later if operational auditing requires them.

Selected model:

- `Property.publicSearchEligibility PublicSearchEligibility?`
- enum values:
  - `CERTIFIED_ELIGIBLE`
  - `PUBLIC_SCOPE_UNVERIFIED`
  - `CERTIFIED_INELIGIBLE`

## Status and Privacy Separation

The new state is explicitly separate from provider/listing status and access/privacy:

- `status` remains the authoritative listing status field and must not be fabricated from filtered-feed absence.
- `isPrivateExclusive` remains an access/privacy classification and must not be repurposed as a search quarantine field.
- During unresolved reconciliation, `status` may remain last-known while `publicSearchEligibility = PUBLIC_SCOPE_UNVERIFIED`.
- After authoritative verification, a future transition may set `status = Pending` and `publicSearchEligibility = CERTIFIED_INELIGIBLE`, but only from provider evidence.

## Existing-Row Default Semantics

The additive field is nullable with no default.

`NULL` means legacy/not-yet-certified. This preserves current production Search behavior if the migration is executed later, because no live runtime predicate consumes the field in this workstream.

When a future runtime activation is separately authorized, `NULL` should not be treated as certified eligible. It should either remain excluded from the new activated predicate until initialized or be explicitly initialized by a separate reconciliation step.

## Prisma Schema Change

Prepared only:

- enum `PublicSearchEligibility`
- nullable field `Property.publicSearchEligibility`
- index `Property_publicSearchEligibility_idx`

The index is justified by the concrete future DB public-search and Typesense-indexing filter need: selecting only `CERTIFIED_ELIGIBLE` rows after activation.

## Migration Artifact

Prepared but not executed:

- `prisma/migrations/20260814190000_add_property_public_search_eligibility/migration.sql`

SQL is additive:

- creates enum `PublicSearchEligibility`;
- adds nullable `Property.publicSearchEligibility`;
- creates index on that field.

SQL does not mutate `status`, `isPrivateExclusive`, existing `Property` rows, Typesense, alerts, or access-control fields.

## Pure Eligibility Contract

Implemented:

- `lib/mls/publicSearchEligibilityStateContract.ts`
- `scripts/checkPublicSearchEligibilityStateContract.ts`
- `npm run check:public-search-eligibility-state-contract`

The pure contract accepts:

- authoritative listing status;
- provider public-scope membership;
- provider status verification result;
- private-exclusive posture;
- source identity resolution;
- duplicate identity signal;
- current eligibility state.

Outputs include:

- public Search eligibility;
- Typesense eligibility;
- Saved Search eligibility;
- `NEW_LISTING` alert eligibility;
- reason code;
- whether authoritative status mutation is permitted;
- historical Property record retention.

## Fail-Closed Behavior

`PUBLIC_SCOPE_UNVERIFIED` yields:

- public Search eligible: `false`
- Typesense eligible: `false`
- Saved Search eligible: `false`
- `NEW_LISTING` alert eligible: `false`
- historical Property record retained: `true`
- authoritative status mutation permitted: `false`

## Property Product Boundary

Not searchable does not mean delete or suppress the Property Product route.

Historical/property-record retention remains separate from public-search eligibility. No route behavior changed.

## Typesense Contract

Future Typesense rebuild should use DB-side eligibility filtering after runtime activation:

- include rows satisfying the future certified public-search predicate;
- exclude `PUBLIC_SCOPE_UNVERIFIED`, `CERTIFIED_INELIGIBLE`, and `NULL` unless a separately authorized initialization contract says otherwise.

Typesense schema modification is not required by this foundation; the eligibility field can remain a DB-side indexing predicate.

## Saved Search and Alert Contract

Future alert eligibility composes:

1. `publicSearchEligibility = CERTIFIED_ELIGIBLE`
2. intended current status, currently `Active` for `NEW_LISTING`
3. authoritative source freshness
4. Saved Search match
5. consent/user eligibility
6. dedupe

No alert creation or queue mutation occurred.

## State Transitions

Pure transition design:

- current provider public snapshot member plus public-scope status -> `CERTIFIED_ELIGIBLE`
- absent from completed snapshot -> `PUBLIC_SCOPE_UNVERIFIED`
- unverified plus authoritative Pending/Closed/Withdrawn/Expired/Cancelled status -> `CERTIFIED_INELIGIBLE`
- unverified plus authoritative Active/Coming Soon status -> `CERTIFIED_ELIGIBLE`
- ambiguous/missing identity -> remain `PUBLIC_SCOPE_UNVERIFIED`
- duplicate identity -> remain `PUBLIC_SCOPE_UNVERIFIED`
- incomplete snapshot -> remain `PUBLIC_SCOPE_UNVERIFIED`
- private exclusive -> `CERTIFIED_INELIGIBLE` for public search without changing privacy semantics

## Fixture Certification

Validation:

- `npx prisma validate --schema prisma/schema.prisma`: passed.
- `npm run check:public-search-eligibility-state-contract`: passed after escalated filesystem permission was required for worker build `dist` emission.

Fixture mode:

- `FIXTURE_ONLY_NO_DB_NO_PROVIDER_NO_TYPESENSE_NO_ALERT_SIDE_EFFECT`

Cases:

- Active + provider public-scope member;
- Coming Soon + provider member;
- locally Active but absent snapshot;
- absent + later Pending verification;
- absent + later Closed verification;
- absent + later Active verification;
- missing identity;
- duplicate identity;
- private-exclusive listing;
- incomplete provider snapshot;
- partial reconciliation;
- unresolved state not Search eligible;
- unresolved state not Typesense eligible;
- unresolved state not Saved Search eligible;
- unresolved state not alert eligible;
- historical Property retention unaffected;
- status not fabricated;
- privacy field not repurposed;
- deterministic reason codes;
- zero DB/provider/Typesense/alert side effects.

## Migration and Activation Separation

Required future gates:

1. Synchronize this local schema/contract foundation.
2. Separately authorize and execute the additive migration.
3. Separately initialize/reconcile eligibility state.
4. Certify DB public-search scope.
5. Activate Search/Typesense/Saved Search predicates.
6. Rebuild Typesense.
7. Certify public Search and alert readiness.

## Provider Capability Proof Plan

Prepare later, do not execute now:

- batched source-identity filter proof if MLS Grid supports it;
- narrow transactional-status feed proof if batched ID filtering is unsupported;
- exact ID lookup proof only as fallback because request cost is highest.

Because MLS Grid issued a rate warning, the preferred proof is the lowest-request authoritative mechanism under the shared rate governor.

## Provider Status

- MLS Grid: `MLS_GRID_LIVE_CALLS_PAUSED_PENDING_RATE_LIMIT_CLARIFICATION`
- LightBox additional calls in this workstream: `0`
- ATTOM: `PENDING_PROVIDER_RESPONSE`

## Recommendation

Synchronize this foundation first. Do not execute the migration or activate runtime predicates until separate authorization defines the initialization/reconciliation plan and provider-capability proof.
