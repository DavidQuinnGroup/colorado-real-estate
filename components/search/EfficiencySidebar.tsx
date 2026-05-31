'use client';

import { Clock } from 'lucide-react';

type UserTier = 'Public' | 'Contracted';

type EfficiencySidebarProps = {
  score: number;
  userTier?: UserTier | string;
};

function isContractedTier(userTier: EfficiencySidebarProps['userTier']) {
  return userTier === 'Contracted';
}

export default function EfficiencySidebar({ score = 0, userTier = 'Public' }: EfficiencySidebarProps) {
  const isContracted = isContractedTier(userTier);

  return (
    <div className="h-full space-y-12 border-l border-white/5 bg-white/[0.02] p-8">
      <div>
        <h3 className="mb-2 text-[10px] font-black uppercase tracking-[0.4em] text-[#00ff80]">Efficiency Index</h3>
        <span className="text-7xl font-black italic tracking-tighter text-white">{score}</span>
      </div>

      <section className="space-y-6">
        <div className="flex items-center gap-3 text-white/40">
          <Clock size={16} />
          <span className="text-[9px] font-black uppercase italic tracking-widest">Time-Tax Audit</span>
        </div>

        {isContracted ? (
          <p className="text-xs font-medium italic leading-relaxed text-white/60">
            This asset reduces your weekly ritual commute by <span className="text-[#00ff80]">4.5 hours</span>.
          </p>
        ) : (
          <div className="border border-dashed border-white/10 bg-white/5 p-4">
            <p className="text-[9px] font-bold uppercase leading-relaxed tracking-widest text-white/30">
              Commute Forensics Reserved for DQG Contracted Clients.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/search/EfficiencySidebar.tsx
