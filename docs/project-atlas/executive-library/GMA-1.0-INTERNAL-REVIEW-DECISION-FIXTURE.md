# PROJECT ATLAS(tm)

## Geographic Mapping Architecture(tm) - GMA 1.0

### Internal Review Decision Fixture(tm)

Status: `GMA_1.0_INTERNAL_REVIEW_DECISION_FIXTURE_CERTIFIED_AND_CLOSED`

Implementation date: July 25, 2026

Repository baseline: `13945d9807d9458ebc94209e20a56aa40513e4a0`

Implementation scope: deterministic fixture-level human-review decisions only

Final non-persistence GMA validation phase: `YES`

Runtime activation status: `NOT_AUTHORIZED`

Production persistence status: `NOT_AUTHORIZED`

GIO mapping status: `NOT_AUTHORIZED`

Property assignment status: `NOT_AUTHORIZED`

Final canonical selection status: `NOT_AUTHORIZED`

Customer activation status: `NOT_AUTHORIZED`

---

## 1. Executive Summary

GMA 1.0 Internal Review Decision Fixture validates representative human-review decisions against the certified Internal Mapping Review Queue.

The fixture proves that review decisions can preserve evidence, record rationale, classify preview candidates safely, retain ambiguity and conflicts, enforce the Editorial Separation Principle, and remain non-authoritative and non-active.

Certified implementation outputs:

- Pure local fixture module: `lib/gma/internalReviewDecisionFixture.ts`
- Deterministic validation command: `npm run check:gma-internal-review-decision-fixture`
- 10 representative fixture decisions.
- Reviewer-role, rationale, evidence-sufficiency, status/action, versioning, determinism, and isolation validation.
- Negative tests for prohibited editorial, ambiguity, duplicate, conflict, boundary, eligibility, role, and rationale failures.

Certification recommendation:

- `GMA_1.0_INTERNAL_REVIEW_DECISION_FIXTURE_CERTIFIED_AND_CLOSED`

Recommended next authorization:

- `GMA_1.0_INTERNAL_PERSISTENCE_PROOF`

That next authorization must be narrowly bounded internal development only and must not be started without a separate directive.

---

## 2. Source Boundary

Authorized source:

- Existing 91-record Internal Mapping Review Queue.

The fixture does not read from:

- Prisma
- Supabase
- production database tables
- GIO tables
- MLS
- Typesense
- customer forms
- external vendors
- Google Docs
- network sources

No new geographic inventory source was added.

---

## 3. Fixture Decision Contract

Each fixture decision includes:

| Field | Status |
| --- | --- |
| Decision ID | Implemented as `GMA_DECISION_FIXTURE\|V1\|###` |
| Queue item ID | Preserved |
| Original preview record ID | Preserved |
| Reviewer role | Controlled local vocabulary |
| Review status | Controlled queue-compatible status |
| Selected action | Controlled queue-compatible action |
| Evidence sufficiency | Preserved from queue |
| Rationale | Mandatory |
| Preserved ambiguity | Preserved from queue |
| Preserved conflicts | Preserved from queue |
| Editorial-separation result | Preserved or locked |
| Requested additional evidence | Mandatory |
| Next permitted gate | Separate authorization required |
| Prohibited gates | Explicitly listed |
| Deterministic timestamp | Fixed fixture timestamp |
| Fixture version | `GMA_1.0_INTERNAL_REVIEW_DECISION_FIXTURE_V1` |

Every decision remains:

- `NOT_ELIGIBLE`
- `NON_AUTHORITATIVE_FIXTURE_ONLY`

---

## 4. Fixture Decisions Created

| ID | Representative case | Queue evidence | Decision result |
| --- | --- | --- | --- |
| `GMA_DECISION_FIXTURE\|V1\|001` | Exact municipality preview candidate | Thornton from `lib/cities.ts` | `APPROVED_AS_PREVIEW_CANDIDATE` only |
| `GMA_DECISION_FIXTURE\|V1\|002` | Gunbarrel object-type ambiguity | Gunbarrel from `lib/cities.ts` | `ESCALATED` |
| `GMA_DECISION_FIXTURE\|V1\|003` | Superior registry mismatch | Superior from `data/cities.ts` | `CONFLICT_PRESERVED` |
| `GMA_DECISION_FIXTURE\|V1\|004` | Niwot authority question | Niwot from `data/cities.ts` | `NEEDS_MORE_EVIDENCE` |
| `GMA_DECISION_FIXTURE\|V1\|005` | Municipality/market-area conflation | Louisville Housing Market from `lib/marketData.ts` | `CONFLICT_PRESERVED` |
| `GMA_DECISION_FIXTURE\|V1\|006` | Static polygon boundary risk | Mapleton Hill from `lib/neighborhoodPolygons.ts` | `DEFERRED` |
| `GMA_DECISION_FIXTURE\|V1\|007` | Legacy city alias candidate | Boulder from `data/cities.ts` | `APPROVED_AS_ALIAS_CANDIDATE` |
| `GMA_DECISION_FIXTURE\|V1\|008` | Legacy neighborhood duplicate candidate | Mapleton Hill from `data/neighborhoods.ts` | `DUPLICATE_CANDIDATE` |
| `GMA_DECISION_FIXTURE\|V1\|009` | Editorial-only search/page association | `data/searchPages.ts` editorial item | `EDITORIAL_ONLY` |
| `GMA_DECISION_FIXTURE\|V1\|010` | Deferred ZIP/subdivision boundary assertion | Deferred market-report proxy plus queue absence assertion | `DEFERRED` |

