export const EPARB_GOVERNANCE_CONTRACT_VERSION = 'EPARB-1.0';

export type EparbAuthorityAction =
  | 'REVIEW'
  | 'RECOMMEND'
  | 'APPROVE_ARCHITECTURE_FOR_EXECUTIVE_AUTHORIZATION'
  | 'REJECT_UNSAFE_OR_DUPLICATIVE_PLATFORM_DIRECTION'
  | 'REQUIRE_READINESS_GATES'
  | 'REQUIRE_REMEDIATION_PLANS'
  | 'ESTABLISH_SHARED_STANDARDS';

export type EparbProhibitedAction =
  | 'INDEPENDENTLY_AUTHORIZE_PRODUCTION_MUTATION'
  | 'INDEPENDENTLY_ACTIVATE_PROVIDERS'
  | 'BYPASS_EXECUTIVE_AUTHORIZATION'
  | 'IMPLEMENT_RUNTIME_CHANGES_AUTOMATICALLY'
  | 'BYPASS_EXISTING_PROGRAM_GOVERNANCE';

export type EparbGuidingPrinciple =
  | 'ENTERPRISE_BEFORE_PROGRAM'
  | 'GOVERNANCE_BEFORE_AUTOMATION'
  | 'REUSE_BEFORE_REINVENTION'
  | 'EVIDENCE_BEFORE_INTELLIGENCE'
  | 'SECURITY_BY_DEFAULT'
  | 'PLATFORM_CONSISTENCY'
  | 'LONG_TERM_STEWARDSHIP'
  | 'FAIL_CLOSED'
  | 'LEAST_PRIVILEGE'
  | 'HUMAN_ACCOUNTABILITY';

export type EparbReviewTrigger =
  | 'SHARED_AUTHENTICATION'
  | 'SHARED_AUTHORIZATION'
  | 'ADMIN_ACCESS'
  | 'MIDDLEWARE'
  | 'SHARED_APIS'
  | 'PLATFORM_SERVICES'
  | 'OBSERVABILITY'
  | 'CONFIGURATION'
  | 'FEATURE_ACTIVATION'
  | 'EXECUTIVE_DASHBOARDS'
  | 'REPOSITORY_PLATFORM_CHANGES'
  | 'CROSS_DOMAIN_DATA_CONTRACTS'
  | 'CROSS_PROGRAM_DEPENDENCIES';

export type EparbStandardReviewQuestion =
  | 'OWNERSHIP'
  | 'REUSE'
  | 'COUPLING'
  | 'GOVERNANCE'
  | 'SECURITY'
  | 'SIMPLICITY'
  | 'LONGEVITY'
  | 'OPERATIONAL_IMPACT'
  | 'CUSTOMER_IMPACT'
  | 'REVERSIBILITY'
  | 'DEPENDENCY_RISK'
  | 'EVIDENCE_QUALITY';

export type EparbDecisionOutcome =
  | 'APPROVE_FOR_EXECUTIVE_AUTHORIZATION'
  | 'APPROVE_WITH_CONDITIONS'
  | 'DEFER_PENDING_EVIDENCE'
  | 'REQUIRE_REMEDIATION'
  | 'REJECT'
  | 'OUT_OF_SCOPE';

export type EparbLifecycleStage =
  | 'CONCERN_IDENTIFIED'
  | 'ARCHITECTURE_REVIEW'
  | 'EPARB_REVIEW'
  | 'EXECUTIVE_AUTHORIZATION'
  | 'CONTROLLED_IMPLEMENTATION'
  | 'PRODUCTION_CERTIFICATION'
  | 'STRATEGIC_COMPLETION_REVIEW';

export type EparbReviewPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type EparbReviewPortfolioItem = {
  id: string;
  title: string;
  priority: EparbReviewPriority;
  scope: string;
  recommendedNext: boolean;
  implementationAuthorized: false;
};

export type EparbGovernanceContract = {
  version: typeof EPARB_GOVERNANCE_CONTRACT_VERSION;
  mission: string;
  scope: string[];
  authority: {
    permitted: EparbAuthorityAction[];
    prohibited: EparbProhibitedAction[];
    finalExecutiveAuthorizationRetainedBy: 'DAVID';
    productionMutationAuthorized: false;
    providerActivationAuthorized: false;
    runtimeImplementationAuthorized: false;
  };
  guidingPrinciples: EparbGuidingPrinciple[];
  reviewTriggers: EparbReviewTrigger[];
  standardReviewQuestions: EparbStandardReviewQuestion[];
  decisionOutcomes: EparbDecisionOutcome[];
  lifecycle: EparbLifecycleStage[];
  initialReviewPortfolio: EparbReviewPortfolioItem[];
};

