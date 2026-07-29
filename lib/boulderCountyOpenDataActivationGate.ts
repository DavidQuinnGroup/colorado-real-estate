export const BOULDER_COUNTY_OPEN_DATA_ACTIVATION_GATE_STATUS =
  'BOULDER_COUNTY_OPEN_DATA_ACTIVATION_GATE_1_COMPLETE';
export const BOULDER_COUNTY_OPEN_DATA_ACTIVATION_GATE_DATE = '2026-07-29';

export type BoulderCountyDatasetReadiness =
  | 'READY_FOR_PROVIDER_AND_COUNSEL_REVIEW'
  | 'DEFER_UNTIL_PROVIDER_CLARIFIES'
  | 'DEFER_HIGH_SENSITIVITY'
  | 'DEFER_DEPRECATED_OR_STATIC';

export type BoulderCountyDatasetRecord = Readonly<{
  datasetId: string;
  title: string;
  catalogItemId: string;
  catalogUrl: string;
  serviceUrl: string;
  provider: string;
  sourceDepartment: string;
  access: 'public';
  license: string;
  contentStatus: string;
  updateCadence: string;
  modifiedDateUtc: string;
  geographicScope: string;
  geometryType: string;
  supportedFormats: readonly string[];
  representativeFields: readonly string[];
  customerValue: string;
  allowedInitialUse: string;
  prohibitedInitialUse: readonly string[];
  privacySensitivity: 'LOW' | 'MEDIUM' | 'HIGH';
  readiness: BoulderCountyDatasetReadiness;
  activationPriority: number;
  unresolvedQuestions: readonly string[];
}>;

export type ProviderConfirmationQuestion = Readonly<{
  id: string;
  question: string;
  requiredForActivation: boolean;
}>;

export type CounselReviewItem = Readonly<{
  id: string;
  topic: string;
  question: string;
  provisionalStatus: 'COUNSEL_REVIEW_REQUIRED' | 'PROVIDER_CONFIRMATION_REQUIRED' | 'NOT_APPROVED';
}>;

export type FirstActivationBoundary = Readonly<{
  recommendedDatasets: readonly string[];
  maxInitialDatasets: number;
  approvedRuntimeEffects: readonly string[];
  prohibitedRuntimeEffects: readonly string[];
  minimumExitCriteria: readonly string[];
}>;

export type PersistenceDecisionGate = Readonly<{
  existingPersistenceReusable: false;
  futureMigrationRequired: true;
  requiredObjects: readonly string[];
  requiredFields: readonly string[];
  desirableFields: readonly string[];
  unnecessaryForFirstActivation: readonly string[];
  prohibitedUntilAuthorized: readonly string[];
}>;

export type CostOperationsAssessment = Readonly<{
  publicCatalogCost: string;
  providerFees: string;
  engineeringEffort: 'LOW' | 'MEDIUM' | 'HIGH';
  operationsEffort: 'LOW' | 'MEDIUM' | 'HIGH';
  monitoringNeeds: readonly string[];
  supportRisks: readonly string[];
}>;

export const BOULDER_COUNTY_OPEN_DATA_SOURCES = Object.freeze({
  countyOpenDataPage: 'https://bouldercounty.gov/government/open-data/',
  countyOpenDataDefinition: 'https://bouldercounty.gov/government/open-data/definition/',
  countyOpenDataTerms: 'https://bouldercounty.gov/government/open-data/open-data-terms-of-use/',
  arcgisHubSearchApi: 'https://opendata-bouldercounty.hub.arcgis.com/api/search/v1/collections/dataset/items',
});

