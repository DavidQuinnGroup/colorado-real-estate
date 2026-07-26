import {
  GIS_FAIL_CLOSED_ACTIVATION,
  type GeographicIntelligenceLayerState,
  type GeographicIntelligenceLifecycle,
  assertGisFailClosedActivation,
} from "./activationContract.js";
import {
  type GeographicIntelligenceDomain,
  type GeographicIntelligenceDomainId,
} from "./domainContract.js";

const FOUNDATION_LIFECYCLE: GeographicIntelligenceLifecycle = "PROPOSED";
const FOUNDATION_STATE: GeographicIntelligenceLayerState = "FOUNDATION_DEFINED";
const NOT_AUTHORIZED: GeographicIntelligenceLayerState = "NOT_AUTHORIZED";

function domain(
  domainId: GeographicIntelligenceDomainId,
  canonicalName: string,
  description: string,
  likelyIntelligenceCategories: readonly string[],
): GeographicIntelligenceDomain {
  return Object.freeze({
    domainId,
    canonicalName,
    description,
    lifecycle: FOUNDATION_LIFECYCLE,
    governanceState: FOUNDATION_STATE,
    acquisitionState: NOT_AUTHORIZED,
    persistenceState: NOT_AUTHORIZED,
    retrievalState: NOT_AUTHORIZED,
    enterpriseConsumptionState: NOT_AUTHORIZED,
    runtimeState: NOT_AUTHORIZED,
    downstreamIntegrationState: NOT_AUTHORIZED,
    customerVisibilityState: NOT_AUTHORIZED,
    activation: GIS_FAIL_CLOSED_ACTIVATION,
    requiredEvidenceCharacteristics: Object.freeze([
      "governed evidence identity",
      "source authority",
      "licensing and permitted-use classification",
      "observation time",
      "effective time when applicable",
      "freshness state",
      "confidence state",
      "transformation lineage",
      "exact geographic subject identity",
    ]),
    likelyIntelligenceCategories: Object.freeze(likelyIntelligenceCategories),
    unsupportedInGisSprint1: Object.freeze([
      "live provider acquisition",
      "production persistence",
      "production retrieval",
      "runtime activation",
      "downstream integration",
      "customer visibility",
      "geographic relationship creation or inference",
      "Colorado enterprise runtime consumption",
    ]),
  });
}

export const GIS_INITIAL_DOMAIN_REGISTRY = Object.freeze([
  domain(
    "COMMUNITY_INTELLIGENCE",
    "Community Intelligence",
    "Governed intelligence about community character, services, amenities, and local context.",
    ["amenity context", "civic services", "community profile", "local context"],
  ),
  domain(
    "EDUCATION_INTELLIGENCE",
    "Education Intelligence",
    "Governed education-context intelligence that preserves source, licensing, temporal, and use-rights boundaries.",
    ["district context", "school proximity context", "education service areas", "source-reported education facts"],
  ),
  domain(
    "TRANSPORTATION_INTELLIGENCE",
    "Transportation Intelligence",
    "Governed intelligence about mobility, commute context, transit access, and transportation infrastructure.",
    ["mobility access", "commute context", "transit proximity", "road network context"],
  ),
  domain(
    "ENVIRONMENTAL_INTELLIGENCE",
    "Environmental Intelligence",
    "Governed environmental-context intelligence with explicit temporal, authority, and licensing controls.",
    ["environmental context", "climate exposure context", "natural feature context", "risk-context indicators"],
  ),
  domain(
    "ECONOMIC_INTELLIGENCE",
    "Economic Intelligence",
    "Governed intelligence about economic context, employment geography, and local economic indicators.",
    ["employment context", "income context", "business activity context", "economic indicators"],
  ),
  domain(
    "INFRASTRUCTURE_INTELLIGENCE",
    "Infrastructure Intelligence",
    "Governed intelligence about utilities, civic infrastructure, service availability, and built-system context.",
    ["utility context", "service infrastructure", "public works context", "built infrastructure"],
  ),
  domain(
    "MARKET_INTELLIGENCE",
    "Market Intelligence",
    "Governed market-context intelligence separated from runtime market analytics and customer presentation.",
    ["market context", "inventory indicators", "pricing context", "sales activity context"],
  ),
  domain(
    "LIFESTYLE_INTELLIGENCE",
    "Lifestyle Intelligence",
    "Governed lifestyle-context intelligence for future composed experiences without current customer activation.",
    ["recreation context", "culture and dining context", "outdoor access", "daily-life context"],
  ),
] as const);

export function getGisInitialDomain(domainId: GeographicIntelligenceDomainId): GeographicIntelligenceDomain {
  const match = GIS_INITIAL_DOMAIN_REGISTRY.find((entry) => entry.domainId === domainId);
  if (!match) throw new Error(`Unknown GIS domain: ${domainId}`);
  return match;
}

export function assertGisInitialDomainRegistryFailClosed(): void {
  if (GIS_INITIAL_DOMAIN_REGISTRY.length !== 8) throw new Error("GIS Sprint 1 requires exactly eight initial domains.");
  for (const entry of GIS_INITIAL_DOMAIN_REGISTRY) {
    assertGisFailClosedActivation(entry.activation);
    if (entry.lifecycle !== "PROPOSED") throw new Error(`GIS domain lifecycle must start at PROPOSED: ${entry.domainId}`);
    if (entry.governanceState !== "FOUNDATION_DEFINED") throw new Error(`GIS domain governance must be foundation-defined: ${entry.domainId}`);
    if (entry.runtimeState !== "NOT_AUTHORIZED") throw new Error(`GIS domain runtime must be not authorized: ${entry.domainId}`);
    if (entry.downstreamIntegrationState !== "NOT_AUTHORIZED") throw new Error(`GIS domain downstream integration must be not authorized: ${entry.domainId}`);
    if (entry.customerVisibilityState !== "NOT_AUTHORIZED") throw new Error(`GIS domain customer visibility must be not authorized: ${entry.domainId}`);
  }
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/lib/geographic-intelligence/domainRegistry.ts
