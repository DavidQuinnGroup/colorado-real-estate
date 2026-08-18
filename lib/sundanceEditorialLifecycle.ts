import type { FreshnessPosture, RightsPosture } from './sourceQualityEvidenceNormalization';
import type { ReieSourceClass } from './sourceRegistry';

export const SUNDANCE_EDITORIAL_LIFECYCLE_STATUS = 'IMPLEMENTED_NOT_ACTIVATED' as const;
export const SUNDANCE_EDITORIAL_LIFECYCLE_VERSION = 'REIE_MODULE_16_EDITORIAL_LIFECYCLE_MVV_V1' as const;
export const SUNDANCE_EDITORIAL_PARENT_PILLAR = '/sundance-film-festival' as const;

export const SUNDANCE_EDITORIAL_GOVERNANCE_SEPARATIONS = [
  'SOURCE_IDENTITY_NOT_RIGHTS_NOT_PUBLICATION',
  'SOURCE_QUALITY_NOT_PUBLICATION',
  'APPROVAL_NOT_PUBLICATION',
  'PUBLICATION_NOT_GOVERNED_GEOGRAPHIC_FACT',
  'EDITORIAL_AEO_PROMINENCE_NOT_FACTUAL_AUTHORITY',
] as const;

export const SUNDANCE_EDITORIAL_PROTECTED_BOUNDARIES = {
  articleGeneration: false,
  articlePublication: false,
  articleRoutes: false,
  databasePersistence: false,
  operationalManifestMutation: false,
  providerActivation: false,
  providerRetrieval: false,
  registryMutation: false,
  runtimeActivation: false,
  sitemapMutation: false,
} as const;

export type SundanceEditorialLifecycleState =
  | 'DRAFT'
  | 'SOURCE_REVIEW_REQUIRED'
  | 'EDITORIAL_REVIEW_REQUIRED'
  | 'APPROVED_FOR_PUBLICATION'
  | 'PUBLISHED'
  | 'FRESHNESS_REVIEW_DUE'
  | 'CORRECTION_REQUIRED'
  | 'RETIRED'
  | 'BLOCKED_REQUIRES_EXECUTIVE_OR_SPECIALIST_REVIEW';

export type SundanceEditorialCluster =
  | 'PLACE_GEOGRAPHY'
  | 'SEASONAL_TEMPORARY_PERMANENT'
  | 'RELOCATION_TRAVEL_PATTERN'
  | 'PROPERTY_VERIFICATION'
  | 'LOCAL_RULE_MUNICIPAL'
  | 'PROFESSIONAL_PREPARATION'
  | 'SOURCE_METHODOLOGY';

export type SundanceEditorialFactualClass =
  | 'EDITORIAL_ORIENTATION'
  | 'SOURCE_BACKED_FACTUAL_CONTEXT'
  | 'PROFESSIONAL_PREPARATION'
  | 'SOURCE_METHODOLOGY';

export type SundanceEditorialAeoRole =
  | 'ORIENTATION_ANSWER'
  | 'VERIFICATION_ANSWER'
  | 'PREPARATION_ANSWER'
  | 'METHODOLOGY_ANSWER';

export type SundanceEditorialSourceType = ReieSourceClass | 'EDITORIAL_RECORD';

export type SundanceEditorialPublicationState =
  | 'NOT_PUBLISHED'
  | 'PUBLICATION_ELIGIBLE'
  | 'PUBLISHED'
  | 'PUBLIC_RELIANCE_SUSPENDED'
  | 'RETIRED';

export type SundanceEditorialIndexabilityState = 'UNPUBLISHED' | 'NOINDEX' | 'INDEXABLE' | 'FAIL_CLOSED';
export type SundanceEditorialCorrectionState = 'NONE' | 'OPEN' | 'RESOLVED';
export type SundanceEditorialRetirementState = 'ACTIVE' | 'RETIRED';
export type SundanceEditorialGeographicAuthorityState = 'EDITORIAL_ONLY' | 'NOT_APPLICABLE';

