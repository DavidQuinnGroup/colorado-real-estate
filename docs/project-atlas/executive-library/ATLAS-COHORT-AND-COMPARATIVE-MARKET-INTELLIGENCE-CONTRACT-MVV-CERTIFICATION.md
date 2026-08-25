# ATLAS Cohort And Comparative Market Intelligence Contract MVV Certification

Date: 2026-08-25

Program: `ATLAS_COHORT_AND_COMPARATIVE_MARKET_INTELLIGENCE_CONTRACT_MVV`

Certification state: `ATLAS_COHORT_AND_COMPARATIVE_MARKET_INTELLIGENCE_CONTRACT_MVV_CERTIFIED`

Next gate: `READY_FOR_REUSABLE_AGENT_COHORT_BUILDER_BOUNDED_IMPLEMENTATION_AUTHORIZATION`

## 1. Program / Workstream Identity

This MVV completes the two-block ATLAS Cohort & Comparative Market Intelligence Contract workstream derived from `IRES_AGENT_REPORTING_CAPABILITY_RECONCILIATION_PHASE_1_ARCHITECTURE_CERTIFIED`.

## 2. Executive Objective

Define provider-neutral contracts that let ATLAS replace recurring licensed-Agent reporting labor without cloning IRES report screens or inventing unresolved MLS/IRES methodology, source rights, or data completeness.

## 3. Governing Dependencies

The MVV composes the Market Metric Definition & Evidence Contract, canonical physical-property identity architecture, IRES CityID source-geography governance, prospective historical market observation architecture, source-quality/source-rights governance, Agent Workspace preparation contracts, MLS source-freshness architecture, and report/provenance patterns.

## 4. Starting Repository Truth

Block 2 began on `main` with `HEAD=ae1bc90e318aadb76d424394847b231921361708`, `origin/main=72c17de85743f740e32e335ee6e5d28295e677a6`, divergence `0 behind / 1 ahead`, and a clean working tree.

## 5. Block 1 Baseline

Block 1 established the common cohort envelope, analytical grain, source scope, identity/duplicate policy, geography scope, property/listing characteristic admission states, temporal/event-basis contract, stock/flow semantics, null/missing states, coverage/provenance metadata, specialized cohort types, observation artifact separation, and scenario boundary.

## 6. Files Created / Modified

- `lib/atlasCohortComparativeContract.ts`
- `lib/atlasCohortComparativeContractFixtures.ts`
- `scripts/checkAtlasCohortComparativeContract.ts`
- `docs/project-atlas/executive-library/ATLAS-COHORT-COMPARATIVE-MARKET-INTELLIGENCE-CONTRACT-MVV-BLOCK-1-CERTIFICATION.md`
- `docs/project-atlas/executive-library/ATLAS-COHORT-AND-COMPARATIVE-MARKET-INTELLIGENCE-CONTRACT-MVV-CERTIFICATION.md`
- `package.json`

## 7. Common Cohort Contract Summary

An ATLAS cohort is a versioned analytical population definition with explicit identity, purpose, origin, lifecycle, reproducibility, grain, stock/flow class, source scope, identity/duplicate policy, geography, period/event basis, field admission, null/missing policy, coverage, provenance, and scenario boundary.

## 8. Specialized Cohort Contract Summary

The contract supports search/filter, physical-property, MLS-listing, listing-episode, transaction, stock/as-of snapshot, status/event flow, geographic, property-benchmark, subject-property, and scenario cohorts.

## 9. Analytical Grain Contract

Every cohort declares what one member represents. Physical properties, provider records, MLS listings, listing episodes, transactions, events, snapshots, geographies, benchmark properties, subject properties, and scenario observations cannot be silently converted into one another.

## 10. Temporal / Event-Basis Contract

Periods require a basis, form, start/end/as-of state, timezone, boundary semantics, partial-period policy, and comparison-alignment policy. A start/end pair alone is insufficient.

## 11. Stock / Flow Contract

Stock cohorts answer what existed at an as-of instant. Flow cohorts answer what qualifying events occurred during a period. Scenario cohorts represent modeled or hypothetical states. The checker rejects stock/flow misuse.

