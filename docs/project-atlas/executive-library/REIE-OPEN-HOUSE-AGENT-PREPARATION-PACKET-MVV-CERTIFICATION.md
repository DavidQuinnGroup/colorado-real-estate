# REIE Open-House Agent Preparation Packet MVV Certification

Program: `REIE_OPEN_HOUSE_AGENT_PREPARATION_PACKET_MVV`

Status: `OPEN_HOUSE_AGENT_PREPARATION_PACKET_MVV_IMPLEMENTED_AND_LOCALLY_CERTIFIED`

## Purpose

The MVV deterministically organizes supplied factual inputs for one explicitly identified open-house property into an agent-review preparation packet. It reduces repetitive fact organization, source/timestamp review, evidence-gap review, talking-point preparation, visitor-question preparation, and pre-event checklist preparation. It does not operate an event.

## Contract

`buildOpenHouseAgentPreparationPacket()` accepts a caller-supplied generated timestamp, one supplied property identity, optional supplied property facts, optional source/evidence posture, optional factual market/context inputs, and optional non-personal event label/date-time label.

Property identity is mandatory at runtime: either a non-empty supplied property ID or address is required. Missing identity returns `FAIL_CLOSED`, no property substitution, and no talking-point output.

The packet contains:

- deterministic identity, generated timestamp, and optional event labels;
- supplied property facts, with unsupported/missing facts visibly marked `MISSING_FACT`;
- supplied market/context facts or an explicit `MISSING_CONTEXT` limitation;
- supplied source identity, visible timestamp posture, unavailable evidence, limitations, and verification requirements;
- factual talking-point inputs;
- neutral visitor-question preparation;
- event-preparation checklist;
- fair-housing reminders;
- human professional-boundary reminders; and
- false protected-system assertions for every prohibited operational capability.

## Evidence And Missing-Information Behavior

The MVV performs no lookup or inference. It never treats missing context as a negative property conclusion. If a visible source timestamp is not supplied, it emits `NO_VISIBLE_TIMESTAMP` and does not imply recency. Supplied unavailable evidence, limitations, and verification requirements remain visible for agent review.

## Fair-Housing And Professional Boundaries

The packet explicitly prohibits demographic or protected-class discussion, neighborhood desirability/suitability claims, good/bad-area characterizations, safety or school rankings, and steering. It prepares neutral factual questions only.

The agent retains event planning, property presentation, visitor interaction, factual verification, fair-housing compliance, follow-up, relationship management, negotiation, CMA work, pricing decisions, appraisal reliance, offers, fiduciary advice, and customer communication.

## Zero-Side-Effect Posture

The module is self-contained and pure. It has no imports and performs no database access, Property lookup, OpenHouse-model access, calendar access, scheduling, attendee/visitor/customer handling, CRM, email/SMS, follow-up automation, provider/network call, map/routing, persistence, API, route, telemetry, ranking, scoring, valuation, or pricing recommendation.

It does not depend on Prisma, MLS, Typesense/Search, alerts, queues, workers, LightBox, ATTOM, county sources, or Primary's sourceModifiedAt work.

## Fixture Certification

Run directly:

```sh
npx tsx scripts/checkOpenHouseAgentPreparation.ts
```

The fixture-only check certifies a valid packet, sparse facts, fail-closed missing identity, optional event labels, supplied/missing context, supplied/missing timestamp posture, unavailable evidence, talking-point inputs, question preparation, checklist, fair-housing reminders, human boundary, prohibited outcomes, no visitor/customer data, no database/provider/network access, no protected imports, and deterministic output with a fixed generated timestamp.

## Future Integration Options

This MVV creates no route. A later authorization may consider a protected internal preview that obtains only an explicitly selected property through an already-approved bounded read. That separate review must re-evaluate authentication, read-side availability, source/freshness posture, and collision safety after Primary's concurrent work settles. It does not authorize OpenHouse persistence, scheduling, visitor registration, CRM, customer contact, or public exposure.

## Local Certification Boundary

This certification does not authorize push, merge, deployment, provider activation, production reads or writes, or changes to any existing runtime, route, property, MLS, Search, alert, CRM, OpenHouse persistence, package/configuration, or `docs/CHAT_START.md` file.
