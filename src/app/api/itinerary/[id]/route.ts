import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const itineraryId = Number(id);

  try {
    const itinerary = await prisma.itinerary.findUnique({
      where: { id: itineraryId },
      select: {
        id: true,
        title: true,
        startDate: true,
        endDate: true,
      },
    });

    if (!itinerary) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(itinerary);
  } catch (error) {
    console.error("[Itinerary GET]", error);
    return NextResponse.json({ error: "Failed to fetch itinerary" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const itineraryId = Number(id);
  const body = await req.json();
  const { title, startDate, endDate } = body;

  if (title && typeof title !== "string") {
    return NextResponse.json({ error: "Invalid title" }, { status: 400 });
  }

  try {
    const updated = await prisma.itinerary.update({
      where: { id: itineraryId },
      data: {
        ...(title && { title }),
        ...(startDate && { startDate: new Date(startDate + "T12:00:00") }),
        ...(endDate && { endDate: new Date(endDate + "T12:00:00") }),
      },
      select: { id: true, title: true, startDate: true, endDate: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[Itinerary PATCH]", error);
    return NextResponse.json({ error: "Failed to update itinerary" }, { status: 500 });
  }
}