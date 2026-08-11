import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, RotateCcw, Search, X } from 'lucide-react';

import JourneyCohesionPanel from '@/components/JourneyCohesionPanel';
import {
  buildCrossCityComparisonWorkspace,
  CROSS_CITY_COMPARISON_MAX_SELECTIONS,
  CROSS_CITY_COMPARISON_MIN_SELECTIONS,
  CROSS_CITY_COMPARISON_ROUTE,
  getCrossCityComparisonHref,
  type CrossCityComparisonMarket,
} from '@/lib/crossCityComparison';

const SITE_URL = 'https://davidquinngroup.com';
const COMPARE_URL = `${SITE_URL}${CROSS_CITY_COMPARISON_ROUTE}`;

type ComparePageProps = {
  searchParams?: Promise<{
    cities?: string | string[];
  }>;
};

export const metadata: Metadata = {
  title: 'Compare Colorado Market Context | David Quinn Group',
  description:
    'Compare certified Colorado city market guides by neutral decision dimensions, evidence boundaries, and next-step paths without automated recommendations.',
  alternates: {
    canonical: COMPARE_URL,
  },
  openGraph: {
    title: 'Compare Colorado Market Context | David Quinn Group',
    description:
      'A governed comparison workspace for certified Colorado city market guides, search paths, buyer guidance, seller guidance, Grand Plan, and advisory continuity.',
    url: COMPARE_URL,
    siteName: 'David Quinn Group',
    locale: 'en_US',
    type: 'website',
  },
};

function getCityActionLabel(destination: string, fallback: string) {
  if (destination === 'market') return 'Full City Guide';
  return fallback;
}

function getAddHref(selectedSlugs: string[], slug: string) {
  return getCrossCityComparisonHref([...selectedSlugs, slug]);
}

function getRemoveHref(selectedSlugs: string[], slug: string) {
  return getCrossCityComparisonHref(selectedSlugs.filter((selectedSlug) => selectedSlug !== slug));
}

function MarketSelector({
  eligibleMarkets,
  selectedSlugs,
}: {
  eligibleMarkets: CrossCityComparisonMarket[];
  selectedSlugs: string[];
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" data-testid="cross-city-market-selector">
      {eligibleMarkets.map((market) => {
        const selected = selectedSlugs.includes(market.slug);
        const disabled = !selected && selectedSlugs.length >= CROSS_CITY_COMPARISON_MAX_SELECTIONS;
        const href = selected ? getRemoveHref(selectedSlugs, market.slug) : getAddHref(selectedSlugs, market.slug);

        return (
          <Link
            key={market.slug}
            href={disabled ? getCrossCityComparisonHref(selectedSlugs) : href}
            className={`group flex min-h-[150px] flex-col rounded-[8px] p-4 text-white no-underline ring-1 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200 ${
              selected
                ? 'bg-cyan-100/[0.11] ring-cyan-100/22'
                : disabled
                  ? 'bg-white/[0.025] ring-white/[0.05]'
                  : 'bg-white/[0.04] ring-white/[0.08] hover:bg-white/[0.065]'
            }`}
            aria-disabled={disabled ? 'true' : undefined}
            data-testid="cross-city-eligible-market"
            data-cross-city-slug={market.slug}
            data-cross-city-maturity={market.maturity}
            data-cross-city-selected={String(selected)}
            data-cross-city-disabled={String(disabled)}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-cyan-100/62">{market.maturityLabel}</p>
                <h3 className="mt-3 text-xl font-black uppercase tracking-normal">{market.name}</h3>
              </div>
              {selected ? <X className="h-4 w-4 text-cyan-100" aria-hidden="true" /> : <ArrowRight className="h-4 w-4 text-cyan-100/70" aria-hidden="true" />}
            </div>
            <p className="mt-auto pt-5 text-[10px] font-black uppercase tracking-[0.14em] text-cyan-100/76">
              {selected ? 'Remove from comparison' : disabled ? 'Limit reached' : 'Add to comparison'}
            </p>
          </Link>
        );
      })}
    </div>
  );
}

