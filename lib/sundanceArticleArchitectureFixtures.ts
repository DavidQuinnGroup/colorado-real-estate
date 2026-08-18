import {
  SUNDANCE_ARTICLE_PARENT_PILLAR,
  type SundanceArticleArchitectureRecord,
} from './sundanceArticleArchitecture';
import { SUNDANCE_EDITORIAL_LIFECYCLE_FIXTURES } from './sundanceEditorialLifecycle';

const sourceReferences = SUNDANCE_EDITORIAL_LIFECYCLE_FIXTURES.orientationDurable.sourceReferences;

function validRecord(
  stableArticleId: string,
  customerQuestion: string,
  cluster: SundanceArticleArchitectureRecord['cluster'],
  aeoRole: SundanceArticleArchitectureRecord['aeoRole'],
): SundanceArticleArchitectureRecord {
  return {
    stableArticleId,
    customerQuestion,
    cluster,
    pillarRelationship: 'SUPPORTING_ARTICLE',
    lifecycleItemId: SUNDANCE_EDITORIAL_LIFECYCLE_FIXTURES.orientationDurable.stableId,
    sourceReferences,
    effectivePeriod: { kind: 'DURABLE', startsAt: null, endsAt: null },
    aeoRole,
    internalLinkDestinations: ['PILLAR', 'SOURCES', 'ADVISORY'],
    professionalHandoff: {
      surface: 'advisory',
      hiddenStateTransfer: false,
      professionalConclusion: false,
      required: true,
    },
    claimBoundary: {
      editorialOnly: true,
      governedGeographicFact: false,
      prohibitedCategories: ['YIELD', 'FESTIVAL_MULTIPLIER', 'APPRECIATION', 'MARKET_IMPACT', 'RENTAL_RETURN', 'PROPERTY_RANKING', 'SUITABILITY', 'TICKETING', 'BOOKING', 'LODGING_INVENTORY'],
      prohibitedClaimPresent: false,
    },
    publicationEffect: 'NONE',
    effects: { createsIndexability: false, createsRoute: false, createsSitemapMembership: false },
    parentPillar: SUNDANCE_ARTICLE_PARENT_PILLAR,
  };
}

export const SUNDANCE_ARTICLE_ARCHITECTURE_FIXTURES = {
  placeGeography: validRecord('SUNDANCE-ARTICLE-ARCH-PLACE-GEOGRAPHY', 'Which place context requires source verification?', 'PLACE_GEOGRAPHY', 'PILLAR_SUPPORT'),
  seasonalTemporaryPermanent: validRecord('SUNDANCE-ARTICLE-ARCH-SEASONAL-TEMPORARY-PERMANENT', 'Which temporary conditions require durable context?', 'SEASONAL_TEMPORARY_PERMANENT', 'ANSWER_UNIT'),
  relocationTravelPattern: validRecord('SUNDANCE-ARTICLE-ARCH-RELOCATION-TRAVEL-PATTERN', 'Which relocation or travel assumptions require verification?', 'RELOCATION_TRAVEL_PATTERN', 'ANSWER_UNIT'),
  propertyVerification: validRecord('SUNDANCE-ARTICLE-ARCH-PROPERTY-VERIFICATION', 'Which property facts require address-specific verification?', 'PROPERTY_VERIFICATION', 'ANSWER_UNIT'),
  localRuleMunicipal: validRecord('SUNDANCE-ARTICLE-ARCH-LOCAL-RULE-MUNICIPAL', 'Which local-rule questions require municipal verification?', 'LOCAL_RULE_MUNICIPAL', 'METHODOLOGY_SUPPORT'),
  professionalPreparation: validRecord('SUNDANCE-ARTICLE-ARCH-PROFESSIONAL-PREPARATION', 'Which unresolved questions require professional preparation?', 'PROFESSIONAL_PREPARATION', 'PILLAR_SUPPORT'),
  sourceMethodology: validRecord('SUNDANCE-ARTICLE-ARCH-SOURCE-METHODOLOGY', 'Which source limitations should govern reliance?', 'SOURCE_METHODOLOGY', 'METHODOLOGY_SUPPORT'),
} as const satisfies Record<string, SundanceArticleArchitectureRecord>;

const base = SUNDANCE_ARTICLE_ARCHITECTURE_FIXTURES.placeGeography;

export const SUNDANCE_ARTICLE_ARCHITECTURE_INVALID_FIXTURES = {
  duplicateIntent: { ...base, stableArticleId: 'SUNDANCE-ARTICLE-ARCH-DUPLICATE-INTENT' },
  missingLifecycleBinding: { ...base, stableArticleId: 'SUNDANCE-ARTICLE-ARCH-MISSING-LIFECYCLE', lifecycleItemId: '' },
  unknownRights: { ...base, stableArticleId: 'SUNDANCE-ARTICLE-ARCH-UNKNOWN-RIGHTS', sourceReferences: [{ ...sourceReferences[0], rightsPosture: 'UNKNOWN' as const }] },
  staleSource: { ...base, stableArticleId: 'SUNDANCE-ARTICLE-ARCH-STALE-SOURCE', sourceReferences: [{ ...sourceReferences[0], freshnessPosture: 'STALE_VERIFICATION' as const }] },
  prohibitedClaim: { ...base, stableArticleId: 'SUNDANCE-ARTICLE-ARCH-PROHIBITED-CLAIM', claimBoundary: { ...base.claimBoundary, prohibitedClaimPresent: true as const } },
  unpublishedLifecycleItem: { ...base, stableArticleId: 'SUNDANCE-ARTICLE-ARCH-UNPUBLISHED-LIFECYCLE', lifecycleItemId: SUNDANCE_EDITORIAL_LIFECYCLE_FIXTURES.sourceReviewRequired.stableId },
  correctionItem: { ...base, stableArticleId: 'SUNDANCE-ARTICLE-ARCH-CORRECTION', lifecycleItemId: SUNDANCE_EDITORIAL_LIFECYCLE_FIXTURES.correctionRequired.stableId },
  retiredItem: { ...base, stableArticleId: 'SUNDANCE-ARTICLE-ARCH-RETIRED', lifecycleItemId: SUNDANCE_EDITORIAL_LIFECYCLE_FIXTURES.retired.stableId },
  indexabilityMismatch: { ...base, stableArticleId: 'SUNDANCE-ARTICLE-ARCH-INDEXABILITY', effects: { ...base.effects, createsIndexability: true as const } },
  sitemapImplicationAttempt: { ...base, stableArticleId: 'SUNDANCE-ARTICLE-ARCH-SITEMAP', effects: { ...base.effects, createsSitemapMembership: true as const } },
  unsafeInternalLink: { ...base, stableArticleId: 'SUNDANCE-ARTICLE-ARCH-UNSAFE-LINK', internalLinkDestinations: ['PILLAR', 'UNSAFE'] as unknown as SundanceArticleArchitectureRecord['internalLinkDestinations'] },
} as const;
