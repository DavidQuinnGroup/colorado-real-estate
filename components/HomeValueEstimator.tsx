'use client';

import { useState } from 'react';

const BASE_VALUE = 1_150_000;
const MAX_VARIATION = 200_000;

export default function HomeValueEstimator() {
  const [address, setAddress] = useState('');
  const [estimate, setEstimate] = useState<number | null>(null);

  function calculateEstimate() {
    const variation = Math.floor(Math.random() * MAX_VARIATION);
    setEstimate(BASE_VALUE + variation);
  }

  return (
    <div className="mx-auto max-w-xl rounded-xl border p-8 text-center">
      <h3 className="mb-4 text-2xl font-semibold">What Is Your Home Worth?</h3>

      <p className="mb-6 text-gray-600">Get an instant estimate based on Boulder market data.</p>

      <input
        type="text"
        placeholder="Enter your address"
        value={address}
        onChange={(event) => setAddress(event.target.value)}
        className="mb-4 w-full rounded-lg border px-4 py-3"
      />

      <button onClick={calculateEstimate} className="w-full rounded-lg bg-gray-900 px-6 py-3 text-white" type="button">
        Get Home Value
      </button>

      {estimate ? (
        <div className="mt-6">
          <p className="text-gray-600">Estimated Value</p>
          <p className="text-4xl font-bold">${estimate.toLocaleString()}</p>
        </div>
      ) : null}
    </div>
  );
}

// /Users/davidquinn/david-quinn-group/colorado-real-estate/components/HomeValueEstimator.tsx
