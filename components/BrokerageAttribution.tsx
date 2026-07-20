import { BROKERAGE_FIRM_NAME, PUBLIC_TEAM_NAME, getBrokerageAttributionSummary } from '@/lib/publicTrust';

export default function BrokerageAttribution() {
  return (
    <section
      className="w-full border-b border-cyan-100/20 bg-[#071017] px-4 py-3 text-white sm:px-6"
      aria-label="Brokerage attribution"
      data-testid="public-brokerage-attribution"
      data-brokerage-firm-name={BROKERAGE_FIRM_NAME}
      data-public-team-name={PUBLIC_TEAM_NAME}
      data-team-is-separate-brokerage="false"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/78">Brokerage Firm: {BROKERAGE_FIRM_NAME}</p>
        <p className="max-w-3xl text-xs leading-5 text-white/62">{getBrokerageAttributionSummary()}</p>
      </div>
    </section>
  );
}
