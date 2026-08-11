import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Info, Search, ShieldCheck } from 'lucide-react';
import { Fragment } from 'react';

import {
  buildCustomerControlledComparisonWorkspace,
  CUSTOMER_CONTROLLED_PROPERTY_COMPARISON_MAX_SELECTIONS,
  CUSTOMER_CONTROLLED_PROPERTY_COMPARISON_ROUTE,
  parseCustomerControlledComparisonIds,
  type CustomerControlledComparisonPropertyInput,
} from '@/lib/property/customerControlledComparison';
import { getPublicPropertiesByIds } from '@/lib/property/publicPropertyRead';

type PropertyComparisonPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Property Comparison Workspace | David Quinn Group',
  description: 'Customer-controlled side-by-side review of selected public listing facts and verification questions.',
  robots: {
    index: false,
    follow: true,
  },
};

function mapProperty(property: Awaited<ReturnType<typeof getPublicPropertiesByIds>>[number]): CustomerControlledComparisonPropertyInput {
  return {
    id: property.id,
    address: property.address,
    city: property.city,
    state: property.state,
    price: property.price,
    beds: property.beds,
    baths: property.baths,
    sqft: property.sqft,
    lotSize: property.lotSize,
    yearBuilt: property.yearBuilt,
    propertyType: property.propertyType,
    status: property.status,
    updatedAt: property.updatedAt,
    lastIntelligenceSync: property.lastIntelligenceSync,
  };
}

