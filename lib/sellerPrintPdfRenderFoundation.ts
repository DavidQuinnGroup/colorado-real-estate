import {
  OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_FIXTURE,
  OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_VERSION,
  atlasOutputFingerprint,
} from './outputVersionLineageInvalidationFoundation';
import { SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_FIXTURE } from './sellerDecisionBriefCompositionPreview';
import { SELLER_DECISION_BRIEF_V2_VERSION } from './sellerDecisionBriefV2';
import {
  SELLER_POST_LAUNCH_REVIEW_VERSION,
  SELLER_UPDATE_PRODUCT_VERSION,
} from './sellerPostLaunchCurrentContextReview';
import { SELLER_PRICING_SCENARIO_VERSION } from './sellerPricingPositioningDecisionFramework';

export const SELLER_PRINT_PDF_RENDER_FOUNDATION_STATUS =
  'SELLER_PRINT_PDF_RENDER_FOUNDATION_V1_CERTIFIED_WITH_HOLDS' as const;
export const SELLER_PRINT_PDF_RENDER_FOUNDATION_VERSION =
  'SELLER_PRINT_PDF_RENDER_FOUNDATION_V1' as const;
export const SELLER_PRINT_PDF_RENDER_FOUNDATION_NEXT_GATE =
  'HEADLESS_PDF_RENDERER_FEASIBILITY_V1' as const;
export const SELLER_PRINT_PDF_RENDER_FOUNDATION_PRODUCT_STATUS =
  'SELLER_PRINT_PDF_RENDER_FOUNDATION_V1_CERTIFIED_PRINT_PREVIEW_RENDER_DOMAIN_PDF_DELIVERY_PERSISTENCE_HELD' as const;
export const SELLER_PRINT_PDF_RENDER_FOUNDATION_PDF_ACTIVATION_POSITION =
  'PRINT_PREVIEW_RENDER_DOMAIN_CERTIFIED_PDF_SPIKE_NEXT' as const;

export const ATLAS_OUTPUT_RENDER_TYPES = [
  'SCREEN_PREVIEW',
  'PRINT_PREVIEW',
  'PRINT',
  'PDF',
] as const;

export const ATLAS_OUTPUT_RENDER_STATES = [
  'DRAFT_RENDER',
  'RENDER_READY',
  'RENDER_REVIEW_REQUIRED',
  'PRINT_READY',
  'PDF_READY',
  'RENDER_CERTIFIED',
  'RENDER_INVALIDATED',
  'SUPERSEDED_RENDER',
] as const;

export const ATLAS_RENDER_CHANGE_CLASSIFICATIONS = [
  'RENDER_ONLY_CHANGE',
  'CONTENT_REVIEW_REQUIRED',
  'RIGHTS_REVIEW_REQUIRED',
  'ACCESSIBILITY_REVIEW_REQUIRED',
] as const;

export const ATLAS_RENDER_REASON_CODES = [
  'INITIAL_RENDER',
  'VISUAL_REVISION',
  'PRINT_PREVIEW_REQUEST',
  'BROWSER_PRINT_REQUEST',
  'PDF_SEAM_PROOF',
  'OUTPUT_VERSION_SUPERSESSION',
  'ACCESSIBILITY_REVIEW',
] as const;

export const ATLAS_STATIC_ASSET_KINDS = [
  'MAP_STATIC_FALLBACK',
  'CHART_STATIC_FALLBACK',
  'PROPERTY_IMAGE',
  'BRAND_MARK',
  'TABLE_TEXT_EQUIVALENT',
  'EVIDENCE_APPENDIX_REFERENCE',
] as const;

export type AtlasOutputRenderType = (typeof ATLAS_OUTPUT_RENDER_TYPES)[number];
export type AtlasOutputRenderState = (typeof ATLAS_OUTPUT_RENDER_STATES)[number];
export type AtlasRenderChangeClassification = (typeof ATLAS_RENDER_CHANGE_CLASSIFICATIONS)[number];
export type AtlasRenderReasonCode = (typeof ATLAS_RENDER_REASON_CODES)[number];
export type AtlasStaticAssetKind = (typeof ATLAS_STATIC_ASSET_KINDS)[number];

export type AtlasDocumentBlock = Readonly<{
  id: string;
  sourceSectionId: string;
  sourceModuleId: string | null;
  component: string;
  printRole: 'COVER' | 'SECTION_HEADER' | 'CONTENT' | 'TABLE' | 'MAP' | 'CHART' | 'PROVENANCE' | 'FOOTER';
  density: 'D1' | 'D2' | 'D3' | 'D4';
  evidenceReferenceIds: readonly string[];
  breakPolicy: 'AVOID_INSIDE' | 'SECTION_START' | 'ALLOW';
}>;

export type AtlasDocumentPage = Readonly<{
  id: string;
  pageTemplateId: string;
  pageNumberIntent: number;
  title: string;
  sourceSectionIds: readonly string[];
  blockIds: readonly string[];
  printSize: 'LETTER';
  orientation: 'PORTRAIT' | 'LANDSCAPE_RESERVED';
  header: string;
  footer: string;
}>;

export type AtlasDocumentModel = Readonly<{
  id: string;
  documentTemplateId: string;
  documentTemplateVersion: string;
  outputVersionId: string;
  outputProductId: string;
  productKind: 'SELLER_PRESENTATION' | 'SELLER_UPDATE';
  audience: 'AGENT_INTERNAL' | 'SELLER';
  subject: string;
  title: string;
  effectiveAsOf: string;
  sourceContentFingerprint: string;
  pages: readonly AtlasDocumentPage[];
  blocks: readonly AtlasDocumentBlock[];
  evidenceSnapshotReferences: readonly string[];
  pricingReferences: readonly string[];
  postLaunchReferences: readonly string[];
  sellerDecisionReferences: readonly string[];
}>;

export type AtlasStaticAssetReference = Readonly<{
  id: string;
  kind: AtlasStaticAssetKind;
  label: string;
  sourceComponent: string;
  outputVersionId: string;
  assetVersion: string;
  fingerprint: string;
  printBehavior: 'INLINE_STATIC' | 'TEXT_EQUIVALENT' | 'SCREEN_ONLY_WITH_PRINT_FALLBACK';
  rightsState: 'ADMITTED_FOR_AGENT_INTERNAL' | 'REVIEW_REQUIRED';
  limitations: readonly string[];
}>;