## 12. Observation / Event / Snapshot Contract

The contract separates current projections, source observations, historical events, as-of snapshots, and derived metric artifacts. Current Property/Search projections are not historical evidence by default.

## 13. Coverage / Provenance Contract

Metric and cohort artifacts carry source, field, temporal, geographic, identity, and provenance metadata. Missing sources, unresolved geography, incomplete field coverage, unknown history, conflicts, and attribution gaps remain visible.

## 14. Comparability Validator Contract

Before ATLAS represents a comparison, `evaluateAtlasComparability()` checks metric identity/version, family, aggregation, units, analytical grain, source population, identity policy, geography, event basis, stock/flow semantics, historical coverage, field/null coverage, calculation version, source conflicts, geography conflicts, scenario ambiguity, and requested audience rights.

## 15. Metric Artifact Contract

`AtlasMetricArtifact` represents one reproducible metric result over an admitted cohort using an admitted metric definition at a known evidence state. It records population counts, null/unknown counts, source/geography/identity provenance, methodology evidence, limitations, rights policy, calculation version, and restatement state.

## 16. Comparative Result Contract

`AtlasComparativeResultArtifact` records Cohort A/B/N references, comparability state and reasons, values, absolute delta, percentage delta, direction, period alignment, coverage comparison, provenance, calculation version, and requested audience.

## 17. Zero-Denominator Policy

When the prior value is zero, percentage delta returns `null` with `RETURN_UNDEFINED_WITH_REASON`. ATLAS does not turn `0 -> X` into an ordinary `+100%`.

## 18. Multi-Cohort Comparison Contract

The result artifact supports multiple cohort references conceptually, while Block 2 validates the two-artifact A/B calculation foundation. N-way comparison implementation remains future work.

## 19. Audience / Output Rights Contract

Analytical validity is separate from output permission. A metric may be valid for `AGENT_ONLY` and blocked for `PUBLIC_DISPLAY`, `CLIENT_PROFESSIONAL_REPORT`, or `EXPORT`.

## 20. Interpretation / Recommendation / Scenario Boundary

Observed evidence, derived calculation, comparison, interpretation, recommendation, scenario/model, and Agent judgment remain separate. Scenario/model values cannot masquerade as observed market evidence.

## 21. Agent Review Workbench Requirements

Future Agent workbench surfaces must show evidence, calculations, coverage, limitations, comparability, rights, and verification requirements before interpretation or client use.

## 22. Report / Presentation Audit Contract

Future reports, charts, PDFs, exports, and presentations must carry cohort, metric, calculation, provenance, coverage, limitation, rights, and audience audit metadata.

## 23. Historical Restatement / Reproducibility Contract

Historical analytics require explicit source-as-of, observation-as-of, calculation version, restatement state, and reproducibility posture. Corrections or supersessions must not overwrite prior evidence silently.

## 24. Calculation Versioning Contract

Comparable derived artifacts require compatible calculation versions unless a cross-version comparison is separately admitted.

## 25. Fail-Closed Behavior

Unknown methodology, unknown comparability, unknown rights, unknown attribution, unknown retention/export permission, source conflict, identity conflict, geography conflict, material null/missing-data ambiguity, and scenario/observed ambiguity fail closed or return a constrained limitation state.

## 26. Metric / Comparison Admission Gates

The admission model covers source admission, field admission, metric methodology admission, identity/duplication admission, geography admission, temporal/history admission, comparability admission, rights/audience admission, and presentation/interpretation admission.

## 27. Controlled IRES Benchmark Evidence Boundary

The controlled IRES DOM, Statistics, and Compare Two Years outputs remain architecture evidence only. Average DOM label visibility does not admit DOM methodology. DTS, DTO, SP/LP, status/event semantics, IRES+RECO population equivalence, and duplicate hiding remain unresolved.

## 28. Repository Integration / Composition Findings

