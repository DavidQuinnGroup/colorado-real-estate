import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight, Hammer, HelpCircle, Home, MapPinned, Search, ShieldCheck, Zap } from 'lucide-react';
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections.js';

import ContinueYourDecision from '@/components/ContinueYourDecision';
import FinancingConfidenceEducation from '@/components/FinancingConfidenceEducation';
import LocalSourceFreshnessCue from '@/components/LocalSourceFreshnessCue';
import NearbyNeighborhoods from '@/components/NearbyNeighborhoods';
import NeighborhoodProduct3Experience from '@/components/NeighborhoodProduct3Experience';
import RelatedContent from '@/components/RelatedContent';
import FAQSchema from '@/components/schema/FAQSchema';
import { getJourneyMeasurementAttributes } from '@/lib/customerJourneyMeasurement';
import { buildPlaceIntelligenceDeepeningModel } from '@/lib/buyerPlaceIntelligenceAdvancement';
import { buildLinkGraph } from '@/lib/linking/buildLinkGraph';
import { buildMarketDecisionWorkspace } from '@/lib/marketDecisionWorkspace';
import { buildNeighborhoodMarketExperience } from '@/lib/marketIntelligenceExperience';
import { getResilienceAdvice, neighborhoods, type Neighborhood } from '@/lib/neighborhoods';
import { buildNeighborhoodProduct3Model } from '@/lib/neighborhoodProduct3';
import { buildLocalSourceFreshnessPresentation } from '@/lib/searchMapLocalTrustAdvancement';
import type { FAQItem } from '@/lib/schema/faqSchema';
import { generateFAQs } from '@/lib/schema/generateFAQs';
import { buildNeighborhoodSchema } from '@/lib/schema/neighborhoodSchema';
import { retrieveTypesenseCollection, searchTypesenseDocuments } from '@/lib/typesense/httpClient';
import { formatSearchSchemaValidationError, LISTING_COLLECTION_NAME } from '@/lib/typesense/schema';

type NeighborhoodPageParams = {
  city: string;
  slug: string;
};

type NeighborhoodPageProps = {
  params: Promise<NeighborhoodPageParams>;
};

type SearchError = Error & {
  httpStatus?: number;
};

type RetrievedTypesenseCollection = CollectionCreateSchema & {
  fields?: NonNullable<CollectionCreateSchema['fields']>;
};

type InventoryState = {
  count: number;
  source: 'typesense' | 'fallback';
};

type TypesenseInventorySearchResponse = {
  found?: number;
};

const SITE_URL = 'https://davidquinngroup.com';
const TYPESENSE_REPAIR_COMMAND =
  'Terminal 5: run npm run worker:build, then npm run typesense:init, then npm run typesense:reindex when Supabase is reachable.';

let listingsCollectionValidationPromise: Promise<boolean> | null = null;
let warnedAboutInventoryLookup = false;

function normalizeRouteSegment(value: string) {
  return value.trim().toLowerCase();
}

function findNeighborhood(city: string, slug: string) {
  const normalizedCity = normalizeRouteSegment(city);
  const normalizedSlug = normalizeRouteSegment(slug);

  return neighborhoods.find(
    (item) => normalizeRouteSegment(item.city) === normalizedCity && normalizeRouteSegment(item.slug) === normalizedSlug,
  );
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Unknown Typesense error';
}

function getHttpStatus(error: unknown) {
  if (typeof error !== 'object' || error === null) return undefined;

  const candidate = error as { httpStatus?: unknown };
  return typeof candidate.httpStatus === 'number' ? candidate.httpStatus : undefined;
}

function isMissingNeighborhoodFilterError(error: unknown) {
  const message = getErrorMessage(error);
  return message.includes('Could not find a filter field named `neighborhood`') || message.includes('Could not find a filter field named neighborhood');
}

function warnInventoryLookupOnce(message: string) {
  if (warnedAboutInventoryLookup) return;

  console.info(message);
  warnedAboutInventoryLookup = true;
}

function toTypesenseFilterValue(value: string) {
  return `\`${value.replace(/`/g, '\\`')}\``;
}

function getFallbackInventoryCount(neighborhood: Neighborhood) {
  void neighborhood;
  return 0;
}

function shouldUseStaticInventoryFallback() {
  return process.env.NEXT_PHASE === 'phase-production-build';
}

function getCanonicalPath(neighborhood: Neighborhood) {
  return `/market/${neighborhood.city.toLowerCase()}/${neighborhood.slug}`;
}

function getCanonicalUrl(neighborhood: Neighborhood) {
  return `${SITE_URL}${getCanonicalPath(neighborhood)}`;
}

function getNeighborhoodDescription(neighborhood: Neighborhood) {
  return `David Quinn Group's ${neighborhood.name}, ${neighborhood.city}, Colorado intelligence report combines local property-discovery paths, housing context, verification guidance, and city market continuity.`;
}

function getNeighborhoodKeywords(neighborhood: Neighborhood) {
  return [
    `${neighborhood.name} real estate`,
    `${neighborhood.name} ${neighborhood.city} homes`,
    `${neighborhood.name} neighborhood guide`,
    `${neighborhood.city} Colorado real estate`,
    `${neighborhood.city} neighborhood intelligence`,
    'Colorado real estate intelligence',
    'construction forensics real estate',
    'David Quinn Group',
  ];
}

async function validateListingsCollectionSupportsNeighborhoodFacet() {
  try {
    const collection = await retrieveTypesenseCollection<RetrievedTypesenseCollection>(LISTING_COLLECTION_NAME);
    const schemaError = formatSearchSchemaValidationError(collection);

    if (schemaError) {
      warnInventoryLookupOnce(
        `Neighborhood inventory lookup skipped because the local Typesense ${LISTING_COLLECTION_NAME} collection is stale: ${schemaError}. ${TYPESENSE_REPAIR_COMMAND}`,
      );
      return false;
    }

    return true;
  } catch (error) {
    const status = getHttpStatus(error);

    if (status === 404) {
      warnInventoryLookupOnce(
        `Neighborhood inventory lookup skipped because the local Typesense ${LISTING_COLLECTION_NAME} collection does not exist. ${TYPESENSE_REPAIR_COMMAND}`,
      );
      return false;
    }

    warnInventoryLookupOnce(`Neighborhood inventory schema check failed${status ? ` (${status})` : ''}: ${getErrorMessage(error)}`);
    return false;
  }
}

async function ensureListingsCollectionSupportsNeighborhoodFacet() {
  listingsCollectionValidationPromise ||= validateListingsCollectionSupportsNeighborhoodFacet();
  return listingsCollectionValidationPromise;
}

