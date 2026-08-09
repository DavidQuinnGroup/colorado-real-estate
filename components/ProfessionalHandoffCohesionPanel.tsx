import Link from 'next/link';
import { ArrowRight, ClipboardList, FileSearch, ShieldCheck } from 'lucide-react';

import { buildProfessionalHandoffCohesionProfile, type ProfessionalHandoffSurface } from '@/lib/professionalHandoffCohesion';

type ProfessionalHandoffCohesionPanelProps = {
  surface: ProfessionalHandoffSurface;
  tone?: 'dark' | 'light';
  density?: 'standard' | 'compact';
};

export default function ProfessionalHandoffCohesionPanel({
  surface,
  tone = 'dark',
  density = 'standard',
}: ProfessionalHandoffCohesionPanelProps) {
  const profile = buildProfessionalHandoffCohesionProfile(surface);
  const isLight = tone === 'light';
  const isCompact = density === 'compact';
  const shellClass = isLight
    ? 'border-neutral-200 bg-white text-neutral-950'
    : 'border-white/10 bg-white/[0.035] text-white';
  const panelClass = isLight ? 'border-neutral-200 bg-neutral-50 text-neutral-700' : 'border-white/10 bg-[#071017]/70 text-white/60';
  const eyebrowClass = isLight ? 'text-neutral-500' : 'text-cyan-100/72';
  const mutedClass = isLight ? 'text-neutral-700' : 'text-white/62';
  const linkClass = isLight ? 'text-neutral-950' : 'text-cyan-100';

  return (
    <section
      className={`rounded-[8px] border p-5 ${shellClass}`}
      data-testid="professional-handoff-cohesion-panel"
      data-pro-handoff-status={profile.status}
      data-pro-handoff-surface={profile.surface}
      data-pro-handoff-source-methodology-href={profile.sourceMethodologyHref}
      data-pro-handoff-evidence-labels={profile.evidenceLabels.join('|')}
      data-pro-handoff-domain-count={profile.standard.whoMayHelp.length}
      data-pro-handoff-hidden-transfer={String(profile.protectedBoundaries.hiddenTransfer)}
      data-pro-handoff-contact-api-mutation={String(profile.protectedBoundaries.contactApiMutation)}
      data-pro-handoff-property-inquiry-api-mutation={String(profile.protectedBoundaries.propertyInquiryApiMutation)}
      data-pro-handoff-crm-email-expansion={String(profile.protectedBoundaries.crmEmailExpansion)}
      data-pro-handoff-new-required-fields={String(profile.protectedBoundaries.newRequiredFields)}
      data-pro-handoff-hidden-fields={String(profile.protectedBoundaries.hiddenFields)}
      data-pro-handoff-persistence={String(profile.protectedBoundaries.persistence)}
      data-pro-handoff-telemetry={String(profile.protectedBoundaries.telemetry)}
      data-pro-handoff-brokerage-relationship-formation={String(profile.protectedBoundaries.brokerageRelationshipFormation)}
      data-pro-handoff-professional-conclusion={String(profile.protectedBoundaries.professionalConclusion)}
      data-pro-handoff-provider-activation={String(profile.protectedBoundaries.providerActivation)}
      data-pro-handoff-customer-data-expansion={String(profile.protectedBoundaries.customerDataExpansion)}
    >
      <div className={`grid gap-5 ${isCompact ? 'lg:grid-cols-[0.84fr_1.16fr]' : 'lg:grid-cols-[0.76fr_1.24fr]'}`}>
        <div>
          <p className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] ${eyebrowClass}`}>
            <ShieldCheck size={14} aria-hidden="true" />
            Professional Handoff
          </p>
          <h3 className={`${isCompact ? 'mt-3 text-xl' : 'mt-3 text-2xl'} font-black leading-tight tracking-normal`}>
            Know what is supported, what remains unresolved, and who may help.
          </h3>
          <p className={`mt-3 text-sm leading-7 ${mutedClass}`}>
            This handoff is optional and customer-controlled. REIE does not transfer hidden route state, form inputs,
            browsing history, map state, saved context, or private assumptions into Contact or Property Inquiry.
          </p>
        </div>

        <div className="grid gap-3">
          <div className="grid gap-3 md:grid-cols-2">
            <article className={`rounded-[8px] border p-4 ${panelClass}`}>
              <p className={`text-[10px] font-black uppercase tracking-[0.16em] ${eyebrowClass}`}>What REIE Can Support</p>
              <p className="mt-2 text-sm leading-6">{profile.standard.whatReieCanSupport}</p>
            </article>
            <article className={`rounded-[8px] border p-4 ${panelClass}`}>
              <p className={`text-[10px] font-black uppercase tracking-[0.16em] ${eyebrowClass}`}>What Remains Unresolved</p>
              <p className="mt-2 text-sm leading-6">{profile.standard.whatRemainsUnresolved}</p>
            </article>
          </div>

          <div className="grid gap-3 md:grid-cols-[0.92fr_1.08fr]">
            <article className={`rounded-[8px] border p-4 ${panelClass}`}>
              <p className={`text-[10px] font-black uppercase tracking-[0.16em] ${eyebrowClass}`}>Who May Help Verify / Decide</p>
              <ul className="mt-2 grid gap-1.5 text-xs font-bold leading-5">
                {profile.standard.whoMayHelp.map((domain) => (
                  <li key={`${surface}-${domain}`}>{domain}</li>
                ))}
              </ul>
            </article>
            <article className={`rounded-[8px] border p-4 ${panelClass}`}>
              <p className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] ${eyebrowClass}`}>
                <ClipboardList size={13} aria-hidden="true" />
                What To Ask
              </p>
              <ul className="mt-2 grid gap-2 text-sm leading-6">
                {profile.standard.whatToAsk.map((question) => (
                  <li key={`${surface}-${question}`}>{question}</li>
                ))}
              </ul>
            </article>
          </div>

          <div className={`flex flex-col gap-3 rounded-[8px] border p-4 text-sm leading-6 sm:flex-row sm:items-center sm:justify-between ${panelClass}`}>
            <p>{profile.standard.optionalNextAction}</p>
            <Link
              href={profile.sourceMethodologyHref}
              className={`inline-flex shrink-0 items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] underline underline-offset-4 ${linkClass}`}
              data-testid="professional-handoff-source-methodology-link"
            >
              <FileSearch size={13} aria-hidden="true" />
              Sources & Methodology
              <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