export const BOULDER_COUNTY_OPEN_DATASETS: readonly BoulderCountyDatasetRecord[] = Object.freeze([
  {
    datasetId: 'BCOD-ADDRESS-POINTS',
    title: 'Address Points',
    catalogItemId: '687530b74ad54686a98f50337574596f',
    catalogUrl:
      'https://opendata-bouldercounty.hub.arcgis.com/api/search/v1/collections/dataset/items/687530b74ad54686a98f50337574596f',
    serviceUrl: 'https://maps.bouldercounty.org/arcgis/rest/services/PARCELS/ADDRESS_POINTS/MapServer/0',
    provider: 'Boulder County, Colorado',
    sourceDepartment: 'Boulder County Assessor GIS staff',
    access: 'public',
    license: 'CC-BY-4.0 in catalog record; dataset-specific confirmation required before REIE activation.',
    contentStatus: 'public_authoritative',
    updateCadence: 'As new points are added or corrected; work-in-progress backlog disclosed by source.',
    modifiedDateUtc: '2025-11-10T21:44:38Z',
    geographicScope: 'Boulder County address points, including city, postal city, county, ZIP, parcel, tax district, and coordinate fields.',
    geometryType: 'Point',
    supportedFormats: ['JSON', 'geoJSON', 'PBF'],
    representativeFields: [
      'ADDRESS_ID',
      'STATUS',
      'CITY',
      'POSTAL_CITY',
      'ZIPCODE',
      'FULL_ADDRESS',
      'PARCEL_NUMBER',
      'ACCOUNT_NUMBER',
      'TAX_DIST_MUNI',
      'LATITUDE',
      'LONGITUDE',
    ],
    customerValue:
      'High value for city-boundary, address-density, and location-context normalization if reduced to aggregate local-authority observations.',
    allowedInitialUse:
      'Internal dry-run inventory and aggregate city-level evidence modeling only after provider and counsel confirmation.',
    prohibitedInitialUse: [
      'customer-visible parcel/address display',
      'owner or account-level intelligence',
      'property-specific scoring',
      'automated acquisition or persistence before authorization',
    ],
    privacySensitivity: 'HIGH',
    readiness: 'READY_FOR_PROVIDER_AND_COUNSEL_REVIEW',
    activationPriority: 1,
    unresolvedQuestions: [
      'Confirm whether FULL_ADDRESS, PARCEL_NUMBER, ACCOUNT_NUMBER, and tax district fields may be stored or must be excluded.',
      'Confirm attribution wording and derived aggregate display permission.',
      'Confirm rate limits and export method for scheduled refreshes.',
    ],
  },
  {
    datasetId: 'BCOD-PARK-BOUNDARIES',
    title: 'Boulder County Parks and Open Space Park Boundaries',
    catalogItemId: 'ffbeca86d075420cafc960bba6e5d4e8',
    catalogUrl:
      'https://opendata-bouldercounty.hub.arcgis.com/api/search/v1/collections/dataset/items/ffbeca86d075420cafc960bba6e5d4e8',
    serviceUrl: 'https://services3.arcgis.com/0jWpHMuhmHsukKE3/arcgis/rest/services/ParksWork/FeatureServer',
    provider: 'Boulder County, Colorado',
    sourceDepartment: 'Boulder County Parks and Open Space',
    access: 'public',
    license: 'Custom catalog license/disclaimer; provider and counsel confirmation required.',
    contentStatus: 'public_authoritative',
    updateCadence: 'As-needed according to catalog record; hosted layer data edit evidence observed in source metadata.',
    modifiedDateUtc: '2026-07-28T23:15:57Z',
    geographicScope: 'Generalized Boulder County Parks and Open Space park boundaries for visualization, not legal boundary determination.',
    geometryType: 'Polygon',
    supportedFormats: ['csv', 'shapefile', 'geoPackage', 'filegdb', 'geojson', 'kml', 'excel', 'parquet'],
    representativeFields: [
      'PARK_GROUP',
      'ParkGroupDescription',
      'Contact',
      'Acreage',
      'DisplayAcres',
      'MilesTrail',
      'NumberRestrooms',
      'ADAParking',
      'ParkingLots',
      'PropertyDescription',
    ],
    customerValue:
      'High value for community context and lifestyle orientation when presented neutrally as nearby open-space context.',
    allowedInitialUse:
      'Internal aggregate community-context evidence, with explicit approximate-boundary and no-access-implied limitations.',
    prohibitedInitialUse: [
      'legal boundary representation',
      'public-access guarantee',
      'property-value implication',
      'public GIS layer activation',
    ],
    privacySensitivity: 'LOW',
    readiness: 'READY_FOR_PROVIDER_AND_COUNSEL_REVIEW',
    activationPriority: 2,
    unresolvedQuestions: [
      'Resolve custom license language against county open-data license page.',
      'Confirm whether generalized boundaries may support customer-facing editorial summaries.',
      'Confirm required disclaimer language.',
    ],
  },
  {
    datasetId: 'BCOD-OPEN-SPACE-LANDS',
    title: 'Boulder County Open Space',
    catalogItemId: '0ff5754576af44cbb0fddaf1995b767a',
    catalogUrl:
      'https://opendata-bouldercounty.hub.arcgis.com/api/search/v1/collections/dataset/items/0ff5754576af44cbb0fddaf1995b767a',
    serviceUrl: 'https://maps.bouldercounty.org/arcgis/rest/services/ParksOpenSpace/OS_COUNTY_OPEN_SPACE/MapServer/0',
    provider: 'Boulder County, Colorado',
    sourceDepartment: 'Boulder County Parks and Open Space',
    access: 'public',
    license: 'CC-BY-4.0 in catalog record; dataset-level limits and source disclaimer still require confirmation.',
    contentStatus: 'catalog record does not state public_authoritative; public access and Boulder County source identified',
    updateCadence: 'As-needed according to catalog record.',
    modifiedDateUtc: '2026-05-20T15:26:18Z',
    geographicScope: 'Open space properties where Boulder County Parks and Open Space has a fee or easement interest.',
    geometryType: 'Polygon',
    supportedFormats: ['JSON', 'geoJSON', 'PBF'],
    representativeFields: [
      'OWN_TYPE_NAME',
      'OWN_SUBTYPE_CODE',
      'PROP_NAME',
      'ACREAGE',
      'PURCH_PARTNERS',
      'PROP_MNGR',
      'PARK_GROUP',
      'MANAGEMENT_PLAN',
    ],
    customerValue:
      'High value for explaining protected-land context near cities while avoiding legal, access, or desirability claims.',
    allowedInitialUse:
      'Provider/counsel-reviewed local context summaries and internal evidence only; no customer-facing map layer.',
    prohibitedInitialUse: [
      'guaranteed recreation access',
      'legal ownership conclusions',
      'property-level desirability ranking',
      'unreviewed customer display',
    ],
    privacySensitivity: 'LOW',
    readiness: 'READY_FOR_PROVIDER_AND_COUNSEL_REVIEW',
    activationPriority: 3,
    unresolvedQuestions: [
      'Confirm whether easement/ownership labels may be summarized publicly.',
      'Confirm source disclaimer and attribution placement.',
      'Confirm whether partner names require additional treatment.',
    ],
  },
  {
    datasetId: 'BCOD-TRAFFIC-STATIONS',
    title: 'Traffic Stations',
    catalogItemId: 'aeb2b2385dec4ffea0320318e3f2248a',
    catalogUrl:
      'https://opendata-bouldercounty.hub.arcgis.com/api/search/v1/collections/dataset/items/aeb2b2385dec4ffea0320318e3f2248a',
    serviceUrl: 'https://amsagsprod1-bouldercounty.msappproxy.net/server/rest/services/PW/genTraffic_Stations/MapServer/0',
    provider: 'Boulder County, Colorado',
    sourceDepartment: 'Boulder County Public Works',
    access: 'public',
    license: 'CC-BY-4.0 in catalog record; dataset-level public-display confirmation required.',
    contentStatus: 'public_authoritative',
    updateCadence: 'Traffic and bike counts captured every summer; web maps updated annually in the fourth quarter.',
    modifiedDateUtc: '2025-11-10T21:44:39Z',
    geographicScope: 'Traffic and bike count stations on Boulder County roads and trails.',
    geometryType: 'Point',
    supportedFormats: ['JSON', 'geoJSON', 'PBF'],
    representativeFields: [
      'TrafficStationID',
      'STATION_NUMBER',
      'TRAFFIC_COUNT',
      'TRAFFIC_YEAR_COUNTED',
      'BIKE_COUNT',
      'BIKE_YEAR_COUNTED',
      'STREET_NAME',
      'PAVETYPE',
      'FUNCTIONAL_CLASS',
    ],
    customerValue:
      'Medium-high value for transportation context if reduced to neutral research prompts, not livability scoring.',
    allowedInitialUse:
      'Aggregate roadway context and verification prompts after provider/counsel confirmation.',
    prohibitedInitialUse: [
      'commute-time promises',
      'noise or safety claims',
      'neighborhood rankings',
      'predictive or investment conclusions',
    ],
    privacySensitivity: 'MEDIUM',
    readiness: 'DEFER_UNTIL_PROVIDER_CLARIFIES',
    activationPriority: 4,
    unresolvedQuestions: [
      'Confirm whether counts can be summarized by city or corridor.',
      'Confirm freshness language for annual update timing.',
      'Confirm whether source supports scheduled export use.',
    ],
  },
  {
    datasetId: 'BCOD-TRAIL-SEGMENTS-DISSOLVED',
    title: 'BCPOS Trail Segments Dissolved',
    catalogItemId: '42d04db5a2194b848f887b4a13ab7645',
    catalogUrl:
      'https://opendata-bouldercounty.hub.arcgis.com/api/search/v1/collections/dataset/items/42d04db5a2194b848f887b4a13ab7645',
    serviceUrl: 'https://bouldercounty.maps.arcgis.com/home/item.html?id=42d04db5a2194b848f887b4a13ab7645',
    provider: 'Boulder County, Colorado',
    sourceDepartment: 'Boulder County Parks and Open Space',
    access: 'public',
    license: 'CC-BY-4.0 visible in catalog record extract; confirmation required because record includes disclaimer language.',
    contentStatus: 'public_authoritative',
    updateCadence: 'As-needed according to related trail catalog records.',
    modifiedDateUtc: 'unknown from captured catalog extract; provider confirmation required',
    geographicScope: 'Boulder County Parks and Open Space trail segments generalized for searching and summary purposes.',
    geometryType: 'Line',
    supportedFormats: ['unknown from captured catalog extract'],
    representativeFields: ['trail name fields unknown', 'closure relationship references unknown'],
    customerValue:
      'Medium value for lifestyle context, but should trail after park/open-space context because trail records can change with closures.',
    allowedInitialUse:
      'Provider-confirmed editorial context only, with closure/freshness caveats and no route guidance.',
    prohibitedInitialUse: [
      'real-time trail availability',
      'access or safety guarantees',
      'route recommendations',
      'customer-facing map layer activation',
    ],
    privacySensitivity: 'LOW',
    readiness: 'DEFER_UNTIL_PROVIDER_CLARIFIES',
    activationPriority: 5,
    unresolvedQuestions: [
      'Confirm field list and supported export formats.',
      'Confirm relationship to closures and COTREX references.',
      'Confirm whether public editorial summaries require closure-link caveats.',
    ],
  },
  {
    datasetId: 'BCOD-EMERGENCY-FLOOD-POLYGONS',
    title: 'Emergency Alert Flood Polygons',
    catalogItemId: '3627536f5c274ffc80aa267632de3ca2',
    catalogUrl:
      'https://opendata-bouldercounty.hub.arcgis.com/api/search/v1/collections/dataset/items/3627536f5c274ffc80aa267632de3ca2',
    serviceUrl: 'https://maps.bouldercounty.org/arcgis/rest/services/PublicSafety/FLOOD_EMERGENCY_NOTIFICATION/MapServer/0',
    provider: 'Boulder County, Colorado',
    sourceDepartment: 'Boulder County Sheriff / Office of Emergency Management collaborators',
    access: 'public',
    license: 'CC-BY-4.0 in catalog record; high-sensitivity use requires separate executive authorization.',
    contentStatus: 'public_authoritative',
    updateCadence: 'Updated by public-safety stakeholders; catalog description references summer 2023 update work.',
    modifiedDateUtc: '2025-11-10T21:44:47Z',
    geographicScope: 'Wireless emergency alert compliant flood-prone notification areas in Boulder County and some adjacent service areas.',
    geometryType: 'Polygon',
    supportedFormats: ['JSON', 'geoJSON', 'PBF'],
    representativeFields: ['field list not captured for this gate; service inspection required in a later authorized review'],
    customerValue:
      'Potentially high but compliance-sensitive; not appropriate for the first local-authority activation gate.',
    allowedInitialUse:
      'None beyond inventory; future hazard-context work requires separate authorization and legal/product review.',
    prohibitedInitialUse: [
      'public hazard overlays',
      'property risk scoring',
      'insurance, safety, or emergency advice',
      'customer-facing geographic intelligence activation',
    ],
    privacySensitivity: 'HIGH',
    readiness: 'DEFER_HIGH_SENSITIVITY',
    activationPriority: 6,
    unresolvedQuestions: [
      'Confirm whether any use beyond official emergency-context linking is acceptable.',
      'Confirm disclaimer and liability requirements.',
      'Confirm whether REIE should intentionally not compete in hazard interpretation.',
    ],
  },
  {
    datasetId: 'BCOD-TRAILHEADS-DEPRECATED',
    title: 'Boulder Area Trailheads',
    catalogItemId: '0e60d76e0da2469db5315677ee0ac277',
    catalogUrl:
      'https://opendata-bouldercounty.hub.arcgis.com/api/search/v1/collections/dataset/items/0e60d76e0da2469db5315677ee0ac277',
    serviceUrl: 'https://maps.bouldercounty.org/arcgis/rest/services/ParksOpenSpace/REC_BoulderAreaTrailheads/MapServer/0',
    provider: 'Boulder County, Colorado',
    sourceDepartment: 'Boulder County Parks and Open Space',
    access: 'public',
    license: 'CC-BY-4.0 in catalog record; deprecated status controls product use.',
    contentStatus: 'deprecated',
    updateCadence: 'Static as of 2026-05-11 according to catalog record; source recommends COTREX replacements.',
    modifiedDateUtc: '2026-05-14T05:55:19Z',
    geographicScope: 'Trailheads providing access to recreational trails in or adjacent to Boulder County.',
    geometryType: 'Point',
    supportedFormats: ['JSON', 'geoJSON', 'PBF'],
    representativeFields: ['field list not needed because dataset is not activation-eligible'],
    customerValue:
      'Low for REIE activation because the dataset is explicitly being sunsetted and replaced by another source.',
    allowedInitialUse: 'Inventory only; use as a negative-selection example in the activation gate.',
    prohibitedInitialUse: [
      'customer-facing trailhead context',
      'activation candidate ranking',
      'scheduled acquisition',
      'public recreation guidance',
    ],
    privacySensitivity: 'LOW',
    readiness: 'DEFER_DEPRECATED_OR_STATIC',
    activationPriority: 99,
    unresolvedQuestions: [
      'If recreation context is later authorized, evaluate COTREX and source rights separately.',
    ],
  },
]);

