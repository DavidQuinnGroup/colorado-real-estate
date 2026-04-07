"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AuthorByline;
const link_1 = __importDefault(require("next/link"));
function AuthorByline() {
    return (<div className="border-t pt-6 mt-12">

      <p className="text-sm text-gray-500">
        Written by
      </p>

      <link_1.default href="/author/david-quinn" className="font-semibold text-blue-600 hover:underline">
        David Quinn
      </link_1.default>

    </div>);
}
