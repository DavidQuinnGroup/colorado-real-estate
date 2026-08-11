import Link from 'next/link';
import { ArrowRight, ClipboardCheck, FileSearch, Scale, ShieldCheck, Waypoints } from 'lucide-react';

import type { OfferPreparationReadiness, OfferPreparationStageKey } from '@/lib/offerPreparationReadiness';

type OfferPreparationPanelProps = {
  model: OfferPreparationReadiness;
};

const stageIcons: Record<OfferPreparationStageKey, typeof FileSearch> = {
  UNDERSTAND: FileSearch,
  COMPARE: Scale,
  VERIFY: ShieldCheck,
  PREPARE: ClipboardCheck,
  NEXT_STEP: Waypoints,
};

function evidenceTone(state: string) {
  if (state === 'SUPPORTED FACT') return 'border-emerald-100/24 bg-emerald-100/[0.06] text-emerald-100';
  if (state === 'DERIVED / CALCULATED') return 'border-cyan-100/24 bg-cyan-100/[0.06] text-cyan-100';
  if (state === 'CUSTOMER CONTROLLED') return 'border-white/14 bg-white/[0.055] text-white/70';
  return 'border-amber-100/24 bg-amber-100/[0.075] text-amber-100';
}

export default function OfferPreparationPanel({ model }: OfferPreparationPanelProps) {
  return (
    <section
      id="offer-preparation"
      className="overflow-hidden rounded-[8px] border border-cyan-100/20 bg-[#0d141c]"
      data-testid="offer-preparation-readiness"
      data-offer-preparation-status={model.status}
      data-offer-preparation-stage-count={model.stages.length}
      data-offer-preparation-question={model.governingQuestion}
      data-offer-preparation-missing-evidence="verification-required"
      data-offer-preparation-hidden-customer-state={String(model.protectedBoundaries.hiddenCustomerState)}
      data-offer-preparation-persistence={String(model.protectedBoundaries.persistence)}
      data-offer-preparation-api={String(model.protectedBoundaries.api)}
      data-offer-preparation-authentication={String(model.protectedBoundaries.authentication)}
      data-offer-preparation-crm={String(model.protectedBoundaries.crm)}
      data-offer-preparation-email={String(model.protectedBoundaries.email)}
      data-offer-preparation-telemetry={String(model.protectedBoundaries.telemetry)}
      data-offer-preparation-mls={String(model.protectedBoundaries.mls)}
      data-offer-preparation-typesense={String(model.protectedBoundaries.typesense)}
      data-offer-preparation-provider-activation={String(model.protectedBoundaries.providerActivation)}
      data-offer-preparation-county-activation={String(model.protectedBoundaries.countyActivation)}
      data-offer-preparation-public-gis={String(model.protectedBoundaries.publicGis)}
      data-offer-preparation-local-storage={String(model.protectedBoundaries.localStorage)}
      data-offer-preparation-session-storage={String(model.protectedBoundaries.sessionStorage)}
      data-offer-preparation-protected-class-inference={String(model.protectedBoundaries.protectedClassInference)}
      data-offer-preparation-demographic-steering={String(model.protectedBoundaries.demographicSteering)}
      data-offer-preparation-school-ranking={String(model.protectedBoundaries.schoolRanking)}
      data-offer-preparation-safety-ranking={String(model.protectedBoundaries.safetyRanking)}
      data-offer-preparation-neighborhood-suitability={String(model.protectedBoundaries.neighborhoodSuitability)}
      data-offer-preparation-offer-price={String(model.prohibitedOutputs.offerPrice)}
      data-offer-preparation-bid-recommendation={String(model.prohibitedOutputs.bidRecommendation)}
      data-offer-preparation-acceptance-prediction={String(model.prohibitedOutputs.acceptancePrediction)}
      data-offer-preparation-offer-drafting={String(model.prohibitedOutputs.contractLanguage || model.prohibitedOutputs.offerForm)}
      data-offer-preparation-offer-submission={String(model.prohibitedOutputs.offerSubmission)}
      data-offer-preparation-valuation={String(model.prohibitedOutputs.valuation)}
      data-offer-preparation-ranking-winner={String(model.prohibitedOutputs.rankingWinner)}
      data-offer-preparation-suitability={String(model.prohibitedOutputs.suitabilityConclusion)}
      data-offer-preparation-investment={String(model.prohibitedOutputs.investmentConclusion)}
      data-offer-preparation-legal-advice={String(model.prohibitedOutputs.legalAdvice)}
      data-offer-preparation-tax-advice={String(model.prohibitedOutputs.taxAdvice)}
      data-offer-preparation-lender-advice={String(model.prohibitedOutputs.lenderAdvice)}
    >
      <div className="border-b border-white/10 bg-cyan-100/[0.055] p-5 md:p-7">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
          <div className="max-w-4xl">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-100/76">
              Offer Preparation
            </p>
            <h2 className="mt-3 text-2xl font-black uppercase tracking-tight text-white md:text-3xl">
              Verify and organize the decision before pursuing {model.propertyLabel}.
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-white/58 md:text-base md:leading-7">
              This sequence connects the current property evidence to comparison, verification, professional preparation, and customer-controlled next steps.
            </p>
          </div>
          <span className="inline-flex min-h-8 shrink-0 items-center rounded-[6px] border border-cyan-100/24 bg-black/22 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-cyan-100">
            Preparation only
          </span>
        </div>
      </div>

      <div className="grid gap-px bg-white/10 lg:grid-cols-5">
        {model.stages.map((stage) => {
          const Icon = stageIcons[stage.key];

          return (
            <article
              key={stage.key}
              className="bg-[#0d141c] p-4 md:p-5"
              data-testid="offer-preparation-stage"
              data-offer-preparation-stage={stage.key}
              data-offer-preparation-evidence-state={stage.evidenceState}
            >
              <div className="flex items-start justify-between gap-3">
                <Icon size={18} className="mt-0.5 shrink-0 text-cyan-100" aria-hidden="true" />
                <span className={`inline-flex min-h-7 items-center rounded-[5px] border px-2 py-1 text-[9px] font-black uppercase tracking-[0.11em] ${evidenceTone(stage.evidenceState)}`}>
                  {stage.evidenceState}
                </span>
              </div>
              <p className="mt-4 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/62">{stage.label}</p>
              <h3 className="mt-3 text-sm font-black uppercase leading-5 tracking-[0.08em] text-white">{stage.question}</h3>
              <p className="mt-3 text-xs leading-5 text-white/54 md:text-sm md:leading-6">{stage.guidance}</p>
              <Link
                href={stage.href}
                className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-[6px] border border-white/10 bg-white/[0.045] px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-cyan-100 transition hover:border-cyan-100/40 hover:bg-cyan-100/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
                data-testid="offer-preparation-stage-link"
              >
                {stage.action}
                <ArrowRight size={13} aria-hidden="true" />
              </Link>
            </article>
          );
        })}
      </div>

      <div className="grid gap-px border-t border-white/10 bg-white/10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="bg-[#0d141c] p-5 md:p-6">
          <h3 className="text-[11px] font-black uppercase tracking-[0.18em] text-white/70">
            Evidence limits
          </h3>
          <ul className="mt-4 space-y-3 text-xs leading-5 text-white/58 md:text-sm md:leading-6">
            {model.evidenceLimits.map((limit) => (
              <li key={limit}>{limit}</li>
            ))}
          </ul>
          <div className="mt-5 grid gap-2">
            {model.sourceTrustBoundaries.map((boundary) => (
              <p
                key={boundary}
                className="rounded-[6px] border border-amber-100/14 bg-amber-100/[0.055] p-3 text-[10px] font-black uppercase tracking-[0.12em] text-amber-100/78"
                data-testid="offer-preparation-source-trust-boundary"
              >
                {boundary}
              </p>
            ))}
          </div>
        </div>
        <div className="bg-[#0d141c] p-5 md:p-6">
          <h3 className="text-[11px] font-black uppercase tracking-[0.18em] text-white/70">
            Continue with the right path
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {model.continuityLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-[6px] border border-white/10 bg-white/[0.035] p-4 text-white no-underline transition hover:border-cyan-100/30 hover:bg-cyan-100/[0.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
                data-testid="offer-preparation-continuity-link"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-cyan-100/62">{link.label}</p>
                <p className="mt-2 text-xs leading-5 text-white/54">{link.role}</p>
              </Link>
            ))}
          </div>
          <p className="mt-5 text-xs leading-5 text-white/42">
            These paths keep the customer in control and do not submit forms, transfer unsubmitted notes, or start a transaction.
          </p>
        </div>
      </div>
    </section>
  );
}
