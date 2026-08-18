import { evaluateObjectSourceReadiness } from './objectSourceReadiness';
import { OBJECT_SOURCE_READINESS_FIXTURES } from './objectSourceReadinessFixtures';
import type { SearchMarketRelationshipInput } from './searchMarketRelationship';

const prohibitedUse = { ranking: false, recommendation: false, suitability: false, personalization: false, protectedClassInference: false, propertyAssignment: false } as const;
const ready = evaluateObjectSourceReadiness(OBJECT_SOURCE_READINESS_FIXTURES.municipality);
const blocked = evaluateObjectSourceReadiness(OBJECT_SOURCE_READINESS_FIXTURES.niwot);
const base = (objectId: string, objectType: SearchMarketRelationshipInput['objectType'], sourceReadiness = ready): SearchMarketRelationshipInput => ({ objectId, objectType, relationshipType: 'SEARCH_CONTEXT_FOR', sourceReadiness, existingRoute: false, editorialContext: false, jurisdictionSupported: true, requestedActivation: false, prohibitedUse });
export const SEARCH_MARKET_RELATIONSHIP_FIXTURES = {
  municipality: base('GEO-MUNICIPALITY-FIXTURE', 'MUNICIPALITY'), neighborhood: base('GEO-NEIGHBORHOOD-FIXTURE', 'NEIGHBORHOOD'), subdivision: base('GEO-SUBDIVISION-FIXTURE', 'SUBDIVISION'), corridor: base('GEO-CORRIDOR-FIXTURE', 'CORRIDOR'), marketArea: base('GEO-MARKET-AREA-FIXTURE', 'MARKET_AREA'),
  editorial: { ...base('GEO-EDITORIAL', 'NON_AUTHORITATIVE_EDITORIAL_CONTEXT'), editorialContext: true }, niwot: base('GEO-NIWOT', 'UNINCORPORATED_COMMUNITY', blocked),
  gunbarrel: { ...base('GEO-GUNBARREL', 'NON_AUTHORITATIVE_EDITORIAL_CONTEXT', evaluateObjectSourceReadiness(OBJECT_SOURCE_READINESS_FIXTURES.gunbarrel)), existingRoute: true, editorialContext: true, jurisdictionSupported: false },
  tableMesa: base('GEO-TABLE-MESA', 'NEIGHBORHOOD', evaluateObjectSourceReadiness(OBJECT_SOURCE_READINESS_FIXTURES.tableMesa)),
  ranking: { ...base('GEO-RANKING', 'NEIGHBORHOOD'), prohibitedUse: { ...prohibitedUse, ranking: true } }, suitability: { ...base('GEO-SUITABILITY', 'NEIGHBORHOOD'), prohibitedUse: { ...prohibitedUse, suitability: true } }, activation: { ...base('GEO-ACTIVATION', 'NEIGHBORHOOD'), requestedActivation: true },
} as const satisfies Record<string, SearchMarketRelationshipInput>;
