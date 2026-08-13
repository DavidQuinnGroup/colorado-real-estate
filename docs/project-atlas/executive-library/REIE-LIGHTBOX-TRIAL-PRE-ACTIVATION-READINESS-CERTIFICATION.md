# REIE LightBox Trial Pre-Activation Readiness Certification

Program: `REIE_LIGHTBOX_TRIAL_PRE_ACTIVATION_READINESS_REVIEW`

Date: 2026-08-13

Repository: `/Users/davidquinn/david-quinn-group/colorado-real-estate`

Canonical sync baseline before this documentation-only review: `HEAD = origin/main = 542b07dbff9682883f1b20916200c1edd71c0136`, divergence `0 ahead / 0 behind`, working tree clean.

Final readiness classification: `READY_TO_ACTIVATE_WITH_MANDATORY_TERMS_REVIEW_BEFORE_FIRST_CALL`

Tooling readiness classification: `DAY_1_TOOLING_SUFFICIENT`

## Status

`LIGHTBOX_TRIAL_PRE_ACTIVATION_READINESS_CERTIFIED_LOCAL_DOCS_ONLY`

This certification authorizes no runtime behavior. It does not activate a LightBox trial, create a Developer Portal account, handle an API key, make API calls, create environment variables, implement provider integration, persist provider data, write databases, index Typesense, change schemas, deploy, mutate customer data, activate GIS/AI/telemetry, or authorize production/customer-facing use.

The only recommended next action is a user-controlled LightBox Developer Portal sign-up followed by binding-terms review before any first API call.

## Workstream 1 Synchronization Evidence

Workstream 1 synchronized the existing protocol commit unchanged.

| Check | Result |
| --- | --- |
| Branch | `main` |
| Commit pushed | `542b07dbff9682883f1b20916200c1edd71c0136` |
| Commit subject | `Document LightBox trial evaluation protocol` |
| Post-push state | `HEAD = origin/main = 542b07dbff9682883f1b20916200c1edd71c0136` |
| Post-push divergence | `0 ahead / 0 behind` |
| Worktree before Workstream 2 | Clean |
| Deployment | None |

The synchronized commit scope was documentation-only:

- `docs/CHAT_START.md`
- `docs/project-atlas/executive-library/REIE-LIGHTBOX-COLORADO-TRIAL-EVALUATION-PROTOCOL.md`
- `docs/project-atlas/executive-library/REIE-LIGHTBOX-2000-CALL-TEST-MATRIX.md`
- `docs/project-atlas/executive-library/REIE-PROPERTY-DATA-PROVIDER-COMPARISON-FRAMEWORK.md`

## Readiness Checklist

| Checklist item | Classification | Evidence / required action |
| --- | --- | --- |
| Trial protocol approved | `READY_WITH_USER_ACTION` | Protocol exists and is synchronized. Executive HQ must approve using it as the trial operating plan before activation. |
| Colorado geography panel ready | `READY` | County panel and inclusion reasons are defined in the 2,000-call matrix. |
| Property sample framework ready | `READY_WITH_USER_ACTION` | Sample classes are defined. Actual addresses must be selected only after terms review and must not be pasted into Codex unless separately authorized. |
| Call budget approved | `READY_WITH_USER_ACTION` | Matrix reconciles `2,000` calls with `1,340` planned and `660` reserve. Public trial terms/sign-up screens must confirm actual allowance. |
| Secure API-key storage method approved | `READY_WITH_USER_ACTION` | Keychain bootstrap plan is ready. Executive HQ must run it locally after sign-up and must not paste the key into ChatGPT/Codex. |
| Evaluation tooling prepared but not run | `READY` | Day 1 can use bounded Terminal calls plus the deterministic ledger below. No repository tooling implementation is required before first call. |
| No-production-use boundary approved | `READY` | Public trial terms and internal protocol both prohibit production/customer use during trial evaluation. |
| Trial and permitted-use terms reviewed | `READY_WITH_USER_ACTION` | Public terms were reviewed. Actual sign-up, app, and trial terms must be captured and reconciled before first call. |
| Test-data handling and retention plan approved | `READY_WITH_USER_ACTION` | Evaluation-only handling is defined. Actual trial terms must confirm retention/deletion obligations and whether any trial-derived observations can be retained. |
| Day 1 test sequence ready | `READY` | A low-call sequence is defined below with a hard ceiling of `25` calls. |
| Outcome scorecard ready | `READY` | Existing matrix defines lookup, completeness, consistency, freshness, conflict, ambiguity, schema, geographic, zoning, and recoverability measures. |
| ATTOM comparison framework ready | `READY` | ATTOM remains `PENDING_PROVIDER_RESPONSE`; no ATTOM claims are inferred. |
| Provider questions prepared for Customer Success | `READY` | Rights, provenance, retention, display, caching, derived use, rate limits, and support questions are enumerated in the protocol and this certification. |
| Stop criteria approved | `READY` | Stop/go conditions are listed below. |
| Public developer documentation reviewed | `READY` | Public Developer Portal, catalog, API pages, documentation pages, and trial terms were reviewed without sign-up or API calls. |
| Binding trial terms captured from actual sign-up | `READY_WITH_USER_ACTION` | `TERMS_REVIEW_BEFORE_FIRST_API_CALL`. Public terms are not enough to confirm the exact trial presented during sign-up. |
| Rate limits and metering verified | `READY_WITH_USER_ACTION` | Publicly reviewed docs did not expose full operational rate-limit/metering behavior. Treat as `POST_ACTIVATION_DOC_DISCOVERY_REQUIRED`. |

