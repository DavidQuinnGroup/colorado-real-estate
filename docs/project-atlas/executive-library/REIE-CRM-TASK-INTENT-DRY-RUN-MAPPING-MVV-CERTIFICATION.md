# REIE CRM Task Intent Dry-Run Mapping MVV Certification

Program: `REIE_CRM_TASK_INTENT_DRY_RUN_MAPPING_MVV`

Status: `IMPLEMENTED_AND_LOCALLY_CERTIFIED`

## Purpose

This MVV adds a pure deterministic source-evidence mapper over canonical `TaskIntentV1`. It produces only a proposed governed intent, a finite human-input-required result, or a fail-closed result. It does not read or persist a CRM task, query a database, assign an owner, calculate a due date, invoke a route, start a worker, or authorize customer communication.

## Architecture

```text
supplied source-specific non-PII evidence
  → source-specific pure mapping function
  → canonical TaskIntentV1 input
  → canonical normalization and validation
  → dry-run result
```

`lib/crm/taskIntentDryRunMapping.ts` imports and relies on `lib/crm/taskIntentGovernance.ts`; it does not reproduce the canonical registries, normalization, PII policy, fingerprints, dedupe logic, communication firewall, or lifecycle governance.

## Supported source mappings

- `PROPERTY_INQUIRY` → `PROPERTY_INQUIRY_REVIEW` / `PROPERTY_INQUIRY_SUBMISSION`;
- `SAVED_SEARCH_STRATEGY_INTAKE` → `SAVED_SEARCH_STRATEGY_REVIEW` / `SAVED_SEARCH_SUBMISSION`;
- `SELLER_VALUATION_INTAKE` → `SELLER_VALUATION_INTAKE_REVIEW` / `SELLER_VALUATION_SUBMISSION`;
- `PRE_DISCOVERY_BRIEF` → `PRE_DISCOVERY_BRIEF_REVIEW` / `PRE_DISCOVERY_SIGNAL`; and
- `INTERACTION_PROMOTION` → `INTERACTION_PROMOTION_REVIEW` / `INTERACTION_PROMOTION`.

Only property inquiry may carry an opaque internal property reference. Every source requires a supplied opaque internal subject reference, a durable source-event reference, and caller-supplied `generatedAt`.

Property inquiry, saved-search intake, and seller valuation map only documented finite timeline/source codes to the canonical priority/reason pair. PRE_DISCOVERY_BRIEF and interaction promotion require explicit human priority rather than carrying forward heat-score, engagement, or inferred-intent heuristics. Saved-search evidence based only on free-form notes requires human input.

All proposed intents carry `HUMAN_OWNER_REQUIRED` and `HUMAN_DUE_DATE_ASSIGNMENT_REQUIRED`; no owner or due date is generated.

## Result semantics

- `READY_TO_PROPOSE_TASK` includes a canonical valid normalized TaskIntent plus `persistence: NOT_ATTEMPTED` and `communication: NOT_AUTHORIZED`.
- `HUMAN_INPUT_REQUIRED` is used for finite, non-inferable requirements such as missing durable PRE_DISCOVERY provenance, missing explicit human priority, or free-form-only saved-search basis.
- `FAIL_CLOSED` is used for malformed/unknown evidence, unsupported evidence fields, and canonical TaskIntent validation failures.

All evidence shapes are allowlisted. Unsupported fields, including PII-like data, fail closed and are never passed to TaskIntentV1. The deterministic dedupe output remains planning evidence only; it does not inspect existing tasks or enforce database uniqueness.

## Communication and side-effect boundary

The mapper has no Prisma, CRM persistence, route, network, email, SMS, notification, queue, worker, provider, or callback dependency. Its only runtime dependency is canonical TaskIntent governance. Consequently, property-inquiry notification adjacency cannot be invoked by dry-run evaluation.

## Local certification

Run:

```sh
npx tsx scripts/checkCRMTaskIntentDryRunMapping.ts
```

The deterministic fixture suite covers all five sources; priority/reason mapping; property applicability; missing subject; human-input conditions; owner/due-date postures; extra/PII-like evidence rejection; source-event and dedupe determinism; unknown sources; and static side-effect isolation.

## Non-authorization

This MVV does not authorize CRMTask reads or writes, customer or lead changes, communications, scheduling, queues, workers, provider calls, migrations, deployments, or any existing creation-path integration. Any later persistence adapter requires separate guarded-write authorization and review.
