# REIE Evidence-Bound Current-State Agent Briefing Packet MVV Certification

Program: `REIE_EVIDENCE_BOUND_CURRENT_STATE_AGENT_BRIEFING_PACKET_MVV`

Status: `EVIDENCE_BOUND_CURRENT_STATE_AGENT_BRIEFING_PACKET_MVV_IMPLEMENTED_AND_LOCALLY_CERTIFIED`

## Contract

`lib/agentBriefingPreparation.ts` is a pure deterministic internal preparation contract for the explicitly selected `MARKET_PLACE` briefing type. It accepts human-supplied evidence sections and preserves their evidence states, source identity, visible/effective dates, limitations, and verification requirements. It returns a packet that is ready for agent review, review-required because evidence is incomplete, or fail-closed because required inputs or protected boundaries are invalid.

The contract is a composition layer. It does not retrieve or recompute Market Product metrics, recreate the market/newsletter package, rewrite City Decision Guides, recreate Neighborhood Product or Source Trust, or depend on Comparable Input, Open-House, Seller Update, buyer inquiry, or provider contracts.

## Inputs and Outputs

Inputs require generated time, `MARKET_PLACE`, an internal purpose, and one or more selected sections. Every section supplies an identifier, title, source identity, evidence with an explicit state, limitations array, and verification-requirements array. Visible and effective dates are optional but their absence is represented as a source/date limitation.

Evidence states remain distinct: `FACTUAL_SUPPLIED`, `CALCULATED_SUPPLIED`, `UNKNOWN`, `NOT_AVAILABLE`, and `NOT_VERIFIED`. Unknown, unavailable, and unverified entries require a null value and cannot become factual claims or talking points.

Outputs preserve evidence and source posture, expose completeness/readiness, list missing evidence, produce only evidence-derived internal talking-point inputs, provide neutral review questions, and include human, professional, and fair-housing boundaries.

## Current-State Limitation

The MVV is point-in-time only. It has no baseline, snapshot history, period-comparison input, trend analysis, or change-detection feature. It therefore does not make claims about prior state or directional movement.

## Professional and Fair-Housing Boundaries

The packet does not interpret brokerage policy or replace managing-broker supervision. It provides no legal, compliance, fiduciary, pricing, negotiation, offer, suitability, or client-specific advice.

It rejects supplied evidence that contains protected-class, demographic-targeting, desirability, suitability, good/bad-area, school-ranking, safety/crime-as-suitability, or steering language. Objective evidence is not converted into suitability advice.

## Internal-Only and Zero-Side-Effect Posture

The contract performs no customer delivery, email, chat/broadcast, scheduling, CRM behavior, persistence, provider call, network call, database access, discovery, calculation, ranking, recommendation, or inference. It creates no UI, route, API, background process, or telemetry.

## Fixture Certification

`npx tsx scripts/checkAgentBriefingPreparation.ts` validates valid multi-section composition, factual/calculated labeling, source/date/limitation/verification preservation, incomplete-evidence posture, unknown-evidence fail-closed handling, fair-housing fail-closed behavior, internal-only and professional boundaries, current-state-only talking points, determinism, and a static protected-system/duplicate-import guard.

## Collision Safety

The MVV adds only the pure contract, its direct fixture checker, and this certification document. It does not modify Prisma, Property persistence, public-search eligibility, MLS, Search, Typesense, alerts, email, CRM, queues, workers, configuration, routes, or existing product contracts.

## Next Gate

The next possible authorization is a read-only canonical-integration review. A protected preview, specialist-packet adapters, historical comparison, automated team delivery, persistence, and customer-facing use each require separate scope and governance approval.
