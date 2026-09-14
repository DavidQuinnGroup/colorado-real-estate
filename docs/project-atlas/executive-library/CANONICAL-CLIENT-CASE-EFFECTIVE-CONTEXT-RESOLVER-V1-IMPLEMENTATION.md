# Canonical Client Case Effective Context Resolver V1

## Purpose

This foundation resolves the certified canonical Client Case context and, when explicitly selected, one durable Scenario Version into a transient server-side Effective Context. It answers which recorded canonical and hypothetical context a future capability receives; it does not decide whether that capability is ready or execute analysis.

## Resolution Modes

- `CANONICAL_BASELINE` returns the Case's current canonical Objectives, current Facts, current Criteria, and Case Property relationships. It has no Scenario root, Version, assumptions, Scenario Criteria, dispositions, or objective links.
- `SCENARIO_VERSION` requires an explicit Scenario Version ID. The selected Version may be historical; the result exposes both the selected Version and the Scenario root's current Version without upgrading the request.

## Semantic and Lineage Rules

- Canonical Facts and Criteria are current only when their certified supersession model marks them unsuperseded. They retain record identity, scope, provenance posture, and temporal fields.
- Scenario assumptions remain hypothetical and do not override canonical Facts.
- The small code-owned registry allows Scenario Criteria to override only compatible canonical `TARGET_CITIES` and `MIN_BEDROOMS` inputs. Both durable source records remain in the returned source collections and the resolved input records contributing IDs.
- Registered Scenario-only assumptions and `MAX_PURCHASE_PRICE_CENTS` remain distinct effective inputs. Unknown semantics remain in source collections, never enter `resolvedInputs`, and produce deterministic limitations rather than invented precedence.
- Canonical property role and Scenario property disposition coexist; the resolver never converts a role into a disposition. Canonical Objectives remain present even when Scenario objective links identify a narrower addressed scope.

## Security and Read Behavior

The service is server-only and receives an authenticated Agent subject from its caller. It owner-scopes the Case and selected Scenario Version, fails closed without exposing cross-owner or cross-Case existence, uses deterministic query ordering, and has no write delegate or transaction path. It does not cache or persist Effective Context.

## Provenance, Time, and Limitations

Resolved inputs preserve origin class, source record ID, Scenario Version ID where applicable, source posture, Evidence or Professional Input reference IDs where already attached to a canonical record, and observed/effective/review timestamps. An explicit historical Scenario Version also carries `HISTORICAL_SCENARIO_WITH_CURRENT_CANONICAL_CONTEXT`; the resolver does not reconstruct historical canonical state. The resolver does not resolve Evidence or Professional Input content. It identifies hypothetical Scenario assumptions, unsupported semantics, and capability-rule conflicts; those postures are not capability readiness or recommendation decisions.

## Validation

`npm run check:client-case-effective-context-resolver` uses synthetic in-memory records to prove baseline/scenario separation, explicit historical Version resolution, criterion override lineage, falsey-value preservation, property role/disposition coexistence, owner and Case isolation, malformed persisted-value rejection, determinism, and read-only behavior.

No Prisma schema or migration is introduced. No route, UI, consumer integration, calculation, Production resolver execution, Client Case mutation, Scenario mutation, Output/Transaction mutation, provider call, alert, email, CRM, MLS, or search action is added.

## Deferred Work

Capability-specific readiness, required-input contracts, missing-information presentation, analytical snapshots, Scenario UI and selection, analytical consumer integration, Output lineage, Transaction adoption, and cross-workspace runtime consumption remain deferred.
