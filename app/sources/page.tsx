import type { Metadata } from 'next';

import { PublicTrustPage, StandardTrustIntro, TrustList, TrustSection } from '@/components/PublicTrustPage';
import { buildColoradoSourceTrustExperience } from '@/lib/coloradoSourceTrustExperience';
import { PUBLIC_TRUST_REVIEW_STATUS, SITE_NAME, SITE_URL } from '@/lib/publicTrust';
import { getPublicSourceRegistryRecords, getReieSourceRegistry } from '@/lib/sourceRegistry';

export const metadata: Metadata = {
  title: `Sources & Methodology | ${SITE_NAME}`,
  description: 'How REIE classifies sources, tracks limitations, and separates sourced evidence from REIE calculations.',
  alternates: { canonical: `${SITE_URL}/sources` },
  robots: { index: true, follow: true },
};

const sourceClassDescriptions = [
  'Authoritative sources are official records or agencies, but they are not used automatically unless authorization and permitted use are clear.',
  'Licensed professional sources include professional listing data and related controls that may support property and market context.',
  'Supplemental sources can help orient a decision, but they do not replace the primary record authority.',
  'REIE calculations are deterministic outputs from stated inputs or identified evidence, not external provider records.',
];

export default function SourcesPage() {
  const registry = getReieSourceRegistry();
  const records = getPublicSourceRegistryRecords();
  const sourceTrust = buildColoradoSourceTrustExperience();

  return (
    <PublicTrustPage
      eyebrow="Sources & Methodology"
      title="How REIE Uses Information"
      summary="REIE separates identified sources, evidence limits, and REIE-derived calculations so customer-facing claims stay bounded by what is actually supported."
    >
      <TrustSection title="Production Status">
        <StandardTrustIntro />
        <p>Classification: {PUBLIC_TRUST_REVIEW_STATUS}.</p>
        <p data-testid="sources-registry-status" data-source-registry-status={registry.status}>
          Source Registry version {registry.version}, reference date {registry.referenceDate}.
        </p>
        <p data-testid="colorado-source-trust-status" data-colorado-source-trust-status={sourceTrust.status}>
          Colorado Source Trust presents customer-safe source status, coverage, limitations, and verification paths without activating new sources.
        </p>
      </TrustSection>

      <TrustSection title="Source Classes">
        <TrustList items={sourceClassDescriptions} />
      </TrustSection>

      <TrustSection title="Customer Source Status">
        <div className="grid gap-3 sm:grid-cols-2" data-testid="source-trust-status-legend" data-source-trust-status-count={sourceTrust.statusLegend.length}>
          {sourceTrust.statusLegend.map((item) => (
            <article
              key={item.status}
              className="min-w-0 bg-black/18 p-4 ring-1 ring-white/10"
              data-testid="source-trust-status"
              data-source-trust-status={item.status}
            >
              <h2 className="text-xs font-black uppercase tracking-[0.14em] text-cyan-100">{item.status}</h2>
              <p className="mt-2 text-xs leading-5 text-white/55">{item.explanation}</p>
            </article>
          ))}
        </div>
      </TrustSection>

      <TrustSection title="Methodology">
        <TrustList items={[...registry.customerTrustContract, ...sourceTrust.methodology]} />
      </TrustSection>

      <TrustSection title="Current Source Records">
        <div className="grid gap-4" data-testid="sources-registry-records" data-source-registry-record-count={records.length}>
          {sourceTrust.sourceRecords.map((record) => (
            <article
              key={record.sourceId}
              className="min-w-0 bg-black/18 p-4 ring-1 ring-white/10"
              data-testid="sources-registry-record"
              data-source-id={record.sourceId}
              data-source-class={records.find((sourceRecord) => sourceRecord.sourceId === record.sourceId)?.sourceClass ?? ''}
              data-source-activation-state={records.find((sourceRecord) => sourceRecord.sourceId === record.sourceId)?.productionActivationState ?? ''}
              data-source-customer-status={record.customerStatus}
              data-source-in-use={String(record.isInUse)}
              data-source-official-link={record.officialSourceLink ?? ''}
              data-source-claim-eligible={String(record.isInUse)}
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/66">{record.customerStatus}</p>
                  <h2 className="mt-2 text-lg font-black leading-tight text-white">{record.sourceName}</h2>
                  <p className="mt-2 text-xs font-bold leading-5 text-white/48">{record.responsibleAgency}</p>
                </div>
                <span className="inline-flex min-h-8 shrink-0 items-center rounded-[6px] bg-cyan-100/[0.08] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-cyan-100">
                  {record.sourceType}
                </span>
              </div>
              <dl className="mt-4 grid gap-3 text-xs leading-5 text-white/55 sm:grid-cols-2">
                <div>
                  <dt className="font-black uppercase tracking-[0.12em] text-white/35">Coverage</dt>
                  <dd>{record.geographicCoverage}</dd>
                </div>
                <div>
                  <dt className="font-black uppercase tracking-[0.12em] text-white/35">Domains</dt>
                  <dd>{record.domains.join(', ')}</dd>
                </div>
                <div>
                  <dt className="font-black uppercase tracking-[0.12em] text-white/35">What it supports</dt>
                  <dd>{record.whatItSupports}</dd>
                </div>
                <div>
                  <dt className="font-black uppercase tracking-[0.12em] text-white/35">Freshness</dt>
                  <dd>{record.freshness}</dd>
                </div>
                <div>
                  <dt className="font-black uppercase tracking-[0.12em] text-white/35">Current REIE use</dt>
                  <dd>{record.currentReieUseStatus}</dd>
                </div>
                <div>
                  <dt className="font-black uppercase tracking-[0.12em] text-white/35">Verify</dt>
                  <dd>
                    {record.officialSourceLink ? (
                      <a
                        className="font-black text-cyan-100 underline decoration-cyan-100/30 underline-offset-4"
                        href={record.officialSourceLink}
                        rel="noreferrer"
                        target="_blank"
                        data-testid="source-trust-official-link"
                        data-source-trust-official-link={record.officialSourceLink}
                      >
                        Verify at source
                      </a>
                    ) : (
                      record.verifyAtSource
                    )}
                  </dd>
                </div>
              </dl>
              <div className="mt-4 border-t border-white/10 pt-4">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/35">Limitations</p>
                <ul className="mt-2 grid gap-2 text-xs leading-5 text-white/52">
                  {record.limitations.slice(0, 3).map((limitation) => (
                    <li key={limitation}>{limitation}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </TrustSection>

      <TrustSection title="Colorado County Source Coverage">
        <p>
          This directory is a customer-facing source-coverage map, not a claim that all Colorado counties are integrated. Counties without
          governed customer-facing source records remain neutral and not currently available.
        </p>
        <div
          className="grid gap-3"
          data-testid="colorado-source-county-directory"
          data-colorado-source-county-count={sourceTrust.countyCoverage.length}
          data-colorado-source-county-integrated-count={sourceTrust.countyCoverage.filter((county) => county.isIntegrated).length}
        >
          {sourceTrust.countyCoverage.map((county) => (
            <article
              key={county.county}
              className="min-w-0 bg-black/18 p-4 ring-1 ring-white/10"
              data-testid="colorado-source-county"
              data-colorado-source-county={county.county}
              data-colorado-source-county-status={county.customerStatus}
              data-colorado-source-county-integrated={String(county.isIntegrated)}
              data-colorado-source-county-domains={county.domains.join(',')}
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-sm font-black uppercase tracking-[0.12em] text-white">{county.county} County</h2>
                  <p className="mt-2 text-xs leading-5 text-white/55">{county.currentReieUse}</p>
                </div>
                <span className="inline-flex min-h-8 shrink-0 items-center rounded-[6px] bg-white/[0.06] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-cyan-100">
                  {county.customerStatus}
                </span>
              </div>
              <dl className="mt-4 grid gap-3 text-xs leading-5 text-white/55 sm:grid-cols-2">
                <div>
                  <dt className="font-black uppercase tracking-[0.12em] text-white/35">Source domains</dt>
                  <dd>{county.domains.length ? county.domains.join(', ') : 'No governed customer-facing county source record'}</dd>
                </div>
                <div>
                  <dt className="font-black uppercase tracking-[0.12em] text-white/35">Freshness</dt>
                  <dd>{county.freshness}</dd>
                </div>
                <div>
                  <dt className="font-black uppercase tracking-[0.12em] text-white/35">Sources</dt>
                  <dd>{county.sourceNames.length ? county.sourceNames.join(', ') : 'None governed for current customer use'}</dd>
                </div>
                <div>
                  <dt className="font-black uppercase tracking-[0.12em] text-white/35">Limitations</dt>
                  <dd>{county.limitations[0]}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </TrustSection>

      <TrustSection title="Colorado Scaling">
        <TrustList items={registry.statewideScalingContract} />
      </TrustSection>

      <TrustSection title="What This Page Does Not Mean">
        <p>
          A public website, official portal, or named source is not the same thing as authorized automated use. Sources marked as awaiting
          confirmation, blocked, reference-only, or review-required are not active customer evidence feeds.
        </p>
        <p>
          REIE does not guarantee that external information is complete, current, or error-free. Important property, financing, tax, permit,
          legal, insurance, and condition questions still require current source review and appropriate professional guidance.
        </p>
      </TrustSection>
    </PublicTrustPage>
  );
}
