import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  ATLAS_PDF_FAILURES,
  ATLAS_PDF_RENDERER_ADAPTER_ID,
  ATLAS_PDF_RENDERER_ADAPTER_VERSION,
  ATLAS_PDF_RENDERER_AGENT_STATUS,
  ATLAS_PDF_RENDERER_API_ROUTE,
  ATLAS_PDF_RENDERER_CHROMIUM_VERSION,
  ATLAS_PDF_RENDERER_DEPLOYMENT_POSITION,
  ATLAS_PDF_RENDERER_ID,
  ATLAS_PDF_RENDERER_NEXT_GATE,
  ATLAS_PDF_RENDERER_NEXT_PRIMARY_PACKAGE,
  ATLAS_PDF_RENDERER_PACKAGE_VERSION,
  ATLAS_PDF_RENDERER_PERSISTENCE_POSITION,
  ATLAS_PDF_RENDERER_SELLER_PDF_STATUS,
  ATLAS_PDF_RENDERER_SELLER_UPDATE_PDF_STATUS,
  ATLAS_PDF_RENDERER_STATUS,
  ATLAS_PDF_RENDERER_VERSION,
  ATLAS_PDF_RETRY_CLASSES,
  ATLAS_PDF_SOURCE_STATES,
  ATLAS_PDF_STATES,
  atlasPdfExpectedMarkers,
  buildAtlasPdfRenderRequest,
  buildAtlasPdfRendererCertification,
  classifyAtlasPdfRetry,
  renderAtlasPdfHtml,
  resolveAtlasPdfFixture,
  runAtlasPdfStructuralQa,
  sanitizeAtlasPdfFileName,
  validateAtlasPdfRenderRequest,
} from '../lib/atlasPdfRenderer';
import {
  HEADLESS_PDF_RENDERER_FEASIBILITY_SELECTED_RENDERER,
  HEADLESS_PDF_RENDERER_FEASIBILITY_STATUS,
} from '../lib/headlessPdfRendererFeasibility';