export default async function CrossCityDecisionComparisonPage({ searchParams }: ComparePageProps) {
  const resolvedSearchParams = await searchParams;
  const workspace = buildCrossCityComparisonWorkspace(resolvedSearchParams?.cities);

  return (
    <main
      className="min-h-screen overflow-hidden bg-[#030303] text-white"
      data-testid="cross-city-decision-comparison-page"
      data-cross-city-comparison-route={CROSS_CITY_COMPARISON_ROUTE}
      data-cross-city-comparison-min={CROSS_CITY_COMPARISON_MIN_SELECTIONS}
      data-cross-city-comparison-max={CROSS_CITY_COMPARISON_MAX_SELECTIONS}
      data-cross-city-comparison-ai="false"
      data-cross-city-comparison-personalization="false"
      data-cross-city-comparison-telemetry="false"
      data-cross-city-comparison-storage="false"
      data-cross-city-comparison-gis="false"
      data-cross-city-comparison-provider-activation="false"
      data-cross-city-comparison-ranking="false"
      data-cross-city-comparison-scoring="false"
      data-cross-city-comparison-valuation="false"
      data-cross-city-comparison-api="false"
      data-cross-city-comparison-map-change="false"
    >
      <section className="border-b border-white/8 bg-[radial-gradient(circle_at_82%_14%,rgba(207,250,254,0.12),transparent_30%),linear-gradient(180deg,#071017,#030303)] px-5 py-14 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-100/74">Cross-City Decision Comparison</p>
          <div className="mt-5 grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
            <div>
              <h1 className="text-3xl font-black uppercase leading-tight tracking-normal text-white md:text-5xl">
                Compare certified market context without turning cities into an ordered list.
              </h1>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-white/62">
                Use this workspace to examine how certified Colorado guides emphasize different real-estate decision considerations.
                It does not choose a city, infer personal priorities, or replace neighborhood and property due diligence.
              </p>
            </div>
            <div className="rounded-[8px] bg-white/[0.045] p-5 ring-1 ring-white/[0.08]">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/70">Governance Boundary</p>
              <p className="mt-4 text-sm leading-7 text-white/58">
                Maturity labels describe guide structure and evidence posture. They are not quality grades. Citywide context is a
                starting point for questions to verify through city guides, search, qualified professionals, records, and advisory review.
              </p>
              <div className="mt-5 grid gap-2 text-xs leading-5 text-white/46 sm:grid-cols-2">
                <span>Certified markets only</span>
                <span>No saved profile</span>
                <span>No hidden weighting</span>
                <span>No automated conclusion</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100/70">Select Markets</p>
              <h2 className="mt-3 text-2xl font-black uppercase tracking-normal text-white">
                Choose {CROSS_CITY_COMPARISON_MIN_SELECTIONS} or {CROSS_CITY_COMPARISON_MAX_SELECTIONS} certified markets.
              </h2>
            </div>
            <Link
              href={CROSS_CITY_COMPARISON_ROUTE}
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-cyan-100 no-underline transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
              data-testid="cross-city-reset"
            >
              <RotateCcw size={14} aria-hidden="true" />
              Reset
            </Link>
          </div>

          <MarketSelector eligibleMarkets={workspace.eligibleMarkets} selectedSlugs={workspace.selectedSlugs} />

          {workspace.rejectedSelections.length > 0 ? (
            <div className="mt-5 rounded-[8px] bg-white/[0.04] p-4 text-xs leading-6 text-white/56 ring-1 ring-white/[0.08]" data-testid="cross-city-rejected-selection">
              Unsupported, repeated, or extra selections were omitted so the workspace stays within the certified comparison contract.
            </div>
          ) : null}
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8 lg:px-12" data-testid="cross-city-comparison-workspace">
        <div className="mx-auto max-w-6xl">
          {!workspace.canCompare ? (
            <div className="rounded-[8px] bg-white/[0.04] p-6 ring-1 ring-white/[0.08]" data-testid="cross-city-empty-state">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/72">Ready When You Select</p>
              <h2 className="mt-4 text-2xl font-black uppercase tracking-normal text-white">Start with at least two markets.</h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/58">
                The workspace remains useful before selection by showing eligible certified markets and the evidence boundary. It does
                not preselect a comparison set or imply that any city belongs in a customer-specific shortlist.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid gap-4 lg:grid-cols-3" data-testid="cross-city-selected-markets">
                {workspace.selectedMarkets.map((market) => (
                  <article key={market.slug} className="rounded-[8px] bg-white/[0.04] p-5 ring-1 ring-white/[0.08]" data-testid="cross-city-selected-market" data-cross-city-selected-slug={market.slug}>
                    <p className="text-[9px] font-black uppercase tracking-[0.16em] text-cyan-100/64">{market.maturityLabel}</p>
                    <h3 className="mt-3 text-2xl font-black uppercase tracking-normal text-white">{market.name}</h3>
                    <p className="mt-4 text-sm leading-7 text-white/58">{market.decisionSnapshot.mattersMost}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <a
                        href={market.marketRoute}
                        className="market-secondary-cta text-[10px]"
                        data-testid="cross-city-full-guide-link"
                        data-cross-city-navigation-mode="document"
                      >
                        Full City Guide
                      </a>
                      <a
                        href={market.searchHref}
                        className="market-secondary-cta text-[10px]"
                        data-testid="cross-city-search-link"
                        data-cross-city-search-navigation="document"
                      >
                        <Search size={13} aria-hidden="true" />
                        Search {market.name} Homes
                      </a>
                    </div>
                  </article>
                ))}
              </div>

              <div className="space-y-4" data-testid="cross-city-neutral-dimensions">
                {workspace.dimensions.map((dimension) => (
                  <section key={dimension.key} className="rounded-[8px] bg-white/[0.035] p-5 ring-1 ring-white/[0.07]" data-testid="cross-city-comparison-dimension" data-cross-city-dimension={dimension.key}>
                    <div className="mb-5">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-100/66">{dimension.label}</p>
                      <p className="mt-2 text-xs leading-6 text-white/48">{dimension.prompt}</p>
                    </div>
                    <div className="grid gap-3 lg:grid-cols-3">
                      {dimension.values.map((value) => (
                        <div key={`${dimension.key}-${value.cityName}`} className="min-w-0 rounded-[6px] bg-black/22 p-4">
                          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/42">{value.cityName}</p>
                          <p className="mt-3 text-sm leading-7 text-white/62">{value.value}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              <section className="rounded-[8px] bg-white/[0.04] p-5 ring-1 ring-white/[0.08]" data-testid="cross-city-decision-journey-continuity">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/70">Continue With Specific Evidence</p>
                <div className="mt-5 grid gap-4 lg:grid-cols-3">
                  {workspace.selectedMarkets.map((market) => (
                    <div key={`${market.slug}-continuity`} className="min-w-0">
                      <h3 className="text-lg font-black uppercase tracking-normal text-white">{market.name}</h3>
                      <div className="mt-3 grid gap-2">
                        {market.continuityLinks.map((link) => (
                          <a
                            key={`${market.slug}-${link.destination}`}
                            href={link.href}
                            className="group flex min-h-12 items-center justify-between gap-3 rounded-[6px] bg-[#071017]/72 px-4 py-3 text-xs font-black uppercase tracking-[0.1em] text-cyan-100 no-underline transition hover:bg-cyan-100/[0.11] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
                            data-testid="cross-city-continuity-link"
                            data-cross-city-continuity-city={market.slug}
                            data-cross-city-continuity-destination={link.destination}
                            data-cross-city-continuity-href={link.href}
                            data-cross-city-navigation-mode="document"
                          >
                            <span>{getCityActionLabel(link.destination, link.label)}</span>
                            <ArrowRight size={14} aria-hidden="true" />
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <JourneyCohesionPanel
            surface="compare"
            title="Move from comparison into the next verified step."
            body="Use comparison to prepare questions, then continue into search, market context, Grand Plan, or advisory review. The workspace is informational and does not make customer-specific housing decisions."
            links={[
              { label: 'Search Homes', href: '/search', note: 'Review inventory', destination: 'search' },
              { label: 'Market Context', href: '/market', note: 'Open city guides', destination: 'market' },
              { label: 'Prepare Next Conversation', href: '/contact#advisory-readiness', note: 'Review knowns, unresolved items, and verification questions', destination: 'advisory' },
            ]}
          />
        </div>
      </section>
    </main>
  );
}
