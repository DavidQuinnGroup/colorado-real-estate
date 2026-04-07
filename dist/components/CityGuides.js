"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CityGuides;
const link_1 = __importDefault(require("next/link"));
const neighborhoods_1 = require("@/lib/neighborhoods");
function createGuideSlug(name, city) {
    return `${name}-${city}-co-neighborhood-guide`
        .toLowerCase()
        .replace(/\s+/g, "-");
}
function CityGuides({ city }) {
    const cityGuides = neighborhoods_1.neighborhoods.filter((n) => n.city === city);
    return (<section className="mt-10">

      <h2 className="text-2xl font-semibold mb-4">
        Neighborhood Guides
      </h2>

      <ul className="grid grid-cols-2 gap-2">

        {cityGuides.map((n) => (<li key={n.slug}>
            <link_1.default href={`/guides/${createGuideSlug(n.name, n.city)}`} className="text-blue-600 hover:underline">
              Living in {n.name}
            </link_1.default>
          </li>))}

      </ul>

    </section>);
}
