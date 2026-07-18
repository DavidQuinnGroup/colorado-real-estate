# RC1-CLICK-001 - Controlled Production Tracked-Link Proof

Date opened: 2026-07-18  
Current status: `CLOSED`
Severity: `High`

## Baseline

- Local baseline at start: `a4c2999` (`Record EMAIL-001 controlled send evidence`), preserving the unpushed EMAIL-001 documentation commit.
- Origin baseline at start: `bd4f76c9034ea1b0d807f7f78e077579154ecbfe`.
- Runtime correction commits pushed during CLICK-001:
  - `3d5d7aa72ab4c2f275b6c89e9b4109af52393072` (`Fix production click tracking fallback`).
  - `8dc4f87a170f7f373613b3ab423bdcb342b7ae40` (`Handle zero-row click marks`).
- Final deployed correction: `8dc4f87`.
- Final deployment id: `5503704415`.
- Deployment status: `success`.
- Deployment status description: `Deployment has completed`.

## Controlled Record

- Selected AlertQueue row: `cmq0zp6up010gpd4uh5anfex5`.
- Selected user id: `cmmuzx3kt00004hk64jytoihs`.
- Approved internal recipient: `da***@gmail.com`.
- Property id/listing id: `cmpy48m3d047b129oeqh0r22m`.
- Property URL: `https://davidquinngroup.com/properties/6137-baseline-rd-boulder-co-ire1349635`.
- Tracking URL host: `davidquinngroup.com`.
- Tracking source: `email_alert`.
- Destination host: `davidquinngroup.com`.

## Preflight

| Surface | Before |
| --- | ---: |
| Selected alert status | `sent` |
| Selected alert clickedAt | `null` |
| EmailLog total | 78 |
| AlertQueue pending | 195 |
| AlertQueue sent | 85 |
| AlertQueue skipped | 3 |
| BullMQ `reie-alerts` waiting | 273 |
| BullMQ `reie-alerts` active | 0 |
| BullMQ `reie-alerts` delayed | 0 |
| BullMQ `reie-alerts` failed | 0 |
| Selected user heat score | 5 |
| Selected user interactions | 1 |
| Selected user `LISTING_CLICK` interactions | 1 |
| Selected property `LISTING_CLICK` interactions | 0 |
| Selected user CRM tasks | 0 |
| Selected user unsubscribe tokens | 57 |
| Selected user active saved searches | 1 |

Existing preference row before click:

- `avgPrice: 4625000`.
- `avgBeds: 4`.
- `topCities: ["Boulder"]`.

## Request

Executed exactly one production tracking request:

```text
GET /api/track-click?u=<selected-user>&l=cmpy48m3d047b129oeqh0r22m&src=email_alert&to=<selected-property-url>
```

No second tracking request was made.

## HTTP Evidence

| Step | Result |
| --- | --- |
| Tracking route | HTTP 307 |
| Redirect location | `https://davidquinngroup.com/properties/6137-baseline-rd-boulder-co-ire1349635` |
| Final property URL | HTTP 200 |
| Redirect count | 1 |

## After State

| Surface | After | Delta |
| --- | ---: | ---: |
| Selected alert clickedAt | `null` | 0 |
| Selected user heat score | 10 | +5 |
| Selected user interactions | 2 | +1 |
| Selected user `LISTING_CLICK` interactions | 2 | +1 |
| Selected property `LISTING_CLICK` interactions | 1 | +1 |
| EmailLog total | 78 | 0 |
| AlertQueue pending | 195 | 0 |
| AlertQueue sent | 85 | 0 |
| AlertQueue skipped | 3 | 0 |
| BullMQ `reie-alerts` waiting | 273 | 0 |
| BullMQ `reie-alerts` active | 0 | 0 |
| BullMQ `reie-alerts` delayed | 0 | 0 |
| BullMQ `reie-alerts` failed | 0 | 0 |
| Selected user CRM tasks | 0 | 0 |
| Selected user unsubscribe tokens | 57 | 0 |
| Selected user active saved searches | 1 | 0 |

Recorded property interaction:

- Type: `LISTING_CLICK`.
- Listing id: `cmpy48m3d047b129oeqh0r22m`.
- Source: `email_alert`.
- Destination: selected property URL.
- Tracked at: `2026-07-18T17:08:54.796Z`.

Preference row after click:

- `avgPrice: 4625000`.
- `avgBeds: 4`.
- `topCities: ["Boulder"]`.
- No P2022 or schema error was observed in post-click verification.

## Root Cause and Correction