export type AtlasOutputRender = Readonly<{
  id: string;
  renderVersion: string;
  displayVersion: string;
  sourceOutputVersionId: string;
  outputProductId: string;
  productKind: 'SELLER_PRESENTATION' | 'SELLER_UPDATE';
  audience: 'AGENT_INTERNAL' | 'SELLER';
  subject: string;
  renderType: AtlasOutputRenderType;
  rendererId: string;
  rendererVersion: string;
  documentTemplateId: string;
  documentTemplateVersion: string;
  pageTemplateVersionSet: string;
  visualPresentationVersion: string;
  createdAt: string;
  effectiveAsOf: string;
  sourceContentFingerprint: string;
  renderFingerprint: string;
  pageCount: number;
  sectionPageMap: readonly Readonly<{ sectionId: string; firstPage: number; lastPage: number }>[];
  evidenceSnapshotReferences: readonly string[];
  pricingReferences: readonly string[];
  postLaunchReferences: readonly string[];
  financialReferences: readonly string[];
  sellerDecisionReferences: readonly string[];
  staticAssetReferences: readonly string[];
  accessibilityState: 'SEMANTIC_STRUCTURE_PRESENT' | 'ACCESSIBILITY_REVIEW_REQUIRED' | 'TAGGED_PDF_SPIKE_REQUIRED';
  printReadiness: 'PRINT_READY' | 'PRINT_REVIEW_REQUIRED';
  pdfReadiness: 'PDF_RENDERER_NOT_ACTIVATED' | 'PDF_SPIKE_REQUIRED' | 'PDF_READY';
  qaState: 'QA_PASSED' | 'QA_REVIEW_REQUIRED';
  fileIdentitySeam: 'NO_FILE_BYTES_CURRENT_PHASE' | 'FUTURE_FILE_HASH_REQUIRED';
  parentRenderId: string | null;
  priorRenderId: string | null;
  supersedesRenderId: string | null;
  supersededByRenderId: string | null;
  renderReason: AtlasRenderReasonCode;
}>;

export type AtlasRenderQaRule = Readonly<{
  id: string;
  category: 'VERSION_MATCH' | 'DOCUMENT_STRUCTURE' | 'PRINT_CSS' | 'STATIC_ASSET' | 'ACCESSIBILITY' | 'PDF_SEAM' | 'PROVENANCE';
  assertion: string;
  state: 'PASS' | 'HELD_FOR_PDF_SPIKE' | 'REVIEW_REQUIRED';
  evidence: string;
}>;

export type AtlasRenderChangeRule = Readonly<{
  change: string;
  classification: AtlasRenderChangeClassification;
  route: string;
}>;

export type AtlasPrintCssRule = Readonly<{
  token: string;
  purpose: string;
  selector: string;
  required: true;
}>;

export type AtlasBrowserPrintAdapter = Readonly<{
  action: 'VIEW_PRINT_PREVIEW' | 'PRINT';
  currentPhase: 'SUPPORTED';
  invocation: 'MODE_SWITCH' | 'WINDOW_PRINT';
  persistence: false;
  pdfGeneration: false;
  delivery: false;
}>;

export type AtlasPdfGenerationRequestSeam = Readonly<{
  requestId: string;
  sourceOutputVersionId: string;
  sourceRenderId: string;
  documentModelId: string;
  requestedRenderType: 'PDF';
  rendererCandidate: 'HEADLESS_BROWSER_PDF';
  currentPhase: 'CONTRACT_ONLY_NOT_EXECUTED';
  requiredFutureProof: typeof SELLER_PRINT_PDF_RENDER_FOUNDATION_NEXT_GATE;
}>;

export type AtlasPdfGenerationResultSeam = Readonly<{
  requestId: string;
  status: 'NOT_EXECUTED_CURRENT_PHASE';
  fileHash: null;
  storageReference: null;
  contentFingerprint: string;
  renderFingerprint: string;
  metadataState: 'METADATA_CONTRACT_DEFINED';
  bookmarkState: 'BOOKMARK_SPIKE_REQUIRED';
  taggedPdfState: 'TAGGED_PDF_SPIKE_REQUIRED';
}>;

export type SellerPrintPdfRenderFoundation = Readonly<{
  status: typeof SELLER_PRINT_PDF_RENDER_FOUNDATION_STATUS;
  version: typeof SELLER_PRINT_PDF_RENDER_FOUNDATION_VERSION;
  nextGate: typeof SELLER_PRINT_PDF_RENDER_FOUNDATION_NEXT_GATE;
  productStatus: typeof SELLER_PRINT_PDF_RENDER_FOUNDATION_PRODUCT_STATUS;
  pdfActivationPosition: typeof SELLER_PRINT_PDF_RENDER_FOUNDATION_PDF_ACTIVATION_POSITION;
  route: '/agent/prepare/seller/presentation';
  outputVersionFoundationVersion: typeof OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_VERSION;
  currentPhase: 'PRINT_PREVIEW_AND_RENDER_DOMAIN_FIRST';
  documentModels: readonly AtlasDocumentModel[];
  outputRenders: readonly AtlasOutputRender[];
  staticAssets: readonly AtlasStaticAssetReference[];
  printCssRules: readonly AtlasPrintCssRule[];
  browserPrintAdapters: readonly AtlasBrowserPrintAdapter[];
  pdfRequestSeams: readonly AtlasPdfGenerationRequestSeam[];
  pdfResultSeams: readonly AtlasPdfGenerationResultSeam[];
  renderQa: readonly AtlasRenderQaRule[];
  changeRules: readonly AtlasRenderChangeRule[];
  printPreviewUi: readonly Readonly<{ marker: string; component: string; purpose: string }>[];
  activationTable: readonly Readonly<{ capability: string; currentPackage: string; futureActivation: string; persistenceNeeded: boolean }>[];
  questionCoverage: readonly Readonly<{ question: string; answer: string; evidence: string }>[];
  nextGateRanking: readonly Readonly<{ rank: number; gate: string; why: string; dependencies: readonly string[]; unlocks: string }>[];
  protectedBoundaries: Readonly<{
    persistenceAuthorization: false;
    providerRuntime: false;
    customerMutation: false;
    crmMutation: false;
    emailOrMessageExecution: false;
    pdfGeneration: false;
    pdfRuntimeActivation: false;
    fileStorage: false;
    shareDelivery: false;
    recommendationAutomation: false;
    deployment: false;
  }>;
}>;

export const SELLER_PRINT_PDF_RENDER_PROTECTED_BOUNDARIES: SellerPrintPdfRenderFoundation['protectedBoundaries'] = Object.freeze({
  persistenceAuthorization: false,
  providerRuntime: false,
  customerMutation: false,
  crmMutation: false,
  emailOrMessageExecution: false,
  pdfGeneration: false,
  pdfRuntimeActivation: false,
  fileStorage: false,
  shareDelivery: false,
  recommendationAutomation: false,
  deployment: false,
});

