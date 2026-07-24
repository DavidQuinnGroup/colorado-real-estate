import type { Metadata } from 'next';
import type { Prisma } from '@prisma/client';
import type { ReactNode } from 'react';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Camera,
  FileText,
  HardHat,
  Home,
  Mail,
  MapPin,
  Mountain,
  Ruler,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

import EquityVision from '@/components/EquityVision';
import PropertyInquiryForm from '@/components/PropertyInquiryForm';
import RelatedPropertyLinks from '@/components/RelatedPropertyLinks';
import ResilientListingImage from '@/components/ResilientListingImage';
import PropertyLinks from '@/components/internal-links/PropertyLinks';
import FAQSchema from '@/components/schema/FAQSchema';
import { getCityByName } from '@/lib/cities';
import { getBlogLinks } from '@/lib/linking/getBlogLinks';
import { getPropertyLinks } from '@/lib/linking/getPropertyLinks';
import { getListingFallbackPhotoUrl, getListingPhotoUrl } from '@/lib/listingVisuals';
import { neighborhoods } from '@/lib/neighborhoods';
import { prisma } from '@/lib/prisma';
import { LISTING_ADVERTISING_CLASSIFICATION } from '@/lib/publicTrust';
import type { FAQItem } from '@/lib/schema/faqSchema';
import { generateFAQs } from '@/lib/schema/generateFAQs';
import { buildPropertySchema } from '@/lib/schema/propertySchema';

const SITE_URL = 'https://davidquinngroup.com';

type PropertyPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type PropertyWithPhotos = Prisma.PropertyGetPayload<{
  include: {
    photos: {
      orderBy: {
        order: 'asc';
      };
    };
  };
}>;

type EquityVisionProperty = PropertyWithPhotos & {
  sqftAboveGrade: number;
  sqftBasementFinished: number;
  sqftBasementUnfinished: number;
  marketRate: number;
  gcAdjustments: number;
};

type SupabasePropertyPhotoRow = {
  id: string;
  propertyId: string;
  url: string;
  order: number;
};

type SupabasePropertyRow = Omit<PropertyWithPhotos, 'photos' | 'createdAt' | 'updatedAt' | 'lastIntelligenceSync'> & {
  createdAt: string;
  updatedAt: string;
  lastIntelligenceSync: string | null;
};

const PROPERTY_COLUMNS = [
  'id',
  'mlsId',
  'slug',
  'address',
  'city',
  'state',
  'zip',
  'price',
  'beds',
  'baths',
  'sqft',
  'lotSize',
  'yearBuilt',
  'propertyType',
  'status',
  'lat',
  'lng',
  'neighborhood',
  'subdivision',
  'schoolDistrict',
  'description',
  'listingAgent',
  'listingOffice',
  'createdAt',
  'updatedAt',
  'lastIntelligenceSync',
  'isPrivateExclusive',
  'gcForensics',
  'negotiationLevers',
  'optimizedValue',
  'efficiencyScore',
  'resilienceScore',
  'altitude',
  'soilType',
  'hasPolybutyleneRisk',
].join(',');

let cachedSupabaseClient: SupabaseClient | null = null;

function getSupabasePropertyClient() {
  if (cachedSupabaseClient) return cachedSupabaseClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase property fallback is missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  }

  cachedSupabaseClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cachedSupabaseClient;
}

function toPostgrestFilterValue(value: string) {
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > 200) return null;
  if (!/^[A-Za-z0-9._~-]+$/.test(trimmed)) return null;

  return trimmed;
}

async function fetchSupabasePropertyPhotos(client: SupabaseClient, propertyId: string) {
  const { data, error } = await client
    .from('PropertyPhoto')
    .select('id,propertyId,url,order')
    .eq('propertyId', propertyId)
    .order('order', { ascending: true });

  if (error) {
    throw new Error('Supabase property photo fallback failed.');
  }

  return ((data || []) as SupabasePropertyPhotoRow[]).map((photo) => ({
    id: photo.id,
    propertyId: photo.propertyId,
    url: photo.url,
    order: photo.order,
  }));
}

function mapSupabaseProperty(row: SupabasePropertyRow, photos: SupabasePropertyPhotoRow[]): PropertyWithPhotos {
  return {
    ...row,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
    lastIntelligenceSync: row.lastIntelligenceSync ? new Date(row.lastIntelligenceSync) : null,
    photos,
  } as PropertyWithPhotos;
}

async function getSupabaseProperty(id: string): Promise<PropertyWithPhotos | null> {
  const filterValue = toPostgrestFilterValue(id);
  if (!filterValue) return null;

  const client = getSupabasePropertyClient();
  const { data, error } = await client
    .from('Property')
    .select(PROPERTY_COLUMNS)
    .or(`id.eq.${filterValue},slug.eq.${filterValue},mlsId.eq.${filterValue}`)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error('Supabase property fallback failed.');
  }

  if (!data) return null;

  const row = data as unknown as SupabasePropertyRow;
  const photos = await fetchSupabasePropertyPhotos(client, row.id);

  return mapSupabaseProperty(row, photos);
}

function formatCurrency(value: number | null | undefined) {
  if (!value) return 'Price upon request';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) return 'N/A';

  return new Intl.NumberFormat('en-US').format(value);
}