## Public Documentation Review

Public documentation was reviewed on 2026-08-13 without account creation, credentials, or API calls.

| Source | Public evidence reviewed | Readiness finding |
| --- | --- | --- |
| LightBox Developer Portal, https://developer.lightboxre.com/ | Describes property and location intelligence APIs, immediate access flow, API key onboarding, sandbox/live customer environment language, and featured APIs. | Portal is sufficient to support sign-up readiness, not first-call authorization. |
| API catalog, https://developer.lightboxre.com/apis/catalog | Lists Geocoding, Parcels, Addresses, Assessment, Structures, Zoning, Transactions, Historical Assessed Value, Historical Tax, APN Lookup, and LightBox ID Lookup families. | Endpoint-family discovery is `READY`; exact trial entitlement remains post-activation discovery. |
| Geocoding API, https://developer.lightboxre.com/apis/geocoding | US/Canada geocoding, standardization, high-precision coordinates, reverse geocoding, batch, fuzzy matching, confidence scores, and LightBox IDs for parcel/assessment/structure. | Candidate first lookup family for Day 1 orientation. |
| Parcels API, https://developer.lightboxre.com/apis/parcels | Parcel-level property and tax data, ownership/tax records, land-use classification, zoning overlays, geometry, situs address, and LightBox IDs. | Core candidate for parcel identity and geometry tests. |
| Addresses API, https://developer.lightboxre.com/apis/addresses | Standardized/enriched address data tied to parcels, assessments, and structures; coordinate and parcel/address retrieval; sources include parcel, assessment, structure, USPS, e911, and local authoritative sources. | Useful for address-to-provider-ID and provider-ID chaining tests. |
| Assessment API, https://developer.lightboxre.com/apis/assessment | Official valuation, tax, ownership, APN/FIPS, legal description, structural characteristics, parcel links, and assessor-sourced fields. | High-value but rights-sensitive public-record candidate. |
| Zoning API, https://developer.lightboxre.com/apis/zoning | Parcel-level zoning, districts, setbacks, FAR, building height, lot area/density, and development feasibility/due-diligence use cases. | High-value but legal-use/customer-display sensitive candidate. |
| Documentation pages, https://lightbox.document360.io/ | Public documentation search results expose HTTPS/JSON requirements, base URL, `x-api-key` header, and endpoint examples across zoning, parcels, assessments, addresses, and first request. | Enough to plan first-call mechanics. Full response, error, pagination, and limits remain `POST_ACTIVATION_DOC_DISCOVERY_REQUIRED`. |
| Trial terms, https://developer.lightboxre.com/terms | Public trial agreement states test-purpose license, 30-day test period from license download, deletion/destruction after expiration or termination, no commercial/production use, no third-party access, confidentiality/security obligations, and audit rights. | Binding-term review is mandatory before first call. Sales-trial statements and public terms must be reconciled. |

## API Mechanics Readiness

