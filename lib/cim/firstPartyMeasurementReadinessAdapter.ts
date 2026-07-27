import {
  CIM_ACTIVATION_STATUS,
  cimAllowedPayloadFields,
  cimEventDefinitions,
  cimProhibitedPayloadFields,
  getCimEventDefinition,
  validateCimMeasurementContract,
  type CimActivationStatus,
  type CimConsentRequirement,
  type CimEventDefinition,
  type CimPayloadField,
  type CimPrivacyClassification,
  type CimProhibitedPayloadField,
} from './measurementContract.js';
import {
  cimMeasurementCategoryPolicies,
  getCimMeasurementCategoryPolicy,
  validateCimPrivacyConsentDataMinimizationGate,
  type CimConsentPrerequisite,
  type CimMeasurementCategoryId,
  type CimMeasurementCategoryPolicy,
  type CimPrivacyLevel,
} from './privacyConsentDataMinimization.js';

export type CimFirstPartyAdapterStatus = 'FAIL_CLOSED' | 'READY_INACTIVE';

export type CimFirstPartyAdapterConsentState = 'MISSING' | 'PRESENT' | 'NOT_APPLICABLE' | 'BLOCKED';

export type CimFirstPartyMeasurementPayload = Partial<Record<CimPayloadField | CimProhibitedPayloadField | string, unknown>>;

export type CimFirstPartyMeasurementReadinessRequest = {
  eventIdentifier: string;
  payload?: CimFirstPartyMeasurementPayload;
  consentState?: CimFirstPartyAdapterConsentState;
  activationAttempted?: boolean;
  transmissionAttempted?: boolean;
  persistenceAttempted?: boolean;
};

export type CimFirstPartyMeasurementReadinessDecision = {
  status: CimFirstPartyAdapterStatus;
  activationStatus: CimActivationStatus;
  eventIdentifier: string | null;
  measurementCategory: CimMeasurementCategoryId | null;
  canEmit: false;
  canTransmit: false;
  canPersist: false;
  issues: string[];
};

export type CimFirstPartyMeasurementReadinessValidationResult = {
  valid: boolean;
  issues: string[];
};

export const CIM_FIRST_PARTY_MEASUREMENT_READINESS_ADAPTER_VERSION = 'CIM-1.0-SPRINT-3';

export const CIM_FIRST_PARTY_MEASUREMENT_ADAPTER_DEFAULT_STATUS: CimFirstPartyAdapterStatus = 'FAIL_CLOSED';

const eventToMeasurementCategory: Record<string, CimMeasurementCategoryId> = {
  search_started: 'search_engagement',
  search_refined: 'search_engagement',
  search_completed: 'search_engagement',
  property_viewed: 'property_engagement',
  property_scrolled: 'property_engagement',
  property_inquiry_started: 'cta_engagement',
  property_tour_started: 'cta_engagement',
  market_viewed: 'market_engagement',
  neighborhood_market_viewed: 'market_engagement',
  valuation_started: 'seller_engagement',
  valuation_completed: 'seller_engagement',
  journey_started: 'journey_completion',
  journey_completed: 'journey_completion',
  journey_abandoned: 'journey_abandonment',
  navigation_transition: 'navigation_transition',
  measurement_blocked: 'measurement_governance',
  consent_missing: 'measurement_governance',
};

const privacyCompatibility: Record<CimPrivacyClassification, CimPrivacyLevel[]> = {
  PUBLIC_SAFE_CONTEXT: ['PUBLIC', 'INTERNAL'],
  ANONYMOUS_BEHAVIORAL_CONTEXT: ['INTERNAL', 'CONFIDENTIAL'],
  CONSENT_DEPENDENT_BEHAVIORAL_CONTEXT: ['INTERNAL', 'CONFIDENTIAL'],
  PROHIBITED_SENSITIVE_CONTEXT: ['PROHIBITED'],
};

