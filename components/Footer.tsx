import Link from 'next/link';

import { getJourneyMeasurementAttributes } from '@/lib/customerJourneyMeasurement';
import { BROKERAGE_FIRM_NAME, PUBLIC_TRUST_REVIEW_STATUS, publicTrustRoutes } from '@/lib/publicTrust';

const experienceLinks = [
  { label: 'About', href: '/about' },
  { label: 'Search', href: '/search' },
  { label: 'Buy', href: '/buy' },
  { label: 'Market', href: '/market' },
  { label: 'Home Worth', href: '/home-worth' },
  { label: 'Grand Plan™', href: '/grand-plan' },
  { label: 'Sell', href: '/sell' },
];

export default function PlatformFooter() {
  return (
    <footer className="w-full border-t border-white/10 bg-[#050505] px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-10 lg:grid-cols-[1.15fr_1fr_1fr]">
        <div className="space-y-6">
          <h4 className="text-[11px] font-black uppercase tracking-[0.28em] text-cyan-100/70">David Quinn Group</h4>
          <p className="max-w-md text-sm leading-7 text-slate-400">Colorado real estate intelligence, advisory planning, and property search for the Front Range.</p>
          <p className="text-xs font-bold leading-relaxed text-slate-400">Brokerage Firm: {BROKERAGE_FIRM_NAME}</p>
          <p className="max-w-lg text-xs leading-6 text-slate-500">
            Public contact, privacy, and accessibility requests route through the <Link href="/contact" className="reie-inline-link">contact page</Link> until a branded contact email is operational.
            External Compass, MLS, brokerage-license, office, phone, and branded-email details are published only after approval.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:col-span-2">
          <div className="space-y-6">
            <h4 className="text-[11px] font-black uppercase tracking-[0.28em] text-white/80">Experience</h4>
            <nav className="grid grid-cols-1 gap-3 sm:grid-cols-2" aria-label="Public experience footer links" data-testid="public-experience-footer-links">
              {experienceLinks.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className="reie-public-footer-link text-[11px] font-black uppercase tracking-[0.14em] text-slate-500 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
                  data-testid="public-experience-footer-link"
                  {...getJourneyMeasurementAttributes({
                    surface: 'footer-experience',
                    stage: 'search',
                    action: route.href === '/sell' || route.href === '/home-worth' ? 'request-seller-review' : route.href === '/market' ? 'view-market' : 'continue-journey',
                    destination: route.href === '/sell' || route.href === '/home-worth' ? 'seller' : route.href === '/market' ? 'market' : 'search',
                  })}
                >
                  {route.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-6">
            <h4 className="text-[11px] font-black uppercase tracking-[0.28em] text-white/80">Public Trust</h4>
            <nav className="grid grid-cols-1 gap-3 sm:grid-cols-2" aria-label="Public trust footer links" data-testid="public-trust-footer-links">
              {publicTrustRoutes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-500 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
                  data-testid="public-trust-footer-link"
                  data-public-trust-route={route.href}
                >
                  {route.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 lg:col-span-3 lg:flex lg:items-end lg:justify-between lg:gap-8">
          <div>
            <h2 className="text-3xl font-black uppercase leading-none tracking-normal text-white">David Quinn Group</h2>
            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.32em] text-cyan-100/58">Colorado Advisory</p>
          </div>
          <p
            className="mt-7 text-[10px] font-black uppercase leading-5 tracking-[0.16em] text-slate-600 lg:mt-0 lg:text-right"
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
