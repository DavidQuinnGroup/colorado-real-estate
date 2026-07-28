import Link from "next/link";

import type { PropertyAuthorityLink } from "@/lib/linking/getPropertyLinks";
import { properties, type Property } from "@/lib/properties";

type PropertyLinkItem = Pick<
  Property,
  "id" | "address" | "city" | "state"
> & {
  neighborhood?: string | null;
  price?: number | null;
  beds?: number | null;
  baths?: number | null;
  sqft?: number | null;
};

type PropertyLinksProps = {
  currentPropertyId?: string;
  city?: string;
  neighborhood?: string;
  listings?: PropertyLinkItem[];
  authorityLinks?: PropertyAuthorityLink[];
  limit?: number;
  title?: string;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function normalize(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

function formatCurrency(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value)
    ? currencyFormatter.format(value)
    : "Price available by request";
}

function formatNumber(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? value.toLocaleString("en-US") : "--";
}

export default function PropertyLinks({
  currentPropertyId,
  city,
  neighborhood,
  listings,
  authorityLinks = [],
  limit = 6,
  title = "Related Property Intelligence",
}: PropertyLinksProps) {
  const sourceListings = listings?.length ? listings : properties;
  const normalizedCity = normalize(city);
  const normalizedNeighborhood = normalize(neighborhood);
  const sourceKind = listings?.length ? "provided" : "static";
  const relatedListings = sourceListings
    .filter((property) => property.id !== currentPropertyId)
    .filter((property) => {
      if (normalizedNeighborhood) {
        return normalize(property.neighborhood) === normalizedNeighborhood;
      }

      if (normalizedCity) {
        return normalize(property.city) === normalizedCity;
      }

      return true;
    })
    .slice(0, Math.max(1, limit));

  if (!relatedListings.length && !authorityLinks.length) {
    return null;
  }

  return (
    <section
      className="mt-16 border border-white/10 bg-[#050505] p-6 text-white"
      data-testid="reie-property-links"
      data-property-links-title={title}
      data-property-links-current-property-id={currentPropertyId || ""}
      data-property-links-city={city || ""}
      data-property-links-neighborhood={neighborhood || ""}
      data-property-links-normalized-city={normalizedCity}
      data-property-links-normalized-neighborhood={normalizedNeighborhood}
      data-property-links-source-kind={sourceKind}
      data-property-links-source-count={sourceListings.length}
      data-property-links-limit={Math.max(1, limit)}
      data-property-links-related-count={relatedListings.length}
      data-property-links-authority-count={authorityLinks.length}
      data-property-links-has-authority={authorityLinks.length ? "true" : "false"}
      data-property-links-has-related={relatedListings.length ? "true" : "false"}
    >
      <div className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#00ff80]">
          Property Authority Links
        </p>
        <h2 className="mt-2 text-2xl font-black uppercase italic tracking-tight">
          {title}
        </h2>
      </div>

      {authorityLinks.length ? (
        <div
          className="mb-6 grid grid-cols-1 gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2 xl:grid-cols-4"
          data-testid="reie-property-links-authority-list"
          data-property-links-authority-count={authorityLinks.length}
        >
          {authorityLinks.map((link, index) => (
            <Link
              key={`${link.status}-${link.href}-${link.label}-${index}`}
              href={link.href}
              className="group bg-black p-5 transition-colors hover:bg-white/[0.04]"
              data-testid="reie-property-links-authority-link"
              data-property-links-authority-status={link.status}
              data-property-links-authority-label={link.label}
              data-property-links-authority-href={link.href}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="mb-3 text-[9px] font-black uppercase tracking-[0.24em] text-[#00ff80]">
                    {link.status}
                  </p>
                  <p className="text-base font-black uppercase italic tracking-tight text-white">
                    {link.label}
                  </p>
                  <p className="mt-2 text-[10px] font-bold uppercase leading-5 tracking-[0.18em] text-white/30">
                    {link.description}
                  </p>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#00ff80] opacity-70 transition-opacity group-hover:opacity-100">
                  Open
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : null}

      {relatedListings.length ? (
        <div
          className="grid grid-cols-1 gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2 xl:grid-cols-3"
          data-testid="reie-property-links-related-list"
          data-property-links-related-count={relatedListings.length}
        >
          {relatedListings.map((property) => (
            <Link
              key={property.id}
              href={`/properties/${property.id}`}
              className="group bg-black p-5 transition-colors hover:bg-white/[0.04]"
              data-testid="reie-property-links-related-link"
              data-property-links-related-id={property.id}
              data-property-links-related-address={property.address}
              data-property-links-related-city={property.city}
              data-property-links-related-state={property.state}
              data-property-links-related-neighborhood={property.neighborhood || ""}
              data-property-links-related-price={property.price ?? ""}
              data-property-links-related-beds={property.beds ?? ""}
              data-property-links-related-baths={property.baths ?? ""}
              data-property-links-related-sqft={property.sqft ?? ""}
              data-property-links-related-href={`/properties/${property.id}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-base font-black uppercase italic tracking-tight text-white">
                    {property.address}
                  </p>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
                    {property.city}, {property.state}
                  </p>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#00ff80] opacity-70 transition-opacity group-hover:opacity-100">
                  Details
                </span>
              </div>

              <div className="mt-5 border-t border-white/10 pt-4">
                <p className="text-xl font-black italic tracking-tight text-white">
                  {formatCurrency(property.price)}
                </p>
                <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.16em] text-white/30">
                  {formatNumber(property.beds)} beds / {formatNumber(property.baths)} baths /{" "}
                  {formatNumber(property.sqft)} sq ft
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/internal-links/PropertyLinks.tsx
