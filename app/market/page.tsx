import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, BarChart3, Home, MapPinned, Search, ShieldCheck, TrendingUp } from 'lucide-react';

import ContinueYourDecision from '@/components/ContinueYourDecision';
import FinancingConfidenceEducation from '@/components/FinancingConfidenceEducation';
import MarketProduct3VisualIntelligence from '@/components/MarketProduct3VisualIntelligence';
import FAQSchema from '@/components/schema/FAQSchema';
import { cities, isCityMarketRoutePublic, type CityData } from '@/lib/cities';
import { getPublicDecisionGuideRegistryEntries } from '@/lib/coloradoDecisionGuideRegistry';
import { getJourneyMeasurementAttributes } from '@/lib/customerJourneyMeasurement';
import { buildMarketDecisionWorkspace } from '@/lib/marketDecisionWorkspace';
import { buildCityMarketExperience } from '@/lib/marketIntelligenceExperience';
import { buildStateMarketProduct3Experience } from '@/lib/marketProduct3';
import { neighborhoods } from '@/lib/neighborhoods';
import type { FAQItem } from '@/lib/schema/faqSchema';

const SITE_URL = 'https://davidquinngroup.com';
const MARKET_URL = `${SITE_URL}/market`;

export const metadata: Metadata = {
  title: 'Colorado Market Intelligence | David Quinn Group',
  description:
    'Explore Colorado market intelligence for Boulder, Denver, and the Front Range using existing city market reports, neighborhood context, and property search paths.',
  alternates: {
    canonical: MARKET_URL,
  },
  openGraph: {
    title: 'Colorado Market Intelligence | David Quinn Group',
    description:
      'A guided market discovery page connecting Colorado search, property review, city market context, and seller strategy.',
    url: MARKET_URL,
    siteName: 'David Quinn Group',
    locale: 'en_US',
    type: 'website',
  },
};

type CityMarketSummary = {
  city: CityData;
  neighborhoodCount: number;
  direction: string;
  pricing: string;
  timing: string;
};

const marketFaqs: FAQItem[] = [
  {
    question: 'How should buyers use Colorado market intelligence?',
    answer:
      'Use market intelligence to understand pace, price context, inventory depth, and timing before narrowing into search or touring a specific property.',
  },
  {
    question: 'How should sellers use market intelligence?',
    answer:
      'Use market intelligence to frame preparation, positioning, competing inventory, and the right follow-up conversation before requesting a seller review.',
  },
  {
    question: 'Does this page provide a forecast or valuation?',
    answer:
      'No. The market experience uses existing repository city and neighborhood context. It is not a forecast, appraisal, automated valuation, or AI-generated recommendation.',
  },
];

function getCityNeighborhoodCount(city: CityData) {
  return neighborhoods.filter((neighborhood) => neighborhood.city.toLowerCase() === city.name.toLowerCase()).length;
}

function buildCitySummaries(): CityMarketSummary[] {
  return cities
    .filter(isCityMarketRoutePublic)
    .map((city) => {
      const neighborhoodCount = getCityNeighborhoodCount(city);
      const experience = buildCityMarketExperience(city, neighborhoodCount);

      return {
        city,
        neighborhoodCount,
        direction: experience.directionLabel,
        pricing: experience.pricingLabel,
        timing: experience.timingLabel,
      };
    });
}

function getFeaturedMarkets(markets: CityMarketSummary[]) {
  return [...markets]
    .sort((a, b) => b.city.stats.marketHealthScore - a.city.stats.marketHealthScore || a.city.name.localeCompare(b.city.name))
    .slice(0, 4);
}

function getCertifiedDecisionGuides() {
  return getPublicDecisionGuideRegistryEntries()
    .filter((entry) => entry.guideMaturity === 'EDITORIALLY_CERTIFIED' && entry.optionalEditorialOverride)
    .sort((a, b) => a.canonicalName.localeCompare(b.canonicalName));
}

