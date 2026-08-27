import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  ATLAS_OUTPUT_AUDIENCES,
  ATLAS_OUTPUT_MODULE_KINDS,
  ATLAS_OUTPUT_PRODUCT_KINDS,
  ATLAS_OUTPUT_SECTION_KINDS,
  ATLAS_OUTPUT_SUBJECT_KINDS,
  buildAtlasOutputProduct,
  SHARED_OUTPUT_PRODUCT_COMPOSITION_STATUS,
  SHARED_OUTPUT_PRODUCT_COMPOSITION_VERSION,
  SHARED_OUTPUT_PRODUCT_PROTECTED_BOUNDARIES,
  type AtlasOutputProductDefinition,
} from '../lib/sharedOutputProductComposition';
import {
  buildSellerPresentationComposition,
  SELLER_PRESENTATION_OUTPUT_COMPOSITION_STATUS,
  SELLER_PRESENTATION_OUTPUT_COMPOSITION_VERSION,
  SELLER_PRESENTATION_REFERENCE_PREPARATION,
} from '../lib/sellerPresentationOutputComposition';

const sharedContract = readFileSync('lib/sharedOutputProductComposition.ts', 'utf8');
const sellerContract = readFileSync('lib/sellerPresentationOutputComposition.ts', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };
const report = readFileSync(
  'docs/project-atlas/executive-library/SHARED-OUTPUT-PRODUCT-SECTION-MODULE-FOUNDATION-CERTIFICATION.md',
  'utf8',
);

assert.equal(SHARED_OUTPUT_PRODUCT_COMPOSITION_STATUS, 'PROJECT_ATLAS_SHARED_OUTPUT_PRODUCT_SECTION_MODULE_FOUNDATION_CERTIFIED');
assert.equal(SHARED_OUTPUT_PRODUCT_COMPOSITION_VERSION, 'SHARED_OUTPUT_PRODUCT_COMPOSITION_V1');
assert.equal(SELLER_PRESENTATION_OUTPUT_COMPOSITION_STATUS, 'PROJECT_ATLAS_SELLER_PRESENTATION_OUTPUT_COMPOSITION_FOUNDATION_ADMITTED');
assert.equal(SELLER_PRESENTATION_OUTPUT_COMPOSITION_VERSION, 'SELLER_PRESENTATION_OUTPUT_COMPOSITION_V1');

for (const productKind of [
  'SELLER_PRESENTATION',
  'BUYER_PRESENTATION',
  'MARKET_REPORT',
  'PROPERTY_ANALYSIS',
  'LOCATION_ANALYSIS',
  'INVESTMENT_PROPERTY_ANALYSIS',
  'MULTI_PROPERTY_FINANCIAL_BREAKEVEN_ANALYSIS',
  'ADVISORY_BRIEFING',
  'AGENT_INTERNAL_ANALYSIS',
]) {
  assert(ATLAS_OUTPUT_PRODUCT_KINDS.includes(productKind as never), `missing product kind ${productKind}`);
}

for (const audience of ['AGENT_INTERNAL', 'SELLER', 'BUYER', 'INVESTOR', 'HOMEOWNER', 'CLIENT', 'PROSPECT', 'PUBLIC']) {
  assert(ATLAS_OUTPUT_AUDIENCES.includes(audience as never), `missing audience ${audience}`);
}

for (const subject of ['PROPERTY', 'LOCATION', 'MARKET', 'COHORT', 'CLIENT_DECISION', 'PORTFOLIO_SCENARIO', 'MULTI_PROPERTY_SCENARIO']) {
  assert(ATLAS_OUTPUT_SUBJECT_KINDS.includes(subject as never), `missing subject ${subject}`);
}

for (const sectionKind of ['EXECUTIVE_OVERVIEW', 'PROPERTY_FACTS', 'MARKET_CONTEXT', 'FINANCIAL_CONTEXT', 'EVIDENCE_AND_LIMITATIONS']) {
  assert(ATLAS_OUTPUT_SECTION_KINDS.includes(sectionKind as never), `missing section kind ${sectionKind}`);
}

