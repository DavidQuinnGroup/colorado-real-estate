# PROJECT ATLAS(tm)

## EIP Sprint 6 Production Activation And Rollback Runbook

Status: `SPRINT_6_CONTROLLED_PILOT_COMPLETED_ROLLBACK_PLAN_RETAINED`

Authorized subject: `Thornton, Colorado`

Authorized scope: `CONTROLLED_PRODUCTION_INTERNAL_GEOGRAPHIC_PERSISTENCE_PILOT`

---

## 1. Preconditions

Before production execute:

- repository validation must pass;
- deployment must succeed;
- Sprint 6A production runtime packaging correction must be deployed successfully;
- Sprint 6A.1 runtime dependency separation correction must be deployed successfully;
- validation-script runtime dependency on `prisma/migrations` must remain removed from the deployed protected route path;
- production dry run must return `success=true`;
- dry run must return `dryRun=true`;
- dry run must return `executed=false`;
- dry run must return `writesPerformed=0`;
- dry run must propose no more than one `GeographicObject`;
- all eligibility values must be false;
- rollback plan must be available;
- admin authorization must be valid.

---

## 2. Production Dry Run

Use the protected admin route:

```bash
curl --max-time 20 -s "https://davidquinngroup.com/api/admin/enterprise/geographic-persistence-pilot" \
  -X POST \
  -H "content-type: application/json" \
  -H "x-admin-key: $REIE_ADMIN_API_KEY" \
  --data '{"subject":"Thornton, Colorado","scope":"CONTROLLED_PRODUCTION_INTERNAL_GEOGRAPHIC_PERSISTENCE_PILOT","invocationId":"<unique-dry-run-id>"}'
```

Expected:

- `dryRun=true`;
- `executed=false`;
- `writesPerformed=0`;
- `plannedCreates.geographicObjects <= 1`;
- `plannedCreates.aliases <= 2`;
- `plannedCreates.sources <= 1`;
- `plannedCreates.observations <= 6`;
- `plannedCreates.eligibilityRows <= 1`;
- all relationship planned creates are `0`.

---

## 3. Controlled Execute

Execute only after dry run passes:

```bash
curl --max-time 20 -s "https://davidquinngroup.com/api/admin/enterprise/geographic-persistence-pilot" \
  -X POST \
  -H "content-type: application/json" \
  -H "x-admin-key: $REIE_ADMIN_API_KEY" \
  --data '{"subject":"Thornton, Colorado","scope":"CONTROLLED_PRODUCTION_INTERNAL_GEOGRAPHIC_PERSISTENCE_PILOT","invocationId":"<unique-execute-id>","execute":true}'
```

Expected:

- `executed=true`;
- `dryRun=false`;
- created rows do not exceed authorized limits;
- all eligibility values remain false;
- no relationship or property relationship is created.

---

## 4. Inspection

```bash
curl --max-time 20 -s "https://davidquinngroup.com/api/admin/enterprise/geographic-persistence-pilot" \
  -H "x-admin-key: $REIE_ADMIN_API_KEY"
```

Expected:

- pilot row identities are returned;
- eligibility values are false;
- lineage is present;
- relationship row identities are empty;
- property relationship row identities are empty.

---

## 5. Idempotency Execute

Run the controlled execute a second time with a new invocation ID.

Expected:

- created counts are `0`;
- reused counts reflect the existing pilot rows;
- canonical object identity is unchanged;
- no eligibility value becomes true.

---

## 6. Retirement Plan

```bash
curl --max-time 20 -s "https://davidquinngroup.com/api/admin/enterprise/geographic-persistence-pilot?mode=retirement-plan&subject=Thornton%2C%20Colorado&scope=CONTROLLED_PRODUCTION_INTERNAL_GEOGRAPHIC_PERSISTENCE_PILOT" \
  -H "x-admin-key: $REIE_ADMIN_API_KEY"
```

Retirement is not executed by default.

Rollback or retirement must confirm:

- no `PropertyGeographicRelationship` rows exist;
- no runtime consumer imports the pilot;
- no public route exposes the pilot;
- dependent rows are identified before mutation.

If removal is separately authorized, dependency order is:

