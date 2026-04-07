"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NearbyNeighborhoods;
const link_1 = __importDefault(require("next/link"));
const neighborhoods_1 = require("@/lib/neighborhoods");
function NearbyNeighborhoods({ city, currentSlug }) {
    const nearby = neighborhoods_1.neighborhoods
        .filter((n) => n.city === city && n.slug !== currentSlug)
        .slice(0, 5);
    if (nearby.length === 0)
        return null;
    return (<section className="mt-10">

      <h2 className="text-2xl font-semibold mb-4">
        Nearby {city.charAt(0).toUpperCase() + city.slice(1)} Neighborhoods
      </h2>

      <ul className="list-disc ml-6">

        {nearby.map((n) => (<li key={n.slug}>
            <link_1.default href={`/neighborhood/${n.slug}`} className="text-blue-600 hover:underline">
              {n.name}
            </link_1.default>
          </li>))}

      </ul>

    </section>);
}
