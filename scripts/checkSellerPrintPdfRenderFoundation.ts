import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  atlasRenderFingerprint,
  ATLAS_OUTPUT_RENDER_STATES,
  ATLAS_OUTPUT_RENDER_TYPES,
  ATLAS_RENDER_CHANGE_CLASSIFICATIONS,
  ATLAS_RENDER_REASON_CODES,
  ATLAS_STATIC_ASSET_KINDS,
  buildSellerPrintPdfRenderFoundation,
  classifyRenderChange,
  renderVersionTransitionAllowed,
  SELLER_PRINT_PDF_RENDER_FOUNDATION_NEXT_GATE,
  SELLER_PRINT_PDF_RENDER_FOUNDATION_PDF_ACTIVATION_POSITION,
  SELLER_PRINT_PDF_RENDER_FOUNDATION_PRODUCT_STATUS,
  SELLER_PRINT_PDF_RENDER_FOUNDATION_STATUS,
  SELLER_PRINT_PDF_RENDER_FOUNDATION_VERSION,
} from '../lib/sellerPrintPdfRenderFoundation';
import {
  OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_FIXTURE,
  OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_VERSION,
} from '../lib/outputVersionLineageInvalidationFoundation';
import { SELLER_DECISION_BRIEF_V2_VERSION } from '../lib/sellerDecisionBriefV2';
import {
  SELLER_POST_LAUNCH_REVIEW_VERSION,
  SELLER_UPDATE_PRODUCT_VERSION,
} from '../lib/sellerPostLaunchCurrentContextReview';
import { SELLER_PRICING_SCENARIO_VERSION } from '../lib/sellerPricingPositioningDecisionFramework';

