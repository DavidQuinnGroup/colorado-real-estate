import type { PropertyGeographicSourceIntelligence } from './property/propertyAuthoritativeSourceIntelligence';
import type { PropertyComparisonWorkspace } from './propertyComparisonIntelligence';
import type { PropertyProduct31Input } from './propertyProduct31';

export const PROPERTY_EVIDENCE_COMPLETENESS_VERIFICATION_STATUS =
  'PROPERTY_EVIDENCE_COMPLETENESS_VERIFICATION_IMPLEMENTED' as const;

export type PropertyEvidenceCompletenessState =
  | 'SUPPORTED FACT'
  | 'DERIVED / CALCULATED'
  | 'UNAVAILABLE'
  | 'VERIFICATION REQUIRED'
  | 'PROFESSIONAL JUDGMENT';

export type PropertyEvidenceVerificationAction =
  | 'CHECK SOURCE'
  | 'ASK SELLER / LISTING AGENT'
  | 'VERIFY WITH COUNTY'
  | 'REVIEW HOA DOCUMENTS'
  | 'DISCUSS WITH INSPECTOR'
  | 'DISCUSS WITH ATTORNEY'
  | 'DISCUSS WITH LENDER'
  | 'DISCUSS WITH TAX PROFESSIONAL'
  | 'DISCUSS WITH APPRAISER';

export type PropertyEvidenceDomainKey =
  | 'LISTING_MLS_EVIDENCE'
  | 'PROPERTY_CHARACTERISTICS'
  | 'PRICE_LISTING_HISTORY'
  | 'LOCATION_PLACE_CONTEXT'
  | 'PUBLIC_RECORD_EVIDENCE'
  | 'TAX_EVIDENCE'
  | 'PERMIT_EVIDENCE'
  | 'HOA_ASSOCIATION_EVIDENCE'
  | 'CONDITION_INSPECTION_EVIDENCE'
  | 'TITLE_LEGAL_EVIDENCE'
  | 'FINANCING_RELATED_INPUTS';

export type PropertyEvidenceCompletenessDomain = {
  key: PropertyEvidenceDomainKey;
  label: string;
  state: PropertyEvidenceCompletenessState;
  evidenceAvailable: string;
  missingOrUnverified: string;
  verificationQuestion: string;
  verificationAction: PropertyEvidenceVerificationAction;
  optionalProfessionalHandoff: string;
};

export type PropertyEvidenceCompletenessVerification = {
  status: typeof PROPERTY_EVIDENCE_COMPLETENESS_VERIFICATION_STATUS;
  question: string;
  sourceMethodologyHref: '/sources';
  domains: PropertyEvidenceCompletenessDomain[];
  comparisonBoundary: string;
  customerTrustBoundaries: string[];
  protectedBoundaries: {
    score: false;
    percentage: false;
    grade: false;
    rating: false;
    ranking: false;
    suitability: false;
    valuationCertainty: false;
    financialQualification: false;
    investmentRecommendation: false;
    protectedClassInference: false;
    providerActivation: false;
    countyActivation: false;
    bcodActivation: false;
    recordRetrieval: false;
    publicGis: false;
    apiMutation: false;
    inquiryMutation: false;
    contactMutation: false;
    crmEmail: false;
    persistence: false;
    telemetry: false;
    customerDataExpansion: false;
    customerProfiling: false;
  };
};

type BuilderInput = {
  property: PropertyProduct31Input;
  authoritativeSources: PropertyGeographicSourceIntelligence;
  comparisonIntelligence: PropertyComparisonWorkspace;
};

function hasValue(value: unknown) {
  return value !== null && value !== undefined && value !== '';
}

function hasCoreListingEvidence(property: PropertyProduct31Input) {
  return [property.price, property.status, property.propertyType, property.city].filter(hasValue).length >= 3;
}

function hasPropertyCharacteristicEvidence(property: PropertyProduct31Input) {
  return [property.beds, property.baths, property.sqft, property.yearBuilt, property.lotSize].filter(hasValue).length >= 3;
}

function sourceClaimEligible(authoritativeSources: PropertyGeographicSourceIntelligence, category: string) {
  return authoritativeSources.selectedSources.some((source) => source.category === category && source.claimEligible);
}

