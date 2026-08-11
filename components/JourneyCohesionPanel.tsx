import Link from 'next/link';
import { ArrowRight, Compass, FileSearch } from 'lucide-react';

import { buildReieDecisionIntelligenceCohesionProfile } from '@/lib/reieDecisionIntelligenceCohesion';

export type JourneyCohesionLink = {
  label: string;
  href: string;
  note: string;
  destination:
    | 'search'
    | 'market'
    | 'city-market'
    | 'property'
    | 'neighborhood'
    | 'buyer'
    | 'seller'
    | 'financing'
    | 'grand-plan'
    | 'advisory'
    | 'home-worth'
    | 'trust';
};

type JourneyCohesionPanelProps = {
  surface:
    | 'home'
    | 'search'
    | 'market'
    | 'compare'
    | 'city'
    | 'property'
    | 'neighborhood'
    | 'buyer'
    | 'seller'
    | 'financing'
    | 'grand-plan'
    | 'home-worth'
    | 'contact';
  eyebrow?: string;
  title: string;
  body: string;
  links: JourneyCohesionLink[];
  tone?: 'dark' | 'light';
};

export default function JourneyCohesionPanel({
  surface,
  eyebrow = 'Continue the Decision',
  title,
  body,
  links,
  tone = 'dark',
}: JourneyCohesionPanelProps) {
  const cohesionProfile = buildReieDecisionIntelligenceCohesionProfile(surface);
  const isLight = tone === 'light';
  const shellClass = isLight
    ? 'bg-white text-[#101820] ring-[#101820]/10 shadow-[0_22px_70px_rgba(16,24,32,0.08)]'
    : 'bg-white/[0.045] text-white ring-white/10 shadow-[0_22px_70px_rgba(0,0,0,0.2)]';
  const bodyClass = isLight ? 'text-[#34444f]/76' : 'text-white/62';
  const eyebrowClass = isLight ? 'text-[#55707a]' : 'text-cyan-100/74';
  const linkClass = isLight
    ? 'bg-[#101820] text-white hover:bg-[#24343f] focus-visible:outline-cyan-700'
    : 'bg-[#071017]/72 text-cyan-100 hover:bg-cyan-100/[0.11] hover:text-white focus-visible:outline-cyan-200';

  return (
    <section
      className={`overflow-hidden rounded-[8px] p-5 ring-1 sm:p-6 ${shellClass}`}
      data-testid="reie-product-cohesion-panel"
      data-reie-product-cohesion-surface={surface}
      data-reie-product-cohesion-ai="false"
      data-reie-product-cohesion-personalization="false"
      data-reie-product-cohesion-telemetry="false"
      data-reie-product-cohesion-gis="false"
      data-reie-product-cohesion-provider-activation="false"
      data-reie-product-cohesion-ranking="false"
      data-reie-product-cohesion-valuation="false"
      data-reie-decision-intelligence-cohesion={cohesionProfile.status}
      data-reie-evidence-language-model={cohesionProfile.evidenceLanguageModel}
      data-reie-continuation-model={cohesionProfile.continuationModel}
      data-reie-source-methodology-href={cohesionProfile.sourceMethodologyHref}
      data-reie-hidden-transfer={String(cohesionProfile.protectedBoundaries.hiddenStateTransfer)}
      data-reie-source-registry-change={String(cohesionProfile.protectedBoundaries.sourceRegistryChange)}
      data-reie-professional-judgment-required="true"
      data-reie-suitability-conclusion={String(cohesionProfile.protectedBoundaries.suitabilityConclusion)}
      data-reie-financial-qualification={String(cohesionProfile.protectedBoundaries.financialQualification)}
    >
      <div className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
        <div>
          <p className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] ${eyebrowClass}`}>
            <Compass size={14} aria-hidden="true" />
            {eyebrow}
          </p>
          <h2 className="mt-3 max-w-2xl text-2xl font-black uppercase leading-tight tracking-normal sm:text-3xl">
            {title}
          </h2>
          <p className={`mt-4 max-w-2xl text-sm leading-7 ${bodyClass}`}>{body}</p>
        </div>

        <div className="grid gap-4">
          <nav className="grid gap-2 sm:grid-cols-3" aria-label={`${surface} journey continuity`} data-testid="reie-product-cohesion-links">
            {links.map((link) => (
              <Link
                key={`${surface}-${link.href}-${link.label}`}
                href={link.href}
                className={`group flex min-h-14 items-center justify-between gap-3 rounded-[6px] px-4 py-3 text-xs font-black uppercase tracking-[0.12em] no-underline transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${linkClass}`}
                data-testid="reie-product-cohesion-link"
                data-reie-product-cohesion-destination={link.destination}
                data-reie-product-cohesion-href={link.href}
                {...(link.href === '/contact#advisory-readiness'
                  ? {
                      'data-advisory-handoff-value-activation': 'true',
                      'data-advisory-handoff-authoritative-destination': '/contact#advisory-readiness',
                      'data-advisory-handoff-hidden-context': 'false',
                      'data-advisory-handoff-query-propagation': 'false',
                      'data-advisory-handoff-prefill': 'false',
                      'data-advisory-handoff-customer-control': 'true',
                    }
                  : {})}
              >
                <span className="min-w-0">
                  <span className="block">{link.label}</span>
                  <span className="mt-1 block text-[10px] font-semibold normal-case leading-4 tracking-normal opacity-65">{link.note}</span>
                </span>
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            ))}
          </nav>

          <div
            className={`grid gap-2 rounded-[8px] p-3 ring-1 ${isLight ? 'bg-[#f3f7f8] ring-[#101820]/8' : 'bg-black/22 ring-white/8'}`}
            data-testid="reie-decision-intelligence-cohesion-cues"
            data-reie-decision-intelligence-cue-count={cohesionProfile.cues.length}
          >
            <div className="grid gap-2 sm:grid-cols-3">
              {cohesionProfile.cues.map((cue) => (
                <div key={`${surface}-${cue.label}`} data-testid="reie-decision-intelligence-evidence-cue">
                  <p className={`text-[9px] font-black uppercase tracking-[0.14em] ${eyebrowClass}`}>{cue.label}</p>
                  <p className={`mt-1 text-[11px] leading-5 ${bodyClass}`}>{cue.body}</p>
                </div>
              ))}
            </div>
            <div className={`flex flex-col gap-2 border-t pt-3 text-xs leading-5 sm:flex-row sm:items-center sm:justify-between ${isLight ? 'border-[#101820]/10 text-[#34444f]/72' : 'border-white/10 text-white/52'}`}>
              <p>{cohesionProfile.boundary}</p>
              <Link
                href={cohesionProfile.sourceMethodologyHref}
                className={`inline-flex shrink-0 items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] no-underline ${isLight ? 'text-[#345f6b]' : 'text-cyan-100/78'}`}
                data-testid="reie-decision-intelligence-source-methodology-link"
              >
                <FileSearch size={13} aria-hidden="true" />
                Sources & Methodology
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