const contractSource = readFileSync('lib/sellerPrintPdfRenderFoundation.ts', 'utf8');
const componentSource = readFileSync('components/agent/SellerDecisionBriefCompositionPreview.tsx', 'utf8');
const cssSource = readFileSync('app/globals.css', 'utf8');
const reportSource = readFileSync('docs/project-atlas/executive-library/SELLER-PRINT-PDF-RENDER-FOUNDATION-V1-CERTIFICATION.md', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

assert.equal(SELLER_PRINT_PDF_RENDER_FOUNDATION_STATUS, 'SELLER_PRINT_PDF_RENDER_FOUNDATION_V1_CERTIFIED_WITH_HOLDS');
assert.equal(SELLER_PRINT_PDF_RENDER_FOUNDATION_VERSION, 'SELLER_PRINT_PDF_RENDER_FOUNDATION_V1');
assert.equal(SELLER_PRINT_PDF_RENDER_FOUNDATION_NEXT_GATE, 'HEADLESS_PDF_RENDERER_FEASIBILITY_V1');
assert.equal(
  SELLER_PRINT_PDF_RENDER_FOUNDATION_PRODUCT_STATUS,
  'SELLER_PRINT_PDF_RENDER_FOUNDATION_V1_CERTIFIED_PRINT_PREVIEW_RENDER_DOMAIN_PDF_DELIVERY_PERSISTENCE_HELD',
);
assert.equal(SELLER_PRINT_PDF_RENDER_FOUNDATION_PDF_ACTIVATION_POSITION, 'PRINT_PREVIEW_RENDER_DOMAIN_CERTIFIED_PDF_SPIKE_NEXT');

const foundation = buildSellerPrintPdfRenderFoundation();
assert.equal(foundation.status, SELLER_PRINT_PDF_RENDER_FOUNDATION_STATUS);
assert.equal(foundation.version, SELLER_PRINT_PDF_RENDER_FOUNDATION_VERSION);
assert.equal(foundation.nextGate, SELLER_PRINT_PDF_RENDER_FOUNDATION_NEXT_GATE);
assert.equal(foundation.productStatus, SELLER_PRINT_PDF_RENDER_FOUNDATION_PRODUCT_STATUS);
assert.equal(foundation.pdfActivationPosition, SELLER_PRINT_PDF_RENDER_FOUNDATION_PDF_ACTIVATION_POSITION);
assert.equal(foundation.route, '/agent/prepare/seller/presentation');
assert.equal(foundation.outputVersionFoundationVersion, OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_VERSION);
assert.equal(foundation.currentPhase, 'PRINT_PREVIEW_AND_RENDER_DOMAIN_FIRST');
assert.equal(foundation.documentModels.length, 2);
assert.equal(foundation.outputRenders.length, 3);
assert.equal(foundation.staticAssets.length, 7);
assert.equal(foundation.printCssRules.length, 12);
assert.equal(foundation.browserPrintAdapters.length, 2);
assert.equal(foundation.pdfRequestSeams.length, 1);
assert.equal(foundation.pdfResultSeams.length, 1);
assert.equal(foundation.renderQa.length, 8);
assert.equal(foundation.changeRules.length, 14);
assert.equal(foundation.printPreviewUi.length, 9);
assert.equal(foundation.activationTable.length, 10);
assert.equal(foundation.questionCoverage.length, 10);
assert.equal(foundation.nextGateRanking.length, 5);

for (const type of ATLAS_OUTPUT_RENDER_TYPES) assert(contractSource.includes(type), `missing render type ${type}`);
for (const state of ATLAS_OUTPUT_RENDER_STATES) assert(contractSource.includes(state), `missing render state ${state}`);
for (const classification of ATLAS_RENDER_CHANGE_CLASSIFICATIONS) {
  assert(
    foundation.changeRules.some((rule) => rule.classification === classification) || contractSource.includes(classification),
    `missing render change classification ${classification}`,
  );
}
for (const reason of ATLAS_RENDER_REASON_CODES) assert(contractSource.includes(reason), `missing render reason ${reason}`);
for (const kind of ATLAS_STATIC_ASSET_KINDS) {
  assert(foundation.staticAssets.some((asset) => asset.kind === kind), `missing static asset kind ${kind}`);
}

assert.equal(renderVersionTransitionAllowed('DRAFT_RENDER', 'RENDER_READY'), true);
assert.equal(renderVersionTransitionAllowed('RENDER_READY', 'PRINT_READY'), true);
assert.equal(renderVersionTransitionAllowed('PRINT_READY', 'RENDER_CERTIFIED'), true);
assert.equal(renderVersionTransitionAllowed('RENDER_CERTIFIED', 'SUPERSEDED_RENDER'), true);
assert.equal(renderVersionTransitionAllowed('SUPERSEDED_RENDER', 'DRAFT_RENDER'), false);

assert.equal(classifyRenderChange('typography'), 'RENDER_ONLY_CHANGE');
assert.equal(classifyRenderChange('spacing'), 'RENDER_ONLY_CHANGE');
assert.equal(classifyRenderChange('content'), 'CONTENT_REVIEW_REQUIRED');
assert.equal(classifyRenderChange('pricing'), 'CONTENT_REVIEW_REQUIRED');
assert.equal(classifyRenderChange('rights'), 'RIGHTS_REVIEW_REQUIRED');
assert.equal(classifyRenderChange('reading order'), 'ACCESSIBILITY_REVIEW_REQUIRED');

assert.equal(
  atlasRenderFingerprint('OUTPUT_RENDER_FINGERPRINT', { b: ['x', 'y'], a: 1 }),
  atlasRenderFingerprint('OUTPUT_RENDER_FINGERPRINT', { a: 1, b: ['x', 'y'] }),
  'render fingerprint must be deterministic across object key order',
);
assert.notEqual(
  atlasRenderFingerprint('OUTPUT_RENDER_FINGERPRINT', { content: 'same', layout: 'a' }),
  atlasRenderFingerprint('OUTPUT_RENDER_FINGERPRINT', { content: 'same', layout: 'b' }),
  'render-only visual revisions must change render fingerprint when render inputs change',
);

const outputFoundation = OUTPUT_VERSION_LINEAGE_AND_INVALIDATION_FOUNDATION_FIXTURE;
const sellerUpdateOutput = outputFoundation.outputVersions.find((version) => version.id === 'seller-update-current-version');
assert(sellerUpdateOutput);

const sellerUpdateDocument = foundation.documentModels.find((document) => document.id === 'seller-update-print-document-v1');
assert(sellerUpdateDocument);
assert.equal(sellerUpdateDocument.outputVersionId, sellerUpdateOutput.id);
assert.equal(sellerUpdateDocument.sourceContentFingerprint, sellerUpdateOutput.contentFingerprint);
assert.equal(sellerUpdateDocument.documentTemplateVersion, 'SELLER_UPDATE_PRINT_TEMPLATE_V1');
assert.equal(sellerUpdateDocument.pages.length, 5);
assert.equal(sellerUpdateDocument.blocks.length, 6);
assert(sellerUpdateDocument.evidenceSnapshotReferences.includes('evidence-snapshot-seller-update-current'));
assert(sellerUpdateDocument.pricingReferences.includes(SELLER_PRICING_SCENARIO_VERSION));
assert(sellerUpdateDocument.postLaunchReferences.includes(SELLER_POST_LAUNCH_REVIEW_VERSION));

const sellerUpdateRender = foundation.outputRenders.find((render) => render.id === 'render-seller-update-print-preview-v1');
assert(sellerUpdateRender);
assert.equal(sellerUpdateRender.sourceOutputVersionId, sellerUpdateOutput.id);
assert.equal(sellerUpdateRender.sourceContentFingerprint, sellerUpdateOutput.contentFingerprint);
assert.equal(sellerUpdateRender.renderType, 'PRINT_PREVIEW');
assert.equal(sellerUpdateRender.rendererId, 'BROWSER_PRINT_PREVIEW');
assert.equal(sellerUpdateRender.renderVersion, 'SELLER_UPDATE_PRINT_RENDER_V1');
assert.equal(sellerUpdateRender.printReadiness, 'PRINT_READY');
assert.equal(sellerUpdateRender.pdfReadiness, 'PDF_SPIKE_REQUIRED');
assert.equal(sellerUpdateRender.fileIdentitySeam, 'NO_FILE_BYTES_CURRENT_PHASE');
assert.equal(sellerUpdateRender.pageCount, sellerUpdateDocument.pages.length);
assert(sellerUpdateRender.renderFingerprint.startsWith('output-render-fingerprint-'));
assert(sellerUpdateRender.staticAssetReferences.length >= 3);

const sellerRender = foundation.outputRenders.find((render) => render.id === 'render-seller-decision-brief-print-preview-v1');
assert(sellerRender);
assert.equal(sellerRender.visualPresentationVersion, SELLER_DECISION_BRIEF_V2_VERSION);
assert.equal(sellerUpdateRender.visualPresentationVersion, SELLER_UPDATE_PRODUCT_VERSION);

const pdfRequest = foundation.pdfRequestSeams[0];
const pdfResult = foundation.pdfResultSeams[0];
assert.equal(pdfRequest.currentPhase, 'CONTRACT_ONLY_NOT_EXECUTED');
assert.equal(pdfRequest.requiredFutureProof, SELLER_PRINT_PDF_RENDER_FOUNDATION_NEXT_GATE);
assert.equal(pdfResult.status, 'NOT_EXECUTED_CURRENT_PHASE');
assert.equal(pdfResult.fileHash, null);
assert.equal(pdfResult.storageReference, null);
assert.equal(pdfResult.contentFingerprint, sellerUpdateRender.sourceContentFingerprint);
assert.equal(pdfResult.renderFingerprint, sellerUpdateRender.renderFingerprint);

for (const rule of foundation.renderQa) {
  if (rule.category === 'PDF_SEAM') assert.equal(rule.state, 'HELD_FOR_PDF_SPIKE');
  else assert.equal(rule.state, 'PASS', `${rule.id} should pass`);
}

for (const [boundary, value] of Object.entries(foundation.protectedBoundaries)) {
  assert.equal(value, false, `protected boundary ${boundary} must remain false`);
}

for (const token of [
  '@page',
  'size: letter',
  'margin: 0.62in',
  '[data-print-omit="true"]',
  '[data-screen-only="true"]',
  '[data-print-page="true"]',
  '[data-print-role="cover"]',
  '[data-print-section-start="true"]',
  '[data-print-break="avoid"]',
  '[data-print-only="true"]',
  '[data-print-static-asset="true"]',
  'thead',
  'display: table-header-group',
  'page-break-inside: avoid',
]) {
  assert(cssSource.includes(token), `print CSS missing token ${token}`);
}

for (const token of [
  'data-testid="seller-print-pdf-render-foundation"',
  'data-testid="seller-print-preview-product-bar"',
  'data-testid="seller-print-document-model"',
  'data-testid="seller-print-render-version-badge"',
  'data-testid="seller-print-static-asset-manifest"',
  'data-testid="seller-print-render-qa"',
  'data-testid="seller-print-browser-print-action"',
  'data-testid="seller-print-pdf-seam"',
  'data-testid="seller-print-provenance-panel"',
  'data-print-page="true"',
  'data-print-break="avoid"',
  'data-print-static-asset=',
  'window.print',
  'PrintPreviewProductBar',
  'PrintDocumentModelSummary',
  'PrintRenderVersionBadge',
  'PrintStaticAssetManifest',
  'PrintRenderQaSummary',
  'BrowserPrintAction',
  'PdfRendererSeam',
  'PrintPreviewProvenancePanel',
]) {
  assert(componentSource.includes(token), `component missing print/render token ${token}`);
}

for (const token of [
  'SELLER_PRINT_PDF_RENDER_FOUNDATION_V1_CERTIFIED_WITH_HOLDS',
  'SELLER_PRINT_PDF_RENDER_FOUNDATION_V1',
  'HEADLESS_PDF_RENDERER_FEASIBILITY_V1',
  'SELLER_PRINT_PDF_RENDER_FOUNDATION_V1_CERTIFIED_PRINT_PREVIEW_RENDER_DOMAIN_PDF_DELIVERY_PERSISTENCE_HELD',
  'PRINT_PREVIEW_RENDER_DOMAIN_CERTIFIED_PDF_SPIKE_NEXT',
  'PRINT_PREVIEW_AND_RENDER_DOMAIN_FIRST',
]) {
  assert(reportSource.includes(token), `certification report missing token ${token}`);
}

for (const forbidden of [
  'PrismaClient',
  'prisma.',
  'supabase.',
  'typesense.',
  'fetch(',
  'MLS_GRID_TOKEN',
  'DATABASE_URL',
  'sendEmail',
  'resend',
  'localStorage',
  'sessionStorage',
  'document.cookie',
  'navigator.share',
  'writeFile',
  'createWriteStream',
  'pdf-lib',
  'playwright',
  'puppeteer',
]) {
  assert.equal(contractSource.includes(forbidden), false, `render foundation must not include runtime token ${forbidden}`);
}

assert.equal(
  packageJson.scripts?.['check:seller-print-pdf-render-foundation'],
  'jiti scripts/checkSellerPrintPdfRenderFoundation.ts',
);
assert.deepEqual(buildSellerPrintPdfRenderFoundation(), foundation, 'render foundation fixture must be deterministic');

console.log('SELLER_PRINT_PDF_RENDER_FOUNDATION_CHECK: PASS');
