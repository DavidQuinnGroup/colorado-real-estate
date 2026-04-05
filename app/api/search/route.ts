export const dynamic = "force-dynamic"

import { NextResponse } from 'next/server'
import Typesense from 'typesense'

const client = new Typesense.Client({
  nodes: [
    {
      host: process.env.TYPESENSE_HOST!,
      port: Number(process.env.TYPESENSE_PORT!),
      protocol: process.env.TYPESENSE_PROTOCOL!,
    },
  ],
  apiKey: process.env.TYPESENSE_API_KEY!,
  connectionTimeoutSeconds: 5,
})

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    const city = searchParams.get('city') || ''
    const q = searchParams.get('q') || '*'

    const searchParameters: any = {
      q,
      query_by: 'address,city,description',
      per_page: 20,
    }

    if (city) {
      searchParameters.filter_by = `city:=${city}`
    }

    const result = await client
      .collections('listings')
      .documents()
      .search(searchParameters)

    return NextResponse.json({
      hits: result.hits || [],
      count: result.found || 0,
    })
  } catch (error: any) {
    console.error('SEARCH ERROR:', error)

    return NextResponse.json(
      {
        error: error.message || 'Search failed',
      },
      { status: 500 }
    )
  }
}