| Topic | Publicly observed posture | Classification |
| --- | --- | --- |
| Transport | HTTPS and JSON-oriented API use are publicly documented. | `READY` |
| Base URL | Public docs reference `https://api.lightboxre.com/v1`. | `READY` |
| Authentication | Public docs reference token auth through the `x-api-key` HTTP header. | `READY_WITH_USER_ACTION` because the key must be obtained and stored outside Codex. |
| Endpoint families | Geocoding, Addresses, Parcels, Assessment, Zoning, Structures, APN Lookup, LightBox ID Lookup, Transactions, Historical Assessed Value, and Historical Tax were observed. | `READY` for planning; actual trial entitlement is `POST_ACTIVATION_DOC_DISCOVERY_REQUIRED`. |
| Join concepts | LightBox IDs, Parcel ID, Assessment ID, Structure ID, Property/Site concepts, APN, FIPS, normalized address, coordinates, geometry/WKT, and jurisdictional/zoning relationships appear relevant. | `READY` for Day 1 schema observation. |
| Pagination | Some public parcel/geometry examples expose `limit` and `offset`. | `READY_WITH_USER_ACTION`; global pagination conventions remain `POST_ACTIVATION_DOC_DISCOVERY_REQUIRED`. |
| Error conventions | Public examples include no-result/not-related `404` behavior in zoning/address relationships. | `READY_WITH_USER_ACTION`; full error taxonomy remains `POST_ACTIVATION_DOC_DISCOVERY_REQUIRED`. |
| Rate limits | Publicly reviewed pages did not establish operational rate limits. Executive correspondence reported up to `2,000` trial calls. | `READY_WITH_USER_ACTION`; exact limits and metering must be captured after sign-up. |
| Sandbox/test distinction | Portal describes ability to build/test in a sandbox or live customer environment. | `READY_WITH_USER_ACTION`; actual trial environment selection and restrictions must be confirmed in the app. |
| Response metadata | Public API pages describe confidence scores, IDs, geometry, source families, and domain attributes. | `READY`; exact fields and freshness/provenance metadata remain first-call observations. |

## Terms And Rights Review

Public LightBox trial terms materially narrow what the trial may be used for. They must be treated as controlling unless a signed/written amendment or in-product trial agreement says otherwise.

| Rights / terms topic | Public posture | REIE consequence |
| --- | --- | --- |
| License purpose | Public terms describe a limited test-purpose license. | Trial output stays `EVALUATION_ONLY`. |
| Duration | Public terms describe a 30-day test period from license download; Executive correspondence reported a three-week trial. | `TRIAL_DURATION_RECONCILIATION_REQUIRED` before first call. |
| Commercial / production use | Public terms prohibit commercial and production use. | No customer-facing display, Search indexing, runtime integration, reports, marketing, or operational reliance. |
| Copying and access | Public terms limit copying to test purpose and restrict access to need-to-know users. | No broad team sharing, no customer sharing, no vendor sharing, no persistent reusable payload repository. |
| Deletion / destruction | Public terms require deletion/destruction after expiration or termination and certification on request. | Trial response payload retention must be minimal and term-compliant; ledger should avoid raw payloads unless separately allowed. |
| Security | Public terms require secure handling and prompt breach notice. | API key must be handled outside Codex and outside repo/Vercel/customer runtime. |
| Audit | Public terms reserve audit rights. | Keep deterministic call ledger and call-budget reconciliation. |
| Entire agreement | Public terms say changes require written amendment. | Sales statements are not production rights; retain sales notes separately from binding terms. |

Provider sales statement vs binding terms vs future production license:

- Provider sales statement: evidence of commercial willingness and possible trial allowance, support, packaging, and first-party data positioning.
- Binding trial terms: control trial behavior, restrictions, security, duration, deletion, and test-only use unless superseded by actual signed/in-product terms.
- Future production license: not granted. Customer-facing display, derived outputs, caching, retention, indexing, bulk use, AI use, reports, screenshots, and data migration require separate written rights.

## Secure API-Key Bootstrap Plan

Executive HQ must not paste a LightBox key into ChatGPT/Codex and must not commit or store it in the repository, Vercel, production runtime, customer runtime, shell history, documentation, screenshots, issue trackers, or logs.

Preferred local storage for the trial key:

- macOS Keychain service: `PROJECT_ATLAS_LIGHTBOX_TRIAL_API_KEY`
- macOS Keychain account: `david-quinn-group-evaluation`
- Scope: local Executive HQ machine only
- Runtime posture: retrieve into process memory only for the bounded session, then unset
- Trial data posture: `EVALUATION_ONLY`

After sign-up and only after confirming the actual trial terms, Executive HQ may run this in macOS Terminal. The input is hidden.

