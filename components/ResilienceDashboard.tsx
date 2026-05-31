'use client';

import type { ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, Construction, Droplets, Flame, Gauge, Mountain, ShieldAlert } from 'lucide-react';

import { getResilienceAdvice, type Neighborhood } from '@/lib/neighborhoods';

type ResilienceDashboardProps = {
  neighborhood: Neighborhood;
};

type RiskCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  note: string;
  severity?: 'standard' | 'elevated' | 'high';
};

function getFireSeverity(fireRisk: string): RiskCardProps['severity'] {
  if (fireRisk === 'Extreme' || fireRisk === 'High') return 'high';
  if (fireRisk === 'Moderate') return 'elevated';
  return 'standard';
}

function getInsuranceSeverity(complexity: string): RiskCardProps['severity'] {
  if (complexity === 'Complex') return 'high';
  if (complexity === 'Elevated') return 'elevated';
  return 'standard';
}

function getSeverityClasses(severity: RiskCardProps['severity'] = 'standard') {
  if (severity === 'high') {
    return {
      border: 'border-red-500/30',
      icon: 'text-red-400',
      value: 'text-red-300',
    };
  }

  if (severity === 'elevated') {
    return {
      border: 'border-amber-500/30',
      icon: 'text-amber-300',
      value: 'text-amber-200',
    };
  }

  return {
    border: 'border-white/10',
    icon: 'text-[#00ff80]',
    value: 'text-white',
  };
}

export default function ResilienceDashboard({ neighborhood }: ResilienceDashboardProps) {
  const advice = getResilienceAdvice(neighborhood);
  const fireSeverity = getFireSeverity(neighborhood.fireRisk);
  const insuranceSeverity = getInsuranceSeverity(neighborhood.insuranceComplexity);

  return (
    <div className="overflow-hidden border border-white/10 bg-[#050505] shadow-2xl">
      <div className="grid gap-8 border-b border-white/5 bg-white/[0.02] p-8 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <ShieldAlert className="h-4 w-4 text-[#00ff80]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00ff80]">REIE Resilience Layer</span>
          </div>
          <h2 className="text-4xl font-black uppercase italic tracking-tight text-white">Neighborhood Risk Dashboard</h2>
          <p className="mt-2 max-w-2xl text-xs uppercase leading-relaxed tracking-widest text-white/40">
            Environmental exposure, infrastructure integrity, insurance posture, and construction diligence for {neighborhood.name}.
          </p>
        </div>

        <div className="border border-white/10 bg-black/30 px-8 py-6 text-center">
          <div className="text-6xl font-black italic leading-none tracking-tighter text-white">{advice.score}</div>
          <div className="mt-2 text-[9px] font-black uppercase tracking-[0.2em] text-[#00ff80]">Resilience Index</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-px bg-white/5 md:grid-cols-3">
        <RiskCard
          icon={<Flame size={20} />}
          label="Fire Risk"
          value={neighborhood.fireRisk}
          note={
            fireSeverity === 'high'
              ? 'Treat defensible space, roof assembly, and insurance underwriting as offer-critical.'
              : 'Confirm local exposure, roof age, and defensible-space basics during diligence.'
          }
          severity={fireSeverity}
        />
        <RiskCard
          icon={<Droplets size={20} />}
          label="Water Posture"
          value={neighborhood.waterRights ? 'Deeded Rights' : 'Municipal Supply'}
          note={
            neighborhood.waterRights
              ? 'Rights posture can add strategic value, but documentation still needs review.'
              : 'Municipal-only supply should be checked for long-term cost and use constraints.'
          }
          severity={neighborhood.waterRights ? 'standard' : 'elevated'}
        />
        <RiskCard
          icon={<ShieldAlert size={20} />}
          label="Insurance"
          value={neighborhood.insuranceComplexity}
          note="Underwriting should be checked before offer strategy hardens."
          severity={insuranceSeverity}
        />
      </div>

      <div className="grid gap-px bg-white/5 md:grid-cols-3">
        <RiskCard
          icon={<Mountain size={20} />}
          label="Altitude"
          value={`${neighborhood.altitude.toLocaleString()} FT`}
          note={advice.altitudeAdvice}
        />
        <RiskCard icon={<Gauge size={20} />} label="Soil Profile" value={neighborhood.soilType} note={advice.soilAnalysis} />
        <RiskCard
          icon={<Construction size={20} />}
          label="Construction DNA"
          value={neighborhood.era}
          note={neighborhood.constructionDNA}
        />
      </div>

      <div className="grid gap-8 border-t border-white/5 p-8 md:grid-cols-[1fr_0.65fr]">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <Construction className="h-5 w-5 text-[#00ff80]" />
            <h3 className="text-[11px] font-black uppercase italic tracking-[0.3em] text-white">Tactical Leverage</h3>
          </div>
          <p className="text-sm font-medium italic leading-relaxed text-white/70">{advice.tacticalLever}</p>
        </div>

        <div className="border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-3 flex items-center gap-2">
            {advice.score >= 80 ? (
              <CheckCircle2 size={16} className="text-[#00ff80]" />
            ) : (
              <AlertTriangle size={16} className="text-amber-300" />
            )}
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/35">DQG Read</span>
          </div>
          <p className="text-[10px] italic leading-relaxed text-white/45">
            {advice.score >= 80
              ? 'Strong resilience profile, with value still dependent on property-specific inspection findings.'
              : 'Higher diligence burden. Offer terms should preserve inspection leverage and insurance optionality.'}
          </p>
        </div>
      </div>
    </div>
  );
}

function RiskCard({ icon, label, value, note, severity = 'standard' }: RiskCardProps) {
  const classes = getSeverityClasses(severity);

  return (
    <div className={`min-h-56 bg-[#050505] p-6 ${classes.border} border`}>
      <div className="mb-5 flex items-center justify-between gap-4">
        <span className={classes.icon}>{icon}</span>
        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/25">{label}</span>
      </div>
      <p className={`text-2xl font-black uppercase italic tracking-tight ${classes.value}`}>{value}</p>
      <p className="mt-4 text-[10px] italic leading-relaxed text-white/45">{note}</p>
    </div>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/ResilienceDashboard.tsx
