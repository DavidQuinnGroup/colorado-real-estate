# REIE Agent Work Replacement Phase 2 Candidate Scorecard

Program: `REIE_AGENT_WORK_REPLACEMENT_PHASE_2_CANDIDATE_SELECTION_AND_FEASIBILITY`

Date: 2026-08-13

Repository: `/Users/davidquinn/david-quinn-group/colorado-real-estate`

Source feasibility artifact: `docs/project-atlas/executive-library/REIE-AGENT-WORK-REPLACEMENT-PHASE-2-CANDIDATE-FEASIBILITY.md`

Status: `REIE_AGENT_WORK_REPLACEMENT_PHASE_2_CANDIDATE_SCORECARD_COMPLETE_LOCAL_DOCS_ONLY`

## Methodology

Positive criteria use a 1-5 score where 5 is strongest:

1. Agent labor leverage
2. Frequency / repetition
3. Customer value
4. Team value
5. Architectural reuse
6. Implementation clarity
7. Evidence / data readiness
8. Reversibility

Risk criteria use a 1-5 score where 5 is highest risk:

9. Duplication risk
10. Protected-system risk
11. Compliance / privacy risk
12. External dependency

Composite method:

`positive subtotal - risk subtotal = net score`

The composite is directional only. It does not override protected-system gates or human professional boundaries.

## Candidate Scorecard

| Candidate | Agent labor | Repetition | Customer value | Team value | Reuse | Clarity | Evidence ready | Reversible | Positive subtotal | Duplication risk | Protected risk | Compliance risk | External dep. | Risk subtotal | Net |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Candidate 1: recurring market/newsletter agent-review package | 5 | 5 | 4 | 5 | 5 | 4 | 4 | 5 | 37 | 2 | 1 | 2 | 1 | 6 | 31 |
| Candidate 2: saved-search alert cadence and changed-listing follow-up | 5 | 5 | 5 | 4 | 5 | 3 | 4 | 2 | 33 | 3 | 5 | 4 | 2 | 14 | 19 |
| Candidate 3: CRM task workflow hardening | 4 | 4 | 4 | 4 | 5 | 3 | 4 | 3 | 31 | 3 | 4 | 4 | 1 | 12 | 19 |
| Challenger: open-house preparation workflow | 4 | 3 | 4 | 3 | 3 | 2 | 2 | 3 | 24 | 2 | 4 | 4 | 2 | 12 | 12 |
| Challenger: comparable / sold-comp preparation inputs | 5 | 4 | 5 | 4 | 4 | 2 | 3 | 3 | 30 | 3 | 3 | 4 | 3 | 13 | 17 |
| Challenger: admin/source quality review consolidation | 3 | 4 | 2 | 5 | 5 | 4 | 5 | 5 | 33 | 2 | 1 | 2 | 1 | 6 | 27 |

## Score Rationale

### Candidate 1

Recurring market/newsletter package work earns the highest net score because it directly targets recurring research and composition labor while reusing certified market, city, neighborhood, source, and article foundations. Its MVV can stay non-sending, non-mutating, and provider-independent.

Primary risk is duplication: implementation must assemble existing REIE outputs, not create a parallel Market Product or new public content system.

### Candidate 2

Saved-search alert cadence has excellent labor and customer value, but the current repository already contains SavedSearch, AlertQueue, alert processing, worker paths, unsubscribe, click tracking, email delivery, and diagnostics. The next real step would cross email, queue, worker, customer persistence, consent, and production activation gates.

It is better classified as a strong follow-on certification/activation candidate than as the next implementation winner.

### Candidate 3

CRM hardening also reuses substantial existing architecture: CRMTask, SellerLead, property inquiry, save-search intake, admin CRM APIs, and readiness reporting. However, further progress risks becoming customer-data mutation, review/status mutation, hidden lead-scoring, or operational activation.

It should remain a later hardening/certification track unless Executive HQ specifically wants to spend a protected CRM/customer-data authorization.

### Open-House Challenger

Open-house preparation has real event-driven value, but repository evidence shows event scheduling/data handling is not wired as an operation. A meaningful implementation would likely touch calendar/event data, CRM, lead handling, and consent. It does not displace Candidate 1.

### Comparable / Sold-Comp Challenger

Comparable and sold-comp preparation is high-value, but sold-data completeness, professional-boundary, appraisal, CMA, and fiduciary controls make it riskier. It should follow only after scope is narrowed to inputs and not recommendations.

### Admin / Source Quality Challenger

Admin/source quality review scores well because it is low-risk and highly reusable, but it is more team-operational than customer/agent recurring market labor. It is a good future internal capability, not the winner for this phase.

## Final Ranking

1. `RECURRING_SOURCE_FRESH_MARKET_NEWSLETTER_AGENT_REVIEW_PACKAGE`
2. `ADMIN_SOURCE_QUALITY_REVIEW_CONSOLIDATION` as low-risk internal challenger, not selected
3. `SAVED_SEARCH_ALERT_CADENCE_AND_CHANGED_LISTING_FOLLOW_UP` as high-value protected-system follow-on
4. `CRM_TASK_WORKFLOW_HARDENING` as protected CRM/customer-data follow-on
5. `COMPARABLE_SOLD_COMP_INPUT_PREPARATION` as future professional-boundary candidate
6. `OPEN_HOUSE_PREPARATION_WORKFLOW` as future event/CRM candidate

## Selected Winner

`RECURRING_SOURCE_FRESH_MARKET_NEWSLETTER_AGENT_REVIEW_PACKAGE`

The selected candidate can reduce repeated agent work now while preserving provider independence, human editorial approval, professional judgment, and protected-system boundaries.
