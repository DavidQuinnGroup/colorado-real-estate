# REIE Seller Update Preparation Packet MVV — Certification

## Status

`SELLER_UPDATE_PREPARATION_PACKET_MVV` is a deterministic, fixture-certified, agent-review preparation contract. It is provider-independent, read-only, explicit-input-only, and has zero side effects.

## Contract

The contract requires one explicit subject identity and at least one supplied current listing/property fact. It accepts optional caller-supplied prior facts, optional governed market context, supplied source/timestamp posture, and one or more explicitly agent-supplied competitive fact sets.

Missing subject identity or current facts fails closed. The contract performs no lookup, database access, provider call, search, persistence, or customer action.

## Current Facts and Baselines

The packet organizes supplied address/place, status, listed price, type, beds, baths, square feet, lot size, year built, and other supplied factual fields. Price per listed square foot is included only when listed price and square feet are both supplied and is labeled calculated.

Prior history is never inferred from REIE persistence. A prior baseline is labeled `CALLER_SUPPLIED_BASELINE`. Without one, the packet emits `NO_PRIOR_UPDATE_BASELINE`, produces no deltas, and makes no statement about what changed before the supplied current facts.

When present, deltas compare only fields supplied in both current and prior facts. They state factual difference or unchanged fact only; they do not infer cause, seller impact, urgency, or strategy.

## Market and Competitive Facts

Market facts are optional caller-supplied governed facts, with geography, period/effective date, source/timestamp, limitation, and verification posture preserved. Missing market context remains `MISSING_MARKET_CONTEXT`.

Competitive entries are explicitly agent supplied only. The contract organizes factual and calculated differences, unavailable evidence, and `EVIDENCE_ASYMMETRY`. It never discovers, selects, ranks, scores, recommends, certifies, or values a competitive entry.

## Evidence, Source, and Freshness Boundaries

The packet explicitly marks unavailable or unsupported property DOM, complete listing history, showing/visitor activity, showing feedback, condition/improvements, sold verification, public records, source confidence, and provider freshness.

Source identity, visible timestamp, semantic, limitations, unavailable evidence, and verification requirements are propagated only when supplied. A visible timestamp is not called authoritative MLS freshness unless the caller supplies that governed semantic.

## Professional Boundary

The packet prepares factual evidence and neutral questions. The human agent retains seller relationship management, communication, narrative/tone, pricing, price changes, concessions, staging, marketing, showing-feedback interpretation, negotiation, withdrawal/expiration, CMA methodology, valuation, appraisal, fiduciary advice, and customer communication.

The contract generates no seller message, recommendation, price guidance, valuation, appraisal conclusion, prediction, ranking, scoring, suitability/desirability statement, protected-class inference, safety/school ranking, or steering output.

## Zero-Side-Effect Certification

`lib/sellerUpdatePreparation.ts` is self-contained and has no imports. It has no database, property runtime, provider, network, filesystem, CRM, email, scheduler, queue, worker, telemetry, or persistence behavior.

## Fixture Certification

Run:

```sh
npx tsx scripts/checkSellerUpdatePreparation.ts
```

The deterministic fixture check covers valid and sparse inputs, subject fail-closed behavior, baseline-backed price/status/unchanged facts, missing baseline and market context, one and multiple agent-supplied competitive entries, evidence asymmetry, unavailable evidence, source/timestamp posture, verification questions, human review, prohibited conclusions, protected-system import safety, zero side effects, and fixed-time determinism.

## Agent-Labor Value

The MVV reduces repetitive organization of current listing facts, caller-baseline factual deltas, governed market facts, agent-selected competitive facts, evidence gaps, source/date qualification, seller-meeting preparation, and verification questions. It does not replace seller communication, pricing, strategy, negotiation, or relationship management.

## Collision Safety and Next Gate

This implementation adds only the packet, its fixture validator, and this certification document. It does not modify Prisma, Property persistence, MLS, Search/Typesense, Saved Search/alerts, CRM, package/configuration, or `docs/CHAT_START.md`.

Any protected agent preview, REIE read-side mapping, customer delivery, CRM workflow, scheduling, persistence, or automated recurring behavior requires separate authorization.
