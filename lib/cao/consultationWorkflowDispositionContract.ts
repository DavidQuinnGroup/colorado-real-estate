import type { CaoKpiIdentifier, CaoOperationalRole } from './operatingModelContract.js';

export type CaoEngagementType = 'BUYER' | 'SELLER';

export type CaoBuyerConsultationOutcome =
  | 'SCHEDULED'
  | 'COMPLETED'
  | 'RESCHEDULE_REQUIRED'
  | 'NO_SHOW'
  | 'CANCELLED'
  | 'FOLLOW_UP_REQUIRED';

export type CaoSellerConsultationOutcome =
  | 'STRATEGY_MEETING_SCHEDULED'
  | 'STRATEGY_COMPLETED'
  | 'LISTING_PREPARATION'
  | 'NOT_READY'
  | 'LOST'
  | 'FOLLOW_UP_REQUIRED';

export type CaoConsultationOutcome = CaoBuyerConsultationOutcome | CaoSellerConsultationOutcome;

export type CaoLeadDisposition =
  | 'NEW'
  | 'WORKING'
  | 'QUALIFIED'
  | 'ACTIVE_CLIENT'
  | 'CLOSED_WON'
  | 'CLOSED_LOST'
  | 'NURTURE'
  | 'ARCHIVED';

export type CaoConsultationDocumentationRequirement =
  | 'INTAKE_CONTEXT'
  | 'CUSTOMER_OBJECTIVE'
  | 'PROPERTY_OR_MARKET_CONTEXT'
  | 'TIMELINE'
  | 'FOLLOW_UP_PLAN'
  | 'CONSULTATION_SUMMARY'
  | 'OUTCOME_RATIONALE'
  | 'BROKER_REVIEW_NOTE'
  | 'ARCHIVE_RATIONALE';

export type CaoConsultationAuditRequirement =
  | 'OWNER_RECORDED'
  | 'TIMESTAMP_RECORDED'
  | 'FOLLOW_UP_RECORDED'
  | 'DISPOSITION_RECORDED'
  | 'CLOSURE_REVIEW_RECORDED'
  | 'NO_AUTOMATION_AUTHORIZED';

export type CaoConsultationWorkflowDefinition<TOutcome extends CaoConsultationOutcome = CaoConsultationOutcome> = {
  engagementType: CaoEngagementType;
  outcome: TOutcome;
  description: string;
  entryCriteria: string[];
  exitCriteria: string[];
  requiredDocumentation: CaoConsultationDocumentationRequirement[];
  requiredFollowUp: string[];
  ownership: {
    responsibleRole: CaoOperationalRole;
    escalationOwner: CaoOperationalRole;
    closureOwner: CaoOperationalRole;
  };
  auditRequirements: CaoConsultationAuditRequirement[];
  allowedNextDispositions: CaoLeadDisposition[];
  terminal: boolean;
  automationAuthorized: false;
};

export type CaoLeadDispositionDefinition = {
  disposition: CaoLeadDisposition;
  description: string;
  entryCriteria: string[];
  exitCriteria: string[];
  requiredDocumentation: CaoConsultationDocumentationRequirement[];
  requiredFollowUp: string[];
  ownership: {
    responsibleRole: CaoOperationalRole;
    escalationOwner: CaoOperationalRole;
    closureOwner: CaoOperationalRole;
  };
  auditRequirements: CaoConsultationAuditRequirement[];
  allowedTransitions: CaoLeadDisposition[];
  terminal: boolean;
  kpiMappings: CaoKpiIdentifier[];
  automationAuthorized: false;
};

export type CaoConsultationWorkflowValidationResult = {
  valid: boolean;
  issues: string[];
};

export const CAO_CONSULTATION_WORKFLOW_DISPOSITION_CONTRACT_VERSION = 'CAO-1.0-SPRINT-3';

export const caoBuyerConsultationOutcomes: CaoBuyerConsultationOutcome[] = [
  'SCHEDULED',
  'COMPLETED',
  'RESCHEDULE_REQUIRED',
  'NO_SHOW',
  'CANCELLED',
  'FOLLOW_UP_REQUIRED',
];

export const caoSellerConsultationOutcomes: CaoSellerConsultationOutcome[] = [
  'STRATEGY_MEETING_SCHEDULED',
  'STRATEGY_COMPLETED',
  'LISTING_PREPARATION',
  'NOT_READY',
  'LOST',
  'FOLLOW_UP_REQUIRED',
];

