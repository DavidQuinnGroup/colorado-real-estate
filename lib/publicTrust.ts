export const PUBLIC_TRUST_REVIEW_STATUS = 'DRAFT_FOR_OWNER_AND_COUNSEL_REVIEW';

export const SITE_URL = 'https://davidquinngroup.com';
export const SITE_NAME = 'David Quinn Group';
export const PRODUCT_NAME = 'Real Estate Intelligence Engine';

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
  'Brokerage affiliation, license number, office address, responsible broker, and required Colorado disclosure wording.',
  'Public contact email address, phone number, mailing address, and privacy/accessibility request channel.',
  'Approved privacy practices, retention schedule, data-rights workflow, and cookie/analytics disclosures.',
  'MLS/IDX attribution, display, copyright, and provider-specific disclosure requirements.',
  'Approved fair housing, accessibility, brokerage, and terms language after owner and counsel review.',
];

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
  'No owner-approved public privacy policy, terms, brokerage disclosure, accessibility statement, or fair housing disclosure was found in the repository before this package.',
  'No verified public phone number, office address, brokerage license number, responsible broker, or provider-required MLS attribution text was confirmed in repository sources.',
  'No external advertising, surveillance, or third-party analytics provider was confirmed for this package.',
  'Google Drive governance/document reconciliation was requested, but no callable Google Drive connector tools were exposed in this Codex session after tool discovery.',
  'MLS_ATTRIBUTION_REQUIRES_OWNER_PROVIDER_REVIEW',
];