export type SundanceEditorialClaimCategory =
  | 'ORIENTATION'
  | 'SOURCE_VERIFICATION'
  | 'PROFESSIONAL_PREPARATION'
  | 'METHODOLOGY'
  | 'YIELD'
  | 'FESTIVAL_MULTIPLIER'
  | 'APPRECIATION'
  | 'MARKET_IMPACT'
  | 'RENTAL_RETURN'
  | 'PROPERTY_RANKING'
  | 'SUITABILITY'
  | 'TICKETING'
  | 'BOOKING'
  | 'LODGING_INVENTORY';

export const SUNDANCE_EDITORIAL_PROHIBITED_CLAIM_CATEGORIES: readonly SundanceEditorialClaimCategory[] = [
  'YIELD',
  'FESTIVAL_MULTIPLIER',
  'APPRECIATION',
  'MARKET_IMPACT',
  'RENTAL_RETURN',
  'PROPERTY_RANKING',
  'SUITABILITY',
  'TICKETING',
  'BOOKING',
  'LODGING_INVENTORY',
] as const;

export type SundanceEditorialSourceReference = {
  sourceId: string;
  sourceType: SundanceEditorialSourceType;
  rightsPosture: RightsPosture;
  freshnessPosture: FreshnessPosture;
  sourceQualityReference: string | null;
  rightsReference: string | null;
};

export type SundanceEditorialAudit = {
  createdAt: string;
  createdBy: string;
  lastTransitionId: string;
  lastTransitionAt: string;
  lastTransitionBy: string;
  lastTransitionReason: string;
  sourceReviewedAt: string | null;
  editorialReviewedAt: string | null;
  publicationApprovedAt: string | null;
  publishedAt: string | null;
  correctionOpenedAt: string | null;
  retiredAt: string | null;
};

export type SundanceEditorialPublicationAuthorization = {
  authorized: boolean;
  authorizationId: string | null;
  authorizedAt: string | null;
};

export type SundanceEditorialLifecycleItem = {
  stableId: string;
  topic: string;
  customerQuestion: string;
  title: string;
  slug: string;
  canonicalUrl: string;
  editorialFactualClass: SundanceEditorialFactualClass;
  parentPillar: typeof SUNDANCE_EDITORIAL_PARENT_PILLAR;
  cluster: SundanceEditorialCluster;
  aeoRole: SundanceEditorialAeoRole;
  claimSummary: string;
  claimCategories: readonly SundanceEditorialClaimCategory[];
  sourceReferences: readonly SundanceEditorialSourceReference[];
  sourceType: SundanceEditorialSourceType;
  rightsPosture: RightsPosture;
  freshnessPosture: FreshnessPosture;
  effectiveFrom: string | null;
  effectiveTo: string | null;
  verifiedAt: string | null;
  freshnessReviewDue: string | null;
  reviewOwner: string;
  editorialOwner: string;
  specialistReviewer: string | null;
  correctionState: SundanceEditorialCorrectionState;
  retirementState: SundanceEditorialRetirementState;
  publicLimitationText: string;
  lifecycleState: SundanceEditorialLifecycleState;
  publicationState: SundanceEditorialPublicationState;
  indexabilityState: SundanceEditorialIndexabilityState;
  publicationAuthorization: SundanceEditorialPublicationAuthorization;
  geographicAuthorityState: SundanceEditorialGeographicAuthorityState;
  governedGeographicFact: boolean;
  sitemapEligible: boolean;
  audit: SundanceEditorialAudit;
};

export type SundanceEditorialLifecycleIssueCode =
  | 'AUDIT_METADATA_REQUIRED'
  | 'BLOCKED_PUBLICATION_FORBIDDEN'
  | 'CORRECTION_REQUIRES_PUBLIC_RELIANCE_SUSPENSION'
  | 'EDITORIAL_GEOGRAPHY_CONVERSION_FORBIDDEN'
  | 'EDITORIAL_REVIEW_BYPASS'
  | 'FRESHNESS_NOT_VERIFIED'
  | 'INDEXABLE_REQUIRES_AUTHORIZED_PUBLICATION'
  | 'INVALID_TRANSITION'
  | 'PARENT_PILLAR_INVALID'
  | 'PROHIBITED_CLAIM'
  | 'PUBLICATION_AUTHORIZATION_REQUIRED'
  | 'PUBLICATION_STATE_MISMATCH'
  | 'RETIRED_REACTIVATION_FORBIDDEN'
  | 'RIGHTS_NOT_VERIFIED'
  | 'SITEMAP_NOT_PUBLICATION_AUTHORITY'
  | 'SOURCE_REFERENCE_REQUIRED'
  | 'SOURCE_REVIEW_BYPASS'
  | 'TIME_BOUNDS_REQUIRED';

