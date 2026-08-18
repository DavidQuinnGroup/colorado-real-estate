# REIE Source Rights Enhanced Foundation Regression Recovery Certification

Program: PROJECT ATLAS / REIE Source Rights and Decision Guide Governance
Date: 2026-08-18
Baseline: `dd83fcbfa2c8a4fc8f9a71f87acf5e33ee04f459`
Status: `SOURCE_RIGHTS_EXPECTED_INVENTORY_RECONCILED_WITH_CANONICAL_DECISION_GUIDE_REGISTRY`

## Root Cause

`scripts/checkSourceRightsActivationReadiness.ts` retained the six-city
Enhanced Foundation inventory certified during Local Decision Intelligence
Phase 2:

- Broomfield
- Denver
- Erie
- Longmont
- Superior
- Westminster

Commit `e2c58474a3cc0f2d15158fcc8d44a870bf155006` subsequently introduced
Brighton, Firestone, and Frederick as public `ENHANCED_FOUNDATION` Decision
Guides in the canonical registry. Its Search-LDI checker explicitly verifies
their registry maturity, public eligibility, continuity, source-registry
containment, and exclusion from the Market/AEO allowlist.

The Source Rights checker did not change with that later Decision Guide
expansion. Its expected list was therefore stale; the failure was not a Module
16 defect and did not identify a source-rights exclusion.

## Reconciliation

The checker now validates the exact nine-city canonical inventory and its
deterministic sorted fingerprint:

`Brighton|Broomfield|Denver|Erie|Firestone|Frederick|Longmont|Superior|Westminster`

This aligns a test expectation to existing canonical registry truth only.

## Preserved Source Rights Posture

No Source Rights record, recommendation, activation candidate, activation
score, source identity, freshness posture, reuse authority, customer-display
authority, Registry entry, Operational Manifest entry, or source activation
changed.

Brighton, Firestone, and Frederick remain Enhanced Foundation Decision Guides,
not Market/AEO allowlist members. This reconciliation creates no new provider,
customer claim, or source-specific rights inheritance.

## Validation Requirement

Canonicalization requires the Source Rights checker, Search-LDI advancement,
Decision Guide regressions, Source Registry, Source Quality, Operational
Manifest, Public Trust, cohesion checks, Module 16 checks, typecheck, runtime
import resolution, build, route smoke, and diff checks to remain green.
