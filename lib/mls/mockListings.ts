export function generateMockListings(count = 100) {
  return Array.from({ length: count }).map((_, i) => ({
    ListingId: `MOCK-${i}`,
    UnparsedAddress: `Test Home ${i}`,
    ListPrice: Math.floor(Math.random() * 900000) + 100000,
    BedroomsTotal: Math.floor(Math.random() * 5) + 1,
    BathroomsTotal: Math.floor(Math.random() * 4) + 1,
    Latitude: 40.0 + Math.random() * 0.2,
    Longitude: -105.3 + Math.random() * 0.2,
    ModificationTimestamp: new Date().toISOString(),
  }));
}