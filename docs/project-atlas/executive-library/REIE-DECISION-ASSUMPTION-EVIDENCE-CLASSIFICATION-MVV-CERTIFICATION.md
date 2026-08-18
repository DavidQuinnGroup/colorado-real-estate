# REIE Decision Assumption And Evidence Classification MVV Certification

Status: `REIE_DECISION_EVIDENCE_CLASSIFICATION_MVV_CERTIFIED`
Date: 2026-08-18

## Certified Contract

`lib/reieDecisionEvidenceClassification.ts` defines seven explicit states:

`FACT`, `USER_ASSUMPTION`, `DERIVED_ILLUSTRATION`, `UNVERIFIED_INPUT`,
`PROFESSIONAL_VERIFICATION_REQUIRED`, `NOT_AVAILABLE`, and
`PROHIBITED_OUTPUT`.

Each item carries scalar bounded value data, provenance, source/freshness and
rights posture, visibility, verification state, and prohibited-use markers.

## Transition Boundary

No item silently becomes stronger. Facts require governed-source or explicit
professional provenance. User assumptions require explicit input. Derived
illustrations require visible assumptions. Prohibited outputs are null,
compliance-blocked, and fail closed.

## Validation

`scripts/checkReieDecisionEvidenceClassification.ts` passes deterministic
fixtures for all supported states and rejects invalid promotion and runtime
dependencies.

No persistence, provider, API, database, CRM, email, Search, Typesense, or
customer-display behavior is included.
