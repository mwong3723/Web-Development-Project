import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const placeId = request.nextUrl.searchParams.get("place_id");
  const apiKey = process.env.GEOAPIFY_API_KEY;

  if (!placeId || !apiKey) {
    return NextResponse.json({ error: "Missing place ID or API key" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.geoapify.com/v2/place-details?id=${placeId}&apiKey=${apiKey}`
    );
    const data = await res.json();
    const name = data?.features?.[0]?.properties?.formatted || "Unknown location";
    return NextResponse.json({ display_name: name });
  } catch (err) {
    console.error("Geoapify lookup failed:", err);
    return NextResponse.json({ error: "Geoapify lookup failed" }, { status: 500 });
  }
}