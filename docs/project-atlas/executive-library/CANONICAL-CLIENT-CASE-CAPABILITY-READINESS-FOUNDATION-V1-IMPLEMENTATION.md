# Canonical Client Case Capability Readiness Foundation V1

## Purpose

This local foundation answers whether a named, admitted capability has the minimum certified Client Case context to be used later. It is a server-authoritative, transient readiness assessment: it resolves Effective Context once for the owner-scoped Case and optional explicit Scenario Version, evaluates a code-owned contract, and returns machine-readable missing-information postures. It does not calculate, persist a snapshot, render UI, call a product, or perform an action.

## Admitted V1 Contracts

| Capability | Admission | Certified requirements | Explicit execution parameters |
| --- | --- | --- | --- |
| `FINANCIAL_STRATEGY` | Admitted planning readiness only | `FINANCIAL_STRATEGY` objective; Scenario `TARGET_ACQUISITION_PRICE_CENTS`; Scenario `DOWN_PAYMENT_BPS` | `annualInterestRateBasisPoints` |
| `BUYER_DECISION` | Admitted | `BUY_PRIMARY_HOME` objective; effective `TARGET_CITIES`; canonical `PURCHASE_PRICE_RANGE_CENTS`; helpful effective `MIN_BEDROOMS` | None |
| `MARKET_INTELLIGENCE` | Admitted | `marketScope`; effective `TARGET_CITIES` only when scope is `CITY` | `marketScope` |

The Financial Strategy contract is planning readiness only. It does not transform basis points into money, infer an interest rate, or become an adapter to the financing calculator.

`INVESTMENT_ANALYSIS`, `SELLER_DECISION`, `PROPERTY_INTELLIGENCE`, and `LOCATION_INTELLIGENCE` remain `NEEDS_RECONCILIATION`. Their existing product inputs are not yet represented by certified Effective Context semantics. Treating them as ready would invent a contract and is prohibited.

## Evaluation Model

Every requirement independently reports presence, verification, freshness, professional-input posture, conflict posture, and matched source lineage without values. Result status is one of `INSUFFICIENT`, `PRELIMINARY_READY`, or `COMPREHENSIVE_READY`; helpful requirements never block either ready status.

The result contains the Case ID, baseline or Scenario mode, Scenario root/version when selected, Effective Context contract/ruleset versions, readiness contract version, a single evaluation timestamp, direct missing/unverified/stale/professional/conflict collections, and resolver limitations. In particular, the resolver's `HISTORICAL_SCENARIO_WITH_CURRENT_CANONICAL_CONTEXT` limitation remains visible.

V1 admits no freshness-dependent requirement and no professional-input-dependent requirement because certified Effective Context does not yet provide an admitted source contract for either threshold. The evaluator and tests retain these postures so future contracts can declare them explicitly rather than relying on a generic percentage.

## Boundaries

The service accepts authenticated owner, Client Case ID, optional explicit Scenario Version ID, capability ID, and typed execution parameters. It resolves owner-scoped Effective Context itself and does not accept a browser-provided Effective Context. Unknown capabilities fail closed; known deferred capabilities return `CAPABILITY_NOT_ADMITTED`.

There is no Prisma schema, migration, readiness table, cache, write operation, route, Client Case UI, Agent UI, consumer integration, provider call, analytics execution, Output or Transaction action, CRM, MLS, search, alert, or contact behavior. Existing products do not consume this result.

## Local Certification

`npm run check:client-case-capability-readiness-foundation` statically protects the server-only/read-only/no-schema/no-route boundary and uses synthetic in-memory resolver data to test baseline and Scenario contexts, historical lineage, isolation, falsey typed values, unknown/deferred rejection, applicability, validation, deterministic output, and no mutation. It also validates global contract identity and semantic registration.

The foundation is local-only until a separate publication authorization. Production schema, data, backfill, runtime use, UI, and capability activation remain separate gates.
