"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NearbyNeighborhoods;
const link_1 = __importDefault(require("next/link"));
const getNeighborhoodsByCity_1 = require("@/lib/getNeighborhoodsByCity");
function NearbyNeighborhoods({ city, currentSlug }) {
    const neighborhoods = (0, getNeighborhoodsByCity_1.getNeighborhoodsByCity)(city)
        .filter(n => n.slug !== currentSlug)
        .slice(0, 6);
    return (<section className="mt-16">

      <h2 className="text-2xl font-semibold mb-4">
        Nearby Neighborhoods
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

        {neighborhoods.map(n => (<link_1.default key={n.slug} href={`/neighborhoods/${city}/${n.slug}`} className="text-blue-600 hover:underline">
            {n.name}
          </link_1.default>))}

      </div>

    </section>);
}
