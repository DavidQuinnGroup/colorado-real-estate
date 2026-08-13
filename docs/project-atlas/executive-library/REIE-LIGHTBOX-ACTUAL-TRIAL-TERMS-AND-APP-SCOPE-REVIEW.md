# REIE LightBox Actual Trial Terms And App Scope Review

Program: `REIE_LIGHTBOX_ACTUAL_TRIAL_TERMS_AND_APP_SCOPE_REVIEW`

Date: 2026-08-13

Repository: `/Users/davidquinn/david-quinn-group/colorado-real-estate`

Canonical baseline before this documentation-only review: `HEAD = origin/main = af94e8a5107b03989a7787cae663e0b950494843`, divergence `0 ahead / 0 behind`, working tree clean.

Go / no-go classification: `AUTHENTICATION_CONTRACT_UNRESOLVED`

Secondary unresolved classification: `API_SCOPE_UNRESOLVED`

## Status

`LIGHTBOX_ACTUAL_TRIAL_TERMS_AND_APP_SCOPE_REVIEW_COMPLETE_LOCAL_DOCS_ONLY`

This review used only Executive HQ supplied application evidence and public/static LightBox documentation. It did not retrieve credentials, print credentials, create or alter a LightBox app, accept terms, execute Swagger Try It, make LightBox API calls, consume trial quota intentionally, integrate LightBox, modify runtime code, modify database/schema/Typesense/Vercel/MLS, or deploy.

## Activated App / Trial Posture

Executive HQ reported the following application state:

| Item | Actual state supplied by Executive HQ |
| --- | --- |
| Application | `PROJECT ATLAS - REIE LightBox Evaluation` |
| Application type | Personal evaluation app |
| Application status | Approved |
| Product | `LightBox API's Evaluation` |
| Product status | Approved |
| Registered | 2026-08-13 |
| Credential status | Approved |
| Credential structure | Key + Secret |
| Credential expiry | 2026-09-03 |
| Callback URL | N/A |
| Credential storage | macOS Keychain entries confirmed stored by Executive HQ |
| Key service | `PROJECT_ATLAS_LIGHTBOX_TRIAL_KEY` |
| Secret service | `PROJECT_ATLAS_LIGHTBOX_TRIAL_SECRET` |
| Keychain account | Current macOS user |
| Intentional data calls so far | None authorized by Executive HQ |

Application/product approval is technical access evidence only. It does not grant production rights, customer display rights, caching/storage rights, AI/ML rights, redistribution rights, or post-trial retention rights.

## Applicable Terms Findings

| Source class | Evidence | Finding |
| --- | --- | --- |
| Binding or click-through trial terms | Public Developer Portal Trial Agreement: https://developer.lightboxre.com/terms | Supports narrow test-purpose use only. Public terms prohibit commercial/production use, restrict access and copying, impose security obligations, reserve audit rights, and require deletion/destruction at expiration or termination. |
| General developer docs | Public Developer Portal and Document360 API docs | Support API evaluation mechanics and endpoint discovery, not production/customer rights. |
| Privacy / security terms | LightBox Privacy Policy, DPA, public security language, and trial security clause | Useful for account/security posture; not a substitute for an executed data-processing or production license for REIE use. |
| Sales representative statements | Executive HQ correspondence and reported product approval | Evidence of commercial willingness and 2,000-call evaluation posture, not binding production rights. |
| Future negotiable production license | Public production-access page states production requires company account/payment/support process | Future production terms remain ungranted. |

Terms support internal evaluation only. The following remain `UNRESOLVED_FOR_PRODUCTION`: customer display, redistribution, reports/screenshots outside internal evaluation, derived intelligence, AI/ML processing, persistent storage, caching, indexing, production use, post-trial retention, attribution language, team expansion beyond need-to-know users, and migration of trial-derived artifacts into production.

## Current Rights Matrix

