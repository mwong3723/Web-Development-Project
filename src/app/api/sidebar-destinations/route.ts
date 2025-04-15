import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const apiKey = process.env.GEOAPIFY_API_KEY;

    if (!apiKey) {
      console.error("Geoapify API key not configured");
      return NextResponse.json(
        { error: "Service configuration error" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
        query
      )}&limit=10&apiKey=${apiKey}`
    );

    if (!response.ok) throw new Error("Geoapify request failed");

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Sidebar Geoapify error:", error);
    return NextResponse.json(
      { error: "Failed to fetch sidebar destinations" },
      { status: 500 }
    );
  }
}
