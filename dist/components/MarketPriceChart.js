"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MarketPriceChart;
const recharts_1 = require("recharts");
function MarketPriceChart({ data }) {
    return (<div className="border rounded-xl p-6">

      <h3 className="text-lg font-semibold mb-4">
        Median Home Price Trend
      </h3>

      <recharts_1.ResponsiveContainer width="100%" height={300}>

        <recharts_1.LineChart data={data}>

          <recharts_1.CartesianGrid strokeDasharray="3 3"/>

          <recharts_1.XAxis dataKey="month"/>

          <recharts_1.YAxis />

          <recharts_1.Tooltip />

          <recharts_1.Line type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={3}/>

        </recharts_1.LineChart>

      </recharts_1.ResponsiveContainer>

    </div>);
}
