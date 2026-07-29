import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight, Compass, HelpCircle, Home, Lock, MapPinned, Search, ShieldCheck, Zap } from 'lucide-react';

import CityMarketStats from '@/components/CityMarketStats';
import FinancingConfidenceEducation from '@/components/FinancingConfidenceEducation';
import LeadCapture from '@/components/LeadCapture';
import MarketHomesLinks from '@/components/MarketHomesLinks';
import MarketNeighborhoodLinks from '@/components/MarketNeighborhoodLinks';
import ResilienceDashboard from '@/components/ResilienceDashboard';
import RelatedArticles from '@/components/RelatedArticles';
import FAQSchema from '@/components/schema/FAQSchema';
import { cities, getCityByMarketSlug, type CityData } from '@/lib/cities';
import { getJourneyMeasurementAttributes } from '@/lib/customerJourneyMeasurement';
import { buildMarketDecisionWorkspace } from '@/lib/marketDecisionWorkspace';
import { buildCityMarketExperience } from '@/lib/marketIntelligenceExperience';
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

type CityDecisionGuide = {
  key: 'boulder' | 'louisville' | 'lafayette';
  cityName: string;
  identity: string;
  summaryEyebrow: string;
  summaryHeadline: string;
  summaryIntro: string;
  neighborhoodsEyebrow: string;
  neighborhoodsHeadline: string;
  neighborhoodSectionId: string;
  continuitySurface: string;
  decisionSummary: Array<{
    label: string;
    value: string;
    explanation: string;
  }>;
  housingContext: Array<{
    label: string;
    explanation: string;
  }>;
  practicalContext: Array<{
    label: string;
    explanation: string;
  }>;
  tradeoffs: Array<{
    strength: string;
    tradeoff: string;
  }>;
  verificationQuestions: string[];
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

function getDecisionGuideKey(city: CityData): CityDecisionGuide['key'] | null {
  if (city.name === 'Boulder') return 'boulder';
  if (city.name === 'Louisville') return 'louisville';
  if (city.name === 'Lafayette') return 'lafayette';
  return null;
}

function buildCityDecisionGuide({
  city,
  cityNeighborhoods,
  marketSignal,
}: {
  city: CityData;
  cityNeighborhoods: Neighborhood[];
  marketSignal: string;
}): CityDecisionGuide | null {
  const guideKey = getDecisionGuideKey(city);
  if (!guideKey) return null;

  const anchors = cityNeighborhoods
    .slice(0, 4)
    .map((neighborhood) => neighborhood.primaryAnchor)
    .join(', ');
  const housingEras = Array.from(new Set(cityNeighborhoods.map((neighborhood) => neighborhood.era))).slice(0, 3);

  if (guideKey === 'lafayette') {
    return {
      key: guideKey,
      cityName: city.name,
      identity: `${city.name} should be evaluated as an east Boulder County decision market: neighborhood pattern, housing condition, local access, and market signal should be reviewed together before a customer narrows into individual homes.`,
      summaryEyebrow: 'Lafayette Decision Summary',
      summaryHeadline: 'Decide what Lafayette means before comparing homes.',
      summaryIntro:
        'Start with Lafayette as a city decision, then use neighborhood pages, property facts, market evidence, financing preparation, and advisor questions as separate confirmation layers.',
      neighborhoodsEyebrow: 'Explore Lafayette Neighborhoods',
      neighborhoodsHeadline: 'Move from city question to local context.',
      neighborhoodSectionId: 'lafayette-neighborhoods',
      continuitySurface: 'lafayette-decision-guide-continuity',
      decisionSummary: [
        {
          label: 'What distinguishes Lafayette',
          value: 'An east Boulder County city with established neighborhoods and practical Front Range access',
          explanation: `${cityNeighborhoods.length} governed neighborhood paths connect city context to local anchors including ${anchors}.`,
        },
        {
          label: 'What deserves attention',
          value: 'Price, inventory, neighborhood pattern, condition, and daily access',
          explanation: `Current market context shows ${city.stats.medianPrice} median price, ${city.stats.inventory} active inventory signal, and ${marketSignal.toLowerCase()} as the current city-market interpretation.`,
        },
        {
          label: 'What to verify',
          value: 'Property facts, records, costs, financing readiness, and neighborhood evidence',
          explanation:
            'Use Lafayette context as a starting point, then verify individual property facts, costs, disclosures, records, and daily-life assumptions before acting.',
        },
      ],
      housingContext: [
        {
          label: 'Varied neighborhood patterns',
          explanation: `Lafayette neighborhood records include ${housingEras.join(', ') || 'varied residential'} housing patterns. Compare remodel quality, systems age, drainage, roof condition, and exterior maintenance before relying on surface presentation.`,
        },
        {
          label: 'City identity with local variation',
          explanation:
            "Indian Peaks, Waneka Lake, Old Town Lafayette, and Anna's Farm should be evaluated separately instead of treated as one uniform market.",
        },
        {
          label: 'Condition before assumptions',
          explanation:
            'Property age, remodel history, lot context, exterior exposure, and maintenance records can change the diligence questions that matter for a specific Lafayette home.',
        },
      ],
      practicalContext: [
        {
          label: 'Access relationships',
          explanation:
            'Evaluate the relationship between the property, work patterns, Old Town Lafayette, Waneka Lake, open-space access, Boulder County connections, and the routes used most often.',
        },
        {
          label: 'Neighborhood specificity',
          explanation:
            'A Lafayette address is not enough. The decision changes when the property sits near Old Town activity, lake or open-space edges, golf-course adjacency, or quieter residential interiors.',
        },
        {
          label: 'Research discipline',
          explanation:
            'Use market context, neighborhood pages, property records, disclosures, inspection review, insurance questions, financing preparation, and advisor discussion as separate evidence layers.',
        },
      ],
      tradeoffs: [
        {
          strength: 'Recognizable east Boulder County identity with multiple neighborhood patterns',
          tradeoff: 'Customers should compare micro-location, property condition, and daily route needs instead of assuming city-wide fit.',
        },
        {
          strength: 'Established neighborhoods with different housing forms',
          tradeoff: 'Older systems, remodel quality, drainage, exterior-envelope condition, and records review can materially affect confidence.',
        },
        {
          strength: 'Clear continuity from city market to neighborhood and property review',
          tradeoff: 'Market statistics should inform the decision, not replace property-specific verification or financing preparation.',
        },
      ],
      verificationQuestions: [
        'Which Lafayette neighborhood pattern best matches the way I would use the city day to day?',
        'What property-specific condition, records, insurance, cost, or financing-readiness questions should be answered before I compare this home against alternatives?',
        'Does the current market signal change my search discipline or seller-preparation plan without creating urgency?',
        'Which neighborhood page, market evidence, property facts, financing preparation items, and advisor questions should I review before the next step?',
      ],
    };
  }

  if (guideKey === 'louisville') {
    return {
      key: guideKey,
      cityName: city.name,
      identity: `${city.name} should be evaluated as a Boulder County decision market: neighborhood pattern, small-city access, property condition, and market signal should be reviewed together before a customer narrows into individual homes.`,
      summaryEyebrow: 'Louisville Decision Summary',
      summaryHeadline: 'Decide what Louisville means before comparing homes.',
      summaryIntro:
        'Start with Louisville as a city decision, then use neighborhood pages, property facts, market evidence, financing preparation, and advisor questions as separate confirmation layers.',
      neighborhoodsEyebrow: 'Explore Louisville Neighborhoods',
      neighborhoodsHeadline: 'Move from city question to local context.',
      neighborhoodSectionId: 'louisville-neighborhoods',
      continuitySurface: 'louisville-decision-guide-continuity',
      decisionSummary: [
        {
          label: 'What distinguishes Louisville',
          value: 'A Boulder County city with established neighborhoods and practical access choices',
          explanation: `${cityNeighborhoods.length} governed neighborhood paths connect city context to local anchors including ${anchors}.`,
        },
        {
          label: 'What deserves attention',
          value: 'Price, inventory, neighborhood fit, condition, and daily access',
          explanation: `Current market context shows ${city.stats.medianPrice} median price, ${city.stats.inventory} active inventory signal, and ${marketSignal.toLowerCase()} as the current city-market interpretation.`,
        },
        {
          label: 'What to verify',
          value: 'Property facts, records, costs, financing readiness, and neighborhood evidence',
          explanation:
            'Use Louisville context as a starting point, then verify individual property facts, costs, disclosures, records, and daily-life assumptions before acting.',
        },
      ],
      housingContext: [
        {
          label: 'Established neighborhood patterns',
          explanation: `Louisville neighborhood records include ${housingEras.join(', ') || 'established residential'} housing patterns. Compare remodel quality, systems age, drainage, roof condition, and exterior maintenance before relying on surface presentation.`,
        },
        {
          label: 'City identity with neighborhood variation',
          explanation:
            'Old Town Louisville, Coal Creek Ranch, Centennial Valley, North End, and Steel Ranch should be evaluated separately instead of treated as one uniform market.',
        },
        {
          label: 'Condition before assumptions',
          explanation:
            'Property age, remodel history, exterior exposure, lot context, and maintenance records can change the diligence questions that matter for a specific Louisville home.',
        },
      ],
      practicalContext: [
        {
          label: 'Access relationships',
          explanation:
            'Evaluate the relationship between the property, work patterns, downtown Louisville, open-space access, Boulder County connections, and the routes used most often.',
        },
        {
          label: 'Neighborhood specificity',
          explanation:
            'A Louisville address is not enough. The decision changes when the property sits near Old Town activity, open-space edges, golf-course adjacency, newer infill, or quieter residential interiors.',
        },
        {
          label: 'Research discipline',
          explanation:
            'Use market context, neighborhood pages, property records, disclosures, inspection review, insurance questions, financing preparation, and advisor discussion as separate evidence layers.',
        },
      ],
      tradeoffs: [
        {
          strength: 'Recognizable small-city identity with Boulder County access',
          tradeoff: 'Customers should compare micro-location, property condition, and daily route needs instead of assuming city-wide fit.',
        },
        {
          strength: 'Established neighborhoods with different housing patterns',
          tradeoff: 'Older systems, remodel quality, drainage, exterior-envelope condition, and records review can materially affect confidence.',
        },
        {
          strength: 'Clear continuity from city market to neighborhood and property review',
          tradeoff: 'Market statistics should inform the decision, not replace property-specific verification or financing preparation.',
        },
      ],
      verificationQuestions: [
        'Which Louisville neighborhood pattern best matches the way I would use the city day to day?',
        'What property-specific condition, records, insurance, cost, or financing-readiness questions should be answered before I compare this home against alternatives?',
        'Does the current market signal change my search discipline or seller-preparation plan without creating urgency?',
        'Which neighborhood page, market evidence, property facts, financing preparation items, and advisor questions should I review before the next step?',
      ],
    };
  }

  return {
    key: guideKey,
    cityName: city.name,
    identity: `${city.name} should be evaluated as a high-context Colorado market: daily access, neighborhood pattern, housing condition, and market signal all matter before a customer narrows into individual homes.`,
    summaryEyebrow: 'Boulder Decision Summary',
    summaryHeadline: 'Decide what Boulder means before comparing homes.',
    summaryIntro:
      'Start with the city pattern, then use neighborhood pages, property facts, market evidence, and advisor questions as separate confirmation layers.',
    neighborhoodsEyebrow: 'Explore Boulder Neighborhoods',
    neighborhoodsHeadline: 'Move from city question to local context.',
    neighborhoodSectionId: 'boulder-neighborhoods',
    continuitySurface: 'boulder-decision-guide-continuity',
    decisionSummary: [
      {
        label: 'What distinguishes Boulder',
        value: 'A compact Front Range city with multiple neighborhood patterns',
        explanation: `${cityNeighborhoods.length} governed neighborhood paths connect city context to local anchors including ${anchors}.`,
      },
      {
        label: 'What deserves attention',
        value: 'Price, inventory, condition, access, and property-specific diligence',
        explanation: `Current market context shows ${city.stats.medianPrice} median price, ${city.stats.inventory} active inventory signal, and ${marketSignal.toLowerCase()} as the current city-market interpretation.`,
      },
      {
        label: 'What to verify',
        value: 'Fit, records, condition, commute pattern, and neighborhood evidence',
        explanation: 'Use Boulder context as a starting point, then verify individual property facts, costs, records, and daily-life assumptions before acting.',
      },
    ],
    housingContext: [
      {
        label: 'Mixed housing eras',
        explanation: `Boulder neighborhood records include ${housingEras.join(', ') || 'mixed-era residential'} housing patterns. Compare remodel quality, systems age, drainage, roof condition, and exterior maintenance before relying on surface presentation.`,
      },
      {
        label: 'Neighborhood-by-neighborhood variation',
        explanation: 'Downtown, North Boulder, South Boulder, Gunbarrel, Table Mesa, Mapleton Hill, Chautauqua, and Wonderland Hills should be evaluated separately instead of treated as one uniform market.',
      },
      {
        label: 'Condition before assumptions',
        explanation: 'Older homes, hillside settings, mature landscaping, and remodel history can change the diligence questions that matter for a specific property.',
      },
    ],
    practicalContext: [
      {
        label: 'Access relationships',
        explanation: 'Evaluate the relationship between the property, work patterns, neighborhood anchors, trail or open-space access, and the parts of Boulder used most often.',
      },
      {
        label: 'Location specificity',
        explanation: 'A Boulder address is not enough. The decision changes when the property sits near downtown activity, foothill edges, north/south corridors, or more residential neighborhood interiors.',
      },
      {
        label: 'Research discipline',
        explanation: 'Use market context, neighborhood pages, property records, disclosures, inspections, insurance review, and advisor discussion as separate evidence layers.',
      },
    ],
    tradeoffs: [
      {
        strength: 'Strong local identity and neighborhood variety',
        tradeoff: 'Customers should compare micro-location, property condition, and access needs instead of assuming city-wide fit.',
      },
      {
        strength: 'Established housing stock with distinctive character',
        tradeoff: 'Older systems, remodel quality, drainage, roof, sewer, and exterior-envelope questions can materially affect confidence.',
      },
      {
        strength: 'Clear continuity from city market to neighborhood and property review',
        tradeoff: 'Market statistics should inform the decision, not replace property-specific verification.',
      },
    ],
    verificationQuestions: [
      'Which Boulder neighborhood pattern best matches the way I would use the city day to day?',
      'What property-specific condition, records, insurance, or cost questions should be answered before I compare this home against alternatives?',
      'Does the current market signal change my timing, search discipline, or seller-preparation plan without creating urgency?',
      'Which neighborhood page, market evidence, property facts, and advisor questions should I review before the next step?',
    ],
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
  const marketExperience = buildCityMarketExperience(cityData, cityNeighborhoods.length);
  const cityDecisionGuide = buildCityDecisionGuide({
    city: cityData,
    cityNeighborhoods,
    marketSignal: marketExperience.directionLabel,
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
    resilienceSignal: `${authoritySignals.neighborhoodCount} neighborhood hubs and ${authoritySignals.averageResilienceScore}/100 average resilience`,
    searchHref: `/search?city=${encodeURIComponent(cityData.name)}`,
    marketHref: getCanonicalPath(cityData),
    sellerHref: '/sell',
  });
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

      <section
        className="border-b border-white/5 bg-[radial-gradient(circle_at_82%_14%,rgba(207,250,254,0.12),transparent_30%),linear-gradient(180deg,#071017,#030303)]"
        data-testid={cityDecisionGuide ? `${cityDecisionGuide.key}-decision-guide-hero` : undefined}
        data-city-decision-guide={cityDecisionGuide ? 'true' : undefined}
        data-city-decision-guide-key={cityDecisionGuide?.key}
        data-city-decision-guide-ai={cityDecisionGuide ? 'false' : undefined}
        data-city-decision-guide-gis={cityDecisionGuide ? 'false' : undefined}
        data-city-decision-guide-telemetry={cityDecisionGuide ? 'false' : undefined}
        data-city-decision-guide-ranking={cityDecisionGuide ? 'false' : undefined}
        data-city-decision-guide-demographic-targeting={cityDecisionGuide ? 'false' : undefined}
        data-boulder-decision-guide={cityDecisionGuide?.key === 'boulder' ? 'true' : undefined}
        data-boulder-decision-guide-ai={cityDecisionGuide?.key === 'boulder' ? 'false' : undefined}
        data-boulder-decision-guide-gis={cityDecisionGuide?.key === 'boulder' ? 'false' : undefined}
        data-boulder-decision-guide-telemetry={cityDecisionGuide?.key === 'boulder' ? 'false' : undefined}
        data-boulder-decision-guide-ranking={cityDecisionGuide?.key === 'boulder' ? 'false' : undefined}
        data-boulder-decision-guide-demographic-targeting={cityDecisionGuide?.key === 'boulder' ? 'false' : undefined}
        data-louisville-decision-guide={cityDecisionGuide?.key === 'louisville' ? 'true' : undefined}
        data-louisville-decision-guide-ai={cityDecisionGuide?.key === 'louisville' ? 'false' : undefined}
        data-louisville-decision-guide-gis={cityDecisionGuide?.key === 'louisville' ? 'false' : undefined}
        data-louisville-decision-guide-telemetry={cityDecisionGuide?.key === 'louisville' ? 'false' : undefined}
        data-louisville-decision-guide-ranking={cityDecisionGuide?.key === 'louisville' ? 'false' : undefined}
        data-louisville-decision-guide-demographic-targeting={cityDecisionGuide?.key === 'louisville' ? 'false' : undefined}
        data-lafayette-decision-guide={cityDecisionGuide?.key === 'lafayette' ? 'true' : undefined}
        data-lafayette-decision-guide-ai={cityDecisionGuide?.key === 'lafayette' ? 'false' : undefined}
        data-lafayette-decision-guide-gis={cityDecisionGuide?.key === 'lafayette' ? 'false' : undefined}
        data-lafayette-decision-guide-telemetry={cityDecisionGuide?.key === 'lafayette' ? 'false' : undefined}
        data-lafayette-decision-guide-ranking={cityDecisionGuide?.key === 'lafayette' ? 'false' : undefined}
        data-lafayette-decision-guide-demographic-targeting={cityDecisionGuide?.key === 'lafayette' ? 'false' : undefined}
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
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-[6px] bg-cyan-100 px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-black no-underline transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100/70"
                data-testid={`${cityDecisionGuide.key}-decision-guide-search-cta`}
                {...getJourneyMeasurementAttributes({
                  surface: `${cityDecisionGuide.key}-decision-guide-hero`,
                  stage: 'market',
                  action: 'start-search',
                  destination: 'search',
                })}
              >
                <Search className="h-4 w-4" />
                Search {cityDecisionGuide.cityName} Homes
              </Link>
              <Link
                href={`#${cityDecisionGuide.neighborhoodSectionId}`}
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-[6px] bg-white/[0.07] px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-white no-underline transition hover:bg-white/12 focus:outline-none focus:ring-2 focus:ring-cyan-100/70"
                data-testid={`${cityDecisionGuide.key}-decision-guide-neighborhoods-cta`}
              >
                <MapPinned className="h-4 w-4" />
                Explore {cityDecisionGuide.cityName} Neighborhoods
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
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-6 pb-24 pt-10">
        {cityDecisionGuide ? (
          <>
            <section
              className="grid gap-6 py-4 lg:grid-cols-[0.82fr_1.18fr]"
              data-testid={`${cityDecisionGuide.key}-decision-guide-summary`}
              data-city-decision-guide-framework="context-tradeoffs-questions-evidence-next-step"
              data-city-decision-guide-source="governed-city-and-neighborhood-data"
              data-city-decision-guide-school-ranking="false"
              data-city-decision-guide-safety-ranking="false"
              data-city-decision-guide-investment-recommendation="false"
              data-boulder-decision-guide-framework={cityDecisionGuide.key === 'boulder' ? 'context-tradeoffs-questions-evidence-next-step' : undefined}
              data-boulder-decision-guide-source={cityDecisionGuide.key === 'boulder' ? 'governed-city-and-neighborhood-data' : undefined}
              data-boulder-decision-guide-school-ranking={cityDecisionGuide.key === 'boulder' ? 'false' : undefined}
              data-boulder-decision-guide-safety-ranking={cityDecisionGuide.key === 'boulder' ? 'false' : undefined}
              data-boulder-decision-guide-investment-recommendation={cityDecisionGuide.key === 'boulder' ? 'false' : undefined}
              data-louisville-decision-guide-framework={cityDecisionGuide.key === 'louisville' ? 'context-tradeoffs-questions-evidence-next-step' : undefined}
              data-louisville-decision-guide-source={cityDecisionGuide.key === 'louisville' ? 'governed-city-and-neighborhood-data' : undefined}
              data-louisville-decision-guide-school-ranking={cityDecisionGuide.key === 'louisville' ? 'false' : undefined}
              data-louisville-decision-guide-safety-ranking={cityDecisionGuide.key === 'louisville' ? 'false' : undefined}
              data-louisville-decision-guide-investment-recommendation={cityDecisionGuide.key === 'louisville' ? 'false' : undefined}
              data-lafayette-decision-guide-framework={cityDecisionGuide.key === 'lafayette' ? 'context-tradeoffs-questions-evidence-next-step' : undefined}
              data-lafayette-decision-guide-source={cityDecisionGuide.key === 'lafayette' ? 'governed-city-and-neighborhood-data' : undefined}
              data-lafayette-decision-guide-school-ranking={cityDecisionGuide.key === 'lafayette' ? 'false' : undefined}
              data-lafayette-decision-guide-safety-ranking={cityDecisionGuide.key === 'lafayette' ? 'false' : undefined}
              data-lafayette-decision-guide-investment-recommendation={cityDecisionGuide.key === 'lafayette' ? 'false' : undefined}
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
              {[
                ['Context', `Understand ${cityDecisionGuide.cityName} as a city and a set of neighborhood patterns.`],
                ['Trade-offs', 'Balance access, housing form, condition, and market signal.'],
                ['Questions', 'Turn interest into specific facts to verify.'],
                ['Evidence', 'Use market, neighborhood, property, and advisor evidence separately.'],
                ['Next Step', 'Move into search, neighborhood review, buyer, seller, financing, or Grand Plan guidance.'],
              ].map(([label, explanation]) => (
                <div key={label} className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">{label}</p>
                  <p className="mt-2 text-sm leading-6 text-white/55">{explanation}</p>
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

            <section
              id={cityDecisionGuide.neighborhoodSectionId}
              className="scroll-mt-24"
              data-testid={`${cityDecisionGuide.key}-decision-guide-neighborhoods`}
            >
              <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="mb-2 text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/72">
                    {cityDecisionGuide.neighborhoodsEyebrow}
                  </p>
                  <h2 className="text-3xl font-black uppercase leading-tight tracking-normal text-white md:text-4xl">
                    {cityDecisionGuide.neighborhoodsHeadline}
                  </h2>
                </div>
                <Link
                  href={`/search?city=${encodeURIComponent(cityData.name)}`}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[6px] bg-white/[0.07] px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-white no-underline transition hover:bg-white/12"
                >
                  Search {cityDecisionGuide.cityName}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {cityNeighborhoods.slice(0, 8).map((neighborhood) => (
                  <Link
                    key={neighborhood.slug}
                    href={getNeighborhoodPath(neighborhood)}
                    className="group rounded-[8px] bg-white/[0.045] p-5 text-white no-underline transition hover:bg-white/[0.075]"
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
            </section>

            <section
              className="grid gap-3 rounded-[8px] bg-cyan-100/[0.045] p-5 md:grid-cols-3 xl:grid-cols-6"
              data-testid={`${cityDecisionGuide.key}-decision-guide-continuity`}
            >
              {([
                { label: 'Market Context', href: getCanonicalPath(cityData), destination: 'market' },
                { label: `Search ${cityDecisionGuide.cityName} Homes`, href: `/search?city=${encodeURIComponent(cityData.name)}`, destination: 'search' },
                { label: 'Buyer Guidance', href: '/buy', destination: 'search' },
                { label: 'Seller Guidance', href: '/sell', destination: 'seller' },
                { label: 'Financing Guidance', href: '/buy#financing-confidence', destination: 'inquiry' },
                { label: 'Grand Plan', href: '/grand-plan', destination: 'inquiry' },
              ] as const).map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex min-h-12 items-center justify-between gap-3 rounded-[6px] bg-[#071017]/80 px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-white no-underline transition hover:bg-[#0a1118] hover:text-cyan-100"
                  {...getJourneyMeasurementAttributes({
                    surface: cityDecisionGuide.continuitySurface,
                    stage: 'market',
                    action: 'continue-journey',
                    destination: item.destination,
                  })}
                >
                  {item.label}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              ))}
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
                className="flex min-h-12 items-center justify-center rounded-[6px] bg-white/[0.04] px-4 py-3 text-center text-[11px] font-black uppercase tracking-[0.12em] text-white/64 no-underline transition hover:bg-cyan-100/10 hover:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-100/70"
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
                className="flex min-h-12 items-center justify-center rounded-[6px] bg-white/[0.04] px-4 py-3 text-center text-[11px] font-black uppercase tracking-[0.12em] text-white/64 no-underline transition hover:bg-cyan-100/10 hover:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-100/70"
                {...getJourneyMeasurementAttributes({
                  surface: 'city-market-journey',
                  stage: 'market',
                  action: 'start-search',
                  destination: 'search',
                })}
              >
                Search This Market
              </Link>
              <Link
                href="/sell"
                className="flex min-h-12 items-center justify-center rounded-[6px] bg-white/[0.04] px-4 py-3 text-center text-[11px] font-black uppercase tracking-[0.12em] text-white/64 no-underline transition hover:bg-cyan-100/10 hover:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-100/70"
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
