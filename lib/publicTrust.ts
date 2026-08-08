export const PUBLIC_TRUST_REVIEW_STATUS = 'PUBLIC_TRUST_PRODUCTION_READY';

export const SITE_URL = 'https://davidquinngroup.com';
export const SITE_NAME = 'David Quinn Group';
export const PRODUCT_NAME = 'Real Estate Intelligence Engine';
export const BROKERAGE_FIRM_NAME = 'Compass Colorado, LLC, d/b/a Compass';
export const PUBLIC_TEAM_NAME = 'David Quinn Group';
export const PUBLIC_CONTACT_EMAIL = null;
export const PUBLIC_CONTACT_EMAIL_STATUS = 'BRANDED_CONTACT_EMAIL_PENDING';
export const PUBLIC_CONTACT_CHANNEL = 'CONTACT_FORM_WORKFLOW';
export const PUBLIC_NOTIFICATION_EMAIL = 'alerts@davidquinngroup.com';
export const COMPASS_MARKETING_APPROVAL_GATE = 'COMPASS_MARKETING_EXTERNAL_APPROVAL_REQUIRED';
export const COMPASS_BRANDING_CLASSIFICATION = 'COMPASS_BRANDING_EXTERNAL_ASSET_APPROVAL_REQUIRED';
export const FAIR_HOUSING_CLASSIFICATION = 'FAIR_HOUSING_PRODUCTION_READY_TEXT_ONLY';
export const LISTING_ADVERTISING_CLASSIFICATION = 'LISTING_ADVERTISING_BASELINE_READY_EXTERNAL_ATTRIBUTION_APPROVAL_REQUIRED';
export const PRIVACY_CLASSIFICATION = 'PRIVACY_PRODUCTION_READY';

