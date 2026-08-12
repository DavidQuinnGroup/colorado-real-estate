# REIE Replacement Typesense Production Cutover Certification

Program: `REIE_REPLACEMENT_TYPESENSE_PRODUCTION_CUTOVER_CERTIFICATION`

Date: 2026-08-12

Repository: `/Users/davidquinn/david-quinn-group/colorado-real-estate`

Branch: `main`

## 1. Status

`REPLACEMENT_TYPESENSE_PRODUCTION_CUTOVER_CERTIFIED`

Production Search is now using the certified replacement Typesense provider through production-scoped Vercel environment variables and a non-admin search-only runtime API key.

The cutover used the previously certified replacement index and did not run a full reindex, reset collections, delete collections, recreate collections, mutate Prisma/database state, alter schemas, change Search code, or activate MLS/CRM/email/alert/queue/customer-state systems.

## 2. Canonical Baseline

Pre-cutover repository state:

- Branch: `main`
- `HEAD`: `178202befcdae46e654cd620dc12c7150f94d34f`
- `origin/main`: `178202befcdae46e654cd620dc12c7150f94d34f`
- Divergence: `0 ahead / 0 behind`
- Working tree: clean
- Prior certification record: `docs/project-atlas/executive-library/REIE-FULL-REPLACEMENT-TYPESENSE-REINDEX-AND-ISOLATED-INDEX-CERTIFICATION.md`

## 3. Search-Only Credential Gate

The production runtime credential was resolved from the exact approved macOS Keychain service and classified without printing, persisting, or returning any secret value.

Result:

- Search-only credential: present and nonempty
- Admin/bootstrap credential: present and nonempty
- Runtime credential distinct from admin credential: confirmed
- Search permission: allowed against `listings` document search
- Admin metadata permission with runtime key: denied with expected unauthorized/forbidden response
- Classification: `SEARCH_ONLY_CREDENTIAL_CONFIRMED`

The admin/bootstrap key was not provisioned to Vercel as the runtime Search key.

## 4. Pre-Cutover Replacement Provider Health

Read-only replacement-provider validation passed before Vercel mutation:

- Provider `/health`: HTTP `200`
- `properties` collection: `15282` documents
- `listings` collection: `15282` documents
- Both canonical collections: 32 fields
- Both canonical collections: 23 facets
- Both canonical collections: 16 sortable fields
- Both canonical collections: default sort `price`
- `npm run typesense:collections:check`: passed

No reindex, reset, collection deletion, collection creation, or schema mutation was performed during this cutover.

## 5. Vercel Environment Cutover

Vercel project:

- Project id: `prj_Ry5WCDfamYUq1oO7t1CwCVwTvh4G`
- Project name: `david-quinn-group-8rde`
- Team id: `team_53Do8TFrDJHK8AJsziDVZyRQ`
- Production branch: `main`

Production env change:

- `TYPESENSE_HOST`: production-scoped encrypted record created
- `TYPESENSE_PORT`: production-scoped encrypted record created
- `TYPESENSE_PROTOCOL`: production-scoped encrypted record created
- `TYPESENSE_API_KEY`: production-scoped encrypted record created with the search-only runtime key

The prior all-target records were retained for development and preview only:

- `TYPESENSE_HOST`: development, preview
- `TYPESENSE_PORT`: development, preview
- `TYPESENSE_PROTOCOL`: development, preview
- `TYPESENSE_API_KEY`: development, preview

This avoided modifying the effective development or preview environment while changing the production runtime Search configuration.

Rollback posture:

- Previously effective Vercel env values were read into process memory before mutation.
- A partial first attempt stopped before deployment when the production create response shape was not parsed; the single partial production override was removed and the original all-target shape was restored before retry.
- The successful cutover script retained automatic pre-certification rollback capability.
- No rollback was required after the successful deployment and production certification.

No Vercel secret value, Typesense endpoint value, API key value, prefix, suffix, or hash is recorded here.

## 6. Production Deployment

Because Vercel environment changes apply to future deployments, a production redeployment was executed through the Vercel REST API after the production-scoped env values were in place.

Deployment result:

- Deployment uid: `dpl_3t7cUVMYrvhUsfKwJDejwMbDCJux`
- State: `READY`
- Target: `production`
- Git commit: `178202befcdae46e654cd620dc12c7150f94d34f`
- Git ref: `main`
- Cutover deployment marker: `replacement-30-2-search-only`

The deployment used the existing `main` source state. No runtime code commit was created to trigger deployment.

## 7. Production Search API Certification

Production domain Search API checks passed after deployment.

Requests:

- `https://davidquinngroup.com/api/search?limit=5`
- `https://davidquinngroup.com/api/search?query=Denver&limit=5`
- `https://davidquinngroup.com/api/search?city=Denver&limit=5`

