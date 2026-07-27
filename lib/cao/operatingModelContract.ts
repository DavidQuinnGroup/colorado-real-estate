export type CaoCustomerLifecycleType = 'BUYER' | 'SELLER';

export type CaoBuyerLifecycleState =
  | 'NEW'
  | 'ASSIGNED'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'CONSULTATION_SCHEDULED'
  | 'ACTIVE_CLIENT'
  | 'CLOSED'
  | 'LOST'
  | 'ARCHIVED';

export type CaoSellerLifecycleState =
  | 'NEW'
  | 'REVIEWING'
  | 'STRATEGY_PREPARATION'
  | 'CONSULTATION_SCHEDULED'
  | 'ACTIVE_CLIENT'
  | 'CLOSED'
  | 'LOST'
  | 'ARCHIVED';

export type CaoCrmTaskLifecycleState = 'OPEN' | 'IN_PROGRESS' | 'WAITING' | 'COMPLETED' | 'DISMISSED';

export type CaoLifecycleState = CaoBuyerLifecycleState | CaoSellerLifecycleState | CaoCrmTaskLifecycleState;

export type CaoOperationalRole =
  | 'ADVISOR'
  | 'LISTING_ADVISOR'
  | 'BUYER_ADVISOR'
  | 'OPERATIONS_LEAD'
  | 'BROKER_REVIEW'
  | 'SYSTEM_REVIEW';

export type CaoServiceLevelType = 'FIRST_RESPONSE' | 'FOLLOW_UP' | 'CONSULTATION_SCHEDULING' | 'CLOSURE_REVIEW';

export type CaoKpiIdentifier =
  | 'CAO-KPI-INQUIRY-RESPONSE-TIME'
  | 'CAO-KPI-SELLER-RESPONSE-TIME'
  | 'CAO-KPI-CONSULTATION-SCHEDULING'
  | 'CAO-KPI-CONSULTATION-COMPLETION'
  | 'CAO-KPI-LEAD-DISPOSITION'
  | 'CAO-KPI-SLA-COMPLIANCE'
  | 'CAO-KPI-CLOSURE-COMPLETENESS';

export type CaoLifecycleStateDefinition<TState extends CaoLifecycleState = CaoLifecycleState> = {
  state: TState;
  description: string;
  entryCriteria: string[];
  exitCriteria: string[];
  requiredNotes: string[];
  auditRequirements: string[];
  allowedTransitions: TState[];
  terminal: boolean;
};

export type CaoOwnershipContract = {
  lifecycleType: CaoCustomerLifecycleType | 'CRM_TASK';
  state: CaoLifecycleState;
  responsibleRole: CaoOperationalRole;
  escalationOwner: CaoOperationalRole;
  closureOwner: CaoOperationalRole;
};

export type CaoServiceLevelContract = {
  lifecycleType: CaoCustomerLifecycleType | 'CRM_TASK';
  serviceLevel: CaoServiceLevelType;
  appliesToStates: CaoLifecycleState[];
  target: string;
  escalation: string;
  evidenceRequired: string[];
};

export type CaoOperationalKpiOwnership = {
  kpi: CaoKpiIdentifier;
  owner: CaoOperationalRole;
  description: string;
  source: 'EXISTING_OPERATIONAL_RECORDS' | 'BUSINESS_PROCESS_REQUIRED' | 'FUTURE_SOFTWARE_AFTER_AUTHORIZATION';
  telemetryRequired: false;
};

export type CaoOperatingModelValidationResult = {
  valid: boolean;
  issues: string[];
};

export const CAO_OPERATING_MODEL_CONTRACT_VERSION = 'CAO-1.0-SPRINT-1';

export const caoBuyerLifecycleStates: CaoBuyerLifecycleState[] = [
  'NEW',
  'ASSIGNED',
  'CONTACTED',
  'QUALIFIED',
  'CONSULTATION_SCHEDULED',
  'ACTIVE_CLIENT',
  'CLOSED',
  'LOST',
  'ARCHIVED',
];

