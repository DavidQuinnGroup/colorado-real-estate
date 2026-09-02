import { NextRequest } from 'next/server';

import { createProfessionalExternalRequestBootstrapResponse } from '@/lib/professionalExternalRequestBootstrap';
import { createProfessionalExternalRequestService } from '@/lib/professionalExternalRequestFoundation';
import { createProjectAtlasExternalUnavailableResponse } from '@/lib/projectAtlasExternalNavigation';
import { ProfessionalExternalRequestError } from '@/lib/professionalExternalRequestProfileRegistry';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') || '';
  try {
    const exchange = await createProfessionalExternalRequestService(prisma).bootstrap(token);
    return createProfessionalExternalRequestBootstrapResponse(exchange.cookieValue);
  } catch (error) {
    const status = error instanceof ProfessionalExternalRequestError && error.code === 'EXPIRED' ? 410 : error instanceof ProfessionalExternalRequestError && error.code === 'REVOKED' ? 403 : 404;
    return createProjectAtlasExternalUnavailableResponse({ title: 'Request unavailable', message: 'This secure request is unavailable or has expired.', status });
  }
}
