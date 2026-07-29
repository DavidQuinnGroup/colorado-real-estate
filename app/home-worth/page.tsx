import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import HomeValueEstimator from '@/components/HomeValueEstimator';
import FAQSchema from '@/components/schema/FAQSchema';
import { getJourneyMeasurementAttributes } from '@/lib/customerJourneyMeasurement';
import { buildSellerDecisionWorkspace } from '@/lib/sellerDecisionWorkspace';
import type { FAQItem } from '@/lib/schema/faqSchema';
import { SITE_NAME, SITE_URL } from '@/lib/publicTrust';

const HERO_IMAGE = '/colorado-front-range-hero.jpg';

export const metadata: Metadata = {
  title: `What Is My Home Worth? | ${SITE_NAME}`,
  description:
    'Understand Colorado home value through local market context, preparation, condition, timing, buyer behavior, and a professional seller review.',
  alternates: { canonical: `${SITE_URL}/home-worth` },
  robots: { index: true, follow: true },
  openGraph: {
    title: `What Is My Home Worth? | ${SITE_NAME}`,
    description:
      'A calm, human seller-confidence experience for Colorado homeowners who want context before requesting a professional review.',
    url: `${SITE_URL}/home-worth`,
    siteName: SITE_NAME,
    locale: 'en_US',
    type: 'website',
  },
};

const sectionShell = 'px-5 py-20 sm:px-8 sm:py-24 lg:px-12';
const containerShell = 'mx-auto w-full max-w-[1180px]';
const eyebrowClass = 'text-[11px] font-black uppercase tracking-[0.28em] text-cyan-100';
const darkEyebrowClass = 'text-[11px] font-black uppercase tracking-[0.28em] text-[#6f5b43]';
const headingClass = 'mt-5 max-w-4xl text-4xl font-black leading-[1.04] tracking-normal text-white sm:text-5xl';
const bodyClass = 'mt-6 max-w-2xl text-base leading-8 text-white/66 sm:text-lg';
const primaryButtonClass = 'home-btn home-btn-primary';
const secondaryButtonClass = 'home-btn home-btn-secondary';
const darkButtonClass = 'home-btn home-btn-dark';
const lightButtonClass = 'home-btn home-btn-light';

const valueFactors = [
  {
    title: 'Market alternatives',
    body: 'Value depends on the homes a serious buyer can choose instead, including active inventory, recent sales, and local competition.',
  },
  {
    title: 'Condition and preparation',
    body: 'Small repairs, presentation, maintenance signals, and documentation can shape buyer confidence before negotiations begin.',
  },
  {
    title: 'Timing and buyer behavior',
    body: 'Season, inventory pressure, showing momentum, and buyer urgency affect pricing strategy and the right launch posture.',
  },
  {
    title: 'Property-specific context',
    body: 'Layout, setting, updates, systems, exposure, access, and neighborhood fit can matter as much as broad market averages.',
  },
];

const confidenceInputs = [
  'address and city',
  'selling timeline',
  'recent improvements',
  'known maintenance concerns',
  'preparation questions',
  'next-move priorities',
];

const nextSteps = [
  {
    label: 'Review',
    body: 'Your property details, timeline, and objective are organized for advisor review.',
  },
  {
    label: 'Context',
    body: 'Market alternatives, preparation priorities, and likely buyer questions shape the conversation.',
  },
  {
    label: 'Follow-up',
    body: 'David Quinn Group follows up directly. The request does not publish a value or create a brokerage relationship by itself.',
  },
];

const homeWorthFaqs: FAQItem[] = [
  {
    question: 'Does this page provide an instant home value?',
    answer:
      'No. This experience explains the value conversation and offers a professional seller review request. It does not publish an automated valuation, appraisal, or price opinion.',
  },
  {
    question: 'Why can online home-value estimates differ?',
    answer:
      'Online estimates may not fully understand condition, preparation, buyer objections, timing, local competition, or the specific story a home presents to the market.',
  },
  {
    question: 'What happens after I request a seller review?',
    answer:
      'David Quinn Group reviews the property details, preparation priorities, timing, and market context before direct follow-up.',
  },
];

