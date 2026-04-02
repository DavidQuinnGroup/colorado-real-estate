"use client"

export default function MapListings({
  listings,
  activeListingId,
  setActiveListingId
}: any) {
  return (
    <div className="overflow-y-auto h-full p-4 space-y-3">
      {listings.map((home: any) => (
        <div
          key={home.id}
          onMouseEnter={() => setActiveListingId(home.id)}
          onMouseLeave={() => setActiveListingId(null)}
          onClick={() => setActiveListingId(home.id)}
          className={`
            border rounded-lg p-3 cursor-pointer transition
            ${activeListingId === home.id ? "border-blue-500 shadow-lg" : ""}
          `}
        >
          <div className="font-bold">
            ${home.price.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">
            {home.address}
          </div>
        </div>
      ))}
    </div>
  )
}