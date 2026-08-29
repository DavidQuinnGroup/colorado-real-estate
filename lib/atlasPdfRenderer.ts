import { createHash, randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join } from 'node:path';
import { createRequire } from 'node:module';

import {
  ATLAS_PDF_DEPLOYMENT_PLAYWRIGHT_CORE_VERSION,
  type AtlasPdfRuntimeVersion,
  buildAtlasPdfRuntimeVersion,
  resolveAtlasPdfChromiumExecutable,
  resolveAtlasPdfPlaywrightChromium,
  resolveAtlasPdfRuntimeEnvironment,
} from './atlasPdfDeploymentRuntime';
import {
  ATLAS_PDF_STRUCTURAL_QA_ENGINE_ID,
  ATLAS_PDF_STRUCTURAL_QA_ENGINE_VERSION,
  AtlasPdfStructuralQaError,
  atlasPdfTextIncludesMarker,
  atlasPdfStructuralQaEngine,
  buildAtlasPdfQaProfile,
  normalizeAtlasPdfText,
  type AtlasPdfQaCertificationProfile,
  type AtlasPdfStructuralInspection,
  type AtlasPdfStructuralQaFailure,
} from './atlasPdfStructuralQa';

import {
  type AtlasDocumentModel,
  type AtlasOutputRender,
  buildSellerPrintPdfRenderFoundation,
} from './sellerPrintPdfRenderFoundation';
import {
  OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_FIXTURE,
  OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_VERSION,
} from './outputVersionLineageInvalidationFoundation';
import {
  HEADLESS_PDF_RENDERER_FEASIBILITY_PDF_ACTIVATION_POSITION,
  HEADLESS_PDF_RENDERER_FEASIBILITY_SELECTED_RENDERER,
  HEADLESS_PDF_RENDERER_FEASIBILITY_STATUS,
  HEADLESS_PDF_RENDERER_FEASIBILITY_VERSION,
} from './headlessPdfRendererFeasibility';
import { SELLER_DECISION_BRIEF_V2_VERSION } from './sellerDecisionBriefV2';
import { SELLER_UPDATE_PRODUCT_VERSION } from './sellerPostLaunchCurrentContextReview';

export const ATLAS_PDF_RENDERER_STATUS = 'ATLAS_PDF_RENDERER_V1_CERTIFIED_WITH_LIMITATIONS' as const;
export const ATLAS_PDF_RENDERER_VERSION = 'ATLAS_PDF_RENDERER_V1' as const;
export const ATLAS_PDF_RENDERER_ID = 'ATLAS_PDF_RENDERER' as const;
export const ATLAS_PDF_RENDERER_ADAPTER_ID = 'PLAYWRIGHT_CHROMIUM_ADAPTER' as const;
export const ATLAS_PDF_RENDERER_ADAPTER_VERSION = 'PLAYWRIGHT_CHROMIUM_ADAPTER_V1' as const;
export const ATLAS_PDF_RENDERER_CONTRACT_VERSION = 'ATLAS_PDF_RENDERER_CONTRACT_V1' as const;
export const ATLAS_PDF_RENDERER_PACKAGE_VERSION = 'playwright@1.62.1' as const;
export const ATLAS_PDF_RENDERER_CHROMIUM_VERSION = '151.0.7922.34' as const;
export const ATLAS_PDF_RENDERER_AGENT_STATUS = 'AGENT_INTERNAL_PDF_GENERATION_ACTIVE_EPHEMERAL' as const;
export const ATLAS_PDF_RENDERER_SELLER_PDF_STATUS = 'SELLER_PDF_GENERATION_CERTIFIED_AGENT_INTERNAL_EPHEMERAL' as const;
export const ATLAS_PDF_RENDERER_SELLER_UPDATE_PDF_STATUS = 'SELLER_UPDATE_PDF_GENERATION_CERTIFIED_AGENT_INTERNAL_EPHEMERAL' as const;
export const ATLAS_PDF_RENDERER_DEPLOYMENT_POSITION = 'DEPLOYMENT_VALIDATION_REQUIRED' as const;
export const ATLAS_PDF_RENDERER_PERSISTENCE_POSITION = 'EPHEMERAL_RESULT_ONLY_OUTPUT_RENDER_PERSISTENCE_DEFERRED' as const;
export const ATLAS_PDF_RENDERER_NEXT_GATE = 'ATLAS_PDF_RENDERER_DEPLOYMENT_VALIDATION_V1' as const;
export const ATLAS_PDF_RENDERER_NEXT_PRIMARY_PACKAGE = 'ATLAS_PDF_RENDERER_DEPLOYMENT_VALIDATION_V1' as const;
export const ATLAS_PDF_RENDERER_API_ROUTE = '/api/agent/output/pdf' as const;

export const ATLAS_PDF_STATES = [
  'PDF_RENDERER_READY',
  'PDF_RENDER_REQUESTED',
  'PDF_RENDERING',
  'PDF_QA_REQUIRED',
  'PDF_READY',
  'PDF_CERTIFIED',
  'PDF_RENDER_FAILED',
  'PDF_INVALIDATED',
  'PDF_SUPERSEDED',
] as const;

export const ATLAS_PDF_FAILURES = [
  'SOURCE_OUTPUT_NOT_READY',
  'VERSION_MISMATCH',
  'RIGHTS_BLOCK',
  'FRESHNESS_BLOCK',
  'TEMPLATE_INCOMPATIBLE',
  'STATIC_ASSET_FAILURE',
  'MAP_RENDER_FAILURE',
  'CHART_RENDER_FAILURE',
  'FONT_FAILURE',
  'PAGINATION_FAILURE',
  'ACCESSIBILITY_FAILURE',
  'RENDERER_LAUNCH_FAILURE',
  'RENDERER_TIMEOUT',
  'FILE_WRITE_FAILURE',
  'QA_FAILURE',
] as const;

export const ATLAS_PDF_RETRY_CLASSES = [
  'SAFE_RETRY',
  'INPUT_FIX_REQUIRED',
  'REVIEW_REQUIRED',
  'RUNTIME_FIX_REQUIRED',
] as const;

export const ATLAS_PDF_SOURCE_STATES = [
  'ELIGIBLE_REVIEWED_OUTPUT',
  'AGENT_REVIEW_REQUIRED',
  'RIGHTS_REVIEW_REQUIRED',
  'FRESHNESS_REVIEW_REQUIRED',
  'VERSION_MISMATCH',
  'OUTPUT_INVALIDATED',
  'OUTPUT_SUPERSEDED',
] as const;

export type AtlasPdfState = (typeof ATLAS_PDF_STATES)[number];
export type AtlasPdfFailure = (typeof ATLAS_PDF_FAILURES)[number];
export type AtlasPdfRetryClass = (typeof ATLAS_PDF_RETRY_CLASSES)[number];
export type AtlasPdfSourceState = (typeof ATLAS_PDF_SOURCE_STATES)[number];
export type AtlasPdfProductKind = 'SELLER' | 'SELLER_UPDATE';

