type CaoCrmTaskLifecycleState = 'OPEN' | 'IN_PROGRESS' | 'WAITING' | 'COMPLETED' | 'DISMISSED';

type CaoOperationalRole =
  | 'ADVISOR'
  | 'LISTING_ADVISOR'
  | 'BUYER_ADVISOR'
  | 'OPERATIONS_LEAD'
  | 'BROKER_REVIEW'
  | 'SYSTEM_REVIEW';

type CaoServiceLevelType = 'FIRST_RESPONSE' | 'FOLLOW_UP' | 'CONSULTATION_SCHEDULING' | 'CLOSURE_REVIEW';

export type CaoQueueReadinessState =
  | 'UNASSIGNED'
  | 'ASSIGNED'
  | 'WAITING'
  | 'OVERDUE'
  | 'COMPLETED'
  | 'DISMISSED';

export type CaoServiceLevelVisibility = 'ON_TIME' | 'APPROACHING_SLA' | 'OVERDUE';

export type CaoReviewReadinessState =
  | 'REVIEW_READY'
  | 'NOTES_REQUIRED'
  | 'CLOSURE_REVIEW_REQUIRED'
  | 'REVIEW_COMPLETE'
  | 'REVIEW_INCOMPLETE';

export type CaoOperationalReadinessLevel = 'READY' | 'WATCH' | 'BLOCKED';

export type CaoQueueSource = 'CRM_TASK_LIST' | 'CRM_TASK_DETAIL' | 'ADMIN_REVIEW_SURFACE';

export type CaoQueueReadinessInput = {
  id: string;
  status: string | null;
  priority?: string | null;
  type?: string | null;
  createdAt: string | Date | null;
  hasReviewNote?: boolean;
  source?: CaoQueueSource;
};

export type CaoOwnershipView = {
  responsibleRole: CaoOperationalRole;
  escalationOwner: CaoOperationalRole;
  reviewOwner: CaoOperationalRole;
};

export type CaoServiceLevelView = {
  serviceLevel: CaoServiceLevelType;
  visibility: CaoServiceLevelVisibility;
  ageHours: number | null;
  targetHours: number;
  target: string;
  escalation: string;
  evidenceRequired: string[];
};

export type CaoReviewReadinessView = {
  state: CaoReviewReadinessState;
  requiredNotes: string[];
  closureReviewRequired: boolean;
  reviewComplete: boolean;
  operationalReadiness: CaoOperationalReadinessLevel;
  summary: string;
};

export type CaoQueueReadinessView = {
  contractVersion: typeof CAO_OPERATIONS_QUEUE_READINESS_CONTRACT_VERSION;
  source: CaoQueueSource;
  taskId: string;
  queueState: CaoQueueReadinessState;
  crmLifecycleState: CaoCrmTaskLifecycleState;
  ownership: CaoOwnershipView;
  serviceLevel: CaoServiceLevelView;
  review: CaoReviewReadinessView;
  automationAuthorized: false;
  telemetryAuthorized: false;
};

export type CaoQueueReadinessSummary = {
  contractVersion: typeof CAO_OPERATIONS_QUEUE_READINESS_CONTRACT_VERSION;
  source: CaoQueueSource;
  total: number;
  unassigned: number;
  assigned: number;
  waiting: number;
  overdue: number;
  completed: number;
  dismissed: number;
  onTime: number;
  approachingSla: number;
  overdueSla: number;
  closureReviewRequired: number;
  reviewIncomplete: number;
  operationalReadiness: CaoOperationalReadinessLevel;
  summary: string;
};

export type CaoOperationsQueueReadinessValidationResult = {
  valid: boolean;
  issues: string[];
};

export const CAO_OPERATIONS_QUEUE_READINESS_CONTRACT_VERSION = 'CAO-1.0-SPRINT-2';

export const caoQueueReadinessStates: CaoQueueReadinessState[] = [
  'UNASSIGNED',
  'ASSIGNED',
  'WAITING',
  'OVERDUE',
  'COMPLETED',
  'DISMISSED',
];

export const caoServiceLevelVisibilityStates: CaoServiceLevelVisibility[] = [
  'ON_TIME',
  'APPROACHING_SLA',
  'OVERDUE',
];

export const caoReviewReadinessStates: CaoReviewReadinessState[] = [
  'REVIEW_READY',
  'NOTES_REQUIRED',
  'CLOSURE_REVIEW_REQUIRED',
  'REVIEW_COMPLETE',
  'REVIEW_INCOMPLETE',
];

