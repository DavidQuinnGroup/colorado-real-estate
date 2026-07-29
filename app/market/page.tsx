import type { Metadata } from 'next';
import Link from 'next/link';
import { BarChart3, Home, MapPinned, Search, TrendingUp } from 'lucide-react';

import FinancingConfidenceEducation from '@/components/FinancingConfidenceEducation';
import FAQSchema from '@/components/schema/FAQSchema';
import { cities, type CityData } from '@/lib/cities';
import { getJourneyMeasurementAttributes } from '@/lib/customerJourneyMeasurement';
import { buildMarketDecisionWorkspace } from '@/lib/marketDecisionWorkspace';
import { buildCityMarketExperience } from '@/lib/marketIntelligenceExperience';
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
  return cities.map((city) => {
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

export default function MarketIndexPage() {
  const marketSummaries = buildCitySummaries();
  const featuredMarkets = getFeaturedMarkets(marketSummaries);
  const primaryMarket = featuredMarkets[0] || marketSummaries[0];
  const marketDecisionWorkspace = buildMarketDecisionWorkspace({
    scope: 'state',
    name: 'Colorado',
    marketSignal: primaryMarket?.direction || 'Mixed local conditions',
    competitivenessSignal: primaryMarket?.timing || 'Preparation matters',
    timingSignal: 'Compare markets before choosing a property path',
    pricingSignal: primaryMarket?.pricing,
    inventorySignal: `${marketSummaries.length} city market paths and ${marketSummaries.reduce((total, market) => total + market.neighborhoodCount, 0)} neighborhood paths`,
    neighborhoodCount: marketSummaries.reduce((total, market) => total + market.neighborhoodCount, 0),
    searchHref: '/search',
    marketHref: '/market',
    sellerHref: '/sell',
  });

  return (
    <main
      className="min-h-screen bg-[#030303] text-white"
      data-testid="cep-market-discovery-page"
      data-cep-market-count={marketSummaries.length}
      data-cep-measurement-ready="true"
      data-cep-measurement-active="false"
    >
      <FAQSchema faqs={marketFaqs} pageUrl={MARKET_URL} />

      <section
        className="border-b border-white/10 px-5 py-12 sm:px-8 lg:px-12"
        data-testid="reie-market-v8-decision-workspace"
        data-market-v8-scope="state"
        data-market-v8-item-count={marketDecisionWorkspace.items.length}
        data-market-v8-ai="false"
        data-market-v8-forecasting="false"
        data-market-v8-gis="false"
        data-market-v8-telemetry="false"
      >
        <div className="mx-auto max-w-6xl">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/76">Market Decision Workspace</p>
          <div className="mt-4 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-white md:text-4xl">
                {marketDecisionWorkspace.headline}
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/58">{marketDecisionWorkspace.orientation}</p>
              <p className="mt-4 rounded-[6px] border border-cyan-100/14 bg-cyan-100/[0.055] p-3 text-xs leading-5 text-white/48">
                {marketDecisionWorkspace.trustBoundary}
              </p>
            </div>

            <div className="grid gap-px overflow-hidden rounded-[8px] border border-white/10 bg-white/10 sm:grid-cols-2">
              {marketDecisionWorkspace.items.map((item) => (
                <Link
                  key={item.lens}
                  href={item.href}
                  className="group flex min-w-0 flex-col bg-[#030303] p-4 transition hover:bg-[#0a1118]"
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

      <section className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-cyan-100">Colorado Market Intelligence</p>
            <h1 className="mt-6 max-w-4xl text-5xl font-black uppercase italic leading-[0.95] tracking-tight text-white sm:text-6xl">
              Choose the market context before the next property decision.
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-white/62 sm:text-lg">
              Move from search into city market reports, neighborhood context, property review, or seller strategy without changing the
              certified search, property, inquiry, or valuation behavior.
            </p>
            <div className="mt-10 flex flex-wrap gap-3" data-testid="cep-market-discovery-primary-actions">
              <Link
                href="/search"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[6px] bg-cyan-100 px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#061017] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
                {...getJourneyMeasurementAttributes({
                  surface: 'market-index-primary-actions',
                  stage: 'market',
                  action: 'start-search',
                  destination: 'search',
                })}
              >
                <Search size={15} aria-hidden="true" />
                Start Search
              </Link>
              <Link
                href="/sell"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[6px] border border-white/14 px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-white/72 transition hover:border-cyan-100/40 hover:text-cyan-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
                {...getJourneyMeasurementAttributes({
                  surface: 'market-index-primary-actions',
                  stage: 'market',
                  action: 'request-seller-review',
                  destination: 'seller',
                })}
              >
                <Home size={15} aria-hidden="true" />
                Seller Review
              </Link>
            </div>
          </div>

          <div className="grid gap-3 rounded-[8px] bg-white/[0.035] p-5 ring-1 ring-white/[0.06]">
            {[
              ['Markets', marketSummaries.length],
              ['Neighborhood paths', marketSummaries.reduce((total, market) => total + market.neighborhoodCount, 0)],
              ['Measurement', 'Prepared'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between border-b border-white/10 py-3 last:border-b-0">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/40">{label}</p>
                <p className="text-lg font-black uppercase tracking-tight text-white">{value}</p>
              </div>
            ))}
            <p className="border-t border-white/10 pt-4 text-xs leading-6 text-white/42" data-testid="cep-market-measurement-boundary">
              Measurement handles are present for future review. No analytics vendor, cookie, tracking system, or new persistence is active.
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
            ['Neighborhood fit', 'Open city and neighborhood paths to understand lifestyle, resilience, access, and local tradeoffs.'],
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
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/70">Featured Markets</p>
              <h2 className="mt-3 text-3xl font-black uppercase italic tracking-tight text-white">Start with the strongest active signals.</h2>
            </div>
            <Link
              href="/search"
              className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100/74 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
              {...getJourneyMeasurementAttributes({
                surface: 'market-index-featured',
                stage: 'market',
                action: 'start-search',
                destination: 'search',
              })}
            >
              Search All Colorado Homes
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {featuredMarkets.map((market) => (
              <Link
                key={market.city.marketSlug}
                href={`/market/${market.city.marketSlug}`}
                className="group bg-white/[0.03] p-5 ring-1 ring-white/[0.06] transition hover:bg-white/[0.055] hover:ring-cyan-100/28 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
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
                    <h3 className="mt-3 text-2xl font-black uppercase italic tracking-tight text-white">{market.city.name}</h3>
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
          <div className="mt-6 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {marketSummaries.map((market) => (
              <Link
                key={market.city.marketSlug}
                href={`/market/${market.city.marketSlug}`}
                className="group bg-[#030303] p-5 transition hover:bg-[#0a1118] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-cyan-200"
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
                  <h3 className="text-lg font-black uppercase italic tracking-tight text-white">{market.city.name}</h3>
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

      <section className="px-5 py-16 sm:px-8 lg:px-12" data-testid="cep-market-discovery-continuity">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          {[
            { label: 'Search', body: 'Use current filters and market links to compare active inventory.', href: '/search', icon: Search },
            { label: 'Property', body: 'Open a listing when public facts deserve closer review.', href: '/search', icon: Home },
            { label: 'Seller', body: 'Request a review when timing, preparation, and positioning matter.', href: '/sell', icon: BarChart3 },
          ].map((step) => (
            <Link
              key={step.label}
              href={step.href}
              className="group bg-white/[0.03] p-5 ring-1 ring-white/[0.06] transition hover:bg-white/[0.055] hover:ring-cyan-100/28 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
              data-testid="cep-market-discovery-continuity-link"
              {...getJourneyMeasurementAttributes({
                surface: 'market-index-continuity',
                stage: 'market',
                action: 'continue-journey',
                destination: step.label === 'Seller' ? 'seller' : step.label === 'Property' ? 'property' : 'search',
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
    <div className="bg-black/24 p-3 ring-1 ring-white/[0.06]">
      <p className="text-[9px] font-black uppercase tracking-[0.14em] text-white/34">{label}</p>
      <p className="mt-2 text-xs font-black uppercase leading-5 text-white/68">{value}</p>
    </div>
  );
}
