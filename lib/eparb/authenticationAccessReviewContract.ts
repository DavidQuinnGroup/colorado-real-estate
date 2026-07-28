export const EPARB_AUTHENTICATION_ACCESS_REVIEW_VERSION = 'EPARB-REVIEW-001';

export type EparbAuthMethodId =
  | 'ADMIN_HEADER_KEY'
  | 'ADMIN_BEARER_KEY'
  | 'ADMIN_COOKIE_KEY'
  | 'QUERY_STRING_ADMIN_KEY'
  | 'PRODUCTION_BROWSER_SESSION'
  | 'SERVICE_BEARER_TOKEN'
  | 'DEVELOPMENT_NO_KEY_FALLBACK';

export type EparbIdentityClass = 'HUMAN_ADMINISTRATOR' | 'MACHINE_CLIENT' | 'SERVICE_ACCOUNT' | 'DEVELOPMENT_OPERATOR';

export type EparbAccessModelId =
  | 'MODEL_A_API_KEYS_FOR_PAGES_AND_APIS'
  | 'MODEL_B_HUMAN_SESSIONS_FOR_PAGES_API_KEYS_FOR_MACHINES'
  | 'MODEL_C_UNIFIED_IDP_AND_RBAC'
  | 'MODEL_D_EXISTING_FRAMEWORK_EXTENSION'
  | 'MODEL_E_REPOSITORY_SUPPORTED_HYBRID';

export type EparbAuthRecommendation =
  | 'RECOMMENDED'
  | 'CONDITIONALLY_ACCEPTABLE'
  | 'NOT_RECOMMENDED'
  | 'DEFERRED';

export type EparbAuthCriterion =
  | 'security'
  | 'humanAdministratorUsability'
  | 'machineClientSuitability'
  | 'leastPrivilege'
  | 'auditability'
  | 'architectureReuse'
  | 'migrationSafety'
  | 'operationalSimplicity'
  | 'productionRisk'
  | 'longTermEnterpriseValue'
  | 'reversibility'
  | 'implementationEffort';

export type EparbAuthMethodInventoryItem = {
  id: EparbAuthMethodId;
  currentEvidence: string[];
  intendedIdentity: EparbIdentityClass[];
  currentPosture: string;
  recommendedDisposition: string;
};

export type EparbProtectedSurface = {
  routePattern: string;
  surfaceType: 'BROWSER_PAGE' | 'ADMIN_API' | 'MUTATION_API' | 'SERVICE_API';
  currentProtection: string;
  recommendedIdentityLayer: 'HUMAN_SESSION' | 'MACHINE_CREDENTIAL' | 'SERVICE_CREDENTIAL' | 'PUBLIC_OR_SEPARATE_REVIEW';
};

export type EparbRoleDefinition = {
  role: string;
  purpose: string;
  permissions: string[];
};

export type EparbAccessModelScore = {
  model: EparbAccessModelId;
  recommendation: EparbAuthRecommendation;
  scores: Record<EparbAuthCriterion, number>;
  rationale: string;
};

export type EparbAuthenticationAccessReview = {
  version: typeof EPARB_AUTHENTICATION_ACCESS_REVIEW_VERSION;
  governedIdentifier: 'EPARB-REVIEW-001_ENTERPRISE_ADMINISTRATIVE_AUTHENTICATION_AND_ACCESS_ARCHITECTURE_REVIEW';
  status: 'COMPLETE_IMPLEMENTATION_NOT_AUTHORIZED';
  triggeredBy: string;
  currentMethods: EparbAuthMethodInventoryItem[];
  protectedSurfaces: EparbProtectedSurface[];
  roles: EparbRoleDefinition[];
  criteriaWeights: Record<EparbAuthCriterion, number>;
  candidateModels: EparbAccessModelScore[];
  recommendation: {
    selectedModel: EparbAccessModelId;
    summary: string;
    minimumSafeImplementation: string;
    eoiSprint3ResolutionPath: string;
    authenticationAuthorizationSeparationRequired: true;
    finalExecutiveAuthorizationRetainedBy: 'DAVID';
    implementationAuthorized: false;
    middlewareChangeAuthorized: false;
    credentialChangeAuthorized: false;
    productionMutationAuthorized: false;
  };
};

export type EparbAuthenticationAccessReviewValidationResult = {
  valid: boolean;
  issues: string[];
};

export const eparbAuthenticationReviewCriteria: EparbAuthCriterion[] = [
  'security',
  'humanAdministratorUsability',
  'machineClientSuitability',
  'leastPrivilege',
  'auditability',
  'architectureReuse',
  'migrationSafety',
  'operationalSimplicity',
  'productionRisk',
  'longTermEnterpriseValue',
  'reversibility',
  'implementationEffort',
];

