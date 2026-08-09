import Link from 'next/link';
import { ClipboardCheck, Compass, FileSearch, Fingerprint, Layers3, MessageCircleQuestion, ShieldCheck, Waypoints } from 'lucide-react';

import type { PropertyProduct31Model, PropertyProduct31Confidence } from '@/lib/propertyProduct31';
import { buildPropertyInquiryPreparationIntelligence } from '@/lib/propertyInquiryDecisionContinuity';

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
  const inquiryPreparation = buildPropertyInquiryPreparationIntelligence({
    deepening: model.deepening,
    authoritativeSources: model.authoritativeSources,
    comparisonIntelligence: model.comparisonIntelligence,
    checklist: model.checklist,
  });
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
      data-property-evidence-completeness-status={model.evidenceCompleteness.status}
      data-property-evidence-completeness-domain-count={model.evidenceCompleteness.domains.length}
      data-property-evidence-completeness-score={String(model.evidenceCompleteness.protectedBoundaries.score)}
      data-property-evidence-completeness-percentage={String(model.evidenceCompleteness.protectedBoundaries.percentage)}
      data-property-evidence-completeness-grade={String(model.evidenceCompleteness.protectedBoundaries.grade)}
      data-property-evidence-completeness-rating={String(model.evidenceCompleteness.protectedBoundaries.rating)}
      data-property-evidence-completeness-ranking={String(model.evidenceCompleteness.protectedBoundaries.ranking)}
      data-property-evidence-completeness-suitability={String(model.evidenceCompleteness.protectedBoundaries.suitability)}
      data-property-evidence-completeness-valuation-certainty={String(model.evidenceCompleteness.protectedBoundaries.valuationCertainty)}
      data-property-evidence-completeness-financial-qualification={String(model.evidenceCompleteness.protectedBoundaries.financialQualification)}
      data-property-evidence-completeness-provider-activation={String(model.evidenceCompleteness.protectedBoundaries.providerActivation)}
      data-property-evidence-completeness-county-activation={String(model.evidenceCompleteness.protectedBoundaries.countyActivation)}
      data-property-evidence-completeness-bcod-activation={String(model.evidenceCompleteness.protectedBoundaries.bcodActivation)}
      data-property-evidence-completeness-record-retrieval={String(model.evidenceCompleteness.protectedBoundaries.recordRetrieval)}
      data-property-evidence-completeness-api-mutation={String(model.evidenceCompleteness.protectedBoundaries.apiMutation)}
      data-property-evidence-completeness-inquiry-mutation={String(model.evidenceCompleteness.protectedBoundaries.inquiryMutation)}
      data-property-evidence-completeness-contact-mutation={String(model.evidenceCompleteness.protectedBoundaries.contactMutation)}
      data-property-evidence-completeness-crm-email={String(model.evidenceCompleteness.protectedBoundaries.crmEmail)}
      data-property-evidence-completeness-persistence={String(model.evidenceCompleteness.protectedBoundaries.persistence)}
      data-property-evidence-completeness-telemetry={String(model.evidenceCompleteness.protectedBoundaries.telemetry)}
      data-property-evidence-completeness-customer-data-expansion={String(model.evidenceCompleteness.protectedBoundaries.customerDataExpansion)}
      data-property-intelligence-deepening={model.deepening.status}
      data-property-intelligence-derived-count={model.deepening.derivedFacts.length}
      data-property-intelligence-history-count={model.deepening.history.length}
      data-property-intelligence-source-trace-count={model.deepening.sourceTrace.length}
      data-property-intelligence-valuation={String(model.deepening.protectedBoundaries.valuation)}
      data-property-intelligence-appraisal={String(model.deepening.protectedBoundaries.appraisal)}
      data-property-intelligence-listing-price-recommendation={String(model.deepening.protectedBoundaries.listingPriceRecommendation)}
      data-property-intelligence-sale-prediction={String(model.deepening.protectedBoundaries.salePrediction)}
      data-property-intelligence-provider-activation={String(model.deepening.protectedBoundaries.providerActivation)}
      data-property-intelligence-assessor-retrieval={String(model.deepening.protectedBoundaries.assessorRetrieval)}
      data-property-intelligence-bcod-activation={String(model.deepening.protectedBoundaries.bcodActivation)}
      data-property-intelligence-persistence={String(model.deepening.protectedBoundaries.persistence)}
      data-property-intelligence-telemetry={String(model.deepening.protectedBoundaries.telemetry)}
      data-property-comparison-intelligence={model.comparisonIntelligence.status}
      data-property-comparison-ranking={String(model.comparisonIntelligence.protectedBoundaries.ranking)}
      data-property-comparison-scoring={String(model.comparisonIntelligence.protectedBoundaries.scoring)}
      data-property-comparison-valuation={String(model.comparisonIntelligence.protectedBoundaries.valuation)}
      data-property-comparison-suitability={String(model.comparisonIntelligence.protectedBoundaries.suitabilityRecommendation)}
      data-property-comparison-financing-approval={String(model.comparisonIntelligence.protectedBoundaries.financingApproval)}
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
      data-property-inquiry-preparation-intelligence={inquiryPreparation.status}
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
            ['Evidence', '#property-evidence-completeness'],
            ['Deepen', '#property-intelligence-deepening'],
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
        id="property-evidence-completeness"
        className="border-t border-white/10"
        data-testid="property-evidence-completeness-verification"
        data-property-evidence-completeness-source-href={model.evidenceCompleteness.sourceMethodologyHref}
      >
        <div className="border-b border-white/10 bg-white/[0.025] p-5 md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-4xl">
              <p className="reie-property-product-31-eyebrow flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/76">
                <FileSearch size={14} aria-hidden="true" />
                Evidence Completeness
              </p>
              <h3 className="reie-property-product-31-section-title mt-3 text-xl font-black uppercase tracking-tight text-white">
                What is supported, missing, or verification-bound?
              </h3>
              <p className="reie-property-product-31-copy mt-3 text-sm leading-6 text-white/56">{model.evidenceCompleteness.question}</p>
            </div>
            <Link
              href={model.evidenceCompleteness.sourceMethodologyHref}
              className="inline-flex min-h-9 shrink-0 items-center justify-center rounded-[6px] border border-cyan-100/24 bg-cyan-100/[0.07] px-3 py-2 text-[10px] font-black uppercase tracking-[0.13em] text-cyan-100 transition hover:bg-cyan-100/[0.12] focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:ring-offset-2 focus:ring-offset-[#0d141c]"
              data-testid="property-evidence-completeness-methodology-link"
            >
              Sources & Methodology
            </Link>
          </div>
        </div>
        <div className="grid gap-px bg-white/10 lg:grid-cols-2">
          {model.evidenceCompleteness.domains.map((domain) => (
            <article
              key={domain.key}
              className="reie-property-product-31-card bg-[#0d141c] p-4 md:p-5"
              data-testid="property-evidence-completeness-domain"
              data-property-evidence-completeness-domain={domain.key}
              data-property-evidence-completeness-state={domain.state}
              data-property-evidence-completeness-action={domain.verificationAction}
              data-property-evidence-completeness-professional={domain.optionalProfessionalHandoff}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <h4 className="reie-property-product-31-card-title text-sm font-black uppercase leading-5 tracking-[0.08em] text-white">{domain.label}</h4>
                <span className="inline-flex shrink-0 rounded-[5px] border border-white/12 bg-white/[0.045] px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-white/64">
                  {domain.state}
                </span>
              </div>
              <p className="reie-property-product-31-copy mt-3 text-xs leading-5 text-white/56">{domain.evidenceAvailable}</p>
              <p className="mt-3 border-t border-white/10 pt-3 text-xs leading-5 text-white/42">{domain.missingOrUnverified}</p>
              <div className="mt-4 rounded-[6px] border border-amber-100/16 bg-amber-100/[0.055] p-3">
                <p className="text-[9px] font-black uppercase tracking-[0.13em] text-amber-100/70">{domain.verificationAction}</p>
                <p className="mt-2 text-xs leading-5 text-white/56">{domain.verificationQuestion}</p>
              </div>
              <p className="mt-3 text-[11px] leading-5 text-white/38">Optional handoff: {domain.optionalProfessionalHandoff}</p>
            </article>
          ))}
        </div>
        <div
          className="grid gap-px border-t border-white/10 bg-white/10 md:grid-cols-[1.1fr_0.9fr]"
          data-testid="property-evidence-completeness-trust-boundaries"
        >
          <div className="bg-[#0d141c] p-5 md:p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/40">Comparison boundary</p>
            <p className="mt-3 text-sm leading-6 text-white/56">{model.evidenceCompleteness.comparisonBoundary}</p>
          </div>
          <div className="grid gap-2 bg-[#0d141c] p-5 md:p-6">
            {model.evidenceCompleteness.customerTrustBoundaries.map((boundary) => (
              <p key={boundary} className="rounded-[6px] border border-white/10 bg-white/[0.035] p-3 text-[10px] font-black uppercase leading-4 tracking-[0.12em] text-white/54">
                {boundary}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section
        id="property-intelligence-deepening"
        className="border-t border-white/10"
        data-testid="property-intelligence-deepening"
        data-property-intelligence-deepening-status={model.deepening.status}
        data-property-intelligence-known-public-facts={model.deepening.evidenceProfile.knownPublicFacts}
        data-property-intelligence-derived-facts={model.deepening.evidenceProfile.derivedFacts}
        data-property-intelligence-unavailable-facts={model.deepening.evidenceProfile.unavailableFacts}
        data-property-intelligence-verification-required={model.deepening.evidenceProfile.verificationRequired}
        data-property-intelligence-source-confirmation-pending={model.deepening.evidenceProfile.sourceConfirmationPending}
        data-property-intelligence-source-registry="true"
        data-property-intelligence-tax-retrieval={String(model.deepening.protectedBoundaries.taxRetrieval)}
        data-property-intelligence-permit-retrieval={String(model.deepening.protectedBoundaries.permitRetrieval)}
        data-property-intelligence-customer-data-mutation={String(model.deepening.protectedBoundaries.customerDataMutation)}
      >
        <div className="border-b border-white/10 bg-white/[0.025] p-5 md:p-6">
          <p className="reie-property-product-31-eyebrow flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/76">
            <FileSearch size={14} aria-hidden="true" />
            Property Intelligence Deepening
          </p>
          <h3 className="reie-property-product-31-section-title mt-3 text-xl font-black uppercase tracking-tight text-white">Known facts, derived context, and source limits</h3>
          <p className="reie-property-product-31-copy mt-3 max-w-3xl text-sm leading-6 text-white/56">
            {model.deepening.summary}
          </p>
        </div>
        <div className="grid gap-px bg-white/10 lg:grid-cols-[0.74fr_1.26fr]">
          <div className="bg-[#0d141c] p-5 md:p-6">
            <p className="reie-property-product-31-mini-label text-[10px] font-black uppercase tracking-[0.14em] text-white/40">Evidence profile</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                ['Known public facts', model.deepening.evidenceProfile.knownPublicFacts],
                ['Derived facts', model.deepening.evidenceProfile.derivedFacts],
                ['Needs verification', model.deepening.evidenceProfile.verificationRequired],
                ['Unavailable facts', model.deepening.evidenceProfile.unavailableFacts],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[6px] border border-white/10 bg-white/[0.035] p-4">
                  <p className="text-[9px] font-black uppercase tracking-[0.13em] text-cyan-100/70">{label}</p>
                  <p className="mt-2 text-2xl font-black tracking-normal text-white">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 grid gap-3">
              {model.deepening.sourceTrace.map((source) => (
                <div
                  key={source.sourceId}
                  className="rounded-[6px] border border-white/10 bg-black/18 p-4"
                  data-testid="property-intelligence-source-trace"
                  data-property-intelligence-source-id={source.sourceId}
                  data-property-intelligence-source-state={source.state}
                  data-property-intelligence-source-claim-eligible={String(source.claimEligible)}
                >
                  <p className="text-[9px] font-black uppercase tracking-[0.13em] text-cyan-100/70">{source.customerStatus}</p>
                  <p className="mt-2 text-sm font-black leading-5 text-white">{source.label}</p>
                  <p className="mt-2 text-xs leading-5 text-white/50">{source.use}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-px bg-white/10">
            <div className="grid gap-px bg-white/10 md:grid-cols-2">
              {model.deepening.history.map((event) => (
                <article
                  key={event.key}
                  className="bg-[#0d141c] p-4 md:p-5"
                  data-testid="property-intelligence-history-event"
                  data-property-intelligence-history-key={event.key}
                  data-property-intelligence-history-state={event.state}
                >
                  <span className="inline-flex rounded-[5px] border border-white/12 bg-white/[0.045] px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-white/60">
                    {event.state.replace(/-/g, ' ')}
                  </span>
                  <h4 className="mt-4 text-sm font-black uppercase leading-5 tracking-[0.08em] text-white">{event.label}</h4>
                  <p className="mt-3 text-xs leading-5 text-white/56">{event.evidence}</p>
                  <p className="mt-3 border-t border-white/10 pt-3 text-xs leading-5 text-white/40">{event.interpretation}</p>
                </article>
              ))}
            </div>
            <div className="grid gap-px bg-white/10 md:grid-cols-2">
              {model.deepening.derivedFacts.map((fact) => (
                <article
                  key={fact.key}
                  className="bg-[#0d141c] p-4 md:p-5"
                  data-testid="property-intelligence-derived-fact"
                  data-property-intelligence-derived-key={fact.key}
                  data-property-intelligence-derived-state={fact.state}
                >
                  <h4 className="text-sm font-black uppercase leading-5 tracking-[0.08em] text-white">{fact.label}</h4>
                  <p className="mt-3 text-sm font-bold leading-6 text-cyan-100/80">{fact.value}</p>
                  <p className="mt-3 text-xs leading-5 text-white/50">{fact.explanation}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
        <div className="grid gap-px bg-white/10 md:grid-cols-3">
          {model.deepening.sellerContext.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="bg-[#0d141c] p-4 text-white transition hover:bg-white/[0.04] focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:ring-offset-2 focus:ring-offset-[#0d141c] md:p-5"
              data-testid="property-intelligence-seller-context"
            >
              <span className="text-[9px] font-black uppercase tracking-[0.13em] text-cyan-100/70">Seller context</span>
              <h4 className="mt-3 text-sm font-black uppercase leading-5 tracking-[0.08em] text-white">{item.label}</h4>
              <p className="mt-3 text-xs leading-5 text-white/54">{item.interpretation}</p>
              <p className="mt-3 border-t border-white/10 pt-3 text-xs leading-5 text-white/40">{item.professionalReview}</p>
            </Link>
          ))}
        </div>
      </section>

      <section
        id="property-inquiry-preparation"
        className="border-t border-white/10"
        data-testid="property-inquiry-preparation-intelligence"
        data-property-inquiry-preparation-status={inquiryPreparation.status}
        data-property-inquiry-preparation-question={inquiryPreparation.governingQuestion}
        data-property-inquiry-preparation-relationship={inquiryPreparation.relationship}
        data-property-inquiry-preparation-category-count={inquiryPreparation.categories.length}
        data-property-inquiry-preparation-api-mutation={String(inquiryPreparation.protectedBoundaries.apiMutation)}
        data-property-inquiry-preparation-required-field-expansion={String(inquiryPreparation.protectedBoundaries.requiredFieldExpansion)}
        data-property-inquiry-preparation-hidden-payload={String(inquiryPreparation.protectedBoundaries.hiddenPayloadExpansion)}
        data-property-inquiry-preparation-auto-populate-notes={String(inquiryPreparation.protectedBoundaries.autoPopulateNotes)}
        data-property-inquiry-preparation-crm-email-change={String(inquiryPreparation.protectedBoundaries.crmEmailChange)}
        data-property-inquiry-preparation-persistence-change={String(inquiryPreparation.protectedBoundaries.persistenceChange)}
        data-property-inquiry-preparation-notification-change={String(inquiryPreparation.protectedBoundaries.notificationChange)}
        data-property-inquiry-preparation-property-analysis-transfer={String(inquiryPreparation.protectedBoundaries.propertyAnalysisTransfer)}
        data-property-inquiry-preparation-comparison-transfer={String(inquiryPreparation.protectedBoundaries.comparisonStateTransfer)}
        data-property-inquiry-preparation-financing-transfer={String(inquiryPreparation.protectedBoundaries.financingAssumptionTransfer)}
        data-property-inquiry-preparation-grand-plan-transfer={String(inquiryPreparation.protectedBoundaries.grandPlanStateTransfer)}
        data-property-inquiry-preparation-browsing-history-transfer={String(inquiryPreparation.protectedBoundaries.browsingHistoryTransfer)}
        data-property-inquiry-preparation-lead-metadata-expansion={String(inquiryPreparation.protectedBoundaries.leadMetadataExpansion)}
        data-property-inquiry-preparation-provider-activation={String(inquiryPreparation.protectedBoundaries.providerActivation)}
        data-property-inquiry-preparation-telemetry={String(inquiryPreparation.protectedBoundaries.telemetry)}
        data-property-inquiry-preparation-customer-data-expansion={String(inquiryPreparation.protectedBoundaries.customerDataExpansion)}
      >
        <div className="grid gap-px bg-white/10 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="bg-[#0d141c] p-5 md:p-6">
            <p className="reie-property-product-31-eyebrow flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/76">
              <MessageCircleQuestion size={14} aria-hidden="true" />
              Pre-Inquiry Preparation
            </p>
            <h3 className="reie-property-product-31-section-title mt-3 text-xl font-black uppercase tracking-tight text-white">
              What should I ask before I contact someone?
            </h3>
            <p className="reie-property-product-31-copy mt-3 text-sm leading-6 text-white/56">
              Organize known facts, derived context, source posture, unavailable items, and useful questions before using Property Inquiry.
              Nothing here is copied into notes or sent unless you type it yourself.
            </p>
            <div className="mt-5 rounded-[6px] border border-cyan-100/18 bg-cyan-100/[0.055] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-cyan-100/72">Customer control</p>
              <p className="mt-2 text-xs leading-5 text-white/52">
                Property Inquiry remains email-only for required fields, with optional name, phone, timing, and notes. This preparation
                layer does not change routing, notification, CRM, persistence, or form submission behavior.
              </p>
            </div>
          </div>
          <div className="grid gap-px bg-white/10 md:grid-cols-2">
            {inquiryPreparation.categories.map((category) => (
              <Link
                key={category.key}
                href={category.href}
                className="reie-property-product-31-card bg-[#0d141c] p-4 text-white transition hover:bg-white/[0.045] focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:ring-offset-2 focus:ring-offset-[#0d141c] md:p-5"
                data-testid="property-inquiry-preparation-category"
                data-property-inquiry-preparation-category={category.key}
                data-property-inquiry-preparation-professional-domain={category.professionalDomain}
              >
                <span className="inline-flex rounded-[5px] border border-cyan-100/20 bg-cyan-100/[0.07] px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-cyan-100">
                  {category.professionalDomain.replace(/_/g, ' ').toLowerCase()}
                </span>
                <h4 className="reie-property-product-31-card-title mt-4 text-sm font-black uppercase leading-5 tracking-[0.08em] text-white">
                  {category.label}
                </h4>
                <p className="reie-property-product-31-copy mt-3 text-xs leading-5 text-white/56">{category.known}</p>
                <p className="mt-3 border-t border-white/10 pt-3 text-xs leading-5 text-white/50">{category.usefulAsk}</p>
                <p className="mt-3 text-[11px] leading-5 text-white/38">{category.verification}</p>
              </Link>
            ))}
          </div>
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
        data-testid-property-comparison-intelligence={model.comparisonIntelligence.status}
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
        <div
          className="border-t border-white/10 bg-[#0d141c] p-5 md:p-6"
          data-testid="property-comparison-intelligence"
          data-property-comparison-can-compare={String(model.comparisonIntelligence.canCompare)}
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="reie-property-product-31-mini-label text-[10px] font-black uppercase tracking-[0.14em] text-white/40">Comparison Intelligence</p>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-white/56">{model.comparisonIntelligence.trustBoundary}</p>
            </div>
            <span className="inline-flex min-h-8 shrink-0 items-center rounded-[6px] border border-cyan-100/22 bg-cyan-100/[0.07] px-3 py-1 text-[10px] font-black uppercase tracking-[0.13em] text-cyan-100">
              Facts, not ranking
            </span>
          </div>
          {model.comparisonIntelligence.comparisons.length ? (
            <div className="mt-5 grid gap-3 lg:grid-cols-2">
              {model.comparisonIntelligence.comparisons.slice(0, 2).map((comparison) => (
                <article
                  key={comparison.propertyId}
                  className="rounded-[6px] border border-white/10 bg-white/[0.035] p-4"
                  data-testid="property-comparison-intelligence-item"
                  data-property-comparison-materially-different={comparison.synthesis.materiallyDifferent}
                  data-property-comparison-broadly-similar={comparison.synthesis.broadlySimilar}
                  data-property-comparison-evidence-unavailable={comparison.synthesis.evidenceUnavailable}
                  data-property-comparison-verification-required={comparison.synthesis.verificationRequired}
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-cyan-100/66">{comparison.address}</p>
                  <p className="mt-2 text-xs leading-5 text-white/50">{comparison.headline}</p>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {comparison.dimensions.slice(0, 6).map((dimension) => (
                      <div
                        key={`${comparison.propertyId}-${dimension.key}`}
                        className="rounded-[5px] bg-black/18 p-3"
                        data-testid="property-comparison-dimension"
                        data-property-comparison-dimension={dimension.key}
                        data-property-comparison-state={dimension.state}
                      >
                        <p className="text-[9px] font-black uppercase tracking-[0.12em] text-white/38">{dimension.label}</p>
                        <p className="mt-2 text-xs font-bold leading-5 text-white/60">{dimension.subjectValue} / {dimension.comparisonValue}</p>
                        <p className="mt-2 text-[11px] leading-5 text-white/42">{dimension.investigationPrompt}</p>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-white/50">Comparison intelligence activates when related public listings are available from the existing property-link context.</p>
          )}
        </div>
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
