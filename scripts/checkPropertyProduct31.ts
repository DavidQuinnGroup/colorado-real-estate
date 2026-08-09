import assert from 'node:assert/strict';
import fs from 'node:fs';

import { buildPropertyProduct31Model } from '../lib/propertyProduct31.js';

function read(filePath: string) {
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source: string, value: string, message: string) {
  assert(source.includes(value), message);
}

function assertNotIncludes(source: string, value: string, message: string) {
  assert(!source.includes(value), message);
}

const propertyPage = read('app/properties/[id]/page.tsx');
const component = read('components/PropertyProduct31Experience.tsx');
const model = read('lib/propertyProduct31.ts');
const sourceModel = read('lib/property/propertyAuthoritativeSourceIntelligence.ts');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };

assertIncludes(model, 'buildPropertyProduct31Model', 'Property Product 3.1 must expose a deterministic model builder.');
assertIncludes(model, 'buildPropertyGeographicSourceIntelligence', 'Property Product 3.1 must consume governed geographic/source intelligence.');
assertIncludes(model, 'buildPropertyEvidenceCompletenessVerification', 'Property Product 3.1 must consume evidence completeness verification intelligence.');
assertIncludes(propertyPage, 'buildPropertyProduct31Model', 'Property page must build the Property Product 3.1 model from existing data.');
assertIncludes(propertyPage, 'relatedListings,', 'Property Product 3.1 must reuse existing related-listing context.');
assertIncludes(propertyPage, '<PropertyProduct31Experience model={propertyProduct31Model} />', 'Property page must render the Property Product 3.1 experience.');

for (const expectedSurface of [
  'data-testid="property-product-3-1-root"',
  'data-testid="property-product-3-1-decision-profile-item"',
  'data-testid="property-product-3-1-property-dna"',
  'data-testid="property-product-3-1-confidence-layer"',
  'data-testid="property-evidence-completeness-verification"',
  'data-testid="property-evidence-completeness-domain"',
  'data-testid="property-evidence-completeness-methodology-link"',
  'data-testid="property-geographic-source-intelligence"',
  'data-testid="property-public-record-evidence-profile"',
  'data-testid="property-geographic-source-item"',
  'data-testid="property-product-3-1-comparable-context"',
  'data-testid="property-comparison-intelligence"',
  'data-testid="property-comparison-intelligence-item"',
  'data-testid="property-comparison-dimension"',
  'data-testid="property-comparison-evidence-integrity-summary"',
  'data-testid="property-comparison-limitation"',
  'data-testid="property-comparison-source-methodology-link"',
  'data-testid="property-product-3-1-verification-checklist"',
  'data-testid="property-product-3-1-mobile-decision-rail"',
]) {
  assertIncludes(component, expectedSurface, `Property Product 3.1 surface missing: ${expectedSurface}`);
}