Observed results:

- HTTP status: `200` for all requests
- `source`: `typesense` for all requests
- `health`: `healthy` for all requests
- `meta.typesense.collection`: `listings`
- `meta.smoke.ready`: `true`
- `meta.smoke.blockers`: empty
- `meta.customerExperience.usable`: `true`
- `meta.customerExperience.providerFallbackActive`: `false`
- Default/representative active public inventory stayed visible
- Returned/mapped results were nonzero for all requests

Representative counts:

- Default public active search: found `1287`, returned `5`, mapped `5`
- Denver text search: found `560`, returned `5`, mapped `5`
- Denver city filter: found `151`, returned `5`, mapped `5`

## 8. Production Browser Certification

Browser-level production certification used an isolated headless Chrome/CDP session against:

- `https://davidquinngroup.com/search?query=Denver`

Desktop viewport:

- Viewport: `1440x1000`
- Page title: `Guided Colorado Property Search | David Quinn Group`
- Production route normalized to `/search?q=Denver`
- Visible listing/property content present
- Visible Leaflet map present
- Map bounds: approximately `932x888`
- No horizontal overflow
- No console errors
- No page exceptions
- Observed `/api/search?q=Denver&limit=250`: HTTP `200`
- Browser-side API verification: `source=typesense`, `health=healthy`, `found=560`, `returned=5`, `mapped=5`, `providerFallbackActive=false`, `smokeReady=true`, `collection=listings`

Mobile viewport:

- Viewport: `390x844`
- List state showed visible listing/property content before map-tab activation
- `MAP` control activation showed the mobile map
- Visible Leaflet map bounds after activation: approximately `390x731`
- Priced/home-count map markers rendered
- No horizontal overflow
- No console errors
- No page exceptions
- Observed `/api/search?q=Denver&limit=250`: HTTP `200`
- Browser-side API verification: `source=typesense`, `health=healthy`, `found=560`, `returned=5`, `mapped=5`, `providerFallbackActive=false`, `smokeReady=true`, `collection=listings`

## 9. Protected Boundaries

Not performed:

- Typesense full reindex.
- Typesense reset, collection deletion, collection recreation, alias swap, or manual schema mutation.
- Search API/source-code/ranking/filter/sort/cache behavior change.
- Prisma schema or migration change.
- Database mutation.
- MLS/source ingestion change.
- CRM mutation.
- Email or alert send.
- Worker, queue, scheduler, or customer-state activation.
- AI/GIS/provider expansion.
- Telemetry or hidden persistence addition.
- Use of admin/bootstrap key as runtime Search credential.
- Exposure of any secret value or endpoint value.

## 10. Validation Results

Executed:

- `git fetch origin main`
- `git status --short --branch --untracked-files=all`
- `git rev-parse HEAD origin/main`
- `git rev-list --left-right --count HEAD...origin/main`
- `git log -4 --oneline`
- Search-only credential permission probe
- Replacement provider pre-cutover health and collection count probe
- `npm run typesense:collections:check`
- Vercel decrypted env rollback prerequisite check
- Vercel env metadata targeting check
- Vercel production-only Typesense env cutover with rollback guard
- Vercel production deployment creation and polling
- Post-cutover Vercel env/deployment metadata read
- Production Search API certification
- Production browser certification with isolated Chrome/CDP

## 11. Files Changed

Documentation-only closure files:

- `docs/CHAT_START.md`
- `docs/project-atlas/executive-library/REIE-REPLACEMENT-TYPESENSE-PRODUCTION-CUTOVER-CERTIFICATION.md`

## 12. Secret-Safety Confirmation

No Typesense host, endpoint, API key, credential value, partial value, value prefix, value suffix, value hash, Vercel secret value, database secret, document ID, address, or customer record was printed, persisted, documented, committed, or returned.

The search-only runtime API key was provisioned to Vercel Production only as an encrypted environment variable. The admin/bootstrap key remains excluded from customer runtime Search.

## 13. Cleanup Confirmation

`TYPESENSE_DIAGNOSTIC_VALUES_UNSET=true`

Temporary operational scripts were kept outside the repository in `/private/tmp` and are not part of the committed artifact.

## 14. Closure Classification

`REPLACEMENT_TYPESENSE_PRODUCTION_CUTOVER_CERTIFIED_AND_CLOSED`

Production Search is connected to the certified replacement Typesense provider on the production domain with healthy Search API metadata, browser-rendered Search/map behavior, and search-only runtime credential separation.

Future Typesense reindexing, schema changes, collection resets, provider changes, runtime behavior changes, or broader operational activation require separate Executive HQ authorization.
