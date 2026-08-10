import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, FileSearch, MapPinned, ShieldCheck } from 'lucide-react';

import { getCityOrientationGuide, getCityOrientationGuideStaticParams } from '@/lib/cityOrientationGuides';

type CityOrientationGuidePageParams = {
  city: string;
  slug: string;
};

type CityOrientationGuidePageProps = {
  params: Promise<CityOrientationGuidePageParams>;
};

export function generateStaticParams() {
  return getCityOrientationGuideStaticParams();
}

export async function generateMetadata({ params }: CityOrientationGuidePageProps): Promise<Metadata> {
  const { city, slug } = await params;
  const guide = getCityOrientationGuide(city, slug);

  if (!guide) {
    return {
      title: 'City Guide Not Found',
    };
  }

  return {
    title: guide.title,
    description: guide.description,
    alternates: {
      canonical: guide.canonicalUrl,
    },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url: guide.canonicalUrl,
      siteName: 'David Quinn Group',
      locale: 'en_US',
      type: 'article',
    },
  };
}

function buildSchema(guide: NonNullable<ReturnType<typeof getCityOrientationGuide>>) {
  return {
    '@context': 'https://schema.org',
    '@type': guide.structuredDataType,
    '@id': `${guide.canonicalUrl}#webpage`,
    url: guide.canonicalUrl,
    name: guide.title,
    description: guide.description,
    about: {
      '@type': 'Place',
      name: `${guide.city.name}, ${guide.city.state}`,
    },
    mainEntity: {
      '@type': 'Question',
      name: guide.intent.customerQuestion,
      acceptedAnswer: {
        '@type': 'Answer',
        text: guide.visibleAnswer,
      },
    },
    publisher: {
      '@type': 'Organization',
      name: 'David Quinn Group',
      url: 'https://davidquinngroup.com',
    },
  };
}