const contract = readFileSync('lib/atlasPdfRenderer.ts', 'utf8');
const route = readFileSync('app/api/agent/output/pdf/route.ts', 'utf8');
const component = readFileSync('components/agent/SellerDecisionBriefCompositionPreview.tsx', 'utf8');
const middleware = readFileSync('middleware.ts', 'utf8');
const adminAuth = readFileSync('lib/admin/adminAuth.ts', 'utf8');
const fixtureRunner = readFileSync('scripts/runAtlasPdfRendererFixtures.ts', 'utf8');
const report = readFileSync('docs/project-atlas/executive-library/ATLAS-PDF-RENDERER-V1-CERTIFICATION.md', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as {
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
};

assert.equal(ATLAS_PDF_RENDERER_STATUS, 'ATLAS_PDF_RENDERER_V1_CERTIFIED_WITH_LIMITATIONS');
assert.equal(ATLAS_PDF_RENDERER_VERSION, 'ATLAS_PDF_RENDERER_V1');
assert.equal(ATLAS_PDF_RENDERER_ID, 'ATLAS_PDF_RENDERER');
assert.equal(ATLAS_PDF_RENDERER_ADAPTER_ID, 'PLAYWRIGHT_CHROMIUM_ADAPTER');
assert.equal(ATLAS_PDF_RENDERER_ADAPTER_VERSION, 'PLAYWRIGHT_CHROMIUM_ADAPTER_V1');
assert.equal(ATLAS_PDF_RENDERER_PACKAGE_VERSION, 'playwright@1.62.1');
assert.equal(ATLAS_PDF_RENDERER_CHROMIUM_VERSION, '151.0.7922.34');
assert.equal(ATLAS_PDF_RENDERER_AGENT_STATUS, 'AGENT_INTERNAL_PDF_GENERATION_ACTIVE_EPHEMERAL');
assert.equal(ATLAS_PDF_RENDERER_SELLER_PDF_STATUS, 'SELLER_PDF_GENERATION_CERTIFIED_AGENT_INTERNAL_EPHEMERAL');
assert.equal(ATLAS_PDF_RENDERER_SELLER_UPDATE_PDF_STATUS, 'SELLER_UPDATE_PDF_GENERATION_CERTIFIED_AGENT_INTERNAL_EPHEMERAL');
assert.equal(ATLAS_PDF_RENDERER_DEPLOYMENT_POSITION, 'DEPLOYMENT_VALIDATION_REQUIRED');
assert.equal(ATLAS_PDF_RENDERER_PERSISTENCE_POSITION, 'EPHEMERAL_RESULT_ONLY_OUTPUT_RENDER_PERSISTENCE_DEFERRED');
assert.equal(ATLAS_PDF_RENDERER_NEXT_GATE, 'ATLAS_PDF_RENDERER_DEPLOYMENT_VALIDATION_V1');
assert.equal(ATLAS_PDF_RENDERER_NEXT_PRIMARY_PACKAGE, 'ATLAS_PDF_RENDERER_DEPLOYMENT_VALIDATION_V1');
assert.equal(HEADLESS_PDF_RENDERER_FEASIBILITY_SELECTED_RENDERER, 'PLAYWRIGHT_CHROMIUM');
assert.equal(HEADLESS_PDF_RENDERER_FEASIBILITY_STATUS, 'HEADLESS_PDF_RENDERER_FEASIBILITY_V1_PASS_WITH_LIMITATIONS');

const certification = buildAtlasPdfRendererCertification();
assert.equal(certification.status, ATLAS_PDF_RENDERER_STATUS);
assert.equal(certification.version, ATLAS_PDF_RENDERER_VERSION);
assert.equal(certification.selectedRenderer, HEADLESS_PDF_RENDERER_FEASIBILITY_SELECTED_RENDERER);
assert.equal(certification.rendererArtifacts.length, 4);
assert.equal(certification.security.length, 5);
assert.equal(certification.resourcePolicy.length, 10);
assert.equal(certification.persistenceHandoff.length, 20);
assert.deepEqual(certification.states, ATLAS_PDF_STATES);
assert.deepEqual(certification.failures, ATLAS_PDF_FAILURES);
assert.deepEqual(certification.retryClasses, ATLAS_PDF_RETRY_CLASSES);
assert.deepEqual(certification.sourceStates, ATLAS_PDF_SOURCE_STATES);

for (const state of ATLAS_PDF_STATES) assert(contract.includes(state), `missing PDF state ${state}`);
for (const failure of ATLAS_PDF_FAILURES) assert(contract.includes(failure), `missing PDF failure ${failure}`);
for (const retry of ATLAS_PDF_RETRY_CLASSES) assert(contract.includes(retry), `missing retry class ${retry}`);
for (const sourceState of ATLAS_PDF_SOURCE_STATES) assert(contract.includes(sourceState), `missing source state ${sourceState}`);

const seller = resolveAtlasPdfFixture('SELLER');
const sellerUpdate = resolveAtlasPdfFixture('SELLER_UPDATE');
assert.equal(seller.documentModel.id, 'seller-decision-brief-print-document-v1');
assert.equal(seller.outputRender.id, 'render-seller-decision-brief-print-preview-v1');
assert.equal(sellerUpdate.documentModel.id, 'seller-update-print-document-v1');
assert.equal(sellerUpdate.outputRender.id, 'render-seller-update-print-preview-v1');

const sellerRequest = buildAtlasPdfRenderRequest('SELLER', { requestId: 'check-seller', requestedAt: '2026-08-28T17:00:00.000Z' });
const sellerUpdateRequest = buildAtlasPdfRenderRequest('SELLER_UPDATE', { requestId: 'check-seller-update', requestedAt: '2026-08-28T17:00:00.000Z' });
assert.equal(validateAtlasPdfRenderRequest(sellerRequest), null);
assert.equal(validateAtlasPdfRenderRequest(sellerUpdateRequest), null);
assert.equal(sellerRequest.outputVersionId, 'seller-decision-brief-v2-reviewed');
assert.equal(sellerUpdateRequest.outputVersionId, 'seller-update-current-version');
assert.equal(sellerRequest.renderType, 'PDF');
assert.equal(sellerUpdateRequest.renderType, 'PDF');
assert.equal(sellerRequest.sourceRenderType, 'PRINT_PREVIEW');
assert.equal(sellerUpdateRequest.sourceRenderType, 'PRINT_PREVIEW');
assert.equal(sellerRequest.rendererId, ATLAS_PDF_RENDERER_ID);
assert.equal(sellerUpdateRequest.rendererAdapterId, ATLAS_PDF_RENDERER_ADAPTER_ID);
assert.equal(sellerRequest.renderFingerprint, sellerRequest.expectedRenderFingerprint);
assert.equal(sellerUpdateRequest.renderFingerprint, sellerUpdateRequest.expectedRenderFingerprint);

assert.equal(validateAtlasPdfRenderRequest(buildAtlasPdfRenderRequest('SELLER_UPDATE', { expectedRenderFingerprint: 'mismatch' })), 'VERSION_MISMATCH');
assert.equal(validateAtlasPdfRenderRequest(buildAtlasPdfRenderRequest('SELLER', { rightsState: 'RIGHTS_REVIEW_REQUIRED' })), 'RIGHTS_BLOCK');
assert.equal(validateAtlasPdfRenderRequest(buildAtlasPdfRenderRequest('SELLER_UPDATE', { freshnessState: 'FRESHNESS_REVIEW_REQUIRED' })), 'FRESHNESS_BLOCK');
assert.equal(validateAtlasPdfRenderRequest(buildAtlasPdfRenderRequest('SELLER', { sourceState: 'AGENT_REVIEW_REQUIRED' })), 'SOURCE_OUTPUT_NOT_READY');
assert.equal(classifyAtlasPdfRetry('RENDERER_TIMEOUT'), 'SAFE_RETRY');
assert.equal(classifyAtlasPdfRetry('VERSION_MISMATCH'), 'INPUT_FIX_REQUIRED');
assert.equal(classifyAtlasPdfRetry('RIGHTS_BLOCK'), 'REVIEW_REQUIRED');
assert.equal(classifyAtlasPdfRetry('FONT_FAILURE'), 'RUNTIME_FIX_REQUIRED');

assert.equal(sanitizeAtlasPdfFileName(' Seller / A:B* C?.pdf '), 'Seller-A-B-C-.pdf');
assert(sellerRequest.fileName.endsWith('.pdf'));
assert(sellerUpdateRequest.fileName.endsWith('.pdf'));

for (const marker of atlasPdfExpectedMarkers('SELLER', seller.documentModel, seller.outputRender)) {
  assert(renderAtlasPdfHtml(sellerRequest).includes(marker), `seller HTML missing marker ${marker}`);
}
for (const marker of atlasPdfExpectedMarkers('SELLER_UPDATE', sellerUpdate.documentModel, sellerUpdate.outputRender)) {
  assert(renderAtlasPdfHtml(sellerUpdateRequest).includes(marker), `seller update HTML missing marker ${marker}`);
}

const malformedPath = join('/private/tmp', 'atlas-pdf-renderer-check-malformed.pdf');
const malformedBytes = Buffer.from('%PDF-1.4\n% malformed atlas check\n', 'utf8');
writeFileSync(malformedPath, malformedBytes);
const qaFailure = runAtlasPdfStructuralQa({
  request: buildAtlasPdfRenderRequest('SELLER_UPDATE', { expectedTextMarkers: ['definitely absent marker'] }),
  pdfPath: malformedPath,
  pdfBytes: malformedBytes,
  fileHash: createHash('sha256').update(malformedBytes).digest('hex'),
});
assert.equal(qaFailure.qaState, 'PDF_QA_FAILED');
assert(qaFailure.items.some((item) => item.domain === 'CONTENT_MATCH' && item.state === 'FAIL'));

for (const token of [
  "requireFromRuntime('playwright')",
  'chromium.launch',
  'page.setContent',
  'page.pdf',
  'printBackground: true',
  'preferCSSPageSize: true',
  'tagged: true',
  'outline: true',
  "createHash('sha256')",
  'runAtlasPdfStructuralQa',
  'validateAtlasPdfRenderRequest',
  'unlinkSync(tempPath)',
  'browser.close',
  'page.close',
  'LOCAL_DOCUMENT_ONLY_NO_REMOTE_FETCH',
  'CONTROLLED_TEMP_FILE_CLEANED_ON_SUCCESS_AND_FAILURE',
]) {
  assert(contract.includes(token), `renderer contract missing token ${token}`);
}

for (const token of [
  "export const runtime = 'nodejs'",
  'authorizeAdminRequest',
  'ATLAS_PDF_RENDERER_API_ROUTE',
  "method: 'POST'",
  "identityType !== 'HUMAN_AGENT'",
  "role !== 'AGENT'",
  'Content-Disposition',
  'X-Atlas-Pdf-File-Hash',
  'X-Atlas-Pdf-Page-Count',
  'new Uint8Array(result.pdfBytes)',
]) {
  assert(route.includes(token), `route missing token ${token}`);
}

for (const token of [
  'pathname === "/api/agent/output/pdf"',
  '"/api/agent/output/pdf"',
  'isAgentProtectedApiRoute',
]) {
  assert(middleware.includes(token), `middleware missing token ${token}`);
}
assert.doesNotMatch(middleware, /\/agent\/:path\*/, 'middleware must not broaden Agent route access with a wildcard');
assert(adminAuth.includes("surface('/api/agent/output/pdf'"), 'auth surface registry must include exact PDF route');

for (const token of [
  'data-testid="atlas-pdf-renderer-v1"',
  'data-testid="atlas-pdf-generation-action"',
  'data-testid="atlas-pdf-generate-button"',
  'data-testid="atlas-pdf-status-panel"',
  'data-testid="atlas-pdf-result-actions"',
  'data-testid="atlas-pdf-qa-provenance"',
  "fetch('/api/agent/output/pdf'",
  'GENERATE_PDF',
  'REGENERATE_PDF',
  'PDF_RENDER_REQUESTED',
  'PDF_RENDERING',
  'PDF_CERTIFIED',
  'PDF_RENDER_FAILED',
  'URL.createObjectURL',
  'download={matchingResult.fileName}',
  'data-pdf-generation="true"',
  'data-share-delivery="false"',
]) {
  assert(component.includes(token), `component missing PDF UI token ${token}`);
}

for (const token of [
  'version-mismatch',
  'rights-hold',
  'freshness-hold',
  'renderer-failure',
  'qa-failure',
  'hashesDistinctFromRenderFingerprint',
  'tempFileRemoved',
  'SELLER',
  'SELLER_UPDATE',
]) {
  assert(fixtureRunner.includes(token), `fixture runner missing token ${token}`);
}

for (const token of [
  ATLAS_PDF_RENDERER_STATUS,
  ATLAS_PDF_RENDERER_AGENT_STATUS,
  ATLAS_PDF_RENDERER_SELLER_PDF_STATUS,
  ATLAS_PDF_RENDERER_SELLER_UPDATE_PDF_STATUS,
  ATLAS_PDF_RENDERER_DEPLOYMENT_POSITION,
  ATLAS_PDF_RENDERER_PERSISTENCE_POSITION,
  ATLAS_PDF_RENDERER_NEXT_GATE,
  ATLAS_PDF_RENDERER_NEXT_PRIMARY_PACKAGE,
  'PDF_RENDERER_READY',
  'PDF_RENDER_REQUESTED',
  'PDF_RENDERING',
  'PDF_QA_REQUIRED',
  'PDF_READY',
  'PDF_CERTIFIED',
  'PDF_RENDER_FAILED',
  'PDF_INVALIDATED',
  'PDF_SUPERSEDED',
  'SOURCE_OUTPUT_NOT_READY',
  'VERSION_MISMATCH',
  'RIGHTS_BLOCK',
  'FRESHNESS_BLOCK',
  'QA_FAILURE',
  'DEPLOYMENT_VALIDATION_REQUIRED',
  'OUTPUT_PERSISTENCE_FOUNDATION_V1',
  'SELLER_FINANCIAL_ESTIMATED_SCENARIO_POLICY_V1',
]) {
  assert(report.includes(token), `certification report missing token ${token}`);
}

assert.equal(packageJson.dependencies?.playwright, '1.62.1');
assert.equal(packageJson.scripts?.['check:atlas-pdf-renderer'], 'jiti scripts/checkAtlasPdfRenderer.ts');
assert.equal(packageJson.scripts?.['run:atlas-pdf-renderer-fixtures'], 'jiti scripts/runAtlasPdfRendererFixtures.ts');
assert.deepEqual(buildAtlasPdfRendererCertification(), certification, 'PDF renderer certification fixture must be deterministic');

console.log('ATLAS_PDF_RENDERER_CHECK: PASS');