function formatCompactCurrency(value: number | null | undefined) {
  if (!value) return 'Request';
  if (value >= 1000000) return `$${(value / 1000000).toFixed(value >= 10000000 ? 0 : 1)}M`;
  if (value >= 1000) return `$${Math.round(value / 1000)}K`;

  return `$${value.toLocaleString()}`;
}

function formatDateTime(value: Date | null | undefined) {
  if (!value) return 'Unavailable';
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'America/Denver',
  }).format(value);
}

function getAltitudeNarrative(altitude: number) {
  if (altitude > 6000) {
    return 'Higher-elevation settings can make roof, window, exterior, and mechanical questions worth discussing during normal diligence.';
  }

  return 'Front Range homes are commonly reviewed for drainage, roof age, mechanical systems, and exterior exposure before next steps.';
}

function getReviewSignal(property: PropertyWithPhotos) {
  if (property.hasPolybutyleneRisk) return 'Plumbing records to verify';
  if (property.soilType?.trim()) return property.soilType.trim();
  if (property.altitude) return 'Elevation Context';

  return 'Public Listing Context';
}

function getPrimaryPhoto(property: PropertyWithPhotos) {
  return getListingPhotoUrl({
    id: property.id,
    address: property.address,
    city: property.city,
    propertyType: property.propertyType,
    photos: property.photos,
  });
}

function normalize(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? '';
}

function getCityMarketHref(cityName: string | null | undefined) {
  const city = cityName || 'Boulder';
  const cityData = getCityByName(city);
  const marketSlug = cityData?.marketSlug ?? `${normalize(city).replace(/\s+/g, '-')}-co-housing-market`;

  return `/market/${marketSlug}`;
}

function getNeighborhoodHref(property: PropertyWithPhotos) {
  const city = normalize(property.city);
  const neighborhoodName = normalize(property.neighborhood);

  if (!city || !neighborhoodName) return null;

  const neighborhood = neighborhoods.find(
    (item) =>
      normalize(item.city) === city &&
      (normalize(item.name) === neighborhoodName || normalize(item.slug) === neighborhoodName),
  );

  return neighborhood ? `/market/${normalize(neighborhood.city)}/${neighborhood.slug}` : null;
}

function getPropertyBriefHref(property: PropertyWithPhotos) {
  return getBlogLinks({
    city: property.city || undefined,
    neighborhood: property.neighborhood || undefined,
    limit: 1,
  })[0]?.href ?? getBlogLinks({ city: property.city || undefined, limit: 1 })[0]?.href ?? null;
}

function getPrimaryStatLabel(property: PropertyWithPhotos) {
  const pieces = [
    property.propertyType || 'Residential',
    property.status || null,
    property.neighborhood || null,
  ].filter(Boolean);

  return pieces.join(' / ');
}

function getPricePerSquareFoot(property: PropertyWithPhotos) {
  if (!property.price || !property.sqft) return 'Not enough data';
  return `${formatCurrency(Math.round(property.price / property.sqft))} / SQ FT`;
}

function getDiligencePosture(property: PropertyWithPhotos) {
  if (property.hasPolybutyleneRisk) return 'Plumbing records';
  if (property.yearBuilt && property.yearBuilt < 1980) return 'Era review';
  if (property.lotSize) return 'Site review';
  return 'Standard questions';
}

function getDecisionNextStep(property: PropertyWithPhotos) {
  if (property.hasPolybutyleneRisk) return 'Ask what records are available about plumbing history and what should be verified by an appropriate professional.';
  if (!property.sqft || !property.price) return 'Confirm the missing core facts before comparing this property with other options.';
  if (property.yearBuilt && property.yearBuilt < 1980) return 'Use the age, systems, and listing details to prepare focused questions before touring or writing.';
  return 'Compare the core facts, review public context, and decide what should be verified before moving forward.';
}

function getDecisionTone(property: PropertyWithPhotos) {
  if (property.hasPolybutyleneRisk) return 'Records to Verify';
  if (property.yearBuilt && property.yearBuilt < 1980) return 'Context to Understand';
  if (property.lotSize) return 'Details to Compare';
  return 'Property Brief Ready';
}

function formatLotSize(value: number | null | undefined) {
  if (!value) return 'Not provided in public listing data';
  const formatted = value >= 1 ? value.toFixed(value >= 10 ? 1 : 2) : value.toFixed(2);
  return `${formatted.replace(/\.?0+$/, '')} acres`;
}

function getPublicConstructionFacts(property: PropertyWithPhotos) {
  return [
    { label: 'Year Built', value: property.yearBuilt ? String(property.yearBuilt) : 'Not provided in public listing data' },
    { label: 'Property Type', value: property.propertyType || 'Not provided in public listing data' },
    { label: 'Lot Size', value: formatLotSize(property.lotSize) },
    { label: 'Listing Status', value: property.status || 'Not provided in public listing data' },
    { label: 'Area Context', value: property.neighborhood || property.city || 'Colorado' },
    {
      label: 'Elevation Context',
      value: property.altitude ? `${formatNumber(property.altitude)} ft, verify if site-specific elevation matters` : 'Not provided in public listing data',
    },
    {
      label: 'Soil Text',
      value: property.soilType?.trim() || 'Not provided in public listing data',
    },
  ];
}

const CONSTRUCTION_CONTEXT_ITEMS = [
  'Construction era can shape which systems, records, and updates deserve closer review.',
  'Roofing, windows, exterior materials, and drainage are practical ownership questions in Colorado conditions.',
  'Mechanical, electrical, and plumbing information is often incomplete in public listing data and should be verified before relying on it.',
];

