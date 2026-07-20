import Link from 'next/link';

import { BROKERAGE_FIRM_NAME, PUBLIC_TRUST_REVIEW_STATUS, publicTrustRoutes } from '@/lib/publicTrust';

export default function PlatformFooter() {
  return (
    <footer className="mt-24 w-full border-t border-white/10 bg-[#050505]/90 px-6 py-14 backdrop-blur-xl sm:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="space-y-6">
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gold-500">David Quinn Group</h4>
          <p className="text-sm leading-relaxed text-slate-400">Colorado real estate search, inquiry routing, and REIE strategy intake.</p>
          <p className="text-xs font-bold leading-relaxed text-slate-400">Brokerage Firm: {BROKERAGE_FIRM_NAME}</p>
          <p className="text-xs leading-relaxed text-slate-500">
            Public trust, brokerage, privacy, and accessibility language remains under owner and counsel review before controlled beta.
          </p>
        </div>

        <div className="space-y-5">
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Public Trust</h4>
          <nav className="grid grid-cols-2 gap-2" aria-label="Public trust footer links" data-testid="public-trust-footer-links">
            {publicTrustRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className="rounded-[6px] border border-white/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400 transition hover:border-cyan-100/40 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
                data-testid="public-trust-footer-link"
                data-public-trust-route={route.href}
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col justify-end md:text-right">
          <h2 className="text-3xl font-black uppercase italic leading-none tracking-tighter text-white">David Quinn Group</h2>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.4em] text-gold-500">Intelligence Engine</p>
          <p
            className="mt-5 text-[10px] font-black uppercase leading-5 tracking-[0.16em] text-slate-600"
            data-testid="public-trust-footer-review-status"
            data-public-trust-review-status={PUBLIC_TRUST_REVIEW_STATUS}
          >
            {PUBLIC_TRUST_REVIEW_STATUS}
          </p>
        </div>
      </div>
    </footer>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/Footer.tsx
