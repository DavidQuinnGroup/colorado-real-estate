import { fetchMLSListings } from "@/lib/mlsImporter"

export async function getAddresses() {

  const listings = await fetchMLSListings()

  return listings

}