export default async function CustomerControlledPropertyComparisonPage({ searchParams }: PropertyComparisonPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const selection = parseCustomerControlledComparisonIds(resolvedSearchParams.ids);
  const properties = selection.canAttemptRead ? (await getPublicPropertiesByIds(selection.canonicalIds)).map(mapProperty) : [];
  const workspace = buildCustomerControlledComparisonWorkspace({ selection, properties });

  return (
    <main
      className="min-h-screen bg-[#070b10] text-white"
      data-testid="customer-controlled-property-comparison-page"
      data-property-comparison-route={CUSTOMER_CONTROLLED_PROPERTY_COMPARISON_ROUTE}
      data-property-comparison-city-route-affected="false"
      data-property-comparison-query-param="ids"
      data-property-comparison-cities-param="ignored"
      data-property-comparison-customer-controlled="true"
      data-property-comparison-storage="false"
      data-property-comparison-api="false"
      data-property-comparison-schema-change="false"
      data-property-comparison-provider-activation="false"
      data-property-comparison-persistence="false"
      data-property-comparison-telemetry="false"
      data-property-comparison-ranking="false"
      data-property-comparison-scoring="false"
      data-property-comparison-recommendation="false"
      data-property-comparison-suitability="false"
      data-property-comparison-valuation="false"
      data-property-comparison-offer-guidance="false"
      data-property-comparison-financing-advice="false"
      data-property-comparison-can-compare={String(workspace.canCompare)}
      data-property-comparison-selected-count={workspace.properties.length}
      data-property-comparison-canonical-href={workspace.selection.canonicalHref}
    >
      <section className="border-b border-white/10 bg-[linear-gradient(135deg,rgba(109,207,220,0.14),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.05),transparent_48%)]">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
          <Link
            href="/search"
            className="inline-flex min-h-10 items-center gap-2 rounded-[6px] border border-white/12 bg-white/[0.035] px-3 text-[10px] font-black uppercase tracking-[0.14em] text-white/62 transition hover:border-cyan-100/40 hover:text-cyan-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Search
          </Link>
          <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100/76">Property Comparison Workspace</p>
              <h1 className="mt-3 max-w-4xl font-serif text-[34px] font-black leading-none tracking-normal text-white sm:text-[48px]">
                Which selected homes need more verification before a tour or next step?
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-white/62">
                This side-by-side view compares factual differences, evidence gaps, and verification questions across the homes you deliberately chose.
              </p>
              <p className="mt-2 max-w-3xl text-xs font-bold leading-5 text-white/46">
                Verify public Property pages, Sources, Property Inquiry, and Advisory before relying on unresolved facts.
              </p>
            </div>
            <div className="rounded-[8px] border border-cyan-100/18 bg-cyan-100/[0.065] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100/72">Selection</p>
              <p className="mt-2 text-2xl font-black text-white">{workspace.properties.length}/{CUSTOMER_CONTROLLED_PROPERTY_COMPARISON_MAX_SELECTIONS}</p>
              <p className="mt-1 text-xs font-bold leading-5 text-white/54">Order is canonical for the URL only. It is not preference, priority, or a recommendation.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
        {workspace.selection.notices.length ? (
          <div className="grid gap-2" data-testid="property-comparison-notices">
            {workspace.selection.notices.map((notice) => (
              <div
                key={`${notice.reason}-${notice.id || notice.message}`}
                className="rounded-[8px] border border-amber-200/22 bg-amber-200/[0.08] p-3 text-xs font-bold leading-5 text-amber-50"
                data-testid="property-comparison-notice"
                data-property-comparison-notice-reason={notice.reason}
              >
                {notice.message}
              </div>
            ))}
          </div>
        ) : null}

        {!workspace.canCompare ? (
          <div className="mt-4 rounded-[8px] border border-white/10 bg-[#0d141c] p-5" data-testid="property-comparison-empty-state">
            <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">
              <Search size={14} aria-hidden="true" />
              Choose From Search
            </p>
            <h2 className="mt-3 text-xl font-black uppercase tracking-tight text-white">
              Select two or three homes before comparing.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/56">
              A single home can still be reviewed on its Property page. Side-by-side comparison starts when at least two valid public property ids remain available.
            </p>
            <Link
              href="/search"
              className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-[6px] bg-cyan-100 px-4 text-[10px] font-black uppercase tracking-[0.14em] text-[#061017] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
            >
              Return to Search
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <div className="mt-5 space-y-5">
            <div
              className="overflow-hidden rounded-[8px] border border-white/10 bg-[#0d141c]"
              data-testid="property-comparison-table"
              data-property-comparison-row-count={workspace.rows.length}
            >
              <div className="grid gap-px bg-white/10" style={{ gridTemplateColumns: `minmax(150px,0.8fr) repeat(${workspace.properties.length}, minmax(180px,1fr))` }}>
                <div className="bg-[#111a23] p-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/42">Fact</div>
                {workspace.properties.map((property) => (
                  <Link
                    key={property.id}
                    href={`/properties/${property.id}`}
                    className="min-w-0 bg-[#111a23] p-3 transition hover:bg-cyan-100/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-cyan-200"
                    data-testid="property-comparison-property-link"
                    data-property-comparison-property-id={property.id}
                  >
                    <p className="truncate text-[10px] font-black uppercase tracking-[0.14em] text-cyan-100/72">Property Page</p>
                    <p className="mt-1 truncate text-sm font-black uppercase tracking-[0.04em] text-white">{property.address}</p>
                    <p className="mt-1 text-[10px] font-black uppercase tracking-[0.12em] text-white/42">{property.city}, {property.state}</p>
                  </Link>
                ))}
                {workspace.rows.map((row) => (
                  <Fragment key={row.key}>
                    <div key={`${row.key}-label`} className="bg-[#0d141c] p-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/76">{row.label}</p>
                      <p className="mt-1 text-[10px] font-bold leading-4 text-white/38">{row.source}</p>
                    </div>
                    {row.cells.map((cell) => (
                      <div
                        key={`${row.key}-${cell.propertyId}`}
                        className="min-w-0 bg-[#0d141c] p-3"
                        data-testid="property-comparison-cell"
                        data-property-comparison-row={row.key}
                        data-property-comparison-property-id={cell.propertyId}
                        data-property-comparison-evidence-state={cell.evidenceState}
                      >
                        {cell.href ? (
                          <Link href={cell.href} className="text-sm font-black text-white underline decoration-cyan-100/35 underline-offset-4 hover:text-cyan-100">
                            {cell.value}
                          </Link>
                        ) : (
                          <p className="text-sm font-black leading-5 text-white">{cell.value}</p>
                        )}
                        <p className="mt-2 text-[9px] font-black uppercase tracking-[0.12em] text-cyan-100/62">{cell.evidenceState}</p>
                      </div>
                    ))}
                  </Fragment>
                ))}
              </div>
            </div>

            <section
              className="rounded-[8px] border border-cyan-100/18 bg-cyan-100/[0.055] p-5"
              data-testid="property-comparison-source-transparency"
            >
              <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">
                <Info size={14} aria-hidden="true" />
                How to read this comparison
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-4">
                {workspace.sourceTransparency.map((item) => (
                  <article key={item.label} className="rounded-[8px] bg-black/20 p-3" data-testid="property-comparison-source-transparency-item">
                    <p className="text-[9px] font-black uppercase tracking-[0.16em] text-white/38">{item.label}</p>
                    <p className="mt-2 text-[12px] font-black uppercase leading-5 tracking-[0.06em] text-white">{item.value}</p>
                    <p className="mt-2 text-[11px] font-bold leading-5 text-white/50">{item.detail}</p>
                    {item.href ? (
                      <Link href={item.href} className="mt-3 inline-flex text-[9px] font-black uppercase tracking-[0.12em] text-cyan-100 hover:text-white">
                        Sources & Methodology
                      </Link>
                    ) : null}
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-[8px] border border-white/10 bg-[#0d141c] p-5" data-testid="property-comparison-trust-boundaries">
              <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-100/72">
                <ShieldCheck size={14} aria-hidden="true" />
                Trust Boundaries
              </p>
              <p className="sr-only">
                MORE AVAILABLE DATA does not mean a better property. SOURCE AVAILABILITY does not equal PROPERTY QUALITY. MISSING DATA does not equal NEGATIVE PROPERTY CONDITION.
              </p>
              <div className="mt-4 grid gap-2 md:grid-cols-3">
                {workspace.trustBoundaries.map((boundary) => (
                  <p key={boundary} className="rounded-[6px] border border-white/10 bg-white/[0.035] p-3 text-[11px] font-black uppercase leading-5 tracking-[0.1em] text-white/62">
                    {boundary}
                  </p>
                ))}
              </div>
            </section>
          </div>
        )}
      </section>
    </main>
  );
}
