import { BROKERAGE_FIRM_NAME, PUBLIC_TEAM_NAME, getBrokerageAttributionSummary } from '@/lib/publicTrust';

export default function BrokerageAttribution() {
  return (
    <section
      className="w-full border-b border-white/10 bg-[#071017] px-6 py-2.5 text-white sm:px-10"
      aria-label="Brokerage attribution"
      data-testid="public-brokerage-attribution"
      data-brokerage-firm-name={BROKERAGE_FIRM_NAME}
      data-public-team-name={PUBLIC_TEAM_NAME}
      data-team-is-separate-brokerage="false"
    >
      <div className="mx-auto flex max-w-[1180px] flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-cyan-100/70">Brokerage Firm: {BROKERAGE_FIRM_NAME}</p>
        <p className="max-w-3xl text-[11px] leading-5 text-white/50">{getBrokerageAttributionSummary()}</p>
      </div>
    </section>
  );
}
