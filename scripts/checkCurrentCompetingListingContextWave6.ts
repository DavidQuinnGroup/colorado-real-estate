import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  buildCurrentCompetingListingContext,
  buildSubjectListingContext,
  CURRENT_COMPETING_LISTING_CONTEXT_NEXT_GATE,
  CURRENT_COMPETING_LISTING_CONTEXT_WAVE_6_STATUS,
  CURRENT_COMPETING_LISTING_CONTEXT_VERSION,
  deriveCompetingCohortInput,
} from '../lib/agentCurrentCompetingListingContext';
import { CURRENT_COMPETING_LISTING_CONTEXT_FIXTURES } from '../lib/agentCurrentCompetingListingContextFixtures';
import { normalizeAgentCohortDefinition } from '../lib/agentCohortBuilder';

function source(path: string) {
  return readFileSync(resolve(process.cwd(), path), 'utf8');
}

const subject = buildSubjectListingContext(CURRENT_COMPETING_LISTING_CONTEXT_FIXTURES.validSubject);
assert.equal(subject.analyticalGrain, 'MLS_LISTING');
assert.equal(subject.repositoryIdentity, 'fixture-current-competing-subject');
assert.equal(subject.listingReference, 'MLS-W6-SUBJECT-1');
assert.equal(subject.sourceScope, 'CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION');
assert.equal(subject.fields.price, 1000000);
assert.equal(subject.missingFields.length, 0);

const defaultCohort = deriveCompetingCohortInput(CURRENT_COMPETING_LISTING_CONTEXT_FIXTURES.validSubject);
const defaultNormalized = normalizeAgentCohortDefinition(defaultCohort.input);
assert.equal(defaultCohort.derivation, 'SYSTEM_DERIVED_DEFAULT_COMPETING_COHORT');
assert.equal(defaultNormalized.filters.city, 'boulder');
assert.equal(defaultNormalized.filters.propertyType, 'residential');
assert.equal(defaultNormalized.filters.statusScope, 'active');
assert.equal(defaultNormalized.filters.priceMin, null);
assert.equal(defaultNormalized.validation.ready, true);

const adjustedCohort = deriveCompetingCohortInput(CURRENT_COMPETING_LISTING_CONTEXT_FIXTURES.validSubject, { filters: { priceMin: 900000, sqftMin: 2000 } });
const adjustedNormalized = normalizeAgentCohortDefinition(adjustedCohort.input);
assert.equal(adjustedCohort.derivation, 'AGENT_ADJUSTED_COMPETING_COHORT');
assert.equal(adjustedNormalized.filters.priceMin, 900000);
assert.equal(adjustedNormalized.filters.sqftMin, 2000);
assert.equal(adjustedNormalized.validation.ready, true);

const nullSubject = buildSubjectListingContext(CURRENT_COMPETING_LISTING_CONTEXT_FIXTURES.nullSubjectPrice);
assert.equal(nullSubject.fields.price, null);
assert.equal(nullSubject.fields.sqft, null);
assert.ok(nullSubject.missingFields.includes('price'));
assert.ok(nullSubject.missingFields.includes('sqft'));

const unknown = await buildCurrentCompetingListingContext(null);
assert.equal(unknown.status, 'NOT_AVAILABLE');
assert.ok(unknown.rejectionReasons.includes('UNKNOWN_SUBJECT'));

const physical = await buildCurrentCompetingListingContext(CURRENT_COMPETING_LISTING_CONTEXT_FIXTURES.validSubject, { subjectGrain: 'PHYSICAL_PROPERTY' });
assert.equal(physical.status, 'NOT_AVAILABLE');
assert.ok(physical.rejectionReasons.includes('SUBJECT_GRAIN_NOT_ADMITTED'));

const client = await buildCurrentCompetingListingContext(CURRENT_COMPETING_LISTING_CONTEXT_FIXTURES.validSubject, { audience: 'PUBLIC_DISPLAY' });
assert.equal(client.status, 'NOT_AVAILABLE');
assert.ok(client.rejectionReasons.includes('RIGHTS_INCOMPATIBLE'));

const historical = await buildCurrentCompetingListingContext(CURRENT_COMPETING_LISTING_CONTEXT_FIXTURES.validSubject, { historical: true });
assert.equal(historical.status, 'NOT_AVAILABLE');
assert.ok(historical.rejectionReasons.includes('HISTORICAL_CONTEXT_NOT_ADMITTED'));

const dom = await buildCurrentCompetingListingContext(CURRENT_COMPETING_LISTING_CONTEXT_FIXTURES.validSubject, { dom: true, soldComparable: true });
assert.equal(dom.status, 'NOT_AVAILABLE');
assert.ok(dom.rejectionReasons.includes('DOM_NOT_ADMITTED'));
assert.ok(dom.rejectionReasons.includes('SOLD_COMPARABLE_NOT_ADMITTED'));

