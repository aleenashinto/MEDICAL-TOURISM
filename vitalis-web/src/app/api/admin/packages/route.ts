import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/session';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

async function verifyAuth() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('maides_session')?.value;
  if (!sessionCookie) return null;
  return await verifyToken(sessionCookie) as any;
}

export async function POST(request: Request) {
  try {
    const session = await verifyAuth();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await request.json();
    const newPackage = await prisma.package.create({
      data: {
        name: data.name,
        treatmentId: data.treatmentId,
        hospitalId: data.hospitalId,
        costRange: data.costRange,
        duration: data.duration,
        inclusions: data.inclusions,
        isPublished: data.isPublished ?? true
      }
    });

    return NextResponse.json({ success: true, data: newPackage });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create package" }, { status: 500 });
  }
}
