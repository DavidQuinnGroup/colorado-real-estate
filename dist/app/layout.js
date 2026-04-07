"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
const Navbar_1 = __importDefault(require("@/components/Navbar"));
require("./globals.css");
const google_1 = require("next/font/google");
const Footer_1 = __importDefault(require("@/components/Footer"));
const RealEstateAgentSchema_1 = __importDefault(require("@/components/schema/RealEstateAgentSchema"));
// import "leaflet/dist/leaflet.css"
// import "react-leaflet-cluster/dist/assets/MarkerCluster.css"
// import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css"
const inter = (0, google_1.Inter)({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});
const playfair = (0, google_1.Playfair_Display)({
    subsets: ["latin"],
    variable: "--font-playfair",
    display: "swap",
});
exports.metadata = {
    title: {
        default: "David Quinn Group | Boulder Luxury Real Estate",
        template: "%s | David Quinn Group",
    },
    description: "Luxury real estate advisory in Boulder, Colorado. Strategic representation backed by three decades of construction expertise.",
    keywords: [
        "Boulder real estate",
        "Boulder luxury homes",
        "Boulder real estate agent",
        "Boulder County homes",
        "Louisville Colorado real estate",
        "Lafayette Colorado homes",
        "Superior Colorado real estate",
    ],
    openGraph: {
        title: "David Quinn Group | Boulder Luxury Real Estate",
        description: "Luxury real estate advisory in Boulder, Colorado with deep construction expertise.",
        url: "https://davidquinngroup.com",
        siteName: "David Quinn Group",
        locale: "en_US",
        type: "website",
    },
};
function RootLayout({ children, }) {
    return (<html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-[#111111] text-[#F5F3EE] font-sans antialiased">
        <Navbar_1.default />

    <RealEstateAgentSchema_1.default />

        <main>{children}</main>

        <Footer_1.default />
      </body>
    </html>);
}
