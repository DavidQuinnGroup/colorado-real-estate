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

## Final Human Certification and Closure - 2026-09-11

### Executive Human Certification

Executive human certification passed in production. The Executive observed the synthetic Scenario Version 1, its two property roles, the four Scenario metrics, and the prepared Output in `AGENT_REVIEW_REQUIRED` state. The Executive then navigated from contextual Financial Strategy through Workspace Home to global `/agent/strategy`, where no `clientCaseId`, Client Case header, Client Case status, or Client Case navigation remained. No unexpected Agent sign-in occurred.

### Canonical Production Fixture

- Client Case: `cmtlsgepy00003yqsh1n54itc` (`ATLAS Synthetic Client Case - Foundation V1`, `ACTIVE`).
- Scenario: `cmtxiem9g0002k0dmzgyum017` (`ATLAS_SYNTHETIC_MULTI_PROPERTY_SCENARIO`).
- Scenario Version: `cmtxiemo40004k0dma3ndzrq5`, ordinal `1`, input fingerprint `23236902a5df0028b23309b07c89c14900e71b31697cf8020706c2ee69a71073`.
- Scenario Result: `cmtxifrrq00024ctpbg4j3mp5`, result fingerprint `3f3755be3195db02cddf318abd119b218d76679e6b2ec9ce93b2867867829f27`.
- Output Product / Version: `cmtxig6af00074ctp75k1u15j` / `cmtxig6tk00094ctpyy3057q8`.

Both participants remain `HYPOTHETICAL` and `SYNTHETIC_CERTIFICATION`: the current-home sale participant has a modeled value of `$800,000` and debt of `$400,000`; the replacement-primary acquisition participant has a modeled value of `$650,000`, down payment of `$130,000`, and closing costs of `$13,000`. No real client, property, transaction, professional-input, loan, rent, insurance, tax, or financial data was used.

### Financial Metric Reconciliation

Read-only reconciliation confirmed `MULTI_PROPERTY_FINANCIAL_SCENARIO_ENGINE_V1` reproduces the human-observed values exactly:

- Current `Timed liquidity`: `$0 - $143,000` acquisition cash `- $50,000` reserve `+ $352,000` estimated net sale proceeds `= $159,000`. Recommended Agent label: `Liquidity after planned sale`.
- Current `Bridge liquidity`: `max(0, $143,000 + $50,000 - $0) = $193,000` before sale proceeds. No bridge loan is modeled. Recommended Agent label: `Cash required before sale proceeds`.
- Current `Monthly cash flow`: `$0` effective rent `- $980.00` operating expense `- $1,590.24` debt service `= -$2,570.24` for the replacement primary after the sale role is excluded. Recommended Agent label: `Modeled monthly property cash flow after sale`.
- Current `Sale proceeds`: `$800,000 - $400,000 - $48,000` modeled 6% selling cost `= $352,000`. Recommended Agent label: `Estimated net sale proceeds`.

All four calculations pass. The current labels need clarification and help text but are not materially false; this is a non-blocking UX finding, not a financial-engine defect.

### Scenario Version / Result Lineage

The Scenario Version and Scenario Result remain immutable and owner scoped. The result references exact Version 1, not a mutable logical latest-version lookup. The three audit events remain `SCENARIO_VERSION_CREATED`, `SCENARIO_RESULT_MATERIALIZED`, and `OUTPUT_VERSION_PREPARED`; no closure action created, revised, recomputed, or otherwise changed a Scenario artifact.

### Output State / Lineage

The prepared Output remains `AGENT_REVIEW_REQUIRED` with zero reviews. Its source version, direct Scenario Version relation, evidence snapshot, and dependency records identify the exact certified Scenario Version and Result. Its checkpoint records no render or delivery. No Output review, successor, render, PDF, share, portal delivery, email, or SMS occurred.

### Contextual Client Case Certification

Executive human certification observed the contextual Client Case title, `ACTIVE` status, Client Case navigation, and Financial Strategy content together. The contextual route preserved the explicit Client Case relationship without global mutable Scenario state.

### Global Context Exit Certification

Executive human certification observed the exit from contextual Financial Strategy to `/agent/strategy` through Workspace Home. The global route had no Client Case query parameter or stale contextual UI.

### Authentication Continuity

Executive human certification observed no unexpected Agent sign-in during the context transition. Targeted primary-navigation and cross-capability session-continuity regression checks passed.

### UX-001 - Agent Workspace Section Hierarchy

The Executive found that `New immutable scenario version` did not stand out sufficiently as a major section. This is a systemic, non-blocking Agent Workspace information-hierarchy finding. The required future hierarchy is Page, major section, subsection, card/entity, field, and supporting text, while preserving Client Case title, status, and contextual navigation above contextual page content.

### UX-002 - Legacy Strategy Machine Identifier Presentation

The Executive observed long `ATLAS_SYNTHETIC_*` identifiers acting as primary legacy Strategy Suite card titles, causing overflow and cross-card text collision. This is a systemic, non-blocking legacy presentation finding. Human-readable titles should be primary; canonical machine identifiers must remain available as secondary technical metadata or diagnostic disclosure.

### Financial Terminology Follow-Up

The recommended metric labels above, concise metric help text, and the clarification that bridge liquidity is not a bridge-loan amount are registered for later presentation work. Canonical result fields and calculation semantics remain unchanged.

### Agent-Friendly Formatting Follow-Up

Future presentation should render `650 bps` as `6.50%`, `360 months` as `30 years`, raw currency input such as `800000` as `$800,000`, `HYPOTHETICAL` as `Hypothetical property`, and the Scenario key/fingerprint as technical metadata behind the display name.

### Final Foundation State

Implementation, deployment, targeted automated certification, read-only production reconciliation, and Executive human certification are complete. `MULTI_PROPERTY_FINANCIAL_SCENARIO_FOUNDATION_V1` is `PRODUCTION_CERTIFIED_AND_CLOSED`.

### Immediate Recommended UX Workstream

`AGENT_WORKSPACE_INFORMATION_HIERARCHY_AND_FINANCIAL_TERMINOLOGY_V1` is registered and not started. Its bounded scope includes Agent Workspace hierarchy, spacing, Scenario-card hierarchy, metric language and help text, currency/rate/term formatting, machine-key de-emphasis, plain-language role/reference labels, human-readable legacy Strategy titles, responsive long-title handling, and future Liquid Glass compatibility.

### Following Architectural Gate

`TRANSACTION_CASE_HANDOFF_AND_WORKFLOW_V1` remains not started and requires separate Executive authorization after the registered UX workstream is separately reconciled.

### Non-Action Proof

This closure was documentation and governance only. There was no application, Prisma schema, migration, production business-data, Scenario, Result, Output, Client Authorization, professional-input, CRM, MLS, Compass, email, SMS, or external-action mutation. The targeted foundation, output, Client Case, Agent-navigation, and route-session checks passed; typecheck passed; lint passed with five pre-existing unused-variable warnings. `check:project-atlas-navigation-invariant` has a pre-existing stale selector expectation (`agent-workspace-home-control` versus the deployed `agent-workspace-home-link`) at the parent implementation SHA and was not changed in this documentation-only closure.
