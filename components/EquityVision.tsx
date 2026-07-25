'use client';

import type { ReactNode } from 'react';
import { Hammer, Ruler, ShieldAlert } from 'lucide-react';

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

function getPositiveNumber(value: number | null | undefined, fallback = 0) {
  if (typeof value !== 'number') return fallback;
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function formatSquareFeet(value: number | null | undefined) {
  const squareFeet = getPositiveNumber(value);
  return squareFeet ? `${squareFeet.toLocaleString('en-US')} sq ft` : 'Verify records';
}

export default function EquityVision({ property }: EquityVisionProps) {
  return (
    <div className="rounded-[8px] border border-[#fbbf24]/20 bg-slate-950 p-5 shadow-2xl md:p-6">
      <header className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#fbbf24]">Investigate</p>
        <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-white">Area and Records Review</h2>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Use these public measurement notes to prepare questions about finished area, unfinished area, records, and inspection scope.
        </p>
      </header>

      <div className="space-y-4">
        <ReviewRow
          accentClassName="border-blue-500"
          icon={<Ruler className="text-blue-400" size={18} />}
          label="Above-Grade Area"
          value={formatSquareFeet(property.sqftAboveGrade)}
        />

        <ReviewRow
          accentClassName="border-green-500"
          icon={<Hammer className="text-green-400" size={18} />}
          label="Finished Basement Area"
          value={formatSquareFeet(property.sqftBasementFinished)}
        />

        <ReviewRow
          accentClassName="border-white/20"
          icon={<Ruler className="text-white/40" size={18} />}
          label="Unfinished Basement Area"
          value={formatSquareFeet(property.sqftBasementUnfinished)}
        />

        <div className="mt-10 border-t border-slate-800 pt-6">
          <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-[#fbbf24]">Questions to Discuss</p>
          <p className="text-sm leading-6 text-slate-400">
            These notes are not a valuation, inspection result, condition assessment, or return estimate. Confirm measurements and records with the appropriate professionals.
          </p>
        </div>

        {property.hasPolybutyleneRisk ? (
          <div className="mt-6 flex items-center gap-3 border border-red-500/50 bg-red-950/40 p-4 text-xs font-black uppercase italic tracking-widest text-red-400">
            <ShieldAlert size={20} className="animate-pulse" />
            Plumbing Records to Verify: Confirm materials with an appropriate professional
          </div>
        ) : null}

        <div className="mt-6 rounded-[6px] border border-white/10 bg-white/[0.045] p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Professional Context</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Bring area, basement, and record questions into the broader property conversation when they affect next-step decisions.
          </p>
        </div>
      </div>
    </div>
  );
}

function ReviewRow({
  accentClassName,
  icon,
  label,
  value,
}: {
  accentClassName: string;
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className={`flex items-center justify-between gap-4 border-l-4 bg-slate-900 p-4 ${accentClassName}`}>
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-bold uppercase text-slate-300">{label}</span>
      </div>
      <span className="shrink-0 text-right text-xs font-black uppercase tracking-[0.12em] text-white">{value}</span>
    </div>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/EquityVision.tsx
