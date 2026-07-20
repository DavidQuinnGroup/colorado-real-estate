export const PUBLIC_TRUST_REVIEW_STATUS = 'DRAFT_FOR_OWNER_AND_COUNSEL_REVIEW';

export const SITE_URL = 'https://davidquinngroup.com';
export const SITE_NAME = 'David Quinn Group';
export const PRODUCT_NAME = 'Real Estate Intelligence Engine';
export const BROKERAGE_FIRM_NAME = 'Compass Colorado, LLC, d/b/a Compass';
export const PUBLIC_TEAM_NAME = 'David Quinn Group';
export const COMPASS_MARKETING_APPROVAL_GATE = 'COMPASS_MARKETING_APPROVAL_REQUIRED';
export const COMPASS_BRANDING_CLASSIFICATION = 'COMPASS_BRANDING_REQUIRES_OWNER_MARKETING_REVIEW';
export const FAIR_HOUSING_CLASSIFICATION = 'FAIR_HOUSING_DRAFT_READY_FOR_BROKERAGE_REVIEW';
export const LISTING_ADVERTISING_CLASSIFICATION = 'LISTING_ADVERTISING_REQUIRES_MLS_AND_COMPASS_REVIEW';
export const PRIVACY_CLASSIFICATION = 'PRIVACY_DRAFT_READY_FOR_COMPASS_AND_COUNSEL_REVIEW';

export const publicTrustRoutes = [
  {
    href: '/privacy',
    label: 'Privacy',
    title: 'Privacy Notice',
    description: 'Draft privacy notice for David Quinn Group public forms and REIE customer workflows.',
  },
  {
    href: '/terms',
    label: 'Terms',
    title: 'Terms of Use',
    description: 'Draft terms for using David Quinn Group public pages, property search, and inquiry tools.',
  },
  {
    href: '/accessibility',
    label: 'Accessibility',
    title: 'Accessibility',
    description: 'Draft accessibility statement and owner-review items for the David Quinn Group website.',
  },
  {
    href: '/fair-housing',
    label: 'Fair Housing',
    title: 'Fair Housing',
    description: 'Fair housing commitment page for David Quinn Group public real estate experiences.',
  },
  {
    href: '/brokerage-disclosures',
    label: 'Brokerage Disclosures',
    title: 'Brokerage Disclosures',
    description: 'Draft brokerage disclosure review page for owner and counsel confirmation.',
  },
  {
    href: '/contact',
    label: 'Contact',
    title: 'Contact',
    description: 'Contact and inquiry routing information for David Quinn Group.',
  },
] as const;

export const ownerVerificationItems = [
  'Legal entity/operator for the website and customer records.',
  'Brokerage legal or approved trade name.',
  'Public-facing team name.',
  "David Quinn's licensed name.",
  'Colorado real-estate license number.',
  'Compass office or branch.',
  'Employing Broker or Sales Manager, if required.',
  'Approved Compass logo asset.',
  'Approved Compass email address.',
  'Approved Compass.com profile or office URL.',
  'Public business telephone.',
  'Public office address.',
  'Team-member identification requirements.',
  'Compass Marketing approval status and evidence date.',
  'Brokerage affiliation, license number, office address, responsible broker, and required Colorado disclosure wording.',
  'Public contact email address, phone number, mailing address, and privacy/accessibility request channel.',
  'Approved privacy practices, retention schedule, data-rights workflow, and cookie/analytics disclosures.',
  'MLS/IDX attribution, display, copyright, and provider-specific disclosure requirements.',
  'Approved fair housing, accessibility, brokerage, and terms language after owner and counsel review.',
];

export const ownerVerificationRegister = [
  { fact: 'Brokerage legal or approved trade name', status: 'VERIFIED_FROM_COMPASS_POLICY_MANUAL', value: BROKERAGE_FIRM_NAME },
  { fact: 'Public-facing team name', status: 'OWNER_CONFIRMATION_REQUIRED', value: PUBLIC_TEAM_NAME },
  { fact: "David Quinn's licensed name", status: 'OWNER_CONFIRMATION_REQUIRED', value: null },
  { fact: 'Colorado real-estate license number', status: 'OWNER_CONFIRMATION_REQUIRED', value: null },
  { fact: 'Compass office or branch', status: 'OWNER_CONFIRMATION_REQUIRED', value: null },
  { fact: 'Employing Broker or Sales Manager, if required', status: 'OWNER_CONFIRMATION_REQUIRED', value: null },
  { fact: 'Approved Compass logo asset', status: 'OWNER_MARKETING_REVIEW_REQUIRED', value: null },
  { fact: 'Approved Compass email address', status: 'OWNER_CONFIRMATION_REQUIRED', value: null },
  { fact: 'Approved Compass.com profile or office URL', status: 'OWNER_CONFIRMATION_REQUIRED', value: null },
  { fact: 'Public business telephone', status: 'OWNER_CONFIRMATION_REQUIRED', value: null },
  { fact: 'Public office address', status: 'OWNER_CONFIRMATION_REQUIRED', value: null },
  { fact: 'Team-member identification requirements', status: 'OWNER_BROKERAGE_REVIEW_REQUIRED', value: null },
  { fact: 'Compass Marketing approval status and evidence date', status: COMPASS_MARKETING_APPROVAL_GATE, value: null },
] as const;

