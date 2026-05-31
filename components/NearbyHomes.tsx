import Link from "next/link";

import { properties, type Property } from "@/lib/properties";

type NearbyHomesProps = {
  city: string;
  currentPropertyId?: string;
  listings?: Property[];
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

function formatCityName(value: string) {
  return value
    .trim()
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function formatCurrency(value: number) {
  return Number.isFinite(value) ? currencyFormatter.format(value) : "Price available by request";
}

function formatNumber(value: number) {
  return Number.isFinite(value) ? value.toLocaleString("en-US") : "--";
}

export default function NearbyHomes({
  city,
  currentPropertyId,
  listings,
  limit = 4,
  title,
}: NearbyHomesProps) {
  const cityName = formatCityName(city);
  const sourceListings = listings?.length ? listings : properties;
  const nearby = sourceListings
    .filter((property) => normalize(property.city) === normalize(city))
    .filter((property) => property.id !== currentPropertyId)
    .slice(0, Math.max(1, limit));

  if (!nearby.length) {
    return null;
  }

  return (
    <section className="mt-16 border border-white/10 bg-[#050505] p-6 text-white">
      <div className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#00ff80]">
          Nearby Property Signals
        </p>
        <h2 className="mt-2 text-2xl font-black uppercase italic tracking-tight">
          {title ?? `Nearby Homes in ${cityName}`}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2">
        {nearby.map((property) => (
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
                  {property.city}, {property.state} {property.zip}
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
    </section>
  );
}

// components/NearbyHomes.tsx
