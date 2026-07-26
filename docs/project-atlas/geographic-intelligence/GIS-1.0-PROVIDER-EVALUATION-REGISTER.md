# PROJECT ATLAS(tm)

## GIS 1.0 Provider Evaluation Register

Status: `GIS_1_0_SPRINT_5_PROVIDER_EVALUATION_AND_SELECTION_GOVERNANCE_CERTIFIED`

Date: July 26, 2026

---

## Boundary

`PROVIDER EVALUATION DOES NOT AUTHORIZE PROVIDER USE`

This register is deterministic, internal-only, fixture-backed, and repository-local. It contains no live research, current external verification, pricing, contract terms, provider contact, account creation, credentials, acquisition, persistence, retrieval, runtime behavior, downstream integration, customer visibility, or geographic relationships.

## Capability Requirement

- Capability: `ENVIRONMENTAL_GEOGRAPHIC_EVIDENCE_PROVIDER_EVALUATION`
- Intended use: `INTERNAL_GOVERNANCE_EVALUATION_ONLY`
- Required domain: `ENVIRONMENTAL_INTELLIGENCE`
- Coverage requirement: `VARIABLE`
- Reference date: `2026-07-26`
- Scoring model: `GIS_SPRINT_5_PROVIDER_EVALUATION_SCORING_MODEL`
- Version: `1.0.0`
- Fingerprint: `f79beea89c956509493030b15b3d94bdc4495d9618fd72d97138ca363be74691`

## Criteria

The register uses 24 weighted criteria: source authority, subject relevance, domain relevance, geographic coverage, evidence completeness, freshness potential, quality potential, licensing certainty, permitted-use certainty, attribution burden, technical-access certainty, contract complexity, commercial cost, implementation complexity, continuity risk, dependency risk, overlap or redundancy, unique-value contribution, resilience contribution, current verification state, privacy/security risk, customer-value potential, explainability, and auditability.

Mandatory gates remain separate from weighted score.

## Candidate Register

