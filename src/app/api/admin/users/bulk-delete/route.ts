import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Ensure the user is an admin
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const userIds = data.userIds || [];
    
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: "No user IDs provided" },
        { status: 400 }
      );
    }

    // Don't allow admins to delete themselves
    const adminId = parseInt(session.user.id);
    if (userIds.includes(adminId)) {
      return NextResponse.json(
        { error: "You cannot delete your own account" },
        { status: 400 }
      );
    }

    // Convert string IDs to integers
    const parsedIds = userIds.map((id: string | number) => parseInt(id.toString()));

    // Delete the users
    await prisma.user.deleteMany({
      where: {
        id: {
          in: parsedIds,
        },
      },
    });

    return NextResponse.json({ message: `${parsedIds.length} users deleted successfully` });
  } catch (error) {
    console.error("Error bulk deleting users:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}