# Multi-Property Financial Scenario Foundation V1

## Scope

`MULTI_PROPERTY_FINANCIAL_SCENARIO_FOUNDATION_V1` adds an Agent-only, owner-scoped, durable foundation for coordinated multi-property financial modeling. It supports an unbounded number of participants and the V1 roles `CURRENT_HOME_SELL`, `CURRENT_HOME_RETAIN`, `REPLACEMENT_PRIMARY_ACQUIRE`, and `INVESTMENT_ACQUIRE`.

The implementation is decision support only. It does not select a strategy, approve financing, execute a transaction, render or deliver a document, contact a person, activate a Client Portal, or mutate CRM, MLS, or Compass Business Tracker state.

## Reconciliation

- `SellerFinancialScenario` is retained as the specialized seller-financial family.
- `InvestmentAnalysis` and `InvestmentScenario` are retained as investment-breakeven analysis records.
- `StrategyAnalysis` and `StrategyAlternative` are retained as fixed-profile strategy-suite alternatives with canonical-property requirements.
- None of those families is reused as the canonical multi-property scenario root because they cannot represent the requested owner-scoped, N-participant scenario/version/result contract without changing their existing semantics.
- `OutputProduct` and `OutputVersion` remain the canonical Output foundation. The new nullable `OutputVersion.multiPropertyFinancialScenarioVersionId` records direct scenario-version lineage; no Output foundation is reimplemented.

## Durable Contract

The additive migration creates:

- `MultiPropertyFinancialScenario`: logical owner-scoped scenario identity and optional Client Case binding.
- `MultiPropertyFinancialScenarioVersion`: immutable input snapshot, input fingerprint, engine identity, ordinal, and optional one-to-one predecessor link.
- `MultiPropertyFinancialScenarioProperty`: normalized participant role, property-reference posture, optional canonical property relation, and frozen participant/provenance snapshots.
- `MultiPropertyFinancialScenarioResult`: one immutable result for each ScenarioVersion.
- `MultiPropertyFinancialScenarioAuditEvent`: append-only creation, analysis, revision, and Output-preparation events.

Client Case and canonical-property references are nullable where the scenario is hypothetical or prospective. The optional canonical-property relation does not make a synthetic, prospective, or hypothetical participant look like a verified physical-property record.

## Calculation And Security

`lib/multiPropertyFinancialScenarioFoundation.ts` parses and validates structured inputs, calculates sale liquidity, acquisition cash requirement, reserve impact, bridge-liquidity need, monthly cash flow/carry, per-property financing and breakeven-rent signals, and persists results only through explicit `ANALYZE_VERSION` action.

All service reads and writes are owner scoped. Client Case references are verified against the authenticated Agent owner. Canonical-property references are checked only when a participant explicitly identifies itself as `CANONICAL`. Immutable versions are never edited; a revision creates one successor from the exact prior version.

`app/api/agent/multi-property-financial-scenarios/route.ts` is a classified, same-origin, Human-Agent-session-only surface. It supports explicit creation, revision, analysis, exact-version comparison, and review-required Output preparation. GET requests do not mutate state.

## Output Boundary

`createOutputPersistenceService().createMultiPropertyFinancialScenarioOutputDraft()` reuses the existing Output foundation to create an Agent-internal `MULTI_PROPERTY_FINANCIAL_BREAKEVEN_ANALYSIS` OutputProduct and an `AGENT_REVIEW_REQUIRED` OutputVersion. Its provenance directly identifies the exact ScenarioVersion and ScenarioResult. It does not create a review, render, PDF, share, delivery, or downstream action.

## Certification Limits

The production fixture must use synthetic-only labels and data. The production path remains pending human Agent certification after one synthetic Scenario, immutable version, result, and review-required OutputVersion have been created and verified. No human review of that OutputVersion, PDF/render, or delivery is part of this workstream.
