# Advanced Investment Return Analysis V2

## Scope

`ADVANCED_INVESTMENT_RETURN_ANALYSIS_V2` is an Agent-only, pre-tax, modeled holding-period extension of Investment Breakeven V1 and Multi-Dimensional Strategy Suite V1. It reuses their reviewed source records and the shared immutable `OutputVersion` persistence service. It does not create a client workflow, transaction record, CRM record, MLS record, Compass record, document, external request, provider action, or financial-account connection.

## Calculation contract

The V2 engine persists deterministic monthly trajectories from month zero through bounded selected horizons (including 1, 3, 5, 7, and 10 years):

- exact fixed-rate and zero-interest amortization for source loans with rate/term inputs;
- property value, rent, and fixed-expense growth using explicit annual assumptions compounded monthly;
- vacancy, rent-dependent management expense, NOI, debt service, pre-tax cash flow, cumulative cash flow, property debt, and gross equity;
- explicit HOLD versus SELL behavior, sale cost, payoff, and pre-tax disposition proceeds;
- property-level IRR only for a conventional single-investment SELL cash-flow series, with monthly root, annual display value, residual, no-root, and ambiguity states;
- property-level NPV at an explicit discount rate, including zero-percent reconciliation;
- modeled pre-tax exit capital-recovery state and first recovery month;
- in-memory sensitivity previews that do not mutate a projection.

Retained Strategy properties whose V1 source supplies only a payment and debt balance are labeled `PAYMENT_ONLY_NON_AMORTIZING`. Their balance is held explicit rather than creating an unsupported interest or term assumption. Acquired properties continue to use exact V1 rate/term loan inputs.

## Persistence and governance

The additive `20260902000000_add_advanced_investment_return_analysis_v2` migration creates owner-scoped analyses, projections, immutable versioned results, dependencies, and audit events. Database triggers reject result mutation and any mutation or deletion of reviewed projections. The service validates the reviewed V1 source artifact, source result, owner, and input fingerprint before projection creation. Draft assumption changes become `STALE_RESULT`; review requires a current immutable result; reviewed projections require a successor.

Reviewed V2 output is composed through the existing shared `OutputVersion` persistence foundation. Its immutable payload stores the selected source/result, input fingerprint, horizons, assumptions, exact result/cash-flow snapshots, dependencies, qualifications, limitations, and output lineage. Repeating an identical persistence call is idempotent.

## Explicit limitations and deferrals

V2 is pre-tax decision support, not tax, legal, appraisal, underwriting, or investment advice. It does not calculate depreciation, after-tax return, refinance/HELOC/cash-out events, operating-cash-only recovery, strategy-level IRR or NPV, value crossover, stochastic/Monte Carlo risk, inflation-adjusted return, special assessments, capital-improvement events, client delivery, PDF delivery, or live provider integration. It never makes an automatic strategy winner or recommendation.

`COMPASS_TRANSACTION_RECORD_BOUNDARY_V1` and `DQG_TRANSACTION_ARCHIVE_POLICY_V1` remain unchanged: a reviewed V2 output is not a Compass transaction file and is not automatically archived or exported.

## Local validation

- `npm run check:advanced-investment-return-analysis`
- `npm run check:investment-breakeven-analysis`
- `npm run check:multi-dimensional-strategy-suite`
- `npx prisma validate`
- `npx prisma generate`
- `npm run typecheck`
- `npm run lint`
- `npm run build`

Production migration, deployment, authenticated Agent usability, and synthetic production certification are performed separately after the committed implementation is deployed.