export async function generateMetadata({ params }: NeighborhoodPageProps): Promise<Metadata> {
  const { city, slug } = await params;
  const neighborhood = findNeighborhood(city, slug);

  if (!neighborhood) {
    return {
      title: 'Neighborhood Not Found',
    };
  }

  const canonicalUrl = getCanonicalUrl(neighborhood);
  const description = getNeighborhoodDescription(neighborhood);

  return {
    title: `${neighborhood.name}, ${neighborhood.city} CO Real Estate Intelligence | David Quinn Group`,
    description,
    keywords: getNeighborhoodKeywords(neighborhood),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${neighborhood.name}, ${neighborhood.city} Real Estate Intelligence | David Quinn Group`,
      description,
      url: canonicalUrl,
      siteName: 'David Quinn Group',
      locale: 'en_US',
      type: 'website',
    },
  };
}

export function generateStaticParams() {
  return neighborhoods.map((neighborhood) => ({
    city: neighborhood.city.toLowerCase(),
    slug: neighborhood.slug,
  }));
}

async function getNeighborhoodInventoryState(neighborhood: Neighborhood): Promise<InventoryState> {
  if (shouldUseStaticInventoryFallback()) {
    return {
      count: getFallbackInventoryCount(neighborhood),
      source: 'fallback',
    };
  }

  const canSearchNeighborhoodFacet = await ensureListingsCollectionSupportsNeighborhoodFacet();

  if (!canSearchNeighborhoodFacet) {
    return {
      count: getFallbackInventoryCount(neighborhood),
      source: 'fallback',
    };
  }

  try {
    const searchResults = await searchTypesenseDocuments<TypesenseInventorySearchResponse>(LISTING_COLLECTION_NAME, {
      q: '*',
      filter_by: `neighborhood:=${toTypesenseFilterValue(neighborhood.name)}`,
      per_page: 0,
    });

    return {
      count: searchResults.found || 0,
      source: 'typesense',
    };
  } catch (error) {
    if (isMissingNeighborhoodFilterError(error)) {
      warnInventoryLookupOnce(
        `Neighborhood inventory lookup skipped because the local Typesense ${LISTING_COLLECTION_NAME} collection is missing the faceted neighborhood field. ${TYPESENSE_REPAIR_COMMAND}`,
      );

      return {
        count: getFallbackInventoryCount(neighborhood),
        source: 'fallback',
      };
    }

    const typedError = error as SearchError;
    const status = typedError.httpStatus ? ` (${typedError.httpStatus})` : '';
    console.info(`Neighborhood inventory lookup failed${status}: ${getErrorMessage(error)}`);

    return {
      count: getFallbackInventoryCount(neighborhood),
      source: 'fallback',
    };
  }
}

function getInventorySourceLabel(source: InventoryState['source']) {
  return source === 'typesense' ? 'Indexed Search' : 'Search Path';
}

function getInventoryDisplayValue(inventoryState: InventoryState) {
  return inventoryState.source === 'typesense' ? `${inventoryState.count} indexed` : 'Search ready';
}

function getInventoryDecisionSignal(inventoryState: InventoryState) {
  return inventoryState.source === 'typesense' ? `${inventoryState.count} indexed property signal` : 'Property search path available';
}

function getJsonLd(neighborhood: Neighborhood) {
  return buildNeighborhoodSchema({
    name: neighborhood.name,
    city: neighborhood.city,
    slug: neighborhood.slug,
    description: getNeighborhoodDescription(neighborhood),
    url: getCanonicalUrl(neighborhood),
    primaryAnchor: neighborhood.primaryAnchor,
    resilienceScore: neighborhood.resilienceScore,
    fireRisk: neighborhood.fireRisk,
    insuranceComplexity: neighborhood.insuranceComplexity,
    altitude: neighborhood.altitude,
    soilType: neighborhood.soilType,
  });
}

function getNeighborhoodFaqs(neighborhood: Neighborhood): FAQItem[] {
  const cityFaqs = generateFAQs(neighborhood.city, 'neighborhood-real-estate-intelligence');

  return [
    {
      question: `What does David Quinn Group evaluate in ${neighborhood.name}, ${neighborhood.city}?`,
      answer: `David Quinn Group evaluates ${neighborhood.name} through real estate intelligence, combining property-discovery paths, construction diligence, location context, insurance questions, soil profile, altitude, and verification guidance.`,
    },
    {
      question: `Why does construction forensics matter in ${neighborhood.name}?`,
      answer: `Construction forensics matters in ${neighborhood.name} because visible finishes do not always explain long-term value. David Quinn Group reviews condition signals, building envelope exposure, drainage, mechanical systems, and future maintenance risk before treating comparable sales as the full answer.`,
    },
    {
      question: `How should customers use local context in ${neighborhood.name}?`,
      answer: `${neighborhood.name} should be reviewed as neighborhood orientation rather than a conclusion. Use the page to frame property-specific diligence, current search review, insurance discussion, and questions that deserve deeper review before negotiation.`,
    },
    {
      question: `What place anchor defines ${neighborhood.name}?`,
      answer: `${neighborhood.name} is anchored by ${neighborhood.primaryAnchor}. David Quinn Group evaluates that place anchor alongside daily access, housing context, current property discovery, and the verification focus: ${neighborhood.tacticalLever}`,
    },
    ...cityFaqs.slice(4, 6),
  ];
}

function getNeighborhoodStory(neighborhood: Neighborhood) {
  return `${neighborhood.name} sits within ${neighborhood.city} around ${neighborhood.primaryAnchor}. Use this page to understand the place, the housing context, the available evidence, and what should be verified before comparing individual homes.`;
}

function getHousingContext(neighborhood: Neighborhood) {
  return `${neighborhood.era} housing context with ${neighborhood.constructionDNA.toLowerCase()}`;
}

function getTradeoffSummary(neighborhood: Neighborhood) {
  const insuranceContext =
    neighborhood.insuranceComplexity === 'Standard'
      ? 'insurance review is still part of normal diligence'
      : `${neighborhood.insuranceComplexity.toLowerCase()} insurance complexity should be checked early`;

  return `${neighborhood.primaryAnchor} may be the practical place anchor, while ${neighborhood.soilType.toLowerCase()} soil context, ${neighborhood.fireRisk.toLowerCase()} fire context, and ${insuranceContext} define what to verify property by property.`;
}

function getPlaceOrientationPromise(neighborhood: Neighborhood) {
  return `Start with neutral place orientation, then compare housing context, evidence, and verification questions before deciding which ${neighborhood.name} properties deserve time.`;
}

function getGeographicOrganization(neighborhood: Neighborhood) {
  return `${neighborhood.name} is organized around ${neighborhood.primaryAnchor} within ${neighborhood.city}. Treat geography as orientation for touring, search filters, and professional review, not as a conclusion about personal fit.`;
}

function getNeighborhoodBoundary(neighborhood: Neighborhood) {
  return `${neighborhood.name} context is not a ranking, suitability conclusion, safety conclusion, school-quality conclusion, investment guidance, appreciation forecast, or substitute for property-specific professional review.`;
}

function getVerificationQuestions(neighborhood: Neighborhood) {
  return [
    `Does the property condition support the ${neighborhood.era} housing pattern?`,
    `Are drainage, roof, sewer, mechanical, and exterior systems consistent with the visible finish quality?`,
    `Does access to ${neighborhood.primaryAnchor} support the commute, daily routine, and seasonal-use assumptions for your individual needs?`,
  ];
}

function getNeighborhoodFramework(
  neighborhood: Neighborhood,
  searchHref: string,
  cityMarketHref: string,
  inventoryState: InventoryState,
) {
  return [
    {
      label: 'Context',
      icon: <MapPinned className="h-4 w-4" />,
      title: `${neighborhood.primaryAnchor} anchors the location story.`,
      body: getNeighborhoodStory(neighborhood),
      href: cityMarketHref,
      action: 'Compare city context',
    },
    {
      label: 'Trade-offs',
      icon: <ShieldCheck className="h-4 w-4" />,
      title: 'Separate location context from property diligence.',
      body: getTradeoffSummary(neighborhood),
      href: '#neighborhood-verification-questions',
      action: 'Review what to verify',
    },
    {
      label: 'Questions',
      icon: <HelpCircle className="h-4 w-4" />,
      title: 'Ask better questions before touring.',
      body: getVerificationQuestions(neighborhood)[0],
      href: '#neighborhood-verification-questions',
      action: 'See questions',
    },
    {
      label: 'Evidence',
      icon: <Home className="h-4 w-4" />,
      title: 'Use only bounded, visible signals.',
      body:
        inventoryState.source === 'typesense'
          ? `${inventoryState.count} indexed property signal, soil, altitude, insurance, and construction context are prompts for verification, not personal conclusions or predictions.`
          : 'Property search path, soil, altitude, insurance, and construction context are prompts for verification, not personal conclusions or predictions.',
      href: '#neighborhood-market-evidence',
      action: 'Read evidence',
    },
    {
      label: 'Next Step',
      icon: <Search className="h-4 w-4" />,
      title: 'Open homes after the context supports your questions.',
      body: `Search ${neighborhood.name} homes, then compare each property against market context and the verification questions on this page.`,
      href: searchHref,
      action: 'Search this neighborhood',
    },
  ];
}

export default async function NeighborhoodIntelligencePage({ params }: NeighborhoodPageProps) {
  const { city, slug } = await params;
  const neighborhood = findNeighborhood(city, slug);

  if (!neighborhood) return notFound();

  const inventoryState = await getNeighborhoodInventoryState(neighborhood);
  const resilienceAdvice = getResilienceAdvice(neighborhood);
  const relatedLinks = buildLinkGraph(neighborhood.slug);
  const canonicalUrl = getCanonicalUrl(neighborhood);
  const neighborhoodFaqs = getNeighborhoodFaqs(neighborhood);
  const neighborhoodSchema = getJsonLd(neighborhood);
  const neighborhoodSchemaGraph = neighborhoodSchema['@graph'];
  const marketExperience = buildNeighborhoodMarketExperience(neighborhood, inventoryState);
  const cityMarketHref = `/market/${normalizeRouteSegment(neighborhood.city)}-co-housing-market`;
  const searchHref = `/search?neighborhood=${encodeURIComponent(neighborhood.name)}`;
  const neighborhoodStory = getNeighborhoodStory(neighborhood);
  const orientationPromise = getPlaceOrientationPromise(neighborhood);
  const geographicOrganization = getGeographicOrganization(neighborhood);
  const neighborhoodBoundary = getNeighborhoodBoundary(neighborhood);
  const housingContext = getHousingContext(neighborhood);
  const tradeoffSummary = getTradeoffSummary(neighborhood);
  const verificationQuestions = getVerificationQuestions(neighborhood);
  const routeEnhancement = neighborhood.routeEnhancement;
  const neighborhoodFramework = getNeighborhoodFramework(neighborhood, searchHref, cityMarketHref, inventoryState);
  const marketDecisionWorkspace = buildMarketDecisionWorkspace({
    scope: 'neighborhood',
    name: neighborhood.name,
    city: neighborhood.city,
    marketSignal: marketExperience.inventoryLabel,
    competitivenessSignal: marketExperience.competitivenessLabel,
    timingSignal: marketExperience.timingLabel,
    pricingSignal: 'Neighborhood orientation evidence',
    inventorySignal: getInventoryDecisionSignal(inventoryState),
    resilienceSignal: `${neighborhood.fireRisk} fire context, ${neighborhood.insuranceComplexity.toLowerCase()} insurance complexity, and ${neighborhood.soilType}`,
    searchHref,
    marketHref: cityMarketHref,
    sellerHref: '/sell',
  });
  const neighborhoodProduct3Model = buildNeighborhoodProduct3Model({
    neighborhood,
    inventoryState,
    market: {
      inventoryLabel: marketExperience.inventoryLabel,
      competitivenessLabel: marketExperience.competitivenessLabel,
      timingLabel: marketExperience.timingLabel,
    },
    cityMarketHref,
    searchHref,
  });
  const placeIntelligenceDeepening = buildPlaceIntelligenceDeepeningModel({
    neighborhood,
    inventoryState,
    evidenceState: neighborhoodProduct3Model.evidenceState,
    marketLabels: {
      inventory: marketExperience.inventoryLabel,
      competitiveness: marketExperience.competitivenessLabel,
      timing: marketExperience.timingLabel,
    },
    cityMarketHref,
    searchHref,
    relatedPlaceNames: relatedLinks
      .filter((link) => link.type === 'neighborhood')
      .map((link) => link.title.replace(/ Neighborhood Intelligence$/, ''))
      .slice(0, 3),
  });
  const localSourceFreshness = buildLocalSourceFreshnessPresentation({
    surface: 'neighborhood',
    title: `What the ${neighborhood.name} place view represents.`,
    source: 'Governed REIE neighborhood route context, visible housing and place attributes, and current route inventory posture.',
    observedUpdated:
      inventoryState.source === 'typesense'
        ? 'Current public search index count was available for this route.'
        : 'Rendered from governed route context with static inventory fallback.',
    representation: `${neighborhood.name} place orientation within ${neighborhood.city}; inventory source state: ${inventoryState.source}.`,
    limitation:
      'Neighborhood context is not a personal fit, safety, school, investment, appreciation, or condition conclusion. Verify property-specific facts.',
  });

  return (
    <main
      className="reie-neighborhood-page min-h-screen overflow-x-hidden bg-[#050505] font-inter text-white"
      data-dxt-wave-1d-neighborhood-place-orientation="true"
      data-dxt-wave-1d-neighborhood-plan="REIE_DXT_WAVE_1D_NEIGHBORHOOD_PLACE_ORIENTATION_PLAN_CERTIFIED_AND_CLOSED"
      data-dxt-wave-1d-market-runtime-change="false"
      data-dxt-wave-1c-buyer-runtime-change="false"
      data-dxt-wave-1c-seller-runtime-change="false"
    >
      <script
        type="application/ld+json"
        data-testid="reie-neighborhood-schema"
        data-neighborhood-schema-type="Place"
        data-neighborhood-schema-url={canonicalUrl}
        data-neighborhood-schema-name={neighborhood.name}
        data-neighborhood-schema-city={neighborhood.city}
        data-neighborhood-schema-slug={neighborhood.slug}
        data-neighborhood-schema-primary-anchor={neighborhood.primaryAnchor}
        data-neighborhood-schema-resilience-score={neighborhood.resilienceScore}
        data-neighborhood-schema-fire-risk={neighborhood.fireRisk}
        data-neighborhood-schema-insurance-complexity={neighborhood.insuranceComplexity}
        data-neighborhood-schema-altitude={neighborhood.altitude}
        data-neighborhood-schema-soil-type={neighborhood.soilType}
        data-neighborhood-schema-inventory-count={inventoryState.count}
        data-neighborhood-schema-inventory-source={inventoryState.source}
        data-neighborhood-schema-related-link-count={relatedLinks.length}
        data-neighborhood-schema-faq-count={neighborhoodFaqs.length}
        data-neighborhood-schema-graph-count={neighborhoodSchemaGraph.length}
        data-neighborhood-schema-has-breadcrumb="true"
        data-neighborhood-schema-has-city="true"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(neighborhoodSchema),
        }}
      />
      <FAQSchema faqs={neighborhoodFaqs} pageUrl={canonicalUrl} />

      <section
        className="reie-neighborhood-hero relative overflow-hidden bg-[radial-gradient(circle_at_78%_10%,rgba(207,250,254,0.14),transparent_30%),linear-gradient(180deg,#081117,#050505_82%)] px-6 py-12 md:px-12 md:py-16"
        data-testid="neighborhood-product-2-hero"
        data-neighborhood-product-2="true"
        data-neighborhood-product-2-fair-housing="neutral-non-ranking"
        data-neighborhood-product-2-ai="false"
        data-neighborhood-product-2-gis="false"
        data-neighborhood-product-2-telemetry="false"
        data-dxt-neighborhood-hierarchy-role="place-orientation-governing-question-concise-overview"
      >
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
        <div className="relative z-20 mx-auto w-full max-w-7xl">
          <div className="reie-neighborhood-hero-eyebrow mb-5 flex flex-wrap items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-cyan-100 shadow-[0_0_18px_rgba(207,250,254,0.45)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.32em] text-cyan-100/78">Neighborhood Place Orientation</span>
            <span className="rounded-full bg-white/[0.08] px-3 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-white/50">
              {neighborhood.city}
            </span>
          </div>

          <div className="reie-neighborhood-hero-layout grid gap-10 lg:grid-cols-[1.06fr_0.94fr] lg:items-end">
            <div>
              <p className="mb-4 text-[11px] font-black uppercase tracking-[0.24em] text-white/42">{neighborhood.name}</p>
              <h1 className="max-w-5xl break-words text-4xl font-black uppercase leading-[0.94] tracking-normal md:text-6xl">
                What kind of place is this, how is it organized, and what should I verify next?
              </h1>
              <p
                className="mt-6 max-w-3xl text-base leading-8 text-white/70 md:text-lg"
                data-testid="neighborhood-product-2-first-value"
                data-neighborhood-product-2-first-value-position="hero"
              >
                {orientationPromise}
              </p>
              <div className="reie-neighborhood-hero-actions mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={searchHref}
                  className="reie-neighborhood-primary-action inline-flex min-h-12 items-center justify-center gap-2 rounded-[6px] bg-cyan-100 px-5 py-3 text-[11px] font-black uppercase tracking-[0.14em] text-[#071017] no-underline transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100/70"
                  data-testid="neighborhood-product-2-primary-search"
                  {...getJourneyMeasurementAttributes({
                    surface: 'neighborhood-product-2-hero',
                    stage: 'market',
                    action: 'start-search',
                    destination: 'search',
                  })}
                >
                  <Search className="h-4 w-4" />
                  Search This Neighborhood
                </Link>
                <Link
                  href={cityMarketHref}
                  className="reie-neighborhood-secondary-action inline-flex min-h-12 items-center justify-center gap-2 rounded-[6px] bg-white/[0.08] px-5 py-3 text-[11px] font-black uppercase tracking-[0.14em] text-white no-underline transition hover:bg-white/[0.14] focus:outline-none focus:ring-2 focus:ring-cyan-100/70"
                  {...getJourneyMeasurementAttributes({
                    surface: 'neighborhood-product-2-hero',
                    stage: 'market',
                    action: 'view-market',
                    destination: 'market',
                  })}
                >
                  City Market Context
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="reie-neighborhood-hero-card rounded-[8px] bg-white/[0.07] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.28)]">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/72">What to understand first</p>
              <p className="mt-4 text-2xl font-black uppercase leading-tight tracking-normal text-white">
                Place first. Then housing context. Then property evidence.
              </p>
              <div className="mt-6 grid gap-3">
                {[
                  ['Place anchor', neighborhood.primaryAnchor],
                  ['Geographic context', `${neighborhood.name} in ${neighborhood.city}`],
                  ['Housing pattern', neighborhood.era],
                ].map(([label, value]) => (
                  <div key={label} className="reie-neighborhood-hero-fact rounded-[6px] bg-black/20 p-4">
                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/35">{label}</p>
                    <p className="mt-2 text-sm font-black uppercase leading-5 tracking-tight text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="reie-neighborhood-hero-metrics mt-8 grid gap-3 md:grid-cols-4">
            <div className="reie-neighborhood-hero-metric rounded-[8px] bg-white/[0.055] p-4">
              <p className="mb-2 text-[9px] font-black uppercase tracking-[0.18em] text-white/36">Property Path</p>
              <p className="text-lg font-black uppercase tracking-tight text-white">{getInventoryDisplayValue(inventoryState)}</p>
              <p className="mt-2 text-[9px] font-black uppercase tracking-[0.18em] text-cyan-100/62">
                {getInventorySourceLabel(inventoryState.source)}
              </p>
            </div>
            <div className="reie-neighborhood-hero-metric rounded-[8px] bg-white/[0.055] p-4">
              <p className="mb-2 text-[9px] font-black uppercase tracking-[0.18em] text-white/36">Evidence</p>
              <p className="text-lg font-black uppercase tracking-tight text-white">{neighborhoodProduct3Model.evidenceState}</p>
            </div>
            <div className="reie-neighborhood-hero-metric rounded-[8px] bg-white/[0.055] p-4">
              <p className="mb-2 text-[9px] font-black uppercase tracking-[0.18em] text-white/36">Attention</p>
              <p className="text-lg font-black uppercase tracking-tight text-white">{neighborhood.fireRisk}</p>
            </div>
            <div className="reie-neighborhood-hero-metric rounded-[8px] bg-white/[0.055] p-4">
              <p className="mb-2 text-[9px] font-black uppercase tracking-[0.18em] text-white/36">Timing</p>
              <p className="text-lg font-black uppercase tracking-tight text-white">{marketExperience.timingLabel}</p>
            </div>
          </div>
          <p
            className="mt-6 max-w-3xl text-xs leading-6 text-white/42"
            data-testid="market-source-disclaimer"
            data-market-sales-source-control="present"
            data-market-non-participation-disclaimer="present"
          >
            Neighborhood and market signals are market-wide REIE context from governed neighborhood data and public MLS/search signals
            where available. They do not state or imply that David Quinn, David Quinn Group, or Compass listed, sold, or participated in
            every reported property.
          </p>
          <div className="mt-6">
            <LocalSourceFreshnessCue presentation={localSourceFreshness} />
          </div>
        </div>
      </section>

      <section
        className="reie-neighborhood-place-foundation mx-auto grid max-w-7xl gap-6 px-6 py-10 md:grid-cols-[0.78fr_1.22fr] md:px-12"
        data-testid="dxt-wave-1d-neighborhood-place-foundation"
        data-dxt-neighborhood-hierarchy-role="geographic-organization-housing-context"
      >
        <div>
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100/72">
            Place, Geography, Housing
          </p>
          <h2 className="text-3xl font-black uppercase leading-tight tracking-normal text-white md:text-4xl">
            Understand the place before the property comparison.
          </h2>
          <p className="mt-5 text-sm leading-7 text-white/62 md:text-base">{neighborhoodStory}</p>
          <p className="mt-5 text-sm leading-7 text-white/58 md:text-base">{geographicOrganization}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ['Geography', `${neighborhood.name} within ${neighborhood.city}`],
            ['Housing Context', housingContext],
            ['Verify Next', tradeoffSummary],
          ].map(([label, body]) => (
            <article key={label} className="rounded-[8px] bg-white/[0.045] p-5">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-cyan-100/70">{label}</p>
              <p className="mt-3 text-xs leading-6 text-white/55">{body}</p>
            </article>
          ))}
        </div>
      </section>

      {routeEnhancement ? (
        <section
          className="reie-neighborhood-route-enhancement mx-auto max-w-7xl px-6 py-10 md:px-12"
          data-testid="neighborhood-route-enhancement"
          data-neighborhood-route-enhancement="true"
          data-neighborhood-route-enhancement-name={neighborhood.name}
          data-neighborhood-route-enhancement-slug={neighborhood.slug}
          data-neighborhood-route-enhancement-contract={routeEnhancement.contract}
          data-neighborhood-route-enhancement-canonical-identity={routeEnhancement.canonicalIdentity || ''}
          data-neighborhood-route-enhancement-aliases={routeEnhancement.aliases?.join(',') || ''}
          data-neighborhood-route-enhancement-boundary-posture={routeEnhancement.boundaryPosture || ''}
          data-neighborhood-route-enhancement-route={routeEnhancement.canonicalPath}
          data-neighborhood-route-enhancement-object-type={routeEnhancement.objectType}
          data-neighborhood-route-enhancement-canonical={routeEnhancement.canonicalUrl}
          data-neighborhood-route-enhancement-search-preserved="true"
          data-neighborhood-route-enhancement-map-preserved="true"
          data-neighborhood-route-enhancement-sitemap-preserved="true"
          data-neighborhood-route-enhancement-public-copy-only="true"
          data-neighborhood-route-enhancement-no-internal-metadata="true"
          data-neighborhood-route-enhancement-fair-housing="neutral-non-ranking"
        >
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
            <div>
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100/72">
                Neighborhood Decision Snapshot
              </p>
              <h2 className="text-3xl font-black uppercase leading-tight tracking-normal text-white md:text-4xl">
                Use {neighborhood.name} as orientation, then verify the address.
              </h2>
              <p className="mt-5 text-sm leading-7 text-white/62 md:text-base">
                Understand the place before the property comparison. {neighborhoodStory}
              </p>
              <p className="mt-5 text-sm leading-7 text-white/58 md:text-base">{geographicOrganization}</p>
              <p className="mt-5 rounded-[6px] bg-cyan-100/[0.06] p-4 text-xs leading-6 text-cyan-100/72">
                {routeEnhancement.scopeClarification}
              </p>
              {routeEnhancement.aliases?.length ? (
                <p
                  className="mt-4 rounded-[6px] bg-white/[0.04] p-4 text-xs leading-6 text-white/52"
                  data-testid="neighborhood-route-enhancement-identity"
                  data-neighborhood-route-enhancement-identity={routeEnhancement.canonicalIdentity}
                  data-neighborhood-route-enhancement-object-type={routeEnhancement.objectType}
                  data-neighborhood-route-enhancement-parent={neighborhood.city}
                  data-neighborhood-route-enhancement-alias={routeEnhancement.aliases.join(',')}
                >
                  Canonical identity: {routeEnhancement.canonicalIdentity}. Public shorthand such as {routeEnhancement.aliases.join(', ')} is
                  treated as an orientation label only, not a separate route, boundary, ranking, or property conclusion.
                </p>
              ) : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ['Local Character', routeEnhancement.localCharacter],
                ['Geographic And Context Boundaries', routeEnhancement.geographicBoundaries],
                ['Housing And Property Context', routeEnhancement.housingAndPropertyContext],
                ['Source-Rights Boundary', routeEnhancement.sourceRightsBoundary],
              ].map(([label, body]) => (
                <article key={label} className="rounded-[8px] bg-white/[0.045] p-5">
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-cyan-100/70">{label}</p>
                  <p className="mt-3 text-xs leading-6 text-white/55">{body}</p>
                </article>
              ))}
            </div>
          </div>

          {routeEnhancement.evidenceContract?.length || routeEnhancement.unavailableEvidence?.length ? (
            <section
              className="mt-8 grid gap-4 rounded-[8px] bg-white/[0.04] p-5 lg:grid-cols-[1.05fr_0.95fr]"
              data-testid="neighborhood-route-enhancement-evidence-contract"
              data-neighborhood-route-enhancement-source-to-answer="true"
              data-neighborhood-route-enhancement-unavailable-fail-closed="true"
              data-neighborhood-route-enhancement-county-assessor-active="false"
              data-neighborhood-route-enhancement-public-gis-active="false"
              data-neighborhood-route-enhancement-schema-visible-alignment="true"
            >
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100/72">Evidence Contract</p>
                <div className="mt-4 grid gap-3">
                  {routeEnhancement.evidenceContract?.map((item) => (
                    <article key={item.stage} className="rounded-[6px] bg-black/18 p-4">
                      <p className="text-[9px] font-black uppercase tracking-[0.16em] text-white/34">{item.stage}</p>
                      <p className="mt-2 text-xs leading-6 text-white/58">{item.treatment}</p>
                    </article>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100/72">Unavailable Evidence</p>
                <div className="mt-4 grid gap-3">
                  {routeEnhancement.unavailableEvidence?.map((item) => (
                    <p key={item} className="rounded-[6px] bg-black/18 p-4 text-xs leading-6 text-white/58">{item}</p>
                  ))}
                </div>
              </div>
            </section>
          ) : null}

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <article className="rounded-[8px] bg-[#071017]/78 p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100/72">Market And Decision Drivers</p>
              <div className="mt-4 grid gap-3">
                {routeEnhancement.marketAndDecisionDrivers.map((prompt) => (
                  <p key={prompt} className="text-xs leading-6 text-white/58">{prompt}</p>
                ))}
              </div>
            </article>

            <article className="rounded-[8px] bg-[#071017]/78 p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100/72">Buyer Considerations</p>
              <div className="mt-4 grid gap-3">
                {routeEnhancement.buyerPrompts.map((prompt) => (
                  <p key={prompt} className="text-xs leading-6 text-white/58">{prompt}</p>
                ))}
              </div>
            </article>

            <article className="rounded-[8px] bg-[#071017]/78 p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100/72">Seller Considerations</p>
              <div className="mt-4 grid gap-3">
                {routeEnhancement.sellerPrompts.map((prompt) => (
                  <p key={prompt} className="text-xs leading-6 text-white/58">{prompt}</p>
                ))}
              </div>
            </article>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <section
              className="rounded-[8px] bg-white/[0.04] p-5"
              data-testid="neighborhood-evidence-limitation-transparency"
              data-neighborhood-evidence-public-copy-only="true"
              data-neighborhood-evidence-no-scores="true"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100/72">
                Evidence And Limitation Transparency
              </p>
              <div className="mt-4 grid gap-3">
                {routeEnhancement.evidenceTransparency.map((item) => (
                  <p key={item} className="text-xs leading-6 text-white/58">{item}</p>
                ))}
              </div>
              <div className="mt-5 rounded-[6px] bg-black/24 p-4 text-xs leading-6 text-white/48">
                {routeEnhancement.protectedBoundary}
              </div>
            </section>

            <section className="rounded-[8px] bg-white/[0.04] p-5" data-testid="neighborhood-journey-continuity">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100/72">Journey Continuity</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {routeEnhancement.journeyLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="reie-decision-link reie-decision-link--secondary flex min-h-[88px] flex-col justify-center rounded-[6px] px-4 py-3 text-white no-underline transition focus:outline-none focus:ring-2 focus:ring-cyan-100/70"
                    data-testid="neighborhood-route-enhancement-journey-link"
                    data-neighborhood-route-enhancement-journey-href={link.href}
                  >
                    <span className="text-[10px] font-black uppercase tracking-[0.14em] text-cyan-100/72">{link.label}</span>
                    <span className="mt-2 text-xs leading-5 text-white/48">{link.note}</span>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <section className="mt-8 rounded-[8px] bg-cyan-100/[0.04] p-5" data-testid="neighborhood-due-diligence-guidance">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100/72">
              Due-Diligence And Verification Prompts
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {routeEnhancement.dueDiligencePrompts.map((prompt) => (
                <p key={prompt} className="text-xs leading-6 text-white/58">{prompt}</p>
              ))}
            </div>
          </section>
        </section>
      ) : null}

      <section
        className="reie-place-intelligence-deepening mx-auto grid max-w-7xl gap-8 px-6 py-10 md:px-12"
        data-testid="place-intelligence-deepening"
        data-place-intelligence-status={placeIntelligenceDeepening.status}
        data-place-intelligence-subject={placeIntelligenceDeepening.subject}
        data-place-intelligence-city={placeIntelligenceDeepening.city}
        data-place-intelligence-evidence-state={placeIntelligenceDeepening.evidenceState}
        data-place-intelligence-dimension-count={placeIntelligenceDeepening.dimensions.length}
        data-place-intelligence-source-count={placeIntelligenceDeepening.sourceRecords.length}
        data-place-intelligence-school-ranking={String(placeIntelligenceDeepening.protectedBoundaries.schoolRanking)}
        data-place-intelligence-safety-ranking={String(placeIntelligenceDeepening.protectedBoundaries.safetyRanking)}
        data-place-intelligence-crime-steering={String(placeIntelligenceDeepening.protectedBoundaries.crimeSteering)}
        data-place-intelligence-family-suitability={String(placeIntelligenceDeepening.protectedBoundaries.familySuitability)}
        data-place-intelligence-demographic-preference={String(placeIntelligenceDeepening.protectedBoundaries.demographicPreference)}
        data-place-intelligence-socioeconomic-sorting={String(
          placeIntelligenceDeepening.protectedBoundaries.socioeconomicSorting,
        )}
        data-place-intelligence-place-ordering={String(placeIntelligenceDeepening.protectedBoundaries.placeOrderingConclusion)}
        data-place-intelligence-lifestyle-fit-scoring={String(placeIntelligenceDeepening.protectedBoundaries.lifestyleFitScoring)}
        data-place-intelligence-investment-ranking={String(placeIntelligenceDeepening.protectedBoundaries.investmentRanking)}
        data-place-intelligence-appreciation-prediction={String(placeIntelligenceDeepening.protectedBoundaries.appreciationPrediction)}
        data-place-intelligence-fair-housing-proxy={String(placeIntelligenceDeepening.protectedBoundaries.fairHousingProxy)}
        data-place-intelligence-public-gis={String(placeIntelligenceDeepening.protectedBoundaries.publicGisActivation)}
        data-place-intelligence-provider-activation={String(placeIntelligenceDeepening.protectedBoundaries.providerActivation)}
        data-place-intelligence-persistence={String(placeIntelligenceDeepening.protectedBoundaries.persistence)}
        data-place-intelligence-telemetry={String(placeIntelligenceDeepening.protectedBoundaries.telemetry)}
        data-place-intelligence-api-change={String(placeIntelligenceDeepening.protectedBoundaries.apiChange)}
        data-dxt-neighborhood-hierarchy-role="place-identity-geographic-market-evidence-decision-questions"
      >
        <div className="grid gap-8 rounded-[8px] border border-cyan-100/12 bg-white/[0.035] p-5 md:p-8 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100/72">Place Intelligence</p>
            <h2 className="text-3xl font-black uppercase leading-tight tracking-normal text-white md:text-4xl">
              What is this place, what evidence exists, and what should I investigate?
            </h2>
            <p className="mt-5 text-sm leading-7 text-white/58 md:text-base">{placeIntelligenceDeepening.governingQuestion}</p>
            <p className="mt-5 rounded-[6px] bg-cyan-100/[0.06] p-4 text-xs leading-6 text-cyan-100/72">
              This layer deepens existing neighborhood evidence without public GIS, new source activation, ranking, scoring, steering, or hidden
              personalization. It keeps each place question user-controlled and verification-bound.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {placeIntelligenceDeepening.dimensions.map((dimension) => (
              <Link
                key={dimension.key}
                href={dimension.href}
                className="rounded-[8px] border border-white/10 bg-[#071017]/78 p-5 text-white no-underline transition hover:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-cyan-100/70"
                data-testid="place-intelligence-dimension"
                data-place-intelligence-dimension={dimension.key}
                data-place-intelligence-source-ids={dimension.sourceIds.join(',')}
              >
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-cyan-100/70">{dimension.label}</p>
                <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-white/36">Fact</p>
                <p className="mt-1 text-xs leading-6 text-white/56">{dimension.fact}</p>
                <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-white/36">Meaning</p>
                <p className="mt-1 text-xs leading-6 text-white/56">{dimension.meaning}</p>
                <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-cyan-100/72">Investigate</p>
                <p className="mt-1 text-xs leading-6 text-white/56">{dimension.investigate}</p>
                <p className="mt-3 text-xs leading-6 text-white/36">{dimension.sourcePosture}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-4 rounded-[8px] border border-white/10 bg-black/18 p-5 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100/72">Source Registry posture</p>
            <p className="mt-3 text-xs leading-6 text-white/50">
              Place intelligence uses only existing customer-disclosure eligible source records. Source status is disclosed; no source state is
              changed by this route.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {placeIntelligenceDeepening.sourceRecords.map((record) => (
              <div key={record.sourceId} className="rounded-[6px] border border-white/10 bg-white/[0.035] p-3">
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-cyan-100/68">{record.sourceId}</p>
                <p className="mt-2 text-xs font-bold leading-5 text-white/58">{record.customerStatus}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <NeighborhoodProduct3Experience model={neighborhoodProduct3Model} />

      <section className="reie-neighborhood-context mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-12 md:p-12">
        <section
          className="md:col-span-12"
          data-testid="neighborhood-product-2-decision-framework"
          data-neighborhood-product-2-framework="context-tradeoffs-questions-evidence-next-step"
          data-neighborhood-product-2-claims="governed-data-supported"
          data-neighborhood-product-2-school-ranking="false"
          data-neighborhood-product-2-safety-ranking="false"
          data-neighborhood-product-2-demographic-targeting="false"
          data-neighborhood-product-2-investment-projection="false"
          data-dxt-neighborhood-hierarchy-role="evidence-that-matters"
        >
          <div className="mb-6 max-w-3xl">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.26em] text-cyan-100/72">Local Authority Framework</p>
            <h2 className="text-3xl font-black uppercase leading-tight tracking-normal text-white md:text-4xl">
              Decide whether the neighborhood deserves a closer look.
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/58 md:text-base">
              {housingContext} Use this as a starting point for property-specific verification, not as a personal conclusion or prediction.
            </p>
          </div>

          <div className="grid gap-3 lg:grid-cols-5">
            {neighborhoodFramework.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="reie-neighborhood-framework-link group flex min-h-[240px] flex-col rounded-[8px] bg-white/[0.045] p-5 text-white no-underline transition hover:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-cyan-100/70"
                data-testid="neighborhood-product-2-framework-item"
                data-neighborhood-product-2-framework-step={item.label}
              >
                <div className="mb-5 flex items-center justify-between gap-3 text-cyan-100/72">
                  {item.icon}
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">{item.label}</span>
                </div>
                <h3 className="text-base font-black uppercase leading-6 tracking-tight text-white">{item.title}</h3>
                <p className="mt-4 text-xs leading-6 text-white/52">{item.body}</p>
                <span className="mt-auto pt-5 text-[10px] font-black uppercase tracking-[0.13em] text-cyan-100/72 transition group-hover:text-white">
                  {item.action}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section
          className="reie-neighborhood-readiness-depth grid gap-8 rounded-[8px] bg-[#071017]/78 p-5 md:col-span-12 md:grid-cols-[0.84fr_1.16fr] md:p-8"
          data-testid="dxt-2-neighborhood-decision-readiness-depth"
          data-dxt-2-neighborhood-readiness-depth="implemented"
          data-dxt-2-neighborhood-readiness-runtime-scope="app/market/[city]/[slug]/page.tsx"
          data-dxt-2-neighborhood-readiness-existing-evidence-only="true"
          data-dxt-2-neighborhood-readiness-market-change="false"
          data-dxt-2-neighborhood-readiness-city-market-change="false"
          data-dxt-2-neighborhood-readiness-search-change="false"
          data-dxt-2-neighborhood-readiness-property-change="false"
          data-dxt-2-neighborhood-readiness-product-3-preserved="true"
          data-dxt-2-neighborhood-readiness-related-content-preserved="true"
          data-dxt-2-neighborhood-readiness-nearby-neighborhoods-preserved="true"
          data-dxt-2-neighborhood-readiness-schema-preserved="true"
          data-dxt-2-neighborhood-readiness-faq-preserved="true"
          data-dxt-2-neighborhood-readiness-provider-activation="false"
          data-dxt-2-neighborhood-readiness-api-change="false"
          data-dxt-2-neighborhood-readiness-hidden-context="false"
          data-dxt-2-neighborhood-readiness-persistence="false"
          data-dxt-2-neighborhood-readiness-telemetry="false"
          data-dxt-2-neighborhood-readiness-ai="false"
          data-dxt-2-neighborhood-readiness-scoring="false"
          data-dxt-2-neighborhood-readiness-ranking="false"
        >
          <div>
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100/72">
              Neighborhood Decision Readiness
            </p>
            <h2 className="text-3xl font-black uppercase leading-tight tracking-normal text-white md:text-4xl">
              Decide what this place evidence can support before opening the next surface.
            </h2>
            <p className="mt-5 text-sm leading-7 text-white/58 md:text-base">
              This readiness layer uses existing neighborhood evidence only. It helps separate directional place context,
              assumptions, unknowns, and verification needs before moving to Search, Property, City Market, Market, or Advisory.
            </p>
            <p className="mt-5 rounded-[6px] bg-cyan-100/[0.06] p-4 text-xs leading-6 text-cyan-100/72">
              Confidence is qualitative and descriptive, not a score. Freshness depends on current Search signals, governed
              neighborhood context, and property-specific verification that still needs to happen before reliance.
            </p>
          </div>

          <div className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  label: 'Evidence available now',
                  body: `${neighborhood.primaryAnchor}, ${housingContext.toLowerCase()}, ${neighborhood.soilType.toLowerCase()} soil context, ${neighborhood.fireRisk.toLowerCase()} fire context, ${neighborhood.insuranceComplexity.toLowerCase()} insurance complexity, ${getInventoryDecisionSignal(inventoryState).toLowerCase()}, and current Neighborhood market signals are visible here.`,
                },
                {
                  label: 'Evidence unavailable here',
                  body:
                    'Parcel condition, interior systems, title, HOA details, insurance terms, inspection results, lending facts, and contract risk still require property-specific verification.',
                },
                {
                  label: 'Directional context',
                  body: `${neighborhood.name} can orient place organization and questions to ask; it does not determine personal fit, suitability, safety, school quality, investment merit, or future appreciation.`,
                },
                {
                  label: 'Assumptions to separate',
                  body: `Treat access to ${neighborhood.primaryAnchor}, ${neighborhood.era.toLowerCase()} housing patterns, commute use, maintenance expectations, and market timing as assumptions to verify against a specific property.`,
                },
              ].map((item) => (
                <article key={item.label} className="rounded-[8px] bg-white/[0.045] p-5">
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-cyan-100/70">{item.label}</p>
                  <p className="mt-3 text-xs leading-6 text-white/55">{item.body}</p>
                </article>
              ))}
            </div>

            <div className="grid gap-3 rounded-[8px] bg-black/22 p-5 sm:grid-cols-3">
              {[
                {
                  label: 'Unknowns',
                  body: 'What the address condition, inspection, insurance, title, financing, and contract facts will show.',
                },
                {
                  label: 'Verification needs',
                  body: 'Confirm place assumptions, property condition, carrying costs, insurance, taxes, HOA details, and professional boundaries before relying on the signal.',
                },
                {
                  label: 'Questions to carry forward',
                  body: `Ask whether the property evidence supports the ${neighborhood.name} place story, not whether the neighborhood is ranked or recommended.`,
                },
              ].map((item) => (
                <article key={item.label}>
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/34">{item.label}</p>
                  <p className="mt-3 text-xs leading-6 text-white/55">{item.body}</p>
                </article>
              ))}
            </div>

            <div className="rounded-[8px] border border-cyan-100/10 bg-cyan-100/[0.035] p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100/72">Next-decision thresholds</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  { label: 'Review City Market evidence', href: cityMarketHref, note: 'Use when neighborhood signals need city-level context.' },
                  { label: 'Refine Search inventory', href: searchHref, note: 'Use when the next question is current property availability.' },
                  { label: 'Open a specific Property', href: searchHref, note: 'Use when condition, records, or costs now drive the decision.' },
                  { label: 'Prepare professional review', href: '/contact#advisory-readiness', note: 'Use when assumptions and verification questions are ready for Advisory.' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="reie-neighborhood-readiness-link rounded-[6px] bg-[#071017]/78 p-4 text-white no-underline transition hover:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-cyan-100/70"
                  >
                    <span className="text-[10px] font-black uppercase tracking-[0.14em] text-cyan-100/72">{item.label}</span>
                    <span className="mt-2 block text-xs leading-5 text-white/48">{item.note}</span>
                  </Link>
                ))}
              </div>
              <p className="mt-5 text-xs leading-6 text-white/42">
                Use the Market overview for broad comparison, and use Nearby Neighborhoods below to compare another Neighborhood
                without changing this page into a ranking or recommendation.
              </p>
              <p className="mt-3 text-xs leading-6 text-white/42">
                No ranking, suitability, safety, school-quality, investment, appreciation, provider, or AI conclusion is made here.
              </p>
            </div>
          </div>
        </section>

        <section
          id="neighborhood-verification-questions"
              className="reie-neighborhood-verification grid gap-6 rounded-[8px] bg-[#071017]/70 p-5 md:col-span-12 md:grid-cols-[0.78fr_1.22fr] md:p-8"
          data-testid="neighborhood-product-2-verification"
          data-neighborhood-product-2-verification-count={verificationQuestions.length}
          data-dxt-neighborhood-hierarchy-role="questions-to-verify"
        >
          <div>
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100/72">Verification Guidance</p>
            <h2 className="text-2xl font-black uppercase leading-tight tracking-normal text-white">
              What to verify before relying on neighborhood context.
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/52">{tradeoffSummary}</p>
          </div>
          <div className="grid gap-3">
            {verificationQuestions.map((question, index) => (
                <article key={question} className="reie-neighborhood-context-card rounded-[8px] bg-black/22 p-5">
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/32">Question {index + 1}</p>
                <p className="mt-3 text-sm font-semibold leading-7 text-white/72">{question}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          className="reie-neighborhood-boundaries grid gap-5 rounded-[8px] border border-cyan-100/10 bg-cyan-100/[0.04] p-5 md:col-span-12 md:grid-cols-[0.78fr_1.22fr] md:p-8"
          data-testid="dxt-wave-1d-neighborhood-place-orientation-boundaries"
          data-dxt-neighborhood-hierarchy-role="freshness-limitations-professional-boundaries"
          data-neighborhood-fair-housing-boundary="neutral-non-ranking"
          data-neighborhood-ai-advisory="false"
          data-neighborhood-provider-expansion="false"
          data-neighborhood-telemetry="false"
        >
          <div>
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100/72">Freshness And Boundaries</p>
            <h2 className="text-2xl font-black uppercase leading-tight tracking-normal text-white">
              Use neighborhood context as orientation, not a personal conclusion.
            </h2>
          </div>
          <div className="grid gap-3">
            {[
              neighborhoodBoundary,
              'Housing context, inventory signals, soil, insurance, altitude, access, and market context are prompts for verification at the address level.',
              'Confirm boundaries, condition, title, insurance, taxes, HOA details, inspection findings, financing assumptions, and contract risk through the appropriate professional review before relying on the signal.',
            ].map((boundary) => (
              <p key={boundary} className="rounded-[6px] bg-black/20 p-4 text-sm leading-7 text-white/58">
                {boundary}
              </p>
            ))}
          </div>
        </section>

        <section
          className="reie-neighborhood-continuation md:col-span-12"
          data-testid="neighborhood-djx-continuity"
          data-dxt-neighborhood-hierarchy-role="property-market-advisory-continuations"
        >
          <ContinueYourDecision
            stage="neighborhood"
            cameFrom={`${neighborhood.city} market context or property search`}
            currentDecision={`Decide what ${neighborhood.name} evidence can and cannot support.`}
            whyHere="This neighborhood page connects place orientation, market context, available property paths, confidence, and verification without scoring or recommending where someone should live."
            nextStep="Search current properties, compare the city market, or bring the verification questions into advisory review."
            links={[
              { label: 'Search This Neighborhood', href: searchHref, note: 'Current property path' },
              { label: 'City Market Context', href: cityMarketHref, note: 'Broader market context' },
              { label: 'Advisory Guidance', href: '/contact', note: 'Professional review' },
            ]}
          />
        </section>

        <section
          className="reie-neighborhood-route-continuity grid gap-6 rounded-[8px] bg-white/[0.04] p-5 md:col-span-12 md:grid-cols-[0.82fr_1.18fr] md:p-8"
          data-testid="dxt-neighborhood-continuity-implementation"
          data-dxt-market-family-continuity="neighborhood"
          data-dxt-market-family-hidden-context="false"
          data-dxt-market-family-persistence="false"
          data-dxt-market-family-telemetry="false"
          data-dxt-market-family-shared-state="false"
          data-dxt-market-family-map-provider-change="false"
          data-dxt-neighborhood-ranking="false"
          data-dxt-neighborhood-suitability="false"
        >
          <div>
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100/72">Continuity To Property</p>
            <h2 className="text-3xl font-black uppercase leading-tight tracking-normal text-white md:text-4xl">
              Let the neighborhood orient the review, then verify the address.
            </h2>
            <p className="mt-5 text-sm leading-7 text-white/58 md:text-base">
              Neighborhood context explains place organization and local verification questions. It does not rank places, determine fit, or
              transfer hidden context into Search, Property, Advisory, or Contact.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                label: 'Search owns property inventory',
                body: `Use the ${neighborhood.name} Search path to find active listings before opening address-level evidence.`,
                href: searchHref,
                action: 'Search This Neighborhood',
              },
              {
                label: 'Property owns address evaluation',
                body: 'Open a property from Search when the next decision depends on condition, records, costs, inspection, or contract facts.',
                href: searchHref,
                action: 'Find Properties In Search',
              },
              {
                label: 'City Market owns broad context',
                body: `Return to ${neighborhood.city} market evidence when the place signal needs city-level comparison.`,
                href: cityMarketHref,
                action: 'City Market Context',
              },
              {
                label: 'Advisory owns preparation',
                body: 'Bring verification questions into Advisory only after the place and property questions are clear.',
                href: '/contact#advisory-readiness',
                action: 'Prepare Advisory Questions',
              },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="reie-neighborhood-framework-link group rounded-[8px] bg-[#071017]/78 p-5 text-white no-underline ring-1 ring-white/[0.06] transition hover:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-cyan-100/70"
                data-testid="dxt-neighborhood-continuity-link"
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

        <section
          className="reie-neighborhood-market-workspace rounded-[8px] bg-cyan-100/[0.055] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)] md:col-span-12 md:p-8"
          data-testid="reie-market-v8-decision-workspace"
          data-market-v8-scope="neighborhood"
          data-market-v8-city={neighborhood.city}
          data-market-v8-neighborhood={neighborhood.name}
          data-market-v8-item-count={marketDecisionWorkspace.items.length}
          data-market-v8-ai="false"
          data-market-v8-forecasting="false"
          data-market-v8-gis="false"
          data-market-v8-telemetry="false"
        >
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/78">Market Decision Workspace</p>
              <h2 className="text-3xl font-black uppercase leading-tight tracking-normal text-white">
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
                    surface: 'neighborhood-market-v8-decision-workspace',
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
          </div>
        </section>

        <div
          id="neighborhood-market-evidence"
          className="reie-neighborhood-market-brief rounded-[8px] bg-white/[0.04] p-5 md:col-span-12 md:p-8"
          data-testid="cep-market-intelligence-summary"
          data-market-intelligence-scope="neighborhood"
          data-market-intelligence-city={neighborhood.city}
          data-market-intelligence-neighborhood={neighborhood.name}
          data-market-intelligence-inventory-label={marketExperience.inventoryLabel}
          data-market-intelligence-competitiveness={marketExperience.competitivenessLabel}
          data-market-intelligence-timing={marketExperience.timingLabel}
          data-market-intelligence-provider="none"
          data-market-intelligence-ai-generated="false"
          data-market-intelligence-gis-activated="false"
        >
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/72">
                Neighborhood Market Brief
              </p>
              <h2 className="text-3xl font-black uppercase leading-tight tracking-normal text-white">
                What this local signal means before you tour.
              </h2>
              <p className="mt-5 text-sm leading-7 text-white/58 md:text-base">{marketExperience.summary}</p>
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
          </div>

          <div className="mt-6 border-t border-white/10 pt-6">
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
              data-testid="cep-navigation-neighborhood-market-journey"
              data-cep-measurement-ready="true"
              data-cep-measurement-active="false"
            >
              <Link
                href="/market"
                className="reie-decision-link reie-decision-link--secondary flex min-h-12 items-center justify-center rounded-[6px] px-4 py-3 text-center text-[11px] font-black uppercase tracking-[0.12em] transition focus:outline-none focus:ring-2 focus:ring-cyan-100/70"
                {...getJourneyMeasurementAttributes({
                  surface: 'neighborhood-market-journey',
                  stage: 'market',
                  action: 'view-market',
                  destination: 'market',
                })}
              >
                All Markets
              </Link>
              <Link
                href={`/market/${normalizeRouteSegment(neighborhood.city)}-co-housing-market`}
                className="reie-decision-link reie-decision-link--secondary flex min-h-12 items-center justify-center rounded-[6px] px-4 py-3 text-center text-[11px] font-black uppercase tracking-[0.12em] transition focus:outline-none focus:ring-2 focus:ring-cyan-100/70"
                {...getJourneyMeasurementAttributes({
                  surface: 'neighborhood-market-journey',
                  stage: 'market',
                  action: 'view-market',
                  destination: 'market',
                })}
              >
                City Market Context
              </Link>
              <Link
                href={`/search?neighborhood=${encodeURIComponent(neighborhood.name)}`}
                className="reie-decision-link reie-decision-link--secondary flex min-h-12 items-center justify-center rounded-[6px] px-4 py-3 text-center text-[11px] font-black uppercase tracking-[0.12em] transition focus:outline-none focus:ring-2 focus:ring-cyan-100/70"
                {...getJourneyMeasurementAttributes({
                  surface: 'neighborhood-market-journey',
                  stage: 'market',
                  action: 'start-search',
                  destination: 'search',
                })}
              >
                Search This Neighborhood
              </Link>
            </div>
          </div>
        </div>

        <section
          className="grid gap-3 rounded-[8px] bg-cyan-100/[0.045] p-5 md:col-span-12 md:grid-cols-3"
          data-testid="reie-neighborhood-buyer-confidence"
          data-buyer-confidence-neighborhood-context="true"
          data-buyer-confidence-ai="false"
          data-buyer-confidence-gis="false"
          data-buyer-confidence-provider-activation="false"
        >
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100/72">Context</p>
            <p className="mt-2 text-sm leading-6 text-white/58">Use local context to test whether this neighborhood supports your practical decision questions and individual search criteria.</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100/72">Risk</p>
            <p className="mt-2 text-sm leading-6 text-white/58">Read insurance, soil, altitude, and inventory signals as questions to verify before touring or writing.</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100/72">Next</p>
            <p className="mt-2 text-sm leading-6 text-white/58">Compare this context with search results and property decision briefs before asking focused next-step questions.</p>
          </div>
        </section>

        <div className="md:col-span-12">
          <FinancingConfidenceEducation surface="neighborhood-market" />
        </div>

        <div className="reie-neighborhood-housing-card rounded-[8px] bg-white/[0.035] p-8 md:col-span-8 md:p-12">
          <div className="mb-8 flex items-center gap-4">
            <Hammer className="h-6 w-6 text-cyan-100" />
            <h2 className="text-2xl font-black uppercase tracking-tight">Housing Pattern And Property Diligence</h2>
          </div>
          <p className="mb-8 text-base font-medium leading-8 text-white/68 md:text-lg">{resilienceAdvice.analysis}</p>
          <div className="rounded-[8px] bg-black/20 p-5 text-sm leading-7 text-cyan-100/72">
            In {neighborhood.name}, construction diligence is used to separate visible finish quality from durable value, insurance exposure,
            and negotiation leverage before a customer relies on surface presentation.
          </div>
        </div>

        <div className="reie-neighborhood-access-card flex flex-col justify-between rounded-[8px] bg-white/[0.035] p-8 md:col-span-4 md:p-12">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <Zap className="h-4 w-4 fill-cyan-100 text-cyan-100" />
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-100/72">Practical Access Signal</span>
            </div>
            <div className="text-3xl font-black uppercase leading-tight tracking-tight text-white md:text-4xl">{neighborhood.primaryAnchor}</div>
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-white/40">Daily access context</p>
          </div>
          <p className="mt-8 text-sm leading-7 text-white/58">
            {neighborhood.name} should be reviewed through place anchor, property condition, and source freshness. Verification focus: {neighborhood.tacticalLever}
          </p>
        </div>

        <div className="grid gap-4 md:col-span-12 md:grid-cols-3">
          <div className="rounded-[8px] bg-white/[0.03] p-6">
            <ShieldCheck className="mb-4 h-5 w-5 text-cyan-100" />
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Altitude</p>
            <p className="text-lg font-black uppercase tracking-tight">{neighborhood.altitude.toLocaleString()} FT</p>
          </div>
          <div className="rounded-[8px] bg-white/[0.03] p-6">
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Soil Profile</p>
            <p className="text-lg font-black uppercase tracking-tight">{neighborhood.soilType}</p>
          </div>
          <div className="rounded-[8px] bg-white/[0.03] p-6">
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Insurance</p>
            <p className="text-lg font-black uppercase tracking-tight">{neighborhood.insuranceComplexity}</p>
          </div>
        </div>

        <div className="mt-12 md:col-span-12">
          <h3 className="mb-8 text-[11px] font-black uppercase italic tracking-[0.4em] text-white/20">Related Hubs</h3>
          <RelatedContent
            nodeId={neighborhood.slug}
            title={`${neighborhood.name} Authority Paths`}
            items={relatedLinks}
          />
          <section className="my-12 border-y border-white/10 py-12">
            <div className="mb-8 max-w-3xl">
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.35em] text-[#00ff80]">Neighborhood FAQ</p>
              <h2 className="text-2xl font-black italic uppercase tracking-tight text-white">
                {neighborhood.name} Intelligence Questions
              </h2>
            </div>

            <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2">
              {neighborhoodFaqs.slice(0, 4).map((faq) => (
                <article key={faq.question} className="bg-[#050505] p-6">
                  <h3 className="text-sm font-black uppercase leading-6 tracking-[0.12em] text-white">
                    {faq.question}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-white/55">{faq.answer}</p>
                </article>
              ))}
            </div>
          </section>
          <NearbyNeighborhoods city={neighborhood.city} currentSlug={neighborhood.slug} />
        </div>
      </section>
    </main>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/market/[city]/[slug]/page.tsx
