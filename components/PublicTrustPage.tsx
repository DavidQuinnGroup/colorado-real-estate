import Link from 'next/link';
import type { ReactNode } from 'react';

import {
  PRODUCT_NAME,
  PUBLIC_TRUST_REVIEW_STATUS,
  SITE_NAME,
  externalApprovalItems,
  publicTrustRoutes,
} from '@/lib/publicTrust';

type PublicTrustPageProps = {
  eyebrow: string;
  title: string;
  summary: string;
  children: ReactNode;
};

export function PublicTrustPage({ eyebrow, title, summary, children }: PublicTrustPageProps) {
  return (
    <article className="public-trust-page min-h-screen bg-[#050505] text-white">
      <section className="public-trust-hero px-5 py-14 sm:px-8 lg:px-12">
        <div className="public-trust-container mx-auto max-w-5xl min-w-0">
          <p className="public-trust-eyebrow text-[10px] font-black uppercase tracking-[0.32em] text-cyan-100/70">{eyebrow}</p>
          <h1 className="public-trust-title mt-4 max-w-3xl text-4xl font-black uppercase leading-tight tracking-normal text-white sm:text-5xl">{title}</h1>
          <p className="public-trust-summary mt-5 max-w-3xl text-base leading-7 text-white/62">{summary}</p>
          <div
            className="public-trust-status mt-6 inline-flex max-w-full break-words rounded-[6px] border border-cyan-100/30 bg-cyan-100/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100"
            data-testid="public-trust-review-status"
            data-public-trust-review-status={PUBLIC_TRUST_REVIEW_STATUS}
          >
            {PUBLIC_TRUST_REVIEW_STATUS}
          </div>
        </div>
      </section>

      <section className="public-trust-body px-5 py-12 sm:px-8 lg:px-12">
        <div className="public-trust-grid mx-auto grid max-w-5xl min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="public-trust-main min-w-0 space-y-8">{children}</div>
          <aside className="public-trust-aside min-w-0 space-y-5 bg-white/[0.035] p-5 ring-1 ring-white/[0.06]">
            <div>
              <p className="public-trust-aside-heading text-[10px] font-black uppercase tracking-[0.22em] text-white/35">Trust Pages</p>
              <nav className="public-trust-nav mt-4 grid gap-2" aria-label="Public trust pages">
                {publicTrustRoutes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className="public-trust-nav-link rounded-[6px] border border-white/10 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-white/58 transition hover:border-cyan-100/40 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
                  >
                    {route.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="border-t border-white/10 pt-5">
              <p className="public-trust-aside-heading text-[10px] font-black uppercase tracking-[0.22em] text-white/35">External Approval</p>
              <ul className="public-trust-aside-list mt-3 space-y-2 text-xs leading-5 text-white/48">
                {externalApprovalItems.slice(0, 4).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </article>
  );
}

export function TrustSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="public-trust-card min-w-0 break-words bg-white/[0.03] p-5 ring-1 ring-white/[0.06] sm:p-6">
      <h2 className="public-trust-card-title text-sm font-black uppercase tracking-[0.16em] text-cyan-100/78">{title}</h2>
      <div className="public-trust-card-body mt-4 min-w-0 space-y-4 text-sm leading-7 text-white/62">{children}</div>
    </section>
  );
}

export function TrustList({ items }: { items: readonly string[] }) {
  return (
    <ul className="public-trust-list space-y-3">
      {items.map((item) => (
        <li key={item} className="public-trust-list-item border-l border-cyan-100/28 pl-4">
          {item}
        </li>
      ))}
    </ul>
  );
}

export function StandardTrustIntro() {
  return (
    <p>
      This page is a production public-trust surface for {SITE_NAME} and the {PRODUCT_NAME}. It describes current website behavior and
      separates published facts from items that still require brokerage, MLS provider, Compass, or counsel approval.
    </p>
  );
}
