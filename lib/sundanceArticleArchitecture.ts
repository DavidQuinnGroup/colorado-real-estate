import {
  SUNDANCE_EDITORIAL_LIFECYCLE_FIXTURES,
  SUNDANCE_EDITORIAL_PARENT_PILLAR,
  SUNDANCE_EDITORIAL_PROHIBITED_CLAIM_CATEGORIES,
  evaluateSundanceEditorialLifecycle,
  type SundanceEditorialClaimCategory,
  type SundanceEditorialLifecycleItem,
  type SundanceEditorialSourceReference,
} from './sundanceEditorialLifecycle';
import type { ProfessionalHandoffSurface } from './professionalHandoffCohesion';

export const SUNDANCE_ARTICLE_ARCHITECTURE_STATUS = 'IMPLEMENTED_NOT_ACTIVATED' as const;
export const SUNDANCE_ARTICLE_ARCHITECTURE_VERSION = 'REIE_MODULE_16_ARTICLE_AEO_ARCHITECTURE_MVV_V1' as const;
export const SUNDANCE_ARTICLE_PARENT_PILLAR = SUNDANCE_EDITORIAL_PARENT_PILLAR;

export const SUNDANCE_ARTICLE_INTERNAL_LINK_DESTINATIONS = [
  'PILLAR',
  'SEARCH',
  'MARKET',
  'GRAND_PLAN',
  'PROPERTY',
  'SOURCES',
  'ADVISORY',
] as const;

export const SUNDANCE_ARTICLE_PROTECTED_BOUNDARIES = {
  articleContent: false,
  articleGeneration: false,
  articlePublication: false,
  articleRoute: false,
  databasePersistence: false,
  indexability: false,
  providerActivation: false,
  searchMutation: false,
  sitemapMembership: false,
} as const;

export type SundanceArticleCluster =
  | 'PLACE_GEOGRAPHY'
  | 'SEASONAL_TEMPORARY_PERMANENT'
  | 'RELOCATION_TRAVEL_PATTERN'
  | 'PROPERTY_VERIFICATION'
  | 'LOCAL_RULE_MUNICIPAL'
  | 'PROFESSIONAL_PREPARATION'
  | 'SOURCE_METHODOLOGY';

export type SundanceArticleAeoRole = 'PILLAR_SUPPORT' | 'ANSWER_UNIT' | 'METHODOLOGY_SUPPORT';
export type SundanceArticlePillarRelationship = 'SUPPORTING_ARTICLE';
export type SundanceArticlePublicationEffect = 'NONE';
export type SundanceArticleInternalLinkDestination = (typeof SUNDANCE_ARTICLE_INTERNAL_LINK_DESTINATIONS)[number];

export type SundanceArticleEffectivePeriod =
  | { kind: 'DURABLE'; startsAt: null; endsAt: null }
  | { kind: 'TIME_BOUND'; startsAt: string; endsAt: string };

export type SundanceArticleProfessionalHandoff = {
  surface: ProfessionalHandoffSurface;
  hiddenStateTransfer: false;
  professionalConclusion: false;
  required: true;
};

export type SundanceArticleClaimBoundary = {
  editorialOnly: true;
  governedGeographicFact: false;
  prohibitedCategories: readonly SundanceEditorialClaimCategory[];
  prohibitedClaimPresent: false;
};

export type SundanceArticleEffects = {
  createsIndexability: false;
  createsRoute: false;
  createsSitemapMembership: false;
};

export type SundanceArticleArchitectureRecord = {
  stableArticleId: string;
  customerQuestion: string;
  cluster: SundanceArticleCluster;
  pillarRelationship: SundanceArticlePillarRelationship;
  lifecycleItemId: string;
  sourceReferences: readonly SundanceEditorialSourceReference[];
  effectivePeriod: SundanceArticleEffectivePeriod;
  aeoRole: SundanceArticleAeoRole;
  internalLinkDestinations: readonly SundanceArticleInternalLinkDestination[];
  professionalHandoff: SundanceArticleProfessionalHandoff;
  claimBoundary: SundanceArticleClaimBoundary;
  publicationEffect: SundanceArticlePublicationEffect;
  effects: SundanceArticleEffects;
  parentPillar: typeof SUNDANCE_ARTICLE_PARENT_PILLAR;
};

export type SundanceArticleArchitectureCandidate = Omit<
  SundanceArticleArchitectureRecord,
  'claimBoundary' | 'effects'
> & {
  claimBoundary: Omit<SundanceArticleClaimBoundary, 'prohibitedClaimPresent'> & {
    prohibitedClaimPresent: boolean;
  };
  effects: {
    createsIndexability: boolean;
    createsRoute: boolean;
    createsSitemapMembership: boolean;
  };
};

export type SundanceArticleArchitectureIssueCode =
  | 'CUSTOMER_QUESTION_REQUIRED'
  | 'DUPLICATE_CUSTOMER_INTENT'
  | 'EFFECT_NOT_NONE'
  | 'INTERNAL_LINK_DESTINATION_INVALID'
  | 'LIFECYCLE_BINDING_INVALID'
  | 'LIFECYCLE_NOT_ELIGIBLE'
  | 'PARENT_PILLAR_INVALID'
  | 'PILLAR_RELATIONSHIP_INVALID'
  | 'PROHIBITED_CLAIM'
  | 'SOURCE_POSTURE_INCOMPATIBLE'
  | 'TIME_BOUND_FRESHNESS_REQUIRED';

