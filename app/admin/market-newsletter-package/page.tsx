import type { Metadata } from 'next';

import { buildMarketNewsletterAgentReviewPackage } from '@/lib/content/marketNewsletterPackage';

export const metadata: Metadata = {
  title: 'Market Newsletter Agent Review Package | REIE Admin',
  description:
    'Read-only REIE agent review package for recurring market and newsletter preparation inputs.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function MarketNewsletterPackagePage() {
  const reviewPackage = buildMarketNewsletterAgentReviewPackage({
    geographySlug: 'boulder-co-housing-market',
    generatedAt: '2026-08-13T00:00:00.000Z',
  });

  return (
    <main
      className="min-h-screen bg-[#07100d] px-5 py-8 text-slate-100 sm:px-8 lg:px-12"
      data-testid="market-newsletter-agent-review-package"
      data-market-newsletter-agent-review="true"
      data-market-newsletter-package-status={reviewPackage.status}
      data-market-newsletter-package-city={reviewPackage.geography.cityName}
      data-market-newsletter-package-email="false"
      data-market-newsletter-package-scheduler="false"
      data-market-newsletter-package-customer-communication="false"
      data-market-newsletter-package-provider-dependency="false"
      data-market-newsletter-package-write-side-effects="false"
    >
      <div className="mx-auto max-w-7xl">
        <header className="border-b border-white/10 pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200/70">
            PROJECT ATLAS / Agent Review
          </p>
          <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Recurring Market Newsletter Package
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                {reviewPackage.geography.cityName} agent-review package for {reviewPackage.reportingPeriod.label}.
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div className="border border-white/10 bg-white/[0.04] p-3">
                <dt className="text-slate-400">Status</dt>
                <dd className="mt-1 font-medium text-emerald-100">{reviewPackage.status}</dd>
              </div>
              <div className="border border-white/10 bg-white/[0.04] p-3">
                <dt className="text-slate-400">Evidence Date</dt>
                <dd className="mt-1 font-medium text-emerald-100">{reviewPackage.evidenceEffectiveDate}</dd>
              </div>
            </dl>
          </div>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="border border-white/10 bg-white/[0.03]">
            <div className="border-b border-white/10 px-5 py-4">
              <h2 className="text-lg font-medium">Market Snapshot</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.16em] text-slate-400">
                  <tr>
                    <th className="px-5 py-3">Signal</th>
                    <th className="px-5 py-3">Value</th>
                    <th className="px-5 py-3">Type</th>
                    <th className="px-5 py-3">Review Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {reviewPackage.marketSnapshot.metrics.map((metric) => (
                    <tr key={metric.label}>
                      <td className="px-5 py-4 font-medium text-slate-100">{metric.label}</td>
                      <td className="px-5 py-4 text-emerald-100">{metric.value}</td>
                      <td className="px-5 py-4 text-slate-300">{metric.classification}</td>
                      <td className="px-5 py-4 text-slate-300">{metric.explanation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="border border-white/10 bg-white/[0.03]">
            <div className="border-b border-white/10 px-5 py-4">
              <h2 className="text-lg font-medium">Review Flags</h2>
            </div>
            <div className="divide-y divide-white/10">
              {reviewPackage.reviewFlags.map((reviewFlag) => (
                <div key={`${reviewFlag.type}-${reviewFlag.section}`} className="px-5 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="border border-amber-300/30 bg-amber-300/10 px-2 py-1 text-xs font-semibold text-amber-100">
                      {reviewFlag.type}
                    </span>
                    <span className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      {reviewFlag.severity}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-200">{reviewFlag.message}</p>
                  <p className="mt-1 text-sm text-slate-400">{reviewFlag.agentAction}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-lg font-medium">Agent Talking-Point Inputs</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
              {reviewPackage.agentTalkingPointInputs.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-lg font-medium">Customer-Education Inputs</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
              {reviewPackage.customerEducationInputs.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-6 border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/10 px-5 py-4">
            <h2 className="text-lg font-medium">Source / Freshness References</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.16em] text-slate-400">
                <tr>
                  <th className="px-5 py-3">Source</th>
                  <th className="px-5 py-3">Freshness</th>
                  <th className="px-5 py-3">Effective Period</th>
                  <th className="px-5 py-3">Limitation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {reviewPackage.sourceReferences.map((source) => (
                  <tr key={source.sourceId}>
                    <td className="px-5 py-4">
                      <span className="block font-medium text-slate-100">{source.sourceName}</span>
                      <span className="text-xs text-slate-500">{source.sourcePath}</span>
                    </td>
                    <td className="px-5 py-4 text-slate-300">{source.freshness}</td>
                    <td className="px-5 py-4 text-slate-300">{source.effectivePeriod}</td>
                    <td className="px-5 py-4 text-slate-300">{source.limitation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-lg font-medium">Editorial Checklist</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
              {reviewPackage.editorialChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-lg font-medium">Human Judgment Boundary</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
              {reviewPackage.humanJudgmentBoundary.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