export const caoLeadDispositions: CaoLeadDisposition[] = [
  'NEW',
  'WORKING',
  'QUALIFIED',
  'ACTIVE_CLIENT',
  'CLOSED_WON',
  'CLOSED_LOST',
  'NURTURE',
  'ARCHIVED',
];

export const caoBuyerConsultationWorkflowDefinitions: CaoConsultationWorkflowDefinition<CaoBuyerConsultationOutcome>[] = [
  consultation('BUYER', 'SCHEDULED', 'Buyer consultation has a scheduled time or scheduling evidence.', ['Qualified buyer context exists.', 'Consultation scheduling evidence exists.'], ['Consultation occurs, is cancelled, needs reschedule, or requires follow-up.'], ['INTAKE_CONTEXT', 'CUSTOMER_OBJECTIVE', 'PROPERTY_OR_MARKET_CONTEXT', 'TIMELINE', 'FOLLOW_UP_PLAN'], ['Confirm meeting details and prepare property or search context.'], owner('BUYER_ADVISOR', 'OPERATIONS_LEAD', 'BROKER_REVIEW'), ['OWNER_RECORDED', 'TIMESTAMP_RECORDED', 'FOLLOW_UP_RECORDED', 'NO_AUTOMATION_AUTHORIZED'], ['QUALIFIED', 'ACTIVE_CLIENT', 'NURTURE'], false),
  consultation('BUYER', 'COMPLETED', 'Buyer consultation completed with documented summary and recommended next step.', ['Consultation occurred.', 'Customer objective and property/search context were reviewed.'], ['Lead becomes active client, nurture, closed won, or closed lost.'], ['CONSULTATION_SUMMARY', 'OUTCOME_RATIONALE', 'FOLLOW_UP_PLAN'], ['Record next advisory step or closure rationale.'], owner('BUYER_ADVISOR', 'OPERATIONS_LEAD', 'BROKER_REVIEW'), ['OWNER_RECORDED', 'TIMESTAMP_RECORDED', 'FOLLOW_UP_RECORDED', 'DISPOSITION_RECORDED', 'NO_AUTOMATION_AUTHORIZED'], ['ACTIVE_CLIENT', 'CLOSED_WON', 'CLOSED_LOST', 'NURTURE'], false),
  consultation('BUYER', 'RESCHEDULE_REQUIRED', 'Buyer consultation did not occur and requires a new scheduling attempt.', ['Scheduled consultation could not proceed.', 'Customer remains viable for follow-up.'], ['New consultation time is scheduled or lead is moved to nurture/lost.'], ['OUTCOME_RATIONALE', 'FOLLOW_UP_PLAN'], ['Attempt reschedule on the governed follow-up cadence.'], owner('OPERATIONS_LEAD', 'BUYER_ADVISOR', 'BROKER_REVIEW'), ['OWNER_RECORDED', 'TIMESTAMP_RECORDED', 'FOLLOW_UP_RECORDED', 'NO_AUTOMATION_AUTHORIZED'], ['WORKING', 'QUALIFIED', 'NURTURE', 'CLOSED_LOST'], false),
  consultation('BUYER', 'NO_SHOW', 'Buyer missed a scheduled consultation without completed discussion.', ['Consultation was scheduled.', 'Customer did not attend or did not respond.'], ['Follow-up attempt is recorded or lead is dispositioned.'], ['OUTCOME_RATIONALE', 'FOLLOW_UP_PLAN'], ['Record no-show follow-up and next contact attempt or closure reason.'], owner('OPERATIONS_LEAD', 'BUYER_ADVISOR', 'BROKER_REVIEW'), ['OWNER_RECORDED', 'TIMESTAMP_RECORDED', 'FOLLOW_UP_RECORDED', 'NO_AUTOMATION_AUTHORIZED'], ['WORKING', 'NURTURE', 'CLOSED_LOST'], false),
  consultation('BUYER', 'CANCELLED', 'Buyer consultation was cancelled before completion.', ['Cancellation evidence exists.'], ['Lead is rescheduled, nurtured, or closed.'], ['OUTCOME_RATIONALE', 'FOLLOW_UP_PLAN'], ['Record whether customer requested reschedule, pause, or closure.'], owner('OPERATIONS_LEAD', 'BUYER_ADVISOR', 'BROKER_REVIEW'), ['OWNER_RECORDED', 'TIMESTAMP_RECORDED', 'FOLLOW_UP_RECORDED', 'NO_AUTOMATION_AUTHORIZED'], ['WORKING', 'NURTURE', 'CLOSED_LOST'], false),
  consultation('BUYER', 'FOLLOW_UP_REQUIRED', 'Buyer requires follow-up before final consultation outcome or disposition.', ['Consultation or inquiry review identified unresolved next step.'], ['Follow-up is completed, consultation scheduled, or lead is dispositioned.'], ['FOLLOW_UP_PLAN', 'OUTCOME_RATIONALE'], ['Record specific follow-up owner, topic, and expected next action.'], owner('BUYER_ADVISOR', 'OPERATIONS_LEAD', 'BROKER_REVIEW'), ['OWNER_RECORDED', 'TIMESTAMP_RECORDED', 'FOLLOW_UP_RECORDED', 'NO_AUTOMATION_AUTHORIZED'], ['WORKING', 'QUALIFIED', 'NURTURE', 'ACTIVE_CLIENT', 'CLOSED_LOST'], false),
];

