# PROJECT ATLAS - Admitted Basic Aggregation Bounded Implementation Wave 2

Status: `ADMITTED_BASIC_AGGREGATION_BOUNDED_IMPLEMENTATION_WAVE_2_CERTIFIED`

Next recommended gate: `READY_FOR_COMPARATIVE_INTELLIGENCE_FOUNDATION_ADMISSION_REVIEW`

## 1. Workstream Identity

Workstream: Admitted Basic Aggregation - Bounded Implementation Wave 2.

Canonical dependency: `REUSABLE_AGENT_COHORT_BUILDER_BOUNDED_IMPLEMENTATION_WAVE_1_CERTIFIED`.

## 2. Executive Objective

Convert a validated current MLS listing cohort into a small set of reproducible, evidence-safe metric artifacts for Agent-only preparation.

## 3. Governing Contracts

- `ATLAS_COHORT_AND_COMPARATIVE_MARKET_INTELLIGENCE_CONTRACT_MVV_CERTIFIED`
- `REUSABLE_AGENT_COHORT_BUILDER_BOUNDED_IMPLEMENTATION_WAVE_1_CERTIFIED`
- `PROJECT_ATLAS_MARKET_METRIC_DEFINITION_AND_EVIDENCE_CONTRACT_MVV`
- Existing source-quality and source-rights governance

## 4. Starting Repository Truth

- Branch: `main`
- HEAD: `94929c6920e926ed598322c860a882e0c3422017`
- origin/main: `94929c6920e926ed598322c860a882e0c3422017`
- Divergence: `0 behind / 0 ahead`
- Working tree: clean
- `git diff --check`: PASS

## 5. Repository / Field Semantic Audit

The current `Property` model contains `price`, `beds`, `baths`, `sqft`, `yearBuilt`, `city`, `propertyType`, and `status`. Wave 1 already admits current MLS listing cohorts with source scope `CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION`, grain `MLS_LISTING`, and current snapshot basis `OBSERVATION_AS_OF_TIMESTAMP`.

## 6. Candidate Fields Reviewed

| Field | Classification |
| --- | --- |
| `Property.price` | Admitted as current asking/list price only |
| `Property.beds` | Admitted as listing bedroom characteristic |
| `Property.baths` | Admitted as listing bathroom characteristic |
| `Property.sqft` | Admitted as listed square-footage field only |
| `Property.yearBuilt` | Admitted as listing year-built characteristic |
| DOM/CDOM/status-event fields | Not admitted |
| sale/close price fields | Not admitted |

## 7. Fields Admitted

- `price`: `FIELD_EXISTS`, `FIELD_INGESTED`, `FIELD_POPULATED`, `FIELD_SEMANTICS_SUFFICIENT_FOR_BASIC_AGGREGATION`, `FIELD_RIGHTS_SUFFICIENT_FOR_AGENT_ONLY_USE`
- `beds`: same classification for populated records
- `baths`: same classification for populated records
- `sqft`: same classification as listed square-footage field
- `yearBuilt`: same classification for populated records

## 8. Fields Rejected / Deferred

DOM, CDOM, DTS, DTO, SP/LP, original-list-to-sale ratio, final-list-to-sale ratio, sale price, closed transaction statistics, new listing activity, pending activity, withdrawn/expired/back-on-market activity, months of supply, absorption, historical snapshots, price-change history, relist/listing episode analytics, duplicate-suppression claims, and IRES/RECO equivalence claims remain blocked.

## 9. Aggregations Admitted

- Count of current MLS listing records.
- Minimum, maximum, median, and arithmetic mean current asking/list price.
- Median bedrooms.
- Median bathrooms.
- Median listed square feet.
- Median year built.

## 10. Aggregations Rejected / Deferred

SUM is not admitted for Wave 2 because no reviewed candidate field has a useful additive Agent-preparation interpretation that does not risk overstating market methodology. Historical comparison and scenario calculations are not admitted.

## 11. Null / Missing Policy

Count uses all validated cohort members. Numeric aggregations use only valid populated numeric observations. Null and missing values are excluded from the calculation and reported as `nullMissingCount`. Empty admitted cohorts return a defined no-data artifact state for non-count metrics.

## 12. Metric Artifact Architecture

Implemented in `lib/agentCohortAggregation.ts` with an explicit registry, calculation version `AGENT_COHORT_BASIC_AGGREGATION_V1`, metric IDs, truthful labels, field basis, aggregation, unit, null policy, audience posture, coverage counts, limitations, and provenance.

## 13. Read-Only Query Architecture

The aggregation path reuses `buildAgentCohortPrismaWhere` and performs one read-only `prisma.property.findMany` with selected admitted numeric fields. It performs no writes, schema changes, provider calls, MLS/IRES calls, Typesense mutation, CRM/email mutation, or source activation.