| Candidate | Evidence references | Known facts | Known unknowns | Score | Mandatory gates | Disposition | Rationale |
| --- | --- | --- | --- | ---: | --- | --- | --- |
| Colorado Geological Survey | `GIS_SPRINT_3_PROVIDER_INVENTORY:colorado-geological-survey` | Government publisher; environmental relevance; Colorado jurisdiction context | Licensing, permitted use, technical access, current availability, pricing, contract terms | `58.62` | Licensing unknown; permitted use unknown; legal unknown; technical unknown | `SELECTED_FOR_CONTROLLED_PROVIDER_DUE_DILIGENCE` | Strong authority and relevance; gates prevent implementation readiness |
| U.S. Geological Survey | `GIS_SPRINT_3_PROVIDER_INVENTORY:u-s-geological-survey` | Government originating authority; environmental relevance | Licensing, permitted use, technical access, current availability, pricing, contract terms | `58.62` | Licensing unknown; permitted use unknown; legal unknown; technical unknown | `SELECTED_FOR_CONTROLLED_PROVIDER_DUE_DILIGENCE` | Deterministic tie fixture; stable ID tie-break places it after Colorado Geological Survey |
| FEMA flood-map source class | `GIS_SPRINT_3_PROVIDER_INVENTORY:fema-flood-map-source-class` | Environmental risk relevance; potential primary source class | Jurisdiction instance, licensing, permitted use, technical access | `54.07` | Licensing unknown; permitted use unknown; legal unknown; technical unknown | `RETAINED_AS_FALLBACK_CANDIDATE` | Overlap and resilience retained without equivalence |
| National Weather Service | `GIS_SPRINT_3_PROVIDER_INVENTORY:national-weather-service` | Government originating authority; weather context | Use rights and technical access unresolved | `50.85` | Licensing fail; permitted use fail | `REJECTED` | High score cannot bypass failed licensing/permitted-use gates |
| TitlePro247 | `GIS_SPRINT_3_PROVIDER_INVENTORY:titlepro247` | Commercial vendor and aggregator context | Licensing, permitted use, technical access, contract terms | `50.59` | Licensing fail; permitted use fail | `REJECTED` | Score manipulation fixture proves gates override favorable non-gating scores |
| Air-quality source class | `GIS_SPRINT_3_PROVIDER_INVENTORY:air-quality-source-class` | Unique environmental/lifestyle evidence category | Source identity, licensing, permitted use, technical access | `50.35` | Licensing unknown; permitted use unknown; legal unknown; technical unknown | `RETAINED_AS_SUPPLEMENTAL_CANDIDATE` | Unique category cannot satisfy full capability alone |
| Boulder County GIS | `GIS_SPRINT_3_PROVIDER_INVENTORY:boulder-county-gis` | County GIS context; environmental relevance | Licensing, permitted use, broader coverage, technical access | `49.64` | Geographic coverage fail | `FAILED_CLOSED_MANDATORY_GATE` | County-specific scope is misaligned to fixture coverage requirement |
| Colorado Open Records Act request channels | `GIS_SPRINT_3_PROVIDER_INVENTORY:colorado-open-records-act-request-channels` | Request-channel governance context | Conflict status, licensing, permitted use, workflow suitability | `48.00` | Conflict unknown; licensing unknown; technical unknown | `GOVERNANCE_REVIEW_REQUIRED` | Conflict-of-interest and workflow governance remain unresolved |
| ATTOM Data | `GIS_SPRINT_3_PROVIDER_INVENTORY:attom-data` | Commercial data provider context; broad analytics context | Contract terms, pricing, licensing, permitted use, technical access | `47.51` | Licensing unknown; permitted use unknown; legal unknown; technical unknown | `COMMERCIAL_REVIEW_REQUIRED` | Commercial breadth does not imply acquisition or implementation readiness |
| Realtors Property Resource | `GIS_SPRINT_3_PROVIDER_INVENTORY:realtors-property-resource` | Membership-governed research platform context | Current availability, licensing, permitted use, technical access | `45.85` | Technical unknown; licensing unknown | `TECHNICAL_REVIEW_REQUIRED` | Stale/current verification scenario blocks current-use claims |
| Wildfire-risk source class | `GIS_SPRINT_3_PROVIDER_INVENTORY:wildfire-risk-source-class` | Environmental risk class | Source, authority, coverage, licensing, permitted use, technical access | `41.90` | Licensing unknown; permitted use unknown; technical unknown | `INSUFFICIENT_EVIDENCE` | Generic inventory evidence is insufficient for stronger candidacy |
| Zillow | `GIS_SPRINT_3_PROVIDER_INVENTORY:zillow` | Consumer portal and research context | Authority, licensing, permitted use, technical access | `41.14` | Licensing unknown; permitted use unknown; legal unknown | `RESEARCH_REFERENCE_ONLY` | Consumer portal remains supplemental research context |
| ShowingTime | `GIS_SPRINT_3_PROVIDER_INVENTORY:showingtime` | Operational showing workflow context | Evidence authority for capability absent | `33.10` | Capability relevance fail; coverage fail | `OPERATIONAL_TOOL_ONLY` | Operational tool is outside environmental evidence capability |

## Proposed Minimum Provider Set

- Set ID: `GIS-S5-MINIMUM-SET-7d0b83d2f24a2369`
- Classification: `PROPOSED_MINIMUM_PROVIDER_SET_FOR_DUE_DILIGENCE`
- Entries: Colorado Geological Survey; U.S. Geological Survey; FEMA flood-map source class; air-quality source class
- Categories covered: air quality context; environmental risk; geologic context
- Overlap preserved: `true`
- Provider use authorized: `false`

The set preserves authority, fallback, supplemental uniqueness, and resilience while retaining unresolved licensing, permitted-use, legal, technical, privacy/security, and verification gates.

## Retained Prohibitions

This register does not authorize provider contact, accounts, credentials, live due diligence, legal review, contract review, purchasing, live provider selection, provider-adapter implementation, acquisition, persistence, retrieval, enterprise consumption, runtime, downstream integration, customer visibility, Colorado runtime consumption, geographic relationships, hierarchy inference, or GOF Wave 5.
