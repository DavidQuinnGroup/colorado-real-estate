# DQG Agent Market Real Certified Context Producer MVV Certification

## Status

`DQG_AGENT_MARKET_REAL_CERTIFIED_CONTEXT_PRODUCER_CERTIFIED`

The certified producer is a read-only internal adapter from the existing
repository-local city-market source, `EXP-SRC-REIE-CITY-MARKET-DATA`, to the
already-certified `AGENT_MARKET_PREPARATION_CONTEXT` contract. It does not
read a provider, refresh source data, persist context, or change a public route.

## Certified Scope

The finite supported identities are Boulder, Louisville, Lafayette, Superior,
Erie, and Longmont, represented by their canonical city market slugs. Each
result preserves the source identity, the fixed 2026-07-29 observation and
effective date, reviewed repository-local storage posture, three bounded
observations (inventory, days-on-market, and median-price context), limitations,
neutral verification questions, and one agent-only professional review handoff.

The producer is useful for a concise point-in-time market briefing. It is not a
current-condition guarantee: the 31-day freshness gate and professional review
state require confirmation before conversational reliance.

## Admission and Fail-Closed Policy

`CERTIFIED` output is admitted by the existing Agent adapter as
`PROFESSIONAL_REVIEW_REQUIRED`. Unknown markets, unreviewed rights, stale
evidence, incomplete evidence, conflicts, and non-repository runtime sources
return no context. Niwot, Gunbarrel, Table Mesa, Denver, customer data, private
context, admin state, MCP state, provider runtime, persistence, and synthetic
fallbacks are not producer inputs.

The producer does not authorize public display, Search, Map, Market runtime,
Property assignment, source activation, ingestion, provider calls, CRM,
recommendation, ranking, scoring, urgency, suitability, pricing strategy, offer
or negotiation strategy, investment advice, steering, or protected-class
inference.

## Verification

`npm run check:real-market-preparation-context-producer` proves deterministic
identity selection, provenance, rights, freshness, completeness, conflict,
usefulness, adapter admission, and negative fail-closed cases. It also asserts
the producer has no provider, environment, persistence, customer, CRM, scoring,
or browser-state dependency.

This certification authorizes only internal, non-customer Agent market
preparation composition. It does not implement `/agent/prepare/market`.
