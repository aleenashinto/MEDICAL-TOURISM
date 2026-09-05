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

export async function GET(request: Request) {
  try {
    const session = await verifyAuth();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const hospitals = await prisma.hospital.findMany({
      include: {
        doctors: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, data: hospitals });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch hospitals" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await verifyAuth();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await request.json();
    const newHospital = await prisma.hospital.create({
      data: {
        name: data.name,
        location: data.location,
        description: data.description,
        accreditation: data.accreditation,
        isPublished: data.isPublished ?? true
      }
    });

    return NextResponse.json({ success: true, data: newHospital });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create hospital" }, { status: 500 });
  }
}
