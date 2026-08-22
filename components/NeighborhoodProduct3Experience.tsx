import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, Compass, Home, Layers3, MapPinned, ShieldCheck } from 'lucide-react';

import DisclosureStateIndicator from '@/components/DisclosureStateIndicator';
import type {
  NeighborhoodProduct3Confidence,
  NeighborhoodProduct3EvidenceState,
  NeighborhoodProduct3Model,
} from '@/lib/neighborhoodProduct3';

type NeighborhoodProduct3ExperienceProps = {
  model: NeighborhoodProduct3Model;
};

function evidenceLabel(state: NeighborhoodProduct3EvidenceState) {
  if (state === 'complete') return 'Complete evidence';
  if (state === 'conflict') return 'Limited evidence';
  if (state === 'missing') return 'Unavailable evidence';
  return 'Limited evidence';
}

function confidenceLabel(confidence: NeighborhoodProduct3Confidence) {
  if (confidence === 'well-supported') return 'Well supported';
  if (confidence === 'review-context') return 'Review context';
  return 'Limited evidence';
}

function confidenceClass(confidence: NeighborhoodProduct3Confidence) {
  if (confidence === 'well-supported') return 'border-emerald-100/24 bg-emerald-100/[0.07] text-emerald-100';
  if (confidence === 'review-context') return 'border-cyan-100/24 bg-cyan-100/[0.07] text-cyan-100';
  return 'border-amber-100/24 bg-amber-100/[0.08] text-amber-100';
}

function stateClass(state: NeighborhoodProduct3EvidenceState) {
  if (state === 'complete') return 'border-emerald-100/24 bg-emerald-100/[0.06] text-emerald-100';
  if (state === 'conflict' || state === 'missing') return 'border-amber-100/24 bg-amber-100/[0.08] text-amber-100';
  return 'border-cyan-100/24 bg-cyan-100/[0.06] text-cyan-100';
}

