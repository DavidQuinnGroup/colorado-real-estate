import { addresses, type Address } from "@/lib/addresses";

export async function getAddresses(): Promise<Address[]> {
  return addresses;
}

export { addresses };
export type { Address };

// /Users/davidquinn/david-quinn-group/colorado-real-estate/data/addresses.ts
