import { NextRequest, NextResponse } from 'next/server';

import { authorizeAdminRequest } from '@/lib/admin/adminAuth';
import { AGENT_COHORT_SUPPORTED_FILTER_KEYS, type AgentCohortFilterKey } from '@/lib/agentCohortBuilder';
import { isAgentUnadmittedFilterKey } from '@/lib/agentAdmittedFilterRegistry';
import { buildCurrentCompetingListingContext, type SubjectListingContextRequest } from '@/lib/agentCurrentCompetingListingContext';
import { getAgentPropertyConversationCandidate } from '@/lib/agent-advisory-workbench/agentPropertyConversationPreparationRepository';
import type { AtlasAudienceOutput } from '@/lib/atlasCohortComparativeContract';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const RESPONSE_HEADERS = { 'Cache-Control': 'private, no-store' };
const AGENT_COMPETING_CONTEXT_API_PATH = '/api/agent/current-competing-listing-context';

function unauthorizedResponse() {
  return NextResponse.json({ error: 'Agent authentication required.' }, { status: 403, headers: RESPONSE_HEADERS });
}

function boolParam(value: string | null) {
  return value === 'true' || value === '1';
}

function parseFilters(searchParams: URLSearchParams) {
  const filters: Partial<Record<AgentCohortFilterKey, string | number | readonly string[] | null | undefined>> = {};
  for (const key of AGENT_COHORT_SUPPORTED_FILTER_KEYS) {
    const values = searchParams.getAll(key);
    if (values.length > 1 && key === 'zip') filters[key] = values;
    else {
      const value = searchParams.get(key);
      if (value !== null) filters[key] = value;
    }
  }
  return filters;
}

export async function GET(request: NextRequest) {
  const authorization = await authorizeAdminRequest(request, { pathname: AGENT_COMPETING_CONTEXT_API_PATH, method: 'GET' });
  if (!authorization.authenticated || authorization.identityType !== 'HUMAN_AGENT' || authorization.role !== 'AGENT' || authorization.canMutate) {
    return unauthorizedResponse();
  }

  const slug = request.nextUrl.searchParams.get('property');
  const candidate = slug ? await getAgentPropertyConversationCandidate(slug) : null;
  const requestContract: SubjectListingContextRequest = Object.freeze({
    subjectGrain: request.nextUrl.searchParams.get('subjectGrain') as SubjectListingContextRequest['subjectGrain'],
    audience: request.nextUrl.searchParams.get('audience') as AtlasAudienceOutput | null,
    historical: boolParam(request.nextUrl.searchParams.get('historical')),
    dom: boolParam(request.nextUrl.searchParams.get('dom')),
    soldComparable: boolParam(request.nextUrl.searchParams.get('soldComparable')),
    filters: Object.freeze(parseFilters(request.nextUrl.searchParams)),
    unsupportedFilters: Object.freeze([
      ...new Set([
        ...request.nextUrl.searchParams.getAll('unsupportedFilter'),
        ...[...request.nextUrl.searchParams.keys()].filter(isAgentUnadmittedFilterKey),
      ]),
    ].sort()),
  });
  const result = await buildCurrentCompetingListingContext(candidate, requestContract);
  return NextResponse.json(result, { status: result.status === 'READY' ? 200 : slug ? 422 : 404, headers: RESPONSE_HEADERS });
}
