"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CityNeighborhoods;
const link_1 = __importDefault(require("next/link"));
const neighborhoods_1 = require("@/lib/neighborhoods");
function CityNeighborhoods({ city }) {
    const cityNeighborhoods = neighborhoods_1.neighborhoods.filter((n) => n.city === city);
    return (<section className="mt-10">

      <h2 className="text-2xl font-semibold mb-4">
        Neighborhoods in {city.charAt(0).toUpperCase() + city.slice(1)}
      </h2>

      <ul className="grid grid-cols-2 gap-2">

        {cityNeighborhoods.map((n) => (<li key={n.slug}>
            <link_1.default href={`/neighborhood/${n.slug}`} className="text-blue-600 hover:underline">
              {n.name}
            </link_1.default>
          </li>))}

      </ul>

    </section>);
}