for (const expectedBoundary of [
  'data-property-product-3-1-ai="false"',
  'data-property-product-3-1-gis="false"',
  'data-property-product-3-1-provider-activation="false"',
  'data-property-product-3-1-telemetry="false"',
  'data-property-product-3-1-forecasting="false"',
  'data-property-product-3-1-valuation-model="false"',
  'data-property-product-3-1-rankings="false"',
  'data-property-product-3-1-fixture-data="false"',
  'data-property-evidence-completeness-score={String(model.evidenceCompleteness.protectedBoundaries.score)}',
  'data-property-evidence-completeness-ranking={String(model.evidenceCompleteness.protectedBoundaries.ranking)}',
  'data-property-evidence-completeness-provider-activation={String(model.evidenceCompleteness.protectedBoundaries.providerActivation)}',
  'data-property-evidence-completeness-county-activation={String(model.evidenceCompleteness.protectedBoundaries.countyActivation)}',
  'data-property-evidence-completeness-bcod-activation={String(model.evidenceCompleteness.protectedBoundaries.bcodActivation)}',
  'data-property-evidence-completeness-record-retrieval={String(model.evidenceCompleteness.protectedBoundaries.recordRetrieval)}',
  'data-property-evidence-completeness-inquiry-mutation={String(model.evidenceCompleteness.protectedBoundaries.inquiryMutation)}',
  'data-property-evidence-completeness-contact-mutation={String(model.evidenceCompleteness.protectedBoundaries.contactMutation)}',
  'data-property-evidence-completeness-telemetry={String(model.evidenceCompleteness.protectedBoundaries.telemetry)}',
  'data-property-record-intelligence={recordEvidence.status}',
  'data-property-record-disposition-assessor={recordDisposition',
  'data-property-record-disposition-tax={recordDisposition',
  'data-property-record-disposition-permit={recordDisposition',
  'data-property-record-customer-display={String(recordEvidence.protectedBoundaries.customerRecordDisplay)}',
  'data-property-record-retrieval={String(recordEvidence.protectedBoundaries.recordRetrieval)}',
  'data-property-geographic-source-bcod-address-points={String(model.authoritativeSources.protectedBoundaries.bcodAddressPoints)}',
  'data-property-geographic-source-bcod-park-boundaries={String(model.authoritativeSources.protectedBoundaries.bcodParkBoundaries)}',
  'data-property-geographic-source-provider-activation={String(model.authoritativeSources.protectedBoundaries.providerActivation)}',
  'data-property-geographic-source-public-gis={String(model.authoritativeSources.protectedBoundaries.publicGis)}',
  'data-property-geographic-source-persistence={String(model.authoritativeSources.protectedBoundaries.persistence)}',
  'data-property-geographic-source-prisma-change={String(model.authoritativeSources.protectedBoundaries.prismaChange)}',
  'data-property-geographic-source-telemetry={String(model.authoritativeSources.protectedBoundaries.telemetry)}',
  'data-property-geographic-source-customer-data-mutation={String(model.authoritativeSources.protectedBoundaries.customerDataMutation)}',
  'data-property-dna-scoring="false"',
  'data-property-dna-ranking="false"',
  'data-property-dna-valuation="false"',
  'data-property-dna-recommendation="false"',
  'data-comparable-context-ranking="false"',
  'data-comparable-context-valuation="false"',
  'data-comparable-context-investment-advice="false"',
  'data-property-comparison-intelligence={model.comparisonIntelligence.status}',
  'data-property-comparison-ranking={String(model.comparisonIntelligence.protectedBoundaries.ranking)}',
  'data-property-comparison-scoring={String(model.comparisonIntelligence.protectedBoundaries.scoring)}',
  'data-property-comparison-valuation={String(model.comparisonIntelligence.protectedBoundaries.valuation)}',
  'data-property-comparison-suitability={String(model.comparisonIntelligence.protectedBoundaries.suitabilityRecommendation)}',
  'data-property-comparison-financing-approval={String(model.comparisonIntelligence.protectedBoundaries.financingApproval)}',
  'data-property-comparison-evidence-integrity={dimension.evidenceIntegrity}',
  'data-property-comparison-verification-action={dimension.verificationAction}',
]) {
  assertIncludes(component, expectedBoundary, `Property Product 3.1 boundary missing: ${expectedBoundary}`);
}

assertIncludes(model, 'Existing public property data only', 'Trust boundary must stay tied to existing public property data.');
assertIncludes(model, 'no AI', 'Trust boundary must preserve no-AI exclusion.');
assertIncludes(model, 'no public GIS', 'Trust boundary must preserve no-public-GIS exclusion.');
assertIncludes(model, 'no provider activation', 'Trust boundary must preserve provider exclusion.');
assertIncludes(model, 'no fixture data', 'Trust boundary must preserve fixture exclusion.');
assertIncludes(sourceModel, 'PROPERTY_GEOGRAPHIC_SOURCE_INTELLIGENCE_IMPLEMENTED', 'Source intelligence must expose an implementation status.');
assertIncludes(sourceModel, 'CITY_INTELLIGENCE_SOURCE_DOMAIN_MATRIX', 'Source intelligence must reuse the certified geographic source matrix.');
assertIncludes(sourceModel, 'COLORADO_CITY_INTELLIGENCE_RECORDS', 'Source intelligence must reuse existing city geographic records.');
assertIncludes(sourceModel, 'PROVIDER_CONFIRMATION_REQUIRED_FIRST', 'Source intelligence must keep BCOD provider-confirmation gate explicit.');

