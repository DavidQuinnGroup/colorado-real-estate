# RC1-UNSUBSCRIBE-002 - Controlled Valid Unsubscribe Proof

Date opened: 2026-07-18
Current status: `CLOSED`
Severity: `High`

## Baseline

- Local HEAD before proof: `684040f` (`Record CLICK-001 final proof`).
- Origin `main` before proof: `684040f`.
- Branch state before proof: `main...origin/main`.
- Working tree before proof: clean.
- Git-triggered deployment for `684040f`: `success`, `Deployment has completed`.

## Controlled Fixture

- Fixture classification: approved internal global-unsubscribe fixture.
- Fixture disposition: `RESTORABLE`.
- Recipient classification: approved internal test recipient.
- Recipient: `da***@gmail.com`.
- User id: `cmmuzx3kt00004hk64jytoihs`.
- Token record id: `cmrqlydky0001la97bq8yqapp`.
- Raw token: redacted.
- Token fingerprint: length `36`, prefix `02d0`, suffix `974c`.
- Saved-search id: none; this was a global user-level unsubscribe token.

## Intended Mutation Scope

The route design for this fixture changes exactly:

- `UnsubscribeToken.usedAt` for token record `cmrqlydky0001la97bq8yqapp`.
- `User.isUnsubscribed` and `User.unsubscribedAt` for user `cmmuzx3kt00004hk64jytoihs`.

No saved-search row should change for this global token.

## Preflight

Production health before Request 1:

- Selected property URL: HTTP 200.
- `/search`: HTTP 200.
- Missing unsubscribe token: HTTP 400.
- Synthetic unknown unsubscribe token: HTTP 404.

Fresh before-state:

| Surface | Before |
| --- | ---: |
| Selected token usedAt | `null` |
| Selected user isUnsubscribed | `false` |
| Selected user unsubscribedAt | `null` |
| Active saved searches for selected user | 1 |
| Total active saved searches | 2 |
| Total users | 3 |
| EmailLog total | 78 |
| UnsubscribeToken total | 128 |
| CRMTask total | 1 |
| CRMTask rows for selected user | 0 |
| UserInteraction total | 5 |
| AlertQueue pending | 195 |
| AlertQueue sent | 85 |
| AlertQueue skipped | 3 |
| AlertQueue processing | 0 |
| AlertQueue failed | 0 |
| BullMQ `reie-alerts` waiting | 273 |
| BullMQ `reie-alerts` active | 0 |
| BullMQ `reie-alerts` delayed | 0 |
| BullMQ `reie-alerts` failed | 0 |

Preference row remained readable before proof:

- `avgPrice: 4625000`.
- `avgBeds: 4`.
- `topCities: ["Boulder"]`.

Stop conditions before Request 1 were clear: the selected token was unused, the selected user was subscribed, the token belonged to the approved internal user, the global mutation scope was bounded, required counts were measurable, and production health was clean.

## Request 1 - Valid Unsubscribe

Executed exactly one production `GET` to the verified controlled valid-unsubscribe URL with the raw token redacted.

| Surface | Result |
| --- | --- |
| HTTP status | 200 |
| Redirect count | 0 |
| Final route | `/api/unsubscribe?token=<redacted>` |
| Response title | `You Are Unsubscribed` |
| Response classification | completed global unsubscribe |
| Raw internal error exposed | no |

After Request 1:

| Surface | After Request 1 | Delta |
| --- | ---: | ---: |
| Selected token usedAt | `2026-07-18T18:15:52.946` | populated |
| Selected user isUnsubscribed | `true` | changed |
| Selected user unsubscribedAt | `2026-07-18T18:15:52.946` | populated |
| Active saved searches for selected user | 1 | 0 |
| Total active saved searches | 2 | 0 |
| Total users | 3 | 0 |
| EmailLog total | 78 | 0 |
| UnsubscribeToken total | 128 | 0 |
| CRMTask total | 1 | 0 |
| CRMTask rows for selected user | 0 | 0 |
| UserInteraction total | 5 | 0 |
| AlertQueue pending | 195 | 0 |
| AlertQueue sent | 85 | 0 |
| AlertQueue skipped | 3 | 0 |
| AlertQueue processing | 0 | 0 |
| AlertQueue failed | 0 | 0 |
| BullMQ `reie-alerts` waiting | 273 | 0 |
| BullMQ `reie-alerts` active | 0 | 0 |
| BullMQ `reie-alerts` delayed | 0 | 0 |
| BullMQ `reie-alerts` failed | 0 | 0 |

