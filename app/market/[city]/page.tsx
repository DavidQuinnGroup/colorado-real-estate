import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight, Compass, HelpCircle, Home, Lock, MapPinned, Search, ShieldCheck, Zap } from 'lucide-react';

import CityMarketStats from '@/components/CityMarketStats';
import ContinueYourDecision from '@/components/ContinueYourDecision';
import FinancingConfidenceEducation from '@/components/FinancingConfidenceEducation';
import LeadCapture from '@/components/LeadCapture';
import LocalSourceFreshnessCue from '@/components/LocalSourceFreshnessCue';
import MarketHomesLinks from '@/components/MarketHomesLinks';
import MarketNeighborhoodLinks from '@/components/MarketNeighborhoodLinks';
import MarketProduct3VisualIntelligence from '@/components/MarketProduct3VisualIntelligence';
import ResilienceDashboard from '@/components/ResilienceDashboard';
import RelatedArticles from '@/components/RelatedArticles';
import FAQSchema from '@/components/schema/FAQSchema';
import { cities, getCityByMarketSlug, isCityMarketRoutePublic, type CityData } from '@/lib/cities';
import { getDecisionGuideRegistryEntry } from '@/lib/coloradoDecisionGuideRegistry';
import { getJourneyMeasurementAttributes, type CustomerJourneyStage } from '@/lib/customerJourneyMeasurement';
import {
  buildDecisionGuide,
  buildDecisionGuideContinuityLinks,
  type DecisionGuideContinuityDestination,
  DECISION_GUIDE_EVIDENCE_TRANSPARENCY,
  DECISION_GUIDE_ENHANCED_FOUNDATION_SOURCE,
  DECISION_GUIDE_FOUNDATION_SOURCE,
  DECISION_GUIDE_FRAMEWORK,
  DECISION_GUIDE_FRAMEWORK_STEPS,
  DECISION_GUIDE_SOURCE,
  DECISION_GUIDE_TRUST_BOUNDARIES,
} from '@/lib/decisionGuidePlatform';
import { buildMarketDecisionWorkspace } from '@/lib/marketDecisionWorkspace';
import { buildMarketAeoContract } from '@/lib/marketAeoPilot';
import { buildCityMarketExperience } from '@/lib/marketIntelligenceExperience';
import { buildCityMarketProduct3Experience } from '@/lib/marketProduct3';
import { neighborhoods, type Neighborhood } from '@/lib/neighborhoods';
import { buildLocalSourceFreshnessPresentation } from '@/lib/searchMapLocalTrustAdvancement';
import { generateFAQs } from '@/lib/schema/generateFAQs';
import { buildCityMarketSchema } from '@/lib/schema/neighborhoodSchema';

type MarketPageParams = {
  city: string;
};

type MarketPageProps = {
  params: Promise<MarketPageParams>;
};

type CityAuthoritySignals = {
  neighborhoodCount: number;
  firstNeighborhood?: Neighborhood;
};

function getContinuityMeasurementDestination(destination: DecisionGuideContinuityDestination): CustomerJourneyStage {
  if (destination === 'market') {
    return 'market';
  }
  if (destination === 'seller-guidance') {
    return 'seller';
  }
  if (destination === 'city-search' || destination === 'buyer-guidance') {
    return 'search';
  }
  return 'inquiry';
}

const SITE_URL = 'https://davidquinngroup.com';

function normalizeRouteSegment(value: string) {
  return value.trim().toLowerCase();
}

function getCityData(citySlug: string) {
  return getCityByMarketSlug(citySlug);
}