export const caoSellerConsultationWorkflowDefinitions: CaoConsultationWorkflowDefinition<CaoSellerConsultationOutcome>[] = [
  consultation('SELLER', 'STRATEGY_MEETING_SCHEDULED', 'Seller strategy meeting has a scheduled time or scheduling evidence.', ['Seller objective and property context exist.', 'Scheduling evidence exists.'], ['Strategy meeting occurs, is cancelled, or requires follow-up.'], ['INTAKE_CONTEXT', 'CUSTOMER_OBJECTIVE', 'PROPERTY_OR_MARKET_CONTEXT', 'TIMELINE', 'FOLLOW_UP_PLAN'], ['Confirm meeting details and prepare seller strategy context.'], owner('LISTING_ADVISOR', 'OPERATIONS_LEAD', 'BROKER_REVIEW'), ['OWNER_RECORDED', 'TIMESTAMP_RECORDED', 'FOLLOW_UP_RECORDED', 'NO_AUTOMATION_AUTHORIZED'], ['QUALIFIED', 'ACTIVE_CLIENT', 'NURTURE'], false),
  consultation('SELLER', 'STRATEGY_COMPLETED', 'Seller strategy consultation completed with documented objective, preparation, and next step.', ['Strategy discussion occurred.', 'Seller objective and property context were reviewed.'], ['Lead enters listing preparation, active client, nurture, won, or lost.'], ['CONSULTATION_SUMMARY', 'OUTCOME_RATIONALE', 'FOLLOW_UP_PLAN'], ['Record seller next step, preparation recommendation, or closure rationale.'], owner('LISTING_ADVISOR', 'OPERATIONS_LEAD', 'BROKER_REVIEW'), ['OWNER_RECORDED', 'TIMESTAMP_RECORDED', 'FOLLOW_UP_RECORDED', 'DISPOSITION_RECORDED', 'NO_AUTOMATION_AUTHORIZED'], ['ACTIVE_CLIENT', 'CLOSED_WON', 'CLOSED_LOST', 'NURTURE'], false),
  consultation('SELLER', 'LISTING_PREPARATION', 'Seller is preparing for potential listing or representation decision.', ['Strategy consultation or review identified preparation work.'], ['Preparation completes, active client relationship begins, or lead is dispositioned.'], ['CONSULTATION_SUMMARY', 'PROPERTY_OR_MARKET_CONTEXT', 'FOLLOW_UP_PLAN'], ['Record preparation owner, topic, and next review point.'], owner('LISTING_ADVISOR', 'OPERATIONS_LEAD', 'BROKER_REVIEW'), ['OWNER_RECORDED', 'TIMESTAMP_RECORDED', 'FOLLOW_UP_RECORDED', 'DISPOSITION_RECORDED', 'NO_AUTOMATION_AUTHORIZED'], ['ACTIVE_CLIENT', 'CLOSED_WON', 'NURTURE', 'CLOSED_LOST'], false),
  consultation('SELLER', 'NOT_READY', 'Seller is not ready for active listing or consultation progression.', ['Seller timing, objective, or preparation status does not support active next step.'], ['Lead enters nurture, follow-up, or closed-lost disposition.'], ['OUTCOME_RATIONALE', 'FOLLOW_UP_PLAN'], ['Record whether future follow-up is appropriate.'], owner('LISTING_ADVISOR', 'OPERATIONS_LEAD', 'BROKER_REVIEW'), ['OWNER_RECORDED', 'TIMESTAMP_RECORDED', 'FOLLOW_UP_RECORDED', 'NO_AUTOMATION_AUTHORIZED'], ['NURTURE', 'CLOSED_LOST'], false),
  consultation('SELLER', 'LOST', 'Seller opportunity ended without active-client conversion.', ['Seller declined, selected another path, or is no longer viable.'], ['Lead is closed lost or archived after review.'], ['OUTCOME_RATIONALE', 'BROKER_REVIEW_NOTE'], ['No follow-up unless a separately documented nurture reason exists.'], owner('LISTING_ADVISOR', 'OPERATIONS_LEAD', 'BROKER_REVIEW'), ['OWNER_RECORDED', 'TIMESTAMP_RECORDED', 'DISPOSITION_RECORDED', 'CLOSURE_REVIEW_RECORDED', 'NO_AUTOMATION_AUTHORIZED'], ['CLOSED_LOST', 'ARCHIVED'], true),
  consultation('SELLER', 'FOLLOW_UP_REQUIRED', 'Seller requires follow-up before final consultation outcome or disposition.', ['Seller review identified unresolved next step.'], ['Follow-up is completed, strategy meeting scheduled, or lead is dispositioned.'], ['FOLLOW_UP_PLAN', 'OUTCOME_RATIONALE'], ['Record specific follow-up owner, topic, and expected next action.'], owner('LISTING_ADVISOR', 'OPERATIONS_LEAD', 'BROKER_REVIEW'), ['OWNER_RECORDED', 'TIMESTAMP_RECORDED', 'FOLLOW_UP_RECORDED', 'NO_AUTOMATION_AUTHORIZED'], ['WORKING', 'QUALIFIED', 'NURTURE', 'ACTIVE_CLIENT', 'CLOSED_LOST'], false),
];

