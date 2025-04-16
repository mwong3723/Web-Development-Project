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
      select: {
        geoapifyID: true,
        color: true,
      },
    });

    if (!day) {
      return NextResponse.json({}, { status: 200 });
    }

    return NextResponse.json(day);
  } catch (error) {
    console.error("Error fetching itinerary day info:", error);
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
  const parsedDate = new Date(date + "T12:00:00");

  try {
    const { geoapifyPlaceId, color } = await req.json();

    const day = await prisma.itineraryDay.upsert({
      where: {
        itineraryId_date: { itineraryId, date: parsedDate },
      },
      update: {
        geoapifyID: geoapifyPlaceId,
        ...(color && { color }),
      },
      create: {
        date: parsedDate,
        itineraryId,
        geoapifyID: geoapifyPlaceId,
        color: color || undefined,
      },
    });

    return NextResponse.json(
      { success: true, updatedDayId: day.id, geoapifyPlaceId, color: day.color },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating itinerary day geoapifyID:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}


