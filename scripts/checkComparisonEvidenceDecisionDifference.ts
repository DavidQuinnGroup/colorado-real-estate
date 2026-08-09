import assert from 'node:assert/strict';
import fs from 'node:fs';

import { buildPropertyComparisonWorkspace } from '../lib/propertyComparisonIntelligence.js';
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

const comparisonModel = read('lib/propertyComparisonIntelligence.ts');
const propertyExperience = read('components/PropertyProduct31Experience.tsx');
const propertyModel = read('lib/propertyProduct31.ts');
const evidenceCompletenessModel = read('lib/propertyEvidenceCompletenessVerification.ts');
const sourceRegistry = read('lib/sourceRegistry.ts');
const handoffModel = read('lib/professionalHandoffCohesion.ts');
const inquiryForm = read('components/PropertyInquiryForm.tsx');
const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
const tsconfig = read('tsconfig.worker.json');
const chatStart = read('docs/CHAT_START.md');

assert.equal(
  packageJson.scripts?.['check:comparison-evidence-decision-difference'],
  'npm run worker:build && node dist/scripts/checkComparisonEvidenceDecisionDifference.js',
  'package.json must expose comparison evidence decision-difference validation.',
);
assertIncludes(tsconfig, '"scripts/checkComparisonEvidenceDecisionDifference.ts"', 'Worker build must include comparison evidence decision-difference validation.');

for (const requiredModelMarker of [
  'SUPPORTED DIFFERENCE',
  'DERIVED / CALCULATED DIFFERENCE',
  'EVIDENCE ASYMMETRY',
  'UNAVAILABLE COMPARISON',
  'VERIFICATION REQUIRED',
  'PROFESSIONAL JUDGMENT',
  'More available data does not mean a better property',
  "sourceMethodologyHref: '/sources'",
]) {
  assertIncludes(comparisonModel, requiredModelMarker, `Comparison evidence model missing ${requiredModelMarker}`);
}

for (const requiredSurfaceMarker of [
  'data-testid="property-comparison-evidence-integrity-summary"',
  'data-testid="property-comparison-limitation"',
  'data-testid="property-comparison-source-methodology-link"',
  'data-property-comparison-evidence-integrity={dimension.evidenceIntegrity}',
  'data-property-comparison-evidence-basis={dimension.evidenceBasis}',
  'data-property-comparison-verification-action={dimension.verificationAction}',
  'data-property-comparison-evidence-asymmetry={comparison.synthesis.evidenceAsymmetry}',
  'data-property-comparison-professional-judgment={comparison.synthesis.professionalJudgment}',
]) {
  assertIncludes(propertyExperience, requiredSurfaceMarker, `Property Product comparison surface missing ${requiredSurfaceMarker}`);
}

const comparison = buildPropertyComparisonWorkspace({
  subject: {
    id: 'subject',
    address: '100 Main St',
    city: 'Boulder',
    neighborhood: 'Mapleton Hill',
    price: 1000000,
    beds: 4,
    baths: 3,
    sqft: 2500,
    lotSize: 0.2,
    yearBuilt: 1970,
    propertyType: 'Detached',
    status: 'Active',
  },
  comparisons: [
    {
      id: 'comparison-1',
      address: '200 Main St',
      city: 'Boulder',
      neighborhood: 'Whittier',
      price: 850000,
      beds: 3,
      baths: 2,
      sqft: 1900,
      status: 'Active',
    },
  ],
});

const item = comparison.comparisons[0];
assert.equal(comparison.status, 'PROPERTY_COMPARISON_INTELLIGENCE_IMPLEMENTED');
assert.equal(comparison.sourceMethodologyHref, '/sources');
assertIncludes(comparison.evidenceAsymmetryBoundary, 'More available data does not mean a better property', 'Comparison boundary must state data availability is not quality.');
assert.equal(item.dimensions.length, 11, 'Comparison must preserve the existing bounded dimension set.');
assert(item.dimensions.some((dimension) => dimension.evidenceIntegrity === 'SUPPORTED DIFFERENCE'), 'Comparison must classify supported differences.');
assert(item.dimensions.some((dimension) => dimension.evidenceIntegrity === 'DERIVED / CALCULATED DIFFERENCE'), 'Comparison must classify calculated differences.');
assert(item.dimensions.some((dimension) => dimension.evidenceIntegrity === 'EVIDENCE ASYMMETRY'), 'Comparison must classify one-sided evidence availability.');
assert(item.dimensions.some((dimension) => dimension.evidenceIntegrity === 'UNAVAILABLE COMPARISON'), 'Comparison must classify unavailable comparisons.');
assert(item.dimensions.some((dimension) => dimension.evidenceIntegrity === 'VERIFICATION REQUIRED'), 'Comparison must classify verification-required differences.');
assert(item.integrity.limitations.some((limitation) => limitation.state === 'PROFESSIONAL JUDGMENT'), 'Comparison must preserve professional judgment limitations.');
assert(item.integrity.limitations.some((limitation) => limitation.domain === 'condition / inspection' && limitation.verificationAction === 'DISCUSS WITH INSPECTOR'), 'Inspection differences must route to inspector discussion.');
assert(item.integrity.limitations.some((limitation) => limitation.domain === 'title / legal' && limitation.verificationAction === 'DISCUSS WITH ATTORNEY'), 'Title/legal differences must route to attorney discussion.');
assert(item.integrity.limitations.some((limitation) => limitation.domain === 'tax' && limitation.verificationAction === 'DISCUSS WITH TAX PROFESSIONAL'), 'Tax limitations must route to tax professional discussion.');
assert(item.integrity.limitations.some((limitation) => limitation.domain === 'permit' && limitation.verificationAction === 'VERIFY WITH COUNTY'), 'Permit limitations must route to county verification.');
assert(item.synthesis.evidenceAsymmetry > 0, 'Synthesis must count evidence asymmetry.');
assert(item.synthesis.unavailableComparison > 0, 'Synthesis must count unavailable comparison states.');
assert(item.synthesis.derivedCalculatedDifference > 0, 'Synthesis must count derived/calculated differences.');
assert(item.synthesis.professionalJudgment === 0, 'Displayed dimensions should not manufacture professional judgment facts.');
assert(item.dimensions.every((dimension) => dimension.comparisonLimitation.length > 20), 'Each dimension must explain the comparison limitation.');
assert(item.dimensions.every((dimension) => dimension.verificationAction.length > 5), 'Each dimension must include a bounded verification action.');