| Use / right | Current classification | Notes |
| --- | --- | --- |
| Evaluation use | `SUPPORTED_FOR_TEST_PURPOSE_ONLY` | Public trial terms permit test-purpose use only. |
| Internal testing | `SUPPORTED_WITH_NEED_TO_KNOW_RESTRICTION` | Access must be restricted to users with need to know for the test purpose. |
| Temporary response inspection | `SUPPORTED_ONLY_AS_NECESSARY_FOR_TEST_PURPOSE` | Avoid raw payload retention unless necessary and term-compliant. |
| Call ledger with sanitized metadata | `SUPPORTED_WITH_REDACTION` | No credentials, unnecessary personal data, or raw payloads. |
| Storage / caching / temporary persistence | `UNRESOLVED_FOR_PRODUCTION` | Trial terms require deletion/destruction after expiration or termination. |
| Response retention after trial | `UNRESOLVED_FOR_PRODUCTION` | Assume no retention of originals/copies absent written permission. |
| Derived outputs | `UNRESOLVED_FOR_PRODUCTION` | No production or customer-facing derivative use is granted. |
| AI/ML processing | `UNRESOLVED_FOR_PRODUCTION` | No AI/ML processing right found in reviewed terms. |
| Screenshots / reports | `UNRESOLVED_FOR_PRODUCTION` | Internal evaluation notes may be safer than payload screenshots; reports need production terms. |
| Customer display | `BLOCKED_NOT_AUTHORIZED` | Public trial terms prohibit commercial/production use and third-party access. |
| Redistribution | `BLOCKED_NOT_AUTHORIZED` | Public trial terms prohibit sale/resale/license/sublicense/distribution/rent/lease of API portions and restrict Information access. |
| Production use | `BLOCKED_NOT_AUTHORIZED` | Production requires separate process/license. |
| Attribution | `UNRESOLVED_FOR_PRODUCTION` | Public docs did not establish field-level attribution language for REIE. |
| Credential sharing | `BLOCKED_EXCEPT_SECURE_NEED_TO_KNOW` | Credentials remain local Keychain secrets. |
| Post-trial deletion | `REQUIRED_BY_PUBLIC_TRIAL_TERMS` | Delete/destroy originals and copies on expiration/termination; certification may be requested. |
| Rate limits | `PARTIALLY_ESTABLISHED` | Executive evidence says 2,000-call allowance; public docs do not establish all rate/metering details. |
| Prohibited uses | `ESTABLISHED_FOR_NO_PRODUCTION_NO_COMMERCIAL_NO_REDISTRIBUTION` | Also avoid destructive/security-abusive API use. |

## Authentication Contract

Public docs consistently describe token/API-key authentication:

- Base API URL: `https://api.lightboxre.com/v1`
- Required transport: HTTPS
- Auth header: `x-api-key`
- Auth value: public docs call it an API key, authentication token, consumer key, or apiKey
- Developer Portal Swagger flow: enter the consumer key in Swagger Authorize before executing endpoints
- Postman flow: paste consumer key/apiKey in the Auth value; use inherited auth for endpoint requests

Conflict requiring resolution:

- Executive HQ reports an approved credential structure of Key + Secret.
- Public docs reviewed for the relevant API flow document only a consumer key / apiKey / token in `x-api-key`.
- No public reviewed documentation establishes how the Secret is used, whether it is dormant, whether it signs requests, whether it exchanges for a bearer token, or whether it should never be sent to data endpoints.

Therefore the authentication contract is not precise enough for a first data-call session. Do not send the Secret to any data endpoint unless LightBox documentation or support explicitly instructs that flow. Do not execute a token or authentication request to test this until the quota impact and non-data nature are established.

## Token / Credential Flow

Current safe local design, pending authentication clarification:

1. Retrieve `PROJECT_ATLAS_LIGHTBOX_TRIAL_KEY` from macOS Keychain into `LIGHTBOX_KEY` in volatile process memory.
2. Retrieve `PROJECT_ATLAS_LIGHTBOX_TRIAL_SECRET` from macOS Keychain into `LIGHTBOX_SECRET` in volatile process memory only if the resolved auth flow requires it.
3. If public docs are confirmed as authoritative for this app, use `LIGHTBOX_KEY` only as the `x-api-key` header value.
4. If a documented non-data token exchange exists, store any transient token in process memory only as `LIGHTBOX_ACCESS_TOKEN`.
5. Never print, persist, commit, log, screenshot, send to Codex, write to `.env`, write to Vercel, or return credential values.
6. Always `unset LIGHTBOX_KEY LIGHTBOX_SECRET LIGHTBOX_ACCESS_TOKEN` after the bounded session.