const consentCompatibility: Record<CimConsentRequirement, CimConsentPrerequisite[]> = {
  NO_CONSENT_REQUIRED_FOR_CONTRACT_ONLY: ['NOT_APPLICABLE'],
  CONSENT_REQUIRED_BEFORE_COLLECTION: ['REQUIRED', 'BLOCKED'],
  EXPLICIT_FORM_CONTEXT_REQUIRED_BEFORE_COLLECTION: ['REQUIRED', 'BLOCKED'],
  NOT_COLLECTIBLE: ['BLOCKED'],
};

function failClosed(
  request: Partial<CimFirstPartyMeasurementReadinessRequest>,
  issues: string[],
  measurementCategory: CimMeasurementCategoryId | null = null,
): CimFirstPartyMeasurementReadinessDecision {
  return {
    status: 'FAIL_CLOSED',
    activationStatus: CIM_ACTIVATION_STATUS,
    eventIdentifier: request.eventIdentifier ?? null,
    measurementCategory,
    canEmit: false,
    canTransmit: false,
    canPersist: false,
    issues,
  };
}

function readyInactive(
  event: CimEventDefinition,
  policy: CimMeasurementCategoryPolicy,
): CimFirstPartyMeasurementReadinessDecision {
  return {
    status: 'READY_INACTIVE',
    activationStatus: CIM_ACTIVATION_STATUS,
    eventIdentifier: event.identifier,
    measurementCategory: policy.id,
    canEmit: false,
    canTransmit: false,
    canPersist: false,
    issues: [],
  };
}

function validatePayload(event: CimEventDefinition, policy: CimMeasurementCategoryPolicy, payload: CimFirstPartyMeasurementPayload) {
  const issues: string[] = [];
  const allowedPayload = new Set(event.allowedPayload);
  const policyAllowedData = new Set(policy.allowedData);
  const canonicalAllowedFields = new Set(cimAllowedPayloadFields);
  const prohibitedFields = new Set<string>([...cimProhibitedPayloadFields, ...event.prohibitedPayload, ...policy.prohibitedData]);

  for (const field of Object.keys(payload)) {
    if (prohibitedFields.has(field)) {
      issues.push(`${event.identifier}: prohibited payload field ${field}.`);
    }
    if (!canonicalAllowedFields.has(field as CimPayloadField)) {
      issues.push(`${event.identifier}: unknown payload field ${field}.`);
    }
    if (!allowedPayload.has(field as CimPayloadField)) {
      issues.push(`${event.identifier}: payload field ${field} is not allowed by event contract.`);
    }
    if (!policyAllowedData.has(field as CimPayloadField)) {
      issues.push(`${event.identifier}: payload field ${field} is not allowed by privacy policy ${policy.id}.`);
    }
  }

  return issues;
}

function validateConsent(policy: CimMeasurementCategoryPolicy, consentState: CimFirstPartyAdapterConsentState | undefined) {
  if (policy.consentPrerequisite === 'BLOCKED') return ['Measurement category is blocked by policy.'];
  if (policy.consentPrerequisite === 'NOT_APPLICABLE') {
    return consentState === 'NOT_APPLICABLE' || consentState === undefined ? [] : ['Consent state must be NOT_APPLICABLE for contract-only measurement governance.'];
  }
  if (policy.consentPrerequisite === 'REQUIRED') {
    return consentState === 'PRESENT' ? [] : ['Consent is required before measurement readiness can be accepted.'];
  }
  if (policy.consentPrerequisite === 'OPTIONAL') {
    return consentState === 'BLOCKED' ? ['Consent state is explicitly blocked.'] : [];
  }
  return ['Unrecognized consent prerequisite.'];
}

