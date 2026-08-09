import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  PROPERTY_EVIDENCE_COMPLETENESS_VERIFICATION_STATUS,
  buildPropertyEvidenceCompletenessVerification,
} from '../lib/propertyEvidenceCompletenessVerification.js';
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

const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfig = read('tsconfig.worker.json');
const modelSource = read('lib/propertyEvidenceCompletenessVerification.ts');
const productModelSource = read('lib/propertyProduct31.ts');
const component = read('components/PropertyProduct31Experience.tsx');
const inquiryModel = read('lib/propertyInquiryDecisionContinuity.ts');
const handoffModel = read('lib/professionalHandoffCohesion.ts');
const comparisonModel = read('lib/propertyComparisonIntelligence.ts');
const sourceRegistry = read('lib/sourceRegistry.ts');

assert.equal(
  packageJson.scripts?.['check:property-evidence-completeness-verification'],
  'npm run worker:build && node dist/scripts/checkPropertyEvidenceCompletenessVerification.js',
  'package.json must expose the property evidence completeness verification check.',
);
assertIncludes(tsconfig, '"scripts/checkPropertyEvidenceCompletenessVerification.ts"', 'Worker tsconfig must compile the property evidence completeness check.');
assertIncludes(tsconfig, '"lib/propertyEvidenceCompletenessVerification.ts"', 'Worker tsconfig must compile the property evidence completeness model.');

assertIncludes(productModelSource, 'buildPropertyEvidenceCompletenessVerification', 'Property Product 3.1 must build the evidence completeness model.');
assertIncludes(productModelSource, 'evidenceCompleteness: PropertyEvidenceCompletenessVerification', 'Property Product 3.1 model must expose evidence completeness.');
assertIncludes(component, 'data-testid="property-evidence-completeness-verification"', 'Property Product 3.1 must render the evidence completeness surface.');
assertIncludes(component, 'data-testid="property-evidence-completeness-domain"', 'Property Product 3.1 must render domain-level evidence completeness.');
assertIncludes(component, 'data-testid="property-evidence-completeness-methodology-link"', 'Evidence completeness must link to Sources & Methodology.');
assertIncludes(component, 'data-testid="property-evidence-completeness-trust-boundaries"', 'Evidence completeness must render customer trust boundaries.');

for (const expectedBoundary of [
  'data-property-evidence-completeness-score={String(model.evidenceCompleteness.protectedBoundaries.score)}',
  'data-property-evidence-completeness-percentage={String(model.evidenceCompleteness.protectedBoundaries.percentage)}',
  'data-property-evidence-completeness-grade={String(model.evidenceCompleteness.protectedBoundaries.grade)}',
  'data-property-evidence-completeness-rating={String(model.evidenceCompleteness.protectedBoundaries.rating)}',
  'data-property-evidence-completeness-ranking={String(model.evidenceCompleteness.protectedBoundaries.ranking)}',
  'data-property-evidence-completeness-suitability={String(model.evidenceCompleteness.protectedBoundaries.suitability)}',
  'data-property-evidence-completeness-provider-activation={String(model.evidenceCompleteness.protectedBoundaries.providerActivation)}',
  'data-property-evidence-completeness-county-activation={String(model.evidenceCompleteness.protectedBoundaries.countyActivation)}',
  'data-property-evidence-completeness-bcod-activation={String(model.evidenceCompleteness.protectedBoundaries.bcodActivation)}',
  'data-property-evidence-completeness-record-retrieval={String(model.evidenceCompleteness.protectedBoundaries.recordRetrieval)}',
  'data-property-evidence-completeness-inquiry-mutation={String(model.evidenceCompleteness.protectedBoundaries.inquiryMutation)}',
  'data-property-evidence-completeness-contact-mutation={String(model.evidenceCompleteness.protectedBoundaries.contactMutation)}',
  'data-property-evidence-completeness-telemetry={String(model.evidenceCompleteness.protectedBoundaries.telemetry)}',
]) {
  assertIncludes(component, expectedBoundary, `Evidence completeness boundary marker missing: ${expectedBoundary}`);
}

