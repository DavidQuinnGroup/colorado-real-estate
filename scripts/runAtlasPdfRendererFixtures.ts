import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  type AtlasPdfFailureResult,
  type AtlasPdfRenderResult,
  buildAtlasPdfRenderRequest,
  generateAtlasPdf,
  runAtlasPdfStructuralQa,
  writeAtlasPdfFixtureResult,
} from '../lib/atlasPdfRenderer';

const outputDir = process.env.ATLAS_PDF_RENDERER_OUTPUT_DIR ?? '/private/tmp/atlas-pdf-renderer-v1';
mkdirSync(outputDir, { recursive: true });

function isSuccess(result: Awaited<ReturnType<typeof generateAtlasPdf>>): result is AtlasPdfRenderResult {
  return result.pdfState === 'PDF_CERTIFIED';
}

function isFailure(result: Awaited<ReturnType<typeof generateAtlasPdf>>): result is AtlasPdfFailureResult {
  return result.pdfState === 'PDF_RENDER_FAILED';
}

async function renderFixture(productKind: 'SELLER' | 'SELLER_UPDATE') {
  const request = buildAtlasPdfRenderRequest(productKind, {
    requestId: `atlas-pdf-renderer-v1-${productKind.toLowerCase()}-fixture`,
    requestedAt: '2026-08-28T17:00:00.000Z',
  });
  const result = await generateAtlasPdf(request);
  if (!isSuccess(result)) throw new Error(`${productKind} PDF fixture failed: ${result.failure}`);
  const file = writeAtlasPdfFixtureResult(outputDir, result);
  return {
    productKind,
    request: { ...request, printOptions: request.printOptions },
    result: {
      renderId: result.renderId,
      requestId: result.requestId,
      renderVersion: result.renderVersion,
      sourceOutputVersionId: result.sourceOutputVersionId,
      sourceContentFingerprint: result.sourceContentFingerprint,
      renderFingerprint: result.renderFingerprint,
      rendererId: result.rendererId,
      rendererAdapterId: result.rendererAdapterId,
      rendererVersion: result.rendererVersion,
      playwrightVersion: result.playwrightVersion,
      chromiumVersion: result.chromiumVersion,
      generatedAt: result.generatedAt,
      pageCount: result.pageCount,
      fileName: result.fileName,
      mimeType: result.mimeType,
      fileSize: result.fileSize,
      fileHash: result.fileHash,
      qaState: result.qaState,
      structuralQa: result.structuralQa,
      accessibilityState: result.accessibilityState,
      provenanceState: result.provenanceState,
      staticAssetState: result.staticAssetState,
      pdfState: result.pdfState,
      warnings: result.warnings,
      lifecycle: result.lifecycle,
      durationMs: result.durationMs,
      rendererStartupMs: result.rendererStartupMs,
      qaDurationMs: result.qaDurationMs,
      tempFileCreated: result.tempFileCreated,
      tempFileRemoved: result.tempFileRemoved,
    },
    file,
  };
}