export const caoSellerLifecycleStates: CaoSellerLifecycleState[] = [
  'NEW',
  'REVIEWING',
  'STRATEGY_PREPARATION',
  'CONSULTATION_SCHEDULED',
  'ACTIVE_CLIENT',
  'CLOSED',
  'LOST',
  'ARCHIVED',
];

export const caoCrmTaskLifecycleStates: CaoCrmTaskLifecycleState[] = [
  'OPEN',
  'IN_PROGRESS',
  'WAITING',
  'COMPLETED',
  'DISMISSED',
];

export const caoBuyerLifecycleDefinitions: CaoLifecycleStateDefinition<CaoBuyerLifecycleState>[] = [
  state('NEW', 'Buyer inquiry received but not yet assigned.', ['Property inquiry, tour intent, saved-search intake, or buyer contact exists.'], ['Responsible role assigned.'], ['intake source', 'initial customer intent'], ['capture timestamp and source'], ['ASSIGNED'], false),
  state('ASSIGNED', 'Buyer inquiry has an accountable reviewer.', ['Responsible role identified.'], ['First response attempted or completed.'], ['assigned owner', 'assignment rationale'], ['assignment timestamp'], ['CONTACTED', 'LOST', 'ARCHIVED'], false),
  state('CONTACTED', 'Buyer has received an initial response attempt.', ['First response evidence exists.'], ['Qualification notes recorded or consultation scheduled.'], ['contact method', 'response summary'], ['first response timestamp'], ['QUALIFIED', 'CONSULTATION_SCHEDULED', 'LOST', 'ARCHIVED'], false),
  state('QUALIFIED', 'Buyer need, timing, and property/search context are sufficiently understood.', ['Qualification notes recorded.'], ['Consultation scheduled, active-client relationship begins, or lead closed/lost.'], ['qualification notes', 'fit summary'], ['qualification reviewer'], ['CONSULTATION_SCHEDULED', 'ACTIVE_CLIENT', 'CLOSED', 'LOST', 'ARCHIVED'], false),
  state('CONSULTATION_SCHEDULED', 'Buyer consultation has been scheduled.', ['Consultation date or scheduling evidence exists.'], ['Consultation completed, active-client relationship begins, or consultation fails to proceed.'], ['scheduled time or scheduling evidence'], ['consultation scheduling evidence'], ['ACTIVE_CLIENT', 'CLOSED', 'LOST', 'ARCHIVED'], false),
  state('ACTIVE_CLIENT', 'Buyer has moved into an active client relationship or equivalent governed representation process.', ['Active-client decision recorded.'], ['Engagement closed or archived.'], ['active-client basis'], ['relationship or representation boundary evidence'], ['CLOSED', 'ARCHIVED'], false),
  state('CLOSED', 'Buyer operation completed with a recorded outcome.', ['Outcome recorded.'], ['Archive when retention and review conditions are satisfied.'], ['closure outcome', 'closure review note'], ['closure owner and timestamp'], ['ARCHIVED'], true),
  state('LOST', 'Buyer opportunity ended without active-client conversion.', ['Lost reason recorded.'], ['Archive when follow-up and review conditions are satisfied.'], ['lost reason', 'review note'], ['closure owner and timestamp'], ['ARCHIVED'], true),
  state('ARCHIVED', 'Buyer record is no longer active for operational follow-up.', ['Closure or lost review completed.'], ['No further transition except separately authorized reopening.'], ['archive rationale'], ['archive timestamp'], [], true),
];