export type SundanceEditorialLifecycleIssue = {
  code: SundanceEditorialLifecycleIssueCode;
  detail: string;
};

export type SundanceEditorialLifecycleEvaluation = {
  valid: boolean;
  publicEligible: boolean;
  indexableEligible: boolean;
  issues: readonly SundanceEditorialLifecycleIssue[];
};

export const SUNDANCE_EDITORIAL_ALLOWED_TRANSITIONS: Readonly<
  Record<SundanceEditorialLifecycleState, readonly SundanceEditorialLifecycleState[]>
> = {
  DRAFT: ['SOURCE_REVIEW_REQUIRED', 'RETIRED', 'BLOCKED_REQUIRES_EXECUTIVE_OR_SPECIALIST_REVIEW'],
  SOURCE_REVIEW_REQUIRED: [
    'EDITORIAL_REVIEW_REQUIRED',
    'RETIRED',
    'BLOCKED_REQUIRES_EXECUTIVE_OR_SPECIALIST_REVIEW',
  ],
  EDITORIAL_REVIEW_REQUIRED: [
    'APPROVED_FOR_PUBLICATION',
    'SOURCE_REVIEW_REQUIRED',
    'RETIRED',
    'BLOCKED_REQUIRES_EXECUTIVE_OR_SPECIALIST_REVIEW',
  ],
  APPROVED_FOR_PUBLICATION: [
    'PUBLISHED',
    'SOURCE_REVIEW_REQUIRED',
    'EDITORIAL_REVIEW_REQUIRED',
    'RETIRED',
    'BLOCKED_REQUIRES_EXECUTIVE_OR_SPECIALIST_REVIEW',
  ],
  PUBLISHED: ['FRESHNESS_REVIEW_DUE', 'CORRECTION_REQUIRED', 'RETIRED'],
  FRESHNESS_REVIEW_DUE: [
    'SOURCE_REVIEW_REQUIRED',
    'CORRECTION_REQUIRED',
    'RETIRED',
    'BLOCKED_REQUIRES_EXECUTIVE_OR_SPECIALIST_REVIEW',
  ],
  CORRECTION_REQUIRED: [
    'SOURCE_REVIEW_REQUIRED',
    'EDITORIAL_REVIEW_REQUIRED',
    'RETIRED',
    'BLOCKED_REQUIRES_EXECUTIVE_OR_SPECIALIST_REVIEW',
  ],
  RETIRED: [],
  BLOCKED_REQUIRES_EXECUTIVE_OR_SPECIALIST_REVIEW: [
    'SOURCE_REVIEW_REQUIRED',
    'EDITORIAL_REVIEW_REQUIRED',
    'RETIRED',
  ],
};

export type SundanceEditorialTransitionRequest = {
  from: SundanceEditorialLifecycleState;
  to: SundanceEditorialLifecycleState;
  transitionId: string;
  transitionedAt: string;
  transitionedBy: string;
  reason: string;
};

function populated(value: string | null | undefined): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

function issue(code: SundanceEditorialLifecycleIssueCode, detail: string): SundanceEditorialLifecycleIssue {
  return { code, detail };
}