export function buildPropertyEvidenceCompletenessVerification({
  property,
  authoritativeSources,
  comparisonIntelligence,
}: BuilderInput): PropertyEvidenceCompletenessVerification {
  const listingSupported = hasCoreListingEvidence(property);
  const characteristicsSupported = hasPropertyCharacteristicEvidence(property);
  const locationSupported =
    sourceClaimEligible(authoritativeSources, 'CITY_PLACE_CONTEXT') ||
    sourceClaimEligible(authoritativeSources, 'LOCAL_MARKET_CONTEXT') ||
    hasValue(property.city);
  const hasComparisonContext = comparisonIntelligence.canCompare && comparisonIntelligence.comparisons.length > 0;

  const domains: PropertyEvidenceCompletenessDomain[] = [
    {
      key: 'LISTING_MLS_EVIDENCE',
      label: 'Listing / MLS evidence',
      state: listingSupported ? 'SUPPORTED FACT' : 'VERIFICATION REQUIRED',
      evidenceAvailable: listingSupported
        ? 'Current public listing fields support basic orientation.'
        : 'Only limited public listing fields are available on this property page.',
      missingOrUnverified: 'Listing status, included items, remarks, measurements, media, and recent updates still need direct confirmation.',
      verificationQuestion: 'Are the visible listing facts current and confirmed by the listing source?',
      verificationAction: 'ASK SELLER / LISTING AGENT',
      optionalProfessionalHandoff: 'REAL ESTATE AGENT',
    },
    {
      key: 'PROPERTY_CHARACTERISTICS',
      label: 'Property characteristics',
      state: characteristicsSupported ? 'SUPPORTED FACT' : 'VERIFICATION REQUIRED',
      evidenceAvailable: characteristicsSupported
        ? 'Listed size, room count, year-built, or lot facts support a first-pass review.'
        : 'Important listed physical characteristics are missing or partial.',
      missingOrUnverified: 'Measurements, finished area, room count, lot dimensions, inclusions, and actual configuration remain verification-bound.',
      verificationQuestion: 'Which physical characteristics should be confirmed before comparing this property?',
      verificationAction: 'CHECK SOURCE',
      optionalProfessionalHandoff: 'REAL ESTATE AGENT',
    },
    {
      key: 'PRICE_LISTING_HISTORY',
      label: 'Price / listing history',
      state: hasValue(property.price) || hasComparisonContext ? 'DERIVED / CALCULATED' : 'VERIFICATION REQUIRED',
      evidenceAvailable: hasValue(property.price)
        ? 'The current listed price is available as a public listing fact.'
        : 'No current listed price is available in the existing property facts.',
      missingOrUnverified: 'Prior price changes, days-on-market context, seller concessions, and listing-history interpretation are not independently verified here.',
      verificationQuestion: 'What listing-history context should be confirmed before treating the current price as decision evidence?',
      verificationAction: 'ASK SELLER / LISTING AGENT',
      optionalProfessionalHandoff: 'REAL ESTATE AGENT',
    },
    {
      key: 'LOCATION_PLACE_CONTEXT',
      label: 'Location / place context',
      state: locationSupported ? 'SUPPORTED FACT' : 'VERIFICATION REQUIRED',
      evidenceAvailable: locationSupported
        ? 'Existing governed place and city context can orient the property.'
        : 'Location context is limited to the property fields currently available.',
      missingOrUnverified: 'Boundaries, commute assumptions, environmental conditions, insurance constraints, and parcel-level geography are not confirmed by this page.',
      verificationQuestion: 'Which location assumptions matter enough to verify with source materials or in-person review?',
      verificationAction: 'CHECK SOURCE',
      optionalProfessionalHandoff: 'REAL ESTATE AGENT',
    },
    {
      key: 'PUBLIC_RECORD_EVIDENCE',
      label: 'Public record evidence',
      state: 'VERIFICATION REQUIRED',
      evidenceAvailable: 'The architecture identifies public-record domains, but customer record retrieval remains off.',
      missingOrUnverified: 'Assessor, tax, and permit records require source confirmation before they become customer-facing evidence.',
      verificationQuestion: 'Which county record should be verified before relying on a public-record claim?',
      verificationAction: 'VERIFY WITH COUNTY',
      optionalProfessionalHandoff: 'REAL ESTATE AGENT',
    },
    {
      key: 'TAX_EVIDENCE',
      label: 'Tax evidence',
      state: 'UNAVAILABLE',
      evidenceAvailable: 'No live tax record is retrieved or displayed by this experience.',
      missingOrUnverified: 'Assessed value, tax history, exemptions, mill levies, special districts, and future tax assumptions remain outside this page.',
      verificationQuestion: 'What tax records or assumptions should be reviewed before estimating ownership cost?',
      verificationAction: 'DISCUSS WITH TAX PROFESSIONAL',
      optionalProfessionalHandoff: 'TAX PROFESSIONAL',
    },
    {
      key: 'PERMIT_EVIDENCE',
      label: 'Permit evidence',
      state: 'UNAVAILABLE',
      evidenceAvailable: 'No permit record is retrieved or displayed by this experience.',
      missingOrUnverified: 'Remodel history, open permits, final inspections, unpermitted work, and code history remain unverified.',
      verificationQuestion: 'Are permit records or construction history material enough to verify before inspection or offer decisions?',
      verificationAction: 'VERIFY WITH COUNTY',
      optionalProfessionalHandoff: 'INSPECTOR / ENGINEER',
    },
    {
      key: 'HOA_ASSOCIATION_EVIDENCE',
      label: 'HOA / association evidence',
      state: 'UNAVAILABLE',
      evidenceAvailable: 'No HOA document package, dues history, reserve study, rules, or minutes are retrieved by this experience.',
      missingOrUnverified: 'Fees, restrictions, insurance obligations, reserves, pending assessments, rental rules, and architectural controls require document review.',
      verificationQuestion: 'Which association documents should be reviewed before accepting HOA-related obligations?',
      verificationAction: 'REVIEW HOA DOCUMENTS',
      optionalProfessionalHandoff: 'ATTORNEY',
    },
    {
      key: 'CONDITION_INSPECTION_EVIDENCE',
      label: 'Condition / inspection evidence',
      state: 'PROFESSIONAL JUDGMENT',
      evidenceAvailable: 'Listing photos and public facts can help prepare inspection questions.',
      missingOrUnverified: 'Roof, structure, drainage, mechanical systems, electrical, plumbing, environmental conditions, and maintenance history require qualified review.',
      verificationQuestion: 'What inspection scope is appropriate for the age, systems, site, and visible condition of this property?',
      verificationAction: 'DISCUSS WITH INSPECTOR',
      optionalProfessionalHandoff: 'INSPECTOR / ENGINEER',
    },
    {
      key: 'TITLE_LEGAL_EVIDENCE',
      label: 'Title / legal evidence',
      state: 'PROFESSIONAL JUDGMENT',
      evidenceAvailable: 'Public listing context does not replace title, deed, easement, disclosure, or contract review.',
      missingOrUnverified: 'Title exceptions, easements, covenants, water rights, encroachments, disclosures, and contract terms are not concluded here.',
      verificationQuestion: 'What legal or title materials should be reviewed before relying on property rights or obligations?',
      verificationAction: 'DISCUSS WITH ATTORNEY',
      optionalProfessionalHandoff: 'ATTORNEY',
    },
    {
      key: 'FINANCING_RELATED_INPUTS',
      label: 'Financing-related inputs',
      state: 'PROFESSIONAL JUDGMENT',
      evidenceAvailable: 'Listed price can frame a lender conversation, but this page does not qualify the buyer or quote financing.',
      missingOrUnverified: 'Rate, loan terms, insurance, appraisal, reserves, closing costs, and buyer-specific qualification remain professional and lender-bound.',
      verificationQuestion: 'Which financing assumptions should be confirmed before treating ownership cost as decision-ready?',
      verificationAction: 'DISCUSS WITH LENDER',
      optionalProfessionalHandoff: 'LENDER',
    },
  ];

  return {
    status: PROPERTY_EVIDENCE_COMPLETENESS_VERIFICATION_STATUS,
    question:
      'How complete is the evidence currently available for this property, what is missing or unverified, and what should be verified before making a decision?',
    sourceMethodologyHref: '/sources',
    domains,
    comparisonBoundary:
      'Evidence gaps can explain why two properties are harder to compare, but missing evidence is not a property-quality signal and does not rank one property above another.',
    customerTrustBoundaries: [
      'DATA AVAILABILITY DOES NOT EQUAL PROPERTY QUALITY',
      'MISSING DATA DOES NOT EQUAL NEGATIVE PROPERTY CONDITION',
      'PUBLIC RECORD DOES NOT GUARANTEE CURRENT CONDITION',
      'MLS/LISTING INFORMATION DOES NOT EQUAL INDEPENDENT VERIFICATION',
    ],
    protectedBoundaries: {
      score: false,
      percentage: false,
      grade: false,
      rating: false,
      ranking: false,
      suitability: false,
      valuationCertainty: false,
      financialQualification: false,
      investmentRecommendation: false,
      protectedClassInference: false,
      providerActivation: false,
      countyActivation: false,
      bcodActivation: false,
      recordRetrieval: false,
      publicGis: false,
      apiMutation: false,
      inquiryMutation: false,
      contactMutation: false,
      crmEmail: false,
      persistence: false,
      telemetry: false,
      customerDataExpansion: false,
      customerProfiling: false,
    },
  };
}
