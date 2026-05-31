'use client';

import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { Camera, ChevronRight, Hammer, Ruler, ShieldAlert } from 'lucide-react';

export type EquityVisionProperty = {
  sqftAboveGrade: number;
  sqftBasementFinished: number;
  sqftBasementUnfinished: number;
  marketRate: number;
  gcAdjustments: number;
  hasPolybutyleneRisk?: boolean | null;
};

type EquityVisionProps = {
  property: EquityVisionProperty;
};

type ValuationModel = {
  aboveGrade: number;
  finishedBasement: number;
  unfinishedBasement: number;
  standard: number;
  optimized: number;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(value)));
}

function getPositiveNumber(value: number | null | undefined, fallback = 0) {
  if (typeof value !== 'number') return fallback;
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function buildValuationModel(property: EquityVisionProperty): ValuationModel {
  const marketRate = getPositiveNumber(property.marketRate, 850);
  const aboveGrade = getPositiveNumber(property.sqftAboveGrade) * marketRate;
  const finishedBasement = getPositiveNumber(property.sqftBasementFinished) * marketRate * 0.6;
  const unfinishedBasement = getPositiveNumber(property.sqftBasementUnfinished) * marketRate * 0.25;
  const standard = aboveGrade + finishedBasement + unfinishedBasement;
  const optimized = standard + property.gcAdjustments;

  return {
    aboveGrade,
    finishedBasement,
    unfinishedBasement,
    standard,
    optimized,
  };
}

export default function EquityVision({ property }: EquityVisionProps) {
  const valuations = useMemo(() => buildValuationModel(property), [property]);

  return (
    <div className="border border-[#fbbf24]/20 bg-slate-950 p-8 shadow-2xl">
      <header className="mb-8">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#fbbf24]">Module 5: Equity Vision 2.0</p>
        <h2 className="text-3xl font-black italic uppercase tracking-tight text-white">The GC Valuation Suite</h2>
      </header>

      <div className="space-y-4">
        <ValuationRow
          accentClassName="border-blue-500"
          icon={<Ruler className="text-blue-400" size={18} />}
          label="Above-Grade: Tier 1"
          value={valuations.aboveGrade}
        />

        <ValuationRow
          accentClassName="border-green-500"
          icon={<Hammer className="text-green-400" size={18} />}
          label="Finished Basement: Tier 2"
          value={valuations.finishedBasement}
        />

        <ValuationRow
          accentClassName="border-white/20"
          icon={<Ruler className="text-white/40" size={18} />}
          label="Unfinished Basement: Tier 3"
          value={valuations.unfinishedBasement}
        />

        <div className="mt-10 border-t border-slate-800 pt-6">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="mb-1 text-[10px] font-black uppercase italic tracking-widest text-[#fbbf24]">David Quinn Optimized Value</p>
              <p className="text-5xl font-black italic tracking-tight text-white">{formatCurrency(valuations.optimized)}</p>
            </div>
            <div className="pb-1 text-right">
              <p className="text-[10px] font-bold uppercase text-slate-500">Standard Portal Est.</p>
              <p className="text-xl font-bold tracking-tight text-slate-400 line-through">{formatCurrency(valuations.standard)}</p>
            </div>
          </div>
        </div>

        {property.hasPolybutyleneRisk ? (
          <div className="mt-6 flex items-center gap-3 border border-red-500/50 bg-red-950/40 p-4 text-xs font-black uppercase italic tracking-widest text-red-400">
            <ShieldAlert size={20} className="animate-pulse" />
            GC Forensic Alert: Potential Polybutylene Risk Detected
          </div>
        ) : null}

        <button
          type="button"
          disabled
          className="mt-6 flex w-full cursor-not-allowed items-center justify-center gap-2 bg-white/70 py-4 text-xs font-black italic uppercase tracking-[0.3em] text-black/70"
        >
          <Camera size={16} /> Visual Verification Pending <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function ValuationRow({
  accentClassName,
  icon,
  label,
  value,
}: {
  accentClassName: string;
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className={`flex items-center justify-between gap-4 border-l-4 bg-slate-900 p-4 ${accentClassName}`}>
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-bold uppercase text-slate-300">{label}</span>
      </div>
      <span className="shrink-0 font-mono font-bold text-white">{formatCurrency(value)}</span>
    </div>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/EquityVision.tsx