export const eparbAuthenticationReviewWeights: Record<EparbAuthCriterion, number> = {
  security: 15,
  humanAdministratorUsability: 10,
  machineClientSuitability: 8,
  leastPrivilege: 10,
  auditability: 10,
  architectureReuse: 8,
  migrationSafety: 8,
  operationalSimplicity: 7,
  productionRisk: 9,
  longTermEnterpriseValue: 10,
  reversibility: 3,
  implementationEffort: 2,
};

export function buildEparbAuthenticationAccessReview(): EparbAuthenticationAccessReview {
  return {
    version: EPARB_AUTHENTICATION_ACCESS_REVIEW_VERSION,
    governedIdentifier: 'EPARB-REVIEW-001_ENTERPRISE_ADMINISTRATIVE_AUTHENTICATION_AND_ACCESS_ARCHITECTURE_REVIEW',
    status: 'COMPLETE_IMPLEMENTATION_NOT_AUTHORIZED',
    triggeredBy: 'EOI Sprint 3 production certification was blocked because protected browser dashboard evidence required administrative access and no usable authenticated human browser session was available.',
    currentMethods: [
      method('ADMIN_HEADER_KEY', ['middleware.ts', 'app/api/admin/repository/auth.ts', 'admin route safety scripts'], ['MACHINE_CLIENT', 'DEVELOPMENT_OPERATOR'], 'Accepted through x-admin-key for protected admin routes and several operational APIs.', 'Retain for machine/API access only; do not use as the canonical human browser model.'),
      method('ADMIN_BEARER_KEY', ['middleware.ts', 'app/api/admin/repository/auth.ts', 'admin route safety scripts'], ['MACHINE_CLIENT', 'SERVICE_ACCOUNT'], 'Accepted through Authorization: Bearer for protected admin routes and APIs.', 'Retain for machine/API access with rotation and scoping governance.'),
      method('ADMIN_COOKIE_KEY', ['middleware.ts', 'app/api/admin/repository/auth.ts'], ['HUMAN_ADMINISTRATOR'], 'Cookie value reuses the same admin key and is checked by middleware.', 'Replace with a governed human session model before protected browser surfaces expand.'),
      method('QUERY_STRING_ADMIN_KEY', ['No active repository evidence found in middleware or repository auth helper.'], ['DEVELOPMENT_OPERATOR'], 'Not a supported canonical mechanism for protected admin routes.', 'Reject for future administrative access because URL secrets leak through logs, history, and referrers.'),
      method('PRODUCTION_BROWSER_SESSION', ['EOI Sprint 3 certification blocker records no usable authenticated human browser session.'], ['HUMAN_ADMINISTRATOR'], 'Not implemented as a canonical repository-wide human admin identity model.', 'Adopt as the target page-authentication model after separate implementation authorization.'),
      method('SERVICE_BEARER_TOKEN', ['lib/mls/mlsGridClient.ts', 'app/api/mls/status/route.ts', 'lib/ai/generateSellerMessage.ts'], ['SERVICE_ACCOUNT'], 'Used for external service integration contexts outside human admin browser access.', 'Keep separate from administrative human sessions and scope by service.'),
      method('DEVELOPMENT_NO_KEY_FALLBACK', ['middleware.ts', 'app/api/admin/repository/auth.ts'], ['DEVELOPMENT_OPERATOR'], 'Admin routes can pass without a configured key outside production.', 'Preserve only as a local-development fail-safe; production must fail closed.'),
    ],
    protectedSurfaces: [
      surface('/admin', 'BROWSER_PAGE', 'Protected by middleware matcher.', 'HUMAN_SESSION'),
      surface('/admin/repository/:path*', 'BROWSER_PAGE', 'Protected by middleware matcher.', 'HUMAN_SESSION'),
      surface('/admin/repository/executive-operations-dashboard', 'BROWSER_PAGE', 'Protected by middleware; current human evidence is blocked without a usable browser session.', 'HUMAN_SESSION'),
      surface('/api/admin/:path*', 'ADMIN_API', 'Protected by middleware and many route-local helper checks.', 'MACHINE_CREDENTIAL'),
      surface('/api/admin/toggle-access', 'MUTATION_API', 'Protected by middleware and route-local helper; performs user access mutation when authorized.', 'HUMAN_SESSION'),
      surface('/api/process-alerts', 'SERVICE_API', 'Route-local admin key protection outside /api/admin matcher.', 'MACHINE_CREDENTIAL'),
      surface('/api/mls/status and /api/mls/sync', 'SERVICE_API', 'Route-local admin key protection for MLS operational endpoints.', 'MACHINE_CREDENTIAL'),
      surface('/api/search', 'SERVICE_API', 'Public search route with optional admin key contexts for elevated access.', 'PUBLIC_OR_SEPARATE_REVIEW'),
    ],
    roles: [
      role('REPOSITORY_ADMIN', 'Repository governance, repository studio, and protected repository APIs.', ['read repository governance', 'review repository intelligence', 'view protected repository dashboards']),
      role('EXECUTIVE_REVIEWER', 'Executive workspace and EOI protected reporting review.', ['view executive workspace', 'view EOI summaries', 'view governed dashboard metadata']),
      role('OPERATIONS_LEAD', 'CAO queue and operational review ownership.', ['view CRM operational queues', 'review SLA and readiness metadata']),
      role('BROKER_REVIEW', 'Broker-level closure, escalation, and compliance review.', ['review closure evidence', 'review seller and buyer operating outcomes']),
      role('SERVICE_ACCOUNT', 'Machine-to-machine scripts, operational checks, and bounded admin APIs.', ['perform authorized GET checks', 'execute separately authorized operational scripts']),
      role('CERTIFICATION_REVIEWER', 'Non-mutating production certification evidence collection.', ['view protected production evidence when authorized', 'collect sanitized certification findings']),
    ],
    criteriaWeights: eparbAuthenticationReviewWeights,
    candidateModels: [
      score('MODEL_A_API_KEYS_FOR_PAGES_AND_APIS', 'NOT_RECOMMENDED', [5, 3, 8, 4, 3, 8, 7, 6, 4, 3, 7, 9], 'Simple and reusable but weak for human browser administration, auditability, revocation, and production certification.'),
      score('MODEL_B_HUMAN_SESSIONS_FOR_PAGES_API_KEYS_FOR_MACHINES', 'RECOMMENDED', [9, 9, 9, 8, 8, 8, 8, 8, 8, 9, 8, 7], 'Separates human and machine identity while preserving current API-key behavior during migration.'),
      score('MODEL_C_UNIFIED_IDP_AND_RBAC', 'CONDITIONALLY_ACCEPTABLE', [10, 8, 8, 10, 10, 6, 5, 5, 6, 10, 6, 4], 'Strong target if enterprise identity provider dependencies are authorized, but heavier than the minimum EOI Sprint 3 resolution path.'),
      score('MODEL_D_EXISTING_FRAMEWORK_EXTENSION', 'DEFERRED', [7, 6, 8, 6, 5, 9, 8, 7, 7, 6, 7, 8], 'Extends current middleware/admin key patterns but does not solve the human session gap by itself.'),
      score('MODEL_E_REPOSITORY_SUPPORTED_HYBRID', 'RECOMMENDED', [9, 9, 9, 9, 8, 9, 9, 8, 9, 9, 8, 7], 'Combines Model B with explicit role contracts, route classification, and future IDP compatibility.'),
    ],
    recommendation: {
      selectedModel: 'MODEL_E_REPOSITORY_SUPPORTED_HYBRID',
      summary: 'Adopt human browser sessions for protected pages, retain scoped API keys for machine/API access, define role-based authorization separately from authentication, and keep production access fail-closed.',
      minimumSafeImplementation: 'Create a repository-wide admin identity/session layer for protected browser pages while preserving existing API-key authorization for machine GET/API checks until a separately authorized migration narrows it.',
      eoiSprint3ResolutionPath: 'Resolve EOI Sprint 3 with a human authenticated production admin session or separately authorized session implementation; do not remediate by exposing the dashboard publicly or treating raw API keys as the long-term browser UX.',
      authenticationAuthorizationSeparationRequired: true,
      finalExecutiveAuthorizationRetainedBy: 'DAVID',
      implementationAuthorized: false,
      middlewareChangeAuthorized: false,
      credentialChangeAuthorized: false,
      productionMutationAuthorized: false,
    },
  };
}