export default function NeighborhoodProduct3Experience({ model }: NeighborhoodProduct3ExperienceProps) {
  return (
    <section
      id="neighborhood-decision-profile"
      className="reie-neighborhood-product-3 mx-auto w-full max-w-7xl px-6 pt-8 md:px-12"
      aria-labelledby="neighborhood-product-3-heading"
    >
      <div
        className="reie-neighborhood-product-3-shell overflow-hidden rounded-[8px] border border-cyan-100/20 bg-[#071017]"
        data-testid="neighborhood-product-3-root"
        data-neighborhood-product-3="true"
        data-neighborhood-product-3-evidence-state={model.evidenceState}
        data-neighborhood-product-3-rich-interpretation={String(model.richInterpretationAllowed)}
        data-neighborhood-product-3-ai="false"
        data-neighborhood-product-3-gis="false"
        data-neighborhood-product-3-provider-activation="false"
        data-neighborhood-product-3-telemetry="false"
        data-neighborhood-product-3-forecasting="false"
        data-neighborhood-product-3-valuation-model="false"
        data-neighborhood-product-3-rankings="false"
        data-neighborhood-product-3-suitability-scoring="false"
        data-neighborhood-product-3-demographic-targeting="false"
        data-neighborhood-product-3-school-ranking="false"
        data-neighborhood-product-3-safety-ranking="false"
        data-neighborhood-product-3-fixture-data="false"
        data-neighborhood-product-3-admin-leakage="false"
      >
        <style>{`
          @media (min-width: 768px) {
            .neighborhood-product-3-mobile-rail {
              display: none !important;
            }
          }
        `}</style>
        <div className="reie-neighborhood-product-3-header border-b border-white/10 bg-cyan-100/[0.055] p-5 md:p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div className="max-w-4xl">
              <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/76">
                <Compass size={14} aria-hidden="true" />
                Neighborhood Evidence Profile
              </p>
              <h2 id="neighborhood-product-3-heading" className="mt-3 text-2xl font-black uppercase leading-tight tracking-normal text-white md:text-3xl">
                Decision profile before neighborhood detail
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/62 md:text-base">{model.summary}</p>
            </div>
            <span className={`reie-neighborhood-product-3-chip inline-flex min-h-8 items-center rounded-[6px] border px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] ${stateClass(model.evidenceState)}`}>
              {evidenceLabel(model.evidenceState)}
            </span>
          </div>
          <nav
            className="neighborhood-product-3-mobile-rail mt-5 grid grid-cols-2 gap-2 min-[420px]:grid-cols-5"
            aria-label="Neighborhood decision sections"
            data-testid="neighborhood-product-3-mobile-decision-rail"
          >
            {[
              ['Profile', '#neighborhood-decision-profile'],
              ['Constellation', '#community-constellation'],
              ['Confidence', '#neighborhood-confidence-layer'],
              ['Properties', '#neighborhood-property-context'],
              ['Verify', '#neighborhood-verification-checklist'],
            ].map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="reie-neighborhood-product-3-rail-link inline-flex min-h-10 min-w-0 items-center justify-center rounded-[6px] border border-white/10 bg-white/[0.055] px-2 py-2 text-center text-[9px] font-black uppercase tracking-[0.08em] text-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-100/70"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="reie-neighborhood-product-3-profile-grid grid gap-px bg-white/10 md:grid-cols-3">
          {model.profile.map((item) => (
            <article
              key={item.label}
              className="reie-neighborhood-product-3-card bg-[#071017] p-4 md:p-5"
              data-testid="neighborhood-product-3-decision-profile-item"
              data-neighborhood-product-3-profile-state={item.state}
            >
              <span className={`reie-neighborhood-product-3-chip inline-flex rounded-[5px] border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] ${stateClass(item.state)}`}>
                {evidenceLabel(item.state)}
              </span>
              <h3 className="mt-4 text-sm font-black uppercase leading-5 tracking-[0.08em] text-white">{item.label}</h3>
              <p className="mt-3 text-sm leading-6 text-white/62">{item.summary}</p>
              <p className="mt-3 border-t border-white/10 pt-3 text-xs leading-5 text-white/44">{item.verify}</p>
            </article>
          ))}
        </div>

        <section
          id="community-constellation"
          className="border-t border-white/10"
          data-testid="neighborhood-product-3-community-constellation"
          data-community-constellation-scoring="false"
          data-community-constellation-ranking="false"
          data-community-constellation-suitability="false"
          data-community-constellation-demographics="false"
          data-community-constellation-school-quality="false"
          data-community-constellation-safety-claims="false"
        >
          <div className="reie-neighborhood-product-3-constellation-layout grid gap-px bg-white/10 lg:grid-cols-[0.74fr_1.26fr]">
            <div className="reie-neighborhood-product-3-card bg-[#071017] p-5 md:p-6">
              <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/76">
                <Layers3 size={14} aria-hidden="true" />
                Community Constellation
              </p>
              <h3 className="mt-3 text-xl font-black uppercase leading-tight tracking-normal text-white">
                Factual orientation points
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/56">
                The constellation connects place, housing pattern, market context, property discovery, and verification needs without ordering neighborhoods or recommending where someone should live.
              </p>
            </div>
            <div className="reie-neighborhood-product-3-constellation-grid grid gap-px bg-white/10 md:grid-cols-2">
              {model.constellation.map((dimension) => (
                <article
                  key={dimension.label}
                  className="reie-neighborhood-product-3-card bg-[#071017] p-4 md:p-5"
                  data-testid="neighborhood-product-3-constellation-dimension"
                  data-community-constellation-dimension={dimension.label}
                  data-community-constellation-evidence={dimension.evidence}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <h4 className="text-sm font-black uppercase leading-5 tracking-[0.08em] text-white">{dimension.label}</h4>
                    <span className={`reie-neighborhood-product-3-chip inline-flex shrink-0 rounded-[5px] border px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] ${confidenceClass(dimension.evidence)}`}>
                      {confidenceLabel(dimension.evidence)}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/60">{dimension.orientation}</p>
                  <p className="mt-3 text-xs leading-5 text-white/42">{dimension.verify}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="reie-neighborhood-product-3-table overflow-x-auto border-t border-white/10 bg-[#071017] p-4" data-testid="neighborhood-product-3-constellation-table">
            <table className="w-full min-w-[640px] text-left text-xs text-white/62">
              <caption className="sr-only">Community Constellation accessible evidence table</caption>
              <thead className="text-[10px] uppercase tracking-[0.16em] text-white/42">
                <tr>
                  <th scope="col" className="py-2 pr-4">Dimension</th>
                  <th scope="col" className="py-2 pr-4">Evidence</th>
                  <th scope="col" className="py-2 pr-4">Orientation</th>
                  <th scope="col" className="py-2 pr-4">Verify</th>
                </tr>
              </thead>
              <tbody>
                {model.constellation.map((dimension) => (
                  <tr key={dimension.label} className="border-t border-white/10">
                    <th scope="row" className="py-3 pr-4 text-white">{dimension.label}</th>
                    <td className="py-3 pr-4">{confidenceLabel(dimension.evidence)}</td>
                    <td className="py-3 pr-4">{dimension.orientation}</td>
                    <td className="py-3 pr-4">{dimension.verify}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="neighborhood-confidence-layer" className="border-t border-white/10">
          <div className="reie-neighborhood-product-3-confidence-summary grid gap-px bg-white/10 md:grid-cols-3">
            {model.confidence.slice(0, 3).map((facet) => (
              <article
                key={`summary-${facet.label}`}
                className="reie-neighborhood-product-3-card bg-[#071017] p-4 md:p-5"
                data-testid="neighborhood-product-3-confidence-summary"
                data-neighborhood-product-3-confidence-summary={facet.confidence}
              >
                <span className={`reie-neighborhood-product-3-chip inline-flex rounded-[5px] border px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] ${confidenceClass(facet.confidence)}`}>
                  {confidenceLabel(facet.confidence)}
                </span>
                <h4 className="mt-4 text-sm font-black uppercase tracking-[0.08em] text-white">{facet.label}</h4>
                <p className="mt-3 text-xs leading-5 text-white/56">{facet.detail}</p>
              </article>
            ))}
          </div>
          <details className="bg-white/[0.025]" data-testid="neighborhood-product-3-confidence-layer">
            <summary className="flex cursor-pointer items-center gap-3 p-5 text-sm font-black uppercase tracking-[0.12em] text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-100/70 md:p-6">
              <ShieldCheck size={16} aria-hidden="true" />
              Neighborhood Confidence Layer
              <DisclosureStateIndicator className="ml-auto h-4 w-4" />
            </summary>
            <div className="reie-neighborhood-product-3-confidence-grid grid gap-px bg-white/10 md:grid-cols-3">
              {model.confidence.map((facet) => (
                <article
                  key={facet.label}
                  className="reie-neighborhood-product-3-card bg-[#071017] p-4"
                  data-testid="neighborhood-product-3-confidence-facet"
                  data-neighborhood-product-3-confidence={facet.confidence}
                >
                  <span className={`reie-neighborhood-product-3-chip inline-flex rounded-[5px] border px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] ${confidenceClass(facet.confidence)}`}>
                    {confidenceLabel(facet.confidence)}
                  </span>
                  <h4 className="mt-4 text-sm font-black uppercase tracking-[0.08em] text-white">{facet.label}</h4>
                  <p className="mt-3 text-xs leading-5 text-white/56">{facet.detail}</p>
                </article>
              ))}
            </div>
          </details>
        </section>

        <section
          id="neighborhood-verification-checklist"
          className="border-t border-white/10"
          data-testid="neighborhood-product-3-verification-checklist"
        >
          <div className="border-b border-white/10 bg-white/[0.025] p-5 md:p-6">
            <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/76">
              <CheckCircle2 size={14} aria-hidden="true" />
              Verification Checklist
            </p>
            <h3 className="mt-3 text-xl font-black uppercase tracking-tight text-white">What to confirm before relying on neighborhood context</h3>
          </div>
          <div className="reie-neighborhood-product-3-verification-grid grid gap-px bg-white/10 md:grid-cols-5">
            {model.checklist.map((item) => (
              <article key={item.label} className="reie-neighborhood-product-3-card bg-[#071017] p-4" data-testid="neighborhood-product-3-verification-item">
                <h4 className="text-sm font-black uppercase leading-5 tracking-[0.08em] text-white">{item.label}</h4>
                <p className="mt-3 text-xs leading-5 text-white/54">{item.prompt}</p>
              </article>
            ))}
          </div>
          <p className="border-t border-white/10 bg-black/18 p-4 text-xs leading-6 text-white/42">{model.trustBoundary}</p>
        </section>

        <section
          id="neighborhood-market-context"
          className="border-t border-white/10"
          data-testid="neighborhood-product-3-market-context"
          data-neighborhood-market-context-forecasting="false"
          data-neighborhood-market-context-valuation="false"
        >
          <div className="reie-neighborhood-product-3-market-grid grid gap-px bg-white/10 md:grid-cols-[0.75fr_1.25fr]">
            <div className="reie-neighborhood-product-3-card bg-[#071017] p-5 md:p-6">
              <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/76">
                <MapPinned size={14} aria-hidden="true" />
                Market Context
              </p>
              <h3 className="mt-3 text-xl font-black uppercase tracking-tight text-white">Read the neighborhood with its city market</h3>
            </div>
            <div className="reie-neighborhood-product-3-card bg-[#071017] p-5 md:p-6">
              <p className="text-sm leading-7 text-white/62">{model.marketContext.summary}</p>
              <Link
                href={model.marketContext.cityHref}
                className="reie-neighborhood-product-3-action reie-decision-link reie-decision-link--secondary mt-5 inline-flex min-h-11 items-center gap-2 rounded-[6px] px-4 py-2 text-[10px] font-black uppercase tracking-[0.12em] transition focus:outline-none focus:ring-2 focus:ring-cyan-100/70"
              >
                City Market Context
                <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section
          id="neighborhood-property-context"
          className="border-t border-white/10"
          data-testid="neighborhood-product-3-property-context"
          data-neighborhood-property-context-ranking="false"
          data-neighborhood-property-context-recommendation="false"
          data-neighborhood-property-context-valuation="false"
        >
          <div className="border-b border-white/10 bg-white/[0.025] p-5 md:p-6">
            <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/76">
              <Home size={14} aria-hidden="true" />
              Available Property Context
            </p>
            <h3 className="mt-3 text-xl font-black uppercase tracking-tight text-white">Use property links to explore available context</h3>
          </div>
          <div className="reie-neighborhood-product-3-property-grid grid gap-px bg-white/10 md:grid-cols-2">
            {model.propertyContext.map((item) => (
              <Link
                key={item.label}
                href={item.href}
              className="reie-neighborhood-product-3-card reie-neighborhood-product-3-property-link group bg-[#071017] p-5 transition hover:bg-white/[0.045]"
                data-testid="neighborhood-product-3-property-context-item"
                data-neighborhood-property-context-source={item.source}
              >
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/60">{item.source === 'indexed-search' ? 'Search Index Path' : 'Search Path'}</p>
                <h4 className="mt-3 text-sm font-black uppercase leading-5 tracking-[0.08em] text-white group-hover:text-cyan-100">{item.label}</h4>
                <p className="mt-3 text-sm leading-6 text-white/56">{item.description}</p>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </section>
  );
}