Reference shell pattern for a future authorized session:

```zsh
KEY_SERVICE="PROJECT_ATLAS_LIGHTBOX_TRIAL_KEY"
SECRET_SERVICE="PROJECT_ATLAS_LIGHTBOX_TRIAL_SECRET"
LIGHTBOX_KEY="$(security find-generic-password -a "$USER" -s "$KEY_SERVICE" -w)"
LIGHTBOX_SECRET="$(security find-generic-password -a "$USER" -s "$SECRET_SERVICE" -w)"

# Do not print these variables.
# Do not execute data calls until the authentication contract is resolved and separately authorized.

unset LIGHTBOX_KEY LIGHTBOX_SECRET LIGHTBOX_ACCESS_TOKEN
```

## Token And Call-Count Findings

| Question | Finding |
| --- | --- |
| Does a bearer/access token flow exist? | `UNRESOLVED`. Public docs reviewed describe `x-api-key`, not a bearer exchange. |
| Is the Secret used? | `UNRESOLVED`. Executive app evidence says Key + Secret; public docs reviewed do not specify Secret use. |
| Do auth/token calls consume quota? | `UNRESOLVED`. No token-call endpoint was found; no request was executed. |
| Do successful data requests count? | Public FAQ indicates 2xx responses count as calls regardless of field population. |
| Do failed requests count? | Public FAQ indicates 4xx and 5xx responses do not incur cost. |
| Do Swagger Try It calls count? | `LIKELY_YES_IF_EXECUTE_RETURNS_2XX`; Execute initiates the API call, so do not use Try It casually. |
| Does pagination count per page? | `UNRESOLVED`; treat each paginated HTTP request as one potential call until proven otherwise. |
| Can one request return multiple objects? | `SUPPORTED_BY_DOCS`; geometry and parcel/address relationship endpoints can return sets with recordSet metadata. |
| Does analytics report usage? | UI exposes Analytics per Executive HQ; exact counters and reporting delay remain unverified without portal inspection. |

## Actual Evaluation API Scope

The approved product is `LightBox API's Evaluation`, but public docs do not prove which API proxies are enabled for this specific app without inspecting the approved app/product scope in the portal or executing no calls. The following classifications are trial-planning classifications, not entitlement proof.

| API family | Trial classification | Entitlement status | Reason |
| --- | --- | --- | --- |
| Geocoding | `IN_SCOPE_HIGH_VALUE` | `ACCESS_UNKNOWN` | First-call candidate because it can return coordinates, confidence, precision, and related Parcel/Assessment/Structure IDs. |
| Parcels | `IN_SCOPE_HIGH_VALUE` | `ACCESS_UNKNOWN` | Core parcel identity, geometry, situs, land-use, tax, ownership-sensitive, and LightBox ID domain. |
| Assessment | `IN_SCOPE_HIGH_VALUE` | `ACCESS_UNKNOWN` | Core APN/FIPS, valuation/tax/ownership/structure attributes; high rights sensitivity. |
| Zoning | `IN_SCOPE_HIGH_VALUE` | `ACCESS_UNKNOWN` | Core zoning district/setback/FAR/height/lot/density domain; legal-use caveat required. |
| Addresses | `IN_SCOPE_HIGH_VALUE` | `ACCESS_UNKNOWN` | Address-to-parcel and parcel-to-address joining. |
| Structures | `IN_SCOPE_SECONDARY` | `ACCESS_UNKNOWN` | Useful footprint/building context after parcel/assessment/zoning basics. |
| APN Lookup | `IN_SCOPE_SECONDARY` | `ACCESS_UNKNOWN` | Useful if first test case has authoritative APN. |
| LightBox ID Lookup | `IN_SCOPE_SECONDARY` | `ACCESS_UNKNOWN` | Useful for resolving provider IDs and object type. |
| Transactions / Historical Assessed Value / Historical Tax | `OUT_OF_SCOPE_FOR_CURRENT_TRIAL` | `ACCESS_UNKNOWN` | Potentially useful later, but not in first five-call parcel/zoning/public-record proof. |
| Environmental / FEMA / EPA / Schools / Demographics / True Owner | `OUT_OF_SCOPE_FOR_CURRENT_TRIAL` | `ACCESS_UNKNOWN` | Not part of the approved first property/public-record trial and may create fair-housing/privacy/scope risk. |