ZIP and subdivision records were not generated in the 91-record queue. The fixture therefore proves the ZIP/subdivision boundary by asserting no queue item has proposed object type `ZIP_CODE` or `SUBDIVISION`, and by preserving the existing deferred posture instead of inventing a mapping record.

---

## 5. Governance Rule Results

| Required rule | Result |
| --- | --- |
| Exact municipality candidates may be approved only as preview candidates | Passed |
| Gunbarrel cannot be assigned a final object type automatically | Passed |
| Superior mismatch remains blocked or escalated | Passed |
| Niwot requires authoritative identity evidence | Passed |
| MarketArea cannot be silently converted to Municipality | Passed |
| Static polygons cannot establish authoritative boundaries | Passed |
| Legacy aliases cannot become canonical solely through repetition | Passed |
| Duplicate candidates cannot be merged | Passed |
| Editorial associations remain editorial-only | Passed |
| Deferred ZIP/subdivision records remain inactive | Passed through absence and inactive-boundary assertion |
| Reviewer rationale is mandatory | Passed |
| Unsupported status transitions fail | Passed |
| Decisions cannot alter activation eligibility | Passed |
| Decisions cannot create GIO or property relationships | Passed |

---

## 6. Editorial Separation Enforcement

Negative tests prove:

- editorial content cannot become an identity mapping;
- editorial content cannot become a factual observation;
- editorial content cannot become an alias without a separate sourced identity basis;
- search intent and page existence cannot establish geography;
- narrative descriptions cannot establish boundaries;
- reviewer approval cannot bypass source and trust requirements.

No fixture decision converts editorial material into governed geography.

---

## 7. Decision Integrity

Validation covers:

- authorized reviewer roles;
- mandatory rationale;
- evidence-sufficiency compatibility;
- allowed status/action combinations;
- immutable queue and preview evidence;
- conflict preservation;
- ambiguity preservation;
- explicit decision versioning;
- repeatable deterministic execution;
- idempotent summary generation.

A future decision may supersede a fixture decision only through explicit versioning. It must not erase this fixture history.

---

## 8. Runtime Isolation Verification

Static validation confirmed no imports or consumption of the decision fixture from:

- `app`
- `components`
- `lib/search`
- `lib/mls`
- `lib/typesense`
- `lib/alerts`
- `lib/email`
- `lib/tracking`
- `workers`

The fixture remains an isolated non-production governance utility.

---

## 9. Prisma and Migration Review

No Prisma schema change was made.

No migration was created.

The checker confirms the Prisma schema does not contain:

- `GmaInternalReviewDecisionFixture`
- `ReviewDecisionFixture`
- `decision_fixture`

The checker also confirms migration names do not contain GMA review-decision fixture markers.

---

## 10. Validation Matrix

| Validation | Result |
| --- | --- |
| `npm run check:gma-internal-review-decision-fixture` | Passed |
| Queue input boundary | Passed |
| Reviewer role authorization | Passed |
| Mandatory rationale | Passed |
| Evidence-sufficiency compatibility | Passed |
| Editorial promotion rejection | Passed |
| Ambiguity preservation | Passed |
| Conflict preservation | Passed |
| Duplicate merge rejection | Passed |
| Eligibility activation rejection | Passed |
| Determinism and idempotency | Passed |
| Runtime isolation | Passed |
| Prisma and migration non-change | Passed |

---

## 11. Risk Register

| Risk | Status | Mitigation |
| --- | --- | --- |
| Fixture decisions mistaken for production approval | Controlled | Every decision remains `NON_AUTHORITATIVE_FIXTURE_ONLY` and `NOT_ELIGIBLE`. |
| ZIP/subdivision deferred requirement misunderstood as created records | Controlled | Documentation records that no ZIP/subdivision queue records exist and none were invented. |
| Editorial content promoted into facts | Controlled | Negative tests block identity, observation, and alias promotion. |
| Ambiguity or conflict resolved silently | Controlled | Ambiguity and conflict preservation are validated. |
| Future decision overwrites fixture history | Controlled | Fixture versioning is explicit; supersession requires later versioning. |

---

## 12. Explicit Exclusions

This implementation did not authorize or perform:

- Prisma schema changes.
- Migrations.
- Database writes.
- GIO row creation.
- Property relationship creation.
- Production mapping.
- Final canonical identity selection.
- Eligibility activation.
- Runtime integrations.
- Search, map, route, page, SEO, Typesense, MLS, CRM, alert, email, or customer behavior changes.
- Vendor connections.
- Scraping.
- AI-assisted mapping.

---

## 13. Executive Recommendation

GMA 1.0 Internal Review Decision Fixture satisfies the approved final non-persistence GMA validation phase.

Executive certification recommendation:

- `GMA_1.0_INTERNAL_REVIEW_DECISION_FIXTURE_CERTIFIED_AND_CLOSED`

Recommended first internal-persistence proof:

- `GMA_1.0_INTERNAL_PERSISTENCE_PROOF`

The proof should be narrowly bounded to development-only persistence mechanics, with no production data, no runtime consumption, no property assignment, no customer activation, and no final canonical selection unless explicitly authorized.
