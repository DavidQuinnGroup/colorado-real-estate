'use client';

import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { Activity, BarChart3, CalendarClock, Gauge, Home, ShieldCheck, TrendingUp, Zap } from 'lucide-react';

type MarketStats = {
  medianPrice: number;
  pricePerSqFt: string;
  daysOnMarket: string;
  inventory: string;
  marketHealthScore: number;
  avgEfficiency: number;
};

type CityMarketStatsProps = {
  stats: MarketStats;
  homeAge?: number;
};

type ViewMode = 'market' | 'strategy';

type ModeButtonProps = {
  icon: ReactNode;
  isActive: boolean;
  label: string;
  onClick: () => void;
  mode: ViewMode;
};

type StatRowProps = {
  icon: ReactNode;
  label: string;
  value: string;
  note: string;
  metric: string;
};

type CostRowProps = {
  label: string;
  value: string;
  metric: string;
};

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

function formatCurrency(value: number) {
  return CURRENCY_FORMATTER.format(Math.max(0, Math.round(value)));
}

function parseNumber(value: string) {
  const parsed = Number(value.replace(/[^0-9.]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function getMarketPressureLabel(score: number) {
  if (score >= 85) return 'Seller-Favored';
  if (score >= 70) return 'Selective';
  return 'Buyer-Leverage';
}

function getEfficiencyLabel(score: number) {
  if (score >= 90) return 'High ROI';
  if (score >= 75) return 'Balanced';
  return 'Commute Sensitive';
}

export default function CityMarketStats({ stats, homeAge = 30 }: CityMarketStatsProps) {
  const [view, setView] = useState<ViewMode>('market');

  const marketModel = useMemo(() => {
    const inventory = parseNumber(stats.inventory);
    const daysOnMarket = parseNumber(stats.daysOnMarket);
    const monthlyCarry = stats.medianPrice * 0.0065;
    const annualCarry = monthlyCarry * 12;
    const inspectionReserve = homeAge > 25 ? stats.medianPrice * 0.018 : stats.medianPrice * 0.01;
    const leverageScore = Math.max(0, Math.min(100, Math.round((daysOnMarket / 45) * 55 + (inventory / 200) * 45)));

    return {
      inventory,
      daysOnMarket,
      monthlyCarry,
      annualCarry,
      inspectionReserve,
      leverageScore,
      marketPressure: getMarketPressureLabel(stats.marketHealthScore),
      efficiencyLabel: getEfficiencyLabel(stats.avgEfficiency),
    };
  }, [homeAge, stats.avgEfficiency, stats.daysOnMarket, stats.inventory, stats.marketHealthScore, stats.medianPrice]);

  return (
    <div
      className="mt-16 overflow-hidden border border-white/10 bg-[#050505] shadow-2xl"
      data-testid="reie-city-market-stats"
      data-city-market-view={view}
      data-city-market-home-age={homeAge}
      data-city-market-median-price={stats.medianPrice}
      data-city-market-price-per-sqft={stats.pricePerSqFt}
      data-city-market-days-on-market={stats.daysOnMarket}
      data-city-market-inventory={stats.inventory}
      data-city-market-health-score={stats.marketHealthScore}
      data-city-market-avg-efficiency={stats.avgEfficiency}
      data-city-market-pressure={marketModel.marketPressure}
      data-city-market-efficiency-label={marketModel.efficiencyLabel}
      data-city-market-monthly-carry={Math.round(marketModel.monthlyCarry)}
      data-city-market-annual-carry={Math.round(marketModel.annualCarry)}
      data-city-market-inspection-reserve={Math.round(marketModel.inspectionReserve)}
      data-city-market-leverage-score={marketModel.leverageScore}
    >
      <div className="border-b border-white/5 bg-white/[0.02] p-8">
        <div className="mb-2 flex items-center gap-3">
          <Activity className="h-4 w-4 text-[#00ff80]" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00ff80]">REIE Market Signal Layer</span>
        </div>
        <h2 className="text-4xl font-black uppercase italic tracking-tight text-white">City Intelligence Dashboard</h2>
        <p className="mt-2 text-xs uppercase tracking-widest text-white/40">
          Price pressure, construction risk, inventory posture, and lifestyle efficiency.
        </p>
      </div>

      <div className="grid grid-cols-2 border-b border-white/5 bg-white/[0.02]">
        <ModeButton
          icon={<BarChart3 size={18} />}
          isActive={view === 'market'}
          label="Market Pulse"
          mode="market"
          onClick={() => setView('market')}
        />
        <ModeButton
          icon={<ShieldCheck size={18} />}
          isActive={view === 'strategy'}
          label="Offer Strategy"
          mode="strategy"
          onClick={() => setView('strategy')}
        />
      </div>

      <div className="p-8" data-testid="reie-city-market-stats-body" data-city-market-active-view={view}>
        {view === 'market' ? (
          <div
            className="grid grid-cols-1 gap-8 animate-in fade-in duration-500 lg:grid-cols-[1fr_0.8fr]"
            data-testid="reie-city-market-pulse"
            data-city-market-pulse-pressure={marketModel.marketPressure}
            data-city-market-pulse-efficiency-label={marketModel.efficiencyLabel}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <StatRow
                icon={<Home size={18} />}
                label="Median Price"
                metric="median-price"
                value={formatCurrency(stats.medianPrice)}
                note="Baseline city acquisition signal."
              />
              <StatRow
                icon={<Gauge size={18} />}
                label="Market Health"
                metric="market-health"
                value={`${stats.marketHealthScore}/100`}
                note={`${marketModel.marketPressure} negotiation climate.`}
              />
              <StatRow
                icon={<CalendarClock size={18} />}
                label="Days on Market"
                metric="days-on-market"
                value={`${marketModel.daysOnMarket || stats.daysOnMarket}`}
                note="Time pressure proxy for seller flexibility."
              />
              <StatRow
                icon={<TrendingUp size={18} />}
                label="Price Per Sq Ft"
                metric="price-per-sqft"
                value={stats.pricePerSqFt}
                note="Useful only when paired with condition and location."
              />
            </div>

            <div
              className="flex flex-col justify-between border border-white/10 bg-white/[0.03] p-8"
              data-testid="reie-city-market-efficiency"
              data-city-market-efficiency-score={stats.avgEfficiency}
              data-city-market-efficiency-label={marketModel.efficiencyLabel}
            >
              <div>
                <p className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Lifestyle Efficiency</p>
                <div className="text-7xl font-black italic tracking-tighter text-white">{stats.avgEfficiency}</div>
                <p className="mt-3 text-sm font-bold uppercase tracking-widest text-[#00ff80]">{marketModel.efficiencyLabel}</p>
              </div>
              <p className="mt-8 text-[11px] italic leading-relaxed text-white/55">
                Efficiency score reflects practical life ROI: access, commute drag, daily friction, and neighborhood utility relative to
                acquisition cost.
              </p>
            </div>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 gap-8 animate-in fade-in duration-500 lg:grid-cols-[1fr_0.8fr]"
            data-testid="reie-city-market-strategy"
            data-city-market-strategy-leverage-score={marketModel.leverageScore}
            data-city-market-strategy-monthly-carry={Math.round(marketModel.monthlyCarry)}
            data-city-market-strategy-annual-carry={Math.round(marketModel.annualCarry)}
            data-city-market-strategy-inspection-reserve={Math.round(marketModel.inspectionReserve)}
          >
            <div className="space-y-4">
              <CostRow label="Estimated Monthly Carry Exposure" metric="monthly-carry" value={formatCurrency(marketModel.monthlyCarry)} />
              <CostRow label="Annual Ownership Friction" metric="annual-carry" value={formatCurrency(marketModel.annualCarry)} />
              <CostRow label="GC Inspection Reserve" metric="inspection-reserve" value={formatCurrency(marketModel.inspectionReserve)} />
              <div
                className="flex justify-between border-t border-white/10 pt-4 text-[#00ff80]"
                data-testid="reie-city-market-leverage"
                data-city-market-leverage-score={marketModel.leverageScore}
              >
                <span className="text-[10px] font-black uppercase tracking-widest">Buyer Leverage Model</span>
                <span className="text-xl font-black italic">{marketModel.leverageScore}/100</span>
              </div>
            </div>

            <div className="space-y-4">
              <section className="border border-white/10 bg-white/[0.03] p-6">
                <div className="mb-2 flex items-center gap-3 text-white">
                  <Zap size={16} className="text-[#00ff80]" />
                  <span className="text-[10px] font-black uppercase tracking-widest">DQG Strategy Note</span>
                </div>
                <p className="text-[10px] italic leading-relaxed text-white/45">
                  Use the market score to frame speed, but use construction condition to frame price. Roof, sewer, drainage, mechanicals,
                  and envelope performance remain the leverage stack.
                </p>
              </section>
              <button
                className="flex w-full items-center justify-center gap-2 bg-[#00ff80] py-4 text-[10px] font-black uppercase italic tracking-[0.3em] text-black transition-all hover:bg-white"
                data-testid="reie-city-market-strategy-button"
                data-city-market-strategy-button-label="Build Offer Strategy"
              >
                Build Offer Strategy
              </button>
            </div>
          </div>
        )}
      </div>

      <div
        className="flex items-center gap-4 border-t border-white/5 bg-white/[0.02] px-8 py-4"
        data-testid="reie-city-market-methodology"
      >
        <ShieldCheck size={14} className="shrink-0 text-[#00ff80]/50" />
        <p className="text-[9px] font-bold uppercase italic leading-relaxed tracking-[0.2em] text-white/25">
          David Quinn Group evaluates market data through construction forensics, lifestyle efficiency, and tactical negotiation context.
        </p>
      </div>
    </div>
  );
}

function ModeButton({ icon, isActive, label, mode, onClick }: ModeButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
      data-testid="reie-city-market-mode"
      data-city-market-mode={mode}
      data-city-market-mode-active={isActive ? 'true' : 'false'}
      data-city-market-mode-label={label}
      className={`flex min-h-24 flex-col items-center justify-center gap-2 px-4 py-6 text-center transition-all ${
        isActive ? 'border-b-2 border-[#00ff80] bg-white/5 text-white' : 'text-white/25 hover:text-white/55'
      }`}
    >
      {icon}
      <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
    </button>
  );
}

function StatRow({ icon, label, metric, value, note }: StatRowProps) {
  return (
    <div
      className="border border-white/10 bg-white/[0.02] p-5"
      data-testid="reie-city-market-stat-row"
      data-city-market-stat-metric={metric}
      data-city-market-stat-label={label}
      data-city-market-stat-value={value}
      data-city-market-stat-note={note}
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <span className="text-[#00ff80]/70">{icon}</span>
        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/25">{label}</span>
      </div>
      <p className="text-2xl font-black italic tracking-tight text-white">{value}</p>
      <p className="mt-3 text-[10px] italic leading-relaxed text-white/40">{note}</p>
    </div>
  );
}

function CostRow({ label, metric, value }: CostRowProps) {
  return (
    <div
      className="flex items-center justify-between gap-4 border border-white/10 bg-white/[0.02] p-5"
      data-testid="reie-city-market-cost-row"
      data-city-market-cost-metric={metric}
      data-city-market-cost-label={label}
      data-city-market-cost-value={value}
    >
      <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">{label}</span>
      <span className="shrink-0 font-mono text-sm font-bold text-white/85">{value}</span>
    </div>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/CityMarketStats.tsx