## Endpoint / Field Discovery

Documentation-supported endpoint and field observations that replace the original `PROVIDER_DOC_REQUIRED` placeholders for first-pass planning:

| Domain | Endpoint / method | Required identifiers | Optional parameters | Response / fields to inspect |
| --- | --- | --- | --- | --- |
| Geocoding search | `GET /addresses/search?text={address}` | Address text | Parsed address inputs may be available in related geocoding docs; batch exists but is not Day 1. | Parsed address, confidence score, latitude, longitude, precision code, related core-object references/IDs for Parcel, Assessment, Structure. |
| Parcels by geometry | `GET /parcels/{countryCode}/geometry` | `countryCode`, WKT | `bufferDistance`, `bufferUnit`, `limit`, `offset` | Parcel geometry, parcel ID, APN/assessor-related fields where present, situs address, ownership/tax/land-use/zoning/property characteristics, LightBox IDs, recordSet metadata. |
| Parcels by ID | `GET /parcels/{countryCode}/{id}` | LightBox Parcel ID | None documented for the basic ID path in first-request example | Parcel object assigned to the LightBox Parcel ID. |
| Parcels by assessment | `GET /parcels/_on/assessment/us/{id}`; `POST /parcels/_on/assessment/us/{id}` | LightBox Assessment ID | POST filters by IDs | Parcel records related to an assessment. |
| Parcels by structure | `GET /parcels/_on/structure/us/{id}`; `POST /parcels/_on/structure/us/{id}` | LightBox Structure ID | POST filters by IDs | Parcel records related to a structure. |
| Adjacent parcels | `GET /parcels/_adjacent/{countryCode}/{id}` | LightBox Parcel ID | `commonOwnership=true|false` | Adjacent parcels and common-ownership signal; not Day 1 unless multi-parcel issue arises. |
| Assessment by geometry | `GET /assessments/us/geometry` | WKT | `bufferUnit`, `bufferDistance`, `limit`, `offset` | Assessment records, APN, FIPS, parcel ID, transaction reference, geocode confidence, valuation/tax/lot/building/land-use/zoning-assessment fields, recordSet metadata. |
| Assessment by ID / parcel ID | Public product page says retrieve by LightBox Assessment ID or Parcel ID; exact endpoint path not fully established in reviewed snippets. | Assessment ID or Parcel ID | `PROVIDER_DOC_REQUIRED` | Use only after endpoint path is confirmed from Swagger/static docs. |
| Zoning by parcel | `GET /zoning/_on/parcel/{countryCode}/{id}` | LightBox Parcel ID | None in reviewed snippet | Zoning records; inspect district/classification, setbacks, FAR, max height, lot/density metrics, source/effective metadata if present. |
| Zoning by site / property | `GET /zoning/_on/site/{countryCode}/{id}`; `GET /zoning/_on/property/{countryCode}/{id}` | Site ID or Property ID | None in reviewed snippets | Secondary if parcel join is insufficient. |
| Zoning by address | `GET /zoning/address` | Address text | `PROVIDER_DOC_REQUIRED` | Potential direct one-call zoning path; exact params and response require Swagger/static confirmation. |
| Addresses by geometry | `GET /addresses/{countryCode}/geometry` | `countryCode`, WKT | `bufferDistance`, `bufferUnit`, `nearest=true`; nearest searches up to 1000m; pagination fields may appear | Address records, address IDs, geocode metadata, recordSet metadata, parcel/assessment/structure related context if present. |
| Addresses by ID | `GET /addresses/{countryCode}/{id}` | LightBox Address ID or UAID | None documented | Address record. |
| Addresses by parcel | `GET /addresses/_on/parcel/{countryCode}/{id}` | LightBox Parcel ID | None documented | Addresses on parcel. |
| Addresses by site | `GET /addresses/_on/site/us/{id}` | Site LightBox ID | None documented | Addresses on site. |
| Structures by geometry | `GET /structures/{countryCode}/geometry` | `countryCode`, WKT | `bufferDistance`, `bufferUnit`, `limit`, `offset` | Structure IDs, UBID, geometry, height, ground elevation, footprint area, stories, propertyClass, parcel refs. |
| Structures by address | `GET /structures/address?text={address}` | Complete address string | None documented | Structure by address; 404 if address is not related to a structure. |
| Structures by parcel | `GET /structures/_on/parcel/{countryCode}/{id}` | LightBox Parcel ID | None documented | Structures on parcel. |
| Structures by ID / UBID | `GET /structures/{countryCode}/{id}`; `GET /structures/{countryCode}/ubid/{UBID}` | Structure LightBox ID or UBID | None documented | Structure object. |