export default function HomeWorthPage() {
  const sellerDecisionWorkspace = buildSellerDecisionWorkspace({
    marketHref: '/market',
    searchHref: '/search',
    sellerHref: '/sell',
    requestHref: '#home-worth-request',
  });

  return (
    <>
      <FAQSchema faqs={homeWorthFaqs} pageUrl={`${SITE_URL}/home-worth`} />
      <main
        className="min-h-screen bg-[#071017] text-white"
        data-testid="reie-home-worth-page"
        data-reie-sprint-2-seller-confidence="true"
        data-reie-home-worth-automated-valuation="false"
        data-reie-home-worth-ai="false"
        data-reie-home-worth-gis="false"
        data-reie-home-worth-provider-activation="false"
      >
        <section className="relative overflow-hidden" data-testid="home-worth-hero">
          <Image
            src={HERO_IMAGE}
            alt="Colorado residential neighborhood and Front Range setting for seller confidence"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,7,10,0.92)_0%,rgba(5,7,10,0.72)_48%,rgba(5,7,10,0.28)_100%)]" />

          <div className={`${containerShell} relative z-10 flex min-h-[calc(100vh-112px)] items-center px-5 pb-24 pt-20 sm:px-8 lg:px-12`}>
            <div className="max-w-3xl">
              <p className={eyebrowClass}>Seller Confidence Experience</p>
              <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[0.96] tracking-normal text-white sm:text-6xl lg:text-7xl">
                What Is My Home Worth?
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-9 text-white/78 sm:text-xl">
                A useful home-worth conversation starts with context, not a generic number. Understand the factors that shape value before
                requesting a professional seller review.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#home-worth-request"
                  className={primaryButtonClass}
                  {...getJourneyMeasurementAttributes({
                    surface: 'home-worth-hero',
                    stage: 'seller',
                    action: 'request-seller-review',
                    destination: 'seller',
                  })}
                >
                  Request Seller Review
                </a>
                <Link
                  href="/market"
                  className={secondaryButtonClass}
                  {...getJourneyMeasurementAttributes({
                    surface: 'home-worth-hero',
                    stage: 'seller',
                    action: 'view-market',
                    destination: 'market',
                  })}
                >
                  View Market Context
                </Link>
              </div>
              <p className="mt-7 max-w-2xl text-sm font-bold leading-7 text-white/58">
                No instant automated value is produced here. No AI recommendation, external estimate, or brokerage relationship is
                created by reading this page.
              </p>
            </div>
          </div>
        </section>

        <section className={`${sectionShell} border-y border-white/10 bg-[#0b1117]`} data-testid="home-worth-why-difficult">
          <div className={`${containerShell} grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start`}>
            <div>
              <p className={eyebrowClass}>Why Value Is Complicated</p>
              <h2 className={headingClass}>A home is not valued by one input.</h2>
              <p className={bodyClass}>
                Online estimates can be useful starting points, but they can miss the details that change buyer confidence. A Colorado
                seller review should account for the property, the market, the preparation plan, and the moment you choose to launch.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2" data-testid="home-worth-value-factors">
              {valueFactors.map((factor) => (
                <article key={factor.title} className="rounded-[10px] bg-white/[0.055] p-6 shadow-[0_22px_70px_rgba(0,0,0,0.16)] ring-1 ring-white/10">
                  <h3 className="text-xl font-black leading-tight text-white">{factor.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-white/64">{factor.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={`${sectionShell} bg-[#e8e2d8] text-[#101820]`} data-testid="home-worth-estimate-difference">
          <div className={`${containerShell} grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center`}>
            <div>
              <p className={darkEyebrowClass}>Online Estimates</p>
              <h2 className="mt-5 max-w-4xl text-4xl font-black leading-[1.04] tracking-normal sm:text-5xl">
                Automated estimates can disagree because they cannot see the full decision.
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[#293542]/76 sm:text-lg">
                A seller needs more than a number. Condition, buyer objections, presentation, local alternatives, and timing all affect how
                a price will be received. The goal is to understand what is known, what needs verification, and what should be prepared.
              </p>
            </div>
            <div className="rounded-[14px] bg-white p-8 shadow-[0_24px_70px_rgba(40,35,28,0.12)] ring-1 ring-[#101820]/8">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#6f5b43]">This Experience Is</p>
              <ul className="mt-6 grid gap-4 text-sm font-bold leading-7 text-[#293542]/78">
                <li>Educational before promotional.</li>
                <li>Human-reviewed before any pricing conversation.</li>
                <li>Grounded in local market context and preparation strategy.</li>
                <li>Designed to reduce uncertainty before requesting follow-up.</li>
              </ul>
              <p className="mt-7 rounded-[8px] bg-[#101820]/6 p-4 text-xs font-bold leading-6 text-[#293542]/70">
                This is not an automated home-value estimate, appraisal, guarantee, or forecast.
              </p>
            </div>
          </div>
        </section>

        <section className={sectionShell} data-testid="home-worth-local-expertise">
          <div className={`${containerShell} grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start`}>
            <div>
              <p className={eyebrowClass}>Local Expertise Matters</p>
              <h2 className={headingClass}>The right value conversation is local, practical, and specific.</h2>
              <p className={bodyClass}>
                David Quinn Group uses market intelligence, construction awareness, and seller preparation discipline to frame the
                conversation around how buyers are likely to respond.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/market" className={primaryButtonClass}>
                  Explore Markets
                </Link>
                <Link href="/sell" className={secondaryButtonClass}>
                  Seller Strategy
                </Link>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2" data-testid="home-worth-confidence-inputs">
              {confidenceInputs.map((input) => (
                <div key={input} className="rounded-[10px] bg-white/[0.055] p-5 text-sm font-black uppercase tracking-[0.12em] text-white/72 ring-1 ring-white/10">
                  {input}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={`${sectionShell} border-y border-white/10 bg-[#101820]`} data-testid="home-worth-next-steps">
          <div className={containerShell}>
            <div className="max-w-3xl">
              <p className={eyebrowClass}>What Happens Next</p>
              <h2 className={headingClass}>The request starts a professional review, not an instant price claim.</h2>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {nextSteps.map((step) => (
                <article key={step.label} className="rounded-[12px] bg-white/[0.055] p-7 ring-1 ring-white/10">
                  <p className="text-[11px] font-black uppercase tracking-[0.22em] text-cyan-100/72">{step.label}</p>
                  <p className="mt-4 text-sm leading-7 text-white/66">{step.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className={`${sectionShell} bg-[#071017]`}
          data-testid="reie-seller-v8-decision-workspace"
          data-seller-v8-item-count={sellerDecisionWorkspace.items.length}
          data-seller-v8-ai="false"
          data-seller-v8-automated-valuation="false"
          data-seller-v8-gis="false"
          data-seller-v8-telemetry="false"
          data-seller-v8-lender-workflow="false"
        >
          <div className={containerShell}>
            <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
              <div>
                <p className={eyebrowClass}>Seller Decision Workspace</p>
                <h2 className={headingClass}>{sellerDecisionWorkspace.headline}</h2>
                <p className={bodyClass}>{sellerDecisionWorkspace.orientation}</p>
                <p className="mt-6 rounded-[8px] border border-cyan-100/16 bg-cyan-100/[0.055] p-4 text-xs font-bold leading-6 text-white/50">
                  {sellerDecisionWorkspace.trustBoundary}
                </p>
              </div>

              <div className="grid gap-px overflow-hidden rounded-[8px] border border-white/10 bg-white/10 sm:grid-cols-2">
                {sellerDecisionWorkspace.items.map((item) => (
                  <Link
                    key={item.lens}
                    href={item.href}
                    className="group flex min-w-0 flex-col bg-[#0b1117] p-5 transition hover:bg-[#101820]"
                    data-testid="reie-seller-v8-decision-item"
                    data-seller-v8-lens={item.lens}
                    data-seller-v8-action={item.action}
                    {...getJourneyMeasurementAttributes({
                      surface: 'seller-v8-decision-workspace',
                      stage: 'seller',
                      action: 'continue-journey',
                      destination: item.lens === 'factors' ? 'market' : item.lens === 'next' ? 'search' : 'seller',
                    })}
                  >
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100/62">{item.label}</p>
                    <p className="mt-3 text-sm leading-6 text-white/60">{item.guidance}</p>
                    <span className="mt-auto pt-5 text-[10px] font-black uppercase tracking-[0.14em] text-cyan-100 transition group-hover:text-white">
                      {item.action}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="home-worth-request" className={`${sectionShell} bg-[#0b1117]`} data-testid="home-worth-request">
          <div className={`${containerShell} grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start`}>
            <div>
              <p className={eyebrowClass}>Home Value Request</p>
              <h2 className={headingClass}>Ask for a seller review when you are ready for a human conversation.</h2>
              <p className={bodyClass}>
                Share the property, your timing, and the decision you are trying to make. Do not include confidential negotiating positions
                or financial limits until the appropriate brokerage relationship and disclosures have been discussed.
              </p>
              <div className="mt-9 grid gap-3 sm:grid-cols-2">
                <Link href="/market" className={secondaryButtonClass}>
                  Market Context
                </Link>
                <Link href="/contact" className={secondaryButtonClass}>
                  Ask a Question
                </Link>
              </div>
            </div>
            <HomeValueEstimator />
          </div>
        </section>

        <section className="px-5 pb-28 pt-4 sm:px-8 sm:pb-32 lg:px-12" data-testid="home-worth-continuation">
          <div className={`${containerShell} rounded-[16px] bg-white px-8 py-14 text-[#101820] shadow-[0_30px_90px_rgba(0,0,0,0.22)] sm:px-12`}>
            <p className={darkEyebrowClass}>Continue With Context</p>
            <h2 className="mt-5 max-w-3xl text-4xl font-black leading-[1.05] tracking-normal sm:text-5xl">
              Value becomes clearer when the market, the property, and the next move are considered together.
            </h2>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/market" className={darkButtonClass}>
                View Market Context
              </Link>
              <Link href="/search" className={lightButtonClass}>
                Review Inventory
              </Link>
              <Link href="/sell" className={lightButtonClass}>
                Seller Strategy
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
