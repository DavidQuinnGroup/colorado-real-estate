'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import MapSidebar, { type MapSidebarListing } from '@/components/maps/MapSidebar';
import type { SearchMapMeta } from '@/components/maps/SearchMap';
import type { FAQItem } from '@/lib/schema/faqSchema';

const MapInner = dynamic(() => import('@/components/maps/MapInner'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-[#030303]" />,
});

type UserTier = 'Public' | 'Contracted';

type StrategyToggleDetail = {
  gateActive?: boolean;
};

type SearchInterfaceProps = {
  initialListings?: MapSidebarListing[];
  initialSearchMeta?: SearchMapMeta | null;
  authorityLinks?: SearchAuthorityLink[];
  faqItems?: FAQItem[];
};

export type SearchAuthorityLink = {
  label: string;
  href: string;
  eyebrow: string;
};

function getUserTier(detail: StrategyToggleDetail | undefined): UserTier {
  return detail?.gateActive ? 'Contracted' : 'Public';
}

export default function SearchInterface({
  initialListings = [],
  initialSearchMeta = null,
  authorityLinks = [],
  faqItems = [],
}: SearchInterfaceProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [userTier, setUserTier] = useState<UserTier>('Public');

  const visibleListings = useMemo(() => {
    if (userTier === 'Contracted') return initialListings;
    return initialListings.filter((property) => !property.isPrivateExclusive);
  }, [initialListings, userTier]);

  const effectiveSearchMeta = useMemo<SearchMapMeta | null>(() => {
    if (!initialSearchMeta) return null;

    return {
      ...initialSearchMeta,
      accessLevel: initialSearchMeta.accessLevel || (userTier === 'Contracted' ? 'contracted' : 'public'),
    };
  }, [initialSearchMeta, userTier]);

  const visibleIds = useMemo(() => new Set(visibleListings.map((listing) => listing.id)), [visibleListings]);
  const visibleSelectedId = selectedId && visibleIds.has(selectedId) ? selectedId : null;
  const visibleHoveredId = hoveredId && visibleIds.has(hoveredId) ? hoveredId : null;

  useEffect(() => {
    const handleToggle = (event: Event) => {
      const customEvent = event as CustomEvent<StrategyToggleDetail>;
      setUserTier(getUserTier(customEvent.detail));
    };

    window.addEventListener('DQG_STRATEGY_TOGGLE', handleToggle);
    return () => window.removeEventListener('DQG_STRATEGY_TOGGLE', handleToggle);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-black text-white">
      <MapSidebar
        listings={visibleListings}
        selectedId={visibleSelectedId}
        hoveredId={visibleHoveredId}
        onSelect={setSelectedId}
        onHover={setHoveredId}
      />

      <section className="relative h-full min-w-0 flex-1 border-l border-white/15">
        <MapInner
          listings={visibleListings}
          selectedId={visibleSelectedId}
          setSelectedId={setSelectedId}
          hoveredId={visibleHoveredId}
          setHoveredId={setHoveredId}
          searchMeta={effectiveSearchMeta}
          userTier={userTier}
        />

        {authorityLinks.length ? (
          <nav
            aria-label="Colorado real estate authority links"
            className="pointer-events-auto absolute bottom-6 left-6 z-[700] hidden max-w-[min(620px,calc(100%-3rem))] border border-white/12 bg-black/82 p-3 shadow-2xl backdrop-blur md:block"
          >
            <div className="grid grid-cols-2 gap-px overflow-hidden border border-white/10 bg-white/10 lg:grid-cols-4">
              {authorityLinks.map((link) => (
                <Link
                  key={`${link.href}-${link.label}`}
                  href={link.href}
                  className="group bg-[#050505] p-3 transition-colors hover:bg-white/[0.06]"
                >
                  <p className="text-[8px] font-black uppercase tracking-[0.22em] text-[#00ff80]/80">
                    {link.eyebrow}
                  </p>
                  <p className="mt-2 text-[10px] font-black uppercase leading-4 tracking-[0.12em] text-white/70 transition-colors group-hover:text-white">
                    {link.label}
                  </p>
                </Link>
              ))}
            </div>
          </nav>
        ) : null}

        {faqItems.length ? (
          <details className="absolute right-6 top-6 z-[700] hidden w-[min(420px,calc(100%-3rem))] border border-white/12 bg-black/82 p-4 shadow-2xl backdrop-blur md:block">
            <summary className="cursor-pointer list-none text-[10px] font-black uppercase tracking-[0.28em] text-[#00ff80]">
              REIE Search FAQ
            </summary>
            <div className="mt-4 max-h-[52vh] space-y-4 overflow-auto pr-2">
              {faqItems.slice(0, 4).map((faq) => (
                <article key={faq.question} className="border-t border-white/10 pt-4">
                  <h2 className="text-[10px] font-black uppercase leading-5 tracking-[0.14em] text-white/80">
                    {faq.question}
                  </h2>
                  <p className="mt-2 text-[11px] leading-5 text-white/50">{faq.answer}</p>
                </article>
              ))}
            </div>
          </details>
        ) : null}
      </section>
    </div>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/search/SearchInterface.tsx
