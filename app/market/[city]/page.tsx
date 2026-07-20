import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Lock, MapPinned, ShieldCheck, Zap } from 'lucide-react';

import CityMarketStats from '@/components/CityMarketStats';
import LeadCapture from '@/components/LeadCapture';
import MarketHomesLinks from '@/components/MarketHomesLinks';
import MarketNeighborhoodLinks from '@/components/MarketNeighborhoodLinks';
import ResilienceDashboard from '@/components/ResilienceDashboard';
import RelatedArticles from '@/components/RelatedArticles';
import FAQSchema from '@/components/schema/FAQSchema';
import { cities, getCityByMarketSlug, type CityData } from '@/lib/cities';
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
  averageResilienceScore: number;
  highestResilienceNeighborhood?: Neighborhood;
  highestEfficiencyNeighborhood?: Neighborhood;
};

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
    .sort((a, b) => b.resilienceScore - a.resilienceScore || a.name.localeCompare(b.name));
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
  return `David Quinn Group's ${city.name}, Colorado housing market intelligence report combines local real estate data, construction forensics, neighborhood resilience, and lifestyle efficiency strategy.`;
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
  const averageResilienceScore = neighborhoodCount
    ? Math.round(cityNeighborhoods.reduce((sum, neighborhood) => sum + neighborhood.resilienceScore, 0) / neighborhoodCount)
    : 0;
  const highestEfficiencyNeighborhood = [...cityNeighborhoods].sort(
    (a, b) => b.avgEfficiencyScore - a.avgEfficiencyScore || a.name.localeCompare(b.name),
  )[0];

  return {
    neighborhoodCount,
    averageResilienceScore,
    highestResilienceNeighborhood: cityNeighborhoods[0],
    highestEfficiencyNeighborhood,
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
    .filter((city) => city.marketSlug)
    .map((city) => ({
      city: city.marketSlug,
    }));
}