function getCityNeighborhoods(city: CityData) {
  return neighborhoods
    .filter((neighborhood) => normalizeRouteSegment(neighborhood.city) === normalizeRouteSegment(city.name))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function parseCurrency(value: string) {
  const numericValue = Number(value.replace(/[^0-9.]/g, ''));
  return Number.isFinite(numericValue) ? numericValue : 0;
}

function getCanonicalPath(city: CityData) {
  return `/market/${city.marketSlug}`;
}

function getCanonicalUrl(city: CityData) {
  return `${SITE_URL}${getCanonicalPath(city)}`;
}

function getCityDescription(city: CityData) {
  return `David Quinn Group's ${city.name}, Colorado housing market intelligence report combines local real estate data, neighborhood context, property search paths, evidence, and verification guidance.`;
}

function getCityKeywords(city: CityData) {
  return [
    `${city.name} Colorado real estate`,
    `${city.name} housing market`,
    `${city.name} homes for sale`,
    `${city.name} neighborhood intelligence`,
    `${city.name} market report`,
    'Colorado real estate intelligence',
    'David Quinn Group',
    'Boulder Denver Front Range real estate',
  ];
}

function getNeighborhoodPath(neighborhood: Neighborhood) {
  return `/market/${neighborhood.city.toLowerCase()}/${neighborhood.slug}`;
}

function getAuthoritySignals(cityNeighborhoods: Neighborhood[]): CityAuthoritySignals {
  const neighborhoodCount = cityNeighborhoods.length;

  return {
    neighborhoodCount,
    firstNeighborhood: cityNeighborhoods[0],
  };
}

function getJsonLd(city: CityData, cityNeighborhoods: Neighborhood[]) {
  return buildCityMarketSchema({
    name: city.name,
    description: getCityDescription(city),
    url: getCanonicalUrl(city),
    neighborhoods: cityNeighborhoods.map((neighborhood) => ({
      name: neighborhood.name,
      url: `${SITE_URL}${getNeighborhoodPath(neighborhood)}`,
    })),
  });
}

function getCityFaqs(city: CityData) {
  return generateFAQs(city.name, 'housing-market-intelligence').slice(0, 4);
}

export function generateStaticParams() {
  return cities
    .filter((city) => city.marketSlug && isCityMarketRoutePublic(city))
    .map((city) => ({
      city: city.marketSlug,
    }));
}

export async function generateMetadata({ params }: MarketPageProps): Promise<Metadata> {
  const { city } = await params;
  const cityData = getCityData(city);

  if (!cityData || !isCityMarketRoutePublic(cityData)) {
    return {
      title: 'Colorado Market Report Not Found',
    };
  }

  const canonicalUrl = getCanonicalUrl(cityData);
  const description = getCityDescription(cityData);

  return {
    title: `${cityData.name}, CO Housing Market Intelligence | David Quinn Group`,
    description,
    keywords: getCityKeywords(cityData),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${cityData.name}, CO Housing Market Intelligence | David Quinn Group`,
      description,
      url: canonicalUrl,
      siteName: 'David Quinn Group',
      locale: 'en_US',
      type: 'website',
    },
  };
}

export default async function MarketReportPage({ params }: MarketPageProps) {
  const { city } = await params;
  const cityData = getCityData(city);

  if (!cityData || !isCityMarketRoutePublic(cityData)) return notFound();

  const cityNeighborhoods = getCityNeighborhoods(cityData);
  const featuredNeighborhood = cityNeighborhoods[0];
  const authoritySignals = getAuthoritySignals(cityNeighborhoods);
  const cityFaqs = getCityFaqs(cityData);
  const canonicalUrl = getCanonicalUrl(cityData);
  const cityMarketSchema = getJsonLd(cityData, cityNeighborhoods);
  const cityMarketSchemaGraph = cityMarketSchema['@graph'];
  const marketExperience = buildCityMarketExperience(cityData, cityNeighborhoods.length);
  const marketProduct3Experience = buildCityMarketProduct3Experience({
    city: cityData,
    marketExperience,
    neighborhoodCount: cityNeighborhoods.length,
  });
  const marketAeoPilot = buildMarketAeoContract({
    city: cityData,
    marketExperience,
    neighborhoodCount: cityNeighborhoods.length,
  });
  const decisionGuideEligibility = getDecisionGuideRegistryEntry(cityData);
  const cityDecisionGuide = buildDecisionGuide({
    city: cityData,
    cityNeighborhoods,
    marketSignal: marketExperience.directionLabel,
    eligibility: decisionGuideEligibility,
  });
  const marketDecisionWorkspace = buildMarketDecisionWorkspace({
    scope: 'city',
    name: cityData.name,
    marketSignal: marketExperience.directionLabel,
    competitivenessSignal: marketExperience.competitivenessLabel,
    timingSignal: marketExperience.timingLabel,
    pricingSignal: marketExperience.pricingLabel,
    inventorySignal: `${cityData.stats.inventory} active inventory signal`,
    neighborhoodCount: cityNeighborhoods.length,
    resilienceSignal: `${authoritySignals.neighborhoodCount} neighborhood paths and property-specific verification context`,
    searchHref: `/search?city=${encodeURIComponent(cityData.name)}`,
    marketHref: getCanonicalPath(cityData),
    sellerHref: '/sell',
  });
  const localSourceFreshness = buildLocalSourceFreshnessPresentation({
    surface: 'city',
    title: `What the ${cityData.name} local signal represents.`,
    source: 'Governed REIE city market route data, public decision-guide context, and visible market answer-contract evidence.',
    observedUpdated: marketAeoPilot ? marketAeoPilot.freshness.label : 'Rendered from the current public city market route.',
    representation: `${cityData.name} market context with ${cityNeighborhoods.length} neighborhood hubs and visible city-market statistics.`,
    limitation:
      'City context is directional. Property condition, records, taxes, HOA, insurance, title, lending, and contract questions require verification.',
  });
  const transitionStats = {
    ...cityData.stats,
    medianPrice: parseCurrency(cityData.stats.medianPrice),
  };
  const cityDecisionGuideLocalContextLabel =
    cityDecisionGuide?.maturity === 'ENHANCED_FOUNDATION' ? 'Local Context' : 'Neighborhood Context';
  const cityReadinessEvidence = [
    {
      label: 'Evidence available now',
      body: `${cityData.name} has current city signals, ${cityData.stats.inventory} inventory context, ${authoritySignals.neighborhoodCount} neighborhood paths, Search continuation, and existing Property investigation paths.`,
    },
    {
      label: 'Evidence unavailable here',
      body: 'This city briefing cannot verify property condition, inspections, taxes, HOA details, insurance, financing readiness, seller motivation, contract risk, or personal suitability.',
    },
    {
      label: 'Assumptions to keep separate',
      body: 'City direction, pricing, competitiveness, and timing are directional context. They are not appreciation predictions, investment conclusions, or neighborhood rankings.',
    },
  ];
  const cityReadinessThresholds = [
    {
      label: 'Search threshold',
      body: `Move to Search when ${cityData.name} context gives the customer visible criteria to compare against active inventory.`,
    },
    {
      label: 'Neighborhood threshold',
      body: 'Open neighborhood context when the customer needs place organization, housing pattern, access, or verification questions without ranking places.',
    },
    {
      label: 'Property threshold',
      body: 'Open Property from Search when a listing still fits the visible criteria and the customer can name what remains to verify.',
    },
    {
      label: 'Professional threshold',
      body: 'Prepare Advisory questions when market assumptions affect timing, pricing, preparation, or negotiation strategy.',
    },
  ];

  return (
    <main className="market-surface min-h-screen bg-[#030303] text-white">
      <script
        type="application/ld+json"
        data-testid="reie-city-market-schema"
        data-city-market-schema-type="City"
        data-city-market-schema-url={canonicalUrl}
        data-city-market-schema-name={cityData.name}
        data-city-market-schema-market-slug={cityData.marketSlug}
        data-city-market-schema-neighborhood-count={cityNeighborhoods.length}
        data-city-market-schema-featured-neighborhood={featuredNeighborhood?.name ?? ""}
        data-city-market-schema-median-price={cityData.stats.medianPrice}
        data-city-market-schema-inventory={cityData.stats.inventory}
        data-city-market-schema-health-state={marketExperience.directionLabel}
        data-city-market-schema-access-context="available"
        data-city-market-schema-graph-count={cityMarketSchemaGraph.length}
        data-city-market-schema-has-breadcrumb="true"
        data-city-market-schema-has-neighborhoods={cityNeighborhoods.length > 0 ? "true" : "false"}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(cityMarketSchema),
        }}
      />
      <FAQSchema faqs={marketAeoPilot?.structuredDataFaqs ?? cityFaqs} pageUrl={canonicalUrl} />

      <section
        className="border-b border-white/5 bg-[radial-gradient(circle_at_82%_14%,rgba(207,250,254,0.12),transparent_30%),linear-gradient(180deg,#071017,#030303)]"
        data-city-market-briefing-hero="true"
        data-city-market-briefing-status="implemented"
        data-city-market-briefing-question="What is happening in this city market, what evidence matters, and what should I investigate next?"
        data-city-market-briefing-ai="false"
        data-city-market-briefing-provider-change="false"
        data-city-market-briefing-telemetry="false"
        data-city-market-briefing-ranking="false"
        data-testid={cityDecisionGuide ? `${cityDecisionGuide.key}-decision-guide-hero` : undefined}
        data-city-decision-guide={cityDecisionGuide ? 'true' : undefined}
        data-city-decision-guide-key={cityDecisionGuide?.key}
        data-city-decision-guide-maturity={cityDecisionGuide?.maturity}
        data-city-decision-guide-public-eligible={cityDecisionGuide ? String(cityDecisionGuide.publicEligibility) : undefined}
        data-city-decision-guide-ai={cityDecisionGuide ? String(DECISION_GUIDE_TRUST_BOUNDARIES.ai) : undefined}
        data-city-decision-guide-gis={cityDecisionGuide ? String(DECISION_GUIDE_TRUST_BOUNDARIES.gis) : undefined}
        data-city-decision-guide-telemetry={cityDecisionGuide ? String(DECISION_GUIDE_TRUST_BOUNDARIES.telemetry) : undefined}
        data-city-decision-guide-ranking={cityDecisionGuide ? String(DECISION_GUIDE_TRUST_BOUNDARIES.ranking) : undefined}
        data-city-decision-guide-demographic-targeting={cityDecisionGuide ? String(DECISION_GUIDE_TRUST_BOUNDARIES.demographicTargeting) : undefined}
        data-boulder-decision-guide={cityDecisionGuide?.key === 'boulder' ? 'true' : undefined}
        data-boulder-decision-guide-ai={cityDecisionGuide?.key === 'boulder' ? String(DECISION_GUIDE_TRUST_BOUNDARIES.ai) : undefined}
        data-boulder-decision-guide-gis={cityDecisionGuide?.key === 'boulder' ? String(DECISION_GUIDE_TRUST_BOUNDARIES.gis) : undefined}
        data-boulder-decision-guide-telemetry={cityDecisionGuide?.key === 'boulder' ? String(DECISION_GUIDE_TRUST_BOUNDARIES.telemetry) : undefined}
        data-boulder-decision-guide-ranking={cityDecisionGuide?.key === 'boulder' ? String(DECISION_GUIDE_TRUST_BOUNDARIES.ranking) : undefined}
        data-boulder-decision-guide-demographic-targeting={cityDecisionGuide?.key === 'boulder' ? String(DECISION_GUIDE_TRUST_BOUNDARIES.demographicTargeting) : undefined}
        data-louisville-decision-guide={cityDecisionGuide?.key === 'louisville' ? 'true' : undefined}
        data-louisville-decision-guide-ai={cityDecisionGuide?.key === 'louisville' ? String(DECISION_GUIDE_TRUST_BOUNDARIES.ai) : undefined}
        data-louisville-decision-guide-gis={cityDecisionGuide?.key === 'louisville' ? String(DECISION_GUIDE_TRUST_BOUNDARIES.gis) : undefined}
        data-louisville-decision-guide-telemetry={cityDecisionGuide?.key === 'louisville' ? String(DECISION_GUIDE_TRUST_BOUNDARIES.telemetry) : undefined}
        data-louisville-decision-guide-ranking={cityDecisionGuide?.key === 'louisville' ? String(DECISION_GUIDE_TRUST_BOUNDARIES.ranking) : undefined}
        data-louisville-decision-guide-demographic-targeting={cityDecisionGuide?.key === 'louisville' ? String(DECISION_GUIDE_TRUST_BOUNDARIES.demographicTargeting) : undefined}
        data-lafayette-decision-guide={cityDecisionGuide?.key === 'lafayette' ? 'true' : undefined}
        data-lafayette-decision-guide-ai={cityDecisionGuide?.key === 'lafayette' ? String(DECISION_GUIDE_TRUST_BOUNDARIES.ai) : undefined}
        data-lafayette-decision-guide-gis={cityDecisionGuide?.key === 'lafayette' ? String(DECISION_GUIDE_TRUST_BOUNDARIES.gis) : undefined}
        data-lafayette-decision-guide-telemetry={cityDecisionGuide?.key === 'lafayette' ? String(DECISION_GUIDE_TRUST_BOUNDARIES.telemetry) : undefined}
        data-lafayette-decision-guide-ranking={cityDecisionGuide?.key === 'lafayette' ? String(DECISION_GUIDE_TRUST_BOUNDARIES.ranking) : undefined}
        data-lafayette-decision-guide-demographic-targeting={cityDecisionGuide?.key === 'lafayette' ? String(DECISION_GUIDE_TRUST_BOUNDARIES.demographicTargeting) : undefined}
      >
        <div className="mx-auto max-w-6xl px-6 pb-12 pt-12 md:pt-16">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-cyan-100 shadow-[0_0_18px_rgba(207,250,254,0.45)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.32em] text-cyan-100/78">
              {cityData.name} City Market Briefing
            </span>
          </div>

          <h1 className="mb-6 max-w-5xl text-4xl font-black uppercase leading-[0.96] tracking-normal md:text-6xl">
            What is happening in this city market, what evidence matters, and what should I investigate next?
          </h1>

          <div className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr] lg:items-end">
            <p className="max-w-2xl text-base leading-8 text-white/64 md:text-lg">
              Use this {cityData.name} briefing to understand the current signal, decide which evidence deserves attention, and choose the next
              Search, Neighborhood, Property, or Advisory step without treating market context as a prediction.
            </p>

            <div className="grid grid-cols-2 overflow-hidden rounded-[8px] bg-white/[0.07] shadow-[0_20px_70px_rgba(0,0,0,0.28)]">
              <div className="p-5">
                <p className="mb-2 text-[9px] font-black uppercase tracking-[0.18em] text-white/38">Current Signal</p>
                <p className="text-xl font-black uppercase tracking-tight text-white">{marketExperience.directionLabel}</p>
              </div>
              <div className="p-5">
                <p className="mb-2 text-[9px] font-black uppercase tracking-[0.18em] text-white/38">Inventory</p>
                <p className="text-xl font-black uppercase tracking-tight text-white">{cityData.stats.inventory}</p>
              </div>
            </div>
          </div>

          {cityDecisionGuide ? (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/search?city=${encodeURIComponent(cityData.name)}`}
                className="market-primary-cta"
                data-testid={`${cityDecisionGuide.key}-decision-guide-search-cta`}
                {...getJourneyMeasurementAttributes({
                  surface: `${cityDecisionGuide.key}-decision-guide-hero`,
                  stage: 'market',
                  action: 'start-search',
                  destination: 'search',
                })}
              >
                <Search className="h-4 w-4" />
                Search With Market Context
              </Link>
              <Link
                href={`#${cityDecisionGuide.neighborhoodSectionId}`}
                className="market-secondary-cta"
                data-testid={`${cityDecisionGuide.key}-decision-guide-neighborhoods-cta`}
              >
                <MapPinned className="h-4 w-4" />
                {cityDecisionGuideLocalContextLabel}
              </Link>
            </div>
          ) : null}

          <div
            className="mt-8 grid gap-3 md:grid-cols-3"
            data-testid="city-market-current-signals"
            data-city-market-signal-count="3"
          >
            <div className="rounded-[8px] bg-white/[0.055] p-4">
              <p className="mb-2 text-[9px] font-black uppercase tracking-[0.18em] text-white/36">Median Price</p>
              <p className="text-lg font-black uppercase tracking-tight text-white">{cityData.stats.medianPrice}</p>
            </div>
            <div className="rounded-[8px] bg-white/[0.055] p-4">
              <p className="mb-2 text-[9px] font-black uppercase tracking-[0.18em] text-white/36">Neighborhood Hubs</p>
              <p className="text-lg font-black uppercase tracking-tight text-white">{authoritySignals.neighborhoodCount}</p>
            </div>
            <div className="rounded-[8px] bg-white/[0.055] p-4">
              <p className="mb-2 text-[9px] font-black uppercase tracking-[0.18em] text-white/36">Timing Context</p>
              <p className="text-lg font-black uppercase tracking-tight text-white">{marketExperience.timingLabel}</p>
            </div>
          </div>
          <p
            className="mt-6 max-w-3xl text-xs leading-6 text-white/42"
            data-testid="market-source-disclaimer"
            data-market-sales-source-control="present"
            data-market-non-participation-disclaimer="present"
          >
            Market statistics are market-wide REIE context from governed city data and public MLS/search signals where available. They do
            not state or imply that David Quinn, David Quinn Group, or Compass listed, sold, or participated in every reported property.
          </p>
          <div className="mt-6">
            <LocalSourceFreshnessCue presentation={localSourceFreshness} />
          </div>

          {marketAeoPilot ? (
            <section
              className="mt-8 grid gap-5 rounded-[8px] bg-cyan-100/[0.05] p-5 ring-1 ring-cyan-100/10 lg:grid-cols-[0.82fr_1.18fr]"
              data-testid={marketAeoPilot.route === 'boulder-co-housing-market' ? 'boulder-market-aeo-pilot' : 'market-aeo-multi-city-contract'}
              data-market-aeo-pilot={marketAeoPilot.route === 'boulder-co-housing-market' ? 'boulder' : undefined}
              data-market-aeo-contract="multi-city"
              data-market-aeo-status={marketAeoPilot.status}
              data-market-aeo-route={marketAeoPilot.route}
              data-market-aeo-source-id={marketAeoPilot.source.id}
              data-market-aeo-geography={`${marketAeoPilot.geography.city}, ${marketAeoPilot.geography.state}`}
              data-market-aeo-market-period={marketAeoPilot.marketPeriod}
              data-market-aeo-freshness={marketAeoPilot.freshness.status}
              data-market-aeo-evidence-state={marketAeoPilot.evidenceState}
              data-market-aeo-conflict-state={marketAeoPilot.conflictState}
              data-market-aeo-visible-answer-count={marketAeoPilot.visibleAnswers.length}
              data-market-aeo-structured-data="FAQPage"
              data-market-aeo-schema-visible-alignment="true"
              data-market-aeo-provider-activation="false"
              data-market-aeo-boulder-county-open-data="false"
              data-market-aeo-address-points="false"
              data-market-aeo-park-boundaries="false"
              data-market-aeo-api-change="false"
              data-market-aeo-persistence="false"
              data-market-aeo-telemetry="false"
              data-market-aeo-ai="false"
            >
              <div>
                <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/72">
                  {marketAeoPilot.geography.city} Market Answer Contract
                </p>
                <h2 className="text-2xl font-black uppercase leading-tight tracking-normal text-white md:text-3xl">
                  What this {marketAeoPilot.geography.city} signal can safely answer.
                </h2>
                <div className="mt-5 grid gap-3">
                  {[
                    ['Source', marketAeoPilot.source.label],
                    ['Period', marketAeoPilot.marketPeriod],
                    ['Freshness', marketAeoPilot.freshness.label],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-[8px] bg-[#071017]/74 p-4">
                      <p className="text-[9px] font-black uppercase tracking-[0.18em] text-cyan-100/68">{label}</p>
                      <p className="mt-2 text-sm leading-6 text-white/56">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3">
                {marketAeoPilot.visibleAnswers.map((item) => (
                  <article
                    key={item.question}
                    className="rounded-[8px] bg-[#071017]/82 p-4 ring-1 ring-white/[0.055]"
                    data-market-aeo-claim-eligible={String(item.claimEligible)}
                  >
                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-cyan-100/68">
                      {item.claimEligible ? 'Eligible Answer' : 'Excluded Claim'}
                    </p>
                    <h3 className="mt-2 text-base font-black uppercase leading-6 tracking-tight text-white">{item.question}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/58">{item.answer}</p>
                    <p className="mt-3 text-xs leading-5 text-white/42">{item.limitation}</p>
                  </article>
                ))}
                <div
                  className="rounded-[8px] bg-black/20 p-4"
                  data-testid={marketAeoPilot.route === 'boulder-co-housing-market' ? 'boulder-market-aeo-limitations' : 'market-aeo-limitations'}
                >
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-cyan-100/68">Limitations</p>
                  <ul className="mt-3 space-y-2 text-xs leading-5 text-white/48">
                    {marketAeoPilot.limitations.map((limitation) => (
                      <li key={limitation}>{limitation}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          ) : null}

          {cityDecisionGuide ? (
            <section
              className="mt-8 grid gap-3 rounded-[8px] bg-white/[0.045] p-5 md:grid-cols-5"
              data-testid={`${cityDecisionGuide.key}-decision-snapshot`}
              data-city-market-briefing-snapshot="true"
              data-local-decision-intelligence="phase-1"
              data-local-decision-intelligence-phase={cityDecisionGuide.maturity === 'ENHANCED_FOUNDATION' ? 'phase-2-enhanced-foundation' : 'phase-1'}
              data-local-decision-intelligence-city={cityDecisionGuide.cityName}
              data-local-decision-intelligence-maturity={cityDecisionGuide.maturity}
              data-local-decision-intelligence-ai="false"
              data-local-decision-intelligence-gis="false"
              data-local-decision-intelligence-telemetry="false"
              data-local-decision-intelligence-ranking="false"
              data-local-decision-intelligence-valuation="false"
            >
              <h2 className="sr-only">Decision Snapshot</h2>
              {[
                ['Where am I?', cityDecisionGuide.decisionSnapshot.whereAmI],
                ['What matters most?', cityDecisionGuide.decisionSnapshot.mattersMost],
                ['What should I watch?', cityDecisionGuide.decisionSnapshot.payAttention],
                ['What should I verify?', cityDecisionGuide.decisionSnapshot.verify],
                ['Best next step', cityDecisionGuide.decisionSnapshot.bestNextStep],
              ].map(([label, value]) => (
                <div key={label} className="min-w-0">
                  <p className="text-[9px] font-black uppercase tracking-[0.16em] text-cyan-100/68">{label}</p>
                  <p className="mt-2 text-xs leading-5 text-white/58">{value}</p>
                </div>
              ))}
            </section>
          ) : null}
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-6 pb-24 pt-10">
        <section
          className="grid gap-6 rounded-[8px] bg-white/[0.04] p-5 md:p-8 lg:grid-cols-[0.86fr_1.14fr]"
          data-testid="city-market-briefing-decision-evidence"
          data-city-market-briefing-evidence="decision-relevance"
          data-city-market-directional-versus-verified="present"
          data-city-market-fair-housing-boundary="present"
          data-city-market-professional-boundary="present"
        >
          <div>
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/72">
              Evidence That Matters
            </p>
            <h2 className="text-3xl font-black uppercase leading-tight tracking-normal text-white md:text-4xl">
              Read {cityData.name} as context for investigation, not a conclusion.
            </h2>
            <p className="mt-5 text-sm leading-7 text-white/58 md:text-base">
              The useful question is not whether a city is right for every customer. It is which current signals, neighborhood paths,
              property facts, and professional verification steps should shape the next review.
            </p>
          </div>

          <div className="grid gap-3">
            {[
              {
                label: 'Current market signals',
                value: `${marketExperience.directionLabel}; ${marketExperience.competitivenessLabel}`,
                explanation: 'Use the citywide signal to frame inventory and pace before comparing individual homes.',
              },
              {
                label: 'Evidence to inspect',
                value: `${cityData.stats.inventory} inventory signal; ${authoritySignals.neighborhoodCount} neighborhood paths`,
                explanation: 'Compare active inventory, neighborhood context, property condition, records, and route-specific facts before relying on the overview.',
              },
              {
                label: 'Directional versus verified',
                value: 'Briefing first, verification next',
                explanation: 'Market context is directional. Property condition, pricing strategy, financing, legal, tax, and timing questions require source review and qualified professional judgment.',
              },
            ].map((item) => (
              <article key={item.label} className="rounded-[8px] bg-[#071017]/82 p-5">
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-cyan-100/70">{item.label}</p>
                <h3 className="mt-3 text-lg font-black uppercase leading-6 tracking-tight text-white">{item.value}</h3>
                <p className="mt-3 text-sm leading-6 text-white/55">{item.explanation}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          className="grid gap-6 rounded-[8px] bg-cyan-100/[0.045] p-5 md:p-8 lg:grid-cols-[1fr_0.9fr]"
          data-testid="city-market-briefing-investigation-paths"
          data-city-market-neighborhood-paths="investigation"
          data-city-market-neighborhood-ranking="false"
        >
          <div>
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/72">
              What To Investigate Next
            </p>
            <h2 className="text-3xl font-black uppercase leading-tight tracking-normal text-white md:text-4xl">
              Move from city signal to the evidence source.
            </h2>
          </div>

          <div className="grid gap-3">
            {[
              'Which active listings match the current inventory signal, and which facts need property-level verification?',
              'Which neighborhood pages clarify geography, housing context, and local questions without ranking places?',
              'Which market assumptions should be reviewed with an advisor before making a buying or selling decision?',
            ].map((question) => (
              <p key={question} className="rounded-[8px] bg-[#071017]/80 p-4 text-sm leading-7 text-white/58">
                {question}
              </p>
            ))}
          </div>
        </section>

        <section
          className="grid gap-6 rounded-[8px] bg-white/[0.04] p-5 md:p-8 lg:grid-cols-[0.88fr_1.12fr]"
          data-testid="dxt-2-city-market-decision-readiness-depth"
          data-dxt-2-city-market-readiness-depth="implemented"
          data-dxt-2-city-market-readiness-runtime-scope="app/market/[city]/page.tsx"
          data-dxt-2-city-market-readiness-existing-evidence-only="true"
          data-dxt-2-city-market-readiness-search-change="false"
          data-dxt-2-city-market-readiness-neighborhood-change="false"
          data-dxt-2-city-market-readiness-property-change="false"
          data-dxt-2-city-market-readiness-product-3-preserved="true"
          data-dxt-2-city-market-readiness-schema-preserved="true"
          data-dxt-2-city-market-readiness-faq-preserved="true"
          data-dxt-2-city-market-readiness-provider-activation="false"
          data-dxt-2-city-market-readiness-api-change="false"
          data-dxt-2-city-market-readiness-hidden-context="false"
          data-dxt-2-city-market-readiness-persistence="false"
          data-dxt-2-city-market-readiness-telemetry="false"
          data-dxt-2-city-market-readiness-ranking="false"
          data-dxt-2-city-market-readiness-ai="false"
        >
          <div>
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/72">
              City Market Decision Readiness
            </p>
            <h2 className="text-3xl font-black uppercase leading-tight tracking-normal text-white md:text-4xl">
              Decide whether {cityData.name} evidence is ready for Search, neighborhood, or property investigation.
            </h2>
            <p className="mt-5 text-sm leading-7 text-white/58 md:text-base">
              City Market readiness means the current city signal is organized enough to choose the next evidence source. Confidence is
              qualitative and descriptive; it is not a score, recommendation, forecast, pricing certainty, investment conclusion, or
              suitability finding.
            </p>
            <p className="mt-5 rounded-[8px] bg-cyan-100/[0.055] p-4 text-xs leading-6 text-white/50">
              Freshness and verification stay near the decision point: use city evidence to frame the question, then verify neighborhood
              context, property facts, records, financing assumptions, and professional questions before relying on it.
            </p>
          </div>

          <div className="grid gap-3">
            {cityReadinessEvidence.map((item) => (
              <article key={item.label} className="rounded-[8px] bg-[#071017]/82 p-5 ring-1 ring-white/[0.055]">
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-cyan-100/70">{item.label}</p>
                <p className="mt-3 text-sm leading-6 text-white/56">{item.body}</p>
              </article>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-4 lg:col-span-2" data-testid="dxt-2-city-market-readiness-thresholds">
            {cityReadinessThresholds.map((item) => (
              <article key={item.label} className="rounded-[8px] bg-black/20 p-4">
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-cyan-100/70">{item.label}</p>
                <p className="mt-3 text-sm leading-6 text-white/54">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <MarketProduct3VisualIntelligence experience={marketProduct3Experience} />

        <ContinueYourDecision
          stage="market"
          cameFrom="Market discovery, search, or a neighborhood page"
          currentDecision={`Decide how ${cityData.name} market context should guide the next move.`}
          whyHere="This city guide connects market evidence, neighborhood paths, property search, and verification prompts without forecasting or ranking places."
          nextStep="Compare neighborhood context, search active inventory, or use the confidence layer before relying on the signal."
          links={[
            { label: 'Search With Market Context', href: `/search?city=${encodeURIComponent(cityData.name)}`, note: 'Review active homes' },
            { label: 'Neighborhood Context', href: featuredNeighborhood ? getNeighborhoodPath(featuredNeighborhood) : '#market-neighborhood-context', note: 'Open local context' },
            { label: 'All Markets', href: '/market', note: 'Broaden comparison' },
          ]}
        />

        <section
          className="grid gap-6 rounded-[8px] bg-white/[0.04] p-5 md:p-8 lg:grid-cols-[0.82fr_1.18fr]"
          data-testid="dxt-city-market-continuity-implementation"
          data-dxt-market-family-continuity="city-market"
          data-dxt-market-family-hidden-context="false"
          data-dxt-market-family-persistence="false"
          data-dxt-market-family-telemetry="false"
          data-dxt-market-family-shared-state="false"
          data-dxt-market-family-map-provider-change="false"
          data-dxt-city-market-neighborhood-ranking="false"
        >
          <div>
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/72">Route Ownership</p>
            <h2 className="text-3xl font-black uppercase leading-tight tracking-normal text-white md:text-4xl">
              Move from {cityData.name} evidence to the right next surface.
            </h2>
            <p className="mt-5 text-sm leading-7 text-white/58 md:text-base">
              This city briefing explains the city-level signal. It does not rank neighborhoods, predict appreciation, or decide
              whether a property is suitable. Search remains the inventory path; Neighborhood remains the place-orientation path.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                label: 'Search owns inventory',
                body: `Use active ${cityData.name} listings when the next question is what is available now.`,
                href: `/search?city=${encodeURIComponent(cityData.name)}`,
                action: 'Search With Market Context',
              },
              {
                label: 'Neighborhood owns place',
                body: 'Use local context to understand organization and verification questions without ranking places.',
                href: featuredNeighborhood ? getNeighborhoodPath(featuredNeighborhood) : '#market-neighborhood-context',
                action: 'Open Neighborhood Context',
              },
              {
                label: 'Property owns address facts',
                body: 'Open a listing from Search when the decision needs condition, records, taxes, HOA, inspection, and contract review.',
                href: `/search?city=${encodeURIComponent(cityData.name)}`,
                action: 'Find Properties In Search',
              },
              {
                label: 'Advisory owns preparation',
                body: 'Use Advisory only after the customer knows which market or property assumption needs professional discussion.',
                href: '/contact#advisory-readiness',
                action: 'Prepare Advisory Questions',
              },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="reie-market-action-link group rounded-[8px] bg-[#071017]/82 p-5 text-white no-underline ring-1 ring-white/[0.06] transition hover:bg-white/[0.055] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
                data-testid="dxt-city-market-continuity-link"
              >
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-cyan-100/68">{item.label}</p>
                <p className="mt-3 text-sm leading-6 text-white/56">{item.body}</p>
                <span className="mt-5 inline-flex text-[10px] font-black uppercase tracking-[0.14em] text-cyan-100 transition group-hover:text-white">
                  {item.action}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {cityDecisionGuide ? (
          <>
            <section
              className="grid gap-6 py-4 lg:grid-cols-[0.82fr_1.18fr]"
              data-testid={`${cityDecisionGuide.key}-decision-guide-summary`}
              data-city-decision-guide-framework={DECISION_GUIDE_FRAMEWORK}
              data-city-decision-guide-source={
                cityDecisionGuide.maturity === 'FOUNDATION'
                  ? DECISION_GUIDE_FOUNDATION_SOURCE
                  : cityDecisionGuide.maturity === 'ENHANCED_FOUNDATION'
                    ? DECISION_GUIDE_ENHANCED_FOUNDATION_SOURCE
                    : DECISION_GUIDE_SOURCE
              }
              data-city-decision-guide-school-ranking={String(DECISION_GUIDE_TRUST_BOUNDARIES.schoolRanking)}
              data-city-decision-guide-safety-ranking={String(DECISION_GUIDE_TRUST_BOUNDARIES.safetyRanking)}
              data-city-decision-guide-investment-recommendation={String(DECISION_GUIDE_TRUST_BOUNDARIES.investmentRecommendation)}
              data-boulder-decision-guide-framework={cityDecisionGuide.key === 'boulder' ? DECISION_GUIDE_FRAMEWORK : undefined}
              data-boulder-decision-guide-source={cityDecisionGuide.key === 'boulder' ? DECISION_GUIDE_SOURCE : undefined}
              data-boulder-decision-guide-school-ranking={cityDecisionGuide.key === 'boulder' ? String(DECISION_GUIDE_TRUST_BOUNDARIES.schoolRanking) : undefined}
              data-boulder-decision-guide-safety-ranking={cityDecisionGuide.key === 'boulder' ? String(DECISION_GUIDE_TRUST_BOUNDARIES.safetyRanking) : undefined}
              data-boulder-decision-guide-investment-recommendation={cityDecisionGuide.key === 'boulder' ? String(DECISION_GUIDE_TRUST_BOUNDARIES.investmentRecommendation) : undefined}
              data-louisville-decision-guide-framework={cityDecisionGuide.key === 'louisville' ? DECISION_GUIDE_FRAMEWORK : undefined}
              data-louisville-decision-guide-source={cityDecisionGuide.key === 'louisville' ? DECISION_GUIDE_SOURCE : undefined}
              data-louisville-decision-guide-school-ranking={cityDecisionGuide.key === 'louisville' ? String(DECISION_GUIDE_TRUST_BOUNDARIES.schoolRanking) : undefined}
              data-louisville-decision-guide-safety-ranking={cityDecisionGuide.key === 'louisville' ? String(DECISION_GUIDE_TRUST_BOUNDARIES.safetyRanking) : undefined}
              data-louisville-decision-guide-investment-recommendation={cityDecisionGuide.key === 'louisville' ? String(DECISION_GUIDE_TRUST_BOUNDARIES.investmentRecommendation) : undefined}
              data-lafayette-decision-guide-framework={cityDecisionGuide.key === 'lafayette' ? DECISION_GUIDE_FRAMEWORK : undefined}
              data-lafayette-decision-guide-source={cityDecisionGuide.key === 'lafayette' ? DECISION_GUIDE_SOURCE : undefined}
              data-lafayette-decision-guide-school-ranking={cityDecisionGuide.key === 'lafayette' ? String(DECISION_GUIDE_TRUST_BOUNDARIES.schoolRanking) : undefined}
              data-lafayette-decision-guide-safety-ranking={cityDecisionGuide.key === 'lafayette' ? String(DECISION_GUIDE_TRUST_BOUNDARIES.safetyRanking) : undefined}
              data-lafayette-decision-guide-investment-recommendation={cityDecisionGuide.key === 'lafayette' ? String(DECISION_GUIDE_TRUST_BOUNDARIES.investmentRecommendation) : undefined}
            >
              <div>
                <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/72">
                  {cityDecisionGuide.summaryEyebrow}
                </p>
                <h2 className="text-3xl font-black uppercase leading-tight tracking-normal text-white md:text-5xl">
                  {cityDecisionGuide.summaryHeadline}
                </h2>
                <p className="mt-5 text-sm leading-7 text-white/58 md:text-base">
                  {cityDecisionGuide.summaryIntro}
                </p>
              </div>

              <div className="grid gap-3">
                {cityDecisionGuide.decisionSummary.map((item) => (
                  <article key={item.label} className="rounded-[8px] bg-white/[0.055] p-5">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-cyan-100/68">{item.label}</p>
                    <h3 className="mt-3 text-lg font-black uppercase leading-6 tracking-tight text-white">{item.value}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/52">{item.explanation}</p>
                  </article>
                ))}
              </div>
            </section>

            <section
              className="grid gap-3 rounded-[8px] bg-cyan-100/[0.045] p-5 md:grid-cols-5"
              data-testid={`${cityDecisionGuide.key}-decision-guide-framework`}
            >
              {DECISION_GUIDE_FRAMEWORK_STEPS.map(({ label, explanation }) => (
                <div key={label} className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">{label}</p>
                  <p className="mt-2 text-sm leading-6 text-white/55">
                    {label === 'Context'
                      ? `Understand ${cityDecisionGuide.cityName} as a city and a set of neighborhood patterns.`
                      : explanation}
                  </p>
                </div>
              ))}
            </section>

            <section className="grid gap-10 lg:grid-cols-2" data-testid={`${cityDecisionGuide.key}-decision-guide-context`}>
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <Home className="h-5 w-5 text-cyan-100" />
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/72">Housing Context</p>
                </div>
                <div className="space-y-5">
                  {cityDecisionGuide.housingContext.map((item) => (
                    <article key={item.label}>
                      <h3 className="text-lg font-black uppercase tracking-tight text-white">{item.label}</h3>
                      <p className="mt-2 text-sm leading-7 text-white/55">{item.explanation}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-5 flex items-center gap-3">
                  <Compass className="h-5 w-5 text-cyan-100" />
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/72">Practical Living Context</p>
                </div>
                <div className="space-y-5">
                  {cityDecisionGuide.practicalContext.map((item) => (
                    <article key={item.label}>
                      <h3 className="text-lg font-black uppercase tracking-tight text-white">{item.label}</h3>
                      <p className="mt-2 text-sm leading-7 text-white/55">{item.explanation}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]" data-testid={`${cityDecisionGuide.key}-decision-guide-tradeoffs`}>
              <div>
                <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/72">
                  Strengths And Trade-offs
                </p>
                <h2 className="text-3xl font-black uppercase leading-tight tracking-normal text-white md:text-4xl">
                  Use balanced local context, not assumptions.
                </h2>
              </div>
              <div className="grid gap-3">
                {cityDecisionGuide.tradeoffs.map((item) => (
                  <article key={item.strength} className="grid gap-4 rounded-[8px] bg-white/[0.045] p-5 md:grid-cols-2">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.18em] text-cyan-100/70">Strength</p>
                      <p className="mt-2 text-sm leading-6 text-white/64">{item.strength}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/36">Trade-off To Evaluate</p>
                      <p className="mt-2 text-sm leading-6 text-white/52">{item.tradeoff}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section
              className="grid gap-6 rounded-[8px] bg-white/[0.04] p-5 md:p-8 lg:grid-cols-[0.8fr_1.2fr]"
              data-testid={`${cityDecisionGuide.key}-decision-guide-questions`}
            >
              <div>
                <HelpCircle className="mb-5 h-7 w-7 text-cyan-100" />
                <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/72">
                  Questions To Verify
                </p>
                <h2 className="text-3xl font-black uppercase leading-tight tracking-normal text-white">
                  Convert interest into research.
                </h2>
              </div>
              <div className="grid gap-3">
                {cityDecisionGuide.verificationQuestions.map((question) => (
                  <p key={question} className="rounded-[8px] bg-[#071017]/80 p-4 text-sm leading-7 text-white/58">
                    {question}
                  </p>
                ))}
              </div>
            </section>

            {cityDecisionGuide.evidenceTransparency ? (
              <section
                className="grid gap-6 rounded-[8px] border border-cyan-100/10 bg-[#071017]/74 p-5 md:p-8 lg:grid-cols-[0.82fr_1.18fr]"
                data-testid={`${cityDecisionGuide.key}-decision-guide-evidence-transparency`}
                data-decision-guide-evidence-transparency={DECISION_GUIDE_EVIDENCE_TRANSPARENCY}
                data-decision-guide-evidence-transparency-guide={cityDecisionGuide.key}
                data-decision-guide-evidence-transparency-maturity={cityDecisionGuide.maturity}
                data-decision-guide-evidence-transparency-public-copy="true"
                data-decision-guide-evidence-transparency-internal-metadata="false"
                data-decision-guide-evidence-transparency-score="false"
                data-decision-guide-evidence-transparency-ranking="false"
                data-decision-guide-evidence-transparency-provider="false"
                data-decision-guide-evidence-transparency-api="false"
              >
                <div>
                  <ShieldCheck className="mb-5 h-7 w-7 text-cyan-100" />
                  <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/72">
                    {cityDecisionGuide.evidenceTransparency.maturityLabel}
                  </p>
                  <h2 className="text-3xl font-black uppercase leading-tight tracking-normal text-white">
                    {cityDecisionGuide.evidenceTransparency.heading}
                  </h2>
                  <p className="mt-5 text-sm leading-7 text-white/58">
                    {cityDecisionGuide.evidenceTransparency.introduction}
                  </p>
                  <p className="mt-5 rounded-[8px] bg-white/[0.045] p-4 text-sm leading-7 text-white/56">
                    {cityDecisionGuide.evidenceTransparency.maturityExplanation}
                  </p>
                </div>

                <div className="grid gap-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    {cityDecisionGuide.evidenceTransparency.items.map((item) => (
                      <article key={item.dimension} className="rounded-[8px] bg-white/[0.045] p-4">
                        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-cyan-100/70">{item.label}</p>
                        <p className="mt-3 text-sm leading-6 text-white/55">{item.explanation}</p>
                      </article>
                    ))}
                  </div>
                  <article className="rounded-[8px] bg-black/20 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <Lock className="h-4 w-4 text-cyan-100" />
                      <p className="text-[9px] font-black uppercase tracking-[0.18em] text-cyan-100/70">Decision Boundary</p>
                    </div>
                    <p className="text-sm leading-6 text-white/55">{cityDecisionGuide.evidenceTransparency.decisionBoundary}</p>
                    <p className="mt-3 text-sm leading-6 text-white/50">{cityDecisionGuide.evidenceTransparency.nextStepGuidance}</p>
                  </article>
                </div>
              </section>
            ) : null}

            <section
              id={cityDecisionGuide.neighborhoodSectionId}
              className="scroll-mt-24"
              data-testid={`${cityDecisionGuide.key}-decision-guide-neighborhoods`}
            >
              <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <span className="sr-only">Explore {cityDecisionGuide.cityName} Neighborhoods</span>
                  <p className="mb-2 text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/72">
                    {cityDecisionGuide.neighborhoodsEyebrow}
                  </p>
                  <h2 className="text-3xl font-black uppercase leading-tight tracking-normal text-white md:text-4xl">
                    {cityDecisionGuide.neighborhoodsHeadline}
                  </h2>
                </div>
                <Link
                  href={`/search?city=${encodeURIComponent(cityData.name)}`}
                  className="reie-decision-link reie-decision-link--secondary inline-flex min-h-11 items-center justify-center gap-2 rounded-[6px] px-4 py-3 text-xs font-black uppercase tracking-[0.14em] transition"
                >
                  Search With Market Context
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
              {cityNeighborhoods.length > 0 ? (
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {cityNeighborhoods.slice(0, 8).map((neighborhood) => (
                    <Link
                      key={neighborhood.slug}
                      href={getNeighborhoodPath(neighborhood)}
                      className="reie-decision-link reie-decision-link--card group rounded-[8px] bg-white/[0.045] p-5 text-white no-underline transition hover:bg-white/[0.075]"
                    >
                      <p className="text-lg font-black uppercase tracking-tight transition group-hover:text-cyan-100">
                        {neighborhood.name}
                      </p>
                      <p className="mt-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/34">
                        {neighborhood.primaryAnchor}
                      </p>
                      <p className="mt-4 text-sm leading-6 text-white/50">{neighborhood.tacticalLever}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <article className="rounded-[8px] bg-white/[0.045] p-5" data-testid={`${cityDecisionGuide.key}-decision-guide-local-context-fallback`}>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/70">
                    Citywide Context Boundary
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/55">
                    Governed neighborhood links are not yet certified for {cityDecisionGuide.cityName}. Use the citywide context, active search,
                    property facts, municipal records, qualified professional review, and advisory guidance before drawing location-specific
                    conclusions.
                  </p>
                </article>
              )}
            </section>

            <section
              className="grid gap-3 rounded-[8px] bg-cyan-100/[0.045] p-5 md:grid-cols-3 xl:grid-cols-6"
              data-testid={`${cityDecisionGuide.key}-decision-guide-continuity`}
              data-local-decision-search-continuity="true"
              data-local-decision-financing-continuity="true"
              data-local-decision-grand-plan-continuity="true"
              data-local-decision-advisory-continuity="true"
            >
              {buildDecisionGuideContinuityLinks({
                guide: cityDecisionGuide,
                marketHref: getCanonicalPath(cityData),
                searchHref: `/search?city=${encodeURIComponent(cityData.name)}`,
              }).map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="reie-decision-link reie-decision-link--secondary flex min-h-12 items-center justify-between gap-3 rounded-[6px] bg-[#071017]/80 px-4 py-3 text-xs font-black uppercase tracking-[0.12em] transition hover:bg-[#0a1118]"
                  {...getJourneyMeasurementAttributes({
                    surface: cityDecisionGuide.continuitySurface,
                    stage: 'market',
                    action: 'continue-journey',
                    destination: getContinuityMeasurementDestination(item.destination),
                  })}
                  data-local-decision-continuity-destination={item.destination}
                  data-local-decision-continuity-href={item.href}
                >
                  {item.label}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              ))}
            </section>

            <section
              className="grid gap-6 rounded-[8px] bg-white/[0.04] p-5 md:p-8 lg:grid-cols-2"
              data-testid={`${cityDecisionGuide.key}-local-decision-intelligence-standard`}
              data-local-decision-market-context="true"
              data-local-decision-community-context="true"
              data-local-decision-housing-context="true"
              data-local-decision-buyer-considerations="true"
              data-local-decision-seller-considerations="true"
              data-local-decision-verification-checklist="true"
              data-local-decision-evidence-limitations="true"
            >
              <div>
                <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/72">
                  Market Context
                </p>
                <div className="space-y-4">
                  {cityDecisionGuide.marketContext.map((item) => (
                    <article key={item.label}>
                      <h3 className="text-base font-black uppercase tracking-tight text-white">{item.label}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/55">{item.explanation}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/72">
                  Community Context
                </p>
                <div className="space-y-4">
                  {cityDecisionGuide.communityContext.map((item) => (
                    <article key={item.label}>
                      <h3 className="text-base font-black uppercase tracking-tight text-white">{item.label}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/55">{item.explanation}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/72">
                  Buyer Considerations
                </p>
                <div className="space-y-4">
                  {cityDecisionGuide.buyerConsiderations.map((item) => (
                    <article key={item.label}>
                      <h3 className="text-base font-black uppercase tracking-tight text-white">{item.label}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/55">{item.explanation}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/72">
                  Seller Considerations
                </p>
                <div className="space-y-4">
                  {cityDecisionGuide.sellerConsiderations.map((item) => (
                    <article key={item.label}>
                      <h3 className="text-base font-black uppercase tracking-tight text-white">{item.label}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/55">{item.explanation}</p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2">
                <p className="mb-3 text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/72">
                  Evidence &amp; Limitations
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  {cityDecisionGuide.evidenceLimitations.map((item) => (
                    <article key={item.label} className="rounded-[8px] bg-[#071017]/80 p-5">
                      <h3 className="text-base font-black uppercase tracking-tight text-white">{item.label}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/55">{item.explanation}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          </>
        ) : null}

        <section
          className="grid gap-6 rounded-[8px] bg-cyan-100/[0.055] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)] md:p-8 lg:grid-cols-[0.88fr_1.12fr]"
          data-testid="reie-market-v8-decision-workspace"
          data-market-v8-scope="city"
          data-market-v8-city={cityData.name}
          data-market-v8-item-count={marketDecisionWorkspace.items.length}
          data-market-v8-ai="false"
          data-market-v8-forecasting="false"
          data-market-v8-gis="false"
          data-market-v8-telemetry="false"
        >
          <div>
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/78">Market Decision Workspace</p>
            <h2 className="text-3xl font-black uppercase leading-tight tracking-normal text-white md:text-4xl">
              {marketDecisionWorkspace.headline}
            </h2>
            <p className="mt-5 text-sm leading-7 text-white/58 md:text-base">{marketDecisionWorkspace.orientation}</p>
            <p className="mt-5 rounded-[6px] bg-black/20 p-3 text-xs leading-5 text-white/48">
              {marketDecisionWorkspace.trustBoundary}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {marketDecisionWorkspace.items.map((item) => (
              <Link
                key={item.lens}
                href={item.href}
                className="reie-market-action-link group flex min-w-0 flex-col rounded-[8px] bg-[#071017]/80 p-5 text-white no-underline transition hover:bg-[#0a1118]"
                data-testid="reie-market-v8-decision-item"
                data-market-v8-lens={item.lens}
                data-market-v8-action={item.action}
                {...getJourneyMeasurementAttributes({
                  surface: 'city-market-v8-decision-workspace',
                  stage: 'market',
                  action: 'continue-journey',
                  destination: item.lens === 'seller' ? 'seller' : item.lens === 'market-type' || item.lens === 'attention' ? 'market' : 'search',
                })}
              >
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/70">{item.label}</p>
                <p className="mt-3 text-xs leading-6 text-white/55">{item.explanation}</p>
                <span className="mt-auto pt-4 text-[10px] font-black uppercase tracking-[0.14em] text-cyan-100 transition group-hover:text-white">
                  {item.action}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section
          className="grid gap-6 rounded-[8px] bg-white/[0.04] p-5 md:p-8 lg:grid-cols-[1fr_0.85fr]"
          data-testid="cep-market-intelligence-summary"
          data-market-intelligence-scope="city"
          data-market-intelligence-city={cityData.name}
          data-market-intelligence-direction={marketExperience.directionLabel}
          data-market-intelligence-competitiveness={marketExperience.competitivenessLabel}
          data-market-intelligence-pricing={marketExperience.pricingLabel}
          data-market-intelligence-timing={marketExperience.timingLabel}
          data-market-intelligence-provider="none"
          data-market-intelligence-ai-generated="false"
          data-market-intelligence-gis-activated="false"
        >
          <div>
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/72">
              Market Decision Brief
            </p>
            <h2 className="text-3xl font-black uppercase leading-tight tracking-normal text-white md:text-4xl">
              What this market signal means before you search or sell.
            </h2>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-white/58 md:text-base">
              {marketExperience.summary}
            </p>
          </div>

          <div
            className="grid gap-3 sm:grid-cols-2"
            data-testid="cep-market-intelligence-signals"
            data-market-intelligence-signal-count={marketExperience.signals.length}
          >
            {marketExperience.signals.map((signal) => (
              <article
                key={signal.label}
                className="rounded-[8px] bg-[#071017]/82 p-5"
                data-testid="cep-market-intelligence-signal"
                data-market-intelligence-signal={signal.label}
                data-market-intelligence-signal-value={signal.value}
              >
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/36">{signal.label}</p>
                <p className="mt-2 text-base font-black uppercase tracking-tight text-white">{signal.value}</p>
                <p className="mt-3 text-xs leading-6 text-white/45">{signal.explanation}</p>
              </article>
            ))}
          </div>

          <div className="border-t border-white/10 pt-6 lg:col-span-2">
            <div
              className="grid gap-3 sm:grid-cols-3"
              data-testid="cep-market-intelligence-next-steps"
              data-market-intelligence-next-step-count={marketExperience.nextSteps.length}
            >
              {marketExperience.nextSteps.map((step) => (
                <Link
                  key={step.href}
                  href={step.href}
                  className="reie-market-action-link flex min-h-14 items-center justify-between gap-4 rounded-[6px] bg-black/30 px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-white no-underline transition hover:bg-cyan-100/10 hover:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-100/70"
                  data-testid="cep-market-intelligence-next-step"
                  data-market-intelligence-next-step-intent={step.intent}
                  data-market-intelligence-next-step-href={step.href}
                >
                  {step.label}
                  <span aria-hidden="true" className="text-cyan-100">Open</span>
                </Link>
              ))}
            </div>
            <p
              className="mt-5 text-xs leading-6 text-white/40"
              data-testid="cep-market-intelligence-source-note"
              data-market-intelligence-source-boundary="repository-public-context"
            >
              {marketExperience.sourceNote}
            </p>
            <div
              className="mt-5 grid gap-3 sm:grid-cols-3"
              data-testid="cep-navigation-market-journey"
              data-cep-measurement-ready="true"
              data-cep-measurement-active="false"
            >
              <Link
                href="/market"
                className="reie-decision-link reie-decision-link--secondary flex min-h-12 items-center justify-center rounded-[6px] px-4 py-3 text-center text-[11px] font-black uppercase tracking-[0.12em] transition focus:outline-none focus:ring-2 focus:ring-cyan-100/70"
                {...getJourneyMeasurementAttributes({
                  surface: 'city-market-journey',
                  stage: 'market',
                  action: 'view-market',
                  destination: 'market',
                })}
              >
                All Markets
              </Link>
              <Link
                href={`/search?city=${encodeURIComponent(cityData.name)}`}
                className="reie-decision-link reie-decision-link--secondary flex min-h-12 items-center justify-center rounded-[6px] px-4 py-3 text-center text-[11px] font-black uppercase tracking-[0.12em] transition focus:outline-none focus:ring-2 focus:ring-cyan-100/70"
                {...getJourneyMeasurementAttributes({
                  surface: 'city-market-journey',
                  stage: 'market',
                  action: 'start-search',
                  destination: 'search',
                })}
              >
                Search With Market Context
              </Link>
              <Link
                href="/sell"
                className="reie-decision-link reie-decision-link--secondary flex min-h-12 items-center justify-center rounded-[6px] px-4 py-3 text-center text-[11px] font-black uppercase tracking-[0.12em] transition focus:outline-none focus:ring-2 focus:ring-cyan-100/70"
                {...getJourneyMeasurementAttributes({
                  surface: 'city-market-journey',
                  stage: 'market',
                  action: 'request-seller-review',
                  destination: 'seller',
                })}
              >
                Seller Strategy
              </Link>
            </div>
          </div>
        </section>

        <section
          className="grid gap-3 rounded-[8px] bg-cyan-100/[0.045] p-5 md:grid-cols-3"
          data-testid="reie-city-buyer-confidence"
          data-buyer-confidence-neighborhood-guidance="true"
          data-buyer-confidence-forecast="false"
          data-buyer-confidence-ai="false"
          data-buyer-confidence-gis="false"
          data-buyer-confidence-provider-activation="false"
        >
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">Before Search</p>
            <p className="mt-2 text-sm leading-6 text-white/58">Use this city context to understand inventory, pricing, timing, and neighborhood paths before narrowing too quickly.</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">Before Touring</p>
            <p className="mt-2 text-sm leading-6 text-white/58">Compare property facts against the area context, then identify condition, records, cost, and commute questions to verify.</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">Before Contact</p>
            <p className="mt-2 text-sm leading-6 text-white/58">Ask focused questions only after the market and neighborhood context gives you a clearer reason to move forward.</p>
          </div>
        </section>

        <FinancingConfidenceEducation surface="city-market" />

        <section>
          <CityMarketStats stats={transitionStats} />
        </section>

        <section id="market-neighborhood-context" className="relative">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.35em] text-white/30">Neighborhood Context Layer</p>
              <h2 className="text-2xl font-black italic uppercase tracking-tight">Neighborhood Paths</h2>
            </div>
            <span className="w-fit border-b border-[#00ff80] text-[10px] font-bold uppercase tracking-widest text-[#00ff80]">
              Expert Analysis Gated
            </span>
          </div>

          {featuredNeighborhood ? (
            <div className="pointer-events-none grid select-none gap-8 opacity-40 blur-[2px] grayscale">
              <ResilienceDashboard neighborhood={featuredNeighborhood} />
            </div>
          ) : (
            <div className="border border-white/10 bg-white/[0.02] p-8 text-sm italic text-white/50">
              Neighborhood context profiles are being expanded for {cityData.name}.
            </div>
          )}

          <div className="absolute inset-0 z-10 flex items-center justify-center border border-white/5 bg-black/20 p-6 backdrop-blur-sm">
            <div className="max-w-md border border-white/10 bg-[#030303] p-8 text-center shadow-2xl md:p-10">
              <Lock className="mx-auto mb-6 text-[#fbbf24]" size={48} />
              <h3 className="mb-4 text-xl font-black italic uppercase tracking-tight text-white">Request Advisor Review</h3>
              <p className="mb-8 text-xs uppercase leading-relaxed tracking-widest text-white/50">
                Detailed property review, negotiation planning, and private advisory context are discussed directly with David Quinn Group clients.
              </p>
              <button className="w-full bg-[#00ff80] py-4 text-xs font-black italic uppercase tracking-[0.3em] text-black transition-all hover:bg-white">
                Plan Next Steps
              </button>
            </div>
          </div>
        </section>

        <section className="grid gap-12 pt-10 md:grid-cols-[1.15fr_0.85fr]">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <MapPinned className="h-5 w-5 text-[#00ff80]" />
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#00ff80]">Neighborhood Intelligence</h3>
            </div>
            <div className="space-y-4">
              {cityNeighborhoods.map((neighborhood) => (
                <Link
                  key={neighborhood.slug}
                  href={getNeighborhoodPath(neighborhood)}
                  className="reie-decision-link reie-decision-link--card group block border-l border-white/10 py-2 pl-6 transition-colors hover:border-[#00ff80]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h4 className="text-lg font-bold text-white transition-colors group-hover:text-[#00ff80]">{neighborhood.name}</h4>
                    <span className="shrink-0 text-[10px] font-black italic text-white/30">Context</span>
                  </div>
                  <p className="mt-1 text-sm italic text-white/40">
                    Anchored by {neighborhood.primaryAnchor}. {neighborhood.tacticalLever}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between border border-white/5 bg-white/[0.02] p-8">
            <div>
              <Zap className="mb-4 text-[#fbbf24]" size={24} />
              <h3 className="mb-2 text-xl font-black italic uppercase tracking-tight text-white">Access Context</h3>
              <p className="text-xs uppercase leading-relaxed tracking-widest text-white/40">
                {cityData.name} neighborhood paths should be reviewed through daily access, current inventory, condition questions, and
                source freshness before relying on any single property comparison.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <ShieldCheck className="text-white/20" size={20} />
              <p className="text-[9px] font-bold uppercase italic leading-tight tracking-[0.2em] text-white/20">
                Construction context helps frame condition questions, preparation needs, and offer strategy before the next advisory conversation.
              </p>
            </div>
          </div>
        </section>

        <MarketNeighborhoodLinks
          city={cityData.name}
          title={`${cityData.name} Neighborhood Authority Reports`}
        />

        <MarketHomesLinks
          city={cityData.name}
          title={`${cityData.name} Inventory Search Paths`}
        />

        <RelatedArticles
          city={cityData.name}
          currentSlug={cityData.marketSlug}
          title={`${cityData.name} Market Briefs`}
        />

        <section className="border-y border-white/10 py-12">
          <div className="mb-8 max-w-3xl">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.35em] text-[#00ff80]">Market FAQ</p>
            <h2 className="text-2xl font-black italic uppercase tracking-tight text-white">
              {cityData.name} Market Intelligence Questions
            </h2>
          </div>

          <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2">
            {cityFaqs.map((faq) => (
              <article key={faq.question} className="bg-[#030303] p-6">
                <h3 className="text-sm font-black uppercase leading-6 tracking-[0.12em] text-white">
                  {faq.question}
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/55">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <LeadCapture city={cityData.name} />
      </div>
    </main>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/market/[city]/page.tsx