for (const moduleKind of ['EXECUTIVE_SUMMARY', 'SUBJECT_PROPERTY', 'MARKET_SNAPSHOT', 'CURRENT_COMPETITION', 'FINANCIAL_SCENARIO', 'DISCLOSURES']) {
  assert(ATLAS_OUTPUT_MODULE_KINDS.includes(moduleKind as never), `missing module kind ${moduleKind}`);
}

for (const [boundary, value] of Object.entries(SHARED_OUTPUT_PRODUCT_PROTECTED_BOUNDARIES)) {
  assert.equal(value, false, `${boundary} must remain false`);
}

const seller = buildSellerPresentationComposition(SELLER_PRESENTATION_REFERENCE_PREPARATION);
assert.equal(seller.status, SELLER_PRESENTATION_OUTPUT_COMPOSITION_STATUS);
assert.equal(seller.sellerProductKind, 'SELLER_PRESENTATION');
assert.equal(seller.outputProduct.status, SHARED_OUTPUT_PRODUCT_COMPOSITION_STATUS);
assert.equal(seller.outputProduct.productKind, 'SELLER_PRESENTATION');
assert.equal(seller.outputProduct.context.audience, 'SELLER');
assert.equal(seller.outputProduct.context.subject.kind, 'PROPERTY');
assert.equal(seller.outputProduct.readiness, 'AGENT_REVIEW_REQUIRED');
assert.equal(seller.outputProduct.evidenceSummary.admitted, 3);
assert.equal(seller.outputProduct.evidenceSummary.missing, 1);
assert.equal(seller.outputProduct.evidenceSummary.rightsReview, 1);
assert.equal(seller.outputProduct.evidenceSummary.freshnessReview, 2);
assert.equal(seller.outputProduct.deterministicCompositionId, 'atlas-output-seller-presentation-seller-presentation-seller-subject-property-reference-seller-seller-subject-property-reference-2026-08-27-v1');
assert.deepEqual(seller.sellerSections, ['seller-overview', 'seller-property-context', 'seller-market-position', 'seller-financial-review', 'seller-evidence-limitations']);
assert.deepEqual(seller.sellerModules, [
  'seller-executive-summary',
  'seller-subject-property',
  'seller-condition-review',
  'seller-market-snapshot',
  'seller-current-competition',
  'seller-financial-questions',
  'seller-disclosures-limitations',
]);

const conditionModule = seller.outputProduct.sections
  .flatMap((section) => section.modules)
  .find((module) => module.id === 'seller-condition-review');
assert(conditionModule, 'seller condition module must be composed');
assert.equal(conditionModule.inclusionState, 'UNAVAILABLE_EVIDENCE');
assert(conditionModule.blockingReasons.includes('MODULE_EVIDENCE_UNAVAILABLE'));

const disclosureSection = seller.outputProduct.sections.find((section) => section.id === 'seller-evidence-limitations');
assert(disclosureSection, 'seller limitations section must be composed');
assert.equal(disclosureSection.inclusionState, 'UNAVAILABLE_FRESHNESS');
assert(disclosureSection.blockingReasons.includes('SECTION_FRESHNESS_REVIEW_REQUIRED'));

const deterministicAgain = buildSellerPresentationComposition(SELLER_PRESENTATION_REFERENCE_PREPARATION);
assert.deepEqual(deterministicAgain, seller, 'seller composition must be deterministic for fixed input');

