# ATLAS Cohort & Comparative Market Intelligence Contract MVV - Block 1 Certification

Date: 2026-08-25

Program: `ATLAS_COHORT_COMPARATIVE_MARKET_INTELLIGENCE_CONTRACT_MVV_BLOCK_1`

Status: `ATLAS_COHORT_COMPARATIVE_MARKET_INTELLIGENCE_CONTRACT_MVV_BLOCK_1_FOUNDATION_CERTIFIED`

Stop state: `ATLAS_COHORT_COMPARATIVE_CONTRACT_MVV_BLOCK_1_COMPLETE_READY_FOR_BLOCK_2`

## Workstream 1 Synchronization

The IRES Agent Reporting Capability Reconciliation documentation commit was synchronized first.

- Commit pushed: `72c17de85743f740e32e335ee6e5d28295e677a6`
- Subject: `docs(atlas): reconcile IRES agent reporting capabilities`
- Artifact: `docs/project-atlas/executive-library/IRES-AGENT-REPORTING-CAPABILITY-RECONCILIATION-PHASE-1.md`
- Post-push certification: `IRES_AGENT_REPORTING_CAPABILITY_RECONCILIATION_PHASE_1_REPOSITORY_SYNCHRONIZED`

## Block 1 Scope

Block 1 converts the certified IRES reconciliation into a foundational provider-neutral ATLAS Cohort contract. It does not implement runtime analytical engines, database-backed cohort execution, source acquisition, historical backfill, public/client publication, comparison result artifacts, audience/output policy, interpretation engines, scenario modeling, or Block 2 validation.

## Contract Artifacts

Implemented:

- `lib/atlasCohortComparativeContract.ts`
- `lib/atlasCohortComparativeContractFixtures.ts`
- `scripts/checkAtlasCohortComparativeContract.ts`
- `npm run check:atlas-cohort-comparative-contract`

## Certified Contract Coverage

The Block 1 contract covers:

- cohort identity, version, purpose, origin, lifecycle, reproducibility, and status;
- explicit analytical grain;
- source scope, source admission, source population coverage, source as-of state, exclusions, and limitations;
- identity and duplicate policy, including listing episode and relisting treatment;
- provider-neutral geography, source-specific geography, canonical ATLAS geography mapping, geography version, and provenance;
- property/listing characteristic admission states;
- status/event selection foundations;
- temporal period/event-basis contract;
- stock vs flow semantics;
- null, missing, unknown, not-applicable, conflict, exclusion, rights, and output-policy states;
- coverage and provenance metadata;
- specialized cohort types;
- observation artifact separation; and
- protected boundary assertions.

## Domain Separation

The contract preserves:

```text
PHYSICAL PROPERTY
!= MLS LISTING
!= LISTING EPISODE
!= TRANSACTION
!= COUNTY PARCEL/ACCOUNT
!= PROVIDER RECORD
```

Every cohort declares an analytical grain. A listing count cannot silently become a physical-property count. An event count cannot silently become a transaction count. A current projection cannot become historical evidence by implication.

## Temporal / Event Basis

The period contract rejects generic start/end semantics. Each analytical period must name the period basis, form, timezone, boundary semantics, partial-period policy, and comparison alignment policy.

Supported Block 1 basis concepts include listing contract date, on-market date, listing date, pending date, close/sold date, status-change date, off-market date, price-change date, admitted event timestamp, and observation/as-of timestamp.

Supported period forms include custom bounded period, calendar month, calendar quarter, calendar year, YTD, trailing N days, rolling period, prior period, same period prior year, and as-of instant snapshot.

The controlled IRES Compare Two Years issue remains a governing example: a report label such as `2025 vs 2026` does not establish comparability when the retained listing-date range is only `2026-01-01` through `2026-08-25`.

## Stock / Flow Semantics

The contract distinguishes:

- `STOCK`: what existed at a specific observation time;
- `FLOW`: what qualifying events occurred during a period;
- `SCENARIO`: modelled or hypothetical states.

It blocks a flow period from silently answering an as-of stock question, blocks a current-state projection from becoming historical stock evidence, and requires scenario/modelled data to remain outside observed market evidence.

## Specialized Cohort Types

Block 1 supports the required specialized cohort architecture:

- `SEARCH_FILTER_COHORT`
- `PHYSICAL_PROPERTY_COHORT`
- `MLS_LISTING_COHORT`
- `LISTING_EPISODE_COHORT`
- `TRANSACTION_COHORT`
- `STOCK_AS_OF_SNAPSHOT_COHORT`
- `STATUS_EVENT_FLOW_COHORT`
- `GEOGRAPHIC_COHORT`
- `PROPERTY_BENCHMARK_COHORT`
- `SUBJECT_PROPERTY_COHORT`
- `SCENARIO_COHORT`

Each type has an allowed analytical grain set. The checker proves mismatched grain/type combinations fail closed.

## Observation / Event / Snapshot Architecture

The contract separates:

- `CURRENT_PROJECTION`: present-state application/search representation; not historical evidence by default.
- `SOURCE_OBSERVATION`: admitted source/provider observation with source identity, source-as-of state, rights, and provenance.
- `HISTORICAL_EVENT`: lifecycle event at an admitted event time with ordering and restatement policy.
- `AS_OF_SNAPSHOT`: reproducible population/state at one specific as-of time.
- `DERIVED_METRIC_ARTIFACT`: calculated result requiring cohort, metric, calculation, and limitation versions.

## Red-Team Findings Addressed In Block 1

The Block 1 foundation explicitly addresses identity graph requirements, listing episode identity, event/snapshot separation, observation/as-of snapshots, restatement-policy placeholders, metric-semantic registry dependency, provenance, coverage, null/missing policy, reproducibility requirements, common cohort envelope limits, scenario boundaries, and the need for a future comparison validator.

Block 1 deliberately does not complete the future comparison/comparability validator, metric/result artifact model, audience/output-rights policy, interpretation/recommendation boundary implementation, scenario engine, readiness matrix, or final disposition. Those are reserved for Block 2.

## Validation

Command:

```bash
npm run check:atlas-cohort-comparative-contract
```

Result:

```text
ATLAS_COHORT_COMPARATIVE_CONTRACT_MVV_BLOCK_1_CHECK: PASS
```

The checker verifies:

- required analytical grains;
- required specialized cohort types;
- required period/event bases;
- required period forms;
- stock, flow, and scenario classes;
- field admission and null/missing states;
- valid stock, flow, and scenario fixtures;
- fail-closed stock/flow mismatch;
- fail-closed IRES native duplicate-hidden posture;
- fail-closed unresolved IRES + RECO source population posture;
- fail-closed unresolved source geography mapping;
- period basis/timezone/comparison alignment requirements;
- current projection not historical evidence;
- scenario boundary enforcement;
- observation artifact requirements; and
- zero protected-system side effects.

## Protected Boundary Certification

No runtime analytical engine, provider call, MLS Grid/IRES call, database read, database write, schema migration, source activation, Typesense mutation, CRM/email mutation, secret/key mutation, public/client publication, production deployment, Vercel mutation, external outreach, or scenario-as-observed-evidence behavior was implemented.

## Next Gate

`ATLAS_COHORT_COMPARATIVE_CONTRACT_MVV_BLOCK_1_COMPLETE_READY_FOR_BLOCK_2`

Executive HQ should provide Block 2 separately. Block 2 must not be inferred from this certification.
