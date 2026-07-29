export const SOURCE_RIGHTS_ACTIVATION_READINESS_STATUS = 'SOURCE_RIGHTS_ACTIVATION_READINESS_1_COMPLETE';
export const SOURCE_RIGHTS_ACTIVATION_READINESS_DATE = '2026-07-29';

export type ReviewDecision =
  | 'APPROVE'
  | 'APPROVE_WITH_CONDITIONS'
  | 'PROVIDER_CONFIRMATION_REQUIRED'
  | 'LEGAL_REVIEW_REQUIRED'
  | 'DO_NOT_USE';

export type SourceRightsActivationRecord = Readonly<{
  sourceId: string;
  domain: string;
  legalEntityOrProvider: string;
  officialSourceUrl: string;
  termsOfUseLocation: string;
  datasetsOrRecordsRequired: readonly string[];
  accessMethod: string;
  apiExportDownloadAvailability: string;
  license: string;
  storagePermission: string;
  transformationPermission: string;
  aggregationPermission: string;
  publicDisplayPermission: string;
  redistributionRestrictions: string;
  attributionRequirements: string;
  rateLimits: string;
  credentialRequirements: string;
  accountOrContractRequirements: string;
  fees: string;
  updateCadence: string;
  retentionRestrictions: string;
  deletionObligations: string;
  privacyConsiderations: string;
  unresolvedLanguage: string;
  counselQuestion: string;
  recommendedDecision: ReviewDecision;
  activationCandidate: boolean;
  activationScore: number;
  activationRationale: string;
}>;

export type PersistenceReadinessSpecification = Readonly<{
  existingPersistenceReusable: boolean;
  futureMigrationRequired: boolean;
  minimumFields: readonly string[];
  prohibitedUntilAuthorized: readonly string[];
}>;

export type ImageryAcquisitionStrategy = Readonly<{
  channel: string;
  speed: 'FASTEST' | 'FAST' | 'MEDIUM' | 'SLOW';
  rightsConfidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';
  useCase: string;
  requirements: readonly string[];
  recommendation: string;
}>;