export const caoLeadDispositionDefinitions: CaoLeadDispositionDefinition[] = [
  disposition('NEW', 'Lead has been received and awaits human review.', ['Buyer inquiry, seller request, or CRM task exists.'], ['Human review begins or lead is archived as invalid/duplicate with review note.'], ['INTAKE_CONTEXT'], ['Assign human review owner and initial next action.'], owner('OPERATIONS_LEAD', 'BROKER_REVIEW', 'OPERATIONS_LEAD'), ['OWNER_RECORDED', 'TIMESTAMP_RECORDED', 'NO_AUTOMATION_AUTHORIZED'], ['WORKING', 'ARCHIVED'], false, ['CAO-KPI-INQUIRY-RESPONSE-TIME', 'CAO-KPI-SELLER-RESPONSE-TIME']),
  disposition('WORKING', 'Lead is under active human review or follow-up.', ['Responsible owner has started review.'], ['Lead is qualified, nurtured, closed lost, or archived.'], ['CUSTOMER_OBJECTIVE', 'FOLLOW_UP_PLAN'], ['Record next contact or information needed.'], owner('OPERATIONS_LEAD', 'BROKER_REVIEW', 'OPERATIONS_LEAD'), ['OWNER_RECORDED', 'TIMESTAMP_RECORDED', 'FOLLOW_UP_RECORDED', 'NO_AUTOMATION_AUTHORIZED'], ['QUALIFIED', 'NURTURE', 'CLOSED_LOST', 'ARCHIVED'], false, ['CAO-KPI-SLA-COMPLIANCE', 'CAO-KPI-LEAD-DISPOSITION']),
  disposition('QUALIFIED', 'Lead has sufficient need, timing, and context for a meaningful consultation or active-client decision.', ['Qualification notes exist.', 'Customer objective and timeline are understood.'], ['Consultation is scheduled/completed, lead becomes active client, or lead moves to nurture/lost.'], ['CUSTOMER_OBJECTIVE', 'PROPERTY_OR_MARKET_CONTEXT', 'TIMELINE', 'FOLLOW_UP_PLAN'], ['Schedule or complete consultation, or record why not.'], owner('OPERATIONS_LEAD', 'BROKER_REVIEW', 'BROKER_REVIEW'), ['OWNER_RECORDED', 'TIMESTAMP_RECORDED', 'FOLLOW_UP_RECORDED', 'DISPOSITION_RECORDED', 'NO_AUTOMATION_AUTHORIZED'], ['ACTIVE_CLIENT', 'CLOSED_WON', 'NURTURE', 'CLOSED_LOST'], false, ['CAO-KPI-CONSULTATION-SCHEDULING', 'CAO-KPI-CONSULTATION-COMPLETION', 'CAO-KPI-LEAD-DISPOSITION']),
  disposition('ACTIVE_CLIENT', 'Lead has become an active buyer or seller client under the governed business process.', ['Active-client basis is recorded.', 'Advisor ownership is clear.'], ['Client matter closes, is won, lost, or archived according to broker-reviewed outcome.'], ['CONSULTATION_SUMMARY', 'OUTCOME_RATIONALE', 'BROKER_REVIEW_NOTE'], ['Maintain advisor-owned next action outside automated CAO disposition.'], owner('ADVISOR', 'BROKER_REVIEW', 'BROKER_REVIEW'), ['OWNER_RECORDED', 'TIMESTAMP_RECORDED', 'DISPOSITION_RECORDED', 'NO_AUTOMATION_AUTHORIZED'], ['CLOSED_WON', 'CLOSED_LOST', 'ARCHIVED'], false, ['CAO-KPI-LEAD-DISPOSITION']),
  disposition('CLOSED_WON', 'Lead converted into a successful client outcome or governed business win.', ['Outcome is recorded.', 'Broker review or closure owner evidence exists.'], ['Archive after closure completeness review.'], ['OUTCOME_RATIONALE', 'BROKER_REVIEW_NOTE'], ['No operational follow-up except separately governed client service.'], owner('ADVISOR', 'BROKER_REVIEW', 'BROKER_REVIEW'), ['OWNER_RECORDED', 'TIMESTAMP_RECORDED', 'DISPOSITION_RECORDED', 'CLOSURE_REVIEW_RECORDED', 'NO_AUTOMATION_AUTHORIZED'], ['ARCHIVED'], true, ['CAO-KPI-LEAD-DISPOSITION', 'CAO-KPI-CLOSURE-COMPLETENESS']),
  disposition('CLOSED_LOST', 'Lead ended without conversion and has a documented lost reason.', ['Lost reason is recorded.', 'Closure owner reviewed outcome.'], ['Archive after closure completeness review.'], ['OUTCOME_RATIONALE', 'BROKER_REVIEW_NOTE'], ['No follow-up unless moved to nurture before closure.'], owner('OPERATIONS_LEAD', 'BROKER_REVIEW', 'BROKER_REVIEW'), ['OWNER_RECORDED', 'TIMESTAMP_RECORDED', 'DISPOSITION_RECORDED', 'CLOSURE_REVIEW_RECORDED', 'NO_AUTOMATION_AUTHORIZED'], ['ARCHIVED'], true, ['CAO-KPI-LEAD-DISPOSITION', 'CAO-KPI-CLOSURE-COMPLETENESS']),
  disposition('NURTURE', 'Lead is not ready for active consultation but may merit future human follow-up.', ['Nurture rationale and follow-up condition exist.'], ['Lead is re-qualified, closed lost, or archived.'], ['OUTCOME_RATIONALE', 'FOLLOW_UP_PLAN'], ['Record future review condition and owner.'], owner('OPERATIONS_LEAD', 'BROKER_REVIEW', 'OPERATIONS_LEAD'), ['OWNER_RECORDED', 'TIMESTAMP_RECORDED', 'FOLLOW_UP_RECORDED', 'DISPOSITION_RECORDED', 'NO_AUTOMATION_AUTHORIZED'], ['WORKING', 'QUALIFIED', 'CLOSED_LOST', 'ARCHIVED'], false, ['CAO-KPI-LEAD-DISPOSITION']),
  disposition('ARCHIVED', 'Lead is no longer active for CAO follow-up.', ['Closure, lost, duplicate, invalid, or retention rationale exists.'], ['No further transition without separately authorized reopening.'], ['ARCHIVE_RATIONALE', 'BROKER_REVIEW_NOTE'], ['No operational follow-up.'], owner('OPERATIONS_LEAD', 'BROKER_REVIEW', 'BROKER_REVIEW'), ['OWNER_RECORDED', 'TIMESTAMP_RECORDED', 'CLOSURE_REVIEW_RECORDED', 'NO_AUTOMATION_AUTHORIZED'], [], true, ['CAO-KPI-CLOSURE-COMPLETENESS']),
];

