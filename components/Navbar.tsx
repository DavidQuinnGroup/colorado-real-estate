"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menu, setMenu] = useState<string | null>(null);

  const closeMenu = () => setMenu(null);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#111111]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-10 py-6 flex justify-between items-center">

        {/* BRAND */}
        <div className="flex flex-col leading-tight">
          <Link
            href="/"
            className="text-sm tracking-[0.35em] uppercase hover:text-gray-300"
          >
            David Quinn Group
          </Link>

          <span className="text-[11px] tracking-[0.4em] text-gray-500 uppercase mt-2">
            Compass
          </span>

          <span className="text-[10px] tracking-[0.3em] text-gray-600 uppercase">
            The Pedal Group
          </span>
        </div>

        {/* NAVIGATION */}
        <div className="hidden md:flex gap-12 text-sm tracking-widest">

          {/* PROPERTIES */}
          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setMenu("properties")}
            onMouseLeave={closeMenu}
          >
            <span className="hover:text-gray-300">Properties</span>

            {menu === "properties" && (
              <div className="absolute top-full left-0 bg-[#1a1a1a] p-8 space-y-3 min-w-[220px] shadow-2xl border border-white/5">

                <Link href="/properties" className="block hover:text-gray-300">
                  View Properties
                </Link>

                <Link href="/boulder-homes-for-sale" className="block hover:text-gray-300">
                  Boulder Homes For Sale
                </Link>

              </div>
            )}
          </div>


          {/* BUY & SELL */}
          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setMenu("buy")}
            onMouseLeave={closeMenu}
          >
            <span className="hover:text-gray-300">Buy & Sell</span>

            {menu === "buy" && (
              <div className="absolute top-full left-0 bg-[#1a1a1a] p-8 space-y-3 min-w-[240px] shadow-2xl border border-white/5">

                <Link href="/sellers-hub" className="block hover:text-gray-300">
                  Sellers Hub
                </Link>

                <Link href="/home-value" className="block hover:text-gray-300">
                  What's My Home Worth
                </Link>

                <hr className="border-gray-700" />

                <Link href="/first-time-home-buyer-boulder" className="block hover:text-gray-300">
                  First Time Buyers
                </Link>

                <Link href="/moving-to-boulder-colorado" className="block hover:text-gray-300">
                  Moving to Boulder
                </Link>

                <hr className="border-gray-700" />

                <Link href="/boulder-real-estate" className="block hover:text-gray-300">
                  Boulder Real Estate
                </Link>

              </div>
            )}
          </div>


          {/* CITIES */}
          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setMenu("cities")}
            onMouseLeave={closeMenu}
          >
            <span className="hover:text-gray-300">Cities</span>

            {menu === "cities" && (
              <div className="absolute top-full left-0 bg-[#1a1a1a] p-8 space-y-3 min-w-[220px] shadow-2xl border border-white/5">

                <Link href="/city/boulder" className="block hover:text-gray-300">
                  Boulder
                </Link>

                <Link href="/city/louisville" className="block hover:text-gray-300">
                  Louisville
                </Link>

                <Link href="/city/lafayette" className="block hover:text-gray-300">
                  Lafayette
                </Link>

                <Link href="/city/superior" className="block hover:text-gray-300">
                  Superior
                </Link>

                <Link href="/city/broomfield" className="block hover:text-gray-300">
                  Broomfield
                </Link>

                <Link href="/city/erie" className="block hover:text-gray-300">
                  Erie
                </Link>

                <Link href="/city/longmont" className="block hover:text-gray-300">
                  Longmont
                </Link>

              </div>
            )}
          </div>


          {/* ABOUT */}
          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setMenu("about")}
            onMouseLeave={closeMenu}
          >
            <span className="hover:text-gray-300">About</span>

            {menu === "about" && (
              <div className="absolute top-full left-0 bg-[#1a1a1a] p-8 space-y-3 min-w-[220px] shadow-2xl border border-white/5">

                <Link href="/about" className="block hover:text-gray-300">
                  About David
                </Link>

                <Link href="/construction-advantage" className="block hover:text-gray-300">
                  Construction Advantage
                </Link>

                <Link href="/success-stories" className="block hover:text-gray-300">
                  Success Stories
                </Link>

                <Link href="/pedal-group" className="block hover:text-gray-300">
                  The Pedal Group
                </Link>

                <Link href="/blog" className="block hover:text-gray-300">
                  Blog
                </Link>

              </div>
            )}
          </div>


          {/* CONTACT */}
          <Link
            href="/contact"
            className="hover:text-gray-300"
          >
            Contact
          </Link>

        </div>
      </div>
    </nav>
  );
}