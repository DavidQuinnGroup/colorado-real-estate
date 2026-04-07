"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MarketNeighborhoodLinks;
const link_1 = __importDefault(require("next/link"));
const neighborhoods_1 = require("@/lib/neighborhoods");
function MarketNeighborhoodLinks({ city }) {
    const cityNeighborhoods = neighborhoods_1.neighborhoods.filter((n) => n.city.toLowerCase() === city.toLowerCase());
    if (!cityNeighborhoods.length)
        return null;
    return (<section className="mt-16">
      <h2 className="text-2xl font-semibold mb-4">
        Neighborhoods in {city}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {cityNeighborhoods.map((n) => (<link_1.default key={n.slug} href={`/neighborhood/${n.slug}`} className="border rounded-lg p-3 hover:bg-gray-50">
            {n.name}
          </link_1.default>))}
      </div>
    </section>);
}
