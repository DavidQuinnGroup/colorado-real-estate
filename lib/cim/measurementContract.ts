export type CimEventDomain = 'search' | 'property' | 'market' | 'seller' | 'journey' | 'navigation' | 'measurement';

export type CimActivationStatus = 'INACTIVE';

export type CimPrivacyClassification =
  | 'PUBLIC_SAFE_CONTEXT'
  | 'ANONYMOUS_BEHAVIORAL_CONTEXT'
  | 'CONSENT_DEPENDENT_BEHAVIORAL_CONTEXT'
  | 'PROHIBITED_SENSITIVE_CONTEXT';

export type CimConsentRequirement =
  | 'NO_CONSENT_REQUIRED_FOR_CONTRACT_ONLY'
  | 'CONSENT_REQUIRED_BEFORE_COLLECTION'
  | 'EXPLICIT_FORM_CONTEXT_REQUIRED_BEFORE_COLLECTION'
  | 'NOT_COLLECTIBLE';

export type CimPayloadField =
  | 'page_identifier'
  | 'route'
  | 'feature_identifier'
  | 'coarse_timestamp'
  | 'anonymous_journey_stage'
  | 'journey_transition'
  | 'event_version'
  | 'consent_state';

export type CimProhibitedPayloadField =
  | 'name'
  | 'email'
  | 'phone'
  | 'message_body'
  | 'free_text_search_terms'
  | 'precise_address'
  | 'internal_identifier'
  | 'protected_intelligence'
  | 'crm_identifier'
  | 'seller_lead_identifier'
  | 'alert_identifier'
  | 'raw_ip_address'
  | 'device_fingerprint';

export type CimKpiMapping = {
  id: string;
  label: string;
  readiness: 'EXISTING_ENTERPRISE_KPI' | 'CIM_SEMANTIC_KPI_DEFINED_NOT_ACTIVE';
  activationStatus: CimActivationStatus;
};

export type CimEventDefinition = {
  identifier: string;
  domain: CimEventDomain;
  description: string;
  owner: string;
  kpiMappings: string[];
  allowedPayload: CimPayloadField[];
  prohibitedPayload: CimProhibitedPayloadField[];
  privacyClassification: CimPrivacyClassification;
  consentRequirement: CimConsentRequirement;
  activationStatus: CimActivationStatus;
};

export type CimValidationResult = {
  valid: boolean;
  issues: string[];
};

export const CIM_MEASUREMENT_CONTRACT_VERSION = 'CIM-1.0-SPRINT-1';

export const CIM_ACTIVATION_STATUS: CimActivationStatus = 'INACTIVE';

export const cimAllowedPayloadFields: CimPayloadField[] = [
  'page_identifier',
  'route',
  'feature_identifier',
  'coarse_timestamp',
  'anonymous_journey_stage',
  'journey_transition',
  'event_version',
  'consent_state',
];

