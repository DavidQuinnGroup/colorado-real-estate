import type { Metadata } from 'next';
import Link from 'next/link';

import { BROKERAGE_FIRM_NAME } from '@/lib/publicTrust';

const SITE_URL = 'https://davidquinngroup.com';

export const metadata: Metadata = {
  title: 'Advisor Experience | David Quinn Group',
  description:
    'Learn how David Quinn Group helps Colorado buyers, sellers, and owners make clearer real estate decisions through construction perspective, advisory planning, and Front Range market context.',
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: 'Advisor Experience | David Quinn Group',
    description:
      'Construction-informed Colorado real estate advisory for clients who want clearer decisions, better questions, and a practical plan.',
    url: `${SITE_URL}/about`,
    siteName: 'David Quinn Group',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const sections = [
  {
    eyebrow: 'Why REIE Exists',
    title: 'Real estate should feel clearer before it feels urgent.',
    body: 'REIE was built for people who want more than a list of homes. It helps frame the decision: what fits, what carries risk, what deserves deeper review, and what should happen next.',
  },
  {
    eyebrow: 'Construction Expertise',
    title: 'A property is more than its finishes.',
    body: 'Construction perspective brings attention to drainage, envelope exposure, systems, maintenance, renovation scope, and the difference between cosmetic appeal and durable value.',
  },
  {
    eyebrow: 'Advisory Philosophy',
    title: 'Start with the decision, then evaluate the property.',
    body: 'The work is meant to slow down the right questions before the market speeds up the timeline. Fit, risk, lifestyle, preparation, and leverage all matter before a client commits.',
  },
  {
    eyebrow: 'How I Work With Clients',
    title: 'Listen first, translate the tradeoffs, guide the next move.',
    body: 'Each conversation is oriented around what the client is trying to accomplish. The goal is to make the options easier to compare and the next step easier to trust.',
  },
  {
    eyebrow: 'What Makes This Different',
    title: 'Search is only one part of the decision.',
    body: 'The experience combines Colorado market perspective, property condition awareness, lifestyle fit, and planning discipline so clients can move with more confidence and fewer surprises.',
  },
  {
    eyebrow: 'The Grand Plan Approach',
    title: 'Connect the home to the life around it.',
    body: 'The Grand Plan approach looks beyond the transaction and considers timing, renovation needs, daily routes, family priorities, capital planning, and the longer arc of ownership.',
  },
  {
    eyebrow: 'What Clients Can Expect',
    title: 'Informed, guided, understood, and optimistic.',
    body: 'The experience is designed to replace pressure with perspective. Clients should leave each step with better questions, clearer tradeoffs, and a practical path forward.',
  },
];

const advisorySteps = [
  'Clarify what the decision needs to accomplish.',
  'Compare property, market, and lifestyle tradeoffs.',
  'Identify diligence questions before they become surprises.',
  'Choose a next step that fits the client, not just the listing.',
];

export default function AboutPage() {
  return (
    <main className="bg-[#070b10] text-white" data-testid="about-advisor-page">
      <section className="border-b border-white/10 px-7 py-28 sm:px-10 sm:py-36 lg:px-12">
        <div className="mx-auto max-w-[1180px]">
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#b7dbe2]">Advisor Experience</p>
          <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[0.98] tracking-normal sm:text-6xl lg:text-7xl">
            A clearer way to make the real estate decision in front of you.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-9 text-white/72 sm:text-xl">
            David Quinn Group helps Colorado buyers, sellers, and owners evaluate homes through construction
            perspective, market context, and a practical planning framework.
          </p>
          <div className="mt-12 flex flex-col gap-4 sm:flex-row">
            <Link href="/search" className="home-btn home-btn-primary">
              Start With Search
            </Link>
            <Link href="/grand-plan" className="home-btn home-btn-secondary">
              Build Your Grand Plan™
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#0b1117] px-7 py-24 sm:px-10 lg:px-12" data-testid="about-advisory-sections">
        <div className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-2">
          {sections.map((section) => (
            <article key={section.eyebrow} className="rounded-[14px] bg-white/[0.052] p-8 ring-1 ring-white/10">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#b7dbe2]">{section.eyebrow}</p>
              <h2 className="mt-5 text-3xl font-black leading-tight tracking-normal text-white">{section.title}</h2>
              <p className="mt-5 text-sm leading-7 text-white/64">{section.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#e8e2d8] px-7 py-24 text-[#111820] sm:px-10 lg:px-12" data-testid="about-decision-framework">
        <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#6f5b43]">Decision-Making Framework</p>
            <h2 className="mt-5 text-4xl font-black leading-[1.05] tracking-normal sm:text-5xl">
              The right property decision is easier to trust when the tradeoffs are visible.
            </h2>
          </div>
          <div className="grid gap-4">
            {advisorySteps.map((step, index) => (
              <div key={step} className="flex gap-5 bg-white p-6 shadow-[0_18px_55px_rgba(40,35,28,0.09)]">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#111820] text-xs font-black text-white">
                  {index + 1}
                </span>
                <p className="text-sm font-bold leading-7 text-[#293542]/78">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-7 py-24 sm:px-10 lg:px-12" data-testid="about-next-steps">
        <div className="mx-auto max-w-[1180px] rounded-[16px] bg-white px-8 py-14 text-[#071017] shadow-[0_30px_90px_rgba(0,0,0,0.22)] sm:px-12">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#6f5b43]">Next Steps</p>
          <h2 className="mt-5 max-w-3xl text-4xl font-black leading-[1.05] tracking-normal sm:text-5xl">
            Begin with the question you need answered.
          </h2>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-[#293542]/72">
            Explore listings, start the Grand Plan path, or use the contact page to request a conversation.
            Public contact details and brokerage disclosures remain routed through approved trust controls.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/search" className="home-btn home-btn-dark">
              Search Colorado Homes
            </Link>
            <Link href="/grand-plan" className="home-btn home-btn-light">
              Build Your Grand Plan™
            </Link>
            <Link href="/contact" className="home-btn home-btn-light">
              Contact David Quinn
            </Link>
          </div>
          <p className="mt-8 text-xs leading-6 text-[#293542]/54">
            Brokerage Firm: {BROKERAGE_FIRM_NAME}. Do not submit confidential negotiating positions or private
            financial details until a brokerage relationship and secure intake path are confirmed.
          </p>
        </div>
      </section>
    </main>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/app/about/page.tsx