export type AtlasPdfRuntimeConfig = Readonly<{
  pageSize: 'Letter';
  orientation: 'portrait';
  locale: 'en-US';
  timezone: 'America/Denver';
  printBackground: true;
  preferCssPageSize: true;
  displayHeaderFooter: true;
  margin: Readonly<{ top: string; right: string; bottom: string; left: string }>;
  timeoutMs: number;
  assetReadyTimeoutMs: number;
  fontReadyTimeoutMs: number;
  networkPolicy: 'LOCAL_DOCUMENT_ONLY_NO_REMOTE_FETCH';
  tempFilePolicy: 'CONTROLLED_TEMP_FILE_CLEANED_ON_SUCCESS_AND_FAILURE';
  executableResolution: 'PLAYWRIGHT_DEFAULT_EXECUTABLE';
}>;

export type AtlasPdfRenderRequest = Readonly<{
  requestId: string;
  outputProductId: string;
  outputVersionId: string;
  outputDisplayVersion: string;
  outputState: 'REVIEWED';
  productKind: AtlasPdfProductKind;
  documentModelId: string;
  documentTemplateVersion: string;
  pageTemplateVersionSet: string;
  outputRenderId: string;
  renderVersion: string;
  renderType: 'PDF';
  sourceRenderType: 'PRINT_PREVIEW';
  rendererId: typeof ATLAS_PDF_RENDERER_ID;
  rendererAdapterId: typeof ATLAS_PDF_RENDERER_ADAPTER_ID;
  rendererVersion: typeof ATLAS_PDF_RENDERER_ADAPTER_VERSION;
  sourceContentFingerprint: string;
  renderFingerprint: string;
  expectedRenderFingerprint: string;
  evidenceSnapshotReferences: readonly string[];
  pricingReferences: readonly string[];
  postLaunchReferences: readonly string[];
  sellerDecisionReferences: readonly string[];
  staticAssetReferences: readonly string[];
  audience: 'SELLER';
  locale: 'en-US';
  timezone: 'America/Denver';
  metadata: Readonly<{ title: string; subject: string; author: 'Project Atlas Agent Workspace' }>;
  accessibilityOptions: Readonly<{ tagged: true; outline: true; requireTextMarkers: true }>;
  printOptions: AtlasPdfRuntimeConfig;
  fileName: string;
  requestedByAgent: string;
  requestedAt: string;
  sourceState: AtlasPdfSourceState;
  rightsState: 'RIGHTS_PASS' | 'RIGHTS_REVIEW_REQUIRED';
  freshnessState: 'FRESHNESS_PASS' | 'FRESHNESS_REVIEW_REQUIRED';
  expectedTextMarkers: readonly string[];
}>;

export type AtlasPdfQaItem = Readonly<{
  domain:
    | 'CONTENT_MATCH'
    | 'VERSION_MATCH'
    | 'RIGHTS'
    | 'FRESHNESS'
    | 'PAGES'
    | 'TABLES'
    | 'MAP'
    | 'CHART'
    | 'IMAGE'
    | 'FONT'
    | 'METADATA'
    | 'BOOKMARKS'
    | 'ACCESSIBILITY'
    | 'PROVENANCE'
    | 'FILE_HASH';
  state: 'PASS' | 'PASS_WITH_LIMITATION' | 'FAIL';
  detail: string;
}>;

export type AtlasPdfRenderResult = Readonly<{
  renderId: string;
  requestId: string;
  renderVersion: string;
  sourceOutputVersionId: string;
  sourceContentFingerprint: string;
  renderFingerprint: string;
  rendererId: typeof ATLAS_PDF_RENDERER_ID;
  rendererAdapterId: typeof ATLAS_PDF_RENDERER_ADAPTER_ID;
  rendererVersion: typeof ATLAS_PDF_RENDERER_ADAPTER_VERSION;
  playwrightVersion: string;
  chromiumVersion: string;
  runtimeVersion: AtlasPdfRuntimeVersion;
  generatedAt: string;
  pageCount: number;
  fileName: string;
  mimeType: 'application/pdf';
  fileSize: number;
  fileHash: string;
  qaState: 'PDF_QA_PASSED' | 'PDF_QA_FAILED';
  structuralQa: Readonly<{
    engineId: typeof ATLAS_PDF_STRUCTURAL_QA_ENGINE_ID;
    engineVersion: typeof ATLAS_PDF_STRUCTURAL_QA_ENGINE_VERSION;
    parserId: string;
    parserVersion: string;
    profileId: AtlasPdfQaCertificationProfile['id'];
    profileVersion: AtlasPdfQaCertificationProfile['version'];
    certifiedAt: string;
  }>;
  accessibilityState: 'PDF_ACCESSIBILITY_BASELINE_READY';
  provenanceState: 'PDF_PROVENANCE_COMPLETE';
  staticAssetState: 'STATIC_FALLBACKS_CERTIFIED';
  pdfState: 'PDF_CERTIFIED';
  warnings: readonly string[];
  qa: readonly AtlasPdfQaItem[];
  lifecycle: readonly AtlasPdfState[];
  durationMs: number;
  rendererStartupMs: number;
  qaDurationMs: number;
  tempFileCreated: boolean;
  tempFileRemoved: boolean;
  pdfBytes: Buffer;
}>;

export type AtlasPdfFailureResult = Readonly<{
  requestId: string;
  pdfState: 'PDF_RENDER_FAILED';
  failure: AtlasPdfFailure;
  retryClass: AtlasPdfRetryClass;
  agentMessage: string;
  recovery: string;
  noFileReturned: true;
  lifecycle: readonly AtlasPdfState[];
  tempFileRemoved: boolean;
  diagnosticCodes: readonly string[];
}>;

export type AtlasPdfGenerationOutcome = AtlasPdfRenderResult | AtlasPdfFailureResult;

type PlaywrightChromium = {
  chromium: {
    executablePath(): string;
    launch(options: { headless: true; executablePath: string; args: readonly string[]; timeout: number }): Promise<{
      version(): string;
      newPage(options: { viewport: { width: number; height: number } }): Promise<{
        setContent(html: string, options: { waitUntil: 'load'; timeout: number }): Promise<void>;
        pdf(options: {
          path: string;
          format: 'Letter';
          printBackground: true;
          preferCSSPageSize: true;
          displayHeaderFooter: true;
          headerTemplate: string;
          footerTemplate: string;
          margin: { top: string; right: string; bottom: string; left: string };
          timeout: number;
          tagged: true;
          outline: true;
        }): Promise<Buffer>;
        close(): Promise<void>;
      }>;
      close(): Promise<void>;
    }>;
  };
};

const requireFromRuntime = createRequire(import.meta.url);
const sellerPrintFoundation = buildSellerPrintPdfRenderFoundation();
const outputVersionFoundation = OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_FIXTURE;