1. `GeographicObservation`
2. `GeographicAlias`
3. `GeographicEligibility`
4. `GeographicSource` if unused
5. `GeographicObject`

Preferred non-destructive retirement is setting lifecycle to `ARCHIVED` under separate rollback authorization.

---

## 7. Prohibited Actions

Do not:

- create another geographic object;
- create Colorado as a `STATE` object;
- create property relationships;
- activate search or maps;
- create public pages;
- activate SEO or indexing;
- enable analytics or AI consumption;
- send email;
- mutate saved-search alert rows;
- execute MLS sync.

---

## 8. Final Production Evidence

Historical deployment blockers were resolved before execute:

- route hardening commit `d50f3a815dd7f340d1f5db5caa3153ee4c9feb73` deployed successfully with Vercel status ID `51090536652`;
- Sprint 6A packaging correction commit `a8f09faf2e9011d78b995359b11e97bdbc80f79d` deployed successfully with Vercel status ID `51090831312`;
- Sprint 6A.1 runtime dependency separation implementation commit `3a2874a6d936c81c3f5f4c5e1e6440d536065c39` deployed successfully with Vercel status ID `51091139012`;
- Sprint 6A.1 final documentation deployment completed successfully with Vercel status ID `51091203542`;
- Sprint 6A.1 is certified and closed as `EIP_1.0_SPRINT_6A_1_RUNTIME_DEPENDENCY_SEPARATION_CORRECTION_CERTIFIED_AND_CLOSED`.

Successful dry run:

- invocation ID: `EIP-S6-DRY-20260725-005`;
- HTTP `200`;
- `success=true`;
- `dryRun=true`;
- `executed=false`;
- `writesPerformed=0`;
- planned creates: `GeographicObject=1`, aliases `2`, sources `1`, observations `6`, eligibility rows `1`, `GeographicRelationship=0`, `PropertyGeographicRelationship=0`;
- all eligibility and activation flags false;
- approval lineage valid;
- rollback plan available;
- stopConditions: `[]`.

Successful controlled execute:

- invocation ID: `EIP-S6-EXEC-20260725-001`;
- HTTP `200`;
- `success=true`;
- `dryRun=false`;
- `executed=true`;
- `writesPerformed=11`;
- created: `GeographicObject=1`, aliases `2`, sources `1`, observations `6`, eligibility rows `1`, `GeographicRelationship=0`, `PropertyGeographicRelationship=0`;
- all eligibility and activation flags false;
- approval lineage present;
- rollback plan present;
- stopConditions: `[]`.

Successful inspection:

- HTTP `200`;
- `success=true`;
- mode `inspection`;
- `executed=false`;
- `writesPerformed=0`;
- canonical object ID: `cms10utak0002qa0l8mu7gr8i`;
- reused: `GeographicObject=1`, aliases `2`, sources `1`, observations `6`, eligibility rows `1`;
- relationships and property relationships remain `0`;
- all eligibility and activation flags false;
- approval and governance lineage intact;
- rollback plan present;
- stopConditions: `[]`.

Successful idempotency execute:

- invocation ID: `EIP-S6-IDEMPOTENCY-20260725-001`;
- HTTP `200`;
- `success=true`;
- `executed=true`;
- `writesPerformed=0`;
- created counts all `0`;
- canonical object ID unchanged: `cms10utak0002qa0l8mu7gr8i`;
- reused: `GeographicObject=1`, aliases `2`, sources `1`, observations `6`, eligibility rows `1`;
- relationships and property relationships remain `0`;
- all eligibility and activation flags false;
- stopConditions: `[]`.

Final determination:

- Sprint 6 is certified and closed as `EIP_1.0_SPRINT_6_CONTROLLED_PRODUCTION_INTERNAL_GEOGRAPHIC_PERSISTENCE_PILOT_CERTIFIED_AND_CLOSED`.
- Controlled execute is complete for the single authorized Thornton pilot object only.
- Any rollback, retirement, second object, public activation, Sprint 7 work, search integration, map integration, property assignment, SEO, indexing, analytics, AI, vendor, MLS, alert, CRM, email, or customer behavior change requires separate authorization.
