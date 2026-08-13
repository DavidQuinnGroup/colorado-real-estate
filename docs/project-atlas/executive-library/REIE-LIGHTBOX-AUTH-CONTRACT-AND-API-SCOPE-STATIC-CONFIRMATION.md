# REIE LightBox Auth Contract And API Scope Static Confirmation

Program: `REIE_LIGHTBOX_AUTH_CONTRACT_AND_API_SCOPE_STATIC_CONFIRMATION`

Date: 2026-08-13

Repository: `/Users/davidquinn/david-quinn-group/colorado-real-estate`

Baseline after authorized synchronization: `HEAD = origin/main = 645487b9201ad5764dbada615022e229400274b4`, divergence `0 ahead / 0 behind`, working tree clean.

Status: `LIGHTBOX_AUTH_CONTRACT_AND_API_SCOPE_STATIC_CONFIRMATION_COMPLETE_LOCAL_DOCS_ONLY`

Go / no-go classification: `LIGHTBOX_SUPPORT_CONFIRMATION_REQUIRED`

Authentication classification: `AUTH_CONTRACT_STILL_UNRESOLVED`

Call-accounting classification: `CALL_ACCOUNTING_STILL_PARTIALLY_UNRESOLVED`

Recommended next gate: `READY_FOR_LIGHTBOX_SUPPORT_AUTH_SCOPE_CONFIRMATION`

## Scope Boundary

This confirmation used only repository truth, public/static LightBox documentation, public/static LightBox OpenAPI specifications, and non-executing browser/document inspection attempts. It did not retrieve Keychain credentials, print credentials, enter credentials into any portal or Swagger UI, press Try It / Execute / Send / Test / Run, call `api.lightboxre.com`, retrieve property/location/provider records, create or alter LightBox apps, modify application/runtime code, modify database/schema/Typesense/Vercel/MLS, deploy, or consume trial calls intentionally.

## Workstream 1 Synchronization Result

The existing local documentation commit was pushed unchanged to `origin/main`.

| Check | Result |
| --- | --- |
| Branch | `main` |
| Pre-push `HEAD` | `645487b9201ad5764dbada615022e229400274b4` |
| Pre-push `origin/main` | `af94e8a5107b03989a7787cae663e0b950494843` |
| Pre-push divergence | `0 behind / 1 ahead` |
| Local-ahead commit | `645487b9201ad5764dbada615022e229400274b4` - `Document LightBox actual trial scope review` |
| Expected scope | `docs/CHAT_START.md`; `docs/project-atlas/executive-library/REIE-LIGHTBOX-COLORADO-TRIAL-EVALUATION-PROTOCOL.md`; `docs/project-atlas/executive-library/REIE-LIGHTBOX-2000-CALL-TEST-MATRIX.md`; `docs/project-atlas/executive-library/REIE-LIGHTBOX-ACTUAL-TRIAL-TERMS-AND-APP-SCOPE-REVIEW.md` |
| `git diff --check origin/main...HEAD` | Passed |
| Push result | `origin/main` advanced from `af94e8a5107b03989a7787cae663e0b950494843` to `645487b9201ad5764dbada615022e229400274b4` |
| Post-push canonical baseline | `HEAD = origin/main = 645487b9201ad5764dbada615022e229400274b4` |
| Post-push divergence | `0 ahead / 0 behind` |
| Post-push working tree | Clean |

No deployment or protected-system mutation was performed.

## Established Application Posture

Executive HQ previously established:

| Item | Current established state |
| --- | --- |
| Application | `PROJECT ATLAS - REIE LightBox Evaluation` |
| Application status | Approved |
| Product | `LightBox API's Evaluation` |
| Product status | Approved |
| Credential structure | Key + Secret |
| Credential expiry | 2026-09-03 |
| Keychain services | `PROJECT_ATLAS_LIGHTBOX_TRIAL_KEY`; `PROJECT_ATLAS_LIGHTBOX_TRIAL_SECRET` |
| Day-1 data-call authorization | Not authorized |

This static review does not change rights posture. Trial access remains evaluation-only and is not production/customer-display authority.

## Static Sources Reviewed