export const SOURCE_RIGHTS_ACTIVATION_RECORDS: readonly SourceRightsActivationRecord[] = Object.freeze([
  {
    sourceId: 'SRA-BOULDER-COUNTY-OPEN-DATA',
    domain: 'Boulder County Open Data',
    legalEntityOrProvider: 'Boulder County, Colorado',
    officialSourceUrl: 'https://bouldercounty.gov/government/open-data/',
    termsOfUseLocation: 'Open Data Terms of Use linked from Boulder County Open Data page.',
    datasetsOrRecordsRequired: ['Parcels', 'zoning', 'property information', 'open data metadata'],
    accessMethod: 'Open Data catalog / portal review; no scraping.',
    apiExportDownloadAvailability: 'Open Data portal indicates downloadable datasets where available; dataset-level export must be confirmed.',
    license: 'Boulder County states open data is licensed for broad lawful use unless noted otherwise; dataset-specific terms still control.',
    storagePermission: 'Likely eligible after dataset-level terms confirmation.',
    transformationPermission: 'Likely eligible after dataset-level terms confirmation.',
    aggregationPermission: 'Likely eligible after dataset-level terms confirmation.',
    publicDisplayPermission: 'Requires dataset-level confirmation and attribution review before customer display.',
    redistributionRestrictions: 'Unknown until dataset-specific terms and metadata are reviewed.',
    attributionRequirements: 'Boulder County source and dataset name unless dataset terms state otherwise.',
    rateLimits: 'Not identified; portal policy must be reviewed before automation.',
    credentialRequirements: 'None identified for public catalog discovery.',
    accountOrContractRequirements: 'None identified for public catalog discovery.',
    fees: 'None identified for open data catalog datasets.',
    updateCadence: 'Dataset-specific.',
    retentionRestrictions: 'Unknown until terms review.',
    deletionObligations: 'Unknown until terms review.',
    privacyConsiderations: 'Avoid individual-owner targeting; use aggregate city intelligence only.',
    unresolvedLanguage: 'Dataset-specific license exceptions, attribution, export endpoint, and automation limits.',
    counselQuestion: 'Can REIE store, transform, aggregate, and display derived city-level observations from named Boulder County open datasets with attribution?',
    recommendedDecision: 'APPROVE_WITH_CONDITIONS',
    activationCandidate: true,
    activationScore: 91,
    activationRationale: 'Strong authority, broad coverage, relatively clear open-data posture, and low privacy risk if limited to aggregate derived observations.',
  },
  {
    sourceId: 'SRA-CITY-BOULDER-OPEN-DATA-PERMITS',
    domain: 'City of Boulder Open Data permit/planning exports',
    legalEntityOrProvider: 'City of Boulder, Colorado',
    officialSourceUrl: 'https://bouldercolorado.gov/planning-development-services-records-request-resources',
    termsOfUseLocation: 'City of Boulder Open Data terms and website terms.',
    datasetsOrRecordsRequired: ['Construction permit exports', 'current project map data', 'planning case records'],
    accessMethod: 'City Open Data catalog and documented P&DS resources; no portal scraping.',
    apiExportDownloadAvailability: 'City page states construction permit and project data can be downloaded through Open Data.',
    license: 'City Open Data materials identify broad CC0-style reuse; exact dataset terms require confirmation.',
    storagePermission: 'Provider/legal confirmation required for selected datasets.',
    transformationPermission: 'Provider/legal confirmation required for derived city-level observations.',
    aggregationPermission: 'Provider/legal confirmation required for aggregate permit trends.',
    publicDisplayPermission: 'Customer display requires confirmation and plain-language limitation copy.',
    redistributionRestrictions: 'Unknown for selected datasets until terms review.',
    attributionRequirements: 'City source, dataset name, access date, and license statement.',
    rateLimits: 'Unknown until endpoint/export mechanism is selected.',
    credentialRequirements: 'None identified for open-data downloads; CSS portal account may be required for detailed records.',
    accountOrContractRequirements: 'No contract identified for open data; account may be needed for portal records.',
    fees: 'CORA/custom records may involve charges; open-data downloads do not indicate fees.',
    updateCadence: 'Dataset-specific; permit activity is event-driven.',
    retentionRestrictions: 'Unknown until terms review.',
    deletionObligations: 'Unknown until terms review.',
    privacyConsiderations: 'Do not expose contractor/person-level details or imply property condition conclusions.',
    unresolvedLanguage: 'Open-data dataset terms, CSS portal restrictions, downloadable field list, and automation limits.',
    counselQuestion: 'Can REIE store and aggregate City of Boulder permit/open-data fields into city-level construction-era and activity context without displaying individual record details?',
    recommendedDecision: 'PROVIDER_CONFIRMATION_REQUIRED',
    activationCandidate: true,
    activationScore: 84,
    activationRationale: 'High customer value and direct permit relevance, but selected dataset terms and field-level privacy controls need confirmation.',
  },
  {
    sourceId: 'SRA-BOULDER-COUNTY-ASSESSOR',
    domain: 'Boulder County assessor/property records',
    legalEntityOrProvider: 'Boulder County Assessor',
    officialSourceUrl: 'https://bouldercounty.gov/departments/assessor/',
    termsOfUseLocation: 'Assessor/property search and county open-data terms; explicit bulk reuse terms not yet located.',
    datasetsOrRecordsRequired: ['Property type', 'parcel attributes', 'sales/property data', 'valuation context', 'subdivision relationships'],
    accessMethod: 'Property search/open data review; no scraping.',
    apiExportDownloadAvailability: 'Public property search available; bulk/API availability requires confirmation.',
    license: 'Public accessibility identified; reuse license unresolved.',
    storagePermission: 'Legal review required.',
    transformationPermission: 'Legal review required.',
    aggregationPermission: 'Legal review required.',
    publicDisplayPermission: 'Legal review required; individual-owner intelligence prohibited.',
    redistributionRestrictions: 'Unknown.',
    attributionRequirements: 'Boulder County Assessor source, record date, field meaning limitations.',
    rateLimits: 'Unknown.',
    credentialRequirements: 'None identified for public search; bulk data may differ.',
    accountOrContractRequirements: 'Unknown.',
    fees: 'Unknown for bulk/export use.',
    updateCadence: 'Assessment cycle and property-data updates are source-specific.',
    retentionRestrictions: 'Unknown.',
    deletionObligations: 'Unknown.',
    privacyConsiderations: 'High: avoid owner-level profiling and customer-visible individual-owner data.',
    unresolvedLanguage: 'Bulk access, license, owner-data handling, transformation, and public display.',
    counselQuestion: 'May REIE use assessor fields only as aggregate city-level housing-pattern observations while excluding owner identity and parcel-level customer display?',
    recommendedDecision: 'LEGAL_REVIEW_REQUIRED',
    activationCandidate: false,
    activationScore: 72,
    activationRationale: 'High authority and housing-pattern value, but rights and privacy constraints are less clear than open-data sources.',
  },
  {
    sourceId: 'SRA-BOULDER-COUNTY-ACCELA',
    domain: 'Boulder County and municipal permit systems',
    legalEntityOrProvider: 'Boulder County Community Planning & Permitting / Accela',
    officialSourceUrl: 'https://aca-prod.accela.com/BOCO/',
    termsOfUseLocation: 'Accela portal terms/provider terms not confirmed in repository-accessible review.',
    datasetsOrRecordsRequired: ['Permit applications', 'license records', 'parcel/address permit references', 'status metadata'],
    accessMethod: 'Public portal review only; no scraping or automation.',
    apiExportDownloadAvailability: 'Portal search available; API/export availability not established.',
    license: 'Unresolved.',
    storagePermission: 'Not approved.',
    transformationPermission: 'Not approved.',
    aggregationPermission: 'Not approved.',
    publicDisplayPermission: 'Not approved.',
    redistributionRestrictions: 'Unknown.',
    attributionRequirements: 'Provider and Boulder County attribution if approved.',
    rateLimits: 'Unknown.',
    credentialRequirements: 'Account optional or required depending record type.',
    accountOrContractRequirements: 'Provider confirmation required.',
    fees: 'Unknown.',
    updateCadence: 'Event-driven.',
    retentionRestrictions: 'Unknown.',
    deletionObligations: 'Unknown.',
    privacyConsiderations: 'Moderate to high: record details can include people, contractors, and property-specific history.',
    unresolvedLanguage: 'Portal automation, storage, reuse, account terms, rate limits, and field privacy.',
    counselQuestion: 'Is any automated retrieval, storage, or aggregation from Accela permitted for internal REIE evidence if individual record display remains disabled?',
    recommendedDecision: 'PROVIDER_CONFIRMATION_REQUIRED',
    activationCandidate: false,
    activationScore: 58,
    activationRationale: 'Important permit signal, but portal rights and automation boundaries are unresolved.',
  },
  {
    sourceId: 'SRA-BOULDER-COUNTY-RECORDER',
    domain: 'Boulder County recorder/deed data',
    legalEntityOrProvider: 'Boulder County Clerk and Recorder',
    officialSourceUrl: 'https://boulder.co.ds.search.govos.com/',
    termsOfUseLocation: 'Recorder portal/copy policy; full reuse terms unresolved.',
    datasetsOrRecordsRequired: ['Deeds', 'liens', 'plats', 'subdivision records', 'recorded document indexes'],
    accessMethod: 'Public records search and copy request process; no scraping.',
    apiExportDownloadAvailability: 'Search and document download/copy workflow visible; bulk/API access not established.',
    license: 'Public record access identified; reuse license unresolved.',
    storagePermission: 'Legal review required.',
    transformationPermission: 'Legal review required.',
    aggregationPermission: 'Legal review required.',
    publicDisplayPermission: 'Legal review required.',
    redistributionRestrictions: 'Unknown; copy fees and document status may apply.',
    attributionRequirements: 'Clerk and Recorder source, document identifier, access date.',
    rateLimits: 'Unknown.',
    credentialRequirements: 'Unknown for advanced/bulk use.',
    accountOrContractRequirements: 'Unknown.',
    fees: 'Document copy/certified copy fees may apply.',
    updateCadence: 'Event-driven recording.',
    retentionRestrictions: 'Unknown.',
    deletionObligations: 'Unknown.',
    privacyConsiderations: 'High: legal documents and ownership transfer records must not be interpreted as legal advice.',
    unresolvedLanguage: 'Bulk use, document download reuse, OCR/full-text reuse, fees, and legal interpretation limits.',
    counselQuestion: 'Can recorded-document metadata be used only for internal verification prompts and city-level subdivision history, excluding document redistribution?',
    recommendedDecision: 'LEGAL_REVIEW_REQUIRED',
    activationCandidate: false,
    activationScore: 51,
    activationRationale: 'Useful for verification and subdivision context, but high legal/privacy friction and low immediate customer-display value.',
  },
  {
    sourceId: 'SRA-MUNICIPAL-PLANNING-RECORDS',
    domain: 'Municipal planning and development records',
    legalEntityOrProvider: 'City of Boulder and future Colorado municipalities',
    officialSourceUrl: 'https://bouldercolorado.gov/government/departments/planning-development-services',
    termsOfUseLocation: 'Municipal website/open-data terms and record-specific notices.',
    datasetsOrRecordsRequired: ['Comprehensive plans', 'zoning references', 'development review maps', 'infrastructure/project records'],
    accessMethod: 'Official pages, open-data downloads, and manual review; no scraping.',
    apiExportDownloadAvailability: 'Varies by municipality and dataset.',
    license: 'Varies by municipality and record.',
    storagePermission: 'Provider/legal confirmation required.',
    transformationPermission: 'Provider/legal confirmation required.',
    aggregationPermission: 'Provider/legal confirmation required.',
    publicDisplayPermission: 'Provider/legal confirmation required.',
    redistributionRestrictions: 'Unknown.',
    attributionRequirements: 'Municipality, plan/document name, effective date, access date.',
    rateLimits: 'Unknown.',
    credentialRequirements: 'None identified for public pages; portals vary.',
    accountOrContractRequirements: 'Unknown.',
    fees: 'Records requests may incur fees.',
    updateCadence: 'Plan/project-specific.',
    retentionRestrictions: 'Unknown.',
    deletionObligations: 'Unknown.',
    privacyConsiderations: 'Low to moderate if limited to adopted/public plan summaries and no predictions.',
    unresolvedLanguage: 'Effective dates, supersession, reuse, and interpretation boundaries.',
    counselQuestion: 'Can REIE store cited plan metadata and derive non-predictive practical-context observations with clear source/effective-date attribution?',
    recommendedDecision: 'PROVIDER_CONFIRMATION_REQUIRED',
    activationCandidate: true,
    activationScore: 76,
    activationRationale: 'High practical-context value and low owner privacy risk, but municipality-by-municipality terms create operational complexity.',
  },
  {
    sourceId: 'SRA-DQG-OWNED-IMAGERY',
    domain: 'DQG-owned imagery',
    legalEntityOrProvider: 'David Quinn Group',
    officialSourceUrl: 'repository:future asset-rights ledger',
    termsOfUseLocation: 'Internal asset ownership/release documentation.',
    datasetsOrRecordsRequired: ['Asset file', 'capture location', 'photographer ownership/release', 'usage approval', 'alt text'],
    accessMethod: 'Internal rights ledger and approved asset repository.',
    apiExportDownloadAvailability: 'Repository/local asset workflow.',
    license: 'Owned or commissioned work-for-hire only after documentation.',
    storagePermission: 'Approve when ownership/release is documented.',
    transformationPermission: 'Approve when ownership/release is documented.',
    aggregationPermission: 'Not applicable.',
    publicDisplayPermission: 'Approve when ownership/release/editorial approval is documented.',
    redistributionRestrictions: 'No external redistribution unless separately licensed.',
    attributionRequirements: 'Internal standard; photographer credit if contract requires.',
    rateLimits: 'Not applicable.',
    credentialRequirements: 'None.',
    accountOrContractRequirements: 'Photographer agreement or ownership proof required.',
    fees: 'Photography production cost.',
    updateCadence: 'Campaign/asset refresh cycle.',
    retentionRestrictions: 'Asset-specific.',
    deletionObligations: 'Asset-specific.',
    privacyConsiderations: 'Avoid identifiable private individuals, private interiors, restricted locations, and misleading location labels.',
    unresolvedLanguage: 'Asset-level ownership/release and renewal obligations.',
    counselQuestion: 'What minimum release/ownership packet is required for DQG city imagery to become public eligible across web, social, and derivative crops?',
    recommendedDecision: 'APPROVE_WITH_CONDITIONS',
    activationCandidate: true,
    activationScore: 88,
    activationRationale: 'Fastest route to premium public imagery with controllable rights and low data/privacy complexity.',
  },
  {
    sourceId: 'SRA-LICENSED-THIRD-PARTY-IMAGERY',
    domain: 'Licensed third-party local imagery',
    legalEntityOrProvider: 'Stock/editorial photographer or image marketplace',
    officialSourceUrl: 'provider-specific contract or marketplace license',
    termsOfUseLocation: 'Provider license agreement.',
    datasetsOrRecordsRequired: ['Asset file', 'license record', 'scope of use', 'expiration/renewal', 'attribution'],
    accessMethod: 'Manual licensed acquisition.',
    apiExportDownloadAvailability: 'Provider-specific.',
    license: 'Provider-specific license.',
    storagePermission: 'Contract-specific.',
    transformationPermission: 'Contract-specific.',
    aggregationPermission: 'Not applicable.',
    publicDisplayPermission: 'Contract-specific.',
    redistributionRestrictions: 'Likely restricted.',
    attributionRequirements: 'Contract-specific.',
    rateLimits: 'Not applicable.',
    credentialRequirements: 'Provider account likely required.',
    accountOrContractRequirements: 'License purchase or contract required.',
    fees: 'License cost.',
    updateCadence: 'License/expiration-specific.',
    retentionRestrictions: 'Contract-specific.',
    deletionObligations: 'Contract-specific.',
    privacyConsiderations: 'Avoid misleading location, people, interiors, and sensitive/private contexts.',
    unresolvedLanguage: 'Commercial web use, cropping, derivative work, exclusivity, renewal, and attribution.',
    counselQuestion: 'Which license class allows REIE to publicly display, crop, compress, and reuse city imagery in web Decision Guide contexts?',
    recommendedDecision: 'PROVIDER_CONFIRMATION_REQUIRED',
    activationCandidate: false,
    activationScore: 64,
    activationRationale: 'Can fill gaps quickly but recurring license compliance is operationally heavier than owned imagery.',
  },
  {
    sourceId: 'SRA-MLS-DERIVED-CITY-INTELLIGENCE',
    domain: 'Existing MLS-derived city intelligence',
    legalEntityOrProvider: 'Existing governed REIE MLS/listing data pipeline',
    officialSourceUrl: 'repository:lib/cities.ts + current market/listing controls',
    termsOfUseLocation: 'Existing MLS and market-source governance already applied by REIE.',
    datasetsOrRecordsRequired: ['Inventory', 'days on market', 'median price', 'market health score', 'city-level summaries'],
    accessMethod: 'Repository-local governed data only.',
    apiExportDownloadAvailability: 'Existing internal data; no new provider access.',
    license: 'Existing governed use only.',
    storagePermission: 'Already repository-local.',
    transformationPermission: 'Allowed only within existing governed market-source boundaries.',
    aggregationPermission: 'Allowed only within existing governed market-source boundaries.',
    publicDisplayPermission: 'Existing public market pages already display bounded city-market context.',
    redistributionRestrictions: 'Existing MLS/source restrictions continue.',
    attributionRequirements: 'Existing market-source controls.',
    rateLimits: 'No new access.',
    credentialRequirements: 'No new credentials.',
    accountOrContractRequirements: 'No new contract.',
    fees: 'No new cost.',
    updateCadence: 'Existing data refresh process.',
    retentionRestrictions: 'Existing controls.',
    deletionObligations: 'Existing controls.',
    privacyConsiderations: 'Low when aggregate and non-predictive.',
    unresolvedLanguage: 'No new unresolved language for repository-local dry-run candidates; public expansion still needs editorial review.',
    counselQuestion: 'Can existing governed city-market data continue to seed non-public evidence candidates while external source rights are resolved?',
    recommendedDecision: 'APPROVE',
    activationCandidate: true,
    activationScore: 86,
    activationRationale: 'Already governed, low effort, and useful for bounded non-predictive market interpretation.',
  },
]);

