# REIE Module 10 Control-State Visibility Adapter MVV Certification

Status: `REIE_MODULE_10_CONTROL_ADAPTER_MVV_CERTIFIED_LOCAL`

This bounded contract derives a capability-visibility result from the existing
control-state vocabulary without importing the route, Prisma, persistence, or
the admin panel. It delegates authorization, source posture, activation, role,
disclosure, and professional-verification decisions to the canonical capability
visibility evaluator.

## Semantic reconciliation

| Existing control | Adapter classification | Boundary |
| --- | --- | --- |
| `killSwitchActive` | Canonical safety control | Dominates all visibility decisions. |
| `mode` | Canonical operational control | `paused` fails closed; `ops` and `monitor` do not grant authority. |
| `strategyGate` | Legacy control hint only | Numeric thresholds cannot authorize a capability or source. |
| `areaCloud` | Legacy map-precision hint only | Cannot establish source rights, evidence, freshness, or display authority. |
| `privateLayer` | Legacy layer hint only | Cannot authenticate a customer or authorize private data. |
| `publicExposure` | Derived legacy policy hint only | Cannot override the canonical evaluator. |
| `mapPrecision` | Derived legacy policy hint only | Cannot override source or capability posture. |

The adapter does not mutate `REIEControlState`, persist state, infer manifest
membership, or treat a control as proof of authorization. Unknown control input
fails closed. The result is a pure handoff candidate for a later governed
consumer and is not runtime activation authority.

## Protected boundaries

No route, UI, database, schema, provider, API, search, Typesense, customer-data,
CRM, email, queue, deployment, or GIS behavior is changed or activated by this
MVV.
