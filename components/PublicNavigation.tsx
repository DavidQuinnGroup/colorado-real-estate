'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const publicNavigationLinks = [
  { label: 'Search', href: '/search' },
  { label: 'Buy', href: '/buy' },
  { label: 'Market', href: '/market' },
  { label: 'Home Worth', href: '/home-worth' },
  { label: 'Sell', href: '/sell' },
  { label: 'Grand Plan', href: '/grand-plan' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const;

export default function PublicNavigation() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) return null;

  return (
    <header
      className="sticky top-0 z-[950] border-b border-white/[0.08] bg-[#071017]/88 text-white shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl"
      data-testid="reie-public-navigation"
      data-reie-sprint-1-public-navigation="true"
      data-reie-navigation-consistent="true"
    >
      <nav
        className="mx-auto flex min-h-[68px] w-full max-w-[1180px] items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-8 lg:px-12"
        aria-label="Primary public navigation"
      >
        <Link
          href="/"
          className="reie-public-brand-link group flex min-w-0 items-center gap-2 rounded-[8px] text-white no-underline outline-none transition focus-visible:ring-2 focus-visible:ring-cyan-100 focus-visible:ring-offset-4 focus-visible:ring-offset-[#071017] sm:gap-3"
          aria-label="David Quinn Group home"
          data-testid="reie-public-navigation-brand"
          data-reie-brand-position="upper-left"
          data-reie-brand-home-link="/"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-white/[0.08] text-sm font-black tracking-normal ring-1 ring-white/12 transition group-hover:bg-white/[0.12] group-hover:ring-cyan-100/35">
            DQ
          </span>
          <span className="min-w-0 max-w-[124px] sm:max-w-none">
            <span className="block truncate text-xs font-black uppercase tracking-[0.08em] sm:text-sm sm:tracking-[0.15em]">David Quinn Group</span>
            <span className="mt-1 hidden text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-100/58 sm:block">
              Colorado Advisory
            </span>
          </span>
        </Link>

        <div className="reie-public-desktop-navigation-links hidden items-center gap-2 lg:flex" data-testid="reie-public-navigation-links">
          {publicNavigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="reie-public-navigation-link rounded-[7px] px-3 py-2 text-[11px] font-black uppercase tracking-[0.13em] text-white/58 no-underline transition hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-100"
              data-testid="reie-public-navigation-link"
              data-reie-public-route={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href="/search"
          className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-[8px] bg-cyan-100 px-3 py-2 text-[10px] font-black uppercase tracking-[0.08em] text-[#071017] no-underline transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-100 sm:min-h-11 sm:px-4 sm:text-[11px] sm:tracking-[0.13em]"
          data-testid="reie-public-navigation-primary-action"
        >
          Search Homes
        </Link>
      </nav>

      <details
        className="reie-public-mobile-navigation border-t border-white/[0.06] bg-[#071017]/94 lg:hidden"
        aria-label="Primary public mobile navigation"
        data-testid="reie-public-mobile-navigation"
      >
        <summary className="reie-public-mobile-menu-summary flex min-h-11 cursor-pointer list-none items-center justify-between px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/70 marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-cyan-100 sm:px-8">
          Menu
          <span aria-hidden="true" className="text-cyan-100/70">+</span>
        </summary>
        <nav className="reie-public-mobile-route-list grid gap-px bg-white/[0.06] sm:grid-cols-2" aria-label="Primary public mobile route list">
          {publicNavigationLinks.map((link) => (
            <Link
              key={`mobile-${link.href}`}
              href={link.href}
              className="reie-public-navigation-link reie-public-mobile-menu-link flex min-h-12 items-center justify-between bg-[#071017]/94 px-4 py-3 text-[10px] font-black uppercase leading-4 tracking-[0.12em] text-white/62 no-underline transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-cyan-100 sm:px-8"
              data-testid="reie-public-mobile-navigation-link"
              data-reie-public-route={link.href}
            >
              {link.label}
              <span aria-hidden="true" className="text-cyan-100/45">&rarr;</span>
            </Link>
          ))}
        </nav>
      </details>
    </header>
  );
}
