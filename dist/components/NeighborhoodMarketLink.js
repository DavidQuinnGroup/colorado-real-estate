"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NeighborhoodMarketLink;
const link_1 = __importDefault(require("next/link"));
function NeighborhoodMarketLink({ city }) {
    return (<section className="mt-16 border rounded-xl p-6 bg-gray-50">

      <h2 className="text-2xl font-semibold mb-3">
        {city} Housing Market
      </h2>

      <p className="text-gray-600 mb-4">
        See the latest housing trends, pricing, and inventory levels in {city}.
      </p>

      <link_1.default href={`/market-report/housing-market/${city.toLowerCase()}`} className="inline-block font-medium text-blue-600 hover:underline">
        View {city} Housing Market Report →
      </link_1.default>

    </section>);
}