export const caoSellerLifecycleDefinitions: CaoLifecycleStateDefinition<CaoSellerLifecycleState>[] = [
  state('NEW', 'Seller inquiry received but not yet reviewed.', ['Seller valuation or strategy request exists.'], ['Seller request enters review.'], ['intake source', 'property reference'], ['capture timestamp and source'], ['REVIEWING'], false),
  state('REVIEWING', 'Seller request is under initial advisor review.', ['Responsible role identified.'], ['Preparation work starts, consultation scheduled, or request closed/lost.'], ['review owner', 'initial review notes'], ['review timestamp'], ['STRATEGY_PREPARATION', 'CONSULTATION_SCHEDULED', 'LOST', 'ARCHIVED'], false),
  state('STRATEGY_PREPARATION', 'Seller preparation, pricing, timing, or market context is being assembled.', ['Preparation checklist started.'], ['Consultation scheduled, active-client relationship begins, or request closed/lost.'], ['preparation notes', 'pricing context notes'], ['preparation reviewer'], ['CONSULTATION_SCHEDULED', 'ACTIVE_CLIENT', 'CLOSED', 'LOST', 'ARCHIVED'], false),
  state('CONSULTATION_SCHEDULED', 'Seller consultation has been scheduled.', ['Consultation date or scheduling evidence exists.'], ['Consultation completed, active-client relationship begins, or request fails to proceed.'], ['scheduled time or scheduling evidence'], ['consultation scheduling evidence'], ['ACTIVE_CLIENT', 'CLOSED', 'LOST', 'ARCHIVED'], false),
  state('ACTIVE_CLIENT', 'Seller has moved into an active listing or representation process.', ['Active-client decision recorded.'], ['Engagement closed or archived.'], ['active-client basis'], ['relationship or representation boundary evidence'], ['CLOSED', 'ARCHIVED'], false),
  state('CLOSED', 'Seller operation completed with a recorded outcome.', ['Outcome recorded.'], ['Archive when retention and review conditions are satisfied.'], ['closure outcome', 'closure review note'], ['closure owner and timestamp'], ['ARCHIVED'], true),
  state('LOST', 'Seller opportunity ended without active-client conversion.', ['Lost reason recorded.'], ['Archive when follow-up and review conditions are satisfied.'], ['lost reason', 'review note'], ['closure owner and timestamp'], ['ARCHIVED'], true),
  state('ARCHIVED', 'Seller record is no longer active for operational follow-up.', ['Closure or lost review completed.'], ['No further transition except separately authorized reopening.'], ['archive rationale'], ['archive timestamp'], [], true),
];

export const caoCrmTaskLifecycleDefinitions: CaoLifecycleStateDefinition<CaoCrmTaskLifecycleState>[] = [
  state('OPEN', 'CRM task is visible for operational review.', ['CRM task exists.'], ['Task review begins, waits on external dependency, completes, or is dismissed.'], ['task source', 'initial next action'], ['task creation timestamp'], ['IN_PROGRESS', 'WAITING', 'COMPLETED', 'DISMISSED'], false),
  state('IN_PROGRESS', 'CRM task is being actively reviewed.', ['Reviewer has accepted or begun the task.'], ['Task completes, waits, or is dismissed.'], ['review note'], ['review start timestamp'], ['WAITING', 'COMPLETED', 'DISMISSED'], false),
  state('WAITING', 'CRM task is waiting on customer, advisor, compliance, or external follow-up.', ['Waiting reason recorded.'], ['Task returns to active review, completes, or is dismissed.'], ['waiting reason', 'next follow-up date or condition'], ['waiting timestamp'], ['IN_PROGRESS', 'COMPLETED', 'DISMISSED'], false),
  state('COMPLETED', 'CRM task completed with a review note.', ['Completion note recorded.'], ['No further transition except archival process outside this task lifecycle.'], ['completion note'], ['closure owner and timestamp'], [], true),
  state('DISMISSED', 'CRM task dismissed with a review note.', ['Dismissal reason recorded.'], ['No further transition except archival process outside this task lifecycle.'], ['dismissal note'], ['closure owner and timestamp'], [], true),
];

