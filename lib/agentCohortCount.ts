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
    price: filters.priceMin !== null || filters.priceMax !== null ? { gte: filters.priceMin ?? undefined, lte: filters.priceMax ?? undefined } : undefined,
    beds: filters.bedsMin !== null ? { gte: filters.bedsMin } : undefined,
    baths: filters.bathsMin !== null ? { gte: filters.bathsMin } : undefined,
    sqft: filters.sqftMin !== null || filters.sqftMax !== null ? { gte: filters.sqftMin ?? undefined, lte: filters.sqftMax ?? undefined } : undefined,
    yearBuilt: filters.yearBuiltMin !== null || filters.yearBuiltMax !== null ? { gte: filters.yearBuiltMin ?? undefined, lte: filters.yearBuiltMax ?? undefined } : undefined,
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
