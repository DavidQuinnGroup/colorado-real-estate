import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })
import { rateLimit } from "./rateLimiter"

const BASE_URL = process.env.MLS_GRID_BASE_URL
const TOKEN = process.env.MLS_GRID_TOKEN

if (!BASE_URL) throw new Error("Missing MLS_GRID_BASE_URL")
if (!TOKEN) throw new Error("Missing MLS_GRID_TOKEN")

export async function fetchMLSGridListings({
  skip,
  top,
  lastSync,
}: {
  skip: number
  top: number
  lastSync: string
}) {
  const url = `${BASE_URL}/Property?$top=${top}&$skip=${skip}&$filter=ModificationTimestamp gt ${lastSync}`

  console.log("🌐 MLS Request:", url)
await rateLimit()

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  })

  if (!res.ok) {
    throw new Error(`MLS API Error: ${res.status}`)
  }

  const data = await res.json()

  return data.value || []
}