export const publicTrustRoutes = [
  {
    href: '/privacy',
    label: 'Privacy',
    title: 'Privacy Notice',
    description: 'Privacy notice for David Quinn Group public forms and REIE customer workflows.',
  },
  {
    href: '/terms',
    label: 'Terms',
    title: 'Terms of Use',
    description: 'Terms for using David Quinn Group public pages, property search, and inquiry tools.',
  },
  {
    href: '/accessibility',
    label: 'Accessibility',
    title: 'Accessibility',
    description: 'Accessibility statement and support contact information for the David Quinn Group website.',
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
    description: 'Brokerage disclosure page for David Quinn Group public real estate experiences.',
  },
  {
    href: '/sources',
    label: 'Sources & Methodology',
    title: 'Sources & Methodology',
    description: 'Public methodology page for REIE source classification, freshness, limitations, and evidence boundaries.',
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
  'Branded public contact email address and privacy/accessibility request channel.',
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
  'Compass Marketing external approval status and evidence date.',
  'Brokerage affiliation, license number, office address, responsible broker, and required Colorado disclosure wording.',
  'Public phone number and mailing address.',
  'Retention schedule, data-rights workflow, and cookie/analytics disclosures.',
  'MLS/IDX attribution, display, copyright, and provider-specific disclosure requirements.',
];

export const ownerVerificationRegister = [
  { fact: 'Website operator and public brand', status: 'OWNER_APPROVED_FOR_PUBLIC_CONTACT_LAYER', value: PUBLIC_TEAM_NAME },
  { fact: 'Brokerage legal or approved trade name', status: 'VERIFIED_FROM_COMPASS_POLICY_MANUAL', value: BROKERAGE_FIRM_NAME },
  { fact: 'Public-facing team name', status: 'OWNER_APPROVED_FOR_PUBLIC_CONTACT_LAYER', value: PUBLIC_TEAM_NAME },
  { fact: 'Public contact email address', status: PUBLIC_CONTACT_EMAIL_STATUS, value: PUBLIC_CONTACT_EMAIL },
  { fact: 'privacy/accessibility request channel', status: PUBLIC_CONTACT_CHANNEL, value: 'Use the contact page and property inquiry workflows until a branded contact email is operational.' },
  { fact: 'Public notification sender', status: 'CONFIGURED_NOTIFICATION_IDENTITY', value: PUBLIC_NOTIFICATION_EMAIL },
  { fact: "David Quinn's licensed name", status: 'EXTERNAL_BROKERAGE_APPROVAL_REQUIRED_BEFORE_PUBLICATION', value: null },
  { fact: 'Colorado real-estate license number', status: 'EXTERNAL_BROKERAGE_APPROVAL_REQUIRED_BEFORE_PUBLICATION', value: null },
  { fact: 'Compass office or branch', status: 'EXTERNAL_BROKERAGE_APPROVAL_REQUIRED_BEFORE_PUBLICATION', value: null },
  { fact: 'Employing Broker or Sales Manager, if required', status: 'EXTERNAL_BROKERAGE_APPROVAL_REQUIRED_BEFORE_PUBLICATION', value: null },
  { fact: 'Approved Compass logo asset', status: COMPASS_BRANDING_CLASSIFICATION, value: null },
  { fact: 'Approved Compass email address', status: 'EXTERNAL_BROKERAGE_APPROVAL_REQUIRED_BEFORE_PUBLICATION', value: null },
  { fact: 'Approved Compass.com profile or office URL', status: 'EXTERNAL_BROKERAGE_APPROVAL_REQUIRED_BEFORE_PUBLICATION', value: null },
  { fact: 'Public business telephone', status: 'EXTERNAL_BROKERAGE_APPROVAL_REQUIRED_BEFORE_PUBLICATION', value: null },
  { fact: 'Public office address', status: 'EXTERNAL_BROKERAGE_APPROVAL_REQUIRED_BEFORE_PUBLICATION', value: null },
  { fact: 'Team-member identification requirements', status: 'EXTERNAL_BROKERAGE_APPROVAL_REQUIRED_BEFORE_PUBLICATION', value: null },
  { fact: 'Compass Marketing external approval status and evidence date', status: COMPASS_MARKETING_APPROVAL_GATE, value: null },
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
      'Provide Compass Marketing Team written approval status and evidence date because Compass policy requires approval before development/go-live for Compass-affiliated websites; requires external approval.',
      'Provide an approved Compass logo asset and display rules because Compass-affiliated websites may require prominent approved branding; requires external approval.',
      'Provide the approved Compass.com profile, office, or agent URL because Compass policy may require a properly formatted Compass URL; requires external approval.',
    ],
  },
  {
    category: 'Contact Information',
    questions: [
      'Confirm the approved branded or Compass public contact email address because the site must not publish a personal Gmail address as the long-term public contact identity; requires external approval.',
      'Confirm the public business telephone and office address because contact and brokerage disclosure pages do not publish unverified values; requires external approval.',
      'Confirm whether the contact form workflow remains the privacy and accessibility request channel after brokerage/counsel review.',
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
      'Confirm MLS/IDX attribution text, copyright language, and listing-photo rights because property pages currently report the provider-review gap; requires external approval.',
      'Confirm whether each public listing can map to a verified Compass.com listing URL because Compass policy may require listing pages to link back to Compass.com; requires external approval.',
      'Confirm expiration/withdrawn-listing removal obligations and source update cadence because public listing advertising must remain accurate; requires external approval.',
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
      'Confirm any counsel-required changes to Privacy, Terms, Brokerage Disclosures, Accessibility, and Fair Housing pages before broad launch.',
      'Confirm approved brokerage-relationship disclaimer language because form notices must not replace Commission-approved disclosures; blocks controlled beta.',
    ],
  },
  {
    category: 'Fair Housing',
    questions: [
      'Confirm whether an authorized Equal Housing Opportunity logo asset is available because the site currently uses the slogan only; requires external approval.',
      'Confirm brokerage-required fair-housing language changes before broad launch.',
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

export const productionReadyTrustPractices = [
  'Public contact, privacy, and accessibility requests route through the contact page and property inquiry workflows until a branded public contact email is operational.',
  `Public notification sender identity is configured as ${PUBLIC_NOTIFICATION_EMAIL} for applicable automated messages.`,
  `The site identifies ${BROKERAGE_FIRM_NAME} as the brokerage firm and does not present ${PUBLIC_TEAM_NAME} as a separate brokerage.`,
  'Privacy, terms, accessibility, fair housing, brokerage disclosure, and contact pages are public routes and linked from the footer.',
  'Public form notices preserve relationship limits and confidential-information guardrails.',
  'Property pages expose listing attribution controls and do not guess unavailable Compass.com listing URLs.',
  'Fair housing language is text-only and does not render unapproved Equal Housing Opportunity logo artwork or REALTOR marks.',
];

export const externalApprovalItems = [
  'Compass Marketing external approval status, approved Compass logo asset, approved Compass email address, and Compass.com profile/listing URL mapping.',
  "David Quinn's licensed name, Colorado license display, Compass office or branch, responsible broker, public phone number, public office address, and branded public contact email.",
  'MLS/IDX attribution text, copyright language, listing-photo rights, listing URL mapping, removal obligations, and source update cadence.',
  'Counsel or brokerage-requested revisions to privacy, terms, accessibility, fair housing, brokerage disclosure, and form relationship language.',
];

export const unavailableOrUnverifiedPractices = [
  'No public phone number, office address, brokerage license number, responsible broker, branded contact email, or provider-required MLS attribution text is published without external approval.',
  'No external advertising, surveillance, or third-party analytics provider is asserted where repository sources do not confirm it.',
  ...externalApprovalItems,
];

export function getBrokerageAttributionSummary() {
  return `${PUBLIC_TEAM_NAME} is presented as a public-facing team or brand and is not presented as a separate brokerage. Brokerage Firm: ${BROKERAGE_FIRM_NAME}.`;
}
