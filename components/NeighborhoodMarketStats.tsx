type NeighborhoodStats = {
  medianPrice?: number | string | null;
  pricePerSqFt?: number | string | null;
  daysOnMarket?: number | string | null;
  inventory?: number | string | null;
};

type NeighborhoodMarketStatsProps = {
  neighborhood: string;
  stats?: NeighborhoodStats | null;
};

type StatItem = {
  label: string;
  value: string;
  detail: string;
};

const fallbackStats: Required<NeighborhoodStats> = {
  medianPrice: 925000,
  pricePerSqFt: 425,
  daysOnMarket: 24,
  inventory: 18,
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

  return "Pending";
}

function formatNumber(value: number | string | null | undefined) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value.toLocaleString("en-US");
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }

  return "Pending";
}

export default function NeighborhoodMarketStats({
  neighborhood,
  stats,
}: NeighborhoodMarketStatsProps) {
  const marketStats = {
    medianPrice: stats?.medianPrice ?? fallbackStats.medianPrice,
    pricePerSqFt: stats?.pricePerSqFt ?? fallbackStats.pricePerSqFt,
    daysOnMarket: stats?.daysOnMarket ?? fallbackStats.daysOnMarket,
    inventory: stats?.inventory ?? fallbackStats.inventory,
  };

  const statItems: StatItem[] = [
    {
      label: "Median Home Price",
      value: formatCurrency(marketStats.medianPrice),
      detail: "Current neighborhood pricing signal",
    },
    {
      label: "Price Per Sq Ft",
      value: formatCurrency(marketStats.pricePerSqFt),
      detail: "Value density benchmark",
    },
    {
      label: "Days on Market",
      value: formatNumber(marketStats.daysOnMarket),
      detail: "Buyer velocity indicator",
    },
    {
      label: "Inventory",
      value: `${formatNumber(marketStats.inventory)} Homes`,
      detail: "Active supply window",
    },
  ];

  return (
    <section className="mt-10 border border-white/10 bg-[#050505] p-6 text-white">
      <div className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#00ff80]">
          Neighborhood Intelligence
        </p>
        <h2 className="mt-2 text-2xl font-black uppercase italic tracking-tight">
          {neighborhood} Housing Market
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2">
        {statItems.map((item) => (
          <article key={item.label} className="bg-black p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">
              {item.label}
            </p>
            <p className="mt-2 text-xl font-black italic tracking-tight text-white">
              {item.value}
            </p>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/25">
              {item.detail}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

// components/NeighborhoodMarketStats.tsx
