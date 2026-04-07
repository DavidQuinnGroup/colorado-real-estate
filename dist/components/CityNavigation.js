"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CityNavigation;
const link_1 = __importDefault(require("next/link"));
const cities_1 = require("@/lib/cities");
function CityNavigation() {
    return (<section className="mt-12">

      <h2 className="text-2xl mb-4">
        Explore Boulder County Cities
      </h2>

      <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">

        {cities_1.cities.map((city) => (<li key={city.slug}>
            <link_1.default href={`/${city.slug}`} className="underline hover:text-white">
              {city.name} Real Estate
            </link_1.default>
          </li>))}

      </ul>

    </section>);
}