The first deployed correction made the tracking route Prisma-primary with Supabase REST fallback for production environments where Prisma mutation paths are unavailable. The controlled click then showed a subtler bug: the Prisma transaction succeeded for interaction insert and heat-score increment, but the JSON-path `AlertQueue.updateMany` marked zero rows, leaving `clickedAt` null.

`8dc4f87` adds a zero-row guard. When the primary tracking transaction marks fewer than one alert row, the route now applies the Supabase REST matcher to mark `clickedAt` for the matching unclicked alert row without creating another interaction or incrementing heat score again.

## Validation

Passed:

- `npm run check:track-click-safety`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `git diff --check`

## Side-Effect Boundary

No second tracking request, email send, unsubscribe invocation, queue retry/drain, worker, scheduler, CRM task mutation, MLS Grid request, OpenAI call, TitlePro247 call, Typesense reset/reindex, database reset, `prisma db push`, `npm audit fix`, or force-push was run.

## Controlled Retry

The refreshed assignment explicitly authorized one controlled retry after deployment `5503704415`.

### Retry Preflight

| Surface | Before retry |
| --- | ---: |
| Selected alert status | `sent` |
| Selected alert clickedAt | `null` |
| EmailLog total | 78 |
| AlertQueue pending | 195 |
| AlertQueue sent | 85 |
| AlertQueue skipped | 3 |
| BullMQ `reie-alerts` waiting | 273 |
| BullMQ `reie-alerts` active | 0 |
| BullMQ `reie-alerts` delayed | 0 |
| BullMQ `reie-alerts` failed | 0 |
| Selected user heat score | 10 |
| Selected user interactions | 2 |
| Selected user `LISTING_CLICK` interactions | 2 |
| Selected property `LISTING_CLICK` interactions | 1 |
| Selected user CRM tasks | 0 |
| Selected user unsubscribe tokens | 57 |
| Selected user active saved searches | 1 |

Production health before retry:

- Selected property URL: HTTP 200.
- `/search`: HTTP 200.

Deployed source guards before retry:

- `lib/tracking/store.ts` contains production click-tracking Supabase fallback.
- `lib/tracking/store.ts` contains zero-row click-mark handling.
- `lib/preferences/updateUserPreferences.ts` contains Supabase preference fallback.

### Retry Request

Executed exactly one retry:

```text
GET /api/track-click?u=<selected-user>&l=cmpy48m3d047b129oeqh0r22m&src=email_alert&to=<selected-property-url>
```

No second retry was made.

### Retry HTTP Evidence

| Step | Result |
| --- | --- |
| Tracking route | HTTP 307 |
| Redirect location | `https://davidquinngroup.com/properties/6137-baseline-rd-boulder-co-ire1349635` |
| Final property URL | HTTP 200 |
| Redirect count | 1 |

### Retry After State

| Surface | After retry | Delta |
| --- | ---: | ---: |
| Selected alert clickedAt | `null` | 0 |
| Selected user heat score | 15 | +5 |
| Selected user interactions | 3 | +1 |
| Selected user `LISTING_CLICK` interactions | 3 | +1 |
| Selected property `LISTING_CLICK` interactions | 2 | +1 |
| EmailLog total | 78 | 0 |
| AlertQueue pending | 195 | 0 |
| AlertQueue sent | 85 | 0 |
| AlertQueue skipped | 3 | 0 |
| BullMQ `reie-alerts` waiting | 273 | 0 |
| BullMQ `reie-alerts` active | 0 | 0 |
| BullMQ `reie-alerts` delayed | 0 | 0 |
| BullMQ `reie-alerts` failed | 0 | 0 |
| Selected user CRM tasks | 0 | 0 |
| Selected user unsubscribe tokens | 57 | 0 |
| Selected user active saved searches | 1 | 0 |

Recorded retry interaction:

- Type: `LISTING_CLICK`.
- Listing id: `cmpy48m3d047b129oeqh0r22m`.
- Source: `email_alert`.
- Destination: selected property URL.
- Tracked at: `2026-07-18T17:23:25.738Z`.

Preference row after retry:

- `avgPrice: 4625000`.
- `avgBeds: 4`.
- `topCities: ["Boulder"]`.
- No P2022 or schema error was observed in post-retry verification.

Post-retry read-only Supabase diagnostics still found the selected alert as the only matching unclicked row for the fallback matcher:

- Candidate unclicked sent/pending/processing rows for the selected user: 118.
- Matching selected-property rows: 1.
- Matching row id: `cmq0zp6up010gpd4uh5anfex5`.
- Selected `clickedAt`: `null`.

## Previous Runtime Blocker

At that point, `CLICK-001` was not closed. It was `BLOCKED_RUNTIME`: the explicitly authorized retry verified redirect and enrichment again, but selected `AlertQueue.clickedAt` remained null. No additional tracking request was authorized without a new assignment.

