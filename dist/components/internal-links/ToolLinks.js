"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ToolLinks;
const link_1 = __importDefault(require("next/link"));
function ToolLinks() {
    return (<section className="mt-16">

      <h2 className="text-2xl font-semibold mb-4">
        Real Estate Tools
      </h2>

      <ul className="space-y-2">

        <li>
          <link_1.default href="/home-value">
            What Is My Home Worth?
          </link_1.default>
        </li>

        <li>
          <link_1.default href="/home-equity-calculator">
            Home Equity Calculator
          </link_1.default>
        </li>

      </ul>

    </section>);
}