export type EparbGovernanceValidationResult = {
  valid: boolean;
  issues: string[];
};

export const eparbAuthorityActions: EparbAuthorityAction[] = [
  'REVIEW',
  'RECOMMEND',
  'APPROVE_ARCHITECTURE_FOR_EXECUTIVE_AUTHORIZATION',
  'REJECT_UNSAFE_OR_DUPLICATIVE_PLATFORM_DIRECTION',
  'REQUIRE_READINESS_GATES',
  'REQUIRE_REMEDIATION_PLANS',
  'ESTABLISH_SHARED_STANDARDS',
];

export const eparbProhibitedActions: EparbProhibitedAction[] = [
  'INDEPENDENTLY_AUTHORIZE_PRODUCTION_MUTATION',
  'INDEPENDENTLY_ACTIVATE_PROVIDERS',
  'BYPASS_EXECUTIVE_AUTHORIZATION',
  'IMPLEMENT_RUNTIME_CHANGES_AUTOMATICALLY',
  'BYPASS_EXISTING_PROGRAM_GOVERNANCE',
];

export const eparbGuidingPrinciples: EparbGuidingPrinciple[] = [
  'ENTERPRISE_BEFORE_PROGRAM',
  'GOVERNANCE_BEFORE_AUTOMATION',
  'REUSE_BEFORE_REINVENTION',
  'EVIDENCE_BEFORE_INTELLIGENCE',
  'SECURITY_BY_DEFAULT',
  'PLATFORM_CONSISTENCY',
  'LONG_TERM_STEWARDSHIP',
  'FAIL_CLOSED',
  'LEAST_PRIVILEGE',
  'HUMAN_ACCOUNTABILITY',
];

export const eparbReviewTriggers: EparbReviewTrigger[] = [
  'SHARED_AUTHENTICATION',
  'SHARED_AUTHORIZATION',
  'ADMIN_ACCESS',
  'MIDDLEWARE',
  'SHARED_APIS',
  'PLATFORM_SERVICES',
  'OBSERVABILITY',
  'CONFIGURATION',
  'FEATURE_ACTIVATION',
  'EXECUTIVE_DASHBOARDS',
  'REPOSITORY_PLATFORM_CHANGES',
  'CROSS_DOMAIN_DATA_CONTRACTS',
  'CROSS_PROGRAM_DEPENDENCIES',
];

export const eparbStandardReviewQuestions: EparbStandardReviewQuestion[] = [
  'OWNERSHIP',
  'REUSE',
  'COUPLING',
  'GOVERNANCE',
  'SECURITY',
  'SIMPLICITY',
  'LONGEVITY',
  'OPERATIONAL_IMPACT',
  'CUSTOMER_IMPACT',
  'REVERSIBILITY',
  'DEPENDENCY_RISK',
  'EVIDENCE_QUALITY',
];

export const eparbDecisionOutcomes: EparbDecisionOutcome[] = [
  'APPROVE_FOR_EXECUTIVE_AUTHORIZATION',
  'APPROVE_WITH_CONDITIONS',
  'DEFER_PENDING_EVIDENCE',
  'REQUIRE_REMEDIATION',
  'REJECT',
  'OUT_OF_SCOPE',
];

export const eparbLifecycle: EparbLifecycleStage[] = [
  'CONCERN_IDENTIFIED',
  'ARCHITECTURE_REVIEW',
  'EPARB_REVIEW',
  'EXECUTIVE_AUTHORIZATION',
  'CONTROLLED_IMPLEMENTATION',
  'PRODUCTION_CERTIFICATION',
  'STRATEGIC_COMPLETION_REVIEW',
];

export const eparbInitialReviewPortfolio: EparbReviewPortfolioItem[] = [
  review('EPARB-REVIEW-001', 'Enterprise Administrative Authentication and Access Architecture', 'CRITICAL', 'Shared administrative authentication, authorization, access boundaries, session posture, and protected admin entry points.', true),
  review('EPARB-REVIEW-002', 'Enterprise Executive Workspace', 'HIGH', 'Shared executive workspace architecture across governance, intelligence, reporting, and administrative review surfaces.', false),
  review('EPARB-REVIEW-003', 'Enterprise Dashboard Framework', 'HIGH', 'Shared dashboard presentation, evidence labeling, confidence and freshness display, protected routes, and reusable dashboard conventions.', false),
  review('EPARB-REVIEW-004', 'Enterprise Repository Platform', 'HIGH', 'Repository platform governance, traceability, stewardship, safety scripts, and cross-program repository-level standards.', false),
  review('EPARB-REVIEW-005', 'Enterprise Observability', 'MEDIUM', 'Readiness for observability, health evidence, logging boundaries, and no-telemetry activation governance.', false),
  review('EPARB-REVIEW-006', 'Enterprise Configuration and Feature Activation', 'MEDIUM', 'Configuration, feature activation, environment boundaries, kill switches, and executive authorization gates.', false),
];