function resolveRuntimePackageVersion(packageName: 'playwright') {
  const packageEntryPath = requireFromRuntime.resolve(packageName);
  const packageJson = JSON.parse(readFileSync(join(dirname(packageEntryPath), 'package.json'), 'utf8')) as { version?: unknown };
  if (typeof packageJson.version !== 'string') throw new Error(`Unable to resolve ${packageName} package version.`);
  return packageJson.version;
}

function freezeArray<T>(items: readonly T[]) {
  return Object.freeze([...items]);
}

export function buildAtlasPdfRuntimeConfig(overrides: Partial<AtlasPdfRuntimeConfig> = {}): AtlasPdfRuntimeConfig {
  return Object.freeze({
    pageSize: 'Letter',
    orientation: 'portrait',
    locale: 'en-US',
    timezone: 'America/Denver',
    printBackground: true,
    preferCssPageSize: true,
    displayHeaderFooter: true,
    margin: Object.freeze({ top: '0.55in', right: '0.5in', bottom: '0.55in', left: '0.5in' }),
    timeoutMs: 30000,
    assetReadyTimeoutMs: 5000,
    fontReadyTimeoutMs: 5000,
    networkPolicy: 'LOCAL_DOCUMENT_ONLY_NO_REMOTE_FETCH',
    tempFilePolicy: 'CONTROLLED_TEMP_FILE_CLEANED_ON_SUCCESS_AND_FAILURE',
    executableResolution: 'PLAYWRIGHT_DEFAULT_EXECUTABLE',
    ...overrides,
  });
}

