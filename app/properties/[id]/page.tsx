import type { Metadata } from 'next';
import type { Prisma } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { HardHat, Mountain, ShieldAlert, TrendingUp } from 'lucide-react';

import EquityVision from '@/components/EquityVision';
import RelatedPropertyLinks from '@/components/RelatedPropertyLinks';
import PropertyLinks from '@/components/internal-links/PropertyLinks';
import FAQSchema from '@/components/schema/FAQSchema';
import { getCityByName } from '@/lib/cities';
import { getBlogLinks } from '@/lib/linking/getBlogLinks';
import { getPropertyLinks } from '@/lib/linking/getPropertyLinks';
import { getListingPhotoUrl } from '@/lib/listingVisuals';
import { neighborhoods } from '@/lib/neighborhoods';
import { prisma } from '@/lib/prisma';
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

function getAltitudeNarrative(altitude: number) {
  if (altitude > 6000) {
    return 'High-altitude exposure calls for UV-aware glazing, tighter humidity control, and a closer look at envelope performance.';
  }

  return 'Standard Front Range climate envelope applies, with the usual emphasis on drainage, roof condition, and mechanical age.';
}

function getReviewSignal(property: PropertyWithPhotos) {
  if (property.hasPolybutyleneRisk) return 'Plumbing Review';
  if (property.soilType?.trim()) return property.soilType.trim();
  if (property.altitude) return `${formatNumber(property.altitude)} FT`;

  return 'REIE Verified';
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

async function getProperty(id: string) {
  return prisma.property.findFirst({
    where: {
      OR: [{ id }, { slug: id }, { mlsId: id }],
    },
    include: {
      photos: {
        orderBy: { order: 'asc' },
      },
    },
  });
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
      answer: `David Quinn Group evaluates ${property.address}${neighborhoodContext} through the Real Estate Intelligence Engine, combining price context, MLS inventory signals, construction condition, resilience posture, location quality, and buyer or seller strategy.`,
    },
    {
      question: `Why does construction diligence matter for ${property.address}?`,
      answer: `Construction diligence matters because visible finishes do not always explain durable value. David Quinn Group reviews drainage, building envelope exposure, mechanical age, soil context, altitude, maintenance risk, and inspection leverage before relying only on comparable sales.`,
    },
    {
      question: `How should buyers interpret this ${property.city} property${priceContext}?`,
      answer: `Buyers should compare this property against live inventory, neighborhood authority paths, condition risk, resilience signals, and negotiation leverage. The REIE layer helps decide whether to move quickly, investigate further, or negotiate around specific risks.`,
    },
    {
      question: `How should sellers use property intelligence for a home like ${property.address}?`,
      answer: `Sellers should use property intelligence to understand likely buyer objections, competing inventory, condition-sensitive pricing, and which preparation items may improve confidence before launch or negotiation.`,
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
    description: `David Quinn Group property intelligence for ${property.address} in ${property.city}, Colorado, including price, construction context, resilience, and GC-level strategy signals.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${property.address} | ${property.city}, CO Real Estate Intelligence`,
      description: `Property intelligence for ${property.address} in ${property.city}, Colorado from David Quinn Group.`,
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
  const isContracted = false;
  const altitude = property.altitude || 5280;
  const soilType = property.soilType || 'Front Range Mixed';
  const efficiencyScore = property.efficiencyScore || 0;
  const resilienceScore = property.resilienceScore || 85;
  const reviewSignal = getReviewSignal(property);
  const equityProperty = buildEquityVisionProperty(property);
  const propertySchema = buildPropertySchema(property);
  const propertyFaqs = getPropertyFaqs(property);
  const canonicalUrl = getPropertyUrl(property);
  const cityMarketHref = getCityMarketHref(property.city);
  const neighborhoodHref = getNeighborhoodHref(property);
  const briefHref = getPropertyBriefHref(property);
  const propertyLinks = await getPropertyLinks({
    id: property.id,
    city: property.city,
    neighborhood: property.neighborhood,
  });
  const relatedListings = [...propertyLinks.neighborhoodHomes, ...propertyLinks.cityHomes];

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(propertySchema) }} />
      <FAQSchema faqs={propertyFaqs} pageUrl={canonicalUrl} />
      <section className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-8 px-5 py-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-8">
        <div className="space-y-7">
          <div className="relative aspect-[16/9] overflow-hidden border border-white/10 bg-slate-950">
            <Image src={primaryPhoto} alt={property.address} fill priority sizes="(min-width: 1024px) 820px, 100vw" className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/65 to-transparent p-5 md:p-8">
              <p className="text-[11px] font-black uppercase tracking-[0.34em] text-cyan-300">David Quinn Group Intelligence</p>
              <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <h1 className="max-w-4xl text-3xl font-black uppercase italic tracking-tight md:text-5xl">{property.address}</h1>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.28em] text-white/60">
                    {property.city}, {property.state} {property.zip}
                  </p>
                </div>
                <p className="text-3xl font-black italic text-white md:text-5xl">{formatCurrency(property.price)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 border border-white/10 bg-black md:grid-cols-4">
            <div className="border-b border-r border-white/10 p-4 md:border-b-0">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/40">Beds</p>
              <p className="mt-2 text-2xl font-black italic">{formatNumber(property.beds)}</p>
            </div>
            <div className="border-b border-white/10 p-4 md:border-b-0 md:border-r">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/40">Baths</p>
              <p className="mt-2 text-2xl font-black italic">{formatNumber(property.baths)}</p>
            </div>
            <div className="border-r border-white/10 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/40">Sq Ft</p>
              <p className="mt-2 text-2xl font-black italic">{formatNumber(property.sqft)}</p>
            </div>
            <div className="p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/40">Status</p>
              <p className="mt-2 text-2xl font-black italic">{property.status}</p>
            </div>
          </div>

          <section className="border border-white/10 bg-black p-5 md:p-8">
            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-cyan-300">Property Brief</p>
            <p className="mt-4 max-w-4xl text-base leading-8 text-white/72">
              {property.description ||
                `${property.address} is an active Colorado listing in the David Quinn Group intelligence layer. Live MLS media, location signals, and structural context are being assembled for this asset.`}
            </p>
          </section>

          {property.photos.length > 1 ? (
            <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {property.photos.slice(1, 5).map((photo) => (
                <div key={photo.id} className="relative aspect-[4/3] overflow-hidden border border-white/10 bg-slate-950">
                  <Image src={photo.url} alt={`${property.address} listing photo`} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" />
                </div>
              ))}
            </section>
          ) : null}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
          <div className="border border-white/10 bg-black p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-white/40">REIE Scorecard</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="bg-white/[0.04] p-4">
                <TrendingUp className="mb-3 text-[#00ff80]" size={18} />
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/40">Efficiency</p>
                <p className="mt-2 text-3xl font-black italic text-[#00ff80]">{efficiencyScore}</p>
              </div>
              <div className="bg-white/[0.04] p-4">
                <ShieldAlert className="mb-3 text-cyan-300" size={18} />
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/40">Resilience</p>
                <p className="mt-2 text-3xl font-black italic text-cyan-300">{resilienceScore}</p>
              </div>
            </div>
            <div className="mt-3 border border-white/10 bg-white/[0.035] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/40">Review Signal</p>
              <p className="mt-2 truncate text-sm font-black uppercase tracking-[0.12em] text-white">{reviewSignal}</p>
            </div>
          </div>

          <section className="border border-white/10 bg-black p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.32em] text-cyan-300">Authority Paths</p>
            <div className="mt-4 grid gap-px overflow-hidden border border-white/10 bg-white/10">
              <Link
                href={cityMarketHref}
                className="group bg-[#050505] p-4 transition-colors hover:bg-white/[0.05]"
              >
                <p className="text-[9px] font-black uppercase tracking-[0.24em] text-white/30">City Market</p>
                <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-white/70 transition-colors group-hover:text-white">
                  {property.city || 'Colorado'} Intelligence
                </p>
              </Link>

              {neighborhoodHref ? (
                <Link
                  href={neighborhoodHref}
                  className="group bg-[#050505] p-4 transition-colors hover:bg-white/[0.05]"
                >
                  <p className="text-[9px] font-black uppercase tracking-[0.24em] text-white/30">Neighborhood</p>
                  <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-white/70 transition-colors group-hover:text-white">
                    {property.neighborhood} Authority Hub
                  </p>
                </Link>
              ) : null}

              {briefHref ? (
                <Link
                  href={briefHref}
                  className="group bg-[#050505] p-4 transition-colors hover:bg-white/[0.05]"
                >
                  <p className="text-[9px] font-black uppercase tracking-[0.24em] text-white/30">REIE Brief</p>
                  <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-white/70 transition-colors group-hover:text-white">
                    Strategy Context
                  </p>
                </Link>
              ) : null}
            </div>
          </section>

          <div className={!isContracted ? 'space-y-5 blur-[1.5px] grayscale' : 'space-y-5'}>
            <EquityVision property={equityProperty} />

            <section className="border border-white/10 bg-slate-950 p-5">
              <h2 className="flex items-center gap-2 text-lg font-black uppercase italic tracking-tight">
                <Mountain className="text-cyan-300" size={20} /> Altitude Forensics
              </h2>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-white/45">Elevation</span>
                  <span className="font-mono">{formatNumber(altitude)} FT</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-white/45">Soil Profile</span>
                  <span className="font-mono">{soilType}</span>
                </div>
                <p className="pt-2 text-sm italic leading-6 text-white/55">{getAltitudeNarrative(altitude)}</p>
              </div>
            </section>

            <section className="border border-red-500/30 bg-red-950/20 p-5">
              <h2 className="flex items-center gap-2 text-lg font-black uppercase italic tracking-tight text-red-300">
                <ShieldAlert size={20} /> GC Red Flags
              </h2>
              <ul className="mt-4 space-y-2 text-xs font-bold uppercase tracking-[0.16em] text-white/62">
                {property.hasPolybutyleneRisk ? <li>Polybutylene piping risk detected</li> : null}
                <li>Drainage and grade verification recommended</li>
                <li>Mechanical age and electrical capacity review recommended</li>
              </ul>
            </section>
          </div>

          {!isContracted ? (
            <div className="border border-cyan-300/30 bg-cyan-300/10 p-5 text-center">
              <HardHat className="mx-auto text-cyan-300" size={28} />
              <h2 className="mt-3 text-lg font-black uppercase italic">Strategy Layer Locked</h2>
              <p className="mt-2 text-sm leading-6 text-white/62">
                Contracted David Quinn Group clients unlock the full GC-forensics and negotiation layer.
              </p>
            </div>
          ) : null}
        </aside>
      </section>
      <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
        <RelatedPropertyLinks
          city={property.city || 'Colorado'}
          neighborhood={property.neighborhood}
          price={property.price ?? undefined}
          authorityLinks={propertyLinks.authorityLinks}
        />
        <section className="my-14 border-y border-white/10 py-12">
          <div className="mb-8 max-w-3xl">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.35em] text-[#00ff80]">REIE FAQ Layer</p>
            <h2 className="text-2xl font-black italic uppercase tracking-tight text-white">
              Property Intelligence Questions
            </h2>
          </div>

          <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2">
            {propertyFaqs.slice(0, 4).map((faq) => (
              <article key={faq.question} className="bg-[#050505] p-6">
                <h3 className="text-sm font-black uppercase leading-6 tracking-[0.12em] text-white">
                  {faq.question}
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/55">{faq.answer}</p>
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
          title={`${property.city || 'Colorado'} Property Authority Links`}
        />
      </section>
    </main>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/properties/[id]/page.tsx