export const BOULDER_COUNTY_PROVIDER_CONFIRMATION_QUESTIONS: readonly ProviderConfirmationQuestion[] =
  Object.freeze([
    { id: 'Q01', question: 'Confirm that each named catalog item is Boulder County-authorized for third-party reuse.', requiredForActivation: true },
    { id: 'Q02', question: 'Confirm whether catalog-level CC-BY-4.0 terms or each item license controls when the two differ.', requiredForActivation: true },
    { id: 'Q03', question: 'Confirm required attribution wording for Boulder County, department, dataset title, license, and access date.', requiredForActivation: true },
    { id: 'Q04', question: 'Confirm whether REIE may store a snapshot of selected public records internally.', requiredForActivation: true },
    { id: 'Q05', question: 'Confirm whether REIE may transform source records into normalized internal observations.', requiredForActivation: true },
    { id: 'Q06', question: 'Confirm whether REIE may aggregate records into city-level or neighborhood-level summaries.', requiredForActivation: true },
    { id: 'Q07', question: 'Confirm whether derived summaries may be displayed to customers with attribution.', requiredForActivation: true },
    { id: 'Q08', question: 'Confirm whether raw geometries may be stored internally, and whether public map display is restricted.', requiredForActivation: true },
    { id: 'Q09', question: 'Confirm whether address, parcel, account, or tax district fields have field-level restrictions.', requiredForActivation: true },
    { id: 'Q10', question: 'Confirm whether owner/person names, if present in future datasets, must be excluded.', requiredForActivation: true },
    { id: 'Q11', question: 'Confirm export formats and supported API endpoints for scheduled use.', requiredForActivation: true },
    { id: 'Q12', question: 'Confirm rate limits, acceptable automation cadence, and contact channel for operational issues.', requiredForActivation: true },
    { id: 'Q13', question: 'Confirm whether credentials, accounts, contracts, or fees are required for any selected dataset.', requiredForActivation: true },
    { id: 'Q14', question: 'Confirm source update cadence and whether changed-record deltas are available.', requiredForActivation: true },
    { id: 'Q15', question: 'Confirm retention expectations for stale, corrected, deprecated, or removed records.', requiredForActivation: true },
    { id: 'Q16', question: 'Confirm whether deletion or correction requests require downstream removal by REIE.', requiredForActivation: true },
    { id: 'Q17', question: 'Confirm whether custom-license datasets can be used under the same terms as CC-BY catalog datasets.', requiredForActivation: true },
    { id: 'Q18', question: 'Confirm required disclaimer language for approximate boundaries, data completeness, and no-warranty notices.', requiredForActivation: true },
    { id: 'Q19', question: 'Confirm whether provider wants review of any public wording before launch.', requiredForActivation: true },
    { id: 'Q20', question: 'Confirm escalation contacts for future source changes, deprecations, or license updates.', requiredForActivation: true },
  ]);

