import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    console.error('DB Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
