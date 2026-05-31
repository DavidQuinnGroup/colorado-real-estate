"use client";

import {
  Activity,
  AlertTriangle,
  ChevronRight,
  FileSearch,
  Gavel,
  Scale,
  ShieldCheck,
} from "lucide-react";

type VelocityData = {
  current: number;
  historical: number;
};

type MarketGaugeProps = {
  score?: number;
  neighborhood?: string;
  velocityData?: VelocityData;
};

type LeverageSignal = {
  label: string;
  color: string;
  strategy: string;
};

type LogEntryData = {
  label: string;
  status: string;
};

const defaultVelocityData: VelocityData = {
  current: 18,
  historical: 24,
};

const transparencyLog: LogEntryData[] = [
  { label: "MLS Data Reconciliation", status: "Verified" },
  { label: "Structural Cost Audit", status: "Verified" },
  { label: "Absorption Integrity", status: "High" },
  { label: "Counterparty Credibility", status: "Monitoring" },
];

function clampScore(score: number | undefined) {
  if (typeof score !== "number" || !Number.isFinite(score)) {
    return 72;
  }

  return Math.min(100, Math.max(0, Math.round(score)));
}

function getPositiveNumber(value: number | undefined, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? Math.round(value)
    : fallback;
}

function getLeverageSignal(score: number): LeverageSignal {
  if (score >= 80) {
    return {
      label: "Extreme Seller Dominance",
      color: "#ef4444",
      strategy: "Aggressive Entry / Low Concessions",
    };
  }

  if (score >= 60) {
    return {
      label: "Seller Leaning",
      color: "#f97316",
      strategy: "Limited Concession Framework",
    };
  }

  if (score >= 40) {
    return {
      label: "Equilibrium",
      color: "#00ff80",
      strategy: "Standard Tactical Neutral",
    };
  }

  return {
    label: "Buyer Advantage",
    color: "#3b82f6",
    strategy: "High-Leverage Credit Requests",
  };
}

