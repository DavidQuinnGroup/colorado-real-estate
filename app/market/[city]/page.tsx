import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight, Compass, HelpCircle, Home, Lock, MapPinned, Search, ShieldCheck, Zap } from 'lucide-react';

import CityMarketStats from '@/components/CityMarketStats';
import ContinueYourDecision from '@/components/ContinueYourDecision';
import FinancingConfidenceEducation from '@/components/FinancingConfidenceEducation';
import LeadCapture from '@/components/LeadCapture';
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
import { buildCityMarketExperience } from '@/lib/marketIntelligenceExperience';
import { buildCityMarketProduct3Experience } from '@/lib/marketProduct3';
import { neighborhoods, type Neighborhood } from '@/lib/neighborhoods';
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
  const transitionStats = {
    ...cityData.stats,
    medianPrice: parseCurrency(cityData.stats.medianPrice),
  };
  const cityDecisionGuideLocalContextLabel =
    cityDecisionGuide?.maturity === 'ENHANCED_FOUNDATION' ? 'Local Context' : 'Neighborhood Context';

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
      <FAQSchema faqs={cityFaqs} pageUrl={canonicalUrl} />

      <section
        className="border-b border-white/5 bg-[radial-gradient(circle_at_82%_14%,rgba(207,250,254,0.12),transparent_30%),linear-gradient(180deg,#071017,#030303)]"
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
        <div className="mx-auto max-w-6xl px-6 pb-10 pt-12 md:pt-16">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-cyan-100 shadow-[0_0_18px_rgba(207,250,254,0.45)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.32em] text-cyan-100/78">
              Colorado Market Intelligence
            </span>
          </div>

          <h1 className="mb-6 max-w-5xl text-5xl font-black uppercase leading-[0.9] tracking-normal md:text-7xl">
            {cityData.name}
            <br />
            <span className="text-white/32">{cityDecisionGuide ? 'Decision Guide' : 'Market Context'}</span>
          </h1>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <p className="max-w-2xl text-base leading-8 text-white/64 md:text-lg">
              {cityDecisionGuide
                ? cityDecisionGuide.identity
                : `Understand what the ${cityData.name} market may mean before you compare homes, prepare a seller plan, or narrow into a
              neighborhood. Start with the primary signal, then verify property-specific context.`}
            </p>

            <div className="grid grid-cols-2 overflow-hidden rounded-[8px] bg-white/[0.07] shadow-[0_20px_70px_rgba(0,0,0,0.28)]">
              <div className="p-5">
                <p className="mb-2 text-[9px] font-black uppercase tracking-[0.18em] text-white/38">Primary Signal</p>
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

          <div className="mt-8 grid gap-3 md:grid-cols-3">
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

          {cityDecisionGuide ? (
            <section
              className="mt-8 grid gap-3 rounded-[8px] bg-white/[0.045] p-5 md:grid-cols-5"
              data-testid={`${cityDecisionGuide.key}-decision-snapshot`}
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