const CONSTRUCTION_VERIFICATION_QUESTIONS = [
  'What is known about the roof age, material, warranties, and repair history?',
  'When were the heating and cooling systems installed and last serviced?',
  'What electrical service and panel information is documented?',
  'What plumbing materials are present, and have any replacements been recorded?',
  'Are drainage, foundation, grading, sewer, septic, well, or water-source records available?',
  'Are permits available for additions or major remodeling?',
  'What is documented about the windows and exterior envelope?',
];

function getListingRemarkMentions(description: string | null | undefined) {
  const normalizedDescription = description?.toLowerCase() || '';
  if (!normalizedDescription) return ['No construction feature mentions were available in the public listing remarks.'];

  const mentionGroups = [
    { label: 'Roofing', terms: ['roof', 'shingle', 'metal roof', 'tile roof', 'tpo'] },
    { label: 'Heating or cooling', terms: ['furnace', 'boiler', 'radiant', 'heat pump', 'mini split', 'mini-split', 'central air', 'air conditioning'] },
    { label: 'Electrical service', terms: ['electrical', 'panel', 'amp', 'ev charger', '50-amp', '200 amp'] },
    { label: 'Plumbing or water systems', terms: ['plumbing', 'water heater', 'well', 'septic', 'sewer', 'piping'] },
    { label: 'Windows or exterior envelope', terms: ['window', 'siding', 'stucco', 'brick', 'hardie', 'insulation'] },
    { label: 'Permits or remodeling', terms: ['permit', 'remodel', 'renovated', 'updated', 'addition'] },
  ];

  const matches = mentionGroups
    .filter((group) => group.terms.some((term) => normalizedDescription.includes(term)))
    .map((group) => group.label);

  if (!matches.length) return ['Listing remarks do not call out these systems directly; verify records independently.'];

  return matches.map((label) => `${label} mentioned in the listing remarks; verify independently.`);
}