export const caoOwnershipContracts: CaoOwnershipContract[] = [
  ...caoBuyerLifecycleStates.map((stateName) => ownership('BUYER', stateName, 'BUYER_ADVISOR', 'OPERATIONS_LEAD', 'BROKER_REVIEW')),
  ...caoSellerLifecycleStates.map((stateName) => ownership('SELLER', stateName, 'LISTING_ADVISOR', 'OPERATIONS_LEAD', 'BROKER_REVIEW')),
  ...caoCrmTaskLifecycleStates.map((stateName) => ownership('CRM_TASK', stateName, 'OPERATIONS_LEAD', 'BROKER_REVIEW', 'OPERATIONS_LEAD')),
];

export const caoServiceLevelContracts: CaoServiceLevelContract[] = [
  serviceLevel('BUYER', 'FIRST_RESPONSE', ['NEW', 'ASSIGNED'], 'High-intent buyer inquiries should receive first human review before the close of the next business half-day.', 'Escalate to Operations Lead when first response evidence is missing.', ['first response note', 'response timestamp']),
  serviceLevel('BUYER', 'FOLLOW_UP', ['CONTACTED', 'QUALIFIED'], 'Follow-up should continue on a documented cadence until consultation, closure, lost, or archive.', 'Escalate stalled qualified buyer records to Operations Lead.', ['follow-up note', 'next action']),
  serviceLevel('BUYER', 'CONSULTATION_SCHEDULING', ['QUALIFIED', 'CONSULTATION_SCHEDULED'], 'Consultation scheduling should be attempted when qualification notes support a meaningful advisory conversation.', 'Escalate schedule-ready buyer records without scheduling evidence.', ['consultation scheduling evidence']),
  serviceLevel('BUYER', 'FOLLOW_UP', ['ACTIVE_CLIENT'], 'Active buyer records should remain governed by the assigned advisor and broker-review boundary until closed or archived.', 'Escalate active buyer records missing advisor ownership evidence.', ['active-client owner note', 'next action']),
  serviceLevel('BUYER', 'CLOSURE_REVIEW', ['CLOSED', 'LOST', 'ARCHIVED'], 'Buyer closure requires closure or lost reason and review note before archive.', 'Closure owner must resolve missing review notes.', ['closure review note', 'closure owner']),
  serviceLevel('SELLER', 'FIRST_RESPONSE', ['NEW', 'REVIEWING'], 'Seller strategy requests should receive first human review before the close of the next business day.', 'Escalate ready-now seller records without review evidence.', ['first response note', 'response timestamp']),
  serviceLevel('SELLER', 'FOLLOW_UP', ['REVIEWING', 'STRATEGY_PREPARATION'], 'Seller follow-up should preserve preparation, pricing, objective, and timeline context.', 'Escalate seller records stalled in preparation.', ['preparation note', 'next action']),
  serviceLevel('SELLER', 'CONSULTATION_SCHEDULING', ['STRATEGY_PREPARATION', 'CONSULTATION_SCHEDULED'], 'Seller consultation scheduling should follow a documented preparation review.', 'Escalate schedule-ready seller records without scheduling evidence.', ['consultation scheduling evidence']),
  serviceLevel('SELLER', 'FOLLOW_UP', ['ACTIVE_CLIENT'], 'Active seller records should remain governed by the assigned listing advisor and broker-review boundary until closed or archived.', 'Escalate active seller records missing advisor ownership evidence.', ['active-client owner note', 'next action']),
  serviceLevel('SELLER', 'CLOSURE_REVIEW', ['CLOSED', 'LOST', 'ARCHIVED'], 'Seller closure requires outcome, lost reason when applicable, and review note before archive.', 'Closure owner must resolve missing review notes.', ['closure review note', 'closure owner']),
  serviceLevel('CRM_TASK', 'FIRST_RESPONSE', ['OPEN'], 'Open CRM tasks require human review before escalation to automation or downstream action.', 'Escalate unreviewed open tasks to Operations Lead.', ['task review note']),
  serviceLevel('CRM_TASK', 'FOLLOW_UP', ['IN_PROGRESS', 'WAITING'], 'In-progress and waiting tasks require next action or waiting reason.', 'Escalate tasks without next action or waiting condition.', ['next action', 'waiting reason when applicable']),
  serviceLevel('CRM_TASK', 'CLOSURE_REVIEW', ['COMPLETED', 'DISMISSED'], 'Completed or dismissed CRM tasks require a bounded review note.', 'Reject closure without review note.', ['completion or dismissal note']),
];

