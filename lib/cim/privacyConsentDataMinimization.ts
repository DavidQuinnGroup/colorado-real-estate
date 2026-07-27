import {
  cimAllowedPayloadFields,
  cimProhibitedPayloadFields,
  type CimActivationStatus,
  type CimPayloadField,
  type CimProhibitedPayloadField,
} from './measurementContract.js';

export type CimConsentPrerequisite = 'REQUIRED' | 'OPTIONAL' | 'NOT_APPLICABLE' | 'BLOCKED';

export type CimPrivacyLevel = 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'PROHIBITED';

export type CimIdentityLevel = 'ANONYMOUS' | 'PSEUDONYMOUS' | 'IDENTIFIED';

export type CimRetentionClass = 'NONE' | 'SESSION_ONLY' | 'SHORT_TERM' | 'LONG_TERM';

export type CimDeletionClass = 'IMMEDIATE' | 'EXPIRATION' | 'USER_REQUEST' | 'LEGAL_EXCEPTION';

export type CimActivationPrerequisite =
  | 'CONTRACT_ONLY'
  | 'PRIVACY_REVIEW_REQUIRED'
  | 'EXPLICIT_CONSENT_REQUIRED'
  | 'DATA_STEWARD_APPROVAL_REQUIRED'
  | 'PERSISTENCE_AUTHORIZATION_REQUIRED'
  | 'BLOCKED_BY_POLICY';

export type CimMeasurementCategoryId =
  | 'search_engagement'
  | 'property_engagement'
  | 'market_engagement'
  | 'seller_engagement'
  | 'cta_engagement'
  | 'journey_completion'
  | 'journey_abandonment'
  | 'navigation_transition'
  | 'lead_attribution'
  | 'measurement_governance';

export type CimMeasurementCategoryPolicy = {
  id: CimMeasurementCategoryId;
  description: string;
  consentPrerequisite: CimConsentPrerequisite;
  privacyLevel: CimPrivacyLevel;
  allowedData: CimPayloadField[];
  prohibitedData: CimProhibitedPayloadField[];
  identityLevel: CimIdentityLevel;
  retention: CimRetentionClass;
  deletion: CimDeletionClass;
  activationPrerequisite: CimActivationPrerequisite;
  activationStatus: CimActivationStatus;
};

export type CimPrivacyConsentValidationResult = {
  valid: boolean;
  issues: string[];
};

export const CIM_PRIVACY_CONSENT_CONTRACT_VERSION = 'CIM-1.0-SPRINT-2';

export const cimPermittedTechnicalMetadata: CimPayloadField[] = [
  'page_identifier',
  'route',
  'feature_identifier',
  'coarse_timestamp',
  'anonymous_journey_stage',
  'journey_transition',
  'event_version',
  'consent_state',
];

export const cimExplicitlyProhibitedData: CimProhibitedPayloadField[] = [
  'name',
  'email',
  'phone',
  'message_body',
  'free_text_search_terms',
  'precise_address',
  'internal_identifier',
  'protected_intelligence',
  'crm_identifier',
  'seller_lead_identifier',
  'alert_identifier',
  'raw_ip_address',
  'device_fingerprint',
];

const anonymousTechnicalContext: CimPayloadField[] = [
  'page_identifier',
  'route',
  'feature_identifier',
  'coarse_timestamp',
  'anonymous_journey_stage',
  'event_version',
  'consent_state',
];

const transitionContext: CimPayloadField[] = [...anonymousTechnicalContext, 'journey_transition'];