export function evaluateSundanceEditorialTransition(
  request: SundanceEditorialTransitionRequest,
): readonly SundanceEditorialLifecycleIssue[] {
  const issues: SundanceEditorialLifecycleIssue[] = [];

  if (
    !populated(request.transitionId) ||
    !populated(request.transitionedAt) ||
    !populated(request.transitionedBy) ||
    !populated(request.reason)
  ) {
    issues.push(issue('AUDIT_METADATA_REQUIRED', 'Every lifecycle transition requires an id, timestamp, actor, and reason.'));
  }

  if (request.from === 'RETIRED' && request.to !== 'RETIRED') {
    issues.push(issue('RETIRED_REACTIVATION_FORBIDDEN', 'Retired editorial records cannot be silently reactivated.'));
  }

  if (!SUNDANCE_EDITORIAL_ALLOWED_TRANSITIONS[request.from].includes(request.to)) {
    issues.push(issue('INVALID_TRANSITION', `${request.from} cannot transition directly to ${request.to}.`));
  }

  if (request.from === 'DRAFT' && request.to !== 'SOURCE_REVIEW_REQUIRED') {
    if (request.to === 'EDITORIAL_REVIEW_REQUIRED' || request.to === 'APPROVED_FOR_PUBLICATION' || request.to === 'PUBLISHED') {
      issues.push(issue('SOURCE_REVIEW_BYPASS', 'Draft material cannot bypass source review.'));
    }
  }

  if (
    (request.from === 'DRAFT' || request.from === 'SOURCE_REVIEW_REQUIRED') &&
    (request.to === 'APPROVED_FOR_PUBLICATION' || request.to === 'PUBLISHED')
  ) {
    issues.push(issue('EDITORIAL_REVIEW_BYPASS', 'Publication approval cannot bypass editorial review.'));
  }

  return issues;
}

function hasProhibitedClaim(item: SundanceEditorialLifecycleItem): boolean {
  return item.claimCategories.some((category) => SUNDANCE_EDITORIAL_PROHIBITED_CLAIM_CATEGORIES.includes(category));
}

function hasRequiredAudit(item: SundanceEditorialLifecycleItem): boolean {
  const audit = item.audit;
  if (
    !populated(audit.createdAt) ||
    !populated(audit.createdBy) ||
    !populated(audit.lastTransitionId) ||
    !populated(audit.lastTransitionAt) ||
    !populated(audit.lastTransitionBy) ||
    !populated(audit.lastTransitionReason)
  ) {
    return false;
  }

  if (item.lifecycleState === 'PUBLISHED') {
    return (
      populated(audit.sourceReviewedAt) &&
      populated(audit.editorialReviewedAt) &&
      populated(audit.publicationApprovedAt) &&
      populated(audit.publishedAt)
    );
  }

  if (item.lifecycleState === 'CORRECTION_REQUIRED') return populated(audit.correctionOpenedAt);
  if (item.lifecycleState === 'RETIRED') return populated(audit.retiredAt);
  return true;
}

