import { createClient } from "@supabase/supabase-js"
import Typesense from "typesense"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const typesense = new Typesense.Client({
  nodes: [{ host: "localhost", port: 8108, protocol: "http" }],
  apiKey: process.env.TYPESENSE_API_KEY || "xyz",
})

async function runAlerts() {
  const { data: searches } = await supabase
    .from("saved_searches")
    .select("*")

  for (const search of searches || []) {
    const filters = search.filters

    const results = await typesense
      .collections("listings")
      .documents()
      .search({
        q: "*",
        query_by: "address",
        filter_by: buildFilter(filters),
      })

    if (results.found > 0) {
      console.log(`📧 Send alert to ${search.email}`)

      // TODO: send email
    }

    await supabase
      .from("saved_searches")
      .update({ last_run: new Date().toISOString() })
      .eq("id", search.id)
  }
}

function buildFilter(filters: any) {
  let f = []

  if (filters.minPrice) f.push(`price:>=${filters.minPrice}`)
  if (filters.maxPrice) f.push(`price:<=${filters.maxPrice}`)
  if (filters.beds) f.push(`beds:>=${filters.beds}`)

  return f.join(" && ")
}

runAlerts()