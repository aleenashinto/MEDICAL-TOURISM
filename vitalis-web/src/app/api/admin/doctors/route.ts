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

    const doctors = await prisma.doctor.findMany({
      include: {
        hospital: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, data: doctors });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await verifyAuth();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await request.json();
    const newDoctor = await prisma.doctor.create({
      data: {
        name: data.name,
        specialty: data.specialty,
        qualifications: data.qualifications,
        experience: data.experience,
        hospitalId: data.hospitalId,
        isPublished: data.isPublished ?? true
      }
    });

    return NextResponse.json({ success: true, data: newDoctor });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create doctor" }, { status: 500 });
  }
}