| Source | Static finding |
| --- | --- |
| LightBox Developer Portal catalog | Lists Geocoding, Parcels, Addresses, Assessment, Structures, and Zoning in the public API catalog. |
| LightBox Geocoding page | Describes US/Canada geocoding, address standardization, forward/reverse geocoding, and returned related Parcel/Assessment/Structure IDs. |
| LightBox Parcels page | Describes parcel boundaries, ownership, land use, tax, property characteristics, and LightBox IDs. |
| LightBox Addresses page | Describes parcel-linked address intelligence from parcel, assessment, structure, USPS, e911, and local sources. |
| LightBox Assessment page | Describes valuation, tax, ownership, structural details, APN, FIPS, and LightBox IDs. |
| LightBox Structures page | Describes building footprints, height, elevation, and national structure data. |
| LightBox Zoning page | Describes parcel-level zoning districts, setbacks, FAR, building height limits, and related regulations. |
| LightBox API FAQ | States the typical evaluation period is three weeks, evaluation access is to APIs in the catalog, 2,000 requests are allowed, 2xx responses count, and 4xx/5xx responses incur no cost. |
| Public/static OpenAPI YAML | Static specs were inspected from `https://specs-lightboxre-com.s3.amazonaws.com/Prod/*.yaml` for Geocoding, Parcels, Addresses, Assessment, Structures, and Zoning. |

The authenticated portal was not used for app-scope or Analytics confirmation because the available browser surface did not return a reliable readable state and the authorization prohibited credential retrieval unless absolutely necessary. No credentials were retrieved.

## OpenAPI Security Scheme Findings

| API family | Static OpenAPI title/version | Server | Documented security observations |
| --- | --- | --- | --- |
| Geocoding | `LightBox Geocoding API` `1.16.0` | `https://api.lightboxre.com/v1` | The static OpenAPI file exposes `/addresses/_autocomplete`, `/addresses/health`, `/addresses/reverse`, and `/addresses/search`; no `components.securitySchemes` entry was found in the inspected file. Public sample/docs still demonstrate `x-api-key` for geocoding. |
| Parcels | `LightBox Parcels API` `1.11.0` | `https://api.lightboxre.com/v1` | Data paths specify `ApiKeyAuth`; `components.securitySchemes.ApiKeyAuth` is `type: apiKey`, `in: header`, `name: x-api-key`. |
| Addresses | `LightBox Addresses API` `1.13.1` | `https://api.lightboxre.com/v1` | Data and health paths specify `ApiKeyAuth`; `components.securitySchemes.ApiKeyAuth` is `type: apiKey`, `in: header`, `name: x-api-key`. |
| Assessment | `LightBox Assessment API` `1.10.0` | `https://api.lightboxre.com/v1` | Paths specify alternatives `ApiKeyAuth` and `BearerAuth`; `ApiKeyAuth` is `type: apiKey`, `in: header`, `name: x-api-key`; `BearerAuth` is `type: http`, `scheme: Bearer`. No token-exchange endpoint was found in the inspected static spec. |
| Structures | `LightBox Structures API` `1.5.0` | `https://api.lightboxre.com/v1` | Data paths specify `ApiKeyHeaderAuth`; WMS also has `ApiKeyQueryParam`; `ApiKeyHeaderAuth` is `type: apiKey`, `in: header`, `name: 'x-api-key'`. |
| Zoning | `LightBox Zoning API` `1.5.1` | `https://api.lightboxre.com/v1` | Data paths specify `ApiKeyHeaderAuth`; `components.securitySchemes.ApiKeyHeaderAuth` is `type: apiKey`, `in: header`, `name: 'x-api-key'`. |

## Authentication Contract Assessment

Static documentation strongly supports using the Consumer Key/API key as the `x-api-key` header value for documented LightBox data endpoints. Public samples also use only an API key in the `x-api-key` header for geocoding, parcels, and assessment examples.

The exact role of the portal Secret remains unresolved:

- No reviewed static OpenAPI file documented a consumer secret header.
- No reviewed static OpenAPI file documented a signed-request flow.
- No reviewed static OpenAPI file documented an OAuth or token-exchange endpoint that consumes the Secret.
- Assessment includes an alternate `BearerAuth` scheme, but the inspected static spec did not define how a bearer token is obtained.
- The Developer Portal app still reports Key + Secret, so the Secret cannot be assumed dormant for the approved product without LightBox confirmation.

