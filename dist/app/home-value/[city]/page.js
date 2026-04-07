"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStaticParams = generateStaticParams;
exports.default = HomeValuePage;
const cities_1 = require("@/data/cities");
const navigation_1 = require("next/navigation");
const ValuationForm_1 = __importDefault(require("@/components/ValuationForm"));
async function generateStaticParams() {
    return cities_1.cities.map((city) => ({
        city: city.slug,
    }));
}
function HomeValuePage({ params, }) {
    const { city } = params;
    const cityData = cities_1.cities.find((c) => c.slug === city);
    if (!cityData) {
        (0, navigation_1.notFound)();
    }
    return (<div className="max-w-4xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-4">
        What is My {cityData.name} Home Worth?
      </h1>

      <p className="text-gray-600 mb-8">
        Get an instant home valuation estimate for your property in{" "}
        {cityData.name}, Colorado.
      </p>

      <ValuationForm_1.default city={cityData.name}/>
    </div>);
}
