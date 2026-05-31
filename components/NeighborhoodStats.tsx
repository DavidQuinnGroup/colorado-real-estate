type NeighborhoodStatsData = {
  name: string;
  city?: string | null;
  medianPrice?: number | string | null;
  description?: string | null;
  nearby?: string[] | null;
};

type NeighborhoodStatsProps = {
  neighborhood: NeighborhoodStatsData;
};

type StatPanel = {
  label: string;
  value: string;
  detail: string;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function formatCurrency(value: number | string | null | undefined) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return currencyFormatter.format(value);
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }

  return "Market data pending";
}

function formatCity(city: string | null | undefined) {
  if (!city) {
    return "Colorado";
  }

  return city
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function NeighborhoodStats({ neighborhood }: NeighborhoodStatsProps) {
  const cityName = formatCity(neighborhood.city);
  const nearbyCount = neighborhood.nearby?.length ?? 0;

  const panels: StatPanel[] = [
    {
      label: "Median Price",
      value: formatCurrency(neighborhood.medianPrice),
      detail: "Current neighborhood value baseline",
    },
    {
      label: "Market Context",
      value: cityName,
      detail: "Local authority cluster",
    },
    {
      label: "Nearby Signals",
      value: nearbyCount > 0 ? `${nearbyCount} Linked` : "Pending",
      detail: "Internal-link expansion targets",
    },
  ];

  return (
    <section className="border border-white/10 bg-[#050505] p-6 text-white">
      <div className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#00ff80]">
          Local Market Signal
        </p>
        <h2 className="mt-2 text-2xl font-black uppercase italic tracking-tight">
          {neighborhood.name} Intelligence Snapshot
        </h2>
        {neighborhood.description ? (
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/55">
            {neighborhood.description}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-3">
        {panels.map((panel) => (
          <article key={panel.label} className="bg-black p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">
              {panel.label}
            </p>
            <p className="mt-2 text-xl font-black italic tracking-tight text-white">
              {panel.value}
            </p>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/25">
              {panel.detail}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

// components/NeighborhoodStats.tsx
