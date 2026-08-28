import {
  SELLER_PRINT_PDF_RENDER_FOUNDATION_PDF_ACTIVATION_POSITION,
  SELLER_PRINT_PDF_RENDER_FOUNDATION_VERSION,
} from './sellerPrintPdfRenderFoundation';

export const HEADLESS_PDF_RENDERER_FEASIBILITY_STATUS =
  'HEADLESS_PDF_RENDERER_FEASIBILITY_V1_PASS_WITH_LIMITATIONS' as const;
export const HEADLESS_PDF_RENDERER_FEASIBILITY_VERSION =
  'HEADLESS_PDF_RENDERER_FEASIBILITY_V1' as const;
export const HEADLESS_PDF_RENDERER_FEASIBILITY_SELECTED_RENDERER =
  'PLAYWRIGHT_CHROMIUM' as const;
export const HEADLESS_PDF_RENDERER_FEASIBILITY_PDF_ACTIVATION_POSITION =
  'ATLAS_PDF_RENDERER_V1_BOUNDED_AGENT_INTERNAL_ACTIVATION_RECOMMENDED_WITH_LIMITATIONS' as const;
export const HEADLESS_PDF_RENDERER_FEASIBILITY_LOCAL_PDF_STATUS =
  'LOCAL_PDF_GENERATED_QA_PASSED_HASH_VARIANCE_FROM_METADATA' as const;
export const HEADLESS_PDF_RENDERER_FEASIBILITY_DEPLOYMENT_POSITION =
  'SUPPORTED_WITH_ADAPTER' as const;
export const HEADLESS_PDF_RENDERER_FEASIBILITY_NEXT_GATE =
  'ATLAS_PDF_RENDERER_V1' as const;
export const HEADLESS_PDF_RENDERER_FEASIBILITY_NEXT_PRIMARY_PACKAGE =
  'ATLAS_PDF_RENDERER_V1' as const;

export const HEADLESS_PDF_RENDERER_PROOF_PDF_PATH =
  '/private/tmp/atlas-headless-pdf-feasibility/Seller-Decision-Brief-subject-seller-decision-brief-subject-property-SELLER_UPDATE-2026-08-27-SELLER_UPDATE_PRINT_RENDER_V1.pdf' as const;
export const HEADLESS_PDF_RENDERER_PROOF_EVIDENCE_PATH =
  '/private/tmp/atlas-headless-pdf-feasibility/Seller-Decision-Brief-subject-seller-decision-brief-subject-property-SELLER_UPDATE-2026-08-27-SELLER_UPDATE_PRINT_RENDER_V1.evidence.json' as const;

export const HEADLESS_PDF_RENDERER_EXPECTED_TEXT_MARKERS = [
  'Seller Update Print Preview',
  'Seller Decision Brief subject seller-decision-brief-subject-property',
  'seller-update-current-version',
  'SELLER_UPDATE_PRINT_RENDER_V1',
  'output-content-fingerprint-31dfccd3',
  'output-render-fingerprint-e11c57dd',
  'Static Map Fallback',
  'Static Chart Fallback',
  'Evidence and Provenance',
] as const;

export type AtlasHeadlessPdfRendererCandidate = Readonly<{
  renderer: 'PLAYWRIGHT_CHROMIUM' | 'PUPPETEER_CHROMIUM' | 'BROWSER_PRINT_ONLY';
  decision: 'SELECTED' | 'REJECTED' | 'FALLBACK_ONLY';
  localAvailability: 'AVAILABLE_FROM_BUNDLED_RUNTIME' | 'NOT_AVAILABLE_IN_REPOSITORY' | 'BUILT_IN_BROWSER_ACTION';
  repositoryDependencyState: 'NOT_PINNED' | 'NOT_PRESENT' | 'NOT_REQUIRED';
  reason: string;
  limitations: readonly string[];
}>;

