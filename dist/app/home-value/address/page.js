"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Page;
const react_1 = require("react");
const AddressContent_1 = __importDefault(require("./AddressContent"));
function Page() {
    return (<react_1.Suspense fallback={<div />}>
      <AddressContent_1.default />
    </react_1.Suspense>);
}
