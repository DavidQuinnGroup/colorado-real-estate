export default function Footer() {

  const year = new Date().getFullYear()

  return (

    <footer className="bg-[#0c0c0c] text-gray-500 text-sm py-16 px-6 mt-32">

      <div className="max-w-7xl mx-auto space-y-6 text-center">

        <p className="tracking-widest uppercase text-xs text-gray-600">
          David Quinn Group
        </p>

        <p>
          David Quinn is a real estate advisor affiliated with Compass.
          Member of The Pedal Group.
        </p>

        <p>
          Compass Colorado, LLC | All information deemed reliable but not guaranteed.
        </p>

        <p className="text-xs text-gray-600">
          Equal Housing Opportunity
        </p>

        {/* Divider */}

        <div className="border-t border-gray-800 pt-6 space-y-2">

          <p className="text-xs text-gray-600">
            © {year} David Quinn Group
          </p>

          <p className="text-xs text-gray-700">
            Designed and Created by David Atlas
          </p>

        </div>

      </div>

    </footer>

  )
}