export const cimProhibitedPayloadFields: CimProhibitedPayloadField[] = [
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

const baseAllowedPayload: CimPayloadField[] = [
  'page_identifier',
  'route',
  'feature_identifier',
  'coarse_timestamp',
  'anonymous_journey_stage',
  'event_version',
  'consent_state',
];

const transitionPayload: CimPayloadField[] = [...baseAllowedPayload, 'journey_transition'];

const allProhibitedPayload = cimProhibitedPayloadFields;

export const cimKpiMappings: CimKpiMapping[] = [
  { id: 'KPI-CUST-002', label: 'Preview Sessions', readiness: 'EXISTING_ENTERPRISE_KPI', activationStatus: 'INACTIVE' },
  { id: 'KPI-CUST-003', label: 'Searches Performed', readiness: 'EXISTING_ENTERPRISE_KPI', activationStatus: 'INACTIVE' },
  { id: 'KPI-CUST-004', label: 'Property Detail Views', readiness: 'EXISTING_ENTERPRISE_KPI', activationStatus: 'INACTIVE' },
  { id: 'KPI-CUST-005', label: 'Repeat Preview Usage', readiness: 'EXISTING_ENTERPRISE_KPI', activationStatus: 'INACTIVE' },
  { id: 'KPI-BUS-001', label: 'Core Workflow Adoption', readiness: 'EXISTING_ENTERPRISE_KPI', activationStatus: 'INACTIVE' },
  { id: 'KPI-BUS-002', label: 'Feature Adoption Coverage', readiness: 'EXISTING_ENTERPRISE_KPI', activationStatus: 'INACTIVE' },
  { id: 'KPI-GROW-001', label: 'Preview Participant Activation Rate', readiness: 'EXISTING_ENTERPRISE_KPI', activationStatus: 'INACTIVE' },
  { id: 'KPI-GROW-002', label: 'Preview Participant Retention', readiness: 'EXISTING_ENTERPRISE_KPI', activationStatus: 'INACTIVE' },
  { id: 'CIM-KPI-MARKET-ENGAGEMENT', label: 'Market Engagement', readiness: 'CIM_SEMANTIC_KPI_DEFINED_NOT_ACTIVE', activationStatus: 'INACTIVE' },
  { id: 'CIM-KPI-SELLER-INTENT', label: 'Seller Intent', readiness: 'CIM_SEMANTIC_KPI_DEFINED_NOT_ACTIVE', activationStatus: 'INACTIVE' },
  { id: 'CIM-KPI-CTA-ENGAGEMENT', label: 'CTA Engagement', readiness: 'CIM_SEMANTIC_KPI_DEFINED_NOT_ACTIVE', activationStatus: 'INACTIVE' },
  { id: 'CIM-KPI-JOURNEY-COMPLETION', label: 'Journey Completion', readiness: 'CIM_SEMANTIC_KPI_DEFINED_NOT_ACTIVE', activationStatus: 'INACTIVE' },
  { id: 'CIM-KPI-CONSENT-BLOCKED-MEASUREMENT', label: 'Consent Blocked Measurement', readiness: 'CIM_SEMANTIC_KPI_DEFINED_NOT_ACTIVE', activationStatus: 'INACTIVE' },
];

export const cimEventDefinitions: CimEventDefinition[] = [
  {
    identifier: 'search_started',
    domain: 'search',
    description: 'A customer begins a governed search journey from a certified public surface.',
    owner: 'Customer Experience Platform',
    kpiMappings: ['KPI-CUST-003', 'KPI-BUS-001'],
    allowedPayload: baseAllowedPayload,
    prohibitedPayload: allProhibitedPayload,
    privacyClassification: 'ANONYMOUS_BEHAVIORAL_CONTEXT',
    consentRequirement: 'CONSENT_REQUIRED_BEFORE_COLLECTION',
    activationStatus: 'INACTIVE',
  },
  {
    identifier: 'search_refined',
    domain: 'search',
    description: 'A customer changes governed search refinements without collecting raw search terms.',
    owner: 'Customer Experience Platform',
    kpiMappings: ['KPI-CUST-003', 'KPI-BUS-002'],
    allowedPayload: baseAllowedPayload,
    prohibitedPayload: allProhibitedPayload,
    privacyClassification: 'ANONYMOUS_BEHAVIORAL_CONTEXT',
    consentRequirement: 'CONSENT_REQUIRED_BEFORE_COLLECTION',
    activationStatus: 'INACTIVE',
  },
  {
    identifier: 'search_completed',
    domain: 'search',
    description: 'A governed search resolves to a customer-safe result state.',
    owner: 'Search Runtime',
    kpiMappings: ['KPI-CUST-003', 'KPI-BUS-001'],
    allowedPayload: baseAllowedPayload,
    prohibitedPayload: allProhibitedPayload,
    privacyClassification: 'ANONYMOUS_BEHAVIORAL_CONTEXT',
    consentRequirement: 'CONSENT_REQUIRED_BEFORE_COLLECTION',
    activationStatus: 'INACTIVE',
  },
  {
    identifier: 'property_viewed',
    domain: 'property',
    description: 'A customer views a certified public property-detail experience.',
    owner: 'Property Intelligence Experience',
    kpiMappings: ['KPI-CUST-004', 'KPI-BUS-001'],
    allowedPayload: baseAllowedPayload,
    prohibitedPayload: allProhibitedPayload,
    privacyClassification: 'ANONYMOUS_BEHAVIORAL_CONTEXT',
    consentRequirement: 'CONSENT_REQUIRED_BEFORE_COLLECTION',
    activationStatus: 'INACTIVE',
  },
  {
    identifier: 'property_scrolled',
    domain: 'property',
    description: 'A customer reaches a governed property-detail section without collecting protected or internal intelligence.',
    owner: 'Property Intelligence Experience',
    kpiMappings: ['KPI-CUST-004', 'KPI-BUS-002'],
    allowedPayload: baseAllowedPayload,
    prohibitedPayload: allProhibitedPayload,
    privacyClassification: 'ANONYMOUS_BEHAVIORAL_CONTEXT',
    consentRequirement: 'CONSENT_REQUIRED_BEFORE_COLLECTION',
    activationStatus: 'INACTIVE',
  },
  {
    identifier: 'property_inquiry_started',
    domain: 'property',
    description: 'A customer opens or begins the governed property inquiry path before any submission.',
    owner: 'Conversion Intelligence',
    kpiMappings: ['CIM-KPI-CTA-ENGAGEMENT', 'KPI-BUS-001'],
    allowedPayload: baseAllowedPayload,
    prohibitedPayload: allProhibitedPayload,
    privacyClassification: 'CONSENT_DEPENDENT_BEHAVIORAL_CONTEXT',
    consentRequirement: 'EXPLICIT_FORM_CONTEXT_REQUIRED_BEFORE_COLLECTION',
    activationStatus: 'INACTIVE',
  },
  {
    identifier: 'property_tour_started',
    domain: 'property',
    description: 'A customer begins the governed tour-intent path before any submission.',
    owner: 'Conversion Intelligence',
    kpiMappings: ['CIM-KPI-CTA-ENGAGEMENT', 'KPI-BUS-001'],
    allowedPayload: baseAllowedPayload,
    prohibitedPayload: allProhibitedPayload,
    privacyClassification: 'CONSENT_DEPENDENT_BEHAVIORAL_CONTEXT',
    consentRequirement: 'EXPLICIT_FORM_CONTEXT_REQUIRED_BEFORE_COLLECTION',
    activationStatus: 'INACTIVE',
  },
  {
    identifier: 'market_viewed',
    domain: 'market',
    description: 'A customer views a governed city or market discovery surface.',
    owner: 'Market Intelligence Experience',
    kpiMappings: ['CIM-KPI-MARKET-ENGAGEMENT', 'KPI-BUS-002'],
    allowedPayload: baseAllowedPayload,
    prohibitedPayload: allProhibitedPayload,
    privacyClassification: 'ANONYMOUS_BEHAVIORAL_CONTEXT',
    consentRequirement: 'CONSENT_REQUIRED_BEFORE_COLLECTION',
    activationStatus: 'INACTIVE',
  },
  {
    identifier: 'neighborhood_market_viewed',
    domain: 'market',
    description: 'A customer views a governed neighborhood market surface without activating GIS provider data.',
    owner: 'Market Intelligence Experience',
    kpiMappings: ['CIM-KPI-MARKET-ENGAGEMENT', 'KPI-BUS-002'],
    allowedPayload: baseAllowedPayload,
    prohibitedPayload: allProhibitedPayload,
    privacyClassification: 'ANONYMOUS_BEHAVIORAL_CONTEXT',
    consentRequirement: 'CONSENT_REQUIRED_BEFORE_COLLECTION',
    activationStatus: 'INACTIVE',
  },
  {
    identifier: 'valuation_started',
    domain: 'seller',
    description: 'A customer begins the governed seller review or valuation-intent path before submission.',
    owner: 'Seller Acquisition',
    kpiMappings: ['CIM-KPI-SELLER-INTENT', 'KPI-GROW-001'],
    allowedPayload: baseAllowedPayload,
    prohibitedPayload: allProhibitedPayload,
    privacyClassification: 'CONSENT_DEPENDENT_BEHAVIORAL_CONTEXT',
    consentRequirement: 'EXPLICIT_FORM_CONTEXT_REQUIRED_BEFORE_COLLECTION',
    activationStatus: 'INACTIVE',
  },
  {
    identifier: 'valuation_completed',
    domain: 'seller',
    description: 'A governed seller review or valuation-intent flow reaches a completion state, subject to separate mutation and consent governance.',
    owner: 'Seller Acquisition',
    kpiMappings: ['CIM-KPI-SELLER-INTENT', 'KPI-GROW-001'],
    allowedPayload: baseAllowedPayload,
    prohibitedPayload: allProhibitedPayload,
    privacyClassification: 'CONSENT_DEPENDENT_BEHAVIORAL_CONTEXT',
    consentRequirement: 'EXPLICIT_FORM_CONTEXT_REQUIRED_BEFORE_COLLECTION',
    activationStatus: 'INACTIVE',
  },
  {
    identifier: 'journey_started',
    domain: 'journey',
    description: 'A customer begins a governed cross-surface journey.',
    owner: 'Customer Intelligence and Measurement',
    kpiMappings: ['KPI-CUST-002', 'KPI-GROW-001'],
    allowedPayload: transitionPayload,
    prohibitedPayload: allProhibitedPayload,
    privacyClassification: 'ANONYMOUS_BEHAVIORAL_CONTEXT',
    consentRequirement: 'CONSENT_REQUIRED_BEFORE_COLLECTION',
    activationStatus: 'INACTIVE',
  },
  {
    identifier: 'journey_completed',
    domain: 'journey',
    description: 'A customer completes a governed cross-surface journey, subject to future session and consent governance.',
    owner: 'Customer Intelligence and Measurement',
    kpiMappings: ['CIM-KPI-JOURNEY-COMPLETION', 'KPI-BUS-001'],
    allowedPayload: transitionPayload,
    prohibitedPayload: allProhibitedPayload,
    privacyClassification: 'CONSENT_DEPENDENT_BEHAVIORAL_CONTEXT',
    consentRequirement: 'CONSENT_REQUIRED_BEFORE_COLLECTION',
    activationStatus: 'INACTIVE',
  },
  {
    identifier: 'journey_abandoned',
    domain: 'journey',
    description: 'A future governed session indicates abandonment; this remains unavailable until session infrastructure is authorized.',
    owner: 'Customer Intelligence and Measurement',
    kpiMappings: ['CIM-KPI-JOURNEY-COMPLETION', 'KPI-CUST-005'],
    allowedPayload: transitionPayload,
    prohibitedPayload: allProhibitedPayload,
    privacyClassification: 'CONSENT_DEPENDENT_BEHAVIORAL_CONTEXT',
    consentRequirement: 'CONSENT_REQUIRED_BEFORE_COLLECTION',
    activationStatus: 'INACTIVE',
  },
  {
    identifier: 'navigation_transition',
    domain: 'navigation',
    description: 'A customer follows a governed navigation path between certified journey surfaces.',
    owner: 'Customer Experience Platform',
    kpiMappings: ['CIM-KPI-CTA-ENGAGEMENT', 'KPI-BUS-002'],
    allowedPayload: transitionPayload,
    prohibitedPayload: allProhibitedPayload,
    privacyClassification: 'ANONYMOUS_BEHAVIORAL_CONTEXT',
    consentRequirement: 'CONSENT_REQUIRED_BEFORE_COLLECTION',
    activationStatus: 'INACTIVE',
  },
  {
    identifier: 'measurement_blocked',
    domain: 'measurement',
    description: 'A measurement action is blocked by governance, activation, privacy, or safety prerequisites.',
    owner: 'Customer Intelligence and Measurement',
    kpiMappings: ['CIM-KPI-CONSENT-BLOCKED-MEASUREMENT'],
    allowedPayload: ['page_identifier', 'route', 'feature_identifier', 'coarse_timestamp', 'event_version', 'consent_state'],
    prohibitedPayload: allProhibitedPayload,
    privacyClassification: 'PUBLIC_SAFE_CONTEXT',
    consentRequirement: 'NO_CONSENT_REQUIRED_FOR_CONTRACT_ONLY',
    activationStatus: 'INACTIVE',
  },
  {
    identifier: 'consent_missing',
    domain: 'measurement',
    description: 'A future collector would be required to remain inactive because consent is missing or insufficient.',
    owner: 'Customer Intelligence and Measurement',
    kpiMappings: ['CIM-KPI-CONSENT-BLOCKED-MEASUREMENT'],
    allowedPayload: ['page_identifier', 'route', 'feature_identifier', 'coarse_timestamp', 'event_version', 'consent_state'],
    prohibitedPayload: allProhibitedPayload,
    privacyClassification: 'PUBLIC_SAFE_CONTEXT',
    consentRequirement: 'NO_CONSENT_REQUIRED_FOR_CONTRACT_ONLY',
    activationStatus: 'INACTIVE',
  },
];

export function getCimEventDefinition(identifier: string) {
  return cimEventDefinitions.find((event) => event.identifier === identifier) ?? null;
}

export function validateCimMeasurementContract(
  events: CimEventDefinition[] = cimEventDefinitions,
  kpiMappings: CimKpiMapping[] = cimKpiMappings,
): CimValidationResult {
  const issues: string[] = [];
  const eventIds = new Set<string>();
  const definedKpis = new Set(kpiMappings.map((mapping) => mapping.id));
  const allowedFields = new Set(cimAllowedPayloadFields);
  const prohibitedFields = new Set(cimProhibitedPayloadFields);

  for (const mapping of kpiMappings) {
    if (mapping.activationStatus !== 'INACTIVE') {
      issues.push(`${mapping.id}: KPI mapping activation status must remain INACTIVE.`);
    }
  }

  for (const event of events) {
    if (eventIds.has(event.identifier)) {
      issues.push(`${event.identifier}: duplicate event identifier.`);
    }
    eventIds.add(event.identifier);

    if (event.activationStatus !== 'INACTIVE') {
      issues.push(`${event.identifier}: activation status must remain INACTIVE.`);
    }

    if (!event.kpiMappings.length) {
      issues.push(`${event.identifier}: at least one KPI mapping is required.`);
    }

    for (const kpiId of event.kpiMappings) {
      if (!definedKpis.has(kpiId)) {
        issues.push(`${event.identifier}: undefined KPI mapping ${kpiId}.`);
      }
    }

    for (const field of event.allowedPayload) {
      if (!allowedFields.has(field)) {
        issues.push(`${event.identifier}: unsupported allowed payload field ${field}.`);
      }
      if ((prohibitedFields as Set<string>).has(field)) {
        issues.push(`${event.identifier}: prohibited payload field ${field} cannot be allowed.`);
      }
    }

    for (const field of event.prohibitedPayload) {
      if (!prohibitedFields.has(field)) {
        issues.push(`${event.identifier}: unknown prohibited payload field ${field}.`);
      }
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