export function canTransitionLeadDisposition(from: CaoLeadDisposition, to: CaoLeadDisposition): boolean {
  const definition = caoLeadDispositionDefinitions.find((item) => item.disposition === from);
  return Boolean(definition?.allowedTransitions.includes(to));
}

export function validateCaoConsultationWorkflowDispositionContract(input: {
  buyerDefinitions?: readonly CaoConsultationWorkflowDefinition<CaoBuyerConsultationOutcome>[];
  sellerDefinitions?: readonly CaoConsultationWorkflowDefinition<CaoSellerConsultationOutcome>[];
  dispositionDefinitions?: readonly CaoLeadDispositionDefinition[];
} = {}): CaoConsultationWorkflowValidationResult {
  const buyerDefinitions = input.buyerDefinitions ?? caoBuyerConsultationWorkflowDefinitions;
  const sellerDefinitions = input.sellerDefinitions ?? caoSellerConsultationWorkflowDefinitions;
  const dispositionDefinitions = input.dispositionDefinitions ?? caoLeadDispositionDefinitions;
  const issues: string[] = [];

  validateConsultationDefinitions('buyer', buyerDefinitions, caoBuyerConsultationOutcomes, 'BUYER', issues);
  validateConsultationDefinitions('seller', sellerDefinitions, caoSellerConsultationOutcomes, 'SELLER', issues);
  validateDispositionDefinitions(dispositionDefinitions, issues);

  if (!canTransitionLeadDisposition('NEW', 'WORKING')) {
    issues.push('Lead disposition transition NEW -> WORKING must be allowed.');
  }

  if (canTransitionLeadDisposition('ARCHIVED', 'WORKING')) {
    issues.push('Lead disposition transition ARCHIVED -> WORKING must fail closed.');
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

function consultation<TOutcome extends CaoConsultationOutcome>(
  engagementType: CaoEngagementType,
  outcome: TOutcome,
  description: string,
  entryCriteria: string[],
  exitCriteria: string[],
  requiredDocumentation: CaoConsultationDocumentationRequirement[],
  requiredFollowUp: string[],
  ownership: CaoConsultationWorkflowDefinition['ownership'],
  auditRequirements: CaoConsultationAuditRequirement[],
  allowedNextDispositions: CaoLeadDisposition[],
  terminal: boolean,
): CaoConsultationWorkflowDefinition<TOutcome> {
  return {
    engagementType,
    outcome,
    description,
    entryCriteria,
    exitCriteria,
    requiredDocumentation,
    requiredFollowUp,
    ownership,
    auditRequirements,
    allowedNextDispositions,
    terminal,
    automationAuthorized: false,
  };
}

function disposition(
  dispositionName: CaoLeadDisposition,
  description: string,
  entryCriteria: string[],
  exitCriteria: string[],
  requiredDocumentation: CaoConsultationDocumentationRequirement[],
  requiredFollowUp: string[],
  ownership: CaoLeadDispositionDefinition['ownership'],
  auditRequirements: CaoConsultationAuditRequirement[],
  allowedTransitions: CaoLeadDisposition[],
  terminal: boolean,
  kpiMappings: CaoKpiIdentifier[],
): CaoLeadDispositionDefinition {
  return {
    disposition: dispositionName,
    description,
    entryCriteria,
    exitCriteria,
    requiredDocumentation,
    requiredFollowUp,
    ownership,
    auditRequirements,
    allowedTransitions,
    terminal,
    kpiMappings,
    automationAuthorized: false,
  };
}

function owner(
  responsibleRole: CaoOperationalRole,
  escalationOwner: CaoOperationalRole,
  closureOwner: CaoOperationalRole,
) {
  return {
    responsibleRole,
    escalationOwner,
    closureOwner,
  };
}

function validateConsultationDefinitions<TOutcome extends CaoConsultationOutcome>(
  label: string,
  definitions: readonly CaoConsultationWorkflowDefinition<TOutcome>[],
  expectedOutcomes: readonly TOutcome[],
  expectedEngagementType: CaoEngagementType,
  issues: string[],
) {
  const definedOutcomes = new Set(definitions.map((definition) => definition.outcome));

  for (const expectedOutcome of expectedOutcomes) {
    if (!definedOutcomes.has(expectedOutcome)) issues.push(`Missing ${label} consultation outcome ${expectedOutcome}.`);
  }

  for (const definition of definitions) {
    if (definition.engagementType !== expectedEngagementType) {
      issues.push(`Consultation outcome ${definition.outcome} has invalid engagement type.`);
    }
    if (!definition.entryCriteria.length) issues.push(`Consultation outcome ${definition.outcome} is missing entry criteria.`);
    if (!definition.exitCriteria.length) issues.push(`Consultation outcome ${definition.outcome} is missing exit criteria.`);
    if (!definition.requiredDocumentation.length) {
      issues.push(`Consultation outcome ${definition.outcome} is missing documentation requirements.`);
    }
    if (!definition.requiredFollowUp.length) issues.push(`Consultation outcome ${definition.outcome} is missing required follow-up.`);
    if (!definition.ownership.responsibleRole || !definition.ownership.escalationOwner || !definition.ownership.closureOwner) {
      issues.push(`Consultation outcome ${definition.outcome} is missing ownership.`);
    }
    if (!definition.auditRequirements.includes('NO_AUTOMATION_AUTHORIZED')) {
      issues.push(`Consultation outcome ${definition.outcome} is missing no-automation audit requirement.`);
    }
    if (!definition.auditRequirements.length) issues.push(`Consultation outcome ${definition.outcome} is missing audit requirements.`);
    if (definition.automationAuthorized !== false) {
      issues.push(`Consultation outcome ${definition.outcome} must keep automation unauthorized.`);
    }
    for (const dispositionName of definition.allowedNextDispositions) {
      if (!caoLeadDispositions.includes(dispositionName)) {
        issues.push(`Consultation outcome ${definition.outcome} references invalid disposition ${dispositionName}.`);
      }
    }
  }
}

function validateDispositionDefinitions(
  definitions: readonly CaoLeadDispositionDefinition[],
  issues: string[],
) {
  const definedDispositions = new Set(definitions.map((definition) => definition.disposition));

  for (const expectedDisposition of caoLeadDispositions) {
    if (!definedDispositions.has(expectedDisposition)) issues.push(`Missing lead disposition ${expectedDisposition}.`);
  }

  for (const definition of definitions) {
    if (!definition.entryCriteria.length) issues.push(`Lead disposition ${definition.disposition} is missing entry criteria.`);
    if (!definition.exitCriteria.length) issues.push(`Lead disposition ${definition.disposition} is missing exit criteria.`);
    if (!definition.requiredDocumentation.length) {
      issues.push(`Lead disposition ${definition.disposition} is missing documentation requirements.`);
    }
    if (!definition.ownership.responsibleRole || !definition.ownership.escalationOwner || !definition.ownership.closureOwner) {
      issues.push(`Lead disposition ${definition.disposition} is missing ownership.`);
    }
    if (!definition.auditRequirements.includes('NO_AUTOMATION_AUTHORIZED')) {
      issues.push(`Lead disposition ${definition.disposition} is missing no-automation audit requirement.`);
    }
    if (!definition.auditRequirements.length) issues.push(`Lead disposition ${definition.disposition} is missing audit requirements.`);
    if (definition.automationAuthorized !== false) {
      issues.push(`Lead disposition ${definition.disposition} must keep automation unauthorized.`);
    }
    if (!definition.kpiMappings.length) issues.push(`Lead disposition ${definition.disposition} is missing KPI mappings.`);
    if (definition.terminal && definition.allowedTransitions.some((state) => state !== 'ARCHIVED')) {
      issues.push(`Terminal lead disposition ${definition.disposition} has invalid non-archive transition.`);
    }
    for (const nextDisposition of definition.allowedTransitions) {
      if (!caoLeadDispositions.includes(nextDisposition)) {
        issues.push(`Lead disposition ${definition.disposition} references invalid transition ${nextDisposition}.`);
      }
    }
  }
}
