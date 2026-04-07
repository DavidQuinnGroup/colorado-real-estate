"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MarketStats;
function MarketStats({ stats }) {
    return (<section className="mt-10">

      <h2 className="text-2xl font-semibold mb-4">
        Neighborhood Market Stats
      </h2>

      <div className="grid grid-cols-2 gap-6">

        <div>
          <p className="text-gray-500">Median Price</p>
          <p className="text-xl font-bold">{stats.medianPrice}</p>
        </div>

        <div>
          <p className="text-gray-500">Price Per Sq Ft</p>
          <p className="text-xl font-bold">{stats.pricePerSqFt}</p>
        </div>

        <div>
          <p className="text-gray-500">Days on Market</p>
          <p className="text-xl font-bold">{stats.daysOnMarket}</p>
        </div>

        <div>
          <p className="text-gray-500">Active Listings</p>
          <p className="text-xl font-bold">{stats.inventory}</p>
        </div>

      </div>

    </section>);
}