The MVV references and extends existing REIE metric semantics, property identity, source-quality, source-rights, IRES geography, historical observation, Agent Workspace, Search/Property, MLS freshness, and report/provenance contracts. It deliberately leaves runtime computation, database schema, provider calls, source activation, and public/client output separate.

## 29. Deterministic Checker / Fixture Proof

`npm run check:atlas-cohort-comparative-contract` validates analytical grain, event basis, stock/flow mismatch, source population mismatch, geography mismatch, metric version mismatch, duplicate policy mismatch, historical coverage failure, null/coverage materiality, zero denominator, rights block, scenario boundary, current projection boundary, IRES Compare Two Years failure mode, valid comparison, limited comparison, provenance, calculation version, and audience policy.

## 30. Implementation Readiness Matrix

Ready now for bounded implementation: reusable Agent cohort builder, Quick Filters, and simple admitted counts. Ready after repository-local foundation: Advanced Property Filters, admitted min/max/median/average, multi-city comparison, and subject-property benchmark cohorts. Blocked categories are methodology, historical data, source/data, identity/deduplication, geography, rights, and Executive decision.

## 31. Dependency-Aware Implementation Waves

Recommended waves: cohort foundation; admitted basic aggregation; comparative intelligence foundation; history/event intelligence; advanced market metrics; subject-property/strategy intelligence; scenario/investment intelligence; report/presentation composition.

## 32. Open Evidence / Data Blockers

Preserved blockers include `PROPERTY_IDENTITY_SOURCE_ADMISSION_REQUIRED`, `STATEWIDE_PROPERTY_IDENTITY_DATA_REQUIRED`, `HISTORICAL_MLS_USE_RECONCILIATION_REQUIRED`, DOM/CDOM/DTS/DTO methodology, status/event methodology, historical retention/corrections, price semantics, SP/LP methodology, derived analytics rights, Agent/client/public/export rights, attribution, retention/deletion obligations, IRES+RECO population equivalence, and cross-MLS duplicate handling.

## 33. Market Preparation Implications

Market Preparation may proceed incrementally only with admitted metrics appropriate for Agent use, while exposing evidence, calculations, coverage, limitations, comparability, and verification requirements.

## 34. Market Update 3.0 Implications

Market Update 3.0 remains blocked where required methodology, history, comparability, source population, or audience rights are unresolved.

## 35. Protected-System Confirmation

Database mutation: none. Database schema migration: none. Supabase mutation: none. Supabase compute/configuration change: none. MLS Grid call: none. IRES call: none. MLS sync: none. Provider mutation: none. Source activation: none. Typesense mutation: none. CRM mutation: none. Email mutation: none. Secret/API-key mutation: none. External outreach: none. Manual Vercel action: none. Manual production deployment: none. Customer data mutation: none. Authentication-boundary mutation: none.

## 36. Validation Results

Required validation passed: deterministic checker, targeted TypeScript compilation, full `npm run typecheck`, relevant existing contract checks, and `git diff --check`. Production build was not required because this MVV changed inert contracts, fixtures, checker, package script, and documentation only; no runtime route, Next surface, schema, dependency, generated asset, or deployment candidate was changed.

## 37. Git / Commit / Push State

Block 1 commit `ae1bc90e318aadb76d424394847b231921361708` remains in history. Final Block 2 commit and push state are recorded in the execution final response after commit/push verification.

## 38. Certification State

`ATLAS_COHORT_AND_COMPARATIVE_MARKET_INTELLIGENCE_CONTRACT_MVV_CERTIFIED`

Architecture certification is not data, methodology, rights, source-retention, public-display, client-display, export, or production analytical-engine certification.

## 39. Next Recommended Gate

`READY_FOR_REUSABLE_AGENT_COHORT_BUILDER_BOUNDED_IMPLEMENTATION_AUTHORIZATION`

The recommended next gate should authorize only bounded repository-local implementation using admitted Agent-only contract behavior.

## 40. Executive Decisions Required

Executive decisions remain required for source population scope, authoritative methodology admission, historical observation persistence, rights/audience policy, scenario/recommendation policy, public/client/export permissions, and whether operational/client reporting surfaces enter the next ATLAS wave.
