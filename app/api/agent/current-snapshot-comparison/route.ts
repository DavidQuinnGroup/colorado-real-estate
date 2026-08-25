import { NextRequest, NextResponse } from 'next/server';

import { authorizeAdminRequest } from '@/lib/admin/adminAuth';
import { compareAgentCurrentSnapshotCohorts, parseAgentComparisonSearchParams } from '@/lib/agentCurrentSnapshotComparison';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const RESPONSE_HEADERS = { 'Cache-Control': 'private, no-store' };
const AGENT_COMPARISON_API_PATH = '/api/agent/current-snapshot-comparison';

function unauthorizedResponse() {
  return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: RESPONSE_HEADERS });
}

export async function GET(request: NextRequest) {
  const authorization = await authorizeAdminRequest(request, { pathname: AGENT_COMPARISON_API_PATH, method: 'GET' });
  if (!authorization.authenticated || authorization.identityType !== 'HUMAN_AGENT' || authorization.role !== 'AGENT' || authorization.canMutate) {
    return unauthorizedResponse();
  }

  const result = await compareAgentCurrentSnapshotCohorts(parseAgentComparisonSearchParams(request.nextUrl.searchParams));
  return NextResponse.json(result, { status: result.status === 'READY' ? 200 : 422, headers: RESPONSE_HEADERS });
}
