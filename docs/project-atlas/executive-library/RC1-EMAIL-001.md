# RC1-EMAIL-001 - Controlled Production Alert Delivery Proof

Date opened: 2026-07-18  
Date closed: 2026-07-18  
Current status: `CLOSED`  
Severity: `High`

## Baseline

- Production property-route fix commit: `def65373dc98e85b37e5afc6fed151db105fbfee`.
- Governed source commit used for EMAIL-001 verification: `bd4f76c9034ea1b0d807f7f78e077579154ecbfe`.
- Branch: `main`.
- GitHub deployment id for governed source: `5503532389`.
- Deployment status: `success`.
- Deployment status description: `Deployment has completed`.
- Selected controlled AlertQueue row: `cmq0zp6up010gpd4uh5anfex5`.
- Selected user id: `cmmuzx3kt00004hk64jytoihs`.
- Approved internal recipient: `da***@gmail.com`.

## Refreshed Preflight

| Check | Result |
| --- | --- |
| Local HEAD / origin alignment | `main...origin/main`; HEAD `bd4f76c` |
| Governed source deployment | GitHub deployment `5503532389`, status `success` |
| Production selected property URL | HTTP 200 |
| Production `/search` | HTTP 200 |
| Selected alert row | `pending`, user `cmmuzx3kt00004hk64jytoihs`, `clickedAt: null` |
| Recipient | Approved internal recipient, user `isUnsubscribed: false`, `heatScore: 5`, status `Lead` |
| Sender | `al***@davidquinngroup.com` |
| Reply-to | `da***@gmail.com` |
| Public base URL | `https://davidquinngroup.com` |
| Resend key | Configured |

## Selected Payload

- Address: `6137 Baseline Rd`.
- City/state: `Boulder, CO`.
- Property id: `cmpy48m3d047b129oeqh0r22m`.
- MLS id: `IRE1349635`.
- Slug: `6137-baseline-rd-boulder-co-ire1349635`.
- Property URL: `https://davidquinngroup.com/properties/6137-baseline-rd-boulder-co-ire1349635`.
- Property URL host: `davidquinngroup.com`.
- Property URL production result: HTTP 200.

## Email Payload Verification

- Controlled send path: `processAlertById("cmq0zp6up010gpd4uh5anfex5", false)`.
- Subject sent by provider path: `David Quinn Group: 1 property intelligence update`.
- EmailLog subject: `David Quinn Group property intelligence: 6137 Baseline Rd`.
- Header branding: `David Quinn Group`.
- Body title: `Real Estate Intelligence Digest`.
- Body copy: Colorado property matches filtered through the David Quinn Group intelligence layer.
- Tracking URL path: `/api/track-click`.
- Tracking URL host: `davidquinngroup.com`.
- Tracking destination: selected property URL above.
- Tracking source: `email_alert`.
- Tracking link was not clicked.
- Unsubscribe URL path: `/api/unsubscribe`.
- Unsubscribe URL host: `davidquinngroup.com`.
- Unsubscribe token was generated only for the selected user, with `searchId: null` and `usedAt: null`.
- Unsubscribe link was not invoked.

## Before State

| Surface | Count |
| --- | ---: |
| EmailLog total | 77 |
| AlertQueue pending | 196 |
| AlertQueue sent | 84 |
| AlertQueue skipped | 3 |
| BullMQ `reie-alerts` waiting | 273 |
| BullMQ `reie-alerts` active | 0 |
| BullMQ `reie-alerts` delayed | 0 |
| BullMQ `reie-alerts` failed | 0 |
| Selected user unsubscribe tokens | 56 |
| Selected user CRM tasks | 0 |
| Selected user interactions | 1 |
| Selected user active saved searches | 1 |

## Send Execution

Executed exactly once:

```ts
await processAlertById("cmq0zp6up010gpd4uh5anfex5", false);
```

Result:

```json
{
  "id": "cmq0zp6up010gpd4uh5anfex5",
  "userId": "cmmuzx3kt00004hk64jytoihs",
  "email": "da***@gmail.com",
  "status": "sent",
  "reason": null
}
```

The successful return after the awaited Resend call and database transaction is provider-acceptance evidence for the controlled sender path. Inbox-level delivery was not independently queried from a mailbox connector.

## After State

| Surface | Count |
| --- | ---: |
| EmailLog total | 78 |
| AlertQueue pending | 195 |
| AlertQueue sent | 85 |
| AlertQueue skipped | 3 |
| BullMQ `reie-alerts` waiting | 273 |
| BullMQ `reie-alerts` active | 0 |
| BullMQ `reie-alerts` delayed | 0 |
| BullMQ `reie-alerts` failed | 0 |
| Selected user unsubscribe tokens | 57 |
| Selected user CRM tasks | 0 |
| Selected user interactions | 1 |
| Selected user active saved searches | 1 |

Latest EmailLog:

- Subject: `David Quinn Group property intelligence: 6137 Baseline Rd`.
- Type: `PROPERTY_ALERT`.
- Sent at: `2026-07-18T16:55:30.069Z`.

Latest unsubscribe token record:

- User id: `cmmuzx3kt00004hk64jytoihs`.
- Search id: `null`.
- Used at: `null`.
- Token value: redacted.

## Delta

| Surface | Delta |
| --- | ---: |
| EmailLog total | +1 |
| AlertQueue pending | -1 |
| AlertQueue sent | +1 |
| AlertQueue skipped | 0 |
| BullMQ `reie-alerts` waiting | 0 |
| BullMQ `reie-alerts` active | 0 |
| BullMQ `reie-alerts` delayed | 0 |
| BullMQ `reie-alerts` failed | 0 |
| Selected user unsubscribe tokens | +1 |
| Selected user CRM tasks | 0 |
| Selected user interactions | 0 |
| Selected alert clickedAt | unchanged `null` |

## Side-Effect Boundary

No worker, scheduler, queue loop, batch command, retry command, drain command, broad/customer email delivery, tracking click, unsubscribe invocation, real customer unsubscribe mutation, CRM mutation, MLS Grid request, OpenAI call, TitlePro247 call, Typesense reset/reindex, database reset, `prisma db push`, `npm audit fix`, or force-push was run during EMAIL-001.

## Files Changed

- `docs/project-atlas/executive-library/PROJECT-ATLAS-RELEASE-CANDIDATE-BOARD.md`.
- `docs/project-atlas/executive-library/release-candidate-board.json`.
- `docs/project-atlas/executive-library/RC1-EMAIL-001.md`.

## Closure Decision

`EMAIL-001` is closed. RC1 remains `RC1_NOT_CERTIFIED` until the remaining click and valid-unsubscribe proof issues are explicitly opened and closed.
