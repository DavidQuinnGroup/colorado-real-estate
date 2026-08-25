import type { Prisma } from '@prisma/client';

import {
  buildAgentCohortCountContract,
  getAgentCohortCityLabel,
  getAgentCohortPropertyTypeValue,
  getAgentCohortStatusValue,
  normalizeAgentCohortDefinition,
  type AgentCohortCountContract,
  type AgentCohortInput,
  type AgentCohortNormalizedDefinition,
} from './agentCohortBuilder';
import { prisma } from './prisma';

function intervalWhere(interval: AgentCohortNormalizedDefinition['intervalSemantics']['price'], preserveClosedRangeShape = false) {
  if (interval.min === null && interval.max === null) return undefined;
  if (preserveClosedRangeShape && interval.boundary === 'CLOSED') return { gte: interval.min ?? undefined, lte: interval.max ?? undefined };
  return {
    ...(interval.min !== null && interval.includeMin ? { gte: interval.min } : {}),
    ...(interval.min !== null && !interval.includeMin ? { gt: interval.min } : {}),
    ...(interval.max !== null && interval.includeMax ? { lte: interval.max } : {}),
    ...(interval.max !== null && !interval.includeMax ? { lt: interval.max } : {}),
  };
}

export type AgentCohortCountResult = Readonly<{
  normalized: AgentCohortNormalizedDefinition;
  count: AgentCohortCountContract;
}>;

export function buildAgentCohortPrismaWhere(normalized: AgentCohortNormalizedDefinition): Prisma.PropertyWhereInput {
  const filters = normalized.filters;
  return {
    city: filters.city ? { equals: getAgentCohortCityLabel(filters.city) ?? undefined, mode: 'insensitive' } : undefined,
    propertyType: filters.propertyType ? { equals: getAgentCohortPropertyTypeValue(filters.propertyType) ?? undefined, mode: 'insensitive' } : undefined,
    status: { equals: getAgentCohortStatusValue(filters.statusScope), mode: 'insensitive' },
    price: intervalWhere(normalized.intervalSemantics.price, true),
    beds: intervalWhere(normalized.intervalSemantics.beds),
    baths: intervalWhere(normalized.intervalSemantics.baths),
    sqft: intervalWhere(normalized.intervalSemantics.sqft, true),
    yearBuilt: intervalWhere(normalized.intervalSemantics.yearBuilt, true),
    lotSize: intervalWhere(normalized.intervalSemantics.lotSize, true),
  };
}

export async function countAgentCohortListings(input: AgentCohortInput): Promise<AgentCohortCountResult> {
  const normalized = normalizeAgentCohortDefinition(input);
  if (!normalized.validation.ready) {
    return Object.freeze({
      normalized,
      count: buildAgentCohortCountContract({ normalized, count: null, available: false }),
    });
  }

  try {
    const count = await prisma.property.count({ where: buildAgentCohortPrismaWhere(normalized) });
    return Object.freeze({
      normalized,
      count: buildAgentCohortCountContract({ normalized, count, available: true }),
    });
  } catch {
    return Object.freeze({
      normalized,
      count: buildAgentCohortCountContract({ normalized, count: null, available: false }),
    });
  }
}
