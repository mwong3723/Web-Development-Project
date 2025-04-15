import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { startDate, endDate } = await req.json();

  // Shift to 12:00pm to avoid time zone offset
  const startDateObj = new Date(`${startDate}T12:00:00`);
  const endDateObj = new Date(`${endDate}T12:00:00`);

  // Create itinerary with default title
  const itinerary = await prisma.itinerary.create({
    data: {
      userId: user.id,
      title: "Untitled Itinerary",
      startDate: startDateObj,
      endDate: endDateObj,
    },
  });

  // Create one ItineraryDay for the startDate
  await prisma.itineraryDay.create({
    data: {
      itineraryId: itinerary.id,
      date: startDateObj,
    },
  });

  return NextResponse.json({ id: itinerary.id });
}