export function buildEparbGovernanceContract(): EparbGovernanceContract {
  return {
    version: EPARB_GOVERNANCE_CONTRACT_VERSION,
    mission: 'Protect the long-term architectural integrity of PROJECT ATLAS.',
    scope: [
      'Cross-program platform architecture',
      'Shared authentication and authorization architecture',
      'Administrative access and middleware architecture',
      'Enterprise APIs and protected admin services',
      'Executive workspaces and dashboard frameworks',
      'Observability, configuration, and feature activation governance',
      'Repository governance and shared platform service standards',
    ],
    authority: {
      permitted: eparbAuthorityActions,
      prohibited: eparbProhibitedActions,
      finalExecutiveAuthorizationRetainedBy: 'DAVID',
      productionMutationAuthorized: false,
      providerActivationAuthorized: false,
      runtimeImplementationAuthorized: false,
    },
    guidingPrinciples: eparbGuidingPrinciples,
    reviewTriggers: eparbReviewTriggers,
    standardReviewQuestions: eparbStandardReviewQuestions,
    decisionOutcomes: eparbDecisionOutcomes,
    lifecycle: eparbLifecycle,
    initialReviewPortfolio: eparbInitialReviewPortfolio,
  };
}

export function validateEparbGovernanceContract(
  contract: EparbGovernanceContract = buildEparbGovernanceContract(),
): EparbGovernanceValidationResult {
  const issues: string[] = [];

  if (!contract.mission.includes('long-term architectural integrity')) {
    issues.push('EPARB mission must protect long-term architectural integrity.');
  }

  for (const action of eparbAuthorityActions) {
    if (!contract.authority.permitted.includes(action)) issues.push(`Missing permitted authority ${action}.`);
  }

  for (const action of eparbProhibitedActions) {
    if (!contract.authority.prohibited.includes(action)) issues.push(`Missing prohibited authority ${action}.`);
  }

  if (contract.authority.finalExecutiveAuthorizationRetainedBy !== 'DAVID') {
    issues.push('David must retain final executive authorization.');
  }
  if (contract.authority.productionMutationAuthorized !== false) {
    issues.push('EPARB must not authorize production mutation.');
  }
  if (contract.authority.providerActivationAuthorized !== false) {
    issues.push('EPARB must not authorize provider activation.');
  }
  if (contract.authority.runtimeImplementationAuthorized !== false) {
    issues.push('EPARB must not authorize runtime implementation.');
  }

  for (const principle of eparbGuidingPrinciples) {
    if (!contract.guidingPrinciples.includes(principle)) issues.push(`Missing guiding principle ${principle}.`);
  }
  for (const trigger of eparbReviewTriggers) {
    if (!contract.reviewTriggers.includes(trigger)) issues.push(`Missing review trigger ${trigger}.`);
  }
  for (const question of eparbStandardReviewQuestions) {
    if (!contract.standardReviewQuestions.includes(question)) issues.push(`Missing standard review question ${question}.`);
  }
  for (const outcome of eparbDecisionOutcomes) {
    if (!contract.decisionOutcomes.includes(outcome)) issues.push(`Missing decision outcome ${outcome}.`);
  }
  for (const stage of eparbLifecycle) {
    if (!contract.lifecycle.includes(stage)) issues.push(`Missing lifecycle stage ${stage}.`);
  }

  if (contract.initialReviewPortfolio.length !== 6) {
    issues.push('Initial EPARB review portfolio must contain six reviews.');
  }

  const review1 = contract.initialReviewPortfolio.find((item) => item.id === 'EPARB-REVIEW-001');
  if (!review1) {
    issues.push('Initial EPARB Review 1 is missing.');
  } else {
    if (review1.priority !== 'CRITICAL') issues.push('Initial EPARB Review 1 must be CRITICAL.');
    if (!review1.recommendedNext) issues.push('Initial EPARB Review 1 must be the next recommended review.');
  }

  for (const item of contract.initialReviewPortfolio) {
    if (!item.id || !item.title || !item.scope) issues.push(`Review portfolio item ${item.id || 'UNKNOWN'} is incomplete.`);
    if (item.implementationAuthorized !== false) issues.push(`Review portfolio item ${item.id} must not authorize implementation.`);
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

function review(
  id: string,
  title: string,
  priority: EparbReviewPriority,
  scope: string,
  recommendedNext: boolean,
): EparbReviewPortfolioItem {
  return {
    id,
    title,
    priority,
    scope,
    recommendedNext,
    implementationAuthorized: false,
  };
}
