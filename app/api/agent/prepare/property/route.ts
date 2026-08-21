import { NextRequest, NextResponse } from 'next/server';

import { authorizeAdminRequest } from '@/lib/admin/adminAuth';
import {
  getAgentPropertyConversationCandidate,
  getAgentPropertyConversationCandidateSummaries,
} from '@/lib/agent-advisory-workbench/agentPropertyConversationPreparationRepository';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const RESPONSE_HEADERS = { 'Cache-Control': 'private, no-store' };
const AGENT_PROPERTY_API_PATH = '/api/agent/prepare/property';

function unauthorizedResponse() {
  return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: RESPONSE_HEADERS });
}

export async function GET(request: NextRequest) {
  const authorization = await authorizeAdminRequest(request, { pathname: AGENT_PROPERTY_API_PATH, method: 'GET' });
  if (!authorization.authenticated || authorization.identityType !== 'HUMAN_AGENT' || authorization.role !== 'AGENT' || authorization.canMutate) {
    return unauthorizedResponse();
  }

  const slug = request.nextUrl.searchParams.get('property');
  if (slug !== null) {
    const candidate = await getAgentPropertyConversationCandidate(slug);
    if (!candidate) return NextResponse.json({ error: 'Property is unavailable.' }, { status: 404, headers: RESPONSE_HEADERS });
    return NextResponse.json({ candidate }, { headers: RESPONSE_HEADERS });
  }

  const candidates = await getAgentPropertyConversationCandidateSummaries();
  return NextResponse.json({ candidates }, { headers: RESPONSE_HEADERS });
}
