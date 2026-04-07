"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RelatedPropertyLinks;
const link_1 = __importDefault(require("next/link"));
const propertySearchTypes_1 = require("@/lib/propertySearchTypes");
const nearbyCities = [
    "boulder",
    "louisville",
    "lafayette",
    "superior",
    "erie",
    "longmont"
];
function RelatedPropertyLinks({ city, type }) {
    const relatedTypes = propertySearchTypes_1.propertySearchTypes.filter((t) => t.slug !== type).slice(0, 4);
    const nearby = nearbyCities.filter((c) => c !== city);
    return (<section className="mt-16">

      <h2 className="text-2xl font-semibold mb-4">
        Related Home Searches
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        <div>
          <h3 className="font-semibold mb-2">More in {city}</h3>

          <ul className="space-y-2">
            {relatedTypes.map((t) => (<li key={t.slug}>
                <link_1.default href={`/homes/${city}/${t.slug}`} className="text-blue-600 hover:underline">
                  {t.title.replace("CITY", city)}
                </link_1.default>
              </li>))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">
            Nearby Cities
          </h3>

          <ul className="space-y-2">
            {nearby.slice(0, 4).map((c) => (<li key={c}>
                <link_1.default href={`/homes/${c}/${type}`} className="text-blue-600 hover:underline">
                  {type.replace("-", " ")} in{" "}
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </link_1.default>
              </li>))}
          </ul>
        </div>

      </div>

    </section>);
}