const outputFoundation = OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_FIXTURE;
const sellerPreview = SELLER_DECISION_BRIEF_COMPOSITION_PREVIEW_FIXTURE;
const currentSellerOutput = outputFoundation.outputVersions.find((version) => version.id === 'seller-decision-brief-v2-reviewed')
  ?? outputFoundation.outputVersions[0];
const currentSellerUpdateOutput = outputFoundation.outputVersions.find((version) => version.id === 'seller-update-current-version')
  ?? outputFoundation.outputVersions[0];
const sellerUpdatePriorOutput = outputFoundation.outputVersions.find((version) => version.id === 'seller-update-superseded-version')
  ?? currentSellerUpdateOutput;

function freezeArray<T>(items: readonly T[]) {
  return Object.freeze([...items]);
}

export function atlasRenderFingerprint(kind: string, inputs: unknown): string {
  return atlasOutputFingerprint(kind, inputs);
}

export function renderVersionTransitionAllowed(from: AtlasOutputRenderState, to: AtlasOutputRenderState) {
  const transitions: Record<AtlasOutputRenderState, readonly AtlasOutputRenderState[]> = {
    DRAFT_RENDER: ['RENDER_READY', 'RENDER_REVIEW_REQUIRED'],
    RENDER_READY: ['PRINT_READY', 'RENDER_REVIEW_REQUIRED', 'RENDER_INVALIDATED'],
    RENDER_REVIEW_REQUIRED: ['RENDER_READY', 'RENDER_INVALIDATED'],
    PRINT_READY: ['RENDER_CERTIFIED', 'PDF_READY', 'RENDER_INVALIDATED', 'SUPERSEDED_RENDER'],
    PDF_READY: ['RENDER_CERTIFIED', 'RENDER_INVALIDATED', 'SUPERSEDED_RENDER'],
    RENDER_CERTIFIED: ['SUPERSEDED_RENDER', 'RENDER_INVALIDATED'],
    RENDER_INVALIDATED: ['DRAFT_RENDER'],
    SUPERSEDED_RENDER: [],
  };
  return transitions[from].includes(to);
}

export function classifyRenderChange(change: string): AtlasRenderChangeClassification {
  const normalized = change.trim().toUpperCase().replace(/[^A-Z0-9]+/g, '_');
  if (['CONTENT', 'EVIDENCE', 'RECOMMENDATION', 'PRICING', 'FINANCIAL_RESULT', 'SELLER_DECISION', 'MATERIAL_CONTENT_TRUNCATION', 'MEANINGFUL_CHART_SCALE'].includes(normalized)) {
    return 'CONTENT_REVIEW_REQUIRED';
  }
  if (['RIGHTS', 'DISCLOSURE', 'MATERIAL_RIGHTS_DISCLOSURE'].includes(normalized)) return 'RIGHTS_REVIEW_REQUIRED';
  if (['TAG_STRUCTURE', 'ALT_TEXT', 'READING_ORDER', 'CONTRAST'].includes(normalized)) return 'ACCESSIBILITY_REVIEW_REQUIRED';
  return 'RENDER_ONLY_CHANGE';
}

function block(
  id: string,
  sourceSectionId: string,
  sourceModuleId: string | null,
  component: string,
  printRole: AtlasDocumentBlock['printRole'],
  density: AtlasDocumentBlock['density'],
  evidenceReferenceIds: readonly string[],
  breakPolicy: AtlasDocumentBlock['breakPolicy'],
): AtlasDocumentBlock {
  return Object.freeze({
    id,
    sourceSectionId,
    sourceModuleId,
    component,
    printRole,
    density,
    evidenceReferenceIds: freezeArray(evidenceReferenceIds),
    breakPolicy,
  });
}

function page(
  id: string,
  pageTemplateId: string,
  pageNumberIntent: number,
  title: string,
  sourceSectionIds: readonly string[],
  blockIds: readonly string[],
): AtlasDocumentPage {
  return Object.freeze({
    id,
    pageTemplateId,
    pageNumberIntent,
    title,
    sourceSectionIds: freezeArray(sourceSectionIds),
    blockIds: freezeArray(blockIds),
    printSize: 'LETTER',
    orientation: 'PORTRAIT',
    header: 'Seller Decision Brief',
    footer: 'Output version, render version, as-of, and provenance.',
  });
}

function sectionPage(sectionId: string, firstPage: number, lastPage = firstPage) {
  return Object.freeze({ sectionId, firstPage, lastPage });
}

function staticAsset(
  id: string,
  kind: AtlasStaticAssetKind,
  label: string,
  sourceComponent: string,
  outputVersionId: string,
  assetVersion: string,
  printBehavior: AtlasStaticAssetReference['printBehavior'],
  limitations: readonly string[],
): AtlasStaticAssetReference {
  return Object.freeze({
    id,
    kind,
    label,
    sourceComponent,
    outputVersionId,
    assetVersion,
    fingerprint: atlasRenderFingerprint('STATIC_ASSET_FINGERPRINT', [id, kind, label, sourceComponent, outputVersionId, assetVersion, printBehavior]),
    printBehavior,
    rightsState: 'ADMITTED_FOR_AGENT_INTERNAL',
    limitations: freezeArray(limitations),
  });
}

function render(
  input: Omit<AtlasOutputRender, 'renderFingerprint'>,
): AtlasOutputRender {
  return Object.freeze({
    ...input,
    sectionPageMap: freezeArray(input.sectionPageMap),
    evidenceSnapshotReferences: freezeArray(input.evidenceSnapshotReferences),
    pricingReferences: freezeArray(input.pricingReferences),
    postLaunchReferences: freezeArray(input.postLaunchReferences),
    financialReferences: freezeArray(input.financialReferences),
    sellerDecisionReferences: freezeArray(input.sellerDecisionReferences),
    staticAssetReferences: freezeArray(input.staticAssetReferences),
    renderFingerprint: atlasRenderFingerprint('OUTPUT_RENDER_FINGERPRINT', [
      input.renderVersion,
      input.sourceOutputVersionId,
      input.renderType,
      input.documentTemplateVersion,
      input.pageTemplateVersionSet,
      input.visualPresentationVersion,
      input.sourceContentFingerprint,
      input.staticAssetReferences,
      input.pageCount,
    ]),
  });
}

function qa(id: string, category: AtlasRenderQaRule['category'], assertion: string, state: AtlasRenderQaRule['state'], evidence: string): AtlasRenderQaRule {
  return Object.freeze({ id, category, assertion, state, evidence });
}

function changeRule(change: string, route: string): AtlasRenderChangeRule {
  return Object.freeze({ change, classification: classifyRenderChange(change), route });
}

