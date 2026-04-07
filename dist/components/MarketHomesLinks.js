"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MarketHomesLinks;
const link_1 = __importDefault(require("next/link"));
const homeSearchTypes = [
    {
        slug: "homes",
        label: "All Homes For Sale"
    },
    {
        slug: "condos",
        label: "Condos For Sale"
    },
    {
        slug: "townhomes",
        label: "Townhomes For Sale"
    },
    {
        slug: "luxury-homes",
        label: "Luxury Homes"
    },
    {
        slug: "new-construction",
        label: "New Construction Homes"
    }
];
function MarketHomesLinks({ city }) {
    const citySlug = city.toLowerCase();
    return (<section className="mt-16">
      <h2 className="text-2xl font-semibold mb-4">
        Homes For Sale in {city}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

        {homeSearchTypes.map((type) => (<link_1.default key={type.slug} href={`/homes/${citySlug}/${type.slug}`} className="border rounded-lg p-4 hover:bg-gray-50">
            {city} {type.label}
          </link_1.default>))}

      </div>
    </section>);
}