async function getProperty(id: string) {
  try {
    const property = await prisma.property.findFirst({
      where: {
        OR: [{ id }, { slug: id }, { mlsId: id }],
      },
      include: {
        photos: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return property || getSupabaseProperty(id);
  } catch (error) {
    console.error('[property-page] Prisma lookup failed; attempting Supabase REST fallback:', error instanceof Error ? error.message : 'unknown error');

    return getSupabaseProperty(id);
  }
}

function buildEquityVisionProperty(property: PropertyWithPhotos): EquityVisionProperty {
  return {
    ...property,
    sqftAboveGrade: property.sqft || 0,
    sqftBasementFinished: 0,
    sqftBasementUnfinished: 0,
    marketRate: property.sqft && property.price ? Math.round(property.price / property.sqft) : 850,
    gcAdjustments: property.optimizedValue && property.price ? property.optimizedValue - property.price : 0,
  };
}

function getPropertyUrl(property: PropertyWithPhotos) {
  return `${SITE_URL}/properties/${property.slug || property.id}`;
}

function getPropertyFaqs(property: PropertyWithPhotos): FAQItem[] {
  const cityFaqs = generateFAQs(property.city || 'Colorado', 'property-intelligence');
  const neighborhoodContext = property.neighborhood ? ` in ${property.neighborhood}` : '';
  const priceContext = property.price ? ` at ${formatCurrency(property.price)}` : '';

  return [
    {
      question: `What does David Quinn Group evaluate for ${property.address}?`,
      answer: `David Quinn Group frames ${property.address}${neighborhoodContext} through price context, public listing facts, property questions, and market context so buyers can decide what deserves closer review.`,
    },
    {
      question: `Why does construction diligence matter for ${property.address}?`,
      answer: `Construction diligence matters because visible finishes do not answer every practical question. Buyers should treat public listing data as a starting point and verify drainage, exterior exposure, mechanical age, soil context, altitude, maintenance history, and inspection scope with appropriate professionals before relying only on comparable sales.`,
    },
    {
      question: `How should buyers interpret this ${property.city} property${priceContext}?`,
      answer: `Buyers should compare this property against active inventory, neighborhood context, condition questions, inspection priorities, and timing needs before deciding whether to take a closer look.`,
    },
    {
      question: `How should sellers use property intelligence for a home like ${property.address}?`,
      answer: `Sellers should use property intelligence to prepare for likely buyer questions, review competing inventory, understand documentation needs, and decide which preparation items may improve clarity before launch or negotiation.`,
    },
    ...cityFaqs.slice(4, 6),
  ];
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    return {
      title: 'Property Not Found | David Quinn Group',
    };
  }

  const canonicalUrl = getPropertyUrl(property);
  const primaryPhoto = getPrimaryPhoto(property);

  return {
    title: `${property.address} | ${property.city}, CO Real Estate Intelligence`,
    description: `David Quinn Group property brief for ${property.address} in ${property.city}, Colorado, including price, listing facts, construction perspective, and neighborhood context.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${property.address} | ${property.city}, CO Real Estate Intelligence`,
      description: `Property brief for ${property.address} in ${property.city}, Colorado from David Quinn Group.`,
      url: canonicalUrl,
      siteName: 'David Quinn Group',
      locale: 'en_US',
      type: 'article',
      images: primaryPhoto ? [{ url: primaryPhoto, alt: `${property.address} in ${property.city}, Colorado` }] : undefined,
    },
  };
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) notFound();

  const primaryPhoto = getPrimaryPhoto(property);
  const fallbackPhoto = getListingFallbackPhotoUrl({
    id: property.id,
    address: property.address,
    city: property.city,
    propertyType: property.propertyType,
    price: property.price,
  });
  const isContracted = false;
  const altitude = property.altitude || 5280;
  const soilType = property.soilType || 'Front Range Mixed';
  const reviewSignal = getReviewSignal(property);
  const equityProperty = buildEquityVisionProperty(property);
  const propertySchema = buildPropertySchema(property);
  const propertySchemaGraph = propertySchema['@graph'];
  const propertyFaqs = getPropertyFaqs(property);
  const canonicalUrl = getPropertyUrl(property);
  const cityMarketHref = getCityMarketHref(property.city);
  const neighborhoodHref = getNeighborhoodHref(property);
  const briefHref = getPropertyBriefHref(property);
  const primaryStatLabel = getPrimaryStatLabel(property);
  const pricePerSquareFoot = getPricePerSquareFoot(property);
  const diligencePosture = getDiligencePosture(property);
  const decisionNextStep = getDecisionNextStep(property);
  const decisionTone = getDecisionTone(property);
  const publicConstructionFacts = getPublicConstructionFacts(property);
  const listingRemarkMentions = getListingRemarkMentions(property.description);
  const propertyLinks = await getPropertyLinks({
    id: property.id,
    city: property.city,
    neighborhood: property.neighborhood,
  });
  const relatedListings = [...propertyLinks.neighborhoodHomes, ...propertyLinks.cityHomes];

  return (
    <main className="min-h-screen overflow-y-auto bg-[#070b10] text-white">
      <script
        type="application/ld+json"
        data-testid="reie-property-schema"
        data-property-schema-type="SingleFamilyResidence"
        data-property-schema-url={canonicalUrl}
        data-property-schema-id={property.id}
        data-property-schema-slug={property.slug ?? ""}
        data-property-schema-mls-id={property.mlsId ?? ""}
        data-property-schema-address={property.address}
        data-property-schema-city={property.city}
        data-property-schema-neighborhood={property.neighborhood ?? ""}
        data-property-schema-price={property.price}
        data-property-schema-photo-count={property.photos?.length ?? 0}
        data-property-schema-graph-count={propertySchemaGraph.length}
        data-property-schema-has-offer="true"
        data-property-schema-has-breadcrumb="true"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(propertySchema) }}
      />
      <FAQSchema faqs={propertyFaqs} pageUrl={canonicalUrl} />
      <style>{`
        @media (min-width: 768px) {
          .reie-property-mobile-actions {
            display: none !important;
          }
        }
      `}</style>
      <section className="relative border-b border-white/10">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(100,188,205,0.14),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.035),transparent_35%)]" />
        <div className="reie-property-hero-grid relative mx-auto grid min-h-[620px] max-w-[1500px] grid-cols-1 gap-0 lg:min-h-[720px] lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="relative min-h-[500px] overflow-hidden bg-[#101720] sm:min-h-[560px] lg:min-h-[720px]">
            <ResilientListingImage
              src={primaryPhoto}
              fallbackSrc={fallbackPhoto}
              alt={property.address}
              loading="eager"
              fetchPriority="high"
              fallbackLabel="Property visual"
              className="absolute inset-0 h-full w-full object-cover opacity-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070b10] via-[#070b10]/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#070b10]/88 via-[#070b10]/18 to-transparent" />

            <div className="absolute left-4 right-4 top-4 flex flex-wrap items-center justify-between gap-2 md:left-8 md:right-8 md:top-5 md:gap-4">
              <Link
                href="/search"
                className="inline-flex items-center gap-2 rounded-[6px] border border-white/14 bg-[#071017]/76 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-white/70 backdrop-blur transition hover:border-cyan-100/40 hover:text-cyan-100"
              >
                <ArrowLeft size={14} aria-hidden="true" />
                Search
              </Link>
              <span className="max-w-[calc(100vw-2rem)] rounded-[6px] border border-white/14 bg-[#071017]/76 px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-cyan-100 backdrop-blur md:tracking-[0.16em]">
                Decision Workspace
              </span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 pb-6 md:p-8 lg:p-12">
              <div className="max-w-4xl">
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-[5px] border border-white/18 bg-white/12 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-white/84 backdrop-blur">
                    {primaryStatLabel}
                  </span>
                  {property.isPrivateExclusive ? (
                    <span className="rounded-[5px] border border-cyan-100/40 bg-cyan-100/12 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-cyan-100 backdrop-blur">
                      Listing Access
                    </span>
                  ) : null}
                </div>
                <p className="font-serif text-[36px] font-black leading-none text-white sm:text-[42px] md:text-[64px]">
                  {formatCurrency(property.price)}
                </p>
                <h1 className="mt-4 max-w-4xl text-[26px] font-black uppercase leading-tight tracking-normal text-white sm:text-3xl md:mt-5 md:text-5xl">
                  {property.address}
                </h1>
                <p className="mt-4 flex flex-wrap items-center gap-2 text-[12px] font-black uppercase tracking-[0.16em] text-white/64">
                  <MapPin size={15} aria-hidden="true" className="text-cyan-100/78" />
                  {property.city}, {property.state} {property.zip}
                </p>
                <div className="mt-6 grid max-w-2xl grid-cols-3 gap-2">
                  <HeroFact icon={<BedDouble size={14} />} label="Beds" value={formatNumber(property.beds)} />
                  <HeroFact icon={<Bath size={14} />} label="Baths" value={formatNumber(property.baths)} />
                  <HeroFact icon={<Ruler size={14} />} label="Sq Ft" value={formatNumber(property.sqft)} />
                </div>
              </div>
            </div>
          </div>

          <aside className="border-t border-white/10 bg-[#070b10] p-4 sm:p-5 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-l lg:border-t-0">
            <section className="overflow-hidden rounded-[8px] border border-cyan-100/22 bg-cyan-100/[0.075]">
              <div className="border-b border-cyan-100/14 bg-cyan-100/[0.07] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/76">Decision Workspace</p>
                    <p className="mt-2 text-sm font-black uppercase tracking-[0.08em] text-white">{decisionTone}</p>
                  </div>
                  <span className="shrink-0 rounded-[5px] border border-cyan-100/24 bg-black/24 px-2 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-cyan-100/76">
                    Property Brief
                  </span>
                </div>
              </div>
              <div className="p-4">
                <DecisionLensLabel lens="Understand" question="What am I looking at?" />
                <div className="grid gap-3">
                  <DecisionRow label="Price Basis" value={pricePerSquareFoot} />
                  <DecisionRow label="Property Type" value={property.propertyType || 'Residential'} />
                  <DecisionRow label="Status" value={property.status || 'Active'} />
                </div>
                <p className="mt-4 border-t border-cyan-100/14 pt-4 text-sm leading-6 text-white/66">{decisionNextStep}</p>
                <div className="reie-property-advisor-actions mt-4 grid gap-2">
                  <Link
                    href="#property-contact"
                    className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-[6px] bg-cyan-100 px-3 py-3 text-[10px] font-black uppercase tracking-[0.12em] text-[#061017] transition hover:bg-white"
                  >
                    Ask About This Property
                    <Mail size={13} aria-hidden="true" />
                  </Link>
                  <Link
                    href={cityMarketHref}
                    className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-[6px] border border-white/10 bg-white/[0.055] px-3 py-2.5 text-[10px] font-black uppercase tracking-[0.12em] text-white/72 transition hover:border-cyan-100/35 hover:text-cyan-100"
                  >
                    Market Context
                    <TrendingUp size={13} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </section>

            <div className="mt-4 rounded-[8px] border border-white/10 bg-[#0d141c] p-4">
              <DecisionLensLabel lens="Compare" question="How does this compare with other homes?" />
              <div className="mt-4 grid grid-cols-2 gap-3">
                <SignalTile icon={<TrendingUp size={16} />} label="Price Basis" value={pricePerSquareFoot} tone="cyan" />
                <SignalTile icon={<ShieldCheck size={16} />} label="Location" value={property.neighborhood || property.city || 'Colorado'} tone="white" />
              </div>
              <div className="mt-3 rounded-[6px] border border-white/10 bg-white/[0.045] p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/40">Review Context</p>
                <p className="mt-2 truncate text-sm font-black uppercase tracking-[0.08em] text-cyan-100">{reviewSignal}</p>
              </div>
              <p className="mt-3 text-xs leading-5 text-white/46">
                Comparison context uses public listing facts only. Verify condition, systems, and location tradeoffs before making decisions.
              </p>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <FactTile icon={<BedDouble size={15} />} label="Beds" value={formatNumber(property.beds)} />
              <FactTile icon={<Bath size={15} />} label="Baths" value={formatNumber(property.baths)} />
              <FactTile icon={<Ruler size={15} />} label="Sq Ft" value={formatNumber(property.sqft)} />
            </div>

            <section className="mt-4 rounded-[8px] border border-white/10 bg-[#0d141c] p-4">
              <DecisionLensLabel lens="Discuss" question="What should I discuss with my advisor?" />
              <div className="mt-4 grid gap-2">
                <AuthorityLink href={cityMarketHref} eyebrow="Market Context" label={`${property.city || 'Colorado'} Market Brief`} />
                {neighborhoodHref ? (
                  <AuthorityLink href={neighborhoodHref} eyebrow="Neighborhood Context" label={`${property.neighborhood} Area Guide`} />
                ) : null}
                {briefHref ? <AuthorityLink href={briefHref} eyebrow="Property Brief" label="Additional Context" /> : null}
              </div>
            </section>

            <section className="mt-4 rounded-[8px] border border-white/10 bg-[#0d141c] p-4">
              <DecisionLensLabel lens="Evaluate" question="Why does this matter?" />
              <h2 className="flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.12em] text-white">
                <Mountain className="text-cyan-100" size={17} /> Construction Perspective
              </h2>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4 border-b border-white/10 pb-2">
                  <span className="text-white/45">Elevation</span>
                  <span className="font-bold text-white">{formatNumber(altitude)} FT</span>
                </div>
                <div className="flex justify-between gap-4 border-b border-white/10 pb-2">
                  <span className="text-white/45">Soil Profile</span>
                  <span className="truncate font-bold text-white">{soilType}</span>
                </div>
                <p className="pt-1 text-sm leading-6 text-white/56">{getAltitudeNarrative(altitude)}</p>
              </div>
            </section>

            <section className="mt-4 rounded-[8px] border border-amber-200/24 bg-amber-200/8 p-4">
              <DecisionLensLabel lens="Investigate" question="What deserves a closer look?" />
              <h2 className="flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.12em] text-amber-100">
                <ShieldAlert size={17} /> Questions Worth Asking
              </h2>
              <ul className="mt-4 space-y-2 text-xs font-bold uppercase tracking-[0.12em] text-white/62">
                {property.hasPolybutyleneRisk ? <li>Ask what plumbing records are available and what should be verified by an appropriate professional</li> : null}
                <li>What drainage and grading records are available?</li>
                <li>What mechanical age and electrical service information is documented?</li>
              </ul>
            </section>

            {!isContracted ? (
              <div className="mt-4 rounded-[8px] border border-cyan-100/26 bg-cyan-100/10 p-4">
                <HardHat className="text-cyan-100" size={24} />
                <h2 className="mt-3 text-[15px] font-black uppercase tracking-[0.08em] text-white">Property Questions Welcome</h2>
                <p className="mt-2 text-sm leading-6 text-white/62">
                  Use the public facts on this page to prepare focused questions before a direct conversation.
                </p>
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="mb-6 flex flex-col justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100/76">
              <ShieldCheck size={14} aria-hidden="true" />
              Property Intelligence Foundation
            </p>
            <h2 className="mt-3 text-2xl font-black uppercase tracking-tight text-white md:text-4xl">
              A decision workspace for understanding the property
            </h2>
          </div>
          <div className="grid grid-cols-3 overflow-hidden rounded-[8px] border border-white/10 bg-[#0d141c] text-center md:min-w-[380px]">
            <SnapshotTile label="Price" value={formatCompactCurrency(property.price)} />
            <SnapshotTile label="Basis" value={pricePerSquareFoot} />
            <SnapshotTile label="Review" value={decisionTone} />
          </div>
        </div>

        <div className="reie-property-detail-grid grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            <section className="overflow-hidden rounded-[8px] border border-white/10 bg-[#0d141c]">
              <div className="border-b border-white/10 bg-white/[0.035] p-5 md:p-6">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                  <div>
                    <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/76">
                      <FileText size={14} aria-hidden="true" />
                      Understand
                    </p>
                    <h2 className="mt-3 text-xl font-black uppercase tracking-tight text-white md:text-2xl">
                      Property brief translated into next-step questions
                    </h2>
                  </div>
                  <span className="inline-flex h-8 items-center rounded-[6px] border border-cyan-100/22 bg-cyan-100/[0.08] px-3 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100">
                    {diligencePosture}
                  </span>
                </div>
              </div>
              <div className="p-5 md:p-8">
                <p className="max-w-4xl text-base leading-8 text-white/70">
                  {property.description ||
                    `${property.address} is an active Colorado listing with public facts, location context, and construction-informed questions to consider before next steps.`}
                </p>
                <div className="mt-6 grid gap-3 md:grid-cols-3">
                  <BriefSignalTile label="Review" value={reviewSignal} />
                  <BriefSignalTile label="Compare" value={`${property.propertyType || 'Residential'} / ${property.status || 'Active'} / ${pricePerSquareFoot}`} />
                  <BriefSignalTile label="Next Step" value={decisionNextStep} />
                </div>
              </div>
            </section>

            <section
              className="overflow-hidden rounded-[8px] border border-cyan-100/16 bg-[#0d141c]"
              data-testid="reie-property-construction-intelligence"
              data-construction-public-fact-count={publicConstructionFacts.length}
              data-construction-question-count={CONSTRUCTION_VERIFICATION_QUESTIONS.length}
              data-construction-remark-mention-count={listingRemarkMentions.length}
            >
              <div className="border-b border-white/10 bg-white/[0.035] p-5 md:p-6">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                  <div>
                    <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/76">
                      <HardHat size={14} aria-hidden="true" />
                      Construction Questions
                    </p>
                    <h2 className="mt-3 text-xl font-black uppercase tracking-tight text-white md:text-2xl">
                      Systems and records to verify
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-white/58">
                      Public listing information is a starting point. Confirm condition, systems, permits, costs, and code questions with the appropriate inspectors, contractors, engineers, or other licensed professionals.
                    </p>
                  </div>
                  <span className="inline-flex h-8 items-center rounded-[6px] border border-cyan-100/22 bg-cyan-100/[0.08] px-3 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100">
                    Public Context
                  </span>
                </div>
              </div>

              <div className="grid gap-4 p-5 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:p-6">
                <div className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.18em] text-white/70">
                    Known From Public Listing Data
                  </h3>
                  <dl className="mt-4 grid gap-3">
                    {publicConstructionFacts.map((fact) => (
                      <div key={fact.label} className="grid gap-1 border-b border-white/10 pb-3 last:border-b-0 last:pb-0">
                        <dt className="text-[10px] font-black uppercase tracking-[0.14em] text-cyan-100/54">{fact.label}</dt>
                        <dd className="text-sm font-bold leading-6 text-white/72">{fact.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.18em] text-white/70">
                      General Construction Context
                    </h3>
                    <ul className="mt-4 space-y-2 text-sm leading-6 text-white/58">
                      {CONSTRUCTION_CONTEXT_ITEMS.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.18em] text-white/70">
                      Mentioned in Listing Remarks
                    </h3>
                    <ul className="mt-4 space-y-2 text-sm leading-6 text-white/58">
                      {listingRemarkMentions.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 p-5 md:p-6">
                <h3 className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-100">
                  Questions to Verify
                </h3>
                <ul className="mt-4 grid gap-3 md:grid-cols-2">
                  {CONSTRUCTION_VERIFICATION_QUESTIONS.map((question) => (
                    <li key={question} className="rounded-[6px] border border-amber-100/14 bg-amber-100/[0.055] p-3 text-sm leading-6 text-white/64">
                      {question}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

          {property.photos.length > 1 ? (
            <section className="overflow-hidden rounded-[8px] border border-white/10 bg-[#0d141c]">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 bg-white/[0.035] p-5">
                <div>
                  <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-white/50">
                    <Camera size={14} aria-hidden="true" />
                    Listing Media
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/48">Secondary photos for condition, layout, and finish review.</p>
                </div>
                <p className="shrink-0 rounded-[6px] border border-white/10 bg-black/24 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-white/54">
                  {property.photos.length} Photos
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-4">
                {property.photos.slice(1, 5).map((photo) => (
                  <div key={photo.id} className="relative aspect-[4/3] overflow-hidden rounded-[6px] border border-white/10 bg-[#101720]">
                    <ResilientListingImage
                      src={photo.url}
                      fallbackSrc={fallbackPhoto}
                      alt={`${property.address} listing photo`}
                      loading="eager"
                      fallbackLabel="Photo unavailable"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          ) : null}
          </div>

          <aside className="space-y-6">
          <section className="rounded-[8px] border border-cyan-100/20 bg-cyan-100/[0.06] p-4">
            <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100/76">
              <ShieldCheck size={14} aria-hidden="true" />
              Discuss
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <ActionMetric label="Question" value={decisionTone} />
              <ActionMetric label="Focus" value={diligencePosture} />
            </div>
            <p className="mt-4 border-t border-cyan-100/14 pt-4 text-sm leading-6 text-white/58">
              Use the inquiry form to share timing, tour intent, and property-specific questions. Do not submit confidential negotiation details here.
            </p>
          </section>

          <PropertyInquiryForm
            propertyId={property.id}
            address={property.address}
            city={property.city}
            state={property.state}
          />

          <section className="overflow-hidden rounded-[8px] border border-white/10 bg-[#0d141c]">
            <div className="border-b border-white/10 bg-white/[0.035] p-5">
              <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-white/46">
                <Home size={14} aria-hidden="true" />
                Listing Facts
              </p>
              <p className="mt-2 text-sm leading-6 text-white/50">Core listing facts used for inquiry and buyer review.</p>
            </div>
            <div className="grid grid-cols-2 gap-2 p-4">
              <SnapshotTile label="Price" value={formatCompactCurrency(property.price)} />
              <SnapshotTile label="Status" value={property.status || 'Active'} />
              <SnapshotTile label="Type" value={property.propertyType || 'Residential'} />
              <SnapshotTile label="MLS" value={property.mlsId || property.id} />
            </div>
          </section>

          <section
            className="overflow-hidden rounded-[8px] border border-white/10 bg-[#0d141c]"
            data-testid="listing-advertising-attribution"
            data-listing-advertising-classification={LISTING_ADVERTISING_CLASSIFICATION}
            data-listing-source-authority="MLS_PROVIDER_REVIEW_REQUIRED"
            data-listing-compass-url-available="false"
            data-listing-photo-rights-review="MLS_PROVIDER_REVIEW_REQUIRED"
          >
            <div className="border-b border-white/10 bg-white/[0.035] p-5">
              <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-white/46">
                <FileText size={14} aria-hidden="true" />
                Listing Attribution Review
              </p>
              <p className="mt-2 text-sm leading-6 text-white/50">
                Property advertising attribution is displayed from stored listing fields and remains subject to listing-source review.
              </p>
            </div>
            <div className="grid gap-2 p-4">
              <SnapshotTile label="MLS Source" value={property.mlsId ? `MLS ${property.mlsId}` : 'MLS review required'} />
              <SnapshotTile label="Listing Brokerage" value={property.listingOffice || 'Unavailable'} />
              <SnapshotTile label="Listing Broker" value={property.listingAgent || 'Unavailable'} />
              <SnapshotTile label="Updated" value={formatDateTime(property.updatedAt)} />
              <SnapshotTile label="Sync Time" value={formatDateTime(property.lastIntelligenceSync)} />
            </div>
            <p className="border-t border-white/10 px-4 py-3 text-xs leading-5 text-white/42">
              Information is compiled from sources deemed reliable but may contain errors, omissions, price/status changes, sale, or
              withdrawal. Measurements and listing facts require independent verification.
            </p>
          </section>

          <EquityVision property={equityProperty} />
          </aside>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
        <RelatedPropertyLinks
          city={property.city || 'Colorado'}
          neighborhood={property.neighborhood}
          authorityLinks={propertyLinks.authorityLinks}
        />
        <section className="my-14 rounded-[8px] border border-white/10 bg-[#0d141c] p-6 md:p-8">
          <div className="mb-8 max-w-3xl">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/76">Discuss</p>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white">
              Questions for a Better Property Conversation
            </h2>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {propertyFaqs.slice(0, 4).map((faq) => (
              <article key={faq.question} className="rounded-[6px] border border-white/10 bg-white/[0.045] p-5">
                <h3 className="text-sm font-black uppercase leading-6 tracking-[0.08em] text-white">
                  {faq.question}
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/58">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>
        <PropertyLinks
          currentPropertyId={property.id}
          city={property.city}
          neighborhood={property.neighborhood ?? undefined}
          listings={relatedListings}
          authorityLinks={propertyLinks.authorityLinks}
          title={`${property.city || 'Colorado'} Related Property Links`}
        />
      </section>
      <nav
        className="reie-property-mobile-actions fixed inset-x-0 bottom-0 z-[900] border-t border-white/12 bg-[#071017]/94 p-2 shadow-2xl backdrop-blur md:hidden"
        style={{ bottom: 0, left: 0, padding: 8, position: 'fixed', right: 0, zIndex: 900 }}
        aria-label="Property actions"
      >
        <div className="grid grid-cols-3 gap-2" style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
          <Link
            href="/search"
            className="inline-flex h-11 items-center justify-center gap-1.5 rounded-[6px] border border-white/10 bg-white/[0.055] text-[10px] font-black uppercase tracking-[0.12em] text-white/72"
            style={{ alignItems: 'center', display: 'inline-flex', height: 44, justifyContent: 'center' }}
          >
            <ArrowLeft size={13} aria-hidden="true" />
            Search
          </Link>
          <Link
            href={cityMarketHref}
            className="inline-flex h-11 items-center justify-center gap-1.5 rounded-[6px] border border-white/10 bg-white/[0.055] text-[10px] font-black uppercase tracking-[0.12em] text-white/72"
            style={{ alignItems: 'center', display: 'inline-flex', height: 44, justifyContent: 'center' }}
          >
            <TrendingUp size={13} aria-hidden="true" />
            Market
          </Link>
          <Link
            href="#property-contact"
            className="inline-flex h-11 items-center justify-center gap-1.5 rounded-[6px] bg-cyan-100 text-[10px] font-black uppercase tracking-[0.12em] text-[#061017]"
            style={{ alignItems: 'center', display: 'inline-flex', height: 44, justifyContent: 'center' }}
          >
            <Mail size={13} aria-hidden="true" />
            Ask
          </Link>
        </div>
      </nav>
    </main>
  );
}

function SignalTile({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone: 'cyan' | 'white';
}) {
  const valueClass = tone === 'cyan' ? 'text-cyan-100' : 'text-white';

  return (
    <div className="rounded-[6px] border border-white/10 bg-white/[0.045] p-3">
      <div className="text-cyan-100/76">{icon}</div>
      <p className="mt-3 text-[10px] font-black uppercase tracking-[0.14em] text-white/40">{label}</p>
      <p className={`mt-2 text-3xl font-black leading-none ${valueClass}`}>{value}</p>
    </div>
  );
}

function DecisionLensLabel({ lens, question }: { lens: string; question: string }) {
  return (
    <div className="mb-4 border-b border-white/10 pb-3">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/76">{lens}</p>
      <p className="mt-1 text-xs leading-5 text-white/46">{question}</p>
    </div>
  );
}

function HeroFact({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-[6px] border border-white/14 bg-[#071017]/62 px-3 py-2.5 backdrop-blur">
      <div className="flex items-center gap-1.5 text-cyan-100/76">{icon}</div>
      <p className="mt-2 text-[9px] font-black uppercase tracking-[0.14em] text-white/40">{label}</p>
      <p className="mt-1 truncate text-sm font-black leading-none text-white">{value}</p>
    </div>
  );
}

function FactTile({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[6px] border border-white/10 bg-white/[0.045] p-3">
      <div className="text-cyan-100/72">{icon}</div>
      <p className="mt-3 text-[10px] font-black uppercase tracking-[0.14em] text-white/40">{label}</p>
      <p className="mt-1 text-xl font-black leading-none text-white">{value}</p>
    </div>
  );
}

function AuthorityLink({ href, eyebrow, label }: { href: string; eyebrow: string; label: string }) {
  return (
    <Link
      href={href}
      className="group rounded-[6px] border border-white/10 bg-white/[0.045] p-3 transition-colors hover:border-cyan-100/35 hover:bg-white/[0.075]"
    >
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/36">{eyebrow}</p>
      <p className="mt-2 text-xs font-black uppercase tracking-[0.08em] text-white/68 transition-colors group-hover:text-white">
        {label}
      </p>
    </Link>
  );
}

function ActionMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-[6px] border border-cyan-100/16 bg-black/22 p-3">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-cyan-100/54">{label}</p>
      <p className="mt-2 truncate text-xs font-black uppercase tracking-[0.08em] text-white">{value}</p>
    </div>
  );
}

function SnapshotTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-[6px] border border-white/10 bg-white/[0.045] p-3">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/36">{label}</p>
      <p className="mt-2 truncate text-sm font-black text-white/78">{value}</p>
    </div>
  );
}

function BriefSignalTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-[6px] border border-white/10 bg-white/[0.045] p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-cyan-100/58">{label}</p>
      <p className="mt-2 line-clamp-3 text-sm font-bold leading-6 text-white/68">{value}</p>
    </div>
  );
}

function DecisionRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[112px_minmax(0,1fr)] gap-3 border-b border-cyan-100/12 pb-3 last:border-b-0 last:pb-0">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-cyan-100/52">{label}</p>
      <p className="min-w-0 text-right text-xs font-black uppercase leading-5 text-white">{value}</p>
    </div>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/properties/[id]/page.tsx
