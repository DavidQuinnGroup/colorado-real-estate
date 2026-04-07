"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ValuationForm;
const react_1 = require("react");
function ValuationForm({ city }) {
    const [formData, setFormData] = (0, react_1.useState)({
        name: "",
        email: "",
        address: "",
    });
    const [submitted, setSubmitted] = (0, react_1.useState)(false);
    <h2>Get your {city} home value</h2>;
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch("/api/valuation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });
        setSubmitted(true);
    };
    if (submitted) {
        return (<div className="text-center">
        <p className="text-lg">
          Thank you. We’ll be in touch shortly.
        </p>
      </div>);
    }
    return (<form onSubmit={handleSubmit} className="space-y-6 text-left">
      <input type="text" name="name" placeholder="Full Name" required onChange={handleChange} className="w-full p-4 bg-[#1a1a1a] border border-white/10"/>

      <input type="email" name="email" placeholder="Email Address" required onChange={handleChange} className="w-full p-4 bg-[#1a1a1a] border border-white/10"/>

      <input type="text" name="address" placeholder="Property Address" required onChange={handleChange} className="w-full p-4 bg-[#1a1a1a] border border-white/10"/>

      <button type="submit" className="w-full border border-white py-4 tracking-widest hover:bg-white hover:text-black transition">
        REQUEST VALUATION
      </button>
    </form>);
}