export const caoQueueStateDefinitions: Array<{
  state: CaoQueueReadinessState;
  description: string;
  crmLifecycleState: CaoCrmTaskLifecycleState;
  requiredNotes: string[];
  automationPermitted: false;
}> = [
  queueState('UNASSIGNED', 'Task exists and needs human owner review.', 'OPEN', ['intake source', 'initial next action']),
  queueState('ASSIGNED', 'Task is under human operational review.', 'IN_PROGRESS', ['review note']),
  queueState('WAITING', 'Task is waiting on customer, advisor, compliance, or external follow-up.', 'WAITING', ['waiting reason', 'next follow-up condition']),
  queueState('OVERDUE', 'Task needs escalation review under the governed service-level view.', 'OPEN', ['escalation note', 'next action']),
  queueState('COMPLETED', 'Task completed with a bounded human review note.', 'COMPLETED', ['completion note']),
  queueState('DISMISSED', 'Task dismissed with a bounded human review note.', 'DISMISSED', ['dismissal note']),
];

export const caoQueueServiceLevelTargets: Array<{
  taskType: string;
  targetHours: number;
  approachingAfterPercent: number;
  serviceLevel: CaoServiceLevelType;
}> = [
  { taskType: 'property_inquiry', targetHours: 12, approachingAfterPercent: 75, serviceLevel: 'FIRST_RESPONSE' },
  { taskType: 'strategy_intake', targetHours: 24, approachingAfterPercent: 75, serviceLevel: 'FIRST_RESPONSE' },
  { taskType: 'PRE_DISCOVERY_BRIEF', targetHours: 24, approachingAfterPercent: 75, serviceLevel: 'FOLLOW_UP' },
  { taskType: 'default', targetHours: 24, approachingAfterPercent: 75, serviceLevel: 'FOLLOW_UP' },
];

const caoCrmTaskOwnershipContract = {
  responsibleRole: 'OPERATIONS_LEAD',
  escalationOwner: 'BROKER_REVIEW',
  reviewOwner: 'OPERATIONS_LEAD',
} satisfies CaoOwnershipView;

const caoCrmTaskServiceLevelContracts: Array<{
  serviceLevel: CaoServiceLevelType;
  appliesToStates: CaoCrmTaskLifecycleState[];
  target: string;
  escalation: string;
  evidenceRequired: string[];
}> = [
  {
    serviceLevel: 'FIRST_RESPONSE',
    appliesToStates: ['OPEN'],
    target: 'Open CRM tasks require human review before escalation to automation or downstream action.',
    escalation: 'Escalate unreviewed open tasks to Operations Lead.',
    evidenceRequired: ['task review note'],
  },
  {
    serviceLevel: 'FOLLOW_UP',
    appliesToStates: ['IN_PROGRESS', 'WAITING'],
    target: 'In-progress and waiting tasks require next action or waiting reason.',
    escalation: 'Escalate tasks without next action or waiting condition.',
    evidenceRequired: ['next action', 'waiting reason when applicable'],
  },
  {
    serviceLevel: 'CLOSURE_REVIEW',
    appliesToStates: ['COMPLETED', 'DISMISSED'],
    target: 'Completed or dismissed CRM tasks require a bounded review note.',
    escalation: 'Reject closure without review note.',
    evidenceRequired: ['completion or dismissal note'],
  },
];

export function getCaoQueueReadinessView(input: CaoQueueReadinessInput): CaoQueueReadinessView {
  const ageHours = getAgeHours(input.createdAt);
  const target = getServiceLevelTarget(input.type);
  const baseQueueState = getBaseQueueState(input.status);
  const visibility = getServiceLevelVisibility(ageHours, target.targetHours, target.approachingAfterPercent);
  const queueState = shouldEscalateQueueState(baseQueueState, visibility) ? 'OVERDUE' : baseQueueState;
  const crmLifecycleState = getCrmLifecycleState(queueState, input.status);
  const serviceLevelContract = getServiceLevelContract(target.serviceLevel, crmLifecycleState);
  const requiredNotes = getRequiredNotes(queueState);
  const review = getReviewReadiness(queueState, requiredNotes, Boolean(input.hasReviewNote));
  return {
    contractVersion: CAO_OPERATIONS_QUEUE_READINESS_CONTRACT_VERSION,
    source: input.source || 'CRM_TASK_LIST',
    taskId: input.id,
    queueState,
    crmLifecycleState,
    ownership: caoCrmTaskOwnershipContract,
    serviceLevel: {
      serviceLevel: target.serviceLevel,
      visibility,
      ageHours,
      targetHours: target.targetHours,
      target: serviceLevelContract?.target || 'Human review target is governed by the CAO operating model.',
      escalation: serviceLevelContract?.escalation || 'Escalate unresolved operational review gaps to the governed escalation owner.',
      evidenceRequired: serviceLevelContract?.evidenceRequired || requiredNotes,
    },
    review,
    automationAuthorized: false,
    telemetryAuthorized: false,
  };
}