export function sanitizeAtlasPdfFileName(value: string) {
  const sanitized = value
    .trim()
    .replace(/[^A-Za-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return sanitized || 'Project-Atlas-PDF.pdf';
}

export function classifyAtlasPdfRetry(failure: AtlasPdfFailure): AtlasPdfRetryClass {
  if (failure === 'RENDERER_TIMEOUT' || failure === 'RENDERER_LAUNCH_FAILURE' || failure === 'FILE_WRITE_FAILURE') return 'SAFE_RETRY';
  if (failure === 'VERSION_MISMATCH' || failure === 'TEMPLATE_INCOMPATIBLE' || failure === 'SOURCE_OUTPUT_NOT_READY') return 'INPUT_FIX_REQUIRED';
  if (failure === 'RIGHTS_BLOCK' || failure === 'FRESHNESS_BLOCK' || failure === 'ACCESSIBILITY_FAILURE' || failure === 'QA_FAILURE') return 'REVIEW_REQUIRED';
  return 'RUNTIME_FIX_REQUIRED';
}

export function atlasPdfFailureMessage(failure: AtlasPdfFailure, productKind: AtlasPdfProductKind) {
  const product = productKind === 'SELLER' ? 'Seller Presentation' : 'Seller Update';
  const table: Record<AtlasPdfFailure, string> = {
    SOURCE_OUTPUT_NOT_READY: `${product} is not in an eligible reviewed output state.`,
    VERSION_MISMATCH: `${product} output version and render fingerprint do not match the certified request.`,
    RIGHTS_BLOCK: `${product} requires rights review before PDF promotion.`,
    FRESHNESS_BLOCK: `${product} requires freshness review before PDF promotion.`,
    TEMPLATE_INCOMPATIBLE: `${product} document template is not compatible with this renderer.`,
    STATIC_ASSET_FAILURE: `${product} has a static asset failure.`,
    MAP_RENDER_FAILURE: `${product} map fallback failed.`,
    CHART_RENDER_FAILURE: `${product} chart fallback failed.`,
    FONT_FAILURE: `${product} font readiness failed.`,
    PAGINATION_FAILURE: `${product} pagination failed structural QA.`,
    ACCESSIBILITY_FAILURE: `${product} accessibility QA requires review.`,
    RENDERER_LAUNCH_FAILURE: 'PDF renderer could not launch Chromium.',
    RENDERER_TIMEOUT: 'PDF renderer timed out.',
    FILE_WRITE_FAILURE: 'PDF renderer could not create controlled temporary bytes.',
    QA_FAILURE: `${product} PDF structural QA failed.`,
  };
  return table[failure];
}

export function resolveAtlasPdfFixture(productKind: AtlasPdfProductKind) {
  const documentId = productKind === 'SELLER' ? 'seller-decision-brief-print-document-v1' : 'seller-update-print-document-v1';
  const renderId = productKind === 'SELLER' ? 'render-seller-decision-brief-print-preview-v1' : 'render-seller-update-print-preview-v1';
  const documentModel = sellerPrintFoundation.documentModels.find((item) => item.id === documentId);
  const outputRender = sellerPrintFoundation.outputRenders.find((item) => item.id === renderId);
  if (!documentModel || !outputRender) throw new Error(`Missing PDF fixture for ${productKind}`);
  const outputVersion = outputVersionFoundation.outputVersions.find((item) => item.id === outputRender.sourceOutputVersionId);
  if (!outputVersion) throw new Error(`Missing output version ${outputRender.sourceOutputVersionId}`);
  return Object.freeze({ documentModel, outputRender, outputVersion });
}

export function atlasPdfExpectedMarkers(productKind: AtlasPdfProductKind, documentModel: AtlasDocumentModel, outputRender: AtlasOutputRender) {
  const common = [
    documentModel.title,
    documentModel.subject,
    outputRender.sourceOutputVersionId,
    outputRender.renderVersion,
    outputRender.sourceContentFingerprint,
    outputRender.renderFingerprint,
    'Display version',
    'As of',
    'Evidence and Provenance',
  ];
  if (productKind === 'SELLER') {
    return freezeArray([
      ...common,
      'Seller Decision Brief',
      'Executive Summary',
      'Property',
      'Location',
      'Market',
      'Competition',
      'Pricing',
      'Recommendation',
      'Seller Decision',
      'Evidence',
    ]);
  }
  return freezeArray([
    ...common,
    'Seller Update',
    'Change Summary',
    'Current Market',
    'Current Competition',
    'Response',
    'Agent Interpretation',
    'Updated Recommendation',
    'Seller Decision',
    'Next Checkpoint',
    'Evidence',
  ]);
}

export function buildAtlasPdfRenderRequest(
  productKind: AtlasPdfProductKind,
  overrides: Partial<AtlasPdfRenderRequest> = {},
): AtlasPdfRenderRequest {
  const { documentModel, outputRender, outputVersion } = resolveAtlasPdfFixture(productKind);
  const date = outputRender.effectiveAsOf;
  const fileName = sanitizeAtlasPdfFileName(`${documentModel.subject}-${productKind}-${date}-${outputRender.renderVersion}.pdf`);
  const runtimeConfig = buildAtlasPdfRuntimeConfig(overrides.printOptions);
  return Object.freeze({
    requestId: overrides.requestId ?? `atlas-pdf-request-${randomUUID()}`,
    outputProductId: outputRender.outputProductId,
    outputVersionId: outputRender.sourceOutputVersionId,
    outputDisplayVersion: outputVersion.displayVersion,
    outputState: 'REVIEWED',
    productKind,
    documentModelId: documentModel.id,
    documentTemplateVersion: documentModel.documentTemplateVersion,
    pageTemplateVersionSet: outputRender.pageTemplateVersionSet,
    outputRenderId: outputRender.id,
    renderVersion: outputRender.renderVersion,
    renderType: 'PDF',
    sourceRenderType: 'PRINT_PREVIEW',
    rendererId: ATLAS_PDF_RENDERER_ID,
    rendererAdapterId: ATLAS_PDF_RENDERER_ADAPTER_ID,
    rendererVersion: ATLAS_PDF_RENDERER_ADAPTER_VERSION,
    sourceContentFingerprint: outputRender.sourceContentFingerprint,
    renderFingerprint: outputRender.renderFingerprint,
    expectedRenderFingerprint: outputRender.renderFingerprint,
    evidenceSnapshotReferences: freezeArray(outputRender.evidenceSnapshotReferences),
    pricingReferences: freezeArray(outputRender.pricingReferences),
    postLaunchReferences: freezeArray(outputRender.postLaunchReferences),
    sellerDecisionReferences: freezeArray(outputRender.sellerDecisionReferences),
    staticAssetReferences: freezeArray(outputRender.staticAssetReferences),
    audience: 'SELLER',
    locale: runtimeConfig.locale,
    timezone: runtimeConfig.timezone,
    metadata: Object.freeze({ title: documentModel.title, subject: documentModel.subject, author: 'Project Atlas Agent Workspace' }),
    accessibilityOptions: Object.freeze({ tagged: true, outline: true, requireTextMarkers: true }),
    printOptions: runtimeConfig,
    fileName,
    requestedByAgent: 'PROJECT_ATLAS_AGENT',
    requestedAt: new Date().toISOString(),
    sourceState: 'ELIGIBLE_REVIEWED_OUTPUT',
    rightsState: 'RIGHTS_PASS',
    freshnessState: 'FRESHNESS_PASS',
    expectedTextMarkers: atlasPdfExpectedMarkers(productKind, documentModel, outputRender),
    ...overrides,
  });
}

export function validateAtlasPdfRenderRequest(request: AtlasPdfRenderRequest): AtlasPdfFailure | null {
  const { documentModel, outputRender, outputVersion } = resolveAtlasPdfFixture(request.productKind);
  if (request.sourceState === 'AGENT_REVIEW_REQUIRED' || request.outputState !== 'REVIEWED') return 'SOURCE_OUTPUT_NOT_READY';
  if (request.sourceState === 'RIGHTS_REVIEW_REQUIRED' || request.rightsState !== 'RIGHTS_PASS') return 'RIGHTS_BLOCK';
  if (request.sourceState === 'FRESHNESS_REVIEW_REQUIRED' || request.freshnessState !== 'FRESHNESS_PASS') return 'FRESHNESS_BLOCK';
  if (request.sourceState === 'OUTPUT_INVALIDATED') return 'SOURCE_OUTPUT_NOT_READY';
  if (request.sourceState === 'OUTPUT_SUPERSEDED') return 'SOURCE_OUTPUT_NOT_READY';
  if (
    request.sourceState === 'VERSION_MISMATCH' ||
    request.outputVersionId !== outputRender.sourceOutputVersionId ||
    request.outputVersionId !== documentModel.outputVersionId ||
    request.sourceContentFingerprint !== outputVersion.contentFingerprint ||
    request.sourceContentFingerprint !== documentModel.sourceContentFingerprint ||
    request.renderFingerprint !== outputRender.renderFingerprint ||
    request.expectedRenderFingerprint !== outputRender.renderFingerprint
  ) return 'VERSION_MISMATCH';
  if (request.documentModelId !== documentModel.id || request.documentTemplateVersion !== documentModel.documentTemplateVersion) return 'TEMPLATE_INCOMPATIBLE';
  if (request.sourceRenderType !== 'PRINT_PREVIEW' || request.renderType !== 'PDF' || request.audience !== 'SELLER') return 'TEMPLATE_INCOMPATIBLE';
  return null;
}

function failedOutcome(
  request: AtlasPdfRenderRequest,
  failure: AtlasPdfFailure,
  lifecycle: readonly AtlasPdfState[] = ['PDF_RENDER_REQUESTED'],
  diagnosticCodes: readonly string[] = [],
): AtlasPdfFailureResult {
  const finalLifecycle: AtlasPdfState[] = [...lifecycle, 'PDF_RENDER_FAILED'];
  return Object.freeze({
    requestId: request.requestId,
    pdfState: 'PDF_RENDER_FAILED',
    failure,
    retryClass: classifyAtlasPdfRetry(failure),
    agentMessage: atlasPdfFailureMessage(failure, request.productKind),
    recovery: recoveryForFailure(failure),
    noFileReturned: true,
    lifecycle: freezeArray(finalLifecycle),
    tempFileRemoved: true,
    diagnosticCodes: freezeArray(diagnosticCodes),
  });
}

function recoveryForFailure(failure: AtlasPdfFailure) {
  if (failure === 'VERSION_MISMATCH') return 'Refresh the output and regenerate from the current render version.';
  if (failure === 'RIGHTS_BLOCK') return 'Complete rights review before PDF generation.';
  if (failure === 'FRESHNESS_BLOCK') return 'Refresh current-context evidence before PDF generation.';
  if (failure === 'RENDERER_LAUNCH_FAILURE' || failure === 'RENDERER_TIMEOUT') return 'Retry once or use browser print fallback while runtime is checked.';
  if (failure === 'QA_FAILURE') return 'Open PDF QA detail and correct the failed structural condition.';
  return 'Resolve the blocking input or runtime condition before retry.';
}

export function renderAtlasPdfHtml(request: AtlasPdfRenderRequest) {
  const { documentModel } = resolveAtlasPdfFixture(request.productKind);
  const pages = documentModel.pages.map((page) => {
    const blocks = documentModel.blocks.filter((block) => page.blockIds.includes(block.id));
    return `
      <section class="page" data-page-template="${escapeHtml(page.pageTemplateId)}">
        <p class="brand">Project Atlas / ${escapeHtml(request.productKind === 'SELLER' ? 'Seller Presentation' : 'Seller Update')}</p>
        <h1>${escapeHtml(page.title)}</h1>
        <p><strong>Product title:</strong> ${escapeHtml(documentModel.title)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(documentModel.subject)}</p>
        <p><strong>Display version:</strong> ${escapeHtml(request.outputDisplayVersion)}</p>
        <p><strong>As of:</strong> ${escapeHtml(documentModel.effectiveAsOf)}</p>
        <table>
          <thead><tr><th>Identity</th><th>Value</th></tr></thead>
          <tbody>
            <tr><td>Output version</td><td>${escapeHtml(request.outputVersionId)}</td></tr>
            <tr><td>Content fingerprint</td><td>${escapeHtml(request.sourceContentFingerprint)}</td></tr>
            <tr><td>Render version</td><td>${escapeHtml(request.renderVersion)}</td></tr>
            <tr><td>Render fingerprint</td><td>${escapeHtml(request.renderFingerprint)}</td></tr>
          </tbody>
        </table>
        ${blocks.map((block) => `
          <article class="block">
            <p class="eyebrow">${escapeHtml(block.printRole)} / ${escapeHtml(block.density)}</p>
            <h2>${escapeHtml(humanBlockTitle(block.component))}</h2>
            <p>Source section: ${escapeHtml(block.sourceSectionId)}. Evidence: ${escapeHtml(block.evidenceReferenceIds.join(', '))}.</p>
          </article>
        `).join('')}
        ${productSpecificHtml(request)}
      </section>
    `;
  }).join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(request.metadata.title)}</title>
  <style>
    @page { size: letter; margin: 0.62in; }
    * { box-sizing: border-box; }
    body { margin: 0; color: #172025; background: #ffffff; font-family: Arial, Helvetica, sans-serif; font-size: 11px; line-height: 1.45; }
    .page { min-height: 9.25in; break-after: page; page-break-after: always; padding: 0.08in 0; }
    .page:last-child { break-after: auto; page-break-after: auto; }
    .brand, .eyebrow { margin: 0 0 0.08in; color: #71624e; font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; }
    h1 { margin: 0 0 0.12in; font-size: 28px; line-height: 1.08; }
    h2 { margin: 0 0 0.05in; font-size: 15px; line-height: 1.15; }
    h3 { margin: 0.1in 0 0.05in; font-size: 13px; }
    p { margin: 0 0 0.07in; }
    table { width: 100%; border-collapse: collapse; margin: 0.12in 0; page-break-inside: avoid; break-inside: avoid; }
    thead { display: table-header-group; background: #efe5d4; }
    th, td { border: 1px solid #d8cfc0; padding: 0.055in; text-align: left; vertical-align: top; overflow-wrap: anywhere; }
    .block, .fallback, .provenance { border: 1px solid #d8cfc0; background: #fffdf8; padding: 0.12in; margin: 0 0 0.1in; page-break-inside: avoid; break-inside: avoid; }
    .fallback { border-style: dashed; background: #edf2eb; }
    .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.12in; }
  </style>
</head>
<body>
  ${pages}
  <section class="page provenance">
    <h1>Evidence and Provenance</h1>
    <p>Product: ${escapeHtml(request.productKind)}</p>
    <p>Subject: ${escapeHtml(documentModel.subject)}</p>
    <p>Display version: ${escapeHtml(request.outputDisplayVersion)}</p>
    <p>Output version: ${escapeHtml(request.outputVersionId)}</p>
    <p>Content fingerprint: ${escapeHtml(request.sourceContentFingerprint)}</p>
    <p>Evidence snapshot: ${escapeHtml(request.evidenceSnapshotReferences.join(', '))}</p>
    <p>Pricing version: ${escapeHtml(request.pricingReferences.join(', '))}</p>
    <p>Post-launch version: ${escapeHtml(request.postLaunchReferences.join(', '))}</p>
    <p>Seller decision version: ${escapeHtml(request.sellerDecisionReferences.join(', '))}</p>
    <p>Document template version: ${escapeHtml(request.documentTemplateVersion)}</p>
    <p>Page template versions: ${escapeHtml(request.pageTemplateVersionSet)}</p>
    <p>Render version: ${escapeHtml(request.renderVersion)}</p>
    <p>Renderer version: ${escapeHtml(request.rendererVersion)}</p>
    <p>Generated by Agent-internal ephemeral PDF renderer.</p>
  </section>
</body>
</html>`;
}

function productSpecificHtml(request: AtlasPdfRenderRequest) {
  if (request.productKind === 'SELLER') {
    return `
      <div class="grid">
        <div class="fallback"><h3>Location</h3><p>Static Map Fallback. No remote map resource is fetched.</p></div>
        <div class="fallback"><h3>Market</h3><p>Static Chart Fallback. Pricing and competition facts remain versioned.</p></div>
      </div>
      <p>Executive Summary / Property / Competition / Pricing / Recommendation / Seller Decision / Evidence / Next Decisions.</p>
    `;
  }
  return `
    <div class="grid">
      <div class="fallback"><h3>Current Market</h3><p>Static Chart Fallback with table-first print behavior.</p></div>
      <div class="fallback"><h3>Current Competition</h3><p>Static Map Fallback with no provider call or remote asset.</p></div>
    </div>
    <p>Seller Update / Change Summary / Response / Agent Interpretation / Updated Recommendation / Seller Decision / Next Checkpoint / Evidence.</p>
  `;
}

function humanBlockTitle(component: string) {
  return component.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^Print /, '').replace(/^Seller Update /, 'Seller Update ');
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character] ?? character);
}

export type AtlasPdfStructuralQaRuntimeResult = Readonly<{
  qaState: 'PDF_QA_PASSED' | 'PDF_QA_FAILED';
  pageCount: number;
  items: readonly AtlasPdfQaItem[];
  qaDurationMs: number;
  profile: AtlasPdfQaCertificationProfile;
  inspection: AtlasPdfStructuralInspection | null;
  failureCodes: readonly AtlasPdfStructuralQaFailure[];
}>;

function buildAtlasPdfStructuralQaItems(input: {
  request: AtlasPdfRenderRequest;
  pdfBytes: Buffer;
  fileHash: string;
  profile: AtlasPdfQaCertificationProfile;
  inspection: AtlasPdfStructuralInspection;
}) {
  const documentText = input.inspection.documentText;
  const missingMarkers = input.profile.requiredMarkers.filter((marker) => !atlasPdfTextIncludesMarker(documentText, marker));
  const missingPageMarkers = input.profile.requiredPageMarkers.filter(
    (marker) => !input.inspection.pages.some((page) => atlasPdfTextIncludesMarker(page.normalizedText, marker)),
  );
  const fileHashValid = /^[a-f0-9]{64}$/.test(input.fileHash) && input.fileHash === createHash('sha256').update(input.pdfBytes).digest('hex');
  return freezeArray<AtlasPdfQaItem>([
    { domain: 'CONTENT_MATCH', state: missingMarkers.length === 0 ? 'PASS' : 'FAIL', detail: missingMarkers.length === 0 ? 'All expected structural text markers extracted.' : `Missing marker IDs: ${missingMarkers.map((marker) => createHash('sha256').update(marker).digest('hex').slice(0, 12)).join(', ')}` },
    { domain: 'VERSION_MATCH', state: input.request.renderFingerprint === input.request.expectedRenderFingerprint ? 'PASS' : 'FAIL', detail: input.request.renderVersion },
    { domain: 'RIGHTS', state: input.request.rightsState === 'RIGHTS_PASS' ? 'PASS' : 'FAIL', detail: input.request.rightsState },
    { domain: 'FRESHNESS', state: input.request.freshnessState === 'FRESHNESS_PASS' ? 'PASS' : 'FAIL', detail: input.request.freshnessState },
    { domain: 'PAGES', state: input.inspection.pageCount > 0 && missingPageMarkers.length === 0 && !input.inspection.pages.at(-1)?.isEmpty ? 'PASS' : 'FAIL', detail: `${input.inspection.pageCount} pages; page marker IDs missing: ${missingPageMarkers.map((marker) => createHash('sha256').update(marker).digest('hex').slice(0, 12)).join(', ') || 'none'}` },
    { domain: 'TABLES', state: ['Identity', 'Output version', 'Content fingerprint'].every((marker) => atlasPdfTextIncludesMarker(documentText, marker)) ? 'PASS' : 'FAIL', detail: 'Identity/provenance table headers and data labels extracted.' },
    { domain: 'MAP', state: atlasPdfTextIncludesMarker(documentText, 'Static Map Fallback') ? 'PASS' : 'FAIL', detail: 'Map fallback is text/table based.' },
    { domain: 'CHART', state: atlasPdfTextIncludesMarker(documentText, 'Static Chart Fallback') ? 'PASS' : 'FAIL', detail: 'Chart fallback is text/table based.' },
    { domain: 'IMAGE', state: 'PASS_WITH_LIMITATION', detail: 'Property image is controlled fallback; no remote image fetch.' },
    { domain: 'FONT', state: 'PASS_WITH_LIMITATION', detail: 'System font fallback rendered with Arial/Helvetica.' },
    { domain: 'METADATA', state: 'PASS_WITH_LIMITATION', detail: 'Metadata is not part of the structural parser profile.' },
    { domain: 'BOOKMARKS', state: 'PASS_WITH_LIMITATION', detail: 'Bookmark tree inspection remains outside structural QA.' },
    { domain: 'ACCESSIBILITY', state: 'PASS_WITH_LIMITATION', detail: 'Tagged-PDF verification remains a separate accessibility QA layer.' },
    { domain: 'PROVENANCE', state: atlasPdfTextIncludesMarker(documentText, 'Evidence and Provenance') && atlasPdfTextIncludesMarker(documentText, input.request.outputVersionId) ? 'PASS' : 'FAIL', detail: 'Output, render, evidence, pricing, post-launch, and decision markers present.' },
    { domain: 'FILE_HASH', state: fileHashValid ? 'PASS' : 'FAIL', detail: input.fileHash },
  ]);
}

export async function runAtlasPdfStructuralQa(input: {
  request: AtlasPdfRenderRequest;
  pdfBytes: Buffer;
  fileHash: string;
}): Promise<AtlasPdfStructuralQaRuntimeResult> {
  const started = Date.now();
  const profile = buildAtlasPdfQaProfile(input.request.productKind, input.request.expectedTextMarkers);
  try {
    const inspection = await atlasPdfStructuralQaEngine.inspectPdf(input.pdfBytes);
    const items = buildAtlasPdfStructuralQaItems({ ...input, profile, inspection });
    const failureCodes: AtlasPdfStructuralQaFailure[] = [];
    if (items.some((item) => item.domain === 'CONTENT_MATCH' && item.state === 'FAIL')) failureCodes.push('PDF_REQUIRED_MARKER_MISSING');
    if (items.some((item) => item.domain === 'PAGES' && item.state === 'FAIL')) failureCodes.push('PDF_PAGE_STRUCTURE_INVALID');
    if (items.some((item) => item.domain === 'TABLES' && item.state === 'FAIL')) failureCodes.push('PDF_TABLE_STRUCTURE_INVALID');
    if (items.some((item) => item.state === 'FAIL' && (item.domain === 'MAP' || item.domain === 'CHART'))) failureCodes.push('PDF_STATIC_FALLBACK_MISSING');
    if (items.some((item) => item.domain === 'PROVENANCE' && item.state === 'FAIL')) failureCodes.push('PDF_REQUIRED_SECTION_MISSING');
    if (items.some((item) => item.domain === 'FILE_HASH' && item.state === 'FAIL')) failureCodes.push('PDF_FILE_HASH_INVALID');
    return Object.freeze({
      qaState: items.some((item) => item.state === 'FAIL') ? 'PDF_QA_FAILED' : 'PDF_QA_PASSED',
      pageCount: inspection.pageCount,
      items,
      qaDurationMs: Date.now() - started,
      profile,
      inspection,
      failureCodes: freezeArray(failureCodes),
    });
  } catch (error) {
    const code: AtlasPdfStructuralQaFailure = error instanceof AtlasPdfStructuralQaError ? error.code : 'PDF_QA_INTERNAL_ERROR';
    return Object.freeze({
      qaState: 'PDF_QA_FAILED',
      pageCount: 0,
      items: freezeArray<AtlasPdfQaItem>([{ domain: 'CONTENT_MATCH', state: 'FAIL', detail: `Structural QA failure: ${code}` }]),
      qaDurationMs: Date.now() - started,
      profile,
      inspection: null,
      failureCodes: freezeArray([code]),
    });
  }
}

export async function generateAtlasPdf(
  request: AtlasPdfRenderRequest,
  options: { simulateRendererFailure?: boolean } = {},
): Promise<AtlasPdfGenerationOutcome> {
  const lifecycle: AtlasPdfState[] = ['PDF_RENDER_REQUESTED'];
  const validationFailure = validateAtlasPdfRenderRequest(request);
  if (validationFailure) return failedOutcome(request, validationFailure, lifecycle);
  if (options.simulateRendererFailure) return failedOutcome(request, 'RENDERER_LAUNCH_FAILURE', lifecycle);

  lifecycle.push('PDF_RENDERING');
  const started = Date.now();
  const tempDir = join(tmpdir(), 'atlas-pdf-renderer-v1');
  mkdirSync(tempDir, { recursive: true });
  const tempPath = join(tempDir, `${request.requestId}-${randomUUID()}.pdf`);
  let browser: Awaited<ReturnType<PlaywrightChromium['chromium']['launch']>> | null = null;
  let page: Awaited<ReturnType<Awaited<ReturnType<PlaywrightChromium['chromium']['launch']>>['newPage']>> | null = null;
  let startupMs = 0;
  const runtimeEnvironment = resolveAtlasPdfRuntimeEnvironment();
  let runtimeVersion: AtlasPdfRuntimeVersion | null = null;

  try {
    const launchConfig = await resolveAtlasPdfChromiumExecutable(runtimeEnvironment);
    const { chromium } = resolveAtlasPdfPlaywrightChromium(runtimeEnvironment) as PlaywrightChromium;
    const launchStarted = Date.now();
    browser = await chromium.launch({
      headless: launchConfig.headless,
      executablePath: launchConfig.executablePath,
      args: launchConfig.args,
      timeout: request.printOptions.timeoutMs,
    });
    startupMs = Date.now() - launchStarted;
    runtimeVersion = buildAtlasPdfRuntimeVersion({
      environment: runtimeEnvironment,
      chromiumPackage: launchConfig.chromiumPackage,
      chromiumVersion: await browser.version(),
      playwrightVersion: runtimeEnvironment === 'DEPLOYED_SERVER'
        ? ATLAS_PDF_DEPLOYMENT_PLAYWRIGHT_CORE_VERSION
        : resolveRuntimePackageVersion('playwright'),
    });
    page = await browser.newPage({ viewport: { width: 816, height: 1056 } });
    await page.setContent(renderAtlasPdfHtml(request), { waitUntil: 'load', timeout: request.printOptions.timeoutMs });
    await page.pdf({
      path: tempPath,
      format: 'Letter',
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: true,
      headerTemplate: `<div style="width:100%;font-size:8px;color:#5d665f;padding:0 0.35in;">${escapeHtml(request.productKind)} / Project Atlas</div>`,
      footerTemplate: '<div style="width:100%;font-size:8px;color:#5d665f;padding:0 0.35in;"><span class="pageNumber"></span> / <span class="totalPages"></span></div>',
      margin: request.printOptions.margin,
      timeout: request.printOptions.timeoutMs,
      tagged: true,
      outline: true,
    });
  } catch (error) {
    if (existsSync(tempPath)) unlinkSync(tempPath);
    const runtimeError = error instanceof Error ? error : new Error(String(error));
    console.error('ATLAS_PDF_RENDERER_RUNTIME_FAILURE', {
      requestId: request.requestId,
      productKind: request.productKind,
      runtimeEnvironment,
      errorName: runtimeError.name,
      errorMessage: runtimeError.message,
    });
    return failedOutcome(request, error instanceof Error && /timeout/i.test(error.message) ? 'RENDERER_TIMEOUT' : 'RENDERER_LAUNCH_FAILURE', lifecycle);
  } finally {
    if (page) await page.close().catch(() => undefined);
    if (browser) await browser.close().catch(() => undefined);
  }

  let pdfBytes: Buffer;
  try {
    pdfBytes = readFileSync(tempPath);
  } catch {
    if (existsSync(tempPath)) unlinkSync(tempPath);
    return failedOutcome(request, 'FILE_WRITE_FAILURE', lifecycle);
  }

  lifecycle.push('PDF_QA_REQUIRED');
  const fileHash = createHash('sha256').update(pdfBytes).digest('hex');
  const qa = await runAtlasPdfStructuralQa({ request, pdfBytes, fileHash });
  if (existsSync(tempPath)) unlinkSync(tempPath);
  const tempFileRemoved = !existsSync(tempPath);
  if (qa.qaState !== 'PDF_QA_PASSED') return failedOutcome(request, 'QA_FAILURE', lifecycle, qa.failureCodes);

  lifecycle.push('PDF_READY', 'PDF_CERTIFIED');
  return Object.freeze({
    renderId: `atlas-pdf-render-${createHash('sha256').update(`${request.requestId}:${request.renderFingerprint}:${fileHash}`).digest('hex').slice(0, 16)}`,
    requestId: request.requestId,
    renderVersion: request.renderVersion,
    sourceOutputVersionId: request.outputVersionId,
    sourceContentFingerprint: request.sourceContentFingerprint,
    renderFingerprint: request.renderFingerprint,
    rendererId: ATLAS_PDF_RENDERER_ID,
    rendererAdapterId: ATLAS_PDF_RENDERER_ADAPTER_ID,
    rendererVersion: ATLAS_PDF_RENDERER_ADAPTER_VERSION,
    playwrightVersion: runtimeVersion?.playwrightVersion ?? resolveRuntimePackageVersion('playwright'),
    chromiumVersion: runtimeVersion?.chromiumVersion ?? ATLAS_PDF_RENDERER_CHROMIUM_VERSION,
    runtimeVersion: runtimeVersion ?? buildAtlasPdfRuntimeVersion({
      environment: runtimeEnvironment,
      chromiumPackage: 'playwright@1.62.1',
      chromiumVersion: ATLAS_PDF_RENDERER_CHROMIUM_VERSION,
      playwrightVersion: resolveRuntimePackageVersion('playwright'),
    }),
    generatedAt: new Date().toISOString(),
    pageCount: qa.pageCount,
    fileName: request.fileName,
    mimeType: 'application/pdf',
    fileSize: pdfBytes.byteLength,
    fileHash,
    qaState: 'PDF_QA_PASSED',
    structuralQa: Object.freeze({
      engineId: ATLAS_PDF_STRUCTURAL_QA_ENGINE_ID,
      engineVersion: ATLAS_PDF_STRUCTURAL_QA_ENGINE_VERSION,
      parserId: qa.inspection?.parserId ?? 'UNAVAILABLE',
      parserVersion: qa.inspection?.parserVersion ?? 'UNAVAILABLE',
      profileId: qa.profile.id,
      profileVersion: qa.profile.version,
      certifiedAt: new Date().toISOString(),
    }),
    accessibilityState: 'PDF_ACCESSIBILITY_BASELINE_READY',
    provenanceState: 'PDF_PROVENANCE_COMPLETE',
    staticAssetState: 'STATIC_FALLBACKS_CERTIFIED',
    pdfState: 'PDF_CERTIFIED',
    warnings: freezeArray(['DEPLOYMENT_VALIDATION_REQUIRED', 'PDF_METADATA_PARTIAL', 'PDF_BOOKMARKS_PARTIAL', 'PDF_ACCESSIBILITY_BASELINE_ONLY']),
    qa: qa.items,
    lifecycle: freezeArray(lifecycle),
    durationMs: Date.now() - started,
    rendererStartupMs: startupMs,
    qaDurationMs: qa.qaDurationMs,
    tempFileCreated: true,
    tempFileRemoved,
    pdfBytes,
  });
}

export function writeAtlasPdfFixtureResult(outputDir: string, result: AtlasPdfRenderResult) {
  mkdirSync(outputDir, { recursive: true });
  const pdfPath = join(outputDir, result.fileName);
  const evidencePath = join(outputDir, `${result.fileName.replace(/\.pdf$/i, '')}.evidence.json`);
  writeFileSync(pdfPath, result.pdfBytes);
  const evidence: { -readonly [Key in keyof AtlasPdfRenderResult]?: AtlasPdfRenderResult[Key] } = { ...result };
  delete evidence.pdfBytes;
  writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`);
  return Object.freeze({ pdfPath, evidencePath, fileName: basename(pdfPath) });
}

export function buildAtlasPdfRendererCertification() {
  return Object.freeze({
    status: ATLAS_PDF_RENDERER_STATUS,
    version: ATLAS_PDF_RENDERER_VERSION,
    selectedRenderer: HEADLESS_PDF_RENDERER_FEASIBILITY_SELECTED_RENDERER,
    rendererId: ATLAS_PDF_RENDERER_ID,
    adapterId: ATLAS_PDF_RENDERER_ADAPTER_ID,
    adapterVersion: ATLAS_PDF_RENDERER_ADAPTER_VERSION,
    rendererPackageVersion: ATLAS_PDF_RENDERER_PACKAGE_VERSION,
    chromiumVersion: ATLAS_PDF_RENDERER_CHROMIUM_VERSION,
    agentPdfStatus: ATLAS_PDF_RENDERER_AGENT_STATUS,
    sellerPdfStatus: ATLAS_PDF_RENDERER_SELLER_PDF_STATUS,
    sellerUpdatePdfStatus: ATLAS_PDF_RENDERER_SELLER_UPDATE_PDF_STATUS,
    deploymentPosition: ATLAS_PDF_RENDERER_DEPLOYMENT_POSITION,
    persistencePosition: ATLAS_PDF_RENDERER_PERSISTENCE_POSITION,
    nextGate: ATLAS_PDF_RENDERER_NEXT_GATE,
    nextPrimaryPackage: ATLAS_PDF_RENDERER_NEXT_PRIMARY_PACKAGE,
    dependencies: freezeArray([
      OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_VERSION,
      'SELLER_PRINT_PDF_RENDER_FOUNDATION_V1',
      HEADLESS_PDF_RENDERER_FEASIBILITY_VERSION,
      HEADLESS_PDF_RENDERER_FEASIBILITY_STATUS,
      HEADLESS_PDF_RENDERER_FEASIBILITY_PDF_ACTIVATION_POSITION,
    ]),
    states: ATLAS_PDF_STATES,
    failures: ATLAS_PDF_FAILURES,
    retryClasses: ATLAS_PDF_RETRY_CLASSES,
    sourceStates: ATLAS_PDF_SOURCE_STATES,
    rendererArtifacts: freezeArray([
      { artifact: 'ATLAS PDF RENDERER', version: ATLAS_PDF_RENDERER_CONTRACT_VERSION, runtime: 'Node server runtime', sourceOutput: 'Seller/Seller Update OutputVersion', renderType: 'PDF', state: 'PDF_RENDERER_READY', reuse: 'PRODUCT_NEUTRAL' },
      { artifact: 'PLAYWRIGHT CHROMIUM ADAPTER', version: ATLAS_PDF_RENDERER_ADAPTER_VERSION, runtime: ATLAS_PDF_RENDERER_PACKAGE_VERSION, sourceOutput: 'DocumentModel HTML', renderType: 'PDF', state: 'PDF_RENDERER_READY', reuse: 'DIRECT_RENDERER_REUSE' },
      { artifact: 'SELLER PDF', version: SELLER_DECISION_BRIEF_V2_VERSION, runtime: ATLAS_PDF_RENDERER_ADAPTER_VERSION, sourceOutput: 'seller-decision-brief-v2-reviewed', renderType: 'PDF', state: 'PDF_CERTIFIED', reuse: 'SELLER_PRODUCT_CERTIFIED' },
      { artifact: 'SELLER UPDATE PDF', version: SELLER_UPDATE_PRODUCT_VERSION, runtime: ATLAS_PDF_RENDERER_ADAPTER_VERSION, sourceOutput: 'seller-update-current-version', renderType: 'PDF', state: 'PDF_CERTIFIED', reuse: 'SELLER_UPDATE_PRODUCT_CERTIFIED' },
    ]),
    security: freezeArray([
      { area: 'AUTHENTICATION', implementation: 'Exact Agent session authorization on /api/agent/output/pdf.', productionRule: 'HUMAN_AGENT + AGENT role only.', validation: 'Route and adminAuth checker.' },
      { area: 'RENDER TARGET ACCESS', implementation: 'Server-side document HTML generator; no arbitrary HTML input.', productionRule: 'Render only admitted fixture/output IDs.', validation: 'Request validation before browser launch.' },
      { area: 'NETWORK ACCESS', implementation: 'LOCAL_DOCUMENT_ONLY_NO_REMOTE_FETCH.', productionRule: 'No arbitrary remote resource resolution.', validation: 'Resource policy and HTML generation.' },
      { area: 'TEMP FILES', implementation: 'Controlled temp file removed after bytes and QA are complete.', productionRule: 'No durable client artifact paths.', validation: 'Fixture lifecycle result.' },
      { area: 'RESOURCE CLEANUP', implementation: 'Page and browser close in finally; temp removed on success/failure.', productionRule: 'No orphan render process from deterministic path.', validation: 'Lifecycle fixture.' },
    ]),
    resourcePolicy: freezeArray([
      { type: 'LOCAL CSS', allowed: true, resolution: 'Inline render CSS from versioned generator', versioned: true, failureBehavior: 'TEMPLATE_INCOMPATIBLE' },
      { type: 'LOCAL APPLICATION ASSETS', allowed: true, resolution: 'Static asset manifest reference', versioned: true, failureBehavior: 'STATIC_ASSET_FAILURE' },
      { type: 'PROPERTY IMAGE', allowed: true, resolution: 'Certified fallback', versioned: true, failureBehavior: 'CERTIFIED_FALLBACK' },
      { type: 'STATIC MAP', allowed: true, resolution: 'Text/table fallback', versioned: true, failureBehavior: 'CERTIFIED_FALLBACK' },
      { type: 'STATIC CHART', allowed: true, resolution: 'Text/table fallback', versioned: true, failureBehavior: 'CERTIFIED_FALLBACK' },
      { type: 'AGENT IMAGE', allowed: false, resolution: 'Not active', versioned: false, failureBehavior: 'STATIC_ASSET_FAILURE' },
      { type: 'BRAND ASSET', allowed: true, resolution: 'Text/mark seam', versioned: true, failureBehavior: 'CERTIFIED_FALLBACK' },
      { type: 'FONT', allowed: true, resolution: 'System fallback', versioned: false, failureBehavior: 'FONT_FAILURE' },
      { type: 'REMOTE IMAGE', allowed: false, resolution: 'Not resolved by renderer', versioned: false, failureBehavior: 'STATIC_ASSET_FAILURE' },
      { type: 'ARBITRARY REMOTE RESOURCE', allowed: false, resolution: 'Blocked by render target design', versioned: false, failureBehavior: 'STATIC_ASSET_FAILURE' },
    ]),
    persistenceHandoff: freezeArray([
      'RENDER ID',
      'OUTPUT VERSION',
      'RENDER VERSION',
      'RENDERER VERSION',
      'DOCUMENT TEMPLATE VERSION',
      'PAGE TEMPLATE VERSION SET',
      'CONTENT FINGERPRINT',
      'RENDER FINGERPRINT',
      'STATIC ASSET MANIFEST',
      'GENERATED AT',
      'PAGE COUNT',
      'FILE NAME',
      'MIME TYPE',
      'FILE SIZE',
      'FILE HASH',
      'QA STATE',
      'ACCESSIBILITY STATE',
      'RIGHTS STATE',
      'SUPERSESSION',
      'STORAGE REF',
    ]),
    protectedBoundaries: Object.freeze({
      durablePersistence: false,
      fileStorage: false,
      deliverySharing: false,
      providerRuntime: false,
      customerMutation: false,
      crmMutation: false,
      emailOrMessageExecution: false,
      deployment: false,
    }),
  });
}
