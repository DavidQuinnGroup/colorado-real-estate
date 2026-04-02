"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AddressCapture() {

  const searchParams = useSearchParams();
  const router = useRouter();

  const address = searchParams.get("address");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  async function handleSubmit(e: React.FormEvent) {

    e.preventDefault();

    await supabase.from("home_value_leads").insert([
      {
        address,
        email,
        phone,
      },
    ]);

    router.push("/home-value/thank-you");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">

      <div className="max-w-xl w-full text-center">

        <h1 className="text-3xl font-light mb-6">
          Where should we send your home value report?
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            type="email"
            placeholder="Email Address *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-4 border border-gray-300 rounded-md"
          />

          <input
            type="tel"
            placeholder="Phone Number (Optional – if you'd like us to text it)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="p-4 border border-gray-300 rounded-md"
          />

          <button className="bg-black text-white p-4 rounded-md">
            Send My Report
          </button>

        </form>

        <p className="text-sm text-gray-500 mt-4">
          We’ll send your home value instantly. No spam.
        </p>

      </div>

    </main>
  );
}