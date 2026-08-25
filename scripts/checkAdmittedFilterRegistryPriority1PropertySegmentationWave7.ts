import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  ADMITTED_FILTER_REGISTRY_NEXT_GATE,
  ADMITTED_FILTER_REGISTRY_WAVE_7_STATUS,
  AGENT_ADMITTED_FILTER_REGISTRY,
  AGENT_ADMITTED_FILTER_REGISTRY_VERSION,
  getAgentAdmittedFilterRegistration,
  isAgentUnadmittedFilterKey,
} from '../lib/agentAdmittedFilterRegistry';
import {
  AGENT_COHORT_SUPPORTED_FILTER_KEYS,
  normalizeAgentCohortDefinition,
  parseAgentCohortSearchParams,
} from '../lib/agentCohortBuilder';
import { buildAgentCohortPrismaWhere } from '../lib/agentCohortCount';
import { mapBuyerCriteriaToAgentCohort } from '../lib/agentBuyerCriteriaComparisonAdapter';
import { classifyAgentCohortRelationship, parseAgentComparisonSearchParams } from '../lib/agentCurrentSnapshotComparison';
import { deriveCompetingCohortInput } from '../lib/agentCurrentCompetingListingContext';
import { CURRENT_COMPETING_LISTING_CONTEXT_FIXTURES } from '../lib/agentCurrentCompetingListingContextFixtures';
import { createPropertyCriteriaProfile, updatePropertyCriteriaRange } from '../lib/agent-advisory-workbench/propertyCriteriaProfile';

assert.equal(ADMITTED_FILTER_REGISTRY_WAVE_7_STATUS, 'ADMITTED_FILTER_REGISTRY_AND_PRIORITY_1_PROPERTY_SEGMENTATION_BOUNDED_IMPLEMENTATION_WAVE_7_CERTIFIED');
assert.equal(AGENT_ADMITTED_FILTER_REGISTRY_VERSION, 'AGENT_ADMITTED_FILTER_REGISTRY_V1');
assert.equal(ADMITTED_FILTER_REGISTRY_NEXT_GATE, 'READY_FOR_ZIP_POSTAL_LISTING_FILTER_FOUNDATION_ADMISSION');

for (const key of AGENT_COHORT_SUPPORTED_FILTER_KEYS) {
  assert.equal(getAgentAdmittedFilterRegistration(key)?.filterable, true, `${key} must be registered before it can filter.`);
}

for (const key of ['bedsMax', 'bedsExact', 'bathsMax', 'bathsExact', 'lotSizeMin', 'lotSizeMax'] as const) {
  const registration = AGENT_ADMITTED_FILTER_REGISTRY[key];
  assert.equal(registration.tier, 'ADVANCED_PROPERTY_FILTER');
  assert.equal(registration.analyticalGrain, 'MLS_LISTING');
  assert.equal(registration.sourceScope, 'CURRENT_REPOSITORY_PROPERTY_SEARCH_PROJECTION');
  assert.equal(registration.rightsAudience, 'AGENT_ONLY');
  assert.equal(registration.geographyActivation, false);
}
assert.equal(AGENT_ADMITTED_FILTER_REGISTRY.bathsExact.valueType, 'DECIMAL');
assert.equal(AGENT_ADMITTED_FILTER_REGISTRY.bathsMax.valueType, 'DECIMAL');
assert.equal(AGENT_ADMITTED_FILTER_REGISTRY.lotSizeMin.canonicalUnit, 'ACRES');
assert.equal(AGENT_ADMITTED_FILTER_REGISTRY.lotSizeMax.aggregatable, false);
assert.equal(isAgentUnadmittedFilterKey('zip'), true);
assert.equal(isAgentUnadmittedFilterKey('garageSpaces'), true);

const bedroomRange = normalizeAgentCohortDefinition({
  purpose: 'Bedroom range',
  filters: { city: 'Boulder', propertyType: 'Residential', statusScope: 'Active', bedsMin: 2, bedsMax: 3 },
  asOf: '2026-08-25T12:00:00.000Z',
});
assert.equal(bedroomRange.validation.ready, true);
assert.equal(bedroomRange.filters.bedsMin, 2);
assert.equal(bedroomRange.filters.bedsMax, 3);
assert.equal(bedroomRange.intervalSemantics.beds.min, 2);
assert.equal(bedroomRange.intervalSemantics.beds.max, 3);
assert.match(bedroomRange.serializedCohortIdentity, /"bedsMax":3/);

