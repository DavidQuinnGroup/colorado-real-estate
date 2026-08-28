import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  buildHeadlessPdfRendererFeasibility,
  HEADLESS_PDF_RENDERER_EXPECTED_TEXT_MARKERS,
  HEADLESS_PDF_RENDERER_FEASIBILITY_DEPLOYMENT_POSITION,
  HEADLESS_PDF_RENDERER_FEASIBILITY_LOCAL_PDF_STATUS,
  HEADLESS_PDF_RENDERER_FEASIBILITY_NEXT_GATE,
  HEADLESS_PDF_RENDERER_FEASIBILITY_NEXT_PRIMARY_PACKAGE,
  HEADLESS_PDF_RENDERER_FEASIBILITY_PDF_ACTIVATION_POSITION,
  HEADLESS_PDF_RENDERER_FEASIBILITY_SELECTED_RENDERER,
  HEADLESS_PDF_RENDERER_FEASIBILITY_STATUS,
  HEADLESS_PDF_RENDERER_FEASIBILITY_VERSION,
  HEADLESS_PDF_RENDERER_PROOF_EVIDENCE_PATH,
  HEADLESS_PDF_RENDERER_PROOF_PDF_PATH,
} from '../lib/headlessPdfRendererFeasibility';
import {
  SELLER_PRINT_PDF_RENDER_FOUNDATION_PDF_ACTIVATION_POSITION,
  SELLER_PRINT_PDF_RENDER_FOUNDATION_VERSION,
} from '../lib/sellerPrintPdfRenderFoundation';

