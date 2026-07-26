# PROJECT ATLAS(tm)

## GIS 1.0 Sprint 5 Provider Evaluation and Selection Governance

Status: `GIS_1_0_SPRINT_5_PROVIDER_EVALUATION_AND_SELECTION_GOVERNANCE_CERTIFIED`

Date: July 26, 2026

---

## Certification Summary

GIS Sprint 5 established deterministic, internal-only provider evaluation and selection governance. It evaluates Sprint 3 provider inventory entries against a bounded fixture capability, preserves uncertainty, applies weighted scoring, enforces mandatory gates, records dispositions, proposes a due-diligence-only minimum provider set, and proves that ranking does not authorize provider use.

## Implemented Surface

- `lib/geographic-intelligence/providerEvaluationContract.ts`
- `lib/geographic-intelligence/providerEvaluationScoring.ts`
- `lib/geographic-intelligence/providerEvaluationGates.ts`
- `lib/geographic-intelligence/providerSelectionGovernance.ts`
- `lib/geographic-intelligence/minimumProviderSet.ts`
- `lib/geographic-intelligence/fixtures/gisSprint5ProviderEvaluationFixtures.ts`
- `scripts/checkGeographicIntelligenceProviderEvaluationSafety.ts`
- `scripts/certifyGeographicIntelligenceProviderEvaluationGovernance.ts`

## Principles Certified

- `GIS-PES-P001 Capability-Bounded Evaluation`: no global ranking without capability context.
- `GIS-PES-P002 Evidence-Based Evaluation`: scores and dispositions reference Sprint 3 inventory evidence.
- `GIS-PES-P003 Uncertainty Preservation`: unknowns remain unknown and penalized or gated.
- `GIS-PES-P004 Score Is Not Authorization`: high scores do not authorize use.
- `GIS-PES-P005 Selection Is Due-Diligence-Only`: strongest outcome is controlled due-diligence candidacy.
- `GIS-PES-P006 Minimum Necessary Provider Set`: proposed set is bounded and non-authorizing.
- `GIS-PES-P007 Authority and Use-Rights Separation`: authority, quality, coverage, access, licensing, and use are separate.
- `GIS-PES-P008 Commercial Neutrality`: commercial status and cost do not imply preference.
- `GIS-PES-P009 Operational Tool Exclusion`: operational tools do not become evidence authorities.
- `GIS-PES-P010 Consumer Portal Restraint`: portals remain research-reference-only without stronger evidence.
- `GIS-PES-P011 Jurisdictional Suitability`: coverage is evaluated against the capability.
- `GIS-PES-P012 Overlap and Resilience`: overlap is preserved and not treated as equivalence.
- `GIS-PES-P013 Rejection and Deferral Preservation`: reasons and reconsideration conditions are retained.
- `GIS-PES-P014 Deterministic Decision`: repeated inputs produce identical scores, ranking, dispositions, and fingerprint.
- `GIS-PES-P015 Human Governance`: scoring informs governance; it does not make legal, procurement, or production decisions.
- `GIS-PES-P016 Conflict-of-Interest Transparency`: unknown conflict state remains unknown.
- `GIS-PES-P017 Legal and Licensing Gate`: unresolved rights prevent implementation readiness.
- `GIS-PES-P018 Current Verification Gate`: inventory-only or stale entries cannot be represented as currently usable.

## Evaluation Subject

- Capability requirement: `ENVIRONMENTAL_GEOGRAPHIC_EVIDENCE_PROVIDER_EVALUATION`
- Intended use: `INTERNAL_GOVERNANCE_EVALUATION_ONLY`
- Geographic requirement: `VARIABLE`
- Domain requirement: `ENVIRONMENTAL_INTELLIGENCE`
- Evidence categories: environmental risk, geologic context, weather context, air quality context, fallback research context
- Candidates evaluated: `13`
- Criteria count: `24`
- Scoring model: `GIS_SPRINT_5_PROVIDER_EVALUATION_SCORING_MODEL`
- Scoring version: `1.0.0`
- Deterministic fingerprint: `f79beea89c956509493030b15b3d94bdc4495d9618fd72d97138ca363be74691`

Evidence limitation: all facts are repository-local Sprint 3 inventory facts. No live research or current provider verification occurred.

## Evaluation Results

| Rank | Candidate | Score | Disposition |
| --- | --- | ---: | --- |
| 1 | Colorado Geological Survey | `58.62` | `SELECTED_FOR_CONTROLLED_PROVIDER_DUE_DILIGENCE` |
| 2 | U.S. Geological Survey | `58.62` | `SELECTED_FOR_CONTROLLED_PROVIDER_DUE_DILIGENCE` |
| 3 | FEMA flood-map source class | `54.07` | `RETAINED_AS_FALLBACK_CANDIDATE` |
| 4 | National Weather Service | `50.85` | `REJECTED` |
| 5 | TitlePro247 | `50.59` | `REJECTED` |
| 6 | Air-quality source class | `50.35` | `RETAINED_AS_SUPPLEMENTAL_CANDIDATE` |
| 7 | Boulder County GIS | `49.64` | `FAILED_CLOSED_MANDATORY_GATE` |
| 8 | Colorado Open Records Act request channels | `48.00` | `GOVERNANCE_REVIEW_REQUIRED` |
| 9 | ATTOM Data | `47.51` | `COMMERCIAL_REVIEW_REQUIRED` |
| 10 | Realtors Property Resource | `45.85` | `TECHNICAL_REVIEW_REQUIRED` |
| 11 | Wildfire-risk source class | `41.90` | `INSUFFICIENT_EVIDENCE` |
| 12 | Zillow | `41.14` | `RESEARCH_REFERENCE_ONLY` |
| 13 | ShowingTime | `33.10` | `OPERATIONAL_TOOL_ONLY` |