export default function MarketIndexPage() {
  const marketSummaries = buildCitySummaries();
  const featuredMarkets = getFeaturedMarkets(marketSummaries);
  const certifiedDecisionGuides = getCertifiedDecisionGuides();
  const primaryMarket = featuredMarkets[0] || marketSummaries[0];
  const totalNeighborhoodCount = marketSummaries.reduce((total, market) => total + market.neighborhoodCount, 0);
  const marketProduct3Experience = buildStateMarketProduct3Experience({
    cityCount: marketSummaries.length,
    neighborhoodCount: totalNeighborhoodCount,
    certifiedGuideCount: certifiedDecisionGuides.length,
    primaryCondition: primaryMarket?.direction || 'Mixed local conditions',
    primaryPricing: primaryMarket?.pricing || 'City-specific pricing context',
  });
  const marketDecisionWorkspace = buildMarketDecisionWorkspace({
    scope: 'state',
    name: 'Colorado',
    marketSignal: primaryMarket?.direction || 'Mixed local conditions',
    competitivenessSignal: primaryMarket?.timing || 'Preparation matters',
    timingSignal: 'Compare markets before choosing a property path',
    pricingSignal: primaryMarket?.pricing,
    inventorySignal: `${marketSummaries.length} city market paths and ${totalNeighborhoodCount} neighborhood paths`,
    neighborhoodCount: totalNeighborhoodCount,
    searchHref: '/search',
    marketHref: '/market',
    sellerHref: '/sell',
  });
  const marketBriefingPromise =
    'Use current market signals, verified paths, and limitation-aware guidance to decide where to search, which neighborhood context to open, and what deserves professional review.';
  const briefingSignals = [
    {
      label: 'Market direction',
      value: primaryMarket?.direction || 'Mixed local conditions',
      body: 'Use direction as context for pace and comparison, not as a prediction.',
    },
    {
      label: 'Pricing context',
      value: primaryMarket?.pricing || 'City-specific pricing context',
      body: 'Treat pricing language as a starting point for verified property review.',
    },
    {
      label: 'Timing context',
      value: primaryMarket?.timing || 'Preparation matters',
      body: 'Compare timing signals before deciding which search path deserves attention.',
    },
  ];
  const evidenceRows = [
    ['City market paths', `${marketSummaries.length} public paths`, 'Open the city context before narrowing to a property.'],
    ['Neighborhood paths', `${totalNeighborhoodCount} place paths`, 'Use neighborhood context to understand local organization and verification questions.'],
    ['Certified guides', `${certifiedDecisionGuides.length} reviewed guides`, 'Prefer certified local guides where editorial review is already complete.'],
  ];
  const investigationQuestions = [
    'Which market signal changes the next search?',
    'Which neighborhood context should be opened before comparing homes?',
    'Which property-specific facts must be verified before relying on the signal?',
    'Which professional question should be asked before treating market context as strategy?',
  ];

  return (
    <main
      className="market-surface min-h-screen bg-[#030303] text-white"
      data-testid="cep-market-discovery-page"
      data-cep-market-count={marketSummaries.length}
      data-cep-measurement-ready="true"
      data-cep-measurement-active="false"
      data-dxt-wave-1d-market-briefing="true"
      data-dxt-wave-1d-briefing-contract="REIE_DXT_WAVE_1D_MARKET_NEIGHBORHOOD_DISCOVERY_FOUNDATION_CERTIFIED_AND_CLOSED"
      data-dxt-wave-1d-selected-runtime-scope="market-index"
      data-dxt-wave-1d-neighborhood-runtime-change="false"
      data-dxt-wave-1c-buyer-runtime-change="false"
      data-dxt-wave-1c-seller-runtime-change="false"
    >
      <FAQSchema faqs={marketFaqs} pageUrl={MARKET_URL} />

      <section
        className="border-b border-white/8 bg-[radial-gradient(circle_at_82%_14%,rgba(207,250,254,0.12),transparent_30%),linear-gradient(180deg,#071017,#030303)] px-5 py-14 sm:px-8 lg:px-12"
        data-testid="reie-market-v8-decision-workspace"
        data-market-v8-scope="state"
        data-market-v8-item-count={marketDecisionWorkspace.items.length}
        data-market-v8-ai="false"
        data-market-v8-forecasting="false"
        data-market-v8-gis="false"
        data-market-v8-telemetry="false"
      >
        <div className="mx-auto max-w-6xl">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/76">Market Briefing Foundation</p>
          <div className="mt-4 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div data-dxt-market-briefing-role="market-orientation-governing-question-briefing-promise">
              <h1 className="text-3xl font-black uppercase leading-tight tracking-normal text-white md:text-5xl">
                What is happening here, what evidence matters, and what should I investigate next?
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/62">{marketBriefingPromise}</p>
              <p className="mt-4 rounded-[6px] bg-cyan-100/[0.07] p-3 text-xs leading-5 text-white/50">
                {marketDecisionWorkspace.trustBoundary}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/search"
                  className="market-primary-cta"
                  data-dxt-market-briefing-role="dominant-next-action"
                  {...getJourneyMeasurementAttributes({
                    surface: 'market-index-orientation',
                    stage: 'market',
                    action: 'start-search',
                    destination: 'search',
                  })}
                >
                  <Search size={15} aria-hidden="true" />
                  Search With Market Context
                </Link>
                <Link
                  href="#market-evidence-that-matters"
                  className="market-secondary-cta"
                >
                  Review Evidence
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {marketDecisionWorkspace.items.map((item) => (
                <Link
                  key={item.lens}
                  href={item.href}
                  className="reie-market-action-link group flex min-w-0 flex-col rounded-[8px] bg-[#071017]/82 p-4 text-white no-underline transition hover:bg-[#0a1118]"
                  data-testid="reie-market-v8-decision-item"
                  data-market-v8-lens={item.lens}
                  data-market-v8-action={item.action}
                  {...getJourneyMeasurementAttributes({
                    surface: 'market-v8-decision-workspace',
                    stage: 'market',
                    action: 'continue-journey',
                    destination: item.lens === 'seller' ? 'seller' : item.lens === 'market-type' ? 'market' : 'search',
                  })}
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100/58">{item.label}</p>
                  <p className="mt-3 text-xs leading-5 text-white/58">{item.explanation}</p>
                  <span className="mt-auto pt-4 text-[10px] font-black uppercase tracking-[0.14em] text-cyan-100 transition group-hover:text-white">
                    {item.action}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8 lg:px-12" data-testid="dxt-wave-1d-market-briefing-foundation">
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[8px] bg-white/[0.035] p-5 ring-1 ring-white/[0.07]" data-dxt-market-briefing-role="current-market-signals">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100/72">Current Market Signals</p>
            <h2 className="mt-4 text-3xl font-black uppercase leading-tight tracking-normal text-white">
              Read the signal before choosing the next path.
            </h2>
            <div className="mt-6 grid gap-3">
              {briefingSignals.map((signal) => (
                <article key={signal.label} className="rounded-[6px] bg-black/24 p-4">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/38">{signal.label}</p>
                    <p className="text-sm font-black uppercase leading-5 text-cyan-100/82">{signal.value}</p>
                  </div>
                  <p className="mt-3 text-xs leading-6 text-white/54">{signal.body}</p>
                </article>
              ))}
            </div>
          </div>

          <div id="market-evidence-that-matters" className="grid gap-5">
            <div className="rounded-[8px] bg-white/[0.035] p-5 ring-1 ring-white/[0.07]" data-dxt-market-briefing-role="evidence-that-matters">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100/72">Evidence That Matters</p>
              <h2 className="mt-4 text-2xl font-black uppercase leading-tight tracking-normal text-white">
                Group evidence by what it helps the customer decide.
              </h2>
              <div className="mt-5 grid gap-3">
                {evidenceRows.map(([label, value, body]) => (
                  <article key={label} className="rounded-[6px] bg-black/24 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40">{label}</p>
                      <p className="text-xs font-black uppercase leading-5 text-white/76">{value}</p>
                    </div>
                    <p className="mt-3 text-xs leading-6 text-white/52">{body}</p>
                  </article>
                ))}
              </div>
            </div>

            <div
              className="rounded-[8px] bg-cyan-100/[0.055] p-5 ring-1 ring-cyan-100/10"
              data-dxt-market-briefing-role="directional-versus-verified"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100/72">Directional Versus Verified</p>
              <p className="mt-3 text-sm leading-7 text-white/58">
                Market direction, pricing context, timing, and inventory signals are directional. Property condition, taxes, HOA details,
                insurance, title, inspection findings, lending assumptions, and contract risk require source or professional verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="market-core-synthesis" className="px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <MarketProduct3VisualIntelligence experience={marketProduct3Experience} />
        </div>
      </section>

      <section className="px-5 pb-8 pt-2 sm:px-8 lg:px-12" data-testid="market-djx-continuity">
        <div className="mx-auto max-w-6xl">
          <ContinueYourDecision
            stage="market"
            cameFrom="Homepage, search, or a city decision guide"
            currentDecision="Decide which market evidence should guide the next investigation."
            whyHere="The market briefing connects city signals, certified guides, neighborhood paths, property exploration, and advisory review without forecasting, ranking, or suitability conclusions."
            nextStep="Search active inventory, open a certified guide, continue into a neighborhood page, or ask what should be verified."
            links={[
              { label: 'Search With Market Context', href: '/search', note: 'Apply criteria' },
              { label: 'Boulder Market Context', href: '/market/boulder-co-housing-market', note: 'Certified guide' },
              { label: 'Neighborhood Context', href: '/market/boulder/mapleton-hill', note: 'Mapleton Hill' },
              { label: 'Advisory Guidance', href: '/contact', note: 'Verify next question' },
            ]}
          />
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12" data-dxt-market-briefing-role="questions-to-investigate">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-cyan-100">Questions To Investigate</p>
            <h2 className="mt-6 max-w-4xl text-4xl font-black uppercase leading-tight tracking-normal text-white sm:text-5xl">
              Use the market briefing to decide what needs a closer look.
            </h2>
            <div className="mt-7 grid max-w-3xl gap-3">
              {investigationQuestions.map((question) => (
                <p key={question} className="rounded-[6px] bg-white/[0.035] p-4 text-sm leading-6 text-white/62 ring-1 ring-white/[0.06]">
                  {question}
                </p>
              ))}
            </div>
          </div>

          <div
            className="grid gap-3 rounded-[8px] bg-white/[0.035] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)] ring-1 ring-white/[0.06]"
            data-dxt-market-briefing-role="freshness-uncertainty-professional-boundaries"
          >
            {[
              ['Markets', marketSummaries.length],
              ['Neighborhood paths', marketSummaries.reduce((total, market) => total + market.neighborhoodCount, 0)],
              ['Evidence posture', 'Directional'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between py-3">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40">{label}</p>
                <p className="text-lg font-black uppercase tracking-tight text-white">{value}</p>
              </div>
            ))}
            <p className="pt-4 text-xs leading-6 text-white/42" data-testid="cep-market-measurement-boundary">
              Market context is not a forecast, valuation, ranking, investment recommendation, pricing certainty, suitability conclusion,
              safety conclusion, school-quality conclusion, AI advisory, or provider-fed analysis. Measurement handles are present for
              future review only; no analytics vendor, cookie, tracking system, or new persistence is active.
            </p>
          </div>
        </div>
      </section>

      <section
        className="px-5 py-12 sm:px-8 lg:px-12"
        data-testid="reie-market-buyer-confidence"
        data-buyer-confidence-market-context="true"
        data-buyer-confidence-forecast="false"
        data-buyer-confidence-ai="false"
        data-buyer-confidence-gis="false"
        data-buyer-confidence-provider-activation="false"
      >
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-4">
          {[
            ['Market timing', 'Use direction, pricing, inventory, and competitiveness as context before narrowing to one property.'],
            ['Neighborhood context', 'Open city and neighborhood paths to understand access, evidence, and local verification questions.'],
            ['Affordability assumptions', 'Treat market and price facts as education; verify lending, tax, insurance, HOA, and cost assumptions separately.'],
            ['Next step', 'Return to search, open a property decision brief, or ask a focused question when the context is clear.'],
          ].map(([label, body]) => (
            <article key={label} className="rounded-[8px] bg-white/[0.035] p-5 ring-1 ring-white/[0.07]" data-testid="reie-market-buyer-confidence-step">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/70">{label}</p>
              <p className="mt-3 text-sm leading-6 text-white/58">{body}</p>
            </article>
          ))}
        </div>
        <div className="mx-auto mt-5 max-w-6xl">
          <FinancingConfidenceEducation surface="market" />
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12" data-testid="cep-market-discovery-featured">
        <div className="mx-auto max-w-6xl">
          <section
            className="mb-16 border-y border-white/8 py-12"
            data-testid="decision-guide-discovery-certified"
            data-decision-guide-discovery-status="certified-only"
            data-decision-guide-discovery-certified-count={certifiedDecisionGuides.length}
            data-decision-guide-discovery-foundation-promoted="false"
            data-decision-guide-discovery-ai="false"
            data-decision-guide-discovery-gis="false"
            data-decision-guide-discovery-telemetry="false"
          >
            <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/70">Certified Decision Guides</p>
                <h2 className="mt-4 text-3xl font-black uppercase leading-tight tracking-normal text-white sm:text-4xl">
                  Start where local authority is already reviewed.
                </h2>
                <p className="mt-5 text-sm leading-7 text-white/56">
                  These guides have city-specific editorial review, neighborhood continuity, search paths, market context, and next-step
                  guidance. Foundation market pages remain available below, but they are not presented as completed local-authority guides.
                </p>
                <Link
                  href="/compare"
                  className="mt-6 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100 no-underline transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
                  data-testid="cross-city-comparison-market-entry"
                  {...getJourneyMeasurementAttributes({
                    surface: 'market-index-certified-guides',
                    stage: 'market',
                    action: 'view-market',
                    destination: 'market',
                  })}
                >
                  Compare certified market context
                  <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {certifiedDecisionGuides.map((guide) => (
                  <Link
                    key={guide.routeSlug}
                    href={guide.marketRoute ?? '/market'}
                    className="reie-market-action-link group flex min-h-[260px] flex-col rounded-[8px] bg-white/[0.04] p-5 text-white no-underline shadow-[0_22px_70px_rgba(0,0,0,0.18)] ring-1 ring-cyan-100/10 transition hover:bg-white/[0.065] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
                    data-testid="decision-guide-discovery-certified-card"
                    data-decision-guide-discovery-city={guide.canonicalName}
                    data-decision-guide-discovery-maturity={guide.guideMaturity}
                    data-decision-guide-discovery-public-eligible={String(guide.publicEligibility)}
                    {...getJourneyMeasurementAttributes({
                      surface: 'decision-guide-discovery-certified',
                      stage: 'market',
                      action: 'view-market',
                      destination: 'market',
                    })}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-cyan-100/64">Certified Guide</p>
                        <h3 className="mt-3 text-2xl font-black uppercase tracking-tight text-white">{guide.canonicalName}</h3>
                      </div>
                      <ShieldCheck className="h-5 w-5 text-cyan-100/70 transition group-hover:text-white" aria-hidden="true" />
                    </div>
                    <p className="mt-5 text-sm leading-7 text-white/58">
                      City guide, market context, {guide.neighborhoodCount} neighborhood paths, search continuity, and buyer/seller next
                      steps.
                    </p>
                    <span className="mt-auto pt-8 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100 transition group-hover:text-white">
                      Open guide
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/70">Featured Markets</p>
              <h2 className="mt-3 text-3xl font-black uppercase tracking-normal text-white">Start with the strongest active signals.</h2>
            </div>
            <Link
              href="/search"
              className="reie-inline-link text-[10px] font-black uppercase tracking-[0.16em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
              {...getJourneyMeasurementAttributes({
                surface: 'market-index-featured',
                stage: 'market',
                action: 'start-search',
                destination: 'search',
              })}
            >
              Search With Market Context
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {featuredMarkets.map((market) => (
              <Link
                key={market.city.marketSlug}
                href={`/market/${market.city.marketSlug}`}
                className="reie-market-action-link group rounded-[8px] bg-white/[0.035] p-5 text-white no-underline shadow-[0_18px_55px_rgba(0,0,0,0.16)] transition hover:bg-white/[0.055] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
                data-testid="cep-market-discovery-featured-link"
                data-cep-market-city={market.city.name}
                {...getJourneyMeasurementAttributes({
                  surface: 'market-index-featured-card',
                  stage: 'market',
                  action: 'view-market',
                  destination: 'market',
                })}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/68">Market Report</p>
                    <h3 className="mt-3 text-2xl font-black uppercase tracking-tight text-white">{market.city.name}</h3>
                  </div>
                  <TrendingUp className="h-5 w-5 text-cyan-100/64 transition group-hover:text-white" aria-hidden="true" />
                </div>
                <div className="mt-5 grid gap-2 sm:grid-cols-3">
                  <MarketMetric label="Direction" value={market.direction} />
                  <MarketMetric label="Pricing" value={market.pricing} />
                  <MarketMetric label="Timing" value={market.timing} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12" data-testid="cep-market-discovery-all">
        <div className="mx-auto max-w-6xl">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/36">All Market Paths</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {marketSummaries.map((market) => (
              <Link
                key={market.city.marketSlug}
                href={`/market/${market.city.marketSlug}`}
                className="reie-market-action-link group rounded-[8px] bg-white/[0.03] p-5 text-white no-underline transition hover:bg-[#0a1118] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
                data-testid="cep-market-discovery-city-link"
                data-cep-market-city={market.city.name}
                data-cep-market-neighborhood-count={market.neighborhoodCount}
                {...getJourneyMeasurementAttributes({
                  surface: 'market-index-all-markets',
                  stage: 'market',
                  action: 'view-market',
                  destination: 'market',
                })}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-black uppercase tracking-tight text-white">{market.city.name}</h3>
                  <MapPinned className="h-4 w-4 text-cyan-100/54 transition group-hover:text-white" aria-hidden="true" />
                </div>
                <p className="mt-3 text-xs leading-6 text-white/46">
                  {market.neighborhoodCount || 'Expanding'} neighborhood paths, {market.city.stats.inventory} active inventory signal.
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12" data-testid="cep-market-discovery-continuity" data-dxt-market-briefing-role="compact-continuations">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-5">
          {[
            { label: 'Search', body: 'Use current filters and market links to compare active inventory.', href: '/search', icon: Search },
            { label: 'Property', body: 'Open a listing when public facts deserve closer review.', href: '/search', icon: Home },
            { label: 'Neighborhood', body: 'Open place context before treating evidence as local understanding.', href: '/market/boulder/mapleton-hill', icon: MapPinned },
            { label: 'Seller', body: 'Request a review when timing, preparation, and positioning matter.', href: '/sell', icon: BarChart3 },
            { label: 'Advisory', body: 'Ask which market signal needs professional verification.', href: '/contact', icon: ShieldCheck },
          ].map((step) => (
            <Link
              key={step.label}
              href={step.href}
              className="reie-market-action-link group rounded-[8px] bg-white/[0.03] p-5 text-white no-underline transition hover:bg-white/[0.055] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
              data-testid="cep-market-discovery-continuity-link"
              {...getJourneyMeasurementAttributes({
                surface: 'market-index-continuity',
                stage: 'market',
                action: 'continue-journey',
                destination:
                  step.label === 'Seller'
                    ? 'seller'
                    : step.label === 'Property'
                      ? 'property'
                      : step.label === 'Neighborhood'
                        ? 'market'
                        : step.label === 'Advisory'
                          ? 'inquiry'
                          : 'search',
              })}
            >
              <step.icon className="h-5 w-5 text-cyan-100/64 transition group-hover:text-white" aria-hidden="true" />
              <p className="mt-5 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100/70">{step.label}</p>
              <p className="mt-3 text-sm leading-7 text-white/56">{step.body}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function MarketMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[6px] bg-black/24 p-3">
      <p className="text-[9px] font-black uppercase tracking-[0.14em] text-white/34">{label}</p>
      <p className="mt-2 text-xs font-black uppercase leading-5 text-white/68">{value}</p>
    </div>
  );
}