export function evaluateSundanceEditorialLifecycle(
  item: SundanceEditorialLifecycleItem,
): SundanceEditorialLifecycleEvaluation {
  const issues: SundanceEditorialLifecycleIssue[] = [];
  const isPublished = item.lifecycleState === 'PUBLISHED' && item.publicationState === 'PUBLISHED';
  const publicationAuthorized =
    item.publicationAuthorization.authorized &&
    populated(item.publicationAuthorization.authorizationId) &&
    populated(item.publicationAuthorization.authorizedAt);
  const rightsVerified =
    item.rightsPosture === 'VERIFIED' &&
    item.sourceReferences.length > 0 &&
    item.sourceReferences.every(
      (reference) =>
        reference.rightsPosture === 'VERIFIED' &&
        populated(reference.sourceQualityReference) &&
        populated(reference.rightsReference),
    );
  const freshnessVerified =
    item.freshnessPosture === 'VERIFIED_CURRENT' || item.freshnessPosture === 'DOMAIN_SPECIFIC';
  const sourceBackedTimeSensitive = item.editorialFactualClass === 'SOURCE_BACKED_FACTUAL_CONTEXT';
  const timeBoundsComplete =
    !sourceBackedTimeSensitive ||
    (item.freshnessPosture === 'VERIFIED_CURRENT' &&
      populated(item.effectiveFrom) &&
      populated(item.effectiveTo) &&
      populated(item.verifiedAt) &&
      populated(item.freshnessReviewDue));

  if (item.parentPillar !== SUNDANCE_EDITORIAL_PARENT_PILLAR) {
    issues.push(issue('PARENT_PILLAR_INVALID', 'Editorial records must remain under the Sundance parent pillar.'));
  }

  if (item.sourceReferences.length === 0) {
    issues.push(issue('SOURCE_REFERENCE_REQUIRED', 'Editorial records require explicit source references.'));
  }

  if (!hasRequiredAudit(item)) {
    issues.push(issue('AUDIT_METADATA_REQUIRED', 'The lifecycle state is missing required review or transition audit metadata.'));
  }

  if (hasProhibitedClaim(item)) {
    issues.push(issue('PROHIBITED_CLAIM', 'The record contains a prohibited claim category.'));
  }

  if (item.governedGeographicFact || item.geographicAuthorityState !== 'EDITORIAL_ONLY') {
    issues.push(
      issue(
        'EDITORIAL_GEOGRAPHY_CONVERSION_FORBIDDEN',
        'Editorial lifecycle records cannot become governed geographic facts or factual authority.',
      ),
    );
  }

  if (isPublished && !rightsVerified) {
    issues.push(issue('RIGHTS_NOT_VERIFIED', 'Published material requires verified rights and linked source evidence.'));
  }

  if (isPublished && !freshnessVerified) {
    issues.push(issue('FRESHNESS_NOT_VERIFIED', 'Published material requires a current or domain-specific freshness posture.'));
  }

  if (isPublished && !timeBoundsComplete) {
    issues.push(issue('TIME_BOUNDS_REQUIRED', 'Time-sensitive factual context requires effective and freshness bounds.'));
  }

  if (isPublished && !publicationAuthorized) {
    issues.push(issue('PUBLICATION_AUTHORIZATION_REQUIRED', 'Approval alone is not publication authority.'));
  }

  if (item.lifecycleState !== 'PUBLISHED' && item.publicationState === 'PUBLISHED') {
    issues.push(issue('PUBLICATION_STATE_MISMATCH', 'Only the PUBLISHED lifecycle state can carry published status.'));
  }

  if (item.lifecycleState === 'PUBLISHED' && item.publicationState !== 'PUBLISHED') {
    issues.push(issue('PUBLICATION_STATE_MISMATCH', 'Published lifecycle state requires explicit published status.'));
  }

  if (
    item.lifecycleState === 'FRESHNESS_REVIEW_DUE' ||
    item.lifecycleState === 'CORRECTION_REQUIRED' ||
    item.lifecycleState === 'BLOCKED_REQUIRES_EXECUTIVE_OR_SPECIALIST_REVIEW'
  ) {
    if (item.publicationState !== 'PUBLIC_RELIANCE_SUSPENDED' || item.indexabilityState !== 'FAIL_CLOSED') {
      const code =
        item.lifecycleState === 'CORRECTION_REQUIRED'
          ? 'CORRECTION_REQUIRES_PUBLIC_RELIANCE_SUSPENSION'
          : 'BLOCKED_PUBLICATION_FORBIDDEN';
      issues.push(issue(code, 'Review, correction, and blocked states must suspend public reliance and fail closed.'));
    }
  }

  if (item.lifecycleState === 'RETIRED') {
    if (
      item.retirementState !== 'RETIRED' ||
      item.publicationState !== 'RETIRED' ||
      item.indexabilityState !== 'FAIL_CLOSED'
    ) {
      issues.push(issue('RETIRED_REACTIVATION_FORBIDDEN', 'Retired records must remain retired and fail closed.'));
    }
  }

  const publicEligible =
    issues.length === 0 &&
    isPublished &&
    publicationAuthorized &&
    rightsVerified &&
    freshnessVerified &&
    timeBoundsComplete;
  const indexableEligible = publicEligible && item.indexabilityState === 'INDEXABLE';

  if (item.indexabilityState === 'INDEXABLE' && !indexableEligible) {
    issues.push(
      issue(
        'INDEXABLE_REQUIRES_AUTHORIZED_PUBLICATION',
        'Indexability requires authorized publication with verified rights and freshness.',
      ),
    );
  }

  if (item.sitemapEligible && !indexableEligible) {
    issues.push(
      issue(
        'SITEMAP_NOT_PUBLICATION_AUTHORITY',
        'Sitemap eligibility follows authorized indexability and cannot create publication authority.',
      ),
    );
  }

  return {
    valid: issues.length === 0,
    publicEligible: issues.length === 0 && publicEligible,
    indexableEligible: issues.length === 0 && indexableEligible,
    issues,
  };
}