export function getCaoQueueReadinessSummary(
  inputs: readonly CaoQueueReadinessInput[],
  source: CaoQueueSource = 'CRM_TASK_LIST',
): CaoQueueReadinessSummary {
  const views = inputs.map((input) => getCaoQueueReadinessView({ ...input, source }));
  const reviewIncomplete = views.filter((view) => view.review.reviewComplete === false).length;
  const closureReviewRequired = views.filter((view) => view.review.closureReviewRequired).length;
  const overdue = views.filter((view) => view.queueState === 'OVERDUE').length;
  const approachingSla = views.filter((view) => view.serviceLevel.visibility === 'APPROACHING_SLA').length;
  const blocked = views.some((view) => view.review.operationalReadiness === 'BLOCKED');
  const watch = overdue > 0 || approachingSla > 0 || reviewIncomplete > 0;
  const operationalReadiness: CaoOperationalReadinessLevel = blocked ? 'BLOCKED' : watch ? 'WATCH' : 'READY';

  return {
    contractVersion: CAO_OPERATIONS_QUEUE_READINESS_CONTRACT_VERSION,
    source,
    total: views.length,
    unassigned: countQueueState(views, 'UNASSIGNED'),
    assigned: countQueueState(views, 'ASSIGNED'),
    waiting: countQueueState(views, 'WAITING'),
    overdue,
    completed: countQueueState(views, 'COMPLETED'),
    dismissed: countQueueState(views, 'DISMISSED'),
    onTime: countServiceLevel(views, 'ON_TIME'),
    approachingSla,
    overdueSla: countServiceLevel(views, 'OVERDUE'),
    closureReviewRequired,
    reviewIncomplete,
    operationalReadiness,
    summary:
      operationalReadiness === 'READY'
        ? 'Queue readiness is clear for human review.'
        : operationalReadiness === 'WATCH'
          ? 'Queue readiness needs human attention before operational scale.'
          : 'Queue readiness is blocked until required review evidence is complete.',
  };
}

export function validateCaoOperationsQueueReadinessContract(input: {
  queueStateDefinitions?: typeof caoQueueStateDefinitions;
  serviceLevelTargets?: typeof caoQueueServiceLevelTargets;
} = {}): CaoOperationsQueueReadinessValidationResult {
  const queueStateDefinitions = input.queueStateDefinitions ?? caoQueueStateDefinitions;
  const serviceLevelTargets = input.serviceLevelTargets ?? caoQueueServiceLevelTargets;
  const issues: string[] = [];
  const definedStates = new Set(queueStateDefinitions.map((definition) => definition.state));

  for (const state of caoQueueReadinessStates) {
    if (!definedStates.has(state)) issues.push(`Missing queue readiness state ${state}.`);
  }

  for (const definition of queueStateDefinitions) {
    if (definition.automationPermitted !== false) {
      issues.push(`Queue state ${definition.state} must not permit automation.`);
    }

    if (!definition.requiredNotes.length) {
      issues.push(`Queue state ${definition.state} is missing required notes.`);
    }
  }

  for (const target of serviceLevelTargets) {
    if (!target.taskType) issues.push('Service-level target is missing task type.');
    if (!Number.isFinite(target.targetHours) || target.targetHours <= 0) {
      issues.push(`Invalid service-level target hours for ${target.taskType}.`);
    }
    if (target.approachingAfterPercent <= 0 || target.approachingAfterPercent >= 100) {
      issues.push(`Invalid approaching SLA threshold for ${target.taskType}.`);
    }
  }

  const sample = getCaoQueueReadinessView({
    id: 'sample',
    status: 'pending',
    type: 'property_inquiry',
    createdAt: new Date(Date.now() - 13 * 60 * 60 * 1000).toISOString(),
  });

  if (sample.automationAuthorized !== false) issues.push('Queue readiness view must keep automation unauthorized.');
  if (sample.telemetryAuthorized !== false) issues.push('Queue readiness view must keep telemetry unauthorized.');
  if (!sample.ownership.responsibleRole || !sample.ownership.escalationOwner || !sample.ownership.reviewOwner) {
    issues.push('Queue readiness view is missing ownership visualization.');
  }
  if (sample.queueState !== 'OVERDUE') issues.push('Overdue queue state was not represented for an aged pending task.');

  return {
    valid: issues.length === 0,
    issues,
  };
}

function queueState(
  state: CaoQueueReadinessState,
  description: string,
  crmLifecycleState: CaoCrmTaskLifecycleState,
  requiredNotes: string[],
) {
  return {
    state,
    description,
    crmLifecycleState,
    requiredNotes,
    automationPermitted: false,
  } as const;
}