const sellerDocumentBlocks = freezeArray([
  block('seller-print-cover-block', 'seller-brief-cover', null, 'PrintOutputCover', 'COVER', 'D1', ['evidence-snapshot-seller-v2'], 'SECTION_START'),
  block('seller-print-executive-summary-block', 'seller-brief-executive-summary', 'seller-module-decision-snapshot', 'PrintExecutiveSummary', 'CONTENT', 'D1', ['evidence-snapshot-seller-v2'], 'AVOID_INSIDE'),
  block('seller-print-property-block', 'seller-brief-property', 'seller-module-property-hero', 'PrintPropertyComposition', 'CONTENT', 'D2', ['evidence-snapshot-seller-v2'], 'AVOID_INSIDE'),
  block('seller-print-location-map-block', 'seller-brief-location', 'seller-module-location-story', 'PrintStaticMapFallback', 'MAP', 'D2', ['evidence-snapshot-seller-v2'], 'AVOID_INSIDE'),
  block('seller-print-market-chart-block', 'seller-brief-market', 'seller-module-current-market-snapshot', 'PrintStaticChartFallback', 'CHART', 'D2', ['evidence-snapshot-pricing-current'], 'AVOID_INSIDE'),
  block('seller-print-competition-table-block', 'seller-brief-competition', 'seller-module-current-competition', 'PrintCompetitionTable', 'TABLE', 'D3', ['evidence-snapshot-pricing-current'], 'AVOID_INSIDE'),
  block('seller-print-pricing-block', 'seller-brief-positioning', 'seller-module-positioning-themes', 'PrintPricingPositioning', 'CONTENT', 'D2', ['evidence-snapshot-pricing-current'], 'AVOID_INSIDE'),
  block('seller-print-launch-block', 'seller-brief-launch', 'seller-module-launch-plan', 'PrintLaunchPlan', 'CONTENT', 'D3', ['evidence-snapshot-launch-plan'], 'AVOID_INSIDE'),
  block('seller-print-recommendation-block', 'seller-brief-recommendations', 'seller-module-recommendation-card', 'PrintRecommendationDecision', 'CONTENT', 'D1', ['evidence-snapshot-seller-v2'], 'SECTION_START'),
  block('seller-print-evidence-block', 'seller-brief-evidence-appendix', 'seller-module-evidence-panel', 'PrintEvidenceAppendix', 'PROVENANCE', 'D4', ['evidence-snapshot-seller-v2', 'evidence-snapshot-pricing-current'], 'ALLOW'),
]);

const sellerUpdateBlocks = freezeArray([
  block('seller-update-print-cover-block', 'seller-update-cover', null, 'SellerUpdatePrintCover', 'COVER', 'D1', ['evidence-snapshot-seller-update-current'], 'SECTION_START'),
  block('seller-update-print-response-block', 'seller-update-response-intelligence', 'seller-update-current-response-inputs', 'SellerUpdateResponseIntelligence', 'CONTENT', 'D2', ['evidence-snapshot-seller-update-current'], 'AVOID_INSIDE'),
  block('seller-update-print-current-prior-block', 'seller-update-current-vs-prior', 'seller-update-current-vs-prior', 'SellerUpdateCurrentPrior', 'TABLE', 'D2', ['evidence-snapshot-seller-update-current'], 'AVOID_INSIDE'),
  block('seller-update-print-recommendation-block', 'seller-update-recommendation', 'seller-update-updated-recommendation', 'SellerUpdateRecommendation', 'CONTENT', 'D1', ['evidence-snapshot-seller-update-current'], 'AVOID_INSIDE'),
  block('seller-update-print-decision-block', 'seller-update-decision', 'seller-update-seller-decision', 'SellerUpdateDecision', 'CONTENT', 'D1', ['evidence-snapshot-seller-update-current'], 'SECTION_START'),
  block('seller-update-print-provenance-block', 'seller-update-provenance', 'seller-update-evidence-lineage', 'SellerUpdateEvidenceProvenance', 'PROVENANCE', 'D4', ['evidence-snapshot-seller-update-current'], 'ALLOW'),
]);

const sellerDocument: AtlasDocumentModel = Object.freeze({
  id: 'seller-decision-brief-print-document-v1',
  documentTemplateId: 'SELLER_DECISION_BRIEF_PRINT_TEMPLATE',
  documentTemplateVersion: 'SELLER_DECISION_BRIEF_PRINT_TEMPLATE_V1',
  outputVersionId: currentSellerOutput.id,
  outputProductId: currentSellerOutput.outputProductId,
  productKind: 'SELLER_PRESENTATION',
  audience: 'SELLER',
  subject: sellerPreview.brief.outputProduct.context.subject.label,
  title: 'Seller Decision Brief Print Preview',
  effectiveAsOf: currentSellerOutput.effectiveAsOf,
  sourceContentFingerprint: currentSellerOutput.contentFingerprint,
  pages: freezeArray([
    page('seller-print-page-cover', 'PRINT_COVER_PAGE_V1', 1, 'Cover', ['seller-brief-cover'], ['seller-print-cover-block']),
    page('seller-print-page-decision', 'PRINT_NARRATIVE_PAGE_V1', 2, 'Decision Snapshot', ['seller-brief-executive-summary'], ['seller-print-executive-summary-block']),
    page('seller-print-page-property-location', 'PRINT_VISUAL_CONTEXT_PAGE_V1', 3, 'Property and Location', ['seller-brief-property', 'seller-brief-location'], ['seller-print-property-block', 'seller-print-location-map-block']),
    page('seller-print-page-market-competition', 'PRINT_TABLE_PAGE_V1', 4, 'Market and Competition', ['seller-brief-market', 'seller-brief-competition'], ['seller-print-market-chart-block', 'seller-print-competition-table-block']),
    page('seller-print-page-pricing-launch', 'PRINT_DECISION_PAGE_V1', 5, 'Pricing and Launch', ['seller-brief-positioning', 'seller-brief-launch'], ['seller-print-pricing-block', 'seller-print-launch-block']),
    page('seller-print-page-recommendation', 'PRINT_DECISION_PAGE_V1', 6, 'Recommendation', ['seller-brief-recommendations'], ['seller-print-recommendation-block']),
    page('seller-print-page-evidence', 'PRINT_APPENDIX_PAGE_V1', 7, 'Evidence and Provenance', ['seller-brief-evidence-appendix'], ['seller-print-evidence-block']),
  ]),
  blocks: sellerDocumentBlocks,
  evidenceSnapshotReferences: freezeArray(['evidence-snapshot-seller-v2', 'evidence-snapshot-pricing-current', 'evidence-snapshot-launch-plan']),
  pricingReferences: freezeArray([SELLER_PRICING_SCENARIO_VERSION]),
  postLaunchReferences: freezeArray([SELLER_POST_LAUNCH_REVIEW_VERSION]),
  sellerDecisionReferences: freezeArray(['SELLER_DECISION_BRIEF_DECISION_SEAM_V1']),
});