const unsupportedAudienceDefinition: AtlasOutputProductDefinition = {
  productKind: 'SELLER_PRESENTATION',
  productId: 'bad-audience',
  title: 'Bad audience product',
  version: SHARED_OUTPUT_PRODUCT_COMPOSITION_VERSION,
  generatedAt: '2026-08-27T00:00:00.000Z',
  effectiveAsOf: '2026-08-27',
  context: {
    subject: { kind: 'PROPERTY', id: 'subject', label: 'Subject', repositoryReference: null },
    audience: 'PUBLIC',
    purpose: 'Prove fail-closed audience behavior.',
    authorContext: 'AGENT_PREPARATION',
    clientContext: 'NONE',
  },
  sourceReferences: [{ id: 'source', kind: 'PREPARATION_PACKET', repositoryReference: 'fixture' }],
  evidenceReferences: [{
    id: 'evidence',
    label: 'Evidence',
    sourceReferenceIds: ['source'],
    evidenceState: 'ADMITTED',
    rightsState: 'ADMITTED_FOR_AGENT_INTERNAL',
    freshnessState: 'CURRENT',
    asOf: '2026-08-27',
    limitations: ['Fixture limitation.'],
  }],
  sections: [{
    id: 'section',
    kind: 'EXECUTIVE_OVERVIEW',
    title: 'Section',
    supportedProducts: ['SELLER_PRESENTATION'],
    supportedAudiences: ['SELLER'],
    required: true,
    order: 1,
    moduleIds: ['module'],
    evidenceRequirementIds: ['evidence'],
    rightsRequirement: 'ADMITTED_FOR_AGENT_INTERNAL',
    freshnessRequirement: 'CURRENT',
    reviewRequired: false,
    presentation: { display: 'STANDARD', printCandidate: true, visualCandidate: false },
  }],
  modules: [{
    id: 'module',
    kind: 'EXECUTIVE_SUMMARY',
    title: 'Module',
    supportedProducts: ['SELLER_PRESENTATION'],
    supportedAudiences: ['SELLER'],
    required: true,
    order: 1,
    evidenceReferenceIds: ['evidence'],
    intelligenceReferenceIds: ['source'],
    analysisReferenceIds: [],
    narrativeReference: null,
    visualizationReference: null,
    rightsRequirement: 'ADMITTED_FOR_AGENT_INTERNAL',
    freshnessRequirement: 'CURRENT',
    reviewRequired: false,
    limitations: ['Fixture limitation.'],
  }],
  reviewRequirements: [{ id: 'review', label: 'Review', required: false, reason: 'Fixture.' }],
  intendedFormats: ['AGENT_REVIEW_PACKET'],
  protectedBoundaries: SHARED_OUTPUT_PRODUCT_PROTECTED_BOUNDARIES,
};
const publicSeller = buildAtlasOutputProduct(unsupportedAudienceDefinition);
assert.equal(publicSeller.readiness, 'FAIL_CLOSED');
assert(publicSeller.reasons.includes('OUTPUT_SECTION_AUDIENCE_NOT_SUPPORTED_section'));
assert(publicSeller.reasons.includes('OUTPUT_MODULE_AUDIENCE_NOT_SUPPORTED_module'));

const missingEvidenceDefinition: AtlasOutputProductDefinition = {
  ...unsupportedAudienceDefinition,
  productId: 'missing-evidence',
  context: { ...unsupportedAudienceDefinition.context, audience: 'SELLER' },
  evidenceReferences: [{ ...unsupportedAudienceDefinition.evidenceReferences[0], evidenceState: 'MISSING' }],
};
const missingEvidence = buildAtlasOutputProduct(missingEvidenceDefinition);
assert.equal(missingEvidence.readiness, 'FAIL_CLOSED');
assert.equal(missingEvidence.sections[0].inclusionState, 'UNAVAILABLE_EVIDENCE');

for (const source of [sharedContract, sellerContract]) {
  for (const forbidden of ['fetch(', 'new PrismaClient', 'prisma.', 'supabase.', 'typesense.', 'MLS_GRID_TOKEN', 'DATABASE_URL', 'sendEmail', 'resend', 'localStorage', 'sessionStorage']) {
    assert.equal(source.includes(forbidden), false, `shared output foundation must not include runtime token ${forbidden}`);
  }
}

for (const token of [
  'SHARED_OUTPUT_PRODUCT_COMPOSITION_V1',
  'SELLER_PRESENTATION_OUTPUT_COMPOSITION_V1',
  'PROJECT_ATLAS_SHARED_OUTPUT_PRODUCT_SECTION_MODULE_FOUNDATION_CERTIFIED',
  'READY_FOR_SELLER_PRESENTATION_CONTENT_MODULE_EXPANSION',
  'READY_FOR_SELLER_PRESENTATION_CONTENT_MODULE_EXPANSION',
]) {
  assert(report.includes(token), `certification report missing ${token}`);
}

assert.equal(
  packageJson.scripts?.['check:shared-output-product-section-module-foundation'],
  'jiti scripts/checkSharedOutputProductSectionModuleFoundation.ts',
);

console.log('SHARED_OUTPUT_PRODUCT_SECTION_MODULE_FOUNDATION_CHECK: PASS');