export function evaluateCimFirstPartyMeasurementReadiness(
  request: Partial<CimFirstPartyMeasurementReadinessRequest> = {},
): CimFirstPartyMeasurementReadinessDecision {
  const issues: string[] = [];

  if (!request.eventIdentifier) return failClosed(request, ['Missing canonical event identifier.']);
  if (request.activationAttempted) issues.push(`${request.eventIdentifier}: activation attempt rejected.`);
  if (request.transmissionAttempted) issues.push(`${request.eventIdentifier}: transmission attempt rejected.`);
  if (request.persistenceAttempted) issues.push(`${request.eventIdentifier}: persistence attempt rejected.`);

  const event = getCimEventDefinition(request.eventIdentifier);
  if (!event) return failClosed(request, [...issues, `${request.eventIdentifier}: unknown CIM event.`]);

  const categoryId = eventToMeasurementCategory[event.identifier] ?? null;
  if (!categoryId) return failClosed(request, [...issues, `${event.identifier}: unidentified measurement governance.`]);

  const policy = getCimMeasurementCategoryPolicy(categoryId);
  if (!policy) return failClosed(request, [...issues, `${event.identifier}: missing measurement category policy.`], categoryId);

  if (event.activationStatus !== 'INACTIVE' || policy.activationStatus !== 'INACTIVE' || CIM_ACTIVATION_STATUS !== 'INACTIVE') {
    issues.push(`${event.identifier}: activation state must remain INACTIVE.`);
  }

  if (!privacyCompatibility[event.privacyClassification]?.includes(policy.privacyLevel)) {
    issues.push(`${event.identifier}: event privacy classification is incompatible with ${policy.id}.`);
  }

  if (!consentCompatibility[event.consentRequirement]?.includes(policy.consentPrerequisite)) {
    issues.push(`${event.identifier}: event consent requirement is incompatible with ${policy.id}.`);
  }

  issues.push(...validateConsent(policy, request.consentState));
  issues.push(...validatePayload(event, policy, request.payload ?? {}));

  const taxonomyValidation = validateCimMeasurementContract();
  if (!taxonomyValidation.valid) issues.push(...taxonomyValidation.issues);

  const privacyValidation = validateCimPrivacyConsentDataMinimizationGate();
  if (!privacyValidation.valid) issues.push(...privacyValidation.issues);

  return issues.length ? failClosed(request, issues, policy.id) : readyInactive(event, policy);
}

export function validateCimFirstPartyMeasurementReadinessAdapter(
  policies: CimMeasurementCategoryPolicy[] = cimMeasurementCategoryPolicies,
): CimFirstPartyMeasurementReadinessValidationResult {
  const issues: string[] = [];
  const policyById = new Map(policies.map((policy) => [policy.id, policy]));

  if (CIM_FIRST_PARTY_MEASUREMENT_ADAPTER_DEFAULT_STATUS !== 'FAIL_CLOSED') {
    issues.push('First-party measurement adapter default status must remain FAIL_CLOSED.');
  }

  for (const event of cimEventDefinitions) {
    const categoryId = eventToMeasurementCategory[event.identifier];
    if (!categoryId) {
      issues.push(`${event.identifier}: no measurement category mapping.`);
      continue;
    }

    const policy = policyById.get(categoryId);
    if (!policy) {
      issues.push(`${event.identifier}: mapped policy ${categoryId} is missing.`);
      continue;
    }

    if (event.activationStatus !== 'INACTIVE' || policy.activationStatus !== 'INACTIVE') {
      issues.push(`${event.identifier}: adapter compatibility requires inactive event and policy.`);
    }

    if (!privacyCompatibility[event.privacyClassification]?.includes(policy.privacyLevel)) {
      issues.push(`${event.identifier}: event privacy classification is incompatible with ${policy.id}.`);
    }

    if (!consentCompatibility[event.consentRequirement]?.includes(policy.consentPrerequisite)) {
      issues.push(`${event.identifier}: event consent requirement is incompatible with ${policy.id}.`);
    }
  }

  const validInactiveDecision = evaluateCimFirstPartyMeasurementReadiness({
    eventIdentifier: 'search_started',
    payload: {
      page_identifier: 'search',
      route: '/search',
      feature_identifier: 'search-entry',
      event_version: CIM_FIRST_PARTY_MEASUREMENT_READINESS_ADAPTER_VERSION,
      consent_state: 'present',
    },
    consentState: 'PRESENT',
  });

  if (validInactiveDecision.status !== 'READY_INACTIVE') {
    issues.push(`Valid inactive adapter decision should be READY_INACTIVE: ${validInactiveDecision.issues.join('; ')}`);
  }
  if (validInactiveDecision.canEmit || validInactiveDecision.canTransmit || validInactiveDecision.canPersist) {
    issues.push('Valid inactive adapter decision must not emit, transmit, or persist.');
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