export const BOULDER_COUNTY_COUNSEL_REVIEW_ITEMS: readonly CounselReviewItem[] = Object.freeze([
  {
    id: 'CR-01',
    topic: 'License hierarchy',
    question: 'When Boulder County catalog, ArcGIS item, and service metadata differ, which license and disclaimer governs REIE use?',
    provisionalStatus: 'COUNSEL_REVIEW_REQUIRED',
  },
  {
    id: 'CR-02',
    topic: 'Storage and transformation',
    question: 'Can REIE store and transform selected public records into durable internal evidence after provider confirmation?',
    provisionalStatus: 'COUNSEL_REVIEW_REQUIRED',
  },
  {
    id: 'CR-03',
    topic: 'Customer display',
    question: 'Can REIE publish derived non-predictive editorial summaries without exposing raw records, parcels, or account identifiers?',
    provisionalStatus: 'COUNSEL_REVIEW_REQUIRED',
  },
  {
    id: 'CR-04',
    topic: 'Field exclusions',
    question: 'Which fields must be excluded from ingestion, persistence, customer display, search indexing, or generated copy?',
    provisionalStatus: 'COUNSEL_REVIEW_REQUIRED',
  },
  {
    id: 'CR-05',
    topic: 'Hazard and safety datasets',
    question: 'Should emergency alert or hazard-adjacent datasets remain outside REIE absent a separate compliance program?',
    provisionalStatus: 'NOT_APPROVED',
  },
]);