## Final Controlled Production Proof

The refreshed assignment explicitly authorized exactly one final production `GET` request after deployed correction `4c9d85c` / deployment `5503914616`.

### Final Proof Preflight

| Surface | Before final proof |
| --- | ---: |
| Local HEAD | `4c9d85c` |
| Origin `main` | `4c9d85c` |
| Working tree | clean |
| Selected alert status | `sent` |
| Selected alert clickedAt | `null` |
| EmailLog total | 78 |
| AlertQueue pending | 195 |
| AlertQueue sent | 85 |
| AlertQueue skipped | 3 |
| AlertQueue processing | 0 |
| AlertQueue failed | 0 |
| BullMQ `reie-alerts` waiting | 273 |
| BullMQ `reie-alerts` active | 0 |
| BullMQ `reie-alerts` delayed | 0 |
| BullMQ `reie-alerts` failed | 0 |
| Selected user heat score | 15 |
| Selected user interactions | 3 |
| Selected user `LISTING_CLICK` interactions | 3 |
| Selected property `LISTING_CLICK` interactions | 2 |
| Selected user CRM tasks | 0 |
| Selected user unsubscribe tokens | 57 |
| Selected user active saved searches | 1 |

Preflight preference row:

- `avgPrice: 4625000`.
- `avgBeds: 4`.
- `topCities: ["Boulder"]`.
- `updatedAt: 2026-07-17T19:52:17.997`.

Production health before final proof:

- Selected property URL: HTTP 200.
- `/search`: HTTP 200.

### Final Proof Request

Executed exactly one final production tracking request:

```text
GET /api/track-click?u=<selected-user>&l=cmpy48m3d047b129oeqh0r22m&src=email_alert&to=<selected-property-url>
```

No second tracking request was made.

### Final HTTP Evidence

| Step | Result |
| --- | --- |
| Tracking route | HTTP 307 |
| Redirect location | `https://davidquinngroup.com/properties/6137-baseline-rd-boulder-co-ire1349635` |
| Final property URL | HTTP 200 |
| Redirect count | 1 |
| Vercel route evidence | `x-matched-path: /api/track-click` then `x-matched-path: /properties/[id]` |

### Final After State

| Surface | After final proof | Delta |
| --- | ---: | ---: |
| Selected alert clickedAt | `2026-07-18T17:59:15.571` | populated |
| Selected user heat score | 20 | +5 |
| Selected user interactions | 4 | +1 |
| Selected user `LISTING_CLICK` interactions | 4 | +1 |
| Selected property `LISTING_CLICK` interactions | 3 | +1 |
| EmailLog total | 78 | 0 |
| AlertQueue pending | 195 | 0 |
| AlertQueue sent | 85 | 0 |
| AlertQueue skipped | 3 | 0 |
| AlertQueue processing | 0 | 0 |
| AlertQueue failed | 0 | 0 |
| BullMQ `reie-alerts` waiting | 273 | 0 |
| BullMQ `reie-alerts` active | 0 | 0 |
| BullMQ `reie-alerts` delayed | 0 | 0 |
| BullMQ `reie-alerts` failed | 0 | 0 |
| Selected user CRM tasks | 0 | 0 |
| Selected user unsubscribe tokens | 57 | 0 |
| Selected user active saved searches | 1 | 0 |

Recorded final interaction:

- Type: `LISTING_CLICK`.
- Listing id: `cmpy48m3d047b129oeqh0r22m`.
- Source: `email_alert`.
- Destination: selected property URL.
- Tracked at: `2026-07-18T17:59:15.571Z`.

Preference row after final proof:

- `avgPrice: 4625000`.
- `avgBeds: 4`.
- `topCities: ["Boulder"]`.
- `updatedAt: 2026-07-17T19:52:17.997`.
- No P2022 or schema error was observed in post-click verification.

### Final Validation

Passed after final proof:

- `npm run check:track-click-runtime-safety`
- `npm run check:unsubscribe-safety`
- `npm run check:search-runtime-safety`
- `npm run check:property-route-safety`
- `npm run typecheck`
- `npm run lint`
- `npm run build`

`npm run check:track-click-safety` passed before the final proof and was not rerun afterward because it intentionally asserts the selected controlled row is still pre-click with `clickedAt: null`.

### Final Closure Decision

`CLICK-RUNTIME-001`: `CLOSED`.

`CLICK-001`: `CLOSED`.

The final proof satisfied the closure criteria: exactly one authorized tracking request occurred, the redirect chain was `307 -> 200`, selected `AlertQueue.clickedAt` changed from null to a timestamp, enrichment changed exactly once, and unrelated production surfaces stayed isolated.
