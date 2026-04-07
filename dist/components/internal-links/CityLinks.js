"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CityLinks;
const link_1 = __importDefault(require("next/link"));
function CityLinks({ city }) {
    const cityName = city.charAt(0).toUpperCase() + city.slice(1);
    return (<section className="mt-16">

      <h2 className="text-2xl font-semibold mb-4">
        Explore {cityName} Real Estate
      </h2>

      <ul className="space-y-2">

        <li>
          <link_1.default href={`/${city}-real-estate`}>
            {cityName} Homes for Sale
          </link_1.default>
        </li>

        <li>
          <link_1.default href={`/market/${city}`}>
            {cityName} Housing Market
          </link_1.default>
        </li>

        <li>
          <link_1.default href={`/neighborhoods/${city}`}>
            {cityName} Neighborhood Guide
          </link_1.default>
        </li>

      </ul>

    </section>);
}