const missingIdentity = await buildCurrentCompetingListingContext(CURRENT_COMPETING_LISTING_CONTEXT_FIXTURES.missingListingIdentity);
assert.equal(missingIdentity.status, 'NOT_AVAILABLE');
assert.ok(missingIdentity.rejectionReasons.includes('SUBJECT_LISTING_IDENTITY_OR_CURRENT_ACTIVE_STATUS_UNAVAILABLE'));

const lib = source('lib/agentCurrentCompetingListingContext.ts');
const aggregation = source('lib/agentCohortAggregation.ts');
const route = source('app/api/agent/current-competing-listing-context/route.ts');
const auth = source('lib/admin/adminAuth.ts');
const ui = source('components/agent/PropertyConversationExperience.tsx');
const certification = source('docs/project-atlas/executive-library/CURRENT-COMPETING-LISTING-CONTEXT-BOUNDED-IMPLEMENTATION-WAVE-6-CERTIFICATION.md');
const packageJson = JSON.parse(source('package.json')) as { scripts?: Record<string, string> };

for (const required of [
  CURRENT_COMPETING_LISTING_CONTEXT_WAVE_6_STATUS,
  CURRENT_COMPETING_LISTING_CONTEXT_VERSION,
  CURRENT_COMPETING_LISTING_CONTEXT_NEXT_GATE,
  'EXCLUDED_BY_LISTING_REFERENCE',
  'EXCLUSION_NOT_DETERMINISTIC',
  'NO_COMPETING_LISTINGS',
  'SMALL_COHORT_COUNT_VISIBLE_NO_STATISTICAL_CONFIDENCE_CLAIM',
  'Current asking/list price only; not sale price, market value, or recommended price.',
  'Percentage delta is not admitted for year built.',
]) {
  assert.ok(lib.includes(required), `Wave 6 library must preserve ${required}.`);
}

assert.ok(aggregation.includes('excludeMlsIds') && aggregation.includes('mlsId: { notIn: excludedMlsIds }'), 'Aggregation must support deterministic subject exclusion by listing reference.');
assert.ok(route.includes("authorizeAdminRequest(request, { pathname: AGENT_COMPETING_CONTEXT_API_PATH, method: 'GET' })"), 'API must use exact Agent auth.');
assert.ok(auth.includes("surface('/api/agent/current-competing-listing-context', 'READ_ONLY_ADMIN_API', ['HUMAN_AGENT'], ['AGENT'], ['HUMAN_AGENT_SESSION'], 'READ_ONLY'"), 'API must be exact Agent-only read-only surface.');
assert.ok(ui.includes('agent-current-competing-listing-context') && ui.includes('Current competing listing context'), 'Property Preparation must expose Wave 6 context panel.');
assert.ok(ui.includes('not a CMA, valuation, sold-comparable analysis, or pricing recommendation'), 'UI must preserve no-CMA/no-valuation/no-recommendation boundary.');
assert.ok(ui.includes('data-agent-current-competing-listing-context-cma="false"'));
assert.ok(ui.includes('data-agent-current-competing-listing-context-valuation="false"'));
assert.ok(ui.includes('data-agent-current-competing-listing-context-recommendation="false"'));
assert.ok(ui.includes('data-agent-current-competing-listing-context-sold-comparable="false"'));
assert.ok(ui.includes('data-agent-current-competing-listing-context-public-output="false"'));

for (const forbidden of ['overpriced', 'underpriced', 'recommended list price', 'market value claim', 'CMA_CERTIFIED', 'VALUATION_CERTIFIED', 'SUBJECT_PROPERTY_BENCHMARK_CERTIFIED']) {
  assert.equal(ui.includes(forbidden), false, `UI must not include forbidden term ${forbidden}.`);
}

for (const required of [
  CURRENT_COMPETING_LISTING_CONTEXT_WAVE_6_STATUS,
  'SUBJECT LISTING != PHYSICAL PROPERTY',
  'CURRENT COMPETING LISTING CONTEXT != CMA',
  'CURRENT ASKING/LIST PRICE != SALE PRICE',
  'READY_FOR_ADVANCED_PROPERTY_SEGMENTATION_AND_GEOGRAPHY_ADMISSION_REVIEW',
  'DATABASE MUTATION: NONE',
]) {
  assert.ok(certification.includes(required), `Certification must record ${required}.`);
}

assert.equal(packageJson.scripts?.['check:current-competing-listing-context-wave-6'], 'jiti scripts/checkCurrentCompetingListingContextWave6.ts');

console.log('CURRENT_COMPETING_LISTING_CONTEXT_BOUNDED_IMPLEMENTATION_WAVE_6_CHECK: PASS');