export default async function CityOrientationGuidePage({ params }: CityOrientationGuidePageProps) {
  const { city, slug } = await params;
  const guide = getCityOrientationGuide(city, slug);

  if (!guide) return notFound();

  const schema = buildSchema(guide);

  return (
    <main
      className="min-h-screen bg-[#071017] text-white"
      data-testid="city-orientation-guide-page"
      data-city-guide-status={guide.status}
      data-city-guide-city={guide.city.name}
      data-city-guide-city-slug={guide.city.marketSlug}
      data-city-guide-intent={guide.intent.slug}
      data-city-guide-canonical-path={guide.canonicalPath}
      data-city-guide-freshness={guide.freshness.state}
      data-city-guide-claim-eligibility={guide.claimEligibility}
      data-city-guide-structured-data={guide.structuredDataType}
      data-city-guide-schema-visible-alignment={String(guide.structuredDataEligible)}
      data-city-guide-county-source-dependency={String(guide.protectedBoundaries.countySourceDependency)}
      data-city-guide-hidden-state-transfer={String(guide.protectedBoundaries.hiddenStateTransfer)}
      data-city-guide-personalization={String(guide.protectedBoundaries.personalization)}
      data-city-guide-ranking={String(guide.protectedBoundaries.ranking)}
      data-city-guide-scoring={String(guide.protectedBoundaries.scoring)}
      data-city-guide-suitability-conclusion={String(guide.protectedBoundaries.suitabilityConclusion)}
      data-city-guide-investment-conclusion={String(guide.protectedBoundaries.investmentConclusion)}
      data-city-guide-protected-class-inference={String(guide.protectedBoundaries.protectedClassInference)}
      data-city-guide-provider-activation={String(guide.protectedBoundaries.providerActivation)}
    >
      <script
        type="application/ld+json"
        data-testid="city-orientation-guide-schema"
        data-city-guide-schema-visible-alignment="true"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section className="border-b border-white/10 bg-[linear-gradient(135deg,#071017,#101820_56%,#24343f)] px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/72">
              {guide.city.name} Decision Guide
            </p>
            <h1 className="mt-4 text-4xl font-black uppercase leading-tight tracking-normal md:text-6xl">
              {guide.intent.label}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-white/66" data-testid="city-orientation-guide-question">
              {guide.intent.customerQuestion}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={guide.city.marketRoute}
                className="inline-flex min-h-12 items-center gap-2 rounded-[8px] bg-cyan-100 px-5 py-3 text-xs font-black uppercase tracking-[0.12em] text-[#071017] no-underline transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-100"
              >
                City Market
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <Link
                href="/sources"
                className="inline-flex min-h-12 items-center gap-2 rounded-[8px] border border-white/14 bg-white/[0.04] px-5 py-3 text-xs font-black uppercase tracking-[0.12em] text-white/72 no-underline transition hover:bg-white/[0.08] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-100"
              >
                Sources
                <FileSearch size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <aside className="rounded-[8px] bg-black/24 p-5 ring-1 ring-white/10" data-testid="city-orientation-guide-visible-answer">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/68">Visible Answer</p>
            <p className="mt-3 text-lg font-black leading-7 text-white">{guide.visibleAnswer}</p>
          </aside>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 lg:px-12" data-testid="city-orientation-guide-evidence-contract">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            ['Source', guide.evidenceBasis],
            ['Geography', `${guide.city.name}, ${guide.city.state}`],
            ['Period / Freshness', `${guide.marketPeriod} ${guide.freshness.label}`],
            ['Claim Eligibility', guide.claimEligibility === 'ELIGIBLE_LIMITED' ? 'Eligible only as bounded decision orientation.' : 'Excluded until evidence supports the claim.'],
          ].map(([label, body]) => (
            <article key={label} className="rounded-[8px] bg-white/[0.045] p-5 ring-1 ring-white/10">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/70">{label}</p>
              <p className="mt-3 text-sm leading-7 text-white/58">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-black/18 px-5 py-14 sm:px-8 lg:px-12" data-testid="city-orientation-guide-boundaries">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <ShieldCheck className="mb-5 h-7 w-7 text-cyan-100" />
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100/70">Limitations</p>
            <h2 className="mt-3 text-3xl font-black uppercase leading-tight tracking-normal text-white">
              Keep place context separate from property conclusions.
            </h2>
          </div>
          <div className="grid gap-3">
            <p className="rounded-[8px] bg-[#071017]/82 p-5 text-sm leading-7 text-white/62">{guide.limitation}</p>
            <p className="rounded-[8px] bg-[#071017]/82 p-5 text-sm leading-7 text-white/62">{guide.verificationPath}</p>
            <p className="rounded-[8px] bg-[#071017]/82 p-5 text-sm leading-7 text-white/62">
              County Assessor and county GIS evidence are not active here. This guide does not use county datasets, rankings, fit scoring,
              investment conclusions, protected-class inference, hidden personalization, or provider activation.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 lg:px-12" data-testid="city-orientation-guide-continuity">
        <div className="mx-auto max-w-6xl">
          <div className="mb-5 flex items-center gap-3">
            <MapPinned className="h-5 w-5 text-cyan-100" />
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100/70">Decision Continuity</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {guide.continuityLinks.map((link) => (
              <Link
                key={`${link.destination}-${link.href}`}
                href={link.href}
                className="rounded-[8px] bg-black/24 p-4 text-sm font-bold leading-6 text-white/64 ring-1 ring-white/10 no-underline transition hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-100"
                data-testid="city-orientation-guide-continuity-link"
                data-city-guide-continuity-destination={link.destination}
                data-city-guide-hidden-state-transfer="false"
              >
                <span className="block text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100/72">{link.label}</span>
                <span className="mt-2 block">{link.note}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-8 lg:px-12" data-testid="city-orientation-guide-final-boundary">
        <div className="mx-auto max-w-6xl rounded-[8px] bg-white/[0.045] p-5 ring-1 ring-white/10">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/70">Route Boundary</p>
          <p className="mt-3 text-sm leading-7 text-white/58">
            This guide is route context only. It does not pass customer state, rank places, score properties, or personalize the next step.
            Use the links above to choose the next public surface deliberately.
          </p>
        </div>
      </section>
    </main>
  );
}