Colorado Geological Survey and U.S. Geological Survey intentionally tie on weighted score; the deterministic tie-breaker uses stable inventory-entry ID.

## Scenario Results

| Scenario | Result |
| --- | --- |
| A Strong authority, unknown rights | `SELECTED_FOR_CONTROLLED_PROVIDER_DUE_DILIGENCE` |
| B Commercial vendor with broad coverage | `COMMERCIAL_REVIEW_REQUIRED` |
| C Consumer portal | `RESEARCH_REFERENCE_ONLY` |
| D Operational tool | `OPERATIONAL_TOOL_ONLY` |
| E Jurisdictionally misaligned candidate | `OUTSIDE_CAPABILITY_SCOPE` |
| F Duplicate or overlapping candidate | `RETAINED_AS_FALLBACK_CANDIDATE` |
| G Unique supplemental candidate | `RETAINED_AS_SUPPLEMENTAL_CANDIDATE` |
| H Insufficient evidence | `INSUFFICIENT_EVIDENCE` |
| I Disqualifying licensing condition | `REJECTED` |
| J Minimum provider set | `PROPOSED_MINIMUM_PROVIDER_SET_FOR_DUE_DILIGENCE` |
| K Deterministic tie | `DETERMINISTIC_TIE_RESOLVED` |
| L Conflict-of-interest unknown | `GOVERNANCE_REVIEW_REQUIRED` |
| M Stale verification | `TECHNICAL_REVIEW_REQUIRED` |
| N Score manipulation attempt | `FAILED_CLOSED_MANDATORY_GATE` |

## Minimum Provider Set

- Set ID: `GIS-S5-MINIMUM-SET-7d0b83d2f24a2369`
- Classification: `PROPOSED_MINIMUM_PROVIDER_SET_FOR_DUE_DILIGENCE`
- Candidate entries: Colorado Geological Survey, U.S. Geological Survey, FEMA flood-map source class, air-quality source class
- Categories covered: air quality context, environmental risk, geologic context
- Overlap preserved: `true`
- Provider-use authorization: `false`

Unresolved gates remain for licensing, permitted use, legal review, technical feasibility, privacy/security, and verification.

## Production Effect

- Deployments: `0`
- Migrations: `0`
- Production reads: `0`
- Production writes: `0`
- External calls: `0`
- Provider contacts: `0`
- Accounts created: `0`
- Credentials used: `0`
- Contracts accepted: `0`
- Purchases: `0`
- Provider connections: `0`
- Acquisitions: `0`
- Runtime activations: `0`
- Downstream integrations: `0`
- Customer-visible changes: `0`
- Relationships created: `0`

## Governance State

- GIS Sprint 1: `CERTIFIED_AND_CLOSED`
- GIS Sprint 2: `CERTIFIED_AND_CLOSED`
- GIS Sprint 3: `CERTIFIED_AND_CLOSED`
- GIS Sprint 4: `CERTIFIED_AND_CLOSED`
- GIS Sprint 5: `GIS_1_0_SPRINT_5_PROVIDER_EVALUATION_AND_SELECTION_GOVERNANCE_CERTIFIED`
- GIS Sprint 6: `NOT_AUTHORIZED`

Retained prohibitions: provider contact, accounts, credentials, live due diligence, legal review, contract review, purchasing, live provider selection, provider-adapter implementation, acquisition, persistence, retrieval, enterprise consumption, runtime, downstream integration, customer visibility, Colorado runtime consumption, geographic relationships, hierarchy inference, and GOF Wave 5 remain `NOT_AUTHORIZED`.

## Validation Commands

- `npm run worker:build`
- `npm run check:geographic-intelligence-provider-evaluation-safety`
- `npm run certify:geographic-intelligence-provider-evaluation-governance`
- `npm run check:geographic-intelligence-architecture-safety`
- `npm run certify:geographic-intelligence-architecture-foundation`
- `npm run check:geographic-intelligence-evidence-provenance-safety`
- `npm run certify:geographic-intelligence-evidence-provenance-foundation`
- `npm run check:geographic-intelligence-provider-inventory-safety`
- `npm run certify:geographic-intelligence-provider-inventory-governance`
- `npm run check:geographic-intelligence-fixture-provider-adapter-safety`
- `npm run certify:geographic-intelligence-fixture-provider-adapter`
- `npm run check:geographic-intelligence-object-safety`
- `npm run typecheck`
- `npm run lint`
- `npx prisma validate`
- `npm run build`
- `git diff --check`
- `git diff --cached --check`

## Next Decision Gate

The next governed phase, if separately authorized, is GIS 1.0 Sprint 6 Controlled Provider Due Diligence. Sprint 6 remains `NOT_AUTHORIZED`.
