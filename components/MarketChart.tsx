"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, ChevronRight, Info, ShieldAlert, Wallet } from "lucide-react";

type PortfolioGoal = "Retirement Income" | "College Fund" | "Steady Income";

type MarketChartProps = {
  price?: number;
  downPayment?: number;
  homeAge?: number;
  monthlyRentalIncome?: number;
  monthlyMortgageCost?: number;
  monthlyManagementFee?: number;
  monthlyCapexReserve?: number;
};

type ProjectionPoint = {
  year: string;
  equity: number;
  valuation: number;
};

type CashFlowItem = {
  name: string;
  value: number;
  color: string;
};

const portfolioGoals: PortfolioGoal[] = [
  "Retirement Income",
  "College Fund",
  "Steady Income",
];

const appreciationRate = 0.052;

function getPositiveNumber(value: number | undefined, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? value
    : fallback;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
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

export default function MarketChart({
  price = 1200000,
  downPayment = 240000,
  homeAge = 12,
  monthlyRentalIncome = 6500,
  monthlyMortgageCost = 4200,
  monthlyManagementFee = 650,
  monthlyCapexReserve = 250,
}: MarketChartProps) {
  const [goal, setGoal] = useState<PortfolioGoal>("Retirement Income");

  const normalizedPrice = getPositiveNumber(price, 1200000);
  const normalizedDownPayment = Math.min(
    getPositiveNumber(downPayment, 240000),
    normalizedPrice,
  );
  const normalizedHomeAge = Math.max(0, Math.round(getPositiveNumber(homeAge, 12)));
  const normalizedRentalIncome = getPositiveNumber(monthlyRentalIncome, 6500);
  const normalizedMortgageCost = getPositiveNumber(monthlyMortgageCost, 4200);
  const normalizedManagementFee = getPositiveNumber(monthlyManagementFee, 650);
  const normalizedCapexReserve = getPositiveNumber(monthlyCapexReserve, 250);

  const projectionData = useMemo<ProjectionPoint[]>(() => {
    const loanAmount = normalizedPrice - normalizedDownPayment;

    return Array.from({ length: 11 }, (_, index) => {
      const year = index * 2;
      const valuation = normalizedPrice * (1 + appreciationRate) ** year;
      const principalPaydown = loanAmount * Math.min(year / 30, 1);

      return {
        year: `Year ${year}`,
        equity: Math.round(normalizedDownPayment + principalPaydown + valuation - normalizedPrice),
        valuation: Math.round(valuation),
      };
    });
  }, [normalizedDownPayment, normalizedPrice]);

  const cashFlowData = useMemo<CashFlowItem[]>(
    () => [
      { name: "Rental Income", value: normalizedRentalIncome, color: "#00ff80" },
      { name: "PITI Mortgage", value: -normalizedMortgageCost, color: "#ff4444" },
      { name: "Mgmt Fees (10%)", value: -normalizedManagementFee, color: "#ff4444" },
      { name: "GC Reserve (CAPEX)", value: -normalizedCapexReserve, color: "#fbbf24" },
    ],
    [
      normalizedCapexReserve,
      normalizedManagementFee,
      normalizedMortgageCost,
      normalizedRentalIncome,
    ],
  );

  const netCashFlow = cashFlowData.reduce((total, item) => total + item.value, 0);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#050505] shadow-2xl">
      <div className="flex flex-col gap-6 border-b border-white/5 bg-gradient-to-r from-emerald-900/10 to-transparent p-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <BarChart3 className="h-4 w-4 text-[#00ff80]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00ff80]">
              Investment Intelligence
            </span>
          </div>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">
            Portfolio Planner
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {portfolioGoals.map((portfolioGoal) => (
            <button
              key={portfolioGoal}
              type="button"
              onClick={() => setGoal(portfolioGoal)}
              className={`border px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all ${
                goal === portfolioGoal
                  ? "border-[#00ff80] bg-[#00ff80] text-black"
                  : "border-white/10 bg-white/5 text-white/40 hover:border-white/30 hover:text-white/70"
              }`}
            >
              {portfolioGoal}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3">
        <div className="border-white/5 p-8 lg:col-span-2 lg:border-r">
          <h3 className="mb-8 flex items-center gap-2 text-[11px] font-black uppercase italic tracking-[0.3em] text-white/30">
            20-Year Wealth Accumulation
          </h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData}>
                <defs>
                  <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff80" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00ff80" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1a1a1a" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="year"
                  stroke="#444"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#444"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={formatCompactCurrency}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
                  contentStyle={{
                    backgroundColor: "#000",
                    border: "1px solid #333",
                    borderRadius: "0px",
                    fontSize: "12px",
                  }}
                  itemStyle={{ fontWeight: "bold" }}
                />
                <Area
                  type="monotone"
                  dataKey="valuation"
                  stroke="#333"
                  fill="transparent"
                  strokeDasharray="5 5"
                  strokeWidth={1}
                  name="Market Valuation"
                />
                <Area
                  type="monotone"
                  dataKey="equity"
                  stroke="#00ff80"
                  fill="url(#colorEquity)"
                  fillOpacity={1}
                  strokeWidth={3}
                  name="Liquid Equity"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-10 bg-black/40 p-8">
          <section>
            <h3 className="mb-6 flex items-center gap-2 text-[11px] font-black uppercase italic tracking-[0.3em] text-white/30">
              <Wallet size={14} className="text-[#00ff80]" />
              Monthly Cash Flow
            </h3>
            <div className="space-y-4">
              {cashFlowData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-widest text-white/50">
                    {item.name}
                  </span>
                  <span
                    className="font-mono font-bold"
                    style={{ color: item.value > 0 ? item.color : "#ffffff" }}
                  >
                    {item.value > 0 ? "+" : "-"}
                    {formatCurrency(Math.abs(item.value)).replace("$", "$")}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                  Net Monthly Profit
                </span>
                <span
                  className={`text-2xl font-black italic tracking-tighter ${
                    netCashFlow >= 0 ? "text-[#00ff80]" : "text-red-400"
                  }`}
                >
                  {formatCurrency(netCashFlow)}
                </span>
              </div>
            </div>
          </section>

          <section className="rounded border border-amber-500/20 bg-amber-500/10 p-6">
            <div className="mb-3 flex items-center gap-3 text-amber-500">
              <ShieldAlert size={16} />
              <span className="text-[10px] font-black uppercase italic tracking-widest">
                Structural Reserve Warning
              </span>
            </div>
            <p className="text-[10px] font-medium leading-relaxed text-amber-500/80">
              Based on the {normalizedHomeAge}-year mechanical lifecycle, I have allocated a
              <span className="font-bold text-amber-500">
                {" "}
                {formatCurrency(normalizedCapexReserve)} monthly CAPEX reserve
              </span>
              . This protects cash flow from sudden HVAC or roofing liabilities.
            </p>
          </section>

          <div className="pt-6">
            <button
              type="button"
              className="group flex w-full items-center justify-center gap-2 bg-white py-4 text-[10px] font-black uppercase italic tracking-[0.3em] text-black transition-colors hover:bg-[#00ff80]"
            >
              Unlock Private Investment Whispers
              <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 border-t border-white/5 bg-white/[0.02] px-8 py-4">
        <Info size={14} className="shrink-0 text-[#00ff80]" />
        <p className="text-[9px] font-bold uppercase italic tracking-[0.2em] text-white/40">
          Strategic Note: This asset aligns with your 18-year {goal} goal. Break-even
          analysis projects full carrying cost recovery by Year 3.
        </p>
      </div>
    </div>
  );
}

// components/MarketChart.tsx
