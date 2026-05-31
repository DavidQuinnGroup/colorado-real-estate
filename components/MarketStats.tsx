type MarketStatsData = {
  medianPrice?: number | string | null;
  pricePerSqFt?: number | string | null;
  daysOnMarket?: number | string | null;
  inventory?: number | string | null;
};

type MarketStatsProps = {
  stats?: MarketStatsData | null;
  title?: string;
};

type StatCard = {
  label: string;
  value: string;
  suffix?: string;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function formatCurrencyValue(value: number | string | null | undefined) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return currencyFormatter.format(value);
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }

  return "Market data pending";
}

function formatPlainValue(value: number | string | null | undefined) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value.toLocaleString("en-US");
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }

  return "Market data pending";
}

export default function MarketStats({
  stats,
  title = "Neighborhood Market Stats",
}: MarketStatsProps) {
  const statCards: StatCard[] = [
    {
      label: "Median Price",
      value: formatCurrencyValue(stats?.medianPrice),
    },
    {
      label: "Price Per Sq Ft",
      value: formatCurrencyValue(stats?.pricePerSqFt),
    },
    {
      label: "Days on Market",
      value: formatPlainValue(stats?.daysOnMarket),
      suffix: typeof stats?.daysOnMarket === "number" ? " days" : undefined,
    },
    {
      label: "Active Listings",
      value: formatPlainValue(stats?.inventory),
    },
  ];

  return (
    <section className="mt-10 border border-white/10 bg-[#050505] p-6 text-white">
      <div className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#00ff80]">
          David Quinn Group Intelligence
        </p>
        <h2 className="mt-2 text-2xl font-black uppercase italic tracking-tight">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2">
        {statCards.map((card) => (
          <div key={card.label} className="bg-black p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">
              {card.label}
            </p>
            <p className="mt-2 text-xl font-black italic tracking-tight text-white">
              {card.value}
              {card.suffix}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// components/MarketStats.tsx
