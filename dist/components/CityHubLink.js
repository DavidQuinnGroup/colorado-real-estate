"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CityHubLink;
const link_1 = __importDefault(require("next/link"));
function CityHubLink({ city }) {
    const citySlug = city.toLowerCase() + "-real-estate";
    return (<div className="border-t mt-16 pt-8">

      <link_1.default href={`/${citySlug}`} className="text-blue-600 hover:underline font-semibold">
        Explore everything about living in {city}
      </link_1.default>

    </div>);
}
