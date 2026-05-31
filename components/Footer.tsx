export default function PlatformFooter() {
  return (
    <footer className="mt-24 w-full border-t border-white/10 bg-[#050505]/90 px-8 py-16 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 md:grid-cols-3">
        <div className="space-y-6">
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gold-500">The Authority</h4>
          <p className="text-sm italic leading-relaxed text-slate-400">
            We look beyond the aesthetic to the structural envelope.
          </p>
          <p className="text-xs leading-relaxed text-slate-500">
            David Quinn is a 30-year General Contractor and Strategic Consultant. The REIE provides forensic audits and efficiency scores
            that standard aggregators physically cannot access.
          </p>
        </div>

        <div className="flex flex-col items-center space-y-6 md:items-start">
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Legal Intelligence</h4>
          <div className="flex gap-4">
            <div className="flex h-10 w-10 items-center justify-center border border-slate-700 text-center text-[8px] font-black text-slate-500">
              EQUAL HOUSING
            </div>
            <div className="flex h-10 w-10 items-center justify-center border border-slate-700 text-[8px] font-black text-slate-500">
              REALTOR®
            </div>
          </div>
          <p className="text-[10px] font-black uppercase leading-loose tracking-widest text-slate-600">
            Fair Housing Bot Audited (V 7.0) <br />
            License: David Quinn Group, Colorado <br />
            Content clusters verified for GA 2026 E-E-A-T
          </p>
        </div>

        <div className="flex flex-col justify-end text-right">
          <h2 className="text-3xl font-black uppercase italic leading-none tracking-tighter text-white">David Quinn Group</h2>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.4em] text-gold-500">Intelligence Engine</p>
        </div>
      </div>
    </footer>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/Footer.tsx
