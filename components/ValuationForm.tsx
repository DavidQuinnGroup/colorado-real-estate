"use client";

import { useState } from "react";

export default function ValuationForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
    return (
      <div className="text-center">
        <p className="text-lg">
          Thank you. We’ll be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 text-left"
    >
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        required
        onChange={handleChange}
        className="w-full p-4 bg-[#1a1a1a] border border-white/10"
      />

      <input
        type="email"
        name="email"
        placeholder="Email Address"
        required
        onChange={handleChange}
        className="w-full p-4 bg-[#1a1a1a] border border-white/10"
      />

      <input
        type="text"
        name="address"
        placeholder="Property Address"
        required
        onChange={handleChange}
        className="w-full p-4 bg-[#1a1a1a] border border-white/10"
      />

      <button
        type="submit"
        className="w-full border border-white py-4 tracking-widest hover:bg-white hover:text-black transition"
      >
        REQUEST VALUATION
      </button>
    </form>
  );
}