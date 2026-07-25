# PROJECT ATLAS(tm)

## Enterprise Implementation Program(tm) - Sprint 6A Charter

### Production Runtime Packaging Correction(tm)

Status: `AUTHORIZED_FOR_CORRECTION_AND_VALIDATION`

Charter date: July 25, 2026

Repository baseline: `c1ae3c841d714012145d348cc130143ca6159da1`

Parent sprint: `EIP_1.0_SPRINT_6_CONTROLLED_PRODUCTION_INTERNAL_GEOGRAPHIC_PERSISTENCE_PILOT`

---

## 1. Executive Authorization

Sprint 6A is authorized as a narrow production runtime packaging correction after Sprint 6 stopped at the deployed production dry-run gate.

The previous Sprint 6 dry-run attempt `EIP-S6-DRY-20260725-002` returned:

- HTTP status: `500`;
- JSON error: `ENOENT: no such file or directory, open 'prisma/schema.prisma'`;
- execute attempted: no;
- production GIO write performed: no.

Sprint 6A does not authorize any new geographic scope, runtime integration, public route, search integration, map integration, property relationship, customer activation, vendor integration, schema migration, or production GIO write.

---

## 2. Objective

Correct the deployed production package so the protected Sprint 6 admin route can execute the production dry-run path without failing on missing Prisma schema packaging.

The correction must preserve:

- `Thornton, Colorado` as the only authorized subject;
- one `GeographicObject` maximum;
- all eligibility flags false;
- zero `GeographicRelationship` rows;
- zero `PropertyGeographicRelationship` rows;
- admin-only access;
- zero customer visibility;
- zero runtime consumption.

---

## 3. Required Boundaries

Sprint 6A must not:

- create, update, or delete production GIO data;
- run Sprint 6 controlled execute before a successful deployed dry run;
- change Prisma schema or migrations;
- weaken Prisma validation, client parity, or production dependency checks;
- expose repository files through a public path;
- add public APIs;
- change search, maps, property pages, SEO, alerts, CRM, MLS, email, analytics, AI, or customer behavior.

---

## 4. Authorized Correction Pattern

Preferred correction is to remove any application-level runtime dependency on `prisma/schema.prisma`.

Investigation determined the Sprint 6 route and pilot module do not read `schema.prisma`. The deployed failure originates from Prisma Client's node runtime packaging requirement for the generated client schema artifact.

Therefore the authorized correction is a route-scoped Next.js output file tracing include:

- route: `/api/admin/enterprise/geographic-persistence-pilot`;
- included asset: `./prisma/schema.prisma`;
- no broad Prisma directory include;
- no broad repository include.

This is a targeted packaging correction for an internal admin route, not a runtime schema-inspection pattern.

---

## 5. Validation Requirements

Sprint 6A validation must prove:

- no application route or Sprint 6 pilot module reads `schema.prisma`;
- the package include is route-scoped;
- the dry-run planner can construct with schema-file reads blocked;
- dry run remains zero mutation;
- execute remains disabled until successful deployed dry-run evidence exists;
- write limits remain unchanged;
- eligibility remains all false;
- no public runtime consumer imports or references the pilot;
- no schema or migration change is introduced;
- Prisma validation, client parity, runtime safety, search safety, public runtime safety, and Sprint 1-6 checks continue to pass.

---

## 6. Stop Conditions

Stop if:

- a schema or migration change is required;
- a broad repository file-copy pattern is required;
- the route exposes file contents;
- dry run proposes unauthorized writes;
- eligibility becomes true;
- relationships are proposed;
- customer behavior changes;
- the deployed dry run still fails;
- authorization cannot be verified.

---

## 7. Certification Gate

Sprint 6A may be recommended for certification only after:

- implementation is committed and pushed;
- deployment succeeds;
- production dry run `EIP-S6-DRY-20260725-003` returns HTTP `200`;
- dry-run response reports `success=true`, `dryRun=true`, `executed=false`, and `writesPerformed=0`;
- planned row counts remain within Sprint 6 limits;
- rollback plan is present;
- documentation and Google Doc governance records are updated and read back.