async function negativeFixtures(referencePdfBytes: Buffer) {
  const versionMismatch = await generateAtlasPdf(buildAtlasPdfRenderRequest('SELLER_UPDATE', {
    requestId: 'atlas-pdf-renderer-v1-version-mismatch',
    expectedRenderFingerprint: 'output-render-fingerprint-mismatch',
  }));
  const rightsHold = await generateAtlasPdf(buildAtlasPdfRenderRequest('SELLER', {
    requestId: 'atlas-pdf-renderer-v1-rights-hold',
    rightsState: 'RIGHTS_REVIEW_REQUIRED',
  }));
  const freshnessHold = await generateAtlasPdf(buildAtlasPdfRenderRequest('SELLER_UPDATE', {
    requestId: 'atlas-pdf-renderer-v1-freshness-hold',
    freshnessState: 'FRESHNESS_REVIEW_REQUIRED',
  }));
  const rendererFailure = await generateAtlasPdf(buildAtlasPdfRenderRequest('SELLER', {
    requestId: 'atlas-pdf-renderer-v1-renderer-failure',
  }), { simulateRendererFailure: true });

  for (const result of [versionMismatch, rightsHold, freshnessHold, rendererFailure]) {
    if (!isFailure(result)) throw new Error(`Expected negative fixture to fail closed: ${result.requestId}`);
  }

  const qaFailureRequest = buildAtlasPdfRenderRequest('SELLER_UPDATE', {
    requestId: 'atlas-pdf-renderer-v1-qa-failure',
    expectedTextMarkers: ['marker-that-is-intentionally-absent'],
  });
  const fakePdf = Buffer.from('not a PDF', 'utf8');
  const qaFailure = await runAtlasPdfStructuralQa({
    request: qaFailureRequest,
    pdfBytes: fakePdf,
    fileHash: createHash('sha256').update(fakePdf).digest('hex'),
  });
  const missingMarker = await runAtlasPdfStructuralQa({
    request: buildAtlasPdfRenderRequest('SELLER', { expectedTextMarkers: ['marker-that-is-intentionally-absent'] }),
    pdfBytes: referencePdfBytes,
    fileHash: createHash('sha256').update(referencePdfBytes).digest('hex'),
  });
  const wrongProfile = await runAtlasPdfStructuralQa({
    request: buildAtlasPdfRenderRequest('SELLER_UPDATE'),
    pdfBytes: referencePdfBytes,
    fileHash: createHash('sha256').update(referencePdfBytes).digest('hex'),
  });
  const truncated = await runAtlasPdfStructuralQa({
    request: buildAtlasPdfRenderRequest('SELLER'),
    pdfBytes: referencePdfBytes.subarray(0, 128),
    fileHash: createHash('sha256').update(referencePdfBytes.subarray(0, 128)).digest('hex'),
  });

  return {
    versionMismatch,
    rightsHold,
    freshnessHold,
    rendererFailure,
    qaFailure: {
      requestId: qaFailureRequest.requestId,
      qaState: qaFailure.qaState,
      failedDomains: qaFailure.items.filter((item) => item.state === 'FAIL').map((item) => item.domain),
      failureCodes: qaFailure.failureCodes,
      noCertifiedPdf: qaFailure.qaState === 'PDF_QA_FAILED',
    },
    missingMarker: {
      qaState: missingMarker.qaState,
      failureCodes: missingMarker.failureCodes,
      noCertifiedPdf: missingMarker.qaState === 'PDF_QA_FAILED',
    },
    wrongProfile: {
      qaState: wrongProfile.qaState,
      failureCodes: wrongProfile.failureCodes,
      noCertifiedPdf: wrongProfile.qaState === 'PDF_QA_FAILED',
    },
    truncated: {
      qaState: truncated.qaState,
      failureCodes: truncated.failureCodes,
      noCertifiedPdf: truncated.qaState === 'PDF_QA_FAILED',
    },
  };
}

async function main() {
  const seller = await renderFixture('SELLER');
  const sellerUpdate = await renderFixture('SELLER_UPDATE');
  const negative = await negativeFixtures(readFileSync(seller.file.pdfPath));
  const hashValidation = {
    sellerHashMatchesBytes: createHash('sha256').update(readFileSync(seller.file.pdfPath)).digest('hex') === seller.result.fileHash,
    sellerUpdateHashMatchesBytes: createHash('sha256').update(readFileSync(sellerUpdate.file.pdfPath)).digest('hex') === sellerUpdate.result.fileHash,
    hashesDistinctFromRenderFingerprint:
      seller.result.fileHash !== seller.result.renderFingerprint &&
      sellerUpdate.result.fileHash !== sellerUpdate.result.renderFingerprint,
  };
  const summary = {
    status: 'ATLAS_PDF_RENDERER_FIXTURES_PASS',
    outputDir,
    seller,
    sellerUpdate,
    negative,
    hashValidation,
    cleanup: {
      sellerTempFileRemoved: seller.result.tempFileRemoved,
      sellerUpdateTempFileRemoved: sellerUpdate.result.tempFileRemoved,
      noExpectedClientArtifacts: !existsSync('output/pdf'),
    },
  };
  const summaryPath = join(outputDir, 'atlas-pdf-renderer-v1-fixture-summary.json');
  writeFileSync(summaryPath, `${JSON.stringify(summary, null, 2)}\n`);
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
