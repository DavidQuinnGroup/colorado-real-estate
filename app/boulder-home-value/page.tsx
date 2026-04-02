"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomeValuePage() {
  const router = useRouter();
  const [address, setAddress] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!address) return;

    router.push(`/home-value/address?address=${encodeURIComponent(address)}`);
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">

      <div className="max-w-xl w-full text-center">

        <h1 className="text-4xl font-light mb-6">
          Find Out What Your Boulder Home Is Worth
        </h1>

        <p className="text-gray-500 mb-10">
          Get a free home value report based on recent sales in your neighborhood.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            type="text"
            placeholder="Enter your property address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="p-4 border border-gray-300 rounded-md"
          />

          <button
            type="submit"
            className="bg-black text-white p-4 rounded-md"
          >
            Get My Home Value →
          </button>

        </form>

        <div className="text-sm text-gray-500 mt-8 space-y-1">
          <p>✔ Local Boulder market data</p>
          <p>✔ Recent comparable sales</p>
          <p>✔ Updated weekly</p>
          <p>✔ No obligation</p>
        </div>

      </div>

    </main>
  );
}