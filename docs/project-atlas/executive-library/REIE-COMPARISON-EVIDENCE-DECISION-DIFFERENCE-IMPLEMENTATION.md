# REIE Comparison Evidence Integrity + Decision Difference Intelligence Implementation

Date: 2026-08-09

Status: `COMPARISON_EVIDENCE_DECISION_DIFFERENCE_LOCALLY_CERTIFIED`

## Executive Summary

Comparison Intelligence now distinguishes which differences are supported by comparable evidence, which differences are calculated from listing facts, which differences reflect evidence asymmetry, which domains remain unavailable, and which questions require verification or professional judgment.

The implementation answers:

> These properties differ, but which differences are actually supported by comparable evidence, which differences are merely data-availability differences, and what should I verify before deciding?

This is not a winner selector, recommendation engine, property ranking, suitability model, score, grade, valuation model, affordability conclusion, lender qualification, or investment recommendation.

## Material Gap Closed

Before this cycle, comparison dimensions could show factual differences, similarities, unavailable evidence, and verification prompts. After Property Evidence Completeness added domain-level evidence status, the remaining comparison gap was evidence integrity: the customer could not quickly tell whether a difference was source-supported, calculated, asymmetric, unavailable, verification-bound, or professional-judgment-bound.

## Implemented Surface

- Added comparison evidence-integrity states to each displayed comparison dimension.
- Added compact comparison evidence-integrity summaries for related-property comparisons.
- Added explicit evidence-asymmetry boundary: more available data does not mean a better property.
- Added bounded limitation cards for public records, tax, permit, HOA, condition/inspection, title/legal, and financing assumptions.
- Added `/sources` methodology continuity from the comparison surface.
- Added deterministic coverage for new comparison evidence behavior.
- Reconciled `docs/CHAT_START.md` from the stale closure-sync gate to the current locally certified implementation gate.

## Evidence Integrity States

- `SUPPORTED DIFFERENCE`
- `DERIVED / CALCULATED DIFFERENCE`
- `EVIDENCE ASYMMETRY`
- `UNAVAILABLE COMPARISON`
- `VERIFICATION REQUIRED`
- `PROFESSIONAL JUDGMENT`

## Evidence Asymmetry Boundary

If one property has more available evidence than another, REIE does not imply that the property is better, safer, lower-risk, more desirable, or more suitable.

The customer-facing boundary is:

`More available data does not mean a better property; unequal evidence means verification may be required before drawing a conclusion.`

## Decision Differences

Comparison continues to use existing listing facts and bounded calculated estimates for:

- price
- price per square foot
- beds
- baths
- square footage
- lot size
- year built
- property type
- listing status
- place context
- financing scenario

Additional limitation cards cover domains where comparable evidence is unavailable or professional review is required:

- public records
- tax
- permit
- HOA
- condition / inspection
- title / legal
- financing assumptions

## Verification Actions

The implementation uses bounded next actions only:

- `CHECK SOURCE`
- `VERIFY WITH COUNTY`
- `REVIEW HOA DOCUMENTS`
- `ASK SELLER / LISTING AGENT`
- `DISCUSS WITH INSPECTOR`
- `DISCUSS WITH LENDER`
- `DISCUSS WITH ATTORNEY`
- `DISCUSS WITH TAX PROFESSIONAL`
- `DISCUSS WITH APPRAISER`

## Financing Boundary

Financing comparison preserves:

- `KNOWN PROPERTY FACT`
- `USER ASSUMPTION`
- `CALCULATED ESTIMATE`
- `UNAVAILABLE / UNVERIFIED COST`

No affordability judgment, lender qualification, loan recommendation, rate quote, or approval conclusion was introduced.

## Source / Trust

`/sources` remains canonical. The implementation does not duplicate Source Registry, activate sources, consume Secondary research, use Yuma material, activate BCOD, retrieve county records, or change source states.

## Customer Control

No hidden state transfer was introduced into Property Inquiry, Contact, CRM/email, Advisory, or customer profiles.

## Protected Boundaries

No winner, best property, recommended property, fit score, quality score, risk score, confidence score, investment score, completeness score, weighted ranking, red/yellow/green property grade, neighborhood ranking, school/safety ranking, demographic steering, protected-class inference, suitability, desirability, investment recommendation, valuation certainty, or financial qualification was introduced.

No Prisma/database/schema change, MLS ingestion change, API mutation, Contact mutation, Property Inquiry mutation, CRM/email behavior, notification change, worker/queue change, telemetry, customer-data expansion, provider activation, credentials/configuration change, push, deployment, or production mutation occurred.

## Validation

- `git diff --check`
- `npm run typecheck`
- `npm run check:comparison-evidence-decision-difference`
- `npm run check:reie-comparison-financing-intelligence`
- `npm run check:property-product-3-1`
- `npm run check:property-evidence-completeness-verification`
- `npm run check:professional-handoff-cohesion`
- `npm run check:reie-decision-intelligence-cohesion`
- `npm run check:public-runtime-safety`
- `npm run check:public-trust-readiness`
- `npm run check:reie-source-registry-grand-plan-advancement`
- `npm run check:cim-privacy-consent-data-minimization-gate`
- `npm run check:buyer-place-intelligence-advancement`
- `npm run check:buyer-financing-readiness-advancement`
- `npm run check:seller-property-intelligence-advancement`
- `npm run check:home-worth-advisory-intelligence`
- `npm run build`

## Next Gate

`READY_FOR_COMPARISON_EVIDENCE_DECISION_DIFFERENCE_PUSH_AUTHORIZATION`