const sellerUpdateDocument: AtlasDocumentModel = Object.freeze({
  id: 'seller-update-print-document-v1',
  documentTemplateId: 'SELLER_UPDATE_PRINT_TEMPLATE',
  documentTemplateVersion: 'SELLER_UPDATE_PRINT_TEMPLATE_V1',
  outputVersionId: currentSellerUpdateOutput.id,
  outputProductId: currentSellerUpdateOutput.outputProductId,
  productKind: 'SELLER_UPDATE',
  audience: 'SELLER',
  subject: sellerPreview.brief.outputProduct.context.subject.label,
  title: 'Seller Update Print Preview',
  effectiveAsOf: currentSellerUpdateOutput.effectiveAsOf,
  sourceContentFingerprint: currentSellerUpdateOutput.contentFingerprint,
  pages: freezeArray([
    page('seller-update-print-page-cover', 'PRINT_COVER_PAGE_V1', 1, 'Seller Update Cover', ['seller-update-cover'], ['seller-update-print-cover-block']),
    page('seller-update-print-page-response', 'PRINT_NARRATIVE_PAGE_V1', 2, 'Response Intelligence', ['seller-update-response-intelligence'], ['seller-update-print-response-block']),
    page('seller-update-print-page-current-prior', 'PRINT_TABLE_PAGE_V1', 3, 'Current vs Prior', ['seller-update-current-vs-prior'], ['seller-update-print-current-prior-block']),
    page('seller-update-print-page-decision', 'PRINT_DECISION_PAGE_V1', 4, 'Recommendation and Decision', ['seller-update-recommendation', 'seller-update-decision'], ['seller-update-print-recommendation-block', 'seller-update-print-decision-block']),
    page('seller-update-print-page-provenance', 'PRINT_APPENDIX_PAGE_V1', 5, 'Evidence and Provenance', ['seller-update-provenance'], ['seller-update-print-provenance-block']),
  ]),
  blocks: sellerUpdateBlocks,
  evidenceSnapshotReferences: freezeArray(['evidence-snapshot-seller-update-current']),
  pricingReferences: freezeArray([SELLER_PRICING_SCENARIO_VERSION]),
  postLaunchReferences: freezeArray([SELLER_POST_LAUNCH_REVIEW_VERSION]),
  sellerDecisionReferences: freezeArray(['SELLER_POST_LAUNCH_SELLER_DECISION_V1']),
});

const staticAssets = freezeArray([
  staticAsset('asset-subject-property-image', 'PROPERTY_IMAGE', 'Subject property image placeholder', 'OutputPropertyHero', currentSellerOutput.id, 'PROPERTY_IMAGE_STATIC_V1', 'SCREEN_ONLY_WITH_PRINT_FALLBACK', ['No external image fetch in current phase.']),
  staticAsset('asset-location-map-static', 'MAP_STATIC_FALLBACK', 'Location context static map fallback', 'OutputLocationMap', currentSellerOutput.id, 'LOCATION_MAP_STATIC_V1', 'TEXT_EQUIVALENT', ['No map tile rendering or provider call in current phase.']),
  staticAsset('asset-competition-map-static', 'MAP_STATIC_FALLBACK', 'Competition context static map fallback', 'OutputCompetitionMap', currentSellerOutput.id, 'COMPETITION_MAP_STATIC_V1', 'TEXT_EQUIVALENT', ['No map tile rendering or provider call in current phase.']),
  staticAsset('asset-market-chart-static', 'CHART_STATIC_FALLBACK', 'Market chart static fallback', 'OutputMetricCard', currentSellerOutput.id, 'MARKET_CHART_STATIC_V1', 'TEXT_EQUIVALENT', ['Chart uses print-safe table equivalent until renderer spike.']),
  staticAsset('asset-brand-mark-print', 'BRAND_MARK', 'David Quinn Group print mark seam', 'PrintOutputCover', currentSellerOutput.id, 'BRAND_MARK_PRINT_V1', 'INLINE_STATIC', ['Uses text/mark seam only; no file storage.']),
  staticAsset('asset-evidence-table-text', 'TABLE_TEXT_EQUIVALENT', 'Evidence table text equivalent', 'OutputEvidencePanel', currentSellerUpdateOutput.id, 'EVIDENCE_TABLE_TEXT_V1', 'INLINE_STATIC', ['Preserves source/as-of and limitation text.']),
  staticAsset('asset-evidence-appendix-reference', 'EVIDENCE_APPENDIX_REFERENCE', 'Evidence appendix reference seam', 'SellerUpdateEvidenceProvenance', currentSellerUpdateOutput.id, 'EVIDENCE_APPENDIX_REFERENCE_V1', 'INLINE_STATIC', ['References admitted evidence snapshots only.']),
]);

const sellerPrintRender = render({
  id: 'render-seller-decision-brief-print-preview-v1',
  renderVersion: 'SELLER_DECISION_BRIEF_PRINT_RENDER_V1',
  displayVersion: 'Seller Decision Brief Print Render v1',
  sourceOutputVersionId: currentSellerOutput.id,
  outputProductId: currentSellerOutput.outputProductId,
  productKind: 'SELLER_PRESENTATION',
  audience: 'SELLER',
  subject: sellerDocument.subject,
  renderType: 'PRINT_PREVIEW',
  rendererId: 'BROWSER_PRINT_PREVIEW',
  rendererVersion: 'NEXT_APP_PRINT_CSS_V1',
  documentTemplateId: sellerDocument.documentTemplateId,
  documentTemplateVersion: sellerDocument.documentTemplateVersion,
  pageTemplateVersionSet: 'SELLER_PRINT_PAGE_TEMPLATE_SET_V1',
  visualPresentationVersion: SELLER_DECISION_BRIEF_V2_VERSION,
  createdAt: '2026-08-27T00:00:00.000Z',
  effectiveAsOf: sellerDocument.effectiveAsOf,
  sourceContentFingerprint: sellerDocument.sourceContentFingerprint,
  pageCount: sellerDocument.pages.length,
  sectionPageMap: freezeArray([
    sectionPage('seller-brief-cover', 1),
    sectionPage('seller-brief-executive-summary', 2),
    sectionPage('seller-brief-property', 3),
    sectionPage('seller-brief-location', 3),
    sectionPage('seller-brief-market', 4),
    sectionPage('seller-brief-competition', 4),
    sectionPage('seller-brief-positioning', 5),
    sectionPage('seller-brief-launch', 5),
    sectionPage('seller-brief-recommendations', 6),
    sectionPage('seller-brief-evidence-appendix', 7),
  ]),
  evidenceSnapshotReferences: sellerDocument.evidenceSnapshotReferences,
  pricingReferences: sellerDocument.pricingReferences,
  postLaunchReferences: sellerDocument.postLaunchReferences,
  financialReferences: freezeArray(['REIE_FINANCIAL_DECISION_PREPARATION_VERSION']),
  sellerDecisionReferences: sellerDocument.sellerDecisionReferences,
  staticAssetReferences: freezeArray(staticAssets.slice(0, 6).map((asset) => asset.id)),
  accessibilityState: 'SEMANTIC_STRUCTURE_PRESENT',
  printReadiness: 'PRINT_READY',
  pdfReadiness: 'PDF_SPIKE_REQUIRED',
  qaState: 'QA_PASSED',
  fileIdentitySeam: 'NO_FILE_BYTES_CURRENT_PHASE',
  parentRenderId: null,
  priorRenderId: null,
  supersedesRenderId: null,
  supersededByRenderId: null,
  renderReason: 'PRINT_PREVIEW_REQUEST',
});

