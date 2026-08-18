# REIE Module 10 Capability Visibility Policy MVV Certification

Status: `REIE_MODULE_10_CAPABILITY_VISIBILITY_POLICY_MVV_CERTIFIED`
Date: 2026-08-18

## Contract

`lib/reieCapabilityVisibilityPolicy.ts` defines a persistence-neutral policy
over five independent dimensions: capability, data class, authorization state,
role, and source posture. It includes map precision, private listing context,
valuation detail, financial illustration, investment intelligence, geographic
intelligence, source-quality detail, property-forensic detail, strategy
preparation, AI synthesis, and specialized hub content.

Visibility is limited to `PUBLIC`, `GUIDED`, `PRIVATE_CLIENT`, `AGENT_ONLY`,
`ADMIN_ONLY`, `NOT_AUTHORIZED`, `NOT_READY`, `DATA_INSUFFICIENT`, and
`COMPLIANCE_BLOCKED`.

Source identity, rights, freshness, evidence, activation, and manifest
membership are separate fields. The policy does not treat source identity as
reuse authority, quality as readiness, readiness as approval, approval as
activation, or manifest membership as display authority.

## Evaluation order

`evaluateReieCapabilityVisibilityPolicy` evaluates kill switch, capability and
data-class authorization, source rights/evidence/freshness, approval,
activation, role eligibility, and safe disclosure in that order. Unknown
capabilities, unknown data classes, incomplete source posture, missing
approval, inactive sources, role mismatch, and unsafe disclosures fail closed.

The evaluator has no route, UI, API, database, persistence, provider, live
financial-data, CRM, email, Search, Typesense, or `REIEControlState` behavior.
It does not consume a numeric strategy gate.

## Validation

`scripts/checkReieCapabilityVisibilityPolicy.ts` validates the required
taxonomy, state separation, evaluation order, fail-closed conditions, and
absence of control-state or manifest inference.

`scripts/checkReieCapabilityVisibilityPolicyEvaluator.ts` verifies pure
determinism, role handling, authorization failure, and safe-disclosure output.
