import Link from 'next/link';
import { ClipboardCheck, Compass, FileSearch, Fingerprint, Layers3, ShieldCheck, Waypoints } from 'lucide-react';

import type { PropertyProduct31Model, PropertyProduct31Confidence } from '@/lib/propertyProduct31';

type PropertyProduct31ExperienceProps = {
  model: PropertyProduct31Model;
};

function confidenceLabel(confidence: PropertyProduct31Confidence) {
  if (confidence === 'high') return 'Well supported';
  if (confidence === 'moderate') return 'Review context';
  return 'Limited evidence';
}

function confidenceClass(confidence: PropertyProduct31Confidence) {
  if (confidence === 'high') return 'border-emerald-100/24 bg-emerald-100/[0.07] text-emerald-100';
  if (confidence === 'moderate') return 'border-cyan-100/24 bg-cyan-100/[0.07] text-cyan-100';
  return 'border-amber-100/24 bg-amber-100/[0.08] text-amber-100';
}

function stateClass(state: string) {
  if (state === 'well-supported') return 'border-emerald-100/24 bg-emerald-100/[0.055] text-emerald-100';
  if (state === 'verify-next') return 'border-amber-100/24 bg-amber-100/[0.07] text-amber-100';
  return 'border-white/12 bg-white/[0.045] text-white/72';
}

