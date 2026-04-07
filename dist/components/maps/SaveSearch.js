"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SaveSearch;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
function SaveSearch({ city }) {
    const [email, setEmail] = (0, react_1.useState)("");
    const [saved, setSaved] = (0, react_1.useState)(false);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const searchParams = (0, navigation_1.useSearchParams)();
    const handleSave = async () => {
        setLoading(true);
        const payload = {
            email,
            city,
            minPrice: searchParams.get("minPrice"),
            beds: searchParams.get("beds"),
            type: searchParams.get("type"),
            north: searchParams.get("north"),
            south: searchParams.get("south"),
            east: searchParams.get("east"),
            west: searchParams.get("west")
        };
        try {
            await fetch("/api/save-search", {
                method: "POST",
                body: JSON.stringify(payload)
            });
            setSaved(true);
        }
        catch (err) {
            console.error(err);
        }
        setLoading(false);
    };
    if (saved) {
        return (<div className="p-3 bg-green-100 text-green-800 rounded">
        Search saved! 🎉
      </div>);
    }
    return (<div className="flex gap-2 items-center">
      <input type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} className="border px-3 py-2 rounded w-48"/>

      <button onClick={handleSave} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
        {loading ? "Saving..." : "Save Search"}
      </button>
    </div>);
}