const readyModel = buildPropertyProduct31Model({
  address: '100 Main St',
  city: 'Boulder',
  neighborhood: 'Mapleton Hill',
  propertyType: 'Residential',
  status: 'Active',
  price: 1200000,
  sqft: 2400,
  beds: 4,
  baths: 3,
  yearBuilt: 1976,
  lotSize: 0.22,
  altitude: 5400,
  soilType: 'Front Range Mixed',
  photoCount: 8,
  relatedListings: [
    {
      id: 'related-1',
      address: '102 Main St',
      city: 'Boulder',
      state: 'CO',
      neighborhood: 'Mapleton Hill',
      price: 1275000,
      beds: 4,
      baths: 3,
      sqft: 2600,
      status: 'Active',
    },
    {
      id: 'related-2',
      address: '104 Main St',
      city: 'Boulder',
      state: 'CO',
      neighborhood: 'Whittier',
      price: 980000,
      beds: 3,
      baths: 2,
      sqft: 1900,
      status: 'Active',
    },
  ],
});

assert.equal(readyModel.profile.length, 3, 'Decision profile must expose three concise synthesis items.');
assert.equal(readyModel.dna.length, 4, 'Property DNA must expose four deterministic dimensions.');
assert.equal(readyModel.authoritativeSources.selectedSources.length, 7, 'Authoritative source readiness must expose listing, place, public-record, and BCOD gate items.');
assert.equal(readyModel.confidence.facets.length, 4, 'Confidence layer must expose four customer-facing evidence facets.');
assert.equal(readyModel.evidenceCompleteness.status, 'PROPERTY_EVIDENCE_COMPLETENESS_VERIFICATION_IMPLEMENTED');
assert.equal(readyModel.evidenceCompleteness.domains.length, 11, 'Evidence completeness must expose the authorized domain set.');
assert.equal(readyModel.comparables.length, 2, 'Comparable Context Panel must reuse related properties without creating new source data.');
assert.equal(readyModel.checklist.length, 4, 'Verification checklist must include financial, construction, market, and property categories.');
assert(readyModel.comparables.every((item) => item.similarities.length > 0 && item.differences.length > 0), 'Comparable items must explain factual similarities and differences.');
assert(readyModel.profile.some((item) => item.state === 'well-supported'), 'Complete facts must produce a well-supported profile signal.');
assert.equal(readyModel.authoritativeSources.status, 'PROPERTY_GEOGRAPHIC_SOURCE_INTELLIGENCE_IMPLEMENTED');
assert.equal(readyModel.comparisonIntelligence.status, 'PROPERTY_COMPARISON_INTELLIGENCE_IMPLEMENTED');
assert.equal(readyModel.comparisonIntelligence.canCompare, true, 'Comparison intelligence must use existing related listings when present.');
assert.equal(readyModel.comparisonIntelligence.comparisons.length, 2, 'Comparison intelligence must not create additional properties.');
assert(readyModel.comparisonIntelligence.comparisons.every((item) => item.dimensions.length >= 10), 'Comparison intelligence must expose factual dimensions and financing boundary context.');
assert(readyModel.comparisonIntelligence.comparisons.some((item) => item.synthesis.materiallyDifferent > 0), 'Comparison intelligence must identify factual differences without ranking.');
assert(readyModel.comparisonIntelligence.comparisons.some((item) => item.synthesis.evidenceUnavailable > 0), 'Comparison intelligence must surface missing evidence instead of filling gaps.');
assert(readyModel.comparisonIntelligence.comparisons.some((item) => item.synthesis.evidenceAsymmetry > 0), 'Comparison intelligence must surface one-sided evidence availability.');
assert(readyModel.comparisonIntelligence.comparisons.some((item) => item.integrity.limitations.some((limitation) => limitation.state === 'PROFESSIONAL JUDGMENT')), 'Comparison intelligence must preserve professional judgment limitations.');
assert.equal(readyModel.comparisonIntelligence.protectedBoundaries.ranking, false);
assert.equal(readyModel.comparisonIntelligence.protectedBoundaries.scoring, false);
assert.equal(readyModel.comparisonIntelligence.protectedBoundaries.valuation, false);
assert.equal(readyModel.comparisonIntelligence.protectedBoundaries.investmentAdvice, false);
assert.equal(readyModel.comparisonIntelligence.protectedBoundaries.suitabilityRecommendation, false);
assert.equal(readyModel.comparisonIntelligence.protectedBoundaries.fairHousingPreference, false);
assert.equal(readyModel.comparisonIntelligence.protectedBoundaries.financingApproval, false);
assert.equal(readyModel.comparisonIntelligence.protectedBoundaries.lenderQuote, false);
assert.equal(readyModel.comparisonIntelligence.protectedBoundaries.providerActivation, false);
assert.equal(readyModel.comparisonIntelligence.protectedBoundaries.persistence, false);
assert.equal(readyModel.comparisonIntelligence.protectedBoundaries.telemetry, false);
assert.equal(readyModel.evidenceCompleteness.protectedBoundaries.score, false);
assert.equal(readyModel.evidenceCompleteness.protectedBoundaries.percentage, false);
assert.equal(readyModel.evidenceCompleteness.protectedBoundaries.grade, false);
assert.equal(readyModel.evidenceCompleteness.protectedBoundaries.rating, false);
assert.equal(readyModel.evidenceCompleteness.protectedBoundaries.ranking, false);
assert.equal(readyModel.evidenceCompleteness.protectedBoundaries.suitability, false);
assert.equal(readyModel.evidenceCompleteness.protectedBoundaries.providerActivation, false);
assert.equal(readyModel.evidenceCompleteness.protectedBoundaries.countyActivation, false);
assert.equal(readyModel.evidenceCompleteness.protectedBoundaries.bcodActivation, false);
assert.equal(readyModel.evidenceCompleteness.protectedBoundaries.recordRetrieval, false);
assert.equal(readyModel.evidenceCompleteness.protectedBoundaries.inquiryMutation, false);
assert.equal(readyModel.evidenceCompleteness.protectedBoundaries.contactMutation, false);
assert.equal(readyModel.evidenceCompleteness.protectedBoundaries.telemetry, false);
assert.equal(
  readyModel.authoritativeSources.publicRecordEvidence.status,
  'AUTHORITATIVE_PROPERTY_RECORD_INTELLIGENCE_ARCHITECTURE_READY_SOURCE_CONFIRMATION_REQUIRED',
);
assert.equal(readyModel.authoritativeSources.geography.city, 'Boulder');
assert.equal(readyModel.authoritativeSources.protectedBoundaries.bcodAddressPoints, false);
assert.equal(readyModel.authoritativeSources.protectedBoundaries.bcodParkBoundaries, false);
assert.equal(readyModel.authoritativeSources.protectedBoundaries.providerActivation, false);
assert.equal(readyModel.authoritativeSources.protectedBoundaries.publicGis, false);
assert.equal(readyModel.authoritativeSources.protectedBoundaries.persistence, false);
assert(readyModel.authoritativeSources.selectedSources.some((source) => source.category === 'MLS_LISTING_DATA' && source.claimEligible), 'Existing listing facts must remain the only ready source.');
assert(readyModel.authoritativeSources.selectedSources.some((source) => source.category === 'COUNTY_ASSESSOR' && !source.claimEligible), 'Assessor source must fail closed.');
assert(readyModel.authoritativeSources.selectedSources.some((source) => source.category === 'COUNTY_TREASURER_TAX' && !source.claimEligible), 'Tax source must fail closed.');
assert(readyModel.authoritativeSources.selectedSources.some((source) => source.category === 'BUILDING_PERMITS' && !source.claimEligible), 'Permit source must fail closed.');
assert(readyModel.authoritativeSources.publicRecordEvidence.domainProfiles.every((profile) => profile.implementationDisposition === 'ARCHITECTURE_READY_SOURCE_CONFIRMATION_REQUIRED'), 'Assessor, tax, and permit dispositions must require source confirmation.');
assert.equal(readyModel.authoritativeSources.publicRecordEvidence.protectedBoundaries.recordRetrieval, false);
assert.equal(readyModel.authoritativeSources.publicRecordEvidence.protectedBoundaries.customerRecordDisplay, false);
assert(readyModel.authoritativeSources.selectedSources.some((source) => source.category === 'BCOD_ADDRESS_POINTS' && source.readiness === 'BLOCKED_NOT_AUTHORIZED'), 'BCOD Address Points must remain blocked.');
assert(readyModel.authoritativeSources.selectedSources.some((source) => source.category === 'BCOD_PARK_BOUNDARIES' && source.readiness === 'BLOCKED_NOT_AUTHORIZED'), 'BCOD Park Boundaries must remain blocked.');