export default function MarketGauge({
  score = 72,
  neighborhood = "Boulder",
  velocityData = defaultVelocityData,
}: MarketGaugeProps) {
  const normalizedScore = clampScore(score);
  const currentDaysOnMarket = getPositiveNumber(
    velocityData.current,
    defaultVelocityData.current,
  );
  const historicalDaysOnMarket = getPositiveNumber(
    velocityData.historical,
    defaultVelocityData.historical,
  );
  const leverage = getLeverageSignal(normalizedScore);
  const velocityIncrease =
    ((historicalDaysOnMarket - currentDaysOnMarket) / historicalDaysOnMarket) * 100;
  const velocityDirection = velocityIncrease >= 0 ? "faster" : "slower";

  return (
    <div className="mx-auto max-w-4xl overflow-hidden border border-white/10 bg-[#050505] text-white shadow-2xl">
      <div className="flex flex-col gap-6 border-b border-white/5 bg-gradient-to-r from-red-900/10 to-transparent p-8 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <Scale className="h-4 w-4 text-[#00ff80]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00ff80]">
              Module 09: Ethics Engine
            </span>
          </div>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">
            Market Integrity Meter
          </h2>
          <p className="mt-2 text-xs uppercase tracking-widest text-white/40">
            Quantifiable source of truth for {neighborhood} assets
          </p>
        </div>
        <div className="text-left md:text-right">
          <div className="mb-1 text-[10px] font-black uppercase italic tracking-[0.3em] text-white/20">
            Colorado Standard
          </div>
          <div className="border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase italic text-white">
            Ref: DQG-V7.0-ALPHA
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="space-y-10 border-white/5 p-8 md:border-r">
          <section>
            <h3 className="mb-6 flex items-center gap-2 text-[11px] font-black uppercase italic tracking-[0.3em] text-white/30">
              <FileSearch size={14} className="text-[#00ff80]" />
              Transparency Log
            </h3>
            <div className="space-y-4">
              {transparencyLog.map((entry) => (
                <LogEntry key={entry.label} label={entry.label} status={entry.status} />
              ))}
            </div>
            <p className="mt-6 text-[10px] leading-relaxed text-white/40">
              Every data point in this negotiation is anchored to the Transparency Log,
              ensuring reconciliation against subjective counter-offers.
            </p>
          </section>

          <section>
            <h3 className="mb-4 text-[11px] font-black uppercase italic tracking-[0.3em] text-white/30">
              Negotiation Leverage
            </h3>
            <div className="flex items-end gap-4">
              <div className="text-6xl font-black italic tracking-tighter text-white">
                {normalizedScore}
              </div>
              <div className="mb-2">
                <div
                  className="text-[10px] font-black uppercase tracking-widest"
                  style={{ color: leverage.color }}
                >
                  {leverage.label}
                </div>
                <div className="text-[9px] font-bold uppercase tracking-tighter text-white/30">
                  Tactical Index
                </div>
              </div>
            </div>
            <div className="mt-4 border-l-2 border-[#00ff80] bg-white/[0.03] p-4 italic">
              <p className="text-[10px] font-medium text-white/60">
                <span className="font-black uppercase tracking-widest text-[#00ff80]">
                  Command:
                </span>{" "}
                {leverage.strategy}
              </p>
            </div>
          </section>
        </div>

        <div className="flex flex-col justify-between bg-black/40 p-8">
          <div className="space-y-10">
            <section>
              <h3 className="mb-8 flex items-center gap-2 text-[11px] font-black uppercase italic tracking-[0.3em] text-white/30">
                <Activity size={14} className="text-[#00ff80]" />
                Market Velocity Meter
              </h3>
              <div className="relative mb-4 h-2 w-full overflow-hidden bg-white/5">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-[#00ff80] transition-all duration-1000"
                  style={{ width: `${normalizedScore}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <MetricBox label="Current DOM" value={`${currentDaysOnMarket} Days`} />
                <MetricBox label="5-Yr Average" value={`${historicalDaysOnMarket} Days`} />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00ff80]" />
                <span className="text-[9px] font-black uppercase italic tracking-widest text-[#00ff80]">
                  Velocity is {Math.abs(velocityIncrease).toFixed(1)}% {velocityDirection} than
                  historical norm
                </span>
              </div>
            </section>

            <section className="border border-red-900/20 bg-red-900/10 p-6">
              <div className="mb-3 flex items-center gap-3 text-red-500">
                <AlertTriangle size={16} />
                <span className="text-[10px] font-black uppercase italic tracking-widest">
                  Ethics Guardrail Active
                </span>
              </div>
              <p className="text-[10px] leading-relaxed text-white/40">
                Scanning counterparty documentation for unverified pricing claims or
                steering patterns. Deviations are flagged for review in the DQG Master App.
              </p>
            </section>
          </div>

          <button className="group mt-10 flex w-full items-center justify-center gap-2 bg-[#00ff80] py-4 text-[10px] font-black uppercase italic tracking-[0.3em] text-black transition-all hover:bg-white">
            <Gavel size={14} />
            Initialize Negotiation Playbook
            <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 border-t border-white/5 bg-white/[0.02] px-8 py-4">
        <ShieldCheck size={14} className="shrink-0 text-[#00ff80]/40" />
        <p className="text-[9px] font-bold uppercase italic tracking-[0.2em] text-white/20">
          Authoritative Data Source: County Assessor, MLS Grid API, and proprietary DQG
          efficiency formulas.
        </p>
      </div>
    </div>
  );
}

function MetricBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/5 p-4">
      <div className="mb-1 text-[8px] font-black uppercase tracking-widest text-white/20">
        {label}
      </div>
      <div className="text-xl font-black italic text-white">{value}</div>
    </div>
  );
}

function LogEntry({ label, status }: LogEntryData) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-2">
      <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <div className="h-1 w-1 rounded-full bg-[#00ff80]" />
        <span className="text-[9px] font-black uppercase tracking-widest text-[#00ff80]">
          {status}
        </span>
      </div>
    </div>
  );
}

// components/maps/MarketGauge.tsx
