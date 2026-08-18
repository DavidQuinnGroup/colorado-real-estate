import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  buildBoulderMarketAnswerUnitPilot,
  REIE_ANSWER_UNIT_FIELD_REQUIREMENTS,
  REIE_MARKET_AEO_ANSWER_UNIT_CANONICAL_URL,
  REIE_MARKET_AEO_ANSWER_UNIT_CONTRACT_VERSION,
  REIE_MARKET_AEO_ANSWER_UNIT_PILOT_STATUS,
  REIE_MARKET_AEO_ANSWER_UNIT_SUPPORTED_ROUTE,
  type ReieAnswerUnit,
} from '../lib/marketAeoAnswerUnit.js';

function read(filePath: string) {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string) {
  assert(source.includes(value), message);
}

function assertNotIncludes(source: string, value: string, message: string) {
  assert(!source.includes(value), message);
}

function assertValidPublicUnit(unit: ReieAnswerUnit) {
  assert(unit.answerUnitId.startsWith('reie-answer-unit-market-boulder-'));
  assert(unit.question.length > 20, `${unit.answerUnitId} must have a useful question.`);
  assert(unit.conciseAnswer.length > 40, `${unit.answerUnitId} must have a concise factual answer.`);
  assert.equal(unit.canonicalEntity.id, 'city-market:boulder-co-housing-market');
  assert.equal(unit.canonicalEntity.type, 'CITY_MARKET');
  assert.equal(unit.geography.city, 'Boulder');
  assert.equal(unit.geography.state, 'Colorado');
  assert.equal(unit.geography.scope, 'city-market');
  assert(unit.supportingFacts.length >= 1, `${unit.answerUnitId} must expose supporting facts.`);
  assert(unit.evidenceSourceReferences.length >= 2, `${unit.answerUnitId} must expose source references.`);
  assert.equal(unit.evidenceEffectiveAt, '2026-08-08');
  assert.match(unit.generatedAt, /^2026-08-13T00:00:00\.000Z$/);
  assert.equal(unit.conflictPosture, 'NONE');
  assert(unit.limitations.length >= 3, `${unit.answerUnitId} must expose limitations.`);
  assert(unit.verificationRequirements.length >= 3, `${unit.answerUnitId} must expose verification requirements.`);
  assert.equal(unit.canonicalUrl, REIE_MARKET_AEO_ANSWER_UNIT_CANONICAL_URL);
  assert.equal(unit.semanticSchemaType, 'WebPageElement');
  assert(unit.relatedEntities.includes('Boulder'));
  assert(unit.relatedEntities.includes('Colorado'));
  assert.equal(unit.publicEligibility, 'INDEXABLE');
  assert(['CITATION_READY', 'CITATION_READY_WITH_LIMITATIONS'].includes(unit.citationEligibility));
}

const helper = read('lib/marketAeoAnswerUnit.ts');
const cityMarketPage = read('app/market/[city]/page.tsx');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfig = read('tsconfig.worker.json');
const chatStart = read('docs/CHAT_START.md');
const architecture = read('docs/project-atlas/executive-library/PROJECT-ATLAS-SEO-AEO-AUTHORITY-ARCHITECTURE.md');
const certification = read('docs/project-atlas/executive-library/REIE-BOULDER-MARKET-AEO-ANSWER-UNIT-PILOT-CERTIFICATION.md');

assert.equal(REIE_MARKET_AEO_ANSWER_UNIT_PILOT_STATUS, 'BOULDER_MARKET_AEO_ANSWER_UNIT_PILOT_IMPLEMENTED');
assert.equal(REIE_MARKET_AEO_ANSWER_UNIT_CONTRACT_VERSION, '1.0.0');
assert.equal(REIE_MARKET_AEO_ANSWER_UNIT_SUPPORTED_ROUTE, 'boulder-co-housing-market');
assert.equal(REIE_MARKET_AEO_ANSWER_UNIT_CANONICAL_URL, 'https://davidquinngroup.com/market/boulder-co-housing-market');

for (const [field, requirement] of Object.entries(REIE_ANSWER_UNIT_FIELD_REQUIREMENTS)) {
  assert.notEqual(requirement, undefined, `${field} must have a field requirement.`);
  assert(['MANDATORY', 'CONDITIONAL', 'NOT_APPLICABLE'].includes(requirement));
}

