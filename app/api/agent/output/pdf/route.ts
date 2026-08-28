import { NextRequest, NextResponse } from 'next/server';

import { authorizeAdminRequest } from '@/lib/admin/adminAuth';
import {
  ATLAS_PDF_RENDERER_API_ROUTE,
  type AtlasPdfProductKind,
  buildAtlasPdfRenderRequest,
  generateAtlasPdf,
} from '@/lib/atlasPdfRenderer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';
export const preferredRegion = 'iad1';
export const maxDuration = 60;

const RESPONSE_HEADERS = { 'Cache-Control': 'private, no-store', Vary: 'Cookie' };

function unauthorizedResponse() {
  return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: RESPONSE_HEADERS });
}

function normalizeProductKind(value: unknown): AtlasPdfProductKind | null {
  return value === 'SELLER' || value === 'SELLER_UPDATE' ? value : null;
}

export async function POST(request: NextRequest) {
  const authorization = await authorizeAdminRequest(request, { pathname: ATLAS_PDF_RENDERER_API_ROUTE, method: 'POST' });
  if (!authorization.authenticated || authorization.identityType !== 'HUMAN_AGENT' || authorization.role !== 'AGENT' || authorization.canMutate) {
    return unauthorizedResponse();
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid PDF request.' }, { status: 400, headers: RESPONSE_HEADERS });
  }

  const productKind = normalizeProductKind((body as { productKind?: unknown })?.productKind);
  if (!productKind) {
    return NextResponse.json({ error: 'Unsupported PDF product.' }, { status: 400, headers: RESPONSE_HEADERS });
  }

  const pdfRequest = buildAtlasPdfRenderRequest(productKind, {
    requestedByAgent: authorization.mechanism,
    requestedAt: new Date().toISOString(),
  });
  const result = await generateAtlasPdf(pdfRequest);

  if (result.pdfState === 'PDF_RENDER_FAILED') {
    return NextResponse.json(
      {
        error: result.agentMessage,
        failure: result.failure,
        retryClass: result.retryClass,
        recovery: result.recovery,
        requestId: result.requestId,
        pdfState: result.pdfState,
      },
      { status: result.retryClass === 'RUNTIME_FIX_REQUIRED' ? 503 : 409, headers: RESPONSE_HEADERS },
    );
  }

  return new NextResponse(new Uint8Array(result.pdfBytes), {
    status: 200,
    headers: {
      ...RESPONSE_HEADERS,
      'Content-Type': result.mimeType,
      'Content-Disposition': `attachment; filename="${result.fileName}"`,
      'X-Atlas-Pdf-State': result.pdfState,
      'X-Atlas-Pdf-File-Name': result.fileName,
      'X-Atlas-Pdf-File-Hash': result.fileHash,
      'X-Atlas-Pdf-Page-Count': `${result.pageCount}`,
      'X-Atlas-Pdf-File-Size': `${result.fileSize}`,
      'X-Atlas-Pdf-Render-Version': result.renderVersion,
      'X-Atlas-Pdf-Output-Version': result.sourceOutputVersionId,
      'X-Atlas-Pdf-Qa-State': result.qaState,
      'X-Atlas-Pdf-Generated-At': result.generatedAt,
      'X-Atlas-Pdf-Request-Id': result.requestId,
      'X-Atlas-Pdf-Render-Id': result.renderId,
      'X-Atlas-Pdf-Duration-Ms': `${result.durationMs}`,
      'X-Atlas-Pdf-Renderer-Startup-Ms': `${result.rendererStartupMs}`,
      'X-Atlas-Pdf-Qa-Duration-Ms': `${result.qaDurationMs}`,
      'X-Atlas-Pdf-Runtime-Environment': result.runtimeVersion.deploymentRuntime,
      'X-Atlas-Pdf-Runtime-Adapter-Version': result.runtimeVersion.adapterVersion,
      'X-Atlas-Pdf-Chromium-Package': result.runtimeVersion.chromiumPackage,
      'X-Atlas-Pdf-Chromium-Version': result.runtimeVersion.chromiumVersion,
      'X-Atlas-Pdf-Node-Runtime': result.runtimeVersion.nodeRuntime,
    },
  });
}