export const BOULDER_COUNTY_FIRST_ACTIVATION_BOUNDARY: FirstActivationBoundary = Object.freeze({
  recommendedDatasets: ['BCOD-ADDRESS-POINTS', 'BCOD-PARK-BOUNDARIES'],
  maxInitialDatasets: 2,
  approvedRuntimeEffects: ['none in this sprint'],
  prohibitedRuntimeEffects: [
    'provider execution',
    'scheduled acquisition',
    'database writes',
    'Prisma/schema changes',
    'customer-facing dataset display',
    'public GIS or map-layer activation',
    'search indexing',
    'AI interpretation',
    'property-level scoring',
  ],
  minimumExitCriteria: [
    'provider answers all required confirmation questions',
    'counsel approves storage, transformation, aggregation, attribution, and field exclusions',
    'additive persistence migration is separately authorized',
    'deterministic no-write acquisition adapter is separately authorized',
    'public copy and disclaimer boundaries are separately reviewed',
  ],
});

export const BOULDER_COUNTY_PERSISTENCE_DECISION_GATE: PersistenceDecisionGate = Object.freeze({
  existingPersistenceReusable: false,
  futureMigrationRequired: true,
  requiredObjects: [
    'source',
    'dataset',
    'source_license_snapshot',
    'provider_confirmation',
    'counsel_decision',
    'acquisition_run',
    'raw_record_pointer',
    'normalized_observation',
    'geographic_subject',
    'evidence_version',
    'attribution',
    'review_decision',
  ],
  requiredFields: [
    'source_id',
    'dataset_id',
    'license',
    'terms_url',
    'accessed_at',
    'modified_at_source',
    'allowed_uses',
    'prohibited_uses',
    'field_exclusions',
    'attribution_text',
    'freshness_status',
    'confidence',
    'review_status',
    'supersedes_id',
  ],
  desirableFields: [
    'source_contact',
    'rate_limit_notes',
    'retention_policy',
    'provider_case_number',
    'counsel_reviewer',
    'public_copy_limitations',
  ],
  unnecessaryForFirstActivation: [
    'customer account relationships',
    'recommendation-engine fields',
    'telemetry links',
    'AI prompt artifacts',
    'mortgage or lender workflow objects',
  ],
  prohibitedUntilAuthorized: [
    'reuse of existing market-data persistence as the evidence store',
    'unversioned source snapshots',
    'raw owner/person display',
    'writes from provider data into production',
  ],
});

