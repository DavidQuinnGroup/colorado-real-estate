# REIE Decision Guide Prohibited Claim Checker Semantic Recovery Certification

Program: PROJECT ATLAS / REIE Decision Guide Safety
Date: 2026-08-18
Baseline: `dd83fcbfa2c8a4fc8f9a71f87acf5e33ee04f459`
Status: `DECISION_GUIDE_PROHIBITED_CLAIM_CHECKER_FALSE_POSITIVE_RECOVERED`

## False Positive

`scripts/checkColoradoDecisionGuideGenerationSystem.ts` previously rejected any
occurrence of `protected-class` in the static Decision Guide source scan. The
scan matched this explicit Boulder Answer Unit safety attribute:

`data-answer-unit-protected-class-implication="false"`

The attribute was introduced in commit
`f5680c2735e52ef0510ba28ff433243d1d025dea` as part of the certified Boulder
Market AEO Answer Unit pilot. It is JSX metadata, not customer-visible claim
prose, and its governed value explicitly states that protected-class implication
is absent.

## Semantic Correction

The checker now removes only that exact false-valued marker before applying its
protected-class implication guard. The same source scan also contains one
explicit negative customer limitation stating that the Answer Unit is not an
investment recommendation; the checker recognizes that exact limitation while
rejecting any other investment-recommendation phrase. It does not exclude the
route or any source file from scanning, rename or delete safety markers, or
relax the broader prohibited claim rules.

Deterministic fixtures prove that the false marker passes while each of these
unsafe forms fails:

- best, ideal, or suitable for a protected class;
- protected-class neighborhood recommendation, ranking, preference, or inference;
- steering implication for a protected class.

Any remaining protected-class token in the scanned Decision Guide sources still
fails the checker.

## Preserved Boundaries

No Decision Guide maturity, public eligibility, Market/AEO containment, source
rights, source activation, provider behavior, Registry, Operational Manifest,
customer data, route, sitemap, or runtime behavior changed.

The repair preserves strict fair-housing and anti-steering detection while
allowing the exact existing negative safety assertion to function as intended.

## Phase 2 Wave Reconciliation

The same raw scan occurred in the explicitly authorized Phase 2 Wave 1, Wave 2,
and Wave 3 checkers. Each now removes only the same exact false-valued marker
and exact negative investment limitation before retaining its prohibited-pattern
set. Each checker includes deterministic fixtures showing those two safe values
pass while protected-class implication, ranking, inference, steering, and
investment-recommendation claims fail.

The shared `decisionGuideValidation.ts` validator used by the Boulder,
Louisville, and Lafayette wrappers had the same active P0 raw scan. It now uses
the same exact-literal normalization and paired fixtures, including the allowed
neutral limitation that protected-class inference or ranking does not occur.
