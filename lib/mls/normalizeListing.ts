export function normalizeListing(listing:any) {

  return {
    mlsId: listing.ListingId,

    address: listing.StreetAddress,
    city: listing.City,
    state: listing.StateOrProvince,
    zip: listing.PostalCode,

    price: listing.ListPrice,
    beds: listing.BedroomsTotal,
    baths: listing.BathroomsTotalInteger,

    sqft: listing.LivingArea,
    lotSize: listing.LotSizeArea,
    yearBuilt: listing.YearBuilt,

    propertyType: listing.PropertyType,
    status: listing.StandardStatus,

    lat: listing.Latitude,
    lng: listing.Longitude,

    description: listing.PublicRemarks,

    photos: listing.Media?.map((p:any)=>p.MediaURL) || []
  }

}