## Call-Accounting Contract

`CALL_ACCOUNTING_REQUIRES_DAY_1_EMPIRICAL_VALIDATION`

Established:

- Public FAQ says 2xx responses count as calls even if fields are unpopulated.
- Public FAQ says 4xx and 5xx responses incur no cost.
- The 2,000-call allowance is Executive-supplied application evidence.

Unresolved:

- Whether any non-data auth/token request exists or counts.
- Whether Swagger Authorize alone affects counters.
- Whether browser Try It failed/success responses follow the same call accounting.
- Whether each paginated page counts separately. Assume yes until disproven because each page is a separate HTTP request.
- Whether analytics usage has reporting delay.
- Whether one request returning multiple records is charged as one call or by object. Public docs suggest request-based examples, but do not prove all billing rules.

## Analytics / Usage Posture

Executive HQ reports that the application UI exposes an Analytics section. This should be treated as safe to inspect only if the inspection is limited to portal navigation and does not press Swagger Try It, Execute, sample requests, or any endpoint action.

Expected Analytics review goals after authorization:

- Current usage/call count
- Call allowance remaining
- App/product scope or endpoint-family usage
- Date range granularity
- Reporting delay
- Whether 4xx/5xx appear in usage
- Whether Swagger Try It requests are indistinguishable from other calls

No analytics traffic was generated by this workstream.

## Final Day-1 First-Call Sequence

This sequence is not authorized yet. It should be executed only after authentication contract and API scope are resolved.

Executive preference is preserved: maximum `5` data calls before first evidence review.

| Call | Endpoint family | Proposed request | Purpose | Expected information gain |
| --- | --- | --- | --- | --- |
| 1 | Geocoding | `GET /addresses/search?text={known_clean_colorado_address}` | Establish auth success, normalized address, confidence/precision, coordinates, and related Parcel/Assessment/Structure references. | Highest information gain because one call can provide join IDs for later calls. |
| 2 | Parcels | `GET /parcels/us/{parcelLightBoxId}` if Call 1 returns Parcel ID; otherwise `GET /parcels/us/geometry?wkt=POINT(...)` with minimal buffer. | Confirm parcel identity, APN/parcel fields, geometry, situs/land-use/tax/ownership-sensitive field presence, recordSet metadata. | Core parcel proof. |
| 3 | Assessment | Prefer documented Assessment-ID/Parcel-ID endpoint after Swagger confirmation; fallback `GET /assessments/us/geometry` using Call 1 point and small buffer. | Confirm APN/FIPS, assessor attributes, valuation/tax/structure fields, ownership-sensitive fields, freshness/provenance metadata. | Core public-record proof. |
| 4 | Zoning | `GET /zoning/_on/parcel/us/{parcelLightBoxId}` | Confirm zoning district/regulation fields, legal-use caveat needs, source/effective metadata, and relationship to parcel. | Core zoning proof. |
| 5 | Addresses | `GET /addresses/_on/parcel/us/{parcelLightBoxId}` | Confirm address/parcel join quality, unit/sub-address behavior, and address universe against sample. | Joinability proof. |

Stop after call 5, reconcile call count in Analytics, and review ledger before any further calls.

## Day-1 Initial Call Ceiling

