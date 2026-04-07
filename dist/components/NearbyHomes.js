"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NearbyHomes;
const link_1 = __importDefault(require("next/link"));
const properties_1 = require("@/lib/properties");
function NearbyHomes({ city }) {
    const nearby = properties_1.properties
        .filter((p) => p.city === city)
        .slice(0, 4);
    return (<section className="mt-16">

      <h2 className="text-2xl font-semibold mb-4">
        Nearby Homes
      </h2>

      <div className="grid md:grid-cols-2 gap-4">

        {nearby.map((p) => (<link_1.default key={p.id} href={`/property/${p.slug}`} className="border rounded-lg p-4 hover:bg-gray-50">
            {p.address}
          </link_1.default>))}

      </div>

    </section>);
}
