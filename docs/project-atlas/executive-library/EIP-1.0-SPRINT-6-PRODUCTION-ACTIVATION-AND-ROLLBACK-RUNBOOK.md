# PROJECT ATLAS(tm)

## EIP Sprint 6 Production Activation And Rollback Runbook

Status: `ACTIVE_FOR_SPRINT_6_CONTROLLED_PILOT`

Authorized subject: `Thornton, Colorado`

Authorized scope: `CONTROLLED_PRODUCTION_INTERNAL_GEOGRAPHIC_PERSISTENCE_PILOT`

---

## 1. Preconditions

Before production execute:

- repository validation must pass;
- deployment must succeed;
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

## 8. Current Stop Condition

Current stop condition:

- deployed route returned HTTP `500` for authenticated dry-run and inspection attempts against commit `84989669d62e9d18a6b86534155f957b5f4ad8fe`;
- no execute was run;
- no production GIO write was performed;
- route hardening commit `d50f3a815dd7f340d1f5db5caa3153ee4c9feb73` deployed successfully with Vercel status ID `51090536652`;
- retried production dry run `EIP-S6-DRY-20260725-002` returned HTTP `500` with JSON error `ENOENT: no such file or directory, open 'prisma/schema.prisma'`;
- next retry is blocked until deployed Prisma schema packaging/configuration is corrected.