```zsh
SERVICE="PROJECT_ATLAS_LIGHTBOX_TRIAL_API_KEY"
ACCOUNT="david-quinn-group-evaluation"
read -s "LIGHTBOX_API_KEY?Paste LightBox trial API key (input hidden): "
printf "\n"
security add-generic-password -a "$ACCOUNT" -s "$SERVICE" -w "$LIGHTBOX_API_KEY" -U
unset LIGHTBOX_API_KEY
security find-generic-password -a "$ACCOUNT" -s "$SERVICE" >/dev/null
echo "Stored LightBox trial API key in macOS Keychain service: $SERVICE"
```

For a bounded future first-call session, retrieve only into process memory and unset afterward:

```zsh
SERVICE="PROJECT_ATLAS_LIGHTBOX_TRIAL_API_KEY"
ACCOUNT="david-quinn-group-evaluation"
LIGHTBOX_API_KEY="$(security find-generic-password -a "$ACCOUNT" -s "$SERVICE" -w)"
# Use LIGHTBOX_API_KEY only in the current bounded Terminal session.
unset LIGHTBOX_API_KEY
```

Do not run either block before the LightBox account exists and before the actual presented trial terms have been captured for review.

## Deterministic Call Ledger Format

The Day 1 ledger should be local-only and should not include API keys, bearer/token material, full customer-sensitive request URLs, private customer data, or raw payloads unless actual trial terms explicitly allow retention.

Recommended initial ledger location for a bounded session: `/private/tmp/reie-lightbox-trial-call-ledger.csv`

Required fields:

| Field | Purpose |
| --- | --- |
| `ledger_id` | Stable local row ID. |
| `timestamp_utc` | ISO timestamp for the request. |
| `phase` | `DAY_1_ORIENTATION`, `PHASE_A`, etc. |
| `sample_case_id` | Internal test case ID, not raw address. |
| `county_or_region` | County/geography label. |
| `sample_type` | Detached, condo, acreage, boundary-adjacent, etc. |
| `endpoint_family` | Geocoding, Addresses, Parcels, Assessment, Zoning, etc. |
| `request_input_class` | Address, normalized address, coordinates, WKT, APN, LightBox ID, Parcel ID, etc. |
| `request_value_stored` | `NO` by default; `YES` only if terms permit and value is non-sensitive. |
| `http_status_class` | `2xx`, `4xx`, `5xx`, or `NO_RESPONSE`. |
| `response_class` | `SUCCESS`, `NO_MATCH`, `AMBIGUOUS`, `ERROR`, `BLOCKED`. |
| `match_class` | `MATCH`, `PARTIAL_MATCH`, `AMBIGUOUS_MATCH`, `NO_MATCH`, `CONFLICT`, `NOT_EVALUATED`. |
| `identifier_types_seen` | Types only, such as Parcel ID, APN, Assessment ID, Structure ID, FIPS. |
| `freshness_metadata_seen` | `YES`, `NO`, or `UNKNOWN`. |
| `source_metadata_seen` | `YES`, `NO`, or `UNKNOWN`. |
| `pagination_or_count_seen` | `YES`, `NO`, or `UNKNOWN`. |
| `calls_consumed` | Calls consumed by this action. |
| `cumulative_calls` | Running total. |
| `remaining_trial_allowance_estimate` | Remaining allowance if known. |
| `terms_constraint_notes` | Retention, display, derived use, or deletion observations. |
| `conflict_notes` | Brief, non-sensitive conflict summary. |
| `next_action` | Continue, pause, escalate, stop. |
| `reviewed_by` | Human reviewer initials/name. |

## Day 1 Test Sequence

Day 1 is not authorized by this certification. It is a future separately authorized sequence after sign-up, key storage, and terms review.

Recommended Day 1 soft ceiling: `15` calls.

Recommended Day 1 hard ceiling: `25` calls.

Do not proceed beyond the hard ceiling without Executive HQ review.

