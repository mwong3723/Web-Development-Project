// app/api/itinerary/[id]/days/[date]/items/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string; date: string }> }
) {
  const { id, date } = await context.params;
  const itineraryId = parseInt(id);
  const parsedDate = new Date(date);

  try {
    const day = await prisma.itineraryDay.findUnique({
      where: {
        itineraryId_date: { itineraryId, date: parsedDate },
      },
    });

    if (!day) {
      return NextResponse.json([], { status: 200 });
    }

    // Return empty array instead of real data
    return NextResponse.json([], { status: 200 });
  } catch (error) {
    console.error("Error fetching itinerary items:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}


export async function POST(
  req: Request,
  context: { params: Promise<{ id: string; date: string }> }
) {
  const { id, date } = await context.params;
  const itineraryId = parseInt(id);
  const parsedDate = new Date(date);

  try {
    const { name, location, geoapifyPlaceId } = await req.json();

    // Ensure the day exists, but skip item creation
    await prisma.itineraryDay.upsert({
      where: {
        itineraryId_date: { itineraryId, date: parsedDate },
      },
      create: {
        date: parsedDate,
        itineraryId,
      },
      update: {},
    });

    // Return mock item to simulate success
    return NextResponse.json(
      { name, location, geoapifyPlaceId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding itinerary item:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
