import type { Metadata } from 'next';
import type { Prisma } from '@prisma/client';
import type { ReactNode } from 'react';
import Image from 'next/image';
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

function formatCompactCurrency(value: number | null | undefined) {
  if (!value) return 'Request';
  if (value >= 1000000) return `$${(value / 1000000).toFixed(value >= 10000000 ? 0 : 1)}M`;
  if (value >= 1000) return `$${Math.round(value / 1000)}K`;

  return `$${value.toLocaleString()}`;
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

function getPrimaryStatLabel(property: PropertyWithPhotos) {
  const pieces = [
    property.propertyType || 'Residential',
    property.status || null,
    property.neighborhood || null,
  ].filter(Boolean);

  return pieces.join(' / ');
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
  const contactHref = `mailto:hello@davidquinngroup.com?subject=${encodeURIComponent(`Property inquiry: ${property.address}`)}&body=${encodeURIComponent(
    `I would like to discuss ${property.address} in ${property.city}, ${property.state}.\n\nREIE listing: ${canonicalUrl}`,
  )}`;
  const primaryStatLabel = getPrimaryStatLabel(property);
  const propertyLinks = await getPropertyLinks({
    id: property.id,
    city: property.city,
    neighborhood: property.neighborhood,
  });
  const relatedListings = [...propertyLinks.neighborhoodHomes, ...propertyLinks.cityHomes];

  return (
    <main className="min-h-screen overflow-y-auto bg-[#070b10] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(propertySchema) }} />
      <FAQSchema faqs={propertyFaqs} pageUrl={canonicalUrl} />
      <section className="relative border-b border-white/10">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(100,188,205,0.14),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.035),transparent_35%)]" />
        <div className="relative mx-auto grid min-h-[620px] max-w-[1500px] grid-cols-1 gap-0 lg:min-h-[720px] lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="relative min-h-[500px] overflow-hidden bg-[#101720] sm:min-h-[560px] lg:min-h-[720px]">
            <Image
              src={primaryPhoto}
              alt={property.address}
              fill
              priority
              sizes="(min-width: 1024px) calc(100vw - 420px), 100vw"
              className="object-cover opacity-95"
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
                DQG Intelligence
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
                      Private
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
              </div>
            </div>
          </div>

          <aside className="border-t border-white/10 bg-[#070b10] p-4 sm:p-5 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-l lg:border-t-0">
            <div className="rounded-[8px] border border-white/10 bg-[#0d141c] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/44">REIE Scorecard</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <SignalTile icon={<TrendingUp size={16} />} label="Efficiency" value={formatNumber(efficiencyScore)} tone="cyan" />
                <SignalTile icon={<ShieldCheck size={16} />} label="Resilience" value={formatNumber(resilienceScore)} tone="white" />
              </div>
              <div className="mt-3 rounded-[6px] border border-white/10 bg-white/[0.045] p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/40">Review Signal</p>
                <p className="mt-2 truncate text-sm font-black uppercase tracking-[0.08em] text-cyan-100">{reviewSignal}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <FactTile icon={<BedDouble size={15} />} label="Beds" value={formatNumber(property.beds)} />
              <FactTile icon={<Bath size={15} />} label="Baths" value={formatNumber(property.baths)} />
              <FactTile icon={<Ruler size={15} />} label="Sq Ft" value={formatNumber(property.sqft)} />
            </div>

            <section className="mt-4 rounded-[8px] border border-white/10 bg-[#0d141c] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/76">Authority Paths</p>
              <div className="mt-4 grid gap-2">
                <AuthorityLink href={cityMarketHref} eyebrow="City Market" label={`${property.city || 'Colorado'} Intelligence`} />
                {neighborhoodHref ? (
                  <AuthorityLink href={neighborhoodHref} eyebrow="Neighborhood" label={`${property.neighborhood} Authority Hub`} />
                ) : null}
                {briefHref ? <AuthorityLink href={briefHref} eyebrow="REIE Brief" label="Strategy Context" /> : null}
              </div>
            </section>

            <section className="mt-4 rounded-[8px] border border-white/10 bg-[#0d141c] p-4">
              <h2 className="flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.12em] text-white">
                <Mountain className="text-cyan-100" size={17} /> Altitude Forensics
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
              <h2 className="flex items-center gap-2 text-[12px] font-black uppercase tracking-[0.12em] text-amber-100">
                <ShieldAlert size={17} /> GC Review
              </h2>
              <ul className="mt-4 space-y-2 text-xs font-bold uppercase tracking-[0.12em] text-white/62">
                {property.hasPolybutyleneRisk ? <li>Polybutylene piping risk detected</li> : null}
                <li>Drainage and grade verification recommended</li>
                <li>Mechanical age and electrical capacity review recommended</li>
              </ul>
            </section>

            {!isContracted ? (
              <div className="mt-4 rounded-[8px] border border-cyan-100/26 bg-cyan-100/10 p-4">
                <HardHat className="text-cyan-100" size={24} />
                <h2 className="mt-3 text-[15px] font-black uppercase tracking-[0.08em] text-white">Strategy Layer Locked</h2>
                <p className="mt-2 text-sm leading-6 text-white/62">
                  Contracted David Quinn Group clients unlock the full GC-forensics and negotiation layer.
                </p>
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-5 py-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-8">
        <div className="space-y-6">
          <section className="rounded-[8px] border border-white/10 bg-[#0d141c] p-5 md:p-8">
            <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/76">
              <FileText size={14} aria-hidden="true" />
              Property Brief
            </p>
            <p className="mt-5 max-w-4xl text-base leading-8 text-white/70">
              {property.description ||
                `${property.address} is an active Colorado listing in the David Quinn Group intelligence layer. Live MLS media, location signals, and structural context are being assembled for this asset.`}
            </p>
          </section>

          {property.photos.length > 1 ? (
            <section className="rounded-[8px] border border-white/10 bg-[#0d141c] p-4">
              <div className="mb-4 flex items-center justify-between gap-4">
                <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-white/50">
                  <Camera size={14} aria-hidden="true" />
                  Listing Media
                </p>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/34">{property.photos.length} Photos</p>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {property.photos.slice(1, 5).map((photo) => (
                  <div key={photo.id} className="relative aspect-[4/3] overflow-hidden rounded-[6px] border border-white/10 bg-[#101720]">
                    <Image src={photo.url} alt={`${property.address} listing photo`} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" />
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="space-y-6">
          <section className="rounded-[8px] border border-white/10 bg-[#0d141c] p-5">
            <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-white/46">
              <Home size={14} aria-hidden="true" />
              Asset Snapshot
            </p>
            <div className="mt-4 space-y-3">
              <SnapshotRow label="Price" value={formatCompactCurrency(property.price)} />
              <SnapshotRow label="Status" value={property.status || 'Active'} />
              <SnapshotRow label="Type" value={property.propertyType || 'Residential'} />
              <SnapshotRow label="MLS" value={property.mlsId || property.id} />
            </div>
          </section>

          <EquityVision property={equityProperty} />
        </aside>
      </section>
      <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
        <RelatedPropertyLinks
          city={property.city || 'Colorado'}
          neighborhood={property.neighborhood}
          price={property.price ?? undefined}
          authorityLinks={propertyLinks.authorityLinks}
        />
        <section className="my-14 rounded-[8px] border border-white/10 bg-[#0d141c] p-6 md:p-8">
          <div className="mb-8 max-w-3xl">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/76">REIE FAQ Layer</p>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white">
              Property Intelligence Questions
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
          title={`${property.city || 'Colorado'} Property Authority Links`}
        />
      </section>
      <nav
        className="fixed inset-x-0 bottom-0 z-[900] border-t border-white/12 bg-[#071017]/94 p-2 shadow-2xl backdrop-blur md:hidden"
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
            className="inline-flex h-11 items-center justify-center gap-1.5 rounded-[6px] bg-cyan-100 text-[10px] font-black uppercase tracking-[0.12em] text-[#061017]"
            style={{ alignItems: 'center', display: 'inline-flex', height: 44, justifyContent: 'center' }}
          >
            <TrendingUp size={13} aria-hidden="true" />
            Market
          </Link>
          <Link
            href={contactHref}
            className="inline-flex h-11 items-center justify-center gap-1.5 rounded-[6px] border border-cyan-100/35 bg-cyan-100/10 text-[10px] font-black uppercase tracking-[0.12em] text-cyan-100"
            style={{ alignItems: 'center', display: 'inline-flex', height: 44, justifyContent: 'center' }}
          >
            <Mail size={13} aria-hidden="true" />
            Contact
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

function SnapshotRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 last:border-b-0 last:pb-0">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/38">{label}</p>
      <p className="min-w-0 truncate text-sm font-bold text-white/78">{value}</p>
    </div>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/properties/[id]/page.tsx
