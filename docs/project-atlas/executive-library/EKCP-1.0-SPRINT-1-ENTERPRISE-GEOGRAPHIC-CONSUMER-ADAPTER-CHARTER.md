# PROJECT ATLAS(tm)

## Enterprise Knowledge Consumption Program(tm) - Sprint 1 Charter

### Enterprise Geographic Consumer Adapter(tm)

Status: `EKCP_1.0_SPRINT_1_ENTERPRISE_GEOGRAPHIC_CONSUMER_ADAPTER_AUTHORIZED_FOR_IMPLEMENTATION`

Authorization date: July 25, 2026

Repository baseline: `62eef1cddb1966a092110ab04a6ce105253042dd`

Prerequisite read layer: `EIP_1.0_SPRINT_7_PRODUCTION_INTERNAL_GEOGRAPHIC_READ_ADAPTER`

---

## 1. Objective

Create the first reusable Enterprise Geographic Consumer Adapter between the Production Read Adapter and all future enterprise consumers.

The Sprint 1 adapter must translate the certified production-internal geographic read contract into business-domain concepts for future Search, Maps, Property Intelligence, AI, Executive Intelligence, and future enterprise services without integrating with any of them.

Sprint 1 must use a neutral shared geographic-read contract so future enterprise consumers do not import the Sprint 7 implementation module.

---

## 2. Authorized Scope

Permitted:

- new reusable Enterprise Geographic Consumer Adapter layer;
- consumption of the Production Read Adapter contract only;
- business-domain geographic place profile output;
- governance boundary output;
- activation boundary output;
- validation scripts;
- implementation report and roadmap documentation.
- neutral shared geographic-read contract module.

Not permitted:

- direct Prisma access;
- persistence writes;
- Prisma schema or migration changes;
- repository implementation detail exposure to consumers;
- public route creation;
- Search integration;
- Map integration;
- Property Intelligence integration;
- AI integration;
- customer-visible changes;
- hierarchy operations;
- relationship operations;
- activation, readiness, approval, or eligibility mutation;
- production data mutation.

---

## 3. Required Governance Boundaries

The adapter must preserve:

- Quality != Readiness
- Readiness != Approval
- Approval != Activation
- Persistence != Consumption
- Consumption != Customer Visibility

These are hard boundaries. Sprint 1 may make internal consumption technically reusable, but it does not authorize any customer-facing or runtime consumer behavior.

---

## 4. Required Public Contract

The adapter contract must be shaped around business-domain concepts:

- enterprise consumer identity;
- consumer intent;
- place lookup;
- certified subject;
- place profile;
- known names;
- source summary;
- evidence statements;
- governance boundaries;
- activation boundaries;
- source adapter health.

The contract must not require downstream consumers to understand Prisma tables, migrations, persistence helpers, Sprint 7 implementation modules, or repository internals.

Hierarchy and relationship operations are deferred beyond Sprint 1. Sprint 1 may expose only the certified subject profile and the zero-relationship boundary inherited from the read contract.

---

## 5. Required Safety Checks

Validation must prove:

- no persistence writes;
- no direct Prisma dependency;
- no runtime activation;
- no customer-visible changes;
- no Search integration;
- no Map integration;
- no AI integration;
- no Prisma schema or migration changes;
- EKCP does not import the Sprint 7 implementation module;
- EKCP imports the neutral shared geographic-read contract for read behavior;
- all supported future consumer categories can receive the same certified Thornton-only domain result;
- unauthorized place lookup fails closed.

---

## 6. Acceptance Criteria

Sprint 1 succeeds when:

- the adapter consumes only the Production Read Adapter contract;
- the adapter exposes a stable business-domain API;
- all future enterprise consumer categories are represented but not integrated;
- hierarchy and relationship operations remain deferred;
- governance and activation boundaries are explicit and false where required;
- validation passes locally;
- implementation documentation records architecture, contract, dependency graph, validation evidence, and enterprise impact;
- existing production behavior remains unchanged.

<!-- /Users/davidquinn/david-quinn-group/colorado-real-estate/docs/project-atlas/executive-library/EKCP-1.0-SPRINT-1-ENTERPRISE-GEOGRAPHIC-CONSUMER-ADAPTER-CHARTER.md -->