Result: `AUTH_CONTRACT_STILL_UNRESOLVED`.

Future Day-1 calls should not send the Secret to any data endpoint. They should use the Key as `x-api-key` only after LightBox confirms that the approved Evaluation app uses key-only authentication or confirms an exact alternate flow.

## Entitlement Classification

Public catalog and static specs prove that the endpoint families exist and are documented. They do not prove that the approved `PROJECT ATLAS - REIE LightBox Evaluation` app is entitled to each family unless app-specific portal scope, product terms, or LightBox support confirms it.

| API family | Entitlement classification | Rationale |
| --- | --- | --- |
| Geocoding | `LIKELY_INCLUDED_NOT_STATICALLY_PROVEN` | Public catalog and static spec exist; FAQ says evaluation access is to APIs in the catalog; app-specific entitlement was not statically confirmed. |
| Parcels | `LIKELY_INCLUDED_NOT_STATICALLY_PROVEN` | Public catalog and static spec exist; app-specific entitlement was not statically confirmed. |
| Addresses | `LIKELY_INCLUDED_NOT_STATICALLY_PROVEN` | Public catalog and static spec exist; app-specific entitlement was not statically confirmed. |
| Assessment | `LIKELY_INCLUDED_NOT_STATICALLY_PROVEN` | Public catalog and static spec exist; app-specific entitlement was not statically confirmed. |
| Structures | `LIKELY_INCLUDED_NOT_STATICALLY_PROVEN` | Public catalog and static spec exist; app-specific entitlement was not statically confirmed. |
| Zoning | `LIKELY_INCLUDED_NOT_STATICALLY_PROVEN` | Public catalog and static spec exist; Zoning appears as an add-on in some solution pages, so app/product confirmation is especially important before spending calls. |

## Endpoint Families Observed

| API family | Representative static endpoints observed |
| --- | --- |
| Geocoding | `GET /addresses/search`; `GET /addresses/reverse`; `GET /addresses/_autocomplete`; `GET /addresses/health` |
| Parcels | `POST /parcels`; `GET /parcels/{countryCode}/{id}`; `GET /parcels/{countryCode}/geometry`; `GET /parcels/_on/address/us/{id}`; `GET /parcels/_on/assessment/us/{id}`; `GET /parcels/_on/structure/us/{id}`; `GET /parcels/_adjacent/{countryCode}/{id}` |
| Addresses | `GET /addresses/{countryCode}/{id}`; `GET /addresses/{countryCode}/geometry`; `GET /addresses/_on/parcel/us/{id}`; `GET /addresses/_on/assessment/us/{id}`; `GET /addresses/_on/structure/us/{id}` |
| Assessment | `POST /assessments`; `GET /assessments/us/{id}`; `GET /assessments/us/fips/{fips}/apn/{apn}`; `GET /assessments/_on/parcel/us/{id}`; `GET /assessments/us/geometry`; `GET /assessments/ownerportfolio/us/{id}` |
| Structures | `GET /structures/{countryCode}/{id}`; `GET /structures/{countryCode}/geometry`; `GET /structures/address`; `GET /structures/_on/parcel/{countryCode}/{id}`; `GET /structures/_on/address/{countryCode}/{id}`; `GET /structures/{countryCode}/ubid/{ubid}` |
| Zoning | `GET /zoning/address`; `GET /zoning/_on/parcel/{countryCode}/{id}`; `GET /zoning/_on/property/{countryCode}/{id}`; `GET /zoning/_on/site/{countryCode}/{id}` |

Owner-portfolio, WMS/tile, adjacent/common ownership, True Owner/contact, transactions, environmental, school, demographic, and batch endpoints remain outside the Day-1 five-call scope unless separately authorized.

## Schema And Field Observations

