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
    <section className="mt-16 border border-white/10 bg-[#050505] p-6 text-white">
      <div className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#00ff80]">
          Property Authority Links
        </p>
        <h2 className="mt-2 text-2xl font-black uppercase italic tracking-tight">
          {title}
        </h2>
      </div>

      {authorityLinks.length ? (
        <div className="mb-6 grid grid-cols-1 gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2 xl:grid-cols-4">
          {authorityLinks.map((link) => (
            <Link
              key={`${link.status}-${link.href}`}
              href={link.href}
              className="group bg-black p-5 transition-colors hover:bg-white/[0.04]"
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
        <div className="grid grid-cols-1 gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2 xl:grid-cols-3">
          {relatedListings.map((property) => (
            <Link
              key={property.id}
              href={`/properties/${property.id}`}
              className="group bg-black p-5 transition-colors hover:bg-white/[0.04]"
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