const readyModel = buildPropertyProduct31Model({
  address: '100 Main St',
  city: 'Boulder',
  state: 'CO',
  zip: '80302',
  neighborhood: 'Mapleton Hill',
  subdivision: 'Mapleton',
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
  ],
});

assert.equal(readyModel.evidenceCompleteness.status, PROPERTY_EVIDENCE_COMPLETENESS_VERIFICATION_STATUS);
assert.equal(readyModel.evidenceCompleteness.sourceMethodologyHref, '/sources');
assert.equal(readyModel.evidenceCompleteness.domains.length, 11, 'Evidence completeness must expose the authorized domain set.');
assert(readyModel.evidenceCompleteness.domains.some((domain) => domain.key === 'LISTING_MLS_EVIDENCE' && domain.state === 'SUPPORTED FACT'), 'Listing evidence must be supported when core public listing fields exist.');
assert(readyModel.evidenceCompleteness.domains.some((domain) => domain.key === 'PROPERTY_CHARACTERISTICS' && domain.state === 'SUPPORTED FACT'), 'Property characteristics must be supported when core characteristics exist.');
assert(readyModel.evidenceCompleteness.domains.some((domain) => domain.key === 'PRICE_LISTING_HISTORY' && domain.state === 'DERIVED / CALCULATED'), 'Price/listing history must remain derived or calculated, not conclusive.');
assert(readyModel.evidenceCompleteness.domains.some((domain) => domain.key === 'PUBLIC_RECORD_EVIDENCE' && domain.state === 'VERIFICATION REQUIRED'), 'Public record evidence must stay verification required.');
assert(readyModel.evidenceCompleteness.domains.some((domain) => domain.key === 'TAX_EVIDENCE' && domain.state === 'UNAVAILABLE'), 'Tax evidence must stay unavailable without retrieval.');
assert(readyModel.evidenceCompleteness.domains.some((domain) => domain.key === 'PERMIT_EVIDENCE' && domain.state === 'UNAVAILABLE'), 'Permit evidence must stay unavailable without retrieval.');
assert(readyModel.evidenceCompleteness.domains.some((domain) => domain.key === 'CONDITION_INSPECTION_EVIDENCE' && domain.state === 'PROFESSIONAL JUDGMENT'), 'Inspection evidence must remain professional judgment.');
assert(readyModel.evidenceCompleteness.domains.some((domain) => domain.key === 'TITLE_LEGAL_EVIDENCE' && domain.verificationAction === 'DISCUSS WITH ATTORNEY'), 'Title/legal evidence must route to attorney discussion.');
assert(readyModel.evidenceCompleteness.domains.some((domain) => domain.key === 'FINANCING_RELATED_INPUTS' && domain.verificationAction === 'DISCUSS WITH LENDER'), 'Financing inputs must route to lender discussion.');

for (const action of [
  'CHECK SOURCE',
  'ASK SELLER / LISTING AGENT',
  'VERIFY WITH COUNTY',
  'REVIEW HOA DOCUMENTS',
  'DISCUSS WITH INSPECTOR',
  'DISCUSS WITH ATTORNEY',
  'DISCUSS WITH LENDER',
  'DISCUSS WITH TAX PROFESSIONAL',
]) {
  assert(readyModel.evidenceCompleteness.domains.some((domain) => domain.verificationAction === action), `Missing verification action: ${action}`);
}

for (const boundary of [
  'DATA AVAILABILITY DOES NOT EQUAL PROPERTY QUALITY',
  'MISSING DATA DOES NOT EQUAL NEGATIVE PROPERTY CONDITION',
  'PUBLIC RECORD DOES NOT GUARANTEE CURRENT CONDITION',
  'MLS/LISTING INFORMATION DOES NOT EQUAL INDEPENDENT VERIFICATION',
]) {
  assert(readyModel.evidenceCompleteness.customerTrustBoundaries.includes(boundary), `Missing customer trust boundary: ${boundary}`);
}