function getBaseQueueState(status: string | null): CaoQueueReadinessState {
  const normalizedStatus = (status || '').trim().toLowerCase();
  if (normalizedStatus === 'completed') return 'COMPLETED';
  if (normalizedStatus === 'dismissed') return 'DISMISSED';
  if (normalizedStatus === 'reviewing' || normalizedStatus === 'assigned' || normalizedStatus === 'in_progress') return 'ASSIGNED';
  if (normalizedStatus === 'waiting') return 'WAITING';
  return 'UNASSIGNED';
}

function getCrmLifecycleState(
  queueState: CaoQueueReadinessState,
  status: string | null,
): CaoCrmTaskLifecycleState {
  if (queueState === 'COMPLETED') return 'COMPLETED';
  if (queueState === 'DISMISSED') return 'DISMISSED';
  if (queueState === 'WAITING') return 'WAITING';
  if (queueState === 'ASSIGNED') return 'IN_PROGRESS';
  if (queueState === 'OVERDUE') return (status || '').toLowerCase() === 'reviewing' ? 'IN_PROGRESS' : 'OPEN';
  return 'OPEN';
}

function getServiceLevelTarget(type: string | null | undefined) {
  const normalizedType = (type || '').trim();
  return (
    caoQueueServiceLevelTargets.find((target) => target.taskType === normalizedType) ||
    caoQueueServiceLevelTargets.find((target) => target.taskType === 'default') ||
    caoQueueServiceLevelTargets[0]
  );
}

function getAgeHours(value: string | Date | null) {
  const timestamp = value instanceof Date ? value.getTime() : Date.parse(value || '');
  if (!Number.isFinite(timestamp)) return null;
  return Math.max(0, Math.round(((Date.now() - timestamp) / 3_600_000) * 10) / 10);
}

function getServiceLevelVisibility(
  ageHours: number | null,
  targetHours: number,
  approachingAfterPercent: number,
): CaoServiceLevelVisibility {
  if (ageHours === null) return 'APPROACHING_SLA';
  if (ageHours >= targetHours) return 'OVERDUE';
  if (ageHours >= targetHours * (approachingAfterPercent / 100)) return 'APPROACHING_SLA';
  return 'ON_TIME';
}

function shouldEscalateQueueState(queueState: CaoQueueReadinessState, visibility: CaoServiceLevelVisibility) {
  return !['COMPLETED', 'DISMISSED'].includes(queueState) && visibility === 'OVERDUE';
}

function getServiceLevelContract(serviceLevel: CaoServiceLevelType, state: CaoCrmTaskLifecycleState) {
  return (
    caoCrmTaskServiceLevelContracts.find(
      (contract) => contract.serviceLevel === serviceLevel && contract.appliesToStates.includes(state),
    ) || caoCrmTaskServiceLevelContracts.find((contract) => contract.appliesToStates.includes(state))
  );
}

function getRequiredNotes(queueState: CaoQueueReadinessState) {
  return caoQueueStateDefinitions.find((definition) => definition.state === queueState)?.requiredNotes || ['review note'];
}

function getReviewReadiness(
  queueState: CaoQueueReadinessState,
  requiredNotes: string[],
  hasReviewNote: boolean,
): CaoReviewReadinessView {
  if (queueState === 'COMPLETED' || queueState === 'DISMISSED') {
    return {
      state: hasReviewNote ? 'REVIEW_COMPLETE' : 'REVIEW_INCOMPLETE',
      requiredNotes,
      closureReviewRequired: !hasReviewNote,
      reviewComplete: hasReviewNote,
      operationalReadiness: hasReviewNote ? 'READY' : 'BLOCKED',
      summary: hasReviewNote
        ? 'Closure review evidence is present.'
        : 'Closure review evidence is required before this task is operationally complete.',
    };
  }

  if (queueState === 'OVERDUE') {
    return {
      state: 'NOTES_REQUIRED',
      requiredNotes,
      closureReviewRequired: false,
      reviewComplete: false,
      operationalReadiness: 'WATCH',
      summary: 'Human review notes are required to resolve the overdue operational queue state.',
    };
  }

  return {
    state: queueState === 'ASSIGNED' || queueState === 'WAITING' ? 'NOTES_REQUIRED' : 'REVIEW_READY',
    requiredNotes,
    closureReviewRequired: false,
    reviewComplete: false,
    operationalReadiness: queueState === 'UNASSIGNED' ? 'WATCH' : 'READY',
    summary: queueState === 'UNASSIGNED' ? 'Task is ready for human assignment review.' : 'Task has a governed human review path.',
  };
}

function countQueueState(views: readonly CaoQueueReadinessView[], state: CaoQueueReadinessState) {
  return views.filter((view) => view.queueState === state).length;
}

function countServiceLevel(views: readonly CaoQueueReadinessView[], visibility: CaoServiceLevelVisibility) {
  return views.filter((view) => view.serviceLevel.visibility === visibility).length;
}
