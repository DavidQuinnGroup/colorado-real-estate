import Navbar from "@/components/Navbar"
import "./globals.css"
import { Inter, Playfair_Display } from "next/font/google"
import Footer from "@/components/Footer"
import RealEstateAgentSchema from "@/components/schema/RealEstateAgentSchema"
// import "leaflet/dist/leaflet.css"
// import "react-leaflet-cluster/dist/assets/MarkerCluster.css"
// import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata = {
  title: {
    default: "David Quinn Group | Boulder Luxury Real Estate",
    template: "%s | David Quinn Group",
  },
  description:
    "Luxury real estate advisory in Boulder, Colorado. Strategic representation backed by three decades of construction expertise.",
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
    description:
      "Luxury real estate advisory in Boulder, Colorado with deep construction expertise.",
    url: "https://davidquinngroup.com",
    siteName: "David Quinn Group",
    locale: "en_US",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-[#111111] text-[#F5F3EE] font-sans antialiased">
        <Navbar />

<RealEstateAgentSchema />

        <main>{children}</main>

        <Footer />
      </body>
    </html>
  )
}