for (const [key, value] of Object.entries(readyModel.evidenceCompleteness.protectedBoundaries)) {
  assert.equal(value, false, `Protected evidence completeness boundary must remain false: ${key}`);
}

const sparseModel = buildPropertyProduct31Model({
  city: 'Broomfield',
  propertyType: 'Residential',
  price: 800000,
});

assert(sparseModel.evidenceCompleteness.domains.some((domain) => domain.key === 'LISTING_MLS_EVIDENCE' && domain.state === 'SUPPORTED FACT'), 'Sparse listing evidence can be supported by limited but available listing fields.');
assert(sparseModel.evidenceCompleteness.domains.some((domain) => domain.key === 'PROPERTY_CHARACTERISTICS' && domain.state === 'VERIFICATION REQUIRED'), 'Sparse property characteristics must become verification required.');
assert(sparseModel.evidenceCompleteness.domains.some((domain) => domain.key === 'PUBLIC_RECORD_EVIDENCE' && domain.verificationAction === 'VERIFY WITH COUNTY'), 'Sparse public records must route to county verification without retrieval.');

const directModel = buildPropertyEvidenceCompletenessVerification({
  property: { city: 'Boulder', propertyType: 'Residential' },
  authoritativeSources: readyModel.authoritativeSources,
  comparisonIntelligence: readyModel.comparisonIntelligence,
});
assert.equal(directModel.status, PROPERTY_EVIDENCE_COMPLETENESS_VERIFICATION_STATUS);

for (const forbidden of [
  'completeness score',
  'completeness percentage',
  'property grade',
  'quality score',
  'suitability score',
  'investment score',
  'pre-approved',
  'preferred lender',
  'guaranteed',
  'perfect home',
  'BCOD API',
  'BCOD dataset',
  'owner identity',
  'parcel display',
]) {
  assertNotIncludes(modelSource, forbidden, `Evidence completeness model must not include forbidden copy: ${forbidden}`);
}

assert(!modelSource.match(/fetch\(|prisma\.|createClient\(|process\.env|XMLHttpRequest|sendBeacon|localStorage|sessionStorage/), 'Evidence completeness model must not fetch, use providers, mutate storage, or access env.');
assert(!component.match(/fetch\(|XMLHttpRequest|navigator\.sendBeacon/), 'Property Product 3.1 component must remain read-only and telemetry-free.');
assertIncludes(sourceRegistry, 'REIE_SOURCE_REGISTRY_IMPLEMENTED', 'Evidence completeness must preserve current Source Registry implementation state.');
assertIncludes(inquiryModel, 'autoPopulateNotes: false', 'Property Inquiry must not be auto-populated.');
assertIncludes(inquiryModel, 'propertyAnalysisTransfer: false', 'Property Inquiry must not receive automatic property evidence transfer.');
assertIncludes(handoffModel, 'REIE_PROFESSIONAL_HANDOFF_COHESION_IMPLEMENTED', 'Professional handoff domains must remain governed.');
assertIncludes(handoffModel, "'REAL ESTATE AGENT'", 'Professional handoff must retain real estate agent domain.');
assertIncludes(handoffModel, "'INSPECTOR / ENGINEER'", 'Professional handoff must retain inspector / engineer domain.');
assertIncludes(handoffModel, "'ATTORNEY'", 'Professional handoff must retain attorney domain.');
assertIncludes(handoffModel, "'TAX PROFESSIONAL'", 'Professional handoff must retain tax professional domain.');
assertIncludes(handoffModel, "'APPRAISER'", 'Professional handoff must retain appraiser domain.');
assertIncludes(comparisonModel, 'evidence asymmetry, unavailable evidence, professional-judgment boundaries, and verification prompts only; it does not rank, score, value, recommend, or infer suitability', 'Comparison behavior must retain evidence-gap boundary.');

console.log('[property-evidence-completeness-verification] ok: domain status, verification actions, source containment, handoff boundaries, comparison boundary, and no-score protections verified.');
