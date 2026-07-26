# PROJECT ATLAS(tm)

## EIP Sprint 7 Production Read Adapter Runbook

Status: `ACTIVE_FOR_SPRINT_7_PRODUCTION_INTERNAL_READ_VALIDATION`

Authorized subject: `Thornton, Colorado`

Certified object ID: `cms10utak0002qa0l8mu7gr8i`

Protected route:

- `/api/admin/enterprise/geographic-read-adapter`

---

## 1. Preconditions

Before authenticated production read validation:

- Sprint 6 certified and closed;
- Sprint 6A.1 certified and closed;
- Sprint 7 deployment succeeds;
- `npm run check:eip-sprint-7-production-internal-geographic-read-adapter` passes;
- admin authorization is available;
- no controlled execute is run;
- no production writes are run.

---

## 2. Object ID Read

```bash
curl --max-time 30 -s -w '\nHTTP_STATUS:%{http_code}\n' 'https://davidquinngroup.com/api/admin/enterprise/geographic-read-adapter?mode=object-id&objectId=cms10utak0002qa0l8mu7gr8i&requestId=EIP-S7-READ-20260725-001' \
  -H "Authorization: Bearer $ADMIN_KEY"
```

Expected:

- HTTP `200`;
- `success=true`;
- `mode=read`;
- `executed=false`;
- `writesPerformed=0`;
- `status=HEALTHY`;
- certified object ID returned;
- exact certified counts returned;
- all eligibility and activation flags false;
- no stop conditions or blocking failures.

---

## 3. Canonical Name Read

```bash
curl --max-time 30 -s -w '\nHTTP_STATUS:%{http_code}\n' 'https://davidquinngroup.com/api/admin/enterprise/geographic-read-adapter?mode=canonical-name&canonicalName=Thornton&requestId=EIP-S7-CANONICAL-READ-20260725-001' \
  -H "Authorization: Bearer $ADMIN_KEY"
```

Expected:

- resolves to `cms10utak0002qa0l8mu7gr8i`;
- exact certified counts;
- status `HEALTHY`;
- writes `0`.

---

## 4. Alias Read

```bash
curl --max-time 30 -s -w '\nHTTP_STATUS:%{http_code}\n' 'https://davidquinngroup.com/api/admin/enterprise/geographic-read-adapter?mode=alias&alias=City%20of%20Thornton&requestId=EIP-S7-ALIAS-READ-20260725-001' \
  -H "Authorization: Bearer $ADMIN_KEY"
```

Expected:

- resolves to `cms10utak0002qa0l8mu7gr8i`;
- exact certified counts;
- status `HEALTHY`;
- writes `0`.

---

## 5. Repeatability Read

Run the object ID read again with:

- `EIP-S7-READ-20260725-002`

Expected:

- identity, counts, governance state, eligibility, relationships, and health remain stable;
- only retrieval timestamp and request ID differ;
- writes remain `0`.

---

## 6. Unauthorized Access Proof

```bash
curl --max-time 30 -s -w '\nHTTP_STATUS:%{http_code}\n' 'https://davidquinngroup.com/api/admin/enterprise/geographic-read-adapter?mode=object-id&objectId=cms10utak0002qa0l8mu7gr8i&requestId=EIP-S7-UNAUTH-READ-20260725-001'
```

Expected:

- HTTP `401`;
- `success=false`;
- no certified object payload returned.

---

## 7. Prohibited Actions

Do not:

- run Sprint 6 controlled execute again;
- create, update, upsert, delete, archive, retire, or supersede GIO rows;
- create additional objects;
- create property relationships;
- expose broad GIO enumeration;
- activate search, maps, property pages, SEO, indexing, analytics, AI, vendors, MLS, alerts, CRM, email, or customer behavior.

---

## 8. Stop Conditions

Stop immediately if:

- HTTP is not `200` for authenticated reads;
- unauthorized access exposes data;
- more than one object is returned;
- object ID differs from `cms10utak0002qa0l8mu7gr8i`;
- counts differ from certified state;
- any relationship exists;
- any eligibility or activation flag is true;
- any write is required or reported;
- public runtime changes.

<!-- /Users/davidquinn/david-quinn-group/colorado-real-estate/docs/project-atlas/executive-library/EIP-1.0-SPRINT-7-PRODUCTION-READ-ADAPTER-RUNBOOK.md -->