- Initial data-call ceiling: `5`
- Hard stop after call 5 before evidence review.
- Do not spend calls on batch, tile, owner portfolio, adjacent/common-ownership, historical tax/value, transaction, environmental, school, demographic, or True Owner endpoints in Day 1.
- If authentication contract remains unresolved, Day 1 is blocked.

## First Test-Case Characteristics

Boulder County is the appropriate first geography if Executive HQ can select a non-customer-sensitive, known-clean residential property with existing REIE listing data and available public county comparison evidence.

Recommended characteristics:

- Colorado property, preferably Boulder County for existing REIE/county-public-record context.
- Standard detached residential property.
- Straightforward one-parcel condition; avoid condo, townhome, multi-parcel, private off-market, customer/client, or sensitive ownership case for call 1-5.
- Known existing REIE `Property` data with address and coordinates.
- Public county assessor/GIS evidence available for later comparison outside LightBox.
- No need to expose owner name or unnecessary private information in the ledger.
- Supports parcel + assessment + zoning + address evaluation from one known address.

Use sample ID `LB-DAY1-BOULDER-STANDARD-001`; store actual address outside Codex unless separately authorized.

## Secure Execution Design

For a future authorized first-call session:

- Retrieve credentials from macOS Keychain only.
- Use volatile process variables only.
- Never print credentials or include them in command logs.
- Prefer a local script that redacts headers and writes only sanitized ledger rows.
- Disable shell debug tracing.
- Keep raw response payloads in memory or a temporary redacted scratch area only if terms permit; otherwise inspect and discard.
- Write no `.env`, no Vercel env var, no repository secret, no production config.
- Unset variables after the bounded session.
- Confirm `git status` remains clean before and after the session if any docs are later updated.

## Call Ledger

Ledger location for future authorized session: `/private/tmp/reie-lightbox-day1-call-ledger.csv`

Required fields:

| Field | Description |
| --- | --- |
| `trial_day_date` | Trial day and calendar date. |
| `request_number` | 1 through 5 for Day 1. |
| `phase` | `DAY_1_FIRST_FIVE`. |
| `endpoint_family` | Geocoding, Parcels, Assessment, Zoning, Addresses. |
| `method_and_endpoint_template` | Endpoint template without credential or sensitive address. |
| `geography` | County / state. |
| `sample_case_id` | Sanitized sample ID, not raw address. |
| `purpose` | Reason for call. |
| `http_result` | Status code/class. |
| `lightbox_result_classification` | `SUCCESS`, `NO_MATCH`, `AMBIGUOUS`, `ERROR`, `BLOCKED`. |
| `calls_consumed` | Calls consumed by this request if known. |
| `cumulative_calls` | Running Day 1 total. |
| `planned_budget_remaining` | Remaining from 5-call Day 1 ceiling. |
| `trial_allowance_remaining` | Remaining from 2,000-call allowance if Analytics exposes it. |
| `match_classification` | `MATCH`, `PARTIAL_MATCH`, `AMBIGUOUS_MATCH`, `NO_MATCH`, `CONFLICT`, `NOT_EVALUATED`. |
| `conflict_classification` | `NONE`, `IDENTITY_CONFLICT`, `GEOMETRY_CONFLICT`, `ATTRIBUTE_CONFLICT`, `RIGHTS_CONFLICT`, `UNKNOWN`. |
| `useful_fields` | Field families only. |
| `missing_fields` | Expected field families absent. |
| `freshness_provenance_observations` | Source/freshness metadata presence, not raw payload. |
| `sanitized_error` | Error summary with no secrets or sensitive inputs. |
| `notes` | Non-sensitive observations. |

## Executive Recommendation

Do not execute the first five data calls yet. Resolve the Key + Secret versus public `x-api-key` contract and verify app product scope in the portal without pressing Try It/Execute. If the portal static UI or LightBox support confirms that the consumer key alone is the `x-api-key` token and the approved product includes Geocoding, Parcels, Assessment, Zoning, and Addresses, the next gate can authorize the Day 1 first five calls with a strict five-call ceiling.

## Next Authorization Gate

`READY_FOR_LIGHTBOX_AUTH_CONTRACT_AND_API_SCOPE_STATIC_CONFIRMATION`
