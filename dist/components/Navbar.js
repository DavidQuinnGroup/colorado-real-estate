"use client";
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Navbar;
const link_1 = __importDefault(require("next/link"));
const react_1 = require("react");
function Navbar() {
    const [menu, setMenu] = (0, react_1.useState)(null);
    const closeMenu = () => setMenu(null);
    return (<nav className="fixed top-0 left-0 w-full z-50 bg-[#111111]/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-10 py-6 flex justify-between items-center">

        {/* BRAND */}
        <div className="flex flex-col leading-tight">
          <link_1.default href="/" className="text-sm tracking-[0.35em] uppercase hover:text-gray-300">
            David Quinn Group
          </link_1.default>

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
          <div className="relative cursor-pointer" onMouseEnter={() => setMenu("properties")} onMouseLeave={closeMenu}>
            <span className="hover:text-gray-300">Properties</span>

            {menu === "properties" && (<div className="absolute top-full left-0 bg-[#1a1a1a] p-8 space-y-3 min-w-[220px] shadow-2xl border border-white/5">

                <link_1.default href="/properties" className="block hover:text-gray-300">
                  View Properties
                </link_1.default>

                <link_1.default href="/boulder-homes-for-sale" className="block hover:text-gray-300">
                  Boulder Homes For Sale
                </link_1.default>

              </div>)}
          </div>


          {/* BUY & SELL */}
          <div className="relative cursor-pointer" onMouseEnter={() => setMenu("buy")} onMouseLeave={closeMenu}>
            <span className="hover:text-gray-300">Buy & Sell</span>

            {menu === "buy" && (<div className="absolute top-full left-0 bg-[#1a1a1a] p-8 space-y-3 min-w-[240px] shadow-2xl border border-white/5">

                <link_1.default href="/sellers-hub" className="block hover:text-gray-300">
                  Sellers Hub
                </link_1.default>

                <link_1.default href="/home-value" className="block hover:text-gray-300">
                  What's My Home Worth
                </link_1.default>

                <hr className="border-gray-700"/>

                <link_1.default href="/first-time-home-buyer-boulder" className="block hover:text-gray-300">
                  First Time Buyers
                </link_1.default>

                <link_1.default href="/moving-to-boulder-colorado" className="block hover:text-gray-300">
                  Moving to Boulder
                </link_1.default>

                <hr className="border-gray-700"/>

                <link_1.default href="/boulder-real-estate" className="block hover:text-gray-300">
                  Boulder Real Estate
                </link_1.default>

              </div>)}
          </div>


          {/* CITIES */}
          <div className="relative cursor-pointer" onMouseEnter={() => setMenu("cities")} onMouseLeave={closeMenu}>
            <span className="hover:text-gray-300">Cities</span>

            {menu === "cities" && (<div className="absolute top-full left-0 bg-[#1a1a1a] p-8 space-y-3 min-w-[220px] shadow-2xl border border-white/5">

                <link_1.default href="/city/boulder" className="block hover:text-gray-300">
                  Boulder
                </link_1.default>

                <link_1.default href="/city/louisville" className="block hover:text-gray-300">
                  Louisville
                </link_1.default>

                <link_1.default href="/city/lafayette" className="block hover:text-gray-300">
                  Lafayette
                </link_1.default>

                <link_1.default href="/city/superior" className="block hover:text-gray-300">
                  Superior
                </link_1.default>

                <link_1.default href="/city/broomfield" className="block hover:text-gray-300">
                  Broomfield
                </link_1.default>

                <link_1.default href="/city/erie" className="block hover:text-gray-300">
                  Erie
                </link_1.default>

                <link_1.default href="/city/longmont" className="block hover:text-gray-300">
                  Longmont
                </link_1.default>

              </div>)}
          </div>


          {/* ABOUT */}
          <div className="relative cursor-pointer" onMouseEnter={() => setMenu("about")} onMouseLeave={closeMenu}>
            <span className="hover:text-gray-300">About</span>

            {menu === "about" && (<div className="absolute top-full left-0 bg-[#1a1a1a] p-8 space-y-3 min-w-[220px] shadow-2xl border border-white/5">

                <link_1.default href="/about" className="block hover:text-gray-300">
                  About David
                </link_1.default>

                <link_1.default href="/construction-advantage" className="block hover:text-gray-300">
                  Construction Advantage
                </link_1.default>

                <link_1.default href="/success-stories" className="block hover:text-gray-300">
                  Success Stories
                </link_1.default>

                <link_1.default href="/pedal-group" className="block hover:text-gray-300">
                  The Pedal Group
                </link_1.default>

                <link_1.default href="/blog" className="block hover:text-gray-300">
                  Blog
                </link_1.default>

              </div>)}
          </div>


          {/* CONTACT */}
          <link_1.default href="/contact" className="hover:text-gray-300">
            Contact
          </link_1.default>

        </div>
      </div>
    </nav>);
}