export const PERSISTENCE_READINESS_SPECIFICATION: PersistenceReadinessSpecification = Object.freeze({
  existingPersistenceReusable: false,
  futureMigrationRequired: true,
  minimumFields: [
    'source identity',
    'acquisition run',
    'raw evidence version',
    'normalized observation',
    'geographic subject',
    'permitted use',
    'public-display eligibility',
    'freshness',
    'confidence',
    'conflict and supersession',
    'imagery rights where applicable',
  ],
  prohibitedUntilAuthorized: [
    'Prisma/schema migration',
    'provider execution',
    'durable external-source writes',
    'customer-visible partial evidence',
    'public GIS activation',
  ],
});

export const IMAGERY_ACQUISITION_STRATEGY: readonly ImageryAcquisitionStrategy[] = Object.freeze([
  {
    channel: 'DQG photography program',
    speed: 'FASTEST',
    rightsConfidence: 'HIGH',
    useCase: 'Premium city hero and neighborhood transition imagery.',
    requirements: ['owned capture', 'location verification', 'asset release', 'alt text', 'editorial approval'],
    recommendation: 'Primary fastest lawful premium path for priority Colorado cities.',
  },
  {
    channel: 'Commissioned photography',
    speed: 'FAST',
    rightsConfidence: 'HIGH',
    useCase: 'Fill city gaps with specific shot lists and work-for-hire ownership.',
    requirements: ['written agreement', 'usage scope', 'people/private-property controls', 'delivery metadata'],
    recommendation: 'Use when DQG-owned capture is unavailable or schedule constrained.',
  },
  {
    channel: 'Municipal/public-domain imagery',
    speed: 'MEDIUM',
    rightsConfidence: 'MEDIUM',
    useCase: 'Supplemental civic/location context where terms are explicit.',
    requirements: ['source terms', 'attribution', 'modification rights', 'commercial web confirmation'],
    recommendation: 'Use selectively after written terms review.',
  },
  {
    channel: 'Licensed stock/editorial imagery',
    speed: 'FAST',
    rightsConfidence: 'MEDIUM',
    useCase: 'Bridge gaps for city pages when premium local coverage is missing.',
    requirements: ['license class', 'cropping rights', 'web use', 'expiration monitoring', 'attribution'],
    recommendation: 'Secondary path where owned/commissioned imagery is not feasible.',
  },
  {
    channel: 'Fallback imagery',
    speed: 'FASTEST',
    rightsConfidence: 'HIGH',
    useCase: 'Fail-closed visual continuity when local imagery rights are unresolved.',
    requirements: ['existing approved asset', 'non-misleading alt text', 'no city-specific implication'],
    recommendation: 'Continue as default until city-specific assets are approved.',
  },
]);

export function getActivationRanking(): readonly SourceRightsActivationRecord[] {
  return [...SOURCE_RIGHTS_ACTIVATION_RECORDS].sort((a, b) => b.activationScore - a.activationScore || a.sourceId.localeCompare(b.sourceId));
}

export function getRecommendedFirstActivation(): SourceRightsActivationRecord {
  const record = getActivationRanking().find((source) => source.activationCandidate && source.recommendedDecision === 'APPROVE_WITH_CONDITIONS');
  if (!record) throw new Error('No first activation candidate is available.');
  return record;
}
