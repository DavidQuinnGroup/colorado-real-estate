import { NextResponse } from 'next/server';

import { aggregateAgentCohort } from '@/lib/agentCohortAggregation';
import { parseAgentCohortSearchParams } from '@/lib/agentCohortBuilder';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const input = parseAgentCohortSearchParams(searchParams);
  const result = await aggregateAgentCohort(input, searchParams.getAll('metricId'));
  return NextResponse.json(
    {
      status: result.status,
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
      metrics: {
        artifacts: result.artifacts,
        rejectedMetricIds: result.rejectedMetricIds,
      },
    },
    { status: result.status === 'READY' ? 200 : 422 },
  );
}
