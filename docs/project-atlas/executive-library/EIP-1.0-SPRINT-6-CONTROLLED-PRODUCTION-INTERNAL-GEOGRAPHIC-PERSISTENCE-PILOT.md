# PROJECT ATLAS(tm)

## Enterprise Implementation Program(tm) - Sprint 6

### Controlled Production-Internal Geographic Persistence Pilot(tm)

Status: `EIP_1.0_SPRINT_6_CONTROLLED_PRODUCTION_INTERNAL_GEOGRAPHIC_PERSISTENCE_PILOT_BLOCKED_AT_AUTHENTICATED_DRY_RUN_RETRY`

Implementation date: July 25, 2026

Repository baseline: `a079721a6ad2b610d3ec86791368e739ea7774ce`

Authorized subject: `Thornton, Colorado`

Production persistence status: `AUTHORIZED_FOR_ONE_INTERNAL_PILOT_OBJECT_ONLY`

Runtime activation status: `NOT_AUTHORIZED`

Customer visibility status: `ZERO`

---

## 1. Executive Summary

Sprint 6 implements the first controlled production-internal GIO persistence pilot under EIP 1.0.

The pilot is limited to one approved municipality subject, `Thornton, Colorado`, and only the minimum governed evidence required to prove safe internal persistence, retrieval, idempotency, lineage, and rollback planning.

No customer-facing activation is authorized. The pilot creates no property relationship, no search integration, no map integration, no public page, no SEO activation, no indexing, no analytics consumption, and no AI consumption.

Certification recommendation will be recorded after deployment, production dry run, controlled execute, inspection, idempotency, public runtime smoke, and final documentation are complete.

Current stop point:

- implementation commit `84989669d62e9d18a6b86534155f957b5f4ad8fe` was pushed and deployed successfully;
- first authenticated production dry-run and inspection attempts returned HTTP `500` before any write was executed;
- local dry-run reproduction against the configured production database succeeded with zero writes and the expected one-object plan;
- route hardening commit `d50f3a815dd7f340d1f5db5caa3153ee4c9feb73` was pushed to make runtime/module failures catchable as JSON;
- Vercel status `51090536652` for `d50f3a815dd7f340d1f5db5caa3153ee4c9feb73` completed successfully;
- retried production dry run `EIP-S6-DRY-20260725-002` returned HTTP `500` with JSON error `ENOENT: no such file or directory, open 'prisma/schema.prisma'`;
- Sprint 6A route-scoped Prisma schema packaging correction was implemented, validated, pushed, and deployed successfully;
- production dry run `EIP-S6-DRY-20260725-003` returned HTTP `500` with new error `ENOENT: no such file or directory, scandir 'prisma/migrations'`;
- Sprint 6A.1 runtime dependency separation correction has been implemented locally to remove the validation-script dependency from the protected route graph;
- focused validation confirms the protected route dependency graph no longer reads `prisma/schema.prisma` or scans `prisma/migrations`;
- Sprint 6A.1 commit `3a2874a6d936c81c3f5f4c5e1e6440d536065c39` deployed successfully with Vercel status ID `51091139012`;
- production dry-run retry `EIP-S6-DRY-20260725-004` returned HTTP `401` at the admin auth gate, so dry-run execution was not reached;
- production execute remains paused.

---

## 2. Authorized Subject

Subject:

- `Thornton, Colorado`

Repository evidence confirms:

- Sprint 1 internal ID: `EIP_INTERNAL_GEO_PERSISTENCE|SPRINT_1|001`;
- object type: `MUNICIPALITY`;
- canonical identity: `Thornton`;
- display identity: `Thornton, Colorado`;
- canonical production slug: `thornton-colorado`;
- Sprint 3 quality status: `READY`;
- Sprint 4 readiness evidence exists for `PRODUCTION_INTERNAL_ONLY_PERSISTENCE`;
- Sprint 5 bounded next-step approval exists for the high-quality Thornton case;
- no customer activation authorization exists.

No substitute subject is authorized.

---

## 3. Repository Preflight

Verified before implementation:

- branch: `main`;
- starting HEAD: `a079721a6ad2b610d3ec86791368e739ea7774ce`;
- origin/main parity: verified;
- working tree: clean;
- relevant Prisma models exist: `GeographicObject`, `GeographicAlias`, `GeographicRelationship`, `GeographicSource`, `GeographicObservation`, `GeographicEligibility`, `PropertyGeographicRelationship`;
- relevant migration exists: `20260725143000_gio_wave3_additive_persistence_foundation`;
- existing GIO safety script exists: `npm run check:geographic-intelligence-object-safety`;
- existing admin auth boundary exists: `authorizeRepositoryAdminRequest`;
- accepted auth headers remain `x-admin-key` and `Authorization: Bearer <key>`.

