"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MarketGauge;
function MarketGauge({ score }) {
    const position = `${score}%`;
    const getLabel = () => {
        if (score >= 80)
            return "Strong Seller Market";
        if (score >= 60)
            return "Seller Leaning";
        if (score >= 40)
            return "Balanced Market";
        if (score >= 20)
            return "Buyer Leaning";
        return "Strong Buyer Market";
    };
    return (<div className="w-full max-w-xl mx-auto text-center">

      <h3 className="text-xl font-semibold mb-6">
        Boulder Market Health
      </h3>

      <div className="relative">

        {/* Gauge Bar */}
        <div className="h-3 rounded-full bg-gradient-to-r from-blue-500 via-gray-300 to-green-500"/>

        {/* Indicator */}
        <div className="absolute top-[-6px]" style={{ left: position }}>
          <div className="w-4 h-4 bg-black rounded-full border-2 border-white shadow"/>
        </div>

      </div>

      <div className="flex justify-between text-sm mt-2 text-gray-600">
        <span>Buyer Market</span>
        <span>Seller Market</span>
      </div>

      <div className="mt-6 text-4xl font-bold">
        {score}
      </div>

      <p className="text-gray-600 mt-2">
        {getLabel()}
      </p>

    </div>);
}
