import { NextRequest, NextResponse } from "next/server"

const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY 

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")
  const page = parseInt(searchParams.get("page") || "1", 10)
  const limit = parseInt(searchParams.get("limit") || "8", 10)

  if (!lat || !lon) {
    return NextResponse.json({ results: [] }, { status: 400 })
  }

  const offset = (page - 1) * limit

  // Geoapify accommodation categories
  const categories = [
    "accommodation.hotel",
    "accommodation.motel",
    "accommodation.hostel",
    "accommodation.guest_house",
    "accommodation.apartment"
  ].join(",")

  const url = `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${lon},${lat},5000&limit=${limit}&offset=${offset}&apiKey=${GEOAPIFY_API_KEY}`

  const response = await fetch(url)

  if (!response.ok) {
    return NextResponse.json({ error: "Failed to fetch accommodations" }, { status: 500 })
  }

  const data = await response.json()

  const results = data.features.map((feature: any) => ({
    name: feature.properties.name || "Unnamed",
    description: feature.properties.categories?.join(", "),
    address: feature.properties.formatted || "Unknown",
    coordinates: {
      lat: feature.properties.lat,
      lon: feature.properties.lon
    }
  }))

  return NextResponse.json({ results })
}