const bedroomExact = normalizeAgentCohortDefinition({
  purpose: 'Exact bedrooms',
  filters: { city: 'Boulder', propertyType: 'Residential', statusScope: 'Active', bedsExact: 3 },
  asOf: '2026-08-25T12:00:00.000Z',
});
const bedroomExactFromRange = normalizeAgentCohortDefinition({
  purpose: 'Exact bedrooms equivalent',
  filters: { city: 'Boulder', propertyType: 'Residential', statusScope: 'Active', bedsMin: 3, bedsMax: 3 },
  asOf: '2026-08-25T12:00:00.000Z',
});
assert.equal(bedroomExact.validation.ready, true);
assert.equal(bedroomExact.filters.bedsExact, 3);
assert.equal(bedroomExact.intervalSemantics.beds.min, 3);
assert.equal(bedroomExact.intervalSemantics.beds.max, 3);
assert.equal(bedroomExact.serializedFilters, bedroomExactFromRange.serializedFilters);

const fractionalBath = normalizeAgentCohortDefinition({
  purpose: 'Fractional bath',
  filters: { city: 'Boulder', propertyType: 'Residential', statusScope: 'Active', bathsExact: 2.5 },
  asOf: '2026-08-25T12:00:00.000Z',
});
assert.equal(fractionalBath.validation.ready, true);
assert.equal(fractionalBath.filters.bathsExact, 2.5);
assert.equal(fractionalBath.intervalSemantics.baths.min, 2.5);
assert.equal(fractionalBath.intervalSemantics.baths.max, 2.5);
assert.match(fractionalBath.serializedCohortIdentity, /2\.5/);

const lotAcreage = normalizeAgentCohortDefinition({
  purpose: 'Lot acreage',
  filters: { city: 'Boulder', propertyType: 'Residential', statusScope: 'Active', lotSizeMin: 0.1, lotSizeMax: 0.25 },
  asOf: '2026-08-25T12:00:00.000Z',
});
assert.equal(lotAcreage.validation.ready, true);
assert.equal(lotAcreage.filters.lotSizeMin, 0.1);
assert.equal(lotAcreage.filters.lotSizeMax, 0.25);
assert.equal(lotAcreage.intervalSemantics.lotSize.min, 0.1);
assert.equal(lotAcreage.intervalSemantics.lotSize.max, 0.25);
assert.match(lotAcreage.serializedCohortIdentity, /"lotSizeMin":0\.1/);
assert.match(lotAcreage.serializedCohortIdentity, /"lotSizeMax":0\.25/);

const where = buildAgentCohortPrismaWhere(lotAcreage);
assert.deepEqual(where.lotSize, { gte: 0.1, lte: 0.25 });
assert.deepEqual(buildAgentCohortPrismaWhere(fractionalBath).baths, { gte: 2.5, lte: 2.5 });
assert.deepEqual(buildAgentCohortPrismaWhere(bedroomExact).beds, { gte: 3, lte: 3 });

for (const invalid of [
  normalizeAgentCohortDefinition({ purpose: 'Bad beds', filters: { city: 'Boulder', propertyType: 'Residential', statusScope: 'Active', bedsMin: 4, bedsMax: 2 } }),
  normalizeAgentCohortDefinition({ purpose: 'Bad baths', filters: { city: 'Boulder', propertyType: 'Residential', statusScope: 'Active', bathsMin: 3, bathsMax: 2 } }),
  normalizeAgentCohortDefinition({ purpose: 'Bad lot', filters: { city: 'Boulder', propertyType: 'Residential', statusScope: 'Active', lotSizeMin: 1, lotSizeMax: 0.5 } }),
  normalizeAgentCohortDefinition({ purpose: 'Exact outside beds', filters: { city: 'Boulder', propertyType: 'Residential', statusScope: 'Active', bedsMin: 4, bedsExact: 3 } }),
  normalizeAgentCohortDefinition({ purpose: 'Exact outside baths', filters: { city: 'Boulder', propertyType: 'Residential', statusScope: 'Active', bathsExact: 2.5, bathsMax: 2 } }),
  normalizeAgentCohortDefinition({ purpose: 'Negative lot', filters: { city: 'Boulder', propertyType: 'Residential', statusScope: 'Active', lotSizeMin: -0.1 } }),
  normalizeAgentCohortDefinition({ purpose: 'ZIP rejected', filters: { city: 'Boulder', propertyType: 'Residential', statusScope: 'Active', zip: '80301' } as never }),
]) {
  assert.equal(invalid.validation.ready, false);
}

const parsedZip = parseAgentCohortSearchParams(new URLSearchParams('city=boulder&propertyType=residential&statusScope=active&zip=80301'));
assert.equal(parsedZip.unsupportedFilters?.includes('zip'), true);
assert.equal(normalizeAgentCohortDefinition(parsedZip).validation.ready, false);