const BASE_AUDIT: SundanceEditorialAudit = {
  createdAt: '2026-08-18T12:00:00.000Z',
  createdBy: 'PROJECT_ATLAS_EDITORIAL',
  lastTransitionId: 'TRANSITION-ABSTRACT-001',
  lastTransitionAt: '2026-08-18T12:00:00.000Z',
  lastTransitionBy: 'PROJECT_ATLAS_EDITORIAL',
  lastTransitionReason: 'Deterministic abstract lifecycle fixture.',
  sourceReviewedAt: null,
  editorialReviewedAt: null,
  publicationApprovedAt: null,
  publishedAt: null,
  correctionOpenedAt: null,
  retiredAt: null,
};

const BASE_SOURCE_REFERENCE: SundanceEditorialSourceReference = {
  sourceId: 'EDITORIAL-SUNDANCE-ABSTRACT-SOURCE',
  sourceType: 'EDITORIAL_RECORD',
  rightsPosture: 'UNKNOWN',
  freshnessPosture: 'UNKNOWN',
  sourceQualityReference: null,
  rightsReference: null,
};

const BASE_ITEM: SundanceEditorialLifecycleItem = {
  stableId: 'SUNDANCE-EDITORIAL-ABSTRACT',
  topic: 'Abstract editorial orientation',
  customerQuestion: 'What durable orientation should be verified before relying on temporary information?',
  title: 'Abstract Sundance orientation record',
  slug: 'abstract-sundance-orientation-record',
  canonicalUrl: '/sundance-film-festival/abstract-sundance-orientation-record',
  editorialFactualClass: 'EDITORIAL_ORIENTATION',
  parentPillar: SUNDANCE_EDITORIAL_PARENT_PILLAR,
  cluster: 'PLACE_GEOGRAPHY',
  aeoRole: 'ORIENTATION_ANSWER',
  claimSummary: 'Abstract orientation only; no live event or property conclusion.',
  claimCategories: ['ORIENTATION'],
  sourceReferences: [BASE_SOURCE_REFERENCE],
  sourceType: 'EDITORIAL_RECORD',
  rightsPosture: 'UNKNOWN',
  freshnessPosture: 'UNKNOWN',
  effectiveFrom: null,
  effectiveTo: null,
  verifiedAt: null,
  freshnessReviewDue: null,
  reviewOwner: 'PROJECT_ATLAS_SOURCE_REVIEW',
  editorialOwner: 'PROJECT_ATLAS_EDITORIAL',
  specialistReviewer: null,
  correctionState: 'NONE',
  retirementState: 'ACTIVE',
  publicLimitationText: 'No live schedules, ticketing, booking, lodging inventory, market impact, yield, or property guidance.',
  lifecycleState: 'DRAFT',
  publicationState: 'NOT_PUBLISHED',
  indexabilityState: 'UNPUBLISHED',
  publicationAuthorization: { authorized: false, authorizationId: null, authorizedAt: null },
  geographicAuthorityState: 'EDITORIAL_ONLY',
  governedGeographicFact: false,
  sitemapEligible: false,
  audit: BASE_AUDIT,
};

const VERIFIED_SOURCE_REFERENCE: SundanceEditorialSourceReference = {
  ...BASE_SOURCE_REFERENCE,
  rightsPosture: 'VERIFIED',
  freshnessPosture: 'DOMAIN_SPECIFIC',
  sourceQualityReference: 'SOURCE-QUALITY-ABSTRACT-001',
  rightsReference: 'RIGHTS-ABSTRACT-001',
};