| Step | Calls | Action | Stop condition |
| --- | ---: | --- | --- |
| 0 | 0 | Capture actual trial terms, trial start/end date, call allowance, enabled app/API families, rate-limit language if visible, deletion/retention obligations, and key location. | Stop if terms prohibit evaluation, retention of ledger observations, internal test use, or secure key handling. |
| 1 | 0 | Store key in macOS Keychain using the hidden-input command block. | Stop if the key would need to be pasted into Codex, committed, logged, or stored in Vercel/runtime. |
| 2 | 1-3 | Authentication and endpoint sanity against one documented low-risk endpoint family. | Stop after three failed auth attempts, any billing prompt, or unclear account/app state. |
| 3 | 1-4 | One known standard residential test case: address/geocoding or address lookup, inspect returned identifier types and confidence/precision. | Stop if result shape cannot be ledgered without retaining raw sensitive data. |
| 4 | 1-4 | Parcel identity follow-up using provider-returned identifier or permitted geometry/input class. | Stop if endpoint chaining is unclear or consumes unexpected calls. |
| 5 | 1-4 | Assessment/public-record orientation only if terms permit internal inspection of those fields. | Stop if ownership/privacy fields appear and handling restrictions are unclear. |
| 6 | 1-4 | Zoning orientation for the same or second low-risk case. | Stop if zoning output could be misconstrued as legal-use advice or lacks source/effective context. |
| 7 | 2-6 | Repeat a minimal chain in one second Colorado geography to check schema stability. | Stop at soft ceiling unless information gain is still high and ledger quality is complete. |
| 8 | 0 | Review ledger, reconcile calls remaining, decide whether Phase A can continue. | Stop if call count cannot be reconciled. |

## Test Data Selection Guidance

Before first call:

- Select public, non-customer-sensitive, non-private-property samples.
- Prefer active or recently public listing examples already suitable for internal evaluation.
- Use internal sample IDs in the ledger; keep actual addresses outside Codex unless separately authorized.
- Start with one standard detached property in a familiar Colorado county and one second geography with a simple comparable use case.
- Avoid customer homes, leads, saved searches, private client addresses, off-market private targets, protected-class proxies, sensitive ownership situations, or any test intended to infer safety, desirability, school quality, protected-class composition, appraisal value, legal permissibility, or investment suitability.

## Stop / Go Conditions

Immediate stop conditions:

- Actual trial terms differ materially from the public terms or prohibit the intended evaluation.
- The trial allowance, duration, deletion obligations, or rate limits cannot be established.
- API key handling would require Codex, repository, Vercel, customer runtime, browser screenshot, shell history, or log exposure.
- Account flow asks for billing/payment or production app activation not authorized by Executive HQ.
- Authentication fails three times or returns ambiguous app/account errors.
- Provider docs, portal, or responses indicate production/live environment use rather than trial/sandbox evaluation.
- First responses expose sensitive ownership/privacy fields and permitted handling is unclear.
- Raw payload retention appears required for useful evaluation but terms do not allow it.
- Call count/metering cannot be reconciled.
- Endpoint behavior would require schema, API, database, Typesense, GIS, AI, telemetry, or runtime implementation.
- Any output appears to invite valuation, legal-use, lending, tax, title, insurance, safety, condition, protected-class, steering, appraisal, or investment conclusions.

Go conditions for the first-call phase:

- Actual trial terms are captured and reviewed.
- Trial duration and call allowance are reconciled against the public terms and Executive correspondence.
- The API key is stored in local macOS Keychain only.
- Enabled endpoint families are visible.
- Day 1 call ceiling is accepted.
- Ledger exists before the first call.
- No production/runtime/customer system is touched.
- Executive HQ explicitly authorizes the first-call session after terms review.

## User Activation Action

Recommended user-controlled next action:

1. Visit the LightBox Developer Portal: https://developer.lightboxre.com/
2. Choose Sign Up or create the trial account.
3. Do not make any API calls yet.
4. Do not paste the API key into ChatGPT/Codex.
5. Capture and return only safe metadata for review.

Safe information to return:

- Confirmation that the account/trial was created.
- Trial start date and end date.
- Trial call allowance and any visible rate limits.
- Enabled API product families.
- Whether the portal labels the environment as sandbox, trial, live customer, or another term.
- Links or screenshots of terms, docs, app scope, and metering pages, with the API key and any secrets fully hidden.
- App name or app ID only if it is not secret.
- Customer Success or support contact path if shown.

Do not return:

- API key, consumer secret, bearer token, auth header, full secret-bearing curl command, or hidden credential value.
- Customer addresses, client data, private off-market properties, saved-search records, lead records, or sensitive ownership details.
- Raw response payloads before retention terms are confirmed.

## Recommended Next Gate

`READY_FOR_EXECUTIVE_HQ_LIGHTBOX_DEVELOPER_PORTAL_SIGNUP_ONLY`

After sign-up, the next review must classify the actual presented trial terms and app/API scope before any first API call. The first API call should wait for explicit Executive HQ authorization after that terms review.