export const BOULDER_COUNTY_COST_OPERATIONS_ASSESSMENT: CostOperationsAssessment = Object.freeze({
  publicCatalogCost: 'No fee identified for public catalog review; production use still requires provider confirmation.',
  providerFees: 'Unknown for automated or bulk use; explicit confirmation required.',
  engineeringEffort: 'MEDIUM',
  operationsEffort: 'MEDIUM',
  monitoringNeeds: [
    'license and terms page change monitoring',
    'dataset deprecation monitoring',
    'source modified-date and freshness monitoring',
    'field-list drift detection',
    'failed acquisition and rate-limit reporting after activation is separately authorized',
  ],
  supportRisks: [
    'custom license differences across items',
    'address and account field sensitivity',
    'deprecated recreation datasets',
    'hazard-adjacent dataset misuse risk',
    'public expectations if approximate boundaries are displayed without caveats',
  ],
});

export function getBoulderCountyOpenDataActivationCandidates() {
  return [...BOULDER_COUNTY_OPEN_DATASETS].sort((a, b) => a.activationPriority - b.activationPriority);
}

export function getRecommendedBoulderCountyFirstActivationDatasets() {
  return BOULDER_COUNTY_OPEN_DATASETS.filter((dataset) =>
    BOULDER_COUNTY_FIRST_ACTIVATION_BOUNDARY.recommendedDatasets.includes(dataset.datasetId),
  );
}
