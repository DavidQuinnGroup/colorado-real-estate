"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CityInternalLinks;
const link_1 = __importDefault(require("next/link"));
function CityInternalLinks({ links }) {
    return (<div className="mt-12 border-t pt-8">

      <h3 className="text-xl font-semibold mb-4">
        Nearby Colorado Real Estate
      </h3>

      <div className="grid grid-cols-2 gap-3">

        {links.map(link => (<link_1.default key={link.url} href={link.url} className="text-blue-600 hover:underline">
            {link.name} Real Estate
          </link_1.default>))}

      </div>

    </div>);
}
