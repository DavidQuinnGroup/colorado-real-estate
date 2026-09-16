import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  AGENT_PROPERTY_DISCOVERY_MIN_QUERY_LENGTH,
  AGENT_PROPERTY_DISCOVERY_RESULT_LIMIT,
  AGENT_PROPERTY_DISCOVERY_VERSION,
  createAgentPropertyDiscoveryService,
} from '../lib/agentPropertyDiscovery';

const serviceSource = readFileSync('lib/agentPropertyDiscovery.ts', 'utf8');
const route = readFileSync('app/api/agent/property-discovery/route.ts', 'utf8');
const informationRoute = readFileSync('app/api/agent/client-case-information/route.ts', 'utf8');
const auth = readFileSync('lib/admin/adminAuth.ts', 'utf8');
const workspace = readFileSync('components/agent/ClientCaseInformationWorkspace.tsx', 'utf8');
const schema = readFileSync('prisma/schema.prisma', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> };

assert.equal(AGENT_PROPERTY_DISCOVERY_VERSION, 'AGENT_PROPERTY_DISCOVERY_STAGE_1_V1');
assert.equal(AGENT_PROPERTY_DISCOVERY_MIN_QUERY_LENGTH, 2);
assert.equal(AGENT_PROPERTY_DISCOVERY_RESULT_LIMIT, 8);
assert.equal(packageJson.scripts?.['check:agent-property-discovery-search-select'], 'jiti scripts/checkAgentPropertyDiscoverySearchSelect.ts');
assert.match(route, /\/api\/agent\/property-discovery/);
assert.match(route, /authorizeAdminRequest/);
assert.match(route, /Cache-Control': 'private, no-store/);
assert.match(route, /createAgentPropertyDiscoveryService\(prisma\)\.search/);
assert.match(auth, /surface\('\/api\/agent\/property-discovery', 'READ_ONLY_ADMIN_API'/);
assert.match(informationRoute, /ATTACH_DISCOVERED_PROPERTY/);
assert.match(informationRoute, /canonicalPropertyIdForResultToken/);
assert.match(workspace, /\/api\/agent\/property-discovery/);
assert.match(workspace, /role="combobox"/);
assert.match(workspace, /role="listbox"/);
assert.match(workspace, /role="option"/);
assert.match(workspace, /ArrowDown|ArrowUp|Escape/);
assert.match(workspace, /AbortController/);
assert.match(workspace, /setTimeout\(\(\) => \{/);
assert.match(workspace, /data-selected-property-summary="true"/);
assert.match(workspace, /Add to Client Case/);
assert.doesNotMatch(workspace, /Canonical physical Property ID|CanonicalPhysicalProperty ID/);
assert.doesNotMatch(serviceSource, /Mapbox|LightBox|ATTOM|TitlePro247|fetch\(|searchTypesenseDocuments|typesense/i);
assert.doesNotMatch(schema, /AgentPropertyDiscovery|PropertyDiscoveryToken/);

const now = new Date('2026-09-16T12:00:00.000Z');
const canonicalRows = [
  { id: 'canonical-a', sourceFormattedSitusAddress: '100 Canonical Way', normalizedSitusAddress: '100 CANONICAL WAY', unit: null, city: 'Boulder', state: 'CO', postalCode: '80302', identityStatus: 'ACTIVE', identityConfidence: 'CONFIRMED' },
  { id: 'canonical-b', sourceFormattedSitusAddress: '200 Target Ave', normalizedSitusAddress: '200 TARGET AVE', unit: null, city: 'Boulder', state: 'CO', postalCode: '80302', identityStatus: 'ACTIVE', identityConfidence: 'CONFIRMED' },
  { id: 'canonical-c', sourceFormattedSitusAddress: '300 Investor Rd', normalizedSitusAddress: '300 INVESTOR RD', unit: null, city: 'Longmont', state: 'CO', postalCode: '80501', identityStatus: 'ACTIVE', identityConfidence: 'CONFIRMED' },
  { id: 'ambiguous-a', sourceFormattedSitusAddress: '400 Shared St', normalizedSitusAddress: '400 SHARED ST', unit: null, city: 'Boulder', state: 'CO', postalCode: '80302', identityStatus: 'UNRESOLVED', identityConfidence: 'POSSIBLE' },
  { id: 'ambiguous-b', sourceFormattedSitusAddress: '400 Shared St', normalizedSitusAddress: '400 SHARED ST', unit: null, city: 'Boulder', state: 'CO', postalCode: '80302', identityStatus: 'UNRESOLVED', identityConfidence: 'POSSIBLE' },
];
const listingRows = [
  { id: 'listing-a', mlsId: 'MLS-A', address: '100 Canonical Way', city: 'Boulder', state: 'CO', zip: '80302', status: 'Active', propertyType: 'Residential', isPrivateExclusive: false, updatedAt: now, canonicalListingEvents: [{ canonicalPropertyId: 'canonical-a', status: 'CURRENT', isCurrent: true, confidence: 'CONFIRMED', verificationRequired: false, canonicalProperty: canonicalRows[0] }] },
  { id: 'listing-z', mlsId: 'MLS-Z', address: '999 Listing Only Ln', city: 'Boulder', state: 'CO', zip: '80302', status: 'Active', propertyType: 'Residential', isPrivateExclusive: false, updatedAt: now, canonicalListingEvents: [] },
];

function match(value: string | null | undefined, query: string) {
  return Boolean(value?.toLowerCase().includes(query.toLowerCase()));
}

const db: any = {
  clientCase: { findFirst: async ({ where }: any) => where.ownerAgentSubject === 'agent-a' && where.id === 'case-a' ? { id: 'case-a' } : null },
  clientCaseProperty: { findMany: async () => [{ canonicalPropertyId: 'canonical-b' }] },
  canonicalPhysicalProperty: {
    findMany: async ({ where, take }: any) => {
      const query = where.OR[0].sourceFormattedSitusAddress.contains;
      return canonicalRows.filter((row) => match(row.sourceFormattedSitusAddress, query) || match(row.normalizedSitusAddress, query) || match(row.city, query) || match(row.postalCode, query)).slice(0, take);
    },
    findFirst: async ({ where }: any) => canonicalRows.find((row) => row.id === where.id) ?? null,
  },
  property: {
    findMany: async ({ where, take }: any) => {
      const query = where.OR[0].address.contains;
      return listingRows.filter((row) => row.status === 'Active' && !row.isPrivateExclusive && (match(row.address, query) || match(row.city, query) || match(row.zip, query) || match(row.mlsId, query))).slice(0, take);
    },
  },
};

const service = createAgentPropertyDiscoveryService(db);
const short = await service.search('agent-a', 'case-a', '1');
assert.equal(short.state, 'QUERY_TOO_SHORT');
const canonical = await service.search('agent-a', 'case-a', '100 canonical');
assert.equal(canonical.state, 'RESULTS');
assert.equal(canonical.results.length, 1, 'canonical/listing duplicate should collapse');
assert.equal(canonical.results[0].resolutionState, 'EXISTING_CANONICAL');
assert.equal(canonical.results[0].attachable, true);
assert.equal(await service.canonicalPropertyIdForResultToken('agent-a', 'case-a', canonical.results[0].resultToken), 'canonical-a');
const linked = await service.search('agent-a', 'case-a', '200 target');
assert.equal(linked.results[0].alreadyLinked, true);
const listingOnly = await service.search('agent-a', 'case-a', '999 listing');
assert.equal(listingOnly.results[0].resolutionState, 'LISTING_FOUND_BUT_NOT_ATTACHABLE');
assert.equal(listingOnly.results[0].attachable, false);
const ambiguous = await service.search('agent-a', 'case-a', '400 shared');
assert.equal(ambiguous.results.every((result) => result.resolutionState === 'AMBIGUOUS' && !result.attachable), true);
const noResult = await service.search('agent-a', 'case-a', 'no such address');
assert.equal(noResult.state, 'NO_RESULT');
await assert.rejects(() => service.search('agent-b', 'case-a', '100'), /OWNERSHIP_DENIED/);
assert.equal(await service.canonicalPropertyIdForResultToken('agent-a', 'case-a', 'canonical-a'), null);

console.log('agent-property-discovery-search-select: PASS');