export type AtlasHeadlessPdfProof = Readonly<{
  status: 'LOCAL_PDF_GENERATED';
  renderer: typeof HEADLESS_PDF_RENDERER_FEASIBILITY_SELECTED_RENDERER;
  runtime: Readonly<{
    nodeVersion: 'v24.14.0';
    platform: 'darwin-x64';
    playwrightVersion: '1.62.1';
    browserVersion: '151.0.7922.34';
    executablePath: string;
    sandboxLaunch: 'REQUIRES_DESKTOP_PERMISSION_ESCALATION_IN_CURRENT_CODEX_SANDBOX';
  }>;
  output: Readonly<{
    path: typeof HEADLESS_PDF_RENDERER_PROOF_PDF_PATH;
    evidencePath: typeof HEADLESS_PDF_RENDERER_PROOF_EVIDENCE_PATH;
    mimeType: 'application/pdf';
    fileSizeBytes: 172902;
    observedFileHashes: readonly [
      '38c479331b614a11ce01f0e77f85178fab51ce0fc014bb7f26f30391b6156a7c',
      'd905eec7b6a2784d4b8dcafda441b1295bbbd441a868f254194e4e102ca3d2fb',
      '098b616e64eeb05fffa9dbdcddbacc883e808fc81dc7460fe325f9baf02c0d1b',
    ];
    canonicalProofHash: '098b616e64eeb05fffa9dbdcddbacc883e808fc81dc7460fe325f9baf02c0d1b';
    hashVarianceReason: 'CHROMIUM_PDF_EMBEDDED_GENERATION_METADATA';
    pdfVersion: '1.4';
    pageSize: '612 x 792 pts (letter)';
    pageCount: 3;
    title: 'Seller Update Print Preview';
    tagged: 'yes';
  }>;
  source: Readonly<{
    documentModelId: 'seller-update-print-document-v1';
    sourceOutputVersionId: 'seller-update-current-version';
    renderVersion: 'SELLER_UPDATE_PRINT_RENDER_V1';
    sourceContentFingerprint: 'output-content-fingerprint-31dfccd3';
    renderFingerprint: 'output-render-fingerprint-e11c57dd';
  }>;
  expectedTextMarkers: typeof HEADLESS_PDF_RENDERER_EXPECTED_TEXT_MARKERS;
  constraints: Readonly<{
    persistence: false;
    delivery: false;
    providerRuntime: false;
    customerMutation: false;
  }>;
}>;

export type AtlasHeadlessPdfCapability = Readonly<{
  capability: string;
  status:
    | 'READY_LOCALLY'
    | 'PASS_WITH_LIMITATIONS'
    | 'SUPPORTED_WITH_TEXT_FALLBACK'
    | 'PARTIAL_REQUIRES_NEXT_GATE'
    | 'DEFERRED';
  evidence: string;
  nextGateRequirement: string;
}>;

export type AtlasHeadlessPdfFailureMode = Readonly<{
  failure: string;
  classification:
    | 'RENDERER_UNAVAILABLE'
    | 'BROWSER_BINARY_UNAVAILABLE'
    | 'SANDBOX_PERMISSION'
    | 'TIMEOUT'
    | 'INVALID_INPUT'
    | 'TEXT_MARKER_MISSING'
    | 'PDF_INSPECTION_UNAVAILABLE'
    | 'STORAGE_OR_DELIVERY';
  deterministicDisposition: 'FAIL_FAST' | 'RETRY_THEN_FAIL' | 'FALLBACK_BROWSER_PRINT' | 'DEFER_TO_NEXT_GATE';
}>;

export type AtlasHeadlessPdfRendererFeasibility = Readonly<{
  status: typeof HEADLESS_PDF_RENDERER_FEASIBILITY_STATUS;
  version: typeof HEADLESS_PDF_RENDERER_FEASIBILITY_VERSION;
  selectedRenderer: typeof HEADLESS_PDF_RENDERER_FEASIBILITY_SELECTED_RENDERER;
  pdfActivationPosition: typeof HEADLESS_PDF_RENDERER_FEASIBILITY_PDF_ACTIVATION_POSITION;
  localPdfStatus: typeof HEADLESS_PDF_RENDERER_FEASIBILITY_LOCAL_PDF_STATUS;
  deploymentPosition: typeof HEADLESS_PDF_RENDERER_FEASIBILITY_DEPLOYMENT_POSITION;
  nextGate: typeof HEADLESS_PDF_RENDERER_FEASIBILITY_NEXT_GATE;
  nextPrimaryPackage: typeof HEADLESS_PDF_RENDERER_FEASIBILITY_NEXT_PRIMARY_PACKAGE;
  priorFoundationVersion: typeof SELLER_PRINT_PDF_RENDER_FOUNDATION_VERSION;
  priorPdfActivationPosition: typeof SELLER_PRINT_PDF_RENDER_FOUNDATION_PDF_ACTIVATION_POSITION;
  rendererCandidates: readonly AtlasHeadlessPdfRendererCandidate[];
  proof: AtlasHeadlessPdfProof;
  capabilities: readonly AtlasHeadlessPdfCapability[];
  failureModes: readonly AtlasHeadlessPdfFailureMode[];
  retryPolicy: Readonly<{
    currentProof: 'NO_RETRY_REQUIRED_AFTER_SUCCESS';
    activationRecommendation: 'ONE_RETRY_FOR_BROWSER_LAUNCH_OR_TIMEOUT_ONLY';
    nonRetryable: readonly string[];
  }>;
  deploymentAdapterRequirements: readonly string[];
  qa: readonly Readonly<{ check: string; result: 'PASS' | 'PASS_WITH_LIMITATION'; evidence: string }>[];
  protectedBoundaries: Readonly<{
    productionRoute: false;
    apiRoute: false;
    databaseMutation: false;
    schemaMigration: false;
    persistence: false;
    fileStorage: false;
    providerRuntime: false;
    customerMutation: false;
    crmMutation: false;
    emailOrMessageExecution: false;
    deliveryOrSharing: false;
    deployment: false;
  }>;
}>;