export async function generateMetadata({ params }: MarketPageProps): Promise<Metadata> {
  const { city } = await params;
  const cityData = getCityData(city);

  if (!cityData) {
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

  if (!cityData) return notFound();

  const cityNeighborhoods = getCityNeighborhoods(cityData);
  const featuredNeighborhood = cityNeighborhoods[0];
  const authoritySignals = getAuthoritySignals(cityNeighborhoods);
  const cityFaqs = getCityFaqs(cityData);
  const canonicalUrl = getCanonicalUrl(cityData);
  const cityMarketSchema = getJsonLd(cityData, cityNeighborhoods);
  const cityMarketSchemaGraph = cityMarketSchema['@graph'];
  const transitionStats = {
    ...cityData.stats,
    medianPrice: parseCurrency(cityData.stats.medianPrice),
  };

  return (
    <main className="min-h-screen bg-[#030303] text-white">
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
        data-city-market-schema-health-score={cityData.stats.marketHealthScore}
        data-city-market-schema-avg-efficiency={cityData.stats.avgEfficiency}
        data-city-market-schema-graph-count={cityMarketSchemaGraph.length}
        data-city-market-schema-has-breadcrumb="true"
        data-city-market-schema-has-neighborhoods={cityNeighborhoods.length > 0 ? "true" : "false"}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(cityMarketSchema),
        }}
      />
      <FAQSchema faqs={cityFaqs} pageUrl={canonicalUrl} />

      <section className="border-b border-white/5">
        <div className="mx-auto max-w-6xl px-6 pb-12 pt-16 md:pt-20">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-[#00ff80] shadow-[0_0_18px_rgba(0,255,128,0.65)]" />
            <span className="text-[10px] font-black italic uppercase tracking-[0.5em] text-[#00ff80]">
              Colorado Market Intelligence
            </span>
          </div>

          <h1 className="mb-8 max-w-5xl text-5xl font-black italic uppercase leading-[0.88] tracking-tight md:text-7xl">
            {cityData.name}
            <br />
            <span className="text-white/20">Strategy Report</span>
          </h1>

          <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
            <p className="max-w-2xl text-base italic leading-relaxed text-white/60 md:text-lg">
              David Quinn Group evaluates the {cityData.name}, Colorado market through public MLS signals, construction condition,
              neighborhood resilience, and lifestyle efficiency. The current market health score is{' '}
              <span className="font-black text-white">{cityData.stats.marketHealthScore}%</span>, with an average efficiency index of{' '}
              <span className="font-black text-white">{cityData.stats.avgEfficiency}%</span>.
            </p>

            <div className="grid grid-cols-2 border border-white/10 bg-white/[0.02]">
              <div className="border-r border-white/10 p-5">
                <p className="mb-2 text-[9px] font-black uppercase tracking-[0.3em] text-white/30">Median Price</p>
                <p className="text-2xl font-black italic">{cityData.stats.medianPrice}</p>
              </div>
              <div className="p-5">
                <p className="mb-2 text-[9px] font-black uppercase tracking-[0.3em] text-white/30">Inventory</p>
                <p className="text-2xl font-black italic">{cityData.stats.inventory}</p>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="border border-white/10 bg-white/[0.02] p-5">
              <p className="mb-2 text-[9px] font-black uppercase tracking-[0.3em] text-white/30">Neighborhood Hubs</p>
              <p className="text-2xl font-black italic">{authoritySignals.neighborhoodCount}</p>
            </div>
            <div className="border border-white/10 bg-white/[0.02] p-5">
              <p className="mb-2 text-[9px] font-black uppercase tracking-[0.3em] text-white/30">Avg Resilience</p>
              <p className="text-2xl font-black italic">{authoritySignals.averageResilienceScore}/100</p>
            </div>
            <div className="border border-white/10 bg-white/[0.02] p-5">
              <p className="mb-2 text-[9px] font-black uppercase tracking-[0.3em] text-white/30">Top Efficiency</p>
              <p className="text-2xl font-black italic">{authoritySignals.highestEfficiencyNeighborhood?.name || 'Expanding'}</p>
            </div>
          </div>
          <p
            className="mt-6 max-w-3xl text-xs leading-6 text-white/42"
            data-testid="market-source-disclaimer"
            data-market-sales-source-control="present"
            data-market-non-participation-disclaimer="present"
          >
            Market statistics are market-wide REIE context from repository city data and public MLS/search signals where available. They do
            not state or imply that David Quinn, David Quinn Group, or Compass listed, sold, or participated in every reported property.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-20 px-6 pb-24">
        <section>
          <CityMarketStats stats={transitionStats} />
        </section>

        <section className="relative">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.35em] text-white/30">Neighborhood Authority Layer</p>
              <h2 className="text-2xl font-black italic uppercase tracking-tight">Resilience Hubs</h2>
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
              Neighborhood resilience profiles are being expanded for {cityData.name}.
            </div>
          )}

          <div className="absolute inset-0 z-10 flex items-center justify-center border border-white/5 bg-black/20 p-6 backdrop-blur-sm">
            <div className="max-w-md border border-white/10 bg-[#030303] p-8 text-center shadow-2xl md:p-10">
              <Lock className="mx-auto mb-6 text-[#fbbf24]" size={48} />
              <h3 className="mb-4 text-xl font-black italic uppercase tracking-tight text-white">Unlock the Expert 60%</h3>
              <p className="mb-8 text-xs uppercase leading-relaxed tracking-widest text-white/50">
                Structural forensics, tactical negotiation levers, and private exclusive access are reserved for DQG contracted clients.
              </p>
              <button className="w-full bg-[#00ff80] py-4 text-xs font-black italic uppercase tracking-[0.3em] text-black transition-all hover:bg-white">
                Access Full Strategy Brief
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
                  className="group block border-l border-white/10 py-2 pl-6 transition-colors hover:border-[#00ff80]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h4 className="text-lg font-bold text-white transition-colors group-hover:text-[#00ff80]">{neighborhood.name}</h4>
                    <span className="shrink-0 text-[10px] font-black italic text-white/30">{neighborhood.resilienceScore}/100</span>
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
              <h3 className="mb-2 text-xl font-black italic uppercase tracking-tight text-white">Efficiency Index</h3>
              <p className="text-xs uppercase leading-relaxed tracking-widest text-white/40">
                Average life ROI for {cityData.name} residents currently stands at
                <span className="text-white"> {cityData.stats.avgEfficiency}%</span>. The current high-efficiency hub is{' '}
                <span className="text-white">{authoritySignals.highestEfficiencyNeighborhood?.name || cityData.name}</span>.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <ShieldCheck className="text-white/20" size={20} />
              <p className="text-[9px] font-bold uppercase italic leading-tight tracking-[0.2em] text-white/20">
                Draft construction-context signal pending owner and brokerage review.
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
          title={`${cityData.name} REIE Strategy Briefs`}
        />

        <section className="border-y border-white/10 py-12">
          <div className="mb-8 max-w-3xl">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.35em] text-[#00ff80]">REIE FAQ Layer</p>
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
