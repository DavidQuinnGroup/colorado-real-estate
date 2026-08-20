# DQG Agent Preparation Context Adapter: Market-Only MVV Certification

Status: `DQG_AGENT_PREPARATION_CONTEXT_ADAPTER_MARKET_ONLY_CERTIFIED`

## Scope

`agentMarketPreparationContextAdapter.ts` establishes a finite, read-only,
side-effect-free boundary for one explicitly certified non-customer market
context. It admits only `AGENT_MARKET_PREPARATION_CONTEXT` for
`MARKET_CONVERSATION` and returns a deterministic structured human-briefing
contract.

The adapter is not a source consumer, provider activation path, customer-data
surface, CRM integration, persistence mechanism, recommendation engine, or UI.
Source availability, public visibility, and admin visibility do not grant Agent
preparation authorization.

## Authorization Boundary

The future exact `/agent/prepare/market` surface is classified as a read-only
`HUMAN_AGENT` / `AGENT` surface using only `HUMAN_AGENT_SESSION`. It does not
authorize `/agent/*`, `/admin`, MCP controls, admin APIs, customer data, CRM,
provider activity, persistence, mutation, or inherited admin authority.

Existing `/admin/agent-briefing-preparation` remains the separate synthetic
contract-regression proof harness. Existing `ADMIN_ONLY` contracts remain
unchanged.

## Admission And Briefing Contract

Every admitted observation preserves source identity, source class,
observation/effective dates, freshness, permitted-use posture, completeness,
conflicts, certification, professional-verification requirement, and
limitations. Undeclared, customer, behavioral, hidden, admin, MCP, mutation,
provider, recommendation, ranking, scoring, and protected-class fields fail
closed.

The structured briefing exposes only summary, material observations,
verification items, neutral questions, professional handoffs, evidence posture,
limitations, authorized review surfaces, prohibited outputs, and a safe next
action. It never produces recommendations, predictions, urgency, suitability,
pricing, offers, negotiation, investment, provider selection, steering, or
protected-class inference.

## States

`READY`, `INCOMPLETE`, `CONFLICTING`, `STALE`, and
`PROFESSIONAL_REVIEW_REQUIRED` may retain admitted context with constrained
briefing output. `INSUFFICIENT_CONTEXT`, `UNAUTHORIZED_CONTEXT`, and
`UNSUPPORTED_TASK_CONTEXT` return no context and no substantive briefing.

## Verification

`npm run check:agent-market-preparation-context-adapter` verifies the finite
Market-only class, deterministic states, provenance preservation, firewalls,
exact future route classification, preserved proof harness, and unchanged
admin-boundary posture.

## Non-Authorization

This certification does not authorize the `/agent` UI, Seller Update, Offer
Preparation, property selection, customer data, CRM, persistence, source or
provider activation, recommendations, broader Agent access, or deployment.