export type SundanceArticleArchitectureIssue = {
  code: SundanceArticleArchitectureIssueCode;
  detail: string;
};

export type SundanceArticleArchitectureEvaluation = {
  valid: boolean;
  publicationEligible: false;
  indexabilityEligible: false;
  sitemapEligible: false;
  issues: readonly SundanceArticleArchitectureIssue[];
};

function issue(code: SundanceArticleArchitectureIssueCode, detail: string): SundanceArticleArchitectureIssue {
  return { code, detail };
}

function populated(value: string | null | undefined): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

export function getSundanceArchitectureLifecycleItem(lifecycleItemId: string): SundanceEditorialLifecycleItem | null {
  return Object.values(SUNDANCE_EDITORIAL_LIFECYCLE_FIXTURES).find((item) => item.stableId === lifecycleItemId) ?? null;
}

export function evaluateSundanceArticleArchitecture(
  record: SundanceArticleArchitectureCandidate,
  peerRecords: readonly SundanceArticleArchitectureCandidate[] = [],
): SundanceArticleArchitectureEvaluation {
  const issues: SundanceArticleArchitectureIssue[] = [];
  const lifecycleItem = getSundanceArchitectureLifecycleItem(record.lifecycleItemId);

  if (!populated(record.customerQuestion)) {
    issues.push(issue('CUSTOMER_QUESTION_REQUIRED', 'Each architecture item requires exactly one non-empty customer question.'));
  }

  if (peerRecords.some((peer) => peer.stableArticleId !== record.stableArticleId && peer.customerQuestion === record.customerQuestion)) {
    issues.push(issue('DUPLICATE_CUSTOMER_INTENT', 'Customer questions must be unique within the architecture register.'));
  }

  if (record.parentPillar !== SUNDANCE_ARTICLE_PARENT_PILLAR) {
    issues.push(issue('PARENT_PILLAR_INVALID', 'Architecture items must remain under the Sundance parent pillar.'));
  }

  if (record.pillarRelationship !== 'SUPPORTING_ARTICLE') {
    issues.push(issue('PILLAR_RELATIONSHIP_INVALID', 'Architecture items may only support the Sundance pillar.'));
  }

  if (!lifecycleItem) {
    issues.push(issue('LIFECYCLE_BINDING_INVALID', 'Architecture items require a canonical Sundance lifecycle binding.'));
  } else if (!evaluateSundanceEditorialLifecycle(lifecycleItem).valid || lifecycleItem.lifecycleState !== 'PUBLISHED') {
    issues.push(issue('LIFECYCLE_NOT_ELIGIBLE', 'Only a canonical, valid published lifecycle item can support architecture readiness.'));
  }

  if (
    record.sourceReferences.length === 0 ||
    record.sourceReferences.some(
      (reference) =>
        reference.rightsPosture !== 'VERIFIED' ||
        (reference.freshnessPosture !== 'VERIFIED_CURRENT' && reference.freshnessPosture !== 'DOMAIN_SPECIFIC') ||
        !populated(reference.sourceQualityReference) ||
        !populated(reference.rightsReference),
    )
  ) {
    issues.push(issue('SOURCE_POSTURE_INCOMPATIBLE', 'Architecture references require verified rights, compatible freshness, and canonical quality/rights linkage.'));
  }

  if (
    record.effectivePeriod.kind === 'TIME_BOUND' &&
    record.sourceReferences.some((reference) => reference.freshnessPosture !== 'VERIFIED_CURRENT')
  ) {
    issues.push(issue('TIME_BOUND_FRESHNESS_REQUIRED', 'Time-bound architecture requires verified-current source freshness.'));
  }

  if (record.internalLinkDestinations.some((destination) => !SUNDANCE_ARTICLE_INTERNAL_LINK_DESTINATIONS.includes(destination))) {
    issues.push(issue('INTERNAL_LINK_DESTINATION_INVALID', 'Architecture links must use the bounded internal destination allowlist.'));
  }

  if (
    record.publicationEffect !== 'NONE' ||
    record.effects.createsRoute ||
    record.effects.createsIndexability ||
    record.effects.createsSitemapMembership
  ) {
    issues.push(issue('EFFECT_NOT_NONE', 'Architecture cannot create a route, publication, indexability, or sitemap membership.'));
  }

  if (
    record.claimBoundary.prohibitedClaimPresent ||
    record.claimBoundary.prohibitedCategories.some((category) => !SUNDANCE_EDITORIAL_PROHIBITED_CLAIM_CATEGORIES.includes(category))
  ) {
    issues.push(issue('PROHIBITED_CLAIM', 'Architecture must preserve the Sundance prohibited-claim boundary.'));
  }

  return {
    valid: issues.length === 0,
    publicationEligible: false,
    indexabilityEligible: false,
    sitemapEligible: false,
    issues,
  };
}
