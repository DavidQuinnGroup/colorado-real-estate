import Link from 'next/link';
import { ArrowRight, CheckCircle2, Compass, Route } from 'lucide-react';

export type ContinueYourDecisionLink = {
  label: string;
  href: string;
  note: string;
};

type ContinueYourDecisionProps = {
  stage: 'home' | 'search' | 'market' | 'neighborhood' | 'property';
  cameFrom: string;
  currentDecision: string;
  whyHere: string;
  nextStep: string;
  links: ContinueYourDecisionLink[];
  tone?: 'dark' | 'light';
};

export default function ContinueYourDecision({
  stage,
  cameFrom,
  currentDecision,
  whyHere,
  nextStep,
  links,
  tone = 'dark',
}: ContinueYourDecisionProps) {
  const isLight = tone === 'light';
  const shellClass = isLight
    ? 'border-[#1f2d36]/12 bg-white text-[#111820] shadow-[0_18px_60px_rgba(17,24,32,0.08)]'
    : 'border-white/10 bg-[#071017]/86 text-white shadow-[0_22px_70px_rgba(0,0,0,0.22)]';
  const mutedTextClass = isLight ? 'text-[#41505a]' : 'text-white/58';
  const eyebrowClass = isLight ? 'text-[#55707a]' : 'text-cyan-100/72';
  const panelClass = isLight ? 'bg-[#f3f7f8] ring-[#1f2d36]/8' : 'bg-black/22 ring-white/8';
  const linkClass = isLight
    ? 'border-[#1f2d36]/12 bg-[#111820] text-white hover:bg-[#24343f] focus-visible:outline-cyan-700'
    : 'border-cyan-100/18 bg-cyan-100/[0.09] text-cyan-100 hover:border-cyan-100/42 hover:bg-cyan-100/[0.14] hover:text-white focus-visible:outline-cyan-200';

  return (
    <section
      className={`overflow-hidden rounded-[8px] border ${shellClass}`}
      data-testid="continue-your-decision"
      data-djx-stage={stage}
      data-djx-ai="false"
      data-djx-gis="false"
      data-djx-telemetry="false"
      data-djx-personalization="false"
      data-djx-provider-activation="false"
      data-djx-forecasting="false"
      data-djx-valuation="false"
      data-djx-rankings="false"
      data-djx-suitability-scoring="false"
      data-djx-demographic-targeting="false"
      data-djx-school-ranking="false"
      data-djx-safety-ranking="false"
      data-djx-fixture-data="false"
    >
      <div className="grid gap-5 p-5 md:grid-cols-[0.82fr_1.18fr] md:p-6">
        <div>
          <p className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] ${eyebrowClass}`}>
            <Route size={14} aria-hidden="true" />
            Continue Your Decision
          </p>
          <h2 className="mt-3 text-2xl font-black uppercase leading-tight tracking-normal md:text-3xl">
            {currentDecision}
          </h2>
          <p className={`mt-4 text-sm leading-7 ${mutedTextClass}`}>{whyHere}</p>
        </div>

        <div className="grid gap-3">
          <div className={`grid gap-3 rounded-[8px] p-4 ring-1 ${panelClass} sm:grid-cols-3`}>
            {[
              ['Before this', cameFrom],
              ['Current focus', currentDecision],
              ['Next step', nextStep],
            ].map(([label, value]) => (
              <div key={label}>
                <p className={`text-[9px] font-black uppercase tracking-[0.16em] ${isLight ? 'text-[#6b7c84]' : 'text-white/34'}`}>{label}</p>
                <p className={`mt-2 text-xs font-semibold leading-5 ${isLight ? 'text-[#22313a]' : 'text-white/68'}`}>{value}</p>
              </div>
            ))}
          </div>

          <nav className="grid gap-2 sm:grid-cols-3" aria-label="Continue your decision">
            {links.map((link) => (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                className={`group flex min-h-14 items-center justify-between gap-3 rounded-[6px] border px-4 py-3 text-xs font-black uppercase tracking-[0.12em] no-underline transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${linkClass}`}
                data-testid="continue-your-decision-link"
              >
                <span className="min-w-0">
                  <span className="block">{link.label}</span>
                  <span className="mt-1 block text-[10px] font-semibold normal-case tracking-normal opacity-62">{link.note}</span>
                </span>
                {link.href.startsWith('#') ? <CheckCircle2 size={15} aria-hidden="true" /> : <ArrowRight size={15} aria-hidden="true" />}
              </Link>
            ))}
          </nav>

          <p className={`flex items-center gap-2 text-xs leading-5 ${mutedTextClass}`}>
            <Compass size={14} aria-hidden="true" />
            This is route context only. It does not personalize or make automated recommendations about a place or property.
          </p>
        </div>
      </div>
    </section>
  );
}
