"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NeighborhoodMarketStats;
function NeighborhoodMarketStats({ neighborhood, }) {
    return (<section className="mt-10">

      <h2 className="text-2xl font-semibold mb-4">
        {neighborhood} Housing Market
      </h2>

      <div className="grid grid-cols-2 gap-6">

        <div>
          <p className="text-sm text-gray-400">
            Median Home Price
          </p>
          <p className="text-xl font-semibold">
            $925,000
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-400">
            Price Per Sq Ft
          </p>
          <p className="text-xl font-semibold">
            $425
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-400">
            Days on Market
          </p>
          <p className="text-xl font-semibold">
            24
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-400">
            Inventory
          </p>
          <p className="text-xl font-semibold">
            18 Homes
          </p>
        </div>

      </div>

    </section>);
}