export const caoOperationalKpiOwnership: CaoOperationalKpiOwnership[] = [
  kpi('CAO-KPI-INQUIRY-RESPONSE-TIME', 'OPERATIONS_LEAD', 'Time from buyer inquiry capture to first human response evidence.', 'BUSINESS_PROCESS_REQUIRED'),
  kpi('CAO-KPI-SELLER-RESPONSE-TIME', 'OPERATIONS_LEAD', 'Time from seller request capture to first human response evidence.', 'BUSINESS_PROCESS_REQUIRED'),
  kpi('CAO-KPI-CONSULTATION-SCHEDULING', 'OPERATIONS_LEAD', 'Share of qualified buyer or seller records with consultation scheduling evidence.', 'BUSINESS_PROCESS_REQUIRED'),
  kpi('CAO-KPI-CONSULTATION-COMPLETION', 'OPERATIONS_LEAD', 'Share of scheduled consultations completed with outcome notes.', 'BUSINESS_PROCESS_REQUIRED'),
  kpi('CAO-KPI-LEAD-DISPOSITION', 'BROKER_REVIEW', 'Completeness and consistency of lead outcome disposition.', 'BUSINESS_PROCESS_REQUIRED'),
  kpi('CAO-KPI-SLA-COMPLIANCE', 'OPERATIONS_LEAD', 'Operational compliance with governed service-level targets.', 'FUTURE_SOFTWARE_AFTER_AUTHORIZATION'),
  kpi('CAO-KPI-CLOSURE-COMPLETENESS', 'BROKER_REVIEW', 'Completeness of closure notes, lost reasons, and archive rationale.', 'EXISTING_OPERATIONAL_RECORDS'),
];

export function canTransition(
  definitions: readonly CaoLifecycleStateDefinition[],
  from: CaoLifecycleState,
  to: CaoLifecycleState,
): boolean {
  const definition = definitions.find((item) => item.state === from);
  return Boolean(definition?.allowedTransitions.includes(to));
}