export const cimMeasurementCategoryPolicies: CimMeasurementCategoryPolicy[] = [
  {
    id: 'search_engagement',
    description: 'Governed search behavior without free-text terms, precise addresses, or internal identifiers.',
    consentPrerequisite: 'REQUIRED',
    privacyLevel: 'INTERNAL',
    allowedData: anonymousTechnicalContext,
    prohibitedData: cimExplicitlyProhibitedData,
    identityLevel: 'ANONYMOUS',
    retention: 'SESSION_ONLY',
    deletion: 'EXPIRATION',
    activationPrerequisite: 'EXPLICIT_CONSENT_REQUIRED',
    activationStatus: 'INACTIVE',
  },
  {
    id: 'property_engagement',
    description: 'Governed property-detail behavior without inquiry content, personal identity, or protected intelligence.',
    consentPrerequisite: 'REQUIRED',
    privacyLevel: 'INTERNAL',
    allowedData: anonymousTechnicalContext,
    prohibitedData: cimExplicitlyProhibitedData,
    identityLevel: 'ANONYMOUS',
    retention: 'SESSION_ONLY',
    deletion: 'EXPIRATION',
    activationPrerequisite: 'EXPLICIT_CONSENT_REQUIRED',
    activationStatus: 'INACTIVE',
  },
  {
    id: 'market_engagement',
    description: 'Governed market-page behavior using only coarse page and feature context.',
    consentPrerequisite: 'REQUIRED',
    privacyLevel: 'INTERNAL',
    allowedData: anonymousTechnicalContext,
    prohibitedData: cimExplicitlyProhibitedData,
    identityLevel: 'ANONYMOUS',
    retention: 'SESSION_ONLY',
    deletion: 'EXPIRATION',
    activationPrerequisite: 'EXPLICIT_CONSENT_REQUIRED',
    activationStatus: 'INACTIVE',
  },
  {
    id: 'seller_engagement',
    description: 'Governed seller journey behavior before any form submission and without seller lead identifiers.',
    consentPrerequisite: 'REQUIRED',
    privacyLevel: 'CONFIDENTIAL',
    allowedData: anonymousTechnicalContext,
    prohibitedData: cimExplicitlyProhibitedData,
    identityLevel: 'ANONYMOUS',
    retention: 'SESSION_ONLY',
    deletion: 'EXPIRATION',
    activationPrerequisite: 'EXPLICIT_CONSENT_REQUIRED',
    activationStatus: 'INACTIVE',
  },
  {
    id: 'cta_engagement',
    description: 'Governed call-to-action interaction context without personal details or message content.',
    consentPrerequisite: 'REQUIRED',
    privacyLevel: 'INTERNAL',
    allowedData: anonymousTechnicalContext,
    prohibitedData: cimExplicitlyProhibitedData,
    identityLevel: 'ANONYMOUS',
    retention: 'SESSION_ONLY',
    deletion: 'EXPIRATION',
    activationPrerequisite: 'EXPLICIT_CONSENT_REQUIRED',
    activationStatus: 'INACTIVE',
  },
  {
    id: 'journey_completion',
    description: 'Governed cross-surface journey completion context requiring future session governance.',
    consentPrerequisite: 'REQUIRED',
    privacyLevel: 'CONFIDENTIAL',
    allowedData: transitionContext,
    prohibitedData: cimExplicitlyProhibitedData,
    identityLevel: 'PSEUDONYMOUS',
    retention: 'SHORT_TERM',
    deletion: 'USER_REQUEST',
    activationPrerequisite: 'DATA_STEWARD_APPROVAL_REQUIRED',
    activationStatus: 'INACTIVE',
  },
  {
    id: 'journey_abandonment',
    description: 'Governed abandonment context that is blocked until session and consent rules exist.',
    consentPrerequisite: 'BLOCKED',
    privacyLevel: 'CONFIDENTIAL',
    allowedData: transitionContext,
    prohibitedData: cimExplicitlyProhibitedData,
    identityLevel: 'PSEUDONYMOUS',
    retention: 'SHORT_TERM',
    deletion: 'USER_REQUEST',
    activationPrerequisite: 'BLOCKED_BY_POLICY',
    activationStatus: 'INACTIVE',
  },
  {
    id: 'navigation_transition',
    description: 'Governed movement between certified surfaces using coarse transition context only.',
    consentPrerequisite: 'REQUIRED',
    privacyLevel: 'INTERNAL',
    allowedData: transitionContext,
    prohibitedData: cimExplicitlyProhibitedData,
    identityLevel: 'ANONYMOUS',
    retention: 'SESSION_ONLY',
    deletion: 'EXPIRATION',
    activationPrerequisite: 'EXPLICIT_CONSENT_REQUIRED',
    activationStatus: 'INACTIVE',
  },
  {
    id: 'lead_attribution',
    description: 'Lead attribution is blocked because it requires identity, CRM, seller-lead, inquiry, alert, or persistence governance.',
    consentPrerequisite: 'BLOCKED',
    privacyLevel: 'PROHIBITED',
    allowedData: [],
    prohibitedData: cimExplicitlyProhibitedData,
    identityLevel: 'IDENTIFIED',
    retention: 'NONE',
    deletion: 'IMMEDIATE',
    activationPrerequisite: 'BLOCKED_BY_POLICY',
    activationStatus: 'INACTIVE',
  },
  {
    id: 'measurement_governance',
    description: 'Contract-only governance state for blocked or missing-consent measurement decisions.',
    consentPrerequisite: 'NOT_APPLICABLE',
    privacyLevel: 'PUBLIC',
    allowedData: ['page_identifier', 'route', 'feature_identifier', 'coarse_timestamp', 'event_version', 'consent_state'],
    prohibitedData: cimExplicitlyProhibitedData,
    identityLevel: 'ANONYMOUS',
    retention: 'NONE',
    deletion: 'IMMEDIATE',
    activationPrerequisite: 'CONTRACT_ONLY',
    activationStatus: 'INACTIVE',
  },
];