const sellerUpdatePrintRender = render({
  id: 'render-seller-update-print-preview-v1',
  renderVersion: 'SELLER_UPDATE_PRINT_RENDER_V1',
  displayVersion: 'Seller Update Print Render v1',
  sourceOutputVersionId: currentSellerUpdateOutput.id,
  outputProductId: currentSellerUpdateOutput.outputProductId,
  productKind: 'SELLER_UPDATE',
  audience: 'SELLER',
  subject: sellerUpdateDocument.subject,
  renderType: 'PRINT_PREVIEW',
  rendererId: 'BROWSER_PRINT_PREVIEW',
  rendererVersion: 'NEXT_APP_PRINT_CSS_V1',
  documentTemplateId: sellerUpdateDocument.documentTemplateId,
  documentTemplateVersion: sellerUpdateDocument.documentTemplateVersion,
  pageTemplateVersionSet: 'SELLER_UPDATE_PRINT_PAGE_TEMPLATE_SET_V1',
  visualPresentationVersion: SELLER_UPDATE_PRODUCT_VERSION,
  createdAt: '2026-08-27T00:00:00.000Z',
  effectiveAsOf: sellerUpdateDocument.effectiveAsOf,
  sourceContentFingerprint: sellerUpdateDocument.sourceContentFingerprint,
  pageCount: sellerUpdateDocument.pages.length,
  sectionPageMap: freezeArray([
    sectionPage('seller-update-cover', 1),
    sectionPage('seller-update-response-intelligence', 2),
    sectionPage('seller-update-current-vs-prior', 3),
    sectionPage('seller-update-recommendation', 4),
    sectionPage('seller-update-decision', 4),
    sectionPage('seller-update-provenance', 5),
  ]),
  evidenceSnapshotReferences: sellerUpdateDocument.evidenceSnapshotReferences,
  pricingReferences: sellerUpdateDocument.pricingReferences,
  postLaunchReferences: sellerUpdateDocument.postLaunchReferences,
  financialReferences: freezeArray(['REIE_FINANCIAL_DECISION_PREPARATION_VERSION']),
  sellerDecisionReferences: sellerUpdateDocument.sellerDecisionReferences,
  staticAssetReferences: freezeArray(['asset-evidence-table-text', 'asset-evidence-appendix-reference', 'asset-market-chart-static']),
  accessibilityState: 'SEMANTIC_STRUCTURE_PRESENT',
  printReadiness: 'PRINT_READY',
  pdfReadiness: 'PDF_SPIKE_REQUIRED',
  qaState: 'QA_PASSED',
  fileIdentitySeam: 'NO_FILE_BYTES_CURRENT_PHASE',
  parentRenderId: sellerPrintRender.id,
  priorRenderId: 'render-seller-update-prior-print-preview-v1',
  supersedesRenderId: 'render-seller-update-prior-print-preview-v1',
  supersededByRenderId: null,
  renderReason: 'PRINT_PREVIEW_REQUEST',
});

const sellerUpdatePriorPrintRender = render({
  id: 'render-seller-update-prior-print-preview-v1',
  renderVersion: 'SELLER_UPDATE_PRINT_RENDER_V0',
  displayVersion: 'Seller Update Print Render v0',
  sourceOutputVersionId: sellerUpdatePriorOutput.id,
  outputProductId: sellerUpdatePriorOutput.outputProductId,
  productKind: 'SELLER_UPDATE',
  audience: 'SELLER',
  subject: sellerUpdateDocument.subject,
  renderType: 'PRINT_PREVIEW',
  rendererId: 'BROWSER_PRINT_PREVIEW',
  rendererVersion: 'NEXT_APP_PRINT_CSS_V1',
  documentTemplateId: sellerUpdateDocument.documentTemplateId,
  documentTemplateVersion: sellerUpdateDocument.documentTemplateVersion,
  pageTemplateVersionSet: 'SELLER_UPDATE_PRINT_PAGE_TEMPLATE_SET_V1',
  visualPresentationVersion: SELLER_UPDATE_PRODUCT_VERSION,
  createdAt: '2026-08-27T00:00:00.000Z',
  effectiveAsOf: sellerUpdatePriorOutput.effectiveAsOf,
  sourceContentFingerprint: sellerUpdatePriorOutput.contentFingerprint,
  pageCount: sellerUpdateDocument.pages.length,
  sectionPageMap: sellerUpdatePrintRender.sectionPageMap,
  evidenceSnapshotReferences: freezeArray(['evidence-snapshot-seller-update-prior']),
  pricingReferences: sellerUpdateDocument.pricingReferences,
  postLaunchReferences: sellerUpdateDocument.postLaunchReferences,
  financialReferences: freezeArray(['REIE_FINANCIAL_DECISION_PREPARATION_VERSION']),
  sellerDecisionReferences: sellerUpdateDocument.sellerDecisionReferences,
  staticAssetReferences: sellerUpdatePrintRender.staticAssetReferences,
  accessibilityState: 'SEMANTIC_STRUCTURE_PRESENT',
  printReadiness: 'PRINT_READY',
  pdfReadiness: 'PDF_SPIKE_REQUIRED',
  qaState: 'QA_PASSED',
  fileIdentitySeam: 'NO_FILE_BYTES_CURRENT_PHASE',
  parentRenderId: sellerPrintRender.id,
  priorRenderId: null,
  supersedesRenderId: null,
  supersededByRenderId: sellerUpdatePrintRender.id,
  renderReason: 'OUTPUT_VERSION_SUPERSESSION',
});

