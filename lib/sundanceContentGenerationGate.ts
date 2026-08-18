import { evaluateSundanceArticleArchitecture, getSundanceArchitectureLifecycleItem, type SundanceArticleArchitectureCandidate, type SundanceArticleArchitectureRecord } from './sundanceArticleArchitecture';
import { evaluateSundanceEditorialLifecycle } from './sundanceEditorialLifecycle';
import { hasOnlySundanceSourceLockedInput, type SundanceSourceLockedDraftInput } from './sundanceSourceLockedDraftInput';

export const SUNDANCE_CONTENT_GENERATION_GATE_STATUS = 'IMPLEMENTED_NOT_ACTIVATED' as const;
export const SUNDANCE_AI_GENERATION_AUTHORIZATION = 'AI_GENERATION_NOT_AUTHORIZED' as const;
export const SUNDANCE_CONTENT_GENERATION_PREREQUISITES = [
  'TOPIC_APPROVED', 'CUSTOMER_QUESTION_DEFINED', 'CLUSTER_ASSIGNED', 'PILLAR_RELATION_CONFIRMED',
  'LIFECYCLE_ITEM_BOUND', 'SOURCE_SET_APPROVED', 'RIGHTS_APPROVED', 'FRESHNESS_WINDOW_DEFINED',
  'CLAIM_BOUNDARY_DEFINED', 'EDITORIAL_CLASS_DEFINED', 'PROFESSIONAL_ESCALATION_DEFINED',
  'PROHIBITED_CLAIM_SCAN_PASS', 'AEO_ROLE_DEFINED', 'HUMAN_REVIEW_REQUIRED',
] as const;
export type SundanceContentGenerationEligibility =
  | 'NOT_ELIGIBLE' | 'SOURCE_REVIEW_REQUIRED' | 'RIGHTS_REVIEW_REQUIRED'
  | 'FRESHNESS_REVIEW_REQUIRED' | 'CLAIM_BOUNDARY_REQUIRED' | 'SPECIALIST_REVIEW_REQUIRED'
  | 'EDITORIAL_OWNER_REQUIRED' | 'READY_FOR_HUMAN_DRAFT_PREPARATION'
  | 'READY_FOR_SEPARATELY_AUTHORIZED_AI_ASSISTED_DRAFT_PREPARATION';
export type SundanceContentGenerationGateCandidate = SundanceArticleArchitectureCandidate & {
  topicApproved: boolean; editorialClassDefined: boolean; humanReviewRequired: boolean;
  specialistReviewComplete: boolean; aiGenerationRequested: boolean;
  draftInput: readonly { category: string; value: string }[];
};
export type SundanceContentGenerationGateEvaluation = Readonly<{
  eligibility: SundanceContentGenerationEligibility; aiGenerationAuthorized: false;
  createsArticleBody: false; createsRoute: false; createsPublication: false;
  createsIndexability: false; createsSitemapMembership: false; reasons: readonly string[];
}>;

export function evaluateSundanceContentGenerationGate(candidate: SundanceContentGenerationGateCandidate): SundanceContentGenerationGateEvaluation {
  const reasons: string[] = [];
  const architecture = evaluateSundanceArticleArchitecture(candidate);
  const lifecycle = getSundanceArchitectureLifecycleItem(candidate.lifecycleItemId);
  if (!architecture.valid) reasons.push('ARTICLE_ARCHITECTURE_INVALID');
  if (!candidate.topicApproved || !candidate.customerQuestion.trim() || !candidate.editorialClassDefined || !candidate.humanReviewRequired) reasons.push('EDITORIAL_PREREQUISITE_REQUIRED');
  if (!lifecycle || !evaluateSundanceEditorialLifecycle(lifecycle).valid) reasons.push('LIFECYCLE_REVIEW_REQUIRED');
  if (!hasOnlySundanceSourceLockedInput(candidate.draftInput)) reasons.push('SOURCE_LOCKED_INPUT_REQUIRED');
  if (candidate.claimBoundary.prohibitedClaimPresent) reasons.push('PROHIBITED_CLAIM');
  if (lifecycle?.specialistReviewer && !candidate.specialistReviewComplete) reasons.push('SPECIALIST_REVIEW_REQUIRED');
  const sourceIssue = architecture.issues.some((item) => item.code === 'SOURCE_POSTURE_INCOMPATIBLE');
  const freshnessIssue = architecture.issues.some((item) => item.code === 'TIME_BOUND_FRESHNESS_REQUIRED');
  let eligibility: SundanceContentGenerationEligibility = 'READY_FOR_HUMAN_DRAFT_PREPARATION';
  if (sourceIssue) eligibility = 'RIGHTS_REVIEW_REQUIRED';
  else if (freshnessIssue) eligibility = 'FRESHNESS_REVIEW_REQUIRED';
  else if (architecture.issues.some((item) => item.code === 'PROHIBITED_CLAIM')) eligibility = 'CLAIM_BOUNDARY_REQUIRED';
  else if (reasons.includes('SPECIALIST_REVIEW_REQUIRED')) eligibility = 'SPECIALIST_REVIEW_REQUIRED';
  else if (reasons.length > 0) eligibility = 'NOT_ELIGIBLE';
  if (candidate.aiGenerationRequested) reasons.push(SUNDANCE_AI_GENERATION_AUTHORIZATION);
  return { eligibility, aiGenerationAuthorized: false, createsArticleBody: false, createsRoute: false, createsPublication: false, createsIndexability: false, createsSitemapMembership: false, reasons };
}