export function getCimMeasurementCategoryPolicy(id: string) {
  return cimMeasurementCategoryPolicies.find((policy) => policy.id === id) ?? null;
}

export function validateCimPrivacyConsentDataMinimizationGate(
  policies: CimMeasurementCategoryPolicy[] = cimMeasurementCategoryPolicies,
): CimPrivacyConsentValidationResult {
  const issues: string[] = [];
  const ids = new Set<string>();
  const allowedFields = new Set(cimAllowedPayloadFields);
  const prohibitedFields = new Set(cimProhibitedPayloadFields);

  for (const policy of policies) {
    if (ids.has(policy.id)) issues.push(`${policy.id}: duplicate measurement category.`);
    ids.add(policy.id);

    if (policy.activationStatus !== 'INACTIVE') {
      issues.push(`${policy.id}: activation status must remain INACTIVE.`);
    }

    if (policy.consentPrerequisite === 'BLOCKED' && policy.activationPrerequisite !== 'BLOCKED_BY_POLICY') {
      issues.push(`${policy.id}: blocked consent requires BLOCKED_BY_POLICY activation prerequisite.`);
    }

    if (policy.privacyLevel === 'PROHIBITED' && policy.retention !== 'NONE') {
      issues.push(`${policy.id}: prohibited privacy requires NONE retention.`);
    }

    if (policy.privacyLevel === 'PROHIBITED' && policy.deletion !== 'IMMEDIATE') {
      issues.push(`${policy.id}: prohibited privacy requires IMMEDIATE deletion.`);
    }

    if (policy.identityLevel === 'IDENTIFIED' && policy.privacyLevel !== 'PROHIBITED') {
      issues.push(`${policy.id}: identified measurement is prohibited unless privacy level is PROHIBITED.`);
    }

    if (policy.identityLevel === 'ANONYMOUS' && policy.retention === 'LONG_TERM') {
      issues.push(`${policy.id}: anonymous measurement cannot use LONG_TERM retention in CIM Sprint 2.`);
    }

    if (policy.retention === 'NONE' && policy.deletion !== 'IMMEDIATE') {
      issues.push(`${policy.id}: NONE retention requires IMMEDIATE deletion.`);
    }

    if (policy.retention === 'LONG_TERM' && policy.deletion !== 'LEGAL_EXCEPTION') {
      issues.push(`${policy.id}: LONG_TERM retention requires LEGAL_EXCEPTION deletion classification.`);
    }

    for (const field of policy.allowedData) {
      if (!allowedFields.has(field)) {
        issues.push(`${policy.id}: unsupported allowed data field ${field}.`);
      }
      if ((prohibitedFields as Set<string>).has(field)) {
        issues.push(`${policy.id}: prohibited data field ${field} cannot be allowed.`);
      }
    }

    for (const field of policy.prohibitedData) {
      if (!prohibitedFields.has(field)) {
        issues.push(`${policy.id}: unknown prohibited data field ${field}.`);
      }
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