Request 2 was permitted because Request 1 returned an intentional non-500 response, changed the intended controlled scope, exposed no sensitive internals, and preserved unrelated counts.

## Request 2 - Idempotency

Executed exactly one second production `GET` to the same controlled valid-unsubscribe URL.

| Surface | Result |
| --- | --- |
| HTTP status | 200 |
| Redirect count | 0 |
| Final route | `/api/unsubscribe?token=<redacted>` |
| Response title | `Already Unsubscribed` |
| Response classification | idempotent already-used response |
| Raw internal error exposed | no |

After Request 2:

- Selected token usedAt stayed `2026-07-18T18:15:52.946`.
- Selected user remained unsubscribed with `unsubscribedAt: 2026-07-18T18:15:52.946`.
- No duplicate unsubscribe mutation was observed.
- EmailLog total remained 78.
- UnsubscribeToken total remained 128.
- CRMTask total remained 1.
- CRMTask rows for selected user remained 0.
- UserInteraction total remained 5.
- AlertQueue aggregate counts remained `195 pending / 85 sent / 3 skipped / 0 processing / 0 failed`.
- BullMQ remained `273 waiting / 0 active / 0 delayed / 0 failed`.

No third unsubscribe request was made, and no other valid unsubscribe URL was invoked.

## Restoration

Because the fixture was `RESTORABLE`, all proof evidence was captured before restoration.

Performed exactly one bounded restoration action:

- Updated only user `cmmuzx3kt00004hk64jytoihs`.
- Set `isUnsubscribed: false`.
- Set `unsubscribedAt: null`.
- Did not reuse or modify the spent token.
- Did not create a new token.

Restored state:

| Surface | Restored state |
| --- | ---: |
| Selected token usedAt | `2026-07-18T18:15:52.946` |
| Selected user isUnsubscribed | `false` |
| Selected user unsubscribedAt | `null` |
| Active saved searches for selected user | 1 |
| Total active saved searches | 2 |
| Total users | 3 |
| EmailLog total | 78 |
| UnsubscribeToken total | 128 |
| CRMTask total | 1 |
| CRMTask rows for selected user | 0 |
| UserInteraction total | 5 |
| AlertQueue aggregate | `195 pending / 85 sent / 3 skipped / 0 processing / 0 failed` |
| BullMQ `reie-alerts` | `273 waiting / 0 active / 0 delayed / 0 failed` |

## Validation

Passed:

- `npm run check:unsubscribe-safety`
- `npm run check:track-click-runtime-safety`
- `npm run check:track-click-safety`
- `npm run check:search-runtime-safety`
- `npm run check:property-route-safety`
- `npm run typecheck`
- `npm run lint`
- `npm run build`

`scripts/checkTrackClickSafety.ts` was updated to accept the now-closed CLICK-001 state where the selected controlled alert may have a valid `clickedAt` timestamp instead of only the historical pre-click null state. This is test-harness maintenance only and does not alter production runtime behavior.

## Side-Effect Boundary

No third unsubscribe request, second valid token, production tracking URL, email send, queue retry/drain, worker, scheduler, broad CRM/user/preference/saved-search mutation, MLS Grid request, OpenAI call, TitlePro247 call, Typesense reset/reindex, database reset, `prisma db push`, `npm audit fix`, force-push, or destructive Git operation was run during UNSUBSCRIBE-002.

## Closure Decision

`UNSUBSCRIBE-002`: `CLOSED`.

`READY-001`: `NEXT`.

`CERT-001`: `BLOCKED`.

`RC1`: `RC1_NOT_CERTIFIED`.

READY-001 was not started automatically.
