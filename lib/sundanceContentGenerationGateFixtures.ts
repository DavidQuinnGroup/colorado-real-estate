import { SUNDANCE_ARTICLE_ARCHITECTURE_FIXTURES } from './sundanceArticleArchitectureFixtures';
import { buildSundanceSourceLockedDraftInput } from './sundanceSourceLockedDraftInput';
import type { SundanceContentGenerationGateCandidate } from './sundanceContentGenerationGate';
import { SUNDANCE_EDITORIAL_LIFECYCLE_FIXTURES } from './sundanceEditorialLifecycle';

const base = SUNDANCE_ARTICLE_ARCHITECTURE_FIXTURES.placeGeography;
const ready = (): SundanceContentGenerationGateCandidate => ({ ...base, topicApproved: true, editorialClassDefined: true, humanReviewRequired: true, specialistReviewComplete: true, aiGenerationRequested: false, draftInput: buildSundanceSourceLockedDraftInput(base) });
export const SUNDANCE_CONTENT_GENERATION_GATE_FIXTURES = {
  humanDraftReady: ready(),
  unknownRights: { ...ready(), sourceReferences: [{ ...base.sourceReferences[0], rightsPosture: 'UNKNOWN' as const }] },
  staleSource: { ...ready(), sourceReferences: [{ ...base.sourceReferences[0], freshnessPosture: 'STALE_VERIFICATION' as const }] },
  missingClaimBoundary: { ...ready(), claimBoundary: { ...base.claimBoundary, prohibitedClaimPresent: true } },
  specialistReviewRequired: { ...ready(), lifecycleItemId: SUNDANCE_EDITORIAL_LIFECYCLE_FIXTURES.blockedProhibitedClaim.stableId, specialistReviewComplete: false },
  prohibitedClaim: { ...ready(), claimBoundary: { ...base.claimBoundary, prohibitedClaimPresent: true } },
  unsourcedInputExpansion: { ...ready(), draftInput: [...buildSundanceSourceLockedDraftInput(base), { category: 'GENERAL_MODEL_MEMORY', value: 'blocked' }] },
  aiGenerationAttempt: { ...ready(), aiGenerationRequested: true },
  publicationEffectAttempt: { ...ready(), publicationEffect: 'PUBLISHED' as unknown as 'NONE' },
  routeEffectAttempt: { ...ready(), effects: { ...base.effects, createsRoute: true } },
  sitemapEffectAttempt: { ...ready(), effects: { ...base.effects, createsSitemapMembership: true } },
} as const;