export const ownerVerificationQuestionnaire = [
  {
    category: 'Identity and Brokerage',
    questions: [
      'Confirm the exact public-facing team name because it appears in the global brokerage attribution and trust pages; blocks controlled beta.',
      "Confirm David Quinn's licensed name because it may need to appear in brokerage disclosures and advertising attribution; blocks public launch.",
      'Confirm whether David Quinn Group may be described as a team, brand, or another approved relationship under Compass because the site must not imply it is a separate brokerage; blocks controlled beta.',
    ],
  },
  {
    category: 'Compass Approval and Branding',
    questions: [
      'Provide Compass Marketing Team written approval status and evidence date because Compass policy requires approval before development/go-live for Compass-affiliated websites; blocks public launch.',
      'Provide an approved Compass logo asset and display rules because Compass-affiliated websites require prominent approved branding; blocks public launch.',
      'Provide the approved Compass.com profile, office, or agent URL because Compass policy requires a properly formatted Compass URL; blocks public launch.',
    ],
  },
  {
    category: 'Contact Information',
    questions: [
      'Confirm the approved Compass email address because Compass policy requires the proper Compass email on agent websites; blocks public launch.',
      'Confirm the public business telephone and office address because contact and brokerage disclosure pages cannot publish unverified values; blocks public launch.',
      'Confirm the privacy and accessibility request contact channel because privacy/accessibility pages need a reliable request route; blocks controlled beta.',
    ],
  },
  {
    category: 'Licensing',
    questions: [
      'Confirm the Colorado real-estate license number and required display format because brokerage advertising may require license identification; blocks public launch.',
      'Confirm the Compass office or branch and employing broker or sales manager if required because brokerage disclosure wording may require those facts; blocks public launch.',
      'Confirm team-member identification requirements because shared attribution must identify the team and brokerage relationship accurately; blocks controlled beta.',
    ],
  },
  {
    category: 'MLS and Listing Attribution',
    questions: [
      'Confirm MLS/IDX attribution text, copyright language, and listing-photo rights because property pages currently report the provider-review gap; blocks public launch.',
      'Confirm whether each public listing can map to a verified Compass.com listing URL because Compass policy requires listing pages to link back to Compass.com; blocks public launch.',
      'Confirm expiration/withdrawn-listing removal obligations and source update cadence because public listing advertising must remain accurate; blocks controlled beta.',
    ],
  },
  {
    category: 'Privacy Practices',
    questions: [
      'Confirm the site operator/data controller because the privacy page cannot infer the responsible business; blocks controlled beta.',
      'Confirm retention, deletion, correction, portability, opt-out, children-data, data-sale, targeted-advertising, and security-contact practices because the privacy page lists them as unresolved; blocks public launch.',
      'Confirm third-party processors and analytics/cookie practices because the privacy page must match actual application behavior and Compass approval requirements; blocks controlled beta.',
    ],
  },
  {
    category: 'Legal Review',
    questions: [
      'Confirm owner/counsel approval for Privacy, Terms, Brokerage Disclosures, Accessibility, and Fair Housing pages because all remain draft; blocks public launch.',
      'Confirm approved brokerage-relationship disclaimer language because form notices must not replace Commission-approved disclosures; blocks controlled beta.',
    ],
  },
  {
    category: 'Fair Housing',
    questions: [
      'Confirm whether an authorized Equal Housing Opportunity logo asset is available because the site currently uses the slogan only; blocks public launch.',
      'Confirm brokerage-approved fair-housing language because fair-housing copy remains draft for brokerage review; blocks public launch.',
    ],
  },
] as const;

export const verifiedDataPractices = [
  'Property inquiry forms collect property reference, email address, optional name, optional phone, selected timing/intent, optional notes, and a source value.',
  'Saved-search and strategy-intake forms collect email address, market/search criteria, selected goal/timeline, optional notes, and selected lifestyle anchors when provided.',
  'Submitted property inquiries and saved-search/intake requests are stored in the application database through Prisma-backed public API routes.',
  'Property inquiries and saved-search/intake requests can create CRM follow-up tasks and first-party interaction records.',
  'High-priority property inquiries can attempt an internal property-inquiry email notification when configured.',
  'Saved-search alert and digest email systems include unsubscribe behavior and click-tracking redirects for internal delivery analysis.',
  'Search uses Supabase/Postgres as the business data source and Typesense as a replaceable search index where available.',
  'Map views use third-party map tile providers where map components render public tiles.',
];

export const unavailableOrUnverifiedPractices = [
  'No owner-approved public privacy policy, terms, brokerage disclosure, accessibility statement, or fair housing disclosure is marked approved.',
  'No verified public phone number, office address, brokerage license number, responsible broker, or provider-required MLS attribution text was confirmed in repository sources.',
  'No external advertising, surveillance, or third-party analytics provider was confirmed for this package.',
  'Compass Marketing Team approval, approved Compass logo asset, approved Compass email address, and Compass.com profile/listing URL mapping require owner confirmation.',
  'MLS_ATTRIBUTION_REQUIRES_OWNER_PROVIDER_REVIEW',
];

export function getBrokerageAttributionSummary() {
  return `${PUBLIC_TEAM_NAME} is presented as a public-facing team or brand pending owner verification and is not presented as a separate brokerage. Brokerage Firm: ${BROKERAGE_FIRM_NAME}.`;
}
