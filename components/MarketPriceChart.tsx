"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type MarketPricePoint = {
  month: string;
  price: number;
};

type MarketPriceChartProps = {
  data?: MarketPricePoint[];
  title?: string;
  subtitle?: string;
};

const fallbackData: MarketPricePoint[] = [
  { month: "Jan", price: 980000 },
  { month: "Feb", price: 995000 },
  { month: "Mar", price: 1015000 },
  { month: "Apr", price: 1038000 },
  { month: "May", price: 1055000 },
  { month: "Jun", price: 1075000 },
];

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function getChartData(data: MarketPricePoint[] | undefined) {
  if (!Array.isArray(data) || data.length === 0) {
    return fallbackData;
  }

  return data.filter(
    (point) =>
      typeof point.month === "string" &&
      point.month.trim().length > 0 &&
      Number.isFinite(point.price),
  );
}

function formatCompactCurrency(value: number | string) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "$0";
  }

  if (numericValue >= 1000000) {
    return `$${(numericValue / 1000000).toFixed(1)}M`;
  }

  return `$${Math.round(numericValue / 1000)}k`;
}

export default function MarketPriceChart({
  data,
  title = "Median Home Price Trend",
  subtitle = "Rolling market signal for pricing momentum",
}: MarketPriceChartProps) {
  const chartData = getChartData(data);
  const latestPoint = chartData.at(-1);

  return (
    <section className="border border-white/10 bg-[#050505] p-6 text-white">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#00ff80]">
            Market Velocity
          </p>
          <h3 className="mt-2 text-2xl font-black uppercase italic tracking-tight">
            {title}
          </h3>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-white/35">
            {subtitle}
          </p>
        </div>

        {latestPoint ? (
          <div className="border border-white/10 bg-black px-4 py-3 text-right">
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/30">
              Latest
            </p>
            <p className="mt-1 text-xl font-black italic tracking-tight text-[#00ff80]">
              {currencyFormatter.format(latestPoint.price)}
            </p>
          </div>
        ) : null}
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
            <CartesianGrid stroke="#1a1a1a" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="#6b7280"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={10}
              tickFormatter={formatCompactCurrency}
              tickLine={false}
              axisLine={false}
              width={54}
            />
            <Tooltip
              formatter={(value) => currencyFormatter.format(Number(value))}
              labelStyle={{ color: "#ffffff", fontWeight: 800 }}
              contentStyle={{
                backgroundColor: "#000000",
                border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: "0px",
                color: "#ffffff",
                fontSize: "12px",
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              name="Median Price"
              stroke="#00ff80"
              strokeWidth={3}
              dot={{ r: 3, strokeWidth: 2, fill: "#050505" }}
              activeDot={{ r: 5, strokeWidth: 2, fill: "#00ff80" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

// components/MarketPriceChart.tsx
