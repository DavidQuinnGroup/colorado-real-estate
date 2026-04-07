"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HomeValue;
const react_1 = require("react");
function HomeValue() {
    const [address, setAddress] = (0, react_1.useState)("");
    const [beds, setBeds] = (0, react_1.useState)("");
    const [baths, setBaths] = (0, react_1.useState)("");
    const [sqft, setSqft] = (0, react_1.useState)("");
    const [yearBuilt, setYearBuilt] = (0, react_1.useState)("");
    const [estimate, setEstimate] = (0, react_1.useState)(null);
    const [lowRange, setLowRange] = (0, react_1.useState)(null);
    const [highRange, setHighRange] = (0, react_1.useState)(null);
    function calculateEstimate() {
        const basePricePerSqft = 650;
        const bedFactor = Number(beds) * 0.02;
        const bathFactor = Number(baths) * 0.015;
        const ageFactor = yearBuilt
            ? (2024 - Number(yearBuilt)) * -0.002
            : 0;
        const value = Number(sqft || 0) *
            basePricePerSqft *
            (1 + bedFactor + bathFactor + ageFactor);
        const estimateValue = Math.round(value);
        setEstimate(estimateValue);
        setLowRange(Math.round(estimateValue * 0.93));
        setHighRange(Math.round(estimateValue * 1.07));
    }
    return (<main className="min-h-screen bg-white text-gray-900">

      {/* HERO */}

      <section className="bg-gray-900 text-white py-20 text-center">

        <h1 className="text-5xl font-bold mb-6">
          What Is My Boulder Home Worth?
        </h1>

        <p className="text-xl max-w-2xl mx-auto">
          Get an instant home value estimate based on Boulder housing market data.
        </p>

      </section>


      {/* ESTIMATOR FORM */}

      <section className="py-20 px-6">

        <div className="max-w-xl mx-auto space-y-6">

          <input type="text" placeholder="Home Address" className="w-full border p-4 rounded-lg" value={address} onChange={(e) => setAddress(e.target.value)}/>

          <input type="number" placeholder="Bedrooms" className="w-full border p-4 rounded-lg" value={beds} onChange={(e) => setBeds(e.target.value)}/>

          <input type="number" placeholder="Bathrooms" className="w-full border p-4 rounded-lg" value={baths} onChange={(e) => setBaths(e.target.value)}/>

          <input type="number" placeholder="Square Feet" className="w-full border p-4 rounded-lg" value={sqft} onChange={(e) => setSqft(e.target.value)}/>

          <input type="number" placeholder="Year Built" className="w-full border p-4 rounded-lg" value={yearBuilt} onChange={(e) => setYearBuilt(e.target.value)}/>

          <button onClick={calculateEstimate} className="w-full bg-black text-white py-4 rounded-lg font-semibold">
            Get Instant Home Value
          </button>

        </div>

      </section>


      {/* RESULT */}

      {estimate && (<section className="py-20 bg-gray-50 text-center">

          <h2 className="text-3xl font-bold mb-4">
            Estimated Home Value
          </h2>

          <p className="text-5xl font-bold text-green-600">
            ${estimate.toLocaleString()}
          </p>

          <p className="mt-4 text-gray-600">
            Estimated Range
          </p>

          <p className="text-xl font-semibold">
            ${lowRange?.toLocaleString()} - ${highRange?.toLocaleString()}
          </p>

          <p className="mt-6 text-gray-600 max-w-xl mx-auto">
            Online home value estimates can vary. Request a professional
            Boulder market analysis for a more accurate home valuation.
          </p>

          <button className="mt-8 bg-black text-white px-8 py-4 rounded-lg">
            Request Full Home Valuation
          </button>

        </section>)}


      {/* SEO CONTENT */}

      <section className="py-20 px-6 max-w-4xl mx-auto">

        <h2 className="text-3xl font-bold mb-6">
          Boulder Home Value Trends
        </h2>

        <p className="mb-4">
          Boulder home values continue to rank among the highest in Colorado.
          Limited inventory, strong demand, and the city's lifestyle appeal
          keep property values elevated compared to most Front Range markets.
        </p>

        <p className="mb-4">
          Neighborhood factors such as school districts, walkability, and
          proximity to downtown Boulder or the University of Colorado
          significantly influence home values.
        </p>

        <p>
          For a precise home valuation, local market expertise and recent
          comparable sales should always be considered alongside automated
          valuation models.
        </p>

      </section>

    </main>);
}