| API family | Static field observations relevant to REIE evaluation |
| --- | --- |
| Geocoding | Address labels, parsed address metadata, confidence/precision metadata, representative point, related parcels, structures, assessments, and properties. |
| Parcels | Parcel ID, APN, FIPS/administrative location, owner/tax/derived/transaction/primary-structure references, geometry, land use, property type, legal description, county, and assessment relationship. |
| Addresses | Address ID, address universe joins to parcels/assessments/structures/sites/properties, geometry and tile endpoints, residential/commercial/sub-address context from public product page. |
| Assessment | APN/FIPS, owner, valuation, assessed/market/taxable values, tax history, transaction, primary structure, building area/living area, year built, and related parcel identifiers. |
| Structures | Structure ID, UBID, footprint geometry, height, elevation, footprint area, story count, property class, and relationships to parcel/address/assessment/site/property IDs. |
| Zoning | Jurisdiction, type/category/subcategory, district/code, permitted use, description/summary, setbacks, FAR/density, maximum site coverage, minimum lot area, building height, vintage, ordinance URL, and source metadata. |

These fields are evaluation targets only. They are not approved for production storage, customer display, AI/ML use, redistribution, indexing, or post-trial retention.

## Analytics And Usage

Analytics was not inspected in the authenticated portal. The safe static finding is limited to public FAQ and OpenAPI error contracts:

- FAQ says the typical evaluation is three weeks and allows a maximum of 2,000 requests to endpoints during the evaluation period.
- FAQ says `2xx` responses count as calls.
- FAQ says `4xx` and `5xx` responses incur no cost.
- Static specs include `429` responses for too many requests or exceeded request-lot pool.

Unresolved:

- Whether Swagger Authorize alone affects counters.
- Whether any auth/token request exists and whether it counts.
- Whether each paginated page counts separately.
- Whether one request returning multiple records is always metered as one request rather than per object.
- Analytics freshness, delay, granularity, endpoint-family breakdown, and treatment of Swagger Try It traffic.

Result: `CALL_ACCOUNTING_STILL_PARTIALLY_UNRESOLVED`.

## Support Confirmation Questions

Do not send this message without Executive HQ authorization.

Subject: PROJECT ATLAS LightBox Evaluation app - authentication and scope confirmation

Hi Jack,

For the approved Developer Portal application `PROJECT ATLAS - REIE LightBox Evaluation` using product `LightBox API's Evaluation`, could you confirm the exact authentication and scope before we make any evaluation data calls?

1. For Geocoding, Parcels, Addresses, Assessment, Structures, and Zoning, should requests use only the Consumer Key/API Key in the `x-api-key` header?
2. Does the Consumer Secret have any role for this product, such as token exchange, request signing, OAuth/bearer-token generation, or refresh? If yes, please provide the exact documented flow and whether any auth/token request counts against the 2,000-call evaluation allowance.
3. Does our approved Evaluation app include Geocoding, Parcels, Addresses, Assessment, Structures, and Zoning? If any are excluded or add-on only, please identify which.
4. Is Zoning included in the same 2,000-call evaluation allowance for this app, or does it require separate approval?
5. For call accounting, do `2xx` responses count and `4xx/5xx` responses not count as stated in the FAQ? Does `429` count? Does each paginated request count separately?
6. Does Swagger Try It / Execute traffic count the same as direct API traffic?
7. Where in the portal can we confirm current usage/call count and remaining allowance, and what is the reporting delay?
8. Are there any evaluation restrictions on temporary internal payload inspection, sanitized evidence logs, screenshots, caching, derived notes, AI/ML processing, customer display, or post-trial retention beyond the public trial terms?

We will not include credential values in email or logs.

Thanks.

## Day-1 Recommendation

Do not begin Day-1 first five calls yet.

The public/static record is strong enough to draft the call sequence, credential-handling rules, and evidence ledger shape, but not strong enough to resolve both governing questions:

- `AUTH_CONTRACT_STILL_UNRESOLVED`
- `API_SCOPE_NOT_APP_SPECIFICALLY_CONFIRMED`

The correct next gate is `READY_FOR_LIGHTBOX_SUPPORT_AUTH_SCOPE_CONFIRMATION`.

After LightBox confirms key-only authentication and included endpoint families, Executive HQ can authorize a separate `READY_FOR_LIGHTBOX_DAY_1_FIRST_FIVE_CALLS` session with a hard stop after five successful data calls and immediate Analytics/call-ledger reconciliation.

## Protected-System Confirmation

No provider activation, data calls, Keychain retrieval, credential disclosure, runtime integration, database mutation, schema mutation, Typesense mutation, Vercel mutation, MLS/source mutation, AI/GIS/telemetry/customer-data mutation, push for this Workstream 2 local docs commit, or deployment was performed.
