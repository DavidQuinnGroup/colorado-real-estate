import Link from 'next/link';

import type { LocalSourceFreshnessPresentation } from '@/lib/searchMapLocalTrustAdvancement';

type LocalSourceFreshnessCueProps = {
  presentation: LocalSourceFreshnessPresentation;
};

export default function LocalSourceFreshnessCue({ presentation }: LocalSourceFreshnessCueProps) {
  const items = [
    ['Source', presentation.source],
    ['Observed / Updated', presentation.observedUpdated],
    ['Represents', presentation.representation],
    ['Limitation', presentation.limitation],
  ] as const;

  return (
    <section
      className="rounded-[8px] border border-cyan-100/10 bg-cyan-100/[0.04] p-5"
      data-testid="local-source-freshness-cue"
      data-local-trust-status={presentation.status}
      data-local-trust-surface={presentation.surface}
      data-local-trust-methodology-href={presentation.methodologyHref}
      data-local-trust-source-registry-change={String(presentation.protectedBoundaries.sourceRegistryChange)}
      data-local-trust-provider-activation={String(presentation.protectedBoundaries.providerActivation)}
      data-local-trust-county-activation={String(presentation.protectedBoundaries.countyActivation)}
      data-local-trust-bcod-activation={String(presentation.protectedBoundaries.bcodActivation)}
      data-local-trust-prediction={String(presentation.protectedBoundaries.prediction)}
      data-local-trust-ranking={String(presentation.protectedBoundaries.ranking)}
      data-local-trust-telemetry={String(presentation.protectedBoundaries.telemetry)}
      data-local-trust-persistence={String(presentation.protectedBoundaries.persistence)}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100/72">Source / Freshness</p>
          <h2 className="mt-2 text-xl font-black uppercase leading-tight tracking-normal text-white">{presentation.title}</h2>
        </div>
        <Link
          href={presentation.methodologyHref}
          className="inline-flex min-h-9 items-center justify-center rounded-[6px] border border-cyan-100/24 px-3 text-[10px] font-black uppercase tracking-[0.12em] text-cyan-100 transition hover:border-cyan-100/48 hover:bg-cyan-100/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
          data-testid="local-source-freshness-methodology-link"
        >
          Sources & Methodology
        </Link>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        {items.map(([label, body]) => (
          <article key={label} className="rounded-[6px] bg-black/24 p-4">
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-cyan-100/66">{label}</p>
            <p className="mt-2 text-xs font-bold leading-5 text-white/58">{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
