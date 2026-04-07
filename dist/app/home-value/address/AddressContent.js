"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AddressContent;
const navigation_1 = require("next/navigation");
function AddressContent() {
    const searchParams = (0, navigation_1.useSearchParams)();
    const address = searchParams.get("address");
    return (<div>
      <h1>Home Value Result</h1>
      <p>{address}</p>
    </div>);
}