---

## 4. Database Baseline

Read-only production inspection before implementation writes:

| Table | Baseline count |
| --- | ---: |
| `GeographicObject` | 0 |
| `GeographicAlias` | 0 |
| `GeographicRelationship` | 0 |
| `GeographicSource` | 0 |
| `GeographicObservation` | 0 |
| `GeographicEligibility` | 0 |
| `PropertyGeographicRelationship` | 0 |

Thornton collision check:

- no existing Thornton GIO object found.

Migration status:

- `npx prisma migrate status` reports `Database schema is up to date!`

---

## 5. Recovery Verification

Recovery evidence recorded for this governed pilot:

- Supabase project: `davidquinn-leads`;
- Project ID: `otmkoqvmhthitldlnjdk`;
- plan: Supabase Pro;
- scheduled backups: enabled;
- restore capability: available through Supabase Dashboard;
- PITR: not required for this bounded pilot;
- latest previously verified backup: `2026-07-25 09:49:14 UTC`;
- no unresolved migration failure detected by Prisma migration status.

Rollback plan:

- inspect pilot rows;
- confirm zero property relationships;
- confirm no runtime consumer imports the pilot;
- retire by setting lifecycle to archived only under separate rollback authorization, or remove rows in dependency order if executive rollback requires deletion;
- dependency order: observations, aliases, eligibility, source if unused, object.

---

## 6. Implementation

Implemented module:

- `lib/eip/controlledProductionInternalGeographicPersistencePilot.ts`

Implemented protected admin route:

- `app/api/admin/enterprise/geographic-persistence-pilot/route.ts`

Implemented validation:

- `scripts/checkEipSprint6ControlledProductionInternalGeographicPersistencePilot.ts`
- `npm run check:eip-sprint-6-controlled-production-internal-geographic-persistence-pilot`

The implementation supports:

- dry run;
- execute;
- inspection;
- idempotency execute;
- retirement plan.

The route is protected by the existing admin auth boundary and is under `/api/admin`.

---

## 7. Planned Production Rows

Planned maximum rows:

| Table | Planned create maximum |
| --- | ---: |
| `GeographicObject` | 1 |
| `GeographicAlias` | 2 |
| `GeographicSource` | 1 |
| `GeographicObservation` | 6 |
| `GeographicEligibility` | 1 |
| `GeographicRelationship` | 0 |
| `PropertyGeographicRelationship` | 0 |

Planned object state:

- object type: `MUNICIPALITY`;
- lifecycle status: `DRAFT`;
- visibility: `INTERNAL_ONLY`;
- eligibility flags: all false.

Planned aliases:

- `Thornton`;
- `City of Thornton`.

Planned observations:

- canonical municipality name;
- municipality classification;
- state association;
- approved internal identity assertion;
- approval lineage;
- runtime isolation assertion.

---

## 8. Production Dry Run Evidence

Local pre-execute dry-run reproduction against the configured production database:

- invocation ID: `EIP-S6-LOCAL-DRY-20260725-001`;
- success: true;
- mode: `dry-run`;
- writes performed: 0;
- planned creates: `GeographicObject` 1, `GeographicAlias` 2, `GeographicSource` 1, `GeographicObservation` 6, `GeographicEligibility` 1, `GeographicRelationship` 0, `PropertyGeographicRelationship` 0;
- stop conditions: none.

Production route dry-run attempt:

- commit deployed at time of attempt: `84989669d62e9d18a6b86534155f957b5f4ad8fe`;
- Vercel status ID: `51090439735`;
- status: `success`;
- invocation ID: `EIP-S6-DRY-20260725-001`;
- result: HTTP `500`;
- response surface: generic Next.js 500 HTML;
- writes performed: 0;
- execute attempted: no.

Route hardening response:

- correction commit: `d50f3a815dd7f340d1f5db5caa3153ee4c9feb73`;
- purpose: move Prisma and Sprint 6 pilot module loading inside guarded route handlers so deployed runtime failures can be returned as JSON instead of generic HTML;
- validation before push: Sprint 6 focused check, typecheck, lint, production build;
- push status: pushed to `origin/main`;
- Vercel status ID: `51090536652`;
- current status: `success`;
- production dry run after correction: HTTP `500`;
- returned error: `ENOENT: no such file or directory, open 'prisma/schema.prisma'`;
- interpretation: deployed route/runtime cannot load the Prisma schema artifact required by the current production package;
- production execute attempted: no;
- production writes performed: 0.