export function validateCaoOperatingModelContract(input: {
  buyerDefinitions?: readonly CaoLifecycleStateDefinition<CaoBuyerLifecycleState>[];
  sellerDefinitions?: readonly CaoLifecycleStateDefinition<CaoSellerLifecycleState>[];
  crmTaskDefinitions?: readonly CaoLifecycleStateDefinition<CaoCrmTaskLifecycleState>[];
  ownershipContracts?: readonly CaoOwnershipContract[];
  serviceLevelContracts?: readonly CaoServiceLevelContract[];
  kpiOwnership?: readonly CaoOperationalKpiOwnership[];
} = {}): CaoOperatingModelValidationResult {
  const buyerDefinitions = input.buyerDefinitions ?? caoBuyerLifecycleDefinitions;
  const sellerDefinitions = input.sellerDefinitions ?? caoSellerLifecycleDefinitions;
  const crmTaskDefinitions = input.crmTaskDefinitions ?? caoCrmTaskLifecycleDefinitions;
  const ownershipContracts = input.ownershipContracts ?? caoOwnershipContracts;
  const serviceLevelContracts = input.serviceLevelContracts ?? caoServiceLevelContracts;
  const kpiOwnership = input.kpiOwnership ?? caoOperationalKpiOwnership;
  const issues: string[] = [];

  validateDefinitions('buyer', buyerDefinitions, caoBuyerLifecycleStates, issues);
  validateDefinitions('seller', sellerDefinitions, caoSellerLifecycleStates, issues);
  validateDefinitions('CRM task', crmTaskDefinitions, caoCrmTaskLifecycleStates, issues);

  for (const definition of [...buyerDefinitions, ...sellerDefinitions, ...crmTaskDefinitions]) {
    const owner = ownershipContracts.find((contract) => contract.state === definition.state);
    if (!owner?.responsibleRole || !owner.escalationOwner || !owner.closureOwner) {
      issues.push(`Missing ownership contract for ${definition.state}.`);
    }

    const serviceLevels = serviceLevelContracts.filter((contract) => contract.appliesToStates.includes(definition.state));
    if (!serviceLevels.length) {
      issues.push(`Missing service-level definition for ${definition.state}.`);
    }

    if (definition.terminal && !definition.requiredNotes.length) {
      issues.push(`Missing closure requirements for terminal state ${definition.state}.`);
    }
  }

  for (const kpiOwner of kpiOwnership) {
    if (kpiOwner.telemetryRequired !== false) issues.push(`KPI ${kpiOwner.kpi} must not require telemetry.`);
    if (!kpiOwner.owner) issues.push(`KPI ${kpiOwner.kpi} is missing operational owner.`);
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

function state<TState extends CaoLifecycleState>(
  stateName: TState,
  description: string,
  entryCriteria: string[],
  exitCriteria: string[],
  requiredNotes: string[],
  auditRequirements: string[],
  allowedTransitions: TState[],
  terminal: boolean,
): CaoLifecycleStateDefinition<TState> {
  return {
    state: stateName,
    description,
    entryCriteria,
    exitCriteria,
    requiredNotes,
    auditRequirements,
    allowedTransitions,
    terminal,
  };
}

function ownership(
  lifecycleType: CaoOwnershipContract['lifecycleType'],
  stateName: CaoLifecycleState,
  responsibleRole: CaoOperationalRole,
  escalationOwner: CaoOperationalRole,
  closureOwner: CaoOperationalRole,
): CaoOwnershipContract {
  return {
    lifecycleType,
    state: stateName,
    responsibleRole,
    escalationOwner,
    closureOwner,
  };
}

function serviceLevel(
  lifecycleType: CaoServiceLevelContract['lifecycleType'],
  serviceLevelName: CaoServiceLevelType,
  appliesToStates: CaoLifecycleState[],
  target: string,
  escalation: string,
  evidenceRequired: string[],
): CaoServiceLevelContract {
  return {
    lifecycleType,
    serviceLevel: serviceLevelName,
    appliesToStates,
    target,
    escalation,
    evidenceRequired,
  };
}

function kpi(
  kpiName: CaoKpiIdentifier,
  owner: CaoOperationalRole,
  description: string,
  source: CaoOperationalKpiOwnership['source'],
): CaoOperationalKpiOwnership {
  return {
    kpi: kpiName,
    owner,
    description,
    source,
    telemetryRequired: false,
  };
}

function validateDefinitions<TState extends CaoLifecycleState>(
  label: string,
  definitions: readonly CaoLifecycleStateDefinition<TState>[],
  expectedStates: readonly TState[],
  issues: string[],
) {
  const definedStates = new Set(definitions.map((definition) => definition.state));

  for (const expectedState of expectedStates) {
    if (!definedStates.has(expectedState)) issues.push(`Missing ${label} lifecycle state ${expectedState}.`);
  }

  for (const definition of definitions) {
    if (!definition.entryCriteria.length) issues.push(`Missing entry criteria for ${definition.state}.`);
    if (!definition.exitCriteria.length) issues.push(`Missing exit criteria for ${definition.state}.`);
    if (!definition.auditRequirements.length) issues.push(`Missing audit requirements for ${definition.state}.`);

    for (const transition of definition.allowedTransitions) {
      if (!definedStates.has(transition as TState)) {
        issues.push(`Invalid transition from ${definition.state} to ${transition}.`);
      }
    }
  }
}