export function validateEparbAuthenticationAccessReview(
  review: EparbAuthenticationAccessReview = buildEparbAuthenticationAccessReview(),
): EparbAuthenticationAccessReviewValidationResult {
  const issues: string[] = [];

  if (review.status !== 'COMPLETE_IMPLEMENTATION_NOT_AUTHORIZED') issues.push('EPARB Review 1 must remain implementation-not-authorized.');
  if (!review.triggeredBy.includes('EOI Sprint 3')) issues.push('EOI Sprint 3 certification blocker must be analyzed.');
  for (const methodId of ['ADMIN_HEADER_KEY', 'ADMIN_BEARER_KEY', 'ADMIN_COOKIE_KEY', 'PRODUCTION_BROWSER_SESSION'] as const) {
    if (!review.currentMethods.some((methodItem) => methodItem.id === methodId)) issues.push(`Missing authentication method ${methodId}.`);
  }
  if (!review.currentMethods.some((methodItem) => methodItem.intendedIdentity.includes('HUMAN_ADMINISTRATOR'))) {
    issues.push('Human administrative identity must be analyzed.');
  }
  if (!review.currentMethods.some((methodItem) => methodItem.intendedIdentity.includes('MACHINE_CLIENT'))) {
    issues.push('Machine/API identity must be analyzed.');
  }
  if (!review.protectedSurfaces.some((surfaceItem) => surfaceItem.routePattern === '/admin')) issues.push('Protected /admin surface must be inventoried.');
  if (!review.protectedSurfaces.some((surfaceItem) => surfaceItem.routePattern === '/api/admin/:path*')) issues.push('Protected /api/admin surface must be inventoried.');
  if (!review.roles.length) issues.push('Role model must be defined.');
  for (const roleItem of review.roles) {
    if (!roleItem.role || !roleItem.permissions.length) issues.push(`Role ${roleItem.role || 'UNKNOWN'} is incomplete.`);
  }
  for (const criterion of eparbAuthenticationReviewCriteria) {
    if (!review.criteriaWeights[criterion]) issues.push(`Missing weight for ${criterion}.`);
  }
  if (!review.candidateModels.some((model) => model.model === 'MODEL_A_API_KEYS_FOR_PAGES_AND_APIS')) issues.push('Model A must be compared.');
  if (!review.candidateModels.some((model) => model.model === 'MODEL_B_HUMAN_SESSIONS_FOR_PAGES_API_KEYS_FOR_MACHINES')) issues.push('Model B must be compared.');
  if (!review.candidateModels.some((model) => model.model === 'MODEL_C_UNIFIED_IDP_AND_RBAC')) issues.push('Model C must be compared.');
  if (!review.candidateModels.some((model) => model.model === 'MODEL_D_EXISTING_FRAMEWORK_EXTENSION')) issues.push('Model D must be compared.');
  if (!review.candidateModels.some((model) => model.model === 'MODEL_E_REPOSITORY_SUPPORTED_HYBRID')) issues.push('Model E must be compared.');
  if (review.recommendation.selectedModel !== 'MODEL_E_REPOSITORY_SUPPORTED_HYBRID') issues.push('Recommended model must be the repository-supported hybrid.');
  if (review.recommendation.finalExecutiveAuthorizationRetainedBy !== 'DAVID') issues.push('David must retain final authorization.');
  if (review.recommendation.implementationAuthorized !== false) issues.push('Implementation must remain unauthorized.');
  if (review.recommendation.middlewareChangeAuthorized !== false) issues.push('Middleware changes must remain unauthorized.');
  if (review.recommendation.credentialChangeAuthorized !== false) issues.push('Credential changes must remain unauthorized.');
  if (review.recommendation.productionMutationAuthorized !== false) issues.push('Production mutation must remain unauthorized.');
  if (review.recommendation.authenticationAuthorizationSeparationRequired !== true) issues.push('Authentication and authorization must remain separate layers.');

  return { valid: issues.length === 0, issues };
}

function method(
  id: EparbAuthMethodId,
  currentEvidence: string[],
  intendedIdentity: EparbIdentityClass[],
  currentPosture: string,
  recommendedDisposition: string,
): EparbAuthMethodInventoryItem {
  return { id, currentEvidence, intendedIdentity, currentPosture, recommendedDisposition };
}

function surface(
  routePattern: string,
  surfaceType: EparbProtectedSurface['surfaceType'],
  currentProtection: string,
  recommendedIdentityLayer: EparbProtectedSurface['recommendedIdentityLayer'],
): EparbProtectedSurface {
  return { routePattern, surfaceType, currentProtection, recommendedIdentityLayer };
}

function role(roleName: string, purpose: string, permissions: string[]): EparbRoleDefinition {
  return { role: roleName, purpose, permissions };
}

function score(
  model: EparbAccessModelId,
  recommendation: EparbAuthRecommendation,
  values: number[],
  rationale: string,
): EparbAccessModelScore {
  const scores = Object.fromEntries(
    eparbAuthenticationReviewCriteria.map((criterion, index) => [criterion, values[index] ?? 0]),
  ) as Record<EparbAuthCriterion, number>;

  return { model, recommendation, scores, rationale };
}
