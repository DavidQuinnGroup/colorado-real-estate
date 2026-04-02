"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts"

type DataPoint = {
  month: string
  price: number
}

export default function MarketPriceChart({
  data
}: {
  data: DataPoint[]
}) {

  return (
    <div className="border rounded-xl p-6">

      <h3 className="text-lg font-semibold mb-4">
        Median Home Price Trend
      </h3>

      <ResponsiveContainer width="100%" height={300}>

        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="price"
            stroke="#2563eb"
            strokeWidth={3}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  )
}