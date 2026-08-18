# REIE Shared Decision Context Contract MVV Certification

Status: `REIE_SHARED_DECISION_CONTEXT_CONTRACT_MVV_CERTIFIED`
Date: 2026-08-18

## Certified Contract

`lib/reieDecisionContextContract.ts` defines a provider-neutral,
persistence-neutral, explicit-only context envelope for Buyer, Seller,
Property, Market, Financing, Timing, Moving/Transition, and Professional
Verification domains.

The envelope supports selected goals, bounded evidence items, source posture,
professional handoffs, role, visibility, persistence posture, hidden-transfer
posture, and prohibited outputs. It does not accept raw protected records or
infer customer context from behavior.

## Validation

`scripts/checkReieDecisionContextContract.ts` passes explicit fact and
user-assumption fixtures and fails closed for persistence, hidden transfer, and
invalid prohibited-output states.

The contract is reusable by Modules 6, 7, 8, and 16 without collapsing their
independent source, compliance, or professional-governance boundaries.
