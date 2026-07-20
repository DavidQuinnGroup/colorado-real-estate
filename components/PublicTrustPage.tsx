import Link from 'next/link';
import type { ReactNode } from 'react';

import {
  PRODUCT_NAME,
  PUBLIC_TRUST_REVIEW_STATUS,
  SITE_NAME,
  ownerVerificationItems,
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
    <article className="min-h-screen bg-[#050505] text-white">
      <section className="border-b border-white/10 px-6 py-14 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <p className="text-[10px] font-black uppercase tracking-[0.32em] text-cyan-100/70">{eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black uppercase leading-tight tracking-normal text-white sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-white/62">{summary}</p>
          <div
            className="mt-6 inline-flex max-w-full rounded-[6px] border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-amber-100"
            data-testid="public-trust-review-status"
            data-public-trust-review-status={PUBLIC_TRUST_REVIEW_STATUS}
          >
            {PUBLIC_TRUST_REVIEW_STATUS}
          </div>
        </div>
      </section>

      <section className="px-6 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_260px]">
          <div className="space-y-8">{children}</div>
          <aside className="space-y-5 border border-white/10 bg-white/[0.035] p-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">Trust Pages</p>
              <nav className="mt-4 grid gap-2" aria-label="Public trust pages">
                {publicTrustRoutes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className="rounded-[6px] border border-white/10 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-white/58 transition hover:border-cyan-100/40 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
                  >
                    {route.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="border-t border-white/10 pt-5">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">Owner Review</p>
              <ul className="mt-3 space-y-2 text-xs leading-5 text-white/48">
                {ownerVerificationItems.slice(0, 4).map((item) => (
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
    <section className="border border-white/10 bg-white/[0.03] p-6">
      <h2 className="text-sm font-black uppercase tracking-[0.16em] text-cyan-100/78">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-white/62">{children}</div>
    </section>
  );
}

export function TrustList({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="border-l border-cyan-100/28 pl-4">
          {item}
        </li>
      ))}
    </ul>
  );
}

export function StandardTrustIntro() {
  return (
    <p>
      This page is a draft public-trust surface for {SITE_NAME} and the {PRODUCT_NAME}. It is intended to make current website behavior
      reviewable before controlled customer beta, not to replace owner, brokerage, MLS provider, or legal approval.
    </p>
  );
}