const financingComparison = buildPropertyComparisonWorkspace({
  subject: {
    id: 'subject',
    address: '100 Main St',
    city: 'Boulder',
    price: 1000000,
    sqft: 2500,
  },
  comparisons: [
    {
      id: 'comparison-2',
      address: '300 Main St',
      city: 'Boulder',
      price: 900000,
      sqft: 2200,
    },
  ],
  financingAssumption: {
    downPayment: 200000,
    interestRate: 6,
    loanTermYears: 30,
    propertyTaxes: 450,
    homeownersInsurance: 180,
    hoaDues: 75,
    mortgageInsurance: 0,
  },
});
const financingDimension = financingComparison.comparisons[0].dimensions.find((dimension) => dimension.key === 'financingScenario');
assert.equal(financingDimension?.evidenceBasis, 'CALCULATED ESTIMATE');
assert.equal(financingDimension?.evidenceIntegrity, 'DERIVED / CALCULATED DIFFERENCE');
assertIncludes(financingDimension?.comparisonLimitation ?? '', 'not affordability, approval, loan advice, or lender qualification', 'Financing comparison must preserve no-affordability/no-qualification boundary.');

const product = buildPropertyProduct31Model({
  address: '100 Main St',
  city: 'Boulder',
  state: 'CO',
  zip: '80302',
  neighborhood: 'Mapleton Hill',
  propertyType: 'Detached',
  status: 'Active',
  price: 1000000,
  beds: 4,
  baths: 3,
  sqft: 2500,
  lotSize: 0.2,
  yearBuilt: 1970,
  relatedListings: [
    {
      id: 'comparison-1',
      address: '200 Main St',
      city: 'Boulder',
      state: 'CO',
      neighborhood: 'Whittier',
      price: 850000,
      beds: 3,
      baths: 2,
      sqft: 1900,
      status: 'Active',
    },
  ],
});
assert.equal(product.comparisonIntelligence.sourceMethodologyHref, '/sources');
assert(product.comparisonIntelligence.comparisons[0].synthesis.evidenceAsymmetry > 0, 'Property Product 3.1 must expose comparison evidence asymmetry.');
assertIncludes(evidenceCompletenessModel, 'Evidence gaps can explain why two properties are harder to compare', 'Evidence completeness boundary must remain linked to comparison limits.');
assertIncludes(sourceRegistry, 'REIE_SOURCE_REGISTRY_IMPLEMENTED', 'Source Registry must remain canonical.');
assertIncludes(handoffModel, 'REIE_PROFESSIONAL_HANDOFF_COHESION_IMPLEMENTED', 'Professional handoff architecture must remain available.');
assertIncludes(inquiryForm, 'data-property-inquiry-hidden-transfer="false"', 'Property Inquiry hidden transfer must remain false.');
assertIncludes(inquiryForm, 'data-property-inquiry-auto-populated-notes="false"', 'Property Inquiry auto-populated notes must remain false.');
assertIncludes(chatStart, 'READY_FOR_NEXT_REIE_EXECUTIVE_DEVELOPMENT_CYCLE', 'CHAT_START must reconcile the stale closure-sync gate.');
assertIncludes(chatStart, 'COMPARISON_EVIDENCE_DECISION_DIFFERENCE_PRODUCTION_CERTIFIED_AND_CLOSED', 'CHAT_START must preserve the comparison evidence production closure state.');

for (const [key, value] of Object.entries(comparison.protectedBoundaries)) {
  assert.equal(value, false, `Comparison protected boundary must remain false: ${key}`);
}

for (const forbidden of [
  'winner',
  'best property',
  'recommended property',
  'fit score',
  'quality score',
  'risk score',
  'confidence score',
  'investment score',
  'completeness score',
  'weighted ranking',
  'red/yellow/green',
  'school ranking',
  'safety ranking',
  'you qualify',
  'you are approved',
  'lender recommendation',
  'fetch(',
  'localStorage',
  'sessionStorage',
  'navigator.sendBeacon',
  'prisma.',
  'createClient(',
]) {
  assertNotIncludes([comparisonModel, propertyExperience].join('\n'), forbidden, `Comparison evidence decision-difference must not include ${forbidden}.`);
}

console.log('[comparison-evidence-decision-difference] ok: evidence integrity states, asymmetry, limitations, verification actions, financing boundaries, source trust, customer control, and no-winner protections verified.');