export const SUNDANCE_EDITORIAL_LIFECYCLE_FIXTURES = {
  orientationDurable: {
    ...BASE_ITEM,
    stableId: 'SUNDANCE-EDITORIAL-ORIENTATION-DURABLE',
    slug: 'orientation-durable',
    canonicalUrl: '/sundance-film-festival/orientation-durable',
    sourceReferences: [VERIFIED_SOURCE_REFERENCE],
    rightsPosture: 'VERIFIED',
    freshnessPosture: 'DOMAIN_SPECIFIC',
    verifiedAt: '2026-08-18T12:30:00.000Z',
    freshnessReviewDue: '2027-08-18T12:30:00.000Z',
    lifecycleState: 'PUBLISHED',
    publicationState: 'PUBLISHED',
    indexabilityState: 'INDEXABLE',
    publicationAuthorization: {
      authorized: true,
      authorizationId: 'PUBLICATION-AUTH-ABSTRACT-001',
      authorizedAt: '2026-08-18T13:00:00.000Z',
    },
    sitemapEligible: true,
    audit: {
      ...BASE_AUDIT,
      sourceReviewedAt: '2026-08-18T12:15:00.000Z',
      editorialReviewedAt: '2026-08-18T12:30:00.000Z',
      publicationApprovedAt: '2026-08-18T12:45:00.000Z',
      publishedAt: '2026-08-18T13:00:00.000Z',
    },
  },
  sourceReviewRequired: {
    ...BASE_ITEM,
    stableId: 'SUNDANCE-EDITORIAL-SOURCE-REVIEW-REQUIRED',
    slug: 'source-review-required',
    canonicalUrl: '/sundance-film-festival/source-review-required',
    lifecycleState: 'SOURCE_REVIEW_REQUIRED',
  },
  freshnessReviewDue: {
    ...BASE_ITEM,
    stableId: 'SUNDANCE-EDITORIAL-FRESHNESS-REVIEW-DUE',
    slug: 'freshness-review-due',
    canonicalUrl: '/sundance-film-festival/freshness-review-due',
    sourceReferences: [{ ...VERIFIED_SOURCE_REFERENCE, freshnessPosture: 'STALE_VERIFICATION' }],
    rightsPosture: 'VERIFIED',
    freshnessPosture: 'STALE_VERIFICATION',
    lifecycleState: 'FRESHNESS_REVIEW_DUE',
    publicationState: 'PUBLIC_RELIANCE_SUSPENDED',
    indexabilityState: 'FAIL_CLOSED',
  },
  correctionRequired: {
    ...BASE_ITEM,
    stableId: 'SUNDANCE-EDITORIAL-CORRECTION-REQUIRED',
    slug: 'correction-required',
    canonicalUrl: '/sundance-film-festival/correction-required',
    correctionState: 'OPEN',
    lifecycleState: 'CORRECTION_REQUIRED',
    publicationState: 'PUBLIC_RELIANCE_SUSPENDED',
    indexabilityState: 'FAIL_CLOSED',
    audit: { ...BASE_AUDIT, correctionOpenedAt: '2026-08-18T14:00:00.000Z' },
  },
  retired: {
    ...BASE_ITEM,
    stableId: 'SUNDANCE-EDITORIAL-RETIRED',
    slug: 'retired',
    canonicalUrl: '/sundance-film-festival/retired',
    retirementState: 'RETIRED',
    lifecycleState: 'RETIRED',
    publicationState: 'RETIRED',
    indexabilityState: 'FAIL_CLOSED',
    audit: { ...BASE_AUDIT, retiredAt: '2026-08-18T14:30:00.000Z' },
  },
  blockedProhibitedClaim: {
    ...BASE_ITEM,
    stableId: 'SUNDANCE-EDITORIAL-BLOCKED-PROHIBITED-CLAIM',
    slug: 'blocked-prohibited-claim',
    canonicalUrl: '/sundance-film-festival/blocked-prohibited-claim',
    claimSummary: 'Abstract prohibited commercial conclusion.',
    claimCategories: ['YIELD'],
    specialistReviewer: 'PROJECT_ATLAS_SPECIALIST_REVIEW',
    lifecycleState: 'BLOCKED_REQUIRES_EXECUTIVE_OR_SPECIALIST_REVIEW',
    publicationState: 'PUBLIC_RELIANCE_SUSPENDED',
    indexabilityState: 'FAIL_CLOSED',
  },
} as const satisfies Record<string, SundanceEditorialLifecycleItem>;