Sprint 6A packaging correction:

- implemented correction package: `EIP_1.0_SPRINT_6A_PRODUCTION_RUNTIME_PACKAGING_CORRECTION`;
- correction file: `next.config.ts`;
- correction pattern: route-scoped `outputFileTracingIncludes` for `/api/admin/enterprise/geographic-persistence-pilot`;
- included asset: `./prisma/schema.prisma`;
- validation command: `npm run check:eip-sprint-6a-production-runtime-packaging-correction`;
- local validation result: passed;
- deployment commit: `a8f09faf2e9011d78b995359b11e97bdbc80f79d`;

Sprint 6A.1 runtime dependency separation correction:

- correction package: `EIP_1.0_SPRINT_6A_1_RUNTIME_DEPENDENCY_SEPARATION_CORRECTION`;
- root cause: `lib/gma/internalMappingReviewQueue.ts` imported `scripts/checkGmaReadOnlyMappingPreview.js`, which scanned `prisma/migrations` at module load;
- correction file: `lib/gma/readOnlyMappingPreviewFixtures.ts`;
- updated runtime consumer: `lib/gma/internalMappingReviewQueue.ts`;
- updated validation script: `scripts/checkGmaReadOnlyMappingPreview.ts`;
- validation command: `npm run check:eip-sprint-6a-runtime-dependency-separation`;
- local focused validation result: passed;
- production execute attempted: no;
- production GIO writes performed: `0`;
- deployment commit: `3a2874a6d936c81c3f5f4c5e1e6440d536065c39`;
- Vercel status ID: `51091139012`;
- deployment status: success;
- dry-run retry invocation ID: `EIP-S6-DRY-20260725-004`;
- dry-run retry status: HTTP `401` unauthorized;
- dry-run execution reached: no;
- next required action: retry dry run with a valid admin credential in the execution environment.
- Vercel status ID: `51090831312`;
- deployment status: success;
- production dry-run retry: `EIP-S6-DRY-20260725-003`;
- production dry-run result: HTTP `500`, `ENOENT: no such file or directory, scandir 'prisma/migrations'`;
- execute attempted: no;
- production GIO writes performed: 0;
- new blocker: validation-script runtime dependency reaches the protected admin route and scans `prisma/migrations`;
- schema or migration change: none;
- runtime/customer behavior change: none;
- next production dry run requires a separately authorized runtime dependency separation correction.

---

## 9. Controlled Execute Evidence

Paused. No controlled execute was run because production dry run did not complete successfully.

---

## 10. Inspection Evidence

Authenticated production inspection before execute returned HTTP `500` against commit `84989669d62e9d18a6b86534155f957b5f4ad8fe`.

No production GIO write was executed before or after this inspection failure.

---

## 11. Idempotency Evidence

Paused. Idempotency execute requires successful dry run, controlled execute, and inspection.

---

## 12. Public Runtime Smoke Evidence

Paused. Public runtime smoke must run after successful idempotency validation.

---

## 13. Lineage

The production pilot is traceable to:

- Sprint 3 quality assessment;
- Sprint 4 readiness-ledger entry;
- Sprint 5 approval request;
- Sprint 5 executive review packet;
- Sprint 5 approval decision;
- Sprint 6 implementation authorization;
- source and trust evidence;
- implementation invocation ID.

Schema limitation:

- The current GIO schema does not have dedicated approval-reference columns.
- Supported lineage is stored in internal `GeographicObservation.valueJson` and preserved in this governed implementation record.
- No schema expansion or migration was introduced.

---

## 14. Executive Value Statement

Safely persisting approved knowledge internally before exposing it to customers improves trust because the organization can validate identity, evidence, lineage, rollback, and operational controls before a claim reaches search, maps, pages, property intelligence, or AI assistance.

It improves product quality by separating governed knowledge readiness from customer presentation. It improves operational control by making persistence, inspection, idempotency, and rollback explicit. It improves long-term enterprise value by proving that approved knowledge can become durable infrastructure without prematurely becoming public product behavior.

---

## 15. Certification Recommendation

Certification is not recommended yet.

Required remaining gates:

- Vercel success for route hardening commit `d50f3a815dd7f340d1f5db5caa3153ee4c9feb73`;
- validation-script runtime dependency on `prisma/migrations` is removed from the deployed protected route path;
- production dry run returns success with zero writes;
- controlled execute persists or reuses only the authorized Thornton pilot rows;
- inspection verifies internal-only state and zero relationships;
- idempotency execute creates zero duplicate rows;
- public runtime smoke passes;
- final documentation and Google Doc governance are updated with executed evidence.