## 14. Agent Workspace Integration

`components/agent/AgentCohortBuilder.tsx` displays admitted metric artifacts in the existing Market Update preparation flow. The component remains reusable for other Agent surfaces.

## 15. Exact UI Labels

- `Matching current MLS listing records`
- `Current asking/list price minimum`
- `Current asking/list price maximum`
- `Current asking/list price median`
- `Current asking/list price mean`
- `Bedrooms median`
- `Bathrooms median`
- `Listed square feet median`
- `Year built median`

## 16. Coverage / Provenance Handling

Each artifact retains eligible cohort count, included populated count, null/missing count, source scope, analytical grain, temporal basis, calculation version, limitations, and provenance references.

## 17. Runtime Proof

Runtime proof was performed against `/api/agent/cohort-count` on August 25, 2026.

Example A: Boulder, Residential, Active, $500,000-$1,250,000 returned HTTP `200`, count `120`, and admitted artifacts for count, asking/list price min/max/median/mean, bedroom median, bathroom median, listed square feet median, and year-built median.

Observed Example A values:

- Current asking/list price minimum: `$500,000`
- Current asking/list price maximum: `$1,250,000`
- Current asking/list price median: `$799,000`
- Current asking/list price mean: `$823,932`
- Bedrooms median: `3`
- Bathrooms median: `2`
- Listed square feet median: `1,385`
- Year built median: `1978`

Example B: Lafayette, Active, minimum 2 bedrooms, minimum 2 bathrooms returned HTTP `200`, count `52`, and admitted artifacts with coverage counts.

Observed Example B values:

- Current asking/list price minimum: `$75,000`
- Current asking/list price maximum: `$5,300,000`
- Current asking/list price median: `$729,950`
- Current asking/list price mean: `$943,769`
- Bedrooms median: `3`
- Bathrooms median: `3.5`
- Listed square feet median: `2,056` with `51` included of `52` eligible listing records and `1` null/missing
- Year built median: `1997`

## 18. Fail-Closed Runtime Proof

- Unsupported geography `Denver`: HTTP `422`, no aggregate artifacts.
- Physical-property grain request: HTTP `422`, no aggregate artifacts.
- Unsupported sale-price metric ID: HTTP `422`, no aggregate artifacts.
- Unsupported DOM-family metric ID: HTTP `422`, no aggregate artifacts.
- Invalid price range: HTTP `422`, no aggregate artifacts.
- Empty admitted cohort: HTTP `200`, count `0`, non-count requested metric returned `NO_DATA` with `value: null`.

## 19. Checker / Fixture Proof

Checker: `npm run check:admitted-basic-aggregation`.

The checker verifies the admitted registry, truthful labels, unsupported metric rejection, current listing grain, current snapshot basis, source scope, no public/export rights, static read-only posture, and UI/API integration.

## 20. Regression Results

- `npm run check:admitted-basic-aggregation`: PASS
- `npm run check:reusable-agent-cohort-builder`: PASS
- `npm run check:atlas-cohort-comparative-contract`: PASS
- `npm run check:agent-market-update-preparation`: PASS
- `npm run check:market-update-narrative-quality`: PASS

## 21. Typecheck

`npm run typecheck`: PASS.

## 22. Build

`npm run build`: PASS, with unrelated pre-existing lint warnings in `lib/financialDecisionPreparationContract.ts`, `lib/mls/fetchMLSPage.ts`, `lib/mls/paginationContract.ts`, and `lib/sundanceContentGenerationGate.ts`.

## 23. Protected-System Confirmation

No database mutation, schema migration, Supabase configuration mutation, MLS Grid call, IRES call, MLS sync, provider mutation, source activation, Typesense mutation/reset, CRM/email mutation, secret mutation, external outreach, force push, rebase, reset, cherry-pick, manual Vercel action, manual production deployment, or public/client publication is performed.

## 24. Explicitly Blocked Capabilities

Advanced/Expert filters, comparative intelligence, historical trends, subject-property benchmark analysis, seller strategy, buyer strategy, investment/scenario intelligence, client/public reporting, and PDF/export analytics remain separate authorization gates.

## 25. Certification Status

`ADMITTED_BASIC_AGGREGATION_BOUNDED_IMPLEMENTATION_WAVE_2_CERTIFIED`

## 26. Next Recommended Gate

`READY_FOR_COMPARATIVE_INTELLIGENCE_FOUNDATION_ADMISSION_REVIEW`

## 27. Git / Commit / Push State

Final commit and push state are recorded in the execution report after verification.

## 28. Executive Decisions Required

Executive approval is required before any comparative intelligence, historical analytics, advanced filters, public/client reporting, export, provider/source activation, schema change, or production deployment action.
