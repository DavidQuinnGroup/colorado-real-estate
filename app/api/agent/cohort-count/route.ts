import { NextResponse } from 'next/server';

import { countAgentCohortListings } from '@/lib/agentCohortCount';
import { parseAgentCohortSearchParams } from '@/lib/agentCohortBuilder';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const input = parseAgentCohortSearchParams(new URL(request.url).searchParams);
  const result = await countAgentCohortListings(input);
  return NextResponse.json(
    {
      status: result.count.available ? 'READY' : 'NOT_AVAILABLE',
      cohort: {
        id: result.normalized.cohort.cohortDefinitionId,
        version: result.normalized.cohort.cohortDefinitionVersion,
        builderVersion: result.normalized.version,
        validation: result.normalized.validation,
        rejectedFilters: result.normalized.rejectedFilters,
        filters: result.normalized.filters,
        grain: result.normalized.cohort.analyticalGrain,
        temporalBasis: result.normalized.cohort.period.periodBasis,
        periodForm: result.normalized.cohort.period.form,
        sourceScope: result.count.sourceScope,
        sourceAsOf: result.normalized.cohort.sourceScope.sourceAsOf,
      },
      count: result.count,
    },
    { status: result.count.available ? 200 : 422 },
  );
}