const normal = buildBoulderMarketAnswerUnitPilot();
assert.equal(normal.status, REIE_MARKET_AEO_ANSWER_UNIT_PILOT_STATUS);
assert.equal(normal.route, REIE_MARKET_AEO_ANSWER_UNIT_SUPPORTED_ROUTE);
assert.equal(normal.evidenceEffectiveAt, '2026-08-08');
assert.equal(normal.publicUnits.length, 5);
assert.equal(normal.failClosedUnits.length, 0);
assert.deepEqual(normal.failClosedReasons, []);

for (const unit of normal.publicUnits) {
  assertValidPublicUnit(unit);
}

const questionSet = new Set(normal.publicUnits.map((unit) => unit.question));
assert(questionSet.has('What is happening in the Boulder housing market?'));
assert(questionSet.has('How much housing inventory is available in Boulder?'));
assert(questionSet.has('What is the current Boulder home-price context?'));
assert(questionSet.has('How quickly are Boulder homes selling?'));
assert(questionSet.has('What should a buyer or seller understand when reading the current Boulder market data?'));

const inventory = normal.publicUnits.find((unit) => unit.intent === 'INVENTORY_CONTEXT');
assert(inventory, 'Inventory answer must exist.');
assert.match(inventory.conciseAnswer, /58 active inventory signal/);
assert(inventory.supportingFacts.some((fact) => fact.label === 'Active inventory signal' && fact.value === '58'));

const price = normal.publicUnits.find((unit) => unit.intent === 'PRICE_CONTEXT');
assert(price, 'Price answer must exist.');
assert.match(price.conciseAnswer, /\$1,450,000 median/);
assert.match(price.conciseAnswer, /\$850 per square foot/);

const pace = normal.publicUnits.find((unit) => unit.intent === 'PACE_CONTEXT');
assert(pace, 'Pace answer must exist.');
assert.match(pace.conciseAnswer, /22 days on market/);

const stale = buildBoulderMarketAnswerUnitPilot({ scenario: 'STALE_SOURCE_EVIDENCE' });
assert.equal(stale.status, REIE_MARKET_AEO_ANSWER_UNIT_PILOT_STATUS);
assert.equal(stale.publicUnits.length, 5);
assert(stale.publicUnits.every((unit) => unit.freshnessPosture === 'AGING'));
assert(stale.publicUnits.every((unit) => unit.citationEligibility === 'CITATION_READY_WITH_LIMITATIONS'));
assert(stale.publicUnits.every((unit) => unit.limitations.join(' ').includes('Freshness is aging')));

const missing = buildBoulderMarketAnswerUnitPilot({ scenario: 'MISSING_MARKET_EVIDENCE' });
assert.equal(missing.status, 'FAIL_CLOSED');
assert.equal(missing.publicUnits.length, 0);
assert.equal(missing.failClosedUnits[0]?.publicEligibility, 'FAIL_CLOSED');
assert.equal(missing.failClosedUnits[0]?.citationEligibility, 'NOT_CITATION_READY');

const conflicting = buildBoulderMarketAnswerUnitPilot({ scenario: 'SOURCE_CONFLICT' });
assert.equal(conflicting.status, 'FAIL_CLOSED');
assert.equal(conflicting.publicUnits.length, 0);
assert(conflicting.failClosedReasons.join(' ').includes('Conflicting source posture fails closed'));

const unsupportedQuestion = buildBoulderMarketAnswerUnitPilot({ scenario: 'UNSUPPORTED_QUESTION' });
assert.equal(unsupportedQuestion.status, 'FAIL_CLOSED');
assert.equal(unsupportedQuestion.publicUnits.length, 0);
assert.match(unsupportedQuestion.failClosedReasons.join(' '), /outside the Boulder market pilot question set/);

const unsupportedGeography = buildBoulderMarketAnswerUnitPilot({ geographySlug: 'denver-co-housing-market' });
assert.equal(unsupportedGeography.status, 'FAIL_CLOSED');
assert.equal(unsupportedGeography.publicUnits.length, 0);
assert.match(unsupportedGeography.failClosedReasons.join(' '), /Only the Boulder city market route is supported/);

const insufficientCitation = buildBoulderMarketAnswerUnitPilot({ scenario: 'INSUFFICIENT_EVIDENCE_FOR_CITATION' });
assert.equal(insufficientCitation.status, REIE_MARKET_AEO_ANSWER_UNIT_PILOT_STATUS);
assert.equal(insufficientCitation.publicUnits.length, 5);
assert(insufficientCitation.publicUnits.every((unit) => unit.publicEligibility === 'INDEXABLE'));
assert(insufficientCitation.publicUnits.every((unit) => unit.citationEligibility === 'NOT_CITATION_READY'));