const contractSource = readFileSync('lib/headlessPdfRendererFeasibility.ts', 'utf8');
const proofSource = readFileSync('scripts/runHeadlessPdfRendererFeasibilityProof.ts', 'utf8');
const reportSource = readFileSync('docs/project-atlas/executive-library/HEADLESS-PDF-RENDERER-FEASIBILITY-V1-CERTIFICATION.md', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

assert.equal(HEADLESS_PDF_RENDERER_FEASIBILITY_STATUS, 'HEADLESS_PDF_RENDERER_FEASIBILITY_V1_PASS_WITH_LIMITATIONS');
assert.equal(HEADLESS_PDF_RENDERER_FEASIBILITY_VERSION, 'HEADLESS_PDF_RENDERER_FEASIBILITY_V1');
assert.equal(HEADLESS_PDF_RENDERER_FEASIBILITY_SELECTED_RENDERER, 'PLAYWRIGHT_CHROMIUM');
assert.equal(
  HEADLESS_PDF_RENDERER_FEASIBILITY_PDF_ACTIVATION_POSITION,
  'ATLAS_PDF_RENDERER_V1_BOUNDED_AGENT_INTERNAL_ACTIVATION_RECOMMENDED_WITH_LIMITATIONS',
);
assert.equal(HEADLESS_PDF_RENDERER_FEASIBILITY_LOCAL_PDF_STATUS, 'LOCAL_PDF_GENERATED_QA_PASSED_HASH_VARIANCE_FROM_METADATA');
assert.equal(HEADLESS_PDF_RENDERER_FEASIBILITY_DEPLOYMENT_POSITION, 'SUPPORTED_WITH_ADAPTER');
assert.equal(HEADLESS_PDF_RENDERER_FEASIBILITY_NEXT_GATE, 'ATLAS_PDF_RENDERER_V1');
assert.equal(HEADLESS_PDF_RENDERER_FEASIBILITY_NEXT_PRIMARY_PACKAGE, 'ATLAS_PDF_RENDERER_V1');

const feasibility = buildHeadlessPdfRendererFeasibility();
assert.equal(feasibility.status, HEADLESS_PDF_RENDERER_FEASIBILITY_STATUS);
assert.equal(feasibility.version, HEADLESS_PDF_RENDERER_FEASIBILITY_VERSION);
assert.equal(feasibility.selectedRenderer, HEADLESS_PDF_RENDERER_FEASIBILITY_SELECTED_RENDERER);
assert.equal(feasibility.pdfActivationPosition, HEADLESS_PDF_RENDERER_FEASIBILITY_PDF_ACTIVATION_POSITION);
assert.equal(feasibility.localPdfStatus, HEADLESS_PDF_RENDERER_FEASIBILITY_LOCAL_PDF_STATUS);
assert.equal(feasibility.deploymentPosition, HEADLESS_PDF_RENDERER_FEASIBILITY_DEPLOYMENT_POSITION);
assert.equal(feasibility.nextGate, HEADLESS_PDF_RENDERER_FEASIBILITY_NEXT_GATE);
assert.equal(feasibility.nextPrimaryPackage, HEADLESS_PDF_RENDERER_FEASIBILITY_NEXT_PRIMARY_PACKAGE);
assert.equal(feasibility.priorFoundationVersion, SELLER_PRINT_PDF_RENDER_FOUNDATION_VERSION);
assert.equal(feasibility.priorPdfActivationPosition, SELLER_PRINT_PDF_RENDER_FOUNDATION_PDF_ACTIVATION_POSITION);
assert.equal(feasibility.rendererCandidates.length, 3);
assert.equal(feasibility.capabilities.length, 10);
assert.equal(feasibility.failureModes.length, 8);
assert.equal(feasibility.qa.length, 7);
assert.equal(feasibility.deploymentAdapterRequirements.length, 5);

const selected = feasibility.rendererCandidates.find((candidate) => candidate.decision === 'SELECTED');
assert(selected);
assert.equal(selected.renderer, 'PLAYWRIGHT_CHROMIUM');
assert.equal(selected.localAvailability, 'AVAILABLE_FROM_BUNDLED_RUNTIME');
assert.equal(selected.repositoryDependencyState, 'NOT_PINNED');
assert(selected.limitations.some((limitation) => limitation.includes('does not pin Playwright')));
assert(feasibility.rendererCandidates.some((candidate) => candidate.renderer === 'PUPPETEER_CHROMIUM' && candidate.decision === 'REJECTED'));
assert(feasibility.rendererCandidates.some((candidate) => candidate.renderer === 'BROWSER_PRINT_ONLY' && candidate.decision === 'FALLBACK_ONLY'));

assert.equal(feasibility.proof.output.path, HEADLESS_PDF_RENDERER_PROOF_PDF_PATH);
assert.equal(feasibility.proof.output.evidencePath, HEADLESS_PDF_RENDERER_PROOF_EVIDENCE_PATH);
assert.equal(feasibility.proof.output.mimeType, 'application/pdf');
assert.equal(feasibility.proof.output.fileSizeBytes, 172902);
assert.equal(feasibility.proof.output.pageSize, '612 x 792 pts (letter)');
assert.equal(feasibility.proof.output.pageCount, 3);
assert.equal(feasibility.proof.output.title, 'Seller Update Print Preview');
assert.equal(feasibility.proof.output.tagged, 'yes');
assert.equal(feasibility.proof.output.observedFileHashes.length, 3);
assert.notEqual(feasibility.proof.output.observedFileHashes[0], feasibility.proof.output.observedFileHashes[1]);
assert.notEqual(feasibility.proof.output.observedFileHashes[1], feasibility.proof.output.observedFileHashes[2]);
assert.equal(feasibility.proof.output.canonicalProofHash, '098b616e64eeb05fffa9dbdcddbacc883e808fc81dc7460fe325f9baf02c0d1b');
assert.equal(feasibility.proof.output.hashVarianceReason, 'CHROMIUM_PDF_EMBEDDED_GENERATION_METADATA');
assert.equal(feasibility.proof.source.documentModelId, 'seller-update-print-document-v1');
assert.equal(feasibility.proof.source.sourceOutputVersionId, 'seller-update-current-version');
assert.equal(feasibility.proof.source.renderVersion, 'SELLER_UPDATE_PRINT_RENDER_V1');
assert.equal(feasibility.proof.source.sourceContentFingerprint, 'output-content-fingerprint-31dfccd3');
assert.equal(feasibility.proof.source.renderFingerprint, 'output-render-fingerprint-e11c57dd');
assert.deepEqual(feasibility.proof.expectedTextMarkers, HEADLESS_PDF_RENDERER_EXPECTED_TEXT_MARKERS);

for (const marker of HEADLESS_PDF_RENDERER_EXPECTED_TEXT_MARKERS) {
  assert(contractSource.includes(marker), `contract missing marker ${marker}`);
  assert(reportSource.includes(marker), `report missing marker ${marker}`);
}

for (const capability of [
  'Local PDF byte generation',
  'US Letter page sizing and page breaks',
  'Text extraction and provenance markers',
  'Static map rendering',
  'Static chart rendering',
  'Fonts',
  'PDF metadata',
  'PDF bookmarks',
  'Tagged PDF and accessibility',
  'PDF/A',
]) {
  assert(feasibility.capabilities.some((item) => item.capability === capability), `missing capability ${capability}`);
}

for (const classification of [
  'RENDERER_UNAVAILABLE',
  'BROWSER_BINARY_UNAVAILABLE',
  'SANDBOX_PERMISSION',
  'TIMEOUT',
  'INVALID_INPUT',
  'TEXT_MARKER_MISSING',
  'PDF_INSPECTION_UNAVAILABLE',
  'STORAGE_OR_DELIVERY',
]) {
  assert(feasibility.failureModes.some((mode) => mode.classification === classification), `missing failure classification ${classification}`);
}

for (const qa of feasibility.qa) {
  assert(['PASS', 'PASS_WITH_LIMITATION'].includes(qa.result), `unexpected QA result ${qa.result}`);
}

for (const [boundary, value] of Object.entries(feasibility.protectedBoundaries)) {
  assert.equal(value, false, `protected boundary ${boundary} must remain false`);
}

for (const token of [
  'createRequire(import.meta.url)',
  "requireFromRuntime('playwright')",
  'buildSellerPrintPdfRenderFoundation',
  "document.id === 'seller-update-print-document-v1'",
  "item.id === 'render-seller-update-print-preview-v1'",
  "format: 'Letter'",
  'printBackground: true',
  'preferCSSPageSize: true',
  'displayHeaderFooter: true',
  'tagged: true',
  'outline: true',
  "execFileSync('pdfinfo'",
  "execFileSync('pdftotext'",
  'pdfplumber',
  "createHash('sha256')",
  'expectedTextMarkers',
  'persistence: false',
  'delivery: false',
  'providerRuntime: false',
  'customerMutation: false',
]) {
  assert(proofSource.includes(token), `proof harness missing token ${token}`);
}

for (const token of [
  HEADLESS_PDF_RENDERER_FEASIBILITY_STATUS,
  HEADLESS_PDF_RENDERER_FEASIBILITY_VERSION,
  HEADLESS_PDF_RENDERER_FEASIBILITY_SELECTED_RENDERER,
  HEADLESS_PDF_RENDERER_FEASIBILITY_PDF_ACTIVATION_POSITION,
  HEADLESS_PDF_RENDERER_FEASIBILITY_LOCAL_PDF_STATUS,
  HEADLESS_PDF_RENDERER_FEASIBILITY_DEPLOYMENT_POSITION,
  HEADLESS_PDF_RENDERER_FEASIBILITY_NEXT_GATE,
  HEADLESS_PDF_RENDERER_FEASIBILITY_NEXT_PRIMARY_PACKAGE,
  SELLER_PRINT_PDF_RENDER_FOUNDATION_PDF_ACTIVATION_POSITION,
  'PLAYWRIGHT_CHROMIUM',
  'PUPPETEER_CHROMIUM',
  'BROWSER_PRINT_ONLY',
  'SUPPORTED_WITH_ADAPTER',
  'LOCAL_PDF_GENERATED',
  'CHROMIUM_PDF_EMBEDDED_GENERATION_METADATA',
]) {
  assert(reportSource.includes(token), `certification report missing token ${token}`);
}

for (const forbidden of [
  'PrismaClient',
  'prisma.',
  'supabase.',
  'typesense.',
  'fetch(',
  'DATABASE_URL',
  'MLS_GRID_TOKEN',
  'IRES_API',
  'IRES_TOKEN',
  'sendEmail',
  'resend',
  'createServer',
  'NextResponse',
  'app/api',
  'route.ts',
]) {
  assert.equal(contractSource.includes(forbidden), false, `feasibility contract must not include runtime token ${forbidden}`);
}

assert.equal(
  packageJson.scripts?.['check:headless-pdf-renderer-feasibility'],
  'jiti scripts/checkHeadlessPdfRendererFeasibility.ts',
);
assert.equal(
  packageJson.scripts?.['run:headless-pdf-renderer-feasibility-proof'],
  'jiti scripts/runHeadlessPdfRendererFeasibilityProof.ts',
);
assert.deepEqual(buildHeadlessPdfRendererFeasibility(), feasibility, 'headless PDF feasibility fixture must be deterministic');

console.log('HEADLESS_PDF_RENDERER_FEASIBILITY_CHECK: PASS');
