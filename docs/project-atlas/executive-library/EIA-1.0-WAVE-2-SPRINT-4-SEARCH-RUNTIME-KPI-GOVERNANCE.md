# EIA 1.0 Wave 2 Sprint 4 Search Runtime KPI Governance

## Status

```text
KPI_GOVERNED
ADAPTER_IMPLEMENTATION_PENDING
```

This record authorizes and documents the canonical Search Runtime KPI required to unblock the Search Runtime Adapter. It does not implement the adapter, authorize Sprint 5, or close `GAP-006`.

## KPI Identity

| Field | Value |
| --- | --- |
| KPI ID | `KPI-SRCH-001` |
| Name | Search Runtime Health Rate |
| Domain | `PLATFORM` |
| Capability | Search Runtime |
| Owner | REIE Platform |
| Steward | Search Platform Engineering |
| Unit | `PERCENT` |
| Observation grain | One deterministic bounded runtime probe per governed observation window |

## Formula

```text
valid usable runtime executions / total eligible runtime executions × 100
```

Eligible usable classifications:

```text
SUCCESS
DEGRADED
FALLBACK
EMPTY_VALID
```

Unsuccessful classifications:

```text
FAILED
INVALID
TIMEOUT
```

Excluded classifications:

```text
UNKNOWN
UNAVAILABLE
```

## Thresholds

| Value | Governed status |
| --- | --- |
| `100%` | `HEALTHY` |
| Greater than `0%` and less than `100%` | `DEGRADED` in Sprint 4 semantics, represented as `WARNING` by the current KPI evaluator |
| `0%` | `UNHEALTHY` in Sprint 4 semantics, represented as `CRITICAL` by the current KPI evaluator |
| No eligible governed observations | `UNKNOWN` |

No separate degraded-rate or fallback-rate KPI is created by this assignment.

## Freshness

| Age | State |
| --- | --- |
| `0-15 minutes` | `FRESH` |
| More than `15 minutes` | `STALE` |
| More than `1 hour` | Expired operationally; represented as stale by the current two-state freshness evaluator |

The canonical registry uses `freshnessExpectationHours = 0.25`.

## Confidence

Confidence represents confidence in the observation, not runtime health.

| Evidence quality | Confidence |
| --- | --- |
| Complete valid evidence | `HIGH` |
| Incomplete but usable evidence | `MEDIUM` |
| Material ambiguity | `LOW` |
| No valid evidence | `UNKNOWN` |

## Evidence Requirements

`KPI-SRCH-001` observations must preserve associated evidence for:

- Runtime classification.
- Provider classification.
- Fallback used.
- Degraded state.
- Ready state.
- Blocker count.
- Result count.
- Response-validation state.
- Probe registry version.
- Source-state fingerprint.

A value of `100%` must not suppress degraded or fallback evidence.

## Semantic Boundary

`KPI-PLAT-002` remains owned by the Platform Availability Adapter and measures bounded Search API reachability and valid response availability.

`KPI-SRCH-001` measures search execution outcome quality and runtime-path validity.

This record does not redefine `KPI-PLAT-002` and does not create shared ownership.

## Known Limitations

The Search Runtime Adapter is not implemented by this assignment.

`KPI-SRCH-001` is registered as `DEFINED_BUT_UNAVAILABLE` until the Sprint 4 adapter supplies governed live observations.

The current KPI evaluator has `HEALTHY`, `WARNING`, `CRITICAL`, and `UNKNOWN` statuses. Sprint 4 runtime language maps degraded runtime health to evaluator `WARNING` and unhealthy runtime health to evaluator `CRITICAL`.

`GAP-006` remains:

```text
OPEN_MATERIAL_REDUCED
```

## Closure Determination

EIA 1.0 Wave 2 Sprint 4, Search Runtime Adapter, remains:

```text
AUTHORIZED_FOR_IMPLEMENTATION
```

Sprint 5 is not authorized.