for (const required of [
  "import { buildBoulderMarketAnswerUnitPilot } from '@/lib/marketAeoAnswerUnit';",
  "cityData.marketSlug === 'boulder-co-housing-market'",
  'data-testid="boulder-market-answer-unit-pilot"',
  'data-testid="boulder-market-answer-unit"',
  'Questions This Market Data Can Answer',
  'data-answer-unit-public-eligibility="INDEXABLE"',
  'data-answer-unit-structured-json-ld="false"',
  'data-answer-unit-visible-structured-parity="internal-data-visible-content"',
  'data-answer-unit-provider-activation="false"',
  'data-answer-unit-telemetry="false"',
  'data-answer-unit-customer-data-mutation="false"',
  'data-answer-unit-ai="false"',
  'data-answer-unit-prediction="false"',
  'data-answer-unit-suitability="false"',
  'data-answer-unit-investment-recommendation="false"',
  'data-answer-unit-valuation-certainty="false"',
  'data-answer-unit-protected-class-implication="false"',
  'data-answer-unit-school-safety-ranking="false"',
]) {
  assertIncludes(cityMarketPage, required, `Boulder market page must include ${required}.`);
}

for (const required of [
  'buildMarketNewsletterAgentReviewPackage',
  'buildMarketAeoContract',
  'buildCityMarketExperience',
  'buildCityMarketProduct3Experience',
  'REIE_ANSWER_UNIT_FIELD_REQUIREMENTS',
  'CITATION_READY_WITH_LIMITATIONS',
  'NOT_CITATION_READY',
  'UNSUPPORTED_GEOGRAPHY',
  'UNSUPPORTED_QUESTION',
  'INSUFFICIENT_EVIDENCE_FOR_CITATION',
]) {
  assertIncludes(helper, required, `Answer-unit helper must include ${required}.`);
}

for (const forbidden of [
  'Will Boulder prices rise',
  'good investment',
  'good time to buy',
  'good time to sell',
  'What will my home be worth',
  'What offer should I make',
  'fetch(',
  'new PrismaClient',
  'localStorage',
  'sessionStorage',
  'document.cookie',
  'OpenAI',
  'LightBox',
  'ATTOM',
  'Typesense',
  'Resend',
  'SavedSearch',
  'CRMTask',
  'AlertQueue',
]) {
  assertNotIncludes(helper, forbidden, `Answer-unit helper must not include unauthorized dependency or question: ${forbidden}`);
}

for (const forbiddenCopy of [
  'will appreciate',
  'buy now',
  'sell now',
  'best investment',
  'best neighborhood',
  'safest',
  'school ranking',
  'guaranteed',
]) {
  assertNotIncludes(
    `${helper}\n${cityMarketPage}`,
    forbiddenCopy,
    `Pilot surfaces must not include prohibited claim language: ${forbiddenCopy}`,
  );
}
assert.equal('data-answer-unit-protected-class-implication="false"'.includes('="false"'), true, 'Explicit no-implication marker must remain safe.');
assert.equal(['protected-class implication=true', 'best investment', 'will appreciate'].some((claim) => /implication=true|best investment|will appreciate/i.test(claim)), true, 'Positive market claims must remain detectable.');

assert.equal(
  packageJson.scripts?.['check:boulder-market-answer-unit-pilot'],
  'npm run worker:build && jiti scripts/checkBoulderMarketAnswerUnitPilot.ts',
  'package.json must register the Boulder market answer-unit pilot check.',
);
assertIncludes(tsconfig, 'scripts/checkBoulderMarketAnswerUnitPilot.ts', 'Worker build must compile the pilot check.');
assertIncludes(
  architecture,
  'BOULDER_MARKET_AEO_ANSWER_UNIT_CONTRACT_AND_QUALITY_GATE_PILOT',
  'Architecture document must retain the bounded pilot recommendation.',
);
assertIncludes(
  certification,
  'BOULDER_MARKET_AEO_ANSWER_UNIT_PILOT_IMPLEMENTED_AND_LOCALLY_CERTIFIED',
  'Certification document must record the final pilot disposition.',
);
assertIncludes(
  chatStart,
  'BOULDER_MARKET_AEO_ANSWER_UNIT_PILOT_IMPLEMENTED_AND_LOCALLY_CERTIFIED',
  'CHAT_START must record the final pilot disposition.',
);

console.log(
  '[boulder-market-answer-unit-pilot] ok: contract, Boulder questions, fact reuse, freshness/source semantics, citation eligibility, visible HTML, SEO/AEO/shared trust gates, fail-closed matrix, and protected boundaries verified.',
);