function freezeArray<T>(items: readonly T[]) {
  return Object.freeze([...items]);
}

export function buildHeadlessPdfRendererFeasibility(): AtlasHeadlessPdfRendererFeasibility {
  return Object.freeze({
    status: HEADLESS_PDF_RENDERER_FEASIBILITY_STATUS,
    version: HEADLESS_PDF_RENDERER_FEASIBILITY_VERSION,
    selectedRenderer: HEADLESS_PDF_RENDERER_FEASIBILITY_SELECTED_RENDERER,
    pdfActivationPosition: HEADLESS_PDF_RENDERER_FEASIBILITY_PDF_ACTIVATION_POSITION,
    localPdfStatus: HEADLESS_PDF_RENDERER_FEASIBILITY_LOCAL_PDF_STATUS,
    deploymentPosition: HEADLESS_PDF_RENDERER_FEASIBILITY_DEPLOYMENT_POSITION,
    nextGate: HEADLESS_PDF_RENDERER_FEASIBILITY_NEXT_GATE,
    nextPrimaryPackage: HEADLESS_PDF_RENDERER_FEASIBILITY_NEXT_PRIMARY_PACKAGE,
    priorFoundationVersion: SELLER_PRINT_PDF_RENDER_FOUNDATION_VERSION,
    priorPdfActivationPosition: SELLER_PRINT_PDF_RENDER_FOUNDATION_PDF_ACTIVATION_POSITION,
    rendererCandidates: freezeArray<AtlasHeadlessPdfRendererCandidate>([
      {
        renderer: 'PLAYWRIGHT_CHROMIUM',
        decision: 'SELECTED',
        localAvailability: 'AVAILABLE_FROM_BUNDLED_RUNTIME',
        repositoryDependencyState: 'NOT_PINNED',
        reason: 'Generated an inspectable local Letter PDF from the admitted Seller Update print model using Chromium page.pdf.',
        limitations: freezeArray([
          'The repository does not pin Playwright or a browser binary yet.',
          'The current Codex desktop sandbox required permission escalation to launch Chromium.',
          'Chromium PDF bytes include generation metadata, so byte hash was not stable across repeated local renders.',
        ]),
      },
      {
        renderer: 'PUPPETEER_CHROMIUM',
        decision: 'REJECTED',
        localAvailability: 'NOT_AVAILABLE_IN_REPOSITORY',
        repositoryDependencyState: 'NOT_PRESENT',
        reason: 'No Puppeteer dependency or bundled Puppeteer runtime was found during the feasibility inventory.',
        limitations: freezeArray(['Would require an additional dependency decision without improving this proof path.']),
      },
      {
        renderer: 'BROWSER_PRINT_ONLY',
        decision: 'FALLBACK_ONLY',
        localAvailability: 'BUILT_IN_BROWSER_ACTION',
        repositoryDependencyState: 'NOT_REQUIRED',
        reason: 'Existing print preview remains viable if server-side/headless PDF activation is deferred.',
        limitations: freezeArray(['Does not produce deterministic local file bytes or durable PDF metadata in application code.']),
      },
    ]),
    proof: Object.freeze({
      status: 'LOCAL_PDF_GENERATED',
      renderer: HEADLESS_PDF_RENDERER_FEASIBILITY_SELECTED_RENDERER,
      runtime: Object.freeze({
        nodeVersion: 'v24.14.0',
        platform: 'darwin-x64',
        playwrightVersion: '1.62.1',
        browserVersion: '151.0.7922.34',
        executablePath: '/Users/davidquinn/Library/Caches/ms-playwright/chromium-1234/chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
        sandboxLaunch: 'REQUIRES_DESKTOP_PERMISSION_ESCALATION_IN_CURRENT_CODEX_SANDBOX',
      }),
      output: Object.freeze({
        path: HEADLESS_PDF_RENDERER_PROOF_PDF_PATH,
        evidencePath: HEADLESS_PDF_RENDERER_PROOF_EVIDENCE_PATH,
        mimeType: 'application/pdf',
        fileSizeBytes: 172902,
        observedFileHashes: freezeArray([
          '38c479331b614a11ce01f0e77f85178fab51ce0fc014bb7f26f30391b6156a7c',
          'd905eec7b6a2784d4b8dcafda441b1295bbbd441a868f254194e4e102ca3d2fb',
          '098b616e64eeb05fffa9dbdcddbacc883e808fc81dc7460fe325f9baf02c0d1b',
        ]) as AtlasHeadlessPdfProof['output']['observedFileHashes'],
        canonicalProofHash: '098b616e64eeb05fffa9dbdcddbacc883e808fc81dc7460fe325f9baf02c0d1b',
        hashVarianceReason: 'CHROMIUM_PDF_EMBEDDED_GENERATION_METADATA',
        pdfVersion: '1.4',
        pageSize: '612 x 792 pts (letter)',
        pageCount: 3,
        title: 'Seller Update Print Preview',
        tagged: 'yes',
      }),
      source: Object.freeze({
        documentModelId: 'seller-update-print-document-v1',
        sourceOutputVersionId: 'seller-update-current-version',
        renderVersion: 'SELLER_UPDATE_PRINT_RENDER_V1',
        sourceContentFingerprint: 'output-content-fingerprint-31dfccd3',
        renderFingerprint: 'output-render-fingerprint-e11c57dd',
      }),
      expectedTextMarkers: HEADLESS_PDF_RENDERER_EXPECTED_TEXT_MARKERS,
      constraints: Object.freeze({
        persistence: false,
        delivery: false,
        providerRuntime: false,
        customerMutation: false,
      }),
    }),
    capabilities: freezeArray<AtlasHeadlessPdfCapability>([
      {
        capability: 'Local PDF byte generation',
        status: 'READY_LOCALLY',
        evidence: 'Playwright Chromium generated a local application/pdf file with 3 Letter pages.',
        nextGateRequirement: 'Pin/package renderer adapter and binary policy.',
      },
      {
        capability: 'US Letter page sizing and page breaks',
        status: 'READY_LOCALLY',
        evidence: 'pdfinfo reported 612 x 792 pts (letter), 3 pages, and visual page review passed.',
        nextGateRequirement: 'Promote CSS/page template constraints into ATLAS_PDF_RENDERER_V1 adapter tests.',
      },
      {
        capability: 'Text extraction and provenance markers',
        status: 'READY_LOCALLY',
        evidence: 'All expected title, subject, output version, render version, fingerprint, fallback, and provenance markers extracted.',
        nextGateRequirement: 'Require marker assertions for all activated output products.',
      },
      {
        capability: 'Static map rendering',
        status: 'SUPPORTED_WITH_TEXT_FALLBACK',
        evidence: 'Static Map Fallback rendered as provider-free text/table fallback; no map tile fetch occurred.',
        nextGateRequirement: 'Decide whether ATLAS_PDF_RENDERER_V1 needs raster map assets or continues text fallback.',
      },
      {
        capability: 'Static chart rendering',
        status: 'SUPPORTED_WITH_TEXT_FALLBACK',
        evidence: 'Static Chart Fallback rendered as print-safe metric/table equivalent.',
        nextGateRequirement: 'Add chart rasterization only after source/data/version and accessibility rules are admitted.',
      },
      {
        capability: 'Fonts',
        status: 'PASS_WITH_LIMITATIONS',
        evidence: 'Arial/Helvetica fallback rendered locally without clipping.',
        nextGateRequirement: 'Admit brand font embedding or system-font policy before customer-facing PDF delivery.',
      },
      {
        capability: 'PDF metadata',
        status: 'PARTIAL_REQUIRES_NEXT_GATE',
        evidence: 'Chromium set Title; author, subject, custom metadata, and deterministic byte metadata need adapter/post-process.',
        nextGateRequirement: 'Define metadata adapter or post-processing step.',
      },
      {
        capability: 'PDF bookmarks',
        status: 'PARTIAL_REQUIRES_NEXT_GATE',
        evidence: 'outline:true was accepted by page.pdf, but bookmark structure was not independently validated.',
        nextGateRequirement: 'Add bookmark inspection and section-outline assertions.',
      },
      {
        capability: 'Tagged PDF and accessibility',
        status: 'PARTIAL_REQUIRES_NEXT_GATE',
        evidence: 'pdfinfo reported Tagged yes, with readable text markers and clean visual structure.',
        nextGateRequirement: 'Add dedicated tag tree, reading order, alt text, and contrast validation.',
      },
      {
        capability: 'PDF/A',
        status: 'DEFERRED',
        evidence: 'PDF/A conformance was not requested or validated in this feasibility gate.',
        nextGateRequirement: 'Only add if durable archive/compliance requirements authorize it.',
      },
    ]),
    failureModes: freezeArray<AtlasHeadlessPdfFailureMode>([
      { failure: 'Playwright package missing', classification: 'RENDERER_UNAVAILABLE', deterministicDisposition: 'FAIL_FAST' },
      { failure: 'Chromium executable missing', classification: 'BROWSER_BINARY_UNAVAILABLE', deterministicDisposition: 'FAIL_FAST' },
      { failure: 'Chromium launch denied by desktop sandbox', classification: 'SANDBOX_PERMISSION', deterministicDisposition: 'FALLBACK_BROWSER_PRINT' },
      { failure: 'PDF render timeout', classification: 'TIMEOUT', deterministicDisposition: 'RETRY_THEN_FAIL' },
      { failure: 'Document model or render version not admitted', classification: 'INVALID_INPUT', deterministicDisposition: 'FAIL_FAST' },
      { failure: 'Required extracted marker missing', classification: 'TEXT_MARKER_MISSING', deterministicDisposition: 'FAIL_FAST' },
      { failure: 'pdfinfo and text extraction unavailable', classification: 'PDF_INSPECTION_UNAVAILABLE', deterministicDisposition: 'DEFER_TO_NEXT_GATE' },
      { failure: 'Storage, delivery, or share target requested', classification: 'STORAGE_OR_DELIVERY', deterministicDisposition: 'DEFER_TO_NEXT_GATE' },
    ]),
    retryPolicy: Object.freeze({
      currentProof: 'NO_RETRY_REQUIRED_AFTER_SUCCESS',
      activationRecommendation: 'ONE_RETRY_FOR_BROWSER_LAUNCH_OR_TIMEOUT_ONLY',
      nonRetryable: freezeArray(['INVALID_INPUT', 'TEXT_MARKER_MISSING', 'STORAGE_OR_DELIVERY']),
    }),
    deploymentAdapterRequirements: freezeArray([
      'Choose repository-pinned Playwright/Chromium dependency strategy before production activation.',
      'Provide a server-side adapter that runs only inside an authorized Agent-internal PDF endpoint or worker.',
      'Keep persistence, storage, sharing, and customer delivery behind separate authorization gates.',
      'Add deterministic PDF QA that validates page count, Letter size, expected text, metadata, and accessibility scope.',
      'Document the browser binary/runtime policy for Vercel or any alternate execution environment.',
    ]),
    qa: freezeArray<AtlasHeadlessPdfRendererFeasibility['qa'][number]>([
      { check: 'Renderer availability', result: 'PASS_WITH_LIMITATION', evidence: 'Bundled Playwright 1.62.1 and Chromium 151.0.7922.34 worked locally; repository dependency is not pinned.' },
      { check: 'PDF generation', result: 'PASS', evidence: 'Local PDF generated with MIME application/pdf and file size 172902 bytes.' },
      { check: 'Page contract', result: 'PASS', evidence: 'pdfinfo reported PDF 1.4, Letter page size, 3 pages, and Tagged yes.' },
      { check: 'Text/provenance markers', result: 'PASS', evidence: 'All expected text markers were extracted from the generated file.' },
      { check: 'Visual review', result: 'PASS', evidence: 'Rendered page images showed clean cover, page map, fallback, recommendation, and provenance pages.' },
      { check: 'Determinism', result: 'PASS_WITH_LIMITATION', evidence: 'Render fingerprint, page count, page size, and file size stayed stable; file hash varied due Chromium PDF metadata.' },
      { check: 'Protected boundaries', result: 'PASS', evidence: 'Proof harness did not persist, deliver, call providers, mutate customer data, or change production runtime.' },
    ]),
    protectedBoundaries: Object.freeze({
      productionRoute: false,
      apiRoute: false,
      databaseMutation: false,
      schemaMigration: false,
      persistence: false,
      fileStorage: false,
      providerRuntime: false,
      customerMutation: false,
      crmMutation: false,
      emailOrMessageExecution: false,
      deliveryOrSharing: false,
      deployment: false,
    }),
  });
}