export default function PropertyProduct31Experience({ model }: PropertyProduct31ExperienceProps) {
  const recordEvidence = model.authoritativeSources.publicRecordEvidence;
  const recordDisposition = (domain: 'ASSESSOR' | 'TAX' | 'PERMIT') =>
    recordEvidence.domainProfiles.find((profile) => profile.domain === domain)?.implementationDisposition ?? 'REMAINS_FAIL_CLOSED';

  return (
    <section
      id="property-decision-profile"
      className="reie-property-product-31 overflow-hidden rounded-[8px] border border-cyan-100/20 bg-[#0d141c]"
      data-testid="property-product-3-1-root"
      data-property-product-3-1-status="public-fact-decision-experience"
      data-property-product-3-1-ai="false"
      data-property-product-3-1-gis="false"
      data-property-product-3-1-provider-activation="false"
      data-property-product-3-1-telemetry="false"
      data-property-product-3-1-forecasting="false"
      data-property-product-3-1-valuation-model="false"
      data-property-product-3-1-rankings="false"
      data-property-product-3-1-fixture-data="false"
      data-property-product-3-1-profile-count={model.profile.length}
      data-property-product-3-1-dna-count={model.dna.length}
      data-property-product-3-1-confidence-count={model.confidence.facets.length}
      data-property-product-3-1-comparable-count={model.comparables.length}
      data-property-product-3-1-checklist-count={model.checklist.length}
      data-property-geographic-source-intelligence={model.authoritativeSources.status}
      data-property-geographic-source-version={model.authoritativeSources.version}
      data-property-geographic-source-city={model.authoritativeSources.geography.city}
      data-property-geographic-source-count={model.authoritativeSources.selectedSources.length}
      data-property-record-intelligence={recordEvidence.status}
      data-property-record-disposition-assessor={recordDisposition('ASSESSOR')}
      data-property-record-disposition-tax={recordDisposition('TAX')}
      data-property-record-disposition-permit={recordDisposition('PERMIT')}
      data-property-record-customer-display={String(recordEvidence.protectedBoundaries.customerRecordDisplay)}
      data-property-record-retrieval={String(recordEvidence.protectedBoundaries.recordRetrieval)}
      data-property-geographic-source-bcod-address-points={String(model.authoritativeSources.protectedBoundaries.bcodAddressPoints)}
      data-property-geographic-source-bcod-park-boundaries={String(model.authoritativeSources.protectedBoundaries.bcodParkBoundaries)}
      data-property-geographic-source-provider-activation={String(model.authoritativeSources.protectedBoundaries.providerActivation)}
      data-property-geographic-source-external-acquisition={String(model.authoritativeSources.protectedBoundaries.externalAcquisition)}
      data-property-geographic-source-public-gis={String(model.authoritativeSources.protectedBoundaries.publicGis)}
      data-property-geographic-source-persistence={String(model.authoritativeSources.protectedBoundaries.persistence)}
      data-property-geographic-source-prisma-change={String(model.authoritativeSources.protectedBoundaries.prismaChange)}
      data-property-geographic-source-telemetry={String(model.authoritativeSources.protectedBoundaries.telemetry)}
      data-property-geographic-source-customer-data-mutation={String(model.authoritativeSources.protectedBoundaries.customerDataMutation)}
    >
      <style>{`
        @media (min-width: 768px) {
          .property-product-31-mobile-decision-rail {
            display: none !important;
          }
        }
      `}</style>
      <div className="reie-property-product-31-header border-b border-white/10 bg-cyan-100/[0.055] p-5 md:p-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div className="max-w-3xl">
            <p className="reie-property-product-31-eyebrow flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/76">
              <Compass size={14} aria-hidden="true" />
              Property Decision Profile
            </p>
            <h2 className="reie-property-product-31-title mt-3 text-xl font-black uppercase tracking-tight text-white md:text-2xl">
              Decision profile before the details
            </h2>
            <p className="reie-property-product-31-copy mt-3 text-sm leading-6 text-white/58">{model.confidence.summary}</p>
          </div>
          <span className="reie-property-product-31-badge inline-flex min-h-8 items-center rounded-[6px] border border-cyan-100/24 bg-black/20 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-cyan-100">
            Public facts only
          </span>
        </div>
        <nav
          className="property-product-31-mobile-decision-rail mt-5 grid grid-cols-2 gap-2"
          aria-label="Property decision sections"
          data-testid="property-product-3-1-mobile-decision-rail"
        >
          {[
            ['Profile', '#property-decision-profile'],
            ['DNA', '#property-dna'],
            ['Compare', '#property-comparable-context'],
            ['Verify', '#property-verification-checklist'],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="reie-property-product-31-rail-link inline-flex min-h-10 items-center justify-center rounded-[6px] border border-white/10 bg-white/[0.055] px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-white/70"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="grid gap-px bg-white/10 md:grid-cols-3">
        {model.profile.map((item) => (
          <article
            key={item.label}
            className="reie-property-product-31-card bg-[#0d141c] p-4 md:p-5"
            data-testid="property-product-3-1-decision-profile-item"
            data-property-product-3-1-profile-state={item.state}
          >
            <span className={`reie-property-product-31-state reie-property-product-31-state-${item.state} inline-flex min-h-7 items-center rounded-[5px] border px-2.5 text-[9px] font-black uppercase tracking-[0.12em] ${stateClass(item.state)}`}>
              {item.state.replace(/-/g, ' ')}
            </span>
            <h3 className="reie-property-product-31-card-title mt-4 text-sm font-black uppercase leading-5 tracking-[0.08em] text-white">{item.label}</h3>
            <p className="reie-property-product-31-copy mt-3 text-sm leading-6 text-white/62">{item.summary}</p>
            <p className="reie-property-product-31-note mt-3 border-t border-white/10 pt-3 text-xs leading-5 text-white/44">{item.verify}</p>
          </article>
        ))}
      </div>

      <section
        id="property-dna"
        className="border-t border-white/10"
        data-testid="property-product-3-1-property-dna"
        data-property-dna-scoring="false"
        data-property-dna-ranking="false"
        data-property-dna-valuation="false"
        data-property-dna-recommendation="false"
      >
        <div className="grid gap-px bg-white/10 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="reie-property-product-31-panel bg-[#0d141c] p-5 md:p-6">
            <p className="reie-property-product-31-eyebrow flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/76">
              <Fingerprint size={14} aria-hidden="true" />
              Property DNA
            </p>
            <h3 className="reie-property-product-31-section-title mt-3 text-xl font-black uppercase tracking-tight text-white">What this property asks you to compare</h3>
            <p className="reie-property-product-31-copy mt-3 text-sm leading-6 text-white/56">
              Deterministic dimensions translate public facts into review areas. They do not score suitability or recommend an outcome.
            </p>
          </div>
          <div className="grid gap-px bg-white/10 md:grid-cols-2">
            {model.dna.map((dimension) => (
              <article
                key={dimension.label}
                className="reie-property-product-31-card bg-[#0d141c] p-4 md:p-5"
                data-testid="property-product-3-1-dna-dimension"
                data-property-dna-evidence={dimension.evidence}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <h4 className="reie-property-product-31-card-title text-sm font-black uppercase leading-5 tracking-[0.08em] text-white">{dimension.label}</h4>
                  <span className={`reie-property-product-31-confidence reie-property-product-31-confidence-${dimension.evidence} inline-flex shrink-0 items-center rounded-[5px] border px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] ${confidenceClass(dimension.evidence)}`}>
                    {confidenceLabel(dimension.evidence)}
                  </span>
                </div>
                <p className="reie-property-product-31-copy mt-3 text-sm leading-6 text-white/60">{dimension.interpretation}</p>
                <p className="reie-property-product-31-note mt-3 text-xs leading-5 text-white/42">{dimension.verify}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="property-confidence-layer"
        className="border-t border-white/10"
        data-testid="property-product-3-1-confidence-layer"
      >
        <div className="border-b border-white/10 bg-white/[0.025] p-5 md:p-6">
          <p className="reie-property-product-31-eyebrow flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/76">
            <ShieldCheck size={14} aria-hidden="true" />
            Confidence Layer
          </p>
          <h3 className="reie-property-product-31-section-title mt-3 text-xl font-black uppercase tracking-tight text-white">Evidence, limits, and next verification action</h3>
        </div>
        <div className="grid gap-px bg-white/10 md:grid-cols-4">
          {model.confidence.facets.map((facet) => (
            <article
              key={facet.label}
              className="reie-property-product-31-card bg-[#0d141c] p-4"
              data-testid="property-product-3-1-confidence-facet"
              data-property-product-3-1-confidence={facet.confidence}
            >
              <span className={`reie-property-product-31-confidence reie-property-product-31-confidence-${facet.confidence} inline-flex rounded-[5px] border px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] ${confidenceClass(facet.confidence)}`}>
                {confidenceLabel(facet.confidence)}
              </span>
              <h4 className="reie-property-product-31-card-title mt-4 text-sm font-black uppercase tracking-[0.08em] text-white">{facet.label}</h4>
              <p className="reie-property-product-31-copy mt-3 text-xs leading-5 text-white/56">{facet.detail}</p>
              <p className="reie-property-product-31-note mt-3 border-t border-white/10 pt-3 text-xs leading-5 text-white/40">{facet.action}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="property-source-readiness"
        className="border-t border-white/10"
        data-testid="property-geographic-source-intelligence"
        data-property-source-readiness-contract="source-geography-subject-freshness-evidence-limitation-claim-intelligence-presentation"
      >
        <div className="border-b border-white/10 bg-white/[0.025] p-5 md:p-6">
          <p className="reie-property-product-31-eyebrow flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/76">
            <Waypoints size={14} aria-hidden="true" />
            Source Readiness
          </p>
          <h3 className="reie-property-product-31-section-title mt-3 text-xl font-black uppercase tracking-tight text-white">Authoritative sources, geography, and what stays unverified</h3>
          <p className="reie-property-product-31-copy mt-3 max-w-3xl text-sm leading-6 text-white/56">
            {model.authoritativeSources.summary}
          </p>
        </div>
        <div className="grid gap-px bg-white/10 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="bg-[#0d141c] p-5 md:p-6">
            <p className="reie-property-product-31-mini-label text-[10px] font-black uppercase tracking-[0.14em] text-white/40">Geography</p>
            <h4 className="mt-3 text-lg font-black uppercase tracking-tight text-white">
              {model.authoritativeSources.geography.neighborhood || model.authoritativeSources.geography.city}
            </h4>
            <p className="mt-3 text-sm leading-6 text-white/56">
              Property geography comes from listing fields and existing governed place context. It is not a parcel boundary, legal description, zoning conclusion, or public GIS activation.
            </p>
            <div
              className="mt-5 rounded-[6px] border border-white/10 bg-white/[0.035] p-4"
              data-testid="property-public-record-evidence-profile"
              data-property-record-correlation-confidence={recordEvidence.propertyCorrelation.correlationConfidence}
              data-property-record-jurisdiction-certainty={recordEvidence.jurisdictionCertainty}
            >
              <p className="reie-property-product-31-mini-label text-[10px] font-black uppercase tracking-[0.14em] text-white/40">Public Record Correlation</p>
              <p className="mt-3 text-xs leading-5 text-white/54">
                {recordEvidence.propertyCorrelation.limitation}
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.13em] text-cyan-100/70">Available fields</p>
                  <p className="mt-2 text-xs leading-5 text-white/50">{recordEvidence.propertyCorrelation.availableIdentifiers.join(', ') || 'Listing field review required'}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.13em] text-amber-100/70">Missing record keys</p>
                  <p className="mt-2 text-xs leading-5 text-white/50">{recordEvidence.propertyCorrelation.missingIdentifiers.join(', ')}</p>
                </div>
              </div>
            </div>
            <div className="mt-5 grid gap-2">
              {model.authoritativeSources.verificationPrompts.slice(0, 3).map((prompt) => (
                <p key={prompt} className="rounded-[6px] border border-white/10 bg-white/[0.04] p-3 text-xs leading-5 text-white/50">
                  {prompt}
                </p>
              ))}
            </div>
          </div>
          <div className="grid gap-px bg-white/10 md:grid-cols-2">
            {model.authoritativeSources.selectedSources.map((source) => (
              <article
                key={source.category}
                className="reie-property-product-31-card bg-[#0d141c] p-4 md:p-5"
                data-testid="property-geographic-source-item"
                data-property-geographic-source-category={source.category}
                data-property-geographic-source-readiness={source.readiness}
                data-property-geographic-source-claim-eligible={String(source.claimEligible)}
                data-property-record-domain={source.recordDomain ?? 'NONE'}
                data-property-record-disposition={source.implementationDisposition ?? 'NONE'}
              >
                <span className={`reie-property-product-31-confidence inline-flex rounded-[5px] border px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] ${source.claimEligible ? confidenceClass('moderate') : confidenceClass('limited')}`}>
                  {source.readiness.replace(/_/g, ' ').toLowerCase()}
                </span>
                <h4 className="reie-property-product-31-card-title mt-4 text-sm font-black uppercase leading-5 tracking-[0.08em] text-white">{source.label}</h4>
                <p className="reie-property-product-31-copy mt-3 text-xs leading-5 text-white/56">{source.evidence}</p>
                {source.implementationDisposition ? (
                  <p className="mt-3 rounded-[5px] border border-amber-100/18 bg-amber-100/[0.055] p-3 text-[11px] leading-5 text-amber-50/68">
                    {source.implementationDisposition.replace(/_/g, ' ').toLowerCase()}: {source.verificationRequirement}
                  </p>
                ) : null}
                <p className="reie-property-product-31-note mt-3 border-t border-white/10 pt-3 text-xs leading-5 text-white/40">{source.limitation}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="property-comparable-context"
        className="border-t border-white/10"
        data-testid="property-product-3-1-comparable-context"
        data-comparable-context-ranking="false"
        data-comparable-context-valuation="false"
        data-comparable-context-investment-advice="false"
      >
        <div className="border-b border-white/10 bg-white/[0.025] p-5 md:p-6">
          <p className="reie-property-product-31-eyebrow flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/76">
            <Layers3 size={14} aria-hidden="true" />
            Comparable Context
          </p>
          <h3 className="reie-property-product-31-section-title mt-3 text-xl font-black uppercase tracking-tight text-white">Why related properties may help the comparison</h3>
          <p className="reie-property-product-31-copy mt-3 max-w-3xl text-sm leading-6 text-white/56">
            Related properties are framed as factual comparison points only. They are not ranked and do not imply value, pricing direction, or investment quality.
          </p>
        </div>
        {model.comparables.length ? (
          <div className="grid gap-px bg-white/10 md:grid-cols-2">
            {model.comparables.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="reie-property-product-31-link-card group bg-[#0d141c] p-4 transition hover:bg-white/[0.045] md:p-5"
                data-testid="property-product-3-1-comparable-item"
                data-property-product-3-1-comparable-id={item.id}
              >
                <p className="reie-property-product-31-eyebrow text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100/58">{item.context}</p>
                <h4 className="reie-property-product-31-card-title mt-3 text-sm font-black uppercase leading-5 tracking-[0.08em] text-white group-hover:text-cyan-100">{item.address}</h4>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="reie-property-product-31-mini-label text-[10px] font-black uppercase tracking-[0.14em] text-white/40">Similarities</p>
                    <ul className="reie-property-product-31-list mt-2 space-y-1 text-xs leading-5 text-white/56">
                      {item.similarities.slice(0, 3).map((similarity) => (
                        <li key={similarity}>{similarity}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="reie-property-product-31-mini-label text-[10px] font-black uppercase tracking-[0.14em] text-white/40">Differences</p>
                    <ul className="reie-property-product-31-list mt-2 space-y-1 text-xs leading-5 text-white/56">
                      {item.differences.slice(0, 3).map((difference) => (
                        <li key={difference}>{difference}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="bg-[#0d141c] p-5 text-sm leading-6 text-white/56">
            No related public listings are available from the existing property-link context. Use search and market context for comparison.
          </p>
        )}
      </section>

      <section
        id="property-verification-checklist"
        className="border-t border-white/10"
        data-testid="property-product-3-1-verification-checklist"
      >
        <div className="grid gap-px bg-white/10 md:grid-cols-[0.72fr_1.28fr]">
          <div className="bg-[#0d141c] p-5 md:p-6">
          <p className="reie-property-product-31-eyebrow reie-property-product-31-eyebrow-amber flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-amber-100">
              <ClipboardCheck size={14} aria-hidden="true" />
              Verification Checklist
            </p>
            <h3 className="reie-property-product-31-section-title mt-3 text-xl font-black uppercase tracking-tight text-white">Questions to carry forward</h3>
            <p className="reie-property-product-31-copy mt-3 text-sm leading-6 text-white/56">
              A concise checklist assembled from existing financial, construction, market, and property guidance.
            </p>
          </div>
          <div className="grid gap-px bg-white/10 md:grid-cols-2">
            {model.checklist.map((item) => (
              <article
                key={`${item.category}-${item.prompt}`}
                className="reie-property-product-31-card bg-[#0d141c] p-4 md:p-5"
                data-testid="property-product-3-1-verification-item"
                data-property-product-3-1-verification-category={item.category}
              >
                <p className="reie-property-product-31-eyebrow reie-property-product-31-eyebrow-amber flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-amber-100/76">
                  <FileSearch size={13} aria-hidden="true" />
                  {item.category}
                </p>
                <p className="reie-property-product-31-copy mt-3 text-sm leading-6 text-white/60">{item.prompt}</p>
              </article>
            ))}
          </div>
        </div>
        <p className="reie-property-product-31-trust border-t border-white/10 bg-black/12 p-4 text-xs leading-5 text-white/42">{model.trustBoundary}</p>
      </section>
    </section>
  );
}
