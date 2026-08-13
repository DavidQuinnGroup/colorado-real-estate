# REIE Boulder Market AEO Answer Unit Pilot Certification

Program: `BOULDER_MARKET_AEO_ANSWER_UNIT_CONTRACT_AND_QUALITY_GATE_PILOT`

Repository baseline before implementation: `14e36aec6d4f0556740e472038878aa108fd56f3`

Disposition: `BOULDER_MARKET_AEO_ANSWER_UNIT_PILOT_IMPLEMENTED_AND_LOCALLY_CERTIFIED`

This certification is local-only until separately synchronized. No deployment is authorized by this record.

## Implemented Scope

The pilot implements a minimum reusable `ReieAnswerUnit` contract for the existing Boulder Market route only:

- reusable answer-unit contract and field requirement map in `lib/marketAeoAnswerUnit.ts`;
- Boulder-only answer-unit builder using existing REIE market facts, Market AEO contract, Market Product 3 evidence posture, and Market Newsletter source/freshness primitives;
- human-visible answer-unit presentation on `/market/boulder-co-housing-market`;
- deterministic quality gate in `scripts/checkBoulderMarketAnswerUnitPilot.ts`;
- package script `npm run check:boulder-market-answer-unit-pilot`.

No other city, neighborhood, property, guide, article, statewide route, or broad programmatic content was added.

## Boulder Market Questions

The public-eligible pilot answer units cover:

- What is happening in the Boulder housing market?
- How much housing inventory is available in Boulder?
- What is the current Boulder home-price context?
- How quickly are Boulder homes selling?
- What should a buyer or seller understand when reading the current Boulder market data?

The pilot does not answer:

- whether prices will rise;
- whether Boulder is a good investment;
- whether now is a good time to buy or sell;
- what a home will be worth;
- what offer a customer should make.

## Fact / Evidence Reuse

The pilot reuses existing certified primitives:

- Boulder city market facts from `lib/cities.ts`: `$1,450,000` median price, `$850` price per square foot, `22` days on market, `58` active inventory signal;
- city market interpretation from `lib/marketIntelligenceExperience.ts`;
- Market Product 3 evidence posture from `lib/marketProduct3.ts`;
- existing Market AEO source/freshness/limitation contract from `lib/marketAeoPilot.ts`;
- source/freshness references and review flags from `lib/content/marketNewsletterPackage.ts`.

The pilot does not duplicate calculations or expose agent-only newsletter package content.

## Source / Freshness / Limitations

Each public answer unit carries:

- source references;
- evidence effective date;
- generated/updated timestamp separated from evidence freshness;
- freshness posture;
- conflict posture;
- limitations;
- verification requirements;
- canonical URL;
- public eligibility;
- citation eligibility.

Generated time does not substitute for evidence freshness.

## Citation Eligibility

The pilot implements deterministic citation classification:

- fresh supported public units: `CITATION_READY_WITH_LIMITATIONS`;
- stale/aging evidence: `CITATION_READY_WITH_LIMITATIONS` with explicit aging limitations;
- insufficient evidence for citation: `NOT_CITATION_READY` while preserving public eligibility when human-visible context is still safe;
- missing evidence, conflict, unsupported geography, and unsupported question: fail closed as `NOT_CITATION_READY`.

## Human-Visible Experience

The Boulder Market route now includes a subordinate section titled:

`Questions This Market Data Can Answer`

The section is visible in server-rendered public HTML and exposes the answer, supporting facts, source/freshness summary, limitation, citation posture, entity, geography, and protected-boundary markers. It does not rely on login, map interaction, hidden UI, or client-only state.

## Structured Semantics

The pilot uses structured internal answer-unit data rendered as visible content and HTML data attributes. It does not add new JSON-LD, FAQ spam, answer endpoints, feeds, `llms.txt`, or hidden SEO/AEO-only claims.

Existing city market schema and FAQ behavior remain otherwise preserved.

## Quality Gates

The deterministic check validates:

- `SEO_GATE`: canonical Boulder URL, indexable public eligibility, server-rendered factual answer markers, title/metadata posture by preserving the existing route, and no duplicate pilot route;
- `AEO_GATE`: answer unit id, question/intent, entity, geography, answer, facts, evidence date, source references, freshness, conflict, citation eligibility, and visible/structured parity;
- `SHARED_TRUST_GATE`: evidence support, no unsupported claim, no prediction, no suitability, no investment recommendation, no valuation certainty, no protected-class implication, no desirability/safety/school ranking, correct fail-closed states, and provider independence.

## Fail-Closed Matrix

Covered deterministic states:

| State | Result |
| --- | --- |
| Fresh supported evidence | Five public units render as indexable and citation-ready-with-limitations. |
| Stale/aging evidence | Five public units render with aging freshness and limitation posture. |
| Missing required evidence | Fails closed with no public units. |
| Conflicting evidence | Fails closed with no public units. |
| Unsupported question | Fails closed with no public units. |
| Unsupported geography | Fails closed with no public units. |
| Insufficient evidence for citation | Public units remain safe but classify `NOT_CITATION_READY`. |
| Valid public answer | Public unit exposes answer, facts, source, freshness, limitations, canonical URL, and eligibility. |
| Public answer with limitations | Stale and normal units carry limitation-bound citation posture. |

## Protected-System Confirmation

This pilot did not:

- retrieve credentials;
- call LightBox;
- investigate ATTOM;
- activate county sources;
- modify Prisma schema or migrations;
- write production data;
- mutate customer data;
- change CRM, SavedSearch, workers, queues, scheduler, email, notifications, telemetry, analytics, Typesense, MLS, Vercel, or deployment configuration.

## Provider Status

- LightBox: `WAITING_FOR_LIGHTBOX_SUPPORT_AUTH_SCOPE_CONFIRMATION`
- LightBox trial calls consumed: `0`
- ATTOM: `PENDING_PROVIDER_RESPONSE`

## Next Gate

Recommended next gate:

`READY_FOR_BOULDER_MARKET_AEO_ANSWER_UNIT_PILOT_SYNCHRONIZATION`
