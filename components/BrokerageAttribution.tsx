import { BROKERAGE_FIRM_NAME, PUBLIC_TEAM_NAME, getBrokerageAttributionSummary } from '@/lib/publicTrust';

export default function BrokerageAttribution() {
  return (
    <section
      className="w-full bg-[#05080c] px-5 py-2 text-white sm:px-8"
      aria-label="Brokerage attribution"
      data-testid="public-brokerage-attribution"
      data-brokerage-firm-name={BROKERAGE_FIRM_NAME}
      data-public-team-name={PUBLIC_TEAM_NAME}
      data-team-is-separate-brokerage="false"
      data-reie-sprint-1-disclosure-preserved="true"
      data-reie-sprint-1-disclosure-presentation="reduced-visual-dominance"
    >
      <div className="mx-auto flex max-w-[1180px] flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="text-[9px] font-black uppercase tracking-[0.16em] text-cyan-100/58">Brokerage Firm: {BROKERAGE_FIRM_NAME}</p>
        <p className="max-w-3xl text-[10px] leading-5 text-white/42">{getBrokerageAttributionSummary()}</p>
      </div>
    </section>
  );
}
