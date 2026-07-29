import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Hammer, ShieldCheck, Zap } from 'lucide-react';
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections.js';

import FinancingConfidenceEducation from '@/components/FinancingConfidenceEducation';
import NearbyNeighborhoods from '@/components/NearbyNeighborhoods';
import RelatedContent from '@/components/RelatedContent';
import FAQSchema from '@/components/schema/FAQSchema';
import { getJourneyMeasurementAttributes } from '@/lib/customerJourneyMeasurement';
import { buildLinkGraph } from '@/lib/linking/buildLinkGraph';
import { buildMarketDecisionWorkspace } from '@/lib/marketDecisionWorkspace';
import { buildNeighborhoodMarketExperience } from '@/lib/marketIntelligenceExperience';
import { getResilienceAdvice, neighborhoods, type Neighborhood } from '@/lib/neighborhoods';
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
  return Math.max(1, Math.round(neighborhood.resilienceScore / 12));
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
  return `David Quinn Group's ${neighborhood.name}, ${neighborhood.city}, Colorado intelligence report combines local real estate inventory signals, construction forensics, resilience scoring, and lifestyle efficiency strategy.`;
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
  return source === 'typesense' ? 'Live Indexed' : 'Model Signal';
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
      answer: `David Quinn Group evaluates ${neighborhood.name} through real estate intelligence, combining inventory state, construction diligence, resilience score, fire risk, insurance complexity, soil profile, altitude, lifestyle efficiency, and negotiation leverage.`,
    },
    {
      question: `Why does construction forensics matter in ${neighborhood.name}?`,
      answer: `Construction forensics matters in ${neighborhood.name} because visible finishes do not always explain long-term value. David Quinn Group reviews condition signals, building envelope exposure, drainage, mechanical systems, and future maintenance risk before treating comparable sales as the full answer.`,
    },
    {
      question: `How does the REIE resilience score affect ${neighborhood.name} strategy?`,
      answer: `${neighborhood.name} currently carries a resilience score of ${neighborhood.resilienceScore}/100. That score helps frame buyer diligence, seller positioning, insurance discussion, and which property risks deserve deeper review before negotiation.`,
    },
    {
      question: `What lifestyle signal defines ${neighborhood.name}?`,
      answer: `${neighborhood.name} is anchored by ${neighborhood.primaryAnchor}. David Quinn Group evaluates that lifestyle anchor alongside commute efficiency, neighborhood character, inventory depth, and the tactical lever: ${neighborhood.tacticalLever}`,
    },
    ...cityFaqs.slice(4, 6),
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
  const marketDecisionWorkspace = buildMarketDecisionWorkspace({
    scope: 'neighborhood',
    name: neighborhood.name,
    city: neighborhood.city,
    marketSignal: marketExperience.inventoryLabel,
    competitivenessSignal: marketExperience.competitivenessLabel,
    timingSignal: marketExperience.timingLabel,
    pricingSignal: `${neighborhood.resilienceScore}/100 resilience context`,
    inventorySignal: `${inventoryState.count} active inventory signal`,
    resilienceSignal: `${neighborhood.fireRisk} fire context, ${neighborhood.insuranceComplexity.toLowerCase()} insurance complexity, and ${neighborhood.soilType}`,
    searchHref,
    marketHref: cityMarketHref,
    sellerHref: '/sell',
  });

  return (
    <main className="min-h-screen bg-[#050505] font-inter text-white">
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

      <section className="relative border-b border-white/5 bg-[radial-gradient(circle_at_78%_12%,rgba(207,250,254,0.12),transparent_30%),linear-gradient(180deg,#071017,#050505)] px-6 py-12 md:px-12 md:py-16">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
        <div className="relative z-20 w-full max-w-7xl">
          <div className="mb-5 flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-cyan-100 shadow-[0_0_18px_rgba(207,250,254,0.45)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.32em] text-cyan-100/78">Neighborhood Market Context</span>
          </div>
          <h1 className="mb-6 max-w-6xl text-5xl font-black uppercase leading-[0.9] tracking-normal md:text-7xl">{neighborhood.name}</h1>
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <p className="max-w-2xl text-base leading-8 text-white/64 md:text-lg">
              Understand what this local market context may mean before you compare homes, evaluate property tradeoffs, or ask focused
              advisor questions.
            </p>
            <div className="grid grid-cols-2 overflow-hidden rounded-[8px] bg-white/[0.07] shadow-[0_20px_70px_rgba(0,0,0,0.28)]">
              <div className="p-5">
                <span className="mb-2 block text-[9px] font-black uppercase tracking-[0.18em] text-white/38">Inventory State</span>
                <span className="text-xl font-black uppercase tracking-tight text-white">{inventoryState.count} active</span>
                <span className="mt-2 block text-[9px] font-black uppercase tracking-[0.18em] text-cyan-100/70">
                {getInventorySourceLabel(inventoryState.source)}
              </span>
              </div>
              <div className="p-5">
                <span className="mb-2 block text-[9px] font-black uppercase tracking-[0.18em] text-white/38">Resilience</span>
                <span className="text-xl font-black uppercase tracking-tight text-white">{neighborhood.resilienceScore}/100</span>
              </div>
            </div>
          </div>
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            <div className="rounded-[8px] bg-white/[0.055] p-4">
              <p className="mb-2 text-[9px] font-black uppercase tracking-[0.18em] text-white/36">City Context</p>
              <p className="text-lg font-black uppercase tracking-tight text-white">{neighborhood.city}</p>
            </div>
            <div className="rounded-[8px] bg-white/[0.055] p-4">
              <p className="mb-2 text-[9px] font-black uppercase tracking-[0.18em] text-white/36">Timing</p>
              <p className="text-lg font-black uppercase tracking-tight text-white">{marketExperience.timingLabel}</p>
            </div>
            <div className="rounded-[8px] bg-white/[0.055] p-4">
              <p className="mb-2 text-[9px] font-black uppercase tracking-[0.18em] text-white/36">Attention</p>
              <p className="text-lg font-black uppercase tracking-tight text-white">{neighborhood.fireRisk}</p>
            </div>
          </div>
          <p
            className="mt-6 max-w-3xl text-xs leading-6 text-white/42"
            data-testid="market-source-disclaimer"
            data-market-sales-source-control="present"
            data-market-non-participation-disclaimer="present"
          >
            Neighborhood and market signals are market-wide REIE context from repository neighborhood data and public MLS/search signals
            where available. They do not state or imply that David Quinn, David Quinn Group, or Compass listed, sold, or participated in
            every reported property.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-12 md:p-12">
        <section
          className="rounded-[8px] bg-cyan-100/[0.055] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.22)] md:col-span-12 md:p-8"
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
          className="rounded-[8px] bg-white/[0.04] p-5 md:col-span-12 md:p-8"
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
                className="flex min-h-12 items-center justify-center rounded-[6px] bg-white/[0.04] px-4 py-3 text-center text-[11px] font-black uppercase tracking-[0.12em] text-white/64 no-underline transition hover:bg-cyan-100/10 hover:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-100/70"
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
                className="flex min-h-12 items-center justify-center rounded-[6px] bg-white/[0.04] px-4 py-3 text-center text-[11px] font-black uppercase tracking-[0.12em] text-white/64 no-underline transition hover:bg-cyan-100/10 hover:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-100/70"
                {...getJourneyMeasurementAttributes({
                  surface: 'neighborhood-market-journey',
                  stage: 'market',
                  action: 'view-market',
                  destination: 'market',
                })}
              >
                City Market
              </Link>
              <Link
                href={`/search?neighborhood=${encodeURIComponent(neighborhood.name)}`}
                className="flex min-h-12 items-center justify-center rounded-[6px] bg-white/[0.04] px-4 py-3 text-center text-[11px] font-black uppercase tracking-[0.12em] text-white/64 no-underline transition hover:bg-cyan-100/10 hover:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-100/70"
                {...getJourneyMeasurementAttributes({
                  surface: 'neighborhood-market-journey',
                  stage: 'market',
                  action: 'start-search',
                  destination: 'search',
                })}
              >
                Search Nearby
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
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100/72">Fit</p>
            <p className="mt-2 text-sm leading-6 text-white/58">Use local context to test whether this neighborhood supports daily life, access, and lifestyle priorities.</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100/72">Risk</p>
            <p className="mt-2 text-sm leading-6 text-white/58">Read resilience, insurance, soil, altitude, and inventory signals as questions to verify before touring or writing.</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100/72">Next</p>
            <p className="mt-2 text-sm leading-6 text-white/58">Compare this context with search results and property decision briefs before asking focused next-step questions.</p>
          </div>
        </section>

        <div className="md:col-span-12">
          <FinancingConfidenceEducation surface="neighborhood-market" />
        </div>

        <div className="border-l-4 border-l-[#00ff80] bg-white/[0.03] p-8 md:col-span-8 md:p-12">
          <div className="mb-8 flex items-center gap-4">
            <Hammer className="h-6 w-6 text-[#00ff80]" />
            <h2 className="text-2xl font-black uppercase italic tracking-tight">GC Intelligence: Construction DNA</h2>
          </div>
          <p className="mb-8 text-xl font-medium leading-relaxed text-white/70">{resilienceAdvice.analysis}</p>
          <div className="border border-white/10 bg-white/5 p-6 text-sm italic text-[#00ff80]">
            &quot;Strategy: In {neighborhood.name}, we use construction diligence to separate visible finish quality from durable value,
            insurance exposure, and negotiation leverage.&quot; - David Quinn
          </div>
        </div>

        <div className="flex flex-col justify-between bg-white/[0.03] p-8 md:col-span-4 md:p-12">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <Zap className="h-4 w-4 fill-[#00ff80] text-[#00ff80]" />
              <span className="text-[10px] font-black uppercase tracking-widest">Efficiency Signal</span>
            </div>
            <div className="text-7xl font-black italic tracking-tighter text-white md:text-8xl">{neighborhood.avgEfficiencyScore}</div>
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-white/40">Weekly Efficiency Rating</p>
          </div>
          <p className="mt-8 text-[11px] italic leading-relaxed text-white/60">
            {neighborhood.lifestyleVibe} The tactical lever is direct: {neighborhood.tacticalLever}
          </p>
        </div>

        <div className="grid gap-4 md:col-span-12 md:grid-cols-3">
          <div className="border border-white/10 bg-white/[0.02] p-6">
            <ShieldCheck className="mb-4 h-5 w-5 text-[#00ff80]" />
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Altitude</p>
            <p className="text-lg font-black italic">{neighborhood.altitude.toLocaleString()} FT</p>
          </div>
          <div className="border border-white/10 bg-white/[0.02] p-6">
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Soil Profile</p>
            <p className="text-lg font-black italic">{neighborhood.soilType}</p>
          </div>
          <div className="border border-white/10 bg-white/[0.02] p-6">
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Insurance</p>
            <p className="text-lg font-black italic">{neighborhood.insuranceComplexity}</p>
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
