"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LeadCapture;
function LeadCapture({ city }) {
    const cityName = city.charAt(0).toUpperCase() + city.slice(1);
    return (<section className="mt-16 bg-gray-900 p-8 rounded-lg">

      <h2 className="text-2xl mb-4">
        Stay Updated on {cityName} Real Estate
      </h2>

      <p className="text-gray-300 mb-6">
        Get alerts when new homes hit the market in {cityName},
        Colorado.
      </p>

      <form className="flex flex-col md:flex-row gap-4">

        <input type="email" placeholder="Enter your email" className="p-3 rounded bg-gray-800 text-white w-full"/>

        <button className="bg-blue-600 px-6 py-3 rounded text-white">
          Get Alerts
        </button>

      </form>

    </section>);
}
