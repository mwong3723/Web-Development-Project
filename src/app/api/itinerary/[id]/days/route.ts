import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { eachDayOfInterval, format } from "date-fns";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const itineraryId = Number(id);

  const days = await prisma.itineraryDay.findMany({
    where: { itineraryId },
    orderBy: { date: "asc" },
  });

  return NextResponse.json(days);
}

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const itineraryId = Number(id);
  const { startDate, endDate } = await req.json();

  const itinerary = await prisma.itinerary.findUnique({
    where: { id: itineraryId },
    include: { days: true },
  });

  if (!itinerary) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const existing = itinerary.days.map((d) => format(d.date, "yyyy-MM-dd"));
  const target = eachDayOfInterval({
    start: new Date(startDate + "T00:00"),
    end: new Date(endDate + "T00:00"),
  }).map((d) => format(d, "yyyy-MM-dd"));

  const toAdd = target.filter((d) => !existing.includes(d));
  const toRemove = existing.filter((d) => !target.includes(d));

  await prisma.$transaction([
    ...toAdd.map((d) =>
      prisma.itineraryDay.create({
        data: { itineraryId, date: new Date(d + "T12:00") },
      })
    ),
    ...toRemove.map((d) =>
      prisma.itineraryDay.deleteMany({
        where: { itineraryId, date: new Date(d + "T12:00") },
      })
    ),
  ]);

  return NextResponse.json({ added: toAdd.length, removed: toRemove.length });
}