const parsedComparison = parseAgentComparisonSearchParams(new URLSearchParams('cohortCount=3&cohort.0.city=boulder&cohort.0.propertyType=residential&cohort.0.statusScope=active&cohort.0.bedsExact=3&cohort.1.city=louisville&cohort.1.propertyType=residential&cohort.1.statusScope=active&cohort.1.bedsExact=3&cohort.2.city=lafayette&cohort.2.propertyType=residential&cohort.2.statusScope=active&cohort.2.bedsExact=3'));
assert.equal(parsedComparison.cohorts.length, 3);
assert.equal(normalizeAgentCohortDefinition(parsedComparison.cohorts[0].cohort).filters.bedsExact, 3);

const parsedComparisonZip = parseAgentComparisonSearchParams(new URLSearchParams('a.city=boulder&a.propertyType=residential&a.statusScope=active&a.zip=80301&b.city=louisville&b.propertyType=residential&b.statusScope=active'));
assert.equal(parsedComparisonZip.cohorts[0].cohort.unsupportedFilters?.includes('zip'), true);

assert.equal(classifyAgentCohortRelationship(bedroomExact, normalizeAgentCohortDefinition({ purpose: 'Four beds', filters: { city: 'Boulder', propertyType: 'Residential', statusScope: 'Active', bedsExact: 4 } })), 'DISJOINT');
assert.equal(classifyAgentCohortRelationship(bedroomExact, bedroomRange), 'SUBSET');

const buyerBase = normalizeAgentCohortDefinition({ purpose: 'Buyer base', filters: { city: 'Boulder', propertyType: 'Residential', statusScope: 'Active' } }).filters;
let buyerProfile = createPropertyCriteriaProfile('BUYER_PREFERENCE');
buyerProfile = updatePropertyCriteriaRange(buyerProfile, 'bedrooms', { min: 2, max: 3, intent: 'MUST_HAVE' });
buyerProfile = updatePropertyCriteriaRange(buyerProfile, 'bathrooms', { min: 2, max: 2.5, intent: 'MUST_HAVE' });
buyerProfile = updatePropertyCriteriaRange(buyerProfile, 'garageSpaces', { min: 2, intent: 'PREFERRED' });
buyerProfile = updatePropertyCriteriaRange(buyerProfile, 'lotSquareFeet', { min: 7000, max: 12000, intent: 'PREFERRED' });
const buyer = mapBuyerCriteriaToAgentCohort(buyerProfile, buyerBase);
assert.equal(buyer.filters.bedsMax, 3);
assert.equal(buyer.filters.bathsMax, 2.5);
assert.equal(buyer.mappedCriteria.includes('maximum bedrooms'), true);
assert.equal(buyer.mappedCriteria.includes('maximum bathrooms'), true);
assert.equal(buyer.unmappedCriteria.includes('lot size'), true);
assert.equal(buyer.unmappedCriteria.includes('garage or parking spaces'), true);

const subjectDefault = deriveCompetingCohortInput(CURRENT_COMPETING_LISTING_CONTEXT_FIXTURES.validSubject);
const subjectRefined = deriveCompetingCohortInput(CURRENT_COMPETING_LISTING_CONTEXT_FIXTURES.validSubject, { filters: { bedsExact: 3, bathsMin: 2.5, bathsMax: 3, lotSizeMin: 0.1 } });
assert.equal(subjectDefault.derivation, 'SYSTEM_DERIVED_DEFAULT_COMPETING_COHORT');
assert.equal(normalizeAgentCohortDefinition(subjectDefault.input).filters.bedsExact, null);
assert.equal(subjectRefined.derivation, 'AGENT_ADJUSTED_COMPETING_COHORT');
assert.equal(normalizeAgentCohortDefinition(subjectRefined.input).filters.bedsExact, 3);
assert.equal(normalizeAgentCohortDefinition(subjectRefined.input).filters.bathsMin, 2.5);
assert.equal(normalizeAgentCohortDefinition(subjectRefined.input).filters.bathsMax, 3);

const registrySource = fs.readFileSync('lib/agentAdmittedFilterRegistry.ts', 'utf8');
for (const forbidden of ['PrismaClient', 'fetch(', 'process.env', '.create(', '.update(', '.upsert(', '.delete(']) {
  assert.equal(registrySource.includes(forbidden), false, `Registry must remain inert and must not include ${forbidden}`);
}

const ui = fs.readFileSync('components/agent/PropertyConversationExperience.tsx', 'utf8');
assert(ui.includes('Exact beds'));
assert(ui.includes('Exact baths'));
assert(ui.includes('Minimum lot acres'));
assert(ui.includes('Maximum lot acres'));
assert(ui.includes('data-agent-current-competing-listing-context-cma="false"'));

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };
assert.equal(packageJson.scripts?.['check:admitted-filter-registry-priority-1-property-segmentation-wave-7'], 'jiti scripts/checkAdmittedFilterRegistryPriority1PropertySegmentationWave7.ts');

console.log('ADMITTED_FILTER_REGISTRY_PRIORITY_1_PROPERTY_SEGMENTATION_WAVE_7_CHECK: PASS');