export function buildSellerPrintPdfRenderFoundation(): SellerPrintPdfRenderFoundation {
  const pdfRequest: AtlasPdfGenerationRequestSeam = Object.freeze({
    requestId: 'pdf-request-seam-seller-update-v1',
    sourceOutputVersionId: currentSellerUpdateOutput.id,
    sourceRenderId: sellerUpdatePrintRender.id,
    documentModelId: sellerUpdateDocument.id,
    requestedRenderType: 'PDF',
    rendererCandidate: 'HEADLESS_BROWSER_PDF',
    currentPhase: 'CONTRACT_ONLY_NOT_EXECUTED',
    requiredFutureProof: SELLER_PRINT_PDF_RENDER_FOUNDATION_NEXT_GATE,
  });

  const pdfResult: AtlasPdfGenerationResultSeam = Object.freeze({
    requestId: pdfRequest.requestId,
    status: 'NOT_EXECUTED_CURRENT_PHASE',
    fileHash: null,
    storageReference: null,
    contentFingerprint: sellerUpdatePrintRender.sourceContentFingerprint,
    renderFingerprint: sellerUpdatePrintRender.renderFingerprint,
    metadataState: 'METADATA_CONTRACT_DEFINED',
    bookmarkState: 'BOOKMARK_SPIKE_REQUIRED',
    taggedPdfState: 'TAGGED_PDF_SPIKE_REQUIRED',
  });

  return Object.freeze({
    status: SELLER_PRINT_PDF_RENDER_FOUNDATION_STATUS,
    version: SELLER_PRINT_PDF_RENDER_FOUNDATION_VERSION,
    nextGate: SELLER_PRINT_PDF_RENDER_FOUNDATION_NEXT_GATE,
    productStatus: SELLER_PRINT_PDF_RENDER_FOUNDATION_PRODUCT_STATUS,
    pdfActivationPosition: SELLER_PRINT_PDF_RENDER_FOUNDATION_PDF_ACTIVATION_POSITION,
    route: '/agent/prepare/seller/presentation',
    outputVersionFoundationVersion: OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_VERSION,
    currentPhase: 'PRINT_PREVIEW_AND_RENDER_DOMAIN_FIRST',
    documentModels: freezeArray([sellerDocument, sellerUpdateDocument]),
    outputRenders: freezeArray([sellerPrintRender, sellerUpdatePrintRender, sellerUpdatePriorPrintRender]),
    staticAssets,
    printCssRules: freezeArray([
      cssRule('PRINT_PAGE_SIZE', 'Letter page contract.', '@page'),
      cssRule('PRINT_MARGINS', 'Consistent print margins.', '@page margin'),
      cssRule('PRINT_CHROME_REMOVAL', 'Hide Agent shell and controls.', '[data-print-omit="true"]'),
      cssRule('PRINT_PAGE', 'Paginated page surface.', '[data-print-page="true"]'),
      cssRule('PRINT_COVER', 'Cover page layout.', '[data-print-role="cover"]'),
      cssRule('PRINT_SECTION_START', 'Start major sections cleanly.', '[data-print-section-start="true"]'),
      cssRule('PRINT_BREAK_AVOID', 'Avoid splitting cards/modules.', '[data-print-break="avoid"]'),
      cssRule('PRINT_TABLE_HEADER_REPEAT', 'Repeat print table headers.', 'thead'),
      cssRule('PRINT_ONLY', 'Show print-only provenance.', '[data-print-only="true"]'),
      cssRule('SCREEN_ONLY', 'Hide screen-only actions in print.', '[data-screen-only="true"]'),
      cssRule('PRINT_HEADER_FOOTER', 'Expose version/as-of/footer information.', '[data-testid="seller-brief-print-footer"]'),
      cssRule('PRINT_MAP_CHART_FALLBACK', 'Use map/chart text equivalents.', '[data-print-static-asset="true"]'),
    ]),
    browserPrintAdapters: freezeArray([
      Object.freeze({ action: 'VIEW_PRINT_PREVIEW', currentPhase: 'SUPPORTED', invocation: 'MODE_SWITCH', persistence: false, pdfGeneration: false, delivery: false }),
      Object.freeze({ action: 'PRINT', currentPhase: 'SUPPORTED', invocation: 'WINDOW_PRINT', persistence: false, pdfGeneration: false, delivery: false }),
    ]),
    pdfRequestSeams: freezeArray([pdfRequest]),
    pdfResultSeams: freezeArray([pdfResult]),
    renderQa: freezeArray([
      qa('qa-output-version-match', 'VERSION_MATCH', 'Render source output version equals the reviewed output version.', 'PASS', currentSellerUpdateOutput.id),
      qa('qa-content-fingerprint-match', 'VERSION_MATCH', 'Render source content fingerprint matches the output version fingerprint.', 'PASS', currentSellerUpdateOutput.contentFingerprint),
      qa('qa-document-pages-resolve', 'DOCUMENT_STRUCTURE', 'Document pages, sections, modules, and block order resolve deterministically.', 'PASS', sellerUpdateDocument.id),
      qa('qa-print-css-contract', 'PRINT_CSS', 'Print CSS covers page size, margins, chrome removal, breaks, print-only and screen-only rules.', 'PASS', 'app/globals.css'),
      qa('qa-static-asset-contract', 'STATIC_ASSET', 'Map, chart, image, and evidence assets have static/text-equivalent print seams.', 'PASS', 'static asset manifest'),
      qa('qa-accessibility-structure', 'ACCESSIBILITY', 'Semantic headings, tables, provenance, and text equivalents exist before PDF tagging.', 'PASS', 'component semantic structure'),
      qa('qa-pdf-renderer-held', 'PDF_SEAM', 'PDF request/result contracts exist but are not executed in current phase.', 'HELD_FOR_PDF_SPIKE', SELLER_PRINT_PDF_RENDER_FOUNDATION_NEXT_GATE),
      qa('qa-provenance-panel', 'PROVENANCE', 'Print preview exposes output version, render version, as-of, fingerprints, and held PDF status.', 'PASS', 'Agent preview UI'),
    ]),
    changeRules: freezeArray([
      changeRule('TYPOGRAPHY', 'Render successor allowed'),
      changeRule('SPACING', 'Render successor allowed'),
      changeRule('MARGINS', 'Render successor allowed'),
      changeRule('PAGE_BREAKS', 'Render successor allowed'),
      changeRule('HEADER_FOOTER_DESIGN', 'Render successor allowed'),
      changeRule('PAGINATION', 'Render successor allowed'),
      changeRule('CHART_STYLE_IDENTICAL_DATA', 'Render successor allowed'),
      changeRule('CONTENT', 'Output version successor required'),
      changeRule('EVIDENCE', 'Output version successor required'),
      changeRule('PRICING', 'Output version successor required'),
      changeRule('FINANCIAL_RESULT', 'Output version successor required'),
      changeRule('SELLER_DECISION', 'Output version successor required'),
      changeRule('RIGHTS', 'Rights review required'),
      changeRule('READING_ORDER', 'Accessibility review required'),
    ]),
    printPreviewUi: freezeArray([
      ui('seller-print-pdf-render-foundation', 'SellerPrintPdfRenderFoundationPanel', 'Render foundation panel.'),
      ui('seller-print-preview-product-bar', 'PrintPreviewProductBar', 'Output/render/as-of/readiness bar.'),
      ui('seller-print-document-model', 'PrintDocumentModelSummary', 'Document model and page composition.'),
      ui('seller-print-render-version-badge', 'PrintRenderVersionBadge', 'Current render version identity.'),
      ui('seller-print-static-asset-manifest', 'PrintStaticAssetManifest', 'Static map/chart/image fallback manifest.'),
      ui('seller-print-render-qa', 'PrintRenderQaSummary', 'Render QA state.'),
      ui('seller-print-browser-print-action', 'BrowserPrintAction', 'Browser print adapter.'),
      ui('seller-print-pdf-seam', 'PdfRendererSeam', 'Future PDF renderer seam.'),
      ui('seller-print-provenance-panel', 'PrintPreviewProvenancePanel', 'Version, fingerprint, evidence, and held-boundary provenance.'),
    ]),
    activationTable: freezeArray([
      activation('PRINT PREVIEW', 'Implemented as primary render consumer.', 'Maintain alongside output-version foundation.', false),
      activation('BROWSER PRINT', 'Supported through browser print adapter.', 'Visual QA before external use.', false),
      activation('PDF REQUEST CONTRACT', 'Defined only.', SELLER_PRINT_PDF_RENDER_FOUNDATION_NEXT_GATE, false),
      activation('PDF RESULT CONTRACT', 'Defined only.', SELLER_PRINT_PDF_RENDER_FOUNDATION_NEXT_GATE, false),
      activation('LOCAL PDF BYTES', 'Not generated.', SELLER_PRINT_PDF_RENDER_FOUNDATION_NEXT_GATE, false),
      activation('PDF METADATA', 'Contract defined.', SELLER_PRINT_PDF_RENDER_FOUNDATION_NEXT_GATE, false),
      activation('BOOKMARKS', 'Spike required.', SELLER_PRINT_PDF_RENDER_FOUNDATION_NEXT_GATE, false),
      activation('TAGGED PDF', 'Spike required.', SELLER_PRINT_PDF_RENDER_FOUNDATION_NEXT_GATE, false),
      activation('RENDER PERSISTENCE', 'Not implemented.', 'DURABLE_OUTPUT_PERSISTENCE', true),
      activation('DELIVERY / SHARING', 'Not implemented.', 'CLIENT_DELIVERY_ACTIVATION', true),
    ]),
    questionCoverage: freezeArray([
      coverage('What output version am I printing?', currentSellerUpdateOutput.id, sellerUpdatePrintRender.id),
      coverage('What render version am I viewing?', sellerUpdatePrintRender.renderVersion, sellerUpdatePrintRender.id),
      coverage('What document template is used?', sellerUpdateDocument.documentTemplateVersion, sellerUpdateDocument.id),
      coverage('What will the seller see?', 'Seller Update document pages and blocks resolve deterministically.', sellerUpdateDocument.id),
      coverage('What evidence and as-of applies?', sellerUpdateDocument.effectiveAsOf, sellerUpdateDocument.evidenceSnapshotReferences.join(',')),
      coverage('Is this render structurally ready?', sellerUpdatePrintRender.printReadiness, sellerUpdatePrintRender.qaState),
      coverage('Is content matched to the output version?', sellerUpdatePrintRender.sourceContentFingerprint, currentSellerUpdateOutput.contentFingerprint),
      coverage('Is the document print-ready?', sellerUpdatePrintRender.printReadiness, 'Browser print adapter'),
      coverage('What would a future PDF represent?', sellerUpdatePrintRender.renderFingerprint, pdfRequest.requestId),
      coverage('What prevents PDF activation?', SELLER_PRINT_PDF_RENDER_FOUNDATION_PDF_ACTIVATION_POSITION, SELLER_PRINT_PDF_RENDER_FOUNDATION_NEXT_GATE),
    ]),
    nextGateRanking: freezeArray([
      ranking(1, 'HEADLESS_PDF_RENDERER_FEASIBILITY_V1', 'The render domain and print document model now exist; the highest risk is whether deterministic PDF bytes can be produced safely.', ['Print/PDF render foundation', 'Document model', 'Static asset manifest'], 'Bounded PDF activation decision.'),
      ranking(2, 'DURABLE_OUTPUT_PERSISTENCE', 'Cross-session reviewed output/render history becomes material after PDF proof.', ['Output version foundation', 'Render foundation'], 'Historical render regeneration.'),
      ranking(3, 'SELLER_FINANCIAL_DECISION_PREPARATION_V1', 'Financial references are linked but remain preparation-only.', ['Pricing framework', 'Render foundation'], 'Seller-facing financial decision product.'),
      ranking(4, 'ADVANCED_STATIC_MAP_CHART_RENDERING', 'Static fallback seams exist; richer rendering can improve PDF quality after renderer feasibility.', ['Static asset manifest', 'PDF renderer proof'], 'Higher-fidelity print assets.'),
      ranking(5, 'BUYER_PRESENTATION_PRODUCT_EXPANSION', 'Shared render language is reusable after Seller proves print/PDF path.', ['Shared output foundation', 'Render foundation'], 'Buyer product reuse.'),
    ]),
    protectedBoundaries: SELLER_PRINT_PDF_RENDER_PROTECTED_BOUNDARIES,
  });
}

function cssRule(token: string, purpose: string, selector: string): AtlasPrintCssRule {
  return Object.freeze({ token, purpose, selector, required: true });
}

function ui(marker: string, component: string, purpose: string) {
  return Object.freeze({ marker, component, purpose });
}

function activation(capability: string, currentPackage: string, futureActivation: string, persistenceNeeded: boolean) {
  return Object.freeze({ capability, currentPackage, futureActivation, persistenceNeeded });
}

function coverage(question: string, answer: string, evidence: string) {
  return Object.freeze({ question, answer, evidence });
}

function ranking(rank: number, gate: string, why: string, dependencies: readonly string[], unlocks: string) {
  return Object.freeze({ rank, gate, why, dependencies: freezeArray(dependencies), unlocks });
}

export const SELLER_PRINT_PDF_RENDER_FOUNDATION_FIXTURE = buildSellerPrintPdfRenderFoundation();