const sparseModel = buildPropertyProduct31Model({
  city: 'Broomfield',
  propertyType: 'Residential',
  price: 800000,
});

assert(sparseModel.profile.some((item) => item.state === 'incomplete'), 'Sparse data must surface incomplete evidence.');
assert.equal(sparseModel.comparables.length, 0, 'Sparse related-listing context must not invent comparable properties.');
assert.equal(sparseModel.comparisonIntelligence.canCompare, false, 'Sparse related-listing context must not invent comparison intelligence.');
assert.equal(sparseModel.authoritativeSources.geography.city, 'Broomfield', 'Sparse model must still carry city geography from listing fields.');
assert(sparseModel.authoritativeSources.selectedSources.filter((source) => source.claimEligible).length <= 2, 'Sparse source model must keep claim eligibility narrow.');
assert(sparseModel.evidenceCompleteness.domains.some((domain) => domain.key === 'PROPERTY_CHARACTERISTICS' && domain.state === 'VERIFICATION REQUIRED'), 'Sparse property characteristics must remain verification-bound.');

for (const forbidden of [
  'OpenAI',
  'chatbot',
  'recommendation engine',
  'recommended offer',
  'guaranteed',
  'perfect home',
  'preferred lender',
  'pre-approved',
  'document.cookie =',
  'localStorage.setItem',
  'sessionStorage.setItem',
  'NON_PRODUCTION_FIXTURE',
  'GIS Sprint 9',
  'BCOD API',
  'BCOD dataset',
  'parcel display',
  'owner identity',
]) {
  assertNotIncludes([propertyPage, component, model, sourceModel].join('\n'), forbidden, `Property Product 3.1 must not include forbidden activation or certainty copy: ${forbidden}`);
}

assert(!propertyPage.match(/INSERT INTO|UPDATE "|DELETE FROM|prisma\.[a-zA-Z]+\.create|prisma\.[a-zA-Z]+\.update|prisma\.[a-zA-Z]+\.delete/), 'Property page must remain read-only.');
assert(!component.match(/fetch\(|XMLHttpRequest|navigator\.sendBeacon/), 'Property Product 3.1 component must not introduce API calls or telemetry.');
assert(!model.match(/fetch\(|prisma\.|createClient\(/), 'Property Product 3.1 model must not introduce data fetching, provider calls, or Prisma usage.');
assert(!sourceModel.match(/fetch\(|prisma\.|createClient\(|process\.env/), 'Source intelligence model must not introduce data fetching, provider calls, env access, or Prisma usage.');

assert.equal(
  packageJson.scripts?.['check:property-product-3-1'],
  'npm run worker:build && node dist/scripts/checkPropertyProduct31.js',
  'package.json must expose Property Product 3.1 certification check.',
);

console.log('[property-product-3-1] ok: decision profile, Property DNA, confidence layer, comparable context, verification checklist, mobile rail, and prohibited boundaries verified.');
